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


/*
 * a gson data class used to represent an sdi-12 diagnostic record
 */
public class SDI12Diagnostics {

	private Long activationErrors;
	private Long conversionErrors;
	private Long collectionErrors;
	private Long cumulativeUp;
	
	public SDI12Diagnostics() {}

	/* ... generated getters / setters below ... */
	
	public long getActivationErrors() {
		return activationErrors;
	}

	public void setActivationErrors(long activationErrors) {
		this.activationErrors = activationErrors;
	}

	public long getConversionErrors() {
		return conversionErrors;
	}

	public void setConversionErrors(long conversionErrors) {
		this.conversionErrors = conversionErrors;
	}

	public long getCollectionErrors() {
		return collectionErrors;
	}

	public void setCollectionErrors(long collectionErrors) {
		this.collectionErrors = collectionErrors;
	}

	public long getCumulativeUp() {
		return cumulativeUp;
	}

	public void setCumulativeUp(long cumulativeUp) {
		this.cumulativeUp = cumulativeUp;
	}
		
}
