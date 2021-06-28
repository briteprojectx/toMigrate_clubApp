/**
 * This exports some of the interfaces to be used for data exchange between
 * server and client
 * Created by Nik on 17-05-2016.
 */
import {CourseInfo, CourseHoleInfo, ClubInfo} from "./club-course";

/**
 * Player Performance interface. All the dates are represented as milli seconds
 */

/**
 * The filter option for searching competitions
 */
export interface analysisClubInfo extends ClubInfo
{
    courseAnalysisInfo?: Array<CourseInfo>;
    errorMessage?: string;
    success: boolean;
}

export function createAnalysisClubInfo(): analysisClubInfo {
    return {
        clubId     : 0,
        clubName   : '',
        clubImage  : '',
        clubTag    : '',
        latitude   : 0,
        longitude  : 0,
        address    : '',
        description: '',
        success    : false,
        virtualClub: false
    }
}

export interface courseAnalysisInfo extends CourseInfo
{
    courseHoleAnalysisInfo?: Array<CourseHoleInfo>;
}

export interface courseAnalysisHoleInfo extends CourseHoleInfo
{
    average?: number;
    scoreStatistic: Array<ScoreStatistic>;
}

export interface ScoreStatistic
{
    eagle?: number;
    birdie?: number;
    par?: number;
    bogey?: number;
    bogey2?: number;
    bogey3?: number;
    albatros?: number;
    worse?: number;
    totalRound?: number;
    totalScore?: number;

}
export function createAnalysisHole(): AnalysisHole {
    return {
        success        : true,
        errorMessage   : "",
        scoreStatistic1: new Array<ScoreStatistic>(),
        scoreStatistic2: new Array<ScoreStatistic>(),
        scoreStatistic3: new Array<ScoreStatistic>(),
        scoreStatistic4: new Array<ScoreStatistic>(),
        scoreStatistic5: new Array<ScoreStatistic>(),
        scoreStatistic6: new Array<ScoreStatistic>(),
        scoreStatistic7: new Array<ScoreStatistic>(),
        scoreStatistic8: new Array<ScoreStatistic>(),
        scoreStatistic9: new Array<ScoreStatistic>()
    };
}

export interface AnalysisHole
{
    success: boolean;
    errorMessage: string;
    scoreStatistic1: Array<ScoreStatistic>;
    scoreStatistic2: Array<ScoreStatistic>;
    scoreStatistic3: Array<ScoreStatistic>;
    scoreStatistic4: Array<ScoreStatistic>;
    scoreStatistic5: Array<ScoreStatistic>;
    scoreStatistic6: Array<ScoreStatistic>;
    scoreStatistic7: Array<ScoreStatistic>;
    scoreStatistic8: Array<ScoreStatistic>;
    scoreStatistic9: Array<ScoreStatistic>;

}
