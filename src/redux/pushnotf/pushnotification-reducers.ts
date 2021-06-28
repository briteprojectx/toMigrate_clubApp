import {PushNotificationStatus} from './pushnotification-status';
import {Action} from '@ngrx/store';
import {PushNotificationActions} from './pushnotfication-actions';
/**
 * Created by ashok on 11/05/17.
 */

export function pushNotificationReducers (state: PushNotificationStatus = {}, action: Action): PushNotificationStatus {
    switch(action.type) {
        case PushNotificationActions.SET_SETTINGS:
            return Object.assign({}, state, {
                settings: action.payload
            });
        case PushNotificationActions.DERIVE_AVAILABILITY:
            return Object.assign({}, state, {
                available: action.payload
            });
        case PushNotificationActions.DEVICE_REGISTERED:
            return Object.assign({}, state, {
                registered: true
            });
        case PushNotificationActions.TAG_PLAYER:
            return Object.assign({}, state, action.payload, {
                playerTagged: true
            });
        default:
            return state;

    }
}