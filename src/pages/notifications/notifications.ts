import {
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';
import {
    NavController,
    Platform
} from 'ionic-angular';
import {
    DeviceService
} from '../../providers/device-service/device-service';
import {
    DeviceInfo
} from '../../data/device-info';
import {
    AppInfo
} from '../../data/app-info';
import {
    ClubFlightService
} from '../../providers/club-flight-service/club-flight-service';
import { ThrowStmt } from '@angular/compiler/src/output/output_ast';
import { MyGolfStorageService } from '../../storage/mygolf-storage.service';
import { MessageDisplayUtil } from '../../message-display-utils';
import { AlertController } from 'ionic-angular';
import { OSNotificationPayload } from '../../providers/pushnotification-service/onesignal-notification-data';
import { FaqPage } from '../faq/faq';
import { ProfilePage } from '../profile/profile';
import { BookingHomePage } from '../booking/booking-home/booking-home';
/**
 * Created by Ashok on 29-03-2016.
 */
export interface FAQItem {
    title ? : string;
    content ? : string;
    expand ? : boolean;
}

export interface GroupItem {
    groupTitle ? : string;
    groupContent ? : Array < FAQItem > ;
}
@Component({
    templateUrl: "notifications.html",
    selector: "notifications-page"
})
export class NotificationsPage implements OnInit, OnDestroy {

    deviceInfo: DeviceInfo = {
        deviceId: 'unknown',
        virtual: true
    };
    appInfo: AppInfo = {};

    faqItems: Array < FAQItem > = new Array < FAQItem > ();
    groupItems: Array < GroupItem > = new Array < GroupItem > ();
    searchQuery: string;
    originalGroups: Array<any>;
    searchingMode: boolean = false;

    notfItems: any; //OSNotificationPayload;

    constructor(private navCtrl: NavController,
        private deviceService: DeviceService,
        private platform: Platform,
        private flightService: ClubFlightService,
        private storage: MyGolfStorageService,
        private alertCtl: AlertController) {
        this.platform = platform;
        // this.faqItems.push({
        //     title: 'What is myGolf2u?',
        //     content: 'myGolf2u is a handy electronic scorecard that keeps all the scores for your golf rounds. In fact, you will never lose your scorecards again!',
        //     expand: true
        // }, {
        //     title: 'Difference between the myGolf2u App and Website?',
        //     content: 'Our myGolf2u Apps are Apps that can be downloaded and installed on your compatible mobile device, while the myGolf2u Website is a web portal that runs directly in the mobile browser on your smart phone or other mobile device. Both the myGolf2u Apps and the myGolf2u Website allow you to access your player profile, start scoring, view tournaments details and leaderboard directly from your mobile device',
        //     expand: false,

        // },  {
        //     title: 'How do I download myGolf2u?',
        //     content: `<p>There are 3 ways to use myGolf2u:</p>
        //     <p>1.     Visit <strong>Google Play</strong> and search for mygolf2u</p>
        //     <p>2.     Visit <strong>App Store</strong> and search for mygolf2u</p>
        //     <p>3.     Simply go to m.mygolf2u.com and start using the app without downloading!</p>`,
        //     expand: false,

        // }, {
        //     title: 'What are the minimum supported Operating System (OS) version?',
        //     content: 
        //     `<p>1.      Android - Version 10.0 (Android Q) and above</p>
        //      <p>2.      iOS - 9.0 and above</p>`,
        //      expand: false,

        // },{
        //     title: 'Do I have to buy the myGolf2u App?',
        //     content: `<p>No. Our myGolf2u App is completely free to download and install.</p>`,
        //     expand: false,
        // },{
        //     title: 'How do I get or view my myGolf2u handicap?',
        //     content: `<p>You need to play at least <b>5</b> rounds of <b>9</b> holes to get handicap calculated.</p>`,
        //     expand: false,
        // });

    }

    ionViewDidLoad() {
        // this.storage.getPreference('notifications')
        // .subscribe((a)=>{
        //     this.notfItems = a;
        // })

    }

    ionViewDidEnter() {
        this.clickNotf();
    }
    ngOnInit() {
        this.deviceService.getDeviceInfo()
            .then((deviceInfo: DeviceInfo) => {
                this.deviceInfo = deviceInfo;
            });
        this.deviceService.getAppInfo().then((appInfo: AppInfo) => {
            this.appInfo = appInfo;
        })
        this.onRefresh();

        // this.flightService.getFAQ()
        //     .subscribe((groupItems: Array < GroupItem > ) => {
        //         // let groupItems = groupItems; 
        //         if (groupItems && groupItems.length > 0)
        //             this.groupItems = groupItems
        //             this.originalGroups.copy(this.groupItems)

        //         console.log("get faq group items", groupItems)
        //         // console.log("get faq group items", this.groupItems, groupItems)
        //     })

    }

    onRefresh(clear: boolean = false) {
        this.searchingMode = false;
        if(clear) this.searchQuery = '';

        // console.log("get faq group items", this.groupItems)
        this.flightService.getFAQ()
            .subscribe((groupItems: Array < GroupItem > ) => {
                if (groupItems && groupItems.length > 0) {
                    this.groupItems = groupItems
                    this.originalGroups = this.groupItems
                                        // this.originalGroups.push(this.groupItems)
                }
                console.log("get faq group items", this.groupItems, groupItems)
            })
    }
    ngOnDestroy() {

    }
    versionCode() {
        return this.platform.versions()
    }

    isCordova() {
        return this.platform.is('cordova');
    }
    toggleBookingClick(type: number) {}
    onHomeClick() {
        // console.log("footer home click")
        this.navCtrl.popToRoot(); //this.nav.setRoot(PlayerHomePage);
    }

    expandPanel(item: FAQItem) {
        this.groupItems.forEach((gItems: GroupItem) => {
            gItems.groupContent.forEach((item: FAQItem) => {
                item.expand = false;
            })
        })
        item.expand = true;
        //   this.faqItems.forEach((item: FAQItem)=>{
        //       item.expand = false;
        //   })
        //   item.expand = true;
    }
    // async sendMessage() {
    //     let deviceInfo: DeviceInfo = await this.deviceService.getDeviceInfo();
    //
    //     this.stompService.sendMessage(deviceInfo,
    //         '/app//mygolf2u-ws/device/register');
    // }
    onSearchInput(searchbar) {
        // this.filteredBooking = [];
        if(this.searchQuery.length === 0) {
            this.searchingMode = false;
            this.onRefresh();
            return false;
        }
        this.searchingMode = true;
        let _filteredFaq: Array<FAQItem> = [];
        // let _filteredGroup = this.originalGroups.forEach((tGroup: GroupItem)=>{
        //     _filteredFaq = tGroup.groupContent.filter((tFAQ: FAQItem)=>{
        //         if(tFAQ.title.toLowerCase().includes(this.searchQuery.toLowerCase()))
        //             return 1
        //         else if(tFAQ.content.toLowerCase().includes(this.searchQuery.toLowerCase()))
        //             return 1
        //         else 0
        //     })
        // })

        let _filteredGroup = this.originalGroups.forEach((tGroup: GroupItem)=>{
            tGroup.groupContent.forEach((faq: FAQItem)=>{
                _filteredFaq.push(faq)
            })
        })
            _filteredFaq = _filteredFaq.filter((tFAQ: FAQItem)=>{
                if(tFAQ.title.toLowerCase().includes(this.searchQuery.toLowerCase()))
                    return 1
                else if(tFAQ.content.toLowerCase().includes(this.searchQuery.toLowerCase()))
                    return 1
                else 0
            })
        // if(_filteredGroup && _filteredGroup.length > 0) 
        //     this.groupItems = _filteredGroup:null;
        console.log("search result", _filteredGroup, _filteredFaq);
        this.faqItems = _filteredFaq;
        if(this.faqItems && this.faqItems.length > 0) this.faqItems[0].expand = true;
        // let _filteredBooking = this.bookingList.filter((tBooking: TeeTimeBooking) => {
        //     if (this.selectedSearchOpt.type === 'bookingRef') return tBooking.bookingReference.trim().toLowerCase().includes(this.searchQuery.trim().toLowerCase())
        //     else if (this.selectedSearchOpt.type === 'mg2uId') {
        //         let _player;
        //         _player = tBooking.bookingPlayers.forEach((player: TeeTimeBookingPlayer) => {
        //             return (String(player.player.id) === this.searchQuery.trim())
        //         })
        //         if (!_player || _player.length === 0) {
        //             return String(tBooking.bookedByPlayer.id) === this.searchQuery.trim()
        //         }
        //     }

        //     // return tBooking.booking.trim().toLowerCase().includes(this.searchQuery.trim().toLowerCase())
        // }).sort((a, b) => {
        //     if (a.slotAssigned.startCourse.displayOrder < b.slotAssigned.startCourse.displayOrder)
        //         return -1;
        //     else if (a.slotAssigned.startCourse.displayOrder > b.slotAssigned.startCourse.displayOrder)
        //         return 1;
        //     else 0;
        // }).sort((a, b) => {
        //     if (a.slotAssigned.teeOffTime < b.slotAssigned.teeOffTime)
        //         return -1;
        //     else if (a.slotAssigned.teeOffTime > b.slotAssigned.teeOffTime)
        //         return 1;
        //     else 0;
        // });


        // console.log("on search input : ", this.selectedSearchOpt);
        // console.log("on search input : ", searchbar);
        // console.log("on search input : filteredBooking", _filteredBooking)
        // console.log("on search input : bookingList", _filteredBooking)
        // if (_filteredBooking.length > 0 && _filteredBooking.length === 1) {
        //     this.navCtrl.push(BookingDetailsPage, {
        //         fromClub: true,
        //         teeSlotNew: false,
        //         bookingSlot: _filteredBooking[0]
        //     })
        // } else if (_filteredBooking.length > 1) {
        //     this.filteredBooking = _filteredBooking;
        // }
        // this._clearAndRefresh(null, null);
    }
    onSearchCancel(searchbar) {
        // this._clearAndRefresh(null, null);
        
        this.searchingMode = false;
        this.onRefresh();
    }

    clickNotf() {
        this.storage.getPreference('notifications')
        .subscribe((a: Array<any>)=>{
            console.log("click notf 3", a)
            if(a && a.length > 0) {
                this.notfItems = a.reverse();
                this.notfItems.forEach((n)=>{
                    n.seeMore = false;
                    n.title = n.title.replace('myGolf2u :','')
                })
            }
        });
        // if(!this.notfItems || (this.notfItems && this.notfItems.length === 0)) 
        // this.notfItems = [{
        //     title: '1 myGolf2u : Booking Confirmed',
        //     body: 'Booking Confirmed Booking Confirmed Booking Confirmed Booking Confirmed Booking Confirmed Booking Confirmed',
        //     additionalData: {
        //         type: 'bookingConfirmation'
        //     }
        // },{
        //     title: '2 Competition Started',
        //     body: 'Competition Round has started Competition Round has started Competition Round has started Competition Round has started',
        //     additionalData: {
        //         type: 'bookingFailure'
        //     }
        // },{
        //     title: '3 myGolf2u : Flight Changed',
        //     body: 'Body mesage body message Body mesage body message Body mesage body messageBody mesage body message',
        //     additionalData: {
        //         type: 'flightsChanged'
        //     }
        // },{
        //     title: '4 Competition Started',
        //     body: 'Competition Round has started Competition Round has started Competition Round has started Competition Round has started',
        //     additionalData: {
        //         type: 'competitionRoundStarted'
        //     }
        // },{
        //     title: 'myGolf2u : Friend Requested',
        //     body: 'Body mesage body message Body mesage body message Body mesage body messageBody mesage body message',
        //     additionalData: {
        //         type: 'friendsRequested'
        //     }
        // }]
        // this.notfItems.forEach((item)=>{
        //     item.title = item.title.replace('myGolf2u :','')
        // });
        // if(this.notfItems && this.notfItems.length > 0) this.notfItems = this.notfItems.reverse();
    }

    onClearNotf(item) {
        let confirm = this.alertCtl.create({
            title  : "Clear Notification",
            message: "Do you want to clear this notification?",
            buttons: [
                {
                    text: 'No',
                    role: "cancel",

                    handler: () => {
                        confirm.dismiss();
                        return false;
                    }
                },
                {
                    text   : 'Clear',
                    // cssClass: 'delete-item',
                    role   : "delete",
                    handler: () => {
                        confirm.dismiss()
                               .then(() => {
                                   this.doClearNotf(item);
                               });
                        return false;
                    }
                }

            ]
        });
        confirm.present();
    }

    doClearNotf(item) {
        let _item = item;
        this.notfItems = 
        this.notfItems.filter((notf)=>{
            return notf !== _item
        });
        this.storage.setPreference('notifications',this.notfItems)
    }

    onClearAllNotf() {
        let confirm = this.alertCtl.create({
            title  : "Clear All Notifications",
            message: "Do you want to clear all notifications?",
            buttons: [
                {
                    text: 'No',
                    role: "cancel",

                    handler: () => {
                        confirm.dismiss();
                        return false;
                    }
                },
                {
                    text   : 'Yes',
                    // cssClass: 'delete-item',
                    role   : "delete",
                    handler: () => {
                        confirm.dismiss()
                               .then(() => {
                                   this.doClearAllNotf();
                               });
                        return false;
                    }
                }

            ]
        });
        confirm.present();
    }

    doClearAllNotf() {
        // let _item = item;
        this.notfItems = [];
        this.storage.setPreference('notifications',this.notfItems)
    }

    onNotificationsClick() { 
        // this.navCtrl.push(NotificationsPage);
    }

    getNotfTypeIcon(item: any) {
        let _path = 'assets/img/';
        let _image;
        if(!item) return;
        if(item && !item.additionalData) return;
        if(item && !item.additionalData.type) return ;
        let _type = item.additionalData.type;
        if(_type.toLowerCase().includes('bookin'))
            _image = 'home-icon-booking-registration.svg';
        else if(_type.toLowerCase().includes('competition'))
            _image = 'home-icon-tournament.svg';
        else if(_type.toLowerCase().includes('flights'))
            _image = 'club-icon-buggy.svg';
        else if(_type.toLowerCase().includes('friend'))
            _image = 'home-icon-friends.svg';
        else if(_type.toLowerCase().includes('scoring'))
            _image = 'book.png';
        else if(_type.toLowerCase().includes('profile'))
            _image = 'footer-icon-player.png';
        return _path + _image;
        // "bookingConfirmation"},
        // "bookingFailure"},
        // "competitionCancelled"},
        // "competitionInfoChange"},
        // "competitionRoundStarted"},
        // "flightsChanged","flightChanged":"01"},
        // "flightsChanged","flightChanged":"02"},
        // "flightsChanged","flightChanged":"2B"},
        // "flightsChanged","flightChanged":"Yes"},
        // "flightsGenerated"},
        // "friendRequest"},
        // "friendRequestAccepted"},
        // "scoringFinished"},
    }

    toggleMoreNotf(item) {
        item.seeMore = !item.seeMore;
    }

    
    onMyBookingsClick() {
        this.navCtrl.push(BookingHomePage);
    }
    
    onFAQClick() {
        // if(this.paymentClickedBoolean) return false;
        this.navCtrl.push(FaqPage)
    }
    
    openProfile() {
        this.navCtrl.push(ProfilePage, {
            type: 'playerProfile',
            // player: this.player$
        });
    }

}