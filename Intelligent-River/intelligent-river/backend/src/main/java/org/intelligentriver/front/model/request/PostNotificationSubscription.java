package org.intelligentriver.front.model.request;

public class PostNotificationSubscription extends ITokenRequest {

    public long maxNotifications; // maximum notifications number PER DEVICE in a group
    public long notifyTime; // minimum time between notifications for the same device group SECONDS
    public long deathTime; // time of messages absense after which message should be sent SECONDS
    public String[] deploymentUris; // URIs of deployments in a specific group
    public String[] subscriberEmails;
    public boolean blocked; // if subscriber wants to mute notifications - blocked should be TRUE
}
