package org.intelligentriver.front.model.metadata;

import org.intelligentriver.front.model.IDbJson;

public class Sensor extends IDbJson {

    public String id;
    public String label;

    public Sensor() {
        this.id = super.generateId();
    }
}
