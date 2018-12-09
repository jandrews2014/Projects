package org.intelligentriver.front.controller;

import org.apache.http.util.TextUtils;
import org.intelligentriver.front.backend.APIService;
import org.intelligentriver.front.model.request.DeleteNotificationSubscription;
import org.intelligentriver.front.model.request.PostNotificationSubscription;
import org.intelligentriver.front.model.request.UpdateNotificationSubscription;
import org.intelligentriver.front.model.request.*;
import org.intelligentriver.front.model.metadata.MaintenanceType;
import org.intelligentriver.front.model.response.ResponseArray;
import org.intelligentriver.front.model.response.ResponseSingle;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ApiController extends BaseController {

    @GetMapping("statistics")
    public String statistics() {
        try {
            ResponseSingle response = APIService.get(mEnvironment, mLogger).getStatistics();
            JSONObject json = response.toJson();
            json.put("statistics", response.data);
            return json.toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    @GetMapping("projects")
    public String projects() {
        try {
            ResponseArray response = APIService.get(mEnvironment, mLogger).getProjects();
            JSONObject json = response.toJson();
            json.put("projects", response.data);
            return json.toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    //region Motestacks

    @GetMapping("motestacks")
    public String motestacks() {
        try {
            ResponseArray response = APIService.get(mEnvironment, mLogger).getMotestacks();
            JSONObject json = response.toJson();
            json.put("motestacks", response.data);
            return json.toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    @GetMapping("motestacksForm")
    public String motestacksForm() {
        try {
            ResponseArray projects = APIService.get(mEnvironment, mLogger).getProjects();
            ResponseArray radios = APIService.get(mEnvironment, mLogger).getRadios();
            ResponseArray templates = APIService.get(mEnvironment, mLogger).getSensingTemplates();
            ResponseArray sensingDevices = APIService.get(mEnvironment, mLogger).getSensingDevices();

            JSONObject response = projects.toJson();

            response.put("projects", projects.data);
            response.put("radios", radios.data);
            response.put("templates", templates.data);
            response.put("sensingDevices", sensingDevices.data);

            return response.toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    @RequestMapping(value = "postMotestack", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public String postMotestack(@RequestBody PostMotestack model) {
        try {
            return APIService.get(mEnvironment, mLogger).postMotestack(model.token, model.getMotestack(), false).toJson().toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    @RequestMapping(value = "updateMotestack", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public String updateMotestack(@RequestBody UpdateMotestack model) {
        try {
            return APIService.get(mEnvironment, mLogger).postMotestack(model.token, model.getMotestack(), true).toJson().toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    //endregion

    //region Sensing Templates

    @GetMapping("sensingTemplates")
    public String sensingTemplates() {
        try {
            ResponseArray response = APIService.get(mEnvironment, mLogger).getSensingTemplates();
            JSONObject json = response.toJson();
            json.put("sensingTemplates", response.data);
            return json.toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    @GetMapping("sensingTemplatesForm")
    public String sensingTemplatesForm() {
        return sensingDevices();
    }

    @RequestMapping(value = "postSensingTemplate", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public String postSensingTemplate(@RequestBody PostSensingTemplate model) {
        try {
            return APIService.get(mEnvironment, mLogger).postSensingTemplate(model.token, model.getSensingTemplate(), false).toJson().toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    @RequestMapping(value = "updateSensingTemplate", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public String updateSensingTemplate(@RequestBody UpdateSensingTemplate model) {
        try {
            return APIService.get(mEnvironment, mLogger).postSensingTemplate(model.token, model.getSensingTemplate(), true).toJson().toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    //endregion

    //region Sensing Devices

    @GetMapping("sensingDevices")
    public String sensingDevices() {
        try {
            ResponseArray response = APIService.get(mEnvironment, mLogger).getSensingDevices();
            JSONObject json = response.toJson();
            json.put("sensingDevices", response.data);
            return json.toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    @GetMapping("sensingDevicesForm")
    public String sensingDevicesForm() {
        try {
            ResponseArray sensors = APIService.get(mEnvironment, mLogger).getSensors();
            ResponseArray units = APIService.get(mEnvironment, mLogger).getUnits();
            ResponseArray properties = APIService.get(mEnvironment, mLogger).getProperties();
            ResponseArray subjects = APIService.get(mEnvironment, mLogger).getSubjects();

            JSONObject response = sensors.toJson();

            response.put("sensors", sensors.data);
            response.put("units", units.data);
            response.put("properties", properties.data);
            response.put("subjects", subjects.data);

            return response.toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    @RequestMapping(value = "postSensingDevice", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public String postSensingDevice(@RequestBody PostSensingDevice model) {
        try {
            ResponseSingle response = APIService.get(mEnvironment, mLogger).postSensingDevice(model.token, model.getSensingDevice(), false);
            JSONObject json = response.toJson();
            json.put("newSensingDevice", response.data);
            return json.toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    @RequestMapping(value = "updateSensingDevice", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public String updateSensingDevice(@RequestBody UpdateSensingDevice model) {
        try {
            return APIService.get(mEnvironment, mLogger).postSensingDevice(model.token, model.getSensingDevice(), true).toJson().toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    @RequestMapping(value = "postSensor", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public String postSensor(@RequestBody PostSensor model) {
        try {
            return APIService.get(mEnvironment, mLogger).postSensor(model.token, model.getSensor()).toJson().toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    @RequestMapping(value = "postProperty", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public String postProperty(@RequestBody PostProperty model) {
        try {
            return APIService.get(mEnvironment, mLogger).postProperty(model.token, model.getProperty()).toJson().toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    @RequestMapping(value = "postUnit", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public String postUnit(@RequestBody PostUnit model) {
        try {
            return APIService.get(mEnvironment, mLogger).postUnit(model.token, model.getUnit()).toJson().toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    @RequestMapping(value = "postSubject", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public String postSubject(@RequestBody PostSubject model) {
        try {
            return APIService.get(mEnvironment, mLogger).postSubject(model.token, model.getSubject()).toJson().toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    //endregion

    //region Deployments

    @GetMapping("deploymentsAll")
    public String deployments() {
        try {
            ResponseArray response = APIService.get(mEnvironment, mLogger).getDeployments();
            JSONObject json = response.toJson();
            json.put("deployments", response.data);
            return json.toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    @GetMapping("deployments")
    public String deployments(@RequestParam String projectId) {
        try {
            ResponseArray response = APIService.get(mEnvironment, mLogger).getDeployments(projectId);
            JSONObject json = response.toJson();
            json.put("deployments", response.data);
            return json.toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    @GetMapping("deploymentsExpanded")
    public String deploymentsExpanded(@RequestParam String projectId) {
        try {
            ResponseArray response = APIService.get(mEnvironment, mLogger).getDeploymentsExpanded(projectId);
            JSONObject json = response.toJson();
            json.put("deployments", response.data);
            return json.toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    @GetMapping("deploymentsExpandedAll")
    public String deploymentsExpandedAll() {
        try {
            ResponseArray response = APIService.get(mEnvironment, mLogger).getDeploymentsExpanded();
            JSONObject json = response.toJson();
            json.put("deployments", response.data);
            return json.toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    @GetMapping("deploymentDetails")
    public String deploymentDetails(@RequestParam String deploymentId) {
        try {
            ResponseSingle response = APIService.get(mEnvironment, mLogger).getDeploymentDetails(deploymentId);
            JSONObject json = response.toJson();
            json.put("deployment", response.data);
            return json.toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    @GetMapping("deploymentsForm")
    public String deploymentsForm() {
        try {
            ResponseArray projects = APIService.get(mEnvironment, mLogger).getProjects();
            ResponseArray motestacks = APIService.get(mEnvironment, mLogger).getMotestacksBrief();

            JSONObject response = projects.toJson();

            response.put("projects", projects.data);
            response.put("motestacks", motestacks.data);

            return response.toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    @RequestMapping(value = "postDeployment", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public String postDeployment(@RequestBody PostDeployment model) {
        try {
            return APIService.get(mEnvironment, mLogger).postDeployment(model.token, model.getDeployment(), false).toJson().toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    @RequestMapping(value = "updateDeployment", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public String updateDeployment(@RequestBody UpdateDeployment model) {
        try {
            return APIService.get(mEnvironment, mLogger).postDeployment(model.token, model.getDeployment(), true).toJson().toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    //endregion

    //region Radios

    @GetMapping("radios")
    public String radios() {
        try {
            ResponseArray response = APIService.get(mEnvironment, mLogger).getRadios();
            JSONObject json = response.toJson();
            json.put("radios", response.data);
            return json.toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    @RequestMapping(value = "postRadio", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public String postRadio(@RequestBody PostRadio model) {
        try {
            return APIService.get(mEnvironment, mLogger).postRadio(model.token, model.getRadio(), false).toJson().toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    @RequestMapping(value = "updateRadio", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public String updateRadio(@RequestBody UpdateRadio model) {
        try {
            return APIService.get(mEnvironment, mLogger).postRadio(model.token, model.getRadio(), true).toJson().toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    //endregion

    //region Maintenance

    @GetMapping("maintenance")
    public String maintenance(@RequestParam String projectId) {
        try {
            APIService service = APIService.get(mEnvironment, mLogger);
            ResponseArray response = TextUtils.isEmpty(projectId) ? service.getMaintenance() : service.getMaintenance(projectId);
            JSONObject json = response.toJson();
            json.put("maintenance", response.data);
            return json.toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    @GetMapping("maintenanceForm")
    public String maintenanceForm(@RequestParam String projectId) {
        try {
            ResponseArray array = APIService.get(mEnvironment, mLogger).getDeployments(projectId);
            array.successful(true);

            List<MaintenanceType> types = APIService.get(mEnvironment, mLogger).getMaintenanceTypes();
            JSONArray typesJson = new JSONArray();
            for (MaintenanceType type : types)
                typesJson.put(type.toJson());

            JSONObject response = array.toJson();
            response.put("deployments", array.data);
            response.put("eventTypes", typesJson);

            return response.toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    @RequestMapping(value = "postMaintenance", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public String postMaintenance(@RequestBody PostMaintenance model) {
        try {
            return APIService.get(mEnvironment, mLogger).postMaintenance(model.token, model.getMaintenance()).toJson().toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    @RequestMapping(value = "deleteMaintenance", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public String deleteMaintenance(@RequestBody DeleteMaintenance model) {
        try {
            return APIService.get(mEnvironment, mLogger).deleteMaintenance(model.token, model.maintenanceId).toJson().toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    //endregion

    //region Auth

    @RequestMapping(value = "signIn", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public String signIn(@RequestBody PostSignIn model) {
        try {
            ResponseSingle responseSingle = APIService.get(mEnvironment, mLogger).signIn(model.login, model.passwordSHA1);
            JSONObject json = responseSingle.toJson();
            json.put("user", responseSingle.data);
            return json.toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    @RequestMapping(value = "signOut", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public String signOut(@RequestBody PostSignOut model) {
        ResponseSingle result = APIService.get(mEnvironment, mLogger).signOut(model.login, model.token);
        try {
            return result.toJson().toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    //endregion

    //region Diagnostics

    @GetMapping("diagnostics")
    public String diagnostics(@RequestParam String projectId) {
        try {
            ResponseArray array = APIService.get(mEnvironment, mLogger).getDiagnostics(projectId);
            JSONObject json = array.toJson();
            json.put("diagnostics", array.data);
            return json.toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    @GetMapping("diagnosticsArchive")
    public String diagnostics(@RequestParam String projectId, @RequestParam String date) {
        try {
            ResponseArray array = APIService.get(mEnvironment, mLogger).getDiagnostics(projectId, date);
            JSONObject json = array.toJson();
            json.put("diagnostics", array.data);
            return json.toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }


    //endregion

    //region Data

    @GetMapping("dataRecent")
    public String dataRecent(@RequestParam String projectId) {
        try {
            ResponseArray array = APIService.get(mEnvironment, mLogger).getData(projectId);
            JSONObject json = array.toJson();
            json.put("data", array.data);
            return json.toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    @GetMapping("dataArchive")
    public String dataArchive(@RequestParam String projectId, @RequestParam String date) {
        try {
            ResponseArray array = APIService.get(mEnvironment, mLogger).getData(projectId, date);
            JSONObject json = array.toJson();
            json.put("data", array.data);
            return json.toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    //endregion

    //region Status

    @GetMapping("status")
    public String status(@RequestParam String projectId) {
        try {
            ResponseArray array = APIService.get(mEnvironment, mLogger).getStatuses(projectId);
            JSONObject json = array.toJson();
            json.put("statuses", array.data);
            return json.toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    //endregion/

    //region Users

    @GetMapping("users")
    public String users(@RequestParam String token) {
        try {
            ResponseArray response = APIService.get(mEnvironment, mLogger).getUsers(token);
            JSONObject json = response.toJson();
            json.put("users", response.data);
            return json.toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    @RequestMapping(value = "postUser", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public String postUser(@RequestBody PostUser model) {
        try {
            ResponseSingle response = APIService.get(mEnvironment, mLogger).postUser(model);
            JSONObject json = response.toJson();
            json.put("newUser", response.data);
            return json.toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    @RequestMapping(value = "updateUser", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public String updateUser(@RequestBody UpdateUser model) {
        try {
            ResponseSingle response = APIService.get(mEnvironment, mLogger).updateUser(model);
            JSONObject json = response.toJson();
            json.put("updatedUser", response.data);
            return json.toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    @RequestMapping(value = "updateUserPassword", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public String updateUser(@RequestBody UpdateUserPassword model) {
        try {
            ResponseSingle response = APIService.get(mEnvironment, mLogger).updateUserPassword(model);
            JSONObject json = response.toJson();
            json.put("updatedUser", response.data);
            return json.toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    @RequestMapping(value = "deleteUser", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public String deleteUser(@RequestBody DeleteUser model) {
        try {
            return APIService.get(mEnvironment, mLogger).deleteUser(model).toJson().toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    //endregion

    //region System Errors

    /**
     * @param day - format yyyy-MM-dd
     */
    @GetMapping("middlewareErrors")
    public String middlewareErrors(@RequestParam String token, @RequestParam String day, @RequestParam int amount) {
        try {
            ResponseArray response = APIService.get(mEnvironment, mLogger).middlewareErrors(token, day, amount);
            JSONObject json = response.toJson();
            json.put("errors", response.data);
            return json.toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    //endregion

    //region Notification Subscribers

    @GetMapping("notificationSubscribers")
    public String notificationSubscribers(@RequestParam String token) {
        try {
            ResponseArray response = APIService.get(mEnvironment, mLogger).getNotificationSubscribers(token);
            JSONObject json = response.toJson();
            json.put("subscribers", response.data);
            return json.toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    @RequestMapping(value = "postNotificationSubscriber", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public String postNotificationSubscriber(@RequestBody PostNotificationSubscription model) {
        try {
            ResponseSingle response = APIService.get(mEnvironment, mLogger).postNotificationSubscriber(model);
            JSONObject json = response.toJson();
            json.put("newSubscriber", response.data);
            return json.toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    @RequestMapping(value = "updateNotificationSubscriber", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public String updateNotificationSubscriber(@RequestBody UpdateNotificationSubscription model) {
        try {
            ResponseSingle response = APIService.get(mEnvironment, mLogger).updateNotificationSubscriber(model);
            JSONObject json = response.toJson();
            json.put("updatedSubscriber", response.data);
            return json.toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    @RequestMapping(value = "deleteNotificationSubscriber", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public String deleteNotificationSubscriber(@RequestBody DeleteNotificationSubscription model) {
        try {
            return APIService.get(mEnvironment, mLogger).deleteNotificationSubscriber(model).toJson().toString();
        } catch (Exception exc) {
            return errorJson().toString();
        }
    }

    //endregion

    private JSONObject errorJson() {
        try {
            JSONObject json = new JSONObject();
            json.put("status", "failure");
            json.put("description", "Failed converting JSON data.");
            return json;
        } catch (Exception exc) {
            return new JSONObject();
        }
    }
}
