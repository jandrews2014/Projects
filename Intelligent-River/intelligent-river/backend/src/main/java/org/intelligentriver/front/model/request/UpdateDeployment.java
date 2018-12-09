package org.intelligentriver.front.model.request;

import org.intelligentriver.front.model.metadata.DeploymentBrief;
import org.intelligentriver.front.model.metadata.Location;

public class UpdateDeployment extends ITokenRequest {

    public String id;
    public String motestackId;
    public String projectId;
    public boolean active;
    public Location location;
    public String label;

    public DeploymentBrief getDeployment() {
        DeploymentBrief deployment = new DeploymentBrief();
        deployment.id = id;
        deployment.projectId = projectId;
        deployment.motestackId = motestackId;
        deployment.active = active;
        deployment.location = location;
        deployment.label = label;
        return deployment;
    }
}
