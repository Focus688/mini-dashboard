import type { Signal } from '../types';

interface Props {
  signals: Signal[];
}

function DirectionBadge({ direction }: { direction: Signal['direction'] }) {
  const config = {
    bullish: { label: '多', bg: 'bg-green-500/20', text: 'text-green-400', dot: 'bg-green-400' },
    bearish: { label: '空', bg: 'bg-red-500/20', text: 'text-red-400', dot: 'bg-red-400' },
    neutral: { label: '中性', bg: 'bg-yellow-500/20', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  };

  const c = config[direction];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

export default function SignalSummary({ signals }: Props) {
  return (
    <div className="bg-[#1a1a2e] rounded-xl p-5 shadow-lg border border-[#2a2a4a]">
      <h2 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-purple-500 rounded-full inline-block" />
        信号摘要
      </h2>
      <div className="space-y-3">
        {signals.map((signal) => (
          <div
            key={signal.name}
            className="flex items-center justify-between p-3 rounded-lg bg-[#151528] border border-[#2a2a4a] hover:border-[#3a3a6a] transition-all"
          >
            <div className="flex-1 min-w-0">
              <div className="text-gray-200 text-sm font-medium truncate">{signal.name}</div>
              <div className="text-gray-500 text-xs mt-0.5">更新: {signal.updated}</div>
            </div>
            <div className="flex items-center gap-3 ml-3">
              <span className="text-gray-100 font-mono text-sm font-semibold">{signal.value}</span>
              <DirectionBadge direction={signal.direction} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
