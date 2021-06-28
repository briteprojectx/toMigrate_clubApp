import {Component} from '@angular/core';
import {DatePicker} from '@ionic-native/date-picker';
import {AlertController, LoadingController, NavController, NavParams, Platform, ToastController,ViewController} from 'ionic-angular';
import * as moment from 'moment';
import {Observable} from 'rxjs/Observable';
import {JsonService} from '../../json-util';
import {MessageDisplayUtil} from '../../message-display-utils';
import {PlayerService} from '../../providers/player-service/player-service';
import {PlayerHomeActions} from '../../redux/player-home/player-home-actions';
import {PlayerHomeInfo, PlayerInfo} from './../../data/player-data';
import {Country} from './../../data/country-location';

@Component({
    templateUrl: 'edit-profile.html',
    selector: 'edit-profile-page'
})
export class EditProfilePage {
    public homeInfo$: Observable<PlayerHomeInfo>;
    public player$: Observable<PlayerInfo>;
    public type: string;
    public player: PlayerInfo;
    public dob: any;
    public dobDisplay: string;
    public countryList: Array<Country>;
    public flagUrl: string;
    public previousEmail: string;
    public newPassword: string;
    public confirmPassword: string;

    constructor(private navParams: NavParams,
        private datePicker: DatePicker,
        private platform: Platform,
        private nav: NavController,
        private loadingCtl: LoadingController,
        private toastCtl: ToastController,
        private alertCtl: AlertController,
        private playerHomeActions: PlayerHomeActions,
        private playerService: PlayerService,
        private viewCtrl: ViewController) {
        // this.current  = navParams.get("player");
        this.type      = navParams.get('type');
        this.homeInfo$ = navParams.get("homeInfo");
        this.player$   = navParams.get('player');
        if (!this.player$) {
            this.player$ = this.homeInfo$.map((playerHomeInfo: PlayerHomeInfo) => playerHomeInfo.player);
        }
        this.player$.take(1)
            .map((player: PlayerInfo) => {
                return player.birthdate;
            }).filter(Boolean)
            .subscribe((birthdate) => {
                this.dob        = moment(birthdate).format("YYYY-MM-DD");
                this.dobDisplay = moment(birthdate).format("MMM D, YYYY");
            });
        this.player$.take(1)
            .subscribe((player: PlayerInfo) => {
                this.player = JsonService.clone(player);
                this.player.countryId = this.player.addressInfo.countryId
                this.player.countryName = this.player.addressInfo.countryName
            });
    }

    ionViewDidLoad() {
        this.getCountry();
        this.previousEmail = this.player.email;
    }

    updateProfile() {
        let _password;
        if(!this.player.email || this.player.email.length === 0) {
            MessageDisplayUtil.showErrorToast('Please enter valid email address', this.platform, this.toastCtl, 5000, "bottom");
            return false;
        }
        if(this.hasEmailChanged()) {
            if(!this.player.email) {
                MessageDisplayUtil.showErrorToast('Please enter valid email address', this.platform, this.toastCtl, 5000, "bottom");
                return false;
            }
            if(!this.newPassword) {
                MessageDisplayUtil.showErrorToast('Please enter new password', this.platform, this.toastCtl, 5000, "bottom");
                return false;
            } else if(!this.confirmPassword) {
                MessageDisplayUtil.showErrorToast('Please confirm your new password', this.platform, this.toastCtl, 5000, "bottom");
                return false;
            }
            if(this.newPassword !== this.confirmPassword) {
                MessageDisplayUtil.showErrorToast('Please make sure your new and confirmed password are matched', this.platform, this.toastCtl, 5000, "bottom");
                return false;
            }
            else if(this.newPassword === this.confirmPassword) {
                _password = this.newPassword;
                this.player.password = this.newPassword;
            }

        }
        if(!this.player.phone) {
            MessageDisplayUtil.showErrorToast('Please enter valid Mobile numbers for better experience in the future', 
            this.platform, this.toastCtl, 5000, "bottom");
            return false;
        }
        let _phoneLength = 10
        // if(this.player.phone.startsWith('60')) _phoneLength = 11;
        if(!this.player.phone.startsWith('0')) _phoneLength = 11;
        // else
        if((this.player.phone && this.player.phone.length > 0 && this.player.phone.length < _phoneLength)) {
            MessageDisplayUtil.showErrorToast('Since Mobile number starts with '+this.player.phone[0]+'. Please enter Mobile number more than ' + _phoneLength + ' digits for better experience in the future', 
            this.platform, this.toastCtl, 5000, "bottom");
            return false;
        }
        // if(!this.dob) {
        //     MessageDisplayUtil.showErrorToast('Please update your Date of Birth to get amazing booking deals', 
        //     this.platform, this.toastCtl, 5000, "bottom");
        //     return false;
        // }
        let busy              = this.loadingCtl.create({
            content: "Updating profile..."
        });
        if(this.dob) this.player.birthdate = moment(this.dob).toDate();
        let friend            = (this.type === 'friendProfile');
        this.playerHomeActions.updatePlayerProfile(this.player, friend)
            .subscribe((result: boolean) => {
                busy.dismiss().then(() => {
                    if (friend) {
                        this.player$.take(1).subscribe((curPlayer: PlayerInfo) => {
                            curPlayer.firstName  = this.player.firstName;
                            curPlayer.lastName   = this.player.lastName;
                            curPlayer.playerName = this.player.firstName
                                + " " + this.player.lastName
                            curPlayer.email      = this.player.email;
                            curPlayer.phone      = this.player.phone;
                            curPlayer.gender     = this.player.gender;
                            curPlayer.teeOffFrom  = this.player.teeOffFrom;
                            curPlayer.handicap   = this.player.handicap;
                            curPlayer.birthdate  = moment(this.dob, "YYYY-MM-DD").toDate();
                            curPlayer.countryId =  this.player.countryId;
                            curPlayer.nationalityId = this.player.nationalityId;
                        });
                    }
                    // this.nav.pop();
                    if(result) {
                        setTimeout(()=>{
                            this.viewCtrl.dismiss();
                        },1000)
                    }
                    
                });
            }, (error) => {
                busy.dismiss().then(() => {
                    let msg = MessageDisplayUtil.getErrorMessage(error, "Error updating player profile");
                    MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl, 5000, "bottom");
                })
            })
    }
    onHomeClick() {
        this.nav.popToRoot();
    }

    onCancelClick() {
        this.viewCtrl.dismiss();
    }

    cordova(): boolean {
        return this.platform.is("cordova");
    }

    /**
     * This method is called in Cordova environment. This will display the date and
     */
    onBirthDateClick() {
        this.datePicker.show({
            mode: "date",
            date: moment(this.dob).toDate()
        }).then((date: Date) => {
            this.dob        = moment(date).format("YYYY-MM-DD");
            this.dobDisplay = moment(date).format("MMM D, YYYY");
        });
    }

    getCountry() {
        this.playerService.getCountryList()
                .subscribe((data: Array<Country>) => {
                            // console.log("Country Sign Up : ",data)
                            this.countryList = data;
                            // console.log("Country List Sign Up : ", this.countryList)
        });
    }

    getFlagUrl(flagUrl: string) {
        if (flagUrl==null) return null;
        else {
            let flagIcon = flagUrl.split("/");
            return "img/flag/"+flagIcon[2];
        }

        
    }

    
    hasEmailChanged() {
        if(!this.previousEmail) return false;
        // console.log("has email changed : ", this.previousEmail, " vs ", this.player.email)
        // if(this.previousEmail.length > 0 && this.player.email.length > 0) {
            if(this.previousEmail !== this.player.email) return true;
        //     else return false
        // }
        else return false;
    }
}
