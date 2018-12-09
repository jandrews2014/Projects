package org.intelligentriver.front.model.metadata;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import org.intelligentriver.front.model.IDbJson;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class MotestackBrief extends IDbJson {

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
    public MotestackRadioBrief comm;
    public MotestackSensingBrief[] sensing;

    public MotestackBrief() {
        this.id = super.generateId();
    }

}
