/**
 * This exports some of the interfaces to be used for data exchange between
 * server and client
 * Created by Ashok on 12-04-2016.
 */
import {SponsorInfo} from "./SponsorInfo";
import {GameRoundInfo} from "./game-round";
import {PagedResult} from "./paged-result";
import {PlainScorecard} from "./scorecard";
import {TeeBox} from "./tee-box";
/**
 * Competition Info interface. All the dates are represented as milli seconds
 */
export interface CompetitionInfo
{
    competitionId: number;
    competitionName?: string;
    clubTag?: string;
    scoringFormat?: string;
    fee?: number;
    totalPrize?: number;
    totalHoles?: number;
    description?: string;
    rules?: string;
    allowGps?: boolean;
    showLeaderBoard?: boolean;
    allowChangeScorer?: boolean;
    startDate?: Date;
    endDate?: Date;
    publishDate?: Date;
    openDate?: Date;
    closeDate?: Date;
    closedForRegistration?: boolean;
    status?: string;
    totalRounds?: number;
    imageUrl?: string;
    thumbnail?: string,
    type?: string;
    registered?: boolean;
    maxPlayers?: number;
    totalRegistered?: number;
    clubName?: string;
    clubId?: number;
    organizerName?: string;
    teamEvent?: boolean;
    private?: boolean;
}
/**
 * The list of competitions returned by the server.
 */
export interface CompetitionList extends PagedResult
{

    competitions: Array<CompetitionInfo>;
}

export function emptyCompetitionList(): CompetitionList {
    return {
        totalPages: 0,

        currentPage: 0,

        totalItems: 0,

        totalInPage: 0,

        success: false,

        competitions: new Array<CompetitionInfo>()
    };
}
/**
 * The information of the payment made by the player for a competition
 */
export interface PaymentInfo
{
    paid: boolean;
    amount?: number;
    paymentDate?: Date;
    reference?: string;
}
/**
 * The player registered for a competition
 */
export interface CompetitionPlayerInfo
{
    playerId: number;
    playerName: string;
    registeredOn?: Date;
    handicap?: number;
    playerStatus?: string;
    memberAccount?: string;
    photoUrl?: string;
    category?: string;
    paymentInfo?: PaymentInfo;
    scorecard?: PlainScorecard;

    countryId?: string;
    countryName?: string;
    sportCode?: string;
    flagUrl?: string;
    teeBox?: TeeBox;
    nationalityId?: string;
    nationalityName?: string;
    nationalFlag?: string;
    nationalSportCode?: string;
}
/**
 * The information about competition sponsors'
 */
export interface CompetitionSponsorInfo
{
    sponsor: SponsorInfo;
    imageUrl?: string;
    sponsorDate: Date;
    sponsorship: string;
    status: string;
}
/**
 * The information about the competition prize
 */
export interface CompetitionPrizeInfo
{
    categoryName?: string;
    categoryDisplaySequence?: number;
    title: string;
    prizeName: string;
    scoreType?: string;
    teamPrize?: boolean;
    order?: number;
    prizePosition?: number;
    roundNumber?: number;
    prizeMoney?: number;
    playerMon?: string;
    playerPos?: string;
    teamMon?: string;
    teamPos?: string;
}
/**
 *
 * The information about a member in flight
 */
export interface FlightMember
{
    playerId: number;
    playerName: string;
    photoUrl?: string;
    handicap?: number;
    buggy?: string;
    status?: string;
    scorer?: boolean;
    playerCount?: number;
    playerScoringId?: number;
    scoringPlayerName?: string;
    teeBox?: TeeBox;
}
/**
 * The information about the flight
 */
export interface FlightInfo
{
    flightNumber?: string;
    startTime?: string; //Date;
    startHole?: number;
    groupName?: string;
    playerFlight: boolean;
    flightMembers: Array<FlightMember>;
}
export interface CompetitionCategory
{
    sequence: number;
    categoryId: number;
    categoryName: string;
    gender: string;
    forGrouping: boolean;
    fromHandicap: number;
    toHandicap: number;
}
export interface CompetitionDetails
{
    nextRound?: number;
    roundInProgress?: number;
    players?: Array<CompetitionPlayerInfo>;
    prizes?: Array<CompetitionPrizeInfo>;
    teamPrizes?: Array<CompetitionPrizeInfo>;
    sponsors?: Array<CompetitionSponsorInfo>;
    gameRounds?: Array<GameRoundInfo>;
    categories?: Array<CompetitionCategory>;
    //The requesting player's overall scores and position
    totalNet?: number;
    totalGross?: number;
    netPosition?: number;
    grossPosition?: number;
    totalTeams?: number;
    paymentMandatory?: boolean;
    paymentUrl?: string;
}

export function createCompetitionDetails(): CompetitionDetails {
    return {
        players   : new Array<CompetitionPlayerInfo>(),
        prizes    : new Array<CompetitionPrizeInfo>(),
        teamPrizes: [],
        sponsors  : new Array<CompetitionSponsorInfo>(),
        gameRounds: new Array<GameRoundInfo>()
    };
}

export function createLeaderboardDetails(): Leaderboard {
    return {
        success: true
    };
}
/**
 * The filter option for searching competitions
 */
export interface CompetitionSearchCriteria
{
    searchType: string;
    /**
     * Specifies whether to list only competitions
     * participated by the player. The player ID must be
     * specified as a separate parameter
     */
    onlyParticipating?: boolean;
    /**
     * Find competitions held in clubs nearby
     */
    searchWithinDistance?: boolean;
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
}
/**
 * The player in a leaderboard
 */
export interface LeaderboardPlayer
{
    position?: number;
    firstName?: string;
    lastName?: string;
    imageURL?: string;
    handicap?: number;
    toPar?: number;
    totalGross?: number;
    totalNet?: number;
    playerId?: number;
    parCap?: number;
    playerName: string;
    modifiedTotalNet: number;
    onHole?: string;
    thru?: string;
    startTime?: {
        hour: string,
        minute: string,
        second: string,
        nano: string
    }
    round1Gross?: number;
    round2Gross?: number;
    round3Gross?: number;
    round4Gross?: number;
    countryId?: string;
    sportCode?: string;
    flagUrl?: string;
}
/**
 * An instance of Leaderboard
 */
export interface Leaderboard
{
    competionName?: string;
    firstNineCourseName?: string;
    secondNoneCourseName?: string;
    totalPages?: number;
    currentPage?: number;
    totalInPage?: number;
    success: boolean;
    errorMessage?: string;
    players?: Array<LeaderboardPlayer>;
}

export interface PrizeInfo
{
    title: string;
    prizeName: string;
    order?: number;
    prizeMoney?: number;
    playerPos?: string;
    playerMon?: string;
    teamPos?: string;
    teamMon?: string;
    prizePosition?: number;
}

export interface ScoreGroup
{
    scoreType: string;
    prizes: Array<PrizeInfo>;
}

export interface CategoryPrize
{
    categoryName: string;
    // prizes: Array<PrizeInfo>;
    scoreGroups: Array<ScoreGroup>;
}

export interface GameroundPrize
{
    roundName: string;
    categoryPrizes: Array<CategoryPrize>;
}
// 2016-11-08 Nik Added Competition Teams
export interface CompetitionTeams extends PagedResult
{
    competitionTeams: Array<Teams>;
}
export interface Teams extends PagedResult
{
    teamId: number;
    teamName: string;
    active: boolean;
    description: string;
    teamLogo: string;
    playerTeam?: boolean;
    teamPlayers: Array<TeamPlayers>;
    captainName?: string;
    teamSessionTime?: Date; //from gs_round_session and gs_session_team
}

export interface TeamPlayers
{
    teamPlayerId: number,
    teamPlayerName: string;
    handicap: number;
    gender?: string;
    status?: string; //from gs_competition_player e.g. withdraw/no-show
    imageURL?: string;
    thumbnailURL?: string; //from gs_player.profile
}

export function createTeamDetails(): Teams {
    return {
        totalPages : 0,
        currentPage: 0,
        totalItems : 0,
        totalInPage: 0,
        success    : false,
        teamId     : 0,
        teamName   : '',
        active     : false,
        description: 'No description available',
        teamLogo   : '/img/default-user.jpg',
        teamPlayers: new Array<TeamPlayers>()
    };
}
