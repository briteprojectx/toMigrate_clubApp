import { CaddySelectionCriteria, CaddyDayDetails, ClubCaddieSchedule } from './../../../data/mygolf.data';
import {
    NavController,
    NavParams,
    ViewController,
    LoadingController,
    Platform,
    ToastController
} from "ionic-angular";
import {
    Component, HostListener
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
    ModalController
} from "ionic-angular";

import * as moment from "moment";
import { NotificationsPage } from '../../notifications/notifications';


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
    templateUrl: 'caddy-schedule-display.html',
    selector: 'caddy-schedule-display-page'
})
export class CaddyScheduleDisplayPage {
    
    appFooterHide: boolean = true;
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
    showNonDispatched: boolean = true;

    today: string;
    currentDate: string;

    switchView: boolean = true;
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

    caddyScheduleList: Array<ClubCaddieSchedule>;

    maxDate: string;
    autoRefresh: number = 30; //in seconds
    refreshTimer;
    showInterval: boolean = false;
    showMoreOptions: boolean = false;

    constructor(public nav: NavController,
        private navParams: NavParams,
        private viewCtrl: ViewController,
        private playerService: PlayerService,
        private loadingCtl: LoadingController,
        private platform: Platform,
        private keyboard: Keyboard,
        private flightService: ClubFlightService,
        private modalCtrl: ModalController,
        private toastCtl: ToastController) {
        this.competition = this.navParams.get("competition");
        this.gameRound = this.navParams.get("gameRound");
        this.headerName = this.navParams.get("headerName");
        this.teeBoxes = navParams.get("teeBoxes");
        this.playerList = navParams.get("playerList");
        this.clubId = navParams.get("clubId");
        if (!this.clubId) this.clubId = 1701051914; // mygolf2u - 28101520;
        // this.clubId = 28101520;

        this.today = moment().format("YYYY-MM-DD");
        this.maxDate = moment().add('7', 'days').format("YYYY-MM-DD");
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

        // this.currentDate = '2020-12-14';
        this.refreshTimer = setInterval(()=>{
            if(this.autoRefresh <= 0) {
                clearInterval(this.refreshTimer)
            }
            this._searchCaddy();
        }, this.autoRefresh*1000);


    }

    ngOnInit() {
        this.innerWidth = window.innerWidth;
    }

    innerWidth: any;
    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.innerWidth = window.innerWidth;
        let _innerHeight = window.innerHeight;
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
        this.caddyScheduleList = [];

        let _searchCaddies = this.searchCaddies?this.searchCaddies.toLowerCase():'';

        let _currentCaddyList = [];

        // if (this.showAll) {
        //     let _availableCaddy;
        //     let _caddyList;
        //     let _availableDone = false; 
        //     if(this.fromBooking && this.bookingId)
        //     this.flightService.getAvailableCaddiesBooking(this.bookingId)
        //         .subscribe((caddyList: Array < CaddyData > ) => {
        //             if (caddyList.length > 0) {
        //                 _caddyList = caddyList;
        //                 if (this.searchCaddies && this.searchCaddies.length > 0) {
        //                     _currentCaddyList = _caddyList.filter((caddyList: CaddyData) => {
        //                         let byFirstName = caddyList.firstName ? caddyList.firstName.toLowerCase().includes(_searchCaddies) : "";
        //                         let byLastName = caddyList.lastName ? caddyList.lastName.toLowerCase().includes(_searchCaddies) : "";
        //                         let byStaffId = caddyList.staffId ? caddyList.staffId.toLowerCase().startsWith(_searchCaddies) : "";
        //                         let byNickName = caddyList.nickName ? caddyList.nickName.toLowerCase().includes(_searchCaddies) : "";
        //                         return byFirstName || byLastName || byStaffId || byNickName;
        //                     });
        //                 } else {
        //                     _currentCaddyList = _caddyList;
        //                 }
        //             }

        //             if(this.caddiesToExclude && this.caddiesToExclude.length > 0) {
        //                 _availableCaddy = _currentCaddyList.filter((caddy: CaddyData)=> {
        //                     let excluded = this.caddiesToExclude.find((ce: CaddyPairing)=>{
        //                         if(ce && ce.caddyPreferred && this.fromBooking)
        //                             return ce.caddyPreferred.id === caddy.id
        //                         else if(ce && ce.caddyAssigned && this.changeCaddie)
        //                             return ce.caddyAssigned.id === caddy.id
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
        //                 _availableCaddy = _currentCaddyList.sort((a, b) => {
        //                     if ((a.firstName && a.firstName.toLowerCase()) < (b.firstName && b.firstName.toLowerCase()))
        //                         return -1;
        //                     else if ((a.firstName && a.firstName.toLowerCase()) > (b.firstName && b.firstName.toLowerCase()))
        //                         return 1;
        //                     else return 0;
        //                 });
        //             }

                    

        //         }, (error)=>{
        //             _availableDone = true;
        //         }, ()=>{
        //             if(_availableCaddy) _availableDone = true;
        //         });
        //     else _availableDone = true;

        //         let _interval = setInterval(()=>{
        //             console.log("interval - available done : ", _availableDone)
        //             if(_availableDone) {
        //                 clearInterval(_interval);
        //                 let caddyList;
        //     this.flightService.getCaddieDayDetails(this.clubId,this.currentDate)
        //     // this.flightService.getCaddyList(this.clubId)
        //         .subscribe((caddyDayList: Array < CaddyDayDetails > ) => {
        //             console.log("caddy day list : ", caddyDayList)
        //             console.log("caddies to exclude : ", this.caddiesToExclude)
        //             if (caddyDayList.length > 0) {
        //                 this.caddyDayList = caddyDayList;
        //                 if (this.searchCaddies && this.searchCaddies.length > 0) {
        //                     _currentCaddyList = this.caddyDayList.filter((caddyDayList: CaddyDayDetails) => {
        //                         caddyList= caddyDayList.caddy;
        //                         let byFirstName = caddyList.firstName ? caddyList.firstName.toLowerCase().includes(_searchCaddies) : "";
        //                         let byLastName = caddyList.lastName ? caddyList.lastName.toLowerCase().includes(_searchCaddies) : "";
        //                         let byStaffId = caddyList.staffId ? caddyList.staffId.toLowerCase().startsWith(_searchCaddies) : "";
        //                         let byNickName = caddyList.nickName ? caddyList.nickName.toLowerCase().includes(_searchCaddies) : "";
        //                         return byFirstName || byLastName || byStaffId || byNickName;
        //                     });
        //                 } else {
        //                     _currentCaddyList = this.caddyDayList;
        //                 }
                        
        //             }
        //             if(this.caddiesToExclude && this.caddiesToExclude.length > 0) {
        //                 this.filteredCaddyList = _currentCaddyList.filter((caddy: CaddyDayDetails)=> {
        //                     let excluded = this.caddiesToExclude.find((ce: CaddyPairing)=>{
        //                         if(ce && ce.caddyPreferred && this.fromBooking)
        //                             return ce.caddyPreferred.id === caddy.caddy.id
        //                         else if(ce && ce.caddyAssigned && this.changeCaddie)
        //                             return ce.caddyAssigned.id === caddy.caddy.id
        //                     })
        //                     return !excluded;
        //                 }).sort((a, b) => {
        //                     if ((a.caddy.firstName && a.caddy.firstName.toLowerCase()) < (b.caddy.firstName && b.caddy.firstName.toLowerCase()))
        //                         return -1;
        //                     else if ((a.caddy.firstName && a.caddy.firstName.toLowerCase()) > (b.caddy.firstName && b.caddy.firstName.toLowerCase()))
        //                         return 1;
        //                     else return 0;
        //                 });
        //             } else {
        //                 this.filteredCaddyList = _currentCaddyList.sort((a, b) => {
        //                     if ((a.caddy.firstName && a.caddy.firstName.toLowerCase()) < (b.caddy.firstName && b.caddy.firstName.toLowerCase()))
        //                         return -1;
        //                     else if ((a.caddy.firstName && a.caddy.firstName.toLowerCase()) > (b.caddy.firstName && b.caddy.firstName.toLowerCase()))
        //                         return 1;
        //                     else return 0;
        //                 });
        //             }
        //             console.log("caddy available : ", _availableCaddy);
        //             console.log("caddy all : ", this.filteredCaddyList)

        //             this.filteredCaddyList.forEach((caddy)=>{
        //                 let _booked = true;
        //                 if(_availableCaddy) {
                            
        //                 caddy.present = false;
                        
        //                 let _idx;
        //                 let _notBooked = 
        //                 _availableCaddy.filter((ac,idx)=>{
        //                     if(ac.id === caddy.caddy.id) {
        //                         _booked = false
        //                         _idx = idx
        //                         return true
        //                         // caddy.present = true
        //                     } else {
        //                         _booked = true;
        //                         return false
        //                         // caddy.present = false;
        //                     }
        //                 })
        //                 if(_notBooked && _notBooked.length > 0) {
        //                     if(_notBooked[0].id === caddy.caddy.id)
        //                         caddy.present = true
        //                 }
        //                 // if(!_booked) {
        //                 //     caddy.present = true;
        //                 //     _availableCaddy.splice(_idx,1)
        //                 // }
        //                 // else if(_booked) caddy.present = false;
        //                 }
        //             });

        //             // _availableCaddy.forEach((ac)=>{
        //             //     let _booked = true;
        //             //     this.filteredCaddyList.filter((caddy)=>{
        //             //         caddy.present = false;
        //             //         if(ac.id === caddy.caddy.id) {
        //             //             caddy.present = true
        //             //             // return true;
        //             //         } else caddy.present = false;
        //             //     })
        //             // })
                    




        //             console.log("caddy day list show all: ", this.filteredCaddyList)
        //             // console.log("searched : ", this.searchCaddies);
        //             // console.log("caddy List : ", this.caddyList);
        //             // console.log("filtered caddy List : ", this.filteredCaddyList)
        //         });
        //             }

        //         },500);
            
        // }
        //  else {
        //     // moment(this.today).toDate()
        //     // moment(this.currentDate).format("YYYY-MM-DD")
        //     let _currDate;
        //     // if(this.fromBooking && this.bookingCurrDate) _currDate = this.bookingCurrDate;
        //     _currDate = this.currentDate
        //     let _bookingId = this.fromBooking?this.bookingId:null;
        //     // _bookingId = this.
        //     if(!this.fromBooking) {
        //         this.flightService.getAvailableCaddies(this.clubId, _currDate)
        //         .subscribe((caddyList: Array < CaddyData > ) => {
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
        //                         if(ce && ce.caddyPreferred && this.fromBooking)
        //                             return ce.caddyPreferred.id === caddy.id
        //                         else if(ce && ce.caddyAssigned && this.changeCaddie)
        //                             return ce.caddyAssigned.id === caddy.id
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
                    

        //         });
        //     } else if(this.fromBooking) {
        //         this.flightService.getAvailableCaddiesBooking(_bookingId)
        //         .subscribe((caddyList: Array < CaddyData > ) => {
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
        //                         if(ce && ce.caddyPreferred && this.fromBooking)
        //                             return ce.caddyPreferred.id === caddy.id
        //                         else if(ce && ce.caddyAssigned && this.changeCaddie)
        //                             return ce.caddyAssigned.id === caddy.id
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
                    

        //         });

        //     }
            
                
        //         console.log("caddy day list : ", this.filteredCaddyList)
        // }

            let _clubId = this.clubId;
            let _forDate = this.currentDate;
            this.flightService.getClubCaddySchedule(_clubId, _forDate)
            .subscribe((data: Array<ClubCaddieSchedule>)=>{
                console.log("club caddy schedule : ", data)
                if(data && data.length > 0) {
                    this.caddyScheduleList = data;
                    if(this.showNonDispatched) {
                        this.caddyScheduleList = data.filter((cs: ClubCaddieSchedule)=>{
                            return cs.status !== 'C'
                        })
                    }
                }
            });





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
            // this.nav.push(CaddyDetailsPage, {
            //     caddy: caddy,
            //     currentDate: this.currentDate,
            //     fromBooking: this.fromBooking,
            //     userRoles: this.userRoles,
            // });
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

    getCaddyFlightTime(caddySchedule: ClubCaddieSchedule) {
        if(!caddySchedule) return;
        return moment(caddySchedule.flightTime, 'HH:mm:ss').format("hh:mm A");
    }

    updateAutoRefresh() {
        clearInterval(this.refreshTimer);
        this.refreshTimer = setInterval(()=>{
            if(this.autoRefresh <= 0) {
                clearInterval(this.refreshTimer)
            }
            this._searchCaddy();
        }, this.autoRefresh*1000);
    }

    scheduleStatusRow(caddySchedule: ClubCaddieSchedule) {
        if(caddySchedule.status.toLowerCase() === 'o') {
            return 'row-status-o';
        } else if(caddySchedule.status.toLowerCase() === 'c') {
            return 'row-status-c';
        }
        else if(caddySchedule.status.toLowerCase() === 'd') {
            return 'row-status-d';
        }
    }

    getCaddyFlightDetails(caddySchedule: ClubCaddieSchedule, idx: number, attribute: string) {
        let _remarks;
        let _currentTime = moment();
        let _flightTime = moment(this.currentDate + ' ' +caddySchedule.flightTime, 'YYYY-MM-DD HH:mm:ss');
        
        // this.currentDate+' '+'16:45:00'
        let _diff = _flightTime.diff(_currentTime, 'minutes');
        console.log("flight details status : ", _diff, moment(), caddySchedule.flightTime);

        if(caddySchedule.remarks) _remarks = caddySchedule.remarks;
        else {
            if(caddySchedule.status === 'O' && _diff > 15) _remarks = 'Get Ready';
            else if(caddySchedule.status === 'O' && (_diff > 0 && _diff <= 15)) _remarks = 'Proceed to buggy';
            else if(caddySchedule.status === 'O' && (_diff < 0)) _remarks = "Flight not dispatched";
            // else if(caddySchedule.status === 'O' && !_diff) _remarks = 'Waiting flight check-in'
            else if(caddySchedule.status === 'C') _remarks = 'Flight dispatched';
            else if(caddySchedule.status === 'D' && (_diff > 0)) _remarks = 'Waiting flight check-in';
            else if(caddySchedule.status === 'D' && (_diff < 0)) _remarks = 'Flight delayed';
        }
        
        if(idx > 0) {
            let _prevIdx = idx - 1;
            if(attribute === 'flightTime' && this.caddyScheduleList[_prevIdx].flightTime === caddySchedule.flightTime)
                return '';
            if(attribute === 'bookingRef' && this.caddyScheduleList[_prevIdx].bookingReference === caddySchedule.bookingReference)
                return '';
            switch(attribute) {
                case 'flightTime':
                    return this.getCaddyFlightTime(caddySchedule);
                case 'bookingRef':
                    return caddySchedule.bookingReference;
                case 'remarks':
                    return _remarks;
            }
        } else {
            switch(attribute) {
                case 'flightTime':
                    return this.getCaddyFlightTime(caddySchedule);
                case 'bookingRef':
                    return caddySchedule.bookingReference;
                case 'remarks':
                    return _remarks;
            }
        }
    }
}