package org.intelligentriver.front.model.metadata;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.intelligentriver.front.model.IDbJson;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class MotestackSensingBrief extends IDbJson {

    public String id;
    public String label;
    public String sensingDeviceId;
    public MotestackSensingParameterBrief[] params;
}
