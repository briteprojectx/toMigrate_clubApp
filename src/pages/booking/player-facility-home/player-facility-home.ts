import {
    ActionSheetController,
    Events,
    LoadingController,
    ModalController,
    NavController,
    NavParams,
    Platform,
    AlertController
} from 'ionic-angular';
import {Keyboard} from '@ionic-native/keyboard';
import {Component, Renderer} from '@angular/core';
import {adjustViewZIndex} from '../../../globals';
import {
    createPlayerList,
    FriendRequest,
    FriendRequestList,
    PlayerHomeInfo,
    PlayerInfo,
    PlayerList
} from '../../../data/player-data';
import {
    AbstractNotificationHandlerPage,
    NotificationHandlerInfo
} from '../../../providers/pushnotification-service/notification-handler-constructs';
import {FriendService} from '../../../providers/friend-service/friend-service';
import {ProfilePage} from '../../profile/profile';
import {SearchPlayerListPage} from '../../search-player-list/search-player-list';
import {NewContactPage} from '../../new-contact/new-contact';
import {Observable} from 'rxjs/Observable';
import { BookingDetailsPage } from '../booking-details/booking-details';
import { BookingSearchPage } from '../booking-search/booking-search';
import { BookingListPage } from '../booking-list/booking-list';
import { ClubFlightService } from '../../../providers/club-flight-service/club-flight-service';
import { TeeTimeSlotDisplay, ClubTeeTimeSlots, TeeTimeBooking, TeeTimeBookingOptions, TeeTimeClubVoucher, PagedData, } from '../../../data/mygolf.data';
import { SelectDatesPage } from '../../modal-screens/select-dates/select-dates';

import * as moment from 'moment';
import { RecentClubListPage } from '../../performance/recent-club/recent-club';
import { CourseInfo, ClubInfo, createCourseInfo, createClubInfo } from '../../../data/club-course';
import { GeolocationService } from '../../../providers/geolocation-service/geolocation-service';
import { BookingClubListPage } from '../booking-club-list/booking-club-list';
import { FavouriteListPage } from '../../player-favourite-list/player-favourite-list';
import { PlayerHomeDataService } from '../../../redux/player-home';
import { MessageDisplayUtil } from '../../../message-display-utils';
import { ToastController } from 'ionic-angular';
import { FaqPage } from '../../faq/faq';
import { ServerInfoService } from '../../../providers/serverinfo-service/serverinfo-service';
import { ServerInfo } from '../../../data/server-info';
import { NotificationsPage } from '../../notifications/notifications';
import { PlayerService } from '../../../providers/player-service/player-service';
// import {JsonService} from '../../json-util';
@Component({
    templateUrl: 'player-facility-home.html',
    selector: 'player-facility-home-page'
})
export class PlayerFacilityHomePage {
    public friends: string = "friend";
    public friendType: string = "friend";
    public friendScreenName: string = "Friends";

    public bookings: string = "search";


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
    public receivedList: Array<FriendRequest> = new Array<FriendRequest>();
    public sentList: Array<FriendRequest> = new Array<FriendRequest>();
    public friendRequests: Array<FriendRequest> = new Array<FriendRequest>();
    public playerRequests: Array<FriendRequest> = new Array<FriendRequest>();
    public playerHomeInfo$: Observable<PlayerHomeInfo>;
    public player$: Observable<PlayerInfo>;

    public refreshOnEnter: boolean = false;

    tabs: any;

    public selectClubType: string = 'allClubs';//favClubs  // ; //'nearbyClubs' //'single'

    startDate: string = moment().add(1,'days').format("YYYY-MM-DD");
    endDate: string = moment().format("YYYY-MM-DD");
    fromTime: string = '07:00'; //moment().format("HH:mm");
    toTime: string = '17:00'; //moment().format("HH:mm");    

    courseType: string = 'club';
    courseInfo: CourseInfo;
    clubInfo: ClubInfo;
    bookingClubType: string = 'favClubs'; // 'favClubs'; //'nearbyClubs'
    searchDistance: number = 50;
    bookingByPlayerList: Array<TeeTimeBooking>;
    activeDateSince: string;

    fromBookNow: boolean = false;
    toggleSlots: boolean = false;

    loader: any;
    refresher: boolean = false;
    currentMaxBooking: number = 0;
    today: any = moment().format("YYYY-MM-DD");
    maxDate: any = moment().format("YYYY-MM-DD");

    userType: string = 'player';

    dualValue2: any = {
        upper: 45,
        lower: 24
    };

    toggleActivePanel: boolean = true;
    togglePastPanel: boolean = false;
    toggleCancelPanel: boolean = false;
    toggleInvitedPanel: boolean = false;

    
    refresherPast = false;
    refresherCancel = false;
    refresherInvited = false;
    pastBookingByPlayerList: Array<TeeTimeBooking>;
    cancelledBookingByPlayerList: Array<TeeTimeBooking>;
    invitedBookingForPlayerList: Array<TeeTimeBooking>;

    pastPage = 0;
    togglePastSlots: boolean = false;
    toggleCancelSlots: boolean = false;
    toggleInvitedSlots: boolean = false;
    errorMessage: string;

    callBack: any;
    
    captchaResponse: string = '';
    botsOut: boolean;

    favClubs: Array<ClubInfo>;

    appAttribute: any;
    useHistorical: boolean = false;
    historyMonthly: boolean = true;

    histNextMonth: string;
    histPastDate: string;
    currentDate: string;

    enableNearby: boolean = false;

    histStartDate: string;
    histEndDate: string;

    historyPlayerBookingList: PagedData<TeeTimeBooking>;

    historyCurrentPage: number;
    historyTotalPages: number;
    historyTotalItems: number;
    historyPageSize: number;

    facilityTypeName: string = 'Select here to start';

    selectedBay: number;
    selectedBalls: number;
    selectedHour: number;

    
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
        private flightService: ClubFlightService,
        private alertCtrl: AlertController,
        private geo: GeolocationService,
        private playerHomeService: PlayerHomeDataService,
        private toastCtl: ToastController,
        private serverInfoService: ServerInfoService,
        private playerService: PlayerService,
        private actionSheetCtl: ActionSheetController) {
            this.tabs = [
                { title: "Schedule",  icon: "calendar" },
                { title: "Speakers",  icon: "contacts" },
                { title: "Map",  icon: "map" },
                { title: "About", icon: "information-circle" },
              ];

        this.requestFriends = {
            totalPages: 0,
            currentPage: 0,
            totalItems: 0,
            totalInPage: 0,
            success: true,
            friendRequests: new Array<FriendRequest>()
        };
        this.listFriends = {
            totalPages: 0,
            currentPage: 0,
            totalItems: 0,
            totalInPage: 0,
            success: true,
            players: new Array<PlayerInfo>()
        };
        events.subscribe("FriendListUpdate", () => {
            this._refreshValues(null, null);
        });
        events.subscribe("FriendRequestUpdate", () => {
            this.friends = "request";
            this._refreshValues(null, null);
        });
        this.playerList = createPlayerList();

        this.fromBookNow = this.navParams.get("fromBookNow");
        
        this.userType = this.navParams.get("userType");
        if(!this.userType) this.userType = 'player';
        if(this.fromBookNow) this.bookings = 'mybookings';
        if(this.userType === 'player') {
            this.playerHomeInfo$      = this.playerHomeService.playerHomeInfo();
            this.player$              = this.playerHomeInfo$
                                            .filter(Boolean)
                                            .map((playerHome: PlayerHomeInfo) => playerHome.player);
        }

        let _fromCancel = this.navParams.get("cancelBooking");
        if(_fromCancel) {
            
            this.setBookingType(2);
            this.togglePanel(1);
            this.refreshBookingHome();
            // this.refreshActiveBooking();
            console.log("in constructor cancel booking")
        }
        console.log('constructor user type ', this.userType)
        // let _callback;
        // if(_fromCancel) {
        //     this.togglePanel(1);
        //     this.refreshActiveBooking();
        //     _callback = this.navParams.get("callback");
        //     _callback().then(()=>{
        //         this.nav.pop();
        //     })
        // }
        console.log("max date", this.maxDate)
        this.maxDate = moment(this.maxDate).add(3, 'y').format("YYYY-MM-DD");
        console.log("max date - after", this.maxDate)

        
        this.histNextMonth = moment().endOf('month').format("YYYY-MM-DD");
        this.histPastDate = moment().format("YYYY-MM-DD"); //moment().add(-1, 'month').format("YYYY-MM-DD");
        this.currentDate = moment().format("YYYY-MM-DD");
        this.histStartDate = moment().add(-7,'days').format("YYYY-MM-DD");
        this.histEndDate = moment().add(7,'days').format("YYYY-MM-DD");


        



    }

   

    ionViewDidLoad() {
        this.getAppAttribute();
        if(this.userType === 'player') {
            this.refreshActiveBooking();
            // this.refreshPastBooking();
            this.refreshHistoryBooking(0);
            this.refreshCancelBooking();
            this.refreshInvitedBooking();
        }
        this.initServerStatus();
        this.refreshFavouriteClubs();

        // this._refreshValues(null, null);
    }

    refreshFavouriteClubs() {
        this.favClubs = [];
        this.playerService.getFavoriteClubs(false)
        .subscribe((favourites: Array<ClubInfo>) => {
            console.log("favourites :", favourites)
                this.favClubs = favourites;
            }, (error) => {
            // let msg = MessageDisplayUtil.getErrorMessage(error);
            // MessageDisplayUtil.displayErrorAlert(this.alertCtrl, "Favourites",
            //     msg, "OK");
        },()=>{
        });
    }

    ionViewDidEnter() {
        if (this.refreshOnEnter)
            this._refreshValues(null, null);
        this.refreshOnEnter = false;
        this.refreshBookingHome();
        this.refreshFavouriteClubs();
    }

    ionViewWillEnter() {
        adjustViewZIndex(this.nav, this.renderer);
        
        // let _cancelBooking = this.navParams.get("cancelBooking");
        // console.log("in ion view will enter cancel booking ", _cancelBooking); // ==> "yourValue"
        // if(_cancelBooking) {
        //     this.setBookingType(2);
        //     this.togglePanel(1);
        //     this.refreshBookingHome();
        // }

    }

    refreshBookingHome() {
        if(this.togglePastPanel) this.refreshHistoryBooking(); //this.refreshPastBooking();
        else if(this.toggleCancelPanel) this.refreshCancelBooking();
        else if(this.toggleInvitedPanel) this.refreshInvitedBooking();
        else this.refreshActiveBooking();
        
    }

    public refreshOnViewEntered(refresh: boolean) {
        this.refreshOnEnter = refresh;
    }

    public refreshPage(pushData: any) {
        this._refreshValues(null, null);
    }

    public getNotifications(): Array<NotificationHandlerInfo> {
        let notifications = new Array<NotificationHandlerInfo>();
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

    onSearchInput(searchbar) {
        this._refreshValues(null, null);
    }

    onSearchCancel() {
        console.log("Out os search field");
    }

    onPlayerInput(searchbar) {
      this.playerList = createPlayerList();
        this._refreshPlayer(null, null);
    }

    onRefresh(refresher) {
        this._refreshValues(refresher, null)
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
                    console.log("Came back from new contact", apply)
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
                console.log("dismiss profile:", data);

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
                console.log("dismiss profile:", data);

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
        }
        else {
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
        // console.log("Enter Refresh");

        // if (this.friends == "friend") {
        //     this._refreshFriends(refresher, infinite);
        // }

        // if (this.friends == "request") {
        //     this._refreshRequest(refresher, infinite);
        // }

        // if (this.friends == "find") {
        //     this.playerList = createPlayerList();
        //     this._refreshPlayer(refresher, infinite);
        // }
    }

    private _refreshRequest(refresher, infinite) {

        this.refreshAttempted = false;

        this.loader = this.loadingCtrl.create({
            showBackdrop: false
        });

        this.loader.present().then(() => {
            this.refreshAttempted = false;
            this.friendService.searchFriendRequests()
                .subscribe((friendRequests: FriendRequestList) => {
                    this.loader.dismiss(friendRequests).then(() => {

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
                    this.loader.dismiss();
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
        this.loader = this.loadingCtrl.create({
            showBackdrop: false
        });

        this.loader.present().then(() => {
            this.refreshAttempted = false;
            this.friendService.searchFriends(this.searchFriend)
                .subscribe((friendRequests: PlayerList) => {
                    this.loader.dismiss(friendRequests).then(() => {

                        this.refreshAttempted = true;

                        if (friendRequests) {
                            this.listFriends = friendRequests;
                        }

                    });
                }, (error) => {
                    this.loader.dismiss();
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

        this.loader = this.loadingCtrl.create({
            showBackdrop: false
        });

        this.loader.present().then(() => {

            this.friendService.searchNonFriends(this.searchPlayer, this.playerList.currentPage + 1)
                .subscribe((playerList: PlayerList) => {
                    this.loader.dismiss(playerList).then(() => {
                      console.log("PlayerList:", playerList);

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
                    this.loader.dismiss();
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
                console.log("dismiss profile:", data);

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
            this.bookings = 'search';
            this.friendScreenName = 'Search';
            if (this.platform.is("ios") && this.platform.is("cordova")) {
                this.keyboard.close();
            }
            this.initServerStatus();
        }
        if (type === 2) {
            this.bookings = 'mybookings';
            this.friendScreenName = 'My Bookings';
            // this._refreshRequest(null, null);
            // this.refreshActiveBooking();
            if (this.platform.is("ios") && this.platform.is("cordova")) {
                this.keyboard.close();
            }
        }

    }
    
    onActiveBookingClick(x: TeeTimeBooking) {
        console.log("on active")
        // this.nav.push(BookingDetailsPage, {
        //     clubInfo: this.clubInfo,
        //     teeTimeSlotDisplay: x,
        //     teeSlotNew: true,
        //     clubs: this.clubs
        // })
        this.nav.push(BookingDetailsPage, {
            teeSlotNew: false,
            teeTimeSlotDisplay: x.slotAssigned,
            bookingSlot: x,
            clubInfo: x.clubData
        });
    }

    onInvitedBookingClick(x: TeeTimeBooking) {
        console.log("on invited")
        // this.nav.push(BookingDetailsPage, {
        //     clubInfo: this.clubInfo,
        //     teeTimeSlotDisplay: x,
        //     teeSlotNew: true,
        //     clubs: this.clubs
        // })
        this.nav.push(BookingDetailsPage, {
            teeSlotNew: false,
            teeTimeSlotDisplay: x.slotAssigned,
            bookingSlot: x,
            clubInfo: x.clubData
        });
    }
    onPastBookingClick(x: TeeTimeBooking) {
        console.log("on past")
        this.nav.push(BookingDetailsPage, {
            teeSlotNew: false,
            teeTimeSlotDisplay: x.slotAssigned,
            bookingSlot: x,
            clubInfo: x.clubData,
            type: 'past'
        });
    }

    onCancelBookingClick(x: TeeTimeBooking) {
        console.log("on past")
        this.nav.push(BookingDetailsPage, {
            teeSlotNew: false,
            teeTimeSlotDisplay: x.slotAssigned,
            bookingSlot: x,
            clubInfo: x.clubData,
            type: 'past'
        });
    }

    onCompletedBookingClick() {
        console.log("on completed")

        this.nav.push(BookingDetailsPage);
    }

    onPendingBookingClick() {
        console.log("on pending")

        this.nav.push(BookingDetailsPage);
    }

    goSearchTeeTimes() {
        this.loader = this.loadingCtrl.create({
            showBackdrop: false,
            duration: 5000
        });
        let _favClubs;
        if(this.selectClubType === 'single' && (!this.clubInfo || !this.courseInfo)) {
            let _message = 'Please select a single club'
            let alert = this.alertCtrl.create({
                title: 'Search option',
                // subTitle: 'Selected date is '+ _date,
                message: _message, //'Selected date is ' + '<b>' + _date + '</b>',
                buttons: ['Close']
            });
            alert.present();
            return false;
        } else if(this.selectClubType === 'favClubs' && (this.favClubs && this.favClubs.length === 0 || !this.favClubs)) {
            let _message = 'No Favourite clubs found. Please tap on SET UP to define your favourites.';
                 let alert = this.alertCtrl.create({
                title: 'Search by Favourite Club(s)',
                // subTitle: 'Selected date is '+ _date,
                message: _message, //'Selected date is ' + '<b>' + _date + '</b>',
                buttons: ['Close']
            });
            alert.present();
            return false;
        }

        let _forDate = this.startDate;
        let _fromTime = this.fromTime; //'07:00';
        let _toTime = this.toTime; //'09:00';
        let _clubCourseId;
        let _isClub: boolean = true;

        
        this.loader.present().then(() => {
        let _bookingListType = this.selectClubType; //'single';

        let _playerId;
        this.player$.take(1).subscribe((player: PlayerInfo) => {
            _playerId = player.playerId
        });
        if(_bookingListType === 'single') {
            if(this.courseType === 'club') {
                _clubCourseId = this.clubInfo.clubId;
                _isClub = true;
            }
            else if(this.courseType === 'course') {
                _clubCourseId = this.courseInfo.courseId;
                _isClub = false;
            }

            this.flightService.getTeeTimeSlot(_forDate,_isClub,_clubCourseId,_fromTime,_toTime)
            .subscribe((teeTimeSlotDayDisplay: Array<TeeTimeSlotDisplay>) => {
                this.loader.dismiss().then(()=>{
                    console.log("booking home @ "+ _forDate +" from "+ _fromTime + ' to ' + _toTime + " : ", teeTimeSlotDayDisplay)
                if(teeTimeSlotDayDisplay.length > 0) {
                    this.nav.push(BookingListPage, {
                        bookingListType: _bookingListType,
                        teeTimeSlotDisplayList: teeTimeSlotDayDisplay,
                        fromTime: _fromTime,
                        toTime: _toTime,
                        startDate: _forDate,
                        courseInfo: this.courseInfo,
                        clubInfo: this.clubInfo,
                        fromClub: false,
                   });
                } else {
                    let _message = this.clubInfo.clubName + '<br>Date : ' + moment(_forDate).format("ddd, DD MMM YYYY") + '<br>From '+_fromTime + ' to ' + _toTime;
                    let alert = this.alertCtrl.create({
                        title: 'No Tee Time slots',
                        // subTitle: 'Selected date is '+ _date,
                        message: _message, //'Selected date is ' + '<b>' + _date + '</b>',
                        buttons: ['Close']
                    });
                    alert.present();
                    this.loader.dismiss();
                }
                })
                
            }, (error)=>{
                this.loader.dismiss();
            }, ()=>{
                setTimeout(()=>{
                    this.loader.dismiss()
                }, 5000)
            });
        } else if(_bookingListType === 'nearbyClubs') {
            this.flightService.getTeeTimeSlotNearbyClubs(_forDate,this.searchDistance,_fromTime,_toTime)
            .subscribe((clubTeeTimeSlots : Array<ClubTeeTimeSlots>) => {
                this.loader.dismiss().then(()=>{
                    if(clubTeeTimeSlots.length > 0) {
                        // clubTeeTimeSlots.forEach((c) => {
                        //     JsonService.deriveFullUrl(c.club,"clubImage")
                        // })
                        
                        this.nav.push(BookingClubListPage, {
                            bookingListType: _bookingListType,
                            clubTeeTimeSlotList: clubTeeTimeSlots,
                            fromTime: _fromTime,
                            toTime: _toTime,
                            startDate: _forDate,
                            courseInfo: this.courseInfo,
                            clubInfo: this.clubInfo,
                            fromClub: false,
                        })
                    } else {
                        let _message = this.clubInfo.clubName + '<br>Date : ' + _forDate + '<br>From '+_fromTime + ' to ' + _toTime;
                        let alert = this.alertCtrl.create({
                            title: 'Search by Single Club',
                            // subTitle: 'Selected date is '+ _date,
                            message: _message, //'Selected date is ' + '<b>' + _date + '</b>',
                            buttons: ['Close']
                        });
                        alert.present();
                        this.loader.dismiss();
                    }
                })
                
            }, (error)=>{
                let _error = error.json();
                if(error.status === 409) {
                    let _message = _error.errors[0];
                    let alert = this.alertCtrl.create({
                        title: 'Search by Single Club',
                        // subTitle: 'Selected date is '+ _date,
                        message: _message, //'Selected date is ' + '<b>' + _date + '</b>',
                        buttons: ['Close']
                    });
                    alert.present();
                }
                console.log("fav club error ", _error)
                this.loader.dismiss();
            }, ()=>{
                this.loader.dismiss()
            })
        } else if(_bookingListType === 'favClubs') {
            this.flightService.getTeeTimeSlotFavClubs(_forDate,_fromTime,_toTime)
            .subscribe((data: any) => {
                // clubTeeTimeSlots : Array<ClubTeeTimeSlots>
                this.loader.dismiss().then(()=>{
                    console.log("fav clubs : ", data)
                    if(data && data.teeTimeSlot) {
                        let clubTeeTimeSlots: Array<ClubTeeTimeSlots> = data.teeTimeSlot;
                        console.log("fav clubs : ", clubTeeTimeSlots)
                        if(clubTeeTimeSlots.length > 0) {

                            this.flightService.getListPlayerVouchers(_playerId)
                            .subscribe((playerVoucher: Array<TeeTimeClubVoucher>)=>{
                                console.log("get voucher list", playerVoucher)
                                if(playerVoucher && playerVoucher.length > 0) {
                                    this.nav.push(BookingClubListPage, {
                                        bookingListType: _bookingListType,
                                        clubTeeTimeSlotList: clubTeeTimeSlots,
                                        fromTime: _fromTime,
                                        toTime: _toTime,
                                        startDate: _forDate,
                                        courseInfo: this.courseInfo,
                                        clubInfo: this.clubInfo,
                                        playerVoucher: playerVoucher,
                                        playerId: _playerId,
                                        fromClub: false,
                                    });
                                } else {
                                    this.nav.push(BookingClubListPage, {
                                        bookingListType: _bookingListType,
                                        clubTeeTimeSlotList: clubTeeTimeSlots,
                                        fromTime: _fromTime,
                                        toTime: _toTime,
                                        startDate: _forDate,
                                        courseInfo: this.courseInfo,
                                        clubInfo: this.clubInfo,
                                        playerId: _playerId,
                                        fromClub: false,
                                    })
                                }
                            })




                            // this.nav.push(BookingClubListPage, {
                            //     bookingListType: _bookingListType,
                            //     clubTeeTimeSlotList: clubTeeTimeSlots,
                            //     fromTime: _fromTime,
                            //     toTime: _toTime,
                            //     startDate: _forDate,
                            //     courseInfo: this.courseInfo,
                            //     clubInfo: this.clubInfo
                            // })
                        } else {
                            let _message = 'No Tee Time slots for <br>Date : ' + _forDate + '<br>From '+_fromTime + ' to ' + _toTime;
                            let alert = this.alertCtrl.create({
                                title: 'Search by Favourite Club(s)',
                                // subTitle: 'Selected date is '+ _date,
                                message: _message, //'Selected date is ' + '<b>' + _date + '</b>',
                                buttons: ['Close']
                            });
                            alert.present();
                            this.loader.dismiss();
                        }
                    }
                    
                })
                
            }, (error)=>{
                let _error = error.json();
                if(error.status === 409) {
                    let _message = _error.errors[0].includes('favorite clubs')?'No Favourite clubs found. Please tap on SET UP to define your favourites.':_error.errors[0];
                    let alert = this.alertCtrl.create({
                        title: 'Search by Favourite Club(s)',
                        // subTitle: 'Selected date is '+ _date,
                        message: _message, //'Selected date is ' + '<b>' + _date + '</b>',
                        buttons: ['Close']
                    });
                    alert.present();
                }
                console.log("fav club error ", _error)
                
                this.loader.dismiss();
            }, ()=>{
                setTimeout(()=>{
                    this.loader.dismiss()
                }, 5000)
            })
        } else if(_bookingListType === 'allClubs') {
            // let _playerId;
            // this.player$.take(1).subscribe((player: PlayerInfo) => {
            //     _playerId = player.playerId
            //     // this.currentPlayerId = player.playerId
            // });
            this.flightService.getListAllSlots(_playerId,_forDate,_fromTime,_toTime)
            .subscribe((data: any) => {
                // clubTeeTimeSlots : Array<ClubTeeTimeSlots>
                this.loader.dismiss().then(()=>{
                    console.log("fav clubs : ", data)
                    if(data && data.teeTimeSlot) {
                        let clubTeeTimeSlots: Array<ClubTeeTimeSlots> = data.teeTimeSlot;
                        console.log("fav clubs : ", clubTeeTimeSlots)
                        if(clubTeeTimeSlots.length > 0) {

                            this.flightService.getListPlayerVouchers(_playerId)
                            .subscribe((playerVoucher: Array<TeeTimeClubVoucher>)=>{
                                console.log("get voucher list", playerVoucher)
                                if(playerVoucher && playerVoucher.length > 0) {
                                    this.nav.push(BookingClubListPage, {
                                        bookingListType: _bookingListType,
                                        clubTeeTimeSlotList: clubTeeTimeSlots,
                                        fromTime: _fromTime,
                                        toTime: _toTime,
                                        startDate: _forDate,
                                        courseInfo: this.courseInfo,
                                        clubInfo: this.clubInfo,
                                        playerVoucher: playerVoucher,
                                        playerId: _playerId,
                                        fromClub: false,
                                    });
                                } else {
                                    this.nav.push(BookingClubListPage, {
                                        bookingListType: _bookingListType,
                                        clubTeeTimeSlotList: clubTeeTimeSlots,
                                        fromTime: _fromTime,
                                        toTime: _toTime,
                                        startDate: _forDate,
                                        courseInfo: this.courseInfo,
                                        clubInfo: this.clubInfo,
                                        playerId: _playerId,
                                        fromClub: false,
                                    })
                                }
                            })




                            // this.nav.push(BookingClubListPage, {
                            //     bookingListType: _bookingListType,
                            //     clubTeeTimeSlotList: clubTeeTimeSlots,
                            //     fromTime: _fromTime,
                            //     toTime: _toTime,
                            //     startDate: _forDate,
                            //     courseInfo: this.courseInfo,
                            //     clubInfo: this.clubInfo
                            // })
                        } else {
                            let _message = 'No Tee Time slots for <br>Date : ' + _forDate + '<br>From '+_fromTime + ' to ' + _toTime;
                            let alert = this.alertCtrl.create({
                                title: 'Search by All Club(s)',
                                // subTitle: 'Selected date is '+ _date,
                                message: _message, //'Selected date is ' + '<b>' + _date + '</b>',
                                buttons: ['Close']
                            });
                            alert.present();
                            this.loader.dismiss();
                        }
                    }
                    
                })
                
            }, (error)=>{
                let _error = error.json();
                if(error.status === 409) {
                    let _message = _error.errors[0].includes('favorite clubs')?'No Favourite clubs found. Please tap on SET UP to define your favourites.':_error.errors[0];
                    let alert = this.alertCtrl.create({
                        title: 'Search by Favourite Club(s)',
                        // subTitle: 'Selected date is '+ _date,
                        message: _message, //'Selected date is ' + '<b>' + _date + '</b>',
                        buttons: ['Close']
                    });
                    alert.present();
                }
                console.log("fav club error ", _error)
                
                this.loader.dismiss();
            }, ()=>{
                setTimeout(()=>{
                    this.loader.dismiss()
                }, 5000)
            })
        }
        
        // 310510219 afamosa course id
    });
        
    }

    onBookNow() {
        let _clubName = this.clubInfo.clubName;
        let _teeOffTime = moment(this.fromTime, "HH:mm:ss").format("hh:mm A");
        let _teeOffDate = moment(this.startDate).format("ddd, DD MMM YYYY")
        let _holdDate = moment(this.startDate).subtract(1, 'days').format("ddd, DD MMM YYYY");
        // let _Oldmessage = `You have requested to book the following:<br>

        // <br>Club: `+ _clubName + `
        // <br>Date: ` + _teeOffDate  +`
        // <br>Time: ` + _teeOffTime + `<br><br>

        // Your booking will be held until `+ _holdDate +` at `+_teeOffTime+`.<br>
        // You will need to make payment on myGolf2u to secure this booking.<br><br>

        // To confirm your booking Tap Confirm, to cancel tap Not Now.`;

        // let _message = _clubName + `
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
            buttons: [{
                    text: 'Not Now',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Confirm',
                    handler: () => {
                        console.log('Buy clicked');
                        this._goBookNow();
                    }
                }
            ]
        });
        alert.present();
    }



    goQuickBook() {
        if(this.selectClubType !== 'single') {
            let _message = 'Please select a club'
            let alert = this.alertCtrl.create({
                title: 'Quick book option',
                // subTitle: 'Selected date is '+ _date,
                message: _message, //'Selected date is ' + '<b>' + _date + '</b>',
                buttons: ['Close']
            });
            alert.present();
            return false;
        }
        if((!this.clubInfo || !this.courseInfo)) {
            let _message = 'Please select a club'
            let alert = this.alertCtrl.create({
                title: 'Quick book option',
                // subTitle: 'Selected date is '+ _date,
                message: _message, //'Selected date is ' + '<b>' + _date + '</b>',
                buttons: ['Close']
            });
            alert.present();
            return false;
        }

        this.onBookNow();

        // this.checkClubBookingOption();

    }

    _goBookNow() {
        let _totalPlayers = 1;//this.teeTimeSlotDisplay.slot.maxPlayers;
        let _teeOffDate = moment(this.startDate).format("YYYY-MM-DD");
        let _fromTime = moment(this.fromTime, "HH:mm:ss").format("HH:mm");
        let _toTime = moment(this.toTime, "HH:mm:ss").format("HH:mm");
        // let _currDateTime = moment().toISOString(); //format("YYYY-MM-DDTHH:mmZ");
        // this.myTime = moment(this.prs.startTime,"HH:mm:ss").format("YYYY-MM-DDTHH:mmZ");
        let _ninesPlaying = parseInt("2");//parseInt(this.holesPlayed);

        // let _bookingName  =

        // let _toHour = parseInt(moment(_fromTime).format("HH"))
        // let _toMinute = parseInt(moment(_fromTime).format("mm"));


        let _bookingName;
        let _bookingEmail;
        let _bookingPhone;
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

        // console.log("go book now : ", _teeOffDate, _fromTime, this.teeTimeSlotDisplay.slot.teeOffTime, _toTime)

        // .format("YYYY-MM-DDTHH:mmZ")
        // moment(this.teeTime,"YYYY-MM-DDTHH:mm:ssZ").format("HH:mm");

        let reqBookSlot = {
            // "courseId": _courseId,
            "clubId": this.clubInfo.clubId,
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
            "buggyRequired": 0,
            "caddiesRequired": 0,
            "ninesPlaying": _ninesPlaying,
            "bookingName": _bookingName,
            "bookingEmail": _bookingEmail,
            "bookingPhone": _bookingPhone,
            "bookingRequestedAt": null
        }


        // this.flightService.bookTeeTimeSlot(reqBookSlot,this.bookerPlaying)
        //     .subscribe((data: any) => {


        this.flightService.bookTeeTimeSlot(reqBookSlot,true, this.captchaResponse)
        .subscribe((data: any) => {
            console.log("go quick book : ",data)
            if(data) {
                let _message = `Thank you for booking with myGolf2u.<br> Please see 'My Bookings' for details.<br>
            Before making payment you will need to add players and complete all mandatory options.`
                if (data.status === 200) {
                    let alert = this.alertCtrl.create({
                        title: 'Booking In Process',
                        // subTitle: 'Selected date is '+ _date,
                        message: _message, //'Selected date is ' + '<b>' + _date + '</b>',
                        buttons: [
                            {
                                text: 'Close',
                            },
                            {
                            text: 'Go to My Bookings',
                            handler: () => {
                                this.setBookingType(2);
                                this.togglePanel(1,true);
                                // this.refreshBookingHome();
                                // this.nav.push(BookingHomePage, {
                                //     fromBookNow: true
                                // })
                            }
                        }
                    ]
                    });
                    alert.present();
                }
            }
        })
    }

    onSelectTimes() {
        let times = this.modalCtl.create(SelectDatesPage, {
            type: 'times',
            range: true,
            fromTime: this.fromTime,
            toTime: this.toTime,
        });

        times.onDidDismiss((data: any) => {
            if(data) {
                this.fromTime = data.fromTime;
                this.toTime = data.toTime;
            }
        });

        times.present();
    }

    onSelectDates() {
        let dates = this.modalCtl.create(SelectDatesPage, {
            type: 'dates',
            range: false,
            startDate: this.startDate,
            endDate: this.endDate
        });

        dates.onDidDismiss((data: any) => {
            if(data) {
                this.startDate = data.startDate;
                this.endDate = data.endDate;
            }
        });

        dates.present();
    }

    getClubName(): string {
        let clubName = 'Tap here to select a club';
        // console.log("getClubName()", this.clubInfo)
        if (this.clubInfo && this.clubInfo.clubName) return this.clubInfo.clubName;
        else return clubName;
    }

    clearClubSelection() {
        this.clubInfo = createClubInfo();
    }

    getCourseName(): string {
        let courseName = 'Tap here';
        // console.log("getClubName()", this.clubInfo)
        // return courseName;
        if (this.courseInfo && this.courseInfo.courseName) return this.courseInfo.courseName;
        else return courseName;
    }

    goCoursePicklist() {
        let _courseId;
        let _courseName;
        // console.log("Analysis Type:", this.analysisType)
        // console.log("Check:before", this.checkboxCourse)
        if (1) {
            // this.nav.push(PerformanceClubListPage);
            /*, {
             courseId: this.courseId,
             courseName: this.courseName
             });*/
            // console.log("Check:", this.checkboxCourse)
            let club = this.modalCtl.create(RecentClubListPage, {
                //analysisType: "analysis",
                courseInfo: this.courseInfo,
                openedModal: true,
                courseType: this.courseType,
                clubInfo: this.clubInfo

            });

            if (this.courseType == 'course') {
                club.onDidDismiss((data: any) => {
                    if (!data) {
                        return false;
                    }
                    if (data.apply) {
                        this.courseInfo = data.courseInfo;
                        this.clubInfo = data.clubInfo;
                        console.log("Type course:clubinfo", data.clubInfo)
                        // this.clubName = clubName;
                        // this.clubName = clubInfo.clubName;
                        _courseId = this.courseInfo.courseId;
                        _courseName = this.courseInfo.courseName;
                    }

                });

            } else if (this.courseType == 'club') {
                club.onDidDismiss((data: any) => {
                    if (data.clubInfo) {
                        this.clubInfo = data.clubInfo;
                        this.courseInfo = createCourseInfo();
                    }
                    // this.clubName = this.clubInfo.clubName;
                    console.log("Type club", this.courseType)
                    console.log("club infO?", this.clubInfo)
                });

            }
            club.present();
        }
        else {
            _courseId = null;
            _courseName = 'Please choose a course';
            // console.log("Checkbox:", this.checkboxCourse)

        }

    }

    getCurrentLocation() {
        console.log("Get curr loc - starts")
        
        let lat1 = this.geo.getLatitude();
        let lon1 = this.geo.getLongitude();
        console.log("get curr loc : ", lat1, lon1);
    }

    setupFavClubs() {
            this.nav.push(FavouriteListPage);
        // let _message = ';';
        // let alert = this.alertCtrl.create({
        //     title: 'Setup Fav Clubs',
        //     // subTitle: 'Selected date is '+ _date,
        //     message: _message, //'Selected date is ' + '<b>' + _date + '</b>',
        //     buttons: ['Close']
        // });
        // alert.present();
    }
    
    getClubImage(club: ClubInfo) {

        if(club) return club.clubImage;
        else 'img/default_club.png'
    }

    refreshActiveBooking() {
        this.refresher = true;
        this.bookingByPlayerList = [];
        this.loader = this.loadingCtrl.create({
            showBackdrop: false
        });
        
        let _playerId;
        if(this.userType === 'player') {
            this.playerHomeInfo$      = this.playerHomeService.playerHomeInfo();
            this.player$              = this.playerHomeInfo$
                                            .filter(Boolean)
                                            .map((playerHome: PlayerHomeInfo) => playerHome.player);
        this.player$.take(1).subscribe((player: PlayerInfo) => {
            _playerId = player.playerId
        });
        }
        
        

        // subtract(7,'days').
        let _fromDate = moment().format("YYYY-MM-DD"); //moment(this.startDate).format("YYYY-MM-DD");
        this.activeDateSince = _fromDate;

        this.flightService.getBookingByPlayer(_playerId,_fromDate)
        .subscribe((bookingByPlayerList: Array<TeeTimeBooking>) => {
            this.loader.dismiss().then(()=>{
                this.refresher = false;
                if(bookingByPlayerList.length > 0 ) {
                    
                    bookingByPlayerList.sort((a,b) => {
                        if(a.slotAssigned.teeOffDate == b.slotAssigned.teeOffDate)
                        {
                            return (a.slotAssigned.teeOffTime < b.slotAssigned.teeOffTime) ? -1 : (a.slotAssigned.teeOffTime > b.slotAssigned.teeOffTime) ? 1 : 0;
                        }
                        else
                        {
                            return (a.slotAssigned.teeOffDate < b.slotAssigned.teeOffDate) ? -1 : 1;
                        }


                        // if(a.slotAssigned.teeOffDate < b.slotAssigned.teeOffDate)
                        //     return -1;
                        // else if(a.slotAssigned.teeOffDate > b.slotAssigned.teeOffDate)
                        //     return 1;
                        // else 0;
                    })

                    this.bookingByPlayerList = bookingByPlayerList.filter((tb: TeeTimeBooking)=>{
                        return tb.bookingStatus === 'Booked' || tb.bookingStatus === 'PaymentPartial' || tb.bookingStatus === 'Secured' || tb.bookingStatus === 'PaymentFull'
                    });

                    // for(let x = 1; x < 40; x++) {
                    //     this.bookingByPlayerList.push(...bookingByPlayerList)
                    // }
                    // bookingByPlayerList;

                    


                    console.log("get booking by player internal : ",bookingByPlayerList)
                    console.log("get booking by player : ", this.bookingByPlayerList)
                }
            })
            
        }, (error)=>{
            console.log("refresh active booking error ", error)
            // if(error.status===0) {

                MessageDisplayUtil.showMessageToast('Error connecting to server. Please refresh.', 
                                          this.platform, this.toastCtl,3000, "bottom")
            // }
            this.errorMessage = 'Error connecting to server. Tap here to refresh.'
            this.loader.dismiss();
            this.refresher = false;
        })
    }

    refreshInvitedBooking() {
        this.refresherInvited = true;
        this.invitedBookingForPlayerList = [];
        this.loader = this.loadingCtrl.create({
            showBackdrop: false
        });
        
        let _playerId;
        if(this.userType === 'player') {
            this.playerHomeInfo$      = this.playerHomeService.playerHomeInfo();
            this.player$              = this.playerHomeInfo$
                                            .filter(Boolean)
                                            .map((playerHome: PlayerHomeInfo) => playerHome.player);
        this.player$.take(1).subscribe((player: PlayerInfo) => {
            _playerId = player.playerId
        });
        }
        
        

        // subtract(7,'days').
        let _fromDate = moment().format("YYYY-MM-DD"); //moment(this.startDate).format("YYYY-MM-DD");
        this.activeDateSince = _fromDate;

        this.flightService.getBookingForPlayer(_playerId,_fromDate)
        .subscribe((invitedBookingForPlayerList: Array<TeeTimeBooking>) => {
            this.loader.dismiss().then(()=>{
                this.refresherInvited = false;
                if(invitedBookingForPlayerList.length > 0 ) {
                    
                    invitedBookingForPlayerList.sort((a,b) => {
                        if(a.slotAssigned.teeOffDate == b.slotAssigned.teeOffDate)
                        {
                            return (a.slotAssigned.teeOffTime < b.slotAssigned.teeOffTime) ? -1 : (a.slotAssigned.teeOffTime > b.slotAssigned.teeOffTime) ? 1 : 0;
                        }
                        else
                        {
                            return (a.slotAssigned.teeOffDate < b.slotAssigned.teeOffDate) ? -1 : 1;
                        }


                        // if(a.slotAssigned.teeOffDate < b.slotAssigned.teeOffDate)
                        //     return -1;
                        // else if(a.slotAssigned.teeOffDate > b.slotAssigned.teeOffDate)
                        //     return 1;
                        // else 0;
                    })

                    this.invitedBookingForPlayerList = invitedBookingForPlayerList.filter((tb: TeeTimeBooking)=>{
                        return (tb.bookingStatus === 'Booked' || tb.bookingStatus === 'PaymentPartial' || tb.bookingStatus === 'Secured' || tb.bookingStatus === 'PaymentFull' )
                        && (tb.bookedByPlayer && tb.bookedByPlayer.id !== _playerId || tb.bookedByUser)
                    })

                    this.invitedBookingForPlayerList = this.invitedBookingForPlayerList.filter((tb: TeeTimeBooking)=>{
                        let _hasPlayer = tb.bookingPlayers.filter((p)=>{
                            if(p.player)
                            return p.player.id === _playerId && !p.playerRemoved
                        })
                        if(_hasPlayer && _hasPlayer.length > 0) return true
                        else return false;
                    })
                    // bookingByPlayerList;

                    


                    console.log("get booking by player internal : ",invitedBookingForPlayerList)
                    console.log("get booking by player : ", this.invitedBookingForPlayerList)
                }
            })
            
        }, (error)=>{
            console.log("refresh active booking error ", error)
            // if(error.status===0) {

                MessageDisplayUtil.showMessageToast('Error connecting to server. Please refresh.', 
                                          this.platform, this.toastCtl,3000, "bottom")
            // }
            this.errorMessage = 'Error connecting to server. Tap here to refresh.'
            this.loader.dismiss();
            this.refresherInvited = false;
        })
    }

    refreshPastBooking() {
        this.refresherPast = true;
        this.pastBookingByPlayerList = [];
        this.loader = this.loadingCtrl.create({
            showBackdrop: false
        });
        
        let _playerId;
        if(this.userType === 'player') {
            this.playerHomeInfo$      = this.playerHomeService.playerHomeInfo();
            this.player$              = this.playerHomeInfo$
                                            .filter(Boolean)
                                            .map((playerHome: PlayerHomeInfo) => playerHome.player);
        this.player$.take(1).subscribe((player: PlayerInfo) => {
            _playerId = player.playerId
        });
        console.log("user type ", this.userType)
        }
        // this.playerHomeInfo$      = this.playerHomeService.playerHomeInfo();
        // this.player$.take(1).subscribe((player: PlayerInfo) => {
        //     _playerId = player.playerId
        // });

        // subtract(7,'days').
        let _fromDate = moment().subtract(7,'days').format("YYYY-MM-DD"); //moment(this.startDate).format("YYYY-MM-DD");
        this.activeDateSince = _fromDate;

        this.flightService.getBookingByPlayer(_playerId,_fromDate)
        .subscribe((pastBookingByPlayerList: Array<TeeTimeBooking>) => {
            this.loader.dismiss().then(()=>{
                this.refresherPast = false;
                
                console.log("get past booking by player before : ", this.pastBookingByPlayerList)
                if(pastBookingByPlayerList.length > 0 ) {
                    this.pastBookingByPlayerList = pastBookingByPlayerList;

                    let _pastBookings;
                    this.pastBookingByPlayerList.sort((a,b) => {
                        if(a.slotAssigned.teeOffDate == b.slotAssigned.teeOffDate)
                        {
                            return (a.slotAssigned.teeOffTime < b.slotAssigned.teeOffTime) ? 1 : (a.slotAssigned.teeOffTime > b.slotAssigned.teeOffTime) ? -1 : 0;
                        }
                        else
                        {
                            return (a.slotAssigned.teeOffDate < b.slotAssigned.teeOffDate) ? 1 : -1;
                        }
                        // if(a.slotAssigned.teeOffDate < b.slotAssigned.teeOffDate)
                        //     return 1;
                        // else if(a.slotAssigned.teeOffDate > b.slotAssigned.teeOffDate)
                        //     return -1;
                        // else 0; 
                    });
                    let _today = moment().format('YYYY-MM-DD');
                    this.pastBookingByPlayerList = this.pastBookingByPlayerList.filter((tb: TeeTimeBooking)=>{
                        // "Secured" | "CancelledByPlayer" | "CancelledByClub" | "PaymentPartial" | "PaymentFull" | "FlightRegistered"
                        return tb.bookingStatus !== 'CancelledByPlayer' && tb.bookingStatus !== 'CancelledByClub'
                    })
                    
                    this.pastBookingByPlayerList = this.pastBookingByPlayerList.filter((t)=>{
                        console.log('filtered ', t.slotAssigned.teeOffDate, _today)
                        return moment(t.slotAssigned.teeOffDate,'YYYY-MM-DD').format('YYYY-MM-DD') < _today;
                    }).map((t)=>{
                        return t
                    });

                    
                    this.pastBookingByPlayerList = this.pastBookingByPlayerList.filter((tb: TeeTimeBooking)=>{
                        let _hasPlayer = tb.bookingPlayers.filter((p)=>{
                            if(p.player)
                            return p.player.id === _playerId && !p.playerRemoved
                        })
                        if(_hasPlayer && _hasPlayer.length > 0) return true
                        else return false;
                    })

                    // _pastBookings.forEach((t)=>{
                    //     console.log("get past booking date : ", t.slotAssigned.teeOffDate)
                    // })
                    console.log("get past booking by player after : ", _pastBookings, this.pastBookingByPlayerList)
                }
            })
            
        }, (error)=>{
            this.loader.dismiss();
            this.refresherPast = false;
        })
    }

    refreshCancelBooking() {
        this.refresherCancel = true;
        this.cancelledBookingByPlayerList = [];
        this.loader = this.loadingCtrl.create({
            showBackdrop: false
        });
        
        let _playerId;
        
        if(this.userType === 'player') {
            this.playerHomeInfo$      = this.playerHomeService.playerHomeInfo();
            this.player$              = this.playerHomeInfo$
                                            .filter(Boolean)
                                            .map((playerHome: PlayerHomeInfo) => playerHome.player);
        }
        // this.player$.take(1).subscribe((player: PlayerInfo) => {
        //     _playerId = player.playerId
        // });
        // console.log("user type ", this.userType)
        this.playerHomeInfo$      = this.playerHomeService.playerHomeInfo();
        this.player$.take(1).subscribe((player: PlayerInfo) => {
            _playerId = player.playerId
        });

        // subtract(7,'days').
        let _fromDate = moment().subtract(7,'days').format("YYYY-MM-DD"); //moment(this.startDate).format("YYYY-MM-DD");
        this.activeDateSince = _fromDate;

        this.flightService.getBookingByPlayer(_playerId,_fromDate)
        .subscribe((cancelledBookingByPlayerList: Array<TeeTimeBooking>) => {
            this.loader.dismiss().then(()=>{
                this.refresherCancel = false;
                
                console.log("get past booking by player before : ", this.cancelledBookingByPlayerList)
                if(cancelledBookingByPlayerList.length > 0 ) {
                    // this.cancelledBookingByPlayerList = 
                    cancelledBookingByPlayerList;

                    let _cancelBookings;
                    cancelledBookingByPlayerList.sort((a,b) => {
                        if(a.slotAssigned.teeOffDate == b.slotAssigned.teeOffDate)
                        {
                            return (a.slotAssigned.teeOffTime < b.slotAssigned.teeOffTime) ? 1 : (a.slotAssigned.teeOffTime > b.slotAssigned.teeOffTime) ? -1 : 0;
                        }
                        else
                        {
                            return (a.slotAssigned.teeOffDate < b.slotAssigned.teeOffDate) ? 1 : -1;
                        }
                        // if(a.slotAssigned.teeOffDate < b.slotAssigned.teeOffDate)
                        //     return 1;
                        // else if(a.slotAssigned.teeOffDate > b.slotAssigned.teeOffDate)
                        //     return -1;
                        // else 0; 
                    });
                    // let _today = moment().format('YYYY-MM-DD');

                    this.cancelledBookingByPlayerList = cancelledBookingByPlayerList.filter((tb: TeeTimeBooking)=>{
                        // "Secured" | "CancelledByPlayer" | "CancelledByClub" | "PaymentPartial" | "PaymentFull" | "FlightRegistered"
                        return tb.bookingStatus === 'CancelledByPlayer' || tb.bookingStatus === 'CancelledByClub'
                    })
                    // .filter((t)=>{
                    //     console.log('cancel filtered ', t, _today)
                    //     return moment(t.slotAssigned.teeOffDate,'YYYY-MM-DD').format('YYYY-MM-DD') <= _today;
                    // })
                    .map((t)=>{
                        return t
                    })

                    
                    this.cancelledBookingByPlayerList = this.cancelledBookingByPlayerList.filter((tb: TeeTimeBooking)=>{
                        let _hasPlayer = tb.bookingPlayers.filter((p)=>{
                            if(p.player) return p.player.id === _playerId && !p.playerRemoved
                        })
                        if(_hasPlayer && _hasPlayer.length > 0) return true
                        else return false;
                    })

                    // this.cancelledBookingByPlayerList = this.cancelledBookingByPlayerList

                    // _pastBookings.forEach((t)=>{
                    //     console.log("get past booking date : ", t.slotAssigned.teeOffDate)
                    // })
                    console.log("get cancel booking by player after : ", _cancelBookings, this.cancelledBookingByPlayerList)
                }
            })
            
        }, (error)=>{
            this.loader.dismiss();
            this.refresherCancel = false;
        })
    }

    refreshHistoryBooking(pageNo?: number) {
        this.refresherPast = true;
        this.pastBookingByPlayerList = [];
        this.loader = this.loadingCtrl.create({
            showBackdrop: false
        });
        
        let _playerId;
        if(this.userType === 'player') {
            this.playerHomeInfo$      = this.playerHomeService.playerHomeInfo();
            this.player$              = this.playerHomeInfo$
                                            .filter(Boolean)
                                            .map((playerHome: PlayerHomeInfo) => playerHome.player);
        this.player$.take(1).subscribe((player: PlayerInfo) => {
            _playerId = player.playerId
        });
        console.log("user type ", this.userType)
        }
        // this.playerHomeInfo$      = this.playerHomeService.playerHomeInfo();
        // this.player$.take(1).subscribe((player: PlayerInfo) => {
        //     _playerId = player.playerId
        // });

        // subtract(7,'days').
        let _fromDate;
        let _toDate; 
        if(this.historyMonthly) {
            _fromDate = moment(this.histPastDate).startOf('month').format("YYYY-MM-DD");
            if(moment(this.histPastDate).format("YYYY-MM") === moment().format("YYYY-MM")) {
                _toDate = moment().add(-1,'days').format("YYYY-MM-DD");
            } else _toDate = moment(this.histPastDate).endOf('month').format("YYYY-MM-DD");
            
        } else if(!this.historyMonthly) {
            _fromDate = this.histStartDate;
            _toDate = this.histEndDate;
        }
        
        this.activeDateSince = _fromDate;

        let _clubId = null;
        let _statusType = 'A'; //(A)ctive, (I)nactive, (B)oth
        let _statusList: Array<string> = [];
        let _courseId = null;
        let _search = '';
        let _pageSize = null;
        let _pageNo = null;
        if(pageNo) _pageNo = pageNo;
        this.flightService.searchBookingPlayer(_playerId,_clubId,_fromDate, _toDate,
            _statusType, _statusList, _courseId, _search, _pageSize, _pageNo)
        .subscribe((dataPlayerBookingList: PagedData<TeeTimeBooking>) => {
            this.historyPlayerBookingList = dataPlayerBookingList;
            this.historyCurrentPage = dataPlayerBookingList.currentPage;
            this.historyTotalPages = dataPlayerBookingList.totalPages;
            this.historyTotalItems = dataPlayerBookingList.totalItems;
            this.historyPageSize = dataPlayerBookingList.totalInPage;
            let pastBookingByPlayerList: Array<TeeTimeBooking> = dataPlayerBookingList.items;
            this.loader.dismiss().then(()=>{
                this.refresherPast = false;
                
                console.log("get past booking by player before : ", this.pastBookingByPlayerList)
                if(pastBookingByPlayerList.length > 0 ) {
                    this.pastBookingByPlayerList = pastBookingByPlayerList;

                    let _pastBookings;
                    this.pastBookingByPlayerList.sort((a,b) => {
                        if(a.slotAssigned.teeOffDate == b.slotAssigned.teeOffDate)
                        {
                            return (a.slotAssigned.teeOffTime < b.slotAssigned.teeOffTime) ? 1 : (a.slotAssigned.teeOffTime > b.slotAssigned.teeOffTime) ? -1 : 0;
                        }
                        else
                        {
                            return (a.slotAssigned.teeOffDate < b.slotAssigned.teeOffDate) ? -1 : 1;
                        }
                        // if(a.slotAssigned.teeOffDate < b.slotAssigned.teeOffDate)
                        //     return 1;
                        // else if(a.slotAssigned.teeOffDate > b.slotAssigned.teeOffDate)
                        //     return -1;
                        // else 0; 
                    });
                    let _today = moment().format('YYYY-MM-DD');
                    // this.pastBookingByPlayerList = this.pastBookingByPlayerList.filter((tb: TeeTimeBooking)=>{
                    //     // "Secured" | "CancelledByPlayer" | "CancelledByClub" | "PaymentPartial" | "PaymentFull" | "FlightRegistered"
                    //     return tb.bookingStatus !== 'CancelledByPlayer' && tb.bookingStatus !== 'CancelledByClub'
                    // })
                    
                    this.pastBookingByPlayerList = this.pastBookingByPlayerList.filter((t)=>{
                        console.log('filtered ', t.slotAssigned.teeOffDate, _today)
                        return moment(t.slotAssigned.teeOffDate,'YYYY-MM-DD').format('YYYY-MM-DD') <= _today;
                    }).map((t)=>{
                        return t 
                    });

                    
                    this.pastBookingByPlayerList = this.pastBookingByPlayerList.filter((tb: TeeTimeBooking)=>{
                        let _hasPlayer = tb.bookingPlayers.filter((p)=>{
                            if(p.player)
                            return p.player.id === _playerId && !p.playerRemoved
                        })
                        if(_hasPlayer && _hasPlayer.length > 0) return true
                        else return false;
                    })

                    // _pastBookings.forEach((t)=>{
                    //     console.log("get past booking date : ", t.slotAssigned.teeOffDate)
                    // })
                    console.log("get past booking by player after : ", _pastBookings, this.pastBookingByPlayerList)
                }
            })
            
        }, (error)=>{
            this.loader.dismiss();
            this.refresherPast = false;
        })
    }


    getBookingDetails(x: TeeTimeBooking, attribute?: string) {
        let _bookingDetails = x;
        let _slot = _bookingDetails.slotAssigned;
        // console.log("booking details", x)
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
                                    case 'courseName':
                                        return _bookingDetails.slotAssigned.startCourse.name;
                                        case 'playerCount':
                                            let _removedPlayers;
                                            if(_bookingDetails.bookingPlayers)
                                            _removedPlayers = _bookingDetails.bookingPlayers.filter((p)=>{
                                                return p.playerRemoved;
                                            });
                                            return _bookingDetails.bookingPlayers?_bookingDetails.bookingPlayers.length - _removedPlayers.length :'';
                                            // '('+_bookingDetails.bookingPlayers.length+')'
                                            case 'currency':
                                                return _bookingDetails.slotAssigned.currency.symbol;
                                            case 'amountPayable':
                                                let _total = Number((_bookingDetails.amountPayable - _bookingDetails.totalDeductions).toFixed(2));
                                                
                                                console.log("amount payable", _total)
                                                let _amount = String(_total)
                                                let _amtTxt;
                                                if(_total <= 999999 && 
                                                    (String(_total).split(".")[1] && String(_total).split(".")[1].length < 2))
                                                    _amtTxt = this.numberWithCommas(_total) + "0";
                                                    else if(_total > 999999) _amtTxt =  this.numberWithCommas(_amount.split(".")[0]);
                                                    else _amtTxt = this.numberWithCommas(_total)
                                                // if(_bookingDetails.amountPayable > 999999)
                                                //     _amtTxt =  this.numberWithCommas(_amount.split(".")[0]);
                                                // _amtTxt = this.numberWithCommas(_bookingDetails.amountPayable);
                                                return _amtTxt
                                            case 'whichNine':
                                                let _whichNine = 0;
                                                if(_bookingDetails.ninesPlayed && _bookingDetails.ninesPlayed > 0 )
                                                    _whichNine = _bookingDetails.ninesPlayed * 9;
                                                return _whichNine;
        }
    }

    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    getActiveBookingDetails(attribute?: string) {
        switch(attribute) {
            case 'date':
                return "&nbsp;* since "+ moment(this.activeDateSince).format("ddd, DD MMM YYYY");

        }
    }

    moreSlots(type?: string) {
        if(type==='active' || !type) {
            this.toggleSlots = !this.toggleSlots;
            this.togglePastSlots = false;
            this.toggleCancelSlots = false;
            this.toggleInvitedSlots = false;
        } else if(type === 'past') {
            this.toggleSlots = false;
            this.toggleCancelSlots = false;
            this.togglePastSlots = !this.togglePastSlots;
            this.toggleInvitedSlots = false;
        } else if(type === 'cancel') {
            this.toggleSlots = false;
            this.togglePastSlots = false;
            this.toggleCancelSlots = !this.toggleCancelSlots;
            this.toggleInvitedSlots = false;
        } else if(type === 'invited') {
            this.toggleSlots = false;
            this.togglePastSlots = false;
            this.toggleCancelSlots = false;
            this.toggleInvitedSlots = !this.toggleInvitedSlots;
        }
        // console.log(this.toggleSlots)
    }

    checkClubBookingOption() {
        this.flightService.getClubBookingOptions(this.clubInfo.clubId, this.startDate)
        .subscribe((bookOpts: TeeTimeBookingOptions) =>{
            console.log("Booking Options for club - ", this.clubInfo.clubId, " Dated - ", this.startDate, " : ",bookOpts);
            if(bookOpts) {
                this.currentMaxBooking = bookOpts.maxUnpaidBookings;
                this.checkCurrentMaxBooking();
            }
        })

        // this.onBookNow()
    }

    checkCurrentMaxBooking() {
        let _playerId;
        this.player$.take(1).subscribe((player: PlayerInfo) => {
            _playerId = player.playerId
        });

        let _fromDate = moment().format("YYYY-MM-DD");

        let _current;
        this.flightService.getBookingByPlayer(_playerId,this.startDate)
        .subscribe((bookingByPlayerList: Array<TeeTimeBooking>) => {
            this.loader.dismiss().then(()=>{
                this.refresher = false;
                if(bookingByPlayerList.length > 0 ) {
                    // this.bookingByPlayerList = bookingByPlayerList;
                    _current = bookingByPlayerList.filter((tb: TeeTimeBooking) =>{
                        return moment(tb.slotAssigned.teeOffDate).format("YYYY-MM-DD") === this.startDate
                    }).filter((tb:TeeTimeBooking)=>{
                        return tb.bookingStatus === 'Booked' || tb.bookingStatus === 'PaymentPartial' || tb.bookingStatus === 'Secured'
                    })
                    console.log("get booking by player - check booking opts : ", _current)
                    if(_current.length >= this.currentMaxBooking) {
                        let alert = this.alertCtrl.create({
                            title: 'Unpaid booking exceeded',
                            // subTitle: 'Selected date is '+ _date,
                            message: 'You have unpaid booking(s). Please pay booking for this date : '+this.startDate, //'Selected date is ' + '<b>' + _date + '</b>',
                            buttons: ['Close']
                        });
                        alert.present();
                    } else this.onBookNow();
                } else this.onBookNow();
            })
            
        });
    }

    togglePanel(panel: number, fromQuickBook?: boolean) {
        // this.toggleActivePanel = false;
        // this.togglePastPanel = false;
        // this.toggleCancelPanel = false;
        // this.toggleInvitedPanel = false;
        if(panel === 1) {
            this.togglePastPanel = false;
            this.toggleCancelPanel = false;
            this.toggleInvitedPanel = false;
            if(fromQuickBook) this.toggleActivePanel = true;
            else this.toggleActivePanel = !this.toggleActivePanel;
        }
        else if(panel === 2) {
            this.toggleActivePanel = false;
            this.togglePastPanel = !this.togglePastPanel;
            this.toggleCancelPanel = false;
            this.toggleInvitedPanel = false;
            // this.togglePastPanel = true;
        } 
        else if(panel === 3) {
            
            this.toggleActivePanel = false;
            this.togglePastPanel = false;
            this.toggleCancelPanel = !this.toggleCancelPanel;
            this.toggleInvitedPanel = false;
            // this.toggleCancelPanel = true;
        } 
        else if(panel === 4) {
            
            this.toggleActivePanel = false;
            this.togglePastPanel = false;
            this.toggleCancelPanel = false;
            this.toggleInvitedPanel = !this.toggleInvitedPanel;
            // this.toggleInvitedPanel = true;
        } 
        this.refreshBookingHome();
    }

    onHomeClick() {
        this.nav.popToRoot();//this.nav.setRoot(PlayerHomePage);
    }

    onMoreFilter() {
        this.nav.push(BookingSearchPage);
    }

    
    openProfile() {
        this.nav.push(ProfilePage, {
            type  : 'playerProfile',
            player: this.player$
        });
    }
    
    onFAQClick() {
        this.nav.push(FaqPage)
    }

    // zoomImage(data: any) {
    //     let _player: PlayerData = player.player?player.player:null;
    //     let imageZoom = this.modalCtl.create(ImageZoom, {
    //         image: _player && _player.image ? (_player.image?_player.image: _player.profile):''
    //     })

    //     imageZoom.onDidDismiss((data: any) => {});
    //     imageZoom.present();
    // }

    resolved(captchaResponse: string) {
        console.log(`Resolved captcha with response ${captchaResponse}:`);
        this.captchaResponse = captchaResponse;
        if(this.captchaResponse.length > 0) this.goQuickBook();
    }

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

    initServerStatus() {
        this.serverInfoService.serverInfo()
        .subscribe((data: ServerInfo)=>{
            console.log("init server status", data)
            if(data) {
                this.botsOut = data.botsOut;
                // this.botsOut = true;
            }
        });
        this.refreshFavouriteClubs();
    }

    onNotificationsClick() { 
        this.nav.push(NotificationsPage);
    }

    addDate(value) {
        // if(value < 0)
        let _date = this.startDate;
        _date = moment(_date).add(value, 'd').format("YYYY-MM-DD");
        console.log("startDate add", this.startDate + " adds " + value)
        if(_date < this.today) {
            MessageDisplayUtil.showMessageToast('Selecting earlier date is not allowed', 
            this.platform, this.toastCtl,3000, "bottom");
            return;
        } 
        this.startDate = _date;
    }

    getAppAttribute() { 
        console.log("[app attribute] : ")
        this.flightService.getAppAttributes()
        .subscribe((data: any)=>{
            console.log("[app attribute] : ", data)
            if(data) {
                data.filter((d)=>{
                    return d.page === 'bookingHome'
                }).map((d)=>{
                    this.appAttribute = d
                });
                if(this.appAttribute.filters) {
                    this.fromTime = this.appAttribute.filters.fromTime;
                    this.toTime = this.appAttribute.filters.toTime;
                    this.selectClubType = this.appAttribute.filters.selectClubType;
                }
                this.useHistorical = this.appAttribute.historical;
                if(this.appAttribute.enableNearby) this.enableNearby = this.appAttribute.enableNearby;
            }
        })
    }

    nextDate(type?: string) {
        let _pastMonth = moment(this.histPastDate).endOf('month').format('YYYY-MM-DD');
        console.log("Next date [0] : ",this.histPastDate, this.histNextMonth)
        console.log("Next date [1] : ",moment(_pastMonth).isSameOrAfter(moment(this.histNextMonth).endOf('month')))
        console.log("Next date [1] : ",moment(_pastMonth).isSameOrAfter(moment(this.histNextMonth).endOf('month'),'month'))
        console.log("Next date [2] : ",this.histPastDate, this.histNextMonth)

        if(type === 'past') this.histPastDate = moment(this.histPastDate).add(1, 'month').format("YYYY-MM-DD");
        else this.currentDate = moment(this.currentDate).add(1, 'days').format("YYYY-MM-DD");
    }

    prevDate(type?: string) {
        if(type === 'past') this.histPastDate = moment(this.histPastDate).subtract(1, 'month').format("YYYY-MM-DD");
        else this.currentDate = moment(this.currentDate).subtract(1, 'days').format("YYYY-MM-DD");
    }

    confirmDate(type?: string) {
        if(type === 'today') {
        } else if(type === 'future') {
        } else if(type === 'past') {
            // this.refreshPastBooking();
            this.refreshHistoryBooking();
        }
    }

    nextPage() {
        let _pastMonth = moment(this.histPastDate).endOf('month').format('YYYY-MM-DD');
        if (moment(_pastMonth).isSameOrAfter(moment(this.histNextMonth).endOf('month'),'month')) return false;
        else return true;
     
    }

    getHistoryPageNumber(count: number) {
        if(!this.historyTotalPages) return;
        if(!this.historyCurrentPage) return;
        return this.historyCurrentPage + count;
    }

    prevHistPage() {
        if(this.historyCurrentPage === 1) return;
        let _currPage = this.historyCurrentPage;
        this.refreshHistoryBooking(_currPage - 1);
    }

    nextHistPage() {
        if(this.historyCurrentPage >= this.historyTotalPages) return;
        let _currPage = this.historyCurrentPage;
        this.refreshHistoryBooking(_currPage + 1);
    }

    onSelectFacility() {
        let actionSheet = this.actionSheetCtl.create({
            buttons: [
                {
                    text   : 'Driving Range',
                    handler: () => {
                        actionSheet.dismiss()
                                   .then(() => {
                                       this.facilityTypeName = 'Driving Range'
                                   });
                        return false;
                    }
                }, {
                    text   : 'Tennis (Outdoor)',
                    handler: () => {
                        actionSheet.dismiss()
                                   .then(() => {
                                    this.facilityTypeName = 'Tennis'
                                   });
                        return false;
                    }
                }, {
                    text   : 'Squash (Indoor)',
                    handler: () => {
                        actionSheet.dismiss().then(() => {
                            this.facilityTypeName = 'Squash'
                        });
                        return false;
                    }
                }, {
                    text   : 'Meeting Hall',
                    handler: () => {
                        actionSheet.dismiss().then(() => {
                            this.facilityTypeName = 'Meeting Hall'
                        });
                        return false;
                    }
                }
            ]
        });
        actionSheet.addButton({
            text   : 'Cancel',
            role   : 'cancel', // will always sort to be on the bottom
            icon   : !this.platform.is('ios') ? 'close' : null,
            handler: () => {
                actionSheet.dismiss();
                return false;
            }
        });
        actionSheet.present();
    }
}
