package org.intelligentriver.front.model.request;

import org.intelligentriver.front.model.metadata.*;

public class UpdateMotestack extends ITokenRequest {

    public String id;
    public boolean active;
    public String label;
    public int max1Wire;
    public int min1Wire;
    public int maxSdi12;
    public int minSdi12;
    public int numAds;
    public boolean nvsramLog;
    public String project;
    public int sPeriod;
    public int sTrans;
    public int sdi12Read;
    public int sdi12St;
    public boolean sdi12V3;
    public String uri;
    public int sLogSize;
    public MotestackRadioFull comm;
    public MotestackSensingFull[] sensing;

    public MotestackFull getMotestack() {
        MotestackFull full = new MotestackFull();
        full.id = id;
        full.active = active;
        full.label = label;
        full.max1Wire = max1Wire;
        full.minSdi12 = minSdi12;
        full.min1Wire = min1Wire;
        full.maxSdi12 = maxSdi12;
        full.numAds = numAds;
        full.nvsramLog = nvsramLog;
        full.projectId = project;
        full.sPeriod = sPeriod;
        full.sTrans = sTrans;
        full.sdi12Read = sdi12Read;
        full.sdi12St = sdi12St;
        full.sdi12V3 = sdi12V3;
        full.uri = uri;
        full.sLogSize = sLogSize;
        full.comm = comm;
        full.sensing = sensing;
        return full;
    }
}
