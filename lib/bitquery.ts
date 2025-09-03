/**
 * Bitquery API Integration
 * 
 * This service provides integration with Bitquery's GraphQL API for Base blockchain,
 * enabling transaction verification and analytics.
 */

// Bitquery API configuration
const BITQUERY_API_URL = 'https://graphql.bitquery.io';
const BITQUERY_API_KEY = process.env.BITQUERY_API_KEY;

/**
 * Verifies a transaction on the Base blockchain
 * 
 * @param txHash The transaction hash to verify
 * @returns Transaction details if found
 */
export async function verifyTransaction(txHash: string) {
  const query = `
    query {
      ethereum(network: base) {
        transactions(txHash: {is: "${txHash}"}) {
          hash
          from {
            address
          }
          to {
            address
          }
          value
          gasValue
          gasPrice
          success
          timestamp {
            time(format: "%Y-%m-%d %H:%M:%S")
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(BITQUERY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': BITQUERY_API_KEY || '',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Bitquery API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.ethereum.transactions[0] || null;
  } catch (error) {
    console.error('Error verifying transaction:', error);
    throw error;
  }
}

/**
 * Gets all tips received by a creator
 * 
 * @param address The creator's address
 * @param tokenAddress The USDC token address
 * @param limit The maximum number of transactions to return
 * @returns Array of tip transactions
 */
export async function getCreatorTips(
  address: string,
  tokenAddress: string = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  limit: number = 100
) {
  const query = `
    query {
      ethereum(network: base) {
        transfers(
          options: {limit: ${limit}, desc: "block.timestamp.time"}
          currency: {is: "${tokenAddress}"}
          receiver: {is: "${address}"}
        ) {
          block {
            timestamp {
              time(format: "%Y-%m-%d %H:%M:%S")
            }
          }
          sender {
            address
          }
          receiver {
            address
          }
          transaction {
            hash
          }
          amount
          currency {
            symbol
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(BITQUERY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': BITQUERY_API_KEY || '',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Bitquery API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.ethereum.transfers || [];
  } catch (error) {
    console.error('Error getting creator tips:', error);
    throw error;
  }
}

/**
 * Gets tipping analytics for a creator
 * 
 * @param address The creator's address
 * @param tokenAddress The USDC token address
 * @param days Number of days to analyze
 * @returns Analytics data including total tips, unique tippers, etc.
 */
export async function getTippingAnalytics(
  address: string,
  tokenAddress: string = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  days: number = 30
) {
  const query = `
    query {
      ethereum(network: base) {
        transfers(
          currency: {is: "${tokenAddress}"}
          receiver: {is: "${address}"}
          time: {since: "${new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()}"}
        ) {
          count
          senders: count(uniq: sender)
          amount
          currency {
            symbol
          }
          days: count(uniq: date)
        }
      }
    }
  `;

  try {
    const response = await fetch(BITQUERY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': BITQUERY_API_KEY || '',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Bitquery API error: ${response.statusText}`);
    }

    const data = await response.json();
    const analytics = data.data.ethereum.transfers[0] || { count: 0, senders: 0, amount: 0, days: 0 };
    
    return {
      totalTips: analytics.count,
      uniqueTippers: analytics.senders,
      totalAmount: analytics.amount,
      currency: analytics.currency?.symbol || 'USDC',
      activeDays: analytics.days,
      averagePerDay: analytics.days > 0 ? analytics.amount / analytics.days : 0,
      averagePerTip: analytics.count > 0 ? analytics.amount / analytics.count : 0,
    };
  } catch (error) {
    console.error('Error getting tipping analytics:', error);
    throw error;
  }
}

