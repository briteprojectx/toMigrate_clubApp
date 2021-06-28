import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {SessionActions} from '../session/session-actions';
import {createAction} from '../create-action';
import {CurrentScorecardActions} from './current-scorecard-actions';
/**
 * Created by ashok on 11/05/17.
 */

@Injectable()
export class CurrentScorecardEffects {
    constructor(private actions$: Actions) {
    }
    //On logout clear the current scorecard
    @Effect()
    logout$ = this.actions$.ofType(SessionActions.LOGOUT)
        .map(()=>{
            return createAction(CurrentScorecardActions.CLEAR_CURRENT_SCORECARD);
        });
}