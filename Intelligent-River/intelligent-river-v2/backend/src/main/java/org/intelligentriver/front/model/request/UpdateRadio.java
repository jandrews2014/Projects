package org.intelligentriver.front.model.request;

import org.intelligentriver.front.model.metadata.Radio;
import org.intelligentriver.front.model.metadata.RadioProperty;

public class UpdateRadio extends ITokenRequest {

    public String id;
    public String label;
    public RadioProperty[] options;

    public Radio getRadio() {
        Radio radio = new Radio();
        radio.id = id;
        radio.options = options;
        radio.label = label;
        return radio;
    }

}
