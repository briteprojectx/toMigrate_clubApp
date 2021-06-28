import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../appstate';
import {ServerInfo} from '../../data/server-info';
import {PushServerInfo} from '../../data/push-server-info';
import {Observable} from 'rxjs/Observable';
/**
 * Created by ashok on 10/05/17.
 */

@Injectable()
export class ServerInfoDataService {
    constructor(private store: Store<AppState>){}

    public getServerInfo(): Promise<ServerInfo> {
        return this.store.select(appState=>appState.serverInfo).toPromise();
    }

    public getPushServerInfo(): Promise<PushServerInfo> {
        return this.store.select(appState=>appState.serverInfo.pushServerInfo).toPromise();
    }
    public showAds(): Observable<boolean> {
        return this.store.select(appState => appState.serverInfo.showAds);
    }

    public adUrls(): Observable<string[]> {
        return this.store
                   .select(appState => appState.serverInfo.adUrls)
                   .filter(Boolean);
    }
}