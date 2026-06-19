import type { Sector } from '../types';

interface Props {
  sectors: Sector[];
}

export default function SectorMovers({ sectors }: Props) {
  const maxAbsChange = Math.max(...sectors.map((s) => Math.abs(s.change)), 0.1);

  return (
    <div className="bg-[#1a1a2e] rounded-xl p-5 shadow-lg border border-[#2a2a4a]">
      <h2 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-emerald-500 rounded-full inline-block" />
        板块涨跌
      </h2>
      <div className="space-y-3">
        {sectors.map((sector) => {
          const isUp = sector.change >= 0;
          const barWidth = (Math.abs(sector.change) / maxAbsChange) * 100;
          return (
            <div key={sector.name}>
              <div className="flex justify-between items-center mb-1">
                <div>
                  <span className="text-gray-200 text-sm font-medium">{sector.name}</span>
                  <span className="text-gray-500 text-xs ml-2">领涨: {sector.leader}</span>
                </div>
                <span className={`font-mono text-sm font-semibold ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                  {isUp ? '+' : ''}{sector.change.toFixed(2)}%
                </span>
              </div>
              <div className="w-full h-2 bg-[#2a2a4a] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${isUp ? 'bg-green-500/80' : 'bg-red-500/80'}`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
