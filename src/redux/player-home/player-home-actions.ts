import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Platform} from 'ionic-angular';
import {PlayerHomeInfo, } from '../../data/player-data';
import {MessageDisplayUtil} from '../../message-display-utils';
import {ConnectionService} from '../../providers/connection-service/connection-service';
import {PlayerService} from '../../providers/player-service/player-service';
import {AppState} from '../appstate';
import {createAction} from '../create-action';
import {CurrentScorecardActions} from '../scorecard/current-scorecard-actions';
import {CurrentScorecardDataService} from '../scorecard/current-scorecard-data-service';
// import {PlainScorecard} from '../../data/scorecard';
import {PlayerHomeData} from './player-home-data';
import {CompetitionInfo} from '../../data/competition-data';
import * as moment from 'moment';
import {ServerResult} from '../../data/server-result';
import {Observable} from 'rxjs/Observable';
import {UploadResult} from '../../data/fileupload-result';
import {JsonService} from '../../json-util';
import {CompetitionService} from '../../providers/competition-service/competition-service';
import {CurrentScorecard} from '../scorecard/current-scorecard';
import {SessionDataService} from '../session/session-data-service';
import {SessionState, SessionInfo} from '../../data/authentication-info';
import { ClubFlightService } from '../../providers/club-flight-service/club-flight-service';
import { SessionActions } from '../session';
import {PlayerInfo, PlainScoreCard} from '../../data/mygolf.data'
import { PlayerHomeDataService } from './player-home-data-service';
import { WebsocketActions, SUBSCRIBE_TEETIME_BOOKING } from '../wstomp';
/**
 * Created by ashok on 11/05/17.
 */

@Injectable()
export class PlayerHomeActions {
    public static REFRESH_HOME = 'REFRESH_PLAYER_HOME';
    public static SET_NEED_REFRSH = 'SET_NEED_REFRESH';
    public static REFRESH_HOME_SUCCESS = 'REFRESH_HOME_SUCESS';
    public static REFRESH_HOME_FAILED = 'REFRESH_HOME_FAILED';
    public static CHECK_SCORECARD = 'PLAYER_HOME_CHECKSCORECARD';
    public static SELECT_COMPETITION_FOR_SCORING = 'SELECT_COMPETITION_FOR_SCORING';
    public static SET_SELECTED_COMPETITION = 'SET_SELECTED_COMPETITION';
    public static RESET_STATE = 'RESET_HOME_STATE';
    public static SET_HOME_STATE= 'SET_PLAYER_HOME_STATE';
    public static SET_PLAYER_INFO = 'SET_PLAYER_INFO';
    public static UPDATE_PLAYER_PROFILE = 'UPDATE_PLAYER_PROFILE';
    public static UPDATE_PLAYER_PHOTO = 'UPDATE_PLAYER_PHOTO';

    constructor(private store: Store<AppState>,
        private platform: Platform,
        private connService: ConnectionService,
        private currScorecardActions: CurrentScorecardActions,
        private currScorecardService: CurrentScorecardDataService,
        private sessionService: SessionDataService,
        private playerService: PlayerService,
        private competitionService: CompetitionService,
        private flightService: ClubFlightService,
        private sessionActions: SessionActions,
        private websocketActions: WebsocketActions){}

    public refreshForcefully(){
        this.store.dispatch(createAction(PlayerHomeActions.SET_NEED_REFRSH, true));
        // setTimeout(() => {
        //     // this.store.dispatch(createAction(PlayerHomeActions.REFRESH_HOME_SUCCESS, true))
        //     this.setState("")
        //   }, 5000)
        this.refreshHomeInfo();
    }
    public refreshHomeInfo() {
        //first send refresh home
        
        this.websocketActions.subscribeTo(SUBSCRIBE_TEETIME_BOOKING)
            .subscribe((data: any)=>{
                console.log("subscribe teetime booking : ", data)
            })
        this.sessionService.getSessionStatus().take(1)
            .subscribe((state: SessionState)=>{
                switch(state) {
                    case SessionState.LoggedIn:
                        this.store.select(appState=>appState.playerHomeData.needToRefresh)
                            .distinctUntilChanged()
                            .take(1)
                            .filter(needRefresh=>needRefresh)
                            .subscribe(needToRefresh=>{
                                this.store.dispatch(createAction(PlayerHomeActions.REFRESH_HOME));
                                this.playerService.getHomeInfo()
                                    .subscribe((playerHomeInfo: PlayerHomeInfo)=>{
                                        if(playerHomeInfo && playerHomeInfo.compsActiveToday) {
                                            if(playerHomeInfo.compsActiveToday.length > 1) {
                                                playerHomeInfo.compsActiveToday = playerHomeInfo.compsActiveToday.reverse();
                                            }
                                        }
                                        this.store.dispatch(createAction(PlayerHomeActions.REFRESH_HOME_SUCCESS,
                                            playerHomeInfo));
                                        this.setNeedRefresh(false);
                                        this.fetchCurrentScorecard(playerHomeInfo)
                                            .subscribe((scorecard: PlainScoreCard)=>{
                                                console.log("fetch current scorecard : ", scorecard)
                                                if(!scorecard) this.setState("");
                                                if(scorecard) this.checkCompetitionScoring(scorecard);
                                                setTimeout(()=>{
                                                    this.setState("");
                                                },5000)
                                            },(error)=>{
                                                this.setState("");
                                            }, ()=>{
                                                this.setState("");
                                            });

                                    },(error)=>{
                                        let msg = MessageDisplayUtil
                                            .getError(error, this.platform, this.connService, 'Server may be down.');
                                        msg = 'Error refreshing home information. ' + msg;
                                        this.store.dispatch(createAction(PlayerHomeActions.REFRESH_HOME_FAILED, msg));
                                        if(error.status === 403) {
                                            this.sessionService.getSession()
                                                .take(1)
                                                .subscribe((session: SessionInfo)=> {
                                                    if(session && session.password) {
                                                        this.sessionActions.login(session.userName, session.password);
                                                    } else if (session && !session.password) {
                                                        this.sessionActions.logout();
                                                    }
                                                });
                                        }
                                    });
                            });
                        break;
                }
            });

    }
    public setPlayerInfo(fieldName: string, value: any ) {
        this.store.dispatch(createAction(PlayerHomeActions.SET_PLAYER_INFO, {
            field: fieldName,
            value: value
        }));
    }
    public updatePlayerProfile(player: PlayerInfo, updatingFriendProfile:boolean=false): Observable<boolean> {
        console.log("[teebox] player home action calling playre service : ", player)
        return this.playerService.updatePlayerProfile(player.email,
            player.firstName, player.lastName, player.gender,
            player.teeOffFrom, player.handicap, player.phone,
            moment(player.birthdate,).format("YYYY-MM-DD"), player.playerId, player.countryId, player.nationalityId, player.password,
            player.defaultHandicapSystem)
            .map((result: ServerResult)=>{
                if(result.success){
                    player.playerName = player.firstName + ((player.lastName)?(' ' + player.lastName):'');
                    if(!updatingFriendProfile){
                        this.store.dispatch(createAction(PlayerHomeActions.UPDATE_PLAYER_PROFILE, player));
                        this.setNeedRefresh(true);
                    }
                }
                return result.success;
            });
    }

    /**
     * Update the player photo
     * @param imageURL The ULR of the image to upload
     * @param contentType The mime type of the image
     * @param playerId The id of the player.
     * @param friend Specifies whether friend's photo is updated
     * @returns {Observable<R>}
     */
    public updatePlayerPhoto(imageURL: string,
        contentType: string, playerId: number, friend: boolean=false): Observable<PlayerInfo> {
        return this.playerService.updatePlayerPhoto(imageURL, contentType, playerId)
            .map((uploadResult: UploadResult)=>{
                let playerInfo: PlayerInfo;
                let errMsg: PlayerInfo;
                console.log("[photo] updatePlayerPhoto actions ", uploadResult);
                console.log("[photo] playerInfo ", playerInfo)
                playerInfo = JSON.parse(JSON.stringify(uploadResult.message));
                // errMsg = JSON.parse(JSON.stringify(uploadResult.message));
                // playerInfo.errorMessage = errMsg.errorMessage;
                // playerInfo.errorMessage = JSON.parse(JSON.stringify(uploadResult.message));
                console.log("[photo] playerInfo | after ", playerInfo)
                JsonService.deriveFullUrl(playerInfo, "photoUrl");
                JsonService.deriveFullUrl(playerInfo, "thumbnail");
                if(!friend) {
                    //The upload result message is player info
                    this.store.dispatch(createAction(PlayerHomeActions.UPDATE_PLAYER_PROFILE, playerInfo));
                }
                return playerInfo;
            });
    }
    public uploadPlayerCardDiscount(imageURL: string,
        contentType: string, playerDiscountProgramId: number): Observable<any> {
            let _authToken;
            this.sessionService.getAuthToken()
            .subscribe((data)=>{
                _authToken = data;
            });
        return this.flightService.updatePlayerCardDocument(imageURL, contentType, playerDiscountProgramId, _authToken)
            .map((uploadResult: UploadResult)=>{
                let data: any;
                data = JSON.parse(JSON.stringify(uploadResult.message));
                // let playerInfo: PlayerInfo;
                // let errMsg: PlayerInfo;
                // console.log("[photo] updatePlayerPhoto actions ", uploadResult);
                // console.log("[photo] playerInfo ", playerInfo)
                // playerInfo = JSON.parse(JSON.stringify(uploadResult.message));
                // // errMsg = JSON.parse(JSON.stringify(uploadResult.message));
                // // playerInfo.errorMessage = errMsg.errorMessage;
                // // playerInfo.errorMessage = JSON.parse(JSON.stringify(uploadResult.message));
                // console.log("[photo] playerInfo | after ", playerInfo)
                // JsonService.deriveFullUrl(playerInfo, "photoUrl");
                // JsonService.deriveFullUrl(playerInfo, "thumbnail");
                return data;
            });
    }

    public addPlayerType(imageURL: string,
        contentType: string, playerId: number, bookingPlayerType: string): Observable<any> {
            let _authToken;
            this.sessionService.getAuthToken()
            .subscribe((data)=>{
                // console.log("add player type sesesion : ", data)
                _authToken = data;
            });
        return this.flightService.addPlayerType(imageURL, contentType, playerId, bookingPlayerType, _authToken)
            .map((uploadResult: UploadResult)=>{
                let data: any;
                data = JSON.parse(JSON.stringify(uploadResult.message));
                return data;
            });
    }

    public setNeedRefresh(needRefresh: boolean) {
        this.store.dispatch(createAction(PlayerHomeActions.SET_NEED_REFRSH, needRefresh));
    }
    public setState(state: string) {
        this.store.dispatch(createAction(PlayerHomeActions.SET_HOME_STATE, state));
    }
    public selectCompetionForScoring(compId: number) {
        this.store.dispatch(createAction(PlayerHomeActions.SELECT_COMPETITION_FOR_SCORING, compId));
        this.setNeedRefresh(true);
    }
    public fetchCurrentScorecard (playerHomeInfo: PlayerHomeInfo): Observable<PlainScoreCard> {
        //Check the current scorecard
        this.setState('Checking scorecard...');
        // setTimeout(()=>{
        //     this.setState("");
        // }, 5000);
        // this.currScorecardActions.fetchCurrent(playerHomeInfo.playerId).subscribe((data)=>{
            this.setState("");
        //     return data
        // }, (error)=>{
        //     // return error
        // }, ()=>{
        //     // return data
        // })
        return this.currScorecardActions.fetchCurrent(playerHomeInfo.playerId);
    }


    public checkScorecard(scorecard: PlainScoreCard) {
        if(scorecard.competition){
            this.checkCompetitionScoring(scorecard);
        }
        else {
            //Normal game scorecard found. Reset state
            this.store.dispatch(createAction(PlayerHomeActions.RESET_STATE));

        }
    }

    public checkCompetitionScoring(scorecard?: PlainScoreCard) {
        this.store.select(appState=>appState.playerHomeData)
            .filter(Boolean)
            .take(1) //very important
            .subscribe((playerHomeData: PlayerHomeData)=>{
                this._checkCompScoring(playerHomeData, scorecard);
            });
    }



    private _checkCompScoring(playerHomeData: PlayerHomeData, scorecard: PlainScoreCard) {
        let activeComps: CompetitionInfo[] = playerHomeData.playerHome.compsActiveToday;
        if(activeComps && activeComps.length){
            if(activeComps.length > 1) {
                //check whether the competition is already selected
                let compSelected = null;
                if(playerHomeData.competitionSelectedForScoring){
                    compSelected = playerHomeData.playerHome.compsActiveToday
                        .filter(comp=>comp.competitionId === playerHomeData.competitionSelectedForScoring)
                        .pop();
                }
                if(compSelected)
                    this._prepareCompetitionScoring(compSelected,
                        playerHomeData.playerHome.player.playerId,
                        scorecard);
                this.setState("");
            }
            else {//Only one competition active. Select that and continue
                //Check whether normal game is on
                // this.currScorecardService.normalGameScoring().take(1)
                //     .subscribe((normalGameOn: boolean)=>{
                //         if(!normalGameOn)
                //             this._prepareCompetitionScoring(activeComps[0], playerHomeData.playerHome.player.playerId);
                //     });

            }
        }
        else {
            //Reset the home state
            // this.currScorecardActions.cancelGame(playerHomeData.playerHome.player.playerId);
            this.store.dispatch(createAction(PlayerHomeActions.RESET_STATE));
            if(scorecard && scorecard.competition){
                //Clear the current scorecard
                this.currScorecardActions.currentGameFinished(playerHomeData.playerHome.playerId);
            }
            else {
                this.currScorecardService.getCurrentScorecard().take(1)
                    .subscribe((curr:CurrentScorecard)=>{
                        if(curr.scorecard && curr.scorecard.competition){
                            //Clear the current scorecard
                            this.currScorecardActions.currentGameFinished(playerHomeData.playerHome.playerId);
                        }
                    })
            }
        }
    }

    private _prepareCompetitionScoring(comp: CompetitionInfo,playerId: number,
            scorecard?: PlainScoreCard){
        if(!scorecard){
            //fetch the scorecard for the competition
            this.competitionService.getOrCreateScorecard(comp.competitionId,false, playerId)
                .subscribe((scorecard: PlainScoreCard)=>{
                    this.currScorecardActions.setCurrentScorecard(scorecard, playerId);
                    this.store.dispatch(createAction(PlayerHomeActions.SET_SELECTED_COMPETITION, {
                        competitionName: scorecard.competitionName,
                        startingHole: scorecard.startingHole,
                        startTime: scorecard.startTime
                    }));
                    this.setState("");
                });
        }
        else {
            this.setState("");
        }
    }

    public getCompetitionScoring(comp, playerId : number, loader?) {
        // this.setState("Getting Scorecard...")
        this.competitionService.getOrCreateScorecard(comp,true, playerId)
                .subscribe((scorecard: PlainScoreCard)=>{
                    console.log("get competition scorecard : ", scorecard, comp, playerId)
                    this.currScorecardActions.setCurrentScorecard(scorecard, playerId);
                    this.store.dispatch(createAction(PlayerHomeActions.SET_SELECTED_COMPETITION, {
                        competitionName: scorecard.competitionName,
                        startingHole: scorecard.startingHole,
                        startTime: scorecard.startTime
                    }));
                    
                    // if(scorecard && loader) loader.dismiss();
                    this.setState("");
                }, (error)=>{
                    if(loader) loader.dismiss();
                }, ()=>{
                    // if(loader) loader.dismiss();
                });
    }

    public clearState() {
        this.setState("");
    }
    
    // private selectCompetitionForScoring(competitionId: number) {
    //     this.store.dispatch(createAction(PlayerHomeActions.SELECT_COMPETITION_FOR_SCORING, competitionId));
    // }
}