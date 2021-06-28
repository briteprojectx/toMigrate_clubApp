import { TeeTimeSlot, TeeTimeSlotDisplay, ClubCourseData } from './../../../data/mygolf.data';
import {Component, Renderer} from "@angular/core";
import {ViewController, NavParams, ToastController, Platform, NavController, Events, Keyboard, LoadingController, ActionSheetController, ModalController} from "ionic-angular";
import { CourseInfo, CourseHoleInfo } from "../../../data/club-course";
import { ClubFlightService } from "../../../providers/club-flight-service/club-flight-service";
import { TeeTimeBooking } from "../../../data/mygolf.data";


import * as moment from "moment";
import { MessageDisplayUtil } from '../../../message-display-utils';
import { FriendService } from '../../../providers/friend-service/friend-service';
import { PlayerList, FriendRequestList, FriendRequest, PlayerInfo, createPlayerList } from '../../../data/player-data';
/**
 * Created by ashok on 19/12/16.
 */
@Component({
    templateUrl: 'member-menu.html',
    selector: 'member-menu-page'
})
export class MemberMenuModal
{

    courses: Array<CourseInfo>;
    clubId: number;
    forDate: string;
    isClub: boolean = false;
    courseId: number;
    teeSlot: Array<TeeTimeSlotDisplay>;
    startCourses: Array<ClubCourseData>;
    changeType: string;
    currentSlot: TeeTimeBooking;
    color: string;
    currentTime: string;
    fromClub: boolean;

    public friends: string = "friend";
    public friendType: string = "friend";
    public friendScreenName: string = "Friends";


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


    constructor(private viewCtrl: ViewController,
        private flightService: ClubFlightService,
        private navParams: NavParams,
        private toastCtl: ToastController,
        private platform: Platform,
        private friendService: FriendService,
        private nav: NavController,
        private keyboard: Keyboard,
        private events: Events,
        private loadingCtrl: LoadingController,
        private actionSheetCtrl: ActionSheetController,
        private modalCtl: ModalController,
        private renderer: Renderer) {
        this.courses = navParams.get("courses");
        this.clubId = navParams.get("clubId");
        console.log("club id : ", this.clubId, navParams.get("clubId"), navParams.get("fromClub"))
        this.forDate = navParams.get("forDate");
        this.courseId = navParams.get("courseId");
        this.changeType = navParams.get("changeType");
        this.currentSlot = navParams.get("currentSlot")
        this.fromClub = navParams.get("fromClub");
        if(this.changeType && this.changeType ==='slot') this.isClub = false;
        else if(this.changeType && this.changeType === 'course') this.isClub = true;

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


    }

    ionViewDidLoad() {
        // this.getTeeTimeBookingList();
        this._refreshValues(null,null);
    }

    ionViewDidEnter() {
        this.refreshClubMemberslist();
    }
    close(){
        this.viewCtrl.dismiss();
    }
    selectHole(hole: CourseHoleInfo, whichNine: number) {
        this.viewCtrl.dismiss({
            hole     : hole,
            whichNine: whichNine
        });
    }

    getTeeTimeBookingList() {
        let _clubCourseId;
        this.startCourses = []
        // let _courseId;
        // _courseId = this.courseId;
        _clubCourseId = this.isClub?this.clubId:this.courseId
        this.flightService.getTeeTimeSlot(this.forDate,this.isClub,_clubCourseId)
        .subscribe((data: Array<TeeTimeSlotDisplay>)=>{
            this.teeSlot = data;
            if(this.changeType === 'course') {
                this.teeSlot = this.teeSlot.filter((tee: TeeTimeSlotDisplay)=>{
                    return tee.slot.teeOffTime === this.currentSlot.slotAssigned.teeOffTime && tee.slot.startCourse.id !== this.currentSlot.slotAssigned.startCourse.id
                })
            } else {
                this.teeSlot = this.teeSlot.filter((tee: TeeTimeSlotDisplay)=>{
                    return tee.slot.teeOffTime !== this.currentSlot.slotAssigned.teeOffTime 
                    // && (tee.slot.teeOffDate === moment().toDate() && (moment(tee.slot.teeOffTime,'HH:mm:ss').format('HH:mm') >= moment().format('HH:mm')))
                })
            }
            

            this.teeSlot.forEach((t: TeeTimeSlotDisplay)=>{
                this.startCourses.push(t.slot.startCourse);
            })

            this.startCourses = this.getUnique(this.startCourses,'id')
            this.startCourses.sort((a,b)=>{
                if(a.displayOrder < b.displayOrder) return -1
                if(a.displayOrder > b.displayOrder) return 1
                else 0
            })

            
            
            console.log("change - ", this.changeType)
            console.log("tee time booking slot ", this.teeSlot,this.startCourses)
        })
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


        changeSlot(slot: TeeTimeSlotDisplay, type?: string) {
            console.log("new slot ", slot)
            if(!slot.available && type === 'slot') return false;
            // && type === 'course'
            this.flightService.getBookingFlightList(this.clubId, moment(slot.slot.teeOffDate).format('YYYY-MM-DD'), true)
            .subscribe((data)=>{
                console.log("get slot",data)
                let _flightList: Array<TeeTimeBooking>
                let _hasFlight: Array<TeeTimeBooking>;
                if(data) {
                    _flightList = data.flightList;
                    _hasFlight = _flightList.filter((t: TeeTimeBooking)=>{
                        return (t.slotAssigned.slotNo === slot.slot.slotNo) && (t.slotAssigned.slotDayId === slot.slot.slotDayId) 
                    })

                    
                }
                if(_hasFlight && _hasFlight.length > 0) {
                        
                    console.log("has flight length", _hasFlight)
                    if(_hasFlight[0].flight && _hasFlight[0].flight.status === 'PlayFinished') {
                        console.log("flight finished")
                        MessageDisplayUtil.showMessageToast('There is Finished Flight in this slot. Please choose different slot.', 
                        this.platform , this.toastCtl,3000, "bottom");
                        return false;
                    } else {
                        this.viewCtrl.dismiss({
                            newSlot: slot,
                            currentSlot: this.currentSlot
                        });
                    }
                    
                } else {
                    this.viewCtrl.dismiss({
                        newSlot: slot,
                        currentSlot: this.currentSlot
                    });
                }
                console.log("has flight", _hasFlight)
            })
            // if(1) return false;
            
        }
        // changeSlot(slot: TeeTimeSlotDisplay) {
        //     console.log("new slot ", slot)
        //     if(!slot.available) return false;
        //     this.viewCtrl.dismiss({
        //         newSlot: slot,
        //         currentSlot: this.currentSlot
        //     });
        // }

        getSlotDetails(slot: TeeTimeSlotDisplay ,attribute: string) {
            switch(attribute) {
                case 'time':
                    let _time = moment(slot.slot.teeOffTime,'HH:mm:ss').format('hh:mm A');
                    return _time;
            }
        }

        getCurrentSlotDetails(attribute) {
            switch(attribute) {
                case 'time':
                    let _time = moment(this.currentSlot.slotAssigned.teeOffTime,'HH:mm:ss').format('hh:mm A');
                    return _time;
                case 'courseName':
                    let _courseName = this.currentSlot.slotAssigned.startCourse.name;
                    return _courseName;
            }
        }

        getSlotClass(slot: TeeTimeSlotDisplay) {
            // if(slot.available) this.color = 'danger';
            // else this.color = 'primary'

            if(this.changeType === 'course') return 'slot-available'
            else {
                // return this.color
                if(slot.available) return 'slot-available';
                else return 'slot-not-available'
            }
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

        refreshClubMemberslist() {
            let _params = {}
            _params['activeOnly'] = true;
            // _params['search']
            console.log("refresh club ", this.clubId, this.navParams.get("clubId"))
            this.flightService.getClubMembersList(this.clubId, _params)
            .subscribe((data)=>{
                console.log("refresh club members list", data);
            })
        }

        onApproveClubMembership() {
            let _params = {};
            this.flightService.updatePlayerClubMembership('approve', _params)
            .subscribe((data)=>{
                console.log("approve club members list", data);
            })
        }

        onSuspendClubMembership() {
            let _params = {};
            this.flightService.updatePlayerClubMembership('suspend', _params)
            .subscribe((data)=>{
                console.log("suspend club members list", data);
            })
        }
}
