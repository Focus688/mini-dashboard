#!/usr/bin/env python3
"""
mini-dashboard 策略信号刷新脚本
读取本机三个策略引擎的信号输出 + AKShare 指数，生成 public/data/strategy.json

数据源：
  - Qlib 多空选股  : ~/.hermes/output/qlib-picks/daily_picks.json
  - CTA 趋势信号   : ~/.hermes/output/cta/cta_signals.json
  - 五源融合榜单   : ~/.hermes/output/fusion/history.json
  - 大盘指数       : AKShare 新浪 stock_zh_index_spot_sina

用法：
  python3 scripts/refresh-strategy.py
"""
import json
import datetime
import warnings
from pathlib import Path

import akshare as ak

warnings.filterwarnings("ignore")

BASE = Path.home() / ".hermes" / "output"
OUT = Path(__file__).resolve().parent.parent / "public" / "data" / "strategy.json"

INDICES = {
    "上证指数": "sh000001",
    "深证成指": "sz399001",
    "创业板指": "sz399006",
    "科创50": "sh000688",
}


def fnum(x, nd=4):
    try:
        return round(float(x), nd)
    except (TypeError, ValueError):
        return None


def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as e:
        print(f"[warn] 读取 {path} 失败: {e}")
        return None


def get_indices():
    try:
        df = ak.stock_zh_index_spot_sina()
        df["代码"] = df["代码"].str.lower()
        out = []
        for name, code in INDICES.items():
            row = df[df["代码"] == code]
            if row.empty:
                continue
            r = row.iloc[0]
            out.append({
                "name": name, "code": code,
                "price": fnum(r["最新价"]), "change": fnum(r["涨跌幅"]),
                "prevClose": fnum(r["昨收"]),
            })
        return out
    except Exception as e:
        print(f"[warn] 指数失败: {e}")
        return []


def get_qlib():
    d = load_json(BASE / "qlib-picks" / "daily_picks.json")
    if not d:
        return None
    def slim(items):
        out = []
        for s in items:
            f = s.get("fund") or {}
            out.append({
                "name": s.get("name"), "code": s.get("code"),
                "score": fnum(s.get("score"), 4),
                "reason": s.get("reason", ""),
                "roe": fnum(f.get("roe"), 1),
                "profit_growth": fnum(f.get("profit_growth"), 1),
            })
        return out
    return {
        "date": d.get("date"),
        "top": slim(d.get("top10", [])),
        "bottom": slim(d.get("bottom10", [])),
    }


def get_cta():
    d = load_json(BASE / "cta" / "cta_signals.json")
    if not d:
        return None
    sectors = d.get("sector_signals") or {}
    futures = []
    for f in d.get("futures_signals", []):
        futures.append({
            "name": f.get("name"), "sector": f.get("sector"),
            "signal": fnum(f.get("signal"), 2), "ret_60": fnum(f.get("ret_60"), 2),
        })
    # 按信号强度排序，取前 8
    futures.sort(key=lambda x: abs(x["signal"] or 0), reverse=True)
    return {
        "signal": fnum(d.get("composite_signal"), 3),
        "level": d.get("signal_level", ""),
        "sectors": [{"name": k, "signal": fnum(v, 2)} for k, v in sectors.items()],
        "futures": futures[:8],
    }


def get_fusion():
    d = load_json(BASE / "fusion" / "history.json")
    if not d:
        return None
    weeks = d.get("weeks") or []
    if not weeks:
        return None
    latest = weeks[0]  # 最新一周
    ranked = latest.get("ranked", [])[:12]
    return {
        "week": latest.get("week"),
        "date": latest.get("date"),
        "ranked": [{"name": r.get("name"), "code": r.get("code"),
                    "score": fnum(r.get("score"), 4)} for r in ranked],
    }


def main():
    data = {
        "generatedAt": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "indices": get_indices(),
        "qlib": get_qlib(),
        "cta": get_cta(),
        "fusion": get_fusion(),
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"已生成 {OUT}")
    print(f"  指数 {len(data['indices'])} | qlib {'✅' if data['qlib'] else '❌'} | "
          f"cta {'✅' if data['cta'] else '❌'} | fusion {'✅' if data['fusion'] else '❌'}")


if __name__ == "__main__":
    main()
