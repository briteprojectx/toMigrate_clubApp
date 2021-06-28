import {
    ActionSheetController,
    AlertController,
    Events,
    LoadingController,
    ModalController,
    NavController,
    Platform,
    Slides
} from 'ionic-angular';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/of';
import {PerformanceFilters} from '../player-performance-filter/player-performance-filter';
import {PlayerPerformanceService} from '../../../providers/playerPerformance-service/playerPerformance-service';
import {
    createPerformanceBase,
    createPerformanceChart,
    createPerformanceDetail,
    PerformanceBase,
    PerformanceBaseScores,
    PerformanceChart,
    PerformanceDetail,
    PlayerPerformanceDetail,
    ScoreStatistic,
    testAnalysis
} from '../../../data/playerPerformance-data';
import {ScorecardService} from '../../../providers/scorecard-service/scorecard-service';
import {PlainScorecard} from '../../../data/scorecard';
import {ScorecardDisplayPage} from '../../scorecard-display/scorecard-display';
import {HoleAnalysisPage} from '../../hole-analysis/hole-analysis';
import {Component, Renderer, ViewChild} from '@angular/core';
// import {ClubInfo, CourseInfo, createClubInfo, createCourseInfo} from '../../../data/club-course';
import {SearchCriteria} from '../../../data/search-criteria';
import {isPresent} from 'ionic-angular/util/util';
import * as moment from 'moment';
import {adjustViewZIndex} from '../../../globals';
import {PlainScoreCard, ClubInfo, CourseInfo, createClubInfo, createCourseInfo} from '../../../data/mygolf.data';
/*
 Generated class for the PlayerPerformancePage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    templateUrl: 'player-charts.html',
    selector: 'player-charts-page'
})
export class PlayerChartsPage {

    public performanceBase: PerformanceBase;
    public performanceDetail: PerformanceDetail;
    public performanceChart: PerformanceChart;
    public scores: Array<PerformanceBaseScores>;
    public scorecard: PlainScoreCard;
    public searchType: string = "Latest10";
    public analysisType: string = "performance";

    public tabs: string = "info";
    @ViewChild('mySlider') slider: Slides;
    public sliderOptions: any;

    public slideNo: number = 0;

    public playerPerformance: any;

    public playerPieChartData: any;
    public courseInfo: CourseInfo;
    public searchCriteria: SearchCriteria;
    public startDate: string;
    public endDate: string;

    public courseType: string;

    public needRefresh: boolean = true;

    public testAnalysis: testAnalysis;

    public clubInfo: ClubInfo;

    constructor(public nav: NavController,
        private renderer: Renderer,
        private alertCtl: AlertController,
        private actionSheetCtl: ActionSheetController,
        private modalCtl: ModalController,
        private loadingCtl: LoadingController,
        private events: Events,
        private playerPerformanceService: PlayerPerformanceService,
        private scorecardService: ScorecardService,
        private platform: Platform) {
        // super();
        this.nav = nav;
        this.searchCriteria = this.playerPerformanceService.getSearch();
        console.log("Search Criteria:", this.searchCriteria)

        this.performanceBase = createPerformanceBase();
        this.performanceDetail = createPerformanceDetail();
        this.performanceChart = createPerformanceChart();
        this.scores = new Array<PerformanceBaseScores>();
        this.courseInfo = createCourseInfo();
        this.clubInfo = createClubInfo();

        this.courseType = 'course';
        this.playerPerformanceService.setCourseType(this.courseType);
        if (this.playerPerformanceService.getCourseInfo()) {
            this.courseInfo = this.playerPerformanceService.getCourseInfo();
        }
        console.log("Initial courseInfo:", this.courseInfo)
        this.searchType = "Latest10";
        this.testAnalysis = {
            needRefresh: this.needRefresh
        };
        //this.slides = Array<any>();
        this.sliderOptions = {
            initialSlide: 0,
            loop: false,
            pager: true,
            direction: "horizontal"
        };
        this.playerPerformance = {
            chartType: "bar",
            options: {
                scaleShowVerticalLines: false,
                responsive: true,
                title: {
                    display: true,
                    text: "Player Performance"
                },
                legend: {
                    display: false,
                    labels: {
                        padding: 5
                    }
                },
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                suggestedMin: 20
                            }
                        }
                    ]
                }
            },

            labels: [],
            data: []
        }
        this.playerPieChartData = {
            chartType: "pie",
            options: {
                scaleShowVerticalLines: false,
                responsive: true,
                title: {
                    display: true,
                    text: "Player Performance (%)"
                },
                legend: {
                    display: true
                },
                animation: {
                    onComplete: (chart) => {
                        this.onChartAnimation(chart);
                    }
                },
                tooltips: {
                    callbacks: {
                        label: (tooltipItem: any, data: any) => {
                            return "" +
                                data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
                                + "%";
                        }
                    }
                }
            },

            labels: [],
            data: []
        }
        if (!isPresent(this.playerPerformanceService.getDateTo())) {
            this.endDate = this.playerPerformanceService.getFilterEndDate();
            // this.isoEndDate = moment().toISOString();

        } else {
            this.endDate = moment(this.playerPerformanceService.getDateTo()).toISOString();
            // this.isoEndDate = moment(this.volStorage.getDateTo()).toISOString();

        }

        if (!isPresent(this.playerPerformanceService.getDateFrom())) {
            this.startDate = this.playerPerformanceService.getFilterStartDate();
            // this.isoStartDate = moment().add(-1, "months").toISOString();

        } else {
            this.startDate = moment(this.playerPerformanceService.getDateFrom()).toISOString();
            console.log("iso:", this.startDate)
            // this.isoStartDate = moment(this.volStorage.getDateFrom()).toISOString();
        }

        // this.startDate = this.playerPerformanceService.getFilterStartDate();
        // this.endDate = this.playerPerformanceService.getFilterEndDate();

    }

    onChartAnimation(chart: any) {
        console.log("Animation completed for ");
    }

    goToSlide(item: number) {
        // this.slider.slideTo(item, 500,true );
        this.slideNo = item;
    }

    ionViewDidLoad() {
        this.playerPerformanceService.forceUseNGames();
        this.playerPerformanceService.setPerformanceFilter(18, null);
        let courseInfo = createCourseInfo();
        this.playerPerformanceService.setCourseInfo(courseInfo)
        if (this.testAnalysis.needRefresh) this.onRefreshClick(null, true);
        console.log("Page Loaded", this.needRefresh, this.testAnalysis.needRefresh);
        this.tabs = "info";
        this.goToSlide(0);
        console.log("Page Enter", this.needRefresh, this.testAnalysis.needRefresh);

    }

    ionViewDidEnter() {
        adjustViewZIndex(this.nav, this.renderer);
        if (!this.testAnalysis.needRefresh) {
            // this.playerPerformanceService.setPerformanceFilter(this.searchCriteria.performanceHolesPlayed, 0);
            console.log("page enter", this.courseInfo, this.clubInfo)
            if (this.clubInfo.clubId == 0) {
                let clubInfo = createClubInfo();
                this.playerPerformanceService.setClubInfo(clubInfo);

            } else {
                this.playerPerformanceService.setClubInfo(this.clubInfo);
            }

            if (this.courseInfo.courseId == 0) {
                let courseInfo = createCourseInfo();
                this.playerPerformanceService.setCourseInfo(courseInfo);
            } else {
                this.playerPerformanceService.setCourseInfo(this.courseInfo);

            }
            if(this.courseType=='club'){
              this.playerPerformanceService.setClubCourseId(this.clubInfo.clubId);
            } else if(this.courseType=='course') {
              this.playerPerformanceService.setClubCourseId(this.courseInfo.courseId);
            } else this.playerPerformanceService.setClubCourseId(0);



            console.log("Page Enter:", this.playerPerformanceService.getCourseInfo());
        } else {
            this.courseType = this.playerPerformanceService.getCourseType();
        }
    }

    isAndroid() {
        return this.platform.is("android");
    }

    onScorecardClick(event, item: PlayerPerformanceDetail) {
        console.log(item.gameRoundId);
        let loader = this.loadingCtl.create({
            content: "Getting scorecard. Please wait..."
        });
        //this.nav.push(HoleAnalysisPage);
        loader.present().then(() => {
            this.scorecardService.getScorecard(item.gameRoundId)
                .subscribe((scorecard: PlainScoreCard) => {
                    this.scorecard = scorecard;
                    loader.dismiss().then(() => {
                        if (this.scorecard.message == "The courses selected for the game round do not have which nine information") {
                            this.alertCtl.create({
                                title: 'No Scorecard found',
                                subTitle: this.scorecard.message,
                                buttons: ['OK']
                            });
                        } else {
                            this.nav.push(ScorecardDisplayPage, {
                                scorecard: this.scorecard
                            });
                        }
                    })
                }, (error) => {
                    loader.dismiss();
                });
        })


    }

    goHomePage() {
        this.playerPerformanceService.forceUseNGames();
        this.nav.popToRoot();//this.nav.setRoot(PlayerHomePage);
    }

    checkStartDate(): boolean {
        // if (isPresent(this.startDate))
        //   return true;
        // else return false;
        return true;
    }

    checkEndDate(): boolean {
        // if (isPresent(this.endDate))
        //   return true;
        // else return false;
        return true;
    }

    goToHoleAnalysis() {
        this.playerPerformanceService.setPerformanceFilter(18, null);

        this.nav.push(HoleAnalysisPage, {
            fromPerformance: true,
            needRefresh: this.testAnalysis
        });
    }

    onMenuClick() {
        //
        console.log("menu click");
        let actionSheet = this.actionSheetCtl.create({

            buttons: [
                {
                    text: 'Hole Analysis',
                    role: 'destructive',
                    //icon: !this.platform.is('ios') ? 'trash' : null,
                    handler: () => {
                        actionSheet.dismiss()
                            .then(() => {
                                // this.needRefresh = true;
                                this.playerPerformanceService.setPerformanceFilter(18, null);
                                this.nav.push(HoleAnalysisPage, {
                                    fromPerformance: true,
                                    needRefresh: this.testAnalysis
                                });
                            });
                        return false
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel', // will always sort to be on the bottom
                    icon: !this.platform.is('ios') ? 'close' : null,
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });

        actionSheet.present();

    }

    public onPerformanceFilterClick() {
        // let modal = Modal.create(PerformanceFilters);
        // this.nav.present(modal);
        // this.events.publish("PerformanceAnalysis");

        /*this.nav.push(PerformanceFilters, {
         analysisType: "performance",
         openedModal: false
         });*/

        let filter = this.modalCtl.create(PerformanceFilters, {
            analysisType: "performance",
            courseInfo: this.courseInfo,
            openedModal: true,
            courseType: this.courseType,
            checkboxCourseClicked: false,
            needRefresh: this.testAnalysis,
            clubInfo: this.clubInfo

        });
        filter.onDidDismiss((data: any) => {

            //courseInfo: CourseInfo, apply: boolean, courseType?: string
            console.log("Data:", data)
            if (!data) return false;
            this.courseInfo = data.courseInfo;
            // this.courseName    = this.courseInfo.courseName;
            // this.courseHolePar = this.courseInfo.holes;
            this.courseType = data.courseType;
            this.clubInfo = data.clubInfo;
            // this.selectedClub  = data.clubInfo;

            console.log("club info", this.clubInfo)

            console.log("Dismiss:", this.courseInfo)
            this.searchCriteria = this.playerPerformanceService.getSearch();
            if (data.apply) {
                console.log("player<->filter apply yes")
                this.needRefresh = true;
                this.testAnalysis.needRefresh = true;
                // this.testAnalysis.needRefresh = true;
                this.courseInfo = data.courseInfo;
                this.playerPerformanceService.setCourseInfo(this.courseInfo);
                this.onRefreshClick(null, false);

                if (this.searchCriteria.periodType == 'CUSTOM') {
                    this.startDate = moment(this.playerPerformanceService.getFilterStartDate()).format("YYYY-MM-DD");
                    this.endDate = moment(this.playerPerformanceService.getFilterEndDate()).format("YYYY-MM-DD");

                }

            }
        });
        filter.present();
    }

    public onRefreshClick(refresher, first: boolean = false) {
        console.log("CourseInfo1:search", this.searchCriteria);
        console.log("CourseInfo1:first", first);
        console.log("CourseInfo1:needRefresh", this.testAnalysis.needRefresh);
        // if(!this.testAnalysis.needRefresh)
        this.searchCriteria = this.playerPerformanceService.getSearch();
        console.log("CourseInfo1:getCourse", this.playerPerformanceService.getCourseInfo())
        console.log("CourseInfo1:getSearch", this.playerPerformanceService.getSearch());

        if (this.playerPerformanceService.getClubInfo()) {
            this.clubInfo = this.playerPerformanceService.getClubInfo();

        }

        if (this.playerPerformanceService.getCourseInfo()) {
            console.log("refreshClick:getCourseInfo")
            this.courseInfo = this.playerPerformanceService.getCourseInfo();
            // console.log("refresh click:", this.courseInfo, this.clubInfo)
            // if(this.clubInfo.clubId == 0 && this.courseInfo.courseId == 0)
            // this.playerPerformanceService.setPerformanceFilter(this.searchCriteria.performanceHolesPlayed, 0);
            // else
            this.playerPerformanceService.setPerformanceFilter(this.searchCriteria.performanceHolesPlayed);

            // , this.courseInfo.courseId
        } else {
            console.log("refreshClick:noGetCourseInfo")
            this.courseInfo = null;
            this.playerPerformanceService.setPerformanceFilter(this.searchCriteria.performanceHolesPlayed, null);
        }

        console.log("refresh courseInfo:", this.courseInfo)
        console.log("courseInfo from service:", this.playerPerformanceService.getCourseInfo())

        this.refreshPerformanceBase(refresher, first);
    }

    private refreshPerformanceBase(refresher, first: boolean = false) {
        let loader = this.loadingCtl.create({
            content: "Getting information. Please wait..."
        });

        loader.present().then(() => {
            let performanceBase1: PerformanceBase;
            if (first) {
                this.playerPerformanceService.forceUseNGames();
                this.playerPerformanceService.setPerformanceFilter(18, null);
            }

            this.playerPerformanceService.getPerformanceBase()
                .subscribe((performanceBase: PerformanceBase) => {
                    this.playerPerformanceService.getPerformanceChart()
                        .subscribe((performanceChart: PerformanceChart) => {
                            this.playerPerformanceService.getPerformanceDetail()
                                .subscribe((performanceDetail: PerformanceDetail) => {
                                    // loader.dismiss(performanceDetail);

                                    loader.dismiss().then(() => {

                                        if (performanceBase) {
                                            this.performanceBase = performanceBase;

                                            /*if(!this.performanceBase.success) {
                                             let subTitle = "There is no data found";
                                             MessageDisplayUtil.displayErrorAlert(this.nav, "", subTitle, "OK");
                                             }*/
                                        }
                                        console.log("RefreshPerfBase:", first)

                                        // if (first) {
                                        //     this.playerPerformanceService.forceUseNGames();
                                        //     this.playerPerformanceService.setPerformanceFilter(18, null);
                                        // }
                                        if (performanceChart) {
                                            this.performanceChart = performanceChart;
                                            this.onPiechartDataChange();
                                        }
                                        console.log("RefreshPerfStatistics:", first)

                                        //load the details

                                        if (performanceDetail) {
                                            this.performanceDetail = performanceDetail;
                                        }
                                        this.onBarchartDataChange();
                                    });

                                    // loader.dismiss(performanceChart);

                                }, (error) => {
                                    loader.dismiss();
                                }, () => {

                                    console.log("complete dismiss:", performanceBase1)
                                    // loader.dismiss(performanceBase1);

                                    if (refresher)
                                        refresher.complete();
                                });
                        }, (error) => {
                            loader.dismiss();
                        });
                }, (error) => {
                    loader.dismiss();
                });
        });
    }

    dataArray() {

    }

    onPiechartDataChange() {
        // let data = new Array<SingleSeriesChartData>();

        let scoreStatistic: ScoreStatistic = this.performanceChart.scoreStatistic;
        // data.push({ label: "Eagle", value: scoreStatistic.eagle });
        // //    seriesColors:['#85802b', '#00749F', '#73C774', '#C7754C', '#17BDB8']
        // //, seriesColors: "#FFFFFF"
        // data.push({ label: "Birdie", value: scoreStatistic.birdie });
        // data.push({ label: "Par", value: scoreStatistic.par });
        // data.push({ label: "Bogey", value: scoreStatistic.bogey });
        // data.push({ label: "2x Bogey", value: scoreStatistic.bogey2 });
        // data.push({ label: "3x Bogey", value: scoreStatistic.bogey3 });
        if (this.performanceChart.success) {
            let pcntScore: {
                eagle: number;
                birdie: number;
                par: number;
                bogey: number;
                bogey2: number;
                bogey3: number;
            } = {
                    eagle: this._calculatePercentage(scoreStatistic.eagle),
                    birdie: this._calculatePercentage(scoreStatistic.birdie),
                    par: this._calculatePercentage(scoreStatistic.par),
                    bogey: this._calculatePercentage(scoreStatistic.bogey),
                    bogey2: this._calculatePercentage(scoreStatistic.bogey2),
                    bogey3: this._calculatePercentage(scoreStatistic.bogey3)

                }

            this.playerPieChartData.data = [
                pcntScore.eagle.toFixed(2),
                pcntScore.birdie.toFixed(2),
                pcntScore.par.toFixed(2),
                pcntScore.bogey.toFixed(2),
                pcntScore.bogey2.toFixed(2),
                pcntScore.bogey3.toFixed(2),
                /*  {value:pcntScore.eagle.toFixed(2), label:String(pcntScore.eagle.toFixed(2))+" %"},
                 {value:pcntScore.birdie.toFixed(2), label:String(pcntScore.birdie.toFixed(2))+" %"},
                 {value:pcntScore.par.toFixed(2), label:String(pcntScore.par.toFixed(2))+" %"},
                 {value:pcntScore.bogey.toFixed(2), label:String(pcntScore.bogey.toFixed(2))+" %"},
                 {value:pcntScore.bogey2.toFixed(2), label:String(pcntScore.bogey2.toFixed(2))+" %"},
                 {value:pcntScore.bogey3.toFixed(2), label:String(pcntScore.bogey3.toFixed(2))+" %"}
                 */
            ];

        } else {
            this.playerPieChartData.data = [
                scoreStatistic.eagle,
                scoreStatistic.birdie,
                scoreStatistic.par,
                scoreStatistic.bogey,
                scoreStatistic.bogey2,
                scoreStatistic.bogey3];
        }
        this.playerPieChartData.labels = ["Eagle", "Birdie", "Par", "Bogey", "Double Bogey", "Triple Bogey"];

    }

    _calculatePercentage(score: number) {
        let scoreStatistic: ScoreStatistic = this.performanceChart.scoreStatistic;
        let totalScores: number =
            scoreStatistic.eagle +
            scoreStatistic.birdie +
            scoreStatistic.par +
            scoreStatistic.bogey +
            scoreStatistic.bogey2 +
            scoreStatistic.bogey3;

        return (score / totalScores) * 100;
    }

    onBarchartDataChange() {
        let labels = [];
        let data = [];
        this.performanceBase.playerPerformances.forEach((p: PerformanceBaseScores, i: number) => {
            labels.push("" + (i + 1));

            data.push(p.score);

        });
        this.playerPerformance.data = data;
        this.playerPerformance.labels = labels;
        if (this.playerPerformanceService.getSearch().performanceHolesPlayed === 9)
            this.playerPerformance.options.scales.yAxes[0].ticks.suggestedMin = 25;
        else if (this.playerPerformanceService.getSearch().performanceHolesPlayed === 18)
            this.playerPerformance.options.scales.yAxes[0].ticks.suggestedMin = 50;
        else
            this.playerPerformance.options.scales.yAxes[0].ticks.suggestedMin = 90;
        // this.events.publish("onBarDataChange", scoreData);
        // this.events.publish("onAreaDataChange", scoreData);
        this.needRefresh = false;
        this.testAnalysis.needRefresh = false;

    }

    convFilterDate(filterDate) {
        return moment(filterDate).format("DD MMM YYYY")
    }

}
