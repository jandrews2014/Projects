package org.intelligentriver.front.model.messages;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.intelligentriver.front.model.IDbJson;

@JsonInclude(JsonInclude.Include.NON_NULL)
public abstract class Observation extends IDbJson {

	public String observationId;
	public String deploymentId;
	public String deviceId;
	public Long moteTime;
	public String baseDateTime;
	public Long offsetTime;
	public String observationDateTime;
}
