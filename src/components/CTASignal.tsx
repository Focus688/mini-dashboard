import type { CtaData } from '../types';

function SignalBar({ value }: { value: number }) {
  // value ∈ [-1, 1]，映射到条形宽度
  const pct = Math.min(Math.abs(value) * 100, 100);
  const isUp = value >= 0;
  return (
    <div className="w-full h-2 bg-[#2a2a4a] rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${isUp ? 'bg-green-500/80' : 'bg-red-500/80'}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function CTASignal({ data }: { data: CtaData }) {
  return (
    <div className="bg-[#1a1a2e] rounded-xl p-5 shadow-lg border border-[#2a2a4a]">
      <h2 className="text-lg font-semibold text-gray-200 mb-1 flex items-center gap-2">
        <span className="w-1 h-5 bg-emerald-500 rounded-full inline-block" />
        CTA 趋势信号
        <span className="text-xs font-normal text-gray-500 ml-auto">综合 {data.signal > 0 ? '+' : ''}{data.signal.toFixed(3)}</span>
      </h2>
      <p className="text-sm text-gray-300 mb-4">{data.level}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {data.sectors.map((sec) => (
          <div key={sec.name} className="bg-[#151528] rounded-lg p-3 border border-[#2a2a4a]">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-gray-200 text-xs font-medium">{sec.name}</span>
              <span className={`font-mono text-xs font-semibold ${sec.signal >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {sec.signal >= 0 ? '+' : ''}{sec.signal.toFixed(2)}
              </span>
            </div>
            <SignalBar value={sec.signal} />
          </div>
        ))}
      </div>

      <div className="text-xs text-gray-500 mb-2 font-medium">期货方向（信号最强 8 个）</div>
      <div className="space-y-2">
        {data.futures.map((f) => (
          <div key={f.name} className="flex items-center justify-between py-1.5 border-b border-[#1f1f38] last:border-0">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${f.signal >= 0 ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-gray-200 text-sm">{f.name}</span>
              <span className="text-gray-500 text-xs">{f.sector}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`font-mono text-xs ${f.ret_60 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                60日 {f.ret_60 >= 0 ? '+' : ''}{f.ret_60.toFixed(1)}%
              </span>
              <span className={`font-mono text-sm font-semibold ${f.signal >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {f.signal >= 0 ? '多' : '空'} {Math.abs(f.signal).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
