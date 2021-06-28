"use strict";

import { CustomSha1 } from './../../../custom/sha1';
import {
    PaymentDetails
} from './../../../data/payment-bill';
import {
    MessageDisplayUtil
} from './../../../message-display-utils';
import {
    PlayerService
} from './../../../providers/player-service/player-service';
import {
    PlayerDetails
} from './../../../data/competition-teams';
import {
    ActionSheetController,
    Events,
    LoadingController,
    ModalController,
    NavController,
    NavParams,
    Platform,
    AlertController,
    IonicApp,
    Nav
} from 'ionic-angular';
import {
    Keyboard
} from '@ionic-native/keyboard';
import {
    Component,
    Renderer,
    ChangeDetectorRef,
    ElementRef,
    ViewChild,
    AfterViewChecked
} from '@angular/core';
import {
    adjustViewZIndex
} from '../../../globals';
import {
    createPlayerList,
    FriendRequest,
    FriendRequestList,
    PlayerHomeInfo,
    PlayerInfo,
    PlayerList,
    PlayerGroup
} from '../../../data/player-data';
import {
    AbstractNotificationHandlerPage,
    NotificationHandlerInfo
} from '../../../providers/pushnotification-service/notification-handler-constructs';
import {
    FriendService
} from '../../../providers/friend-service/friend-service';
import {
    ProfilePage
} from '../../profile/profile';
import {
    SearchPlayerListPage
} from '../../search-player-list/search-player-list';
import {
    NewContactPage
} from '../../new-contact/new-contact';
import {
    Observable
} from 'rxjs/Observable';
import {
    PopoverController
} from 'ionic-angular';
import {
    CourseBox
} from '../../modal-screens/course-box/course-box';
import {
    CourseInfo,
    ClubInfo
} from '../../../data/club-course';
// import {
//     NormalGameFriendListPage
// } from '../../normalgame/friend-list/friend-list';
import {
    JsonService
} from '../../../json-util';
import {
    FriendListPage
} from '../../friend-list/friend-list';
import {
    TeeTimeSlotDisplay,
    TeeTimeSlotBookingRequest,
    ClubTeeTimeSlots,
    CurrencyData,
    DisplayPrices,
    TeeTimeSlot,
    TeeTimeBooking,
    TeeTimeBookingPlayer,
    TeeTimeBookingOptions,
    PlayerData,
    ClubData,
    CaddySelectionCriteria,
    CaddyGrade,
    CaddyData,
    BuggyCaddiePreference,
    PlayerBuggyCaddiePreference,
    ItemizedBill,
    BuggyAssignment,
    ItemRating,
    BookingPlayerCharges,
    PaymentGatewayInfo,
    BookingOfflinePayment,
    OfflinePayment,
    TeeTimeBookingDiscount,
    TeeTimeClubVoucher,
    TeeTimePricingPlan,
    BookingDiscountBillItem,
    TeeTimeClubVoucherSeries,
    TeeTimeDiscount,
    DiscountPlayerClub,
    PlayerDiscountProgram,
    PlayerTypes,
    PaymentMethods,
    BookingPayment,
    BookingCount
} from '../../../data/mygolf.data';
import {
    TeeBox
} from '../../../data/tee-box';
import {
    NewGameInfo
} from '../../../data/game-round';
import {
    HandicapService
} from '../../../providers/handicap-service/handicap-service';
import {
    isPresent
} from 'ionic-angular/util/util';
import {
    ClubFlightService
} from '../../../providers/club-flight-service/club-flight-service';
import * as moment from 'moment';
// import * as countdown from 'countdown';
import {
    BookingHomePage
} from '../booking-home/booking-home';
import {
    AddPlayerListPage
} from '../../modal-screens/add-player-list/add-player-list';
import {
    PlayerHomeDataService, PlayerHomeActions
} from '../../../redux/player-home';
import {
    PlayerGroupsPage
} from '../../player-groups/player-groups';
import {
    BuggySeatingPage
} from '../../modal-screens/buggy-seating/buggy-seating';
import {
    CaddyListPage
} from '../../modal-screens/caddy-list/caddy-list';
import {
    PlayerListPage
} from '../../modal-screens/player-list/player-list';
import {
    PlayerAddressPage
} from '../../modal-screens/player-address/player-address';
import {
    ToastController
} from 'ionic-angular';
import {
    THIS_EXPR
} from '@angular/compiler/src/output/output_ast';
import {
    cpuUsage
} from 'process';
import {
    PremiumFeaturePrice
} from '../../../data/premium-subscription';
import {
    PlayerPaid
} from '../../../data/payment-bill';
import {
    PaymentService
} from '../../../providers/payment-service/payment-service';
import {
    InAppBrowser,
    InAppBrowserOptions,
    InAppBrowserEvent
} from '@ionic-native/in-app-browser';
import {
    processRecords
} from 'ionic-angular/components/virtual-scroll/virtual-util';
import {
    PricesDisplayPage
} from '../../modal-screens/prices-display/prices-display';
import {
    BrowserPlatformLocation
} from '@angular/platform-browser/src/browser/location/browser_platform_location';
import {
    sha256
} from 'js-sha256';
// import { sha1 } from 'js-sha1';
import {
    ExternalPaymentPage
} from '../../modal-screens/external-payment/external-payment';
// import { AppRate } from '@ionic-native/app-rate';
import {
    ImageZoom
} from '../../modal-screens/image-zoom/image-zoom';
import * as global from '../../../globals'
import { SessionInfo } from '../../../data/authentication-info';
import { FaqPage } from '../../faq/faq';
import { BookingCalendarPage } from '../booking-calendar/booking-calendar';
import { TeeSlotListModal } from '../../modal-screens/tee-slot-list/tee-slot-list';
import { VoucherListModal } from '../../modal-screens/voucher-list/voucher-list';
import { PlayerVoucherModal } from '../../modal-screens/player-voucher/player-voucher';
import { ManageVoucherModal } from '../../modal-screens/manage-voucher/manage-voucher';
import { RefundBookingPlayersModal } from '../../modal-screens/refund-booking-players/refund-booking-players';
import { RedeemPlayerClubCreditsModal } from '../../modal-screens/redeem-player-club-credits/redeem-player-club-credits';
import { ServerInfoService } from '../../../providers/serverinfo-service/serverinfo-service';
import { ServerInfo } from '../../../data/server-info';
import { CaddyDetailsPage } from '../../modal-screens/caddy-list/caddy-details/caddy-details';
import { NotificationsPage } from '../../notifications/notifications';
import { EditProfilePage } from '../../edit-profile/edit-profile';



export interface BookingBuggy {
    buggySlot: number;
    driving: boolean;
    bookingPlayer ? : TeeTimeBookingPlayer;
    pairingNo: number;
    walking: boolean;
    totalPlayers: number;
    maxAllowed: number;
}
export interface BookingCaddy {
    caddySelectionCriteria ? : CaddySelectionCriteria;
    caddyPreferred ? : CaddyData;
    caddyAssigned ? : CaddyData;
    caddiePreferred?: number;
    caddieAssigned?: number;
    caddyRequired ? : boolean;
    caddyRequested ? : boolean;
    caddyPairing ? : number;
}

export interface CaddyPairing {
    caddySelectionCriteria ? : CaddySelectionCriteria;
    caddyPreferred ? : CaddyData;
    caddyAssigned ? : CaddyData;
    caddiePreferred?: number;
    caddieAssigned?: number;
    caddyRequired ? : boolean;
    caddyRequested ? : boolean;
    caddyPairing ? : number;
}

export interface RatingItem {
    itemId ? : string;
    name ? : string;
    rating ? : number;
}

export interface Ipay88Details {
    merchantCode?: string;
    merchantKey?: string;
}



@Component({
    templateUrl: 'booking-details.html',
    selector: 'booking-details-page'
})
export class BookingDetailsPage implements AfterViewChecked {
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    public friends: string = "friend";
    public friendType: string = "friend";
    public friendScreenName: string = "Friends";

    public bookings: string = "search";
    public holesPlayed: string = "2"; // 1- 9holes, 2- 18 holes


    public requestByPlayer: boolean;
    public searchPlayer: string = '';
    public searchFriend: string = '';
    public refreshAttempted: boolean = false;
    public refreshPlayer: boolean = false;

    public sentExist: boolean = false;
    public receiveExist: boolean = false;

    public playerList: PlayerList;
    public requestFriends: FriendRequestList;
    public listFriends: PlayerList;
    public receivedList: Array < FriendRequest > = new Array < FriendRequest > ();
    public sentList: Array < FriendRequest > = new Array < FriendRequest > ();
    public friendRequests: Array < FriendRequest > = new Array < FriendRequest > ();
    public playerRequests: Array < FriendRequest > = new Array < FriendRequest > ();

    public refreshOnEnter: boolean = false;

    tabs: any;

    public grpTeeSlotInfo: boolean = true;
    public grpPlayerDetails: boolean = false;
    public grpAdditionals: boolean = false;
    public grpPayment: boolean = false;
    public grpCheckIn: boolean = false;
    public grpFeedback: boolean = false;
    public grpFood: boolean = false;

    teeSlotNew: boolean = true;

    teeTimeSlotDisplay: TeeTimeSlotDisplay;
    teeTimeSlot: TeeTimeSlot;

    public currentPlayer: PlayerInfo;
    public otherPlayers: Array < PlayerInfo > ;
    public gameInfo: NewGameInfo;
    clubInfo: any;//ClubInfo;
    clubs: ClubTeeTimeSlots;
    currency: CurrencyData;
    prices: DisplayPrices;
    promoPrices: DisplayPrices;

    displayPrices: boolean = false;
    isPromo: boolean = false;

    bookingSlot: TeeTimeBooking;
    nineHoles: boolean = true;

    bookingPlayers: Array < TeeTimeBookingPlayer > = new Array < TeeTimeBookingPlayer > ();

    playersList: Array < PlayerInfo > = new Array < PlayerInfo > ();


    public playerHomeInfo$: Observable < PlayerHomeInfo > ;
    public player$: Observable < PlayerInfo > ;

    currentPlayerId: number;

    groupSelected: boolean = false;

    playerSlot: Array < TeeTimeBookingPlayer > = new Array < TeeTimeBooking > ();

    slots: Array < number > = []; // = [1,2,3,4];//['Slot 1', 'Slot 2', 'Slot 3', 'Slot 4']

    buggyReq: number = 0;
    caddyReq: number = 0;
    playerReq: number = 0;

    bookForOther: boolean = false;
    buggySlots: Array < BookingBuggy > = new Array < BookingBuggy > ();
    caddySlots: Array < BookingCaddy > = new Array < BookingCaddy > ();
    playerIsDriving: boolean = false;

    selectPaymentMethod: string = 'online'; // online, credit-card, charge-account
    paymentAmountType: string = 'full'; //full,deposit

    searchByMembership: Array < string > = new Array < string > ();
    searchById: Array < number > = new Array < number > ();
    
    clubSearchByMembership: string;
    clubSearchById: number;

    closeAdditionalNotice: boolean = false;

    expandPlayers: Array < boolean > = [false, false, false, false, false, false];
    buggySeatings: Array < BookingBuggy > ;
    buggy
    caddyPairing: Array < CaddyPairing > = new Array < CaddyPairing > ();
    depositAmount: number = 0;
    // playerDriving: Array<boolean> = [false,false,false,false];
    playerDriving: Array < string > = ['other', 'other', 'other', 'other'];

    bookingType: string = '';
    serverInfo: ServerInfo;
    botsOut: boolean = true;
    caddyRemoveFlag: boolean = false;

    options: InAppBrowserOptions = {
        location: 'yes', //Or 'no' 
        hidden: 'no', //Or  'yes'
        clearcache: 'yes',
        clearsessioncache: 'yes',
        zoom: 'yes', //Android only ,shows browser zoom controls 
        hardwareback: 'yes',
        mediaPlaybackRequiresUserAction: 'no',
        shouldPauseOnSuspend: 'no', //Android only 
        closebuttoncaption: 'Close', //iOS only
        disallowoverscroll: 'no', //iOS only 
        toolbar: 'yes', //iOS only 
        enableViewportScale: 'no', //iOS only 
        allowInlineMediaPlayback: 'no', //iOS only 
        presentationstyle: 'pagesheet', //iOS only 
        fullscreen: 'yes', //Windows only    
    };

    paymentStatus: string = 'Pending';

    countdownTimer: string;

    checkInPlayers: Array < any > = [false, false, false, false, false, false];
    checkInAllPlayers: boolean = false;

    etaCounter: number = 30;
    arrivalOption: string = 'eta';

    navbar: any;
    sticky: any;

    bookingOptions: TeeTimeBookingOptions;

    uniqBuggy: any;
    uniqCaddy: Array<TeeTimeBookingPlayer>;

    buggyCaddyPreference: BuggyCaddiePreference = {};
    newBuggyCaddyPreference: BuggyCaddiePreference = {};
    buggyRequired: boolean = false;
    caddyRequired: boolean = false;
    buggyRequested: number = 0;
    caddyRequested: number = 0;

    bookingItemBill: ItemizedBill;

    refresherBill: boolean = false;
    displayPayHistory: boolean = false;
    displayRefundHistory: boolean = false;

    // buggyPairing: Array<any> = {}

    @ViewChild('myInput') myInput: ElementRef;
    myStuff: string = "";
    paymentClickedBoolean: boolean = false;
    asgmtDiff: boolean = false;
    caddyDiff: Array < TeeTimeBookingPlayer > ;
    buggyDiff: Array < TeeTimeBookingPlayer > ;
    buggiesAssigned: Array < BuggyAssignment > ;

    paymentMode: boolean = false;

    clubRating: number = 0;
    bookingRating: number = 0;
    caddyRating: Array < number > = new Array < number > ();
    caddyRatingComment: Array<string> = new Array<string> ();
    caddyRatingCommentOn: Array<boolean> = new Array<boolean> ();
    clubRatingItems: Array < RatingItem > = new Array < RatingItem > ();

    doneRating: boolean = false;
    paymentBackendURL: string;
    paymentRedirectURL: string;
    paymentCallbackURL: string;
    paymentInternalURL: string;
    paymentSignAlgo: string;
    paymentPageURL: string;
    goToPaymentURL: string;
    merchantCode = 'M27515'; //ipay88
    localBill: number;
    playerChargeAmount: number;
    afterBook: boolean = false;
    private ipay88Details: Ipay88Details;
    paymentGatewayList: Array<PaymentGatewayInfo>;
    fromClub: boolean = false;
    currSession: SessionInfo;
    clubBookingPlayers: PlayerData;
    pgDescription: string;
    paymentConfirmClickedBoolean: boolean = false;
    clubPayment: string = 'false';

    captchaResponse: string = '';

    bookingDiscounts: Array<TeeTimeBookingDiscount>;

    viewVoucherApplied: boolean = false;

    removedPlayers: Array<TeeTimeBookingPlayer>;

    playerVoucher: Array<TeeTimeClubVoucher>;
    voucherSeries: Array<TeeTimeClubVoucherSeries>;
    clubDiscounts: Array<TeeTimeDiscount>;
    playersBalance: number = 0;

    assignmentDone: boolean = false;

    updatingPlayer: boolean = false;

    togglePlanDetails: boolean = false;
    togglePlanPromoDetails: boolean = false;

    playerMaxBooking: BookingCount;

    dummyPhoneNumber: number;

    bookingCancelGuard: boolean = false;

    nineHolesAllowed: boolean = false;
    eighteenHolesAllowed: boolean = false;

    allowClubContactInfo: boolean = true;

    paymentFailed: boolean = false;
    paymentDateTime: any = null;

    
    appFooterHide: boolean = true;

    constructor(private nav: NavController,
        private platform: Platform,
        private keyboard: Keyboard,
        private friendService: FriendService,
        private events: Events,
        private navParams: NavParams,
        private loadingCtrl: LoadingController,
        private actionSheetCtrl: ActionSheetController,
        private modalCtl: ModalController,
        private renderer: Renderer,
        private popoverCtl: PopoverController,
        private handicapService: HandicapService,
        private loadingCtl: LoadingController,
        private flightService: ClubFlightService,
        private alertCtrl: AlertController,
        private playerHomeService: PlayerHomeDataService,
        private playerService: PlayerService,
        private toastCtl: ToastController,
        private cdr: ChangeDetectorRef,
        private paymentService: PaymentService,
        private iab: InAppBrowser,
        private sha1: CustomSha1,
        private serverInfoService: ServerInfoService,
        private playerHomeActions: PlayerHomeActions,
        private app: Nav) {
        this.tabs = [{
                title: "Schedule",
                icon: "calendar"
            },
            {
                title: "Speakers",
                icon: "contacts"
            },
            {
                title: "Map",
                icon: "map"
            },
            {
                title: "About",
                icon: "information-circle"
            },
        ];

        this.requestFriends = {
            totalPages: 0,
            currentPage: 0,
            totalItems: 0,
            totalInPage: 0,
            success: true,
            friendRequests: new Array < FriendRequest > ()
        };
        this.listFriends = {
            totalPages: 0,
            currentPage: 0,
            totalItems: 0,
            totalInPage: 0,
            success: true,
            players: new Array < PlayerInfo > ()
        };
        events.subscribe("FriendListUpdate", () => {
            this._refreshValues(null, null);
        });
        events.subscribe("FriendRequestUpdate", () => {
            this.friends = "request";
            this._refreshValues(null, null);
        });
        this.playerList = createPlayerList();

        this.teeSlotNew = this.navParams.get("teeSlotNew");
        this.bookingType = this.navParams.get("type");
      //  console.log("booking type ", this.bookingType)
        if(!this.bookingType) this.bookingType ='active'
        this.fromClub = this.navParams.get("fromClub");
        this.currSession = this.navParams.get("currSession");
      //  console.log("current session : ", this.currSession)
        if(this.fromClub) this.clubPayment = 'true';
      //  console.log("from club", this.fromClub)
        this.clubRatingItems[0] = {
            itemId: '',
            name: '',
            rating: 0
        };
        this.buggyCaddyPreference.playerPairings = [{
            bookingPlayerId: 0,
            buggyRequired: true,
            buggyPairing: 0,
            driving: false,
            caddieAssigned: null,
            caddiePreferred: null,
            caddyPairing: 0,
            caddyRequired: true,
            caddyPreferred: {},
            caddyAssigned: {},
        }];
        // this.newBuggyCaddyPreference = this.buggyCaddyPreference;

        //         if(global.MygolfServerHost) {
        //             let _redirectDomain;
        //             switch(global.MygolfServerHost) {
        //                 case 'azulet.mygolf2u.com':
        //                     _redirectDomain = 'dev-play';
        //                     break;
        //                 case 'devlet.mygolf2u.com':
        //                     _redirectDomain = 'azu-play';
        //                     break;
        // }
        //             // if(global.MygolfServerHost === 'devlet.mygolf2u.com') _redirectDomain = 'dev-play';
        //             // else if(global.MygolfServerHost === 'azulet.mygolf2u.com') _redirectDomain = 'azu-play';
        //             // else if(global.MygolfServerHost === 'golflet.mygolf2u.com') _redirectDomain = 'm'

        //             this.paymentBackendURL = 'http://' + global.MygolfServerHost + '/rest/payment/ipay88/backend' //'http://devlet.mygolf2u.com/rest/payment/ipay88/backend';
        //             this.paymentRedirectURL = 'http://azu-play.mygolf2u.com/payment_redirect.html'; //'http://mtest.mygolf2u.com/test/payment_redirect.html';
        //         }
        let _mygolfServerHost = global.MygolfServerHost;
        if (_mygolfServerHost)
            this.paymentBackendURL = 'http://' + _mygolfServerHost + '/rest/payment/ipay88/backend' //'http://devlet.mygolf2u.com/rest/payment/ipay88/backend';
        else this.paymentBackendURL = 'http://devlet.mygolf2u.com/rest/payment/ipay88/backend';
        if (_mygolfServerHost==='devlet.mygolf2u.com') 
            this.paymentRedirectURL = 'http://dev-play.mygolf2u.com/payment_redirect.html'; //'http://mtest.mygolf2u.com/test/payment_redirect.html';
            else if (_mygolfServerHost==='azulet.mygolf2u.com')
            this.paymentRedirectURL = 'http://azu-play.mygolf2u.com/payment_redirect.html'; //'http://mtest.mygolf2u.com/test/payment_redirect.html';
        
            // this.goToPaymentURL = 'dev-play'
            if (_mygolfServerHost==='devlet.mygolf2u.com') 
            this.goToPaymentURL = 'dev-play'; //'http://mtest.mygolf2u.com/test/payment_redirect.html';
            else if (_mygolfServerHost==='azulet.mygolf2u.com')
            this.goToPaymentURL = 'azu-play'; //'http://mtest.mygolf2u.com/test/payment_redirect.html';


        // if(this.teeSlotNew && this.fromClub) this.slots.push(99)
        if (this.teeSlotNew) {
            if(this.fromClub) {

            } else {
                this.playerHomeInfo$ = this.playerHomeService.playerHomeInfo();
                this.player$ = this.playerHomeInfo$
                    .filter(Boolean)
                    .map((playerHome: PlayerHomeInfo) => playerHome.player);
                this.player$.take(1).subscribe((player: PlayerInfo) => {
                    this.currentPlayerId = player.playerId
                    this.currentPlayer = player
                });
            }
            this.teeTimeSlotDisplay = this.navParams.get("teeTimeSlotDisplay");
            // if(this.teeTimeSlotDisplay.currency) 
            this.currency = this.teeTimeSlotDisplay.currency;
            // if(this.teeTimeSlotDisplay.originalPrices) 
            this.prices = this.teeTimeSlotDisplay.originalPrices;
            // if(this.teeTimeSlotDisplay.displayPrices) 
            this.promoPrices = this.teeTimeSlotDisplay.displayPrices;
            this.clubInfo = this.navParams.get("clubInfo");
            this.clubs = this.navParams.get("clubs");
            let _eighteenHoles = this.teeTimeSlotDisplay.slot.eighteenHolesAllowed;
            let _nineHoles = this.teeTimeSlotDisplay.slot.nineHolesAllowed;
            if(_eighteenHoles && _nineHoles) {
                this.holesPlayed = "2";
                this.eighteenHolesAllowed = true;
                this.nineHolesAllowed = true;
            } 
            else if(!_eighteenHoles && _nineHoles) {
                this.holesPlayed = "1";
            }
            else if(_eighteenHoles && !_nineHoles) {
                this.holesPlayed = "2";
                this.eighteenHolesAllowed = true;
                this.nineHolesAllowed = false;
            } else if(!_eighteenHoles && !_nineHoles) {
                this.holesPlayed = "1";
                this.eighteenHolesAllowed = false;
                this.nineHolesAllowed = false;
            }
            this.playerReq = this.teeTimeSlotDisplay.slot.minPlayers;
            if (this.teeTimeSlotDisplay.slot.pricingPlanPromotional && this.teeTimeSlotDisplay.slot.pricingPlanPromotional.promotional) this.isPromo = true
            this.buggyReq = this.teeTimeSlotDisplay.slot && this.teeTimeSlotDisplay.slot.allowWalking ? 0 : 1;
            this.caddyReq = this.teeTimeSlotDisplay.slot && this.teeTimeSlotDisplay.slot.caddyMandatory ? 1 : 0;
            if(this.teeTimeSlotDisplay) {
                this.caddyRequired = this.teeTimeSlotDisplay.slot.caddyMandatory?true:false;
                this.buggyRequired = !this.teeTimeSlotDisplay.slot.allowWalking?true:false;
            }

        } else {
            if(this.fromClub) {
                // this.currentPlayerId = 199
            } else {
                this.playerHomeInfo$ = this.playerHomeService.playerHomeInfo();
                this.player$ = this.playerHomeInfo$
                    .filter(Boolean)
                    .map((playerHome: PlayerHomeInfo) => playerHome.player);
                this.player$.take(1).subscribe((player: PlayerInfo) => {
                    this.currentPlayerId = player.playerId
                    this.currentPlayer = player
                });
            }

            if (!this.teeTimeSlotDisplay) this.teeTimeSlotDisplay = {};
            // this.teeTimeSlot = this.navParams.get("teeTimeSlotDisplay");

            this.bookingSlot = this.navParams.get("bookingSlot");
            // if(this.bookingSlot.ori )
            
            // this.prices = this.teeTimeSlotDisplay.originalPrices;
            // this.promoPrices = this.teeTimeSlotDisplay.displayPrices;


            if(this.bookingSlot.bookingDiscounts && this.bookingSlot.bookingDiscounts.length > 0) {
                this.bookingDiscounts = this.bookingSlot.bookingDiscounts.filter((d: TeeTimeBookingDiscount)=>{
                    if(d.voucherApplied) return d.voucherApplied.redeemed
                });
            } else this.bookingDiscounts = [];

            this.assignmentDone = this.bookingSlot.assignmentDone;
            // this.prices = this.bookingSlot.slotAssigned.pricingPlan
            // this.promoPrices = this.bookingSlot.displayPrices;
            this.teeTimeSlot = this.bookingSlot.slotAssigned;
            this.teeTimeSlotDisplay = {
                slot: this.teeTimeSlot
            };

            let _eighteenHoles = this.bookingSlot.slotAssigned.eighteenHolesAllowed;
            let _nineHoles = this.bookingSlot.slotAssigned.nineHolesAllowed;
            if(_eighteenHoles && _nineHoles) {
                this.holesPlayed = "2";
                this.eighteenHolesAllowed = true;
                this.nineHolesAllowed = true;
            } 
            else if(!_eighteenHoles && _nineHoles) {
                this.holesPlayed = "1";
            }
            else if(_eighteenHoles && !_nineHoles) {
                this.holesPlayed = "2";
                this.eighteenHolesAllowed = true;
                this.nineHolesAllowed = false;
            } else if(!_eighteenHoles && !_nineHoles) {
                this.holesPlayed = "1";
                this.eighteenHolesAllowed = false;
                this.nineHolesAllowed = false;
            }
          //  console.log("booking players sort before : ", this.bookingSlot.bookingPlayers)
            // this.bookingSlot.bookingPlayers = this.bookingSlot.bookingPlayers;
            // this.bookingSlot.bookingPlayers.sort((a, b) => {
            //     if (a.sequence < b.sequence)
            //         return -1;
            //     else if (a.sequence > b.sequence)
            //         return 1;
            //     else 0;
            // })

            this.buggyReq = this.bookingSlot.buggyRequested;
            this.caddyReq = this.bookingSlot.caddyRequested;

          //  console.log("booking players sort after : ", this.bookingSlot.bookingPlayers)
            this.playerSlot.push(...this.bookingSlot.bookingPlayers);
            if (this.teeTimeSlotDisplay.currency) this.currency = this.teeTimeSlotDisplay.currency;
            if (this.teeTimeSlotDisplay.originalPrices) this.prices = this.teeTimeSlotDisplay.originalPrices;
            if (this.teeTimeSlotDisplay.displayPrices) this.promoPrices = this.teeTimeSlotDisplay.displayPrices;
            this.clubInfo = this.navParams.get("clubInfo");
            // this.clubs = this.navParams.get("clubs");
            
            this.removedPlayers = this.bookingSlot.bookingPlayers.filter((p)=>{
                return p.playerRemoved;
            })
            this.bookingSlot.bookingPlayers = this.bookingSlot.bookingPlayers.filter((p)=>{
                return !p.playerRemoved
            });

            // if(this.bookingSlot.bookingPlayers && this.bookingSlot.bookingPlayers.length > 0) {
            //     this.bookingSlot.bookingPlayers = this.bookingSlot.bookingPlayers.sort((a,b) => {
            //         if(!a.playerRemoved && b.playerRemoved) return -1
            //         else if(a.playerRemoved && !b.playerRemoved) return 1
            //         else return 0
            //     })
            // }; 
            // if (this.teeTimeSlotDisplay.slot.pricingPlanPromotional && this.teeTimeSlotDisplay.slot.pricingPlanPromotional.promotional) this.isPromo = true
            for (let i = 1; i <= this.bookingSlot.slotAssigned.maxPlayers; i++) {
                this.slots.push(i)
                if (this.bookingSlot.bookingPlayers[i - 1] && (this.bookingSlot.bookingPlayers[i - 1].caddyPreferred || (this.bookingSlot.bookingPlayers[i - 1].caddySelectionCriteria && this.bookingSlot.bookingPlayers[i - 1].caddySelectionCriteria.gender) || this.bookingSlot.bookingPlayers[i - 1].caddyPairing > 0))
                    this.caddyReq += 1;
                if (this.bookingSlot.bookingPlayers[i - 1] && this.bookingSlot.bookingPlayers[i - 1].pairingNo > 0)
                    this.buggyReq += 1;
            }

            // this.bookingSlot.bookingPlayers.forEach((player: TeeTimeBookingPlayer) => {
            //     JsonService.deriveFulImageURL(player.player, "image")
            //     JsonService.deriveFulImageURL(player.player, "profile")
            //     JsonService.deriveFulImageURL(player.caddyPreferred, "caddyImage")
            //     JsonService.deriveFulImageURL(player.caddyAssigned, "caddyImage")
            // })

            let _uniqBuggy = this.getUnique(this.bookingSlot.bookingPlayers, 'pairingNo');
            _uniqBuggy = _uniqBuggy.filter((ub)=>{
                return ub.pairingNo > 0
            })
            let _uniqCaddy = this.getUnique(this.bookingSlot.bookingPlayers, 'caddyPairing');
            _uniqCaddy = _uniqCaddy.filter((uc)=>{
                return uc.caddyPairing > 0
            })
          //  console.log("unique buggy ", _uniqBuggy)
          //  console.log("unique caddy ", _uniqCaddy)
            this.uniqBuggy = this.getUnique(this.bookingSlot.bookingPlayers, 'pairingNo');
            this.uniqBuggy = this.uniqBuggy.filter((ub)=>{
                return ub.pairingNo > 0
            })
            this.uniqCaddy = this.getUnique(this.bookingSlot.bookingPlayers, 'caddyPairing');
            this.uniqCaddy = this.uniqCaddy.filter((uc)=>{
                return uc.caddyPairing > 0
            })
            if (this.uniqBuggy) this.buggyReq = this.uniqBuggy.length;
            if (this.uniqCaddy) this.caddyReq = this.uniqCaddy.length;
            this.uniqCaddy.forEach((c: TeeTimeBookingPlayer)=>{
                JsonService.deriveFulImageURL(c.caddyAssigned,'caddyImage');
                JsonService.deriveFulImageURL(c.caddyPreferred,'caddyImage');
            })

            for (let i = 0; i < this.uniqCaddy.length; i++) {
                this.caddyRating[i] = 0;
            }
          //  console.log("initial caddy rating : ",this.caddyRating);
            // this.caddyReq = this.bookingSlot.bookingPlayers.reduce((a,b)=>{
            //     return a
            // })
            this.bookingSlot.bookingPlayers.sort((a, b) => {
                if (a.sequence < b.sequence)
                    return -1;
                else if (a.sequence > b.sequence)
                    return 1;
                else 0;
            })

            this.bookingSlot.bookingPlayers.forEach((p, i) => {

                this.buggyCaddyPreference.playerPairings.push(Object.assign({}, this.buggyCaddyPreference[i], {
                    bookingPlayerId: p.id,
                    buggyRequired: p.pairingNo !== 0 ? true : false,
                    buggyPairing: p.pairingNo,
                    driving: p.driving,
                    caddiePreferred: p.caddyPreferred && p.caddyPreferred.id ? p.caddyPreferred.id : null,
                    caddieAssigned: p.caddyAssigned && p.caddyAssigned.id ? p.caddyAssigned.id : null,
                    caddyPairing: p.caddyPairing,
                    caddyRequired: p.caddyPairing > 0 ? true: false,
                    caddyPreferred: p.caddyPreferred,
                    caddyAssigned: p.caddyAssigned,
                    assignedBuggy: p.buggyId,
                }))
                let _caddyPairing = 0;
                // this.caddyPairing = [];
                // this.caddyPairing[0] = {
                //     caddyPairing: 0,
                //     caddyPreferred: null
                // }
                // this.caddySlots[0] = {
                //         caddyPairing: 0,
                //         caddyPreferred: null
                //     }
                if (p.caddyPairing > 0) {
                    _caddyPairing = p.caddyPairing; // - 1
                    if (!this.caddyPairing[_caddyPairing]) {
                        // && p.caddyPreferred
                        this.caddyPairing[_caddyPairing] = {
                            caddyPreferred: p.caddyPreferred,
                            caddyPairing: p.caddyPairing,
                            caddySelectionCriteria: p.caddySelectionCriteria ? p.caddySelectionCriteria : null,
                            caddyRequired: p.caddyPreferred || p.caddyPairing > 0? true: false
                        }
                    }
                    if (!this.caddySlots[_caddyPairing]) {
                        // && p.caddyPreferred
                        this.caddySlots[_caddyPairing] = {
                            caddyPairing: p.caddyPairing ? p.caddyPairing : 0,
                            caddyPreferred: p.caddyPreferred ? p.caddyPreferred : null,
                            caddySelectionCriteria: p.caddySelectionCriteria ? p.caddySelectionCriteria : null,
                            caddyRequired: p.caddyPreferred || p.caddyPairing > 0? true: false,
                            caddyAssigned: p.caddyAssigned? p.caddyAssigned: null,
                        }
                    }

                }
                // else {
                //     this.caddyPairing[_caddyPairing] = {
                //         caddyPreferred: p.caddyPreferred?p.caddyPreferred:null,
                //         caddyPairing: p.caddyPairing?p.caddyPairing:0,
                //     }
                //     this.caddySlots[_caddyPairing] = {
                //         caddyPairing: p.caddyPairing?p.caddyPairing:0,
                //         caddyPreferred: p.caddyPreferred?p.caddyPreferred:null,
                //     }
                // }
                if(p.player && p.player.id)
                    if(this.fromClub) this.getPlayersCredits(999, p.player.id);

            })
                if(!this.fromClub && this.currentPlayerId) this.getPlayersCredits(999, this.currentPlayerId);
            this.depositAmount = this.bookingSlot.depositPayable?this.bookingSlot.depositPayable:this.bookingOptions?this.getDepositAmount():0;
            Number(this.depositAmount.toFixed(2))
            this.paymentStatus = this.bookingSlot.bookingStatus === 'PaymentFull' ? 'Paid' : 'Pending';
            this.buggyRequired = this.bookingSlot.buggyRequested === 0 ? false : true;
            this.caddyRequired = this.bookingSlot.caddyRequested === 0 ? false : true;
            // for (let i = 1; i <= this.bookingSlot.totalPlayers; i++) {
            //     this.slots.push(i)
            //     if(this.bookingSlot.bookingPlayers[i-1] && this.bookingSlot.bookingPlayers[i-1].caddyPreferred)
            //          this.caddyReq += 1;
            // }
          //  console.log("initialize caddyreq : ", this.caddyReq)
          //  console.log("initialize caddy slots : ", this.caddySlots)
          //  console.log("initialize caddy pairing : ", this.caddyPairing)


            this.playerReq = this.bookingSlot.totalPlayers;

            this.buggyCaddyPreference['bookingId'] = this.bookingSlot.id;
            this.buggyCaddyPreference.playerPairings.shift();
            this.buggyCaddyPreference.ignoreBuggyUpdate = true;
            this.buggyCaddyPreference.ignoreCaddieUpdate = true;
            this.newBuggyCaddyPreference = JSON.parse(JSON.stringify(this.buggyCaddyPreference));

          //  console.log("buggy preference init page : ", this.buggyCaddyPreference);
          //  console.log("new buggy preference init page : ", this.newBuggyCaddyPreference);

            if (this.bookingSlot.assignmentDone 
                && (this.bookingSlot.bookingStatus !== 'PaymentFull' && this.bookingSlot.bookingStatus !=='PaymentPartial')
             && this.bookingType !== 'past') {
                this.toggleBookingClick(5);
                this.paymentMode = true;
                this.paymentClickedBoolean = true;
            }

            // if(this.bookingSlot && this.bookingSlot.bookingStatus === 'PaymentFull') {
            //     let countDownDate = new Date(this.bookingSlot.slotAssigned.teeOffTime).getTime();
            //     // countDownDate.setSeconds(countDownDate.getSeconds() + 10)

            //     // Update the count down every 1 second
            //     var x = setInterval(function() {

            //       // Get today's date and time
            //       var now = new Date().getTime();

            //       // Find the distance between now and the count down date
            //       var distance = countDownDate - now;

            //       // Time calculations for days, hours, minutes and seconds
            //       var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            //       var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            //       var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            //       var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            //       // Output the result in an element with id="demo"
            //       document.getElementById("demo").innerHTML = 
            //     //   minutes + "m "+ seconds +" s"
            //       days + "d " + hours + "h "
            //       + minutes + "m " + seconds + "s ";

            //       // If the count down is over, write some text 
            //       if (distance < 0) {
            //         clearInterval(x);
            //         document.getElementById("demo").innerHTML = "";
            //       }
            //     }, 1000);
            // }






        }


        
        // this.club
      //  console.log("booking details - teeTimeSlotDisplay : ", this.teeTimeSlotDisplay);
      //  console.log("booking details - bookingSlot : ", this.bookingSlot);

        this.platform.ready().then(
            () => {

                // set certain preferences
                // this.appRate.preferences.storeAppURL = {
                //     ios: '<app_id>',
                //     android: 'market://details?id=<package_name>',
                //     windows: 'ms-windows-store://review/?ProductId=<store_id>'
                // };

                // this.appRate.promptForRating(true);

                // // or, override the whole preferences object
                // this.appRate.preferences = {
                //     usesUntilPrompt: 3,
                //     storeAppURL: {
                //     ios: '<app_id>',
                //     android: 'market://details?id=<package_name>',
                //     windows: 'ms-windows-store://review/?ProductId=<store_id>'
                //     }
                // };

                // this.appRate.promptForRating(false);


                //   this.appRate.preferences= {
                //     storeAppURL: {
                //       ios: '1092380543',
                //       android: 'market://details?id=com.brite.mygolf2u' //details?id=com.brite.mygolf2u
                //     },
                //     usesUntilPrompt: 2,
                //     customLocale: {
                //       title: 'Please rate us',
                //       message: 'Please rate us',
                //       cancelButtonLabel: 'Pass',
                //       rateButtonLabel: 'Rate it!',
                //       laterButtonLabel: 'Ask Later'
                //     }
                //   }
            }
        )

        if (this.bookingType === 'past') {
            this.getClubRatingItems();
        }

        
        this.playerVoucher = this.navParams.get("playerVoucher");
        this.voucherSeries = this.navParams.get("voucherSeries");
        this.clubDiscounts = this.navParams.get("clubDiscounts");

      //  console.log("players balance", this.playersBalance)


    }




    ionViewDidLoad() {
        // if(this.navParams.get("needRefresh")) {
        //     this.refreshBookingDetails();
        //     // this.getPendingPlayerDiscountCard();
        // }
        // // if(this.navParams.get("fromPlayerVoucher")) this.nav.pop();
        // console.log("nav params : ", this.navParams.get("needRefresh"), this.navParams.get("fromPlayerVoucher"))
        // this.checkClubBookingOption();
        // if(this.fromClub && !this.teeSlotNew) this.getBookingItemizedBill(false);
        // if(this.teeSlotNew) this.initServerStatus();
        // this.recalculateBookingPricing();
    }

    ngAfterViewInit() {
      //  console.log('all done loading :)');

      //  console.log(this.cdr.detectChanges())
    }

    ionViewDidEnter() {
        this.getAppAttribute();
        
        if(this.navParams.get("needRefresh")) {
            this.refreshBookingDetails();
            // this.getPendingPlayerDiscountCard();
        }
        // if(this.navParams.get("fromPlayerVoucher")) this.nav.pop();
      //  console.log("nav params : ", this.navParams.get("needRefresh"), this.navParams.get("fromPlayerVoucher"))
        this.checkClubBookingOption();
        
        if(this.fromClub && !this.teeSlotNew) this.getBookingItemizedBill(false);
        if(this.teeSlotNew) this.initServerStatus();
        if(this.bookingType !== 'past') this.recalculateBookingPricing();
        // if(this.teeSlotNew && !this.fromClub) this.checkPlayerMaxBooking();


        // if(!this.teeSlotNew) {
        //     this.recalculateBookingPricing();
        // this.getBookingItemizedBill(false);
        // }
        if (this.refreshOnEnter)
            this._refreshValues(null, null);
        this.refreshOnEnter = false;
    }

    ionViewWillEnter() {
        adjustViewZIndex(this.nav, this.renderer);
    }

    checkPlayerMaxBooking(clubId?: number) {
        if(!clubId) return;
      //  console.log("check max booking club : ", this.clubInfo, this.clubs)
        let _clubId = clubId?clubId:this.clubs.club.id;//this.clubInfo?this.clubInfo.clubId:this.clubs.club.id;
        let _playerId = this.currentPlayer?this.currentPlayer.playerId:this.currentPlayerId;
        let _forDate = moment(this.teeTimeSlotDisplay.slot.teeOffDate,"YYYY-MM-DD").format("YYYY-MM-DD");
        this.flightService.getPlayerMaxBooking(_clubId, _playerId, _forDate)
        .subscribe((data)=>{
            if(data) this.playerMaxBooking = data;
          //  console.log("check max booking : ", data);
        })
    }

    checkClubBookingOption() {
        
        let _bookingClubId;
        //  = this.bookingSlot && this.bookingSlot.clubData ? this.bookingSlot.clubData.id : (this.clubs && this.clubs.club.id) ? this.clubs.club.id : this.clubInfo.clubId;
        if(!this.teeSlotNew && this.bookingSlot && this.bookingSlot.clubData) {
            _bookingClubId = this.bookingSlot.clubData.id
        } else if(this.clubs && this.clubs.club) {
            _bookingClubId = this.clubs.club.id;
        } else if(this.clubInfo && this.clubInfo.clubId) {
            _bookingClubId = this.clubInfo.clubId;
        } else if(this.clubInfo && this.clubInfo.id) {
            _bookingClubId = this.clubInfo.id;
        }
      //  console.log("tee slot new : ", this.teeSlotNew, " - fromClub : ", this.fromClub," - club id : ", _bookingClubId)
        let _forDate = this.bookingSlot && this.bookingSlot.slotAssigned.teeOffDate ? this.bookingSlot.slotAssigned.teeOffDate : this.teeTimeSlotDisplay.slot.teeOffDate;
        this.flightService.getClubBookingOptions(_bookingClubId, moment(_forDate).format("YYYY-MM-DD"))
            .subscribe((bookOpts: TeeTimeBookingOptions) => {
                if (bookOpts) this.bookingOptions = bookOpts;
                // if(bookOpts) this.bookingOptions.allowCaddiePreference = false;
              //  console.log("result from check club booking opts : ", bookOpts)
            }, (error)=>{

            },()=>{
                if(this.teeSlotNew && !this.fromClub) this.checkPlayerMaxBooking(_bookingClubId);
            })
    }

    public refreshOnViewEntered(refresh: boolean) {
        this.refreshOnEnter = refresh;
    }

    public refreshPage(pushData: any) {
        this._refreshValues(null, null);
    }

    public getNotifications(): Array < NotificationHandlerInfo > {
        let notifications = new Array < NotificationHandlerInfo > ();
        notifications.push({
            type: AbstractNotificationHandlerPage.TYPE_FRIEND_REQUEST,
            whenActive: "showToast",
            whenInactive: "none",
            needRefresh: true
        });
        notifications.push({
            type: AbstractNotificationHandlerPage.TYPE_FRIEND_REQUEST_ACCEPTED,
            whenActive: "showToast",
            whenInactive: "none",
            needRefresh: true
        });
        return notifications;
    }

    async getBookingPlayers(bookingSlot: TeeTimeBooking) {
        // setTimeout(()=>{

        // },1000)
        // return Promise.resolve(bookingSlot.bookingPlayers);
        this.bookingSlot.bookingPlayers = await bookingSlot.bookingPlayers;

    }

    onSearchInput(searchbar) {
        this._refreshValues(null, null);
    }

    onSearchCancel() {
      //  console.log("Out os search field");
    }

    onPlayerInput(searchbar) {
        this.playerList = createPlayerList();
        this._refreshPlayer(null, null);
    }

    onRefresh(refresher) {
        this._refreshValues(refresher, null)
    }

    onRefreshClick() {
        this.paymentMode = false;
        this.refreshBookingDetails(); //overpaid not showing if this commented
        if(this.bookingType !== 'past') this.recalculateBookingPricing();
        if(!this.fromClub) this.getPendingPlayerDiscountCard();
    }

    recalculateBookingPricing(override: boolean = false) {
        if(this.teeSlotNew) return false;
        if(this.bookingSlot) {
            let _bookingDate = moment(this.bookingSlot.slotAssigned.teeOffDate);
            let _currentDate = moment();
            if(_bookingDate.diff(_currentDate,'days') < 0) {
                console.log("trigger pricing : ", _bookingDate, _currentDate)
                console.log("trigger pricing : ", _bookingDate.diff(_currentDate,'days'))
                if(override) return true;
                else return false;
            }
        }
        let _bookingId = this.bookingSlot.id;
        let loader = this.loadingCtrl.create({
            showBackdrop: false,
            duration: 5000,
            content: 'Refreshing booking...'
        });
        
        loader.present().then(() => {
            this.flightService.recalculateBookingPricing(_bookingId)
            .subscribe((data: TeeTimeBooking)=>{
                loader.dismiss().then(() => {
                    this.refreshBookingObject(data);
                  //  console.log("recalculate booking pricing", data)
                })
            }, (error)=>{
                loader.dismiss();
            }, ()=>{
                this.getBookingItemizedBill(this.assignmentDone);
            })
        })
    }

    // openNewContact() {
    //     this.nav.push(NewContactPage);
    // }

    openNewContact() {
        let newContact = this.modalCtl.create(NewContactPage, {
            openedModal: true
        });
        newContact.onDidDismiss((apply: any) => {
            // if (apply) {
          //  console.log("Came back from new contact", apply)
            this._refreshFriends(null, null);
            // }
        });
        newContact.present();
    }

    searchNewContact() {
        this.nav.push(SearchPlayerListPage);
    }

    friendSelected(event, item: PlayerInfo) {
        let modal = this.modalCtl.create(ProfilePage, {
            status: 'friend',
            type: 'friendProfile',
            player: Observable.of(item),
            openedModal: true
        });
        modal.onDidDismiss((data: any) => {
            adjustViewZIndex(this.nav, this.renderer);
            if (data) {
              //  console.log("dismiss profile:", data);

                if (data.type == "requestFriend") {
                    this.friends = "request";
                    this._refreshValues(null, null);
                }
                if (data.type == "acceptFriend")
                    this._refreshValues(null, null);

                if (data.type == "deleteFriend") {
                    this._refreshValues(null, null);
                }
                if (data.type == "deleteRequest") {
                    this._refreshValues(null, null);
                }
            }


        });
        modal.present();
        // this.events.publish("friendSelected", item);
        // this.nav.push(ProfilePage, {
        //     status: 'friend',
        //     type: 'friendProfile',
        //     player: item,
        //     homeInfo: this.homeInfo
        // });
    }

    requestSelected(event, item: FriendRequest) {
        // this.events.publish("requestSelected", item);
        let modal = this.modalCtl.create(ProfilePage, {
            requestByPlayer: item.requestByPlayer,
            status: 'pendingFriend',
            type: 'friendProfile',
            player: Observable.of(item.player),

            openedModal: true
        });
        modal.onDidDismiss((data: any) => {

            if (data) {
              //  console.log("dismiss profile:", data);

                if (data.type == "requestFriend") {
                    this.friends = "request";
                    this._refreshValues(null, null);
                }
                if (data.type == "acceptFriend") {
                    this.friends = "friend";
                    this._refreshValues(null, null);
                }
                if (data.type == "deleteFriend") {
                    this._refreshValues(null, null);
                }
                if (data.type == "deleteRequest") {
                    this._refreshValues(null, null);
                }
            }


        });
        modal.present();

        // this.nav.push(ProfilePage, {
        //     requestByPlayer: item.requestByPlayer,
        //     status: 'pendingFriend',
        //     type: 'friendProfile',
        //     player: item.player,
        //     homeInfo: this.homeInfo
        // });
    }

    doInfinite(infinite) {

        if (this.isMore()) {
            this._refreshPlayer(null, infinite);
        } else {
            infinite.complete();
            infinite.enable(false);
        }

    }

    public isMore() {
        return this.playerList.totalPages > 0 && this.playerList.currentPage < this.playerList.totalPages;
    }

    receivedRequest() {
        this.receivedList = this.requestFriends.friendRequests.filter((req: FriendRequest) => {
            return !req.requestByPlayer;
        });

    }

    sentRequest() {
        this.sentList = this.requestFriends.friendRequests.filter((req: FriendRequest) => {
            return req.requestByPlayer
        });
        // console.log("Sent:",this.sentList)
    }

    private _refreshValues(refresher, infinite) {
      //  console.log("Enter Refresh");

        if (this.friends == "friend") {
            this._refreshFriends(refresher, infinite);
        }

        if (this.friends == "request") {
            this._refreshRequest(refresher, infinite);
        }

        if (this.friends == "find") {
            this.playerList = createPlayerList();
            this._refreshPlayer(refresher, infinite);
        }
    }

    private _refreshRequest(refresher, infinite) {

        this.refreshAttempted = false;

        let loader = this.loadingCtrl.create({
            showBackdrop: false
        });

        loader.present().then(() => {
            this.refreshAttempted = false;
            this.friendService.searchFriendRequests()
                .subscribe((friendRequests: FriendRequestList) => {
                    loader.dismiss(friendRequests).then(() => {

                        this.refreshAttempted = true;

                        if (friendRequests) {
                            this.requestFriends = friendRequests;
                            this.receivedRequest();
                            this.sentRequest();
                        }

                        if (this.sentList.length > 0) {
                            this.sentExist = true;
                        }

                        if (this.receivedList.length > 0) {
                            this.receiveExist = true;
                        }

                        if (this.platform.is("ios") && this.platform.is("cordova")) {
                            this.keyboard.close();
                        }

                    });
                }, (error) => {
                    loader.dismiss();
                }, () => {
                    if (refresher) {
                        refresher.complete();
                    }
                    if (infinite) {
                        infinite.complete();
                    }
                });

        });
    }

    private _refreshFriends(refresher, infinite) {
        let loader = this.loadingCtrl.create({
            showBackdrop: false
        });

        loader.present().then(() => {
            this.refreshAttempted = false;
            this.friendService.searchFriends(this.searchFriend)
                .subscribe((friendRequests: PlayerList) => {
                    loader.dismiss(friendRequests).then(() => {

                        this.refreshAttempted = true;

                        if (friendRequests) {
                            this.listFriends = friendRequests;
                        }

                    });
                }, (error) => {
                    loader.dismiss();
                }, () => {
                    if (refresher) {
                        refresher.complete();
                    }
                    if (infinite) {
                        infinite.complete();
                    }
                });

        });
    }

    private _refreshPlayer(refresher, infinite) {

        this.refreshPlayer = false;

        if (!this.searchPlayer || this.searchPlayer == "") {
            this.refreshPlayer = false;
            return false;
        }

        let loader = this.loadingCtrl.create({
            showBackdrop: false
        });

        loader.present().then(() => {

            this.friendService.searchNonFriends(this.searchPlayer, this.playerList.currentPage + 1)
                .subscribe((playerList: PlayerList) => {
                    loader.dismiss(playerList).then(() => {
                      //  console.log("PlayerList:", playerList);

                        if (playerList.totalPages > 0)
                            this.playerList.currentPage++;

                        this.refreshPlayer = true;

                        if (playerList) {
                            this.playerList.currentPage = playerList.currentPage;
                            this.playerList.totalPages = playerList.totalInPage;
                            this.playerList.totalItems = playerList.totalItems;
                            this.playerList.players.push(...playerList.players);
                        }
                        if (this.platform.is("ios") && this.platform.is("cordova")) {
                            this.keyboard.close();
                        }

                    });
                }, (error) => {
                    loader.dismiss();
                }, () => {
                    if (refresher) {
                        refresher.complete();
                    }
                    if (infinite) {
                        infinite.complete();
                    }
                });

        });

    }

    playerSelected(event, item: PlayerInfo) {
        let modal = this.modalCtl.create(ProfilePage, {
            status: 'notFriend',
            type: 'friendProfile',
            player: Observable.of(item),
            // homeInfo: this.homeInfo,
            openedModal: true
        });
        modal.onDidDismiss((data: any) => {
            adjustViewZIndex(this.nav, this.renderer);
            if (data) {
              //  console.log("dismiss profile:", data);

                if (data.type == "requestFriend") {
                    this.friends = "request";
                    this._refreshValues(null, null);
                }
                if (data.type == "acceptFriend") {
                    this.friends = "friend";
                    this._refreshValues(null, null);
                }
                if (data.type == "deleteFriend") {
                    this._refreshValues(null, null);
                }
                if (data.type == "deleteRequest") {
                    this._refreshValues(null, null);
                }
            }



        });
        modal.present();
        // this.events.publish("playerSelected", item);
        // this.nav.push(ProfilePage, {
        //     status: 'notFriend',
        //     type: 'friendProfile',
        //     player: item,
        //     homeInfo: this.homeInfo
    }

    setFriendType(type: number) {
        if (type === 1) {
            this.friendType = 'friend';
            this.friendScreenName = 'Friends';
            if (this.platform.is("ios") && this.platform.is("cordova")) {
                this.keyboard.close();
            }
        }
        if (type === 2) {
            this.friendType = 'request';
            this.friendScreenName = 'Requests';
            this._refreshRequest(null, null);
            if (this.platform.is("ios") && this.platform.is("cordova")) {
                this.keyboard.close();
            }
        }
        if (type === 3) {
            this.friendType = 'find';
            this.friendScreenName = 'Find | Add';
            this.playerList = createPlayerList();
            this._refreshPlayer(null, null);
            if (this.platform.is("ios") && this.platform.is("cordova")) {
                this.keyboard.close();
            }
        }

    }

    setBookingType(type: number) {
        if (type === 1) {
            this.friendType = 'search';
            this.friendScreenName = 'Search';
            if (this.platform.is("ios") && this.platform.is("cordova")) {
                this.keyboard.close();
            }
        }
        if (type === 2) {
            this.friendType = 'mybookings';
            this.friendScreenName = 'My Bookings';
            this._refreshRequest(null, null);
            if (this.platform.is("ios") && this.platform.is("cordova")) {
                this.keyboard.close();
            }
        }

    }

    toggleBookingClick(type: number) {
        // let _current = this.expandPlayers[slot];
      //  console.log("get current tee booking ", this.bookingSlot)
      //  console.log("get current tee booking ", this.paymentMode, type)
        if (this.paymentMode && type !== 5 && type !== 1) return false;
        if (this.grpAdditionals && type !== 3) {
            if(this.hasPreferenceChanges()) {
                this.onResetPreference();
                return false;
            }
        }
        if (type === 1) {
            this.grpTeeSlotInfo = !this.grpTeeSlotInfo;
            this.grpPlayerDetails = false;
            this.grpAdditionals = false;
            this.grpFood = false;
            this.grpPayment = false;
            this.grpCheckIn = false;
            this.grpFeedback = false;
        } else if (type === 2) {
            this.grpTeeSlotInfo = false;
            this.grpPlayerDetails = !this.grpPlayerDetails;
            this.grpAdditionals = false;
            this.grpFood = false;
            this.grpPayment = false;
            this.grpCheckIn = false;
            this.grpFeedback = false;
        } else if (type === 3) {
            this.grpTeeSlotInfo = false;
            this.grpPlayerDetails = false;
            this.grpAdditionals = !this.grpAdditionals;
            this.grpFood = false;
            this.grpPayment = false;
            this.grpCheckIn = false;
            this.grpFeedback = false;
        } else if (type === 4) {
            this.grpTeeSlotInfo = false;
            this.grpPlayerDetails = false;
            this.grpAdditionals = false;
            this.grpFood = !this.grpFood;
            this.grpPayment = false;
            this.grpCheckIn = false;
            this.grpFeedback = false;
        } else if (type === 5) {
            this.grpTeeSlotInfo = false;
            this.grpPlayerDetails = false;
            this.grpAdditionals = false;
            this.grpFood = false;
            this.grpPayment = !this.grpPayment;
            this.grpCheckIn = false;
            this.grpFeedback = false;
            // if(this.bookingSlot.bookingStatus === 'PaymentFull' || this.bookingSlot.bookingStatus === 'PaymentPartial')
            //     this.getBookingItemizedBill(true);
            // else this.getBookingItemizedBill(false);
            if(this.grpPayment) {
                if(this.bookingType !== 'past') this.recalculateBookingPricing();
                this.getBookingItemizedBill(false);
            }
            // if(this.bookingSlot.bookingStatus.toLowerCase() === 'paymentpartial' || this.bookingSlot.bookingStatus.toLowerCase() === 'paymentfull')
            //     this.onProcessAssignment();
            // this.onProcessAssignment();
        } else if (type === 6) {
            this.grpTeeSlotInfo = false;
            this.grpPlayerDetails = false;
            this.grpAdditionals = false;
            this.grpFood = false;
            this.grpPayment = false;
            this.grpCheckIn = !this.grpCheckIn;
            this.grpFeedback = false;
        } else if (type === 7) {
            this.grpTeeSlotInfo = false;
            this.grpPlayerDetails = false;
            this.grpAdditionals = false;
            this.grpFood = false;
            this.grpPayment = false;
            this.grpCheckIn = false;
            this.grpFeedback = !this.grpFeedback;
        }
    }

    onChangeCourse(event) {
        let popover = this.popoverCtl.create(CourseBox, {
            // courses: this.courses
        });
        popover.onDidDismiss((data: CourseInfo) => {
            if (data) {
                // this.gameInfo.courses.push(data);
            }
        });
        popover.present({
            ev: event
        });
    }

    addPlayerSlot() {
        let playerModal = this.modalCtl.create(FriendListPage, {
            openedModal: true,
            forBooking: true,
            // playersToExclude: playersToExclude,
            // gameInfo        : this.gameInfo
        });
        playerModal.onDidDismiss((data: PlayerInfo) => {
            //Check whether the club info is passed
            if (data) {
                let player = JsonService.clone(data);
                // this.otherPlayers[slot - 2] = player;
                // if(!this.otherPlayers[slot - 2].handicap) {
                //     if(this.otherPlayers[slot - 2].gender === 'F')
                //         this.otherPlayers[slot - 2].handicap = 36
                //     else this.otherPlayers[slot - 2].handicap = 24
                // }
                // this._gettingCourseHandicap(slot);
            }
        });
        playerModal.present();
    }

    getSlotPrice(slot: TeeTimeSlotDisplay, attribute ? : string) {
      //  console.log("slot price - ", slot)
      //  console.log("slot price - attribute ", attribute)
        if (!slot || slot === null) return '';

        let _slot = slot;
        let _currency = (_slot.currency ? _slot.currency.symbol : '')
        let _price;
        let _promoPrice;

        let _testObj = {
            "STD": 120,
            "SENIOR": 95
        };

        // Object.keys(_testObj).forEach((v,i,a) =>{

        //   //  console.log("[get slot price] value : ", v);
        //   //  console.log("[get slot price] indexx : ", i);
        //   //  console.log("[get slot price] array : ", a);
        // })

        // Object.keys(_slot.displayPrices).forEach((v,i,a) =>{

        //   //  console.log("[get slot price] dp value : ", v);
        //   //  console.log("[get slot price] dp indexx : ", i);
        //   //  console.log("[get slot price] dp array : ", a);
        // })

        // for (const key in _slot.displayPrices) {
        // //  console.log('[get slot price] The value for ' + key + ' is = ' + _slot.displayPrices[key]);
        // }
        // And getting array of the Object's key values is done like this:

        // keys: string [] = Object.keys(formConfig);

        // console.log("getSlotPrices ---------START----------")
        // console.log("getSlotPrice slots - ", slot);
        // console.log("getSlotPrice slot[0] - ", _slot);
        // console.log("getSlotPrice displayPrices :", _slot.displayPrices)
        // console.log("getSlotPrice originalPrices :", _slot.originalPrices)
        // console.log("getSlotPrice attribute : ", attribute);
        // console.log("getSlotPrice isPromo? : ", this.isPromo)
        // console.log("getSlotPrices ---------END----------")
        switch (attribute) {
            case 'STD':
                _promoPrice = (_slot.displayPrices ? _slot.displayPrices.STD : '');
                _price = (_slot.originalPrices && _slot.originalPrices.STD ? _slot.originalPrices.STD : (_slot.displayPrices ? _slot.displayPrices.STD : ''));
                break;
                // console.log("getSlotPrice - _price : ",_price)
            case 'STAFF':
                _promoPrice = (_slot.displayPrices ? _slot.displayPrices.STAFF : '');
                _price = (_slot.originalPrices && _slot.originalPrices.STAFF ? _slot.originalPrices.STAFF : (_slot.displayPrices ? _slot.displayPrices.STAFF : ''));
                break;
            case 'ARMY':
                _promoPrice = (_slot.displayPrices ? _slot.displayPrices.ARMY : '');
                _price = (_slot.originalPrices && _slot.originalPrices.ARMY ? _slot.originalPrices.ARMY : (_slot.displayPrices ? _slot.displayPrices.ARMY : ''));
                break;
            case 'SENIOR':
                _promoPrice = (_slot.displayPrices ? _slot.displayPrices.SENIOR : '');
                _price = (_slot.originalPrices && _slot.originalPrices.SENIOR ? _slot.originalPrices.SENIOR : (_slot.displayPrices ? _slot.displayPrices.SENIOR : ''));
                break;
            case 'WOMAN':
                _promoPrice = (_slot.displayPrices ? _slot.displayPrices.WOMAN : '');
                _price = (_slot.originalPrices && _slot.originalPrices.WOMAN ? _slot.originalPrices.WOMAN : (_slot.displayPrices ? _slot.displayPrices.WOMAN : ''));
                break;
            case 'LADIES':
                _promoPrice = (_slot.displayPrices ? _slot.displayPrices.LADIES : '');
                _price = (_slot.originalPrices && _slot.originalPrices.LADIES ? _slot.originalPrices.LADIES : (_slot.displayPrices ? _slot.displayPrices.LADIES : ''));
                break;
            case 'MEMBER':
                _promoPrice = (_slot.displayPrices ? _slot.displayPrices.MEMBER : '');
                _price = (_slot.originalPrices && _slot.originalPrices.MEMBER ? _slot.originalPrices.MEMBER : (_slot.displayPrices ? _slot.displayPrices.MEMBER : ''));
                break;
                
            case 'TMEMBER':
                _promoPrice = (_slot.displayPrices ? _slot.displayPrices.TMEMBER : '');
                _price = (_slot.originalPrices && _slot.originalPrices.TMEMBER ? _slot.originalPrices.TMEMBER : (_slot.displayPrices ? _slot.displayPrices.TMEMBER : ''));
                break;
            case 'GOVT':
                _promoPrice = (_slot.displayPrices ? _slot.displayPrices.GOVT : '');
                _price = (_slot.originalPrices && _slot.originalPrices.GOVT ? _slot.originalPrices.GOVT : (_slot.displayPrices ? _slot.displayPrices.GOVT : ''));
                break;
            case 'GUEST':
                _promoPrice = (_slot.displayPrices ? _slot.displayPrices.GUEST : '');
                _price = (_slot.originalPrices && _slot.originalPrices.GUEST ? _slot.originalPrices.GUEST : (_slot.displayPrices ? _slot.displayPrices.GUEST : ''));
                break;
            case 'JUNIOR':
                _promoPrice = (_slot.displayPrices ? _slot.displayPrices.JUNIOR : '');
                _price = (_slot.originalPrices && _slot.originalPrices.JUNIOR ? _slot.originalPrices.JUNIOR : (_slot.displayPrices ? _slot.displayPrices.JUNIOR : ''));
                break;
            case 'POLICE':
                _promoPrice = (_slot.displayPrices ? _slot.displayPrices.POLICE : '');
                _price = (_slot.originalPrices && _slot.originalPrices.POLICE ? _slot.originalPrices.POLICE : (_slot.displayPrices ? _slot.displayPrices.POLICE : ''));
                break;

        }
        _price = _price===''||!_price?_price:this.numberWithCommas(_price);
        _promoPrice = _promoPrice===''||!_promoPrice?_promoPrice:this.numberWithCommas(_promoPrice);

        let _text = '<span class="promo-text">' + _currency + " " + _price + `</span>&nbsp;&nbsp;&nbsp;<span class="promo-price">` + _currency + " " + _promoPrice + "</span>";
        // console.log("prices ", _currency + " " + _price);
        // console.log("prices", _text);
        if (this.isPromo && _promoPrice) return _text;
        else return _currency + " " + _price; //this.numberWithCommas(_price);


        // if (!this.isPromo) return _currency + " " + _price
        // else if(this.isPromo return _text;
    }
    numberWithCommas(x) {
        if(!x) return x;
        else return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    getDisplayPrices(slot: TeeTimeSlotDisplay) {
        // let prices = this.modalCtl.create({

        // })
        let _message = '';
        // for ([key,value] in slot.originalPrices)
        let _openRow = `<div class='row row-price' style='width:100%'>`;
        let _openColLeft = `<div class='column col-price-left' style='text-align:left;width:75%'>`;
        let _openColRight = `<div class='column col-price-right' style='text-align:right;width:25%'>`;
        let _closeCol = `</div>`;
        let _closeRow = `</div>`;
        _message += _openRow;
        (slot.displayPrices.STD ? _message += _openColLeft + "Standard : " + _closeCol + _openColRight + slot.currency.symbol + " " + slot.displayPrices.STD + _closeCol + "<br>" : '');
        _message += _closeRow;
        // _message += _openRow;
        // (slot.displayPrices.MEMBER?_message += _openColLeft + "Member : " + slot.currency.symbol + " " + slot.displayPrices.MEMBER +"<br>":'');
        // _message += _closeRow;
        // _message += _openRow;
        // _message += _closeRow;

        (slot.displayPrices.STAFF ? _message += "Staff : " + slot.currency.symbol + " " + slot.displayPrices.STAFF + "<br>" : '');
        (slot.displayPrices.ARMY ? _message += "Army : " + slot.currency.symbol + " " + slot.displayPrices.ARMY + "<br>" : '');
        (slot.displayPrices.SENIOR ? _message += "Senior : " + slot.currency.symbol + " " + slot.displayPrices.SENIOR + "<br>" : '');
        (slot.displayPrices.WOMAN ? _message += "Woman : " + slot.currency.symbol + " " + slot.displayPrices.WOMAN + "<br>" : '');
        (slot.displayPrices.LADIES ? _message += "Ladies : " + slot.currency.symbol + " " + slot.displayPrices.LADIES + "<br>" : '');
        (slot.displayPrices.POLICE ? _message += "Police : " + slot.currency.symbol + " " + slot.displayPrices.POLICE + "<br>" : '');
        (slot.displayPrices.GOVT ? _message += "Government : " + slot.currency.symbol + " " + slot.displayPrices.GOVT + "<br>" : '');
        (slot.displayPrices.GUEST ? _message += "Guest : " + slot.currency.symbol + " " + slot.displayPrices.GUEST + "<br>" : '');
        // _message += _closeRow;
        let alert = this.alertCtrl.create({
            title: 'Available Packages',
            // subTitle: 'Selected date is '+ _date,
            message: _message, //'Selected date is ' + '<b>' + _date + '</b>',
            buttons: ['Close']
        });
        alert.present();
    }


    onPlayerSelect(slot: number) {
        // if (this.bookingSlot.bookingStatus === 'PaymentFull' && !this.fromClub) {
        if (!this.getAllowUpdatePostPayment() && !this.fromClub) {
            MessageDisplayUtil.showMessageToast('Flight have started. Adding/Removing player is disabled. Please refer to club.',
                this.platform, this.toastCtl, 3000, "bottom")
            return false;
        }

        let playersToExclude = this.bookingSlot.bookingPlayers.filter((p: TeeTimeBookingPlayer)=>{
            return !p.playerRemoved
        });

      //  console.log("on player select - new ", this.teeSlotNew);
      //  console.log("on player select - buggy : ",this.buggyRequired," - caddy : ", this.caddyRequired);
        let _playerSlots = 1;
        if(!this.teeSlotNew) {
            _playerSlots = this.slots.length - (this.bookingSlot?this.bookingSlot.bookingPlayers.length:0);
          //  console.log("club player select : ", _playerSlots, this.slots.length , this.bookingSlot?this.bookingSlot.bookingPlayers.length:' nada ')
        } 
      //  console.log("add member : ", this.fromClub, this.clubInfo, this.clubs, this.teeSlotNew)

        let clubModal = this.modalCtl.create(AddPlayerListPage, {
            openedModal: true,
            playersToExclude: playersToExclude, //this.bookingSlot.bookingPlayers,
            fromClub: this.fromClub,
            maxPlayers: _playerSlots,
            teeSlotNew: this.teeSlotNew,
            forBooking: true,
            clubId: !this.teeSlotNew?this.bookingSlot.clubData.id:this.clubs.club.id
            // gameInfo        : this.gameInfo
        });

        clubModal.onDidDismiss((data) => {
          //  console.log("Data - ", data);
            // if(1) return false;
            // console.log("Data - buggy required", this.buggyRequired);
            // console.log("Data - caddy required", this.caddyRequired);
            if (data) {
                if(!data.playerDetails) data.playerDetails = {};
                data.playerDetails['walking'] = this.buggyRequired ? !this.buggyRequired : true
                data.playerDetails['caddySelectionCriteria'] = {}
                data.playerDetails['caddySelectionCriteria']['caddyRequired'] = this.caddyRequired ? this.caddyRequired : false
            }
            if (data && data.newPlayer && !data.multiPlayers) {

                // this.checkBookingPlayer(data.PlayerDetails).then((playerOk)=>{
                // if(playerOk) 
              //  console.log('new player ', data)
                this.addPlayerToBooking({
                    new: true,
                    playerContact: data.playerContact,
                    playerDetails: data.playerDetails,
                    sequence: slot
                    // id: data.item.

                });
                this.createContact(data.playerDetails);
                if(this.fromClub && !this.teeSlotNew) this.getBookingItemizedBill(false);
                // })

            } else if (data && !data.newPlayer && !data.multiPlayers) {
                // this.checkBookingPlayer(data.item).then((playerOk)=>{
                // if(playerOk) 

              //  console.log('existing player ', data)
                this.addPlayerToBooking({
                    new: false,
                    playerId: data.item.playerId,
                    sequence: slot,
                    playerDetails: data.playerDetails,
                })
                if(this.fromClub && !this.teeSlotNew) this.getBookingItemizedBill(false);
                // })

            } else if (data && !data.newPlayer && data.multiPlayers) {
              //  console.log("add multi players here !", data)
                if(data.item && data.item.length > 0) {
                    let _players = data.item;
                    _players.forEach((p: PlayerInfo, idx: number)=>{
                        this.addPlayerToBooking({
                            new: false,
                            playerId: p.playerId,
                            sequence: slot+idx,
                            playerDetails: data.playerDetails,
                        })
                        if(idx === (_players.length - 1)) this.getBookingItemizedBill(false);
                    })
                }
            } else return false;
            // this.addPlayerToBooking({})
        })

        clubModal.present();

        // if (!this.slotFilled(slot)) {
        //     if (!this.gameInfo.availablePlayers || !this.gameInfo.availablePlayers.length) {
        //         let loading = this.loadingCtl.create({
        //             dismissOnPageChange: false,
        //             showBackdrop       : false
        //         });
        //         // loading.onDidDismiss((friendRequests: PlayerList) => {
        //         //     if (friendRequests) {
        //         //         this.gameInfo.availablePlayers = friendRequests.players;
        //         //         this._openPlayerSelection(slot);
        //         //     }
        //         // });
        //         loading.present().then(() => {
        //             this.friendService.searchFriends("", true)
        //                 .subscribe((friends: PlayerList) => {
        //                     loading.dismiss().then(() => {
        //                         this.gameInfo.availablePlayers = friends.players;
        //                         this._openPlayerSelection(slot);
        //                     });
        //                 }, (error) => {
        //                     loading.dismiss();
        //                 })
        //         });

        //     }
        //     else
        //         this._openPlayerSelection(slot);

        // }
    }

    // private _openPlayerSelection(slot: number) {
    //     let playersToExclude = new Array < PlayerInfo > ();
    //     playersToExclude.push(this.currentPlayer);
    //     playersToExclude.push(...this.otherPlayers);
    //     let clubModal = this.modalCtl.create(NormalGameFriendListPage, {
    //         openedModal: true,
    //         playersToExclude: playersToExclude,
    //         // gameInfo        : this.gameInfo
    //     });
    //     clubModal.onDidDismiss((data: PlayerInfo) => {
    //         //Check whether the club info is passed
    //         if (data) {
    //             let player = JsonService.clone(data);
    //             this.otherPlayers[slot - 2] = player;
    //             if (!this.otherPlayers[slot - 2].handicap) {
    //                 if (this.otherPlayers[slot - 2].gender === 'F')
    //                     this.otherPlayers[slot - 2].handicap = 36
    //                 else this.otherPlayers[slot - 2].handicap = 24
    //             }
    //             // this._gettingCourseHandicap(slot);
    //         }
    //     });
    //     clubModal.present();
    // }

    private _gettingCourseHandicap(slot: number) {
        let idx = slot - 2;
        let teeBox: string;
        let playerId: number;

        let reducedTeebox = this._reducedTeebox();
      //  console.log("###### start ######")
      //  console.log("Slot ", slot, " | idx ", idx)
      //  console.log("all", this.otherPlayers)
        if (slot === 1) console.log("teeboxreduced tbox before player", this.currentPlayer.teeOffFrom)
        else console.log("teeboxreduced tbox before player", this.otherPlayers[idx].teeOffFrom)

      //  console.log("Before Teeboxreduced ", reducedTeebox)
        let _tbox = reducedTeebox
            .filter((t: TeeBox) => {
                if (slot === 1) return this.currentPlayer.teeOffFrom === t.name
                else return this.otherPlayers[idx].teeOffFrom === t.name;
            })
            .map((t: TeeBox) => {
                return t.name
            });

      //  console.log("Teeboxreduced ", _tbox, reducedTeebox)
        if (_tbox.length === 1) {
            if (slot === 1)
                this.currentPlayer.teeOffFrom = String(_tbox)
            else this.otherPlayers[idx].teeOffFrom = String(_tbox)
        } else if (_tbox.length === 0) {
            if (slot === 1)
                this.currentPlayer.teeOffFrom = String(reducedTeebox[0].name)
            else this.otherPlayers[idx].teeOffFrom = String(reducedTeebox[0].name)
        }

        if (slot === 1) {
            playerId = this.currentPlayer.playerId;
            teeBox = this.currentPlayer.teeOffFrom;
        } else {
            playerId = this.otherPlayers[idx].playerId;
            teeBox = this.otherPlayers[idx].teeOffFrom;
        }




      //  console.log("game info : ", this.gameInfo)
      //  console.log("reduced tbox : ", teeBox, reducedTeebox, _tbox)
      //  console.log("###### end ######")

        // playerId = this.gameInfo.players[slot-1].playerId;
        // let teeBox = this.gameInfo.players[slot-1].teeOffFrom;
        let firstNineCourse: number;
        let secondNineCourse: number;
        // console.log("teebox 0", this.gameInfo.players[slot-1].teeOffFrom)
        firstNineCourse = this.gameInfo.courses[0].courseId;
        if (this.gameInfo.courses[1]) secondNineCourse = this.gameInfo.courses[1].courseId;

        let player = this._playerInSlot(slot);
        this.handicapService.getCourseHandicap(playerId, teeBox, firstNineCourse, secondNineCourse)
            .subscribe((handicap: number) => {
              //  console.log("getting course handicap", handicap)
                player.handicap = handicap;
            }, (error) => {

            })
    }

    _playerInSlot(slot: number): PlayerInfo {
        if (slot === 1)
            return this.currentPlayer;
        else if (this.slotFilled(slot)) {
            return this.otherPlayers[slot - 2]
        } else return null;
    }



    _reducedTeebox() {
        let courses: Array < CourseInfo > = this.gameInfo.courses;
        let selCourse: CourseInfo;
        selCourse = courses.reduce((a: CourseInfo, b: CourseInfo): CourseInfo => {
            if (a.teeBoxes.length < b.teeBoxes.length)
                return a
            else return b
        })

        return selCourse.teeBoxes;
    }

    getClubCourseDetails(attribute ? : string) {
        // if(!this.teeSlotNew) console.log(" club course details - bookign slot : ", this.bookingSlot.clubData);
        // else console.log("club course details - clubs 1: ", this.clubs);
      //  console.log("club course details - clubs 2 : ", this.clubs)
      //  console.log("club course details - clubInfo : ", this.clubInfo)
        let _clubName; // = (this.bookingSlot && this.bookingSlot.clubData) ? this.bookingSlot.clubData.name : (this.clubInfo ? this.clubInfo.clubName : (this.clubs ? this.clubs.club.name : ''));
        if(!this.teeSlotNew) {
            if(this.bookingSlot && this.bookingSlot.clubData) _clubName =  this.bookingSlot.clubData.name;
            // else _clubName = this.clubInfo.name
        } else if(this.teeSlotNew) {
            if(this.clubs && this.clubs.club && this.clubs.club.name && !this.fromClub) _clubName =  this.clubs.club.name
            else if(this.clubInfo && !this.fromClub) _clubName = this.clubInfo.clubName
            else if(this.clubInfo && this.fromClub) _clubName = this.clubInfo.clubName
            // else _clubName = this.clubInfo.name
        }
        let _courseName = (this.bookingSlot&&this.bookingSlot.slotAssigned.startCourse)?this.bookingSlot.slotAssigned.startCourse.name:this.teeTimeSlotDisplay.slot.startCourse.name;
        // console.log("getClubCourseDetails - club : ", this.clubInfo, this.clubs, this.bookingSlot)
        // console.log("getClubCourseDetails : ", _clubName, _courseName, this.grpTeeSlotInfo)
        switch (attribute) {
            case 'club':
                return _clubName;
            case 'course':
                return _courseName;
        }
    }

    onBookNow(e) {
        if(!this.allowPlayerUnpaidBooking() && this.playerMaxBooking) {
            let _maxUnpaid = this.playerMaxBooking.maxUnpaidBookings;
            let _totalUnpaid = this.playerMaxBooking.totalUnpaidBookings;
            let _total = this.playerMaxBooking.totalBookings;
            let _message = `You already have <b>`+_maxUnpaid+`</b> or more unpaid bookings, which is the maximum this club allows.`;
            // let _message = `Currently, you have <b>`+ _totalUnpaid + `</br> unpaid bookings.<br>
            // This club's allowed max unpaid bookings is <b>` + _maxUnpaid + `</b>`;

            let alert = this.alertCtrl.create({
                title: 'Maximum Unpaid Bookings Allowed',
                message: _message,
                cssClass: 'booking-error',
                buttons: [
                    // {
                    //     text: 'Not Now',
                    //     role: 'cancel',
                    //     handler: () => {
                    //       //  console.log('Cancel clicked');
                    //     }
                    // },
                    {
                        text: 'Close',
                        handler: () => {
                        }
                    },
                ]
            });
            alert.present();
            return;
        }
        // this.flightService.getRecaptcha('6LcJQM0ZAAAAAGVMmPWu6tTK4JzCj_TvNXm4gOIy')
        // .subscribe((resp)=>{
        //   //  console.log("on book now : ", resp)
        // })
            // e.preventDefault();
            // grecaptcha.ready(function() {
            //   grecaptcha.execute('6LcJQM0ZAAAAAGVMmPWu6tTK4JzCj_TvNXm4gOIy').then(function(token) {
            //       // Add your logic to submit to your backend server here.
            //   });
            // });
        
        // if(1) return false;
        if(this.fromClub && !this.clubBookingPlayers) {
            MessageDisplayUtil.showMessageToast('Please select a player to book',
            this.platform, this.toastCtl, 3000, "bottom")
             return false;
        }
        let _clubName; // = (this.clubInfo ? this.clubInfo.clubName : (this.clubs ? this.clubs.club.name : ''));
        if(!this.teeSlotNew) {
            if(this.bookingSlot && this.bookingSlot.clubData) _clubName =  this.bookingSlot.clubData.name;
            // else _clubName = this.clubInfo.name
        } else if(this.teeSlotNew) {
            if(this.clubs && this.clubs.club) _clubName =  this.clubs.club.name;
            else if(this.clubInfo && !this.fromClub) _clubName = this.clubInfo.clubName;
            else if(this.clubInfo && this.fromClub) _clubName = this.clubInfo.clubName;
            // else _clubName = this.clubInfo.name
        }
        let _teeOffTime = moment(this.teeTimeSlotDisplay.slot.teeOffTime, "HH:mm:ss").format("hh:mm A");
        let _teeOffDate = moment(this.teeTimeSlotDisplay.slot.teeOffDate).format("ddd, DD MMM YYYY")
        let _holdDate = moment(this.teeTimeSlotDisplay.slot.teeOffDate).subtract(1, 'days').format("ddd, DD MMM YYYY");
        // let _Oldmessage = `You have requested to book the following:<br>

        // <br>Club: `+ _clubName + `
        // <br>Date: ` + _teeOffDate  +`
        // <br>Time: ` + _teeOffTime + `<br><br>

        // Your booking will be held until `+ _holdDate +` at `+_teeOffTime+`.<br>
        // You will need to make payment on myGolf2u to secure this booking.<br><br>

        // To confirm your booking Tap Confirm, to cancel tap Not Now.`;

        // let _message = `Club: ` + _clubName + `
        // <br>Date: ` + _teeOffDate + `
        // <br>Time: ` + _teeOffTime + `<br><br>

        // Your booking will be held until <b style="color:green">` + _holdDate + `</b> at <b style="color:green">` + _teeOffTime + `</b>.<br>
        // You will need to make payment on myGolf2u to secure this booking.`;
        let _message = _clubName + `
        <br>Date: ` + _teeOffDate + `
        <br>Time: ` + _teeOffTime + `<br><br>
        
        To avoid cancellation, you will need to make payment before <b style="color:green">` + _holdDate + `</b> at <b style="color:green">` + _teeOffTime + `</b>.<br>`;


        let alert = this.alertCtrl.create({
            title: 'Booking Confirmation',
            message: _message,
            cssClass: 'booking-alert',
            buttons: [
                {
                    text: 'Not Now',
                    role: 'cancel',
                    handler: () => {
                      //  console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Confirm',
                    handler: () => {
                      //  console.log('Buy clicked');
                        this._goBookNow();
                    }
                },
            ]
        });
        alert.present();
    }

    _goBookNow() {
        let _courseId = this.teeTimeSlotDisplay.slot.startCourse.id;
        let _totalPlayers = this.playerReq; //this.teeTimeSlotDisplay.slot.maxPlayers;
        let _teeOffDate = moment(this.teeTimeSlotDisplay.slot.teeOffDate).format("YYYY-MM-DD");
        let _fromTime = moment(this.teeTimeSlotDisplay.slot.teeOffTime, "HH:mm:ss").format("HH:mm");
        let _toTime = moment(this.teeTimeSlotDisplay.slot.teeOffTime, "HH:mm:ss").format("HH:mm");
        let _currDateTime = moment().toISOString(); //format("YYYY-MM-DDTHH:mmZ");
        // this.myTime = moment(this.prs.startTime,"HH:mm:ss").format("YYYY-MM-DDTHH:mmZ");
        // let _ninesPlaying = (this.teeTimeSlotDisplay.slot.eighteenHolesAllowed ? 18 : 9);
        let _ninesPlaying = parseInt(this.holesPlayed);
        let _minPlayers = this.playerReq; //this.teeTimeSlotDisplay.slot.minPlayers;
        let _maxAllowedBuggy = Math.floor(this.playerReq / this.teeTimeSlotDisplay.slot.maxPlayersPerBuggy) + (this.playerReq % this.teeTimeSlotDisplay.slot.maxPlayersPerBuggy)
        let _maxAllowedCaddy = Math.floor(this.playerReq / this.teeTimeSlotDisplay.slot.maxPlayersPerCaddy) + (this.playerReq % this.teeTimeSlotDisplay.slot.maxPlayersPerCaddy)
        let _buggyReq = this.buggyRequired;
        let _caddyReq = this.caddyRequired;

        // console.log("max allowed tee time slot display", this.teeTimeSlotDisplay.slot.maxPlayersPerBuggy, "- ", this.teeTimeSlotDisplay.slot.maxPlayersPerCaddy)
        // console.log("max allowed tee time slot display", Math.floor(this.playerReq/this.teeTimeSlotDisplay.slot.maxPlayersPerBuggy), "- ", this.playerReq%this.teeTimeSlotDisplay.slot.maxPlayersPerBuggy)
        // console.log("max allowed buggy - ", _maxAllowedBuggy, " , caddy - ", _maxAllowedCaddy)


        // moment(this.teeTimeSlotDisplay.slot.teeOffTime).toDate();
        //  moment(this.teeTimeSlotDisplay.slot.teeOffTime,"YYYY-MM-DDTHH:mm:ssZ").format("HH:mm");//moment(this.teeTimeSlotDisplay.slot.teeOffTime).toDate(); //moment(this.teeTimeSlotDisplay.slot.teeOffTime);
        let _toHour = parseInt(moment(_fromTime).format("HH"))
        let _toMinute = parseInt(moment(_fromTime).format("mm"));


        let _bookingName;
        let _bookingEmail;
        let _bookingPhone;

        // console.log("go book now : ", _teeOffDate, _fromTime, this.teeTimeSlotDisplay.slot.teeOffTime, _toTime)

        // .format("YYYY-MM-DDTHH:mmZ")
        // moment(this.teeTime,"YYYY-MM-DDTHH:mm:ssZ").format("HH:mm");
      //  console.log("club booking players : ", this.clubBookingPlayers)
        if(this.fromClub) {
            _bookingName = this.clubBookingPlayers.playerName;
            _bookingEmail = this.clubBookingPlayers.email;
            _bookingPhone = this.clubBookingPlayers.phone;
            // this.clubBookingPlayers && this.clubBookingPlayers.address.phone1?this.clubBookingPlayers.address.phone1:
            // _bookingName = 'club testing';
            // _bookingEmail = 'chrono.shindou@gmail.com';
            // _bookingPhone = '60172372725';
        } else {
            this.playerHomeInfo$ = this.playerHomeService.playerHomeInfo();
            this.player$ = this.playerHomeInfo$
                .filter(Boolean)
                .map((playerHome: PlayerHomeInfo) => playerHome.player);
            this.player$.take(1).subscribe((player: PlayerInfo) => {
                _bookingName = player.playerName;
                _bookingEmail = player.email;
                _bookingPhone = player.phone;
                // this.currentPlayerId = player.playerId
            });
        }
        

        let reqBookSlot = {
            "courseId": _courseId,
            "teeOffDate": _teeOffDate,
            "teeOffTimeFrom": _fromTime,
            // "teeOffTimeFrom": {
            //     "hour": _toHour,
            //     "minute": _toMinute,
            //     "second": 0,
            //     "nano":0
            // },
            "teeOffTimeTo": _toTime,
            "totalPlayers": _totalPlayers,
            "buggyRequired": _buggyReq ? _maxAllowedBuggy : 0,
            "caddiesRequired": _caddyReq ? _maxAllowedCaddy : 0,
            "ninesPlaying": _ninesPlaying,
            "bookingName": _bookingName,
            "bookingEmail": _bookingEmail,
            "bookingPhone": _bookingPhone,
            "bookingRequestedAt": null,
            "addBookingPlayer": this.fromClub?true:!this.bookForOther
        }

        // console.log("current date time", _currDateTime, moment().format("YYYY-MM-DDTHH:mmZ"), moment().format("YYYY-MM-DDTHH:mmz"), moment(),
        // moment().toISOString())
        if(this.fromClub) {
            // this.fromClub
            this.flightService.clubBookingSlot(reqBookSlot, true, this.captchaResponse)
            // , !this.bookForOther
            .subscribe((data: any) => {
              //  console.log("response from book time slot", data)
                let _message = `Before making payment you will need to add players and complete all mandatory options.`
                if (data.status === 200) {
                    let _booking: TeeTimeBooking = data.json();
                    this.afterBook = true;
                                    
                    this.nav.pop().then(()=>{
                        this.nav.push(BookingDetailsPage, {
                            teeSlotNew: false,
                            teeTimeSlotDisplay: this.teeTimeSlotDisplay,
                            bookingSlot: _booking,
                            clubInfo: _booking.clubData,
                            fromClub: true,
                            needRefresh: true,
                            currSession: this.currSession,
                        });
                    })
                    // let alert = this.alertCtrl.create({
                    //     title: 'Club Booking In Progress',
                    //     // subTitle: 'Selected date is '+ _date,
                    //     message: _message, //'Selected date is ' + '<b>' + _date + '</b>',
                    //     // buttons: ['Close']
                    //     buttons: [
                    //         {
                    //             text: 'Close',
                    //             handler: () => {
                    //               //  console.log('Club Booking closed', _booking);
                    //                 // this.nav.getPrevious().data.cancelBooking = true;
                    //                 this.afterBook = true;
                                    
                    //                 this.nav.pop().then(()=>{
                    //                     this.nav.push(BookingDetailsPage, {
                    //                         teeSlotNew: false,
                    //                         teeTimeSlotDisplay: this.teeTimeSlotDisplay,
                    //                         bookingSlot: _booking,
                    //                         clubInfo: _booking.clubData,
                    //                         fromClub: true,
                    //                         needRefresh: true,
                    //                         currSession: this.currSession,
                    //                     });
                    //                 })
                                    
                    //             }
                    //         }
                    //     ]
                    // });
                    // alert.present();
                } else {
                    // let _error = error.json();
                  //  console.log("book a slot - error : ", data);
                    let alert = this.alertCtrl.create({
                        title: 'Ooops', //_error.error,
                        // subTitle: 'Selected date is '+ _date,
                        message: 'Something has happened, please try again.', //'Selected date is ' + '<b>' + _date + '</b>',
                        buttons: ['Close']
                    });
                    alert.present();
                    this.captchaResponse = null;
                }

            }, (error)=>{
                let _error = error.json();
                this.captchaResponse = null;
                let _msg = _error&&_error.errors&&_error.errors.length>0?_error.errors[0]:_error.error;
                if(!_error.status) {
                  //  console.log("book a slot - player error : ", _error, error);
                    let alert = this.alertCtrl.create({
                        title: 'Ooops', //_error.error,
                        // subTitle: 'Selected date is '+ _date,
                        message: 'Something has happened, please try again.', //'Selected date is ' + '<b>' + _date + '</b>',
                        
                        buttons: ['Close']
                    });
                    alert.present();
                } else {
                  //  console.log("book a slot - player error else : ", _error, error);
                    let alert = this.alertCtrl.create({
                        title: 'Ooops',
                        // subTitle: 'Selected date is '+ _date,
                        message: _msg, //'Selected date is ' + '<b>' + _date + '</b>',
                        
                        buttons: ['Close']
                    });
                    alert.present();
                }
            })
        } else {
            this.flightService.bookTeeTimeSlot(reqBookSlot, !this.bookForOther, this.captchaResponse)
            .subscribe((data: any) => {
              //  console.log("response from book time slot", data)
                let _message = `Thank you for booking with myGolf2u.<br> Please see 'My Bookings' for details.<br>
            Before making payment you will need to add players and complete all mandatory options.`;
            let _title = 'Booking In Process';
            let _okTxt = 'Go to My Bookings';
            if(this.appAttribute && this.appAttribute.bookingRequest) {
                let _bookingRequest = this.appAttribute.bookingRequest
                _message = _bookingRequest.message;
                _title = _bookingRequest.title;
                _okTxt = _bookingRequest.Ok
            }
                if (data.status === 200) {
                    let _buttons = [];
                    if(this.fromClub) {
                        _buttons = [{
                            text: 'Close',
                            handler: () => {
                              //  console.log('Close clicked');
                                // this.nav.getPrevious().data.cancelBooking = true;
                                this.afterBook = true;
                                this.nav.pop()
                            }
                        }]
                    } else {
                        _buttons = [
                        {
                            text: 'Close',
                            handler: () => {
                              //  console.log('Close clicked');
                                // this.nav.getPrevious().data.cancelBooking = true;
                                this.afterBook = true;
                                this.nav.pop()
                            }
                        },
                        {
                        text: _okTxt,
                        // role: 'cancel',
                        handler: () => {
                            this.nav.push(BookingHomePage, {
                                fromBookNow: true,
                                userType: 'player'
                            })
                            // console.log('Cancel clicked');
                          }
                        },
                    ]
                    }
                    let alert = this.alertCtrl.create({
                        title: _title,
                        // subTitle: 'Selected date is '+ _date,
                        message: _message, //'Selected date is ' + '<b>' + _date + '</b>',
                        // buttons: ['Close']
                        
                        buttons: _buttons
                    });
                    alert.present();
                } else {
                    // let _error = error.json();
                    this.captchaResponse = null;
                  //  console.log("book a slot - error : ", data);
                    let alert = this.alertCtrl.create({
                        title: 'Ooops', //_error.error,
                        // subTitle: 'Selected date is '+ _date,
                        message: 'Something has happened, please try again.', //'Selected date is ' + '<b>' + _date + '</b>',
                        
                        buttons: ['Close']
                    });
                    alert.present();
                }

            }, (error)=>{
                let _error = error.json();
                this.captchaResponse = null;
                if(!error.status) {
                  //  console.log("book a slot - player error : ", error);
                    let alert = this.alertCtrl.create({
                        title: 'Ooops', //_error.error,
                        // subTitle: 'Selected date is '+ _date,
                        message: 'Something has happened, please try again.', //'Selected date is ' + '<b>' + _date + '</b>',
                        
                        buttons: ['Close']
                    });
                    alert.present();
                } else {
                  //  console.log("book a slot - player error : ", error);
                    let alert = this.alertCtrl.create({
                        title: 'Ooops',
                        // subTitle: 'Selected date is '+ _date,
                        message: _error&&_error.errors[0]?_error.errors[0]:'Something has happened, please try again.', //'Selected date is ' + '<b>' + _date + '</b>',
                        
                        buttons: ['Close']
                    });
                    alert.present();
                }
                
            });
        }
        
    }

    togglePrices() {
        this.displayPrices = !this.displayPrices;
      //  console.log("toggle prices from club", this.fromClub)
      //  console.log("toggle prices from club", this.teeSlotNew, this.displayPrices)
        if(!this.teeSlotNew && this.displayPrices) {
            // if(!this.fromClub || this.fromClub === null) this.getActiveClubDiscounts();
            // else if(this.fromClub) this.getApplicableDiscountsForPlayer();
            // else this.getActiveClubDiscounts();
            if(!this.fromClub) this.getCurrentPlayerVoucher();
            if(!this.fromClub) this.getPendingPlayerDiscountCard();
            this.getActiveClubDiscounts();
            this.getPlayerVoucherSeries();
        } else if(this.teeSlotNew && this.displayPrices) {
            // if(!this.fromClub || this.fromClub === null) this.getActiveClubDiscounts();
            // else if(this.fromClub) this.getApplicableDiscountsForPlayer();
            // else this.getActiveClubDiscounts();
            if(!this.fromClub) this.getCurrentPlayerVoucher();
            if(!this.fromClub) this.getPendingPlayerDiscountCard();
            this.getActiveClubDiscounts();
            this.getPlayerVoucherSeries();
        }
      //  console.log("display prices ? : ", this.promoPrices, this.prices)
    }

    getProperTime(time) {
        return moment(time, "HH:mm:ss").format('hh:mm A');
    }

    getBookingDetails(attribute ? : string) {
        let _statusText = '';
        if (attribute === 'status') {

            let _bookingStatus = this.bookingSlot.bookingStatus;
            if (_bookingStatus === 'Booked') _statusText = 'Booked';
            else if (_bookingStatus === 'PaymentFull') _statusText = 'Paid in Full';
            else if (_bookingStatus === 'PaymentPartial') _statusText = 'Partially Paid'; 
            else _statusText = _bookingStatus ? _bookingStatus : '';
        }
        switch (attribute) {
            case 'reference':
                return "#" + this.bookingSlot.bookingReference;
            case 'price':
                return this.bookingSlot.amountPayable - this.bookingSlot.totalDeductions;
            case 'currency':
                return this.bookingSlot.slotAssigned.currency.symbol;
            case 'status':
                return _statusText;
            case 'bookedOn':
                return moment(this.bookingSlot.bookingCreatedAt,'YYYY-MM-DDTHH:mm:ss').format("ddd, DD MMM 'YY hh:mm A");
        }
    }

    minMax(items) {
        return items.reduce((acc, val) => {
            acc[0] = (acc[0] === undefined || val < acc[0]) ? val : acc[0]
            acc[1] = (acc[1] === undefined || val > acc[1]) ? val : acc[1]
            return acc;
        }, []);
    }

    refreshBookingDetails(refreshBill ? : boolean) {
        this.playersBalance = 0;
        if (!this.teeSlotNew) this.checkClubBookingOption();
        let loader = this.loadingCtrl.create({
            showBackdrop: false,
            duration: 5000,
            content: 'Refreshing booking...'
        });
        let _bookingId = this.bookingSlot.id;

        // if(1===1) loader.dismiss().then(()=>{ console.log("block refresh"); return false;})
        // this.caddySlots = [];
      //  console.log("After block refresh")
        loader.present().then(() => {

            this.flightService.getBookingById(this.bookingSlot.id)
                .subscribe((bookingByPlayer: TeeTimeBooking) => {
                    loader.dismiss().then(() => {
                        if (bookingByPlayer) {
                            this.paymentClickedBoolean = false;

                            this.buggyCaddyPreference = {};
                            this.buggyCaddyPreference.bookingId = bookingByPlayer.id;
                            this.buggyCaddyPreference.playerPairings = [{
                                bookingPlayerId: 0,
                                buggyRequired: true,
                                buggyPairing: 0,
                                driving: false,
                                caddiePreferred: 0,
                                caddieAssigned: 0,
                                caddyPairing: 0,
                                caddyPreferred: {},
                                caddyAssigned: {},
                                caddyRequired: true,
                            }];

                            // this.bookingSlot = {};
                            this.bookingSlot = bookingByPlayer;
                            this.bookingSlot.bookingPlayers = (this.bookingSlot)?this.bookingSlot.bookingPlayers:null;
                          //  console.log("Refreshing booking slot : ", this.bookingSlot);

                            this.assignmentDone = this.bookingSlot.assignmentDone;

                            this.removedPlayers = this.bookingSlot.bookingPlayers.filter((p)=>{
                                return p.playerRemoved;
                            })  
                            this.bookingSlot.bookingPlayers = this.bookingSlot.bookingPlayers.filter((p)=>{
                                return !p.playerRemoved
                            });
                          //  console.log("Refreshing booking players : ", this.bookingSlot.bookingPlayers)
                            this.bookingSlot.bookingPlayers.sort((a, b) => {
                                if (a.sequence < b.sequence)
                                    return -1;
                                else if (a.sequence > b.sequence)
                                    return 1;
                                else 0;
                            });

                            // if(this.bookingSlot.bookingPlayers && this.bookingSlot.bookingPlayers.length > 0) {
                            //     this.bookingSlot.bookingPlayers = this.bookingSlot.bookingPlayers.sort((a,b) => {
                            //         if(!a.playerRemoved && b.playerRemoved) return -1
                            //         else if(a.playerRemoved && !b.playerRemoved) return 1
                            //         else return 0
                            //     })
                            // }; 

                            let _eighteenHoles = this.bookingSlot.slotAssigned.eighteenHolesAllowed;
                            let _nineHoles = this.bookingSlot.slotAssigned.nineHolesAllowed;
                            if(_eighteenHoles && _nineHoles) {
                                this.holesPlayed = "2";
                                this.eighteenHolesAllowed = true;
                                this.nineHolesAllowed = true;
                            } 
                            else if(!_eighteenHoles && _nineHoles) {
                                this.holesPlayed = "1";
                            }
                            else if(_eighteenHoles && !_nineHoles) {
                                this.holesPlayed = "2";
                                this.eighteenHolesAllowed = true;
                                this.nineHolesAllowed = false;
                            } else if(!_eighteenHoles && !_nineHoles) {
                                this.holesPlayed = "1";
                                this.eighteenHolesAllowed = false;
                                this.nineHolesAllowed = false;
                            }



                            this.bookingSlot.bookingPlayers.forEach((p, i) => {
                                let _caddyPairing = 0;
                                // this.caddyPairing = [];
                                // this.caddyPairing[0] = {
                                //     caddyPairing: 0,
                                //     caddyPreferred: null
                                // }
                                if (p.caddyPairing > 0) {
                                    _caddyPairing = p.caddyPairing; // - 1
                                    if (!this.caddyPairing[_caddyPairing]) {
                                        // && p.caddyPreferred
                                        this.caddyPairing[_caddyPairing] = {
                                            caddyPreferred: p.caddyPreferred,
                                            caddyPairing: p.caddyPairing,
                                            caddySelectionCriteria: p.caddySelectionCriteria ? p.caddySelectionCriteria : null,
                                            caddyAssigned: p.caddyAssigned ? p.caddyAssigned: null,
                                            caddyRequired: p.caddyPairing > 0?true:false,
                                        }
                                    }
                                    if (!this.caddySlots[_caddyPairing]) {
                                        // && p.caddyPreferred
                                        this.caddySlots[_caddyPairing] = {
                                            caddyPairing: p.caddyPairing ? p.caddyPairing : 0,
                                            caddyPreferred: p.caddyPreferred ? p.caddyPreferred : null,
                                            caddySelectionCriteria: p.caddySelectionCriteria ? p.caddySelectionCriteria : null,
                                            caddyAssigned: p.caddyAssigned ? p.caddyAssigned: null,
                                            caddyRequired: p.caddyPairing > 0?true:false,
                                        }
                                    }

                                }

                                // console.log("refresh caddy slots - ", this.caddySlots);
                                // console.log("refresh caddy pairing - ", this.caddyPairing);
                                this.buggyCaddyPreference.playerPairings.push(Object.assign({}, this.buggyCaddyPreference[i], {
                                    bookingPlayerId: p.id,
                                    buggyRequired: p.pairingNo !== 0 ? true : false,
                                    buggyPairing: p.pairingNo,
                                    driving: p.driving,
                                    caddiePreferred: p.caddyPreferred && p.caddyPreferred.id ? p.caddyPreferred.id : null,
                                    caddieAssigned: p.caddyAssigned && p.caddyAssigned.id? p.caddyAssigned.id: null,
                                    caddyPairing: p.caddyPairing,
                                    caddyPreferred: p.caddyPreferred,
                                    caddyAssigned: p.caddyAssigned,
                                    assignedBuggy: p.buggyId,
                                    caddyRequired: p.caddyPairing > 0 ? true:false,
                                }))

                                if(this.fromClub && p.player && p.player.id) this.getPlayersCredits(999, p.player.id);
                            });

                            if(!this.fromClub) this.getPlayersCredits(999, this.currentPlayerId);
                            this.uniqBuggy = this.getUnique(this.bookingSlot.bookingPlayers, 'pairingNo');
                            this.uniqBuggy = this.uniqBuggy.filter((ub)=>{
                                return ub.pairingNo > 0
                            })
                            this.uniqCaddy = this.getUnique(this.bookingSlot.bookingPlayers, 'caddyPairing');
                            this.uniqCaddy = this.uniqCaddy.filter((uc)=>{
                                return uc.caddyPairing > 0
                            })
                            if (this.uniqBuggy) this.buggyReq = this.uniqBuggy.length;
                            if (this.uniqCaddy) this.caddyReq = this.uniqCaddy.length;

                            this.buggyCaddyPreference.playerPairings.shift();
                            this.buggyCaddyPreference.ignoreBuggyUpdate = true;
                            this.buggyCaddyPreference.ignoreCaddieUpdate = true;
                            this.newBuggyCaddyPreference = JSON.parse(JSON.stringify(this.buggyCaddyPreference));

                            // this.depositAmount = this.bookingSlot.depositPayable?this.bookingSlot.depositPayable:this.bookingOptions?this.getDepositAmount():0;
                            this.paymentStatus = this.bookingSlot.bookingStatus === 'PaymentFull' ? 'Paid' : 'Pending';
                            if(this.bookingSlot.bookingDiscounts && this.bookingSlot.bookingDiscounts.length > 0) 
                                this.bookingDiscounts = this.bookingSlot.bookingDiscounts.filter((d: TeeTimeBookingDiscount)=>{
                                    if(d.voucherApplied) return d.voucherApplied.redeemed
                                });
                            else this.bookingDiscounts = [];
                            
                          //  console.log("buggy preference - refresh ", this.buggyCaddyPreference)
                            if (refreshBill) this.getBookingItemizedBill(false);

                            // this.buggyRequired = this.bookingSlot.buggyRequested===0?false:true;
                            // this.caddyRequired = this.bookingSlot.caddyRequested===0?false:true;

                            // this.bookingSlot.bookingPlayers.sort((a, b) => {
                            //     if (a.sequence < b.sequence)
                            //         return -1;
                            //     else if (a.sequence > b.sequence)
                            //         return 1;
                            //     else 0;
                            // })
                            if(bookingByPlayer.amountPaid > 0) this.getBookingItemizedBill(false)
                            
                            this.buggyRequired = this.bookingSlot.buggyRequested === 0 ? false : true;
                            this.caddyRequired = this.bookingSlot.caddyRequested === 0 ? false : true;
                        }
                    })
                }, (error) => {
                    loader.dismiss();
                })



            // this.flightService.getBookingByPlayer(this.currentPlayerId, moment().format("YYYY-MM-DD"))
            // .subscribe((bookingByPlayerList: Array < TeeTimeBooking > ) => {
            //     loader.dismiss().then(()=>{
            //         if(bookingByPlayerList && bookingByPlayerList.length > 0) {
            //           //  console.log("get booking by player - data", bookingByPlayerList);
            //             this.bookingSlot = bookingByPlayerList
            //             .filter((tb: TeeTimeBooking) => {
            //                 return tb.id === _bookingId;
            //             })[0];

            //           //  console.log("get booking by player - data", this.bookingSlot);

            //       //  console.log("booking players sort before : ", this.bookingSlot.bookingPlayers)


            //         if(this.bookingSlot && this.bookingSlot.bookingPlayers.length > 0) {
            //             this.bookingSlot.bookingPlayers.forEach((p,i) =>{
            //                 let _caddyPairing = 0;
            //                 if(p.caddyPairing > 0) {
            //                     _caddyPairing = p.caddyPairing - 1
            //                     if(!this.caddyPairing[_caddyPairing] && p.caddyPreferred) {
            //                         this.caddyPairing[_caddyPairing] = {
            //                             caddyPreferred: p.caddyPreferred,
            //                             caddyPairing: p.caddyPairing
            //                         }
            //                     } 
            //                     if(!this.caddySlots[_caddyPairing] && p.caddyPreferred) {
            //                         this.caddySlots[_caddyPairing] = {
            //                             caddyPairing: p.caddyPairing?p.caddyPairing:0,
            //                             caddyPreferred: p.caddyPreferred?p.caddyPreferred:null,
            //                         }
            //                     }

            //                 }
            //             })
            //             this.bookingSlot.bookingPlayers.sort((a, b) => {
            //                 if (a.sequence < b.sequence)
            //                     return -1;
            //                 else if (a.sequence > b.sequence)
            //                     return 1;
            //                 else 0;
            //             })
            //             // console.log("before get booking player", this.bookingSlot);
            //             // this.getBookingPlayers(this.bookingSlot);
            //             // .then((b)=>{
            //             // console.log("inside get booking player",b)
            //             //     this.bookingSlot.bookingPlayers = b

            //             // });

            //             // this.caddyPairing = [];
            //             // this.bookingSlot.bookingPlayers.forEach((p,i) =>{
            //             //     this.caddyPairing[i] = {
            //             //         caddyPreferred: p.caddyPreferred?p.caddyPreferred:null,
            //             //         caddyPairing: p.caddyPairing?p.caddyPairing:0
            //             //     }
            //             //     // this.caddySlots[i] = {
            //             //     //     caddyPairing: p.caddyPairing?p.caddyPairing:0,
            //             //     //     caddyPreferred: p.caddyPreferred?p.caddyPreferred:null,
            //             //     // }
            //             // })
            //         }
            //         // this.setCaddyPairings();
            //       //  console.log("booking players sort after : ", this.bookingSlot.bookingPlayers);
            //       //  console.log("booking players sort after caddy pairing : ", this.caddyPairing);

            //         }

            //     })


            // }, (error) => {
            //     loader.dismiss();
            // })
        })

    }


    checkBookingPlayer(playerInfo ? : any): Promise < boolean > {
        let _playerOk: boolean;
        return new Promise < any > (resolve => {
            this.bookingSlot.bookingPlayers.forEach((tbp: TeeTimeBookingPlayer) => {
              //  console.log("checkbookingplayer booking players : ", tbp);
              //  console.log("checkbookingplayer playerinfo : ", playerInfo);
                if (tbp.player && tbp.player.id === playerInfo.id) {

                    _playerOk = false;
                    let alert = this.alertCtrl.create({
                        // title: 'Remove Player',
                        // subTitle: 'Selected date is '+ _date,
                        message: 'Player is already in the flight', //'Selected date is ' + '<b>' + _date + '</b>',
                        buttons: ['Close']
                        // buttons: [{
                        //         text: 'Close',
                        //         handler: () => {
                        //             // console.log('Cancel clicked');
                        //         }
                        //     }
                        // ]
                    });
                    alert.present();
                } else _playerOk = true;

            })
          //  console.log("checkbookingplayer promise resolve : ", _playerOk)
            resolve(_playerOk)
        })
        // return _playerOk;
    }

    // checkBookingPlayer(playerInfo?: any) {
    //     let _playerOk: boolean;
    //     let _check = new Promise<boolean>((resolve,reject) =>{
    //         this.bookingSlot.bookingPlayers.filter((tbp: TeeTimeBookingPlayer)=>{
    //       //  console.log("checkbookingplayer booking players : ", tbp);
    //       //  console.log("checkbookingplayer playerinfo : ", playerInfo);
    //         if(tbp.player && tbp.player.id === playerInfo.id) {

    //             _playerOk = false;
    //             let alert = this.alertCtrl.create({
    //                 // title: 'Remove Player',
    //                 // subTitle: 'Selected date is '+ _date,
    //                 message: 'Player is already in the flight', //'Selected date is ' + '<b>' + _date + '</b>',
    //                 buttons: ['Close'] 
    //                 // buttons: [{
    //                 //         text: 'Close',
    //                 //         handler: () => {
    //                 //             // console.log('Cancel clicked');
    //                 //         }
    //                 //     }
    //                 // ]
    //             });
    //             alert.present();
    //             // resolve(_playerOk);
    //         } else {
    //             _playerOk = true;
    //             // resolve(_playerOk);
    //         }
    //         resolve(_playerOk);

    //     })
    //     return _playerOk;
    // })
    // console.log("checkbookingplayer promise resolve : ", _playerOk, _check)
    //     // return _check;
    // }


    addPlayerToBooking(playerInfo ? : any, sequence ? : string) {
        this.updatingPlayer = true;
        // if(1===1) {

        // console.log("add player booking :", playerInfo)
        // this.bookingSlot.bookingPlayers.filter((tbp: TeeTimeBookingPlayer)=>{
        //     if(tbp.player.id === playerInfo.playerId) {
        //         let alert = this.alertCtrl.create({
        //             // title: 'Remove Player',
        //             // subTitle: 'Selected date is '+ _date,
        //             message: 'Player is already in the flight', //'Selected date is ' + '<b>' + _date + '</b>',
        //             buttons: ['Close'] 
        //             // buttons: [{
        //             //         text: 'Close',
        //             //         handler: () => {
        //             //             return false;
        //             //             // console.log('Cancel clicked');
        //             //         }
        //             //     }
        //             // ]
        //         });
        //         alert.present();
        //         return false;
        //     }

        // })

        // }
        let loader = this.loadingCtrl.create({
            showBackdrop: false,
            duration: 5000,
            content: 'Player found. Adding player...'
        });
      //  console.log("booking details - add player : ", playerInfo)
        let _sequence = playerInfo ? playerInfo.sequence : null; //sequence?sequence:'';
        // let _isNew = playerInfo.new;
        let _bookingId = this.bookingSlot.id;
        // let _playerId = (playerInfo.new)?'':playerInfo.id;
        let _playerInfo = playerInfo;
        let _currentPlayerId;

        // let _addPlayer = {
        //     newPlayer : _isNew,

        // }

        loader.present().then(() => {
            this.flightService.addPlayerToBooking(_bookingId, _playerInfo, _sequence)
                .subscribe((data: any) => {

                    if (data.status === 200) {
                        loader.dismiss().then(() => {
                            let _bookingSlot = data.json();
                            if(_bookingSlot.bookingStatus.toLowerCase() === 'paymentpartial' || _bookingSlot.bookingStatus.toLowerCase() === 'paymentfull') {
                                // this.onProcessAssignment();
                                // if(this.assignmentDone)
                                if(this.bookingType !== 'past') this.recalculateBookingPricing();
                                this.getBookingItemizedBill(true);

                            }
                            else this.refreshBookingObject(data.json());
                            // this.refreshBookingDetails();
                        })
                        //     this.flightService.getBookingByPlayer(this.currentPlayerId, moment().format("YYYY-MM-DD"))
                        //         .subscribe((bookingByPlayerList: Array < TeeTimeBooking > ) => {
                        //             loader.dismiss().then(()=>{
                        //                 this.bookingSlot = bookingByPlayerList
                        //                 .filter((tb: TeeTimeBooking) => {
                        //                     return tb.id === _bookingId;
                        //                 })[0];

                        //             this.bookingSlot.bookingPlayers = this.bookingSlot.bookingPlayers;
                        //             this.bookingSlot.bookingPlayers.sort((a, b) => {
                        //                 if (a.sequence < b.sequence)
                        //                     return -1;
                        //                 else if (a.sequence > b.sequence)
                        //                     return 1;
                        //                 else 0;
                        //             })
                        //             })
                        //         }, (error) => {
                        //             loader.dismiss();
                        //         })
                    }
                  //  console.log("gets back from add player", data)
                }, (error) => {

                })
        })

    }

    getPlayerType(player: TeeTimeBookingPlayer) {
        if (player.playerType) return 'Player type here';
    }

    onDeleteBookingPlayer(slot: number) {
        if (!this.getAllowUpdatePostPayment() && !this.fromClub) {
            // if (this.bookingSlot.bookingStatus === 'PaymentFull') {
            MessageDisplayUtil.showMessageToast('Flight have started. Adding/Removing player is disabled.',
                this.platform, this.toastCtl, 3000, "bottom")
            return false;
        }
        if (this.bookingSlot.bookingPlayers && this.bookingSlot.bookingPlayers.length === 1) {
            MessageDisplayUtil.showMessageToast('Please add one or more players to the booking before removing this player.',
                this.platform, this.toastCtl, 3000, "bottom")
            return false;
        }
        let idx = slot - 1;
        let player = this.bookingSlot.bookingPlayers[idx];
        // player: TeeTimeBookingPlayer
        // console.log("on deleting player : ", player)
        let alert = this.alertCtrl.create({
            title: 'Remove Player',
            // subTitle: 'Selected date is '+ _date,
            message: 'Removing selected player from booking. Do you want to proceed?', //'Selected date is ' + '<b>' + _date + '</b>',
            // buttons: ['Close']
            buttons: [
                {
                    text: 'Close',
                },{
                    text: 'Remove player',
                    handler: () => {
                        this.deleteBookingPlayer(player);
                        // console.log('Cancel clicked');
                    }
                },
            ]
        });
        alert.present();
    }

    deleteBookingPlayer(player: TeeTimeBookingPlayer) {
        let loader = this.loadingCtrl.create({
            showBackdrop: false,
            duration: 5000,
            content: 'Removing player...'
        });

        this.updatingPlayer = true;
      //  console.log("deleting player : ", player)
        let _bookingPlayerId = player.id;
        let _bookingId = this.bookingSlot.id;
        loader.present().then(() => {
            this.flightService.deletePlayerFromBooking(_bookingPlayerId)
                .subscribe((data: any) => {
                    loader.dismiss().then(() => {
                      //  console.log("delete booking player : ", _bookingPlayerId, data)
                        if (data) {
                            let _booking: TeeTimeBooking = data.json()
                            let _isBookingPlayer;
                            _isBookingPlayer = _booking.bookingPlayers.filter((p: TeeTimeBookingPlayer) => {
                                if(p.player) return p.player.id === this.currentPlayerId
                                else return false;
                            })
                            // console.log('deleting player 1 ', _booking)
                            // console.log('deleting player 2', _isBookingPlayer)
                            // console.log('deleting player 3 current player', this.currentPlayerId)
                            // if(_booking.bookedByPlayer && (_booking.bookedByPlayer.id !== this.currentPlayerId) && (_isBookingPlayer && _isBookingPlayer.length === 0 || !_isBookingPlayer)) {
                            //     this.nav.pop();
                            // }
                            if(_booking.bookingStatus.toLowerCase() === 'paymentpartial' || _booking.bookingStatus.toLowerCase() === 'paymentfull') {
                                // this.onProcessAssignment();
                                this.getBookingItemizedBill(true);
                                if(this.bookingType !== 'past') this.recalculateBookingPricing();
                            }
                            else this.refreshBookingObject(data.json())
                            // this.refreshBookingDetails();
                            // this.flightService.getBookingByPlayer(this.currentPlayerId, moment().format("YYYY-MM-DD"))
                            //     .subscribe((bookingByPlayerList: Array < TeeTimeBooking > ) => {
                            //         this.bookingSlot = bookingByPlayerList
                            //             .filter((tb: TeeTimeBooking) => {
                            //                 return tb.id === _bookingId;
                            //             })[0];
                            //         this.bookingSlot.bookingPlayers = this.bookingSlot.bookingPlayers;
                            //     }, (error) => {
                            //         loader.dismiss();
                            //     });
                        }
                    })

                }, (error)=>{
                    let _error = error.json();
                    let _msg;
                    if(_error && _error.status === 500) _msg = "Something went wrong with the server. If it insists, please contact admin."
                  //  console.log("error delete booking player : ", _error)
                        MessageDisplayUtil.showMessageToast(_msg,
                            this.platform, this.toastCtl, 3000, "bottom")
                        return false;


                })
        })

    }

    async deleteMultiBookingPlayer() {
        // let _bookingPlayerId = player.id;
        let _bookingId = this.bookingSlot.id;
        let _bookingPlayers = this.bookingSlot.bookingPlayers;
        let _playersCount = _bookingPlayers.length;
        let _deleteDone: boolean = false;
        _bookingPlayers.forEach((tbp: TeeTimeBookingPlayer, i: number) => {
            this.flightService.deletePlayerFromBooking(tbp.id)
                .subscribe((data: any) => {
                    // console.log("delete booking player : ", _bookingPlayerId)
                    if (data) _deleteDone = true
                })
            if (_playersCount === (i + 1)) _deleteDone = true;
        })
        return await _deleteDone;
    }

    onGetFlightClick() {

        let pgModal = this.modalCtl.create(PlayerGroupsPage, {
            selectAndReturn: true
        });
        let _bookingPlayers = this.bookingSlot.bookingPlayers;


        let _deleteMultiDone: boolean = false;
        pgModal.onDidDismiss((pg: PlayerGroup) => {
            if (pg) {
                this.flightService.addFromGroup(this.bookingSlot.id, pg.id)
                    .subscribe((data) => {
                        if (data && data.status === 200) {
                            let _bookingSlot = data.json();
                            this.refreshBookingObject(_bookingSlot);
                        }
                      //  console.log("response from add player from group", data)
                        // this.groupSelected = true;
                        // this.refreshBookingDetails();
                    })
            }
            // if (pg) {
            //     // _deleteMultiDone = 
            //     this.deleteMultiBookingPlayer().then((result)=>{
            //       //  console.log("delete multi result :", result)
            //         pg.players
            //         // .filter((p: PlayerInfo) => {
            //         //     this.deleteBookingPlayer(tbp);
            //         //         return p.playerId !== tbp.player.id;
            //         //     })

            //         .forEach((p: PlayerInfo, idx: number) => {
            //           //  console.log("p", p)
            //           //  console.log("idx", idx)
            //             idx += 1;
            //             let _idx = String(idx);
            //             this.addPlayerToBooking(p, _idx);
            //             // this.bookingSlot.bookingPlayers[idx] = p;
            //             // this.otherPlayers[idx] = p;
            //             // this._gettingCourseHandicap(idx+2);
            //         });
            //     });
            //     // })
            //     // _bookingPlayers.forEach((tbp: TeeTimeBookingPlayer)=>{
            //     //     this.deleteBookingPlayer(tbp);
            //     // });
            //     // _bookingPlayers.forEach((tbp: TeeTimeBookingPlayer) =>{

            //     // this.groupSelected = true;
            //     // this.gameInfo.groupSelected = true;
            //     // })
            // }
        });
        pgModal.present();

    }

    onSaveFlightClick() {

        let _required = '';
        let _message = "This will only save the other 3 players in the list";
        let prompt = this.alertCtrl.create({
            // Flight Name
            title: 'Enter a name for this new Group',
            // subTitle: _required,
            message: _message,
            inputs: [{
                name: 'title',
                placeholder: 'Group Name'
            }, ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                        prompt.dismiss().then(() => {
                            this.keyboard.close();
                        });
                        return false;
                    }
                },
                {
                    text: 'Save',
                    handler: data => {
                        _required = '';
                        if (data.title)
                            prompt.dismiss().then(() => {
                                this._createPlayerGroup(data.title);
                            })
                        else {
                            // _required = 'Please enter Group Name';
                            // _message = '<br>Please enter the Group Name';
                            let msg = MessageDisplayUtil.getErrorMessage('', "Please enter Group name");
                            MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl,
                                5000, "bottom");
                        }
                        // prompt.dismiss()
                        //     .then(() => {
                        //         this.keyboard.close();
                        //           if (data.title)
                        //               this._createPlayerGroup(data.title);
                        //             else {
                        //                 let msg = MessageDisplayUtil.getErrorMessage('', "Please enter Group name");
                        // MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl,
                        //     5000, "bottom");
                        //             }
                        //     });
                        return false;
                    }
                },
            ]
        });
        prompt.present();
    }

    // getBookedPlayerDetails(attribute: string) {
    //     let _firstName = this.bookingSlot.bookedByPlayer.firstName
    //     switch(attribute) {
    //         case 'first_name':
    //             return 
    //     }
    // }

    getPlayerSlotDetails(slot: number, attribute: string) {
        // player: TeeTimeBookingPlayer, 
        let _currentPlayer = this.bookingSlot.bookingPlayers;

        // this.bookingSlot.bookingPlayers.filter((p: TeeTimeBookingPlayer) => {
        //     return p.sequence === slot
        // })
        let idx = slot - 1;

        // if(!_currentPlayer[idx].player || _currentPlayer[idx].player === null) return "";
        // console.log("player slot details - ", "[",idx,"]",_currentPlayer[idx])

        let _id;
        let _isMe: boolean = (_currentPlayer[idx] && _currentPlayer[idx].player && (_currentPlayer[idx].player.id === this.currentPlayerId)) ? true : false;

        // console.log("player slot details - ", "[",idx,"]",_currentPlayer[idx], "you ? : ", _isMe)
        if (_currentPlayer[idx] && _currentPlayer[idx].player)
            _id = "(#" + _currentPlayer[idx].player.id + ")";
        else "";
        // _id = (_currentPlayer[idx].player && _currentPlayer[idx].player.id?"(#"+_currentPlayer[idx].player.id+")":"");
        if (this.slotFilled(slot)) {
            switch (attribute) {
                case 'name':
                    return _currentPlayer[idx].playerName + (_isMe ? ' [You]' : ''); //player.playerName;
                case 'id':
                    return _id;
                case 'image':
                    if(_currentPlayer[idx] && !_currentPlayer[idx].player) return null;
                    else return (_currentPlayer[idx].player && _currentPlayer[idx].player.profile ? _currentPlayer[idx].player.profile : _currentPlayer[idx].player.image?_currentPlayer[idx].player.image:null);
                case 'isContactComplete':
                    // console.log("is contact complete? : ",_currentPlayer[idx])
                    let _newPlayer = (_currentPlayer[idx].player) ? false : true;
                    if (_newPlayer) return _currentPlayer[idx].playerContact && _currentPlayer[idx].playerContact.length > 0
                    else {
                        let _currPlAddress = _currentPlayer[idx].player.address;
                        if (_currPlAddress.address1 &&
                            _currPlAddress.state &&
                            _currPlAddress.city &&
                            _currPlAddress.postCode &&
                            _currPlAddress.phone1) return true
                        else return false;
                    }
                    case 'discount':
                        if(!_currentPlayer[idx].playerTypeUsed && _currentPlayer[idx].playerType)
                            return '<span style="color:red">Rate: <b>'+_currentPlayer[idx].playerType.name+'</b></span>';
                        else if (_currentPlayer[idx].playerTypeUsed)
                            return '<span style="color:red">Rate: <b>'+_currentPlayer[idx].playerTypeUsed.name+'</b></span>';
                        else return '<span style="color:red">No promotion</span>';
                    // case 'isMe':
                    //     return _isMe;
            }
        } else {
            switch (attribute) {
                case 'name':
                    return "Tap + or enter Mship / myG2u #";
                    // return "Select Golfer "+ slot;
                case 'id':
                    return ''; //this.bookingSlot.bookingPlayers[slot].player.id; //player.player.id;
                case 'isContactComplete':
                    return false;
                case 'image':
                    return '';
                    // case 'discount':
                    //     return '<span style="color:red">No promotion</span>'
                    // case 'id':
                    //     return this.bookingSlot.bookingPlayers[slot].pla
            }
        }

    }

    slotFilled(slot: number) {
        let idx = slot - 1;
        // console.log("slot filled [",slot,"]");
        // console.log("slot filled - ",this.bookingSlot.bookingPlayers)
        // console.log("slot filled 1 - ", this.bookingSlot.bookingPlayers.length > idx );
        // console.log("slot filled 2 - ",isPresent(this.bookingSlot.bookingPlayers[idx]))
        return this.bookingSlot.bookingPlayers.length > idx && isPresent(this.bookingSlot.bookingPlayers[idx]) && !this.bookingSlot.bookingPlayers[idx].playerRemoved;
    }

    canSaveFlight(): boolean {
        // let _player: Array < TeeTimeBookingPlayer > ;
        // _player.push(...this.bookingSlot.bookingPlayers);
        // let count = _player.filter((tbp: TeeTimeBookingPlayer) => {
        //     return (tbp != null);
        // }).length;
        let count = this.bookingSlot.bookingPlayers.length;
        return !this.groupSelected && count > 0;
    }


    private _createPlayerGroup(groupName: string) {
        let loader = this.loadingCtl.create({
            showBackdrop: false,
            content: "Saving player group..."
        });

        let playerIds = this.bookingSlot.bookingPlayers.filter((p) => {
                if (p.player && p.player.id)
                    return p.player.id !== this.currentPlayerId
                else return false
            })
            .map(p => p.player.id);
      //  console.log("creating player grup : ", groupName, playerIds);

        loader.present().then(() => {
            this.playerService.savePlayerGroup(groupName, playerIds)
                .subscribe((result: boolean) => {
                    loader.dismiss(true).then(() => {
                        let msg = "The player group " + groupName + " saved successfully";
                        MessageDisplayUtil.showMessageToast(msg, this.platform, this.toastCtl,
                            2000, "bottom");
                    });
                }, (error) => {
                    loader.dismiss().then(() => {
                        let msg = MessageDisplayUtil.getErrorMessage(error, "Error saving player group");
                        MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl,
                            5000, "bottom");
                    });
                })
        });

    }

    selectBuggy(b: BookingBuggy, playerIdx: number, buggyIdx: number) {
        // this.bookingSlot.bookingPlayers[playerIdx].buggyId = b.pairingNo;
        this.bookingSlot.bookingPlayers[playerIdx].pairingNo = b.pairingNo;
        if (buggyIdx === 0) this.bookingSlot.bookingPlayers[playerIdx].walking = true;
        else this.bookingSlot.bookingPlayers[playerIdx].walking = false;
        this.flightService.updateBookingPlayerDetails(this.bookingSlot.id, this.bookingSlot.bookingPlayers[playerIdx], 'pairing')
            .subscribe((data: any) => {
              //  console.log("set pairing no : ", data);
                this.refreshBookingDetails();
            })
    }

    setBuggySeatings(b ? : any) {
        // let _maxAllowed = this.bookingOptions.maxPlayersPerBuggy;
        let _maxAllowed = this.bookingSlot.slotAssigned.maxPlayersPerBuggy;
        let _prevBuggySlots: Array < BookingBuggy > ;
        if (this.buggySlots.length > 1) _prevBuggySlots = [...this.buggySlots];
        this.buggySlots = [];
        this.buggySlots[0] = {
            buggySlot: 0,
            driving: false,
            pairingNo: 0,
            walking: true,
            maxAllowed: 99,
            totalPlayers: 0
        }
        // this.buggySlots.length
        for (var i = 1; i <= this.buggyReq; i++) {
            this.buggySlots.push(Object.assign({}, this.buggySlots[i], {
                buggySlot: i,
                pairingNo: i,
                walking: false,
                driving: false,
                maxAllowed: _maxAllowed,
                totalPlayers: 0
                // (_prevBuggySlots[i] && _prevBuggySlots[i].totalPlayers > 0)?_prevBuggySlots[i].totalPlayers :0
            }))
        }
      //  console.log(this.buggySlots)
    }

    setCaddyPairings(c ? : any) {
        this.caddySlots = [];
        this.caddySlots[0] = {
            caddyPairing: 0,
            caddyRequired: false,
            caddyPreferred: null,
            caddyRequested: false,
            caddySelectionCriteria: null,
        }

        for (var i = 1; i <= this.caddyReq; i++) {
            this.caddySlots.push(Object.assign({}, this.caddySlots[0], {
                caddyRequired: false,
                caddyPreferred: null,
                caddyRequested: false,
                caddySelectionCriteria: null,
                caddyPairing: i,
                caddyAssigned: null,
            }))
        }

        this.caddySlots.forEach((c) => {
            this.caddyPairing.filter((cp) => {
                    return cp.caddyPairing === c.caddyPairing
                })
                .map((cp) => {
                    c.caddyPreferred = cp.caddyPreferred
                })
            // if(c.caddyPairing === )
            // c.caddyPreferred = this.cadd
        })
      //  console.log("setcaddypairings - slots : ", this.caddySlots);
      //  console.log("setcaddypairings - pairings : ", this.caddyPairing)
    }

    setCaddyPairing(b: any, event) {
        // if(this.bookingOptions && this.bookingOptions.buggyMandatory && 
        if (this.bookingSlot && !this.bookingSlot.slotAssigned.allowWalking &&
            this.bookingSlot.bookingPlayers[b] &&
            (this.bookingSlot.bookingPlayers[b].pairingNo === 0 || !this.bookingSlot.bookingPlayers[b].pairingNo)) {
            let msg = MessageDisplayUtil.getErrorMessage('', "Please select a buggy first");
            MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl,
                5000, "bottom");
            return false;
        }
        this.caddySlots = [];
        this.caddySlots[0] = {
            caddyPairing: 0,
            caddyRequired: false,
            caddyPreferred: null,
            caddyRequested: false,
            caddySelectionCriteria: null,
            caddyAssigned: null,
        }

        for (var i = 1; i <= this.caddyReq; i++) {
            this.caddySlots.push(Object.assign({}, this.caddySlots[i], {
                caddyRequired: false,
                caddyPreferred: null,
                caddyRequested: false,
                caddySelectionCriteria: null,
                caddyPairing: i,
                caddyAssigned: null,
            }))
        }



        // for(var i=1; i<=this.buggyReq; i++) {
        // //    buggies.push(i.toString());
        // buggies[i-1].buggySlot = i.toString();
        // }
        this.caddySlots.forEach((c) => {
            this.caddyPairing.filter((cp) => {
                    return cp.caddyPairing === c.caddyPairing
                })
                .map((cp) => {
                    c.caddyPreferred = cp.caddyPreferred
                })
            // if(c.caddyPairing === )
            // c.caddyPreferred = this.cadd
        })
        // console.log("Set caddy seating : ", this.caddySlots);
        // console.log("set caddy seating - event : ", event)
        let popover = this.popoverCtl.create(BuggySeatingPage, {
            type: 'caddy',
            headerName: 'Caddy Pairing',
            caddies: this.caddySlots,
            pairing: this.caddyPairing,
            // courses: this.courses
        }, {
            showBackdrop: true
        });
        popover.onDidDismiss((data: any) => {

            let _currentCaddy;
            let _currentBuggy;
            _currentBuggy = this.bookingSlot.bookingPlayers[b].pairingNo;
            _currentCaddy = this.bookingSlot.bookingPlayers[b].caddyPairing;

            let _caddyNo;
            let _caddyCount;
            // let _maxAllowedCaddy = this.bookingOptions.maxPlayersPerCaddy;
            let _maxAllowedCaddy = this.bookingSlot.slotAssigned.maxPlayersPerCaddy;
            let _caddyBuggySuccess = true;

            // .map((a,b)=>{
            //     if(a.pairingNo === b.pairingNo) return 1
            //     else if (a.pairingNo !== b.pairingNo) return -1
            //     else return 0    
            // })



            if (data && data.selected) {
                if (data.caddy.caddyPairing !== 0) {
                    _caddyBuggySuccess = this.bookingSlot.bookingPlayers.filter((player: TeeTimeBookingPlayer, idx: number) => {
                        return player.caddyPairing === data.caddy.caddyPairing
                        // this.bookingSlot.bookingPlayers[b].caddyPairing
                    }).every((p: TeeTimeBookingPlayer, currIdx, nextP: Array < TeeTimeBookingPlayer > ) => {
                      //  console.log("p pairingNo", p.pairingNo, "| current buggy - ", _currentBuggy)
                        // console.log("nextP ", nextP[currIdx+1].pairingNo)
                        if (p.pairingNo !== _currentBuggy)
                            return false
                        else return true
                        // if(p.pairingNo === nextP[currIdx+1].pairingNo) return true
                        //     else return false;
                    })

                  //  console.log("caddy pairing", _caddyBuggySuccess)
                    _caddyCount = this.bookingSlot.bookingPlayers.filter((player: TeeTimeBookingPlayer, idx: number) => {
                        return player.caddyPairing === data.caddy.caddyPairing && idx !== b
                    }).length;
                  //  console.log("max allowed : ", _maxAllowedCaddy, " | caddy count : ", _caddyCount, data)
                    if (_caddyCount >= _maxAllowedCaddy) {
                        MessageDisplayUtil.showMessageToast('Selected Caddie is fully utilized',
                            this.platform, this.toastCtl, 3000, "bottom")
                        return false;
                    }


                    if (!_caddyBuggySuccess) {
                        MessageDisplayUtil.showMessageToast('Caddy is paired in different bugggy',
                            this.platform, this.toastCtl, 3000, "bottom")
                        return false;
                    }
                }



                let i = data.caddy.caddyPairing;
              //  console.log("return caddy pairing : ", data)
                // this.setCaddySlot(b, data.caddy.caddyPairing-1)
                this.bookingSlot.bookingPlayers[b].caddyPairing = (i);
                this.bookingSlot.bookingPlayers.forEach((p, idx) => {
                    if (p.caddyPairing === data.caddy.caddyPairing)
                        this.setCaddySlot(idx, p.caddyPairing);
                    // this.setCaddySlot(playerIdx,this.bookingSlot.bookingPlayers[playerIdx].caddyPairing);

                })
                // this.bookingSlot.bookingPlayers[b].caddyPreferred = (this.caddyPairing[i]&&this.caddyPairing[i].caddyPreferred?this.caddyPairing[i].caddyPreferred:null);
                // this.flightService.updateBookingPlayerDetails(this.bookingSlot.id,this.bookingSlot.bookingPlayers[b],'caddyPairing')
                //         .subscribe((updatePlayerDetails:any)=> {
                //             // this.caddyPairing[_caddyNo] = {
                //             //     caddyPreferred: data.caddy,
                //             //     caddyPairing: _caddyNo
                //             // }
                //             // console.log("select preferred caddy", this.caddyPairing, this.caddyPairing[_caddyNo]);
                //             this.refreshBookingDetails();
                //         })
            }
            // if (data && data.selected) {
            //   //  console.log("return buggy seating : ", data)
            //     _buggyNo = data.buggy.buggySlot
            //     // this.buggySlots[b].buggySlot = _buggyNo;
            //     this.bookingSlot.bookingPlayers[b].buggyId = _buggyNo;
            //     this.bookingSlot.bookingPlayers[b].pairingNo = _buggyNo;
            //     this.flightService.updateBookingPlayerDetails(this.bookingSlot.id,this.bookingSlot.bookingPlayers[b],'pairing')
            //     .subscribe((data:any)=> {
            //       //  console.log("set pairing no : ", data);
            //         this.refreshBookingDetails();
            //     })
            //     // this.;
            // }
        });
        popover.present({
            ev: event
        });
        // popover.present();
    }

    setCaddySlot(playerIdx: number, i: number) {
        // if(!this.caddySlots[i] || !this.caddySlots[i].caddyPreferred) {
        // console.log("set caddy slot - slots : ", this.caddySlots);
        // console.log("set caddy slot - pairing : ", this.caddyPairing);
        // console.log("set caddy slot - index : ", i);
        //     if(!this.caddyPairing[i]) {
        //         MessageDisplayUtil.showErrorToast("Please select a caddy later", this.platform, this.toastCtl,
        //                     5000, "bottom");
        //     return false;
        //     }
        //     else if(i>0 && (!this.caddyPairing[i] && !this.caddyPairing[i].caddyPreferred)) {
        //                 MessageDisplayUtil.showErrorToast("Select a favourite caddy", this.platform, this.toastCtl,
        //                     5000, "bottom");
        //     return false;
        // } else if (i>0 && (!this.caddyPairing[i] && !this.caddyPairing[i].caddySelectionCriteria.gender)) {
        //     MessageDisplayUtil.showErrorToast("Select a caddy", this.platform, this.toastCtl,
        //                     5000, "bottom");
        //     return false;
        // }


        // console.log("set caddy slot - slots : ", this.caddySlots);
        // console.log("set caddy slot - pairing : ", this.caddyPairing);
        // console.log("set caddy slot - index : ", i);

        let _caddyRequired: boolean = true;
        if(this.caddyRemoveFlag) _caddyRequired = false
        // if(data.buggy.pairingNo === 0) this.bookingSlot.bookingPlayers[b].driving = false;
        
        
        this.buggyCaddyPreference.ignoreBuggyUpdate = true;
        this.buggyCaddyPreference.ignoreCaddieUpdate = false;
        this.buggyCaddyPreference.playerPairings.filter((p: PlayerBuggyCaddiePreference) => {
            return p.bookingPlayerId === this.bookingSlot.bookingPlayers[playerIdx].id
        }).map((p: PlayerBuggyCaddiePreference) => {
            p.caddyPairing = i;
            if(i>0) p.caddyRequired = _caddyRequired;
            else p.caddyRequired = false;// = i > 0 ? _caddyRequired: false;//true : false;
            p.caddiePreferred = (this.caddyPairing[i] && this.caddyPairing[i].caddyPreferred) ? this.caddyPairing[i].caddyPreferred.id : null;
            // p.caddieAssigned = (this.caddyPairing[i] && this.caddyPairing[i].caddieAssigned) ? this.caddyPairing[i].caddieAssigned.id : null;
            // p.buggyPairing = data.buggy.pairingNo;
            // p.buggyRequired = data.buggy.pairingNo>0?true:false;
            // if(data.buggy.pairingNo === 0) p.driving = false;
        })

      //  console.log("buggy preference - set caddy pairing", this.buggyCaddyPreference," - ",i, _caddyRequired)
        // if(1) return false;

        this.flightService.updateBuggyCaddiePreference(this.buggyCaddyPreference)
            .subscribe((data: any) => {
                if (data.status === 200) {
                    this.refreshBookingObject(data.json());
                    this.caddyRemoveFlag = false;
                    // this.refreshBookingDetails();
                }
            });

        /// OLD CODE without updateBuggyCaddiePreference
        // this.bookingSlot.bookingPlayers[playerIdx].caddyPairing = (i); //this.caddySlots[i+1].caddyPairing; //this.caddyPairing[i+1].caddyPairing
        // this.bookingSlot.bookingPlayers[playerIdx].caddyPreferred = (this.caddyPairing[i] && this.caddyPairing[i].caddyPreferred)?this.caddyPairing[i].caddyPreferred:null;
        // this.bookingSlot.bookingPlayers[playerIdx].caddySelectionCriteria = (this.caddyPairing[i] && this.caddyPairing[i].caddySelectionCriteria)?this.caddyPairing[i].caddySelectionCriteria:null;
        // // this.bookingSlot.bookingPlayers[playerIdx].caddyPreferred = (i>0&&this.caddyPairing[i].caddyPreferred)?this.caddyPairing[i].caddyPreferred:null;
        // this.flightService.updateBookingPlayerDetails(this.bookingSlot.id,this.bookingSlot.bookingPlayers[playerIdx],'caddyPairing')
        //         .subscribe((updatePlayerDetails:any)=> {
        //             // this.caddyPairing[_caddyNo] = {
        //             //     caddyPreferred: data.caddy,
        //             //     caddyPairing: _caddyNo
        //             // }
        //             // console.log("select preferred caddy", this.caddyPairing, this.caddyPairing[_caddyNo]);
        //             this.refreshBookingDetails();
        //         })
    }

    getBuggySlot(b: BookingBuggy, i: number) {
        // console.log("get buggy slot - ",i," : ",b)
        if (i === 0) return "Walking";
        else return 'Buggy ' + b.buggySlot
        // Buggy {{buggy.buggySlot}}
    }
    getBuggySlotDisplay(playeridx: number) {
        let i = this.bookingSlot.bookingPlayers[playeridx].pairingNo;
        if (i === 0 || i === null || !i) return "Walking";
        else return 'Buggy ' + i
    }
    getCaddySlot(c: BookingCaddy, i: number, playerIdx: number, attribute: string) {
        // console.log("get caddy slot - ",i," playerIdx - ",playerIdx," : ",attribute);
        // console.log("get caddy slot - ",this.caddySlots,this.caddySlots[i+1]);
        // console.log("get caddy slot - ",this.caddyPairing,this.caddyPairing[i+1]);
        // if(i === 0) return "walking"; 
        switch (attribute) {
            case 'slot':
                return '#' + (i + 1);
            case 'name':
                let _name;
                let _id;
                if (this.caddyPairing[i] && this.caddyPairing[i].caddyPreferred) {
                    _name = " - " + this.caddyPairing[i].caddyPreferred.firstName
                } else _name = '';
                if (this.caddyPairing[i] && this.caddyPairing[i].caddyPreferred) {
                    _id = ' (' + this.caddyPairing[i].caddyPreferred.id + ')'
                } else _id = '';

                // console.log("Caddy Name : ", this.bookingSlot.bookingPlayers[playerIdx].caddyPreferred?" - "+this.bookingSlot.bookingPlayers[playerIdx].caddyPreferred.firstName:'')
                // return this.bookingSlot.bookingPlayers[playerIdx].caddyPreferred?" - "+this.bookingSlot.bookingPlayers[playerIdx].caddyPreferred.firstName:'';
                // return this.caddyPairing[i] && this.caddyPairing[i].caddyPreferred?
                // " - "+this.caddyPairing[i].caddyPreferred.firstName+ (this.caddyPairing[i].caddyPreferred?' ('+this.caddyPairing[i].caddyPreferred.id+')':''):'' );
                return _name + _id
        }
        // Buggy {{buggy.buggySlot}}
    }

    removeCaddyPairing(i: number, playerIdx: number) {
        let alert = this.alertCtrl.create({
            title: 'Remove Caddy Pairing from Player',
            // subTitle: 'Selected date is '+ _date,
            message: 'This will remove caddy pairing from player.', //'Selected date is ' + '<b>' + _date + '</b>',
            buttons: [
                {
                    text: 'Cancel',
                },
                {
                    text: 'Remove caddy',
                    handler: () => {
                        this.flightService.updateBookingPlayerDetails(this.bookingSlot.id, this.bookingSlot.bookingPlayers[playerIdx], 'removeCaddy')
                            .subscribe((updatePlayerDetails: any) => {
                                this.refreshBookingDetails();
                            })
                    }
                },
            ]
        });
        alert.present();

    }

    setBuggySeating(b: any, event) {


        // let buggies: Array<BookingBuggy> = new Array<BookingBuggy>();
        // for (var i = this.buggySlots.length; i < this.buggyReq; i++) {
        //     this.buggySlots.push(Object.assign({}, this.buggySlots[0], {
        //         buggySlot: i + 1,
        //         pairingNo: i + 1,
        //         sequence: null
        //     }))
        // }


        // for(var i=1; i<=this.buggyReq; i++) {
        // //    buggies.push(i.toString());
        // buggies[i-1].buggySlot = i.toString();
        // }
        // console.log("Set buggy seating : ", this.buggySlots);
        // console.log("set buggy seating - event : ", event)
        let popover = this.popoverCtl.create(BuggySeatingPage, {
            type: 'buggy',
            headerName: 'Buggy Seating',
            buggies: this.buggySlots,
            slot: this.bookingSlot,
            bookingOptions: this.bookingOptions ? this.bookingOptions : null,
            // courses: this.courses
        }, {
            showBackdrop: true
        });
        popover.onDidDismiss((data: any) => {
            let _buggyNo;
            let _buggyCount;
            // let _maxAllowedBuggy = this.bookingOptions.maxPlayersPerBuggy
            let _maxAllowedBuggy = this.bookingSlot.slotAssigned.maxPlayersPerBuggy
            let _currentPairingNo;
            if (data && data.selected) {

                _buggyCount = this.bookingSlot.bookingPlayers.filter((player: TeeTimeBookingPlayer, idx: number) => {
                    return player.pairingNo === data.buggy.pairingNo && idx !== b
                }).length;
              //  console.log("max allowed : ", _maxAllowedBuggy, " | buggy count : ", _buggyCount, data)
                if (data.buggy.pairingNo !== 0 && _buggyCount >= _maxAllowedBuggy) {
                    MessageDisplayUtil.showMessageToast('Selected Buggy is fully utilized',
                        this.platform, this.toastCtl, 3000, "bottom")
                    return false;
                }

              //  console.log("return buggy seating : ", data)
                _buggyNo = data.buggy.buggySlot
                this.buggySlots[_buggyNo].totalPlayers += 1;
                // this.buggySlots[b].buggySlot = _buggyNo;
                this.bookingSlot.bookingPlayers[b].buggyId = _buggyNo;
                this.bookingSlot.bookingPlayers[b].pairingNo = _buggyNo;
                if (data.buggy.pairingNo === 0) this.bookingSlot.bookingPlayers[b].driving = false;
                this.buggyCaddyPreference.ignoreBuggyUpdate = false;
                this.buggyCaddyPreference.ignoreCaddieUpdate = true;
                this.buggyCaddyPreference.playerPairings.filter((p: PlayerBuggyCaddiePreference) => {
                    return p.bookingPlayerId === this.bookingSlot.bookingPlayers[b].id
                }).map((p: PlayerBuggyCaddiePreference) => {
                    p.buggyPairing = data.buggy.pairingNo;
                    p.buggyRequired = data.buggy.pairingNo > 0 ? true : false;
                    p.caddiePreferred = this.bookingSlot.bookingPlayers[b].caddyPreferred ? this.bookingSlot.bookingPlayers[b].caddyPreferred.id : null;
                    p.caddieAssigned = this.bookingSlot.bookingPlayers[b].caddyAssigned ? this.bookingSlot.bookingPlayers[b].caddyAssigned.id : null;
                    // p.caddyRequired = this.bookingSlot.bookingPlayers[b].caddyPairing > 0? true:false; //this.bookingSlot.bookingPlayers[b].caddyPreferred ? true : false;
                    
                    if(this.bookingSlot.bookingPlayers[b].caddyPairing > 0)
                        p.caddyRequired = true
                    else p.caddyRequired = false;
                    p.caddyPairing = this.bookingSlot.bookingPlayers[b].caddyPairing;
                    if (data.buggy.pairingNo === 0) p.driving = false;
                })

              //  console.log("buggy preference - set buggy seating", this.buggyCaddyPreference)
                // if(1) return false;

                this.flightService.updateBuggyCaddiePreference(this.buggyCaddyPreference)
                    .subscribe((data: any) => {
                      //  console.log("response set buggy seating no : ", data);
                        // this.refreshBookingDetails();
                        this.refreshBookingObject(data.json());
                    })


                // this.flightService.updateBookingPlayerDetails(this.bookingSlot.id,this.bookingSlot.bookingPlayers[b],'pairing')
                // .subscribe((data:any)=> {
                //   //  console.log("set pairing no : ", data);
                //     this.refreshBookingDetails();
                // })
            }
        });
        popover.present({
            ev: event
        });
        // popover.present();
    }

    addBuggy(x: number) {
        // console.log("add buggy - ", x, this.buggyReq, _uniq)

        if (this.teeSlotNew) {
            if (x < 0 && this.buggyReq === 0) return false;
            else if (x > 0 && this.buggyReq == this.playerReq) return false;
            else this.buggyReq += x;
        } else {
            let _uniqBuggy = this.getUnique(this.bookingSlot.bookingPlayers, 'pairingNo');
            _uniqBuggy = _uniqBuggy.filter((ub)=>{
                return ub.pairingNo > 0
            })
            if (x < 0 && this.buggyReq === 0) return false;
            else if (x > 0 && this.buggyReq == this.bookingSlot.bookingPlayers.length) return false;
            else if (x < 0 && this.buggyReq === _uniqBuggy.length) return false;
            // else if (x > 0 && this.buggyReq === _uniqBuggy.length) return false;
            else this.buggyReq += x;
            this.setBuggySeatings();
        }


        // if(x < 0) {
        //     // for (var i=this.buggySlots.length; i<this.buggyReq; i++) {
        //         this.buggySlots.pop();
        //     //   } 
        // } else if (x > 0) {
        //     let i = this.buggyReq;
        //     // for (var i=this.buggySlots.length; i<this.buggyReq; i++) {
        //         this.buggySlots.push(Object.assign({}, this.buggySlots[this.buggyReq-1], {
        //           buggySlot: i,
        //           pairingNo: null,
        //           sequence: null
        //         }))
        //     //   }
        // }

    }

    addCaddy(x: number) {
        if (this.teeSlotNew) {
            // let _maxAllowedCaddy;
            // this.caddyReq * this.playerReq
            if (x < 0 && this.caddyReq === 0) return false;
            else if (x > 0 && this.caddyReq == this.playerReq) return false;
            else this.caddyReq += x;
        } else {
            let _uniqCaddy = this.getUnique(this.bookingSlot.bookingPlayers, 'caddyPairing');
            _uniqCaddy = _uniqCaddy.filter((uc)=>{
                return uc.caddyPairing > 0
            })
          //  console.log("adding caddy - ", x, " to ", _uniqCaddy, " ::: ", this.caddyReq)
            if (x < 0 && this.caddyReq === 0) return false;
            else if (x > 0 && this.caddyReq === this.bookingSlot.bookingPlayers.length) return false;
            else if (x < 0 && this.caddyReq === _uniqCaddy.length) return false;
            // else if (x > 0 && this.caddyReq === _uniqCaddy.length) return false;
            else this.caddyReq += x;
            this.setCaddyPairings();
        }

    }

    addPlayers(x: number) {
        if (x < 0 && this.playerReq === this.teeTimeSlotDisplay.slot.minPlayers) return false;
        else if (x > 0 && this.playerReq == this.teeTimeSlotDisplay.slot.maxPlayers) return false;
        // else if(x < 0 && this.playerReq <= this.bookingSlot.bookingPlayers.length) return false;
        else this.playerReq += x;
        // if (x < 0) this.slots.pop()
        // else if(x > 0) this.slots.push(this.slots.length+1)
    }

    onSelectCaddy(playerIdx: number, _caddyNo ? : number) {
        if (this.bookingSlot.bookingPlayers[playerIdx].caddyPairing === 0 || this.bookingSlot.bookingPlayers[playerIdx].caddyPairing === null) {
            MessageDisplayUtil.showMessageToast('Please select Caddy Pairing first',
                this.platform, this.toastCtl, 3000, "bottom")
            return false;
        }
        this.selectCaddy(playerIdx, _caddyNo);

        // let alert = this.alertCtrl.create({
        //     title: 'Caddy Selection',
        //     // subTitle: 'Selected date is '+ _date,
        //     // message: 'Please add a caddy number above.', //'Selected date is ' + '<b>' + _date + '</b>',
        //     // buttons: ['Close']
        //     buttons: [{
        //         text: 'Clear selected Caddy Pairing',
        //         handler: () => {
        //             this.caddyPairing[_caddyNo] = {
        //                 caddyPreferred: null,
        //                 caddySelectionCriteria: null
        //             }
        //             this.bookingSlot.bookingPlayers.forEach((p,i)=>{
        //                 if(p.caddyPairing === this.caddyPairing[_caddyNo].caddyPairing)
        //               //  console.log("caddy unselect ", this.caddyPairing[_caddyNo], " - ", p.caddyPairing)
        //                     this.setCaddySlot(i,p.caddyPairing);
        //                     // this.setCaddySlot(playerIdx,this.bookingSlot.bookingPlayers[playerIdx].caddyPairing);

        //             })
        //             return false;
        //         }

        //     },
        //     {
        //         text: 'Select Caddy',
        //         handler: () => {
        //             this.selectCaddy(playerIdx,_caddyNo);
        //             return false;
        //         }
        //     },
        //     {
        //         text: 'Cancel',
        //         role: 'cancel',
        //         // handler: () => {
        //         //     // this.selectCaddy(playerIdx,_caddyNo);
        //         // }
        //     },
        // ]
        // });
        // alert.present();

    }

    selectCaddy(playerIdx: number, caddyNo ? : number) {
        let caddiesToExclude = this.caddyPairing;

        let _caddyNo = caddyNo; // + 1;
      //  console.log("selecting caddy from booking - club data: ", this.bookingSlot.clubData);

      //  console.log("selecting caddy from booking - bookingSlot: ", this.bookingSlot);

        if (this.caddyReq === 0) {
            let alert = this.alertCtrl.create({
                title: 'Preferred Caddy',
                // subTitle: 'Selected date is '+ _date,
                message: 'Please add a caddy number above.', //'Selected date is ' + '<b>' + _date + '</b>',
                buttons: ['Close']
            });
            alert.present();

            return false;
        }
        // this.nav.push(CaddyListPage, {
        //     fromBooking: true,
        //     clubId: this.bookingSlot.clubData.id,
        //     bookingClub: this.bookingSlot.clubData
        // }) 
        let caddyModal = this.modalCtl.create(CaddyListPage, {
            // selectAndReturn: true
            clubId: this.bookingSlot.clubData.id,
            fromBooking: true,
            bookingCurrDate: this.bookingSlot.slotAssigned.teeOffDate,
            caddiesToExclude: caddiesToExclude,
            bookingId: this.bookingSlot.id,
        });
        let _bookingPlayers = this.bookingSlot.bookingPlayers;


        caddyModal.onDidDismiss((data: any) => {
            if (data && data.selected) {
              //  console.log("after select caddy for pairing ALL - ", this.caddyPairing[_caddyNo], this.caddyPairing, this.caddySlots, data.caddy, data.caddySelectionCriteria)

                if (data.caddy && !data.caddySelectionCriteria) {
                    this.bookingSlot.bookingPlayers[playerIdx].caddyPreferred = data.caddy
                    this.bookingSlot.bookingPlayers[playerIdx].caddyPairing = _caddyNo;
                    // this.bookingSlot.bookingPlayers[playerIdx].caddySelectionCriteria = data.caddySelectionCriteria;

                    this.caddyPairing[_caddyNo] = {
                        caddyPreferred: data.caddy,
                        caddyPairing: _caddyNo,
                        caddySelectionCriteria: data.caddySelectionCriteria,
                        caddyRequired: _caddyNo > 0? true:false
                    }
                    this.bookingSlot.bookingPlayers.forEach((p, i) => {
                        if (p.caddyPairing === this.caddyPairing[_caddyNo].caddyPairing)
                            this.setCaddySlot(i, p.caddyPairing);
                        // this.setCaddySlot(playerIdx,this.bookingSlot.bookingPlayers[playerIdx].caddyPairing);

                    })
                  //  console.log("after select caddy for pairing fav- ", this.caddyPairing[_caddyNo], this.caddyPairing, this.caddySlots, data.caddySelectionCriteria)
                } else if (!data.caddy && data.caddySelectionCriteria) {
                    this.bookingSlot.bookingPlayers[playerIdx].caddyPairing = _caddyNo;
                    this.bookingSlot.bookingPlayers[playerIdx].caddyPreferred = data.caddy
                    this.bookingSlot.bookingPlayers[playerIdx].caddySelectionCriteria = data.caddySelectionCriteria;

                    this.caddyPairing[_caddyNo] = {
                        caddyPreferred: data.caddy,
                        caddyPairing: _caddyNo,
                        caddySelectionCriteria: data.caddySelectionCriteria,
                        caddyRequired: _caddyNo>0?true:false,
                    }
                    this.bookingSlot.bookingPlayers.forEach((p, i) => {
                        if (p.caddyPairing === this.caddyPairing[_caddyNo].caddyPairing)
                            this.setCaddySlot(i, p.caddyPairing);
                        // this.setCaddySlot(playerIdx,this.bookingSlot.bookingPlayers[playerIdx].caddyPairing);

                    })

                  //  console.log("after select caddy for pairing criteria - ", this.caddyPairing[_caddyNo], this.caddyPairing, this.caddySlots, data.caddySelectionCriteria)
                }

                // console.log("from caddy list modal - data: ", data);
                // console.log("from caddy list modal - bookingplayers : ", this.bookingSlot.bookingPlayers[b]);
                // this.flightService.updateBookingPlayerDetails(this.bookingSlot.id,this.bookingSlot.bookingPlayers[playerIdx],'caddyPreferred')
                // .subscribe((updatePlayerDetails:any)=> {

                //     this.caddyPairing[_caddyNo] = {
                //         caddyPreferred: data.caddy,
                //         caddyPairing: _caddyNo+1
                //     }
                //     // this.caddySlots[_caddyNo] = {
                //     //     caddyPreferred: data.caddy,
                //     //     caddyPairing: _caddyNo+1
                //     // }
                //   //  console.log("select preferred caddy", this.caddyPairing, this.caddyPairing[_caddyNo]);
                //     this.refreshBookingDetails();
                // })
            } else if (data && !data.selected) {
                this.caddyPairing[_caddyNo] = {
                    caddyPreferred: null,
                    caddySelectionCriteria: null
                }
                this.bookingSlot.bookingPlayers.forEach((p, i) => {
                    if (p.caddyPairing === this.caddyPairing[_caddyNo].caddyPairing)
                      //  console.log("caddy unselected ", this.caddyPairing[_caddyNo], " - ", p.caddyPairing)
                    this.setCaddySlot(i, p.caddyPairing);
                    // this.setCaddySlot(playerIdx,this.bookingSlot.bookingPlayers[playerIdx].caddyPairing);

                })
            }
        });
        caddyModal.present();
    }

    removeCaddy(playerIdx ? : number, caddyNo ? : number) {
      //  console.log("remove caddy - ", caddyNo, " : ", this.caddyPairing[caddyNo])
        this.caddyRemoveFlag = true;
        this.caddyPairing.filter((cp: BookingCaddy) => {
            return cp.caddyPairing === caddyNo
        }).map((cp) => {
            cp.caddyPairing = 1;
            cp.caddyPreferred = null;
            cp.caddySelectionCriteria = null
            cp.caddyRequired = false;
        })

        this.bookingSlot.bookingPlayers[playerIdx].caddyPairing = caddyNo;
        this.bookingSlot.bookingPlayers.forEach((p, idx) => {
            if (this.caddyPairing[caddyNo] && (p.caddyPairing === this.caddyPairing[caddyNo].caddyPairing))
                p.caddyPreferred = null;
            p.caddySelectionCriteria = null;
            this.setCaddySlot(idx, p.caddyPairing);
            // this.setCaddySlot(playerIdx,this.bookingSlot.bookingPlayers[playerIdx].caddyPairing);

        });
        // this.flightService.updateBookingPlayerDetails(this.bookingSlot.id,this.bookingSlot.bookingPlayers[playerIdx],'removeCaddy')
        // .subscribe((updatePlayerDetails: any)=>{
        //           this.refreshBookingDetails(); 
        //    })

    }

    // getPlayerType(x) {
    //     if(this.bookingSlot.bookingPlayers[x].playerType
    // }

    

    // getBuggyAssigned(x: number, attribute?: string) {
    //   //  console.log("get caddy assigned", this.bookingSlot.bookingPlayers[x])
    //     if(!this.bookingSlot || this.bookingSlot && !this.bookingSlot.bookingPlayers[x].caddyAssigned) return false;
    //   //  console.log("get caddy assigned", this.bookingSlot.bookingPlayers[x].caddyAssigned)
    //     switch(attribute) {
    //         case 'name':
    //             return this.bookingSlot.bookingPlayers[x].caddyAssigned.firstName + ' #' + this.bookingSlot.bookingPlayers[x].caddyAssigned.staffId
    //         case 'has':
    //             if(this.bookingSlot && this.bookingSlot.bookingPlayers[x].caddyAssigned)
    //                 return true
    //     }
    // }

    getCaddyAssigned(x: number, attribute?: string) {
        // console.log("get caddy assigned", this.bookingSlot.bookingPlayers[x])
        if(!this.bookingSlot || this.bookingSlot && !this.bookingSlot.bookingPlayers[x].caddyAssigned) return false;
        // console.log("get caddy assigned", this.bookingSlot.bookingPlayers[x].caddyAssigned)
        let _name;
        if(this.bookingSlot && this.bookingSlot.bookingPlayers[x].caddyAssigned && this.bookingSlot.bookingPlayers[x].caddyAssigned.firstName) _name =  this.bookingSlot.bookingPlayers[x].caddyAssigned.firstName;
        else _name = '';
        switch(attribute) {
            case 'name':
                return _name + ' #' + this.bookingSlot.bookingPlayers[x].caddyAssigned.staffId
            case 'has':
                if(this.bookingSlot && this.bookingSlot.bookingPlayers[x].caddyAssigned)
                    return true
        }
    }

    getCaddyPreferred(b: number, attribute ? : string) {
        // if(!attribute) return;
        let _caddy;
        let _caddyDisplay: Array < CaddyData > ;
        let _caddyType;
        let _caddyDisplayCriteria: Array < CaddySelectionCriteria > ;
        if (this.bookingSlot.bookingPlayers[b].caddyPreferred) {
            //  && !this.bookingSlot.bookingPlayers[b].caddySelectionCriteria.gender
            _caddyType = 'favourite';
        } else if (this.bookingSlot.bookingPlayers[b].caddySelectionCriteria && this.bookingSlot.bookingPlayers[b].caddySelectionCriteria.gender && !this.bookingSlot.bookingPlayers[b].caddyPreferred) {
            _caddyType = 'criteria';
        }
        // if (this.bookingSlot.bookingPlayers[b].caddyPreferred) {
        //     _caddy = this.bookingSlot.bookingPlayers[b].caddyPreferred;
        //     return _caddy.firstName + " #" + _caddy.staffId;
        // } else return "Tap here";
        let _caddyPairing;
        let __caddy;
        let _name;

        // console.log("get caddy preferred - ", b, " | attribute : ", attribute, " ::: ", this.bookingSlot.bookingPlayers[b])

        let _playerPairings = this.newBuggyCaddyPreference.playerPairings.map((p)=>{
            return p
        }).filter((pp)=>{
            return pp.bookingPlayerId === this.bookingSlot.bookingPlayers[b].id
        });

        // let _caddyPairings = 
        // console.log("get caddy preferred - ", _playerPairings)
        switch (attribute) {
            case 'hasCaddy':
                _caddyPairing = this.bookingSlot.bookingPlayers[b].caddyPairing;
                if(_playerPairings[0].caddyPairing === _caddyPairing  && this.bookingSlot.bookingPlayers[b].caddyPreferred)
                    // _caddy = _playerPairings.caddyPreferred.firstName + " #" + _playerPairings.caddyPreferred.staffId;
                    _caddy = true; // this.bookingSlot.bookingPlayers[b].caddyPreferred.firstName + " #" + this.bookingSlot.bookingPlayers[b].caddyPreferred.staffId;
                else _caddy = false
                
                if(!this.caddyPairing[_caddyPairing].caddyPreferred) return false
                // if (this.bookingSlot.bookingPlayers[b].caddyPairing && this.caddyPairing[_caddyPairing] && this.caddyPairing[_caddyPairing].caddyPreferred) {
                //     _caddyPairing = this.bookingSlot.bookingPlayers[b].caddyPairing;
                //     //  && !this.bookingSlot.bookingPlayers[b].caddySelectionCriteria.gender
                //     _caddyType = 'favourite';
                //     __caddy = this.caddyPairing[_caddyPairing].caddyPreferred;
                //     _caddy = this.caddyPairing[_caddyPairing].caddyPreferred.firstName + " #" + __caddy.staffId;
                // } else if (this.bookingSlot.bookingPlayers[b].caddySelectionCriteria &&
                //     this.bookingSlot.bookingPlayers[b].caddySelectionCriteria.gender &&
                //     !this.bookingSlot.bookingPlayers[b].caddyPreferred) {
                //     _caddyPairing = this.bookingSlot.bookingPlayers[b].caddyPairing;
                //     _caddyType = 'criteria';
                //     // _caddy = 'Selected Criteria';
                //     _caddy = this.caddyPairing[_caddyPairing].caddySelectionCriteria.gender + ", Aged btwn " + this.caddyPairing[_caddyPairing].caddySelectionCriteria.minAge + " and " + this.caddyPairing[_caddyPairing].caddySelectionCriteria.maxAge;
                // } else _caddy = 'Select Favourite Caddy';
                // if(_caddy==='Select Favourite Caddy') return false;
                // else return true
                return _caddy;
            case 'name':
                _caddyPairing = this.bookingSlot.bookingPlayers[b].caddyPairing;
                if(this.bookingSlot && this.bookingSlot.bookingPlayers[b].caddyPreferred && 
                    this.bookingSlot.bookingPlayers[b].caddyPreferred.firstName) _name = this.bookingSlot.bookingPlayers[b].caddyPreferred.firstName;
                else _name = '';
                if(_playerPairings[0].caddyPairing === _caddyPairing && this.bookingSlot.bookingPlayers[b].caddyPreferred)
                    _caddy = _name + " #" + this.bookingSlot.bookingPlayers[b].caddyPreferred.staffId;
                    // _caddy = _playerPairings.caddyPreferred.firstName + " #" + _playerPairings.caddyPreferred.staffId;
                else _caddy = 'Select Favourite Caddy'

                // if (this.bookingSlot.bookingPlayers[b].caddyPairing && this.caddyPairing[_caddyPairing] && this.caddyPairing[_caddyPairing].caddyPreferred) {
                //     _caddyPairing = this.bookingSlot.bookingPlayers[b].caddyPairing;
                //     //  && !this.bookingSlot.bookingPlayers[b].caddySelectionCriteria.gender
                //     _caddyType = 'favourite';
                //     __caddy = this.caddyPairing[_caddyPairing].caddyPreferred;
                //     // _caddy = this.caddyPairing[_caddyPairing].caddyPreferred.firstName + " #" + __caddy.staffId;
                //     _caddy = this.caddyPairing[_caddyPairing].caddyPreferred.firstName + " #" + __caddy.staffId;
                // } else if (this.bookingSlot.bookingPlayers[b].caddySelectionCriteria &&
                //     this.bookingSlot.bookingPlayers[b].caddySelectionCriteria.gender &&
                //     !this.bookingSlot.bookingPlayers[b].caddyPreferred) {
                //     _caddyPairing = this.bookingSlot.bookingPlayers[b].caddyPairing;
                //     _caddyType = 'criteria';
                //     // _caddy = 'Selected Criteria';
                //     _caddy = this.caddyPairing[_caddyPairing].caddySelectionCriteria.gender + ", Aged btwn " + this.caddyPairing[_caddyPairing].caddySelectionCriteria.minAge + " and " + this.caddyPairing[_caddyPairing].caddySelectionCriteria.maxAge;
                // } else _caddy = 'Select Favourite Caddy';

                return _caddy;
            case 'pairing':
                if (this.bookingSlot.bookingPlayers[b].caddyPairing) {
                    return 'Caddy ' + this.bookingSlot.bookingPlayers[b].caddyPairing
                } else if (this.bookingSlot.bookingPlayers[b].caddyPairing === 0) return 'No Caddy';
                else return 'Tap here to select';
            case 'pairing_no':
                if (this.bookingSlot.bookingPlayers[b].caddyPairing) {
                    return '# ' + this.bookingSlot.bookingPlayers[b].caddyPairing
                } else if (this.bookingSlot.bookingPlayers[b].caddyPairing === 0) return 'No Caddy';
                else return 'Tap here to select';
            case 'slot_pairing':
                if (_caddyType === 'favourite') {
                    _caddyDisplay = this.caddyPairing.filter((c: CaddyPairing) => {
                        return this.bookingSlot.bookingPlayers[b].caddyPairing === c.caddyPairing
                    }).map((c: CaddyPairing) => {
                        if (c.caddyPreferred) return c.caddyPreferred
                        else return null
                    })
                    if (this.bookingSlot.bookingPlayers[b].caddyPairing && _caddyDisplay[0] && _caddyDisplay[0].firstName) return '(' + this.bookingSlot.bookingPlayers[b].caddyPairing + ') ' + _caddyDisplay[0].firstName;
                    else return '';
                } else if (_caddyType === 'criteria') {
                    _caddyDisplayCriteria = this.caddyPairing.filter((c: CaddyPairing) => {
                        return this.bookingSlot.bookingPlayers[b].caddyPairing === c.caddyPairing
                    }).map((c: CaddyPairing) => {
                        if (c.caddySelectionCriteria) return c.caddySelectionCriteria
                        else return null
                    })
                    if (this.bookingSlot.bookingPlayers[b].caddySelectionCriteria && _caddyDisplayCriteria[0] && _caddyDisplayCriteria[0].gender)
                        return _caddyDisplayCriteria[0].gender === 'F' ? 'Female' : 'Male' + ', Age btwn ' + _caddyDisplayCriteria[0].minAge + ' and ' + _caddyDisplayCriteria[0].maxAge;
                    else return '';
                }

                case 'id':
                    return (this.bookingSlot.bookingPlayers[b] && this.bookingSlot.bookingPlayers[b].caddyPreferred.staffId) ? '#' + this.bookingSlot.bookingPlayers[b].caddyPreferred.staffId : '';
                case 'slot_pairing_id':
                    _caddyDisplay = this.caddyPairing.filter((c: CaddyPairing) => {
                        return this.bookingSlot.bookingPlayers[b].caddyPairing === c.caddyPairing
                    }).map((c: CaddyPairing) => {
                        if (c.caddyPreferred) return c.caddyPreferred
                        else return null
                    })
                    if (this.bookingSlot.bookingPlayers[b].caddyPairing && _caddyDisplay[0] && _caddyDisplay[0].firstName) return '(#' + _caddyDisplay[0].staffId + ")";
                    else return '';
                default:
                    if (this.bookingSlot.bookingPlayers[b].caddyPairing) {
                        return '# ' + this.bookingSlot.bookingPlayers[b].caddyPairing
                    } else return 'No';
        }
        // if (this.bookingSlot.bookingPlayers[b].caddyPairing) {
        //     return "#" + this.bookingSlot.bookingPlayers[b].caddyPairing
        // } else return ''

    }

    checkBuggyCaddyInfo(playerIdx: number, slot ? : number) {
        if (this.bookingSlot.bookingPlayers[playerIdx] && this.bookingSlot.bookingPlayers[playerIdx].pairingNo) return true;
        else if (this.bookingSlot.bookingPlayers[playerIdx] && this.bookingSlot.bookingPlayers[playerIdx].caddyPairing) return true
        else if (this.bookingSlot.bookingPlayers[playerIdx] && (this.bookingSlot.bookingPlayers[playerIdx].caddyPreferred || this.bookingSlot.bookingPlayers[playerIdx].caddySelectionCriteria)) return true
        else return false
    }

    tPD(event) {
      //  console.log("toggle player driving : ", event)
    }
    togglePlayerDriving(b: any, p: TeeTimeBookingPlayer, driving ? : string) {
        this.playerDriving[b] = driving
        // if(driving === 1) {
        //     this.setPlayerDriving(b,p,'me')
        // }
        // else if(driving === 2) {
        //     this.setPlayerDriving(b,p,'other')
        // }
    }

    setPlayerDriving(b: any, p: TeeTimeBookingPlayer, driving ? : string) {
        // if(this.bookingOptions && !this.bookingOptions.buggyMandatory && this.bookingSlot.bookingPlayers[b].pairingNo===0) {
        if (this.bookingSlot && this.bookingSlot.slotAssigned.allowWalking && this.bookingSlot.bookingPlayers[b].pairingNo === 0) {
            MessageDisplayUtil.showMessageToast('Please select a buggy first',
                this.platform, this.toastCtl, 3000, "bottom")
            return false;
        } else if (this.bookingSlot && !this.bookingSlot.slotAssigned.allowWalking && this.bookingSlot.bookingPlayers[b].pairingNo === 0) {
            MessageDisplayUtil.showMessageToast('Buggy is required for this slot. Please select a buggy.',
                this.platform, this.toastCtl, 3000, "bottom")
            return false;
        }
        if (this.bookingType === 'past') return false;
      //  console.log("set player driving", b, this.playerDriving, driving, this.bookingSlot.bookingPlayers[b].driving)
        let _playerIsDriving;


        let _otherPlayer = this.bookingSlot.bookingPlayers.filter((pd: TeeTimeBookingPlayer) => {
            if (pd.pairingNo === this.bookingSlot.bookingPlayers[b].pairingNo && this.bookingSlot.bookingPlayers[b].id !== pd.id)
                return true
        })
        // .map((fp:TeeTimeBookingPlayer)=>{
        //   //  console.log("me driving - other player ", fp)
        //     fp.driving = false;
        // })

      //  console.log("me driving - me  player ", this.bookingSlot.bookingPlayers[b], "|||", _otherPlayer)

        if (driving === 'me') {
            _playerIsDriving = true;
            this.bookingSlot.bookingPlayers[b].driving = _playerIsDriving;
        } else if (driving === 'other') {
            _playerIsDriving = false;
            this.bookingSlot.bookingPlayers[b].driving = _playerIsDriving;
        } else {
            _playerIsDriving = this.bookingSlot.bookingPlayers[b].driving;
            if (_otherPlayer && _otherPlayer[0]) _otherPlayer[0].driving = _playerIsDriving
            this.bookingSlot.bookingPlayers[b].driving = !_playerIsDriving;
        }
      //  console.log("set player driving after ", b, this.playerDriving, driving, _playerIsDriving, this.bookingSlot.bookingPlayers[b].driving);
      //  console.log("buggy preference - set player driving", this.buggyCaddyPreference)

        
        this.buggyCaddyPreference.ignoreBuggyUpdate = false;
        this.buggyCaddyPreference.ignoreCaddieUpdate = true;
        this.buggyCaddyPreference.playerPairings.filter((p: PlayerBuggyCaddiePreference) => {
            return p.bookingPlayerId === this.bookingSlot.bookingPlayers[b].id
        }).map((p: PlayerBuggyCaddiePreference) => {
            p.driving = !_playerIsDriving;
        })

        if (_otherPlayer && _otherPlayer[0]) {
          //  console.log("other player ", _otherPlayer)
            this.buggyCaddyPreference.playerPairings.filter((p: PlayerBuggyCaddiePreference) => {
                return p.bookingPlayerId === _otherPlayer[0].id
            }).map((p: PlayerBuggyCaddiePreference) => {
                p.driving = _playerIsDriving;
            })
        }


        this.flightService.updateBuggyCaddiePreference(this.buggyCaddyPreference)
            .subscribe((data: any) => {
              //  console.log("driving data : ", data)
                if (data.status === 200) {
                    // this.refreshBookingDetails();
                    this.refreshBookingObject(data.json())
                }
            })

        // this.flightService.updateBookingPlayerDetails(this.bookingSlot.id,this.bookingSlot.bookingPlayers[b],'driving')
        // .subscribe((data: any) => {
        //   //  console.log("driving data : ", data)
        //     if(data.status === 200) {
        //         if(_otherPlayer && _otherPlayer[0]) this.flightService.updateBookingPlayerDetails(this.bookingSlot.id,_otherPlayer[0],'driving')
        //             .subscribe((data: any) => {
        //                 this.refreshBookingDetails();
        //             });
        //         else this.refreshBookingDetails();
        //         }
        // })
        // this.playerIsDriving = !this.playerIsDriving;
    }

    getPlayerDriving(b: any) {
        this.playerDriving[b] = (this.bookingSlot.bookingPlayers[b].driving) ? 'me' : 'other';

        // this.playerDriving[b] = this.bookingSlot.bookingPlayers[b].driving;
        // console.log("get player "+b+" driving", this.playerDriving[b], this.bookingSlot.bookingPlayers[b])
        return (this.bookingSlot.bookingPlayers[b].driving) ? "Yes" : "No"
    }

    searchBookingPlayer(slot: number) { 
        // console.log("search by membership", this.searchByMembership[slot], this.searchByMembership[slot].length)
        if (!this.getAllowUpdatePostPayment() && !this.fromClub) {
        // if (this.bookingSlot.bookingStatus === 'PaymentFull') {
            MessageDisplayUtil.showMessageToast('Flight have started. Adding/Removing player is disabled. Please refer to club',
                this.platform, this.toastCtl, 3000, "bottom")
            return false;
        }
        if (!this.searchById[slot] && !this.searchByMembership[slot]) {
            // this.searchByMembership[slot].length === 0
            let alert = this.alertCtrl.create({
                title: 'Adding player',
                // subTitle: 'Selected date is '+ _date,
                message: 'Tap + or Enter membership / myG2u ID', //'Selected date is ' + '<b>' + _date + '</b>',
                buttons: ['Close']
            });
            alert.present();

            return false;
        }

        let loader = this.loadingCtrl.create({
            showBackdrop: false,
            duration: 5000,
            content: 'Getting player...'
        });



        let _searchBy;

      //  console.log("this.searchbyid[slot] : ", this.searchById[slot]);
      //  console.log("slot : ", slot)
      //  console.log("clubs : ", this.clubs);
      //  console.log("club : ", this.bookingSlot.clubData.id)
        loader.present().then(() => {
            if (this.searchById[slot] && this.searchById[slot] > 0) {
                _searchBy = this.searchById[slot];
              //  console.log("searchby - player id : ", _searchBy)
                this.flightService.getPlayerById(_searchBy)
                    .subscribe((response: any) => {
                        loader.dismiss().then(() => {
                            let player  = response.json();
                            let _playerDetails: TeeTimeBookingPlayer = {};
                            _playerDetails['walking'] = this.buggyRequired ? !this.buggyRequired : true
                            _playerDetails['caddySelectionCriteria'] = {}
                            _playerDetails['caddySelectionCriteria']['caddyRequired'] = this.caddyRequired ? this.caddyRequired : false
                          //  console.log("search player by id : ", player, " | searchBy : ", _searchBy)
                            if (response.status === 200 && player) {
                                this.checkBookingPlayer(player).then((playerOk) => {
                                  //  console.log("checkbookingplayer search :", playerOk)
                                    if (playerOk) this.addPlayerToBooking({
                                        playerId: player.id,
                                        sequence: slot,
                                        playerDetails: _playerDetails,
                                    });
                                }, (error) => {
                                  //  console.log("checkbookingplayer error : ", error)
                                })
                                this.clearSearchPlayer(slot);

                            } else {
                                let alert = this.alertCtrl.create({
                                    title: 'MyGolf2u ID',
                                    // subTitle: 'Selected date is '+ _date,
                                    message: 'No player found for MG2U ID : <br>' + _searchBy, //'Selected date is ' + '<b>' + _date + '</b>',
                                    buttons: ['Close']
                                });
                                alert.present();
                            }
                        }, (error) => {
                            loader.dismiss().then(() => {
                          //  console.log("player id error : ", error)
                                if (error.status !== 200) {
                                    let alert = this.alertCtrl.create({
                                        title: 'MyGolf2u ID',
                                        // subTitle: 'Selected date is '+ _date,
                                        message: 'No player found for MG2U ID : <br>' + _searchBy, //'Selected date is ' + '<b>' + _date + '</b>',
                                        buttons: ['Close']
                                    });
                                    alert.present();
                                }
                            });
                          //  console.log("player id error : ", error)


                        });

                    }, (error) => {
                        loader.dismiss().then(() => {
                      //  console.log("player id error : ", error)
                            if (error.status !== 200) {
                                let alert = this.alertCtrl.create({
                                    title: 'MyGolf2u ID',
                                    // subTitle: 'Selected date is '+ _date,
                                    message: 'No player found for MG2U ID : <br>' + _searchBy, //'Selected date is ' + '<b>' + _date + '</b>',
                                    buttons: ['Close']
                                });
                                alert.present();
                            }
                        });
                      //  console.log("player id error : ", error)


                    }, () =>{
                    });
            } else if (this.searchByMembership[slot] && this.searchByMembership[slot].length > 0) {
                _searchBy = this.searchByMembership[slot];
              //  console.log("searchby - player membership : ", _searchBy)


                this.flightService.searchPlayerByMembership(_searchBy, this.bookingSlot.clubData.id)
                    .subscribe((player: Array < PlayerData > ) => {
                        loader.dismiss().then(() => {
                            let _playerDetails: TeeTimeBookingPlayer = {};
                            _playerDetails['walking'] = this.buggyRequired ? !this.buggyRequired : true
                            _playerDetails['caddySelectionCriteria'] = {}
                            _playerDetails['caddySelectionCriteria']['caddyRequired'] = this.caddyRequired ? this.caddyRequired : false
                          //  console.log("search player by membership", player)
                            if (player && player.length > 0) {
                                let popover = this.popoverCtl.create(PlayerListPage, {
                                    // slot: slot,
                                    headerName: 'Players by Membership',
                                    playerList: player,
                                    forResultOnly: true
                                    // buggies: this.buggySlots,
                                    // courses: this.courses
                                }, {
                                    showBackdrop: true
                                });
                                popover.onDidDismiss((data: any) => {
                                    if (data && data.selected) {
                                        this.checkBookingPlayer(data.player).then((playerOk) => {
                                          //  console.log("checkbookingplayer :", playerOk)
                                            if (playerOk) this.addPlayerToBooking({
                                                playerId: data.player.id,
                                                sequence: slot,
                                                playerDetails: _playerDetails,
                                            });
                                        })

                                    }
                                });
                                popover.present({
                                    ev: event
                                });
                                this.clearSearchPlayer(slot);
                            } else {
                                let alert = this.alertCtrl.create({
                                    title: this.bookingSlot.clubData.name,
                                    // subTitle: 'Selected date is '+ _date,
                                    message: 'Club membership number ' + _searchBy + ' does not exist for this club', //'Selected date is ' + '<b>' + _date + '</b>',
                                    buttons: ['Close']
                                });
                                alert.present();
                            }

                        })

                    }, (error) =>{

                    }, () =>{
                    })



            }
        });

    }

    clearSearchPlayer(slot: number) {
        this.searchByMembership[slot] = null;
        this.searchById[slot] = null;
    }

    goUpdatePlayerContact(p: TeeTimeBookingPlayer) {
        if (this.bookingType === 'past') return false;
        let playerAddress = this.modalCtl.create(PlayerAddressPage, {
            player: p
        })

        playerAddress.onDidDismiss((data: any) => {
            if (data && data.save) {
              //  console.log("Came back from callback player", data.player)
              //  console.log("Came back from callback data", data)
              //  console.log("Came back from calling player ", p)
                if (!data.newPlayer) {
                    this.flightService.updateBookingPlayerContact(p.id, {
                            playerDetails: data.player.player,
                            playerContact: data.player.playerContact,
                            new: data.newPlayer
                        })
                        .subscribe((data: any) => {
                          //  console.log("from server update player contact [mg2u]: ", data)
                            this.refreshBookingDetails();
                        })
                } else {
                    this.flightService.updateBookingPlayerContact(p.id, {
                            playerDetails: {
                                address: data.address
                            },
                            playerContact: data.playerContact,
                            new: data.newPlayer
                        })
                        .subscribe((data: any) => {
                          //  console.log("from server update player contact [new]: ", data)
                            this.refreshBookingDetails();
                        })
                    // if(data.newPlayer) p = data.player
                    // this._refreshFriends(null, null);
                }
            }
        });
        playerAddress.present();



    }

    expandDetails(slot: number, type ? : string) {
        if(this.isBookingCancel()) return; 
        if (!this.getAllowUpdatePostPayment() && !this.fromClub) {
            // if (this.bookingSlot.bookingStatus === 'PaymentFull') {
            MessageDisplayUtil.showMessageToast('Flight have started. Buggy/Caddy pairing is disabled.',
                this.platform, this.toastCtl, 3000, "bottom")
            return false;
        }
        let _current = this.expandPlayers[slot];
        switch (type) {
            case 'toggle':
                this.expandPlayers.forEach((expand)=>{
                    expand = false;
                })
                // this.expandPlayers = [false, false, false, false];
                this.expandPlayers[slot] = !_current;
                // console.log("toggle", this.expandPlayers[slot])
                break;
            default:
                
                this.expandPlayers.forEach((expand)=>{
                    expand = false;
                })
                // this.expandPlayers = [false, false, false, false];
                if (this.expandPlayers[slot] === true) this.expandPlayers[slot] = false;
                else this.expandPlayers[slot] = true;
                break;
        }


        this.setBuggySeatings();
        this.setCaddyPairings();
        // this.expandPlayers.forEach((v,i)=>{
        //   //  console.log("Expand details before : slot - ",slot, ",i - ", i,", v - ",v)
        //     if(i===slot) v = true;
        //     else v = false;

        //   //  console.log("Expand details after : slot - ",slot, ",i - ", i,", v - ",v)
        // })
    }

    onCheckInPlayer(idx: number, p: TeeTimeBookingPlayer) {
        let alert = this.alertCtrl.create({
            title: 'Check-In Player',
            // subTitle: 'Selected date is '+ _date,
            message: 'Do you want to check-in for the player?', //'Selected date is ' + '<b>' + _date + '</b>',
            // buttons: ['Close'] 
            buttons: [
                {
                    text: 'Not yet',
                    handler: () => {
                        // console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Check-in',
                    handler: () => {
                        // this.bookingSlot.bookingPlayers[idx]
                        p.confirmed = true
                        // console.log('Cancel clicked');
                    }
                },
            ]
        });
        alert.present();
    }

    onCancelPlayer(idx: number, p: TeeTimeBookingPlayer) {
        let alert = this.alertCtrl.create({
            title: 'Cancel Player',
            // subTitle: 'Selected date is '+ _date,
            message: 'Do you want to cancel the player?', //'Selected date is ' + '<b>' + _date + '</b>',
            // buttons: ['Close'] 
            buttons: [
                {
                    text: 'No',
                    handler: () => {
                        // console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        // this.bookingSlot.bookingPlayers[idx]
                        p.confirmed = false;
                    }
                },
            ]
        });
        alert.present();
    }

    onBillFullDetails() {
        let itemizedBill = this.modalCtl.create(PricesDisplayPage, {
            headerName: 'Bill Details',
            slot: this.bookingSlot,
            type: 'payment_details',
            itemBill: this.bookingItemBill,
        })

        itemizedBill.onDidDismiss((data: any) => {
            // if(data && data.confirm) {
            // }
        });
        itemizedBill.present();
    }

    onViewAssignmentDetails() {
        let asmgtDetails = this.modalCtl.create(PricesDisplayPage, {
            headerName: 'Assignment Details',
            slot: this.bookingSlot,
            type: 'assignment_details',
            itemBill: this.bookingItemBill,
        })

        asmgtDetails.onDidDismiss((data: any) => {
            // if(data && data.confirm) {
            // }
        });
        asmgtDetails.present();
    }

    onCheckBuggyCaddyAssignment() {
        this.paymentMode = false;
        if(!this.checkBookingTabsComplete('2')) {
            let alert = this.alertCtrl.create({
                title: 'Minimum Players check',
                // subTitle: 'Selected date is '+ _date,
                message: 'Please check Players tab to proceed', //'Selected date is ' + '<b>' + _date + '</b>',
                // buttons: ['Close'] 
                buttons: [{
                        text: 'Close',
                        handler: () => {
                            // console.log('Cancel clicked');
                        }
                    },
                ]
            });
            alert.present();
            return false;
        } else if (!this.checkBookingTabsComplete('3')) {
            let alert = this.alertCtrl.create({
                title: 'Mandatory Buggy / Caddy check',
                // subTitle: 'Selected date is '+ _date,
                message: 'Please check Buggy & Caddie Pairing tab to proceed', //'Selected date is ' + '<b>' + _date + '</b>',
                // buttons: ['Close'] 
                buttons: [{
                        text: 'Close',
                        handler: () => {
                            // console.log('Cancel clicked');
                        }
                    },
                ]
            });
            alert.present();
            return false;
        }
        // if (this.paymentAmountType === 'deposit') this.onPayNow();
        // || this.paymentAmountType === 'mine'
        else {
            this.caddyDiff = [];
            this.buggyDiff = [];
            this.buggiesAssigned = [];
            let loader = this.loadingCtl.create({
                content: "Processing Booking...",
                showBackdrop: false
            });

            let _bookingDiff;
            let _caddyDiff;
            let _buggyDiff;

            let _buggyBoolean;
            let _caddyBoolean;

            loader.present().then(() => {
                this.flightService.processBookingAssignments(this.bookingSlot.id)
                    .subscribe((processData) => {
                        loader.dismiss().then(() => {
                            // console.log("process assignment : ", processData);
                            // console.log("process assignment body : ", processData.json());
                            let _processBooking: TeeTimeBooking = processData.json();
                            let _filteredBooking: TeeTimeBooking;
                            // this.getBookingItemizedBill();

                            //!!! this.refreshBookingObject(_processBooking);
                            // this.flightService.getBookingById(this.bookingSlot.id)
                            // .subscribe((bookingByPlayer: TeeTimeBooking) => {
                            //     this.refreshBookingObject(bookingByPlayer);
                            // });
                            this.flightService.recalculateBookingPricing(this.bookingSlot.id)
                            .subscribe((data: TeeTimeBooking)=>{
                                this.refreshBookingObject(data);
                                _processBooking = data;
                            })
                            this.flightService.getBookingItemizedBill(this.bookingSlot.id, true)
                                .subscribe((data: Response) => {
                                    this.bookingItemBill = {};
                                    let _bookingItemBill;
                                    this.refresherBill = false;
                                    if (data && data.status === 200) {
                                        _bookingItemBill = data.json();
                                        this.bookingItemBill = _bookingItemBill;
                                        if (this.bookingItemBill.changes && this.bookingItemBill.changes.length > 0) {

                                            this.paymentMode = true;
                                            this.asgmtDiff = true;
                                            this.paymentClickedBoolean = true;
                                        } else {
                                            
                                             if (this.paymentAmountType === 'deposit') { 
                                                 this.onPayNow();
                                                 return false;
                                             }
                                             else {
                                                this.paymentClickedBoolean = true;
                                                this.onPayNow();
                                                return false;

                                             }
                                        }
                                      //  console.log("data", data.json());
                                      //  console.log("data 2", data)
                                      //  console.log("data", _bookingItemBill)
                                    }

                                }, (error) => {
                                    MessageDisplayUtil.showMessageToast('Server Unreachable at the moment. Please try again.',
                                        this.platform, this.toastCtl, 3000, "bottom")
                                  //  console.log("process assignment", error)
                                    this.refresherBill = false;
                                    this.bookingItemBill = {};
                                })

                            _caddyDiff = _processBooking.bookingPlayers.filter((player: TeeTimeBookingPlayer) => {
                                    return player.caddyPairing !== 0
                                })
                                .filter((player: TeeTimeBookingPlayer) => {
                                    if (player.caddyAssigned && player.caddyPreferred)
                                        if (player.caddyAssigned.id !== player.caddyPreferred.id)
                                            return true
                                })



                            let _uniqBuggy = this.getUnique(_processBooking.bookingPlayers, 'pairingNo');
                            _buggyDiff = _processBooking.bookingPlayers.filter((player: TeeTimeBookingPlayer) => {
                                return player.pairingNo !== 0
                            })
                            // .filter((player: TeeTimeBookingPlayer)=>{
                            //     if(player.caddyAssigned && player.caddyPreferred)
                            //         if(player.caddyAssigned.id !== player.caddyPreferred.id)
                            //             return true
                            // })
                            if (_processBooking.buggiesAssigned) this.buggiesAssigned = _processBooking.buggiesAssigned;

                            _caddyDiff = this.getUnique(_caddyDiff, 'caddyPairing');
                            _buggyDiff = this.getUnique(_buggyDiff, 'pairingNo');
                            if (_processBooking.buggiesAssigned && _buggyDiff)
                                if (_processBooking.buggiesAssigned.length !== _uniqBuggy.length)
                                    _buggyBoolean = true
                            else _buggyBoolean = false
                            else _buggyBoolean = false

                            if (_caddyDiff && _caddyDiff.length === 0) console.log('do nothing')
                            else if (_caddyDiff && _caddyDiff.length > 0) {
                              //  console.log()
                            }
                            // this.caddyDiff = _bookingDiff;

                            this.caddyDiff = _caddyDiff;
                            this.buggyDiff = _buggyDiff;

                            if ((this.caddyDiff && this.caddyDiff.length > 0) || (this.buggyDiff && this.buggyDiff.length > 0))
                                this.asgmtDiff = true;
                            else this.asgmtDiff = false;
                          //  console.log("has difference - ", this.asgmtDiff, _processBooking)
                          //  console.log("has difference - caddy", _caddyDiff, this.caddyDiff)
                          //  console.log("has difference - buggy", _buggyDiff, this.buggyDiff)
                          //  console.log("has difference - uniq buggy", _uniqBuggy, '| buggies assigned - ', this.buggiesAssigned)
                        })
                    }, (error) => {

                        MessageDisplayUtil.showMessageToast('Server Unreachable at the moment. Please try again.',
                            this.platform, this.toastCtl, 3000, "bottom")
                      //  console.log("process assignment", error)
                        loader.dismiss();
                    });
            })
        }


    }

    onPayNow() {
        if(this.blockPayment()) return false;
        if(this.bookingSlot && this.bookingSlot.bookingStatus === 'PaymentFull') {
            this.onRefreshClick();
            return false;
        }
        
        
        this.getPaymentGateway(this.bookingSlot.clubData.address.countryData.id);
        let loader = this.loadingCtl.create({
            content: "Processing Booking...",
            showBackdrop: false
        });

        // loader.present().then(()=>{
        // this.flightService.processBookingAssignments(this.bookingSlot.id)
        // .subscribe((processData)=>{
        // loader.dismiss().then(()=>{
        //   //  console.log("process assignment : ", processData);
        //   //  console.log("process assignment body : ", processData.json());
        // let _processBooking: TeeTimeBooking = processData.json();
        
        let _playerAmount;
        let _playerCharges: Array<BookingPlayerCharges>;
        let _currPlayer;
        if(this.paymentAmountType === 'mine' && this.bookingItemBill && this.bookingItemBill.playerCharges.length > 0) {
            _currPlayer = this.bookingSlot.bookingPlayers.filter((tp: TeeTimeBookingPlayer)=>{
                if(tp.player) return tp.player.id === this.currentPlayer.playerId
                else return false;
            });
            _playerCharges = this.bookingItemBill.playerCharges.filter((p: BookingPlayerCharges)=>{
                if(p.bookingPlayerId && _currPlayer.length > 0 && _currPlayer[0].id) return p.bookingPlayerId === _currPlayer[0].id
                else return false;
            });
            _playerAmount = _playerCharges[0].billItems.reduce((a,b) => a += b.itemPrice, 0)
            // console.log("player amount charges ", _playerAmount);
            this.playerChargeAmount = Number(_playerAmount.toFixed(2));
        }
        
        let _depositAmount;
        let _totalDeductions = this.bookingSlot.totalDeductions;
        let _toPay = this.bookingItemBill?this.bookingItemBill.balance:this.bookingSlot.amountPayable - this.bookingSlot.amountPaid
      //  console.log("proceed to payment - toPay : ", _toPay)
      //  console.log("proceed to payment - depositAmount : ", this.depositAmount, _depositAmount)
        if (this.depositAmount > (_toPay))
            _depositAmount = (_toPay)
        else {
            if(this.paymentAmountType === 'mine') {
                if(_playerAmount > (_toPay)) { 
                     _depositAmount = (_toPay)
                } else _depositAmount = _playerAmount;
            }
            else _depositAmount = this.depositAmount;
        }
        Number(_depositAmount.toFixed(2))
        // console.log("on pay now - deposit amount", this.depositAmount)
        // console.log("on pay now - _deposit amount", _depositAmount)
        // console.log("on pay now - amount payable",this.bookingSlot.amountPayable)
        // console.log("on pay now - amount paid ", this.bookingSlot.amountPaid)
        // console.log("on pay now - parseFloat", _depositAmount.toFixed(2))
        let itemizedBill = this.modalCtl.create(PricesDisplayPage, {
            headerName: 'Itemized Bill',
            slot: this.bookingSlot,
            type: 'payment_confirm',
            paymentAmountType: this.paymentAmountType,
            depositAmount: _depositAmount,
            itemBill: this.bookingItemBill,
            paymentGatewayList: this.paymentGatewayList,
            clubPayment: this.clubPayment,
            voucherApplied: this.bookingDiscounts,
        })

        itemizedBill.onDidDismiss((data: any) => {
          //  console.log("on return from prices display page : ", data)
            if (data && data.confirm) {
              //  console.log("after confirm payment data ", data)
                // this.paymentAmountType = data.paymentAmountType;
                this.depositAmount = data.depositAmount?data.depositAmount:this.bookingOptions?this.getDepositAmount():0;
                this.selectPaymentMethod = data.selectPaymentMethod;
                // if(this.selectPaymentMethod === 'ipay88' || this.selectPaymentMethod === 'ipay88page') {
                //     this.paymentService.getIpay88Key().subscribe((data)=>{
                //       //  console.log("get ipay88 key", data)
                //         if(data && data.merchant_code && data.merchant_key) {
                //             // let _data = data.json();
                //             this.ipay88Details = {
                //                 merchantCode: data.merchant_code,
                //                 merchantKey: data.merchant_key
                //             }
                //           //  console.log('client ipay88details', this.ipay88Details)
                //         }
                        
                //     })
                    
                // }
                this.paymentConfirmClickedBoolean = true;
                this.paymentClickedBoolean = true;
                if(this.clubPayment === 'true') {
                    let _payments: Array<OfflinePayment> = data&&data.offlinePayments?data.offlinePayments:[];
                    this.clubPayNow(_payments);
                }
                // return false;
                else this.goPayNow();
            } else if (data && !data.confirm) {
                this.paymentClickedBoolean = false;
                this.onCancelAssignment();
            }
        });
        itemizedBill.present();
        return false;
        // })

        // }, (error)=>{
        //     loader.dismiss();
        // });
        // })


        // this.refreshBookingDetails();
        // let alert = this.alertCtrl.create({
        //     title: 'Make booking payment',
        //     // subTitle: 'Selected date is '+ _date,
        //     message: 'Do you want to proceed with payment?', //'Selected date is ' + '<b>' + _date + '</b>',
        //     // buttons: ['Close'] 
        //     buttons: [{
        //             text: 'No',
        //             handler: () => {
        //                 // console.log('Cancel clicked');
        //             }
        //         },
        //         {
        //             text: 'Yes',
        //             handler: () => {
        //                 this.goPayNow();
        //                 // console.log('Cancel clicked');
        //             }
        //         },
        //     ]
        // });
        // alert.present();
    }

    onProcessAssignment() {
        let loader = this.loadingCtl.create({
            content: "Processing Booking...",
            showBackdrop: false
        });

        // loader.present().then(()=>{
        this.flightService.processBookingAssignments(this.bookingSlot.id)
            .subscribe((processData) => {
                // loader.dismiss().then(()=>{
                // console.log("process assignment : ", processData);
                // console.log("process assignment body : ", processData.json());
                let _processBooking: TeeTimeBooking = processData.json();
                this.refreshBookingObject(_processBooking)

                // let itemizedBill = this.modalCtl.create(PricesDisplayPage, {
                //     headerName: 'Itemized Bill',
                //     slot: _processBooking
                // })

                // itemizedBill.onDidDismiss((data: any) => {
                //     if(data && data.confirm) {
                //         this.goPayNow();
                //     }
                // });
                // itemizedBill.present();
                // return false;
                // })

            }, (error) => {
                // loader.dismiss();
            }, ()=>{
                
                if(this.assignmentDone) this.getBookingItemizedBill(true);
            });
        // })
    }

    goPayNow(collectionId ? : string, priceInfo ? : PremiumFeaturePrice) {
        let _paymentType = this.paymentAmountType; // (B)full / (D)deposit
        let _discountAmount;
        if(this.bookingItemBill && this.bookingItemBill.discounts && this.bookingItemBill.discounts.length > 0) {
            _discountAmount = this.bookingItemBill.discounts
            .map((a:BookingDiscountBillItem)=>{
                return a.amount
            }).reduce((a,b)=>{
                // return Number(a.amount.toFixed(2)) + Number(b.amount.toFixed(2))
                return a + b
            });
        }
        let _amountPayable = this.bookingItemBill.balance; // - _discountAmount;
        // this.bookingSlot.amountPayable - this.bookingSlot.amountPaid - this.bookingSlot.totalDeductions;
        let _amountPay: number = (_paymentType === 'full') ? _amountPayable : ((this.depositAmount) ? this.depositAmount : this.bookingSlot.depositPayable);
        _amountPay = Number((_amountPay).toFixed(2));
      //  console.log("on pay now - _amountPay", _amountPay)
        // console.log("on pay now - parsefloat amountpay", _amountPay.toFixed(2))


        let _collectionId: string = 'q70lo0l_';
        if (collectionId) _collectionId = 'q70lo0l_'
        // else _collectionId = this.compCollectionId
        // console.log("create bill ",_collectionId,collectionId,this.compCollectionId)
        // console.log("create bill - player ",this.player)
        let loader = this.loadingCtl.create({
            content: "Redirecting to payment page...",
            showBackdrop: false,
            duration: 5000
        });

        // setTimeout(()=>{
        //     loader.dismiss();
        // },10000)

        // let playerPaid: PlayerPaid = {
        //     player_id: 199 //this.player.playerId
        // }

        priceInfo = {
            country: this.bookingSlot.clubData.address.countryData.currencyCode,
            currency: this.bookingSlot.slotAssigned.currency.id,
            endDate: moment("2020-06-30T00:00:00").toDate(),
            id: 2,
            price: this.bookingSlot.depositPayable,
            pricingType: "F",
            startDate: moment("2020-01-01T00:00:00").toDate(),
        }
        // priceInfo = {
        //     id: 2,
        //     country: this.bookingSlot.clubData.address.countryData.currencyCode,
        //     currency: this.bookingSlot.slotAssigned.currency.id,
        //     startDate: moment('2020-01-01').toDate(),
        //     endDate: moment('2020-12-31').toDate(),

        // };
        let _description = _paymentType === 'full' ? 'Full Payment for Booking ' : 'Deposit Payment for Booking '



        let paymentDetails: any;

        let paymentDetailsPage: any;
        let _paymentGateway = 
        (this.selectPaymentMethod.includes('ipay88'))?'ipay88':'billplz';
        // (this.selectPaymentMethod === 'ipay88' || this.selectPaymentMethod === 'ipay88page' || this.selectPaymentMethod === 'ipay88fpx') ? 'ipay88' : 'billplz';
      //  console.log("select payment methd", this.selectPaymentMethod, _paymentGateway)

        let _url = (this.selectPaymentMethod === 'ipay88fpx')?
        'http://'+this.goToPaymentURL+'.mygolf2u.com/goToPayment-fpx.html':'http://'+this.goToPaymentURL+'.mygolf2u.com/goToPayment.html';
        if(this.selectPaymentMethod === 'ipay88fpx') _url = 'http://'+this.goToPaymentURL+'.mygolf2u.com/goToPayment-fpx.html'
        else if(this.selectPaymentMethod !== 'ipay88fpx' && this.bookingSlot.clubData.address.countryData.id === 'IDN') {
            _url = 'http://'+this.goToPaymentURL+'.mygolf2u.com/goToPayment-id.html'
        } else {
        //  if(this.selectPaymentMethod !== 'ipay88fpx' && this.bookingSlot.clubData.address.countryData.id === 'MYR') {
            _url = 'http://'+this.goToPaymentURL+'.mygolf2u.com/goToPayment.html'
        } 


        // 'http://dev-play.mygolf2u.com/test/goToPayment-fpx.html':'http://dev-play.mygolf2u.com/test/goToPayment.html'
        let _signature;
        // _signature = 'huqhrKBj1i'+'M27515'+'TestPay88_'+moment().format('HHmmss')+'1'+this.bookingSlot.slotAssigned.currency.id;
        // console.log("ipay88 signature", _signature)
        // console.log(sha256(_signature));
        // let sha256_signature = sha256(_signature);

        ////// ipay88
        let _pgRegion;
        let _countryId;
        let _type;
        let _selPM;
        if(_paymentGateway === 'ipay88' && this.selectPaymentMethod === 'ipay88fpx') {
            _selPM = 'ipay88-fpx'
        } else if(_paymentGateway === 'ipay88' && this.selectPaymentMethod !== 'ipay88fpx') {
            if(this.bookingSlot.clubData.address.countryData.id === 'IDN') {
                _selPM = 'ipay88-id'
            } else _selPM = 'ipay88'
        } else _selPM = 'billplz'
        // let _str = 'ipay88-id'
        // console.log(_str.includes(_paymentGateway))
        let _mobile;
      //  console.log('current player - before : ', this.currentPlayer)
        if(!this.fromClub) {
            this.bookingSlot.bookingPlayers.filter((bp)=>{
                if(bp.player && bp.player.id) return bp.player.id === this.currentPlayer.playerId
                else return false
            }).map((p)=>{
                if(p.player) {
                    _mobile = p.player.address.phone1
                    this.currentPlayer.addressInfo = p.player.address
                }
            })
        } else if(this.fromClub) {
            if(this.bookingSlot.bookedByPlayer) _mobile = this.bookingSlot.bookedByPlayer.phone
            else if(this.bookingSlot.bookingPlayers[0].phone) _mobile = this.bookingSlot.bookingPlayers[0].phone
            else if(this.bookingSlot.clubData.contactPerson) _mobile = this.bookingSlot.clubData.contactPerson;
            else if(this.bookingSlot.clubData.address.phone1) _mobile = this.bookingSlot.clubData.address.phone1;
            else if(this.bookingSlot.clubData.address.phone2) _mobile = this.bookingSlot.clubData.address.phone2;
            else _mobile = '';
            if(_mobile && _mobile.startsWith('60') && (_mobile.length === 0 || _mobile.length < 11)) {
                _mobile = this.bookingSlot.clubData.address.phone1?this.bookingSlot.clubData.address.phone1:this.bookingSlot.clubData.address.phone2
            } else if(_mobile && !_mobile.startsWith('60') && (_mobile.length === 0 || _mobile.length < 10)) {
                _mobile = this.bookingSlot.clubData.address.phone1?this.bookingSlot.clubData.address.phone1:this.bookingSlot.clubData.address.phone2
            }
        }
        let _phoneLength;
        if(!this.fromClub && _mobile && _mobile.startsWith('60')) _phoneLength = 11; //11; 
        else if(!this.fromClub && _mobile && !_mobile.startsWith('0')) _phoneLength = 11;
        else _phoneLength = 10;
        // else _phoneLength = 5;
        if(!this.fromClub && this.selectPaymentMethod.includes('billplz') 
        && (!_mobile || _mobile.length === 0 || _mobile.length < _phoneLength) && !this.dummyPhoneNumber) {
            let _bookedPlayer =  this.bookingSlot.bookingPlayers.filter((bp)=>{
                return bp.player.id === this.currentPlayer.playerId
            });
            if(_bookedPlayer && _bookedPlayer.length > 0) {
                let alert = this.alertCtrl.create({
                    title: 'Insufficient Player Info',
                    // subTitle: 'Selected date is '+ _date,
                    message: 'This Payment Gateway needs a valid phone number to proceed. Do you want to update profile?', //'Selected date is ' + '<b>' + _date + '</b>',
                    // buttons: ['Close']
                    buttons: [{
                        text: 'No'
                    },{
                        text: 'Update',
                        handler: () => {
                            
                                let modal = this.modalCtl.create(EditProfilePage, {
                                homeInfo: this.playerHomeInfo$,
                                player  : this.player$,
                                type    : 'playerProfile'
                                });
                                
                                modal.onDidDismiss((data?: any) => {
                                    // this.refreshProfile();
                                    this.refreshBookingDetails()
                                  //  console.log('current player - after : ', this.currentPlayer)
    
                                });
                                modal.present();
                                }
    
                    }]
                });
                alert.present();
            } else if(!this.dummyPhoneNumber) {
                let alert = this.alertCtrl.create({
                    title: 'Insufficient Player Info',
                    // subTitle: 'Selected date is '+ _date,
                    message: 'This Payment Gateway needs a valid phone number to proceed. Do you want to add different phone number?', //'Selected date is ' + '<b>' + _date + '</b>',
                    // buttons: ['Close']
                    inputs: [{
                        name: 'phone',
                        placeholder: 'Phone Number (min length 11)',
                        type: 'number'
                    }, ],
                    buttons: [{
                        text: 'No'
                    },{
                        text: 'Update',
                        handler: data => {
                            this.dummyPhoneNumber = data.phone;
                            
                                }
    
                    }]
                });
                alert.onDidDismiss(()=>{
                    this.goPayNow();
                }) 
                alert.present();
            }
            
            
            return false;
        }
        if(this.paymentGatewayList)
            this.paymentGatewayList.filter((pg: PaymentGatewayInfo)=>{
              //  console.log("filtered payment gateway region ", _paymentGateway, pg)
                return pg.type === _paymentGateway && pg.id === this.selectPaymentMethod
                // && pg.id === _selPM
                // console.log("filtered payment gateway region 1 : ", )
                // return pg.id.includes(_paymentGateway)
            }).map((pg)=>{
                _pgRegion = pg.id
                _countryId = pg.country_id;
                _type = pg.type;
                this.ipay88Details = {
                    merchantCode: pg.merchant_code,
                    merchantKey: pg.merchant_key
                }
                // this.ipay88Details.merchantCode = pg.merchant_code;
                // this.ipay88Details.merchantKey = pg.merchant_key;
                this.paymentBackendURL = pg.callback_url;
                this.paymentRedirectURL = pg.redirect_url;
                this.paymentInternalURL = pg.internal_payment_url;
                this.paymentPageURL = pg.http_server + pg.payment_url;
                this.pgDescription = pg.description
              //  console.log("filtered payment gateway region - sign algo : ", pg.signature_algorithm, this.paymentSignAlgo)
                if(pg.signature_algorithm && pg.signature_algorithm.length > 0) this.paymentSignAlgo = pg.signature_algorithm;
                if(pg.signature_algorithm && pg.signature_algorithm.length > 0) this.paymentSignAlgo = this.paymentSignAlgo.replace('-','');
                _url = this.paymentInternalURL?this.paymentInternalURL:pg.internal_payment_url;
            })
        if(this.pgDescription.toLowerCase().includes('Sandbox'.toLowerCase())) _amountPay = 10000;
            
        // if(_paymentGateway === 'ipay88' && this.bookingSlot.clubData.address.countryData.id === 'IDN') _pgRegion = 'ipay88-id'
        // if(_paymentGateway === 'ipay88' && this.bookingSlot.clubData.address.countryData.id === 'MYS') _pgRegion = 'ipay88-id'
        // else if(_paymentGateway !== 'billplz') _pgRegion = 'ipay88'
        // else _pgRegion = 'billplz'
      //  console.log("payment gateway region ", _pgRegion, _paymentGateway, this.paymentGatewayList)
      //  console.log("internal payment url ", _url, this.paymentInternalURL)
        // if (this.selectPaymentMethod === 'ipay88') {
        //     paymentDetails = {
        //         "collection_id": 'q70lo0l_',
        //         "amount": 100,
        //         "email": this.currentPlayer.email,// this.bookingSlot.bookedByPlayer.email,
        //         "name": this.currentPlayer.playerName, //this.bookingSlot.bookedByPlayer.playerName,
        //         "mobile": this.currentPlayer.addressInfo.phone1, //this.bookingSlot., no phone in bookedbyplayer!
        //         "description": _description + this.bookingSlot.bookingReference,
        //         "currency": this.bookingSlot.slotAssigned.currency.id,
        //         "callback_url": this.paymentBackendURL,
        //         "redirect_url": this.paymentRedirectURL,
        //         "bill_type": 'booking',
        //         "bill_type_id": this.bookingSlot.id,
        //         "paid_by": this.currentPlayerId,
        //         "payer_type": 'R',
        //         "payment_type": _paymentType === 'full' ? 'B' : 'D',
        //         "payment_gateway": _pgRegion,
        //     }
        //     // this.bookingSlot.clubData.address.countryData.id === 'IDN'
        // } else if (this.selectPaymentMethod === 'ipay88page' || this.selectPaymentMethod === 'ipay88fpx') {
            if(this.selectPaymentMethod.toLowerCase().includes('ipay88')) {
            // let _amount = (_pgRegion.toLowerCase().includes('ipay88-id'))?_amountPay*100:1*100;
            
            let _amount;
            
          //  console.log("[4] payment details : ", _amount, _amountPay)
            if(_pgRegion.toLowerCase().includes('ipay88-id') && !this.pgDescription.toLowerCase().includes('sandbox'))
                _amount = _amountPay*100;
            else if(_pgRegion.toLowerCase().includes('ipay88-id')  && this.pgDescription.toLowerCase().includes('sandbox'))
                _amount = _amountPay;
            
            // else if(!_pgRegion.toLowerCase().includes('ipay88-id') && this.pgDescription.toLowerCase().includes('Sandbox'.toLowerCase())) _amount = 1;
            else if(_type.toLowerCase().includes('ipay88') && _countryId.toLowerCase()==='mys' && !this.pgDescription.toLowerCase().includes('Sandbox'.toLowerCase())) _amount = _amountPay*100;
            else if(_type.toLowerCase().includes('ipay88') && _countryId.toLowerCase()==='mys' && this.pgDescription.toLowerCase().includes('Sandbox'.toLowerCase())) _amount = 100;
            else _amount = _amountPay*100;
            // 10000*100:1*100;
            //_pgRegion==='ipay88-id'?10000*100:1*100;
            // _amountPay*100:1*100;
            let _userEmail;
            let _userName;
            let _userContact;
            if(this.fromClub) {
                if(this.bookingSlot.bookedByPlayer && this.bookingSlot.bookedByPlayer.id) {
                    _userEmail = this.bookingSlot.bookedByPlayer.email;
                    _userName = this.bookingSlot.bookedByPlayer.playerName;
                    _userContact = this.bookingSlot.bookedByPlayer.phone; //?this.bookingSlot.bookedByPlayer.phone:_mobile;
                } else if(!this.bookingSlot.bookedByPlayer) {
                    let _player = this.bookingSlot.bookingPlayers.filter((p: TeeTimeBookingPlayer)=>{
                        return p.email
                    });
                    if(_player && _player.length > 0) {
                        _userEmail = _player[0].email;
                        _userName = _player[0].playerName;
                        _userContact = _player[0].phone; //?this.bookingSlot.bookingPlayers[0].phone:_mobile;
                    } else if(this.bookingSlot.clubData && this.bookingSlot.clubData.contactEmail) {
                        _userEmail = this.bookingSlot.clubData.contactEmail;
                        _userName = this.bookingSlot.clubData.contactPerson;
                        // _userContact = this.bookingSlot
                    } else if(this.bookingSlot.clubData.address && this.bookingSlot.clubData.address.email) {
                        _userEmail = this.bookingSlot.clubData.address.email;
                        _userName = this.bookingSlot.clubData.name;
                        if(this.bookingSlot.clubData.address.phone1) 
                            _userContact = this.bookingSlot.clubData.address.phone1
                        else if(this.bookingSlot.clubData.address.phone2)
                            _userContact = this.bookingSlot.clubData.address.phone2
                        else if(this.bookingSlot.clubData.address.fax)
                            _userContact = this.bookingSlot.clubData.address.fax
                    }
                    // _userEmail = this.bookingSlot.bookingPlayers[0].email;
                    // _userName = this.bookingSlot.bookingPlayers[0].playerName;
                    // _userContact = this.bookingSlot.bookingPlayers[0].phone;//?this.bookingSlot.bookingPlayers[0].phone:_mobile;
                }
            } else {
                if(this.currentPlayer) {
                    _userEmail = this.currentPlayer.email;
                    _userName = this.currentPlayer.playerName;
                    _userContact = this.currentPlayer.phone;
                } else if(!this.currentPlayer && this.bookingSlot.bookedByPlayer) {
                    _userEmail = this.bookingSlot.bookedByPlayer.email;
                    _userName = this.bookingSlot.bookedByPlayer.playerName;
                    _userContact = this.bookingSlot.bookedByPlayer.phone;
                }
            }
            
          //  console.log("[3] payment details : ", _amount, _amountPay, Number(_amountPay*100).toFixed(0), Number(_amount).toFixed(0))
            _amount = Number(_amount).toFixed(0);
            paymentDetails = {
                "collection_id": 'q70lo0l_',
                "amount": _amount,
                // "email": this.fromClub?this.bookingSlot.bookingPlayers[0].email:this.currentPlayer.email,//this.bookingSlot.bookedByPlayer.email,
                // "name": this.fromClub?this.bookingSlot.bookingPlayers[0].playerName:this.currentPlayer.playerName,//this.bookingSlot.bookedByPlayer.playerName,
                // "mobile": this.fromClub?this.bookingSlot.bookingPlayers[0].player.address.phone1:this.currentPlayer.addressInfo.phone1,//this.bookingSlot.bookedByPlayer.address.phone1 ? this.bookingSlot.bookedByPlayer.address.phone1 : this.bookingSlot.bookedByPlayer.address.phone2, //this.bookingSlot., no phone in bookedbyplayer!
                "email": _userEmail,
                "name": _userName,
                "mobile": _userContact,
                "description": _description + this.bookingSlot.bookingReference,
                "currency": this.bookingSlot.slotAssigned.currency.id,
                "callback_url": this.paymentBackendURL, //'http://devlet.mygolf2u.com/rest/payment/ipay88/backend',
                "redirect_url": this.paymentRedirectURL,
                "bill_type": 'booking',
                "bill_type_id": this.bookingSlot.id,
                "paid_by": this.fromClub?this.currSession.userId:this.currentPlayerId,
                "payer_type": this.fromClub?'C':'R', //R-egistered, P-aid by one of the player, U-paid by someone else, C-lub user
                "payment_type": _paymentType === 'full' ? 'B' : 'D',
                "payment_gateway": _pgRegion,
            }
            // paymentDetailsPage = {
            //     "MerchantCode" : 'M27515',
            //     "PaymentId" : '',
            //     "RefNo" : 'TestPay88_'+moment().format('HHmmss'),
            //     "Amount": 1.00,
            //     "Currency" : this.bookingSlot.slotAssigned.currency.id,
            //     "ProdDesc" : _description+this.bookingSlot.bookingReference,
            //     "UserName" : this.bookingSlot.bookedByPlayer.playerName,
            //     "UserEmail" : this.bookingSlot.bookedByPlayer.email,
            //     "UserContact" : this.bookingSlot.bookedByPlayer.address.phone1?this.bookingSlot.bookedByPlayer.address.phone1:this.bookingSlot.bookedByPlayer.address.phone2, //this.bookingSlot., no phone in bookedbyplayer!
            //     "Remark" : 'testing ipay88 for booking payment',
            //     "SignatureType": 'SHA256',
            //     "Signature": sha256_signature,
            //     "ResponseURL": 'http://mtest.mygolf2u.com/test/payment_redirect.html',
            //     // "ResponseURL": 'http://azu-play.mygolf2u.com/payment_redirect.html',
            //     // "BackendURL": 'http://azulet.mygolf2u.com/rest/payment/ipay88/backend',
            //     "BackendURL": 'http://mtest.mygolf2u.com/test/rest/payment/ipay88/backend',
            //   }
        } else if (this.selectPaymentMethod.toLowerCase().includes('billplz')){
            let _userEmail;
            let _userName;
            let _userContact;
            if(this.fromClub) {
                if(this.bookingSlot.bookedByPlayer && this.bookingSlot.bookedByPlayer.id) {
                    _userEmail = this.bookingSlot.bookedByPlayer.email;
                    _userName = this.bookingSlot.bookedByPlayer.playerName;
                    _userContact = this.bookingSlot.bookedByPlayer.phone; //?this.bookingSlot.bookedByPlayer.phone:_mobile;
                } else if(!this.bookingSlot.bookedByPlayer) {
                    let _player = this.bookingSlot.bookingPlayers.filter((p: TeeTimeBookingPlayer)=>{
                        return p.email
                    });
                    if(_player && _player.length > 0) {
                        _userEmail = _player[0].email;
                        _userName = _player[0].playerName;
                        _userContact = _player[0].phone; //?this.bookingSlot.bookingPlayers[0].phone:_mobile;
                    } else if(this.bookingSlot.clubData && this.bookingSlot.clubData.contactEmail) {
                        _userEmail = this.bookingSlot.clubData.contactEmail;
                        _userName = this.bookingSlot.clubData.contactPerson;
                        // _userContact = this.bookingSlot
                    } else if(this.bookingSlot.clubData.address && this.bookingSlot.clubData.address.email) {
                        _userEmail = this.bookingSlot.clubData.address.email;
                        _userName = this.bookingSlot.clubData.name;
                        if(this.bookingSlot.clubData.address.phone1) 
                            _userContact = this.bookingSlot.clubData.address.phone1
                        else if(this.bookingSlot.clubData.address.phone2)
                            _userContact = this.bookingSlot.clubData.address.phone2
                        else if(this.bookingSlot.clubData.address.fax)
                            _userContact = this.bookingSlot.clubData.address.fax
                    }
                    // _userEmail = this.bookingSlot.bookingPlayers[0].email;
                    // _userName = this.bookingSlot.bookingPlayers[0].playerName;
                    // _userContact = this.bookingSlot.bookingPlayers[0].phone;//?this.bookingSlot.bookingPlayers[0].phone:_mobile;
                }
            } else {
                if(this.currentPlayer) {
                    _userEmail = this.currentPlayer.email;
                    _userName = this.currentPlayer.playerName;
                    _userContact = this.currentPlayer.phone;
                } else if(!this.currentPlayer && this.bookingSlot.bookedByPlayer) {
                    _userEmail = this.bookingSlot.bookedByPlayer.email;
                    _userName = this.bookingSlot.bookedByPlayer.playerName;
                    _userContact = this.bookingSlot.bookedByPlayer.phone;
                }
            }
            /////// billplz
            // Number(_amountPay.toFixed(2))  * 100
            let _amount = Number(_amountPay*100).toFixed(0);
            let _phoneNumber = _mobile?_mobile:this.dummyPhoneNumber;
            // this.currentPlayer.addressInfo.phone1
            paymentDetails = {
                "collection_id": 'q70lo0l_',
                "amount": _amount,
                "email": _userEmail, //this.fromClub?this.bookingSlot.bookingPlayers[0].email:this.currentPlayer.email,// this.bookingSlot.bookedByPlayer.email,
                "name": _userName, //this.fromClub?this.bookingSlot.bookingPlayers[0].playerName:this.currentPlayer.playerName, //this.bookingSlot.bookedByPlayer.playerName,
                "mobile": _userContact, //this.fromClub?this.bookingSlot.bookingPlayers[0].player.address.phone1:this.currentPlayer.addressInfo.phone1, //this.bookingSlot.bookedByPlayer.address.phone1 , //this.bookingSlot., no phone in bookedbyplayer!
                "description": _description + this.bookingSlot.bookingReference,
                "currency": this.bookingSlot.slotAssigned.currency.id,
                "callback_url": this.paymentCallbackURL,// 'http://devlet.mygolf2u.com/rest/payment/billplz/callback',
                "redirect_url": this.paymentRedirectURL, //'http://mtest.mygolf2u.com/test/payment_redirect.html',
                "bill_type": 'booking',
                "bill_type_id": this.bookingSlot.id,
                "paid_by": this.fromClub?this.currSession.userId:this.currentPlayerId,
                "payer_type": this.fromClub?'C':'R',
                "payment_type": _paymentType === 'full' ? 'B' : 'D',
                "payment_gateway": 'billplz',
            }
        } else {
            let _userEmail;
            let _userName;
            let _userContact;
            if(this.fromClub) {
                if(this.bookingSlot.bookedByPlayer && this.bookingSlot.bookedByPlayer.id) {
                    _userEmail = this.bookingSlot.bookedByPlayer.email;
                    _userName = this.bookingSlot.bookedByPlayer.playerName;
                    _userContact = this.bookingSlot.bookedByPlayer.phone; //?this.bookingSlot.bookedByPlayer.phone:_mobile;
                } else if(!this.bookingSlot.bookedByPlayer) {
                    let _player = this.bookingSlot.bookingPlayers.filter((p: TeeTimeBookingPlayer)=>{
                        return p.email
                    });
                    if(_player && _player.length > 0) {
                        _userEmail = _player[0].email;
                        _userName = _player[0].playerName;
                        _userContact = _player[0].phone; //?this.bookingSlot.bookingPlayers[0].phone:_mobile;
                    } else if(this.bookingSlot.clubData && this.bookingSlot.clubData.contactEmail) {
                        _userEmail = this.bookingSlot.clubData.contactEmail;
                        _userName = this.bookingSlot.clubData.contactPerson;
                        // _userContact = this.bookingSlot
                    } else if(this.bookingSlot.clubData.address && this.bookingSlot.clubData.address.email) {
                        _userEmail = this.bookingSlot.clubData.address.email;
                        _userName = this.bookingSlot.clubData.name;
                        if(this.bookingSlot.clubData.address.phone1) 
                            _userContact = this.bookingSlot.clubData.address.phone1
                        else if(this.bookingSlot.clubData.address.phone2)
                            _userContact = this.bookingSlot.clubData.address.phone2
                        else if(this.bookingSlot.clubData.address.fax)
                            _userContact = this.bookingSlot.clubData.address.fax
                    }
                    // _userEmail = this.bookingSlot.bookingPlayers[0].email;
                    // _userName = this.bookingSlot.bookingPlayers[0].playerName;
                    // _userContact = this.bookingSlot.bookingPlayers[0].phone;//?this.bookingSlot.bookingPlayers[0].phone:_mobile;
                }
            } else {
                if(this.currentPlayer) {
                    _userEmail = this.currentPlayer.email;
                    _userName = this.currentPlayer.playerName;
                    _userContact = this.currentPlayer.phone;
                } else if(!this.currentPlayer && this.bookingSlot.bookedByPlayer) {
                    _userEmail = this.bookingSlot.bookedByPlayer.email;
                    _userName = this.bookingSlot.bookedByPlayer.playerName;
                    _userContact = this.bookingSlot.bookedByPlayer.phone;
                }
            }
            /////// billplz
            // Number(_amountPay.toFixed(2))  * 100
            let _amount = Number(_amountPay*100).toFixed(0);
          //  console.log("[0] payment details : ", _amount, _amountPay)
            paymentDetails = {
                "collection_id": 'q70lo0l_',
                "amount": _amount,
                "email": _userEmail,// this.fromClub?this.bookingSlot.bookingPlayers[0].email:this.currentPlayer.email,// this.bookingSlot.bookedByPlayer.email,
                "name": _userName,// this.fromClub?this.bookingSlot.bookingPlayers[0].playerName:this.currentPlayer.playerName, //this.bookingSlot.bookedByPlayer.playerName,
                "mobile": _userContact,// this.fromClub?this.bookingSlot.bookingPlayers[0].player.address.phone1:this.currentPlayer.addressInfo.phone1, //this.bookingSlot.bookedByPlayer.address.phone1 , //this.bookingSlot., no phone in bookedbyplayer!
                "description": _description + this.bookingSlot.bookingReference,
                "currency": this.bookingSlot.slotAssigned.currency.id,
                "callback_url": this.paymentCallbackURL,// 'http://devlet.mygolf2u.com/rest/payment/billplz/callback',
                "redirect_url": this.paymentRedirectURL, //'http://mtest.mygolf2u.com/test/payment_redirect.html',
                "bill_type": 'booking',
                "bill_type_id": this.bookingSlot.id,
                "paid_by": this.fromClub?this.currSession.userId:this.currentPlayerId,
                "payer_type": this.fromClub?'C':'R',
                "payment_type": _paymentType === 'full' ? 'B' : 'D',
                "payment_gateway": 'billplz',
            }
        }

        // if(this.selectPaymentMethod === 'ipay88page') {
        //     let _ipayUrl = 'https://payment.ipay88.com.my/epayment/entry.asp'
        //                 // let _merchantCode = paymentDetailsPage['MerchantCode'];
        //                 let _MerchantCode = paymentDetailsPage["MerchantCode"]
        //                 let _PaymentId = paymentDetailsPage["PaymentId"]
        //                 let _RefNo = paymentDetailsPage["RefNo"]
        //                 let _Amount = paymentDetailsPage["Amount"]
        //                 let _Currency = paymentDetailsPage["Currency"]
        //                 let _ProdDesc = paymentDetailsPage["ProdDesc"]
        //                 let _UserName = paymentDetailsPage["UserName"]
        //                 let _UserEmail = paymentDetailsPage["UserEmail"]
        //                 let _UserContact = paymentDetailsPage["UserContact"]
        //                 let _Remark = paymentDetailsPage["Remark"]
        //                 let _SignatureType = paymentDetailsPage["SignatureType"]
        //                 let _Signature = paymentDetailsPage["Signature"]
        //                 let _ResponseURL = paymentDetailsPage["ResponseURL"]
        //                 let _BackendURL = paymentDetailsPage["BackendURL"]

        //                 let _params = 
        //                 'MerchantCode=' + _MerchantCode +
        //                 '&PaymentId=' + _PaymentId +
        //                 '&RefNo=' + _RefNo +
        //                 '&Amount=' + _Amount +
        //                 '&Currency=' + _Currency +
        //                 '&ProdDesc=' + _ProdDesc +
        //                 '&UserName=' + _UserName +
        //                 '&UserEmail=' + _UserEmail +
        //                 '&UserContact=' + _UserContact +
        //                 '&Remark=' + _Remark +
        //                 '&SignatureType=' + _SignatureType +
        //                 '&Signature=' + _Signature +
        //                 '&ResponseURL=' + _ResponseURL +
        //                 '&BackendURL=' + _BackendURL;
        //                 // _ipayUrl = '/ipay88page'
        //               //  console.log("ipay88 test ", _params, _ipayUrl);

        //                 let map;
        //                 // var mapForm = document.createElement("form");
        //                 // mapForm.target = "_self";
        //                 // mapForm.method = "POST"; // or "post" if appropriate
        //                 // mapForm.action = _ipayUrl;

        //                 // var merchantCodeInput = document.createElement("input");
        //                 // merchantCodeInput.type = "text";
        //                 // merchantCodeInput.name = "MerchantCode";
        //                 // merchantCodeInput.value = _MerchantCode;
        //                 // merchantCodeInput.appendChild(merchantCodeInput);


        //                 var form = document.createElement("form");
        //                 form.target = "_system";
        //                 form.method = "GET";
        //                 form.action = _url;
        //                 form.style.display = "none";

        //                 for (var key in paymentDetailsPage) {
        //                     var input = document.createElement("input");
        //                     input.type = "hidden";
        //                     input.name = key;
        //                     input.value = paymentDetailsPage[key];
        //                     form.appendChild(input);
        //                 }

        //                 let _pageHeader = '<html><head></head><body><form id="loginForm" action="'+_ipayUrl+'" method="post">';
        //                 let _pageBody;
        //                 for (var key in paymentDetailsPage) {
        //                     _pageBody += '<input type="hidden" name="'+key+'" value="' + paymentDetailsPage[key] + '">'
        //                 }
        //                 let _pageEnd = '</form> <script type="text/javascript">document.getElementById("loginForm").submit();</script></body></html>';
        //                 let _pageContent = _pageHeader + _pageBody + _pageEnd;

        //               //  console.log('calling ipay88 page', _pageContent)
        //                 let _pageContentUrl = 'data:text/html;base64,' + btoa(_pageContent);

        //                 // var browserRef = window.cordova.InAppBrowser.open(
        //                 //     pageContentUrl ,
        //                 //     "_blank",
        //                 //     "hidden=no,location=no,clearsessioncache=yes,clearcache=yes"
        //                 // );


        //                 // map = window.open("", "_self");



        //                 // 'http://azu-play.mygolf2u.com/goToPayment.html'
        //                 // 'data:text/html;base64,' + btoa(_pageContent);
        //               //  console.log("platform open", this.platform.platforms() )
        //                 // if (this.platform.is('cordova')) {
        //                 //   //  console.log('open with in app')
        //                 //     // this.openWithInAppBrowser(_url)
        //                 //     let win = window.open("", '_system'); 

        //                 //     document.body.appendChild(form);
        //                 //     form.submit();
        //                 //     document.body.removeChild(form);
        //                 // } else if(this.platform.is('mobileweb') || this.platform.is('mobile')
        //                 // ||this.platform.is('android')||this.platform.is('phablet')) {
        //                 //     // ["mobile", "android", "phablet", "mobileweb"]
        //                 //   //  console.log('open with cordova browser android')
        //                 //     // this.openWithCordovaBrowser(_url)
        //                 //     let win = window.open("", '_system');
        //                 //     // _url+'?MerchantCode="124124"'


        //                 //     //not allowed
        //                 //     document.body.appendChild(form);
        //                 //     form.submit();
        //                 //     document.body.removeChild(form);
        //                 // } else if(this.platform.is('mobileweb') || this.platform.is('mobile')
        //                 // ||this.platform.is('ios')||this.platform.is('iphone')) {
        //                 //     // ["mobile", "android", "phablet", "mobileweb"]
        //                 //   //  console.log('open with cordova browser ios')
        //                 //     // this.openWithCordovaBrowser(_url)
        //                 //     let win = window.open(_url, '_system');

        //                 //     document.body.appendChild(form);
        //                 //     form.submit();
        //                 //     document.body.removeChild(form);
        //                 //     // ["mobile", "ios", "iphone", "mobileweb"]
        //                 // }
        //                 // else {
        //                 //   //  console.log('open with system browser')
        //                 //     // this.openWithSystemBrowser(_url)
        //                 //     let win = window.open(_url, '_system');

        //                 //     //     if(win) win.onunload = function () {
        //                 //     //       //  console.log("window unload")
        //                 //     //     }

        //                 //     document.body.appendChild(form);
        //                 //     form.submit();
        //                 //     document.body.removeChild(form);

        //                 // }


        // } 




      //  console.log('processing payment - calling create bill', paymentDetails, _paymentGateway)
        
      //  console.log('processing payment - calling create bill', _amountPay?_amountPay:'', Number(_amountPay.toFixed(2)), Number(_amountPay*100).toFixed(0))

        // if(this.selectPaymentMethod === 'ipay88page') return false;
        loader.present().then(() => {
            this.paymentService.createBill(_collectionId, paymentDetails, _paymentGateway)
                .subscribe((data: any) => {
                    loader.dismiss().then(() => {
                      //  console.log("get billplz collections", data)
                        // if(data) {
                        // //   this.paidBillId = data.id
                        // }
                        if (data.url && this.selectPaymentMethod.toLowerCase().includes('billplz')) {
                        // (data.url && this.selectPaymentMethod !== 'ipay88' && this.selectPaymentMethod !== 'ipay88page' 
                        // && this.selectPaymentMethod !== 'ipay88fpx') {
                            if (this.platform.is('cordova')) {
                                this.openWithInAppBrowser(data.url,null,'getBill',data)
                                
                                // MessageDisplayUtil.showMessageToast('cordova browser',
                                //     this.platform, this.toastCtl, 10000, "bottom")
                            } 
                            // else if (this.platform.is('ios') || this.platform.is('iphone')) {
                            //     this.openWithInAppBrowser(data.url,null,'getBill',data)

                            //     // let win = window.open(data.url, '_system');
                            //     // win.location.href = data.url;
                            //     // let winTick = setInterval(()=> {
                            //     //     if (win.closed) {
                            //     //         clearInterval(winTick);
                            //     //         this.getBill(data.id, 'billplz');
                            //     //       //  console.log('window closed!');
                            //     //     }
                            //     // }, 500);
                            // } 
                            else {
                              //  console.log("create bill payment page ", data, " - ", this.platform)
                                // this.openWithCordovaBrowser(data.url);
                                let win = window.open(data.url, '_system');

                                let winTick = setInterval(()=> {
                                    if (win && win.closed) {
                                        clearInterval(winTick);
                                        this.getBill(data.id, 'billplz');
                                      //  console.log('window closed!');
                                    }
                                }, 500);

                                // var browserRef = window.open(data.url,"_blank","hidden=no,location=no,clearsessioncache=yes,clearcache=yes,hardwareback=no");
                                // browserRef.addEventListener('loadstop', function(e: InAppBrowserEvent) {
                                // var loc = e.url;
                                // if(loc == "http://tax.lsgkerala.gov.in/epayment/paymentreturn.php")
                                // {
                                //         setTimeout(function () {
                                //         browserRef.close();
                                //         }, 5000);  
                                // }
                                // });


                            }

                            // if(data) {
                            //     //   this.paidBillId = data.id;

                            //     //  console.log("before interval", this.paymentStatus)
                            //       let intervalId = setInterval(()=>{
                            //       //  console.log("interval : ", this.paymentStatus)
                            //         if(this.paymentStatus.toLowerCase() !== 'paid') this.getBill(data.id,'billplz') //console.log("not paid") 
                            //         else clearInterval(intervalId);
                            //       }, 10000);

                            //     }

                        } 
                        // else if (data && this.selectPaymentMethod === 'ipay88' && data.html) {
                        //     // let _ipayUrl = 'https://payment.ipay88.com.my/epayment/entry.asp'

                        //     // if (this.platform.is('cordova')) {
                        //     //     this.openWithInAppBrowser(_ipayUrl)
                        //     // } else {
                        //     //     // this.openWithCordovaBrowser(data.url);
                        //     //     let win = window.open(_ipayUrl, '_system');
                        //     //     if(win) win.onunload = function () {
                        //     //       //  console.log("window unload")
                        //     //     }
                        //     // }

                        //     // console.log("before ipay88 interval", this.paymentStatus)
                        //     // let intervalId = setInterval(() => {
                        //     //   //  console.log("ipay88 interval : ", this.paymentStatus)
                        //     //     if (this.paymentStatus.toLowerCase() !== 'paid') this.getBill(data.id) //console.log("not paid") 
                        //     //     else clearInterval(intervalId);
                        //     // }, 10000);
                        //     let paymentPage = this.modalCtl.create(ExternalPaymentPage, {
                        //         html: data.html
                        //     })

                        //     paymentPage.onDidDismiss((data: any) => {
                        //       //  console.log("on return from prices display page : ", data)
                        //         // if(data && data.confirm) {
                        //         //     // this.paymentAmountType = data.paymentAmountType;
                        //         //     this.depositAmount = data.depositAmount;
                        //         //     this.selectPaymentMethod = data.selectPaymentMethod;
                        //         //     this.goPayNow();
                        //         // } else if (data && !data.confirm) {
                        //         //     this.paymentClickedBoolean = false;
                        //         //     this.onCancelAssignment();
                        //         // }
                        //     });
                        //     paymentPage.present();
                        //     // this.nav.push(ExternalPaymentPage,{
                        //     //     html: data.html
                        //     // })
                        // } 
                        else if (data && (this.selectPaymentMethod.toLowerCase().includes('ipay88'))) {
                            // this.selectPaymentMethod === 'ipay88page' || this.selectPaymentMethod === 'ipay88fpx'

                          //  console.log("from ipay88page ", data)

                            let _data = data;

                            let _amount;
                            //  = (_pgRegion.toLowerCase().includes('ipay88-id'))?_amountPay*100:1.00;
                            
                            if(_pgRegion.toLowerCase().includes('ipay88-id')) _amount = _amountPay*100
                            // else if(!_pgRegion.toLowerCase().includes('ipay88-id') && this.pgDescription.toLowerCase().includes('Sandbox'.toLowerCase())) _amount = 1*100;
                            else if(_type.toLowerCase().includes('ipay88') && _countryId.toLowerCase()==='mys' && !this.pgDescription.toLowerCase().includes('Sandbox'.toLowerCase())) _amount = _amountPay.toFixed(2);
                            else if(_type.toLowerCase().includes('ipay88') && _countryId.toLowerCase()==='mys' && this.pgDescription.toLowerCase().includes('Sandbox'.toLowerCase())) _amount = 100;                
                            else _amount = _amountPay*100;
                            // 10000*100:1.00;
                            // _pgRegion==='ipay88-id'?10000:1.00;
                            // _amountPay*100:1*100;
                            // let _amount = _pgRegion==='ipay88-id'?300000:1;
                            // _signature = 'huqhrKBj1i' + 'M27515' + _data.bill + _amount + this.bookingSlot.slotAssigned.currency.id;

                            // // _signature = 'huqhrKBj1i'+'M27515'+'TestPay88_'+moment().format('HHmmss')+'1'+this.bookingSlot.slotAssigned.currency.id;
                            // console.log("ipay88 signature", _signature)
                            // console.log("ipay88 signature", sha256(_signature));
                            // let sha256_signature = sha256(_signature);


                            let _ipayUrl;
                            if(this.selectPaymentMethod === 'ipay88fpx') _ipayUrl = 'https://dvl3.ipay88.com/epayment/entry.asp';
                            else {
                                if(_pgRegion.toLowerCase().includes('ipay88-id')) 
                                // _pgRegion === 'ipay88-id'
                                _ipayUrl = this.paymentPageURL; //'https://sandbox.ipay88.co.id/epayment/entry.asp';
                                else _ipayUrl = 'https://payment.ipay88.com.my/epayment/entry.asp';
                            }
                            // https://dvl3.ipay88.com/epayment/entry.asp
                            this.localBill = _data.bill;
                            if(this.selectPaymentMethod==='ipay88fpx') {
                                _signature = 'YaYNkBlUnq' + 'M15668' + _data.bill + _amount*100 + this.bookingSlot.slotAssigned.currency.id;

                            // _signature = 'huqhrKBj1i'+'M27515'+'TestPay88_'+moment().format('HHmmss')+'1'+this.bookingSlot.slotAssigned.currency.id;
                          //  console.log("ipay88 signature", _signature) 
                          //  console.log("ipay88 signature test huqhrKBj1iM27515472100MYR ", sha256('huqhrKBj1iM27515472100MYR'));
                          //  console.log("ipay88 signature test huqhrKBj1iM275154721MYR ", sha256('huqhrKBj1iM275154721MYR'));
                          //  console.log("ipay88 signature 256", sha256(_signature));
                          //  console.log("create bill data : ", data)
                            let _userEmail;
                            let _userName;
                            let _userContact;

                            if(this.fromClub) {
                                if(this.bookingSlot.bookedByPlayer && this.bookingSlot.bookedByPlayer.id) {
                                    _userEmail = this.bookingSlot.bookedByPlayer.email;
                                    _userName = this.bookingSlot.bookedByPlayer.playerName;
                                    _userContact = this.bookingSlot.bookedByPlayer.phone; //?this.bookingSlot.bookedByPlayer.phone:_mobile;
                                } else if(!this.bookingSlot.bookedByPlayer) {
                                    let _player = this.bookingSlot.bookingPlayers.filter((p: TeeTimeBookingPlayer)=>{
                                        return p.email
                                    });
                                    if(_player && _player.length > 0) {
                                        _userEmail = _player[0].email;
                                        _userName = _player[0].playerName;
                                        _userContact = _player[0].phone; //?this.bookingSlot.bookingPlayers[0].phone:_mobile;
                                    } else if(this.bookingSlot.clubData && this.bookingSlot.clubData.contactEmail) {
                                        _userEmail = this.bookingSlot.clubData.contactEmail;
                                        _userName = this.bookingSlot.clubData.contactPerson;
                                        // _userContact = this.bookingSlot
                                    } else if(this.bookingSlot.clubData.address && this.bookingSlot.clubData.address.email) {
                                        _userEmail = this.bookingSlot.clubData.address.email;
                                        _userName = this.bookingSlot.clubData.name;
                                        if(this.bookingSlot.clubData.address.phone1) 
                                            _userContact = this.bookingSlot.clubData.address.phone1
                                        else if(this.bookingSlot.clubData.address.phone2)
                                            _userContact = this.bookingSlot.clubData.address.phone2
                                        else if(this.bookingSlot.clubData.address.fax)
                                            _userContact = this.bookingSlot.clubData.address.fax
                                    }
                                    // _userEmail = this.bookingSlot.bookingPlayers[0].email;
                                    // _userName = this.bookingSlot.bookingPlayers[0].playerName;
                                    // _userContact = this.bookingSlot.bookingPlayers[0].phone;//?this.bookingSlot.bookingPlayers[0].phone:_mobile;
                                }
                            } else {
                                if(this.currentPlayer) {
                                    _userEmail = this.currentPlayer.email;
                                    _userName = this.currentPlayer.playerName;
                                    _userContact = this.currentPlayer.phone;
                                } else if(!this.currentPlayer && this.bookingSlot.bookedByPlayer) {
                                    _userEmail = this.bookingSlot.bookedByPlayer.email;
                                    _userName = this.bookingSlot.bookedByPlayer.playerName;
                                    _userContact = this.bookingSlot.bookedByPlayer.phone;
                                }
                            }

                            let sha256_signature = sha256(_signature);
                                paymentDetailsPage = {
                                    "MerchantCode": 'M15668',
                                    "PaymentId": '',
                                    "RefNo": _data.bill, //'TestPay88_'+moment().format('HHmmss'),
                                    "Amount": _amount,
                                    "Currency": this.bookingSlot.slotAssigned.currency.id,
                                    "ProdDesc": _description + this.bookingSlot.bookingReference,
                                    "UserEmail": _userEmail,
                                    "UserName": _userName,
                                    "UserContact": _userContact,
                                    // "UserName": this.bookingSlot.bookedByPlayer?this.bookingSlot.bookedByPlayer.playerName:this.bookingSlot.bookingPlayers[0].playerName ,
                                    // "UserEmail": this.bookingSlot.bookedByPlayer?this.bookingSlot.bookedByPlayer.email:this.bookingSlot.bookingPlayers[0].email,
                                    // "UserContact": this.bookingSlot.bookedByPlayer?(this.bookingSlot.bookedByPlayer.address.phone1 ? this.bookingSlot.bookedByPlayer.address.phone1: this.bookingSlot.bookedByPlayer.address.phone2):this.bookingSlot.bookingPlayers[0].phone, //this.bookingSlot., no phone in bookedbyplayer!
                                    // "UserName": this.bookingSlot.bookedByPlayer.playerName,
                                    // "UserEmail": this.bookingSlot.bookedByPlayer.email,
                                    // "UserContact": this.bookingSlot.bookedByPlayer.address.phone1 ? this.bookingSlot.bookedByPlayer.address.phone1 : this.bookingSlot.bookedByPlayer.address.phone2, //this.bookingSlot., no phone in bookedbyplayer!
                                    "Remark": _description + this.bookingSlot.bookingReference,
                                    "SignatureType": 'SHA256',
                                    "Signature": sha256_signature,
                                    "ResponseURL": this.paymentRedirectURL,
                                    // "ResponseURL": 'http://azu-play.mygolf2u.com/payment_redirect.html',
                                    // "BackendURL": 'http://azulet.mygolf2u.com/rest/payment/ipay88/backend',
                                    // "BackendURL": 'http://devlet.mygolf2u.com/rest/payment/ipay88/backend',
                                    "BackendURL": this.paymentBackendURL,
                                    // _data.callback_url?_data.callback_url:this.paymentBackendURL,//'http://devlet.mygolf2u.com/rest/payment/ipay88/backend'
                                }
                            } else {
                                // _signature = 'huqhrKBj1i' + 'M27515' + _data.bill + _amount + this.bookingSlot.slotAssigned.currency.id;
                                if(_pgRegion.toLowerCase().includes('ipay88-id')  && this.pgDescription.toLowerCase().includes('sandbox'))
                                    _signature = this.ipay88Details.merchantKey + this.ipay88Details.merchantCode + _data.bill + Number(_amount).toFixed(0) + this.bookingSlot.slotAssigned.currency.id;
                                else if(_pgRegion.toLowerCase().includes('ipay88-id')  && !this.pgDescription.toLowerCase().includes('sandbox'))
                                    _signature = this.ipay88Details.merchantKey + this.ipay88Details.merchantCode + _data.bill + Number(_amountPay*100).toFixed(0) + this.bookingSlot.slotAssigned.currency.id;
                                else if(_pgRegion === 'ipay88' && this.pgDescription.toLowerCase().includes('sandbox'))
                                    _signature = this.ipay88Details.merchantKey + this.ipay88Details.merchantCode + _data.bill + Number(100).toFixed(0) + this.bookingSlot.slotAssigned.currency.id;
                                else _signature = this.ipay88Details.merchantKey + this.ipay88Details.merchantCode + _data.bill + Number(_amount*100).toFixed(0) + this.bookingSlot.slotAssigned.currency.id;

                            // _signature = 'huqhrKBj1i'+'M27515'+'TestPay88_'+moment().format('HHmmss')+'1'+this.bookingSlot.slotAssigned.currency.id;
                           console.log("ipay88 signature", _signature)
                            // console.log("ipay88 signature test huqhrKBj1iM27515472100MYR ", sha256('huqhrKBj1iM27515472100MYR'));
                            // console.log("ipay88 signature test huqhrKBj1iM275154721MYR ", sha256('huqhrKBj1iM275154721MYR'));
                           console.log("ipay88 signature 256", sha256(_signature));
                           console.log("ipay88 signature 1", this.sha1.iPay88Signature(_signature));
                          //  console.log("ipay88 signature server", data.signature);
                          //  console.log("ipay88 signature pg region", _pgRegion);
                          //  console.log("ipay88 signature signature type", this.paymentSignAlgo);
                            
                          //  console.log("[1] payment details : ", _amount, _amountPay)
                            let sha256_signature = sha256(_signature);
                            let sha1_signature = this.sha1.iPay88Signature(_signature);
                            let ipay88_signature;
                            // if(data && data.signature) ipay88_signature = (_pgRegion.toLowerCase().includes('ipay88-id'))?data.signature:sha256_signature; //data.signature;
                            // else ipay88_signature = (_pgRegion.toLowerCase().includes('ipay88-id'))?sha1_signature:sha256_signature;
                            ipay88_signature = (_pgRegion.toLowerCase().includes('ipay88-id'))?sha1_signature:sha256_signature;
                            // ipay88_signature = (_pgRegion==='ipay88-id')?sha1_signature:sha256_signature
                          //  console.log("create bill data : ", data);
                          //  console.log("ipay88signature ", ipay88_signature, this.paymentSignAlgo, this.ipay88Details)
                            let _userEmail;
                            let _userName;
                            let _userContact;

                            if(this.fromClub) {
                                if(this.bookingSlot.bookedByPlayer && this.bookingSlot.bookedByPlayer.id) {
                                    _userEmail = this.bookingSlot.bookedByPlayer.email;
                                    _userName = this.bookingSlot.bookedByPlayer.playerName;
                                    _userContact = this.bookingSlot.bookedByPlayer.phone;
                                } else if(!this.bookingSlot.bookedByPlayer) {
                                    let _player = this.bookingSlot.bookingPlayers.filter((p: TeeTimeBookingPlayer)=>{
                                        return p.email
                                    });
                                    if(_player && _player.length > 0) {
                                        _userEmail = _player[0].email;
                                        _userName = _player[0].playerName;
                                        _userContact = _player[0].phone; //?this.bookingSlot.bookingPlayers[0].phone:_mobile;
                                    } else if(this.bookingSlot.clubData && this.bookingSlot.clubData.contactEmail) {
                                        _userEmail = this.bookingSlot.clubData.contactEmail;
                                        _userName = this.bookingSlot.clubData.contactPerson;
                                        // _userContact = this.bookingSlot
                                    } else if(this.bookingSlot.clubData.address && this.bookingSlot.clubData.address.email) {
                                        _userEmail = this.bookingSlot.clubData.address.email;
                                        _userName = this.bookingSlot.clubData.name;
                                        if(this.bookingSlot.clubData.address.phone1) 
                                            _userContact = this.bookingSlot.clubData.address.phone1
                                        else if(this.bookingSlot.clubData.address.phone2)
                                            _userContact = this.bookingSlot.clubData.address.phone2
                                        else if(this.bookingSlot.clubData.address.fax)
                                            _userContact = this.bookingSlot.clubData.address.fax
                                    }
                                    // _userEmail = this.bookingSlot.bookingPlayers[0].email;
                                    // _userName = this.bookingSlot.bookingPlayers[0].playerName;
                                    // _userContact = this.bookingSlot.bookingPlayers[0].phone;//?this.bookingSlot.bookingPlayers[0].phone:_mobile;
                                }
                            } else {
                                if(this.currentPlayer) {
                                    _userEmail = this.currentPlayer.email;
                                    _userName = this.currentPlayer.playerName;
                                    _userContact = this.currentPlayer.phone;
                                } else if(!this.currentPlayer && this.bookingSlot.bookedByPlayer) {
                                    _userEmail = this.bookingSlot.bookedByPlayer.email;
                                    _userName = this.bookingSlot.bookedByPlayer.playerName;
                                    _userContact = this.bookingSlot.bookedByPlayer.phone;
                                }
                            }

                            // let _userEmail;
                            // let _userName;
                            // let _userContact;

                            if(this.fromClub) {
                                if(this.bookingSlot.bookedByPlayer && this.bookingSlot.bookedByPlayer.id) {
                                    _userEmail = this.bookingSlot.bookedByPlayer.email;
                                    _userName = this.bookingSlot.bookedByPlayer.playerName;
                                    _userContact = this.bookingSlot.bookedByPlayer.phone; //?this.bookingSlot.bookedByPlayer.phone:_mobile;
                                } else if(!this.bookingSlot.bookedByPlayer) {
                                    let _player = this.bookingSlot.bookingPlayers.filter((p: TeeTimeBookingPlayer)=>{
                                        return p.email
                                    });
                                    if(_player && _player.length > 0) {
                                        _userEmail = _player[0].email;
                                        _userName = _player[0].playerName;
                                        _userContact = _player[0].phone; //?this.bookingSlot.bookingPlayers[0].phone:_mobile;
                                    } else if(this.bookingSlot.clubData && this.bookingSlot.clubData.contactEmail) {
                                        _userEmail = this.bookingSlot.clubData.contactEmail;
                                        _userName = this.bookingSlot.clubData.contactPerson;
                                        // _userContact = this.bookingSlot
                                    } else if(this.bookingSlot.clubData.address && this.bookingSlot.clubData.address.email) {
                                        _userEmail = this.bookingSlot.clubData.address.email;
                                        _userName = this.bookingSlot.clubData.name;
                                        if(this.bookingSlot.clubData.address.phone1) 
                                            _userContact = this.bookingSlot.clubData.address.phone1
                                        else if(this.bookingSlot.clubData.address.phone2)
                                            _userContact = this.bookingSlot.clubData.address.phone2
                                        else if(this.bookingSlot.clubData.address.fax)
                                            _userContact = this.bookingSlot.clubData.address.fax
                                    }
                                    // _userEmail = this.bookingSlot.bookingPlayers[0].email;
                                    // _userName = this.bookingSlot.bookingPlayers[0].playerName;
                                    // _userContact = this.bookingSlot.bookingPlayers[0].phone;//?this.bookingSlot.bookingPlayers[0].phone:_mobile;
                                }
                            } else {
                                if(this.currentPlayer) {
                                    _userEmail = this.currentPlayer.email;
                                    _userName = this.currentPlayer.playerName;
                                    _userContact = this.currentPlayer.phone;
                                } else if(!this.currentPlayer && this.bookingSlot.bookedByPlayer) {
                                    _userEmail = this.bookingSlot.bookedByPlayer.email;
                                    _userName = this.bookingSlot.bookedByPlayer.playerName;
                                    _userContact = this.bookingSlot.bookedByPlayer.phone;
                                }
                            }

                                paymentDetailsPage = {
                                    "MerchantCode": this.ipay88Details.merchantCode,
                                    "PaymentId": '',
                                    "RefNo": _data.bill, //'TestPay88_'+moment().format('HHmmss'),
                                    "Amount": _amount,
                                    "Currency": this.bookingSlot.slotAssigned.currency.id,
                                    "ProdDesc": _description + this.bookingSlot.bookingReference,
                                    "UserEmail": _userEmail,
                                    "UserName": _userName,
                                    "UserContact": _userContact,
                                    // "UserName": this.bookingSlot.bookedByPlayer?this.bookingSlot.bookedByPlayer.playerName:this.bookingSlot.bookingPlayers[0].playerName ,
                                    // "UserEmail": this.bookingSlot.bookedByPlayer?this.bookingSlot.bookedByPlayer.email:this.bookingSlot.bookingPlayers[0].email,
                                    // "UserContact": this.bookingSlot.bookedByPlayer?(this.bookingSlot.bookedByPlayer.address.phone1 ? this.bookingSlot.bookedByPlayer.address.phone1: this.bookingSlot.bookedByPlayer.address.phone2):this.bookingSlot.bookingPlayers[0].phone, //this.bookingSlot., no phone in bookedbyplayer!
                                    "Remark": _description + this.bookingSlot.bookingReference,
                                    "SignatureType": this.paymentSignAlgo,
                                    // _pgRegion==='ipay88-id'?'SHA1':'SHA256',
                                    "Signature": ipay88_signature,
                                    "ResponseURL": this.paymentRedirectURL,
                                    // "ResponseURL": 'http://azu-play.mygolf2u.com/payment_redirect.html',
                                    // "BackendURL": 'http://azulet.mygolf2u.com/rest/payment/ipay88/backend',
                                    // "BackendURL": 'http://devlet.mygolf2u.com/rest/payment/ipay88/backend',
                                    "BackendURL": this.paymentBackendURL,
                                    "PaymentURL": this.paymentPageURL,
                                    // "https://payment.ipay88.co.id/epayment/entry.asp"
                                    // _data.callback_url?_data.callback_url:this.paymentBackendURL,//'http://devlet.mygolf2u.com/rest/payment/ipay88/backend'
                                }
                            }
                            


                            // let _merchantCode = paymentDetailsPage['MerchantCode'];
                            let _MerchantCode = paymentDetailsPage["MerchantCode"]
                            let _PaymentId = paymentDetailsPage["PaymentId"]
                            let _RefNo = _data.bill; //paymentDetailsPage["RefNo"]
                            let _Amount = paymentDetailsPage["Amount"]
                            let _Currency = paymentDetailsPage["Currency"]
                            let _ProdDesc = paymentDetailsPage["ProdDesc"]
                            let _UserName = paymentDetailsPage["UserName"]
                            let _UserEmail = paymentDetailsPage["UserEmail"]
                            let _UserContact = paymentDetailsPage["UserContact"]
                            let _Remark = paymentDetailsPage["Remark"]
                            let _SignatureType = paymentDetailsPage["SignatureType"]
                            let _Signature = paymentDetailsPage["Signature"]
                            let _ResponseURL = paymentDetailsPage["ResponseURL"]
                            let _BackendURL = paymentDetailsPage["BackendURL"]

                            let _params =
                                'MerchantCode=' + _MerchantCode +
                                '&PaymentId=' + _PaymentId +
                                '&RefNo=' + _RefNo +
                                '&Amount=' + _Amount +
                                '&Currency=' + _Currency +
                                '&ProdDesc=' + _ProdDesc +
                                '&UserName=' + _UserName +
                                '&UserEmail=' + _UserEmail +
                                '&UserContact=' + _UserContact +
                                '&Remark=' + _Remark +
                                '&SignatureType=' + _SignatureType +
                                '&Signature=' + _Signature +
                                '&ResponseURL=' + _ResponseURL +
                                '&BackendURL=' + _BackendURL;
                            // _ipayUrl = '/ipay88page'
                          //  console.log("ipay88 test ", _params, _ipayUrl);

                            let map;
                            // var mapForm = document.createElement("form");
                            // mapForm.target = "_self";
                            // mapForm.method = "POST"; // or "post" if appropriate
                            // mapForm.action = _ipayUrl;

                            // var merchantCodeInput = document.createElement("input");
                            // merchantCodeInput.type = "text";
                            // merchantCodeInput.name = "MerchantCode";
                            // merchantCodeInput.value = _MerchantCode;
                            // merchantCodeInput.appendChild(merchantCodeInput);


                            var form = document.createElement("form");
                            form.target = "_system";
                            form.method = "GET";
                            form.action = _url;
                            form.style.display = "none";

                            for (var key in paymentDetailsPage) {
                                var input = document.createElement("input");
                                input.type = "hidden";
                                input.name = key;
                                input.value = paymentDetailsPage[key];
                                form.appendChild(input);
                            }

                            let _ipay88Header = `<html>
                            <head>
                            </head>`;

                            // http://app.mygolf2u.com/payment/goToPayment.html
                            let _ipay88Body = `<body >
    <form id="loginForm" action="`+this.paymentInternalURL+`" method="get">
        <span style="font-size:5vw;">Redirecting to payment page ...</span><br>`;

        for (var key in paymentDetailsPage) {
            _ipay88Body += '<input type="hidden" name="' + key + '" value="' + paymentDetailsPage[key] + '">'
        };

        let _ipay88end = `<script type="text/javascript">
        setTimeout("document.getElementById('loginForm').submit()", 500);
        </script>
    </body>
    
    </html>`;
    
    let _ipay88content = _ipay88Header + _ipay88Body + _ipay88end;

  //  console.log('calling ipay88 page', _ipay88content)

    
    let _ipay88ContentUrl = 'data:text/html;base64,' + btoa(_ipay88content);


                            let win;
                            // let _pageHeader = '<html><head></head><body><form id="loginForm" action="' + _ipayUrl + '" method="post">';
                            // let _pageBody;
                            // for (var key in paymentDetailsPage) {
                            //     _pageBody += '<input type="hidden" name="' + key + '" value="' + paymentDetailsPage[key] + '">'
                            // }
                            // let _pageEnd = '</form> <script type="text/javascript">document.getElementById("loginForm").submit();</script></body></html>';
                            // let _pageContent = _pageHeader + _pageBody + _pageEnd;

                            // console.log('calling ipay88 page', _pageContent)
                            // let _pageContentUrl = 'data:text/html;base64,' + btoa(_pageContent);

                          //  console.log("platform is what : ", this.platform._platforms, data)
                          //  console.log("platform is what : ", this.platform)
                            
                            // MessageDisplayUtil.showMessageToast( 'platform is what : '+this.platform._platforms ,this.platform, this.toastCtl, 3000, "bottom")
                            // if(1) return false;
                            if(this.platform.is('cordova')) {
                                
                                this.openWithInAppBrowser(_ipay88ContentUrl,null,'getBill',data)
                                // this.openWithInAppBrowser(_ipay88ContentUrl)
                                // ,null,'getBill',data
                                // var browserRef = window.cordova.InAppBrowser.open(
                                //     pageContentUrl ,
                                //     "_blank",
                                //     "hidden=no,location=no,clearsessioncache=yes,clearcache=yes"
                                // );
                                // MessageDisplayUtil.showMessageToast(this.platform.is('cordova') + ' - platform is what : '+this.platform._platforms ,this.platform, this.toastCtl, 3000, "bottom")
                                // if(1) return false;
    
                                // win = window.open("", '_system');
                                // // _url+'?MerchantCode="124124"'
                                // //  if(win) win.onunload = function () {
                                // //   //  console.log("window unload", win)
                                // // }


                                // //not allowed
                                // document.body.appendChild(form);
                                // form.submit();
                                // document.body.removeChild(form);
                            } else {
                                
                                // this.openWithInAppBrowser(_pageContentUrl)
                                // if(1) return false;
                                // MessageDisplayUtil.showMessageToast(this.platform.is('cordova') + ' - platform is what : '+this.platform._platforms ,this.platform, this.toastCtl, 3000, "bottom")
                                // if(1) return false;
    
                                win = window.open("", '_system');
                                // _url+'?MerchantCode="124124"'
                                //  if(win) win.onunload = function () {
                                //   //  console.log("window unload", win)
                                // }


                                //not allowed
                                document.body.appendChild(form);
                                form.submit();
                                document.body.removeChild(form);

                                
                                // let win = window.open(data.url, '_system');

                                // let winTick = setInterval(()=> {
                                //     if (win && win.closed) {
                                //         clearInterval(winTick);
                                //         this.getBill(data.id, 'ipay88');
                                //       //  console.log('window closed inner!');
                                //     }
                                // }, 500);
                            }

//                             if (this.platform.is('cordova')) {
//                               //  console.log('open with in app')
//                                 MessageDisplayUtil.showMessageToast(this.platform.is('cordova') + ' - platform is what : '+this.platform._platforms ,this.platform, this.toastCtl, 3000, "bottom")
//                             if(1) return false;
//                                 // this.openWithInAppBrowser(_url)
//                                 // let win = window.open(_url+'?MerchantCode="124124"', '_blank'); 

// //                                 var pageContent = '<html><head></head><body><form id="loginForm" action="YourPostURL" method="post">' +
// // '<input type="hidden" name="key1" value="' + YourValue1 + '">' +
// // '<input type="hidden" name="key" value="' + YourValue2 + '">' +
// // '</form> <script type="text/javascript">document.getElementById("loginForm").submit();</script></body></html>';
// // var pageContentUrl = 'data:text/html;base64,' + btoa(pageContent);

// // var browserRef = window.cordova.InAppBrowser.open(
// //     pageContentUrl ,
// //     "_blank",
// //     "hidden=no,location=no,clearsessioncache=yes,clearcache=yes"
    
//                                 document.body.appendChild(form);
//                                 form.submit();
//                                 document.body.removeChild(form);
//                             } else if (this.platform.is('mobileweb') || this.platform.is('mobile') ||
//                                 this.platform.is('android') || this.platform.is('phablet')) {
//                                     MessageDisplayUtil.showMessageToast(this.platform.is('cordova') + ' - platform is what : '+this.platform._platforms ,this.platform, this.toastCtl, 3000, "bottom")
//                                     if(1) return false;
//                                 // ["mobile", "android", "phablet", "mobileweb"]
//                               //  console.log('open with cordova browser android')
//                                 // this.openWithCordovaBrowser(_url)
//                                 win = window.open("", '_system');
//                                 // _url+'?MerchantCode="124124"'
//                                 //  if(win) win.onunload = function () {
//                                 //   //  console.log("window unload", win)
//                                 // }


//                                 //not allowed
//                                 document.body.appendChild(form);
//                                 form.submit();
//                                 document.body.removeChild(form);
//                             } else if (this.platform.is('ios') || this.platform.is('iphone')) {
//                                 // ["mobile", "android", "phablet", "mobileweb"]
//                               //  console.log('open with cordova browser ios', this.platform)
//                                 // this.openWithCordovaBrowser(_url)
//                                 win = window.open(_url, '_system');
//                                 win.location.href = _url;
//                                 let winTick = setInterval(()=> {
//                                     if (win.closed) {
//                                         clearInterval(winTick);
//                                         this.getBill(data.id, 'billplz');
//                                       //  console.log('window closed!');
//                                     }
//                                 }, 500);
                                

//                                 document.body.appendChild(form);
//                                 form.submit();
//                                 document.body.removeChild(form);

//                                 // ["mobile", "ios", "iphone", "mobileweb"]
//                             } else {
//                               //  console.log('open with system browser')
//                                 // this.openWithSystemBrowser(_url)
//                                 win = window.open(_url, '_system');

//                                 //     if(win) win.onunload = function () {
//                                 //       //  console.log("window unload")
//                                 //     }

//                                 document.body.appendChild(form);
//                                 form.submit();
//                                 document.body.removeChild(form);

//                             }

                            let winTick = setInterval(()=> {
                                if (win && win.closed) {
                                    clearInterval(winTick);
                                    this.getBill(data.bill, 'ipay88');
                                  //  console.log('window closed!');
                                }
                            }, 500);

                            // console.log("before ipay88 interval", this.paymentStatus)
                            //       let intervalId = setInterval(()=>{ 
                            //       //  console.log("ipay88 interval : ", this.paymentStatus)
                            //         if(this.paymentStatus.toLowerCase() !== 'paid') this.getBill(_data.bill,_paymentGateway) //console.log("not paid") 
                            //         else clearInterval(intervalId);
                            //       }, 10000);
                            //   let paymentPage = this.modalCtl.create(ExternalPaymentPage, {
                            //     html: data.html
                            // })

                            // paymentPage.onDidDismiss((data: any) => {
                            //   //  console.log("on return from prices display page : ", data)

                            // });
                            // paymentPage.present();
                            // this.nav.push(ExternalPaymentPage,{
                            //     html: data.html
                            // })
                        }

                    }, (error) => {
                        if (error) {
                          //  console.log("Error : ", error.json())
                            let _error = error.json()
                            if (_error.status === "500" || _error.status === "404") {
                              //  console.log("Server unreachable")
                                MessageDisplayUtil.showMessageToast('Server Unreachable',
                                    this.platform, this.toastCtl, 3000, "bottom")
                            } else if (_error.status === 500 || _error.status === 404) {
                              //  console.log("Server unreachable JSON")
                                MessageDisplayUtil.showMessageToast('Server Unreachable',
                                    this.platform, this.toastCtl, 3000, "bottom")
                            }
                        }
                    })

                }, (error)=>{
                    if(loader) loader.dismiss();
                  //  console.log("payment error : ",error)
                    let _msg = error;
                    if(_msg.toLowerCase().includes("mobile is invalid")) {
                        _msg = "Mobile phone is invalid. Please update profile and retry payment.";
                        if(!this.fromClub) { 

                            let alert = this.alertCtrl.create({
                                title: 'Insufficient Player Info',
                                // subTitle: 'Selected date is '+ _date,
                                message: 'This Payment Gateway needs a valid phone number to proceed. Do you want to update profile?', //'Selected date is ' + '<b>' + _date + '</b>',
                                // buttons: ['Close']
                                buttons: [{
                                    text: 'No'
                                },{
                                    text: 'Update',
                                    handler: () => {
                                        
                                            let modal = this.modalCtl.create(EditProfilePage, {
                                            homeInfo: this.playerHomeInfo$,
                                            player  : this.player$,
                                            type    : 'playerProfile'
                                            });
                                            
                                            modal.onDidDismiss((data?: any) => {
                                                // this.refreshProfile();
                                                this.refreshBookingDetails()
                                              //  console.log('current player - after : ', this.currentPlayer)
                
                                            });
                                            modal.present();
                                            }
                
                                }]
                            });
                            alert.present();
                        }
                        // return false;
                    } else {
                        _msg = "Something wrong going with payment server. Please try again."
                    }
                    MessageDisplayUtil.showMessageToast(_msg,
                        this.platform, this.toastCtl, 3000, "bottom");
                    // return false;
                })
        })
        setTimeout(() => {
            loader.dismiss().then(() => {})
        }, 300000)


    }

    public getBill(billId ? : string, paymentGateway ? : string) {
      //  console.log("calling getBill")
        this.paymentService.getBill(billId, paymentGateway)
            .subscribe((data: any) => {
              //  console.log("get local billplz bill state", data)
              //  console.log("local billplz : ", data.paid, data.paid?'paid':'not paid')
                if ((data.status && data.paid === 'true' && data.status.toLowerCase() === 'p') || (data.state && data.state.toLowerCase() === 'paid')
                && paymentGateway === 'billplz') {
                    //   this.toggleRegister = true;
                    
                this.paymentMode = false;
                    this.paymentStatus = 'Paid';
                    let alert = this.alertCtrl.create({
                        title: 'Payment successful',
                        // subTitle: 'Selected date is '+ _date,
                        message: 'Thank you for the payment.<br>Booking receipt will be sent to you via email.', //'Selected date is ' + '<b>' + _date + '</b>',
                        // buttons: ['Close']
                        buttons: [{
                            text: 'Close',
                            handler: () => {

                                this.recalculateBookingPricing();
                                this.paymentAmountType = 'full';
                                // this.paymentClickedBoolean = false;
                                // this.getBookingItemizedBill();
                                // this.refreshBookingDetails(true);

                            }
                        }],
                        enableBackdropDismiss: false,
                    });
                    alert.present();
                    this.paymentFailed = false;
                    this.paymentDateTime = null;
                } else if ((data.status && data.status.toLowerCase() === 'p') ||  (data.state && data.state.toLowerCase() === '1') 
                && paymentGateway === 'ipay88') {
                    //   this.toggleRegister = true;
                    
                this.paymentMode = false;
                    this.paymentStatus = 'Paid';
                    let alert = this.alertCtrl.create({
                        title: 'Payment successful',
                        // subTitle: 'Selected date is '+ _date,
                        message: 'Thank you for the payment.<br>Booking receipt will be sent to you via email.', //'Selected date is ' + '<b>' + _date + '</b>',
                        // buttons: ['Close']
                        buttons: [{
                            text: 'Close',
                            handler: () => {

                                this.recalculateBookingPricing();
                                this.paymentAmountType = 'full';
                                // this.getBookingItemizedBill();
                                // this.refreshBookingDetails(true);

                            }
                        }],
                        enableBackdropDismiss: false,
                    });
                    alert.present();
                    this.paymentFailed = false;
                    this.paymentDateTime = null;
                } else if ((data.state && data.state.toLowerCase() === 'due') || (data.status && data.status.toLowerCase() === 'd')) {
                    this.paymentStatus = 'Due';
                    
                    let alert = this.alertCtrl.create({
                        title: 'Payment not successful',
                        cssClass: 'booking-error',
                        // subTitle: 'Selected date is '+ _date,
                        message: 'Something went wrong with payment. Please refresh and try again in few minutes.', //'Selected date is ' + '<b>' + _date + '</b>',
                        // buttons: ['Close']
                        buttons: [{
                            text: 'Close',
                            handler: () => {
                                this.recalculateBookingPricing();
                            }
                        }],
                        enableBackdropDismiss: false,
                    });
                    alert.present();
                    if(this.enablePaymentTimer) {
                        this.paymentFailed = true;
                        this.paymentDateTime = moment();
                    }
                    //   this.refreshBookingDetails();
                    //   this.getBookingItemizedBill(false);
                    //   this.toggleRegister = false;
                } 
                // else if((data.paid && data.paid === 'false' && data.status && data.status.toLowerCase() === 'd')) {
                //     this.paymentStatus = 'Due';
                //     let alert = this.alertCtrl.create({
                //         title: 'Payment not successful',
                //         // subTitle: 'Selected date is '+ _date,
                //         message: 'Something went wrong with payment. Please try again.', //'Selected date is ' + '<b>' + _date + '</b>',
                //         // buttons: ['Close']
                //         buttons: [{
                //             text: 'Close',
                //             handler: () => {
                //             }
                //         }]
                //     });
                //     alert.present();
                // } 
                else {
                    if(this.enablePaymentTimer) {
                        this.paymentFailed = true;
                        this.paymentDateTime = moment();
                    }
                    this.onCancelAssignment()
                }
            }, (error)=>{
                this.paymentStatus = 'Pending';
                
                let alert = this.alertCtrl.create({
                    title: 'Ooops',
                    cssClass: 'booking-error',
                    // subTitle: 'Selected date is '+ _date,
                    message: 'Something went wrong with payment. Please refresh and try again in few minutes.', //'Selected date is ' + '<b>' + _date + '</b>',
                    // buttons: ['Close']
                    buttons: [{
                        text: 'Close',
                        handler: () => {
                            this.recalculateBookingPricing();
                        }
                    }],
                    enableBackdropDismiss: false,
                });
                alert.present();
                if(this.enablePaymentTimer) {
                    this.paymentFailed = true;
                    this.paymentDateTime = moment();
                }
                // this.onCancelAssignment();
              //  console.log("get bill error : ", error.json())
            })
    }
    public openWithSystemBrowser(url: string) {
        let target = "_system";
        this.iab.create(url, target, this.options);
    }
    public openWithInAppBrowser(url: string, target ? : string,attribute?: string,data?:any) {
        let _target;
        if (target) _target = target;
        else _target = '_blank'
        if(this.platform.is('ios')) _target = '_blank';
        let _iab = this.iab.create(url, _target, this.options);

        if(this.platform.is('ios')) {
            _iab.on('loadstart').subscribe((event)=>{
                let loc = event.url.toLowerCase();
                if(loc.includes(this.paymentRedirectURL.toLowerCase()))
                {
                      setTimeout(function () {
                        _iab.close();
                      }, 5000);  
                }
            })
        } else {
            _iab.on('loadstop').subscribe((event)=>{
                let loc = event.url.toLowerCase();
                if(loc.includes(this.paymentRedirectURL))
                {
                      setTimeout(function () {
                        _iab.close();
                      }, 5000);  
                }
            })
        }
        // _iab.on('')
        // _iab.on('loadstop').subscribe(event => {
        //   //  console.log("iab stop")
        //     MessageDisplayUtil.showMessageToast('IAB stop',
        //         this.platform, this.toastCtl, 10000, "bottom")
        //  });
        
        // MessageDisplayUtil.showMessageToast('IAB loading...', 
        // this.platform, this.toastCtl,10000, "bottom");
         _iab.on('exit').subscribe(() => {
            // MessageDisplayUtil.showMessageToast('exit IAB - '+data.bill + '|'+this.selectPaymentMethod, 
            // this.platform, this.toastCtl,10000, "bottom");
             if(attribute === 'getBill') {
                if(this.selectPaymentMethod.toLowerCase().includes('billplz')) {
                    this.getBill(data.id, 'billplz');
                    // this.refreshBookingDetails(true)
                }
                // else if(this.selectPaymentMethod==='ipay88' || this.selectPaymentMethod==='ipay88page' || this.selectPaymentMethod==='ipay88fpx') this.getBill(data.bill, 'ipay88');
                else if(this.selectPaymentMethod.toLowerCase().includes('ipay88')) this.getBill(data.bill, 'ipay88');

            //     MessageDisplayUtil.showMessageToast('exit Browser closed', 
            // this.platform, this.toastCtl,10000, "bottom")
          //  console.log('browser closed');
             }
            // MessageDisplayUtil.showMessageToast('exit Browser closed', 
            // this.platform, this.toastCtl,10000, "bottom")
            // console.log('browser closed');
        }, (err) => {
            if(err) console.error(err);
        });
    }
    public openWithCordovaBrowser(url: string) {
        let target = "_system";
        this.iab.create(url, target, this.options);
    }

    checkBookingTabsComplete(tabs: string) {
        if (this.teeSlotNew || !this.bookingSlot) return false;
        let _complete: boolean = true;
        let _balance = this.bookingItemBill&&this.bookingItemBill.balance?this.bookingItemBill.balance:0;
        switch (tabs) {
            case '1':
                if (this.bookingSlot.bookingPlayers.length > 0) return true
                else return false;
            case '2':
                if (this.bookingSlot.bookingPlayers.length >= this.bookingSlot.slotAssigned.minPlayers) return true
                else return false;
            case '3':
                if(!this.bookingOptions) return false
                let _buggyMandatory = this.bookingOptions.buggyMandatory;
                let _caddyMandatory = this.bookingOptions.caddyMandatory;
                let _slotBuggy = null;
                let _slotCaddy = null;
                // if(this.b)
                _slotBuggy = this.bookingSlot.bookingPlayers.filter((p) => {
                    if(p.pairingNo === 0) return true
                    // else if(!_buggyMandatory && p.pairingNo === 0 ) return true
                    else return false
                });
                _slotCaddy = this.bookingSlot.bookingPlayers.filter((p) => {
                    if(p.caddyPairing === 0) return true
                    // else if(!_caddyMandatory && p.caddyPairing === 0) return true
                    else return false
                });
                // console.log("buggy mandatory - ", _buggyMandatory, " : ",_slotBuggy);
                // console.log("caddy mandatory - ", _caddyMandatory, " : ",_slotCaddy);
                let _buggy: boolean = false;
                _buggy = (_buggyMandatory && _slotBuggy && _slotBuggy.length > 0)?false:true;
                
                let _caddy: boolean = false;
                _caddy = (_caddyMandatory && _slotCaddy && _slotCaddy.length > 0)?false:true;
                
                // if((_buggyMandatory && _slotBuggy.length > 0)) return true
                // console.log(_buggy, _caddy);
                return _buggy && _caddy;
            case '4':
                return true;
            case '5':
                // this.bookingSlot.bookingStatus.toLowerCase() === 'secured' ||
                // this.bookingSlot.bookingStatus.toLowerCase() === 'paid' ||
                // this.bookingSlot.bookingStatus.toLowerCase() === 'paymentfull' ||
                if ((this.bookingSlot.amountPayable === this.bookingSlot.amountPaid) ||
            (_balance <= 0))
                    return true
                else return false
            case '6':
                this.bookingSlot.bookingPlayers.forEach((p: TeeTimeBookingPlayer) => {
                    // console.log("Booking Tabs - ",tabs, " : confirmed? ", p.confirmed)
                    if (!p.confirmed) {
                        _complete = false;
                    }

                })
                return _complete;
        }
    }

    checkExclamationInfo(tabs: string) {
        let _message;
        switch (tabs) {
            case '1':
                _message = 'At least one (1) player needs to be added';
                break;
            case '2':
                _message = 'At least ' + this.bookingSlot.slotAssigned.minPlayers + ' player(s) need to be added';
                break;
            case '3':
                _message = 'Select buggy seating/walking option and caddy pairing';
                break;
            case '4':
                break;
            case '5':
                _message = 'Please make a deposit or full payment';
                break;
            case '6':
                _message = 'Please check-in all confirmed players';
                break;
        }

        let alert = this.alertCtrl.create({
            title: 'Booking Validation',
            // subTitle: 'Selected date is '+ _date,
            message: _message, //'Selected date is ' + '<b>' + _date + '</b>',
            buttons: ['Close']
            // buttons: [{
            //         text: 'No',
            //         handler: () => {
            //             // console.log('Cancel clicked');
            //         }
            //     },
            //     {
            //         text: 'Yes',
            //         handler: () => {
            //             // console.log('Cancel clicked');
            //         }
            //     },
            // ]
        });
        alert.present();
    }

    counterDisplay() {
        this.getTimer();
        // setInterval(()=>{
        //     this.getTimer();
        // },1000)
    }

    getTimer() {
        let _date = moment(this.bookingSlot.slotAssigned.teeOffDate).format("YYYY-MM-DD");
        let _time = moment(this.bookingSlot.slotAssigned.teeOffTime, "HH:mm:ss").format("hh:mm:ss");
        const deadline = moment(_date + " " + _time); // = 'June 26 2020 23:59:59 GMT+0800';
        // return moment("1982-05-25").countdown().toString();
        return this.getTimeRemaining(deadline).minutes + ' m,' + this.getTimeRemaining(deadline).seconds + ' secs';
    }

    getTimeRemaining(endtime) {
        // let _now = moment().format('');
        const total = Date.parse(endtime) - Date.parse(new Date().toString());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
        const days = Math.floor(total / (1000 * 60 * 60 * 24));

        return {
            total,
            days,
            hours,
            minutes,
            seconds
        };
    }

    countdownTeeTime() {
        //   this.countdownTimer = moment(this.bookingSlot.slotAssigned.teeOffDate).format('YYYY-MM-DD') + " " + moment(this.bookingSlot.slotAssigned.teeOffTime,"HH:mm:ss").format('hh:mm:ss'); 
        // //  console.log(moment(this.bookingSlot.slotAssigned.teeOffDate).format('YYYY-MM-DD') + " " + moment(this.bookingSlot.slotAssigned.teeOffTime,"HH:mm:ss").format('hh:mm:ss'))
        return moment(this.bookingSlot.slotAssigned.teeOffDate).format('YYYY-MM-DD') + " " + moment(this.bookingSlot.slotAssigned.teeOffTime, "HH:mm:ss").format('hh:mm:ss')
    }

    onCheckInAll() {
        //   this.checkInAllPlayers = !this.checkInAllPlayers;
        if (this.checkInAllPlayers) {
            this.checkInPlayers = [true, true, true, true, true, true]
        } else {
            this.checkInPlayers = [false, false, false, false, false, false]
        }
    }

    addETAcounter(type: number) {
        if (type > 0 && this.etaCounter === 60) return false;
        else if (type < 0 && this.etaCounter === 0) return false;
        if (type === 1)
            this.etaCounter += 5;
        else if (type === -1)
            this.etaCounter -= 5;
    }

    toggleETAoption() {
        if (this.arrivalOption.toLowerCase() === 'arrived') {
            this.arrivalOption = 'eta'
            this.etaCounter = 30;
        } else if (this.arrivalOption.toLowerCase() === 'eta') {
            this.arrivalOption = 'arrived'
            this.etaCounter = 0;
        } else if (this.arrivalOption.toLowerCase() === 'select') {
            this.arrivalOption = 'arrived'
            this.etaCounter = 0;
        }
    }

    displayArrivalOpt() {
        if (this.arrivalOption.toLowerCase() === 'arrived') {
            return 'I have arrived'
        } else if (this.arrivalOption.toLowerCase() === 'eta') {
            return "On the way, ETA<br>(in mins)"
        } else if (this.arrivalOption.toLowerCase() === 'select') {
            return 'Tap here to notify club'
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

    onEstimatePriceClick() {
        let _message = 'This is only an estimated visitor price. As you select players and options, an accurate price will be displayed on top. '
        let alert = this.alertCtrl.create({
            title: 'Estimated Price',
            // subTitle: 'Selected date is '+ _date,
            message: _message, //'Selected date is ' + '<b>' + _date + '</b>',
            buttons: ['Close']
        });
        alert.present();
    }

    onCheckInClick() {
        if (!this.checkBookingTabsComplete('5')) {
            MessageDisplayUtil.showMessageToast('Please make full payment to proceed with check-in',
                this.platform, this.toastCtl, 3000, "bottom")
            return false;
        }
        let _checkInMsg; // = true;
        // _checkInMsg = 
        this.checkInPlayers.filter((i) => {
            return i === true
        }).map((p) => _checkInMsg = true)
        if (!_checkInMsg) {
            MessageDisplayUtil.showMessageToast('Please select at least one (1) player to check-in',
                this.platform, this.toastCtl, 3000, "bottom")
            return false;
        }
      //  console.log("on check in players ", _checkInMsg, this.checkInPlayers)
        let alert = this.alertCtrl.create({
            title: 'Check-In Booking Players',
            // subTitle: 'Selected date is '+ _date,
            message: 'Do you want to check-in for selected players?', //'Selected date is ' + '<b>' + _date + '</b>',
            buttons: [{
                text: 'No',
                role: 'cancel'
            },{
                text: 'Check-in',
                handler: () => {
                    this.goCheckInBooking();
                }
            }, ]
        });
        alert.present();


    }

    goCheckInBooking() {
        let _byClub = true;
        let _arrivingIn = this.etaCounter;
        let _bookingId = this.bookingSlot.id;
        let _bookingPlayerId = [];
        this.bookingSlot.bookingPlayers.forEach((b: TeeTimeBookingPlayer, playerIdx: number) => {
            this.checkInPlayers.forEach((checkIn, idx) => {
                if (idx === playerIdx && checkIn && b) _bookingPlayerId.push(b.id)
              //  console.log("i : ", idx, " - ", checkIn)
            })
        })
        // let loader = this.loadingCtrl.create({
        //     showBackdrop: false
        // });

        // loader.present().then(() => {
        this.flightService.checkinBooking(_bookingId, _arrivingIn, _bookingPlayerId, _byClub)
            .subscribe((data) => {
                // loader.dismiss().then(()=>{
                if (data && data.status === 200) {
                    this.refreshBookingObject(data.json());
                    // this.refreshBookingDetails();

                } else if (data && data.status === 0) {
                    MessageDisplayUtil.showMessageToast('Error ' + data.status + ' : Please check-in again',
                        this.platform, this.toastCtl, 3000, "bottom");
                } else {
                    MessageDisplayUtil.showMessageToast('Error : Please check-in again',
                        this.platform, this.toastCtl, 3000, "bottom")
                }
                // });
              //  console.log("after check in booking : ", data, _bookingId, this.bookingSlot.id)

            }, (error) => {
                // loader.dismiss();
                MessageDisplayUtil.showMessageToast('Inside Error : Please check-in again',
                    this.platform, this.toastCtl, 3000, "bottom")
            })
        // });
        // console.log("go check in ", _bookingPlayerId);
        // this.flightService.processBookingAssignments(_bookingId)
        //     .subscribe((processData)=>{
        //       //  console.log("after process asgmt : ", processData)
        //         if(processData) {

        //         }
        //     });


    }

    onCancelBooking() {
        if (!this.fromClub && this.bookingSlot.bookingStatus === 'PaymentFull') {
            MessageDisplayUtil.showMessageToast('Full Payment have been made. Booking cancellation is disabled. Please refer to the club.',
                this.platform, this.toastCtl, 3000, "bottom")
            return false;
        }
        
        if (!this.fromClub && (this.bookingSlot.bookingStatus === 'PaymentPartial' || (this.bookingItemBill && this.bookingItemBill.totalPayment > 0))) {
            MessageDisplayUtil.showMessageToast('Partial Payment have been made. Booking cancellation is disabled. Please refer to the club.',
                this.platform, this.toastCtl, 3000, "bottom")
            return false;
        }
        let _paidStatus: boolean = false;
        if(this.bookingSlot.bookingStatus === 'PaymentPartial')
            _paidStatus = true;
        else if(this.bookingSlot.bookingStatus === 'PaymentFull')
            _paidStatus = true;
        else if(this.bookingItemBill && this.bookingItemBill.totalPayment > 0)
            _paidStatus = true;
        // || (this.bookingItemBill && this.bookingItemBill.totalPayment > 0);

        let alert;
        if(_paidStatus && this.fromClub) {
            alert = this.alertCtrl.create({
                title: 'Paid Booking',
                // subTitle: 'Selected date is '+ _date,
                message: 'Payment has been made, please make a refund before cancellation. This will open the refund page.', //'Selected date is ' + '<b>' + _date + '</b>',
                // inputs: [{
                //     name: 'reason',
                //     placeholder: 'Reason for cancellation (optional)'
                // }, ],
                buttons: [ {
                    text: 'Dismiss',
                    role: 'cancel'
                },
                {
                    text: 'Ok',
                    handler: (data) => {
                        // this.goCancelBooking(data);
                        this.onRefundClick('cancel');
                    }
                },]
            });
        } 
        else if(this.fromClub){
            this.onRefundClick('cancel');
        } 
        else {
            alert = this.alertCtrl.create({
                title: 'Booking Cancellation',
                // subTitle: 'Selected date is '+ _date,
                message: 'Are you sure you want to cancel this booking?', //'Selected date is ' + '<b>' + _date + '</b>',
                inputs: [{
                    name: 'reason',
                    placeholder: 'Reason for cancellation (optional)'
                }, ],
                buttons: [ {
                    text: 'No',
                    role: 'cancel'
                },
                {
                    text: 'Yes',
                    handler: (data) => {
                        this.goCancelBooking(data);
                    }
                },]
            });

        }
        if(alert) alert.present();
    }

    goCancelBooking(data: any) {
        let _reason = data ? data.reason : '';
        let _bookingId = this.bookingSlot.id;
      //  console.log("go cancel booking : ", data)
      //  console.log("cancel booking", this.bookingSlot.id, _bookingId)
        let _cancelledByClub = this.fromClub?this.fromClub:false;
        this.flightService.cancelBooking(this.bookingSlot.id, _cancelledByClub, _reason)
            .subscribe((data) => {
                if (data.status === 200) {
                    // this.nav.push(BookingHomePage, {
                    //     cancelBooking: true,
                    //     // callback: this.myCallbackFunction
                    // })
                    this.nav.pop()
                    // this.nav.pop({
                    //     cancelBooking: true
                    // });
                    // this.nav.push(BookingHomePage)
                }
              //  console.log("cancel booking : ", data)
            })
    }
    public ionViewWillLeave() {
        if(this.afterBook) this.nav.getPrevious().data.afterBook = true;
      //  console.log("leave after book", this.afterBook)
        this.nav.getPrevious().data.cancelBooking = true;
        if (!this.teeSlotNew && this.bookingSlot.bookingStatus !== 'PaymentFull' && !this.bookingSlot.assignmentDone)
            this.onCancelAssignment(true);
    }

    ionViewCanLeave() {
        if(!this.teeSlotNew && this.hasPreferenceChanges()) {
            this.onResetPreference('leave');
            return false;
        }
    }

    myCallbackFunction = function (_params) {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    onClearPlayerDetails(playerIdx: number) {
        let alert = this.alertCtrl.create({
            title: 'Clear all details',
            // subTitle: 'Selected date is '+ _date,
            message: 'Do you want to clear all details for the player?', //'Selected date is ' + '<b>' + _date + '</b>',
            buttons: [ {
                text: 'No',
                role: 'cancel'
            },
            {
                text: 'Clear',
                handler: () => {
                    this.clearPlayerDetails(playerIdx);
                }
            },]
        });
        alert.present();
    }

    clearPlayerDetails(playerIdx: number) {
        
        this.buggyCaddyPreference.ignoreBuggyUpdate = false;
        this.buggyCaddyPreference.ignoreCaddieUpdate = false;
        this.buggyCaddyPreference.playerPairings.filter((p: PlayerBuggyCaddiePreference) => {
            return p.bookingPlayerId === this.bookingSlot.bookingPlayers[playerIdx].id
        }).map((p: PlayerBuggyCaddiePreference) => {
            // if(this.bookingOptions&&!this.bookingOptions.buggyMandatory) {
            if (this.bookingSlot && this.bookingSlot.slotAssigned.allowWalking) {
                p.buggyPairing = 0
                p.buggyRequired = false;
            }
            // if(this.bookingOptions&&!this.bookingOptions.caddyMandatory) {
            if (this.bookingSlot && !this.bookingSlot.slotAssigned.caddyMandatory) {
                p.caddyPairing = 0
                p.caddyRequired = false;
            }
            p.driving = false;
            // p.caddyRequired = false;
            p.caddiePreferred = null;
            p.caddieAssigned = null;
        });

        this.flightService.updateBuggyCaddiePreference(this.buggyCaddyPreference)
            .subscribe((data) => {
                if (data.status === 200) {
                    this.refreshBookingDetails();
                }
            })


        // this.flightService.updateBookingPlayerDetails(this.bookingSlot.id,this.bookingSlot.bookingPlayers[playerIdx],'clear',this.bookingOptions)
        // .subscribe((data:any)=> {
        //   //  console.log("clear all details : ", data);
        //     this.refreshBookingDetails();
        // })
    }
    onHomeClick() {
        if(this.paymentClickedBoolean) return false;
        this.nav.popToRoot(); //this.nav.setRoot(PlayerHomePage);
    }

    refreshBookingObject(bookingByPlayer: TeeTimeBooking) {
        let _bookingSlot = bookingByPlayer;
        // if(_bookingSlot.bookingStatus.toLowerCase() === 'paymentpartial' || _bookingSlot.bookingStatus.toLowerCase() === 'paymentfull') {
        //     this.onProcessAssignment();
        //     this.getBookingItemizedBill(true);
        //     return;
        // }

        this.bookingCancelGuard = false;

        this.playersBalance = 0;
        this.paymentClickedBoolean = false;
      //  console.log("refresh booking object ", bookingByPlayer)


        // caddySchedule.forEach((caddyS: any) => {
        //     JsonService.deriveFullUrl(buggy, "buggyImage");
        //    })
        if (bookingByPlayer) {
            this.bookingSlot = bookingByPlayer
            this.bookingCancelGuard = this.bookingSlot.cancellationGuard;

            this.bookingSlot.bookingPlayers.forEach((player: TeeTimeBookingPlayer) => {
                JsonService.deriveFulImageURL(player.player, "image")
                JsonService.deriveFulImageURL(player.player, "profile")
                JsonService.deriveFulImageURL(player.caddyPreferred, "caddyImage")
                JsonService.deriveFulImageURL(player.caddyAssigned, "caddyImage")
            })
            
            this.assignmentDone = this.bookingSlot.assignmentDone;

            this.buggyCaddyPreference = {};
            this.buggyCaddyPreference.bookingId = bookingByPlayer.id;
            this.buggyCaddyPreference.playerPairings = [{
                bookingPlayerId: 0,
                buggyRequired: true,
                buggyPairing: 0,
                driving: false,
                caddieAssigned: null,
                caddiePreferred: null,
                caddyPairing: 0,
                caddyRequired: false,
            }];
            
            if(this.bookingSlot.bookingDiscounts && this.bookingSlot.bookingDiscounts.length > 0) 
            this.bookingDiscounts = this.bookingSlot.bookingDiscounts.filter((d: TeeTimeBookingDiscount)=>{
                if(d.voucherApplied) return d.voucherApplied.redeemed
            });
            else this.bookingDiscounts = [];

            this.removedPlayers = this.bookingSlot.bookingPlayers.filter((p)=>{
                return p.playerRemoved;
            })
            this.bookingSlot.bookingPlayers = this.bookingSlot.bookingPlayers.filter((p)=>{
                return !p.playerRemoved
            });
            this.bookingSlot.bookingPlayers.sort((a, b) => {
                if (a.sequence < b.sequence)
                    return -1;
                else if (a.sequence > b.sequence)
                    return 1;
                else 0;
            });
            // if(this.bookingSlot.bookingPlayers && this.bookingSlot.bookingPlayers.length > 0) {
            //     this.bookingSlot.bookingPlayers = this.bookingSlot.bookingPlayers.sort((a,b) => {
            //         if(!a.playerRemoved && b.playerRemoved) return -1
            //         else if(a.playerRemoved && !b.playerRemoved) return 1
            //         else return 0
            //     })
            // }; 
            let _eighteenHoles = this.bookingSlot.slotAssigned.eighteenHolesAllowed;
            let _nineHoles = this.bookingSlot.slotAssigned.nineHolesAllowed;
            if(_eighteenHoles && _nineHoles) {
                this.holesPlayed = "2";
                this.eighteenHolesAllowed = true;
                this.nineHolesAllowed = true;
            } 
            else if(!_eighteenHoles && _nineHoles) {
                this.holesPlayed = "1";
            }
            else if(_eighteenHoles && !_nineHoles) {
                this.holesPlayed = "2";
                this.eighteenHolesAllowed = true;
                this.nineHolesAllowed = false;
            } else if(!_eighteenHoles && !_nineHoles) {
                this.holesPlayed = "1";
                this.eighteenHolesAllowed = false;
                this.nineHolesAllowed = false;
            }


            this.bookingSlot.bookingPlayers.forEach((p, i) => {
                let _caddyPairing = 0;
                if (p.caddyPairing > 0) {
                    _caddyPairing = p.caddyPairing; // - 1
                    if (!this.caddyPairing[_caddyPairing]) {
                        this.caddyPairing[_caddyPairing] = {
                            caddyPreferred: p.caddyPreferred,
                            caddyPairing: p.caddyPairing,
                            caddySelectionCriteria: p.caddySelectionCriteria ? p.caddySelectionCriteria : null,
                            caddyAssigned: p.caddyAssigned ? p.caddyAssigned : null,
                            caddyRequired: p.caddyPairing > 0?true:false,
                        }
                    }
                    if (!this.caddySlots[_caddyPairing]) {
                        // && p.caddyPreferred
                        this.caddySlots[_caddyPairing] = {
                            caddyPairing: p.caddyPairing ? p.caddyPairing : 0,
                            caddyPreferred: p.caddyPreferred ? p.caddyPreferred : null,
                            caddySelectionCriteria: p.caddySelectionCriteria ? p.caddySelectionCriteria : null,
                            caddyAssigned: p.caddyAssigned ? p.caddyAssigned : null,
                            caddyRequired: p.caddyPairing > 0?true:false,
                        }
                    }

                }
                this.buggyCaddyPreference.playerPairings.push(Object.assign({}, this.buggyCaddyPreference[i], {
                    bookingPlayerId: p.id,
                    buggyRequired: p.pairingNo !== 0 ? true : false,
                    buggyPairing: p.pairingNo,
                    driving: p.driving,
                    caddiePreferred: p.caddyPreferred && p.caddyPreferred.id ? p.caddyPreferred.id : null,
                    caddieAssigned: p.caddyAssigned && p.caddyAssigned.id ? p.caddyAssigned.id : null,
                    caddyPairing: p.caddyPairing,
                    caddyRequired: p.caddyPairing>0?true:false,
                    caddyPreferred: p.caddyPreferred,
                    caddyAssigned: p.caddyAssigned,
                    assignedBuggy: p.buggyId,
                }))
                
                if(p.player && p.player.id)
                    if(this.fromClub) this.getPlayersCredits(999, p.player.id);
            });
            if(!this.fromClub && this.currentPlayerId) this.getPlayersCredits(999, this.currentPlayerId);

            this.uniqBuggy = this.getUnique(this.bookingSlot.bookingPlayers, 'pairingNo');
            this.uniqBuggy = this.uniqBuggy.filter((ub)=>{
                return ub.pairingNo > 0
            })
            this.uniqCaddy = this.getUnique(this.bookingSlot.bookingPlayers, 'caddyPairing');
            this.uniqCaddy = this.uniqCaddy.filter((uc)=>{
                return uc.caddyPairing > 0
            })
            if (this.uniqBuggy) this.buggyReq = this.uniqBuggy.length;
            if (this.uniqCaddy) this.caddyReq = this.uniqCaddy.length;
            if (this.uniqCaddy) this.uniqCaddy.forEach((c: TeeTimeBookingPlayer, idx: number)=>{
                this.caddyRatingCommentOn[idx] = false;
            })

          //  console.log("uniq caddy - refresh object", this.uniqCaddy)

            this.buggyCaddyPreference.playerPairings.shift();
            this.buggyCaddyPreference.ignoreBuggyUpdate = true;
            this.buggyCaddyPreference.ignoreCaddieUpdate = true;
            this.newBuggyCaddyPreference = JSON.parse(JSON.stringify(this.buggyCaddyPreference));

            // this.depositAmount = this.bookingSlot.depositPayable?this.bookingSlot.depositPayable:this.bookingOptions?this.getDepositAmount():0;
            this.paymentStatus = this.bookingSlot.bookingStatus === 'PaymentFull' ? 'Paid' : 'Pending';
            
            this.buggyRequired = this.bookingSlot.buggyRequested === 0 ? false : true;
            this.caddyRequired = this.bookingSlot.caddyRequested === 0 ? false : true;

            // this.updatingPlayer = false;

            // this.buggyRequired = this.bookingSlot.buggyRequested===0?false:true;
            // this.caddyRequired = this.bookingSlot.caddyRequested===0?false:true;
            setTimeout(()=>{
                if(this.updatingPlayer && this.assignmentDone) {
                    this.updatePreference();
                    // this.updatingPlayer = false;
                }

            }, 500)
        }
    }

    getBookingItemizedBill(afterAssignment ? : boolean) {
        this.refresherBill = true;
        let _afterAssignment = this.assignmentDone;
        let loader = this.loadingCtrl.create({
            showBackdrop: false,
            duration: 5000,
            content: 'Refreshing bill...'
        });
        let _bookingItemBill;

        loader.present().then(() => {
            this.flightService.getBookingItemizedBill(this.bookingSlot.id, _afterAssignment)
                .subscribe((data: Response) => {
                    this.bookingItemBill = {};
                    loader.dismiss().then(() => {
                        this.refresherBill = false;
                        if (data && data.status === 200) {
                            _bookingItemBill = data.json();
                            this.bookingItemBill = _bookingItemBill;
                            this.bookingItemBill.payments.sort((a,b)=>{
                                if(a.datePaid < b.datePaid)
                                    return 1
                                else if(a.datePaid > b.datePaid)
                                    return -1
                                else return 0
                            })
                            if (this.bookingItemBill.changes && this.bookingItemBill.changes.length > 0)
                                this.asgmtDiff = true;
                          //  console.log("data", data.json());
                          //  console.log("data 2", data)
                          //  console.log("data", _bookingItemBill)
                          //  console.log("booking itemized bill : ", this.updatingPlayer, this.assignmentDone)
                            // if(this.updatingPlayer && this.assignmentDone) this.updatePreference();
                            if(!afterAssignment) this.paymentStatus = '';
                        }
                    })

                }, (error) => {
                    this.refresherBill = false;
                    this.bookingItemBill = {};
                }, () =>{
                    if(this.grpPayment) this.getPaymentGateway(this.bookingSlot.clubData.address.countryData.id);
                    // this.updatingPlayer = false;
                })
        })
    }

    onMoreTeeSlotSettings() {
        let _minPlayers = this.teeTimeSlotDisplay.slot.minPlayers ? this.teeTimeSlotDisplay.slot.minPlayers : this.bookingSlot.slotAssigned.minPlayers;
        let _maxPlayers = this.teeTimeSlotDisplay.slot.maxPlayers ? this.teeTimeSlotDisplay.slot.maxPlayers : this.bookingSlot.slotAssigned.maxPlayers
        let _cancelText = this.bookingOptions.cancelBeforeHours?'Cancellation before <b>' + this.bookingOptions.cancelBeforeHours + ' hours</b>':'';
        let _playersAllowedText = 'Min <b>' + _minPlayers + '</b> / Max <b>' + _maxPlayers + '</b> players allowed';
        let _checkInText = 'Check in before <b>' + this.bookingOptions.checkinMinutes + ' minutes</b>';
        let _buggyMandatory = (this.teeTimeSlotDisplay && this.teeTimeSlotDisplay.slot.allowWalking) || (this.bookingSlot && this.bookingSlot.slotAssigned.allowWalking) ? 'No' : 'Yes';
        let _buggyMax = (this.teeTimeSlotDisplay && this.teeTimeSlotDisplay.slot.maxPlayersPerBuggy) ? this.teeTimeSlotDisplay.slot.maxPlayersPerBuggy : (this.bookingSlot.slotAssigned.maxPlayersPerBuggy) ? this.bookingSlot.slotAssigned.maxPlayersPerBuggy : 'n/a'
        let _caddyMandatory = (this.teeTimeSlotDisplay && this.teeTimeSlotDisplay.slot.caddyMandatory) || (this.bookingSlot && this.bookingSlot.slotAssigned.caddyMandatory) ? 'Yes' : 'No';
        let _caddyMax = (this.teeTimeSlotDisplay && this.teeTimeSlotDisplay.slot.maxPlayersPerCaddy) ? this.teeTimeSlotDisplay.slot.maxPlayersPerCaddy : (this.bookingSlot.slotAssigned.maxPlayersPerCaddy) ? this.bookingSlot.slotAssigned.maxPlayersPerCaddy : 'n/a'
        let _maxUnpaidBookings = 'Max. Unpaid bookings : <b>'+this.bookingOptions.maxUnpaidBookings+'</b>';
        let _allowCaddieBooking = "Caddie Booking : <b>"+(this.bookingOptions.allowCaddiePreference?"Allowed":"Not allowed")+"</b>"
        // <!-- <h4 *ngIf="bookingOptions&&bookingOptions.checkinMinutes">Check in before <b>{{bookingOptions&&bookingOptions.checkinMinutes?bookingOptions.checkinMinutes:'n/a'}}</b> minutes</h4>
        // <h4 *ngIf="bookingOptions&&bookingOptions.cancelBeforeHours">Cancellation allowed before <b>{{bookingOptions&&bookingOptions.cancelBeforeHours?bookingOptions.cancelBeforeHours:'n/a'}}</b> hours</h4> -->



        // <!-- <h4>Min {{teeTimeSlotDisplay.slot.minPlayers}} / 
        // Max {{teeTimeSlotDisplay.slot.maxPlayers}} players allowed </h4> -->

        let _message = _playersAllowedText + '<br>' + _cancelText + '<br>' + _checkInText +
            '<br>Buggy mandatory? <b>' + _buggyMandatory + '</b><br>Max players per buggy : <b>' + _buggyMax + '<br></b>Caddy mandatory? <b>' + _caddyMandatory + '<br></b>Max players per caddy : <b>' + _caddyMax + '</b>' + '<br>'+_maxUnpaidBookings +"<br>"+_allowCaddieBooking;
        // 'This is only an estimated visitor price. As you select players and options, an accurate price will be displayed on top. '
        let alert = this.alertCtrl.create({
            title: 'Tee Slot Settings',
            // subTitle: 'Selected date is '+ _date,
            message: _message, //'Selected date is ' + '<b>' + _date + '</b>',
            buttons: ['Close']
        });
        alert.present();
    }

    getEstimatedPrice(attribute: string) {
        let _reqPlayers = (this.bookingSlot && this.bookingSlot.totalPlayers) ? this.bookingSlot.totalPlayers : 0;
        let _cost = this.bookingSlot.priceMap['STD'];
        let _players = (this.bookingSlot && this.bookingSlot.bookingPlayers.length ? this.bookingSlot.bookingPlayers.length : this.playerReq);
        let _costText = this.bookingSlot.slotAssigned.currency.symbol + ' '
        switch (attribute) {
            case 'requested':
                return (_reqPlayers * _cost)
            case 'actual':
                return this.bookingSlot.amountPayable - this.bookingSlot.totalDeductions;
                // return (_players * _cost)
        }

    }

    getBookingTotalAmount() {

        // let _amountPayable;
        // if (this.bookingSlot.amountPaid > 0 && this.bookingSlot.amountPaid < (this.bookingSlot.amountPayable - this.bookingSlot.totalDeductions))
        //     _amountPayable = this.bookingSlot.amountPayable - this.bookingSlot.amountPaid + this.bookingSlot.totalDeductions;
        // else if (this.bookingSlot.amountPaid === this.bookingSlot.amountPayable)
        //     _amountPayable = this.bookingSlot.amountPaid
        // // else if (this.bookingSlot.amountPaid === (this.bookingSlot.amountPayable - this.bookingSlot.totalDeductions))
        // // _amountPayable = this.bookingSlot.amountPaid + this.bookingSlot.totalDeductions;
        // else {
        //     // if(this.paymentAmountType === 'mine' && this.playerChargeAmount) _amountPayable = this.playerChargeAmount
        //     if(0) console.log("portion payable")
        //     else _amountPayable = this.bookingSlot.amountPayable - this.bookingSlot.totalDeductions;
        // }
        // return _amountPayable;

        let _amountPayable;
      //  console.log("get booking total amount", this.bookingItemBill.balance)
        if (this.bookingItemBill.balance > 0)
        // this.bookingSlot.amountPaid > 0 && this.bookingSlot.amountPaid < (this.bookingSlot.amountPayable - this.bookingSlot.totalDeductions)
            _amountPayable = this.bookingItemBill.balance;
            // this.bookingSlot.amountPayable - this.bookingSlot.amountPaid + this.bookingSlot.totalDeductions;
        else if(this.bookingItemBill.balance < 0)
            _amountPayable = this.bookingItemBill.balance;
        else if (this.bookingItemBill.balance === 0)
            _amountPayable = this.bookingItemBill.totalPayment
    }

    togglePayHistory() {
        this.displayPayHistory = !this.displayPayHistory;
    }

    toggleRefundHistory() {
        this.displayRefundHistory = !this.displayRefundHistory;
    }

    logRatingChange(rating) {
      //  console.log("rating change ", rating)
    }

    logClubRating(rating) {

    }

    logBookingRating(rating) {

    }


    resize() {
        this.myInput.nativeElement.style.height = this.myInput.nativeElement.scrollHeight + 'px';
    }

    getAsgmtDiffDetails(type: string, attribute: string) {
        let _caddyPlayers = this.getUnique(this.bookingSlot.bookingPlayers, 'caddyPairing');
        let _caddyPaired = _caddyPlayers.filter((player: TeeTimeBookingPlayer) => {
            return player.caddyPairing !== 0 && player.caddyPreferred
        })
        let _caddyAvailable = _caddyPlayers.filter((player: TeeTimeBookingPlayer) => {
            return player.caddyPairing !== 0 && player.caddyAssigned
        })
      //  console.log('caddy avl - ', _caddyAvailable)
      //  console.log('caddy req - ', _caddyPaired)
        // if(_caddyPaired && _caddyPaired[0].caddyPairing === 0) _caddyPaired.shift();
        if (type === 'caddies') {
            switch (attribute) {
                case 'req':
                    return _caddyPaired ? _caddyPaired.length : 0;
                case 'avl':
                    return _caddyAvailable ? _caddyAvailable.length : 0;
            }
        } else if (type === 'buggies') {
            switch (attribute) {
                case 'req':
                    return this.buggyDiff ? this.buggyDiff.length : 0;
                case 'avl':
                    return this.buggiesAssigned ? this.buggiesAssigned.length : 0;
            }
        }

    }

    onCancelAssignment(exit: boolean = false) {
        let _bookingId;
        this.paymentClickedBoolean = false;
        this.paymentMode = false;
        // if(this.bookingItemBill && this.bookingItemBill.totalPayment > 0) return;
        // if(this.bookingSlot.assignmentDone && this.pay) return;
        if(this.bookingSlot && this.bookingSlot.bookingStatus === 'PaymentFull') return;
        if (this.bookingSlot && this.bookingSlot.id) _bookingId = this.bookingSlot.id;
        this.flightService.cancelBookingAssignments(this.bookingSlot.id)
            .subscribe((data) => {
                if (data && data.status === 200) {
                    // console.log('has data', data)
                    if (!exit) this.getBookingItemizedBill(false);
                    this.refreshBookingObject(data.json())
                }

                // console.log('cancel booking assignment', data)
            })
    }

    setStar(type: string, x: number, attribute: string, idx ? : number) {
        if (type === 'club') this.clubRating = x;
        else if (type === 'booking') this.bookingRating = x;
        else if (type === ('caddy' + idx)) this.caddyRating[idx] = x;
        else if (type === 'clubItem' + idx) this.clubRatingItems[idx]['rating'] = x;
      //  console.log("set star", type,x,attribute,idx,this.caddyRating) 
    }

    getStar(type: string, x: number, attribute: string, idx ? : number) {
        let _rating;
        if (type === 'club') _rating = this.clubRating;
        else if (type === 'booking') _rating = this.bookingRating;
        else if (type === ('caddy' + idx)) _rating = this.caddyRating[idx]
        else if (type === ('clubItem' + idx)) _rating = this.clubRatingItems[idx]['rating'];

        if (attribute === 'set') return x <= _rating;
        if (attribute === 'unset') return x > _rating;
    }

    openProfile() {
        if(this.fromClub) return false;
        if(this.paymentClickedBoolean) return false;
        this.nav.push(ProfilePage, {
            type: 'playerProfile',
            player: this.player$
        });
    }


    onRateApp() {

        window.open("https://play.google.com/store/apps/details?id=com.brite.mygolf2u", "_system");
        if (1) return false;
      //  console.log("platform? ", this.platform)
        if ((this.platform.is("ios") || this.platform.is("android") || this.platform.is("ipad") || this.platform.is("iphone")) && this.platform.is("cordova")) {
          //  console.log("1");
            // this.appRate.promptForRating(false);
        } else if (this.platform.is("core")) {
          //  console.log("2");
            window.open("https://play.google.com/store/apps/details?id=com.brite.mygolf2u", "_system");
            //https://play.google.com/store/apps/details?id=com.brite.mygolf2u
        } else if (this.platform.is("android") && (this.platform.is("mobile") || this.platform.is("mobileweb"))) {
            // window.open("https://play.google.com/store/apps/details?id=com.brite.mygolf2u", "_system");
          //  console.log("3");
            // this.appRate.promptForRating(false);
        } else {
          //  console.log("4");
            window.open("https://play.google.com/store/apps/details?id=com.brite.mygolf2u", "_system");
        }
    }

    getCaddy() {
      //  console.log("get caddy", this.uniqCaddy, this.bookingPlayers);

    }

    onZoomImageCaddy(player: TeeTimeBookingPlayer) {
        let _caddy: CaddyData = player.caddyAssigned;
        let imageZoom = this.modalCtl.create(ImageZoom, {
            image: _caddy.caddyImage ? _caddy.caddyImage : ''
        })

        imageZoom.onDidDismiss((data: any) => {});
        imageZoom.present();
    }

    onRateSubmit() {
        let _caddyRateEmpty;
        _caddyRateEmpty = this.caddyRating.filter((a) => {
            return a === 0
        })
        let _hasCaddy;
        _hasCaddy = this.uniqCaddy.filter((a: TeeTimeBookingPlayer) => {
            return a.caddyAssigned
        })
      //  console.log("on rate submit uniq caddy ", this.uniqCaddy)

      //  console.log("on rate submit", _caddyRateEmpty, _hasCaddy, this.caddyRating.length)
        if (this.clubRating === 0) {
            MessageDisplayUtil.showMessageToast('Please rate for Club Experience',
                this.platform, this.toastCtl, 3000, "bottom")
            return false;
        }
        // else if (this.bookingRating === 0) {
        //     MessageDisplayUtil.showMessageToast('Please rate for Booking ', 
        //     this.platform, this.toastCtl,3000, "bottom")
        //     return false;
        // } 
        else if ((_caddyRateEmpty && _caddyRateEmpty.length > 0) && (_hasCaddy && _hasCaddy.length > 0)) {
            MessageDisplayUtil.showMessageToast('Please rate for each Caddy Experience',
                this.platform, this.toastCtl, 3000, "bottom")
            return false;
        } else {
            let _clubRating = {};
            let _currentPlayer = this.bookingSlot.bookingPlayers.filter((p: TeeTimeBookingPlayer) => {
                if(p.player) return p.player.id === this.currentPlayerId
                else return false;
            })
            this.clubRatingItems.shift();
            _clubRating['playerName'] = this.currentPlayer.playerName;
            _clubRating['playerEmail'] = this.currentPlayer.email;
            _clubRating['playerPhone'] = this.currentPlayer.phone;
            _clubRating['overallRating'] = this.clubRating;
            _clubRating['player'] = _currentPlayer[0].player;
            _clubRating['itemizedRatings'] = this.clubRatingItems;
            _clubRating['overallRating'] = this.clubRating;
            _clubRating['review'] = this.myStuff;
            // _clubRating['itemizedRatings'] =  
            let loader = this.loadingCtrl.create({
                showBackdrop: false
            });

            loader.present().then(() => {
                this.flightService.rateForClub(this.bookingSlot.clubData.id, _clubRating)
                    .subscribe((data) => {
                        if(this.hasCaddyAssigned()) {
                            this.uniqCaddy.forEach((c: TeeTimeBookingPlayer, idx: number)=>{
                                if(c.caddyAssigned) {
                                    this.flightService.rateForCaddy(c.caddyAssigned.id,this.caddyRating[idx], this.currentPlayerId, this.caddyRatingComment[idx])
                                    .subscribe((dataCaddy) => {
                                        if(dataCaddy && dataCaddy.status === 200) {
                                            // MessageDisplayUtil.showMessageToast('Thank you for rating caddies! For '+c.caddyAssigned.firstName+' - '+ this.caddyRating[idx],
                                            // this.platform, this.toastCtl, 5000, "bottom")
                                        }
                                    });
                                }
                            })
                            
                        }
                        loader.dismiss().then(() => {
                            if (data && data.status === 200) {
                                MessageDisplayUtil.showMessageToast('Thank you for rating us!',
                                    this.platform, this.toastCtl, 5000, "bottom")
                                this.doneRating = true;
                            }
                          //  console.log("response from club rating", data)
                        })

                    })
            }, (error) => {
                loader.dismiss();
            })

        }
    }

    getClubRatingItems() {
        this.clubRatingItems[0] = {
            itemId: '',
            name: '',
            rating: 0
        }
        this.flightService.getClubRatingItems(this.bookingSlot.clubData.id)
            .subscribe((data: Array < any > ) => {
                if (data) {
                    data.forEach((d, idx) => {
                        this.clubRatingItems.push(Object.assign({}, this.clubRatingItems[idx], {
                            itemId: d.id,
                            name: d.name,
                            rating: 0
                        }))

                        // this.clubRatingItems[idx]['itemId'] = d.id;
                        // this.clubRatingItems[idx]['name'] = d.name;
                    })
                }
              //  console.log("get club rating items : ", data)
            })
    }

    // getCountDownTimer() {

    // }

    onLocalBill() {
        let prompt = this.alertCtrl.create({
            // Flight Name
            title: 'Enter a bill id',
            // subTitle: _required,
            message: '',
            inputs: [{
                name: 'title',
                placeholder: 'Bill Id'
            }, ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                        prompt.dismiss().then(() => {
                            this.keyboard.close();
                        });
                        return false;
                    }
                },
                {
                    text: 'Get',
                    handler: data => {
                        if (data.title)
                            prompt.dismiss().then(() => {
                                this.getBill(data.title,'ipay88')
                            })
                        else {
                            // _required = 'Please enter Group Name';
                            // _message = '<br>Please enter the Group Name';
                            let msg = MessageDisplayUtil.getErrorMessage('', "Please enter bill id");
                            MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl,
                                5000, "bottom");
                        }
                        return false;
                    }
                },
            ]
        });
        prompt.present();
    }

    getPaymentGateway(countryId?: string,paymentGatewayId?: string) {
        let _paymentGateway;
        let _countryId = countryId?countryId:null;
        this.paymentService.getPaymentGateway(_countryId,_paymentGateway)
        .subscribe((pgList: Array<PaymentGatewayInfo>)=>{
          //  console.log("client payment gateway ", pgList)
            if(pgList && pgList.length > 0 ) this.paymentGatewayList = pgList;
            // if(this.paymentGatewayList && this.paymentGatewayList.length > 0) {
            //     this.paymentBackendURL = this.pay
            // }
        })
    }

    onCheckDeposit(init?: boolean) {
        let _init: boolean = false;
        if(init) _init = true;
        if(_init) this.depositAmount = this.getDepositAmount();
        if(!this.depositAmount || (this.depositAmount === 0)) this.depositAmount = this.getDepositAmount();
      //  console.log("on check deposit ", this.depositAmount, this.getDepositAmount())
        if(this.depositAmount > this.bookingSlot.amountPayable) 
            this.depositAmount = Number(this.bookingItemBill.balance.toFixed(2));
            // this.bookingSlot.amountPayable - this.bookingSlot.amountPaid;
            // Number((this.bookingSlot.amountPayable - this.bookingSlot.amountPaid).toFixed(2));
            // this.depositAmount = Number((this.bookingSlot.amountPayable - this.bookingSlot.amountPaid).toFixed(2));
        else if(this.depositAmount < this.getDepositAmount()) this.depositAmount = this.getDepositAmount();
        else return false
    }

    // getClubPlayerDetails(attribute) {

    // }

    getClubPlayerDetails(attribute: string) {
        // player: TeeTimeBookingPlayer, 
        // console.log("club booking players : ", this.clubBookingPlayers)
        let _currentPlayer = this.clubBookingPlayers;
        

        // this.bookingSlot.bookingPlayers.filter((p: TeeTimeBookingPlayer) => {
        //     return p.sequence === slot
        // })
        // let idx = slot - 1;

        // if(!_currentPlayer[idx].player || _currentPlayer[idx].player === null) return "";
        // console.log("player slot details - ", "[",idx,"]",_currentPlayer[idx])

        let _id; // = this.clubBookingPlayers.id;
        // let _isMe: boolean = (_currentPlayer[idx] && _currentPlayer[idx].player && (_currentPlayer[idx].player.id === this.currentPlayerId)) ? true : false;

        // console.log("player slot details - ", "[",idx,"]",_currentPlayer[idx], "you ? : ", _isMe)
        // if (_currentPlayer[idx] && _currentPlayer[idx].player)
        //     _id = "(#" + _currentPlayer[idx].player.id + ")";
        // else "";
        // _id = (_currentPlayer[idx].player && _currentPlayer[idx].player.id?"(#"+_currentPlayer[idx].player.id+")":"");
        _currentPlayer?console.log("get club player details : ", _currentPlayer):null;
        if (this.clubBookingPlayers) {
            switch (attribute) {
                case 'name':
                    return (_currentPlayer && _currentPlayer.playerName? _currentPlayer.playerName: ''); //player.playerName;
                case 'id':
                    return (_currentPlayer && _currentPlayer.playerId ? '(#'+_currentPlayer.playerId+')': (_currentPlayer && _currentPlayer.id)?'(#'+_currentPlayer.id+')':'');
                case 'image':
                    return (_currentPlayer && _currentPlayer.image ? _currentPlayer.image : _currentPlayer.profile?_currentPlayer.profile:'');
                // case 'isContactComplete':
                //     // console.log("is contact complete? : ",_currentPlayer[idx])
                //     let _newPlayer = (_currentPlayer.player) ? false : true;
                //     if (_newPlayer) return _currentPlayer.playerContact && _currentPlayer.play  .playerContact.length > 0
                //     else {
                //         let _currPlAddress = _currentPlayer.player.address;
                //         if (_currPlAddress.address1 &&
                //             _currPlAddress.state &&
                //             _currPlAddress.city &&
                //             _currPlAddress.postCode &&
                //             _currPlAddress.phone1) return true
                //         else return false;
                //     }
                    case 'discount':
                        return '<span style="color:red">No promotion</span>'
                        // [src]="x.player && x.player.image?x.player.image:''"
                        // return _id; //player.player.id;
                        // case 'id':
                        //     return this.bookingSlot.bookingPlayers[slot].pla
            }
        } else {
            switch (attribute) {
                case 'name':
                    return "Tap + or enter Mship / myG2u #";
                    // return "Select Golfer "+ slot;
                case 'id':
                    return ''; //this.bookingSlot.bookingPlayers[slot].player.id; //player.player.id;
                case 'isContactComplete':
                    return false;
                case 'image':
                    return '';
                    // case 'discount':
                    //     return '<span style="color:red">No promotion</span>'
                    // case 'id':
                    //     return this.bookingSlot.bookingPlayers[slot].pla
            }
        }

    }

    searchClubBookingPlayer() {
        if(this.clubSearchById <= 0) {
                        // this.searchByMembership[slot].length === 0
                        let alert = this.alertCtrl.create({
                            title: 'Adding player',
                            // subTitle: 'Selected date is '+ _date,
                            message: 'Please enter valid myG2u ID', //'Selected date is ' + '<b>' + _date + '</b>',
                            buttons: ['Close']
                        });
                        alert.present();
            
                        return false;
        }
        if (!this.clubSearchById && !this.clubSearchByMembership) {
            // this.searchByMembership[slot].length === 0
            let alert = this.alertCtrl.create({
                title: 'Adding player',
                // subTitle: 'Selected date is '+ _date,
                message: 'Tap + or Enter membership / myG2u ID', //'Selected date is ' + '<b>' + _date + '</b>',
                buttons: ['Close']
            });
            alert.present();

            return false;
        }

        let loader = this.loadingCtrl.create({
            showBackdrop: false,
            duration: 5000,
            content: 'Getting player...'
        });



        let _searchBy;

      //  console.log("this.searchbyid[slot] : ", this.clubSearchById);
      //  console.log("clubs : ", this.clubs);
        loader.present().then(() => {
            if (this.clubSearchById && this.clubSearchById > 0) {
                _searchBy = this.clubSearchById;
              //  console.log("searchby - player id : ", _searchBy)
                this.flightService.getPlayerById(_searchBy)
                    .subscribe((response: any) => {
                        loader.dismiss().then(() => {
                            let player = response.json();
                            JsonService.deriveFulImageURL(player, "image")
                            JsonService.deriveFulImageURL(player, "profile")
                            let _playerDetails: TeeTimeBookingPlayer = {};
                            _playerDetails['walking'] = this.buggyRequired ? !this.buggyRequired : true
                            _playerDetails['caddySelectionCriteria'] = {}
                            _playerDetails['caddySelectionCriteria']['caddyRequired'] = this.caddyRequired ? this.caddyRequired : false
                          //  console.log("search player by id : ", player, " | searchBy : ", _searchBy)
                            if (response.status === 200 && player) {
                                this.clubBookingPlayers = player;
                                // this.checkBookingPlayer(player).then((playerOk) => {
                                //   //  console.log("checkbookingplayer search :", playerOk)
                                //     if (playerOk) this.addPlayerToBooking({
                                //         playerId: player.id,
                                //         // sequence: slot,
                                //         playerDetails: _playerDetails,
                                //     });
                                // }, (error) => {
                                //   //  console.log("checkbookingplayer error : ", error)
                                // })

                            } else {
                                let alert = this.alertCtrl.create({
                                    title: 'MyGolf2u ID',
                                    // subTitle: 'Selected date is '+ _date,
                                    message: 'No player found for MG2U ID : <br>' + _searchBy, //'Selected date is ' + '<b>' + _date + '</b>',
                                    buttons: ['Close']
                                });
                                alert.present();
                            }
                        }, (error) => {
                            loader.dismiss().then(() => {
                                if (error.status !== 200) {
                                    let alert = this.alertCtrl.create({
                                        title: 'MyGolf2u ID',
                                        // subTitle: 'Selected date is '+ _date,
                                        message: 'No player found for MG2U ID : <br>' + _searchBy, //'Selected date is ' + '<b>' + _date + '</b>',
                                        buttons: ['Close']
                                    });
                                    alert.present();
                                }
                            });
                          //  console.log("player id error : ", error)


                        });

                    }, (error) => {
                        loader.dismiss().then(() => {
                            if (error.status !== 200) {
                                let alert = this.alertCtrl.create({
                                    title: 'MyGolf2u ID',
                                    // subTitle: 'Selected date is '+ _date,
                                    message: 'No player found for MG2U ID : <br>' + _searchBy, //'Selected date is ' + '<b>' + _date + '</b>',
                                    buttons: ['Close']
                                });
                                alert.present();
                            }
                        });
                      //  console.log("player id error : ", error)


                    });
            } else if (this.clubSearchByMembership && this.clubSearchByMembership.length > 0) {
                _searchBy = this.clubSearchByMembership;
              //  console.log("searchby - player membership : ", _searchBy)


                this.flightService.searchPlayerByMembership(_searchBy,this.clubInfo.clubId)
                    .subscribe((player: Array < PlayerData > ) => {
                        loader.dismiss().then(() => {
                            let _playerDetails: TeeTimeBookingPlayer = {};
                            _playerDetails['walking'] = this.buggyRequired ? !this.buggyRequired : true
                            _playerDetails['caddySelectionCriteria'] = {}
                            _playerDetails['caddySelectionCriteria']['caddyRequired'] = this.caddyRequired ? this.caddyRequired : false
                          //  console.log("search player by membership", player)
                            if (player && player.length > 0) {
                                let popover = this.popoverCtl.create(PlayerListPage, {
                                    // slot: slot,
                                    headerName: 'Players by Membership',
                                    playerList: player,
                                    forResultOnly: true
                                    // buggies: this.buggySlots,
                                    // courses: this.courses
                                }, {
                                    showBackdrop: true
                                });
                                popover.onDidDismiss((data: any) => {
                                    if (data && data.selected) {
                                        this.clubBookingPlayers = data.player;
                                        // this.checkBookingPlayer(data.player).then((playerOk) => {
                                        //   //  console.log("checkbookingplayer :", playerOk)
                                        //     if (playerOk) this.addPlayerToBooking({
                                        //         playerId: data.player.id,
                                        //         sequence: slot,
                                        //         playerDetails: _playerDetails,
                                        //     });
                                        // })

                                    }
                                });
                                popover.present({
                                    ev: event
                                });
                            } else {
                                let alert = this.alertCtrl.create({
                                    title: this.clubInfo.clubName,
                                    // subTitle: 'Selected date is '+ _date,
                                    message: 'Club membership number ' + _searchBy + ' does not exist for this club', //'Selected date is ' + '<b>' + _date + '</b>',
                                    buttons: ['Close']
                                });
                                alert.present();
                            }

                        })

                    })



            }
        });

    }

    clearClubSearchPlayer() {
        this.clubSearchByMembership = null;
        this.clubSearchById = null;
    }

    onClubPlayerSelect() {

        // let playersToExclude = this.bookingSlot.bookingPlayers;
      //  console.log("tee slot new ", this.teeSlotNew);
        let _playerSlots = 1;
        // if(!this.teeSlotNew) {
            _playerSlots = this.slots.length - (this.bookingSlot?this.bookingSlot.bookingPlayers.length:0);
          //  console.log("club player select : ", _playerSlots, this.slots.length , this.bookingSlot?this.bookingSlot.bookingPlayers.length:' nada ')
        // } 

        let clubModal = this.modalCtl.create(AddPlayerListPage, {
            openedModal: true,
            fromClub: true,
            maxPlayers: _playerSlots,
            teeSlotNew: this.teeSlotNew,
            forBooking: true,
            clubId: this.clubInfo?this.clubInfo.clubId:this.clubs.club.id,
            // playersToExclude: this.bookingSlot.bookingPlayers,
            // gameInfo        : this.gameInfo
        });

        clubModal.onDidDismiss((data) => {
          //  console.log("Data - ", data);
            // if(1) return false;
            // if (data) {
                
            //     // JsonService.deriveFulImageURL(data.item, "photoUrl")
            //     // JsonService.deriveFulImageURL(data.item, "thumbnail")
            //     this.clubBookingPlayers = data.item;
            //     this.clubBookingPlayers.image = data.item.photoUrl;
            //     this.clubBookingPlayers.profile = data.item.thumbnail;
            //     this.clubBookingPlayers.phone = data.item.phone;
            //     data.playerDetails['walking'] = this.buggyRequired ? !this.buggyRequired : true
            //     data.playerDetails['caddySelectionCriteria'] = {}
            //     data.playerDetails['caddySelectionCriteria']['caddyRequired'] = this.caddyRequired ? this.caddyRequired : false
            // }
            if(data) {
                this.clubBookingPlayers = {
                    playerName: "",
                    email: ""
                }
            } else this.clubBookingPlayers = null;
            if (data && data.newPlayer) {

                this.clubBookingPlayers.playerName = data.playerDetails.playerName;
                this.clubBookingPlayers.email = data.playerDetails.email;
                this.clubBookingPlayers.address.phone1 = data.playerDetails.phone?data.playerDetails.phone:"";
                // this.playerName = this.addPlayerForm.controls["playerName"];
                // this.email      = this.addPlayerForm.controls["email"];
                // this.gender     = this.addPlayerForm.controls["gender"];
                // this.phone      = this.addPlayerForm.controls["phone"];
                // this.checkBookingPlayer(data.PlayerDetails).then((playerOk)=>{
                // if(playerOk) 
              //  console.log('new player ', data);
                if(data.registerThisPlayer) this.createContact(data.playerDetails);

                // })

            } else if (data && !data.newPlayer) {
                // this.checkBookingPlayer(data.item).then((playerOk)=>{
                // if(playerOk) 

              //  console.log('existing player ', data)
                this.clubBookingPlayers = data.item;
                this.clubBookingPlayers.playerName = data.item.playerName;
                this.clubBookingPlayers.email = data.item.email;
                // this.clubBookingPlayers.address.phone1 = data.item.phone;
                this.clubBookingPlayers.image = data.item.photoUrl;
                this.clubBookingPlayers.profile = data.item.thumbnail;
                this.clubBookingPlayers.phone = data.item.phone;

                // })

            } else return false;
            // this.addPlayerToBooking({})
        })

        clubModal.present();


    }
    onClubDeleteBookingPlayer() {
        let player = this.clubBookingPlayers;
        // player: TeeTimeBookingPlayer
        // console.log("on deleting player : ", player)
        let alert = this.alertCtrl.create({
            title: 'Remove Player',
            // subTitle: 'Selected date is '+ _date,
            message: 'Removing selected player from booking. Do you want to proceed?', //'Selected date is ' + '<b>' + _date + '</b>',
            // buttons: ['Close']
            buttons: [
                {
                    text: 'Close',
                },
                {
                    text: 'Remove player',
                    handler: () => {
                        // this.deleteBookingPlayer(player);
                        this.clubBookingPlayers = null;
                        // console.log('Cancel clicked');
                    }
                },
            ]
        });
        alert.present();
    }
    onMyBookingsClick() {
        if(this.paymentClickedBoolean) return false;
        let _clubId = this.clubInfo.clubId;
        if(this.fromClub) this.nav.push(BookingCalendarPage , {clubId: _clubId})
        else this.nav.push(BookingHomePage);
    }
    
    onFAQClick() {
        if(this.paymentClickedBoolean) return false;
        this.nav.push(FaqPage)
    }

    clubPayNow(offlinePayments?: Array<OfflinePayment>) {
        let _payments: Array<OfflinePayment> = offlinePayments;
        let _data: BookingOfflinePayment = {
            'bookingId': this.bookingSlot.id,
            'paidFor': this.bookingSlot.bookingPlayers[0].playerName,
            payments: _payments
        }

        this.flightService.clubCapturePayment(_data)
        .subscribe((resp: any)=>{
          //  console.log("on club pay now ", resp)
            let _data = resp.json();
            if(resp.status === 200 && _data) {
                this.refreshBookingObject(_data);
                this.getBookingItemizedBill(false)
            }
        })
        return false;
    }

    createContact(playerDetails: any) {
        //Validate the entries

      //  console.log("creating contact ... ", playerDetails)
        let _firstName 
        let _lastName 
        let _gender 
        let _phone 
        let _email 
        let _handicap 
        let _teeOffFrom 
        let _countryId 

        if(playerDetails) {
            _firstName = playerDetails.playerName;
            _lastName = ' ';
            _gender = playerDetails.gender;
            _phone = playerDetails.phone;
            _email = playerDetails.email;
            _handicap = (_gender === 'M')?24:36;
            _teeOffFrom = (_gender === 'M')?"Blue":"Red";
            _countryId = this.bookingSlot.clubData.address.countryData.id;

            this.playerService.addContact(_firstName, _lastName, _gender, _email, _phone, _handicap, _teeOffFrom, _countryId)
            // this.playerService.addContact(this.firstName, this.lastName,
            //     this.gender, this.email, this.phone, this.handicap, this.teeOffFrom, this.countryId)
                .subscribe((player: PlayerInfo) => {
                    //Player registered successfully. Go back to where came from
                      //  console.log("creating contact  : ", player)

                }, (error) => {
                      //  console.log("creating contact error : ", error)
                        let _error = error.json();
                        // let msg       = MessageDisplayUtil.getErrorMessage(error, "Error creating contact");
                        // let msg       = MessageDisplayUtil.getErrorMessage(error, _error.errorMessage);
                        // MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl, 5000, "bottom");

                }, () => {
                });

        } else return false;
        // console.log(this.phoneLength);
        // if (!isPresent(this.firstName) || !isPresent(this.email) || !isPresent(this.lastName) || this.firstName == '' || this.lastName == '') {
        //     let msg = "Please enter all mandatory fields!";
        //     MessageDisplayUtil.displayErrorAlert(this.alertCtl, "New Contact",
        //         msg, "OK");
        //     return;
        // }
            

    }

    changeStartCourse() {
        if(!this.fromClub) return false;

        let changeSlot = this.modalCtl.create(TeeSlotListModal, {
            currentSlot: this.bookingSlot,
            clubId: this.bookingSlot.clubData.id ,
            forDate: this.bookingSlot.slotAssigned.teeOffDate ,
            courseId: this.bookingSlot.slotAssigned.startCourse.id,
            changeType: 'course'
        })

        changeSlot.onDidDismiss((data: any) => {
          //  console.log("Change slot", data)
            if(data) {
                this.onChangeSlot(data.currentSlot.id, data.newSlot)
            }
        });
        changeSlot.present();
    }

    onChangeSlot(bookingId: number, newSlot: TeeTimeSlotDisplay) {
      //  console.log("call onchange slot", bookingId, newSlot)
        this.flightService.changeSlot(bookingId,newSlot)
        .subscribe((data)=>{
          //  console.log("after change slot : ", data)
            if(data && data.status === 200) {
                this.refreshBookingObject(data.json())
                // this.refreshBookingDetails();
            } else if(data) {
              //  console.log("get data ", data.status, data)
            }
        },(error)=>{
          //  console.log("change slot error : ", error);
            let _errorBody = error.json();
            if(error.status !== 200) {
                let _message = _errorBody.errors.length>0?_errorBody.errors[0]:'This slot cannot be selected (e.g Flights checked-in, dispatched, started or finished)';
                MessageDisplayUtil.showMessageToast(_message, this.platform, this.toastCtl,3000, "bottom")
            }
          //  console.log("get error", error)
        })
    }

    // goProfilesList(who: string, type?: string) {
    //     if (this.bookingSlot.bookingStatus === 'PaymentFull' && !this.fromClub) {
    //         MessageDisplayUtil.showMessageToast('Full Payment have been made. Adding voucher is disabled. Please refer to club.',
    //             this.platform, this.toastCtl, 3000, "bottom")
    //         return false;
    //     };
    //     if(who === 'player') {
    //         let _playerProfiles = this.modalCtl.create(PlayerVoucherModal, {
    //             who: who,
    //             forBooking: true,
    //             player: who==='player'?this.currentPlayer:null,
    //             mode: 'apply',
    //             clubInfo: this.bookingSlot.clubData,
    //             bookingId: this.bookingSlot.id,
    //             players: this.bookingSlot.bookingPlayers,
    //             type: type,
    //     });
    //     _playerProfiles.onDidDismiss((data: any) => {
    //       //  console.log("player voucher dismiss", data)
    //         if(data) {
    //             if(data.needRefresh) this.refreshBookingDetails(true);
    //         }
    //     });
    //     _playerProfiles.present();
    //     } else if(who === 'club') {
    //         let _playerProfiles = this.modalCtl.create(VoucherListModal, {
    //             who: who,
    //             forBooking: true,
    //             player: null,
    //             mode: 'apply',
    //             clubInfo: this.bookingSlot.clubData,
    //             bookingId: this.bookingSlot.id,
    //             players: this.bookingSlot.bookingPlayers,
    //             type: type,
    //     });
    //     _playerProfiles.onDidDismiss((data: any) => {
    //       //  console.log("player voucher dismiss", data)
    //         if(data) {
    //             if(data.needRefresh) this.refreshBookingDetails(true);
    //         }
    //     });
    //     _playerProfiles.present();
    // }
    // }

    goVoucherList(who: string, type?: string) {
        if (this.bookingSlot.bookingStatus === 'PaymentFull' && !this.fromClub) {
            MessageDisplayUtil.showMessageToast('Full Payment have been made. Adding voucher is disabled. Please refer to club.',
                this.platform, this.toastCtl, 3000, "bottom")
            return false;
        };
        if(who === 'player') {
        let _club: ClubData = this.bookingSlot.clubData;
        let _player: TeeTimeBookingPlayer = this.bookingSlot.bookingPlayers.find((p)=>{
            if(p.player) return p.player.id === this.currentPlayerId
            else return;
        });

            let _playerVoucher = this.modalCtl.create(PlayerVoucherModal, {
                
            type: 'voucher',
            mode: 'apply',
            fromClub: this.fromClub,
            forBooking: true,
            player: _player.player?_player.player:null,
            clubInfo: _club,
            who: who,
            bookingId: this.bookingSlot.id,
            appliedVouchers: this.bookingDiscounts,
            currentSlot: this.bookingSlot,
            bookingPlayer: _player,
            bookingDiscounts: this.bookingSlot.bookingDiscounts,

                    // who: who,
                    // forBooking: true,
                    // player: who==='player'?this.currentPlayer:null,
                    // mode: 'apply',
                    // clubInfo: this.bookingSlot.clubData,
                    // bookingId: this.bookingSlot.id,
                    // players: this.bookingSlot.bookingPlayers,
                    // type: 'voucher',
                    // bookingDiscounts: this.bookingSlot.bookingDiscounts,
                    // fromClub: this.fromClub,
            });
            _playerVoucher.onDidDismiss((data: any) => {
              //  console.log("player voucher dismiss", data)
                if(data) {
                    if(data.needRefresh) this.refreshBookingDetails(true);
                }
            });
            _playerVoucher.present();
            // this.nav.push(VoucherListModal, {
            //     who: who,
            //     forBooking: true,
            //     player: who==='player'?this.currentPlayer:null,
            //     mode: 'apply',
            //     clubInfo: this.bookingSlot.clubData,
            //     bookingId: this.bookingSlot.id,
            //     players: this.bookingSlot.bookingPlayers,
            // });
        } else if(who === 'club') {
            let _playerVoucher = this.modalCtl.create(VoucherListModal, {
                // PlayerVoucherModal
                // who: who,
                // forBooking: true,
                // player: who==='player'?this.currentPlayer:null,
                // mode: 'apply',
                // clubInfo: this.bookingSlot.clubData,
                // bookingId: this.bookingSlot.id,
                // players: this.bookingSlot.bookingPlayers,
                who: who,
                forBooking: true,
                player: null,
                mode: 'apply',
                clubInfo: this.bookingSlot.clubData,
                bookingId: this.bookingSlot.id,
                players: this.bookingSlot.bookingPlayers,
                type: 'voucher',
                bookingDiscounts: this.bookingSlot.bookingDiscounts,
                fromClub: this.fromClub,
        });
        _playerVoucher.onDidDismiss((data: any) => {
          //  console.log("player voucher dismiss", data)
            if(data) {
                if(data.needRefresh) this.refreshBookingDetails(true);
            }
        });
        _playerVoucher.present();

            // this.nav.push(VoucherListModal, {
            //     who: who,
            //     forBooking: true,
            //     player: null,
            //     mode: 'apply',
            //     clubInfo: this.bookingSlot.clubData,
            //     bookingId: this.bookingSlot.id,
            //     players: this.bookingSlot.bookingPlayers,
            // });
        }
        
    }

    getInitials(name: string) {
        var names = name.split(' '),
            initials = names[0].substring(0, 1).toUpperCase();
        
        if (names.length > 1) {
            initials += names[names.length - 1].substring(0, 1).toUpperCase();
        }
    
        return initials;
    };

    resolved(captchaResponse: string) {
      //  console.log(`Resolved captcha with response ${captchaResponse}:`);
        this.captchaResponse = captchaResponse;
    }


    // public resolved(captchaResponse: string) {
    //     const newResponse = captchaResponse
    //       ? `${captchaResponse.substr(0, 7)}...${captchaResponse.substr(-7)}`
    //       : captchaResponse;
    //     this.captchaResponse += `${JSON.stringify(newResponse)}\n`;
    //   }

    onTooltipRecaptcha() {
        let _message = 'This ensures that computers / robots are unable to access our system and conduct block bookings.';
        let alert = this.alertCtrl.create({
        title: 'Recaptcha Verification',
        // subTitle: 'Selected date is '+ _date,
        message: _message, //'Selected date is ' + '<b>' + _date + '</b>',
        buttons: ['Close']
    });
    alert.present();

    }

    onPlayerVoucher(slot: number, who?: string, type?: string) {
        // if (this.bookingSlot.bookingStatus === 'PaymentFull' && !this.fromClub) {
        if (!this.getAllowUpdatePostPayment() && !this.fromClub) {
            MessageDisplayUtil.showMessageToast('Flight have started. Adding voucher is disabled. Please refer to club.',
                this.platform, this.toastCtl, 3000, "bottom")
            return false;
        }
        let _slot = slot - 1;
        let _club: ClubData = this.bookingSlot.clubData;
        let _player: TeeTimeBookingPlayer = this.bookingSlot.bookingPlayers[_slot];
      //  console.log("on Player voucher - player : ", _player)
      //  console.log("on Player voucher - club : ", this.clubInfo)
      //  console.log("on Player voucher - club : ", this.bookingSlot.clubData)
      //  console.log("on Player voucher - "+who+" : ", _player + " -- ", this.currentPlayerId)
        // this.nav.push(PlayerVoucherModal, {
        //     type: type,
        //     mode: 'apply',
        //     fromClub: this.fromClub,
        //     forBooking: true,
        //     player: _player.player?_player.player:null,
        //     clubInfo: _club,
        //     who: type,
        //     bookingId: this.bookingSlot.id,
        //     appliedVouchers: this.bookingDiscounts,
        //     currentSlot: this.bookingSlot,
        // });
        if(who === 'player') {
            // let idx = slot - 1;
            // let _currentPlayer = this.bookingSlot.bookingPlayers;
            let _isMe: boolean = (_player.player.id === this.currentPlayerId)? true: false;
            // (_currentPlayer[idx] && _currentPlayer[idx].player && (_currentPlayer[idx].player.id === this.currentPlayerId)) ? true : false;
            if(!_isMe) {
                let _msg = 'Players must choose their own vouchers or discounts. Please ask the player to login or contact the club.';
                // _msg = 'Only logged in player can choose their own vouchers. Please refer to club otherwise.';
                MessageDisplayUtil.showMessageToast(_msg,
                this.platform, this.toastCtl, 3000, "bottom")
                return false;
            }
        }

        let _playerVoucher = this.modalCtl.create(PlayerVoucherModal, {
            type: type?type:'voucher',
            mode: 'apply',
            fromClub: this.fromClub,
            forBooking: true,
            player: _player.player?_player.player:null,
            clubInfo: _club,
            who: who,
            bookingId: this.bookingSlot.id,
            appliedVouchers: this.bookingDiscounts,
            currentSlot: this.bookingSlot,
            bookingPlayer: this.bookingSlot.bookingPlayers[_slot],
            bookingDiscounts: this.bookingSlot.bookingDiscounts,
        });
        _playerVoucher.onDidDismiss((data: any) => {
          //  console.log("player voucher dismiss", data)
            if(data) {
                if(data.needRefresh) this.refreshBookingDetails(true);
            }
        });
        _playerVoucher.present();

        // this.nav.push(VoucherListModal, {
        //     who: who,
        //     forBooking: true,
        //     player: who==='player'?this.currentPlayer:null,
        //     mode: 'apply',
        //     clubInfo: this.bookingSlot.clubData,
        //     bookingId: this.bookingSlot.id,
        // });

    }

    hasCaddyAssigned() {
        let _hasCaddy: any = null;
        _hasCaddy = this.uniqCaddy.filter((p: TeeTimeBookingPlayer)=>{
            return p.caddyAssigned
        }).map((p: TeeTimeBookingPlayer)=>{
            return p.caddyAssigned
        });
      //  console.log("has caddyAssigned", _hasCaddy, this.uniqCaddy)
        if(_hasCaddy && _hasCaddy.length > 0) return true
        else false;
    }

    onManageVoucher() {
        this.nav.push(ManageVoucherModal, {
            fromClub: this.fromClub,
            clubInfo: this.bookingSlot.clubData,
            clubId: this.bookingSlot.clubData.id,
            currencySymbol: this.bookingSlot.clubData.address.countryData.currencySymbol,
        });
    }

    getVoucherAppliedAmount(voucher: TeeTimeBookingDiscount) {
        // console.log("get voucher applied", voucher)
        // console.log("get voucher applied : ", this.currency?this.currency.symbol:this.bookingSlot.slotAssigned.currency.symbol)
        let _currency = this.currency?this.currency.symbol:this.bookingSlot.slotAssigned.currency.symbol;
        let _amount = voucher?voucher.amountDeducted:'-'
        // let _symbol = _currency?_currency.symbol:''
        return _currency + " " + _amount;
    }

    onRemoveThisVoucher(voucher: TeeTimeClubVoucher) {
        if (this.bookingSlot.bookingStatus === 'PaymentFull' && !this.fromClub) {
            MessageDisplayUtil.showMessageToast('Full Payment have been made. Removing voucher is disabled. Please refer to club.',
                this.platform, this.toastCtl, 3000, "bottom")
            return false;
        }
        let prompt = this.alertCtrl.create({
            title: 'Remove Voucher',
            message: 'This will remove voucher from current booking flight. Do you want to proceed?',
            // inputs: [{
            //     name: 'title',
            //     placeholder: 'Group Name'
            // }, ],
            buttons: [
                {
                    text: 'No',
                    // handler: data => {
                    //     return false;
                    // }
                },{
                    text: 'Yes',
                    handler: () => {
                        this.goRemoveThisVoucher(voucher);
                        prompt.dismiss();
                        return false;
                    }
                },
            ]
        });
        prompt.present();
    }

    goRemoveThisVoucher(voucher: TeeTimeClubVoucher) {
        // console.log("voucher : ", voucher)
        this.flightService.removePlayerBookingVoucher(this.bookingSlot.id, voucher.id)
        .subscribe((data: any)=>{
            if(data) {
                // console.log("Removing this voucher : ", data);
                this.refreshBookingObject(data.json())
                MessageDisplayUtil.showMessageToast('Successfully removed voucher', this.platform, this.toastCtl,3000, "bottom")
            }
        }, (error)=>{
            // console.log("remove voucher error : ", error)
            let _error = error.json();
            let alert = this.alertCtrl.create({
                title: 'Issue removing voucher',
                // subTitle: 'Selected date is '+ _date,
                message: _error&&_error.message?_error.message:'There\'s an issue removing voucher. Please try again', //'Selected date is ' + '<b>' + _date + '</b>',
                buttons: ['Close']
            });
            alert.present();
        })
    }


    onRefundClick(mode?: string) {
        if(!this.fromClub) return;
        let _callRefund = this.nav.push(RefundBookingPlayersModal, {
            currentSlot: this.bookingSlot,
            clubId: this.bookingSlot.clubData.id ,
            forDate: this.bookingSlot.slotAssigned.teeOffDate ,
            courseId: this.bookingSlot.slotAssigned.startCourse.id,
            changeType: 'course',
            currency: this.currency?this.currency:this.bookingSlot.slotAssigned.currency,
            fromClub: this.fromClub,
            mode: mode?mode:null,
          })
    }

    onRecaptchaToolTip() {
        let _message = `This site is protected by reCAPTCHA and the Google
        <a href="https://policies.google.com/privacy">Privacy Policy</a> and
        <a href="https://policies.google.com/terms">Terms of Service</a> apply.`;
        let alert = this.alertCtrl.create({
        title: 'Google reCAPTCHA info',
        // subTitle: 'Selected date is '+ _date,
        message: _message, //'Selected date is ' + '<b>' + _date + '</b>',
        buttons: ['Close']
    });
    alert.present();
    }

    getPlayerVoucherApplied(slot: number, type?: string): any{
    // : Array<TeeTimeBookingDiscount> {
        let _slot = slot - 1;
        let _bookingDiscounts = this.bookingSlot.bookingDiscounts;
        if(!_bookingDiscounts || _bookingDiscounts.length === 0) return null
        if(!this.bookingSlot.bookingPlayers || this.bookingSlot.bookingPlayers.length === 0 ) return null
        // if(this.bookingSlot && !this.bookingSlot.bookingPlayers[_slot].player) return null;
        let _players: Array<TeeTimeBookingPlayer> = this.bookingSlot.bookingPlayers;
      //  console.log("player voucher applied : ", _slot, _players, this.bookingDiscounts)
        if(!_players[_slot]) return null;

        let _voucherNames: Array<string> = new Array();

        let _voucherApplied = _bookingDiscounts.filter((discount: TeeTimeBookingDiscount)=>{
            // return discount.voucherApplied.playerAssigned.id === _players[_slot].player.id
            if (discount && discount.voucherApplied && discount.voucherApplied.playerAssigned && _players[_slot].player)
                if(discount.voucherApplied.voucherAmountType.toLowerCase() === 'fixed') {
                    if(discount.voucherApplied.playerAssigned.id === _players[_slot].player.id && discount.voucherApplied)
                        _voucherNames.push(discount.voucherApplied.name)
                    return discount.voucherApplied.playerAssigned.id === _players[_slot].player.id && discount.voucherApplied
                }
                else {
                    if(discount.voucherApplied.playerAssigned.id === _players[_slot].player.id && discount.voucherApplied && discount.amountDeducted > 0)
                        _voucherNames.push(discount.voucherApplied.name)
                    return discount.voucherApplied.playerAssigned.id === _players[_slot].player.id && discount.voucherApplied && discount.amountDeducted > 0
                }
            // discount.bookingPlayerId 
        })

        switch(type) {
            case 'amount':
                return _voucherApplied;
            case 'name':
                console.log("get player voucher applied : ", _voucherNames, _voucherApplied)
                if(_voucherNames && _voucherNames.length > 0 )
                    return _voucherNames.join(", ");
                else return 'No voucher applied';
            default:
                return _voucherApplied
        }

        // return _voucherApplied;
    }

    getPlayerCardsApplied(slot: number): Array<TeeTimeBookingDiscount> {
        let _slot = slot - 1;
        let _bookingDiscounts = this.bookingSlot.bookingDiscounts;
      //  console.log("get player cards applied 0 : ", slot, _bookingDiscounts)
        if(!_bookingDiscounts || _bookingDiscounts.length === 0) return null
        if(!this.bookingSlot.bookingPlayers || this.bookingSlot.bookingPlayers.length === 0 ) return null
        // if(this.bookingSlot && !this.bookingSlot.bookingPlayers[_slot].player) return null;
        let _players: Array<TeeTimeBookingPlayer> = this.bookingSlot.bookingPlayers;
        // console.log("get player cards applied 1 : ", _slot, _players, _bookingDiscounts, this.bookingDiscounts)
        if(!_players[_slot]) return null;

        let _voucherApplied = _bookingDiscounts.filter((discount: TeeTimeBookingDiscount)=>{
            // return discount.voucherApplied.playerAssigned.id === _players[_slot].player.id
            let _isPlayer;
            let _playerApplied: boolean = false;
            if(discount.discountAudit) {
                 _isPlayer = discount.discountAudit.discountsByPlayer.filter((dp)=>{
                    return dp.bookingPlayerId === _players[_slot].id && dp.discounts && dp.discounts.length > 0
                });
            } else if(!discount.discountAudit && discount.bookingPlayerId === _players[_slot].id) {
                _playerApplied = true
            }
            // console.log("get player cards applied 2 : ", _players[_slot].id, discount,_isPlayer)
            return discount.discountApplied && ((_isPlayer && _isPlayer.length > 0) || _playerApplied)
            // discount.bookingPlayerId === _players[_slot].id && 
        })
        // console.log("get player cards applied 3 : ", _players[_slot].player.playerId, _voucherApplied)
        return _voucherApplied;
    }

    getPlayerDiscountName(slot) {
        let _slot = slot - 1;
        let _bookingDiscounts = this.bookingSlot.bookingDiscounts;
      //  console.log("get player cards applied 0 : ", slot, _bookingDiscounts)
        if(!_bookingDiscounts || _bookingDiscounts.length === 0) return null
        if(!this.bookingSlot.bookingPlayers || this.bookingSlot.bookingPlayers.length === 0 ) return null
        // if(this.bookingSlot && !this.bookingSlot.bookingPlayers[_slot].player) return null;
        let _players: Array<TeeTimeBookingPlayer> = this.bookingSlot.bookingPlayers;
        // console.log("get player cards applied 1 : ", _slot, _players, this.bookingDiscounts)
        if(!_players[_slot]) return null;

        let _voucherApplied = _bookingDiscounts.filter((discount: TeeTimeBookingDiscount)=>{
            // return discount.voucherApplied.playerAssigned.id === _players[_slot].player.id
            let _isPlayer;
            let _playerApplied;
            if(discount.discountAudit) {
                 _isPlayer = discount.discountAudit.discountsByPlayer.filter((dp)=>{
                    return dp.bookingPlayerId === _players[_slot].id && dp.discounts && dp.discounts.length > 0
                });
            } else if(!discount.discountAudit && discount.bookingPlayerId === _players[_slot].id) {
                _playerApplied = true
            }
            // console.log("get player cards applied 2 : ", _players[_slot].id, discount,_isPlayer)
            return discount.discountApplied && ((_isPlayer && _isPlayer.length > 0) || _playerApplied)
            // return discount.discountApplied && _isPlayer && _isPlayer.length > 0 
            // discount.bookingPlayerId === _players[_slot].id && 
        })
        let _discountCardText = '';
      //  console.log("get player cards applied - discount name : ", _voucherApplied)
        if(!_voucherApplied || _voucherApplied && _voucherApplied.length === 0) return '';
        _discountCardText += _voucherApplied
                    .map((a) => {
                        return a.discountApplied.name
                    }).reduce((a, b) => {
                        return a + ', ' + b;
                    });
      //  console.log("get player cards applied 3 : ", _voucherApplied)
        return _discountCardText;
    }

    checkPlayerVoucherApplied() {
        if(!this.bookingDiscounts || this.bookingDiscounts.length === 0) return false
        else return true
        
    }

    getNormalPlan(slot: TeeTimeSlot, attribute?: string) {
        // let _slots: Array<TeeTimeSlotDisplay>;
      //  console.log("get normal plan : ", slot)
        let _normalPlan: TeeTimePricingPlan;
        _normalPlan = (slot && slot.pricingPlan)?slot.pricingPlan:null;
        // club.slots.filter((s: TeeTimeSlotDisplay)=>{
        //     return s.slot.pricingPlanPromotional
        // }).map((s: TeeTimeSlotDisplay)=>{
        //     return s.slot.pricingPlanPromotional
        // }).reduce((a,b)=>{
        //     return a
        // });
        if(_normalPlan) {
            switch(attribute) {
                case 'name':
                    return _normalPlan.name
                case 'description':
                    return this.escapeCRLF(_normalPlan.description);
                case 'discounts':
                    return _normalPlan.discountsApplicable
                case 'addCharges':
                    return _normalPlan.additionalCharges;
                case 'promo':
                    return _normalPlan.promotional;
                case 'prices':
                    return _normalPlan.prices;
                case 'currency':
                    return _normalPlan.currency.symbol;
            }
        } else return '';
        
    }

    getPromoPlan(slot: TeeTimeSlot, attribute?: string) {
        // let _slots: Array<TeeTimeSlotDisplay>;
      //  console.log("get promo plan : ", slot)
        let _promoPlan: TeeTimePricingPlan;
        _promoPlan = (slot && slot.pricingPlanPromotional)?slot.pricingPlanPromotional:null;
        // club.slots.filter((s: TeeTimeSlotDisplay)=>{
        //     return s.slot.pricingPlanPromotional
        // }).map((s: TeeTimeSlotDisplay)=>{
        //     return s.slot.pricingPlanPromotional
        // }).reduce((a,b)=>{
        //     return a
        // });
        if(_promoPlan) {
            switch(attribute) {
                case 'name':
                    return _promoPlan.name
                case 'description':
                    return this.escapeCRLF(_promoPlan.description);
                case 'discounts':
                    return _promoPlan.discountsApplicable
                case 'addCharges':
                    return _promoPlan.additionalCharges;
                case 'promo':
                    return _promoPlan.promotional;
                case 'prices':
                    return _promoPlan.prices;
                case 'currency':
                    return _promoPlan.currency.symbol;
            }
        } else return '';
        
    }
    
    getDepositAmount() {
        let _deposit = 0;
        if(this.bookingOptions) {
            if(this.bookingOptions.depositAmountType.toLowerCase() === 'percentage') {
                _deposit = this.bookingSlot.amountPayable * (this.bookingOptions.depositAmount/100);
            }
            else if(this.bookingOptions.depositAmountType.toLowerCase() === 'absolute') {
                _deposit = this.bookingSlot.amountPayable - this.bookingOptions.depositAmount;
            }
            else if(this.bookingOptions.depositAmountType.toLowerCase() === 'fixed') {
                _deposit = this.bookingOptions.depositAmount;
            }
        }
        return Number(_deposit.toFixed(2));
    }

    getVoucherApplicableText(voucher: any, type: string) {
        if (!voucher) return false;
        let _allowText;
        let _applicableStart = 'Applicable on';
        let _allowWeekdays;
        let _allowWeekends;
        let _allowHolidays;
        let _applicableEnd = '';
        let _voucherDetails = voucher;
        if (type === 'allowDays') {
            // _allowWeekdays = (voucher && (voucher.allowOnWeekends || voucher.allowOnPublicHolidays) ? 'Weekdays' + ', ' : voucher && voucher.allowOnWeekdays ? 'Weekdays' : '');
            // _allowWeekends = (voucher && voucher.allowOnPublicHolidays ? 'Weekends' + ', ' : voucher && voucher.allowOnWeekends ? 'Weekends' : '');
            // _allowHolidays = (voucher && (voucher.allowOnWeekdays || voucher.allowOnWeekends && voucher.allowOnPublicHolidays) ? ' and ' + 'Public Holidays' : voucher && voucher.allowOnPublicHolidays ? 'Public Holidays' : '');
            _allowWeekdays = (voucher && voucher.allowOnWeekdays && (voucher.allowOnWeekends && voucher.allowOnPublicHolidays) ? 'Weekdays' + ', ' : voucher && voucher.allowOnWeekdays ? 'Weekdays' : '');
            _allowWeekends = (voucher && voucher.allowOnWeekends && (voucher.allowOnWeekdays) && voucher.allowOnPublicHolidays)? 'Weekends' : (voucher && voucher.allowOnWeekdays && voucher.allowOnWeekends && !voucher.allowOnPublicHolidays) ? ' and ' + 'Weekends' : (voucher && !voucher.allowOnWeekdays && voucher.allowOnWeekends)?'Weekends':'';
            _allowHolidays = (voucher && ((voucher.allowOnWeekdays || voucher.allowOnWeekends) && voucher.allowOnPublicHolidays) ? ' and ' + 'Public Holidays' : voucher && voucher.allowOnPublicHolidays ? 'Public Holidays' : '');


            _allowText =
                _applicableStart + ' ' +
                _allowWeekdays +
                _allowWeekends +
                _allowHolidays;

            // console.log("applicable text ", _allowText);
            // console.log("applicable text ", _applicableStart);
            // console.log("applicable text ", _allowWeekdays, _allowWeekdays, _allowHolidays);
            // console.log("applicable text ", (voucher && (voucher.allowOnWeekends || voucher.allowOnPublicHolidays) ? _allowWeekdays + ', ' : ''));
            // console.log("applicable text ", (voucher && voucher.allowOnPublicHolidays ? _allowWeekends + ', ' : ''));
            // console.log("applicable text ", (voucher && (voucher.allowOnWeekdays || voucher.allowOnWeekends) ? ' and ' + _allowHolidays : ''));

        } else if (type === 'bookingAmount') {
            _allowText = 'Covers Booking Amount';
        } else if (type === 'flight') {
            if(voucher.appliesToFlight)
            _allowText = 'Applicable for this flight';
            else if(!voucher.appliesToFlight)
            _allowText = 'Applicable for 1 person'
        } else if(type === 'appliesFor') {
            _allowText = 'Covers ';
            let _buggyFee = _voucherDetails.priceComps.filter((price)=>{
                if(price.priceComponent.id.toLowerCase() === 'buggyfee')
                    return true
                if(price.priceComponent.id.toLowerCase() === 'hbuggyfee')
                    return true
                else return false
            });

            let _caddyFee = _voucherDetails.priceComps.filter((price)=>{
                if(price.priceComponent.id.toLowerCase() === 'caddyfee')
                    return true;
                if(price.priceComponent.id.toLowerCase() === 'hcaddyfee')
                    return true;
                else return false;
            }); 
          //  console.log("pre filter - buggy fee ", _buggyFee)
          //  console.log("pre filter - caddy fee ", _caddyFee)
             
            _voucherDetails.priceComps = _voucherDetails.priceComps.filter((price)=>{
                if(_buggyFee.length === 2) return price.priceComponent.id.toLowerCase() !== 'hbuggyfee'
                if(_caddyFee.length === 2) return price.priceComponent.id.toLowerCase() !== 'hcaddyfee'
                else return true
            });
            if(!_voucherDetails.priceComps || _voucherDetails.priceComps.length === 0)
                _allowText += 'Booking Amount';
            else if(_voucherDetails && _voucherDetails.priceComponents && _voucherDetails.priceComponents.length > 0) {
                _allowText += _voucherDetails.priceComponents
                    .map((a) => {
                        return a.priceComponent.name
                    }).reduce((a, b) => {
                        return a + ', ' + b;
                    })
            }
        }

        return _allowText;

    }

    goRedeemPlayerCredits() {
        let redeemCredits = this.modalCtl.create(RedeemPlayerClubCreditsModal, {
            currentSlot: this.bookingSlot,
            clubId: this.bookingSlot.clubData.id ,
            forDate: this.bookingSlot.slotAssigned.teeOffDate ,
            courseId: this.bookingSlot.slotAssigned.startCourse.id,
            changeType: 'course',
            currency: this.currency?this.currency:this.bookingSlot.slotAssigned.currency,
            fromClub: this.fromClub,
            itemizedBill: this.bookingItemBill,
            currentPlayerId: this.currentPlayerId?this.currentPlayerId:null,
        });
        redeemCredits.onDidDismiss((data: any) => {
            // if (apply) {
                if(data && data.needRefresh) {
                    // this.refreshBookingDetails(false);
                    
                    //!!! add trigger pricing?
                    this.flightService.processBookingAssignments(this.bookingSlot.id)
                    .subscribe((processData) => {
                        
                    },(error)=>{

                    },()=>{
                        this.recalculateBookingPricing();
                    });

                }
            // console.log("Came back from new contact", apply)
            // }
        });
        redeemCredits.present(); 

        
        // let _callRefund = this.nav.push(RefundBookingPlayersModal, {
        //     currentSlot: this.bookingSlot,
        //     clubId: this.bookingSlot.clubData.id ,
        //     forDate: this.bookingSlot.slotAssigned.teeOffDate ,
        //     courseId: this.bookingSlot.slotAssigned.startCourse.id,
        //     changeType: 'course',
        //     currency: this.currency?this.currency:this.bookingSlot.slotAssigned.currency,
        //   })
    }

    getPlayerClubCredits() {
        if(1) return false;
        let _playerBalances = 0;
        let _totalPlayers = this.bookingSlot&&this.bookingSlot.bookingPlayers.length > 0?this.bookingSlot.bookingPlayers.length:0;
        if(this.fromClub) {
            if(_totalPlayers>0) {
                this.bookingSlot.bookingPlayers.forEach((p,i)=>{
                    let _balance = this.getPlayersCredits(i);
                    if(_balance >= 0)
                        _playerBalances += _balance;
                    if(i === (_totalPlayers - 1))
                        return _playerBalances;
                });
            } else return _playerBalances;

        } else if (!this.fromClub) {
            _playerBalances = this.getPlayersCredits(999, this.currentPlayerId);
            if( _playerBalances > 0)
                return true;
            else return false;
            // <div *ngIf="(!fromClub && currentPlayerId && currentPlayerId === x.player.id) || fromClub">

        } else return false;
    }

    
    getPlayersCredits(slot: number, playerId?: number) {
        let _clubId = this.bookingSlot.clubData.id;
        let _slot = slot;
        let _player;
        if(slot !== 999) _player = this.bookingSlot.bookingPlayers[_slot].player;
        let _balance;
        let _playerId;
        if(playerId) _playerId = playerId;
        // else _playerId = _player.playerId;
        // this.bookingSlot.bookingPlayers.forEach((p,i)=>{
            this.flightService.getPlayerClubCredits(_playerId,_clubId)
            .subscribe((data)=>{
                if(data) {
                  //  console.log("get player club credits - ",_playerId+" : "+ data.balance)
                    _balance = data.balance;
                    if(this.fromClub) this.playersBalance += data.balance;
                    else if(!this.fromClub) this.playersBalance = data.balance;
                    // this.creditBalancePlayers[i] = data.balance;
                }
            });
        return _balance;
        // })
    }
    getDealsAmount(amount: string, amountType: string, currency?: any, item?: any, type?: string) {
        if(!amount && type !== 'privilege') return '';
        let _currency; // = currency?currency.symbol:this.currency?this.currency.symbol:this.bookingSlot.clubData.address.countryData.currencySymbol;
        if(this.teeSlotNew) {
            _currency = this.teeTimeSlotDisplay.currency.symbol
        }
        else _currency = this.bookingSlot.clubData.address.countryData.currencySymbol;
        let _amount = amount;
        let _amountType = amountType;

        let _flightApply;
        let _bookingApply;

        let _amPMtype;
        if(type === 'privilege' && item.applicableRate) {
            if(this.teeSlotNew) {
                _amPMtype = moment(this.teeTimeSlotDisplay.slot.teeOffTime,'HH:mm:ss').format("a");
            } else if(!this.teeSlotNew) {
                _amPMtype = moment(this.bookingSlot.slotAssigned.teeOffTime,'HH:mm:ss').format("a");
            }
            if(_amPMtype === 'am') {
                _amount = item.applicableRate.amRate
                _amountType = item.applicableRate.amRateType
            }
            else if(_amPMtype === 'pm') { 
                _amount = item.applicableRate.pmRate
                _amountType = item.applicableRate.pmRateType
            }
        }
        
      //  console.log("deals amount - amPM : ", _amPMtype," - ", type, " : ", item, " - amount : " ,amount);
      //  console.log("deals amount - applicableRate : ", item.applicableRate);

        if(type === 'privilege') {
            _bookingApply = item.appliesToBooking
        } else {
            _flightApply = item.appliesToFlight;
            _bookingApply = item.appliesToBookingAmount;
        }
        let _amountText;
        let _flightTxt;
        let _maxFlightSize = item && item.maxFlightSize?item.maxFlightSize:4;
        if(type === 'voucher') {
            if(_flightApply) _flightTxt = 'for flight of '+_maxFlightSize;
            else _flightTxt = 'for 1 person';
        } else if(type ==='privilege') {
            if(_bookingApply) _flightTxt = 'for booking amount';
            else _flightTxt = 'for covered items';
        }

        if (_amountType === 'Absolute') {
            _amountText = 'Save ' + _currency + "&nbsp;" + _amount
        } else if (_amountType === 'Fixed') {
            _amountText = 'Pay up to ' + _currency + "&nbsp;" + _amount
        } else if (_amountType === 'Percentage') {
            _amountText = _amount + '% off';
        } 
        // else return '';
        if(type === 'voucher') return _amountText + " " + _flightTxt;
        else if(type === 'privilege') return _amountText + " " + _flightTxt;
        else return _amountText;


        // // // console.log("get deals amount - fromClub", this.fromClub)
        // // // console.log("get deals amount - teeSlotNew", this.teeSlotNew)
        // // // console.log("get deals amount", amount, amountType, currency)
        // // // console.log("get deals amount - currency", this.currency, this.bookingSlot.clubData)
        // // if(!amount) return '';
        // let _currency; // = currency?currency.symbol:this.currency?this.currency.symbol:this.bookingSlot.clubData.address.countryData.currencySymbol;
        // if(this.teeSlotNew) {
        //     _currency = this.teeTimeSlotDisplay.currency.symbol
        // }
        // else _currency = this.bookingSlot.clubData.address.countryData.currencySymbol;
        // // let _amount = amount;
        // // let _amountType = amountType;

        // // if (_amountType === 'Absolute') {
        // //     return 'Save ' + _currency + " " + _amount
        // // } else if (_amountType === 'Fixed') {
        // //     return 'Up to ' + _currency + " " + _amount
        // // } else if (_amountType === 'Percentage') {
        // //     return _amount + '% off';
        // // } else return '';
    }

    getPlayerVoucherSeries() {
        // console.log("get palyer voucher sereised ", this.clubs, this.teeTimeSlotDisplay);
        // if(this.teeSlotNew) return false;
      //  console.log("active club discounts - ", this.clubInfo, this.clubs, this.teeTimeSlotDisplay)
        this.voucherSeries = [];
        
        if(!this.teeSlotNew) {
            if(!this.bookingSlot) return false;
            if(this.bookingSlot.slotAssigned && this.bookingSlot.slotAssigned.pricingPlanPromotional 
                && !this.bookingSlot.slotAssigned.pricingPlanPromotional.discountsApplicable) return false;
        } else {
            if(!this.teeTimeSlotDisplay) return false;
            if(this.teeTimeSlotDisplay && this.teeTimeSlotDisplay.slot 
                && this.teeTimeSlotDisplay.slot.pricingPlanPromotional
                && !this.teeTimeSlotDisplay.slot.pricingPlanPromotional.discountsApplicable) return false;
        }
        let _clubId;
        if(!this.teeSlotNew) _clubId = this.bookingSlot&&this.bookingSlot.clubData.id?this.bookingSlot.clubData.id:this.clubs.club.id;
        else {
            if(this.fromClub) _clubId = this.clubInfo.clubId
            else if(!this.fromClub) _clubId = this.clubInfo?this.clubInfo.clubId:this.clubs.club.id
        }
        let voucherSeries:  Array<TeeTimeClubVoucherSeries> = [];
        this.flightService.getClubVoucherSeries(1, _clubId)
        .subscribe((data: any)=>{
          //  console.log("player voucher series ", data);
            if(data.totalInPage > 0 && data.items && data.items.length > 0) {
                voucherSeries = data.items;
                if(voucherSeries) {
                    this.voucherSeries.push(...voucherSeries);
                    } 
                }
              //  console.log("voucher series ", this.voucherSeries, voucherSeries)
             });
    }

    playerActiveClubDiscount: Array<any>;
    getActiveClubDiscounts() {
        this.playerActiveClubDiscount = [];
        if(!this.teeSlotNew) {
            if(!this.bookingSlot) return false;
            if(this.bookingSlot.slotAssigned && this.bookingSlot.slotAssigned.pricingPlanPromotional 
                && !this.bookingSlot.slotAssigned.pricingPlanPromotional.discountsApplicable) return false;
        } else {
            if(!this.teeTimeSlotDisplay) return false;
            if(this.teeTimeSlotDisplay && this.teeTimeSlotDisplay.slot 
                && this.teeTimeSlotDisplay.slot.pricingPlanPromotional
                && !this.teeTimeSlotDisplay.slot.pricingPlanPromotional.discountsApplicable) return false;
        }
        // console.log("player", this.pl)
      //  console.log("active club discounts - ", this.clubInfo, this.clubs, this.teeTimeSlotDisplay)
      //  console.log("active club discounts - ", this.bookingSlot)
        let _clubId;
        if(!this.fromClub)
            if(this.teeSlotNew) _clubId = this.clubs && this.clubs.club? this.clubs.club.id:this.clubInfo.clubId;
            else if(!this.teeSlotNew) _clubId = this.clubInfo?this.clubInfo.clubId:this.bookingSlot.clubData.id
        else if(this.fromClub) _clubId = this.clubInfo&&this.clubInfo.clubId?this.clubInfo.clubId:this.bookingSlot.clubData.id;
        if (!_clubId) return false;
        let _playerId;
        if(!this.fromClub) _playerId = this.currentPlayerId;
        else if(this.fromClub && !this.teeSlotNew) 
            _playerId = this.bookingSlot&&this.bookingSlot.bookingPlayers.length>0?this.bookingSlot.bookingPlayers[0].player.id:null;
        let _currentDate;
        if(!this.teeSlotNew)
        _currentDate = moment(this.bookingSlot.slotAssigned.teeOffDate).format("YYYY-MM-DD");
        else if(this.teeSlotNew)
        _currentDate = moment(this.teeTimeSlotDisplay.slot.teeOffDate).format("YYYY-MM-DD");

        // let _playerType = this.bookingPlayer.playerType;
        if(!this.fromClub) {
            this.flightService.getApplicableDiscountsForPlayer(_clubId, _playerId, _currentDate)
            .subscribe((applicableDiscounts)=>{
              //  console.log("applicable player discounts 1 : ", applicableDiscounts)
                if(applicableDiscounts) {
                    let _appDiscounts = applicableDiscounts.filter((ad: TeeTimeDiscount)=>{
                        return !ad.availableForClubOnly
                    })
                    this.playerActiveClubDiscount.push(..._appDiscounts);
                    this.playerActiveClubDiscount = this.playerActiveClubDiscount.filter((pcd)=>{
                        return pcd.active
                    }).sort((a,b)=>{
                        if(a.discountProgram) {
                            if(a.name < b.name) return -1
                            else if(a.name > b.name) return 1
                            else return -1
                        }
                        else if(b.discountProgram) {
                            if(a.name < b.name) return -1
                            else if(a.name > b.name) return 1
                            else return -1
                        }
                        else return 0
                    })
                }
            })
        }
        if(this.fromClub) {
            this.flightService.getActiveListClubDiscounts(_clubId, _currentDate)
                .subscribe((activeClubDiscounts: Array < TeeTimeDiscount > ) => {
                  //  console.log("applicable player discounts 2 : ", activeClubDiscounts);
                    if (activeClubDiscounts) {
                        
                        this.playerActiveClubDiscount.push(...activeClubDiscounts);
                        this.playerActiveClubDiscount = this.playerActiveClubDiscount.filter((pcd)=>{
                            return pcd.active
                        }).sort((a,b)=>{
                            if(a.discountProgram) {
                                if(a.name < b.name) return -1
                                else if(a.name > b.name) return 1
                                else return -1
                            }
                            else if(b.discountProgram) {
                                if(a.name < b.name) return -1
                                else if(a.name > b.name) return 1
                                else return -1
                            }
                            else return 0
                        })
                    }
                })

        }
    }

    onRecaptchaClick() {
        
        // this.openWithInAppBrowser(data.url,null,'getBill',data)
        // this.
        let _url = 'http://dev-play.mygolf2u.com/plain-recaptcha.html';
        
        let win = window.open(_url, '_system');
        win.location.href = _url;
        let winTick = setInterval(()=> {
            if (win.closed) {
                clearInterval(winTick);
                // this.getBill(data.id, 'billplz');
              //  console.log('window closed!');
            }
        }, 500);
    }

    initServerStatus() {
        this.serverInfoService.serverInfo()
        .subscribe((data: ServerInfo)=>{
          //  console.log("init server status", data)
            if(data) {
                this.botsOut = data.botsOut;
                // this.botsOut = true;
            }
        })
    }

    getDiscountText(discount: TeeTimeDiscount, type ? : string) {
      //  console.log("get discount text ", discount, type);
        // console.log("get discount text ", this.getDiscountDetails(discount));

        if (!discount) return false;
        let _currency;
        let _discountDetails = discount; //this.getDiscountDetails(discount);
        if (!_discountDetails) return false;
        _currency = discount.club.address.countryData.currencySymbol;
        let _applies;
        if(type === 'amount') {
            if (discount.amountType.toLowerCase() === 'percentage')
                return discount.discount + '% off';
            else if (discount.amountType.toLowerCase() === 'absolute')
                return 'Less ' + _currency + ' ' + discount.discount
            else if (discount.amountType.toLowerCase() === 'fixed')
                return _currency + ' ' + discount.discount

        } else if(type === 'appliesFor') {
            let _appliesFor = 'Covers ';
            let _priceComponents;
            
            if(!_discountDetails.priceComponents || _discountDetails.priceComponents.length === 0) return '';
            // _applies = 'Covers '
            let _buggyFee = _discountDetails.priceComponents.filter((price)=>{
                if(price.priceComponent.id.toLowerCase() === 'buggyfee')
                    return true
                if(price.priceComponent.id.toLowerCase() === 'hbuggyfee')
                    return true
                else return false
            });

            let _caddyFee = _discountDetails.priceComponents.filter((price)=>{
                if(price.priceComponent.id.toLowerCase() === 'caddyfee')
                    return true;
                if(price.priceComponent.id.toLowerCase() === 'hcaddyfee')
                    return true;
                else return false;
            }); 
          //  console.log("pre filter - buggy fee ", _buggyFee)
          //  console.log("pre filter - caddy fee ", _caddyFee)
             
            _priceComponents = _discountDetails.priceComponents.filter((price)=>{
                if(_buggyFee.length === 2) return price.priceComponent.id.toLowerCase() !== 'hbuggyfee'
                else return true
            }).filter((price)=>{
                if(_caddyFee.length === 2) return price.priceComponent.id.toLowerCase() !== 'hcaddyfee'
                else return true
            });
            if(_priceComponents && _priceComponents.length > 0) {
                _appliesFor += _priceComponents
                .sort((a,b)=>{
                    if(a.priceComponent.name < b.priceComponent.name) return -1
                    else if(a.priceComponent.name < b.priceComponent.name) return 1
                    else return 0
                })
                .map((a) => {
                    return a.priceComponent.name
                }).reduce((a, b) => {
                    return a + ', ' + b;
                })
            }
            return _appliesFor
        } else if(type === 'appliesTo') {
            let _appliesTo = 'Applies to ';
            _appliesTo = 'Applies to '
            if(!_discountDetails.playerTypes || _discountDetails.playerTypes.length === 0) return '';
            _appliesTo += _discountDetails.playerTypes
                .map((a) => {
                    return a.bookingPlayerType.name
                }).reduce((a, b) => {
                    return a + ', ' + b;
                })
            return _appliesTo;
        }
        if(1) return;
        switch (type) {
            case 'amount':
                if (discount.amountType.toLowerCase() === 'percentage')
                    return discount.discount + '% off';
                else if (discount.amountType.toLowerCase() === 'absolute')
                    return 'Less ' + _currency + ' ' + discount.discount
                else if (discount.amountType.toLowerCase() === 'fixed')
                    return _currency + ' ' + discount.discount
            case 'appliesFor':
                // let _appliesFor = 'Covers ';
                _applies = 'Covers '
                let _buggyFee = _discountDetails.priceComponents.filter((price)=>{
                    if(price.priceComponent.id.toLowerCase() === 'buggyfee')
                        return true
                    if(price.priceComponent.id.toLowerCase() === 'hbuggyfee')
                        return true
                    else return false
                });

                let _caddyFee = _discountDetails.priceComponents.filter((price)=>{
                    if(price.priceComponent.id.toLowerCase() === 'caddyfee')
                        return true;
                    if(price.priceComponent.id.toLowerCase() === 'hcaddyfee')
                        return true;
                    else return false;
                }); 
              //  console.log("pre filter - buggy fee ", _buggyFee)
              //  console.log("pre filter - caddy fee ", _caddyFee)
                 
                _discountDetails.priceComponents = _discountDetails.priceComponents.filter((price)=>{
                    if(_buggyFee.length === 2) return price.priceComponent.id.toLowerCase() !== 'hbuggyfee'
                    if(_caddyFee.length === 2) return price.priceComponent.id.toLowerCase() !== 'hcaddyfee'
                    else return true
                    // if(price.priceComponent.id.toLowerCase() === 'hbuggyfee' && price.priceComponent.id.toLowerCase() === 'buggyfee')
                    //     return price.priceComponent.id.toLowerCase() === 'buggyfee' && price.priceComponent.id.toLowerCase() !== 'hbuggyfee'
                    // else if(price.priceComponent.id.toLowerCase() === 'HCADDYFEE' && price.priceComponent.id.toLowerCase() === 'caddyfee')
                    //     return price.priceComponent.id.toLowerCase() !== 'caddyfee' && price.priceComponent.id.toLowerCase() !== 'hcaddyfee'
                    // else return true
                });

                if(!_discountDetails.priceComponents || _discountDetails.priceComponents.length === 0) return '';
                // setTimeout(()=>{
                //     _applies += _discountDetails.priceComponents
                //     .map((a) => {
                //         return a.priceComponent.name
                //     }).reduce((a, b) => {
                //         return a + ', ' + b;
                //     })
                // console.log("applies to ", _applies)
                // // return _applies;
                // },500)
                
                if(_discountDetails && _discountDetails.priceComponents && _discountDetails.priceComponents.length > 0 )
                    _applies += _discountDetails.priceComponents
                    .map((a) => {
                        return a.priceComponent.name
                    }).reduce((a, b) => {
                        return a + ', ' + b;
                    })
                break;
            case 'appliesTo':
                // let _appliesTo = 'Applies to ';
                _applies = 'Applies to '
                if(!_discountDetails.playerTypes || _discountDetails.playerTypes.length === 0) return '';
                _applies += _discountDetails.playerTypes
                    .map((a) => {
                        return a.bookingPlayerType.name
                    }).reduce((a, b) => {
                        return a + ', ' + b;
                    })
              //  console.log("applies to ", _applies)
                // return _applies;
                break;
        }
        return _applies;
    }

    getDateText(date: string) {
        if (date.length === 0) return false;
        let _date = date;
        return moment(_date, 'YYYY-MM-DD').format("DD MMM YYYY");
    }
    getClubPackages(type?: string) { 
        // console.log("club packages - ", type, this.bookingSlot)
        // console.log("club packages - ", type, this.teeTimeSlotDisplay)
        let _packages = [];
        let _promo = [];
        let _key;
        let _min;
        let value;
        switch(type) {
            case 'new':
                if(!this.teeSlotNew) return;
                if(!this.teeTimeSlotDisplay.displayPrices) return;
                if(this.teeTimeSlotDisplay.originalPrices && this.teeTimeSlotDisplay.displayPrices) {
                    for(let key in this.teeTimeSlotDisplay.originalPrices) {
                        _promo.push({
                            id : key,
                            name :  PlayerTypes[key],
                            amount   :  this.teeTimeSlotDisplay.originalPrices[key]
                        });
                        
                        _packages.push({
                            id : key,
                            name :  PlayerTypes[key],
                            amount   :  this.teeTimeSlotDisplay.originalPrices[key]
                        })
                    }
                    for(let key in this.teeTimeSlotDisplay.displayPrices) {
                        _packages.filter((p)=>{
                            return p.id === key
                        }).map((p)=>{
                            p.promo = this.teeTimeSlotDisplay.displayPrices[key]
                        })
                        // _packages[key] = {
                        //     original: this.teeTimeSlotDisplay.displayPrices[key]
                        // };
                    }
                    // console.log("new - package promo", _packages, _promo)
                    _packages = _packages.sort((a,b)=>{
                        
                        if(a.amount < b.amount) return -1;
                        else if(a.amount > b.amount) return 1;
                        else return 0;
                    })
                    return _packages; 
                } else if(this.teeTimeSlotDisplay.displayPrices && !this.teeTimeSlotDisplay.originalPrices) {
                    for(let key in this.teeTimeSlotDisplay.displayPrices) {
                        _packages.push({
                            id : key,
                            name :  PlayerTypes[key],
                            amount   :  this.teeTimeSlotDisplay.displayPrices[key]
                        })
                    }
                    // console.log("new - package ", _packages)
                    _packages = _packages.sort((a,b)=>{
                        
                        if(a.amount < b.amount) return -1;
                        else if(a.amount > b.amount) return 1;
                        else return 0;
                    })
                    return _packages;
                }
                // break;
            default:
                if(this.teeSlotNew) return;
                for(let key in this.bookingSlot.priceMap) {
                    // if(key.toLowerCase() === 'member') return;
                    _packages.push({
                        id : key,
                        name :  PlayerTypes[key],
                        amount   :  this.bookingSlot.priceMap[key]
                    })
                }
                _packages = _packages.sort((a,b)=>{
                    
                    if(a.amount < b.amount) return -1;
                    else if(a.amount > b.amount) return 1;
                    // if(a.name < b.name) {
                    //     if(a.amount < b.amount) return -1;
                    //     else if(a.amount > b.amount) return 1;
                    //     else return -1
                    // } else if(a.name > b.name) {
                    //     if(a.amount < b.amount) return -1;
                    //     else if(a.amount > b.amount) return 1;
                    //     else return 1
                    // }
                    else return 0;
                })
                // console.log("get club package before : ", _packages)
                _packages = this.getUnique(_packages,'name');
                return _packages;

        }
    }

    activeClubDiscounts: Array<any>;
    getApplicableDiscountsForPlayer() {
        if(this.bookingSlot && this.bookingSlot.bookingPlayers.length === 0) return false;
        // this.playerProfiles = [];
        // this.playerActiveClubDiscount = [];
        let _clubId = this.bookingSlot.clubData.id;
        if (!_clubId) return false;
        let _playerId = this.currentPlayerId?this.currentPlayerId:this.bookingSlot.bookingPlayers[0].player.id;
        let _effectiveDate = moment(this.bookingSlot.slotAssigned.teeOffDate).format("YYYY-MM-DD");
        // console.log("get applicable discounts for plyter", clubs);
        // if(clubs && clubs.slots && clubs.slots.length > 0)
        //     _effectiveDate = moment(clubs.slots[0].slot.teeOffDate).format("YYYY-MM-DD");
        this.flightService.getApplicableDiscountsForPlayer(_clubId,_playerId,_effectiveDate)
            .subscribe((activeClubDiscounts: Array < TeeTimeDiscount > ) => {
              //  console.log("applicable discounts - player : ", activeClubDiscounts);
                // console.log("applicable discounts - applied : ",this.appliedBookingDiscounts);
                // console.log("applicable discounts - player type  : ",this.bookingPlayer.playerType);
                this.playerActiveClubDiscount = activeClubDiscounts;
            }, (error)=>{

            }, () =>{
            })
    }

    getCurrentPlayerVoucher() {
        let _playerId;
        let _clubId;
        if(this.teeSlotNew) _clubId = this.clubs?this.clubs.club.id:this.clubInfo.clubId
        else if(!this.teeSlotNew) _clubId = this.bookingSlot.clubData.id
        if(!this.fromClub) {
            _playerId = this.currentPlayerId;
        }
        this.flightService.getListPlayerVouchers(_playerId)
            .subscribe((playerVoucher: Array < TeeTimeClubVoucher > ) => {
                this.playerVoucher = playerVoucher.filter((pv)=>{
                    return pv.club.id === _clubId && !pv.redeemed;
                });
            });
    }

    getAllowUpdatePostPayment(type?: string) {
        let _allow: boolean = false;
        let _flightStatusAllowed;
        if(this.bookingSlot && this.bookingSlot.flight && !type) 
            _flightStatusAllowed = ((this.bookingSlot.flight.status === 'Created' || this.bookingSlot.flight.status === 'Assigned'));
        else if(this.bookingSlot && this.bookingSlot.flight && type === 'deals')
            _flightStatusAllowed = (this.bookingSlot.flight.status !== 'PlayFinished' && this.bookingSlot.flight.status !== 'Abandoned');
        else _flightStatusAllowed = true;
           _allow = (_flightStatusAllowed && this.bookingType !== 'past') || this.fromClub;
        return _allow;
        // && (!this.bookingSlot.flight || this.bookingSlot.flight && this.bookingSlot.flight.status !== 'PlayFinished');
    }

    playerDP;
    getPendingPlayerDiscountCard() {
        // discount, status?: string
        let _isEligible;
        let _pendingPDP = [];
        let _approvedPDP = [];
        let _pendingDiscountCards = [];
        // this.pendingPDP = [];
        let _playerId = this.currentPlayerId; 
        //this.bookingPlayer.player.playerId?this.bookingPlayer.player.playerId:this.bookingPlayer.player.id;
        let _clubId;
        if(!this.teeSlotNew) _clubId = this.bookingSlot.clubData.id;
        else if(this.teeSlotNew) _clubId = this.clubs?this.clubs.club.id:this.clubInfo.clubId;
      //  console.log("pending player discount card ", _playerId, this.currentPlayerId)
      //  console.log("pending player discount card ", _clubId, this.currentPlayerId)
        //this.clubId?this.clubId:this.clubInfo.id;
        this.flightService.getListAllPlayersCardDiscount(_clubId)
        .subscribe((data)=>{
            let _pdp: Array<DiscountPlayerClub>;
            if(data) _pdp = data.json();
          //  console.log("get list applications : ", _pdp)
            if(_pdp && _pdp.length > 0) {
                this.playerDP =
                _isEligible = _pdp.filter((p: DiscountPlayerClub)=>{
                        return p.club.id === _clubId && p.verified && p.playerDiscountProgram.player.id === _playerId
                    // if(p.club.id === _clubId && !p.verified && p.playerDiscountProgram.player.id === _playerId){
                    //     _pendingDiscountCards.push(p.playerDiscountProgram)
                    //     this.pendingPDP.push(p.playerDiscountProgram);
                    //     if(status === 'pending')
                    //     _pendingPDP.push(p.playerDiscountProgram)
                    // } else if(p.club.id === _clubId && p.verified && p.playerDiscountProgram.player.id === _playerId) {
                    //     if(status === 'approved')
                    //     _approvedPDP.push(p.playerDiscountProgram)
                    // }
                })
                                    
            }

        }, (error)=>{

        }, ()=>{
        })
    }

    getEligibleDiscount(discount, status?: string) {
      //  console.log("eligible discount - discount", discount);
      //  console.log("eligible discount - player DP", this.playerDP);
      //  console.log("eligible discount - player active discounts", this.playerActiveClubDiscount)
        if(!this.playerDP || this.playerDP && this.playerDP.length === 0) return false;
        let _isEligible = this.playerDP.filter((dp: DiscountPlayerClub)=>{
            if(discount.discountProgram && discount.discountProgram.id)
                return dp.playerDiscountProgram.discountProgram.id === discount.discountProgram.id
            else if(!discount.discountProgram)
                return true
        })
        if(_isEligible && _isEligible.length > 0) return false;
        else return true;
    }

    onEligibleClick(type?: string) {
        let _playerName = this.currentPlayer.playerName + ' [You]';
        
        let _msg;
        _msg = _playerName;
        if(type.toLowerCase() === 'yes') _msg += ' are eligible to use this discount';
        else if(type.toLowerCase() === 'no') _msg += ' are not eligible to use this discount';

        let alert = this.alertCtrl.create({
            title: 'Discount Applicable',
            // subTitle: 'Selected date is '+ _date,
            message: _msg, //'Selected date is ' + '<b>' + _date + '</b>',
            buttons: ['Close']
        });
        alert.present();
    }

    getBookingBalance() {
        if(this.teeSlotNew) return;
        let _balance;
        
        // (Math.round(this.bookingItemBill.balance * 100) / 100).toFixed(2);
        // Number((Math.round(this.bookingItemBill.balance * 100) / 100).toFixed(2));
        _balance = this.bookingItemBill.balance.toFixed(2);
      //  console.log("get booking balance ", _balance)
        return this.numberWithCommas(_balance);
    }
    
    getBookingPayment() {
        if(this.teeSlotNew) return;
        let _payment;
        
        // (Math.round(this.bookingItemBill.balance * 100) / 100).toFixed(2);
        // Number((Math.round(this.bookingItemBill.balance * 100) / 100).toFixed(2));
        _payment = this.bookingItemBill.totalPayment.toFixed(2);
      //  console.log("get booking payment ", _payment)
        return this.numberWithCommas(_payment);
    }

    hasRedeemedAmount() {
        if(this.teeSlotNew) return;
        if(!this.bookingItemBill) return;
        if(this.bookingItemBill && this.bookingItemBill.payments.length === 0) return;
        let _hasRedeem: boolean = false;
        this.bookingItemBill.payments.filter((p: BookingPayment)=>{
            if(p.paymentMethod.toLowerCase().includes('redeem'))
                _hasRedeem = true;
        })
      //  console.log('get total redeemed amount - has redeemn', _hasRedeem, this.bookingItemBill )
        return _hasRedeem;
    }

    getTotalRedeemAmount() {
        if(this.teeSlotNew) return;
        if(!this.bookingItemBill) return;
        if(this.bookingItemBill && this.bookingItemBill.payments.length === 0) return;
        let _redeemAmount;
        _redeemAmount = 
        this.bookingItemBill.payments.filter((p: BookingPayment)=>{
            if(p.paymentMethod.toLowerCase().includes('redeem'))
            return true
            else return false;
        }).map((a)=>{
            return a.amountPaid
        }).reduce((a,b)=>{
            return a + b
        })
      //  console.log("get total redeemed amount : ", _redeemAmount, this.hasRedeemedAmount())
        return _redeemAmount.toFixed(2);
    }

    isRedeemAmount(p: BookingPayment) {
        if(!p) return;
        if(p.paymentMethod.toLowerCase().includes('redeem'))
            return '(R)'
        else return;
    }

    isBookingCancel() {
        if(this.teeSlotNew) return false;
        if(!this.bookingSlot) return false;
        if(this.bookingSlot && !this.bookingSlot.bookingStatus) return false;
        return this.bookingSlot.bookingStatus === 'CancelledByPlayer' || this.bookingSlot.bookingStatus === 'CancelledByClub'
    }

    newClearPreference(i: number, type?: string) {
        let _preference = this.newBuggyCaddyPreference;
        let _bookingPlayer;
        _bookingPlayer = this.bookingSlot.bookingPlayers[i];

        switch(type) {
            case 'buggyPairing':
                _preference.ignoreBuggyUpdate = false;
                // _preference.ignoreCaddieUpdate = true;
                _preference.playerPairings.filter((p)=>{
                    if(p.bookingPlayerId === _bookingPlayer.id) {
                        p.buggyPairing = 0;
                        p.buggyRequired = false;
                    }
                });
                this.bookingSlot.bookingPlayers[i].pairingNo = 0;
                break;
            case 'caddyPairing':
                // _preference.ignoreBuggyUpdate = true;
                _preference.ignoreCaddieUpdate = false;
                _preference.playerPairings.filter((p)=>{
                    if(p.bookingPlayerId === _bookingPlayer.id) {
                        p.caddyPairing = 0;
                        p.caddyRequired = false;
                        p.caddiePreferred = null;
                        p.caddieAssigned = null;
                        p.caddyAssigned = null;
                        p.caddyPreferred = null;
                    }
                });
                this.bookingSlot.bookingPlayers[i].caddyPairing = 0;
                this.bookingSlot.bookingPlayers[i].caddyPreferred = null;
                this.bookingSlot.bookingPlayers[i].caddyAssigned = null;
                break;
            case 'caddyPreferred':
                // _preference.ignoreBuggyUpdate = true;
                _preference.ignoreCaddieUpdate = false;
                _preference.playerPairings.filter((p)=>{
                    if(p.bookingPlayerId === _bookingPlayer.id) {
                        p.caddyPairing = 0;
                        p.caddyRequired = false;
                        p.caddiePreferred = null;
                        p.caddieAssigned = null;
                        p.caddyAssigned = null;
                        p.caddyPreferred = null;
                    }
                });
                this.bookingSlot.bookingPlayers[i].caddyPreferred = null;
                this.bookingSlot.bookingPlayers[i].caddyAssigned = null;
                break;
            case 'playerDriving':
                _preference.ignoreBuggyUpdate = false;
                // _preference.ignoreCaddieUpdate = true;
                _preference.playerPairings.filter((p)=>{
                    if(p.bookingPlayerId === _bookingPlayer.id) {
                        p.driving = false;
                    }
                });
                this.bookingSlot.bookingPlayers[i].driving = false;
                break;

        }
      //  console.log("update preference - clear : ", type, " - local : ", _preference);
      //  console.log("update preference - clear : ", type, " - global : ", this.buggyCaddyPreference);
    }

    newSetBuggySeating(b: any, event) {

        let popover = this.popoverCtl.create(BuggySeatingPage, {
            type: 'buggy',
            headerName: 'Buggy Seating',
            buggies: this.buggySlots,
            slot: this.bookingSlot,
            bookingOptions: this.bookingOptions ? this.bookingOptions : null,
            override: true,
            // courses: this.courses
        }, {
            showBackdrop: true
        });
        popover.onDidDismiss((data: any) => {
            let _buggyNo;
            let _buggyCount;
            // let _maxAllowedBuggy = this.bookingOptions.maxPlayersPerBuggy
            let _maxAllowedBuggy = this.bookingSlot.slotAssigned.maxPlayersPerBuggy
            let _currentPairingNo;
          //  console.log("update preference - data : ", data ," - set buggy seating for : ",b, " global : ", this.buggyCaddyPreference)
          //  console.log("update preference - data : ", data ," - set buggy seating for : ",b, " global new : ", this.newBuggyCaddyPreference)
            if (data && data.selected) {
                let i = b;
                let _preference = this.newBuggyCaddyPreference;
                let _bookingPlayer;
                let _pairingNo = data.buggy.pairingNo;
                
          //  console.log("update preference - data : ", data ," - set buggy seating for : ",b, " local : ", _preference)
                _bookingPlayer = this.bookingSlot.bookingPlayers[i];
                        _preference.ignoreBuggyUpdate = false;
                        // _preference.ignoreCaddieUpdate = true;
                        _preference.playerPairings.filter((p)=>{
                            if(p.bookingPlayerId === _bookingPlayer.id) {
                                p.buggyPairing = _pairingNo;
                                p.buggyRequired = _pairingNo > 0? true: false;
                                if(p.buggyPairing === 0) p.driving = false;
                            }
                        });
                        this.bookingSlot.bookingPlayers[i].pairingNo = _pairingNo;
                        if(_pairingNo === 0) this.bookingSlot.bookingPlayers[i].driving = false
                }
            // this.newUpdatePreference(b, 'buggyPairing', data.buggy.pairingNo);
            // if (data && data.selected) {

            //     _buggyCount = this.bookingSlot.bookingPlayers.filter((player: TeeTimeBookingPlayer, idx: number) => {
            //         return player.pairingNo === data.buggy.pairingNo && idx !== b
            //     }).length;
            //   //  console.log("max allowed : ", _maxAllowedBuggy, " | buggy count : ", _buggyCount, data)
            //     if (data.buggy.pairingNo !== 0 && _buggyCount >= _maxAllowedBuggy) {
            //         MessageDisplayUtil.showMessageToast('Selected Buggy is fully utilized',
            //             this.platform, this.toastCtl, 3000, "bottom")
            //         return false;
            //     }

            //   //  console.log("return buggy seating : ", data)
            //     _buggyNo = data.buggy.buggySlot
            //     this.buggySlots[_buggyNo].totalPlayers += 1;
            //     // this.buggySlots[b].buggySlot = _buggyNo;
            //     this.bookingSlot.bookingPlayers[b].buggyId = _buggyNo;
            //     this.bookingSlot.bookingPlayers[b].pairingNo = _buggyNo;
            //     if (data.buggy.pairingNo === 0) this.bookingSlot.bookingPlayers[b].driving = false;
            //     this.buggyCaddyPreference.ignoreBuggyUpdate = false;
            //     this.buggyCaddyPreference.ignoreCaddieUpdate = true;
            //     this.buggyCaddyPreference.playerPairings.filter((p: PlayerBuggyCaddiePreference) => {
            //         return p.bookingPlayerId === this.bookingSlot.bookingPlayers[b].id
            //     }).map((p: PlayerBuggyCaddiePreference) => {
            //         p.buggyPairing = data.buggy.pairingNo;
            //         p.buggyRequired = data.buggy.pairingNo > 0 ? true : false;
            //         p.caddieId = this.bookingSlot.bookingPlayers[b].caddyPreferred ? this.bookingSlot.bookingPlayers[b].caddyPreferred.id : 0;
            //         // p.caddyRequired = this.bookingSlot.bookingPlayers[b].caddyPairing > 0? true:false; //this.bookingSlot.bookingPlayers[b].caddyPreferred ? true : false;
            //         if(this.bookingSlot.bookingPlayers[b].caddyPairing > 0)
            //             p.caddyRequired = true
            //         else p.caddyRequired = false;
            //         p.caddyPairing = this.bookingSlot.bookingPlayers[b].caddyPairing;
            //         if (data.buggy.pairingNo === 0) p.driving = false;
            //     })

            //   //  console.log("buggy preference - set buggy seating", this.buggyCaddyPreference)
            //     // if(1) return false;

            //     this.flightService.updateBuggyCaddiePreference(this.buggyCaddyPreference)
            //         .subscribe((data: any) => {
            //           //  console.log("response set buggy seating no : ", data);
            //             // this.refreshBookingDetails();
            //             this.refreshBookingObject(data.json());
            //         })


            //     // this.flightService.updateBookingPlayerDetails(this.bookingSlot.id,this.bookingSlot.bookingPlayers[b],'pairing')
            //     // .subscribe((data:any)=> {
            //     //   //  console.log("set pairing no : ", data);
            //     //     this.refreshBookingDetails();
            //     // })
            // }
        });
        popover.present({
            ev: event
        });
        // popover.present();
    }

    newSetCaddyPairing(b: any, event) {
        // if(this.bookingOptions && this.bookingOptions.buggyMandatory && 
        if (this.bookingSlot && !this.bookingSlot.slotAssigned.allowWalking &&
            this.bookingSlot.bookingPlayers[b] &&
            (this.bookingSlot.bookingPlayers[b].pairingNo === 0 || !this.bookingSlot.bookingPlayers[b].pairingNo)) {
            let msg = MessageDisplayUtil.getErrorMessage('', "Please select a buggy first");
            MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl,
                5000, "bottom");
            return false;
        }
        this.caddySlots = [];
        this.caddySlots[0] = {
            caddyPairing: 0,
            caddyRequired: false,
            caddyPreferred: null,
            caddyRequested: false,
            caddySelectionCriteria: null,
            caddyAssigned: null,
        }

        for (var i = 1; i <= this.caddyReq; i++) {
            this.caddySlots.push(Object.assign({}, this.caddySlots[i], {
                caddyRequired: false,
                caddyPreferred: null,
                caddyRequested: false,
                caddySelectionCriteria: null,
                caddyPairing: i,
                caddyAssigned: null,
            }))
        }


        this.caddySlots.forEach((c) => {
            this.caddyPairing.filter((cp) => {
                    return cp.caddyPairing === c.caddyPairing
                })
                .map((cp) => {
                    c.caddyPreferred = cp.caddyPreferred
                })
        })
        let popover = this.popoverCtl.create(BuggySeatingPage, {
            type: 'caddy',
            headerName: 'Caddy Pairing',
            caddies: this.caddySlots,
            pairing: this.caddyPairing,
            // courses: this.courses
        }, {
            showBackdrop: true
        });
        
      //  console.log("before set caddy pairing 2", this.caddySlots, this.caddyPairing)

        popover.onDidDismiss((data: any) => {
          //  console.log("after set caddy pairing", data, this.caddySlots, this.caddyPairing)

            let _currentCaddy;
            let _currentBuggy;
            _currentBuggy = this.bookingSlot.bookingPlayers[b].pairingNo;
            _currentCaddy = this.bookingSlot.bookingPlayers[b].caddyPairing;

            let _caddyNo;
            let _caddyCount;

            let _maxAllowedCaddy = this.bookingSlot.slotAssigned.maxPlayersPerCaddy;
            let _caddyBuggySuccess = true;

            if (data && data.selected) {
                let i = b;
                let _preference = this.newBuggyCaddyPreference;
                let _bookingPlayer;
                let _pairingNo = data.caddy.caddyPairing;

                _caddyBuggySuccess = this.bookingSlot.bookingPlayers.filter((player: TeeTimeBookingPlayer, idx: number) => {
                    if(data.caddy.caddyPairing > 0)
                        return player.caddyPairing === data.caddy.caddyPairing
                    // this.bookingSlot.bookingPlayers[b].caddyPairing
                }).every((p: TeeTimeBookingPlayer, currIdx, nextP: Array < TeeTimeBookingPlayer > ) => {
                  //  console.log("p pairingNo", p.pairingNo, "| current buggy - ", _currentBuggy)
                    // console.log("nextP ", nextP[currIdx+1].pairingNo)
                    if (p.pairingNo !== _currentBuggy)
                        return false
                    else return true
                    // if(p.pairingNo === nextP[currIdx+1].pairingNo) return true
                    //     else return false;
                })

                if (!_caddyBuggySuccess) {
                    MessageDisplayUtil.showMessageToast('Caddy is paired in different buggy',
                        this.platform, this.toastCtl, 3000, "bottom")
                    return false;
                }


                
          //  console.log("update preference - data : ", data ," - set caddy pairing for : ",b, " local : ", _preference)
          //  console.log("update preference - data : ", data ," - set caddy pairing for : ",b, " global old : ", this.buggyCaddyPreference)
          //  console.log("update preference - data : ", data ," - set caddy pairing for : ",b, " global new: ", this.newBuggyCaddyPreference)
                _bookingPlayer = this.bookingSlot.bookingPlayers[i];
                        // _preference.ignoreBuggyUpdate = true;
                        _preference.ignoreCaddieUpdate = false;
                        let _caddyPreferred;
                        // this.caddySlots.filter((cp)=>{
                        //     if(cp.caddyPairing === _pairingNo)
                        //         _caddyPreferred = cp.caddyPreferred
                        // })

                        _preference.playerPairings.filter((p)=>{
                            if(p.bookingPlayerId === _bookingPlayer.id) {
                                
                                 this.bookingSlot.bookingPlayers[i].caddyPairing = _pairingNo;
                                p.caddyPairing = _pairingNo;
                                p.caddyRequired = _pairingNo > 0? true: false;
                                // && p.caddyPairing === _pairingNo
                                if(data && data.caddy && data.caddy.caddyPreferred ) {
                                    p.caddyPreferred = data.caddy.caddyPreferred;
                                    p.caddiePreferred = data.caddy.id;
                                    this.bookingSlot.bookingPlayers[i].caddyPreferred = data.caddy.caddyPreferred
                                } else if(!data.caddy.caddyPreferred) {
                                    this.bookingSlot.bookingPlayers.filter((bp)=>{
                                        if(bp.id !== _bookingPlayer.id) {
                                            if(bp.caddyPairing === _pairingNo) {
                                                p.caddyPreferred = bp.caddyPreferred
                                                if(bp.caddyPreferred) p.caddiePreferred = bp.caddyPreferred.id;
                                            }
                                        } 
                                        // else if(bp.id === _bookingPlayer.id) {
                                        //     if(bp.caddyPairing === _pairingNo) {
                                        //         bp.caddyPreferred = null;
                                        //     }
                                        // }
                                    })
                                    this.bookingSlot.bookingPlayers[i].caddyPreferred = null;

                                } 
                                // else {
                                //     p.caddyPreferred = data.caddy.caddyPreferred;
                                //     p.caddiePreferred = data.caddy.id;
                                // }

                            }

                            // this.caddyPairing.filter((cp)=>{
                            //     if(cp.caddyPairing === p.caddyPairing) {
                            //         cp.caddyPreferred = data.caddy.caddyPreferred
                            //         // cp.caddiePreferred = cp.caddyPreferred.id;
                            //         // this.bookingSlot.bookingPlayers[i].caddyPreferred = cp.caddyPreferred
                            //     } 
                            // });   

                            // if(p.caddyPairing === _bookingPlayer.caddyPairing) {
                            //     this.caddyPairing.filter((cp)=>{
                            //         if(cp.caddyPairing === p.caddyPairing && !cp.caddyPreferred) {
                            //             p.caddyPreferred = cp.caddyPreferred
                            //             p.caddiePreferred = cp.caddyPreferred.id;
                            //             this.bookingSlot.bookingPlayers[i].caddyPreferred = cp.caddyPreferred
                            //         } 
                            //     });
                            // }
                        });
                        // this.bookingSlot.bookingPlayers[i].caddyPreferred = data.caddy.caddyPreferred
                        // this.bookingSlot.bookingPlayers[i].caddyPairing = _pairingNo;
                }



            // if (data && data.selected) {
            //     if (data.caddy.caddyPairing !== 0) {
            //         _caddyBuggySuccess = this.bookingSlot.bookingPlayers.filter((player: TeeTimeBookingPlayer, idx: number) => {
            //             return player.caddyPairing === data.caddy.caddyPairing
            //             // this.bookingSlot.bookingPlayers[b].caddyPairing
            //         }).every((p: TeeTimeBookingPlayer, currIdx, nextP: Array < TeeTimeBookingPlayer > ) => {
            //           //  console.log("p pairingNo", p.pairingNo, "| current buggy - ", _currentBuggy)
            //             // console.log("nextP ", nextP[currIdx+1].pairingNo)
            //             if (p.pairingNo !== _currentBuggy)
            //                 return false
            //             else return true
            //             // if(p.pairingNo === nextP[currIdx+1].pairingNo) return true
            //             //     else return false;
            //         })

            //       //  console.log("caddy pairing", _caddyBuggySuccess)
            //         _caddyCount = this.bookingSlot.bookingPlayers.filter((player: TeeTimeBookingPlayer, idx: number) => {
            //             return player.caddyPairing === data.caddy.caddyPairing && idx !== b
            //         }).length;
            //       //  console.log("max allowed : ", _maxAllowedCaddy, " | caddy count : ", _caddyCount, data)
            //         if (_caddyCount >= _maxAllowedCaddy) {
            //             MessageDisplayUtil.showMessageToast('Selected Caddie is fully utilized',
            //                 this.platform, this.toastCtl, 3000, "bottom")
            //             return false;
            //         }


            //         if (!_caddyBuggySuccess) {
            //             MessageDisplayUtil.showMessageToast('Caddy is paired in different bugggy',
            //                 this.platform, this.toastCtl, 3000, "bottom")
            //             return false;
            //         }
            //     }



            //     let i = data.caddy.caddyPairing;
            //   //  console.log("return caddy pairing : ", data)
            //     // this.setCaddySlot(b, data.caddy.caddyPairing-1)
            //     this.bookingSlot.bookingPlayers[b].caddyPairing = (i);
            //     this.bookingSlot.bookingPlayers.forEach((p, idx) => {
            //         if (p.caddyPairing === data.caddy.caddyPairing)
            //             this.setCaddySlot(idx, p.caddyPairing);
            //         // this.setCaddySlot(playerIdx,this.bookingSlot.bookingPlayers[playerIdx].caddyPairing);

            //     })
            //     // this.bookingSlot.bookingPlayers[b].caddyPreferred = (this.caddyPairing[i]&&this.caddyPairing[i].caddyPreferred?this.caddyPairing[i].caddyPreferred:null);
            //     // this.flightService.updateBookingPlayerDetails(this.bookingSlot.id,this.bookingSlot.bookingPlayers[b],'caddyPairing')
            //     //         .subscribe((updatePlayerDetails:any)=> {
            //     //             // this.caddyPairing[_caddyNo] = {
            //     //             //     caddyPreferred: data.caddy,
            //     //             //     caddyPairing: _caddyNo
            //     //             // }
            //     //             // console.log("select preferred caddy", this.caddyPairing, this.caddyPairing[_caddyNo]);
            //     //             this.refreshBookingDetails();
            //     //         })
            // }
        });
        popover.present({
            ev: event
        });
    }

    newUpdatePreference(i: number, type?: string) { /// not used
        let _preference = this.newBuggyCaddyPreference;
        let _bookingPlayer;
        _bookingPlayer = this.bookingSlot.bookingPlayers[i];

        switch(type) {
            case 'buggyPairing':
                _preference.ignoreBuggyUpdate = false;
                // _preference.ignoreCaddieUpdate = true;
                _preference.playerPairings.filter((p)=>{
                    if(p.bookingPlayerId === _bookingPlayer.id) {
                        p.buggyPairing = 0;
                        p.buggyRequired = false;
                    }
                });
                break;
            case 'caddyPairing':
                // _preference.ignoreBuggyUpdate = true;
                _preference.ignoreCaddieUpdate = false;
                _preference.playerPairings.filter((p)=>{
                    if(p.bookingPlayerId === _bookingPlayer.id) {
                        p.caddyPairing = 0;
                        p.caddyRequired = false;
                        p.caddiePreferred = null;
                        p.caddieAssigned = null;
                    }
                });
                break;
            case 'caddyPreferred':
                // _preference.ignoreBuggyUpdate = true;
                _preference.ignoreCaddieUpdate = false;
                _preference.playerPairings.filter((p)=>{
                    if(p.bookingPlayerId === _bookingPlayer.id) {
                        p.caddyPairing = 0;
                        p.caddyRequired = false;
                        p.caddiePreferred = null;
                        p.caddieAssigned = null;
                    }
                });
                break;
        }
      //  console.log("update preference - update : ", type, " - local : ", _preference);
      //  console.log("update preference - update : ", type, " - global : ", this.buggyCaddyPreference);
    }

    onNewSelectCaddy(playerIdx: number, _caddyNo ? : number) {
        if(!this.fromClub && !this.bookingOptions.allowCaddiePreference) {
            MessageDisplayUtil.showMessageToast("This club currently doesn't allow Caddie booking",
            this.platform, this.toastCtl, 3000, "bottom")
            return false;
        }
        if (this.bookingSlot.bookingPlayers[playerIdx].caddyPairing === 0 || this.bookingSlot.bookingPlayers[playerIdx].caddyPairing === null) {
            MessageDisplayUtil.showMessageToast('Please select Caddy Pairing first',
                this.platform, this.toastCtl, 3000, "bottom")
            return false;
        }
        this.newSelectCaddy(playerIdx, _caddyNo);

        // let alert = this.alertCtrl.create({
        //     title: 'Caddy Selection',
        //     // subTitle: 'Selected date is '+ _date,
        //     // message: 'Please add a caddy number above.', //'Selected date is ' + '<b>' + _date + '</br>',
        //     // buttons: ['Close']
        //     buttons: [{
        //         text: 'Clear selected Caddy Pairing',
        //         handler: () => {
        //             this.caddyPairing[_caddyNo] = {
        //                 caddyPreferred: null,
        //                 caddySelectionCriteria: null
        //             }
        //             this.bookingSlot.bookingPlayers.forEach((p,i)=>{
        //                 if(p.caddyPairing === this.caddyPairing[_caddyNo].caddyPairing)
        //               //  console.log("caddy unselect ", this.caddyPairing[_caddyNo], " - ", p.caddyPairing)
        //                     this.setCaddySlot(i,p.caddyPairing);
        //                     // this.setCaddySlot(playerIdx,this.bookingSlot.bookingPlayers[playerIdx].caddyPairing);

        //             })
        //             return false;
        //         }

        //     },
        //     {
        //         text: 'Select Caddy',
        //         handler: () => {
        //             this.selectCaddy(playerIdx,_caddyNo);
        //             return false;
        //         }
        //     },
        //     {
        //         text: 'Cancel',
        //         role: 'cancel',
        //         // handler: () => {
        //         //     // this.selectCaddy(playerIdx,_caddyNo);
        //         // }
        //     },
        // ]
        // });
        // alert.present();

    }

    newSelectCaddy(playerIdx: number, caddyNo ? : number) {
        let caddiesToExclude = this.caddyPairing;

        let _caddyNo = caddyNo; // + 1;
      //  console.log("selecting caddy from booking - club data: ", this.bookingSlot.clubData);

      //  console.log("selecting caddy from booking - bookingSlot: ", this.bookingSlot);

        if (this.caddyReq === 0) {
            let alert = this.alertCtrl.create({
                title: 'Preferred Caddy',
                // subTitle: 'Selected date is '+ _date,
                message: 'Please add a caddy number above.', //'Selected date is ' + '<b>' + _date + '</b>',
                buttons: ['Close']
            });
            alert.present();

            return false;
        }
        // this.nav.push(CaddyListPage, {
        //     fromBooking: true,
        //     clubId: this.bookingSlot.clubData.id,
        //     bookingClub: this.bookingSlot.clubData
        // }) 
        let caddyModal = this.modalCtl.create(CaddyListPage, {
            // selectAndReturn: true
            clubId: this.bookingSlot.clubData.id,
            fromBooking: true,
            bookingCurrDate: this.bookingSlot.slotAssigned.teeOffDate,
            caddiesToExclude: caddiesToExclude,
            bookingId: this.bookingSlot.id,
        });
        let _bookingPlayers = this.bookingSlot.bookingPlayers;


        caddyModal.onDidDismiss((data: any) => {
          //  console.log("on new select caddy", data)
            let _preference = this.newBuggyCaddyPreference;
            let _bookingPlayer;
            let i = playerIdx;
            let _caddy;
            _bookingPlayer = this.bookingSlot.bookingPlayers[i];
            if(data && data.selected) {
                // _preference.ignoreBuggyUpdate = true;
                _preference.ignoreCaddieUpdate = false;
                _preference.playerPairings.filter((p)=>{

                    // if(p.bookingPlayerId === _bookingPlayer.id) {

                    // }

                    if(p.bookingPlayerId === _bookingPlayer.id) {
                        p.caddiePreferred = data.caddy.id;
                        p.caddyPreferred = data.caddy;
                        p.caddyAssigned = null;
                        p.caddieAssigned = null;
                    }
                    if(p.caddyPairing === _bookingPlayer.caddyPairing) {
                        p.caddiePreferred = data.caddy.id;
                        p.caddyPreferred = data.caddy;
                        p.caddyAssigned = null;
                        p.caddieAssigned = null;

                        this.caddySlots.filter((cs)=>{
                            if(cs.caddyPairing === p.caddyPairing) {
                                cs.caddyPreferred = data.caddy;
                                cs.caddiePreferred = data.caddy.id;
                            } 
                        });

                        this.caddyPairing.filter((cp)=>{
                            if(cp.caddyPairing === p.caddyPairing) {
                                cp.caddyPreferred = data.caddy;
                                cp.caddiePreferred = data.caddy.id;
                            } 
                        });
                    }

                    this.bookingSlot.bookingPlayers.filter((bp)=>{
                        if(bp.caddyPairing === _bookingPlayer.caddyPairing) {
                            // bp.caddiePreferred = data.caddy.id;
                            bp.caddyPreferred = data.caddy;
                            p.caddyAssigned = null;
                            // p.caddieAssigned = null;
                        }
                    })

                    // this.caddySlots.filter((cs)=>{
                    //     if(cs.caddyPairing === _bookingPlayer.caddyPairing)
                    // })
                        
                });
                _caddy = data.caddy
              //  console.log("update preference - select caddy : ", data, " - local preference : ", _preference)
              //  console.log("update preference - select caddy : ", data, " - global old preference : ", this.buggyCaddyPreference)
              //  console.log("update preference - select caddy : ", data, " - global new preference : ", this.newBuggyCaddyPreference)
                _bookingPlayer.caddyPreferred = _caddy;
              //  console.log("update preference - select caddy : ", data, " - bookingPlayer : ", _bookingPlayer)
              //  console.log("update preference - select caddy : ", data, " - bookingPlayerS : ", this.bookingSlot.bookingPlayers)
            }
            // if (data && data.selected) {
            //   //  console.log("after select caddy for pairing ALL - ", this.caddyPairing[_caddyNo], this.caddyPairing, this.caddySlots, data.caddy, data.caddySelectionCriteria)

            //     if (data.caddy && !data.caddySelectionCriteria) {
            //         this.bookingSlot.bookingPlayers[playerIdx].caddyPreferred = data.caddy
            //         this.bookingSlot.bookingPlayers[playerIdx].caddyPairing = _caddyNo;
            //         // this.bookingSlot.bookingPlayers[playerIdx].caddySelectionCriteria = data.caddySelectionCriteria;

            //         this.caddyPairing[_caddyNo] = {
            //             caddyPreferred: data.caddy,
            //             caddyPairing: _caddyNo,
            //             caddySelectionCriteria: data.caddySelectionCriteria,
            //             caddyRequired: _caddyNo > 0? true:false
            //         }
            //         this.bookingSlot.bookingPlayers.forEach((p, i) => {
            //             if (p.caddyPairing === this.caddyPairing[_caddyNo].caddyPairing)
            //                 this.setCaddySlot(i, p.caddyPairing);
            //             // this.setCaddySlot(playerIdx,this.bookingSlot.bookingPlayers[playerIdx].caddyPairing);

            //         })
            //       //  console.log("after select caddy for pairing fav- ", this.caddyPairing[_caddyNo], this.caddyPairing, this.caddySlots, data.caddySelectionCriteria)
            //     } else if (!data.caddy && data.caddySelectionCriteria) {
            //         this.bookingSlot.bookingPlayers[playerIdx].caddyPairing = _caddyNo;
            //         this.bookingSlot.bookingPlayers[playerIdx].caddyPreferred = data.caddy
            //         this.bookingSlot.bookingPlayers[playerIdx].caddySelectionCriteria = data.caddySelectionCriteria;

            //         this.caddyPairing[_caddyNo] = {
            //             caddyPreferred: data.caddy,
            //             caddyPairing: _caddyNo,
            //             caddySelectionCriteria: data.caddySelectionCriteria
            //         }
            //         this.bookingSlot.bookingPlayers.forEach((p, i) => {
            //             if (p.caddyPairing === this.caddyPairing[_caddyNo].caddyPairing)
            //                 this.setCaddySlot(i, p.caddyPairing);
            //             // this.setCaddySlot(playerIdx,this.bookingSlot.bookingPlayers[playerIdx].caddyPairing);

            //         })

            //       //  console.log("after select caddy for pairing criteria - ", this.caddyPairing[_caddyNo], this.caddyPairing, this.caddySlots, data.caddySelectionCriteria)
            //     }

            //     // console.log("from caddy list modal - data: ", data);
            //     // console.log("from caddy list modal - bookingplayers : ", this.bookingSlot.bookingPlayers[b]);
            //     // this.flightService.updateBookingPlayerDetails(this.bookingSlot.id,this.bookingSlot.bookingPlayers[playerIdx],'caddyPreferred')
            //     // .subscribe((updatePlayerDetails:any)=> {

            //     //     this.caddyPairing[_caddyNo] = {
            //     //         caddyPreferred: data.caddy,
            //     //         caddyPairing: _caddyNo+1
            //     //     }
            //     //     // this.caddySlots[_caddyNo] = {
            //     //     //     caddyPreferred: data.caddy,
            //     //     //     caddyPairing: _caddyNo+1
            //     //     // }
            //     //   //  console.log("select preferred caddy", this.caddyPairing, this.caddyPairing[_caddyNo]);
            //     //     this.refreshBookingDetails();
            //     // })
            // } else if (data && !data.selected) {
            //     this.caddyPairing[_caddyNo] = {
            //         caddyPreferred: null,
            //         caddySelectionCriteria: null
            //     }
            //     this.bookingSlot.bookingPlayers.forEach((p, i) => {
            //         if (p.caddyPairing === this.caddyPairing[_caddyNo].caddyPairing)
            //           //  console.log("caddy unselected ", this.caddyPairing[_caddyNo], " - ", p.caddyPairing)
            //         this.setCaddySlot(i, p.caddyPairing);
            //         // this.setCaddySlot(playerIdx,this.bookingSlot.bookingPlayers[playerIdx].caddyPairing);

            //     })
            // }
        });
        caddyModal.present();
    }

    newSetPlayerDriving(b: any, p: TeeTimeBookingPlayer, driving ? : string) {
        // if(this.bookingOptions && !this.bookingOptions.buggyMandatory && this.bookingSlot.bookingPlayers[b].pairingNo===0) {
        if (this.bookingSlot && this.bookingSlot.slotAssigned.allowWalking && this.bookingSlot.bookingPlayers[b].pairingNo === 0) {
            MessageDisplayUtil.showMessageToast('Please select a buggy first',
                this.platform, this.toastCtl, 3000, "bottom")
            return false;
        } else if (this.bookingSlot && !this.bookingSlot.slotAssigned.allowWalking && this.bookingSlot.bookingPlayers[b].pairingNo === 0) {
            MessageDisplayUtil.showMessageToast('Buggy is required for this slot. Please select a buggy.',
                this.platform, this.toastCtl, 3000, "bottom")
            return false;
        }
        if (this.bookingType === 'past') return false;
      //  console.log("set player driving", b, this.playerDriving, driving, this.bookingSlot.bookingPlayers[b].driving)
        let _playerIsDriving;


        let _otherPlayer = this.bookingSlot.bookingPlayers.filter((pd: TeeTimeBookingPlayer) => {
            if (pd.pairingNo === this.bookingSlot.bookingPlayers[b].pairingNo && this.bookingSlot.bookingPlayers[b].id !== pd.id)
                return true
        })
        // .map((fp:TeeTimeBookingPlayer)=>{
        //   //  console.log("me driving - other player ", fp)
        //     fp.driving = false;
        // })

      //  console.log("me driving - me  player ", this.bookingSlot.bookingPlayers[b], "|||", _otherPlayer)

        if (driving === 'me') {
            _playerIsDriving = true;
            this.bookingSlot.bookingPlayers[b].driving = _playerIsDriving;
        } else if (driving === 'other') {
            _playerIsDriving = false;
            this.bookingSlot.bookingPlayers[b].driving = _playerIsDriving;
        } else {
            _playerIsDriving = this.bookingSlot.bookingPlayers[b].driving;
            if (_otherPlayer && _otherPlayer[0]) _otherPlayer[0].driving = _playerIsDriving
            this.bookingSlot.bookingPlayers[b].driving = !_playerIsDriving;
        }
      //  console.log("set player driving after ", b, this.playerDriving, driving, _playerIsDriving, this.bookingSlot.bookingPlayers[b].driving);
      //  console.log("buggy preference - set player driving", this.buggyCaddyPreference)

        let _preference = this.newBuggyCaddyPreference;
        _preference.ignoreBuggyUpdate = false;
        _preference.ignoreCaddieUpdate = true;
        _preference.playerPairings.filter((p: PlayerBuggyCaddiePreference) => {
            return p.bookingPlayerId === this.bookingSlot.bookingPlayers[b].id
        }).map((p: PlayerBuggyCaddiePreference) => {
            p.driving = !_playerIsDriving;
        });
        // this.newBuggyCaddyPreference.playerPairings.forEach((p)=>{
        //     if(p.bookingPlayerId !== this.bookingSlot.bookingPlayers[b].id && p.buggyPairing === this.bookingSlot.bookingPlayers[b].pairingNo)
        //         p.driving = !p.driving;
        // })

        if (_otherPlayer && _otherPlayer[0]) {
          //  console.log("other player ", _otherPlayer)
            _preference.playerPairings.filter((p: PlayerBuggyCaddiePreference) => {
                return p.bookingPlayerId === _otherPlayer[0].id
            }).map((p: PlayerBuggyCaddiePreference) => {
                p.driving = _playerIsDriving;
            })
        }


        // this.flightService.updateBuggyCaddiePreference(this.buggyCaddyPreference)
        //     .subscribe((data: any) => {
        //       //  console.log("driving data : ", data)
        //         if (data.status === 200) {
        //             // this.refreshBookingDetails();
        //             this.refreshBookingObject(data.json())
        //         }
        //     })

        // this.flightService.updateBookingPlayerDetails(this.bookingSlot.id,this.bookingSlot.bookingPlayers[b],'driving')
        // .subscribe((data: any) => {
        //   //  console.log("driving data : ", data)
        //     if(data.status === 200) {
        //         if(_otherPlayer && _otherPlayer[0]) this.flightService.updateBookingPlayerDetails(this.bookingSlot.id,_otherPlayer[0],'driving')
        //             .subscribe((data: any) => {
        //                 this.refreshBookingDetails();
        //             });
        //         else this.refreshBookingDetails();
        //         }
        // })
        // this.playerIsDriving = !this.playerIsDriving;
    }


    onResetPreference(mode?: string) {
        let _title;
        let _message;

        if(mode === 'leave') {
            _title = 'Buggy Caddy Pairings';
            _message = 'This will discard any Buggy/Caddie Pairings. Do you want to proceed?';
        } else {
            _title = 'Reset Buggy Caddy Pairings';
            _message = 'This will Reset Buggy/Caddie Pairings to previous settings. Do you want to proceed?';
        }
        let alert = this.alertCtrl.create({
            title: _title,
            // subTitle: 'Selected date is '+ _date,
            message: _message, //'Selected date is ' + '<b>' + _date + '</b>',
            // buttons: ['Close'] 
            buttons: [
                {
                    text: 'No',
                    handler: () => {
                        // console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        if(mode === 'leave') {
                            this.resetPreference();
                            setTimeout(()=>{
                                this.nav.pop();
                            },500)
                            // this.resetPrefere
                        } else this.resetPreference();
                        // p.confirmed = false;
                    }
                },
            ]
        });
        alert.present();
        // this.resetPreference();
    }

    resetPreference() {
      //  console.log("on update preference - reset : ", this.buggyCaddyPreference)
      //  console.log("on update preference - reset : ", this.newBuggyCaddyPreference)
        this.newBuggyCaddyPreference = JSON.parse(JSON.stringify(this.buggyCaddyPreference));
        this.bookingSlot.bookingPlayers.forEach((bp)=>{
            this.newBuggyCaddyPreference.playerPairings.filter((p: PlayerBuggyCaddiePreference)=>{
                if(p.bookingPlayerId === bp.id) {
                    bp.driving = p.driving;
                    bp.pairingNo = p.buggyPairing;
                    bp.caddyPairing = p.caddyPairing;
                    // bp.caddiePreferred = p.caddiePreferred;
                    // bp.caddieAssigned = p.caddieAssigned;
                    bp.caddyPreferred = p.caddyPreferred;
                    bp.caddyAssigned = p.caddyAssigned;
                }
            })
        });
        
        this.expandPlayers.forEach((expand, idx)=>{
            this.expandPlayers[idx] = false
        })

    }

    newRemoveCaddy(playerIdx ? : number, caddyNo ? : number) {
      //  console.log("remove caddy - ", caddyNo, " : ", this.caddyPairing[caddyNo])
        this.caddyRemoveFlag = true;
        // this.caddyPairing.filter((cp: BookingCaddy) => {
        //     return cp.caddyPairing === caddyNo
        // }).map((cp) => {
        //     cp.caddyPairing = 1;
        //     cp.caddyPreferred = null;
        //     cp.caddySelectionCriteria = null
        //     cp.caddyRequired = false;
        // })
        this.caddyPairing[caddyNo].caddyPreferred = null;
        this.caddyPairing[caddyNo].caddyAssigned = null;
        this.caddySlots[caddyNo].caddyPreferred = null;
        this.caddySlots[caddyNo].caddyAssigned = null;

        this.bookingSlot.bookingPlayers[playerIdx].caddyPairing = caddyNo;
        let _bookingPlayer = this.bookingSlot.bookingPlayers[playerIdx];
        this.bookingSlot.bookingPlayers.forEach((p, idx) => {
            // if (this.caddyPairing[caddyNo] && (p.caddyPairing === this.caddyPairing[caddyNo].caddyPairing)) {
            if (p.id === _bookingPlayer.id && p.caddyPairing === caddyNo) {
                p.caddyPreferred = null;
                p.caddySelectionCriteria = null;
                p.caddyAssigned = null;
            } else if(p.caddyPairing === caddyNo) {
                p.caddyPreferred = null;
                p.caddySelectionCriteria = null;
                p.caddyAssigned = null;
            }
            // this.setCaddySlot(idx, p.caddyPairing);
            // this.setCaddySlot(playerIdx,this.bookingSlot.bookingPlayers[playerIdx].caddyPairing);

        });

        let _preference = this.newBuggyCaddyPreference;
        _preference.ignoreCaddieUpdate = false;
        _preference.playerPairings.filter((p: PlayerBuggyCaddiePreference)=>{
            if(p.bookingPlayerId === _bookingPlayer.id) {
                p.caddyPreferred = null;
                p.caddyRequired = p.caddyPairing>0?true:false;
                p.caddiePreferred = null;
                p.caddieAssigned = null;
                p.caddyAssigned = null;
                // _bookingPlayer.driving = p.driving;
                // _bookingPlayer.pairingNo = p.buggyPairing;
                // _bookingPlayer.caddyPairing = p.caddyPairing;
                // // bp.caddiePreferred = p.caddiePreferred;
                // // bp.caddieAssigned = p.caddieAssigned;
                // _bookingPlayer.caddyPreferred = p.caddyPreferred;
                // _bookingPlayer.caddyAssigned = p.caddyAssigned;
            } else if(p.caddyPairing === _bookingPlayer.caddyPairing) {
                p.caddyPreferred = null;
                p.caddyRequired = p.caddyPairing>0?true:false;
                p.caddiePreferred = null;
                p.caddieAssigned = null;
                p.caddyAssigned = null;
            }
        })
      //  console.log("remove caddy - ", caddyNo, " : ", _preference)

        // this.flightService.updateBookingPlayerDetails(this.bookingSlot.id,this.bookingSlot.bookingPlayers[playerIdx],'removeCaddy')
        // .subscribe((updatePlayerDetails: any)=>{
        //           this.refreshBookingDetails(); 
        //    })

    }

    onUpdatePreference() {
      //  console.log("on update preference - global old : ", this.buggyCaddyPreference)
      //  console.log("on update preference - global new : ", this.newBuggyCaddyPreference)
      //  console.log("on update preference - booking players : ", this.bookingSlot.bookingPlayers)
      //  console.log("on update preference - caddy slot : ", this.caddySlots)
      //  console.log("on update preference - caddy pairing : ", this.caddyPairing)
        let _hasChanges: boolean = false;
        if(JSON.stringify(this.buggyCaddyPreference) !== JSON.stringify(this.newBuggyCaddyPreference)) {
            _hasChanges = true;
        }
        let _changesTxt = 'There is '+(_hasChanges?'changes':'no changes')+'. '; 
        let _validation = this.onValidatePreference();
        if(_validation && _validation.valid) {
            let alert = this.alertCtrl.create({
                title: 'Update Buggy Caddy Pairings',
                // subTitle: 'Selected date is '+ _date,
                message: 'This will Update Buggy/Caddie Pairings to new settings. Do you want to proceed?', //'Selected date is ' + '<b>' + _date + '</b>',
                // buttons: ['Close'] 
                buttons: [
                    {
                        text: 'No',
                        handler: () => {
                            // console.log('Cancel clicked');
                        }
                    },
                    {
                        text: 'Yes',
                        handler: () => {
                            this.updatePreference();
                            // p.confirmed = false;
                        }
                    },
                ]
            });
            alert.present();
        } else if(_validation && !_validation.valid) {
            let _reasonTxt = _validation.reason.filter(this.onlyUnique);
            // _reasonTxt.filter(this.onlyUnique);
            let _msg = _reasonTxt.join("<br>")
            // MessageDisplayUtil.showMessageToast(_msg,
            //     this.platform, this.toastCtl, 3000, "bottom")
                
            let alert = this.alertCtrl.create({
                title: 'Buggy & Caddie Pairings Validation',
                // subTitle: 'Selected date is '+ _date,
                message: _msg, //'Selected date is ' + '<b>' + _date + '</b>',
                buttons: ['Close']
            });
            alert.present();

            return false;
        }
        
    }

    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    onValidatePreference() {
        if(!this.newBuggyCaddyPreference.bookingId) return;
        let _hasInvalid;
        let _buggy;
        let _caddy;
        let _caddyMandatory = this.bookingSlot.slotAssigned.caddyMandatory; //this.bookingOptions.caddyMandatory;
        let _buggyMandatory = !this.bookingSlot.slotAssigned.allowWalking; //this.bookingOptions.buggyMandatory;
        let _maxPlayersPerBuggy = this.bookingOptions.maxPlayersPerBuggy;
        let _maxPlayersPerCaddy = this.bookingOptions.maxPlayersPerCaddy;
        let _buggyCount;
        let _caddyCount;
        let _caddyPreferredCount;
        let _reasonTxt = [];
        this.newBuggyCaddyPreference.playerPairings.filter((pp)=>{
            if(pp.buggyPairing === 0 && _buggyMandatory) {
                _reasonTxt.push('Buggy is mandatory') 
                _hasInvalid = true;
            }
            if(pp.caddyPairing === 0 && _caddyMandatory) {
                _reasonTxt.push('Caddy is mandatory')
                _hasInvalid = true;
            }
        });
        // this.newBuggyCaddyPreference.playerPairings.forEach((pp)=>{
        for(let pp of this.newBuggyCaddyPreference.playerPairings) {
            _buggyCount = this.newBuggyCaddyPreference.playerPairings.filter((fpp)=>{
                if(fpp.buggyPairing === pp.buggyPairing && pp.buggyPairing > 0)
                    return true
                    // _buggyCount.push(pp.buggyPairing)
            });
            if(_buggyCount && _buggyCount.length > _maxPlayersPerBuggy) {
                // You can only have N player(s) per buggy.
                // One of the buggy is fully utilized (max: '+_maxPlayersPerBuggy+' players)
                _reasonTxt.push('You can only have '+_maxPlayersPerBuggy+' player(s) per buggy')
                _hasInvalid = true;
            }
            
            _caddyCount = this.newBuggyCaddyPreference.playerPairings.filter((fpp)=>{
                if(fpp.caddyPairing === pp.caddyPairing && pp.caddyPairing > 0)
                    return true
                    // _buggyCount.push(pp.buggyPairing)
            });
            if(_caddyCount && _caddyCount.length > _maxPlayersPerCaddy) {
                _reasonTxt.push('One of the caddie is fully utilized (max: '+_maxPlayersPerCaddy+' players)')
                _hasInvalid = true;
            }

            _caddyPreferredCount = this.newBuggyCaddyPreference.playerPairings.filter((fpp)=>{
                if(!fpp.caddiePreferred || !pp.caddiePreferred || pp.caddiePreferred > 0 || fpp.caddiePreferred > 0)
                    return false
                if(fpp.caddiePreferred === pp.caddiePreferred && pp.caddyPairing > 0 && fpp.caddyPairing > 0)
                    return true
                    // _buggyCount.push(pp.buggyPairing)
            });
            if(_caddyPreferredCount && _caddyPreferredCount.length > _maxPlayersPerCaddy) {
                _reasonTxt.push('One of the preferred caddie is fully utilized (max: '+_maxPlayersPerCaddy+' players)')
                _hasInvalid = true;
            }

            // if(_hasInvalid) break;
        }
        // console.log("validate preference - caddy preferred count ", _caddyPreferredCount, _maxPlayersPerCaddy )
        // console.log("validate preference - caddy count ", _caddyCount, _maxPlayersPerCaddy )
        // console.log("validate preference - buggy count ", _buggyCount, _maxPlayersPerBuggy )
        // console.log("validate preference - reason text ", _reasonTxt.join("|") )




        // _caddyBuggySuccess = this.bookingSlot.bookingPlayers.filter((player: TeeTimeBookingPlayer, idx: number) => {
        //     return player.caddyPairing === data.caddy.caddyPairing
        //     // this.bookingSlot.bookingPlayers[b].caddyPairing
        // }).every((p: TeeTimeBookingPlayer, currIdx, nextP: Array < TeeTimeBookingPlayer > ) => {
        //   //  console.log("p pairingNo", p.pairingNo, "| current buggy - ", _currentBuggy)
        //     // console.log("nextP ", nextP[currIdx+1].pairingNo)
        //     if (p.pairingNo !== _currentBuggy)
        //         return false
        //     else return true
        //     // if(p.pairingNo === nextP[currIdx+1].pairingNo) return true
        //     //     else return false;
        // })

        // console.log("caddy pairing", _caddyBuggySuccess)
        // _caddyCount = this.bookingSlot.bookingPlayers.filter((player: TeeTimeBookingPlayer, idx: number) => {
        //     return player.caddyPairing === data.caddy.caddyPairing && idx !== b
        // }).length;
        // console.log("max allowed : ", _maxAllowedCaddy, " | caddy count : ", _caddyCount, data)
        // if (_caddyCount >= _maxAllowedCaddy) {
        //     MessageDisplayUtil.showMessageToast('Selected Caddie is fully utilized',
        //         this.platform, this.toastCtl, 3000, "bottom")
        //     return false;
        // }


        // if (!_caddyBuggySuccess) {
        //     MessageDisplayUtil.showMessageToast('Caddy is paired in different bugggy',
        //         this.platform, this.toastCtl, 3000, "bottom")
        //     return false;
        // }

        
        return {
            valid: !_hasInvalid,
            reason: _reasonTxt
        }
    }

    updatePreference() {
        
        let _content = (!this.updatingPlayer)?'Updating preferences...':'';
        let loader = this.loadingCtrl.create({
            showBackdrop: false,
            duration: 5000,
            content: _content
        });
        
        let _preference= JSON.parse(JSON.stringify(this.newBuggyCaddyPreference));
      //  console.log("updating preference - assignment Done ", this.assignmentDone)
      //  console.log("updating preference - updating player ", this.updatingPlayer)
      //  console.log("updating preference - _preference ", _preference)

        if(this.updatingPlayer) {
            // _preference.ignoreBuggyUpdate = false;
            // _preference.ignoreCaddieUpdate = false;
            _preference.playerPairings.forEach((pp)=>{
                if(this.assignmentDone && pp.caddyPairing > 0 && !pp.caddiePreferred) {
                    let _caddy =
                    this.newBuggyCaddyPreference.playerPairings.filter((npp)=>{
                        if(npp.caddyPairing === pp.caddyPairing && npp.caddiePreferred) {
                          //  console.log("updating preference caddie - npp ", npp)
                          //  console.log("updating preference caddie - pp ", pp)
                            // pp.caddyPreferred = npp.caddyPreferred
                            // pp.caddiePreferred = npp.caddyPreferred.id
                            _preference.ignoreCaddieUpdate = false;
                            return true
                        }
                    })

                  //  console.log("updating preference - _caddy  ", _caddy)
                    if(_caddy && _caddy.length > 0) {
                        pp.caddyPreferred = _caddy[0].caddyPreferred
                        pp.caddiePreferred = _caddy[0].caddyPreferred.id

                    }
                }
                if(this.assignmentDone && pp.buggyPairing > 0 && !pp.assignedBuggy) {
                    let _buggy =
                    this.newBuggyCaddyPreference.playerPairings.filter((npp)=>{
                        if(npp.buggyPairing === pp.buggyPairing && npp.assignedBuggy) {
                          //  console.log("updating preference buggy - npp ", npp)
                          //  console.log("updating preference buggy - pp ", pp)
                            // pp.caddyPreferred = npp.caddyPreferred
                            // pp.caddiePreferred = npp.caddyPreferred.id
                            _preference.ignoreBuggyUpdate = false;
                            return true
                        }
                    })
                    
                  //  console.log("updating preference - _buggy  ", _buggy)
                    if(_buggy && _buggy.length > 0) {
                        pp.assignedBuggy = _buggy[0].assignedBuggy
                        // pp.caddyPreferred = _buggy[0].caddyPreferred
                        // pp.caddiePreferred = _buggy[0].caddyPreferred.id

                    }
                }
            })
        }



        loader.present().then(()=>{
          //  console.log("on update preference - global old : ", this.buggyCaddyPreference)
          //  console.log("on update preference - global new : ", this.newBuggyCaddyPreference)
          //  console.log("on update preference - booking players : ", this.bookingSlot.bookingPlayers)
            // this.newBuggyCaddyPreference
            this.flightService.updateBuggyCaddiePreference(_preference)
                .subscribe((data: any) => {
                    loader.dismiss().then(()=>{
                        if (data.status === 200) {
                          //  console.log("after update preference data : ", data.json())
                            // this.refreshBookingObject(data.json());
                            // for(let expand of this.expandPlayers) {
                            //     expand = false;
                            // }
                            this.expandPlayers.forEach((expand, idx)=>{
                                this.expandPlayers[idx] = false
                            })
                            if(this.updatingPlayer) this.updatingPlayer = false;
                            // this.caddyRemoveFlag = false;
                            // this.refreshBookingDetails();
                        }
                    })
                }, (error)=>{
                    loader.dismiss();
                }, ()=>{
                    if(this.assignmentDone) {
                        this.onProcessAssignment();
                    } 
                    else this.recalculateBookingPricing();
                    
                });
        })
        

    }

    hasPreferenceChanges(i?: number) {
        let _hasChanges: boolean = false;
        let _bookingPlayer = this.bookingSlot.bookingPlayers[i];
        
        // console.log("has pref changes - ", i, " : ", this.newBuggyCaddyPreference, this.buggyCaddyPreference, _bookingPlayer)
        if(!i) {
            if(JSON.stringify(this.buggyCaddyPreference) !== JSON.stringify(this.newBuggyCaddyPreference)) {
                _hasChanges = true;
            }
        } else {
            this.newBuggyCaddyPreference.playerPairings.filter((pp)=>{
                if(pp.bookingPlayerId === _bookingPlayer.id) {
                    this.buggyCaddyPreference.playerPairings.filter((opp)=>{

                        // console.log("has pref changes : ", pp, opp, _bookingPlayer)
                        if(opp.bookingPlayerId === pp.bookingPlayerId)
                            if(JSON.stringify(opp) !== JSON.stringify(pp)) {
                                // console.log("has pref changes : ", pp, opp, _bookingPlayer)
                                _hasChanges = true;
                            }
                    })
                }
            })
        }
        return _hasChanges;

    }

    onNewClearPlayerDetails(playerIdx: number) {
        let alert = this.alertCtrl.create({
            title: 'Clear all details',
            // subTitle: 'Selected date is '+ _date,
            message: 'Do you want to clear all details for the player?', //'Selected date is ' + '<b>' + _date + '</b>',
            buttons: [ {
                text: 'No',
                role: 'cancel'
            },
            {
                text: 'Clear',
                handler: () => {
                    this.newClearPlayerDetails(playerIdx);
                }
            },]
        });
        alert.present();
    }

    newClearPlayerDetails(playerIdx: number) {
        
        let _preference = this.newBuggyCaddyPreference;
        _preference.ignoreBuggyUpdate = false;
        _preference.ignoreCaddieUpdate = false;
        _preference.playerPairings.filter((p: PlayerBuggyCaddiePreference) => {
            return p.bookingPlayerId === this.bookingSlot.bookingPlayers[playerIdx].id
        }).map((p: PlayerBuggyCaddiePreference) => {
            // if(this.bookingOptions&&!this.bookingOptions.buggyMandatory) {
            if (this.bookingSlot && this.bookingSlot.slotAssigned.allowWalking) {
                p.buggyPairing = 0
                p.buggyRequired = false;
                p.assignedBuggy = null;
            } else if(this.bookingSlot && !this.bookingSlot.slotAssigned.allowWalking) {
                p.buggyPairing = 1;
                p.buggyRequired = true;
                p.assignedBuggy = null;
            }
            // if(this.bookingOptions&&!this.bookingOptions.caddyMandatory) {
            if (this.bookingSlot && !this.bookingSlot.slotAssigned.caddyMandatory) {
                p.caddyPairing = 0
                p.caddyRequired = false;
            } else if (this.bookingSlot && this.bookingSlot.slotAssigned.caddyMandatory) {
                p.caddyPairing = 1
                p.caddyRequired = true;
            }

            p.driving = false;
            // p.caddyRequired = false;
                p.caddyPreferred = null;
                p.caddyAssigned = null;
                p.caddiePreferred = null;
                p.caddieAssigned = null;
        });

    }

    checkOverpayment() {
        // let _color = ;
        let _balance = this.bookingSlot.amountPayable-this.bookingSlot.totalDeductions-this.bookingSlot.amountPaid+this.bookingSlot.totalRefund;
        // if(_balance < 0) _color = "{'color': 'orange'}";
        if(_balance < 0) return true
        else return false
    }

    checkOverpaymentInfo() {
        let _message = "You have overpaid amount"
            let alert = this.alertCtrl.create({
                title: 'Booking Validation',
                // subTitle: 'Selected date is '+ _date,
                message: _message, //'Selected date is ' + '<b>' + _date + '</b>',
                buttons: ['Close']
            });
            alert.present();
        }

        getPricingPlan(type?: string, attribute?: string) {
            let _currentSlot;
            let _pricingPlan;
            // if(this.teeSlotNew) _pricingPlan
            if(this.teeSlotNew && this.teeTimeSlotDisplay.slot.pricingPlan && type === 'normal')
                _pricingPlan = this.teeTimeSlotDisplay.slot.pricingPlan
            else if(this.teeSlotNew && this.teeTimeSlotDisplay.slot.pricingPlanPromotional && type === 'promo')
                _pricingPlan = this.teeTimeSlotDisplay.slot.pricingPlanPromotional
                
            if(!this.teeSlotNew && this.bookingSlot.slotAssigned.pricingPlan && type === 'normal')
            _pricingPlan = this.bookingSlot.slotAssigned.pricingPlan
             else if(!this.teeSlotNew && this.bookingSlot.slotAssigned.pricingPlanPromotional && type === 'promo')
            _pricingPlan = this.bookingSlot.slotAssigned.pricingPlanPromotional

            // if(!this.bookingSlot.slotAssigned.pricingPlan && type === 'normal') return;
            // else if(!this.bookingSlot.slotAssigned.pricingPlanPromotional && type ==='promo') return;

            // if(type === 'promo' && _currentSlot.slotAssigned.pricingPlanPromotional) {
            //     _pricingPlan = _currentSlot.slotAssigned.pricingPlanPromotional;
            // } else {
            //     _pricingPlan = _currentSlot.slotAssigned.pricingPlan
            // }
            switch(attribute) {
                case 'name':
                    return _pricingPlan.name
                case 'currency':
                        return _pricingPlan.currency.symbol;
                case 'description':
                    return _pricingPlan.description;
                case 'dicounts':
                    let _discounts = (_pricingPlan.discountsApplicable)?'Yes':'No'
                    return _discounts;
                case 'promotional':
                    let _promo = (_pricingPlan.promotional)?'Yes':'No'
                    return _promo;
            }
        }

        setTogglePromoDetails(type?: string) {
            if(type === 'promo') this.togglePlanPromoDetails = !this.togglePlanPromoDetails 
            else this.togglePlanDetails = !this.togglePlanDetails
        }

        onNotificationsClick() { 
            this.nav.push(NotificationsPage);
        }

        
        escapeCRLF(value) {
            return JsonService.escapeCRLF(value);
            // return value.replace(/\r?\n/g, "<br />");  
        }

        allowPlayerUnpaidBooking() {
            if(!this.playerMaxBooking) return true;
            return this.playerMaxBooking.totalUnpaidBookings < this.playerMaxBooking.maxUnpaidBookings

        }

        onBookingCancelGuard() {
            let _msg;
            let _resetGuard;
            let _bookingId = this.bookingSlot.id;
            // _msg = this.bookingSlot.cancelGuardBy;
            _resetGuard = this.bookingSlot.cancellationGuard;
            this.flightService.setBookingCancelGuard(_bookingId, _resetGuard)
            .subscribe((data: TeeTimeBooking)=>{
              //  console.log("done cancel guard : ", data)
                // console.log("cancel guard : - ",_resetGuard, " - ", this.bookingSlot.cancelGuardBy);
                if(data) {
                    this.refreshBookingObject(data);
                    let _msg;
                    if(_resetGuard) _msg = "Successfully reset guard this booking from auto-cancellation.";
                    else if(!_resetGuard) _msg = "Successfully guard this booking from auto-cancellation.";
                    MessageDisplayUtil.showMessageToast(_msg,
                    this.platform, this.toastCtl, 3000, "bottom")
                    // this.refreshBookingDetails();
                }
            },(error)=>{
                if(error) {
                    let _error = error.json();
                  //  console.log("error cancel guard : ", error.json())
                    let _msg;
                    if(_error.errorMessage) _msg = _error.errorMessage;
                    else _msg = "There is something wrong with the server. Please try again.";
                    MessageDisplayUtil.showErrorToast(_msg,
                    this.platform, this.toastCtl, 3000, "bottom")
                    this.refreshBookingObject(this.bookingSlot);
                }
            })
            
        }

        checkHolesAllowedEnable() {
            return this.eighteenHolesAllowed && this.nineHolesAllowed
        }

        getContactInfo(type?: string, slot?: number) {
            if(this.teeSlotNew) return;
            if(!this.fromClub) return;
            let hasPlayer = this.bookingSlot.bookingPlayers[slot-1];
            // if(hasPlayer && hasPlayer.length === 0) return;
            
            let _message = '';
            let _name = '';
            let _phone = '';
            let _email = '';
            switch(type) {
                case 'bookingInfo':
                    if(this.bookingSlot.bookedByPlayer) {
                        if(this.bookingSlot.bookedByPlayer.playerName) _name = '<i class="fas fa-fw fa-user"></i>&nbsp;'+this.bookingSlot.bookedByPlayer.playerName;
                        if(this.bookingSlot.bookedByPlayer.address && this.bookingSlot.bookedByPlayer.address.phone1) _phone = '<br><i class="fas  fa-fw fa-phone-alt"></i>&nbsp;'+this.bookingSlot.bookedByPlayer.address.phone1;
                        if(this.bookingSlot.bookedByPlayer.email) _email = '<br><i class="fas fa-fw fa-at"></i>&nbsp;'+this.bookingSlot.bookedByPlayer.email;
                        _message = _name + _phone + _email;
                    } else if(this.bookingSlot.bookedByUser) {
                        if(this.bookingSlot.bookedByUser.name) _name = '<i class="fas fa-fw fa-user"></i>&nbsp;'+this.bookingSlot.bookedByUser.name;
                        if(this.bookingSlot.bookedByUser.phone) _phone = '<br><i class="fas  fa-fw fa-phone-alt"></i>&nbsp;'+this.bookingSlot.bookedByUser.phone;
                        _message = _name + _phone;
                    }
                    break;
                case 'player':
                    if(!hasPlayer) return;
                    let _player = this.bookingSlot.bookingPlayers[slot-1];
                    if(_player.playerName) _name = '<i class="fas fa-fw fa-user"></i>&nbsp;'+_player.playerName;
                    if(_player.phone) _phone = '<br><i class="fas fa-fw fa-phone-alt"></i>&nbsp;'+_player.phone;
                    else if(_player.player.address.phone1) _phone = '<br><i class="fas fa-fw fa-phone-alt"></i>&nbsp;'+_player.player.address.phone1;
                    if(_player.email) _email = '<br><i class="fas fa-fw fa-at"></i>&nbsp;'+_player.email; 
                    if(_player) {
                        _message = _name + _phone + _email;
                    }
                    break;
            }
            
            let alert = this.alertCtrl.create({
                title: 'Contact Info',
                // subTitle: 'Selected date is '+ _date,
                message: _message, //'Selected date is ' + '<b>' + _date + '</b>',
                buttons: ['Close']
            });
            alert.present();
        }

        allowClubManualRecalculate() {
            if(!this.fromClub) return false;
            if(this.teeSlotNew) return false;
            if(!this.showRecalculate) return false;
            if(!this.teeSlotNew && this.bookingSlot && 
                (this.bookingSlot.bookingStatus === 'CancelledByClub' || this.bookingSlot.bookingStatus === 'CancelledByPlayer')  )
                return false;
            if(this.bookingSlot) {
                let _bookingDate = moment(this.bookingSlot.slotAssigned.teeOffDate);
                let _currentDate = moment();
                if(_bookingDate.diff(_currentDate,'days') < 0) {
                    console.log("trigger pricing : ", _bookingDate, _currentDate)
                    console.log("trigger pricing : ", _bookingDate.diff(_currentDate,'days'))
                    return false;
                } else return true;
            } else return false;
        }

        onClubManualRecalculate() {
            let alert = this.alertCtrl.create({
                title: 'Manual Re-Calculate Pricing',
                cssClass: 'booking-error',
                // subTitle: 'Selected date is '+ _date,
                message: 'This will manually re-calculate pricing for this booking. Do you want to proceed?', //'Selected date is ' + '<b>' + _date + '</b>',
                buttons: [{
                    text: 'No'
                },{
                    text: 'Yes',
                        handler: () => {
                            this.recalculateBookingPricing(true);
                        }
                }]
            });
            alert.present();
        }

        appAttribute: any;
        showConsoleLog: boolean = false;
        enablePaymentTimer: boolean = false;
        showRecalculate: boolean = false;
        paymentTimerDuration: number = 5; //in minutes

        getAppAttribute() { 
            console.log("[app attribute] : ")
            this.flightService.getAppAttributes()
            .subscribe((data: any)=>{
                console.log("[app attribute] : ", data)
                if(data) {
                    data.filter((d)=>{
                        return d.page === 'bookingDetails'
                    }).map((d)=>{
                        this.appAttribute = d
                    });

                    if(this.appAttribute) {
                        if(this.appAttribute.showConsoleLog) this.showConsoleLog = this.appAttribute.showConsoleLog;
                        if(this.appAttribute.enablePaymentTimer) this.enablePaymentTimer = this.appAttribute.enablePaymentTimer;
                        if(this.appAttribute.showRecalculate) this.showRecalculate = this.appAttribute.showRecalculate;
                        if(this.appAttribute.paymentTimerDuration) this.paymentTimerDuration = this.appAttribute.paymentTimerDuration;
                    }

                }
            })
        }

        blockPayment() {
            // this.enablePaymentTimer = true;
            let _block: boolean = false;
            if(this.enablePaymentTimer) {
                if(this.paymentFailed && this.paymentDateTime) {
                    let _currTime = moment();
                    let _diffMinutes = _currTime.diff(this.paymentDateTime, 'minutes')
                    console.log("payment check - ", _currTime, _diffMinutes, this.paymentDateTime)
                    if(_diffMinutes >= 0 && _diffMinutes < this.paymentTimerDuration ) {
                        let alert = this.alertCtrl.create({
                            title: 'Payment',
                            // subTitle: 'Selected date is '+ _date,
                            message: 'Your previous payment was not successful, please try again after '+ (this.paymentTimerDuration - _diffMinutes) + ' minute(s)', //'Selected date is ' + '<b>' + _date + '</b>',
                            buttons: [{
                                text: 'OK',
                                handler: ()=>{
                                    this.onRefreshClick();
                                }
                            }],
                            
                        });
                        alert.present();
                        _block = true; 
    
                    }
                } 
            }
            return _block
        }

        onChangeNinesBooking() {
            if(this.teeSlotNew) return;
            if(!this.checkHolesAllowedEnable()) return;
            if(this.bookingType === 'past') return;
            if(this.bookingSlot.bookingStatus === 'CancelledByPlayer' || this.bookingSlot.bookingStatus === 'CancelledByClub') return;
            let _ninesPlayed;
            let _currentNinesPlayed;
            _currentNinesPlayed = this.bookingSlot.ninesPlayed;
            if(_currentNinesPlayed === 1) _ninesPlayed = 2;
            else if(_currentNinesPlayed === 2) _ninesPlayed = 1;
            let alert = this.alertCtrl.create({
                title: 'Change Holes to Play',
                // subTitle: 'Selected date is '+ _date,
                message: 'Do you want to change <b>Holes to Play</b> from <b>' + _currentNinesPlayed*9 + '</b> to <b>' + _ninesPlayed*9 + '</b> holes?',
                buttons: [{
                    text: 'No'
                },{
                    text: 'Yes',
                    handler: ()=>{
                        this.goChangeNinesBooking(_ninesPlayed);
                    }
                }]
            });
            alert.present();
        }

        goChangeNinesBooking(ninesPlayed: number) {
            let _bookingId = this.bookingSlot.id;
            this.flightService.updateNinesBooking(_bookingId, ninesPlayed)
            .subscribe((data)=>{
                console.log("change nines booking ", ninesPlayed, _bookingId, data)
                this.onRefreshClick()
            }) 
        }

        onUndoCancelBooking() {
            if(this.teeSlotNew) return;
            if(this.bookingSlot.bookingStatus !== 'CancelledByPlayer' && this.bookingSlot.bookingStatus !== 'CancelledByClub') return;
            let alert = this.alertCtrl.create({
                title: 'Undo Cancellation',
                // subTitle: 'Selected date is '+ _date,
                message: 'If the slot is still available, this will undo cancellation of this booking. Do you want to proceed?',
                buttons: [{
                    text: 'No'
                },{
                    text: 'Yes',
                    handler: ()=>{
                        this.goUndoCancelBooking();
                    }
                }]
            });
            alert.present();
        }

        goUndoCancelBooking() {
            let _bookingId = this.bookingSlot.id;
            this.flightService.undoCancelBooking(_bookingId)
            .subscribe((data)=>{
                this.onRefreshClick();
                MessageDisplayUtil.showMessageToast('Successfully undo cancellation of this booking', 
                this.platform , this.toastCtl, 5000, "bottom");
            }, (error)=>{
                if(error) {
                    let _error = error.json();
                    let _msg = _error.errorMessage;
                    if(_error.errorCode === 'TeeTimeBooking.SlotAlreadyAssigned') {
                        _msg = 'Slot has already assigned to different booking.'
                    }
                    MessageDisplayUtil.showErrorToast('Failed to undo cancellation of this booking.' + _msg, 
                    this.platform , this.toastCtl, 5000, "bottom");
                }
            })
        }

        scrollToBottom(): void {
            // try {
            //     this.myScrollContainer.nativeElement.scrollToBottom = this.myScrollContainer.nativeElement.scrollHeight;
            // } catch(err) { }                 
            // var messagesContent = this.app.getComponent('messagesContent') as Content;
            // messagesContent.scrollTo(0, messagesContent.getContentDimensions().contentHeight, 700);
        }

        ngAfterViewChecked() {
            // this.scrollToBottom();
        }



}