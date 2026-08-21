export interface Index {
  name: string;
  code: string;
  price: number;
  change: number;
  prevClose: number;
}

export interface StockSignal {
  name: string;
  code: string;
  score: number;
  reason: string;
  roe: number | null;
  profit_growth: number | null;
}

export interface QlibData {
  date: string;
  top: StockSignal[];
  bottom: StockSignal[];
}

export interface SectorSignal {
  name: string;
  signal: number;
}

export interface FutureSignal {
  name: string;
  sector: string;
  signal: number;
  ret_60: number;
}

export interface CtaData {
  signal: number;
  level: string;
  sectors: SectorSignal[];
  futures: FutureSignal[];
}

export interface RankItem {
  name: string;
  code: string;
  score: number;
}

export interface FusionData {
  week: string;
  date: string;
  ranked: RankItem[];
}

export interface StrategyData {
  generatedAt?: string;
  indices: Index[];
  qlib: QlibData | null;
  cta: CtaData | null;
  fusion: FusionData | null;
}
