/*
METHODS
  ADD:
    GET /api/parameters
      return GetAllParameters object

  REMOVE:
    GET /api/deploymentsByProjectId
      remove the method as it is no longer needed

  CHANGE:
    GET /api/dataRecent?deploymentId=string
      change the method to get, we're not posting anything
    GET /api/dataArchive?deploymentId=string&startDate=number&endDate=number
      change the method from post to get. We're really not posting anything

MODELS
  ADD:
    maintenence model - add deploymentId key
    project model - add deploymentIds and parameterIds keys
  REMOVE:
  CHANGE:
    project model - picons key, id key
    data model - readings key
    status model - simplify the status object and rename keys
*/

import { Project } from './projects-ideal.model';
import { Deployment, Parameter } from './deployments-ideal.model';
import { Statistics } from './statistics-ideal.model';
import { Observation } from './diagnostics-ideal.model';
import { Status } from './status-ideal.model';
import { Maintenence } from './maintenence-ideal.model';
import { Data } from './data-ideal.model';

export interface GetAllProjects {
  status: string;
  projects: {
    projectId: Project;
  };
}

// change deployments from being an array to a key-value pair
export interface GetAllDeployments {
  status?: string;
  deployments: {
    deploymentId: Deployment;
  };
}

// add this object type
export interface GetAllParameters {
  status?: string;
  parameters: {
    parameterId: Parameter;
  };
}

export interface GetStatistics {
  status?: string;
  statistics?: Statistics;
}

// change this object type
export interface GetDiagnosticsByProjectId {
  status: string;
  projects: {
    projectId: {
      deploymentId: {
        // just the deploymentID is fine, it is assumed that we already have all the deployments by the project id cached
        observations?: Observation[];
      }
    };
  };
}

// change this object type
export interface GetStatusByProjectId {
  status?: string;
  projects: {
    projectId: {
      statuses?: Status;
    };
  };
}

// change this object type by embedding it in a projects key
export interface GetMaintenenceByProjectId {
  status?: string;
  projects: {
    projectId: {
      // keeping this as an array is fine
      maintenence?: Maintenence[];
    };
  };
}

// change this object with embedding, not as array
export interface GetDataCurrentByProjectId {
  status?: string;
  projects: {
    projectId: {
      data: {
        deploymentId: Data;
      };
    };
  };
}

// supplied with parameters deployment id start and stop time
export interface GetDataHistorical {
  status?: string;
  data: {
    deploymentId: string;
    data: Data[];
  };
}

