import {NavController, Events, NavParams, ModalController, ViewController, LoadingController} from "ionic-angular";
import {Component} from "@angular/core";
import {AuthenticationService} from "../../../authentication-service";
import {getDistanceInKM} from "../../../globals";
// import {SelectCoursePage} from "../select-course/select-course";
import {ClubInfo, CourseInfo} from "../../../data/club-course";
import {GeolocationService} from "../../../providers/geolocation-service/geolocation-service";
import {ClubService} from "../../../providers/club-service/club-service";
import {PerformanceClubListPage} from "../club-list/club-list";

/**
 * The competition list page class. This class lists the competitions. There are
 * three types of listing
 * <ul>
 *    <li>Upcoming</li>
 *    <li>All Competitions</li>
 *    <li>Search competitions</li>
 *  </ul>
 *  This class extends Subscriber which is passed as parameter for Remote Http method so that
 *  results are processed
 */
@Component({
    templateUrl: 'course-list.html'
})
export class PerformanceCourseListPage
{
    public refresher: any;
    public infinite: any;

    public recentClubs: Array<ClubInfo>;
    public nearByClubs: Array<ClubInfo>;

    public selectedClub: ClubInfo;
    public clubCourses: Array<CourseInfo> = [];

    public courseId: number;
    public courseName: string;

    public clubInfo: ClubInfo;
    public prevClubInfo: ClubInfo;

    constructor(private nav: NavController,
        private modalCtl: ModalController,
        private auth: AuthenticationService,
        private geo: GeolocationService,
        private clubService: ClubService,
        private events: Events,
        private viewCtrl: ViewController,
        private navParams: NavParams,
        private loadingCtl: LoadingController) {
        this.recentClubs  = new Array<ClubInfo>();
        this.nearByClubs  = new Array<ClubInfo>();
        this.courseId     = navParams.get("courseId");
        this.courseName   = navParams.get("courseName");
        this.selectedClub = navParams.get("clubInfo");
        this.clubInfo     = navParams.get("clubInfo")
        this.prevClubInfo = navParams.get("clubInfo");

    }

    onPageLoaded() {
        //this._refreshValues();
    }

    ionViewDidLoad() {
        this.clubService.getClubCourses(this.selectedClub.clubId)
            .subscribe((courses: Array<CourseInfo>) => {
                this.clubCourses = courses;
                //  console.log("club courses:" +this.clubCourses);
            }, (error) => {
                console.log(error);
            });
        //console.log("selected club : "+this.selectedClub);

    }

    /**
     * Gets the distance between a current location and club in KMs
     * @param club The club information
     * @returns {number} Returns the distance in KM if GPS locations of current and club are available
     * else returns 0;
     */
    clubDistance(club: ClubInfo): string {
        let lat1 = this.geo.getLatitude();
        let lon1 = this.geo.getLongitude();
        if (lat1 != null && lon1 != null && club.latitude != null && club.longitude != null)
            return getDistanceInKM(lat1, lon1, club.latitude, club.longitude) + " KM";
        return "";
    }

    /**
     * Executed when refresh button on toolbar is clicked
     */
    onRefreshClick(refresher) {
        this.refresher = refresher;
        this._refreshValues();
    }

    courseSelected(event, item) {
        this.courseId   = item.courseId;
        this.courseName = item.courseName;
        this.viewCtrl.dismiss({courseInfo: item, apply: true});
    }

    clubSelected(event, item: ClubInfo) {
        // this.events.publish("clubSelected", item);
        /*  this.nav.push(SelectCoursePage,{
         club: item
         });*/
    }

    searchClubs() {
        let clubModal = this.modalCtl.create(PerformanceClubListPage, {
            openedModal: true
        });
        clubModal.onDidDismiss((data: any) => {
            //Check whether the club info is passed
            if (data.clubInfo) {
                this.clubSelected(null, data.clubInfo);
            }
        });
        clubModal.present();
    }

    private _refreshValues() {
        this.clubService.getNearbyClubs(3000)
            .subscribe((clubs: Array<ClubInfo>) => {
                this.nearByClubs = clubs;
            }, (error) => {
                console.log(error);
            }, () => {
                if (this.refresher) {
                    this.refresher.complete();
                    this.refresher = null;
                }
            });
        this.clubService.getRecentClubs(5)
            .subscribe((clubs: Array<ClubInfo>) => {
                this.recentClubs = clubs;
            }, (error) => {
                console.log(error);
            }, () => {
                if (this.refresher) {
                    this.refresher.complete();
                    this.refresher = null;
                }
            });
    }

    close() {
        this.viewCtrl.dismiss({apply: false});
    }
}
