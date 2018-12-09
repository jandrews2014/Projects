package org.intelligentriver.front.model.request;

import org.intelligentriver.front.model.metadata.SensingTemplateBrief;

public class PostSensingTemplate extends ITokenRequest {

    public String label;
    public String sensingDevice;
    public String[] params;
    public String[] contexts;

    public SensingTemplateBrief getSensingTemplate() {
        SensingTemplateBrief brief = new SensingTemplateBrief();
        brief.label = label;
        brief.sensingDevice = sensingDevice;
        brief.params = params;
        brief.contexts = contexts;
        return brief;
    }
}
