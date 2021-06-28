import {AlertController, App, NavController, Platform, ToastController, ViewController} from 'ionic-angular';
import {AbstractNotificationHandlerPage, NotificationHandlerInfo} from './notification-handler-constructs';
import * as global from '../../globals';
import {DefaultNotificationHandlers} from './push-notification-default-handlers';
import {OSNotification, OSNotificationPayload} from '@ionic-native/onesignal';
import {Dialogs} from '@ionic-native/dialogs';
import { CompetitionDetailsPage } from '../../pages/competition/competition-details/competition-details';
import { FlightsPage } from '../../pages/competition/competition-flights/competition-flights';
import { FriendListPage } from '../../pages/friend-list/friend-list';
import { BookingHomePage } from '../../pages/booking/booking-home/booking-home';
/**
 * Created by ashok on 26/10/16.
 */
export class PushNotificationHandler
{
    private app: App;
    private nav: NavController;
    private alertCtl: AlertController;
    private toastCtl: ToastController;
    private platform: Platform;
    private dialogs: Dialogs;
    private defaultHandlers = new DefaultNotificationHandlers();
    gotoPageHandler: GotoPageHandlerInterface;
    constructor() {
    }

    public setControllers(app: App,
        dialogs: Dialogs,
        nav: NavController,
        alertCtl: AlertController,
        toastCtl: ToastController,
        platform: Platform,
        gotoPageHandler?: GotoPageHandlerInterface) {
        this.app      = app;
        this.nav      = nav;
        this.dialogs = dialogs;
        this.alertCtl = alertCtl;
        this.toastCtl = toastCtl;
        this.platform = platform;
        this.gotoPageHandler = gotoPageHandler;
    }

    handle(notification: OSNotification, appActive: boolean) {
        console.log("Notification: " + JSON.stringify(notification));

        // console.log("Notification: " + JSON.stringify(notification));
        if (!notification || !notification.payload || !notification.payload.additionalData)
            return;
        let payload = notification.payload;

        // let pushData: any      = payload.additionalData;

        let length = this.nav.length();
        // alert("App In Focus " + appActive);
        if(appActive)
            this.dialogs.beep(1);
        if (length === 1) {
            this.handleAPage(payload, this.nav.getByIndex(0), true, appActive);
        }
        else {
            for (let i = 0; i < length; i++) {
                let view: ViewController = this.nav.getByIndex(i);
                this.handleAPage(payload, view, false, appActive);
            }
        }

    }

    private handleAPage(notfPayload: OSNotificationPayload,
        view: ViewController, homePageActive: boolean, appActive: boolean) {
        let pushData: any    = notfPayload.additionalData;
        let title: string    = notfPayload.title;
        let message: string  = notfPayload.body;
        let notificationType = pushData.type;
        let activePage       = view.isLast();

        let page: any        = view._cmp.instance;

                // view.instance;

        // console.log(" Active? " + activePage + " name:" + view.name);
        let handlerInfo: NotificationHandlerInfo = null;
        if (page["getNotifications"]) {
            let notificationsHandled: Array<NotificationHandlerInfo> =
                    page["getNotifications"]();
            handlerInfo                                              = notificationsHandled.filter((v: NotificationHandlerInfo) => {
                return v.type === notificationType;
            }).pop();
        }
        let defHandlerInfo = this.defaultHandlers.defaultHandlers
                                 .filter((v: NotificationHandlerInfo) => {
                                     return v.type === notificationType;
                                 }).pop();

        if (!handlerInfo) {
            handlerInfo = defHandlerInfo;
        }
        else{
            //Merge the specific handler info with default handler info
            handlerInfo = Object.assign({}, defHandlerInfo, handlerInfo);
        }
        console.log("Handler Info:" + JSON.stringify(handlerInfo));
        if (handlerInfo) {

            let action = (homePageActive && handlerInfo.whenHomePage)
                ? handlerInfo.whenHomePage
                : (activePage) ? handlerInfo.whenActive : handlerInfo.whenInactive;
            action     = (!appActive && handlerInfo.whenAppInactive) ? handlerInfo.whenAppInactive : action;
            // console.log("APP Active=" + appActive + ", action = "+ action   + ", Page Active=" + activePage + ", name:" + view.componentType["name"]);
            // console.log("Handler Info : " + JSON.stringify(handlerInfo));
            this.handleNotification(title, message, notificationType,
                pushData,
                handlerInfo,
                page,
                action,
                activePage, appActive);
        }
    }

    private handleNotification(title: string,
        message: string,
        type: string,
        pushData: any,
        handlerInfo: NotificationHandlerInfo,
        page: any,
        action: string,
        active: boolean,
        appActive: boolean) {

        console.log("Action :" + action);

        if ("showToast" === action || action === "showToastLong") {
            console.log("Showing Toast");
            // if (this.platform.is("cordova")) {
            //     console.log("Showing native toast");
            //
            //     Toast.showWithOptions({
            //         message : message,
            //         duration: (handlerInfo.toastOptions && handlerInfo.toastOptions.duration >= 0)
            //             ? handlerInfo.toastOptions.duration : 3000,
            //         position: (handlerInfo.toastOptions && handlerInfo.toastOptions.position)
            //             ? handlerInfo.toastOptions.position : "bottom",
            //         styling : (handlerInfo.toastOptions && handlerInfo.toastOptions.styling)
            //             ? handlerInfo.toastOptions.styling : MygolfToastOptions.NotificationToastStyle
            //     }).subscribe((result) => {
            //         console.log("Toast Response: " + JSON.stringify(result));
            //         if (!result || !result.event || result.event === 'show') {
            //             if (handlerInfo.needRefresh)
            //                 this.needRefresh(page, active);
            //         }
            //     },(error)=>{
            //         console.log("Native Toast Error " + JSON.stringify(error));
            //     })
            // }
            // else {
                console.log("Showing ionic toast");
                let toast = this.toastCtl.create({
                    message        : message,
                    showCloseButton: (handlerInfo.toastOptions && handlerInfo.toastOptions.hideCloseButton) ? false : true,
                    duration       : (handlerInfo.toastOptions && handlerInfo.toastOptions.duration) ?
                                     handlerInfo.toastOptions.duration : 0,
                    closeButtonText: (handlerInfo.toastOptions && handlerInfo.toastOptions.closeButtonText) ?
                                     handlerInfo.toastOptions.closeButtonText : "Close"
                });
                toast.onDidDismiss(() => {
                    if (handlerInfo.needRefresh) {
                        this.needRefresh(page, pushData, active);
                    }
                });
                toast.present();
            // }

        }
        else if ("showAlert" === action) {
            let msg = message + " Do you want to go to relevant screen?";
            this.dialogs.confirm(msg, title, ["No", "Yes"])
                   .then((result: number) => {
                       if (result === 2) {
                           this.gotoPage(type, pushData, handlerInfo.needRefresh);
                       }
                       else {
                           this.cancelGotoPage(type, pushData, handlerInfo.needRefresh);
                       }
                   });

        }
        else if ("gotoPage" === action) {
            this.gotoPage(type, pushData, handlerInfo.needRefresh);
        }
        else if ("manual" === action) {
            if (page["handleNotification"])
                page['handleNotification'](type, message, pushData);
        }
        else if ("none" === action) {
            if (handlerInfo.needRefresh) {
                this.needRefresh(page, pushData, active);
            }
        }
    }

    private gotoPage(type: string, data: any, needRefresh: boolean) {
        if(this.gotoPageHandler && this.gotoPageHandler.gotoPage)
            this.gotoPageHandler.gotoPage(this.nav, type, data, needRefresh);
        // if(type === AbstractNotificationHandlerPage.TYPE_COMP_ROUND_STARTED){
        //     global.SharedObject.homeInfo.needRefresh = true;
        //     // this.nav.popToRoot();
        //     this.nav.popToRoot();
        // }
        // else if(type === AbstractNotificationHandlerPage.TYPE_COMP_INFO_CHANGED){
        //     let compId = data.competitionDetailChanged;
        //     this.nav.push(CompetitionDetailsPage,{
        //         competitionId: compId
        //     });
        // }
        // else if(type === AbstractNotificationHandlerPage.TYPE_FLIGHTS_GENERATED){
        //     let compId = data.competitionId;
        //     let roundNo = data.roundNo;
        //     console.log("Comp Id:" + compId + ", round:" + roundNo);
        //     this.nav.push(FlightsPage,{
        //         competitionId: compId,
        //         roundNo: roundNo
        //     });
        // }
        // else if(type === AbstractNotificationHandlerPage.TYPE_FRIEND_REQUEST){
        //     // alert("Pushing friend list page");
        //     this.nav.push(FriendListPage,{
        //         homeInfo: global.SharedObject.homeInfo
        //     });
        // }
        // else if(type === AbstractNotificationHandlerPage.TYPE_FRIEND_REQUEST_ACCEPTED){
        //     // alert("Pushing friend list page");
        //     this.nav.push(FriendListPage,{
        //         homeInfo: global.SharedObject.homeInfo
        //     });
        // }
        // else if(type === AbstractNotificationHandlerPage.TYPE_BOOKING_CONFIRMATION){
        //     // alert("Pushing friend list page");
        //     this.nav.push(BookingHomePage,{
        //         homeInfo: global.SharedObject.homeInfo
        //     });
        // }
    }

    private cancelGotoPage(type: string, data: any, needRefresh: boolean) {
        if (type === AbstractNotificationHandlerPage.TYPE_COMP_ROUND_STARTED) {
            global.SharedObject.homeInfo.needRefresh = true;
        }
    }

    private needRefresh(page: any, data:any, active: boolean) {
        if (active && page["refreshPage"]) page["refreshPage"](data);
        else if (page["refreshOnViewEntered"]) page["refreshOnViewEntered"](true);
    }

}

export interface GotoPageHandlerInterface {
    gotoPage(nav: NavController, type: string, data: any, needRefresh: boolean);
}