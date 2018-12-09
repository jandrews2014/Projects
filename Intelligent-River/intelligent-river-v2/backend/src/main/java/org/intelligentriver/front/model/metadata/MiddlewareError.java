package org.intelligentriver.front.model.metadata;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.intelligentriver.front.model.IDbJson;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class MiddlewareError extends IDbJson {

    public String id;
    public String description;
    public String datetime;
    public String message;
}
