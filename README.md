# Instagram Backend (Node.js + Express + MongoDB)

## Overview

A RESTful backend for an Instagram-like application.  
Includes authentication, posts, likes, comments, and follow system.

## Features

- JWT Authentication
- Create and fetch posts
- Like / Unlike posts
- Comment system
- Follow / Unfollow users
- User profile management
- Feed API

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose

## Project Structure

```
src/
  ├── config/
  │   ├── db.js
  │
  ├── controllers/
  │   ├── auth.controller.js
  │   ├── post.controller.js
  │   ├── feed.controller.js
  │   └── user.controller.js
  │
  ├── middlewares/
  │   ├── auth.middleware.js
  │   └── role.middleware.js
  │
  ├── models/
  │   ├── user.model.js
  │   └── post.model.js
  │
  ├── routes/
  │   ├── auth.routes.js
  │   ├── post.routes.js
  │   ├── feed.routes.js
  │   └── user.routes.js
  │
  ├── services/
  │   └── storage.service.js
  │
  ├── app.js
  └── server.js
```

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (`.env` file)
4. Start the server: `npx nodemon server.js`

## Status

Version 1. Core features implemented. Further improvements planned.

## License

This project is for educational purposes.

## How to Use

Use tools like Postman to make API requests. All endpoints require JWT authentication (except auth routes).

## Author

- Naman Roy
