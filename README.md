# Forever — Backend

REST API for Forever, a full-stack e-commerce platform with a consumer storefront and admin panel.

## Features
- JWT-based authentication with httpOnly cookies
- Role-based access control for customers and admins
- Product catalog and admin CRUD operations
- Cart, wishlist, address, and order management
- Paginated and filterable product/order listings
- Cloudinary-based image upload and management
- Admin dashboard with aggregated sales and order metrics
- Cash on Delivery order flow

## Tech Stack

- Node.js
- Express.js
- MongoDB / Mongoose
- JWT
- Cloudinary
- Multer
- Bcrypt

## Architecture

```text
Client → Express API → Controllers/Services → Mongoose → MongoDB
```

```text
Client → Multer (memory storage) → Buffer → Cloudinary → Image URL → MongoDB
```

## Authentication

```text
Login → Validate credentials → Generate JWT → Set httpOnly cookie

Protected request → Auth middleware → Verify JWT → Attach user
Admin request → Auth middleware → Admin middleware → Check role
```

## Key Design Notes

- Product and order listings use MongoDB's `$facet` aggregation to return paginated results and total counts in a single query.
- The admin dashboard controller runs independent aggregation queries concurrently via `Promise.all`.
- Search inputs are escaped before use in MongoDB regex queries to prevent regex injection.
## Environment Variables

```env
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGODB_URI=<mongodb-url>
JWT_SECRET=<jwt-secret>
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
```

In production, `NODE_ENV=production` enables secure cross-origin cookie settings and restricts CORS to `FRONTEND_URL`.
## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

```bash
git clone https://github.com/himanshu-mawari/ecommerce-backend.git
cd ecommerce-backend
npm install
```

### Running Locally

```bash
npm run dev
```

### Production

```bash
npm start
```

## Related Repository

Frontend: https://github.com/himanshu-mawari/ecommerce-frontend
