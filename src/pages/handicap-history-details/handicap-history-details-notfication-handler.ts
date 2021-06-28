import {ScorecardDisplayPage} from "./scorecard-display";
import {ToastController, NavController} from "ionic-angular";
import * as global from "../../globals";
import { HandicapHistoryDetailsPage } from "./handicap-history-details";
/**
 * Created by ashok on 13/10/16.
 */

export class ScorecardDisplayNotificationHandler
{

    constructor(private scorecardDisplay: HandicapHistoryDetailsPage,
        private navCtl: NavController,
        private toastCtl: ToastController) {

    }

    public handlePushNotification(pushData: any) {
        if (pushData && pushData.additionalData) {
            let data = pushData.additionalData;

            if (data.scoringFinished) {
                if (global.SharedObject.homeInfo) {
                    global.SharedObject.homeInfo.needRefresh = true;
                }
                let toast = this.toastCtl.create({
                    message            : pushData.message,
                    dismissOnPageChange: false,
                    duration           : 5000
                });
                toast.onDidDismiss(() => {
                    this.navCtl.remove(1, this.navCtl.length() - 2);
                });
                toast.present();
            }
            else if (data.flightChanged) {
                let toast = this.toastCtl.create({
                    message            : pushData.message + ". Reloading scorecard from server.",
                    dismissOnPageChange: false,
                    duration           : 5000
                });
                toast.onDidDismiss(() => {
                    this.scorecardDisplay.reloadScorecard(false);
                });
                toast.present();
            }
            else if (data.competitionCancelled) {
                if (data.competitionCancelled === this.scorecardDisplay.getScorecard().competitionId) {
                    //The competition for which you are scoring is cancelled. Exit.
                    if (global.SharedObject.homeInfo) {
                        global.SharedObject.homeInfo.needRefresh = true;
                    }
                    let toast = this.toastCtl.create({
                        message            : pushData.message + ". Taking back to home page.",
                        dismissOnPageChange: false,
                        duration           : 5000
                    });
                    toast.onDidDismiss(() => {
                        this.navCtl.popToRoot();
                    });
                    toast.present();
                }
            }
        }
    }
}
