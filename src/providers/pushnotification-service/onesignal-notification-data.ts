/**
 * Created by ashok on 06/12/16.
 */
export interface OSNotificationActionButton
{
    id: string;
    text: string;
    icon: string;
}
export interface OSNotificationPayload
{
    notificationId: string; //OneSignal Notification UUID
    title?: string; //Title of the notification
    body?: string; //Body of the notification
    additionalData?: any; //Custom additional data that was sent with notification.
    launchUrl?: string; //URL to open when opening notification
    sound?: string; //Sound resource to play when notification shown
    /*
     How notification shown.
     1= Public (Fully visible),
     2=Private (Contents are hidden)
     -1= Secret (Not Shown)
     */
    lockScreenVisibility?: string ;
    //Notifications with same key will be grouped together as single summary notification
    groupKey?: string;
    //Summary text displayed in the summary notification
    groupMessage?: string;
    //The google project number this notification sent under
    fromProjectNumber?: string;

    actionButtons?: Array<OSNotificationActionButton>;

    rawPayload?: string;
}
export interface OSNotification
{
    //Was APP in focus
    isAppInFocus: boolean;
    //Whether the notification was shown to the user. Will be false for silent notifications
    shown: boolean;
    androidNotificationId?: number;
    //Payload recieved from the OneSignal
    payload: OSNotificationPayload;
    displayType: number;

}
export interface OSNotificationAction{
    type: any;
    actionID: string;
}
export interface OSNotificationOpenedResult {
    notification: OSNotification;
    action: OSNotificationAction;
}
