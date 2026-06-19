import type { Index } from '../types';

interface Props {
  indices: Index[];
}

export default function MarketIndices({ indices }: Props) {
  return (
    <div className="bg-[#1a1a2e] rounded-xl p-5 shadow-lg border border-[#2a2a4a]">
      <h2 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-blue-500 rounded-full inline-block" />
        大盘指数
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-[#2a2a4a]">
              <th className="text-left py-2 font-medium">指数</th>
              <th className="text-right py-2 font-medium">当前价</th>
              <th className="text-right py-2 font-medium">涨跌幅</th>
              <th className="text-right py-2 font-medium hidden sm:table-cell">昨收</th>
            </tr>
          </thead>
          <tbody>
            {indices.map((idx) => {
              const isUp = idx.change >= 0;
              return (
                <tr key={idx.code} className="border-b border-[#1f1f38] hover:bg-[#222244] transition-colors">
                  <td className="py-3 pr-4">
                    <div className="text-gray-100 font-medium">{idx.name}</div>
                    <div className="text-gray-500 text-xs">{idx.code}</div>
                  </td>
                  <td className="py-3 text-right font-mono text-gray-100">{idx.price.toFixed(2)}</td>
                  <td className={`py-3 text-right font-mono font-semibold ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                    {isUp ? '+' : ''}{idx.change.toFixed(2)}%
                  </td>
                  <td className="py-3 text-right font-mono text-gray-400 hidden sm:table-cell">{idx.prevClose.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
