package org.intelligentriver.front.model.request;

import org.intelligentriver.front.model.metadata.SensingTemplateBrief;

public class UpdateSensingTemplate extends ITokenRequest {

    public String id;
    public String label;
    public String sensingDevice;
    public String[] params;
    public String[] contexts;

    public SensingTemplateBrief getSensingTemplate() {
        SensingTemplateBrief brief = new SensingTemplateBrief();
        brief.id = id;
        brief.label = label;
        brief.sensingDevice = sensingDevice;
        brief.params = params;
        brief.contexts = contexts;
        return brief;
    }
}
