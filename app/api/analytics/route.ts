/**
 * API Route for creator analytics
 */
import { NextRequest, NextResponse } from 'next/server';
import { getCreatorTipAnalytics } from '@/lib/database';
import { getTippingAnalytics } from '@/lib/bitquery';

/**
 * GET /api/analytics?address={address} - Get tipping analytics for a creator
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get('address');
    const days = searchParams.get('days') ? parseInt(searchParams.get('days')!) : 30;

    if (!address) {
      return NextResponse.json(
        { error: 'Address parameter is required' },
        { status: 400 }
      );
    }

    // Get analytics from our database
    const dbAnalytics = await getCreatorTipAnalytics(address);
    
    // Try to get on-chain analytics as well (if API key is configured)
    let onChainAnalytics = null;
    try {
      if (process.env.BITQUERY_API_KEY) {
        onChainAnalytics = await getTippingAnalytics(address, undefined, days);
      }
    } catch (error) {
      console.error('Error fetching on-chain analytics:', error);
      // Continue with just the database analytics
    }

    // Combine the analytics data, preferring on-chain data when available
    const analytics = {
      ...dbAnalytics,
      // If we have on-chain data, use it for these metrics
      ...(onChainAnalytics && {
        totalTips: onChainAnalytics.totalTips,
        totalAmount: onChainAnalytics.totalAmount,
        uniqueTippers: onChainAnalytics.uniqueTippers,
        averagePerTip: onChainAnalytics.averagePerTip,
      }),
      // Include both sources
      source: onChainAnalytics ? 'hybrid' : 'database',
      period: `${days} days`,
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

