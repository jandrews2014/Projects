/*
 * Copyright 2013
 *
 * The Dependable Systems Research Group
 * School of Computing
 * Clemson University
 *     
 *  author: Jason O. Hallstrom
 * version: 1.0.0
 *   since: 7/2/13
*/

package org.intelligentriver.common.gson;


/*
 * a gson data class used to represent a diagnostic observation
 */
public class DiagnosticObservation 
extends Observation {
	
	private AppDiagnostics appDiagnostics;
	private SDI12Diagnostics sdi12Diagnostics;
	private OneWireDiagnostics oneWireDiagnostics;
	private ADSDiagnostics adsDiagnostics;
	private XBee900Diagnostics xbee900Diagnostics;
	private GM862Diagnostics gm862Diagnostics;
	private DE910Diagnostics de910Diagnostics;
	private LogDiagnostics logDiagnostics;
	private Long sequenceNumber;
	
	public DiagnosticObservation() {}

	/* ... generated getters / setters below ... */

	public AppDiagnostics getAppDiagnostics() {
		return appDiagnostics;
	}

	public void setAppDiagnostics(AppDiagnostics appDiagnostics) {
		this.appDiagnostics = appDiagnostics;
	}

	public SDI12Diagnostics getSdi12Diagnostics() {
		return sdi12Diagnostics;
	}

	public void setSdi12Diagnostics(SDI12Diagnostics sdi12Diagnostics) {
		this.sdi12Diagnostics = sdi12Diagnostics;
	}

	public OneWireDiagnostics getOneWireDiagnostics() {
		return oneWireDiagnostics;
	}

	public void setOneWireDiagnostics(OneWireDiagnostics oneWireDiagnostics) {
		this.oneWireDiagnostics = oneWireDiagnostics;
	}

	public ADSDiagnostics getAdsDiagnostics() {
		return adsDiagnostics;
	}

	public void setAdsDiagnostics(ADSDiagnostics adsDiagnostics) {
		this.adsDiagnostics = adsDiagnostics;
	}

	public XBee900Diagnostics getXbee900Diagnostics() {
		return xbee900Diagnostics;
	}

	public void setXbee900Diagnostics(XBee900Diagnostics xbee900Diagnostics) {
		this.xbee900Diagnostics = xbee900Diagnostics;
	}

	public GM862Diagnostics getGm862Diagnostics() {
		return gm862Diagnostics;
	}

	public void setGm862Diagnostics(GM862Diagnostics gm862Diagnostics) {
		this.gm862Diagnostics = gm862Diagnostics;
	}

	public DE910Diagnostics getDe910Diagnostics() {
		return de910Diagnostics;
	}

	public void setDe910Diagnostics(DE910Diagnostics de910Diagnostics) {
		this.de910Diagnostics = de910Diagnostics;
	}
	
	public LogDiagnostics getLogDiagnostics() {
		return logDiagnostics;
	}

	public void setLogDiagnostics(LogDiagnostics logDiagnostics) {
		this.logDiagnostics = logDiagnostics;
	}

	public Long getSequenceNumber() {
		return sequenceNumber;
	}

	public void setSequenceNumber(Long sequenceNumber) {
		this.sequenceNumber = sequenceNumber;
	}
	
}
