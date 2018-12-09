package org.intelligentriver.front.model.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.json.JSONObject;

public class ResponseSingle extends IResponse {

    @JsonIgnore
    public JSONObject data;
}
