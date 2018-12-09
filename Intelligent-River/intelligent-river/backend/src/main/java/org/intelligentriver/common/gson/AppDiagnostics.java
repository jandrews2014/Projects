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
 * a gson data class used to represent an application diagnostic record
 */
public class AppDiagnostics {

	private Long sampleAttempts;
	private Long sampleFailures;
	private Long sampleLosses;
	private Long radioAttempts;
	private Long radioFailures;
	private Long crcErrors;
	private Long nvsramEntries;
	private Long cumulativeUp;
	
	public AppDiagnostics() {}
	
	/* ... generated getters / setters below ... */

	public long getSampleAttempts() {
		return sampleAttempts;
	}

	public void setSampleAttempts(long sampleAttempts) {
		this.sampleAttempts = sampleAttempts;
	}

	public long getSampleFailures() {
		return sampleFailures;
	}

	public void setSampleFailures(long sampleFailures) {
		this.sampleFailures = sampleFailures;
	}

	public long getSampleLosses() {
		return sampleLosses;
	}

	public void setSampleLosses(long sampleLosses) {
		this.sampleLosses = sampleLosses;
	}

	public long getRadioAttempts() {
		return radioAttempts;
	}

	public void setRadioAttempts(long radioAttempts) {
		this.radioAttempts = radioAttempts;
	}

	public long getRadioFailures() {
		return radioFailures;
	}

	public void setRadioFailures(long radioFailures) {
		this.radioFailures = radioFailures;
	}

	public long getCrcErrors() {
		return crcErrors;
	}

	public void setCrcErrors(long crcErrors) {
		this.crcErrors = crcErrors;
	}
	
	public long getNvsramEntries() {
		return nvsramEntries;
	}

	public void setNvsramEntries(long nvsramEntries) {
		this.nvsramEntries = nvsramEntries;
	}

	public long getCumulativeUp() {
		return cumulativeUp;
	}

	public void setCumulativeUp(long cumulativeUp) {
		this.cumulativeUp = cumulativeUp;
	}
	
}