# Complete Order Management System

## 🎯 Overview

This document describes the complete order management system that implements the customer journey from landing page to order completion, and the admin journey for order management.

## 🔄 Customer Journey (Landing Page → API)

### 1. Product Browsing
- Customer browses products on the landing page
- Product data comes from the backend API connected to the database
- Products display with images, prices, colors, sizes, and stock information

### 2. Cart Management
- Customer adds items to cart
- Cart is stored in session/local storage (frontend) or directly in DB (if logged in)
- Cart persists across sessions for authenticated users

### 3. Order Placement
- Customer proceeds to checkout
- Frontend sends order request via `POST /orders` API
- **Payload Structure:**
```json
{
  "userId": 123,
  "items": [
    { "productId": "45", "quantity": 2, "price": 59.99, "color": "Red", "size": "M" },
    { "productId": "67", "quantity": 1, "price": 29.99, "color": "Blue", "size": "L" }
  ],
  "shippingAddress": "Customer address here",
  "paymentMethod": "CreditCard",
  "totalAmount": 149.97,
  "notes": "Optional order notes"
}
```

### 4. Order Processing
- Backend validates stock availability
- Calculates total with shipping and tax
- Applies discounts if applicable
- Payment gateway integration (Stripe, PayPal, etc.)
- Order stored in DB with status "PENDING" or "PAID"

## 👨‍💼 Admin Journey (Dashboard → API)

### 1. Admin Login
- Admin logs into dashboard
- Dashboard fetches orders via `GET /orders`
- Orders can be filtered by status (pending, processing, shipped, etc.)

### 2. Order Management
- **API Response Example:**
```json
{
  "orderId": "5001",
  "customer": "Mahmoud Zenbarakji",
  "items": [
    { "product": "T-shirt Red", "quantity": 2 },
    { "product": "Shoes", "quantity": 1 }
  ],
  "status": "PENDING",
  "total": 149.97,
  "createdAt": "2025-01-12T12:30:00Z"
}
```

### 3. Order Processing
- Admin updates status via `PUT /orders/{id}`
- Status options: PENDING → PROCESSING → SHIPPED → DELIVERED
- Inventory updates automatically
- Customer receives email/notification

## 🔐 Communication Protocol

### Frontend ↔ Backend Communication
- **Landing Page (Customer)** → Creates orders via API
- **Dashboard (Admin)** → Manages orders via API
- **Same API endpoints** with different permissions:
  - **Customer (Role: USER)** → Can only create & view their own orders
  - **Admin (Role: ADMIN)** → Can view & update all orders

## 📊 Order Lifecycle

```
PENDING → Customer just placed the order
    ↓
PAID → Payment confirmed
    ↓
PROCESSING → Admin starts preparing the order
    ↓
SHIPPED → Order handed to delivery
    ↓
DELIVERED → Customer received order
    ↓
CANCELLED/REFUNDED (if needed)
```

## 🛠️ Technical Implementation

### Backend API Endpoints

#### Public Endpoints (No Authentication)
- `POST /orders` - Create new order (guest or authenticated)

#### Authenticated Endpoints
- `GET /orders/my-orders` - Get user's orders
- `GET /orders/{id}` - Get specific order
- `POST /orders/addresses` - Create address
- `GET /orders/addresses/my-addresses` - Get user addresses

#### Admin Only Endpoints
- `GET /orders` - Get all orders (with optional status filter)
- `PATCH /orders/{id}/status` - Update order status
- `PATCH /orders/{id}/payment-status` - Update payment status

### Frontend Components

#### Customer Components
- `checkout.jsx` - Authenticated user checkout
- `guestCheckout.jsx` - Guest user checkout
- `Orders.jsx` - User order history
- `orderConfirmation.jsx` - Order confirmation page

#### Admin Components
- `dashboard/order.jsx` - Admin order management dashboard

### Database Schema

```sql
-- Orders table
CREATE TABLE orders (
  id VARCHAR PRIMARY KEY,
  userId INTEGER REFERENCES users(id),
  addressId VARCHAR REFERENCES addresses(id),
  status OrderStatus DEFAULT 'PENDING',
  paymentStatus PaymentStatus DEFAULT 'PENDING',
  subtotal DECIMAL,
  shipping DECIMAL DEFAULT 0,
  tax DECIMAL DEFAULT 0,
  total DECIMAL,
  notes TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id VARCHAR PRIMARY KEY,
  orderId VARCHAR REFERENCES orders(id),
  productId VARCHAR REFERENCES products(id),
  quantity INTEGER,
  color VARCHAR,
  size VARCHAR,
  price DECIMAL,
  createdAt TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Usage Examples

### Creating an Order (Frontend)
```javascript
const orderData = {
  userId: user.id,
  items: cartItems.map(item => ({
    productId: item.id,
    quantity: item.quantity,
    price: item.price,
    color: item.color,
    size: item.size
  })),
  shippingAddress: "123 Main St, City, State 12345",
  paymentMethod: "CashOnDelivery",
  totalAmount: total,
  notes: "Special delivery instructions"
};

const order = await ordersAPI.createOrder(orderData);
```

### Admin Order Management (Frontend)
```javascript
// Get all orders
const orders = await ordersAPI.getAll();

// Get orders by status
const pendingOrders = await ordersAPI.getAll('PENDING');

// Update order status
await ordersAPI.updateOrderStatus(orderId, 'PROCESSING');
```

## 🔧 Configuration

### Environment Variables
```env
DATABASE_URL=postgresql://user:password@localhost:5432/exte_db
JWT_SECRET=your-jwt-secret
```

### API Base URL
- Development: `http://localhost:3000/api`
- Production: `https://your-domain.com/api`

## 🧪 Testing

Run the order flow test:
```bash
node test-order-flow.js
```

This will test:
- Guest order creation
- Order retrieval
- API structure validation

## 📝 Notes

- The system supports both authenticated and guest users
- Guest orders use a default user ID (you may want to create a guest user in your system)
- Payment integration is ready for Stripe, PayPal, or other gateways
- Email notifications can be added to the order status update endpoints
- The system automatically updates product stock when orders are created
- Cart items are automatically cleared after successful order creation

## 🎉 Summary

The order management system provides:
- ✅ Complete customer journey from browsing to order completion
- ✅ Admin dashboard for order management
- ✅ Role-based access control
- ✅ Real-time order status updates
- ✅ Inventory management
- ✅ Guest and authenticated user support
- ✅ Modern, responsive UI components
