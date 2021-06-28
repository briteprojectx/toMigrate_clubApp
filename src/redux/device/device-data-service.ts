import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../appstate';
import {Observable} from 'rxjs/Observable';
import {DeviceInfo} from '../../data/device-info';
/**
 * Created by ashok on 10/05/17.
 */
@Injectable()
export class DeviceDataService {

    constructor(private store: Store<AppState>){}

    public getDeviceInfo(): Observable<DeviceInfo> {
        return this.store.select(appState=>appState.deviceInfo)
            .filter(Boolean);
    }
    public getDeviceId(): Observable<string> {
        return this.store.select(appState=>appState.deviceInfo.deviceId)
            .filter(Boolean);
    }
}