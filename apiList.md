# 📚 API Reference – E-Commerce Backend

This document lists all available API endpoints for the e-commerce backend.

---

## 🔐 Auth Routes

| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| POST   | /api/auth/signup | Register a new user |
| POST   | /api/auth/login  | Authenticate user   |
| POST   | /api/auth/logout | Logout user         | 

---
## 👤 Profile Routes

| Method | Endpoint                  | Description                      |
|--------|---------------------------|----------------------------------|
| GET    | /api/user/profile         | Get logged-in user profile       |
| PATCH  | /api/user/profile/update  | Update user profile (partial)    |

---


## 🏠 Address Routes

| Method | Endpoint             | Description                     |
|--------|----------------------|---------------------------------|
| POST   | /api/address/add     | Add new address                 |
| GET    | /api/address         | Get all user addresses          |
| GET    | /api/address/:id     | Get single address (owned only) |
| PATCH  | /api/address/:id     | Update address (owned only)     |
| DELETE | /api/address/:id     | Delete address (owned only)     |

---

## 📦 Product Routes

| Method | Endpoint                        | Description             |
| ------ | ------------------------------- | ----------------------- |
| POST   | /api/products/add               | Add new product (Admin) |
| DELETE | /api/products/remove/:productId | Delete a product (Admin)        |
| GET    | /api/products/:id               | Get product by ID       |
| GET    | /api/products/list              | Get all products        |
| GET    | /api/products/home              | Get home page products        |
| GET    | /api/products/related-product/:productId             | Get related products        |

---

## 🛒 Cart Routes

| Method | Endpoint                    | Description             |
| ------ | --------------------------- | ----------------------- |
| POST   | /api/cart/add               | Add item to cart        |
| POST   | /api/cart/update/:productId | Update item quantity    |
| DELETE | /api/cart/remove/:productId | Remove item from cart   |
| GET    | /api/cart/                  | Get current user's cart |

---

## 📦 Order Routes
 
| Method | Endpoint                   | Description                 |
| ------ | -------------------------- | --------------------------- |
| POST   | /api/order                 | Create a new order          |
| GET    | /api/order/user-orders     | Get logged-in user's orders |
| GET    | /api/order/:orderId        | Get order by ID             |
| PATCH  | /api/order/:orderId/status | Update order status (Admin) |
| PATCH  | /api/order/:orderId/cancel | Cancel an order             |
| GET    | /api/order/all-orders      | Get all orders (Admin)      |

---
