import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {AppState} from '../appstate';
import {WebsocketConfig, WebsocketState, WebsocketStatus} from './';
/**
 * Created by ashok on 13/05/17.
 */

@Injectable()
export class WebsocketDataService {

    constructor(private store: Store<AppState>){}

    public get(): Observable<WebsocketStatus> {
        return this.store.select(appState=>appState.websocketStatus)
            .filter(Boolean);
    }
    public getConfig(): Observable<WebsocketConfig> {
        return this.store.select(appState=>appState.websocketStatus.config).filter(Boolean);
    }

    public connected(): Observable<boolean> {
        return this.store.select(appState=>appState.websocketStatus.state)
            .map(state=>{
                return state === WebsocketState.CONNECTED;
            })
    }

}