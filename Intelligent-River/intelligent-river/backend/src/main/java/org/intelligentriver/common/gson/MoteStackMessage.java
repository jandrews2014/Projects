/*
 * Copyright 2013
 *
 * The Dependable Systems Research Group
 * School of Computing
 * Clemson University
 *     
 *  author: Jason O. Hallstrom
 * version: 1.0.0
 *   since: 3/24/13
*/

package org.intelligentriver.common.gson;

import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;

import java.net.URI;

/**
 * a gson data class used to represent a data/diagnostic message 
 * received from a MoteStack
 */
public class MoteStackMessage {
	
	private URI deploymentId;
	private DataObservation[] sdi12Samples;
	private DataObservation[] oneWireSamples;
	private DataObservation[] analogSamples;
	private DiagnosticObservation diagnostics;

	public MoteStackMessage() {}

	// used to post-populate the observation time and deployment 
	// identifier within each observation
	public void postPopulateObservations() throws Exception {

		// prepare the (tx, rx) pair used to post-populate
		// the observation time in non-time-synced messages
		DateTime rxTime = null;
		long txTime = 0;
		if(diagnostics.getBaseDateTime() == null) {
			rxTime = new DateTime(DateTimeZone.UTC);
			txTime = diagnostics.getMoteTime();
		}
		
		// set the observation time and deployment identifier within each observation
		postPopulateObservations(sdi12Samples, rxTime, txTime);
		postPopulateObservations(oneWireSamples, rxTime, txTime);
		postPopulateObservations(analogSamples, rxTime, txTime);
		DiagnosticObservation[] diagnosticsArray = { diagnostics };
		postPopulateObservations(diagnosticsArray, rxTime, txTime);
	}
	
	// used internally to post-populate the observation time and deployment 
	// identifier within an array of observations
	private void postPopulateObservations(Observation[] observations, DateTime rxTime, long txTime) throws Exception {
		if(observations != null) { 
			// set the observation time and deployment identifier 
			// within each observation 
			for(Observation observation : observations) {
				// first try to set the observation time assuming a time synchronized
				// transmitter; fall-back to a non-synchronized transmitter
				try {
					observation.setObservationDateTime();
				} catch(Exception exc) {
					observation.setObservationDateTime(rxTime, txTime);
				}
				observation.setDeploymentId(deploymentId);
			}
		}
	}
	
	/* ... generated getters / setters below ... */

	public URI getDeploymentId() {
		return deploymentId;
	}

	public void setDeploymentId(URI deploymentId) {
		this.deploymentId = deploymentId;
	}

	public DataObservation[] getSdi12Samples() {
		return sdi12Samples;
	}

	public void setSdi12Samples(DataObservation[] sdi12Samples) {
		this.sdi12Samples = sdi12Samples;
	}

	public DataObservation[] getOneWireSamples() {
		return oneWireSamples;
	}

	public void setOneWireSamples(DataObservation[] oneWireSamples) {
		this.oneWireSamples = oneWireSamples;
	}

	public DataObservation[] getAnalogSamples() {
		return analogSamples;
	}

	public void setAnalogSamples(DataObservation[] analogSamples) {
		this.analogSamples = analogSamples;
	}

	public DiagnosticObservation getDiagnostics() {
		return diagnostics;
	}

	public void setDiagnostics(DiagnosticObservation diagnostics) {
		this.diagnostics = diagnostics;
	}
	
}
	