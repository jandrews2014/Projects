package org.intelligentriver.front.model.messages;

public class LogDiagnostics {
	
	public Long formatErrors;
	public Long headerReadErrors;
	public Long headerWriteErrors;
	public Long headerCorruptionErrors;
	public Long recordCorruptionErrors;
	public Long validationErrors;
	public Long enqueueErrors;
	public Long overflowErrors;
	public Long dequeueErrors;
	public Long underflowErrors;
}