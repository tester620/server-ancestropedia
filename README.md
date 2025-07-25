# AncestroPedia - Backend Server

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge\&logo=nodedotjs\&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge\&logo=express\&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge\&logo=mongodb\&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge\&logo=redis\&logoColor=white)
![Passport.js](https://img.shields.io/badge/Passport-34E27A?style=for-the-badge\&logo=passport\&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge\&logo=JSON%20web%20tokens\&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-02042B?style=for-the-badge\&logo=razorpay\&logoColor=00C3FF)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge\&logo=cloudinary\&logoColor=white)

This is the backend se

This is the backend server for **AncestroPedia**, a Family Tree Application. Built using **Node.js**, **Express**, **MongoDB**, and **Redis**, the backend handles user authentication, family tree management, order tracking, notifications, reports, and more.

---

## 🗂️ Project Structure

```bash
src/
├── config/              # Configurations for Redis, Passport, Logger, etc.
├── controllers/         # All controllers (admin and user)
├── middleware/          # Authentication and other middlewares
├── models/              # MongoDB schema definitions (Mongoose models)
├── routes/              # All route files (admin and user)
├── utils/               # Utility functions (DB, helper, token)
├── index.js             # Main application entry point
```

---

## 📦 Tech Stack

| Technology      | Description                       |
| --------------- | --------------------------------- |
| **Node.js**     | JavaScript runtime environment    |
| **Express.js**  | Fast, unopinionated web framework |
| **MongoDB**     | NoSQL database                    |
| **Redis**       | In-memory cache                   |
| **JWT**         | Authentication using tokens       |
| **Passport.js** | User authentication strategies    |
| **Razorpay**    | Payment gateway integration       |
| **Cloudinary**  | Video upload & media management   |
| **ImageKit**    | Image upload and CDN              |
| **Winston**     | Logging framework                 |

---

## 📁 Key Directories & Files

### `config/`

* Passport, Redis, Razorpay, Logger, ImageKit setup

### `controllers/`

* Handles requests & business logic

### `models/`

* Mongoose schemas (user, tree, relations, etc.)

### `routes/`

* API route definitions with middleware protection

### `middleware/`

* JWT-based route guards (`auth.middleware.js`)

### `utils/`

* Database connection, token handling, and helpers

---

## 🔐 Authentication

* JWT tokens issued on login
* Secure protected routes using `protectRoute` middleware
* Passport strategies used for local and possible social login

---

## 🛍️ API Reference

### 👤 Auth APIs

| Method | Endpoint                | Description               |
| ------ | ----------------------- | ------------------------- |
| POST   | `/auth/register`        | Register a new user       |
| POST   | `/auth/login`           | Login user                |
| POST   | `/auth/logout`          | Logout user               |
| POST   | `/auth/verifyMailToken` | Verify email token        |
| POST   | `/auth/mail/reset-pass` | Send password reset email |
| POST   | `/auth/reset-pass`      | Reset password            |
| POST   | `/auth/verifyPassToken` | Verify password token     |
| PUT    | `/auth/update-pass`     | Update user password      |
| GET    | `/auth/google`          | Google OAuth login        |

### 📬 User Interaction

| Method | Endpoint   | Description                |
| ------ | ---------- | -------------------------- |
| POST   | `/submit`  | Submit support or feedback |
| GET    | `/feed`    | Fetch general feed         |
| GET    | `/reports` | Fetch general reports      |
| PUT    | `/abort`   | Abort an active operation  |

### 📝 Post Management

| Method | Endpoint      | Description        |
| ------ | ------------- | ------------------ |
| GET    | `/myPosts`    | Get user's posts   |
| POST   | `/create`     | Create a new post  |
| PUT    | `/edit/:id`   | Edit a post        |
| DELETE | `/delete/:id` | Delete a post      |
| POST   | `/bulk`       | Bulk create posts  |
| POST   | `/addPosts`   | Add multiple posts |

### 🌳 Family Tree APIs

| Method | Endpoint         | Description                    |
| ------ | ---------------- | ------------------------------ |
| GET    | `/getMyData`     | Get user profile + tree data   |
| GET    | `/myTreeOrders`  | View family tree order history |
| GET    | `/myDnaOrders`   | View DNA test orders           |
| GET    | `/getRequests`   | Get incoming tree requests     |
| POST   | `/sendRequest`   | Send a family link request     |
| GET    | `/myTree`        | Get user’s family tree         |
| POST   | `/create`        | Create a new tree              |
| PUT    | `/update`        | Update tree info               |
| DELETE | `/create/owner`  | Delete tree owner              |
| PUT    | `/person/create` | Create/edit person node        |
| POST   | `/addMember`     | Add new member to tree         |

### 📁 Folder & File APIs

| Method | Endpoint          | Description                 |
| ------ | ----------------- | --------------------------- |
| POST   | `/createInFolder` | Create data inside a folder |
| GET    | `/data?folderId`  | Get folder data by ID       |
| GET    | `/myFolders`      | Get all user folders        |
| PUT    | `/updateFolder`   | Update folder metadata      |
| DELETE | `/remove`         | Delete folder or file       |
| PATCH  | `/remove?postIds` | Delete multiple posts       |

### 📨 Notifications & Messages

| Method | Endpoint          | Description                |
| ------ | ----------------- | -------------------------- |
| GET    | `/fetch`          | Fetch latest notifications |
| PUT    | `/markRead`       | Mark one notification read |
| PUT    | `/markAllRead`    | Mark all as read           |
| GET    | `/message`        | Get latest message         |
| GET    | `/getAllMessages` | Get all messages           |

### 🧾 Address Book

| Method | Endpoint       | Description         |
| ------ | -------------- | ------------------- |
| POST   | `/add`         | Add address         |
| GET    | `/myAddresses` | Get saved addresses |
| PUT    | `/update`      | Update address      |
| DELETE | `/remove`      | Delete address      |

### 🧠 Reports

| Method | Endpoint          | Description          |
| ------ | ----------------- | -------------------- |
| GET    | `/allReports`     | Get all reports      |
| GET    | `/specificReport` | Get report by ID     |
| GET    | `/pending`        | Get pending reports  |
| POST   | `/reviewReport`   | Submit report review |

### 📰 Blog APIs

| Method | Endpoint        | Description       |
| ------ | --------------- | ----------------- |
| POST   | `/createBlog`   | Create a blog     |
| PUT    | `/update`       | Update blog       |
| GET    | `/myBlogs`      | Get user blogs    |
| GET    | `/specificBlog` | Get specific blog |
| DELETE | `/remove`       | Delete a blog     |

### 🔧 Utility APIs

| Method | Endpoint   | Description           |
| ------ | ---------- | --------------------- |
| GET    | `/ping`    | Health check          |
| GET    | `/imeuswe` | Misc/diagnostic check |

---

## 🚀 Getting Started

### Requirements

* Node.js >= 16
* MongoDB
* Redis
* Cloudinary/ImageKit credentials

### Install & Setup

```bash
git clone https://github.com/DheerajVerma945/server-ancestropedia.git
cd ancestropedia-backend
npm install
```

### Environment Variables

Create `.env` from the sample:

```bash
cp .env.example .env
```

Update with:

* `MONGO_URI`
* `REDIS_URL`
* `JWT_SECRET`
* `RAZORPAY_KEY`, `RAZORPAY_SECRET`
* `CLOUDINARY_*` / `IMAGEKIT_*`

### Start Server

```bash
npm start
```

Server will run at: `http://localhost:7777`

---

## 🐳 Docker Support

Launch project with Docker:

```bash
docker-compose up --build
```

It sets up Node, Redis, and optionally MongoDB (if configured).

---

## 🧪 API Testing

* Use [Postman](https://www.postman.com/) or [Thunder Client](https://www.thunderclient.com/)
* Add `Authorization: Bearer <token>` header for protected routes

---

## ✅ Features

* 👤 User Authentication
* 🌳 Family Tree (up to 7+ generations)
* 💳 Razorpay payments
* 🔗 Family link requests & approval
* 📂 Folder & multimedia uploads
* 📢 Notifications system
* 🚼 Admin tools & token management
* 🛠️ Well-structured modular code

---

## 📌 Contribution Guide

* Fork the repository
* Create a new branch
* Commit and push your changes
* Open a pull request

---

## 🧠 Author

Made with ❤️ by [**Ancestropedia Team**](https://ancestropedia.online)

---

## 📄 License

This project is licensed under the **MIT License**.
