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
 * a gson data class used to represent an xbee900hp diagnostic record
 */
public class XBee900Diagnostics {
	
	private Long wakeErrors;
	private Long cmdErrors;
	private Long sendErrors;
	private Long frameErrors;
	private Long baseRSSI;
	private Long cumulativeUp;
	
	public XBee900Diagnostics() {}
	
	/* ... generated getters / setters below ... */

	public long getWakeErrors() {
		return wakeErrors;
	}

	public void setWakeErrors(long wakeErrors) {
		this.wakeErrors = wakeErrors;
	}

	public long getCmdErrors() {
		return cmdErrors;
	}

	public void setCmdErrors(long cmdErrors) {
		this.cmdErrors = cmdErrors;
	}

	public long getSendErrors() {
		return sendErrors;
	}

	public void setSendErrors(long sendErrors) {
		this.sendErrors = sendErrors;
	}

	public long getFrameErrors() {
		return frameErrors;
	}

	public void setFrameErrors(long frameErrors) {
		this.frameErrors = frameErrors;
	}
	
	public long getBaseRSSI() {
		return baseRSSI;
	}

	public void setBaseRSSI(long baseRSSI) {
		this.baseRSSI = baseRSSI;
	}

	public long getCumulativeUp() {
		return cumulativeUp;
	}

	public void setCumulativeUp(long cumulativeUp) {
		this.cumulativeUp = cumulativeUp;
	}
	
}