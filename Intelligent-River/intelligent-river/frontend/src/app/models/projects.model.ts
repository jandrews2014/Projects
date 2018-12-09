export class Project {
  pIcon?: number;
  timezone?: string;
  active?: boolean;
  location?: {
      lng?: number;
      lat?: number
  };
  id?: number;
  label?: string;
}

export class ProjectsJSON {
  projects?: Project[];
  status?: string;
}
