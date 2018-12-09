package org.intelligentriver.front.model.metadata;

import org.intelligentriver.front.model.IDbJson;

public class MaintenanceType extends IDbJson {

    public String id;
    public String label;

    public MaintenanceType() {
        this.id = super.generateId();
    }

    public MaintenanceType(String id, String label) {
        this.id = id;
        this.label = label;
    }
}
