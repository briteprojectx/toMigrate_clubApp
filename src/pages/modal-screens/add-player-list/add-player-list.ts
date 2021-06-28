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
import {PlayerInfo, PlayerList, PlayerHomeInfo, createPlayerList, createPlayerInfo} from '../../../data/player-data';
import {FriendService} from '../../../providers/friend-service/friend-service';
import {NewContactPage} from '../../new-contact/new-contact';
import {NewGameInfo} from '../../../data/game-round';
import {Keyboard} from '@ionic-native/keyboard';
import {Component} from '@angular/core';
import {MessageDisplayUtil} from '../../../message-display-utils';
import {PlayerService} from '../../../providers/player-service/player-service';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { AlertController } from 'ionic-angular';
import { TeeTimeBookingPlayer, PlayerData, ClubMembership } from '../../../data/mygolf.data';
import { PlayerHomeDataService } from '../../../redux/player-home';
import { Observable } from 'rxjs';
import { isTrueProperty } from 'ionic-angular/util/util';
import { ClubFlightService } from '../../../providers/club-flight-service/club-flight-service';
import { JsonService } from '../../../json-util';

export interface NonMg2uPlayer {
    playerName: string;
    email: string;
    gender: string;
}
@Component({
    templateUrl: 'add-player-list.html',
    selector: 'add-player-list-page'
})
export class AddPlayerListPage {
    listMode: string                    = 'friends';
    openedModal: boolean                = false;
    playersToExclude: Array<TeeTimeBookingPlayer> = [];
    gameInfo: NewGameInfo;
    listFriends: PlayerList;

    friends: Array<PlayerInfo> = [];
    players: Array<any> = [];
    playerList: PlayerList;
    searchQuery: string        = "";
    searchPlayers: string      = "";

    availablePlayers: Array<PlayerInfo> = [];
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

    public playerHomeInfo$: Observable<PlayerHomeInfo>;
    public player$: Observable<PlayerInfo>;

    currentPlayerId: number;
    _newPlayer: PlayerInfo;
    fromClub: boolean;
    infiniteComplete: boolean = false;
    registerThisPlayer: boolean = true;
    clubSelectedPlayers: Array<PlayerInfo> = new Array<PlayerInfo> ();

    maxPlayers: number;
    teeSlotNew: boolean = false;
    forBooking: boolean = false;

    clubId: number;
    clubMembers: Array<ClubMembership> = new Array<ClubMembership> ();

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
        private playerHomeService: PlayerHomeDataService,
        private flightService: ClubFlightService,
        private loadingCtrl: LoadingController) {
        this.openedModal = navParams.get("openedModal");
        let exclusion    = navParams.get("playersToExclude");
        this.gameInfo    = navParams.get("gameInfo");
        this.fromClub    = navParams.get("fromClub");
        if(this.fromClub) this.clubId      = navParams.get("clubId");
        if (exclusion) {
            this.playersToExclude.push(...exclusion);
        }

        this.listFriends = {
            totalPages : 0,
            currentPage: 0,
            totalItems : 0,
            totalInPage: 0,
            success    : true,
            players    : new Array<PlayerInfo>()
        };
        // if (this.gameInfo && this.gameInfo.availablePlayers && this.gameInfo.availablePlayers.length) {
        //     this.listFriends.players = this.gameInfo.availablePlayers.filter((p: PlayerInfo) => {
        //         let found = this.playersToExclude.filter(pl => {
        //             return pl.player.id === p.playerId;
        //         });
        //         return found.length === 0;
        //     });
        // }

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

        if(this.fromClub) {
            this.listMode = 'others';
        } else {
            this.playerHomeInfo$      = this.playerHomeService.playerHomeInfo();
            this.player$              = this.playerHomeInfo$
                                            .filter(Boolean)
                                            .map((playerHome: PlayerHomeInfo) => playerHome.player);
            this.player$.take(1).subscribe((player: PlayerInfo) => {
                this.currentPlayerId = player.playerId
            });
        }
        
        console.log("players to exclude : ", this.playersToExclude);
        this.playerList = createPlayerList();

        this.maxPlayers = this.navParams.get("maxPlayers");
        this.teeSlotNew = this.navParams.get("teeSlotNew");
        console.log("add players - ", this.maxPlayers, this.teeSlotNew);
        this.clubSelectedPlayers.pop();
        this.forBooking = this.navParams.get("forBooking");
        

    }

    ionViewDidLoad() {

        if(!this.fromClub) {
            if (!this.listFriends.players.length)
            this._refreshValues();
        else {
            this._filterOnSearch();
            // if(this.listMode === 'member') 
            if(this.fromClub) this.refreshClubMembersList();
        }
        }
        

    }

    ionViewWillLeave() {
        console.log("Leaving the view");
        if (this.platform.is('ios') || this.platform.is('cordova'))
            this.keyboard.close();
    }

    onSearchInput() {
        this._filterOnSearch();
    }

    onSearchPlayers(refresher?, infinite?) {
        console.log('search players pe : ', this.playersToExclude)
        console.log('search players search : ', this.searchPlayers)
        console.log("search players : ", refresher, infinite, this.infiniteComplete)
        if(this.listMode === 'members') {
            this.refreshClubMembersList();
            return;
        }
        if(!infinite || !this.infiniteComplete) {
            this.playerList = createPlayerList();
            this.players = [];
        }
        if (!this.searchPlayers)
            this.players = [];
        else {
            let loader = this.loadingCtrl.create({
                showBackdrop: false,
                duration: 5000,
                content: 'Searching for player...'
            });
            if(!infinite) this.players = [];

            loader.present().then(()=>{
                        let _search = this.searchPlayers;
                        let _letters = /[0-9]/
                        //  /^[a-zA-Z]+$/;
                        console.log("search by id : ", _search, _letters, _search.match(_letters))
                        if(_search.match(_letters) && !infinite) {
                            this.flightService.getPlayerById(Number(_search))
                                    .subscribe((response: any) => {
                                        let _data;
                                        if(response && response.status === 200) {
                                            _data = response.json();
                                            _data.playerId = _data.id;
                                            JsonService.deriveFullUrl(_data, "profile");
                                            JsonService.deriveFullUrl(_data, "image");
                                            if(this.playersToExclude.length > 0) {
                                                this.playersToExclude.find((pe)=>{
                                                    if(pe && pe.player && pe.player.id === _data.id)
                                                        return false
                                                    else this.players.unshift(_data);
                                                })
                                            } else this.players.unshift(_data);
                                        }
                                        console.log("get player by id ", response.json())
                                    });
                        // if(typeof this.searchPlayers === 'string') {
                            // let msg = 'Please enter valid mg2u ID';
                            // MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl, 5000, "bottom");
                            // return false;
                        }
                        
                        

                this.playerService.searchPlayers(this.searchPlayers, true, this.playerList.currentPage + 1)
                .subscribe((playerList: PlayerList) => {
                    loader.dismiss().then(()=>{
                        console.log("search players ALL : ", playerList)
                        if (playerList.totalPages > 0)
                            this.playerList.currentPage++;

                        if (playerList && playerList.players) {
                            let _players = playerList.players.filter(p => {
                                let excluded = this.playersToExclude.find((pe => {
                                    if((pe && pe.player && pe.player.id) && p && p.playerId) 
                                    return pe.player.id === p.playerId;
                                    else return false
                                }));
                                let clubSelected = this.clubSelectedPlayers.find(cp =>{
                                    if(cp.playerId === p.playerId) return true
                                    else return false
                                });
                                return !excluded && !clubSelected;
                            });

                            this.playerList = playerList;
                            this.playerList.currentPage = playerList.currentPage;
                            this.playerList.totalPages = playerList.totalInPage;
                            this.playerList.totalItems = playerList.totalItems;
                            this.playerList.players.push(..._players);
                            this.players.push(..._players);

                            // this.players = playerList.players.filter(p => {
                            //     let excluded = this.playersToExclude.find((pe => {
                            //         if((pe && pe.player && pe.player.id) && p && p.playerId) return pe.player.id === p.playerId;
                            //         else return false
                            //     }));
                            //     return !excluded;
                            // });
                        }
                    })
                    
                }, (error)=>{
                    loader.dismiss();
                }, () => {
                    if (infinite) {
                        infinite.complete();
                    }
                });
            });
            
        }
            
    }

    friendSelected(item: PlayerInfo) {
        if(this.clubSelectedPlayers && this.clubSelectedPlayers.length > 0 ) return false;
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

    memberSelected(item: PlayerData) {
        if(this.clubSelectedPlayers && this.clubSelectedPlayers.length > 0 ) return false;
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
        // PlayerInfo
        if (item.thumbnail)
            return item.thumbnail;
        else if (item.photoUrl)
            return item.photoUrl;
        else if (item.profile)
            return item.profile;
        else if (item.image)
            return item.image;
        else
            return "img/default_user.png";
    }

    private _refreshValues() {
        let busy = this.loadCtl.create({
            content: "Please wait...",
            duration    : 5000,
        });
        busy.present().then(() => {
            this.friendService.searchFriends("", true)
                .subscribe((friendRequests: PlayerList) => {
                    busy.dismiss().then(() => {
                        this.listFriends.players       = friendRequests.players.filter(p => {
                            let found = this.playersToExclude.filter(pl => {
                                if(pl.player) 
                                    return pl.player.id === p.playerId;
                            });
                            return found.length === 0;
                        });
                        // this.gameInfo.
                        this.availablePlayers = this.listFriends.players;
                        // this._filterOnSearch();
                        this.friends                   = this.listFriends.players;
                        // if(this.searchQuery && this.searchQuery.length > 0) {
                        //     this.listFriends.players = this.listFriends.players.filter((p: PlayerInfo)=>{
                        //         if(p.playerName.toLowerCase().includes(this.searchQuery.toLowerCase()))
                        //             return true
                        //         if(p.email.toLowerCase().includes(this.searchQuery.toLowerCase()))
                        //             return true
                        //     })
                        //     this.friends = this.listFriends.players
                        //     this.availablePlayers = this.listFriends.players;
                        // }
                    });

                }, (error) => {
                    busy.dismiss().then(() => {
                        let msg = MessageDisplayUtil.getErrorMessage(error, "Error getting friend list");
                        MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl, 5000, "bottom");
                    })
                });
        });

    }

    private _filterOnSearch() {
        if (!this.searchQuery)
            this.friends = this.listFriends.players;
        else {
            this.friends = this.listFriends.players.filter((p: PlayerInfo) => {
                let name;
                let firstName;
                let lastName;
                if(!p) return false
                // || !p.playerName || !p.firstName || !p.lastName
                if(p.playerName) name = p.playerName.toLowerCase();
                if(p.firstName) firstName = p.firstName.toLowerCase();
                if(p.lastName) lastName = p.lastName.toLowerCase();

                if (name && name.indexOf(this.searchQuery.toLowerCase()) >= 0)
                    return true;
                else if (firstName && firstName.indexOf(this.searchQuery.toLowerCase()) >= 0)
                    return true;
                else if (lastName && lastName.indexOf(this.searchQuery.toLowerCase()) >= 0)
                    return true;
                else return false;
            })
        }
    }

    newContact() {
        let newContactModal = this.modalCtl.create(NewContactPage, {
            openedAsDialog: true
        });
        newContactModal.onDidDismiss((data: PlayerInfo) => {
            //Check whether the club info is passed
            if (data) {
                this.playerSelected(null, data);
            }
        });
        newContactModal.present();
    }

    playerSelected(event, item: PlayerInfo) {

        if (this.openedModal) {
            this.viewCtl.dismiss(item);
        }
    }

    close() {
        this.viewCtl.dismiss();
    }

    addMultiPlayers() {
        if(this.clubSelectedPlayers && this.clubSelectedPlayers.length === 0) return false;
        // let item = this._newPlayer?this._newPlayer.playerName?this._newPlayer:null:null;
        // let _isNewPlayer = item?false:true;
        this.viewCtl.dismiss({
            item: this.clubSelectedPlayers,
            isCovid: true,
            newPlayer: false,
            // playerDetails: this.addPlayerForm.value,
            playerDetails: {},
            playerContact: '',//playerContact
            multiPlayers: true,
            // registerThisPlayer: this.registerThisPlayer
        });
    }

    addPlayer() {
        if(this.registerThisPlayer) {
            if(!this._email || !this._playerName || this._email.length === 0 || this._playerName.length === 0) {
                MessageDisplayUtil.showErrorToast('Please fill-in Player Name and Email Address', this.platform, this.toastCtl, 5000, "bottom");
                return false;
            }
            if(!this.emailIsValid(this._email)) {
                MessageDisplayUtil.showErrorToast('Please use valid Email Address', this.platform, this.toastCtl, 5000, "bottom");
                return false;
            }
        } else if(!this.registerThisPlayer) {
            if(!this._playerName || this._playerName.length === 0) {
            MessageDisplayUtil.showErrorToast('Please fill-in Player Name', this.platform, this.toastCtl, 5000, "bottom");
                return false;
            }
        }
        console.log("add player - info : ", this._newPlayer)
        let item = this._newPlayer?this._newPlayer.playerName?this._newPlayer:null:null;
        let _isNewPlayer = item?false:true;
        this.viewCtl.dismiss({
            item: item,
            isCovid: true,
            newPlayer: _isNewPlayer,
            // playerDetails: this.addPlayerForm.value,
            playerDetails: {
                email: this._email,
                playerName: this._playerName,
                gender: this._gender,
                phone: this._phone
            },
            playerContact: '',//playerContact
            registerThisPlayer: this.registerThisPlayer

        });
        // if(this.isCovid) {
        //     this._additionalForm();
        // } else {
        //     this.viewCtl.dismiss({
        //         newPlayer: true,
        //         playerDetails: this.addPlayerForm,
        //         // playerContact: playerContact

        //     });
        // }
    }

    addMeself() {
        
        this.player$.take(1).subscribe((player: PlayerInfo) => {
            this.viewCtl.dismiss({
                item: player,
                isCovid: true,
                newPlayer: false,
                playerDetails: '',//this.addPlayerForm.value,
                playerContact: '',//playerContact

            });
            // if(this.isCovid) {
            //     this._additionalForm(player);
            // } else {
            //     this.viewCtl.dismiss(player);
            // }
            // this.viewCtl.dismiss(player)
            });
        
    }

    _additionalForm(item?: PlayerInfo) {
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
        // newContactModal.onDidDismiss((data: PlayerInfo) => {
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
                .subscribe((data: Array<PlayerInfo>)=>{
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
                            this._newPlayer = _data;
                            
                            // let msg = MessageDisplayUtil.getErrorMessage('Player Found', "Player found");
                            MessageDisplayUtil.showErrorToast('Player Found', this.platform, this.toastCtl, 5000, "bottom");
                        } else this._newPlayer = createPlayerInfo();
                        
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

    doInfinite(infinite) {
        console.log("do infinite : ", infinite);
        console.log("playerList : ",this.playerList);
        console.log("Playar List : " +this.playerList.totalPages, "current page : "+ this.playerList.currentPage, "total pages : " + this.playerList.totalPages)
        console.log("do infinite : ", this.isMore())

        this.infiniteComplete = this.isMore();
        if (this.isMore()) {
            this.onSearchPlayers(null,infinite);
            // this._refreshPlayer(null, infinite);
        }
        else {
            // this.infiniteComplete = true;
            infinite.complete();
            // infinite.enable(false);
        }

    }

    public isMore() {
        return this.playerList.totalPages > 0 && this.playerList.currentPage < this.playerList.totalPages;
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

    onAddMulti(player: any) {
        if(this.clubSelectedPlayers.length >= this.maxPlayers) return false; 
        if(this.listMode === 'others' && player) {
            this.clubSelectedPlayers.push(player);
            this.players = this.players.filter((p: PlayerInfo)=>{
                return p.playerId !== player.playerId
            })
        } else if(this.listMode === 'members' && player) {
            this.clubSelectedPlayers.push(player);
            this.clubMembers = this.clubMembers.filter((p: ClubMembership)=>{
                return p.player.id !== player.id
            })
        }
    }

    getClubSelectedPlayers() {
        let _playersList = '';
        this.clubSelectedPlayers.forEach((p: PlayerInfo, idx: number)=>{
            console.log("club player select - ", idx, p)
            // if(idx > 0) 
            _playersList += p.playerName + ', '
        });
        return _playersList; //.slice(0,-1);// .substring(0,_playersList.length-1);
    }

    clearClubSelectedPlayers() {
        this.clubSelectedPlayers.pop();
        this.onSearchPlayers();
    }

    emailIsValid (email) {
        console.log("email is : ", email);
        console.log("email is valid : ", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      }

      refreshClubMembersList(search?: string) {
          let _clubId = this.clubId;
          let _activeOnly = true;
          let _search = search?search:this.searchPlayers;
          this.clubMembers = [];
          let _status = null;
          let _params = {
              activeOnly: _activeOnly,
              search: _search,
            //   status: _status,
          }
          this.flightService.getClubMembersList(_clubId, _params)
          .subscribe((data: Array<ClubMembership>)=>{
              console.log(`club members : `, data)
              if(data && data.length > 0) 
                this.clubMembers = data.filter((cm: ClubMembership)=>{
                    let _exclude;
                    this.playersToExclude.filter((bp)=>{
                        if(bp.player.id === cm.player.id) _exclude = true
                    })
                    return !_exclude;
                });
          })
      }

    //   onSearchMembers() {
    //       let _search = this.searchPlayers;
    //       this.refreshClubMembersList(_search);
    //   }

    onSearchById() {
        let _search = this.searchPlayers;
        let _letters = /[^0-9]/
        //  /^[a-zA-Z]+$/;
        console.log("search by id : ", _search, _letters, _search.match(_letters))
        if(_search.match(_letters)) {
        // if(typeof this.searchPlayers === 'string') {
            let msg = 'Please enter valid mg2u ID';
            MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl, 5000, "bottom");
            return false;
        }
        
        this.flightService.getPlayerById(Number(_search))
                    .subscribe((response: any) => {
                        let _data;
                        if(response && response.status === 200) {
                            _data = response.json();
                            _data.playerId = _data.id;
                            this.players.push(_data);
                        }
                        console.log("get player by id ", response.json())
                    });

    }
}
