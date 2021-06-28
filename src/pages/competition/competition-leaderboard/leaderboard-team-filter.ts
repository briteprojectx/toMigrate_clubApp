import {Component} from "@angular/core";
import {CompetitionTeams} from "../../../data/competition-data";
import {ViewController, NavParams} from "ionic-angular";
/**
 * Created by ashok on 19/12/16.
 */
@Component({
    templateUrl: 'modal_teamFilter.html'
})
export class CompetitionLeaderboardTeamFilter
{
    private compTeams: CompetitionTeams;
    // private selectedTeam: string;
    constructor(private viewCtrl: ViewController, private navParams: NavParams) {
        this.viewCtrl  = viewCtrl;
        this.navParams = navParams;
        this.compTeams = navParams.get("compTeams");

    }
    cancel(){
        this.viewCtrl.dismiss();
    }
    selectTeam(all, team?) {
        this.viewCtrl.dismiss({
            team: team,
            all : all
        });
    }
}
