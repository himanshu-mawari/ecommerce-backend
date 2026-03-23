# 🛒 E-Commerce Backend API

A RESTful backend for an e-commerce application built with Node.js, Express, and MongoDB.
It handles authentication, product management, cart operations, and order processing.

---

## 🚀 Features

* User Authentication (Signup, Login, Logout)
* Product Management (Add, Delete, View, List)
* Cart Management (Add, Update Quantity, Remove, Get Cart)
* Order Management (Create Order, View Orders, Cancel Order, Admin Controls)

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

---

## 📁 API Documentation

Full API reference is available in:

👉 [apiList.md](./apiList.md)

---

## ⚙️ Installation & Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/your-username/ecommerce-backend.git
   cd ecommerce-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the server**

   ```bash
   npm run dev
   ```

Server will start at: 👉 http://localhost:5000
(by default)

---
## 📌 Environment Variables

Create a `.env` file and add:

```env id="kqk1mz"
PORT=2006

MONGO_URI=

CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=

JWT_SECRET=

```
