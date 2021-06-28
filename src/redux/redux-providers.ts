/**
 * Created by ashok on 15/05/17.
 */

import {DeviceActionEffects, DeviceActions, DeviceDataService} from './device';
import {PushNotificationActions, PushNotificationEffects} from './pushnotf';
import {CurrentScorecardActions, CurrentScorecardDataService, CurrentScorecardEffects} from './scorecard';
import {ServerInfoActions, ServerInfoDataService} from './server';
import {SessionActions, SessionDataService, SessionEffects} from './session/';
import { WebsocketActions, WebsocketDataService, WebsocketEffects} from './wstomp';
import {ScorerStateActions, ScorerStateDataService, ScorerStateEffects} from './scorer-state';
import { PlayerHomeActions, PlayerHomeDataService, PlayerHomeEffects } from './player-home';
/**
 * Created by ashok on 10/05/17.
 */

export const ReduxProviders = [
    SessionActions, SessionDataService, SessionEffects,
    ServerInfoActions, ServerInfoDataService,
    DeviceActions, DeviceActionEffects, DeviceDataService,
    PushNotificationActions, PushNotificationEffects,
    CurrentScorecardActions, CurrentScorecardDataService, CurrentScorecardEffects,
    WebsocketActions, WebsocketDataService, WebsocketEffects,
    ScorerStateActions, ScorerStateDataService, ScorerStateEffects,
    PlayerHomeActions,PlayerHomeDataService, PlayerHomeEffects
];