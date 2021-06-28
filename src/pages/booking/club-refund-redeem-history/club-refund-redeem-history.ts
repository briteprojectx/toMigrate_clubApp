import {
    FlightSetupPage
} from '../../normalgame/flight-setup/flight-setup';
import {
    NavController,
    NavParams,
    LoadingController,
    Platform,
    reorderArray,
    PopoverController
} from "ionic-angular";
import {
    Component,
    Renderer,
    HostListener
} from "@angular/core";
import {
    CompetitionInfo,
    FlightInfo,
    CompetitionDetails,
    FlightMember
} from "../../../data/competition-data";
import {
    GameRoundInfo,
    createGameRoundInfo
} from "../../../data/game-round";
import {
    CompetitionService
} from "../../../providers/competition-service/competition-service";
import {
    adjustViewZIndex
} from "../../../globals";
import {
    TeeTimeFlight,
    TeeTimeBooking,
    TeeTimeSlot,
    TeeTimeBookingPlayer,
    CourseInfo,
    PlayerData,
    CaddyData,
    TeeTimeSlotDisplay,
    PagedData,
    RefundInstance,
    RefundAndRedeem
} from "../../../data/mygolf.data";

import * as moment from "moment";
import {
    NotificationHandlerInfo,
    AbstractNotificationHandlerPage
} from "../../../providers/pushnotification-service/notification-handler-constructs";
import {
    ActionSheetController
} from "ionic-angular";
import {
    TeeBuggyListPage
} from "../tee-buggy-list/tee-buggy-list";
import {
    ClubFlightService
} from "../../../providers/club-flight-service/club-flight-service";
import {
    CourseBox
} from "../../modal-screens/course-box/course-box";
import {
    MessageDisplayUtil
} from "../../../message-display-utils";
import {
    ToastController
} from "ionic-angular";
import {
    AlertController
} from "ionic-angular";
import {
    isPlatformBrowser
} from "@angular/common";
import {
    ClubService
} from "../../../providers/club-service/club-service";
import {
    ImageZoom
} from '../../modal-screens/image-zoom/image-zoom';
import {
    ModalController
} from 'ionic-angular';
import {
    TeeSlotListModal
} from '../../modal-screens/tee-slot-list/tee-slot-list';
import { NotificationsPage } from '../../notifications/notifications';
import { BookingDetailsPage } from '../booking-details/booking-details';
import { SessionDataService, SessionActions } from '../../../redux/session';
import { Subscription } from 'rxjs';
import { SessionState, SessionInfo } from '../../../data/authentication-info';
import { RefundBookingPlayersModal } from '../../modal-screens/refund-booking-players/refund-booking-players';
import { mygolfUtils } from '../../../custom/mygolf2u-utils';


export interface FilterBookingStatus {
    id: string;
    name: string;
    checked: boolean;
}

export interface FilterRefundMethod {
    id: string;
    name: string;
    visible: boolean;
    enabled: boolean;
    checked: boolean;
    APIname: string;
}
@Component({
    templateUrl: 'club-refund-redeem-history.html',
    selector: 'club-refund-redeem-history-page'
})


export class ClubRefundRedeemHistoryPage {
    public competition: CompetitionInfo;
    public details: CompetitionDetails;
    public gameRound: GameRoundInfo;
    public visible: boolean;
    public flights: Array < FlightInfo > = new Array < FlightInfo > ();
    //  private flightMembers: Array<FlightMember> = new Array<FlightMember>();
    public filteredFlight: Array < FlightInfo > = new Array < FlightInfo > ();
    public searchQuery: string = '';
    itemReorder: boolean = false;
    devWidth: number;
    public teeFlightTabs: string = 'bookedTab'; //'checkedInTab';
    public searchToggle: boolean = false;

    starterList: Array < TeeTimeFlight > = new Array < TeeTimeFlight > ();
    filteredList: Array < TeeTimeFlight > = new Array < TeeTimeFlight > ();
    bookingFlightList: Array < TeeTimeBooking > = new Array < TeeTimeBooking > ();
    filteredBFL: Array < TeeTimeBooking > = new Array < TeeTimeBooking > ();
    dispatchedList: Array < TeeTimeBooking > = new Array < TeeTimeBooking > ();
    currentPage: number = 0;
    nameView: boolean = true;
    showAll: boolean = false;
    today: string;
    currentDate: string;
    clubId: number;
    toDate: string;

    items = [];
    courses: Array < CourseInfo > ;

    totalCheckIn: number = 0;
    totalUpcoming: number = 0;
    totalAllFlights: number = 0;

    totalDayFlights: number = 0;
    totalDayPlayers: number = 0;
    totalDayBuggies: number = 0;
    totalDayCaddies: number = 0;
    totalDayDispatched: number = 0;
    refresher: boolean = false;
    // flightList: Array<any> = new Array<any>;

    upcomingList: Array < TeeTimeBooking > = new Array < TeeTimeBooking > ();
    checkedInList: Array < TeeTimeBooking > = new Array < TeeTimeBooking > ();
    optionCourse: CourseInfo;
    optionFlightStatus: string = 'all';
    
    /**
    @param filterBookingStatus 
    * B - Booked
    * D - secured
    * C - Cancelled by Player
    * H - Partially Paid
    * L - Cancelled by Club
    * P - Fully Paid
    * R - Flight Registered
    **/
    // avlBookingStatus: Array<string> = ['B','D','C','H','L','P','R'];
    avlBookingStatus: Array<FilterBookingStatus> = [
        {
        id: 'B',
        name: 'Booked',
        checked: true,
        }, {
        id: 'D',
        name: 'Secured',
        checked: true,
        }, {
        id: 'C',
        name: 'Cancelled by Player',
        checked: false,
        }, {
        id: 'H',
        name: 'Partially Paid',
        checked: true,
        }, {
        id: 'L',
        name: 'Cancelled by Club',
        checked: false,
        }, {
        id: 'P',
        name: 'Fully Paid',
        checked: true,
        }, {
        id: 'R',
        name: 'Flights Registered',
        checked: false,
        }
    ]

    refundMethodList: Array<FilterRefundMethod>;
    filterBookingStatus: Array<string> = ['B', 'D', 'H', 'P'];
    searchMaxResults: number = 20;
    filterCourseId: number;
    showFilters: boolean = false;

    clubInfo: any;
    expandDetails: boolean = false;

    
    totalItems: number = 0;
    totalPages: number = 0;
    totalInPage: number = 0;
    success;
    
    allBookingList: Array < TeeTimeBooking > = new Array < TeeTimeBooking > ();
    filterRefundList: Array<string> = [];

    viewStats: boolean = false;

    filterTime: string = 'Both';
    filterInclude: string = 'Both';
    appFooterHide: boolean = true;
    
  private sessionStatusSubscription: Subscription
  currentSession: SessionInfo;
    constructor(private nav: NavController,
        private renderer: Renderer,
        private navParams: NavParams,
        private loadingCtl: LoadingController,
        private compService: CompetitionService,
        private actionSheetCtl: ActionSheetController,
        private platform: Platform,
        private flightService: ClubFlightService,
        private popoverCtl: PopoverController,
        private toastCtl: ToastController,
        private alertCtrl: AlertController,
        private clubService: ClubService,
        private modalCtl: ModalController,
        private sessionDataService: SessionDataService,
        private sessionActions: SessionActions,
        private mg2uUtil: mygolfUtils) {

        this.competition = navParams.get("competition");
        this.flights = navParams.get("flights");
        this.gameRound = navParams.get("gameRound");
        if (!this.competition) {
            this.competition = {
                competitionId: navParams.get("competitionId")
            };
            this.flights = new Array < FlightInfo > ();
            this.gameRound = createGameRoundInfo();
            this.gameRound.roundNo = navParams.get("roundNo");
        }
        this.filteredFlight = this.flights;
        //this.flightMembers = this.flights.flightMembers;
        this.visible = false;
        this.searchQuery = '';
        this.devWidth = this.platform.width();
        console.log("width: ", this.devWidth)

        this.clubId = navParams.get("clubId");
        if (!this.clubId) this.clubId = 310510379; //1701051914; //28101520; //mygolf2u golf club

        this.today = moment().format("YYYY-MM-DD");
        this.currentDate = moment().format("YYYY-MM-DD");
        this.toDate = moment().add('7','days').format("YYYY-MM-DD");

        console.log("tee flight : ", this.today, this.currentDate)


    }

    innerWidth: any;
    ngOnInit() {
    this.innerWidth = window.innerWidth;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
    this.innerWidth = window.innerWidth;
    }

    ionViewDidLoad() {
        // this._onViewLoaded();
        this.getAppAttribute();
        this.getClubRefundRedeemHistory();

        this.flightService.getClubInfo(this.clubId)
        .subscribe((clubInfo: any) => {
          this.clubInfo = clubInfo;
          console.log("club Calendar: ", clubInfo)

        });
        // this.getMasterFlightList(null,null);

        this.sessionStatusSubscription = this.sessionDataService.getSessionStatus()
            .distinctUntilChanged()
            .subscribe((status: SessionState)=>{
                this.sessionDataService.getSession()
                    .take(1)
                    .subscribe((session: SessionInfo)=>{
                        if(status === SessionState.LoginFailed){
                            let toast = this.toastCtl.create({
                                message: session.exception,
                                duration: 5000,
                                showCloseButton: true,
                                closeButtonText: 'OK'
                            });
                            toast.present().then(()=>{
                                this.sessionActions.clearLoginError();
                            });

                            MessageDisplayUtil.showErrorToast(session.exception, this.platform, this.toastCtl, 5000, 'bottom');

                        }
                        else if(status === SessionState.LoggedIn) {
                          this.currentSession = session;
                            // this.mainPage(session);
                        }
                      // console.log("[get session] session info ", session)
                    }, (error) => {
                      // console.log("[get session] error ", error)
                    });
                  // console.log("[get session] status : ",status)

            });
        // this.flightService.getBookingFlightList(this.clubId, this.currentDate, false)
        // .subscribe((data: Array<TeeTimeBooking>)=> {
        //     this.totalAllFlights = data.length;
        //     let _totalCheckIn;
        //     _totalCheckIn = data.filter((booking: TeeTimeBooking)=>{
        //         if(booking.bookingStatus === 'Secured' || booking.bookingStatus === 'PaymentFull' || booking.bookingStatus === 'PaymentPartial')
        //         return true
        //     })
        //     this.totalCheckIn = _totalCheckIn.length;

        //     let _totalUpcoming;
        //     _totalUpcoming = data.filter((booking: TeeTimeBooking)=>{
        //         if(booking.bookingStatus === 'Booked')
        //         return true
        //     })
        //     this.totalUpcoming = _totalUpcoming.length;
        //     console.log("booking flight : ", data)
        //     this.bookingFlightList = data;
        //     console.log("booking flight list : ", this.bookingFlightList)
        //     if(this.teeFlightTabs === 'checkedInTab') {
        //         this.filteredBFL = this.bookingFlightList.filter((bf)=>{
        //             return bf.bookingStatus === 'Secured'
        //         })
        //     } 
        //     else if(this.teeFlightTabs === 'bookedTab') {
        //         this.filteredBFL = this.bookingFlightList.filter((bf)=>{
        //             return bf.bookingStatus === 'Booked'
        //         })
        //     }
        //     else if(this.teeFlightTabs === 'allTab') {
        //         this.filteredBFL = this.bookingFlightList;
        //         // this.filteredBFL = this.bookingFlightList.filter((bf)=>{
        //         //     return bf.bookingStatus === 'Booked'
        //         // })
        //     }

        //     console.log("filtered booking flight list : ", this.filteredBFL)
        // })
    }

    ionViewDidEnter() {
        // this.getMasterFlightList(null, null);
        adjustViewZIndex(this.nav, this.renderer);
    }

    getMasterFlightList(refresher,infinite) {
        if(!moment(this.currentDate).isValid()) {
            MessageDisplayUtil.showMessageToast("Invalid From Date. Please check.", this.platform, this.toastCtl,3000, "bottom")
            return;
        }
        else if(!moment(this.toDate).isValid()) {
            MessageDisplayUtil.showMessageToast("Invalid To Date. Please check.", this.platform, this.toastCtl,3000, "bottom")
            return;
        }
        this.filteredBFL = [];
        if(!infinite) {
            this.upcomingList = [];
            this.allBookingList = [];
            this.totalInPage = 0;
            this.totalItems = 0;
            this.totalPages = 0;
            this.currentPage = 0;
        }
        this.checkedInList = [];
        if(refresher) {
            this.refresher = true;
            this.filterRefundList = [];
        }
        let _pageSize: number = this.searchMaxResults;
        let _pageNo: number = infinite?this.currentPage + 1:1;
        let _courseId = this.optionCourse?this.optionCourse.courseId:null; // this.filterCourseId;

        let _clubId = this.clubId;
        let _fromDate = this.currentDate;
        let _toDate = this.toDate;
        let _statusType = "C";
        // A - Active, I - Inactive, B - Both, C - Custom For custom specify comma separated list of status in statusList
        let _statusList = this.filterBookingStatus; //this.filterBookingStatus.toString();
        let _search = this.searchQuery;
        this.flightService.searchBookingClub(_clubId, _fromDate, _toDate, _statusType, _statusList, _courseId, _search, _pageSize, _pageNo)
        .subscribe((dataResp: PagedData<TeeTimeBooking>)=>{
        // this.flightService.getClubBookingList(this.clubId, this.currentDate, this.toDate, this.searchMaxResults, _status, _courseId)
        // .subscribe((dataResp: any) => {
                // Array<TeeTimeBooking>
                console.log("get from master flight list data", dataResp)
                // let data = dataResp.clubBookingList;
                this.totalInPage = dataResp.totalInPage;
                this.totalItems = dataResp.totalItems;
                this.totalPages = dataResp.totalPages;
                this.currentPage = dataResp.currentPage;
                let data = dataResp.items;
                this.allBookingList = dataResp.items;
                // if (1) return false;
                this.refresher = false;
                this.totalDayBuggies = 0;
                this.totalDayCaddies = 0;
                this.totalDayFlights = 0;
                this.totalDayPlayers = 0;
                this.totalDayDispatched = 0;
                let _totalCheckIn;
                let _totalUpcoming;
                // _totalUpcoming = data.filter((booking: TeeTimeBooking) => {
                //     if (booking.bookingStatus === 'Booked')
                //         return true
                // })
                // _totalCheckIn = data.filter((booking: TeeTimeBooking) => {
                //     if (booking.bookingStatus === 'Secured' || booking.bookingStatus === 'PaymentFull')
                //         return true
                // })





                // data.forEach((ttb:TeeTimeBooking)=>{
                //     this.totalDayPlayers += ttb.bookingPlayers.length;
                //     ttb.bookingPlayers.filter((p: TeeTimeBookingPlayer)=>{
                //         if(p.pairingNo && p.pairingNo > 0) this.totalDayBuggies += 1
                //         if(p.caddyPairing && p.caddyPairing > 0) this.totalDayCaddies += 1
                //     })
                // })
                console.log("booking flight : ", data)
                this.upcomingList.push(...data);
                console.log("booking flight list : ", this.bookingFlightList)

                this.upcomingList = this.upcomingList.filter((tb: TeeTimeBooking) => {
                    tb.bookingPlayers.sort((a, b) => {
                        if (a.caddyPairing < b.caddyPairing) return -1
                        else if (a.caddyPairing > b.caddyPairing) return 1
                        else return 0
                    })
                    return 1
                    // return ((tb.bookingStatus === 'Booked') || (tb.bookingStatus === 'PaymentFull') || (tb.bookingStatus === 'PaymentPartial')) && !tb.flight
                })
                .sort((a,b)=>{
                    if(a.slotAssigned.teeOffDate < b.slotAssigned.teeOffDate) {
                        return -1
                    } else if(a.slotAssigned.teeOffDate > b.slotAssigned.teeOffDate) { 
                        return 1
                    } else if(a.slotAssigned.teeOffDate === b.slotAssigned.teeOffDate) {
                            if(a.slotAssigned.slotNo < b.slotAssigned.slotNo) return -1
                            else if(a.slotAssigned.slotNo > b.slotAssigned.slotNo) return 1
                            else if(a.slotAssigned.slotNo === b.slotAssigned.slotNo) {
                                if(a.slotAssigned.startCourse.displayOrder < b.slotAssigned.startCourse.displayOrder)
                                    return -1
                                else if(a.slotAssigned.startCourse.displayOrder > b.slotAssigned.startCourse.displayOrder)
                                    return 1
                                else return 0
                            }
                        else return 0
                    } else return 0
                });

                this.checkedInList = this.bookingFlightList.filter((bf: TeeTimeBooking) => {
                        bf.bookingPlayers.sort((a, b) => {
                            // if (a.caddyPairing < b.caddyPairing) {
                                if(a.sequence < b.sequence) {
                                    if (a.caddyPairing < b.caddyPairing) return -1
                                    else if (a.caddyPairing > b.caddyPairing) return 1
                                    else return -1
                                }
                                else if (a.sequence > b.sequence) {
                                    if (a.caddyPairing < b.caddyPairing) return -1
                                    else if (a.caddyPairing > b.caddyPairing) return 1
                                    else return 1
                                } else if (a.sequence === b.sequence) {
                                    if (a.caddyPairing < b.caddyPairing) return -1
                                    else if (a.caddyPairing > b.caddyPairing) return 1
                                    else return 1
                                }
                                else return 0
                            // } 
                            // else if (a.caddyPairing > b.caddyPairing) {

                            //     if(a.sequence < b.sequence) return -1
                            //     else if (a.sequence > b.sequence) return 1
                            //     else return 1
                            // }
                            // else return 0
                        })
                        return (bf.bookingStatus === 'Secured' || bf.bookingStatus === 'PaymentFull')
                    })
                    .filter((bf: TeeTimeBooking) => {
                        return bf.flight && (bf.flight.status === 'Created' || bf.flight.status === 'Assigned')
                    })
                    .sort((a,b)=>{
                        if(a.slotAssigned.slotNo < b.slotAssigned.slotNo) return -1
                        else if(a.slotAssigned.slotNo > b.slotAssigned.slotNo) return 1
                        else 0
                    })

                this.filteredBFL = this.bookingFlightList.filter((bf: TeeTimeBooking) => {
                    bf.bookingPlayers.sort((a, b) => {
                        // if (a.caddyPairing < b.caddyPairing) return -1
                        // else if (a.caddyPairing > b.caddyPairing) return 1
                        // else return 0
                        if(a.sequence < b.sequence) {
                            if (a.caddyPairing < b.caddyPairing) return -1
                            else if (a.caddyPairing > b.caddyPairing) return 1
                            else return -1
                        }
                        else if (a.sequence > b.sequence) {
                            if (a.caddyPairing < b.caddyPairing) return -1
                            else if (a.caddyPairing > b.caddyPairing) return 1
                            else return 1
                        } else if (a.sequence === b.sequence) {
                            if (a.caddyPairing < b.caddyPairing) return -1
                            else if (a.caddyPairing > b.caddyPairing) return 1
                            else return 1
                        }
                        else return 0
                    })
                    return (bf.bookingStatus === 'Booked' || bf.bookingStatus === 'Secured' || bf.bookingStatus === 'PaymentFull' || bf.bookingStatus === 'PaymentPartial')
                    // return (bf.bookingStatus === 'PaymentFull' && (bf.flight && bf.flight.status !== 'Assigned' && bf.flight.status !== 'Created'))
                }).sort((a,b)=>{
                    if(a.slotAssigned.slotNo < b.slotAssigned.slotNo) return -1
                    else if(a.slotAssigned.slotNo > b.slotAssigned.slotNo) return 1
                    else 0
                })
                // .filter((bf: TeeTimeBooking)=>{
                //     return bf.flight &&  ( bf.flight.status === 'Assigned' || bf.flight.status === 'Created' ) 
                // });

                this.dispatchedList = this.bookingFlightList.filter((bf: TeeTimeBooking) => {
                    bf.bookingPlayers.sort((a, b) => {
                        // if (a.caddyPairing < b.caddyPairing) return -1
                        // else if (a.caddyPairing > b.caddyPairing) return 1
                        // else return 0
                        if(a.sequence < b.sequence) {
                            if (a.caddyPairing < b.caddyPairing) return -1
                            else if (a.caddyPairing > b.caddyPairing) return 1
                            else return -1
                        }
                        else if (a.sequence > b.sequence) {
                            if (a.caddyPairing < b.caddyPairing) return -1
                            else if (a.caddyPairing > b.caddyPairing) return 1
                            else return 1
                        } else if (a.sequence === b.sequence) {
                            if (a.caddyPairing < b.caddyPairing) return -1
                            else if (a.caddyPairing > b.caddyPairing) return 1
                            else return 1
                        }
                        else return 0
                    })
                    // return ( bf.bookingStatus === 'Booked' || bf.bookingStatus === 'Secured' || bf.bookingStatus === 'PaymentFull' || bf.bookingStatus === 'PaymentPartial' )
                    return (bf.bookingStatus === 'PaymentFull' && (bf.flight && bf.flight.status !== 'Assigned' && bf.flight.status !== 'Created'))
                })


                console.log("before sort : ", this.filteredBFL)

                let _countCaddy;
                let _countBuggy;
                this.filteredBFL.forEach((p) => {

                    _countCaddy = this.getUnique(p.bookingPlayers, 'caddyPairing')
                    _countCaddy = _countCaddy.filter((_player: TeeTimeBookingPlayer) => {
                        // if(_player.caddyPairing !== 0) return true
                        if (_player.caddyAssigned) return true
                    }).sort((a, b) => {
                        if (a.caddyPairing < b.caddyPairing) return -1
                        else if (a.caddyPairing > b.caddyPairing) return 1
                        else return 0
                    })
                    this.totalDayCaddies += _countCaddy.length

                    // this.totalDayPlayers += p.bookingPlayers.length;    

                    _countBuggy = this.getUnique(p.bookingPlayers, 'pairingNo')
                    _countBuggy = _countBuggy.filter((_player: TeeTimeBookingPlayer) => {
                        if (_player.pairingNo !== 0) return true
                    }).sort((a, b) => {
                        if (a.pairingNo < b.pairingNo) return -1
                        else if (a.pairingNo > b.pairingNo) return 1
                        else return 0
                    });
                    this.totalDayBuggies += _countBuggy.length;


                    // console.log("refresh master list - count Caddy : ", _countCaddy, this.totalDayCaddies);
                    // console.log("refresh master list - count buggy : ", _countBuggy, this.totalDayBuggies);
                    //     p.bookingPlayers.filter((player: TeeTimeBookingPlayer)=>{
                    //             if(player.pairingNo && player.pairingNo > 0) this.totalDayBuggies += 1
                    //             if(player.caddyPairing && player.caddyPairing > 0) this.totalDayCaddies += 1
                    //         })
                    // p.bookingPlayers.sort((a,b)=>{
                    //     if(a.caddyPairing < b.caddyPairing ) return -1
                    //     else if(a.caddyPairing > b.caddyPairing ) return 1
                    //     else return 0
                    // })
                })

                // this.checkedInList.forEach((p) => {
                //     this.totalDayPlayers += p.bookingPlayers.length;
                // })
                this.upcomingList.forEach((p) => {
                    this.totalDayPlayers += p.bookingPlayers.length;
                })
                // this.dispatchedList.forEach((p) => {
                //     this.totalDayPlayers += p.bookingPlayers.length;
                // })

                console.log("after sort : ", this.filteredBFL)
                console.log("refresh master list - count caddy ", _countCaddy);
                console.log("refresh master list - count buggy ", _countBuggy);
                console.log("refresh master list - check in list - ", this.checkedInList.length + " : ", this.checkedInList);
                console.log("refresh master list - upcoming list - ", this.upcomingList.length + ": ", this.upcomingList);
                console.log("refresh master list - filtered list - ", this.filteredBFL.length + " : ", this.filteredBFL);
                // console.log("refresh master list - total count Caddy : ", this.totalDayCaddies);
                // console.log("refresh master list - total count buggy : ", this.totalDayBuggies);

                if (this.optionCourse && this.optionCourse.courseId && (this.optionCourse.courseId !== 0)) {
                    this.upcomingList = this.upcomingList.filter((tb: TeeTimeBooking) => {
                        return tb.slotAssigned.startCourse.id === this.optionCourse.courseId
                    })
                    this.checkedInList = this.checkedInList.filter((tb: TeeTimeBooking) => {
                        return tb.slotAssigned.startCourse.id === this.optionCourse.courseId
                    })
                    this.filteredBFL = this.filteredBFL.filter((tb: TeeTimeBooking) => {
                        return tb.slotAssigned.startCourse.id === this.optionCourse.courseId
                    })
                    this.dispatchedList = this.dispatchedList.filter((tb: TeeTimeBooking) => {
                        return tb.slotAssigned.startCourse.id === this.optionCourse.courseId
                    })
                }

                if(this.optionFlightStatus !== 'all') {
                    if(this.optionFlightStatus === 'dispatched') {
                        this.dispatchedList = this.dispatchedList.filter((tb: TeeTimeBooking) => {
                            return tb.flight.status === 'Dispatched'
                        })
                    } else if(this.optionFlightStatus === 'started') {
                        this.dispatchedList = this.dispatchedList.filter((tb: TeeTimeBooking) => {
                            return tb.flight.status === 'PlayStarted'
                        })
                    } else if(this.optionFlightStatus === 'crossedover') {
                        this.dispatchedList = this.dispatchedList.filter((tb: TeeTimeBooking) => {
                            return tb.flight.status === 'CrossedOver'
                        })
                    } else if(this.optionFlightStatus === 'finished') {
                        this.dispatchedList = this.dispatchedList.filter((tb: TeeTimeBooking) => {
                            return tb.flight.status === 'PlayFinished'
                        })
                    } else if(this.optionFlightStatus === 'abandoned') {
                        this.dispatchedList = this.dispatchedList.filter((tb: TeeTimeBooking) => {
                            return tb.flight.status === 'Abandoned'
                        })
                    }
                }

                if(this.filterRefundList && this.filterRefundList.length > 0) {
                    this.upcomingList = this.upcomingList.filter((tb: TeeTimeBooking) => {
                        if(tb.amountPaid > 0) {
                            this.filterRefundList.forEach((ref, idx)=>{
                                tb.refunds.forEach((r: RefundInstance)=>{
                                    return ref === r.refundMode
                                })
                            })
                        }
                        
                    })
                }
                console.log("filtered status -", this.optionFlightStatus);
                console.log("dispatched list ", this.dispatchedList)



                this.totalCheckIn = this.checkedInList.length; // _totalCheckIn.length;
                this.totalUpcoming = this.upcomingList.length; // _totalUpcoming.length;
                // this.totalDayFlights = this.upcomingList.length; //this.checkedInList.length + this.upcomingList.length + this.dispatchedList.length;
                this.totalDayDispatched = this.dispatchedList.length;
                this.totalAllFlights = this.filteredBFL.length;


                // if(this.teeFlightTabs === 'checkedInTab') {
                //     // this.filteredBFL = this.bookingFlightList.filter((bf)=>{
                //     //     return ( bf.bookingStatus === 'Secured' || bf.bookingStatus === 'PaymentFull' || bf.bookingStatus === 'PaymentPartial' )
                //     // })
                //     this._filterCheckIn();
                // } 
                // else if(this.teeFlightTabs === 'bookedTab') {
                //     // this.filteredBFL = this.bookingFlightList.filter((bf)=>{
                //     //     return bf.bookingStatus === 'Booked'
                //     // })
                //     this._filterUpcoming();
                // }
                // else if(this.teeFlightTabs === 'allTab') {
                //     this.filteredBFL = this.bookingFlightList;
                //     // this.filteredBFL = this.bookingFlightList.filter((bf)=>{
                //     //     return bf.bookingStatus === 'Booked'
                //     // })
                // }

                // console.log("filtered booking flight list : ", this.filteredBFL)
            }, (error) => {
                this.refresher = false;
            }, ()=>{
                if (refresher && refresher.complete) refresher.complete();
                if (infinite) {
                    if (infinite.complete) infinite.complete();
                    if (this.isMore()) {
                        infinite.enable(true);
                    }
                    else infinite.enable(false);
                }
                console.log("flight list : ", this.upcomingList)
            })
    }

    _filterUpcoming() {
        this.upcomingList = this.bookingFlightList.filter((tb: TeeTimeBooking) => {
            return tb.bookingStatus === 'Booked'
        })
    }

    _filterCheckIn() {
        this.checkedInList = this.bookingFlightList.filter((bf: TeeTimeBooking) => {
            return (bf.bookingStatus === 'Secured' || bf.bookingStatus === 'PaymentFull' || bf.bookingStatus === 'PaymentPartial')
        })
    }

    // getMasterFlightListOLD() {
    //     this.flightService.getMasterFlightList()
    //     .subscribe((data: Array<TeeTimeFlight>) => {
    //         console.log('club flight service : ', data)
    //         this.starterList = data;
    //         this.currentPage = 0;
    //         this.filteredList = this.starterList;
    //         // if(this.teeFlightTabs === 'checkedInTab') {

    //         //     this.filteredList = this.starterList.filter((f)=>{
    //         //         return f.booking.bookingStatus === 'Secured'
    //         //     })
    //         // }
    //         // else if(this.teeFlightTabs === 'bookedTab') {
    //         //     this.filteredList.forEach((fL)=> {
    //         //         fL = this.starterList.filter((f)=>{
    //         //             return f.booking.bookingStatus === 'Booked'
    //         //         }).map(f.booking)
    //         //     }) 
    //         // }
    //         // this.filteredList = this.starterList;

    //         console.log('club flight this.starterList : ', this.starterList)

    //         console.log('club flight this.filteredList : ', this.filteredList)
    //     });
    // }
    getNotifications(): Array < NotificationHandlerInfo > {
        let notifications = new Array < NotificationHandlerInfo > ();
        notifications.push({
            type: AbstractNotificationHandlerPage.TYPE_FLIGHTS_GENERATED,
            whenActive: 'showToast',
            needRefresh: true
        });
        notifications.push({
            type: AbstractNotificationHandlerPage.TYPE_FLIGHTS_CHANGED,
            whenActive: 'showToast',
            needRefresh: true
        });
        return notifications;
    }
    refreshPage(pushData: any) {
        let compId = pushData.competitionId;
        let roundNo = pushData.roundNo;
        if (this.competition.competitionId === compId) {
            this.onRefreshClick(null);
        } else {
            this.competition.competitionId = compId;
            this.competition.competitionName = null;
            this.gameRound.roundNo = roundNo;
            this._onViewLoaded();
        }
    }
    private _onViewLoaded() {
        // this.getMasterFlightList(null,null);
        if (!this.competition.competitionName) {
            let loader = this.loadingCtl.create({
                content: "Loading..."
            });

            loader.present().then(() => {
                this.compService.getCompetitionInfo(this.competition.competitionId)
                    .subscribe((comp: CompetitionInfo) => {
                        this.competition = comp;
                        this.compService.getDetails(this.competition.competitionId)
                            .subscribe((det: CompetitionDetails) => {
                                this.details = det;
                                let ground = det.gameRounds.filter((gr: GameRoundInfo) => {
                                    return gr.roundNo === this.gameRound.roundNo
                                }).pop();
                                this.gameRound = ground;
                                this.compService.getFlights(this.competition.competitionId, this.gameRound.roundNo)
                                    .subscribe((flights: Array < FlightInfo > ) => {
                                        loader.dismiss().then(() => {
                                            this.flights = flights;
                                            this.filteredFlight = this.flights;
                                            this.searchQuery = "";
                                            this.onSearchCancel();
                                            console.log(this.flights)
                                        })

                                    }, (error) => {
                                        loader.dismiss();
                                    }, () => {

                                    });
                            }, (error) => {
                                loader.dismiss();
                            });
                    }, (error) => {
                        loader.dismiss();
                    });
            });
        }
    }
    onRefreshClick(refresher) {
        // this.refreshFlights(refresher);
        // this.getMasterFlightList(refresher,null);
        this.getClubRefundRedeemHistory();

    }

    toggle(searchBar) {
        this.visible = searchBar; //!this.visible;
    }

    onSearchCancel() {
        this.toggle(false);
    }

    onSearchInput(searchbar) {
        // this.filteredFlight = this.flights.filter((fp: FlightInfo, idx: number) => {
        //     let count = fp.flightMembers.filter((fm: FlightMember) => {
        //         return fm.playerName.toLowerCase().indexOf(this.searchQuery.toLowerCase()) >= 0;
        //     }).length;
        //     return count > 0;
        // });
    }

    onHomeClick() {
        this.nav.popToRoot(); //this.nav.setRoot(PlayerHomePage);
    }

    private refreshFlights(refresher) {

        let loader = this.loadingCtl.create({
            content: 'Loading flights list, Please wait...'
        });
        if (loader)
            loader.present().then(() => {
                this.compService.getFlights(this.competition.competitionId, this.gameRound.roundNo)
                    .subscribe((flights: Array < FlightInfo > ) => {
                        loader.dismiss().then(() => {
                            this.flights = flights;
                            this.filteredFlight = this.flights;
                            this.searchQuery = "";
                            this.onSearchCancel();
                        })

                    }, (error) => {

                    }, () => {
                        if (refresher) refresher.complete();

                        if (loader)
                            loader.dismiss();
                    });
            });

    }

    convStartTime(flightTime: string) {
        let teeTime = moment(flightTime, 'HH:mm:ss').format("HH:mm")
        // console.log("[Tee Time] flightTime ",flightTime)
        // console.log("[Tee Time] teeTime : ",teeTime)
        // return moment(teeTime).format("HH:mm")
        return teeTime
    }

    goDespatchFlight(flight: TeeTimeBooking) {
        let _status = 'Dispatched';
        let _bookingId;
        if (flight && flight.id) _bookingId = flight.id
        else return false;
        this.flightService.updateBookingFlightStatus(_bookingId, _status)
            .subscribe((data) => {
                console.log("dispatch flight ", data)
                if (data && data.status === 200) {
                    this.getMasterFlightList(null,null);
                }
            })
        // this.
    }

    onDespatchFlight(flight: any) {
        if (flight && !flight.flight) return false;
        let alert = this.alertCtrl.create({
            title: 'Dispatching Flight',
            // subTitle: 'Selected date is '+ _date,
            message: 'Do you want to dispatch this flight?', //'Selected date is ' + '<b>' + _date + '</b>',
            buttons: [ {
                text: 'No',
                role: 'cancel'
            },
            {
                text: 'Yes',
                handler: () => {
                    this.goDespatchFlight(flight);
                }
            },]
        });
        alert.present();
    }

    goFlightUpdate(flight: TeeTimeBooking) {
        // if(!flight.flight) return false;
        let _buttons = [{}];
        if (flight.flight && (flight.flight.status === 'Created' || flight.flight.status === 'Assigned')) {
            _buttons = [{
                    text: 'Dispatch',
                    // role: 'destructive', // will always sort to be on the bottom
                    // icon: !this.platform.is('ios') ? 'close' : null,
                    handler: () => {
                        this.onDespatchFlight(flight)
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Cancel Flight',
                    role: 'destructive', // will always sort to be on the bottom
                    icon: !this.platform.is('ios') ? 'close' : null,
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Change Start Course',
                    // role: 'destructive', // will always sort to be on the bottom
                    // icon: !this.platform.is('ios') ? 'close' : null,
                    handler: () => {
                        let changeSlot = this.modalCtl.create(TeeSlotListModal, {
                            currentSlot: flight,
                            clubId: this.clubId,
                            forDate: this.currentDate,
                            courseId: flight.slotAssigned.startCourse.id,
                            changeType: 'course'
                        })

                        changeSlot.onDidDismiss((data: any) => {
                            console.log("Change slot", data)
                            if(data) {
                                this.onChangeSlot(data.currentSlot.id, data.newSlot)
                            }
                        });
                        changeSlot.present();
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Move flight to ...',
                    // role: 'destructive', // will always sort to be on the bottom
                    // icon: !this.platform.is('ios') ? 'close' : null,
                    handler: () => {
                        let changeSlot = this.modalCtl.create(TeeSlotListModal, {
                            currentSlot: flight,
                            clubId: this.clubId,
                            forDate: this.currentDate,
                            courseId: flight.slotAssigned.startCourse.id,
                            changeType: 'slot'
                        })

                        changeSlot.onDidDismiss((data: any) => {
                            console.log("Change slot", data)
                            if(data) { 
                                this.onMoveSlot(data.currentSlot.id, data.newSlot)
                            }
                        });
                        changeSlot.present();
                        console.log('Cancel clicked');
                    }
                },
                // {
                //     text: 'Swap flight with...',
                //     // role: 'destructive', // will always sort to be on the bottom
                //     // icon: !this.platform.is('ios') ? 'close' : null,
                //     handler: () => {
                //         let changeSlot = this.modalCtl.create(TeeSlotListModal, {
                //             currentSlot: flight,
                //             clubId: this.clubId,
                //             forDate: this.currentDate,
                //             courseId: flight.slotAssigned.startCourse.id,
                //             changeType: 'swap'
                //         })

                //         changeSlot.onDidDismiss((data: any) => {
                //             console.log("Change slot", data)
                //             if(data) { 
                //                 this.onSwapSlots(data.currentSlot.id, data.newSlot)
                //             }
                //         });
                //         changeSlot.present();
                //         console.log('Cancel clicked');
                //     }
                // },
                {
                    text: 'Close',
                    role: 'cancel', // will always sort to be on the bottom
                    icon: !this.platform.is('ios') ? 'close' : null,
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
            ]
        } else if (flight && !flight.flight) {
            _buttons = [
                //     {
                //         text: 'Update Flight',
                //     role: 'destructive', // will always sort to be on the bottom
                //     icon: !this.platform.is('ios') ? 'close' : null,
                //     handler: () => {
                //       console.log('Cancel clicked');
                //     }
                // },
                {
                    text: 'Check-In Flight',
                    // role: 'destructive', // will always sort to be on the bottom
                    // icon: !this.platform.is('ios') ? 'close' : null,
                    handler: () => {
                        if (flight.bookingStatus !== 'PaymentFull') {
                            let alert = this.alertCtrl.create({
                                title: 'Flight Payment',
                                message: 'Full payment must be made before checking-in', //'Full payment for this flight have not been made.',
                                buttons: [{
                                    text: 'Close',
                                    role: 'Cancel',
                                }]// ['Close']
                            });
                            alert.present();
                        } else {
                            this.onCheckInFlight(flight)
                        }
                    }

                },
                {
                    text: 'Change Start Course',
                    // role: 'destructive', // will always sort to be on the bottom
                    // icon: !this.platform.is('ios') ? 'close' : null,
                    handler: () => {
                        let changeSlot = this.modalCtl.create(TeeSlotListModal, {
                            currentSlot: flight,
                            clubId: this.clubId,
                            forDate: this.currentDate,
                            courseId: flight.slotAssigned.startCourse.id,
                            changeType: 'course'
                        })

                        changeSlot.onDidDismiss((data: any) => {
                            console.log("Change slot", data)
                            if(data) { 
                                this.onChangeSlot(data.currentSlot.id, data.newSlot)
                            }
                        });
                        changeSlot.present();
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Move flight to ...',
                    // role: 'destructive', // will always sort to be on the bottom
                    // icon: !this.platform.is('ios') ? 'close' : null,
                    handler: () => {
                        let changeSlot = this.modalCtl.create(TeeSlotListModal, {
                            currentSlot: flight,
                            clubId: this.clubId,
                            forDate: this.currentDate,
                            courseId: flight.slotAssigned.startCourse.id,
                            changeType: 'slot'
                        })

                        changeSlot.onDidDismiss((data: any) => {
                            console.log("Change slot", data)
                            if(data) { 
                                this.onMoveSlot(data.currentSlot.id, data.newSlot)
                            }
                        });
                        changeSlot.present();
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Close',
                    role: 'cancel', // will always sort to be on the bottom
                    icon: !this.platform.is('ios') ? 'close' : null,
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
            ]
        } else if (flight.flight && (flight.flight.status !== 'Created' && flight.flight.status !== 'Assigned')) {
            _buttons = [];
            if (flight.flight.status === 'Dispatched') {
                _buttons.push({
                    text: 'Start',
                    // role: 'destructive', // will always sort to be on the bottom
                    // icon: !this.platform.is('ios') ? 'close' : null,
                    handler: () => {
                        this.onStartFlight(flight)
                        console.log('Cancel clicked');
                    }
                })
            } else if (flight.flight.status === 'PlayStarted') {
                _buttons.push({
                    text: 'Crossover',
                    // role: 'destructive', // will always sort to be on the bottom
                    // icon: !this.platform.is('ios') ? 'close' : null,
                    handler: () => {
                        this.onCrossoverFlight(flight)
                        console.log('Cancel clicked');
                    }
                });
                _buttons.push({
                    text: 'Abandon',
                    role: 'destructive', // will always sort to be on the bottom
                    icon: !this.platform.is('ios') ? 'close' : null,
                    handler: () => {
                        this.onAbandonFlight(flight)
                        console.log('Cancel clicked');
                    }
                })

            } else if(flight.flight.status ==='CrossedOver') {
                _buttons.push({
                                text: 'Finish',
                                role: 'destructive', // will always sort to be on the bottom
                                icon: !this.platform.is('ios') ? 'close' : null,
                                handler: () => {
                                    this.onFinishFlight(flight)
                                  console.log('Cancel clicked');
                                }
                              })
                _buttons.push({
                    text: 'Abandon',
                    role: 'destructive', // will always sort to be on the bottom
                    icon: !this.platform.is('ios') ? 'close' : null,
                    handler: () => {
                        this.onAbandonFlight(flight)
                        console.log('Cancel clicked');
                    }
                })
            }

            // ( flight.flight.status === 'Dispatched' || flight.flight.status ==='PlayStarted'
            // || flight.flight.status ==='CrossedOver' || flight.flight.status ==='PlayFinished')) {
            //     _buttons = [
            //         {
            //             text: 'Start',
            //             role: 'destructive', // will always sort to be on the bottom
            //             icon: !this.platform.is('ios') ? 'close' : null,
            //             handler: () => {
            //                 this.onStartFlight(flight)
            //               console.log('Cancel clicked');
            //             }
            //           },
            //           {
            //             text: 'Crossover',
            //             role: 'destructive', // will always sort to be on the bottom
            //             icon: !this.platform.is('ios') ? 'close' : null,
            //             handler: () => {
            //                 this.onCrossoverFlight(flight)
            //               console.log('Cancel clicked');
            //             }
            //           },
            //           {
            //             text: 'Finish',
            //             role: 'destructive', // will always sort to be on the bottom
            //             icon: !this.platform.is('ios') ? 'close' : null,
            //             handler: () => {
            //                 this.onFinishFlight(flight)
            //               console.log('Cancel clicked');
            //             }
            //           },
            //           {
            //             text: 'Abandon',
            //             role: 'destructive', // will always sort to be on the bottom
            //             icon: !this.platform.is('ios') ? 'close' : null,
            //             handler: () => {
            //                 this.onAbandonFlight(flight)
            //               console.log('Cancel clicked');
            //             }
            //           },
            //     ]
            _buttons.push({
                text: 'Close',
                role: 'cancel', // will always sort to be on the bottom
                icon: !this.platform.is('ios') ? 'close' : null,
                handler: () => {
                    console.log('Cancel clicked');
                }
            })


        } else _buttons = [

            {
                text: 'Dispatch',
                // role: 'destructive', // will always sort to be on the bottom
                // icon: !this.platform.is('ios') ? 'close' : null,
                handler: () => {
                    this.onDespatchFlight(flight)
                    console.log('Cancel clicked');
                }
            },
            {
                text: 'Change Start Course',
                // role: 'destructive', // will always sort to be on the bottom
                // icon: !this.platform.is('ios') ? 'close' : null,
                handler: () => {
                    let changeSlot = this.modalCtl.create(TeeSlotListModal, {
                        currentSlot: flight,
                        clubId: this.clubId,
                        forDate: this.currentDate,
                        courseId: flight.slotAssigned.startCourse.id,
                        changeType: 'course'
                    })

                    changeSlot.onDidDismiss((data: any) => {});
                    changeSlot.present();
                    console.log('Cancel clicked');
                }
            },
            {
                text: 'Move flight to ...',
                // role: 'destructive', // will always sort to be on the bottom
                // icon: !this.platform.is('ios') ? 'close' : null,
                handler: () => {
                    let changeSlot = this.modalCtl.create(TeeSlotListModal, {
                        currentSlot: flight,
                        clubId: this.clubId,
                        forDate: this.currentDate,
                        courseId: flight.slotAssigned.startCourse.id,
                        changeType: 'slot'
                    })

                    changeSlot.onDidDismiss((data: any) => {});
                    changeSlot.present();
                    console.log('Cancel clicked');
                }
            },
            {
                text: 'Close',
                role: 'cancel', // will always sort to be on the bottom
                icon: !this.platform.is('ios') ? 'close' : null,
                handler: () => {
                    console.log('Cancel clicked');
                }
            },
        ]

        let actionSheet = this.actionSheetCtl.create({



            buttons: _buttons
            // [

            //   {
            //     text: 'Dispatch',
            //     role: 'destructive', // will always sort to be on the bottom
            //     icon: !this.platform.is('ios') ? 'close' : null,
            //     handler: () => {
            //         this.onDespatchFlight(flight)
            //       console.log('Cancel clicked');
            //     }
            //   },
            //   {
            //     text: 'Check In',
            //     role: 'destructive', // will always sort to be on the bottom
            //     icon: !this.platform.is('ios') ? 'close' : null,
            //     handler: () => {
            //       console.log('Cancel clicked');
            //     }
            //   },
            //   {
            //     text: 'Change Start Course',
            //     role: 'destructive', // will always sort to be on the bottom
            //     icon: !this.platform.is('ios') ? 'close' : null,
            //     handler: () => {
            //       console.log('Cancel clicked');
            //     }
            //   },
            //   {
            //     text: 'Move flight to ...',
            //     role: 'destructive', // will always sort to be on the bottom
            //     icon: !this.platform.is('ios') ? 'close' : null,
            //     handler: () => {
            //       console.log('Cancel clicked');
            //     }
            //   },
            //   {
            //     text: 'Close',
            //     role: 'cancel', // will always sort to be on the bottom
            //     icon: !this.platform.is('ios') ? 'close' : null,
            //     handler: () => {
            //       console.log('Cancel clicked');
            //     }
            //   },
            // ]
        });

        actionSheet.present();
    }

    toggleReorder() {
        this.itemReorder = !this.itemReorder;
    }

    goFlightDetail(teeTimeBooking: TeeTimeBooking, flightNo ? : number) {
        // if(!teeTimeBooking.flight) {
        //     MessageDisplayUtil.showMessageToast('There is no flight created yet', 
        //     this.platform, this.toastCtl,3000, "bottom")
        //     return false;
        // }
        this.nav.push(TeeBuggyListPage, {
            teeTimeBooking: teeTimeBooking,
            flightNumber: flightNo,
            caddieMaster: true
        });
    }

    nextPage() {
        // console.log("next page pre: ",this.currentPage, this.starterList.length)
        if (this.currentPage < this.starterList.length) this.currentPage = this.currentPage + 1;
        // console.log("next page post : ",this.currentPage, this.starterList.length)
    }

    // prevPage() {
    //     // console.log("prev page pre : ",this.currentPage, this.starterList.length)
    //     if(this.currentPage>0) this.currentPage = this.currentPage - 1;
    //     // console.log("prev page post : ",this.currentPage, this.starterList.length)
    // }

    checkLastPage() {
        // console.log("check last page : ",this.currentPage < ( this.starterList.length - 1))
        return this.currentPage < (this.starterList.length - 1);
    }

    onTabClick() {
        // this.filteredBFL = [];
        // if(this.teeFlightTabs === 'checkedInTab') {
        //     this._filterCheckIn();
        //     // this.filteredBFL = this.bookingFlightList.filter((bf)=>{
        //     //     return (bf.bookingStatus === 'Secured' || bf.bookingStatus === 'PaymentFull' || bf.bookingStatus === 'PaymentPartial')
        //     // })

        //     // this.filteredList = this.filteredList.filter((f)=>{
        //     //     return f.booking.bookingStatus === 'Secured'
        //     // })
        // }

        // else if(this.teeFlightTabs === 'bookedTab') {
        //     this._filterUpcoming();
        //     // this.filteredBFL = this.bookingFlightList.filter((bf)=>{
        //     //     return bf.bookingStatus === 'Booked'
        //     // })
        //     // this.filteredList = this.filteredList.filter((f)=>{
        //     //     return f.booking.bookingStatus === 'Booked'
        //     // })
        // }
        // else if(this.teeFlightTabs === 'allTab') {
        //     this.filteredBFL = this.bookingFlightList;
        // }
    }

    onReorder(event, type) {
        // let element = this.items[event.from];
        let element = this.filteredBFL[event.from];
        console.log("reorder splice #1 : ", this.filteredBFL.splice(event.from, 1));

        console.log("reorder splice #2 : ", this.filteredBFL.splice(event.to, 0, element));


        // this.filteredBFL = reorderArray(this.filteredBFL, event);
        console.log("on reorder event : ", event)
        console.log("on reorder event type : ", this.teeFlightTabs)
    }

    checkItems() {
        console.log("on reorder Check items : ", this.filteredBFL)
    }

    nextDate() {
        this.currentDate = moment(this.currentDate).add(1, 'days').format("YYYY-MM-DD");
        // this.getMasterFlightList(null,null);
    }

    prevDate() {
        this.currentDate = moment(this.currentDate).subtract(1, 'days').format("YYYY-MM-DD");
        // this.getMasterFlightList(null,null);
    }

    confirmDate(refresher?: any) {
        console.log("confirm date - currentDate : ", this.currentDate, " | toDate : ", this.toDate)
        // console.log("confirm date - currentDate : ", moment(this.currentDate,"YYYY-MM-DD", true), " | toDate : ", moment(this.toDate,"YYYY-MM-DD",true))
        // console.log("confirm date - currentDate : ", moment(this.currentDate).isValid(), " | toDate : ", moment(this.toDate).isValid())
        // this.getMasterFlightList(refresher,null);
        this.getClubRefundRedeemHistory();
    }

    prevPage() {
        if (moment(this.currentDate).toDate() > moment(this.today).toDate()) return 1;
    }

    getStartCourse(teeFlight: TeeTimeBooking) {
        let teeSlot: TeeTimeSlot = teeFlight.slotAssigned;
        return teeSlot.startCourse.name;
    }

    getTotalBuggies(teeFlight: TeeTimeBooking) {
        // let
    }

    checkPlayerSlot(teeFlight: TeeTimeBooking, slot: number) {
        let _slot = slot - 1;
        let bookingPlayer: TeeTimeBookingPlayer;
        bookingPlayer = teeFlight.bookingPlayers[_slot];
        console.log("check player slot ", _slot, " : ", teeFlight.bookingPlayers[_slot])
        if (bookingPlayer) return true
        else false
    }

    getPlayerSlot(teeFlight: TeeTimeBooking, slot: number, attribute: string, id ? : number) {
        let _slot = slot - 1;
        let _name;
        let _bookingPlayers: Array < TeeTimeBookingPlayer > ; //: TeeTimeBookingPlayer = {}
        let _bookingSlot: Array < TeeTimeBooking > = [];

        let _image = 'img/default-user.jpg';
        console.log("get player slot : checked In ", this.checkedInList);
        console.log("get player slot : upcoming / booked ", this.upcomingList);
        console.log("get player slot : filtered BFL (all) ", this.filteredBFL);
        console.log("get player slot : original  ", this.bookingFlightList);
        if (id) {
            if (this.teeFlightTabs === 'checkedInTab') {
                _bookingSlot.push(...this.checkedInList.filter((tb: TeeTimeBooking) => {
                    return tb.id === id
                }))
            } else if (this.teeFlightTabs === 'bookedTab') {
                _bookingSlot.push(...this.upcomingList.filter((tb: TeeTimeBooking) => {
                    return tb.id === id
                }))
            } else if (this.teeFlightTabs === 'allTab') {
                _bookingSlot.push(...this.filteredBFL.filter((tb: TeeTimeBooking) => {
                    return tb.id === id
                }))
            }

            _bookingPlayers = _bookingSlot[0].bookingPlayers;
            console.log("bookingslot", _bookingSlot[0])
            console.log("bookingPlayer", _bookingPlayers)



            if (_bookingSlot[0] && _bookingSlot[0].bookingPlayers[_slot].player && _bookingSlot[0].bookingPlayers[_slot].player.profile) {
                if (_bookingSlot[0].bookingPlayers[_slot].player.profile)
                    _image = _bookingSlot[0].bookingPlayers[_slot].player.profile
                // else if (bookingPlayer.player.image)
                //     _image = bookingPlayer.player.image
                else _image = 'img/default-user.jpg';
            } else _image = 'img/default-user.jpg'
        }
        // .map((v:TeeTimeBooking)=> {
        //     // _bookingSlot = JSON.parse(JSON.stringify(v));
        // })
        // _bookingPlayers = _bookingSlot.bookingPlayers[_slot];
        // console.log("bookingPlayer", bookingPlayer)




        // .bookingPlayers[_slot].playerName, _image 

        switch (attribute) {
            case 'name':
                // return _bookingSlot&&_bookingSlot.bookingPlayers[_slot].playerName?_bookingSlot.bookingPlayers[_slot].playerName:'';
                // return '';
                _name = _bookingSlot[0] && _bookingPlayers[_slot].playerName ? _bookingPlayers[_slot].playerName : '';
                let _nameSplit = _name.split(" ");
                // return _nameSplit[0]?_nameSplit[0]:'';
                return '';
            case 'image':
                // console.log("get player slot ", bookingPlayer.player)
                // return bookingPlayer.player&&bookingPlayer.player.profile?(bookingPlayer.player.profile?bookingPlayer.player.profile:bookingPlayer.player.image):'img/default_user.png';
                // return _image?_image:'';
                return '';
        }
    }

    getTeeOffTime(teeOffTime: any) {
        // let _teeTime: string = '';
        // _teeTime = teeOffTime.hour + ":" + teeOffTime.minute;
        return moment(teeOffTime, 'HH:mm:ss').format("hh:mm A");
    }

    getTeeOffDate(teeOffDate: any) {
        // let _teeTime: string = '';
        // _teeTime = teeOffTime.hour + ":" + teeOffTime.minute;
        return moment(teeOffDate, 'YYYY-MM-DD').format("ddd, DD MMM YYYY");
    }

    // getPlayerImage(teeFlight: TeeTimeBooking, slot: number) {
    //     let _slot = slot - 1;
    //     let bookingPlayer: TeeTimeBookingPlayer;
    //     bookingPlayer = teeFlight.bookingPlayers[_slot];
    //     switch(attribute) {
    //         case 'name':
    //             return bookingPlayer.playerName
    //     }
    // }
    getCount(x: any, type ? : string) {
        let _countBuggy;
        let _countCaddy;

        if (type === 'caddy') {
            _countCaddy = this.getUnique(x, 'caddyPairing')
            _countCaddy = _countCaddy
                .filter((_p: TeeTimeBookingPlayer) => {
                    if (_p.caddyAssigned || _p.caddyPreferred) return true
                }).sort((a, b) => {
                    if (a.caddyPairing < b.caddyPairing) return -1
                    else if (a.caddyPairing > b.caddyPairing) return 1
                    else return 0
                })

            // .filter((_p: TeeTimeBookingPlayer)=>{
            //     if(_p.caddyPairing !== 0) return true
            // }).sort((a,b)=>{
            //     if(a.caddyPairing < b.caddyPairing ) return -1
            //     else if(a.caddyPairing > b.caddyPairing ) return 1
            //     else return 0
            // })
            // console.log("get count x : ", x)
            // console.log("get count type : ", type);
            // console.log("get count buggy", _countCaddy)
            return _countCaddy.length;
        } else if (type === 'buggy') {
            _countBuggy = this.getUnique(x, 'pairingNo')
            _countBuggy = _countBuggy
                .filter((_p: TeeTimeBookingPlayer) => {
                    if (_p.pairingNo !== 0) return true
                })
                .sort((a, b) => {
                    if (a.pairingNo < b.pairingNo) return -1
                    else if (a.pairingNo > b.pairingNo) return 1
                    else return 0
                })
            // console.log("count buggy : ", x)
            // if(_countBuggy[0].pairingNo === 0) _countBuggy.shift();
            // console.log("get count x : ", x)
            // console.log("get count type : ", type);
            // console.log("get count buggy", _countBuggy)
            return _countBuggy.length;
        } else if(type === 'player') {
            return x.bookingPlayers.length;
            // return x.totalPlayers;
        }


    }

    getUnique(arr, comp) {

        // store the comparison  values in array
        const unique = arr.map(e => e[comp])

            // store the indexes of the unique objects
            .map((e, i, final) => final.indexOf(e) === i && i)

            // eliminate the false indexes & return unique objects
            .filter((e) => arr[e]).map(e => arr[e]);

        return unique;
    }

    getPlayerSlotNew(p: TeeTimeBookingPlayer, attribute: string) {
        switch (attribute) {
            case 'name':
                let _nameSplit; //= p.playerName;
                _nameSplit = p.playerName.split(" ");
                // console.log("get player slot new : ", p.playerName, _nameSplit)
                return p.playerName; //_nameSplit[0];
            case 'image':
                // return p.player && p.player.profile ? p.player.profile?p.player.profile:(p.player.image?p.player.image:'') :'';
                return p.player && p.player.profile ?p.player.profile:(p.player && p.player.image?p.player.image:'');
        }
    }

    getCaddySlot(p: TeeTimeBookingPlayer, attribute: string) {
        switch (attribute) {
            case 'name':
                if (p.caddyAssigned && p.caddyAssigned.id)
                    return "(#" + p.caddyAssigned.staffId + ")";
                // return p.caddyAssigned.firstName + " ("+ p.caddyAssigned.id + ")";
                else if (p.caddyPreferred && p.caddyPreferred.staffId)
                    return "(#" + p.caddyPreferred.staffId + ")"
                // return p.caddyPreferred.firstName + " ("+ p.caddyPreferred.id + ")"
                else return '';
            case 'image':
                if (p.caddyAssigned && p.caddyAssigned.caddyImage) return p.caddyAssigned.caddyImage;
                else if (p.caddyPreferred && p.caddyPreferred.caddyImage) return p.caddyPreferred.caddyImage;
                else return '';
        }
    }

    checkPlayerCaddyNew(p: TeeTimeBookingPlayer, list: TeeTimeBooking, playerIdx: number) {
        let _playerHasCaddy = p.caddyPreferred || p.caddyAssigned;
        // if(list&&list.bookingPlayers) {
        //     if(list.bookingPlayers[playerIdx].caddyAssigned || list.bookingPlayers[playerIdx].caddyPreferred)
        //     _playerHasCaddy = true
        //     else _playerHasCaddy = false
        // } else _playerHasCaddy = false

        let _prevPlayerSameCaddy = true;
        // if(playerIdx > 0) {
        //     if(list&&list.bookingPlayers) {
        //         if((p.caddyAssigned && list.bookingPlayers[playerIdx-1].caddyAssigned.id === p.caddyAssigned.id)
        //             || (p.caddyPreferred && list.bookingPlayers[playerIdx-1].caddyPreferred.id === p.caddyPreferred.id))
        //             _prevPlayerSameCaddy = false
        //             else _prevPlayerSameCaddy = true;
        //     }

        // } else _prevPlayerSameCaddy = true;

        // console.log("check player caddy", _playerHasCaddy, _prevPlayerSameCaddy)
        return _playerHasCaddy && _prevPlayerSameCaddy
    }

    checkPlayerCaddy(p: TeeTimeBookingPlayer, list: TeeTimeBooking, playerIdx: number, type ? : string, listIdx ? : number) {
        let _needCaddy;
        // let _currentList =
        // list.bookingPlayers
        // .filter((player: TeeTimeBookingPlayer)=>{
        //     return player.id === p.id
        // })
        // .map(()=>{

        // })
        // .filter((player: TeeTimeBookingPlayer, idx, plist)=>{
        //     if(playerIdx>0) {
        //         if(player.caddyPreferred.id === plist[idx-1].caddyPreferred.id)
        //             return false
        //     }
        //     // if(idx > 0 && player.caddyPreferred.id === plist[idx-1].caddyPreferred.id) {
        //     //             _needCaddy =  false
        //     //             return false;
        //     //         }
        //     //         else {
        //     //             _needCaddy = true;
        //     //             return true;
        //     //         }
        // })

        let _list: TeeTimeBooking = {};
        let _prevIdx = playerIdx - 1;
        if (type === 'upcoming') _list = list;
        else if (type === 'checkin') _list = list;
        else _list = list;
        let _playerList = _list.bookingPlayers[playerIdx];
        let _prevPlayerList = _list.bookingPlayers[_prevIdx];
        // switch(type) {
        //     case 'upcoming':
        //     _list = list;//this.upcomingList[listIdx];
        //     break;
        //     case 'checkin':
        //         _list = list;//this.checkedInList[listIdx];
        //     break;
        //     default:
        //         _list = list; //this.filteredBFL[listIdx];
        //         break;
        // }
        let _result = null;
        console.log("check caddy player ", _list, type)
        if (_list && playerIdx > 0 && playerIdx <= _list.bookingPlayers.length) {

            if (p.caddyPreferred || p.caddyAssigned) {
                if ((_prevPlayerList.caddyPreferred && _playerList.caddyPreferred) &&
                    _playerList.caddyPreferred.id === _prevPlayerList.caddyPreferred.id)
                    // return false
                    _result = false;
                // console.log("prev same caddy")
                else if ((_prevPlayerList.caddyAssigned && _playerList.caddyAssigned) &&
                    _playerList.caddyAssigned.id === _prevPlayerList.caddyAssigned.id)
                    // return false
                    console.log("prev same caddy too")
                else
                    // return true
                    console.log("prev diff caddy")
            } else
                // return false
                console.log("prev same caddy too too")

        }
        // else if(playerIdx === 0) {
        //     if(p.caddyPreferred || p.caddyAssigned) return true
        //     else return false
        // }
        else console.log("prev same caddy too too too")
        // return false
        return _result;



        // .every((player, idx, plist)=>{
        //     if(idx > 0 && player.caddyPreferred.id === plist[idx-1].caddyPreferred.id) {
        //         _needCaddy =  false
        //         return false;
        //     }
        //     else {
        //         _needCaddy = true;
        //         return true;
        //     }
        // })
        // console.log("check caddy player ", _needCaddy, _currentList)
        // return _needCaddy
        // list.bookingPlayers.forEach((plist: TeeTimeBookingPlayer)=>{
        //     plist.id === p.id
        // })
    }

    getFlightStatus(flight: TeeTimeBooking) {
        let _flightStatus = '';
        let _bookingStatus = '';

        let _status = '';
        // if (flight && flight.flight) _flightStatus = flight.flight.status;
        // else if (flight && !flight.flight) _flightStatus = flight.bookingStatus;
        // else _flightStatus = flight.bookingStatus;

        
        if(flight) _bookingStatus = flight.bookingStatus;
        if(flight && flight.flight) _flightStatus = flight.flight.status;


        // export type TeeTimeBookingStatus = "Booked" | "Secured" | "CancelledByPlayer" | "CancelledByClub" | "PaymentPartial" | "PaymentFull" | "FlightRegistered" | "RefundInitiated" | "RefundCompleted";

        // export type TeeTimeFlightStatus = "Created" | "Assigned" | "Dispatched" | "PlayStarted" | "CrossedOver" | "Abandoned" | "PlayFinished";

        
        if(_bookingStatus === 'CancelledByPlayer') _status = 'Player Cancelled';
        else if(_bookingStatus === 'CancelledByClub') _status = 'Club Cancelled';
        else if (_bookingStatus === 'PaymentFull') _status = 'Paid in Full';
        else if (_bookingStatus === 'PaymentPartial') _status = 'Partially Paid';
        else if (_bookingStatus === 'FlightRegistered') _status = 'Flight Registered';
        else if (_bookingStatus === 'RefundInitiated') _status = 'Refund Initiated';
        else if (_bookingStatus === 'RefundCompleted') _status = 'Refund Completed';
        else _status = _bookingStatus;

        if(_flightStatus && _flightStatus.length > 0) _status += ' | ';
        if (_flightStatus === 'PlayStarted') _status += 'Started';
        else if (_flightStatus === 'Dispatched') _status += 'Dispatched';
        else if (_flightStatus === 'CrossedOver') _status += 'Crossed Over';
        else if (_flightStatus === 'PlayFinished') _status += 'Finished';
        else if (_flightStatus === 'Assigned') _status += 'Checked-In';
        else if (_flightStatus && _flightStatus.length > 0) _status += _flightStatus

        // if (_flightStatus === 'PlayStarted') _flightStatus = 'Started';
        // else if (_flightStatus === 'Dispatched') _flightStatus = 'Dispatched';
        // else if (_flightStatus === 'CrossedOver') _flightStatus = 'Crossed Over';
        // else if (_flightStatus === 'PlayFinished') _flightStatus = 'Finished';
        // else if (_flightStatus === 'PaymentFull') _flightStatus = 'Paid in Full';
        // else if (_flightStatus === 'PaymentPartial') _flightStatus = 'Partially Paid';
        // else if (_flightStatus === 'CancelledByPlayer') _flightStatus = 'Player Cancelled';
        // else if (_flightStatus === 'CancelledByClub') _flightStatus = 'Club Cancelled';
        // else if (_flightStatus === 'Assigned') _flightStatus = 'Checked-In';



        return _status;

        // if(flight && flight.flight) return flight.flight.status;
        // else if (flight && !flight.flight) return flight.bookingStatus;
        // else return flight.bookingStatus;
    }

    checkActionAccess(flight: TeeTimeBooking) {
        // if(flight && flight.flight && flight.flight.status === 'CrossedOver') return false;
        // else if(flight && flight.flight && flight.flight.status === 'PlayFinished') return false;
        // else if(flight && flight.flight && flight.flight.status === 'PlayStarted') return false;
        // else if(flight && flight.flight && flight.flight.status === 'Dispatched') return false;
        // else return true
        return true
    }

    onUpdateFlight(flight: TeeTimeBooking) {
        console.log("update flight", flight)
        if (flight && (flight.flight.status === 'PlayFinished')) return false;
        let alert = this.alertCtrl.create({
            title: 'Flight Finishing',
            message: 'This process assignment this flight. Do you want to proceed?',
            buttons: [{
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        // this.goFinishFlight(flight);
                        console.log('Buy clicked');
                    }
                }
            ]
        });
        alert.present();
    }

    goUpdateFlight(flight: TeeTimeBooking) {
        let _bookingId;
        if (flight && flight.id) _bookingId = flight.id;
        let loader = this.loadingCtl.create({
            content: 'Processing flight, Please wait...',
            duration: 5000,
        });

        loader.present().then(() => {
            this.flightService.processBookingAssignments(_bookingId)
                .subscribe((data) => {
                    loader.dismiss().then(() => {
                        if (data && data.status === 200) {
                            this.getMasterFlightList(null,null)
                        }
                    })
                }, (error) => {

                })
        })

    }

    onCheckInFlight(flight: TeeTimeBooking) {
        console.log("check in flight", flight)
        if (flight && (flight.bookingStatus !== 'PaymentFull')) return false;
        let alert = this.alertCtrl.create({
            title: 'Flight Check-In',
            message: 'This will check in the selected flight. Do you want to proceed?',
            buttons: [{
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.goCheckInFlight(flight);
                        console.log('Buy clicked');
                    }
                }
            ]
        });
        alert.present();
    }

    goCheckInFlight(flight: TeeTimeBooking) {
        let _bookingId;
        if (flight && flight.id) _bookingId = flight.id;
        let loader = this.loadingCtl.create({
            content: 'Checking-In flight, Please wait...',
            duration: 5000,
        });

        let _bookingPlayerId = [];
        flight.bookingPlayers.forEach((b: TeeTimeBookingPlayer, playerIdx: number) => {
            // if(idx === playerIdx && checkIn) 
            _bookingPlayerId.push(b.id)
        });

        console.log("check in ", _bookingPlayerId, flight, _bookingId)

        loader.present().then(() => {
            this.flightService.checkinBooking(_bookingId, 0, _bookingPlayerId, true)
                .subscribe((data) => {
                    loader.dismiss().then(() => {
                        if (data && data.status === 200) {
                            console.log('after check in for flight : ', flight);
                            console.log('after check in', data)
                            this.getMasterFlightList(null,null)
                        }
                    })
                }, (error) => {
                    loader.dismiss();
                })
        })

    }

    onSelectCourse(event) {
        this.clubService.getClubCourses(this.clubId)
            .subscribe((courses: Array < CourseInfo > ) => {
                console.log("get club courses : ", courses)
                let popover = this.popoverCtl.create(CourseBox, {
                    fromStarterList: true,
                    courses: courses
                });
                popover.onDidDismiss((data: CourseInfo) => {

                    // this.getFlightStarterList();
                    if (data) {
                        this.optionCourse = {};
                        // this.gameInfo.courses.push(data);
                        console.log("select course - data : ", data)
                        this.optionCourse = data;
                        this.getMasterFlightList(null,null);
                    }
                });
                popover.present({
                    ev: event
                });
            })

    }

    onCancelFlight(flight: TeeTimeBooking) {
        console.log("cancel flight", flight)

        let alert = this.alertCtrl.create({
            title: 'Flight Cancellation',
            // subTitle: 'Selected date is '+ _date,
            message: 'This will cancel the selected flight. Do you want to proceed?', //'Selected date is ' + '<b>' + _date + '</b>',
            inputs: [{
                name: 'reason',
                placeholder: 'Reason for cancellation (optional)'
            }, ],
            buttons: [
                {
                    text: 'No',
                    role: 'cancel'
                },
                {
                text: 'Yes',
                handler: (data) => {
                    this.goCancelFlight(flight, data);
                }
            }]
        });
        alert.present();
    }

    goCancelFlight(flight: TeeTimeBooking, reason ? : string) {
        let _bookingId;
        if (flight && flight.id) _bookingId = flight.id;
        let loader = this.loadingCtl.create({
            content: 'Checking-In flight, Please wait...',
            duration: 5000,
        });

        let _bookingPlayerId = [];
        flight.bookingPlayers.forEach((b: TeeTimeBookingPlayer, playerIdx: number) => {
            // if(idx === playerIdx && checkIn) 
            _bookingPlayerId.push(b.id)
        });

        console.log("check in ", _bookingPlayerId, flight, _bookingId)
        loader.present().then(() => {
            this.flightService.cancelBooking(_bookingId, false, reason)
                .subscribe((data) => {
                    loader.dismiss().then(() => {
                        if (data.status === 200) {
                            this.getMasterFlightList(null,null)
                        }
                        console.log("cancel booking : ", data)
                    })

                }, (error) => {
                    loader.dismiss();
                })
        })

    }

    showDetailsCaddie(player: TeeTimeBookingPlayer) {
        let _caddie: CaddyData = player.caddyAssigned ? player.caddyAssigned : player.caddyPreferred;

        let imageZoom = this.modalCtl.create(ImageZoom, {
            image: _caddie.caddyImage ? _caddie.caddyImage : ''
        })

        imageZoom.onDidDismiss((data: any) => {});
        imageZoom.present();
    }

    showDetailsPlayer(player: TeeTimeBookingPlayer) {
        let _player: PlayerData = player.player?player.player:null;
        let imageZoom = this.modalCtl.create(ImageZoom, {
            image: _player && _player.image ?_player.image: _player.profile
            // image: _player && _player.image ? (_player.image?_player.image: _player.profile):''
        })

        imageZoom.onDidDismiss((data: any) => {});
        imageZoom.present();
    }


    onStartFlight(flight: TeeTimeBooking) {
        if (flight && flight.flight.status !== 'Dispatched') return false;
        let alert = this.alertCtrl.create({
            title: 'Starting Flight',
            message: 'Starting flight at ' + moment(flight.slotAssigned.teeOffTime, "HH:mm:ss").format('hh:mm A') + '.<br>Do you want to proceed ?',
            buttons: [{
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.goStartFlight(flight);
                        console.log('Buy clicked');
                    }
                }
            ]
        });
        alert.present();
    }

    goStartFlight(flight: TeeTimeBooking) {
        let _bookingId;
        if (flight && flight.id) _bookingId = flight.id;
        let loader = this.loadingCtl.create({
            content: 'Starting flight, Please wait...',
            duration: 5000,
        });

        loader.present().then(() => {
            this.flightService.updateBookingFlightStatus(_bookingId, 'PlayStarted')
                .subscribe((data) => {
                    loader.dismiss().then(() => {
                        if (data && data.status === 200) {
                            this.getMasterFlightList(null,null);
                        }
                    })

                }, (error) => {

                })
        })

    }

    onCrossoverFlight(flight: TeeTimeBooking) {
        console.log("crossover flight", flight)
        if (flight && (flight.flight.status === 'CrossedOver' || flight.flight.status === 'PlayFinished')) return false;
        let alert = this.alertCtrl.create({
            title: 'Flight Crossover',
            message: 'Flight crossover at ' + moment().format('hh:mm A') + '.<br>Set status to Crossed Over ?',
            buttons: [{
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.goCrossoverFlight(flight);
                        console.log('Buy clicked');
                    }
                }
            ]
        });
        alert.present();
    }

    goCrossoverFlight(flight: TeeTimeBooking) {
        let _bookingId;
        if (flight && flight.id) _bookingId = flight.id;
        let loader = this.loadingCtl.create({
            content: 'Updating flight for crossover, Please wait...',
            duration: 5000,
        });

        loader.present().then(() => {
            this.flightService.updateBookingFlightStatus(_bookingId, 'CrossedOver')
                .subscribe((data) => {
                    loader.dismiss().then(() => {
                        if (data && data.status === 200) {
                            this.getMasterFlightList(null,null);
                        }
                    })

                }, (error) => {
                    loader.dismiss();
                })
        })

    }

    onFinishFlight(flight: TeeTimeBooking) {
        console.log("finish flight", flight)
        if (flight && (flight.flight.status === 'PlayFinished')) return false;
        let alert = this.alertCtrl.create({
            title: 'Flight Finishing',
            message: 'Flight finishing at ' + moment().format('hh:mm A') + '.<br>Set status to Finished ?',
            buttons: [{
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.goFinishFlight(flight);
                        console.log('Buy clicked');
                    }
                }
            ]
        });
        alert.present();
    }

    goFinishFlight(flight: TeeTimeBooking) {
        let _bookingId;
        if (flight && flight.id) _bookingId = flight.id;
        let loader = this.loadingCtl.create({
            content: 'Finishing flight, Please wait...',
            duration: 5000,
        });

        loader.present().then(() => {
            this.flightService.updateBookingFlightStatus(_bookingId, 'PlayFinished')
                .subscribe((data) => {
                    loader.dismiss().then(() => {
                        if (data && data.status === 200) {
                            this.getMasterFlightList(null,null);
                        }
                    })

                }, (error) => {
                    loader.dismiss();
                })
        })

    }

    onAbandonFlight(flight: TeeTimeBooking) {
        console.log("finish flight", flight)
        if (flight && (flight.flight.status === 'PlayFinished')) return false;
        let alert = this.alertCtrl.create({
            title: 'Abandoning Flight',
            message: 'Flight abandoning at ' + moment().format('hh:mm A') + '.<br>Set status to Finished ?',
            buttons: [{
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.goAbandonFlight(flight);
                        console.log('Buy clicked');
                    }
                }
            ]
        });
        alert.present();
    }

    goAbandonFlight(flight: TeeTimeBooking) {
        let _bookingId;
        if (flight && flight.id) _bookingId = flight.id;
        let loader = this.loadingCtl.create({
            content: 'Abandoning flight, Please wait...',
            duration: 5000,
        });

        loader.present().then(() => {
            this.flightService.updateBookingFlightStatus(_bookingId, 'Abandoned')
                .subscribe((data) => {
                    loader.dismiss().then(() => {
                        if (data && data.status === 200) {
                            this.getMasterFlightList(null,null);
                        }
                    })

                }, (error) => {
                    loader.dismiss();
                })
        })

    }

    onSetListFilter() {
        let _buttons = [];
        _buttons.push({
            text: 'Show All Flights',
            // icon: !this.platform.is('ios') ? 'close' : null,
            handler: () => {
                this.goSetListFilter('all')
              console.log('Cancel clicked');
            }
          })
        _buttons.push({
            text: 'Show Dispatched Flights',
            // icon: !this.platform.is('ios') ? 'close' : null,
            handler: () => {
                this.goSetListFilter('dispatched')
              console.log('Cancel clicked');
            }
          })
        _buttons.push({
                text: 'Show Started Flights',
                // icon: !this.platform.is('ios') ? 'close' : null,
                handler: () => {
                    this.goSetListFilter('started')
                  console.log('Cancel clicked');
                }
              });
              _buttons.push({
                text: 'Show Crossed Over Flights',
                // icon: !this.platform.is('ios') ? 'close' : null,
                handler: () => {
                    this.goSetListFilter('crossedover')
                  console.log('Cancel clicked');
                }
              })
              
              _buttons.push({
                text: 'Show Finished Flights',
                // icon: !this.platform.is('ios') ? 'close' : null,
                handler: () => {
                    this.goSetListFilter('finished')
                  console.log('Cancel clicked');
                }
              })

              _buttons.push({
                text: 'Show Abandoned Flights',
                // icon: !this.platform.is('ios') ? 'close' : null,
                handler: () => {
                    this.goSetListFilter('abandoned')
                  console.log('Cancel clicked');
                }
              })

              _buttons.push({
                    text: 'Cancel',
                    role: 'destructive',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
              })
        let actionSheet = this.actionSheetCtl.create({
            buttons: _buttons
        });

        actionSheet.present();
    }

    goSetListFilter(status: string) {
        let _msg = (status!=='all')?'Showing '+status+' flights only':'All Flights';
        this.optionFlightStatus = status;
        this.getMasterFlightList(null,null);
        // MessageDisplayUtil.showMessageToast(_msg, this.platform, this.toastCtl,3000, "bottom")
    }

    getFlightStatusText(status: string) {
        let _msg = (status!=='all')?'Showing '+status+' flights only':'All Flights';
        return _msg;
    }

    onChangeSlot(bookingId: number, newSlot: TeeTimeSlotDisplay) {
        console.log("call onchange slot", bookingId, newSlot)
        this.flightService.changeSlot(bookingId,newSlot)
        .subscribe((data)=>{
            console.log("after change slot : ", data)
            if(data && data.status === 200) {
                this.getMasterFlightList(null,null);
            } else if(data) {
                console.log("get data ", data.status, data)
            }
        },(error)=>{
            if(error.status !== 200) {
                MessageDisplayUtil.showMessageToast('This slot cannot be selected (e.g Flights checked-in, dispatched, started or finished)', this.platform, this.toastCtl,3000, "bottom")
            }
            console.log("get error", error)
        })
    }

    onMoveSlot(bookingId: number, newSlot: TeeTimeSlotDisplay) {
        console.log("call onchange slot", bookingId, newSlot)
        this.flightService.moveSlot(bookingId,newSlot)
        .subscribe((data)=>{
            console.log("after change slot : ", data)
            if(data && data.status === 200) {
                this.getMasterFlightList(null,null);
            } else if(data) {
                console.log("get data ", data.status, data)
            }
        },(error)=>{
            if(error.status !== 200) {
                MessageDisplayUtil.showMessageToast('This slot cannot be selected (e.g Flights checked-in, dispatched, started or finished)', this.platform, this.toastCtl,3000, "bottom")
            }
            console.log("get error", error)
        })
    }

    onSwapSlots(bookingId: number, newSlot: TeeTimeSlotDisplay) {
        console.log("call onchange slot", bookingId, newSlot)
        this.flightService.changeSlot(bookingId,newSlot)
        .subscribe((data)=>{
            console.log("after change slot : ", data)
            if(data && data.status === 200) {
                this.getMasterFlightList(null,null);
            } else if(data) {
                console.log("get data ", data.status, data)
            }
        },(error)=>{
            if(error.status !== 200) {
                MessageDisplayUtil.showMessageToast('This slot cannot be selected (e.g Flights checked-in, dispatched, started or finished)', this.platform, this.toastCtl,3000, "bottom")
            }
            console.log("get error", error)
        })
    }

    onNotificationsClick() { 
        this.nav.push(NotificationsPage);
    }

    getBookingStatusName(id: string) {
        switch(id) {
            case 'B':
                return 'Booked';
                case 'D':
                    return 'Secured';
                case 'C':
                    return 'Cancelled by Player';
                case 'H':
                    return 'Partially Paid';
                case 'L':
                    return 'Cancelled by Club';
                case 'P':
                    return 'Fully Paid';
                case 'R':
                    return 'Flight Registered';
        }

    }

    checkFilterBookingStatus(id: string) {
        let _isStatus = '';
        _isStatus = this.filterBookingStatus.find((status)=>{
            return status === id
        });
        return _isStatus
    }

    updateFilterBookingFlightStatus(status: FilterBookingStatus) {
        let _idx;
        if(this.filterBookingStatus && this.filterBookingStatus.length > 0)
            this.filterBookingStatus = this.filterBookingStatus.filter((s, idx)=>{
                return s != status.id
            });
        console.log("update filter : ", status, this.filterBookingStatus)
        if(status.checked) this.filterBookingStatus.push(status.id);
        this.getMasterFlightList(null,null);
        // else if(!status.checked) this.filterBookingStatus.splice(_idx,1);
    }

    displayFilterBookingStatus() {
        let _status: Array<string> = [];
        this.avlBookingStatus.forEach((status: FilterBookingStatus)=>{
            if(status.checked) _status.push(status.name)
        })
        if(_status.length === this.avlBookingStatus.length || _status.length === 0)
            return 'All Booking Status'
        else return _status.toString();
    }

    updateFilterRefundMethod(refund: FilterRefundMethod) {
        let _idx;
        if(this.filterRefundList && this.filterRefundList.length > 0)
            this.filterRefundList = this.filterRefundList.filter((r, idx)=>{
                return r != refund.APIname
            });
        console.log("update filter : ", refund, this.filterRefundList)
        if(refund.checked) this.filterRefundList.push(refund.APIname);
        this.getMasterFlightList(null,null);
        // else if(!status.checked) this.filterBookingStatus.splice(_idx,1);
    }

    goBookingDetails(slot) {
//         this.sessionStatusSubscription = this.sessionDataService.getSessionStatus()
//   .distinctUntilChanged()
//   .subscribe((status: SessionState)=>{
//       this.sessionDataService.getSession()
//           .take(1)
//           .subscribe((session: SessionInfo)=>{
//               if(status === SessionState.LoginFailed){
//                   let toast = this.toastCtl.create({
//                       message: session.exception,
//                       duration: 5000,
//                       showCloseButton: true,
//                       closeButtonText: 'OK'
//                   });
//                   toast.present().then(()=>{
//                       this.sessionActions.clearLoginError();
//                   });

//                   MessageDisplayUtil.showErrorToast(session.exception, this.platform, this.toastCtl, 5000, 'bottom');

//               }
//               else if(status === SessionState.LoggedIn) {
//                 this.currentSession = session;
//                   // this.mainPage(session);
//               }
//               console.log("[get session] session info ", session)
//           }, (error) => {
//               console.log("[get session] error ", error)
//           });
//           console.log("[get session] status : ",status)

//   });

        this.nav.push(BookingDetailsPage, {
            fromClub: true,
            teeSlotNew: false,
            bookingSlot: slot,
            currSession: this.currentSession,
        })
    }

    getBookingDetails(slot: TeeTimeBooking, attribute: string) {
        let _currency = slot.clubData.address.countryData.currencySymbol; 
        switch(attribute) {
            case 'amount':
                return _currency + " " + this.numberWithCommas(slot.amountPayable.toFixed(2));
            case 'paidAmount':
                return _currency + " " + this.numberWithCommas(slot.amountPaid.toFixed(2));
            case 'refund':
                return _currency + " " + this.numberWithCommas(slot.totalRefund.toFixed(2));
            case 'discount':
                return _currency + " " + this.numberWithCommas(slot.totalDeductions.toFixed(2));
            case 'finalAmount':
                return _currency + " " + this.numberWithCommas((slot.amountPayable - slot.totalDeductions).toFixed(2));
        }

    }

    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    getFlightList() {
        let _filteredList;
        let _searchString = this.searchQuery.toLowerCase();

        

        if(this.filterTime === 'Both') {
            _filteredList = this.upcomingList;
        } else if(this.filterTime !== 'Both') {
            _filteredList = this.upcomingList.filter((flight)=>{
                let _time = moment(flight.slotAssigned.teeOffTime,'HH:mm:ss').format('A');
                return this.filterTime === _time
            });
        }
        
        // if(this.searchQuery && this.searchQuery.length > 0) {
        //     _filteredList = this.upcomingList.filter((tb: TeeTimeBooking)=>{
        //         let player = tb.bookingPlayers.filter((p: TeeTimeBookingPlayer)=>{
        //             if(!p) return false;
        //             if(p && p.player)  {
        //                 // let _condition = p.playerName.toLowerCase().includes(_searchString) || 
        //                 // p.player.firstName.toLowerCase().includes(_searchString) || 
        //                 // p.player.lastName.toLowerCase().includes(_searchString);
        //                 // return _condition;

        //                 if(p.playerName && p.playerName.toLowerCase().includes(_searchString)) return true;
        //                 if(p.player.firstName && p.player.firstName.toLowerCase().includes(_searchString)) return true;
        //                 if(p.player.lastName && p.player.lastName.toLowerCase().includes(_searchString)) return true;
        //             }
        //             if(p && p.caddyAssigned) {
        //                 // let _caddy = p.caddyAssigned.firstName.toLowerCase().includes(_searchString) || 
        //                 // p.caddyAssigned.lastName.toLowerCase().includes(_searchString) || 
        //                 // p.caddyAssigned.nickName.toLowerCase().includes(_searchString);
        //                 // return _caddy

        //                 if(p.caddyAssigned.firstName && p.caddyAssigned.firstName.toLowerCase().includes(_searchString)) return true; 
        //                 if(p.caddyAssigned.lastName && p.caddyAssigned.lastName.toLowerCase().includes(_searchString)) return true;
        //                 if(p.caddyAssigned.nickName && p.caddyAssigned.nickName.toLowerCase().includes(_searchString)) return true;
        //             }
        //         }).length;
        //         if(player > 0) return true;
        //         if(tb.bookingReference && tb.bookingReference.toLowerCase().includes(_searchString)) return true;
        //         if(tb.bookedByPlayer && tb.bookedByPlayer.firstName && tb.bookedByPlayer.firstName.toLowerCase().includes(_searchString)) return true;
        //         // return player > 0 || tb.bookingReference.toLowerCase().includes(_searchString) || 
        //         // tb.bookedByPlayer.firstName.toLowerCase().includes(_searchString) || tb.bookedByPlayer.firstName.toLowerCase().includes(_searchString);
        //     })

        // } else _filteredList = this.upcomingList;

        

        if(_filteredList && _filteredList.length > 0) {
            _filteredList.forEach((data)=>{
                if(data.showDetails === undefined || data.showDetails === null) data.showDetails = false;
            })    
        }
        
        return _filteredList;
    }

    getFlightStats(attribute: string) {
        let _filteredList = this.getFlightList();
        this.totalDayFlights = _filteredList.length; //this.totalItems;
        this.totalDayPlayers = 0;

        this.totalDayBuggies = 0;
        this.totalDayCaddies = 0;
        
        let _countCaddy = [];
        let _countBuggy = [];

        console.log("get flight stats : ", _filteredList, this.allBookingList)
        if(_filteredList && _filteredList.length > 0)
        _filteredList.forEach((p) => {
            // this.totalDayPlayers += p.bookingPlayers.length;
            this.totalDayPlayers += p.totalPlayers;
        });

        if(_filteredList && _filteredList.length > 0) 
        _filteredList.forEach((p) => {
            _countCaddy = this.getUnique(p.bookingPlayers, 'caddyPairing')
            _countCaddy = _countCaddy.filter((_player: TeeTimeBookingPlayer) => {
                // if(_player.caddyPairing !== 0) return true
                if (_player.caddyAssigned) return true
            }).sort((a, b) => {
                if (a.caddyPairing < b.caddyPairing) return -1
                else if (a.caddyPairing > b.caddyPairing) return 1
                else return 0
            })
            this.totalDayCaddies += _countCaddy.length

            // this.totalDayPlayers += p.bookingPlayers.length;    

            _countBuggy = this.getUnique(p.bookingPlayers, 'pairingNo')
            _countBuggy = _countBuggy.filter((_player: TeeTimeBookingPlayer) => {
                if (_player.pairingNo !== 0) return true
            }).sort((a, b) => {
                if (a.pairingNo < b.pairingNo) return -1
                else if (a.pairingNo > b.pairingNo) return 1
                else return 0
            });
            this.totalDayBuggies += _countBuggy.length;
        })

        switch(attribute) {
            case 'flights':
                // return this.totalDayFlights;
                return this.totalItems;
            case 'players':
                return this.totalDayPlayers;
            case 'buggies':
                return this.totalDayBuggies;
            case 'caddies':
                return this.totalDayCaddies;
        }
        
    }

    onKeyMaxResults() {
        let _maxResult = this.searchMaxResults;
        if(_maxResult > 300) this.searchMaxResults = 300;
        else if(_maxResult < 1) this.searchMaxResults = 1;
    }

    onSearchBooking() {
        this.refresher = true;
        let _pageSize: number = this.searchMaxResults;
        let _pageNo: number;
        let _clubId = this.clubId;
        let _fromDate = this.currentDate;
        let _toDate = this.toDate;
        let _statusType;
        let _statusList = this.filterBookingStatus; //this.filterBookingStatus.toString();
        let _search = this.searchQuery;
        let _courseId = this.optionCourse?this.optionCourse.courseId:null; // this.filterCourseId;
        this.flightService.searchBookingClub(_clubId, _fromDate, _toDate, _statusType, _statusList, _courseId, _search, _pageSize, _pageNo)
        .subscribe((data: PagedData<TeeTimeBooking>)=>{
            console.log("search booking club : ", data)
            if(data) {
                let _totalItems;
                let _totalPages;
                let _totalInPage;
                let _currentPage;
                let _success;
                _totalItems = data.totalItems;
                _totalPages = data.totalPages;
                _totalInPage = data.totalInPage;
                this.upcomingList = data.items;
            }
        })
    }

    doInfinite(infinite) {

        console.log("[do infinite]")
        if (this.isMore()) {
            // this._appendBookingList(null, infinite);
            this.getMasterFlightList(null,infinite);
        } else {
            infinite.complete();
            infinite.enable(false);
        }

    }

    public isMore() {
        // return false
        console.log("[do infinite] is more : ", this.upcomingList.length + " / " + this.totalItems )
        return this.upcomingList.length > 0 && this.upcomingList.length < this.totalItems;
        // return this.playerList.totalPages > 0 && this.playerList.currentPage < this.playerList.totalPages;
    }

    private _appendBookingList(refresher, infinite) {
        let _addClub = this.searchMaxResults;
        let _currentLen = this.upcomingList.length>0?this.upcomingList.length:1;
        let _all = JSON.parse(JSON.stringify(this.allBookingList));
        console.log("[do infinite] append club list : current length - ", this.upcomingList.length);
        console.log("[do infinite] append club list : current length - ", this.allBookingList);
        this.upcomingList.push(..._all.splice(_currentLen,_addClub));
                    if (refresher) {
                        refresher.complete();
                    }
                    if (infinite) {
                        infinite.complete();
                    }
        // console.log("[do infinite] append club list : current club list - ", this.clubTeeTimeSlotList);
        // console.log("min normal price : ",this.minNormalPrice);
    }

    testKeyup(event?) {
        // console.log("key up : ", event)
        if(event.code.toLowerCase().includes('enter') || event.key === 'Enter') {
            this.onRefreshClick(event);
        }
    }

    displayFilterTime() {
        let _filterTime;
        let _timeIcon;
        switch(this.filterTime) {
            case 'AM':
                _timeIcon = '<i class="fas fa-fw fa-hourglass-start"></i>';
                _filterTime = 'Morning';
                break;
            case 'PM':
                _timeIcon = '<i class="fas fa-fw fa-hourglass-end"></i>';
                _filterTime = 'Afternoon';
                break;
            case 'Both':
                _timeIcon = '<i class="fas fa-fw fa-hourglass"></i>';
                _filterTime = 'Both';
                break;
            default:
                _timeIcon = '<i class="fas fa-fw fa-hourglass"></i>';
                _filterTime = 'Both';
                break;
        }
        return 'Show by '+_timeIcon+ _filterTime;
    }

    changeFilterTime() {
        
        let actionSheet = this.actionSheetCtl.create({
            buttons:
            [{
                text: 'Morning (AM)',
                handler: () => {
                  this.filterTime = 'AM';
                }
              },
              {
                text: 'Afternoon (PM)',
                handler: () => {
                  this.filterTime = 'PM';
                }
              },
              {
                text: 'Both (AM and PM)',
                role: 'destructive', // will always sort to be on the bottom
                handler: () => {
                  this.filterTime = 'Both';
                }
              },
            ]
        });
        actionSheet.present();
    }

    appAttribute: any;
    showRefundBy: boolean = false;
    getAppAttribute() { 
        console.log("[app attribute] : ")
        this.flightService.getAppAttributes()
        .subscribe((data: any)=>{
            console.log("[app attribute] : ", data)
            if(data) {
                data.filter((d)=>{
                    return d.page === 'clubRefundRedeemHistory'
                }).map((d)=>{
                    this.appAttribute = d
                });

                if(this.appAttribute) {
                    // if(this.appAttribute.filterRefundMethodList) this.refundMethodList = this.appAttribute.filterRefundMethodList
                    // if(this.appAttribute.filters & this.appAttribute.filters.showRefundBy) this.showRefundBy = this.appAttribute.filters.showRefundBy 
                }

            }
        })
    }

    clubCreditHistory: Array<RefundAndRedeem>;
    groupByName: string = 'none';//'player'
    getClubRefundRedeemHistory() {
        let _clubId = this.clubId;
        let _fromDate = this.currentDate;
        let _toDate = this.toDate;
        let _include = this.filterInclude;

        if(!moment(this.currentDate).isValid()) {
            MessageDisplayUtil.showMessageToast("Invalid From Date. Please check.", this.platform, this.toastCtl,3000, "bottom")
            return;
        }
        else if(!moment(this.toDate).isValid()) {
            MessageDisplayUtil.showMessageToast("Invalid To Date. Please check.", this.platform, this.toastCtl,3000, "bottom")
            return;
        }
        
        let _currentDate = moment(this.currentDate);
        let _untilDate = moment(this.toDate);
        let _diff = _untilDate.diff(_currentDate, 'months');
        // alert("Difference : " + _diff);
        if(_diff > 3) {
            if(this.appAttribute && this.appAttribute.enableLimitDate) {
                MessageDisplayUtil.showMessageToast('Please specify dates less than 3 months', this.platform, this.toastCtl,3000, "bottom");
                return;
            }
            
        } else if(_diff < 0) {
            MessageDisplayUtil.showMessageToast('Please specify valid dates', this.platform, this.toastCtl,3000, "bottom");
            return;
        }
        
        console.log("difference : ", _diff)

        this.flightService.refundRedeemForClub(_clubId, _fromDate, _toDate, _include)
        .subscribe((data)=>{
            if(data) {
                this.clubCreditHistory = data;
                if(this.groupByName === 'none') {
                    this.clubCreditHistory = this.clubCreditHistory.filter((ch)=>{
                        if(this.searchQuery && this.searchQuery.length > 0) {
                            return ch.playerName.toLowerCase().includes(this.searchQuery.toLowerCase()) || ch.playerId === Number(this.searchQuery) ||
                            ch.reference.toLowerCase().includes(this.searchQuery.toLowerCase())
                        } else return 1
                    });
                } else {
                    this.creditHistoryGroup(this.groupByName);
                }
                
            }
            console.log("refund redeem history : ", data)
        })
    }

    creditHistoryGroup(attribute?: string) {
        if(!this.clubCreditHistory) return;
        if(this.clubCreditHistory && this.clubCreditHistory.length === 0) return;
        let _history = this.clubCreditHistory.sort((a,b)=>{
            if(this.groupByName === 'transactionDate') {    
                if(a.transactionDate < b.transactionDate) return -1
                else if (a.transactionDate > b.transactionDate) return 1
                else return 0
            } else if(this.groupByName === 'reference') {    
                if(a.reference < b.reference) return -1
                else if (a.reference > b.reference) return 1
                else return 0
            } else if(this.groupByName === 'type') {    
                if(a.type < b.type) return -1
                else if (a.type > b.type) return 1
                else return 0
            } else if(this.groupByName === 'player') {    
                if(a.playerName < b.playerName) return -1
                else if (a.playerName > b.playerName) return 1
                else return 0
            }
            else return 0
        })
        if(this.searchQuery && this.searchQuery.length > 0)
            _history = _history.filter((ch: RefundAndRedeem)=>{
                return ch.playerName.toLowerCase().includes(this.searchQuery.toLowerCase()) || ch.playerId === Number(this.searchQuery) ||
                ch.reference.toLowerCase().includes(this.searchQuery.toLowerCase())
        });
        console.log("Unique : ", this.getUnique(_history, 'transactionDate'))
        if(attribute && attribute === 'player') {
            return this.getUnique(_history, 'playerId')
        } else if(attribute) {
            return this.getUnique(_history, attribute)
        } else return this.getUnique(_history, 'transactionDate')
    }

    creditHistoryFiltered(clubCredit: RefundAndRedeem, attribute?: string) {
        let _clubCreditHistory:Array<any> = this.clubCreditHistory.filter((ch)=>{
            if(this.searchQuery && this.searchQuery.length > 0) {
                return ch.playerName.toLowerCase().includes(this.searchQuery.toLowerCase()) || ch.playerId === Number(this.searchQuery) ||
                ch.reference.toLowerCase().includes(this.searchQuery.toLowerCase())
            }
            if(attribute === 'reference') return ch.reference === clubCredit.reference
            else if(attribute === 'transactionDate') return ch.transactionDate === clubCredit.transactionDate
            else if(attribute === 'type') return ch.type === clubCredit.type
            else if(attribute === 'player') return ch.playerId === clubCredit.playerId
            else return ch.transactionDate === clubCredit.transactionDate

        })
        // _clubCreditHistory.forEach((ch)=>{
        //     if(!ch.expandMode) ch.expandMode = false
        // })
        return _clubCreditHistory;
    }

    
    getDate(date: string) {
        return moment(date).format("ddd, DD MMM YYYY");
    }

    expandHistoryDetails(clubCredit) {
        console.log("expand details : ", clubCredit)
        if(clubCredit.type !== 'Refund') return;
        if(!clubCredit.hasOwnProperty('expandMode')) clubCredit.expandMode = false;
        if(typeof clubCredit.expandMode === 'undefined') clubCredit.expandMode = false;
        if(clubCredit.expandMode === undefined) clubCredit.expandMode = false;
        
        if(clubCredit.type === 'Refund')
            clubCredit.expandMode = !clubCredit.expandMode
    }

    
    getGroupByName() {
        if(this.groupByName === 'type') {
            return 'Mode'
        } else if(this.groupByName === 'none') {
            return 'None'
        } else if(this.groupByName === 'transactionDate') {
            return 'Transaction Date'
        } else if(this.groupByName === 'reference') {
            return 'Booking Reference'
        } else if(this.groupByName === 'player') {
            return 'Player'
        }
    }

    
    getCreditAmount(credit: RefundAndRedeem) {
        if(credit.type === 'Refund') return this.mg2uUtil.numberWithCommas(credit.amount.toFixed(2));
        else if(credit.type === 'Redeem') return this.mg2uUtil.numberWithCommas((-1 * credit.amount).toFixed(2));
    }

    getAmountClass(credit: RefundAndRedeem) {
        if(credit.type === 'Refund') return 'row refund-amount';
        else if (credit.type === 'Redeem') return 'row redeem-amount';
    }

    onFilterIncludeClick() {
            
        let actionSheet = this.actionSheetCtl.create({
            buttons: [{
                text: 'Redeem Only',
                // role: 'destructive', // will always sort to be on the bottom
                handler: () => {
                    this.filterInclude = 'Redeem'
                    // this.getPlayerRefundRedeemHistory()
                }
            },{ 
                text: 'Refund Only',
                // role: 'destructive', // will always sort to be on the bottom
                handler: () => {
                    this.filterInclude = 'Refund';
                    // this.getPlayerRefundRedeemHistory()
                }
            },{ 
                text: 'All',
            // role: 'destructive', // will always sort to be on the bottom
            handler: () => {
                this.filterInclude = 'Both'
                //   this.getPlayerRefundRedeemHistory()
            }
            }]
        });
        actionSheet.present();
        actionSheet.onDidDismiss(()=>{
            this.getClubRefundRedeemHistory();
        })  
    }

    onChangeGroupByClick() {
        let actionSheet = this.actionSheetCtl.create({
            buttons: [{
                text: 'Transaction Date',
                // role: 'destructive', // will always sort to be on the bottom
                handler: () => {
                    this.groupByName = 'transactionDate'
                    // this.getPlayerRefundRedeemHistory()
                }
            },{ 
                text: 'Booking Reference',
                // role: 'destructive', // will always sort to be on the bottom
                handler: () => {
                    this.groupByName = 'reference';
                    // this.getPlayerRefundRedeemHistory()
                }
            },
            // { 
            //     text: 'Mode',
            // // role: 'destructive', // will always sort to be on the bottom
            // handler: () => {
            //     this.groupByName = 'type'
            //     //   this.getPlayerRefundRedeemHistory()
            //     }
            // },
            {
                text: 'Player',
                handler: () =>{
                    this.groupByName = 'player';
                }
            },
            {
               text: 'None',
               role: 'destructive',
               handler: () =>{
                   this.groupByName = 'none';
               }
             }, ]
        });
        actionSheet.present();
        actionSheet.onDidDismiss(()=>{
            this.getClubRefundRedeemHistory();
        })  
    }
 
    expandHistoryGroups(credit: any) {
        console.log("expand group : ", credit)
        if(!credit.hasOwnProperty('expandMode')) credit.expandMode = false;
        if(typeof credit.expandMode === 'undefined') credit.expandMode = false;
        if(credit.expandMode === undefined) credit.expandMode = false;
        credit.expandMode = !credit.expandMode
    }

    onMoreActions(credit) {
        let _bookingId = credit.bookingId;
        let _buttons = [{
            text: 'View Booking Details',
            // role: 'destructive', // will always sort to be on the bottom
            handler: () => {
                // this.groupByName = 'transactionDate'
                this.fetchBookingDetails(credit,'booking');
                // actionSheet.dismiss('booking');
                // this.getPlayerRefundRedeemHistory()
            }
        },
        // { 
        //     text: 'View Refund / Adjustment',
        //     // role: 'destructive', // will always sort to be on the bottom
        //     handler: () => {
        //         // this.groupByName = 'reference';
        //         this.fetchBookingDetails(credit,'adjustment');
        //         // actionSheet.dismiss('adjustment')
        //     }
        // }
        ]
        if(credit.type === 'Refund') {
            _buttons.push({ 
                text: 'View Refund / Adjustment',
                // role: 'destructive', // will always sort to be on the bottom
                handler: () => {
                    // this.groupByName = 'reference';
                    this.fetchBookingDetails(credit,'adjustment');
                    // actionSheet.dismiss('adjustment')
                }
            },{
                text: 'Undo Refund',
            // role: 'destructive', // will always sort to be on the bottom
                handler: () => {
                    // this.groupByName = 'reference';
                    this.onUndoRefund(credit);
                    // actionSheet.dismiss('adjustment')
                }
            })
        }
        let actionSheet = this.actionSheetCtl.create({
            buttons: _buttons
        });
        actionSheet.onDidDismiss((data)=>{
            

            // this.getClubRefundRedeemHistory();
        })
        actionSheet.present();

        
    }

    fetchBookingDetails(credit: RefundAndRedeem, data?: string) {
        let _bookingId = credit.bookingId;
        if(data) {
            this.flightService.getBookingById(_bookingId)
            .subscribe((bookingByPlayer: TeeTimeBooking) => {
                let bookingSlot = bookingByPlayer;
                if(data === 'booking') {
                    this.nav.push(BookingDetailsPage, {
                        fromClub: true,
                        teeSlotNew: false,
                        bookingSlot: bookingSlot,
                        currSession: this.currentSession,
                    })
                } else if(data === 'adjustment') {
                    let _currency = {}
                    _currency['symbol'] = bookingSlot.clubData.address.countryData.currencySymbol;
                    this.nav.push(RefundBookingPlayersModal, {
                        currentSlot: bookingSlot,
                        clubId: bookingSlot.clubData.id ,
                        forDate: bookingSlot.slotAssigned.teeOffDate ,
                        courseId: bookingSlot.slotAssigned.startCourse.id,
                        changeType: 'course',
                        currency: _currency
                      })  

                }
            });
            
        }

    }
    getFilterIncludeName() {
        if(this.filterInclude.toLowerCase() === 'both') {
            return 'All'
        }
        else if(this.filterInclude.toLowerCase() === 'redeem') {
            return 'Redeem'
        }
        else if(this.filterInclude.toLowerCase() === 'refund') {
            return 'Refund'
        }
    }
 
    goUndoRefund(credit) {
        if(!credit) return;
        let _credit = credit;
        this.flightService.undoRefundBooking(_credit.bookingId, _credit.instanceId)
        .subscribe((data)=>{
            console.log("undo refund ", data)
            if(data) {
                this.getClubRefundRedeemHistory();
                MessageDisplayUtil.showMessageToast('Successfully undo refund', this.platform, this.toastCtl,3000, "bottom");
                return;
            }
        },(error)=>{
            MessageDisplayUtil.showErrorToast('Failed to undo refund', this.platform, this.toastCtl,3000, "bottom");
                return;
        })
    }

    onUndoRefund(credit) {
        if(!credit) return;
        if(credit && credit.type !== 'Refund') return;
        let _credit = credit;
        let _currency = this.clubInfo&&this.clubInfo.country?this.clubInfo.country.currencySymbol:'';
        let alert = this.alertCtrl.create({
            title: 'Undo Refund',
            // subTitle: 'Selected date is '+ _date,
            message: 'Do you want to Undo Refund for this amount '+_currency + ' ' +_credit.amount+'?', //'Selected date is ' + '<b>' + _date + '</b>',
            buttons: [ {
                text: 'No',
                role: 'cancel'
            },
            {
                text: 'Yes',
                handler: () => {
                    this.goUndoRefund(credit);
                }
            },]
        });
        alert.present();
    }

}