import {WebsocketState, WebsocketStatus} from './websocket-status';
import {Action} from '@ngrx/store';
import {WebsocketActions} from './websocket-actions';
/**
 * Created by ashok on 13/05/17.
 */

export function websocketReducers(state: WebsocketStatus={}, action: Action): WebsocketStatus {
    switch(action.type) {
        case WebsocketActions.CONFIGURE:
            return Object.assign({}, state, {
                config: action.payload
            });
        case WebsocketActions.CONNECT:
            return Object.assign({}, state, {
                state: WebsocketState.CONNECTING
            });
        case WebsocketActions.CONNECTED:
            return Object.assign({}, state, {
                state: WebsocketState.CONNECTED
            });
        case WebsocketActions.DISCONNECT:
            return Object.assign({}, state, {
                state: WebsocketState.DISCONNECTING
            });
        case WebsocketActions.DISCONNECTED:
            return Object.assign({}, state, {
                state: WebsocketState.DISCONNECTED
            });

    }
}