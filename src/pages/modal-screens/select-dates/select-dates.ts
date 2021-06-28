import {
    NavController,
    NavParams,
    ViewController,
    LoadingController,
    ToastController,
    Platform
} from "ionic-angular";
import {
    Component
} from "@angular/core";
import {
    GameRoundInfo
} from "../../../data/game-round";
import {
    CompetitionInfo
} from "../../../data/competition-data";
import {
    PlayerService
} from "../../../providers/player-service/player-service";
import {
    Country
} from "../../../data/country-location";
import {
    TeeBox
} from "../../../data/tee-box";
import {
    TeeBoxInfo
} from "../../../data/club-course";

import * as moment from 'moment';
import { MessageDisplayUtil } from "../../../message-display-utils";

/*
 Generated class for the CompetitionDescriptionPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */

@Component({
    templateUrl: 'select-dates.html',
    selector: 'select-dates-page'
})
export class SelectDatesPage {
    public competition: CompetitionInfo;
    public gameRound: GameRoundInfo;
    public headerName: string;
    public countryList: Array < Country > ;
    public teeBox: Array < TeeBox > ;
    public teeBoxes: Array < TeeBoxInfo > ;

    startDate: any = moment(); //moment().format("YYYY-MMM-DD");
    endDate: any = moment(); //moment().format("YYYY-MMM-DD");
    fromTime: any = moment();
    toTime: any = moment();

    today: any = moment().format("YYYY-MM-DD");

    type: string = '';
    range: boolean = false;

    minuteRange = [0,5,10,15,20,25,30,35,40,45,50,55];


    constructor(public nav: NavController,
        private navParams: NavParams,
        private viewCtrl: ViewController,
        private playerService: PlayerService,
        private loadingCtl: LoadingController,
        private toastCtl: ToastController,
        private platform: Platform,) {
        this.competition = this.navParams.get("competition");
        this.gameRound = this.navParams.get("gameRound");
        this.headerName = this.navParams.get("headerName");
        this.teeBoxes = navParams.get("teeBoxes");
        // this.startDate = moment(this.prs.startTime,"HH:mm:ss").format("YYYY-MM-DDTHH:mmZ");
        // this.startDate = this.startDate.
        this.startDate = moment(this.startDate).format("YYYY-MMM-DD");
        this.endDate = moment(this.endDate).format("YYYY-MMM-DD");
        console.log("start date : ", this.startDate, "end date : ", this.endDate)
        this.type = navParams.get('type');
        if(this.type === 'times') {
            this.fromTime = navParams.get("fromTime");
            this.toTime = navParams.get("toTime");
        } else if (this.type === 'dates') {
            this.startDate = navParams.get("startDate");
            this.endDate = navParams.get("endDate");
        }
        this.range = navParams.get("range");


        // console.log("start date : ", moment(this.startDate).format("YYYY-MMM-DD"), "end date : ", this.endDate)
    }

    _range(start, stop, step) {
        var a = [start], b = start;
        while (b < stop) {
            a.push(b += step || 1);
        }
        return a;
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
                    if (error) {
                        loader.dismiss().then(() => {
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
        if (color === 'Blue') {
            return 'secondary'
        } else if (color === 'Red') {
            return 'danger'
        } else if (color === 'Black') {
            return 'dark'
        } else if (color === 'White') {
            return 'light'
        } else if (color === 'Gold') {
            return 'gold'
        }
    }

    onApplyClick() {
        if(this.type === 'times') {
            if(this.fromTime > this.toTime ) {
                MessageDisplayUtil.showMessageToast('Please select valid Time Range', 
                    this.platform, this.toastCtl, 3000, "bottom");
                    return false;
            }
        }
        console.log("apply click : ", this.fromTime, this.toTime, this.startDate, this.endDate)
        this.viewCtrl.dismiss({
            fromTime: this.fromTime,
            toTime: this.toTime,
            startDate: this.startDate,
            endDate: this.endDate
        });
    }

    validTime() {

    }
}