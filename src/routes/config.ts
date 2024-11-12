import { 
  BarChart2, 
  Coins, 
  Star, 
  TrendingUp, 
  Wallet, 
  ArrowRightLeft,
  LayoutDashboard,
  Network
} from 'lucide-react';
import { RouteConfig } from './types';
import { FeaturedCoins } from '../pages/FeaturedCoins';
import { AllCoins } from '../pages/AllCoins';
import { Portfolio } from '../pages/Portfolio';
import { XRPLStats } from '../pages/XRPLStats';
import { Dex } from '../pages/Dex';
import { Dashboard } from '../pages/Dashboard';
import { NetworkStats } from '../pages/NetworkStats';
import { Top100 } from '../pages/Top100';

export const routes: RouteConfig[] = [
  {
    path: '/dashboard',
    element: Dashboard,
    title: 'Dashboard',
    icon: LayoutDashboard,
    showInNav: true
  },
  {
    path: '/featured',
    element: FeaturedCoins,
    title: 'Featured Coins',
    icon: Star,
    showInNav: true
  },
  {
    path: '/all-coins',
    element: AllCoins,
    title: 'All XRPL Coins',
    icon: Coins,
    showInNav: true
  },
  {
    path: '/top-100',
    element: Top100,
    title: 'Top 100',
    icon: TrendingUp,
    showInNav: true
  },
  {
    path: '/portfolio',
    element: Portfolio,
    title: 'Portfolio',
    icon: Wallet,
    showInNav: true
  },
  {
    path: '/network',
    element: NetworkStats,
    title: 'Network Stats',
    icon: Network,
    showInNav: true
  },
  {
    path: '/stats',
    element: XRPLStats,
    title: 'XRPL Stats',
    icon: BarChart2,
    showInNav: true
  },
  {
    path: '/dex',
    element: Dex,
    title: 'DEX',
    icon: ArrowRightLeft,
    showInNav: true
  }
];