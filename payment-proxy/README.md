# BeeZee Finance Payment Gateway Proxy

A robust Node.js/Express server that acts as a payment gateway proxy for BeeZee Finance PWAs, providing secure payment processing with dLocal integration and comprehensive admin dashboard capabilities.

## 🏗️ Architecture Overview

```
┌─────────────────┐
│  BeeZee PWAs  │  ← HTTP Requests with X-SUPABASE-SECRET
└─────────────────┘
          │
          ▼
┌─────────────────┐
│  Payment Proxy  │  ← dLocal API Integration
│  (Node.js)      │
└─────────────────┘
          │
          ▼
┌─────────────────┐
│   Supabase DB   │  ← Transaction Updates & Analytics
│   (PostgreSQL)   │
└─────────────────┘
```

## 🚀 Features

### **Payment Processing**
- **dLocal Smart Checkout API** integration
- **HMAC-SHA256 signature verification** for security
- **Idempotency protection** to prevent duplicate processing
- **Multi-country support** (Kenya, South Africa, Nigeria)
- **Real-time tax calculations** (16% KE, 15% ZA, 7.5% NG)

### **Security & Reliability**
- **Request authentication** via X-SUPABASE-SECRET header
- **Rate limiting** (100 requests per 15 minutes)
- **Comprehensive logging** with Winston
- **Webhook signature verification**
- **Error handling** with proper HTTP status codes

### **Admin Dashboard**
- **Real-time revenue tracking** by country
- **User statistics** and activity monitoring
- **Transaction analytics** with success/failure rates
- **Tax calculations** and reporting
- **Performance metrics** for payment providers

## 📋 Project Structure

```
payment-proxy/
├── server.js                 # Main Express server
├── package.json              # Dependencies and scripts
├── .env.example              # Environment variables template
├── routes/
│   ├── payments.js          # Payment intent endpoints
│   └── webhooks.js         # Webhook handlers
├── services/
│   └── dlocal.js           # dLocal API integration
├── middleware/
│   ├── auth.js              # Supabase authentication
│   └── idempotency.js       # Duplicate prevention
├── utils/
│   └── logger.js            # Winston logging setup
├── migrations/
│   ├── 001_create_tax_functions.sql
│   └── 002_create_admin_tables.sql
└── logs/                    # Application logs
    ├── error.log
    └── combined.log
```

## 🔧 Installation & Setup

### **1. Clone and Install**
```bash
git clone <repository-url>
cd payment-proxy
npm install
```

### **2. Environment Configuration**
```bash
cp .env.example .env
```

Edit `.env` with your actual values:
```env
# dLocal Configuration
DLOCAL_X_LOGIN=your_x_login_token
DLOCAL_X_TRANS_KEY=your_x_trans_key
DLOCAL_SECRET_KEY=your_dlocal_secret_key

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Server Configuration
NODE_ENV=production
PORT=3001
LOG_LEVEL=info
```

### **3. Database Setup**
```bash
# Apply migrations to Supabase
psql $SUPABASE_URL -f migrations/001_create_tax_functions.sql
psql $SUPABASE_URL -f migrations/002_create_admin_tables.sql
```

### **4. Start Server**
```bash
# Development
npm run dev

# Production
npm start
```

## 🌐 API Endpoints

### **Payment Intent Creation**
```
POST /api/payments/create-intent
```

**Headers:**
- `X-SUPABASE-SECRET`: Your Supabase secret
- `Content-Type`: `application/json`

**Request Body:**
```json
{
  "amount": 100.00,
  "currency": "KES",
  "country": "KE",
  "user_id": "uuid",
  "order_id": "optional-order-id",
  "description": "Payment for BeeZee subscription",
  "customer_email": "user@example.com",
  "customer_name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "payment_id": "dlocal_payment_123",
  "checkout_url": "https://checkout.dlocal.com/xyz",
  "order_id": "order_123abc",
  "amount": 100.00,
  "currency": "KES",
  "country": "KE",
  "status": "pending"
}
```

### **Payment Status Check**
```
GET /api/payments/status/:paymentId
```

### **Webhook Endpoints**
```
POST /api/webhooks/dlocal
```

**Headers:**
- `X-Signature`: HMAC-SHA256 signature from dLocal

**Webhook Events:**
- `payment.success`: Payment completed successfully
- `payment.failed`: Payment declined or failed
- `payment.cancelled`: Payment cancelled by user
- `payment.pending`: Payment awaiting completion

## 🛡️ Security Features

### **Authentication**
- **Supabase Secret Verification**: Only requests with valid `X-SUPABASE-SECRET` header are accepted
- **Webhook Signature Verification**: All dLocal webhooks are verified using HMAC-SHA256
- **Request Validation**: Comprehensive input validation with express-validator

### **Rate Limiting**
- **100 requests per IP** per 15 minutes
- **Automatic IP blocking** on exceeded limits
- **Configurable windows** and limits via environment variables

### **Idempotency**
- **Duplicate prevention**: Same payment ID cannot be processed twice
- **Database-level checks**: Ensures transaction atomicity
- **Graceful handling**: Returns existing transaction status if duplicate

### **Logging & Monitoring**
- **Structured logging**: Winston with JSON format
- **Error tracking**: Full stack traces and request context
- **Performance monitoring**: Response times and success rates
- **Security auditing**: All admin actions logged

## 💾 Database Schema

### **Core Tables**
- **transactions**: All payment transactions with tax calculations
- **user_revenue_stats**: Per-user revenue tracking by country
- **admin_audit_log**: Complete audit trail of admin actions
- **system_metrics**: Real-time system performance data

### **Views & Functions**
- **calculate_tax()**: Country-specific tax calculations (KE: 16%, ZA: 15%, NG: 7.5%)
- **vw_admin_revenue_summary**: Comprehensive admin dashboard data
- **vw_country_performance**: Country-specific KPIs and metrics
- **vw_dashboard_metrics**: Real-time dashboard statistics

## 📊 Admin Dashboard Features

### **Revenue Analytics**
- **Total revenue** across all countries
- **Country-specific breakdowns** with tax calculations
- **Transaction volume** and success rates
- **Average transaction values** by country

### **User Management**
- **Active/inactive/dormant** user classification
- **Revenue per user** calculations
- **Transaction history** with admin context
- **Country-based user** segmentation

### **Tax Management**
- **Automatic tax calculation** based on country rates
- **Tax reporting** by country and period
- **Compliance tracking** for financial regulations
- **Audit trails** for all tax calculations

## 🔧 Configuration Options

### **Environment Variables**
```env
# Server Configuration
NODE_ENV=development|production
PORT=3001
LOG_LEVEL=error|warn|info|debug

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Webhook Security
WEBHOOK_SECRET=additional_webhook_validation_secret

# Redirect URLs
REDIRECT_BASE_URL=https://beezee-finance.vercel.app
CALLBACK_BASE_URL=https://beezee-finance.vercel.app
```

### **Country Tax Rates**
- **Kenya (KE)**: 16% VAT
- **South Africa (ZA)**: 15% VAT
- **Nigeria (NG)**: 7.5% VAT

## 🚨 Error Handling

### **HTTP Status Codes**
- `200`: Success
- `400`: Bad Request / Validation Error
- `401`: Unauthorized / Invalid Authentication
- `404`: Not Found
- `429`: Too Many Requests / Rate Limited
- `500`: Internal Server Error

### **Error Response Format**
```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "timestamp": "2024-01-08T10:24:00.000Z",
  "details": {} // Additional error context
}
```

## 📈 Monitoring & Maintenance

### **Health Check**
```
GET /health
```

Returns server status, uptime, memory usage, and version.

### **Log Files**
- **error.log**: Error-level messages only
- **combined.log**: All HTTP requests and responses
- **Automatic rotation**: Prevents disk space issues

### **Performance Metrics**
- **Response time tracking** for all API endpoints
- **Success/failure rates** by payment provider
- **Database query performance** monitoring
- **Memory and CPU usage** tracking

## 🔄 Deployment

### **AWS Lightsail Setup**
```bash
# Install PM2 for process management
npm install -g pm2

# Start application
pm2 start server.js --name "beezee-payment-proxy"

# Monitor logs
pm2 logs beezee-payment-proxy

# Restart on changes
pm2 restart beezee-payment-proxy
```

### **Nginx Configuration (if using reverse proxy)**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🧪 Testing

### **Local Development**
```bash
# Run with environment variables
NODE_ENV=development npm run dev

# Test endpoints
curl -X POST http://localhost:3001/api/payments/create-intent \
  -H "Content-Type: application/json" \
  -H "X-SUPABASE-SECRET: your-secret" \
  -d '{"amount":100,"currency":"KES","country":"KE","user_id":"test-uuid"}'
```

### **Integration Testing**
- **Webhook testing**: Use ngrok for local development
- **Load testing**: Test with concurrent requests
- **Error scenarios**: Test all failure conditions
- **Security testing**: Verify authentication and rate limiting

## 📝 License

MIT License - Feel free to use this project for commercial or personal purposes.

## 🤝 Support

For issues and questions:
- **Documentation**: Check inline code comments
- **Logs**: Review Winston log outputs
- **Health Check**: Monitor `/health` endpoint
- **Database**: Verify Supabase connection and migrations

---

**Built with ❤️ for African informal businesses**
