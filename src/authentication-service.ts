import {Headers, Http, Response} from '@angular/http';
import * as globals from './globals';
import {Injectable} from '@angular/core';
import {VolatileStorage} from './storage/volatile-storage';
import {Preference} from './storage/preference';
import {AuthenticationResult, SessionInfo} from './data/authentication-info';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {isPresent} from 'ionic-angular/util/util';
/**
 * Created by Ashok on 06-04-2016.
 */
@Injectable()
export class AuthenticationService {
    public static CurrentUser: string = "CurrentUser";
    private curUser: any;

    constructor(private http: Http,
        private preference: Preference,
        private volatileStorage: VolatileStorage) {
        console.log("Authentication service*********");
        preference.getPref(AuthenticationService.CurrentUser)
                  .subscribe((data: any) => {
                      this.curUser = data;
                  })
    }

    /**
     * Checks whether currently signed in or not
     * @returns {boolean} Returns true if signed in and session info exist
     */
    isSignedIn(): boolean {
        let session: SessionInfo = this.volatileStorage.getObject("session");
        return isPresent(session) && isPresent(session.authToken);
    }

    currentUser(): Observable<any> {
        return this.preference.getPref(AuthenticationService.CurrentUser);
    }

    /**
     * Gets the current user from the storage. The current user is one who logged in
     * last
     * @param subscriber The retrieval of current user is asynchronous process.
     * Pass the
     */
    getCurrentUser(): any {
        return this.curUser;
    }

    /**
     * Gets the current session information for the logged in user
     * @returns {SessionInfo} The session info object
     */
    // currentSession(): SessionInfo {
    //     return this.volatileStorage.getObject("session");
    // }

    authenticatePlayer(username: string, password: string): Observable<SessionInfo> {
        let creds   = "email=" + username + "&" + "password=" + password + "&username=" + username;
        let headers = new Headers();
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        console.log("Authentication URL = " + globals.ServerUrls.authentication);
        return this.http.post(globals.ServerUrls.authentication, creds, {
            headers: headers
        })
                   .map((res: Response) => {
                       let data: AuthenticationResult = res.json();
                       let sessionInfo: SessionInfo   = {
                           authToken  : data.authToken,
                           userId     : data.user.userId,
                           userName   : username,
                           password   : password,
                           userType   : data.user.userType,
                           playerId   : data.user.playerId,
                           clubId     : data.user.clubId,
                           organizerId: data.user.organizerId,
                           name       : data.name,
                           admin    : data.user.admin,
                       }
                       this.volatileStorage.setObject("session", sessionInfo);
                       this.volatileStorage.setBoolean("authenticated", true);
                       // //Store the current user in preference so that it can be
                       // //used for auto login next time
                       let curUser = {
                           username: username,
                           password: password
                       }
                       this.preference.setPref(AuthenticationService.CurrentUser, curUser);
                       this.curUser = curUser;
                       //Call the subscriber
                       return sessionInfo;
                   }).catch(this.handleError);
    }

    authenticate(userName: string, password: string): Observable<AuthenticationResult> {
        let creds   = "email=" + userName + "&" + "password=" + password + "&username=" + userName;
        let headers = new Headers();
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        console.log("Authentication URL = " + globals.ServerUrls.authentication);
        return this.http.post(globals.ServerUrls.authentication, creds, {
            headers: headers
        })
                   .map((res: Response) => {
                       let data: AuthenticationResult = res.json();
                       return data;
                   });
    }

    public setCurrenUser(email: string) {
        this.signout();
        let curUser  = {
            username: email
        }
        this.curUser = curUser;
        this.preference.setPref(AuthenticationService.CurrentUser, curUser);
    }

    /**
     * Signout the session. This will clear session and clears the current user password
     */
    public signout() {
        // console.log("[Signout] Get pref 0 : ",this.preference.getUserPreference());
        // console.log("[Signout] Auth Current User 0 : ",AuthenticationService.CurrentUser)
        this.volatileStorage.remove("session");
        this.volatileStorage.remove("authenticated");
        // console.log("[Signout] Get pref 1: ",this.preference.getUserPreference());
        // console.log("[Signout] Auth Current User : ",AuthenticationService.CurrentUser)
        // this.preference.clearUserPreference("CompetitionFilter")
        this.preference.setPref("ScorecardSearchFilter");
        this.preference.setPref("ScorecardSearchScorecardType");

        this.preference.setPref("CompetitionFilter");
        // this.pref.setPref("ScorecardSearchFilter");
        // this.pref.setPref("ScorecardSearchScorecardType");

        this.preference.getPref(AuthenticationService.CurrentUser)
            .subscribe((curUser: any) => {
                curUser.password = null; 
                this.curUser     = curUser;
                this.preference.setPref(AuthenticationService.CurrentUser, curUser);
            });
        // console.log("[Pref] Get pref 2: ",this.preference.getUserPreference());
    }

    private handleError(error) {
        let result: any;
        if (error && error.json) {
            result = error.json();
        } else if (error) {
            result = error;
        } else {
            result = "Server error occured";
        }
        return Observable.throw(result);
    }
}
