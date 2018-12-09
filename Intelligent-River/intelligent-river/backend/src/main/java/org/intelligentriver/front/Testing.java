package org.intelligentriver.front;

public class Testing {

    public static void launch() {

    }

  /*  public static void fixSensingTemplates() {
        String keyAccess = "AKIAJKU67E7HU23WVUPA";
        String keySecret = "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";
        String region = "us-west-2";

        String dynamoTable = "RiverTable";

        DynamoDb db = new DynamoDb(keyAccess, keySecret, region, LoggerFactory.getLogger(Testing.class));

        try {
            Item item = db.get(dynamoTable, "id", AppProperties.DYNAMO_SENSING_TEMPLATES);
            JSONArray array = new JSONArray(item.getJSON("json"));

            JSONObject temp;
            for (int i = 0; i < array.length(); i++) {
                temp = array.getJSONObject(i);
                SensingTemplateBriefOld old = (SensingTemplateBriefOld) IDbJson.fromJson(temp.toString(), SensingTemplateBriefOld.class);
                SensingTemplateBrief brief = new SensingTemplateBrief();

                brief.id = old.id;
                brief.label = old.label;
                brief.sensingDevice = old.sensingDevice;

                JSONArray ja = new JSONArray(old.params);
                brief.params = new String[ja.length()];
                for (int j = 0; j < ja.length(); j++)
                    brief.params[j] = ja.getString(j);

                if (old.contexts != null) {
                    brief.contexts = new String[old.contexts.length];
                    for (int j = 0; j < old.contexts.length; j++)
                        brief.contexts[j] = old.contexts[j].label;
                }

                array.put(i, brief.toJson());
            }

            item.withJSON("json", array.toString());
            db.put(dynamoTable, item);
        } catch (Exception exc) {
            exc.printStackTrace();
        }
    }*/

 /*   public static void fixSensingDevices() {
        String keyAccess = "AKIAJKU67E7HU23WVUPA";
        String keySecret = "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";
        String region = "us-west-2";

        String dynamoTable = "RiverTable";

        DynamoDb db = new DynamoDb(keyAccess, keySecret, region, LoggerFactory.getLogger(Testing.class));

        try {
            Item item = db.get(dynamoTable, "id", AppProperties.DYNAMO_SENSING_DEVICES);
            JSONArray array = new JSONArray(item.getJSON("json"));

            JSONObject temp;
            for(int i = 0; i < array.length(); i++) {
                temp = array.getJSONObject(i);
                SensingDeviceBriefOld old = (SensingDeviceBriefOld) IDbJson.fromJson(temp.toString(), SensingDeviceBriefOld.class);
                SensingDeviceBrief brief = new SensingDeviceBrief();
                brief.type = old.type;
                brief.label = old.label;
                brief.id = old.id;

                JSONArray params = new JSONArray(old.params);
                brief.params = new String[params.length()];
                for (int j = 0; j < brief.params.length; j++)
                    brief.params[j] = params.getString(j);

                array.put(i, brief.toJson());
            }

            item.withJSON("json", array.toString());
            db.put(dynamoTable, item);
        } catch (Exception exc) {
            exc.printStackTrace();
        }
    }*/
/*
    public static void fixParameters() {
        String keyAccess = "AKIAJKU67E7HU23WVUPA";
        String keySecret = "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";
        String region = "us-west-2";

        String dynamoTable = "RiverTable";

        DynamoDb db = new DynamoDb(keyAccess, keySecret, region, LoggerFactory.getLogger(Testing.class));

        try {
            Item itemParameters = db.get(dynamoTable, "id", AppProperties.DYNAMO_PARAMETERS);
            Item itemSubjects = db.get(dynamoTable, "id", AppProperties.DYNAMO_SUBJECTS);
            Item itemUnits = db.get(dynamoTable, "id", AppProperties.DYNAMO_UNITS);
            Item itemProperties = db.get(dynamoTable, "id", AppProperties.DYNAMO_PROPERTIES);
            Item itemSensors = db.get(dynamoTable, "id", AppProperties.DYNAMO_SENSORS);

            JSONArray jsonParameters = new JSONArray(itemParameters.getJSON("json"));
            JSONArray jsonSubjects = new JSONArray(itemSubjects.getJSON("json"));
            JSONArray jsonUnits = new JSONArray(itemUnits.getJSON("json"));
            JSONArray jsonProperties = new JSONArray(itemProperties.getJSON("json"));
            JSONArray jsonSensors = new JSONArray(itemSensors.getJSON("json"));

            List<Subject> subjects = new ArrayList<>();
            List<Unit> units = new ArrayList<>();
            List<Property> properties = new ArrayList<>();
            List<Sensor> sensors = new ArrayList<>();

            JSONObject temp;
            for (int i = 0; i < jsonSubjects.length(); i++) {
                try {
                    temp = jsonSubjects.getJSONObject(i);
                    Subject subject = (Subject) IDbJson.fromJson(temp.toString(), Subject.class);
                    subjects.add(subject);
                } catch (Exception exc) {
                    exc.printStackTrace();
                }
            }
            for (int i = 0; i < jsonUnits.length(); i++) {
                try {
                    temp = jsonUnits.getJSONObject(i);
                    Unit unit = (Unit) IDbJson.fromJson(temp.toString(), Unit.class);
                    units.add(unit);
                } catch (Exception exc) {
                    exc.printStackTrace();
                }
            }
            for (int i = 0; i < jsonProperties.length(); i++) {
                try {
                    temp = jsonProperties.getJSONObject(i);
                    Property property = (Property) IDbJson.fromJson(temp.toString(), Property.class);
                    properties.add(property);
                } catch (Exception exc) {
                    exc.printStackTrace();
                }
            }
            for (int i = 0; i < jsonSensors.length(); i++) {
                try {
                    temp = jsonSensors.getJSONObject(i);
                    Sensor sensor = (Sensor) IDbJson.fromJson(temp.toString(), Sensor.class);
                    sensors.add(sensor);
                } catch (Exception exc) {
                    exc.printStackTrace();
                }
            }

            JSONArray sdNewParameters = new JSONArray();
            for (int i = 0; i < jsonParameters.length(); i++) {
                try {
                    SensingDeviceParameterOld sdParameter = (SensingDeviceParameterOld) IDbJson.fromJson(jsonParameters.getJSONObject(i).toString(), SensingDeviceParameterOld.class);
                    SensingDeviceParameter sdNewParameter = new SensingDeviceParameter();
                    sdNewParameter.accuracy = sdParameter.acc;
                    sdNewParameter.resolution = sdParameter.res;
                    sdNewParameter.id = sdParameter.id;
                    sdNewParameter.label = sdParameter.label;
                    sdNewParameter.max = sdParameter.max;
                    sdNewParameter.min = sdParameter.min;
                    sdNewParameter.convertFn = sdParameter.convertFn;

                    for (Subject subject : subjects)
                        if (subject.id.equals(sdParameter.subject)) {
                            sdNewParameter.subject = subject.label;
                            break;
                        }
                    for (Unit unit : units)
                        if (unit.id.equals(sdParameter.unit)) {
                            sdNewParameter.unit = unit.label;
                            break;
                        }
                    for (Property property : properties)
                        if (property.id.equals(sdParameter.property)) {
                            sdNewParameter.property = property.label;
                            break;
                        }
                    for (Sensor sensor : sensors)
                        if (sensor.id.equals(sdParameter.sensor)) {
                            sdNewParameter.sensor = sensor.label;
                            break;
                        }
                    for (Unit unit : units)
                        if (unit.id.equals(sdParameter.convertUnit)) {
                            sdNewParameter.convertUnit = unit.label;
                            break;
                        }

                    sdNewParameters.put(sdNewParameter.toJson());
                } catch (Exception exc) {
                    exc.printStackTrace();
                }
            }

            itemParameters.withJSON("json", sdNewParameters.toString());
            db.put(dynamoTable, itemParameters);
        } catch (Exception exc) {
            exc.printStackTrace();
        }
    }*/
}
