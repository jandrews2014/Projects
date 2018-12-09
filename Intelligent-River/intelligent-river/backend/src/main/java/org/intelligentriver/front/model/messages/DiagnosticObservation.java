package org.intelligentriver.front.model.messages;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class DiagnosticObservation extends Observation {

	public AppDiagnostics appDiagnostics;
	public SDI12Diagnostics sdi12Diagnostics;
	public OneWireDiagnostics oneWireDiagnostics;
	public ADSDiagnostics adsDiagnostics;
	public XBee900Diagnostics xbee900Diagnostics;
	public GM862Diagnostics gm862Diagnostics;
	public DE910Diagnostics de910Diagnostics;
	public LogDiagnostics logDiagnostics;
	public Long sequenceNumber;
}
