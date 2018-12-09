package org.intelligentriver.front.model.request;

import org.intelligentriver.front.model.metadata.Property;

public class PostProperty extends ITokenRequest {

    public String label;
    public String uriSuffix;

    public Property getProperty() {
        Property property = new Property();
        property.label = label;
        property.uriSuffix = uriSuffix;
        return property;
    }
}
