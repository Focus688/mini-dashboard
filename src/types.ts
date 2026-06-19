export interface Index {
  name: string;
  code: string;
  price: number;
  change: number;
  prevClose: number;
}

export interface Sector {
  name: string;
  change: number;
  leader: string;
}

export interface Signal {
  name: string;
  value: string;
  direction: 'bullish' | 'bearish' | 'neutral';
  updated: string;
}

export interface MarketData {
  indices: Index[];
  sectors: Sector[];
  signals: Signal[];
}
