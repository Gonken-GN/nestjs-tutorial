import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UpdateUserRequest,
  UserResponse,
} from '../model/user.model';
import { Logger } from 'winston';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { User } from '@prisma/client';
import { RedisService } from '../common/redis.service';

@Injectable()
export class UserService {
  constructor(
    private readonly validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
  ) {}
  private readonly USER_CACHE_TTL = 60 * 60; // 1 hour

  // Register user
  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.debug(`Registering user ${JSON.stringify(request)}`);

    const registerRequest: RegisterUserRequest =
      this.validationService.validate(UserValidation.REGISTER, request);

    const totalUserWithSameUsername = await this.prismaService.user.count({
      where: {
        username: registerRequest.username,
      },
    });

    if (totalUserWithSameUsername > 0) {
      throw new HttpException('Username already exists', 400);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await this.prismaService.user.create({
      data: registerRequest,
    });
    return {
      username: user.username,
      name: user.name,
    };
  }

  // Login user
  async login(request: LoginUserRequest): Promise<UserResponse> {
    this.logger.info(`UserService.login ${JSON.stringify(request)}`);

    const loginRequest: LoginUserRequest = this.validationService.validate(
      UserValidation.LOGIN,
      request,
    );

    let user = await this.prismaService.user.findUnique({
      where: {
        username: loginRequest.username,
      },
    });
    if (!user) {
      throw new HttpException('Invalid username or password', 400);
    }

    const isPasswordValid = bcrypt.compare(
      loginRequest.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Invalid username or password', 400);
    }

    user = await this.prismaService.user.update({
      where: {
        username: loginRequest.username,
      },
      data: {
        token: uuid(),
      },
    });
    return {
      username: user.username,
      name: user.name,
      token: user.token,
    };
  }

  async get(user: User): Promise<UserResponse> {
    const cacheKey = `user:${user.username}`;

    // Try to get the user data from Redis cache
    const cachedUser = await this.redisService.get<UserResponse>(cacheKey);

    if (cachedUser) {
      console.log('=========cachedUser===========', cachedUser);
      return cachedUser;
    }

    // If not cached, prepare the user response
    const userResponse: UserResponse = {
      username: user.username,
      name: user.name,
    };

    // Log what is being cached
    console.log('=========userResponse to be cached===========', userResponse);

    // Ensure that the response is serialized correctly before caching
    const serializedResponse = JSON.stringify(userResponse);

    // Cache the response in Redis for future requests
    await this.redisService.set(
      cacheKey,
      serializedResponse,
      this.USER_CACHE_TTL,
    );

    return userResponse;
  }

  async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
    this.logger.debug(`UserService.update ${JSON.stringify(request)}`);

    const updateRequest: UpdateUserRequest = this.validationService.validate(
      UserValidation.UPDATE,
      request,
    );

    if (updateRequest.name) {
      user.name = updateRequest.name;
    }
    if (updateRequest.password) {
      user.password = await bcrypt.hash(updateRequest.password, 10);
    }

    const result = await this.prismaService.user.update({
      where: {
        username: user.username,
      },
      data: user,
    });

    await this.redisService.delete(`user:${user.username}`);
    return {
      name: result.name,
      username: result.username,
    };
  }

  async logout(user: User): Promise<UserResponse> {
    const result = await this.prismaService.user.update({
      where: {
        username: user.username,
      },
      data: {
        token: null,
      },
    });

    return {
      username: result.username,
      name: result.name,
    };
  }
}
