/**
 * This exports some of the interfaces to be used for data exchange between
 * server and client
 * Created by Nik on 17-05-2016.
 */

/**
 * Player Performance interface. All the dates are represented as milli seconds
 */

/**
 * The filter option for searching competitions
 */
export interface testAnalysis
{
    needRefresh?: boolean;
}
export interface ScoreStatistic
{
    albatros?: number;
    eagle?: number;
    birdie?: number;
    par?: number;
    bogey?: number;
    bogey2?: number;
    bogey3?: number;
    worse?: number;

}
export interface PlayerPerformanceDetail
{
    gameRoundId?: number;
    playerRoundId?: number;
    gameType?: string;
    roundNo?: number;
    firstNineCourseName?: string;
    secondNineCourseName?: string;
    roundDate?: Date;
    inTotalGross?: number;
    outTotalGross?: number;
    totalGross?: number;
    inTotalNet?: number;
    outTotalNet?: number;
    totalNet?: number;

}
export interface PerformanceDetail
{
    success?: boolean;
    errorMessage?: string;
    scoreStatistic?: Array<ScoreStatistic>;
    playerPerformanceDetails?: Array<PlayerPerformanceDetail>;

}

export interface PerformanceChart
{
    success: boolean;
    errorMessage?: string;
    scoreStatistic?: Array<ScoreStatistic>;
    playerPerformanceDetails?: Array<PlayerPerformanceDetail>;
}
export interface PerformanceBaseScores
{
    score: number;
}
export function createPerformanceBase(): PerformanceBase {
    return {
        success           : false,
        errorMessage      : "",
        bestScore         : 0,
        totalGrossScore   : 0,
        totalScorecards   : 0,
        averageScore      : 0,
        playerPerformances: new Array<PerformanceBaseScores>()
    };
}

export function createPerformanceDetail(): PerformanceDetail {
    return {
        success                 : false,
        errorMessage            : "",
        scoreStatistic          : new Array<ScoreStatistic>(),
        playerPerformanceDetails: new Array<PlayerPerformanceDetail>(),

    };
}

export function createPerformanceChart(): PerformanceChart {
    return {
        success                 : false,
        errorMessage            : "",
        scoreStatistic          : new Array<ScoreStatistic>(),
        playerPerformanceDetails: new Array<PlayerPerformanceDetail>()
    };
}

export interface PerformanceBase
{
    success: boolean;
    errorMessage: string;
    bestScore: number;
    totalGrossScore: number;
    totalScorecards: number;
    averageScore: number;
    playerPerformances: Array<PerformanceBaseScores>;
}
