import { useState, useEffect, useCallback } from 'react';
import { Token } from '../types/token';
import { fetchAllTokens } from '../services/api';
import { XRPLMetaWebSocket } from '../services/websocket';

const ITEMS_PER_PAGE = 50;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache
const MAX_SEARCHABLE_TOKENS = 30000;
const UPDATE_INTERVAL = 10000; // 10 seconds

export function useAllTokens() {
  const [allTokens, setAllTokens] = useState<Token[]>([]);
  const [displayedTokens, setDisplayedTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('tokenFavorites');
    return new Set(saved ? JSON.parse(saved) : []);
  });

  // WebSocket connection for real-time updates
  useEffect(() => {
    const ws = new XRPLMetaWebSocket((data: any) => {
      setAllTokens(prevTokens => {
        return prevTokens.map(token => {
          const updatedData = data[token.currency];
          if (!updatedData) return token;

          return {
            ...token,
            priceUSD: updatedData.price || token.priceUSD,
            volume24h: updatedData.volume_24h || token.volume24h,
            change24h: updatedData.change_24h || token.change24h,
            priceIncreased: updatedData.price > token.priceUSD,
            priceDecreased: updatedData.price < token.priceUSD
          };
        });
      });
    });

    return () => {
      ws.disconnect();
    };
  }, []);

  // Initial data fetch and polling
  useEffect(() => {
    let mounted = true;
    let pollInterval: NodeJS.Timeout;

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchAllTokens();
        
        if (mounted) {
          setAllTokens(data);
          if (!searchTerm) {
            setDisplayedTokens(data.slice(0, ITEMS_PER_PAGE));
          }
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch tokens');
          setLoading(false);
        }
      }
    };

    fetchData();
    pollInterval = setInterval(fetchData, UPDATE_INTERVAL);

    return () => {
      mounted = false;
      clearInterval(pollInterval);
    };
  }, [searchTerm]);

  // Search functionality
  useEffect(() => {
    if (!allTokens.length) return;

    const worker = new Worker(new URL('../workers/search.worker.ts', import.meta.url));
    
    worker.onmessage = (e) => {
      setDisplayedTokens(e.data);
      worker.terminate();
    };

    worker.postMessage({
      tokens: allTokens.slice(0, MAX_SEARCHABLE_TOKENS),
      searchTerm,
      limit: searchTerm ? undefined : ITEMS_PER_PAGE
    });

    return () => worker.terminate();
  }, [allTokens, searchTerm]);

  const toggleFavorite = useCallback((tokenId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(tokenId)) {
        newFavorites.delete(tokenId);
      } else {
        newFavorites.add(tokenId);
      }
      localStorage.setItem('tokenFavorites', JSON.stringify([...newFavorites]));
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback((tokenId: string) => {
    return favorites.has(tokenId);
  }, [favorites]);

  const refetch = useCallback(() => {
    setIsRefreshing(true);
    return fetchAllTokens().then(data => {
      setAllTokens(data);
      if (!searchTerm) {
        setDisplayedTokens(data.slice(0, ITEMS_PER_PAGE));
      }
      setIsRefreshing(false);
    }).catch(err => {
      setError(err instanceof Error ? err.message : 'Failed to fetch tokens');
      setIsRefreshing(false);
    });
  }, [searchTerm]);

  return {
    tokens: displayedTokens,
    loading,
    error,
    refetch,
    isRefreshing,
    toggleFavorite,
    isFavorite,
    searchTerm,
    setSearchTerm,
    totalTokens: allTokens.length,
    searchableTokens: MAX_SEARCHABLE_TOKENS
  };
}