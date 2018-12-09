package org.intelligentriver.front.model.metadata;

import org.intelligentriver.front.model.IDbJson;

public class Subject extends IDbJson {

    public String id;
    public String label;
    public String uriSuffix;

    public Subject() {
        this.id = super.generateId();
    }
}
