/**
 * Created by Ashok on 04-05-2016.
 */
import {PlayerInfo} from "./player-data";

export interface SearchCriteria
{
    searchType: string;
    /**
     * Specifies whether to list only consider only
     * where player is participating
     */
    onlyParticipating?: boolean;
    /**
     * Find competitions held in clubs nearby
     */
    searchWithinDistance?: boolean;

    onlyFavorites?: boolean;

    maxDistance?: number;
    /**
     * FInd only those competitions which are held
     * in clubs where the player is member
     */
    clubsWithMembership?: boolean;
    /**
     * Search the competitions held within last period of time.
     * The period type can be
     * D - Days
     * W - Weeks
     * M - Months
     * Y - Years
     */
    periodLength?: number;
    periodType?: string;

    type?: string; // ALL; COMPETITION; NORMAL;
    competitionLeaderboardGroupBy?: string;
    competitionLeaderboardSortBy?: number;
    lastNGames?: number;
    playerIds?: string;
    performanceSelectedPlayers?: Array<PlayerInfo>;
    performanceHolesPlayed?: number;
    useNGames?: boolean;

    searchDateTo?: Date;
    searchDateFrom?: Date;
    countryId?: string;
}
