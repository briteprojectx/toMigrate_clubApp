import {NavController, NavParams, ViewController,Platform,ToastController} from "ionic-angular";
import {Component} from "@angular/core";
import { PlayerRoundScores } from "../../../data/handicap-history";
import {MessageDisplayUtil} from '../../../message-display-utils';

import * as moment from 'moment';
import { InAppBrowser, InAppBrowserOptions } from "@ionic-native/in-app-browser";

import { DomSanitizer } from "@angular/platform-browser";
import { HandicapIndexSubscription } from "../../../data/premium-subscription";

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
    templateUrl: 'test-payment.html',
    selector: 'test-payment-page'
})
export class TestPaymentPage
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

    constructor(public nav: NavController,
        private navParams: NavParams,
        private viewCtrl: ViewController,
        private toastCtl: ToastController,
        private platform: Platform,
        private iab: InAppBrowser) {
        this.title           = this.navParams.get("title");
        this.descriptionText = this.navParams.get("description");
        this.headerName      = this.navParams.get("headerName");
        this.idxSubs         = this.navParams.get("hcpIdxSubs")
        this.billUrl = this.navParams.get("url");
        // this.billUrl = this.billUrl+'&output=embed';
        if(this.billUrl) this.paying = true;

        console.log("hcp subs : ", this.idxSubs)

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


    createBill() {
        this.viewCtrl.dismiss({type: 'createBill', collectionId: this.collectionId});
    }

    getBill() {
        this.viewCtrl.dismiss({type: 'getBill', billdId: this.billId});
    }


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
}
