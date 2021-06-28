import {deviceDataReducers} from './device/devicedata-reducers';
import {pushNotificationReducers} from './pushnotf/pushnotification-reducers';
import {currentScorecardReducers} from './scorecard/current-scorecard-reducers';
import {serverInfoReducer} from './server/serverinfo-reducer';
import {sessionReducer} from './session/session-reducer';
import {websocketReducers} from './wstomp/websocket-reducers';
import {scorerStateReducers} from './scorer-state/scorer-state-reducers';
/**
 * Created by ashok on 15/05/17.
 */

export const RootReducer = {
    serverInfo      : serverInfoReducer,
    sessionInfo     : sessionReducer,
    deviceInfo      : deviceDataReducers,
    pushNotification: pushNotificationReducers,
    currentScorecard: currentScorecardReducers,
    websocketStatus: websocketReducers,
    scorerState: scorerStateReducers
}