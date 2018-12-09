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
 * a gson data class used to represent an ads diagnostic record
 */
public class ADSDiagnostics {
	
	private Long wakeErrors;
	private Long configErrors;
	private Long conversionErrors;
	private Long sampleErrors;
	private Long cumulativeUp;
	
	public ADSDiagnostics() {}
	
	/* ... generated getters / setters below ... */

	public long getWakeErrors() {
		return wakeErrors;
	}

	public void setWakeErrors(long wakeErrors) {
		this.wakeErrors = wakeErrors;
	}

	public long getConfigErrors() {
		return configErrors;
	}

	public void setConfigErrors(long configErrors) {
		this.configErrors = configErrors;
	}

	public long getConversionErrors() {
		return conversionErrors;
	}

	public void setConversionErrors(long conversionErrors) {
		this.conversionErrors = conversionErrors;
	}

	public long getSampleErrors() {
		return sampleErrors;
	}

	public void setSampleErrors(long sampleErrors) {
		this.sampleErrors = sampleErrors;
	}

	public long getCumulativeUp() {
		return cumulativeUp;
	}

	public void setCumulativeUp(long cumulativeUp) {
		this.cumulativeUp = cumulativeUp;
	}
		
}