export interface MockStock {
  symbol: string;
  name: string;
  sector: string;
}

export interface StocksData {
  stocks: MockStock[];
}
