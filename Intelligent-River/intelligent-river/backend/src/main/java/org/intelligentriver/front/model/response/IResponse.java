package org.intelligentriver.front.model.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.intelligentriver.front.model.IDbJson;

@JsonInclude(JsonInclude.Include.NON_NULL)
public abstract class IResponse extends IDbJson {

    public String status;
    public String description;

    public void successful(boolean successful) {
        status = successful ? "success" : "failure";
    }
}
