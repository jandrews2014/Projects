package org.intelligentriver.front.model.metadata;

import org.intelligentriver.front.model.IDbJson;

public class Property extends IDbJson {

    public String id;
    public String label;
    public String uriSuffix;

    public Property() {
        this.id = super.generateId();
    }
}
