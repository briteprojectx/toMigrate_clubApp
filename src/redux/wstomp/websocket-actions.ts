import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../appstate';
import * as Stomp from 'stompjs';
import * as Global from '../../globals';
import {WebsocketConfig} from './websocket-status';
import {createAction} from '../create-action';
import {WebsocketSubject} from './';
import {Subject} from 'rxjs/Subject';

/**
 * Created by ashok on 13/05/17.
 */
@Injectable()
export class WebsocketActions {
    private config: WebsocketConfig;
    private client: Stomp.Client;
    private timer: NodeJS.Timer;
    private subjects: WebsocketSubject[] = [];
    private pendingMessages: any[] = [];


    public static CONFIGURE = 'WEBSOCKET_CONFIGURE';
    public static CONNECT = 'WEBSOCKET_CONNECT';
    public static CONNECTED = 'WEBSOCKET_CONNECTED';
    public static RECONNECT = 'WEBSOCKET_RECONNECT';
    public static CONNECTION_ERROR = 'WEBSOCKET_CONNECTION_ERROR';
    public static DISCONNECT = 'WEBSOCKET_DISCONNECT';
    public static DISCONNECTED = 'WEBSOCKET_DISCONNECTED';

    constructor(private store: Store<AppState>){}

    /**
     * Configure the websocket
     */
    public configure() {
        let config: WebsocketConfig = {
            protocol: Global.MygolfServerProtocol,
            host: Global.MygolfServerHost,
            port: Global.MygolfServerPort,
            endpoint: '/mygolf2u-ws',
            heartbeatIn: 3000,
            heartbeatOut: 3000,
            debug: true
        }
        this._configure(config);
        this.store.dispatch(createAction(WebsocketActions.CONFIGURE, config));
        this.connect();
    }



    /**
     * Subscribe to a given destination. If this is the first call for
     * subscribing the given destination, then a subject will be created.
     * If already created, it will return the existing Subject. The caller
     * can then subscribe to recieve the message
     * @param destination The destination to subscribe to
     * @returns {Subject<any>}
     */
    public subscribeTo(destSpec: string | any): Subject<any> {
        let wsSubject = this.subjects.filter(wss=>wss.destination === destSpec.destination).pop();
        if(!wsSubject) {
            wsSubject = {
                destination: destSpec.destination,
                config: destSpec,
                subject: new Subject<any>()
            };
            this.subjects.push(wsSubject);
            //Subscribe for messages
            this._subscribeDestination(wsSubject.destination, wsSubject.subject, wsSubject.config);
        }
        return wsSubject.subject;
    }
    public sendMessage(destination: string, message: any) {
        if(this.isConnected())
            this._sendMessage(destination, message);
        else {
            this.pendingMessages.push({
                destination: destination,
                message: message
            });
        }
    }
    /**
     * Do not call this method anywhere in the
     * @param config
     */
    private _configure(config: WebsocketConfig) {
        this.config = config;
        // let url = `ws://${config.host}:${config.port}${config.endpoint}`;
        let url = '';
        if(config.protocol === 'http') url = `ws://${config.host}:${config.port}${config.endpoint}`;
        else if(config.protocol === 'https') url = `wss://${config.host}:${config.port}${config.endpoint}`;
        //If already connected, ignore and return
        if(this.client && this.client.connected) return;

        this.client = Stomp.client(url);
        if(config.heartbeatIn)
            this.client.heartbeat.incoming = config.heartbeatIn;
        if(config.heartbeatOut)
            this.client.heartbeat.outgoing = config.heartbeatOut;
        if(config.debug)
            this.client.debug = this.debug;

    }

    private isConnected(): boolean {
        return this.client && this.client.connected;
    }
    private connect() {
        this.connecting();
        this.client.connect({
            login: 'guest',
            passcode: 'guest'
        }, this.onConnect,this.onError)
    }
    private debug = (...args: any[])=>{
        if(args && args[0] && (args[0].indexOf('PING') >=0 || args[0].indexOf('PONG') >= 0))
            return;
        if (console && console.log && console.log.apply) {
            console.log.apply(console, args);
        }
    };

    private onConnect = ()=> {
        this.connected();
        //Resubscribe to all destinations again
        this.subjects.forEach(wsSubject=>{
            this._subscribeDestination(wsSubject.destination, wsSubject.subject, wsSubject.config);
        });
        //Send all the pending messages
        this.sendPendingMessages();
    };

    private sendPendingMessages() {
        if(this.pendingMessages.length){
            let toSend = this.pendingMessages.shift();
            this._sendPendingMessage(toSend);
        }
    }
    private _sendPendingMessage(msg: any) {
        if(this.isConnected()){
            this._sendMessage(msg.destination, msg.message);
            this.sendPendingMessages();
        }
        else {
            this.pendingMessages.unshift(...[msg]);
        }
    }
    private onError = (error: string | Stomp.Message) => {
        if (typeof error === 'object') {
            error = (<Stomp.Message>error).body;
        }
        //Need to reconnect after certain amount of time
        if (error.indexOf('Lost connection') !== -1) {
            // Reset state indicator
            this.disconnected();
            // Attempt reconnection
            this.debug('Reconnecting in 5 seconds...');
            this.timer = setTimeout(() => {
                try{
                    if(!this.client || !this.client.connected){
                        this._configure(this.config);
                        this.connect();
                    }

                }catch(e) {}

            }, 5000);
        }
    };

    /**
     * Subscribe to a destination and on new message pass it on to destination subject
     * @param destination
     * @param subject
     * @private
     */
    private _subscribeDestination(destination: string, subject: Subject<any>, config: any) {
        if(this.isConnected()){
            this.client.subscribe(destination, (message: Stomp.Message)=> {
                let val = JSON.parse(message.body);
                subject.next(val);
                if(config.ack === 'client')
                    message.ack();
            }, config);
        }
    }

    private _sendMessage(destination: string, msg: any) {
        let msgStr = JSON.stringify(msg);
        this.client.send(destination,{}, msgStr);
    }

    private connecting() {
        // this.store.dispatch(createAction(WebsocketActions.CONNECT));
    }
    private connected() {
        // this.store.dispatch(createAction(WebsocketActions.CONNECTED));
    }
    private disconnected() {
        // this.store.dispatch(createAction(WebsocketActions.DISCONNECTED));
    }
    // private connectionError(error: string) {
    //     this.store.dispatch(createAction(WebsocketActions.CONNECTION_ERROR, error));
    // }
}