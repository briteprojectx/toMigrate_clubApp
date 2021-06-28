import {Subject} from 'rxjs/Subject';
/**
 * Created by ashok on 13/05/17.
 */


export enum WebsocketState {
    DISCONNECTED,
    CONNECTING,
    CONNECTED,
    DISCONNECTING
}
export interface WebsocketConfig {
    protocol?: string;
    host?: string;
    port?: number;
    endpoint?: string;
    heartbeatIn?: number;
    heartbeatOut?: number;
    debug?: boolean;
}
export interface WebsocketSubject {
    destination: string;
    config: any;
    subject: Subject<any>;
}
export interface WebsocketStatus {
    readonly config?: WebsocketConfig;
    readonly state?: WebsocketState;
    readonly exception?: string;
}