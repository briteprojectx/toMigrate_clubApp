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

export interface CompetitionTeams
{
    teamId: number;
    teamName: string;
    active: boolean;
    description: string;
    teamLogo: string;
    playerTeam?: boolean;
    teamPlayers: Array<PlayerDetails>;
    captainName?: string;
    teamSessionTime?: Date; //from gs_round_session and gs_session_team
}

export interface PlayerDetails
{
    teamPlayerId: number,
    teamPlayerName: string;
    handicap: number;
    gender?: string;
    status?: string; //from gs_competition_player e.g. withdraw/no-show
    imageURL?: string;
    thumbnailURL?: string; //from gs_player.profile
}

export function createCompetitionTeamDetails(): CompetitionTeams {
    return {
        teamId     : 0,
        teamName   : '',
        active     : false,
        description: '',
        teamLogo   : '/img/default-user.jpg',
        teamPlayers: new Array<PlayerDetails>()
    };
}
