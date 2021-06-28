import { CaddySelectionCriteria, CaddyDayDetails } from './../../../data/mygolf.data';
import {
    NavController,
    NavParams,
    ViewController,
    LoadingController,
    Platform,
    ToastController
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
import {
    PlayerInfo,
    PlayerList
} from "../../../data/player-data";
import {
    Keyboard
} from '@ionic-native/keyboard';
import {
    MessageDisplayUtil
} from "../../../message-display-utils";
import {
    ClubFlightService
} from "../../../providers/club-flight-service/club-flight-service";
import {
    CaddyData
} from "../../../data/mygolf.data";
import {
    CaddyDetailsPage
} from "./caddy-details/caddy-details";
import {
    ModalController
} from "ionic-angular";

import * as moment from "moment";
import { NotificationsPage } from '../../notifications/notifications';
import { ActionSheetController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';


/*
 Generated class for the CompetitionDescriptionPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */

export interface CaddyPairing {
    caddySelectionCriteria?: CaddySelectionCriteria;
    caddyPreferred?: CaddyData;
    caddyRequired?: false;
    caddyRequested?: boolean;
    caddyPairing?: number;
    caddyAssigned?: CaddyData;
}

@Component({
    templateUrl: 'caddy-list.html',
    selector: 'caddy-list-page'
})
export class CaddyListPage {
    public competition: CompetitionInfo;
    public gameRound: GameRoundInfo;
    public headerName: string;
    public countryList: Array < Country > ;
    public teeBox: Array < TeeBox > ;
    public teeBoxes: Array < TeeBoxInfo > ;
    public playerList: any;
    public searchCaddies: string;
    public players: Array < PlayerInfo > = [];
    public playersToExclude: Array < PlayerInfo > = [];
    public selectedPlayerId: number;
    searchAttempted: boolean = false;

    caddyList: Array < CaddyData > ;
    filteredCaddyList: Array < any > ;
    caddyDayList: Array <CaddyDayDetails>;

    showAll: boolean = false;

    today: string;
    currentDate: string;

    switchView: boolean = false;
    clubId: number;

    searchBar: boolean = false;

    viewType: number = 4;
    fromBooking: boolean = false;
    bookingClub: any;

    bookingCurrDate: string;

    caddySelectionCriteria: CaddySelectionCriteria = {
        caddyRequired: false,
        gender: 'F',
        maxAge: 45,
        minAge: 24
    };
    caddySelectionCriteriaMode: boolean = false;
    ageValues: any = {
        upper: 45,
        lower: 24
    };

    caddiesToExclude: Array<any>;
    changeCaddie: boolean = false;
    


    userRoles: Array<string>;

    bookingId: number;

    constructor(public nav: NavController,
        private navParams: NavParams,
        private viewCtrl: ViewController,
        private playerService: PlayerService,
        private loadingCtl: LoadingController,
        private platform: Platform,
        private keyboard: Keyboard,
        private flightService: ClubFlightService,
        private modalCtrl: ModalController,
        private toastCtl: ToastController,
        private actionSheetCtrl: ActionSheetController,
        private alertCtrl: AlertController) {
        this.competition = this.navParams.get("competition");
        this.gameRound = this.navParams.get("gameRound");
        this.headerName = this.navParams.get("headerName");
        this.teeBoxes = navParams.get("teeBoxes");
        this.playerList = navParams.get("playerList");
        this.clubId = navParams.get("clubId");
        if (!this.clubId) this.clubId = 1701051914; // mygolf2u - 28101520;
        // this.clubId = 28101520;

        this.today = moment().format("YYYY-MM-DD");
        //.toDate(); //moment().format("YYYY-MM-DD");
        this.fromBooking = navParams.get("fromBooking");
        this.bookingClub = navParams.get("bookingClub");
        this.changeCaddie = this.navParams.get('changeCaddie');
        if (this.fromBooking) {
            this.bookingCurrDate = navParams.get("bookingCurrDate");
            this.currentDate = this.bookingCurrDate;
            this.bookingId = navParams.get("bookingId")
        } else this.currentDate = this.navParams.get('currentDate')?this.navParams.get('currentDate'):moment().format("YYYY-MM-DD");

        this.caddiesToExclude = navParams.get("caddiesToExclude");
        console.log("caddies to exclude [init page]: ", this.caddiesToExclude)
        

        console.log("Player List : ", this.playerList);
        console.log("Caddy List Page - current date : ", this.currentDate, this.bookingCurrDate);
        this.userRoles = navParams.get("userRoles");
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
        this._searchCaddy();

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

    onSearchInput() {
        // if(this.searchCaddies.length > 0) {
        this.searchAttempted = true;
        this._searchCaddy();
        // } 
        // else this._searchCaddy();
        // this._clearAndRefresh(null);
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

    private _searchCaddy() {
        this.caddyList = [];
        this.filteredCaddyList = [];

        let _searchCaddies = this.searchCaddies?this.searchCaddies.toLowerCase():'';

        let _currentCaddyList = [];


        // if (this.showAll) {
        //     this.flightService.getCaddyList(this.clubId)
        //         .subscribe((caddyList: Array < CaddyData > ) => {
        //             console.log("caddy list : ", caddyList)
        //             console.log("caddies to exclude : ", this.caddiesToExclude)
        //             if (caddyList.length > 0) {
        //                 this.caddyList = caddyList;
        //                 if (this.searchCaddies && this.searchCaddies.length > 0) {
        //                     _currentCaddyList = this.caddyList.filter((caddyList: CaddyData) => {
        //                         let byFirstName = caddyList.firstName ? caddyList.firstName.toLowerCase().includes(_searchCaddies) : "";
        //                         let byLastName = caddyList.lastName ? caddyList.lastName.toLowerCase().includes(_searchCaddies) : "";
        //                         let byStaffId = caddyList.staffId ? caddyList.staffId.toLowerCase().startsWith(_searchCaddies) : "";
        //                         let byNickName = caddyList.nickName ? caddyList.nickName.toLowerCase().includes(_searchCaddies) : "";
        //                         return byFirstName || byLastName || byStaffId || byNickName;
        //                     });
        //                 } else {
        //                     _currentCaddyList = this.caddyList;
        //                 }
                        
        //             }
        //             if(this.caddiesToExclude && this.caddiesToExclude.length > 0) {
        //                 this.filteredCaddyList = _currentCaddyList.filter((caddy: CaddyData)=> {
        //                     let excluded = this.caddiesToExclude.find((ce: CaddyPairing)=>{
        //                         if(ce && ce.caddyPreferred)
        //                             return ce.caddyPreferred.id === caddy.id
        //                     })
        //                     return !excluded;
        //                 }).sort((a, b) => {
        //                     if ((a.firstName && a.firstName.toLowerCase()) < (b.firstName && b.firstName.toLowerCase()))
        //                         return -1;
        //                     else if ((a.firstName && a.firstName.toLowerCase()) > (b.firstName && b.firstName.toLowerCase()))
        //                         return 1;
        //                     else return 0;
        //                 });
        //             } else {
        //                 this.filteredCaddyList = _currentCaddyList.sort((a, b) => {
        //                     if ((a.firstName && a.firstName.toLowerCase()) < (b.firstName && b.firstName.toLowerCase()))
        //                         return -1;
        //                     else if ((a.firstName && a.firstName.toLowerCase()) > (b.firstName && b.firstName.toLowerCase()))
        //                         return 1;
        //                     else return 0;
        //                 });
        //             }
                    




        //             // console.log("searched : ", this.searchCaddies);
        //             // console.log("caddy List : ", this.caddyList);
        //             // console.log("filtered caddy List : ", this.filteredCaddyList)
        //         });
        // } 
        if (this.showAll) {
            let _availableCaddy;
            let _caddyList;
            let _availableDone = false; 
            if(this.fromBooking && this.bookingId)
            this.flightService.getAvailableCaddiesBooking(this.bookingId)
                .subscribe((caddyList: Array < CaddyData > ) => {
                    if (caddyList.length > 0) {
                        _caddyList = caddyList;
                        if (this.searchCaddies && this.searchCaddies.length > 0) {
                            _currentCaddyList = _caddyList.filter((caddyList: CaddyData) => {
                                let byFirstName = caddyList.firstName ? caddyList.firstName.toLowerCase().includes(_searchCaddies) : "";
                                let byLastName = caddyList.lastName ? caddyList.lastName.toLowerCase().includes(_searchCaddies) : "";
                                let byStaffId = caddyList.staffId ? caddyList.staffId.toLowerCase().startsWith(_searchCaddies) : "";
                                let byNickName = caddyList.nickName ? caddyList.nickName.toLowerCase().includes(_searchCaddies) : "";
                                return byFirstName || byLastName || byStaffId || byNickName;
                            });
                        } else {
                            _currentCaddyList = _caddyList;
                        }
                    }

                    if(this.caddiesToExclude && this.caddiesToExclude.length > 0) {
                        _availableCaddy = _currentCaddyList.filter((caddy: CaddyData)=> {
                            let excluded = this.caddiesToExclude.find((ce: CaddyPairing)=>{
                                if(ce && ce.caddyPreferred && this.fromBooking)
                                    return ce.caddyPreferred.id === caddy.id
                                else if(ce && ce.caddyAssigned && this.changeCaddie)
                                    return ce.caddyAssigned.id === caddy.id
                            })
                            return !excluded;
                        }).sort((a, b) => {
                            if ((a.firstName && a.firstName.toLowerCase()) < (b.firstName && b.firstName.toLowerCase()))
                                return -1;
                            else if ((a.firstName && a.firstName.toLowerCase()) > (b.firstName && b.firstName.toLowerCase()))
                                return 1;
                            else return 0;
                        });
                    } else {
                        _availableCaddy = _currentCaddyList.sort((a, b) => {
                            if ((a.firstName && a.firstName.toLowerCase()) < (b.firstName && b.firstName.toLowerCase()))
                                return -1;
                            else if ((a.firstName && a.firstName.toLowerCase()) > (b.firstName && b.firstName.toLowerCase()))
                                return 1;
                            else return 0;
                        });
                    }

                    

                }, (error)=>{
                    _availableDone = true;
                }, ()=>{
                    if(_availableCaddy) _availableDone = true;
                });
            else _availableDone = true;

                let _interval = setInterval(()=>{
                    console.log("interval - available done : ", _availableDone)
                    if(_availableDone) {
                        clearInterval(_interval);
                        let caddyList;
            this.flightService.getCaddieDayDetails(this.clubId,this.currentDate)
            // this.flightService.getCaddyList(this.clubId)
                .subscribe((caddyDayList: Array < CaddyDayDetails > ) => {
                    console.log("caddy day list : ", caddyDayList)
                    console.log("caddies to exclude : ", this.caddiesToExclude)
                    if (caddyDayList.length > 0) {
                        this.caddyDayList = caddyDayList;
                        if (this.searchCaddies && this.searchCaddies.length > 0) {
                            _currentCaddyList = this.caddyDayList.filter((caddyDayList: CaddyDayDetails) => {
                                caddyList= caddyDayList.caddy;
                                let byFirstName = caddyList.firstName ? caddyList.firstName.toLowerCase().includes(_searchCaddies) : "";
                                let byLastName = caddyList.lastName ? caddyList.lastName.toLowerCase().includes(_searchCaddies) : "";
                                let byStaffId = caddyList.staffId ? caddyList.staffId.toLowerCase().startsWith(_searchCaddies) : "";
                                let byNickName = caddyList.nickName ? caddyList.nickName.toLowerCase().includes(_searchCaddies) : "";
                                return byFirstName || byLastName || byStaffId || byNickName;
                            });
                        } else {
                            _currentCaddyList = this.caddyDayList;
                        }
                        
                    }
                    if(this.caddiesToExclude && this.caddiesToExclude.length > 0) {
                        this.filteredCaddyList = _currentCaddyList.filter((caddy: CaddyDayDetails)=> {
                            let excluded = this.caddiesToExclude.find((ce: CaddyPairing)=>{
                                if(ce && ce.caddyPreferred && this.fromBooking)
                                    return ce.caddyPreferred.id === caddy.caddy.id
                                else if(ce && ce.caddyAssigned && this.changeCaddie)
                                    return ce.caddyAssigned.id === caddy.caddy.id
                            })
                            return !excluded;
                        }).sort((a, b) => {
                            if ((a.caddy.firstName && a.caddy.firstName.toLowerCase()) < (b.caddy.firstName && b.caddy.firstName.toLowerCase()))
                                return -1;
                            else if ((a.caddy.firstName && a.caddy.firstName.toLowerCase()) > (b.caddy.firstName && b.caddy.firstName.toLowerCase()))
                                return 1;
                            else return 0;
                        });
                    } else {
                        this.filteredCaddyList = _currentCaddyList.sort((a, b) => {
                            if ((a.caddy.firstName && a.caddy.firstName.toLowerCase()) < (b.caddy.firstName && b.caddy.firstName.toLowerCase()))
                                return -1;
                            else if ((a.caddy.firstName && a.caddy.firstName.toLowerCase()) > (b.caddy.firstName && b.caddy.firstName.toLowerCase()))
                                return 1;
                            else return 0;
                        });
                    }
                    console.log("caddy available : ", _availableCaddy);
                    console.log("caddy all : ", this.filteredCaddyList)

                    this.filteredCaddyList.forEach((caddy)=>{
                        let _booked = true;
                        if(_availableCaddy) {
                            
                        caddy.present = false;
                        
                        let _idx;
                        let _notBooked = 
                        _availableCaddy.filter((ac,idx)=>{
                            if(ac.id === caddy.caddy.id) {
                                _booked = false
                                _idx = idx
                                return true
                                // caddy.present = true
                            } else {
                                _booked = true;
                                return false
                                // caddy.present = false;
                            }
                        })
                        if(_notBooked && _notBooked.length > 0) {
                            if(_notBooked[0].id === caddy.caddy.id)
                                caddy.present = true
                        }
                        // if(!_booked) {
                        //     caddy.present = true;
                        //     _availableCaddy.splice(_idx,1)
                        // }
                        // else if(_booked) caddy.present = false;
                        }
                    });

                    // _availableCaddy.forEach((ac)=>{
                    //     let _booked = true;
                    //     this.filteredCaddyList.filter((caddy)=>{
                    //         caddy.present = false;
                    //         if(ac.id === caddy.caddy.id) {
                    //             caddy.present = true
                    //             // return true;
                    //         } else caddy.present = false;
                    //     })
                    // })
                    




                    console.log("caddy day list show all: ", this.filteredCaddyList)
                    // console.log("searched : ", this.searchCaddies);
                    // console.log("caddy List : ", this.caddyList);
                    // console.log("filtered caddy List : ", this.filteredCaddyList)
                });
                    }

                },500);
            
        }
         else {
            // moment(this.today).toDate()
            // moment(this.currentDate).format("YYYY-MM-DD")
            let _currDate;
            // if(this.fromBooking && this.bookingCurrDate) _currDate = this.bookingCurrDate;
            _currDate = this.currentDate
            let _bookingId = this.fromBooking?this.bookingId:null;
            // _bookingId = this.
            if(!this.fromBooking) {
                this.flightService.getAvailableCaddies(this.clubId, _currDate)
                .subscribe((caddyList: Array < CaddyData > ) => {
                    if (caddyList.length > 0) {
                        this.caddyList = caddyList;
                        if (this.searchCaddies && this.searchCaddies.length > 0) {
                            _currentCaddyList = this.caddyList.filter((caddyList: CaddyData) => {
                                let byFirstName = caddyList.firstName ? caddyList.firstName.toLowerCase().includes(_searchCaddies) : "";
                                let byLastName = caddyList.lastName ? caddyList.lastName.toLowerCase().includes(_searchCaddies) : "";
                                let byStaffId = caddyList.staffId ? caddyList.staffId.toLowerCase().startsWith(_searchCaddies) : "";
                                let byNickName = caddyList.nickName ? caddyList.nickName.toLowerCase().includes(_searchCaddies) : "";
                                return byFirstName || byLastName || byStaffId || byNickName;
                            });
                        } else {
                            _currentCaddyList = this.caddyList;
                        }
                    }

                    if(this.caddiesToExclude && this.caddiesToExclude.length > 0) {
                        this.filteredCaddyList = _currentCaddyList.filter((caddy: CaddyData)=> {
                            let excluded = this.caddiesToExclude.find((ce: CaddyPairing)=>{
                                if(ce && ce.caddyPreferred && this.fromBooking)
                                    return ce.caddyPreferred.id === caddy.id
                                else if(ce && ce.caddyAssigned && this.changeCaddie)
                                    return ce.caddyAssigned.id === caddy.id
                            })
                            return !excluded;
                        }).sort((a, b) => {
                            if ((a.firstName && a.firstName.toLowerCase()) < (b.firstName && b.firstName.toLowerCase()))
                                return -1;
                            else if ((a.firstName && a.firstName.toLowerCase()) > (b.firstName && b.firstName.toLowerCase()))
                                return 1;
                            else return 0;
                        });
                    } else {
                        this.filteredCaddyList = _currentCaddyList.sort((a, b) => {
                            if ((a.firstName && a.firstName.toLowerCase()) < (b.firstName && b.firstName.toLowerCase()))
                                return -1;
                            else if ((a.firstName && a.firstName.toLowerCase()) > (b.firstName && b.firstName.toLowerCase()))
                                return 1;
                            else return 0;
                        });
                    }
                    

                });
            } else if(this.fromBooking) {
                this.flightService.getAvailableCaddiesBooking(_bookingId)
                .subscribe((caddyList: Array < CaddyData > ) => {
                    if (caddyList.length > 0) {
                        this.caddyList = caddyList;
                        if (this.searchCaddies && this.searchCaddies.length > 0) {
                            _currentCaddyList = this.caddyList.filter((caddyList: CaddyData) => {
                                let byFirstName = caddyList.firstName ? caddyList.firstName.toLowerCase().includes(_searchCaddies) : "";
                                let byLastName = caddyList.lastName ? caddyList.lastName.toLowerCase().includes(_searchCaddies) : "";
                                let byStaffId = caddyList.staffId ? caddyList.staffId.toLowerCase().startsWith(_searchCaddies) : "";
                                let byNickName = caddyList.nickName ? caddyList.nickName.toLowerCase().includes(_searchCaddies) : "";
                                return byFirstName || byLastName || byStaffId || byNickName;
                            });
                        } else {
                            _currentCaddyList = this.caddyList;
                        }
                    }

                    if(this.caddiesToExclude && this.caddiesToExclude.length > 0) {
                        this.filteredCaddyList = _currentCaddyList.filter((caddy: CaddyData)=> {
                            let excluded = this.caddiesToExclude.find((ce: CaddyPairing)=>{
                                if(ce && ce.caddyPreferred && this.fromBooking)
                                    return ce.caddyPreferred.id === caddy.id
                                else if(ce && ce.caddyAssigned && this.changeCaddie)
                                    return ce.caddyAssigned.id === caddy.id
                            })
                            return !excluded;
                        }).sort((a, b) => {
                            if ((a.firstName && a.firstName.toLowerCase()) < (b.firstName && b.firstName.toLowerCase()))
                                return -1;
                            else if ((a.firstName && a.firstName.toLowerCase()) > (b.firstName && b.firstName.toLowerCase()))
                                return 1;
                            else return 0;
                        });
                    } else {
                        this.filteredCaddyList = _currentCaddyList.sort((a, b) => {
                            if ((a.firstName && a.firstName.toLowerCase()) < (b.firstName && b.firstName.toLowerCase()))
                                return -1;
                            else if ((a.firstName && a.firstName.toLowerCase()) > (b.firstName && b.firstName.toLowerCase()))
                                return 1;
                            else return 0;
                        });
                    }
                    

                });

            }
            
                
                console.log("caddy day list : ", this.filteredCaddyList)
        }



        // if (this.filteredCaddyList.length > 0) {
        //     this.filteredCaddyList.sort((a, b) => {
        //         if (a.firstName.toLowerCase() < b.firstName.toLowerCase()) return -1
        //         else if (a.firstName.toLowerCase() > b.firstName.toLowerCase()) return 1
        //         // else return 0
        //     })
        // }





    }

    onCaddyDetails(caddy: CaddyData, caddyDay?: CaddyDayDetails, currentDate?: string) {
        if (this.changeCaddie) {
            this.viewCtrl.dismiss({
                selected: true,
                changeCaddie: this.changeCaddie,
                caddy: caddy
            })
            
        } else if (this.fromBooking) {
            console.log("caddy details : ", caddyDay)
            console.log("caddy details : ", caddy);
            console.log("caddy details - caddyselection : ", this.caddySelectionCriteriaMode)
            console.log("caddy details - show all ", this.showAll)
            if(!caddyDay.present && this.showAll) {
                MessageDisplayUtil.showMessageToast('Selected caddy is not available',
                this.platform, this.toastCtl, 3000, "bottom")
                return false;
            } else if(!caddy.status && !this.showAll) {
                MessageDisplayUtil.showMessageToast('Selected caddy is not available',
                this.platform, this.toastCtl, 3000, "bottom")
                return false;
            }
            this.caddySelectionCriteria = {
                caddyRequired: true
            }
            this.viewCtrl.dismiss({
                selected: true,
                fromBooking: this.fromBooking,
                caddy: caddy,
                userRoles: this.userRoles,
            })
            // let modal = this.modalCtrl.create(CaddyDetailsPage, {
            //     caddy: caddy,
            //     currentDate: this.currentDate,
            //     fromBooking: this.fromBooking
            // });
            // modal.onDidDismiss((data: any) => {
            //     if (data) {
            //         console.log("from caddy details : ", data)
            //         this.viewCtrl.dismiss(data)
            //     }
            // })
            // modal.present();
        } else {
            this.nav.push(CaddyDetailsPage, {
                caddy: caddy,
                currentDate: this.currentDate,
                fromBooking: this.fromBooking,
                userRoles: this.userRoles,
            });
        }


    }

    nextDate() {
        this.currentDate = moment(this.currentDate).add(1, 'days').format("YYYY-MM-DD"); //.toDate(); //.format("YYYY-MM-DD");
        // this._searchCaddy();
        // this.flightService.getAvailableCaddies(this.clubId,this.currentDate)
        // .subscribe((caddyList: Array<CaddyData>) => {
        //     console.log("previous date : ", this.currentDate, "caddy list : ", caddyList)
        // })
    }

    prevDate() {
        this.currentDate = moment(this.currentDate).subtract(1, 'days').format("YYYY-MM-DD"); //.toDate(); //.format("YYYY-MM-DD");
        // moment(this.currentDate).toDate()
        // this._searchCaddy();
        // this.flightService.getAvailableCaddies(this.clubId,this.currentDate)
        // .subscribe((caddyList: Array<CaddyData>) => {
        //     console.log("previous date : ", this.currentDate, "caddy list : ", caddyList)
        // })
        console.log("current date : ", moment(this.currentDate))
    }

    toggleClick() {
        this._searchCaddy();
    }

    confirmDate() {
        this._searchCaddy();
    }

    onRefreshClick() {
        // this.currentDate = this.today;
        this._searchCaddy();
        console.log("current date : ", this.currentDate, "today : ", this.today)
    }

    nextPage() {
        // console.log("next page pre: ",this.currentPage, this.starterList.length)
        // if(this.currentPage < this.starterList.length) this.currentPage = this.currentPage + 1;
        // // console.log("next page post : ",this.currentPage, this.starterList.length)
    }

    prevPage() {
        if (moment(this.currentDate).toDate() > moment(this.today).toDate()) return 1;
        // console.log("prev page pre : ",this.currentPage, this.starterList.length)
        // if(this.currentPage>0) this.currentPage = this.currentPage - 1;
        // console.log("prev page post : ",this.currentPage, this.starterList.length)
    }

    getFullStatus(status: string) {
        if (status === 'A') return 'Available'
        else if (status === 'N') return 'Not Available'
        else return ''
    }

    toggleAll(showAll: boolean) {
        this.showAll = showAll;
        this._searchCaddy();
    }

    changeView(type: number) {
        if (type === 1) this.viewType = 1;
        if (type === 2) this.viewType = 2;
        if (type === 3) this.viewType = 3;

        if (type === 4) this.viewType = 4;
    }

    addCaddySelectionCriteria() {
        // this.caddySelectionCriteria = {
        //     maxAge: this.ageValues.upper,
        //     minAge: this.ageValues.lower,
        //     caddyRequired: true,
        // };

        this.caddySelectionCriteria['caddyRequired'] = true;
        this.caddySelectionCriteria['maxAge'] = this.ageValues.upper;
        this.caddySelectionCriteria['minAge'] = this.ageValues.lower;
        if (this.fromBooking) {
            this.viewCtrl.dismiss({
                selected: true,
                fromBooking: this.fromBooking,
                caddy: null,
                caddySelectionCriteria: this.caddySelectionCriteria
            });
        }
    }

    onCaddySelectionCriteria() {
        this.caddySelectionCriteriaMode = true;
    }
    onHomeClick() {
        // console.log("footer home click")
        this.nav.popToRoot(); //this.nav.setRoot(PlayerHomePage);
      }
      onNotificationsClick() { 
        this.nav.push(NotificationsPage);
    }

    onCaddySettings(caddy: any) {
        let _buttons = [];
        console.log("caddy settings - caddy : ", caddy)
        // _buttons.push({
        //     text: 'Get unavailability',
        //         // role: 'cancel', // will always sort to be on the bottom
        //         // icon: !this.platform.is('ios') ? 'close' : null,
        //         handler: () => {
        //           if(!this.showAll) this.getListUnavailability(caddy);
        //           else if(this.showAll) this.getListUnavailability(caddy.caddy);
        //         }
        // });

        if(this.showAll) {
            // let _caddy: CaddyData = caddy;
            if(caddy.present)
            _buttons.push({
                text: 'Set unavailability',
                handler: () => {
                  this.onAddCaddyUnavailability(caddy.caddy);
                }
            });
            else if(!caddy.present)
            _buttons.push({
                text: 'Remove unavailabilty',
                handler: () => {
                    this.onRemoveCaddyUnavailability(caddy.caddy);
                }
            })
        } else if(!this.showAll) {
            _buttons.push({
                
                text: 'Set unavailability',
                // role: 'cancel', // will always sort to be on the bottom
                // icon: !this.platform.is('ios') ? 'close' : null,
                handler: () => {
                  this.onAddCaddyUnavailability(caddy);
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

    onAddCaddyUnavailability(caddy: CaddyData) {
        let _caddyId;
        let _fromDate = this.currentDate;// = moment().format("YYYY-MM-DD");
        let _toDate = this.currentDate;// = moment().format("YYYY-MM-DD");
        if(caddy) _caddyId = caddy.id;
        this.flightService.addCaddyUnavailability(_caddyId, _fromDate, _toDate)
        .subscribe((data)=>{
            console.log("add caddy availability : ", data)
            if(data) {
                MessageDisplayUtil.showMessageToast('Successfully set caddy unavailabilty',
                        this.platform, this.toastCtl, 3000, "bottom")
                this.onRefreshClick();
            }
        })
    }

    onRemoveCaddyUnavailability(caddy: CaddyData) {
        let alert = this.alertCtrl.create({
            //title: 'Confirm de-register',
            title: 'Remove Unavailability',// 'Confirm to de-register from this competition?',
            message: 'Are you sure you want to remove caddy unavailability for this date '+moment(this.currentDate).format("ddd, DD MMM YYYY")+'?',
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
                    this.goRemoveCaddyUnavailability(caddy);
                  });
                  return false;
                }
              }
            ]
          });
          alert.present();
    }

    goRemoveCaddyUnavailability(caddy: CaddyData) {
        let _caddyId;
        let _unavailabiltyId;
        let _fromDate = this.currentDate;// = moment().format("YYYY-MM-DD");
        let _toDate = this.currentDate;// = moment().format("YYYY-MM-DD");
        if(caddy) _caddyId = caddy.id;
        this.flightService.getCaddyUnavailability(_caddyId, _fromDate, _toDate)
        .subscribe((data)=>{
            console.log("get caddy availability : ", data)
            if(data) {
                _unavailabiltyId = data[0].id;
                this.flightService.removeCaddyUnavailability(_unavailabiltyId)
                .subscribe((data)=>{
                    console.log("remove caddy availability : ", data);
                    if(data) {
                        
                        MessageDisplayUtil.showMessageToast('Successfully remove unavailabilty',
                        this.platform, this.toastCtl, 3000, "bottom")
                        this.onRefreshClick();
                    }
                })
            }
            
        })
        
    }

    getListUnavailability(caddy: CaddyData) {
        let _caddyId;
        let _fromDate = this.currentDate;// = moment().format("YYYY-MM-DD");
        let _toDate  = this.currentDate;//= moment().format("YYYY-MM-DD");
        console.log("get list : ", caddy)
        if(caddy) _caddyId = caddy.id;
        this.flightService.getCaddyUnavailability(_caddyId, _fromDate, _toDate)
        .subscribe((data)=>{
            console.log("get caddy availability : ", data)
        })
    }

    
    getUserRoles(page ? : string) {
        // console.log("get user roles : ", page, this.loggedInAdmin, this.loggedInType, this.userRoles)
        // if(!this.userRoles || this.userRoles.length === 0 ||  !this.loggedInAdmin) return false;

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