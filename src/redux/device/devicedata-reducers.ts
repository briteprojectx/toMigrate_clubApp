import {DeviceInfo} from '../../data/device-info';
import {Action} from '@ngrx/store';
import {DeviceActions} from './device-actions';
/**
 * Created by ashok on 10/05/17.
 */

export function deviceDataReducers(state: DeviceInfo = {}, action: Action): DeviceInfo {
    switch (action.type) {
        case DeviceActions.SET_DEVICE_INFO:
            return Object.assign({}, state, action.payload);
        default:
            return state;
    }
}