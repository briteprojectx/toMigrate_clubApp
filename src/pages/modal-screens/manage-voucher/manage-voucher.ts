import { ClubInfo, TeeTimeSlot, TeeTimeSlotDisplay, ClubCourseData, PlayerData, ClubData, TeeTimeClubVoucherSeries, TeeTimeClubVoucher } from './../../../data/mygolf.data';
import {Component, HostListener} from "@angular/core";
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
import { series } from 'async';
/**
 * Created by ashok on 19/12/16.
 */
@Component({
    templateUrl: 'manage-voucher.html',
    selector: 'manage-voucher-page'
})
export class ManageVoucherModal
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
    optionTypes: string = 'assign';
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
    vouchersIssued: Array<any> = new Array<any> ();
    voucherMoreDetails: boolean = false;

    voucherQuickView: boolean = false;

    innerWidth: any;

    constructor(private viewCtrl: ViewController,
        private flightService: ClubFlightService,
        private navParams: NavParams,
        private toastCtl: ToastController,
        private platform: Platform,
        private modalCtrl: ModalController,
        private alertCtrl: AlertController) {
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
        this.getClubVoucherSeries();
        // this.getTeeTimeBookingList();
    }

    ionViewDidEnter() {
        
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
                this.optionTypes = 'manage';
                this.selectedVoucher = false;
                this.selectedPlayer = false;
                // this.friendScreenName = 'Search';
                // if (this.platform.is("ios") && this.platform.is("cordova")) {
                //     this.keyboard.close();
                // }
            }
            if (type === 2) {
                this.optionTypes = 'assign';
                this.selectedVoucher = false;
                this.selectedPlayer = false;
                this.getClubVouchersIssued();
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
                clubId: this.clubId,
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

        onSelectPlayerList(player: PlayerData, vs?: TeeTimeClubVoucherSeries) {
            if(vs) this.onSeriesAssignClick(vs);
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
                
            }, (error)=>{

            }, ()=>{
                this.getClubVouchersIssued();
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
                return 'Save ' + _currency + " " + voucher.voucherAmount
            } else if (voucher.voucherAmountType === 'Fixed') {
                return 'Pay up to ' + _currency + " " + voucher.voucherAmount
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
                _allowWeekdays = (voucher && voucher.allowOnWeekdays && (voucher.allowOnWeekends && voucher.allowOnPublicHolidays) ? 'Weekdays' + ', ' : voucher && voucher.allowOnWeekdays ? 'Weekdays' : '');
                _allowWeekends = (voucher && voucher.allowOnWeekends && (voucher.allowOnWeekdays) && voucher.allowOnPublicHolidays)? 'Weekends' : (voucher && voucher.allowOnWeekdays && voucher.allowOnWeekends && !voucher.allowOnPublicHolidays) ? ' and ' + 'Weekends' : (voucher && !voucher.allowOnWeekdays && voucher.allowOnWeekends)?'Weekends':'';
                _allowHolidays = (voucher && ((voucher.allowOnWeekdays || voucher.allowOnWeekends) && voucher.allowOnPublicHolidays) ? ' and ' + 'Public Holidays' : voucher && voucher.allowOnPublicHolidays ? 'Public Holidays' : '');
    
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
            if(this.playerNoOfVoucher < 0) {
                MessageDisplayUtil.showErrorToast("Please enter valid number of vouchers", this.platform, this.toastCtl,
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
            if(this.playerNoOfVoucher < 0) {
                MessageDisplayUtil.showErrorToast("Please enter valid number of vouchers", this.platform, this.toastCtl,
                    5000, "bottom");
                    return false;

            }
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
            
            let _currentVoucherSeries = this.selVoucherSeries;
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

                                MessageDisplayUtil.showErrorToast('Successfully unassigned '+this.playerNoOfVoucher+ ' vouchers', this.platform, this.toastCtl,
                                5000, "bottom");

                            }
                        }
                        
                    });
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
                    // return player&&player.thumbnail?player.thumbnail:player.photoUrl?player.photoUrl:player.image;
                    return player&&player.profile?player.profile:player.image;
            }
        }

        onViewMoreVouchers(selVoucherSeries: TeeTimeClubVoucherSeries, player: PlayerInfo) {
            this.displayPlayerVoucher = true;
            // this.flightService.getListPlayerVouchers()
            this.playerVoucher = this.playerVoucher.filter((v)=>{
                return selVoucherSeries.id === v.seriesId
            });
        }

        getClubVouchersIssued(voucher?: TeeTimeClubVoucherSeries) {
            let _clubId = this.clubId;
            let _seriesId = voucher&&voucher.id?voucher.id:null;
            let _issued = 999; //voucher.vouchersIssued;
            let _playersAssigned: Array<PlayerData> = new Array<PlayerData> ();
            this.playersAssigned = [];
            this.flightService.getVouchersIssued(_clubId, _seriesId, null, false, false, _issued)
            .subscribe((data)=>{
                if(data) {
                    console.log("get club vouchers issued ", data)
                    let _data: Array<TeeTimeClubVoucher> = data.items;
                    _data.forEach((v)=>{
                        if(v.playerAssigned) _playersAssigned.push(v.playerAssigned);
                        JsonService.deriveFulImageURL(v.playerAssigned,'thumbnail');
                        JsonService.deriveFulImageURL(v.playerAssigned,'photoUrl');
                        JsonService.deriveFulImageURL(v.playerAssigned,'image');
                        JsonService.deriveFulImageURL(v.playerAssigned,'profile');
                    });
                    this.vouchersIssued = _data;
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
        getPlayerAssignedVoucherSeries(seriesId: number) {
            let _vouchersIssued = this.vouchersIssued.filter((v)=>{
                return v.seriesId === seriesId;
            });
            let _playersAssigned = [];
            _vouchersIssued.forEach((v)=>{
                if(v.playerAssigned) _playersAssigned.push(v.playerAssigned);
            });
            
            _playersAssigned = this.getUnique(_playersAssigned,'id');
            _playersAssigned.forEach((p: any)=>{
                let _seriesId;
                let _pVouchers = _vouchersIssued.filter((v)=>{
                    if(v.playerAssigned) {
                        _seriesId = v.seriesId
                        return v.playerAssigned.id === p.id
                    } 
                });
                if(_pVouchers && _pVouchers.length > 0) {
                    p.vouchersIssued = _pVouchers.length;
                    p.seriesId = _seriesId;
                }
            });
            
            _playersAssigned = _playersAssigned.sort((a,b)=>{
                if(a.vouchersIssued < b.vouchersIssued) return 1;
                else if (b.vouchersIssued < a.vouchersIssued) return - 1;
                else return 0;
            });
            return _playersAssigned;
                
            // let _playersAssigned = this.playersAssigned;
            // if(!_playersAssigned) return _playersAssigned;
            // if(_playersAssigned && _playersAssigned.length === 0) return _playersAssigned;
            // if(_playersAssigned && _playersAssigned.length > 0) {
            //     _playersAssigned = _playersAssigned.filter((v: TeeTimeClubVoucher)=>{
            //         return v.seriesId === seriesId;
            //     })
            //     return _playersAssigned;
            // }
        }

        escapeCRLF(value) {
            return JsonService.escapeCRLF(value);
        }

}
