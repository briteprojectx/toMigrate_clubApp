import {NavController, NavParams, ViewController, LoadingController} from "ionic-angular";
import {Component} from "@angular/core";
import { GameRoundInfo } from "../../../data/game-round";
import {CompetitionInfo  } from "../../../data/competition-data";
import { PlayerService } from "../../../providers/player-service/player-service";
import { Country } from "../../../data/country-location";
  

/*
 Generated class for the CompetitionDescriptionPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */

@Component({
    templateUrl: 'player-club-handicap.html',
    selector: 'player-club-handicap-page'
})
export class PlayerClubHandicap
{
    public competition: CompetitionInfo;
    public gameRound: GameRoundInfo;
    public headerName: string;
    public countryList: Array<Country>;
    

    constructor(public nav: NavController,
        private navParams: NavParams,
        private viewCtrl: ViewController,
        private playerService: PlayerService,
        private loadingCtl: LoadingController) {
        this.competition           = this.navParams.get("competition");
        this.gameRound = this.navParams.get("gameRound");
        this.headerName      = this.navParams.get("headerName");
    }

    close() {
        this.viewCtrl.dismiss();
    }

    ionViewDidLoad() {
        console.log("Game Round : ", this.gameRound)
        this.getCountry();
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
}
