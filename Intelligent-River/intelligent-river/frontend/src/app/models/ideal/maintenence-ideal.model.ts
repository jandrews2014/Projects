export interface Maintenence {
  datetime?: number;
  comment?: string;
  eventType?: string;
  user?: string;
  projectId?: number;
  deployment?: string;

  // add this key because the actual id isn't passed
  deploymentId: string;
}
