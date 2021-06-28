import {BusyOrFree, ScorerState, ScoringStage} from './scorer-state';
import {Action} from '@ngrx/store';
import {ScorerStateActions} from './scorer-state-actions';
/**
 * Created by ashok on 15/05/17.
 */

export function scorerStateReducers(state: ScorerState = {
    scoringStage: ScoringStage.Preparing,
    busyOrFree: BusyOrFree.Free
}, action: Action): ScorerState {

    console.log("scorer state reducers - state", state);
    console.log("scorer state reducers - action", action);
    switch(action.type){
        case ScorerStateActions.REFRESH_TRIED:
            return Object.assign({}, state, {
                refreshTried: true
            });
        case ScorerStateActions.SET_COMPETITIONS:
            return Object.assign({}, state, {
                refreshTried: true,
                competitions: action.payload
            });
        case ScorerStateActions.SET_SCORING_DETAILS:
            //Merge the
            return Object.assign({}, state, action.payload);
        case ScorerStateActions.SET_USER_TYPE:
            let userType = action.payload;
            if(userType && 
                (userType.toLowerCase() === 'organizer' 
                || userType.toLowerCase() === 'club' 
                || userType.toLowerCase() === 'caddy'
                || userType.toLowerCase() === 'britesoft')){
                return Object.assign({}, state, {
                    userType: userType
                });
            }
            else {
                return Object.assign({}, state, {
                    userType: userType,
                    error: true,
                    exception: 'Only club or organizer can login'
                });
            }
        case ScorerStateActions.SET_SCORING_STAGE:
            return Object.assign({}, state, {
                scoringStage: action.payload
            });
        case ScorerStateActions.SET_BUSY_OR_FREE:
            return Object.assign({}, state, {
                busyOrFree: action.payload
            });
        case ScorerStateActions.SET_ERROR:
            return Object.assign({}, state, {
                error: true,
                exception: action.payload
            });
        case ScorerStateActions.CLEAR_ERROR:
            return Object.assign({}, state, {
                error: false,
                exception: action.payload
            });
        case ScorerStateActions.SELECT_SCORER:
            return Object.assign({}, state, {
                selectedScorer: action.payload
            });
        case ScorerStateActions.CLEAR_SCORER:
            return Object.assign({}, state, {
                selectedScorer: null,
                scoringPlayer: null,
                scoringCompetition: null,
                scoringStage: ScoringStage.Preparing
            });

            
        case ScorerStateActions.SET_TEE_BOOKING:
            return Object.assign({}, state, {
                teeBooking: action.payload
            });
        case ScorerStateActions.CLEAR_TEETIME_BOOKING:
            return Object.assign({}, state, {
                teeBooking: null
            });
        case ScorerStateActions.RESET:
            // return Object.assign({}, state, {
            //     error: false,
            //     exception: null,
            //     userType: null,
            //     competitions: null,
            //     refreshTried: false,
            //     selectedScorer: null,
            //     scoringPlayer: null,
            //     scoringCompetition: null,
            //     scoringStage: ScoringStage.Preparing
            // });
            return {
                scoringStage: ScoringStage.Preparing,
                busyOrFree: BusyOrFree.Free
            };
        default:
            return state;
    }
}