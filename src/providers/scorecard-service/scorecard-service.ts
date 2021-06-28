import {Injectable} from '@angular/core';
import {RequestMethod, Response} from '@angular/http';
import {Events} from 'ionic-angular/index';
import {isPresent} from 'ionic-angular/util/util';
import * as moment from 'moment';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {AuthenticationService} from '../../authentication-service';
import {SessionInfo} from '../../data/authentication-info';
// import {CourseHoleInfo, CourseInfo} from '../../data/club-course';
import {LeanScorecard} from '../../data/lean-scorecard';
// import {PlayerScore, ScorecardList} from '../../data/scorecard';
// PlainScoreCard, PlayerRoundScores, 
import {SearchCriteria} from '../../data/search-criteria';
import {ServerResult} from '../../data/server-result';
import * as global from '../../globals';
import {JsonService} from '../../json-util';
import {MessageDisplayUtil} from '../../message-display-utils';
import {SessionDataService} from '../../redux/session/session-data-service';
import {RemoteHttpService} from '../../remote-http';
import {ContentType, RemoteRequest} from '../../remote-request';
import {MyGolfStorageService} from '../../storage/mygolf-storage.service';
import {Preference} from '../../storage/preference';
import {ConnectionService} from '../connection-service/connection-service';
import {EventLogService} from '../eventlog-service/eventlog-service';
import {ScorecardStorageService} from './scorecard-storage-service';
import { PlainScoreCard, PlayerRoundScores, PlayerScore, ScorecardList, CourseHoleInfo, CourseInfo } from '../../data/mygolf.data';
/*
 Generated class for the ScorecardService provider. This class handles the
 scorecard related services. The client codes must use this service.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class ScorecardService {
    private static CurrentScorecard: string = "CurrentScorecard";
    private searchCriteria: SearchCriteria;
    private scorecardType: string;
    private startDate: Date;
    private endDate: Date;
    private session: SessionInfo;
    constructor(public http: RemoteHttpService,
        private eventLogService: EventLogService,
        private scorecardStorageService: ScorecardStorageService,
        private  auth: AuthenticationService,
        private sessionService: SessionDataService,
        private connService: ConnectionService,
        private  pref: Preference,
        private storage: MyGolfStorageService,
        private events: Events) {
        this.searchCriteria = {
            searchType       : "all",
            onlyParticipating: true
        };
        this.scorecardType  = "ALL";
        this.sessionService.getSession().distinctUntilChanged()
            .subscribe((session: SessionInfo)=>{
                this.session = session;
            })
        this.pref.getPref("ScorecardSearchFilter")
            .subscribe((data: SearchCriteria) => {
                if (data)
                    this.searchCriteria = data;
            }, (error) => {
            });
        this.pref.getPref("ScorecardSearchScorecardType")
            .subscribe((data) => {
                if (data)
                    this.scorecardType = data;
            }, (error) => {

            })
    }

    public getSearchCriteria(): SearchCriteria {
        return this.searchCriteria;
    }

    public getScorecardType(): string {
        return this.scorecardType;
    }

    public setSearchCriteria(criteria: SearchCriteria,
        scorecardType: string = "ALL") {
        this.searchCriteria = criteria;
        this.scorecardType  = scorecardType;
        this.pref.setPref("ScorecardSearchFilter", criteria);
        this.pref.setPref("ScorecardSearchScorecardType", scorecardType);
    }

    public setFilterStartDate(startDate: Date) {
        this.startDate = startDate;
    }

    public setFilterEndDate(endDate: Date) {
        this.endDate = endDate;
    }

    /**
     * Gets the scorecard for a given round. The player id is automatically
     * populated as header while requesting the scorecard
     * @param gameRoundId The ID of the game round
     * @returns {Observable<R>} Returns the observable for PlainScoreCard
     */
    public getScorecard(gameRoundId: number): Observable<PlainScoreCard> {
        let request = new RemoteRequest(global.ServerUrls.scorecardGet,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                gameRoundId: gameRoundId
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let scorecard: PlainScoreCard = resp.json();
                       ScorecardService.transform(scorecard);
                       return scorecard;
                   }).catch(this.http.handleError)
    }

    /**
     * Gets the scorecard for a given player in a given competition round.
     * The return scorecard returns either scores for all players in the flight or
     * for the player based on the fourth parameter "onlyForPlayer".
     * @param competitionId The ID of the competition
     * @param roundNo The competition round number
     * @param playerId The id of the player
     * @param onlyForPlayer If set to true, then scorecard for the player only returned.
     *  If false, then scores for all the players in the flight are included. Default is false
     * @returns {Observable<R>}
     */
    public getCompetitionScorecard(competitionId: number,
        roundNo: number,
        playerId: number,
        onlyForPlayer: boolean = false) {
        let request = new RemoteRequest(global.ServerUrls.competitionScorecardGet,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                competitionId: competitionId,
                roundNo      : roundNo,
                playerId     : playerId,
                onlyForPlayer: onlyForPlayer
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let scorecard: PlainScoreCard = resp.json();
                       ScorecardService.transform(scorecard);
                       return scorecard;
                   }).catch(this.http.handleError)
    }

    /**
     * Search the scorecards for a given player
     * @param searchText
     * @param pageNumber
     */
    public searchScorecard(searchText: string,
        pageNumber: number = 1): Observable<ScorecardList> {
        let request = this.createSearchRequest(searchText,
            pageNumber, this.scorecardType);

        return this.http.execute(request)
                   .map((resp: Response) => {
                       let scorecardList: ScorecardList = resp.json();
                       if (scorecardList) {
                           scorecardList.scorecards.forEach((sc: PlainScoreCard) => {
                               ScorecardService.transform(sc);
                           });
                       }
                       return scorecardList

                   }).catch(this.http.handleError);
    }

    public getCurrentScorecard(): Observable<PlainScoreCard> {

        return this.pref.getPref(this._currScorecardKey())
                   .map((scoreCard: PlainScoreCard) => {
                    //    if (typeof scoreCard.playedOn === "string") {
                    //        scoreCard.playedOn = moment(scoreCard.playedOn).toDate();
                    //    }
                       return scoreCard;
                   });
    }

    public clearScorecard(): Observable<PlainScoreCard> {
        console.log("clearing scorecard : service ", this._currScorecardKey())
        console.log("clearing scorecard : service ", this.pref.setPref(this._currScorecardKey()))
        return this.pref.setPref(this._currScorecardKey())
    }

    private _currScorecardKey(): string {
        let playerId = this.session.playerId;
        return ScorecardService.CurrentScorecard + "." + playerId;
    }

    /**
     * Saves the current game going on with the latest scores.
     * If the scorecard is for competition, then it will be synced
     * immediately
     * @param scorecard
     * @param localOnly Specifies whether to save the scorecard only locally. The sync only
     * should happen when you change the scoring holes
     */
    public saveCurrentScorecard(scorecard: PlainScoreCard,
        localOnly: boolean = false): Observable<PlainScoreCard> {

        this.pref.setPref(this._currScorecardKey(), scorecard);
        //Store in permanent storage
        this.scorecardStorageService.saveCompetitionScorecard(scorecard, this.session.playerId);

        //If the scorecard is competition or To save it immediately
        if (!localOnly && scorecard.competition && scorecard.dirty) {
            // scorecard.dirty = false;
            return this.saveScorecard(scorecard, false);
        }
        else return Observable.of(scorecard);
        // //Fire an event for scorecard change
        // this.events.publish(GolfEvents.ScorecardChanged, scorecard);
    }

    /**
     * Cancels given game and deletes from the local storage
     * @param scorecard The scorecard for cancelling.
     */
    public  cancelGame(scorecard: PlainScoreCard) {
        //Can a competition game round can be cancelled?
        // this._deleteCurrentScorecard();
    }

    /**
     * Finish the ongoing game. This will generate GameFinished event
     * @param scorecard The scorecard of the game finished
     */
    public finsihGame(scorecard: PlainScoreCard): Observable<PlainScoreCard> {

        //Now store the game with its client key
        scorecard.finished = true;
        if (scorecard.competition) {
            //Save the scorecard and finish the scoring
            return this.saveScorecard(scorecard, true)
                       .map((scorecard: PlainScoreCard) => {
                           // this._deleteCurrentScorecard();
                           // this.events.publish(GolfEvents.GameFinished, scorecard);
                           return scorecard;
                       });
        }
        else {
            return this.saveNormalGameScorecard(scorecard)
                       .map((saved: PlainScoreCard) => {
                           // this._deleteCurrentScorecard();
                           // this.events.publish(GolfEvents.GameFinished, scorecard);
                           return saved;
                       });

        }
    }

    /**
     * Merge the scorecard contents from source to target. The database IDs are
     * merged from source to target.
     * The scores of players from source scorecard are copied to target if the current
     * player is not scoring for them.
     * @param target The target scorecard. The values will be copied to this
     * @param source The source scorecard. The values from this will be copied
     */
    public static mergeScorecards(target: PlainScoreCard, source: PlainScoreCard,
        playerId: number) {
        //First copy the database IDs
        target.gameRoundId = source.gameRoundId;
        target.playerRoundScores.forEach((prs: PlayerRoundScores) => {
            //Get the corresponding player round
            let srcPrs            = source.playerRoundScores.filter((p: PlayerRoundScores) => {
                return p.playerId === prs.playerId;
            }).pop();
            prs.playerRoundId     = srcPrs.playerRoundId;
            prs.backNineNetTotal  = srcPrs.backNineNetTotal;
            prs.backNineTotal     = srcPrs.backNineTotal;
            prs.frontNineNetTotal = srcPrs.frontNineNetTotal;
            prs.frontNineTotal    = srcPrs.frontNineTotal;
            prs.totals.forEach(trgTotals => {
                let srcTotals = srcPrs.totals.filter(t => {
                    return trgTotals.whichNine === t.whichNine;
                }).pop();
                if (srcTotals) {
                    trgTotals.netTotal   = srcTotals.netTotal;
                    trgTotals.grossTotal = srcTotals.grossTotal;
                }
            });
            prs.scores.forEach((ps: PlayerScore) => {
                //Find the corresponding player score
                let srcScore    = srcPrs.scores.filter((s: PlayerScore) => {
                    return (
                    s.whichNine === ps.whichNine
                    // s.gameCourseId === ps.gameCourseId
                    && s.courseId === ps.courseId
                    && s.courseHoleId === ps.courseHoleId);

                }).pop();
                ps.scorecardId  = srcScore.scorecardId;
                ps.gameCourseId = srcScore.gameCourseId;
                if (playerId && prs.scoringPlayerId !== playerId) {
                    //Update the scores from source
                    ps.actualScore = srcScore.actualScore;
                    ps.netScore    = srcScore.netScore;
                }
                else {
                    ps.netScore = srcScore.netScore;
                }
            });
        });
        target.courses.forEach((course: CourseInfo) => {
            let srcCourse       = source.courses.filter((c: CourseInfo) => {
                return c.courseId === course.courseId
                    && c.whichNine === course.whichNine;
            }).pop();
            course.gameCourseId = srcCourse.gameCourseId;
        })

    }

    public static isFlightSame(scorecard: PlainScoreCard,
        scorecardFromServer: PlainScoreCard,
        playerId: number): boolean {
        let result = false;
        //Check the players first

        let players       = scorecard.playerRoundScores.map(prs => {
            return prs.playerId
        });
        let serverPlayers = scorecardFromServer.playerRoundScores.map(prs => {
            return prs.playerId
        });
        result            = ScorecardService.isArrayEquals(players, serverPlayers);
        if (result) {
            //Check the status and scorer for each player
            scorecard.playerRoundScores.forEach(prs => {
                let serverPrs = scorecardFromServer.playerRoundScores.filter(sprs => {
                    return prs.playerId === sprs.playerId;
                }).pop();
                if (serverPrs) {
                    result = result && (prs.status === serverPrs.status && prs.scoringPlayerId === serverPrs.scoringPlayerId);
                }
            });
        }

        return result;
    }

    public static isArrayEquals(arrA: Array<any>, arrB: Array<any>): boolean {
        //check if lengths are different
        if (arrA.length !== arrB.length) return false;

        //slice so we do not effect the orginal
        //sort makes sure they are in order
        var cA = arrA.slice().sort();
        var cB = arrB.slice().sort();

        for (var i = 0; i < cA.length; i++) {
            if (cA[i] !== cB[i]) return false;
        }
        return true;
    }

    /**
     * Saves the normal game scorecard
     * @param scorecard The scorecard to save
     * @returns {Observable<R>}
     */
    public saveNormalGameScorecard(scorecard: PlainScoreCard, teeTime?): Observable<PlainScoreCard> {

        let playedOnDate         = scorecard.playedOn;
        let playedOn             = moment(scorecard.playedOn).format("YYYY-MM-DD");
        let actualStartTime            = scorecard.playerRoundScores.map(prs => prs.actualStartTime)
                                            .pop();
        let startTime            = scorecard.playerRoundScores.map(prs => prs.startTime)
                                            .pop();
        scorecard.playerRoundScores.forEach((prs: PlayerRoundScores) => {
            prs.startTime       = null;
            prs.actualStartTime = null;
            console.log("[PRS] TeeOffFrom : ",prs.teeOffFrom);
        });
        // if(true) return null;
        scorecard["playedOn"] = null;

        let scorecardStr   = JSON.stringify(scorecard);
        scorecard.playedOn = playedOnDate;
        let data           = {
            scorecard: scorecardStr
        };
        if (playedOnDate)
            data["playedOn"] = playedOn;
        if (startTime)
            data["startTime"] = moment(startTime,'HH:mm:ss').format("HH:mm");
        if (actualStartTime)
            data["actualStartTime"] = moment(actualStartTime,'HH:mm:ss').format("HH:mm");
        // else data["startTime"] = moment(teeTime).format("HH:mm");

        // if(teeTime) data["startTime"] = moment(teeTime).format("HH:mm");
        // else data["startTime"] = moment(startTime).format("HH:mm");
        const updParam = '?playedOn='+data['playedOn']+'&startTime='+data['startTime']+'&actualStartTime='+data['actualStartTime']; 

        console.log("[TeeTime] Save normal game PRE : ",data)
        let request = new RemoteRequest(global.ServerUrls.saveNormalGame+updParam,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, data);

        return this.http.execute(request)
                   .map((resp: Response) => {
                       let saved: PlainScoreCard = resp.json();
                       //Now merge these two scorecards
                       ScorecardService.mergeScorecards(scorecard, saved,
                           this.session.playerId);
                       scorecard.playerRoundScores.forEach((prs: PlayerRoundScores) => {
                           prs.startTime       = startTime;
                           prs.actualStartTime = actualStartTime;
                           let savedP          = saved.playerRoundScores.filter(savedPrs => {
                               return prs.playerRoundId === savedPrs.playerRoundId;
                           }).pop();
                           console.log("[TeeTime] Save normal game POST : ",data)
                           console.log("[PRS] Teeoftime saved : ", saved.playerRoundScores) // playerroundscores teeofffrom null here
                           if (savedP) {
                               prs.backNineNetTotal  = savedP.backNineNetTotal;
                               prs.backNineTotal     = savedP.backNineTotal;
                               prs.frontNineNetTotal = savedP.frontNineNetTotal;
                               prs.frontNineTotal    = savedP.frontNineTotal;
                           }
                       });
                       scorecard.dirty          = false;
                       scorecard.backNineTotal  = saved.backNineTotal;
                       scorecard.frontNineTotal = saved.frontNineTotal;
                       scorecard.totalScore     = saved.totalScore;
                       return scorecard;
                   });
    }

    /**
     * Deletes the scorecard for a given normal game
     * @param roundId The ID of the round for which scores will be deleted
     * @param deleteAll Delete all the scores you have scored
     * @returns {Observable<R>}
     */
    public deleteNormalGameScorecard(roundId: number,
        deleteAll: boolean = false): Observable<boolean> {
        let request = new RemoteRequest(global.ServerUrls.deleteNormalGameScorecar,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, {
                roundId  : roundId,
                deleteAll: deleteAll
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let result: ServerResult = resp.json();
                       return result.success;
                   });
    }

    public syncCompetitionScorecard(scorecard: LeanScorecard|any, finishRound: boolean,
        compressed: boolean,
        playerId?: number): Observable<ServerResult> {
        let scorecardJson  = JSON.stringify(scorecard);
        let hdrs           = {};
        if (isPresent(playerId)) hdrs["Player-Id"] = playerId;
        let request     = new RemoteRequest(global.ServerUrls.competitionScorecardSync,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, {
                finishRound  : finishRound,
                scorecard    : scorecardJson,
                compressed: compressed
            }, hdrs);
        return this.http.execute(request)
                   .map((resp: Response) =>{
                        let result: ServerResult = resp.json();
                        return result;
                   });
    }
    /**
     * Saves the competition scorecard in the server. The competition scorecard
     * should directly call this method instead of
     * @param scorecard
     */
    public saveScorecard(scorecard: PlainScoreCard,
        finishRound: boolean, playerId?: number): Observable<PlainScoreCard> {

        scorecard.playerRoundScores.forEach((prs: PlayerRoundScores) => {
            prs.actualStartTime = null;
            prs.startTime       = null;
        });
        let playedOn       = scorecard.playedOn;
        scorecard.playedOn = null;
        let scorecardJson  = JSON.stringify(scorecard);
        scorecard.playedOn = playedOn;
        let hdrs           = {};
        if (isPresent(playerId)) hdrs["Player-Id"] = playerId;
        let request     = new RemoteRequest(global.ServerUrls.competitionScorecardUpdate,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, {
                competitionId: scorecard.competitionId,
                finishRound  : finishRound,
                scorecard    : scorecardJson
            }, hdrs);
        scorecard.dirty = false;
        if (finishRound) {

        }
        this.eventLogService.writeEvent("scorecard", "Saving scorecard",
            "Syncing scorecard with server");
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let saved: PlainScoreCard = resp.json();
                       //Now merge these two scorecards
                       ScorecardService.mergeScorecards(scorecard, saved,
                           this.session.playerId);
                       scorecard.dirty         = scorecard.dirty || false;
                       scorecard.flightChanged = saved.flightChanged;
                       this.eventLogService.writeEvent("scorecard", "Saved scorecard",
                           "Syncing scorecard with server completed.");
                       return scorecard;
                   }).catch((error) => {
                let defMsg = (!this.connService.isConnected())?
                             "Could not save scorecard. Your internet connection down"
                            :"myGolf2u server is unreachable. Could not save scorecard.";
                let msg = MessageDisplayUtil.getErrorMessage(error, defMsg);

                this.eventLogService.writeEvent("scorecard",
                    "Saving scorecard failed", msg, "error", JSON.stringify(error));
                throw error;
            });
    }

    /**
     * Transforms the scorecards and derives the full urls for images and derives the
     * date values from string
     * @param sc The PlainScoreCard instance
     */
    public static transform(sc: PlainScoreCard) {
        JsonService.deriveDates(sc, ["playedOn"]);
        if (sc.courses)
            sc.courses.forEach((ci: CourseInfo) => {
                JsonService.deriveFullUrl(ci, "photoUrl");
                ci.holes.forEach((h: CourseHoleInfo) => {
                    JsonService.deriveFullUrl(h, "holeImage");
                });
            });
        if (sc.playerRoundScores)
            sc.playerRoundScores.forEach((prs: PlayerRoundScores) => {
                JsonService.deriveFullUrl(prs, "photoUrl");
                JsonService.deriveFullUrl(prs, "thumbnail");
                // JsonService.deriveTime(prs, ["actualStartTime", "startTime"]);
            });
    }

    public static isAllScoresIn(scorecard: PlainScoreCard, scorerId: number): boolean {
        let emptyHoles = scorecard.playerRoundScores
                                  .filter(prs => prs.scoringPlayerId === scorerId)
                                  .map(prs => {
                                      let count = prs.scores.filter(s => !isPresent(s.actualScore) || s.actualScore === 0)
                                          .length;
                                      return count;
                                  }).reduce((a, b) => {
                return a + b
            }, 0);

        return emptyHoles === 0;
    }

    private createSearchRequest(searchText?: string,
        pageNo: number        = 1,
        scorecardType: string = "ALL"): RemoteRequest {
        let params = {
            pageNumber   : pageNo,
            scorecardType: scorecardType
        };
        if (isPresent(searchText)) params["searchText"] = searchText;
        if (isPresent(this.startDate)) {
            let str             = moment(this.startDate)
                .format("YYYY-MM-DD");
            params["startDate"] = str;
        }
        if (isPresent(this.endDate)) params["endDate"] = moment(this.endDate)
            .format("YYYY-MM-DD");

        if (this.searchCriteria.periodType != "CUSTOM") {
            params["startDate"] = "";
            params["endDate"]   = "";
        }

        params = JsonService.mergeObjects([params, this.searchCriteria]);
        console.log(params);
        return new RemoteRequest(global.ServerUrls.scorecardSearch,
            RequestMethod.Get,
            ContentType.URL_ENCODED_FORM_DATA,
            params);
    }

    // /**
    //  * Deletes the current scorecard
    //  * @private
    //  */
    // private _deleteCurrentScorecard(): Observable<any> {
    //     return this.pref.setPref(this._currScorecardKey());
    // }
}
