/**
 * Created by ashok on 11/05/17.
 */

// import {PlainScorecard} from '../../data/scorecard';
import {PlainScoreCard} from '../../data/mygolf.data';
export enum ScorecardType {
    None,
    Competition,
    NormalGame
}

export interface CurrentScorecard {
    readonly scorecardType?: ScorecardType;
    readonly scorecard?: PlainScoreCard;
    readonly scoringPlayer?: number;
    readonly reloaded?: boolean;
    readonly reloadReason?: string;
}