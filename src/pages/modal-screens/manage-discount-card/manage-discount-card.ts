import { ClubInfo, TeeTimeSlot, TeeTimeSlotDisplay, ClubCourseData, PlayerData, ClubData, TeeTimeClubVoucherSeries, TeeTimeClubVoucher, DiscountCompany, PlayerDiscountProgram, DiscountPlayerClub, TeeTimeDiscount, DiscountCompanyProgram, ClubMembership, PlayerTypes, ClubMembershipStatus } from './../../../data/mygolf.data';
import {Component, 
    HostListener} from "@angular/core";
import {ViewController, NavParams, ToastController, Platform} from "ionic-angular";
import { CourseInfo, CourseHoleInfo } from "../../../data/club-course";
import { ClubFlightService } from "../../../providers/club-flight-service/club-flight-service";
import { TeeTimeBooking } from "../../../data/mygolf.data";


import * as moment from "moment";
import { MessageDisplayUtil } from '../../../message-display-utils';
import { ModalController } from 'ionic-angular';
import { AddPlayerTypeDiscountModal } from '../player-voucher/add-player-type-discount/add-player-type-discount';
import { AlertController } from 'ionic-angular';
import { AddPlayerListPage } from '../add-player-list/add-player-list';
import { PlayerInfo } from '../../../data/player-data';
import { JsonService } from '../../../json-util';
import { ImageZoom } from '../image-zoom/image-zoom';
import { SearchDiscountCompanyModal } from '../player-voucher/search-discount-company/search-discount-company';
import { ActionSheetController } from 'ionic-angular';
import { isTrueProperty } from 'ionic-angular/util/util';
/**
 * Created by ashok on 19/12/16.
 */
@Component({ 
    templateUrl: 'manage-discount-card.html',
    selector: 'manage-discount-card-page'
})
export class ManageDiscountCardModal
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
    mode: string;
    type: string;
    optionTypes: string = 'discount';
    fromClub: boolean;
    selectedVoucher: boolean = false;
    selectedPlayer: boolean = false;
    hasPlayer: boolean = false;
    player: PlayerData;
    clubInfo: ClubInfo;
    searchClubId: number;
    playerNoOfVoucher: number = 1;
    clubVoucherSeries: Array<TeeTimeClubVoucherSeries>;
    searchVoucher: string;
    selVoucherSeries: TeeTimeClubVoucherSeries;
    playerVoucher: Array<TeeTimeClubVoucher>;
    currencySymbol: string;
    displayPlayerVoucher: boolean = false;
    playersAssigned: Array<any> = new Array<any> ();
    pendingPDP: Array<DiscountPlayerClub> = new Array<DiscountPlayerClub>();
    approvedPDP: Array<DiscountPlayerClub> = new Array<DiscountPlayerClub>();
    selDP: DiscountCompanyProgram;
    discountPrograms: Array<DiscountCompanyProgram> = new Array<DiscountCompanyProgram>();
    discountCompanies: Array<DiscountCompany> = new Array<DiscountCompany>();
    togglePrivDetails: boolean = false;
    listDiscountPrograms: Array<DiscountCompanyProgram> = new Array<DiscountCompanyProgram>();
    listDiscountCompanies: Array<DiscountCompany> = new Array<DiscountCompany>();

    clubMembers: Array<ClubMembership> = new Array<ClubMembership> ();

    memberFilterStatus: string = 'Pending';
    searchMembers: string = '';
    searchPrivilege: string = '';

    expandPrivDetails: boolean = false;
    expandMemberDetails: boolean = false;

    showPrivAppOnly: boolean = false;
    showPrivPendingOnly: boolean = true;
    showPrivAll: boolean = false;

    constructor(private viewCtrl: ViewController,
        private flightService: ClubFlightService,
        private navParams: NavParams,
        private toastCtl: ToastController,
        private platform: Platform,
        private modalCtrl: ModalController,
        private alertCtrl: AlertController,
        private actionSheetCtl: ActionSheetController) {
        this.courses = navParams.get("courses");
        this.clubId = navParams.get("clubId");
        this.forDate = navParams.get("forDate");
        this.courseId = navParams.get("courseId");
        this.changeType = navParams.get("changeType");
        this.currentSlot = navParams.get("currentSlot")
        if(this.changeType && this.changeType ==='slot') this.isClub = false;
        else if(this.changeType && this.changeType === 'course') this.isClub = true;
        this.mode = navParams.get("mode");
        // this.type = navParams.get("type");
        this.fromClub = navParams.get("fromClub")
        this.clubInfo = navParams.get("clubInfo")
        if(this.fromClub) this.type = 'club'
        this.currencySymbol = navParams.get("currencySymbol");

    }

    ionViewDidLoad() {
        // this.getClubVoucherSeries();
        // this.initAllDiscountCardApplications();
        this.getAllDiscountCardApplications();
        // this.getTeeTimeBookingList();
    }

    innerWidth: any;
    ngOnInit() {
    this.innerWidth = window.innerWidth;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
    this.innerWidth = window.innerWidth;
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

        setOptionType(type: number) {
            if (type === 1) {
                this.optionTypes = 'membership';
                this.selectedVoucher = false;
                this.selectedPlayer = false;
                this.refreshClubMemberslist();
                // this.friendScreenName = 'Search';
                // if (this.platform.is("ios") && this.platform.is("cordova")) {
                //     this.keyboard.close();
                // }
            }
            if (type === 2) {
                this.optionTypes = 'assign';
                this.selectedVoucher = false;
                this.selectedPlayer = false;
                // this.friendScreenName = 'My Bookings';
                // this._refreshRequest(null, null);
                // this.refreshActiveBooking();
                // if (this.platform.is("ios") && this.platform.is("cordova")) {
                //     this.keyboard.close();
                // }
            }
    
        }

        onEditClick(type?: string) {
            let headerTitle;
            switch(type) {
                case 'playerType':
                    headerTitle = 'Edit Player Type';
                    break;
                case 'playerDiscount':
                    headerTitle = 'Edit Discount Card';
                    break;
                case 'playerVoucher':
                    headerTitle = 'Manage Voucher(s)';
                    break;
            }
            let typeModal = this.modalCtrl.create(AddPlayerTypeDiscountModal, {
                headerTitle: headerTitle,
                type: type, //playerType, playerDiscount, playerVoucher
                mode: 'edit', //new edit
            });
    
    
            let _deleteMultiDone: boolean = false;
            typeModal.onDidDismiss((data: any) => {
                if (data) {

                }

            });
            typeModal.present();

        }

        onAddClick(type?: string) {
            let headerTitle;
            switch(type) {
                case 'playerType':
                    headerTitle = 'Add Player Type';
                    break;
                case 'playerDiscount':
                    headerTitle = 'Add Discount Card';
                    break;
                case 'playerVoucher':
                    headerTitle = 'Manage Voucher(s)';
                    break;
            }
            
            console.log("on add click type - ", type);
            console.log("on add click type - ", headerTitle)
            let typeModal = this.modalCtrl.create(AddPlayerTypeDiscountModal, {
                headerTitle: headerTitle,
                type:  type, //playerType, playerDiscount, playerVoucher
                mode: 'new', //new edit
            });
    
    
            let _deleteMultiDone: boolean = false;
            typeModal.onDidDismiss((data: any) => {
                if (data) {

                }

            });
            typeModal.present();
        }

        onRemoveClick(type?: string) {
            let headerTitle;
            let message;
            let _confirmBtn;
            switch(type) {
                case 'playerType':
                    headerTitle = 'Removing Player Type';
                    message = 'Do you want to remove selected Player Type?';
                    _confirmBtn = 'Remove'
                    break;
                case 'playerDiscount':
                    headerTitle = 'Removing Discount Card';
                    message = 'You will lose privilege/discount deals by the club. Do you want to proceed?';
                    _confirmBtn = 'Yes'
                    break;
                case 'playerVoucher':
                    headerTitle = 'Removing Voucher';
                    message = 'Do you want to remove selected Voucher?';
                    _confirmBtn = 'Yes'
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
                        text: _confirmBtn,
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

        onSelectPlayer(selVoucherSeries: TeeTimeClubVoucherSeries) {
            let _playerModal = this.modalCtrl.create(AddPlayerListPage, {
                fromClub:   true,
                openedModal: true,
                clubId: this.clubId
            });

            _playerModal.onDidDismiss((data:any)=>{
                if(data) {
                    this.player = data.item;
                    // JsonService.deriveFulImageURL(this.player,'photoUrl');
                    // JsonService.deriveFulImageURL(this.player,'thumbnail');
                    // console.log("selected player ", this.player)
                    if(this.player) this.hasPlayer = true;
                    else this.hasPlayer = false;
                    this.selectedPlayer = true;
                    this.selectedVoucher = false;

                    this.getPlayerVoucher(selVoucherSeries);
                    // item: item,
                    // isCovid: true,
                    // newPlayer: _isNewPlayer,
                    // playerDetails: this.addPlayerForm.value,
                    // playerContact: ''
                } else {
                    this.selectedPlayer = false;
                    this.hasPlayer = false;
                }

            })
            _playerModal.present();
        }

        onSelectPlayerList(player: PlayerData) {
            this.player = player;
                    // JsonService.deriveFulImageURL(this.player,'photoUrl');
                    // JsonService.deriveFulImageURL(this.player,'thumbnail');
                    // console.log("selected player ", this.player)
                    this.hasPlayer = true;
                    this.selectedPlayer = true;
                    this.selectedVoucher = false;
                    this.getPlayerVoucher(this.selVoucherSeries);
        }
        
        onSearchVoucherClick(type?: string) {
            this.clubVoucherSeries = [];
            
            let _clubId = this.clubId?this.clubId:this.clubInfo.clubId;
            // let _playerId;
            // if(this.clubId || this.clubInfo && this.clubInfo.clubId) _clubId = this.clubInfo && this.clubInfo.clubId?this.clubInfo.clubId:this.clubId;
            // if(type.length > 0 && type === 'club') this.clubId = this.searchClubId;

            this.flightService.getClubVoucherSeries(1, _clubId, this.searchVoucher)
            .subscribe((data: any)=>{
                let _voucher: Array<TeeTimeClubVoucherSeries>;
                if(data && data.items) {
                    _voucher = data.items;
                    console.log("voucher series 1 : ", _voucher)
                    if(_voucher && _voucher.length> 0) {
                        _voucher.forEach((vs: TeeTimeClubVoucherSeries)=>{
                            JsonService.deriveFulImageURL(vs, "voucherImage")
                        })
                        this.clubVoucherSeries = _voucher;
                    }
                }
            })
        }

        onRefreshClick() {
            this.getClubVoucherSeries();
        }

        getClubVoucherSeries() {
            this.clubVoucherSeries = [];
            console.log("club id ", this.clubId, this.clubInfo)
            // listClubVoucherSeries
            let _clubId = this.clubId?this.clubId:this.clubInfo.clubId;
            this.flightService.getClubVoucherSeries(1,_clubId)
            .subscribe((data: any)=>{
                let _voucher: Array<TeeTimeClubVoucherSeries>;
                if(data && data.items) {
                    _voucher = data.items;
                    console.log("voucher series 1 : ", _voucher)
                    if(_voucher && _voucher.length> 0) {
                        _voucher.forEach((vs: TeeTimeClubVoucherSeries)=>{
                            JsonService.deriveFulImageURL(vs, "voucherImage")
                        })
                        this.clubVoucherSeries = _voucher;
                    }
                }
                
            });

            // this.flightService.getClubVoucherSeries(2,_clubId)
            // .subscribe((voucherSeries: Array<TeeTimeClubVoucherSeries>)=>{
            //     console.log("voucher series 2 : ", voucherSeries)
            //     if(voucherSeries && voucherSeries.length> 0) {
            //         this.clubVoucherSeries = voucherSeries;
            //     }
            // })
        }

        getVoucherAmount(voucher: TeeTimeClubVoucherSeries, type: string) {
            let _totalVouchers;
            _totalVouchers = voucher.totalVouchers;
            switch(type) {
                case 'assigned':
                    return voucher.vouchersIssued;
                case 'remaining':
                    return _totalVouchers - voucher.vouchersIssued;
            }
        }

        getVoucherAmountDetails(voucher: TeeTimeClubVoucherSeries) {
            let _currency = voucher.club.address.countryData.currencySymbol;
            if (voucher.voucherAmountType === 'Absolute') {
                return 'Less ' + _currency + " " + voucher.voucherAmount
            } else if (voucher.voucherAmountType === 'Fixed') {
                return 'Amount ' + _currency + " " + voucher.voucherAmount
            } else if (voucher.voucherAmountType === 'Percentage') {
                return voucher.voucherAmount + '% off';
            } else return false;

        }

        getDateText(date: string) {
            if(date.length === 0) return false;
            let _date = date;
            return moment(_date,'YYYY-MM-DD').format("DD MMM YYYY");
        }

        getVoucherApplicableText(voucher: TeeTimeClubVoucherSeries, type: string) {
            if(!voucher) return false;
            let _allowText;
            let _applicableStart = 'Applicable on';
            let _allowWeekdays;
            let _allowWeekends;
            let _allowHolidays;
            let _applicableEnd = '';
            if(type === 'allowDays') {
                // _allowWeekdays = voucher.allowOnWeekdays?'Weekdays':'';
                // _allowWeekends = voucher.allowOnWeekends?'Weekends':'';
                // _allowHolidays = voucher.allowOnPublicHolidays?'Public Holidays':'';
                _allowWeekdays = (voucher&&(voucher.allowOnWeekends||voucher.allowOnPublicHolidays)?'Weekdays'+', ':voucher&&voucher.allowOnWeekdays?'Weekdays':'');
                _allowWeekends = (voucher&&voucher.allowOnPublicHolidays?'Weekends'+', ':voucher&&voucher.allowOnWeekends?'Weekends':'');
                _allowHolidays = (voucher&&(voucher.allowOnWeekdays||voucher.allowOnWeekends&&voucher.allowOnPublicHolidays)?' and '+'Public Holidays':voucher&&voucher.allowOnPublicHolidays?'Public Holidays':'');

                _allowText = 
                _applicableStart + ' ' 
                + _allowWeekdays
                + _allowWeekends
                + _allowHolidays;

                // console.log("applicable text ", _allowText);
                // console.log("applicable text ", _applicableStart);
                // console.log("applicable text ", _allowWeekdays, _allowWeekdays, _allowHolidays);
                // console.log("applicable text ", (voucher&&(voucher.allowOnWeekends||voucher.allowOnPublicHolidays)?_allowWeekdays+', ':''));
                // console.log("applicable text ", (voucher&&voucher.allowOnPublicHolidays?_allowWeekends+', ':'') );
                // console.log("applicable text ",(voucher&&(voucher.allowOnWeekdays||voucher.allowOnWeekends)?' and '+_allowHolidays:''));

                // if(voucher.allowOnWeekdays && voucher.allowOnWeekends && voucher.allowOnPublicHolidays) 
                // _allowText = 'Applicable on Weekdays, Weekends and Public Holidays';
                // else if(!voucher.allowOnWeekdays && voucher.allowOnWeekends && voucher.allowOnPublicHolidays) 
                // _allowText = 'Applicable on Weekends and Public Holidays';
                // else if(!voucher.allowOnWeekdays && !voucher.allowOnWeekends && voucher.allowOnPublicHolidays) 
                // _allowText = 'Applicable only on Public Holidays';
                // else if()
                // else _allowText = 'Applicable to these days';
            } else if(type==='bookingAmount') {
                _allowText = 'Applies to Booking Amount';
            } else if(type === 'flight') {
                _allowText = 'Applicable for this flight';
            }
            
            return _allowText;
            
        }

        onImageClick(imageUrl: string) {
            let image = this.modalCtrl.create(ImageZoom, {
                image: imageUrl,
            });

            image.present();
        }

        onSeriesAssignClick(voucher: TeeTimeClubVoucherSeries) {
            // this.selVoucherSeries = null;
            this.selVoucherSeries = voucher;
            this.selectedVoucher = true;
            this.getClubVouchersIssued(voucher);
        }

        onPlayerAssignClick(voucher: TeeTimeClubVoucherSeries, player: PlayerData) {
            let _vouchersLeft = voucher.totalVouchers - voucher.vouchersIssued;
            if(!this.player) {
                MessageDisplayUtil.showErrorToast('Please select a player before assigning', this.platform, this.toastCtl,
                    5000, "bottom");
                return false;
            }
            if(this.playerNoOfVoucher === 0 || !this.playerNoOfVoucher) {
                MessageDisplayUtil.showErrorToast('Please enter at least 1 number of voucher', this.platform, this.toastCtl,
                    5000, "bottom");
                return false;
            }
            if(_vouchersLeft < this.playerNoOfVoucher) {
                MessageDisplayUtil.showErrorToast('Remaining vouchers is less than number of voucher', this.platform, this.toastCtl,
                5000, "bottom");
               return false;
            }
            let _currentVoucherSeries = this.selVoucherSeries;
            let _clubId = this.clubId?this.clubId:this.clubInfo.clubId;
            console.log("assigning vouchers to player", player, this.player)
            let _playerId = player&&player.playerId?player.playerId:player.id;
            // (this.player.playerId?this.player.playerId:this.player.id);
            let _currentDate = moment().format('YYYY-MM-DD');
            this.flightService.assignClubPlayerVoucher(_clubId, _playerId,voucher.id, this.playerNoOfVoucher, _currentDate)
            .subscribe((data: any)=>{
                console.log("after assigning player voucher ", data)
                if(data && data.status === 200) {
                    this.flightService.getClubVoucherSeries(1,_clubId)
                    .subscribe((data: any)=>{
                        let _voucher: Array<TeeTimeClubVoucherSeries>;
                        if(data && data.items) {
                            _voucher = data.items;
                            console.log("voucher series 1 : ", _voucher)
                            if(_voucher && _voucher.length> 0) {
                                _voucher.forEach((vs: TeeTimeClubVoucherSeries)=>{
                                    JsonService.deriveFulImageURL(vs, "voucherImage")
                                })
                                this.clubVoucherSeries = _voucher;
                                _voucher.filter((vs: TeeTimeClubVoucherSeries)=>{
                                    return vs.id === _currentVoucherSeries.id
                                })
                                .map((vs: TeeTimeClubVoucherSeries)=>{
                                    this.selVoucherSeries =  vs
                                });
                                this.getPlayerVoucher(voucher);

                                MessageDisplayUtil.showErrorToast('Successfully assigned '+this.playerNoOfVoucher+ ' vouchers', this.platform, this.toastCtl,
                                    5000, "bottom");

                            }
                        }
                        
                    });
                }
            })
        }

        onPlayerUnassignClick(voucher: TeeTimeClubVoucherSeries, player: PlayerData) {
            if(this.playerVoucher && this.playerVoucher.length < this.playerNoOfVoucher) {
                    MessageDisplayUtil.showErrorToast("Unassigning number is more than player's vouchers", this.platform, this.toastCtl,
                        5000, "bottom");
                        return false;
            }
            let prompt = this.alertCtrl.create({
                title: 'Unassign Vouchers',
                message: 'This will unassign latest '+ this.playerNoOfVoucher +' vouchers from player. Do you want to proceed?',
                // inputs: [{
                //     name: 'title',
                //     placeholder: 'Group Name'
                // }, ],
                buttons: [{
                        text: 'No',
                    },
                    {
                        text: 'Yes',
                        handler : () => {
                                    // MessageDisplayUtil.showMessageToast('Hello thar, unassigning player', this.platform, this.toastCtl,
                                    //     5000, "bottom");
                                        this.goPlayerUnassignClick(voucher, player)
                                    // prompt.dismiss();

                            
                        }
                        // handler: data => {
                        // }
                    }
                ]
            });
            prompt.present();
        }

        goPlayerUnassignClick(voucher: TeeTimeClubVoucherSeries, player: PlayerData) {

            let _clubId = this.clubId?this.clubId:this.clubInfo.clubId;
            let _playerId = this.player.playerId?this.player.playerId:this.player.id;
            let _voucherIds: Array<number> = new Array<number> ();
            
            let _playerVoucher
            _playerVoucher = this.playerVoucher.filter((v: TeeTimeClubVoucher)=>{
                return v.seriesId === voucher.id;
            }).sort((a,b)=>{
                if(a.id < b.id) return 1
                else if(b.id < a.id) return -1
                else return 0
            });
            let _numberVouchers = this.playerNoOfVoucher - 1;

            _playerVoucher.forEach((v,idx)=>{
                if(idx <= _numberVouchers) {
                    _voucherIds.push(v.id);
                }
            });
            console.log("unassign player vouchers ", _voucherIds);
            this.flightService.unassignClubPlayerVoucher(_clubId, _playerId, _voucherIds)
            .subscribe((data)=>{
                let _data = data.json()
                if(data && data.status === 200) {
                    console.log("response from data", data)
                    this.getPlayerVoucher(voucher);
                }
            })
        }

        getPlayerVoucher(selVoucherSeries?: TeeTimeClubVoucherSeries) {
            
            let _clubId = this.clubId?this.clubId:this.clubInfo.clubId;
            let _playerId = this.player.playerId?this.player.playerId:this.player.id;

            this.flightService.getListClubPlayerVouchers(_clubId, _playerId)
            .subscribe((data: Array<TeeTimeClubVoucher>)=>{
                console.log("get voucher list", data)
                if(data) {
                    if(selVoucherSeries) {
                        this.playerVoucher = data.filter((v: TeeTimeClubVoucher)=>{
                            return v.seriesId === selVoucherSeries.id; 
                            // v.voucherNumber.toLowerCase().includes(this.searchVoucher.toLowerCase()) || 
                            // v.name.toLowerCase().includes(this.searchVoucher.toLowerCase())
                        })
                    } else this.playerVoucher = data;
                   
                }
            });
        }

        getPlayerDetails(player: any, attribute: string) {
            if(!player) return false;
            switch(attribute) {
                case 'image':
                    return player&&player.thumbnail?player.thumbnail:player.photoUrl?player.photoUrl:player.image;
            }
        }

        onViewMoreVouchers(selVoucherSeries: TeeTimeClubVoucherSeries, player: PlayerInfo) {
            this.displayPlayerVoucher = true;
            // this.flightService.getListPlayerVouchers()
            this.playerVoucher = this.playerVoucher.filter((v)=>{
                return selVoucherSeries.id === v.seriesId
            });
        }

        getClubVouchersIssued(voucher: TeeTimeClubVoucherSeries) {
            let _clubId = this.clubId;
            let _seriesId = voucher.id;
            let _issued = 999; //voucher.vouchersIssued;
            let _playersAssigned: Array<PlayerData> = new Array<PlayerData> ();
            this.flightService.getVouchersIssued(_clubId, _seriesId, null, false, false, _issued)
            .subscribe((data)=>{
                if(data) {
                    console.log("get club vouchers issued ", data)
                    let _data: Array<TeeTimeClubVoucher> = data.items;
                    _data.forEach((v)=>{
                        if(v.playerAssigned) _playersAssigned.push(v.playerAssigned);
                    })
                    // let unique = [...new Set(_data.map(item => item.Group))];
                    if(_playersAssigned && _playersAssigned.length > 0) {
                        console.log("get club vouchers issued distinct", this.getUnique(_playersAssigned,'id'));
                        this.playersAssigned = this.getUnique(_playersAssigned,'id')
                        let _numberVouchers;
                        this.playersAssigned.forEach((p: any)=>{
                            let _pVouchers = _data.filter((v)=>{
                                if(v.playerAssigned) return v.playerAssigned.id === p.id
                            });
                            if(_pVouchers && _pVouchers.length > 0) {
                                p.vouchersIssued = _pVouchers.length;
                            }
                            JsonService.deriveFulImageURL(p,'thumbnail');
                            JsonService.deriveFulImageURL(p,'photoUrl');
                            JsonService.deriveFulImageURL(p,'image');
                        });
                        this.playersAssigned = this.playersAssigned.sort((a,b)=>{
                            if(a.vouchersIssued < b.vouchersIssued) return 1;
                            else if (b.vouchersIssued < a.vouchersIssued) return - 1;
                            else return 0;
                        });
                    }
                                   
                }
            })
        }

        getListClubApplicable() {
            let _clubId;
            let _programId;
            this.flightService.getListAllPlayersCardDiscount(_clubId, _programId)
            .subscribe((data)=>{
                console.log("list club applicable ", data)
            })   
        }

        selectedDiscountCompany: any;
        selectedDiscountProgram: any;
        onSearchDiscountCompany() {
            let modal = this.modalCtrl.create(SearchDiscountCompanyModal, {
                headerTitle: 'Select Discount Company'
            });
            modal.onDidDismiss((data: any)=>{
                if(data && data.selected) {
                    this.selectedDiscountCompany = data.discCompany;
                    this.selectedDiscountProgram = null;
                    this.selDP = null;
                    this.getDiscountPrograms(this.selectedDiscountCompany);
                    // setTimeout(()=>{
                    //     if(this.discountPrograms && this.discountPrograms.length === 0 || !this.discountPrograms) {
                    //         MessageDisplayUtil.showMessageToast('There is no program under this company. Please choose different company', 
                    //         this.platform , this.toastCtl,3000, "bottom");
                    //     }
                    // },500);
                    
                    this.getAllDiscountCardApplications();
                }
            })
            modal.present();
        }

        getSelectedDiscountProgram() {
            let _selectedDiscProg = this.discountPrograms.filter((dp: DiscountCompanyProgram)=>{
                return dp.id === this.selectedDiscountProgram;
            }).map((dp)=>{
                return dp
            })
            if(_selectedDiscProg && _selectedDiscProg.length > 0) {
                this.selDP = _selectedDiscProg[0];
                console.log("get selected disc prog ", this.discountPrograms, this.selectedDiscountProgram, _selectedDiscProg, this.selDP)
                this.getAllDiscountCardApplications(this.selDP.id);
            }
        }

        
        getDiscountCompanyName() {
            return this.selectedDiscountCompany&&this.selectedDiscountCompany.name?this.selectedDiscountCompany.name:null;
        }

        
        getDiscountPrograms(discountCompany: DiscountCompany) {
            if(!discountCompany) return false;
            let _companyId = discountCompany.id;
            this.flightService.getDiscountPrograms(_companyId)
            .subscribe((data)=>{
                console.log("discount programs ", data)
                if(data) this.discountPrograms = data;
                
                if(this.discountPrograms && this.discountPrograms.length === 0 || !this.discountPrograms) {
                    MessageDisplayUtil.showMessageToast('There is no program under this company. Please choose different company', 
                    this.platform , this.toastCtl,3000, "bottom");
                    return false;
                }
            })
        }

        getClubDiscountProgram() {
            this.flightService.getListClubDiscountProgram(this.clubId, this.selectedDiscountProgram)
            .subscribe((data)=>{
                console.log("club discount program", data)
            })
        }

        applicableDiscountPlayerId: number;
        getApplicableDiscount() {
            let _date = moment().format("YYYY-MM-DD");
            this.flightService.getApplicableDiscountsForPlayer(this.clubId, this.applicableDiscountPlayerId, _date)
            .subscribe((data)=>{
                console.log("club applicable discount ", data)
            })
        }

        playerDiscountApplications: any;
        allDiscountApplications: any;
        playerDiscountPrograms: any;
        getPlayerDiscountCardApplications() {
            this.flightService.getListAllCardApplyForPlayer(this.applicableDiscountPlayerId, this.selectedDiscountProgram)
            .subscribe((data)=>{
                console.log("discount card application ", data)
                let _data: Array<DiscountPlayerClub>;
                if(data) {
                    _data = data.json();
                    this.playerDiscountPrograms = _data;
                    this.playerDiscountApplications = _data;
                }
            })
        }

        initAllDiscountCardApplications() {
            let _pendingDiscountCards = [];
            this.pendingPDP = [];
            this.approvedPDP = [];
            // let _playerId = this.bookingPlayer.player.playerId?this.bookingPlayer.player.playerId:this.bookingPlayer.player.id;
            // let _clubId = this.clubId?this.clubId:this.clubInfo.id;
            this.flightService.getDiscountCompanies()
            .subscribe((data)=>{
                console.log("pending - ", data)
                let _data
                if(data) _data = data;
                let _companies: Array<any> = _data.items;
                if(_data && _data.items && _data.items.length > 0) {
                    _companies.forEach((comp: DiscountCompany)=>{
                        this.flightService.getDiscountPrograms(comp.id)
                        .subscribe((program: Array<DiscountCompanyProgram>)=>{
                            if(program) {
                                program.forEach((p)=>{
                                    this.getAllDiscountCardApplications(p.id);
                                })
                            }
                        })
                        
                    })
                    
                //     console.log("get list applications pending list : ", _pendingDiscountCards)
                // this.pendingPDP.push(..._pendingDiscountCards);
                }
            }, (error)=>{
    
            }, ()=>{
            })   
        }

        getAllDiscountCardApplications(program?: string) {
            let _programId;
            if(program) _programId = program;
            else if(this.selectedDiscountProgram) _programId = this.selectedDiscountProgram.id;
            else _programId = null;
            // if(!program) {
                this.pendingPDP = [];
                this.approvedPDP = [];
            // }
            this.listDiscountPrograms = [];
            this.listDiscountCompanies = [];
            // if(!program && (!this.selectedDiscountCompany || !this.selectedDiscountProgram)) {
            //     MessageDisplayUtil.showMessageToast('Please select Discount Company and Program', 
            //     this.platform, this.toastCtl, 3000, "bottom");
            //     return false;
            // }
            this.flightService.getListAllPlayersCardDiscount(this.clubId, _programId)
            .subscribe((data)=>{
                console.log("all discount card application ", data, program, this.selectedDiscountCompany)
                let _data: Array<DiscountPlayerClub>;
                if(data) {
                    _data = data.json();
                    if(_data && _data.length > 0 && !program && this.selectedDiscountCompany) {
                        _data = _data.filter((d)=>{
                            return d.playerDiscountProgram.discountProgram.discountCompany.id === this.selectedDiscountCompany.id
                        })
                    }
                    if(_data && _data.length > 0) {
                        _data.forEach((dpc)=>{
                            this.listDiscountCompanies.push(dpc.playerDiscountProgram.discountProgram.discountCompany);
                            this.listDiscountPrograms.push(dpc.playerDiscountProgram.discountProgram);
                        });
                        let _pendingPDP = _data.filter((pdp)=>{
                            return !pdp.approved
                        });
                        this.pendingPDP.push(..._pendingPDP);

                        let _approvedPDP = _data.filter((pdp)=>{
                            return pdp.approved
                        });
                        this.approvedPDP.push(..._approvedPDP);

                        this.listDiscountCompanies = this.getUnique(this.listDiscountCompanies, 'id');
                        this.listDiscountPrograms= this.getUnique(this.listDiscountPrograms, 'id');
                        this.listDiscountCompanies = this.listDiscountCompanies.sort((a,b)=>{
                            if(a.name < b.name) return -1;
                            else if(a.name > b.name) return 1;
                            else return 0;
                        });
                        this.listDiscountPrograms = this.listDiscountPrograms.sort((a,b)=>{
                            if(a.discountCompany.name < b.discountCompany.name) {
                                if(a.name < b.name) return -1;
                                else if(a.name > b.name) return 1;
                            } else if(a.discountCompany.name > b.discountCompany.name) {
                                if(a.name < b.name) return -1;
                                else if(a.name > b.name) return 1;
                            } else return 0;
                        });
                        this.approvedPDP.forEach((pdp)=>{
                            JsonService.deriveFulImageURL(pdp.playerDiscountProgram,'document');
                        })
                        this.approvedPDP = this.approvedPDP.sort((a,b)=>{
                            if(a.dateApproved < b.dateApproved) return -1
                            else if(a.dateApproved > b.dateApproved) return 1
                            else return 0
                        })
                        this.pendingPDP.forEach((pdp)=>{
                            JsonService.deriveFulImageURL(pdp.playerDiscountProgram,'document');
                        })
                        this.pendingPDP = this.pendingPDP.sort((a,b)=>{
                            if(a.dateApplied < b.dateApplied) return -1
                            else if(a.dateApplied > b.dateApplied) return 1
                            else return 0
                        })

                        console.log("get list discount card application : approved ", this.approvedPDP)
                        console.log("get list discount card application : pending", this.pendingPDP)
                    }
                    // this.allDiscountApplications = _data;
                }
            })
        }

        getCompanyProgramDetails(program: DiscountCompanyProgram, type?: string) {
            if(!this.selDP) return false;
            if(!this.selDP.discountCompany) return false;
            let _discountProgram = this.selDP; //program;
            let _discountCompany = _discountProgram.discountCompany;
            let _currency= _discountCompany.address?_discountCompany.address.countryData.currencySymbol:this.currencySymbol;
            switch(type) {
                case 'name':
                    return _discountProgram.name
                case 'description':
                    return _discountProgram.description;
                case 'company':
                    return _discountCompany.name;
                case 'launchedOn':
                    return moment(_discountProgram.launchedOn).format("DD MMM YYYY");
                case 'amount':
                    if (_discountProgram.amountType === 'Absolute') {
                        return 'Less ' + _currency + " " + _discountProgram.discountAmount
                    } else if (_discountProgram.amountType === 'Fixed') {
                        return 'Amount ' + _currency + " " + _discountProgram.discountAmount
                    } else if (_discountProgram.amountType === 'Percentage') {
                        return _discountProgram.discountAmount + '% off';
                    } else return false;
                // case 'verified':
                //     let _verifyText;
                //     if(_discountCompany)
            } 
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
                case 'playerName':
                    return program.player.playerName;
                case 'playerId':
                    return program.player.id;
                case 'playerEmail':
                    return program.player.email;
                case 'playerPhone':
                    return program.player.address&&program.player.address.phone1?program.player.address.phone1:program.player.address.phone2?program.player.address.phone2:null;
            }
        }

        getExpiryDate(item: TeeTimeClubVoucher | TeeTimeDiscount, type ? : string) {
            if (!item) return '';
            if (item && !item.validFrom && !item.validUntil) return '';
            let _validTill;
            let _validFrom;
    
            let _today = moment();
            switch (type) {
                case 'discount':
                    _validTill = moment(item.validUntil);
                    _validFrom = moment(item.validFrom);
                    break;
                default:
                    _validTill = moment(item.validUntil);
                    _validFrom = moment(item.validFrom);
                    break;
            }
            // let _started = _validFrom.diff(_today, 'days');
            let _days = _validTill.diff(_today, 'days');
            let _months = _validTill.diff(_today, 'months');
            let _years = _validTill.diff(_today, 'years');
            if (_days > 0 && _months === 0) return 'Expires in ' + _days + ' day(s)';
            else if(_months > 0 && _years === 0) return 'Expires in ' + _months + ' month(s)'; 
            else if(_years > 0 && _years <= 100) return 'Expires in ' + _years + ' year(s)';
            else if(_years > 100) return 'No Expiry';
            else if (_days === 0) return 'Expires today';
            else if (_days < 0) return 'Expired';
            else return 'Expired';
            // return _started + ' | ' + _expireText + 'days';
        }

        
        getProgramAmountDetails(program: PlayerDiscountProgram) {
            if(!program || !program.discountProgram.discountCompany.address) return false;
            let _currency = program.discountProgram.discountCompany.address.countryData.currencySymbol;
            let _discountProgram = program.discountProgram;
            if (_discountProgram.amountType === 'Absolute') {
                return 'Less ' + _currency + " " + _discountProgram.discountAmount
            } else if (_discountProgram.amountType === 'Fixed') {
                return 'Amount ' + _currency + " " + _discountProgram.discountAmount
            } else if (_discountProgram.amountType === 'Percentage') {
                return _discountProgram.discountAmount + '% off';
            } else return false;

        }

        onPrivilegeCardApprove(pdp: PlayerDiscountProgram) {
            let _playerId = pdp.player.playerId?pdp.player.playerId:pdp.player.id;
            let _programId = pdp.discountProgram.id;
            let _clubId = this.clubId; //this.clubId?this.clubId:this.clubInfo.id;
            this.flightService.approvePlayerDiscountCard(_playerId, _programId, _clubId)
            .subscribe((data)=>{
                console.log("approving discount card ", data)
                if(data) {
                    this.getAllDiscountCardApplications();
                    // this.initAllDiscountCardApplications();
                    // this.getPlayerDiscountPrograms();
                }
            }, (error)=>{
                console.log("approving discount card", error)
                let _error = error.json();
                if(_error && _error.status === 409) {
                    this.flightService.applyForClubVerifyDiscountCard(_playerId, _programId, _clubId)
                    .subscribe((data)=>{
                        let _data = data.json();
                        console.log("player applinyg for discount card", data);
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
                        console.log("error apply", error)
                        let _error = error.json();
                        console.log("error apply 2", _error)
                        if(_error && _error.status !== 200) {
                            let _msg = _error.errors[0];
                            MessageDisplayUtil.showMessageToast(_msg, 
                            this.platform, this.toastCtl, 3000, "bottom");
                            return false;
                        }
                    })
                }
            }, () =>{
                // this.getAllDiscountCardApplications();
                // this.initAllDiscountCardApplications();
            });
        }
        onPrivilegeCardUndoApprove(pdp: PlayerDiscountProgram) {
            let prompt = this.alertCtrl.create({
                title: 'Undo Approved Player Discount Program',
                message: 'This will undo approval discount program to this selected player. Do you want to proceed? ',
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
                                this.goUndoApprovePrivilegeCard(pdp);
                            })
                            return false;
                        }
                    }
                ]
            });
            prompt.present();

        }

        goUndoApprovePrivilegeCard(pdp: PlayerDiscountProgram) {
            let _playerId = pdp.player.playerId?pdp.player.playerId:pdp.player.id;
            let _programId = pdp.discountProgram.id;
            let _clubId = this.clubId; //this.clubId?this.clubId:this.clubInfo.id;
            let _pdpId = pdp.id;
            this.flightService.undoApprovePlayerDiscountCard(_playerId, _programId, _clubId, _pdpId)
            .subscribe((data)=>{
                console.log("undo approving discount card ", data)
                if(data) {
                    this.getAllDiscountCardApplications();
                    // this.initAllDiscountCardApplications();
                    // this.getPlayerDiscountPrograms();
                }
            }, (error)=>{
                console.log("approving discount card", error)
                let _error = error.json();
                if(_error && _error.status === 409) {
                }
            }, () =>{
                // this.getAllDiscountCardApplications();
                // this.initAllDiscountCardApplications();
            });
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
            let _clubId = this.clubId; //this.currentSlot.clubData.id;
            this.flightService.applyForClubVerifyDiscountCard(_playerId, _programId, _clubId)
            .subscribe((data)=>{
                console.log("player applinyg for discount card", data);
                if(data) {
                    this.setOptionType(2);
                }
            }, (error)=>{
                console.log("error apply", error)
                let _error = error.json();
                if(_error && _error.status !== 200) {
                    let _msg = _error.errors[0];
                    MessageDisplayUtil.showMessageToast(_msg, 
                    this.platform, this.toastCtl, 3000, "bottom");
                    return false;
                }
            })
        }

        getPendingPDP(discountProgram: DiscountCompanyProgram) {
            // if(!this.pendingPDP || this.pendingPDP.length !== 0) return false;
            // if(!discountProgram) return false;
            console.log("search - pending : ", this.searchPrivilege)
            let _searchText = this.searchPrivilege.toLowerCase();
            let _filteredPendingPDP = this.pendingPDP.filter((pdp)=>{
                if(pdp.playerDiscountProgram.discountProgram.id === discountProgram.id  && !_searchText)
                return true
                if(pdp.playerDiscountProgram.player && pdp.playerDiscountProgram.discountProgram.id === discountProgram.id
                    && _searchText) {
                    return pdp.playerDiscountProgram.player.playerName.toLowerCase().includes(_searchText) ||
                    pdp.playerDiscountProgram.player.firstName.toLowerCase().includes(_searchText) || 
                    pdp.playerDiscountProgram.player.lastName.toLowerCase().includes(_searchText) ||
                    pdp.playerDiscountProgram.player.email.toLowerCase().includes(_searchText) ||
                    pdp.playerDiscountProgram.membershipNumber.toLowerCase().includes(_searchText)
                }
                // if(pdp.playerDiscountProgram && pdp.playerDiscountProgram.discountProgram.id === discountProgram.id
                //     && _searchText) {
                //     return pdp.playerDiscountProgram.membershipNumber.toLowerCase().includes(_searchText)
                // }
            })
            console.log("get pending pdp", _searchText, _filteredPendingPDP, " - ", this.pendingPDP, " - ", discountProgram)
            if(this.showPrivPendingOnly || this.showPrivAll) return _filteredPendingPDP
            else return [];
        }

        getApprovedPDP(discountProgram: DiscountCompanyProgram) {
            // if(!this.pendingPDP || this.pendingPDP.length !== 0) return false;
            // if(!discountProgram) return false;
            // console.log("approved pdp : ", discountProgram, this.approvedPDP)
            console.log("search - approved : ", this.searchPrivilege)
            let _searchText = this.searchPrivilege.toLowerCase();
            let _filteredApprovedPDP = this.approvedPDP.filter((pdp)=>{
                // return pdp.playerDiscountProgram.discountProgram.id === discountProgram.id
                if(pdp.playerDiscountProgram.discountProgram.id === discountProgram.id && !_searchText) return true
                if(pdp.playerDiscountProgram.player && pdp.playerDiscountProgram.discountProgram.id === discountProgram.id
                    && _searchText) {
                    return pdp.playerDiscountProgram.player.playerName.toLowerCase().includes(_searchText) ||
                    pdp.playerDiscountProgram.player.firstName.toLowerCase().includes(_searchText) || 
                    pdp.playerDiscountProgram.player.lastName.toLowerCase().includes(_searchText) ||
                    pdp.playerDiscountProgram.player.email.toLowerCase().includes(_searchText) ||
                    pdp.playerDiscountProgram.membershipNumber.toLowerCase().includes(_searchText)
                } 
                // if(pdp.playerDiscountProgram && pdp.playerDiscountProgram.discountProgram.id === discountProgram.id
                //     && _searchText) {
                //     return pdp.playerDiscountProgram.membershipNumber.toLowerCase().includes(_searchText)
                // }
            })
            console.log("get approved pdp", _searchText, _filteredApprovedPDP, " - ", this.approvedPDP, " - ", discountProgram)
            if(this.showPrivAppOnly || this.showPrivAll) return _filteredApprovedPDP
            else return []
        }

        refreshPrivilegeClick() {
            this.selectedDiscountProgram = null;
            this.selectedDiscountCompany = null;
            this.togglePrivDetails = false;
            this.discountPrograms = null;
            // this.initAllDiscountCardApplications();
            this.getAllDiscountCardApplications();
        }

        
        onZoomImage(image: string) {
            let imageZoom = this.modalCtrl.create(ImageZoom, {
                image: image
            })

            imageZoom.onDidDismiss((data: any) => {});
            imageZoom.present();
        }

        refreshClubMemberslist(status?: string) {
            let _params = {}
            // _params['search']
            this.clubMembers = [];
            console.log("refresh club ", this.clubId, " - ", status, " filter status : ", this.memberFilterStatus)
            if(status) _params['status'] = this.memberFilterStatus;
            // if(status) {
            //     if(status === 'Active')
            //         _params['status'] = 'Active';
            //     else if(status.includes('Suspend'))
            //         _params['status'] = 'Suspended'
            //     else _params['status'] = status;
            //     this.memberFilterStatus = status;
            //     // if(!this.memberFilterStatus)
            //     // for(let key in ClubMembershipStatus) {
            //     //     if(key === status.toUpperCase())
            //     //         this.memberFilterStatus = ClubMembershipStatus[key]
            //     // }
            // }
            // else if(!status) {
            //     this.memberFilterStatus = 'Inactive'; //'All';
            //     _params['status'] = 'Inactive'
            //     // _params['activeOnly'] = true;
            // }
            this.flightService.getClubMembersList(this.clubId, _params)
            .subscribe((data)=>{
                console.log("refresh club members list", data);
                if(data && data.length > 0) {
                    this.clubMembers = data;
                    // if(this.searchMembers && this.searchMembers.length > 0) {
                    //     this.clubMembers = this.clubMembers.filter((cm: ClubMembership)=>{
                    //         if(cm.membershipNumber.toLowerCase().includes(this.searchMembers)) return true
                    //         else if(cm.player.playerName.toLowerCase().includes(this.searchMembers)) return true
                    //         else if(cm.player.playerId === Number(this.searchMembers)) return true;
                    //         else if(cm.player.firstName.toLowerCase().includes(this.searchMembers)) return true;
                    //         else if(cm.player.lastName.toLowerCase().includes(this.searchMembers)) return true;
                    //         else return false;

                    //     })
                    // }
                }
            })
        }

        onApproveClubMembership(member: ClubMembership) {
            let _params = {};
            _params['clubId'] = this.clubId;
            _params['playerId'] = member.player.playerId;
            _params['membership'] = member.membershipNumber;
            this.flightService.updatePlayerClubMembership('approve', _params)
            .subscribe((data)=>{
                console.log("approve club members list", data);
                if(data) {
                    this.refreshClubMemberslist();
                    let _msg = 'Successfully approved selected player'
                    MessageDisplayUtil.showMessageToast(_msg, 
                    this.platform, this.toastCtl, 3000, "bottom");
                    return false;
                }
            }, (error)=>{
                let _error = error.json();
                console.log("on suspend error : ", _error)
                let _msg = _error.errorMessage;
                MessageDisplayUtil.showMessageToast(_msg, 
                this.platform, this.toastCtl, 3000, "bottom");
                return false;
            })
        }

        onSuspendClubMembership(member: ClubMembership) {
            let _params = {};
            _params['clubId'] = this.clubId;
            _params['playerId'] = member.player.playerId;
            _params['membership'] = member.membershipNumber;
            this.flightService.updatePlayerClubMembership('suspend', _params)
            .subscribe((data)=>{
                console.log("suspend club members list", data);
                if(data) {
                    this.refreshClubMemberslist();
                    let _msg = 'Successfully suspended selected player'
                    MessageDisplayUtil.showMessageToast(_msg, 
                    this.platform, this.toastCtl, 3000, "bottom");
                    return false;
                }
            }, (error)=>{
                let _error = error.json();
                console.log("on suspend error : ", _error)
                let _msg = _error.errorMessage;
                MessageDisplayUtil.showMessageToast(_msg, 
                this.platform, this.toastCtl, 3000, "bottom");
                return false;
            })
        }

        getImage(item: any) {
            // PlayerInfo
            if (item.thumbnail)
                return item.thumbnail;
            else if (item.photoUrl)
                return item.photoUrl;
            else if (item.profile)
                return item.profile;
            else if (item.image)
                return item.image;
            else
                return "img/default_user.png";
        }

        onFilterMembershipStatus() {
            let _buttons = [];
            for(let key in ClubMembershipStatus) {
                let _status;
                _status = ClubMembershipStatus[key];
                _buttons.push({
                    text: _status,
                    // icon: !this.platform.is('ios') ? 'close' : null,
                    handler: () => {
                        this.memberFilterStatus = _status;
                      actionSheet.dismiss().then(()=>{
                        this.refreshClubMemberslist(_status);
                      });
                      return false;
                    }
                })
            }
            // _buttons.push({
            //     text: 'All',
            //         icon: !this.platform.is('ios') ? 'close' : null,
            //         handler: () => {
            //           actionSheet.dismiss().then(()=>{
            //             this.refreshClubMemberslist();
            //             this.memberFilterStatus = 'All';
            //           });
            //           return false;
            //         }
            // })
            let actionSheet = this.actionSheetCtl.create({
                buttons: _buttons
              });
              actionSheet.present();
        }

        getMemberStatus(member: ClubMembership) {
            if(!member) return false;
            let _status;
            
            for(let key in ClubMembershipStatus) {
                if(ClubMembershipStatus[key] === member.status)
                    _status = ClubMembershipStatus[key]
            }
            return _status;
        }

        onUpdateMemberStatus(member?: ClubMembership, mode?: string) {

            let headerTitle;
            let message;
            let _confirmBtn;
            switch(mode) {
                case 'active':
                    headerTitle = 'Approving Player Club Membership';
                    message = 'Do you want to approve selected player?';
                    _confirmBtn = 'Approve' 
                    break;
                case 'suspend':
                    headerTitle = 'Suspending Player Club Membership';
                    message = 'Do you want to suspend selected player?';
                    _confirmBtn = 'Suspend'
                    break;
            }
            let prompt = this.alertCtrl.create({
                title: headerTitle,
                message: message,
                buttons: [{
                        text: 'No',
                    },
                    {
                        text: _confirmBtn,
                        handler: () => {
                            this.goUpdateMemberStatus(member, mode);
                        }
                    }
                ]
            });
            prompt.present();
            // alert dialog modal here
        }
        
        goUpdateMemberStatus(member?: ClubMembership, mode?: string) {
            if(mode === 'active') {
                this.onApproveClubMembership(member);
            } else if(mode === 'suspend') {
                this.onSuspendClubMembership(member);
            }
        }

        openMembershipOptions(member: ClubMembership) {
            let _member = member;
            let prompt = this.alertCtrl.create({
                title  : 'Club Membership',
                message: "Edit selected player Membership Number and click Save",
                inputs : [
                    {
                        name       : 'title',
                        placeholder: 'Membership Number',
                        value      : _member.membershipNumber
                    },
                ],
                buttons: [
                    {
                        text   : 'Cancel',
                        handler: data => {
                            prompt.dismiss();
                            if (this.platform.is('ios') && this.platform.is('cordova')) {
                                // this.keyboard.close();
                            }
                            return false;
                        }
                    },
                    {
                        text   : 'Save',
                        handler: data => {
                            prompt.dismiss()
                                  .then(() => {
                                      if (this.platform.is('ios') && this.platform.is('cordova')) {
                                        //   this.keyboard.close();
                                      }
                                      if (data && data.title) {
                                          this._addMembership(member,data.title);
                                      }
                                  });
                            return false;
                        }
                    }
                ]
            });
            prompt.present();
        }

        private _addMembership(member: ClubMembership, membership: string) {
            let _mode = 'approve'.toLowerCase(); //this.getMemberStatus(member).toLowerCase();
            let _params = {};
            _params['clubId'] = this.clubId;
            _params['playerId'] = member.player.playerId;
            _params['membership'] = membership;
            this.flightService.updatePlayerClubMembership(_mode, _params)
            .subscribe((data)=>{
                if(data) {
                    this.refreshClubMemberslist(_mode);
                    let _msg = 'Successfully updated membership for selected player'
                    MessageDisplayUtil.showMessageToast(_msg, 
                    this.platform, this.toastCtl, 3000, "bottom");
                    return false;
                }
            }, (error)=>{
                let _error = error.json();
                console.log("on update membership error : ", _error)
                let _msg = _error.errorMessage;
                MessageDisplayUtil.showMessageToast(_msg, 
                this.platform, this.toastCtl, 3000, "bottom");
                return false;
            });

            // this.playerService.updateClubMembership(club.clubId, membership)
            //     .subscribe(() => {
            //         this._refreshMemberships();
            //         // this.refreshMygolfHandicap();
            //     })
        }

        getClubMembers() {
            let _clubMembers;
            if(this.searchMembers && this.searchMembers.length > 0) {
                _clubMembers = this.clubMembers.filter((cm: ClubMembership)=>{
                    if(cm.membershipNumber.toLowerCase().includes(this.searchMembers)) return true
                    else if(cm.player.playerName.toLowerCase().includes(this.searchMembers)) return true
                    else if(cm.player.playerId === Number(this.searchMembers)) return true;
                    else if(cm.player.firstName.toLowerCase().includes(this.searchMembers)) return true;
                    else if(cm.player.lastName.toLowerCase().includes(this.searchMembers)) return true;
                    else if(cm.player.email.toLowerCase().includes(this.searchMembers)) return true;
                    else return false;

                })
            } else _clubMembers = this.clubMembers;
            return _clubMembers
        }

        getPrivilegeList() {
            let _privilegeList = this.listDiscountPrograms;
            return _privilegeList
        }

        setShowPriv(attribute: string) {
            this.showPrivAll = false;
            this.showPrivAppOnly = false;
            this.showPrivPendingOnly = false;
            if(attribute === 'pending') this.showPrivPendingOnly = true;
            else if(attribute === 'approved') this.showPrivAppOnly = true;
            else if(attribute === 'all') this.showPrivAll = true;
        }

        onMemberDetails(member) {
            return;
        }

}
