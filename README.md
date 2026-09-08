# Forever — Backend

REST API for Forever, a full-stack e-commerce platform with a consumer storefront and admin panel.

## Features
- JWT-based authentication with httpOnly cookies
- Role-based access control (admin vs. customer)
- Product and order management
- Paginated, filterable product/order listings
- Cloudinary-based image upload and management
- Aggregated admin dashboard metrics

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
Protected/admin request → Auth middleware → Verify JWT + role → Attach user
```

## Key Design Notes
- Product and order listings use MongoDB's `$facet` aggregation to return paginated results and total counts in a single query, supporting filtered admin views without a separate count query.
- The admin dashboard controller runs independent aggregation queries concurrently via `Promise.all`.
- Search inputs are escaped before use in MongoDB regex queries to prevent regex injection.

## Environment Variables
```env
PORT=5000
MONGODB_URI=<mongodb-url>
JWT_SECRET=<jwt-secret>
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
```

## Getting Started

### Prerequisites
- Node.js
- MongoDB

### Installation
```bash
git clone https://github.com/<your-username>/ecom-backend.git
cd ecom-backend
npm install
```

### Running Locally
```bash
npm run dev
```

## Deployment
Live demo: <your actual live backend URL, if publicly testable — otherwise note it's deployed but not directly browsable>

## Related Repository
Frontend: https://github.com/<your-username>/ecom-frontend