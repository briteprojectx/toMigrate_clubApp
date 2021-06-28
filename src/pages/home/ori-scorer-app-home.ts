import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BatteryStatusResponse} from '@ionic-native/battery-status';
import {
    ActionSheetController,
    AlertController,
    App,
    Loading,
    LoadingController,
    NavController,
    Platform,
    ToastController
} from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {CurrentUser, SessionInfo, SessionState} from '../../data/authentication-info';
import {CompetitionInfo} from '../../data/competition-data';
import {DeviceService} from '../../providers/device-service/device-service';
import {PushNotificationService} from '../../providers/pushnotification-service/pushnotification-service';
import {CurrentScorecardDataService} from '../../redux/scorecard/current-scorecard-data-service';
import {ScoringStage} from '../../redux/scorer-state/scorer-state';
import {ScorerStateActions} from '../../redux/scorer-state/scorer-state-actions';
import {ScorerStateDataService} from '../../redux/scorer-state/scorer-state-data-service';
import {ServerInfoActions} from '../../redux/server/serverinfo-actions';
import {SessionActions} from '../../redux/session/session-actions';
import {SessionDataService} from '../../redux/session/session-data-service';
import {AboutPage} from '../about/about';
import {EventLogListPage} from '../event-log/eventlog-list';
import {GameRoundScoringPage} from '../gameround-scoring/gameround-scoring';
import {ScorecardLocalListPage} from '../scorecard-local-list/scorecard-local-list';
import {SelectScorerPage} from '../select-scorer/select-scorer';
import {WebsocketActions, DESTINATION_BATTERY_LEVEL} from '../../redux/wstomp';

import 'rxjs/add/operator/throttleTime';
import { FlightBuggyListsPage } from '../booking/flight-buggy-lists/flight-buggy-lists';
import { TeeFlightListsPage } from '../booking/tee-flight-lists/tee-flight-lists';
import { StarterFlightListsPage } from '../booking/starter-flight-lists/starter-flight-lists';



/**
 * Created by ashok on 15/05/17.
 */
@Component({
    selector   : 'page-home',
    templateUrl: 'ori-scorer-app-home.html'
})
export class OriScorerAppHomePage {
    private signInLoader: Loading;
            showPassword: boolean = false;
            credential: FormGroup;
            session$: Observable<SessionInfo>;
            showLoginForm: Observable<boolean>;
            sessionState$: Observable<SessionState>;
            loggedIn$: Observable<boolean>;
            refreshTried$: Observable<boolean>;
            totalComps$: Observable<number>;
            activeCompetitions$: Observable<CompetitionInfo[]>;
    private sessionStateSubscription: Subscription;
    private scoringStageSubscription: Subscription;
    private logoutSubscription: Subscription;
    private errorSubscription: Subscription;
    private batterySubscription: Subscription;
    public scoringMode: boolean = true; //Flight

    constructor(public navCtrl: NavController,
        private app: App,
        private platform: Platform,
        private toastCtl: ToastController,
        private alertCtl: AlertController,
        private actionCtl: ActionSheetController,
        private loadingCtl: LoadingController,
        private formBuilder: FormBuilder,
        private pushService: PushNotificationService,
        private serverActions: ServerInfoActions,
        private sessionActions: SessionActions,
        private sessionDataService: SessionDataService,
        private scorerStateActions: ScorerStateActions,
        private scorerStateService: ScorerStateDataService,
        private deviceService: DeviceService,
        private websocketActions: WebsocketActions,
        private currentScorecardService: CurrentScorecardDataService) {
        this.credential = this.formBuilder.group({
            email   : ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    updateScoringMode() {
        console.log("Scoring Mode ",this.scoringMode)
    }

    ionViewDidLoad() {
        this.platform.ready().then(() => {
            console.log("Checking server version");
            this.pushService.setControllers(this.app, this.navCtrl, this.alertCtl, this.toastCtl);
            this._initOnLoad();

        });
        this.session$            = this.sessionDataService.getSession();
        this.showLoginForm       = this.sessionDataService.showLoginForm();
        this.sessionState$       = this.sessionDataService.getSessionStatus();
        this.loggedIn$           = this.sessionState$.map(state => {
            return state === SessionState.LoggedIn
        });
        this.activeCompetitions$ = this.scorerStateService.activeCompetitions();
        this.totalComps$         = this.activeCompetitions$.map(comps => {
            if (comps) {
                return comps.length;
            } else {
                return 0;
            }
        });
        this.refreshTried$       = this.scorerStateService.scorerState()
                                       .map(scorerState => scorerState.refreshTried);
        //Prepare for the sign in busy loader
        this._signInBusy();
        this.sessionDataService.showLoginForm().subscribe((show: boolean) => {
            if (show) {
                this.sessionDataService.getCurrentUser()
                    .subscribe((currUser: CurrentUser) => {
                        this.credential.setValue({
                            email   : currUser.userName ? currUser.userName : "",
                            password: currUser.password ? currUser.password : ""
                        });
                    });
            }
        });
        this.logoutSubscription  = this.sessionDataService.getSessionStatus()
                                       .distinctUntilChanged()
                                       .subscribe((state) => {
                                           switch (state) {
                                               case SessionState.LoggedOut:
                                                   if (this.navCtrl.length() > 1) {
                                                       this.navCtrl.remove(1, this.navCtrl.length() - 1);
                                                   }
                                               default:
                                           }
                                       });
        if (this.platform.is('cordova')) {
            this.batterySubscription = this.deviceService.getBatteryChange()
                                           .throttleTime(30000)
                                           .subscribe((battery: BatteryStatusResponse) => {
                                                let info: any = {
                                                    deviceId: this.deviceService.getCachedDeviceInfo().deviceId,
                                                    level: battery.level,
                                                    charging: battery.isPlugged
                                                }
                                                this.websocketActions.sendMessage(DESTINATION_BATTERY_LEVEL,
                                                    info);
                                           });
        }
    }

    ionViewDidEnter() {
        this.scoringStageSubscription = this.scorerStateService.scorerState()
                                            .map(scorerState => scorerState.scoringStage)
                                            .distinctUntilChanged()
                                            .subscribe(scoringStage => {
                                                switch (scoringStage) {
                                                    case ScoringStage.CompetitionSelected:
                                                        this.activeCompetitions$
                                                            .take(1)
                                                            .subscribe(comp => {
                                                                this.selectScorer(comp[0]);
                                                            });
                                                        break;
                                                    case ScoringStage.Ready:
                                                        this.goScoring();
                                                        break;
                                                }
                                            });
        this.errorSubscription        = this.scorerStateService.currentError()
                                            .takeWhile(curError => curError.error)
                                            .pluck('exception')
                                            // .distinctUntilChanged()
                                            .filter(Boolean)
                                            .subscribe((exception: string) => {
                                                let toast = this.toastCtl.create({
                                                    message        : exception,
                                                    showCloseButton: true,
                                                    closeButtonText: "OK"
                                                });
                                                toast.present().then(() => {
                                                    this.scorerStateActions.clearErrorState();
                                                })
                                            })
    }

    ionViewWillLeave() {
        if (this.scoringStageSubscription) this.scoringStageSubscription.unsubscribe();
        if (this.errorSubscription) this.errorSubscription.unsubscribe();
    }

    ionViewWillUnload() {
        if (this.sessionStateSubscription) {
            this.sessionStateSubscription.unsubscribe();
        }
        if (this.logoutSubscription) this.logoutSubscription.unsubscribe();
        if (this.batterySubscription) this.batterySubscription.unsubscribe();
    }

    private _initOnLoad() {
        //This will trigger the server info download and matching the
        //Server version with client
        this.serverActions.refresh();
    }

    showLocalScorecards() {
        this.navCtrl.push(ScorecardLocalListPage);
    }

    showEventLogs() {
        this.navCtrl.push(EventLogListPage);
    }

    showVersion() {
        this.navCtrl.push(AboutPage);
    }

    selectScorer(competition: CompetitionInfo) {
        this.navCtrl.push(SelectScorerPage, {
            competition: competition,
            scoringMode: this.scoringMode
        });
    }

    signIn() {
        console.log(this.credential.value);
        this.sessionActions.login(this.credential.value.email,
            this.credential.value.password);
    }

    signOut() {
        this.sessionActions.logout();
    }

    openMenu() {
        this.loggedIn$.take(1)
            .subscribe((loggedIn) => {
                this._openActionSheet(loggedIn);
            })
    }

    refreshComps() {
        this.scorerStateActions.refreshCompetitions();
    }

    private _openActionSheet(loggedIn: boolean) {
        let buttons = [];
        buttons.push({
            text   : 'Show Version',
            handler: () => {
                actionSheet.dismiss()
                           .then(() => {
                               this.showVersion();
                           });
                return false;
            }
        });
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
        if (loggedIn) {
            buttons.push({
                text   : 'Sign Out',
                icon   : !this.platform.is('ios') ? 'exit' : null,
                handler: () => {
                    actionSheet.dismiss()
                               .then(() => {
                                   this.signOut();
                               });
                    return false;
                }
            });
            buttons.push({
                text   : 'Refresh Competitions',
                handler: () => {
                    actionSheet.dismiss()
                               .then(() => {
                                   this.refreshComps();
                               });
                    return false;
                }
            });
        }
        let actionSheet = this.actionCtl.create({
            buttons: buttons
        });
        actionSheet.present();
    }

    toggleShowPassword() {
        this.showPassword = !this.showPassword;
    }

    private _signInBusy() {
        this.sessionStateSubscription
            = this.sessionDataService.getSessionStatus()
                  .distinctUntilChanged()
                  .subscribe((state: SessionState) => {
                      switch (state) {
                          case SessionState.LoggingIn:
                              if (!this.signInLoader) {
                                  this.signInLoader = this.loadingCtl.create({
                                      content: 'Signing in...'
                                  });
                                  this.signInLoader.present();
                              }
                              break;
                          default:
                              if (this.signInLoader) {
                                  try {
                                      this.signInLoader.dismiss()
                                          .then(() => {
                                              this.signInLoader = null;
                                          });
                                  } catch (e) {
                                  }
                              }
                      }
                  });
    }

    private goScoring() {
        this.currentScorecardService.scorecard()
            .take(1)
            .subscribe(scorecard => {
                this.scorerStateService.scorerState().take(1)
                    .subscribe(scorerState => {
                        if (scorerState.scoringPlayer && scorerState.scoringCompetition) {
                            this.navCtrl.push(GameRoundScoringPage, {
                                currentPlayer   : scorerState.scoringPlayer,
                                scorecard       : scorecard,
                                editingScorecard: false,
                                competition     : scorerState.scoringCompetition,
                                allowLogout     : true
                            }).then(() => {
                                this.scorerStateActions.setScoringStage(ScoringStage.Scoring);
                            });
                        }
                        else {
                            console.error("Peculiar state");
                        }
                    });
            });
    }

    goCaddieMaster() {
        this.navCtrl.push(TeeFlightListsPage)
    }

    goCaddieMarshall() {

        
        this.navCtrl.push(StarterFlightListsPage)
    }
}