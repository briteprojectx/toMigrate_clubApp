import {
    ActionSheetController,
    AlertController,
    Events,
    LoadingController,
    ModalController,
    NavController,
    NavParams,
    Platform,
    ToastController
} from 'ionic-angular';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/of';
import {isPresent} from 'ionic-angular/util/util';
import {Component, Renderer} from '@angular/core';
import {MessageDisplayUtil} from '../../message-display-utils';
import {AnalysisHole, createAnalysisHole, ScoreStatistic, analysisClubInfo, courseAnalysisInfo, courseAnalysisHoleInfo} from '../../data/playerAnalysis-data';
import {ClubMembership} from '../../data/player-data';
// import {ClubInfo, CourseHoleInfo, createClubInfo, createCourseInfo} from '../../data/club-course';
import {SearchCriteria} from '../../data/search-criteria';
import {testAnalysis} from '../../data/playerPerformance-data';
// import {PlainScorecard, ScorecardList} from '../../data/scorecard';
import {PlayerPerformanceService} from '../../providers/playerPerformance-service/playerPerformance-service';
import {PlayerService} from '../../providers/player-service/player-service';
import {ClubService} from '../../providers/club-service/club-service';
import {ScorecardService} from '../../providers/scorecard-service/scorecard-service';
import {PerformanceFilters} from '../performance/player-performance-filter/player-performance-filter';
import {RecentClubListPage} from '../performance/recent-club/recent-club';
import * as moment from 'moment';
import {adjustViewZIndex} from '../../globals';
import {PlainScoreCard, ScorecardList, CourseInfo, ClubInfo, CourseHoleInfo, createClubInfo, createCourseInfo} from '../../data/mygolf.data'
@Component({
    templateUrl: 'hole-analysis.html'
})
export class HoleAnalysisPage
{
    analysisHole: AnalysisHole;
    analysis: string;
    //actionSheet: ActionSheet;
    clubName: string;
    courseName: string;
    memberships: Array<ClubMembership>    = [];
    clubIds: Array<number>                = [];
    homeClubId: number;
    clubCourses: Array<CourseInfo>        = [];
    courseInfo: CourseInfo;
    courseHolePar: Array<CourseHoleInfo>  = [];
    scoreStatistic: Array<ScoreStatistic> = [];
    searchCriteria: SearchCriteria;
    startDate: string;
    endDate: string;
    fromPerformance: boolean;
    scorecardList: ScorecardList;
    courseType: string;
    clubInfo: ClubInfo;
    analysisHoleInfo: analysisClubInfo;
    needRefresh: boolean;
    testAnalysis: testAnalysis;
    selectedClub: ClubInfo;

    constructor(public platform: Platform,
        public nav: NavController,
        private renderer: Renderer,
        private navParams: NavParams,
        private modalCtl: ModalController,
        private toastCtl: ToastController,
        private alertCtl: AlertController,
        private loadingCtl: LoadingController,
        private actionSheetCtl: ActionSheetController,
        private events: Events,
        private playerService: PlayerService,
        private clubService: ClubService,
        private scorecardService: ScorecardService,
        private perfService: PlayerPerformanceService) {
        this.nav             = nav;
        this.navParams       = navParams;
        this.analysisHole    = createAnalysisHole();
        this.courseInfo      = createCourseInfo();
        this.analysis        = "course";
        this.searchCriteria  = perfService.getSearch();
        this.fromPerformance = navParams.get("fromPerformance");
        this.clubInfo        = createClubInfo();
        this.courseType      = 'club';
        this.perfService.setCourseType(this.courseType);
        this.testAnalysis = navParams.get("needRefresh");

        this.startDate = this.perfService.getFilterStartDate();
        this.endDate   = this.perfService.getFilterEndDate();

        if (!isPresent(this.startDate)) console.log("Start Date: Null");
        console.log(this.endDate)
        console.log("Hole Analysis:Page Loaded", this.needRefresh)

    }

    checkStartDate() {
        if (isPresent(this.startDate))
            return true;
        else return false;
    }

    checkEndDate() {
        if (isPresent(this.endDate))
            return true;
        else return false;
    }

    ionViewDidLoad() {
        this.getPlayerMembership();
        console.log("onPageLoaded:", this.clubInfo);
    }

    ionViewDidEnter() {
        adjustViewZIndex(this.nav, this.renderer);
    }

    getPlayerMembership() {
        let loader = this.loadingCtl.create({
            content: "Get memberships..."
        });

        // loader.present().then(() => {
            this.playerService.getPlayerMemberships()
                .subscribe((memberships: Array<ClubMembership>) => {
                    loader.dismiss().then(() => {
                        this.memberships = memberships;
                        this.clubIds     = [];
                        memberships.forEach((m: ClubMembership) => {
                            this.clubIds.push(m.club.clubId);
                        });

                        this.homeClubId = this.memberships.filter((membership: ClubMembership, idx: number) => {
                            return membership.homeClub
                        }).map((membership: ClubMembership) => {
                            return membership.club.clubId;
                        }).pop();
                        this.clubInfo   = this.memberships.filter((membership: ClubMembership, idx: number) => {
                            return membership.homeClub
                        }).map((membership: ClubMembership) => {
                            return membership.club;
                        }).pop();
                        if (isPresent(this.homeClubId)) {
                            this.clubName = this.memberships.filter((membership: ClubMembership, idx: number) => {
                                return membership.homeClub
                            }).map((membership: ClubMembership) => {
                                return membership.club.clubName;
                            }).pop();
                            // this.getHomeCourse(this.homeClubId)
                            // loader.present().then(() => {
                            this.clubService.getClubCourses(this.homeClubId)
                                .subscribe((courses: Array<CourseInfo>) => {
                                    this.clubCourses = courses;
                                    console.log(this.clubCourses[0].courseId)
                                    this.courseName    = this.clubCourses[0].courseName
                                    this.courseInfo    = this.clubCourses[0];
                                    this.courseHolePar = this.courseInfo.holes;
                                    // console.log(this.courseHolePar)
                                    // console.log(this.courseInfo.holes[0].holeNo)
                                    console.log("Get home course:", this.courseInfo);
                                    this.perfService.setCourseInfo(this.courseInfo);
                                    let clubCourseId = 0;
                                    if (this.courseType == 'course')
                                        clubCourseId = this.courseInfo.courseId
                                    else if (this.courseType == 'club') clubCourseId = this.homeClubId;
                                    console.log("home course:", this.courseType, clubCourseId)
                                    // loader.dismiss().then(() => {


                                        this.perfService.setPerformanceFilter(this.searchCriteria.performanceHolesPlayed, clubCourseId, this.courseType);
                                        this.refreshAnalysisHole();

                                    // });
                                }, (error) => {
                                    // loader.dismiss().then(() => {
                                        let msg = MessageDisplayUtil.getErrorMessage(error, "Error getting club courses");
                                        MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl, 5000, "bottom");
                                    // })
                                });
                            // });
                            console.log("home club:" + this.homeClubId)
                        }
                        else {
                            // loader.dismiss().then(()=>{
                                this._clearAndRefresh(null)

                            // })
                        }
                    });

                }, (error) => {
                    // loader.dismiss().then(() => {
                        let msg = MessageDisplayUtil.getErrorMessage(error, "Error getting player memberships");
                        MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl, 5000, "bottom");
                    // });

                });
        // });
    }
/*
    getPlayerMembership2() {
        let loader = this.loadingCtl.create({
            content: "Get memberships..."
        });
        loader.present().then(() => {
            this.playerService.getPlayerMemberships()
                .subscribe((memberships: Array<ClubMembership>) => {
                    loader.dismiss().then(() => {
                        this.memberships = memberships;
                        this.clubIds     = [];
                        memberships.forEach((m: ClubMembership) => {
                            this.clubIds.push(m.club.clubId);
                        });

                        this.homeClubId = this.memberships.filter((membership: ClubMembership, idx: number) => {
                            return membership.homeClub
                        }).map((membership: ClubMembership) => {
                            return membership.club.clubId;
                        }).pop();
                        this.clubInfo   = this.memberships.filter((membership: ClubMembership, idx: number) => {
                            return membership.homeClub
                        }).map((membership: ClubMembership) => {
                            return membership.club;
                        }).pop();
                        if (isPresent(this.homeClubId)) {
                            this.clubName = this.memberships.filter((membership: ClubMembership, idx: number) => {
                                return membership.homeClub
                            }).map((membership: ClubMembership) => {
                                return membership.club.clubName;
                            }).pop();
                            // this.getHomeCourse(this.homeClubId)
                            // loader.present().then(() => {
                                this.clubService.getClubCourses(this.homeClubId)
                                    .subscribe((courses: Array<CourseInfo>) => {
                                        this.clubCourses = courses;
                                        console.log(this.clubCourses[0].courseId)
                                        this.courseName    = this.clubCourses[0].courseName
                                        this.courseInfo    = this.clubCourses[0];
                                        this.courseHolePar = this.courseInfo.holes;
                                        // console.log(this.courseHolePar)
                                        // console.log(this.courseInfo.holes[0].holeNo)
                                        console.log("Get home course:", this.courseInfo);
                                        this.perfService.setCourseInfo(this.courseInfo);
                                        let clubCourseId = 0;
                                        if (this.courseType == 'course')
                                            clubCourseId = this.courseInfo.courseId
                                        else if (this.courseType == 'club') clubCourseId = this.homeClubId;
                                        console.log("home course:", this.courseType, clubCourseId)
                                        loader.dismiss().then(() => {


                                            this.perfService.setPerformanceFilter(this.searchCriteria.performanceHolesPlayed, clubCourseId, this.courseType);
                                            this.refreshAnalysisHole();

                                        });
                                    }, (error) => {
                                        loader.dismiss().then(() => {
                                            let msg = MessageDisplayUtil.getErrorMessage(error, "Error getting club courses");
                                            MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl, 5000, "bottom");
                                        })
                                    });
                            // });
                            console.log("home club:" + this.homeClubId)
                        }
                        else {
                            loader.dismiss().then(()=>{
                                this._clearAndRefresh(null)

                            })
                        }
                    });

                }, (error) => {
                    loader.dismiss().then(() => {
                        let msg = MessageDisplayUtil.getErrorMessage(error, "Error getting player memberships");
                        MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl, 5000, "bottom");
                    });

                });
        });
    }
*/
    getHomeCourse(homeClubId) { //
        let loader = this.loadingCtl.create({
            content: "Get courses..."
        });
        loader.present().then(() => {
            this.clubService.getClubCourses(homeClubId)
                .subscribe((courses: Array<CourseInfo>) => {
                    loader.dismiss().then(() => {
                        this.clubCourses = courses;
                        console.log(this.clubCourses[0].courseId)
                        this.courseName    = this.clubCourses[0].courseName
                        this.courseInfo    = this.clubCourses[0];
                        this.courseHolePar = this.courseInfo.holes;
                        // console.log(this.courseHolePar)
                        // console.log(this.courseInfo.holes[0].holeNo)
                        console.log("Get home course:", this.courseInfo);
                        this.perfService.setCourseInfo(this.courseInfo);
                        let clubCourseId = 0;
                        if (this.courseType == 'course')
                            clubCourseId = this.courseInfo.courseId
                        else if (this.courseType == 'club') clubCourseId = this.homeClubId;
                        console.log("home course:", this.courseType, clubCourseId)

                        this.perfService.setPerformanceFilter(this.searchCriteria.performanceHolesPlayed, clubCourseId, this.courseType);
                        this.refreshAnalysisHole();

                    });
                }, (error) => {
                    loader.dismiss().then(() => {
                        let msg = MessageDisplayUtil.getErrorMessage(error, "Error getting club courses");
                        MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl, 5000, "bottom");
                    })
                });
        });

    }

    onRefreshClick() {
        this.refreshAnalysisHole();
    }

    private refreshAnalysisHole() {

        console.log("hole:", this.courseType);
        
        this.scoreStatistic = [];
        this.analysisHoleInfo = null;
        // this.perfService.setPerformanceFilter(this.searchCriteria.performanceHolesPlayed, this.courseInfo.courseId);
        let loader = this.loadingCtl.create({
            content: "Getting information..."
        });
        loader.present().then(() => {
            this.perfService.getPlayerAnalysisHole(this.searchCriteria.performanceHolesPlayed)
                .subscribe((analysisHole: analysisClubInfo) => {
                    
                    loader.dismiss().then(() => {
                        if(analysisHole.courseAnalysisInfo && analysisHole.courseAnalysisInfo.length > 0) {
                            //this.analysisHole = analysisHole;
                            console.log("Hole Analysis Obj:1", analysisHole);
                            console.log("Hole analysis obj:preAnalysis", this.clubInfo);
                            this.analysisHoleInfo = analysisHole;
    
                            this.analysisHoleInfo.courseAnalysisInfo.sort((a,b)=>{
                                let _courseA = this.clubCourses.find((course)=>{
                                    return course.courseId === a.courseId
                                });
                                let _courseB = this.clubCourses.find((course)=>{
                                    return course.courseId === b.courseId
                                });
                                if(_courseA && _courseB) {
                                    if(_courseA.displayOrder < _courseB.displayOrder) return -1
                                    else if(_courseA.displayOrder > _courseB.displayOrder) return 1
                                    else return 0
                                } else return 0
                            })
    
                            if (analysisHole.clubId) {
                                this.clubInfo = analysisHole;
                                this.clubName = this.analysisHoleInfo.clubName;
                            }
    
                          this.analysisHoleInfo.courseAnalysisInfo.forEach((a: courseAnalysisInfo) => {
                            a.courseHoleAnalysisInfo.forEach((b: courseAnalysisHoleInfo) =>{
                              let averageScore = 0;
                            //   let albatrosScore = b.holePar - 3;
                            //   let eagleScore = b.holePar - 2;
                            //   let birdieScore = b.holePar - 1;
                            //   let parScore = b.holePar;
                            //   let bogeyScore = b.holePar + 1;
                            //   let bogey2Score = b.holePar + 2;
                            //   let bogey3Score = b.holePar + 3;
                            //   let worseScore = b.holePar + 4;
                              let totalGames = b.scoreStatistic['totalRound'];
                              let totalScore = b.scoreStatistic['totalScore'];
    
                              let albatros = b.scoreStatistic['albatros'];
                              let eagle = b.scoreStatistic['eagle'];
                              let birdie = b.scoreStatistic['birdie'];
                              let par = b.scoreStatistic['par'];
                              let bogey = b.scoreStatistic['bogey'];
                              let bogey2 = b.scoreStatistic['bogey2'];
                              let bogey3 = b.scoreStatistic['bogey3'];
                              let worse = b.scoreStatistic['worse'];
    
                              totalGames = albatros + eagle + birdie + par + bogey + bogey2 + bogey3 + worse;
    
                              // averageScore = (albatrosScore*albatros) + (eagleScore*eagle) + (birdieScore*birdie) + (parScore*par) + (bogeyScore*bogey)
                              // + (bogey2Score*bogey2) + (bogey3Score*bogey3) + (worseScore*worse);
                              // averageScore = averageScore / totalGames;
    
                              averageScore = totalScore / totalGames;
                              // b.average = Number(Math.round(averageScore * 100) / 100).toFixed(2);
                              b.average = Number((averageScore).toFixed(2));
                              console.log("Average for hole: ",b.holeNo);
                              console.log("Average Score: ",averageScore);
                                // averageScore = b.scoreStatistic.
    
    
                              console.log(b);
                            })
    
                            });
    
                            adjustViewZIndex(this.nav, this.renderer);
                            console.log("Hole Analysis Obj:2", this.analysisHoleInfo);
                            console.log("Hole Analysis Obj:3", this.clubInfo)
                            console.log("Hole analysis obj:4", this.clubName);
                            console.log("Refresh:", this.scoreStatistic)
                            console.log("Refresh:", this.analysisHoleInfo.clubName, "club name null", this.analysisHoleInfo.clubName == null ? "null" : "not")
                    }})
                }, (error) => {
                    loader.dismiss().then(() => {
                        let msg = MessageDisplayUtil.getErrorMessage(error, "Error getting hole analysis information");
                        MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl, 5000, "bottom");
                        adjustViewZIndex(this.nav, this.renderer);
                    });
                });
        });

    }

    isAndroid() {
        return this.platform.is("android");
    }

    onFilterClick() {
        // this.events.publish("HoleAnalysis");
        // this.nav.push(PerformanceFilters, {
        //     analysisType: "analysis"
        // });
        let filter = this.modalCtl.create(PerformanceFilters, {
            analysisType         : "analysis",
            courseInfo           : this.courseInfo,
            openedModal          : true,
            courseType           : this.courseType,
            clubInfo             : this.clubInfo,
            checkboxCourseClicked: false,
            needRefresh          : this.testAnalysis

        });
        filter.onDidDismiss((data: any) => {
          if(!data) return false;
            this.courseInfo    = data.courseInfo;
            this.courseName    = this.courseInfo.courseName;
            this.courseHolePar = this.courseInfo.holes;
            this.courseType    = data.courseType;
            this.clubInfo      = data.clubInfo;
            this.selectedClub  = data.clubInfo;

            console.log("club info", this.clubInfo)

            console.log("Dismiss:", this.courseInfo)
            this.searchCriteria = this.perfService.getSearch();
            //this.perfService.setPerformanceFilter(this.searchCriteria.performanceHolesPlayed, this.courseInfo.courseId);
            // console.log("CourseSelected:Id",this.searchCriteria.performanceHolesPlayed)
            if (data.apply) {
                this.testAnalysis.needRefresh = true;
                console.log("After filter apply")
                this.courseType = this.perfService.getCourseType();
                this.perfService.setCourseInfo(this.courseInfo);
                if (this.searchCriteria.periodType == 'CUSTOM') {
                    this.startDate = moment(this.perfService.getFilterStartDate()).format("YYYY-MM-DD");
                    this.endDate   = moment(this.perfService.getFilterEndDate()).format("YYYY-MM-DD");

                }
                if (isPresent(data)) {
                    this.clubService.getClubCourses(data.clubInfo.clubId)
                        .subscribe((courses: Array<CourseInfo>) => {
                            this.clubCourses = courses;
                            console.log(this.clubCourses[0].courseId)
                            this.courseName    = this.clubCourses[0].courseName
                            this.courseInfo    = this.clubCourses[0];
                            this.courseHolePar = this.courseInfo.holes;
                            // console.log(this.courseHolePar)
                            // console.log(this.courseInfo.holes[0].holeNo)
                            console.log("Get home course:", this.courseInfo);
                            // this.perfService.setCourseInfo(this.courseInfo);
                            let clubCourseId = 0;
                            if (this.courseType == 'course')
                                clubCourseId = this.courseInfo.courseId
                            else if (this.courseType == 'club') clubCourseId = this.homeClubId;
                            console.log("home course:", this.courseType, clubCourseId)
                            // loader.dismiss().then(() => {


                                // this.perfService.setPerformanceFilter(this.searchCriteria.performanceHolesPlayed, clubCourseId, this.courseType);
                                // this.refreshAnalysisHole();

                            // });
                        }, (error) => {
                            // loader.dismiss().then(() => {
                                let msg = MessageDisplayUtil.getErrorMessage(error, "Error getting club courses");
                                MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl, 5000, "bottom");
                            // })
                        });
                    // });
                    console.log("home club:" + this.homeClubId)
                }
                
                this.refreshAnalysisHole();
            }

        });
        filter.present();
    }

    goHomePage() {
        this.perfService.forceUseNGames();

        this.nav.popToRoot();//this.nav.setRoot(PlayerHomePage);
    }

    onMenuClick() {
        let actionSheet = this.actionSheetCtl.create({

            buttons: [
                {
                    text   : 'Performance Analysis',
                    role   : 'destructive',
                    //icon: !this.platform.is('ios') ? 'trash' : null,
                    handler: () => {
                        //this.nav.push(HoleAnalysisPage);
                        actionSheet.dismiss()
                                   .then(() => {
                                       // this.nav.setRoot(PlayerPerformancePage);
                                       // this.nav.push(PlayerPerformancePage);
                                       console.log('Hole Analysis clicked');
                                   });
                        return false;

                    }
                }, /*
                 {
                 text: 'Round 2',
                 role: 'destructive',
                 //icon: !this.platform.is('ios') ? 'trash' : null,
                 handler: () => {
                 console.log('Sign Out clicked');
                 }
                 },
                 {
                 text: 'Round 3',
                 role: 'destructive',
                 //icon: !this.platform.is('ios') ? 'trash' : null,
                 handler: () => {
                 console.log('Sign Out clicked');
                 }
                 },*/
                {
                    text   : 'Cancel',
                    role   : 'cancel', // will always sort to be on the bottom
                    icon   : !this.platform.is('ios') ? 'close' : null,
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });

        actionSheet.present();

    }

    goCoursePicklist() {
        let club = this.modalCtl.create(RecentClubListPage, {
            //analysisType: "analysis",
            courseInfo : this.courseInfo,
            openedModal: true,
            courseType : this.courseType,
            clubInfo   : this.clubInfo

        });
        club.onDidDismiss((data: any) => {
            this.courseInfo = data.courseInfo;
            if (data.clubInfo) {
                this.clubInfo     = data.clubInfo;
                this.clubName     = this.clubInfo.clubName;
                this.selectedClub = data.clubInfo;
            }
            //this.courseId = this.courseInfo.courseId;
            this.courseName     = this.courseInfo.courseName;
            this.searchCriteria = this.perfService.getSearch();
            this.courseHolePar  = this.courseInfo.holes;
            this.perfService.setCourseInfo(this.courseInfo);

            this.perfService.setPerformanceFilter(this.searchCriteria.performanceHolesPlayed, this.clubInfo.clubId);
            
            if (isPresent(data)) {
                this.clubService.getClubCourses(data.clubInfo.clubId)
                    .subscribe((courses: Array<CourseInfo>) => {
                        this.clubCourses = courses;
                        console.log(this.clubCourses[0].courseId)
                        this.courseName    = this.clubCourses[0].courseName
                        this.courseInfo    = this.clubCourses[0];
                        this.courseHolePar = this.courseInfo.holes;
                        // console.log(this.courseHolePar)
                        // console.log(this.courseInfo.holes[0].holeNo)
                        console.log("Get home course:", this.courseInfo);
                        // this.perfService.setCourseInfo(this.courseInfo);
                        let clubCourseId = 0;
                        if (this.courseType == 'course')
                            clubCourseId = this.courseInfo.courseId
                        else if (this.courseType == 'club') clubCourseId = this.homeClubId;
                        console.log("home course:", this.courseType, clubCourseId)
                    }, (error) => {
                        // loader.dismiss().then(() => {
                            let msg = MessageDisplayUtil.getErrorMessage(error, "Error getting club courses");
                            MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl, 5000, "bottom");
                        // })
                    });
                // });
                console.log("home club:" + this.homeClubId)
            }
            this.refreshAnalysisHole();

            //console.log("Dismiss:",this.courseInfo)
            //this.perfService.setPerformanceFilter(this.searchCriteria.performanceHolesPlayed, this.courseInfo.courseId);
            // console.log("CourseSelected:Id",this.searchCriteria.performanceHolesPlayed)
            //if(apply) this.refreshAnalysisHole();

        });
        club.present()
    }

    private _clearAndRefresh(refresher) {
        this._initItems();
        this._refreshScorecard(refresher, null);
    }

    private _initItems() {
        this.scorecardList = {
            success    : true,
            totalPages : 0,
            currentPage: 0,
            totalItems : 0,
            totalInPage: 0,
            scorecards : []
        };
        this.clubInfo      = createClubInfo();

    }

    private _refreshScorecard(refresher, infinite) {
        let loader = this.loadingCtl.create({
            dismissOnPageChange: false,
            showBackdrop       : false
        });

        loader.present().then(() => {
            this.scorecardService.searchScorecard("", this.scorecardList.currentPage + 1)
                .subscribe((data: ScorecardList) => {
                    loader.dismiss().then(() => {
                        this._populateScorecardList(data);
                    });
                }, (error) => {
                    loader.dismiss();
                }, () => {
                    if (refresher) refresher.complete();
                    if (infinite) {
                        infinite.complete();

                    }

                });

        });
    }

    private _populateScorecardList(data: ScorecardList) {
        if (data) {
            if (data.totalPages > 0)
                this.scorecardList.currentPage++;
            let clubId: number;
            this.scorecardList.totalItems  = data.totalItems;
            this.scorecardList.totalPages  = data.totalPages;
            this.scorecardList.totalInPage = data.totalInPage;
            this.scorecardList.scorecards.push(...data.scorecards);
            let scorecardInfo = this.scorecardList.scorecards.filter((scorecard: PlainScoreCard, idx: number) => {
                return scorecard.finished
            }).map((scorecard: PlainScoreCard) => {
                return scorecard
            });

            this.courseName    = scorecardInfo[0].courses[0].courseName;//this.scorecardList.scorecards.courses.courseName
            this.courseInfo    = scorecardInfo[0].courses[0];
            this.clubName      = scorecardInfo[0].clubName;//this.scorecardList.scorecards[0].clubName;
            this.courseHolePar = this.courseInfo.holes;
            clubId             = scorecardInfo[0].clubId;

            console.log("scorecard info", scorecardInfo);
            console.log("scorecard list:", this.scorecardList)
            // this.scorecardList.scorecards.forEach((s: PlainScoreCard) => {
            //     if (s.finished) {
            //       console.log("scorecard loop:",s)
            //         console.log(s.clubName)
            //         this.courseName = s.courses[0].courseName;//this.scorecardList.scorecards.courses.courseName
            //         this.courseInfo = s.courses[0];
            //         this.clubName = s.clubName;//this.scorecardList.scorecards[0].clubName;
            //         this.courseHolePar = this.courseInfo.holes;
            //         clubId = s.clubId
            //         return false;
            //     }
            // })

            // this.courseName = this.scorecardList.scorecards[0].courses[0].courseName
            // this.courseInfo = this.scorecardList.scorecards[0].courses[0]
            // this.courseHolePar = this.courseInfo.holes;
            // this.clubName = this.scorecardList.scorecards[0].clubName;
            console.log("scorecard:", this.scorecardList)
            console.log("scorecard:lastScorecard", this.scorecardList.scorecards[0])
            // this.perfService.setCourseInfo(this.courseInfo);
            // for (let i in this.scorecardList) {
            //   this.scorecardList.scorecards.
            // }
            // this.scorecardList.scorecards.forEach((s: PlainScoreCard)=> {
            //   if(!s.finished) console.log(s.clubName)
            // })
            this.perfService.setPerformanceFilter(this.searchCriteria.performanceHolesPlayed,
                clubId);

            this.refreshAnalysisHole();

        }
    }

    public convFilterDate(filterDate) {
        return moment(filterDate).format("DD MMM YYYY")
    }

    public checkAnalysisHole() {
        console.log("check analysis hole : ", this.analysisHoleInfo)
        if (this.analysisHoleInfo && this.analysisHoleInfo.clubName == null)
            return true
        else if(this.analysisHoleInfo && !this.analysisHoleInfo.courseAnalysisInfo) return true
        else if(this.analysisHoleInfo && this.analysisHoleInfo.courseAnalysisInfo.length === 0) return true
        else if (!this.analysisHoleInfo) return true
        else return false
    }

    getCourseHole(holeNo: number, s) {
        let _displayOrder = [];
        let _courseIdx;
        let _isZero;
        this.clubCourses.forEach((course)=>{
            if(course.displayOrder === 0) {
                _isZero = true;
            }
            if(_isZero) _displayOrder.push(course.displayOrder+1);
            else _displayOrder.push(course.displayOrder);
        })
        let _currentCourse = this.clubCourses.filter((course: CourseInfo, idx: number)=>{
            if(course.courseId === s.courseId) {
                _courseIdx = idx
                return true;
            }
        });
        if(_currentCourse && _currentCourse.length > 0) {
            let _order = _displayOrder[_courseIdx]-1;
            return holeNo + (9*_order)
        } else return holeNo;
    }

}
