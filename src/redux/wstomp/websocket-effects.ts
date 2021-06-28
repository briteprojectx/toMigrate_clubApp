import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Action} from '@ngrx/store';
import {SessionInfo} from '../../data/authentication-info';
import {DeviceInfo} from '../../data/device-info';
import {DeviceActions} from '../device/device-actions';
import {DeviceDataService} from '../device/device-data-service';
import {ServerInfoActions} from '../server/serverinfo-actions';
import {SessionActions} from '../session/session-actions';
import {DESTINATION_DEVICE_REGISTER, WebsocketActions} from './';
import {DESTINATION_DEVICE_USER_TAG} from './websocket-destinations';
/**
 * Created by ashok on 13/05/17.
 */
@Injectable()
export class WebsocketEffects {
    constructor(private actions$: Actions,
        private deviceDataService: DeviceDataService,
        private deviceActions: DeviceActions,
        private websocketActions: WebsocketActions) {
    }

    @Effect({dispatch: false})
    onServerClientMatch$ = this.actions$.ofType(ServerInfoActions.SERVER_INFO_MATCHES_CLIENT)
                               .do(action => {
                                   this.websocketActions.configure();
                               });
    @Effect({dispatch: false})
    onDeviceDetected$    = this.actions$.ofType(DeviceActions.SET_DEVICE_INFO)
                               .map((action: Action) => action.payload)
                               .do((deviceInfo: DeviceInfo) => {
                                   this.websocketActions.sendMessage(DESTINATION_DEVICE_REGISTER, deviceInfo);
                                   this.deviceActions.deviceRegistered();
                               });
    @Effect({dispatch: false})
    userLoggedIn$ = this.actions$.ofType(SessionActions.LOGIN_SUCCESS)
                        .map((action: Action) => action.payload)
                        .do((session: SessionInfo) => {
                            //Get the device info
                            this.deviceDataService.getDeviceInfo().first()
                                .subscribe(device => {
                                    let tag = {
                                        deviceId: device.deviceId,
                                        userId  : session.userId
                                    };
                                    this.websocketActions.sendMessage(DESTINATION_DEVICE_USER_TAG, tag);
                                })
                        })
}