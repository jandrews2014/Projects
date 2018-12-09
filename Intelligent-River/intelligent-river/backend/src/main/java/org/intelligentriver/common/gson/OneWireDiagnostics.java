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
 * a gson data class used to represent an 1-wire diagnostic record
 */
public class OneWireDiagnostics {
	
	private Long searchErrors;
	private Long conversionErrors;
	private Long collectionErrors;
	private Long cumulativeUp;
	
	public OneWireDiagnostics() {}
	
	/* ... generated getters / setters below ... */

	public long getSearchErrors() {
		return searchErrors;
	}

	public void setSearchErrors(long searchErrors) {
		this.searchErrors = searchErrors;
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
