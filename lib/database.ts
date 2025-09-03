/**
 * Database Service
 * 
 * This service provides typed interfaces and helper functions for interacting with Supabase.
 */

import { supabase } from './supabase';

// Database Types
export interface User {
  userId: string;
  baseWalletAddress: string;
  farcasterId?: string;
  createdAt: string;
}

export interface CreatorProfile {
  creatorId: string;
  userId: string;
  displayName: string;
  bio?: string;
  vanityUrl: string;
  createdAt: string;
}

export interface Tip {
  tipId: string;
  senderAddress: string;
  receiverAddress: string;
  amount: number;
  currency: string;
  message?: string;
  timestamp: string;
  transactionHash: string;
}

/**
 * Creates a new user in the database
 * 
 * @param baseWalletAddress The user's Base wallet address
 * @param farcasterId Optional Farcaster ID
 * @returns The created user
 */
export async function createUser(baseWalletAddress: string, farcasterId?: string) {
  const { data, error } = await supabase
    .from('users')
    .insert({
      baseWalletAddress,
      farcasterId,
    })
    .select('*')
    .single();

  if (error) throw error;
  return data as User;
}

/**
 * Gets a user by their wallet address
 * 
 * @param baseWalletAddress The user's Base wallet address
 * @returns The user if found, null otherwise
 */
export async function getUserByAddress(baseWalletAddress: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('baseWalletAddress', baseWalletAddress)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  
  return data as User;
}

/**
 * Creates a creator profile
 * 
 * @param userId The user ID
 * @param displayName The creator's display name
 * @param bio Optional creator bio
 * @returns The created creator profile
 */
export async function createCreatorProfile(userId: string, displayName: string, bio?: string) {
  const vanityUrl = displayName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  const { data, error } = await supabase
    .from('creator_profiles')
    .insert({
      userId,
      displayName,
      bio,
      vanityUrl,
    })
    .select('*')
    .single();

  if (error) throw error;
  return data as CreatorProfile;
}

/**
 * Gets a creator profile by vanity URL
 * 
 * @param vanityUrl The creator's vanity URL
 * @returns The creator profile if found, null otherwise
 */
export async function getCreatorProfileByVanityUrl(vanityUrl: string) {
  const { data, error } = await supabase
    .from('creator_profiles')
    .select('*, users(baseWalletAddress)')
    .eq('vanityUrl', vanityUrl)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  
  return data as CreatorProfile & { users: { baseWalletAddress: string } };
}

/**
 * Records a new tip in the database
 * 
 * @param tip The tip details
 * @returns The created tip
 */
export async function recordTip(tip: Omit<Tip, 'tipId'>) {
  const { data, error } = await supabase
    .from('tips')
    .insert(tip)
    .select('*')
    .single();

  if (error) throw error;
  return data as Tip;
}

/**
 * Gets all tips received by a creator
 * 
 * @param receiverAddress The creator's wallet address
 * @returns Array of tips
 */
export async function getCreatorTips(receiverAddress: string) {
  const { data, error } = await supabase
    .from('tips')
    .select('*')
    .eq('receiverAddress', receiverAddress)
    .order('timestamp', { ascending: false });

  if (error) throw error;
  return data as Tip[];
}

/**
 * Gets tipping analytics for a creator
 * 
 * @param receiverAddress The creator's wallet address
 * @returns Analytics data
 */
export async function getCreatorTipAnalytics(receiverAddress: string) {
  const { data: tips, error } = await supabase
    .from('tips')
    .select('*')
    .eq('receiverAddress', receiverAddress);

  if (error) throw error;

  const totalTips = tips.length;
  const totalAmount = tips.reduce((sum, tip) => sum + tip.amount, 0);
  const uniqueTippers = new Set(tips.map(tip => tip.senderAddress)).size;
  
  // Get the earliest and latest tip timestamps
  const timestamps = tips.map(tip => new Date(tip.timestamp).getTime());
  const earliestTip = timestamps.length > 0 ? new Date(Math.min(...timestamps)) : null;
  const latestTip = timestamps.length > 0 ? new Date(Math.max(...timestamps)) : null;
  
  // Calculate days active
  let daysActive = 0;
  if (earliestTip && latestTip) {
    daysActive = Math.ceil((latestTip.getTime() - earliestTip.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  return {
    totalTips,
    totalAmount,
    uniqueTippers,
    averagePerTip: totalTips > 0 ? totalAmount / totalTips : 0,
    earliestTip,
    latestTip,
    daysActive,
    averagePerDay: daysActive > 0 ? totalAmount / daysActive : 0,
  };
}

