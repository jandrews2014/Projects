package org.intelligentriver.front.model.request;

import org.intelligentriver.front.model.metadata.Unit;

public class PostUnit extends ITokenRequest {

    public String label;
    public String uri;

    public Unit getUnit() {
        Unit unit = new Unit();
        unit.label = label;
        unit.uri = uri;
        return unit;
    }
}
