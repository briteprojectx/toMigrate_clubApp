import {PlayerHomeData} from './player-home-data';
import {Action} from '@ngrx/store';
import {PlayerHomeActions} from './player-home-actions';
import {fromJS} from 'immutable';
import {PlayerInfo} from '../../data/player-data';
/**
 * Created by ashok on 11/05/17.
 */

export function playerHomeReducers(state: PlayerHomeData={
    needToRefresh: true
}, action: Action) : PlayerHomeData {
    switch(action.type) {
        case PlayerHomeActions.RESET_STATE:
            return Object.assign({}, state, {state: ''});
        case PlayerHomeActions.SET_HOME_STATE:
            return Object.assign({}, state, {state: action.payload});
        case PlayerHomeActions.SET_NEED_REFRSH:
            return Object.assign({}, state, {needToRefresh: action.payload});
        case PlayerHomeActions.SELECT_COMPETITION_FOR_SCORING:
            return Object.assign({}, state, {competitionSelectedForScoring: action.payload});
        case PlayerHomeActions.SET_SELECTED_COMPETITION:
            return Object.assign({}, state, {
                selectedCompetition: action.payload
            });
        case PlayerHomeActions.REFRESH_HOME:
            return Object.assign({}, state, {
                state: 'Refreshing...',
                exception: ''
            });
        case PlayerHomeActions.REFRESH_HOME_SUCCESS:
            return Object.assign({}, state, {
                playerHome: action.payload,
                needToRefresh: false,
                exception: ''
            });
        case PlayerHomeActions.REFRESH_HOME_FAILED:
            return Object.assign({}, state, {
                state: '',
                exception: action.payload
            });
        case PlayerHomeActions.UPDATE_PLAYER_PROFILE:
            let player: PlayerInfo = action.payload;
            return fromJS(state).setIn(['playerHome', 'player'], player).toJS();
        case PlayerHomeActions.SET_PLAYER_INFO:
            let keys = ['playerHome', 'player', action.payload.field];
            let newState = fromJS(state).setIn(keys, action.payload.value).toJS();
            return newState;

        default:
            return state;

    }
}