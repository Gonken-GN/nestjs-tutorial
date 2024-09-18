# Contanct API Spec

## Create Contact

Endpoint: POST /api/contacts

Headers:

- Authorization: token

Response Body:

```json
{
  "data": {
    "id": 1,
    "first_name": "fadhil anugerah",
    "last_name": "ardiwilaga",
    "email": "fadhilanugrah@example.com",
    "phone": "0283283"
  }
}
```

## Get Contact

Endpoiint: GET /api/contacts/:contactId

Headers:

- Authorization: token

Response Body:

```json
{
  "data": {
    "id": 1,
    "first_name": "fadhil anugerah",
    "last_name": "ardiwilaga",
    "email": "fadhilanugrah@example.com",
    "phone": "0283283"
  }
}
```

## Update Contact

Endpoiint: PUT /api/contacts/:contactId

Headers:

- Authorization: token

Request Body:

```json
{
  "first_name": "fadhil anugerah",
  "last_name": "ardiwilaga",
  "email": "fadhilanugrah@example.com",
  "phone": "0283283"
}
```

Response Body:

```json
{
  "data": {
    "id": 1,
    "first_name": "fadhil anugerah",
    "last_name": "ardiwilaga",
    "email": "fadhilanugrah@example.com",
    "phone": "0283283"
  }
}
```

## Remove Contact

Endpoiint: DELETE /api/contacts/:contactId

Headers:

- Authorization: token

Response Body:

```json
{
  "data": true
}
```

## Search Contact

Endpoiint: GET /api/contacts

Headers:

- Authorization: token

Query Params:

- name: string, contact first_name or contact last_name, optional
- phone: string, contact phone, optional
- email: string, contact, email, optional
- page: number, default 1
- size: number, default 10

Response Body:

```json
{
  "data": [
    {
      "id": 1,
      "first_name": "fadhil anugerah",
      "last_name": "ardiwilaga",
      "email": "fadhilanugrah@example.com",
      "phone": "0283283"
    },
    {
      "id": 2,
      "first_name": "fadhil anugerah",
      "last_name": "ardiwilaga",
      "email": "fadhilanugrah@example.com",
      "phone": "0283283"
    }
  ],
  "paging": {
    "current_page": 1,
    "total_page": 10,
    "size": 10
  }
}
```
