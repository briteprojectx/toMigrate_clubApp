import {NavController, NavParams, ViewController,Platform,ToastController, LoadingController} from "ionic-angular";
import {Component, PipeTransform, Pipe} from "@angular/core";
import { PlainScorecard, PlayerRoundScores } from "../../../data/handicap-history";
import {MessageDisplayUtil} from '../../../message-display-utils';

import * as moment from 'moment';
import { InAppBrowser, InAppBrowserOptions } from "@ionic-native/in-app-browser";

import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from "@angular/platform-browser";
import { HandicapIndexSubscription, PremiumFeatureBundle, PremiumFeaturePrice } from "../../../data/premium-subscription";
import { HandicapService } from "../../../providers/handicap-service/handicap-service";
import { PlayerInfo } from "../../../data/player-data";
import {Observable} from 'rxjs/Observable';
import { PaymentService } from "../../../providers/payment-service/payment-service";
import { PlayerPaid } from "../../../data/payment-bill";


/*
 Generated class for the CompetitionDescriptionPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */

// @Pipe({ name: 'safe' })
// export class SafePipe implements PipeTransform {
//   constructor(private sanitizer: DomSanitizer) { }
//   public transform(value: any, type: string): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
//     switch (type) {
// 			case 'html': return this.sanitizer.bypassSecurityTrustHtml(value);
// 			case 'style': return this.sanitizer.bypassSecurityTrustStyle(value);
// 			case 'script': return this.sanitizer.bypassSecurityTrustScript(value);
// 			case 'url': return this.sanitizer.bypassSecurityTrustUrl(value);
// 			case 'resourceUrl': return this.sanitizer.bypassSecurityTrustResourceUrl(value);
// 			default: throw new Error(`Invalid safe type specified: ${type}`);
// 		}
//   }
// }

@Component({
    templateUrl: 'player-subscription.html',
    selector: 'player-subscription-page'
})
export class PlayerSubscriptionPage
{
    public title: string;
    public descriptionText: string;
    public headerName: string;
    public billId: number;
    public collectionId: number;

    myTime: any = moment();
    teeTime:  Date = new Date(); //string; //Date = new Date(); 
    prevTeeTime: Date; // = new Date();
    myTDate: string; //Date;// = new Date();
    prs: PlayerRoundScores;
    prevTdate: string;


    options : InAppBrowserOptions = {
        location : 'yes',//Or 'no' 
        hidden : 'no', //Or  'yes'
        clearcache : 'yes',
        clearsessioncache : 'yes',
        zoom : 'yes',//Android only ,shows browser zoom controls 
        hardwareback : 'yes',
        mediaPlaybackRequiresUserAction : 'no',
        shouldPauseOnSuspend : 'no', //Android only 
        closebuttoncaption : 'Close', //iOS only
        disallowoverscroll : 'no', //iOS only 
        toolbar : 'yes', //iOS only 
        enableViewportScale : 'no', //iOS only 
        allowInlineMediaPlayback : 'no',//iOS only 
        presentationstyle : 'pagesheet',//iOS only 
        fullscreen : 'yes',//Windows only    
    };

    paying: boolean = false;
    billUrl: string = null;
    idxSubs: HandicapIndexSubscription;
    player: PlayerInfo
    player$: Observable<PlayerInfo>;
    bundles: Array<PremiumFeatureBundle>;

    pricingCollection: any;
    paymentStatus: string = 'Pending';

    constructor(public nav: NavController,
        private navParams: NavParams,
        private viewCtrl: ViewController,
        private toastCtl: ToastController,
        private platform: Platform,
        private iab: InAppBrowser,
        private sanitizer: DomSanitizer,
        private handicapService: HandicapService,
        private paymentService: PaymentService,
        private loadingCtl: LoadingController) {
        this.title           = this.navParams.get("title");
        this.descriptionText = this.navParams.get("description");
        this.headerName      = this.navParams.get("headerName");
        this.idxSubs         = this.navParams.get("hcpIdxSubs");
        this.player$          = this.navParams.get("playerInfo");
        this.player$.take(1).subscribe((player: PlayerInfo) => {
            this.player = player
        });

        this.billUrl = this.navParams.get("url");
        // this.billUrl = this.billUrl+'&output=embed';
        if(this.billUrl) this.paying = true;

        console.log("hcp subs : ", this.idxSubs)

        this.getAllBundles();

        // this.myDate = moment(new Date()).format("YYYY-MM-DDTHH:mmZ");
        // this.teeTime = this.myDate;
        // this.myTDate= this.myDate;
    }

    close() {
        // console.log("[start time] before dismiss : ", this.scorecard)
        // this.scorecard.playerRoundScores[0].startTime = moment(this.teeTime).format("HH:mm:ss");
        // // moment(this.teeTime).toDate(); //moment(this.teeTime,"YYYY-MM-DDTHH:mmZ").format("HH:mm:ss");
        // this.viewCtrl.dismiss({scorecard: this.scorecard});
        this.myTDate = this.prevTdate;
        this.teeTime = this.prevTeeTime;
        this.viewCtrl.dismiss(null);
    }

    onApplyClick() {
        let valid: boolean = true;
        let currentDate = moment().format("YYYY-MM-DD");
        let currentTime = moment().format("HH:mm");

        let selDate = moment(this.myTDate).format("YYYY-MM-DD");
        let selTime = moment(this.teeTime).format("HH:mm");

        console.log("apply click current date/time:",currentDate,",",currentTime)
        console.log("apply click selected date/time:",selDate,",",selTime)

        if(selDate > currentDate) {
            valid = false;
        } else if (selDate == currentDate && selTime > currentTime) {
            valid = false
        }

        if(!valid) {
            let subTitle = "Please set tee-off date and time in the past or today";
                                    MessageDisplayUtil.showErrorToast(subTitle, this.platform,
                                        this.toastCtl, 3000, "bottom");
            return false;
        }
    
        this.viewCtrl.dismiss({});

    }

    getInnerHTML() {
        let description = "<p><span style='background-color:#00FFFF'>Tournaments, electronic scorecards, analysis and more&hellip; Look no further! myGolf2u is a single place where you can find and register for any </span>competitions in your region, your favourite clubs or in the entire country on your phone or in this site.</p>"
        return description;
    }

    validTime() {
        // this.prs.startTime = moment(this.teeTime).format("HH:mm");
        // if(!this.scorecard.playerRoundScores[0].startTime) {
        //     console.log("valid Time")
        //     this.scorecard.startTime = moment(this.teeTime,"HH:mm A").format("HH:mm");
        //     this.scorecard.playerRoundScores[0].startTime = moment(this.teeTime,"HH:mm A").format("HH:mm");
        // }
            
        // else {
        //     console.log("else")
        //     this.scorecard.startTime = moment(this.teeTime,"YYYY-MM-DDTHH:mm:ssZ").format("HH:mm");
        //     this.scorecard.playerRoundScores[0].startTime = moment(this.teeTime,"YYYY-MM-DDTHH:mm:ssZ").format("HH:mm");
        // }
        // 2020-03-20T15:02:00+08:00

    }


    testCall() {
        this.viewCtrl.dismiss({type: 'testCall'});
    }

    getCollections() {
        this.viewCtrl.dismiss({type: 'getCollections'});
    }

    createCollection() {
        this.viewCtrl.dismiss({type: 'createCollection'});
    }

    getRemoteCollections() {
        this.viewCtrl.dismiss({type: 'getRemoteCollections'});
    }

    getLocalCollections() {
        console.log("local collections", this.collectionId)
        this.viewCtrl.dismiss({type: 'getLocalCollections', collectionId: this.collectionId});
    }
    
    createRemoteBill() {
        console.log("create remote bill")
        this.viewCtrl.dismiss({type: 'createRemoteBill', collectionId: this.collectionId});
    }


    // createBill() {
    //     this.viewCtrl.dismiss({type: 'createBill', collectionId: this.collectionId});
    // }

    // getBill() {
    //     this.viewCtrl.dismiss({type: 'getBill', billdId: this.billId});
    // }


    public openWithSystemBrowser(url : string){
        let target = "_system";
        this.iab.create(url,target,this.options);
    }
    public openWithInAppBrowser(url : string){
        let target = "_blank";
        this.iab.create(url,target,this.options);
    }
    public openWithCordovaBrowser(url : string){
        let target = "_self";
        this.iab.create(url,target,this.options);
    }
    
    public getSubsType(subsType: string) {
        let _subsType: string;
        if(subsType === 'T')
            _subsType = 'Trial'
        else _subsType = 'Paid'

        return _subsType
    }

    getDate(date?: Date) {
        let _Date = moment(date,"YYYY-MM-DDTHH:mmZ").format("MMM DD, YYYY");
        return _Date;
    }

    getAllBundles() {
        console.log("get all bundles", this.player)
        this.handicapService.getHcpIdxBundles(this.player.countryId)
        .subscribe((data: Array<PremiumFeatureBundle>)=> {
            console.log("bundle", data)
            this.bundles = data
        })
    }

    getPrice(type?: number) {
        let _subInfo;
        _subInfo = this.bundles.filter((b)=>{
            if(type===1)
                return b.name === '3 Months'
            else if(type === 2)
                return b.name === '6 Months'
                else if(type === 3)
                    return b.name === '1 Year'
        })
        .map(b => {
            return b
        })

        let _price = (_subInfo[0] && _subInfo[0].prices[0])?_subInfo[0].prices[0].currency + " " + _subInfo[0].prices[0].price:'N/A'

        if(!type || type===null) return ''
        // else return _subInfo[0].prices[0].currency + " " + _subInfo[0].prices[0].price
        else return _price;
    }

    get3MSubs() {
        let _subInfo;
        _subInfo = this.bundles.filter((b)=>{
            return b.name == '3 Months'
        })
        .map(b => {
            return b
        })


        console.log("sub info 3M ", _subInfo)

        if(!_subInfo[0] || !_subInfo[0].prices[0]) {
            return false;
        }
        let priceInfo = _subInfo[0].prices[0];
        
        this.handicapService.getPremiumFeatureCollection(_subInfo[0].prices[0].id)
        .subscribe((data:any)=>{
            console.log("collection 3M ", data)
            this.pricingCollection = data;
            if(data) {
                this.createBill(data.id,priceInfo)
                // this.paymentService.createBill(data.id)
                // .subscribe((data:any)=> {
                //     console.log("3M response : ", data)
                // })
            }
        })
    }

    get6MSubs() {
        let _subInfo;
        _subInfo = this.bundles.filter((b)=>{
            return b.name == '6 Months'
        })
        .map(b => {
            return b
        })

        if(!_subInfo[0] || !_subInfo[0].prices[0]) {
            return false;
        }

        let priceInfo = _subInfo[0].prices[0];
        
        console.log("sub info 6M ", _subInfo)
        this.handicapService.getPremiumFeatureCollection(_subInfo[0].prices[0].id)
        .subscribe((data:any)=>{
            console.log("collection 6M ", data)
            this.pricingCollection = data;
            if(data) {
                this.createBill(data.id,priceInfo)
                // this.paymentService.createBill(data.id)
                // .subscribe((data:any)=> {
                //     console.log("3M response : ", data)
                // })
            }
        })

    }

    get1YSubs() {
        let _subInfo;
        _subInfo = this.bundles.filter((b)=>{
            return b.name === '1 Year'
        })
        .map(b => {
            return b
        })

        if(!_subInfo[0] || !_subInfo[0].prices[0]) {
            return false;
        }
        let priceInfo = _subInfo[0].prices[0];

        
        console.log("sub info 1Y ", _subInfo)
        this.handicapService.getPremiumFeatureCollection(_subInfo[0].prices[0].id)
        .subscribe((data:any)=>{
            console.log("collection 1Y ", data)
            this.pricingCollection = data;
            if(data) {
                this.createBill(data.id,priceInfo)
                // this.paymentService.createBill(data.id)
                // .subscribe((data:any)=> {
                //     console.log("3M response : ", data)
                // })
            }
        })
    }

    createBill(collectionId: string, priceInfo: PremiumFeaturePrice) {


        let _collectionId: string;
        if(collectionId) _collectionId = collectionId
        // else _collectionId = this.compCollectionId
        // console.log("create bill ",_collectionId,collectionId,this.compCollectionId)
        console.log("create bill - player ",this.player)
        let loader = this.loadingCtl.create({
            content     : "Processing Payment...",
            showBackdrop: false
        });
  
        let playerPaid: PlayerPaid = {
          player_id: this.player.playerId
        }
  
        let paymentDetails: any = {
          "collection_id": collectionId,
          "amount": priceInfo.price * 100,
          "email": this.player.email,
          "name": this.player.playerName,
          "mobile": this.player.phone,
          "description": "Payment for pricing "+priceInfo.id,
          "currency": 'MYR',
          "paid_by": this.player.userId,
          "player": {
            "player_id": this.player.playerId,
            // "competition_id": this.competition.competitionId
          },
          // "paid_for": {
          //   "player_id": this.player.playerId
          // },
          // "competition_id": this.competition.competitionId,
          "callback_url": 'http://devlet.mygolf2u.com/rest/payment/callback',
          "redirect_url": 'http://mtest.mygolf2u.com/test/payment_redirect.html',
          "bill_type": 'premium_feature_player',
          "bill_type_id": priceInfo.id
        }

  
        loader.present().then(() => {
            this.paymentService.createBill(_collectionId,paymentDetails)
            .subscribe((data:any)=>{
                loader.dismiss().then(()=> {
                    console.log("get billplz collections", data)
                    if(data) {
                    //   this.paidBillId = data.id
                    }
                    if(data.url) {
                        if (this.platform.is('cordova')) {
                            this.openWithInAppBrowser(data.url)
                        } else {
                            // this.openWithCordovaBrowser(data.url);
                            let win = window.open(data.url, '_system');
                            if(win) win.onunload = function () {
                                console.log("window unload")
                            }
                        }
                        
                    }
                    if(data) {
                    //   this.paidBillId = data.id;
      
                      console.log("before interval", this.paymentStatus)
                      let intervalId = setInterval(()=>{
                        console.log("interval : ", this.paymentStatus)
                        if(this.paymentStatus.toLowerCase() !== 'paid') this.getBill(data.id) //console.log("not paid") 
                        else clearInterval(intervalId);
                      }, 5000);
                      
                    }
                }, (error) => {
                  if (error) {
                    console.log("Error : ",error.json())  
                    let _error = error.json()
                    if(_error.status === "500" || _error.status === "404") {
                      console.log("Server unreachable")
                      MessageDisplayUtil.showMessageToast('Server Unreachable', 
                      this.platform, this.toastCtl,3000, "bottom")
                    } else if (_error.status === 500 || _error.status === 404) {
                      console.log("Server unreachable JSON")
                      MessageDisplayUtil.showMessageToast('Server Unreachable', 
                      this.platform, this.toastCtl,3000, "bottom")
                    }
                  }
                            })
                
            })
        })
        setTimeout(()=>{
            loader.dismiss().then(()=> {})
          },300000)
  
        
    }

    getBill(billId?: string) {
        console.log("calling getBill")
        this.paymentService.getBill(billId)
        .subscribe((data:any)=>{
            console.log("get local billplz bill", data)
            if(data.state.toLowerCase() === 'paid') {
            //   this.toggleRegister = true;
              this.paymentStatus = 'Paid'
            } else if(data.state.toLowerCase() === 'due') {
              this.paymentStatus = 'Due'
            //   this.toggleRegister = false;
            }  
            // else this.toggleRegister = false;
        })
    }


}
