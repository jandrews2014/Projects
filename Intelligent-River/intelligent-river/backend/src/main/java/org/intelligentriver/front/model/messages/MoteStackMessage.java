package org.intelligentriver.front.model.messages;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.intelligentriver.front.model.IDbJson;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class MoteStackMessage extends IDbJson {
	
	public String deploymentId;
	public DataObservation[] sdi12Samples;
	public DataObservation[] oneWireSamples;
	public DataObservation[] analogSamples;
	public DiagnosticObservation diagnostics;
}
	