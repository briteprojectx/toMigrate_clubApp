import { TeeTimeSlot, TeeTimeSlotDisplay, ClubCourseData, ClubData, TeeTimeClubVoucher, TeeTimeBookingPlayer, PlayerData, TeeTimeDiscount, PlayerTypes, TeeTimeBookingDiscount, TeeTimeClubVoucherSeries } from './../../../data/mygolf.data';
import {Component} from "@angular/core";
import {ViewController, NavParams, ToastController, Platform} from "ionic-angular";
import { CourseInfo, CourseHoleInfo } from "../../../data/club-course";
import { ClubFlightService } from "../../../providers/club-flight-service/club-flight-service";
import { TeeTimeBooking } from "../../../data/mygolf.data";


import * as moment from "moment";
import { MessageDisplayUtil } from '../../../message-display-utils';
import { PlayerInfo } from '../../../data/player-data';
import { AlertController } from 'ionic-angular';
import { JsonService } from '../../../json-util';
import { ImageZoom } from '../image-zoom/image-zoom';
import { ModalController } from 'ionic-angular';
/**
 * Created by ashok on 19/12/16.
 */
@Component({
    templateUrl: 'voucher-list.html',
    selector: 'voucher-list-page'
})
export class VoucherListModal
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
    who: string;
    forBooking: boolean;
    player: PlayerData; //PlayerInfo
    players: Array<PlayerData> = new Array<PlayerData> ();
    mode: string;
    clubInfo: ClubData;
    playerVoucher: Array<TeeTimeClubVoucher> = new Array<TeeTimeClubVoucher> ();
    voucherUsed: Array<TeeTimeClubVoucher>;
    bookingId: number;
    searchVoucher: string;
    isVoucherApplied: boolean = false;

    option: string = 'vouchers';
    discountUsed: Array<TeeTimeDiscount>;
    playerProfiles: Array<any>
    playerActiveClubDiscount: Array<TeeTimeDiscount>;
    appliedBookingDiscounts: Array<TeeTimeBookingDiscount>;
    appliedVouchers: Array<TeeTimeBookingDiscount>;
    playersAssigned: Array<any> = new Array<any>();

    showVoucherActive: boolean;


    constructor(private viewCtrl: ViewController,
        private flightService: ClubFlightService,
        private navParams: NavParams,
        private toastCtl: ToastController,
        private platform: Platform,
        private alertCtrl: AlertController,
        private modalCtrl: ModalController) {
        this.courses = navParams.get("courses");
        this.clubId = navParams.get("clubId");
        this.forDate = navParams.get("forDate");
        this.courseId = navParams.get("courseId");
        this.changeType = navParams.get("changeType");
        this.currentSlot = navParams.get("currentSlot")
        if(this.changeType && this.changeType ==='slot') this.isClub = false;
        else if(this.changeType && this.changeType === 'course') this.isClub = true;
        
        this.who = navParams.get("who");
        this.forBooking = navParams.get("forBooking");
        this.player = navParams.get("player");
        let bookingPlayers: Array<TeeTimeBookingPlayer> = (navParams.get("players"));
        let _players: Array<PlayerData> = [];
        bookingPlayers.forEach((p: TeeTimeBookingPlayer)=>{
            _players.push(p.player)
        });
        // setTimeout(()=>{
        if(_players && _players.length > 0)
            this.players.push(..._players);// = [..._players]
        // },500)
        // this.players = 
        this.mode = navParams.get("mode");
        this.clubInfo = navParams.get("clubInfo");
        this.bookingId = navParams.get("bookingId");

        console.log(bookingPlayers);
        console.log(_players)
        console.log(this.players);

        let _bookingDiscounts = this.navParams.get("bookingDiscounts");
        this.appliedBookingDiscounts = _bookingDiscounts.filter((bd)=>{
            return !bd.voucherApplied
        });
        this.appliedVouchers = _bookingDiscounts.filter((v)=>{
            return v.voucherApplied
        });

        console.log('applied booking discounts ', this.appliedBookingDiscounts);
        console.log('applied vouchers ', this.appliedVouchers);

        // console.log("voucher list modal : ",this.who,
        // this.forBooking,
        // this.player,
        // this.mode,
        // this.clubInfo)

    }

    ionViewDidLoad() {
        // this.getTeeTimeBookingList();
        if(this.who === 'player' && this.forBooking && this.mode === 'apply') {
            this.getListPlayerVoucher('single');
        } else {
            // this.getListPlayerVoucher('multi');
            this.getClubVoucherSeries();
        }
    }
    close(){
        let _needRefresh = this.isVoucherApplied;
        this.viewCtrl.dismiss({
            needRefresh: _needRefresh,
        });
        // this.viewCtrl.dismiss();
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

        getListPlayerVoucher(type?: string) {
            this.playerVoucher = [];
            if(type === 'single') {
                let _clubId;
                let _playerId;
                if(this.clubInfo) _clubId = this.clubInfo.id;
                if(this.player) _playerId = this.player.playerId;
                this.flightService.getListClubPlayerVouchers(_clubId, _playerId)
                .subscribe((playerVoucher: Array<TeeTimeClubVoucher>)=>{
                    console.log("get voucher list", playerVoucher)
                    if(playerVoucher && playerVoucher.length > 0) 
                        this.playerVoucher = playerVoucher
                        
                        this.playerVoucher = this.playerVoucher.sort((a,b)=>{
                            if(a.playerAssigned.playerName < b.playerAssigned.playerName) {
                                if(a.name < b.name) return -1
                                else if(a.name > b.name) return 1
                                else return -1
                            } else if(a.playerAssigned.playerName > b.playerAssigned.playerName) {
                                if(a.name < b.name) return -1
                                else if(a.name > b.name) return 1
                                else return -1
                            } else return 0
                        })
                    //     .filter((v: TeeTimeClubVoucher)=>{
                    //         return !v.redeemed
                    //    });
                });
            } else if(type === 'multi') {
                
                console.log("get voucher multi", this.players)
                let _clubId;
                let _playerId;
                let _playerAssigned;
                if(this.clubInfo) _clubId = this.clubInfo.id;
                if(this.player) _playerId = this.player.playerId;
                let _playerVoucher = [];
                this.players.forEach((p: PlayerData)=>{
                    this.flightService.getListClubPlayerVouchers(_clubId, p.id)
                    .subscribe((playerVoucher: Array<TeeTimeClubVoucher>)=>{
                        console.log("get voucher list", playerVoucher)
                        if(playerVoucher && playerVoucher.length > 0) 
                            this.playerVoucher.push(...playerVoucher)
                            // _playerVoucher.push(playerVoucher);
                        this.playerVoucher = this.playerVoucher.sort((a,b)=>{
                            if(a.playerAssigned.playerName < b.playerAssigned.playerName) {
                                if(a.name < b.name) return -1
                                else if(a.name > b.name) return 1
                                else return -1
                            } else if(a.playerAssigned.playerName > b.playerAssigned.playerName) {
                                if(a.name < b.name) return -1
                                else if(a.name > b.name) return 1
                                else return 1
                            } else return 0
                        })
                    });
                });
                // setTimeout(()=>{
                //     this.playerVoucher.push(..._playerVoucher);
                // })
                
            }
            // if(this.playerVoucher && this.playerVoucher.length > 0) {
            //     this.playerVoucher = this.getUnique(this.playerVoucher, 'playerAssigned');
            //     this.playerVoucher = this.getUnique(this.playerVoucher, 'seriesId');
            // }
            
        }
        getVoucherApplicableText(voucher: TeeTimeClubVoucher, type: string) {
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

        onUseThisVoucher(voucher: TeeTimeClubVoucher) {
            console.log("on use this voucher ", voucher, " - applied vouchers ", this.appliedVouchers)
            let _voucherUsed: boolean = false;
            if(this.voucherUsed && this.voucherUsed.length > 0) _voucherUsed = true;
            let _voucher = voucher;
            if(!_voucher.usableWithOtherRewards && this.voucherUsed) {
                MessageDisplayUtil.showMessageToast('This voucher cannot be used with any other voucher', 
                this.platform, this.toastCtl,3000, "bottom")
                return false;
            }
            let _hasApplied =
            this.appliedVouchers.filter((bd)=>{
                return bd.voucherApplied.playerAssigned.id === voucher.playerAssigned.id && bd.voucherApplied.seriesId ===  voucher.seriesId
            })
            if(_hasApplied && _hasApplied.length>0) {
                MessageDisplayUtil.showMessageToast("This player's voucher has been used for this booking.", 
                this.platform, this.toastCtl,3000, "bottom")
                return false;
            }
            // this.playerVoucher.filter((v)=>{
            //     if(v.playerAssigned.id === voucher.playerAssigned.id && v.seriesId === voucher.seriesId)
            // })
            let _voucherHasApplied = this.appliedVouchers.filter((v)=>{
                if(v.voucherApplied.playerAssigned.id === voucher.playerAssigned.id && v.voucherApplied.seriesId === voucher.seriesId)
                    console.log("this voucher has been applied for 1 ", v, " - 2 ", voucher);
            })
            if(_voucherHasApplied && _voucherHasApplied.length > 0) {
                MessageDisplayUtil.showMessageToast("This player's voucher has been used for this booking.", 
                this.platform, this.toastCtl,3000, "bottom")
                return false;
            }

            this.flightService.applyPlayerBookingVoucher(this.bookingId, _voucher.id)
            .subscribe((data: any) => {
                if(data) {
                    // this.voucherUsed.push(voucher);
                    console.log("apply player booking voucher : ", data);
                    this.isVoucherApplied = true;
                    MessageDisplayUtil.showMessageToast('Successfully applied voucher', this.platform, this.toastCtl,3000, "bottom")
                    if(this.who === 'player' && this.forBooking && this.mode === 'apply') {
                        this.getListPlayerVoucher('single');
                    } else {
                        // this.getListPlayerVoucher('multi');
                        this.getClubVoucherSeries();

                    }
                    
                    let _data = data.json();
                    let _bookingDiscounts = _data.bookingDiscounts;
                    this.appliedVouchers = _bookingDiscounts.filter((d: TeeTimeBookingDiscount) => {
                        return d.voucherApplied
                    }).map((d: TeeTimeBookingDiscount) => {
                        return d.voucherApplied;
                    });
                }
            }, (error)=>{
                let _error = error.json();
                MessageDisplayUtil.showErrorToast(_error.errors[0], 
                this.platform, this.toastCtl,3000, "bottom")
                // console.log("error voucher : ", _error.errors[0])
                let alert = this.alertCtrl.create({
                    title: '',
                    // subTitle: 'Selected date is '+ _date,
                    message: _error.errors[0], //'Selected date is ' + '<b>' + _date + '</b>',
                    buttons: ['Close']
                });
                alert.present();
            })


            
        }
        onRemoveThisVoucher(voucher: TeeTimeClubVoucher ) {
            // this.flightService.applyPlayerBookingVoucher(this.bookingId, _voucher.id)
            // .subscribe((data: any) => {
                if(!voucher) {
                    MessageDisplayUtil.showMessageToast('Successfully removed voucher', this.platform, this.toastCtl,3000, "bottom");
                    return false;
                }
                this.flightService.removePlayerBookingVoucher(this.bookingId, voucher.id)
                .subscribe((data: any) => {
                    console.log('remove voucher', data)
                    if(data) {
                        this.isVoucherApplied = true;
                        if(this.who === 'player' && this.forBooking && this.mode === 'apply') {
                            this.getListPlayerVoucher('single');
                        } else {
                            this.getListPlayerVoucher('multi');
                        }
                        
                        let _data = data.json();
                        let _bookingDiscounts = _data.bookingDiscounts;
                        this.appliedVouchers = _bookingDiscounts.filter((d: TeeTimeBookingDiscount) => {
                            return d.voucherApplied
                        }).map((d: TeeTimeBookingDiscount) => {
                            return d.voucherApplied;
                        });
                    }
                });
        }

        getDateText(date: string) {
            if(date && date.length === 0) return false;
            if(!date) return false;
            let _date = date;
            return moment(_date,'YYYY-MM-DD').format("DD MMM YYYY");
        }

        getVoucherForWho(voucher: TeeTimeClubVoucher) {
            let _whoVoucher;
            if(voucher) {
                _whoVoucher = this.playerVoucher.filter((t: TeeTimeClubVoucher)=>{
                    return t.id === voucher.id
                });

                if(_whoVoucher && _whoVoucher.length > 0) 
                    return "("+ _whoVoucher[0]&&_whoVoucher[0].playerAssigned&&_whoVoucher[0].playerAssigned.playerName?_whoVoucher[0].playerAssigned.playerName:'' +")";
                else return '';
            }

        }

        onSearchVoucherClick() {
            console.log("club id : "+ this.clubInfo, " | player id : "+ this.player?this.player:'---');
            this.playerVoucher = [];
            let _clubId;
            let _playerId;
            if(this.clubInfo) _clubId = this.clubInfo.id;
            if(this.player) _playerId = this.player.playerId;
            if(this.who === 'player' && this.forBooking && this.mode === 'apply') {
                this.getListPlayerVoucher('single');
            } else {
                // this.getListPlayerVoucher('multi');
                this.getClubVoucherSeries();
            }
            
            // this.flightService.getListClubPlayerVouchers(_clubId, _playerId)
            // .subscribe((data: Array<TeeTimeClubVoucher>)=>{
            //     console.log("get voucher list", data)
            //     if(data) {
            //         this.playerVoucher = data.filter((v: TeeTimeClubVoucher)=>{
            //             return v.voucherNumber.toLowerCase().includes(this.searchVoucher.toLowerCase()) || 
            //             v.name.toLowerCase().includes(this.searchVoucher.toLowerCase())
            //         })
            //     }
            // });
        }

        getExpiryDate(item: TeeTimeClubVoucher | TeeTimeDiscount, type?: string) {
            if(!item) return null;
            let _validTill;
            let _validFrom;
            
            let _today = moment();
            switch(type) {
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

        getVoucherAmountDetails(voucher: TeeTimeClubVoucher) {
            if(voucher.voucherAmountType === 'Absolute') {
                return 'Less ' + this.getVoucherCurrency(voucher) + " " + voucher.voucherAmount
            } else if(voucher.voucherAmountType === 'Fixed') {
                return 'Amount ' + this.getVoucherCurrency(voucher) + " " + voucher.voucherAmount
            } else if(voucher.voucherAmountType === 'Percentage') {
                return voucher.voucherAmount + '% off';
            } else return false;

        }

        getVoucherCurrency(voucher: TeeTimeClubVoucher) {
            let _currencySymbol = this.clubInfo&&this.clubInfo.address?this.clubInfo.address.countryData.currencySymbol:'';
            return _currencySymbol
        }

        getActiveClubDiscounts() {
            this.playerProfiles = [];
            let _clubId = this.clubInfo?this.clubInfo.id:null;
            if(!_clubId) return false;
            // let _playerId = this.player.id || this.player.playerId;
            // let _playerType = this.bookingPlayer.playerType;
            // console.log("player profiles", _clubId, _playerId, this.player, this.bookingPlayer)
            this.flightService.getActiveListClubDiscounts(_clubId)
            .subscribe((activeClubDiscounts: Array<TeeTimeDiscount>)=>{
                console.log("applicable player profiles : ", activeClubDiscounts);
                if(activeClubDiscounts) {
                    // if(this.bookingPlayer.playerType) {
                    //     let _has: boolean = false;
                    //     this.playerActiveClubDiscount = activeClubDiscounts.filter((acd)=>{
                    //         acd.playerTypes.filter((pt)=>{
                    //             console.log("pt player types ", pt, ' === ', _playerType)
                    //             if(pt.bookingPlayerType.id === _playerType.id) {
                    //                 console.log("same");
                    //                 _has = true;
                    //                 return _has;
                    //             } 
                    //             else return false;
                    //         })
                    //         return _has;
                    //     });
                    // } else 
                    this.playerActiveClubDiscount = activeClubDiscounts;
                }
            })
        }

        getPlayerProfile(profile: string) {
            console.log("get player profile - ", profile," : ", PlayerTypes[profile]);
            return PlayerTypes[profile];
        }

        getDiscountText(discount: TeeTimeDiscount, type?: string) {
            console.log("get discount text ", discount);
            console.log("get discount text ", this.getDiscountDetails(discount));
            
            if(!discount) return false;
            if(this.playerActiveClubDiscount && this.playerActiveClubDiscount.length === 0) return false;
            if(!this.playerActiveClubDiscount) return false;
            let _currency;
            let _discountDetails = this.getDiscountDetails(discount);
            if(!_discountDetails) return false;
            _currency = discount.club.address.countryData.currencySymbol;
            switch(type) {
                case 'amount':
                    if(discount.amountType.toLowerCase() === 'percentage')
                        return discount.discount+'% off';
                    else if(discount.amountType.toLowerCase() === 'absolute')
                        return _currency + ' ' + discount.discount
                    else if(discount.amountType.toLowerCase() === 'fixed')
                    return _currency + ' ' + discount.discount
                case 'appliesFor':
                    let _appliesFor = 'Applies for ';
                    if(_discountDetails && _discountDetails.priceComponents && _discountDetails.priceComponents.length > 0)
                        _appliesFor += _discountDetails.priceComponents
                        .map((a)=>{
                            return a.priceComponent.name
                        }).reduce((a,b)=>{
                            return a + ', ' + b;  
                        })
                    else _appliesFor = '';
                    console.log("applies to ", _appliesFor)
                    return 'Applies for '+  _appliesFor;
                case 'appliesTo':
                    let _appliesTo = 'Applies to ';
                    _appliesTo += _discountDetails.playerTypes
                    .map((a)=>{
                        return a.bookingPlayerType.name
                    }).reduce((a,b)=>{
                        return a + ', ' + b;  
                    })
                    console.log("applies to ", _appliesTo)
                    return 'Applies to ' + _appliesTo;
            }
        }

        getDiscountDetails(discount: TeeTimeDiscount) {
            console.log("get discount details ", discount);
            console.log("get discount details ", this.playerActiveClubDiscount);
            if(!discount) return false;
            let _discountDetails;
            if(this.playerActiveClubDiscount)
            _discountDetails = this.playerActiveClubDiscount.filter((td)=>{
                return td.id === discount.id
            }).map((td)=>{
                return td
            });
            console.log("get disc details ", _discountDetails)
            if(_discountDetails && _discountDetails.length > 0) return _discountDetails[0];
            else return null;
        }

        onUseThisDiscount(discount: TeeTimeDiscount) {
                let prompt = this.alertCtrl.create({
                    title: 'Use Discount',
                    message: 'This will apply discount to current booking flight. Do you want to proceed?',
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
                                this.goUseThisDiscount(discount);
                                prompt.dismiss()
                                return false;
                            }
                        }
                    ]
                });
                prompt.present();
        }

        // goUseThisDiscount(discount: TeeTimeDiscount) {
        //     let _discountUsed: boolean = false;
        //     if(this.discountUsed && this.discountUsed.length > 0) _discountUsed = true;
        //     let _discount = discount;
        //     // if(!_voucher.usableWithOtherRewards && this.voucherUsed) {
        //     //     MessageDisplayUtil.showMessageToast('This voucher cannot be used with any other voucher', 
        //     //     this.platform, this.toastCtl,3000, "bottom")
        //     //     return false;
        //     // }

        //     this.flightService.applyPlayerBookingDiscount(this.bookingId, _discount.id)
        //     .subscribe((data: any) => {
        //         if(data) {
        //             // this.voucherUsed.push(voucher);
        //             console.log("apply player booking discount : ", data)
        //             MessageDisplayUtil.showMessageToast('Successfully applied discount', this.platform, this.toastCtl,3000, "bottom")
        //             // this.getListClubPlayerVoucher();
        //             this.isVoucherApplied = true;
        //             console.log('applied discount', data)

        //         }
        //     }, (error)=>{
        //         let _error = error.json();
        //         console.log("error voucher : ", error);
        //         MessageDisplayUtil.showErrorToast(_error.errors[0], 
        //         this.platform, this.toastCtl,3000, "bottom")
        //         return false;
        //     })


        // }
        goUseThisDiscount(discount: TeeTimeDiscount) {
            let _discountUsed: boolean = false;
            if(this.discountUsed && this.discountUsed.length > 0) _discountUsed = true;
            let _discount = discount;
            // if(!_voucher.usableWithOtherRewards && this.voucherUsed) {
            //     MessageDisplayUtil.showMessageToast('This voucher cannot be used with any other voucher', 
            //     this.platform, this.toastCtl,3000, "bottom")
            //     return false;
            // }

            this.flightService.applyPlayerBookingDiscount(this.bookingId, _discount.id)
            .subscribe((data: any) => {
                if(data) {
                    // this.voucherUsed.push(voucher);
                    let _data = data.json();
                    console.log("apply player booking discount : ", data)
                    MessageDisplayUtil.showMessageToast('Successfully applied discount', this.platform, this.toastCtl,3000, "bottom")
                    // this.getListClubPlayerVoucher();
                    this.isVoucherApplied = true;
                    this.appliedBookingDiscounts = _data.bookingDiscounts;
                    if(this.appliedBookingDiscounts) this.getActiveClubDiscounts();
                    console.log('applied discount', data, _data)

                }
            }, (error)=>{
                let _error = error.json();
                console.log("error voucher : ", error);
                MessageDisplayUtil.showErrorToast(_error.errors[0], 
                this.platform, this.toastCtl,3000, "bottom")
                return false;
            })


        }

        setOptionType(type: number) {
            if(type===1) {
                this.option = 'discounts';
                this.getActiveClubDiscounts();
            } else if(type === 2) {
                this.option = 'vouchers';
                if(this.who === 'player' && this.forBooking && this.mode === 'apply') {
                    this.getListPlayerVoucher('single');
                } else {
                    // this.getListPlayerVoucher('multi');
                    this.getClubVoucherSeries();
                }
            }
        }

        // onRemoveThisDiscount(discount: TeeTimeDiscount ) {
        //     if(!discount) {
        //         MessageDisplayUtil.showMessageToast('Successfully removed discount', this.platform, this.toastCtl,3000, "bottom");
        //         return false;
        //     }
        //     this.flightService.removePlayerBookingDiscount(this.bookingId, discount.id)
        //     .subscribe((data: TeeTimeBooking) => {
        //         if(data) {
        //             console.log('remove discount', data)
        //             this.isVoucherApplied = true;
        //             // this.appliedBookingDiscounts.push(...data.bookingDiscounts)
        //             this.appliedBookingDiscounts = data.bookingDiscounts;
        //             if(this.appliedBookingDiscounts) {
        //             this.getActiveClubDiscounts();
        //             }
        //             // this.appliedBookingDiscounts.push(discount);
        //         }
        //     });
        // }
        onRemoveThisDiscount(discount: TeeTimeDiscount ) {
            if(!discount) {
                MessageDisplayUtil.showMessageToast('Successfully removed discount', this.platform, this.toastCtl,3000, "bottom");
                return false;
            }
            this.flightService.removePlayerBookingDiscount(this.bookingId, discount.id)
            .subscribe((data: any) => {
                if(data) {
                    console.log('remove discount', data)
                    let _data = data.json()
                    this.isVoucherApplied = true;
                    // this.appliedBookingDiscounts.push(...data.bookingDiscounts)
                    this.appliedBookingDiscounts = _data.bookingDiscounts;
                    if(this.appliedBookingDiscounts) {
                    this.getActiveClubDiscounts();
                    }
                    this.onSearchVoucherClick();
                    // this.appliedBookingDiscounts.push(discount);
                }
            });
        }

        onUseThisVoucherSeries(voucher: Array<any>) {
            // voucherSeries: TeeTimeClubVoucherSeries
            let prompt = this.alertCtrl.create({
                title: 'Use Voucher',
                message: 'This will apply voucher to current booking flight. Do you want to proceed? ',
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
                            this.goUseThisVoucherSeries(voucher);
                            prompt.dismiss()
                            return false;
                        }
                    }
                ]
            });
            prompt.present();
        }
    
        goUseThisVoucherSeries(voucher: Array<any>) {
            console.log("go use this voucher series ", voucher);
            console.log("go use this player voucher series ", this.playerVoucher);
            // voucherSeries: TeeTimeClubVoucherSeries
            if(!voucher) return false;
            let _voucherSeriesId = voucher[0].seriesId
            let _useVoucher;
            _useVoucher = this.playerVoucher.filter((pv)=>{
                return pv.seriesId === _voucherSeriesId 
                // voucherSeries.id
            }).sort((a,b)=>{
                if(a.id < b.id) return 1;
                else if(b.id < a.id) return -1;
                else return 0
            });
    
            if(voucher && voucher.length > 0) this.onUseThisVoucher(voucher[0]) ;
            // if(_useVoucher && _useVoucher.length > 0) this.onUseThisVoucher(_useVoucher[0]);
            else {
                MessageDisplayUtil.showMessageToast('Please try again', 
                this.platform, this.toastCtl, 3000, "bottom");
                return false;
            }
    
            
        }
        getClubVoucherSeries() {
            // this.clubVoucherSeries = [];
            this.playerVoucher = [];
            console.log("club id ", this.clubId, this.clubInfo)
            // listClubVoucherSeries
            let _clubId = this.clubId?this.clubId:this.clubInfo.id;
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
                        _voucher.forEach((v)=>{
                            this.getClubVouchersIssued(v);
                        })
                    }
                    
                    setTimeout(()=>{
                        this.playerVoucher = this.playerVoucher.filter((pv)=>{
                                let _hasVoucher;
                                _hasVoucher = this.appliedVouchers.find((v)=>{
                                    if(pv.seriesId === v.voucherApplied.seriesId && pv.playerAssigned.id === v.voucherApplied.playerAssigned.id)
                                    return true
                                    else return false
                                })
                                return !_hasVoucher

                            })
                        console.log("applied vouchers - player voucher series 2", this.playerVoucher)
                    }, 100)
                    console.log("applied vouchers - player voucher series 1", this.playerVoucher)
                }
                
            });
        }

        getClubVouchersIssued(voucher: TeeTimeClubVoucherSeries) {
            let _clubId = this.clubId?this.clubId:this.clubInfo.id;
            let _seriesId = voucher.id;
            let _issued = 999; //voucher.vouchersIssued;
            let _playersAssigned: Array<PlayerData> = new Array<PlayerData> ();
            this.flightService.getVouchersIssued(_clubId, _seriesId, null, false, false, _issued)
            .subscribe((data)=>{
                if(data) {
                    console.log("get club vouchers issued ", data)
                    let _data: Array<TeeTimeClubVoucher> = data.items;
                    this.players.forEach((p)=>{
                        let _playerVoucher;
                        _playerVoucher = _data.filter((v)=>{
                            if(v.playerAssigned) return v.playerAssigned.id === p.id
                        });
                        if(_playerVoucher && _playerVoucher.length > 0) this.playerVoucher.push(_playerVoucher);
                    })
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

        getVoucherDetails(voucherS, type?: string) {
            console.log("get voucher details - ", type, " : ", voucherS)
            // if(!voucherS) return false;
            // if(voucherS && voucherS.length === 0 && !voucherS.id) return false;
            let voucher = voucherS;
            switch(type) {
                case 'voucherName':
                    if(voucher && voucher.length > 0 && voucher[0].name)
                        return voucher[0].name;
                    else if(voucher && voucher.length === 0)
                        return voucher.name;
                case 'playerName':
                    if(voucher && voucher.length > 0 && voucher[0].playerAssigned.playerName)
                        return voucher[0].playerAssigned.playerName;
                    else if(voucher && voucher.length === 0)
                    return voucher.playerAssigned.playerName;
                case 'allowDays':
                    if(voucher && voucher.length > 0)
                        return this.getVoucherApplicableText(voucher[0], 'allowDays');
                    else if(voucher && voucher.length  === 0)
                        return this.getVoucherApplicableText(voucher, 'allowDays');
                case 'bookingAmount':
                    if(voucher && voucher.length > 0 && voucher[0].appliesToBookingAmount)
                        return 'Applies to Booking Amount'
                    else if(voucher && voucher.length === 0)
                        return 'Applies to Booking Amount'
                    else return false;
                case 'flight':
                    if(voucher && voucher.length > 0 && voucher[0].appliesToFlight)
                        return 'Applies to this flight';
                    else if(voucher && voucher.length === 0)
                        return 'Applies to this flight';
                    else return false;
                case 'expiry':
                    if(voucher && voucher.length > 0 && voucher[0]) return this.getExpiryDate(voucher);
                    else if(voucher && voucher.length === 0) return this.getExpiryDate(voucher[0])
                case 'validRange':
                    if(voucher && voucher.length > 0 && voucher[0]) return 'Valid from '+this.getDateText(voucher[0].validFrom)+' till '+this.getDateText(voucher[0].validUntil)
                    else if(voucher && voucher.length === 0) return 'Valid from '+this.getDateText(voucher.validFrom)+' till '+this.getDateText(voucher.validUntil)
                case 'voucherAmount':
                    let _currency = this.clubInfo.address.countryData.currencySymbol;
                    if(voucher && voucher.length > 0 && voucher[0]) return this.getVoucherAmountDetails(voucher[0]);
                    else if(voucher && voucher.length === 0) return this.getVoucherAmountDetails(voucher);
                case 'image':
                    // let _image = this.clubInfo.address.countryData.currencySymbol;
                    if(voucher && voucher.length > 0 && voucher[0]) return voucher[0].voucherImage;
                    else if(voucher && voucher.length === 0) return voucher.voucherImage;

            }
        }

        getAppliedDiscounts() {
            let _appliedDiscounts: Array<TeeTimeBookingDiscount> = new Array<TeeTimeBookingDiscount>();
            _appliedDiscounts = this.appliedBookingDiscounts;
            _appliedDiscounts = _appliedDiscounts.filter((d)=>{
                return d.discountApplied && d.amountDeducted > 0
            })
            return _appliedDiscounts;
        }

        getVoucherAmount(voucherSeries: Array<TeeTimeClubVoucher>, type: string) {
        let _totalVouchers;
        let _voucherCount;
        console.log("get voucher amount - player voucher", this.playerVoucher);
        console.log("get voucher amount - voucher series", voucherSeries);
        // _voucherCount = this.playerVoucher.filter((playerVoucher)=>{
        //     return playerVoucher.seriesId === voucherSeries.seriesId
        // })
        
        console.log("get voucher amount - voucher count", _voucherCount);
        _totalVouchers = voucherSeries.length; //voucherSeries.totalVouchers;
        switch(type) {
            // case 'assigned':
            //     return voucherSeries.vouchersIssued;
            // case 'remaining':
            //     return _totalVouchers - voucher.vouchersIssued;
            case 'voucher':
                // return _voucherCount?_voucherCount.length:0;
                return _totalVouchers;
        }
    }

    
    onImageClick(imageUrl: string) {
        let image = this.modalCtrl.create(ImageZoom, {
            image: imageUrl,
        });

        image.present();
    }
}
