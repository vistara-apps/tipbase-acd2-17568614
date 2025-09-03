'use client';

import { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';

type AnalyticsData = {
  totalTips: number;
  totalAmount: number;
  uniqueTippers: number;
  averagePerTip: number;
  daysActive: number;
  averagePerDay: number;
  source: string;
  period: string;
};

export default function Analytics({ address }: { address: string }) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30); // Default to 30 days

  useEffect(() => {
    if (address) {
      fetchAnalytics(address, period);
    }
  }, [address, period]);

  const fetchAnalytics = async (addr: string, days: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics?address=${addr}&days=${days}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        console.error('Failed to fetch analytics');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Card className="mb-lg">
        <Typography variant="heading1" className="mb-md">Tipping Analytics</Typography>
        <Typography variant="body">Loading analytics...</Typography>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card className="mb-lg">
        <Typography variant="heading1" className="mb-md">Tipping Analytics</Typography>
        <Typography variant="body">No analytics available yet. Start receiving tips to see your stats!</Typography>
      </Card>
    );
  }

  return (
    <Card className="mb-lg">
      <div className="flex justify-between items-center mb-md">
        <Typography variant="heading1">Tipping Analytics</Typography>
        <div className="flex space-x-xs">
          <Button 
            variant={period === 7 ? 'primary' : 'secondary'} 
            onClick={() => setPeriod(7)}
            className="text-xs py-xs px-sm"
          >
            7d
          </Button>
          <Button 
            variant={period === 30 ? 'primary' : 'secondary'} 
            onClick={() => setPeriod(30)}
            className="text-xs py-xs px-sm"
          >
            30d
          </Button>
          <Button 
            variant={period === 90 ? 'primary' : 'secondary'} 
            onClick={() => setPeriod(90)}
            className="text-xs py-xs px-sm"
          >
            90d
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-md mb-md">
        <div className="bg-bg p-md rounded-md">
          <Typography variant="caption">Total Tips</Typography>
          <Typography variant="heading1">{analytics.totalTips}</Typography>
        </div>
        <div className="bg-bg p-md rounded-md">
          <Typography variant="caption">Total Amount</Typography>
          <Typography variant="heading1">{analytics.totalAmount.toFixed(2)} USDC</Typography>
        </div>
        <div className="bg-bg p-md rounded-md">
          <Typography variant="caption">Unique Tippers</Typography>
          <Typography variant="heading1">{analytics.uniqueTippers}</Typography>
        </div>
        <div className="bg-bg p-md rounded-md">
          <Typography variant="caption">Avg. Per Tip</Typography>
          <Typography variant="heading1">{analytics.averagePerTip.toFixed(2)} USDC</Typography>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <Typography variant="caption">Days Active</Typography>
          <Typography variant="body">{analytics.daysActive}</Typography>
        </div>
        <div>
          <Typography variant="caption">Avg. Per Day</Typography>
          <Typography variant="body">{analytics.averagePerDay.toFixed(2)} USDC</Typography>
        </div>
        <div>
          <Typography variant="caption">Data Source</Typography>
          <Typography variant="body">{analytics.source}</Typography>
        </div>
      </div>
    </Card>
  );
}

