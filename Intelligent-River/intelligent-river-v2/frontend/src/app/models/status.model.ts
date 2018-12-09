import { DE910Diagnostics, Diagnostics, DiagnosticsJSON, ADSDiagnostics,
  SDI12Diagnostics, AppDiagnostics, GM862Diagnostics, LogDiagnostics, OneWireDiagnostics, XBee900Diagnostics,
  Observation, ObservationMessage, DiagnosticObservation } from './diagnostics.model';
import { Deployment, DeploymentDetails, DeploymentDetailsByDeploymentId, DeploymentDetailsByDeploymentIdJSON,
  DeploymentsAllJSON, DeploymentsByProjectId, DeploymentsByProjectIdJSON, DeploymentsForm, SensingDevice} from './deployments.model';

export interface Status {
  deployment?: DeploymentDetails;
  lastMessage?: MoteStackMessage;
}

export interface StatusJSON {
  status?: string;
  statuses?: Status[];
}

export interface MoteStackMessage {
  deploymentId?: string;
  sdi12Samples?: DataObservation[];
  oneWireSamples?: DataObservation[];
  analogSamples?: DataObservation[];
  diagnostics?: DiagnosticObservation;
}

export interface DataObservation {
  readings?: number[];
  observationId?: string;
  deploymentId?: string;
  deviceId?: string;
  moteTime?: number;
  baseDateTime?: string;
  offsetTime?: number;
  observationDateTime?: string;
}
