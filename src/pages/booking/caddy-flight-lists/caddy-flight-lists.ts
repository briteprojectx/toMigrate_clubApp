import {
    FlightSetupPage
} from './../../normalgame/flight-setup/flight-setup';
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
    Renderer
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
    CaddyAssignment
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
import { BookingDetailsPage } from '../booking-details/booking-details';
import { CaddyFlightDetailsPage } from '../caddy-flight-details/caddy-flight-details';
import { JsonService } from '../../../json-util';
import { CaddyDetailsPage } from '../../modal-screens/caddy-list/caddy-details/caddy-details';
import { NotificationsPage } from '../../notifications/notifications';

@Component({
    templateUrl: 'caddy-flight-lists.html',
    selector: 'caddy-flight-lists-page'
})
export class CaddyFlightListsPage {
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
    public teeFlightTabs: string = 'masterTab';//'bookedTab'; //'checkedInTab';
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
    nextMonth: string;
    currentDate: string;
    clubId: number;

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
    caddyFlightList: Array<CaddyAssignment>;
    todayFlightList: Array<CaddyAssignment>;
    futureFlightList: Array<CaddyAssignment>;
    pastFlightList: Array<CaddyAssignment>;
    caddieId: number;
    toggleSlots: boolean = false;

    toggleActivePanel: boolean = true;
    togglePastPanel: boolean = false;
    toggleCancelPanel: boolean = false;
    toggleFuturePanel: boolean = false;
    
    togglePastSlots: boolean = false;
    toggleCancelSlots: boolean = false;
    toggleFutureSlots: boolean = false;
    errorMessage: string;
    futureDate: string;
    pastDate: string;

    fromDetails: boolean = false;
    caddie: CaddyData;


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
        private modalCtl: ModalController) {

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
        if (!this.clubId) this.clubId = 1701051914; //28101520; //mygolf2u golf club

        this.today = moment().format("YYYY-MM-DD");
        this.nextMonth = moment().endOf('month').format("YYYY-MM-DD");
        this.currentDate = moment().format("YYYY-MM-DD");
        this.futureDate = moment().add(1,'days').format("YYYY-MM-DD");
        this.pastDate = moment().format("YYYY-MM-DD"); //moment().add(-1, 'month').format("YYYY-MM-DD");
        this.caddyFlightList = this.navParams.get("caddyAssignment");
        this.caddieId = this.navParams.get("caddieId");
        this.fromDetails = this.navParams.get("fromDetails");
        this.caddie = this.navParams.get("caddie");

        console.log("tee flight : ", this.today, this.currentDate)


    }

    ionViewDidLoad() {
        // this._onViewLoaded();
        this.getTodayFlight();
        this.getFutureFlight();
        this.getPastFlight();
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
        this.getCaddyFlightList('today');
        // this.getMasterFlightList();
        adjustViewZIndex(this.nav, this.renderer);
    }

    getTodayFlight() {
        // this.currentDate = moment().format("YYYY-MM-DD");
        this.getCaddyFlightList('today',this.currentDate,this.currentDate);
    }

    getFutureFlight() {
        // this.futureDate = moment().add( 1 ,'days').format("YYYY-MM-DD");
        this.getCaddyFlightList('future',this.futureDate,null);
    }

    getPastFlight() {
        let _fromDate = moment(this.pastDate).startOf('month').format('YYYY-MM-DD');
        let _toDate = moment(this.pastDate).endOf('month').format('YYYY-MM-DD');
        // this.currentDate = moment().add( 1 ,'month').format("YYYY-MM-DD");
        this.getCaddyFlightList('past',_fromDate,_toDate);
    }

    getCaddyFlightList(type?: string, fromDate?: string, toDate?: string) {
        this.filteredBFL = [];
        this.upcomingList = [];
        this.checkedInList = [];
        this.refresher = true;
        let _fromDate;
        let _toDate;
        if(fromDate) _fromDate = fromDate;
        if(toDate) _toDate = toDate;
        // else _toDate = this.currentDate
        this.flightService.getCaddyAssignments(this.caddieId, _fromDate, _toDate)
        .subscribe((dataResp: any)=>{
            console.log("get from master caddy flight list data", dataResp);
            this.refresher = false;
            this.errorMessage = null;
            if(dataResp.resp.status === 200 && (dataResp.caddyAssignment && dataResp.caddyAssignment.length > 0)) {

                let caddyAssignment:Array<CaddyAssignment> = dataResp.caddyAssignment;
                this.caddyFlightList = dataResp.caddyAssignment;
                this.caddyFlightList.forEach((caddyAssignment: CaddyAssignment)=>{
                    JsonService.deriveFulImageURL(caddyAssignment.timeBooking.slotAssigned.startCourse, "courseThumbnail")
                    JsonService.deriveFulImageURL(caddyAssignment.timeBooking.slotAssigned.startCourse, "courseImage")
                });
                this.caddyFlightList.sort((a: CaddyAssignment, b: CaddyAssignment)=>{
                    if(a.timeBooking.slotAssigned.teeOffDate == b.timeBooking.slotAssigned.teeOffDate)
                    {
                        return (a.timeBooking.slotAssigned.teeOffTime > b.timeBooking.slotAssigned.teeOffTime) ? -1 : (a.timeBooking.slotAssigned.teeOffTime < b.timeBooking.slotAssigned.teeOffTime) ? 1 : 0;
                    }
                    else
                    {
                        return (a.timeBooking.slotAssigned.teeOffDate > b.timeBooking.slotAssigned.teeOffDate) ? -1 : 1;
                    }
                });

                if(type === 'today') {
                    this.todayFlightList = [];
                    this.todayFlightList = this.caddyFlightList;
                } else if(type === 'future') {
                    this.futureFlightList = [];
                    this.futureFlightList = this.caddyFlightList;
                } else if(type === 'past') {
                    this.pastFlightList = [];
                    // this.pastFlightList = this.caddyFlightList;
                    this.pastFlightList = this.caddyFlightList.filter((caddyAssignment: CaddyAssignment)=>{
                        return moment(caddyAssignment.timeBooking.slotAssigned.teeOffDate).isBefore(moment(this.currentDate)); 
                    });
                }
            } else {
                if(type === 'today') {
                    this.todayFlightList = [];
                } else if(type === 'future') {
                    this.futureFlightList = [];
                } else if(type === 'past') {
                    this.pastFlightList = [];
                }
            }
            // else if(dataResp.resp.status === 200 && (dataResp.caddyAssignment && dataResp.caddyAssignment.length === 0)) this.getCaddyFlightList('2020-06-01');
        }, (error)=>{
            this.errorMessage = 'Error connecting to server. Tap here to refresh.'
            this.refresher = false;
        }, ()=>{
        });
    }

    getMasterFlightList() {

        this.filteredBFL = [];
        this.upcomingList = [];
        this.checkedInList = [];
        this.refresher = true;
        
        // this.flightService.getCaddyAssignments(this.caddieId, '2020-06-01')
        // .subscribe((dataResp: any)=>{
        this.flightService.getBookingFlightList(this.clubId, this.currentDate, false)
            .subscribe((dataResp: any) => {
                // Array<TeeTimeBooking>
                console.log("get from master flight list data", dataResp)
                // let caddyAssignment:CaddyAssignment = dataResp.caddyAssignment;
                // let data = caddyAssignment.timeBooking
                let data = dataResp.flightList;
                // if (1) return false;
                this.refresher = false;
                this.totalDayBuggies = 0;
                this.totalDayCaddies = 0;
                this.totalDayFlights = 0;
                this.totalDayPlayers = 0;
                this.totalDayDispatched = 0;
                let _totalCheckIn;
                let _totalUpcoming;
                _totalUpcoming = data.filter((booking: TeeTimeBooking) => {
                    if (booking.bookingStatus === 'Booked')
                        return true
                })
                _totalCheckIn = data.filter((booking: TeeTimeBooking) => {
                    if (booking.bookingStatus === 'Secured' || booking.bookingStatus === 'PaymentFull')
                        return true
                })





                // data.forEach((ttb:TeeTimeBooking)=>{
                //     this.totalDayPlayers += ttb.bookingPlayers.length;
                //     ttb.bookingPlayers.filter((p: TeeTimeBookingPlayer)=>{
                //         if(p.pairingNo && p.pairingNo > 0) this.totalDayBuggies += 1
                //         if(p.caddyPairing && p.caddyPairing > 0) this.totalDayCaddies += 1
                //     })
                // })
                console.log("booking flight : ", data)
                this.bookingFlightList = data;
                console.log("booking flight list : ", this.bookingFlightList)

                this.upcomingList = this.bookingFlightList.filter((tb: TeeTimeBooking) => {
                    tb.bookingPlayers.sort((a, b) => {
                        if (a.caddyPairing < b.caddyPairing) return -1
                        else if (a.caddyPairing > b.caddyPairing) return 1
                        else return 0
                    })
                    return ((tb.bookingStatus === 'Booked') || (tb.bookingStatus === 'PaymentFull') || (tb.bookingStatus === 'PaymentPartial')) && !tb.flight
                })
                .sort((a,b)=>{
                    if(a.slotAssigned.slotNo < b.slotAssigned.slotNo) return -1
                    else if(a.slotAssigned.slotNo > b.slotAssigned.slotNo) return 1
                    else 0
                })

                this.checkedInList = this.bookingFlightList.filter((bf: TeeTimeBooking) => {
                        bf.bookingPlayers.sort((a, b) => {
                            if (a.caddyPairing < b.caddyPairing) return -1
                            else if (a.caddyPairing > b.caddyPairing) return 1
                            else return 0
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
                        if (a.caddyPairing < b.caddyPairing) return -1
                        else if (a.caddyPairing > b.caddyPairing) return 1
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
                        if (a.caddyPairing < b.caddyPairing) return -1
                        else if (a.caddyPairing > b.caddyPairing) return 1
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

                this.checkedInList.forEach((p) => {
                    this.totalDayPlayers += p.bookingPlayers.length;
                })
                this.upcomingList.forEach((p) => {
                    this.totalDayPlayers += p.bookingPlayers.length;
                })
                this.dispatchedList.forEach((p) => {
                    this.totalDayPlayers += p.bookingPlayers.length;
                })

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

                console.log("filtered status -", this.optionFlightStatus);
                console.log("dispatched list ", this.dispatchedList)



                this.totalCheckIn = this.checkedInList.length; // _totalCheckIn.length;
                this.totalUpcoming = this.upcomingList.length; // _totalUpcoming.length;
                this.totalDayFlights = this.checkedInList.length + this.upcomingList.length + this.dispatchedList.length;
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
        // this.getMasterFlightList();
        this.getCaddyFlightList();
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
        // this.getMasterFlightList();
        this.getCaddyFlightList();

    }

    toggle(searchBar) {
        this.visible = searchBar; //!this.visible;
    }

    onSearchCancel() {
        this.toggle(false);
    }

    onSearchInput(searchbar) {
        this.filteredFlight = this.flights.filter((fp: FlightInfo, idx: number) => {
            let count = fp.flightMembers.filter((fm: FlightMember) => {
                return fm.playerName.toLowerCase().indexOf(this.searchQuery.toLowerCase()) >= 0;
            }).length;
            return count > 0;
        });
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
                    this.getMasterFlightList();
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
            buttons: [{
                text: 'Yes',
                handler: () => {
                    this.goDespatchFlight(flight);
                }
            }, {
                text: 'No',
                role: 'cancel'
            }]
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
                                message: 'Full payment for this flight have not been made.',
                                buttons: ['Close']
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
        // if (this.currentPage < this.starterList.length) this.currentPage = this.currentPage + 1;
        // console.log("next page : ", moment(this.pastDate), " - ", moment(this.nextMonth))
        // console.log("next page", moment(this.pastDate).isSameOrAfter(moment(this.nextMonth)))
        if (moment(this.pastDate).endOf('month').isSameOrAfter(moment(this.nextMonth).endOf('month'))) return false;
        else return true;
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

    nextDate(type?: string) {
        if(type === 'past') this.pastDate = moment(this.pastDate).add(1, 'month').format("YYYY-MM-DD");
        else this.currentDate = moment(this.currentDate).add(1, 'days').format("YYYY-MM-DD");
        // this.getMasterFlightList();
    }

    prevDate(type?: string) {
        if(type === 'past') this.pastDate = moment(this.pastDate).subtract(1, 'month').format("YYYY-MM-DD");
        else this.currentDate = moment(this.currentDate).subtract(1, 'days').format("YYYY-MM-DD");
        // this.getMasterFlightList();
    }

    confirmDate(type?: string) {
        // this.getMasterFlightList();
        // this.getCaddyFlightList(type);
        if(type === 'today') {
            this.getTodayFlight();
        } else if(type === 'future') {
            this.getFutureFlight();
        } else if(type === 'past') {
            this.getPastFlight();
        }
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

    // getPlayerImage(teeFlight: TeeTimeBooking, slot: number) {
    //     let _slot = slot - 1;
    //     let bookingPlayer: TeeTimeBookingPlayer;
    //     bookingPlayer = teeFlight.bookingPlayers[_slot];
    //     switch(attribute) {
    //         case 'name':
    //             return bookingPlayer.playerName
    //     }
    // }
    getCount(x: TeeTimeBooking, type ? : string) {
        let _countBuggy;
        let _countCaddy;

        if (type === 'caddy') {
            // _countCaddy = this.getUnique(x.bookingPlayers, 'caddyPairing')
            // _countCaddy = _countCaddy
            //     .filter((_p: TeeTimeBookingPlayer) => {
            //         if (_p.caddyAssigned || _p.caddyPreferred) return true
            //     }).sort((a, b) => {
            //         if (a.caddyPairing < b.caddyPairing) return -1
            //         else if (a.caddyPairing > b.caddyPairing) return 1
            //         else return 0
            //     })

            return x.caddyRequested
            // return _countCaddy.length;
        } else if (type === 'buggy') {
            // _countBuggy = this.getUnique(x, 'pairingNo')
            // _countBuggy = _countBuggy
            //     .filter((_p: TeeTimeBookingPlayer) => {
            //         if (_p.pairingNo !== 0) return true
            //     })
            //     .sort((a, b) => {
            //         if (a.pairingNo < b.pairingNo) return -1
            //         else if (a.pairingNo > b.pairingNo) return 1
            //         else return 0
            //     })
            //     return _countBuggy.length;
            return x.buggyRequested
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
                return _nameSplit[0];
            case 'image':
                return p.player && p.player.profile ? p.player.profile?p.player.profile:(p.player.image?p.player.image:'') :'';
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
        let _flightStatus;

        if (flight && flight.flight) _flightStatus = flight.flight.status;
        else if (flight && !flight.flight) _flightStatus = flight.bookingStatus;
        else _flightStatus = flight.bookingStatus;


        //         export type TeeTimeBookingStatus = "Booked" | "Secured" | "CancelledByPlayer" | "CancelledByClub" | "PaymentPartial" | "PaymentFull" | "FlightRegistered" | "RefundInitiated" | "RefundCompleted";

        // export type TeeTimeFlightStatus = "Created" | "Assigned" | "Dispatched" | "PlayStarted" | "CrossedOver" | "Abandoned" | "PlayFinished";



        if (_flightStatus === 'PlayStarted') _flightStatus = 'Started';
        else if (_flightStatus === 'Dispatched') _flightStatus = 'Dispatched';
        else if (_flightStatus === 'CrossedOver') _flightStatus = 'Crossed Over';
        else if (_flightStatus === 'PlayFinished') _flightStatus = 'Finished';
        else if (_flightStatus === 'PaymentFull') _flightStatus = 'Paid in Full';
        else if (_flightStatus === 'PaymentPartial') _flightStatus = 'Partial Paid';
        else if (_flightStatus === 'CancelledByPlayer') _flightStatus = 'Player Cancelled';
        else if (_flightStatus === 'CancelledByClub') _flightStatus = 'Club Cancelled';
        else if (_flightStatus === 'Assigned') _flightStatus = 'Checked-In'

        return _flightStatus;

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
                            this.getMasterFlightList()
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
                            this.getMasterFlightList()
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
                        this.getMasterFlightList();
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
            buttons: [{
                text: 'Yes',
                handler: (data) => {
                    this.goCancelFlight(flight, data);
                }
            }, {
                text: 'No',
                role: 'cancel'
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
                            this.getMasterFlightList()
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
            image: _player && _player.image ? (_player.image?_player.image: _player.profile):''
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
                            this.getMasterFlightList();
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
                            this.getMasterFlightList();
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
                            this.getMasterFlightList();
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
                        this.goFinishFlight(flight);
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
                            this.getMasterFlightList();
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
        // this.getMasterFlightList();
        this.getCaddyFlightList();
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
                this.getMasterFlightList();
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
                this.getMasterFlightList();
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
                // this.getMasterFlightList();
                this.getCaddyFlightList();
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

    togglePanel(panel: number) {
        this.toggleActivePanel = false;
        this.togglePastPanel = false;
        this.toggleCancelPanel = false;
        this.toggleFuturePanel = false;
        if(panel === 1) {
            this.toggleActivePanel = true;
            this.getTodayFlight();
        } 
        else if(panel === 2) {
            this.toggleFuturePanel = true;
            this.getFutureFlight();
        } 
        else if(panel === 3) this.togglePastPanel = true;
        // else if(panel === 3) this.toggleCancelPanel = true;
        // this.refreshBookingHome();
    }

    onActiveBookingClick(x: TeeTimeBooking) {
        console.log("on active")
        // this.nav.push(BookingDetailsPage, {
        //     clubInfo: this.clubInfo,
        //     teeTimeSlotDisplay: x,
        //     teeSlotNew: true,
        //     clubs: this.clubs
        // })
        this.nav.push(CaddyFlightDetailsPage, {
            teeSlotNew: false,
            teeTimeSlotDisplay: x.slotAssigned,
            bookingSlot: x,
            clubInfo: x.clubData
        });
    }

    moreSlots(type?: string) {
        if(type==='active' || !type) {
            this.toggleSlots = !this.toggleSlots;
            this.togglePastSlots = false;
            this.toggleCancelSlots = false;
            this.toggleFutureSlots = false;
        } else if(type === 'past') {
            this.toggleSlots = false;
            this.toggleCancelSlots = false;
            this.togglePastSlots = !this.togglePastSlots;
            this.toggleFutureSlots = false;
        } else if(type === 'cancel') {
            this.toggleSlots = false;
            this.togglePastSlots = false;
            this.toggleCancelSlots = !this.toggleCancelSlots;
            this.toggleFutureSlots = false;
        } else if(type === 'future') {
            this.toggleSlots = false;
            this.togglePastSlots = false;
            this.toggleCancelSlots = false;
            this.toggleFutureSlots = !this.toggleFutureSlots;
        } 
        // console.log(this.toggleSlots)
    }

    getBookingDetails(x: TeeTimeBooking, attribute?: string) {
        let _bookingDetails = x;
        let _slot = _bookingDetails.slotAssigned;
        switch(attribute) {
            case 'date':
                return moment(_slot.teeOffDate).format("ddd, DD MMM YYYY");
                case 'time':
                    return moment(_slot.teeOffTime,"HH:mm:ss").format("hh:mm A");
                    case 'bookingBy':
                        if(_bookingDetails.bookedByPlayer) return _bookingDetails.bookedByPlayer.firstName
                        else return '[Club]'
                        //  + _bookingDetails.bookedByUser.name
                        case 'reference':
                            return "#" + _bookingDetails.bookingReference
                            case 'clubName':
                                return _bookingDetails.clubData.name
                                case 'clubImage':
                                    return _bookingDetails.clubData.clubImage;
                                    case 'courseImage':
                                        // console.log("courseimage ", _slot)
                                        if(_slot && _slot.startCourse) 
                                            return _bookingDetails.slotAssigned.startCourse.courseThumbnail?_bookingDetails.slotAssigned.startCourse.courseThumbnail:_bookingDetails.slotAssigned.startCourse.courseImage;
                                            else return '';
                                    case 'courseName':
                                        if(_slot && _slot.startCourse)
                                            return _bookingDetails.slotAssigned.startCourse.name;
                                        else return '';
                                        case 'playerCount':
                                            return _bookingDetails.bookingPlayers?_bookingDetails.bookingPlayers.length:'';
                                            // '('+_bookingDetails.bookingPlayers.length+')'
                                            case 'currency':
                                                return _bookingDetails.slotAssigned.currency.symbol;
                                            case 'amountPayable':
                                                let _amount = String(_bookingDetails.amountPayable)
                                                let _amtTxt;
                                                if(_bookingDetails.amountPayable <= 999999 && 
                                                    (String(_bookingDetails.amountPayable).split(".")[1] && String(_bookingDetails.amountPayable).split(".")[1].length < 2))
                                                    _amtTxt = this.numberWithCommas(_bookingDetails.amountPayable) + "0";
                                                    else if(_bookingDetails.amountPayable > 999999) _amtTxt =  this.numberWithCommas(_amount.split(".")[0]);
                                                    else _amtTxt = this.numberWithCommas(_bookingDetails.amountPayable)
                                                // if(_bookingDetails.amountPayable > 999999)
                                                //     _amtTxt =  this.numberWithCommas(_amount.split(".")[0]);
                                                // _amtTxt = this.numberWithCommas(_bookingDetails.amountPayable);
                                                return _amtTxt
        }
    }
    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    onNotificationsClick() { 
        this.nav.push(NotificationsPage);
    }

}