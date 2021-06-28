import {Injectable} from '@angular/core';
import {AppState} from '../appstate';
import {Store} from '@ngrx/store';
import {CurrentUser, SessionInfo, SessionState} from '../../data/authentication-info';
import {Observable} from 'rxjs/Observable';
import { ServerInfo } from '../../data/server-info';
/**
 * Created by ashok on 10/05/17.
 */

@Injectable()
export class SessionDataService {

    constructor(private store: Store<AppState>){}

    /**
     * Gets the session info object
     * @returns {Promise<T>}
     */
    public getSession(): Observable<SessionInfo> {
        return this.store.select(appState=>appState.sessionInfo);
    }

    public getSessionStatus(): Observable<SessionState> {
        return this.store.select(appState=>{
            return appState.sessionInfo.status;
        });
    }

    /**
     * Specifies whether to show login form or not
     * @returns {Promise<T>}
     */
    public showLoginForm(): Observable<boolean> {
        return this.store.select(appState=>{
            return appState.sessionInfo.loginForm;
        });
    }
    /**
     * Gets the current user
     * @returns {Promise<T>}
     */
    public getCurrentUser(): Observable<CurrentUser> {
        return this.store.select(appState=>{
            return {
                userName: appState.sessionInfo.userName,
                password: appState.sessionInfo.password
            };
        });
    }

    public getAuthToken(): Observable<string> {
        return this.store.select(appState=>appState.sessionInfo.authToken);
    }

    public getCurrentSession(): Observable<SessionInfo> {
        return this.store.select(appState=>{
            return appState.sessionInfo;
        });
    }

    public getServerInfo(): Observable<ServerInfo> {
        return this.store.select(appState=>{
            console.log("appstate - get server info : ", appState)
            return appState.serverInfo;
        });
    }
}