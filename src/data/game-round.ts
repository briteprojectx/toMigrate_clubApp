import {ClubInfo, CourseInfo} from "./club-course";
import {PlayerInfo} from "./player-data";
/**
 * Created by Ashok on 16-04-2016.
 */

export interface GameRoundInfo
{

    id?: number;
    roundNo?: number;
    roundDate?: Date;
    status?: GameRoundStatus;
    inProgress?: boolean;
    nextRound?: boolean;
    courseNames?: string[];
    netTotal?: number;
    grossTotal?: number;
    netPosition?: number;
    grossPosition?: number;
    publishFlights?: boolean;
    
}
export type GameRoundStatus = "Pending" | "InProgress" | "Completed";

export interface NewGameInfo
{
    club?: ClubInfo;
    courses: Array<CourseInfo>;
    players: Array<PlayerInfo>;
    groupSelected?: boolean;
    availablePlayers?: Array<PlayerInfo>;
}
export function createGameRoundInfo(): GameRoundInfo {
    return {
        id           : 0,
        roundNo      : 1,
        status       : "Pending",
        inProgress   : false,
        nextRound    : false,
        grossTotal   : 0,
        netPosition  : 0,
        grossPosition: 0,
        publishFlights: false,
    };
}
