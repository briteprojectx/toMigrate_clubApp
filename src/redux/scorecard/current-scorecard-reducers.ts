import {Action} from '@ngrx/store';
// import {PlainScorecard} from '../../data/scorecard';
import {PlainScoreCard} from '../../data/mygolf.data';
import {CurrentScorecard, CurrentScorecardActions, ScorecardType} from './';
/**
 * Created by ashok on 11/05/17.
 */

export function currentScorecardReducers(state: CurrentScorecard = {}, action: Action): CurrentScorecard {
    switch(action.type){
        case CurrentScorecardActions.SET_CURRENT_SCORECARD:
        case CurrentScorecardActions.FETCHED_CURRENT_SCORECARD:
            let scorecard: PlainScoreCard = action.payload;
            let newInfo: CurrentScorecard = {
                scorecard: scorecard,
                scorecardType: scorecard.competition?ScorecardType.Competition:ScorecardType.NormalGame
            }
            return Object.assign({}, state, newInfo);
        case CurrentScorecardActions.NO_CURRENT_SCORECARD:
        case CurrentScorecardActions.CLEAR_CURRENT_SCORECARD:
            return Object.assign({}, state, {
                scorecardType: ScorecardType.None,
                scoringPlayerId: null,
                scorecard: null
            });

        case CurrentScorecardActions.SCORECARD_RELOADED:
            return Object.assign({}, state, {
                reloaded: true,
                reloadReason: action.payload
            });
        case CurrentScorecardActions.CLEAR_RELOADED_FLAG:
            return Object.assign({}, state, {
                reloaded: false,
                reloadReason: ''
            });
        case CurrentScorecardActions.SET_SCORER_ID:
            return Object.assign({}, state, {
                scoringPlayer: action.payload
            });
        default:
            return state;

    }
}