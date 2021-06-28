// import {PlayerScore, PlayerRoundScores} from "../../data/scorecard";
import {PlayerScore, PlayerRoundScores} from "../../data/mygolf.data";
import {CourseHoleInfo} from "../../data/club-course";
/**
 * Created by ashok on 19/12/16.
 */
export class PlayerDisplay
{
    playerName: string;
    nineTotal: number;
    nineNetTotal: number;
    scores: Array<PlayerScore>;
    totalScore: number;
    playerId: number;
    handicap: number;
    whichNine: number;
    playerRound: PlayerRoundScores;
}
export class PlayerTotals
{
    playerName: string;
    handicap: number;
    firstNineGross: number;
    secondNineGross: number;
    firstNineNet: number;
    secondNineNet: number;
    totalGross: number;
    totalNet: number;
    playerRound: PlayerRoundScores;
}
export class CourseDisplay{
    courseName: string;
    whichNine: number;
    holes: Array<CourseHoleInfo>;
    players: Array<PlayerDisplay>;
    coursePar: number;
    indexToUse?: number;
}
