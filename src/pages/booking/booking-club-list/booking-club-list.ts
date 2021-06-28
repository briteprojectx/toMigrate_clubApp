import {
    ActionSheetController,
    Events,
    LoadingController,
    ModalController,
    NavController,
    NavParams,
    Platform,
    AlertController,
    ToastController
} from 'ionic-angular';
import {
    Keyboard
} from '@ionic-native/keyboard';
import {
    Component,
    Renderer
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
    PlayerList
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
    BookingDetailsPage
} from '../booking-details/booking-details';
import {
    BookingSearchPage
} from '../booking-search/booking-search';

import * as moment from 'moment';
import {
    TeeTimeSlotDisplay,
    ClubData,
    CourseInfo,
    ClubInfo,
    ClubTeeTimeSlots,
    TeeTimePricingPlan,
    TeeTimeClubVoucher,
    TeeTimeClubVoucherSeries,
    TeeTimeDiscount,
    PlayerTypes,
} from '../../../data/mygolf.data';
import {
    ClubFlightService
} from '../../../providers/club-flight-service/club-flight-service';
import {
    SelectDatesPage
} from '../../modal-screens/select-dates/select-dates';
import {
    BookingListPage
} from '../booking-list/booking-list';
import { PlayerHomeDataService } from '../../../redux/player-home';
import { BookingHomePage } from '../booking-home/booking-home';
import { FaqPage } from '../../faq/faq';
import { getMaxListeners } from 'process';
import { NotificationsPage } from '../../notifications/notifications';
import { JsonService } from '../../../json-util';
// import {JsonService} from '../../json-util';
import { MessageDisplayUtil } from '../../../message-display-utils';


@Component({
    templateUrl: 'booking-club-list.html',
    selector: 'booking-club-list-page'
})
export class BookingClubListPage {
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
    public receivedList: Array < FriendRequest > = new Array < FriendRequest > ();
    public sentList: Array < FriendRequest > = new Array < FriendRequest > ();
    public friendRequests: Array < FriendRequest > = new Array < FriendRequest > ();
    public playerRequests: Array < FriendRequest > = new Array < FriendRequest > ();
    public playerHomeInfo$: Observable<PlayerHomeInfo>;
    public player$: Observable<PlayerInfo>;

    public refreshOnEnter: boolean = false;

    tabs: any;

    currentPage: number = 0;
    nameView: boolean = false;
    showAll: boolean = false;
    today: string;
    maxDate: string;
    currentDate: string;

    teeTimeSlotDisplayList: Array < TeeTimeSlotDisplay > ;
    clubTeeTimeSlotList: Array < any > ; //ClubTeeTimeSlots

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

    // clubInfo: Club
    loader: any;
    refresh: any;

    minNormalPrice: Array<number> = new Array();
    minPromoPrice: Array<number> = new Array();

    promoPlan: Array<TeeTimePricingPlan>;
    playerVoucher: Array<TeeTimeClubVoucher>;
    playerId: number;
    voucherSeries: Array<TeeTimeClubVoucherSeries>;
    clubDiscounts: Array<TeeTimeDiscount>;

    allClubTeeTimeList: Array<any>;
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
        private playerHomeService: PlayerHomeDataService,
        private toastCtl: ToastController) {
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

        this.clubId = navParams.get("clubId");
        if (!this.clubId) this.clubId = 28101520; //mygolf2u golf club

        this.today = moment().format("YYYY-MM-DD");
        this.currentDate = moment().format("YYYY-MM-DD");

        this.bookingListType = navParams.get("bookingListType");
        if (this.bookingListType === 'single') {
            this.teeTimeSlotDisplayList = navParams.get("teeTimeSlotDisplayList");
            this.clubCourseInfo = this.teeTimeSlotDisplayList[0].slot.startCourse;
            this.fromTime = navParams.get("fromTime");
            this.toTime = navParams.get("toTime");
            this.startDate = navParams.get("startDate");
            if (this.startDate.length > 0) this.currentDate = this.startDate;
            this.clubInfo = navParams.get("clubInfo");
            this.courseInfo = navParams.get("courseInfo");
        } else if (this.bookingListType === 'nearbyClubs') {

        } else if (this.bookingListType === 'favClubs' || this.bookingListType === 'allClubs') {
            this.clubTeeTimeSlotList = navParams.get("clubTeeTimeSlotList");
            this.allClubTeeTimeList = JSON.parse(JSON.stringify(navParams.get("clubTeeTimeSlotList")));
            this.clubTeeTimeSlotList = this.clubTeeTimeSlotList.splice(0,5)
            // this.clubCourseInfo = this.teeTimeSlotDisplayList[0].slot.startCourse;
            this.fromTime = navParams.get("fromTime");
            this.toTime = navParams.get("toTime");
            this.startDate = navParams.get("startDate");
            if (this.startDate.length > 0) this.currentDate = this.startDate;
            this.clubInfo = navParams.get("clubInfo");
            this.courseInfo = navParams.get("courseInfo");
            this.playerId = navParams.get("playerId");
            console.log("Booking List - Club Tee : ", this.playerId, this.clubTeeTimeSlotList)
            
                
            let loader = this.loadingCtrl.create({
                showBackdrop: false
            });

            
        loader.present().then(() => {
            if(this.clubTeeTimeSlotList && this.clubTeeTimeSlotList.length > 0) {
                this.minNormalPrice = [];

                this.clubTeeTimeSlotList.forEach((cTimeSlot: ClubTeeTimeSlots, idx)=>{
                    let value = null;
                    let _min = null;
                    let _key = '';
                    this.clubTeeTimeSlotList[idx]['showPromo'] = false;
                    this.clubTeeTimeSlotList[idx]['hasVoucher'] = false;
                    this.clubTeeTimeSlotList[idx]['voucherSeries'] = [];
                    // if(cTimeSlot.slots.length > 0 && cTimeSlot.slots[0].displayPrices) {
                    //     // cTimeSlot.slots.forEach((slotDisplay)=>{

                    //         for(let key in cTimeSlot.slots[0].displayPrices) {
                    //             if(key.toLowerCase() === 'member') continue;
                    //             if(key.toLowerCase() === 'visitor' || key.toLowerCase() === 'std') {
                    //                 value = cTimeSlot.slots[0].displayPrices[key];
                    //                 console.log("display prices - key : ", key, "| value : ",value, " | displayPrices : ", cTimeSlot.slots[0].displayPrices)
                    //                 if(!_min) _min = value;
                    //                 _min = (value < _min)? value : _min;
                    //                 _key = (value < _min)? key: key;
                    //             }
                    //         }
                    //         if(cTimeSlot.slots[0].originalPrices) {
                    //             for(let key in cTimeSlot.slots[0].originalPrices) {
                    //                 if(key.toLowerCase() === 'member') continue;
                    //                 if(key.toLowerCase() === 'visitor' || key.toLowerCase() === 'std') {
                    //                     value = cTimeSlot.slots[0].originalPrices[key];
                    //                     console.log("display prices - key : ", key, "| value : ",value, " | displayPrices : ", cTimeSlot.slots[0].displayPrices)
                    //                     if(!_min) _min = value;
                    //                     _min = (value < _min)? value : _min;
                    //                     _key = (value < _min)? key: key;

                    //                 }
                    //             }

                    //         }
                    //     // })
                    // }
                    // this.minNormalPrice[idx] = _min;


                    if(cTimeSlot.slots.length > 0) {
                        cTimeSlot.slots.forEach((c)=>{
                            for(let key in c.displayPrices) {
                                if(key.toLowerCase() === 'member') continue;
                                if(key.toLowerCase() === 'visitor' || key.toLowerCase() === 'std') {
                                    value = c.displayPrices[key];
                                    // if(cTimeSlot.club.name.toLowerCase().includes('seri selangor'))console.log("[",cTimeSlot.club.name,"]","display prices - key : ", key, "| value : ",value, " | displayPrices : ", c.displayPrices)
                                    if(!_min) _min = value;
                                    _min = (value < _min)? value : _min;
                                    _key = (value < _min)? key: key;
                                }
                            }
                            if(c.originalPrices) {
                                for(let key in c.originalPrices) {
                                    if(key.toLowerCase() === 'member') continue;
                                    if(key.toLowerCase() === 'visitor' || key.toLowerCase() === 'std') {
                                        value = c.originalPrices[key];
                                        // if(cTimeSlot.club.name.toLowerCase().includes('seri selangor'))console.log("[",cTimeSlot.club.name,"]","display prices - key : ", key, "| value : ",value, " | displayPrices : ", c.displayPrices)
                                        if(!_min) _min = value;
                                        _min = (value < _min)? value : _min;
                                        _key = (value < _min)? key: key;

                                    }
                                }

                            }
                        })
                        this.minNormalPrice[idx] = _min;
                    }
                    
                    console.log("normal price - club : ", cTimeSlot.club.name)
                    console.log("normal price - slot : ", cTimeSlot.slots, " | ", idx )
                    console.log("normal price - ", _key, " : ", this.minNormalPrice[idx], _min)
                                
                    this.getPlayerVoucherSeries(cTimeSlot);
                    this.getListClubDiscount(cTimeSlot);
                    this.getApplicableDiscountsForPlayer(cTimeSlot);
                    this.getClubPackages(cTimeSlot);

                    if(idx === this.clubTeeTimeSlotList.length - 1) {
                        setTimeout(()=>{
                            loader.dismiss();

                        },1000)
                    }
                })
            }
            console.log("min normal price : ",this.minNormalPrice);
            })
        }

        console.log("Booking List for " + this.bookingListType + " : ", this.teeTimeSlotDisplayList)
        this.playerHomeInfo$      = this.playerHomeService.playerHomeInfo();
        this.player$              = this.playerHomeInfo$
                                        .filter(Boolean)
                                        .map((playerHome: PlayerHomeInfo) => playerHome.player);
                                        
        this.player$.take(1).subscribe((player: PlayerInfo) => {
            this.playerId = player.playerId
            // this.currentPlayer = player
        });

        this.playerVoucher = this.navParams.get("playerVoucher");

        
        this.maxDate = moment(this.maxDate).add(3, 'y').format("YYYY-MM-DD");



    }

    ionViewDidLoad() {
        // this._refreshValues(null, null);
    }

    ionViewDidEnter() {
        if (this.refreshOnEnter)
            this._refreshValues(null, null);
        this.refreshOnEnter = false;
    }

    ionViewWillEnter() {
        adjustViewZIndex(this.nav, this.renderer);
    }

    subListAllSlots;
    refreshTeeTimeSlot() {
        let loader = this.loadingCtrl.create({
            showBackdrop: false
        });
        this.refresh = true;


        if (this.bookingListType === 'single') {
            // this.teeTimeSlotDisplayList = [];
            // let _forDate = this.currentDate;
            // let _fromTime = this.fromTime;
            // let _toTime = this.toTime;
            // this.flightService.getTeeTimeSlot(_forDate, false, 310510219, _fromTime, _toTime)
            //     .subscribe((teeTimeSlotDayDisplay: Array < TeeTimeSlotDisplay > ) => {
            //         loader.dismiss().then(()=> {
            //             if (teeTimeSlotDayDisplay) {
            //                 this.teeTimeSlotDisplayList = teeTimeSlotDayDisplay
            //                 // setTimeout(() => {
            //                     this.refresh = false;
                          
            //                 //   }, 5000);
            //             }
            //         })
            //         // console.log("booking home @ "+ _forDate +" from "+ _fromTime + ' to ' + _toTime + " : ", teeTimeSlotDayDisplay)
                    
            //     }, (error) => {
            //         loader.dismiss();
            //         this.refresh = false;
            //     }, ()=>{
            //         if(this.refresh) setTimeout(() => {
            //             this.refresh = false;
                  
            //           }, 5000);
            //     });
        } else if (this.bookingListType === 'favClubs' || this.bookingListType === 'allClubs') {
            this.clubTeeTimeSlotList = [];
            let _forDate = this.currentDate;
            let _fromTime = this.fromTime;
            let _toTime = this.toTime;
            this.minNormalPrice = [];
            if(this.bookingListType === 'allClubs') {
                this.subListAllSlots = this.flightService.getListAllSlots(null,_forDate, _fromTime,_toTime)
            .subscribe((data: any) => {
                let clubTSlot: Array<ClubTeeTimeSlots>;
                clubTSlot = data.teeTimeSlot;
                loader.dismiss().then(()=> {
                    console.log("[all] Refresh Club Tee - ", clubTSlot)
                    if(clubTSlot.length > 0) {
                        this.clubTeeTimeSlotList = JSON.parse(JSON.stringify(clubTSlot));
                        this.clubTeeTimeSlotList =  this.clubTeeTimeSlotList.splice(0,5);
                        this.allClubTeeTimeList = clubTSlot;
                        console.log("[all] Refresh Club Tee - ", this.clubTeeTimeSlotList)
                        this.clubTeeTimeSlotList.forEach((cTimeSlot, idx: number)=>{
                            this.getPlayerVoucherSeries(cTimeSlot);
                            this.getListClubDiscount(cTimeSlot);
                            this.getApplicableDiscountsForPlayer(cTimeSlot);
                            this.getClubPackages(cTimeSlot);
                            let _min;
                            let value;
                            let _key;
                            if(cTimeSlot.slots.length > 0) {
                                cTimeSlot.slots.forEach((c)=>{
                                    for(let key in c.displayPrices) {
                                        if(key.toLowerCase() === 'member') continue;
                                        if(key.toLowerCase() === 'visitor' || key.toLowerCase() === 'std') {
                                            value = c.displayPrices[key];
                                            // if(cTimeSlot.club.name.toLowerCase().includes('seri selangor'))console.log("[",cTimeSlot.club.name,"]","display prices - key : ", key, "| value : ",value, " | displayPrices : ", c.displayPrices)
                                            if(!_min) _min = value;
                                            _min = (value < _min)? value : _min;
                                            _key = (value < _min)? key: key;
                                        }
                                    }
                                    if(c.originalPrices) {
                                        for(let key in c.originalPrices) {
                                            if(key.toLowerCase() === 'member') continue;
                                            if(key.toLowerCase() === 'visitor' || key.toLowerCase() === 'std') {
                                                value = c.originalPrices[key];
                                                // if(cTimeSlot.club.name.toLowerCase().includes('seri selangor'))
                                                    // console.log("[",cTimeSlot.club.name,"]","original prices - key : ", key, "| value : ",value, " | displayPrices : ", c.displayPrices)
                                                if(!_min) _min = value;
                                                _min = (value < _min)? value : _min;
                                                _key = (value < _min)? key: key;
        
                                            }
                                        }
        
                                    }
                                })
                                this.minNormalPrice[idx] = _min;
                            }
                        })
                        this.refresh = false;
                        // setTimeout(() => {
                      
                        //   }, 5000);
                        
                    }
                })
                
            }, (error)=>{
                loader.dismiss();
                this.refresh = false;
            }, () => {
                if(this.refresh) setTimeout(() => {
                    this.refresh = false;
              
                  }, 5000);
            })
            } else {
                this.subListAllSlots = this.flightService.getTeeTimeSlotFavClubs(_forDate, _fromTime,_toTime)
                .subscribe((data: any) => {
                    let clubTSlot: Array<ClubTeeTimeSlots>;
                    clubTSlot = data.teeTimeSlot;
                    loader.dismiss().then(()=> {
                        console.log("[fav] Refresh Club Tee - ", clubTSlot)
                        if(clubTSlot.length > 0) {
                        
                        this.clubTeeTimeSlotList = JSON.parse(JSON.stringify(clubTSlot));
                        this.clubTeeTimeSlotList = this.clubTeeTimeSlotList.splice(0,5);
                        this.allClubTeeTimeList = clubTSlot;
                        console.log("[fav] Refresh Club Tee - ", this.clubTeeTimeSlotList)
                        this.clubTeeTimeSlotList.forEach((cTimeSlot, idx: number)=>{
                            this.getPlayerVoucherSeries(cTimeSlot);
                            this.getListClubDiscount(cTimeSlot);
                            this.getApplicableDiscountsForPlayer(cTimeSlot);
                            this.getClubPackages(cTimeSlot);
                            let _min;
                            let value;
                            let _key;
                            if(cTimeSlot.slots.length > 0) {
                                cTimeSlot.slots.forEach((c)=>{
                                    for(let key in c.displayPrices) {
                                        if(key.toLowerCase() === 'member') continue;
                                        if(key.toLowerCase() === 'visitor' || key.toLowerCase() === 'std') {
                                            value = c.displayPrices[key];
                                            // if(cTimeSlot.club.name.toLowerCase().includes('seri selangor'))console.log("[",cTimeSlot.club.name,"]","display prices - key : ", key, "| value : ",value, " | displayPrices : ", c.displayPrices)
                                            if(!_min) _min = value;
                                            _min = (value < _min)? value : _min;
                                            _key = (value < _min)? key: key;
                                        }
                                    }
                                    if(c.originalPrices) {
                                        for(let key in c.originalPrices) {
                                            if(key.toLowerCase() === 'member') continue;
                                            if(key.toLowerCase() === 'visitor' || key.toLowerCase() === 'std') {
                                                value = c.originalPrices[key];
                                                // if(cTimeSlot.club.name.toLowerCase().includes('seri selangor'))
                                                    // console.log("[",cTimeSlot.club.name,"]","original prices - key : ", key, "| value : ",value, " | displayPrices : ", c.displayPrices)
                                                if(!_min) _min = value;
                                                _min = (value < _min)? value : _min;
                                                _key = (value < _min)? key: key;
        
                                            }
                                        }
        
                                    }
                                })
                                this.minNormalPrice[idx] = _min;
                            }
                        });
                            this.refresh = false;
                            // setTimeout(() => {
                          
                            //   }, 5000);
                        }
                    })
                    
                }, (error)=>{
                    loader.dismiss();
                    this.refresh = false;
                }, () => {
                    if(this.refresh) setTimeout(() => {
                        this.refresh = false;
                  
                      }, 5000);
                })
            }
            
            // this.flightService.getTeeTimeSlot(_forDate, false, 310510219, _fromTime, _toTime)
            //     .subscribe((teeTimeSlotDayDisplay: Array < TeeTimeSlotDisplay > ) => {
            //         // console.log("booking home @ "+ _forDate +" from "+ _fromTime + ' to ' + _toTime + " : ", teeTimeSlotDayDisplay)
            //         if (teeTimeSlotDayDisplay) {
            //             this.teeTimeSlotDisplayList = teeTimeSlotDayDisplay
            //         }
            //     });
        }

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

        console.log("[do infinite]")
        if (this.isMore()) {
            this._appendClubList(null, infinite);
        } else {
            infinite.complete();
            infinite.enable(false);
        }

    }

    public isMore() {
        // return false
        console.log("[do infinite] is more : ", this.clubTeeTimeSlotList.length + " / " + this.allClubTeeTimeList.length )
        return this.clubTeeTimeSlotList.length > 0 && this.clubTeeTimeSlotList.length < this.allClubTeeTimeList.length;
        // return this.playerList.totalPages > 0 && this.playerList.currentPage < this.playerList.totalPages;
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

    goBookingDetails(x: number) {
        this.nav.push(BookingDetailsPage, {
            item: x,
            teeSlotNew: true
        })
    }

    changeDate(x: number) {
        if(!this.prevPage(x * -1)) return false;
        this.currentDate = moment(this.currentDate).add(x, 'days').format("YYYY-MM-DD");
        // this.refreshTeeTimeSlot();
    }

    nextDate() {
        this.currentDate = moment(this.currentDate).add(1, 'days').format("YYYY-MM-DD");
        // this.refreshTeeTimeSlot();
    }

    prevDate() {
        this.currentDate = moment(this.currentDate).subtract(1, 'days').format("YYYY-MM-DD");
        // this.refreshTeeTimeSlot();
    }

    confirmDate() {
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
        let _diffSecs = _currDate.diff(_today,'seconds');
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

    nextPage(days?: number) {
        let _currDate = moment(this.currentDate);
        let _today = moment(this.today);
        // let isBefore = moment(this.currentDate).isBefore(this.today);
        // console.log("prev page : isBefore", isBefore)
        // let isAfter = moment(this.currentDate).add(2, 'days') > moment(this.today)
        // return isAfter;
        let _diffDays = _today.diff(_currDate,'days');
        let _diffSecs = _today.diff(_currDate,'seconds');
        // console.log("Diff Curr date : ", _currDate);
        // console.log("Diff Today : ", _today)
        // console.log("Difference days : currDate - today | secs", _diffSecs); 
        
        
        if(!days || days === null) {
            console.log("no days diff - initial")
            if (moment(this.currentDate).toDate() > moment(this.today).toDate()) return true;
        } else {
            console.log("Difference days [next] : currDate - today | days", _diffDays); 
            if(_diffDays > days) return true;
            else return false;
        }
    }

    availableClass(x: boolean) {
        console.log("available class : ", x)
        if (x === false) return 'book-unavailable'
        else return ''
    }

    getHolesAllowed(slot: any) {
        let _18Holes = slot.eighteenHolesAllowed;
        let _9Holes = slot.nineHolesAllowed;
        if (_18Holes && !_9Holes) return '18H';
        else if (!_18Holes && _9Holes) return '9H';
        else if (_18Holes && _9Holes) return '9H/18H'
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

    getTeeOffTime(teeTime: string) {
        return moment(teeTime, 'HH:mm:ss').format("HH:mm")
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
        // console.log("get club name : ", club);
        if(!club) return;
        if(club && !club.address) return;
        let _club = club;
        let _address = club.address;
        let _addressTxt = _address.address1 ? _address.address1 : '' +
            _address.address2 ? ',' + _address.address2 : '' +
            _address.city ? ',' + _address.city : '' +
            _address.countryData.name ? "," + _address.countryData.name : '';
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
                case 'country':
                    return _address.countryData.name
            }
        }

    }


    getSlotPrice(slots: Array < TeeTimeSlotDisplay > , attribute ? : string) {
        if (!slots || slots === null) return '';
        // let _cheapestSlot = slots.forEach((slot: TeeTimeSlotDisplay)=>{
        //     slot.displayPrices
        // })
        let _slot = slots[0];
        let _price;
        // console.log("getSlotPrice slots - ", slots);
        // console.log("getSlotPrice slot[0] - ", _slot);
        // console.log("getSlotPrice :",_slot.displayPrices)
        switch(attribute) {
            case 'STD':
                // _price = (_slot.currency ? _slot.currency.symbol : '') + " " + (_slot.displayPrices ? _slot.displayPrices.STD : '');
                _price = (_slot.displayPrices ? _slot.displayPrices.STD : 0)
                // console.log("getSlotPrice - _price : ",_price)
                return _price
            case 'currency':
                return _slot.currency? _slot.currency.symbol: ''
        }
    }



    moreSlots() {
        this.toggleSlots = !this.toggleSlots;
        console.log(this.toggleSlots)
    }

    getClubCourseImage(clubs: ClubTeeTimeSlots) {
        let _defaultImg = 'assets/img/default/template-course-' + Math.floor((Math.random() * 5) + 1) + '.jpg';
        let _club = clubs;
        if (_club.club && _club.club.clubThumbnail) return _club.club.clubThumbnail
        else if(_club.club && _club.club.clubImage) return _club.club.clubImage
        else if (_club.club && _club.club.clubLogo) return _club.club.clubLogo
        else if (_club.slots && _club.slots.length > 0 && _club.slots[0].slot.startCourse.courseImage)
            return _club.slots[0].slot.startCourse.courseImage            
        else return 'img/default_club.png'
        // else return _defaultImg;
    }

    goBookingList(clubs: any) {
        if(clubs.slots.length === 0) return false;
        if(this.getSlotsAvailable(clubs)===0 || !this.getSlotsAvailable(clubs)) {
            MessageDisplayUtil.showMessageToast('Curently there is no available slots for this club', this.platform, this.toastCtl, 5000, 'bottom');
            return false;
        }
        let _forDate = this.startDate;
        let _fromTime = this.fromTime; //'07:00';
        let _toTime = this.toTime; //'09:00';
        // let _clubCourseId;
        // let _isClub: boolean = true;
        let _bookingListType = this.bookingListType;
        if(this.bookingListType === 'allClubs') _bookingListType = 'favClubs'
        
        if(this.hasPromo(clubs)) {
            this.getPlayerVoucherSeries(clubs);
            this.getListClubDiscount(clubs);
            setTimeout(()=>{
                this.nav.push(BookingListPage, {
                    bookingListType: _bookingListType,
                    clubTeeTimeSlotList: clubs,
                    fromTime: _fromTime,
                    toTime: _toTime,
                    startDate: _forDate,
                    courseInfo: this.courseInfo,
                    clubInfo: this.clubInfo,
                    currentDate: this.currentDate,
                    playerVoucher: clubs.playerVoucher,
                    voucherSeries: clubs.voucherSeries,
                    clubDiscounts: clubs.clubDiscounts,
                })
            },150)
            
        } else {

            this.nav.push(BookingListPage, {
                bookingListType: _bookingListType,
                clubTeeTimeSlotList: clubs,
                fromTime: _fromTime,
                toTime: _toTime,
                startDate: _forDate,
                courseInfo: this.courseInfo,
                clubInfo: this.clubInfo,
                currentDate: this.currentDate,
            })

        }

        // this.flightService.getTeeTimeSlotFavClubs(_forDate, _fromTime, _toTime)
        //     .subscribe((clubTeeTimeSlots: Array < ClubTeeTimeSlots > ) => {
        //         console.log("fav clubs : ", clubTeeTimeSlots)
        //         if (clubTeeTimeSlots.length > 0) {
        //             this.nav.push(BookingListPage, {
        //                 bookingListType: _bookingListType,
        //                 clubTeeTimeSlotList: clubs,
        //                 fromTime: _fromTime,
        //                 toTime: _toTime,
        //                 startDate: _forDate,
        //                 courseInfo: this.courseInfo,
        //                 clubInfo: this.clubInfo
        //             })
        //         } else {
        //             let _message = 'No time slots available for <br>Date : ' + _forDate + '<br>From ' + _fromTime + ' to ' + _toTime;
        //             let alert = this.alertCtrl.create({
        //                 title: 'No time slots available',
        //                 // subTitle: 'Selected date is '+ _date,
        //                 message: _message, //'Selected date is ' + '<b>' + _date + '</b>',
        //                 buttons: ['Close']
        //             });
        //             alert.present();
        //         }
        //     });
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
                    this.refreshBookingList();
                }
            });
    
            times.present();
        }

        refreshBookingList() {
            this.loader = this.loadingCtrl.create({
                showBackdrop: false
            });

        

        if(this.bookingListType === 'single') {
            // if(this.courseType === 'club') {
            //     _clubCourseId = this.clubInfo.clubId;
            //     _isClub = true;
            // }
            // else if(this.courseType === 'course') {
            //     _clubCourseId = this.courseInfo.courseId;
            //     _isClub = false;
            // }

            // this.flightService.getTeeTimeSlot(_forDate,_isClub,_clubCourseId,_fromTime,_toTime)
            // .subscribe((teeTimeSlotDayDisplay: Array<TeeTimeSlotDisplay>) => {
            //     this.loader.dismiss().then(()=>{
            //         console.log("booking home @ "+ _forDate +" from "+ _fromTime + ' to ' + _toTime + " : ", teeTimeSlotDayDisplay)
            //     if(teeTimeSlotDayDisplay.length > 0) {
            //         this.nav.push(BookingListPage, {
            //             bookingListType: _bookingListType,
            //             teeTimeSlotDisplayList: teeTimeSlotDayDisplay,
            //             fromTime: _fromTime,
            //             toTime: _toTime,
            //             startDate: _forDate,
            //             courseInfo: this.courseInfo,
            //             clubInfo: this.clubInfo
            //         })
            //     } else {
            //         let _message = 'No time slots available for <br>Date : ' + _forDate + '<br>From '+_fromTime + ' to ' + _toTime;
            //         let alert = this.alertCtrl.create({
            //             title: 'No time slots available',
            //             // subTitle: 'Selected date is '+ _date,
            //             message: _message, //'Selected date is ' + '<b>' + _date + '</b>',
            //             buttons: ['Close']
            //         });
            //         alert.present();
            //         this.loader.dismiss();
            //     }
            //     })
                
            // }, (error)=>{
            //     this.loader.dismiss();
            // }, ()=>{
            //     setTimeout(()=>{
            //         this.loader.dismiss()
            //     }, 5000)
            // });
        } 
        // else if(this.bookingListType === 'nearbyClubs') {
        //     this.flightService.getTeeTimeSlotNearbyClubs(_forDate,this.searchDistance,_fromTime,_toTime)
        //     .subscribe((clubTeeTimeSlots : Array<ClubTeeTimeSlots>) => {
        //         this.loader.dismiss().then(()=>{
        //             if(clubTeeTimeSlots.length > 0) {
        //                 // clubTeeTimeSlots.forEach((c) => {
        //                 //     JsonService.deriveFullUrl(c.club,"clubImage")
        //                 // })
                        
        //                 this.nav.push(BookingClubListPage, {
        //                     bookingListType: _bookingListType,
        //                     clubTeeTimeSlotList: clubTeeTimeSlots,
        //                     fromTime: _fromTime,
        //                     toTime: _toTime,
        //                     startDate: _forDate,
        //                     courseInfo: this.courseInfo,
        //                     clubInfo: this.clubInfo
        //                 })
        //             } else {
        //                 let _message = 'No time slots available for <br>Date : ' + _forDate + '<br>From '+_fromTime + ' to ' + _toTime;
        //                 let alert = this.alertCtrl.create({
        //                     title: 'No time slots available',
        //                     // subTitle: 'Selected date is '+ _date,
        //                     message: _message, //'Selected date is ' + '<b>' + _date + '</b>',
        //                     buttons: ['Close']
        //                 });
        //                 alert.present();
        //                 this.loader.dismiss();
        //             }
        //         })
                
        //     }, (error)=>{

        //     }, ()=>{
        //         this.loader.dismiss()
        //     })
        // } 
        else if(this.bookingListType === 'favClubs') {
            this.flightService.getTeeTimeSlotFavClubs(this.startDate,this.fromTime ,this.toTime)
            .subscribe((clubTeeTimeSlots : Array<ClubTeeTimeSlots>) => {
                this.loader.dismiss().then(()=>{
                    console.log("fav clubs : ", clubTeeTimeSlots)
                    if(clubTeeTimeSlots && clubTeeTimeSlots.length > 0) {
                        this.clubTeeTimeSlotList = [];
                        this.clubTeeTimeSlotList = clubTeeTimeSlots;
                    } else this.loader.dismiss();
                    // if(clubTeeTimeSlots.length > 0) {
                    //     this.nav.push(BookingClubListPage, {
                    //         bookingListType: _bookingListType,
                    //         clubTeeTimeSlotList: clubTeeTimeSlots,
                    //         fromTime: _fromTime,
                    //         toTime: _toTime,
                    //         startDate: _forDate,
                    //         courseInfo: this.courseInfo,
                    //         clubInfo: this.clubInfo
                    //     })
                    // } else {
                    //     let _message = 'No time slots available for <br>Date : ' + _forDate + '<br>From '+_fromTime + ' to ' + _toTime;
                    //     let alert = this.alertCtrl.create({
                    //         title: 'No time slots available',
                    //         // subTitle: 'Selected date is '+ _date,
                    //         message: _message, //'Selected date is ' + '<b>' + _date + '</b>',
                    //         buttons: ['Close']
                    //     });
                    //     alert.present();
                    //     this.loader.dismiss();
                    // }
                })
                
            }, (error)=>{
                this.loader.dismiss();
            }, ()=>{
                setTimeout(()=>{
                    this.loader.dismiss()
                }, 5000)
            })
        }
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

    getSlotsAvailable(club: ClubTeeTimeSlots) {
        let _slotsAvailable: Array<TeeTimeSlotDisplay>;
        if(!club) return;
        if(club && !club.slots) return;
        if(club && club.slots && club.slots.length === 0) return;
        _slotsAvailable = club.slots.filter((s: TeeTimeSlotDisplay)=>{
            return s.available
        });
        return _slotsAvailable.length
    }
    hasPromo(club: ClubTeeTimeSlots | any) {
        let _slots: Array<TeeTimeSlotDisplay>;
        let _hasPromo: boolean = false;
        if(!club) return;
        if(club && !club.slots) return;
        if(club && club.slots && club.slots.length === 0) return;
        _slots = club.slots.filter((s: TeeTimeSlotDisplay)=>{
            return s.originalPrices
        });

        // if(_slots) console.log("has promo : ", club)
        // setTimeout(()=>{
        //     if(_slots.length > 0) _hasPromo = true;
        //     else if(this.playerVoucher&&this.playerVoucher.length>0) _hasPromo = true
        // }, 500);
        
        if(_slots.length > 0) _hasPromo = true;
        // else if(this.playerVoucher && this.playerVoucher.length > 0) _hasPromo = true;
        // else if(club.hasVoucher) _hasPromo = true;
        // else if(club.voucherSeries && club.voucherSeries.length > 0) _hasPromo = true;
        else if(this.checkPlayerVoucher(club.voucherSeries)) _hasPromo = true;
        else if(club.clubDiscounts && club.clubDiscounts.length > 0) _hasPromo = true;
        else if(club.activeClubDiscounts && club.activeClubDiscounts.length > 0) _hasPromo = true;
        // else if(this.)
        return _hasPromo


    }

    getPromoPlan(club: ClubTeeTimeSlots, attribute?: string) {
        let _slots: Array<TeeTimeSlotDisplay>;
        let _promoPlan: TeeTimePricingPlan;
        if(!club) return;
        if(club && !club.slots) return;
        if(club && club.slots && club.slots.length === 0) return;
        _promoPlan = club.slots.filter((s: TeeTimeSlotDisplay)=>{
            return s.slot.pricingPlanPromotional
        }).map((s: TeeTimeSlotDisplay)=>{
            return s.slot.pricingPlanPromotional
        }).reduce((a,b)=>{
            if(a) return a
            else if(b) return b
            // else return null
            // return a
        },null);
        // console.log("get promo plan : ", _promoPlan)
        if(_promoPlan) {
            switch(attribute) {
                case 'name':
                    return _promoPlan.name
                case 'description':
                    return _promoPlan.description
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

    onMyBookingsClick() {
        this.nav.push(BookingHomePage)
    }
    
    onFAQClick() {
        this.nav.push(FaqPage)
    }

    getLowestPrice(slots: TeeTimeSlotDisplay, type?:string, idx?: number ) {
        // Array < TeeTimeSlotDisplay >
        // if(1) return false;
        let _executed = false;
        if(_executed) return false;
        let value = 0;
        let _key = '';
        let _min = null; //slot.displayPrices[0];
        let _max = null; //slot.displayPrices[0];
        let _min1 = 0; //slot.displayPrices[0]
        let _max1 = 0; //slot.displayPrices[0]
        // console.log("get lowest price : ", slots);
        // slots.forEach((slot: TeeTimeSlotDisplay, idx)=>{
        //     // console.log("slot index : ", idx, " - ", slot.displayPrices)
        //     // console.log("get lowest price min max : ", _min, _max)
        //     // console.log("get lowest price min max 1 :  ", _min1, _max1)
        //     for (let key in slot.displayPrices) {
        //         value = slot.displayPrices[key];
        //         if(!_min) _min = value;
        //         if(!_max) _max = value;
        //         _min = (value < _min)? value : _min;
        //         _key = (value < _min)? key: key;
        //         _max = (value > _max)? value : _max;

        //         // console.log("key - ", key, " | value - ", value)
        //     }

            
        // });
        let _slot = slots.displayPrices;
        // for (let key in _slot) {
        //     value = _slot[key];
        //     if(!_min) _min = value;
        //     if(!_max) _max = value;
        //     _min = (value < _min)? value : _min;
        //     _key = (value < _min)? key: key;
        //     // _max = (value > _max)? value : _max;
        //     // console.log("key - ", key, " | value - ", value)
        // }
        return this.minNormalPrice[idx];
                    
        // if(1) return false;
        // setTimeout(()=>{
            
        //     // console.log("get lowest price final slots :  ", slots[0]);
        //     // console.log("get lowest price final :  ", type, _key, _min, _max);
        //     // console.log("trying promise : ", this._lowestPrice(slots).then())
        //     _executed = true;
        //     return _min;
        //     // if(type === 'value') return _min; //this._lowestPrice(slots);
        //     // if( type === 'key') return _key
        //     // else if(type === 'value') return _min
        // }, 100)
    }

    async _lowestPrice(slots: Array<TeeTimeSlotDisplay>) {
        
        let value = 0;
        let _key = '';
        let _min = null; //slot.displayPrices[0];
        let _max = null; //slot.displayPrices[0];

        let promise = new Promise((resolve, reject) => {
          setTimeout(() => resolve("done!"), 1000)
          slots.forEach((slot: TeeTimeSlotDisplay, idx)=>{
            // console.log("slot index : ", idx, " - ", slot.displayPrices)
            console.log("get lowest price min max : ", _min, _max)
            for (let key in slot.displayPrices) {
                value = slot.displayPrices[key];
                if(!_min) _min = value;
                if(!_max) _max = value;
                _min = (value < _min)? value : _min;
                _key = (value < _min)? key: key;
                _max = (value > _max)? value : _max;

                console.log("key - ", key, " | value - ", value)
            }

            
        });
        });
      
        let result = await promise; // wait until the promise resolves (*)
        return _min
        // alert(result); // "done!"
      }

      getListPlayerVoucher(clubs) {
        let _clubId;
        let _playerId;

        if(clubs) _clubId = clubs.club.id;
        if(this.playerId) _playerId = this.playerId;
        // else {
        //     this.player$.take(1).subscribe((player: PlayerInfo) => {
        //         _playerId = player.playerId
        //     });
        // };
        this.flightService.getListClubPlayerVouchers(_clubId, _playerId)
        .subscribe((playerVoucher: Array<TeeTimeClubVoucher>)=>{
            console.log("get voucher list", playerVoucher)
            if(playerVoucher && playerVoucher.length > 0) {
                this.playerVoucher = playerVoucher;
                this.clubTeeTimeSlotList.filter((c: ClubTeeTimeSlots) =>{
                    return c.club.id === clubs.club.id;
                }).map((c: any)=>{
                    c.hasVoucher = true;
                    c.playerVoucher = playerVoucher;
                });
                clubs.hasVoucher = true;
                clubs.playerVoucher = playerVoucher;
                // console.log('get list player voucher : ', clubs)
                // console.log('get list player voucher : ', this.clubTeeTimeSlotList)
            }
            //     .filter((v: TeeTimeClubVoucher)=>{
            //         return !v.redeemed
            //    });
        })
    }

    onTogglePromo(clubs) {
        clubs.showPromo = !clubs.showPromo;
        // !!! if(clubs.showPromo) this.getPlayerVoucherSeries(clubs);
        // !!! if(clubs.showPromo) this.getListClubDiscount(clubs);
        // !!! if(clubs.showPromo) this.getApplicableDiscountsForPlayer(clubs);
        // !!! if(clubs.showPromo) this.getClubPackages(clubs);
        // if(clubs.showPromo) this.scroll(dealsAvailable);
        // this.getListPlayerVoucher(clubs);
    }

    getPlayerVoucherSeries(clubs) {
        this.voucherSeries = [];
        let voucherSeries:  Array<TeeTimeClubVoucherSeries> = [];
        this.flightService.getClubVoucherSeries(1, clubs.club.id)
        .subscribe((data: any)=>{
            console.log("player voucher series ", data);
            if(data.totalInPage > 0 && data.items && data.items.length > 0) {
                voucherSeries = data.items;
                if(voucherSeries) {
                    if(clubs.playerVoucher&&clubs.playerVoucher.length > 0) {
                        voucherSeries.filter((vs)=>{
                            let isSeries;
                            clubs.playerVoucher.filter((voucher)=>{
                                return voucher.seriesId === vs.id
                            }).map((v)=>{
                                isSeries = true;
                            });
                        }).map((vs)=>{
                            voucherSeries.push(vs);
                        })
                        // clubs.playerVoucher.forEach((voucher: TeeTimeClubVoucher)=>{
                        //     let _vSeries = voucherSeries.filter((vs)=>{
                        //         return vs.id === voucher.seriesId
                        //     }).map((vs: TeeTimeClubVoucherSeries) => {
                        //         // this.voucherSeries.push(vs)
                        //         return vs
                        //     }).reduce((a,b)=>{
                        //         return a
                        //     });
                        // })
                    } 
                    // else {
                    //     this.voucherSeries = voucherSeries.filter((vs)=>{
                    //         return vs.id === clubs.playerVoucher.seriesId
                    //     })
                    // }
                    if(voucherSeries) {
                        let idx;
                        this.clubTeeTimeSlotList.filter((c: ClubTeeTimeSlots, i: number) =>{
                            if(c.club.id === clubs.club.id) {
                                idx = i;
                                return true
                            }
                        }).map((c: any)=>{
                            c.voucherSeries = voucherSeries; //this.voucherSeries;
                            let _min;
                            c.voucherSeries.forEach((vs)=>{
                                console.log("applicable voucher series : ", vs, idx, " - ", this.minNormalPrice[idx])
                                if(vs.voucherAmountType.toLowerCase() === 'fixed') {
                                    
                                    if(!_min) {
                                        _min = vs.voucherAmount;
                                    } else {
                                        if(vs.voucherAmount < _min) _min = vs.voucherAmount;
                                    }
    
                                }
                            });
                            if(_min < this.minNormalPrice[idx]) this.minNormalPrice[idx] = _min;
                        });
                        
                    }
                }
                console.log("voucher series ", this.voucherSeries, voucherSeries)
             } // voucherSeries.push(...data.items);

        })
    }

    subListClubDiscounts;
    getListClubDiscount(clubs) {
        let _currentDate = this.currentDate;
        this.subListClubDiscounts = this.flightService.getListClubDiscounts(clubs.club.id)
        // this.flightService.getActiveListClubDiscounts(clubs.club.id, _currentDate)
        .subscribe((data: any)=>{
            if(data && data.items) {
                let clubDiscounts: Array<TeeTimeDiscount> = data.items;
                if(clubDiscounts) {
                    this.clubTeeTimeSlotList.filter((c: ClubTeeTimeSlots) =>{
                        return c.club.id === clubs.club.id;
                    }).map((c: any)=>{
                        c.clubDiscounts = clubDiscounts; //this.voucherSeries;
                    });
                    // this.voucherSeries = voucherSeries.filter((vs)=>{
                    //     return vs.id === clubs.playerVoucher.seriesId
                    // })
                    console.log("club discounts : ", clubDiscounts)
                }
            }
        })
        // console.log("voucher series ", this.voucherSeries)
    }

    getDealsAmount(amount: string, amountType: string, currency?: string, item?: any , type?: string) {
        // TeeTimeClubVoucher | TeeTimeClubVoucherSeries | TeeTimeDiscount
        console.log("get deals amount", amount, amountType, currency)
        if(!amount && type !== 'privilege') return ''; 
        let _currency = currency;
        let _amount = amount;
        let _amountType = amountType;

        let _flightApply;
        let _bookingApply;

        if(type === 'privilege') {
            _bookingApply = item.appliesToBooking
        } else {
            _flightApply = item.appliesToFlight;
            _bookingApply = item.appliesToBookingAmount;
        }
        
        let _amPMtype;
        if(type === 'privilege' && item.applicableRate) {
            // if(this.teeSlotNew) {
            //     _amPMtype = moment(this.teeTimeSlotDisplay.slot.teeOffTime,'HH:mm:ss').format("a");
            // } else if(!this.teeSlotNew) {
            //     _amPMtype = moment(this.bookingSlot.slotAssigned.teeOffTime,'HH:mm:ss').format("a");
            // }
            // this.clubTeeTimeSlotList.slots[0].
            if(_amPMtype === 'am') {
                _amount = item.applicableRate.amRate
                _amountType = item.applicableRate.amRateType
            }
            else if(_amPMtype === 'pm') { 
                _amount = item.applicableRate.pmRate
                _amountType = item.applicableRate.pmRateType
            }
        }

        let _amountText;
        let _flightTxt;
        if(item.applicableRate && type === 'privilege') {
            // if(type === 'voucher') {
            //     if(_flightApply) _flightTxt = 'for flight of 4';
            //     else _flightTxt = 'for 1 person';
            // } else 
            if(type ==='privilege') {
                if(_bookingApply) _flightTxt = '<br>per booking';
                else _flightTxt = '<br>for covered items';
            }
    
            let _amRate = item.applicableRate.amRate;
            let _pmRate  = item.applicableRate.pmRate;
            let _amRateType = item.applicableRate.amRateType;
            let _pmRateType = item.applicableRate.pmRateType;
            if (_amRateType === 'Absolute') {
                _amountText = '[AM] Save ' + _currency + "&nbsp;" + this.numberWithCommas(_amRate);
            } else if (_amRateType === 'Fixed') {
                _amountText = '[AM] Pay up to ' + _currency + "&nbsp;" + this.numberWithCommas(_amRate);
            } else if (_amRateType === 'Percentage') {
                _amountText = '[AM] '+ _amRate + '% off';
            } 
            if (_pmRateType === 'Absolute') {
                _amountText += '<br>[PM] Save ' + _currency + "&nbsp;" + this.numberWithCommas(_pmRate);
            } else if (_pmRateType === 'Fixed') {
                _amountText += '<br>[PM] Pay up to ' + _currency + "&nbsp;" + this.numberWithCommas(_pmRate);
            } else if (_pmRateType === 'Percentage') {
                _amountText += '<br>[PM] '+ _pmRate + '% off';
            } 

        } else {
            if(type === 'voucher') {
                let _maxFlightSize = item && item.maxFlightSize?item.maxFlightSize:4;
                if(_flightApply) _flightTxt = 'for flight of '+_maxFlightSize;
                else _flightTxt = 'for 1 person';
            } else if(type ==='privilege') {
                if(_bookingApply) _flightTxt = 'per booking';
                else _flightTxt = 'for covered items';
            }
    
            if (_amountType === 'Absolute') {
                _amountText = 'Save ' + _currency + "&nbsp;" + this.numberWithCommas(_amount)
            } else if (_amountType === 'Fixed') {
                _amountText = 'Pay up to ' + _currency + "&nbsp;" + this.numberWithCommas(_amount)
            } else if (_amountType === 'Percentage') {
                _amountText = _amount + '% off';
            } 
        }
        
        // else return '';
        if(type === 'voucher') return _amountText + " " + _flightTxt;
        else if(type === 'privilege') return _amountText + " " + _flightTxt;
        else return _amountText;
    }
    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }

    getVoucherApplicableText(voucher: TeeTimeClubVoucherSeries, type: string) {
        // TeeTimeClubVoucher
        if (!voucher) return false;
        let _allowText;
        let _applicableStart = 'Applicable on';
        let _allowWeekdays;
        let _allowWeekends;
        let _allowHolidays;
        let _applicableEnd = '';
        let _voucherDetails = voucher;
        if (type === 'allowDays') {
            _allowWeekdays = (voucher && voucher.allowOnWeekdays && (voucher.allowOnWeekends && voucher.allowOnPublicHolidays) ? 'Weekdays' + ', ' : voucher && voucher.allowOnWeekdays ? 'Weekdays' : '');
            _allowWeekends = (voucher && voucher.allowOnWeekends && (voucher.allowOnWeekdays) && voucher.allowOnPublicHolidays)? 'Weekends' : (voucher && voucher.allowOnWeekdays && voucher.allowOnWeekends && !voucher.allowOnPublicHolidays) ? ' and ' + 'Weekends' : (voucher && !voucher.allowOnWeekdays && voucher.allowOnWeekends)?'Weekends':'';
            _allowHolidays = (voucher && ((voucher.allowOnWeekdays || voucher.allowOnWeekends) && voucher.allowOnPublicHolidays) ? ' and ' + 'Public Holidays' : voucher && voucher.allowOnPublicHolidays ? 'Public Holidays' : '');

            // _allowWeekdays = (voucher && (voucher.allowOnWeekends || voucher.allowOnPublicHolidays) ? 'Weekdays' + ', ' : voucher && voucher.allowOnWeekdays ? 'Weekdays' : '');
            // _allowWeekends = (voucher && voucher.allowOnPublicHolidays ? 'Weekends' + ', ' : voucher && voucher.allowOnWeekends ? 'Weekends' : '');
            // _allowHolidays = (voucher && (voucher.allowOnWeekdays || voucher.allowOnWeekends && voucher.allowOnPublicHolidays) ? ' and ' + 'Public Holidays' : voucher && voucher.allowOnPublicHolidays ? 'Public Holidays' : '');

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
            if(voucher.appliesToBookingAmount) _allowText = 'Applies to Total Booking Amount';
            else _allowText = 'Not applied to Total Booking Amount';
        } else if (type === 'flight') {
            if(voucher.appliesToFlight) _allowText = 'Applicable for this flight';
            else _allowText = 'Applicable to 1 person';
        } else if(type === 'appliesFor') {
            // let _appliesFor = 'Applies for ';
            _allowText = 'Covers ';
            if(!voucher.priceComps || voucher.priceComps.length === 0) _allowText = 'Covers Booking Amount';
            else {
                _allowText += _voucherDetails.priceComps
                    .map((a) => {
                        return a.priceComponent.name
                    }).reduce((a, b) => {
                        return a + ', ' + b;
                    })
            }
        } 
        // else if(type === 'usableOtherRewards') {
        //     if(voucher.usa)
        //     _allowText = 
        // }

        return _allowText;

    }

    subApplicableDiscountPlayer;
    getApplicableDiscountsForPlayer(clubs) {
        // this.playerProfiles = [];
        // this.playerActiveClubDiscount = [];
        let _clubId = clubs&&clubs.club.id?clubs.club.id : null;
        if (!_clubId) return false;
        let _playerId = this.playerId;
        // this.player$.take(1).subscribe((player: PlayerInfo) => {
        //     _playerId = player.playerId
        //     // this.currentPlayer = player
        // });
        let _effectiveDate;
        console.log("get applicable discounts for plyter", clubs);
        if(clubs && clubs.slots && clubs.slots.length > 0)
            _effectiveDate = moment(clubs.slots[0].slot.teeOffDate).format("YYYY-MM-DD");
        this.subApplicableDiscountPlayer = this.flightService.getApplicableDiscountsForPlayer(_clubId,_playerId,_effectiveDate)
            .subscribe((activeClubDiscounts: Array < TeeTimeDiscount > ) => {
                console.log("applicable discounts - player : ", activeClubDiscounts);
                // console.log("applicable discounts - applied : ",this.appliedBookingDiscounts);
                // console.log("applicable discounts - player type  : ",this.bookingPlayer.playerType);
                if (activeClubDiscounts && activeClubDiscounts.length > 0) {
                    let idx;
                    let _acd = activeClubDiscounts.filter((acd)=>{
                        return !acd.availableForClubOnly
                    })
                    this.clubTeeTimeSlotList.filter((c: ClubTeeTimeSlots, i: number)=>{
                        if(c.club.id === clubs.club.id) {
                            idx = i;
                            return true
                        }
                    }).map((c: any)=>{
                        c.activeClubDiscounts = _acd;
                        let _min;
                        let value;
                        let _amRate;
                        let _pmRate;
                        c.activeClubDiscounts.forEach((cd)=>{
                            console.log("applicable discount : ", cd, idx, " - ", this.minNormalPrice[idx])
                            if(cd.amountType.toLowerCase() === 'fixed' && cd.applicableRate && (cd.applicableRate.amRateType.toLowerCase() === 'fixed' || cd.applicableRate.pmRateType.toLowerCase() === 'fixed')) {
                                _amRate = cd&&cd.applicableRate.amRate&&cd.applicableRate.amRateType.toLowerCase()==='fixed'?cd.applicableRate.amRate:null;
                                _pmRate = cd&&cd.applicableRate.pmRate&&cd.applicableRate.pmRateType.toLowerCase()==='fixed'?cd.applicableRate.pmRate:null;
                                if(!_min) {
                                    if(_amRate < _pmRate) _min = _amRate;
                                    else if(_amRate > _pmRate) _min = _pmRate;
                                    else _min = _amRate;
                                } else {
                                    if(_amRate < _min) _min = _amRate;
                                    else if(_pmRate < _min) _min = _pmRate;
                                    else _min = _min;
                                }

                            }
                            cd.applicableRate
                            // if(!_min) _min = value;
                            //         _min = (value < _min)? value : _min;
                            //         _key = (value < _min)? key: key;
                        });
                        if(_min < this.minNormalPrice[idx]) this.minNormalPrice[idx] = _min;
                    });

                }
            }, (error)=>{

            }, () =>{
                console.log("club tee time slot ", this.clubTeeTimeSlotList)
            })
    }

    
    getDateText(date: string) {
        if (date.length === 0) return false;
        let _date = date;
        return moment(_date, 'YYYY-MM-DD').format("DD MMM 'YY");
    }

getDiscountText(discount: TeeTimeDiscount, type ? : string) {
        // console.log("get discount text ", discount);
        // console.log("get discount text ", this.getDiscountDetails(discount));

        if (!discount) return false;
        let _currency;
        let _discountDetails = discount; //this.getDiscountDetails(discount);
        if (!_discountDetails) return false;
        _currency = discount.club.address.countryData.currencySymbol;
        switch (type) {
            case 'amount':
                if (discount.amountType.toLowerCase() === 'percentage')
                    return discount.discount + '% off';
                else if (discount.amountType.toLowerCase() === 'absolute')
                    return 'Less ' + _currency + ' ' + discount.discount
                else if (discount.amountType.toLowerCase() === 'fixed')
                    return _currency + ' ' + discount.discount
            case 'appliesFor':
                // HBUGGYFEE
                // HCADDYFEE
                // BUGGYFEE
                // CADDYFEE
                let _appliesFor = 'Covers ';
                let _priceComponents;
                console.log("pre filter - ", _discountDetails)


                if(_discountDetails && _discountDetails.priceComponents.length === 0) return;
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
                console.log("pre filter - buggy fee ", _buggyFee)
                console.log("pre filter - caddy fee ", _caddyFee)
                 
                _priceComponents = _discountDetails.priceComponents.filter((price)=>{
                    if(_buggyFee.length === 2) return price.priceComponent.id.toLowerCase() !== 'hbuggyfee'
                    else return true
                }).filter((price)=>{
                    
                    if(_caddyFee.length === 2) return price.priceComponent.id.toLowerCase() !== 'hcaddyfee'
                    else return true
                });

                
                    // if(price.priceComponent.id.toLowerCase() === 'hbuggyfee' && price.priceComponent.id.toLowerCase() === 'buggyfee')
                    //     return price.priceComponent.id.toLowerCase() === 'buggyfee' && price.priceComponent.id.toLowerCase() !== 'hbuggyfee'
                    // else if(price.priceComponent.id.toLowerCase() === 'HCADDYFEE' && price.priceComponent.id.toLowerCase() === 'caddyfee')
                    //     return price.priceComponent.id.toLowerCase() !== 'caddyfee' && price.priceComponent.id.toLowerCase() !== 'hcaddyfee'
                    // else return true

                if(_priceComponents && _priceComponents.length > 0) {console.log("post filter - ", _discountDetails)
                    if(!_discountDetails.priceComponents || _discountDetails.priceComponents.length === 0) return '';
                        // setTimeout(()=>{
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
                        console.log("applies to ", _appliesFor)
                        // },500)
                }
                return _appliesFor;
                
            case 'appliesTo':
                let _appliesTo = 'Applies to ';
                if(!_discountDetails.playerTypes || _discountDetails.playerTypes.length === 0) return '';
                _appliesTo += _discountDetails.playerTypes
                    .map((a) => {
                        return a.bookingPlayerType.name
                    }).reduce((a, b) => {
                        return a + ', ' + b;
                    })
                console.log("applies to ", _appliesTo)
                return _appliesTo;
        }
    }
    
    getClubPackages(clubs) {
        // console.log("club pacakges", clubs)
        let _packages = [];
        let _key;
        let _min;
        let value;
        
        if(!clubs) return;
        if(clubs && !clubs.slots) return;
        if(clubs && clubs.slots && clubs.slots.length === 0) return;
        clubs.slots.forEach((slots)=>{
            if(slots.originalPrices) {
                for(let key in slots.originalPrices) {
                    if(key.toLowerCase() === 'member') return;
                    _packages.push({
                        id : key,
                        name :  PlayerTypes[key],
                        amount   :   slots.originalPrices[key]
                    })
                    
                    // value = slots.displayPrices[key];
                    // console.log("display prices - key : ", key, "| value : ",value, " | displayPrices : ", slots.displayPrices)
                    // if(!_min) _min = value;
                    // _min = (value < _min)? value : _min;
                    // _key = (value < _min)? key: key;
                }
                for(let key in slots.displayPrices) {
                    if(key.toLowerCase() === 'member') return;
                    _packages.push({
                        id : key,
                        name :  PlayerTypes[key],
                        amount   :   slots.displayPrices[key]
                    })
                    
                    // value = slots.displayPrices[key];
                    // console.log("display prices - key : ", key, "| value : ",value, " | displayPrices : ", slots.displayPrices)
                    // if(!_min) _min = value;
                    // _min = (value < _min)? value : _min;
                    // _key = (value < _min)? key: key;
                }
                return;
            } else {
                for(let key in slots.displayPrices) {
                    if(key.toLowerCase() === 'member') return;
                    _packages.push({
                        id : key,
                        name :  PlayerTypes[key],
                        amount   :   slots.displayPrices[key]
                    })
                    
                    // value = slots.displayPrices[key];
                    // console.log("display prices - key : ", key, "| value : ",value, " | displayPrices : ", slots.displayPrices)
                    // if(!_min) _min = value;
                    // _min = (value < _min)? value : _min;
                    // _key = (value < _min)? key: key;
                }
                return;

            }
        })
        _packages = _packages.sort((a,b)=>{
            if(a.name < b.name) {
                if(a.amount < b.amount) return -1;
                else if(a.amount > b.amount) return 1;
                else return -1
            } else if(a.name > b.name) {
                if(a.amount < b.amount) return -1;
                else if(a.amount > b.amount) return 1;
                else return 1
            }
            else return 0;
        })
        // console.log("get club package before : ", _packages)
        _packages = this.getUnique(_packages,'name');
        return _packages;
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

    // getDiscountDetails(discount: TeeTimeDiscount) {
    //     // console.log("get discount details ", discount);
    //     // console.log("get discount details ", this.playerActiveClubDiscount);
    //     if (!discount) return false;
    //     let _discountDetails;
    //     if (this.playerActiveClubDiscount)
    //         _discountDetails = this.playerActiveClubDiscount.filter((td) => {
    //             return td.id === discount.id
    //         }).map((td) => {
    //             return td
    //         });
    //     // console.log("get disc details ", _discountDetails)
    //     if (_discountDetails && _discountDetails.length > 0) return _discountDetails[0];
    //     else return null;
    // }

    scroll(id) {
        // console.log("scroll to id : ", id)
        // let el = document.getElementById(id);
        let el = document.querySelector('#'+id)
        if(el) {
            setTimeout(()=>{
                el.scrollIntoView({behavior: 'smooth', block: 'start'});
            }, 500)
        }
    }

    onNotificationsClick() { 
        this.nav.push(NotificationsPage);
    }

    escapeCRLF(value) {
        return JsonService.escapeCRLF(value);
    }

    private _appendClubList(refresher, infinite) {
        let _addClub = 2;
        let _currentLen = this.clubTeeTimeSlotList.length>0?this.clubTeeTimeSlotList.length:1;
        let _all = JSON.parse(JSON.stringify(this.allClubTeeTimeList));
        console.log("[do infinite] append club list : current length - ", this.clubTeeTimeSlotList.length);
        console.log("[do infinite] append club list : current length - ", this.allClubTeeTimeList);
        this.clubTeeTimeSlotList.push(..._all.splice(_currentLen,_addClub));
                    if (refresher) {
                        refresher.complete();
                    }
                    if (infinite) {
                        infinite.complete();
                    }
        this.clubTeeTimeSlotList.forEach((cTimeSlot, idx: number)=>{
            if(idx >= _currentLen ) {
                this.getPlayerVoucherSeries(cTimeSlot);
                this.getListClubDiscount(cTimeSlot);
                this.getApplicableDiscountsForPlayer(cTimeSlot);
                this.getClubPackages(cTimeSlot);

                let value = null;
                    let _min = null;
                    let _key = '';
                    this.clubTeeTimeSlotList[idx]['showPromo'] = false;
                    this.clubTeeTimeSlotList[idx]['hasVoucher'] = false;
                    this.clubTeeTimeSlotList[idx]['voucherSeries'] = [];
                    if(cTimeSlot.slots.length > 0 && cTimeSlot.slots[0].displayPrices) {
                        // cTimeSlot.slots.forEach((slotDisplay)=>{

                            // for(let key in cTimeSlot.slots[0].displayPrices) {
                            //     if(key.toLowerCase() === 'member') continue;
                            //     if(key.toLowerCase() === 'visitor' || key.toLowerCase() === 'std') {
                            //         value = cTimeSlot.slots[0].displayPrices[key];
                            //         console.log("display prices - key : ", key, "| value : ",value, " | displayPrices : ", cTimeSlot.slots[0].displayPrices)
                            //         if(!_min) _min = value;
                            //         _min = (value < _min)? value : _min;
                            //         _key = (value < _min)? key: key;
                            //     }
                            // }
                            // if(cTimeSlot.slots[0].originalPrices) {
                            //     for(let key in cTimeSlot.slots[0].originalPrices) {
                            //         if(key.toLowerCase() === 'member') continue;
                            //         if(key.toLowerCase() === 'visitor' || key.toLowerCase() === 'std') {
                            //             value = cTimeSlot.slots[0].originalPrices[key];
                            //             console.log("display prices - key : ", key, "| value : ",value, " | displayPrices : ", cTimeSlot.slots[0].displayPrices)
                            //             if(!_min) _min = value;
                            //             _min = (value < _min)? value : _min;
                            //             _key = (value < _min)? key: key;

                            //         }
                            //     }

                            // }
                        // })
                    }
                    if(cTimeSlot.slots.length > 0) {
                        cTimeSlot.slots.forEach((c)=>{
                            for(let key in c.displayPrices) {
                                if(key.toLowerCase() === 'member') continue;
                                if(key.toLowerCase() === 'visitor' || key.toLowerCase() === 'std') {
                                    value = c.displayPrices[key];
                                    // if(cTimeSlot.club.name.toLowerCase().includes('seri selangor'))console.log("[",cTimeSlot.club.name,"]","display prices - key : ", key, "| value : ",value, " | displayPrices : ", c.displayPrices)
                                    if(!_min) _min = value;
                                    _min = (value < _min)? value : _min;
                                    _key = (value < _min)? key: key;
                                }
                            }
                            if(c.originalPrices) {
                                for(let key in c.originalPrices) {
                                    if(key.toLowerCase() === 'member') continue;
                                    if(key.toLowerCase() === 'visitor' || key.toLowerCase() === 'std') {
                                        value = c.originalPrices[key];
                                        // if(cTimeSlot.club.name.toLowerCase().includes('seri selangor'))
                                            // console.log("[",cTimeSlot.club.name,"]","original prices - key : ", key, "| value : ",value, " | displayPrices : ", c.displayPrices)
                                        if(!_min) _min = value;
                                        _min = (value < _min)? value : _min;
                                        _key = (value < _min)? key: key;

                                    }
                                }

                            }
                        })
                        this.minNormalPrice[idx] = _min;
                    }
                    
            }
        })
        // console.log("[do infinite] append club list : current club list - ", this.clubTeeTimeSlotList);
        // console.log("min normal price : ",this.minNormalPrice);
    }

    private _refreshClubList(refresher, infinite) {


        
        // this.clubTeeTimeSlotList = clubTSlot;
        // clubTSlot.forEach((cTimeSlot)=>{
        //     this.getPlayerVoucherSeries(cTimeSlot);
        //     this.getListClubDiscount(cTimeSlot);
        //     this.getApplicableDiscountsForPlayer(cTimeSlot);
        //     this.getClubPackages(cTimeSlot);
        // })
        // this.refresh = false;



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

    checkPlayerVoucher(vs: Array<TeeTimeClubVoucherSeries>) {

        // console.log("check player voucher : ", vs);
        // console.log("check player voucher : ", this.playerVoucher);
        if(this.playerVoucher && this.playerVoucher.length === 0) return false;
        if(!this.playerVoucher) return false;
        if(!vs) return false;
        let _vSeries = this.playerVoucher.find((pv: TeeTimeClubVoucher)=>{
            let _hasVS = vs.filter((vs: TeeTimeClubVoucherSeries)=>{
                return vs.id === pv.seriesId
            });
            return _hasVS && _hasVS.length > 0;
        });
        if(_vSeries) return true
        else return false;
    }
    getPlayerVoucherClub(vs: Array<TeeTimeClubVoucherSeries>) {

        // console.log("check player voucher : ", vs);
        // console.log("check player voucher : ", this.playerVoucher);
        if(this.playerVoucher && this.playerVoucher.length === 0) return;
        if(!this.playerVoucher) return;
        if(!vs) return;
        let _vSeries = vs.filter((vs: TeeTimeClubVoucherSeries)=>{
            let _hasVS = this.playerVoucher.filter((pv: TeeTimeClubVoucher)=>{
                return vs.id === pv.seriesId
            });
            return _hasVS && _hasVS.length > 0;
        });
        if(_vSeries) return _vSeries
        else return [];
        // else return false;
    }

    ionViewWillLeave() {
        console.log("will leave ");
        // if(this.subApplicableDiscountPlayer) this.subApplicableDiscountPlayer.unsubscribe();
        // if(this.subListAllSlots) this.subListAllSlots.unsubscribe();
        // if(this.subListClubDiscounts) this.subListClubDiscounts.unsubscribe();
    }

    ionViewCanLeave() {
        console.log("can leave ");    
        // if(this.subApplicableDiscountPlayer) this.subApplicableDiscountPlayer.unsubscribe();
        
    }


    

}