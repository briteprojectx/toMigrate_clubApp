import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import *  as moment from 'moment';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
// import {PlainScoreCard} from '../../data/scorecard';
import {PlainScoreCard} from '../../data/mygolf.data';
import {ServerResult} from '../../data/server-result';
import {MessageDisplayUtil} from '../../message-display-utils';
import {CompetitionService} from '../../providers/competition-service/competition-service';
import {ConnectionService} from '../../providers/connection-service/connection-service';
import {EventLogService} from '../../providers/eventlog-service/eventlog-service';
import {ScorecardService} from '../../providers/scorecard-service/scorecard-service';
import {ScorecardStorageService} from '../../providers/scorecard-service/scorecard-storage-service';
import {MyGolfStorageService} from '../../storage/mygolf-storage.service';
import {AppState} from '../appstate';
import {createAction} from '../create-action';
import {DeviceDataService} from '../device/device-data-service';
import {SessionDataService} from '../session/session-data-service';
import {SUBSCRIBE_COMP_SCORE_SYNCED} from '../wstomp';
import {WebsocketActions} from '../wstomp/websocket-actions';
import {SUBSCRIBE_DEVICE_LOCK_BROKEN, SUBSCRIBE_FLIGHT_CHANGE, SUBSCRIBE_TEETIME_BOOKING} from '../wstomp/websocket-destinations';
import {CurrentScorecard} from './current-scorecard';
import {CurrentScorecardDataService} from './current-scorecard-data-service';
import {getLeanScorecard, mergeFromLeanScorecard, unzipScorecard, zipScorecard} from './scorecard-functions';
import {SessionActions} from '../session/session-actions';
import {App} from 'ionic-angular';
import {ScorecardDisplayPage} from '../../pages/scorecard-display/scorecard-display';
/**
 * Created by ashok on 11/05/17.
 */
@Injectable()
export class CurrentScorecardActions {
    public static FETCHED_CURRENT_SCORECARD = 'CURRENT_SCORECARD_FETCHED';
    public static NO_CURRENT_SCORECARD = 'NO_CURRENT_SCORECARD';
    public static SET_CURRENT_SCORECARD = 'SET_CURRENT_SCORECARD';
    public static CLEAR_CURRENT_SCORECARD = 'CLEAR_CURRENT_SCORECARD';
    public static NORMAL_GAME_SCORECARD = 'NORMAL_GAME_SCORECARD_FOUND';
    public static COMPETITION_SCORECARD = 'COMPETITION_SCORECARD';
    public static CURRENT_GAME_FINISHED = 'CURRENT_GAME_FINISHED';
    public static SET_SCORER_ID = 'SET_CURRENT_SCORECARD_SCORER_ID';
    public static SCORECARD_DIRTY = 'CURRENT_SCORECARD_DIRTY';
    public static SCORECARD_CURRENT_HOLE = 'CURRENT_SCORECARD_CURRENT_HOLE';
    public static SCORECARD_RELOADED = 'CURRENT_SCORECARD_RELOADED';
    public static CLEAR_RELOADED_FLAG = 'CLEAR_CURRENT_SCORECARD_RELOAD_FLAG';
    private scorecardQueue: ReplaySubject<any>;

    scorecardDisplay: ScorecardDisplayPage;

    constructor(private store: Store<AppState>,
        private storage: MyGolfStorageService,
        private connService: ConnectionService,
        private eventLogService: EventLogService,
        private websocketActions: WebsocketActions,
        private sessionActions: SessionActions,
        private currScorecardService: CurrentScorecardDataService,
        private sessionService: SessionDataService,
        private competitionService: CompetitionService,
        private scorecardStorageService: ScorecardStorageService,
        private deviceService: DeviceDataService,
        private scorecardService: ScorecardService) {
        this.scorecardQueue = new  ReplaySubject(1);

        this.scorecardQueue.map(data=> {
            if(connService.isConnected())
                return data;
            else throw "No connection";
        }).retryWhen(errors=>{
            console.log("No network connection. Trying after a second");
            return errors.delay(1000);
        }).subscribe(data=> {
            let zipped: any = zipScorecard(data.scorecard);
            this.scorecardService.syncCompetitionScorecard(zipped, false, true, data.playerId)
                .subscribe((result: ServerResult)=>{
                    console.log("Scorecard saved");
                },(error)=>{
                    let defMsg = (!this.connService.isConnected())?
                                 "Could not save scorecard. Your internet connection down"
                        :"myGolf2u server is unreachable. Could not save scorecard.";
                    let msg = MessageDisplayUtil.getErrorMessage(error, defMsg);
                    this.eventLogService.writeEvent("scorecard",
                        "Saving scorecard failed", msg, "error", JSON.stringify(error));
                })
        });

        this.websocketActions.subscribeTo(SUBSCRIBE_COMP_SCORE_SYNCED)
            .subscribe((data: any)=> {
                this._scoresFromOtherSync(data);
            });
        this.websocketActions.subscribeTo(SUBSCRIBE_FLIGHT_CHANGE)
            .subscribe((data: any)=>{
                this._flightChanged(data);
            });
        this.websocketActions.subscribeTo(SUBSCRIBE_DEVICE_LOCK_BROKEN)
            .subscribe((data: any)=>{
                this._deviceLockBroken(data);
            });
        this.websocketActions.subscribeTo(SUBSCRIBE_TEETIME_BOOKING)
            .subscribe((data: any)=>{
                console.log("subscribe teetime booking : ", data)
            })
    }

    /**
     * Fetch the current scorecard for the current player from the storage and sets in the store
     * @param playerId
     */
    public fetchCurrent(playerId: number): Observable<PlainScoreCard> {
        let key = this._currScorecardKey(playerId);
        return this.storage.getPreference(key)
            .map((scorecard: PlainScoreCard)=>{
                if(!scorecard){
                    console.log("No stored scorecard found.")
                    this.store.dispatch(createAction(CurrentScorecardActions.NO_CURRENT_SCORECARD));
                }
                else {
                    // if (typeof scorecard.playedOn === "string") {
                    //     scorecard.playedOn = moment(scorecard.playedOn).toDate();
                    // } **** 2020-01-29
                    if(scorecard.finished){
                        this.storage.removePreference(key)
                            .then(()=>{
                                this.store.dispatch(createAction(CurrentScorecardActions.CLEAR_CURRENT_SCORECARD));
                            });
                    }
                    else {
                        this.store.dispatch(createAction(CurrentScorecardActions.FETCHED_CURRENT_SCORECARD,
                            scorecard));
                        if(scorecard.competition)
                            this.store.dispatch(createAction(CurrentScorecardActions.COMPETITION_SCORECARD, scorecard));
                        else
                            this.store.dispatch(createAction(CurrentScorecardActions.NORMAL_GAME_SCORECARD, scorecard));
                    }
                }
                return scorecard;
            });


    }
    startNewNormalGame(scorecard: PlainScoreCard, playerId: number): Promise<boolean> {
        return this.storage.preference(this._currScorecardKey(playerId), scorecard)
            .then(()=>{
                this.store.dispatch(createAction(CurrentScorecardActions.SET_CURRENT_SCORECARD, scorecard));
                return true;
            });
    }

    setScoringPlayer(playerId: number) {
        this.store.dispatch(createAction(CurrentScorecardActions.SET_SCORER_ID, playerId));
    }

    /**
     * Reload the current scorecard
     * @param breakLock
     * @returns {Observable<R>}
     */
    public reloadCurrentScorecard(breakLock: boolean, reloadReason?: string): Observable<boolean> {
        return this.currScorecardService.getCurrentScorecard()
            .take(1)
            .switchMap(currScorecard=>{
                let compId = currScorecard.scorecard.competitionId;
                return this.competitionService.getOrCreateScorecard(compId, breakLock,
                        currScorecard.scoringPlayer)
                    .map((scorecard: PlainScoreCard)=> {
                        this.store.dispatch(createAction(CurrentScorecardActions.SCORECARD_RELOADED,
                            reloadReason));
                        this.setCurrentScorecard(scorecard, currScorecard.scoringPlayer);
                        if(this.scorecardDisplay && this.scorecardDisplay.fromScoringPage){
                            this.scorecardDisplay._scorecardReloaded(scorecard);
                        }
                        // let activeNav = this.app.getActiveNav();
                        // let page = activeNav.getActive()._cmp.instance;
                        // if(page instanceof ScorecardDisplayPage && page['fromScoringPage']) {
                        //     page['_scorecardReloaded'](scorecard);
                        // }
                        return true;
                    })
            });
    }
    public  clearReloadFlag(){
        this.store.dispatch(createAction(CurrentScorecardActions.CLEAR_RELOADED_FLAG));
    }
    /**
     * Saves the current scorecard. This must be only called for current scorecard.
     * Not for saving edited scorecards
     * @param scorecard The scorecard to save
     * @param playerId The ID of the player who is scoring
     * @param localOnly specifies whether to only local scorecard
     */
    public saveCurrentScorecard(scorecard: PlainScoreCard, playerId: number, localOnly?: boolean) {
        let key = this._currScorecardKey(playerId);
        this.scorecardStorageService.saveCompetitionScorecard(scorecard, playerId);
        this.storage.preference(key, scorecard).then(()=>{
            if(scorecard.competition && !localOnly) {
                //Derive the Leanscorecard to save
                let leanScorecard = getLeanScorecard(scorecard, playerId);
                this.scorecardQueue.next({
                    scorecard: leanScorecard,
                    playerId: playerId
                });
            }
        })
    }
    cancelGame(playerId: number): Promise<boolean> {
        return this.storage.removePreference((this._currScorecardKey(playerId)))
            .then(()=>{
                this.store.dispatch(createAction(CurrentScorecardActions.CLEAR_CURRENT_SCORECARD));
                return true;
            })
    }
    public finishCurrentGame(scorecard: PlainScoreCard, playerId: number): Observable<PlainScoreCard> {
        return this.scorecardService.finsihGame(scorecard)
            .switchMap((saved: PlainScoreCard)=> {
                return Observable.fromPromise(this.cancelGame(playerId).then(()=>{
                    return saved;
                }));
            });
    }
    /**
     * This must be called after the current game is finished.
     * This will remove the store current scorecard for the player and clears the scorecard
     */
    public currentGameFinished(playerId: number) {
        let key = this._currScorecardKey(playerId);
        this.storage.removePreference(key)
            .then(()=>{
                this.store.dispatch(createAction(CurrentScorecardActions.CLEAR_CURRENT_SCORECARD));
            })
    }
    public setCurrentScorecard(scorecard: PlainScoreCard, playerId: number): Promise<boolean> {
        return this.storage.preference(this._currScorecardKey(playerId), scorecard)
            .then(()=>{
                this.store.dispatch(createAction(CurrentScorecardActions.SET_CURRENT_SCORECARD, scorecard));
                return true;
            });
    }
    /**
     * Merge the current scorecard with current scorecard
     * @param scorecard The scores from this scorecards are merged with
     * current scorecard
     * @param playerId The ID of the scoring player
     */
    public mergeToCurrent(scorecard: PlainScoreCard, playerId: number) {
        this.store.select(appState=>appState.currentScorecard)
            .take(1)
            .subscribe((currScorecard: CurrentScorecard)=>{
                ScorecardService.mergeScorecards(currScorecard.scorecard, scorecard, playerId);
                this.store.dispatch(createAction(CurrentScorecardActions.SET_CURRENT_SCORECARD,
                    currScorecard.scorecard));
            });
    }

    private _currScorecardKey(playerId: number): string {
        return `CurrentScorecard.${playerId}`;
    }

    private _scoresFromOtherSync(data: any) {
        let compId = data.competitionId;
        let round = data.roundNumber;
        let flight = data.flightNumber;
        let leanScorecard = data.scorecard;
        if(typeof leanScorecard === 'string')
            leanScorecard = JSON.parse(leanScorecard);
        leanScorecard = unzipScorecard(leanScorecard);
        let scorerId = data.scorerId;
        this.currScorecardService.getCurrentScorecard()
            .take(1)
            .subscribe((currScorecard: CurrentScorecard)=> {
                let scorecard = currScorecard.scorecard;
                if(scorecard && scorecard.competitionId === compId
                    && scorecard.roundNumber === round
                    && scorecard.flightNumber === flight
                    && scorerId !== currScorecard.scoringPlayer){
                    scorecard = mergeFromLeanScorecard(scorecard, leanScorecard, true,
                        currScorecard.scoringPlayer);
                    this.setCurrentScorecard(scorecard, currScorecard.scoringPlayer);
                }
            });
    }
    private _flightChanged(data: any) {
        let compId = data.competitionId;
        let round = data.roundNumber;
        let players: number[] = data.playerIds;
        this.currScorecardService.getCurrentScorecard().take(1)
            .subscribe((curr: CurrentScorecard)=>{
                if(curr.scorecard &&
                    compId === curr.scorecard.competitionId
                    && round === curr.scorecard.roundNumber
                    && players.indexOf(curr.scoringPlayer) >= 0){
                    //Check whether the scorer himself withdrawn
                    this.competitionService.isPlayerWithdrawn(curr.scorecard.competitionId,
                        curr.scoringPlayer)
                        .subscribe((withdrawn: boolean)=>{
                            if(withdrawn){
                                this.competitionService.releaseDeviceLock(curr.scorecard.competitionId,
                                    curr.scorecard.roundNumber, curr.scoringPlayer)
                                    .subscribe((result)=>{
                                        this.reloadCurrentScorecard(false, 'Player withdrawn')
                                            .subscribe((reloaded: boolean)=>{
                                                console.log("Reloaded", reloaded);
                                            });
                                        // this.playerHomeActions.setState("")
                                        // this.sessionActions.logout();
                                        // this.sessionService.
                                    });
                            }
                            else {
                                //Yes, My flight changed. Need to reload the scorecard
                                this.reloadCurrentScorecard(false, 'Flight information changed')
                                    .subscribe((reloaded: boolean)=>{
                                        console.log("Reloaded", reloaded);
                                    });
                            }
                        })


                }
            })
    }
    private _deviceLockBroken(data: any) {
        let compId = data.competitionId;
        let round = data.roundNumber;
        let scorerId = data.scorerId;
        let prevDevice = data.previousDeviceId;
        let currDevice = data.currentDeviceId;
        this.currScorecardService.getCurrentScorecard().take(1)
            .takeWhile(curr=>curr.scorecard && curr.scorecard.competition)
            .subscribe((curr: CurrentScorecard)=>{
                let currScorer = curr.scoringPlayer;
                let scorecard = curr.scorecard;
                if(scorecard.competitionId === compId && scorecard.roundNumber === round
                    && scorerId === currScorer){
                    this.deviceService.getDeviceId().take(1)
                        .subscribe(deviceId=>{
                            if(prevDevice === deviceId && currDevice !== deviceId){
                                this.reloadCurrentScorecard(false,
                                    'You started scoring in another device').subscribe((reloaded: boolean)=>{
                                    console.log("Reloaded");
                                });
                            }
                        })
                }

            });
    }
}