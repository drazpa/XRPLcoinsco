import { useState, useEffect } from 'react';
import { fetchServerStatus } from '../services/api';
import { XRPLMetaWebSocket } from '../services/websocket';

interface NetworkStats {
  tps: number;
  totalAccounts: number;
  totalTransactions: number;
  ledgerClosingTime: number;
  validatorCount: number;
  uniqueNodes: number;
  reserveBase: number;
  reserveInc: number;
  fees24h: number;
  successRate: number;
  networkVersion: string;
  amendments: string[];
  lastLedgerTime: number;
  ledgerIndex?: number;
  ledgerHash?: string;
}

export function useNetworkStats() {
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wsConnection, setWsConnection] = useState<XRPLMetaWebSocket | null>(null);

  useEffect(() => {
    let mounted = true;

    const handleStatsUpdate = (data: any) => {
      if (!mounted) return;

      setStats(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          lastLedgerTime: data.lastLedgerTime,
          ledgerIndex: data.ledgerIndex,
          ledgerHash: data.ledgerHash,
          totalTransactions: prev.totalTransactions + (data.txnCount || 0),
          reserveBase: data.reserveBase || prev.reserveBase,
          reserveInc: data.reserveInc || prev.reserveInc,
          tps: calculateTPS(data.txnCount, prev.ledgerClosingTime)
        };
      });
    };

    const initializeData = async () => {
      try {
        const serverStatus = await fetchServerStatus();
        
        const initialStats: NetworkStats = {
          tps: 0,
          totalAccounts: 0,
          totalTransactions: serverStatus.currentLedger.index * 1000,
          ledgerClosingTime: 0,
          validatorCount: 150,
          uniqueNodes: 200,
          reserveBase: 10,
          reserveInc: 2,
          fees24h: 0,
          successRate: 99.99,
          networkVersion: serverStatus.version,
          amendments: [],
          lastLedgerTime: Date.now(),
          ledgerIndex: serverStatus.currentLedger.index,
          ledgerHash: serverStatus.currentLedger.hash
        };

        if (mounted) {
          setStats(initialStats);
          setLoading(false);
          
          // Initialize WebSocket connection
          const ws = new XRPLMetaWebSocket(handleStatsUpdate);
          setWsConnection(ws);
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to fetch initial network data');
          setLoading(false);
        }
      }
    };

    initializeData();

    return () => {
      mounted = false;
      if (wsConnection) {
        wsConnection.disconnect();
      }
    };
  }, []);

  return { stats, loading, error };
}

function calculateTPS(txCount: number, closingTime: number): number {
  if (!txCount || !closingTime) return 0;
  const secondsBetweenLedgers = closingTime / 1000;
  return txCount / secondsBetweenLedgers;
}