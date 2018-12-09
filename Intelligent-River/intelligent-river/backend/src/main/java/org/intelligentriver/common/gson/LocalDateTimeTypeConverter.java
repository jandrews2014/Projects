/*
 * Copyright 2013
 *
 * The Dependable Systems Research Group
 * School of Computing
 * Clemson University
 *     
 *  author: Jason O. Hallstrom
 * version: 1.0.0
 *   since: 7/5/13
*/

package org.intelligentriver.common.gson;

import com.google.gson.*;
import org.joda.time.LocalDateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

import java.lang.reflect.Type;

/*
 * a custom gson serializer / deserializer: LocalDateTime <--> json string
 */
public class LocalDateTimeTypeConverter
        implements JsonSerializer<LocalDateTime>, JsonDeserializer<LocalDateTime> {

    public LocalDateTime deserialize(JsonElement json, Type type, JsonDeserializationContext context)
            throws JsonParseException {
        DateTimeFormatter parser = DateTimeFormat.forPattern("MM-dd-yyyy HH:mm:ss");
        return (parser.parseLocalDateTime(json.getAsString()));
    }

    public JsonElement serialize(LocalDateTime date, Type type, JsonSerializationContext context) {
        DateTimeFormatter formatter = DateTimeFormat.forPattern("MM-dd-yyyy HH:mm:ss");
        return new JsonPrimitive(date.toString(formatter));
    }

}

