/*
 * Copyright 2016
 *
 * The Institute for Sensing and Embedded Network Systems Engineering
 * I-SENSE@FAU
 * Florida Atlantic University
 *     
 *  author: Jason O. Hallstrom
 * version: 1.0.0
 *   since: 4/4/16
*/

package org.intelligentriver.common.gson;

import java.net.InetAddress;

/*
 * a gson data class used to represent a de910 diagnostic record
 */
public class DE910Diagnostics {
	
	private Long rssi;
	private InetAddress ip;
	private Long wakeErrors;
	private Long sleepErrors;
	private Long setProfileErrors;
	private Long networkRegistrationErrors;
	private Long rssiErrors;
	private Long timeErrors;
	private Long smsStartErrors;
	private Long smsEndErrors;
	private Long getIpErrors;
	private Long dropIpErrors;
	private Long emailStartErrors;
	private Long emailEndErrors;
	private Long tcpConnectErrors;
	private Long tcpDisconnectErrors;
	private Long escapeErrors;	
	private Long cumulativeUp;
	
	public DE910Diagnostics() {}
	
	/* ... generated getters / setters below ... */

	public long getRssi() {
		return rssi;
	}

	public void setRssi(long rssi) {
		this.rssi = rssi;
	}

	public InetAddress getIp() {
		return ip;
	}

	public void setIp(InetAddress ip) {
		this.ip = ip;
	}

	public long getWakeErrors() {
		return wakeErrors;
	}

	public void setWakeErrors(long wakeErrors) {
		this.wakeErrors = wakeErrors;
	}

	public long getSleepErrors() {
		return sleepErrors;
	}

	public void setSleepErrors(long sleepErrors) {
		this.sleepErrors = sleepErrors;
	}

	public long getSetProfileErrors() {
		return setProfileErrors;
	}

	public void setSetProfileErrors(long setProfileErrors) {
		this.setProfileErrors = setProfileErrors;
	}

	public long getNetworkRegistrationErrors() {
		return networkRegistrationErrors;
	}

	public void setNetworkRegistrationErrors(long networkRegistrationErrors) {
		this.networkRegistrationErrors = networkRegistrationErrors;
	}

	public long getRssiErrors() {
		return rssiErrors;
	}

	public void setRssiErrors(long rssiErrors) {
		this.rssiErrors = rssiErrors;
	}

	public long getTimeErrors() {
		return timeErrors;
	}

	public void setTimeErrors(long timeErrors) {
		this.timeErrors = timeErrors;
	}

	public long getSmsStartErrors() {
		return smsStartErrors;
	}

	public void setSmsStartErrors(long smsStartErrors) {
		this.smsStartErrors = smsStartErrors;
	}

	public long getSmsEndErrors() {
		return smsEndErrors;
	}

	public void setSmsEndErrors(long smsEndErrors) {
		this.smsEndErrors = smsEndErrors;
	}

	public long getGetIpErrors() {
		return getIpErrors;
	}

	public void setGetIpErrors(long getIpErrors) {
		this.getIpErrors = getIpErrors;
	}

	public long getDropIpErrors() {
		return dropIpErrors;
	}

	public void setDropIpErrors(long dropIpErrors) {
		this.dropIpErrors = dropIpErrors;
	}

	public long getEmailStartErrors() {
		return emailStartErrors;
	}

	public void setEmailStartErrors(long emailStartErrors) {
		this.emailStartErrors = emailStartErrors;
	}

	public long getEmailEndErrors() {
		return emailEndErrors;
	}

	public void setEmailEndErrors(long emailEndErrors) {
		this.emailEndErrors = emailEndErrors;
	}

	public long getTcpConnectErrors() {
		return tcpConnectErrors;
	}

	public void setTcpConnectErrors(long tcpConnectErrors) {
		this.tcpConnectErrors = tcpConnectErrors;
	}

	public long getTcpDisconnectErrors() {
		return tcpDisconnectErrors;
	}

	public void setTcpDisconnectErrors(long tcpDisconnectErrors) {
		this.tcpDisconnectErrors = tcpDisconnectErrors;
	}

	public long getEscapeErrors() {
		return escapeErrors;
	}

	public void setEscapeErrors(long escapeErrors) {
		this.escapeErrors = escapeErrors;
	}
	
	public long getCumulativeUp() {
		return cumulativeUp;
	}

	public void setCumulativeUp(long cumulativeUp) {
		this.cumulativeUp = cumulativeUp;
	}
	
}
