import { PlayerDetails } from './../../../data/competition-teams';
import {
    LoadingController,
    ModalController,
    NavController,
    NavParams,
    Platform,
    ToastController,
    ViewController
} from 'ionic-angular';
// import {any, PlayerList, PlayerHomeInfo} from '../../../data/player-data';
import {FriendService} from '../../../providers/friend-service/friend-service';
import {NewContactPage} from '../../new-contact/new-contact';
import {NewGameInfo} from '../../../data/game-round';
import {Keyboard} from '@ionic-native/keyboard';
import {Component} from '@angular/core';
import {MessageDisplayUtil} from '../../../message-display-utils';
import {PlayerService} from '../../../providers/player-service/player-service';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { AlertController } from 'ionic-angular';
import { TeeTimeBookingPlayer, PlayerData, ClubCourseData } from '../../../data/mygolf.data';
// import { PlayerHomeDataService } from '../../../redux/player-home';
import { Observable } from 'rxjs';
import { isTrueProperty } from 'ionic-angular/util/util';
import { ClubFlightService } from '../../../providers/club-flight-service/club-flight-service';
import { PlayerListPage } from '../player-list/player-list';
import { PopoverController } from 'ionic-angular';
import { ClubInfo, CourseInfo } from '../../../data/club-course';
import { ClubService } from '../../../providers/club-service/club-service';
import { CourseBox } from '../course-box/course-box';
import * as moment from 'moment';
import { SelectDatesPage } from '../select-dates/select-dates';

export interface NonMg2uPlayer {
    playerName: string;
    email: string;
    gender: string;
}
@Component({
    templateUrl: 'group-booking-option.html',
    selector: 'group-booking-option-page'
})
export class GroupBookingOption {
    listMode: string                    = 'friends';
    openedModal: boolean                = false;
    playersToExclude: Array<TeeTimeBookingPlayer> = [];
    gameInfo: NewGameInfo;
    // listFriends: PlayerList;

    // friends: Array<any> = [];
    // players: Array<any> = [];
    searchQuery: string        = "";
    searchPlayers: string      = "";

    // availablePlayers: Array<any> = [];
    nonMg2uPlayer: NonMg2uPlayer;
    addPlayerForm: FormGroup;
    playerName: AbstractControl;
    email: AbstractControl;
    gender: AbstractControl;
    phone: AbstractControl;

    _playerName: string;
    _email: string;
    _gender: string = 'M';
    _phone: string;

    isCovid: boolean = true;

    // public playerHomeInfo$: Observable<PlayerHomeInfo>;
    // public player$: Observable<any>;

    // currentPlayerId: number;
    // _newPlayer: any;

    searchByMembership: string;
    searchById: number;
    clubId: number;
    groupBookPlayer: PlayerData;
    clubInfo: ClubInfo;
    fromTime: string = '07:00';
    toTime: string = '10:00';
    selectedCourse: ClubCourseData;
    playersPerFlight: string = '1';
    buggiesPerFlight: string = '1';
    caddiesPerFlight: string = '1';
    groupSlots: number = 5;
    optionCourse: CourseInfo;
    startDate: string = moment().add(1,'days').format("YYYY-MM-DD");
    constructor(private nav: NavController,
        private navParams: NavParams,
        private modalCtl: ModalController,
        private loadCtl: LoadingController,
        private platform: Platform,
        private keyboard: Keyboard,
        private toastCtl: ToastController,
        private friendService: FriendService,
        private playerService: PlayerService,
        private viewCtl: ViewController,
        private fb: FormBuilder,
        private alertCtrl: AlertController,
        // private playerHomeService: PlayerHomeDataService,
        private flightService: ClubFlightService,
        private loadingCtrl: LoadingController,
        private popoverCtl: PopoverController,
        private clubService: ClubService) {
        this.openedModal = navParams.get("openedModal");
        let exclusion    = navParams.get("playersToExclude");
        this.gameInfo    = navParams.get("gameInfo");
        this.clubId      = navParams.get("clubId");
        this.clubInfo    = navParams.get("clubInfo");
        if (exclusion) {
            this.playersToExclude.push(...exclusion);
        }



        this.addPlayerForm = this.fb.group({
            playerName: new FormControl('', [<any>Validators.required, <any>Validators.maxLength(50)]),
            email    : new FormControl('', [<any>Validators.required, <any>Validators.email, <any>Validators.maxLength(50)]),
            gender   : new FormControl('M'),
            phone    : new FormControl('', [<any>Validators.required, Validators.minLength(7),<any>Validators.maxLength(50)]),
        })

        this.playerName = this.addPlayerForm.controls["playerName"];
        this.email      = this.addPlayerForm.controls["email"];
        this.gender     = this.addPlayerForm.controls["gender"];
        this.phone      = this.addPlayerForm.controls["phone"];

        console.log("players to exclude : ", this.playersToExclude);
        

    }

    ionViewDidLoad() {



    }

    ionViewWillLeave() {
        console.log("Leaving the view");
        if (this.platform.is('ios') || this.platform.is('cordova'))
            this.keyboard.close();
    }



    friendSelected(item: any) {
        let _isNewPlayer= item?false:true;

        this.viewCtl.dismiss({
            item: item,
            isCovid: true,
            newPlayer: _isNewPlayer,
            playerDetails: this.addPlayerForm.value,
            playerContact: ''
        });
        // if(this.isCovid) {
        //     this._additionalForm(item);
        // } else {
        //     this.viewCtl.dismiss(item);
        // }
    }

    getImage(item: any) {
        if (item.thumbnail)
            return item.thumbnail;
        // else if (item.photoUrl)
        //     return item.photoUrl;
        else
            return "img/default_user.png";
    }



    newContact() {
        let newContactModal = this.modalCtl.create(NewContactPage, {
            openedAsDialog: true
        });
        newContactModal.onDidDismiss((data: any) => {
            //Check whether the club info is passed
            if (data) {
                this.playerSelected(null, data);
            }
        });
        newContactModal.present();
    }

    playerSelected(event, item: any) {

        if (this.openedModal) {
            this.viewCtl.dismiss(item);
        }
    }

    close() {
        this.viewCtl.dismiss();
    }

  


    _additionalForm(item?: any) {
        let _isNewPlayer = (item)?false:true;
        console.log("is New Player?", _isNewPlayer)
        // <h3 style="color:red">COVID-19 Important Notice</h3>
        let _message = `<img item-left src="assets/img/booking-item-covid.svg" style="float:left;width: 4em;margin: 0.5em;" />
        
        <h4 item-right style="color:red;white-space: normal;">MGA recommends that all players should include their
            addresses for contact tracing</h4>`;
        let alert = this.alertCtrl.create({
            title: 'COVID-19 Important Notice',
            // subTitle: 'Selected date is '+ _date,
            message: _message, //'Selected date is ' + '<b>' + _date + '</b>',
            // buttons: ['Close']
            inputs: [
                {
                    name: 'playerContact',
                    placeholder: 'Enter address'
                }
            ],
            buttons: [{
                text: 'Proceed',
                // role: 'cancel',
                handler: (playerContact) => {
                    console.log("saving playerContact ", playerContact)
                    this.viewCtl.dismiss({
                        item: item,
                        isCovid: true,
                        newPlayer: _isNewPlayer,
                        playerDetails: this.addPlayerForm.value,
                        playerContact: playerContact

                    });
                    // this.nav.push(BookingHomePage, {
                    //     fromBookNow: true
                    // })
                    // console.log('Cancel clicked');
                }
            }
        ]
        });
        alert.present();


        // let newContactModal = this.modalCtl.create(NewContactPage, {
        //     openedAsDialog: true
        // });
        // newContactModal.onDidDismiss((data: any) => {
        //     //Check whether the club info is passed
        //     if (data) {
        //         this.playerSelected(null, data);
        //     }
        // });
        // newContactModal.present();

        
    }

    onKeySearchPlayerByEmail() {
        
        let _valueChanged = this.email.valueChanges.debounceTime(1500).distinctUntilChanged();
        let loader = this.loadingCtrl.create({
            showBackdrop: false,
            duration: 5000,
            content: 'Checking for existing player...'
        });
        // if(this.email.valid && _valueChanged) {
            if(this._email && this._email.length>10) {
        
        // console.log("email value - debounce ", this.email.value)
        
        // console.log("email value - debounce value changed", _valueChanged)
        
            // _valueChanged.subscribe(()=>{
                let _email = this._email; //this.email.value;
                
                // console.log("email value - debounce subscribe ", this.email.value, _email)
                this.flightService.getPlayerByEmail(_email)
                .subscribe((data: Array<any>)=>{
                    loader.dismiss(data).then(()=>{
                        if(data.length>0 && data[0]) {
                            
                        let _data = data[0]
                            // this.addPlayerForm['playerName']= data&&data.playerName?data.playerName:data.firstName+' '+data.lastName;
                            // this.addPlayerForm['gender'] = data&&data.gender?data.gender:'M';
                            // this.addPlayerForm['phone'] = data.address&&data.address.phone1?data.address.phone1:null;
                            this._playerName = (_data&&_data.playerName)?_data.playerName:'';
                            this._gender = (_data&&_data.gender)?_data.gender:'M';
                            this._phone = (_data.addressInfo&&_data.addressInfo.phone1)?_data.addressInfo.phone1:null;
                            console.log("data - ", _data);
                            // this._newPlayer = _data;
                            
                            // let msg = MessageDisplayUtil.getErrorMessage('Player Found', "Player found");
                            MessageDisplayUtil.showErrorToast('Player Found', this.platform, this.toastCtl, 5000, "bottom");
                        }
                        
                    })
                })
            // })
        }
        // if(this.email.valid) {
        //     console.log("email value ", this.email.value)
            // this.flightService.getPlayerByEmail(this.email.value)
            // .subscribe((data)=>{
            //     console.log("data")
            // })
        // }
    }
    
    // onSearchPlayerByEmail() {
    //     if(this.email.valid) {
    //         this.flightService.getPlayerByEmail(this.email.value)
    //         .subscribe((data)=> {
    //             console.log("after add player data")
    //         })
    //     }
    // }

    // checkAddMe() {
    //     let _hasMe: boolean = false;
    //     console.log("check add me : ", this.playersToExclude, this.currentPlayerId)
    //     // this.playersToExclude.filter((tbp: TeeTimeBookingPlayer)=>{
    //     //    if(this.currentPlayerId && tbp.player.id === this.currentPlayerId) _hasMe = true
    //     //    else _hasMe = false
    //     // })
        
    //     console.log("check add me : ", _hasMe);
    //     return _hasMe;
    // }
    searchBookingPlayer(slot: number) {
        // if (this.bookingSlot.bookingStatus === 'PaymentFull') {
        //     MessageDisplayUtil.showMessageToast('Full Payment have been made. Adding/Removing player is disabled.',
        //         this.platform, this.toastCtl, 3000, "bottom")
        //     return false;
        // }
        if (!this.searchById && !this.searchByMembership) {
            // this.searchByMembership[slot].length === 0
            let alert = this.alertCtrl.create({
                title: 'Selecting player',
                // subTitle: 'Selected date is '+ _date,
                message: 'Enter membership / myG2u ID', //'Selected date is ' + '<b>' + _date + '</b>',
                buttons: ['Close']
            });
            alert.present();

            return false;
        }

        let loader = this.loadingCtrl.create({
            showBackdrop: false,
            duration: 5000,
            content: 'Getting player...'
        });



        let _searchBy;

        console.log("this.searchbyid[slot] : ", this.searchById);
        console.log("slot : ", slot)
        // console.log("clubs : ", this.clubs);
        // console.log("club : ", this.bookingSlot.clubData.id)
        loader.present().then(() => {
            if (this.searchById && this.searchById > 0) {
                _searchBy = this.searchById;
                console.log("searchby - player id : ", _searchBy)
                this.flightService.getPlayerById(_searchBy)
                    .subscribe((response: any) => {
                        loader.dismiss().then(() => {
                            let player = response.json();
                            // let _playerDetails: TeeTimeBookingPlayer = {};
                            // _playerDetails['walking'] = this.buggyRequired ? !this.buggyRequired : true
                            // _playerDetails['caddySelectionCriteria'] = {}
                            // _playerDetails['caddySelectionCriteria']['caddyRequired'] = this.caddyRequired ? this.caddyRequired : false
                            console.log("search player by id : ", player, " | searchBy : ", _searchBy)
                            if (player) {
                                this.groupBookPlayer = player;
                                // this.checkBookingPlayer(player).then((playerOk) => {
                                //     console.log("checkbookingplayer search :", playerOk)
                                //     // if (playerOk) this.addPlayerToBooking({
                                //     //     playerId: player.id,
                                //     //     sequence: slot,
                                //     //     playerDetails: _playerDetails,
                                //     // });
                                // }, (error) => {
                                //     console.log("checkbookingplayer error : ", error)
                                // })

                            } else {
                                let alert = this.alertCtrl.create({
                                    title: 'myGolf2u ID',
                                    // subTitle: 'Selected date is '+ _date,
                                    message: 'No player found for MG2U ID : <br>' + _searchBy, //'Selected date is ' + '<b>' + _date + '</b>',
                                    buttons: ['Close']
                                });
                                alert.present();
                            }
                        }, (error) => {
                            loader.dismiss().then(() => {
                                if (error.status !== 200) {
                                    let alert = this.alertCtrl.create({
                                        title: 'MyGolf2u ID',
                                        // subTitle: 'Selected date is '+ _date,
                                        message: 'No player found for MG2U ID : <br>' + _searchBy, //'Selected date is ' + '<b>' + _date + '</b>',
                                        buttons: ['Close']
                                    });
                                    alert.present();
                                }
                            });
                            console.log("player id error : ", error)


                        });

                    });
            } 
            else if (this.searchByMembership && this.searchByMembership.length > 0) {
                _searchBy = this.searchByMembership;
                console.log("searchby - player membership : ", _searchBy)


                this.flightService.searchPlayerByMembership(_searchBy, this.clubId)
                    .subscribe((player: Array < PlayerData > ) => {
                        loader.dismiss().then(() => {
                            let _playerDetails: TeeTimeBookingPlayer = {};
                            // _playerDetails['walking'] = this.buggyRequired ? !this.buggyRequired : true
                            _playerDetails['caddySelectionCriteria'] = {}
                            // _playerDetails['caddySelectionCriteria']['caddyRequired'] = this.caddyRequired ? this.caddyRequired : false
                            console.log("search player by membership", player)
                            if (player && player.length > 0) {
                                let popover = this.popoverCtl.create(PlayerListPage, {
                                    // slot: slot,
                                    headerName: 'Players by Membership',
                                    playerList: player,
                                    forResultOnly: true
                                    // buggies: this.buggySlots,
                                    // courses: this.courses
                                }, {
                                    showBackdrop: true
                                });
                                popover.onDidDismiss((data: any) => {
                                    if (data && data.selected) {
                                        this.checkBookingPlayer(data.player).then((playerOk) => {
                                            console.log("checkbookingplayer :", playerOk)
                                            // if (playerOk) this.addPlayerToBooking({
                                            //     playerId: data.player.id,
                                            //     sequence: slot,
                                            //     playerDetails: _playerDetails,
                                            // });
                                        })

                                    }
                                });
                                popover.present({
                                    ev: event
                                });
                            } else {
                                let alert = this.alertCtrl.create({
                                    title: this.clubInfo.clubName,
                                    // subTitle: 'Selected date is '+ _date,
                                    message: 'Club membership number ' + _searchBy + ' does not exist for this club', //'Selected date is ' + '<b>' + _date + '</b>',
                                    buttons: ['Close']
                                });
                                alert.present();
                            }

                        })

                    })



            }
        });

    }

    clearSearchPlayer(slot: number) {
        this.searchByMembership = null;
        this.searchById = null;
    }
    checkBookingPlayer(any ? : any): Promise < boolean > {
        let _playerOk: boolean;
        return new Promise < any > (resolve => {
            // this.bookingSlot.bookingPlayers.forEach((tbp: TeeTimeBookingPlayer) => {
            //     console.log("checkbookingplayer booking players : ", tbp);
            //     console.log("checkbookingplayer any : ", any);
            //     if (tbp.player && tbp.player.id === any.id) {

            //         _playerOk = false;
            //         let alert = this.alertCtrl.create({
            //             // title: 'Remove Player',
            //             // subTitle: 'Selected date is '+ _date,
            //             message: 'Player is already in the flight', //'Selected date is ' + '<b>' + _date + '</b>',
            //             buttons: ['Close']
            //             // buttons: [{
            //             //         text: 'Close',
            //             //         handler: () => {
            //             //             // console.log('Cancel clicked');
            //             //         }
            //             //     }
            //             // ]
            //         });
            //         alert.present();
            //     } else _playerOk = true;

            // })
            console.log("checkbookingplayer promise resolve : ", _playerOk)
            resolve(_playerOk)
        })
        // return _playerOk;
    }

    onDeleteBookingPlayer(slot: number) {
        this.groupBookPlayer = null;
        // player: TeeTimeBookingPlayer
        // console.log("on deleting player : ", player)
        // let alert = this.alertCtrl.create({
        //     title: 'Remove Player',
        //     // subTitle: 'Selected date is '+ _date,
        //     message: 'Removing selected player from booking. Do you want to proceed?', //'Selected date is ' + '<b>' + _date + '</b>',
        //     // buttons: ['Close']
        //     buttons: [{
        //             text: 'Remove player',
        //             handler: () => {
        //                 this.deleteBookingPlayer(player);
        //                 // console.log('Cancel clicked');
        //             }
        //         },
        //         {
        //             text: 'Close',
        //         }
        //     ]
        // });
        // alert.present();
    }
    onSelectCourse(event) {
        this.clubService.getClubCourses(this.clubId)
            .subscribe((courses: Array < CourseInfo > ) => {
                console.log("get club courses : ", courses)
                let popover = this.popoverCtl.create(CourseBox, {
                    fromStarterList: true,
                    courses: courses,
                    excludeAll: false,
                });
                popover.onDidDismiss((data: CourseInfo) => {
      
                    // this.getFlightStarterList();
                    if (data) {
                        if(data && data.courseId === 0) data.courseName = 'Any Available Courses'
                        // this.optionCourse = {}; 
                        // this.gameInfo.courses.push(data);
                        console.log("select course - data : ", data)
                        this.optionCourse = data;
                        // this.refreshTeeSlots({
                        //   clubCourseId: data.courseId,
                        //   isClub: false
                        // });
                    }
                });
                popover.present({
                    ev: event
                });
            })
        }
        onSelectTimes() {
            let times = this.modalCtl.create(SelectDatesPage, {
                type: 'times',
                range: true,
                fromTime: this.fromTime,
                toTime: this.toTime,
            });
    
            times.onDidDismiss((data: any) => {
                if(data) {
                    this.fromTime = data.fromTime;
                    this.toTime = data.toTime;
                }
            });
    
            times.present();
        }
      
}
