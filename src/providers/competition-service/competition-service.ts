import {Injectable} from '@angular/core';
import {RequestMethod, Response} from '@angular/http';
import {RemoteHttpService} from '../../remote-http';
import {AuthenticationService} from '../../authentication-service';
import {
    CompetitionDetails,
    CompetitionInfo,
    CompetitionList,
    CompetitionPlayerInfo,
    CompetitionPrizeInfo,
    CompetitionSponsorInfo,
    CompetitionTeams,
    FlightInfo,
    FlightMember,
    GameroundPrize,
    Leaderboard,
    LeaderboardPlayer,
    TeamPlayers,
    Teams
} from '../../data/competition-data';
import {SearchCriteria} from '../../data/search-criteria';
import {JsonService} from '../../json-util';
import {Preference} from '../../storage/preference';
import {ContentType, RemoteRequest} from '../../remote-request';
import * as global from '../../globals';
import {Observable} from 'rxjs/Observable';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {isPresent} from 'ionic-angular/util/util';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {ServerResult} from '../../data/server-result';
// import {PlainScorecard} from '../../data/scorecard';
import {ScorecardService} from '../../providers/scorecard-service/scorecard-service';
// import "rxjs/observable/ErrorObservable";
import * as moment from 'moment';
import {DeviceService} from '../device-service/device-service';
import {PlainScoreCard} from '../../data/mygolf.data';

/*
 Generated class for the CompetitionService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class CompetitionService
{

    private searchCriteria: SearchCriteria;
    private startDate: Date;
    private endDate: Date;
    private selectedRoundNo: number;
    private selectedCategoryId: string;
    private selectedOrderBy: number;
    private isPrivate: boolean   = false;
    private isTeamEvent: boolean = false;

    private sortedPrizes: Array<string>;

    constructor(private http: RemoteHttpService,
        private auth: AuthenticationService,
        private deviceService: DeviceService,
        private pref: Preference) {
        this.searchCriteria = {
            searchType       : "all",
            onlyParticipating: false,
            maxDistance      : 10,
            competitionLeaderboardSortBy: 2
        };
        this.pref.getPref("CompetitionFilter")
            .subscribe((data: any) => {
                if(data){
                    this.searchCriteria = data;
                    if (this.searchCriteria != null && !this.searchCriteria.maxDistance)
                        this.searchCriteria.maxDistance = 10;
                }
            }, (error) => {
                console.error(error);
            });
    }

    /**
     * Sets the search criteria for competitions
     * @param search
     */
    public setSearch(search: SearchCriteria) {
        console.log("[searchCriteria] Setting Search", search)
        this.searchCriteria = search;
        if (this.searchCriteria != null && !this.searchCriteria.maxDistance)
            this.searchCriteria.maxDistance = 10;
        console.log("[searchCriteria] Setting search with distance :",this.searchCriteria)
        //Save it
        this.pref.setPref("CompetitionFilter", search);
    }

    /**
     * Gets the preference stored
     * @returns {CompetitionSearchCriteria}
     */
    public getSearch(): SearchCriteria {
        return this.searchCriteria;
    }

    public setFilterStartDate(startDate: Date) {
        this.startDate = startDate;
    }

    public setFilterEndDate(endDate: Date) {
        this.endDate = endDate;
    }

    public setLeaderboardFilter(orderBy: number = 2, roundNo?: number, categoryId?: string, isTeamEvent?: boolean) {
        this.selectedRoundNo = roundNo;
        if (categoryId == '0') {
            this.selectedCategoryId                           = null;
            this.searchCriteria.competitionLeaderboardGroupBy = '';
        }
        else {
            this.selectedCategoryId                           = categoryId;
            this.searchCriteria.competitionLeaderboardGroupBy = this.selectedCategoryId;
        }

        this.selectedOrderBy                             = orderBy;
        this.searchCriteria.competitionLeaderboardSortBy = this.selectedOrderBy;

        this.isTeamEvent = isTeamEvent;
    }

    public setPrivate(isPrivate: boolean) {
        this.isPrivate = isPrivate;
    }

    public getCompetitionsInProgress(playerId: number): Observable<Array<CompetitionInfo>> {
        let request = new RemoteRequest(global.ServerUrls.activeCompetitions, RequestMethod.Get,
            ContentType.URL_ENCODED_FORM_DATA, {
                playerId: playerId
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let comps: Array<CompetitionInfo> = resp.json();
                       comps.forEach(c => {
                           JsonService.deriveFullUrl(c, "imageUrl");
                           JsonService.deriveFullUrl(c, "thumbnail");
                           JsonService.deriveDates(c, ["startDate", "endDate",
                                                       "publishDate", "openDate", "closeDate"]);
                       });
                       return comps;
                   }).catch(this.handleError);
    }

    /**
     * Load the next page of competitions based on your search criteria
     * @param pageNo The
     * @returns {Observable<CompetitionList>} The competitions are already adjusted with absolute URLs
     * for images and the dates are converted from string
     */
    public search(pageNo: number = 1, searchText: string): Observable<CompetitionList> {
        let request = this.createSearchRequest(pageNo, searchText);
        return this.searchCompetitions(request);
    }

    /**
     * Gets the information of a component
     * @param competitionId
     */
    public getCompetitionInfo(competitionId: number): Observable<CompetitionInfo> {
        let request = new RemoteRequest(global.ServerUrls.competitionInfo,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                competitionId: competitionId
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let compInfo: CompetitionInfo = resp.json()
                       console.log("comp info:" + compInfo.imageUrl)
                       JsonService.deriveFullUrl(compInfo, "imageUrl");
                       JsonService.deriveFullUrl(compInfo, "thumbnail");
                       JsonService.deriveDates(compInfo, ["startDate", "endDate",
                                                          "publishDate", "openDate", "closeDate"]);
                       return compInfo;
                   })
                   .catch(this.handleError);
    }

    /**
     * Gets the competition details for a given competition
     * @param competitionId The ID of the competition for which details are required
     * @returns {Observable<R>} The URLs are already sanitized and absolute
     */
    public getDetails(competitionId: number): Observable<CompetitionDetails> {
        let request = new RemoteRequest(global.ServerUrls.competitionDetails,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                competitionId: competitionId
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let details: CompetitionDetails = resp.json()
                       if (details.gameRounds)
                           details.gameRounds.forEach(gr => JsonService.deriveDates(gr, ["roundDate"]));

                       if (details.sponsors)
                           details.sponsors.forEach(s => JsonService.deriveFullUrl(s, "imageUrl"));

                       if (details.players)
                           details.players.forEach(p => {
                               JsonService.deriveDates(p, ["registeredOn"]);
                               JsonService.deriveFullUrl(p, "photoUrl");
                           });
                       return details;
                   })
                   .catch(this.handleError);

    }

    /**
     * Get active list of competitions for a given club
     * @param clubId
     * @returns {Observable<R>}
     */
    public getActiveCompetitionsForClub(clubId: number) : Observable<Array<CompetitionInfo>>{
        let request = new RemoteRequest(global.ServerUrls.activeCompetitionsForClub,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                clubId: clubId
            });
        return this.http.execute(request)
            .map((resp: Response)=>{
                let comps: Array<CompetitionInfo> = resp.json();
                comps.forEach((comp)=>{
                    JsonService.deriveFullUrl(comp, "imageUrl");
                });
                return comps;
            });
    }
    /**
     * Get active list of competitions for a given organizer
     * @param organizerId The ID of the organizer
     * @returns {Observable<R>}
     */
    public getActiveCompetitionsForOrganizer(organizerId: number) : Observable<Array<CompetitionInfo>>{
        let request = new RemoteRequest(global.ServerUrls.activeCompetitionsForOrganizer,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                organizerId: organizerId
            });
        return this.http.execute(request)
                   .map((resp: Response)=>{
                       let comps: Array<CompetitionInfo> = resp.json();
                       comps.forEach((comp)=>{
                           JsonService.deriveFullUrl(comp, "imageUrl");
                       });
                       return comps;
                   });
    }
    /**
     * Gets the flights for a given competition and round number
     * @param competitionId The ID of the competition.
     * @param roundNo The round number
     * @returns {Observable<R>} Returns an Observable of array of flight info
     */
    public getFlights(competitionId: number, roundNo: number): Observable<Array<FlightInfo>> {
        let request = new RemoteRequest(global.ServerUrls.competitionFlights,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                competitionId: competitionId,
                roundNo      : roundNo
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let flights: Array<FlightInfo> = resp.json();
                       flights.forEach((flight: FlightInfo) => {
                        //    JsonService.deriveTime(flight, ["startTime"]);
                        // flight.startTime = moment(flight.startTime).format("HH:mm")
                           flight.flightMembers.forEach((m: FlightMember) => {
                               JsonService.deriveFullUrl(m, "photoUrl");
                           });
                       });
                       return flights;
                   })
                   .catch(this.handleError);

    }

    /**
     * Gets all the sponsors for a given competition from the server
     * @param competitionId The ID of the competition
     * @returns {Observable<R>} Returns an Observable which you can subscribe for result.
     */
    public getSponsors(competitionId: number): Observable<Array<CompetitionSponsorInfo>> {
        let request = new RemoteRequest(global.ServerUrls.competitionSponsors,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                competitionId: competitionId
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let sponsors: Array<CompetitionSponsorInfo> = resp.json();
                       if (sponsors) {
                           sponsors.forEach((s: CompetitionSponsorInfo) => {
                               JsonService.deriveFullUrl(s, "imageUrl");
                           });
                       }
                       return sponsors;
                   }).catch(this.handleError);
    }

    /**
     * Gets the list of competition prizes.
     * @param competitionId The ID of the competition
     * @returns {Observable<R>} Returns the Obersvable which you can subscribe for extracting result.
     */
    public getPrizes(competitionId: number): Observable<Array<CompetitionPrizeInfo>> {
        let request = new RemoteRequest(global.ServerUrls.competitionPrizes,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                competitionId: competitionId
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let prizes: Array<CompetitionPrizeInfo> = resp.json();
                       return prizes;
                   }).catch(this.handleError);
    }

    /**
     * Get the list of players registered for the given competition.
     * @param competitionId The ID of the competition
     * @param sortBy Sort option. default value is "name". Another options is "handicap"
     * @returns {Observable<R>}
     */
    public getPlayersRegistered(competitionId: number, sortBy: string = "name"): Observable<Array<CompetitionPlayerInfo>> {
        let request = new RemoteRequest(global.ServerUrls.competitionPlayers,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                competitionId: competitionId,
                sortBy       : sortBy
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let players: Array<CompetitionPlayerInfo> = resp.json();
                       if (players)
                           players.forEach((p: CompetitionPlayerInfo) => {
                               JsonService.deriveDates(p, ["registeredOn"]);
                               JsonService.deriveFullUrl(p, "photoUrl");
                           });
                       return players;
                   }).catch(this.handleError);
    }

    

    /**
     * Get the scorers in the given competition round
     * @param competitionId The ID of the competition
     * @param roundNo The round number
     * @returns {Observable<R>}
     */
    public getScorers(competitionId: number, roundNo: number): Observable<Array<CompetitionPlayerInfo>> {
        let request = new RemoteRequest(global.ServerUrls.competitionScorers,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                competitionId: competitionId,
                roundNo      : roundNo
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let players: Array<CompetitionPlayerInfo> = resp.json();
                       if (players)
                           players.forEach((p: CompetitionPlayerInfo) => {
                               JsonService.deriveDates(p, ["registeredOn"]);
                               JsonService.deriveFullUrl(p, "photoUrl");
                           });
                       return players;
                   }).catch(this.handleError);
    }

    /**
     * Registers a palyer for the competition.
     * @param competitionId The ID of the competition
     * @param playerId The player id
     * @returns {Observable<R>} returns the
     */
    public register(competitionId: number, playerId: number,
        ignoreOverlap: boolean): Observable<ServerResult> {

        let request = new RemoteRequest(global.ServerUrls.competitionRegister,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA,
            {
                competitionId: competitionId,
                playerId     : playerId,
                ignoreOverlap: ignoreOverlap
            });
        return this.http.execute(request)
                   .map((resp: Response) => resp.json())
                   .catch(this.handleError);
    }

    /**
     * De-Registers a player from the competition
     * @param competitionId The ID of the competition
     * @param playerId The ID of the player to de-register
     * @returns {Observable<R>}
     */
    public deregister(competitionId: number, playerId: number): Observable<ServerResult> {
        let _compId = competitionId;
        let _url;
        // _url = global.ServerUrls.competitionDeregister+"/"+_compId;
        _url = global.ServerUrls.competitionDeregister; 
        let request = new RemoteRequest(_url,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA,
            {
                competitionId: competitionId,
                playerId     : playerId
            });
        return this.http.execute(request)
                   .map((resp: Response) => resp.json())
                   .catch(this.handleError);
    }

    /**
     * For a given competition, creates or gets the created scorecard
     * @param competitionId
     * @returns {Observable<R>}
     */
    public getOrCreateScorecard(competitionId: number,
            breakLock?:boolean,
            playerId?: number) {
        let hdrs = {};
        if (isPresent(playerId)) hdrs["Player-Id"] = playerId;
        let request = new RemoteRequest(global.ServerUrls.competitionScorecardGetOrCreate,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, {
                competitionId: competitionId,
                breakLock: breakLock
            }, hdrs);

        return this.http.execute(request)
                   .map((resp: Response) => {
                       let scorecard: PlainScoreCard = resp.json();
                       ScorecardService.transform(scorecard);
                       return scorecard;
                   }).catch((error) => {
                return ErrorObservable.create(error);
            })
    }

    public notifyFlightInfoChange(competitionId: number, roundNo: number,
        flightNo: string, changedBy: number): Observable<boolean> {
        let request = new RemoteRequest(global.ServerUrls.competitionFlightChanged,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, {
                competitionId: competitionId,
                roundNo      : roundNo,
                flightNo     : flightNo,
                playerId     : changedBy
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let result: ServerResult = resp.json();
                       return result.success
                   }).catch(this.handleError);
    }

    /**
     * Withdraw a player from the competition
     * @param competitionId The ID of the competition
     * @param roundNo The round no
     * @param playerId The ID of the player to withdraw
     * @returns {Observable<R>}
     */
    public withdraw(competitionId: number, roundNo: number,
        playerId: number): Observable<boolean> {
        let request = new RemoteRequest(global.ServerUrls.competitionWithdraw,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, {
                competitionId: competitionId,
                roundNo      : roundNo,
                playerId     : playerId
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let result: ServerResult = resp.json();
                       return result.success;
                   }).catch(this.handleError);
    }

    /**
     * Change the scorer for a given player
     * @param competitionId The ID of the competition
     * @param roundNo The round number
     * @param playerId The ID of the player for whom the scorer needs to be changed
     * @param scorerId The ID of the scorer
     * @returns {Observable<R>}
     */
    public changeScorer(competitionId: number, roundNo: number,
        playerId: number, scorerId: number): Observable<boolean> {
        let request = new RemoteRequest(global.ServerUrls.competitionChangeScorer,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, {
                competitionId  : competitionId,
                roundNo        : roundNo,
                playerId       : playerId,
                scoringPlayerId: scorerId
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let result: ServerResult = resp.json();
                       return result.success;
                   }).catch(this.handleError);
    }

    /**
     *
     * For a given competition, get the scoring round number for the player
     * @param competitionId The ID of the competition
     * @returns {Observable<R>}
     */
    public getScoringRoundNumber(competitionId: number): Observable<number> {
        let request = new RemoteRequest(global.ServerUrls.competitionRoundForScoring,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                competitionId: competitionId
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let round: number = parseInt(resp.text());
                       return round;
                   });
    }

    /**
     * Gets the leaderboard for a given competition & round number
     * @param competitionId
     * @param orderBy
     * @param roundNo
     * @param categoryId
     * @returns {Observable<R>} Returns the Observable which you can subscribe
     * with next method receiving Leaderboard object and all player image URLs processed.
     */
    public getLeaderboard(competitionId: number, orderBy?: number,
        roundNo?: number, categoryId?: string, isTeamEvent?: boolean): Observable<Leaderboard> {
        if (!orderBy)
            orderBy = this.searchCriteria.competitionLeaderboardSortBy;//this.selectedOrderBy;

        if (!roundNo)
            roundNo = this.selectedRoundNo;

        if (!categoryId)
            categoryId = this.searchCriteria.competitionLeaderboardGroupBy; //this.selectedCategoryId;

        if (!isTeamEvent)
            isTeamEvent = this.isTeamEvent;

        let request = new RemoteRequest(global.ServerUrls.competitionLeaderboard,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA,
            {
                competitionId: competitionId,
                roundNo      : roundNo,
                categoryId   : categoryId,
                orderBy      : orderBy,
                isTeamEvent  : isTeamEvent ? 'true' : 'false'
            });

        return this.http.execute(request)
                   .map((resp: Response) => {
                       let leaderBoard: Leaderboard = resp.json();
                       if (leaderBoard && leaderBoard.players)
                           leaderBoard.players.forEach((p: LeaderboardPlayer) => {
                               JsonService.deriveFullUrl(p, "imageURL");
                           });
                       return leaderBoard;
                   }).catch(this.handleError);
    }

    /**
     * Returns the competition prizes grouped by round number and category name
     * @param compPrizes The competition prizes to group
     */
    public groupedPrizes(compPrizes: Array<CompetitionPrizeInfo>): Array<GameroundPrize> {
        let result = new Array<GameroundPrize>();
        compPrizes.forEach(cp => {
            let roundName      = cp.roundNumber && cp.roundNumber !== 999
                ? "Round " + cp.roundNumber : "Overall";
            let categoryName   = cp.categoryName ? cp.categoryName : "Overall";
            let scoreType      = cp.scoreType;
            let gameRoundPrize = result.filter(gp => {
                return gp.roundName === roundName;
            }).pop();

            if (!gameRoundPrize) {
                gameRoundPrize = {
                    roundName     : roundName,
                    categoryPrizes: []
                };
                result.push(gameRoundPrize);
            }
            let categoryPrize = gameRoundPrize.categoryPrizes.filter(categoryPrize => {
                return categoryPrize.categoryName == categoryName;
            }).pop();
            if (!categoryPrize) {
                categoryPrize = {
                    categoryName: categoryName,
                    scoreGroups : []
                    // prizes: []
                };
                gameRoundPrize.categoryPrizes.push(categoryPrize);
            }

            let scoreGroup = categoryPrize.scoreGroups.filter(scoreGroup => {
                return scoreGroup.scoreType == scoreType;
            }).pop();
            if (!scoreGroup) {
                scoreGroup = {
                    scoreType: scoreType,
                    prizes   : []
                    // prizes: []
                };
                categoryPrize.scoreGroups.push(scoreGroup);
            }

            // let sortedPrizes = scoreGroup.prizes.sort((a,b)=>a.prizePosition.localeCompare(b.SupplierName));

            scoreGroup.prizes.push({
                title     : cp.title,
                prizeName : cp.prizeName,
                order     : cp.order,
                prizeMoney: cp.prizeMoney,
                playerPos : cp.playerPos,
                playerMon : cp.playerMon,
                teamPos   : cp.teamPos,
                teamMon   : cp.teamMon,
                prizePosition : cp.prizePosition
            });
            scoreGroup.prizes.sort((a,b)=> {
                if(a.prizePosition < b.prizePosition) return -1;
                else if(a.prizePosition > b.prizePosition) return 1;
                else return 0;
            });
            // console.log("scoreGroup : ",scoreGroup)
        });
        // console.log("Result :", result)

        return result;
    }

    private searchCompetitions(request: RemoteRequest): Observable<CompetitionList> {
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let compList: CompetitionList = resp.json();

                       compList.competitions.forEach((comp: any, index: number) => {
                           // if (!isPresent(comp.imageUrl)) comp.imageUrl = "document/img/default_competition.png";
                           JsonService.deriveFullUrl(comp, "imageUrl");
                           JsonService.deriveFullUrl(comp, "thumbnail");
                           JsonService.deriveDates(comp, ["startDate", "endDate",
                                                          "publishDate", "openDate", "closeDate"]);
                       });
                       return compList;
                   }).catch(this.handleError);

    }

    private createSearchRequest(pageNo: number = 1, searchText?: string): RemoteRequest {
        // let params = {
        //     pageNumber: pageNo
        // };
        // if (isPresent(searchText)) params["searchText"] = searchText;
        // if (isPresent(this.startDate)) {
        //     let str = moment(this.startDate)
        //         .format("YYYY-MM-DD");
        //     params["startDate"] = str;
        // }
        // if (isPresent(this.endDate)) params["endDate"] = moment(this.endDate)
        //     .format("YYYY-MM-DD");
        //
        // params = JsonService.mergeObjects([params, this.searchCriteria]);
        // return new RemoteRequest(global.ServerUrls.searchCompetitions,
        //     RequestMethod.Get,
        //     ContentType.URL_ENCODED_FORM_DATA,
        //     params);
        return this._buildSearchRequest(pageNo, searchText, this.searchCriteria, this.startDate, this.endDate);
    }

    private _buildSearchRequest(pageNo: number,
        searchText: string,
        searchCriteria: SearchCriteria,
        startDate: Date,
        endDate: Date): RemoteRequest {
        let params = {
            pageNumber: pageNo,
            country: this.searchCriteria.countryId
        };
        if (isPresent(searchText)) params["searchText"] = searchText;
        if (isPresent(startDate)) {
            let str             = moment(startDate)
                .format("YYYY-MM-DD");
            params["startDate"] = str;
        }
        if (isPresent(endDate))
            params["endDate"] = moment(endDate)
                .format("YYYY-MM-DD");

        params = JsonService.mergeObjects([params, searchCriteria]);
        if (this.searchCriteria.searchType == 'private') {
            return new RemoteRequest(global.ServerUrls.getPrivateCompetitionList,
                RequestMethod.Get,
                ContentType.URL_ENCODED_FORM_DATA,
                params);
        } else {
            return new RemoteRequest(global.ServerUrls.searchCompetitions,
                RequestMethod.Get,
                ContentType.URL_ENCODED_FORM_DATA,
                params);
        }

    }

    private handleError(error) {
        let result: any;
        if (error && error.json) result = error.json();
        else if (error)
            result = error;
        else result = "Server error occured";

        return Observable.throw(result);
    }

    public getCompetitionTeams(competitionId: number): Observable<CompetitionTeams> {
        let request = new RemoteRequest(global.ServerUrls.getCompetitionTeamList,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                competitionId: competitionId
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let compTeams: CompetitionTeams = resp.json();
                       compTeams.competitionTeams.forEach((team: Teams) => {
                           JsonService.deriveTime(team, ["teamSessionTime"]);
                           if (team.teamLogo)
                               JsonService.deriveFullUrl(team, "teamLogo");

                           team.teamPlayers.forEach((tp: TeamPlayers) => {
                               if (tp.imageURL)
                                   JsonService.deriveFullUrl(tp, "imageURL");
                               if (tp.thumbnailURL)
                                   JsonService.deriveFullUrl(tp, "thumbnailURL");

                           });
                       });
                       console.log("competition team service:", resp.json())
                       return compTeams;
                   })
                   .catch(this.handleError);

    }

    public autoScoreCompetition(competitionId: number,
        roundNo: number,
        scorersToExclude: Array<number>,
        delayInSeconds: number): Observable<boolean> {
        let req = new RemoteRequest(global.MygolfServer + "/rest/competition/autoscore",
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, {
                competitionId  : competitionId,
                roundNo        : roundNo,
                excludedScorers: scorersToExclude,
                delayInSeconds : delayInSeconds
            });
        return this.http.execute(req)
                   .map((resp: Response) => {
                       let result: ServerResult = resp.json();
                       return result.success;
                   })
    }
    public releaseDeviceLock(competitionId: number,
        roundNo: number, scorerId: number): Observable<boolean> {
        let deviceId = this.deviceService.getCachedDeviceInfo().deviceId;
        let req = new RemoteRequest(global.MygolfServer + "/rest/device/unlockcompetition",
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, {
                competitionId  : competitionId,
                roundNo        : roundNo,
                scorerId: scorerId,
                deviceId: deviceId
            });
        return this.http.execute(req)
            .map((resp: Response)=> {
                let result: ServerResult = resp.json();
                return result;
            }).map(result=>result.success);
    }
    public breakAndAcquireDeviceLock(competitionId: number,
        roundNo: number, scorerId: number, flightNumber?: string): Observable<ServerResult> {
        let req = new RemoteRequest(global.MygolfServer + "/rest/device/breaklock",
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, {
                competitionId  : competitionId,
                roundNo        : roundNo,
                scorerId: scorerId,
                flightNumber : flightNumber,
                deviceId: this.deviceService.getCachedDeviceInfo().deviceId
            });
        return this.http.execute(req)
                   .map((resp: Response)=>{
                       let result: ServerResult = resp.json();
                       return result;
                   });
    }

    public isPlayerWithdrawn(compId: number, playerId: number): Observable<boolean>{
        let req = new RemoteRequest(global.MygolfServer + "/rest/competition/isplayerwithdrawn",
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                competitionId  : compId,
                playerId: playerId
            });
        return this.http.execute(req)
                   .map((resp: Response)=>{
                       let result: boolean = resp.json();
                       return result;
                   });
    }


    public testAPIcall(): Observable<any>{
        console.log("Test API : server urls",global.ServerUrls.playerMain);
        console.log("Test API : Req method", RequestMethod.Get);
        console.log("Test API : Content Type", ContentType.URL_ENCODED_FORM_DATA);

        let param_ = {
            my_message: 'Test message here',
            amount: '123',
            paid_date: '2019-03-03',
            paid_days: '3'
        }
        let request = new RemoteRequest('http://v23.mygolf2u.com/payment/test-call?my_message='
        +param_.my_message
        +'&amount='+param_.amount
        +'&paid_date='+param_.paid_date
        +'&paid_days='+param_.paid_days,
        RequestMethod.Post,
        ContentType.URL_ENCODED_FORM_DATA, 
        // {
        //     my_message: 'Test message here',
        //     amount: '123',
        //     paid_date: '2019-03-03',
        //     paid_days: '3'
        // }
        );

        return this.http.execute(request).map((resp: Response) => {

        }).catch(this.handleError);

        // let request = new RemoteRequest(global.ServerUrls.competitionPlayers,
        //     RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
        //         competitionId: competitionId,
        //         sortBy       : sortBy
        //     });
        // return this.http.execute(request)
        //            .map((resp: Response) => {
        //                let players: Array<CompetitionPlayerInfo> = resp.json();
        //                if (players)
        //                    players.forEach((p: CompetitionPlayerInfo) => {
        //                        JsonService.deriveDates(p, ["registeredOn"]);
        //                        JsonService.deriveFullUrl(p, "photoUrl");
        //                    });
        //                return players;
        //            }).catch(this.handleError);
    }
}
