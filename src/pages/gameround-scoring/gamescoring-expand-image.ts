import {Component} from "@angular/core";
import {CourseHoleInfo} from "../../data/club-course";
import {ViewController, NavParams} from "ionic-angular";
/**
 * Created by ashok on 19/12/16.
 */
@Component({
    templateUrl: 'hole-img-expand.html'
})
export class GameScoringExpandImage
{
    private courseHole: CourseHoleInfo;

    constructor(private viewCtrl: ViewController, private navParams: NavParams) {
        this.viewCtrl   = viewCtrl;
        this.navParams  = navParams;
        this.courseHole = navParams.get("courseHole");
    }

    close() {
        this.viewCtrl.dismiss();
    }

    toYard(_meter) {
        let _yard = _meter * 1.094;
        return _yard.toFixed(3)
    }
}
