import {NavController, NavParams, ViewController,Platform,ToastController} from "ionic-angular";
import {Component} from "@angular/core";
import { PlainScorecard, PlayerRoundScores } from "../../../../data/handicap-history";
import {MessageDisplayUtil} from '../../../../message-display-utils';

import * as moment from 'moment';
import { ClubFlightService } from "../../../../providers/club-flight-service/club-flight-service";
import { _createDefaultCookieXSRFStrategy } from "@angular/http/src/http_module";

/*
 Generated class for the CompetitionDescriptionPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */

@Component({
    templateUrl: 'caddy-unavailability.html',
    selector: 'caddy-unavailability-page'
})
export class CaddyUnavailabilityPage
{
    public title: string;
    public descriptionText: string;
    public headerName: string;

    myTime: any = moment();
    teeTime:  Date = new Date(); //string; //Date = new Date(); 
    prevTeeTime: Date; // = new Date();
    myTDate: string; //Date;// = new Date();
    prevTdate: string;

    currentDate: string;

    constructor(public nav: NavController,
        private navParams: NavParams,
        private viewCtrl: ViewController,
        private toastCtl: ToastController,
        private platform: Platform,
        private flightService: ClubFlightService) {
        this.title           = this.navParams.get("title");
        this.descriptionText = this.navParams.get("description");
        this.headerName      = this.navParams.get("headerName");

        // 2020-03-03T00:00:00
        // this.myDate = moment(this.scorecard.playedOn,)
        this.teeTime =  this.myTime;
            // "HH:mm A");
        //moment().set({'hour':13,'minute':12,'second':15});
        

        this.prevTeeTime = this.teeTime;
        this.prevTdate = this.myTDate;
        
        this.currentDate = navParams.get("currentDate");
        // this.myDate = moment(new Date()).format("YYYY-MM-DDTHH:mmZ");
        // this.teeTime = this.myDate;
        // this.myTDate= this.myDate;
    }

    ionViewDidLoad() {
        this.refreshCaddyUnavailability();
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

    
        this.viewCtrl.dismiss({scorecard: ''});

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

    validDate() {
    }

    refreshCaddyUnavailability() {
        let _caddyId;
        let _fromDate;
        let _toDate;
        let _unavailabilityId;
        this.flightService.getCaddyUnavailability(_caddyId,_fromDate,_toDate)
        .subscribe((data)=>{
            console.log("caddy unavailability : ", data)
        })
    }

    
    nextDate() {
        this.currentDate = moment(this.currentDate).add(1, 'days').format("YYYY-MM-DD"); 
    }

    prevDate() {
        this.currentDate = moment(this.currentDate).subtract(1, 'days').format("YYYY-MM-DD"); 
        console.log("current date : ", moment(this.currentDate))
    }


    confirmDate() {
        this.refreshCaddyUnavailability();
    }
}
