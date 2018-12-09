package org.intelligentriver.front.model.metadata;

import org.intelligentriver.front.model.IDbJson;

public class DeploymentFull extends IDbJson {

    public String id;
    public MotestackFull motestackId;
    public String projectId;
    public boolean active;
    public Location location;
    public String label;

    public static DeploymentFull copyFromBrief(DeploymentBrief brief) {
        DeploymentFull full = new DeploymentFull();

        full.id = brief.id;
        full.projectId = brief.projectId;
        full.active = brief.active;
        full.location = brief.location;
        full.label = brief.label;

        return full;
    }
}
