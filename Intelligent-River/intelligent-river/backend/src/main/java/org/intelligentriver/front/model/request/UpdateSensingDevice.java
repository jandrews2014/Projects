package org.intelligentriver.front.model.request;

import org.intelligentriver.front.model.metadata.SensingDeviceFull;
import org.intelligentriver.front.model.metadata.SensingDeviceParameter;

public class UpdateSensingDevice extends ITokenRequest {

    public String id;
    public String label;
    public String type;
    public UpdateSensingDeviceParameter[] params;

    public SensingDeviceFull getSensingDevice() {
        SensingDeviceFull full = new SensingDeviceFull();
        full.id = id;
        full.label = label;
        full.type = type;
        full.params = new SensingDeviceParameter[params.length];

        UpdateSensingDeviceParameter temp;
        for(int i = 0; i < params.length; i++) {
            temp = params[i];
            SensingDeviceParameter parameter = new SensingDeviceParameter();
            parameter.id = temp.id;
            parameter.convertUnit = temp.convertUnit;
            parameter.convertFn = temp.convertFn;
            parameter.sensor = temp.sensor;
            parameter.accuracy = temp.accuracy;
            parameter.unit = temp.unit;
            parameter.max = temp.max;
            parameter.min = temp.min;
            parameter.resolution = temp.resolution;
            parameter.property = temp.property;
            parameter.label = temp.label;
            parameter.subject = temp.subject;
            full.params[i] = parameter;
        }

        return full;
    }
}
