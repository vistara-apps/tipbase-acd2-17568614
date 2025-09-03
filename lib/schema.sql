-- TipBase Database Schema

-- Users table
CREATE TABLE users (
  userId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  baseWalletAddress TEXT NOT NULL UNIQUE,
  farcasterId TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT users_base_wallet_address_check CHECK (baseWalletAddress ~* '^0x[a-f0-9]{40}$')
);

-- Creator profiles table
CREATE TABLE creator_profiles (
  creatorId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId UUID NOT NULL REFERENCES users(userId) ON DELETE CASCADE,
  displayName TEXT NOT NULL,
  bio TEXT,
  vanityUrl TEXT NOT NULL UNIQUE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT creator_profiles_vanity_url_check CHECK (vanityUrl ~* '^[a-z0-9-]+$')
);

-- Tips table
CREATE TABLE tips (
  tipId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  senderAddress TEXT NOT NULL,
  receiverAddress TEXT NOT NULL,
  amount NUMERIC(20, 6) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USDC',
  message TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  transactionHash TEXT NOT NULL UNIQUE,
  
  -- Constraints
  CONSTRAINT tips_sender_address_check CHECK (senderAddress ~* '^0x[a-f0-9]{40}$'),
  CONSTRAINT tips_receiver_address_check CHECK (receiverAddress ~* '^0x[a-f0-9]{40}$'),
  CONSTRAINT tips_amount_check CHECK (amount > 0),
  CONSTRAINT tips_transaction_hash_check CHECK (transactionHash ~* '^0x[a-f0-9]{64}$')
);

-- Indexes
CREATE INDEX idx_users_base_wallet_address ON users(baseWalletAddress);
CREATE INDEX idx_creator_profiles_user_id ON creator_profiles(userId);
CREATE INDEX idx_creator_profiles_vanity_url ON creator_profiles(vanityUrl);
CREATE INDEX idx_tips_sender_address ON tips(senderAddress);
CREATE INDEX idx_tips_receiver_address ON tips(receiverAddress);
CREATE INDEX idx_tips_timestamp ON tips(timestamp);

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tips ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY users_select_own ON users
  FOR SELECT USING (auth.uid()::text = userId::text);

-- Creator profiles are publicly readable
CREATE POLICY creator_profiles_select_all ON creator_profiles
  FOR SELECT USING (true);

-- Users can only update their own profiles
CREATE POLICY creator_profiles_update_own ON creator_profiles
  FOR UPDATE USING (auth.uid()::text = userId::text);

-- Tips are publicly readable
CREATE POLICY tips_select_all ON tips
  FOR SELECT USING (true);

-- Only authenticated users can insert tips
CREATE POLICY tips_insert_authenticated ON tips
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Functions and Triggers
-- Function to update vanityUrl when displayName changes
CREATE OR REPLACE FUNCTION update_vanity_url()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.displayName <> OLD.displayName THEN
    NEW.vanityUrl = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(NEW.displayName, '\s+', '-', 'g'), '[^a-z0-9-]', '', 'g'));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update vanityUrl
CREATE TRIGGER update_creator_profile_vanity_url
BEFORE UPDATE ON creator_profiles
FOR EACH ROW
EXECUTE FUNCTION update_vanity_url();

