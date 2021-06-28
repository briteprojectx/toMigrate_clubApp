import { AddressData, CountryData } from './../../../data/mygolf.data';
import { Country } from './../../../data/country-location';
import {
    LoadingController,
    ModalController,
    NavController,
    NavParams,
    Platform,
    ToastController,
    ViewController
} from 'ionic-angular';
import {PlayerInfo, PlayerList, PlayerHomeInfo} from '../../../data/player-data';
import {FriendService} from '../../../providers/friend-service/friend-service';
import {NewContactPage} from '../../new-contact/new-contact';
import {NewGameInfo} from '../../../data/game-round';
import {Keyboard} from '@ionic-native/keyboard';
import {Component, ElementRef, ViewChild} from '@angular/core';
import {MessageDisplayUtil} from '../../../message-display-utils';
import {PlayerService} from '../../../providers/player-service/player-service';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { AlertController } from 'ionic-angular';
import { TeeTimeBookingPlayer, PlayerData } from '../../../data/mygolf.data';
import { PlayerHomeDataService } from '../../../redux/player-home';
import { Observable } from 'rxjs';

export interface NonMg2uPlayer {
    playerName: string;
    email: string;
    gender: string;
}
@Component({
    templateUrl: 'player-address.html',
    selector: 'player-address-page'
})
export class PlayerAddressPage {
    listMode: string                    = 'friends';
    openedModal: boolean                = false;
    playersToExclude: Array<TeeTimeBookingPlayer> = [];
    gameInfo: NewGameInfo;
    listFriends: PlayerList;

    friends: Array<PlayerInfo> = [];
    players: Array<PlayerInfo> = [];
    searchQuery: string        = "";
    searchPlayers: string      = "";

    availablePlayers: Array<PlayerInfo> = [];
    nonMg2uPlayer: NonMg2uPlayer;
    playerAddressForm: FormGroup;
    address1: AbstractControl;
    address2: AbstractControl;
    city: AbstractControl;
    postcode: AbstractControl;
    state: AbstractControl;
    phone1: AbstractControl;
    phone2: AbstractControl;
    playerContact: AbstractControl;
    // country

    _address1: string;
    _address2: string;
    _city: string;
    _postCode: string;
    _state: string;
    _phone1: string;
    _phone2: string;
    _playerContact: string;

    _address: AddressData;

    isCovid: boolean = true;

    public playerHomeInfo$: Observable<PlayerHomeInfo>;
    public player$: Observable<PlayerInfo>;

    currentPlayerId: number;

    player: TeeTimeBookingPlayer;
    playerContactA: string;
    @ViewChild('myInput') myInput: ElementRef;

    newPlayer: boolean = false;
    public countryList: Array<Country>;
    countryId: string;

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
        private playerHomeService: PlayerHomeDataService) {
        this.openedModal = navParams.get("openedModal");
        let exclusion    = navParams.get("playersToExclude");
        this.gameInfo    = navParams.get("gameInfo");
        this.player      = navParams.get("player");
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

        this.playerAddressForm = this.fb.group({
            address1 : new FormControl('',[<any>Validators.required, <any>Validators.maxLength(50)]),
            address2 : new FormControl('',[<any>Validators.required, <any>Validators.maxLength(50)]),
            city : new FormControl('',[<any>Validators.required, <any>Validators.maxLength(50)]),
            postcode : new FormControl('',[<any>Validators.required, <any>Validators.maxLength(50)]),
            state : new FormControl('',[<any>Validators.required, <any>Validators.maxLength(50)]),
            phone1 : new FormControl('',[<any>Validators.required,Validators.minLength(7), <any>Validators.maxLength(50)]),
            phone2 : new FormControl('',[<any>Validators.required,Validators.minLength(7), <any>Validators.maxLength(50)]),
            playerContact : new FormControl('',[<any>Validators.required, <any>Validators.maxLength(50)]),

        })

        this.address1 = this.playerAddressForm.controls["address1"];
        this.address2 = this.playerAddressForm.controls["address2"];
        this.city     = this.playerAddressForm.controls["city"];
        this.postcode = this.playerAddressForm.controls["postcode"];
        this.state    = this.playerAddressForm.controls["state"];
        this.phone1   = this.playerAddressForm.controls["phone1"];
        this.phone2   = this.playerAddressForm.controls["phone2"];
        this.playerContact = this.playerAddressForm.controls["playerContact"];

        this.playerHomeInfo$      = this.playerHomeService.playerHomeInfo();
        this.player$              = this.playerHomeInfo$
                                        .filter(Boolean)
                                        .map((playerHome: PlayerHomeInfo) => playerHome.player);
        console.log("players to exclude : ", this.playersToExclude);
        console.log("players address : ")
        this._address = {
            address1 : '',
            address2 : '',
            city : '',
            postCode : '',
            state : '',
            phone1 : '',
            phone2 : '',
            countryData: {
                id: 'MYS'
            }
        }

        if(this.player.player && this.player.player.address) {
            this._address = this.player.player.address;
            if(!this._address.countryData) this._address = {countryData: {id: 'MYS'}};
            this.newPlayer = false;
        } else {
            this._address = {
                address1 : '',
                address2 : '',
                city : '',
                postCode : '',
                state : '',
                phone1 : '',
                phone2 : '',
                countryData: {
                    id: 'MYS'
                }
            }
            this.newPlayer = true;
        }
        let _player = this.player;
        console.log("players address : ", this._address, this.player)
        if(this._address) {
            // this._address1 = _address.address1;
            // this._address2 = _address.address2;
            // this._city = _address.city;
            // this._postCode = _address.postCode;
            // this._state = _address.state;
            // this._phone1 = _address.phone1;
            // this._phone2 = _address.phone2;
            // this._playerContact = '';
            // this.playerAddressForm.setValue({
            //     address1: _address.address1,
            //     address2: _address.address2,
            //     city: _address.city,
            //     postcode: _address.postCode,
            //     state: _address.state,
            //     phone1: _address.phone1,
            //     phone2: _address.phone2,
            //     playerContact: ''
            // })
            // this.playerAddressForm.get('address1').setValue()
            // this.playerAddressForm.address1.setValue(_address.address1);
            // this.address2.setValue(_address.address2);
            // this.city.setValue(_address.city);
            // this.postcode.setValue(_address.postCode);
        } else {
            this.playerContactA = this.player.playerContact;
        }
        

    }


resize() {
    this.myInput.nativeElement.style.height = this.myInput.nativeElement.scrollHeight + 'px';
}

    ionViewDidLoad() {
        this.getCountry();

        // if (!this.listFriends.players.length)
        //     this._refreshValues();
        // else {
        //     this._filterOnSearch();
        // }

    }

    getCountry() {
        this.playerService.getCountryList()
                .subscribe((data: Array<Country>) => {
                            // console.log("Country Sign Up : ",data)
                            this.countryList = data;
                            // console.log("Country List Sign Up : ", this.countryList)
        });
    }

    ionViewWillLeave() {
        console.log("Leaving the view");
        if (this.platform.is('ios') || this.platform.is('cordova'))
            this.keyboard.close();
    }

    onSearchInput() {
        this._filterOnSearch();
    }

    onSearchPlayers() {
        if (!this.searchPlayers)
            this.players = [];
        else
            this.playerService.searchPlayers(this.searchPlayers, true, 1)
                .subscribe((playerList: PlayerList) => {
                    if (playerList && playerList.players) {
                        this.players = playerList.players.filter(p => {
                            let excluded = this.playersToExclude.find((pe => {
                                return pe.player.id === p.playerId;
                            }));
                            return !excluded;
                        });
                    }
                });
    }

    friendSelected(item: PlayerInfo) {
        if(this.isCovid) {
            this._additionalForm(item);
        } else {
            this.viewCtl.dismiss(item);
        }
    }

    getImage(item: PlayerInfo) {
        if (item.thumbnail)
            return item.thumbnail;
        else if (item.photoUrl)
            return item.photoUrl;
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
                let name = p.playerName;
                if (name && name.indexOf(this.searchQuery) >= 0)
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
        this.viewCtl.dismiss({
            save: false
        });
    }
    updateContact() {
        console.log("updating contact - address: ", this._address)
        console.log("updating contact - player : ", this.player)
        // if(this._address.address1
        //     && this._address.phone1
        //     && this._address.city
        //     && this._address.state
        //     && this._address.postCode) {}
        //     else {
        //         let _message = 'Address 1, City, State, Postal Code, Phone 1'
        //         let alert = this.alertCtrl.create({
        //             title: 'These details are required',
        //             message: _message, //'Selected date is ' + '<b>' + _date + '</b>',
        //             // buttons: ['Close']
        //             buttons: [{
        //                 text: 'Close',
        //                 // role: 'cancel',
        //                 handler: (playerContact) => {
        //                     // console.log("saving playerContact ", playerContact)
        //                     this.viewCtl.dismiss({
        //                         save: true,
        //                         player: this.player,
        //                         newPlayer: this.newPlayer,
        //                         playerContact: this.playerContactA
        //                     })
        //                     // this.nav.push(BookingHomePage, {
        //                     //     fromBookNow: true
        //                     // })
        //                     // console.log('Cancel clicked');
        //                 }
        //             }
        //         ]
        //         });
        //         alert.present();
        //     }
        console.log("saving player contact : ", this.player, this.playerContactA, this.newPlayer)
        this.viewCtl.dismiss({
            save: true,
            player: this.player,
            newPlayer: this.newPlayer,
            address: this._address,
            playerContact: this.playerContactA
        })
    }

    addPlayer() {
        if(this.isCovid) {
            this._additionalForm();
        } else {
            this.viewCtl.dismiss({
                newPlayer: true,
                playerDetails: this.playerAddressForm,
                // playerContact: playerContact

            });
        }
    }

    addMeself() {
        
        this.player$.take(1).subscribe((player: PlayerInfo) => {
            if(this.isCovid) {
                this._additionalForm(player);
            } else {
                this.viewCtl.dismiss(player);
            }
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
                        playerDetails: this.playerAddressForm.value,
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

    getPlayerDetails(attribute: string) {
        switch(attribute) {
            case 'name':
                    // this.player.player?this.player.player.playerName:this.player.playerName
                return this.player.playerName?this.player.playerName:'';
            case 'address1':
                return
                case 'address2':
                    return;
                    case 'city':
                        return;
        }
    }
}
