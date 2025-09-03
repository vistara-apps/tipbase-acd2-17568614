/**
 * Turnkey Smart Wallet SDK Integration
 * 
 * This service provides integration with Turnkey's Smart Wallet SDK for Base,
 * enabling gasless transactions and account abstraction features.
 */

import { base } from 'viem/chains';

// Turnkey API configuration
const TURNKEY_API_BASE = 'https://api.turnkey.tech';

/**
 * Creates a new smart wallet for a user
 * 
 * @param address The user's EOA address
 * @returns The newly created smart wallet address and details
 */
export async function createSmartWallet(address: `0x${string}`) {
  try {
    const response = await fetch(`${TURNKEY_API_BASE}/wallets/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TURNKEY_API_KEY}`
      },
      body: JSON.stringify({
        owner: address,
        chainId: base.id,
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to create wallet: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating smart wallet:', error);
    throw error;
  }
}

/**
 * Sends a payment using the smart wallet
 * 
 * @param from The sender's smart wallet address
 * @param to The recipient's address
 * @param amount The amount to send
 * @param tokenAddress The token contract address (USDC by default)
 * @returns Transaction details
 */
export async function sendPayment(
  from: `0x${string}`,
  to: `0x${string}`,
  amount: string,
  tokenAddress: `0x${string}` = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' // Base USDC
) {
  try {
    const response = await fetch(`${TURNKEY_API_BASE}/payments/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TURNKEY_API_KEY}`
      },
      body: JSON.stringify({
        from,
        to,
        amount,
        tokenAddress,
        chainId: base.id,
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to send payment: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending payment:', error);
    throw error;
  }
}

/**
 * Gets the smart wallet details for a user
 * 
 * @param address The user's EOA address
 * @returns The user's smart wallet details
 */
export async function getSmartWallet(address: `0x${string}`) {
  try {
    const response = await fetch(`${TURNKEY_API_BASE}/wallets/${address}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.TURNKEY_API_KEY}`
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Wallet doesn't exist yet
      }
      throw new Error(`Failed to get wallet: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting smart wallet:', error);
    throw error;
  }
}

