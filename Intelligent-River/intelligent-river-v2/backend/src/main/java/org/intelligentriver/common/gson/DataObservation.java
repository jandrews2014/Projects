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

/**
 * a gson data class used to represent a data observation 
 */
public class DataObservation extends Observation {
	
	private double[] readings;
	
	public DataObservation() {}
	
	/* ... generated getters / setters below ... */

	public double[] getReadings() {
		return readings;
	}

	public void setReadings(double[] readings) {
		this.readings = readings;
	}
	
}