import { TeeTimeSlot, TeeTimeSlotDisplay, ClubCourseData, CurrencyData, TeeTimeBookingPlayer, TeeTimeBookingDiscount,
ItemizedBill, 
CancelBookingSpecification, BookingRefund, RefundMode, PaymentMethod, RefundInstance} from './../../../data/mygolf.data';
import {Component, HostListener} from "@angular/core";
import {ViewController, NavParams, ToastController, Platform} from "ionic-angular";
import { CourseInfo, CourseHoleInfo } from "../../../data/club-course";
import { ClubFlightService } from "../../../providers/club-flight-service/club-flight-service";
import { TeeTimeBooking } from "../../../data/mygolf.data";


import * as moment from "moment";
import { MessageDisplayUtil } from '../../../message-display-utils';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
/**
 * Created by ashok on 19/12/16.
 */
@Component({
    templateUrl: 'refund-booking-players.html',
    selector: 'refund-booking-players-page'
})
export class RefundBookingPlayersModal
{

    appFooterHide: boolean = true;
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
    currency: CurrencyData
    refundPlayers: Array < any > = [false, false, false, false, false, false];
    refundAmountPlayers: Array < any > = [0, 0, 0, 0, 0, 0];
    amountRefundable: number;
    clubPaymentMethod: string = '';//'cash';
    clubOverride: boolean = false;
    cancelBooking: boolean = false;

    
    refundPlayersReason: Array<string> = new Array<string> ();
    refundPlayersReasonOn: Array<boolean> = new Array<boolean> ();

    displayRefundHistory: boolean = false;
    displayAdjustmentHistory: boolean = false;
    fromClub: boolean = false;

    waiveMode: boolean = false;
    optionTypes: string = 'refund';
    refundMode: boolean = true;
    waiveOffAmount: number = 0;
    waiveOffReason: string = '';

    bookingDiscounts: Array<any> = new Array<any>();

    adjustableAmount: number = 0;

    cancelReason: string = '';

    assignmentDone: boolean = false;
    bookingItemBill: ItemizedBill;
    refresherBill: boolean = false;
    closeCancelReason: boolean = true;
    mode: string;

    paymentMethodList: Array<PaymentMethod>;

    appAttribute; any;
    includeTaxes: boolean = true;

    constructor(private viewCtrl: ViewController,
        private flightService: ClubFlightService,
        private navParams: NavParams,
        private toastCtl: ToastController,
        private platform: Platform,
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController) {
        this.courses = navParams.get("courses");
        this.clubId = navParams.get("clubId");
        this.forDate = navParams.get("forDate");
        this.courseId = navParams.get("courseId");
        this.changeType = navParams.get("changeType");
        this.currentSlot = navParams.get("currentSlot")
        this.currency = navParams.get("currency");
        this.fromClub = navParams.get("fromClub");
        if(this.changeType && this.changeType ==='slot') this.isClub = false;
        else if(this.changeType && this.changeType === 'course') this.isClub = true;
        if(navParams.get("type")) this.optionTypes = navParams.get("type");
        this.mode = navParams.get("mode");
        if(this.mode==='cancel') {
            this.cancelBooking = true;
            this.closeCancelReason = false;
        }
        // if(this.currentSlot) this.amountRefundable = this.currentSlot.amountPaid * 0.5;
        if(this.currentSlot) this.currentSlot.bookingPlayers.forEach((t: TeeTimeBookingPlayer, idx: number)=>{
                this.refundPlayersReasonOn[idx] = false;
                this.refundPlayersReason[idx] = '';
        });
        
        this.bookingDiscounts = JSON.parse(JSON.stringify(this.currentSlot.bookingDiscounts));
        // this.bookingDiscounts.push(...this.currentSlot.bookingDiscounts);
        let _totalWaive = 0;
        if(this.bookingDiscounts.length > 0)
        this.bookingDiscounts.forEach((bd)=>{
            bd.toggleDetails = false;
            if(bd.adhocWaiver)
                _totalWaive += bd.amountDeducted;
        });
        if(this.currentSlot) {
            // this.adjustableAmount = this.bookingItemBill.totalCharges - _totalWaive;
    
            this.assignmentDone = this.currentSlot.assignmentDone;
            // this.getBookingItemizedBill(this.assignmentDone);

        }

    }

    innerWidth: any;
    ngOnInit() {
        this.innerWidth = window.innerWidth;
    }
    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.innerWidth = window.innerWidth;
    }
    ionViewDidLoad() {
        if(this.currentSlot) this.getBookingItemizedBill();
        this.refreshPaymentMethod();
        this.getAppAttribute();
        // if(this.currentSlot) this.getBookingPlayers();
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
                    case 'date':
                        let _date = moment(this.currentSlot.slotAssigned.teeOffDate,'YYYY-MM-DD').format('ddd, DD MMM YYYY');
                        return _date;
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

        getNewPlayerSlotDetails(bookingPlayers: any, slot: number, attribute) {
            let _currentPlayer = bookingPlayers;
            let idx = slot - 1;
            let _id;

            if (_currentPlayer)
            _id = "(#" + _currentPlayer.id + ")";
           else "";
           // _id = (_currentPlayer[idx].player && _currentPlayer[idx].player.id?"(#"+_currentPlayer[idx].player.id+")":"");
            switch (attribute) {
                case 'name':
                    return _currentPlayer.playerName; //player.playerName;
                case 'id':
                    return _id;
                case 'image':
                    if(_currentPlayer && !_currentPlayer.player) return '';
                    else return (_currentPlayer && _currentPlayer.image ? _currentPlayer.image : _currentPlayer.profile?_currentPlayer.profile:'');
            }
        }

        getPlayerSlotDetails(slot: number, attribute: string) {
            // player: TeeTimeBookingPlayer, 
            let _currentPlayer = this.currentSlot.bookingPlayers;
    
            // this.bookingSlot.bookingPlayers.filter((p: TeeTimeBookingPlayer) => {
            //     return p.sequence === slot
            // })
            let idx = slot - 1;
    
            // if(!_currentPlayer[idx].player || _currentPlayer[idx].player === null) return "";
            // console.log("player slot details - ", "[",idx,"]",_currentPlayer[idx])
    
            let _id;
    
            // console.log("player slot details - ", "[",idx,"]",_currentPlayer[idx], "you ? : ", _isMe)
            if (_currentPlayer[idx] && _currentPlayer[idx].player)
                _id = "(#" + _currentPlayer[idx].player.id + ")";
            else "";
            // _id = (_currentPlayer[idx].player && _currentPlayer[idx].player.id?"(#"+_currentPlayer[idx].player.id+")":"");
                switch (attribute) {
                    case 'name':
                        return _currentPlayer[idx].playerName; //player.playerName;
                    case 'id':
                        return _id;
                    case 'image':
                        if(_currentPlayer[idx] && !_currentPlayer[idx].player) return '';
                        else return (_currentPlayer[idx].player && _currentPlayer[idx].player.image ? _currentPlayer[idx].player.image : _currentPlayer[idx].player.profile?_currentPlayer[idx].player.profile:'');
                    case 'isContactComplete':
                        // console.log("is contact complete? : ",_currentPlayer[idx])
                        let _newPlayer = (_currentPlayer[idx].player) ? false : true;
                        if (_newPlayer) return _currentPlayer[idx].playerContact && _currentPlayer[idx].playerContact.length > 0
                        else {
                            let _currPlAddress = _currentPlayer[idx].player.address;
                            if (_currPlAddress.address1 &&
                                _currPlAddress.state &&
                                _currPlAddress.city &&
                                _currPlAddress.postCode &&
                                _currPlAddress.phone1) return true
                            else return false;
                        }
                        case 'discount':
                            return '<span style="color:red">No promotion</span>'
                }
            
    
        }

        onRefundToPlayer(event, player: TeeTimeBookingPlayer, i: number) {
            let _totalAmount = 0;
            // console.log("on refund to player : ", event, " - ", player);
            _totalAmount = this.refundAmountPlayers.reduce((a,b)=>{
                console.log("iterating : ", a,b)
                // if(a) _totalAmount += a
                return a + b;
            })
            if(this.refundPlayers[i] === true) {
                setTimeout(()=>{
                    let _refund;
                    _refund = Number((this.amountRefundable - _totalAmount).toFixed(2));
                    this.refundAmountPlayers[i] = _refund > 0? _refund:0;
                }, 0)
            }
            console.log("on refund to player : ", this.amountRefundable, " - ", _totalAmount);
            console.log("refund total players : ", this.refundAmountPlayers);
            if(this.refundPlayers[i] === false) {
                this.refundPlayersReasonOn[i] = false;
                this.refundPlayersReason[i] = '';
                this.refundAmountPlayers[i] = 0;
            }
        }

        getTotalRefundAmount() {
            if(this.refundAmountPlayers.length === 0) return false;
            let _total = this.refundAmountPlayers.reduce((a,b)=>{
                return a + b
            });
            return _total;
        }

        onApplyRefundClick() {
            if(this.cancelBooking) {
                if(this.currentSlot.totalRefund.toFixed(2) === this.currentSlot.amountPaid.toFixed(2)) {
                    let _cancelBookingSpec: CancelBookingSpecification = {};
                    _cancelBookingSpec.bookingId = this.currentSlot.id;
                    _cancelBookingSpec.refundAmount = null;
                    _cancelBookingSpec.refundSplits = [];
                    _cancelBookingSpec.reason = this.cancelReason;
                    let alert = this.alertCtrl.create({
                        title: 'Booking Cancellation',
                        // subTitle: 'Selected date is '+ _date,
                        message: 'Are you sure you want to cancel this booking?', //'Selected date is ' + '<b>' + _date + '</b>',
                        buttons: [ {
                            text: 'No',
                            role: 'cancel'
                        },
                        {
                            text: 'Yes',
                            handler: () => {
                                this.goApplyRefundAndCancel(_cancelBookingSpec);
                            }
                        },]
                    });
                    alert.present();
                    
                    // this.onCancelThisBooking();
                }
                else this.onApplyRefundAndCancel();
            } else {
                this.onApplyRefund();
            }
        }

        onApplyRefundAndCancel() {
            let _totalAmount = 0;
            _totalAmount = this.refundAmountPlayers.reduce((a,b)=>{
                console.log("iterating : ", a,b)
                return a + b;
            });
            if(!this.clubPaymentMethod || this.clubPaymentMethod && this.clubPaymentMethod.length === 0) {
                MessageDisplayUtil.showMessageToast('Please select a refund method to proceed.', 
                this.platform , this.toastCtl, 5000, "bottom");
                return false;
            }
            if(this.getRefundableAmount() < 0) {
                MessageDisplayUtil.showMessageToast('There is no refundable amount available', 
                this.platform , this.toastCtl, 5000, "bottom");
                return false;
            }
            if(this.currentSlot.amountPaid < this.getRefundableAmount()) {
                MessageDisplayUtil.showMessageToast('Amount paid is less than refundable amount', 
                this.platform , this.toastCtl, 5000, "bottom");
                return false;
            }
            if(_totalAmount === 0) {
                MessageDisplayUtil.showMessageToast('Please select a player and enter refund amount', 
                this.platform , this.toastCtl, 5000, "bottom");
                return false;
            }
            else if(!this.clubOverride && this.getRefundableAmount() < _totalAmount) {
                // this.amountRefundable
                MessageDisplayUtil.showMessageToast('Total refund amount is more than refundable amount', 
                this.platform , this.toastCtl, 5000, "bottom");
                return false;
            }

            let _players: Array<TeeTimeBookingPlayer> = new Array<TeeTimeBookingPlayer> ();
            _players.push(...this.currentSlot.bookingPlayers);

            let _noReason: boolean = false;

            _players.forEach((t: TeeTimeBookingPlayer, idx: number)=>{
                if(this.refundPlayers[idx]) {
                    if(!this.refundPlayersReason[idx] || this.refundPlayersReason[idx].length === 0) {
                        MessageDisplayUtil.showMessageToast('Please enter a reason to refund for '+t.playerName, 
                        this.platform , this.toastCtl, 5000, "bottom");
                        _noReason = true;
                        return false;
                    } 
                }
            })
            if(_noReason) return false;

            let _bookingId = this.currentSlot.id;
            let _cancelBookingSpec: CancelBookingSpecification = {}
            let _playerRefund = this.currentSlot.bookingPlayers.filter((bp, bpIdx)=>{
                let _refundPlayers = this.refundPlayers.filter((rp, rpIdx)=>{
                    if(rp && rpIdx === bpIdx)
                        return true
                    else return false
                })
                return _refundPlayers && _refundPlayers.length > 0
            }).map((bp)=> {
                return bp.player
            });
            let _date = moment().toDate();

            let _refundMode: RefundMode = 'Unknown'
            if(this.clubPaymentMethod === 'cash') _refundMode = 'Cash';
            else if(this.clubPaymentMethod === 'btrf') _refundMode = 'BankTransfer';
            else if(this.clubPaymentMethod === 'clbc') _refundMode = 'ClubCredit';
            else if(this.clubPaymentMethod === 'm2uc') _refundMode = 'M2UCredit';
            
            let _refundText;
            switch(this.clubPaymentMethod) {
                case 'cash':
                    _refundText = 'Cash';
                    break;
                case 'clbc':
                    _refundText = 'myGolf2u Club Credit';
                    break;
                case 'btrf':
                    _refundText = 'Bank Transfer';
                    break;
                case 'm2uc':
                    _refundText = 'myGolf2u Credit';
                    break;
            }

            let _playerRefunded: Array<BookingRefund> = new Array<BookingRefund>();
            _playerRefund.forEach((pr,idx)=>{
                _playerRefunded[idx] = {
                    playerRefunded: pr,
                    refundAmount: this.refundAmountPlayers[idx],
                    refundDate: _date,
                    refundMode: _refundMode,
                    description: this.refundPlayersReason[idx],

                }
            })




            _cancelBookingSpec.bookingId = _bookingId;
            _cancelBookingSpec.refundAmount = _totalAmount;
            _cancelBookingSpec.refundSplits = _playerRefunded;
            _cancelBookingSpec.reason = this.cancelReason;

            let alert = this.alertCtrl.create({
                title: 'Refund Booking',
                // subTitle: 'Selected date is '+ _date,
                message: 'Total refund amount is '+ this.currency.symbol + ' ' + this.numberWithCommas(_totalAmount) +' via '+_refundText+". Do you want to proceed?", //'Selected date is ' + '<b>' + _date + '</b>',
                buttons: [ {
                    text: 'No',
                    role: 'cancel'
                },{
                    text: 'Yes',
                    handler: () => {
                        this.goApplyRefundAndCancel(_cancelBookingSpec);
                    }
                },]
            });
            alert.present();
            
            console.log("On apply refund and cancel - ", this.refundPlayers);
            console.log("On apply refund and cancel - ", _totalAmount, _playerRefund, _cancelBookingSpec);
        }

        goApplyRefundAndCancel(cancelBookingSpec) {
            let _cancelBookingSpec = cancelBookingSpec
            this.flightService.cancelBookingByClub(_cancelBookingSpec)
            .subscribe((data)=>{
                if(data) {
                    console.log("data");
                    // if(data) {
                    //     this.bookingDiscounts = [];
                    //     let _data = data.json();
                    //     // if(_data) this.currentSlot = _data;
                    //     if(_data) {
                    //         this.currentSlot = _data;
                    //         this.bookingDiscounts = [];
                    //         // this.bookingDiscounts.push(..._data.bookingDiscounts);
                    //         this.bookingDiscounts = JSON.parse(JSON.stringify(_data.bookingDiscounts));
                    //         let _totalWaive;
                    //         if(this.bookingDiscounts.length > 0)
                    //         this.bookingDiscounts.forEach((bd)=>{
                    //             bd.toggleDetails = false;
                    //             _totalWaive += bd.amountDeducted;
                    //         })
                    //         // this.adjustableAmount = this.bookingItemBill.totalCharges - _totalWaive;
    
                    //     }
                    // }
                    // this.getBookingItemizedBill();
                    this.viewCtrl.dismiss({
                        needRefresh: true,
                        fromClub: this.fromClub
                    });
                }
            })
        }

        onApplyRefund() {
            let _totalAmount = 0;
            _totalAmount = this.refundAmountPlayers.reduce((a,b)=>{
                console.log("iterating : ", a,b)
                return a + b;
            });
            console.log('amount refundable ', this.amountRefundable, _totalAmount)
            
            if(!this.clubPaymentMethod || this.clubPaymentMethod && this.clubPaymentMethod.length === 0) {
                MessageDisplayUtil.showMessageToast('Please select a club payment method to proceed.', 
                this.platform , this.toastCtl, 5000, "bottom");
                return false;
            }
            if(this.getRefundableAmount() < 0) {
                MessageDisplayUtil.showMessageToast('There is no refundable amount available', 
                this.platform , this.toastCtl, 5000, "bottom");
                return false;
            }
            if(this.currentSlot.amountPaid < this.getRefundableAmount()) {
                MessageDisplayUtil.showMessageToast('Amount paid is less than refundable amount', 
                this.platform , this.toastCtl, 5000, "bottom");
                return false;
            }
            // if(this.getRefundableAmount() <= 0) {
            //     MessageDisplayUtil.showMessageToast('There is no refundable amount for this booking', 
            //     this.platform , this.toastCtl, 5000, "bottom");
            //     return false;
            // }
            if(_totalAmount === 0) {
                MessageDisplayUtil.showMessageToast('Please select a player and enter refund amount', 
                this.platform , this.toastCtl, 5000, "bottom");
                return false;
            }
            else if(this.getRefundableAmount() < _totalAmount) {
                // !this.clubOverride && 
                // this.amountRefundable
                MessageDisplayUtil.showMessageToast('Total refund amount is more than refundable amount', 
                this.platform , this.toastCtl, 5000, "bottom");
                return false;
            }


            let _bookingId = this.currentSlot.id;
            let _refundMode = this.clubPaymentMethod;
            let _refundText;
            switch(_refundMode) {
                case 'cash':
                    _refundText = 'Cash';
                    break;
                case 'clbc':
                    _refundText = 'myGolf2u Club Credit';
                    break;
                case 'btrf':
                    _refundText = 'Bank Transfer';
                    break;
                case 'm2uc':
                    _refundText = 'myGolf2u Credit';
                    break;
            }
            let _players: Array<TeeTimeBookingPlayer> = new Array<TeeTimeBookingPlayer> ();
            _players.push(...this.currentSlot.bookingPlayers);

            let _noReason: boolean = false;

            _players.forEach((t: TeeTimeBookingPlayer, idx: number)=>{
                if(this.refundPlayers[idx]) {
                    if(!this.refundPlayersReason[idx] || this.refundPlayersReason[idx].length === 0) {
                        MessageDisplayUtil.showMessageToast('Please enter a reason to refund for '+t.playerName, 
                        this.platform , this.toastCtl, 5000, "bottom");
                        _noReason = true;
                        return false;
                    } 
                }
            })
            if(_noReason) return false;

            let alert = this.alertCtrl.create({
                title: 'Refund Booking',
                // subTitle: 'Selected date is '+ _date,
                message: 'Total refund amount is '+ this.currency.symbol + ' ' +_totalAmount+' via '+_refundText+". Do you want to proceed?", //'Selected date is ' + '<b>' + _date + '</b>',
                buttons: [ {
                    text: 'No',
                    role: 'cancel'
                },{
                    text: 'Yes',
                    handler: () => {
                        this.goApplyRefund();
                    }
                },]
            });
            alert.present();

            // this.currentSlot.bookingPlayers.forEach((t: TeeTimeBookingPlayer, idx: number)=>{
            //     if(this.refundPlayers[idx]) {
            //         this.flightService.setRefundBookingPlayer(_bookingId, _players[idx].player.id, 
            //             this.refundAmountPlayers[idx], this.refundPlayersReason[idx], _refundMode)
            //             .subscribe((data: any)=>{
            //                 console.log("done refund booking players : ", data);
            //             })
            //     }
            // })
        }

        goApplyRefund() {
            let _bookingId = this.currentSlot.id;
            let _refundMode = this.clubPaymentMethod;
            let _players: Array<TeeTimeBookingPlayer> = new Array<TeeTimeBookingPlayer> ();
            _players.push(...this.getBookingPlayers());

            let _reason = this.cancelReason;

            _players.forEach((t: any, idx: number)=>{
                if(this.refundPlayers[idx]) {
                    this.flightService.setRefundBookingPlayer(_bookingId, _players[idx].id, 
                        this.refundAmountPlayers[idx], this.refundPlayersReason[idx], _refundMode.toUpperCase())
                        .subscribe((data: any)=>{
                            console.log("done refund booking players : ", data);
                            this.viewCtrl.dismiss({
                                needRefresh: true,
                                fromClub: this.fromClub
                            });
                        }, (error)=>{
                            let _error = error.json();
                            console.log("error ", error);
                            let _msg;
                            // if(_error && _error.errors.length > 0 ) _msg = _error.errors[0];
                            if(_error && _error.error) _msg = _error.error;
                            else _msg = "Something is wrong, please try again."
                            
                            MessageDisplayUtil.showMessageToast(_msg, 
                            this.platform , this.toastCtl, 5000, "bottom");
                            return false;
                        }, ()=>{
                            // this.flightService.cancelBooking(_bookingId, true, _reason)
                        })
                }
            })


            // this.currentSlot.bookingPlayers.forEach((t: TeeTimeBookingPlayer, idx: number)=>{
            //     if(this.refundPlayers[idx]) {
            //         this.flightService.setRefundBookingPlayer(_bookingId, _players[idx].player.id, 
            //             this.refundAmountPlayers[idx], this.refundPlayersReason[idx], _refundMode.toUpperCase())
            //             .subscribe((data: any)=>{
            //                 console.log("done refund booking players : ", data);
            //                 this.viewCtrl.dismiss({
            //                     needRefresh: true,
            //                     fromClub: this.fromClub
            //                 });
            //             }, (error)=>{
            //                 let _error = error.json();
            //                 console.log("error ", error);
            //                 let _msg;
            //                 if(_error && _error.errors.length > 0 ) _msg = _error.errors[0];
            //                 else _msg = "Something is wrong, please try again."
                            
            //                 MessageDisplayUtil.showMessageToast(_msg, 
            //                 this.platform , this.toastCtl, 5000, "bottom");
            //                 return false;
            //             }, ()=>{
            //                 // this.flightService.cancelBooking(_bookingId, true, _reason)
            //             })
            //     }
            // })
        }

        getRefundableAmount() {
            let _amountPayable = this.currentSlot.amountPayable;
            let _amountDeduction = this.currentSlot.totalDeductions;
            let _amountPaid = this.currentSlot.amountPaid;
            let _amountRefund = this.currentSlot.totalRefund;
            // this.amountRefundable = _amountPayable + _amountRefund - (_amountPaid + _amountDeduction);
            this.amountRefundable = (_amountPayable + _amountRefund - (_amountPaid + _amountDeduction));
            this.amountRefundable = -1*this.amountRefundable;
            console.log("refundable amount ", Number(this.amountRefundable.toFixed(2)), this.amountRefundable, _amountPayable,
            _amountDeduction,
            _amountPaid,
            _amountRefund)
            if(this.amountRefundable < 0) this.amountRefundable = 0;
            if(this.clubOverride)
                return Number((_amountPaid - _amountRefund).toFixed(2));
            else return Number(this.amountRefundable.toFixed(2));
        }

        toggleRefundHistory() {
            this.displayRefundHistory = !this.displayRefundHistory;
            console.log("refund - currentSlot : ", this.currentSlot)
        }
        toggleAdjustmentHistory() {
            this.displayAdjustmentHistory = !this.displayAdjustmentHistory;
            console.log("waive off - currentSlot : ", this.currentSlot)
        }

        toggleWaiveMode() {
            this.waiveMode = this.clubOverride;
        }


        onApplyWaiveOffClick() {
            let _bookingId = this.currentSlot.id;
            let _amount = this.waiveOffAmount;
            let _reason = this.waiveOffReason;
            let _balance = this.getWaiveOffBalance() + _amount;
            let _chargeable;
            // if(this.includeTaxes) {
            //     if(this.includeTaxes) _chargeable = this.bookingItemBill.totalCharges + this.bookingItemBill.taxes;
            //     //this.bookingItemBill.totalPayable;
            //     else if(!this.includeTaxes) _chargeable = this.bookingItemBill.totalCharges;
            // }
            if(!_amount || _amount === 0) { 
                MessageDisplayUtil.showMessageToast('Please enter valid waive-off amount', 
                this.platform , this.toastCtl, 5000, "bottom");
                return;
            } else if( _amount > this.currentSlot.amountPaid) {                
                // !this.clubOverride &&
                MessageDisplayUtil.showMessageToast('Waive-off amount is more than amount paid', 
                this.platform , this.toastCtl, 5000, "bottom");
                return;
            } else if(_amount > _balance) {                
                MessageDisplayUtil.showMessageToast('Waive-off amount is more than balance amount left ', 
                this.platform , this.toastCtl, 5000, "bottom");
                return;
            } else if(!_reason || _reason.length === 0) {              
                MessageDisplayUtil.showMessageToast('Please enter a reason to waive-off', 
                this.platform , this.toastCtl, 5000, "bottom");
                return;
            }
            
            let alert = this.alertCtrl.create({
                title: 'Booking Adjustment',
                // subTitle: 'Selected date is '+ _date,
                message: 'Total adjustment amount is '+ this.currency.symbol + ' ' + this.numberWithCommas(_amount)+ ". Do you want to proceed?", //'Selected date is ' + '<b>' + _date + '</b>',
                buttons: [ {
                    text: 'No',
                    role: 'cancel'
                },{
                    text: 'Yes',
                    handler: () => {
                        this.onApplyWaiveOff();
                    }
                },]
            });
            alert.present();
        }

        numberWithCommas(x) {
            if(!x) return x;
            else return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        applyBookingWaiveOff() {

        }

        getDisabledMode(type?: string) {

        }

        setOptionType(type?: number) {
            switch(type) {
                case 1:
                    this.refundMode = true;
                    this.waiveMode = false;
                    this.clubOverride = false;
                    break;
                case 2:
                    this.refundMode = false;
                    this.waiveMode = true;
                    this.clubOverride = true;
                    this.getBookingItemizedBill();
                    break;
            }
        }

        onApplyWaiveOff() {

            let _bookingId = this.currentSlot.id;
            let _amount = this.waiveOffAmount;
            let _reason = this.waiveOffReason;
            // let _balance = this.getWaiveOffBalance() + _amount;
            // if(!_amount || _amount === 0) { 
            //     MessageDisplayUtil.showMessageToast('Please enter valid waive-off amount', 
            //     this.platform , this.toastCtl, 5000, "bottom");
            //     return;
            // } else if(_amount > this.currentSlot.amountPaid) {                
            //     MessageDisplayUtil.showMessageToast('Waive-off amount is more than amount paid', 
            //     this.platform , this.toastCtl, 5000, "bottom");
            //     return;
            // } else if(_amount > _balance) {                
            //     MessageDisplayUtil.showMessageToast('Waive-off amount is more than balance amount left ', 
            //     this.platform , this.toastCtl, 5000, "bottom");
            //     return;
            // } else if(!_reason || _reason.length === 0) {              
            //     MessageDisplayUtil.showMessageToast('Please enter a reason to waive-off', 
            //     this.platform , this.toastCtl, 5000, "bottom");
            //     return;
            // } else {
                this.flightService.bookingWaiveOff(_bookingId, _amount, _reason)
                .subscribe((data)=>{
                    if(data) {
                        let _data = data.json();
                        console.log("waive off success", data)
                        // if(_data) this.currentSlot = _data;
                        if(_data) {
                            this.bookingDiscounts = [];
                            this.currentSlot = _data;
                            // this.bookingDiscounts.push(..._data.bookingDiscounts);
                            this.bookingDiscounts = JSON.parse(JSON.stringify(_data.bookingDiscounts));
                            
                            let _totalWaive;
                            if(this.bookingDiscounts.length > 0)
                            this.bookingDiscounts.forEach((bd)=>{
                                bd.toggleDetails = false;
                                _totalWaive += bd.amountDeducted;
                            })
                            
                        this.getBookingItemizedBill(); 
                        //    this.adjustableAmount = this.bookingItemBill.totalCharges - _totalWaive;
                        }
                    }
                }, (error)=>{

                }, ()=>{
                    this.waiveOffAmount = 0;
                    this.waiveOffReason = '';        
                    MessageDisplayUtil.showMessageToast('Successfully made adjustment', 
                    this.platform , this.toastCtl, 5000, "bottom");
                    return;
                })
            // }
        }

        getWaiveOffItems() {
            let _waiveOffItems = [];
            // this.bookingDiscounts.push(...this.currentSlot.bookingDiscounts);
            _waiveOffItems = this.bookingDiscounts.filter((bd)=>{
                return bd.adhocWaiver
            }).sort((a,b)=>{
                if(a.sequence > b.sequence) return -1;
                else if(a.sequence < b.sequence) return 1;
                else return 0;
            });
            // _waiveOffItems.forEach((w)=>{
            //     w.toggleDetails = false;
            // })
            return _waiveOffItems;
        }

        getWaiveOffBalance() {
            let _totalWaive = 0;
            let _totalCharges = 0;
            if(this.bookingItemBill) {
                if(this.includeTaxes) _totalCharges = this.bookingItemBill.totalCharges + this.bookingItemBill.taxes;
                else _totalCharges = this.bookingItemBill.totalCharges;
            }
            if(!this.adjustableAmount) {
                if(this.bookingDiscounts.length > 0)
                this.bookingDiscounts.forEach((bd)=>{
                    if(bd.adhocWaiver)
                    _totalWaive += bd.amountDeducted;
                })
               this.adjustableAmount = _totalCharges - _totalWaive;
            }
            let _total = this.adjustableAmount - this.waiveOffAmount;
            return _total; 
            // this.currentSlot.amountPaid - this.waiveOffAmount;
        }

        onUndoWaiveOffClick(item: TeeTimeBookingDiscount) {
            if(!item.adhocWaiver) return;
            let _totalAmount = item.amountDeducted;
            let alert = this.alertCtrl.create({
                title: 'Undo Adjustment',
                // subTitle: 'Selected date is '+ _date,
                message: 'Total undo amount is '+ this.currency.symbol + ' ' +_totalAmount+ ". Do you want to proceed?", //'Selected date is ' + '<b>' + _date + '</b>',
                buttons: [ {
                    text: 'No',
                    role: 'cancel'
                },{
                    text: 'Yes',
                    handler: () => {
                        this.undoBookingWaiveOff(item)
                    }
                },]
            });
            alert.present();
        }

        undoBookingWaiveOff(item: TeeTimeBookingDiscount) {
            this.bookingDiscounts = [];
            let _item = item;
            let _bookingId = this.currentSlot.id;
            this.flightService.undoBookingWaiveOff(_bookingId, _item.sequence)
            .subscribe((data)=>{
                if(data) {
                    this.bookingDiscounts = [];
                    let _data = data.json();
                    // if(_data) this.currentSlot = _data;
                    if(_data) {
                        this.currentSlot = _data;
                        this.bookingDiscounts = [];
                        // this.bookingDiscounts.push(..._data.bookingDiscounts);
                        this.bookingDiscounts = JSON.parse(JSON.stringify(_data.bookingDiscounts));
                        let _totalWaive;
                        if(this.bookingDiscounts.length > 0)
                        this.bookingDiscounts.forEach((bd)=>{
                            bd.toggleDetails = false;
                            _totalWaive += bd.amountDeducted;
                        })
                        // this.adjustableAmount = this.bookingItemBill.totalCharges - _totalWaive;

                    }
                }
            }, (error)=>{

            }, ()=>{
                this.getBookingItemizedBill();
            })
        }

        onToggleWaiveDetail(item) {
            this.bookingDiscounts.forEach((bd)=>{
                if(item !== bd) bd.toggleDetails = false;
            })
            item.toggleDetails = !item.toggleDetails;
        }

        getBookingItemizedBill(afterAssignment ? : boolean) {
            this.refresherBill = true;
            let _bookingId = this.currentSlot.id;
            let _afterAssignment = this.assignmentDone;
            let loader = this.loadingCtrl.create({
                showBackdrop: false,
                duration: 5000,
                content: 'Refreshing bill...'
            });
            let _bookingItemBill;
    
            loader.present().then(() => {
                this.flightService.getBookingItemizedBill(_bookingId, _afterAssignment)
                    .subscribe((data: Response) => {
                        this.bookingItemBill = {};
                        loader.dismiss().then(() => {
                            this.refresherBill = false;
                            let _totalWaive = 0;
                            if (data && data.status === 200) {
                                _bookingItemBill = data.json();
                                this.bookingItemBill = _bookingItemBill;
                                this.bookingItemBill.payments.sort((a,b)=>{
                                    if(a.datePaid < b.datePaid)
                                        return 1
                                    else if(a.datePaid > b.datePaid)
                                        return -1
                                    else return 0
                                })
                                console.log("data", data.json());
                                console.log("data 2", data)
                                console.log("data", _bookingItemBill)
                                if(this.bookingDiscounts.length > 0)
                                _totalWaive = this.bookingDiscounts.map((bd)=>{
                                    if(bd.adhocWaiver) return bd.amountDeducted
                                }).reduce((a,b)=>{
                                    return a+b
                                })
                                if(this.includeTaxes) {
                                    this.adjustableAmount = (this.bookingItemBill.totalCharges + this.bookingItemBill.taxes) - _totalWaive;
                                } else this.adjustableAmount = this.bookingItemBill.totalCharges - _totalWaive;
                            }
                        })
    
                    }, (error) => {
                        this.refresherBill = false;
                        this.bookingItemBill = {};
                    }, () =>{
                        // if(this.grpPayment) this.getPaymentGateway(this.bookingSlot.clubData.address.countryData.id);
                    })
            })
        }

        getRefundBalance() {
            let _totalAmount = 0;
            _totalAmount = this.refundAmountPlayers.reduce((a,b)=>{
                console.log("iterating : ", a,b)
                return a + b;
            });
            if(!_totalAmount || _totalAmount === 0) return false;
            let _balance = 0;
            _balance = this.getRefundableAmount() - _totalAmount;
            return _balance.toFixed(2);
        }

        getBookingPlayers() {
            let _bookingPlayers = [];
            this.currentSlot.bookingPlayers.forEach((p)=>{
                if(p.player) _bookingPlayers.push(p.player)
            });
            let _paidPlayers = [];

            if(this.currentSlot.payments) {
                this.currentSlot.payments.filter((pp)=>{
                    let _isPlayer = true;
                    if(pp.payingPlayer) {

                        _bookingPlayers.filter((bp)=>{
                            if(bp.player && bp.player.id)
                                if(bp.player.id === pp.payingPlayer.id)
                                    _isPlayer = false;
                        })
                        if(_isPlayer) _bookingPlayers.push(pp.payingPlayer)

                    }
                })
            }
            console.log("get booking : booking players - ", _bookingPlayers);
            console.log("get booking : paid players - ", _paidPlayers)
            console.log("get booking : unique - ", this.getUnique(_bookingPlayers,'id'))
            return this.getUnique(_bookingPlayers,'id');
        }

        refreshPaymentMethod() {
            this.paymentMethodList = [];
            this.flightService.getPaymentMethodList()
            .subscribe((data: Array<PaymentMethod>)=>{
                console.log("refresh payment method : ", data)
                if(data) {
                    this.paymentMethodList = data;
                }

            })
        }

        getPaymentMethodList() {
            let _pmList = this.paymentMethodList;
            
            // <ion-option value="cash">Cash</ion-option>
            // <ion-option value="clbc">myGolf2u Club Credit</ion-option>
            // <ion-option value="btrf">Bank Transfer</ion-option>
            // <ion-option [disabled]="true" value="m2uc"><i>myGolf2u Credit</i></ion-option>

            //  this.paymentMethodList.filter((data: PaymentMethod)=>{
                
            // })
            return _pmList;
        }

        getChargeableAmount() {
            let _amount
            if(this.includeTaxes) _amount = this.bookingItemBill.totalCharges + this.bookingItemBill.taxes;
            //this.bookingItemBill.totalPayable;
            else if(!this.includeTaxes) _amount = this.bookingItemBill.totalCharges;

            return _amount;
        }

        getAppAttribute() { 
            console.log("[app attribute] : ")
            this.flightService.getAppAttributes()
            .subscribe((data: any)=>{
                console.log("[app attribute] : ", data)
                if(data) {
                    data.filter((d)=>{
                        return d.page === 'refundBookingPlayers'
                    }).map((d)=>{
                        this.appAttribute = d
                    });
                    if(this.appAttribute && this.appAttribute.includeTaxes) this.includeTaxes = this.appAttribute.includeTaxes;
                }
            })
        }

        onCancelThisBooking() {
            let alert = this.alertCtrl.create({
                title: 'Booking Cancellation',
                // subTitle: 'Selected date is '+ _date,
                message: 'Are you sure you want to cancel this booking?', //'Selected date is ' + '<b>' + _date + '</b>',
                buttons: [ {
                    text: 'No',
                    role: 'cancel'
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.goCancelBooking(this.cancelReason);
                    }
                },]
            });
            alert.present();

        }

        goCancelBooking(data: any) {
            let _reason = data ? data.reason : '';
            let _bookingId = this.currentSlot.id;
            console.log("go cancel booking : ", data)
            console.log("cancel booking", this.currentSlot.id, _bookingId)
            let _cancelledByClub = this.fromClub?this.fromClub:false;
            this.flightService.cancelBooking(this.currentSlot.id, _cancelledByClub, _reason)
                .subscribe((data) => {
                    if (data.status === 200) {
                        MessageDisplayUtil.showMessageToast('Successfully cancel this booking', 
                        this.platform , this.toastCtl, 5000, "bottom");
                    }
                    console.log("cancel booking : ", data)
                })
        }

        onUndoRefundClick(refund: RefundInstance) {
            // if(!item.adhocWaiver) return;
            if(!refund) return;
            let _totalAmount = refund.refundAmount;
            let alert = this.alertCtrl.create({
                title: 'Undo Refund',
                // subTitle: 'Selected date is '+ _date,
                message: 'Undo refund amount is '+ this.currency.symbol + ' ' +_totalAmount+ ". Do you want to proceed?", //'Selected date is ' + '<b>' + _date + '</b>',
                buttons: [ {
                    text: 'No',
                    role: 'cancel'
                },{
                    text: 'Yes',
                    handler: () => {
                        this.undoRefundBooking(refund)
                    }
                },]
            });
            alert.present();
        }

        undoRefundBooking(refund: RefundInstance) {
            let _bookingId = this.currentSlot.id;
            let _refundInstanceId = refund.id;
            this.flightService.undoRefundBooking(_bookingId, _refundInstanceId)
            .subscribe((data)=>{
                if(data) {
                    MessageDisplayUtil.showMessageToast('Successfully undo selected refund', 
                    this.platform , this.toastCtl, 5000, "bottom");
                    
                        this.bookingDiscounts = [];
                        let _data = data;
                        // if(_data) this.currentSlot = _data;
                        if(_data) {
                            this.currentSlot = _data;
                            this.bookingDiscounts = [];
                            // this.bookingDiscounts.push(..._data.bookingDiscounts);
                            this.bookingDiscounts = JSON.parse(JSON.stringify(_data.bookingDiscounts));
                            let _totalWaive;
                            if(this.bookingDiscounts.length > 0)
                            this.bookingDiscounts.forEach((bd)=>{
                                bd.toggleDetails = false;
                                _totalWaive += bd.amountDeducted;
                            })
                            // this.adjustableAmount = this.bookingItemBill.totalCharges - _totalWaive;
    
                        }
                }
                this.getBookingItemizedBill();
            },(error)=>{
                if(error) {
                    console.log("Undo refund error : ", error)
                    let _error = error.json();
                    MessageDisplayUtil.showErrorToast('Failed to undo selected refund.' + _error.errorMessage, 
                    this.platform , this.toastCtl, 5000, "bottom");
                }
                
            })
        }
}
