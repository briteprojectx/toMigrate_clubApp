import {NavController, NavParams, ViewController, LoadingController} from "ionic-angular";
import {Component} from "@angular/core";
import { GameRoundInfo } from "../../../data/game-round";
import {CompetitionInfo  } from "../../../data/competition-data";
import { PlayerService } from "../../../providers/player-service/player-service";
import { Country } from "../../../data/country-location";
import { TeeBox } from "../../../data/tee-box";
import { TeeBoxInfo } from "../../../data/club-course";
  

/*
 Generated class for the CompetitionDescriptionPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */

@Component({
    templateUrl: 'tee-box.html',
    selector: 'tee-box-page'
})
export class TeeBoxPage
{
    public competition: CompetitionInfo;
    public gameRound: GameRoundInfo;
    public headerName: string;
    public countryList: Array<Country>;
    public teeBox: Array<TeeBox>;
    public teeBoxes: Array<TeeBoxInfo>;
    

    constructor(public nav: NavController,
        private navParams: NavParams,
        private viewCtrl: ViewController,
        private playerService: PlayerService,
        private loadingCtl: LoadingController) {
        this.competition           = this.navParams.get("competition");
        this.gameRound = this.navParams.get("gameRound");
        this.headerName      = this.navParams.get("headerName");
        this.teeBoxes = navParams.get("teeBoxes");
    }

    close() {
        this.viewCtrl.dismiss();
    }

    ionViewDidLoad() {
        console.log("Game Round : ", this.gameRound)
        this.getTeeBox();
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
}
