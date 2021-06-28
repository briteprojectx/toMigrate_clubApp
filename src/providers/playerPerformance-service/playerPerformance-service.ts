import {Injectable} from '@angular/core';
import {RequestMethod, Response} from '@angular/http';
import {RemoteHttpService} from '../../remote-http';
import {AuthenticationService} from '../../authentication-service';
import {
    CompetitionPlayerInfo,
    CompetitionPrizeInfo,
    CompetitionSponsorInfo,
    FlightInfo,
    FlightMember,
    Leaderboard,
    LeaderboardPlayer
} from '../../data/competition-data';
import {SearchCriteria} from '../../data/search-criteria';
import {Subscriber} from 'rxjs/Subscriber';
import {JsonService} from '../../json-util';
import {Preference} from '../../storage/preference';
import {ContentType, RemoteRequest} from '../../remote-request';
import * as global from '../../globals';
import {Observable} from 'rxjs/Observable';
import {isPresent} from 'ionic-angular/util/util';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import * as moment from 'moment';
import {ServerResult} from '../../data/server-result';
import {PerformanceBase, PerformanceChart, PerformanceDetail} from '../../data/playerPerformance-data';
import {analysisClubInfo} from '../../data/playerAnalysis-data';
// import {ClubInfo, CourseInfo} from '../../data/club-course';
import {SessionInfo} from '../../data/authentication-info';
import {SessionDataService} from '../../redux/session/session-data-service';
import {ClubInfo, CourseInfo} from '../../data/mygolf.data';
/*
 Generated class for the CompetitionService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class PlayerPerformanceService
{

    private searchCriteria: SearchCriteria;
    private startDate: string;
    private endDate: string;
    private holesPlayed: number;
    private courseId: number;
    private clubId: number;
    private strLastNGames: string;
    private courseInfo: CourseInfo;
    private courseType: string;
    private clubCourseId: number;
    private clubInfo: ClubInfo;
    private sessionInfo: SessionInfo;
    constructor(private http: RemoteHttpService,
        private auth: AuthenticationService,
        private sessionService: SessionDataService,
        private pref: Preference) {
        if (!isPresent(this.searchCriteria)) {
            this.searchCriteria = {
                searchType            : "Latest10",
                onlyParticipating     : false,
                type                  : "ALL",
                lastNGames            : 10,
                performanceHolesPlayed: 18,
                periodType            : "NONE",
                periodLength          : 0,
                useNGames             : true
            };
        }
        console.log("service search:", this.searchCriteria)
        this.sessionService.getSession().distinctUntilChanged()
            .subscribe((session: SessionInfo)=>{
                this.sessionInfo = session;
            })
        this.pref.getPref("PerformanceFilter")
            .subscribe((data: any) => {
                this.searchCriteria = data;
            }, (error) => {
                console.error(error);
            });
        this.searchCriteria.useNGames = true;
        this.setSearch(this.searchCriteria, '')
        this.holesPlayed = this.searchCriteria.performanceHolesPlayed;
        this.courseType  = '';

    }

    /**
     * Sets the search criteria for competitions
     * @param search
     */
    public setSearch(search: SearchCriteria, searchType: string, noSave: boolean = false) {
        this.searchCriteria            = search;
        this.searchCriteria.searchType = searchType;
        if (this.searchCriteria.useNGames)
            this.strLastNGames = String(this.searchCriteria.lastNGames);
        else this.strLastNGames = '';
        if (!noSave) {
            //Save it
            this.pref.setPref("PerformanceFilter", search);
        }

    }

    public forceUseNGames() {
        this.searchCriteria.useNGames    = true;
        this.searchCriteria.lastNGames   = 10;
        this.searchCriteria.periodLength = 0;
        this.searchCriteria.periodType   = 'NONE';
        this.setSearch(this.searchCriteria, '')
        this.clubCourseId = null;
    }

    public getDateTo(): string {
        this.pref.getPref("DateTo")
            .subscribe((data: any) => {
                this.endDate = moment(data).format("YYYYMMDD");
            }, (error) => {
                console.error(error);
            });
        return this.endDate;
    }

    public getDateFrom(): string {
        this.pref.getPref("DateFrom")
            .subscribe((data: any) => {
                this.startDate = moment(data).format("YYYYMMDD");
            }, (error) => {
                console.error(error);
            });
        return this.startDate;
    }

    public setCourseType(courseType: string) {
        this.courseType = courseType;
    }

    public getCourseType(): string {
        return this.courseType;
    }

    /**
     * Gets the preference stored
     * @returns {CompetitionSearchCriteria}
     */
    public getSearch(): SearchCriteria {
        this.pref.getPref("PerformanceFilter")
            .subscribe((data: any) => {
                this.searchCriteria = data;
            }, (error) => {
                console.error(error);
            });
        return this.searchCriteria;
    }

    public setFilterStartDate(startDate: Date) {
        //this.startDate = startDate;

        //if(this.searchCriteria.searchType == 'date'){\
        if (isPresent(startDate)) {
            this.startDate = moment(startDate).format("YYYYMMDD");
            console.log("Start date: " + this.startDate + "|" + startDate);
        }
        console.log("Search Type: " + this.searchCriteria.searchType);
        this.pref.setPref("DateFrom", this.startDate);

    }

    public setFilterEndDate(endDate: Date) {
        //this.endDate = endDate;
        // if(this.searchCriteria.searchType == 'date'){
        if (isPresent(endDate)) {
            this.endDate = moment(endDate).format("YYYYMMDD");
            console.log("End Date: " + this.endDate + "|" + endDate);
        }
        console.log("Search Type : " + this.searchCriteria.searchType);
        this.pref.setPref("DateTo", this.endDate);
    }

    public getFilterStartDate() {
        return this.startDate;
    }

    public getFilterEndDate() {
        return this.endDate;
    }

    public setPerformanceFilter(holesPlayed: number, clubCourseId?: number, courseType?: string) {
        if (!isPresent(this.searchCriteria)) {
            this.searchCriteria = {
                searchType            : "Latest10",
                onlyParticipating     : false,
                type                  : "ALL",
                lastNGames            : 10,
                performanceHolesPlayed: 18,
                useNGames             : true

            };
        }
        // this.courseType = courseType;
        console.log("service:setPerfFilter:",this.clubCourseId,holesPlayed,clubCourseId,courseType)
        if(clubCourseId>0) {
          this.clubCourseId                          = clubCourseId;
          this.clubId                                = clubCourseId;
          this.courseId                              = clubCourseId;
                  console.log("setPerFilter", clubCourseId)
        } //else this.clubCourseId = null;
        if(holesPlayed) {
          this.holesPlayed                           = holesPlayed;
          this.searchCriteria.performanceHolesPlayed = holesPlayed;
        }




        console.log("Service:", this.clubId, this.courseId)

    }

    private isClubCourse(courseType) {
        console.log("service:isClubCourse:",this.courseType,courseType, ":", this.clubCourseId)
        if (this.courseType == 'course' && courseType == 'course' && this.clubCourseId > 0)
            return true
        else if (this.courseType == 'club' && courseType == 'club' && this.clubCourseId > 0)
            return true
        else return false;
    }

    public setCourseInfo(courseInfo: CourseInfo) {
        if (isPresent(courseInfo)) {
            this.courseInfo = courseInfo;
            this.courseId   = this.courseInfo.courseId
        }
    }

    public getCourseInfo() {
        return this.courseInfo;

    }

    /**
     * Load the next page of competitions based on your search criteria
     * @param pageNo The
     * @returns {Observable<CompetitionList>} The competitions are already adjusted with absolute URLs
     * for images and the dates are converted from string
     */

    //pageNo: number = 1, searchText: string,
    public search(subscriber: Subscriber<PerformanceBase>) {
        let request = this.createSearchRequest();
        this.searchPerformance(request, subscriber);
    }

    private checkStrLastNGames(): string {
        if (this.searchCriteria.useNGames) {
            this.strLastNGames = String(this.searchCriteria.lastNGames);
        } else {
            this.strLastNGames = '';
        }
        return this.strLastNGames

    }

    private convertPeriodType(): string {
        console.log("initial Convert:", this.searchCriteria.periodType)
        console.log("initial Convert:", this.searchCriteria.useNGames)

        if (this.searchCriteria.useNGames) {
            this.searchCriteria.periodLength = 0;
            this.searchCriteria.periodType   = 'NONE';

            this.setSearch(this.searchCriteria, "");
            return "NONE";
        }
        if (this.searchCriteria.periodType) {
            switch (this.searchCriteria.periodType) {
                case "MONTH":
                    return "M";
                case "DAY":
                    return "D";
                case "WEEK":
                    return "W";
                case "YEAR":
                    return "Y";
                case "NONE":
                    return "NONE";

            }
        }
        return "NONE";
    }

    /**
     * Gets the competition details for a given competition
     * @param competitionId The ID of the competition for which details are required
     * @returns {Observable<R>} The URLs are already sanitized and absolute
     */
    /*type: string = this.searchCriteria.type, holesPlayed: number = 18, userId?: number, dateTo?: Date, dateFrom?: Date*/
    public getPerformanceBase(): Observable<PerformanceBase> {
        //if (!isPresent(userId))
        //    userId = this.auth.currentSession().playerId;
        let dateFrom = this.startDate;
        let dateTo   = this.endDate;
        if (this.searchCriteria.periodType != "CUSTOM") {
            dateTo   = "";
            dateFrom = "";
        }

        console.log("service:holesPlayed:" + this.searchCriteria.performanceHolesPlayed)
        let request = new RemoteRequest(global.ServerUrls.getPlayerPerformanceBase,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                userId      : this.sessionInfo.playerId,
                type        : this.searchCriteria.type,
                holesPlayed : this.searchCriteria.performanceHolesPlayed,
                dateFrom    : dateFrom,
                dateTo      : dateTo,
                course      : this.isClubCourse('course') ? this.clubCourseId : '',
                lastNGames  : this.checkStrLastNGames(),//this.searchCriteria.lastNGames,
                periodLength: this.searchCriteria.periodLength,
                periodType  : this.convertPeriodType(),// this.searchCriteria.periodType,
                playerIds   : this.searchCriteria.playerIds,
                club        : this.isClubCourse('club') ? this.clubCourseId : ''

            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let performanceBase: PerformanceBase = resp.json()
                       return performanceBase;
                   })
                   .catch(this.handleError);

    }

    /*type: string = this.searchCriteria.type, holesPlayed: number = 18, userId?: number, dateTo?: Date, dateFrom?: Date*/
    public getPerformanceDetail(): Observable<PerformanceDetail> {
        //if (!isPresent(userId))
        //    userId = this.auth.currentSession().playerId;
        let dateFrom = this.startDate;
        let dateTo   = this.endDate;
        if (this.searchCriteria.periodType != "CUSTOM") {
            dateTo   = "";
            dateFrom = "";
        }
        let request = new RemoteRequest(global.ServerUrls.getPlayerPerformanceDetails,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                userId      : this.sessionInfo.playerId,
                type        : this.searchCriteria.type,
                holesPlayed : this.searchCriteria.performanceHolesPlayed,
                dateFrom    : dateFrom,
                dateTo      : dateTo,
                course      : this.isClubCourse('course') ? this.clubCourseId : '',
                lastNGames  : this.checkStrLastNGames(),//this.searchCriteria.lastNGames,
                periodLength: this.searchCriteria.periodLength,
                periodType  : this.convertPeriodType(),// this.searchCriteria.periodType,
                playerIds   : this.searchCriteria.playerIds,
                club        : this.isClubCourse('club') ? this.clubCourseId : ''

            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let performanceDetail: PerformanceDetail = resp.json()
                       if (performanceDetail.playerPerformanceDetails)
                           performanceDetail.playerPerformanceDetails.forEach(pd => JsonService.deriveDates(pd, ["roundDate"]));

                       return performanceDetail;
                   })
                   .catch(this.handleError);

    }

    /*type: string = this.searchCriteria.type, holesPlayed: number = 18, userId?: number, dateTo?: Date, dateFrom?: Date*/
    public getPerformanceChart(): Observable<PerformanceChart> {
        //  if (!isPresent(userId))
        //      userId = this.auth.currentSession().playerId;
        let dateFrom = this.startDate;
        let dateTo   = this.endDate;
        if (this.searchCriteria.periodType != "CUSTOM") {
            dateTo   = "";
            dateFrom = "";
        }
        let request = new RemoteRequest(global.ServerUrls.getPlayerPerformanceChart,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                userId      : this.sessionInfo.playerId,
                type        : this.searchCriteria.type,
                holesPlayed : this.searchCriteria.performanceHolesPlayed,
                dateFrom    : dateFrom,
                dateTo      : dateTo,
                course      : this.isClubCourse('course') ? this.clubCourseId : '',
                lastNGames  : this.checkStrLastNGames(),//this.searchCriteria.lastNGames,
                periodLength: this.searchCriteria.periodLength,
                periodType  : this.convertPeriodType(),// this.searchCriteria.periodType,
                playerIds   : this.searchCriteria.playerIds,
                club        : this.isClubCourse('club') ? this.clubCourseId : ''


            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let performanceChart: PerformanceChart = resp.json()
                       /*if (details.gameRounds)
                        details.gameRounds.forEach(gr=>JsonService.deriveDates(gr, ["roundDate"]));

                        if (details.sponsors)
                        details.sponsors.forEach(s=>JsonService.deriveFullUrl(s, "imageUrl"));

                        if (details.players)
                        details.players.forEach(p => {
                        JsonService.deriveDates(p, ["registeredOn"]);
                        JsonService.deriveFullUrl(p, "photoUrl");
                        });*/
                       return performanceChart;
                   })
                   .catch(this.handleError);

    }

    public getPlayerAnalysisHole(holesPlayed: number = 9): Observable<analysisClubInfo> {
        console.log()
        //,type?: string = "ALL", ,userId?: number
        //  if (!isPresent(userId))
        let dateFrom = this.startDate;
        let dateTo   = this.endDate;
        if (this.searchCriteria.periodType != "CUSTOM") {
            dateTo   = "";
            dateFrom = "";
        }
        let userId  = this.sessionInfo.playerId;
        let request = new RemoteRequest(global.ServerUrls.getPlayerAnalysisHole,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                userId      : userId,
                type        : this.searchCriteria.type,
                holesPlayed : "",
                course      : this.isClubCourse('course') ? this.clubCourseId : '',
                dateFrom    : dateFrom, //change this 17/8/2016
                dateTo      : dateTo, //change this 17/8/2016
                lastNGames  : this.checkStrLastNGames(),//this.searchCriteria.lastNGames,
                periodLength: this.searchCriteria.periodLength,
                periodType  : this.convertPeriodType(),// this.searchCriteria.periodType,
                club        : this.isClubCourse('club') ? this.clubCourseId : ''

            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let analysisHole: Array<analysisClubInfo> = resp.json()
                       JsonService.deriveFullUrl(analysisHole, "clubImage");
                       return analysisHole;
                   })
                   .catch(this.handleError)

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
                           JsonService.deriveTime(flight, ["startTime"]);
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

    public getPlayersRegistered(competitionId: number): Observable<Array<CompetitionPlayerInfo>> {
        let request = new RemoteRequest(global.ServerUrls.competitionPlayers,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                competitionId: competitionId
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
    public register(competitionId: number, playerId?: number): Observable<ServerResult> {
        if (!isPresent(playerId))
            playerId = this.sessionInfo.playerId;
        let request = new RemoteRequest(global.ServerUrls.competitionRegister,
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
     * De-Registers a player from the competition
     * @param competitionId The ID of the competition
     * @param playerId The ID of the player to de-register
     * @returns {Observable<R>}
     */
    public deregister(competitionId: number, playerId?: number): Observable<ServerResult> {
        if (!isPresent(playerId))
            playerId = this.sessionInfo.playerId;
        let request = new RemoteRequest(global.ServerUrls.competitionDeregister,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA,
            {
                competitionId: competitionId,
                playerId     : playerId
            });
        return this.http.execute(request)
                   .map((resp: Response) => resp.json())
                   .catch(this.handleError);
    }

    // public getLeaderboard(competitionId: number, orderBy: number, roundNo: number, categoryId: number): Observable<Array<Leaderboard>> {
    //     let request = new RemoteRequest(global.ServerUrls.competitionLeaderboard,
    //         RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
    //             competitionId: competitionId,
    //             roundNo: roundNo,
    //             categoryId: categoryId,
    //             orderBy: orderBy
    //         });
    //     return this.http.execute(request)
    //         .map((resp: Response)=> {
    //             let leaderboards: Array<Leaderboard> = resp.json();
    //             /*leaderboards.forEach((leaderboard: Leaderboard) => {
    //              JsonService.deriveTime(Leaderboard, ["startTime"]);
    //              flight.flightMembers.forEach((m: FlightMember) => {
    //              JsonService.deriveFullUrl(m, "photoUrl");
    //              });
    //              });*/
    //             return leaderboards;
    //         })
    //         .catch(this.handleError);
    //
    // }
    /**
     * Gets the leaderboard for a given competition & round number
     * @param competitionId
     * @param orderBy
     * @param roundNo
     * @param categoryId
     * @returns {Observable<R>} Returns the Observable which you can subscribe
     * with next method receiving Leaderboard object and all player image URLs processed.
     */
    public getLeaderboard(competitionId: number, orderBy: number,
        roundNo?: number, categoryId?: number): Observable<Leaderboard> {
        let request = new RemoteRequest(global.ServerUrls.competitionLeaderboard,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA,
            {
                competitionId: competitionId,
                roundNo      : roundNo,
                categoryId   : categoryId,
                orderBy      : orderBy
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

    private searchPerformance(request: RemoteRequest,
        subscriber?: Subscriber<PerformanceBase>) {
        this.http.execute(request)
            .subscribe((resp: Response) => {
                let perfBase: PerformanceBase = resp.json();

                /*perfBase.competitions.forEach((perf: any, index: number) => {
                 if (isPresent(perf.imageUrl)) {
                 let fullUrl = global.MygolfServer + "/" + comp.imageUrl;
                 perf.imageUrl = fullUrl;
                 }
                 JsonService.deriveDates(comp, ["startDate", "endDate",
                 "publishDate", "openDate", "closeDate"]);
                 });*/
                if (isPresent(subscriber) && isPresent(subscriber.next))
                    subscriber.next(perfBase);
            }, (error) => {
                let err: any;
                if (error.json)
                    err = error.json();
                else
                    err = error;
                if (isPresent(subscriber) && isPresent(subscriber.error))
                    subscriber.error(err);
            }, () => {
                if (isPresent(subscriber) && isPresent(subscriber.complete))
                    subscriber.complete();
            });

    }

    private createSearchRequest(): RemoteRequest {
        let params            = {
            userId: this.sessionInfo.playerId,
            //holesPlayed: 18
        };
        params["holesPlayed"] = this.searchCriteria.performanceHolesPlayed;
        //if (isPresent(searchText)) params["searchText"] = searchText;
        if (isPresent(this.startDate)) {
            let str            = moment(this.startDate)
                .format("YYYYMMDD");
            params["dateFrom"] = str;
        }
        if (isPresent(this.endDate)) params["dateTo"] = moment(this.endDate)
            .format("YYYYMMDD");

        params = JsonService.mergeObjects([params, this.searchCriteria]);
        return new RemoteRequest(global.ServerUrls.getPlayerPerformanceBase,
            RequestMethod.Get,
            ContentType.URL_ENCODED_FORM_DATA,
            params);
    }

    private handleError(error) {
        let result: any;
        if (error && error.json) result = error.json();
        else if (error)
            result = error;
        else result = "Server error occured";

        return Observable.throw(result);
    }

    setClubCourseId(id: number) {
      if(!id || id ===0) {
        this.clubCourseId = null;
        return false;
      } else       this.clubCourseId = id;
    }
    getClubCourseId() {
      return this.clubCourseId;
    }

    public setClubInfo(clubInfo: ClubInfo) {
        if (isPresent(clubInfo)) {
            this.clubInfo = clubInfo;
            this.clubId   = this.clubInfo.clubId
        }
    }

    public getClubInfo() {
        return this.clubInfo;

    }

}
