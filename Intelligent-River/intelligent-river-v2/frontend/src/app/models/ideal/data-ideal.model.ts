// change the readings key mostly to include a parameter id
// include a truetime key that does the computation if it's feasible

export interface Data {
  baseDateTime?: string;
  offsetTime?: number;
  moteTime?: number;
  deviceId?: string;
  observationId?: string;
  deploymentId?: string;
  observationDateTime?: string;

  // add trueTime key which computes the baseDate and offset if feasible, otherwise it'll be done frontend
  trueTime: number;

  // CHANGE readings key to be the parameter id, return the value
  readings?: {
    parameterId: string;
    value: number;
  };
}
