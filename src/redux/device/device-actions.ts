import {Injectable} from '@angular/core';
import {AppState} from '../appstate';
import {Store} from '@ngrx/store';
import {createAction} from '../create-action';
import {DeviceInfo} from '../../data/device-info';

import {DeviceService} from '../../providers/device-service/device-service';
/**
 * Created by ashok on 10/05/17.
 */
@Injectable()
export class DeviceActions {
    public static DERIVE_DEVICE_INFO = 'DERIVE_DEVICE_INFO';
    public static SET_DEVICE_INFO = 'SET_DEVICE_INFO';
    public static CONFIGURE_STOMP = 'CONFIGURE_STOMP';
    public static DEVICE_REGISTERED = 'DEVICE_REGISTERED';
    constructor(private store: Store<AppState>,
        private deviceService: DeviceService) {
    }

    public detectDevice() {
        console.log("Detecting device")
        this.deviceService.getDeviceInfo().then((deviceInfo: DeviceInfo)=>{
            this.setDeviceInfo(deviceInfo);
        });
    }

    public setDeviceInfo(deviceInfo: DeviceInfo) {
        console.log("Device detetced " + JSON.stringify(deviceInfo));
        this.store.dispatch(createAction(DeviceActions.SET_DEVICE_INFO, deviceInfo));

    }
    public deviceRegistered() {
        this.store.dispatch(createAction(DeviceActions.DEVICE_REGISTERED));
    }
    public tagDeviceUser(userId: number) {
        this.store.select(appState=>appState.deviceInfo.deviceId)
            .take(1)
            .subscribe(deviceId=> {
                console.log("Tagging device user");
            })
    }

}