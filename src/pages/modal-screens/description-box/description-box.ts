import {NavController, NavParams, ViewController} from "ionic-angular";
import {Component} from "@angular/core";

/*
 Generated class for the CompetitionDescriptionPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */

@Component({
    templateUrl: 'description-box.html',
    selector: 'description-box-page'
})
export class DescriptionBoxPage
{
    public title: string;
    public descriptionText: string;
    public headerName: string;

    constructor(public nav: NavController,
        private navParams: NavParams,
        private viewCtrl: ViewController) {
        this.title           = this.navParams.get("title");
        this.descriptionText = this.navParams.get("description");
        this.headerName      = this.navParams.get("headerName");
    }

    close() {
        this.viewCtrl.dismiss();
    }

    getInnerHTML() {
        let description = "<p><span style='background-color:#00FFFF'>Tournaments, electronic scorecards, analysis and more&hellip; Look no further! myGolf2u is a single place where you can find and register for any </span>competitions in your region, your favourite clubs or in the entire country on your phone or in this site.</p>"
        return description;
    }
}
