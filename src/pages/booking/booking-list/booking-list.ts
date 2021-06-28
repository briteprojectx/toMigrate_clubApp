import {
    ActionSheetController,
    Events,
    LoadingController,
    ModalController,
    NavController,
    NavParams,
    Platform,
    AlertController,
    PopoverController
} from 'ionic-angular';
import {Keyboard} from '@ionic-native/keyboard';
import {Component, Renderer} from '@angular/core';
import {adjustViewZIndex} from '../../../globals';
import {
    createPlayerList,
    FriendRequest,
    FriendRequestList,
    // PlayerHomeInfo,
    PlayerInfo,
    PlayerList,
    PlayerHomeInfo
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

import * as moment from 'moment';
import { TeeTimeSlotDisplay, CourseInfo, ClubInfo, ClubTeeTimeSlots, ClubCourseData, TeeTimeClubVoucher, TeeTimeClubVoucherSeries, TeeTimeDiscount } from '../../../data/mygolf.data';
import { ClubFlightService } from '../../../providers/club-flight-service/club-flight-service';
import { SelectDatesPage } from '../../modal-screens/select-dates/select-dates';
import { PricesDisplayPage } from "../../modal-screens/prices-display/prices-display";
import { PlayerHomeDataService } from '../../../redux/player-home';
import { BookingHomePage } from '../booking-home/booking-home';
import { FaqPage } from '../../faq/faq';
import { NotificationsPage } from '../../notifications/notifications';
// import {JsonService} from '../../json-util';

@Component({
    templateUrl: 'booking-list.html',
    selector: 'booking-list-page'
})
export class BookingListPage {
    public friends: string = "friend";
    public friendType: string = "friend";
    public friendScreenName: string = "Friends";

    public teeTimeList: string = "byClubs";


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

    public refreshOnEnter: boolean = false;

    tabs: any;

    currentPage: number = 0;
    nameView: boolean = false;
    showAll: boolean = false;
    today: string;
    maxDate: string;
    currentDate: string;

    teeTimeSlotDisplayList: Array<TeeTimeSlotDisplay> = new Array<TeeTimeSlotDisplay>();
    filteredSlot: Array<TeeTimeSlotDisplay> = new Array<TeeTimeSlotDisplay>();
    slots: Array<TeeTimeSlotDisplay>;
    clubTeeTimeSlotList: Array<ClubTeeTimeSlots>;
    clubs: ClubTeeTimeSlots;

    bookingListType: string = '';

    clubCourseInfo: any;

    startDate: string = '';

    fromTime: string = '';
    toTime: string = '';

    clubId: number;
    courseId: number;

    courseInfo: CourseInfo;
    clubInfo: ClubInfo;

    toggleSlots: boolean = false;

    toggleAvailableBoolean: boolean = true;

    refresh: boolean = false;
    currentCourses: Array<ClubCourseData>;
    public playerHomeInfo$: Observable<PlayerHomeInfo>;
    public player$: Observable<PlayerInfo>;

    playerVoucher: Array<TeeTimeClubVoucher>;
    voucherSeries: Array<TeeTimeClubVoucherSeries>;
    clubDiscounts: Array<TeeTimeDiscount>;

    // playerVoucher: Array<TeeTimeClubVoucher>;

    // clubInfo: Club

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
        private popoverCtl: PopoverController,
        private playerHomeService: PlayerHomeDataService) {
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

        this.clubId = navParams.get("clubId");
        if(!this.clubId) this.clubId = 28101520; //mygolf2u golf club

        this.today = moment().format("YYYY-MM-DD");
        this.currentDate = moment().format("YYYY-MM-DD");

        this.bookingListType = navParams.get("bookingListType");
        if(this.bookingListType === 'single') {
            this.teeTimeSlotDisplayList = navParams.get("teeTimeSlotDisplayList");
            this.clubCourseInfo = this.teeTimeSlotDisplayList[0].slot.startCourse;
            this.fromTime = navParams.get("fromTime");
            this.toTime = navParams.get("toTime");
            this.startDate = navParams.get("startDate");
            if(this.startDate.length > 0) this.currentDate = this.startDate;
            this.clubInfo = navParams.get("clubInfo");
            this.courseInfo = navParams.get("courseInfo");
            // this.currentDate = navParams.get("currentDate");
            // this.filteredSlot.push(...this.teeTimeSlotDisplayList);
            this.filteredSlot = this.teeTimeSlotDisplayList;
        } else if (this.bookingListType === 'nearbyClubs') {

            this.currentDate = navParams.get("currentDate");
        } else if(this.bookingListType === 'favClubs') {
            // this.clubTeeTimeSlotList = navParams.get("clubTeeTimeSlotList");
            this.clubs = navParams.get("clubTeeTimeSlotList");
            this.slots = this.clubs.slots;
            // this.clubCourseInfo = this.teeTimeSlotDisplayList[0].slot.startCourse;
            this.fromTime = navParams.get("fromTime");
            this.toTime = navParams.get("toTime");
            this.startDate = navParams.get("startDate");
            if(this.startDate.length > 0) this.currentDate = this.startDate;
            this.clubInfo = navParams.get("clubInfo");
            this.courseInfo = navParams.get("courseInfo");
            this.currentDate = navParams.get("currentDate");
            console.log("Booking List - Club Tee : ", this.clubTeeTimeSlotList)
            // this.filteredSlot = this.teeTimeSlotDisplayList;
        }

        if(this.toggleAvailableBoolean) {
            if(this.bookingListType === 'favClubs') {
                this.filteredSlot = this.slots.filter((ts:TeeTimeSlotDisplay)=>{
                    return ts.available
                });
            } else if(this.bookingListType === 'single') {
                this.filteredSlot = this.teeTimeSlotDisplayList.filter((ts:TeeTimeSlotDisplay)=>{
                    return ts.available
                });
            }
            
        } else {
            // this.filteredSlot = [];
            if(this.bookingListType === 'single') this.filteredSlot = this.teeTimeSlotDisplayList;
            else if(this.bookingListType === 'favClubs') this.filteredSlot = this.slots;
        }

        

        console.log("Booking List for " + this.bookingListType + " : ", this.teeTimeSlotDisplayList)
        this.playerHomeInfo$      = this.playerHomeService.playerHomeInfo();
        this.player$              = this.playerHomeInfo$
                                        .filter(Boolean)
                                        .map((playerHome: PlayerHomeInfo) => playerHome.player);
        
        let _afterBook = this.navParams.get("afterBook");
        if(_afterBook) this.refreshTeeTimeSlot();
        console.log("after booking ", _afterBook, this.navParams.get("afterBook"))

        this.playerVoucher = this.navParams.get("playerVoucher");
        this.voucherSeries = this.navParams.get("voucherSeries");
        this.clubDiscounts = this.navParams.get("clubDiscounts")

        // start sorting club courses by displayorder
        let _courses: Array<ClubCourseData> = [];
        this.filteredSlot.forEach((ts: TeeTimeSlotDisplay)=>{
            // ts.slot.startCourse.indexOf()
            _courses.push(ts.slot.startCourse)
        });
        

        let _grpCourses;
        _grpCourses = _courses.reduce((a,b)=>{
            a[b.name] = [...a[b.name] || [],b]
            return a
        });

        this.currentCourses = this.getUnique(_courses,'id');
        this.currentCourses = this.currentCourses.sort((a,b)=>{
            if(a.displayOrder < b.displayOrder ) return -1;
            else if(a.displayOrder > b.displayOrder) return 1;
            else if(a.name < b.name) return -1
            else if(a.name > b.name) return 1
            else return 0;
        });
        // this.playerVoucher = this.navParams.get("playerVoucher");

        this.maxDate = moment().add(3, 'y').format("YYYY-MM-DD");




    }
    groupBy(objectArray, property) {
        return objectArray.reduce(function (acc, obj) {
          var key = obj[property];
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(obj);
          return acc;
        }, {});
      }

    ionViewDidLoad() {
        // this._refreshValues(null, null);
        let _courses: Array<ClubCourseData> = [];
        this.filteredSlot.forEach((ts: TeeTimeSlotDisplay)=>{
            // ts.slot.startCourse.indexOf()
            _courses.push(ts.slot.startCourse)
        });
        

        let _grpCourses;
        _grpCourses = _courses.reduce((a,b)=>{
            a[b.name] = [...a[b.name] || [],b]
            return a
        });

        this.currentCourses = this.getUnique(_courses,'id');
        this.currentCourses = this.currentCourses.sort((a,b)=>{
            if(a.displayOrder < b.displayOrder ) return -1;
            else if(a.displayOrder > b.displayOrder) return 1;
            else if(a.name < b.name) return -1
            else if(a.name > b.name) return 1
            else return 0;
        })

        // _courses.reduce((unique: ClubCourseData,item: ClubCourseData)=>{
        //     return (unique.id === item ? unique: [unique, item])
        //     // return unique.includes(item) ? unique : [...unique, item]
        // })
        // console.log("courses : ", _courses)
        // console.log("courses : ", _name(_courses))
        // console.log("courses : ",this.getUnique(_courses,'id'));
        // console.log("courses : ", this.clubCourseInfo, this.courseInfo, this.clubs)
    }

    getUnique(arr, comp) {

        // store the comparison  values in array
    const unique =  arr.map(e => e[comp])
    
            // store the indexes of the unique objects
            .map((e, i, final) => final.indexOf(e) === i && i)
    
            // eliminate the false indexes & return unique objects
            .filter((e) => arr[e]).map(e => arr[e]);
    
    return unique;
    }



    ionViewDidEnter() {
        let _afterBook = this.navParams.get("afterBook");
        if(_afterBook) this.refreshTeeTimeSlot();
        console.log("after booking ", _afterBook, this.navParams.get("afterBook"))
        if (this.refreshOnEnter)
            this._refreshValues(null, null);
        this.refreshOnEnter = false;
    }

    ionViewWillEnter() {
        adjustViewZIndex(this.nav, this.renderer);
    }

    refreshTeeTimeSlot() {
        console.log('refresh tee time slot - currentDate : ', this.currentDate);
        console.log('refresh tee time slot - bookingListType', this.bookingListType)
        // console.log('')
        this.refresh = true;
        let loader = this.loadingCtrl.create({
            showBackdrop: false
        });

        if(this.bookingListType === 'single') {
            // let _courseId = this.clubCourseInfo.id
            let _courseId = this.clubInfo?this.clubInfo.clubId:this.clubCourseInfo.id;
            this.teeTimeSlotDisplayList = [];
            let _forDate = this.currentDate;
            let _fromTime = this.fromTime;
            let _toTime = this.toTime;
            // console.log("single club - clubs : ", this.clubs)
            // console.log("single club - clubCourseInfo : ", this.clubCourseInfo)
            // console.log("single club - clubInfo : ", this.clubInfo)
            // console.log("single club - courseInfo : ", this.courseInfo)
            // console.log("single club - forDate : ", _forDate)
            this.flightService.getTeeTimeSlot(_forDate,true,_courseId,_fromTime,_toTime)
            .subscribe((teeTimeSlotDayDisplay: Array<TeeTimeSlotDisplay>) => {
                loader.dismiss().then(()=>{
                    this.refresh = false;
                    
                    if(teeTimeSlotDayDisplay) {
                        this.teeTimeSlotDisplayList = teeTimeSlotDayDisplay
                        if(this.toggleAvailableBoolean) {
                            this.filteredSlot = this.teeTimeSlotDisplayList.filter((ts:TeeTimeSlotDisplay)=>{
                                return ts.available
                            });
                        } else this.filteredSlot = this.teeTimeSlotDisplayList;
                        
                    }
                })
                // console.log("booking home @ "+ _forDate +" from "+ _fromTime + ' to ' + _toTime + " : ", teeTimeSlotDayDisplay)
                
            }, (error)=>{
                loader.dismiss();
            });
        } else if(this.bookingListType === 'favClubs') {
            let _clubId = this.clubs.club.id;
            this.teeTimeSlotDisplayList = [];
            let _forDate = this.currentDate;
            let _fromTime = this.fromTime;
            let _toTime = this.toTime;
            console.log("fav clubs - clubs : ", this.clubs)
            console.log("fav clubs - forDate : ", _forDate)
            this.flightService.getTeeTimeSlot(_forDate,true,_clubId,_fromTime,_toTime)
            .subscribe((teeTimeSlotDayDisplay: Array<TeeTimeSlotDisplay>) => {
                loader.dismiss().then(()=>{
                    this.refresh = false;
                    if(teeTimeSlotDayDisplay) {
                        this.slots = teeTimeSlotDayDisplay
                        if(this.toggleAvailableBoolean) {
                            this.filteredSlot = this.slots.filter((ts:TeeTimeSlotDisplay)=>{
                                return ts.available
                            });
                        } else this.filteredSlot = this.slots
                        
                        
                    }
                })
                // console.log("booking home @ "+ _forDate +" from "+ _fromTime + ' to ' + _toTime + " : ", teeTimeSlotDayDisplay)
                
            }, (error) => {
                loader.dismiss();
                this.refresh = false;
            });
        }

        console.log("refresh list ------------start-------------")
        console.log("booking list type ", this.bookingListType);
        console.log("toggle availabele  ", this.toggleAvailableBoolean);
        console.log("filtered Slot", this.filteredSlot)
        console.log("tee time slot", this.teeTimeSlotDisplayList)
        console.log("tee time slot", this.slots)
        console.log("refresh list ------------end-------------")
        
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
        console.log("Enter Refresh");

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
    
    onActiveBookingClick() {
        console.log("on active")
        this.nav.push(BookingDetailsPage);
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
        this.nav.push(BookingSearchPage)
    }

    goBookingDetails(x: TeeTimeSlotDisplay) {
        if(!x.available) {
            console.log("Slot is not available for booking");
            return false
        }
        console.log("going to booking details : ", x)
        console.log("going to booking details - clubInfo : ", this.clubInfo);
        console.log("going to booking details - clubs : ", this.clubs);
        this.nav.push(BookingDetailsPage, {
            clubInfo: this.clubInfo?this.clubInfo:this.clubs.club,
            teeTimeSlotDisplay: x,
            teeSlotNew: true,
            clubs: this.clubs,
            playerVoucher: this.playerVoucher,
            voucherSeries: this.voucherSeries,
            clubDiscounts: this.clubDiscounts,
            fromClub: false,
        })
    }

    changeDate(x: number) {
        if(!this.prevPage(x * -1)) return false;
        this.currentDate = moment(this.currentDate).add(x, 'days').format("YYYY-MM-DD");
        // this.refreshTeeTimeSlot();
    }

    nextDate() {
        console.log("booking list type [next] - ", this.bookingListType)
        this.currentDate = moment(this.currentDate).add(1, 'days').format("YYYY-MM-DD");
        // this.refreshTeeTimeSlot();
    }

    prevDate() {
        console.log("booking list type [prev]- ", this.bookingListType)
        this.currentDate = moment(this.currentDate).subtract(1, 'days').format("YYYY-MM-DD");
        // this.refreshTeeTimeSlot();
    }

    confirmDate() {
        console.log("confirm date is called", this.currentDate);
        this.refreshTeeTimeSlot();
    }

    prevPage(days?: number) {
        let _currDate = moment(this.currentDate);
        let _today = moment(this.today);
        // let isBefore = moment(this.currentDate).isBefore(this.today);
        // console.log("prev page : isBefore", isBefore)
        // let isAfter = moment(this.currentDate).add(2, 'days') > moment(this.today)
        // return isAfter;
        let _diffDays = _currDate.diff(_today,'days');
        // let _diffSecs = _currDate.diff(_today,'seconds');
        // console.log("Diff Curr date : ", _currDate);
        // console.log("Diff Today : ", _today)
        // console.log("Difference days : currDate - today | secs", _diffSecs); 
        
        
        if(!days || days === null) {
            // console.log("no days diff - initial")
            if (moment(this.currentDate).toDate() > moment(this.today).toDate()) return true;
        } else {
            // console.log("Difference days [prev] : currDate - today | days", _diffDays); 
            if(_diffDays >= days) {
                return true }
            else return false;
        }
        
    }

    availableClass(x: boolean) {
        console.log("available class : ", x)
        if(x === false) return 'book-unavailable'
        else return ''
    }

    getHolesAllowed(slot: any) {
        let _18Holes = slot.eighteenHolesAllowed;
        let _9Holes = slot.nineHolesAllowed;
        if(_18Holes && !_9Holes) return '18H';
        else if(!_18Holes && _9Holes) return '9H';
        else if(_18Holes && _9Holes) return '9H/18H'
    }

    onSelectTimes() {
        let times = this.modalCtl.create(SelectDatesPage, {
            type: 'time'
            //analysisType: "analysis",
            // courseInfo: this.courseInfo,
            // openedModal: true,
            // courseType: 'club',
            // clubInfo: this.clubInfo

        });

        times.onDidDismiss((data: any) => {
            // if (data.clubInfo) {
            //     this.clubInfo = data.clubInfo;
            //     this.courseInfo = createCourseInfo();
            // }

        });

        times.present();
    }

    getTeeOffTime(teeTime: string, type?: string) {
        switch(type) {
            case 'am-pm':
                return moment(teeTime, 'HH:mm:ss').format("A")
            default:
                return moment(teeTime, 'HH:mm:ss').format("hh:mm")
        }
        
    }

    getCourseName(slot: any) {
        console.log("get course name : ", slot);
        return slot.slot.startCourse.name;

    }

    moreSlots() {
        this.toggleSlots = !this.toggleSlots;
        console.log(this.toggleSlots)
    }

    getNavDate(x: number, type: string) {
        let _dayName = moment(this.currentDate).add(x, 'days').format("ddd");
        let _dateShort = moment(this.currentDate).add(x, 'days').format("D/M");
        let _dateText = _dayName + `<br>` + _dateShort;

        switch(type) {
            case 'day':
                return _dayName;
            case 'date':
                return _dateShort;
        }
        
    }

    

    getCourseDetails(slot: any, attribute: string) {
        // console.log("get course name : ", slot);
        let _course = slot.slot.startCourse;
        if (!slot) return '';
        else {
            switch (attribute) {
                case 'name':
                    return _course.name
                case 'holes':
                    return _course.type
                case 'image':
                    return _course.courseImage
                case 'course-rating':
                    return ''
                case 'slope-rating':
                    return _course.slope
            }
            return _course.name;
        }

    }

    getClubDetails(club: any, attribute: string) {
        // console.log("attribute : ",attribute,"get club name : ", club);
        let _club = club;
        let _address = club.address;
        // let _addressTxt = _address.address1 ? _address.address1 : '' +
        //     _address.address2 ? ',' + _address.address2 : '' +
        //     _address.city ? ',' + _address.city : '' +
        //     _address.countryData.name ? "," + _address.countryData.name : '';

            
        let _addressTxt = '';
        if(_address.address1)
            _addressTxt += _address.address1;
        else if(_address.address2)
            _addressTxt +=  (_addressTxt.length > 0)?',':'' + _address.address2;
        else if(_address.city)
            _addressTxt += (_addressTxt.length > 0)?',':'' +  _address.city;
        else if(_address.countryData && _address.countryData.name)
            _addressTxt += (_addressTxt.length > 0)?',':'' +  _address.countryData.name;
        // console.log("get club address - ", _addressTxt)
        if (!club) return '';
        else {
            switch (attribute) {
                case 'name':
                    return _club.name
                case 'image':
                    return _club.clubImage
                case 'address':
                    return _addressTxt
                case 'addressOld':
                    return _addressTxt;
            }
        }

    }

    getSlotPrice(slots: Array < TeeTimeSlotDisplay > , attribute ? : string) {
        if (!slots || slots === null) return '';
        let _slot = slots[0];
        // console.log("getSlotPrice slots - ", slots);
        // console.log("getSlotPrice slot[0] - ", _slot);

        return _slot.currency ? _slot.currency.symbol : '' + " " + _slot.displayPrices ? _slot.displayPrices.STD : ''
    }



    getClubCourseImage(course: ClubCourseData, clubs?: ClubTeeTimeSlots) {
        let _defaultImg = 'assets/img/default/template-course-' + Math.floor((Math.random() * 5) + 1) + '.jpg';
        let _club = this.clubs;
        // if (_club && _club.slots.length > 0 && _club.slots[0].slot.startCourse.courseImage)
        //     return course.courseImage ;//_club.slots[0].slot.startCourse.courseImage
        // else if (_club && _club.club.clubImage)
        //     return course.courseImage ;//_club.club.clubImage
        if(course && course.courseThumbnail)
            return course.courseThumbnail;
        else if(course && course.courseImage)
            return course.courseImage;
        else if (!course && this.clubInfo.clubImage) return this.clubInfo.clubImage
        else return 'img/course-default.png'
        // else return _defaultImg;
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
        (slot.displayPrices.STD?_message += _openColLeft + "Standard : "+ _closeCol+_openColRight +slot.currency.symbol + " " + slot.displayPrices.STD +_closeCol + "<br>":'');
        _message += _closeRow;
        // _message += _openRow;
        // (slot.displayPrices.MEMBER?_message += _openColLeft + "Member : " + slot.currency.symbol + " " + slot.displayPrices.MEMBER +"<br>":'');
        // _message += _closeRow;
        // _message += _openRow;
        // _message += _closeRow;
        
        (slot.displayPrices.STAFF?_message += "Staff : " + slot.currency.symbol + " " + slot.displayPrices.STAFF +"<br>":'');
        (slot.displayPrices.ARMY?_message += "Army : " + slot.currency.symbol + " " + slot.displayPrices.ARMY +"<br>":'');
        (slot.displayPrices.SENIOR?_message += "Senior : " + slot.currency.symbol + " " + slot.displayPrices.SENIOR +"<br>":'');
        (slot.displayPrices.WOMAN?_message += "Woman : " + slot.currency.symbol + " " + slot.displayPrices.WOMAN +"<br>":'');
        (slot.displayPrices.LADIES?_message += "Ladies : " + slot.currency.symbol + " " + slot.displayPrices.LADIES +"<br>":'');
        (slot.displayPrices.POLICE?_message += "Police : " + slot.currency.symbol + " " + slot.displayPrices.POLICE +"<br>":'');
        (slot.displayPrices.GOVT?_message += "Government : " + slot.currency.symbol + " " + slot.displayPrices.GOVT +"<br>":'');
        (slot.displayPrices.GUEST?_message += "Guest : " + slot.currency.symbol + " " + slot.displayPrices.GUEST +"<br>":'');
        // _message += _closeRow;
        let alert = this.alertCtrl.create({
            title: 'Available Packages',
            // subTitle: 'Selected date is '+ _date,
            message: _message, //'Selected date is ' + '<b>' + _date + '</b>',
            buttons: ['Close']
        });
        alert.present();
    }

    getClubImage(club: ClubInfo) {

        if(club) return club.clubImage;
        else 'img/default_club.png'
    }

    getDisplayPricesA(slot: TeeTimeSlotDisplay, event) {
        let popover = this.popoverCtl.create(PricesDisplayPage,{
            slot: slot,
            headerName: 'Available Packages'
            // courses: this.courses
        }, {
            showBackdrop: false
        });
        // popover.onDidDismiss((data: CourseInfo)=>{
        //     if(data){
        //         this.gameInfo.courses.push(data);
        //     }
        // });
        popover.present({
            ev: event
        });
        // popover.present();
    }

    checkAvailable(x: TeeTimeSlotDisplay) {
        if(x.available) return 'column slot-available'
        else if(!x.available) return 'column slot-not-available'

    }

    toggleAvailable() {
        this.toggleAvailableBoolean = !this.toggleAvailableBoolean;
        // if(this.toggleAvailableBoolean) {
        //     if(this.bookingListType === 'favClubs') {
        //         this.filteredSlot = this.slots.filter((ts:TeeTimeSlotDisplay)=>{
        //             return ts.available
        //         });
        //     } else if(this.bookingListType === 'single') {
        //         this.filteredSlot = this.teeTimeSlotDisplayList.filter((ts:TeeTimeSlotDisplay)=>{
        //             return ts.available
        //         });
        //     }
            
        // } else {
        //     // this.filteredSlot = [];
        //     if(this.bookingListType === 'single') this.filteredSlot = this.teeTimeSlotDisplayList;
        //     else if(this.bookingListType === 'favClubs') this.filteredSlot = this.slots;
        // }

        this.refreshTeeTimeSlot();

        // console.log("filtered Slot", this.filteredSlot)
        // console.log("tee time slot", this.teeTimeSlotDisplayList)
        // console.log("tee time slot", this.slots)
    }

    onHomeClick() {
        console.log("footer home click")
        this.nav.popToRoot();//this.nav.setRoot(PlayerHomePage);
    }
    
    openProfile() {
        this.nav.push(ProfilePage, {
            type  : 'playerProfile',
            player: this.player$
        });
    }
    onMyBookingsClick() {
        this.nav.push(BookingHomePage)
    }
    
    onFAQClick() {
        this.nav.push(FaqPage)
    }

    onNotificationsClick() { 
        this.nav.push(NotificationsPage);
    }

    onChangeTimeSlots() {
            let times = this.modalCtl.create(SelectDatesPage, {
                type: 'times',
                range: true,
                fromTime: this.fromTime,
                toTime: this.toTime,
            });
    
            times.onDidDismiss((data: any) => {
                console.log("on change time slots ", data)
                if(data) {
                    this.fromTime = data.fromTime;
                    this.toTime = data.toTime;
                    this.refreshTeeTimeSlot();
                }
            });
    
            times.present();
    }

}
