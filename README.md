# Instagram Clone

A minimal full-stack Instagram clone with modern APIs and clean architecture.

## Features

- Authentication (Register / Login)
- RBAC (Role-Based Access Control)
- User Profile (Get / Update / Delete)
- Follow / Unfollow Users
- Post Creation
- Like & Comment System
- Secure APIs with JWT

## Tech Stack

**Frontend**

- HTML, CSS, JavaScript, React

**Backend**

- Node.js
- Express.js
- MongoDB (Mongoose)

## Setup

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm start
```

## Environment Variables

```
PORT=3000
MONGODB_URI=your_uri
JWT_SECRET=your_secret
IMAGEKIT_PUBLIC_KEY=your_key
IMAGEKIT_PRIVATE_KEY=your_key
IMAGEKIT_URL_ENDPOINT=your_url
```

---

## API Overview

- Auth: register, login, logout, delete account
- User: get, update, follow, unfollow
- Feed: Get All Posts, Like, Unlike, Comment
- Posts: create post, delete post

## Author

Naman Roy
