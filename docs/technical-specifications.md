# TipBase Technical Specifications

This document outlines the technical specifications and architecture for the TipBase application.

## System Architecture

TipBase follows a modern web application architecture with the following components:

### Frontend

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **State Management**: React Query for server state, React hooks for local state
- **Web3 Integration**: Wagmi, Viem, OnchainKit

### Backend

- **API Routes**: Next.js API routes (serverless functions)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (for future media attachments)

### Blockchain Integration

- **Network**: Base (Ethereum L2)
- **Token**: USDC (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)
- **Smart Wallet**: Turnkey SDK for account abstraction
- **Transaction Handling**: OnchainKit Transaction components
- **Blockchain Data**: Bitquery GraphQL API

## Data Model

### Entity Relationship Diagram

```
┌─────────┐       ┌──────────────────┐       ┌─────┐
│  User   │       │ Creator Profile  │       │ Tip │
├─────────┤       ├──────────────────┤       ├─────┤
│ userId  │──1:1──┤ creatorId        │       │ tipId
│ address │       │ userId           │◄──1:n─┤ senderAddress
│ farcId  │       │ displayName      │       │ receiverAddress
└─────────┘       │ bio              │       │ amount
                  │ vanityUrl        │       │ currency
                  └──────────────────┘       │ message
                                             │ timestamp
                                             │ txHash
                                             └─────┘
```

### Database Schema

See `lib/schema.sql` for the complete database schema definition.

## API Endpoints

### Profile Management

- `POST /api/profile`: Create or update a creator profile
- `GET /api/profile?vanityUrl={vanityUrl}`: Get profile by vanity URL
- `GET /api/profile?address={address}`: Get profile by wallet address

### Tip Management

- `POST /api/tips`: Record a new tip
- `GET /api/tips?address={address}`: Get tips for a creator

### Analytics

- `GET /api/analytics?address={address}&days={days}`: Get tipping analytics

## Authentication & Authorization

- **User Authentication**: Wallet-based authentication using Wagmi
- **API Authentication**: JWT tokens from Supabase Auth
- **Authorization**: Row-level security policies in Supabase

## External API Integrations

### Turnkey Smart Wallet SDK

- **Purpose**: Enable gasless transactions and account abstraction
- **Endpoints**:
  - `POST /wallets/create`: Create a new smart wallet
  - `POST /payments/send`: Send a payment
- **Authentication**: API key

### Bitquery GraphQL API

- **Purpose**: Fetch and verify on-chain transaction data
- **Endpoint**: GraphQL API at `https://graphql.bitquery.io`
- **Authentication**: API key
- **Queries**:
  - Transaction verification
  - Historical transaction data
  - Aggregated analytics

## Performance Considerations

### Caching Strategy

- **Static Assets**: Cached at the edge with Next.js
- **API Responses**: SWR/React Query with appropriate stale times
- **Blockchain Data**: Cached with reasonable TTL to reduce API calls

### Optimization Techniques

- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Next.js Image component
- **Bundle Size**: Monitored and optimized
- **Server Components**: Used where appropriate for reduced client JS

## Security Measures

### Data Protection

- **Sensitive Data**: Stored securely in Supabase with RLS
- **API Keys**: Stored as environment variables, never exposed to client
- **User Data**: Minimal collection, only what's necessary

### Transaction Security

- **Transaction Verification**: On-chain verification before recording tips
- **Smart Contract Interaction**: Validated and secure
- **Rate Limiting**: Implemented on API routes

### Authentication Security

- **Wallet Authentication**: Secure signature-based authentication
- **Session Management**: Handled by Supabase Auth
- **Authorization**: Fine-grained access control with RLS

## Scalability

### Database Scalability

- **Connection Pooling**: Managed by Supabase
- **Indexing**: Appropriate indexes on frequently queried columns
- **Query Optimization**: Efficient queries with proper joins

### API Scalability

- **Serverless Functions**: Auto-scaling with Next.js API routes
- **Edge Caching**: For static and semi-static content
- **Rate Limiting**: To prevent abuse

## Monitoring & Logging

### Error Tracking

- **Client-Side**: Error boundaries and reporting
- **Server-Side**: Structured logging with pino-pretty
- **API Errors**: Consistent error format and status codes

### Performance Monitoring

- **Web Vitals**: Tracked for frontend performance
- **API Response Times**: Monitored for backend performance
- **Database Queries**: Monitored for optimization opportunities

## Deployment

### Environment Configuration

- **Development**: Local environment with `.env.local`
- **Staging**: Vercel preview deployments
- **Production**: Vercel production deployment

### CI/CD Pipeline

- **Code Quality**: ESLint, Prettier
- **Testing**: Jest, React Testing Library
- **Deployment**: Automated with Vercel

## Future Technical Considerations

### Scaling Features

- **Webhooks**: For real-time notifications
- **Subscription Payments**: Recurring tips
- **NFT Integration**: Rewards for top tippers
- **Social Integration**: Deeper Farcaster integration

### Technical Debt Management

- **Code Reviews**: Required for all changes
- **Refactoring**: Scheduled maintenance
- **Documentation**: Kept up-to-date
- **Testing**: Maintained and expanded

## Development Guidelines

### Coding Standards

- **TypeScript**: Strict type checking
- **ESLint**: Enforced code style
- **Prettier**: Consistent formatting
- **Component Structure**: Functional components with hooks

### Git Workflow

- **Branching**: Feature branches from main
- **PRs**: Required for all changes
- **Reviews**: Required before merging
- **CI**: Automated checks before merging

### Documentation

- **Code Comments**: For complex logic
- **API Documentation**: OpenAPI/Swagger format
- **README**: Comprehensive project overview
- **Technical Docs**: Architecture and decisions

