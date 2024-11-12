import { useState, useEffect } from 'react';
import { fetchXRPPrice } from '../services/api';

export function useXRPPrice() {
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [change24h, setChange24h] = useState<number>();
  const [lastPrice, setLastPrice] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    let lastUpdateTime = 0;
    const UPDATE_INTERVAL = 30000; // 30 seconds

    const updatePrice = async () => {
      try {
        const now = Date.now();
        if (now - lastUpdateTime < UPDATE_INTERVAL) return;

        setLoading(true);
        const newPrice = await fetchXRPPrice();
        
        if (mounted) {
          if (lastPrice !== null) {
            const change = ((newPrice - lastPrice) / lastPrice) * 100;
            setChange24h(change);
          }
          setLastPrice(price);
          setPrice(newPrice);
          setError(null);
          lastUpdateTime = now;
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch XRP price');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    updatePrice();
    const interval = setInterval(updatePrice, UPDATE_INTERVAL);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [price, lastPrice]);

  return { price, loading, error, change24h };
}