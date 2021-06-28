import {PlayerHomeInfo} from '../../data/player-data';
/**
 * Created by ashok on 11/05/17.
 */

export interface PlayerHomeData {
    readonly state?: string;
    readonly exception?: string;
    readonly needToRefresh?: boolean;
    readonly playerHome?: PlayerHomeInfo;
    readonly competitionSelectedForScoring?: number;
    readonly selectedCompetition?: SelectedCompetition;
}

export interface SelectedCompetition {
    competitionName?: string;
    startTime?: string;
    startingHole?: string;
}