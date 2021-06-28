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
import { NotificationsPage } from '../notifications/notifications';
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

export interface HelpURLs {
    server ? : string;
    url ? : string ;
}

export interface ContactUsItem {
        companyName?:string;
        companyRegNo?:string;
        companyAddress?:string;
        companyEmail?:string;
        companyWebsite?: string;
        phone1?:string;
        phone2?:string;
        fax?: string;
}
@Component({
    templateUrl: "contact-us.html",
    selector: "contact-us-page"
})
export class ContactUsPage implements OnInit, OnDestroy {

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
    contactUsItem: ContactUsItem;

    constructor(private navCtrl: NavController,
        private deviceService: DeviceService,
        private platform: Platform,
        private flightService: ClubFlightService) {
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
        this.flightService.getContactUs()
            .subscribe((contactUsItem: ContactUsItem ) => {
                if (contactUsItem) {
                    this.contactUsItem = contactUsItem
                    // this.originalGroups = this.groupItems
                                        // this.originalGroups.push(this.groupItems)
                }
                console.log("get contact us item", this.contactUsItem, contactUsItem)
                // console.log("get faq group items", this.groupItems, groupItems)
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
    onNotificationsClick() { 
        this.navCtrl.push(NotificationsPage);
    }
}