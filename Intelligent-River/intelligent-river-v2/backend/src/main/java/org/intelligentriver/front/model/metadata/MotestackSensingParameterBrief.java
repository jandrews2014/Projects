package org.intelligentriver.front.model.metadata;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.intelligentriver.front.model.IDbJson;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class MotestackSensingParameterBrief extends IDbJson {

    public String param;
    public String convertFn;
    public String convertUnit;
}
