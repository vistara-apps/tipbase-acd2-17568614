/**
 * Transaction Utilities
 * 
 * This module provides utilities for handling blockchain transactions.
 */

import { encodeFunctionData, parseUnits } from 'viem';

// USDC contract on Base
export const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
export const USDC_DECIMALS = 6;

/**
 * Creates a transaction call for sending USDC
 * 
 * @param to Recipient address
 * @param amount Amount to send
 * @returns Transaction call object
 */
export function createUSDCTransferCall(to: `0x${string}`, amount: number) {
  return {
    to: USDC_ADDRESS as `0x${string}`,
    data: encodeFunctionData({
      abi: [
        {
          inputs: [
            { name: 'to', type: 'address' },
            { name: 'value', type: 'uint256' }
          ],
          name: 'transfer',
          outputs: [{ name: '', type: 'bool' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'transfer',
      args: [to, parseUnits(amount.toString(), USDC_DECIMALS)],
    }),
  };
}

/**
 * Formats an address for display
 * 
 * @param address The address to format
 * @param length Number of characters to show at start and end
 * @returns Formatted address
 */
export function formatAddress(address: string, length: number = 4): string {
  if (!address) return '';
  return `${address.slice(0, length + 2)}...${address.slice(-length)}`;
}

/**
 * Formats a timestamp for display
 * 
 * @param timestamp ISO timestamp string
 * @returns Formatted date string
 */
export function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString();
}

/**
 * Formats an amount with currency
 * 
 * @param amount The amount to format
 * @param currency The currency symbol
 * @param decimals Number of decimal places
 * @returns Formatted amount string
 */
export function formatAmount(amount: number, currency: string = 'USDC', decimals: number = 2): string {
  return `${amount.toFixed(decimals)} ${currency}`;
}

