import type { QlibData, StockSignal } from '../types';

function StockRow({ s }: { s: StockSignal }) {
  return (
    <tr className="border-b border-[#1f1f38] hover:bg-[#222244] transition-colors">
      <td className="py-2.5 pr-3">
        <div className="text-gray-100 font-medium text-sm">{s.name}</div>
        <div className="text-gray-500 text-xs">{s.code}</div>
      </td>
      <td className="py-2.5 text-right font-mono text-sm text-gray-100">
        {s.score > 0 ? '+' : ''}{s.score.toFixed(4)}
      </td>
      <td className="py-2.5 text-right font-mono text-xs text-gray-300 hidden sm:table-cell">
        {s.roe !== null && s.roe !== undefined ? `${s.roe.toFixed(1)}%` : '—'}
      </td>
      <td className="py-2.5 text-right font-mono text-xs hidden md:table-cell">
        {s.profit_growth !== null && s.profit_growth !== undefined ? (
          <span className={s.profit_growth >= 0 ? 'text-green-400' : 'text-red-400'}>
            {s.profit_growth >= 0 ? '+' : ''}{s.profit_growth.toFixed(1)}%
          </span>
        ) : '—'}
      </td>
      <td className="py-2.5 pl-3 text-xs text-gray-400 hidden lg:table-cell max-w-[220px] truncate" title={s.reason}>
        {s.reason}
      </td>
    </tr>
  );
}

export default function QlibPicks({ data }: { data: QlibData }) {
  return (
    <div className="bg-[#1a1a2e] rounded-xl p-5 shadow-lg border border-[#2a2a4a]">
      <h2 className="text-lg font-semibold text-gray-200 mb-1 flex items-center gap-2">
        <span className="w-1 h-5 bg-blue-500 rounded-full inline-block" />
        Qlib 多空选股
        <span className="text-xs font-normal text-gray-500 ml-auto">数据日 {data.date}</span>
      </h2>
      <p className="text-xs text-gray-500 mb-4">LGB 多因子模型 · 沪深300池 · 波动/动量/形态因子归因</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-[#2a2a4a]">
              <th className="text-left py-2 font-medium">标的</th>
              <th className="text-right py-2 font-medium">评分</th>
              <th className="text-right py-2 font-medium hidden sm:table-cell">ROE</th>
              <th className="text-right py-2 font-medium hidden md:table-cell">利润增速</th>
              <th className="text-left py-2 pl-3 font-medium hidden lg:table-cell">理由</th>
            </tr>
          </thead>
          <tbody>
            {data.top.map((s) => <StockRow key={s.code} s={s} />)}
          </tbody>
        </table>
      </div>
      <div className="mt-3 mb-1 flex items-center gap-2">
        <span className="text-xs font-semibold text-red-400">▼ 空头（模型看空）</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <tbody>
            {data.bottom.slice(0, 5).map((s) => <StockRow key={s.code} s={s} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
