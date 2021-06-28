import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {AlertController, App, NavController, Platform, ToastController} from 'ionic-angular';
import {Observable, Subscriber} from 'rxjs';
import * as global from '../../globals';
import {PushServerInfo} from '../../data/push-server-info';
import {OneSignal, OSNotification, OSNotificationOpenedResult, OSNotificationPayload} from '@ionic-native/onesignal';
import {GotoPageHandlerInterface, PushNotificationHandler} from './pushnotification-handler';
import {Dialogs} from '@ionic-native/dialogs';
import { MyGolfStorageService } from '../../storage/mygolf-storage.service';
// import {OSNotification, OSNotificationOpenedResult} from "./onesignal-notification-data";
/*
 Generated class for the PushNotification provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class PushNotificationService
{

    private subscribers: Array<Subscriber<any>> = [];

    private handler: PushNotificationHandler;

    constructor(private platform: Platform, 
        private dialogs: Dialogs,
        private oneSignal: OneSignal,
        private storage: MyGolfStorageService ) {
        this.handler = new PushNotificationHandler();
    }

    public setControllers(app: App, nav: NavController,
        alertCtl: AlertController,
        toastCtl: ToastController,
        gotoPageHandler?: GotoPageHandlerInterface) {
        this.handler.setControllers(app,this.dialogs,
            nav, alertCtl, toastCtl, this.platform, gotoPageHandler);
    }
    public registerDevice(pushServerInfo: PushServerInfo) {
        //Return true if the device isn't a mobile device
        // if(!this.platform.is('cordova')) return;
        //Now register the device
        if(pushServerInfo && pushServerInfo.appKey && pushServerInfo.googleProjectNumber) {
            this.oneSignal.startInit(pushServerInfo.appKey, pushServerInfo.googleProjectNumber);
            this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);
            // InAppAlert
            // None
            this.oneSignal.handleNotificationReceived()
                .subscribe((notification: OSNotification) => {
                    this.onNotification(notification, true);
                });
            this.oneSignal.handleNotificationOpened()
                .subscribe((notfOpenedResult: OSNotificationOpenedResult)=>{
                    this.onNotification(notfOpenedResult.notification, false);
                });
            this.oneSignal.endInit();
        }

    }
    public tagPlayer(playerId: number) {
        this.oneSignal.sendTags({
            playerId: playerId + ""
        });
    }
    public initPlayer(pushServerInfo: PushServerInfo, playerId: number): Observable<boolean> {

        if (!this.platform.is("mobile")) {
            return Observable.of(false);
        }
        if (!OneSignal) {
            console.log("OneSignal not initialized");
            return Observable.of(false);
        }
        if (pushServerInfo && pushServerInfo.appKey && pushServerInfo.googleProjectNumber) {
            console.log("Initializing with OneSignal for push notification");
            if (!global.SharedObject["OneSignalRegistered"]) {
                this.oneSignal.startInit(pushServerInfo.appKey, pushServerInfo.googleProjectNumber);
                this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);
                this.oneSignal.handleNotificationReceived()
                         .subscribe((notification: OSNotification) => {
                             this.onNotification(notification, true);
                         });
                this.oneSignal.handleNotificationOpened()
                         .subscribe((notfOpenedResult: OSNotificationOpenedResult)=>{
                            this.onNotification(notfOpenedResult.notification, false);
                         });
                this.oneSignal.endInit();

                global.SharedObject["OneSignalRegistered"] = true;
            }

            // OneSignal.enableNotificationsWhenActive(false);
            // OneSignal.enableInAppAlertNotification(false);
            //Tag the user with player id
            this.oneSignal.sendTags({
                playerId: playerId + ""
            });
            return Observable.of(true);
        }
        else {
            console.log("OneSignal parameters are not set in server.");
            return Observable.of(false);
        }

    }

    private onNotification(data: OSNotification, appActive: boolean) {
        console.log("Notification arrived ", JSON.stringify(data) + " Total subscribers = " + this.subscribers.length);
        //Handle the push notification
        let _payload = [];
        
        this.storage.getPreference('notifications')
        .subscribe((a)=>{
            console.log("get pref : ", a)
            if(a) _payload = a; //_payload.push(a);
            _payload.push(data.payload);
            this.storage.setPreference('notifications', _payload);
        }, (error)=>{

        }, () =>{
            // this.storeToLocal(data.payload,_payload)
        })
        this.handler.handle(data, appActive);
    }

    private storeToLocal(payload: OSNotificationPayload, exPayload: any) {
        let _payload = payload;
        exPayload.push(_payload);
        this.storage.setPreference('notifications', exPayload);
        // notification: OSNotification, appActive: boolean
        
        let pushData: any    = _payload.additionalData;
        let title: string    = _payload.title;
        let message: string  = _payload.body;
        let notificationType = pushData.type;
        // let activePage       = view.isLast();

        // let page: any        = view._cmp.instance;
    }

}

