package org.intelligentriver.front.model.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.json.JSONArray;

public class ResponseArray extends IResponse {

    @JsonIgnore
    public JSONArray data;
}
