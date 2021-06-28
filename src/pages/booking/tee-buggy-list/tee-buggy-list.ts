import {NavController, NavParams, LoadingController, Platform} from "ionic-angular";
import {Component, Renderer} from "@angular/core";
import {CompetitionInfo, FlightInfo, CompetitionDetails, FlightMember} from "../../../data/competition-data";
import {GameRoundInfo, createGameRoundInfo} from "../../../data/game-round";
import {CompetitionService} from "../../../providers/competition-service/competition-service";
import {adjustViewZIndex} from "../../../globals";
import * as moment from "moment";
import {BuggyData, TeeTimeFlight, TeeTimeFlightBuggy, TeeTimeBookingPlayer, TeeTimeBooking, TeeTimeSlot, BookingPlayerType, CaddyData} from "../../../data/mygolf.data";
import {
    NotificationHandlerInfo,
    AbstractNotificationHandlerPage
} from "../../../providers/pushnotification-service/notification-handler-constructs";
import { ActionSheetController } from "ionic-angular";
import { ClubFlightService } from "../../../providers/club-flight-service/club-flight-service";
import { CaddyListPage } from "../../modal-screens/caddy-list/caddy-list";
import { BuggyListPage } from "../../modal-screens/buggy-list/buggy-list";
import { AlertController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { filter, map } from 'async';
import { ThrowStmt, ReturnStatement } from "@angular/compiler/src/output/output_ast";
import { NotificationsPage } from "../../notifications/notifications";

@Component({
    templateUrl: 'tee-buggy-list.html',
    selector: 'tee-buggy-list-page'
})
export class TeeBuggyListPage
{
    public competition: CompetitionInfo;
    public details: CompetitionDetails;
    public gameRound: GameRoundInfo;
    public visible: boolean;
    public flights: Array<FlightInfo>        = new Array<FlightInfo>();
    //  private flightMembers: Array<FlightMember> = new Array<FlightMember>();
    public filteredFlight: Array<FlightInfo> = new Array<FlightInfo>();
    public searchQuery: string               = '';

    public flight: number;
    flightDetail: TeeTimeFlight;
    flightSeatings: Array<TeeTimeFlightBuggy>;
    public teeTimeBooking: TeeTimeBooking;
    public flightBuggies: Array<BuggyData>;
    public bookingPlayers: Array<TeeTimeBookingPlayer> = new Array<TeeTimeBookingPlayer>();
    public slotAssigned: TeeTimeSlot;
    public playerSlot: number = 0;

    public buggyPlayers: Array<any>;

    flightPlayers: Array<TeeTimeBookingPlayer>;

    _buggyPlayers: any;

    caddieMaster: boolean = true;

    constructor(private nav: NavController,
        private renderer: Renderer,
        private navParams: NavParams,
        private loadingCtl: LoadingController,
        private compService: CompetitionService,
        private actionSheetCtl: ActionSheetController,
        private platform: Platform,
        private flightService: ClubFlightService,
        private alertCtrl: AlertController,
        private modalCtl: ModalController) {

        this.competition = navParams.get("competition");
        this.flights     = navParams.get("flights");
        this.gameRound   = navParams.get("gameRound");
        this.flight      = navParams.get("flightNumber");
        this.teeTimeBooking = navParams.get("teeTimeBooking");
        this.caddieMaster = navParams.get("caddieMaster");
        this.flightDetail = this.teeTimeBooking.flight;
        // this.flightBuggies = this.teeTimeBooking.buggiesAssigned;
        // if(this.teeTimeBooking) this.bookingPlayers.push(...this.teeTimeBooking.bookingPlayers);
        if(this.teeTimeBooking) {
            
        this.bookingPlayers.push(...this.teeTimeBooking.bookingPlayers);
            this.slotAssigned = this.teeTimeBooking.slotAssigned;
            this.flightBuggies = this.teeTimeBooking.buggiesAssigned;
        }

        // console.log("Tee Buggy List - Flight Buggies : ", this.flightBuggies); 
        // if(this.flightBuggies) {
        //     this.buggyPlayers.push(...this.flightBuggies);
        //     this.buggyPlayers = this.flightBuggies;
        //     this.buggyPlayers.forEach((b: any) => {
        //         b.bookingPlayers = this.bookingPlayers.filter((p: TeeTimeBookingPlayer) => {
        //             return b.id === p.buggyId
        //         })
        //         .map((p)=>{
        //             return p
        //         })
        //     })
        // }

        // if(this.bookingPlayers) this.flightPlayers.push(...this.bookingPlayers);

        this.flightPlayers = this.bookingPlayers; //this.teeTimeBooking.bookingPlayers;
        this.flightPlayers.sort((a,b)=>{
            if(a.pairingNo < b.pairingNo ) return -1
            else if(a.pairingNo > b.pairingNo ) return 1
            else return 0
        })
        this.flightPlayers = this.getUnique(this.flightPlayers,'pairingNo')
        

        this._buggyPlayers = this.teeTimeBooking.bookingPlayers;
        this._buggyPlayers.sort((a,b)=>{
            if(a.pairingNo < b.pairingNo ) return -1
            else if(a.pairingNo > b.pairingNo ) return 1
            else return 0
        })
        
        // if (this.flightPlayers[0].pairingNo === 0) this.flightPlayers.shift();
        console.log("Tee Buggy List - Time Booking: ", this.teeTimeBooking);
        console.log("Tee Buggy List - Slot Assigned: ", this.slotAssigned);
        // console.log("Tee Buggy List - Flight Buggies : ", this.buggyPlayers); 
        // console.log("Tee Buggy List - Players : ", this.bookingPlayers);    
        console.log("Tee Buggy List - Flight Players : ", this.flightPlayers);   
        console.log("Tee Buggy List - Players : ", this.bookingPlayers);     
        
        console.log("Tee Buggy List - Buggy Players : ", this.buggyPlayers);     

        // if (!this.competition) {
        //     this.competition       = {
        //         competitionId: navParams.get("competitionId")
        //     };
        //     this.flights           = new Array<FlightInfo>();
        //     this.gameRound         = createGameRoundInfo();
        //     this.gameRound.roundNo = navParams.get("roundNo");
        // }
        this.filteredFlight = this.flights;
        //this.flightMembers = this.flights.flightMembers;
        this.visible        = false;
        this.searchQuery    = '';
    }

    getUnique(arr, comp) {

        // store the comparison  values in array
        const unique =  arr.map(e => e[comp])
        
                // store the indexes of the unique objects
                .map((e, i, final) => final.indexOf(e) === i && i)
        
                // eliminate the false indexes & return unique objects
                .filter((e) => arr[e]).map(e => arr[e]);
        
        return unique;
        }
    ionViewDidLoad() {
        // this._onViewLoaded();
        // this.flightService.getBookingFlightDetail()
        // .subscribe((flight: TeeTimeFlight) => {
        //     this.flightDetail = flight;
        //     // this.flightSeatings = this.flightDetail.flightSeatings;
        //     console.log("Flight Detail : ", flight, this.flightDetail)
        // })
    }

    ionViewDidEnter() {
        adjustViewZIndex(this.nav, this.renderer);
    }
    getNotifications(): Array<NotificationHandlerInfo>{
        let notifications = new Array<NotificationHandlerInfo>();
        notifications.push({
            type       : AbstractNotificationHandlerPage.TYPE_FLIGHTS_GENERATED,
            whenActive : 'showToast',
            needRefresh: true
        });
        notifications.push({
            type       : AbstractNotificationHandlerPage.TYPE_FLIGHTS_CHANGED,
            whenActive : 'showToast',
            needRefresh: true
        });
        return notifications;
    }
    refreshPage(pushData: any){
        let compId = pushData.competitionId;
        let roundNo = pushData.roundNo;
        if(this.competition.competitionId === compId){
            this.onRefreshClick(null);
        }
        else{
            this.competition.competitionId = compId;
            this.competition.competitionName = null;
            this.gameRound.roundNo = roundNo;
            this._onViewLoaded();
        }
    }
    private _onViewLoaded(){
        if (!this.competition.competitionName) {
            let loader = this.loadingCtl.create({
                content: "Loading..."
            });

            loader.present().then(() => {
                this.compService.getCompetitionInfo(this.competition.competitionId)
                    .subscribe((comp: CompetitionInfo) => {
                        this.competition = comp;
                        this.compService.getDetails(this.competition.competitionId)
                            .subscribe((det: CompetitionDetails) => {
                                this.details   = det;
                                let ground     = det.gameRounds.filter((gr: GameRoundInfo) => {
                                    return gr.roundNo === this.gameRound.roundNo
                                }).pop();
                                this.gameRound = ground;
                                this.compService.getFlights(this.competition.competitionId, this.gameRound.roundNo)
                                    .subscribe((flights: Array<FlightInfo>) => {
                                        loader.dismiss().then(() => {
                                            this.flights        = flights;
                                            this.filteredFlight = this.flights;
                                            this.searchQuery    = "";
                                            this.onSearchCancel();
                                            console.log(this.flights)
                                        })

                                    }, (error) => {
                                        loader.dismiss();
                                    }, () => {

                                    });
                            }, (error) => {
                                loader.dismiss();
                            });
                    }, (error) => {
                        loader.dismiss();
                    });
            });
        }
    }
    onRefreshClick(refresher) {
        // this.refreshFlights(refresher);
        let loader = this.loadingCtl.create({
            content: 'Refreshing flight, Please wait...'
        });

        console.log("on buggy view refresh click ", this.teeTimeBooking)
        this.onRefreshFlight(this.teeTimeBooking,loader);
    }

    toggle(searchBar) {
        this.visible = searchBar;//!this.visible;
    }

    onSearchCancel() {
        this.toggle(false);
    }

    onSearchInput(searchbar) {
        this.filteredFlight = this.flights.filter((fp: FlightInfo, idx: number) => {
            let count = fp.flightMembers.filter((fm: FlightMember) => {
                return fm.playerName.toLowerCase().indexOf(this.searchQuery.toLowerCase()) >= 0;
            }).length;
            return count > 0;
        });
    }

    onHomeClick() {
        this.nav.popToRoot();//this.nav.setRoot(PlayerHomePage);
    }

    private refreshFlights(refresher) {

        let loader = this.loadingCtl.create({
            content: 'Loading flights list, Please wait...'
        });
        if (loader)
            loader.present().then(() => {
                this.compService.getFlights(this.competition.competitionId, this.gameRound.roundNo)
                    .subscribe((flights: Array<FlightInfo>) => {
                        loader.dismiss().then(() => {
                            this.flights        = flights;
                            this.filteredFlight = this.flights;
                            this.searchQuery    = "";
                            this.onSearchCancel();
                        })

                    }, (error) => {

                    }, () => {
                        if (refresher) refresher.complete();

                        if (loader)
                            loader.dismiss();
                    });
            });

    }

    convStartTime(flightTime: string) {
        let teeTime = moment(flightTime, 'HH:mm:ss').format("HH:mm")
        // console.log("[Tee Time] flightTime ",flightTime)
        // console.log("[Tee Time] teeTime : ",teeTime)
        // return moment(teeTime).format("HH:mm")
        return teeTime
    }

    goFlightUpdate() {
        

    let actionSheet = this.actionSheetCtl.create({

        buttons: [
  
          {
            text: 'Done',
            role: 'destructive', // will always sort to be on the bottom
            icon: !this.platform.is('ios') ? 'close' : null,
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Waiting',
            role: 'destructive', // will always sort to be on the bottom
            icon: !this.platform.is('ios') ? 'close' : null,
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Cancel Flight',
            role: 'destructive', // will always sort to be on the bottom
            icon: !this.platform.is('ios') ? 'close' : null,
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Move flight to ...',
            role: 'destructive', // will always sort to be on the bottom
            icon: !this.platform.is('ios') ? 'close' : null,
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Close',
            role: 'cancel', // will always sort to be on the bottom
            icon: !this.platform.is('ios') ? 'close' : null,
            handler: () => {
              console.log('Cancel clicked');
            }
          },
        ]
      });

    actionSheet.present();
    }

    setBagClass(x: TeeTimeBookingPlayer,y) {
        let _item;
        let _name;
        let _image;
        let _filteredBuggy: Array<any>;
        _filteredBuggy = this._buggyPlayers.filter((v,i)=>{
            return v.pairingNo === x.pairingNo
        })
        _filteredBuggy.forEach((fb:TeeTimeBookingPlayer,ix)=>{
            if(ix===0 && y === 'left') {
                _item = true
            }
            if(ix===1 && y === 'right') {
                _item = true
            }
        })

        
        if(!_item || _item === null) return ' ';
        else {
            if(y === 'left')
            return "bag-left";
            // x % 2 === 1 && 
        else if (y === 'right') return "bag-right";
        }

        // if(!x || x === null) return ' ';
        // else {
        //     if(y === 'left')
        //     return "bag-left";
        //     // x % 2 === 1 && 
        // else if (y === 'right') return "bag-right";
        // }
        
    }

    getPlayerName(x: TeeTimeBookingPlayer,y) {
        let playerName: string = '';
        // console.log("get player name ",x ," - " ,y)
        playerName = x.playerName
        if(y === 'left')
            return playerName
        else if (y === 'right')
            return playerName
        else '&nbsp;';
    }

    getPlayerName_(x: TeeTimeBookingPlayer,y: string, idx?: number) {
        let playerName: string = '';
        let _playerImage: string = '';
        let _filteredBuggy: Array<any>;
        // console.log("get player name ", this._buggyPlayers, " -----" , x)
        if(y!=='leftImage' && y!='rightImage') {
            if(this._buggyPlayers) 
            _filteredBuggy = this._buggyPlayers.filter((v,i)=>{
                return v.pairingNo === x.pairingNo
            })
            _filteredBuggy.forEach((fb:TeeTimeBookingPlayer,ix)=>{
                if(fb.player) {
                    if(ix===0 && y === 'left') playerName = fb.player.playerName
                    if(ix===1 && y === 'right') playerName = fb.player.playerName
                } else {
                    if(ix===0 && y === 'left') playerName = fb.playerName
                    if(ix===1 && y === 'right') playerName = fb.playerName
                }
            })

            
        // console.log("get player name AFTER ", this._buggyPlayers, " -----" , x, _filteredBuggy)
            
            return playerName?playerName:'';
        } 
        else {
            if(this._buggyPlayers) 
            _filteredBuggy = this._buggyPlayers.filter((v,i)=>{
                return v.pairingNo === x.pairingNo
            })
            _filteredBuggy.forEach((fb:TeeTimeBookingPlayer,ix)=>{
                if(fb.player) {
                    if(ix===0 && y === 'leftImage') playerName = fb.player.profile?fb.player.profile:fb.player.image
                    if(ix===1 && y === 'rightImage') playerName = fb.player.profile?fb.player.profile:fb.player.image
                } else playerName = '';
            })


            return playerName?playerName:'';
        }
        
    }

    onPlayerCheck(player: TeeTimeBookingPlayer, y: string, idx: number) {
        let _item;
        let _name;
        let _image;
        let _filteredBuggy: Array<any>;
        _filteredBuggy = this._buggyPlayers.filter((v,i)=>{
            return v.pairingNo === player.pairingNo
        })
        _filteredBuggy.forEach((fb:TeeTimeBookingPlayer,ix)=>{
            if(ix===0 && y === 'left') {
                _item = true
            }
            if(ix===1 && y === 'right') {
                _item = true
            }
        })
        console.log("on player check", player,y,idx,_item)

        
        if(!_item || _item === null) return false;
        else {
            if(y === 'left')
            return true;
            // x % 2 === 1 && 
        else if (y === 'right') return true;
        }
    }

    getCaddyPlayer(x: TeeTimeBookingPlayer,y: string,attribute: string,idx?: number) {
        let _item;
        let _name;
        let _image;
        let _filteredBuggy: Array<any>;
        _filteredBuggy = this._buggyPlayers.filter((v,i)=>{
            return v.pairingNo === x.pairingNo
        });

        // console.log("tee buggy list - caddy preferred ", _filteredBuggy)
        // _filteredBuggy.forEach((fb:TeeTimeBookingPlayer,ix)=>{
        //     if(ix===0 && y === 'left') {
        //         _item = fb.caddyPreferred?fb.caddyPreferred.id:''
        //         _name = fb.caddyPreferred?fb.caddyPreferred.firstName:''
        //     }
        //     if(ix===1 && y === 'right') {
        //         _item = fb.caddyPreferred?fb.caddyPreferred.id:''
        //         _name = fb.caddyPreferred?fb.caddyPreferred.firstName:''
        //     }
        //     if(ix===idx && ix===0 && y === 'leftImage') {
        //         _image = fb.caddyPreferred?fb.caddyPreferred.caddyImage:''
        //         console.log("tee buggy list left image - ", fb.caddyPreferred.caddyImage)
        //     }
        //     if(ix===idx && ix===1 && y === 'rightImage') {
        //         _image = fb.caddyPreferred?fb.caddyPreferred.caddyImage:'';
        //         console.log("tee buggy list right image - ", fb.caddyPreferred.caddyImage)
        //     }
        // })

        _filteredBuggy = _filteredBuggy.filter((fb:TeeTimeBookingPlayer,ix)=>{
            return ix === idx
            // if(ix===0 && y === 'left') {
            //     return true
            //     // _item = fb.caddyPreferred?fb.caddyPreferred.id:''
            //     // _name = fb.caddyPreferred?fb.caddyPreferred.firstName:''
            // }
            // if(ix===1 && y === 'right') {
            //     return true
            //     // _item = fb.caddyPreferred?fb.caddyPreferred.id:''
            //     // _name = fb.caddyPreferred?fb.caddyPreferred.firstName:''
            // }
            // if(ix===idx && ix===0 && y === 'leftImage') {
            //     return true
            //     // _image = fb.caddyPreferred?fb.caddyPreferred.caddyImage:''
            //     // console.log("tee buggy list left image - ", fb.caddyPreferred.caddyImage)
            // }
            // if(ix===idx && ix===1 && y === 'rightImage') {
            //     return true
            //     // _image = fb.caddyPreferred?fb.caddyPreferred.caddyImage:'';
            //     // console.log("tee buggy list right image - ", fb.caddyPreferred.caddyImage)
            // }
        });
        // if(attribute === 'image')
        // console.log("tee buggy list - caddy preferred 2", attribute, y, _filteredBuggy)
        // caddyPreferred
        let _caddyAssigned: CaddyData = _filteredBuggy[0]&&_filteredBuggy[0].caddyAssigned?_filteredBuggy[0].caddyAssigned:null;
        let _caddyPreferred: CaddyData = _filteredBuggy[0]&&_filteredBuggy[0].caddyPreferred?_filteredBuggy[0].caddyPreferred:null;
        _item =  _filteredBuggy[0]&& _caddyAssigned?_caddyAssigned.staffId:_caddyPreferred?_caddyPreferred.staffId:'';
        _name =  _filteredBuggy[0]&& _caddyAssigned?_caddyAssigned.firstName:_caddyPreferred?_caddyPreferred.firstName:'';
        _image = _filteredBuggy[0]&& _caddyAssigned?_caddyAssigned.caddyImage:_caddyPreferred?_caddyPreferred.caddyImage:'';

        switch(attribute) {
            case 'id':
                return _item?'# '+_item:'';
            case 'name':
                return _name;
            case 'image':
                return _image;
                case 'leftImage':
                return _image;
                case 'rightImage':
                return _image;
                case 'check':
                    return _caddyAssigned||_caddyPreferred?true:false;
                case 'checkClass':
                    return _caddyAssigned||_caddyPreferred?'buggy-caddie-name':'';
                
        }
    }

    onSelectCaddyList(x?: TeeTimeBookingPlayer) {
        let _currentDate = this.teeTimeBooking.slotAssigned.teeOffDate;
        let _currentCaddyPlayers;
        
        let _caddiesToExclude: Array<TeeTimeBookingPlayer> = this.getUnique(this.teeTimeBooking.bookingPlayers, 'caddiesAssigned');
        console.log('caddies to exclude - all flight', this.flightPlayers)
        console.log("caddies to exclude ", _caddiesToExclude)

        let alert = this.alertCtrl.create({
            title: 'Caddie Change',
            // subTitle: 'Selected date is '+ _date,
            message: 'This process will change current caddie. Do you want to proceed?', //'Selected date is ' + '<b>' + _date + '</b>',
            buttons: [{
                            text: 'No',
                            handler: () => {
                                // console.log('Cancel clicked');
                            }
                        },
                        {
                            text: 'Yes',
                            handler: () => {
                                let _caddyList = this.modalCtl.create(CaddyListPage, 
                                    {
                                    changeCaddie: true,
                                    currentDate: _currentDate,
                                    clubId: this.teeTimeBooking.clubData.id,
                                    caddiesToExclude: _caddiesToExclude,
                                    fromBooking: true,
                                    bookingId: this.teeTimeBooking.id
                                    })
                        
                                    _caddyList.onDidDismiss((data: any) => {
                                        if(data && data.selected) {
                                            console.log("caddie selected", data)
                                            _currentCaddyPlayers = this.teeTimeBooking.bookingPlayers.filter((player: TeeTimeBookingPlayer)=>{
                                                return player.caddyPairing === x.caddyPairing
                                            })
                                            .map((player: TeeTimeBookingPlayer)=>{
                                                return player.id
                                            })

                                            this.onChangeCaddie(this.teeTimeBooking.id,_currentCaddyPlayers,data.caddy.id)

                                            // this.goPayNow();
                                        } else console.log("buggy not selected", data, _currentCaddyPlayers)
                                        console.log('flight player', x);
                                        console.log('flight playerS', this.flightPlayers)
                                    });
                                    _caddyList.present();
                                // this.nav.push(BuggyListPage)
                                // console.log('Cancel clicked');
                            }
                        },
                    ]
        });
        alert.present();
        // this.nav.push(CaddyListPage)
    }
    onSelectBuggyList(x?: TeeTimeBookingPlayer) {
        let _currentDate = this.teeTimeBooking.slotAssigned.teeOffDate;
        let _currentBuggyPlayers;
        let alert = this.alertCtrl.create({
            title: 'Buggy Change',
            // subTitle: 'Selected date is '+ _date,
            message: 'This process will change current buggy. Do you want to proceed?', //'Selected date is ' + '<b>' + _date + '</b>',
            buttons: [{
                            text: 'No',
                            handler: () => {
                                // console.log('Cancel clicked');
                            }
                        },
                        {
                            text: 'Yes',
                            handler: () => {
                                let _buggyList = this.modalCtl.create(BuggyListPage, 
                                    {
                                    changeBuggy: true,
                                    currentDate: _currentDate,
                                    clubId: this.teeTimeBooking.clubData.id
                                    })
                        
                                    _buggyList.onDidDismiss((data: any) => {
                                        if(data && data.selected) {
                                            console.log("buggy selected", data)
                                            _currentBuggyPlayers = this.teeTimeBooking.bookingPlayers.filter((player: TeeTimeBookingPlayer)=>{
                                                return player.pairingNo === x.pairingNo
                                            })
                                            .map((player: TeeTimeBookingPlayer)=>{
                                                return player.id
                                            })

                                            this.onChangeBuggy(this.teeTimeBooking.id,_currentBuggyPlayers,data.buggy.id)

                                            // this.goPayNow();
                                        } else console.log("buggy not selected", data, _currentBuggyPlayers)
                                        console.log('flight player', x);
                                        console.log('flight playerS', this.flightPlayers)
                                    });
                                    _buggyList.present();
                                // this.nav.push(BuggyListPage)
                                // console.log('Cancel clicked');
                            }
                        },
                    ]
        });
        alert.present();
    }

    getTeeOffTime(teeOffTime: any) {
        let _teeTime: string = '';
        // _teeTime = teeOffTime.hour + ":" + teeOffTime.minute;
        _teeTime = moment(teeOffTime,'HH:mm:ss').format('hh:mm A')
        return _teeTime;
    }

    setCaddyAssigned(x: TeeTimeBookingPlayer, attribute: string) {
        // let _slot = slot - 1;
        // console.log("set caddy assigned : ", x)
        let bookingPlayer: TeeTimeBookingPlayer = x;
        // bookingPlayer = x;

        if(bookingPlayer.caddyAssigned !== null && bookingPlayer.caddyAssigned) {
            // if(attribute === 'assigned?')
            // if(bookingPlayer.caddyAssigned || bookingPlayer.caddyAssigned !== null) return true
            // else return false
        let caddyAssigned: CaddyData;
        caddyAssigned = (bookingPlayer.caddyAssigned)?bookingPlayer.caddyAssigned:null;
        
        switch(attribute) {
            case 'name':
                return caddyAssigned.firstName
                // break
            case 'id':
                return caddyAssigned.staffId
                // break
            case 'image':
                return caddyAssigned.caddyImage
                // break
            case 'assigned?':
                if(caddyAssigned) return true
                else return false
        }
        } else return false;
        
    }

    getBuggyTeeOffDate() {
        return this.teeTimeBooking&&this.teeTimeBooking.slotAssigned.teeOffDate?this.teeTimeBooking.slotAssigned.teeOffDate:''
    }

    getBuggyNumber(x: TeeTimeBookingPlayer) {
        
        let filteredBuggy = this.flightBuggies.filter((buggy:BuggyData)=>{
            if(buggy.id === x.buggyId)
                return true
            else return false;
        })
        let _buggyNo;
        if(filteredBuggy && filteredBuggy.length > 0) {
            _buggyNo = '#'+filteredBuggy[0].buggyNo
        } else if(x && x.pairingNo) _buggyNo = '(Buggy '+x.pairingNo+')'
        else _buggyNo = 'Walking';
        console.log("get buggy number", filteredBuggy, x, this.flightBuggies)
        return _buggyNo;
    }

    onChangeBuggy(bookingId: number, bookingPlayersId: Array<number>,buggyId: number) {
        console.log("on change buggy", bookingId, bookingPlayersId, buggyId)
        let _bookingId; 
        if(bookingId) _bookingId = bookingId;
        let _bookingPlayersId;
        if(bookingPlayersId) _bookingPlayersId = bookingPlayersId;
        let _buggyId;
        if(buggyId) _buggyId = buggyId;

        let loader = this.loadingCtl.create({
            content: "Changing buggy..."
        });

        loader.present().then(()=>{
            this.flightService.changeBuggy(_bookingId, _bookingPlayersId, _buggyId)
            .subscribe((data)=>{
                console.log("change buggy", data)
                if(data && data.resp.status === 200) {
                    // this.teeTimeBooking = data.bookingObject;
                    this.onRefreshFlight(data.bookingObject,loader);
                }
            }, (error)=>{
                loader.dismiss()
            })
       })
    }

    onChangeCaddie(bookingId: number, bookingPlayersId: Array<number>,caddieId: number) {
        console.log("on change buggy", bookingId, bookingPlayersId, caddieId)
        let _bookingId; 
        if(bookingId) _bookingId = bookingId;
        let _bookingPlayersId;
        if(bookingPlayersId) _bookingPlayersId = bookingPlayersId;
        let _caddieId;
        if(caddieId) _caddieId = caddieId;
        let loader = this.loadingCtl.create({
            content: "Changing caddie..."
        });

        loader.present().then(()=>{
            this.flightService.changeCaddy(_bookingId, _bookingPlayersId, _caddieId)
            .subscribe((data)=>{
                console.log("change caddy", data)
                if(data && data.resp.status === 200) {
                    // this.teeTimeBooking = data.bookingObject;
                    this.onRefreshFlight(data.bookingObject, loader);
                }
            }, (error)=>{
                loader.dismiss();
            })
        })


        
    }

    onRefreshFlight(teeTimeBooking: TeeTimeBooking,loader?: any) {
        loader.present().then(()=>{
            this.teeTimeBooking = teeTimeBooking;
            this.bookingPlayers = [];
            this.flightPlayers = [];
            this._buggyPlayers = [];
            this.bookingPlayers.push(...this.teeTimeBooking.bookingPlayers);
            if(this.teeTimeBooking) {
                this.flightBuggies = this.teeTimeBooking.buggiesAssigned;
                this.slotAssigned = this.teeTimeBooking.slotAssigned;
            }
    
            this.flightPlayers = this.bookingPlayers; //this.teeTimeBooking.bookingPlayers;
            this.flightPlayers.sort((a,b)=>{
                if(a.pairingNo < b.pairingNo ) return -1
                else if(a.pairingNo > b.pairingNo ) return 1
                else return 0
            })
            this.flightPlayers = this.getUnique(this.flightPlayers,'pairingNo')
            
    
            this._buggyPlayers = this.teeTimeBooking.bookingPlayers;
            this._buggyPlayers.sort((a,b)=>{
                if(a.pairingNo < b.pairingNo ) return -1
                else if(a.pairingNo > b.pairingNo ) return 1
                else return 0
            })
            
            // if (this.flightPlayers[0].pairingNo === 0) this.flightPlayers.shift();
    
            loader.dismiss();
        })
        
    }

    getBuggyBgClass(player: TeeTimeBookingPlayer) {
        if(!this._buggyPlayers) return 'non-buggy-bg'
        let _currentBuggy = this._buggyPlayers.filter((buggyPlayer: TeeTimeBookingPlayer)=>{
            if(buggyPlayer.pairingNo === player.pairingNo) return true
            else return false
        })
        let _playerCount = _currentBuggy.length;

        if(player.pairingNo === 0) return 'non-buggy-bg';
        else if(player.pairingNo !== 0 && _playerCount === 1) return 'buggy-bg-bag-left';
        else if(player.pairingNo !== 0 && _playerCount === 2) return 'buggy-bg-bag-both';
        // else if(this._buggyPlayers)
        // else return 'buggy-bg'
    }

    getBuggyPlayersInfo(player: TeeTimeBookingPlayer) {
        console.log("buggy players ", this._buggyPlayers);
        console.log("flight players ", this.flightPlayers);
        console.log("selected player ", player);
        let _currentBuggy = this._buggyPlayers.filter((buggyPlayer: TeeTimeBookingPlayer)=>{
            if(buggyPlayer.pairingNo === player.pairingNo) return true
            else return false
        })
        _currentBuggy
    }

    onNotificationsClick() { 
        this.nav.push(NotificationsPage);
    }
}
