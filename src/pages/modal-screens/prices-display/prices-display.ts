import {NavController, NavParams, ViewController} from "ionic-angular";
import {Component, Attribute} from "@angular/core";
import { GameRoundInfo } from "../../../data/game-round";
import {CompetitionInfo  } from "../../../data/competition-data";
import { TeeTimeSlotDisplay, DisplayPrices, CurrencyData, BuggyAssignment, BuggyData, TeeTimeBooking, CaddyData, CaddyAssignment, TeeTimeBookingPlayer, ItemizedBill, BookingPlayerCharges, BillItem, PaymentGatewayInfo, BookingOfflinePayment, OfflinePayment, TeeTimeClubVoucher, TeeTimeBookingDiscount } from "../../../data/mygolf.data";
import { AlertController } from "ionic-angular";
import { ModalController } from "ionic-angular";
import { Platform } from "ionic-angular";
import { MessageDisplayUtil } from "../../../message-display-utils";
import { ToastController } from "ionic-angular";
import { ClubFlightService } from "../../../providers/club-flight-service/club-flight-service";
import { PaymentService } from "../../../providers/payment-service/payment-service";
  

/*
 Generated class for the CompetitionDescriptionPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */

export interface ClubPaymentMethod {
    id: string;
    name: string;
    visible: boolean;
    enabled: boolean;
    checked: boolean;
    APIname: string;
}

@Component({
    templateUrl: 'prices-display.html',
    selector: 'prices-display-page'
})
export class PricesDisplayPage
{
    public competition: CompetitionInfo;
    public gameRound: GameRoundInfo;
    public headerName: string;
    teeSlot: TeeTimeBooking;
    prices: DisplayPrices;
    currency: CurrencyData;

    buggyAssigned: Array<BuggyData> = new Array<BuggyData>();
    caddyAssigned: Array<CaddyData> = new Array<CaddyData>();
    caddyPreferred: Array<CaddyData> = new Array<CaddyData>();
    selectPaymentMethod: string = 'online'; // online, credit-card, charge-account

    paymentAmountType: string = 'full'; //full,deposit
    
    depositAmount: number = 0;
    type: string = 'payment_confirm';
    itemBill: ItemizedBill;
    countryId: string;
    paymentGatewayList: Array<PaymentGatewayInfo>;
    clubPayment: boolean;
    clubPaymentMethod: Array<string> = ['cash']; //['none'];
    fullAmountType: Array<string> = ['specific'];
    clubPaymentArray: Array<number> = [0];
    clubAmount: Array<number> = [0];
    totalClubAmount: number;
    clubPaymentRemarks: Array<string> = ['']
    bookingDiscounts: Array<TeeTimeBookingDiscount>;

    constructor(public nav: NavController,
        private navParams: NavParams,
        private viewCtrl: ViewController,
        private alertCtrl: AlertController,
        private modalCtl: ModalController,
        private platform: Platform,
        private toastCtl: ToastController,
        private paymentService: PaymentService,
        private flightService: ClubFlightService) {
        this.competition           = this.navParams.get("competition");
        this.gameRound = this.navParams.get("gameRound");
        this.headerName      = this.navParams.get("headerName");
        this.teeSlot = this.navParams.get("slot");
        if(this.teeSlot) this.countryId = this.teeSlot.clubData.address.countryData.id;
        console.log("club country : ", this.countryId)
        this.type = this.navParams.get("type");
        this.itemBill = this.navParams.get("itemBill");
        this.itemBill.playerCharges.sort((a,b)=>{
            if(a.sequence < b.sequence) return -1
            else if(a.sequence > b.sequence) return 1
            else return 0
        })
        this.depositAmount = this.navParams.get("depositAmount")
        this.paymentGatewayList = this.navParams.get("paymentGatewayList");
        if(this.paymentGatewayList && this.paymentGatewayList.length > 0) this.selectPaymentMethod = this.paymentGatewayList[0].id;
        else if((this.type === 'payment_confirm') && this.paymentGatewayList && this.paymentGatewayList.length === 0 || !this.paymentGatewayList) {
            let _countryId = this.teeSlot.clubData.address.countryData.id;
            this.paymentService.getPaymentGateway(_countryId)
              .subscribe((pgList: Array<PaymentGatewayInfo>)=>{
            console.log("client payment gateway ", pgList)
            if(pgList && pgList.length > 0 ) {
                this.paymentGatewayList = pgList;
                this.selectPaymentMethod = this.paymentGatewayList[0].id
            }
        })
        }
        console.log("Prices display : ", this.paymentGatewayList)
        // this.prices = this.teeSlot.displayPrices;
        // this.currency = this.teeSlot.currency;
        if(this.teeSlot) {
            this.buggyAssigned.push(...this.teeSlot.buggiesAssigned)
            // this.depositAmount = this.navParams.get("depositAmount")>0?this.depositAmount:this.teeSlot.depositPayable;
        }
        this.teeSlot.bookingPlayers.forEach((tb: TeeTimeBookingPlayer)=>{
            this.caddyAssigned.push(tb.caddyAssigned);
            this.caddyPreferred.push(tb.caddyPreferred);
        })
        this.paymentAmountType = this.navParams.get("paymentAmountType")
        this.clubPayment = (this.navParams.get("clubPayment")==='true')?true:false;
        this.bookingDiscounts = this.navParams.get("voucherApplied");
        
        console.log("itemized bill : ", this.itemBill, ' deposit amount ', this.depositAmount, ' payment type ', this.paymentAmountType)

    }

    close() {
        this.viewCtrl.dismiss();
    }

    addClubPayment(item: number) {
        let _totalAmount = this.clubAmount.reduce((a,b)=>{
            return Number(a) + Number(b)
        });
        if(this.clubAmount[item] < 1) {
            MessageDisplayUtil.showMessageToast('Please enter an amount',
                            this.platform, this.toastCtl, 3000, "bottom")
            return false;
        }
        else if(this.clubAmount[item] > Number(this.getBookingDetails('price'))) {
            MessageDisplayUtil.showMessageToast('Please enter amount not more than '+Number(this.getBookingDetails('price')),
                            this.platform, this.toastCtl, 3000, "bottom")
            return false;
        } else if(_totalAmount >= Number(this.getBookingDetails('price'))) {
            MessageDisplayUtil.showMessageToast('Total amount has reached '+Number(this.getBookingDetails('price')),
                            this.platform, this.toastCtl, 3000, "bottom")
            return false;
        }
        this.previewTotalClubAmount();
        this.clubPaymentArray.push(item+1);
        if(this.clubPaymentArray[item+1]) {
            this.fullAmountType[item+1] = 'specific';
            this.clubPaymentMethod[item+1] = 'cash';
            this.clubPaymentRemarks[item+1] = '';
            this.clubAmount[item+1] = 0;
        }
    }
    removeClubPayment(item: number) {
        this.clubPaymentArray.splice(item,1);
        this.fullAmountType.splice(item,1);
        this.clubPaymentMethod.splice(item,1);
        this.previewTotalClubAmount();
        // this.clubPaymentArray.push(item+1);
        // if(this.clubPaymentArray[item+1]) {
        //     this.fullAmountType[item+1] = 'specific';
        //     this.clubPaymentMethod[item+1] = 'cash';
        // }
    }

    addClubAmount(amount: number, item: number) {
        console.log("[pre] add club amount - item : ", item, " | amount :", amount);
        console.log("[pre] add club amount - clubAmount : ", this.clubAmount[item]);
        console.log("[pre] add club amount - total clubAmount : ", this.totalClubAmount);
        if(amount < 0) {
            this.clubAmount[item] = 0;
            this.previewTotalClubAmount();
            return false;
        }
        else if (amount > Number(this.getBookingDetails('price')) ) {
            this.clubAmount[item] = Number(this.getBookingDetails('price'))
            this.previewTotalClubAmount();
            return false
        } 
        if(1) return false;
        else if ((this.totalClubAmount + amount) > Number(this.getBookingDetails('price'))) {
            return false;
        }
        // // this.previewTotalClubAmount(item);
        // this.clubAmount[item] = Number(this.getBookingDetails('price')) - this.totalClubAmount;
        // } else if (amount > Number(this.getBookingDetails('price'))) {
        //     // this.previewTotalClubAmount(item);
        //     this.clubAmount[item] = Number(this.getBookingDetails('price'));
        //     } 
        this.previewTotalClubAmount();
        if(1) return false;
        // if(this.clubAmount[item] > 0) return false;
        this.totalClubAmount = 0;
        this.totalClubAmount = this.clubAmount.reduce((a,b)=>{
            return Number(a) + Number(b)
        })
        this.clubAmount[item] = 0;
        let _totalClubAmount = this.totalClubAmount;
        let _amount = amount;
        console.log("[pre] add club amount - item : ", item, " | amount :", amount, _amount);
        console.log("[pre] add club amount - clubAmount : ", this.clubAmount[item]);
        console.log("[pre] add club amount _totalClubAmount : ", _totalClubAmount, " | this.totalClubASmount :", this.totalClubAmount);
        if((_amount + _totalClubAmount) > Number(this.getBookingDetails('price')))
            _amount = Number(this.getBookingDetails('price')) - Number(_totalClubAmount);
            // else if(this.totalClubAmount > Number(this.getBookingDetails('price'))) {
            //     _amount = Number(this.getBookingDetails('price'))
            // }
            else if(amount > Number(this.getBookingDetails('price'))) {
                _amount = Number(this.getBookingDetails('price')) - amount;
            } 
            // else if (_amount < 0) return false
        else _amount = amount;
        // this.totalClubAmount += _amount;
        if(this.clubAmount[item] === 0) this.clubAmount[item] = _amount
        
        console.log("[post] add club amount - item : ", item, " | amount :", amount, _amount);
        console.log("[post] add club amount - clubAmount : ", this.clubAmount[item]);
        console.log("[post] add club amount _totalClubAmount : ", _totalClubAmount, " | this.totalClubASmount :", this.totalClubAmount);
        
    }

    previewTotalClubAmount(item?: number) {
        let _toPayAmount = Number(this.getBookingDetails('price'));
        this.totalClubAmount = 0;
        let _currentTotal = 0;
        this.totalClubAmount = this.clubAmount.reduce((a,b, index)=>{
            // if(item && index === item) return Number(a) + 0
            // else return Number(a) + Number(b)
            // _currentTotal = Number(a) + Number(b);
            // _currentTotal += Number(a)
            // if(_toPayAmount <= _currentTotal) return _currentTotal;
            console.log("preview | index : ", index)
            console.log("preview | a : ", a)
            console.log("preview | b : ", b)
            console.log("preview | total : ", Number(a)+Number(b))
            // else 
            if(_toPayAmount < (Number(a)+Number(b))) {
                // this.clubAmount[index] = 0;
                this.clubAmount[index] = Number((_toPayAmount - a).toFixed(2));
                // console.log("preview | clubAmount[index]", this.clubAmount[index],  Number(_toPayAmount.toFixed(2)) - Number(a.toFixed(2)))
                // console.log("preview | clubAmount[index]", this.clubAmount[index], Number((_toPayAmount - a).toFixed(2)))
                // MessageDisplayUtil.showMessageToast(this.selectPaymentMethod + ' - Please select 1 (one) payment method to proceed.',
                //                     this.platform, this.toastCtl, 3000, "bottom")
                return Number(a.toFixed(2))
            } 
            else return Number(a.toFixed(2)) + Number(b.toFixed(2))
            // return Number(a) + Number(b)
        })
        console.log("preview total club amount pre ", this.totalClubAmount)
        if(this.totalClubAmount > Number(this.getBookingDetails('price'))) {
            this.totalClubAmount = Number(Number(this.getBookingDetails('price')).toFixed(2))
        }
        // this.totalClubAmount = Number(this.totalClubAmount.toFixed(2))
        console.log("preview total club amount post ", this.totalClubAmount)
    }

    cancelPayment() {
        this.viewCtrl.dismiss({
            confirm: false,
            paymentAmountType: this.paymentAmountType,
            depositAmount: this.depositAmount
        });
    }

    ionViewDidLoad() {
        console.log("Game Round : ", this.gameRound)
        this.getAppAttribute();
    }

    getInnerHTML() {
        let description = "<p><span style='background-color:#00FFFF'>Tournaments, electronic scorecards, analysis and more&hellip; Look no further! myGolf2u is a single place where you can find and register for any </span>competitions in your region, your favourite clubs or in the entire country on your phone or in this site.</p>"
        return description;
    }

    getBuggyAssigned(player: TeeTimeBookingPlayer) {
        let _player = player;
        let _buggyText = this.buggyAssigned.filter((buggy: BuggyData)=>{
            return buggy.id === player.buggyId
        }).map((buggy: BuggyData)=>{
            return buggy.id + ' (' + buggy.name + ')';
        });
        return _buggyText[0];
    }

    getCaddyAssigned(player: TeeTimeBookingPlayer) {
        let _player = player;
        let _caddyText = this.caddyAssigned.filter((caddy: CaddyData)=>{
            return caddy.id === player.caddyAssigned.id
        }).map((caddy: CaddyData)=>{
            return caddy.firstName + ' (' + caddy.staffId + ')';
        });
        return _caddyText[0];
    }

    getCaddyPreferred(player: TeeTimeBookingPlayer) {
        let _player = player;
        let _caddyText = this.caddyPreferred.filter((caddy: CaddyData)=>{
            return caddy.id === player.caddyPreferred.id 
        }).map((caddy: CaddyData)=>{
            return caddy.firstName + ' (' + caddy.staffId + ')';
        });
        
        return _caddyText[0];
    }

    onPayNow() {
        if(this.clubPayment) {
            this.previewTotalClubAmount();
            if(this.totalClubAmount === 0) {
             MessageDisplayUtil.showMessageToast('Please enter an amount',
                            this.platform, this.toastCtl, 3000, "bottom")
                return false;
            }

            console.log("club amount", this.clubAmount)
            let _zeroAmountIdx;
            // this.clubAmount.filter((amount: number, idx: number) =>{
            //     if(amount === 0) _zeroAmountIdx = idx;
            // })
            // this.clubAmount.splice(_zeroAmountIdx, 1);

            console.log("club amount", this.clubAmount, _zeroAmountIdx)
        }
        // if(this.depositAmount <= 0) {
        if(this.getBookingDetails('price') <= 0) {
            MessageDisplayUtil.showMessageToast('Total amount is less than 0',
                            this.platform, this.toastCtl, 3000, "bottom")
                return false;
        }
        // MessageDisplayUtil.showMessageToast(this.selectPaymentMethod + ' - Please select 1 (one) payment method to proceed.',
        //                     this.platform, this.toastCtl, 3000, "bottom")
        // if(1) return false;

        if(this.selectPaymentMethod === '' || this.selectPaymentMethod === null) {
            MessageDisplayUtil.showMessageToast(' - Please select a payment method to proceed.',
                            this.platform, this.toastCtl, 3000, "bottom")
            return false;
        }
        let _title = 'Redirecting to payment page';
        let _message = this.isIOS()?'You are using iOS device, you may need to disable any content blocker first. This will bring up the payment system. Do you want to proceed?':'This will bring up the payment system. Do you want to proceed?';

        // if(!this.clubPayment) {
        //     if(this.selectPaymentMethod.includes('billplz') && this.teeSlot && this.teeSlot.bookingPlayers[0].phone.length < )
        // }
        if(this.clubPayment) {
            _title = 'Confirm Payment';
            _message = 'Total Amount is '+ this.teeSlot.slotAssigned.currency.symbol + ' ' + this.numberWithCommas(this.totalClubAmount) +'. Do you want to proceed?' ;
            // Number(this.totalClubAmount.toFixed(2))
        }
        let alert = this.alertCtrl.create({
                title: _title,
                // subTitle: 'Selected date is '+ _date,
                message: _message, //'Selected date is ' + '<b>' + _date + '</b>',
                // buttons: ['Close'] 
                buttons: [{
                        text: 'No',
                        handler: () => {
                            // console.log('Cancel clicked');
                        }
                    },
                    {
                        text: 'Yes',
                        handler: () => {
                            if(this.clubPayment) {
                                let _offlinePayments: Array<OfflinePayment> = [{}];
                                this.clubPaymentArray.forEach((i)=>{
                                    if(this.clubAmount[i]>0) {
                                        let _singlePayment: OfflinePayment = {};
                                        _singlePayment.paymentMethod = this.clubPaymentMethod[i];
                                        _singlePayment.amount = this.clubAmount[i];
                                        _singlePayment.remarks = this.clubPaymentRemarks[i];
                                        _singlePayment.paidByName = this.teeSlot.bookingPlayers[0].playerName;
                                        _singlePayment.paidByEmail = this.teeSlot.bookingPlayers[0].email;
                                        _singlePayment.paidByPhone = this.teeSlot.bookingPlayers[0].phone;
                                        // _singlePayment.paidByName = 'nikzaki';
                                        // _singlePayment.paidByEmail = 'nikzaki@britesoftcorp.com';
                                        // _singlePayment.paidByPhone = '0123456789';
                                        _singlePayment.currency = this.teeSlot.slotAssigned.currency.id;
                                        _offlinePayments.push(_singlePayment);
                                    }
                                })
                                _offlinePayments.shift();
                                //  = [{
                                //     paymentMethod: '',
                                //     currency: '',
                                //     amount: 0
                                // }];
                                // this.clubPaymentMethod.forEach((paymentMethod: string)=>{
                                //     _singlePayment.push(paymentMethod)
                                // })
                                // this.clubAmount.forEach((amount: number)=>{
                                //     _offlinePayments['amount'].push(amount)
                                // })
                                // this.clubPaymentRemarks.forEach((remarks: string)=>{
                                //     _offlinePayments['remarks'].push(remarks)
                                // })
                                console.log("prices display club payment method : ", this.clubPaymentMethod)
                                console.log("prices display club payment : ", this.fullAmountType, this.clubAmount, this.clubPaymentRemarks)
                                console.log("prices display club offline Payments : ", _offlinePayments)

                                this.viewCtrl.dismiss({
                                    confirm: true,
                                    paymentAmountType: this.paymentAmountType,
                                    depositAmount: this.depositAmount,
                                    selectPaymentMethod: this.selectPaymentMethod,
                                    clubPayment: true,
                                    offlinePayments: _offlinePayments
                                });

                            } else {
                                this.viewCtrl.dismiss({
                                    confirm: true,
                                    paymentAmountType: this.paymentAmountType,
                                    depositAmount: this.depositAmount,
                                    selectPaymentMethod: this.selectPaymentMethod
                                });
                            }
                            
                        }
                    },
                ]
            });
            alert.present();
    }

    getBookingDetails(attribute ? : string) {
        let _statusText = '';
        if(attribute === 'status') {
           
            let _bookingStatus = this.teeSlot.bookingStatus;
            if(_bookingStatus === 'Booked') _statusText = 'Booked';
            else if(_bookingStatus === 'PaymentFull') _statusText = 'Paid in Full';
            else if(_bookingStatus === 'PaymentPartial') _statusText = 'Deposit Paid';
            else _statusText = _bookingStatus?_bookingStatus:'';
        }
        // let _amountPayable = (this.paymentAmountType === 'full')?this.teeSlot.amountPayable - this.teeSlot.amountPaid - this.teeSlot.totalDeductions:this.depositAmount;
        let _amountPayable = (this.paymentAmountType === 'full')?this.itemBill.balance:this.depositAmount;
        console.log("get booking details - ", attribute, " : ", this.paymentAmountType, "|",this.itemBill, this.depositAmount, _amountPayable)
        switch (attribute) {
            case 'reference':
                return "Ref #" + this.teeSlot.bookingReference
            case 'price':
                return _amountPayable;
            case 'currency':
                return this.teeSlot.slotAssigned.currency.symbol;
            case 'status':
                return _statusText;
        }
    }

    getPlayerTotal(player: BookingPlayerCharges) {
        let _totalPlayer = 0;
        let _totalDiscounts = 0;
        _totalPlayer = 
        player.billItems
        .map((b)=>{
            return b.itemPrice
        })
        .reduce((a: number,b: number) => a+b);

        if(player && player.discounts && player.discounts.length > 0) {
            _totalDiscounts = 
            player.discounts
            .map((d)=>{
                return d.amount
            })
            .reduce((a: number,b: number) => a+b)
        };
        // console.log("get player total ", _totalPlayer, _totalDiscounts)
        return _totalPlayer - _totalDiscounts;
        // return this.itemBill.balance;
    }

    onBillFullDetails() {
        let itemizedBill = this.modalCtl.create(PricesDisplayPage, {
            headerName: 'Bill Details',
            slot: this.teeSlot,
            type: 'payment_details',
            itemBill: this.itemBill,
        })

        itemizedBill.onDidDismiss((data: any) => {
            // if(data && data.confirm) {
            // }
        });
        itemizedBill.present();
    }

    getPlayerAssigned(player: TeeTimeBookingPlayer, attribute: string) {
        let _player = player;
        let _playerTypeApplied;
        let _buggyNo;
        let _caddyBooked: CaddyData;
        let _caddyAssigned: CaddyData;
        let _caddyName = '';
        console.log("player assigned", attribute, player);
        switch(attribute) {
            case 'playerTypeApplied':
                _playerTypeApplied = this.itemBill.playerCharges.filter((p: BookingPlayerCharges)=>{
                    return p.bookingPlayerId === _player.id
                }).map((p)=> p.playerTypeApplied)
                return _playerTypeApplied;
            case 'buggy':
                _buggyNo = this.teeSlot.buggiesAssigned.filter((b: BuggyData)=>{
                    return b.id === _player.buggyId
                }).map((b)=> b.buggyNo)
                
                if(!_buggyNo) _buggyNo = '-';
                return _buggyNo;
            case 'caddyBooked':
                _caddyBooked = _player.caddyPreferred?_player.caddyPreferred:null;
                if(_caddyBooked) {
                    if(_caddyBooked.firstName) _caddyName += _caddyBooked.firstName;
                    if(_caddyBooked.firstName && _caddyBooked.lastName) _caddyName += ' '+_caddyBooked.lastName;
                    else if(!_caddyBooked.firstName && _caddyBooked.lastName) _caddyName += _caddyBooked.lastName;
                    // _caddyName = _caddyBooked.firstName + ' '+_caddyBooked.lastName;
                }
                else _caddyName = '-';
                return _caddyName
            case 'caddyAssigned':
                _caddyAssigned = _player.caddyAssigned?_player.caddyAssigned:null;
                if(_caddyAssigned) {
                    if(_caddyAssigned.firstName) _caddyName += _caddyAssigned.firstName;
                    if(_caddyAssigned.firstName && _caddyAssigned.lastName) _caddyName += ' '+_caddyAssigned.lastName;
                    else if(!_caddyAssigned.firstName && _caddyAssigned.lastName) _caddyName += _caddyAssigned.lastName;
                }
                // if(_caddyAssigned) _caddyName = _caddyAssigned.firstName + ' '+_caddyAssigned.lastName;
                else _caddyName = '-';
                return _caddyName
        }
    }

    isCordova() {
        return this.platform.is("cordova");
    }

    isIOS() {
        console.log("you are using : ", this.platform._platforms )
        console.log("you are using --- ", this.platform.is('ios') , this.platform.is('iphone') , this.platform.is('ipad'))
        return this.platform.is('ios') || this.platform.is('iphone') || this.platform.is('ipad')
    }

    getMaxAmount(amount: number) {
        let _maxAmount: number = Number(this.getBookingDetails('price'));
        return _maxAmount - this.totalClubAmount;
        // - this.totalClubAmount
    }

    setFullAmount(item: number) {
        // setTimeout(()=>{
        //     if(this.totalClubAmount > 0 && (this.totalClubAmount !== Number(this.getBookingDetails('price')))) {
        //         this.clubAmount[item] = Number(this.getBookingDetails('price')) - this.totalClubAmount;
        //     } else if(this.totalClubAmount === 0) {
        //         this.clubAmount[item] = Number(this.getBookingDetails('price'));
        //     }
        // }, 500)
        this.clubAmount[item] = 0;
        this.totalClubAmount = this.clubAmount.reduce((a,b, index)=>{
            // if(item && index === item) return Number(a) + 0
            // else return Number(a) + Number(b)
            return Number(a) + Number(b)
        })
        if(this.totalClubAmount > 0 && (this.totalClubAmount !== Number(this.getBookingDetails('price')))) {
            this.clubAmount[item] = Number(this.getBookingDetails('price')) - this.totalClubAmount;
        } else if(this.totalClubAmount === 0) {
            this.clubAmount[item] = Number(this.getBookingDetails('price'));
        }
        this.previewTotalClubAmount();
        
    }

    setPlaceholder(type?: string) {
        switch(type) {
            case 'cash':
                return 'Enter payment details';
            case 'offcc':
                return 'Enter credit/debit card number or details';
            case 'offnb':
                return 'Enter payment details';
        }
    }

    getRemainingAmount() {
        if(this.totalClubAmount === 0 || !this.totalClubAmount) return Number(Number(this.getBookingDetails('price')).toFixed(2));
        else return Number(Number(this.getBookingDetails('price')).toFixed(2)) - this.totalClubAmount;
    }

    getPayingAmount() {
        if(this.totalClubAmount && this.totalClubAmount > 0)
            return this.numberWithCommas(this.totalClubAmount);
        else return 0
    }

    numberWithCommas(x) {
        if(!x) return x;
        else return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    getVoucherApplied() {
        if(this.bookingDiscounts && this.bookingDiscounts.length === 0 || !this.bookingDiscounts) return false;
        let _voucherAmount = this.bookingDiscounts
        .map((discount: TeeTimeBookingDiscount)=>{
            return discount.amountDeducted
        })
        .reduce((a: number, b: number)=>{
            return a + b;
        });
        return _voucherAmount;
    }

    appAttribute: any;
    showRefundBy: boolean = false;
    clubPaymentMethodList: Array<ClubPaymentMethod>;
    getAppAttribute() { 
        console.log("[app attribute] : ")
        this.flightService.getAppAttributes()
        .subscribe((data: any)=>{
            console.log("[app attribute] : ", data)
            if(data) {
                data.filter((d)=>{
                    return d.page === 'pricesDisplay'
                }).map((d)=>{
                    this.appAttribute = d
                });

                if(this.appAttribute) {
                    if(this.appAttribute.clubPaymentMethodList) 
                        this.clubPaymentMethodList = this.appAttribute.clubPaymentMethodList;
                }

            }
        })
    }
    
}
