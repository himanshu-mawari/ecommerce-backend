# E-COMMERCE APIs

# authRouter

- POST api/user/signup
- POST api/user/login
- POST api/user/logout

# productRouter

- POST /api/products/add
- DELETE /api/products/remove/:productId
- GET /api/products/:id
- GET /api/products/list

# cartRouter

- POST api/cart/add
- POST api/cart/update/:productId
- DELETE api/cart/remove/:productId
- GET api/cart/

# orderRouter

- POST api/order
- GET api/order/user-orders
- GET api/order/:orderId
- PATCH api/order/:orderId/status
- PATCH api/order/:orderId/cancel
- GET api/order/all-orders