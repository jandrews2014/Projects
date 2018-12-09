export interface DataTemporaryJSON {
  data: DataTemporary[];
  status: string;
}

export interface DataTemporary {
  deploymentId: string;
  deploymentUri: string;
  deviceId: string;
  observationDateTime: number;
  observationId: string;
  projectId: string;
  qaqcResults: QAQACResult[];
  readings: number[];
}

export interface QAQACResult {
  check: string;
  label: string;
  message: string;
  status: boolean;
}
