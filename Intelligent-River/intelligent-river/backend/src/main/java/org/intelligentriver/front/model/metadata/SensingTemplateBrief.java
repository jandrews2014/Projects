package org.intelligentriver.front.model.metadata;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.intelligentriver.front.model.IDbJson;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class SensingTemplateBrief extends IDbJson {

    public String id;
    public String label;
    public String sensingDevice;
    public String[] params;
    public String[] contexts;
}
