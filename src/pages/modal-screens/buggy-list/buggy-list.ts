import {NavController, NavParams, ViewController, LoadingController, Platform} from "ionic-angular";
import {Component} from "@angular/core";
import { GameRoundInfo } from "../../../data/game-round";
import {CompetitionInfo  } from "../../../data/competition-data";
import { PlayerService } from "../../../providers/player-service/player-service";
import { Country } from "../../../data/country-location";
import { TeeBox } from "../../../data/tee-box";
import { TeeBoxInfo } from "../../../data/club-course";
import { PlayerInfo, PlayerList } from "../../../data/player-data";
import {Keyboard} from '@ionic-native/keyboard';
import { MessageDisplayUtil } from "../../../message-display-utils";
import { BuggyData, BuggyDayDetails, CaddyData, UserRole } from "../../../data/mygolf.data";
import { ClubFlightService } from "../../../providers/club-flight-service/club-flight-service";
import { ModalController } from "ionic-angular";
import { BuggyDetailsPage } from "./buggy-details/buggy-details";

import * as moment from 'moment';
import { NotificationsPage } from "../../notifications/notifications";
import { ActionSheetController } from "ionic-angular";
import { AlertController } from "ionic-angular";
import { ToastController } from "ionic-angular";

/*
 Generated class for the CompetitionDescriptionPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */

@Component({
    templateUrl: 'buggy-list.html',
    selector: 'buggy-list-page'
})
export class BuggyListPage
{
    public competition: CompetitionInfo;
    public gameRound: GameRoundInfo;
    public headerName: string;
    public countryList: Array<Country>;
    public teeBox: Array<TeeBox>;
    public teeBoxes: Array<TeeBoxInfo>;
    public playerList: any;
    public searchBuggies: string;
    public players: Array<PlayerInfo> = [];
    public playersToExclude: Array<PlayerInfo> = [];
    public selectedPlayerId: number;
    searchAttempted: boolean = false;

    buggyList: Array<BuggyData>;
    filteredBuggyList: Array<any>;
    buggyDayList: Array<BuggyDayDetails>;

    clubId: number;
    showAll: boolean = false;

    today: string;
    currentDate: string;

    changeBuggy: boolean = false;

    switchView: boolean = true;

    userRoles: Array<UserRole>;

    constructor(public nav: NavController,
        private navParams: NavParams,
        private viewCtrl: ViewController,
        private playerService: PlayerService,
        private loadingCtl: LoadingController,
        private platform: Platform,
        private keyboard: Keyboard,
        private flightService: ClubFlightService,
        private modalCtrl: ModalController,
        private actionSheetCtrl: ActionSheetController,
        private alertCtrl: AlertController,
        private toastCtl: ToastController) {
        this.competition           = this.navParams.get("competition");
        this.gameRound = this.navParams.get("gameRound");
        this.headerName      = this.navParams.get("headerName");
        this.teeBoxes = navParams.get("teeBoxes");
        this.playerList = navParams.get("playerList");
        this.clubId = navParams.get("clubId");
        this.userRoles = navParams.get("userRoles");
        if(!this.clubId) this.clubId = 1701051914; // mygolf2u - 28101520;

        this.today = moment().format("YYYY-MM-DD");
        this.currentDate = this.navParams.get('currentDate')?this.navParams.get('currentDate'):moment().format("YYYY-MM-DD");
        this.changeBuggy = this.navParams.get("changeBuggy");

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
        this._searchBuggy();
        
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
        // if(this.searchBuggies) {
            this.searchAttempted = true;
            this._searchBuggy();
        // } 
        // else this.buggyList = [];
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

    onSelectPlayer(p: PlayerInfo) {
        if (this.platform.is('ios') && this.platform.is('cordova'))
        this.keyboard.close();
        if(p) {
            this.viewCtrl.dismiss({
                selected: true,
                player: p
            });
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

    private _searchBuggy() {
        this.buggyList = [];
        this.filteredBuggyList = [];
        let _searchBuggies = this.searchBuggies?this.searchBuggies.toLowerCase():"";

        // if(this.showAll) {
        //     this.flightService.getBuggyList(this.clubId)
        //     .subscribe((buggy: Array<BuggyData>) => {
        //         this.buggyList = buggy;
        //         console.log("buggy list : ", this.buggyList)
        //         if(this.searchBuggies && this.searchBuggies.length > 0) {
        //             this.filteredBuggyList = this.buggyList.filter((buggyList: BuggyData) => {
        //                 let byBuggyName = buggyList.name?buggyList.name.toLowerCase().includes(_searchBuggies):"";
        //                 let byBuggyNo = buggyList.buggyNo?buggyList.buggyNo.toLowerCase().startsWith(_searchBuggies):"";
        //                 let byPhysicalId = buggyList.physicalId?buggyList.physicalId.toLowerCase().startsWith(_searchBuggies):"";
        //                 let byDescription = buggyList.description?buggyList.description.toLowerCase().includes(_searchBuggies):"";
        //                 return byBuggyName || byBuggyNo || byPhysicalId;// || byDescription;
        //             });
        //         }
        //         else this.filteredBuggyList = this.buggyList;
        //     });
        // } 
        if(this.showAll) {
            let _availableBuggies;
            this.flightService.getAvailableBuggies(this.clubId,this.currentDate)
            .subscribe((buggy: Array<BuggyData>) => {
                this.buggyList = buggy;
                console.log("buggy list : !showAll", this.buggyList)
                if(this.searchBuggies && this.searchBuggies.length > 0) {
                    _availableBuggies = this.buggyList.filter((buggyList: BuggyData) => {
                        let byBuggyName = buggyList.name?buggyList.name.toLowerCase().includes(_searchBuggies):"";
                        let byBuggyNo = buggyList.buggyNo?buggyList.buggyNo.toLowerCase().startsWith(_searchBuggies):"";
                        let byPhysicalId = buggyList.physicalId?buggyList.physicalId.toLowerCase().startsWith(_searchBuggies):"";
                        let byDescription = buggyList.description?buggyList.description.toLowerCase().includes(_searchBuggies):"";
                        return byBuggyName || byBuggyNo || byPhysicalId;// || byDescription;
                    });
                }
                else _availableBuggies = this.buggyList;
            });
            this.flightService.getBuggyDayDetails(this.clubId, this.currentDate)
            .subscribe((buggy: Array<BuggyDayDetails>) => {
                this.buggyDayList = buggy;
                console.log("buggy list - showAll: ", this.buggyDayList)
                if(this.searchBuggies && this.searchBuggies.length > 0) {
                    this.filteredBuggyList = this.buggyDayList.filter((buggyList: BuggyDayDetails) => {
                        let byBuggyName = buggyList.buggy.name?buggyList.buggy.name.toLowerCase().includes(_searchBuggies):"";
                        let byBuggyNo = buggyList.buggy.buggyNo?buggyList.buggy.buggyNo.toLowerCase().startsWith(_searchBuggies):"";
                        let byPhysicalId = buggyList.buggy.physicalId?buggyList.buggy.physicalId.toLowerCase().startsWith(_searchBuggies):"";
                        let byDescription = buggyList.buggy.description?buggyList.buggy.description.toLowerCase().includes(_searchBuggies):"";
                        return byBuggyName || byBuggyNo || byPhysicalId;// || byDescription;
                    });
                }
                else this.filteredBuggyList = this.buggyDayList;
            });
            this.filteredBuggyList.forEach((buggyDay: BuggyDayDetails)=>{
                buggyDay.active = false;
                let _buggy = 
                _availableBuggies.filter((buggy: BuggyData)=>{
                    if(buggy.id === buggyDay.buggy.id)
                        return true;
                });
                if(_buggy[0]) buggyDay.active = true;
            })
        } 
        else {
            this.flightService.getAvailableBuggies(this.clubId,this.currentDate)
            .subscribe((buggy: Array<BuggyData>) => {
                this.buggyList = buggy;
                console.log("buggy list : !showAll", this.buggyList)
                if(this.searchBuggies && this.searchBuggies.length > 0) {
                    this.filteredBuggyList = this.buggyList.filter((buggyList: BuggyData) => {
                        let byBuggyName = buggyList.name?buggyList.name.toLowerCase().includes(_searchBuggies):"";
                        let byBuggyNo = buggyList.buggyNo?buggyList.buggyNo.toLowerCase().startsWith(_searchBuggies):"";
                        let byPhysicalId = buggyList.physicalId?buggyList.physicalId.toLowerCase().startsWith(_searchBuggies):"";
                        let byDescription = buggyList.description?buggyList.description.toLowerCase().includes(_searchBuggies):"";
                        return byBuggyName || byBuggyNo || byPhysicalId;// || byDescription;
                    });
                }
                else this.filteredBuggyList = this.buggyList;
            });
        }
        
            
            console.log("searched : ", this.searchBuggies);
            console.log("caddy List : ", this.buggyList);
            console.log("filtered caddy List : ", this.filteredBuggyList)
        
        // this.playerService.searchPlayers(this.searchPlayers, true, 1)
        //         .subscribe((playerList: PlayerList) => {
        //             console.log("[searchPlayer] ", playerList);
        //             if (playerList && playerList.players) {
        //                 this.playerList = playerList;
        //                 this.players = playerList.players.filter(p => {
        //                     let excluded = this.playersToExclude.find((pe => {
        //                         return pe.playerId === p.playerId;
        //                     }));
        //                     return !excluded;
        //                 });

        //             }
        //         }, (error) => {
        //             console.log("error")
        //             MessageDisplayUtil.getErrorMessage(error, error)
        //         }, () => {
        //             console.log("complete?")
        //         });
    }

    onBuggyDetails(buggy: BuggyData) {
        if(this.changeBuggy) {
            this.viewCtrl.dismiss({
                selected: true,
                buggy: buggy
            });
        }
        else {
            this.nav.push(BuggyDetailsPage, {
            buggy: buggy,
            currentDate: this.currentDate,
        })}
        

        // let modal = this.modalCtrl.create(BuggyDetailsPage, { buggy: buggy });
        // modal.present();
    }

    nextDate() {
        this.currentDate = moment(this.currentDate).add(1, 'days').format("YYYY-MM-DD");
        // this._searchBuggy();
        // this.flightService.getAvailableCaddies(this.clubId,this.currentDate)
        // .subscribe((caddyList: Array<BuggyData>) => {
        //     console.log("previous date : ", this.currentDate, "caddy list : ", caddyList)
        // })
    }

    prevDate() {
        this.currentDate = moment(this.currentDate).subtract(1, 'days').format("YYYY-MM-DD");
        // moment(this.currentDate).toDate()
        // this._searchBuggy();
        // this.flightService.getAvailableCaddies(this.clubId,this.currentDate)
        // .subscribe((caddyList: Array<BuggyData>) => {
        //     console.log("previous date : ", this.currentDate, "caddy list : ", caddyList)
        // })
        console.log("current date : ", moment(this.currentDate))
    }

    toggleClick() {
        this._searchBuggy();
    }
    confirmDate() {
        this._searchBuggy();
    }

    onRefreshClick() {
        // this.currentDate = this.today;
        this._searchBuggy();
    }

    prevPage() {
        if(moment(this.currentDate).toDate() > moment(this.today).toDate()) return 1;
        // console.log("prev page pre : ",this.currentPage, this.starterList.length)
        // if(this.currentPage>0) this.currentPage = this.currentPage - 1;
        // console.log("prev page post : ",this.currentPage, this.starterList.length)
    }

    getFullStatus(status: string) {
        if(status === 'A') return 'Available'
        else if(status === 'N') return 'Not Available'
        else return ''
    }
    toggleAll(showAll: boolean) {
        this.showAll = showAll;
        console.log("current show all : ", this.showAll);
        console.log("toggling show all : ", showAll)
        this._searchBuggy();
    }

    onHomeClick() {
        // console.log("footer home click")
        this.nav.popToRoot(); //this.nav.setRoot(PlayerHomePage);
      }
      onNotificationsClick() { 
        this.nav.push(NotificationsPage);
    }

    onBuggySettings(buggy: any) {
        let _buttons = [];
        console.log("caddy settings - caddy : ", buggy)
        // _buttons.push({
        //     text: 'Get unavailability',
        //         // role: 'cancel', // will always sort to be on the bottom
        //         // icon: !this.platform.is('ios') ? 'close' : null,
        //         handler: () => {
        //           if(!this.showAll) this.getListUnavailability(caddy);
        //           else if(this.showAll) this.getListUnavailability(buggy.caddy);
        //         }
        // });

        if(this.showAll) {
            // let _buggy: BuggyData = caddy;
            if(buggy.active)
            _buttons.push({
                text: 'Set unavailability',
                handler: () => {
                  this.onAddBuggyUnavailability(buggy.buggy);
                }
            });
            else if(!buggy.active)
            _buttons.push({
                text: 'Remove unavailabilty',
                handler: () => {
                    this.onRemoveBuggyUnavailability(buggy.buggy);
                }
            })
        } else if(!this.showAll) {
            _buttons.push({
                
                text: 'Set unavailability',
                // role: 'cancel', // will always sort to be on the bottom
                // icon: !this.platform.is('ios') ? 'close' : null,
                handler: () => {
                  this.onAddBuggyUnavailability(buggy);
                }
            })
            
        }

        _buttons.push({
            text: 'Cancel',
            role: 'cancel', // will always sort to be on the bottom
            // icon: !this.platform.is('ios') ? 'close' : null,
            handler: () => {
              console.log('Cancel clicked');
            }
          })

        let actionSheet = this.actionSheetCtrl.create({

            buttons: _buttons
          });
          actionSheet.present();
    }

    onAddBuggyUnavailability(buggy: BuggyData) {
        let _caddyId;
        let _fromDate = this.currentDate;// = moment().format("YYYY-MM-DD");
        let _toDate = this.currentDate;// = moment().format("YYYY-MM-DD");
        if(buggy) _caddyId = buggy.id;
        this.flightService.addBuggyUnavailability(_caddyId, _fromDate, _toDate)
        .subscribe((data)=>{
            console.log("add caddy availability : ", data)
            if(data) {
                MessageDisplayUtil.showMessageToast('Successfully set caddy unavailabilty',
                        this.platform, this.toastCtl, 3000, "bottom")
                this.onRefreshClick();
            }
        })
    }

    onRemoveBuggyUnavailability(buggy: BuggyData) {
        let alert = this.alertCtrl.create({
            //title: 'Confirm de-register',
            title: 'Remove Unavailability',// 'Confirm to de-register from this competition?',
            message: 'Are you sure you want to remove buggy unavailability for this date '+moment(this.currentDate).format("ddd, DD MMM YYYY")+'?',
            buttons: [
              {
                text: 'No',
                role: 'cancel',
                handler: () => {
                  alert.dismiss();
                  return false;
                }
              },
              {
                text: 'Yes',
                handler: () => {
                  alert.dismiss().then(() => {
                    this.goRemoveBuggyUnavailability(buggy);
                  });
                  return false;
                }
              }
            ]
          });
          alert.present();
    }

    goRemoveBuggyUnavailability(buggy: BuggyData) {
        let _buggyId;
        let _unavailabiltyId;
        let _fromDate = this.currentDate;// = moment().format("YYYY-MM-DD");
        let _toDate = this.currentDate;// = moment().format("YYYY-MM-DD");
        if(buggy) _buggyId = buggy.id;
        this.flightService.getBuggyUnavailability(_buggyId, _fromDate, _toDate)
        .subscribe((data)=>{
            console.log("get buggy availability : ", data)
            if(data) {
                _unavailabiltyId = data[0].id;
                this.flightService.removeBuggyUnavailability(_unavailabiltyId)
                .subscribe((data)=>{
                    console.log("remove buggy availability : ", data);
                    if(data) {
                        
                        MessageDisplayUtil.showMessageToast('Successfully remove unavailabilty',
                        this.platform, this.toastCtl, 3000, "bottom")
                        this.onRefreshClick();
                    }
                })
            }
            
        })
        
    }

    getListUnavailability(buggy: BuggyData) {
        let _buggyId;
        let _fromDate = this.currentDate;// = moment().format("YYYY-MM-DD");
        let _toDate  = this.currentDate;//= moment().format("YYYY-MM-DD");
        console.log("get list : ", buggy)
        if(buggy) _buggyId = buggy.id;
        this.flightService.getBuggyUnavailability(_buggyId, _fromDate, _toDate)
        .subscribe((data)=>{
            console.log("get buggy availability : ", data)
        })
    }

    getUserRoles(page ? : string) {
        // console.log("get user roles : ", page, this.loggedInAdmin, this.loggedInType, this.userRoles)
        // if(!this.userRoles || this.userRoles.length === 0 ||  !this.loggedInAdmin) return false;

        // if(1) return true;
        let _userRole;
        let _rolesAllowed;
        let _isAdmin: boolean = false;
        _isAdmin = (page === 'caddy') ? false : null; //this.loggedInAdmin;

        // console.log("inside user roles", this.userRoles.length)
        if (this.userRoles && this.userRoles.length > 0) {
            _userRole = this.userRoles.filter((role: any) => {
                if (!role) return false;
                if (page === 'ratings') {
                    _rolesAllowed = role.toLowerCase().includes('admin'.toLowerCase()) ||
                        role.toLowerCase().includes('caddy_master'.toLowerCase())
                    return _rolesAllowed

                } else if (page === 'assignments') {
                    _rolesAllowed = role.toLowerCase().includes('admin'.toLowerCase()) ||
                        role.toLowerCase().includes('caddy_master'.toLowerCase())
                    return _rolesAllowed

                } else return false
            })
        }


        if (_userRole && _userRole.length > 0 || _isAdmin) {
            return true
        } else return false;
    }
}
