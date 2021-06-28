import { ClubInfo, TeeTimeSlot, TeeTimeSlotDisplay, ClubCourseData, PlayerData, ClubData, TeeTimeClubVoucherSeries, TeeTimeClubVoucher, ClubCredit, RefundAndRedeem } from '../../../data/mygolf.data';
import {Component} from "@angular/core";
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
import { Country } from '../../../data/country-location';
import { CountryListPage } from '../country-list/country-list';
import { PlayerService } from '../../../providers/player-service/player-service';
import { ActionSheetController } from 'ionic-angular';
import { groupBy } from 'rxjs/operator/groupBy';
import { mygolfUtils } from '../../../custom/mygolf2u-utils';
/**
 * Created by ashok on 19/12/16.
 */
@Component({
    templateUrl: 'player-refund-redeem-history.html',
    selector: 'player-refund-redeem-history'
})
export class PlayerRefundRedeemHistoryPage
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
    optionTypes: string = 'club';
    fromClub: boolean;
    selectedVoucher: boolean = false;
    selectedPlayer: boolean = false;
    hasPlayer: boolean = false;
    player: PlayerInfo; //PlayerData
    clubInfo: ClubInfo;
    searchClubId: number;
    playerNoOfVoucher: number = 1;
    clubVoucherSeries: Array<TeeTimeClubVoucherSeries>;
    searchVoucher: string;
    selVoucherSeries: TeeTimeClubVoucherSeries;
    playerVoucher: Array<TeeTimeClubVoucher>;
    currencySymbol: string;
    playerCredits: Array<any>;
    totalClubCredits: number;
    preferredCountry: Country;
    countryList: Array<Country>;
    clubCreditHistory: Array<RefundAndRedeem>;
    clubCredit: ClubCredit;
    startDate: string;
    endDate: string;
    filterInclude: string = 'Both';
    groupByName: string = 'none'; //'transactionDate'; //'none';
    appFooterHide: boolean = true;


    constructor(private viewCtrl: ViewController,
        private flightService: ClubFlightService,
        private navParams: NavParams,
        private toastCtl: ToastController,
        private platform: Platform,
        private modalCtrl: ModalController,
        private alertCtrl: AlertController,
        private playerService: PlayerService,
        private actionSheetCtl: ActionSheetController,
        private mg2uUtil: mygolfUtils) {
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
        if(this.fromClub) this.type = 'club';
        this.currencySymbol = navParams.get("currencySymbol");
        this.player = navParams.get("player");
        this.preferredCountry = navParams.get("preferredCountry")
        this.clubCredit = navParams.get("clubCredit");
        let _startOf = 'year';
        let _endOf = 'month';
        this.startDate = moment().startOf('year').format("YYYY-MM-DD");
        this.endDate = moment().endOf('month').format("YYYY-MM-DD");

    }

    ionViewDidLoad() {
        this.getAppAttribute();
        this.getPlayerRefundRedeemHistory();
        this.getPlayerCredits();
        this.getCountryList();
        // this.getClubVoucherSeries();
        // this.getTeeTimeBookingList();
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
                this.optionTypes = 'mygolf2u';
                this.selectedVoucher = false;
                this.selectedPlayer = false;
                // this.friendScreenName = 'Search';
                // if (this.platform.is("ios") && this.platform.is("cordova")) {
                //     this.keyboard.close();
                // }
            }
            if (type === 2) {
                this.optionTypes = 'club';
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
            switch(type) {
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

        onSelectPlayer() {
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
        }

        onPlayerAssignClick(voucher: TeeTimeClubVoucherSeries, player: PlayerData | PlayerInfo) {
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
            let _currentVoucherSeries = this.selVoucherSeries;
            let _clubId = this.clubId?this.clubId:this.clubInfo.clubId;
            let _playerId = player?player.playerId:this.player.playerId;
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

                                MessageDisplayUtil.showErrorToast('Successfully assigned '+this.playerNoOfVoucher+ ' vouchers', this.platform, this.toastCtl,
                                    5000, "bottom");

                            }
                        }
                        
                    });
                }
            })
        }

        getPlayerVoucher() {
            
            let _clubId = this.clubId?this.clubId:this.clubInfo.clubId;
            let _playerId = this.player.playerId;

            this.flightService.getListClubPlayerVouchers(_clubId, _playerId)
            .subscribe((data: Array<TeeTimeClubVoucher>)=>{
                console.log("get voucher list", data)
                if(data) {
                    this.playerVoucher = data.filter((v: TeeTimeClubVoucher)=>{
                        // return v. 
                        // v.voucherNumber.toLowerCase().includes(this.searchVoucher.toLowerCase()) || 
                        // v.name.toLowerCase().includes(this.searchVoucher.toLowerCase())
                    })
                }
            });
        }

        getPlayerDetails(player: PlayerInfo, attribute: string) {
            if(!player) return false;
            switch(attribute) {
                case 'image':
                    return player&&player.thumbnail?player.thumbnail:player.photoUrl;
            }
        }

        getPlayerCredits() {
            let _playerId = this.player.playerId;
            // this.player$.take(1)
            //     .subscribe(player => {
            //         _playerId = player.playerId;
            //     });
            this.flightService.getPlayerCredits(_playerId)
            .subscribe((data)=>{
                if(data) {
                    console.log("player id - ", _playerId, " -  credits : ", data)
                    data.forEach((cc: ClubCredit)=>{
                        JsonService.deriveFulImageURL(cc.club,'clubImage');
                        JsonService.deriveFulImageURL(cc.club,'clubLogo');
                    })
                    this.playerCredits = data;
                    if(this.playerCredits && this.playerCredits.length > 0) {
                        this.totalClubCredits = this.playerCredits
                        .map((a)=>{
                            return a.balance
                        }).reduce((a,b)=>{
                            return a + b
                        });
                        
                    }
                }
            })
        }

        refreshCredits() {
            this.getPlayerCredits();
        }

        getTotalClubCredits() {
            let _totalTxt = '';
            let _currency;
            let _totalCredits = 0;// this.playerCredits.
            if(this.playerCredits && this.playerCredits.length === 0) return '-'
            if(!this.playerCredits) return '-';
            if(!this.preferredCountry) return '-';
            if(!this.clubCredit) return '-';
            let _filteredCredit = this.clubCredit;
            _currency = this.clubCredit.currency.symbol;
            _totalCredits = this.clubCredit.balance;
            //  = this.playerCredits.filter((pc: ClubCredit)=>{
            //     return pc.club.address.countryData.id === this.preferredCountry.id
            // })
            // if(_filteredCredit && _filteredCredit.length === 0 ) return '-'
            // _totalCredits = _filteredCredit.map((pc: ClubCredit)=>{
            //     _currency = pc.currency.symbol
            //     return pc.balance
                
            // }).reduce((a,b)=>{
            //     return a+b
            // });
            _totalTxt = _currency + ' ' + this.mg2uUtil.numberWithCommas(_totalCredits.toFixed(2));
            return _totalTxt;

        }

        onChangePreferredOrigin() {
            let modal = this.modalCtrl.create(CountryListPage, {
                country: this.countryList,
                excludeAll: true
            });
            modal.onDidDismiss((country?: any) => {
                console.log("[country] DISMISS : ",country)
                if(country === null || country === -999 ) {
                    // this.preferredCountry = ;
                    this.countryList.filter((c)=>{
                        if(c.id === this.player.countryId) this.preferredCountry = c
                    })
                    // .map((c)=>{
                    //     return c
                    // })
                    // || country === isUndefined
                    // this.preferredCountry.
                //     // this.countryId = '';
                //     // this.countrySel.id = '';
                //     // this.countrySel.name = 'ALL'
                //     // this.countrySel.flagUrl = 'img/flag/default_worldwide.png';
                //     // console.log("[Country] DISMISS : countrySel", this.countrySel)
                //     // this.countrySelected(this.countryId)
                //     // console.log("[country] DISMISS : country undefined")
                }
                else {
                    this.preferredCountry = country
                }
                // else {
                //     let _country: Country = country;
                //     this.countryId = _country.id;
                //     console.log("[country] DISMISS country selected : ",_country)
                //     this.countrySelected(_country.id)
                    
                //     // adjustViewZIndex(this.nav, this.renderer);
                // }
    
                setTimeout(() => {
                    // this.getActiveComps();
                },500)
                console.log("[Country] Param :", country)
                // console.log("[Country] selId : ", this.countrySel.id)
                // console.log("[Country] selName : ",this.countrySel.name)
                // console.log("[Country] selFlagUrl : ",this.countrySel.flagUrl)
                // console.log("[Country] this.countryId : ", this.countryId)
                // console.log(_)
    
    
            });
            modal.present();
        }

        getCountryList() {
            console.log("player info : ", this.player)
            let _playerCountry = this.player.countryId;
            this.playerService.getCountryList()
                    .subscribe((data: Array<Country>) => {
                                // console.log("Country Sign Up : ",data)
    
                                this.countryList = data;
                                // this.preferredCountry = 
                                this.countryList.filter((pc)=>{
                                    if(pc.id === _playerCountry) this.preferredCountry = pc
                                })
                                .map((pc)=>{
                                    return pc
                                })
                                // this.countryList.push({
                                //     id: 'ALL',
                                //     name: 'ALL',
                                //     flagUrl: 'img/flag/default-worldwide.png'
                                // })
                                // console.log("Country List Sign Up : ", this.countryList)
            },(error)=>{

            }, () =>{
                // this.countryList.filter((c)=>{
                //     return c.id === 'MYS'
                // })
            });
    
            setTimeout(()=>{
                console.log("Get country calling back");
                // cb();
                
            }, 250)
        }

        filteredPlayerCredits() {
            let _playerCredits = [];
            let _preferredCountry: Country;
            console.log("filtered player credits : ", this.playerCredits)
            if(!this.playerCredits) return _playerCredits;
            else if(this.playerCredits && this.playerCredits.length === 0) return _playerCredits;
            else if(this.playerCredits && this.playerCredits.length > 0) {
                
            if(!this.preferredCountry) _preferredCountry = {
                id: this.player.countryId
            };
            else _preferredCountry = this.preferredCountry;
            _playerCredits = this.playerCredits.filter((pc: ClubCredit)=>{
                return pc.club.address.countryData.id === _preferredCountry.id
            })
            console.log("filtered player credits - ", _preferredCountry, _playerCredits)
            return _playerCredits

            } else return _playerCredits
        }

        confirmDate() {
            this.getPlayerRefundRedeemHistory();
        }

        getPlayerRefundRedeemHistory() {
            let _playerId = this.player.playerId;
            let _clubId = this.clubId;
            let _startOf = 'year';
            let _endOf = 'month';
            // if(this.appAttribute && this.appAttribute.filters && this.appAttribute.filters.startOfBy)
            //     _startOf = this.appAttribute.filters.startOfBy;
            // if(this.appAttribute && this.appAttribute.filters && this.appAttribute.filters.endOfBy)
            //     _endOf = this.appAttribute.filters.endOfBy;
            let _startDate;// = moment().startOf('year').format("YYYY-MM-DD");
            // if(_startOf === 'month') _startDate = moment().startOf('month').format("YYYY-MM-DD");
            // else if(_startOf === 'week') _startDate = moment().startOf('week').format("YYYY-MM-DD");
            // else if(_startOf === 'year') _startDate = moment().startOf('year').format("YYYY-MM-DD");
            if(this.startDate) _startDate = this.startDate;
            let _endDate;// = moment().endOf('month').format("YYYY-MM-DD");
            // if(_endOf === 'month') _startDate = moment().endOf('month').format("YYYY-MM-DD");
            // else if(_endOf === 'week') _startDate = moment().endOf('week').format("YYYY-MM-DD");
            // else if(_endOf === 'year') _startDate = moment().endOf('year').format("YYYY-MM-DD");
            if(this.endDate) _endDate = this.endDate;

            let _include = 'both';
            if(this.filterInclude) _include = this.filterInclude.toLowerCase();

            this.flightService.refundRedeemForPlayer(_clubId, _playerId, _startDate, _endDate,_include)
            .subscribe((data: any)=>{
                this.clubCreditHistory = data;
                console.log("club credits history : ", data);
                if(this.clubCreditHistory && (this.groupByName && this.groupByName.length > 0)) {
                    this.creditHistoryGroup(this.groupByName);
                }
            })
            
        }

        getDate(date: string) {
            return moment(date).format("ddd, DD MMM YYYY");
        }

        getCreditAmount(credit: RefundAndRedeem) {
            if(credit.type === 'Refund') return this.mg2uUtil.numberWithCommas(credit.amount.toFixed(2));
            else if(credit.type === 'Redeem') return this.mg2uUtil.numberWithCommas((-1 * credit.amount).toFixed(2));
        }

        getAmountClass(credit: RefundAndRedeem) {
            if(credit.type === 'Refund') return 'row refund-amount';
            else if (credit.type === 'Redeem') return 'row redeem-amount';
        }

        onFilterIncludeClick() {
            
            let actionSheet = this.actionSheetCtl.create({
                buttons: [{
                    text: 'Redeem Only',
                    // role: 'destructive', // will always sort to be on the bottom
                    handler: () => {
                        this.filterInclude = 'Redeem'
                        // this.getPlayerRefundRedeemHistory()
                    }
                },{ 
                    text: 'Refund Only',
                    // role: 'destructive', // will always sort to be on the bottom
                    handler: () => {
                        this.filterInclude = 'Refund';
                        // this.getPlayerRefundRedeemHistory()
                    }
                },{ 
                    text: 'All',
                // role: 'destructive', // will always sort to be on the bottom
                handler: () => {
                    this.filterInclude = 'Both'
                    //   this.getPlayerRefundRedeemHistory()
                }
                }]
            });
            actionSheet.present();
            actionSheet.onDidDismiss(()=>{
                this.getPlayerRefundRedeemHistory();
            })  
        }

        creditHistoryGroup(attribute?: string) {
            if(!this.clubCreditHistory) return;
            if(this.clubCreditHistory && this.clubCreditHistory.length === 0) return;
            let _history = this.clubCreditHistory.sort((a,b)=>{
                if(this.groupByName === 'transactionDate') {    
                    if(a.transactionDate < b.transactionDate) return -1
                    else if (a.transactionDate > b.transactionDate) return 1
                    else return 0
                } else if(this.groupByName === 'reference') {    
                    if(a.reference < b.reference) return -1
                    else if (a.reference > b.reference) return 1
                    else return 0
                } else if(this.groupByName === 'type') {    
                    if(a.type < b.type) return -1
                    else if (a.type > b.type) return 1
                    else return 0
                }
                else return 0
            })
            console.log("Unique : ", this.getUnique(_history, 'transactionDate'))
            if(attribute) {
                return this.getUnique(_history, attribute)
            } else return this.getUnique(_history, 'transactionDate')
        }

        creditHistoryFiltered(clubCredit: RefundAndRedeem, attribute?: string) {
            let _clubCreditHistory:Array<any> = this.clubCreditHistory.filter((ch)=>{
                if(attribute === 'reference') return ch.reference === clubCredit.reference
                else if(attribute === 'transactionDate') return ch.transactionDate === clubCredit.transactionDate
                else if(attribute === 'type') return ch.type === clubCredit.type
                else return ch.transactionDate === clubCredit.transactionDate
            })
            // _clubCreditHistory.forEach((ch)=>{
            //     if(!ch.expandMode) ch.expandMode = false
            // })
            return _clubCreditHistory;
        }

        onChangeGroupByClick() {
            let actionSheet = this.actionSheetCtl.create({
                buttons: [{
                    text: 'Transaction Date',
                    // role: 'destructive', // will always sort to be on the bottom
                    handler: () => {
                        this.groupByName = 'transactionDate'
                        // this.getPlayerRefundRedeemHistory()
                    }
                },{ 
                    text: 'Booking Reference',
                    // role: 'destructive', // will always sort to be on the bottom
                    handler: () => {
                        this.groupByName = 'reference';
                        // this.getPlayerRefundRedeemHistory()
                    }
                },{ 
                    text: 'Mode',
                // role: 'destructive', // will always sort to be on the bottom
                handler: () => {
                    this.groupByName = 'type'
                    //   this.getPlayerRefundRedeemHistory()
                    }
                }, {
                    text: 'None',
                    handler: () =>{
                        this.groupByName = 'none';
                    }
                }]
            });
            actionSheet.present();
            actionSheet.onDidDismiss(()=>{
                this.getPlayerRefundRedeemHistory();
            })  
        }

        getGroupByName() {
            if(this.groupByName === 'type') {
                return 'Mode'
            } else if(this.groupByName === 'none') {
                return 'None'
            } else if(this.groupByName === 'transactionDate') {
                return 'Transaction Date'
            } else if(this.groupByName === 'reference') {
                return 'Booking Reference'
            }
        }

        getFilterIncludeName() {
            if(this.filterInclude.toLowerCase() === 'both') {
                return 'All'
            }
            else if(this.filterInclude.toLowerCase() === 'redeem') {
                return 'Redeem'
            }
            else if(this.filterInclude.toLowerCase() === 'refund') {
                return 'Refund'
            }
        }

        expandDetails(clubCredit) {
            console.log("expand details : ", clubCredit)
            if(clubCredit.type !== 'Refund') return;
            if(!clubCredit.hasOwnProperty('expandMode')) clubCredit.expandMode = false;
            if(typeof clubCredit.expandMode === 'undefined') clubCredit.expandMode = false;
            if(clubCredit.expandMode === undefined) clubCredit.expandMode = false;
            
            if(clubCredit.type === 'Refund')
                clubCredit.expandMode = !clubCredit.expandMode
        }

        appAttribute: any;
        getAppAttribute() { 
            console.log("[app attribute] : ")
            this.flightService.getAppAttributes()
            .subscribe((data: any)=>{
                console.log("[app attribute] : ", data)
                if(data) {
                    data.filter((d)=>{
                        return d.page === 'playerRefundRedeemHistory'
                    }).map((d)=>{
                        this.appAttribute = d
                    });

                    if(this.appAttribute) {
                        let _startOf = 'year';
                        let _endOf = 'month';
                        if(this.appAttribute && this.appAttribute.filters && this.appAttribute.filters.startOfBy)
                        _startOf = this.appAttribute.filters.startOfBy;
                        if(this.appAttribute && this.appAttribute.filters && this.appAttribute.filters.endOfBy)
                            _endOf = this.appAttribute.filters.endOfBy;
                        let _startDate = moment().startOf('year').format("YYYY-MM-DD");
                        if(_startOf === 'month') _startDate = moment().startOf('month').format("YYYY-MM-DD");
                        else if(_startOf === 'week') _startDate = moment().startOf('week').format("YYYY-MM-DD");
                        else if(_startOf === 'year') _startDate = moment().startOf('year').format("YYYY-MM-DD");
                        // if(this.startDate) _startDate = this.startDate;
                        this.startDate = _startDate;
                        let _endDate = moment().endOf('month').format("YYYY-MM-DD");
                        if(_endOf === 'month') _endDate = moment().endOf('month').format("YYYY-MM-DD");
                        else if(_endOf === 'week') _endDate = moment().endOf('week').format("YYYY-MM-DD");
                        else if(_endOf === 'year') _endDate = moment().endOf('year').format("YYYY-MM-DD");
                        this.endDate = _endDate;
                        // if(this.appAttribute.filterRefundMethodList) this.refundMethodList = this.appAttribute.filterRefundMethodList
                        // if(this.appAttribute.filters & this.appAttribute.filters.showRefundBy) this.showRefundBy = this.appAttribute.filters.showRefundBy 
                    }

                }
            })
        }

}
