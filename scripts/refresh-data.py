#!/usr/bin/env python3
"""
mini-dashboard 数据刷新脚本
拉取真实 A 股行情 → 生成 public/data/market.json

数据源（AKShare 免费接口，2026-08 实测可用）：
  - 指数实时价   : 新浪 stock_zh_index_spot_sina
  - 行业板块涨跌 : 同花顺 stock_board_industry_summary_ths（自带领涨股）
  - 人民币汇率   : fx_spot_quote
  - 市场宽度     : 新浪全市场快照 stock_zh_a_spot（算涨跌家数）
  - 两融余额     : 上交所 stock_margin_sse（T-2 周滞后，仅展示不做方向判断）

用法：
  python3 scripts/refresh-data.py        # 生成 public/data/market.json
"""
import json
import warnings
import datetime
from pathlib import Path

import akshare as ak

warnings.filterwarnings("ignore")

OUT = Path(__file__).resolve().parent.parent / "public" / "data" / "market.json"

# 目标指数：name -> 新浪代码
INDICES = {
    "上证指数": "sh000001",
    "深证成指": "sz399001",
    "创业板指": "sz399006",
    "科创50": "sh000688",
}


def fnum(x):
    """安全转 float，numpy 类型也能序列化"""
    try:
        return round(float(x), 4)
    except (TypeError, ValueError):
        return 0.0


def get_indices():
    df = ak.stock_zh_index_spot_sina()
    df["代码"] = df["代码"].str.lower()
    out = []
    for name, code in INDICES.items():
        row = df[df["代码"] == code]
        if row.empty:
            continue
        r = row.iloc[0]
        out.append({
            "name": name,
            "code": code,
            "price": fnum(r["最新价"]),
            "change": fnum(r["涨跌幅"]),
            "prevClose": fnum(r["昨收"]),
        })
    return out


def get_sectors():
    """同花顺行业板块，取涨跌幅最猛的 6 个（涨前3 + 跌前3）"""
    df = ak.stock_board_industry_summary_ths()
    df = df.sort_values("涨跌幅", ascending=False)
    top = df.head(3)      # 涨幅前3
    bottom = df.tail(3)   # 跌幅前3
    picks = list(top.iterrows()) + list(bottom.iterrows())
    out = []
    for _, r in picks:
        out.append({
            "name": r["板块"],
            "change": fnum(r["涨跌幅"]),
            "leader": str(r["领涨股"]),
        })
    return out


def get_signals(indices):
    """信号摘要：汇率 / 市场宽度 / 成交额 / 两融"""
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    signals = []

    # 1. 人民币汇率 USD/CNY
    try:
        fx = ak.fx_spot_quote()
        usd = fx[fx["货币对"] == "USD/CNY"]
        if not usd.empty:
            rate = fnum(usd.iloc[0]["买报价"])
            direction = "bullish" if rate < 7.0 else ("bearish" if rate > 7.3 else "neutral")
            signals.append({
                "name": "人民币汇率 USD/CNY",
                "value": f"{rate:.4f}",
                "direction": direction,
                "updated": now,
            })
    except Exception as e:
        print(f"[warn] 汇率失败: {e}")

    # 2. 市场宽度（涨跌家数）
    try:
        spot = ak.stock_zh_a_spot()
        up = int((spot["涨跌幅"] > 0).sum())
        down = int((spot["涨跌幅"] < 0).sum())
        direction = "bullish" if up > down else "bearish"
        signals.append({
            "name": "市场宽度",
            "value": f"{up}涨 / {down}跌",
            "direction": direction,
            "updated": now,
        })
    except Exception as e:
        print(f"[warn] 市场宽度失败: {e}")

    # 3. 两市成交额（上证+深证成交额，亿元）
    try:
        spot_idx = ak.stock_zh_index_spot_sina()
        spot_idx["代码"] = spot_idx["代码"].str.lower()
        amt = 0.0
        for code in ("sh000001", "sz399001"):
            r = spot_idx[spot_idx["代码"] == code]
            if not r.empty:
                amt += float(r.iloc[0]["成交额"])
        amt_yi = amt / 1e8  # 元 -> 亿元
        direction = "bullish" if amt_yi > 15000 else ("bearish" if amt_yi < 10000 else "neutral")
        signals.append({
            "name": "两市成交额",
            "value": f"{amt_yi/10000:.2f}万亿",
            "direction": direction,
            "updated": now,
        })
    except Exception as e:
        print(f"[warn] 成交额失败: {e}")

    # 4. 两融余额（上交所，数据滞后，仅展示）
    try:
        today = datetime.date.today()
        start = (today - datetime.timedelta(days=30)).strftime("%Y%m%d")
        end = today.strftime("%Y%m%d")
        margin = ak.stock_margin_sse(start_date=start, end_date=end)
        if not margin.empty:
            latest = margin.iloc[-1]
            rzye = float(latest["融资融券余额"]) / 1e12  # 元 -> 万亿
            signals.append({
                "name": "两融余额(沪)",
                "value": f"{rzye:.2f}万亿",
                "direction": "neutral",
                "updated": str(latest["信用交易日期"]),
            })
    except Exception as e:
        print(f"[warn] 两融失败: {e}")

    return signals


def main():
    indices = get_indices()
    sectors = get_sectors()
    signals = get_signals(indices)

    data = {
        "indices": indices,
        "sectors": sectors,
        "signals": signals,
        "generatedAt": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"✅ 已生成 {OUT}")
    print(f"   指数 {len(indices)} 个 | 板块 {len(sectors)} 个 | 信号 {len(signals)} 个")
    print(json.dumps(data, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
