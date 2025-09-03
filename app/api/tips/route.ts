/**
 * API Route for managing tips
 */
import { NextRequest, NextResponse } from 'next/server';
import { recordTip, getCreatorTips } from '@/lib/database';
import { verifyTransaction } from '@/lib/bitquery';

/**
 * POST /api/tips - Record a new tip
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { senderAddress, receiverAddress, amount, currency, message, transactionHash } = body;

    // Validate required fields
    if (!senderAddress || !receiverAddress || !amount || !currency || !transactionHash) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify the transaction on-chain (optional but recommended)
    try {
      const txVerification = await verifyTransaction(transactionHash);
      if (!txVerification || !txVerification.success) {
        return NextResponse.json(
          { error: 'Transaction verification failed' },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error('Transaction verification error:', error);
      // Continue even if verification fails - we'll trust the client for now
    }

    // Record the tip in the database
    const tip = await recordTip({
      senderAddress,
      receiverAddress,
      amount: parseFloat(amount),
      currency,
      message,
      timestamp: new Date().toISOString(),
      transactionHash,
    });

    return NextResponse.json(tip);
  } catch (error) {
    console.error('Error recording tip:', error);
    return NextResponse.json(
      { error: 'Failed to record tip' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/tips?address={address} - Get tips for a creator
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { error: 'Address parameter is required' },
        { status: 400 }
      );
    }

    const tips = await getCreatorTips(address);
    return NextResponse.json(tips);
  } catch (error) {
    console.error('Error fetching tips:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tips' },
      { status: 500 }
    );
  }
}

