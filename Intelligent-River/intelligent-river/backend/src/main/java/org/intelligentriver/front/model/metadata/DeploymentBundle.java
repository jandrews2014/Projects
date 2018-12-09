package org.intelligentriver.front.model.metadata;

import org.intelligentriver.front.model.IDbJson;
import org.intelligentriver.front.model.messages.DiagnosticObservation;

public class DeploymentBundle extends IDbJson {

    public String deployment;
    public DiagnosticObservation[] observations;
}
