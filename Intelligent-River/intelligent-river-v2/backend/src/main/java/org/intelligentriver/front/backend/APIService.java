package org.intelligentriver.front.backend;

import com.amazonaws.services.dynamodbv2.document.Item;
import org.apache.http.util.TextUtils;
import org.intelligentriver.common.DynamoDb;
import org.intelligentriver.front.AppProperties;
import org.intelligentriver.front.model.IDbJson;
import org.intelligentriver.front.model.messages.*;
import org.intelligentriver.front.model.metadata.*;
import org.intelligentriver.front.model.request.*;
import org.intelligentriver.front.model.response.ResponseArray;
import org.intelligentriver.front.model.response.ResponseSingle;
import org.joda.time.DateTime;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.springframework.core.env.Environment;

import java.util.*;

@SuppressWarnings("Duplicates")
public class APIService {

    //region Singleton

    private static APIService sInstance;

    public static APIService get(Environment env, Logger logger) {
        if (sInstance == null)
            sInstance = new APIService(env, logger);
        return sInstance;
    }

    private APIService(Environment env, Logger logger) {
        String awsAccess = env.getProperty(AppProperties.AWS_KEY_ACCESS);
        String awsSecret = env.getProperty(AppProperties.AWS_KEY_SECRET);
        String awsRegion = env.getProperty(AppProperties.AWS_REGION);

        mDynamo = new DynamoDb(awsAccess, awsSecret, awsRegion, logger);
        mDynamoTable = env.getProperty(AppProperties.DYNAMO_TABLE);
        mDynamoTableData = env.getProperty(AppProperties.DYNAMO_TABLE_DATA);
        mDynamoTableDiagnostics = env.getProperty(AppProperties.DYNAMO_TABLE_DIAGNOSTICS);
        mDynamoTableLastMessages = env.getProperty(AppProperties.DYNAMO_TABLE_LAST_MESSAGES);
        mDynamoTableErrors = env.getProperty(AppProperties.DYNAMO_TABLE_ERRORS);

        mLogger = logger;
    }

    //endregion

    //region Variables

    private Logger mLogger;
    private DynamoDb mDynamo;

    private String mDynamoTable;
    private String mDynamoTableData;
    private String mDynamoTableDiagnostics;
    private String mDynamoTableLastMessages;
    private String mDynamoTableErrors;

    //endregion

    //region Util

    private ResponseSingle dynamoRetrieveSingle(String id) {
        ResponseSingle single = new ResponseSingle();
        try {
            Item item = mDynamo.get(mDynamoTable, "id", id);
            single.data = new JSONObject(item.getJSON("json"));
            single.successful(true);
        } catch (Exception exc) {
            mLogger.error("Failed retrieving data from Dynamo with id: " + id);
            single.description = "Failed to retrieve data.";
            single.successful(false);
        }
        return single;
    }

    private ResponseArray dynamoRetrieveArray(String id) {
        ResponseArray array = new ResponseArray();
        try {
            Item item = mDynamo.get(mDynamoTable, "id", id);
            array.data = new JSONArray(item.getJSON("json"));
            array.successful(true);
        } catch (Exception exc) {
            mLogger.error("Failed retrieving data from Dynamo with id: " + id);
            array.description = "Failed to retrieve data.";
            array.successful(false);
        }
        return array;
    }

    //endregion

    //region Diagnostics

    public ResponseArray getDiagnostics(String projectId) {
        //String todayId = buildObservationIdDate(new DateTime());
        String todayId = "01-17-2017";
        return getDiagnostics(projectId, todayId);
    }

    public ResponseArray getDiagnostics(String projectId, String date) {
        ResponseArray array = new ResponseArray();
        try {
            Item itemIndexData = mDynamo.get(mDynamoTableDiagnostics, "id", "index");
            array.data = new JSONArray();
            if (itemIndexData != null) {
                JSONArray indexes = new JSONArray(itemIndexData.getJSON("json"));

                JSONObject index = null; // in the future this is index containing amount of items stored per current day

                JSONObject temp;
                for (int i = 0; i < indexes.length(); i++) {
                    temp = indexes.getJSONObject(i);
                    if (temp.getString("day").equals(date)) {
                        index = temp;
                        break;
                    }
                }

                if (index != null) {
                    int size = index.getInt("size");
                    int amountOfRows = (size / 100) + (((size % 100) > 0) ? 1 : 0); // second part: if case 500 - result will be 5, if 501 -> result will be 6

                    if (amountOfRows > 2)
                        amountOfRows = 2; // TODO: REMOVE THIS PIECE OF CODE

                    Item item;
                    List<DiagnosticObservationMessage> messages = new ArrayList<>();
                    JSONArray messagesJson;
                    JSONObject messageJson;
                    DiagnosticObservationMessage message;
                    for (int i = 0; i < amountOfRows; i++) {
                        item = mDynamo.get(mDynamoTableDiagnostics, "id", buildObservationIdFinal(date, i));
                        if (item != null) {
                            messagesJson = new JSONArray(item.getJSON("json")); // retrieved array of messages

                            for (int j = 0; j < messagesJson.length(); j++) {
                                messageJson = messagesJson.getJSONObject(j);
                                try {
                                    message = (DiagnosticObservationMessage) DiagnosticObservationMessage.fromJson(messageJson.toString(), DiagnosticObservationMessage.class);
                                    messages.add(message);
                                } catch (Exception exc) {
                                    mLogger.error("Failed parsing diagnostic message.", exc);
                                }
                            }

                        } else
                            break; // we don't want messages randomly. only if everything is OK with dynamo we get messages to the end.
                    }

                    List<DeploymentBrief> deployments = getDeploymentsList(projectId);
                    HashMap<String, JSONArray> result = new HashMap<>();
                    JSONArray jsonArray;
                    for (DiagnosticObservationMessage m : messages)
                        for (DeploymentBrief deployment : deployments) // looking for a matching deployment
                            if (deployment.id.equals(m.deploymentId)) { // adding to the map if a match
                                if (result.containsKey(deployment.id))
                                    jsonArray = result.get(deployment.id);
                                else jsonArray = new JSONArray();
                                jsonArray.put(m.toJson());
                                result.put(deployment.id, jsonArray);
                                break;
                            }

                    JSONObject jsonObject;
                    for (String key : result.keySet()) {
                        jsonObject = new JSONObject();
                        jsonArray = result.get(key);
                        if (jsonArray.length() > 0) {
                            jsonObject.put("deployment", jsonArray.getJSONObject(0).getString("deploymentUri"));
                            jsonObject.put("observations", jsonArray);
                            array.data.put(jsonObject);
                        }
                    }
                }
            }

            array.successful(true);
            return array;
        } catch (Exception exc) {
            array.successful(false);
            mLogger.error("Failed to retrieve latest diagnostics.", exc);
        }

        return array;
    }

    //endregion

    //region Status

    public ResponseArray getStatuses(String projectId) {
        ResponseArray response = new ResponseArray();
        try {
            List<DeploymentFull> deployments = getDeploymentsExpandedList(projectId);

            response.data = new JSONArray();

            Item item;
            JSONObject lastMessage;
            JSONObject resultingJson;
            for (DeploymentFull deployment : deployments) {
                item = mDynamo.get(mDynamoTableLastMessages, "deploymentId", deployment.motestackId.uri);
                if (item == null) continue;
                lastMessage = new JSONObject(item.getJSON("json"));

                resultingJson = new JSONObject();
                resultingJson.put("deployment", deployment.toJson());
                resultingJson.put("lastMessage", lastMessage);
                response.data.put(resultingJson);
            }

            response.successful(true);
        } catch (Exception exc) {
            response.successful(false);
            mLogger.error("Failed to retrieve statuses.", exc);
        }
        return response;
    }

    //endregion

    //region Data

    // ID formatting: MM-DD-YYYY
    private String buildObservationIdDate(DateTime time) {
        String result = null;

        String day = String.valueOf(time.getDayOfMonth());
        String month = String.valueOf(time.getMonthOfYear());
        String year = String.valueOf(time.getYear());

        if (day.length() == 1) day = "0" + day;
        if (month.length() == 1) month = "0" + month;

        return month + "-" + day + "-" + year;
    }

    private String buildObservationIdFinal(String id, int index) {
        return id + "|" + index;
    }

    public ResponseArray getData(String projectId) {
        return getData(projectId, buildObservationIdDate(new DateTime()));
    }

    public ResponseArray getData(String projectId, String date) {
        ResponseArray array = new ResponseArray();
        try {
            Item itemIndexData = mDynamo.get(mDynamoTableData, "id", "index");
            array.data = new JSONArray();
            if (itemIndexData != null) {
                JSONArray indexes = new JSONArray(itemIndexData.getJSON("json"));

                JSONObject index = null; // in the future this is index containing amount of items stored per current day

                JSONObject temp;
                for (int i = 0; i < indexes.length(); i++) {
                    temp = indexes.getJSONObject(i);
                    if (temp.getString("day").equals(date)) {
                        index = temp;
                        break;
                    }
                }

                if (index != null) {
                    int size = index.getInt("size");
                    int amountOfRows = (size / 100) + (((size % 100) > 0) ? 1 : 0); // second part: if case 500 - result will be 5, if 501 -> result will be 6

                    if (amountOfRows > 2)
                        amountOfRows = 2; // TODO: REMOVE THIS PIECE OF CODE

                    Item item;
                    List<DataObservationMessage> messages = new ArrayList<>();
                    JSONArray messagesJson;
                    JSONObject messageJson;
                    DataObservationMessage message;
                    for (int i = 0; i < amountOfRows; i++) {
                        item = mDynamo.get(mDynamoTableData, "id", buildObservationIdFinal(date, i));
                        if (item != null) {
                            messagesJson = new JSONArray(item.getJSON("json")); // retrieved array of messages

                            for (int j = 0; j < messagesJson.length(); j++) {
                                messageJson = messagesJson.getJSONObject(j);
                                try {
                                    message = (DataObservationMessage) DataObservationMessage.fromJson(messageJson.toString(), DataObservationMessage.class);
                                    messages.add(message);
                                } catch (Exception exc) {
                                    mLogger.error("Failed parsing observational message.", exc);
                                }
                            }

                        } else
                            break; // we don't want messages randomly. only if everything is OK with dynamo we get messages to the end.
                    }

                    // at this point messages list contains all the messages per the date
                    for (DataObservationMessage m : messages)
                        if (m.projectId.equals(projectId))
                            array.data.put(m.toJson());
                }
            }

            array.successful(true);
            return array;
        } catch (Exception exc) {
            array.successful(false);
            mLogger.error("Failed to retrieve latest data.", exc);
        }

        return array;
    }

    //endregion

    //region Projects

    public ResponseArray getProjects() {
        return dynamoRetrieveArray(AppProperties.DYNAMO_PROJECTS);
    }

    //endregion

    //region Deployments

    public ResponseSingle getDeploymentDetails(String deploymentId) {
        ResponseSingle response = new ResponseSingle();
        try {
            ResponseArray deploymentsRaw = dynamoRetrieveArray(AppProperties.DYNAMO_DEPLOYMENTS);

            JSONObject temp;
            DeploymentBrief brief = null;
            for (int i = 0; i < deploymentsRaw.data.length(); i++) {
                temp = deploymentsRaw.data.getJSONObject(i);
                brief = (DeploymentBrief) IDbJson.fromJson(temp.toString(), DeploymentBrief.class);
                if (brief.id.equals(deploymentId))
                    break;
            }

            if (brief != null) {
                ResponseArray motestacksRaw = dynamoRetrieveArray(AppProperties.DYNAMO_MOTESTACKS);
                ResponseArray sensingDevicesRaw = dynamoRetrieveArray(AppProperties.DYNAMO_SENSING_DEVICES);
                ResponseArray parametersRaw = dynamoRetrieveArray(AppProperties.DYNAMO_PARAMETERS);
                ResponseArray radiosRaw = dynamoRetrieveArray(AppProperties.DYNAMO_RADIOS);

                DeploymentFull full = new DeploymentFull();

                full.active = brief.active;
                full.id = brief.id;
                full.label = brief.label;
                full.location = brief.location;
                full.projectId = brief.projectId;
                full.motestackId = getMotestackFull(motestacksRaw, sensingDevicesRaw, parametersRaw, radiosRaw, brief.motestackId);

                response.data = full.toJson();
                response.successful(true);
            } else {
                response.description = "Failed to find deployment.";
                response.successful(false);
            }
        } catch (Exception exc) {
            response.successful(false);
            response.description = "Failed to load data.";
        }
        return response;
    }

    public ResponseArray getDeployments() {
        return dynamoRetrieveArray(AppProperties.DYNAMO_DEPLOYMENTS);
    }

    public ResponseArray getDeployments(String projectId) {
        List<DeploymentBrief> deployments = getDeploymentsList(projectId);
        JSONArray filtered = new JSONArray();
        for (DeploymentBrief deployment : deployments) {
            try {
                if (projectId.equals(deployment.projectId))
                    filtered.put(deployment.toJson());
            } catch (Exception exc) {
                mLogger.error("Failed parsing deployment.", exc);
                exc.printStackTrace();
            }
        }
        ResponseArray array = new ResponseArray();
        array.data = filtered;
        array.successful(true);
        return array;
    }

    public ResponseArray getDeploymentsExpanded(String projectId) {
        List<DeploymentBrief> deployments = getDeploymentsList(projectId);
        ResponseArray motestacksRaw = dynamoRetrieveArray(AppProperties.DYNAMO_MOTESTACKS);
        ResponseArray sensingDevicesRaw = dynamoRetrieveArray(AppProperties.DYNAMO_SENSING_DEVICES);
        ResponseArray parametersRaw = dynamoRetrieveArray(AppProperties.DYNAMO_PARAMETERS);
        ResponseArray radiosRaw = dynamoRetrieveArray(AppProperties.DYNAMO_RADIOS);

        JSONArray filtered = new JSONArray();
        for (DeploymentBrief deployment : deployments) {
            try {
                if (projectId.equals(deployment.projectId)) {
                    DeploymentFull full = DeploymentFull.copyFromBrief(deployment);
                    full.motestackId = getMotestackFull(motestacksRaw, sensingDevicesRaw, parametersRaw, radiosRaw, deployment.motestackId);
                    filtered.put(full.toJson());
                }
            } catch (Exception exc) {
                mLogger.error("Failed parsing deployment.", exc);
                exc.printStackTrace();
            }
        }
        ResponseArray array = new ResponseArray();
        array.data = filtered;
        array.successful(true);
        return array;
    }

    public ResponseArray getDeploymentsExpanded() {
        List<DeploymentBrief> deployments = getDeploymentsList();
        ResponseArray motestacksRaw = dynamoRetrieveArray(AppProperties.DYNAMO_MOTESTACKS);
        ResponseArray sensingDevicesRaw = dynamoRetrieveArray(AppProperties.DYNAMO_SENSING_DEVICES);
        ResponseArray parametersRaw = dynamoRetrieveArray(AppProperties.DYNAMO_PARAMETERS);
        ResponseArray radiosRaw = dynamoRetrieveArray(AppProperties.DYNAMO_RADIOS);

        JSONArray filtered = new JSONArray();
        for (DeploymentBrief deployment : deployments) {
            try {
                DeploymentFull full = DeploymentFull.copyFromBrief(deployment);
                full.motestackId = getMotestackFull(motestacksRaw, sensingDevicesRaw, parametersRaw, radiosRaw, deployment.motestackId);
                filtered.put(full.toJson());
            } catch (Exception exc) {
                mLogger.error("Failed parsing deployment.", exc);
                exc.printStackTrace();
            }
        }
        ResponseArray array = new ResponseArray();
        array.data = filtered;
        array.successful(true);
        return array;
    }

    private List<DeploymentFull> getDeploymentsExpandedList(String projectId) {
        List<DeploymentBrief> deployments = getDeploymentsList();
        ResponseArray motestacksRaw = dynamoRetrieveArray(AppProperties.DYNAMO_MOTESTACKS);
        ResponseArray sensingDevicesRaw = dynamoRetrieveArray(AppProperties.DYNAMO_SENSING_DEVICES);
        ResponseArray parametersRaw = dynamoRetrieveArray(AppProperties.DYNAMO_PARAMETERS);
        ResponseArray radiosRaw = dynamoRetrieveArray(AppProperties.DYNAMO_RADIOS);

        List<DeploymentFull> result = new ArrayList<>();
        for (DeploymentBrief deployment : deployments) {
            try {
                if (projectId.equals(deployment.projectId)) {
                    DeploymentFull full = DeploymentFull.copyFromBrief(deployment);
                    full.motestackId = getMotestackFull(motestacksRaw, sensingDevicesRaw, parametersRaw, radiosRaw, deployment.motestackId);
                    result.add(full);
                }
            } catch (Exception exc) {
                mLogger.error("Failed parsing deployment.", exc);
                exc.printStackTrace();
            }
        }
        return result;
    }

    private List<DeploymentBrief> getDeploymentsList(String projectId) {
        ResponseArray items = dynamoRetrieveArray(AppProperties.DYNAMO_DEPLOYMENTS);
        List<DeploymentBrief> result = new ArrayList<>();
        JSONObject temp;
        DeploymentBrief deployment;
        for (int i = 0; i < items.data.length(); i++) {
            try {
                temp = items.data.getJSONObject(i);
                deployment = (DeploymentBrief) IDbJson.fromJson(temp.toString(), DeploymentBrief.class);
                if (projectId.equals(deployment.projectId))
                    result.add(deployment);
            } catch (Exception exc) {
                exc.printStackTrace();
            }
        }
        return result;
    }

    private List<DeploymentBrief> getDeploymentsList() {
        ResponseArray items = dynamoRetrieveArray(AppProperties.DYNAMO_DEPLOYMENTS);
        List<DeploymentBrief> result = new ArrayList<>();
        JSONObject temp;
        DeploymentBrief deployment;
        for (int i = 0; i < items.data.length(); i++) {
            try {
                temp = items.data.getJSONObject(i);
                deployment = (DeploymentBrief) IDbJson.fromJson(temp.toString(), DeploymentBrief.class);
                result.add(deployment);
            } catch (Exception exc) {
                exc.printStackTrace();
            }
        }
        return result;
    }

    public ResponseSingle postDeployment(String token, DeploymentBrief deployment, boolean alreadyExists) {
        ResponseSingle response = new ResponseSingle();
        if (tokenValid(token)) {
            boolean valid = deployment != null;
            if (valid) valid = deployment.projectId != null;
            if (valid) valid = deployment.motestackId != null;
            if (valid) valid = deployment.location != null;
            if (valid) valid = deployment.label != null;

            if (!valid) {
                response.successful(false);
                response.description = "Invalid data to save.";
            } else {
                try {
                    if (!alreadyExists)
                        deployment.id = UUID.randomUUID().toString();

                    Item item = mDynamo.get(mDynamoTable, "id", AppProperties.DYNAMO_DEPLOYMENTS);
                    JSONArray data = new JSONArray(item.getJSON("json"));

                    if (!alreadyExists)
                        data.put(deployment.toJson());
                    else {
                        JSONObject temp;
                        for (int i = 0; i < data.length(); i++) {
                            temp = data.getJSONObject(i);
                            if (temp.getString("id").equals(deployment.id)) {
                                data.put(i, deployment.toJson());
                                break;
                            }
                        }
                    }

                    item.withJSON("json", data.toString());

                    mDynamo.put(mDynamoTable, item);

                    response.data = deployment.toJson();
                    response.successful(true);
                } catch (Exception exc) {
                    response.successful(false);
                    response.description = "Failed saving data. Try again.";
                }
            }
        } else {
            response.successful(false);
            response.description = "Invalid user token.";
        }
        return response;
    }

    //endregion

    //region Radios

    public ResponseArray getRadios() {
        return dynamoRetrieveArray(AppProperties.DYNAMO_RADIOS);
    }

    public ResponseSingle postRadio(String token, Radio radio, boolean alreadyExists) {
        ResponseSingle response = new ResponseSingle();
        if (tokenValid(token)) {
            boolean valid = radio != null;
            if (valid) valid = radio.label != null;
            if (valid) valid = radio.options != null;

            if (!valid) {
                response.successful(false);
                response.description = "Invalid data to save.";
            } else {
                try {
                    if (!alreadyExists)
                        radio.id = UUID.randomUUID().toString();

                    Item item = mDynamo.get(mDynamoTable, "id", AppProperties.DYNAMO_RADIOS);
                    JSONArray data = new JSONArray(item.getJSON("json"));

                    if (!alreadyExists)
                        data.put(radio.toJson());
                    else {
                        JSONObject temp;
                        for (int i = 0; i < data.length(); i++) {
                            temp = data.getJSONObject(i);
                            if (temp.getString("id").equals(radio.id)) {
                                data.put(i, radio.toJson());
                                break;
                            }
                        }
                    }

                    item.withJSON("json", data.toString());

                    mDynamo.put(mDynamoTable, item);

                    response.successful(true);
                } catch (Exception exc) {
                    response.successful(false);
                    response.description = "Failed saving data. Try again.";
                }
            }
        } else {
            response.successful(false);
            response.description = "Invalid user token.";
        }
        return response;
    }

    //endregion

    //region Motestacks

    private MotestackFull getMotestackFull(ResponseArray motestacksRaw, ResponseArray sensingDevicesRaw, ResponseArray parametersRaw, ResponseArray radiosRaw, String motestackId) {
        try {
            List<Radio> radios = new ArrayList<>();
            List<SensingDeviceParameter> parameters = new ArrayList<>();
            List<SensingDeviceBrief> sensingDevices = new ArrayList<>();

            JSONObject temp;
            SensingDeviceParameter parameter;
            for (int i = 0; i < parametersRaw.data.length(); i++) {
                temp = parametersRaw.data.getJSONObject(i);
                parameter = (SensingDeviceParameter) IDbJson.fromJson(temp.toString(), SensingDeviceParameter.class);
                parameters.add(parameter);
            }
            SensingDeviceBrief sensingDevice;
            for (int i = 0; i < sensingDevicesRaw.data.length(); i++) {
                temp = sensingDevicesRaw.data.getJSONObject(i);
                sensingDevice = (SensingDeviceBrief) IDbJson.fromJson(temp.toString(), SensingDeviceBrief.class);
                sensingDevices.add(sensingDevice);
            }
            Radio radio;
            for (int i = 0; i < radiosRaw.data.length(); i++) {
                temp = radiosRaw.data.getJSONObject(i);
                radio = (Radio) IDbJson.fromJson(temp.toString(), Radio.class);
                radios.add(radio);
            }
            MotestackBrief brief = null;
            for (int i = 0; i < motestacksRaw.data.length(); i++) {
                temp = motestacksRaw.data.getJSONObject(i);
                brief = (MotestackBrief) IDbJson.fromJson(temp.toString(), MotestackBrief.class);
                if (brief.id.equals(motestackId))
                    break;
            }

            if (brief != null) {
                MotestackFull full = new MotestackFull();
                full.id = brief.id;
                full.active = brief.active;
                full.label = brief.label;
                full.max1Wire = brief.max1Wire;
                full.min1Wire = brief.min1Wire;
                full.maxSdi12 = brief.maxSdi12;
                full.minSdi12 = brief.minSdi12;
                full.numAds = brief.numAds;
                full.projectId = brief.project;
                full.sPeriod = brief.sPeriod;
                full.sTrans = brief.sTrans;
                full.sdi12Read = brief.sdi12Read;
                full.sdi12St = brief.sdi12St;
                full.sdi12V3 = brief.sdi12V3;
                full.uri = brief.uri;
                full.sLogSize = brief.sLogSize;
                full.nvsramLog = brief.nvsramLog;

                if (brief.comm != null) {
                    full.comm = new MotestackRadioFull();
                    full.comm.config = brief.comm.config;

                    for (Radio r : radios)
                        if (r.id.equals(brief.comm.radioId)) {
                            full.comm.radio = r;
                            break;
                        }
                }

                if (brief.sensing != null) {
                    full.sensing = new MotestackSensingFull[brief.sensing.length];
                    MotestackSensingBrief sBrief;
                    MotestackSensingFull sFull;
                    MotestackSensingParameterBrief mspBrief;
                    MotestackSensingParameterFull mspFull;
                    for (int i = 0; i < full.sensing.length; i++) {
                        sBrief = brief.sensing[i];
                        sFull = new MotestackSensingFull();

                        sFull.label = sBrief.label;
                        sFull.id = sBrief.id;

                        // finding actual sensing device by its id
                        for (SensingDeviceBrief sdBrief : sensingDevices)
                            if (sdBrief.id.equals(sBrief.sensingDeviceId)) {
                                sFull.sensingDevice = sdBrief;
                                break;
                            }

                        // finding parameters for its ids
                        if (sBrief.params != null) {
                            sFull.parameters = new MotestackSensingParameterFull[sBrief.params.length];
                            for (int j = 0; j < sBrief.params.length; j++) {
                                mspBrief = sBrief.params[j];
                                mspFull = new MotestackSensingParameterFull();

                                mspFull.convertFn = mspBrief.convertFn;
                                mspFull.convertUnit = mspBrief.convertUnit;

                                for (SensingDeviceParameter param : parameters)
                                    if (param.id.equals(mspBrief.param)) {
                                        mspFull.parameter = param;
                                        break;
                                    }

                                sFull.parameters[j] = mspFull;
                            }
                        }

                        full.sensing[i] = sFull;
                    }
                }
                return full;
            } else return null;
        } catch (Exception exc) {
            mLogger.error("Failed to retrieve motestack. Id: " + motestackId);
            return null;
        }
    }

    public ResponseArray getMotestacksBrief() {
        return dynamoRetrieveArray(AppProperties.DYNAMO_MOTESTACKS);
    }

    public ResponseArray getMotestacks() {
        ResponseArray response = new ResponseArray();
        try {
            ResponseArray motestacksRaw = dynamoRetrieveArray(AppProperties.DYNAMO_MOTESTACKS);
            ResponseArray sensingDevicesRaw = dynamoRetrieveArray(AppProperties.DYNAMO_SENSING_DEVICES);
            ResponseArray parametersRaw = dynamoRetrieveArray(AppProperties.DYNAMO_PARAMETERS);
            ResponseArray radiosRaw = dynamoRetrieveArray(AppProperties.DYNAMO_RADIOS);

            List<MotestackBrief> motestacks = new ArrayList<>();
            List<Radio> radios = new ArrayList<>();
            List<SensingDeviceParameter> parameters = new ArrayList<>();
            List<SensingDeviceBrief> sensingDevices = new ArrayList<>();

            JSONObject temp;
            SensingDeviceParameter parameter;
            for (int i = 0; i < parametersRaw.data.length(); i++) {
                temp = parametersRaw.data.getJSONObject(i);
                parameter = (SensingDeviceParameter) IDbJson.fromJson(temp.toString(), SensingDeviceParameter.class);
                parameters.add(parameter);
            }
            SensingDeviceBrief sensingDevice;
            for (int i = 0; i < sensingDevicesRaw.data.length(); i++) {
                temp = sensingDevicesRaw.data.getJSONObject(i);
                sensingDevice = (SensingDeviceBrief) IDbJson.fromJson(temp.toString(), SensingDeviceBrief.class);
                sensingDevices.add(sensingDevice);
            }
            Radio radio;
            for (int i = 0; i < radiosRaw.data.length(); i++) {
                temp = radiosRaw.data.getJSONObject(i);
                radio = (Radio) IDbJson.fromJson(temp.toString(), Radio.class);
                radios.add(radio);
            }
            MotestackBrief motestack;
            for (int i = 0; i < motestacksRaw.data.length(); i++) {
                temp = motestacksRaw.data.getJSONObject(i);
                motestack = (MotestackBrief) IDbJson.fromJson(temp.toString(), MotestackBrief.class);
                motestacks.add(motestack);
            }

            JSONArray fullItems = new JSONArray();
            for (MotestackBrief brief : motestacks) {
                MotestackFull full = new MotestackFull();
                full.id = brief.id;
                full.active = brief.active;
                full.label = brief.label;
                full.max1Wire = brief.max1Wire;
                full.min1Wire = brief.min1Wire;
                full.maxSdi12 = brief.maxSdi12;
                full.minSdi12 = brief.minSdi12;
                full.numAds = brief.numAds;
                full.projectId = brief.project;
                full.sPeriod = brief.sPeriod;
                full.sTrans = brief.sTrans;
                full.sdi12Read = brief.sdi12Read;
                full.sdi12St = brief.sdi12St;
                full.sdi12V3 = brief.sdi12V3;
                full.uri = brief.uri;
                full.sLogSize = brief.sLogSize;
                full.nvsramLog = brief.nvsramLog;

                if (brief.comm != null) {
                    full.comm = new MotestackRadioFull();
                    full.comm.config = brief.comm.config;

                    for (Radio r : radios)
                        if (r.id.equals(brief.comm.radioId)) {
                            full.comm.radio = r;
                            break;
                        }
                }

                if (brief.sensing != null) {
                    full.sensing = new MotestackSensingFull[brief.sensing.length];
                    MotestackSensingBrief sBrief;
                    MotestackSensingFull sFull;
                    MotestackSensingParameterBrief mspBrief;
                    MotestackSensingParameterFull mspFull;
                    for (int i = 0; i < full.sensing.length; i++) {
                        sBrief = brief.sensing[i];
                        sFull = new MotestackSensingFull();

                        sFull.label = sBrief.label;
                        sFull.id = sBrief.id;

                        // finding actual sensing device by its id
                        for (SensingDeviceBrief sdBrief : sensingDevices)
                            if (sdBrief.id.equals(sBrief.sensingDeviceId)) {
                                sFull.sensingDevice = sdBrief;
                                break;
                            }

                        // finding parameters for its ids
                        if (sBrief.params != null) {
                            sFull.parameters = new MotestackSensingParameterFull[sBrief.params.length];
                            for (int j = 0; j < sBrief.params.length; j++) {
                                mspBrief = sBrief.params[j];
                                mspFull = new MotestackSensingParameterFull();

                                mspFull.convertFn = mspBrief.convertFn;
                                mspFull.convertUnit = mspBrief.convertUnit;

                                for (SensingDeviceParameter param : parameters)
                                    if (param.id.equals(mspBrief.param)) {
                                        mspFull.parameter = param;
                                        break;
                                    }

                                sFull.parameters[j] = mspFull;
                            }
                        }

                        full.sensing[i] = sFull;
                    }
                }

                fullItems.put(full.toJson());
            }

            response.data = fullItems;
            response.successful(true);
        } catch (Exception exc) {
            response.successful(false);
            response.description = "Failed to load data.";
        }
        return response;
    }

    public ResponseSingle postMotestack(String token, MotestackFull motestack, boolean alreadyExists) {
        ResponseSingle response = new ResponseSingle();
        if (tokenValid(token)) {
            try {
                boolean valid = motestack != null;
                if (valid) valid = motestack.sensing != null;
                if (valid) valid = motestack.comm != null;
                if (valid) valid = !TextUtils.isEmpty(motestack.label);
                if (valid) valid = !TextUtils.isEmpty(motestack.projectId);
                if (valid) valid = !TextUtils.isEmpty(motestack.uri);

                if (valid) {
                    if (!alreadyExists)
                        motestack.id = UUID.randomUUID().toString();

                    Item itemMotestacks = mDynamo.get(mDynamoTable, "id", AppProperties.DYNAMO_MOTESTACKS);
                    JSONArray jsonMotestacks = new JSONArray(itemMotestacks.getJSON("json"));

                    MotestackBrief motestackBrief = motestack.brief();

                    if (!alreadyExists)
                        jsonMotestacks.put(motestackBrief.toJson());
                    else {
                        JSONObject temp;
                        for (int i = 0; i < jsonMotestacks.length(); i++) {
                            temp = jsonMotestacks.getJSONObject(i);
                            if (temp.getString("id").equals(motestackBrief.id)) {
                                jsonMotestacks.put(i, motestackBrief.toJson());
                                break;
                            }
                        }
                    }

                    itemMotestacks.withJSON("json", jsonMotestacks.toString());
                    mDynamo.put(mDynamoTable, itemMotestacks);

                    response.successful(true);
                } else {
                    response.successful(false);
                    response.description = "Invalid input data.";
                }
            } catch (Exception exc) {
                mLogger.error("Failed to save new sensing device.", exc);
                response.successful(false);
                response.description = "Failed to save new sensing device.";
            }
        } else {
            response.successful(false);
            response.description = "Invalid user token.";
        }
        return response;
    }

    //endregion

    //region Sensing Templates

    public ResponseArray getSensingTemplates() {
        ResponseArray response = new ResponseArray();
        try {
            ResponseArray sensingTemplatesRaw = dynamoRetrieveArray(AppProperties.DYNAMO_SENSING_TEMPLATES);
            ResponseArray parametersRaw = dynamoRetrieveArray(AppProperties.DYNAMO_PARAMETERS);
            ResponseArray sensingDevicesRaw = dynamoRetrieveArray(AppProperties.DYNAMO_SENSING_DEVICES);

            List<SensingDeviceParameter> parameters = new ArrayList<>();
            List<SensingDeviceBrief> sdBriefs = new ArrayList<>();
            List<SensingTemplateBrief> templateBriefs = new ArrayList<>();

            JSONObject temp;
            SensingDeviceParameter parameter;
            for (int i = 0; i < parametersRaw.data.length(); i++) {
                temp = parametersRaw.data.getJSONObject(i);
                parameter = (SensingDeviceParameter) IDbJson.fromJson(temp.toString(), SensingDeviceParameter.class);
                parameters.add(parameter);
            }
            SensingDeviceBrief sdBrief;
            for (int i = 0; i < sensingDevicesRaw.data.length(); i++) {
                temp = sensingDevicesRaw.data.getJSONObject(i);
                sdBrief = (SensingDeviceBrief) IDbJson.fromJson(temp.toString(), SensingDeviceBrief.class);
                sdBriefs.add(sdBrief);
            }
            SensingTemplateBrief templateBrief;
            for (int i = 0; i < sensingTemplatesRaw.data.length(); i++) {
                temp = sensingTemplatesRaw.data.getJSONObject(i);
                templateBrief = (SensingTemplateBrief) IDbJson.fromJson(temp.toString(), SensingTemplateBrief.class);
                templateBriefs.add(templateBrief);
            }

            JSONArray fullItems = new JSONArray();
            for (SensingTemplateBrief brief : templateBriefs) {
                SensingTemplateFull full = new SensingTemplateFull();

                full.id = brief.id;
                full.label = brief.label;
                full.contexts = brief.contexts;

                for (SensingDeviceBrief device : sdBriefs)
                    if (device.id.equals(brief.sensingDevice)) {
                        full.sensingDevice = device;
                        break;
                    }

                full.params = new SensingDeviceParameter[brief.params.length];
                for (int i = 0; i < brief.params.length; i++) {
                    String paramId = brief.params[i];
                    for (SensingDeviceParameter p : parameters)
                        if (p.id.equals(paramId))
                            full.params[i] = p;
                }

                fullItems.put(full.toJson());
            }

            response.data = fullItems;
            response.successful(true);
        } catch (Exception exc) {
            response.successful(false);
            response.description = "Failed to load data.";
        }
        return response;
    }

    public ResponseSingle postSensingTemplate(String token, SensingTemplateBrief template, boolean alreadyExists) {
        ResponseSingle response = new ResponseSingle();
        if (tokenValid(token)) {
            try {
                boolean valid = template != null;
                if (valid) valid = !TextUtils.isEmpty(template.label);
                if (valid) valid = template.sensingDevice != null;
                if (valid) valid = template.contexts != null;
                if (valid) valid = template.params != null;

                if (valid) {
                    if (!alreadyExists)
                        template.id = UUID.randomUUID().toString();

                    Item itemTemplates = mDynamo.get(mDynamoTable, "id", AppProperties.DYNAMO_SENSING_TEMPLATES);
                    JSONArray jsonTemplates = new JSONArray(itemTemplates.getJSON("json"));

                    if (!alreadyExists)
                        jsonTemplates.put(template.toJson());
                    else {
                        JSONObject temp;
                        for (int i = 0; i < jsonTemplates.length(); i++) {
                            temp = jsonTemplates.getJSONObject(i);
                            if (temp.getString("id").equals(template.id)) {
                                jsonTemplates.put(i, template.toJson());
                                break;
                            }
                        }
                    }

                    itemTemplates.withJSON("json", jsonTemplates.toString());
                    mDynamo.put(mDynamoTable, itemTemplates);

                    response.successful(true);
                } else {
                    response.successful(false);
                    response.description = "Invalid input data.";
                }
            } catch (Exception exc) {
                mLogger.error("Failed to save new sensing device.", exc);
                response.successful(false);
                response.description = "Failed to save new sensing device.";
            }
        } else {
            response.successful(false);
            response.description = "Invalid user token.";
        }
        return response;
    }

    //endregion

    //region Sensing Devices

    public ResponseArray getSensingDevices() {
        ResponseArray response = new ResponseArray();
        try {
            ResponseArray sensingDevicesRaw = dynamoRetrieveArray(AppProperties.DYNAMO_SENSING_DEVICES);
            ResponseArray parametersRaw = dynamoRetrieveArray(AppProperties.DYNAMO_PARAMETERS);

            List<SensingDeviceParameter> parameters = new ArrayList<>();
            List<SensingDeviceBrief> sdBriefs = new ArrayList<>();

            JSONObject temp;
            SensingDeviceParameter parameter;
            for (int i = 0; i < parametersRaw.data.length(); i++) {
                temp = parametersRaw.data.getJSONObject(i);
                parameter = (SensingDeviceParameter) IDbJson.fromJson(temp.toString(), SensingDeviceParameter.class);
                parameters.add(parameter);
            }
            SensingDeviceBrief sdBrief;
            for (int i = 0; i < sensingDevicesRaw.data.length(); i++) {
                temp = sensingDevicesRaw.data.getJSONObject(i);
                sdBrief = (SensingDeviceBrief) IDbJson.fromJson(temp.toString(), SensingDeviceBrief.class);
                sdBriefs.add(sdBrief);
            }

            JSONArray fullItems = new JSONArray();
            for (SensingDeviceBrief brief : sdBriefs) {
                SensingDeviceFull full = new SensingDeviceFull();

                full.id = brief.id;
                full.label = brief.label;
                full.type = brief.type;

                full.params = new SensingDeviceParameter[brief.params.length];
                for (int i = 0; i < brief.params.length; i++) {
                    String paramId = brief.params[i];
                    for (SensingDeviceParameter p : parameters)
                        if (p.id.equals(paramId))
                            full.params[i] = p;
                }

                fullItems.put(full.toJson());
            }

            response.data = fullItems;
            response.successful(true);
        } catch (Exception exc) {
            response.successful(false);
            response.description = "Failed to load data.";
        }
        return response;
    }

    public ResponseSingle postSensingDevice(String token, SensingDeviceFull sensingDevice, boolean alreadyExists) {
        ResponseSingle response = new ResponseSingle();
        if (tokenValid(token)) {
            try {
                boolean valid = sensingDevice != null;
                if (valid) valid = !TextUtils.isEmpty(sensingDevice.label);
                if (valid) valid = !TextUtils.isEmpty(sensingDevice.type);
                if (valid) valid = sensingDevice.params.length > 0;

                if (valid) {
                    SensingDeviceBrief brief = new SensingDeviceBrief();
                    if (!alreadyExists)
                        brief.id = UUID.randomUUID().toString();
                    else brief.id = sensingDevice.id;
                    brief.label = sensingDevice.label;
                    brief.type = sensingDevice.type;
                    brief.params = new String[sensingDevice.params.length];

                    Item itemParameters = mDynamo.get(mDynamoTable, "id", AppProperties.DYNAMO_PARAMETERS);
                    JSONArray jsonParameters = new JSONArray(itemParameters.getJSON("json"));

                    Item itemSensingDevices = mDynamo.get(mDynamoTable, "id", AppProperties.DYNAMO_SENSING_DEVICES);
                    JSONArray jsonSensingDevices = new JSONArray(itemSensingDevices.getJSON("json"));

                    int k = 0;
                    SensingDeviceBrief alreadyExistingSensingDevice = null;
                    if (alreadyExists) // finding already existing sensing device with this id for deletion comparison
                        for (k = 0; k < jsonSensingDevices.length(); k++) {
                            if (jsonSensingDevices.getJSONObject(k).getString("id").equals(brief.id)) {
                                alreadyExistingSensingDevice = (SensingDeviceBrief) IDbJson.fromJson(jsonSensingDevices.getJSONObject(k).toString(), SensingDeviceBrief.class);
                                break;
                            }
                        }

                    SensingDeviceParameter parameter; // here we check and update or add new parameters for the sensing device
                    for (int i = 0; i < sensingDevice.params.length; i++) {
                        parameter = sensingDevice.params[i];
                        if (TextUtils.isEmpty(parameter.id)) { // if empty -> new parameter. gotta add it
                            parameter.id = UUID.randomUUID().toString();
                            jsonParameters.put(parameter.toJson());
                            sensingDevice.params[i].id = parameter.id;
                        } else { // already exists. just update existing one.
                            parameter.id = sensingDevice.params[i].id;
                            for (int j = 0; j < jsonParameters.length(); j++)
                                if (jsonParameters.getJSONObject(j).getString("id").equals(parameter.id)) {
                                    jsonParameters.put(j, parameter.toJson());
                                    break;
                                }
                        }
                        brief.params[i] = parameter.id;
                    }

                    if (alreadyExistingSensingDevice != null) {
                        List<String> paramsToDelete = new ArrayList<>();
                        // in this block we check if no params in existing device were deleted.
                        for (String param : alreadyExistingSensingDevice.params) {
                            boolean found = false;

                            for (String newParam : brief.params)
                                if (newParam.equals(param)) {
                                    found = true;
                                    break;
                                }

                            if (!found) paramsToDelete.add(param);
                        }

                        // if there are some params to delete -> we filter the general params JSONArray
                        if (paramsToDelete.size() > 0) {
                            JSONArray filteredJSONArray = new JSONArray();
                            String tempId;
                            for (int i = 0; i < jsonParameters.length(); i++) {
                                tempId = jsonParameters.getJSONObject(i).getString("id");
                                boolean toDelete = false;
                                for (String paramToDelete : paramsToDelete)
                                    if (tempId.equals(paramToDelete)) {
                                        toDelete = true;
                                        break;
                                    }
                                if (!toDelete)
                                    filteredJSONArray.put(jsonParameters.getJSONObject(i));
                            }
                            jsonParameters = filteredJSONArray;
                        }
                    }

                    itemParameters.withJSON("json", jsonParameters.toString());
                    mDynamo.put(mDynamoTable, itemParameters);

                    if (alreadyExists) // we find what K is previously, because we need to check if no parameters were deleted from it.
                        jsonSensingDevices.put(k, brief.toJson());
                    else jsonSensingDevices.put(brief.toJson());

                    itemSensingDevices.withJSON("json", jsonSensingDevices.toString());
                    mDynamo.put(mDynamoTable, itemSensingDevices);

                    response.data = brief.toJson();
                    response.successful(true);
                } else {
                    response.successful(false);
                    response.description = "Invalid input data.";
                }
            } catch (Exception exc) {
                mLogger.error("Failed to save new sensing device.", exc);
                response.successful(false);
                response.description = "Failed to save new sensing device.";
            }
        } else {
            response.successful(false);
            response.description = "Invalid user token.";
        }
        return response;
    }

    public ResponseArray getSensors() {
        return dynamoRetrieveArray(AppProperties.DYNAMO_SENSORS);
    }

    public ResponseArray getProperties() {
        return dynamoRetrieveArray(AppProperties.DYNAMO_PROPERTIES);
    }

    public ResponseArray getSubjects() {
        return dynamoRetrieveArray(AppProperties.DYNAMO_SUBJECTS);
    }

    public ResponseArray getUnits() {
        return dynamoRetrieveArray(AppProperties.DYNAMO_UNITS);
    }

    public ResponseSingle postSensor(String token, Sensor sensor) {
        ResponseSingle response = new ResponseSingle();
        if (tokenValid(token)) {
            try {
                if (TextUtils.isEmpty(token) || sensor == null || TextUtils.isEmpty(sensor.label)) {
                    response.successful(false);
                    response.description = "Invalid input data.";
                } else {
                    Item item = mDynamo.get(mDynamoTable, "id", AppProperties.DYNAMO_SENSORS);
                    JSONArray array = new JSONArray(item.getJSON("json"));
                    sensor.id = UUID.randomUUID().toString();
                    array.put(sensor.toJson());
                    item.withJSON("json", array.toString());
                    mDynamo.put(mDynamoTable, item);
                    response.successful(true);
                }
            } catch (Exception exc) {
                response.successful(false);
                response.description = "Failed adding new sensor.";
                mLogger.error("Failed posting new sensor.", exc);
            }
        } else {
            response.successful(false);
            response.description = "Invalid user token.";
        }
        return response;
    }

    public ResponseSingle postProperty(String token, Property property) {
        ResponseSingle response = new ResponseSingle();
        if (tokenValid(token)) {
            try {
                if (TextUtils.isEmpty(token) || property == null || TextUtils.isEmpty(property.label)) {
                    response.successful(false);
                    response.description = "Invalid input data.";
                } else {
                    Item item = mDynamo.get(mDynamoTable, "id", AppProperties.DYNAMO_PROPERTIES);
                    JSONArray array = new JSONArray(item.getJSON("json"));
                    property.id = UUID.randomUUID().toString();
                    array.put(property.toJson());
                    item.withJSON("json", array.toString());
                    mDynamo.put(mDynamoTable, item);
                    response.successful(true);
                }
            } catch (Exception exc) {
                response.successful(false);
                response.description = "Failed adding new property.";
                mLogger.error("Failed posting new property.", exc);
            }
        } else {
            response.successful(false);
            response.description = "Invalid user token.";
        }
        return response;
    }

    public ResponseSingle postSubject(String token, Subject subject) {
        ResponseSingle response = new ResponseSingle();
        if (tokenValid(token)) {
            try {
                if (TextUtils.isEmpty(token) || subject == null || TextUtils.isEmpty(subject.label)) {
                    response.successful(false);
                    response.description = "Invalid input data.";
                } else {
                    Item item = mDynamo.get(mDynamoTable, "id", AppProperties.DYNAMO_SUBJECTS);
                    JSONArray array = new JSONArray(item.getJSON("json"));
                    subject.id = UUID.randomUUID().toString();
                    array.put(subject.toJson());
                    item.withJSON("json", array.toString());
                    mDynamo.put(mDynamoTable, item);
                    response.successful(true);
                }
            } catch (Exception exc) {
                response.successful(false);
                response.description = "Failed adding new subject.";
                mLogger.error("Failed posting new subject.", exc);
            }
        } else {
            response.successful(false);
            response.description = "Invalid user token.";
        }
        return response;
    }

    public ResponseSingle postUnit(String token, Unit unit) {
        ResponseSingle response = new ResponseSingle();
        if (tokenValid(token)) {
            try {
                if (TextUtils.isEmpty(token) || unit == null || TextUtils.isEmpty(unit.label)) {
                    response.successful(false);
                    response.description = "Invalid input data.";
                } else {
                    Item item = mDynamo.get(mDynamoTable, "id", AppProperties.DYNAMO_UNITS);
                    JSONArray array = new JSONArray(item.getJSON("json"));
                    unit.id = UUID.randomUUID().toString();
                    array.put(unit.toJson());
                    item.withJSON("json", array.toString());
                    mDynamo.put(mDynamoTable, item);
                    response.successful(true);
                }
            } catch (Exception exc) {
                response.successful(false);
                response.description = "Failed adding new unit.";
                mLogger.error("Failed posting new unit.", exc);
            }
        } else {
            response.successful(false);
            response.description = "Invalid user token.";
        }
        return response;
    }

    //endregion

    //region Statistics

    public ResponseSingle getStatistics() {
        return dynamoRetrieveSingle(AppProperties.DYNAMO_STATISTICS);
    }

    //endregion

    //region Maintenance

    public ResponseArray getMaintenance() {
        ResponseArray maintenance = dynamoRetrieveArray(AppProperties.DYNAMO_MAINTENANCE);
        if (maintenance != null && maintenance.data != null) {
            JSONArray filteredMaintenance = new JSONArray();
            for (int i = 0, j = 0; i < maintenance.data.length(); i++, j++) {
                try {
                    if (j == 20) break;
                    else filteredMaintenance.put(maintenance.data.get(i));
                } catch (Exception exc) {
                    mLogger.error("Failed to parse JSON.", exc);
                }
            }
            maintenance.data = filteredMaintenance;
        }
        return maintenance;
    }

    public ResponseArray getMaintenance(String projectId) {
        ResponseArray maintenance = dynamoRetrieveArray(AppProperties.DYNAMO_MAINTENANCE);
        if (maintenance != null && maintenance.data != null && projectId != null) {
            JSONArray filteredMaintenance = new JSONArray();
            JSONObject tempJson;
            for (int i = 0; i < maintenance.data.length(); i++) {
                try {
                    tempJson = maintenance.data.getJSONObject(i);
                    if (projectId.equals(tempJson.getString("projectId")))
                        filteredMaintenance.put(tempJson);
                } catch (Exception exc) {
                    mLogger.error("Failed to parse JSON.", exc);
                }
            }
            maintenance.data = filteredMaintenance;
        }
        return maintenance;
    }

    public List<MaintenanceType> getMaintenanceTypes() {
        ResponseArray items = dynamoRetrieveArray(AppProperties.DYNAMO_MAINTENANCE_TYPES);
        List<MaintenanceType> result = new ArrayList<>();
        JSONObject temp;
        MaintenanceType type;
        for (int i = 0; i < items.data.length(); i++) {
            try {
                temp = items.data.getJSONObject(i);
                type = (MaintenanceType) IDbJson.fromJson(temp.toString(), MaintenanceType.class);
                result.add(type);
            } catch (Exception exc) {
                exc.printStackTrace();
            }
        }
        return result;
    }

    public ResponseSingle postMaintenance(String token, Maintenance maintenance) {
        ResponseSingle response = new ResponseSingle();
        if (tokenValid(token)) {
            boolean valid = maintenance != null;
            if (valid) valid = maintenance.projectId != null;
            if (valid) valid = maintenance.user != null;
            if (valid) valid = maintenance.eventType != null;
            if (valid) valid = maintenance.comment != null;

            if (!valid) {
                response.successful(false);
                response.description = "Invalid data to save.";
            } else {
                try {
                    maintenance.id = UUID.randomUUID().toString();

                    Item item = mDynamo.get(mDynamoTable, "id", AppProperties.DYNAMO_MAINTENANCE);
                    JSONArray data = new JSONArray(item.getJSON("json"));
                    data.put(maintenance.toJson());

                    item.withJSON("json", data.toString());

                    mDynamo.put(mDynamoTable, item);

                    response.successful(true);
                } catch (Exception exc) {
                    response.successful(false);
                    response.description = "Failed saving data. Try again.";
                }
            }
        } else {
            response.successful(false);
            response.description = "Invalid message.";
        }
        return response;
    }

    public ResponseSingle deleteMaintenance(String token, String maintenanceId) {
        ResponseSingle response = new ResponseSingle();
        if (tokenValid(token)) {
            boolean valid = !TextUtils.isEmpty(token) && !TextUtils.isEmpty(maintenanceId);

            if (!valid) {
                response.successful(false);
                response.description = "Invalid data.";
            } else {
                try {
                    Item item = mDynamo.get(mDynamoTable, "id", AppProperties.DYNAMO_MAINTENANCE);
                    JSONArray data = new JSONArray(item.getJSON("json")); // todo: replace by getJSON

                    // there's no easy way to delete item from json array. we have to loop through all the items and
                    // add them to the new array.
                    JSONObject temp;
                    JSONArray newData = new JSONArray();
                    for (int i = 0; i < data.length(); i++) {
                        temp = data.getJSONObject(i);
                        if (!temp.getString("id").equals(maintenanceId))
                            newData.put(temp);
                    }

                    item.withJSON("json", newData.toString());

                    mDynamo.put(mDynamoTable, item);

                    response.successful(true);
                } catch (Exception exc) {
                    response.successful(false);
                    response.description = "Failed saving data. Try again.";
                }
            }
        } else {
            response.successful(false);
            response.description = "Invalid user token.";
        }
        return response;
    }

    //endregion

    //region Auth

    private boolean tokenValid(String token) {
        if (TextUtils.isEmpty(token)) return false;

        ResponseArray users = dynamoRetrieveArray(AppProperties.DYNAMO_USERS);
        if (users == null || users.data == null) return false;

        JSONObject temp;
        User user;
        for (int i = 0; i < users.data.length(); i++) {
            try {
                temp = users.data.getJSONObject(i);
                user = (User) IDbJson.fromJson(temp.toString(), User.class);
                if (user != null && !TextUtils.isEmpty(user.token) && token.equals(user.token))
                    return true;
            } catch (Exception exc) {
                exc.printStackTrace();
            }
        }

        return false;
    }

    public ResponseSingle signIn(String username, String password) {
        ResponseSingle response = new ResponseSingle();
        try {
            Item item = mDynamo.get(mDynamoTable, "id", AppProperties.DYNAMO_USERS);
            JSONArray data = new JSONArray(item.getJSON("json"));

            JSONObject temp;
            User user;
            for (int i = 0; i < data.length(); i++) {
                temp = data.getJSONObject(i);
                user = (User) IDbJson.fromJson(temp.toString(), User.class);
                if (username.equals(user.username) && password.equals(user.password)) {
                    user.token = UUID.randomUUID().toString();

                    data.put(i, user.toJson());
                    item.withJSON("json", data.toString());

                    // update user json in DB with a new token.
                    mDynamo.put(mDynamoTable, item);

                    // before sending user data to the client - erase password.
                    user.password = null;
                    response.data = user.toJson();
                    response.successful(true);
                    return response;
                }
            }
            response.description = "Didn't find user with this login and password.";
        } catch (Exception exc) {
            mLogger.error("Failed signing user in.", exc);
            response.description = "Something went wrong. Try again.";
        }
        response.successful(false);
        return response;
    }

    public ResponseSingle signOut(String username, String token) {
        ResponseSingle response = new ResponseSingle();
        try {
            Item item = mDynamo.get(mDynamoTable, "id", AppProperties.DYNAMO_USERS);
            JSONArray data = new JSONArray(item.getJSON("json"));

            JSONObject temp;
            User user;
            for (int i = 0; i < data.length(); i++) {
                temp = data.getJSONObject(i);
                user = (User) IDbJson.fromJson(temp.toString(), User.class);
                if (username.equals(user.username) && token.equals(user.token)) {
                    user.token = null;

                    data.put(i, user.toJson());
                    item.withJSON("json", data.toString());
                    mDynamo.put(mDynamoTable, item);

                    response.successful(true);
                    return response;
                }
            }

            response.description = "Failed to find user with this token.";
        } catch (Exception exc) {
            mLogger.error("Failed signing user in.", exc);
            response.description = "Something went wrong. Try again.";
        }
        response.successful(false);
        return response;
    }

    //endregion

    //region Users

    public ResponseArray getUsers(String token) {
        ResponseArray response;
        if (tokenValid(token)) {
            response = dynamoRetrieveArray(AppProperties.DYNAMO_USERS);
            try {
                JSONArray updatedUsers = new JSONArray();
                JSONObject temp;
                User tempUser;
                for (int i = 0; i < response.data.length(); i++) {
                    temp = response.data.getJSONObject(i);
                    tempUser = (User) IDbJson.fromJson(temp.toString(), User.class);
                    tempUser.token = null;
                    tempUser.password = null;
                    updatedUsers.put(tempUser.toJson());
                }
                response.data = updatedUsers;
                response.successful(true);
            } catch (Exception exc) {
                response.successful(false);
                mLogger.error("Failed to retrieve users.", exc);
            }
        } else {
            response = new ResponseArray();
            response.successful(false);
            response.description = "Invalid user token.";
        }
        return response;
    }

    public ResponseSingle postUser(PostUser postUser) {
        ResponseSingle response = new ResponseSingle();
        if (tokenValid(postUser.token)) {
            try {
                if (TextUtils.isEmpty(postUser.email) || TextUtils.isEmpty(postUser.username)) {
                    response.successful(false);
                    response.description = "Invalid posted data.";
                    return response;
                }

                User newUser = new User();
                newUser.id = UUID.randomUUID().toString();
                newUser.role = 4;
                newUser.password = postUser.passwordSHA1;
                newUser.email = postUser.email;
                newUser.username = postUser.username;

                Item usersItem = mDynamo.get(mDynamoTable, "id", AppProperties.DYNAMO_USERS);
                JSONArray usersJson = new JSONArray(usersItem.getJSON("json"));

                User temp;
                JSONObject tempJson;
                for (int i = 0; i < usersJson.length(); i++) {
                    tempJson = usersJson.getJSONObject(i);
                    temp = (User) IDbJson.fromJson(tempJson.toString(), User.class);
                    if (temp.username.equals(postUser.username)) {
                        response.successful(false);
                        response.description = "User with such a username already exists.";
                        return response;
                    } else if (temp.email.equals(postUser.email)) {
                        response.successful(false);
                        response.description = "User with such an email already exists.";
                        return response;
                    }
                }

                usersJson.put(newUser.toJson());
                usersItem.withJSON("json", usersJson.toString());
                mDynamo.put(mDynamoTable, usersItem);

                response.successful(true);
                newUser.token = null;
                newUser.password = null;
                response.data = newUser.toJson();
            } catch (Exception exc) {
                response.successful(false);
                mLogger.error("Failed to create a user.", exc);
            }
        } else {
            response.successful(false);
            response.description = "Invalid user token.";
        }
        return response;
    }

    public ResponseSingle updateUser(UpdateUser updateUser) {
        ResponseSingle response = new ResponseSingle();
        if (tokenValid(updateUser.token)) {
            try {
                if (TextUtils.isEmpty(updateUser.email) || TextUtils.isEmpty(updateUser.username) || TextUtils.isEmpty(updateUser.id)) {
                    response.successful(false);
                    response.description = "Invalid posted data.";
                    return response;
                }

                Item usersItem = mDynamo.get(mDynamoTable, "id", AppProperties.DYNAMO_USERS);
                JSONArray usersJson = new JSONArray(usersItem.getJSON("json"));

                int i;
                User foundUser = null;
                JSONObject tempJson;
                for (i = 0; i < usersJson.length(); i++) {
                    tempJson = usersJson.getJSONObject(i);
                    foundUser = (User) IDbJson.fromJson(tempJson.toString(), User.class);
                    if (foundUser.id.equals(updateUser.id)) {
                        break;
                    } else foundUser = null;
                }

                if (foundUser == null) {
                    response.successful(false);
                    response.description = "No user found with this ID.";
                    return response;
                } else {
                    foundUser.email = updateUser.email;
                    foundUser.username = updateUser.username;
                    usersJson.put(i, foundUser.toJson());
                    usersItem.withJSON("json", usersJson.toString());
                    mDynamo.put(mDynamoTable, usersItem);

                    foundUser.token = null;
                    foundUser.password = null;
                    response.successful(true);
                    response.data = foundUser.toJson();
                }
            } catch (Exception exc) {
                response.successful(false);
                mLogger.error("Failed to update a user.", exc);
            }
        } else {
            response.successful(false);
            response.description = "Invalid user token.";
        }
        return response;
    }

    public ResponseSingle deleteUser(DeleteUser deleteUser) {
        ResponseSingle response = new ResponseSingle();
        if (tokenValid(deleteUser.token)) {
            try {
                if (TextUtils.isEmpty(deleteUser.id)) {
                    response.successful(false);
                    response.description = "Invalid posted data.";
                    return response;
                }

                Item usersItem = mDynamo.get(mDynamoTable, "id", AppProperties.DYNAMO_USERS);
                JSONArray usersJson = new JSONArray(usersItem.getJSON("json"));

                JSONArray filteredUsersJson = new JSONArray();

                User userTemp;
                JSONObject userTempJson;
                for (int i = 0; i < usersJson.length(); i++) {
                    userTempJson = usersJson.getJSONObject(i);
                    userTemp = (User) IDbJson.fromJson(userTempJson.toString(), User.class);
                    if (!userTemp.id.equals(deleteUser.id))
                        filteredUsersJson.put(userTempJson);
                }

                usersItem.withJSON("json", filteredUsersJson.toString());
                mDynamo.put(mDynamoTable, usersItem);

                response.successful(true);
            } catch (Exception exc) {
                response.successful(false);
                mLogger.error("Failed to create a user.", exc);
            }
        } else {
            response.successful(false);
            response.description = "Invalid user token.";
        }
        return response;
    }

    public ResponseSingle updateUserPassword(UpdateUserPassword updateUserPassword) {
        ResponseSingle response = new ResponseSingle();
        if (tokenValid(updateUserPassword.token)) {
            try {
                if (TextUtils.isEmpty(updateUserPassword.newPasswordSHA1) ||
                        TextUtils.isEmpty(updateUserPassword.oldPasswordSHA1) ||
                        TextUtils.isEmpty(updateUserPassword.id)) {
                    response.successful(false);
                    response.description = "Invalid posted data.";
                    return response;
                } else if (updateUserPassword.newPasswordSHA1.equals(updateUserPassword.oldPasswordSHA1)) {
                    response.successful(false);
                    response.description = "Old and new passwords match.";
                    return response;
                }

                Item usersItem = mDynamo.get(mDynamoTable, "id", AppProperties.DYNAMO_USERS);
                JSONArray usersJson = new JSONArray(usersItem.getJSON("json"));

                int i;
                User foundUser = null;
                JSONObject tempJson;
                for (i = 0; i < usersJson.length(); i++) {
                    tempJson = usersJson.getJSONObject(i);
                    foundUser = (User) IDbJson.fromJson(tempJson.toString(), User.class);
                    if (foundUser.id.equals(updateUserPassword.id)) {
                        break;
                    } else foundUser = null;
                }

                if (foundUser == null) {
                    response.successful(false);
                    response.description = "No user found with this ID.";
                    return response;
                } else if (!foundUser.password.equals(updateUserPassword.oldPasswordSHA1)) {
                    response.successful(false);
                    response.description = "User's old password is incorrect.";
                    return response;
                } else {
                    foundUser.password = updateUserPassword.newPasswordSHA1;
                    usersJson.put(i, foundUser.toJson());
                    usersItem.withJSON("json", usersJson.toString());
                    mDynamo.put(mDynamoTable, usersItem);

                    foundUser.password = null;
                    foundUser.token = null;
                    response.successful(true);
                    response.data = foundUser.toJson();
                }
            } catch (Exception exc) {
                response.successful(false);
                mLogger.error("Failed to update user's password.", exc);
            }
        } else {
            response.successful(false);
            response.description = "Invalid user token.";
        }
        return response;
    }

    //endregion

    //region Notification Subscribers

    public ResponseArray getNotificationSubscribers(String token) {
        ResponseArray response;
        if (tokenValid(token))
            return dynamoRetrieveArray(AppProperties.DYNAMO_NOTIFICATION_SUBSCRIBERS);
        else {
            response = new ResponseArray();
            response.successful(false);
            response.description = "Invalid user token.";
        }
        return response;
    }

    public ResponseSingle postNotificationSubscriber(PostNotificationSubscription post) {
        ResponseSingle response = new ResponseSingle();
        if (tokenValid(post.token)) {
            try {
                if (post.subscriberEmails == null || post.deploymentUris == null ||
                        post.subscriberEmails.length == 0 || post.deploymentUris.length == 0) {
                    response.successful(false);
                    response.description = "Invalid posted data.";
                    return response;
                }

                NotificationSubscription newSubscription = new NotificationSubscription();
                newSubscription.id = UUID.randomUUID().toString();
                newSubscription.blocked = post.blocked;
                newSubscription.deathTime = post.deathTime;
                newSubscription.notifyTime = post.notifyTime;
                newSubscription.maxNotifications = post.maxNotifications;
                newSubscription.deploymentUris = post.deploymentUris;
                newSubscription.subscriberEmails = post.subscriberEmails;

                Item subscriptionsItem = mDynamo.get(mDynamoTable, "id", AppProperties.DYNAMO_NOTIFICATION_SUBSCRIBERS);
                JSONArray subscriptionsJson = new JSONArray(subscriptionsItem.getJSON("json"));

                subscriptionsJson.put(newSubscription.toJson());
                subscriptionsItem.withJSON("json", subscriptionsJson.toString());
                mDynamo.put(mDynamoTable, subscriptionsItem);

                response.successful(true);
                response.data = newSubscription.toJson();
            } catch (Exception exc) {
                response.successful(false);
                mLogger.error("Failed to create a subscription.", exc);
            }
        } else {
            response.successful(false);
            response.description = "Invalid user token.";
        }
        return response;
    }

    public ResponseSingle updateNotificationSubscriber(UpdateNotificationSubscription update) {
        ResponseSingle response = new ResponseSingle();
        if (tokenValid(update.token)) {
            try {
                if (TextUtils.isEmpty(update.id) ||
                        update.subscriberEmails == null ||
                        update.deploymentUris == null ||
                        update.subscriberEmails.length == 0 ||
                        update.deploymentUris.length == 0) {
                    response.successful(false);
                    response.description = "Invalid posted data.";
                    return response;
                }

                Item subscriptionsItem = mDynamo.get(mDynamoTable, "id", AppProperties.DYNAMO_NOTIFICATION_SUBSCRIBERS);
                JSONArray subscriptionsJson = new JSONArray(subscriptionsItem.getJSON("json"));

                int i;
                NotificationSubscription foundSubscription = null;
                JSONObject tempJson;
                for (i = 0; i < subscriptionsJson.length(); i++) {
                    tempJson = subscriptionsJson.getJSONObject(i);
                    foundSubscription = (NotificationSubscription) IDbJson.fromJson(tempJson.toString(), NotificationSubscription.class);
                    if (foundSubscription.id.equals(update.id)) {
                        break;
                    } else foundSubscription = null;
                }

                if (foundSubscription == null) {
                    response.successful(false);
                    response.description = "No subscription found with this ID.";
                    return response;
                } else {
                    foundSubscription.subscriberEmails = update.subscriberEmails;
                    foundSubscription.deploymentUris = update.deploymentUris;
                    foundSubscription.maxNotifications = update.maxNotifications;
                    foundSubscription.notifyTime = update.notifyTime;
                    foundSubscription.deathTime = update.deathTime;
                    foundSubscription.blocked = update.blocked;

                    subscriptionsJson.put(i, foundSubscription.toJson());
                    subscriptionsItem.withJSON("json", subscriptionsJson.toString());
                    mDynamo.put(mDynamoTable, subscriptionsItem);

                    response.successful(true);
                    response.data = foundSubscription.toJson();
                }
            } catch (Exception exc) {
                response.successful(false);
                mLogger.error("Failed to update a subscription.", exc);
            }
        } else {
            response.successful(false);
            response.description = "Invalid user token.";
        }
        return response;
    }

    public ResponseSingle deleteNotificationSubscriber(DeleteNotificationSubscription delete) {
        ResponseSingle response = new ResponseSingle();
        if (tokenValid(delete.token)) {
            try {
                if (TextUtils.isEmpty(delete.id)) {
                    response.successful(false);
                    response.description = "Invalid posted data.";
                    return response;
                }

                Item subscriptionsItem = mDynamo.get(mDynamoTable, "id", AppProperties.DYNAMO_NOTIFICATION_SUBSCRIBERS);
                JSONArray subscriptionsJson = new JSONArray(subscriptionsItem.getJSON("json"));

                JSONArray filteredSubscriptionsJson = new JSONArray();

                NotificationSubscription subscriptionTemp;
                JSONObject subscriptionTempJson;
                for (int i = 0; i < subscriptionsJson.length(); i++) {
                    subscriptionTempJson = subscriptionsJson.getJSONObject(i);
                    subscriptionTemp = (NotificationSubscription) IDbJson.fromJson(subscriptionTempJson.toString(), NotificationSubscription.class);
                    if (!subscriptionTemp.id.equals(delete.id))
                        filteredSubscriptionsJson.put(subscriptionTempJson);
                }

                subscriptionsItem.withJSON("json", filteredSubscriptionsJson.toString());
                mDynamo.put(mDynamoTable, subscriptionsItem);

                response.successful(true);
            } catch (Exception exc) {
                response.successful(false);
                mLogger.error("Failed to create a subscription.", exc);
            }
        } else {
            response.successful(false);
            response.description = "Invalid user token.";
        }
        return response;
    }

    //endregion

    //region System Errors

    /**
     * Returns last N error messages for today.
     */
    public ResponseArray middlewareErrors(String token, String day, int maxMessages) {
        ResponseArray response = new ResponseArray();
        if (tokenValid(token)) {
            try {
                JSONArray json = new JSONArray();
                Iterator<Item> allItems = mDynamo.query(mDynamoTableErrors, day);
                Item item;
                MiddlewareError error;
                while (allItems.hasNext() && maxMessages > 0) {
                    item = allItems.next();
                    error = new MiddlewareError();
                    error.id = item.getString("id");
                    error.datetime = new DateTime(item.getLong("datetime")).toString("MM-dd-yyyy HH:mm:ss");
                    error.description = item.getString("description");
                    if (item.hasAttribute("message"))
                        error.message = new JSONObject(item.getJSON("message")).toString();
                    json.put(error.toJson());
                    maxMessages--;
                }
                response.data = json;
                response.successful(true);
            } catch (Exception exc) {
                response.successful(false);
                mLogger.error("Failed to retrieve users.", exc);
            }
        } else {
            response.successful(false);
            response.description = "Invalid user token.";
        }
        return response;
    }

    //endregion
}
