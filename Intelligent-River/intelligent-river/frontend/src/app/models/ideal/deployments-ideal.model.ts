// CHANGE: only use your deployment-details, never just the basic version

export interface Deployment {
  active?: boolean;
  location?: {
      lng?: number;
      lat?: number;
  };
  id?: string;
  label?: string;
  projectId?: number;
  motestackId?: Motestack;
}

export interface Motestack {
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
