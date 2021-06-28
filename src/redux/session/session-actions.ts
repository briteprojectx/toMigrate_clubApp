import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Platform} from 'ionic-angular';
import {AuthenticationService} from '../../authentication-service';
import {AuthenticationResult, SessionInfo} from '../../data/authentication-info';
import {MessageDisplayUtil} from '../../message-display-utils';
import {ConnectionService} from '../../providers/connection-service/connection-service';
import {AppState} from '../appstate';
import {createAction} from '../create-action';
import {PushNotificationActions} from '../pushnotf/pushnotfication-actions';
import {SessionDataService} from './session-data-service';
/**
 * Created by ashok on 10/05/17.
 */

@Injectable()
export class SessionActions {
    public static SHOW_LOGIN = 'LOGIN_FORM_SHOW';
    public static LOGIN = "LOGIN";
    public static LOGIN_SUCCESS = 'LOGIN_SUCCESS';
    public static PLAYER_LOGGED_IN = 'PLAYER_LOGGED_IN';
    public static ORGANIZER_LOGGED_IN = 'ORGANIZER_LOGGED_IN';
    public static CLUB_LOGGED_IN = 'CLUB_LOGGED_IN';
    public static ADMIN_LOGGED_IN = 'ADMIN_LOGGED_IN';
    public static LOGIN_FAILED = 'LOGIN_FAILED';
    public static CLEAR_LOGIN_ERROR = 'CLEAR_LOGIN_ERROR';
    public static LOGOUT = 'LOGOUT';
    public static SET_PLAYER_ID = 'SET_SESSION_PLAYER_ID';
    public static UPDATE_PREFERENCE = 'UPDATE_PREFERENCE';
    constructor(private store: Store<AppState>,
        private pushActions: PushNotificationActions,
        private sessionService: SessionDataService,
        private platform: Platform,
        private connService: ConnectionService,
        private authService: AuthenticationService) {
    }

    public checkAndSignIn() {
        this.sessionService.getSession()
            .take(1)
            .subscribe((session: SessionInfo)=> {
                if(session.authToken) {
                    // this.store.dispatch(createAction(SessionActions.LOGIN, {
                    //     userName: session.userName, password: session.password
                    // }));
                    this.loginSuccess(session);

                }
                else if(session.userName && session.password){
                    this.login(session.userName, session.password);
                }
                else {
                    //You need to make sure that login form is shown
                    this.store.dispatch(createAction(SessionActions.SHOW_LOGIN));
                }

            });
    }
    /**
     * Initiatete the login
     * @param user
     * @param password
     */
    public login(user: string, password: string, appType?: string){
        let _password = password;
        if(!appType) appType = 'play';
        this.store.dispatch(createAction(SessionActions.LOGIN, {
            userName: user, password: password
        }));
        this.authService.authenticate(user, password)
            .subscribe((result: AuthenticationResult)=>{
                if(result.success){
                    console.log('authenticate ', result)
                    let newInfo: SessionInfo = {
                        authToken: result.authToken,
                        user: result.user,
                        userId: result.user.userId,
                        userName: result.user.userName,
                        password: result.user.password?result.user.password:_password,
                        playerId: result.user.playerId,
                        clubId: result.user.clubId,
                        organizerId: result.user.organizerId,
                        userType: result.user.userType,
                        name: result.name,
                        admin: result.user.admin,
                        roles: result.user.roles,
                        caddieId: result.user.caddieId,
                        appType: appType,

                    };
                    if(result && !result.user.password) result.user.password = _password;
                    if(result) result.appType = appType
                    let _rolesPlayer = result.user.roles.filter((role)=>{
                        if(role.toLowerCase() === 'role_player') return true
                    });
                    // let _rolesClub = result.user.roles.filter((role)=>
                    //     if(role.toLowerCase() === 'role_club') return true
                    // })
                    console.log("getting roles", result.user.roles)

                    let _noClub = true;
                    let _superAdmin = false;
                    if(appType === 'club' ) {
                        // && result.user.userType.toLowerCase() === 'Player'.toLowerCase()
                        // let _roles 
                        result.user.roles.filter((role)=>{
                            if(role.toLowerCase().includes('role_club')) _noClub = false
                            else if(role.toLowerCase().includes('role_super_admin')) {
                                _noClub = false;
                                _superAdmin = true;
                            }
                            // else _noClub = false;
                        })
                        console.log("login : ", appType);
                        console.log("login : ", result);
                        console.log("login : ", _noClub);
                        if(_noClub) {
                            this.loginFailed({
                                    success: false,
                                    exception: 'Could not sign-in with player id'
                                })
                            return false;
                        } else {
                            if(!_superAdmin && !result.user.clubId) {
                                this.loginFailed({
                                    success: false,
                                    exception: 'The Club has not been activated by myGolf2u Admin. Please contact myGolf2u Admin for activation'
                                })
                                return false
                            } 
                        }
                    } 
                    else if(appType === 'play' && (result.user.userType.toLowerCase() === 'Club'.toLowerCase() || result.user.userType.toLowerCase() === 'Organizer'.toLowerCase())) {
                        console.log("getting roles - play", _rolesPlayer)
                        if(_rolesPlayer && _rolesPlayer.length === 0 || !_rolesPlayer) {
                            this.loginFailed({
                                success: false,
                                exception: 'Could not sign-in with club id'
                            })
                            return false;
                        } else {
                            newInfo.userType = 'Player';
                            newInfo.user.userType = 'Player';
                            console.log("user type ---- ", newInfo, _rolesPlayer)
                            this.loginSuccess(newInfo, _rolesPlayer);
                            return false;
                        }
                    }
                    console.log('apptype', appType, result.user.userType)
                    let _clubUserTypes = (result.user.userType.toLowerCase() === 'club' 
                    || result.user.userType.toLowerCase() === 'caddy' 
                    || result.user.userType.toLowerCase() === 'cashier')
                    let _britesoft = result.user.userType.toLowerCase() === 'britesoft';
                    if(appType === 'play' && result.user.userType.toLowerCase() === 'player') this.loginSuccess(newInfo, result.user.roles, appType);
                    else if(appType === 'club' && (_clubUserTypes || !_noClub) && !_britesoft) this.loginSuccess(result, result.user.roles, appType);
                    else if(appType === 'club' && _britesoft) this.loginSuccess(result, result.user.roles, appType);
                    // this.loginSuccess(newInfo)
                    console.log("Login success :", result);
                    console.log("Login success - newInfo:", newInfo)
                }
                else this.loginFailed(result);
            },(error)=>{
                let msg = '';
                if(error.json) {
                    let result: AuthenticationResult = error.json();
                    msg = result.exception;
                }
                else {
                    msg = 'Could not sign in. ' +
                        MessageDisplayUtil.getError(error, this.platform, this.connService, 'Server may be down.');
                }
                let _error = error.json();
                if(!error.success) MessageDisplayUtil.getError(_error.exception, this.platform, this.connService, 'Server may be down.');
                
                this.loginFailed({
                    success: false,
                    exception: msg
                });
            });

        // this.store.dispatch(createAction(SessionActions.LOGIN, {
        //     userName: user, password: password
        // }));
    }

    public loginSuccess(session: SessionInfo, roles?: Array<string>, appType?: string) {
        console.log("login success 2 - ", session)
        let _rolePlayer;
        if(roles) _rolePlayer = roles.filter((role)=>{
            return role.toLowerCase() === 'role_player';
        });
        console.log("login success --- ", roles, _rolePlayer)
        
        console.log("login success 2 - app type", appType)
        this.store.dispatch(createAction(SessionActions.LOGIN_SUCCESS, session));
        switch(session.user.userType){
            case 'Player':
                if(appType === 'play') this.store.dispatch(createAction(SessionActions.PLAYER_LOGGED_IN, session));
                else if(appType === 'club') this.store.dispatch(createAction(SessionActions.CLUB_LOGGED_IN, session));
                break;
            case 'Club':
                this.store.dispatch(createAction(SessionActions.CLUB_LOGGED_IN, session));
                break;
            case 'Organizer':
                if(_rolePlayer && _rolePlayer.length > 0) this.store.dispatch(createAction(SessionActions.PLAYER_LOGGED_IN, session));
                else this.store.dispatch(createAction(SessionActions.ORGANIZER_LOGGED_IN, session));
                break;
            case 'Admin':
                this.store.dispatch(createAction(SessionActions.ADMIN_LOGGED_IN, session));
                break;
            case 'Caddy':
                this.store.dispatch(createAction(SessionActions.CLUB_LOGGED_IN, session));
                break;
            case 'Britesoft':
                this.store.dispatch(createAction(SessionActions.ADMIN_LOGGED_IN, session));
                break;
        }


    }
    public loginFailed(authResult: AuthenticationResult) {
        this.store.dispatch(createAction(SessionActions.LOGIN_FAILED, authResult));
    }
    public clearLoginError() {
        this.store.dispatch(createAction(SessionActions.CLEAR_LOGIN_ERROR));
    }
    public logout() {
        this.authService.signout();
        this.store.dispatch(createAction(SessionActions.LOGOUT));
    }

    public updatePreference(session: SessionInfo) {
        this.store.dispatch(createAction(SessionActions.UPDATE_PREFERENCE, session))
    }
}