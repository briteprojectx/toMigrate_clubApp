/**
 * Created by ashok on 11/11/16.
 */
import {NotificationHandlerInfo, AbstractNotificationHandlerPage} from "./notification-handler-constructs";
export class DefaultNotificationHandlers
{
    defaultHandlers: Array<NotificationHandlerInfo> = [];

    constructor() {
        this._init();
    }

    private _init() {
        this.defaultHandlers.push({
            type           : AbstractNotificationHandlerPage.TYPE_COMP_ROUND_STARTED,
            whenActive     : "showAlert",
            whenHomePage   : "showToast",
            whenAppInactive: "showToast",
            needRefresh    : true
        });
        this.defaultHandlers.push({
            type           : AbstractNotificationHandlerPage.TYPE_COMP_INFO_CHANGED,
            whenHomePage   : "showAlert",
            whenActive     : "showAlert",
            whenAppInactive: "gotoPage"
        });
        this.defaultHandlers.push({
            type           : AbstractNotificationHandlerPage.TYPE_COMPETITION_CANCELLED,
            whenHomePage   : "showToast",
            whenActive     : "showToast",
            whenAppInactive: "showToast",
            needRefresh    : true
        });
        this.defaultHandlers.push({
            type           : AbstractNotificationHandlerPage.TYPE_FLIGHTS_CHANGED,
            whenHomePage   : "showToast",
            whenActive     : "showToast",
            whenAppInactive: "showToast",
            needRefresh: true
        });
        this.defaultHandlers.push({
            type           : AbstractNotificationHandlerPage.TYPE_FLIGHTS_GENERATED,
            whenHomePage   : "showAlert",
            whenActive     : "showAlert",
            whenAppInactive: "gotoPage"
        });
        this.defaultHandlers.push({
            type           : AbstractNotificationHandlerPage.TYPE_FRIEND_REQUEST,
            whenHomePage   : "showToast",
            whenActive     : "showToast",
            whenAppInactive: "gotoPage",
        });
        this.defaultHandlers.push({
            type           : AbstractNotificationHandlerPage.TYPE_FRIEND_REQUEST_ACCEPTED,
            whenHomePage   : "showToast",
            whenActive     : "showToast",
            whenAppInactive: "gotoPage"
        });
        this.defaultHandlers.push({
            type           : AbstractNotificationHandlerPage.TYPE_SCORING_FINISHED,
            whenHomePage   : "showToast",
            needRefresh    : true,
            whenActive     : "showToast",
            whenAppInactive: "showToast"
        });
        this.defaultHandlers.push({
            type           : AbstractNotificationHandlerPage.TYPE_BOOKING_CONFIRMATION,
            whenHomePage   : "showToast",
            whenActive     : "showToast",
            whenAppInactive: "gotoPage"
        });
        this.defaultHandlers.push({
            type           : AbstractNotificationHandlerPage.TYPE_BOOKING_FAILURE,
            whenHomePage   : "showToast",
            needRefresh    : true,
            whenActive     : "showToast",
            whenAppInactive: "showToast"
        });
    }
}
