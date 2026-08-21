# mini-dashboard 📊

个人 A 股投资策略看板 —— 把三个量化引擎的信号集中到一块可视化。

| 引擎 | 信号 |
|------|------|
| 🎯 Qlib 多空选股 | LGB 多因子模型，沪深300 池 Top10 多头 + Bottom 空头（含 ROE/利润增速/因子归因） |
| 📉 CTA 趋势跟踪 | 15 个期货品种趋势 + 7 大板块方向，综合多空信号 |
| 🧠 五源融合榜单 | Qlib + CTA + Vibe + 基金池 + 组合引擎归一化融合排名 |

## 🔄 数据刷新

策略信号来自本机三个引擎的每日输出，由脚本一键整合：

```bash
pip install akshare
python3 scripts/refresh-strategy.py
```

脚本读取：

| 数据 | 路径 |
|------|------|
| Qlib 多空选股 | `~/.hermes/output/qlib-picks/daily_picks.json` |
| CTA 趋势信号 | `~/.hermes/output/cta/cta_signals.json` |
| 五源融合榜单 | `~/.hermes/output/fusion/history.json` |
| 大盘指数 | AKShare 新浪实时行情 |

刷新后重新构建部署即可。

## 🚀 本地运行

```bash
npm install
npm run dev
```

## 💻 技术栈

- React 19 + TypeScript
- Vite 6
- Tailwind CSS（暗色主题）

## ⚠️ 免责声明

本项目仅作个人策略信号展示与研究用途，**不构成任何投资建议**。信号来自量化模型，存在误差与失效风险，请自行判断。

## License

MIT
