package org.intelligentriver.front.model.metadata;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.intelligentriver.front.model.IDbJson;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class SensingDeviceParameter extends IDbJson {

    public String id;
    public String sensor;
    public String subject;
    public String label;
    public String property;
    public String unit;
    public double min;
    public double max;
    public double resolution;
    public double accuracy;
    public String convertFn;
    public String convertUnit;
}
