package org.intelligentriver.front.model.request;

public class UpdateUserPassword extends ITokenRequest {

    public String id;
    public String oldPasswordSHA1;
    public String newPasswordSHA1;
}
