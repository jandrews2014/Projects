package org.intelligentriver.front.model.metadata;

import org.intelligentriver.front.model.IDbJson;

public class Radio extends IDbJson {

    public String id;
    public String label;
    public RadioProperty[] options;

    public Radio() {
        this.id = super.generateId();
    }
}
