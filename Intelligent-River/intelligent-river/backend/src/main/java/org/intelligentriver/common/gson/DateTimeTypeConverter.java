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


import com.google.gson.*;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

import java.lang.reflect.Type;

/*
 * a custom gson serializer / deserializer: DateTime(zzz) <--> json string
 */
public class DateTimeTypeConverter implements JsonSerializer<DateTime>, JsonDeserializer<DateTime> {

	public DateTime deserialize(JsonElement json, Type type, JsonDeserializationContext context)
	throws JsonParseException {
		DateTimeFormatter parser = DateTimeFormat.forPattern("MM-dd-yyyy HH:mm:ss zzz");
		return(parser.parseDateTime(json.getAsString()));
	}

	public JsonElement serialize(DateTime date, Type type, JsonSerializationContext context) {
		DateTimeFormatter formatter = DateTimeFormat.forPattern("MM-dd-yyyy HH:mm:ss zzz");
		return new JsonPrimitive(date.toString(formatter));
	}
	
}
		
