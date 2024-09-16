# User API Spec

## Register User

Endpoint: POST /api/users

Request Body:

```json
{
  "username": "fadhil",
  "password": "rahasia",
  "name": "fadhil anugrah"
}
```

Response Body (Success):

```json
{
  "data": {
    "username": "fadhil",
    "name": "fadhil anugrah"
  }
}
```

Response Body (Failed):

```json
{
  "errors": "username already registered"
}
```

## Login User

Endpoint: POST /api/users/login

Request Body:

```json
{
  "username": "fadhil",
  "password": "rahasia"
}
```

Response Body (Success):

```json
{
  "data": {
    "username": "fadhil",
    "name": "fadhil anugrah",
    "token": "session_id_generated"
  }
}
```

Response Body (Failed):

```json
{
  "errors": "username or password is wrong"
}
```

## Get User

Endpoint: GET /api/users/current

Headers:

- authorization: token

Response Body (Success):

```json
{
  "data": {
    "username": "fadhil",
    "name": "fadhil anugrah"
  }
}
```

Response Body (Failed):

```json
{
  "errors": "Unauthorized"
}
```

## Update User

Endpoint: PATCH /api/users/current

Headers :

- Authorization: token

Request Body:

```json
{
  "password": "rahasia", // optional, if want to change password
  "name": "fadhil anugrah" //optional, if want to change name
}
```

Response Body (Success):

```json
{
  "data": {
    "username": "fadhil",
    "name": "fadhil anugrah"
  }
}
```

## Logout User

Endpoint: DELETE /api/users/current

Headers :

- Authorization: token

Response Body (Success):

```json
{
  "data": true
}
```
