import { CaddySelectionCriteria, CaddyData, TeeTimeBookingOptions, TeeTimeBooking } from './../../../data/mygolf.data';
import {NavController, NavParams, ViewController} from "ionic-angular";
import {Component} from "@angular/core";
import { GameRoundInfo } from "../../../data/game-round";
import {CompetitionInfo  } from "../../../data/competition-data";
import { TeeTimeSlotDisplay, DisplayPrices, CurrencyData, TeeTimeBookingPlayer } from "../../../data/mygolf.data";
import { MessageDisplayUtil } from '../../../message-display-utils';
import { ToastController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
  

/*
 Generated class for the CompetitionDescriptionPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */

export interface BookingBuggy {
    buggySlot: number;
    driving: boolean;
    bookingPlayer ? : TeeTimeBookingPlayer;
    pairingNo: number;
    walking: boolean;
    totalPlayers: number;
    maxAllowed: number;
}
export interface BookingCaddy {
    caddySelectionCriteria ? : CaddySelectionCriteria;
    caddyPreferred ? : CaddyData;
    caddyAssigned ? : CaddyData;
    caddiePreferred?: number;
    caddieAssigned?: number;
    caddyRequired ? : boolean;
    caddyRequested ? : boolean;
    caddyPairing ? : number;
}

export interface CaddyPairing {
    caddySelectionCriteria ? : CaddySelectionCriteria;
    caddyPreferred ? : CaddyData;
    caddyAssigned ? : CaddyData;
    caddiePreferred?: number;
    caddieAssigned?: number;
    caddyRequired ? : boolean;
    caddyRequested ? : boolean;
    caddyPairing ? : number;
}

@Component({
    templateUrl: 'buggy-seating.html',
    selector: 'buggy-seating-page'
})
export class BuggySeatingPage
{
    public competition: CompetitionInfo;
    public gameRound: GameRoundInfo;
    public headerName: string;
    teeSlot: TeeTimeSlotDisplay;
    prices: DisplayPrices;
    currency: CurrencyData;
    buggies: Array<BookingBuggy>; //: Array<number>;// = [1,2,3,4]
    caddies: Array<BookingCaddy>;
    type: string = 'buggy'
    caddyPairing: Array<CaddyPairing> = new Array<CaddyPairing> ();
    bookingOptions: TeeTimeBookingOptions;
    slot: TeeTimeBooking;
    override: boolean = false;

    constructor(public nav: NavController,
        private navParams: NavParams,
        private viewCtrl: ViewController,
        private toastCtl: ToastController,
        private platform: Platform) {
        this.competition           = this.navParams.get("competition");
        this.gameRound = this.navParams.get("gameRound");
        this.headerName      = this.navParams.get("headerName");
        this.buggies = this.navParams.get("buggies")
        this.caddies = this.navParams.get("caddies")
        this.bookingOptions = this.navParams.get("bookingOptions")
        this.slot = this.navParams.get("slot")
        // console.log("Buggy seating : ", this.buggies);
        this.type = this.navParams.get('type');
        // console.log("type : ", this.type)
        if(this.type === 'caddy') this.caddyPairing = this.navParams.get("pairing");
        this.override = this.navParams.get('override');
        // console.log("caddy pairing who : ", this.caddyPairing);
        // console.log("Caddy pairing : ", this.caddies)
        // this.teeSlot = this.navParams.get("slot");
        // this.prices = this.teeSlot.displayPrices;
        // this.currency = this.teeSlot.currency;

    }

    close() {
        this.viewCtrl.dismiss({
            selected: false
        }); 
    }

    selectBuggy(buggy: BookingBuggy) {
        // if(buggy.totalPlayers >= buggy.maxAllowed) {
        //     MessageDisplayUtil.showMessageToast('Selected buggy has maxed allowed ('+buggy.maxAllowed+')', 
        //                       this.platform, this.toastCtl,3000, "bottom")
        //                       return false;
        // }
        this.viewCtrl.dismiss({
            selected: true,
            buggy: buggy
        })
    }
    selectCaddy(caddy: BookingCaddy) {
        this.viewCtrl.dismiss({
            selected: true,
            caddy: caddy
        })
    }

    ionViewDidLoad() {
        console.log("Game Round : ", this.gameRound)
    }

    getInnerHTML() {
        let description = "<p><span style='background-color:#00FFFF'>Tournaments, electronic scorecards, analysis and more&hellip; Look no further! myGolf2u is a single place where you can find and register for any </span>competitions in your region, your favourite clubs or in the entire country on your phone or in this site.</p>"
        return description;
    }

    clearCaddy(caddy: BookingCaddy) {
        caddy = {
            caddySelectionCriteria: null,
            caddyPreferred: null
        }
    }

    getBuggySlot(b: BookingBuggy, i: number, attribute?: string) {
        // console.log("get buggy slot - ",i," : ",b)
        switch(attribute) {
            case 'displayname':
                if(i === 0) return "Walking"; 
                else return 'Buggy #' + b.buggySlot;
            case 'currentplayers':
                return b.totalPlayers;
            case 'maxallowed':
                return b.maxAllowed;
            default:
                if(i === 0) return "Walking"; 
                else return 'Buggy #' + b.buggySlot;
        }
        
        // Buggy {{buggy.buggySlot}}
    }
    getCaddyPreferred(caddy: BookingCaddy, i: number) {
        // console.log("buggy seating selected caddy ", caddy)
        // console.log("buggy seating caddy pairing ", this.caddyPairing)
        let _caddySelectionCriteria:Array<CaddySelectionCriteria> = this.caddyPairing.filter((cp)=>{
            return cp.caddyPairing === caddy.caddyPairing && !cp.caddyPreferred
        }).map((cp)=>{
            return cp.caddySelectionCriteria
        })
        let _caddyPreferred:Array<CaddyData> = this.caddyPairing.filter((cp)=>{
            return cp.caddyPairing === caddy.caddyPairing && cp.caddyPreferred
        })
        .map((cp)=>{
            return cp.caddyPreferred
        })

        
        console.log("buggy seating caddy preferred outside - ",i+" : ", caddy);
        if(_caddyPreferred[0]&&_caddyPreferred[0].firstName) {
            // console.log("buggy seating caddy preferred - ",i+" : ", _caddyPreferred[0]);
            // console.log("buggy seating caddy preferred - ",i+" : ", _caddySelectionCriteria[0]);
        return _caddyPreferred[0].firstName
        }
        else if(_caddySelectionCriteria[0] && _caddySelectionCriteria[0].gender) {
            
            // console.log("buggy seating caddy selection - ",i+" : ", _caddyPreferred[0]);
            // console.log("buggy seating caddy selection - ",i+" : ", _caddySelectionCriteria[0]);
            return (_caddySelectionCriteria[0].gender==='F'?'Female':'Male') + ', Age btwn '+ _caddySelectionCriteria[0].minAge + ' and '+ _caddySelectionCriteria[0].maxAge
        
        }
            else return ''

    }
}
