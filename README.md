# TipBase

Effortlessly tip creators on Base with personalized messages.

## Overview

TipBase is a Base Wallet MiniApp that allows users to send personalized tips to creators and provides creators with basic tipping analytics. Built for the Base ecosystem, it leverages account abstraction principles for a seamless, low-friction tipping experience.

## Features

### Personalized Tipping
- Attach short, customizable messages to tips
- Makes the act of giving more personal and meaningful
- Enhances the connection between tipper and creator

### One-Click Tipping
- Pre-configured tip amounts for quick tipping
- Custom amount option for flexibility
- Send tips with a single action directly within the Base Wallet app

### Creator Tipping Dashboard
- View recent tips and total amounts received
- See personalized messages from supporters
- Analytics dashboard with key metrics
- Track unique tippers and average tip amounts

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Blockchain**: Base (Ethereum L2), USDC token
- **Wallet Integration**: Coinbase OnchainKit, Wagmi, Viem
- **Database**: Supabase (PostgreSQL)
- **APIs**:
  - Turnkey Smart Wallet SDK for account abstraction
  - Bitquery for blockchain data analytics
  - Supabase for off-chain data storage

## Architecture

### Data Model

#### User
- `userId` (unique identifier)
- `baseWalletAddress` (wallet address)
- `farcasterId` (optional, for Farcaster integration)

#### Tip
- `tipId` (unique identifier)
- `senderAddress` (tipper's wallet address)
- `receiverAddress` (creator's wallet address)
- `amount` (tip amount)
- `currency` (e.g., USDC)
- `message` (personalized message)
- `timestamp` (when the tip was sent)
- `transactionHash` (on-chain transaction reference)

#### CreatorProfile
- `creatorId` (unique identifier)
- `userId` (reference to User)
- `displayName` (creator's display name)
- `bio` (optional creator description)
- `vanityUrl` (for friendly profile URLs)

### User Flows

#### User Tipping Flow
1. User navigates to a creator's profile
2. Selects a pre-defined tip amount or enters a custom amount
3. Optionally types a personalized message
4. Clicks the 'Send Tip' button
5. Wallet transaction is initiated and confirmed
6. Creator receives the tip and message in their dashboard

#### Creator Onboarding & Profile Setup
1. Creator connects their Base Wallet
2. Sets up their profile (display name, bio)
3. Gets a unique vanity URL for their tipping page
4. Accesses their dashboard to view tips and analytics

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Base Wallet or compatible Web3 wallet
- Supabase account for database
- API keys for Turnkey and Bitquery (optional)

### Environment Variables
Create a `.env.local` file with the following variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
TURNKEY_API_KEY=your_turnkey_api_key
BITQUERY_API_KEY=your_bitquery_api_key
```

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/tipbase.git
cd tipbase

# Install dependencies
npm install

# Run the development server
npm run dev
```

### Database Setup
Run the SQL schema in `lib/schema.sql` in your Supabase SQL editor to set up the required tables and relationships.

## Deployment

TipBase can be deployed to Vercel or any other Next.js-compatible hosting platform:

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

## Business Model

TipBase uses a micro-transaction model where creators can set a minimum tip amount, with an optional platform fee of 5% on tips processed. This allows for sustainability without alienating users, especially in the context of creator monetization.

## Future Enhancements

- Subscription option for premium analytics
- Custom tipping page themes
- Integration with more social platforms
- Recurring tips functionality
- NFT rewards for top tippers

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Base for the L2 infrastructure
- Coinbase for the OnchainKit SDK
- Supabase for the database platform
- Turnkey for the Smart Wallet SDK
- Bitquery for blockchain data analytics

