import {Observable} from "rxjs";
/**
 * This is the base class for handling.
 * <p>
 *     <b>type:</b> The unique notification type.
 *     <b>whenActive:</b> The action required when the page is active.
 *     <b>whenInactive:</b> The action requires when the page is inactive.
 *      <b>needRefresh:</b> Specifies whether refresh in the screen required.
 *     The supported actions are
 *     <ul>
 *         <li>Manual: The page will handle the push notification manually</li>
 *         <li>showAlert: Shows an alert with push notification message. The alert </li>
 *         <li>showToast: Shows a toast with message </li>
 *     </ul>
 * </p>
 * Created by ashok on 27/10/16.
 */

export interface NotificationHandlerInfo
{
    type: string;
    whenActive?: string,
    whenInactive?: string,
    whenHomePage?: string,
    whenAppInactive?: string,
    needRefresh?: boolean,
    toastOptions?: any
}

export class MygolfToastOptions
{
    public static ErrorToastStyle: any = {
        opacity          : 0.75, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
        backgroundColor  : '#FF0000', // make sure you use #RRGGBB. Default #333333
        textColor        : '#FFFFFF', // Ditto. Default #FFFFFF
        textSize         : 13, // Default is approx. 13.
        cornerRadius     : 16, // minimum is 0 (square). iOS default 20, Android default 100
        horizontalPadding: 15, // iOS default 16, Android default 50
        verticalPadding  : 15 // iOS default 12, Android default 30
    }

    public static MessageToastStyle: any = {
        opacity          : 0.75, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
        backgroundColor  : '#228B22', // make sure you use #RRGGBB. Default #333333
        textColor        : '#FFFFFF', // Ditto. Default #FFFFFF
        textSize         : 13, // Default is approx. 13.
        cornerRadius     : 16, // minimum is 0 (square). iOS default 20, Android default 100
        horizontalPadding: 15, // iOS default 16, Android default 50
        verticalPadding  : 15 // iOS default 12, Android default 30
    }

    public static NotificationToastStyle: any = {
        opacity          : 0.75, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
        backgroundColor  : '#1E90FF', // make sure you use #RRGGBB. Default #333333
        textColor        : '#FFFFFF', // Ditto. Default #FFFFFF
        textSize         : 13, // Default is approx. 13.
        cornerRadius     : 30, // minimum is 0 (square). iOS default 20, Android default 100
        horizontalPadding: 15, // iOS default 16, Android default 50
        verticalPadding  : 15 // iOS default 12, Android default 30
    }
}

export abstract class AbstractNotificationHandlerPage
{
    public static TYPE_COMP_ROUND_STARTED: string      = "competitionRoundStarted";
    public static TYPE_FRIEND_REQUEST: string          = "friendRequest";
    public static TYPE_FRIEND_REQUEST_ACCEPTED: string = "friendRequestAccepted";
    public static TYPE_COMP_INFO_CHANGED: string       = "competitionInfoChange";
    public static TYPE_FLIGHTS_GENERATED: string       = "flightsGenerated";
    public static TYPE_FLIGHTS_CHANGED: string         = "flightsChanged";
    public static TYPE_COMPETITION_CANCELLED: string   = "competitionCancelled";
    public static TYPE_SCORING_FINISHED: string        = "scoringFinished";
    public static TYPE_BOOKING_CONFIRMATION: string    = "bookingConfirmation";
    public static TYPE_BOOKING_FAILURE: string         = "bookingFailure";

    private refreshRequired: boolean;

    /**
     * sets the refresh on view entering true. Based on the notification
     * requirement, the view may need to be refreshed
     * @param refresh
     */
    public refreshOnViewEntered(refresh: boolean) {
        this.refreshRequired = refresh;
    }

    protected isRefreshRequired() {
        return this.refreshRequired;
    }

    ionViewDidEnter() {
        if (this.refreshRequired) {
            this.refreshPage().subscribe((refreshed: boolean) => {
                this.refreshRequired = false;
            }, (error) => {

            }, () => {
                this.onViewEntered();
            });
        }
        else this.onViewEntered();

    }

    /**
     * Gets the list of notifications and their handling.
     */
    public abstract getNotifications(): Array<NotificationHandlerInfo>;

    public abstract  handleNotification(type: string, message: string, notfData: any);

    /**
     * when alert popup is displayed with option to goto
     * @param notfData
     */

    /**
     * Any refresh on page should be handled by the implementing page component;
     */
    public abstract refreshPage(): Observable<boolean>;

    public abstract onViewEntered();
}
