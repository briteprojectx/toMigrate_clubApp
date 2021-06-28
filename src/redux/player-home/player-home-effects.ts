import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {CurrentScorecardActions} from '../scorecard/current-scorecard-actions';
import {Action, Store} from '@ngrx/store';
// import {PlainScorecard} from '../../data/scorecard';
import {PlayerHomeActions} from './player-home-actions';
import {createAction} from '../create-action';
import {AppState} from '../appstate';
import {SessionActions} from '../session/session-actions';

import {PlainScoreCard} from '../../data/mygolf.data';
/**
 * Created by ashok on 11/05/17.
 */

@Injectable()
export class PlayerHomeEffects {

    constructor(private actions$: Actions,
        private store: Store<AppState>,
        private playerHomeActions: PlayerHomeActions){}

    @Effect({dispatch: false})
    currentScorecard$ = this.actions$.ofType(CurrentScorecardActions.NORMAL_GAME_SCORECARD)
        .map((action: Action)=>action.payload)
        .do((scorecard: PlainScoreCard)=>{
            this.playerHomeActions.checkScorecard(scorecard);
        });
    @Effect({dispatch: false})
    onClearCurrentScorecard$ = this.actions$.ofType(CurrentScorecardActions.CLEAR_CURRENT_SCORECARD)
                                   .do(()=>{
                                        this.playerHomeActions.refreshForcefully();
                                   });
    @Effect({dispatch: false})
    noCurrentScorecard$ = this.actions$.ofType(CurrentScorecardActions.NO_CURRENT_SCORECARD,
        CurrentScorecardActions.CLEAR_CURRENT_SCORECARD, CurrentScorecardActions.FETCHED_CURRENT_SCORECARD)
        .do(()=>{
            this.store.dispatch(createAction(PlayerHomeActions.SET_SELECTED_COMPETITION));
            this.store.dispatch(createAction(PlayerHomeActions.SELECT_COMPETITION_FOR_SCORING));
            this.store.dispatch(createAction(PlayerHomeActions.RESET_STATE));
        });

    // @Effect()
    // loginFormShow$ = this.actions$.ofType(SessionActions.SHOW_LOGIN)
    //     .map(()=>{
    //         return createAction(PlayerHomeActions.RESET_STATE);
    //     })
}