/*
 * Copyright 2013
 *
 * The Dependable Systems Research Group
 * School of Computing
 * Clemson University
 *     
 *  author: Jason O. Hallstrom
 * version: 1.0.0
 *   since: 11/25/13
*/

package org.intelligentriver.common.gson;


/*
 * a gson data class used to represent a log diagnostic record
 */
public class LogDiagnostics {
	
	private Long formatErrors;
	private Long headerReadErrors;
	private Long headerWriteErrors;
	private Long headerCorruptionErrors;
	private Long recordCorruptionErrors;
	private Long validationErrors;
	private Long enqueueErrors;
	private Long overflowErrors;
	private Long dequeueErrors;
	private Long underflowErrors;
	
	public LogDiagnostics() {}
	
	/* ... generated getters / setters below ... */

	public long getFormatErrors() {
		return formatErrors;
	}

	public void setFormatErrors(long formatErrors) {
		this.formatErrors = formatErrors;
	}

	public long getHeaderReadErrors() {
		return headerReadErrors;
	}

	public void setHeaderReadErrors(long headerReadErrors) {
		this.headerReadErrors = headerReadErrors;
	}

	public long getHeaderWriteErrors() {
		return headerWriteErrors;
	}

	public void setHeaderWriteErrors(long headerWriteErrors) {
		this.headerWriteErrors = headerWriteErrors;
	}

	public long getHeaderCorruptionErrors() {
		return headerCorruptionErrors;
	}

	public void setHeaderCorruptionErrors(long headerCorruptionErrors) {
		this.headerCorruptionErrors = headerCorruptionErrors;
	}

	public long getRecordCorruptionErrors() {
		return recordCorruptionErrors;
	}

	public void setRecordCorruptionErrors(long recordCorruptionErrors) {
		this.recordCorruptionErrors = recordCorruptionErrors;
	}

	public long getValidationErrors() {
		return validationErrors;
	}

	public void setValidationErrors(long validationErrors) {
		this.validationErrors = validationErrors;
	}

	public long getEnqueueErrors() {
		return enqueueErrors;
	}

	public void setEnqueueErrors(long enqueueErrors) {
		this.enqueueErrors = enqueueErrors;
	}

	public long getOverflowErrors() {
		return overflowErrors;
	}

	public void setOverflowErrors(long overflowErrors) {
		this.overflowErrors = overflowErrors;
	}

	public long getDequeueErrors() {
		return dequeueErrors;
	}

	public void setDequeueErrors(long dequeueErrors) {
		this.dequeueErrors = dequeueErrors;
	}

	public long getUnderflowErrors() {
		return underflowErrors;
	}

	public void setUnderflowErrors(long underflowErrors) {
		this.underflowErrors = underflowErrors;
	}	
		
}