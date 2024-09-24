import { mockRedisClient } from './mock/redis';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { TestModule } from './test.module';
import { RedisService } from '../src/common/redis.service';

describe('Redis', () => {
  let app: INestApplication;
  let redisService: RedisService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
      providers: [
        RedisService,
        {
          provide: 'REDIS_CLIENT',
          useValue: mockRedisClient,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    redisService = app.get(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mockRedisClient.disconnect();
  });

  describe('SET redis', () => {
    it('should be able to set key and value', async () => {
      await redisService.set('key', 'value');

      expect(mockRedisClient.set).toHaveBeenCalledWith('key', 'value');
    });

    it('should be able to set key, value and ttl', async () => {
      await redisService.set('key', 'value', 10);

      expect(mockRedisClient.set).toHaveBeenCalledWith(
        'key',
        'value',
        'EX',
        10,
      );
    });
  });
});
