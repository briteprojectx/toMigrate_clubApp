import {
    AlertController,
    LoadingController,
    NavController,
    NavParams,
    Platform,
    ToastController,
    ViewController
} from 'ionic-angular/index';
import {ClubService} from '../../../providers/club-service/club-service';
import {CourseInfo} from '../../../data/club-course';
import {isPresent} from 'ionic-angular/util/util';
// import {PlainScorecard} from '../../../data/scorecard';
import {NormalgameService} from '../../../providers/normalgame-service/normalgame-service';
import {MessageDisplayUtil} from '../../../message-display-utils';
import {ScorecardService} from '../../../providers/scorecard-service/scorecard-service';
import {PlainScoreCard} from '../../../data/mygolf.data';
import {Component} from '@angular/core';
/**
 * Created by Ashok on 23-06-2016.
 */

@Component({
    templateUrl: "change-course.html"
})
export class ChangeCoursePage
{
    currentCourse: CourseInfo;
    editingScorecard: boolean;
    scorecard: PlainScoreCard;
    coursesToSelect: Array<CourseInfo> = [];
    newCourse: CourseInfo;

    constructor(private nav: NavController,
        private navParams: NavParams,
        private viewCtl: ViewController,
        private alertCtl: AlertController,
        private loadCtl: LoadingController,
        private platform: Platform,
        private toastCtl: ToastController,
        private clubService: ClubService,
        private scorecardService: ScorecardService,
        private normalGameService: NormalgameService) {
        this.currentCourse    = navParams.get("currentCourse");
        this.scorecard        = navParams.get("scorecard");
        this.editingScorecard = navParams.get("editingScorecard");
    }

    ionViewDidLoad() {
        //Refresh the course to select
        this.coursesToSelect = [];
        let busy             = this.loadCtl.create({
            content: "Loading courses..."
        });
        busy.present().then(() => {
            this.clubService.getClubCourses(this.scorecard.clubId)
                .subscribe((courses: Array<CourseInfo>) => {
                    busy.dismiss().then(() => {
                        let otherCourses = courses
                            .filter(c => c.courseId !== this.currentCourse.courseId);
                        this.coursesToSelect.push(...otherCourses);
                    });

                }, (error) => {
                    busy.dismiss().then(() => {

                    });
                });
        });

    }

    getWhichNine() {
        if (this.currentCourse.whichNine === 1)
            return "First Nine";
        else if (this.currentCourse.whichNine === 2)
            return "Second Nine";
        else if (this.currentCourse.whichNine === 3)
            return "Third Nine";
        else return "Nine " + this.currentCourse.whichNine;
    }

    isChanged(): boolean {
        return isPresent(this.newCourse)
            && this.newCourse.courseId !== this.currentCourse.courseId;
    }

    changeCourse() {
        let busy = this.loadCtl.create({
            content: "Changing course..."
        });
        console.log("new course:",this.newCourse,"editing scorecard:",this.editingScorecard)
        busy.present().then(() => {
            this.normalGameService.changeCourse(this.scorecard,
                this.currentCourse.whichNine, this.newCourse, this.editingScorecard)
                .subscribe((result: boolean) => {
                    this.scorecardService.saveCurrentScorecard(this.scorecard)
                        .subscribe((scorecard: PlainScoreCard) => {
                            busy.dismiss().then(() => {
                                this.viewCtl.dismiss(this.newCourse);
                            })
                        }, (error) => {
                            busy.dismiss();
                        });
                }, (error) => {
                    busy.dismiss().then(() => {
                        let msg = MessageDisplayUtil.getErrorMessage(error, "Error changing the course");
                        MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl, 5000, "bottom");
                    });

                });
        })

    }

    cancel() {
        this.viewCtl.dismiss();
    }
}
