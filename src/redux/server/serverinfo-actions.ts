import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../appstate';
import {ServerInfoService} from '../../providers/serverinfo-service/serverinfo-service';
import {createAction} from '../create-action';
import {ServerInfo} from '../../data/server-info';
import {AppVersion} from '@ionic-native/app-version';
import {Platform} from 'ionic-angular';
import {ConnectionService} from '../../providers/connection-service/connection-service';
import {MessageDisplayUtil} from '../../message-display-utils';
import {PushNotificationActions} from '../pushnotf/pushnotfication-actions';
import { SessionActions } from '../session';
import { ToastController } from 'ionic-angular';
/**
 * Created by ashok on 10/05/17.
 */

@Injectable()
export class ServerInfoActions {
    public static SERVER_INFO_REFRESH = 'SERVER_INFO_REFRESH';
    public static SERVER_INFO_REFRESHED = 'SERVER_INFO_REFRESHED';
    public static SERVER_INFO_ERROR = 'SERVER_INFO_ERROR';
    public static SERVER_INFO_MATCHES_CLIENT = 'SERVER_INFO_MATCHES_CLIENT';
    public static SERVER_INFO_MISMATCH_CLIENT = 'SERVER_INFO_MISMATCH_CLIENT';
    constructor(private store: Store<AppState>,
        private platform: Platform,
        private connService: ConnectionService,
        private serverInfoService: ServerInfoService,
        private pushActions: PushNotificationActions,
        private appVersion: AppVersion,
        private sessionActions: SessionActions,
        private toastCtl: ToastController){}

    public refresh() {
        console.log("Reading server info");
        this.store.dispatch(createAction(ServerInfoActions.SERVER_INFO_REFRESH));
        this.serverInfoService.serverInfo()
            .subscribe((serverInfo:ServerInfo)=>{
                console.log("Reading server info", serverInfo);
                this.refreshed(serverInfo);
                // console.log("refresh", serverInfo)
            },(error)=>{
                // console.error("Error reading server info", error);
                let msg = MessageDisplayUtil.getError(error, this.platform, this.connService, 'Server may be down.')
                this.refreshError(msg);
                if(error.status === 403) {
                    this.sessionActions.logout();
                    MessageDisplayUtil.showMessageToast('Server may be down. Please try to login again.',
                    this.platform, this.toastCtl, 3000, "bottom")
                }
            });
    }

    public refreshed(serverInfo: ServerInfo) {
        console.log("Server info read " + JSON.stringify(serverInfo));
        this.store.dispatch(createAction(ServerInfoActions.SERVER_INFO_REFRESHED, serverInfo));
        //Check the server info actions
        if(this.platform.is('cordova')){
            this.appVersion.getVersionNumber()
                .then((versionStr: string)=>{
                    let versionNumber = parseFloat(versionStr);
                    let data = this.checkVersions(serverInfo, versionNumber);
                    if(data.proceed)
                        this.serverInfoMatches(serverInfo);
                    else
                        this.store.dispatch(createAction(ServerInfoActions.SERVER_INFO_MISMATCH_CLIENT, data.msg));
                })
        }
        else {
            this.serverInfoMatches(serverInfo);
        }

    }
    public refreshError(errorMessage: string) {
        this.store.dispatch(createAction(ServerInfoActions.SERVER_INFO_ERROR, errorMessage));
    }
    public serverInfoMatches(serverInfo: ServerInfo) {
        console.log("Server and client versions match. Proceed.")
        this.store.dispatch(createAction(ServerInfoActions.SERVER_INFO_MATCHES_CLIENT, serverInfo));
        this.pushActions.settings(serverInfo.pushServerInfo);
        console.log("Called push settings");
    }
    private checkVersions(serverInfo: ServerInfo, versionNumber: number): any {
        console.log("Checking server and client version");
        let data: any = {
            proceed: true
        };
        if (serverInfo.minClientVersion && serverInfo.minClientVersion > versionNumber) {
            data.msg     = "The minimum APP version supported by the server is "
                + serverInfo.minClientVersion +
                ". You are currently on version " + versionNumber
                + ". Please update your myGolf2u app to the latest version.";
            data.proceed = false;
        }
        else if (serverInfo.maxClientVersion && serverInfo.maxClientVersion < versionNumber) {
            data.msg     = "The maximum client version supported by myGolf server is "
                + serverInfo.maxClientVersion +
                ". The current APP version is " + versionNumber;
            data.proceed = false;
        }
        return data;
    }
}