# Steps to run the project : 

create a .env file with these details : 

```
PORT=5000
POSTGRES_URL=****
JWT_TOKEN_SECRET=***
```

`Note` : I am using vercel postgreSQL hosted database.

### Table queries: 

```
CREATE TABLE USERS (
    id varchar(255),
    name varchar(255),
    email varchar(255),
    password varchar(255)
)

CREATE TYPE ticket_status AS ENUM('open','closed');
CREATE TYPE ticket_priority AS ENUM('low','medium','high');

CREATE TABLE TICKETS (
    ticket_id varchar(255),
    title varchar(255),
    description text,
    type varchar(255),
    venue varchar(255),
    status ticket_status,
    priority ticket_priority,
    due_date text,
    created_by varchar(255),
    assigned_users varchar[]
)
```

### Run the project with 

```
npm i 
```

```
node index.js or nodemon index.js
```


## APIs

## Register a user

```
curl --location 'http://localhost:5000/users' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name":"sagar",
    "email":"sagar@gmail.com",
    "password":"W@r2n3nfd"
}'
```

## user login

```
curl --location 'http://localhost:5000/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email":"sagar@gmail.com",
    "password":"W@r2n3nfd"
}'
```

## Create a new ticket

```
curl --location 'http://localhost:5000/tickets' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhZ2FyQGdtYWlsLmNvbSIsInVzZXJfaWQiOiIyYTAxMTBkMC01NzExLTQ2NDgtOWVkYi1jZjk5MDVjNjdkOGQiLCJpYXQiOjE3MjE5OTk1MjMsImV4cCI6MTcyMjg2MzUyM30.dT6jH4T9icYI4qsoKO0ntPBdKo9n1xRQU_Ub7JcoS-U' \
--header 'Content-Type: application/json' \
--data '{
    "title": "Ticket Title",
    "description": "Ticket Description",
    "type": "concert", 
    "venue": "Venue Name",
    "status": "open", 
    "priority": "high", 
    "dueDate": "2024-08-01T18:00:00Z",
    "createdBy": "2a0110d0-5711-4648-9edb-cf9905c67d8d"
}'
```

## Assign user to a task 

```
curl --location 'http://localhost:5000/tickets/5971cdc6-0d1c-475f-95e5-a59691e175dd/assign' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhZ2FyQGdtYWlsLmNvbSIsInVzZXJfaWQiOiIyYTAxMTBkMC01NzExLTQ2NDgtOWVkYi1jZjk5MDVjNjdkOGQiLCJpYXQiOjE3MjE5OTk1MjMsImV4cCI6MTcyMjg2MzUyM30.dT6jH4T9icYI4qsoKO0ntPBdKo9n1xRQU_Ub7JcoS-U' \
--header 'Content-Type: application/json' \
--data '{
    "user_id":"2a0110d0-5711-4648-9edb-cf9905c67d8d"
}'
```
