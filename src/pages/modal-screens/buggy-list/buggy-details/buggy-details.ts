import {
    NavController,
    NavParams,
    ViewController,
    LoadingController,
    Platform,
    AlertController
} from "ionic-angular";
import {
    Component
} from "@angular/core";
import {
    GameRoundInfo
} from "../../../../data/game-round";
import {
    CompetitionInfo
} from "../../../../data/competition-data";
import {
    PlayerService
} from "../../../../providers/player-service/player-service";
import {
    Country
} from "../../../../data/country-location";
import {
    TeeBox
} from "../../../../data/tee-box";
import {
    TeeBoxInfo
} from "../../../../data/club-course";
import {
    PlayerInfo,
    PlayerList
} from "../../../../data/player-data";
import {
    Keyboard
} from '@ionic-native/keyboard';
import {
    MessageDisplayUtil
} from "../../../../message-display-utils";
import {
    BuggyData,
    BuggySchedule,
    Availabilities
} from "../../../../data/mygolf.data";
import {
    ClubFlightService
} from "../../../../providers/club-flight-service/club-flight-service";

import * as moment from 'moment';
import {
    ImageZoom
} from "../../image-zoom/image-zoom";
import {
    ModalController
} from "ionic-angular";
/*
 Generated class for the CompetitionDescriptionPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */

@Component({
    templateUrl: 'buggy-details.html',
    selector: 'buggy-details-page'
})
export class BuggyDetailsPage {
    public competition: CompetitionInfo;
    public gameRound: GameRoundInfo;
    public headerName: string;
    public countryList: Array < Country > ;
    public teeBox: Array < TeeBox > ;
    public teeBoxes: Array < TeeBoxInfo > ;
    public playerList: any;
    public searchBuggies: string;
    public players: Array < PlayerInfo > = [];
    public playersToExclude: Array < PlayerInfo > = [];
    public selectedPlayerId: number;
    searchAttempted: boolean = false;

    public buggyDetails: BuggyData;
    switchView: boolean = true;
    currentDate: string = null;

    buggySchedule: BuggySchedule;
    buggyAvl: Array < Availabilities > = [];


    refreshBuggyAvlDone: boolean = false;


    constructor(public nav: NavController,
        private navParams: NavParams,
        private viewCtrl: ViewController,
        private playerService: PlayerService,
        private loadingCtl: LoadingController,
        private platform: Platform,
        private keyboard: Keyboard,
        private flightService: ClubFlightService,
        private alertCtl: AlertController,
        private modalCtl: ModalController) {
        this.competition = this.navParams.get("competition");
        this.gameRound = this.navParams.get("gameRound");
        this.headerName = this.navParams.get("headerName");
        this.teeBoxes = navParams.get("teeBoxes");
        this.playerList = navParams.get("playerList");
        this.buggyDetails = navParams.get("buggy");
        this.currentDate = navParams.get("currentDate");

        console.log("Player List : ", this.playerList)
    }

    close() {
        if (this.platform.is('ios') && this.platform.is('cordova'))
            this.keyboard.close();

        this.viewCtrl.dismiss({
            selected: false
        });
    }

    ionViewDidLoad() {
        if (this.platform.is('ios') && this.platform.is('cordova'))
            this.keyboard.show();
        this.getBuggySchedule();
        // console.log("Game Round : ", this.gameRound)
        // this.getTeeBox();
    }

    getInnerHTML() {
        let description = "<p><span style='background-color:#00FFFF'>Tournaments, electronic scorecards, analysis and more&hellip; Look no further! myGolf2u is a single place where you can find and register for any </span>competitions in your region, your favourite clubs or in the entire country on your phone or in this site.</p>"
        return description;
    }

    countrySelected(country ? : any) {
        if (country == null)
            this.viewCtrl.dismiss();
        else this.viewCtrl.dismiss(country);
    }



    getCountry(cb ? ) {
        let loader = this.loadingCtl.create({
            content: "Getting Country List...",
            showBackdrop: false
        });
        loader.present().then(() => {
            this.playerService.getCountryList()
                .subscribe((data: Array < Country > ) => {
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
        if (flagUrl == null) return null;
        else {
            let flagIcon = flagUrl.split("/");
            return "img/flag/" + flagIcon[2];
        }
    }

    getTeeBox() {
        let loader = this.loadingCtl.create({
            content: "Getting Teebox List...",
            showBackdrop: false
        });
        loader.present().then(() => {
            this.playerService.getTeeBox()
                .subscribe((data: Array < TeeBox > ) => {
                    loader.dismiss().then(() => {
                        // console.log("Country Sign Up : ",data)
                        this.teeBox = data;
                        // console.log("Country List Sign Up : ", this.countryList)
                    })
                }, (error) => {
                    loader.dismiss().then(() => {
                        loader = null;
                    });
                }, () => {
                    loader.dismiss().then(() => {
                        loader = null;
                    });
                });
        })
    }

    onSelectPlayer(p: PlayerInfo) {
        if (this.platform.is('ios') && this.platform.is('cordova'))
            this.keyboard.close();
        if (p) {
            this.viewCtrl.dismiss({
                selected: true,
                player: p
            });
        } else {
            this.viewCtrl.dismiss({
                selected: false
            });
        }



    }

    getTeeColor(color: string) {
        if (color === 'Blue') {
            return 'secondary'
        } else if (color === 'Red') {
            return 'danger'
        } else if (color === 'Black') {
            return 'dark'
        } else if (color === 'White') {
            return 'light'
        }
    }
    displayAvailableDays(days: any) {
        let daysText = (days.MON ? "MON," : "") + (days.TUE ? "TUE," : "") + (days.WED ? "WED," : "") + (days.THU ? "THU," : "") + (days.FRI ? "FRI," : "") +
            (days.SAT ? "SAT," : "") + (days.SUN ? "SUN," : "");
        return daysText.slice(0, -1);
    }
    getFullStatus(status: string) {
        if (status === 'A') return 'Available'
        else if (status === 'N') return 'Not Available'
        else return ''
    }

    getTextDay(increment: number) {
        let _dayText: string;
        console.log("get text day - ", increment, ' : ', this.buggyAvl)
        if(this.refreshBuggyAvlDone && this.buggyAvl && this.buggyAvl[increment-1].availableOn)
        _dayText = moment(this.buggyAvl[increment-1].availableOn).add((increment-1), 'days').format('ddd');
        else _dayText = moment().add((increment-1), 'days').format('ddd');
        return _dayText; 

    }

    getEndDate(increment: number, today ? : boolean) {
        let _date: string;
        if (this.currentDate) {
            if (today) _date = moment(this.currentDate).add((increment - 1), 'days').format('DD MMM');
            else _date = moment(this.currentDate).add((increment - 1), 'days').format('DD MMM YYYY');
        } else {
            if (today) _date = moment().add((increment - 1), 'days').format('DD MMM');
            else _date = moment().add((increment - 1), 'days').format('DD MMM YYYY');
        }

        return _date;
    }

    getDateDetail(buggyAvl: Availabilities) {
        let _date: string;
        // _date = moment().add((increment-1), 'days').format('ddd, DD MMM YYYY');
        _date = moment(buggyAvl.availableOn).format("ddd, DD MMM YYYY")
        // let _working: string;
        // if(increment % 2 === 0) _working = 'Working';
        // else _working = 'Not working'
        let _avlText: string = '';
        if (buggyAvl.available) _avlText = 'Working';
        else _avlText = 'Not working';
        let _reason = buggyAvl.reason ? `<br>Reason : ` + buggyAvl.reason : '';
        let _message: string = _avlText + ` on <b>` + _date + `</b>` + _reason;
        let alert = this.alertCtl.create({
            title: 'Working Schedule',
            // subTitle: 'Selected date is '+ _date,
            message: _message, //'Selected date is ' + '<b>' + _date + '</b>',
            buttons: ['Close']
        });
        alert.present();
    }

    getBuggySchedule() {
        this.refreshBuggyAvlDone = false;
        let _today;
        let _next30;
        if (this.currentDate) {
            _today = moment(this.currentDate).format("YYYY-MM-DD");
            _next30 = moment(this.currentDate).add(29, 'days').format("YYYY-MM-DD");
        } else {
            _today = moment().format("YYYY-MM-DD");
            _next30 = moment().add(29, 'days').format("YYYY-MM-DD");
        }
        if (this.platform.is('ios') && this.platform.is('cordova'))
            this.keyboard.show();
        this.flightService.getBuggySchedule(this.buggyDetails.id, _today, _next30)
            .subscribe((buggyS: BuggySchedule) => {
                console.log("Caddy Schedule : ", buggyS);
                this.buggySchedule = buggyS
                this.buggyAvl = this.buggySchedule.availabilities;
                if(buggyS) this.refreshBuggyAvlDone = true;
            })
    }

    getDate(x: Availabilities) {
        return moment(x.availableOn).format("DD");


    }

    zoomImage(buggy: BuggyData) {
        let _buggy: BuggyData = buggy;

        let imageZoom = this.modalCtl.create(ImageZoom, {
            image: _buggy.buggyImage ? _buggy.buggyImage : ''
        })

        imageZoom.onDidDismiss((data: any) => {});
        imageZoom.present();
    }

}