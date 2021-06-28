import {NavController, NavParams, ViewController, LoadingController, Platform} from "ionic-angular";
import {Component} from "@angular/core";
import { GameRoundInfo } from "../../../data/game-round";
import {CompetitionInfo  } from "../../../data/competition-data";
import { PlayerService } from "../../../providers/player-service/player-service";
import { Country } from "../../../data/country-location";
import { TeeBox } from "../../../data/tee-box";
import { TeeBoxInfo } from "../../../data/club-course";
import { PlayerList } from "../../../data/player-data";
import {Keyboard} from '@ionic-native/keyboard';
import { MessageDisplayUtil } from "../../../message-display-utils";
import { PlayerData,PlayerInfo } from "../../../data/mygolf.data";
  

/*
 Generated class for the CompetitionDescriptionPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */

@Component({
    templateUrl: 'player-list.html',
    selector: 'player-list-page'
})
export class PlayerListPage
{
    public competition: CompetitionInfo;
    public gameRound: GameRoundInfo;
    public headerName: string;
    public countryList: Array<Country>;
    public teeBox: Array<TeeBox>;
    public teeBoxes: Array<TeeBoxInfo>;
    public playerList: any;
    public searchPlayers: string;
    public players: Array<PlayerInfo> = [];
    public playersToExclude: Array<PlayerInfo> = [];
    public selectedPlayerId: number;
    searchAttempted: boolean = false;

    forResultOnly: boolean = false;
    bookingPlayers: Array<PlayerData> = [];


    

    constructor(public nav: NavController,
        private navParams: NavParams,
        private viewCtrl: ViewController,
        private playerService: PlayerService,
        private loadingCtl: LoadingController,
        private platform: Platform,
        private keyboard: Keyboard) {
        this.competition           = this.navParams.get("competition");
        this.gameRound = this.navParams.get("gameRound");
        this.headerName      = this.navParams.get("headerName");
        this.teeBoxes = navParams.get("teeBoxes");
        this.playerList = navParams.get("playerList");

        this.forResultOnly = navParams.get("forResultOnly")
        if(this.forResultOnly) this.bookingPlayers = this.playerList;

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
        // console.log("Game Round : ", this.gameRound)
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

    onSearchInput() {
        if(this.searchPlayers) {
            this.searchAttempted = true;
            this._searchPlayer();
        } 
        else this.playerList = [];
        // this._clearAndRefresh(null);
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
                    loader.dismiss().then(()=> {
                        loader = null;
                    });
                }, () => {
                    loader.dismiss().then(() => {
                        loader = null;
                    });
                });
            })
    }

    onSelectPlayer(p: any) {
        if (this.platform.is('ios') && this.platform.is('cordova'))
        this.keyboard.close();
        if(p) {
            if(this.forResultOnly) {
                this.viewCtrl.dismiss({
                    selected: true,
                    player: p
                });
            } else {
                this.viewCtrl.dismiss({
                    selected: true,
                    player: p
                });
            }
            
        }
        else {
            this.viewCtrl.dismiss({
                selected: false
            });
        }



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
        }
    }

    private _searchPlayer() {
        this.playerService.searchPlayers(this.searchPlayers, true, 1)
                .subscribe((playerList: PlayerList) => {
                    console.log("[searchPlayer] ", playerList);
                    if (playerList && playerList.players) {
                        this.playerList = playerList;
                        this.players = playerList.players.filter(p => {
                            let excluded = this.playersToExclude.find((pe => {
                                return pe.playerId === p.playerId;
                            }));
                            return !excluded;
                        });

                        // let filter = this.modalCtl.create(PlayerListPage, {
                        //     playerList: playerList
                        // });
                        // // filter.onDidDismiss((apply: boolean) => {
                        // filter.onDidDismiss((data: any) => {
                        //     console.log("player list", data);
                        //     if (data.selected) {
                        //         if(data.player)
                        //             this.selectedPlayerId = data.player.playerId
                        //         console.log("player list", this.selectedPlayerId);

                        //     }
                        // })
                        // filter.present();

                    }
                }, (error) => {
                    console.log("error")
                    MessageDisplayUtil.getErrorMessage(error, error)
                }, () => {
                    console.log("complete?")
                });
    }

}
