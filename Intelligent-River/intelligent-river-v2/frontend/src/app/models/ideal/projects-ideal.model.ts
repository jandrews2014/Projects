/*
  ADD:
    'deploymentIds' key, just add all of the deployment ids for that project
    'parameterIds' key, just add all of the parameter ids for that project

  CHANGE:
    'pIcon' key used to be a number, but that doesn't describe the type of icon. I need identifiers to
      resemble the icons they're supposed to be
    'label' key used to be number, everywhere else uses string
*/

export class Project {
  pIcon?: string;             // CHANGE
  timezone?: string;
  active?: boolean;
  location?: {
      lng?: number;
      lat?: number
  };
  id?: string;                // CHANGE
  label?: string;
  deploymentIds: string[];    // ADD
  parameterIds: string[];     // ADD
}
