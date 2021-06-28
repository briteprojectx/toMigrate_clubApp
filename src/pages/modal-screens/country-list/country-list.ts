import {NavController, NavParams, ViewController, LoadingController} from "ionic-angular";
import {Component} from "@angular/core";
import { GameRoundInfo } from "../../../data/game-round";
import {CompetitionInfo  } from "../../../data/competition-data";
import { PlayerService } from "../../../providers/player-service/player-service";
import { Country } from "../../../data/country-location";
import { ExecFileOptionsWithStringEncoding } from "child_process";
  

/*
 Generated class for the CompetitionDescriptionPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */

@Component({
    templateUrl: 'country-list.html',
    selector: 'country-list-page'
})
export class CountryListPage
{
    public competition: CompetitionInfo;
    public gameRound: GameRoundInfo;
    public headerName: string;
    public countryList: Array<Country>;
    searchQuery: string;
    originalList: Array<Country>;
    excludeAll: boolean = false;
    

    constructor(public nav: NavController,
        private navParams: NavParams,
        private viewCtrl: ViewController,
        private playerService: PlayerService,
        private loadingCtl: LoadingController) {
        this.competition           = this.navParams.get("competition");
        this.gameRound = this.navParams.get("gameRound");
        this.headerName      = this.navParams.get("headerName");
        this.excludeAll = this.navParams.get("excludeAll")
    }

    close() {
        this.viewCtrl.dismiss(-999);
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
        if(country===null)
            this.viewCtrl.dismiss(-999);
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
                            this.originalList = data;
                            // console.log("Country List Sign Up : ", this.countryList)
                    })
                }), (error) => {
                    loader.dismiss();
                }, () => {
                    loader.dismiss();
                };
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

    onSearchInput(event) {
        console.log("search query ", this.searchQuery);
        console.log("country list ", this.countryList);
        this.countryList = this.originalList;
        
        if(this.searchQuery.length === 0) return false;
        let _country: Country;
        this.countryList = this.countryList.filter((country: Country)=>{
            // return country.name.toLowerCase().trim().includes(this.searchQuery.toLowerCase().trim())
                if(country.name.toLowerCase().trim().includes(this.searchQuery.toLowerCase().trim()))
                return 1
            else if(country.id.toLowerCase().trim().includes(this.searchQuery.toLowerCase().trim()))
                return 1
            // else if(country.sportCode.toLowerCase().trim().includes(this.searchQuery.toLowerCase().trim()))
            //     return 1
            else return 0
            
        })
    }

    onSearchCancel() {
        this.countryList = this.originalList
    }
}
