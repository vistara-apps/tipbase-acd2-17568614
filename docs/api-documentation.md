# TipBase API Documentation

This document provides comprehensive documentation for the TipBase API endpoints.

## Base URL

All API endpoints are relative to your deployment URL:

```
https://your-deployment-url.com/api
```

## Authentication

Most endpoints require authentication via Supabase Auth. Include the JWT token in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Profile Management

#### Create or Update Profile

```
POST /api/profile
```

Creates a new creator profile or updates an existing one.

**Request Body:**
```json
{
  "baseWalletAddress": "0x...",
  "displayName": "Creator Name",
  "bio": "Optional creator bio",
  "farcasterId": "Optional farcaster ID"
}
```

**Response:**
```json
{
  "creatorId": "uuid",
  "userId": "uuid",
  "displayName": "Creator Name",
  "bio": "Optional creator bio",
  "vanityUrl": "creator-name",
  "createdAt": "2023-01-01T00:00:00Z"
}
```

#### Get Profile by Vanity URL

```
GET /api/profile?vanityUrl=creator-name
```

Retrieves a creator profile by its vanity URL.

**Response:**
```json
{
  "creatorId": "uuid",
  "userId": "uuid",
  "displayName": "Creator Name",
  "bio": "Optional creator bio",
  "vanityUrl": "creator-name",
  "createdAt": "2023-01-01T00:00:00Z",
  "users": {
    "baseWalletAddress": "0x..."
  }
}
```

#### Get Profile by Wallet Address

```
GET /api/profile?address=0x...
```

Retrieves a creator profile by wallet address.

**Response:**
Same as above.

### Tip Management

#### Record a Tip

```
POST /api/tips
```

Records a new tip in the database after an on-chain transaction.

**Request Body:**
```json
{
  "senderAddress": "0x...",
  "receiverAddress": "0x...",
  "amount": 5.0,
  "currency": "USDC",
  "message": "Optional personalized message",
  "transactionHash": "0x..."
}
```

**Response:**
```json
{
  "tipId": "uuid",
  "senderAddress": "0x...",
  "receiverAddress": "0x...",
  "amount": 5.0,
  "currency": "USDC",
  "message": "Optional personalized message",
  "timestamp": "2023-01-01T00:00:00Z",
  "transactionHash": "0x..."
}
```

#### Get Tips for a Creator

```
GET /api/tips?address=0x...
```

Retrieves all tips received by a creator.

**Response:**
```json
[
  {
    "tipId": "uuid",
    "senderAddress": "0x...",
    "receiverAddress": "0x...",
    "amount": 5.0,
    "currency": "USDC",
    "message": "Optional personalized message",
    "timestamp": "2023-01-01T00:00:00Z",
    "transactionHash": "0x..."
  },
  // More tips...
]
```

### Analytics

#### Get Tipping Analytics

```
GET /api/analytics?address=0x...&days=30
```

Retrieves tipping analytics for a creator.

**Query Parameters:**
- `address`: Creator's wallet address (required)
- `days`: Number of days to analyze (optional, default: 30)

**Response:**
```json
{
  "totalTips": 10,
  "totalAmount": 50.0,
  "uniqueTippers": 5,
  "averagePerTip": 5.0,
  "daysActive": 7,
  "averagePerDay": 7.14,
  "source": "hybrid",
  "period": "30 days"
}
```

## Error Handling

All API endpoints return appropriate HTTP status codes:

- `200 OK`: Request successful
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Error responses include a JSON object with an error message:

```json
{
  "error": "Error message"
}
```

## Rate Limiting

API requests are rate-limited to prevent abuse. The current limits are:

- 100 requests per minute per IP address
- 1000 requests per hour per IP address

## Webhook Integration

TipBase provides webhooks for real-time notifications of new tips. To set up a webhook:

1. Register your webhook URL in the dashboard
2. Configure the events you want to receive (e.g., `tip.created`)
3. Implement an endpoint to receive webhook payloads

Webhook payloads include:

```json
{
  "event": "tip.created",
  "data": {
    // Tip object
  },
  "timestamp": "2023-01-01T00:00:00Z"
}
```

## SDK Integration

For client-side integration, you can use the TipBase JavaScript SDK:

```javascript
import { TipBase } from 'tipbase-sdk';

const tipbase = new TipBase({
  apiKey: 'your_api_key',
  environment: 'production' // or 'development'
});

// Create a tip
await tipbase.createTip({
  senderAddress: '0x...',
  receiverAddress: '0x...',
  amount: 5.0,
  message: 'Great content!'
});

// Get creator analytics
const analytics = await tipbase.getAnalytics('0x...');
```

## Support

For API support, please contact:
- Email: support@tipbase.app
- Discord: [TipBase Community](https://discord.gg/tipbase)

