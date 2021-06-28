import {ServerInfo} from '../../data/server-info';
import {Action} from '@ngrx/store';
import {ServerInfoActions} from './serverinfo-actions';
/**
 * Created by ashok on 10/05/17.
 */

export function serverInfoReducer(state: ServerInfo = {}, action: Action): ServerInfo {

    switch(action.type) {
        case ServerInfoActions.SERVER_INFO_REFRESH:
            return {
                serverClientMatch: 'checking'
            };
        case ServerInfoActions.SERVER_INFO_ERROR:
            return Object.assign({}, {
                serverClientMatch: '',
                success: false,
                refreshError: action.payload
            });
        case ServerInfoActions.SERVER_INFO_REFRESHED:
            return Object.assign({}, action.payload, {
                success: true
            });
        case ServerInfoActions.SERVER_INFO_MATCHES_CLIENT:
            return Object.assign({}, state, {serverClientMatch: 'matched'});
        case ServerInfoActions.SERVER_INFO_MISMATCH_CLIENT:
            return Object.assign({}, state,
                {
                    serverClientMatch: 'unmatched',
                    matchError: action.payload
                });
        default:
            return state;
    }
}