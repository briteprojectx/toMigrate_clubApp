import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {SessionActions} from '../session/session-actions';
import {Action} from '@ngrx/store';
import {PushNotificationActions} from './pushnotfication-actions';
import {SessionInfo} from '../../data/authentication-info';
/**
 * Created by ashok on 14/05/17.
 */

@Injectable()
export class PushNotificationEffects {

    constructor(private actions$: Actions, private pushActions: PushNotificationActions ){}

    @Effect({dispatch: false})
    onPlayerLogin$ = this.actions$.ofType(SessionActions.PLAYER_LOGGED_IN)
        .map((action: Action)=>action.payload)
        .do((session: SessionInfo)=>{
            this.pushActions.registerPlayer(session.playerId);
        });
}