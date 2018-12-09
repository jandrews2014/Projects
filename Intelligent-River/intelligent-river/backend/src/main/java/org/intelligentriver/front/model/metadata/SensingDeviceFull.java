package org.intelligentriver.front.model.metadata;

import org.intelligentriver.front.model.IDbJson;

public class SensingDeviceFull extends IDbJson {

    public String id;
    public String label;
    public String type;
    public SensingDeviceParameter[] params;
}
