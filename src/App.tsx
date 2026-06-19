import { useEffect, useState } from 'react';
import type { MarketData } from './types';
import Header from './components/Header';
import MarketIndices from './components/MarketIndices';
import SectorMovers from './components/SectorMovers';
import SignalSummary from './components/SignalSummary';

function App() {
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('./data/market.json')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: MarketData) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
        <div className="text-gray-400 text-lg animate-pulse">加载中...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
        <div className="text-red-400 text-lg">数据加载失败: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <Header />
      <main className="max-w-6xl mx-auto px-4 pb-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MarketIndices indices={data.indices} />
          <SectorMovers sectors={data.sectors} />
        </div>
        <SignalSummary signals={data.signals} />
      </main>
      <footer className="text-center py-4 text-gray-600 text-xs border-t border-[#1a1a2e]">
        数据仅作演示用途 · 模拟数据来自 market.json
      </footer>
    </div>
  );
}

export default App;
