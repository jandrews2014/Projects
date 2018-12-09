package org.intelligentriver.front;

public class AppProperties {

    /* AWS key parameters */
    public static final String AWS_KEY_ACCESS = "aws.keyAccess";
    public static final String AWS_KEY_SECRET = "aws.keySecret";
    public static final String AWS_REGION = "aws.region";

    /* Dynamo tables */
    public static final String DYNAMO_TABLE = "dynamo.table";
    public static final String DYNAMO_TABLE_DATA = "dynamo.tableData";
    public static final String DYNAMO_TABLE_DIAGNOSTICS = "dynamo.tableDiagnostics";
    public static final String DYNAMO_TABLE_LAST_MESSAGES = "dynamo.tableLastMessages";
    public static final String DYNAMO_TABLE_ERRORS = "dynamo.tableErrors";

    /* Dynamo metadata subtables */
    public static final String DYNAMO_USERS = "Users";
    public static final String DYNAMO_PROJECTS = "Projects";
    public static final String DYNAMO_DEPLOYMENTS = "Deployments";
    public static final String DYNAMO_STATISTICS = "Statistics";
    public static final String DYNAMO_MAINTENANCE = "Maintenance";
    public static final String DYNAMO_MAINTENANCE_TYPES = "MaintenanceTypes";
    public static final String DYNAMO_RADIOS = "Radios";
    public static final String DYNAMO_SENSING_DEVICES = "SensingDevices";
    public static final String DYNAMO_PARAMETERS = "Parameters";
    public static final String DYNAMO_SUBJECTS = "Subjects";
    public static final String DYNAMO_UNITS = "Units";
    public static final String DYNAMO_PROPERTIES = "Properties";
    public static final String DYNAMO_SENSORS = "Sensors";
    public static final String DYNAMO_SENSING_TEMPLATES = "SensingTemplates";
    public static final String DYNAMO_MOTESTACKS = "Motestacks";
    public static final String DYNAMO_NOTIFICATION_SUBSCRIBERS = "NotificationSubscriptions";
}
