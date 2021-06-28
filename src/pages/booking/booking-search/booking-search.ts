import {
    ActionSheetController,
    Events,
    LoadingController,
    ModalController,
    NavController,
    NavParams,
    Platform
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
// import { CourseListPage } from '../../normalgame/course-list/course-list';
import { RecentClubListPage } from '../../performance/recent-club/recent-club';
import { ClubInfo, CourseInfo, createCourseInfo } from '../../../data/club-course';
import { SelectDatesPage } from '../../modal-screens/select-dates/select-dates';
// import { BookingDetailsPage } from '../booking-details/booking-details';
import { BookingListPage } from '../booking-list/booking-list';
@Component({
    templateUrl: 'booking-search.html',
    selector: 'booking-search-page'
})
export class BookingSearchPage {
    public friends: string = "friend";
    public friendType: string = "friend";
    public friendScreenName: string = "Friends";

    public bookings: string = "search";
    public holesPlayed: string = "9HOLES";


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

    public grpTeeSlotInfo: boolean = true;
    public grpPlayerDetails: boolean = false;
    public grpAdditionals: boolean = false;
    public grpPayment: boolean = false;
    public grpCheckIn: boolean = false;
    public grpFeedback: boolean = false;

    togglePreference: boolean = false;
    playersNo: string = "1";
    priceRange: any = 100;
    priceMin: any = 0;
    priceMax: any = 500;
    priceMin2: any;
    priceMax2: any;

    selectedClub: string = 'Select a club';
    selectedDates: string = 'Select date range';
    selectedTimes: string = 'Select time range';

    clubInfo: ClubInfo;
    courseInfo: CourseInfo;
    

    constructor(private nav: NavController,
        private platform: Platform,
        private keyboard: Keyboard,
        private friendService: FriendService,
        private events: Events,
        private navParams: NavParams,
        private loadingCtrl: LoadingController,
        private actionSheetCtrl: ActionSheetController,
        private modalCtl: ModalController,
        private renderer: Renderer) {
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

        // this.priceRange.lower = 20;
        // this.priceRange.upper = 150;


    }

    ionViewDidLoad() {
        this._refreshValues(null, null);
    }

    ionViewDidEnter() {
        if (this.refreshOnEnter)
            this._refreshValues(null, null);
        this.refreshOnEnter = false;
    }

    ionViewWillEnter() {
        adjustViewZIndex(this.nav, this.renderer);
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

    toggleBookingClick(type: number) {
        if (type === 1) {
            this.grpTeeSlotInfo = true;
            this.grpPlayerDetails = false;
            this.grpAdditionals = false;
            this.grpPayment = false;
            this.grpCheckIn = false;
            this.grpFeedback = false;
        } else if (type === 2) {
            this.grpTeeSlotInfo = false;
            this.grpPlayerDetails = true;
            this.grpAdditionals = false;
            this.grpPayment = false;
            this.grpCheckIn = false;
            this.grpFeedback = false;
        } else if (type === 3) {
            this.grpTeeSlotInfo = false;
            this.grpPlayerDetails = false;
            this.grpAdditionals = true;
            this.grpPayment = false;
            this.grpCheckIn = false;
            this.grpFeedback = false;
        }
    }

    onPriceRange() {
        console.log("price range : ", this.priceRange)
    }

    onSelectClub() {
        console.log("club click");

        let club = this.modalCtl.create(RecentClubListPage, {
            //analysisType: "analysis",
            // courseInfo: this.courseInfo,
            openedModal: true,
            courseType: 'club',
            // clubInfo: this.clubInfo

        });

        club.onDidDismiss((data: any) => {
            if (data.clubInfo) {
                this.clubInfo = data.clubInfo;
                this.courseInfo = createCourseInfo();
            }
            // this.clubName = this.clubInfo.clubName;
            // console.log("Type club", this.courseType)
            console.log("club info?", this.clubInfo)
            console.log("course info?", this.courseInfo)

        });

        club.present();
    }

    onSelectDates() {
        let dates = this.modalCtl.create(SelectDatesPage, {
            //analysisType: "analysis",
            // courseInfo: this.courseInfo,
            // openedModal: true,
            // courseType: 'club',
            // clubInfo: this.clubInfo

        });

        dates.onDidDismiss((data: any) => {
            if (data.clubInfo) {
                this.clubInfo = data.clubInfo;
                this.courseInfo = createCourseInfo();
            }
            // this.clubName = this.clubInfo.clubName;
            // console.log("Type club", this.courseType)
            console.log("club info?", this.clubInfo)
            console.log("course info?", this.courseInfo)

        });

        dates.present();
    }

    onSearchTeeTime() {
        this.nav.push(BookingListPage)
    }

}
