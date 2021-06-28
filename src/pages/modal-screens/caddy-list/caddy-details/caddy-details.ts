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
    CaddyData,
    CaddySchedule,
    Availabilities,
    CaddieRating,
    CaddyAssignment
} from "../../../../data/mygolf.data";

import * as moment from "moment";
import {
    ClubFlightService
} from "../../../../providers/club-flight-service/club-flight-service";
import {
    ModalController
} from "ionic-angular";
import {
    ImageZoom
} from "../../image-zoom/image-zoom";
import {
    CaddyFlightListsPage
} from "../../../booking/caddy-flight-lists/caddy-flight-lists";
import {
    RatingsListPage
} from "../../ratings-list/ratings-list";
import { JsonService } from "../../../../json-util";


/*
 Generated class for the CompetitionDescriptionPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */

@Component({
    templateUrl: 'caddy-details.html',
    selector: 'caddy-details-page'
})
export class CaddyDetailsPage {
    public competition: CompetitionInfo;
    public gameRound: GameRoundInfo;
    public headerName: string;
    public countryList: Array < Country > ;
    public teeBox: Array < TeeBox > ;
    public teeBoxes: Array < TeeBoxInfo > ;
    public playerList: any;
    public searchPlayers: string;
    public players: Array < PlayerInfo > = [];
    public playersToExclude: Array < PlayerInfo > = [];
    public selectedPlayerId: number;
    searchAttempted: boolean = false;

    caddyDetails: CaddyData;
    switchView: boolean = false;
    caddySchedule: CaddySchedule;
    caddyAvl: Array < Availabilities > = [];
    currentDate: string;

    fromBooking: boolean = false;

    refreshCaddyAvlDone: boolean = false;
    fromCaddieMaster: boolean = false;

    userRoles: Array < string > ;
    scheduleOnly: boolean = false;





    constructor(public nav: NavController,
        private navParams: NavParams,
        private viewCtrl: ViewController,
        private playerService: PlayerService,
        private loadingCtl: LoadingController,
        private platform: Platform,
        private keyboard: Keyboard,
        private alertCtl: AlertController,
        private flightService: ClubFlightService,
        private modalCtl: ModalController) {
        this.competition = this.navParams.get("competition");
        this.gameRound = this.navParams.get("gameRound");
        this.headerName = this.navParams.get("headerName");
        this.teeBoxes = navParams.get("teeBoxes");
        this.playerList = navParams.get("playerList");
        this.caddyDetails = navParams.get("caddy");
        this.currentDate = navParams.get("currentDate");
        this.fromBooking = navParams.get("fromBooking");
        this.switchView = (navParams.get("scheduleOnly")) ? true : false;
        this.scheduleOnly = (navParams.get("scheduleOnly")) ? true : false;
        this.fromCaddieMaster = navParams.get("fromCaddieMaster");
        this.userRoles = navParams.get("userRoles");

        console.log("Player List : ", this.playerList)
    }

    close() {
        if (this.platform.is('ios') && this.platform.is('cordova'))
            this.keyboard.close();

        this.viewCtrl.dismiss({
            selected: false
        });
    }

    selectPreferredCaddy() {
        this.viewCtrl.dismiss({
            selected: true,
            fromBooking: this.fromBooking,
            caddy: this.caddyDetails
        })
        // this.viewCtrl.dismiss({
        //     selected: true,
        //     fromBooking: this.fromBooking,
        //     caddy: this.caddyDetails
        // })
    }

    ionViewDidLoad() {
        this.getCaddySchedule();
        // let _today;
        // let _next30;
        // if(this.currentDate) {
        //     _today = moment(this.currentDate).format("YYYY-MM-DD");
        //     _next30 = moment(this.currentDate).add(29,'days').format("YYYY-MM-DD");
        // }
        // else {
        //     _today = moment().format("YYYY-MM-DD");
        //     _next30 = moment().add(29,'days').format("YYYY-MM-DD");
        // }
        // if (this.platform.is('ios') && this.platform.is('cordova'))
        //                 this.keyboard.show();
        // this.flightService.getCaddySchedule(this.caddyDetails.id, _today, _next30)
        // .subscribe((caddyS: CaddySchedule) => {
        //     console.log("Caddy Schedule : ",caddyS);
        //     this.caddySchedule = caddyS;
        //     this.caddyAvl.push(...this.caddySchedule.availabilities);
        // })
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
        if (this.searchPlayers) {
            this.searchAttempted = true;
            this._searchPlayer();
        } else this.playerList = [];
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
            // let flagIcon = flagUrl.split("/");
            // return "img/flag/" + flagIcon[2];
            return flagUrl;
        }
    }

    // getFlagUrl(flagUrl: string) {
    //     // console.log("[flagurl]")
    //     if (flagUrl==null || flagUrl=='') return "img/flag/default_worldwide.png";
    //     else {
    //         let flagIcon = flagUrl.split("/");
    //         return "img/flag/"+flagIcon[2];
    //     }
    // }

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

    displayAvailableDays(days: any) {
        let daysText = (days.MON ? "Mon," : "") + (days.TUE ? "Tue," : "") + (days.WED ? "Wed," : "") + (days.THU ? "Thu," : "") + (days.FRI ? "Fri," : "") +
            (days.SAT ? "Sat," : "") + (days.SUN ? "Sun," : "");

        return daysText.slice(0, -1);
    }
    getFullStatus(status: string) {
        if (status === 'A') return 'Available'
        else if (status === 'N') return 'Not Available'
        else return ''
    }

    getTextDay(increment: number) {
        let _dayText: string;
        let _date;
        // console.log("get text day - ", increment, ' : ', this.caddyAvl )
        if (this.refreshCaddyAvlDone && this.caddyAvl && this.caddyAvl[increment - 1].availableOn)
            // console.log("get text day [",increment,"]", moment(this.caddyAvl[increment-1].availableOn).add((increment - 1), 'days').format('ddd'))
        if (this.refreshCaddyAvlDone && this.caddyAvl && this.caddyAvl[increment - 1].availableOn) {
            _date = moment(this.caddyAvl[increment - 1].availableOn).set({hour:0,minute:0,second:0,millisecond:0});
            // _date.set({hour:0,minute:0,second:0,millisecond:0});
            _dayText = moment(_date).format('ddd');
            // console.log("get text day - ", _dayText)
            // console.log("get text day - ", _date)
        }
        // else _dayText = moment().add((increment - 1), 'days').format('ddd');
        return _dayText;

    }

    getEndDate(increment: number, today ? : boolean) {
        let _date: string;
        if (this.scheduleOnly) {
            if (today) _date = moment(this.currentDate).startOf('month').format('DD MMM');
            else _date = moment(this.currentDate).endOf('month').format('DD MMM YYYY');
        } else if (!this.scheduleOnly && this.currentDate) {
            if (today) _date = moment(this.currentDate).add((increment - 1), 'days').format('DD MMM');
            else _date = moment(this.currentDate).add((increment - 1), 'days').format('DD MMM YYYY');
        } else {
            if (today) _date = moment().add((increment - 1), 'days').format('DD MMM');
            else _date = moment().add((increment - 1), 'days').format('DD MMM YYYY');
        }
        return _date;
    }

    getDateDetail(caddyAvl: Availabilities) {
        let _date: string;
        // _date = moment().add((increment-1), 'days').format('ddd, DD MMM YYYY');
        _date = moment(caddyAvl.availableOn).format("ddd, DD MMM YYYY")
        // let _working: string;
        // if(increment % 2 === 0) _working = 'Working';
        // else _working = 'Not working'
        let _avlText: string = '';
        if (caddyAvl.available) _avlText = 'Working';
        else _avlText = 'Not working';
        let _reason = caddyAvl.reason ? `<br>Reason : ` + caddyAvl.reason : caddyAvl.weeklyHoliday? `<br>Reason : Weekly Holiday`: '';
        let _message: string = _avlText + ` on <b>` + _date + `</b>` + _reason;
        let alert = this.alertCtl.create({
            title: 'Working Schedule',
            // subTitle: 'Selected date is '+ _date,
            message: _message, //'Selected date is ' + '<b>' + _date + '</b>',
            buttons: ['Close']
        });
        alert.present();
    }

    getCaddySchedule() {
        this.refreshCaddyAvlDone = false;
        let _today;
        let _next30;
        if(this.scheduleOnly) {
            _today = moment(this.currentDate).startOf('month').format("YYYY-MM-DD");
            _next30 = moment(this.currentDate).endOf('month').format("YYYY-MM-DD");
        } else if (!this.scheduleOnly && this.currentDate) {
            _today = moment(this.currentDate).format("YYYY-MM-DD");
            _next30 = moment(this.currentDate).add(29, 'days').format("YYYY-MM-DD");
        } else {
            _today = moment().format("YYYY-MM-DD");
            _next30 = moment().add(29, 'days').format("YYYY-MM-DD");
        }
        if (this.platform.is('ios') && this.platform.is('cordova'))
            this.keyboard.show();
        this.flightService.getCaddySchedule(this.caddyDetails.id, _today, _next30)
            .subscribe((caddyS: CaddySchedule) => {
                console.log("Caddy Schedule : ", caddyS);
                this.caddySchedule = caddyS
                this.caddyAvl = this.caddySchedule.availabilities;
                if (caddyS) this.refreshCaddyAvlDone = true;
            })
    }

    getDate(x: Availabilities) {
        return moment(x.availableOn).format("DD");


    }

    zoomImage(caddy: CaddyData) {
        let _caddie: CaddyData = caddy;

        let imageZoom = this.modalCtl.create(ImageZoom, {
            image: _caddie.caddyImage ? _caddie.caddyImage : ''
        })

        imageZoom.onDidDismiss((data: any) => {});
        imageZoom.present();
    }

    parseStarRating(caddy: CaddyData) {
        // caddy.averageRating
        let _rating = caddy.averageRating;
        let _floorRating = Math.floor(_rating)
        let _halfRating = _rating - _floorRating;
        let _balRating = Math.floor(5 - _rating);


        // <ion-icon name="star-outline"></ion-icon>
        // <ion-icon name="star-half"></ion-icon>
        // <ion-icon name="star"></ion-icon>

        let _starIcon = '<span class="fa-fw fa-stack"><i class="fas fa-fw fa-star fa-stack-1x"></i></span>'; //'<ion-icon class="icon ion-star"></ion-icon>';
        let _emptyStarIcon = '<span class="fa-fw fa-stack"><i class="far fa-fw fa-star fa-stack-1x"></i></span>';
        let _halfStarIcon = `<span class="fa-fw fa-stack">
        <i class="fas fa-fw fa-star-half fa-stack-1x "></i>
        <i class="far fa-fw fa-star-half fa-stack-1x fa-flip-horizontal"></i>
  </span>`;
        // '<ion-icon class="icon ion-star-half"></ion-icon>'; 

        let _displayRating = '';
        let _starOutlineIcon = '<ion-icon class="icon ion-star-outline"></ion-icon>';
        for (let i = 1; i <= _floorRating; i++) {
            _displayRating += _starIcon;
        }
        if (_halfRating >= 0.5) _displayRating += _halfStarIcon;
        for (let i = 1; i <= _balRating; i++) {
            _displayRating += _emptyStarIcon;
        }

        console.log("star rating : ", _balRating, _displayRating);
        // for(let j = 1; j<= _balRating; j++) {
        //     _displayRating += _starOutlineIcon;
        // }

        // return _floorRating + ' ' + _halfRating;
        // console.log("display rating : ", caddy.averageRating)
        // console.log("display rating : ", _displayRating)
        return Number(_rating).toFixed(1) + " " + _displayRating;
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

    openCaddieRatings() {

        let _caddieId = this.caddyDetails.id; // __caddieId?__caddieId:64;
        let _fromDate = moment().startOf('month').format('YYYY-MM-DD');
        let _toDate = moment().endOf('month').format('YYYY-MM-DD');
        this.flightService.getCaddyRatings(_caddieId, _fromDate, _toDate)
            .subscribe((data: Array < CaddieRating > ) => {
                if (data) {
                    data = data.sort((a: CaddieRating, b: CaddieRating) => {
                        if (a.ratedOn < b.ratedOn) return -1
                        else if (a.ratedOn > b.ratedOn) return 1
                        else return 0
                    })
                    this.nav.push(RatingsListPage, {
                        ratings: data,
                        header: 'Player Ratings',
                        ratingWho: 'Caddie',
                        caddieId: _caddieId,
                        overallRating: this.caddyDetails.averageRating,
                    })
                }
            })
    }

    openCaddieAssignments() {
            let _caddieId = this.caddyDetails.id; //__caddieId?__caddieId:64;
            let _fromDate = this.currentDate;
            this.flightService.getCaddyAssignments(_caddieId, _fromDate)
            .subscribe((caddyAssignment: Array<CaddyAssignment>)=>{
                this.nav.push(CaddyFlightListsPage, {
                    caddyAssignment: caddyAssignment,
                    caddieId: _caddieId,
                    fromDetails: true,
                    caddie: this.caddyDetails,
                })
            });
    }


    nextDate() {
        this.currentDate = moment(this.currentDate).add(1, 'month').format("YYYY-MM-DD");
        // this.getMasterFlightList();
    }

    prevDate() {
        this.currentDate = moment(this.currentDate).subtract(1, 'month').format("YYYY-MM-DD");
        // this.getMasterFlightList();
    }

    confirmDate() {
        this.getCaddySchedule();
    }
}