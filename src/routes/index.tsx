import { Routes, Route } from 'react-router-dom';
import { AllCoins } from '../pages/AllCoins';
import { FeaturedCoins } from '../pages/FeaturedCoins';
import { Portfolio } from '../pages/Portfolio';
import { XRPLStats } from '../pages/XRPLStats';
import { Dex } from '../pages/Dex';
import { Dashboard } from '../pages/Dashboard';
import { NetworkStats } from '../pages/NetworkStats';
import { Top100 } from '../pages/Top100';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/featured" element={<FeaturedCoins />} />
      <Route path="/all-coins" element={<AllCoins />} />
      <Route path="/top-100" element={<Top100 />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/network" element={<NetworkStats />} />
      <Route path="/stats" element={<XRPLStats />} />
      <Route path="/dex" element={<Dex />} />
    </Routes>
  );
};