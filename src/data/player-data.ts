import {PagedResult} from "./paged-result";
import {ServerResult} from "./server-result";
import {CompetitionInfo} from "./competition-data";
import {AddressInfo} from "./address-data";
import {ClubInfo} from "./club-course";
import { ClubHandicap } from "./handicap-history";
import { PlayerData } from "./mygolf.data";
/**
 * The interface which represents the Player info
 * Created by Ashok on 12-04-2016.
 */

export interface PlayerInfo
{
    playerId: number;
    /**
     * The user id. Corresponding Mobile Authentication Records
     */
    userId: number;

    firstName: string;

    lastName?: string;

    playerName?: string;

    nickName?: string;

    email: string;

    phone?: string;

    handicapIndex?: number;

    handicap?: number;

    handicapIn?: string;

    gender: string;


    photoUrl?: string;

    thumbnail?: string;

    dateJoined?: Date;

    status?: string;

    teeOffFrom?: string;

    errorMessage?: string;

    addressInfo?: AddressInfo;
    nhsNumber?: string;

    friendSince?: Date;

    birthdate?: Date;

    checked?: boolean;

    allowEdit?: boolean;
    countryId?: string;
    mygolfHandicapIndex?: number;
    countryName?: string;
    sportCode?: string;
    flagUrl?: string;
    membership?: any;
    nationalityId?: string;
    nationalityName?: string;
    nationalityFlag?: string;
    password?: string;
    defaultHandicapSystem?: string;
}

/**
 * Represents a friend request
 */
export interface FriendRequest
{
    /**
     * If signed in player is sending friend request then this will be true
     */
    requestByPlayer: boolean;
    /**
     * The information of the player to whom friend request is sent or the player who
     * is sending friend request to signed in player
     */
    player: PlayerInfo;
}
export function createPlayerInfo(): PlayerInfo {
    return {
        playerId : null,
        userId   : null,
        firstName: "",
        gender   : "",
        email    : null,
        lastName: "",
        playerName: "",
        nickName: "",
        phone: "",
        handicapIndex: null,
        handicap: null,
        handicapIn: null,
        photoUrl: "",
        thumbnail: "",
        dateJoined: null,
        status: "",
        teeOffFrom: "",
        errorMessage: "",
        addressInfo: null,
        nhsNumber: "",
        friendSince: null,
        birthdate: null,
        checked: null,
        allowEdit: null,
        countryId: "",
        mygolfHandicapIndex: null,
        countryName: "",
        sportCode: "",
        flagUrl: "",
        membership: null,
        nationalityId: "",
        nationalityName: "",
        nationalityFlag: "",
    };
}
/**
 * List of players returned from the server
 */
export interface PlayerList extends PagedResult
{

    players: Array<PlayerInfo>
}

export function createPlayerList(): PlayerList {
    return {
        totalPages: 0,

        currentPage: 0,

        totalItems: 0,

        totalInPage: 0,

        success: true,
        players: []
    };
}
/**
 * Paged result friend request for a given player
 */
export interface FriendRequestList extends PagedResult
{
    friendRequests: Array<FriendRequest>;
}
/**
 * The data to be displayed in the player home
 */
export interface PlayerHomeInfo
{
    playerId?: number;
    playerName?: string;
    totalScoreCards?: number;
    totalFriends?: number;
    activeCompetitions?: number;
    error?: boolean;
    errorMessage?: string;

    player?: PlayerInfo;
    needRefresh?: boolean,
    compsActiveToday?: Array<CompetitionInfo>;

    testUser?: boolean;
}

export interface PlayerGroup
{
    id?: number,
    groupName?: string;
    players: Array<PlayerInfo>;
}

export interface PlayerGroupList extends ServerResult
{
    playerGroups: Array<PlayerGroup>
}
/**
 * The function returns the new instance of player home info
 * @returns {{totalScoreCards: number, totalFriends: number, activeCompetitions: number, error: boolean}}
 */
export function createPlayerHomeInfo() {
    return {
        totalScoreCards   : 0,
        totalFriends      : 0,
        activeCompetitions: 0,
        error             : false,
        needRefresh       : true,
        player            : createPlayerInfo()
    }
}

export interface ClubMembership
{
    homeClub: boolean;
    membershipNumber?: string;
    status?: string;
    clubHandicap?: number;
    club?: ClubInfo;
    hcpDetail?: ClubHandicap;
    player?: PlayerData;
}
