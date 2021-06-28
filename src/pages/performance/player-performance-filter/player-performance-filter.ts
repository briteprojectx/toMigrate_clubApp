import {
    AlertController,
    Events,
    ModalController,
    NavController,
    NavParams,
    Platform,
    ViewController
} from 'ionic-angular';
import {SearchCriteria} from '../../../data/search-criteria';
import {isPresent} from 'ionic-angular/util/util';
import * as moment from 'moment';
import {DatePicker} from '@ionic-native/date-picker';
import {PlayerPerformanceService} from '../../../providers/playerPerformance-service/playerPerformance-service';
import {testAnalysis} from '../../../data/playerPerformance-data';
import {RecentClubListPage} from '../recent-club/recent-club';
import {ClubInfo, CourseInfo, createClubInfo, createCourseInfo} from '../../../data/club-course';
import {PerformanceSearchPlayerListPage} from '../search-player-list/search-player-list';
import {PlayerInfo} from '../../../data/player-data';
import {MessageDisplayUtil} from '../../../message-display-utils';
import {Component, Renderer} from '@angular/core';
@Component({
    templateUrl: 'player-performance-filter.html',
    selector: 'performance-filter'
})
export class PerformanceFilters {

    searchCriteria: SearchCriteria;
    filterType: string;
    startDate: Date;
    endDate: Date;
    holesPlayed: string;
    searchType: string;
    analysisType: string;
    courseName: string;
    courseId: number;
    courseInfo: CourseInfo;
    public prevCourseInfo: CourseInfo;
    performanceType: string = '';
    clubName: string;
    textTodayDisplay: string;
    playersSelected: Array<PlayerInfo> = [];
    playersList: string;
    playerIdList: string = '';
    checkboxCourse: boolean;
    openedModal: boolean;
    checkNGames: boolean;
    isoStartDate: string;
    isoEndDate: string;
    periodSelection: string;
    courseType: string;
    clubInfo: ClubInfo;
    prevClubInfo: ClubInfo;
    testAnalysis: testAnalysis;

    constructor(public platform: Platform,
        private viewCtrl: ViewController,
        private navParams: NavParams,
        private renderer: Renderer,
        private datePicker: DatePicker,
        private modalCtl: ModalController,
        private alertCtl: AlertController,
        private events: Events,
        private nav: NavController,
        private perfService: PlayerPerformanceService) {
        this.navParams = navParams;

        this.searchCriteria = perfService.getSearch();
        this.performanceType = navParams.get("analysisType");
        this.periodSelection = "last";
        this.testAnalysis = navParams.get("needRefresh");

        console.log("Initial Search Criteria", this.searchCriteria);
        if (!isPresent(this.searchCriteria.performanceSelectedPlayers)) {
            this.playersSelected = [];
        } else this.playersSelected = this.searchCriteria.performanceSelectedPlayers
        console.log("Filter:" + this.searchCriteria.performanceSelectedPlayers);
        if (!isPresent(this.searchCriteria.periodType))
            this.searchCriteria.periodType = "NONE";
        if (!isPresent(this.searchCriteria.lastNGames))
            this.searchCriteria.lastNGames = 10;
        if (!isPresent(this.searchCriteria.performanceHolesPlayed)) {
            // if (this.performanceType == 'performance')
            this.searchCriteria.performanceHolesPlayed = 18;
            if (this.performanceType == 'analysis')
                this.searchCriteria.performanceHolesPlayed = 9;

        }

        this.viewCtrl = viewCtrl;
        this.nav = nav;
        this.filterType = 'Latest10';
        this.holesPlayed = String(this.searchCriteria.performanceHolesPlayed);
        this.analysisType = 'game';
        this.courseName = 'Please choose a course';
        this.clubName = 'Please choose a club';
        this.courseInfo = navParams.get("courseInfo");
        this.prevCourseInfo = navParams.get("courseInfo");
        this.checkboxCourse = false;
        this.openedModal = navParams.get("openedModal");
        this.checkNGames = false;

        this.courseType = navParams.get("courseType");
        this.clubInfo = navParams.get("clubInfo");
        this.prevClubInfo = navParams.get("clubInfo");

        if (isPresent(this.courseInfo)) {
            if (!isPresent(this.courseInfo[0]))
                this.courseId = this.courseInfo.courseId;
            else this.courseId = this.courseInfo[0].courseId;

            if (!isPresent(this.courseInfo[0]))
                this.courseName = this.courseInfo.courseName;
            else this.courseName = this.courseInfo[0].courseName;
            console.log("Course Info present:", this.courseInfo)
            if (this.courseInfo.courseId > 0 || this.clubInfo.clubId > 0) this.checkboxCourse = true;
            // console.log(this.courseId + this.courseName)

        }

        if (this.performanceType == "analysis") {
            this.checkboxCourse = true;
            this.clubInfo = navParams.get("clubInfo");
            this.courseInfo = navParams.get("courseInfo");
            // console.log(this.courseId + " + " + this.courseName + " + " + this.checkboxCourse)
            // console.log("from hole anaylsis course:", this.courseInfo)
        } else if (this.performanceType == "performance") {
            this.clubInfo = navParams.get("clubInfo");
            this.courseInfo = navParams.get("courseInfo");
        }
        this.endDate = moment().toDate();
        this.isoEndDate = moment().toISOString();
        this.startDate = moment().add(-1, "months").toDate();
        this.isoStartDate = moment().add(-1, "months").toISOString();
        // if (!isPresent(this.perfService.getDateTo())) {
        //     // this.endDate    = moment(this.pickerTodayDisplay()).toDate();
        //     this.endDate = moment().toDate();
        //     this.isoEndDate = moment().toISOString();
        //
        // } else {
        //     this.endDate    = moment(this.perfService.getDateTo()).toDate();
        //     this.isoEndDate = moment(this.perfService.getDateTo()).add(1, 'd').toISOString();
        //
        // }
        //
        // if (!isPresent(this.perfService.getDateFrom())) {
        //     // this.startDate    = moment(this.pickerTodayDisplay()).toDate();
        //     this.startDate = moment().add(-1, "months").toDate();
        //     this.isoStartDate = moment().add(-1, "months").toISOString();
        //
        // } else {
        //     this.startDate    = moment(this.perfService.getDateFrom()).toDate();
        //     this.isoStartDate = moment(this.perfService.getDateFrom()).add(1, 'd').toISOString();
        // }
    }

    // ionViewDidEnter(){
    //     adjustViewZIndex(this.nav, this.renderer);
    // }
    goPlayerList() {

        let playerModal = this.modalCtl.create(PerformanceSearchPlayerListPage, {
            selectedPlayerList: this.playersSelected
        });

        playerModal.onDidDismiss((data: Array<PlayerInfo>) => {
            this.searchCriteria.playerIds = '';
            if (data) {
                this.playersSelected = data;
                this.searchCriteria.performanceSelectedPlayers = data
            }
            for (let i in data) {
                this.searchCriteria.playerIds += data[i]["playerId"] + ",";
            }
        });
        playerModal.present();
    }

    showDate(textDate) {
        console.log(textDate)
    }

    isCordova() {
        return this.platform.is("cordova");
    }

    startDateDisplay() {
        return moment(this.startDate).format("MMM DD, YYYY");
    }

    endDateDisplay() {
        return moment(this.endDate).format("MMM DD, YYYY");
    }

    pickerTodayDisplay() {
        return moment().format("YYYY-MM-DD");
    }

    onStartDateChange(event) {
        this.startDate = moment(event.target.value, "YYYY-MM-DD").toDate();
    }

    onEndDateChange(event) {
        this.endDate = moment(event.target.value, "YYYY-MM-DD").toDate();
    }

    onStartDateClick() {
        this.datePicker.show({
            date: this.startDate,
            mode: "date"
        }).then((date: Date) => {
            this.startDate = date;
        })
    }

    onEndDateClick() {
        this.datePicker.show({
            date: this.endDate,
            mode: "date"
        }).then((date: Date) => {
            this.endDate = date;
        });
    }

    close() {

        console.log("performanceType: ", this.performanceType, this.openedModal)
        console.log("PerformanceType:", this.prevCourseInfo, this.prevClubInfo, this.courseType)
        if (this.openedModal) {
            this.testAnalysis.needRefresh = false;
            if (this.performanceType == 'analysis' || this.performanceType == 'performance') {
                this.viewCtrl.dismiss({
                    courseInfo: this.prevCourseInfo,
                    clubInfo: this.prevClubInfo,
                    apply: false,
                    courseType: this.courseType
                });
            }

            else if (0)//(this.performanceType == 'performance')
                this.viewCtrl.dismiss({
                    // courseInfo: this.prevCourseInfo,
                    // clubInfo: this.prevClubInfo,
                    apply: false,
                    // courseType: this.courseType
                });

        }
        else {
            console.log("performancetype:pop")
            this.nav.pop();
        }

    }

    onApplyClick() {
        if (!this.searchCriteria.useNGames && this.searchCriteria.periodType == 'NONE') {
            let subTitle = "Please define Period Filter or use Last N Games";
            MessageDisplayUtil.displayErrorAlert(this.alertCtl, "", subTitle, "OK");

            return false;
        }
        this.searchCriteria.performanceHolesPlayed = Number(this.holesPlayed);
        if (this.performanceType == 'performance') {
            // this.events.publish("PerformanceFilter");
            console.log("PerformanceFilter");
            if (this.checkboxCourse) {

                if (!isPresent(this.courseInfo)) {
                    console.log("no course selected", this.courseInfo)
                    let subTitle = "Please select a course";
                    MessageDisplayUtil.displayErrorAlert(this.alertCtl, "", subTitle, "OK");

                    return false;

                }
                if (this.courseType == 'club') {
                    if (this.clubInfo.clubId == 0) {
                        console.log("no club selected", this.clubInfo)
                        let subTitle = "Please select a club";
                        MessageDisplayUtil.displayErrorAlert(this.alertCtl, "", subTitle, "OK");
                        return false;

                    }

                }
            } else {
              console.log("no checkbox course");
                this.courseInfo = createCourseInfo();
                this.clubInfo = createClubInfo();
                this.perfService.setCourseInfo(this.courseInfo);
                this.perfService.setPerformanceFilter(this.searchCriteria.performanceHolesPlayed, null);
            }

        }

        if (this.performanceType == 'analysis') {
            // this.events.publish("AnalysisFilter");
            console.log("AnalysisFilter Starts");
            console.log("Course Type : ", this.courseType)
            console.log("Club:", this.clubInfo);
            console.log("Course:", this.courseInfo);

            console.log("AnalysisFilter Ends")
            if (this.courseType == 'course') {
                if (!isPresent(this.courseInfo.courseId)) {
                    console.log("no course selected", this.courseInfo)
                    let subTitle = "Please select a course";
                    MessageDisplayUtil.displayErrorAlert(this.alertCtl, "", subTitle, "OK");
                    return false;

                }

            }
            if (this.courseType == 'club') {
                if (this.clubInfo.clubId == 0) {
                    console.log("no club selected", this.clubInfo)
                    let subTitle = "Please select a club";
                    MessageDisplayUtil.displayErrorAlert(this.alertCtl, "", subTitle, "OK");
                    return false;

                }

            }

        }

        console.log(this.startDate + "\n" + this.endDate);
        if (this.searchType == null) {
            this.searchType = 'Latest10';
        }
        if (this.isCordova()) {
            this.perfService.setFilterStartDate(this.startDate);
            this.perfService.setFilterEndDate(this.endDate);

        } else {
            console.log("Start date:", moment(this.isoStartDate).isValid());
            console.log("End date:", moment(this.isoEndDate).isValid());
            let parseStartDate = moment(this.isoStartDate, "YYYYMMDD").toDate();
            let parseEndDate = moment(this.isoEndDate, "YYYYMMDD").toDate();

            this.perfService.setFilterStartDate(parseStartDate);
            this.perfService.setFilterEndDate(parseEndDate);

        }
        // console.log("before send to service : " + this.courseId);
        // console.log("before:",this.searchCriteria.performanceHolesPlayed)
        console.log("checkboxCourse",this.checkboxCourse)
        if(this.checkboxCourse){
          console.log("course selection:courseInfo", this.courseInfo, this.clubInfo)
          this.perfService.setCourseInfo(this.courseInfo);
          this.perfService.setClubInfo(this.clubInfo);
          let clubCourseId = 0;
          if (this.courseType == 'course')
              clubCourseId = this.courseInfo.courseId
          else clubCourseId = this.clubInfo.clubId;

          this.perfService.setClubCourseId(clubCourseId);

          console.log("PerfFilter:", clubCourseId, "CourseType:", this.courseType)

          this.perfService.setCourseType(this.courseType);

          this.perfService.setPerformanceFilter(this.searchCriteria.performanceHolesPlayed);
        } else this.perfService.setClubCourseId(0)

        this.perfService.setSearch(this.searchCriteria, this.searchType, false);

        // console.log("after:",this.searchCriteria.performanceHolesPlayed)
        // console.log(this.performanceType);
        // console.log(this.courseInfo)
        if (this.openedModal) {
            // if (this.performanceType = "analysis") this.events.publish("ClubSelected:Name", this.clubName);
            this.testAnalysis.needRefresh = true;
            this.viewCtrl.dismiss({
                courseInfo: this.courseInfo,
                clubInfo: this.clubInfo,
                apply: true,
                courseType: this.courseType
            });
            console.log("openedModal|club name from clublist", this.courseInfo)

        }
        else this.nav.pop();
    }

    toggleNGames() {

        if (this.periodSelection == "last") this.searchCriteria.useNGames = true;
        else if (this.periodSelection == "period") this.searchCriteria.useNGames = false;
        if (this.searchCriteria.useNGames) {
            this.searchCriteria.periodType = "NONE";
            //this.searchCriteria.lastNGames
        }

    }

    goCoursePicklist() {
        console.log("Analysis Type:", this.analysisType)
        console.log("Check:before", this.checkboxCourse)
        if (this.checkboxCourse) {
            // this.nav.push(PerformanceClubListPage);
            /*, {
             courseId: this.courseId,
             courseName: this.courseName
             });*/
            console.log("Check:", this.checkboxCourse)
            let club = this.modalCtl.create(RecentClubListPage, {
                //analysisType: "analysis",
                courseInfo: this.courseInfo,
                openedModal: true,
                courseType: this.courseType,
                clubInfo: this.clubInfo

            });

            if (this.courseType == 'course') {
                club.onDidDismiss((data: any) => {
                    if (!data) {
                        return false;
                    }
                    if (data.apply) {
                        this.courseInfo = data.courseInfo;
                        this.clubInfo = data.clubInfo;
                        console.log("Type course:clubinfo", data.clubInfo)
                        // this.clubName = clubName;
                        // this.clubName = clubInfo.clubName;
                        this.courseId = this.courseInfo.courseId;
                        this.courseName = this.courseInfo.courseName;
                    }

                });

            } else if (this.courseType == 'club') {
                club.onDidDismiss((data: any) => {
                    if (data.clubInfo) {
                        this.clubInfo = data.clubInfo;
                        this.courseInfo = createCourseInfo();
                    }
                    // this.clubName = this.clubInfo.clubName;
                    console.log("Type club", this.courseType)
                    console.log("club infO?", this.clubInfo)
                });

            }
            club.present();
        }
        else {
            this.courseId = null;
            this.courseName = 'Please choose a course';
            console.log("Checkbox:", this.checkboxCourse)

        }

    }

    maxPeriodLength(): number {
        if (this.searchCriteria.periodType) {
            switch (this.searchCriteria.periodType) {
                case "MONTH":
                    return 60;
                case "DAY":
                    return 900;
                case "WEEK":
                    return 52;
                case "YEAR":
                    return 5;
            }
        }
        return 0;
    }

    maxNGames(): number {
        return 50;
    }

    onPeriodTypeChange(event) {
        if (this.searchCriteria.periodType) {
            let maxValue = this.maxPeriodLength();
            if (!this.searchCriteria.periodLength || this.searchCriteria.periodLength > maxValue) {
                switch (this.searchCriteria.periodType) {
                    case "MONTH":
                        this.searchCriteria.periodLength = 1;
                        break;
                    case "DAY":
                        this.searchCriteria.periodLength = 30;
                        break;
                    case "WEEK":
                        this.searchCriteria.periodLength = 4;
                        break;
                    case "YEAR":
                        this.searchCriteria.periodLength = 1;
                        break;
                    default:
                        this.searchCriteria.periodLength = 0;
                }
            }

        }
    }

    getClubName(): string {
        let clubName = 'Please select a club';
        console.log("getClubName()", this.clubInfo)
        if (!this.clubInfo.clubName) return clubName;
        else return this.clubInfo.clubName;
    }

    getCourseName(): string {
        let courseName = 'Please select a course';
        // console.log("getClubName()", this.clubInfo)
        if (!this.courseInfo.courseName) return courseName;
        else return this.courseInfo.courseName;
    }
///
    // courseSelection(event) {
    //     console.log("course selection:", event, this.checkboxCourse)
    //     if (!this.checkboxCourse) {
    //         this.clubInfo = createClubInfo();
    //         this.courseInfo = createCourseInfo();
    //         // this.perfService.setPerformanceFilter(this.searchCriteria.performanceHolesPlayed, 0);
    //     }
    // }
}
