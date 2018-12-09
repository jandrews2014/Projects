package org.intelligentriver.front.model.metadata;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.intelligentriver.front.model.IDbJson;

import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class User extends IDbJson {

    public String id;
    public String email;
    public String password;
    public int role;
    public String username;
    public String token;

    public User() {
        this.id = UUID.randomUUID().toString();
        this.role = 4;
    }
}
