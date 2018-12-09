package org.intelligentriver.front.model.request;

import org.intelligentriver.front.model.metadata.Sensor;

public class PostSensor extends ITokenRequest {

    public String label;

    public Sensor getSensor() {
        Sensor sensor = new Sensor();
        sensor.label = label;
        return sensor;
    }
}
