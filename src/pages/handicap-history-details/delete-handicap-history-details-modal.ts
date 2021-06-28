import {PlainScorecard} from "../../data/scorecard";
import {ViewController, NavParams} from "ionic-angular";
import {AuthenticationService} from "../../authentication-service";
import {Component} from "@angular/core";
import {SessionInfo} from '../../data/authentication-info';
import {SessionDataService} from '../../redux/session/session-data-service';
/**
 * Created by ashok on 19/12/16.
 */
@Component({
    templateUrl: "delete-handicap-history-details-modal.html"
})
export class DeleteHandicapHistoryDetailsModal
{
    scorecard: PlainScorecard;
    totalScored: number;
    session: SessionInfo;
    constructor(private viewCtl: ViewController,
        private auth: AuthenticationService,
        private sessionService: SessionDataService,
        navParams: NavParams) {
        this.scorecard   = navParams.get("scorecard");

    }
    ionViewDidLoad() {
        this.sessionService.getSession().take(1)
            .map(session=>session.playerId)
            .filter(Boolean)
            .subscribe((loggedPlayer: number)=>{
                this.totalScored = this.scorecard.playerRoundScores
                                       .map(prs => prs.scoringPlayerId)
                                       .filter(scorer => scorer === loggedPlayer)
                    .length;
            });
    }

    deleteAll() {
        this.viewCtl.dismiss({
            delete: "all"
        });
    }

    deleteMyScores() {
        this.viewCtl.dismiss({
            delete: "my"
        });
    }

    cancelDelete() {
        this.viewCtl.dismiss({
            delete: "none"
        });
    }
}
