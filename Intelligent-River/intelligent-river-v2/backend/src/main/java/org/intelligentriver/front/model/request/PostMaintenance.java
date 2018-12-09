package org.intelligentriver.front.model.request;

import org.intelligentriver.front.model.metadata.Maintenance;

public class PostMaintenance extends ITokenRequest {

    public String eventType;
    public String user;
    public String deployment;
    public String projectId;
    public String comment;
    public long datetime;

    public Maintenance getMaintenance() {
        Maintenance maintenance = new Maintenance();
        maintenance.comment = comment;
        maintenance.eventType = eventType;
        maintenance.user = user;
        maintenance.deployment = deployment;
        maintenance.projectId = projectId;
        maintenance.datetime = datetime;
        return maintenance;
    }
}
