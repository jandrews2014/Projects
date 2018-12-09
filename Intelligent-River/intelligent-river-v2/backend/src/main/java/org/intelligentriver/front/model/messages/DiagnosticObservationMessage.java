package org.intelligentriver.front.model.messages;

import org.intelligentriver.front.model.IDbJson;

import java.util.UUID;

public class DiagnosticObservationMessage extends IDbJson {

    public String observationId;
    public String deploymentId;
    public Long datetime;
    public String deploymentUri;
    public DiagnosticObservation originalMessage;

    public DiagnosticObservationMessage() {
        observationId = UUID.randomUUID().toString();
    }
}
