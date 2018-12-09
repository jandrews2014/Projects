package org.intelligentriver.front.model.metadata;

import org.intelligentriver.front.model.IDbJson;

public class Maintenance extends IDbJson {

    public String id;
    public String eventType;
    public String user;
    public String deployment;
    public String projectId;
    public String comment;
    public long datetime;
}
