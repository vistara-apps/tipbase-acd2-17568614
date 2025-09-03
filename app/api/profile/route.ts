/**
 * API Route for creator profiles
 */
import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByAddress, createCreatorProfile, getCreatorProfileByVanityUrl } from '@/lib/database';
import { supabase } from './supabase';

/**
 * POST /api/profile - Create or update a creator profile
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { baseWalletAddress, displayName, bio, farcasterId } = body;

    if (!baseWalletAddress || !displayName) {
      return NextResponse.json(
        { error: 'Wallet address and display name are required' },
        { status: 400 }
      );
    }

    // Check if user exists, create if not
    let user = await getUserByAddress(baseWalletAddress);
    if (!user) {
      user = await createUser(baseWalletAddress, farcasterId);
    }

    // Create creator profile
    const profile = await createCreatorProfile(user.userId, displayName, bio);

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/profile?vanityUrl={vanityUrl} - Get a creator profile by vanity URL
 * GET /api/profile?address={address} - Get a creator profile by wallet address
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const vanityUrl = searchParams.get('vanityUrl');
    const address = searchParams.get('address');

    if (!vanityUrl && !address) {
      return NextResponse.json(
        { error: 'Either vanityUrl or address parameter is required' },
        { status: 400 }
      );
    }

    let profile = null;

    if (vanityUrl) {
      profile = await getCreatorProfileByVanityUrl(vanityUrl);
    } else if (address) {
      const user = await getUserByAddress(address);
      if (user) {
        const { data, error } = await supabase
          .from('creator_profiles')
          .select('*')
          .eq('userId', user.userId)
          .single();
          
        if (!error) {
          profile = data;
        }
      }
    }

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

