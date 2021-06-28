import {PushServerInfo} from "./push-server-info";
/**
 * Created by ashok on 17/10/16.
 */

export interface ServerInfo
{
    serverClientMatch?: string;
    matchError?: string;

    minClientVersion?: number;

    maxClientVersion?: number;

    pushServerInfo?: PushServerInfo;

    showAds?: boolean;

    adUrls?: string [];

    webSocketPort?: number;

    success?: boolean,

    refreshError?: string;
    botsOut?: boolean;
    enablePlayerAppBooking?: boolean;
}
