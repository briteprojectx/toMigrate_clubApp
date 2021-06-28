import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {SessionInfo} from '../../data/authentication-info';
import {createAction} from '../create-action';
import {CurrentScorecardActions} from '../scorecard/current-scorecard-actions';
import {ServerInfoActions} from '../server/serverinfo-actions';
import {SessionActions} from '../session/session-actions';
import {ScorerStateActions} from './scorer-state-actions';
import {NavController} from 'ionic-angular';
/**
 * Created by ashok on 15/05/17.
 */
@Injectable()
export class ScorerStateEffects {
    constructor(private actions$: Actions,
        private sessionActions: SessionActions,
        private scorerStateActions: ScorerStateActions) {
    }
    @Effect()
    onLoginFailed$ = this.actions$.ofType(SessionActions.LOGIN_FAILED)
                         .map(action=>action.payload)
                         .pluck('exception')
                         .map(error=>{
                             return createAction(ScorerStateActions.SET_ERROR, error);
                         });
    @Effect()
    onServerClientMismatch$    =
        this.actions$.ofType(ServerInfoActions.SERVER_INFO_MISMATCH_CLIENT)
            .map(action => action.payload)
            .map((missmatch: string) => {
                return createAction(ScorerStateActions.SET_ERROR, missmatch);
            });
    @Effect({dispatch: false})
    onClubOrOrganizerLoggedIn$ =
        this.actions$
            .ofType(SessionActions.ORGANIZER_LOGGED_IN, SessionActions.CLUB_LOGGED_IN)
            .map(action => action.payload)
            .do((session: SessionInfo) => {
                if (session.user.userType.toLowerCase() === 'club' || session.user.userType.toLowerCase() === 'caddy') {
                    this.scorerStateActions.clubLoggedIn(session);
                } else if (session.user.userType.toLowerCase() === 'organizer') {
                    this.scorerStateActions.organizerLoggedIn(session);
                }
            });
    @Effect()
    onLogout$ =
              this.actions$.ofType(SessionActions.LOGOUT)
                  .map(action=>{
                     return createAction(ScorerStateActions.RESET);
                  });
    @Effect()
    onOtherUsersLoggedIn$      =
        this.actions$
            .ofType(SessionActions.PLAYER_LOGGED_IN, SessionActions.ADMIN_LOGGED_IN)
            .map(action => action.payload)
            .map((session: SessionInfo) => {
                if(session.user.userType.toLowerCase() === 'player' && session.organizerId){
                    //This is organizer too.
                    session.user.userType = 'Organizer';
                    return createAction(SessionActions.ORGANIZER_LOGGED_IN, session);
                }
                else {
                    return createAction(ScorerStateActions.SET_USER_TYPE, session.user.userType);
                }
            });
    @Effect({dispatch: false})
    onCurrentScorecard$ =
        this.actions$
            .ofType(CurrentScorecardActions.FETCHED_CURRENT_SCORECARD,
                CurrentScorecardActions.NO_CURRENT_SCORECARD)
            .do(action => {
                this.scorerStateActions.checkCompetitionScorecard(action.payload);
            })

    // @Effect({dispatch: false})
    // onGameCancel$ = this.actions$.ofType(CurrentScorecardActions.CLEAR_CURRENT_SCORECARD)
    //     .do(action=> {
    //         this.sessionActions.logout();
    //     })
}