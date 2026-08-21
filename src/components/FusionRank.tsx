import type { FusionData } from '../types';

export default function FusionRank({ data }: { data: FusionData }) {
  const maxScore = Math.max(...data.ranked.map((r) => r.score), 0.01);
  return (
    <div className="bg-[#1a1a2e] rounded-xl p-5 shadow-lg border border-[#2a2a4a]">
      <h2 className="text-lg font-semibold text-gray-200 mb-1 flex items-center gap-2">
        <span className="w-1 h-5 bg-purple-500 rounded-full inline-block" />
        五源融合榜单
        <span className="text-xs font-normal text-gray-500 ml-auto">{data.week}</span>
      </h2>
      <p className="text-xs text-gray-500 mb-4">
        Qlib 量化 + CTA 趋势 + Vibe + 基金池 + 组合引擎 归一化融合 · 更新 {data.date}
      </p>
      <div className="space-y-2.5">
        {data.ranked.map((r, i) => (
          <div key={r.code + r.name} className="flex items-center gap-3">
            <span className="w-5 text-right font-mono text-xs text-gray-500">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-gray-200 text-sm font-medium truncate">{r.name}</span>
                  <span className="text-gray-500 text-xs shrink-0">{r.code}</span>
                </div>
                <span className="font-mono text-sm font-semibold text-gray-100 ml-2 shrink-0">
                  {r.score.toFixed(3)}
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#2a2a4a] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                  style={{ width: `${(r.score / maxScore) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
