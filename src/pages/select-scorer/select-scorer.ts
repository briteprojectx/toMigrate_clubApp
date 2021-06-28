import {Component} from '@angular/core';
import {
    ActionSheetController,
    AlertController,
    Events,
    Loading,
    LoadingController,
    NavController,
    NavParams,
    ToastController
} from 'ionic-angular';
import * as moment from 'moment';
import {
    CompetitionDetails,
    CompetitionInfo,
    CompetitionPlayerInfo,
    FlightInfo,
    FlightMember
} from '../../data/competition-data';
import {PlayerInfo} from '../../data/player-data';
import {MessageDisplayUtil} from '../../message-display-utils';
import {GameFinished} from '../../mygolf-events';
import {CompetitionService} from '../../providers/competition-service/competition-service';
import {PlayerService} from '../../providers/player-service/player-service';
import {PushNotificationService} from '../../providers/pushnotification-service/pushnotification-service';
import {ScorerStateActions} from '../../redux/scorer-state/scorer-state-actions';
import {EventLogListPage} from '../event-log/eventlog-list';
import {ScorecardLocalListPage} from '../scorecard-local-list/scorecard-local-list';
import {Subscription} from 'rxjs/Subscription';
import {ScorerStateDataService} from '../../redux/scorer-state/scorer-state-data-service';
import {ScoringStage} from '../../redux/scorer-state/scorer-state';
import {GameRoundScoringPage} from '../gameround-scoring/gameround-scoring';
import {CurrentScorecardDataService} from '../../redux/scorecard/current-scorecard-data-service';
import {SessionActions} from '../../redux/session/session-actions';
import {Network} from '@ionic-native/network';
/*
 Generated class for the SelectScorer page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector   : 'page-select-scorer',
    templateUrl: 'select-scorer.html'
})
export class SelectScorerPage {
    competition: CompetitionInfo;
    details: CompetitionDetails;
    scorers: Array<CompetitionPlayerInfo> = [];
    flights: Array<FlightInfo>            = [];
    filteredFlights: Array<FlightInfo>    = [];
    attempted: boolean                    = false;
    searchQuery: string                   = "";
    scoringBy:  string                    = "Flight"; // Flight or Hole
    scoringMode: boolean = false;
    startingHole: number;

    // pushInfo: PushServerInfo;

    private scoringStageSubscription: Subscription;

    constructor(public navCtrl: NavController,
        public alertCtl: AlertController,
        public actionCtl: ActionSheetController,
        public navParams: NavParams,
        public scorerStateActions: ScorerStateActions,
        public scorerStateService: ScorerStateDataService,
        public currentScorecardService: CurrentScorecardDataService,
        public playerService: PlayerService,
        public compService: CompetitionService,
        private loadingCtl: LoadingController,
        private pushService: PushNotificationService,
        private sessionActions: SessionActions,
        private events: Events,
        private network: Network,
        private toastCtl: ToastController) {
        this.competition = navParams.get("competition");
        this.scoringMode = navParams.get("scoringMode");

    }

    ionViewDidEnter() {
        this.scoringStageSubscription = this.scorerStateService.scorerState()
                                            .map(state=>state.scoringStage)
                                            .subscribe(scortingStage=>{
                                                switch(scortingStage){
                                                    case ScoringStage.Ready:
                                                        this.goScoring();
                                                }
                                            });
        this._refresh();
    }
    ionViewWillLeave() {
        if(this.scoringStageSubscription) this.scoringStageSubscription.unsubscribe();
    }

    exit() {
        let alert = this.alertCtl.create({
            title  : "Exit Scoring",
            message: "Do you want to logout ?",
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
                        this.sessionActions.logout();
                    });
                    return false;
                }
            }]
        });
        alert.present();
    }

    onRefreshClick(refresher) {
        if (refresher)
            refresher.complete();
        this._refresh();
    }

    openMenu() {
        let buttons = [];

        buttons.push({
            text   : 'Local Scorecards',
            handler: () => {
                actionSheet.dismiss()
                           .then(() => {
                               this.showLocalScorecards();
                           });
                return false;

            }
        });
        buttons.push({
            text   : 'Event Logs',
            handler: () => {
                actionSheet.dismiss()
                           .then(() => {
                               this.showEventLogs();
                           });
                return false;

            }
        });

        let actionSheet = this.actionCtl.create({
            buttons: buttons
        });
        actionSheet.present();
    }
    connectionOn(){
        return this.network.type !== 'none' && this.network.type !== 'unknown';
    }
    showLocalScorecards() {
        this.navCtrl.push(ScorecardLocalListPage);
    }

    showEventLogs() {
        this.navCtrl.push(EventLogListPage);
    }

    private _refresh() {
        let loading = this.loadingCtl.create({
            content: "Please wait..."
        });
        loading.present().then(() => {
            this.attempted = false;
            this.compService.getDetails(this.competition.competitionId)
                .subscribe((details: CompetitionDetails) => {
                    this.details = details;
                    this.compService.getFlights(this.competition.competitionId, details.roundInProgress)
                        .subscribe((flights: Array<FlightInfo>) => {
                            flights.forEach(flight => {
                                flight.flightMembers = flight.flightMembers.filter(fm => {
                                    return fm.scorer && fm.status !== 'Withdrawn';
                                });
                            });
                            this.filteredFlights = this.flights = flights;
                            loading.dismiss().then(() => {
                                this.attempted = true;
                            });
                        });
                }, (error) => {
                    loading.dismiss().then(() => {
                        let msg = MessageDisplayUtil.getErrorMessage(error,
                            "Error getting scoring round number");
                        this._displayError(msg);
                        this.attempted = true;
                    });
                });
        });
    }

    selectPlayer(compPlayer: CompetitionPlayerInfo){

        let scoreInfo = {
            competitionId: this.competition.competitionId,
            scorerId: compPlayer.playerId
        }


    }
    selectFlightMember(playerId: number) {
        this.scorerStateActions.selectScorer(this.competition,
            this.details.roundInProgress, playerId);

    }
    private goScoring() {
        let reloadScorecard: boolean = false;
        if(this.scoringMode) reloadScorecard = true;
        this.currentScorecardService.scorecard()
            .take(1)
            .subscribe(scorecard => {
                this.scorerStateService.scorerState().take(1)
                    .subscribe(scorerState=>{
                        if(scorerState.scoringPlayer && scorerState.scoringCompetition){
                            this.navCtrl.push(GameRoundScoringPage, {
                                currentPlayer   : scorerState.scoringPlayer,
                                scorecard       : scorecard,
                                editingScorecard: false,
                                competition     : scorerState.scoringCompetition,
                                allowLogout     : true,
                                // reloadScorecard : reloadScorecard,
                                scoringMode     : this.scoringMode,
                                startingHole    : this.startingHole,
                            }).then(() => {
                                this.scorerStateActions.setScoringStage(ScoringStage.Scoring);
                                this.navCtrl.remove(1,1)
                            });
                        }
                        else {
                            console.error("Peculiar state");
                        }
                    });

            });
    }


    onSearchInput($event) {
        this.filteredFlights = this.flights.filter((fp: FlightInfo, idx: number) => {
            let count = fp.flightMembers.filter((fm: FlightMember) => {
                return fm.playerName.toLowerCase().indexOf(this.searchQuery.toLowerCase()) >= 0
                    || fp.flightNumber.toLowerCase().indexOf(this.searchQuery.toLowerCase()) >= 0;
            }).length;
            return count > 0;
        });
    }

    onSearchCancel() {

    }

    private _displayError(error: string) {
        let toast = this.toastCtl.create({
            message : error,
            duration: 3000
        });
        toast.present();
    }

    convStartTime(flightTime) {
        return moment(flightTime).format("HH:mm")
    }


}
