export interface DeploymentDataMetadataIndex {
  deploymentId?: {
    property?: {
      sensingPosition?: number[];
      parameterIds?: string[];
    };
    meta: {
      lng?: number;
      lat?: number;
      hue?: number;
    }
  };
}
