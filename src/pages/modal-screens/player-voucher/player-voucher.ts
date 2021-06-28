import {
    TeeTimeSlot,
    TeeTimeSlotDisplay,
    ClubCourseData,
    PlayerData,
    TeeTimeBooking,
    ClubInfo,
    ClubData,
    TeeTimeClubVoucher,
    TeeTimeBookingDiscount,
    TeeTimeClubVoucherSeries,
    PlayerTypes,
    DiscountPlayerClub,
    TeeTimeDiscount,
    TeeTimeBookingPlayer,
    PlayerDiscountProgram,
    DiscountCompany,
    DiscountCompanyProgram,
    BookingPlayerTypeDistribution,
    PlayerBookingTypeAssociation
} from './../../../data/mygolf.data';
import {
    Component
} from "@angular/core";
import {
    ViewController,
    NavParams,
    ToastController,
    Platform
} from "ionic-angular";
import {
    CourseInfo,
    CourseHoleInfo,
    createCourseInfo,
    createClubInfo
} from "../../../data/club-course";
import {
    ClubFlightService
} from "../../../providers/club-flight-service/club-flight-service";


import * as moment from "moment";
import {
    MessageDisplayUtil
} from '../../../message-display-utils';
import {
    ModalController
} from 'ionic-angular';
import {
    AddPlayerTypeDiscountModal
} from './add-player-type-discount/add-player-type-discount';
import {
    AlertController
} from 'ionic-angular';
import {
    PlayerInfo
} from '../../../data/player-data';
import {
    FromEventPatternObservable
} from 'rxjs/observable/FromEventPatternObservable';
import {
    RecentClubListPage
} from '../../performance/recent-club/recent-club';
import {
    NavController
} from 'ionic-angular';
import {
    BookingDetailsPage
} from '../../booking/booking-details/booking-details';
import { ImageZoom } from '../image-zoom/image-zoom';
import { ManageDiscountCardModal } from '../manage-discount-card/manage-discount-card';
import { JsonService } from '../../../json-util';
import { LoadingController } from 'ionic-angular';
import { ImageService,ImageData } from '../../../providers/image-service/image-service';
import { ContentType } from '../../../remote-request';
import { PlayerHomeActions } from '../../../redux/player-home';
import { ActionSheetController } from 'ionic-angular';
/**
 * Created by ashok on 19/12/16.
 */
@Component({
    templateUrl: 'player-voucher.html',
    selector: 'player-voucher-page'
})


export class PlayerVoucherModal {

    courses: Array < CourseInfo > ;
    clubId: number;
    forDate: string;
    isClub: boolean = false;
    courseId: number;
    teeSlot: Array < TeeTimeSlotDisplay > ;
    startCourses: Array < ClubCourseData > ;
    changeType: string;
    currentSlot: TeeTimeBooking;
    color: string;
    currentTime: string;
    mode: string;
    type: string;
    optionTypes: string = 'voucher';
    fromClub: boolean = false;
    forBooking: boolean = false;
    player: PlayerData;
    clubInfo: ClubData;
    who: string;
    // player: PlayerInfo;
    // mode: string;
    playerVoucher: Array < TeeTimeClubVoucher > ;
    voucherUsed: Array < TeeTimeClubVoucher > ;
    bookingId: number;
    searchVoucher: string;
    bookingDiscounts: Array < TeeTimeBookingDiscount > ;
    appliedVouchers: Array < TeeTimeClubVoucher > = new Array<TeeTimeClubVoucher>() ;
    clubData: ClubInfo = null;

    courseInfo: CourseInfo;
    isVoucherApplied: boolean = false;

    showVoucherActive: boolean = false;
    playerProfiles: Array < any >;

        playerTypes: Array < any > ;

    playerActiveClubDiscount: Array < TeeTimeDiscount > ;
    applicableClubDiscount: Array < TeeTimeDiscount > ;
    discountUsed: Array < TeeTimeDiscount > ;
    bookingPlayer: TeeTimeBookingPlayer;
    appliedBookingDiscounts: Array < TeeTimeBookingDiscount > ;
    overrideProfiles: Array<any> = new Array<any>();
    seriesClubInfo: Array<any>;
    voucherSeries: Array<TeeTimeClubVoucherSeries>;
    playerDiscountPrograms: Array<PlayerDiscountProgram>;
    pendingPDP: Array<PlayerDiscountProgram> = new Array<PlayerDiscountProgram>();

    showPlayerCard: boolean = false;
    activeClubDiscounts: Array<any> = new Array<any>();

    
    playerPendingDP: Array<PlayerDiscountProgram> = new Array<PlayerDiscountProgram>();
    playerApprovedDP: Array<PlayerDiscountProgram> = new Array<PlayerDiscountProgram>();

    assignedPlayerProfiles: Array<PlayerBookingTypeAssociation> = new Array<PlayerBookingTypeAssociation>();




    //   assert.equal(NoYes.No, 'No');
    //   assert.equal(NoYes.Yes, 'Yes');

    constructor(private viewCtrl: ViewController,
        private flightService: ClubFlightService,
        private navParams: NavParams,
        private toastCtl: ToastController,
        private platform: Platform,
        private modalCtrl: ModalController,
        private alertCtrl: AlertController,
        private navCtrl: NavController,
        private loadingCtl: LoadingController,
        private imageService: ImageService,
        private playerHomeActions: PlayerHomeActions,
        private actionSheetCtl: ActionSheetController) {
        this.courses = navParams.get("courses");
        this.clubId = navParams.get("clubId");
        this.forDate = navParams.get("forDate");
        this.courseId = navParams.get("courseId");
        this.changeType = navParams.get("changeType");
        this.currentSlot = navParams.get("currentSlot")
        if (this.changeType && this.changeType === 'slot') this.isClub = false;
        else if (this.changeType && this.changeType === 'course') this.isClub = true;
        this.mode = navParams.get("mode");
        this.type = navParams.get("type");
        this.fromClub = navParams.get("fromClub");
        this.forBooking = navParams.get("forBooking");
        this.player = navParams.get("player");
        this.clubInfo = navParams.get("clubInfo");
        this.who = navParams.get("who");

        this.bookingId = navParams.get("bookingId");
        this.bookingDiscounts = navParams.get("appliedVouchers");
        if (this.bookingDiscounts) {
            this.appliedVouchers = this.bookingDiscounts.filter((d: TeeTimeBookingDiscount) => {
                if(this.player && this.player.id) 
                    return d.voucherApplied && d.voucherApplied.playerAssigned.id === this.player.id
            }).map((d: TeeTimeBookingDiscount) => {
                return d.voucherApplied;
            });
        }
        console.log("init : booking Discounts - ", this.bookingDiscounts, this.appliedVouchers)

        this.bookingPlayer = this.navParams.get("bookingPlayer")
        //console.log("player voucher for : ", navParams.get("player"));
        //console.log("player voucher forBooking - " + this.forBooking + " | fromClub - " + this.fromClub);
        //console.log("player voucher for - player : ", this.player, navParams.get("player"));
        //console.log("player voucher for - club : ", this.clubInfo, navParams.get("clubInfo"));
        //console.log("player voucher for - bookingPlayer : ", this.bookingPlayer, navParams.get("bookingPlayer"));
        

        this.showPlayerCard = this.navParams.get("showPlayerCard");


        this.playerTypes = [{
                id: "ARMY",
                name: "Armed Forces",
                use: true,
            },
            {
                id: "GOVT",
                name: "Government",
                use: true,
            },
            {
                id: "GUEST",
                name: "Member's Guest",
                use: false,
            },
            {
                id: "JUNIOR",
                name: "Junior",
                use: true,
            },
            {
                id: "MEMBER",
                name: "Club Member",
                use: true,
            },
            {
                id: "POLICE",
                name: "Police",
                use: true,
            },
            {
                id: "SENIOR",
                name: "Senior Citizen",
                use: true,
            },
            {
                id: "STAFF",
                name: "Staff",
                use: true,
            }, {
                id: "TMEMBER",
                name: "Term Member",
                use: true,
            },
        ]
        this.playerTypes.sort((a, b) => {
            if (a.name < b.name) return -1
            else if (a.name > b.name) return 1
            else return 0
        });

        
        this.appliedBookingDiscounts = this.navParams.get("bookingDiscounts");
        if (this.appliedBookingDiscounts)
            this.appliedBookingDiscounts = this.appliedBookingDiscounts.filter((bd) => {
                return !bd.voucherApplied
            });
        if(this.currentSlot && this.currentSlot.priceMap) {
            let _priceMap = this.currentSlot.priceMap;
            for(let key in _priceMap) {
                this.overrideProfiles.push(key)
                //console.log("key - ", key)
            }
            //console.log("override profiles : ", this.overrideProfiles)
            this.overrideProfiles = this.overrideProfiles.filter((value)=>{
                return value !== 'MEMBER'
                // let _isApplicable; //: boolean = false;
                // _isApplicable = 
                // this.playerTypes.filter((pt)=>{
                //     // if(pt.id === value) _isApplicable = true; 
                //     return pt.id.toLowerCase() === value.toLowerCase()
                // })
                // if(value === 'MEMBER') return false
                // else if(_isApplicable) return !_isApplicable
                // // else if
                // else return true
            })
        }

        
        if (this.who === 'player' && this.forBooking) {
            if (this.type === 'voucher') {
                this.optionTypes = 'voucher';
                this.getListPlayerVoucher();
            } else if (this.type === 'types') {
                // this.setOptionType(1);
            }
            else if (this.type === 'discount') {
                // this.optionTypes = 'discount';
                this.setOptionType(2)
            }
        }
        else if (this.who === 'club' && this.forBooking) {
            if (this.type === 'voucher') {
                this.setOptionType(3)
                // this.optionTypes = 'voucher'
                // // this.getListClubPlayerVoucher();
                // this.getListPlayerVoucher();
                // if(this.fromClub) this.getPlayerVoucherSeries();
            }
            else if (this.type === 'types') {
                this.setOptionType(1);
            }
            else if (this.type === 'discount') {
                this.setOptionType(2);
            }
        } else {
            if (this.type === 'voucher') {
                this.setOptionType(3);
            }
            else if (this.type === 'types') {
                this.setOptionType(1);
            }
            else if (this.type === 'discount') {
                this.setOptionType(2);
            }
        }

    }

    getVisibleMode(optionType ? : string) {
        switch (optionType) {
            case 'types':
                if (this.mode === 'apply' && this.fromClub && this.forBooking) return true
                else if (this.mode === 'apply' && !this.fromClub && this.forBooking) return false
                else return true;
                // break;
            case 'discount':
                if (this.mode === 'apply' && this.fromClub && this.forBooking) return true
                else if (this.mode === 'apply' && !this.fromClub && this.forBooking) return true
                else return true;
            case 'voucher':
                if (this.mode === 'apply' && this.fromClub && this.forBooking) return true
                else if (this.mode === 'apply' && !this.fromClub && this.forBooking) return true
                else return true;
                // default:
                //     return true;
        }
        // if(this.mode==='apply' && optionType === 'voucher') {
        //     return true
        // } else return false;
    }

    getDisabledMode(optionType ? : string) {
        switch (optionType) {
            case 'types':
                if (this.mode === 'apply' && !this.forBooking) return true
                else if (this.mode === 'apply' && this.forBooking && this.fromClub) return false
                else if (this.mode === 'apply' && this.forBooking && !this.fromClub) return true
                // else if(this.mode === 'manage' && this.forBooking) return true
                else if(this.mode !== 'apply' && !this.forBooking) return false;
                else return true;
            case 'discount':
                if (this.mode === 'apply' && !this.forBooking) return false
                else return false;
            case 'voucher':
                if (this.mode === 'apply' && !this.forBooking) return false
                else return false;
        }
    }
    ionViewDidLoad() {
        // this.getTeeTimeBookingList();
    }
    ionViewDidLeave() {
        //console.log("need refresh?");
        // this.navParams.data
    }


    close() {
        // if(this.forBooking) {
        //     this.navCtrl.push(BookingDetailsPage, {
        //         needRefresh: true,
        //         fromPlayerVoucher: true,
        //         bookingSlot: this.currentSlot
        //     });

        // } else {
        //     this.viewCtrl.dismiss({
        //         needRefresh: true
        //     });
        // }

        let _needRefresh = this.isVoucherApplied;
        this.viewCtrl.dismiss({
            needRefresh: _needRefresh,
        });

    }

    selectHole(hole: CourseHoleInfo, whichNine: number) {
        this.viewCtrl.dismiss({
            hole: hole,
            whichNine: whichNine
        });
    }

    getTeeTimeBookingList() {
        let _clubCourseId;
        this.startCourses = []
        // let _courseId;
        // _courseId = this.courseId;
        _clubCourseId = this.isClub ? this.clubId : this.courseId
        this.flightService.getTeeTimeSlot(this.forDate, this.isClub, _clubCourseId)
            .subscribe((data: Array < TeeTimeSlotDisplay > ) => {
                this.teeSlot = data;
                if (this.changeType === 'course') {
                    this.teeSlot = this.teeSlot.filter((tee: TeeTimeSlotDisplay) => {
                        return tee.slot.teeOffTime === this.currentSlot.slotAssigned.teeOffTime && tee.slot.startCourse.id !== this.currentSlot.slotAssigned.startCourse.id
                    })
                } else {
                    this.teeSlot = this.teeSlot.filter((tee: TeeTimeSlotDisplay) => {
                        return tee.slot.teeOffTime !== this.currentSlot.slotAssigned.teeOffTime
                        // && (tee.slot.teeOffDate === moment().toDate() && (moment(tee.slot.teeOffTime,'HH:mm:ss').format('HH:mm') >= moment().format('HH:mm')))
                    })
                }


                this.teeSlot.forEach((t: TeeTimeSlotDisplay) => {
                    this.startCourses.push(t.slot.startCourse);
                })

                this.startCourses = this.getUnique(this.startCourses, 'id')
                this.startCourses.sort((a, b) => {
                    if (a.displayOrder < b.displayOrder) return -1
                    if (a.displayOrder > b.displayOrder) return 1
                    else 0
                })



                //console.log("change - ", this.changeType)
                //console.log("tee time booking slot ", this.teeSlot, this.startCourses)
            })
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


    changeSlot(slot: TeeTimeSlotDisplay, type ? : string) {
        //console.log("new slot ", slot)
        if (!slot.available && type === 'slot') return false;
        // && type === 'course'
        this.flightService.getBookingFlightList(this.clubId, moment(slot.slot.teeOffDate).format('YYYY-MM-DD'), true)
            .subscribe((data) => {
                //console.log("get slot", data)
                let _flightList: Array < TeeTimeBooking >
                    let _hasFlight: Array < TeeTimeBooking > ;
                if (data) {
                    _flightList = data.flightList;
                    _hasFlight = _flightList.filter((t: TeeTimeBooking) => {
                        return (t.slotAssigned.slotNo === slot.slot.slotNo) && (t.slotAssigned.slotDayId === slot.slot.slotDayId)
                    })


                }
                if (_hasFlight && _hasFlight.length > 0) {

                    //console.log("has flight length", _hasFlight)
                    if (_hasFlight[0].flight && _hasFlight[0].flight.status === 'PlayFinished') {
                        //console.log("flight finished")
                        MessageDisplayUtil.showMessageToast('There is Finished Flight in this slot. Please choose different slot.',
                            this.platform, this.toastCtl, 3000, "bottom");
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
                //console.log("has flight", _hasFlight)
            })
        // if(1) return false;

    }
    // changeSlot(slot: TeeTimeSlotDisplay) {
    //     //console.log("new slot ", slot)
    //     if(!slot.available) return false;
    //     this.viewCtrl.dismiss({
    //         newSlot: slot,
    //         currentSlot: this.currentSlot
    //     });
    // }

    getSlotDetails(slot: TeeTimeSlotDisplay, attribute: string) {
        switch (attribute) {
            case 'time':
                let _time = moment(slot.slot.teeOffTime, 'HH:mm:ss').format('hh:mm A');
                return _time;
        }
    }

    getCurrentSlotDetails(attribute) {
        switch (attribute) {
            case 'time':
                let _time = moment(this.currentSlot.slotAssigned.teeOffTime, 'HH:mm:ss').format('hh:mm A');
                return _time;
            case 'courseName':
                let _courseName = this.currentSlot.slotAssigned.startCourse.name;
                return _courseName;
        }
    }

    getSlotClass(slot: TeeTimeSlotDisplay) {
        // if(slot.available) this.color = 'danger';
        // else this.color = 'primary'

        if (this.changeType === 'course') return 'slot-available'
        else {
            // return this.color
            if (slot.available) return 'slot-available';
            else return 'slot-not-available'
        }
    }

    setOptionType(type: number) {
        if (type === 1) {
            this.optionTypes = 'types';
            if (this.mode === 'apply' && this.forBooking) {
                this.getApplicablePlayerProfiles();
                this.getAssignedPlayerTypes()
            } else if(this.mode !== 'apply') {
                this.getAssignedPlayerTypes()
            }
            // this.friendScreenName = 'Search';
            // if (this.platform.is("ios") && this.platform.is("cordova")) {
            //     this.keyboard.close();
            // }
        }
        if (type === 2) {
            //console.log("set option type 2", this.mode, this.forBooking)
            this.optionTypes = 'discount';

            let loader = this.loadingCtl.create({
                content: "Getting Discounts...",
                showBackdrop: false,
                duration: 5000
            });
            if (this.mode === 'apply' && this.forBooking) {
                this.getBookingFlight();
                // this.getActiveClubDiscounts();
                this.getApplicableDiscountsForPlayer();
                this.getApplicableDiscounts();
                this.getPendingPlayerDiscountCard('approved');
            }
            this.getPlayerDiscountPrograms(loader);
            // this.friendScreenName = 'My Bookings';
            // this._refreshRequest(null, null);
            // this.refreshActiveBooking();
            // if (this.platform.is("ios") && this.platform.is("cordova")) {
            //     this.keyboard.close();
            // }
        }
        if (type === 3) {
            this.getListPlayerVoucher();
            if(this.mode === 'apply' && this.forBooking) {
                this.getBookingFlight();
            }
            this.optionTypes = 'voucher';
            // if(this.who === 'player' && this.forBooking && this.mode === 'apply') {
            //     this.getListPlayerVoucher('single');
            // } else {
            //     this.getListPlayerVoucher('multi');
            // }
        }

    }
    onApprovalList(pdp: PlayerDiscountProgram, type?: string) {
        let headerTitle;
        switch (type) {
            // case 'playerType':
            //     headerTitle = 'Edit Player Type';
            //     MessageDisplayUtil.showErrorToast('This feature is not yet supported', this.platform, this.toastCtl,
            //         5000, "bottom");
            //     break;
            case 'playerDiscount':
                headerTitle = 'Privilege Card Approval List';
                // MessageDisplayUtil.showErrorToast('This feature is not yet supported', this.platform, this.toastCtl,
                //     5000, "bottom");
                break;
            // case 'playerVoucher':
            //     headerTitle = 'Manage Voucher(s)';
            //     break;
        }
        let typeModal = this.modalCtrl.create(AddPlayerTypeDiscountModal, {
            headerTitle: headerTitle,
            type: type, //playerType, playerDiscount, playerVoucher
            mode: 'approval', //new edit
            pdp: pdp,
            player: this.player,
        });
        typeModal.onDidDismiss((data: any) => {
            if (data) {

            }

        });
        typeModal.present();
    }

    onEditClick(pdp: PlayerDiscountProgram, type ? : string) {
        let headerTitle;
        switch (type) {
            case 'playerType':
                headerTitle = 'Edit Player Type';
                MessageDisplayUtil.showErrorToast('This feature is not yet supported', this.platform, this.toastCtl,
                    5000, "bottom");
                break;
            case 'playerDiscount':
                headerTitle = 'Edit Privilege Card';
                // MessageDisplayUtil.showErrorToast('This feature is not yet supported', this.platform, this.toastCtl,
                //     5000, "bottom");
                break;
            case 'playerVoucher':
                headerTitle = 'Manage Voucher(s)';
                break;
        }
        let typeModal = this.modalCtrl.create(AddPlayerTypeDiscountModal, {
            headerTitle: headerTitle,
            type: type, //playerType, playerDiscount, playerVoucher
            mode: 'edit', //new edit
            pdp: pdp,
            player: this.player,
        });


        let _deleteMultiDone: boolean = false;
        typeModal.onDidDismiss((data: any) => {
            if (data) {
                if(data.created) this.setOptionType(2);
            }

        });
        typeModal.present();

    }

    onAddClick(type ? : string) {
        let headerTitle;
        let _data;
        switch (type) {
            case 'playerType':
                headerTitle = 'Add Player Type';
                break;
            case 'playerDiscount':
                headerTitle = 'Add Discount Card';
                _data = this.playerDiscountPrograms;
                break;
            case 'playerVoucher':
                headerTitle = 'Manage Voucher(s)';
                break;
        }

        //console.log("on add click type - ", type);
        //console.log("on add click type - ", headerTitle);
        //console.log("on add click type - ", _data, this.playerDiscountPrograms);
        //console.log("on add click type - ", this.player);
        let typeModal = this.modalCtrl.create(AddPlayerTypeDiscountModal, {
            headerTitle: headerTitle,
            type: type, //playerType, playerDiscount, playerVoucher
            mode: 'new', //new edit
            player: this.player,
            forBooking: this.forBooking,
            fromClub: this.fromClub,
            clubId: this.clubInfo&&this.clubInfo.id?this.clubInfo.id:null,
            data: _data,
        });


        let _deleteMultiDone: boolean = false;
        typeModal.onDidDismiss((data: any) => {
            //console.log("after add : ", data)
            if (data && data.created) {
                setTimeout(()=>{
                    // this.getPlayerDiscountPrograms();
                    if(type === 'playerType') this.setOptionType(1);
                    else if(type === 'playerDiscount') this.setOptionType(2);
                },1000)
            }

        });
        typeModal.present();
    }

    onRemoveClick(data: any, type ? : string ) {
        let headerTitle;
        let message;
        switch (type) {
            case 'playerType':
                headerTitle = 'Removing Player Type';
                message = 'Do you want to remove selected Player Type?';
                break;
            case 'playerDiscount':
                headerTitle = 'Removing Discount Card';
                message = 'You will lose privilege/discount deals by the club. Do you want to proceed?';
                break;
            case 'playerVoucher':
                headerTitle = 'Removing Voucher';
                message = 'Do you want to remove selected Voucher?';
                break;
        }
        let prompt = this.alertCtrl.create({
            title: headerTitle,
            message: message,
            // inputs: [{
            //     name: 'title',
            //     placeholder: 'Group Name'
            // }, ],
            buttons: [{
                    text: 'No',
                    // handler: data => {
                    //     prompt.dismiss().then(() => {
                    //         this.keyboard.close();
                    //     });
                    //     return false;
                    // }
                },
                {
                    text: 'Yes',
                    handler: (()=>{
                        this.goRemoveDiscount(data);
                    })
                    // handler: data => {
                    //     _required = '';
                    //     if (data.title)
                    //         prompt.dismiss().then(() => {
                    //             this._createPlayerGroup(data.title);
                    //         })
                    //     else {
                    //         // _required = 'Please enter Group Name';
                    //         // _message = '<br>Please enter the Group Name';
                    //         let msg = MessageDisplayUtil.getErrorMessage('', "Please enter Group name");
                    //         MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl,
                    //             5000, "bottom");
                    //     }
                    //     return false;
                    // }
                }
            ]
        });
        prompt.present();
    }

    onSearchVoucherClick() {
        //console.log("club id : " + this.clubInfo, " | player id : " + this.player ? this.player : '---');
        this.playerVoucher = [];
        let _clubId;
        let _playerId;
        if (this.clubInfo) _clubId = this.clubInfo.id;
        if (this.player) _playerId = this.player.playerId;

        // if(this.searchVoucher && this.searchVoucher.length > 0) {
        //     this.playerVoucher = this.playerVoucher.filter((v: TeeTimeClubVoucher)=>{
        //         return v.voucherNumber.toLowerCase().includes(this.searchVoucher.toLowerCase()) || 
        //         v.name.toLowerCase().includes(this.searchVoucher.toLowerCase())
        //     })
        // } else this.playerVoucher = this.playerVoucher;

        this.flightService.getListPlayerVouchers(_playerId)
            .subscribe((playerVoucher: Array < TeeTimeClubVoucher > ) => {
                //console.log("get voucher list", playerVoucher)
                if (playerVoucher && playerVoucher.length > 0)
                    if (this.searchVoucher && this.searchVoucher.length > 0) {
                        this.playerVoucher = playerVoucher.filter((v: TeeTimeClubVoucher) => {
                            return v.voucherNumber.toLowerCase().includes(this.searchVoucher.toLowerCase()) ||
                                v.name.toLowerCase().includes(this.searchVoucher.toLowerCase())
                        })
                    } else this.playerVoucher = playerVoucher;
            });


        // this.flightService.getListClubPlayerVouchers(_clubId, _playerId)
        // .subscribe((data: Array<TeeTimeClubVoucher>)=>{
        //     //console.log("get voucher list", data)
        //     if(data) {
        //         this.playerVoucher = data.filter((v: TeeTimeClubVoucher)=>{
        //             return v.voucherNumber.toLowerCase().includes(this.searchVoucher.toLowerCase()) || 
        //             v.name.toLowerCase().includes(this.searchVoucher.toLowerCase())
        //         })
        //     }
        // });
    }

    getListClubPlayerVoucher(clubId ? : number) {
        let _clubId;
        let _playerId;
        this.playerVoucher = [];
        if (clubId) _clubId = clubId;
        else if (this.clubInfo) _clubId = this.clubInfo.id;
        // if(this.player) _playerId = this.player.id;
        if (this.player) _playerId = this.player.id | this.player.playerId;
        this.flightService.getListClubPlayerVouchers(_clubId, _playerId)
            .subscribe((playerVoucher: Array < TeeTimeClubVoucher > ) => {
                //console.log("get voucher list", playerVoucher)
                if (playerVoucher && playerVoucher.length > 0) {
                    this.playerVoucher = playerVoucher;
                    if(clubId) {
                        this.seriesClubInfo = playerVoucher.filter((voucher)=>{
                            if(!voucher.club) return false
                            return voucher.club.id === _clubId
                            // let _hasVoucher;
                            // _hasVoucher = voucher.club.find((c)=>{
                            //     return c.id === _clubId
                            // }) 
                            // return _hasVoucher
                        }).map((v)=>{
                            return v.club;
                        })
                        //console.log("player voucher series club info ", this.seriesClubInfo);
                    }
                }
                //     .filter((v: TeeTimeClubVoucher)=>{
                //         return !v.redeemed
                //    });
            })
    }
    getVoucherApplicableText(voucher: any, type: string) {
        // TeeTimeClubVoucherSeries | TeeTimeClubVoucher
        if (!voucher) return false;
        let _allowText;
        let _applicableStart = 'Applicable on';
        let _allowWeekdays;
        let _allowWeekends;
        let _allowHolidays;
        let _applicableEnd = '';
        let _voucherDetails = voucher;
        if (type === 'allowDays') {
            // _allowWeekdays = voucher.allowOnWeekdays?'Weekdays':'';
            // _allowWeekends = voucher.allowOnWeekends?'Weekends':'';
            // _allowHolidays = voucher.allowOnPublicHolidays?'Public Holidays':'';

            // if(voucher && voucher.allowOnWeekdays) {
            //     _allowWeekdays = 'Weekdays';
            // } else _allowWeekdays = '';
            // if(voucher && voucher.allowOnWeekends) {
            //     _allowWeekends = 'Weekends';
            // } else _allowWeekends = '';
            // if(voucher && voucher.allowOnPublicHolidays) {
            //     _allowHolidays = 'Public Holidays'
            // } else _allowHolidays = '';

            _allowWeekdays = (voucher && voucher.allowOnWeekdays && (voucher.allowOnWeekends && voucher.allowOnPublicHolidays) ? 'Weekdays' + ', ' : voucher && voucher.allowOnWeekdays ? 'Weekdays' : '');
            _allowWeekends = (voucher && voucher.allowOnWeekends && (voucher.allowOnWeekdays) && voucher.allowOnPublicHolidays)? 'Weekends' : (voucher && voucher.allowOnWeekdays && voucher.allowOnWeekends && !voucher.allowOnPublicHolidays) ? ' and ' + 'Weekends' : (voucher && !voucher.allowOnWeekdays && voucher.allowOnWeekends)?'Weekends':'';
            _allowHolidays = (voucher && ((voucher.allowOnWeekdays || voucher.allowOnWeekends) && voucher.allowOnPublicHolidays) ? ' and ' + 'Public Holidays' : voucher && voucher.allowOnPublicHolidays ? 'Public Holidays' : '');

            _allowText =
                _applicableStart + ' ' +
                _allowWeekdays +
                _allowWeekends +
                _allowHolidays;

            // //console.log("applicable text ", _allowText);
            // //console.log("applicable text ", _applicableStart);
            // //console.log("applicable text ", _allowWeekdays, _allowWeekdays, _allowHolidays);
            // //console.log("applicable text ", (voucher && (voucher.allowOnWeekends || voucher.allowOnPublicHolidays) ? _allowWeekdays + ', ' : ''));
            // //console.log("applicable text ", (voucher && voucher.allowOnPublicHolidays ? _allowWeekends + ', ' : ''));
            // //console.log("applicable text ", (voucher && (voucher.allowOnWeekdays || voucher.allowOnWeekends) ? ' and ' + _allowHolidays : ''));

            // if(voucher.allowOnWeekdays && voucher.allowOnWeekends && voucher.allowOnPublicHolidays) 
            // _allowText = 'Applicable on Weekdays, Weekends and Public Holidays';
            // else if(!voucher.allowOnWeekdays && voucher.allowOnWeekends && voucher.allowOnPublicHolidays) 
            // _allowText = 'Applicable on Weekends and Public Holidays';
            // else if(!voucher.allowOnWeekdays && !voucher.allowOnWeekends && voucher.allowOnPublicHolidays) 
            // _allowText = 'Applicable only on Public Holidays';
            // else if()
            // else _allowText = 'Applicable to these days';
        } else if (type === 'bookingAmount') {
            _allowText = 'Covers ';
            if(!_voucherDetails.priceComps || _voucherDetails.priceComps.length === 0)
                _allowText += 'Booking Amount';
            else {
                
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
            //console.log("pre filter - buggy fee ", _buggyFee)
            //console.log("pre filter - caddy fee ", _caddyFee)
             
            _voucherDetails.priceComps = _voucherDetails.priceComps.filter((price)=>{
                if(_buggyFee.length === 2) return price.priceComponent.id.toLowerCase() !== 'hbuggyfee'
                if(_caddyFee.length === 2) return price.priceComponent.id.toLowerCase() !== 'hcaddyfee'
                else return true
            });
            
            // if(!_discountDetails.priceComponents || _discountDetails.priceComponents.length === 0) return '';
            if(_voucherDetails && _voucherDetails.priceComponents && _voucherDetails.priceComponents.length > 0)
                _allowText += _voucherDetails.priceComponents
                    .map((a) => {
                        return a.priceComponent.name
                    }).reduce((a, b) => {
                        return a + ', ' + b;
                    })
            }
        } else if (type === 'flight') {
            _allowText = 'Applicable for this flight';
        }

        return _allowText;

    }

    onUseThisVoucher(voucher: TeeTimeClubVoucher) {
        let prompt = this.alertCtrl.create({
            title: 'Use Voucher',
            message: 'This will apply voucher to current booking flight. Do you want to proceed?',
            // inputs: [{
            //     name: 'title',
            //     placeholder: 'Group Name'
            // }, ],
            buttons: [{
                    text: 'No',
                    handler: data => {
                        prompt.dismiss()
                        return false;
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        
                        this.goUseThisVoucher(voucher);
                        prompt.dismiss();
                        // prompt.dismiss().then(()=>{
                        // })
                        return false;
                    }
                }
            ]
        });
        prompt.present();
    }

    getSingleVoucher(v: TeeTimeClubVoucherSeries) {
        let _voucherSeries = v;
        let _selectedVoucher: TeeTimeClubVoucher;
        let _playerVoucher: Array < TeeTimeClubVoucher > ;
        // _selectedVoucher = 
        _playerVoucher.filter((v: TeeTimeClubVoucher) => {
            return v.seriesId === _voucherSeries.id
        }).map((v: TeeTimeClubVoucher) => {
            _selectedVoucher = v
        });
    }

    goUseThisVoucher(voucher: TeeTimeClubVoucher) {
        let _voucherUsed: boolean = false;
        if (this.voucherUsed && this.voucherUsed.length > 0) _voucherUsed = true;
                // if(!this.appliedVouchers || (this.appliedVouchers && this.appliedVouchers.length === 0)) return false;

        let _voucher = voucher;
        if (!_voucher.usableWithOtherRewards && this.voucherUsed) {
            MessageDisplayUtil.showMessageToast('This voucher cannot be used with any other voucher',
                this.platform, this.toastCtl, 3000, "bottom")
            return false;
        }
        let _playerId = this.player.id;
        //console.log("go use this voucher ", voucher, "- applied vouchers ", this.appliedVouchers)
        let _hasApplied = [];
        if(this.appliedVouchers && this.appliedVouchers.length > 0) {
            _hasApplied =
            this.appliedVouchers.filter((bd)=>{
                return bd.playerAssigned.id === _playerId && bd.seriesId ===  voucher.seriesId
            })
        } else _hasApplied = [];
        if(_hasApplied && _hasApplied.length>0) {
            MessageDisplayUtil.showMessageToast("This player's voucher has been used for this booking.", 
            this.platform, this.toastCtl,3000, "bottom")
            return false;
        }

        let _force: boolean = false;
        this.flightService.applyPlayerBookingVoucher(this.bookingId, _voucher.id, _force)
            .subscribe((data: any) => {
                if (data) {
                    // this.voucherUsed.push(voucher);
                    //console.log("apply player booking voucher : ", data)
                    MessageDisplayUtil.showMessageToast('Successfully applied voucher', this.platform, this.toastCtl, 3000, "bottom")
                    // this.getListClubPlayerVoucher();
                    this.getListPlayerVoucher();
                    this.isVoucherApplied = true;
                    let _data = data.json();
                    let _bookingDiscounts = _data.bookingDiscounts;
                    

                    this.appliedVouchers = _bookingDiscounts.filter((d: TeeTimeBookingDiscount) => {
                        return d.voucherApplied && d.voucherApplied.playerAssigned.id === this.player.id
                    }).map((d: TeeTimeBookingDiscount) => {
                        return d.voucherApplied;
                    });
                }
            }, (error) => {
                let _error = error.json();
                //console.log("error voucher : ", error);
                //console.log("error voucher : ", _error);
                let _msg = _error&&_error.errors&&_error.errors.length>0?_error.errors[0]:_error.error;
                if(_error.errorCode.includes('VoucherNotApplicableWithOtherPromotions'))
                        _msg = "This voucher is not usable with other discounts and vouchers.";
                MessageDisplayUtil.showErrorToast(_msg,
                    this.platform, this.toastCtl, 3000, "bottom")
                return false;
            }, () =>{
                if(this.forBooking) this.getBookingFlight();
            })


    }

    getDateText(date: string) {
        if (date && date.length === 0) return false;
        if (!date) return false;
        let _date = date;
        return moment(_date, 'YYYY-MM-DD').format("DD MMM YYYY");
    }

    onRemoveThisVoucher(voucher: TeeTimeClubVoucher) {
        let prompt = this.alertCtrl.create({
            title: 'Remove Voucher',
            message: 'This will remove voucher from current booking flight. Do you want to proceed?',
            // inputs: [{
            //     name: 'title',
            //     placeholder: 'Group Name'
            // }, ],
            buttons: [{
                    text: 'No',
                    // handler: data => {
                    //     return false;
                    // }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.goRemoveThisVoucher(voucher);
                        prompt.dismiss();
                        return false;
                    }
                }
            ]
        });
        prompt.present();
    }

    goRemoveThisVoucher(voucher: TeeTimeClubVoucher, applyVoucher?: any) {
        // //console.log("voucher : ", voucher)
        this.flightService.removePlayerBookingVoucher(this.bookingId, voucher.id)
            .subscribe((data: any) => {
                if (data) {
                    
                    let _data = data.json();
                    let _bookingDiscounts = _data.bookingDiscounts;
                    
                    this.appliedVouchers = _bookingDiscounts.filter((d: TeeTimeBookingDiscount) => {
                        return d.voucherApplied && d.voucherApplied.playerAssigned.id === this.player.id
                    }).map((d: TeeTimeBookingDiscount) => {
                        return d.voucherApplied;
                    });

                    // this.getListClubPlayerVoucher();
                    this.getListPlayerVoucher();
                    this.isVoucherApplied = true;
                    // //console.log("Removing this voucher : ", data);
                    // this.refreshBookingObject(data.json())
                }
            }, (error) => {
                // //console.log("remove voucher error : ", error)
                let _error = error.json();
                let alert = this.alertCtrl.create({
                    title: 'Issue removing voucher',
                    // subTitle: 'Selected date is '+ _date,
                    message: _error && _error.message ? _error.message : 'There\'s an issue removing voucher. Please try again', //'Selected date is ' + '<b>' + _date + '</b>',
                    buttons: ['Close']
                });
                alert.present();
            }, () =>{
                if(this.forBooking) this.getBookingFlight();
                // if(applyVoucher) this.goUseThisVoucherSeries(applyVoucher)
            })
    }

    getListPlayerVoucher() {
        let _clubId;
        // if (clubId) _clubId = clubId;
        // else 
        if (this.clubInfo) _clubId = this.clubInfo.id;
        let _playerId;
        this.playerVoucher = [];
        if (this.player) _playerId = this.player.id | this.player.playerId;
        this.flightService.getListPlayerVouchers(_playerId)
            .subscribe((playerVoucher: Array < TeeTimeClubVoucher > ) => {
                //console.log("get voucher list", playerVoucher)
                if (playerVoucher && playerVoucher.length > 0) {
                    this.playerVoucher = playerVoucher;

                    if(_clubId) {
                        this.seriesClubInfo = playerVoucher.filter((voucher)=>{
                            if(!voucher.club) return false
                            return voucher.club.id === _clubId;
                            // let _hasVoucher;
                            // _hasVoucher = voucher.club.filter((c)=>{
                            //     return c.id === _clubId
                            // }) 
                            // return _hasVoucher
                        }).map((v)=>{
                            return v.club;
                        })
                        if(this.seriesClubInfo && this.seriesClubInfo.length > 0) {
                            this.seriesClubInfo = this.getUnique(this.seriesClubInfo, 'id');
                            this.seriesClubInfo.forEach((club)=>{
                                this.getPlayerVoucherSeries(club);
                            })
                        }
                        //console.log("player voucher series club info ", this.getUnique(this.seriesClubInfo, 'id'));
                    } else {
                        this.seriesClubInfo = playerVoucher.map((v)=>{
                            return v.club;
                        })
                        if(this.seriesClubInfo && this.seriesClubInfo.length > 0) {
                            this.seriesClubInfo = this.getUnique(this.seriesClubInfo, 'id');
                            this.seriesClubInfo.forEach((club)=>{
                                this.getPlayerVoucherSeries(club);
                            })
                        }
                        //console.log("player voucher series club info ", this.getUnique(this.seriesClubInfo, 'id'));
                        
                    }
                    // this.getPlayerVoucherSeries()
                }
                //     .filter((v: TeeTimeClubVoucher)=>{
                //         return !v.redeemed
                //    });
            })
    }

    getVoucherCurrency(voucher: TeeTimeClubVoucher) {
        let _currencySymbol = this.clubInfo && this.clubInfo.address ? this.clubInfo.address.countryData.currencySymbol : '';
        return _currencySymbol
    }

    goClubPicklist() {
        let _courseId;
        let _courseName;
        // //console.log("Analysis Type:", this.analysisType)
        // //console.log("Check:before", this.checkboxCourse)
        let club = this.modalCtrl.create(RecentClubListPage, {
            //analysisType: "analysis",
            courseInfo: this.courseInfo,
            openedModal: true,
            courseType: 'club',
            clubData: this.clubData

        });

        club.onDidDismiss((data: any) => {
            if (data.clubInfo) {
                this.clubData = data.clubInfo;
                this.courseInfo = createCourseInfo();
                this.getListClubPlayerVoucher(this.clubData.clubId);
            }
            // this.clubName = this.clubInfo.clubName;
            // //console.log("Type club", this.courseType)
            // //console.log("club infO?", this.clubInfo)
        });

        club.present();

    }

    getClubName(): string {
        let clubName = 'Tap here to view by Club';
        // //console.log("getClubName()", this.clubInfo)
        let _clubName;
        if (this.clubData && this.clubData.clubName) {
            // && (this.clubInfo.clubName | this.clubInfo.name)
            // _clubName = this.clubData.clubName;
            // return _clubName;
            return this.clubData.clubName;
        } else return clubName;
    }
    getClubImage(club: ClubInfo) {

        if (club) return club.clubImage;
        else 'img/default_club.png'
    }

    clearClubPicklist() {
        this.clubData = null;
        this.getListPlayerVoucher();
    }

    getExpiryDate(item: TeeTimeClubVoucher | TeeTimeDiscount, type ? : string) {
        if (!item) return '';
        if (item && !item.validFrom && !item.validUntil) return '';
        let _validTill;
        let _validFrom;

        let _today = moment();
        let _voucher;
        if(this.playerVoucher && this.playerVoucher.length > 0 && type !== 'discount') {
            _voucher = this.playerVoucher.filter((voucher)=>{
                return voucher.seriesId === item.id
            })
        }
        switch (type) {
            case 'discount':
                _validTill = moment(item.validUntil);
                _validFrom = moment(item.validFrom);
                break;
            default:
                let _until = moment(item.validUntil);
                if(_until.diff(_today, 'days') < 0) {
                    _validTill = moment(item.validUntil);
                    _validFrom = moment(item.validFrom);
                } else if(_voucher && _voucher.length > 0) {
                    _validTill = moment(_voucher[0].validUntil);
                    _validFrom = moment(_voucher[0].validFrom);
                } else {
                    _validTill = moment(item.validUntil);
                    _validFrom = moment(item.validFrom);
                }
                break;
        }
        // let _started = _validFrom.diff(_today, 'days');
        let _days = _validTill.diff(_today, 'days');
        let _months = _validTill.diff(_today, 'months');
        let _years = _validTill.diff(_today, 'years');
        //console.log('[voucher]-',type,' : ', moment(_today).format('YYYY-MM-DD'), '_days', _days, '_months',_months,'_years', _years, 'validTill', moment(_validTill).format('YYYY-MM-DD'))
        //console.log('[voucher] - item :  ', item, item.validUntil, item.validFrom, _validFrom, _validTill);
        //console.log('[voucher] - player voucher : ', this.playerVoucher)
        //console.log('[voucher] - voucher series : ', this.voucherSeries)
        if (_days > 0 && _months === 0) return 'Expires in ' + _days + ' day(s)';
        else if(_months > 0 && _years === 0) return 'Expires in ' + _months + ' month(s)'; 
        else if(_years > 0 && _years <= 100) return 'Expires in ' + _years + ' year(s)';
        else if(_years > 100) return 'No Expiry';
        else if (_days === 0) return 'Expires today';
        else if (_days < 0) return 'Expired';
        else return 'Expired';
        // return _started + ' | ' + _expireText + 'days';
    }

    toggleVoucherActive() {
        this.showVoucherActive = !this.showVoucherActive;
    }

    getVoucherAmountDetails(voucher: TeeTimeClubVoucher) {
        if (voucher.voucherAmountType === 'Absolute') {
            return 'Amount ' + this.getVoucherCurrency(voucher) + " " + voucher.voucherAmount
        } else if (voucher.voucherAmountType === 'Fixed') {
            return 'Amount ' + this.getVoucherCurrency(voucher) + " " + voucher.voucherAmount
        } else if (voucher.voucherAmountType === 'Percentage') {
            return voucher.voucherAmount + '% off';
        } else return false;

    }

    getProgramAmountDetails(program: PlayerDiscountProgram) {
        if(!program || !program.discountProgram.discountCompany.address) return false;
        let _currency = program.discountProgram.discountCompany.address.countryData.currencySymbol;
        let _discountProgram = program.discountProgram;
        if (_discountProgram.amountType === 'Absolute') {
            return 'Save ' + _currency + " " + _discountProgram.discountAmount
        } else if (_discountProgram.amountType === 'Fixed') {
            return 'Up to ' + _currency + " " + _discountProgram.discountAmount
        } else if (_discountProgram.amountType === 'Percentage') {
            return _discountProgram.discountAmount + '% off';
        } else return false;

    }

    getPlayerVoucherSeries(clubs: ClubData) {
        this.voucherSeries = [];
        
        if(this.mode === 'apply' && !this.currentSlot) return false;
        if(this.mode === 'apply' && this.currentSlot.slotAssigned && this.currentSlot.slotAssigned.pricingPlanPromotional 
            && !this.currentSlot.slotAssigned.pricingPlanPromotional.discountsApplicable) return false;
       
        let _showAll: boolean = false;
        if(this.mode !== 'apply') _showAll = true;
        let voucherSeries:  Array<TeeTimeClubVoucherSeries> = [];
        this.flightService.getClubVoucherSeries(1, clubs.id, '',null,null, _showAll)
        .subscribe((data: any)=>{
            //console.log("player voucher series ", data);
            if(data.totalInPage > 0 && data.items && data.items.length > 0) {
                voucherSeries = data.items;
                if(voucherSeries) {
                    this.voucherSeries.push(...voucherSeries);
                    // if(clubs.playerVoucher&&clubs.playerVoucher.length > 0) {
                    //     voucherSeries.filter((vs)=>{
                    //         let isSeries;
                    //         clubs.playerVoucher.filter((voucher)=>{
                    //             return voucher.seriesId === vs.id
                    //         }).map((v)=>{
                    //             isSeries = true;
                    //         });
                    //     }).map((vs)=>{
                    //         voucherSeries.push(vs);
                    //     })
                    this.voucherSeries.forEach((vs)=>{
                        JsonService.deriveFulImageURL(vs, 'voucherImage')
                    });

                    this.voucherSeries = this.voucherSeries.sort((a,b)=>{
                        if(a.club.name < b.club.name) {
                            if(a.validUntil < b.validUntil) return 1;
                            else if(b.validUntil < a.validUntil) return -1;
                            else return -1
                        } else if(a.club.name > b.club.name) {
                            if(a.validUntil < b.validUntil) return 1;
                            else if(b.validUntil < a.validUntil) return -1;
                            else return 1
                        } else return 0
                    })
                    } 
                    // if(voucherSeries) {
                    //     clubs.filter((c: ) =>{
                    //         return c.club.id === clubs.club.id;
                    //     }).map((c: any)=>{
                    //         c.voucherSeries = voucherSeries; //this.voucherSeries;
                    //     });
                    // }
                }
                //console.log("voucher series ", this.voucherSeries, voucherSeries)
             });
    }

    getApplicablePlayerProfiles() {
        this.playerProfiles = [];
        let _clubId = this.clubInfo ? this.clubInfo.id : null;
        if (!_clubId) return false;
        if(!this.player) return false;
        let _playerId = this.player.id || this.player.playerId;
        //console.log("player profiles", _clubId, _playerId, this.player)
        this.flightService.getApplicableClubPlayerTypes(_clubId, _playerId)
            .subscribe((data) => {
                //console.log("applicable player profiles : ", data, this.overrideProfiles);
                let _hasProfile
                this.playerProfiles = data.filter((profile)=>{
                    _hasProfile = this.overrideProfiles.find((override)=>{
                        if(override === profile) return true
                        else return false
                    })
                    return _hasProfile
                });
            })
    }

    getActiveClubDiscounts() { /*** not using this  ********/
        this.playerProfiles = [];
        let _clubId = this.clubInfo ? this.clubInfo.id : null;
        if (!_clubId) return false;
        if(!this.player) return false;
        let _playerId = this.player.id || this.player.playerId;
        let _playerType = this.bookingPlayer.playerType;
        //console.log("player profiles", _clubId, _playerId, this.player, this.bookingPlayer)
        this.flightService.getActiveListClubDiscounts(_clubId)
            .subscribe((activeClubDiscounts: Array < TeeTimeDiscount > ) => {
                console.log("[get active club discount] applicable player profiles : ", activeClubDiscounts);
                if (activeClubDiscounts) {
                    if (this.bookingPlayer.playerType) {
                        let _has: boolean = false;
                        this.playerActiveClubDiscount = activeClubDiscounts.filter((acd) => {
                            acd.playerTypes.filter((pt) => {
                                //console.log("pt player types ", pt, ' === ', _playerType)
                                if (pt.bookingPlayerType.id === _playerType.id) {
                                    //console.log("same");
                                    _has = true;
                                    return _has;
                                } else return false;
                            });

                            return _has;
                        });

                        if (this.appliedBookingDiscounts && this.appliedBookingDiscounts.length > 0) {
                            this.playerActiveClubDiscount = this.playerActiveClubDiscount.filter((acd) => {
                                let _applied = this.appliedBookingDiscounts.find((td) => {
                                    if (acd.id && td.discountApplied.id) return td.discountApplied.id === acd.id
                                })
                                return !_applied

                            });
                        }
                    } else {
                        this.playerActiveClubDiscount = activeClubDiscounts;
                        if (this.appliedBookingDiscounts && this.appliedBookingDiscounts.length > 0) {
                            this.playerActiveClubDiscount = this.playerActiveClubDiscount.filter((acd) => {
                                let _applied = this.appliedBookingDiscounts.find((td) => {
                                    if (acd.id && td.discountApplied.id) return td.discountApplied.id === acd.id
                                })
                                return !_applied

                            });
                        }
                    }
                }
            })
    }

    getApplicableDiscountsForPlayer() {
        this.playerProfiles = [];
        this.playerActiveClubDiscount = [];
        let _clubId = this.clubInfo ? this.clubInfo.id : null;
        if (!_clubId) return false;
        if(!this.player) return false;
        let _playerId = this.player.id || this.player.playerId;
        let _playerType = this.bookingPlayer.playerType;
        let _bookingPlayerId = this.bookingPlayer.id;
        let _effectiveDate = moment(this.currentSlot.slotAssigned.teeOffDate).format("YYYY-MM-DD")
        //console.log("player profiles", _clubId, _playerId, this.player, this.bookingPlayer)
        this.flightService.getApplicableDiscountsForPlayer(_clubId,_playerId,_effectiveDate)
            .subscribe((activeClubDiscounts: Array < TeeTimeDiscount > ) => {
                console.log("applicable discounts - player [1] : ", activeClubDiscounts);
                //console.log("applicable discounts - applied : ",this.appliedBookingDiscounts);
                //console.log("applicable discounts - player type  : ",this.bookingPlayer.playerType);
                if (activeClubDiscounts && activeClubDiscounts.length > 0) {
                    // this.playerActiveClubDiscount = activeClubDiscounts;
                    this.activeClubDiscounts = activeClubDiscounts;
                    console.log("applicable discounts - player [2] : ", this.playerActiveClubDiscount);
                    console.log("applicable discounts - player [3] : ", this.appliedBookingDiscounts);
                    // this.playerActiveClubDiscount = activeClubDiscounts;
                    // if(1) return;
                    this.playerActiveClubDiscount = activeClubDiscounts.filter((pacd)=>{
                        let _hasApplied = this.appliedBookingDiscounts.filter((abd)=>{
                            // if(abd.discountApplied.id === pacd.id) {
                            //     //console.log("applicable discounts - has applied true")
                            //     //console.log("applicable discounts - applied filter :", abd);
                            //     //console.log("applicable discounts - available filter :", pacd);
                            //     // _hasApplied = true;
                            //     return true
                            // } else {
                            //     //console.log("applicable discounts - has applied false")
                            //     //console.log("applicable discounts - applied filter :", abd);
                            //     //console.log("applicable discounts - available filter :", pacd);
                            //     // _hasApplied = false;
                            //     return false;
                            // }
                            if(abd && abd.discountApplied)  {
                                // let _isPlayerDiscount;
                                // abd.discountAudit.discountsByPlayer.filter((dp)=>{
                                //     if(dp.playerId === _playerId)
                                //         _isPlayerDiscount = true
                                //     else _isPlayerDiscount = false;
                                // })
                                // return abd.discountApplied.id === pacd.id && _isPlayerDiscount
                                
                                // if(abd.discountApplied.id === pacd.id) {
                                //     let _isPlayer
                                //     abd.discountAudit.discountsByPlayer.filter((dbp)=>{
                                //         if(dbp.playerId === _playerId) _isPlayer = true
                                //         else _isPlayer = false
                                //     })
                                //     return _isPlayer;
                                // } else return false
                                return abd.discountApplied.id === pacd.id && abd.bookingPlayerId === _bookingPlayerId
                            }
                            else return false
                            // if(!(abd.discountApplied.id === pacd.id)) this.playerActiveClubDiscount.push(pacd)
                        })
                        if(!_hasApplied || _hasApplied.length === 0) return true
                        else if(_hasApplied && !pacd.discountProgram) return true
                        else if(_hasApplied && pacd.discountProgram) return false
                        else return false
                        // this.playerActiveClubDiscount.push(pacd)
                    })
                    // this.appliedBookingDiscounts.filter((d)=>{
                    //     let _hasApplied;
                    //     activeClubDiscounts.filter((acd)=>{
                    //         if(acd.id === d.discountApplied.id) _hasApplied = true;
                    //         else _hasApplied = false;
                    //     });
                    //     return !_hasApplied;
                    // }).map((ad)=>{
                    //     this.playerActiveClubDiscount.push(ad.discountApplied)
                    // })


                    // if (this.bookingPlayer.playerType) {
                    //     let _has: boolean = false;
                    //     this.playerActiveClubDiscount = activeClubDiscounts.filter((acd) => {
                    //         acd.playerTypes.filter((pt) => {
                    //             //console.log("pt player types ", pt, ' === ', _playerType)
                    //             if (pt.bookingPlayerType.id === _playerType.id) {
                    //                 //console.log("same");
                    //                 _has = true;
                    //                 return _has;
                    //             } else return false;
                    //         });

                    //         return _has;
                    //     });
                    //     // let _nonDiscountProgram = this.playerActiveClubDiscount.filter((ttd)=>{
                    //     //     return !ttd.discountProgram
                    //     // });
                    //     this.playerActiveClubDiscount = this.playerActiveClubDiscount.filter((ttd)=>{
                    //         return !ttd.discountProgram
                    //     })

                    //     if (this.appliedBookingDiscounts && this.appliedBookingDiscounts.length > 0) {
                    //         this.playerActiveClubDiscount = this.playerActiveClubDiscount.filter((acd) => {
                    //             let _applied = this.appliedBookingDiscounts.find((td) => {
                    //                 //console.log("applicable discounts : acd ", acd)
                    //                 //console.log("applicable discounts : td ", td)
                    //                 if (acd.id && td.discountApplied.id) return td.discountApplied.id === acd.id
                    //             })
                    //             return !_applied

                    //         });
                    //     }
                    //     // this.playerActiveClubDiscount = 
                    //     //console.log("_acd 1 before player's", this.playerActiveClubDiscount)
                    //     let _allPdp: Array<DiscountPlayerClub>;
                    //     let _acd: Array<TeeTimeDiscount> = new Array<TeeTimeDiscount>();
                    //     _acd = this.playerActiveClubDiscount.filter((acda: TeeTimeDiscount)=>{
                    //         // let acd = acda.discountApplied;
                    //         let acd = acda;
                    //         let _hasDiscProgram;
                    //         if(acd.discountProgram && acd.discountProgram.id) {
                    //             //console.log("_acd 1 - acd filter", acd)
                    //             // _allPdp = this.getPlayerDiscountCardApplications(_playerId, acd.discountProgram.id);
                    //             this.flightService.getListAllCardApplyForPlayer(_playerId, acd.discountProgram.id)
                    //             .subscribe((data)=>{
                    //                 let _data: Array<DiscountPlayerClub>;
                    //                 //console.log("discount card application acd ", data.json());
                    //                 // //console.log("discount card application ", _clubId);
                    //                 _data = data.json();
                    //                 if(_data && _data.length>0) {
                    //                     // this.playerDiscountPrograms = _data;
                    //                     _allPdp = _data.filter((dpc: DiscountPlayerClub)=>{
                    //                         //console.log("discount card application acd verified", _clubId, dpc)
                    //                         if(dpc.club.id === _clubId && dpc.verified)
                    //                             return true
                    //                             // && dpc.verified
                    //                     })
                    //                     .map((dpc)=>{
                    //                         return dpc
                    //                     });
                    //                     //console.log("_acd 1 allPdp", _allPdp)
                    //                     if(_allPdp && _allPdp.length > 0 && _allPdp[0])
                    //                         if(_allPdp[0].playerDiscountProgram.discountProgram.id === acd.discountProgram.id)
                    //                             _hasDiscProgram = true;
                    //                     else _hasDiscProgram = false;
                    //                     if(_hasDiscProgram) this.playerActiveClubDiscount.push(acd)
                    //                     //console.log("_acd 1 - outside 1..",_hasDiscProgram)
                    //                     //console.log("_acd 1 - outside 1..",this.playerActiveClubDiscount)
                    //                     return _hasDiscProgram;
                    //                 } 
                    //             }, (error)=>{

                    //             },() =>{
                    //             //console.log("_acd 1 - outside 2..",_hasDiscProgram)
                    //                 return _hasDiscProgram
                    //             });
                    //             // if(acd.discountProgram.id && _hasDiscProgram) return true;
                    //             // setTimeout(()=>{
                    //             //     return _hasDiscProgram
                    //             // },150)
                    //             //console.log("_acd 1 - outside 2..",_hasDiscProgram)
                    //             // //console.log("_acd 1 - allPdp - outside", _allPdp)
                    //             // if(_allPdp && _allPdp.length > 0)
                    //             //     if(_allPdp[0].playerDiscountProgram.discountProgram.id === acd.discountProgram.id)
                    //             //         _hasDiscProgram = true
                    //             // else _hasDiscProgram = false;
                    //             // return _hasDiscProgram
                    //         } 
                            
                    //         //console.log("_acd 1 - outside 3 - ", _allPdp,"..",_hasDiscProgram)
                    //     });
                    //     // this.playerActiveClubDiscount.push(..._nonDiscountProgram);
                    //     // setTimeout(()=>{
                            
                    //     //     // if(_acd && _acd.length > 0) this.playerActiveClubDiscount.push(..._acd);
                    //     //     //console.log("_acd 1 timeout", _acd)
                    //     //     }, 500);
                    //     //console.log("_acd 1 outside", _acd)
                    // } else {
                    //     this.playerActiveClubDiscount = activeClubDiscounts;
                    //     if (this.appliedBookingDiscounts && this.appliedBookingDiscounts.length > 0) {
                    //         this.playerActiveClubDiscount = this.playerActiveClubDiscount.filter((acd) => {
                    //             let _applied = this.appliedBookingDiscounts.find((td) => {
                    //                 if (acd.id && td.discountApplied.id) return td.discountApplied.id === acd.id
                    //             })
                    //             return !_applied

                    //         });
                    //     }
                    //     //console.log("_acd 2", activeClubDiscounts)
                    //     let _allPdp: DiscountPlayerClub;
                    //     let _acd = activeClubDiscounts.filter((acd: TeeTimeDiscount)=>{
                    //         _allPdp = this.getPlayerDiscountCardApplications(_playerId, acd.discountProgram.id)
                    //         let _hasDiscProgram = this.playerDiscountPrograms.find((pdp)=>{
                    //             if(pdp.id === _allPdp.playerDiscountProgram.id) return true
                    //             else return false
                    //         })
                    //         //console.log("_acd 2 - has discProgram", _hasDiscProgram)
                    //         return _hasDiscProgram
                    //     });
                    //     //console.log("_acd 2", _acd)
                    // }
                }
            }, (error)=>{

            }, () =>{
                //console.log("finale acd", this.playerActiveClubDiscount)
            })
    }

    getPlayerProfile(profile: string) {
        //console.log("get player profile - ", profile, " : ", PlayerTypes[profile]);
        return PlayerTypes[profile];
    }

    getDiscountText(discount: TeeTimeDiscount, type ? : string) {
        // //console.log("get discount text ", discount);
        // //console.log("get discount text ", this.getDiscountDetails(discount));

        if (!discount) return false;
        if (this.playerActiveClubDiscount && this.playerActiveClubDiscount.length === 0) return false;
        if (!this.playerActiveClubDiscount) return false;
        let _currency;
        let _discountDetails = this.getDiscountDetails(discount);
        if (!_discountDetails) return false;
        _currency = discount.club.address.countryData.currencySymbol;
        switch (type) {
            case 'amount':
                if (discount.amountType.toLowerCase() === 'percentage')
                    return discount.discount + '% off';
                else if (discount.amountType.toLowerCase() === 'absolute')
                    return 'Save ' + _currency + ' ' + discount.discount
                else if (discount.amountType.toLowerCase() === 'fixed')
                    return 'Up to ' + _currency + ' ' + discount.discount
            case 'appliesFor':
                let _appliesFor = 'Covers ';
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
                //console.log("pre filter - buggy fee ", _buggyFee)
                //console.log("pre filter - caddy fee ", _caddyFee)
                 
                _discountDetails.priceComponents = _discountDetails.priceComponents.filter((price)=>{
                    if(_buggyFee.length === 2) return price.priceComponent.id.toLowerCase() !== 'hbuggyfee'
                    if(_caddyFee.length === 2) return price.priceComponent.id.toLowerCase() !== 'hcaddyfee'
                    else return true
                });
                if(!_discountDetails.priceComponents || _discountDetails.priceComponents.length === 0) return '';
                if(_discountDetails && _discountDetails.priceComponents)
                _appliesFor += _discountDetails.priceComponents
                    .map((a) => {
                        return a.priceComponent.name
                    }).reduce((a, b) => {
                        return a + ', ' + b;
                    })
                //console.log("applies to ", _appliesFor)
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
                //console.log("applies to ", _appliesTo)
                return _appliesTo;
        }
    }

    getDiscountDetails(discount: TeeTimeDiscount) {
        // //console.log("get discount details ", discount);
        // //console.log("get discount details ", this.playerActiveClubDiscount);
        if (!discount) return false;
        let _discountDetails;
        if (this.playerActiveClubDiscount)
            _discountDetails = this.playerActiveClubDiscount.filter((td) => {
                return td.id === discount.id
            }).map((td) => {
                return td
            });
        // //console.log("get disc details ", _discountDetails)
        if (_discountDetails && _discountDetails.length > 0) return _discountDetails[0];
        else return null;
    }

    checkVoucherUnusable() {
        let _playerId = this.bookingPlayer.player.id;
        if(!this.bookingDiscounts || this.bookingDiscounts && this.bookingDiscounts.length === 0) return false;
        let _hasVoucherUnusable = this.bookingDiscounts.filter((bd)=>{
            if(bd.voucherApplied && !bd.voucherApplied.usableWithOtherRewards 
                && !bd.voucherApplied.appliesToFlight && bd.voucherApplied.playerAssigned.id === _playerId)
                return true
            else if(bd.voucherApplied && !bd.voucherApplied.usableWithOtherRewards && bd.voucherApplied.appliesToFlight)
                return true
        })
        if(_hasVoucherUnusable && _hasVoucherUnusable.length > 0) return true;
        else return false
    }

    checkOtherVouchers() {
        let _playerId = this.bookingPlayer.player.id;
        if(!this.bookingDiscounts || this.bookingDiscounts && this.bookingDiscounts.length === 0) return false;
        let _hasOtherVoucher = this.bookingDiscounts.filter((bd)=>{
            if(bd.voucherApplied && bd.voucherApplied.appliesToFlight) return true
            if(bd.voucherApplied && bd.voucherApplied.playerAssigned.id === _playerId) return true
            // if(bd.voucherApplied && !bd.voucherApplied.usableWithOtherRewards 
            //     && !bd.voucherApplied.appliesToFlight && bd.voucherApplied.playerAssigned.id === _playerId)
            //     return true
            // else if(bd.voucherApplied && !bd.voucherApplied.usableWithOtherRewards && bd.voucherApplied.appliesToFlight)
            //     return true
        })
        //console.log("check other voucher - ", this.bookingDiscounts, this.bookingPlayer, _hasOtherVoucher)
        if(_hasOtherVoucher && _hasOtherVoucher.length > 0) return true;
        else return false
    }

    removeOtherVouchers(vs: TeeTimeClubVoucherSeries) {
        let _playerId = this.bookingPlayer.player.id;
        let _bookingPlayerId = this.bookingPlayer.id;
        if(!this.bookingDiscounts || this.bookingDiscounts && this.bookingDiscounts.length === 0) return false;
        this.bookingDiscounts.filter((bd,idx)=>{
            if(bd.voucherApplied && bd.voucherApplied.appliesToFlight) {
                this.goRemoveThisVoucher(bd.voucherApplied, vs);
            } else if(bd.voucherApplied && !bd.voucherApplied.appliesToFlight && vs.appliesToFlight) {
                this.goRemoveThisVoucher(bd.voucherApplied, vs);
            }
            else if(bd.voucherApplied && bd.voucherApplied.playerAssigned.id === _playerId) {
                this.goRemoveThisVoucher(bd.voucherApplied, vs);
            }
            let _discountApplied;
            if(bd.discountApplied) {
                if(bd.discountAudit)
                bd.discountAudit.discountsByPlayer.filter((dbp)=>{
                    if (dbp.playerId === _playerId) {
                        this.onRemoveThisDiscount(bd.discountApplied);
                    }
                })
                else if(!bd.discountAudit) {
                    if(_bookingPlayerId === bd.bookingPlayerId)
                        this.onRemoveThisDiscount(bd.discountApplied);
                }
            }
            if(idx === (this.bookingDiscounts.length - 1)) {
                setTimeout(()=>{
                    if(vs) this.goUseThisVoucherSeries(vs);
                }, 500)
            }

            // if(bd.voucherApplied && !bd.voucherApplied.usableWithOtherRewards 
            //     && !bd.voucherApplied.appliesToFlight && bd.voucherApplied.playerAssigned.id === _playerId)
            //     return true
            // else if(bd.voucherApplied && !bd.voucherApplied.usableWithOtherRewards && bd.voucherApplied.appliesToFlight)
            //     return true
        })
        // setTimeout(()=>{
        //     if(vs) this.goUseThisVoucherSeries(vs);
        // }, 500)

    }

    onUseThisDiscount(discount: TeeTimeDiscount) {
        
        //console.log("removing discount", this.bookingPlayer)
        if(this.checkVoucherUnusable()) {
            let prompt = this.alertCtrl.create({
                title: 'Use Discount',
                message: 'There is exclusive voucher applied in this flight. Please remove the voucher before applying discount.',
                // if has any other incompatible deals, it will be overriden
                // inputs: [{
                //     name: 'title',
                //     placeholder: 'Group Name'
                // }, ],
                buttons: [{
                        text: 'Close',
                        handler: data => {
                            prompt.dismiss()
                        }
                    }]
            });
            prompt.present();
        } else {
            let prompt = this.alertCtrl.create({
                title: 'Use Discount',
                message: 'This will apply discount to current booking flight. Do you want to proceed?',
                // if has any other incompatible deals, it will be overriden
                buttons: [{
                        text: 'No',
                        handler: data => {
                            prompt.dismiss()
                            return false;
                        }
                    },
                    {
                        text: 'Yes',
                        handler: () => {
                            this.goUseThisDiscount(discount);
                            prompt.dismiss()
                            return false;
                        }
                    }
                ]
            });
            prompt.present();
        }
        
    }

    goUseThisDiscount(discount: TeeTimeDiscount) {
        
        //console.log("removing discount", this.bookingPlayer)
        let _bookingPlayerId = this.bookingPlayer.id
        let _discountUsed: boolean = false;
        if (this.discountUsed && this.discountUsed.length > 0) _discountUsed = true;
        let _discount = discount;
        // if(!_voucher.usableWithOtherRewards && this.voucherUsed) {
        //     MessageDisplayUtil.showMessageToast('This voucher cannot be used with any other voucher', 
        //     this.platform, this.toastCtl,3000, "bottom")
        //     return false;
        // }

        let _force: boolean = false;
        this.flightService.applyPlayerBookingDiscount(this.bookingId, _discount.id, _bookingPlayerId, _force)
            .subscribe((data: any) => {
                if (data) {
                    // this.voucherUsed.push(voucher);
                    let _data = data.json();
                    //console.log("apply player booking discount : ", data)
                    MessageDisplayUtil.showMessageToast('Successfully applied discount', this.platform, this.toastCtl, 3000, "bottom")
                    // this.getListClubPlayerVoucher();
                    this.isVoucherApplied = true;
                    this.appliedBookingDiscounts = _data.bookingDiscounts;
                    if (this.appliedBookingDiscounts) {
                        // this.getActiveClubDiscounts();
                        this.getApplicableDiscountsForPlayer();
                    }
                    //console.log('applied discount', data, _data)

                }
            }, (error) => {
                let _error = error.json();
                //console.log("error voucher : ", error);
                MessageDisplayUtil.showErrorToast(_error.errors[0],
                    this.platform, this.toastCtl, 3000, "bottom")
                return false;
            }, () =>{
                if(this.forBooking) this.getBookingFlight();
            })


    }

    onRemoveThisDiscount(discount: TeeTimeDiscount) {
        if (!discount) {
            MessageDisplayUtil.showMessageToast('Successfully removed discount', this.platform, this.toastCtl, 3000, "bottom");
            return false;
        }
        //console.log("removing discount", this.bookingPlayer)
        let _bookingPlayerId;
        if(this.fromClub) _bookingPlayerId = this.bookingPlayer.id;
        this.flightService.removePlayerBookingDiscount(this.bookingId, discount.id, _bookingPlayerId)
            .subscribe((data: any) => {
                if (data) {
                    //console.log('remove discount', data)
                    let _data = data.json()
                    this.isVoucherApplied = true;
                    // this.appliedBookingDiscounts.push(...data.bookingDiscounts)
                    this.appliedBookingDiscounts = _data.bookingDiscounts;
                    if (this.appliedBookingDiscounts) {
                        // this.getActiveClubDiscounts();
                        this.getApplicableDiscountsForPlayer();
                    }
                    // this.appliedBookingDiscounts.push(discount);
                }
            });
    }

    onApplyThisProfile(profile: PlayerTypes) {
        let prompt = this.alertCtrl.create({
            title: 'Apply Profile',
            message: 'This will apply selected profile to current player. Do you want to proceed?',
            // inputs: [{
            //     name: 'title',
            //     placeholder: 'Group Name'
            // }, ],
            buttons: [{
                    text: 'No',
                    handler: data => {
                        prompt.dismiss()
                        return false;
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.goApplyProfile(profile);
                        prompt.dismiss()
                        return false;
                    }
                }
            ]
        });
        prompt.present();
    }

    goApplyProfile(profile: PlayerTypes) {
        //console.log("apply this profile", profile);
        if (!profile) return false;
        let _bookingId = this.bookingId;
        let _bookingPlayer = this.bookingPlayer;
        _bookingPlayer['playerTypeUsed.id'] = profile;
        this.flightService.updateBookingPlayerDetails(this.bookingId, _bookingPlayer, 'playerType')
            .subscribe((data) => {
                if (data) {
                    let _data = data.json();
                    //console.log("applied profile ", data, _data)
                    this.isVoucherApplied = true;
                    this.close();
                }
            })
    }

    onResetProfileClick() {
        let prompt = this.alertCtrl.create({
            title: 'Reset Profile',
            message: 'This will reset current player profile to original. Do you want to proceed?',
            // inputs: [{
            //     name: 'title',
            //     placeholder: 'Group Name'
            // }, ],
            buttons: [{
                    text: 'No',
                    handler: data => {
                        prompt.dismiss()
                        return false;
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.goResetProfile();
                        prompt.dismiss()
                        return false;
                    }
                }
            ]
        });
        prompt.present();
    }

    goResetProfile() {
        // //console.log("reset this profile", profile);
        // if (!profile) return false;
        let _bookingId = this.bookingId;
        let _bookingPlayer = this.bookingPlayer;
        _bookingPlayer['playerTypeUsed.id'] = '';
        this.flightService.updateBookingPlayerDetails(this.bookingId, _bookingPlayer, 'resetProfile')
            .subscribe((data) => {
                if (data) {
                    let _data = data.json();
                    //console.log("reset profile ", data, _data)
                    this.isVoucherApplied = true;
                    this.close();
                }
            })
    }

    getVoucherAmount(voucherSeries: TeeTimeClubVoucherSeries, type: string) {
        let _totalVouchers;
        let _voucherCount;
        if(!this.voucherSeries || this.voucherSeries && this.voucherSeries.length === 0) return;
        if(!this.playerVoucher || this.playerVoucher && this.playerVoucher.length === 0) return;
        // if(voucherSeries === null) voucherSeries = {};
        //console.log("[**] get voucher amount - player voucher", this.playerVoucher);
        // //console.log("[**] get voucher amount - voucher series", voucherSeries);

        
        //console.log("get voucher amount - voucher count", _voucherCount);
        // _totalVouchers = voucherSeries.totalVouchers;
        switch(type) {
            case 'all':
                _voucherCount = this.voucherSeries.filter((vs)=>{
                    let _hasVoucher;
                    this.playerVoucher.filter((pv)=>{
                        if(pv.seriesId === vs.id)
                            _hasVoucher = true
                        else _hasVoucher = false;
                    })
                    return _hasVoucher;
                 })
                return _voucherCount?_voucherCount.length:0;
            // case 'assigned':
            //     return voucherSeries.vouchersIssued;
            // case 'remaining':
            //     return _totalVouchers - voucher.vouchersIssued;
            case 'voucher':
                _voucherCount = this.playerVoucher.filter((playerVoucher)=>{
                    let _hasApplied = false;
                    if(this.appliedVouchers && this.appliedVouchers.length > 0) {
                        this.appliedVouchers.filter((av)=>{
                            if(av.seriesId === playerVoucher.seriesId) 
                                _hasApplied = true
                            else _hasApplied = false
                        })
                    }
                    return playerVoucher.seriesId === voucherSeries.id && !_hasApplied
                })
                return _voucherCount?_voucherCount.length:0;
        }
    }

    onImageClick(imageUrl: string) {
        let image = this.modalCtrl.create(ImageZoom, {
            image: imageUrl,
        });

        image.present();
    }

    onUseThisVoucherSeries(voucherSeries: TeeTimeClubVoucherSeries) {
        if(this.checkVoucherUnusable()) {
            let prompt = this.alertCtrl.create({
                title: 'Use Voucher',
                message: 'There is exclusive voucher applied in this flight. Please remove the voucher first before applying voucher.',
                // if has any other incompatible deals, it will be overriden
                // inputs: [{
                //     name: 'title',
                //     placeholder: 'Group Name'
                // }, ],
                buttons: [{
                        text: 'Close',
                        // handler: data => {
                        //     prompt.dismiss()
                        //     return false;
                        // }
                    }]
            });
            prompt.present();
            return false;
        }
        // if(!voucherSeries.usableWithOtherRewards && this.checkOtherVouchers() ) {
        //     let prompt = this.alertCtrl.create({
        //         title: 'Use Voucher',
        //         message: 'This is an exclusive voucher. Please remove other voucher first before applying this voucher.',
        //         // if has any other incompatible deals, it will be overriden
        //         // inputs: [{
        //         //     name: 'title',
        //         //     placeholder: 'Group Name'
        //         // }, ],
        //         buttons: [{
        //                 text: 'Close',
        //                 // handler: data => {
        //                 //     prompt.dismiss()
        //                 //     return false;
        //                 // }
        //             }]
        //     });
        //     prompt.present();
        //     return false;
        // }
        let _message;
        let _needRemoveVoucher: boolean = false;
        if(voucherSeries.appliesToFlight && voucherSeries.usableWithOtherRewards)
            _message = 'This will apply voucher to whole flight. Do you want to proceed?';
        else if(!voucherSeries.appliesToFlight && voucherSeries.usableWithOtherRewards)
        _message = 'This will apply voucher to current booking. Do you want to proceed?';
        // if(voucherSeries.appliesToFlight && !voucherSeries.usableWithOtherRewards)
        //     _message = 'This will apply voucher to whole flight. Do you want to proceed?';
        // else if(!voucherSeries.appliesToFlight && !voucherSeries.usableWithOtherRewards)
        // _message = 'This will apply voucher to current booking. Do you want to proceed?';
        else if(!voucherSeries.usableWithOtherRewards && !voucherSeries.appliesToFlight) {
            // _message = 'This voucher won\'t be usable with other deals unless if you apply, this will clear other deals. Do you want to proceed? '
            _message = 'This voucher is not usable with other promotions. If you use this it will clear all other deals. Do you want to proceed?'
            if(this.checkOtherVouchers()) _needRemoveVoucher = true;
        }
                // if(!voucherSeries.usableWithOtherRewards) _message = 'This voucher won\'t be usable with other deals. Do you still want to apply voucher to current booking flight? '
        else if(voucherSeries.appliesToFlight && !voucherSeries.usableWithOtherRewards) {
            if(this.checkOtherVouchers()) _needRemoveVoucher = true;
            // _message = "This voucher won't be usable with other deals and applicable for whole flight. If you apply, this will clear other deals. Do you want to proceed?"
            _message = "This voucher is applicable to the whole flight and is not usable with other promotions. If you use this it will clear all other deals. Do you want to proceed? "
            }
        let prompt = this.alertCtrl.create({
            title: 'Use Voucher',
            // - Need Remove : '+ _needRemoveVoucher
            // + _needRemoveVoucher
            message: _message,
            // inputs: [{
            //     name: 'title',
            //     placeholder: 'Group Name'
            // }, ],
            buttons: [{
                    text: 'No',
                    handler: data => {
                        prompt.dismiss()
                        return false;
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        if(_needRemoveVoucher) this.removeOtherVouchers(voucherSeries);
                        else this.goUseThisVoucherSeries(voucherSeries);
                        prompt.dismiss()
                        return false;
                    }
                }
            ]
        });
        prompt.present();
    }

    goUseThisVoucherSeries(voucherSeries: TeeTimeClubVoucherSeries) {
        let _useVoucher
        _useVoucher = this.playerVoucher.filter((pv)=>{
            return pv.seriesId === voucherSeries.id
        }).sort((a,b)=>{
            if(a.id < b.id) return 1;
            else if(b.id < a.id) return -1;
            else return 0
        });

        if(_useVoucher && _useVoucher.length > 0) this.goUseThisVoucher(_useVoucher[0]);
        else {
            MessageDisplayUtil.showMessageToast('Please try again', 
            this.platform, this.toastCtl, 3000, "bottom");
            return false;
        }

        
    }

    getPlayerDiscountPrograms(loader?) {
        let _loader;
        if(!loader) {
            _loader = this.loadingCtl.create({
                content: "Getting Discounts...",
                showBackdrop: false,
                duration: 5000
            });
        } else {
            _loader = loader;
        }
        let _playerId;
        //console.log("player id :", this.player)
        if(this.player) _playerId = this.player.playerId?this.player.playerId:this.player.id;
        _loader.present().then(()=>{
            this.flightService.getPlayerDiscountPrograms(_playerId)
            .subscribe((data)=>{
                //console.log("get player discount programs", data);
                if(data) {
                    this.playerDiscountPrograms = data.sort((a,b) => {
                        if(a.discountProgram.discountCompany.name < b.discountProgram.discountCompany.name) {
                            if(a.validUntil < b.validUntil) return 1;
                            else if(b.validUntil < a.validUntil) return -1;
                            else return -1
                        } else if(a.discountProgram.discountCompany.name > b.discountProgram.discountCompany.name) {
                            if(a.validUntil < b.validUntil) return 1;
                            else if(b.validUntil < a.validUntil) return -1;
                            else return 1
                        }
                        else return 0;
                    });
                    this.playerDiscountPrograms.forEach((pdp)=>{
                        JsonService.deriveFulImageURL(pdp, 'document');
                    })
                }
                // this.playerDi
            }, (error)=>{
                if(_loader) _loader.dismiss();
            }, ()=>{
                if(_loader) _loader.dismiss();
            })
        })
        
    }

    getProgramDetails(program: PlayerDiscountProgram, type?: string) {
        let _discountProgram = program.discountProgram;
        let _discountCompany = _discountProgram.discountCompany;
        switch(type) {
            case 'name':
                return _discountProgram.name
            case 'membershipNo':
                return program.membershipNumber;
            case 'description':
                return _discountProgram.description;
            case 'company':
                return _discountCompany.name;
            case 'verifiedByCompany':
                return program.verifiedByCompany;
            case 'verifiedOn':
                return program.verifiedOn;
        } 
    }

    
    goRemoveDiscount(program: PlayerDiscountProgram) {
        let _playerDiscountId;
        if(program) _playerDiscountId = program.id;
        this.flightService.deletePlayerDiscountCard(_playerDiscountId)
        .subscribe((data)=>{
            //console.log("delete player discount", data)
            if(data) {
            MessageDisplayUtil.showMessageToast('Successfully removed player discount card', 
            this.platform, this.toastCtl, 3000, "bottom");
            this.getPlayerDiscountPrograms();
            return false;
            }
        }, (error)=>{
            let _error = error.json();
            let _msg;
            // _msg = _error.error;
            _msg = 'Card is already approved in one of the club application. Please remove from the applied club.';
            MessageDisplayUtil.showMessageToast(_msg, 
            this.platform, this.toastCtl, 7000, "bottom");
            this.getPlayerDiscountPrograms();
            return false;
        }, ()=>{
            if(this.forBooking) this.getBookingFlight();
        })
    }
    onPrivilegeCardApprove(pdp: PlayerDiscountProgram) {
        let _playerId = pdp.player.playerId?pdp.player.playerId:pdp.player.id;
        let _programId = pdp.discountProgram.id;
        let _clubId = this.clubId?this.clubId:this.clubInfo.id;
        this.flightService.approvePlayerDiscountCard(_playerId, _programId, _clubId)
        .subscribe((data)=>{
            //console.log("approving discount card ", data)
            if(data) {
                this.setOptionType(2);
                // this.getPlayerDiscountPrograms();
            }
        }, (error)=>{
            //console.log("approving discount card", error)
            let _error = error.json();
            if(_error && _error.status === 409) {
                this.flightService.applyForClubVerifyDiscountCard(_playerId, _programId, _clubId)
                .subscribe((data)=>{
                    let _data = data.json();
                    //console.log("player applinyg for discount card", data);
                    if(_data && _data.length > 0) {
                        let _pdp = _data.filter((pdp)=>{
                            return pdp.club.id === _clubId
                        }).map((pdp)=>{
                            return pdp
                        })
                        this.onPrivilegeCardApprove(pdp);
                        // this.setOptionType(2);
                    }
                }, (error)=>{
                    //console.log("error apply", error)
                    let _error = error.json();
                    //console.log("error apply 2", _error)
                    if(_error && _error.status !== 200) {
                        let _msg = _error.errors[0];
                        MessageDisplayUtil.showMessageToast(_msg, 
                        this.platform, this.toastCtl, 3000, "bottom");
                        return false;
                    }
                })
            }
        }, () =>{
            this.setOptionType(2)
        });
        // let approveModal = this.modalCtrl.create(ManageDiscountCardModal, {
        //     player: this.player,

        // });
        // approveModal.onDidDismiss((data)=>{

        // });
        // approveModal.present();
    }

    onPrivilegeApplyClub(pdp: PlayerDiscountProgram) {
        
        let prompt = this.alertCtrl.create({
            title: 'Apply Discount Program',
            message: 'This will apply discount program to this club. Do you want to proceed? ',
            // inputs: [{
            //     name: 'title',
            //     placeholder: 'Group Name'
            // }, ],
            buttons: [{
                    text: 'No',
                    handler: data => {
                        prompt.dismiss()
                        return false;
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        prompt.dismiss().then(()=>{
                            this.goApplyPrivilegeClub(pdp);
                        })
                        return false;
                    }
                }
            ]
        });
        prompt.present();
    }

    goApplyPrivilegeClub(pdp: PlayerDiscountProgram) {
        let _playerId = pdp.player.playerId?pdp.player.playerId:pdp.player.id;
        let _programId = pdp.discountProgram.id;
        let _clubId = this.currentSlot.clubData.id;
        this.flightService.applyForClubVerifyDiscountCard(_playerId, _programId, _clubId)
        .subscribe((data)=>{
            //console.log("player applinyg for discount card", data);
            if(data) {
                this.setOptionType(2);
            }
        }, (error)=>{
            //console.log("error apply", error)
            let _error = error.json();
            if(_error && _error.status !== 200) {
                let _msg = _error.errors[0];
                if(_error.errorCode.includes('DiscountProgramNotRecognized'))
                        _msg = "There is no valid club discount associated to this card";
                MessageDisplayUtil.showMessageToast(_msg, 
                this.platform, this.toastCtl, 3000, "bottom");
                return false;
            }
        })
    }

    // getAllDiscountCardApplications(pdp: PlayerDiscountProgram) {
    //     let _pdp = pdp;
    //     let _allPDP;
    //     let _clubId = this.clubId;
    //     this.flightService.getListAllPlayersCardDiscount(_clubId, _pdp.discountProgram.id)
    //     .subscribe((data)=>{
    //         //console.log("all discount card application ", data)
    //         _allPDP = data.filter((ttd: TeeTimeDiscount)=>{
    //             if(ttd.club && ttd.club.id === _clubId && ttd.verified
    //         });
    //     })
    // }

    
    getPlayerDiscountCardApplications(playerId: number, programId: string): DiscountPlayerClub {
        let _playerId = playerId;
        // let _pdp = pdp;
        let _programId = programId;
        let _allPdp;
        let _clubId = this.clubId?this.clubId:this.clubInfo.id;
        this.flightService.getListAllCardApplyForPlayer(_playerId, _programId)
        .subscribe((data)=>{
            let _data: Array<DiscountPlayerClub>;
            //console.log("discount card application ", data.json());
            // //console.log("discount card application ", _clubId);
            _data = data.json();
            if(_data && _data.length>0) {
                // this.playerDiscountPrograms = _data;
                _allPdp = _data.filter((dpc: DiscountPlayerClub)=>{
                    //console.log("discount card application ", _clubId, dpc)
                    if(dpc.club && dpc.club.id === _clubId && dpc.approved)
                        return true
                }).map((dpc)=>{
                    return dpc
                });
                // return _allPdp;
                // this.playerDiscountApplications = _data;
            } 
            // else _allPdp = null;
        })
        return _allPdp;
    }

    getPendingPlayerDiscountCard(status?: string) {
        if(this.bookingPlayer && !this.bookingPlayer.player) return;
        let _pendingPDP = [];
        let _approvedPDP = [];
        let _pendingDiscountCards = [];
        this.pendingPDP = [];
        let _playerId = this.bookingPlayer.player.playerId?this.bookingPlayer.player.playerId:this.bookingPlayer.player.id;
        let _clubId = this.clubId?this.clubId:this.clubInfo.id;
        this.flightService.getListAllPlayersCardDiscount(_clubId)
        .subscribe((data)=>{
            let _pdp: Array<DiscountPlayerClub>;
            if(data) _pdp = data.json();
            //console.log("get list applications : ", _pdp)
            if(_pdp && _pdp.length > 0) {
                _pdp.filter((p: DiscountPlayerClub)=>{
                    if(p.club.id === _clubId && !p.approved && p.playerDiscountProgram.player.id === _playerId){
                        _pendingDiscountCards.push(p.playerDiscountProgram)
                        this.pendingPDP.push(p.playerDiscountProgram);
                        if(status === 'pending')
                        _pendingPDP.push(p.playerDiscountProgram)
                    } else if(p.club.id === _clubId && p.approved && p.playerDiscountProgram.player.id === _playerId) {
                        if(status === 'approved')
                        _approvedPDP.push(p.playerDiscountProgram)
                    }
                })
                                            
                if(status === 'approved') this.playerApprovedDP.push(..._approvedPDP);
                else if(status === 'pending') this.playerPendingDP.push(..._pendingPDP);
            }

        }, (error)=>{

        }, ()=>{
            if(status === 'approved') this.playerApprovedDP.push(..._approvedPDP);
            else if(status === 'pending') this.playerPendingDP.push(..._pendingPDP);
            //console.log("approved DP ", _approvedPDP);
            //console.log("pending DP", _pendingPDP)
        })

        // this.flightService.getDiscountCompanies()
        // .subscribe((data)=>{
        //     //console.log("pending - ", data)
        //     let _data
        //     if(data) _data = data;
        //     let _companies: Array<any> = _data.items;
        //     if(_data && _data.items && _data.items.length > 0) {
        //         _companies.forEach((comp: DiscountCompany)=>{
        //             this.flightService.getDiscountPrograms(comp.id)
        //             .subscribe((program: Array<DiscountCompanyProgram>)=>{
        //                 if(program) {
        //                     program.forEach((p)=>{
        //                         this.flightService.getListAllCardApplyForPlayer(_playerId,p.id)
        //                         .subscribe((data)=>{
        //                             let _pdp: Array<DiscountPlayerClub>;
        //                             if(data) _pdp = data.json();
        //                             //console.log("get list applications : ", _pdp)
        //                             if(_pdp && _pdp.length > 0) {
        //                                 _pdp.filter((p: DiscountPlayerClub)=>{
        //                                     if(p.club.id === _clubId && !p.verified){
        //                                         _pendingDiscountCards.push(p.playerDiscountProgram)
        //                                         this.pendingPDP.push(p.playerDiscountProgram);
        //                                         if(status === 'pending')
        //                                         _pendingPDP.push(p.playerDiscountProgram)
        //                                     } else if(p.club.id === _clubId && p.verified) {
        //                                         if(status === 'approved')
        //                                         _approvedPDP.push(p.playerDiscountProgram)
        //                                     }
        //                                 })
                                                                    
        //                                 if(status === 'approved') this.playerApprovedDP.push(..._approvedPDP);
        //                                 else if(status === 'pending') this.playerPendingDP.push(..._pendingPDP);
        //                             }
                                    
        //                         })
        //                     })
        //                 }
        //             })
                    
        //         })
                
        //     //     //console.log("get list applications pending list : ", _pendingDiscountCards)
        //     // this.pendingPDP.push(..._pendingDiscountCards);
        //     }
        // }, (error)=>{
        // }, ()=>{
        //     if(status === 'approved') this.playerApprovedDP.push(..._approvedPDP);
        //     else if(status === 'pending') this.playerPendingDP.push(..._pendingPDP);
        //     //console.log("approved DP ", _approvedPDP);
        //     //console.log("pending DP", _pendingPDP)
        // });
    }

    
    getDealsAmount(amount: string, amountType: string, currency?: any, item?: any, type?: string, applied: boolean = false) {
        if(!amount && type !== 'privilege') return '';
        let _currency; // = currency?currency.symbol:this.currency?this.currency.symbol:this.bookingSlot.clubData.address.countryData.currencySymbol;
        // if(this.teeSlotNew) {
        //     _currency = this.teeTimeSlotDisplay.currency.symbol
        // }
        if(type === 'privilege' && applied) {
            let _clubId = this.clubInfo ? this.clubInfo.id : null;
            if (!_clubId) return false;
            if(!this.player) return false;
            let _playerId = this.player.id || this.player.playerId; 
            let _effectiveDate = moment(this.currentSlot.slotAssigned.teeOffDate).format("YYYY-MM-DD")
            //console.log("player profiles", _clubId, _playerId, this.player, this.bookingPlayer)
            // this.flightService.getApplicableDiscountsForPlayer(_clubId,_playerId,_effectiveDate)
            // .subscribe((activeClubDiscounts: Array < TeeTimeDiscount > ) => {
            //     if(activeClubDiscounts) {
            //         activeClubDiscounts.filter((pac)=>{
                    // this.playerActiveClubDiscount.filter((pac)=>{
            //             // this.getAvailableDiscounts('privilege').filter((pac)=>{
            //                 return pac.id = item.id
            //             }).map((pac)=>{
            //                 item = pac
            //             })
            //     }
            // })
            
            this.applicableClubDiscount.filter((pac)=>{
                    return pac.id = item.id
                }).map((pac)=>{
                    item = pac
                })
            
        }
        
        // _currency = this.currentSlot?this.currentSlot.clubData.address.countryData.currencySymbol:currency;
        if(this.currentSlot) {
            _currency = this.currentSlot.clubData.address.countryData.currencySymbol
        } else if(!this.currentSlot && item && item.club) {
            _currency = item.club.address.countryData.currencySymbol
        }
        let _amount = amount;
        let _amountType = amountType;

        let _flightApply;
        let _bookingApply;
        let _amPMtype;
        // console.log("get deals amount - ", type + " -- " + applied," : ", item, this.playerActiveClubDiscount)
        if(type === 'privilege' && item.applicableRate) {
            // if(this.teeSlotNew) {
            //     _amPMtype = moment(this.teeTimeSlotDisplay.slot.teeOffTime,'HH:mm:ss').format("a");
            // } 
            if(this.forBooking) {
                _amPMtype = moment(this.currentSlot.slotAssigned.teeOffTime,'HH:mm:ss').format("a");
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
        
        //console.log("get deals amount - ", type," : ", _amountText + _flightTxt)
        if(type === 'voucher') return _amountText + " " + _flightTxt;
        else if(type === 'privilege') return _amountText + " " + _flightTxt;
        else return _amountText;

    }

    getAppliedDiscounts(type?: string) {
        let _discounts = [];
        let _approvedPDP = [];
        _approvedPDP = this.playerApprovedDP; //this.getPendingPlayerDiscountCard('approved');
        let _pendingPDP = [];
        let _playerId = null;
        let _bookingPlayerId = null;
        if(this.bookingPlayer && this.bookingPlayer.player) _playerId = this.bookingPlayer.player.id;
        if(this.bookingPlayer) _bookingPlayerId = this.bookingPlayer.id;
        _pendingPDP = this.playerPendingDP; //this.getPendingPlayerDiscountCard('pending'); 
        //console.log("applied discounts 1 - ", type, " : ", this.appliedBookingDiscounts)
        //console.log("applied discounts 2 - ", type, " : ", this.playerApprovedDP)
        if(!this.appliedBookingDiscounts || this.appliedBookingDiscounts.length === 0) return _discounts;
        if(this.currentSlot.slotAssigned && this.currentSlot.slotAssigned.pricingPlanPromotional 
            && !this.currentSlot.slotAssigned.pricingPlanPromotional.discountsApplicable) return _discounts;
        switch(type) {
            case 'clubDiscount':
                _discounts = this.appliedBookingDiscounts.filter((bd) =>{
                    if(bd.discountApplied) {
                        if(this.fromClub) {
                            return (bd.discountApplied.discountProgram && bd.amountDeducted > 0 && bd.discountApplied.amountType !== "Fixed") || (!bd.discountApplied.discountProgram && bd.discountApplied.amountType === "Fixed")
                        } else {
                            return (!bd.discountApplied.discountProgram && bd.amountDeducted > 0 && bd.discountApplied.amountType !== "Fixed") || (!bd.discountApplied.discountProgram && bd.discountApplied.amountType === "Fixed") && !bd.discountApplied.availableForClubOnly
                        }
                    }
                });
                _discounts = _discounts.filter((bd: TeeTimeBookingDiscount)=>{
                    let _isPlayerDiscount = false;
                    if(bd.discountAudit)
                    bd.discountAudit.discountsByPlayer.filter((p)=>{
                        if(p.playerId === _playerId) _isPlayerDiscount = true;
                        else _isPlayerDiscount = false;
                    })
                    else if(!bd.discountAudit) {
                        if(_bookingPlayerId === bd.bookingPlayerId) _isPlayerDiscount = true
                    }
                    // else if(this.fromClub && bd) _isPlayerDiscount = true;
                    return _isPlayerDiscount;
                })
                break;
            case 'privilege':
                _discounts = this.appliedBookingDiscounts.filter((bd) =>{
                    if(bd.discountApplied && bd.discountApplied.discountProgram) {
                        if(this.fromClub) {
                            return (bd.discountApplied.discountProgram && bd.amountDeducted > 0 && bd.discountApplied.amountType !== "Fixed") || (bd.discountApplied.discountProgram && bd.discountApplied.amountType === "Fixed")
                            && (bd.bookingPlayerId && bd.bookingPlayerId === _bookingPlayerId)
                        } else {
                            return ((bd.discountApplied.discountProgram && bd.amountDeducted > 0 && bd.discountApplied.amountType !== "Fixed") || (bd.discountApplied.discountProgram && bd.discountApplied.amountType === "Fixed" ))
                            && (bd.bookingPlayerId && bd.bookingPlayerId === _bookingPlayerId)
                            // && !bd.discountApplied.availableForClubOnly
                        }
                    }
                });
                
                if(_approvedPDP && _approvedPDP.length > 0) {
                    _discounts = _discounts.filter((bd)=>{
                        let _hasPDP = 
                        _approvedPDP.filter((pdp: PlayerDiscountProgram)=>{
                            if(pdp.discountProgram && bd.discountApplied.discountProgram)
                            return pdp.discountProgram.id === bd.discountApplied.discountProgram.id
                        })
                        return _hasPDP && _hasPDP.length > 0
                    })
                } else if(_approvedPDP && _approvedPDP.length === 0){
                    _discounts = [];
                }
                break;
                // return _discounts;
        }
        //console.log("pre check price components", this.activeClubDiscounts);
        _discounts.forEach((bd: TeeTimeBookingDiscount)=>{
            let _priceComponents = this.activeClubDiscounts.filter((d)=>{
                //console.log("start check price components " )
                //console.log("bd check price components", bd)
                //console.log("d check price components",d)
                //console.log("end check price components " )
                if(d.id === bd.discountApplied.id) {
                    return true;
                    
                    // bd.discountApplied.priceComponents = d.priceComponents;
                }
            }).map((d)=>{
                return d.priceComponents
            });
            if(bd && bd.discountApplied && bd.discountApplied.priceComponents) 
                bd.discountApplied.priceComponents = _priceComponents;
        });
        //console.log("available discounts - applied 3 -", type, " : ", _discounts, _approvedPDP)
        return _discounts;
    }

    getAvailableDiscounts(type?: string) {
        let _appliedDiscounts = [];
        let _discounts = [];
        let _approvedPDP = [];
        _approvedPDP = this.playerApprovedDP; //this.getPendingPlayerDiscountCard('approved');
        let _pendingPDP = [];
        _pendingPDP = this.playerPendingDP; //this.getPendingPlayerDiscountCard('pending'); 
        //console.log("available discounts 1 - ", type, " : ", this.playerApprovedDP)
        let _player: TeeTimeBookingPlayer;
        _player = this.bookingPlayer;
        console.log("available discounts 1.25 - ", type, " : ", this.playerActiveClubDiscount)
        //console.log("available discounts 1.5 - ", type, " : ", this.bookingPlayer)
        //console.log("available discounts 1.75 - ", type, " : ", _player)

        if(!this.playerActiveClubDiscount || this.playerActiveClubDiscount.length === 0) return _discounts;
        if(this.currentSlot.slotAssigned && this.currentSlot.slotAssigned.pricingPlanPromotional 
            && !this.currentSlot.slotAssigned.pricingPlanPromotional.discountsApplicable) return _discounts;
        switch(type) {
            case 'clubDiscount':
                _discounts = this.playerActiveClubDiscount.filter((bd) =>{
                    if(this.fromClub) return !bd.discountProgram
                    else return !bd.discountProgram && !bd.availableForClubOnly
                });
                
                _appliedDiscounts = this.appliedBookingDiscounts.filter((bd) =>{
                    if(bd.discountApplied && bd.discountAudit) {
                        let _isPlayer = false;
                        if(bd.discountAudit)
                        bd.discountAudit.discountsByPlayer.filter((dp)=>{
                            if(dp.playerId === _player.player.id)
                                _isPlayer = true;
                            else _isPlayer = false;
                        })
                        else if(!bd.discountAudit) {
                            if(_player.id === bd.bookingPlayerId) _isPlayer = true
                        }
                        if(this.fromClub) {
                            return (!bd.discountApplied.discountProgram && bd.amountDeducted > 0 && bd.discountApplied.amountType !== "Fixed") || (!bd.discountApplied.discountProgram && bd.discountApplied.amountType === "Fixed") && _isPlayer
                        } else {
                            return ((!bd.discountApplied.discountProgram && bd.amountDeducted > 0 && bd.discountApplied.amountType !== "Fixed") || (!bd.discountApplied.discountProgram && bd.discountApplied.amountType === "Fixed")) && !bd.discountApplied.availableForClubOnly && _isPlayer
                            // !bd.discountApplied.discountProgram && bd.amountDeducted > 0 
                        }
                    } else return false
                });
                //console.log("available discounts  - applied discounts : ", _appliedDiscounts)

                _discounts = _discounts.filter((bd: TeeTimeDiscount)=>{
                    if(0) {
                        let _goodPlayerType = bd.playerTypes.filter((pt)=>{
                            if(_player.playerTypeUsed)
                                return pt.bookingPlayerType.id === _player.playerTypeUsed.id
                            else if(_player.playerType && !_player.playerTypeUsed)
                                return pt.bookingPlayerType.id === _player.playerType.id
                            else return false
                        })
                    }
                        
                    let _isApplied;
                    _appliedDiscounts.filter((ad)=>{
                        if(ad.discountApplied.id === bd.id) _isApplied = true;
                    })

                    //    if(_goodPlayerType && _goodPlayerType.length > 0) return true && !_isApplied
                    //    else return false;
                    return !_isApplied
                });
                // return _discounts;
                break;
            case 'privilege':
                console.log("privilege : ", type, " - ", ' club ? ', this.fromClub, this.playerActiveClubDiscount)
                _discounts = this.playerActiveClubDiscount.filter((bd) =>{
                    if(this.fromClub) return bd.discountProgram
                    else return bd.discountProgram && !bd.availableForClubOnly
                });
                if(0) {
                    _discounts = _discounts.filter((bd)=>{
                        let _goodPlayerType = bd.playerTypes.filter((pt)=>{
                            if(_player.playerTypeUsed)
                                return pt.bookingPlayerType.id === _player.playerTypeUsed.id
                            else if(_player.playerType && !_player.playerTypeUsed)
                                return pt.bookingPlayerType.id === _player.playerType.id
                            else return false
                        })
                       if(_goodPlayerType && _goodPlayerType.length > 0) return true
                       else return false;
                    });
                }
                
                
                //console.log("available discounts 2. - ", type, " : ", _discounts)
                if(_approvedPDP && _approvedPDP.length > 0) {
                    _discounts = _discounts.filter((bd)=>{
                        let _hasPDP = 
                        _approvedPDP.filter((pdp: PlayerDiscountProgram)=>{
                            if(pdp.discountProgram && bd.discountProgram)
                            return pdp.discountProgram.id === bd.discountProgram.id
                        })
                        return _hasPDP && _hasPDP.length > 0
                    })
                } else if(_approvedPDP && _approvedPDP.length === 0){
                    _discounts = [];
                }
                // return _discounts;
                break;
        }
        
        // _discounts = _discounts.filter((d)=>{
        //     let _applicableDiscount = this.appl
        // })
        console.log("available discounts - available 2 -", type, " : ", _discounts, _approvedPDP, this.playerApprovedDP)
        return _discounts;
    }

    onZoomImage(image: string) {
        let imageZoom = this.modalCtrl.create(ImageZoom, {
            image: image
        })

        imageZoom.onDidDismiss((data: any) => {});
        imageZoom.present();
    }

    onUploadCardClick(pdp: PlayerDiscountProgram) {
        let _buttons = [];
        _buttons.push({
            text: 'Select Photo',
            // role: 'destructive', // will always sort to be on the bottom
            icon: !this.platform.is('ios') ? 'close' : null,
            handler: () => {
              this.onUploadPlayerCard(pdp)
            }
          });
          _buttons.push({
            text: 'Take Photo',
            // role: 'destructive', // will always sort to be on the bottom
            icon: !this.platform.is('ios') ? 'close' : null,
            handler: () => {
              this.onTakePhotoPlayerCard(pdp)
            }
          });

          let actionSheet = this.actionSheetCtl.create({
            buttons: _buttons
        });
        actionSheet.present();
    }
    onTakePhotoPlayerCard(pdp: PlayerDiscountProgram) {
        this.imageService.captureImage(true)
            .subscribe((data: ImageData) => {
                this._uploadImage(data.originalURL, pdp);
                //console.log("[photo] take photo data : ",data)
            }, (error) => {
                //console.log("[photo] take photo : ",  error)
                // alert(JSON.stringify(error));
            });
    }

    onUploadPlayerCard(pdp: PlayerDiscountProgram) {

        this.imageService.pickImage()
            .subscribe((data: ImageData) => {
                this._uploadImage(data.originalURL, pdp);
                //console.log("[photo] select  photo data : ",data)
            }, (error) => {
                //console.log("[photo] select photo : ", error)
                //Ignore this error
            });

    }
    _uploadImage(imageURL: string, pdp: PlayerDiscountProgram) {
        let _playerDiscountCardId = pdp.id;
            let uploadLoading = this.loadingCtl.create({
                content: 'Uploading, Please wait...'
            });
            uploadLoading.present().then(() => {
                this.playerHomeActions.uploadPlayerCardDiscount(imageURL, ContentType.JPEG, _playerDiscountCardId)
                    .subscribe((data) => {
                        uploadLoading.dismiss().then(() => {
                            this.getPlayerDiscountPrograms();
                            // this.cancelEditImage();
                        })
                    }, (error) => {
                        //console.log("[photo] uploading image : ", error)
                        uploadLoading.dismiss().then(() => {
                            // 'Please upload photo not more than 10 MB'
                            // if(error || error !== null) {
                                let alert = this.alertCtrl.create({
                                    title  : "Upload Error",
                                    message: 'Please upload photo not more than 10 MB',
                                    buttons: ["Ok"]
                                });
                                alert.present();
                            // }
                            // else this.cancelEditImage();
                            
                        })
                    })
            });
    }

    
    isCordova() {
        return this.platform.is('cordova');
    }

    getBookingFlight() {
        let _bookingId = this.currentSlot.id;
        this.flightService.getBookingById(_bookingId)
                .subscribe((bookingByPlayer: TeeTimeBooking) => {
                    // loader.dismiss().then(() => {
                        if(bookingByPlayer) {
                            this.currentSlot = bookingByPlayer;
                            if(this.currentSlot.bookingDiscounts) {
                                                        
                                this.appliedBookingDiscounts = this.currentSlot.bookingDiscounts;
                                this.bookingDiscounts = this.currentSlot.bookingDiscounts;
                                if (this.appliedBookingDiscounts)
                                    this.appliedBookingDiscounts = this.appliedBookingDiscounts.filter((bd) => {
                                        return !bd.voucherApplied
                                    });
                                    
                                if (this.bookingDiscounts) {
                                    this.appliedVouchers = this.bookingDiscounts.filter((d: TeeTimeBookingDiscount) => {
                                        return d.voucherApplied && d.voucherApplied.playerAssigned.id === this.player.id
                                    }).map((d: TeeTimeBookingDiscount) => {
                                        return d.voucherApplied;
                                    });
                                }
                            }
                        }
                    // });
                })
    }

    getAssignedPlayerTypes() {
        this.assignedPlayerProfiles = [];
        let _playerId;// = this.player.playerId;
        if(!this.player) return;
        if(this.player) _playerId = this.player.id | this.player.playerId;
        this.flightService.assignedBookingPlayerType(_playerId)
        .subscribe((data: Array<PlayerBookingTypeAssociation>)=>{
            if(data && data.length > 0) this.assignedPlayerProfiles = data;
            //console.log("assigned player types : ", data)
            // return data;
        })
    }

    goRemoveProfile(profile) {
        let _bookingPlayerType = profile.bookingPlayerType.id;
        let _playerId = this.player.playerId;
        this.flightService.removeBookingPlayerType(_playerId, _bookingPlayerType)
        .subscribe((data)=>{
            //console.log("remove profile ", data)
        }, (error)=>{

        }, ()=>{
            this.getAssignedPlayerTypes();
        })
    }

    onRemoveProfile(profile) {
        let prompt = this.alertCtrl.create({
            title: 'Removing Player Profile',
            message: 'Do you want to remove selected player profile?',
            // inputs: [{
            //     name: 'title',
            //     placeholder: 'Group Name'
            // }, ],
            buttons: [{
                    text: 'No',
                    // handler: data => {
                    //     prompt.dismiss().then(() => {
                    //         this.keyboard.close();
                    //     });
                    //     return false;
                    // }
                },
                {
                    text: 'Yes',
                    handler: (()=>{
                        this.goRemoveProfile(profile);
                    })
                }
            ]
        });
        prompt.present();
    }

    getApplicableDiscounts() {
        
        this.applicableClubDiscount = [];
        let _clubId = this.clubInfo ? this.clubInfo.id : null;
        if (!_clubId) return false;
        if(!this.player) return false;
        let _playerId = this.player.id || this.player.playerId;
        let _playerType = this.bookingPlayer.playerType;
        let _effectiveDate = moment(this.currentSlot.slotAssigned.teeOffDate).format("YYYY-MM-DD")
        this.flightService.getApplicableDiscountsForPlayer(_clubId,_playerId,_effectiveDate)
            .subscribe((activeClubDiscounts: Array < TeeTimeDiscount > ) => {
                if(activeClubDiscounts) this.applicableClubDiscount = activeClubDiscounts;
            });
    }

    getProfilePrice(profile) {
        if(!this.currentSlot) return false;
        let _profilePrice;
        let _currency = this.currentSlot.clubData.address.countryData.currencySymbol;
        for(let key in this.currentSlot.priceMap) {
            if(profile === key) {
                _profilePrice = this.currentSlot.priceMap[key];
            }
        }
        return _currency + " " + this.numberWithCommas(_profilePrice);
    }

    numberWithCommas(x) {
        if(!x) return x;
        else return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    escapeCRLF(value) {
        return JsonService.escapeCRLF(value);
        // return value.replace(/\r?\n/g, "<br />");  
    }  

}