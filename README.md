# AncestroPedia - Backend Server

This is the backend server for **AncestroPedia**, a Family Tree Application. Built using **Node.js**, **Express**, **MongoDB**, and **Redis**, the backend handles user authentication, family tree management, order tracking, notifications, reports, and more.

---

## 🗂️ Project Structure

```
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

* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Cache:** Redis
* **Authentication:** JWT & Passport.js
* **File Uploads:** Image upload (via `imagekit.js`) && Video upload (via `cloudinary`)
* **Logging:** Winston (configured in `logger.js`)
* **Payment Integration:** Razorpay (in `razorpay.js`)

---

## 📁 Important Files and Folders

### `config/`

* `passport.js`: Passport strategies.
* `redis.js`: Redis configuration.
* `razorpay.js`: Razorpay payment setup.
* `logger.js`: Logging configuration.
* `imagekit.js`: Image upload integration.

### `controllers/`

* All logic for handling requests.
* `admin/`: Controllers for admin-only functionality (blog, token, support, etc.)
* `tree.controller.js`: Core logic for family tree operations.

### `models/`

* MongoDB schemas using Mongoose.
* Models like `user`, `person`, `tree`, `marriage`, `request`, etc.

### `routes/`

* All API routes grouped by feature and role (admin/user).
* Protected routes use middleware for access control.

### `middleware/`

* `auth.middleware.js`: Protect routes using JWT verification.

### `utils/`

* `db.js`: MongoDB connection setup.
* `helper.js`: Utility functions.
* `token.js`: JWT helper functions.

---

## 🔐 Authentication

* JWT-based authentication via Passport.js.
* `protectRoute` middleware used for protected routes.

---

## 🛍️ API Endpoints

| Method | Endpoint                 | Description                              |
| ------ | ------------------------ | ---------------------------------------- |
| GET    | `/api/ping`              | Health check                             |
| POST   | `/api/auth/*`            | Auth-related (login, register, etc.)     |
| GET    | `/api/user/tree`         | Get user's tree (protected)              |
| POST   | `/api/user/tree`         | Add to tree                              |
| GET    | `/api/user/order`        | Order history (DNA test, wall art, etc.) |
| POST   | `/api/user/request`      | Send family relation request             |
| POST   | `/api/report`            | Report issues                            |
| POST   | `/api/support`           | Support/contact APIs                     |
| GET    | `/api/user/notification` | Get user notifications                   |
| POST   | `/api/user/address`      | Manage addresses                         |
| All    | `/api/admin/*`           | Admin routes                             |

---

## 🚀 Getting Started

### Prerequisites

* Node.js >= 16
* MongoDB instance
* Redis server
* `.env` configuration

### Installation

```bash
git clone https://github.com/DheerajVerma945/server-ancestropedia.git
cd ancestropedia-backend
npm install
```

### Environment Setup

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Update your credentials for:

* MongoDB
* Redis
* JWT\_SECRET
* Razorpay keys
* Cloudinary/ImageKit/etc.

### Running the Server

```bash
npm start
```

By default, the server runs on `http://localhost:7777`.

---

## 🐳 Docker Support

You can run the app in a container:

```bash
docker-compose up --build
```

This will set up both the Node server and any dependencies (like Redis, MongoDB if configured).

---

## 🧪 Testing Endpoints

You can use Postman or Thunder Client to test APIs. Use the bearer token from the login endpoint for protected routes.

---

## ✅ Features Overview

* 👤 User Management & JWT Auth
* 🌳 Family Tree (7+ Generations)
* 💳 Razorpay Payments (DNA kits, wall art)
* 🔗 Relationship Requests & Verification
* 📂 Folder & Document Management
* 🛏 Notifications & Events (via Redis)
* 📟 Admin Tools (blog, reports, tokens)
* 🛠️ Modular Code & Scalable Architecture

---

## 📌 Contributions

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 🧠 Author

Made with ❤️ by \[Ancestropedia]

---

