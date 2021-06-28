import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {Toast} from '@ionic-native/toast';
import {
    ActionSheetController,
    AlertController,
    Events,
    LoadingController,
    ModalController,
    NavController,
    NavParams,
    Platform,
    Slides,
    ToastController
} from 'ionic-angular';
import {isPresent} from 'ionic-angular/util/util';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {AuthenticationService} from '../../authentication-service';
import {SessionState} from '../../data/authentication-info';
// import {CourseHoleInfo, CourseInfo} from '../../data/club-course';
import {CompetitionInfo, FlightInfo, FlightMember, CompetitionDetails} from '../../data/competition-data';
import {DeviceInfo} from '../../data/device-info';
import {PlayerInfo} from '../../data/player-data';
// import {PlainScorecard, PlayerRoundScores, PlayerScore} from '../../data/scorecard';
import * as global from '../../globals';
import {TranslationService} from '../../i18n/translation-service';
import {MessageDisplayUtil} from '../../message-display-utils';
import * as GolfEvents from '../../mygolf-events';
import {CompetitionService} from '../../providers/competition-service/competition-service';
import {ConnectionService} from '../../providers/connection-service/connection-service';
import {DeviceService} from '../../providers/device-service/device-service';
import {EventLogService} from '../../providers/eventlog-service/eventlog-service';
import {NormalgameService} from '../../providers/normalgame-service/normalgame-service';
import {
    AbstractNotificationHandlerPage,
    MygolfToastOptions,
    NotificationHandlerInfo
} from '../../providers/pushnotification-service/notification-handler-constructs';
import {ScorecardService} from '../../providers/scorecard-service/scorecard-service';
import {CurrentScorecardActions} from '../../redux/scorecard/current-scorecard-actions';
import {CurrentScorecardDataService} from '../../redux/scorecard/current-scorecard-data-service';
import {SessionActions} from '../../redux/session/session-actions';
import {SessionDataService} from '../../redux/session/session-data-service';
import {WebsocketActions} from '../../redux/wstomp/websocket-actions';
import {MyGolfStorageService} from '../../storage/mygolf-storage.service';
import {VolatileStorage} from '../../storage/volatile-storage';
import {LeaderboardPage} from '../competition/competition-leaderboard/competition-leaderboard';
import {EventLogListPage} from '../event-log/eventlog-list';
import {ChangeCoursePage} from '../normalgame/change-course/change-course';
import {ProfilePage} from '../profile/profile';
import {ScorecardDisplayPage} from '../scorecard-display/scorecard-display';
import {GameScoringExpandImage} from './gamescoring-expand-image';
import {GotoHoleModal} from './goto-hole-modal';
import {HoleGoogleMapPage} from './hole-googlemap';
import {ScorecardSaver} from './scorecard-saver';
// import {AdService} from '../../providers/ad-service/ad-service';
// import {Advertisement} from '../../data/advertisement';
// import {AdvertisementComponent} from '../../custom/advertisement-component';
// import {AdhandlerComponent} from '../../custom/adhandler-component';
import {ServerInfoDataService} from '../../redux/server/serverinfo-data-service';
import { TeeBoxPage } from '../modal-screens/tee-box/tee-box';
import { TeeBox } from '../../data/tee-box';
import {Keyboard} from '@ionic-native/keyboard';
import { EditTeeoffPage } from '../modal-screens/edit-teeoff/edit-teeoff';
import { HandicapService } from '../../providers/handicap-service/handicap-service';
import { ClubService } from '../../providers/club-service/club-service';
import { CourseHandicapDetails, PlainScoreCard, PlayerRoundScores, PlayerScore, CourseInfo, CourseHoleInfo } from '../../data/mygolf.data';
import { ClubFlightService } from '../../providers/club-flight-service/club-flight-service';
import { ItemSliding } from 'ionic-angular';
// import {SelectFlightPage} from '../select-flight/select-flight';

/*
 Generated class for the ScoringPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    templateUrl: 'gameround-scoring.html',
    selector   : 'gameround-scoring-page'
})
export class GameRoundScoringPage {
    scorecard$: Observable<PlainScoreCard>;
    scorecard: PlainScoreCard;
    allowGps: boolean;
    public currentPlayer: PlayerInfo;
    public totalHoles: number = 0;
    public currentHole: number;
    public currentScores: Array<PlayerScore>;
    public currentCourse: CourseInfo;
    public currentHoleInfo: CourseHoleInfo;
    public currentNine: number;
    public competition: CompetitionInfo;
    public currentPlayerScoring: boolean;
    public curentHoleScoresChanged: boolean = false;
    public editingScorecard: boolean        = false;
    public canFinalizeGame: boolean         = false;
    public details: CompetitionDetails;
    public flights: Array<FlightInfo>            = [];
    public filteredFlights: Array<FlightInfo>    = [];
    public buggyNo?: string;
    public scoringBy:  string                    = "Flight"; // Flight or Hole
    public currentPlayerTeeoff: string = 'Blue';

    public flightChanged: boolean           = false;
           allowLogout: boolean             = false;
           scorecardSaver: ScorecardSaver;
           adUrls: string [];
           adOptions: any                   = {
               autoplay: 300,
               loop    : true,
               pager   : false
           }

           private msgSubscription: Subscription;
           private scorecardSubscription: Subscription;
    // showAds$: Observable<boolean>;
    // addUrls$: Observable<string[]>;
    // private notificationSubscriber: Subscriber<any>;
    // private notificationHandler: GameRoundScoringNotificationHandler;
    // @ViewChild('adhandler') adHandler: AdhandlerComponent;
    // advertisements: Advertisement[] = [];
    fromClub: boolean = false;
    viewOnly: boolean = false;
    constructor(private nav: NavController,
        private currentScorecardActions: CurrentScorecardActions, 
        private currentScorecardService: CurrentScorecardDataService,
        private sessionActions: SessionActions,
        private sessionService: SessionDataService,
        private serverInfoService: ServerInfoDataService,
        private navParams: NavParams,
        private modalCtl: ModalController,
        private loadingCtl: LoadingController,
        private toastCtl: ToastController,
        private toast: Toast,
        private alertCtl: AlertController,
        private actionSheetCtl: ActionSheetController,
        private connService: ConnectionService,
        private competitionService: CompetitionService,
        private normalgameService: NormalgameService,
        private scorecardService: ScorecardService,
        private storage: VolatileStorage,
        private dbStorage: MyGolfStorageService,
        private translation: TranslationService,
        private eventLogService: EventLogService,
        private platform: Platform,
        private cd: ChangeDetectorRef,
        private websocketActions: WebsocketActions,
        private deviceService: DeviceService,
        // private adService: AdService,
        private events: Events,
        private authService: AuthenticationService,
        private keyboard: Keyboard,
        private handicapService: HandicapService,
        private clubService: ClubService,
        private flightService: ClubFlightService) {
        this.nav              = nav;
        // this.notificationHandler = new GameRoundScoringNotificationHandler(this, nav, toastCtl);
        this.scorecard        = navParams.get("scorecard");
        this.currentPlayer    = navParams.get("currentPlayer");
        console.log("[constructor] scorecard ", this.scorecard)
        console.log("Current Player",this.currentPlayer);
        this.editingScorecard = navParams.get("editingScorecard");
        this.competition      = navParams.get("competition");
        let reloadScorecard   = navParams.get("reloadScorecard");
        this.allowLogout      = navParams.get("allowLogout");

        this.fromClub         = navParams.get("fromClub");

        this.viewOnly = navParams.get("viewOnly");

        if (this.competition != null && reloadScorecard) {
            //Always reload the scorecard on entry from database
            this.reloadScorecard();
        }
        if(this.scorecard && this.scorecard.currentHole) 
            this.currentHole = this.scorecard.currentHole;
        else if(this.scorecard && this.scorecard.startingHole)
            this.currentHole = this.scorecard.startingHole;
        if (!this.currentHole && this.scorecard && this.scorecard.startingHole) this.currentHole = this.scorecard.startingHole;
        if (!this.currentHole) this.currentHole = 1;
        //Derive the number of holes
        this.totalHoles     = this.scorecard.courses.length * 9;
        //Derive whether GPS is allowed or not
        this.allowGps = (!this.scorecard.competition) ||
            (this.scorecard.competition && this.competition.allowGps);
        //Create a scorecard saver
        this.scorecardSaver = new ScorecardSaver(scorecardService);
        this.scorecardSaver.init(scorecardService);

        this._onCurrentHoleChange();
        this._deriveWhetherScoring();
        this.allScoresIn();
        //Add a subscriber to listen to scorecard reload
        // this.events.subscribe("scorecardReloaded", (data: Array<PlainScoreCard>) => {
        //     this.onScorecardReloadEvent(data);
        // });
        if(!this.editingScorecard){
        }
    }

    ionViewDidLoad() {
        if (!this.editingScorecard && !this.viewOnly) {
            
            // this._scorecardReloaded(this.scorecard, false);
            // this.scorecard.editable = true;

            this.scorecardSubscription = this.currentScorecardService.scorecard()
                                             .subscribe((scorecard: PlainScoreCard) => {
                                                 if (scorecard !== this.scorecard && scorecard) {
                                                     console.log('Scorecard is reloaded', scorecard);
                                                     //TODO use the current scorecard and set it.
                                                     this._scorecardReloaded(scorecard, false);
                                                     this.scorecard.editable = true;
                                                    //  if(this.platform.is('mobileweb') || this.platform.is('core') || this.platform.is('windows')) {
                                                    //     this.scorecard.editable = true;
                                                    // }
                                                 }
                                             });
        } else {
            this._scorecardReloaded(this.scorecard, false);
            this.scorecard.editable = false;
        }
        if(this.scorecard.competition) this.flightDetails();
    }
    ionViewWillUnload() {
        if(this.scorecardSubscription) this.scorecardSubscription.unsubscribe();
    }
    ionViewDidEnter() {
        // if(this.adHandler) this.adHandler.refresh();
        //We are here scoring. Interested in CurrentScorecard changes
        this.msgSubscription = this.currentScorecardService.getCurrentScorecard()
                                   .map(curr=>curr.reloadReason)
                                   .distinctUntilChanged()
                                   .subscribe(reason=>{
                                       if(reason){
                                           let toast = this.toastCtl.create({
                                               message: reason + " Scorecard is reloaded.",
                                               showCloseButton: true,
                                               closeButtonText: 'OK',
                                               duration: 5000
                                           });
                                           toast.present().then(()=>{
                                               this.currentScorecardActions.clearReloadFlag();
                                           });
                                       }


                                   });
                                   console.log("Scorecard Incoming2 : ",this.scorecard);
                                   console.log("Current Hole Info : ", this.currentHoleInfo)
                                   console.log("Current Hole number : ",this.currentHole)
    }

    ionViewWillLeave() {
        if(this.msgSubscription){
            this.msgSubscription.unsubscribe();
            this.msgSubscription = null;
        }
        // if(this.adHandler) this.adHandler.stop();
    }

    public getNotifications(): Array<NotificationHandlerInfo> {
        let notifications = new Array<NotificationHandlerInfo>();
        notifications.push({
            type       : AbstractNotificationHandlerPage.TYPE_FLIGHTS_CHANGED,
            whenActive : 'showToast',
            needRefresh: true
        });
        notifications.push({
            type       : AbstractNotificationHandlerPage.TYPE_COMP_INFO_CHANGED,
            whenActive : 'showToast',
            needRefresh: true
        });
        notifications.push({
            type      : AbstractNotificationHandlerPage.TYPE_COMPETITION_CANCELLED,
            whenActive: 'manual'
        });
        notifications.push({
            type      : AbstractNotificationHandlerPage.TYPE_SCORING_FINISHED,
            whenActive: 'manual'
        });
        return notifications;
    }

    public refreshPage(pushData: any) {
        this.reloadScorecard(false);
    }

    public exit() {
        let alert = this.alertCtl.create({
            title  : "Exit Scoring",
            message: "If you exit now, you need organizer to log you in again. Do you want to continue ?",
            buttons: [{
                text   : "No",
                handler: () => {
                    alert.dismiss();
                    return false
                }
            }, {
                text   : "Yes",
                handler: () => {
                    alert.dismiss().then(() => {
                        let deviceId = this.deviceService.getCachedDeviceInfo().deviceId;
                        //If you are scoring in this device, first release the lock
                        if(this.scorecard.editable && this.scorecard.lockedBy === deviceId){
                            this.competitionService.releaseDeviceLock(this.competition.competitionId,
                                this.scorecard.roundNumber, this.currentPlayer.playerId)
                                .subscribe((success)=> {
                                    this.sessionActions.logout();
                                })
                        }
                        else
                            this.sessionActions.logout();

                    });
                    return false;
                }
            }]
        });
        alert.present();
    }

    public showEventLog() {
        this.nav.push(EventLogListPage);
    }

    connectionOn() {
        return this.connService.isConnected();
        // Network.type !== 'none' && Network.type !== 'unknown';
    }

    isCordova() {
        return this.platform.is("cordova");
    }

    public handleNotification(type: string, message: string, notfData: any) {
        if (global.SharedObject.homeInfo) {
            global.SharedObject.homeInfo.needRefresh = true;
        }
        this.toast.showWithOptions({
            message : message,
            duration: 1500,
            position: "bottom",
            styling : MygolfToastOptions.NotificationToastStyle
        }).subscribe((result) => {
            if (!result || !result.event || result.event === 'show') {
                if (type === AbstractNotificationHandlerPage.TYPE_SCORING_FINISHED && this.competition) {
                    let comp         = this.competition;
                    let roundNo      = this.scorecard.roundNumber;
                    let showLdrBoard = this.competition.showLeaderBoard;
                    if (showLdrBoard) {
                        this.nav.push(LeaderboardPage, {
                            competition: comp,
                            roundNo    : roundNo
                        }).then(() => {
                            this.nav.remove(1, this.nav.length() - 2);
                        });
                    }
                    else {
                        this.nav.popToRoot();
                    }
                }
                else if (type === AbstractNotificationHandlerPage.TYPE_COMPETITION_CANCELLED && this.competition) {
                    // alert("Competition Cancelled : " + JSON.stringify(notfData));
                    let compCancelled = notfData.competitionCancelled;
                    if (compCancelled && compCancelled === this.competition.competitionId) {
                        this.nav.popToRoot();
                    }
                    //Else do nothing
                }
            }
        });
    }


    /**
     * Fired when GPS button is clicked
     */
    onGPSClick() {
        this.nav.push(HoleGoogleMapPage, {
            hole: this.currentHoleInfo
        });
    }

    onScorecardReloadEvent(data: Array<PlainScoreCard>) {
        if (data && data.length) {
            this._scorecardReloaded(data[0]);
        }
    }

    private _deriveWhetherScoring() {
        let totalScoring          = this.scorecard.playerRoundScores
                                        .filter(prs => {
                                            // console.log("[Player] this.currentPlayer : ",this.currentPlayer)
                                            // console.log("[Player] prs.scoringplayerid: ",prs.scoringPlayerId)
                                            return prs.scoringPlayerId === this.currentPlayer.playerId &&
                                                prs.status === 'I';
                                        }).length;
        this.currentPlayerScoring = (totalScoring > 0);
    }

    goScorecard() {
        if (!this.editingScorecard) {
                this.currentScorecardActions
                    .saveCurrentScorecard(this.scorecard, this.currentPlayer.playerId,
                    false);
                this.normalgameService.deriveNetScores(this.scorecard);
                this.normalgameService.calculateTotals(this.scorecard);
                this.nav.push(ScorecardDisplayPage, {
                    scorecard      : this.scorecard,
                    fromScoringPage: true,
                    competition: this.competition,
                    hideHomeButton : this.allowLogout,
                    currentPlayer  : this.currentPlayer,
                    hideReload     : this.currentPlayerScoring,
                    buggyNo        : this.buggyNo
                });
        }
        else {
            this.nav.pop();
        }
    }

    goLeaderboard() {
        if (this.competition) {
            if (this.connService.isConnected()) {
                this.nav.push(LeaderboardPage, {
                    competition   : this.competition,
                    roundNo       : this.scorecard.roundNumber,
                    hideHomeButton: this.allowLogout
                });
            }
            else {
                let noConn = this.toastCtl.create({
                    message        : 'You have no internet connection. Cannot go to leaderboard',
                    duration       : 3000,
                    showCloseButton: true,
                    closeButtonText: 'OK'
                });
                noConn.present();
            }
        }
    }

    currentHoleImage() {
        return "img/holes/" + this.currentHole + ".png";
    }
    prevHole() {
        let prevHole = 0;
        if (this.currentHole > 1) {
            prevHole = this.currentHole - 1;
        } else {
            prevHole = this.totalHoles;
        }
        return prevHole;
    }

    nextHole() {
        let nextHole = 0;
        if (this.currentHole < this.totalHoles) {
            nextHole = this.currentHole + 1;
        } else {
            nextHole = 1;
        }
        return nextHole;
    }

    /**
     * Checks whether all scores are in
     * @returns {boolean}
     */
    allScoresIn() {
        let totalScoring = this.scorecard.playerRoundScores.filter((prs) => {
            return prs.scoringPlayerId == this.currentPlayer.playerId && prs.status === 'I';
        }).length;
        if (!this.editingScorecard && this.scorecard && totalScoring > 0) {
            this.canFinalizeGame = ScorecardService.isAllScoresIn(this.scorecard, this.currentPlayer.playerId);
        } else {
            this.canFinalizeGame = false;
        }
    }

    needToSave() {
        if (this.editingScorecard && this.scorecard.dirty && !this.scorecard.competition) {
            return true;
        } else {
            return false;
        }
    }

    currentHoleDetails() {
        // let playerTeeOff = this.scorecard.playerRoundScores[0].teeOffFrom;
        // this.currentPlayerTeeoff = this.scorecard.playerRoundScores[0].teeOffFrom;
        this.scorecard.playerRoundScores.forEach((pr: PlayerRoundScores) => {
            if(this.currentPlayer.playerId===pr.playerId) 
                this.currentPlayerTeeoff = pr.teeOffFrom
        })
        // console.log("[scoring] current player : ", this.currentPlayer)
        // console.log("[scoring] scorecard ", this.scorecard)
        // console.log("[scoring] currentHoleInfo ", this.currentHoleInfo)
        // if(playerTeeOff === null) playerTeeOff = 'Blue';
        // if(this.currentPlayerTeeoff  === null) playerTeeOff = 'Blue';
        // console.log("[scoring] playerTeeOff : ", playerTeeOff)
        // console.log("[scoring] currentPlayerTeeoff : ", this.currentPlayerTeeoff)
        // this.currentPlayer.teeOffFrom
        // console.log("[player] ", this.currentPlayer);
        let holeDistanceM = 0;
        if(this.currentPlayerTeeoff === 'Blue' && this.currentHoleInfo.holeDistanceBlue)
            holeDistanceM = this.currentHoleInfo.holeDistanceBlue
        else if(this.currentPlayerTeeoff === 'Red' && this.currentHoleInfo.holeDistanceRed)
            holeDistanceM = this.currentHoleInfo.holeDistanceRed
        else if(this.currentPlayerTeeoff === 'White' && this.currentHoleInfo.holeDistanceWhite)
            holeDistanceM = this.currentHoleInfo.holeDistanceWhite
        else if(this.currentPlayerTeeoff === 'Black' && this.currentHoleInfo.holeDistanceBlack)
            holeDistanceM = this.currentHoleInfo.holeDistanceBlack
        
            return "Par " + this.currentHoleInfo.holePar + " Index "
            + this.holeIndexToUse()
            + " Distance " + holeDistanceM + "M"
            //  (" + playerTeeOff +" T)";
            // "+`<i [class]="getTeeColor(`+playerTeeOff+`)" class="fa fa-flag tee-size" ></i>`
            
    }

    holeIndexToUse():number {
        if(this.currentCourse.indexToUse == 1)
            return this.currentHoleInfo.holeIndex
            else if (this.currentCourse.indexToUse == 2)
                return this.currentHoleInfo.holeIndexIn
                else return this.currentHoleInfo.holeIndex
    }

    /**
     * Gets the score for the player in given position (0 -based)
     * @param idx
     */
    getScore(idx: number): number {
        return this.currentScores[idx].actualScore;
    }

    canScore(pr: PlayerRoundScores) {
        return pr.scoringPlayerId === this.currentPlayer.playerId &&
            ((this.editingScorecard && pr.status !== 'W') || pr.status === "I");
    }

    disableGPS(): boolean {
        return !this.allowGps;

    }

    getScoreType(idx: number): String {
        if (!this.currentScores[idx].actualScore) return "";
        if (this.currentScores[idx].actualScore === 1) {
            return this.translation.translate("ScoringPage.HoleInOne");
        }
        let diff   = this.currentScores[idx].actualScore - this.currentHoleInfo.holePar;
        let result = "";
        switch (diff) {
            case -3:
                result = this.translation.translate("ScoringPage.Albatross");
                break;
            case -2:
                result = this.translation.translate("ScoringPage.Eagle");
                break;
            case -1:
                result = this.translation.translate("ScoringPage.Birdie");
                break;
            case 0:
                result = this.translation.translate("ScoringPage.Par");
                break;
            case 1:
                result = this.translation.translate("ScoringPage.Bogey");
                break;
            case 2:
                result = this.translation.translate("ScoringPage.DoubleBogey");
                break;
            case 3:
                result = this.translation.translate("ScoringPage.TrippleBogey");
                break;
            default:
                if (diff < 0 && this.currentScores[idx].actualScore === 1) {
                    result = this.translation.translate("ScoringPage.HoleInOne");
                } else if (diff >= 4) {
                    result = this.translation.translate("ScoringPage.Disaster");
                }
        }
        return result;
    }


    private _setCurrentScorecard(){
        if(!this.editingScorecard){
            this.currentScorecardActions.setCurrentScorecard(this.scorecard, this.currentPlayer.playerId);
        }
    }
    onHomeClick() {
        console.log("Total pages : " + this.nav.length());
        this.nav.remove(1, this.nav.length() - 1);
    }

    /**
     * When you click next hole
     */
    onNextHoleClick() {
        this._checkMissingScores();
        if (this.currentHole < this.totalHoles) {
            this.currentHole = this.currentHole + 1;
        } else {
            this.currentHole = 1;
        }
        this.scorecard.currentHole = this.currentHole;
        this._saveScore(false);
        this._onCurrentHoleChange();
        this.allScoresIn();
    }

    onGotoHoleClick() {
        let modal = this.modalCtl.create(GotoHoleModal, {
            courses: this.scorecard.courses
        });
        modal.onDidDismiss((data: any) => {
            if (isPresent(data)) {
                let hole: CourseHoleInfo = data.hole;
                if (this.currentHole !== hole.holeNo) {
                    this._checkMissingScores();
                    this.currentHole = hole.holeNo;
                    this._saveScore(false);

                        // this.currentScorecardActions.setCurrentScorecard(this.scorecard, this.currentPlayer.playerId);
                    this._setCurrentScorecard();
                    this._onCurrentHoleChange();
                    this.allScoresIn();
                }
            }
        });
        modal.present();
    }
    onPrevHoleClick() {
        this._checkMissingScores();
        if (this.currentHole > 1) {
            this.currentHole = this.currentHole - 1;
        } else {
            this.currentHole = this.totalHoles;
        }
        this.scorecard.currentHole = this.currentHole;
        // this.currentScorecardActions.setCurrentScorecard(this.scorecard, this.currentPlayer.playerId);
        this._setCurrentScorecard();
        this._saveScore(false);
        this._onCurrentHoleChange();
        this.allScoresIn();
    }
    onParClick(idx: number) {
        if (this.currentScores[idx].actualScore !== this.currentHoleInfo.holePar) {
            this.currentScores[idx].actualScore = this.currentHoleInfo.holePar;
            this.curentHoleScoresChanged        = true;
            this.scorecard.dirty                = true;
            this._saveScore(true);
            // this.currentScorecardActions.setCurrentScorecard(this.scorecard, this.currentPlayer.playerId);
            this._setCurrentScorecard();
        }
    }

    onMinusClick(idx: number) {
        if (this.currentScores[idx].actualScore) {
            if (this.currentScores[idx].actualScore === 1) {
                this.currentScores[idx].actualScore = null;
            } else {
                this.currentScores[idx].actualScore
                    = this.currentScores[idx].actualScore - 1;
            }
        }
        else {
            this.currentScores[idx].actualScore
                = this.currentHoleInfo.holePar - 1;
        }
        this.curentHoleScoresChanged = true;
        this.scorecard.dirty         = true;
        this._saveScore(true);
        // this.currentScorecardActions.setCurrentScorecard(this.scorecard, this.currentPlayer.playerId);
        this._setCurrentScorecard();
    }

    onPlusClick(idx: number) {
        if (this.currentScores[idx].actualScore) {
            this.currentScores[idx].actualScore
                = this.currentScores[idx].actualScore + 1;
        } else {
            this.currentScores[idx].actualScore
                = this.currentHoleInfo.holePar + 1;
        }
        this.curentHoleScoresChanged = true;
        this.scorecard.dirty = true;
        this._saveScore(true);
        // this.currentScorecardActions.setCurrentScorecard(this.scorecard, this.currentPlayer.playerId);
        this._setCurrentScorecard();

    }



    private _checkMissingScores() {
        if (!this.editingScorecard && this.curentHoleScoresChanged) {
            let playerNames = [];
            this.scorecard.playerRoundScores.forEach((prs: PlayerRoundScores, index: number) => {
                if (prs.scoringPlayerId === this.currentPlayer.playerId) {
                    if (!this.currentScores[index] || !this.currentScores[index].actualScore) {
                        playerNames.push(prs.playerName);
                    }
                }
            });
            if (playerNames.length) {
                let str = playerNames.join(",")
                let msg = "You haven't scored for " + str + " for hole " + this.currentHole;
                let missing = this.toastCtl.create({
                    message        : msg,
                    // duration           : 3000,
                    position       : "bottom",
                    showCloseButton: true,
                    closeButtonText: "X"
                });
                missing.present();
            }
        }
    }

    private _saveAndReload(localonly: boolean, showSaveError: boolean) {
        let loading = this.loadingCtl.create({
            showBackdrop: false,
            content     : "Saving scorecard"
        });
        loading.present().then(() => {
            this.currentScorecardActions.saveCurrentScorecard(this.scorecard,this.currentPlayer.playerId,
                false);
            this.currentScorecardActions.reloadCurrentScorecard(false)
                .subscribe(() => {
                    loading.dismiss(true).then(() => {
                        this.reloadScorecard(true);
                    });
                }, (error) => {
                    //Save failed. So keep the flag dirty
                    this.scorecard.dirty = true;
                    loading.dismiss().then(() => {
                        if (showSaveError) {
                            MessageDisplayUtil.showErrorToast("Saving scorecard failed. Try again later.",
                                this.platform, this.toastCtl, 3000, "bottom");
                        }
                    });
                });
        });
    }

    private _saveScore(localonly: boolean, showSaveError: boolean = false) {
        if (!this.editingScorecard) {
            if(this.curentHoleScoresChanged){
                this.curentHoleScoresChanged = (localonly)?this.curentHoleScoresChanged: false;
                this.currentScorecardActions.saveCurrentScorecard(this.scorecard,
                    this.currentPlayer.playerId, localonly)
            }
        }
    }
    onBreaklockClick() {
        let confirm = this.alertCtl.create({
            title: 'Scoring',
            message: 'Do you want to start scoring in this device? Unsaved scores in other device ' +
            'will be lost. Do you want to continue?',
            buttons: [
                {
                    text: 'Yes',
                    handler: ()=> {
                        confirm.dismiss().then(()=>{
                            this.reloadScorecard(false, true);
                        });
                        return false;
                    }
                },
                {
                    text: 'No',
                    handler: ()=> {
                        confirm.dismiss();
                        return false;
                    }
                }
            ]
        });
        confirm.present();
    }
    onCancelGameClick() {
        //Alert confirmation
        let confirm = this.alertCtl.create({
            title  : this.translation.translate("ScoringPage.GameCancelTitle"),
            message: this.translation.translate("ScoringPage.GameCancelMessage"),
            buttons: [
                {
                    text   : this.translation.translate("ScoringPage.GameCancelNo"),
                    role   : "cancel",
                    handler: () => {
                        confirm.dismiss();
                        return false;
                    }
                },
                {
                    text   : this.translation.translate("ScoringPage.GameCancelYes"),
                    handler: () => {
                        confirm.dismiss().then(() => {
                            this._cancelGame();
                        });
                        return false;
                    }
                }
            ]
        });
        confirm.present();
    }
    openScorerMenu() {
        let btns = [{
            text: 'Logout',
            icon: 'exit',
            role: 'destructive',
            handler: ()=>{
                actionSheet.dismiss().then(()=>{
                    this.exit();
                });
                return false;
            }
        },{
            text: 'Go to Hole',
            icon: 'grid',
            role: 'destructive',
            handler: ()=>{
                actionSheet.dismiss().then(()=>{
                  this.onGotoHoleClick();
                    // this.exit();
                });
                return false;
            }
        },
        // {
        //     text: 'Select Flight',
        //     icon: 'grid',
        //     role: 'destructive',
        //     handler: ()=>{
        //         actionSheet.dismiss().then(()=>{
        //             this.onGoToFlight(this.competition);
        //         });
        //         return false;
        //     }
        // },
        {
            text: 'View Scorecard',
            icon: 'grid',
            role: 'destructive',
            handler: ()=>{
                actionSheet.dismiss().then(()=>{
                    this.goScorecard();
                });
                return false;
            }
        },{
            text: 'Show Leaderboard',
            icon: 'grid',
            role: 'destructive',
            handler: ()=>{
                actionSheet.dismiss().then(()=>{
                    this.goLeaderboard();
                });
                return false;
            }
        },{
            text   : 'Cancel',
            role   : 'cancel', // will always sort to be on the bottom
            icon   : !this.platform.is('ios') ? 'close' : null,
            handler: () => {
                actionSheet.dismiss();
                return false;
            }
        }];
        let actionSheet = this.actionSheetCtl.create({
            buttons: btns
        });
        actionSheet.present();
    }
    onMenuClick() {
        let btns = [];
        if (!this.editingScorecard && !this.scorecard.competition) {
            btns.push({
                text   : 'Finish Game',
                role   : 'destructive',
                icon   : "checkmark-circle",
                handler: () => {
                    actionSheet.dismiss()
                               .then(() => {
                                   this.onGameFinishClick();
                               });
                    return false;
                }
            });
        }
        if (!this.scorecard.competition) {
            this.scorecard.courses.forEach((c: CourseInfo, idx: number) => {
                btns.push({
                    text   : "Change course " + c.whichNine,
                    icon   : "flag",
                    handler: () => {
                        actionSheet.dismiss()
                                   .then(() => {
                                       let modal = this.modalCtl.create(ChangeCoursePage, {
                                           currentCourse   : c,
                                           clubId          : this.scorecard.clubId,
                                           scorecard       : this.scorecard,
                                           editingScorecard: this.editingScorecard
                                       });
                                       modal.onDidDismiss((course: CourseInfo) => {
                                           if (course) {
                                               this._onCurrentHoleChange();
                                           }
                                       });
                                       modal.present();
                                   });
                        return false;
                    }
                });
            });
        }
        if (!this.scorecard.competition && !this.editingScorecard) {
            btns.push({
                text   : 'Cancel Game',
                icon   : "trash",
                handler: () => {
                    actionSheet.dismiss()
                               .then(() => {
                                   this.onCancelGameClick();
                               });
                    return false;
                }
            });
        }
        if (this.editingScorecard) {
            btns.push({
                text   : 'Edit T-Off Date/Time',
                role   : 'edit_dt',
                icon   : !this.platform.is('ios') ? 'exit' : null,
                handler: () => {
                    console.log("scorecard before : ",this.scorecard)
                    actionSheet.dismiss().then(()=>{
                        let modal = this.modalCtl.create(EditTeeoffPage, {
                            // currentCourse   : c,
                            // clubId          : this.scorecard.clubId,
                            scorecard       : this.scorecard,
                            // editingScorecard: this.editingScorecard
                        });
                        modal.onDidDismiss((data: any) => {
                            console.log("[Dismiss] Scorecard : ", data)
                            if (data) {
                                console.log("scorecard after : ",data)
                                this.scorecard = data.scorecard
                                // this._onCurrentHoleChange();
                            }
                            // actionSheet.dismiss()
                            //     .then(() => {
                            //         if(data !== null || data) this._confirmAndSave();
                            //     });
                        });
                        modal.present();
                        return false;
                    })
                    
                }
            });
            btns.push({
                text   : 'Save Scorecard',
                role   : 'save',
                icon   : !this.platform.is('ios') ? 'exit' : null,
                handler: () => {
                    actionSheet.dismiss()
                               .then(() => {
                                   this._confirmAndSave();
                               });
                    return false;
                }
            });
            
        }
        btns.push({
            text   : 'Cancel',
            role   : 'cancel', // will always sort to be on the bottom
            icon   : !this.platform.is('ios') ? 'close' : null,
            handler: () => {
                actionSheet.dismiss();
                return false;
            }
        });
        let actionSheet = this.actionSheetCtl.create({
            buttons: btns
        });
        actionSheet.present();
    }

    onGameFinishClick() {
        
        let total = this.scorecard.playerRoundScores
                        .filter((prs: PlayerRoundScores) => {
                            return this.currentPlayer.playerId === prs.scoringPlayerId;
                        })
                        .map((prs: PlayerRoundScores) => {
                            return prs.scores.filter((s: PlayerScore) => {
                                return !s.actualScore;
                            }).length;
                        }).reduce((a: number, b: number) => a + b);
        let _title;
        let _message;
        let _textYes;
        let _textNo;
        if(total > 0) {
            _title = this.translation.translate("ScoringPage.GameSaveTitle");
            _message = this.translation.translate("ScoringPage.GameSaveMessage");
            _textYes = this.translation.translate("ScoringPage.GameSaveYes");
            _textNo = this.translation.translate("ScoringPage.GameSaveNo");
        } else {
            _title = this.translation.translate("ScoringPage.GameFinishTitle");
            _message = this.translation.translate("ScoringPage.GameFinishMessage");
            _textYes = this.translation.translate("ScoringPage.GameFinishYes");
            _textNo = this.translation.translate("ScoringPage.GameFinishNo");
        }
        let confirm = this.alertCtl.create({
            title  : _title, //this.translation.translate("ScoringPage.GameFinishTitle"),
            message: _message, //this.translation.translate("ScoringPage.GameFinishMessage"),
            buttons: [
                {
                    text   : _textNo, //this.translation.translate("ScoringPage.GameFinishNo"),
                    role   : "cancel",
                    handler: () => {
                        confirm.dismiss();
                        return false;
                    }
                },
                {
                    text   : _textYes, //this.translation.translate("ScoringPage.GameFinishYes"),
                    handler: () => {
                        confirm.dismiss()
                               .then(() => {
                                   this._checkScoresAndFinish();
                               });
                        return false;
                    }
                }
            ]
        });
        confirm.present();
    }

    /**
     * Display the confirm before actually reloading the scorecard
     */
    onReloadScorecardClick() {
        if (this.scorecard.dirty) {
            let confirm = this.alertCtl.create({
                title   : this.translation.translate("ScoringPage.ReloadScoreTitle"),
                message : "<span style='color:darkred;font-weight: bold'>"
                + this.translation.translate("ScoringPage.ReloadScoreMessage") + "</span>",
                cssClass: "reload-score",
                buttons : [
                    {
                        text   : "Save & Reload",
                        handler: () => {
                            confirm.dismiss()
                                   .then(() => {
                                       // this._saveScore(false, true);
                                       this._saveAndReload(false, true);
                                   });
                            return false;
                        }
                    },
                    {
                        text   : "Discard Changes & Reload",
                        handler: () => {
                            confirm.dismiss()
                                   .then(() => {
                                       this.reloadScorecard(true);
                                   });
                            return false;
                        }
                    },
                    {
                        text   : "Cancel",
                        role   : "cancel",
                        handler: () => {
                            confirm.dismiss();
                            return false;
                        }
                    }
                ]
            });
            confirm.present();
        }
        else {
            this.reloadScorecard(true);
        }
    }

    /**
     * Changes on 01-Aug-2016
     *  Ticket 8045 - No confirmation before reload scorecard
     *
     * Reloads the scorecard from the database for competition
     * @private
     */
    public reloadScorecard(showMsg: boolean = false, breakLock?: boolean) {
        let reloading = this.loadingCtl.create({
            content     : "Reloading...",
            showBackdrop: false,
            duration: 5000,
        });
        reloading.present().then(() => {
            this.competitionService.isPlayerWithdrawn(this.competition.competitionId,
            this.currentPlayer.playerId)
                .subscribe((withdrawn: boolean)=>{
                    console.log("game round scoring withdrawn : ", withdrawn)
                    if(withdrawn){
                        // this.scorecard.editable = false;
                        // this._scorecardReloaded(this.scorecard, false);
                        if(this.fromClub) this.sessionActions.logout();
                        else this.nav.popToRoot();
                    }
                    else {
                        this.currentScorecardActions.reloadCurrentScorecard(breakLock)
                            .subscribe((reloaded: boolean) => {
                                
                                this.scorecard.dirty = false;
                                reloading.dismiss();
                            }, (error) => {
                                reloading.dismiss().then(() => {
                                    let msg   = (!this.connService.isConnected())
                                        ? "You have lost internet connection. Reload failed"
                                        : "Reloading scorecard failed. Try again.";
                                    msg       = MessageDisplayUtil.getErrorMessage(error, msg);
                                    let toast = this.toastCtl.create({
                                        message            : msg,
                                        dismissOnPageChange: false,
                                        duration           : 3000
                                    });
                                    toast.onDidDismiss(() => {
                                        if (this.allowLogout) {
                                            this.events.publish(GolfEvents.GameFinished);
                                            this.nav.popToRoot();
                                        }
                                    });
                                    // MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl, 3000, "bottom");
                                });
                            })
                    }
                });

        });
    }

    private _scorecardReloaded(scorecard: PlainScoreCard, showMsg: boolean = false) {
        this.scorecard = scorecard;
        this._onCurrentHoleChange();
        this._deriveWhetherScoring();
        this.cd.markForCheck();
        this.scorecard.playerRoundScores.forEach(prs => {
            console.log("Scorer for " + prs.playerName + " is " + prs.scorerName);
        });
        if (showMsg) {
            MessageDisplayUtil.showMessageToast("The scorecard is reloaded from server", this.platform, this.toastCtl,
                2000, "bottom");
        }
    }

    private _cancelGame() {
        this.currentScorecardActions.cancelGame(this.currentPlayer.playerId)
            .then(()=>{
                this.nav.remove(1, this.nav.length() - 1);
            });
    }

    private _finishGame() {
        let busy = this.loadingCtl.create({
            content     : 'Finishing Game...',
            showBackdrop: false
        });
        console.log("[Scorecard] Finishing :", this.scorecard)
        busy.present().then(()=>{
            this.currentScorecardActions.finishCurrentGame(this.scorecard,
                this.currentPlayer.playerId)
                .subscribe((scorecard: PlainScoreCard)=>{
                    busy.dismiss().then(()=>{
                        this.nav.remove(1, this.nav.length() - 1);
                    });
                }, (error)=>{
                    busy.dismiss().then(() => {
                        let msg = MessageDisplayUtil.getErrorMessage(error);
                        if (msg) {
                            MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl, 3000, "bottom");
                        }
                        NormalgameService.saveGameLocally(this.dbStorage, this.scorecard);
                    });
                });
        });

    }

    private _checkScoresAndFinish() {
        let total = this.scorecard.playerRoundScores
                        .filter((prs: PlayerRoundScores) => {
                            return this.currentPlayer.playerId === prs.scoringPlayerId;
                        })
                        .map((prs: PlayerRoundScores) => {
                            return prs.scores.filter((s: PlayerScore) => {
                                return !s.actualScore;
                            }).length;
                        }).reduce((a: number, b: number) => a + b);
        if (total > 0) {
            let confirm = this.alertCtl.create({
                title  : this.translation.translate("ScoringPage.MissingScoresTitle"),
                message: this.translation.translate("ScoringPage.MissingScoresMessage"),
                buttons: [
                    {
                        text   : this.translation.translate("ScoringPage.MissingScoresNo"),
                        role   : "cancel",
                        handler: () => {
                            confirm.dismiss();
                            return false;
                        }
                    },
                    {
                        text   : this.translation.translate("ScoringPage.MissingScoresYes"),
                        handler: () => {
                            confirm.dismiss()
                                   .then(() => {
                                       this._finishGame();
                                   });
                            return false;
                        }
                    }
                ]
            });
            confirm.present();
        }
        else {
            this._finishGame();
        }
    }

    /**
     * When the current hole did change
     * @private
     */
    private _onCurrentHoleChange() {
        let scores = [];
        this.scorecard.playerRoundScores.forEach((pr: PlayerRoundScores) => {
            let ps: PlayerScore = pr.scores.filter((s: PlayerScore) => {
                return s.holeNumber === this.currentHole;
            }).pop();
            scores.push(ps);
        });
        this.currentScores = scores;
        let whichNine      = 1;
        if (this.currentHole <= 9) {
            whichNine = 1;
        } else if (this.currentHole <= 18) {
            whichNine = 2;
        } else if (this.currentHole <= 27) {
            whichNine = 3;
        } else if (this.currentHole <= 36) whichNine = 4;
        this.currentNine   = whichNine;
        this.currentCourse = this.scorecard.courses[whichNine - 1];
        this.currentHoleInfo         = this.currentCourse.holes.find((h: CourseHoleInfo) => {
            return h.holeNo === this.currentHole;
        });
        this.curentHoleScoresChanged = false;
        // if(this.platform.is('mobileweb') || this.platform.is('core') || this.platform.is('windows')) {
        //     this.scorecard.editable = true;
        // }
        this.scorecard.editable = true;
    }

    /**
     * Confirm whether to save the scorecard or not
     * @private
     */
    private _confirmAndSave() {
        let confirm = this.alertCtl.create({
            title  : "Save Scorecard",
            message: "Do you want to save the scorecard ?",
            buttons: [
                {
                    text   : "No",
                    role   : "cancel",
                    handler: () => {
                        confirm.dismiss();
                        return false;
                    }
                },
                {
                    text   : "Save",
                    handler: () => {
                        confirm.dismiss()
                               .then(() => {
                                   this._saveEditedScorecard();
                               });
                        return false;
                    }
                }
            ]
        });
        confirm.present();
    }

    /**
     * Saves the scorecard changes to database
     * @private
     */
    private _saveEditedScorecard() {
        this.scorecardService.saveNormalGameScorecard(this.scorecard)
            .subscribe((scorecard) => {
                console.log("saving scorecard", this.scorecard)
                this.normalgameService.deriveNetScores(this.scorecard);
                this.normalgameService.calculateTotals(this.scorecard);
                this.currentScorecardActions.cancelGame(this.currentPlayer.playerId);
                this.nav.pop();
            }, (error) => {
                console.log("save edit scorecard - ", error)
                // let msg = MessageDisplayUtil.getErrorMessage(error);
                let _error = error.json();
                let _msg = "There's something wrong with server. Please try again"
                if(error && _error.message) _msg = _error.message;
                MessageDisplayUtil.displayErrorAlert(this.alertCtl,
                    "Saving Scores",
                    _msg, "OK");
            });
    }

    onHoleImageClick() {
        let modal = this.modalCtl.create(GameScoringExpandImage, {courseHole: this.currentHoleInfo});
        modal.present();
    }

    onNotifyFlightChange() {
        let loading = this.loadingCtl.create({
            content     : "Please wait...",
            showBackdrop: false,
            duration    : 5000,
        });
        loading.present().then(() => {
            this.competitionService.notifyFlightInfoChange(this.competition.competitionId,
                this.scorecard.roundNumber, null, this.currentPlayer.playerId)
                .subscribe((success: boolean) => {
                    loading.dismiss().then(() => {
                        this.flightChanged = false;
                    });
                }, (error) => {
                    let msg = MessageDisplayUtil.getErrorMessage(error, "Error generating notifications about flight change");
                    loading.dismiss().then(() => {
                        MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl, 3000, "bottom");
                    });
                });
        });
    }

    onWithdraw(player: PlayerRoundScores) {
        let msg     = (player.playerId === this.currentPlayer.playerId)
            ? "Do you want to withdraw from competition?"
            : "Do you want to withdraw " + player.playerName + " from competition ?";
        let confirm = this.alertCtl.create({
            title  : "Withdraw from competition",
            message: msg,
            buttons: [
                {
                    text   : "No",
                    role   : "cancel",
                    // icon   : !this.platform.is('ios') ? 'close' : null,
                    handler: () => {
                        confirm.dismiss();
                        return false;
                    }
                },
                {
                    text   : "Yes",
                    handler: () => {
                        confirm.dismiss()
                               .then(() => {
                                   this._withdrawFromComp(player);
                               });
                        return false;
                    }
                }
            ]
        });
        confirm.present();
    }

    onChangeScorer(player: PlayerRoundScores, itemSliding: ItemSliding) {
        let actionSheet = this.actionSheetCtl.create({
            buttons: [
                {
                    text   : 'Cancel',
                    role   : 'cancel', // will always sort to be on the bottom
                    icon   : !this.platform.is('ios') ? 'close' : null,
                    handler: () => {
                        actionSheet.dismiss();
                        return false;
                    }
                }
            ]
        });
        this.scorecard.playerRoundScores.forEach((pr: PlayerRoundScores) => {
            // console.log(c)
            // if (pr.playerId !== this.currentPlayer.playerId) //scorer cant be logged in player
            {
                actionSheet.addButton(
                    {
                        text   : pr.playerName,
                        role   : 'destructive',
                        icon   : 'filter',
                        handler: () => {
                            actionSheet.dismiss()
                                       .then(() => {
                                           this._changeScorer(player, pr);
                                           itemSliding.close();
                                       });
                            return false;
                        }
                    });
            }
        });
        actionSheet.present();
    }

    onWithdrawPlayer(player: PlayerRoundScores, itemSliding: ItemSliding) {
        let alert = this.alertCtl.create({
            title: 'Withdraw Player',
            message: 'This will withdraw selected player. Do you want to proceed?',
            buttons: [{
                text: 'Cancel',
            }, {
                text   : 'Withdraw',
                role   : 'destructive',
                handler: () => {
                    alert.dismiss()
                                .then(() => {
                                    this._withdrawFromComp(player);
                                    itemSliding.close();
                                });
                    return false;
                }
            }]
        });
        alert.onDidDismiss(()=>{
            this.reloadScorecard(false, false);
        });
        alert.present();

    }

    // onGoToFlight(competition: CompetitionInfo) {
    //     let modal = this.modalCtl.create(SelectFlightPage, {
    //         competition: competition});
    //     modal.present();
    // }

    public onViewProfile(player: PlayerRoundScores) {
        console.log("view profile:", player);
        console.log("current player:", this.currentPlayer)
        this.nav.push(ProfilePage, {
            status: 'fromScoring',
            type  : 'friendProfile',
            player: player
        });
    }

    private _withdrawFromComp(player: PlayerRoundScores) {
        let loading = this.loadingCtl.create({
            content     : "Changing scorer. Please wait...",
            showBackdrop: false
        });
        loading.present().then(() => {
            this.competitionService.withdraw(this.competition.competitionId,
                this.scorecard.roundNumber, player.playerId)
                .subscribe((success: boolean) => {
                    loading.dismiss().then(() => {
                        player.status      = "W";
                        this.flightChanged = true;
                        if(success) {
                            this.nav.popToRoot();
                            // this.playerHomeAc
                        }; // this.reloadScorecard()
                    });
                }, (error) => {
                    let msg = MessageDisplayUtil.getErrorMessage(error, "Error occurred while withdrawing from competition");
                    loading.dismiss().then(() => {
                        MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl, 5000, "bottom");
                    });
                });
        });
    }

    private _changeScorer(player: PlayerRoundScores, scoringPlayer: PlayerRoundScores) {
        let loading = this.loadingCtl.create({
            content     : "Changing scorer. Please wait...",
            showBackdrop: false
        });
        loading.present().then(() => {
            this.competitionService.changeScorer(this.competition.competitionId,
                this.scorecard.roundNumber, player.playerId, scoringPlayer.playerId)
                .subscribe((success: boolean) => {
                    loading.dismiss().then(() => {
                        player.scoringPlayerId = scoringPlayer.playerId;
                        player.scorerName      = scoringPlayer.playerName;
                        this.flightChanged     = true;
                        // if(success) this.
                    });
                }, (error) => {
                    let msg = MessageDisplayUtil.getErrorMessage(error,
                        "Error occurred while changing the scorer");
                    loading.dismiss().then(() => {
                        MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl, 5000, "bottom");
                    });
                });
        });
    }

    private _onWebsocketMessage(msg: any) {
        if(msg && msg["type"]){
            switch(msg["type"].toUpperCase()){
                case 'DEVICELOCKBROKEN':
                    this.deviceLockBroken(msg);
                    break;
                case 'FLIGHCHANGED':
                    this.reloadScorecard(true, false);
                    break;
                case 'FLIGHTCHANGED':
                    this.reloadScorecard(true, false);
                    break;
            }
        }
    }

    private  deviceLockBroken(msg: any) {
        //Need to get the scorecard with
        let deviceInfo: DeviceInfo =  this.deviceService.getCachedDeviceInfo();
        let deviceId = msg['lockedBy'];
        if(deviceInfo.deviceId !== deviceId
            && this.scorecard.competitionId == msg['competitionId']
            && this.scorecard.flightNumber === msg['flight']){
            let alert = this.alertCtl.create({
                title: 'Scoring Device',
                message: 'The scoring will be continued in another device.',
                buttons: ["OK"]
            });
            alert.onDidDismiss(()=>{
                this.reloadScorecard(false, false);
            });

        }
    }

    private flightDetails() {
        this.competitionService.getDetails(this.competition.competitionId)
                .subscribe((details: CompetitionDetails) => {
                    this.details = details;
                    this.competitionService.getFlights(this.competition.competitionId, details.roundInProgress)
                        .subscribe((flights: Array<FlightInfo>) => {
                            flights.forEach(flight => {
                                flight.flightMembers = flight.flightMembers.filter(fm => {
                                    return fm.scorer && fm.status !== 'Withdrawn';
                                });
                            });
                            this.filteredFlights = this.flights = flights.filter(flight => {
                                flight.flightMembers = flight.flightMembers.filter(fm => {
                                    if(fm.playerId === this.currentPlayer.playerId){
                                        this.buggyNo = fm.buggy;
                                        return true
                                    }
                                });
                                return flight.playerFlight
                            });
                            this.filteredFlights = this.flights = flights;
                        });
                }, (error) => {
                });
    }

    getTeeColor(color: string, type?: string) { 
        let teeColor: string;

        // console.log("get tee color", color, " - ", type)
        if(color === 'White') {
            if(type==='player') teeColor = 'tee-white-tee-bg'
            else teeColor = 'tee-white'
            // teeColor = 'tee-white'+ ((type==='player')?' ' + 'tee-bg':'')
            return teeColor
        } else if(color === 'Red') {
            return 'tee-red'
        } else if(color === 'Black') {
            return 'tee-black'
        } else if(color === 'Gold') {
            if(type==='info') teeColor = 'tee-gold-tee-bg'
            else teeColor = 'tee-gold'
            // teeColor = 'tee-gold' + ((type==='info')?' ' + 'tee-bg':'')
            return teeColor
        } else if(color === 'Blue') {
            return 'tee-blue'
        }
        // else return 'tee-blue'
    }

    _getClubCourses() {
        let clubCourses: Array<CourseInfo> = [];
        this.clubService.getClubCourses(this.scorecard.clubId)
        .subscribe((courses: Array<CourseInfo>) => {
            // loader.dismiss().then(() => {
                clubCourses = courses;
                clubCourses.forEach(course => {
                    // if (this.gameInfo.courses && this.gameInfo.courses[0] && this.gameInfo.courses[0].courseId === course.courseId) {
                    //     this.gameInfo.courses[0] = course;
                    // }
                    // if (this.gameInfo.courses && this.gameInfo.courses[1] && this.gameInfo.courses[1].courseId === course.courseId) {
                    //     this.gameInfo.courses[1] = course;
                    // }
                });
            // });

        }, (error) => {
            // loader.dismiss().then(() => {
            //     let msg = MessageDisplayUtil.getErrorMessage(error, "Error getting courses for selected club");
            //     MessageDisplayUtil.showMessageToast(msg, this.platform, this.toastCtl, 3000, "bottom");
            // });
        });
    }

    onTeeboxSelect(_idx: number) {
        // let idx = _idx + 1;
        let courses: Array<CourseInfo> = this.scorecard.courses;
        let selCourse: CourseInfo;
        selCourse = courses.reduce((a: CourseInfo,b: CourseInfo): CourseInfo => {
            if(a.teeBoxes.length < b.teeBoxes.length)
                return a
                else return b
        })
        if(selCourse.teeBoxes.length === 0) {
            
        }
        console.log("[Teebox] scorecard courses : ", courses)
        console.log("[Teebox] onTeeboxSelect : ", _idx)
        console.log("[Teebox] Selected Course : ",selCourse)
        let modal = this.modalCtl.create(TeeBoxPage, {
            teeBoxes: selCourse.teeBoxes //this.currentCourse.teeBoxes
        });

        // let modal = this.modalCtl.create(AddStateListPage, {
        //     openedModal: true
        // });
        modal.onDidDismiss((teebox: TeeBox) => {
            if(teebox) {
                this.scorecard.playerRoundScores[_idx].teeOffFrom = teebox.name;
                console.log("scorecard",this.scorecard)
                this._gettingCourseHandicap(_idx+1);
            }
        });
        modal.present();
    }

    private _gettingCourseHandicap(slot: number) {
        let idx = slot - 1;
        let teeBox: string;
        let playerId: number;

        // if(slot === 1) {
        //     playerId = this.currentPlayer.playerId;
        //     teeBox =  this.currentPlayer.teeOffFrom;
        // } else {
            playerId = this.scorecard.playerRoundScores[idx].playerId;
            teeBox = this.scorecard.playerRoundScores[idx].teeOffFrom;  
            // this.otherPlayers[idx].teeOffFrom;
        // }
        // playerId = this.gameInfo.players[slot-1].playerId;
        // let teeBox = this.gameInfo.players[slot-1].teeOffFrom;
        let firstNineCourse: number;
        let secondNineCourse: number;
        // console.log("teebox 0", this.gameInfo.players[slot-1].teeOffFrom)
        
        firstNineCourse = this.scorecard.courses[0].courseId;
        if(this.scorecard.courses[1]) secondNineCourse = this.scorecard.courses[1].courseId;

        // let player = this._playerInSlot(this.scorecard.playerRoundScores[idx]);
        // this.handicapService.getCourseHandicap(playerId,teeBox,firstNineCourse,secondNineCourse)
        // .subscribe((handicap: number)=>{
        //     console.log("getting course handicap",handicap)
        //    this.scorecard.playerRoundScores[idx].playerHandicap = handicap;
        // }, (error)=> {

        // });

        this.flightService.getLatestCourseHandicap(playerId,teeBox,firstNineCourse,secondNineCourse)
        .subscribe((courseHandicap: CourseHandicapDetails)=>{
            console.log("getting latest course handicap",courseHandicap)
           this.scorecard.playerRoundScores[idx].playerHandicap = courseHandicap.handicap;
        }, (error)=> {

        })
    }

    _playerInSlot(player: PlayerInfo): PlayerRoundScores {
        // this.selectedCountry = countryList.filter((c: Country, idx: number) => {
        //     return c.id == this.searchCriteria.countryId
        // }).pop();
        return (this.scorecard.playerRoundScores.filter((prs: PlayerRoundScores, idx: number) => {
            return prs.playerId === player.playerId
        }).pop());
        // if (slot === 1)
        //     return this.currentPlayer;
        // else if (this.slotFilled(slot)) {
        //     return this.otherPlayers[slot - 2]
        // }
        // else return null;
    }


    onPlayerHandicapClick(_player: PlayerRoundScores) {
        let player = _player; //this._playerInSlot(slot);
        if (!player) return;
        let prompt = this.alertCtl.create({
            title  : "Player Handicap",
            message: "Enter a value to override the calculated player handicap for this game.",
            inputs : [
                {
                    name       : 'handicap',
                    type       : 'number',
                    value      : player.playerHandicap + "",
                    placeholder: 'Hcp allowed from -10 to 36'
                }
            ],
            buttons: [
                {
                    text   : 'Cancel',
                    role   : 'cancel',
                    handler: data => {
                        if (this.platform.is('ios') && this.platform.is('cordova'))
                            this.keyboard.close();
                        console.log('Cancel clicked');
                        prompt.dismiss().then(() => {
                            return false;
                        });
                        return false;
                    }
                },
                {
                    text   : 'Change',
                    handler: (data) => {
                        console.log("handicap:", parseInt(data.handicap));
                        if (this.platform.is('ios') && this.platform.is('cordova'))
                            this.keyboard.close();
                        let newHandicap = parseInt(data.handicap);
                        // console.log("newHandicap : ",newHandicap)
                        if (isPresent(data) && isPresent(data.handicap)) {
                            
                            if (newHandicap && ( newHandicap > 36 || newHandicap < -10 )) {
                                prompt.dismiss().then(() => {
                                    let subTitle = "Please enter value from -10 to 36";
                                    MessageDisplayUtil.showErrorToast(subTitle, this.platform,
                                        this.toastCtl, 3000, "bottom");
                                });
                                return false;

                            }
                            else if (newHandicap || newHandicap === 0) {
                                
                                player.playerHandicap = newHandicap;
                                prompt.dismiss().then(() => {
                                    console.log("[Handicap] Success : ",player.playerHandicap, newHandicap)
                                    return false;
                                });

                            }
                        }
                        return false;
                    }
                }
            ]
        });
        prompt.present();
    }

    checkHcpValid(hcp: number) {
        if(hcp >= -10 && hcp <= 36)
            return true
    }

    
    getPlayerRoundStatus(playerRoundScores: PlayerRoundScores) {
        let _status;
        if(!playerRoundScores) return;
        if(playerRoundScores && !playerRoundScores.status) return;
        if(playerRoundScores.status.toLowerCase().includes('withdraw'))
            _status = 'W'
        else _status = null;
        return _status;
    }
}




