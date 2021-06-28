import {ServerResult} from "./server-result";
// import {CourseInfo} from "./club-course";
// import {PagedResult} from "./paged-result";
import {TeeBox} from "./tee-box";
import * as global from "../globals";
import {PlainScoreCard, PlayerRoundScores, CourseInfo, PagedResult} from './mygolf.data';
/**
 * This contains the classes related to scorecard for a game round
 * Created by Ashok on 03-05-2016.
 */

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
// export interface PlayerRoundScores
// {
//     playerRoundId?: number;

//     playerId: number;
//     scoringPlayerId?: number;
//     scorerName?: string,
//     playerName: string;
//     nickName: string;
//     teamName?: string;
//     gender: string;
//     playerHandicap: number;
//     photoUrl: string;
//     thumbnail?: string;
//     startTime?: string;
//     actualStartTime?: Date;
//     frontNineTotal: number;
//     backNineTotal: number;
//     totalScore: number;
//     diffGrossToPar?: number;
//     frontNineNetTotal: number;
//     backNineNetTotal: number;
//     totalNetScore: number;
//     diffNetToPar?: number;
//     status?: string; //Status values P-Pending I- In Progress C - Completed W - Withdrawn
//     scores: Array<PlayerScore>;
//     totals: Array<NineToatls>;
//     teeOffFrom?: string;
//     teeBox?: TeeBox;
// }

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
    scorecards: Array<PlainScoreCard>;
}
