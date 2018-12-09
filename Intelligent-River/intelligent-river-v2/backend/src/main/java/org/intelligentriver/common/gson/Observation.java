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

import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.joda.time.LocalDateTime;

import java.net.URI;
import java.util.UUID;

/*
 * an abstract gson data class used as the base for 
 * all data and diagnostic observations; class provides 
 * time conversion support to UTC
 */
public abstract class Observation {

	private UUID observationId;
	private URI deploymentId;
	private String deviceId;
	private Long moteTime;
	private LocalDateTime baseDateTime;
	private Long offsetTime;
	private DateTime observationDateTime;

	protected Observation() {
		observationId = UUID.randomUUID();
	}
	
	// used to set the observation date/time by converting the 
	// baseDate/baseTime/offsetTime to UTC time (for cellular-based 
	// mote configurations); the source fields are set to null; 
	// an exception is thrown if the UTC conversion cannot be completed
	public void setObservationDateTime()
	throws Exception {
		if((baseDateTime != null) && (offsetTime != null)) {
			DateTime estDateTime = new DateTime(DateTimeZone.forID("America/New_York"));
			estDateTime = estDateTime.withFields(baseDateTime);
			estDateTime = estDateTime.plus(offsetTime.longValue()*1000);
			observationDateTime = estDateTime.toDateTime(DateTimeZone.UTC);
			moteTime = null;
			baseDateTime = null;
			offsetTime = null;
		} else {
			throw new Exception("could not generate UTC timestamp");
		}
	}
	
	// used to set the observation date/time by converting moteTime
	// to UTC time based on the (rxTime -- gateway, txTime -- mote) 
	// pair passed as argument (for non-cellular-based mote configurations);
	// the source fields are set to null; an exception is thrown if the UTC 
	// conversion cannot be completed; rxTime should be in UTC time
	public void setObservationDateTime(DateTime rxTime, long txTime) 
	throws Exception {
		if(moteTime != null) {
			long secondsElapsed = moteTime.longValue() - txTime;
			observationDateTime = rxTime.plus(secondsElapsed*1000);
			moteTime = null;
			baseDateTime = null;
			offsetTime = null;
		} else {
			throw new Exception("could not generate UTC timestamp");
		}
	}
	
	/* ... generated getters / setters below ... */
	
	public UUID getObservationId() {
		return observationId;
	}

	public void setObservationId(UUID observationId) {
		this.observationId = observationId;
	}
	
	public URI getDeploymentId() {
		return deploymentId;
	}

	public void setDeploymentId(URI deploymentId) {
		this.deploymentId = deploymentId;
	}
	
	public String getDeviceId() {
		return deviceId;
	}

	public void setDeviceId(String deviceId) {
		this.deviceId = deviceId;
	}

	public Long getMoteTime() {
		return moteTime;
	}

	public void setMoteTime(Long moteTime) {
		this.moteTime = moteTime;
	}

	public LocalDateTime getBaseDateTime() {
		return baseDateTime;
	}

	public void setBaseDateTime(LocalDateTime baseDateTime) {
		this.baseDateTime = baseDateTime;
	}

	public Long getOffsetTime() {
		return offsetTime;
	}

	public void setOffsetTime(Long offsetTime) {
		this.offsetTime = offsetTime;
	}

	public DateTime getObservationDateTime() {
		return observationDateTime;
	}

	public void setObservationDateTime(DateTime observationDateTime) {
		this.observationDateTime = observationDateTime;
	}
	
}
