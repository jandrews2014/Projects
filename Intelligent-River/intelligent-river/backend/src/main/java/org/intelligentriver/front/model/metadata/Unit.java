package org.intelligentriver.front.model.metadata;

import org.intelligentriver.front.model.IDbJson;

public class Unit extends IDbJson {

    public String id;
    public String label;
    public String uri;

    public Unit() {
        this.id = super.generateId();
    }
}
