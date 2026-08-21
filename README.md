# mini-dashboard 📊

个人 A 股投资看板 —— 大盘指数、行业板块、市场信号的**真实数据**可视化。

数据由 [AKShare](https://akshare.akfamily.xyz/) 免费接口实时拉取，无需任何付费行情源。

## ✨ 功能

| 模块 | 内容 |
|------|------|
| 📈 大盘指数 | 上证 / 深证 / 创业板 / 科创50 实时价、涨跌幅、昨收 |
| 🔥 板块涨跌 | 涨跌幅最猛的 6 个行业板块（涨前3 + 跌前3）+ 领涨股 |
| 📡 信号摘要 | 人民币汇率 / 市场宽度 / 两市成交额 / 两融余额，带多空方向标记 |

## 🔄 数据刷新

看板数据存在 `public/data/market.json`，由脚本一键刷新：

```bash
pip install akshare
python3 scripts/refresh-data.py
```

刷新后重新构建部署即可看到最新行情。可配合 cron / GitHub Actions 每日自动刷新。

### 数据源（均为免费接口）

| 数据 | 接口 |
|------|------|
| 指数实时价 | 新浪 `stock_zh_index_spot_sina` |
| 行业板块 | 同花顺 `stock_board_industry_summary_ths` |
| 人民币汇率 | `fx_spot_quote` |
| 市场宽度 | 新浪全市场快照 `stock_zh_a_spot` |
| 两融余额 | 上交所 `stock_margin_sse` |

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

本项目仅作行情展示与个人研究用途，**不构成任何投资建议**。数据存在延迟，请以交易所官方数据为准。

## License

MIT
