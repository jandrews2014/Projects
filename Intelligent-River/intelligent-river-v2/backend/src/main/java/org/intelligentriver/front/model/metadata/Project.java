package org.intelligentriver.front.model.metadata;

import org.intelligentriver.front.model.IDbJson;

public class Project extends IDbJson {

    public String id;
    public boolean active;
    public String label;
    public Location location;
    public int pIcon;
    public String timezone;

    public Project() {
        this.id = super.generateId();
    }
}
