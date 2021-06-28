import {NavController, ToastController} from 'ionic-angular';
import {GameRoundScoringPage} from './gameround-scoring';
/**
 * Created by ashok on 14/09/16.
 */

export class GameRoundScoringNotificationHandler
{
    constructor(private scoringPage: GameRoundScoringPage,
        private nav: NavController,
        private toastCtl: ToastController) {

    }

    public handlePushNotification(pushData: any) {
        if (pushData && pushData.additionalData) {
            let data = pushData.additionalData;
            if (data.flightChanged) {
                this._onFlightChange(pushData);
            }
            else if (data.competitionCancelled) {
                // if (data.competitionCancelled === this.scoringPage.scorecard.competitionId) {
                //     //The competition for which you are scoring is cancelled. Exit.
                //     if (global.SharedObject.homeInfo) {
                //         global.SharedObject.homeInfo.needRefresh = true;
                //     }
                //     let toast = this.toastCtl.create({
                //         message            : pushData.message + ". Taking back to home page.",
                //         dismissOnPageChange: false,
                //         duration           : 5000
                //     });
                //     toast.onDidDismiss(() => {
                //         this.nav.popToRoot();
                //     });
                //     toast.present();
                // }
            }
            else if (data.scoringFinished) {
                // if (this.scoringPage.scorecard.competition
                //     && this.scoringPage.scorecard.competitionId === data.scoringFinished.competitionId) {
                //
                //     if (global.SharedObject.homeInfo) {
                //         global.SharedObject.homeInfo.needRefresh = true;
                //     }
                //     let toast = this.toastCtl.create({
                //         message            : pushData.message + ". Taking back to home page.",
                //         dismissOnPageChange: false,
                //         showCloseButton    : true,
                //         closeButtonText    : "OK"
                //     });
                //     toast.onDidDismiss(() => {
                //         this.nav.popToRoot();
                //     });
                //     toast.present();
                // }
            }
        }
    }

    private _onFlightChange(pushData: any) {
        // this._displayAndReload(pushData);
    }

    // private _displayAndReload(pushData: any) {
    //     // this.scoringPage.reloadScorecard(false);

    // }

}
