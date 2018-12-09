import {Project} from './projects.model';
import {Motestack} from './motestack.model';

export interface Deployment {
  motestackId?: string;
  active?: boolean;
  location?: {
      lng?: number;
      lat?: number;
  };
  id?: string;
  label?: string;
  projectId?: number;
}

export interface DeploymentsForm {
  projects?: Project[];
  motestacks?: Motestack[];
}

export interface DeploymentDetails {
  active?: boolean;
  location?: {
      lng?: number;
      lat?: number;
  };
  id?: string;
  label?: string;
  projectId?: number;
  motestackId?: {
    sensing: Sensing[];
    comm?: {
      config?: CommConfig;
      radio?: {
        id?: string;
        label?: string;
        options?: RadioOptions[];
      }
    };
    active?: boolean;
    label?: string;
    uri?: string;
    id?: string;
    projectId?: string;
  };
}

export interface DeploymentsByProjectIdJSON {
  deployments?: Deployment[];
  status?: string;
}

export interface DeploymentsByProjectId {
  projectId: {
    deploymentId: Deployment;
  }
}

export interface DeploymentsAllJSON {
  deployments?: Deployment[];
  status?: string;
}

export interface DeploymentDetailsByDeploymentIdJSON {
  deploymentId?: DeploymentDetailsByDeploymentId;
}

export interface DeploymentDetailsByDeploymentId {
  active?: boolean;
  location?: {
      lng?: number;
      lat?: number;
  };
  id?: string;
  label?: string;
  projectId?: number;
  motestackId?: {
    sensing: Sensing[];
    comm?: {
      config?: CommConfig;
      radio?: {
        id?: string;
        label?: string;
        options?: RadioOptions[];
      }
    };
    active?: boolean;
    label?: string;
    uri?: string;
    id?: string;
    projectId?: string;
  };
}

export interface Sensing {
  sensingDevice?: SensingDevice;
  id?: string;
  label?: string;
  parameters?: Parameter[];
}

export interface SensingDevice {
  id?: string;
  label?: string;
  type?: string;
  params?: string[];
}

export interface Parameter {
  parameter?: {
    unit?: string;
    min?: number;
    max?: number;
    subject?: string;
    property?: string;
    accuracy?: number;
    sensor?: string;
    id?: string;
    label?: string;
    resolution?: number;
  };
}

export interface CommConfig {
  'cell-band'?: string;
  'gw-add'?: string;
  'apn-name'?: string;
  'gw-port'?: string;
}

export interface RadioOptions {
  name?: string;
  label?: string;
  type?: string;
  required?: boolean;
}
