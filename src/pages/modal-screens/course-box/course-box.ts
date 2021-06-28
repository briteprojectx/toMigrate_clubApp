import {Component, NgZone} from '@angular/core';
import {NavController, NavParams, Platform, ViewController} from 'ionic-angular';
import {CourseInfo} from '../../../data/club-course';
/**
 * Created by ashok on 22/12/16.
 */

@Component({
    selector   : 'course-box',
    templateUrl: 'course-box.html'
})
export class CourseBox
{
    courses: Array<any>; //Array<CourseInfo>;
    fromStarterList: boolean = false;
    excludeAll: boolean = false;

    constructor(private nav: NavController,
        private zone: NgZone,
        private navParams: NavParams,
        private platform: Platform,
        private viewCtl: ViewController) {

        this.fromStarterList = this.navParams.get("fromStarterList");
        this.excludeAll = this.navParams.get("excludeAll");


    }
    ionViewDidLoad(){
        this.zone.run(()=>{
            this.courses = [];
            if(this.fromStarterList)  {
                
                this.courses[0] = {
                    courseId: 0,
                    courseName: 'All Courses',
                    coursePar: 0,
                    photoUrl: '',
                    teeBoxes: [],
                    holes: []
                }
            }
               
            this.courses.push(...this.navParams.get("courses"));
            this.courses = this.courses.sort((a,b)=>{
                if(a.displayOrder < b.displayOrder) {
                //   if(a.courseName < b.courseName) return -1
                //   else if(a.courseName > b.courseName) return 1
                //   else return -1
                return -1
                }
                else if(a.displayOrder > b.displayOrder) {
                //   if(a.courseName < b.courseName) return -1
                //   else if(a.courseName > b.courseName) return 1
                //   else return 1
                return 1
                }
                else return 0
                //  {
                //   if(a.courseName < b.courseName) return -1
                //   else if(a.courseName > b.courseName) return 1
                //   else return 0
                // }
            });
                
            console.log("course box - nav params ", this.navParams.get("courses"))
            console.log("course box - courses ", this.courses)
            if(this.excludeAll) this.courses.shift();

        });
    }
    close() {
        this.viewCtl.dismiss();
    }

    selectCourse(course: any) {
        this.viewCtl.dismiss(course);
    }
}