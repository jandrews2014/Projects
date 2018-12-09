package org.intelligentriver.front.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.UUID;

public abstract class IDbJson {

    public JSONObject toJson() throws JSONException, JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        return new JSONObject(mapper.writeValueAsString(this));
    }

    public static Object fromJson(String json, Class c) throws JSONException, IOException{
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readValue(json, c);
    }

    public String generateId() {
        return UUID.randomUUID().toString();
    }

}
