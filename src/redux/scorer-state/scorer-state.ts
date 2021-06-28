import {CompetitionInfo} from '../../data/competition-data';
import {PlayerInfo} from '../../data/player-data';
/**
 * Created by ashok on 15/05/17.
 */


export interface ScorerState {
    refreshTried?: boolean;
    competitions?: CompetitionInfo[];
    userType?: string;
    selectedScorer?: SelectedScorer;
    scoringPlayer?: PlayerInfo;
    scoringCompetition?: CompetitionInfo;
    scoringStage?: ScoringStage;
    busyOrFree?: BusyOrFree;
    error?: boolean;
    exception?: string;
    teeBooking?: TeetimeBooking;
}
export interface SelectedScorer {
    competitionId?: number;
    roundNumber?: number;
    scorerId?: number;

};
export enum ScoringStage {
    Preparing,
    CompetitionSelected,
    Ready,
    Scoring
}
export enum BusyOrFree {
    Busy,
    Free
}

export const TOPIC_SCORER_SELECT = {
    destination: '/topic/device/selectscorer',
    id: 'ScorerSelect',
    persistent: true,
    ack: 'auto'
};
export const TOPIC_DEVICE_MANAGE = {
    destination: '/topic/device/manage',
    id: 'ManageDevice',
    persistent: true,
    ack: 'auto'
};

export interface TeetimeBooking {
    clubId?: number;
    clubName?: string;
    bookingReference?: string;
    totalPlayers?: number;
    teeOffDate?: string;
    teeOffTime?: string;
    courseName?: string;
    action?: string;
    amount?: number;
}

export const SUBSCRIBE_TEETIME_BOOKING = {
    destination: `/topic/tee-time/booking`,
    id: 'TeeTimeBooking',
    persistent: true,
    ack: 'auto'
}