export interface MaintenanceAllJSON {
  maintenance?: Maintenance[];
  status?: string;
}

export interface Maintenance {
  datetime?: number;
  comment?: string;
  eventType?: string;
  user?: string;
  projectId?: number;
  deployment?: string;
}