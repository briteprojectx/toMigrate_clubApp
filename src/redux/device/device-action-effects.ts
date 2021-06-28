import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Action} from '@ngrx/store';
import {ServerInfoActions} from '../server/serverinfo-actions';
import {DeviceActions} from './device-actions';
/**
 * Created by ashok on 10/05/17.
 */

@Injectable()
export class DeviceActionEffects {

    constructor(private actions$: Actions, private deviceActions: DeviceActions){}

    @Effect({dispatch: false})
    versionMatched$ = this.actions$
                          .ofType(ServerInfoActions.SERVER_INFO_MATCHES_CLIENT)
        .do((action: Action)=>{
            console.log("Server info matched the client. Proceed with detecting device");
            this.deviceActions.detectDevice();
        });


}