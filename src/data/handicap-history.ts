import {ServerResult} from "./server-result";
import {CourseInfo, ClubInfo} from "./club-course";
import {PagedResult} from "./paged-result";
import * as global from "../globals";
import { PlayerInfo } from "./player-data";
/**
 * This contains the classes related to scorecard for a game round
 * Created by Ashok on 03-05-2016.
 */

export class HandicapCalculation {
    id: number;
    calculatedOn: Date;
    player: PlayerInfo;
    totalRoundsRead: number;
    totalAverageDifferentialsUsed: number;
    averageValue: number;
    handicapFactor: number;
    handicapIndex: number;
    nineHoleHandicap: boolean;
    gameRounds: Array<HandicapRound>
    handicapSystem: string;
}

export interface HandicapRound {
    playerRoundId: number;
    clubName: string;
    roundDate: Date;
    startTime: string;
    totalHolesPlayed: number;
    rating: {
        courseRating: number;
        slopeRating: number;
    };
    courseHandicap: number;
    competitionRound: boolean;
    competitionName?: string;
    courseNames: Array<string>;
    scores: Array<HandicapScore>;
    totalGrossScore: number;
    totalAdjustedScore: number;
    averageDifferential: number;
    used: boolean;
    teeBoxName?: boolean;
}

export class HandicapScore {
    holeNo: number;
    holePar: number;
    holeIndex: number;
    grossScore: number;
    adjustedScore: number;
    holePlayed: boolean;
}

export class ClubHandicap {
    clubInfo: ClubInfo;
    course1: string;
    course2: string;
    rating: {
        courseRating: number;
        slopeRating: number;
    };
    handicap: number;
    homeClub: boolean;
}

export interface PlayerScore
{
    whichNine: number;
    holeNumber: number;

    //Database IDs
    scorecardId?: number; //The ID of the gs_scorecard
    gameCourseId?: number; //fk_game_course
    courseHoleId?: number; //fk_course_hole
    courseId?: number;

    holeIndex?: number;
    courseName: string;
    parScore: number;
    actualScore?: number;
    netScore?: number;
    adjustedScore?: number;

}
export interface NineToatls
{
    whichNine: number;
    grossTotal: number;
    netTotal: number;
}
export interface PlayerRoundScores
{
    playerRoundId?: number;

    playerId: number;
    scoringPlayerId?: number;
    scorerName?: string,
    playerName: string;
    nickName: string;
    teamName?: string;
    gender: string;
    playerHandicap: number;
    photoUrl: string;
    thumbnail?: string;
    startTime?: string;
    actualStartTime?: string;
    frontNineTotal: number;
    backNineTotal: number;
    totalScore: number;
    diffGrossToPar?: number;
    frontNineNetTotal: number;
    backNineNetTotal: number;
    totalNetScore: number;
    diffNetToPar?: number;
    status?: string; //Status values P-Pending I- In Progress C - Completed W - Withdrawn
    scores: Array<PlayerScore>;
    totals: Array<NineToatls>;
}

export interface PlainScorecard extends ServerResult
{
    clientId?: string;
    competition: boolean;
    competitionId?: number;
    competitionName?: string;
    competitionRound?: string;
    scoringFormat?: string;
    gameRoundId?: number;
    roundNumber?: number;

    startTime?: string;

    finished: boolean;
    scoringFinished?: boolean;
    fullInfo?: boolean;
    clubId?: number;
    clubName?: string;
    playedOn?: string;
    // finishTime?: Date;
    flightNumber?: string;
    participants?: string;
    courseNames?: string;
    frontNineTotal?: number;
    backNineTotal?: number;
    totalScore?: number;
    playerTotals?: string;
    courses: Array<CourseInfo>;

    currentHole?: number;
    startingHole?: number;
    dirty?: boolean;
    playerRoundScores: Array<PlayerRoundScores>;
    allScores?: boolean;
    flightChanged?: boolean;
    lockedBy?: string;
    editable?: boolean;
}
/**
 * Creates an instance of PlainScorecard
 * @param competition
 * @returns {{success: boolean, clientId: any, competition: boolean, playerRoundScores: any[]<PlayerRoundScores>, courses: any[]<CourseInfo>, finished: boolean}}
 */
export function createScorecard(competition: boolean) {
    return {
        success          : true,
        clientId         : global.generateUUID(),
        competition      : competition,
        playerRoundScores: new Array<PlayerRoundScores>(),
        courses          : new Array<CourseInfo>(),
        finished         : false
    };

}
/**
 * List of scorecards returned from the server.
 * Extends PagedResult for reading scorecards in paged manner
 */
export interface ScorecardList extends PagedResult
{
    scorecards: Array<PlainScorecard>;
}
