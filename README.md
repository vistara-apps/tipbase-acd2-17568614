    # TipBase - Base Mini App

    Effortlessly tip creators on Base with personalized messages.

    ## Features

    - **Personalized Tipping**: Attach custom messages to your tips
    - **One-Click Tipping**: Pre-configured tip amounts for quick transactions
    - **Creator Dashboard**: View tips received and analytics
    - **Base Wallet Integration**: Seamless wallet connectivity

    ## Setup

    1. Clone the repository
    2. Install dependencies: `npm install`
    3. Set up environment variables in `.env.local`:
       - `NEXT_PUBLIC_ONCHAINKIT_API_KEY`: Your OnchainKit API key
       - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
       - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
    4. Set up Supabase database with the following tables:
       - `users` (userId, baseWalletAddress, farcasterId)
       - `creator_profiles` (creatorId, userId, displayName, bio, vanityUrl)
       - `tips` (tipId, senderAddress, receiverAddress, amount, currency, message, timestamp, transactionHash)
    5. Run the app: `npm run dev`

    ## Usage

    - Access the app via Base Wallet mini app interface
    - New users are prompted to create a profile
    - Existing creators can view tips in their dashboard
    - Visitors can tip creators by navigating to `/{vanityUrl}`

    ## Tech Stack

    - Next.js
    - OnchainKit (for Base integration)
    - Supabase (for backend)
    - Tailwind CSS (for styling)
    - Wagmi/Viem (for wallet interactions)
  