import {SessionInfo} from '../data/authentication-info';
import {ServerInfo} from '../data/server-info';
import {DeviceInfo} from '../data/device-info';
import {PushNotificationStatus} from './pushnotf/pushnotification-status';
import {CurrentScorecard} from './scorecard/current-scorecard';
import {WebsocketStatus} from './wstomp/websocket-status';
import {ScorerState, TeetimeBooking} from './scorer-state';
import {PlayerHomeData} from './player-home/player-home-data';


/**
 * Created by ashok on 11/05/17.
 */

export interface AppState {
    readonly playerHomeData: PlayerHomeData;
    readonly sessionInfo: SessionInfo;
    readonly serverInfo: ServerInfo;
    readonly deviceInfo: DeviceInfo;
    readonly pushStatus: PushNotificationStatus;
    readonly currentScorecard: CurrentScorecard;
    readonly websocketStatus: WebsocketStatus;
    readonly scorerState: ScorerState;
    readonly teetimeBooking: TeetimeBooking;
}
export const AppSync = [
    {
        sessionInfo: ['userName', 'password', 'authToken', 'userId', 'playerId', 'clubId', 'organizerId', 'userType', 'admin', 'name', 'user']
    },
    {
        scorerState: ['selectedScorer','scoringPlayer', 'scoringCompetition']
    }

];