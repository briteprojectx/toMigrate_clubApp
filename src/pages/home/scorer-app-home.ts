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
import {ScoringStage, TeetimeBooking} from '../../redux/scorer-state/scorer-state';
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
import { CaddyListPage } from '../modal-screens/caddy-list/caddy-list';
import { BuggyListPage } from '../modal-screens/buggy-list/buggy-list';
import { ClubService } from '../../providers/club-service/club-service';
// import { ClubInfo } from '../../data/club-course';


import { BookingHomePage } from '../booking/booking-home/booking-home';
import { BookingChartPage } from '../booking/booking-chart/booking-chart';
import { BookingCalendarPage } from '../booking/booking-calendar/booking-calendar';
import { ClubFlightService } from '../../providers/club-flight-service/club-flight-service';
import { CaddyDetailsPage } from '../modal-screens/caddy-list/caddy-details/caddy-details';

import * as moment from "moment";
import { MessageDisplayUtil } from '../../message-display-utils';
import { CaddyData, CaddieRating, CaddyAssignment, ClubInfo, BookingStatistics, ClubData } from '../../data/mygolf.data';
import { ModalController } from 'ionic-angular';
import { RatingsListPage } from '../modal-screens/ratings-list/ratings-list';
import { CaddyFlightListsPage } from '../booking/caddy-flight-lists/caddy-flight-lists';
import { MemberMenuModal } from '../modal-screens/member-menu/member-menu';
import { PlayerVoucherModal } from '../modal-screens/player-voucher/player-voucher';
import { CompetitionScoringListPage } from '../competition/competition-scoring-list/competition-scoring-list';
import { ManageVoucherModal } from '../modal-screens/manage-voucher/manage-voucher';
import { JsonService } from '../../json-util';
import { ManageDiscountCardModal } from '../modal-screens/manage-discount-card/manage-discount-card';
import { ClubListPage } from '../normalgame/club-list/club-list';
import { RecentClubListPage } from '../performance/recent-club/recent-club';
import { CaddyScheduleDisplayPage } from '../modal-screens/caddy-schedule-display/caddy-schedule-display';
import { ClubBookingListPage } from '../booking/club-booking-list/club-booking-list';
import { Howl } from 'howler';
import { ClubRefundRedeemHistoryPage } from '../booking/club-refund-redeem-history/club-refund-redeem-history';

/**
 * Created by ashok on 15/05/17.
 */
@Component({
    selector   : 'page-home',
    templateUrl: 'scorer-app-home.html'
})
export class ScorerAppHomePage {
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
    public clubId: number;
    clubInfo: ClubInfo;
    sessionState: any;
    loggedInName: string;
    loggedInAdmin: boolean;
    loggedInType: string;

    retryClicked: boolean = false;
    userRoles: Array<string>;
    currentDate: string;

    caddieId: number;
    caddyInfo: CaddyData;

    activeClubBookings: number;

    loggedIn: boolean;
    teetimeBookingSubscription: Subscription;
    msgSubscription: Subscription;

    teetimeBooking$: Observable<any>;
    newBookingFlag: boolean = false;

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
        private currentScorecardService: CurrentScorecardDataService,
        private clubService: ClubService,
        private flightService: ClubFlightService,
        private modalCtl: ModalController) {
        this.credential = this.formBuilder.group({
            email   : ['', Validators.required],
            password: ['', Validators.required]
        });

        this.sessionDataService.getSessionStatus().subscribe((data:any)=>{
            console.log("sub session state", data)
            if(data) this.sessionState = data
            else this.sessionState = null
            
            if(data===1) this.loggedIn = true;
            else if(data === 3) this.loggedIn = false;
            else this.loggedIn = false;
        });

        this.currentDate = moment().format("YYYY-MM-DD");

        this.caddyInfo = null;
        this.clubInfo = null;

        // this.websocketActions.subscribeTo(SUBSCRIBE_CLUB_BOOKING)
        //         .subscribe((data: any) => {
        //             // this._manageScorerDevice(data);
        //             console.log("websocket test : ", data)
        //         })

    }

    updateScoringMode() {
        console.log("Scoring Mode ",this.scoringMode)
    }
    public onPageInit(retry?: boolean) {
        this.retryClicked = retry;

        setTimeout(()=>{
            this.retryClicked = false;
        },10000)
        // this.platform.ready().then(() => {
        //     console.log("Checking server version");
        //     this.pushService.setControllers(this.app, this.nav, this.alertCtl,
        //         this.toastCtl, this.gotoPageHandler);

        // this.serverActions.refresh();
        this._initOnLoad();
            // this._init();
        // });
    }

    refreshHomePage() {
        if(this.clubId) this.getActiveClubBookings();
        this.newBookingFlag = false;
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
        this.sessionState$.map(state => {
            console.log("session state ", state)
            // return state === SessionState.LoggedIn
        });
        let _session;
        this.session$
        .subscribe((session: SessionInfo)=>{
            _session = session;
            console.log('session : ', _session)

        })
        // .map((data: SessionInfo) => {
        //     _session = data;
        //     // return state === SessionState.LoggedIn
        // });
        // this.teetimeBookingSubscription = this.scorerStateService.getTeetimeBooking()
        //                                         .subscribe((teetimeBooking: any) => {
        //                                             console.log("tee time booking home : ", teetimeBooking)
                                                    
                                                    
        //                                             if(teetimeBooking) {
        //                                                 if(teetimeBooking.clubId === this.clubId) {
        //                                                     this.refreshHomePage();
        //                                                     MessageDisplayUtil.showMessageToast(teetimeBooking.action, this.platform, this.toastCtl,
        //                                                         5000, "bottom");
        //                                                 }
        //                                             }
        //     });
        this.loggedIn$.filter(Boolean).subscribe((data)=>{
            console.log('logged in : ', data)
            console.log('logged in - session : ', _session)
            if(data && _session.user.userType.toLowerCase() !== 'britesoft') this.getClubSession();
            else if(data && _session.user.userType.toLowerCase() === 'britesoft') {
                console.log("britesoft login finally !")
                if(!this.clubId) this.onClubPicklist();
                else if(this.clubId) this.getClubSession(this.clubId)
                
            }
            //  this.currentScorecardService.getTeetimeBooking()
            this.teetimeBooking$ = this.scorerStateService.getTeetimeBooking();
            let _teeTimeBooking = this.teetimeBooking$.map((state: TeetimeBooking)=>{
                return this.clubId === state.clubId
            })
            console.log("_teeTimeBooking : ", _teeTimeBooking)
            // this.teetimeBooking$.subscribe((data)=>{
            //     if(data === this.clubId) this.refreshHomePage();
            // })
            // console.log("tee time booking $ : ", this.teetimeBooking$,this.scorerStateService.getTeetimeBooking() )
             

                        // this.msgSubscription = this.currentScorecardService.getCurrentScorecard()
                    //                            .map(curr=>curr.reloadReason)
                    //                            .distinctUntilChanged()
                    //                            .subscribe(reason=>{
                    //                                if(reason){
                    //                                    let toast = this.toastCtl.create({
                    //                                        message: reason + " Scorecard is reloaded.",
                    //                                        showCloseButton: true,
                    //                                        closeButtonText: 'OK',
                    //                                        duration: 5000
                    //                                    });
                    //                                    toast.present().then(()=>{
                    //                                        this.currentScorecardActions.clearReloadFlag();
                    //                                    });
                    //                                }


                    //                            });
        })
        // console.log("logged in : ", this.loggedIn$);
        // if(this.loggedIn$) this.getClubSession();
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
        if(0) {
            // disable
            this.scoringStageSubscription = this.scorerStateService.scorerState()
                                            .map(scorerState => scorerState.scoringStage)
                                            .distinctUntilChanged()
                                            .subscribe(scoringStage => {
                                                console.log("scoring state sub : ", scoringStage)
                                                // let msg = MessageDisplayUtil.getErrorMessage('', "Competition for scoring : "+scoringStage);
                                                //         MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl,
                                                //             5000, "bottom");
                                                switch (scoringStage) {
                                                    case ScoringStage.CompetitionSelected:
                                                        this.activeCompetitions$
                                                            .take(1)
                                                            .subscribe(comp => {
                                                                // this.selectScorer(comp[0]);
                                                        //         let msg = MessageDisplayUtil.getErrorMessage('', "There is "+scoringStage+" active competition(s)");
                                                        // MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl,
                                                        //     5000, "bottom");
                                                            });
                                                        break;
                                                    case ScoringStage.Ready:
                                                        // this.goScoring();
                                                        // let msg = MessageDisplayUtil.getErrorMessage('', "There is "+scoringStage+" active competition(s)");
                                                        // MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl,
                                                        //     5000, "bottom");
                                                        break;
                                                    // default:
                                                    //     let msg = MessageDisplayUtil.getErrorMessage('', "No active competition for scoring : "+ scoringStage);
                                                    //     MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl,
                                                    //         5000, "bottom");
                                                    //     break;
                                                }
                                            });
        }

        this.msgSubscription = this.scorerStateService.getTeetimeBooking()
        .map(curr=>curr)
        .distinctUntilChanged()
        .subscribe(teeBooking=>{
            if(teeBooking && teeBooking.clubId === this.clubId) {
                this.refreshHomePage();
                let _message;
                let _teeOffDate = moment(teeBooking.teeOffDate).format('ddd, DD MMM YYYY');
                let _teeOffTime = moment(teeBooking.teeOffTime,'HH:mm:ss').format('hh:mm A');
                let _currency = this.clubInfo.country?this.clubInfo.country.currencySymbol:'$$$';
                if(teeBooking.action.toLowerCase() === 'booked') {
                    _message = '[Booked] '+teeBooking.bookingReference+ ' @ '+ _teeOffDate + ' ' + _teeOffTime;
                } 
                else if(teeBooking.action.toLowerCase() === 'cancelled') _message = '[Cancelled] '+teeBooking.bookingReference+ ' @ '+ _teeOffDate + ' ' + _teeOffTime;
                else if(teeBooking.action.toLowerCase() === 'payment') _message = '[Payment '+_currency+teeBooking.amount.toFixed(2)+'] '+teeBooking.bookingReference+ ' @ '+ _teeOffDate + ' ' + _teeOffTime;
                MessageDisplayUtil.showMessageToast(_message, this.platform, this.toastCtl,
                    7000, "bottom");
                this.newBookingFlag = teeBooking.action.toLowerCase()==='booked'||teeBooking.action.toLowerCase()==='cancelled'||teeBooking.action.toLowerCase()==='payment';
                this.scorerStateActions.clearTeetimeBooking(); 
                let _sound;
                if(teeBooking.action.toLowerCase()==='payment') {
                    _sound = new Howl({
                        src: ['assets/poker-chips-daniel_simon.mp3']
                      }); 
                    _sound.play();
                } else if(teeBooking.action.toLowerCase()==='booked'||teeBooking.action.toLowerCase()==='cancelled') {
                    _sound = new Howl({
                        src: ['assets/Store_Door_Chime-Mike_Koenig-570742973.mp3']
                      }); 
                    _sound.play();
                }
            }

                console.log("msg sub home : ", teeBooking)
            // let toast = this.toastCtl.create({
            //     message: reason + " Scorecard is reloaded.",
            //     showCloseButton: true,
            //     closeButtonText: 'OK',
            //     duration: 5000
            // });
            // toast.present().then(()=>{
            //     // this.currentScorecardActions.clearReloadFlag();
            // });
        })
        // this.msgSubscription = this.currentScorecardService.getCurrentScorecard()
        //                            .map(curr=>curr.reloadReason)
        //                            .distinctUntilChanged()
        //                            .subscribe(reason=>{
        //                                if(reason){
        //                                    let toast = this.toastCtl.create({
        //                                        message: reason + " Scorecard is reloaded.",
        //                                        showCloseButton: true,
        //                                        closeButtonText: 'OK',
        //                                        duration: 5000
        //                                    });
        //                                    toast.present().then(()=>{
        //                                     //    this.currentScorecardActions.clearReloadFlag();
        //                                    });
        //                                }


        //                            });
        
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

                                            
                if(this.clubId && this.clubInfo && !this.clubInfo.virtualClub) this.getActiveClubBookings();
    }

    ionViewWillLeave() {
        this.newBookingFlag = false;
        if (this.scoringStageSubscription) this.scoringStageSubscription.unsubscribe();
        if (this.errorSubscription) this.errorSubscription.unsubscribe();
        if(this.teetimeBookingSubscription) this.teetimeBookingSubscription.unsubscribe();
        if(this.msgSubscription) this.msgSubscription.unsubscribe();
    }

    ionViewWillUnload() {
        this.newBookingFlag = false;
        if (this.sessionStateSubscription) {
            this.sessionStateSubscription.unsubscribe();
        }
        if (this.logoutSubscription) this.logoutSubscription.unsubscribe();
        if (this.batterySubscription) this.batterySubscription.unsubscribe();
        if(this.teetimeBookingSubscription) this.teetimeBookingSubscription.unsubscribe();
        if(this.msgSubscription) this.msgSubscription.unsubscribe();
    }

    private _initOnLoad() {
        //This will trigger the server info download and matching the
        //Server version with client
        this.serverActions.refresh();
        this.getAppAttribute();
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
            this.credential.value.password, 'club');
            // this.loggedIn$.filter(Boolean).subscribe((data)=>{
            //     // console.log('logged in : ', data)
            //     if(data) this.getClubSession();
            // })
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

    getClubSession(clubId?: number) {
        let currSession: SessionInfo;
        this.sessionDataService.getCurrentSession()
        .subscribe((session: SessionInfo) => {
            currSession = session;
            console.log("club session - session : ", session)
            if(session.status === 0) return false;
            // this.clubId = currSession.clubId;
            this.loggedInName = currSession.name;
            // this.loggedInAdmin = currSession.admin;
            // this.loggedInType = currSession.userType;
            this.userRoles = currSession.user && currSession.user.roles?currSession.user.roles:[];
            
            if(clubId) this.clubId = clubId;// currSession.clubId;
            else if(currSession.user.clubId) this.clubId = currSession.user.clubId;// currSession.clubId;
            // else this.clubId = currSession
            // this.loggedInName = currSession.name;// currSession.name;
            this.loggedInAdmin = currSession.user.admin;
            this.loggedInType = currSession.user.userType;
            this.caddieId = currSession.user&&currSession.user.caddieId?this.caddieId:0; 
            // this.userRoles.push(...currSession.user.roles);
            console.log("club session - user roles : ", this.userRoles)
            console.log("club session - parameters : ",this.loggedInAdmin, this.loggedInName, this.loggedInType)
            console.log("club session - caddie  : ",currSession.user.caddieId,this.getUserRoles('caddy'), this.caddieId)
            this.clubService.getClubInfo(this.clubId)
            .subscribe((data: any)=>{
                // console.log("club info : ", data)
                if(data) {
                    JsonService.deriveFulImageURL(data,"clubImage");
                    JsonService.deriveFulImageURL(data,"clubLogo");
                    JsonService.deriveFulImageURL(data,"clubThumbnail");
                    this.clubInfo = data;
                    if(this.clubInfo.virtualClub) {
                        let _msg = 'App will be available for Social Clubs in the future.'
                        MessageDisplayUtil.showErrorToast(_msg, this.platform, this.toastCtl,
                            5000, "bottom");
                        this.signOut();
                        return;
                    }
                }
                if(this.clubId && !data.virtualClub) this.getActiveClubBookings();
            })
            if(this.getUserRoles('caddy_assignments')) {
                let _caddieId = this.caddieId?this.caddieId:currSession.user.caddieId
                // currSession.user.caddieId
                this.flightService.getCaddyInfo()
                .subscribe((caddyInfo: CaddyData)=> {

                    JsonService.deriveFulImageURL(caddyInfo,"caddyImage");
                    if(caddyInfo) this.caddyInfo = caddyInfo;
                    console.log("club session - caddie  : ",this.caddyInfo)
                })
            }
        });
        // console.log("club session: ", currSession)
        // let session = this.scorerStateActions.getClubSession();
        // let session = this.sessionActions.getClubId();
        // console.log("club session 2 : ", session)
    }

    private _openActionSheet(loggedIn: boolean) {
        console.log("debug session state : ", this.sessionState$)
        console.log("debug showLoginForm : ", this.showLoginForm)
        let buttons = [];
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
            if(this.getUserRoles('caddy_assignments')) {
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
        } else if(!this.sessionState$ && !this.showLoginForm) {
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
        }
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
        
        if(this.getUserRoles('caddy_assignments')) {
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

        }
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

    toggleShowPassword() {
        this.showPassword = !this.showPassword;
    }

    private _signInBusy() {
        this.sessionStateSubscription
            = this.sessionDataService.getSessionStatus()
                  .distinctUntilChanged()
                  .subscribe((state: SessionState) => {
                      console.log("sign in busy - state", state)
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
                      console.log("sign in busy : ", state)
                    // this.getClubSession();
                  });
    }

    private goScoring() {
        this.currentScorecardService.scorecard()
            .take(1)
            .subscribe(scorecard => {
                this.scorerStateService.scorerState().take(1)
                    .subscribe(scorerState => {
                        console.log("go scoring : ", scorerState)
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
        this.navCtrl.push(TeeFlightListsPage, {
            clubId: this.clubId
        })
    }

    goCaddieMarshall() {
        this.navCtrl.push(StarterFlightListsPage, {
            clubId: this.clubId,
            userRoles: this.userRoles
        })
    }

    isLogin_() {
        // return ""
        // console.log("show login form", this.showLoginForm)
        // console.log("logged in $", this.loggedIn$)
        
        // this.sessionState$
        // .take(1).subscribe((data:any)=>{
        //     console.log("sub session state", data)
        // })
        // .filter(Boolean).map((data:any)=> data)
        // this.sessionState$.subscribe((data: any)=>{
        //     console.log("is login session state ", data)
        // })
        // console.log("is login", _sessionState)
        if (this.showLoginForm) return "sign-page-backround"
         else return ''
    }

    mg2uNavbarClass() {
        if(this.loggedIn$)
            return 'mg2u-navbar'
    }

    goCaddyList() {
        this.navCtrl.push(CaddyListPage, {clubId: this.clubId, userRoles: this.userRoles})
    }

    goBuggyList() {
        this.navCtrl.push(BuggyListPage, {clubId: this.clubId, userRoles: this.userRoles})
    }

    onBookingMenuClick() {
        this.navCtrl.push(BookingHomePage, {
            userType: 'club'
        });
    }

    goBookingChart() {
        this.navCtrl.push(BookingChartPage, {clubId: this.clubId}) 
    }

    goClubBooking() {
        this.navCtrl.push(BookingCalendarPage, {clubId: this.clubId})

    }
    goAllClubBooking() {
        this.navCtrl.push(ClubBookingListPage, {clubId: this.clubId})
    }

    getClubLoggedIn() {
        let _loggedInType
        if(this.loggedInType)  _loggedInType = this.loggedInType.toLowerCase()==='britesoft'?'myGolf2u':this.loggedInType;
        else  _loggedInType = '';
        return (this.loggedInName?this.loggedInName:'<i>*Please contact admin to set name</i>') + ' ' + '(' + _loggedInType + ' ' + (this.loggedInAdmin?'Admin':'User') + ')';
    }

    getUserRoles(page?: string) {
        // console.log("get user roles : ", page, this.loggedInAdmin, this.loggedInType, this.userRoles)
        // if(!this.userRoles || this.userRoles.length === 0 ||  !this.loggedInAdmin) return false;
        
        let _userRole;
        let _rolesAllowed;
        let _isAdmin:boolean = false;
        _isAdmin = (page==='caddy' || page === 'caddy_reviews' || page === 'caddy_schedules' || page === 'caddy_assignments' || page === 'scoring')?false:this.loggedInAdmin;

        // console.log("inside user roles", this.userRoles.length)
        if(this.userRoles && this.userRoles.length > 0) {
            _userRole = this.userRoles.filter((role: any)=>{
                if(!role) return false;
                // || !role.authority
                // console.log("roles : ", role)
                // return role.toLowerCase().includes(type.toLowerCase());
                if(page==='booking') {
                    _rolesAllowed = role.toLowerCase().includes('admin'.toLowerCase()) 
                    || role.toLowerCase().includes('cashier'.toLowerCase()) 
                    || role.toLowerCase().includes('account'.toLowerCase())
                    return _rolesAllowed
                } else if (page === 'caddie_master') {
                    _rolesAllowed = role.toLowerCase().includes('caddy_master'.toLowerCase()) 
                    || role.toLowerCase().includes('admin'.toLowerCase())
                    return _rolesAllowed
                } else if (page === 'course_starter') {
                    _rolesAllowed = role.toLowerCase().includes('course_starter'.toLowerCase()) 
                    || role.toLowerCase().includes('caddy_master'.toLowerCase())
                    || role.toLowerCase().includes('admin'.toLowerCase()) 
                    return _rolesAllowed
                } else if (page === 'caddies') {
                    _rolesAllowed = role.toLowerCase().includes('course_starter'.toLowerCase()) 
                    || role.toLowerCase().includes('caddy_master'.toLowerCase())
                    || role.toLowerCase().includes('admin'.toLowerCase()) 
                    // || role.toLowerCase().includes('caddy'.toLowerCase()) 
                    || role.toLowerCase().includes('cashier'.toLowerCase()) 
                    return _rolesAllowed
                } else if (page === 'buggies') {
                    _rolesAllowed = role.toLowerCase().includes('course_starter'.toLowerCase()) 
                    || role.toLowerCase().includes('caddy_master'.toLowerCase())
                    || role.toLowerCase().includes('admin'.toLowerCase()) 
                    || role.toLowerCase().includes('cashier'.toLowerCase()) 
                    return _rolesAllowed
                } else if (page === 'booking_stats') {
                    _rolesAllowed = role.toLowerCase().includes('admin'.toLowerCase()) 
                    || role.toLowerCase().includes('account'.toLowerCase())
                    || role.toLowerCase().includes('cashier'.toLowerCase()) 
                    return _rolesAllowed
                } else if (page === 'competitions') {
                    _rolesAllowed = role.toLowerCase().includes('caddy_master'.toLowerCase())
                    || role.toLowerCase().includes('admin'.toLowerCase())
                    || role.toLowerCase().includes('caddy'.toLowerCase())
                    return _rolesAllowed
                } else if (page === 'tournament_scoring') {
                    _rolesAllowed = role.toLowerCase().includes('scorer'.toLowerCase())
                    || role.toLowerCase().includes('admin'.toLowerCase()) 
                    return _rolesAllowed
                }  else if (page === 'caddy_reviews') {
                    _rolesAllowed = role.toLowerCase() === 'role_caddy';
                    // || role.toLowerCase().includes('admin'.toLowerCase()) 
                    return _rolesAllowed
                } else if (page === 'caddy_schedules') {
                    _rolesAllowed = role.toLowerCase() === 'role_caddy';
                    // || role.toLowerCase().includes('admin'.toLowerCase()) 
                    return _rolesAllowed
                } else if (page === 'caddy_assignments') {
                    _rolesAllowed = role.toLowerCase() === 'role_caddy';
                    // || role.toLowerCase().includes('admin'.toLowerCase()) 
                    return _rolesAllowed
                } else if (page === 'caddy') {
                    _rolesAllowed = role.toLowerCase().includes('caddy'.toLowerCase())
                    // || role.toLowerCase().includes('admin'.toLowerCase()) 
                    return _rolesAllowed
                } else if (page === 'member') {
                    _rolesAllowed = role.toLowerCase().includes('admin'.toLowerCase())
                    // || role.toLowerCase().includes('admin'.toLowerCase()) 
                    return _rolesAllowed
                } else if (page === 'scoring') {
                    _rolesAllowed = role.toLowerCase() === 'role_caddy'
                    // || role.toLowerCase().includes('admin'.toLowerCase()) 
                    return _rolesAllowed
                } else if (page === 'voucher') {
                    _rolesAllowed = role.toLowerCase().includes('admin'.toLowerCase()) 
                    return _rolesAllowed
                } else return false
            })
        }
       

        if(_userRole && _userRole.length>0 || _isAdmin ) {
            // && (page !== 'caddy_reviews' && page !== 'caddy_schedules' && page !== 'caddy_assignments')
            return true
        }
        else return false;
    }


    goCompetitionsList() {
        
        // let msg = MessageDisplayUtil.getErrorMessage('', "Please enter Caddie Id");
        let _msg = 'This feature will be coming soon'
        MessageDisplayUtil.showErrorToast(_msg, this.platform, this.toastCtl,
            5000, "bottom");
    }

    setCaddieId(): any {
        let prompt = this.alertCtl.create({
            // Flight Name
            title: 'Enter a caddie Id to proceed',
            // subTitle: _required,
            message: 'Enter a caddie Id to proceed',
            inputs: [{
                name: 'title',
                placeholder: 'Caddie Id',
                type: 'number'
            }, ],
            buttons: [{
                    text: 'Cancel',
                    handler: data => {
                        prompt.dismiss().then(() => {
                            // this.keyboard.close();
                        });
                        return false;
                    }
                },
                {
                    text: 'Go',
                    handler: data => {
                        // _required = '';
                        if (data.title)
                                      prompt.dismiss().then(()=> {
                                        return data.title
                                      })
                        else {
                            // _required = 'Please enter Group Name';
                            // _message = '<br>Please enter the Group Name';
                            let msg = MessageDisplayUtil.getErrorMessage('', "Please enter Caddie Id");
                            MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl,
                                5000, "bottom");
                        }
                        return false;
                    }
                }
            ]
        });
        prompt.present();
    }

    goCaddyAssignments() {
        let _caddieId = null;
        let _fromDate = this.currentDate;
        this.flightService.getCaddyAssignments(_caddieId, _fromDate)
        .subscribe((caddyAssignment: Array<CaddyAssignment>)=>{
            this.navCtrl.push(CaddyFlightListsPage, {
                caddyAssignment: caddyAssignment,
                caddieId: _caddieId
            })
        });
        // let __caddieId;
        // let prompt = this.alertCtl.create({
        //     // Flight Name
        //     title: 'Enter a caddie Id to proceed',
        //     // subTitle: _required,
        //     message: 'Enter a caddie Id to proceed',
        //     inputs: [{
        //         name: 'title',
        //         placeholder: 'Caddie Id',
        //         type: 'number'
        //     }, ],
        //     buttons: [{
        //             text: 'Cancel',
        //             handler: data => {
        //                 prompt.dismiss().then(() => {
        //                     // this.keyboard.close();
        //                 });
        //                 return false;
        //             }
        //         },
        //         {
        //             text: 'Go',
        //             handler: data => {
        //                 // _required = '';
        //                 // if (data.title)
        //                               prompt.dismiss().then(()=> {
        //                                 __caddieId = Number(data.title)
        //                                 let _caddieId = __caddieId; //__caddieId?__caddieId:64;
        //                                 let _fromDate = '2020-06-01';
        //                                 this.flightService.getCaddyAssignments(_caddieId, _fromDate)
        //                                 .subscribe((caddyAssignment: Array<CaddyAssignment>)=>{
        //                                     this.navCtrl.push(CaddyFlightListsPage, {
        //                                         caddyAssignment: caddyAssignment,
        //                                         caddieId: _caddieId
        //                                     })
        //                                 });
        //                               })

        //                 return false;
        //             }
        //         }
        //     ]
        // });
        // prompt.present();
        
    }

    goCaddySchedules() {
        
        this.flightService.getCaddyInfo()
        .subscribe((caddyInfo: CaddyData)=>{

            let club = this.modalCtl.create(CaddyDetailsPage, {
                caddy: this.caddyInfo,
                currentDate: this.currentDate,
                fromBooking: false,
                scheduleOnly: true,
            });
    
            club.onDidDismiss((data: any) => {
    
            });
            club.present();
        });

        
    }

    goCaddyRatings() {
        let _caddieId = null;
        let _fromDate = moment().startOf('month').format('YYYY-MM-DD');
        let _toDate = moment().endOf('month').format('YYYY-MM-DD');
        this.flightService.getCaddyRatings(_caddieId, _fromDate, _toDate)
        .subscribe((data: Array<CaddieRating>)=>{
            if(data) {
                data = data.sort((a: CaddieRating, b: CaddieRating)=>{
                    if(a.ratedOn < b.ratedOn) return -1
                    else if(a.ratedOn > b.ratedOn) return 1
                    else return 0
                })
                this.navCtrl.push(RatingsListPage, {
                ratings: data,
                header: 'Player Ratings',
                ratingWho: 'Caddie',
                caddieId: _caddieId,
               })
        }
        });
        // let __caddieId;
        // let prompt = this.alertCtl.create({
        //     // Flight Name
        //     title: 'Enter a caddie Id to proceed',
        //     // subTitle: _required,
        //     message: 'Enter a caddie Id to proceed',
        //     inputs: [{
        //         name: 'title',
        //         placeholder: 'Caddie Id',
        //         type: 'number'
        //     }, ],
        //     buttons: [{
        //             text: 'Cancel',
        //             handler: data => {
        //                 prompt.dismiss().then(() => {
        //                     // this.keyboard.close();
        //                 });
        //                 return false;
        //             }
        //         },
        //         {
        //             text: 'Go',
        //             handler: data => {
        //                 // _required = '';
        //                 // if (data.title)
        //                               prompt.dismiss().then(()=> {
        //                                 __caddieId = Number(data.title)
        //                                 let _caddieId = __caddieId;// __caddieId?__caddieId:64;
        //                                 let _fromDate = moment().startOf('month').format('YYYY-MM-DD');
        //                                 let _toDate = moment().endOf('month').format('YYYY-MM-DD');
        //                                 this.flightService.getCaddyRatings(_caddieId, _fromDate, _toDate)
        //                                 .subscribe((data: Array<CaddieRating>)=>{
        //                                     if(data) {
        //                                         data = data.sort((a: CaddieRating, b: CaddieRating)=>{
        //                                             if(a.ratedOn < b.ratedOn) return -1
        //                                             else if(a.ratedOn > b.ratedOn) return 1
        //                                             else return 0
        //                                         })
        //                                         this.navCtrl.push(RatingsListPage, {
        //                                         ratings: data,
        //                                         header: 'Player Ratings',
        //                                         ratingWho: 'Caddie',
        //                                         caddieId: _caddieId,
        //                                        })
        //                                 }
        //                                 })
        //                               })
        //                 return false;
        //             }
        //         }
        //     ]
        // });
        // prompt.present();
        
    }

    goCaddyDetails() {
        console.log("go caddy detailsw")
        if(!this.getUserRoles('caddy')) return false;
        this.flightService.getCaddyInfo()
                                        .subscribe((caddyInfo: CaddyData)=>{
                                            this.navCtrl.push(CaddyDetailsPage, {
                                                caddy: caddyInfo,
                                                currentDate: this.currentDate,
                                                fromBooking: false
                                            })
                                        });
        if(1) return false;
        let __caddieId;
        let prompt = this.alertCtl.create({
            // Flight Name
            title: 'Enter a caddie Id to proceed',
            // subTitle: _required,
            message: 'Enter a caddie Id to proceed',
            inputs: [{
                name: 'title',
                placeholder: 'Caddie Id',
                type: 'number'
            }, ],
            buttons: [{
                    text: 'Cancel',
                    handler: data => {
                        prompt.dismiss().then(() => {
                            // this.keyboard.close();
                        });
                        return false;
                    }
                },
                {
                    text: 'Go',
                    handler: data => {
                        // _required = '';
                        // if (data.title)
                                      prompt.dismiss().then(()=> {
                                        __caddieId = Number(data.title)
                                        let _caddieId = __caddieId;// __caddieId?__caddieId:64;
                                        let _fromDate = '2020-06-01';
                                        
                                        this.flightService.getCaddyInfo(_caddieId)
                                        .subscribe((caddyInfo: CaddyData)=>{
                                            this.navCtrl.push(CaddyDetailsPage, {
                                                caddy: caddyInfo,
                                                currentDate: this.currentDate,
                                                fromBooking: false
                                            })
                                        })
                                      })
                        // else {
                        //     // _required = 'Please enter Group Name';
                        //     // _message = '<br>Please enter the Group Name';
                        //     let msg = MessageDisplayUtil.getErrorMessage('', "Please enter Caddie Id");
                        //     MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl,
                        //         5000, "bottom");
                        // }
                        return false;
                    }
                }
            ]
        });
        prompt.present();
    }

    goMemberManagement() {
        this.navCtrl.push(MemberMenuModal)
    }

    goPlayerVoucher() {
        this.navCtrl.push(PlayerVoucherModal)
    }

    goCompetitionScoring() { 
        this.navCtrl.push(CompetitionScoringListPage)
    }

    goVoucherManagement() {
        this.navCtrl.push(ManageVoucherModal, {
            fromClub: true,
            clubInfo: this.clubInfo,
            clubId: this.clubInfo.clubId,
            currencySymbol: this.clubInfo.country.currencySymbol,
        })
    }

    getClubProfileImage() {
        let _image;
        if(this.getUserRoles('caddy_assignments')) _image = this.caddyInfo && this.caddyInfo.caddyImage?this.caddyInfo.caddyImage:null;
        else if(this.getUserRoles('caddie_master')) _image = this.clubInfo&&this.clubInfo.clubThumbnail?this.clubInfo.clubThumbnail:this.clubInfo&&this.clubInfo.clubLogo?this.clubInfo.clubLogo:this.clubInfo&&this.clubInfo.clubImage?this.clubInfo.clubImage:'';
        // console.log("get club profile image : ", _image)
        return _image;
    }

    openYoutube() {
        // window.open('https://youtu.be/ZjEyY-02Cyg', '_system');
    }

    goPrivilegeManagement() {
        this.navCtrl.push(ManageDiscountCardModal, {
            fromClub: true,
            clubInfo: this.clubInfo,
            clubId: this.clubInfo.clubId,
            currencySymbol: this.clubInfo.country.currencySymbol,
        })
    }

    onClubPicklist() {


        let club = this.modalCtl.create(ClubListPage, {
            // caddy: this.caddyInfo,
            // currentDate: this.currentDate,
            // fromBooking: false,
            // scheduleOnly: true,
            openedModal: true,
        });

        club.onDidDismiss((data: any) => {
            if(data) {
                this.getClubSession(data.clubId);
            }
            else if(this.clubId && !data) {
                this.getClubSession(this.clubId)
            }
            else {
                this.onClubPicklist();
            }
        });
        club.present();
    }
    
    getActiveClubBookings() {
        let _clubId = this.clubId
        let _fromDate = moment().format("YYYY-MM-DD")
        let _toDate = moment().add(1, 'years').format("YYYY-MM-DD");
        this.flightService.getBookingStatsWithPlayerInfo(_clubId, _fromDate, _toDate)
        .subscribe((data: BookingStatistics) =>{
            console.log("get active club bookings", data)
            if(data) {
                this.activeClubBookings = data.overallStatus.totalBooked;
            }
        })
    }

    isCordova() {
        return this.platform.is('cordova');
    }

    goCaddyScheduleDisplayPage() {
        this.navCtrl.push(CaddyScheduleDisplayPage, {
            clubId: this.clubId
        })
    }

    getCompBorderClass(type?: string) {
        let _multipleComps;
        if(type==='style') {
            // if(_activeCompsToday=== 1 && _normalGameOn) return 'red'
            if(this.newBookingFlag) return 'red'
            else return ''
        } 
        // let _class;
        // if(this.normalGameOn)
        //     _class = " blink_me" ;
        return 'home-box-inner';
        // + " blink_me"
    }

    getCompImageClass(type?: string) {
        let _class = '';
        if(this.newBookingFlag) _class = " blink_me"; // = " filter-red" + " blink_me"
        // else if(_multipleComps) _class = " filter-blue" + " blink_me"
        else _class = '';
        // if(type==='style') 
        return 'home-image' + _class;
                // else return 'home-image'
    }

    
    appAttribute: any;
    getAppAttribute() { 
        console.log("[app attribute] : ")
        this.flightService.getAppAttributes()
        .subscribe((data: any)=>{
            console.log("[app attribute] : ", data)
            if(data) {
                data.filter((d)=>{
                    return d.page === 'playerHome'
                }).map((d)=>{
                    this.appAttribute = d
                });
                if(this.appAttribute) {
                    // let _maintenance = this.appAttribute.maintenance;
                    if(this.appAttribute.maintenance) {
                        this.displayMaintenance(this.appAttribute);
                    }
                    // let _announcement = this.appAttribute.annoucement;
                    if(this.appAttribute.announcement) {
                        this.displayAnnouncement(this.appAttribute);
                    }
                }
            }
        })
    }

    displayAnnouncement(appAttribute) {
        if(!appAttribute) return;
        let _announcement = appAttribute.announcement;
        let _fromDate = moment(_announcement.fromDate,"YYYY-MM-DD");
        let _toDate = moment(_announcement.toDate,"YYYY-MM-DD");
        console.log("display announcement - ", appAttribute, _fromDate,_toDate)
        console.log("display announcement - ", moment().isBetween(_fromDate,_toDate,'day', '[]'))
        console.log("display announcement - ", moment().isBetween(_fromDate,_toDate))
        console.log("display announcement - ", moment().isBetween(_fromDate,_toDate, undefined, "[]"))
        if(_announcement.showAnnouncement) {
            let _msg = "Welcome to myGolf2u";
            if(_announcement.announcementMessage) {
                _msg = _announcement.announcementMessage;
            }
            let _buttons = [];
                _buttons.push({
                    text   : "Okay",
                    role   : "cancel",
                    handler: () => {
                        _alert.dismiss(false);
                        return false;
                    }
                })
                let _alert = this.alertCtl.create({
                    title  : "Announcement",
                    message: _msg,
                    buttons: _buttons
                });
                _alert.onDidDismiss((exit: boolean) => {
                    if (exit) this.platform.exitApp();
                });
                if(moment().isBetween(_fromDate,_toDate,'day', '[]'))
                    _alert.present();
        }
    }

    displayMaintenance(appAttribute) {
        if(!appAttribute) return false;
        let _maintenance = appAttribute.maintenance;
        let _fromDate = _maintenance.fromDate;
        let _daysBefore = _maintenance.daysBefore;
        let _dateBefore;
        if(_daysBefore) _dateBefore = moment(_fromDate).add(-1*_daysBefore, "days");
        let _toDate = _maintenance.toDate;
        let _fromTime = _maintenance.fromTime;
        let _toTime = _maintenance.toTime;

        let _fromDateTime = moment(_fromDate+_fromTime,"YYYY-MM-DDHH:mm");
        let _toDateTime = moment(_toDate+_toTime,"YYYY-MM-DDHH:mm");
        console.log("[app attribute] from date", _fromDateTime)
        console.log("[app attribute] to date", _toDateTime)
        console.log("[app attribute] ", moment().isBetween(_fromDateTime,_toDateTime,'minute'))
        console.log("[app attribute] ", moment().isBetween(_fromDateTime,_toDateTime))
        console.log("[app attribute] ", moment().isBetween('2021-05-0412:00','2021-05-0412:30'))
        console.log("[app attribute] ", moment())
        if(_maintenance.showMaintenanceMessage) {
            let _msg =  "The system will be unavailable during the following period : <br><b>"+moment(_fromDateTime).format("ddd, DD MMM YYYY HH:mm") + "</b> to <br><b>" + moment(_toDateTime).format("ddd, DD MMM YYYY HH:mm")+"</b>";
            if(_maintenance.maintenanceMessage) {
                _msg = _maintenance.maintenanceMessage + "<br><b>"+moment(_fromDateTime).format("ddd, DD MMM YYYY HH:mm") + "</b> to <br><b>" + moment(_toDateTime).format("ddd, DD MMM YYYY HH:mm")+"</b>";
            }
            let _buttons = [];
            if(_maintenance.blockForMaintenance && moment().isBetween(_fromDateTime,_toDateTime,'minute')) {
                if(this.platform.is("cordova"))
                _buttons.push({
                    text   : "Close",
                    role   : "cancel",
                    handler: () => {
                        if(this.platform.is("cordova"))
                            _alert.dismiss(true);
                        return false;
                    }
                })

            } else {
                _buttons.push({
                    text   : "Okay",
                    role   : "cancel",
                    handler: () => {
                        _alert.dismiss(false);
                        return false;
                    }
                })
            }
            let _alert = this.alertCtl.create({
                title  : "Server Maintenance",
                message: _msg,
                buttons: _buttons,
                enableBackdropDismiss: _maintenance.blockForMaintenance?false:true
            });
            _alert.onDidDismiss((exit: boolean) => {
                if (exit) this.platform.exitApp();
            });
            // if(moment().isBetween(_fromDate + " " + _fromTime, _toDate + " " + _toTime ))
            if(moment().isBetween(_fromDateTime, _toDateTime,'minute') ||  moment().isBetween(_dateBefore,_fromDate))
                _alert.present();
        }
    }

    goRefundRedeemHistoryPage() {
        this.navCtrl.push(ClubRefundRedeemHistoryPage), {
            clubId: this.clubId,
            fromClub: true,
        }
    }

        
}