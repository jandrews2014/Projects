export interface Statistics {
  data?: {
    date?: string;
    records?: string;
    samples?: string;
  };
  diagnostics?: {
    date?: string;
    records?: string;
    samples?: string;
  };
}

export interface StatisticsJSON {
  statistics?: Statistics;
  status?: string;
}
