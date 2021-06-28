import {NavController, NavParams, ViewController, Events, ModalController, LoadingController} from "ionic-angular";
import {AuthenticationService} from "../../../authentication-service";
import {getDistanceInKM} from "../../../globals";
import {ClubInfo, ClubList, createClubList, CourseInfo} from "../../../data/club-course";
import {GeolocationService} from "../../../providers/geolocation-service/geolocation-service";
import {ClubService} from "../../../providers/club-service/club-service";
import {Component, Renderer} from "@angular/core";

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
    templateUrl: 'club-list.html'
})
export class PerformanceClubListPage
{
    public refresher: any;
    public infinite: any;

    public clubList: ClubList;
    public openedModal: boolean = false;
    public searchQuery: string = "";
    public courseId: number;
    public courseName: string;
    public prevClubName: string;
    public prevCourseInfo: CourseInfo;
    public courseType: string;
    public clubInfo: ClubInfo;
    public prevClubInfo: ClubInfo;

    constructor(private nav: NavController,
        private navParams: NavParams,
        private renderer: Renderer,
        private auth: AuthenticationService,
        private modalCtl: ModalController,
        private geo: GeolocationService,
        private clubService: ClubService,
        private viewCtl: ViewController,
        private events: Events,
        private loadingCtl: LoadingController) {
        this.clubList    = createClubList();
        this.openedModal = navParams.get("openedModal");

        this.prevCourseInfo = navParams.get("courseInfo");
        this.prevClubName   = navParams.get("clubName");

        this.courseId   = navParams.get("courseId");
        this.courseName = navParams.get("courseName");
        this.courseType = navParams.get("courseType");

        this.clubInfo     = navParams.get("clubInfo");
        this.prevClubInfo = navParams.get("clubInfo");
    }

    ionViewDidLoad() {
        this._refreshClubs(null, null);
    }

    ionViewDidEnter() {
        // adjustViewZIndex(this.nav, this.renderer);
    }

    onSearchInput(event) {
        this._clearItems();
        this._refreshClubs(null, null);
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
        this._clearItems();
        this._refreshClubs(refresher, null);
    }

    doInfinite(infinite) {
        console.log("Current Page = " + this.clubList.currentPage);
        if (this.isMore()) {
            this._refreshClubs(null, infinite);
        }

    }

    clubSelected(event, item: ClubInfo) {
        if (this.openedModal) this.viewCtl.dismiss({clubInfo: item});
    }

    close() {
        this.viewCtl.dismiss({courseInfo: this.prevCourseInfo, clubInfo: this.prevClubName});
    }

    private _clearItems() {
        this.clubList = createClubList();
    }

    private _refreshClubs(refresher, infinite) {
        this.clubService.searchClubs(this.searchQuery, true, this.clubList.currentPage + 1)
            .subscribe((clubList: ClubList) => {
                this.clubList.currentPage = clubList.currentPage;
                this.clubList.totalPages  = clubList.totalInPage;
                this.clubList.totalItems  = clubList.totalItems;
                this.clubList.clubs.push(...clubList.clubs);
                console.log("Total = " + this.clubList.clubs.length);
            }, (error) => {

            }, () => {
                //Handle the refresher or infinite
                if (refresher && refresher.complete) refresher.complete();
                if (infinite) {
                    if (infinite.complete) infinite.complete();
                    if (this.isMore()) {
                        infinite.enable(true);
                    }
                    else infinite.enable(false);
                }
            });
    }

    isMore(): boolean {
        return this.clubList.totalPages > 0
            && this.clubList.currentPage < this.clubList.totalPages;
    }
}
