import { useState, useEffect, useCallback } from 'react';

interface XRPLMetrics {
  tps: number;
  txCount: number;
  ledgerIndex: number;
  tpsHistory: Array<{ time: number; value: number }>;
  ledgerHistory: Array<{ time: number; value: number }>;
  loadHistory: Array<{ time: number; value: number }>;
  consensusHistory: Array<{ time: number; value: number }>;
  lastLedgerTime: number;
  consensusPhase: string;
  validatorCount: number;
  networkLoad: number;
  feeStats: {
    avgFee: number;
    minFee: number;
    maxFee: number;
  };
  validationTime: number;
  peerCount: number;
  reserveBase: number;
  reserveInc: number;
  consensusRound: {
    phase: string;
    proposers: number;
    validations: number;
    roundTime: number;
  };
}

const WEBSOCKET_ENDPOINTS = [
  'wss://xrplcluster.com/',
  'wss://s1.ripple.com/',
  'wss://s2.ripple.com/'
];

const MAX_HISTORY_POINTS = 60; // 1 minute of data at 1 second intervals
const UPDATE_INTERVAL = 1000; // Update every second
const RECONNECT_DELAY = 2000;
const MAX_RECONNECT_ATTEMPTS = 3;

export function useXRPLWebSocket() {
  const [metrics, setMetrics] = useState<XRPLMetrics>({
    tps: 0,
    txCount: 0,
    ledgerIndex: 0,
    tpsHistory: [],
    ledgerHistory: [],
    loadHistory: [],
    consensusHistory: [],
    lastLedgerTime: Date.now(),
    consensusPhase: 'unknown',
    validatorCount: 150,
    networkLoad: 0,
    feeStats: {
      avgFee: 0.000012,
      minFee: 0.000010,
      maxFee: 0.000015
    },
    validationTime: 0,
    peerCount: 200,
    reserveBase: 10,
    reserveInc: 2,
    consensusRound: {
      phase: 'unknown',
      proposers: 0,
      validations: 0,
      roundTime: 0
    }
  });

  const [currentEndpoint, setCurrentEndpoint] = useState(0);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const updateMetrics = useCallback((data: any) => {
    const now = Date.now();
    setMetrics(prev => {
      const timeDiff = (now - prev.lastLedgerTime) / 1000;
      const newTps = data.txn_count ? data.txn_count / timeDiff : prev.tps;
      const loadFactor = data.load_factor ? data.load_factor / 256 : prev.networkLoad;

      // Helper to maintain fixed-size history
      const updateHistory = (history: typeof prev.tpsHistory, newValue: number) => {
        const newHistory = [...history, { time: now / 1000, value: newValue }];
        return newHistory.slice(-MAX_HISTORY_POINTS);
      };

      return {
        ...prev,
        tps: newTps,
        txCount: data.total_coins || prev.txCount,
        ledgerIndex: data.ledger_index || prev.ledgerIndex,
        lastLedgerTime: now,
        consensusPhase: data.consensus_phase || prev.consensusPhase,
        validatorCount: data.validator_count || prev.validatorCount,
        networkLoad: loadFactor,
        feeStats: {
          avgFee: data.avg_fee || prev.feeStats.avgFee,
          minFee: data.min_fee || prev.feeStats.minFee,
          maxFee: data.max_fee || prev.feeStats.maxFee
        },
        validationTime: timeDiff,
        peerCount: data.peer_count || prev.peerCount,
        consensusRound: {
          phase: data.consensus_phase || prev.consensusRound.phase,
          proposers: data.proposers || prev.consensusRound.proposers,
          validations: data.validations || prev.consensusRound.validations,
          roundTime: data.round_time || prev.consensusRound.roundTime
        },
        tpsHistory: updateHistory(prev.tpsHistory, newTps),
        ledgerHistory: updateHistory(prev.ledgerHistory, prev.ledgerIndex),
        loadHistory: updateHistory(prev.loadHistory, loadFactor * 100),
        consensusHistory: updateHistory(prev.consensusHistory, timeDiff)
      };
    });
  }, []);

  // WebSocket connection management
  useEffect(() => {
    let pingInterval: NodeJS.Timeout;
    let updateInterval: NodeJS.Timeout;

    const connect = () => {
      if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.error('Max reconnection attempts reached');
        return;
      }

      const newWs = new WebSocket(WEBSOCKET_ENDPOINTS[currentEndpoint]);

      newWs.onopen = () => {
        setReconnectAttempts(0);
        setWs(newWs);

        // Subscribe to relevant streams
        newWs.send(JSON.stringify({
          command: 'subscribe',
          streams: ['ledger', 'server', 'consensus', 'peer_status', 'validation']
        }));

        // Keep connection alive
        pingInterval = setInterval(() => {
          if (newWs.readyState === WebSocket.OPEN) {
            newWs.send(JSON.stringify({ command: 'ping' }));
          }
        }, 30000);

        // Regular metrics updates
        updateInterval = setInterval(() => {
          updateMetrics({});
        }, UPDATE_INTERVAL);
      };

      newWs.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'ledgerClosed' || 
              data.type === 'consensusPhase' || 
              data.type === 'peerStatus' || 
              data.type === 'validationReceived') {
            updateMetrics(data);
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };

      newWs.onclose = () => {
        setWs(null);
        clearInterval(pingInterval);
        clearInterval(updateInterval);

        setTimeout(() => {
          setCurrentEndpoint((prev) => (prev + 1) % WEBSOCKET_ENDPOINTS.length);
          setReconnectAttempts((prev) => prev + 1);
        }, RECONNECT_DELAY);
      };

      newWs.onerror = () => {
        newWs.close();
      };
    };

    connect();

    return () => {
      if (ws) {
        ws.close();
      }
      clearInterval(pingInterval);
      clearInterval(updateInterval);
    };
  }, [currentEndpoint, reconnectAttempts, updateMetrics]);

  return metrics;
}