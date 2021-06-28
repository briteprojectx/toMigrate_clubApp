import {Component, Renderer, ViewChild} from '@angular/core';
import {Toast} from '@ionic-native/toast';
import {
    ActionSheetController,
    AlertController,
    Events,
    LoadingController,
    ModalController,
    Platform,
    Segment,
    Slides,
    ToastController
} from 'ionic-angular';
import {NavController, NavParams} from 'ionic-angular/index';
// import {isPresent} from 'ionic-angular/util/util';
import {CourseInfo} from '../../data/club-course';
import {CompetitionInfo} from '../../data/competition-data';
import {PlayerInfo} from '../../data/player-data';
// import {PlainScorecard, PlayerRoundScores, PlayerScore} from '../../data/scorecard';
import * as global from '../../globals';
import {adjustViewZIndex} from '../../globals';
import {TranslationService} from '../../i18n/translation-service';
import {MessageDisplayUtil} from '../../message-display-utils';
// import * as GolfEvents from '../../mygolf-events';
import {CompetitionService} from '../../providers/competition-service/competition-service';
import {NormalgameService} from '../../providers/normalgame-service/normalgame-service';
import {
    AbstractNotificationHandlerPage,
    MygolfToastOptions,
    NotificationHandlerInfo
} from '../../providers/pushnotification-service/notification-handler-constructs';
import {ScorecardService} from '../../providers/scorecard-service/scorecard-service';
import {SessionDataService} from '../../redux/session/session-data-service';
import {MyGolfStorageService} from '../../storage/mygolf-storage.service';
import {LeaderboardPage} from '../competition/competition-leaderboard/competition-leaderboard';
import {GameRoundScoringPage} from '../gameround-scoring/gameround-scoring';
import {ChangeCoursePage} from '../normalgame/change-course/change-course';
// import {DeleteScorecardModal} from './delete-scorecard-modal';
import {CourseDisplay, PlayerDisplay, PlayerTotals} from './handicap-history-details-data';
import {CurrentScorecardActions} from '../../redux/scorecard/current-scorecard-actions';
import {SessionActions} from '../../redux/session/session-actions';
// import { HandicapScore } from '../../data/handicap-history';
import { HandicapGameRound, HandicapScore, PlainScoreCard, PlayerRoundScores, PlayerScore} from '../../data/mygolf.data';
// import { HandicapService } from '../../providers/handicap-service/handicap-service';
/**
 * Created by Ashok on 17-05-2016.
 */

@Component({
    templateUrl: 'handicap-history-details.html',
    selector   : 'handicap-history-details-page'
})
export class HandicapHistoryDetailsPage
{
    display: string                        = 'scorecard';
    scorecard: PlainScoreCard;
    competition: CompetitionInfo;
    coursesToDisplay: Array<CourseDisplay> = [];
    playerTotals: Array<PlayerTotals>      = [];
    loggedInUser: number;
    scoreDisplay: string;
    scoreDisplayBoolean: boolean;
    editing: boolean                       = false;
    fromScoringPage: boolean               = false;
    nullHandicaps: number                  = 0;
    @ViewChild('scorecardSlider') slider: Slides;
    @ViewChild('segment') segment: Segment;
    sliderOptions: any;
    hideReload: boolean = false;
    hideHomeButton: boolean = false;
    public scoringBy:  string                    = "Flight"; // Flight or Hole
    currentPlayer: PlayerInfo;
    public buggyNo?: string;
    gameRound: HandicapGameRound;
    scoresToDisplay: Array<HandicapScore> = [];
    constructor(private nav: NavController,
        private renderer: Renderer,
        private modalCtl: ModalController,
        private actionSheetCtl: ActionSheetController,
        private alertCtl: AlertController,
        private loadingCtl: LoadingController,
        private toastCtl: ToastController,
        private toast: Toast,
        private navParams: NavParams,
        private compService: CompetitionService,
        private scorecardService: ScorecardService,
        private sessionActions: SessionActions,
        private sessionService: SessionDataService,
        private currentScorecardActions: CurrentScorecardActions,
        private translation: TranslationService,
        private dbStorage: MyGolfStorageService,
        private platform: Platform,
        private events: Events,
        private normalGameService: NormalgameService
        ) {
        this.sliderOptions       = {
            pager: false
        };
        this.scorecard           = navParams.get("scorecard");
        this.editing             = navParams.get("editing");
        this.fromScoringPage     = navParams.get("fromScoringPage");
        this.competition         = navParams.get("competition");
        this.hideHomeButton = navParams.get("hideHomeButton");
        this.hideReload = navParams.get("hideReload");
        this.currentPlayer = navParams.get("currentPlayer");
        this.buggyNo = navParams.get("buggyNo");
        this.scoreDisplay        = 'Gross';
        this.scoreDisplayBoolean = false;
        this.gameRound           = navParams.get("gameRound");

    }
    ionViewDidLoad() {
        this.sessionService.getSession().take(1)
            .map(session=>session.playerId)
            .filter(Boolean)
            .subscribe(playerId=>{
                this.loggedInUser = playerId;
            });

    }
    ionViewDidEnter() {
        adjustViewZIndex(this.nav, this.renderer);
        console.log("Handicap Details : ", this.gameRound)
        this._prepareHandicapRoundDisplay();
        // if (this.scorecard) {
        //     this.currentScorecardActions.scorecardDisplay = this;
        //     this.nullHandicaps = this.scorecard.playerRoundScores
        //                              .filter((prs) => {
        //                                  return !isPresent(prs.playerHandicap);
        //                              }).length;
        //     this.normalGameService.deriveIndexToUse(this.scorecard);
        //     this._prepareScorecardDisplay();
        // }

    }
    ionViewWillLeave() {
        this.currentScorecardActions.scorecardDisplay = null;
    }
    onSlideDidChange() {
        let activeIndex = this.slider.getActiveIndex();
        if (activeIndex === 0)
            this.display = 'scorecard';
        else this.display = 'totals';

    }

    public getNotifications(): Array<NotificationHandlerInfo> {
        let notifications = new Array<NotificationHandlerInfo>();
        notifications.push({
            type       : AbstractNotificationHandlerPage.TYPE_FLIGHTS_CHANGED,
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

    public handleNotification(type: string, message: string, notfData: any) {
        if (global.SharedObject.homeInfo) {
            global.SharedObject.homeInfo.needRefresh = true;
        }

        this.toast.showWithOptions({
            message : message,
            duration: 1500,
            styling : MygolfToastOptions.NotificationToastStyle
        }).subscribe((result) => {
            if (!result || !result.event || result.event === 'show') {
                if (type === AbstractNotificationHandlerPage.TYPE_SCORING_FINISHED && this.competition &&
                    this.fromScoringPage) {
                    let compId       = this.competition.competitionId;
                    let roundNo      = this.scorecard.roundNumber;
                    let showLdrBoard = this.competition.showLeaderBoard;
                    if (showLdrBoard) {
                        this.nav.push(LeaderboardPage, {
                            competition: compId,
                            roundNo    : roundNo
                        }).then(() => {
                            //Remove all the pages in between
                            this.nav.remove(1, this.nav.length() - 2);
                        });
                    }
                    else this.nav.popToRoot();
                }
                else if (type === AbstractNotificationHandlerPage.TYPE_COMPETITION_CANCELLED && this.competition) {
                    let compCancelled = notfData.competitionCancelled;
                    if (compCancelled && compCancelled === this.competition.competitionId) {
                        this.nav.popToRoot();
                    }
                    //Else do nothing
                }
            }
        });

    }

    gotoSlide(slide: number) {
        this.slider.slideTo(slide, 500, true);
    }

    // onSwipe(event) {
    //     if (event.direction === 2) {
    //         if (this.display === 'scorecard')
    //             this.display = "totals";
    //     }
    //     else if (event.direction === 4) {
    //         if (this.display !== 'scorecard')
    //             this.display = "scorecard";
    //     }
    //
    // }

    public getScorecard() {
        return this.scorecard;
    }

    showRoundNumber() {
        return this.scorecard.competition && this.scorecard.competitionRound;
    }

    private _prepareHandicapRoundDisplay() {
        this.scoresToDisplay = [];
        // let score = new HandicapScore();
        if(this.gameRound) {
            this.scoresToDisplay = this.gameRound.scores;
        //     this.gameRound.scores.forEach((s: HandicapScore) => {
        //     score.holeNo = s.holeNo;
        //     score.holePar = s.holePar;
        //     score.holeIndex = s.holeIndex;
        //     score.grossScore = s.grossScore;
        //     score.adjustedScore = s.adjustedScore;
        //     score.holePlayed = s.holePlayed;
        //     // this.scoresToDisplay.push(score);
        //     console.log("Scores hole by hole ",s)

        // })
        
        console.log("Scores to display ",this.scoresToDisplay)
    }
    }

    private _prepareScorecardDisplay() {
        this.playerTotals     = [];
        this.coursesToDisplay = [];
        this.scorecard.courses.forEach((c: CourseInfo) => {
            let cd        = new CourseDisplay();
            cd.courseName = c.courseName;
            cd.holes      = c.holes;
            cd.coursePar  = c.coursePar;
            cd.players    = [];
            cd.indexToUse = c.indexToUse;
            this.scorecard.playerRoundScores.forEach((prs: PlayerRoundScores) => {
                let pd         = new PlayerDisplay();
                pd.playerName  = prs.playerName;
                pd.handicap    = prs.playerHandicap;
                pd.playerId    = prs.playerId;
                pd.playerRound = prs;
                pd.whichNine   = c.whichNine;
                let pt         = prs.totals.filter(t => {
                    return t.whichNine === c.whichNine
                })[0];

                pd.nineTotal    = pt.grossTotal;
                pd.nineNetTotal = pt.netTotal;
                pd.scores       = prs.scores.filter((s: PlayerScore) => {
                    return s.whichNine == c.whichNine;
                });
                cd.players.push(pd);

            });
            this.coursesToDisplay.push(cd);
        });
        this.scorecard.playerRoundScores.forEach((prs: PlayerRoundScores) => {

            let pt             = new PlayerTotals();
            pt.playerName      = prs.playerName;
            pt.handicap        = prs.playerHandicap;
            pt.firstNineGross  = prs.frontNineTotal;
            pt.firstNineNet    = prs.frontNineNetTotal;
            pt.secondNineGross = prs.backNineTotal;
            pt.secondNineNet   = prs.backNineNetTotal;
            pt.playerRound     = prs;
            pt.totalGross      = pt.firstNineGross + pt.secondNineGross;
            pt.totalNet        = pt.firstNineNet + pt.secondNineNet;
            this.playerTotals.push(pt);
        });

    }

    getNineTotal(prs: PlayerRoundScores, whichNine: number, net: boolean) {
        let pt = prs.totals.filter(t => {
            return t.whichNine === whichNine;
        })[0];
        if (net)
            return pt.netTotal;
        else return pt.grossTotal;
    }

    toggleScoreDisplay() {
        this.scoreDisplayBoolean = !this.scoreDisplayBoolean;
        if (this.scoreDisplayBoolean)
            this.scoreDisplay = 'Net';
        else this.scoreDisplay = 'Gross';
    }

    onHomeClick() {
        this.nav.popToRoot();
    }

    onMenuFilterClick() {

        let scoretype = (this.scoreDisplay === "Gross") ? "Net" : "Gross";
        let btns      = [];
        if (!this.scorecard.competition && this.editing) {
            btns.push({
                text   : 'Edit',
                role   : 'destructive',
                icon   : 'brush',
                handler: () => {
                    alert.dismiss()
                         .then(() => {
                             this.nav.push(GameRoundScoringPage, {
                                 scorecard       : this.scorecard,
                                 currentPlayer: this.currentPlayer,
                                 editingScorecard: true,
                             });
                         });
                    return false;
                }
            });
            btns.push({
                text   : 'Delete',
                role   : 'destructive',
                icon   : 'trash',
                handler: () => {
                    alert.dismiss()
                         .then(() => {
                            //  this._confirmAndDelete();
                         });
                    return false;
                }
            });
        }
        if (this.scorecard.competition && this.fromScoringPage && !this.hideReload) {
            btns.push({
                text   : 'Reload scorecard',
                role   : 'destructive',
                icon   : "refresh",
                handler: () => {
                    alert.dismiss()
                         .then(() => {

                             this.reloadScorecard(null);
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
                        alert.dismiss()
                             .then(() => {
                                 let modal = this.modalCtl.create(ChangeCoursePage, {
                                     currentCourse   : c,
                                     clubId          : this.scorecard.clubId,
                                     scorecard       : this.scorecard,
                                     editingScorecard: this.editing
                                 });
                                 modal.onDidDismiss((course: CourseInfo) => {
                                     this._prepareScorecardDisplay();
                                 });
                                 modal.present();
                             });

                        return false;
                    }
                });
            });
        }
        if (this.display === 'scorecard')
            btns.push({
                text   : 'Display : ' + scoretype,
                icon   : "calculator",
                handler: () => {
                    alert.dismiss().then(() => {
                        this.toggleScoreDisplay();
                    });
                    return false;
                }
            });
        btns.push({
            text   : 'Cancel',
            role   : 'cancel', // will always sort to be on the bottom
            icon   : !this.platform.is('ios') ? 'close' : null,
            handler: () => {
                alert.dismiss();
                return false;
            }
        });
        let alert = this.actionSheetCtl.create({
            buttons: btns
        });

        alert.present();

    }

    /**
     * Confirm whether to save the scorecard or not
     * @private
     */
    confirmAndSave() {
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
                                   this._saveScorecard();
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
    private _saveScorecard() {
        this.scorecardService.saveNormalGameScorecard(this.scorecard)
            .subscribe((scorecard) => {
                this.nav.pop();
            }, (error) => {
                let msg = MessageDisplayUtil.getErrorMessage(error);
                MessageDisplayUtil.displayErrorAlert(this.alertCtl,
                    "Saving Scores",
                    msg, "OK");
            });
    }

    /**
     * Reloads the scorecard from the database for competition
     * @private
     */
    public reloadScorecard(refresher) {
        if (this.scorecard.competition && this.scorecard.competitionId) {
            let loader = this.loadingCtl.create({
                content     : "Reloading...",
                showBackdrop: false
            });
            loader.present().then(() => {
                this.compService.getOrCreateScorecard(this.scorecard.competitionId)
                    .subscribe((scorecard: PlainScoreCard) => {
                        if (refresher) refresher.complete();
                        loader.dismiss().then(() => {
                            this._scorecardReloaded(scorecard);
                        });
                    }, (error) => {
                        if (refresher) refresher.complete();
                        loader.dismiss();
                    }, () => {

                    });
            })
        }
        else {
            if (refresher) refresher.complete();
        }

    }

    _scorecardReloaded(scorecard: PlainScoreCard) {
        this.scorecard = scorecard;
        this._prepareScorecardDisplay();
        if (this.fromScoringPage) {
            this.events.publish("scorecardReloaded", scorecard);
        }
    }

    /**
     * Checks whether all scores are in
     * @returns {boolean}
     */
    allScoresIn() {
        // let totalScoring = this.scorecard.playerRoundScores.filter((prs) => {
        //     return prs.scoringPlayerId == this.loggedInUser && prs.status === 'I';
        // }).length;
        // if (!this.editing && this.fromScoringPage && this.scorecard && totalScoring > 0)
        //     return ScorecardService.isAllScoresIn(this.scorecard, this.loggedInUser);

        // else return false;
    }

    needToSave() {
        if (this.editing && this.scorecard.dirty && !this.scorecard.competition)
            return true;
        else return false;
    }

    getScoreToDisplay(score: PlayerScore) {
        if (this.scoreDisplay === "Net")
            return score.netScore;
        else return score.actualScore;
    }

    isHoleInOne(score: PlayerScore) {
        return score.actualScore === 1;
    }

    deriveClasses(score: HandicapScore, adjusted: boolean = false) {
        // if (this.scorecard && this.scorecard.scoringFormat
        //     && "stableford" === this.scorecard.scoringFormat.toLowerCase()
        //     && this.scoreDisplay === "Net")
        //     return "";
        if (score.grossScore === 1)
            return "hole-in-one";
        let diff   = (adjusted)
            ? score.adjustedScore - score.holePar
            : score.grossScore - score.holePar;
        let result = "";
        switch (diff) {
            case -3:
                result = "score-albatross";
                break;
            case -2:
                result = "score-eagle"
                break;
            case -1:
                result = "score-birdie";
                break;
            case 0:
                result = "score-par"
                break;
            case 1:
                result = "";
                break;
            case 2:
                result = "";
                break;
            case 3:
                result = "";
                break;
            default:
                result = ""
        }
        return result;
    }

    // private _confirmAndDelete() {
    //     let deleteConfirm = this.modalCtl.create(DeleteScorecardModal, {
    //         scorecard: this.scorecard
    //     });
    //     deleteConfirm.onDidDismiss((data: any) => {
    //         let deleteOpt = data.delete;
    //         if ("all" === deleteOpt)
    //             this._deleteScorecard(true);
    //         else if ("my" === deleteOpt)
    //             this._deleteScorecard(false);
    //     });
    //     deleteConfirm.present();

    // }

    // private _deleteScorecard(deleteAll: boolean) {
    //     this.scorecardService
    //         .deleteNormalGameScorecard(this.scorecard.gameRoundId, deleteAll)
    //         .subscribe(() => {
    //             this.nav.pop()
    //                 .then(() => {
    //                     this.events.publish(GolfEvents.ScorecardDeleted, this.scorecard);
    //                 });
    //         });
    // }

    onGameFinishClick() {
        console.log("Before finishing : ",this.scorecard)
        let confirm = this.alertCtl.create({
            title  : this.translation.translate("ScoringPage.GameFinishTitle"),
            message: this.translation.translate("ScoringPage.GameFinishMessage"),
            buttons: [
                {
                    text   : this.translation.translate("ScoringPage.GameFinishNo"),
                    role   : "cancel",
                    handler: () => {
                        confirm.dismiss();
                        return false;
                    }
                },
                {
                    text   : this.translation.translate("ScoringPage.GameFinishYes"),
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

    private _finishGame() {
        let busy = this.loadingCtl.create({
            content     : 'Finishing Game...',
            showBackdrop: false
        });
        console.log("Finishing game : ",this.scorecard)
        busy.present().then(()=>{
            this.currentScorecardActions.finishCurrentGame(this.scorecard,
                this.currentPlayer.playerId)
                .subscribe((scorecard: PlainScoreCard)=>{
                    busy.dismiss().then(()=>{

                        this._onGameFinished(scorecard, true);
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

    private _onGameFinished(scorecard: PlainScoreCard, success: boolean, msg?: string) {
        if (success) {
            // if (global.SharedObject.homeInfo)
            //     global.SharedObject.homeInfo.needRefresh = true;
            // this.events.publish(GolfEvents.GameFinished, scorecard);
            if (this.competition) {

                let comp    = this.competition;
                let roundNo = this.scorecard.roundNumber;
                if (comp.showLeaderBoard) {
                    this.nav.push(LeaderboardPage, {
                        competition: comp,
                        roundNo    : roundNo,
                        showLogout : this.hideHomeButton,
                        hideHomeButton: this.hideHomeButton
                    }).then(() => {
                        this.nav.remove(1, this.nav.length() - 2);
                    });
                }
                else{
                    if(this.hideHomeButton)
                        this.sessionActions.logout();
                    else
                        this.nav.popToRoot();
                }
                    // this.nav.popToRoot();
            }
            else {
                this.nav.popToRoot();
            }
        }
        else {
            NormalgameService.saveGameLocally(this.dbStorage, this.scorecard);
            MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl, 5000, "bottom");
        }
    }

    getTotalCoursePar(gameRound: HandicapGameRound) {
        let scores: Array<HandicapScore> = []
        scores = this.gameRound.scores;
        let total = scores
        .map((s: HandicapScore) => {
            return s.holePar
        })
        .reduce((a: number, b: number) => a + b);
        return total;
    //     let total = this.gameRound.playerRoundScores
    //                     .filter((prs: PlayerRoundScores) => {
    //                         return this.currentPlayer.playerId === prs.scoringPlayerId;
    //                     })
    //                     .map((prs: PlayerRoundScores) => {
    //                         return prs.scores.filter((s: PlayerScore) => {
    //                             return !s.actualScore;
    //                         }).length;
    //                     }).reduce((a: number, b: number) => a + b);

    }

        getTeeColor(color: string) { 
        if(color === 'White') {
            return 'light'
        } else if(color === 'Red') {
            return 'danger'
        } else if(color === 'Black') {
            return 'dark'
        } else if(color === 'Blue') {
            return 'secondary'
        } else if(color === 'Gold') {
            return 'gold'
        }
        else return 'secondary'
    }
}
