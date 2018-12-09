package org.intelligentriver.front.model.metadata;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.intelligentriver.front.model.IDbJson;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class MotestackFull extends IDbJson {

    public String id;
    public boolean active;
    public String label;
    public int max1Wire;
    public int min1Wire;
    public int maxSdi12;
    public int minSdi12;
    public int numAds;
    public boolean nvsramLog;
    public String projectId;
    public int sPeriod;
    public int sTrans;
    public int sdi12Read;
    public int sdi12St;
    public boolean sdi12V3;
    public String uri;
    public int sLogSize;
    public MotestackRadioFull comm;
    public MotestackSensingFull[] sensing;

    public MotestackFull() {
        this.id = super.generateId();
    }

    public MotestackBrief brief() {
        MotestackBrief brief = new MotestackBrief();

        brief.id = id;
        brief.active = active;
        brief.label = label;
        brief.max1Wire = max1Wire;
        brief.min1Wire = min1Wire;
        brief.maxSdi12 = maxSdi12;
        brief.minSdi12 = minSdi12;
        brief.nvsramLog = nvsramLog;
        brief.project = projectId;
        brief.sPeriod = sPeriod;
        brief.sTrans = sTrans;
        brief.sdi12Read = sdi12Read;
        brief.sdi12St = sdi12St;
        brief.uri = uri;
        brief.sLogSize = sLogSize;

        if (comm != null) {
            brief.comm = new MotestackRadioBrief();
            brief.comm.config = comm.config;
            brief.comm.radioId = comm.radio.id;
        }

        if (sensing != null) {
            brief.sensing = new MotestackSensingBrief[sensing.length];
            MotestackSensingBrief temp;
            MotestackSensingFull tempFull;
            for(int i = 0; i < brief.sensing.length; i++) {
                temp = new MotestackSensingBrief();
                tempFull = sensing[i];

                temp.id = tempFull.id;
                temp.label = tempFull.label;
                temp.sensingDeviceId = tempFull.sensingDevice.id;

                if (tempFull.parameters != null) {
                    temp.params = new MotestackSensingParameterBrief[tempFull.parameters.length];

                    for(int k = 0; k < temp.params.length; k++) {
                        temp.params[k] = new MotestackSensingParameterBrief();
                        temp.params[k].convertFn = tempFull.parameters[k].convertFn;
                        temp.params[k].convertUnit = tempFull.parameters[k].convertUnit;
                        temp.params[k].param = tempFull.parameters[k].parameter.id;
                    }
                }

                brief.sensing[i] = temp;
            }
        }

        return brief;
    }

}
