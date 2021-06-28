import {Component} from '@angular/core';
import {Keyboard} from '@ionic-native/keyboard';
import {
    ActionSheetController,
    AlertController,
    Events,
    LoadingController,
    ModalController,
    NavController,
    NavParams,
    Platform,
    ToastController,
    ViewController
} from 'ionic-angular';
import {AuthenticationService} from '../../../authentication-service';
// import {SelectCoursePage} from "../select-course/select-course";
import {ClubInfo, ClubList, CourseInfo, createClubList} from '../../../data/club-course';
import {NewGameInfo} from '../../../data/game-round';
import {getDistanceInKM} from '../../../globals';
import {MessageDisplayUtil} from '../../../message-display-utils';
import {ClubService} from '../../../providers/club-service/club-service';
import {GeolocationService} from '../../../providers/geolocation-service/geolocation-service';
import {PlayerHomeDataService} from '../../../redux/player-home/player-home-data-service';
import {PerformanceClubListPage} from '../club-list/club-list';
import {PerformanceCourseListPage} from '../course-list/course-list';
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
    templateUrl: 'recent-club.html'
})
export class RecentClubListPage
{
    public refresher: any;
    public infinite: any;

    public recentClubs: Array<ClubInfo>;
    public nearByClubs: Array<ClubInfo>;

    public gameInfo: NewGameInfo;
    public clubList: ClubList;

    public openedModal: boolean = false;
    public searchQuery: string = '';
    public courseId: number;
    public courseName: string;
    public prevClubName: string;
    public prevCourseInfo: CourseInfo;

    public courseType: string;
    public clubInfo: ClubInfo;
    public prevClubInfo: ClubInfo;

    public courseInfo: CourseInfo;
    searchMode: boolean = false;

    
    searchDistance: number = 100;
    multiSelect: boolean = false;
    multiClub: Array<ClubInfo> = new Array<ClubInfo>();


    constructor(private nav: NavController,
        private alertCtl: AlertController,
        private keyboard: Keyboard,
        private actionSheetCtl: ActionSheetController,
        private modalCtl: ModalController,
        private loadingCtl: LoadingController,
        private auth: AuthenticationService,
        private geo: GeolocationService,
        private clubService: ClubService,
        private playerHomeService: PlayerHomeDataService,
        private events: Events,
        private navParams: NavParams,
        private viewCtl: ViewController,
        private toastCtl: ToastController,
        private platform: Platform) {
        this.recentClubs = new Array<ClubInfo>();
        this.nearByClubs = new Array<ClubInfo>();
        this.gameInfo    = {
            courses         : [],
            players         : [],
            availablePlayers: []
        }

        this.clubList    = createClubList();
        this.openedModal = navParams.get("openedModal");

        this.prevCourseInfo = navParams.get("courseInfo");
        this.prevClubName   = navParams.get("clubName");

        this.courseId   = navParams.get("courseId");
        this.courseName = navParams.get("courseName");

        this.courseType = navParams.get("courseType");
        console.log("course type : ", this.courseType)

        this.clubInfo     = navParams.get("clubInfo");
        this.prevClubInfo = navParams.get("clubInfo");

        this.courseInfo     = navParams.get("courseInfo");
        this.prevCourseInfo = navParams.get("courseInfo");

        this.multiSelect = navParams.get("multiSelect");

    }

    ionViewDidLoad() {
        this.playerHomeService.playerHomeInfo().take(1)
            .map(data=>data.player)
            .subscribe(player=>{
                this.gameInfo.players.push(player);
                this._refreshValues();
            });

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

    onMultiClubSelected(item: ClubInfo) {
        // this.multiClub.push(item);
        let _hasClub;
        console.log("select multi", item, this.multiClub);
        if(this.multiClub && this.multiClub.length > 0) {
            _hasClub = this.multiClub.filter((c)=>{
                if(c.clubId === item.clubId) return true;
                else return false;
            });
            if(_hasClub && _hasClub.length>0) return false;
            else this.multiClub.push(item);
        } else {
            this.multiClub.push(item);
        }

        console.log("select multi", this.multiClub);
    }

    getMultiClubText() {
            let _clubList = '';
            this.multiClub.forEach((c: ClubInfo, idx: number)=>{
                console.log("club player select - ", idx, c)
                // if(idx > 0) 
                _clubList += c.clubName + ', '
            });
            return _clubList; //.slice(0,-1);// .substring(0,_playersList.length-1);

    }

    clearMultiClub() {
        this.multiClub.pop();
    }

    selectMultiClubs() {
        this.viewCtl.dismiss({
            confirm: true,
            multiClub: this.multiClub,
        })
    }

    clubSelected(event, item: ClubInfo) {
        if(this.multiSelect) {
            this.onMultiClubSelected(item);
            return false;
        } 
        if (0) { //this.openedModal
            this.viewCtl.dismiss(item);
        } else {
            // this.events.publish("ClubSelected:Name", item.clubName);
            /*this.nav.push(PerformanceCourseListPage, {
             courseId: this.courseId,
             courseName: this.courseName,
             club: item
             });*/
            console.log("Course Type:",this.courseType,"Club Item:",item)
            if (this.courseType == 'course') {
                let clubCourse = this.modalCtl.create(PerformanceCourseListPage, {
                    courseId  : this.courseId,
                    courseName: this.courseName,
                    clubInfo  : item,
                    courseInfo: this.courseInfo

                });

                clubCourse.onDidDismiss((data: any) => {
                    // courseInfo: CourseInfo, courseId: number, courseName: string
                    //this.courseInfo = courseInfo
                    // console.log("cancel?:", data.courseInfo)
                    // this.clubInfo = data.courseInfo;
                    if (!data){
                     this.viewCtl.dismiss({apply: false, courseInfo: this.prevCourseInfo, clubInfo: this.prevClubInfo});
                     return false;
                   } else if(data){
                     console.log("course.dismiss:",data)
                                         if (!data.courseInfo) {
                                             this.courseName = 'Please choose a course';
                                             console.log("Please choose a course:",this.prevClubInfo, this.prevCourseInfo);
                                             this.viewCtl.dismiss({apply: data.apply,courseInfo: this.prevCourseInfo, clubInfo: this.prevClubInfo});
                                             return false;
                                         } else if(data.courseInfo) {
                                             this.clubInfo = data.courseInfo;

                                             // console.log("club dismiss:", courseInfo);
                                             // console.log("courseID:" + courseInfo.courseId + "\nCourse Name:" + courseInfo.courseName)
                                             console.log("club name:", item.clubName)
                                             console.log("club", item)
                                             if (this.openedModal) {
                                                 this.viewCtl.dismiss({
                                                     apply: data.apply,
                                                     courseInfo: data.courseInfo,
                                                     clubInfo  : item
                                                 });
                                             }
                                         }
                   }



                    //this.searchCriteria = this.perfService.getSearch();
                    //this.perfService.setPerformanceFilter(this.searchCriteria.performanceHolesPlayed, this.courseInfo.courseId);
                    // console.log("CourseSelected:Id",this.searchCriteria.performanceHolesPlayed)
                    //if(apply) this.refreshAnalysisHole();

                });
                clubCourse.present();
            } else if (this.courseType == 'club') {
                console.log("RecentClub::CourseType::", this.courseType, item)
                this.clubInfo = item;
                this.viewCtl.dismiss({courseInfo: [], clubInfo: item});

            }
        }
    }


    searchClubs() {
        let clubModal = this.modalCtl.create(PerformanceClubListPage, {
            openedModal: true,
            clubInfo   : this.clubInfo,
            courseInfo : this.courseInfo
        });
        clubModal.onDidDismiss((data: any) => {
            //Check whether the club info is passed
            if (data.clubInfo) {
                this.clubInfo = data.clubInfo;
                this.clubSelected(null, data.clubInfo);
            }
        });
        clubModal.present();
    }

    private _refreshValues() {
        this.clubService.getNearbyClubs(this.searchDistance)
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
                // console.log("recent clubs list:", this.recentClubs)
                //                 if(this.recentClubs.length===0) {
                //                   this.searchClubs();
                //                 }
            });
    }

    close() {
        console.log("Recent::Close:PrevCourseInfo", this.prevCourseInfo, "PrevClubInfo", this.prevClubInfo)
        this.viewCtl.dismiss({courseInfo: this.prevCourseInfo, clubInfo: this.prevClubInfo});
    }

    onSearchInput(event) {
        this._clearItems();
        this._refreshClubs(null, null);
    }
    private _clearItems() {
        this.clubList = createClubList();
        if (this.searchQuery == "") {
            this.searchMode = false;
            return false;
        } else this.searchMode = true;
    }
    private _refreshClubs(refresher, infinite) {
        // let busy = this.loadCtl.create({
        //     content: "Please wait..."
        // });
        // busy.present().then(()=>{
        this.clubService.searchClubs(this.searchQuery, true, this.clubList.currentPage + 1)
            .subscribe((clubList: ClubList) => {
                // busy.dismiss().then(()=>{
                this.clubList.currentPage = clubList.currentPage;
                this.clubList.totalPages = clubList.totalInPage;
                this.clubList.totalItems = clubList.totalItems;
                this.clubList.clubs.push(...clubList.clubs);

                // });

            }, (error) => {
                // busy.dismiss().then(()=>{
                let msg = MessageDisplayUtil.getErrorMessage(error, "Error getting club list");
                MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl, 5000, "bottom");
                // })
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
                if (this.platform.is('ios') || this.platform.is('cordova'))
                    this.keyboard.close();
            });
        // });

    }
    isMore(): boolean {
        return this.clubList && this.clubList.totalPages > 0
            && this.clubList.currentPage < this.clubList.totalPages;
    }
    filterClubSelected(event, data: ClubInfo) {
        this.clubSelected(null, data);

    }

}
