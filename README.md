# Fake JSON Server with Custom Login

A JSON server with custom authentication routes built on top of json-server.

## Features

- 🔐 Custom login and registration endpoints
- 🔑 JWT token authentication
- 📊 Sample data with users, posts, and comments
- 🛡️ Password hashing with bcrypt
- 🚀 Easy to use and extend

## Installation

```bash
# Install dependencies
npm install
# or
pnpm install
```

## Usage

```bash
# Start the server
npm start

# Start with auto-reload (development)
npm run dev
```

The server will run on `http://localhost:3000`

## API Endpoints

### Authentication Routes

#### POST /login

Login with username and password.

**Request:**

```json
{
  "username": "admin",
  "password": "123123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "name": "Admin User",
    "role": "admin"
  }
}
```

#### POST /register

Register a new user.

**Request:**

```json
{
  "username": "newuser",
  "password": "newpassword123",
  "name": "New User"
}
```

#### GET /auth/profile

Get user profile (requires authentication).

**Headers:**

```sh
Authorization: Bearer <your-jwt-token>
```

### Data Routes

All standard json-server routes are available under `/api`:

- `GET /api/users` - Get all users
- `GET /api/posts` - Get all posts
- `GET /api/comments` - Get all comments
- `POST /api/posts` - Create a new post
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post

## Test Credentials

```sh
Username: admin
Password: 123123

Username: user
Password: 123123
```

## Authentication

To access protected routes, include the JWT token in the Authorization header:

```sh
Authorization: Bearer <your-jwt-token>
```

## Example Usage

```bash
# Login
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "123123"}'

# Get profile (replace TOKEN with actual token)
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer TOKEN"

# Get posts
curl -X GET http://localhost:3000/api/posts
```

## Configuration

- __JWT_SECRET__: Set environment variable for production use
- **PORT**: Server port (default: 3000)

```bash
JWT_SECRET=your-super-secret-key PORT=4000 npm start
```
