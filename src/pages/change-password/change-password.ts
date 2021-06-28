import {AlertController, LoadingController, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {Keyboard} from '@ionic-native/keyboard';
import {Component, Renderer} from '@angular/core';
import {MessageDisplayUtil} from '../../message-display-utils';
import {AuthenticationService} from '../../authentication-service';
import {PlayerInfo} from '../../data/player-data';
import {PlayerService} from '../../providers/player-service/player-service';
import {SessionDataService} from '../../redux/session/session-data-service';
import {SessionInfo} from '../../data/authentication-info';
@Component({
    templateUrl: 'change-password.html',
    selector: "change-password-page"
})
export class ChangePasswordPage
{
    player: PlayerInfo;

    password: string;
    password1: string;
    password2: string;
    loggedInPassword: string;

    constructor(public navParams: NavParams,
        public nav: NavController,
        private keyboard: Keyboard,
        private renderer: Renderer,
        private alertCtl: AlertController,
        private loaderCtl: LoadingController,
        private toastCtl: ToastController,
        private playerService: PlayerService,
        private auth: AuthenticationService,
        private sessionService: SessionDataService,
        private platform: Platform) {
        this.player = navParams.get("player");
    }

    async changePassword() {
        let session: SessionInfo = this.sessionService.getSession().toPromise();
        this.loggedInPassword = session.password;
            // this.auth.currentSession().password;
        console.log(this.loggedInPassword)
        if (this.platform.is('ios') && this.platform.is('cordova'))
            this.keyboard.close();
        if (!this.password || !this.password1 || !this.password2) {
            let subTitle = "Please enter all fields";
            MessageDisplayUtil.displayErrorAlert(this.alertCtl, "", subTitle, "OK");
            return false;
        }

        if (this.password1 !== this.password2) {
            let subTitle = "The New Password does not match";
            MessageDisplayUtil.displayErrorAlert(this.alertCtl, "", subTitle, "OK");
            return false;
        }

        if (this.password === this.password1) {
            let subTitle = "Please use different new password. ";
            MessageDisplayUtil.displayErrorAlert(this.alertCtl, "", subTitle, "OK");
            return false;
        }

        if (this.password1 && this.password1 === this.password2) {
            let loading = this.loaderCtl.create({
                content            : "Changing password. Please wait...",
                dismissOnPageChange: false,
                showBackdrop       : false
            });

            loading.present().then(() => {
                this.playerService.changePassword(this.player.email, this.password, this.password1)
                    .subscribe((msg: string) => {
                        // this._showAlert(msg, true);
                        loading.dismiss().then(() => {
                            MessageDisplayUtil.showMessageToast(msg, this.platform,
                                this.toastCtl, 2000, "botton");
                            this.nav.pop();
                        })
                    }, (error) => {
                        loading.dismiss().then(() => {
                            let msg = MessageDisplayUtil.getErrorMessage(error, "Error occured while changing " +
                                " the password. Connection to server may be down.");
                            MessageDisplayUtil.showErrorToast(msg, this.platform,
                                this.toastCtl, 5000, "bottom");
                        });
                    });
            });

        }
    }

}
