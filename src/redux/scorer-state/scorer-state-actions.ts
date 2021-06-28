import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Platform} from 'ionic-angular';
import {SessionInfo, SessionState} from '../../data/authentication-info';
import {CompetitionInfo} from '../../data/competition-data';
import {PlayerInfo} from '../../data/player-data';
import {PlainScorecard} from '../../data/scorecard';
import {ServerResult} from '../../data/server-result';
import {MessageDisplayUtil} from '../../message-display-utils';
import {CompetitionService} from '../../providers/competition-service/competition-service';
import {ConnectionService} from '../../providers/connection-service/connection-service';
import {DeviceService} from '../../providers/device-service/device-service';
import {EventLogService} from '../../providers/eventlog-service/eventlog-service';
import {PlayerService} from '../../providers/player-service/player-service';
import {ScorecardService} from '../../providers/scorecard-service/scorecard-service';
import {ScorecardStorageService} from '../../providers/scorecard-service/scorecard-storage-service';
import {AppState} from '../appstate';
import {createAction} from '../create-action';
import {DeviceDataService} from '../device';
import {CurrentScorecardActions} from '../scorecard/current-scorecard-actions';
import {SessionActions, SessionDataService} from '../session';
import {WebsocketActions} from '../wstomp';
import {
    BusyOrFree,
    ScorerStateDataService,
    ScoringStage,
    SelectedScorer,
    TOPIC_DEVICE_MANAGE,
    TOPIC_SCORER_SELECT,
    TeetimeBooking,
    SUBSCRIBE_TEETIME_BOOKING
} from './';
/**
 * Created by ashok on 15/05/17.
 */
@Injectable()
export class ScorerStateActions {
    public static REFRESH_TRIED       = 'REFRESH_SCORER_COMPETITIONS_TRIED';
    public static SET_USER_TYPE       = 'SET_SCORER_USER_TYPE';
    public static SELECT_SCORER       = 'SELECT_COMPETITION_SCORER';
    public static CLEAR_SCORER        = 'CLEAR_COMPETITION_SCORER';
    public static SET_COMPETITIONS    = 'SET_SCORER_COMPETITIONS';
    public static SET_ERROR           = 'SET_SCORER_ERROR';
    public static CLEAR_ERROR         = 'CLEAR_SCORER_ERROR';
    public static SET_SCORING_STAGE   = 'SET_SCORING_STAGE';
    public static SET_BUSY_OR_FREE    = 'SET_SCORER_BUSY_OR_FREE';
    public static SET_SCORING_DETAILS = 'SET_SCORING_DETAILS';
    public static RESET               = 'RESET_SCORER_STATE';
    public static SET_TEE_BOOKING     = 'SET_TEE_BOOKING';
    public static CLEAR_TEETIME_BOOKING = 'CLEAR_TEETIME_BOOKING';

    constructor(private store: Store<AppState>,
        private platform: Platform,
        private websocketActions: WebsocketActions,
        private playerService: PlayerService,
        private scorerStateService: ScorerStateDataService,
        private sessionService: SessionDataService,
        private sessionDataActions: SessionActions,
        private sessionActions: SessionActions,
        private scorecardActions: CurrentScorecardActions,
        private connService: ConnectionService,
        private scorecardService: ScorecardService,
        private deviceService: DeviceService,
        private deviceDataService: DeviceDataService,
        private competitionService: CompetitionService,
        private eventLogService: EventLogService,
        private scorecardStorageService: ScorecardStorageService) {
        this.platform.ready().then(()=>{
            this.websocketActions.subscribeTo(TOPIC_SCORER_SELECT)
                .subscribe((data: any) => {
                    this._selectScorer(data);
                });
            this.websocketActions.subscribeTo(TOPIC_DEVICE_MANAGE)
                .subscribe((data: any) => {
                    this._manageScorerDevice(data);
                });
                this.websocketActions.subscribeTo(SUBSCRIBE_TEETIME_BOOKING)
            .subscribe((data: any)=>{
                this.store.dispatch(createAction(ScorerStateActions.SET_TEE_BOOKING, data))
                console.log("subscribe teetime booking scorer : ", data)
            })
        });

    }

    public refreshCompetitions() {
        this.sessionService.getSession().take(1)
            .subscribe(session => {
                if (session.userType.toLowerCase() === 'club' || session.userType.toLowerCase() === 'caddy') {
                    this.clubLoggedIn(session);
                } else if (session.userType.toLowerCase() === 'organizer') {
                    this.organizerLoggedIn(session);
                }
            })
    }

    public clubLoggedIn(session: SessionInfo) {
        this.busy();
        if(1) return; //disable first
        this.competitionService.getActiveCompetitionsForClub(session.clubId)
            .subscribe((comps: CompetitionInfo[]) => {
                this.free();
                this.store.dispatch(createAction(ScorerStateActions.SET_COMPETITIONS, comps));
                this.checkWhetherScorerSelected(comps);
            }, (error) => {
                this.free();
                let msg = MessageDisplayUtil.getError(error, this.platform, this.connService,
                    'Server may be down.');
                msg     = 'Could not refresh active competitions for the club.' + msg;
                this.store.dispatch(createAction(ScorerStateActions.SET_ERROR, msg));
            });
    }
    public clearErrorState(){
        this.store.dispatch(createAction(ScorerStateActions.CLEAR_ERROR));
    }
    public organizerLoggedIn(session: SessionInfo) {
        this.busy();
        this.competitionService.getActiveCompetitionsForOrganizer(session.organizerId)
            .subscribe((comps: CompetitionInfo[]) => {
                this.free();
                this.store.dispatch(createAction(ScorerStateActions.SET_COMPETITIONS, comps));
                this.checkWhetherScorerSelected(comps);
            }, (error) => {
                this.free();
                let msg = MessageDisplayUtil.getError(error, this.platform, this.connService,
                    'Server may be down.');
                msg     = 'Could not refresh active competitions for the organizer.' + msg;
                this.store.dispatch(createAction(ScorerStateActions.SET_ERROR, msg));
            });
    }

    setScoringStage(scoringStage: ScoringStage) {
        this.store.dispatch(createAction(ScorerStateActions.SET_SCORING_STAGE, scoringStage));
    }

    public  busy() {
        this.store.dispatch(createAction(ScorerStateActions.SET_BUSY_OR_FREE, BusyOrFree.Busy));
    }

    public free() {
        this.store.dispatch(createAction(ScorerStateActions.SET_BUSY_OR_FREE, BusyOrFree.Free));
    }

    private checkWhetherScorerSelected(comps: CompetitionInfo[]) {
        this.scorerStateService.scorerState().take(1)
            .subscribe(scorerState => {
                if (scorerState.selectedScorer) {
                    //Now cross check with active competitions
                    let comp = comps.filter(c => c.competitionId === scorerState.selectedScorer.competitionId)
                                    .pop();
                    if (comp) {
                        if (scorerState.scoringPlayer && scorerState.scoringCompetition) {
                            this.scorecardActions.fetchCurrent(scorerState.selectedScorer.scorerId)
                                .subscribe(()=>{
                                    console.log('Fetched current scorecard');
                                });
                        } else if (scorerState.scoringCompetition) {
                            this.selectScorer(scorerState.scoringCompetition, scorerState.selectedScorer.roundNumber,
                                scorerState.selectedScorer.scorerId);
                        } else {
                            this.selectScorerForComp(scorerState.selectedScorer.competitionId,
                                scorerState.selectedScorer.roundNumber, scorerState.selectedScorer.scorerId);
                        }
                    }
                    else {
                        //Scoring is selected. But the competition is different. So ignore it
                        this.store.dispatch(createAction(ScorerStateActions.CLEAR_SCORER));
                        if(comps.length === 1)
                            this.setScoringStage(ScoringStage.CompetitionSelected);
                    }
                }
                else if(comps && comps.length === 1){
                    this.setScoringStage(ScoringStage.CompetitionSelected);
                }
            })
    }

    public selectScorerForComp(compId: number, roundNumber: number, scorerId: number) {
        this.busy();
        this.competitionService.getCompetitionInfo(compId)
            .subscribe((comp: CompetitionInfo) => {
                this.selectScorer(comp, roundNumber, scorerId);
            }, (error) => {
                this.free();
                this.processError(error, 'Error getting competition information', 'Server may be down');
            })
    }

    /**
     * Selects the scorer for a given competition
     * @param competitionId
     * @param roundNumber
     * @param scorerId
     */
    public selectScorer(comp: CompetitionInfo, roundNumber: number, scorerId: number) {
        this.busy();
        let scorerSelected: SelectedScorer = {
            competitionId: comp.competitionId,
            roundNumber  : roundNumber,
            scorerId     : scorerId
        };
        this.playerService.getPlayerInfo(scorerId)
            .subscribe((player: PlayerInfo) => {
                this.store.dispatch(createAction(ScorerStateActions.SET_SCORING_DETAILS, {
                    selectedScorer    : scorerSelected,
                    scoringPlayer     : player,
                    scoringCompetition: comp
                }));
                //Fetch the current scorecard for the player.
                //This will be relayed back with existing scorecard or empty scorecard
                this.scorecardActions.fetchCurrent(scorerId)
                    .subscribe((scorecard: PlainScorecard)=>{
                        console.log("Fetched current scorecard");
                    });
            }, (error) => {
                this.free();
                this.processError(error, 'Error getting player information.', 'Server may be down');
            });
    }

    /**
     * This method should be called after reading the scoreard from
     * cache if exists.
     * @param scFromCache
     */
    public checkCompetitionScorecard(scFromCache?: PlainScorecard) {
        this.scorerStateService.scorerState().take(1)
            .subscribe(state => {
                if (state.selectedScorer) {
                    this._processSelectedScorer(state.selectedScorer, scFromCache);
                }
                else {
                    this.free();
                }
            });
    }

    private _processSelectedScorer(scorer: SelectedScorer, scFromCache?: PlainScorecard) {
        this.competitionService.getOrCreateScorecard(scorer.competitionId, false, scorer.scorerId)
            .subscribe((scorecard: PlainScorecard) => {
                if (scorecard && !scorecard.scoringFinished) {
                    if (scFromCache) {
                        //Check whether scorecards have changed
                        let flightSame = ScorecardService.isFlightSame(scFromCache, scorecard, scorer.scorerId);
                        if (flightSame) {
                            ScorecardService.mergeScorecards(scFromCache, scorecard, scorer.scorerId);
                            scFromCache.editable = scorecard.editable;
                            scFromCache.lockedBy = scorecard.lockedBy;
                            scorecard = scFromCache;

                        }
                        else {
                            console.log("Flight changed in the server. Ignoring unsaved changes in cache and using scorecard from server");
                        }
                    }
                    else {
                        console.log("No scorecard exist in cache. Continuing with server scorecard");
                    }
                    this.free();
                    this.scorecardActions.setCurrentScorecard(scorecard, scorer.scorerId)
                        .then(() => {
                            //Set the scoring state to be ready
                            this.scorecardActions.setScoringPlayer(scorer.scorerId);
                            //Set the scoring player ID in session too
                            this.store.dispatch(createAction(SessionActions.SET_PLAYER_ID, scorer.scorerId));
                            this.store.dispatch(createAction(ScorerStateActions.SET_SCORING_STAGE, ScoringStage.Ready));
                        });
                }
                else {
                    this.free();
                    this.store.dispatch(createAction(ScorerStateActions.SET_ERROR, 'Scoring finished for this player'));
                }
            }, (error) => {
                this.free();
                this.processError(error, 'Error getting scorecard from the server', 'Server may be down')
            });
    }

    private processError(error, processError: string, primaryError: string) {
        let msg = MessageDisplayUtil.getError(error, this.platform, this.connService, primaryError);
        msg     = processError + ' ' + primaryError;
        this.store.dispatch(createAction(ScorerStateActions.SET_ERROR, msg));
    }

    private _selectScorer(data: any) {
        this.deviceDataService.getDeviceInfo()
            .take(1)
            // .takeWhile(deviceInfo => deviceInfo.deviceId === data.deviceId)
            .map(device => device.deviceId)
            .subscribe(deviceId => {
                //Here it is only if the deviceId matches the device id in the request
                this.sessionService.getSessionStatus()
                    .take(1)
                    .takeWhile(state => state !== SessionState.LoggedIn)
                    .subscribe(state => {
                        //The device is not logged in. Can continue
                        //Before triggering login. Set the scorer
                        if(deviceId === data.deviceId){
                            let selectedScorer: SelectedScorer = {
                                competitionId: data.competitionId,
                                roundNumber  : data.roundNumber,
                                scorerId     : data.scorerId
                            };
                            //First break the device lock
                            this.competitionService.breakAndAcquireDeviceLock(data.competitionId,
                                data.roundNumber, data.scorerId, data.flightNumber)
                                .subscribe((result: ServerResult)=> {
                                    this.store.dispatch(createAction(ScorerStateActions.SELECT_SCORER, selectedScorer));
                                    //Now trigger login. This should start chain reaction
                                    this.sessionActions.login(data.userId, data.password);
                                });

                        }

                    });
            });
    }

    private _manageScorerDevice(data: any) {
        this.deviceDataService.getDeviceInfo()
            .take(1)
            // .takeWhile(deviceInfo => deviceInfo.deviceId === data.deviceId)
            .map(device => device.deviceId)
            .subscribe(deviceId=> {
                if (data && data.deviceId === deviceId && data.operation) {
                    switch (data.operation.toLowerCase()) {
                        case 'logout':
                            this.store.dispatch(createAction(SessionActions.SET_PLAYER_ID));
                            this.competitionService.releaseDeviceLock(data.competitionId,
                             data.roundNo, data.scorerId)
                                .subscribe((result: boolean)=>{
                                    if(result) this.sessionActions.logout();
                                });
                            break;
                        case 'clearcache':
                            this.eventLogService.clearAllEvents();
                            this.scorecardStorageService.deleteAll();
                            break;
                        case 'identify':
                            alert('Identifying device ' + data.deviceId);
                            break;
                    }
                }
            });

    }

    public getClubSession(): any {
        this.sessionService.getSession().take(1)
            .subscribe(session => {
                console.log("getClubSession: ", session)
                if (session.userType.toLowerCase() === 'club' || session.userType.toLowerCase() === 'caddy') {
                    // this.clubLoggedIn(session);
                    
                    
                } else if (session.userType.toLowerCase() === 'organizer') {
                    // this.organizerLoggedIn(session);
                }
                return session.clubId;
            })
    }

    clearTeetimeBooking() {
        this.store.dispatch(createAction(ScorerStateActions.CLEAR_TEETIME_BOOKING));
    }
}
