import {PushServerInfo} from '../../data/push-server-info';
/**
 * The status of OneSignal notification status
 * Created by ashok on 11/05/17.
 */

export interface PushNotificationStatus {
    readonly settings?: PushServerInfo;
    readonly available?: boolean;
    readonly registered?: boolean;
    readonly playerTagged?: boolean;
    readonly playerId?: number;
}