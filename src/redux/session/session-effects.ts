import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {SessionActions} from './session-actions';
import {DeviceActions} from '../device/device-actions';
import {Action} from '@ngrx/store';
/**
 * Created by ashok on 10/05/17.
 */

@Injectable()
export class SessionEffects {

    constructor(private actions$: Actions, private sessionActions: SessionActions){}
    @Effect({dispatch: false})
    deviceRegistered$ = this.actions$
                            .ofType(DeviceActions.DEVICE_REGISTERED)
        .do((action: Action)=>{
            this.sessionActions.checkAndSignIn();
        })
}