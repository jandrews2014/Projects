package org.intelligentriver.front.model.request;

import org.intelligentriver.front.model.metadata.Subject;

public class PostSubject extends ITokenRequest {

    public String label;
    public String uriSuffix;

    public Subject getSubject() {
        Subject subject = new Subject();
        subject.label = label;
        subject.uriSuffix = uriSuffix;
        return subject;
    }
}
