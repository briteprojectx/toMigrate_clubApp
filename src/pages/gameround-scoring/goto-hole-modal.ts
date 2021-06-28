import {Component} from "@angular/core";
import {CourseInfo, CourseHoleInfo} from "../../data/club-course";
import {ViewController, NavParams} from "ionic-angular";
/**
 * Created by ashok on 19/12/16.
 */
@Component({
    templateUrl: 'modal_gotoHole.html'
})
export class GotoHoleModal
{

    courses: Array<CourseInfo>;

    constructor(private viewCtrl: ViewController,
        private navParams: NavParams) {
        this.courses = navParams.get("courses");
    }
    close(){
        this.viewCtrl.dismiss();
    }
    selectHole(hole: CourseHoleInfo, whichNine: number) {
        this.viewCtrl.dismiss({
            hole     : hole,
            whichNine: whichNine
        });
    }
}
