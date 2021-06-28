import {NavController, NavParams, ViewController, LoadingController} from "ionic-angular";
import {Component} from "@angular/core";
import { GameRoundInfo } from "../../../data/game-round";
import {CompetitionInfo  } from "../../../data/competition-data";
import { PlayerService } from "../../../providers/player-service/player-service";
import { Country } from "../../../data/country-location";
import { TeeBox } from "../../../data/tee-box";
import { TeeBoxInfo } from "../../../data/club-course";
import { CaddieRating, TeeTimeBooking } from "../../../data/mygolf.data";
import { JsonService } from "../../../json-util";

import * as moment from 'moment';
import { ClubFlightService } from "../../../providers/club-flight-service/club-flight-service";
import { CaddyFlightDetailsPage } from "../../booking/caddy-flight-details/caddy-flight-details";
import { MessageDisplayUtil } from "../../../message-display-utils";
import { Platform } from "ionic-angular";
import { ToastController } from "ionic-angular";
  

/*
 Generated class for the CompetitionDescriptionPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */

@Component({
    templateUrl: 'ratings-list.html',
    selector: 'ratings-list-page'
})
export class RatingsListPage
{
    public competition: CompetitionInfo;
    public gameRound: GameRoundInfo;
    public headerName: string;
    public countryList: Array<Country>;
    public teeBox: Array<TeeBox>;
    public teeBoxes: Array<TeeBoxInfo>;
    public caddyRatings: Array<CaddieRating>;
    public ratingWho: string;
    public currentDate: string;
    public caddieId: number;
    public averageRating: number = 0;
    public overallRating: number = 0;
    

    constructor(public nav: NavController,
        private navParams: NavParams,
        private viewCtrl: ViewController,
        private playerService: PlayerService,
        private loadingCtl: LoadingController,
        private flightService: ClubFlightService,
        private platform: Platform,
        private toastCtl: ToastController) {
        this.competition           = this.navParams.get("competition");
        this.gameRound = this.navParams.get("gameRound");
        this.headerName      = this.navParams.get("headerName");
        this.teeBoxes = navParams.get("teeBoxes");
        this.headerName = navParams.get("header");
        this.ratingWho = navParams.get("ratingWho");
        if(this.ratingWho.toLowerCase() === 'caddie') this.caddyRatings = navParams.get("ratings");
        if(this.caddyRatings && this.caddyRatings.length > 0) {
            this.caddyRatings.forEach((rating: CaddieRating)=>{
                JsonService.deriveFulImageURL(rating.player, "image");
                JsonService.deriveFulImageURL(rating.player, "profile");
            });
            let _avgRating;
                this.caddyRatings = this.caddyRatings.sort((a: CaddieRating, b: CaddieRating)=>{
                    if(a.ratedOn < b.ratedOn) return 1
                    else if(a.ratedOn > b.ratedOn) return -1
                    else return 0
                })
            _avgRating = this.caddyRatings
            .map((caddieRating: CaddieRating)=>{
                return caddieRating.rating
            })
            .reduce((a: number, b: number)=>{
                return a + b
            },0);

            this.averageRating = _avgRating / (this.caddyRatings.length)
        }
        this.currentDate = moment().format("YYYY-MM-DD");
        this.caddieId = navParams.get('caddieId');
        this.overallRating = navParams.get("overallRating");
    }

    close() {
        this.viewCtrl.dismiss();
    }

    ionViewDidLoad() {
        console.log("Game Round : ", this.gameRound)
        // this.getTeeBox();
    }

    getInnerHTML() {
        let description = "<p><span style='background-color:#00FFFF'>Tournaments, electronic scorecards, analysis and more&hellip; Look no further! myGolf2u is a single place where you can find and register for any </span>competitions in your region, your favourite clubs or in the entire country on your phone or in this site.</p>"
        return description;
    }

    countrySelected(country?: any) {
        if(country==null)
            this.viewCtrl.dismiss();
        else this.viewCtrl.dismiss(country);
    }

        
    getCountry(cb?) {
        let loader = this.loadingCtl.create({
            content     : "Getting Country List...",
            showBackdrop: false
        });
        loader.present().then(() => {
                this.playerService.getCountryList()
                .subscribe((data: Array<Country>) => {
                    loader.dismiss().then(() => {
                            // console.log("Country Sign Up : ",data)
                            this.countryList = data;
                            // console.log("Country List Sign Up : ", this.countryList)
                    })
                });
            })
            
        

        // setTimeout(()=>{
        //     console.log("Get country calling back");
        //     cb();
            
        // }, 0)
    }

    getFlagUrl(flagUrl: string) {
        if (flagUrl==null) return null;
        else {
            let flagIcon = flagUrl.split("/");
            return "img/flag/"+flagIcon[2];
        }
    }

    getTeeBox() {
        let loader = this.loadingCtl.create({
            content     : "Getting Teebox List...",
            showBackdrop: false
        });
        loader.present().then(() => {
                this.playerService.getTeeBox()
                .subscribe((data: Array<TeeBox>) => {
                    loader.dismiss().then(() => {
                            // console.log("Country Sign Up : ",data)
                            this.teeBox = data;
                            // console.log("Country List Sign Up : ", this.countryList)
                    })
                }, (error) => {
                    if(error) {
                        loader.dismiss().then(()=> {
                            loader = null;
                        });
                    }
                    
                }, () => {
                    // loader.dismiss().then(() => {
                    //     loader = null;
                    // });
                });
            })
    }

    onSelectTeebox(t: TeeBox) {
        this.viewCtrl.dismiss(t);
    }
    
    getTeeColor(color: string) { 
        if(color === 'Blue') {
            return 'secondary'
        } else if(color === 'Red') {
            return 'danger'
        } else if(color === 'Black') {
            return 'dark'
        } else if(color === 'White') {
            return 'light'
        } else if(color === 'Gold') {
            return 'gold'
        }
    }

    getDate(date: string) {
        let _date = date;
        return moment(_date).format('ddd, D MMM YYYY') //.format('YYYY-MM-DD')
    }

    nextDate() {
        this.currentDate = moment(this.currentDate).add(1, 'month').format("YYYY-MM-DD");
        // this.getMasterFlightList();
    }

    prevDate() {
        this.currentDate = moment(this.currentDate).subtract(1, 'month').format("YYYY-MM-DD");
        // this.getMasterFlightList();
    }

    confirmDate() {
        this.getRatingList();
    }

    getRatingList() {
        let _caddieId = this.caddieId;
        let _fromDate = moment(this.currentDate).startOf('month').format('YYYY-MM-DD');
        let _toDate = moment(this.currentDate).endOf('month').format('YYYY-MM-DD');
        this.flightService.getCaddyRatings(_caddieId, _fromDate, _toDate)
                                        .subscribe((data: Array<CaddieRating>)=>{
                                            let _avgRating;
                                            if(data) {
                                                data.forEach((caddieRating: CaddieRating)=>{
                                                    JsonService.deriveFulImageURL(caddieRating.player,"profile");
                                                    JsonService.deriveFulImageURL(caddieRating.player,"image");
                                                })
                                                this.caddyRatings = data.sort((a: CaddieRating, b: CaddieRating)=>{
                                                    if(a.ratedOn < b.ratedOn) return 1
                                                    else if(a.ratedOn > b.ratedOn) return -1
                                                    else return 0
                                                })
                                            _avgRating = this.caddyRatings
                                            .map((caddieRating: CaddieRating)=>{
                                                return caddieRating.rating
                                            })
                                            .reduce((a: number, b: number)=>{
                                                return a + b
                                            },0);

                                            this.averageRating = _avgRating / (this.caddyRatings.length)
                                            if(!this.averageRating || Number.isNaN(this.averageRating))
                                                this.averageRating = 0;
                                        }
                                        })
    }

    refresh() {
        this.getRatingList();
    }

    getRatingComment(rating: CaddieRating) {
        let _comment = rating?rating.review:null;
        // _comment = _comment.replace(/["]+/g, '');
        _comment = _comment.replace(/^"(.+(?="$))"$/, '$1');
        return rating&&rating.review?_comment:'-';
    }

    goToBookingDetails(rating: CaddieRating) {
        if(rating && rating.assignment && rating.assignment.timeBooking) {
            let b = rating.assignment.timeBooking;
            this.nav.push(CaddyFlightDetailsPage, {
                teeSlotNew: false,
                teeTimeSlotDisplay: b.slotAssigned,
                bookingSlot: b,
                clubInfo: b.clubData
            });
        } else {
            MessageDisplayUtil.showMessageToast('There is no booking for selected rating', 
            this.platform, this.toastCtl,3000, "bottom")
            return false;
        }

    }
}
