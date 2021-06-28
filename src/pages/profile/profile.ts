import {Component, Renderer, ViewChild} from '@angular/core';
import {Keyboard} from '@ionic-native/keyboard';
import {
    AlertController,
    Loading,
    LoadingController,
    ModalController,
    NavController,
    NavParams,
    Platform,
    ToastController,
    ViewController,
    Slides
} from 'ionic-angular';
import {isPresent} from 'ionic-angular/util/util';
import {Observable} from 'rxjs/Observable';
import {ClubInfo} from '../../data/club-course';
// import {ClubMembership} from '../../data/player-data';
import {ServerResult} from '../../data/server-result';
import * as globals from '../../globals';
import {adjustViewZIndex} from '../../globals';
import {MessageDisplayUtil} from '../../message-display-utils';
import {FriendService} from '../../providers/friend-service/friend-service';
import {ImageService} from '../../providers/image-service/image-service';
import {PlayerService} from '../../providers/player-service/player-service';
import {PlayerHomeActions} from '../../redux/player-home/player-home-actions';
import {PlayerHomeDataService} from '../../redux/player-home/player-home-data-service';
import {ChangePasswordPage} from '../change-password/change-password';
import {EditProfilePage} from '../edit-profile/edit-profile';
import {ClubListPage} from '../normalgame/club-list/club-list';
import {FavouriteListPage} from '../player-favourite-list/player-favourite-list';
import {PlayerHomeInfo} from './../../data/player-data';
import {FriendImageShow} from './friend-image-show';
import {ProfileImageEdit} from './profile-image-edit';
import { SessionDataService, SessionActions } from '../../redux/session';
import { SessionInfo } from '../../data/authentication-info';
import { HandicapHistoryPage } from '../handicap-history/handicap-history';
import { HandicapService } from '../../providers/handicap-service/handicap-service';
// import { ClubHandicap } from '../../data/handicap-history';
import { HandicapIndexSubscription, createHandicapIndexSubscription } from '../../data/premium-subscription';
import * as moment from "moment";

import {PaymentService} from '../../providers/payment-service/payment-service';
import { BillPlzCollectionList } from '../../data/BillPlzCollectionList';
import { ActionSheetController } from 'ionic-angular';
import { TestPaymentPage } from '../modal-screens/test-payment/test-payment';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { PlayerSubscriptionPage } from '../modal-screens/player-subscription/player-subscription';
import { PlayerVoucherModal } from '../modal-screens/player-voucher/player-voucher';
import { PlayerMg2uCreditsModal } from '../modal-screens/player-mg2u-credits/player-mg2u-credits';
import { FaqPage } from '../faq/faq';
import { ClubCredit, HandicapSystem, PlayerInfo, HandicapCalculation, ClubHandicap, ClubMembership } from '../../data/mygolf.data';
import { ClubFlightService } from '../../providers/club-flight-service/club-flight-service';
import { JsonService } from '../../json-util';
import { NotificationsPage } from '../notifications/notifications';
import { cpuUsage } from 'process';
import { mygolfUtils } from '../../custom/mygolf2u-utils';

@Component({
    selector   : 'profile-page',
    templateUrl: 'profile.html'
})
export class ProfilePage {
    playerHomeInfo$: Observable<PlayerHomeInfo>;
    player$: Observable<PlayerInfo>;
    playerPhoto$: Observable<string>;
    public memberships: Array<ClubMembership> = [];
    public clubIds: Array<number>             = [];
    public type: string                       = 'playerProfile';
    public status: string                     = 'notFriend';
    // public homeInfo: PlayerHomeInfo;
    // public player: PlayerInfo;
    public editImage: boolean       = false;
    public currentImgUrl: string;
    public showMemberships: boolean = false;
    // public player_id: number                  = 0;
    public requestByPlayer: boolean = true;
    public statusGetHCP: boolean    = false;
    public openedModal: boolean     = false;
    public tabs: string = "about";
    @ViewChild('mySlider') slider: Slides;

    public slideNo: number = 0;

    public session: SessionInfo;
    public handicapHistory: HandicapCalculation;
    public clubHandicap: Array<ClubHandicap>;
    public playerClubHcp: any;
    public hasM2u: boolean = false;

    public hcpIdxSubs: HandicapIndexSubscription;

    currentPlayer: PlayerInfo;

    options : InAppBrowserOptions = {
        location : 'yes',//Or 'no' 
        hidden : 'no', //Or  'yes'
        clearcache : 'yes',
        clearsessioncache : 'yes',
        zoom : 'yes',//Android only ,shows browser zoom controls 
        hardwareback : 'yes',
        mediaPlaybackRequiresUserAction : 'no',
        shouldPauseOnSuspend : 'no', //Android only 
        closebuttoncaption : 'Close', //iOS only
        disallowoverscroll : 'no', //iOS only 
        toolbar : 'yes', //iOS only 
        enableViewportScale : 'no', //iOS only 
        allowInlineMediaPlayback : 'no',//iOS only 
        presentationstyle : 'pagesheet',//iOS only 
        fullscreen : 'yes',//Windows only    
    };

    
    playerCredits: Array<any>;
    totalClubCredits: number;

    handicapSystem: Array<HandicapSystem>;
    playerHcpSystem: string; //HandicapSystem;

    handicapIndex: number;
    playerHandicapHistory: Array<HandicapCalculation>;

    constructor(private navParams: NavParams,
        private nav: NavController,
        private playerHomeService: PlayerHomeDataService,
        private playerHomeActions: PlayerHomeActions,
        private renderer: Renderer,
        private loadingCtl: LoadingController,
        private toastCtl: ToastController,
        private playerService: PlayerService,
        private friendService: FriendService,
        private imageService: ImageService,
        private alertCtl: AlertController,
        private modalCtl: ModalController,
        private platform: Platform,
        private keyboard: Keyboard,
        private viewCtrl: ViewController,
        private sessionService: SessionDataService,
        private sessionActions: SessionActions,
        private handicapService: HandicapService,
        private paymentService: PaymentService,
        private actionSheetCtl: ActionSheetController,
        private iab: InAppBrowser,
        private flightService: ClubFlightService,
        private mg2uUtil: mygolfUtils) {
        this.type            = navParams.get("type");
        this.playerHomeInfo$ = this.playerHomeService.playerHomeInfo();
        this.player$         = this.navParams.get('player');
        if (!this.player$) {
            this.player$ = this.playerHomeInfo$
                               .map((playerHomeInfo: PlayerHomeInfo) => playerHomeInfo.player);
                               
            this.playerPhoto$    = this.playerHomeService.playerPhoto();
        }
        else {
            this.playerPhoto$ = this.player$.map(playerInfo=>{
                if(playerInfo.thumbnail)
                    return playerInfo.thumbnail;
                else if(playerInfo.photoUrl)
                    return playerInfo.photoUrl;
                else return ''
            });
        }
        // this.playerPhoto$    = this.playerHomeService.playerPhoto();
        this.status          = navParams.get("status");
        this.requestByPlayer = navParams.get("requestByPlayer");
        this.openedModal     = navParams.get("openedModal");
    }

    ionViewDidLoad() {
        adjustViewZIndex(this.nav, this.renderer);
        if (this.type === "playerProfile") {
            this._refreshMemberships();
        }
        
    }
    

    ionViewWillEnter() {
        console.log("view will enter");
        this.getPlayerCredits();
        
        this.player$.take(1).subscribe((player: PlayerInfo) => {
            this.playerHcpSystem = player.defaultHandicapSystem
        });

    }

    ionViewDidEnter() {
        adjustViewZIndex(this.nav, this.renderer); 
        this.refreshProfile();
        this.getPlayerCredits();
        this.refreshHandicapSystem();
        // this.refreshMygolfHandicap();
    }

    close() {
        this.viewCtrl.dismiss();
    }

    goHome() {
        this.nav.popToRoot();
    }

    refreshProfile() {
        this.playerHomeActions.refreshForcefully();
        this._refreshMemberships();
        this.getPlayerCredits();
        // console.log("[Refresh] hcp idx subs", this.hcpIdxSubs)
    }

    private _refreshMemberships(busy?: Loading) {
        if (!busy) {
            busy = this.loadingCtl.create({
                content            : "Please wait...",
                showBackdrop       : false,
                dismissOnPageChange: false,
                duration           : 5000,
            });
            console.log("[busy] refresh membership");
        }
        // busy.present().then(() => {
            this.playerService.getPlayerMemberships()
                .subscribe((memberships: Array<ClubMembership>) => {
                    // busy.dismiss(memberships);
                    // busy.dismiss().then(() => {
                        console.log("[Refresh] Membership : ", memberships)
                        if (memberships) {
                            this.memberships = memberships;
                            this.clubIds     = [];
                            memberships.forEach((m: ClubMembership) => {
                                this.clubIds.push(m.club.clubId);
                            });
                                // setTimeout(()=>{
                                    if(busy) busy.dismiss().then(() => {
                                        this.refreshMygolfHandicap(busy);
                                    })
                                // },300);
                            
                        }
                        if (this.statusGetHCP) {
                            MessageDisplayUtil.displayInfoAlert(this.alertCtl, "Success",
                                "Handicap updated", "OK");
                            this.statusGetHCP = false;
                        }
                    // }) // busy
                }, (error) => {
                    busy.dismiss()
                    .then(() => {
                        console.log("[Error] 1 : ", error)
                        console.log("[Error] 2 : ", MessageDisplayUtil.getErrorMessage(error))
                        if(error) {
                            let msg = MessageDisplayUtil.getErrorMessage(error);
                            MessageDisplayUtil.displayErrorAlert(this.alertCtl, "Membership",
                                msg, "OK");
                        }
                        })                    
                }, () => {
                    this._refreshHcpIdxSubscriptions(busy);
                });
        // });
        // });
    }

    // openEditProfile() {
    //     this.nav.push(EditProfilePage, {
    //         homeInfo: this.playerHomeInfo$,
    //         player  : this.player$,
    //         type    : this.type
    //     });
    // }

    openEditProfile() {
       let modal = this.modalCtl.create(EditProfilePage, {
        homeInfo: this.playerHomeInfo$,
        player  : this.player$,
        type    : this.type
    });
    modal.onDidDismiss((data?: any) => {
        this.refreshProfile();
        setTimeout(()=> {
            this.sessionService.getSession()
            .take(1)
            .subscribe((session: SessionInfo) => {
              this.session = session;
            })
        },100);

        setTimeout(()=> {
            this.player$.filter(Boolean).subscribe((player: PlayerInfo) =>  {
                console.log("Player info after update :", player)
                this.session.countryId = player.countryId
                    this.session.countryName = player.countryName;
                    this.session.flagUrl = player.flagUrl;
                    console.log("Get Update Pref After Profile : ",this.session);
                    this.sessionActions.updatePreference(this.session);
             })
             this.getPlayerCredits();
        },500);
    });
    modal.present();
    }

    openAddClubMembership() {
        // this.nav.push(AddClubMembershipPage);
        let modal = this.modalCtl.create(ClubListPage, {
            openedModal: true,
            forMembership: true
        });
        modal.onDidDismiss((data: ClubInfo) => {
            if (data) {
                this.openMembershipOptions(data);
            }
            if (this.platform.is('ios') && this.platform.is('cordova')) {
                this.keyboard.close();
            }
        });
        modal.present();
    }

    setHomeClub(membership: ClubMembership) {
        let confirm = this.alertCtl.create({
            title  : "Set Home Club",
            message: "Do you want to set " +
            membership.club.clubName + " as your home club?",
            buttons: [
                {
                    text   : 'No',
                    handler: () => {
                        confirm.dismiss();
                        return false;
                    }
                },
                {
                    text   : 'Set Home',
                    handler: () => {
                        confirm.dismiss()
                               .then(() => {
                                   this._setHomeclub(membership);
                               });
                        return false;
                    }
                }
            ]
        });
        confirm.present();
    }

    deleteMembership(membership: ClubMembership) {
        let confirm = this.alertCtl.create({
            title  : "Delete Membership",
            message: "Do you want to delete your membership details for " +
            membership.club.clubName + "?",
            buttons: [
                {
                    text   : 'No',
                    role   : "cancel",
                    handler: () => {
                        confirm.dismiss();
                        return false;
                    }
                },
                {
                    text    : 'Delete',
                    cssClass: "delete-item",
                    role    : "delete",
                    handler : () => {
                        confirm.dismiss()
                               .then(() => {
                                   this._deleteClubMembership(membership);
                               });
                        return false;
                    }
                }
            ]
        });
        confirm.present();
    }

    /**
     * Calls the server method delete the membership
     * @param membership
     * @private
     */
    private _deleteClubMembership(membership: ClubMembership) {
        this.playerService.deleteClubMembership(membership.club.clubId)
            .subscribe(() => {
                this._refreshMemberships();
            });
    }

    private _setHomeclub(membership: ClubMembership) {
        this.playerService.updateClubMembership(membership.club.clubId,
            membership.membershipNumber, true)
            .subscribe(() => {
                // this._refreshMemberships();
                this.refreshProfile();
            })
    }

    openMembershipOptions(club: ClubInfo, membership?: string) {
        let prompt = this.alertCtl.create({
            title  : 'Club Membership',
            message: "Enter your Membership Number and click Save",
            inputs : [
                {
                    name       : 'title',
                    placeholder: 'Membership Number',
                    value      : membership
                },
            ],
            buttons: [
                {
                    text   : 'Cancel',
                    handler: data => {
                        prompt.dismiss();
                        if (this.platform.is('ios') && this.platform.is('cordova')) {
                            this.keyboard.close();
                        }
                        return false;
                    }
                },
                {
                    text   : 'Save',
                    handler: data => {
                        prompt.dismiss()
                              .then(() => {
                                  if (this.platform.is('ios') && this.platform.is('cordova')) {
                                      this.keyboard.close();
                                  }
                                  if (data && data.title) {
                                      this._addMembership(club, data.title);
                                  }
                              });
                        return false;
                    }
                }
            ]
        });
        prompt.present();
    }

    private _addMembership(club: ClubInfo, membership: string) {
        this.playerService.updateClubMembership(club.clubId, membership)
            .subscribe(() => {
                this._refreshMemberships();
                // this.refreshMygolfHandicap();
            })
    }

    openPlayerFavouriteList() {
        this.nav.push(FavouriteListPage);
    }

    changePassword() {
        // this.nav.push(ChangePasswordPage, {
        //     player: this.player
        // });
        this.player$.take(1).subscribe((player: PlayerInfo) => {
            this.nav.push(ChangePasswordPage, {
                player: player
            });
        });
    }

    editPhoto() {
        if (this.type === "friendProfile") {
            let modal = this.modalCtl.create(ProfileImageEdit, {
                player: this.player$,
                friend: true
            });
            modal.onDidDismiss(() => {
            });
            modal.present();
        }
        else {
            let modal = this.modalCtl.create(ProfileImageEdit, {
                player: this.player$,
                friend: false
            });
            modal.onDidDismiss((data) => {
                if(data && data.needRefresh) {
                    this.playerHomeActions.setNeedRefresh(true);
                    this.refreshProfile();
                } 
            });
            modal.present();
        }
    }

    // takePhoto() {
    //     this.imageService.captureImage(true)
    //         .subscribe((data: ImageData) => {
    //             this._uploadImage(data.originalURL);
    //         }, (error) => {
    //             alert(JSON.stringify(error));
    //         });
    // }
    //
    // selectPhoto() {
    //     this.imageService.pickImage()
    //         .subscribe((data: ImageData) => {
    //             this._uploadImage(data.originalURL);
    //         }, (error) => {
    //             //Ignore this error
    //         });
    // }
    //
    // _uploadImage(imageURL: string) {
    //     let friend = (this.type === 'friendProfile');
    //     this.getPlayerId().then((playerId: number)=>{
    //         this.playerHomeActions.updatePlayerPhoto(imageURL, ContentType.JPEG, playerId, friend)
    //             .subscribe((player: PlayerInfo)=> {
    //                 if(friend) {
    //                     this.player$.take(1).subscribe((currPlayer)=>{
    //                         currPlayer.photoUrl = player.photoUrl;
    //                         currPlayer.thumbnail = player.thumbnail;
    //                     });
    //                 }
    //             })
    //     });
    //     // this.playerService.updatePhoto(imageURL, ContentType.JPEG, Subscriber.create(
    //     //     (result: UploadResult) => {
    //     //         this._onPhotoChange(result.message);
    //     //     }, (error) => {
    //     //         let alert = this.alertCtl.create({
    //     //             title  : "Upload Error",
    //     //             message: error,
    //     //             buttons: ["Ok"]
    //     //         });
    //     //         alert.present();
    //     //     }
    //     // ));
    // }
    //
    // cancelEditImage() {
    //     this.editImage = false;
    // }
    //
    // private _onPhotoChange(message: string) {
    //     this.playerHomeActions.setPlayerInfo('photoUrl', message);
    //     // this.player.photoUrl = message;
    //     // JsonService.deriveFullUrl(this.player, "photoUrl");
    //     this.cancelEditImage();
    //     let alert = this.alertCtl.create({
    //         title  : "Upload",
    //         message: "Uploaded Successfully",
    //         buttons: ["Ok"]
    //     });
    //     alert.present();
    // }
    changeNHSPrompt() {
        this.player$.take(1)
            .map((playerInfo: PlayerInfo) => playerInfo.nhsNumber)
            .subscribe((nhsNumber) => {
                this._changeNHSPrompt(nhsNumber);
            });
    }

    private _changeNHSPrompt(nhsNumber) {
        let prompt = this.alertCtl.create({
            title  : 'NHS Number',
            message: "Enter the NHS Number and click Save",
            inputs : [
                {
                    name       : 'nhsNumber',
                    placeholder: 'NHS Number',
                    value      : nhsNumber,
                    type       : 'string'
                },
            ],
            buttons: [
                {
                    text   : 'Cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                        prompt.dismiss().then(() => {
                            if (this.platform.is('ios') && this.platform.is('cordova')) {
                                this.keyboard.close();
                            }
                        });
                        return false;
                    }
                },
                {
                    text   : 'Save',
                    handler: data => {
                        prompt.dismiss().then(() => {
                            if (data.nhsNumber === '') {
                                if (this.platform.is('ios') && this.platform.is('cordova')) {
                                    this.keyboard.close();
                                }
                            }
                            else if (data.nhsNumber.length > 15) {
                                if (this.platform.is('ios') && this.platform.is('cordova')) {
                                    this.keyboard.close();
                                }
                                MessageDisplayUtil.displayErrorAlert(this.alertCtl, "NHS Number",
                                    "The NHS Number you entered is too long!", "OK");
                            }
                            else if (data && data.nhsNumber !== nhsNumber) {
                                this.playerService.updatePlayerNHS(data.nhsNumber)
                                    .subscribe((resp: any) => {
                                        this.playerHomeActions.setPlayerInfo('nhsNumber', data.nhsNumber);
                                        // this.player.nhsNumber = data.nhsNumber;
                                        if (this.platform.is('ios') && this.platform.is('cordova')) {
                                            this.keyboard.close();
                                        }
                                        if(resp) {
                                            console.log("nhs update - resp : ", resp);
                                            this.getHandicapNHS();
                                        }
                                    }, (error) => {
                                        // this.viewCtrl.dismiss({type: "acceptFriend"});
                                        let errorMsg = "The NHS "+nhsNumber+" has already been used by existing player";
                                        MessageDisplayUtil.displayErrorAlert(this.alertCtl, "NHS Number", errorMsg, "OK");
                                        console.log("NHS error", error)
                                    });
                            }
                        });
                        return false;
                    }
                }
            ]
        });
        prompt.present();
    }

    private getPlayerId(): Promise<number> {
        return this.player$.take(1)
                   .map((player: PlayerInfo) => player.playerId).toPromise();
    }

    acceptFriend() {
        this.getPlayerId().then((playerId: number) => {
            this.friendService.acceptFriendRequest(playerId)
                .subscribe((result: ServerResult) => {
                    if (result.success) {
                        this.playerHomeActions.refreshForcefully();
                        this.viewCtrl.dismiss({type: "acceptFriend"});
                    }
                }, (error) => {
                    this.viewCtrl.dismiss({type: "acceptFriend"});
                    globals.displayError(this.alertCtl, error, "Accept Friend", "OK");
                });
        });
    }

    requestFriend() {
        this.getPlayerId().then((playerId: number) => {
            let busy = this.loadingCtl.create({
                content: "Please wait...",
                duration           : 5000,
            });
            busy.present().then(() => {
                this.friendService.sendFriendRequest(playerId)
                    .subscribe((result: ServerResult) => {
                        busy.dismiss().then(() => {
                            if (result.success) {
                                this.viewCtrl.dismiss({type: "requestFriend"});
                            }
                        });
                    }, (error) => {
                        busy.dismiss().then(() => {
                            this.viewCtrl.dismiss();
                            let msg = MessageDisplayUtil.getErrorMessage(error, "Error creating friend request");
                            MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl, 3000, "bottom");
                        });
                    });
            });
        });
    }

    deleteFriendConfirm() {
        let deleteFriendConfirmation = this.alertCtl.create({
            title  : 'Remove Friend',
            message: 'Are you sure you want Remove this Friend?',
            buttons: [
                {
                    text   : 'Cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text   : 'Yes',
                    handler: () => {
                        deleteFriendConfirmation.dismiss()
                                                .then(() => {
                                                    this.deleteFriend();
                                                });
                        return false;
                    }
                }
            ]
        });
        deleteFriendConfirmation.present();
    }

    deleteRequestConfirm() {
        let confirm = this.alertCtl.create({
            title  : 'Delete Request',
            message: 'Are you sure you want Remove this Friend Request?',
            buttons: [
                {
                    text   : 'Cancel',
                    handler: () => {
                        console.log('Disagree clicked');
                    }
                },
                {
                    text   : 'Yes',
                    handler: () => {
                        confirm.dismiss()
                               .then(() => {
                                   this.deleteRequest();
                               });
                        return false;
                    }
                }
            ]
        });
        confirm.present();
    }

    deleteFriend() {
        this.getPlayerId().then((playerId: number) => {
            this.friendService.cancelFriendRequest(playerId)
                .subscribe((result: ServerResult) => {
                    if (result.success) {
                        let confirm = this.alertCtl.create({
                            title  : 'Remove Friend',
                            message: 'You have successfully remove friend',
                            buttons: [
                                {
                                    text   : 'OK',
                                    handler: () => {
                                        confirm.dismiss()
                                               .then(() => {
                                                   // if (this.homeInfo) {
                                                   //     this.homeInfo.needRefresh = true;
                                                   // }
                                                   this.playerHomeActions.refreshForcefully();
                                                   this.viewCtrl.dismiss({type: "deleteFriend"});
                                               });
                                        return false;
                                    }
                                }
                            ]
                        });
                        confirm.present();
                    }
                }, (error) => {
                    this.viewCtrl.dismiss();
                    globals.displayError(this.alertCtl, error, "Remove Friend", "OK");
                });
        });
    }

    deleteRequest() {
        this.getPlayerId().then((playerId: number) => {
            let busy = this.loadingCtl.create({
                content: "Please wait...",
                duration           : 5000,
            });
            busy.present().then(() => {
                this.friendService.cancelFriendRequest(playerId)
                    .subscribe((result: ServerResult) => {
                        busy.dismiss().then(() => {
                            if (result.success) {
                                this.viewCtrl.dismiss({type: "deleteRequest"});
                            }
                        });
                    }, (error) => {
                        busy.dismiss().then(() => {
                            this.viewCtrl.dismiss();
                            let msg = MessageDisplayUtil.getErrorMessage(error, "Error deleting request");
                            MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl, 3000, "bottom");
                        });
                    });
            });
        });
    }

    getHandicap() {
        this.player$.take(1)
            .map((player: PlayerInfo) => player.nhsNumber)
            .subscribe((nhsNumber) => {
                this._getHandicap(nhsNumber);
            });
    }

    private _getHandicap(nhsNumber) {
        if (!isPresent(nhsNumber) || nhsNumber == '') {
            let msg = "Your NHS Number is blank";
            // globals.displayError(this.nav, msg, "Handicap Index", "OK");
            MessageDisplayUtil.displayErrorAlert(this.alertCtl, "Handicap Index",
                msg, "OK");
            console.log("NHS NULL");
            return;
        }
        let confirm = this.alertCtl.create({
            title  : "Get Handicap",
            message: "This will retrieve your NHS handicap index and calculate the handicap for each club you are a member of. Would you like to continue?",
            buttons: [
                {
                    text   : 'Cancel',
                    role   : "cancel",
                    handler: () => {
                        confirm.dismiss();
                        return false;
                    }
                },
                {
                    text   : 'Yes',
                    handler: () => {
                        confirm.dismiss()
                               .then(() => {
                                   console.log("Yes Clicked");
                                   this.getHandicapNHS();
                               });
                        return false;
                    }
                }
            ]
        });
        confirm.present();
    }

    getHandicapNHS() {
        let loader = this.loadingCtl.create({
            content     : "Getting Handicap...",
            showBackdrop: false,
            // duration: 5000,
        });
        let _player: PlayerInfo;
        this.player$.take(1)
            .map((player: PlayerInfo) => player)
            .subscribe((player) => {
                _player = player
            });
        let _handicapSystem: Array<HandicapSystem>;
        _handicapSystem = this.handicapSystem.filter((hcp)=>{
            return hcp.id.toLowerCase().includes('nhs')
        });
        loader.present().then(() => {
            this.flightService.syncPlayerHandicapIndex(_player.playerId, _handicapSystem[0].id)
            .subscribe((result)=>{
                loader.dismiss().then(()=>{
                    this.statusGetHCP = true;
                    this.refreshProfile();
                    
            // this.playerService.getPlayerHandicapIndex(true)
            // .subscribe((index: number) => {
            //     this.playerService.deriveClubHandicaps()
            //         .subscribe((success: boolean) => {
            //             this.statusGetHCP = true;
            //             this.refreshProfile();
            //             // loader.dismiss().then(() => {
            //             // })
            //         }, (error) => {
            //             loader.dismiss().then(() => {
            //                 console.log("[Error] Get NHS ", error)
            //                 let msg = '';
            //                     if(error.status === 500) {
            //                         msg = MessageDisplayUtil.getErrorMessage(error,
            //                             "Error deriving the club handicap");
            //                             console.log("[error] 500")
            //                     } else {
            //                         msg = MessageDisplayUtil.getErrorMessage(error,
            //                             "Error deriving the club handicap");
            //                         }
            //                 // if (msg == "Error deriving the handicap index using NHS number")
            //                 //     msg = "NHS number is not valid."
            //                 MessageDisplayUtil.displayErrorAlert(this.alertCtl, "Handicap",
            //                     msg, "OK");
            //             })
            //         });
            // }, (error) => {
            //     loader.dismiss().then(() => {
            //         console.log("[Error] Get NHS 1: ", error)
            //         let msg = '';
            //         if(error.status === 500) {
            //             msg = MessageDisplayUtil.getErrorMessage(error,
            //                 "Error getting to NHS server");
            //                 console.log("[error] 500")
            //         } else {
            //             msg = MessageDisplayUtil.getErrorMessage(error,
            //                 "Error deriving the handicap index using NHS number");
            //                 console.log("[error] else")

            //         }
                    
            //         MessageDisplayUtil.displayErrorAlert(this.alertCtl, "Handicap",
            //             msg, "OK");
            //     });
            // }, () => {
            // });
                })
                console.log("sync handicap index result : ", result)
            }, (error)=>{
                console.log("sync handicap index result - error : ", error)
                let _error = error.json();
                    
                MessageDisplayUtil.displayErrorAlert(this.alertCtl, "Handicap Index",
                _error.errors[0], "OK");
                loader.dismiss();
                return;
            }, () =>{
                // loader.dismiss();
            })
        })
    }

    deriveClubHandicaps() {
        this.playerService.deriveClubHandicaps()
            .subscribe((success: boolean) => {
                this.statusGetHCP = true;
                this.refreshProfile();
            }, (error) => {
                let msg = MessageDisplayUtil.getErrorMessage(error);
                if (msg == "Error deriving the handicap index using NHS number") {
                    msg = "NHS number is not valid."
                }
                MessageDisplayUtil.displayErrorAlert(this.alertCtl, "Membership",
                    msg, "OK");
            }, () => {
                // MessageDisplayUtil.displayInfoAlert(this.alertCtl, "Success",
                //     "Handicap updated", "OK");
                // this._refreshMemberships();
            });
    }

    getFlagUrl(flagUrl: string) {
        if (flagUrl==null) return null;
        else {
            let flagIcon = flagUrl.split("/");
            return "img/flag/"+flagIcon[2];
        }
    }

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
    private _requestTrialSubscripion(busy?: Loading) {
            if (!busy) {
                busy = this.loadingCtl.create({
                    content            : "Please wait...",
                    showBackdrop       : false,
                    dismissOnPageChange: false,
                    duration           : 5000,
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
                                this.refreshProfile();
                            })
                            
                        // }
                        // busy.dismiss(memberships);
                        setTimeout(() => {
                            if(busy) busy.dismiss().then(() => {
                                MessageDisplayUtil.showMessageToast('Thank you for subscribing', 
                                this.platform, this.toastCtl,3000, "bottom")

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

    public openHcpHistory() {
        let hcpIdxSub: HandicapIndexSubscription; // = createHandicapIndexSubscription();
        hcpIdxSub = this.hcpIdxSubs
        console.log("[Hcp Idx Subs] openHcpHistory() :", hcpIdxSub, this.hcpIdxSubs)
        console.log("[Hcp Calculation] openHcpHistory() :", this.handicapHistory)

        if(this.type === 'friendProfile') {
            console.log("friend", this.type,this.player$)
            this.nav.push(HandicapHistoryPage, {
                fromMenu: 'friend',
                player: this.player$
            });
            return;
        }

        // if(this.hcpIdxSubs && this.hcpIdxSubs.active)
        //     this.nav.push(HandicapHistoryPage);
        // else {
        //     if(this.hcpIdxSubs && this.hcpIdxSubs.subscription)
        //         MessageDisplayUtil.displayErrorAlert(this.alertCtl, "Subscription Expired", "Please renew your subscription to view", "OK");
        //     else MessageDisplayUtil.displayErrorAlert(this.alertCtl, "Subscription Needed", "Please subscribe to view", "OK");
        // }

        /* updated 2020-01-16 - but somehow API subscription is null
        */
       let _player;
       this.player$.take(1).subscribe((player: PlayerInfo) => {
        _player = player;
        });
       if(!this.handicapHistory && this.hcpIdxSubs.subscription) {
        MessageDisplayUtil.displayInfoAlert(this.alertCtl, "Insufficient Scorecards", "Please play more games to submit scorecards", "OK"); 
        return
        } else {
            if(this.hcpIdxSubs) {
                if(this.hcpIdxSubs.active)
                    this.nav.push(HandicapHistoryPage ,{
                        subsActive: true,
                        currentPlayer: _player
                        // fromMenu: 'menu',
                    });
                    else if(this.hcpIdxSubs.subscription && !this.hcpIdxSubs.active && (this.hcpIdxSubs.subscriptionType === 'T' || this.hcpIdxSubs.subscriptionType === 'P'))
                        MessageDisplayUtil.displayErrorAlert(this.alertCtl, "Subscription Expired", "Please renew your subscription to view", "OK");
                        else {
                                this.promptSubscription();//MessageDisplayUtil.displayErrorAlert(this.alertCtl, "Subscription Needed", "Please subscribe to view", "OK");
                                console.log("[HCP idx subs] else if(this.hcpIdxSubs.subscription && !this.hcpIdxSubs.active)")   
                            }
            } else  {
                this.promptSubscription();  //MessageDisplayUtil.displayErrorAlert(this.alertCtl, "Subscription Needed", "Please subscribe to view", "OK");
                console.log("[HCP idx subs] ALL else")
            }
    
        }
        


    }

    refreshMygolfHandicap(busy?: Loading) {
        let _player;
        if (!busy) {
            busy = this.loadingCtl.create({
                content            : "Please wait...",
                showBackdrop       : false,
                dismissOnPageChange: false,
                duration           : 5000,
            });
            console.log("[busy] refresh m2u handicap ?");
        }
        this.player$.take(1).subscribe((player: PlayerInfo) => {
            console.log("refresh mygolf handicap ", player)
            this.playerHcpSystem = player.defaultHandicapSystem
            _player = player;
        });
        this.handicapService.getHandicapHistory()
        .subscribe((data: Array<HandicapCalculation>) => {
            console.log("[Handicap] data length: ",data.length)
            console.log("[Handicap] data", data)
            if(data.length > 0) {
            this.hasM2u = true;
            this.playerHandicapHistory = data;
            this.handicapHistory = data[0];
            this.handicapService.getClubHandicap(data[0].player.playerId)
            .subscribe((data: Array<ClubHandicap>) => {
                this.clubHandicap = data;
                console.log("[Handicap] Club Handicap : ",this.clubHandicap)

                this.playerClubHcp = this.memberships;
                this.playerClubHcp.hcpDetail = [];
                if(data && data.length > 0) {
                    this.memberships.forEach((m: ClubMembership) => {
                        this.clubHandicap.forEach((ch: ClubHandicap) => {
                            
                            console.log("[Handicap] - ", this.playerHcpSystem, " | CH : ",ch)
                            if(m.club.clubId === ch.clubInfo.clubId && ch.handicapSystem && ch.handicapSystem.id === this.playerHcpSystem) {
                                console.log("[Handicap] Club Handicap Membership")
                                m.hcpDetail = ch
                                console.log("[Handicap] M : ", m)
                                console.log("[Handicap] CH : ",ch)
                            } else if(m.club.clubId === ch.clubInfo.clubId && ch.handicapSystem && ch.handicapSystem.id.toLowerCase().includes('nhs')) {
                                m.nhsHcpDetail = ch;
                            }
                            // else {
                            //     m.hcpDetail = new ClubHandicap();
                            // }
                        })
                        console.log("[Handicap] Full m : ",m)
                        console.log("[Handicap] m.hcpDetail : ", m.hcpDetail)
                        this.playerClubHcp.hcpDetail.push(m.hcpDetail);
    
                    })
                }
                
                // console.log("[Handicap] playerClubHcp : ", this.playerClubHcp)
                // if (memberships) {
                //     this.memberships = memberships;
                //     this.clubIds     = [];
                //     memberships.forEach((m: ClubMembership) => {
                //         this.clubIds.push(m.club.clubId);
                //     });
                // }
                console.log("[Handicap] player hcp club :",this.playerClubHcp)
                // if(busy) busy.dismiss().then(()=>{
                        this._refreshHcpIdxSubscriptions(busy);
                    // })
                
                    
                
            }, (error) => {
                if(busy) busy.dismiss().then();
            }, () => {
                if(busy) busy.dismiss().then();
            })
        }
        }, (error) => {
            this.handicapHistory = null; //new HandicapCalculation();
            this.hasM2u = false;
        }, () => {
            if(busy) busy.dismiss().then();
            this.refreshHandicapSystem();
        })
    }

    hasM2uHandicap(): boolean {
        // console.log("[Handicap] Has m2u hcp :",this.hasM2u)
        return this.hasM2u;
    }


    private _refreshHcpIdxSubscriptions(busy?: Loading) {
        if (!busy) {
            busy = this.loadingCtl.create({
                content            : "Please wait...",
                showBackdrop       : false,
                dismissOnPageChange: false,
                duration           : 5000,
            });
            console.log("[busy] refresh hcp idx subs ?");
        }
        // busy.present().then(() => {
            this.playerService.getHcpIdxSubs()
                .subscribe((data: HandicapIndexSubscription) => {
                    // if (data.length > 0) {
                        let hIS = data[0];
                        // setTimeout(() => {
                            this.hcpIdxSubs = data;
                            console.log("[Hcp Idx Subs] Get Hcp Subs 2 : ", hIS)
                            console.log("[Hcp Idx Subs] Get Hcp Subs 2 : ", this.hcpIdxSubs)
                        // }, 250);
                        
                    // }
                    if(busy) busy.dismiss().then();
                    // setTimeout(() => {
                    //     busy.dismiss().then(() => {
                    //         console.log("[Hcp Idx Subs] Get Hcp Subs 1 : ", data)
                    //         // if(this.hcpIdxSubs) 
                    //         console.log("[Hcp Idx Subs] Get Hcp Subs 2b : ", this.hcpIdxSubs)
                            
                    //     })
                    // }, 450);
                    
                }, (error) => {
                    let _error = error.json();
                    if(busy) busy.dismiss()
                    .then(() => {
                        console.log("[Error] 1 : ", error)
                        console.log("[Error] 2 : ", MessageDisplayUtil.getErrorMessage(error.json()))
                        if(error) {
                            let msg = MessageDisplayUtil.getErrorMessage(_error.message);
                            MessageDisplayUtil.displayErrorAlert(this.alertCtl, "Subscription",
                                msg, "OK");
                        }
                    })
                });
        // });
        // });
    }

    public openSubscription() {
        // let msg = MessageDisplayUtil.displayInfoAlert(error);
        let _active = (this.hcpIdxSubs.active)?`Yes`:`No`;
        let _subType = (this.hcpIdxSubs.subscriptionType==='T')?`Trial`:`Paid`;
        let _startDate: string = moment(this.hcpIdxSubs.startDate).format("MMM DD, YYYY");
        let _endDate: string = moment(this.hcpIdxSubs.endDate).format("MMM DD, YYYY");
        let msg = `<br>` + `Active : ` + _active +
        `<br> Type : ` + _subType + 
        `<br>Start Date : `+ _startDate +
        `<br>End Date : `+ _endDate;
            // MessageDisplayUtil.displayInfoAlert(this.alertCtl, "Subscription Details",
            //     msg, "OK");


                let prompt = this.alertCtl.create({
                    title  : 'Subscription Details',
                    message: msg,
                    // inputs : [
                    //     {
                    //         name       : 'nhsNumber',
                    //         placeholder: 'NHS Number',
                    //         value      : nhsNumber,
                    //         type       : 'number'
                    //     },
                    // ],
                    buttons: [
                        {
                            text   : 'Close',
                            handler: data => {
                                console.log('Cancel clicked');
                                prompt.dismiss().then(() => {
                                    if (this.platform.is('ios') && this.platform.is('cordova')) {
                                        this.keyboard.close();
                                    }
                                });
                                return false;
                            }
                        },
                        // {
                        //     text   : 'Renew',
                        //     handler: data => {
                        //         prompt.dismiss().then(() => {
                        //             let data: BillPlzCollectionList
                        //         });
                        //         return false;
                        //     }
                        // }
                    ]
                });
                prompt.present();
        
    }

    onRenewClick() {

        let modal = this.modalCtl.create(PlayerSubscriptionPage, {
            hcpIdxSubs         : this.hcpIdxSubs,
            playerInfo         : this.player$
            // currentCourse   : c,
            // clubId          : this.scorecard.clubId,
            // scorecard       : this.scorecard,
            // editingScorecard: this.editingScorecard
        });
        modal.onDidDismiss((data: any) => {
            console.log("[Dismiss] Scorecard : ", data)
            if (data) {
                console.log("scorecard after : ",data)
                if(data.type === 'testCall') {
                    this.testCall();
                } else if(data.type === 'getCollection') {
                    this.getCollections()
                } else if(data.type === 'createCollection') {
                    this.createCollection();
                } else if(data.type === 'getRemoteCollections') {
                    this.getRemoteCollections();
                }else if(data.type === 'getLocalCollections') {
                    this.getLocalCollections(data.collectionId);
                } else if(data.type === 'getBill') {
                    this.getBill(data.billId);
                } else if(data.type === 'createBill') {
                    this.createBill(data.collectionId);
                } else if(data.type === 'createRemoteBill') {
                    this.createRemoteBill(data.collectionId);
                }
                // this.scorecard = data.scorecard
                // this._onCurrentHoleChange();
            }
        });
        modal.present();


        // let btns = [];
        //     btns.push({
        //         text   : 'Test Call',
        //         role   : 'destructive',
        //         icon   : "checkmark-circle",
        //         handler: () => {
        //             actionSheet.dismiss()
        //                        .then(() => {
        //                            this.testCall();
        //                        });
        //             return false;
        //         }
        //     });
        //     btns.push({
        //         text   : 'Create Collection',
        //         icon   : "trash",
        //         handler: () => {
        //             actionSheet.dismiss()
        //                        .then(() => {
        //                            this.createCollection();
        //                        });
        //             return false;
        //         }
        //     });
        //     btns.push({
        //         text   : 'Create Bill',
        //         role   : 'save',
        //         icon   : !this.platform.is('ios') ? 'exit' : null,
        //         handler: () => {
        //             actionSheet.dismiss()
        //                        .then(() => {
        //                        });
        //             return false;
        //         }
        //     });
            
        
        // btns.push({
        //     text   : 'Cancel',
        //     role   : 'cancel', // will always sort to be on the bottom
        //     icon   : !this.platform.is('ios') ? 'close' : null,
        //     handler: () => {
        //         actionSheet.dismiss();
        //         return false;
        //     }
        // });
        // let actionSheet = this.actionSheetCtl.create({
        //     buttons: btns
        // });
        // actionSheet.present();
    }

    testCall() {
        this.paymentService.testCall()
        .subscribe((data:any) => {
            console.log("[payment - profile] test call", data)
        })
    }

    createCollection() {
        this.paymentService.createCollection()
        .subscribe((data:any) => {
            console.log("[payment - profile] create colection",data)
        })
    }
    
    createRemoteBill(collectionId?: string) {
        console.log("create remote bill")
        let loader = this.loadingCtl.create({
            content     : "Procesing Payment...",
            showBackdrop: false
        });


        loader.present().then(()=>{
            this.paymentService.createRemoteBill(collectionId)
        .subscribe((data:any)=>{
            loader.dismiss().then(()=>{
                console.log("get billplz collections", data)
                if(data.url) {
                    if (this.platform.is('cordova')) {
                        this.openWithInAppBrowser(data.url)
                    } else {
                        // this.openWithCordovaBrowser(data.url);
                        window.open(data.url, '_self');
                        
                        // let modal = this.modalCtl.create(TestPaymentPage, {
                        //     url: data.url
                        //     // currentCourse   : c,
                        //     // clubId          : this.scorecard.clubId,
                        //     // scorecard       : this.scorecard,
                        //     // editingScorecard: this.editingScorecard
                        // });
                        // modal.present();
                    }
                    
                }
            })
            
        }, (error) => {

        }, ()=> {

        })
        })
        
    }

    createBill(collectionId?: string) {
        console.log("create bill")
        let loader = this.loadingCtl.create({
            content     : "Procesing Payment...",
            showBackdrop: false
        });

        loader.present().then(() => {
            this.paymentService.createBill(collectionId)
            .subscribe((data:any)=>{
                loader.dismiss().then(()=> {
                    console.log("get billplz collections", data)
                    if(data.url) {
                        if (this.platform.is('cordova')) {
                            this.openWithInAppBrowser(data.url)
                        } else {
                            // this.openWithCordovaBrowser(data.url);
                            let win = window.open(data.url, '_system');
                            win.onunload = function () {
                                console.log("window unload")
                            }
                        }
                        
                    }
                })
                
            })
        })

        
    }
    getCollections() {
        // this.paymentService.getCollections()
        // .subscribe((data:any)=> {

        // });
        console.log("get collections");
    }

    getRemoteCollections() {
        this.paymentService.getRemoteCollections()
        .subscribe((data:any)=>{
            console.log("get billplz collections", data)
        })
    }

    getLocalCollections(collectionId?: string) {
        this.paymentService.getLocalCollections(collectionId)
        .subscribe((data:any)=>{
            console.log("get local billplz collections", data)
        })
    }

    getBill(billId?: string) {
        console.log("calling getBill")
        this.paymentService.getBill(billId)
        .subscribe((data:any)=>{
            console.log("get local billplz bill", data)
        })
    }



    public openWithSystemBrowser(url : string){
        let target = "_system";
        let browser = this.iab.create(url,target,this.options);
        MessageDisplayUtil.showMessageToast('Browser closed', 
        this.platform, this.toastCtl,3000, "bottom")

        browser.on('exit').subscribe(() => {
            console.log('browser closed');
            MessageDisplayUtil.showMessageToast('exit Browser closed', 
                                this.platform, this.toastCtl,3000, "bottom")
        }, (err) => {
            if(err) console.error(err);
        });
        // browser.close();
    }
    public openWithInAppBrowser(url : string){
        let target = "_blank";
        let browser = this.iab.create(url,target,this.options);
        MessageDisplayUtil.showMessageToast('Browser closed', 
        this.platform, this.toastCtl,3000, "bottom")

        browser.on('exit').subscribe(() => {
            MessageDisplayUtil.showMessageToast('exit Browser closed', 
            this.platform, this.toastCtl,3000, "bottom")
            console.log('browser closed');
        }, (err) => {
            if(err) console.error(err);
        });
        // browser.close();
    }
    public openWithCordovaBrowser(url : string){
        let target = "_self";
        let browser = this.iab.create(url,target,this.options);
        MessageDisplayUtil.showMessageToast('Browser closed', 
        this.platform, this.toastCtl,3000, "bottom")

        browser.on('exit').subscribe(() => {
            MessageDisplayUtil.showMessageToast('exit Browser closed', 
            this.platform, this.toastCtl,3000, "bottom")
            console.log('browser closed');
        }, (err) => {
            if(err) console.error(err);
        });
        browser.close();
    }  

    openPlayerVoucherList() {
        let _player: PlayerInfo;
        this.player$.take(1).subscribe((player: PlayerInfo) => {
                        _player =  player   
        });
        this.nav.push(PlayerVoucherModal, {
            type: 'voucher',
            player: _player,
            forBooking: false,
            fromClub: false,
            who: 'player',
            showPlayerCard: true,
        }) 
    }

    onMygolfCredit() {
        let _player: PlayerInfo;
        this.player$.take(1).subscribe((player: PlayerInfo) => {
                        _player =  player   
        });
        this.nav.push(PlayerMg2uCreditsModal, {
            player: _player
        });
    }

    onHomeClick() {
        this.nav.popToRoot();//this.nav.setRoot(PlayerHomePage);
    }

    
    onFAQClick() {
        this.nav.push(FaqPage)
    }

    getPlayerCredits() {
        let _playerId;
        let _playerCountryId;
        this.player$.take(1)
            .subscribe(player => {
                _playerId = player.playerId;
                if(player.countryId) _playerCountryId = player.countryId
                else if(player.addressInfo) _playerCountryId = player.addressInfo.countryId;
            });
        this.totalClubCredits = 0;
        this.playerCredits = [];
        this.flightService.getPlayerCredits(_playerId)
        .subscribe((data)=>{
            if(data) {
                console.log("player id - ", _playerId, " -  credits : ", data)
                if(data && data.length > 0) {
                    data.forEach((cc: ClubCredit)=>{
                        JsonService.deriveFulImageURL(cc.club,'clubImage');
                        JsonService.deriveFulImageURL(cc.club,'clubLogo');
                    })
                    this.playerCredits = data
                    .filter((a: ClubCredit)=>{
                        return a.club.address.countryData.id === _playerCountryId
                    });
                    if(this.playerCredits && this.playerCredits.length > 0) {
                        this.totalClubCredits = this.playerCredits
                        .map((a)=>{
                            console.log("player credits map - ", a)
                            if(a) return a.balance
                            else return;
                        }).reduce((a,b)=>{
                            return a + b
                        });

                    }
                }
            }
        })
    }
    
    getClubCreditsCurrency() {
        if(!this.playerCredits) return; 
        let _playerId;
        let _playerCountryId;
        this.player$.take(1)
            .subscribe(player => {
                _playerId = player.playerId;
                _playerCountryId = player.countryId
            });

        let _currency = this.playerCredits.filter((a: ClubCredit)=>{
            return a.club.address.countryData.id === _playerCountryId
        }).map((a)=>{
            return a.currency.symbol;
        })
        return _currency[0];
    }
    onNotificationsClick() { 
        this.nav.push(NotificationsPage);
    }

    onChangeDefaultHcpSystem() {
        if(!this.handicapSystem || (this.handicapSystem && this.handicapSystem.length === 0)) {
            this.refreshHandicapSystem();
            return;
        }
        let _buttons = [];
        _buttons.push({
            text    :   "Set default Handicap System to"
        });

        let _handicapSystem = JsonService.clone(this.handicapSystem);
        let _player: PlayerInfo;
        this.player$.take(1) 
        .subscribe(player => {
            _player = player;
        });
        _handicapSystem = _handicapSystem.filter((hcp)=>{
            let _isPlayerDefault;
            if(hcp.id === _player.defaultHandicapSystem)
                _isPlayerDefault = true;
            return !_isPlayerDefault;
        })
        if(_handicapSystem && _handicapSystem.length > 0) {
            _handicapSystem.forEach((hcpSys: HandicapSystem)=>{
                if(hcpSys.id && hcpSys.derivedByMygolf) 
                _buttons.push({
                    text    :   hcpSys.name + " ("+hcpSys.shortCode+")",
                    handler :   () => {
                        // actionSheet.dismiss();
                        this.updatePlayerDefaultHcp(hcpSys);
                        // actionSheet.dismiss().then(()=>{
                        //     this.updatePlayerDefaultHcp(hcpSys);
                        // })
                    }
                  });
            })
        }
        let actionSheet = this.actionSheetCtl.create({
            buttons: _buttons
        });
        // [
        //     {
        //         text   : 'WHS 2020',
        //         handler: () => {
        //             actionSheet.dismiss()
        //                        .then(() => {
        //                         //    this.signout();
        //                        });
        //             return false;
        //         }
        //     }, {
        //         text   : 'USGA / myGolf2u',
        //         // icon   : !this.platform.is('ios') ? 'cog' : null,
        //         handler: () => {
        //             actionSheet.dismiss()
        //                        .then(() => {
        //                         //    this.nav.push(SettingsPage);
        //                        });
        //             return false;
        //         }
        //     }, {
        //         text   : 'NHS (MYS)',
        //         // icon   : 'albums',
        //         handler: () => {
        //             actionSheet.dismiss().then(() => {
        //                 // this.nav.push(ScorecardLocalListPage);
        //             });
        //             return false;
        //         }
        //     }
        // ]
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

    refreshHandicapSystem() {
        this.handicapSystem = [];
        
        let _player: PlayerInfo;
        
        this.player$.take(1) 
            .subscribe(player => {
                _player = player;
            });
        this.flightService.getPlayerHandicapIndex(_player.playerId, _player.defaultHandicapSystem)
        .subscribe((data: any)=>{
            console.log("refresh handicap idx : data", data)
            if(data) this.handicapIndex = data;
        });

        this.flightService.getHandicapSystemList()
        .subscribe((handicap: any)=>{
            // Array<HandicapSystem>
            if(handicap && handicap.length > 0) {
                this.handicapSystem = handicap;
            }
        })
    }

    
    updatePlayerDefaultHcp(handicapSystem: HandicapSystem) {
        let _player: PlayerInfo;
        
        
        this.player$.take(1)
            .subscribe((player: PlayerInfo) => {
                _player = JsonService.clone(player);
                if(handicapSystem) player.defaultHandicapSystem = handicapSystem.id
        });

        let busy              = this.loadingCtl.create({
            content: "Setting default handicap system..." + handicapSystem.id +","+ _player
        });

        if(handicapSystem) _player.defaultHandicapSystem = handicapSystem.id
        this.playerHomeActions.updatePlayerProfile(_player, true)
            .subscribe((result: boolean) => {
                busy.dismiss().then(() => {
                    // this.nav.pop();
                    if(result) {
                        console.log("updating player profile for default handicap system", result, _player)
                        this.refreshProfile();
                        // setTimeout(()=>{
                        //     this.viewCtrl.dismiss();
                        // },1000)
                    }
                    
                });
            }, (error) => {
                busy.dismiss().then(() => {
                    let msg = MessageDisplayUtil.getErrorMessage(error, "Error setting default handicap system");
                    MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl, 5000, "bottom");
                })
            })
    }

    getPlayerHcpSysDetail(handicapSystem) {
        if(!handicapSystem) return;
        if(!this.handicapSystem) return;
        if(this.handicapSystem && this.handicapSystem.length === 0) return '';
        let _hcpSystem: HandicapSystem;
        this.handicapSystem.filter((hcpSys)=>{
            if(hcpSys.id === handicapSystem) {
                _hcpSystem = hcpSys;
                return true;
            } else return false;
        })
        return _hcpSystem.shortCode;
    }

    getPlayerNHS() {
        let _playerNHS;
        if(!this.playerHandicapHistory) return;
        if(this.playerHandicapHistory && this.playerHandicapHistory.length > 0) {
            _playerNHS = this.playerHandicapHistory.filter((data: HandicapCalculation)=>{
                if(data && data.handicapSystem) {
                    return data.handicapSystem.toLowerCase().includes('nhs');
                }
                else return false;
            })
        }
        if(_playerNHS && _playerNHS.length > 0) {
            return _playerNHS[0].handicapIndex
        }
        else return false;
    }

    getTotalClubCredits() {
        if(!this.totalClubCredits) return;
        if(this.totalClubCredits === 0) return 0;
        return this.mg2uUtil.numberWithCommas(this.totalClubCredits.toFixed(2));
    }
    

}
