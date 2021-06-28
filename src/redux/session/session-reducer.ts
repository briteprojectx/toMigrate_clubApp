import {Action} from '@ngrx/store';
import {AuthenticationResult, SessionInfo, SessionState} from '../../data/authentication-info';
import {SessionActions} from './session-actions';
/**
 * Created by ashok on 10/05/17.
 */
let InitSession: SessionInfo = {
    loginForm: false
}
export function sessionReducer(state: SessionInfo = InitSession, action: Action): SessionInfo {
    switch (action.type) {
        case SessionActions.SHOW_LOGIN:
            return Object.assign({}, state, {
                loginForm: true
            });
        case SessionActions.LOGIN:
            return {
                status   : SessionState.LoggingIn,
                userName : action.payload.userName,
                password : action.payload.password,
                loginForm: false
            };
        case SessionActions.SET_PLAYER_ID:
            return Object.assign({}, state, {playerId: action.payload});
        case SessionActions.LOGOUT:
            return Object.assign({}, state, {
                status   : SessionState.LoggedOut,
                authToken: '',
                password : '',
                loginForm: true,
                playerId: null
            });
        case SessionActions.LOGIN_SUCCESS:
            let newInfo: SessionInfo = action.payload;
            return Object.assign({}, state, newInfo,
                {loginForm: false, status: SessionState.LoggedIn});
        case SessionActions.LOGIN_FAILED:
            let result: AuthenticationResult = action.payload;
            return {
                status   : SessionState.LoginFailed,
                userName : state.userName,
                exception: result.exception,
                loginForm: true
            };
        case SessionActions.CLEAR_LOGIN_ERROR:
            return Object.assign({}, state, {
                status   : SessionState.LoggedOut,
                exception: '',
                loginForm: true
            });
        default:
            return state;
    }
}