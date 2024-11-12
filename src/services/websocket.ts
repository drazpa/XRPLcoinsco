import { Token } from '../types/token';
import { fetchTokens, fetchXRPPrice } from './api';

// WebSocket configuration with timeouts and fallbacks
const WEBSOCKET_CONFIG = {
  endpoints: [
    { url: 'wss://s2.ripple.com/', timeout: 5000 },
    { url: 'wss://s1.ripple.com/', timeout: 5000 },
    { url: 'wss://xrplcluster.com/', timeout: 8000 },
    { url: 'wss://xrpl.ws/', timeout: 8000 }
  ],
  reconnectDelay: 2000,
  maxReconnectAttempts: 5,
  pingInterval: 10000,
  connectionTimeout: 5000
};

export class XRPLMetaWebSocket {
  private updateInterval: NodeJS.Timeout | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private pingInterval: NodeJS.Timeout | null = null;
  private connectionTimeout: NodeJS.Timeout | null = null;
  private lastUpdateTime: number = 0;
  private updateThrottle: number = 10000; // 10 seconds
  private onTokensUpdate: (tokens: Token[]) => void;
  private previousPrices: Record<string, number> = {};
  private isInitialized: boolean = false;
  private currentEndpointIndex: number = 0;
  private wsConnection: WebSocket | null = null;
  private reconnectAttempts: number = 0;
  private isConnecting: boolean = false;

  constructor(onTokensUpdate: (tokens: Token[]) => void) {
    this.onTokensUpdate = onTokensUpdate;
    this.initialize().catch(error => {
      console.error('Failed to initialize token updates:', error);
    });
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      this.isInitialized = true;
      await this.fetchLatestData();
      this.connectWebSocket();
      this.startPolling();
    } catch (error) {
      this.isInitialized = false;
      console.error('Error during initialization:', error);
      this.scheduleReconnect();
    }
  }

  private connectWebSocket(): void {
    if (this.isConnecting || this.reconnectAttempts >= WEBSOCKET_CONFIG.maxReconnectAttempts) {
      return;
    }

    this.isConnecting = true;
    const endpoint = WEBSOCKET_CONFIG.endpoints[this.currentEndpointIndex];

    try {
      if (this.wsConnection) {
        this.wsConnection.close();
      }

      this.wsConnection = new WebSocket(endpoint.url);

      // Set connection timeout
      this.connectionTimeout = setTimeout(() => {
        if (this.wsConnection?.readyState !== WebSocket.OPEN) {
          this.handleConnectionFailure();
        }
      }, endpoint.timeout);

      this.wsConnection.onopen = () => {
        console.log(`Connected to ${endpoint.url}`);
        this.clearTimeouts();
        this.isConnecting = false;
        this.reconnectAttempts = 0;

        // Subscribe to ledger stream
        if (this.wsConnection?.readyState === WebSocket.OPEN) {
          this.wsConnection.send(JSON.stringify({
            command: 'subscribe',
            streams: ['ledger']
          }));

          // Keep connection alive with ping
          this.pingInterval = setInterval(() => {
            if (this.wsConnection?.readyState === WebSocket.OPEN) {
              this.wsConnection.send(JSON.stringify({ command: 'ping' }));
            }
          }, WEBSOCKET_CONFIG.pingInterval);
        }
      };

      this.wsConnection.onmessage = this.handleWebSocketMessage.bind(this);
      this.wsConnection.onerror = () => this.handleConnectionFailure();
      this.wsConnection.onclose = () => this.handleConnectionFailure();

    } catch (error) {
      console.error('Error establishing WebSocket connection:', error);
      this.handleConnectionFailure();
    }
  }

  private handleWebSocketMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'ledgerClosed') {
        this.updateNetworkStats(data);
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  }

  private handleConnectionFailure(): void {
    this.clearTimeouts();
    this.isConnecting = false;
    this.wsConnection = null;

    if (this.reconnectAttempts < WEBSOCKET_CONFIG.maxReconnectAttempts) {
      this.currentEndpointIndex = (this.currentEndpointIndex + 1) % WEBSOCKET_CONFIG.endpoints.length;
      this.reconnectAttempts++;
      this.scheduleReconnect();
    }
  }

  private clearTimeouts(): void {
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private scheduleReconnect(): void {
    const delay = Math.min(
      WEBSOCKET_CONFIG.reconnectDelay * Math.pow(2, this.reconnectAttempts),
      30000 // Max 30 seconds
    );

    this.reconnectTimeout = setTimeout(() => {
      this.connectWebSocket();
    }, delay);
  }

  private async fetchLatestData(): Promise<void> {
    try {
      const [tokens, xrpPrice] = await Promise.all([
        fetchTokens(),
        fetchXRPPrice()
      ]);

      if (!Array.isArray(tokens)) {
        throw new Error('Invalid tokens data received');
      }

      const updatedTokens = tokens.map(token => {
        const tokenId = `${token.currency}-${token.issuer}`;
        const currentPrice = token.priceUSD;
        const previousPrice = this.previousPrices[tokenId] || currentPrice;
        this.previousPrices[tokenId] = currentPrice;

        return {
          ...token,
          priceIncreased: currentPrice > previousPrice,
          priceDecreased: currentPrice < previousPrice
        };
      });

      const sortedTokens = updatedTokens
        .sort((a, b) => (b.volume24h || 0) - (a.volume24h || 0))
        .slice(0, 100);

      this.onTokensUpdate(sortedTokens);
      this.lastUpdateTime = Date.now();
    } catch (error) {
      console.error('Error fetching token data:', error);
      throw error;
    }
  }

  private startPolling(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    this.updateInterval = setInterval(async () => {
      const now = Date.now();
      if (now - this.lastUpdateTime >= this.updateThrottle) {
        try {
          await this.fetchLatestData();
        } catch (error) {
          console.error('Error during polling update:', error);
        }
      }
    }, this.updateThrottle);
  }

  public disconnect(): void {
    this.clearTimeouts();
    
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }

    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }

    this.isInitialized = false;
  }
}