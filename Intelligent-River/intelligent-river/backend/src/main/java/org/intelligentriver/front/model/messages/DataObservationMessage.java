package org.intelligentriver.front.model.messages;

import org.intelligentriver.front.model.IDbJson;
import org.intelligentriver.front.model.metadata.QaQcResults;

import java.util.UUID;

public class DataObservationMessage extends IDbJson {

    public String deploymentUri;
    public String deploymentId;
    public String deviceId;
    public String observationId;
    public Long observationDateTime;
    public double[] readings;
    public String projectId;
    public QaQcResults[] qaqcResults;

    public DataObservationMessage() {
        this.observationId = UUID.randomUUID().toString();
    }
}
