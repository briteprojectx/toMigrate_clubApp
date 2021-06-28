/**
 * Created by Syfull on 24-05-2016.
 */

/**
 * Information about a friends.
 * This should be part of information which already has
 * friends information
 */

export interface PendingFriendList
{
    totalPages: number;
    currentPage: number;
    totalItems: number;
    totalInPage: number;
    success: boolean;
    errorMessage?: string;
    friendRequests: Array<PendingFriendInfo>;
}

export interface PendingFriendInfo
{
    requestByPlayer: boolean,
    player: Array<FriendInfo>;
}
export function AllPendingFriendList(): PendingFriendList {
    return {
        totalPages: 0,

        currentPage: 0,

        totalItems: 0,

        totalInPage: 0,

        success: false,

        friendRequests: new Array<PendingFriendInfo>()
    };
}

export interface FriendInfo
{
    userId: string;
    playerId: number;
    playerName: string;
    firstName: string;
    lastName: string;
    nickName: string;
    email: string;
    phone: string;
    handicap: number;
    gender: string;
    countryId: number;
    photoUrl: string;
    dateJoined: string;
    teeOffFrom: string;
    errorMessage: string;
}
