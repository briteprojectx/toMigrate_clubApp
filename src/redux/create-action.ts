import {Action} from '@ngrx/store'
/**
 * Created by ashok on 10/05/17.
 */

export function createAction (type: string, payload?: any): Action{
    return {
        type: type, payload: payload
    };
};
