/**
 * Leaner version of scorecard. This version is used for syncing
 * scorecards between APP and server thus reducing the data used
 * Created by ashok on 08/05/17.
 */
import {TeeBox} from "./tee-box";

export interface PlayerHoleScore {
    scorecardId: number;
    holeNumber: number;
    actualScore: number;
    netScore?: number;
    teeBox?: TeeBox;
}

export interface ScorecardMember {
    playerRoundId: number;
    playerId: number;
    scorerId: number;
    teeBox?: TeeBox;
    scores: PlayerHoleScore[];
}

export interface LeanScorecard {
    competitionId: number;
    roundId: number;
    roundNumber: number;
    flightNumber: string;
    scorerId?: number;
    flightMembers: ScorecardMember [];
}

export interface CompressedScorecard {
    cid?: number;
    rid?: number;
    rno?: number;
    sms?: any[];
}