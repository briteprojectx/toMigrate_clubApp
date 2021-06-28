import {
    Events, LoadingController, ModalController, NavController, NavParams, Platform,
    ToastController, Loading
} from 'ionic-angular';
import {Component, Renderer} from '@angular/core';
import {Keyboard} from '@ionic-native/keyboard';
import * as MyGolfEvents from '../../mygolf-events';
// import {PlainScorecard, ScorecardList} from '../../data/scorecard';
import {ScorecardService} from '../../providers/scorecard-service/scorecard-service';
import {ScorecardFilterPage} from '../scorecard-filter/scorecard-filter';
import {ScorecardDisplayPage} from '../scorecard-display/scorecard-display';
import {adjustViewZIndex} from '../../globals';
import {MessageDisplayUtil} from '../../message-display-utils';
import {PlayerInfo, PlayerList} from '../../data/player-data';
import { SearchCriteria } from '../../data/search-criteria';
import { CompetitionService } from '../../providers/competition-service/competition-service';
import { PlayerService } from '../../providers/player-service/player-service';
import { Country } from '../../data/country-location';
import { HandicapHistoryDetailsPage } from '../handicap-history-details/handicap-history-details';
import { HandicapRound } from '../../data/handicap-history';
import { HandicapService } from '../../providers/handicap-service/handicap-service';
import { PlayerListPage } from '../modal-screens/player-list/player-list';
import { isPresent } from 'ionic-angular/util/util';
import {Observable} from 'rxjs/Observable';
import { HandicapIndexSubscription } from '../../data/premium-subscription';
import { AlertController } from 'ionic-angular';
import { PlayerHomeActions } from '../../redux/player-home';
import { ActionSheetController } from 'ionic-angular';
import { HandicapSystem, HandicapCalculation,  ClubHandicap, HandicapGameRound, PlainScoreCard, ScorecardList } from '../../data/mygolf.data';
import { ClubFlightService } from '../../providers/club-flight-service/club-flight-service';

/**
 * The competition list page class. This class lists the competitions. There are
 * three types of listing
 * <ul>
 *    <li>Upcoming</li>
 *    <li>All Competitions</li>
 *    <li>Search competitions</li>
 *  </ul>
 *  This class extends Subscriber which is passed as parameter for Remote Http method so that
 *  results are processed
 */
@Component({
    templateUrl: 'handicap-history.html',
    selector   : 'handicap-history-page'
})
export class HandicapHistoryPage
{
    scorecardList: ScorecardList;
    searchQuery: string = "";
    refreshAttempted: boolean = false;
    currentPlayer: PlayerInfo;
    searchCriteria: SearchCriteria;
    selectedCountry: Country;
    handicapHistory: HandicapCalculation;
    gameRounds: Array<HandicapGameRound>;
    clubHandicap: Array<ClubHandicap>;
    fromMenu: string = '';
    searchPlayers: string = "";
    players: Array<PlayerInfo> = [];
    playersToExclude: Array<PlayerInfo> = [];
    selectedPlayerId: number;
    player: PlayerInfo;
    player$: Observable<PlayerInfo>;
    dtLength: number = 0;
    loader: any;
    hcpIdxSubs: HandicapIndexSubscription;
    subsActive: boolean = true;
    playerSubs: boolean;

    handicapSystem: Array<HandicapSystem>;

    seeMore: boolean = false;
    viewHcpSystem: HandicapSystem;
    otherPlayer: boolean = false;
    otherPlayerId: number;


    constructor(private nav: NavController,
        private navParams: NavParams,
        private keyboard: Keyboard,
        private loadingCtl: LoadingController,
        private modalCtl: ModalController,
        private toastCtl: ToastController,
        private scorecardService: ScorecardService,
        private events: Events,
        private platform: Platform,
        private playerService: PlayerService,
        private handicapService: HandicapService,
        private alertCtl: AlertController,
        private playerHomeActions: PlayerHomeActions,
        private actionSheetCtl: ActionSheetController,
        private flightService: ClubFlightService) {
        this.currentPlayer = navParams.get("currentPlayer");
        this.fromMenu = navParams.get("fromMenu");
        this.player$ = navParams.get("player");
        this.subsActive = navParams.get("subsActive");
        this._initItems();
        
        
        console.log("nav params :",navParams.get("currentPlayer"));
        console.log("nav params :",navParams.get("fromMenu"));
        console.log("nav params :",navParams.get("player"));
        console.log("nav params :",navParams.get("subsActive"));

        this.searchCriteria = this.scorecardService.getSearchCriteria();
        console.log("Scorecard searchCriteria : ", this.searchCriteria)

        // this.viewHcpSystem = this.currentPlayer.defaultHandicapSystem

    }

    ionViewDidLoad() {
        // this.doRefresh();
        this.refreshHandicapSystem();
        setTimeout(()=>{
            // this.getHcpIdxSubscription();
            // this._clearAndRefresh(null);
            console.log("player friend", this.player )
            console.log("from menu ", this.fromMenu)
            if(this.fromMenu === 'menu') this.playerSubs = true;
                // this.playerSubs = this.subsActive;
            if(this.fromMenu ==='friend') {
                if(this.player$) {
                    let _playerId;
                    this.player$.take(1)
                    .map((player: PlayerInfo) => player.playerId)
                    .subscribe((playerId) => {
                        this.getPlayerHcpList(playerId);
                    });
                    this.subsActive = true;
                }
            }
            else {
                // this.getHcpIdxSubscription();
                this.subsActive = true;
                if(this.subsActive)  {
                    // this.getPlayerHcpList();
                    let _waitHcpSystem = setInterval(()=>{
                        if(this.handicapSystem && this.handicapSystem.length > 0) {
                            clearInterval(_waitHcpSystem);
                            this.getPlayerHcpList()
                        }
                    },500)
                }
            }

        }, 1000)
        

    }

    ionViewDidEnter() {
    }

    getHcpIdxSubscription() {
        console.log("Player : ",this.player$)
        this.playerService.getHcpIdxSubs()
                .subscribe((data: any) => {
                    // if (data.length > 0) {
                        // let hIS = data[0];
                        // let resp = data.data;

                    // }
                        // console.log("hcp idx subs in resp : ", resp)
                        console.log("hcp idx subs in data : ", data)
                        console.log("hcp idx subs in : ", this.hcpIdxSubs)
                        console.log("hcp idx subs in : ", data.status,data.ok,data.statusText)
                        if(!data.ok) {
                            console.log("error reaching server")
                            return
                        } else if (data.ok && data.data.length > 0) {
                            this.hcpIdxSubs = data.data;
                            this.getPlayerHcpList();
                        }
                }, (error) => {
                    console.log("hcp idx subs error ", error)
                });
                console.log("hcp idx subs out : ", this.hcpIdxSubs)
    }

    getPlayerHcpList(playerId?: number, handicapSystem?: string) {
        // HandicapSystem
        this.refreshAttempted = false;
        
        console.log("getplayerhcp list - playerId ", playerId)
        if(this.otherPlayer) this.otherPlayerId = playerId;
        console.log("getplayerhcp list - player$ ", this.player$)
        console.log("getplayerhcp list - currentPlayer ", this.currentPlayer) 
        console.log("viewing hcp system - : ", this.viewHcpSystem, handicapSystem)
        let selPlayerId: number;
        let _playerDefHcpSystem;
        this.handicapHistory = null;
        if(isPresent(playerId)) {
            selPlayerId = playerId;
            console.log("this player - playerId present", playerId, this.player$, this.currentPlayer, " - ", this.viewHcpSystem)
        }
        else if(!isPresent(playerId) && this.currentPlayer) {
            console.log("this player - currentPlayer", playerId, this.player$, this.currentPlayer, " - ", this.viewHcpSystem)

            selPlayerId = this.currentPlayer.playerId
            if(!this.viewHcpSystem) _playerDefHcpSystem = this.currentPlayer.defaultHandicapSystem;
            else {
                _playerDefHcpSystem = this.currentPlayer.defaultHandicapSystem;
                this.handicapSystem.filter((hcpSys)=>{
                    return hcpSys.id === this.currentPlayer.defaultHandicapSystem;
                }).map((hcpSys)=>{
                    this.viewHcpSystem = hcpSys
                })
            }
            // this.player$.take(1)
            // .subscribe(player => {
            //     selPlayerId = player.playerId
            // });
            // this.player$.take(1)
            // .map((player: PlayerInfo) => player.playerId)
            // .subscribe((playerId) => {
            //     selPlayerId = playerId
            // });
        } else if(!isPresent(playerId) && this.player$) {
            this.player$.take(1)
            .map((player: PlayerInfo) => player)
            .subscribe((player) => {
                console.log("this player - player$", playerId, this.player$, this.currentPlayer, player, " - ", this.viewHcpSystem)
                selPlayerId = player.playerId;
                if(!this.viewHcpSystem) _playerDefHcpSystem = player.defaultHandicapSystem;
                else {
                    _playerDefHcpSystem = player.defaultHandicapSystem
                    this.handicapSystem.filter((hcpSys)=>{
                        return hcpSys.id === this.currentPlayer.defaultHandicapSystem;
                    }).map((hcpSys)=>{
                        this.viewHcpSystem = hcpSys
                    })
                }
            });
        }
        console.log("getplayerhcp list - selPlayerId ", selPlayerId) 
        console.log("getplayerhcp list - selPlayerId ", this.loader) 

        let loader = null;
        let _hcpSysName = '';
        if(this.viewHcpSystem) _hcpSysName = this.viewHcpSystem.name
        if(!this.loader || this.loader === null) {
            loader = this.loadingCtl.create({
                // content     : "Getting MG2U handicap...",
                content     : "Getting handicap...",
                // " + _hcpSysName + "
                showBackdrop: false
            });
        } 
        else loader = this.loader;
        console.log("getplayerhcp list - selPlayerId ", this.loader, loader) 

        this.dtLength = 0;
        let _hcpSystem: HandicapSystem = {};
        if(handicapSystem) _hcpSystem.id = handicapSystem;
        else if(this.viewHcpSystem && !handicapSystem) _hcpSystem = this.viewHcpSystem;
        // else if(!this.viewHcpSystem  && !handicapSystem) {
        //     console.log("view hcp system : ", this.viewHcpSystem)
        //     if(_playerDefHcpSystem && (!this.viewHcpSystem && !handicapSystem)) {
        //         _hcpSystem.id = _playerDefHcpSystem
        //         // if(this.handicapSystem)
        //         // this.handicapSystem.filter((hcpSys)=>{
        //         //     return hcpSys.id === _playerDefHcpSystem
        //         // }).map((hcpSys)=>{
        //         //     this.viewHcpSystem = hcpSys;
        //         // })
        //     }
        //     // if(this.handicapSystem)
        //     // this.handicapSystem.filter((hcpSys)=>{
        //     //     if(hcpSys.id === _playerDefHcpSystem)
        //     //         return true;
        //     //     else return false;
        //     // }).map((hcpSys)=>{
        //     //     _hcpSystem = hcpSys;
        //     // })
        // }

        loader.present().then(()=>{
            this.handicapService.getHandicapHistory(selPlayerId)
            .subscribe((data: Array<HandicapCalculation>) => {
                console.log("Handicap Calc - ",this.viewHcpSystem,": ",data)
                    if(data.length > 0) {
                        this.dtLength = data.length;
                        
                        // this.refreshAttempted = true;
                        if(_hcpSystem && data.length > 1)
                        data = data.filter((hcpCalc: HandicapCalculation)=>{
                            return hcpCalc.handicapSystem === _hcpSystem.id;
                        });
                        else if(_hcpSystem && data.length === 1) {
                            data = data.filter((hcpCalc: HandicapCalculation)=>{
                                let _hcpSys: HandicapSystem;
                                _hcpSys = this.handicapSystem.find((hcpSys)=>{
                                    return hcpSys === hcpCalc.handicapSystem
                                })
                                if(_hcpSys && _hcpSys.derivedByMygolf) return true
                                else return false
                            });
                        }

                        if(!this.viewHcpSystem || !handicapSystem) {
                            // this.handicapSystem
                            this.handicapSystem.filter((hcpSys)=>{
                                return hcpSys.id === _playerDefHcpSystem
                            }).map((hcpSys)=>{
                                this.viewHcpSystem = hcpSys
                            })
                        }
                        this.handicapHistory = data[0];
                        if(this.handicapHistory && this.handicapHistory.gameRounds) {
                            
                            this.gameRounds = this.handicapHistory.gameRounds;
                            this.gameRounds.sort((a, b)=>{
                                if(a.roundDate < b.roundDate)
                                    return 1;
                                else if(a.roundDate > b.roundDate)
                                    return -1;
                                else return 0;
                            });
                            console.log("[Hcp History] Handicap here : ",this.handicapHistory)
                        }
                        console.log("[Hcp History] Game Rounds here: ",this.handicapHistory, this.dtLength)
                    }
                    else {
                        this.dtLength = 0;
                        this.gameRounds = null;
                        this.handicapHistory = null;
                        console.log("[Hcp History] Handicap here - no data : ", data)
                        console.log("[Hcp History] Game Rounds here - no data : ",this.gameRounds)
                    }
                    if(loader)
                loader.dismiss().then(()=>{
                    // let gameRounds: any;
                    
                    this.refreshAttempted = true;
                    console.log("[Hcp History] Handicap here - no data : ", this.gameRounds, this.dtLength)
                    console.log("[Hcp History] Game Rounds here - no data : ", this.refreshAttempted, this.handicapHistory)
                })
            }, (error) => {
                if(error && loader) loader.dismiss().then(()=>{
                    this.refreshAttempted = true;
                    let errorMsg;
                    let msg1 = MessageDisplayUtil.getErrorMessage(error,"Error reaching server");
                    if(error && !error.ok) {
                        errorMsg = "Error reaching server"
                    MessageDisplayUtil.showErrorToast(errorMsg,this.platform,this.toastCtl,5000,'bottom')
                    }
                    // let msg2 = MessageDisplayUtil.getError(error,this);

                    console.log("errors 1", msg1)
                    console.log("errors 2", error)
                })
            }, () => {
                    this.refreshAttempted = true;
                // if(loader) loader.dismiss().then(()=>{})
                // console.log("[Hcp History] Complete ")
            })
        })
        
    }

    /**
     * Executed when refresh button on toolbar is clicked
     */
    onRefreshClick(refresher) {
        this.refreshAttempted = false;
        // // this.subsActive = false;
        // if(this.playerSubs) this.subsActive = this.playerSubs;
        this.playerSubs = true;
        this.subsActive = true;
        console.log("subsActive", this.subsActive);
        console.log("playersubs", this.playerSubs);
        this.otherPlayer = false;
        this.otherPlayerId = null;
        this.selectedPlayerId = null;
        console.log("refresh click : ", this.currentPlayer, this.otherPlayer, this.otherPlayerId, this.playerSubs, this.subsActive)
        if(this.playerSubs || this.subsActive)
            this._clearAndRefresh(refresher);
        // this.doRefresh();
    }

    refreshHandicapSystemPromise() {
        return new Promise((resolve, reject)=>{
        let _player: PlayerInfo;
        let _playerId;
        if(this.currentPlayer) {
            _player = this.currentPlayer;
        }
        
        console.log("refresh hcp - this.player", this.player$, _player, this.fromMenu, this.viewHcpSystem)
        console.log("refresh hcp - this.currentPlayer",this.currentPlayer, _player, this.fromMenu, this.viewHcpSystem)
        this.handicapSystem = [];
        this.flightService.getHandicapSystemList()
        .subscribe((handicap: Array<HandicapSystem>)=>{
            // Array<HandicapSystem>
            if(handicap && handicap.length > 0) {
                this.handicapSystem = handicap;
                handicap.filter((hcp: HandicapSystem)=>{
                    if(this.currentPlayer && _player && hcp.id ===  _player.defaultHandicapSystem )
                        return true;
                        // this.viewHcpSystem = hcp
                    // else if(!this.currentPlayer && _player && hcp.id === _player.defaultHandicapSystem)
                    // // && this.fromMenu 
                    //     // this.viewHcpSystem = hcp
                    //     return true
                    else if((_player && !_player.defaultHandicapSystem) || !_player) {
                        if(hcp.defaultSystem) 
                            return true
                            
                        // hcp.id.toLowerCase().includes('whs') || 
                            // this.viewHcpSystem = hcp
                    }
                }).map((hcp: HandicapSystem)=>{
                    this.viewHcpSystem = hcp
                })
               console.log("refresh hcp - viewHcpSystem", this.viewHcpSystem)
               resolve('handicap system done load : ' + this.handicapSystem)
            } else reject('no handicap system load : ' + handicap)
        })
        })
    }
    refreshPlayerHcpListPromise(handicapSystem) {
        return new Promise((resolve, reject)=>{
            this.getPlayerHcpList();
            resolve("done getting player hcp list")
        })
    }

    async doRefresh() {
        const handicapSystem = this.refreshHandicapSystemPromise()
        console.log("getting handicap system : ", handicapSystem, this.handicapSystem)
        const refreshPlayerHcpList = this.refreshPlayerHcpListPromise(handicapSystem)
        console.log("refreshed list ", refreshPlayerHcpList)
    }

    onSearchInput() {
        if(this.searchPlayers) {
            this._searchPlayer();
        } else this._clearAndRefresh(null);
        // this._clearAndRefresh(null);
    }

    onHomeClick() {
        this.nav.popToRoot();//this.nav.setRoot(PlayerHomePage);
    }

    onScorecardClick(event, item: PlainScoreCard) {
        //Need to get the full scorecard or not
        let loader = this.loadingCtl.create({
            content     : "Getting scorecard...",
            showBackdrop: false
        });
        loader.present().then(() => {
            this.scorecardService.getScorecard(item.gameRoundId)
                .subscribe((scorecard: PlainScoreCard) => {
                    loader.dismiss().then(() => {
                        if (scorecard) {
                            this.scorecardList.scorecards.forEach((sc, idx) => {
                                if (sc.gameRoundId === scorecard.gameRoundId) {
                                    this.scorecardList.scorecards[idx] = scorecard;
                                }
                            });
                            this.nav.push(ScorecardDisplayPage, {
                                scorecard: scorecard,
                                currentPlayer: this.currentPlayer,
                                editing  : true
                            });
                        }

                    });
                }, (error) => {
                    loader.dismiss().then(() => {
                        let msg = MessageDisplayUtil.getErrorMessage(error, "Error getting scorecard list");
                        MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl, 5000, "bottom");
                    });
                }, () => {

                });

        });

    }

    doInfinite(infinite) {

        if (this.isMore()) {
            this._refresh(null, infinite);
        }
        else {
            infinite.complete();
            // infinite.enable(false);
        }

    }

    /**
     * Called when you change the segment button
     * @param event
     */
    onListTypeChange(event) {
        this._clearAndRefresh(null);
    }

    public isMore() {
        return this.scorecardList.totalPages > 0
            && this.scorecardList.currentPage < this.scorecardList.totalPages;
    }

    /**
     * This will clear the current competition list and
     * reloads from the server
     * @private
     */
    private _clearAndRefresh(refresher) {
        this._initItems();
        // this._getCountryList();
        // this.loader = this.loadingCtl.create({
        //     content     : "Getting your handicap...",
        //     showBackdrop: false
        // });
        this.getPlayerHcpList();
        // this._refresh(refresher, null);
    }

    private _refresh(refresher, infinite) {
      this.refreshAttempted = false;

        let loader = this.loadingCtl.create({
            showBackdrop: false,
            content     : "Loading MG2U history..."
        });
        loader.present().then(() => {
            this.handicapService.getHandicapHistory().subscribe((data: Array<HandicapCalculation>) => {
                // let gameRounds: any;
                console.log("Handicap Calc : ",data)
                this.handicapHistory = data[0];
                loader.dismiss().then(() => {
        
                              if(this.handicapHistory.gameRounds) {
                    
                                this.gameRounds = this.handicapHistory.gameRounds;
                                this.gameRounds.sort((a, b)=>{
                                    if(a.roundDate < b.roundDate)
                                        return 1;
                                    else if(a.roundDate > b.roundDate)
                                        return -1;
                                    else return 0;
                                });
                            }
                            });

                            console.log("Handicap data : ",data)
                console.log("Handicap here : ",this.handicapHistory)
            }, (error) => {
                loader.dismiss().then(() => {
                    console.log("handicap error here :",error)
                                let msg = MessageDisplayUtil.getErrorMessage(error, "Error listing handicap history");
                                MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl, 5000, "bottom");
                            });
            }, () => {
                this.refreshAttempted = true;

                if (refresher) refresher.complete();
                    if (infinite) {
                        infinite.complete();
                    }
            })
            // this.scorecardService.searchScorecard(this.searchQuery, this.scorecardList.currentPage + 1)
            //     .subscribe((data: ScorecardList) => {
            //         loader.dismiss().then(() => {
            //           this.refreshAttempted = true;

            //             if (data.totalPages > 0)
            //                 this.scorecardList.currentPage++;

            //             this.scorecardList.totalItems  = data.totalItems;
            //             this.scorecardList.totalPages  = data.totalPages;
            //             this.scorecardList.totalInPage = data.totalInPage;
            //             this.scorecardList.scorecards.push(...data.scorecards);
            //         });
            //     }, (error) => {
            //         loader.dismiss().then(() => {
            //             let msg = MessageDisplayUtil.getErrorMessage(error, "Error listing scorecards");
            //             MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl, 5000, "bottom");
            //         });
            //     }, () => {
            //         if (refresher) refresher.complete();
            //         if (infinite) {
            //             infinite.complete();
            //         }
            //         if (this.platform.is('ios') && this.platform.is('cordova'))
            //             this.keyboard.close();

            //     });
        });

    }

    private _initItems() {
        this.scorecardList = {
            success    : true,
            totalPages : 0,
            currentPage: 0,
            totalItems : 0,
            totalInPage: 0,
            scorecards : []
        };
    }

    onMenuFilterClick() {
        let filter = this.modalCtl.create(ScorecardFilterPage);
        // filter.onDidDismiss((apply: boolean) => {
        filter.onDidDismiss((data: any) => {
            if (data.apply) {
                this._clearAndRefresh(null);
                // this.handicapHistory = new HandicapCalculation();
                this.searchCriteria = data.searchCriteria;
            }
            if(this.searchCriteria.countryId === null || this.searchCriteria.countryId === '') {
                this.selectedCountry = null
                // console.log("[searchCriteria] clearing selected country")
            }
            // console.log("Filter dismiss : ", data.searchCriteria)
        })
        // this.nav.push(ScorecardFilterPage);
        if (this.platform.is('ios') && this.platform.is('cordova'))
            this.keyboard.close();
        filter.present();
    }

    private _getCountryList() {
        this.playerService.getCountryList()
            .subscribe((data: Array < Country > ) => {
                let countryList = data;
                if (this.searchCriteria.countryId) {
                    this.selectedCountry = countryList.filter((c: Country, idx: number) => {
                        return c.id == this.searchCriteria.countryId
                    }).pop();
                }
            });

    }

    goHistoryDetails(gameRound: HandicapGameRound) {
        this.nav.push(HandicapHistoryDetailsPage, {
            gameRound: gameRound
            // currentPlayer: this.currentPlayer,
            // editing  : true
        });
    }

    getFrontBack(round: HandicapGameRound,adjusted: boolean = false) {
        let first: number = 0;
        let second: number = 0;
        round.scores.forEach(a => {
            if(a.holeNo<=9) {
                if(!adjusted) first += a.grossScore
                    else first += a.adjustedScore
            } 
            else if(a.holeNo>9) {
                if(!adjusted) second += a.grossScore
                    else second += a.adjustedScore
            }
        });

        return first + " | " + second
        // round.scores.reduce((a,b) => )
    }

    onClubHandicap() {
        this.handicapService.getClubHandicap(62).subscribe((data: Array<ClubHandicap>) => {
            // let gameRounds: any;
            console.log("Handicap Calc : ",data)
            this.clubHandicap = data;
            // if(this.handicapHistory.gameRounds) {
                
            //     this.gameRounds = this.handicapHistory.gameRounds;
            //     this.gameRounds.sort((a, b)=>{
            //         if(a.roundDate < b.roundDate)
            //             return 1;
            //         else if(a.roundDate > b.roundDate)
            //             return -1;
            //         else return 0;
            //     });
            // }
            console.log("Club Handicap here : ",this.clubHandicap)
        })
    }

    public openPlayerList() {
        let filter = this.modalCtl.create(PlayerListPage, {
            // playerList: playerList
        });
        filter.onDidDismiss((data: any) => {
            console.log("player list", data);
            if (data.selected) {
                let _player: PlayerInfo = data.player;
                this.refreshAttempted = false;
                if(_player) {
                    this.selectedPlayerId = _player.playerId
                console.log("player list", this.selectedPlayerId);
                // this.handicapHistory = new HandicapCalculation();
                this.handicapSystem.filter((hcpSys)=>{
                    if(_player.defaultHandicapSystem)
                        return hcpSys.id === _player.defaultHandicapSystem
                    else hcpSys.id.toLowerCase().includes('whs');
                }).map((hcpSys)=> {
                    this.viewHcpSystem = hcpSys
                });
                setTimeout(()=>{
                    this.getPlayerHcpList(_player.playerId, _player.defaultHandicapSystem);
                },500);
                this.subsActive = true;
                this.otherPlayer = true;
                this.otherPlayerId = _player.playerId
                }

            } else this.otherPlayer = false;
            // else this._clearAndRefresh(null);
        })
        filter.present();
    }

    private _searchPlayer() {
        this.playerService.searchPlayers(this.searchPlayers, true, 1)
                .subscribe((playerList: PlayerList) => {
                    console.log("[searchPlayer] ", playerList);
                    if (playerList && playerList.players) {
                        this.players = playerList.players.filter(p => {
                            let excluded = this.playersToExclude.find((pe => {
                                return pe.playerId === p.playerId;
                            }));
                            return !excluded;
                        });

                        let filter = this.modalCtl.create(PlayerListPage, {
                            playerList: playerList
                        });
                        // filter.onDidDismiss((apply: boolean) => {
                        filter.onDidDismiss((data: any) => {
                            console.log("player list", data);
                            if (data.selected) {
                                if(data.player)
                                    this.selectedPlayerId = data.player.playerId
                                console.log("player list", this.selectedPlayerId);

                                this.getPlayerHcpList(data.player.playerId);
                            }
                            else this._clearAndRefresh(null);
                        })
                        filter.present();

                    }
                });
    }

    // public openHcpHistory() {
    //     let hcpIdxSub: HandicapIndexSubscription; // = createHandicapIndexSubscription();
    //     hcpIdxSub = this.hcpIdxSubs
    //     console.log("[Hcp Idx Subs] openHcpHistory() :", hcpIdxSub, this.hcpIdxSubs)
    //     console.log("[Hcp Calculation] openHcpHistory() :", this.handicapHistory)


    //    if(!this.handicapHistory && this.hcpIdxSubs.subscription) {
    //     MessageDisplayUtil.displayInfoAlert(this.alertCtl, "Insufficient Scorecards", "Please play more games to submit scorecards", "OK"); 
    //     return
    //     } else {
    //         if(this.hcpIdxSubs) {
    //             if(this.hcpIdxSubs.active)
    //                 this.nav.push(HandicapHistoryPage);
    //                 else if(this.hcpIdxSubs.subscription && !this.hcpIdxSubs.active && (this.hcpIdxSubs.subscriptionType === 'T' || this.hcpIdxSubs.subscriptionType === 'P'))
    //                     MessageDisplayUtil.displayErrorAlert(this.alertCtl, "Subscription Expired", "Please renew your subscription to view", "OK");
    //                     else {
    //                             this.promptSubscription();//MessageDisplayUtil.displayErrorAlert(this.alertCtl, "Subscription Needed", "Please subscribe to view", "OK");
    //                             console.log("[HCP idx subs] else if(this.hcpIdxSubs.subscription && !this.hcpIdxSubs.active)")   
    //                         }
    //         } else  {
    //             this.promptSubscription();  //MessageDisplayUtil.displayErrorAlert(this.alertCtl, "Subscription Needed", "Please subscribe to view", "OK");
    //             console.log("[HCP idx subs] ALL else")
    //         }
    
    //     }
        


    // }

    promptSubscription() {
        let confirm = this.alertCtl.create({
            title  : 'Free Trial',//this.translation.translate("ScoringPage.GameFinishTitle"),
            message: 'You are entitled to subscribe for free 3-months trial',//this.translation.translate("ScoringPage.GameFinishMessage"),
            buttons: [
                {
                    text   : 'Not Now', //this.translation.translate("ScoringPage.GameFinishNo"),
                    role   : "cancel",
                    handler: () => {
                        confirm.dismiss();
                        return false;
                    }
                },
                {
                    text   : 'Use Trial', //this.translation.translate("ScoringPage.GameFinishYes"),
                    handler: () => {
                        confirm.dismiss()
                               .then(() => {
                                   this._requestTrialSubscripion();
                               });
                        return false;
                    }
                }
            ]
        });
        confirm.present();
    }

    refresh() {
        this.playerHomeActions.refreshForcefully();
        this.onRefreshClick(null);
        // console.log("[Refresh] hcp idx subs", this.hcpIdxSubs)
    }

    private _requestTrialSubscripion(busy?: Loading) {
        if (!busy) {
            busy = this.loadingCtl.create({
                content            : "Please wait...",
                showBackdrop       : false,
                dismissOnPageChange: false,
                duration    : 5000,
            });
            console.log("busy?");
        }
        busy.present().then(() => {
            this.playerService.requestTrialSubs()
                .subscribe((data: HandicapIndexSubscription) => {
                    // if (data.length > 0) {
                        let hIS = data[0];
                        setTimeout(() => {
                            // this.hcpIdxSubs = data;
                            console.log("[Hcp Idx Subs] Req Hcp Subs 2 : ", hIS)
                            console.log("[Hcp Idx Subs] Req Hcp Subs 2 : ", this.hcpIdxSubs)
                        }, 250);
                        this.playerService.genHcpCalc()
                        .subscribe((data: any) => {
                            this.refresh();
                        })
                        
                    // }
                    // busy.dismiss(memberships);
                    setTimeout(() => {
                        if(busy) busy.dismiss().then(() => {
                            MessageDisplayUtil.showMessageToast('Thank you for subscribing', 
                            this.platform, this.toastCtl,3000, "bottom")
                            this.subsActive = true;

                            console.log("[Hcp Idx Subs] Req Hcp Subs 1 : ", data)
                            // if(this.hcpIdxSubs) 
                            console.log("[Hcp Idx Subs] Req Hcp Subs 2b : ", this.hcpIdxSubs)
                            
                        })
                    }, 450);
                    
                }, (error) => {
                    if(busy) busy.dismiss()
                    .then(() => {
                        console.log("[Error] 1 : ", error)
                        console.log("[Error] 2 : ", MessageDisplayUtil.getErrorMessage(error))
                        if(error) {
                            let msg = MessageDisplayUtil.getErrorMessage(error);
                            MessageDisplayUtil.displayErrorAlert(this.alertCtl, "Subscription",
                                msg, "OK");
                        }
                    
                })
                }, () => {
                    // if(busy) busy.dismiss().then();
                    // this.playerHomeActions.refreshForcefully();
                    // this._refreshMemberships();
                });
        });
        // });
    }

    getTeeColor(color: string) { 
        if(color === 'White') {
            return 'light'
        } else if(color === 'Red') {
            return 'danger'
        } else if(color === 'Black') {
            return 'dark'
        } else if(color === 'Blue') {
            return 'secondary'
        } else if(color === 'Gold') {
            return 'gold'
        }
        else return 'secondary'
    }

    refreshHandicapSystem() {
        let _player: PlayerInfo;
        let _playerId;

        // if(this.player$) {
        //     // this.player$.take(1)
        //     // .map((player: PlayerInfo) => player)
        //     // .subscribe((player) => {
        //     //     _player = player;
        //     // });
        //     _player = this.player$;
        //     // this.subsActive = true;
        // } else if(this.currentPlayer) {
        //     _player = this.currentPlayer
        // }
        if(this.currentPlayer) {
            _player = this.currentPlayer;
        }
        
        console.log("refresh hcp - this.player", this.player$, _player, this.fromMenu, this.viewHcpSystem)
        console.log("refresh hcp - this.currentPlayer",this.currentPlayer, _player, this.fromMenu, this.viewHcpSystem)
        this.handicapSystem = [];
        this.flightService.getHandicapSystemList()
        .subscribe((handicap: Array<HandicapSystem>)=>{
            // Array<HandicapSystem>
            if(handicap && handicap.length > 0) {
                this.handicapSystem = handicap;
                handicap.filter((hcp: HandicapSystem)=>{
                    if(this.currentPlayer && _player && hcp.id ===  _player.defaultHandicapSystem )
                        return true;
                        // this.viewHcpSystem = hcp
                    // else if(!this.currentPlayer && _player && hcp.id === _player.defaultHandicapSystem)
                    // // && this.fromMenu 
                    //     // this.viewHcpSystem = hcp
                    //     return true
                    else if((_player && !_player.defaultHandicapSystem) || !_player) {
                        if(hcp.defaultSystem) 
                            return true
                            
                        // hcp.id.toLowerCase().includes('whs') || 
                            // this.viewHcpSystem = hcp
                    }
                }).map((hcp: HandicapSystem)=>{
                    this.viewHcpSystem = hcp
                })
               console.log("refresh hcp - viewHcpSystem", this.viewHcpSystem)
            }
        })
    }

    onChangeHcpSystem() {
        
        // this.refreshHandicapSystem();
        let _buttons = [];
        _buttons.push({
            text    :   "View Handicap System"
        });
        let _playerId = null;
        
        // this.player$.take(1)
        // .map((player: PlayerInfo) => player)
        // .subscribe((player) => {
        //     _playerId = player.playerId
        // });
        if(this.selectedPlayerId && this.otherPlayer) _playerId = this.selectedPlayerId
        else _playerId = this.currentPlayer.playerId; //this.currentPlayer?this.currentPlayer.playerId:_playerId;
        
        if(this.handicapSystem && this.handicapSystem.length > 0) {
            this.handicapSystem.forEach((hcpSys: HandicapSystem)=>{
                if(hcpSys.id && hcpSys.derivedByMygolf && this.viewHcpSystem && hcpSys.id !== this.viewHcpSystem.id) 
                _buttons.push({
                    text    :   hcpSys.name + " ("+hcpSys.shortCode+")",
                    handler :   () => {
                        this.viewHcpSystem = hcpSys;
                        // this.onRefreshClick(null)
                        // actionSheet.dismiss().then(()=>{
                        //     this.getPlayerHcpList(_playerId, hcpSys.id);
                        // });
                        
                        this.getPlayerHcpList(_playerId, hcpSys.id);
                        // actionSheet.dismiss().then(()=>{
                        //     this.viewHcpSystem = hcpSys;
                        //     this.getPlayerHcpList();
                        //     // this.updatePlayerDefaultHcp(hcpSys);
                        // })
                    }
                  });
            })
        }
        // if(1) return;
        let actionSheet = this.actionSheetCtl.create({
            buttons: _buttons
        });
        actionSheet.addButton({
            text   : 'Cancel',
            role   : 'cancel', // will always sort to be on the bottom
            icon   : !this.platform.is('ios') ? 'close' : null,
            handler: () => {
                actionSheet.dismiss();
                return false;
            }
        });
        actionSheet.present();
    }

    getHandicapSystemDetail(handicapSystem: string, attribute?: string) {
        let _hcpSysName;
        let _hcpSysCode;
        if(!this.handicapSystem ||(this.handicapSystem && this.handicapSystem.length === 0 )) return;
        if(!handicapSystem) {
            this.handicapSystem.filter((hcpSys)=>{
                if(hcpSys.id === 'USGA_OLD') {
                    _hcpSysName = hcpSys.name
                    _hcpSysCode = hcpSys.shortCode
                }
            }) 
        } else if(handicapSystem) {
            this.handicapSystem.filter((hcpSys)=>{
                if(hcpSys.id === handicapSystem) {
                    _hcpSysName = hcpSys.name
                    _hcpSysCode = hcpSys.shortCode
                }
            })
        }
        if(attribute === 'code') return _hcpSysCode
        else return _hcpSysName
    }

    toggleSeeMore() {
        this.seeMore = !this.seeMore;
    }

    showInfo(handicapSystem: string) {
        if(handicapSystem !== 'WHS2020') return false;
        else return true;
    }

    getActualDiff(round: HandicapGameRound) {
        if(!round) return;
        return (round.scoreDifferential + round.cumulativeESR);
    }
    

}
