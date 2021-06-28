import { TeeTimeSlot, TeeTimeSlotDisplay, ClubCourseData, CurrencyData, TeeTimeBookingPlayer, TeeTimeBookingBill, ItemizedBill } from './../../../data/mygolf.data';
import {Component} from "@angular/core";
import {ViewController, NavParams, ToastController, Platform} from "ionic-angular";
import { CourseInfo, CourseHoleInfo } from "../../../data/club-course";
import { ClubFlightService } from "../../../providers/club-flight-service/club-flight-service";
import { TeeTimeBooking } from "../../../data/mygolf.data";


import * as moment from "moment";
import { MessageDisplayUtil } from '../../../message-display-utils';
import { AlertController } from 'ionic-angular';
/**
 * Created by ashok on 19/12/16.
 */
@Component({
    templateUrl: 'redeem-player-club-credits.html',
    selector: 'redeem-player-club-credits-page'
})
export class RedeemPlayerClubCreditsModal
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
    currency: CurrencyData
    redeemPlayers: Array < any > = [false, false, false, false, false, false];
    redeemAmountPlayers: Array < any > = [0, 0, 0, 0, 0, 0];
    creditBalancePlayers: Array < any > = [0, 0, 0, 0, 0, 0]
    amountRefundable: number;
    clubPaymentMethod: string = 'cash';
    fromClub: boolean = false;
    itemizedBill: ItemizedBill;
    currentPlayerId: number;

    
    redeemPlayersReason: Array<string> = new Array<string> ();
    redeemPlayersReasonOn: Array<boolean> = new Array<boolean> ();

    displayRefundHistory: boolean = false;

    constructor(private viewCtrl: ViewController,
        private flightService: ClubFlightService,
        private navParams: NavParams,
        private toastCtl: ToastController,
        private platform: Platform,
        private alertCtrl: AlertController) {
        this.courses = navParams.get("courses");
        this.clubId = navParams.get("clubId");
        this.forDate = navParams.get("forDate");
        this.courseId = navParams.get("courseId");
        this.changeType = navParams.get("changeType");
        this.currentSlot = navParams.get("currentSlot")
        this.currency = navParams.get("currency");
        if(this.changeType && this.changeType ==='slot') this.isClub = false;
        else if(this.changeType && this.changeType === 'course') this.isClub = true;
        // if(this.currentSlot) this.amountRefundable = this.currentSlot.amountPaid * 0.5;
        if(this.currentSlot) this.currentSlot.bookingPlayers.forEach((t: TeeTimeBookingPlayer, idx: number)=>{
                this.redeemPlayersReasonOn[idx] = false;
                this.redeemPlayersReason[idx] = '';
        })
        this.itemizedBill = navParams.get("itemizedBill");
        this.fromClub = navParams.get("fromClub");
        if(!this.fromClub) this.currentPlayerId = navParams.get("currentPlayerId")

    }

    ionViewDidLoad() {
        // this.getTeeTimeBookingList();
        this.getPlayersCredits();
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
            console.log("on refund to player : ", event, " - ", player);
            _totalAmount = this.redeemAmountPlayers.reduce((a,b)=>{
                console.log("iterating : ", a,b)
                // if(a) _totalAmount += a
                return a + b;
            })
            setTimeout(()=>{
                let _refund;
                _refund = Number((this.amountRefundable - _totalAmount).toFixed(2));
                this.redeemAmountPlayers[i] = _refund > 0? _refund:0;
            }, 0)
            console.log("on refund to player : ", this.amountRefundable, " - ", _totalAmount);
            console.log("refund total players : ", this.redeemAmountPlayers);
            if(this.redeemPlayers[i] === false) {
                this.redeemPlayersReasonOn[i] = false;
                this.redeemPlayersReason[i] = '';
            }
        }

        getTotalRefundAmount() {
            let _total = 0;
            if(this.redeemAmountPlayers.length === 0) return false;
            _total = this.redeemAmountPlayers.reduce((a,b)=>{
                return Number(a) + Number(b)
            });
            return _total;
        }

        getTotalRedeemAmount() {
            let _total = 0;
            if(this.redeemAmountPlayers.length === 0) return false;
            _total = this.redeemAmountPlayers.reduce((a,b)=>{
                return Number(a) + Number(b)
            });
            return _total;

        }

        onRedeemNow() {
            let _totalAmount = 0;

            let _amountPayable = this.currentSlot.amountPayable;
            let _amountDeduction = this.currentSlot.totalDeductions;
            let _amountPaid = this.currentSlot.amountPaid;
            let _amountRefund = this.currentSlot.totalRefund;
            let _amountBalance = this.itemizedBill.balance;

            _totalAmount = this.redeemAmountPlayers.reduce((a,b)=>{
                console.log("iterating : ", a,b)
                return Number(a) + Number(b);
            });
            let _totalAmountPay = _amountBalance; //_amountPayable - _amountDeduction - _amountPaid + _amountRefund; //5.31111111111; //
            _totalAmountPay = Number((Math.round(_totalAmountPay * 100) / 100).toFixed(2));
            //  Number((Math.round(5.28999999 * 100) / 100).toFixed(2));// Number(5.28999999.toFixed(2))
            _totalAmount = Number(_totalAmount.toFixed(2));
            let _totalAmount2 = Number((Math.round(_totalAmount * 100) / 100).toFixed(2));
            console.log("[redeem] Total Redeem : ", _totalAmount,  _totalAmount2, _totalAmountPay, _amountBalance)
            console.log("[redeem] Total Amount to Pay : ", 5.28999999,_totalAmountPay, _amountPayable - _amountDeduction - _amountPaid)
            if(_totalAmount > _totalAmountPay ) {
                MessageDisplayUtil.showMessageToast('Redeem amount is more than amount to pay', 
                this.platform , this.toastCtl, 5000, "bottom");
                return false;
            }
            // console.log('amount refundable ', this.amountRefundable, _totalAmount)
            // if(this.currentSlot.amountPaid < this.getRefundableAmount()) {
            //     MessageDisplayUtil.showMessageToast('Amount paid is less than refundable amount', 
            //     this.platform , this.toastCtl, 5000, "bottom");
            //     return false;
            // }
            // if(this.getRefundableAmount() <= 0) {
            //     MessageDisplayUtil.showMessageToast('There is no refundable amount for this booking', 
            //     this.platform , this.toastCtl, 5000, "bottom");
            //     return false;
            // }
            if(_totalAmount === 0) {
                MessageDisplayUtil.showMessageToast('Please select a player and enter redeem amount', 
                this.platform , this.toastCtl, 5000, "bottom");
                return false;
            }
            // else if(this.getRefundableAmount() < _totalAmount) {
            //     // this.amountRefundable
            //     MessageDisplayUtil.showMessageToast('Total refund amount is more than refundable amount', 
            //     this.platform , this.toastCtl, 5000, "bottom");
            //     return false;
            // }


            let _bookingId = this.currentSlot.id;
            let _refundMode = this.clubPaymentMethod;
            let _refundText;
            switch(_refundMode) {
                case 'cash':
                    _refundText = 'Cash';
                    break;
                case 'clbc':
                    _refundText = 'Club Credit/Debit Card';
                    break;
                case 'btrf':
                    _refundText = 'Bank Transfer';
                    break;
                case 'm2uc':
                    _refundText = 'MyGolf2u Credit';
                    break;
            }
            let _players: Array<TeeTimeBookingPlayer> = new Array<TeeTimeBookingPlayer> ();
            _players.push(...this.currentSlot.bookingPlayers);

            let _noReason: boolean = false;

            // _players.forEach((t: TeeTimeBookingPlayer, idx: number)=>{
            //     if(this.redeemPlayers[idx]) {
            //         if(!this.redeemPlayersReason[idx] || this.redeemPlayersReason[idx].length === 0) {
            //             MessageDisplayUtil.showMessageToast('Please enter a reason to refund for '+t.playerName, 
            //             this.platform , this.toastCtl, 5000, "bottom");
            //             _noReason = true;
            //             return false;
            //         } 
            //     }
            // })
            // if(_noReason) return false;

            let alert = this.alertCtrl.create({
                title: 'Redeem Credits',
                // subTitle: 'Selected date is '+ _date,
                message: 'Total redeem amount is '+ this.currency.symbol + ' ' +_totalAmount.toFixed(2) +". Do you want to proceed?", //'Selected date is ' + '<b>' + _date + '</b>',
                buttons: [ {
                    text: 'No',
                    role: 'cancel'
                },{
                    text: 'Yes',
                    handler: () => {
                        this.goRedeem();
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

        goRedeem() {

            let _bookingId = this.currentSlot.id;
            let _refundMode = this.clubPaymentMethod;
            let _players: Array<TeeTimeBookingPlayer> = new Array<TeeTimeBookingPlayer> ();
            _players.push(...this.currentSlot.bookingPlayers);
            this.currentSlot.bookingPlayers.forEach((t: TeeTimeBookingPlayer, idx: number)=>{
                if(this.redeemPlayers[idx]) {
                    this.flightService.redeemPlayerClubCredit(_bookingId, _players[idx].player.id, this.redeemAmountPlayers[idx])
                        .subscribe((data: any)=>{
                            console.log("done redeem booking players : ", data);
                            MessageDisplayUtil.showMessageToast('Successfully redeemed credits.', 
                            this.platform , this.toastCtl, 5000, "bottom");
                            this.viewCtrl.dismiss({
                                needRefresh: true
                            });
                            // return false;
                        })
                }
            })
        }

        getRefundableAmount() {
            let _amountPayable = this.currentSlot.amountPayable;
            let _amountDeduction = this.currentSlot.totalDeductions;
            let _amountPaid = this.currentSlot.amountPaid;
            let _amountRefund = this.currentSlot.totalRefund;
            // this.amountRefundable = _amountPayable + _amountRefund - (_amountPaid + _amountDeduction);
            this.amountRefundable = (_amountPayable + _amountRefund - (_amountPaid + _amountDeduction));
            this.amountRefundable = -1*this.amountRefundable;
            console.log("refundable amount ", this.amountRefundable, _amountPayable,
            _amountDeduction,
            _amountPaid,
            _amountRefund)
            return Number(this.amountRefundable.toFixed(2));
        }

        toggleRefundHistory() {
            this.displayRefundHistory = !this.displayRefundHistory;
            console.log("refund - currentSlot : ", this.currentSlot)
        }

        getPlayersCredits() {
            let _clubId = this.clubId;
            this.currentSlot.bookingPlayers.forEach((p,i)=>{
                this.flightService.getPlayerClubCredits(p.player.id,_clubId)
                .subscribe((data)=>{
                    if(data) {
                        console.log("get player club credits - ",p.playerName+" : "+ data.balance)
                        this.creditBalancePlayers[i] = data.balance;
                    }
                })
            })
        }

        onKeyPlayerRedeemAmount(i: number) {
            if(this.redeemAmountPlayers[i] < 0) this.redeemAmountPlayers[i] = 0;
            if(this.redeemAmountPlayers[i] > this.creditBalancePlayers[i]) {
                this.redeemAmountPlayers[i] = this.creditBalancePlayers[i];
                MessageDisplayUtil.showMessageToast('Please enter redeem amount less than credit balance', 
                this.platform , this.toastCtl, 5000, "bottom");
                this.getCreditBalance(i);
                return false;
            }
        }

        getCreditBalance(i: number) {
            if(!i) return;
            if(!this.redeemAmountPlayers[i]) return;
            if(this.redeemAmountPlayers[i] === 0) return;
            let _remainingAmount = 0;
            _remainingAmount = this.creditBalancePlayers[i] - this.redeemAmountPlayers[i];
            console.log("get credit balance - ", i, this.creditBalancePlayers[i], this.redeemAmountPlayers[i], _remainingAmount)
            return _remainingAmount;
        }

        getRedeemPlayerAmount(i: number) {
            if(!this.redeemAmountPlayers[i]) return 0;
            if(this.redeemAmountPlayers[i] && this.redeemAmountPlayers[i] > 0) return this.redeemAmountPlayers[i].toFixed(2)
        }

        onSetAmountPay() {
            if(this.fromClub) return;
            console.log("on set amount pay ", this.redeemPlayers)
            console.log("on set amount pay ", this.currentSlot)
            let i;
            this.currentSlot.bookingPlayers.filter((p: TeeTimeBookingPlayer, index: number)=>{
                if(p.player.id === this.currentPlayerId )
                    i = index;
            })
            if(this.redeemPlayers[i]===true) {
                // itemizedBill.balance.toFixed(2):currentSlot.amountPayable
                let _setAmount;
                let _balanceAmount;
                console.log("on set amount pay : ", this.itemizedBill.balance)
                console.log("on set amount pay : ", this.currentSlot.amountPayable)
                console.log("on set amount pay : ", this.redeemAmountPlayers)
                console.log("on set amount pay : ", this.creditBalancePlayers)
                if(this.itemizedBill && this.itemizedBill.balance) _balanceAmount = this.itemizedBill.balance
                else if(this.currentSlot && this.currentSlot.amountPayable) _balanceAmount = this.currentSlot.amountPayable
                if(_balanceAmount > this.creditBalancePlayers[i]) 
                    _setAmount = Number(this.creditBalancePlayers[i].toFixed(2))
                else _setAmount = Number(_balanceAmount.toFixed(2))
                if(_setAmount < 0) {
                    this.redeemAmountPlayers[i] = -1* _setAmount;
                } else this.redeemAmountPlayers[i] = _setAmount;
            }
        }
}
