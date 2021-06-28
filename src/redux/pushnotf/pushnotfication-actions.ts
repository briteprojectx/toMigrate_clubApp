import {Injectable} from '@angular/core';
import {OneSignal} from '@ionic-native/onesignal';
import {Store} from '@ngrx/store';
import {Platform} from 'ionic-angular';
import {PushServerInfo} from '../../data/push-server-info';
import {PushNotificationService} from '../../providers/pushnotification-service/pushnotification-service';
import {AppState} from '../appstate';
import {createAction} from '../create-action';
/**
 * Created by ashok on 11/05/17.
 */

@Injectable()
export class PushNotificationActions {
    public static DERIVE_AVAILABILITY = 'DERIVE_PUSH_AVAILABILITY';
    public static SET_SETTINGS = 'SET_PUSH_SERVER_SETTINGS';
    public static TAG_PLAYER = 'PUSH_NOTIFICATION_TAG_PLAYER';
    public static DEVICE_REGISTERED = 'PUSH_NOTIFICATION_REGISTERED';

    constructor(private store: Store<AppState>,
        private oneSignal: OneSignal,
        private platform: Platform,
        private pushServer: PushNotificationService){}

    public settings (pushServerSettings: PushServerInfo) {
        if(this.platform.is('cordova')){
            this.store.dispatch(createAction(PushNotificationActions.DERIVE_AVAILABILITY, true));
            this.store.dispatch(createAction(PushNotificationActions.SET_SETTINGS, pushServerSettings));
            this.registerDevice(pushServerSettings);
        }
        else {
            this.store.dispatch(createAction(PushNotificationActions.DERIVE_AVAILABILITY, false));
            // this.store.dispatch(createAction(PushNotificationActions.SET_SETTINGS, pushServerSettings));
            // this.registerDevice(pushServerSettings);
        }
    }

    public registerPlayer(playerId: number) {
        this.pushServer.tagPlayer(playerId);
        this.store.dispatch(createAction(PushNotificationActions.TAG_PLAYER, {
            playerId: playerId
        }));
    }

    private registerDevice(pushSettings: PushServerInfo) {

        this.pushServer.registerDevice(pushSettings);
        this.store.dispatch(createAction(PushNotificationActions.DEVICE_REGISTERED));
    }
}