import {
  Component,
  ViewChild,
  ElementRef,
  OnInit
} from "@angular/core";
import {
  Chart
} from "../../../../node_modules/chart.js";
// impo
// import {
//   ChartcrudService
// } from "../../../providers/booking-chart-service/chartcrud.service";
// import {
//   ChartdateService
// } from "../../../providers/booking-chart-service/chartdate.service";
import {
  ClubFlightService
} from "../../../providers/club-flight-service/club-flight-service";
import * as moment from 'moment';
import { BookingStatistics, CourseUtilizationStatistics, CaddieBuggyAssignmentStatistics, CourseUtilization, FutureBookingStatistics, CountryData, ClubData } from "../../../data/mygolf.data";
import { NavParams } from "ionic-angular";
import { NavController } from "ionic-angular";
import { BrowserPlatformLocation } from "@angular/platform-browser/src/browser/location/browser_platform_location";
import { SHARED_FORM_DIRECTIVES } from "@angular/forms/src/directives";
import { BookingHomePage } from "../booking-home/booking-home";
import { FaqPage } from "../../faq/faq";
import { ReferencedataService } from "../../../providers/referencedata-service/referencedata-service";
// import { ClubInfo } from "../../../data/club-course.js";
import { Country } from "../../../data/country-location.js";
import { ClubInfo } from "../../../data/mygolf.data";

@Component({
  selector: "booking-chart",
  templateUrl: "booking-chart.html",
  // styleUrls: ["booking-chart.scss"], 
})
export class BookingChartPage {
  // implements OnInit

  // @ViewChild("barCanvas", { static: true }) barCanvas: ElementRef;
  // @ViewChild("booking", { static: true }) doughnutCanvas: ElementRef;
  // @ViewChild("totalPax", { static: true }) totalPax: ElementRef;
  // @ViewChild("courses", { static: true }) courses: ElementRef;
  // @ViewChild("caddies", { static: true }) caddies: ElementRef;
  // @ViewChild("members", { static: true }) members: ElementRef;
  // @ViewChild("male", { static: true }) male: ElementRef;

  @ViewChild("barCanvas") barCanvas: ElementRef;
  @ViewChild("booking") doughnutCanvas: ElementRef;
  @ViewChild("totalPax") totalPax: ElementRef;
  @ViewChild("courses") courses: ElementRef;
  @ViewChild("caddies") caddies: ElementRef;
  @ViewChild("members") members: ElementRef;
  @ViewChild("male") male: ElementRef;

  public barChart: any;
  public bookingchart: any;
  public Pax: any;
  public coursesCharts: any;
  public caddiesChart: any;
  public membersChart: any;
  public maleChart: any;

  startDate: string;// = moment().format("YYYY-MM-DD");
  endDate: string;// = moment().format("YYYY-MM-DD");


  type: any = "line";
  lessThanOrGreaterThan = "lessThan";
  filterLimit = 100;
  thisweek: any = [];
  chartData = {
    dataSet1: Array.from({
        length: 8
      },
      () => Math.floor(Math.random() * 590) + 10
    ),
  };
  levelsArr = [
    "Jan",
    "Feb",
    "Mar",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  months = [{
      month: "Jan",
      value: "0"
    },
    {
      month: "Feb",
      value: "1"
    },
    {
      month: "Mar",
      value: "2"
    },
    {
      month: "Apr",
      value: "3"
    },
    {
      month: "May",
      value: "4"
    },
    {
      month: "Jun",
      value: "5"
    },
    {
      month: "Jul",
      value: "6"
    },
    {
      month: "Aug",
      value: "7"
    },
    {
      month: "Sep",
      value: "8"
    },
    {
      month: "Oct",
      value: "9"
    },
    {
      month: "Nov",
      value: "10"
    },
    {
      month: "Dec",
      value: "11"
    },
  ];

  from = "0";

  toMonth = "12";
  doughnutChart: any;
  activeClass: any = 'today';

  typeBooking: any = 'bar'; //pie
  slotFutureBooking: any = 'slots';

  revenueSlotFutureBooking: any = 'future';
  typeRevenue: any = 'bar';

  typePax: any = 'bar'; //pie
  typeCaddies: any = 'doughnut';
  typeCourse: any = 'doughnut';
  typeMembers: any = 'pie';
  typeMale: any = 'pie';

  date = new Date();
  clubId: number;

  bookingStats: BookingStatistics;
  bookingPlayers: BookingStatistics;
  bookingTodayStats: BookingStatistics;
  bookingTodayPlayers: BookingStatistics;
  revenueStats:BookingStatistics;
  revenuePlayers:BookingStatistics;
  memberStats:BookingStatistics;
  memberPlayers:BookingStatistics;
  genderStats:BookingStatistics;
  genderPlayers:BookingStatistics;
  courseUtilStats: CourseUtilizationStatistics;
  caddyBuggyStats: CaddieBuggyAssignmentStatistics;
  courseData: any = [{
      value: 30
    },
    {
      value: 170
    },
    {
      value: 200
    },
    {
      value: 400
    },
  ];

  
  verifyGenderToday: boolean;
  verifyGenderWeek: boolean;
  verifyGenderMonth: boolean;
  verifyGenderFuture: boolean;
  coursesUtil: Array<CourseUtilization>;
  courseLabels: Array<string>;

  currentDate: string;
  bookingFutureStats: FutureBookingStatistics;

  clubCurrency: CountryData;

  constructor(
    // public chartCrud: ChartcrudService,
    // public chartDate: ChartdateService,
    private flightService: ClubFlightService,
    private navParams: NavParams,
    private nav: NavController,
    private referenceData: ReferencedataService) {
    // this.chartDate.activeClass = 'today';
    
    this.clubId = navParams.get("clubId");
    this.verifyBookingToday = true;
    
    this.currentDate = moment().format("YYYY-MM-DD");
  }

  ionViewDidLoad() {
    // this._refreshValues(null, null);
    this.refreshAllStats('week');
    // this.ngOnInit();
  }

  ngOnInit() {
    // this.createtotalpaxChart(); //today's flight
    // this.bookingChart(); // total bookings
    // this.createChart(); //revenue
    // this.createCoursesChart(); //
    // this.createCaddiesChart();
    // this.createMembersChart(); //members vs non-members
    // this.createGenderChart();
    // this.maletodayData();
    // this.membertodayData();
    // this.caddiestodayData();
    // this.coursetodayData();
  }
  onHomeClick() {
    console.log("footer home click")
    this.nav.popToRoot();//this.nav.setRoot(PlayerHomePage);
}

// openProfile() {
//     this.nav.push(ProfilePage, {
//         type  : 'playerProfile',
//         player: this.player$
//     });
// }

  refreshAllStats(attribute?: string) {
    this.getClubCurrency();
    if(!attribute) attribute = 'today'
    this.refreshTodayStats();
    this.refreshBookingStats(attribute);
    this.refreshRevenueStats(attribute);
    // setTimeout(()=>{
      this.refreshMemberStats(attribute);
      this.refreshGenderStats(attribute);
      this.refreshCaddyBuggyUtilStats(attribute);
      this.refreshCourseUtilStats(attribute);
    // },1000)
    // this.refreshCourseUtilStats();
    // this.refreshCaddyBuggyUtilStats();
  }

  getDateRange(attribute?: string, type?:string) {

  }
  refreshTodayStats(date?: string) {
    // this.startDate, this.endDate
    this.flightService.getBookingStats(this.clubId, date,date)
    .subscribe((bookingStats: BookingStatistics)=>{
      console.log("booking stats", bookingStats)
      if(bookingStats) { 
        this.bookingTodayStats = bookingStats;
        this.createtotalpaxChart();
        this.flightService.getBookingStatsWithPlayerInfo(this.clubId,date,date)
        .subscribe((bookingStats: BookingStatistics)=>{
          console.log("booking stats with player info", bookingStats)
          if(bookingStats) {
            this.bookingTodayPlayers = bookingStats;
          }
        },(error) =>{
    
        })
      }
    },(error) =>{

    })
  }

  refreshBookingStats(attribute?:string) {
    let _fromDate;
    let _toDate;
    
    this.verifyBookingToday = false;
    this.verifyBookingWeek = false;
    this.verifyBookingMonth = false;
    this.verifyBookingFuture = false;
    let _setDate = false;

    switch(attribute) {
      case 'today':
        _fromDate = null;
        _toDate = null;
        this.verifyBookingToday = true;
        this.bookingName = 'Today\'s Bookings';
        _setDate = true;
        break;
      case 'week':
        // _fromDate = moment().startOf('week').format('YYYY-MM-DD');
        _fromDate = moment().subtract(1,'week').format('YYYY-MM-DD');
        // _toDate = moment().endOf('week').format('YYYY-MM-DD');
        _toDate = moment().format('YYYY-MM-DD');
        this.verifyBookingWeek = true;
        this.bookingName = 'Past Week\'s Bookings';
        _setDate = true;
        break;
      case 'month':
        // _fromDate = moment().startOf('month').format('YYYY-MM-DD');
        _fromDate = moment().subtract(1,'month').format('YYYY-MM-DD');
        _toDate = moment().format('YYYY-MM-DD');
        this.verifyBookingMonth = true;
        this.bookingName = 'Past Month\'s Bookings';
        _setDate = true;
        break;
      case 'future':
        _fromDate = moment().format('YYYY-MM-DD');
        _toDate = moment().add(3,'M').format('YYYY-MM-DD');
        this.verifyBookingFuture = true;
        this.bookingName = 'Future  Bookings'
        _setDate = true;
        break;

    }
    if(_setDate) {
      if(this.verifyBookingFuture) {
        this.flightService.getFutureStats(this.clubId)
        .subscribe((futureStats: FutureBookingStatistics)=>{
          console.log("booking stats with player info", futureStats)
          if(futureStats) {
            this.bookingFutureStats = futureStats;
          }
        },(error) =>{
    
        }, () =>{
          this.bookingChart();
        })
      } else {
        this.flightService.getBookingStats(this.clubId, _fromDate, _toDate)
      .subscribe((bookingStats: BookingStatistics)=>{
        console.log("booking stats", bookingStats)
        if(bookingStats) { 
          this.bookingStats = bookingStats;
          this.bookingChart();
          this.flightService.getBookingStatsWithPlayerInfo(this.clubId, _fromDate, _toDate)
          .subscribe((bookingStats: BookingStatistics)=>{
            console.log("booking stats with player info", bookingStats)
            if(bookingStats) {
              this.bookingPlayers = bookingStats;
            }
          },(error) =>{
      
          })
        }
      },(error) =>{
  
      })
      }
      
    }

    
  }

  refreshRevenueStats(attribute?:string) {
    let _fromDate;
    let _toDate;

    this.verifyRevenueToday = false;
    this.verifyRevenueWeek = false;
    this.verifyRevenueMonth = false;
    this.verifyRevenueFuture = false;

    switch(attribute) {
      case 'today':
        _fromDate = null;
        _toDate = null;
        this.verifyRevenueToday = true;
        this.revenueName = 'Today\'s Revenues'
        break;
      case 'week':
        // _fromDate = moment().startOf('week').format('YYYY-MM-DD');
        _fromDate = moment().subtract(1,'week').format('YYYY-MM-DD');
        // _toDate = moment().endOf('week').format('YYYY-MM-DD');
        _toDate = moment().format('YYYY-MM-DD');
        this.verifyRevenueWeek = true;
        this.revenueName = 'Past Week\'s Revenues';
        break;
      case 'month':
        // _fromDate = moment().startOf('month').format('YYYY-MM-DD');
        // _toDate = moment().endOf('month').format('YYYY-MM-DD');
        _fromDate = moment().subtract(1,'month').format('YYYY-MM-DD');
        _toDate = moment().format('YYYY-MM-DD');
        this.verifyRevenueMonth = true;
        this.revenueName = 'Past Month\'s Revenues';
        break;
      case 'future':
        _fromDate = moment().format('YYYY-MM-DD');
        _toDate = moment().add(3,'M').format('YYYY-MM-DD');
        this.verifyRevenueFuture = true;
        this.revenueName = 'Future Revenues'
        break;

    }

    this.flightService.getBookingStats(this.clubId, _fromDate, _toDate)
    .subscribe((bookingStats: BookingStatistics)=>{
      console.log("booking stats", bookingStats)
      if(bookingStats) { 
        this.revenueStats = bookingStats;
        this.createChart();
        this.flightService.getBookingStatsWithPlayerInfo(this.clubId, _fromDate, _toDate)
        .subscribe((bookingStats: BookingStatistics)=>{
          console.log("booking stats with player info", bookingStats)
          if(bookingStats) {
            this.revenuePlayers = bookingStats;
          }
        },(error) =>{
    
        })
      }
    },(error) =>{

    })
  }
  refreshMemberStats(attribute?:string) {
    let _fromDate;
    let _toDate;

    this.verifyMemberToday = false;
    this.verifyMemberWeek = false;
    this.verifyMemberMonth = false;
    this.verifyMemberFuture = false;

    switch(attribute) {
      case 'today':
        _fromDate = null;
        _toDate = null;
        this.verifyMemberToday = true;
        this.MemberName = 'Today\'s Bookings'
        break;
      case 'week':
        
        _fromDate = moment().subtract(1,'week').format('YYYY-MM-DD');
        // _toDate = moment().endOf('week').format('YYYY-MM-DD');
        _toDate = moment().format('YYYY-MM-DD');
        
        // _fromDate = moment().startOf('week').format('YYYY-MM-DD');
        // _toDate = moment().endOf('week').format('YYYY-MM-DD');
        this.verifyMemberWeek = true;
        this.MemberName = 'Past Week\'s Bookings';
        break;
      case 'month':
        // _fromDate = moment().startOf('month').format('YYYY-MM-DD');
        // _toDate = moment().endOf('month').format('YYYY-MM-DD');
        _fromDate = moment().subtract(1,'month').format('YYYY-MM-DD');
        _toDate = moment().format('YYYY-MM-DD');
        this.verifyMemberMonth = true;
        this.MemberName = 'Past Month\'s Bookings';
        break;
      case 'future':
        _fromDate = moment().format('YYYY-MM-DD');
        _toDate = moment().add(3,'M').format('YYYY-MM-DD');
        this.verifyMemberFuture = true;
        this.MemberName = 'Future Booking'
        break;
      default:
        _fromDate = null;
        _toDate = null;
        this.verifyMemberToday = true;
        this.MemberName = 'Today\'s Bookings'
        break;

    }

    this.flightService.getBookingStatsWithPlayerInfo(this.clubId, _fromDate, _toDate)
        .subscribe((bookingStats: BookingStatistics)=>{
          console.log("booking stats with player info", bookingStats)
          if(bookingStats) {
            this.memberPlayers = bookingStats;
          }
        },(error) =>{
    
        }, ()=>{
        this.createMembersChart();
        })

    // this.flightService.getBookingStats(this.clubId, _fromDate, _toDate)
    // .subscribe((bookingStats: BookingStatistics)=>{
    //   console.log("booking stats", bookingStats)
    //   if(bookingStats) { 
    //     this.memberStats = bookingStats;
        
    //   }
    // },(error) =>{

    // })
  }

  refreshGenderStats(attribute?:string) {
    let _fromDate;
    let _toDate;

    this.verifyGenderToday = false;
    this.verifyGenderWeek = false;
    this.verifyGenderMonth = false;
    this.verifyGenderFuture = false;
    let _setDate = false;

    switch(attribute) {
      case 'today':
        _fromDate = null;
        _toDate = null;
        this.verifyGenderToday = true;
        this.GenderName = 'Today\'s Bookings'
        _setDate = true;
        break;
      case 'week':
        // _fromDate = moment().startOf('week').format('YYYY-MM-DD');
        // _toDate = moment().endOf('week').format('YYYY-MM-DD');
        _fromDate = moment().subtract(1,'week').format('YYYY-MM-DD');
        // _toDate = moment().endOf('week').format('YYYY-MM-DD');
        _toDate = moment().format('YYYY-MM-DD');
        this.verifyGenderWeek = true;
        this.GenderName = 'Past Week\'s Bookings';
        _setDate = true;
        break;
      case 'month':
        // _fromDate = moment().startOf('month').format('YYYY-MM-DD');
        // _toDate = moment().endOf('month').format('YYYY-MM-DD');
        
        _fromDate = moment().subtract(1,'month').format('YYYY-MM-DD');
        _toDate = moment().format('YYYY-MM-DD');
        this.verifyGenderMonth = true;
        this.GenderName = 'Past Month\'s Bookings';
        _setDate = true;
        break;
      case 'future':
        _fromDate = moment().format('YYYY-MM-DD');
        _toDate = moment().add(3,'M').format('YYYY-MM-DD');
        this.verifyGenderFuture = true;
        this.GenderName = 'Future  Booking'
        _setDate = true;
        break;
        default:
        _fromDate = null;
        _toDate = null;
        this.verifyGenderToday = true;
        this.GenderName = 'Today\'s Bookings'
        _setDate = true;
        break;

    }


    this.flightService.getBookingStatsWithPlayerInfo(this.clubId, _fromDate, _toDate)
        .subscribe((bookingStats: BookingStatistics)=>{
          console.log("booking stats with player info", bookingStats)
          if(bookingStats) {
            this.genderPlayers = bookingStats;
          }
        },(error) =>{
    
        }, ()=>{
        this.createGenderChart();
        })
    // if(_setDate) {
    //       this.flightService.getBookingStats(this.clubId, _fromDate, _toDate)
    // .subscribe((bookingStats: BookingStatistics)=>{
    //   console.log("booking stats", bookingStats)
    //   if(bookingStats) { 
    //     this.genderStats = bookingStats;
        
    //   }
    // },(error) =>{

    // })
  // }
  }

  refreshCourseUtilStats(attribute?:string) {
    let _fromDate;
    let _toDate;

    this.verifyCoursesToday = false;
    this.verifyCoursesWeek = false;
    this.verifyCoursesMonth = false;
    this.verifyCoursesFuture = false;

    let _setDate = false;

    switch(attribute) {
      case 'today':
        _fromDate = null;
        _toDate = null;
        this.verifyCoursesToday = true;
        this.CourseName = 'Today\'s Bookings'
        _setDate = true;
        break;
      case 'week':
        // _fromDate = moment().startOf('week').format('YYYY-MM-DD');
        // _toDate = moment().endOf('week').format('YYYY-MM-DD');
        _fromDate = moment().subtract(1,'week').format('YYYY-MM-DD');
        _toDate = moment().format('YYYY-MM-DD');
        this.verifyCoursesWeek = true;
        this.CourseName = 'Past Week\'s Bookings';
        _setDate = true;
        break;
      case 'month':
        // _fromDate = moment().startOf('month').format('YYYY-MM-DD');
        // _toDate = moment().endOf('month').format('YYYY-MM-DD');
        _fromDate = moment().subtract(1,'month').format('YYYY-MM-DD');
        _toDate = moment().format('YYYY-MM-DD');
        this.verifyCoursesMonth = true;
        this.CourseName = 'Past Month\'s Bookings';
        _setDate = true;
        break;
      case 'future':
        _fromDate = moment().format('YYYY-MM-DD');
        _toDate = moment().add(3,'M').format('YYYY-MM-DD');
        this.verifyCoursesFuture = true;
        this.CourseName = 'Future  Booking'
        _setDate = true;
        break;
        default:
        _fromDate = null;
        _toDate = null;
        this.verifyCoursesToday = true;
        this.CourseName = 'Today\'s Bookings'
        _setDate = true;
        break;

    }

    // if(_setDate) {
      
    this.flightService.getCourseUtilStats(this.clubId, _fromDate, _toDate)
    .subscribe((courseUtilStats: CourseUtilizationStatistics)=>{
      if(courseUtilStats) {
        this.courseUtilStats = courseUtilStats;
      }
      console.log("course util stats ", courseUtilStats)
    },(error) =>{

    },()=>{
      this.createCoursesChart();
    });
    // }

  }

  refreshCaddyBuggyUtilStats(attribute?:string) {
    let _fromDate;
    let _toDate;

    this.verifyCaddiesToday = false;
    this.verifyCaddiesWeek = false;
    this.verifyCaddiesMonth = false;
    this.verifyCaddiesFuture = false;

    switch(attribute) {
      case 'today':
        _fromDate = null;
        _toDate = null;
        this.verifyCaddiesToday = true;
        this.CaddiesName = 'Today\'s Bookings'
        break;
      case 'week':
        // _fromDate = moment().startOf('week').format('YYYY-MM-DD');
        // _toDate = moment().endOf('week').format('YYYY-MM-DD');
        
        _fromDate = moment().subtract(1,'week').format('YYYY-MM-DD');
        _toDate = moment().format('YYYY-MM-DD');
        this.verifyCaddiesWeek = true;
        this.CaddiesName = 'Past Week\'s Bookings';
        break;
      case 'month':
        _fromDate = moment().subtract(1,'month').format('YYYY-MM-DD');
        _toDate = moment().format('YYYY-MM-DD');
        this.verifyCaddiesMonth = true;
        this.CaddiesName = 'Past Month\'s Bookings';
        break;
      case 'future':
        _fromDate = moment().format('YYYY-MM-DD');
        _toDate = moment().add(3,'M').format('YYYY-MM-DD');
        this.verifyCaddiesFuture = true;
        this.CaddiesName = 'Future  Booking'
        break;

    }

    this.flightService.getCaddyBuggyUtilStats(this.clubId, _fromDate, _toDate)
    .subscribe((caddyBuggyUtilStats: CaddieBuggyAssignmentStatistics)=>{
      console.log("caddy buggy util stats ", caddyBuggyUtilStats)
      if(caddyBuggyUtilStats) { 
        this.caddyBuggyStats = caddyBuggyUtilStats;
      }
    },(error) =>{

    },()=>{
      this.createCaddiesChart();
    });


    // this.flightService.getBookingStats(this.clubId, _fromDate, _toDate)
    // .subscribe((bookingStats: BookingStatistics)=>{
    //   console.log("booking stats", bookingStats)
    //   if(bookingStats) { 
    //     this.revenueStats = bookingStats;
    //     this.createChart();
    //     this.flightService.getBookingStatsWithPlayerInfo(this.clubId, _fromDate, _toDate)
    //     .subscribe((bookingStats: BookingStatistics)=>{
    //       console.log("booking stats with player info", bookingStats)
    //       if(bookingStats) {
    //         this.revenuePlayers = bookingStats;
    //       }
    //     },(error) =>{
    
    //     })
    //   }
    // },(error) =>{

    // })
  }

  // refreshCaddyBuggyUtilStats() {
  //   this.flightService.getCaddyBuggyUtilStats(this.clubId, this.startDate, this.endDate)
  //   .subscribe((caddyBuggyUtilStats: CaddieBuggyAssignmentStatistics)=>{
  //     console.log("caddy buggy util stats ", caddyBuggyUtilStats)
  //   },(error) =>{});
  // }
  createtotalpaxChart() {
    let yAxis = this.typePax == 'pie' || this.typePax == 'doughnut' ? false : true;
    let _todayStats = this.bookingTodayStats?this.bookingTodayStats.overallStatus:null;
    if(!_todayStats) return false;
    console.log("total pax", _todayStats.totalSlots, _todayStats.totalBooked, _todayStats.totalInPlay, _todayStats.totalFinished)
    this.Pax = new Chart(this.totalPax.nativeElement, {
      type: this.typePax,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: "Total Flights",
        },
        scales: {
          yAxes: [{
            display: yAxis,
            scaleLabel: {
              display: true,
            },
            ticks: {
              min: 0,
              stepSize: 50,
            },
          }, ],
        },
      },
      data: {
        labels: [
          "Total Slots",
          "Total Available",
          "Total Booked",
          "Total In-Play",
          "Total Finished",
        ],
        datasets: [{
          fill: true,
          // type: this.type,
          label: "Pax",
          data: [_todayStats.totalSlots,_todayStats.totalSlots - _todayStats.totalBooked, _todayStats.totalBooked, _todayStats.totalInPlay, _todayStats.totalFinished],
          // data: [300, 100, 40, 10],
          backgroundColor: [
            "rgba(153, 102, 255, 0.8)",
            "rgba(255, 206, 86, 0.8)",
            "rgba(255, 99, 132, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(75, 192, 192, 0.8)",
          ],
          spanGaps: false,
        }, ],
      },
    });
  }

  createGenderChart() {
    let genderChartData;
    let _genderPlayerStats = this.genderPlayers?this.genderPlayers:null;
    let _totalPlayers;
    let _slotsAvailable
    let _totalMale;
    let _totalFemale;
    let _morningBooked
    let _afternoonBooked
    if(_genderPlayerStats) {
      _totalPlayers = _genderPlayerStats.overallStatus.playerTypeDistribution.totalPlayers;
      // _slotsAvailable = _memberPlayerStats.overallStatus.totalSlots - _memberPlayerStats.overallStatus.totalBooked;
      _totalMale = _genderPlayerStats.overallStatus.playerTypeDistribution.totalMen;
      _totalFemale = _genderPlayerStats.overallStatus.playerTypeDistribution.totalWomen;
      genderChartData = [_totalMale,_totalFemale]
      this.genderData = [{
        value: _totalMale
      },
      {
        value: _totalFemale
      },
      {
        value: _totalPlayers
      },
    ];
    }

    let yAxis = this.typeMale == 'pie' || this.typeMale == 'doughnut' ? false : true;
    var chartText = this.verifyGenderToday ? 'Todays Male vs Female' : this.verifyGenderWeek ? 'Past Week Male vs Female' : this.verifyGenderMonth? 'Past Month Male vs Female' : ' Future Male vs Female';
    // var genderChartData = this.maleChartText == 'slots' ? [400, 100] : this.maleChartText == 'week' ? [340, 100] : this.maleChartText == 'month' ? [400, 400] : [200, 200];
    this.maleChart = new Chart(this.male.nativeElement, {
      type: this.typeMale,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        // aspectRatio: 2,
        title: {
          display: true,
          text: chartText,
        },
        scales: {
          yAxes: [{
            display: yAxis,
            scaleLabel: {
              display: true,
            },
            ticks: {
              min: 0,
              stepSize: 50,
            },
          }, ],
        },
      },
      data: {
        labels: ["Male", "Female"],
        datasets: [{
          fill: true,
          // type: this.type,
          label: "male vs female",
          data: genderChartData,
          backgroundColor: [
            "rgba(75, 192, 192, 0.8)",
            "rgba(255, 206, 86, 0.8)",
            "rgba(255, 99, 132, 0.8)",
            "rgba(153, 102, 255, 0.8)",
            "rgba(54, 162, 235, 0.8)",
          ],
          spanGaps: true,
        }, ],
      },
    });
  }


  createMembersChart() {
    let memberchartData;
    let _memberPlayerStats = this.memberPlayers?this.memberPlayers:null;
    let _totalPlayers;
    let _slotsAvailable
    let _totalMembers;
    let _totalNonMembers;
    let _morningBooked
    let _afternoonBooked
    if(_memberPlayerStats) {
      _totalPlayers = _memberPlayerStats.overallStatus.playerTypeDistribution.totalPlayers;
      // _slotsAvailable = _memberPlayerStats.overallStatus.totalSlots - _memberPlayerStats.overallStatus.totalBooked;
      _totalMembers = _memberPlayerStats.overallStatus.playerTypeDistribution.totalMembers;
      _totalNonMembers = _totalPlayers - _totalMembers;
      memberchartData = [_totalMembers,_totalNonMembers]
      this.membersData = [{
        value: _totalMembers
      },
      {
        value: _totalNonMembers
      },
      {
        value: _totalPlayers
      },
    ];
    }
    let yAxis = this.typeMembers == 'pie' || this.typeMembers == 'doughnut' ? false : true;
    var chartText = this.memberChartText == 'slots' ? 'Todays Member' : this.memberChartText == 'week' ? 'Past Week Members' : this.memberChartText == 'month' ? 'Past Month Members' : ' Future Members';
    // var memberchartData = this.memberChartText == 'slots' ? [200, 300] : this.memberChartText == 'week' ? [100, 100] : this.memberChartText == 'month' ? [340, 100] : [400, 400];
    this.membersChart = new Chart(this.members.nativeElement, {
      type: this.typeMembers,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        // aspectRatio: 2,
        title: {
          display: true,
          text: chartText,
        },
        scales: {
          yAxes: [{
            display: yAxis,
            scaleLabel: {
              display: true,
            },
            ticks: {
              min: 0,
              stepSize: 50,
            },
          }, ],
        },
      },
      data: {
        labels: ["Members", "Guests"],
        datasets: [{
          fill: true,
          // type: this.type,
          label: "Members vs Guests",
          data: memberchartData,
          backgroundColor: [
            "rgba(255, 99, 132, 0.8)",
            "rgba(75, 192, 192, 0.8)",
            "rgba(255, 206, 86, 0.8)",
            "rgba(153, 102, 255, 0.8)",
            "rgba(54, 162, 235, 0.8)",
          ],
          spanGaps: true,
        }, ],
      },
    });
  }

  createCaddiesChart() {
    let caddieschartData;
    let _caddyBuggyStats = this.caddyBuggyStats?this.caddyBuggyStats:null;
    let _totalBuggies;
    let _totalCaddies;
    let _totalMen;
    let _totalWomen;
    let _morningBooked
    let _afternoonBooked
    if(_caddyBuggyStats) {
      _totalBuggies = _caddyBuggyStats.totalBuggies;
      _totalCaddies = _caddyBuggyStats.totalCaddies;
      // _slotsAvailable = _memberPlayerStats.overallStatus.totalSlots - _memberPlayerStats.overallStatus.totalBooked;
      _totalMen = _caddyBuggyStats.totalMen;
      _totalWomen = _caddyBuggyStats.totalWomen;
      caddieschartData = [_totalMen,_totalWomen]
      this.caddiesData = [{
        value: _totalMen
      },
      {
        value: _totalWomen
      },
      {
        value: _totalBuggies
      },
      {
        value: _totalCaddies
      }
    ];
    }

    let yAxis = this.typeCaddies == 'pie' || this.typeCaddies == 'doughnut' ? false : true;
    var chartText = this.caddiesChartText == 'slots' ? 'Todays Caddies' : this.caddiesChartText == 'week' ? 'Past Week Caddies' : this.caddiesChartText == 'month' ? 'Past Month Caddies' : ' Future Caddies';
    // var caddieschartData = this.caddiesChartText == 'slots' ? [30, 170] : this.caddiesChartText == 'week' ? [300, 200] : this.caddiesChartText == 'month' ? [600, 100] : [300, 600];
    this.caddiesChart = new Chart(this.caddies.nativeElement, {
      type: this.typeCaddies,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        // aspectRatio: 2,
        title: {
          display: true,
          text: chartText,
        },
        scales: {
          yAxes: [{
            display: yAxis,
            scaleLabel: {
              display: true,
            },
            ticks: {
              min: 0,
              stepSize: 50,
            },
          }, ],
        },
      },
      data: {
        labels: ["Male", "Female"],
        datasets: [{
          fill: true,
          // type: this.type,
          label: "caddies & buggies",
          data: caddieschartData,
          backgroundColor: [
            "rgba(153, 102, 255, 0.8)",
            "rgba(255, 99, 132, 0.8)",
            "rgba(255, 206, 86, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(75, 192, 192, 0.8)",
          ],
          spanGaps: true,
        }, ],
      },
    });
  }
  createCoursesChart() {
    let coursechartData = [];
    this.courseLabels = [];
    this.courseData = [{value: 0}];
    let _courseStats = this.courseUtilStats?this.courseUtilStats:null;
    let _totalBuggies;
    let _totalCaddies;
    let _totalMen;
    let _totalWomen;
    let _morningBooked
    let _afternoonBooked
    if(_courseStats) {
      // _totalBuggies = _courseStats.totalBuggies;
      // _totalCaddies = _courseStats.totalCaddies;
      // _slotsAvailable = _memberPlayerStats.overallStatus.totalSlots - _memberPlayerStats.overallStatus.totalBooked;
      // _totalMen = _courseStats.totalMen;
      // _totalWomen = _courseStats.totalWomen;
      _courseStats.overallUtilization.forEach((course: CourseUtilization,idx: number)=>{
        coursechartData.push(course.totalBooked)
        this.courseData[idx] = {
          value: course.totalBooked
        }
        this.courseLabels.push(course.courseName)
      });
      // _courseStats.overallUtilization.reduce(()=> a.totalBooked + b.totalBooked)
      // caddieschartData = [_totalMen,_totalWomen]
      // _playerAmount = _playerCharges[0].billItems.reduce((a,b) => a += b.itemPrice, 0)
      
      this.courseData[this.courseData.length] = {
        value: _courseStats.overallUtilization.reduce((a,b)=> a += b.totalBooked, 0)
      }
    //   this.courseData = [{
    //     value: _totalMen
    //   },
    //   {
    //     value: _totalWomen
    //   },
    //   {
    //     value: _totalBuggies
    //   },
    // ];
    }

    let yAxis = this.typeCourse == 'pie' || this.typeCourse == 'doughnut' ? false : true;
    var chartText = this.courseChartText == 'slots' ? 'Todays Courses' : this.courseChartText == 'week' ? 'Past Week Courses' : this.courseChartText == 'month' ? 'Past Month Courses' : ' Future Courses';
    // var coursechartData = this.courseChartText == 'slots' ? [170, 30, 200] : this.courseChartText == 'week' ? [50, 200, 30] : this.courseChartText == 'month' ? [200, 300, 100] : [300, 100, 50];
    this.coursesCharts = new Chart(this.courses.nativeElement, {
      type: this.typeCourse,
      options: {
        legend: {
          display: true,
        },
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: chartText,
        },
        scales: {
          yAxes: [{
            display: yAxis,
            scaleLabel: {
              display: true,
            },
            ticks: {
              min: 0,
              stepSize: 50,
            },
          }, ],
        },
      },
      data: {
        labels: this.courseLabels,
        // ["East 1", "East 2", "West"],
        datasets: [{
          fill: true,
          // type: this.type,
          label: "course utilization",
          data: coursechartData,
          backgroundColor: [
            "rgb(126, 198, 34, 0.8)",
            "rgba(255, 99, 132, 0.8)",
            "rgba(54, 162, 235, 0.8)",
          ],
          spanGaps: true,
        }, ],
      },
    });
  }

  bookingChart() {
    let bookingchartData;
    let _bookingStats = this.bookingStats?this.bookingStats:null;
    let _totalSlots
    let _slotsAvailable
    let _totalBooked
    let _morningBooked
    let _afternoonBooked
    if(_bookingStats) {
      _totalSlots = _bookingStats.overallStatus.totalSlots;
      _slotsAvailable = _bookingStats.overallStatus.totalSlots - _bookingStats.overallStatus.totalBooked;
      _totalBooked = _bookingStats.overallStatus.totalBooked;
      _morningBooked = _bookingStats.morningStatus.totalBooked;
      _afternoonBooked = _bookingStats.afternoonStatus.totalBooked;
      bookingchartData = [_totalSlots,_slotsAvailable,_totalBooked,_morningBooked,_afternoonBooked]
      if(this.verifyBookingFuture) {
        this.bookingData = [{
          value: this.bookingFutureStats.overall.totalBookings
        },
        {
          value: this.bookingFutureStats.overall.totalBookings
        },
        {
          value: this.bookingFutureStats.overall.totalBookings
        },
        {
          value: this.bookingFutureStats.morning.totalBookings
        },
        {
          value: this.bookingFutureStats.afternoon.totalBookings
        },
      ];
      } else {
        this.bookingData = [{
          value: _totalSlots
        },
        {
          value: _slotsAvailable
        },
        {
          value: _totalBooked
        },
        {
          value: _morningBooked
        },
        {
          value: _afternoonBooked
        },
      ];
      }
      
    }
    
    let yAxis = this.typeBooking == 'pie' || this.typeBooking == 'doughnut' ? false : true;
    var chartText = this.verifyBookingToday ? 'Today\'s Booking' : this.verifyBookingWeek? 'Past Week Bookings' : this.verifyBookingMonth ? 'Past Month Bookings' : ' Future  Booking';
    // var bookingchartData = this.slotFutureBooking == 'slots' ? [100, 50, 50, 20, 30] : this.slotFutureBooking == 'week' ? [200, 100, 100, 60, 40] : this.slotFutureBooking == 'month' ? [300, 150, 150, 60, 90] : [400, 200, 200, 120, 80];
    var bookedslot = !this.verifyBookingFuture ? 'Total Booked Slots' : 'Total Future Bookings'
    this.bookingchart = new Chart(this.doughnutCanvas.nativeElement, {
      type: this.typeBooking,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: chartText,
        },
        scales: {
          yAxes: [{
            display: yAxis,
            scaleLabel: {
              display: true,
            },
            ticks: {
              min: 0,
              stepSize: 100,
            },
          }, ],
        },
      },
      data: {
        labels: ["Total Slots", "Slots Available", bookedslot, "Morning", "Afternoon"],
        datasets: [{
          fill: true,
          type: this.typeBooking,
          label: "Bookings",
          data: bookingchartData,
          backgroundColor: [
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 99, 132, 0.8)",
          ],
          spanGaps: true,
        }, ],
      },
    });
  }

  createChart() {
    let revenuechartData1
    //  = this.revenueSlotFutureBooking == 'slots' ? [.5, 2, 2] : this.revenueSlotFutureBooking == 'week' ? [1, 3.4, 4.6] : this.revenueSlotFutureBooking == 'month' ? [2.7, 5, 3.5] : [1.5, 2.5, 3.5];
    let revenuechartData2;
    let projectedData;
    //  = this.revenueSlotFutureBooking == 'slots' ? [1, 3.4, 4.6] : this.revenueSlotFutureBooking == 'week' ? [.5, 2, 2] : this.revenueSlotFutureBooking == 'month' ? [1.5, 2.5, 3.5] : [2.7, 5, 3.5];


    let bookingchartData;
    let _revenueStats = this.revenueStats?this.revenueStats:null;
    let _totalRevenue;
    let _totalProjectedRevenue;
    let _todayAMrev;
    let _todayPMrev;
    let _AMtotal;
    let _PMtotal;
    let _revMonAM;
    let _revMonPM;
    let _revTueAM;
    let _revTuePM;
    let _revWedAM;
    let _revWedPM;
    let _revThuAM;
    let _revThuPM;
    let _revFriAM;
    let _revFriPM;
    let _revSatAM;
    let _revSatPM;
    let _revSunAM;
    let _revSunPM;
    let _todayProj;
    let _projTotal;
    let _projMon;
    let _projTue;
    let _projWed;
    let _projThu;
    let _projFri;
    let _projSat;
    let _projSun;

    let _morningBooked
    let _afternoonBooked
    if(_revenueStats) {
      if(this.verifyRevenueFuture) {
        _totalRevenue = _revenueStats.overallStatus.amountPayable;
        _totalProjectedRevenue = _revenueStats.overallStatus.amountPayable;
        _todayAMrev = _revenueStats.morningStatus.amountPayable;
        _todayPMrev = _revenueStats.afternoonStatus.amountPayable;
        _AMtotal = _revenueStats.morningStatus.amountPayable;
        _PMtotal = _revenueStats.afternoonStatus.amountPayable;
        
        _revMonAM = _revenueStats.dayStatus['MONDAY'].morningStatus.amountPayable?_revenueStats.dayStatus['MONDAY'].morningStatus.amountPayable:null;
        _revMonPM = _revenueStats.dayStatus['MONDAY'].afternoonStatus.amountPayable?_revenueStats.dayStatus['MONDAY'].afternoonStatus.amountPayable:null;
        _revTueAM = _revenueStats.dayStatus['TUESDAY'].morningStatus.amountPayable?_revenueStats.dayStatus['TUESDAY'].morningStatus.amountPayable:null;
        _revTuePM = _revenueStats.dayStatus['TUESDAY'].afternoonStatus.amountPayable?_revenueStats.dayStatus['TUESDAY'].afternoonStatus.amountPayable:null;
        _revWedAM = _revenueStats.dayStatus['WEDNESDAY'].morningStatus.amountPayable?_revenueStats.dayStatus['WEDNESDAY'].morningStatus.amountPayable:null;
        _revWedPM = _revenueStats.dayStatus['WEDNESDAY'].afternoonStatus.amountPayable?_revenueStats.dayStatus['WEDNESDAY'].afternoonStatus.amountPayable:null;
        _revThuAM = _revenueStats.dayStatus['THURSDAY'].morningStatus.amountPayable?_revenueStats.dayStatus['THURSDAY'].morningStatus.amountPayable:null;
        _revThuPM = _revenueStats.dayStatus['THURSDAY'].afternoonStatus.amountPayable?_revenueStats.dayStatus['THURSDAY'].afternoonStatus.amountPayable:null;
        _revFriAM = _revenueStats.dayStatus['FRIDAY'].morningStatus.amountPayable?_revenueStats.dayStatus['FRIDAY'].morningStatus.amountPayable:null;
        _revFriPM = _revenueStats.dayStatus['FRIDAY'].afternoonStatus.amountPayable?_revenueStats.dayStatus['FRIDAY'].afternoonStatus.amountPayable:null;
        _revSatAM = _revenueStats.dayStatus['SATURDAY'].morningStatus.amountPayable?_revenueStats.dayStatus['SATURDAY'].morningStatus.amountPayable:null;
        _revSatPM = _revenueStats.dayStatus['SATURDAY'].afternoonStatus.amountPayable?_revenueStats.dayStatus['SATURDAY'].afternoonStatus.amountPayable:null;
        _revSunAM = _revenueStats.dayStatus['SUNDAY'].morningStatus.amountPayable?_revenueStats.dayStatus['SUNDAY'].morningStatus.amountPayable:null;
        _revSunPM = _revenueStats.dayStatus['SUNDAY'].afternoonStatus.amountPayable?_revenueStats.dayStatus['SUNDAY'].afternoonStatus.amountPayable:null;

        _todayProj = _revenueStats.morningStatus.amountPayable + _revenueStats.afternoonStatus.amountPayable / 2;
        _projTotal = _revenueStats.morningStatus.amountPayable + _revenueStats.afternoonStatus.amountPayable / 2;
        _projMon = _revenueStats.dayStatus['MONDAY'].overallStatus.amountPayable?(_revenueStats.dayStatus['MONDAY'].morningStatus.amountPayable+_revenueStats.dayStatus['MONDAY'].afternoonStatus.amountPayable)/2:null;
        _projTue = _revenueStats.dayStatus['TUESDAY'].overallStatus.amountPayable?(_revenueStats.dayStatus['TUESDAY'].morningStatus.amountPayable+_revenueStats.dayStatus['TUESDAY'].afternoonStatus.amountPayable)/2:null;
        _projWed = _revenueStats.dayStatus['WEDNESDAY'].overallStatus.amountPayable?(_revenueStats.dayStatus['WEDNESDAY'].morningStatus.amountPayable+_revenueStats.dayStatus['TUESDAY'].afternoonStatus.amountPayable)/2:null;
        _projThu = _revenueStats.dayStatus['THURSDAY'].overallStatus.amountPayable?(_revenueStats.dayStatus['THURSDAY'].morningStatus.amountPayable+_revenueStats.dayStatus['TUESDAY'].afternoonStatus.amountPayable)/2:null;
        _projFri = _revenueStats.dayStatus['FRIDAY'].overallStatus.amountPayable?(_revenueStats.dayStatus['FRIDAY'].morningStatus.amountPayable+_revenueStats.dayStatus['TUESDAY'].afternoonStatus.amountPayable)/2:null;
        _projSat = _revenueStats.dayStatus['SATURDAY'].overallStatus.amountPayable?(_revenueStats.dayStatus['SATURDAY'].morningStatus.amountPayable+_revenueStats.dayStatus['TUESDAY'].afternoonStatus.amountPayable)/2:null;
        _projSun = _revenueStats.dayStatus['SUNDAY'].overallStatus.amountPayable?(_revenueStats.dayStatus['SUNDAY'].morningStatus.amountPayable+_revenueStats.dayStatus['TUESDAY'].afternoonStatus.amountPayable)/2:null;


      } else {
        _totalRevenue = _revenueStats.overallStatus.amountPaid;
        _totalProjectedRevenue = _revenueStats.overallStatus.amountPayable;
        _todayAMrev = _revenueStats.morningStatus.amountPaid;
        _todayPMrev = _revenueStats.afternoonStatus.amountPaid;
        _AMtotal = _revenueStats.morningStatus.amountPaid;
        _PMtotal = _revenueStats.afternoonStatus.amountPaid;

        _revMonAM = _revenueStats.dayStatus['MONDAY'].morningStatus.amountPaid?_revenueStats.dayStatus['MONDAY'].morningStatus.amountPaid:null;
      _revMonPM = _revenueStats.dayStatus['MONDAY'].afternoonStatus.amountPaid?_revenueStats.dayStatus['MONDAY'].afternoonStatus.amountPaid:null;
      _revTueAM = _revenueStats.dayStatus['TUESDAY'].morningStatus.amountPaid?_revenueStats.dayStatus['TUESDAY'].morningStatus.amountPaid:null;
      _revTuePM = _revenueStats.dayStatus['TUESDAY'].afternoonStatus.amountPaid?_revenueStats.dayStatus['TUESDAY'].afternoonStatus.amountPaid:null;
      _revWedAM = _revenueStats.dayStatus['WEDNESDAY'].morningStatus.amountPaid?_revenueStats.dayStatus['WEDNESDAY'].morningStatus.amountPaid:null;
      _revWedPM = _revenueStats.dayStatus['WEDNESDAY'].afternoonStatus.amountPaid?_revenueStats.dayStatus['WEDNESDAY'].afternoonStatus.amountPaid:null;
      _revThuAM = _revenueStats.dayStatus['THURSDAY'].morningStatus.amountPaid?_revenueStats.dayStatus['THURSDAY'].morningStatus.amountPaid:null;
      _revThuPM = _revenueStats.dayStatus['THURSDAY'].afternoonStatus.amountPaid?_revenueStats.dayStatus['THURSDAY'].afternoonStatus.amountPaid:null;
      _revFriAM = _revenueStats.dayStatus['FRIDAY'].morningStatus.amountPaid?_revenueStats.dayStatus['FRIDAY'].morningStatus.amountPaid:null;
      _revFriPM = _revenueStats.dayStatus['FRIDAY'].afternoonStatus.amountPaid?_revenueStats.dayStatus['FRIDAY'].afternoonStatus.amountPaid:null;
      _revSatAM = _revenueStats.dayStatus['SATURDAY'].morningStatus.amountPaid?_revenueStats.dayStatus['SATURDAY'].morningStatus.amountPaid:null;
      _revSatPM = _revenueStats.dayStatus['SATURDAY'].afternoonStatus.amountPaid?_revenueStats.dayStatus['SATURDAY'].afternoonStatus.amountPaid:null;
      _revSunAM = _revenueStats.dayStatus['SUNDAY'].morningStatus.amountPaid?_revenueStats.dayStatus['SUNDAY'].morningStatus.amountPaid:null;
      _revSunPM = _revenueStats.dayStatus['SUNDAY'].afternoonStatus.amountPaid?_revenueStats.dayStatus['SUNDAY'].afternoonStatus.amountPaid:null;

      _todayProj = _revenueStats.morningStatus.amountPayable + _revenueStats.afternoonStatus.amountPayable / 2;
      _projTotal = _revenueStats.morningStatus.amountPayable + _revenueStats.afternoonStatus.amountPayable / 2;
      _projMon = _revenueStats.dayStatus['MONDAY'].overallStatus.amountPayable?(_revenueStats.dayStatus['MONDAY'].morningStatus.amountPayable+_revenueStats.dayStatus['MONDAY'].afternoonStatus.amountPayable)/2:null;
      _projTue = _revenueStats.dayStatus['TUESDAY'].overallStatus.amountPayable?(_revenueStats.dayStatus['TUESDAY'].morningStatus.amountPayable+_revenueStats.dayStatus['TUESDAY'].afternoonStatus.amountPayable)/2:null;
      _projWed = _revenueStats.dayStatus['WEDNESDAY'].overallStatus.amountPayable?(_revenueStats.dayStatus['WEDNESDAY'].morningStatus.amountPayable+_revenueStats.dayStatus['TUESDAY'].afternoonStatus.amountPayable)/2:null;
      _projThu = _revenueStats.dayStatus['THURSDAY'].overallStatus.amountPayable?(_revenueStats.dayStatus['THURSDAY'].morningStatus.amountPayable+_revenueStats.dayStatus['TUESDAY'].afternoonStatus.amountPayable)/2:null;
      _projFri = _revenueStats.dayStatus['FRIDAY'].overallStatus.amountPayable?(_revenueStats.dayStatus['FRIDAY'].morningStatus.amountPayable+_revenueStats.dayStatus['TUESDAY'].afternoonStatus.amountPayable)/2:null;
      _projSat = _revenueStats.dayStatus['SATURDAY'].overallStatus.amountPayable?(_revenueStats.dayStatus['SATURDAY'].morningStatus.amountPayable+_revenueStats.dayStatus['TUESDAY'].afternoonStatus.amountPayable)/2:null;
      _projSun = _revenueStats.dayStatus['SUNDAY'].overallStatus.amountPayable?(_revenueStats.dayStatus['SUNDAY'].morningStatus.amountPayable+_revenueStats.dayStatus['TUESDAY'].afternoonStatus.amountPayable)/2:null;


      }
      
      // _revMonAM = Number(_revMonAM).toFixed(2);
      // _revMonPM = Number(_revMonPM).toFixed(2);
      // _revTueAM = Number(_revTueAM).toFixed(2);
      // _revTuePM = Number(_revTuePM).toFixed(2);
      // _revWedAM = Number(_revWedAM).toFixed(2);
      // _revWedPM = Number(_revWedPM).toFixed(2);
      // _revThuAM = Number(_revThuAM).toFixed(2);
      // _revThuPM = Number(_revThuPM).toFixed(2);
      // _revFriAM = Number(_revFriAM).toFixed(2);
      // _revFriPM = Number(_revFriPM).toFixed(2);
      // _revSatAM = Number(_revSatAM).toFixed(2);
      // _revSatPM = Number(_revSatPM).toFixed(2);
      // _revSunAM = Number(_revSunAM).toFixed(2);
      // _revSunPM = Number(_revSunPM).toFixed(2);
      // _projTotal = Number(_projTotal).toFixed(2);
      // _projMon = Number(_projMon).toFixed(2);
      // _projTue = Number(_projTue).toFixed(2);
      // _projWed = Number(_projWed).toFixed(2);
      // _projThu = Number(_projThu).toFixed(2);
      // _projFri = Number(_projFri).toFixed(2);
      // _projSat = Number(_projSat).toFixed(2);
      // _projSun = Number(_projSun).toFixed(2);


      if(this.verifyRevenueToday) {
        revenuechartData1 = [_todayAMrev];
        revenuechartData2 = [_todayPMrev];
        projectedData = [_projTotal]
      } else if(this.verifyRevenueWeek) {
        revenuechartData1 = [_revMonAM,_revTueAM,_revWedAM,_revThuAM,_revFriAM,_revSatAM,_revSunAM]
        revenuechartData2 = [_revMonPM,_revTuePM,_revWedPM,_revThuPM,_revFriPM,_revSatPM,_revSunPM]
        projectedData = [_projMon,_projTue,_projWed,_projThu,_projFri,_projSat,_projSun]
      } else if(this.verifyRevenueMonth) {
        revenuechartData1 = [_revMonAM,_revTueAM,_revWedAM,_revThuAM,_revFriAM,_revSatAM,_revSunAM]
        revenuechartData2 = [_revMonPM,_revTuePM,_revWedPM,_revThuPM,_revFriPM,_revSatPM,_revSunPM]
        projectedData = [_projMon,_projTue,_projWed,_projThu,_projFri,_projSat,_projSun]
      } else if(this.verifyRevenueFuture) {
        revenuechartData1 = [_revMonAM,_revTueAM,_revWedAM,_revThuAM,_revFriAM,_revSatAM,_revSunAM]
        revenuechartData2 = [_revMonPM,_revTuePM,_revWedPM,_revThuPM,_revFriPM,_revSatPM,_revSunPM]
        projectedData = [_projMon,_projTue,_projWed,_projThu,_projFri,_projSat,_projSun]
      }
      // bookingchartData = [_totalSlots,_slotsAvailable,_totalBooked,_morningBooked,_afternoonBooked]
      this.revenueData = [{
        value: _totalRevenue
      },
      {
        value: _AMtotal
      },
      {
        value: _PMtotal
      },
      // {
      //   value: _totalProjectedRevenue
      // },
    ];
    }
    let _days;
    if(this.verifyRevenueToday) _days = ['Today'];
    else _days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

    let yAxis = this.typeRevenue == 'pie' || this.typeRevenue == 'doughnut' ? false : true;
    var chartText = this.verifyRevenueToday ? 'Todays Revenue' : this.verifyRevenueWeek ? 'Past Week Revenue' : this.verifyRevenueMonth ? 'Past Month Revenue' : ' Future Revenue';
    // var revenuechartData1 = this.revenueSlotFutureBooking == 'slots' ? [.5, 2, 2] : this.revenueSlotFutureBooking == 'week' ? [1, 3.4, 4.6] : this.revenueSlotFutureBooking == 'month' ? [2.7, 5, 3.5] : [1.5, 2.5, 3.5];
    // var revenuechartData2 = this.revenueSlotFutureBooking == 'slots' ? [1, 3.4, 4.6] : this.revenueSlotFutureBooking == 'week' ? [.5, 2, 2] : this.revenueSlotFutureBooking == 'month' ? [1.5, 2.5, 3.5] : [2.7, 5, 3.5];

    var bookedslot = this.verifyRevenueFuture ? 'Future Revenues':'Total Revenues' 
    //  var chartData = {
    //     dataSet1: Array.from(
    //       { length: 12},
    //       () => this.revenueSlotFutureBooking == 'slots'? Math.floor(Math.random() * 590) + 20 :  this.revenueSlotFutureBooking == 'future'? Math.floor(Math.random() * 490) + 80: Math.floor(Math.random() * 590) + 20
    //     ),
    //   };
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: this.typeRevenue,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: chartText,
        },
        scales: {
          yAxes: [{
            display: yAxis,
            scaleLabel: {
              display: true,
            },
            ticks: {
              min: 0,
              stepSize: .5,
            },
          }, ],
        },
      },
      data: {
        labels: _days,
        // [
        //   'Monday', 'Tuesday', 'Wednesday'
        // ],
        datasets: [{
            showLine: true,
            fill: true,
            // type: this.type,
            label: "AM",
            // data: chartData.dataSet1,
            data: revenuechartData1,
            backgroundColor: [
              "rgb(126, 198, 34, 0.9)",
              "rgb(126, 198, 34, 0.9)",
              "rgb(126, 198, 34, 0.9)",
              
              "rgb(126, 198, 34, 0.9)",
              "rgb(126, 198, 34, 0.9)",
              "rgb(126, 198, 34, 0.9)",
              
              "rgb(126, 198, 34, 0.9)",
              "rgb(126, 198, 34, 0.9)",
              "rgb(126, 198, 34, 0.9)",

              // "rgba(255, 206, 86, 0.8)",
              // "rgba(255, 99, 132, 0.3)",
              // "rgba(153, 102, 255, 0.7)",
              // "rgba(54, 162, 235, 0.5)",
              // "rgba(75, 192, 192, 0.6)",
              // "rgba(153, 102, 255, 0.9)",
              // "rgba(255, 159, 64, 0.3)",
              // "rgba(153, 102, 255, 0.7)",
              // "rgba(54, 162, 235, 0.5)",
              // "rgba(75, 192, 192, 0.6)",
              // "rgba(255, 159, 64, 0.3)",
            ],
            spanGaps: true,
          },
          {

            showLine: true,
            fill: true,
            // type: this.type,
            label: "PM",
            // data: chartData.dataSet1,
            data: revenuechartData2,
            backgroundColor: [
              "rgb(126, 198, 34, 0.6)",
              "rgb(126, 198, 34, 0.6)",
              "rgb(126, 198, 34, 0.6)",
              
              "rgb(126, 198, 34, 0.6)",
              "rgb(126, 198, 34, 0.6)",
              "rgb(126, 198, 34, 0.6)",
              
              "rgb(126, 198, 34, 0.6)",
              "rgb(126, 198, 34, 0.6)",
              "rgb(126, 198, 34, 0.6)",
              // "rgba(255, 206, 86, 0.8)",
              // "rgba(255, 99, 132, 0.3)",
              // "rgba(153, 102, 255, 0.7)",
              // "rgba(54, 162, 235, 0.5)",
              // "rgba(75, 192, 192, 0.6)",
              // "rgba(153, 102, 255, 0.9)",
              // "rgba(255, 159, 64, 0.3)",
              // "rgba(153, 102, 255, 0.7)",
              // "rgba(54, 162, 235, 0.5)",
              // "rgba(75, 192, 192, 0.6)",
              // "rgba(255, 159, 64, 0.3)",
            ],
            lineTension: 0.1,
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            spanGaps: true,
          },
          // {
          //   showLine: true,
          //   fill: false,
          //   // type: this.type,
          //   label: "Avg. Proj.",
          //   // data: chartData.dataSet1,
          //   data: projectedData,
          //   type: 'line',
          //   borderColor: [

          //     "rgba(226, 106, 106, 1)",
          //     "rgba(226, 106, 106, 1)",
          //     "rgba(226, 106, 106, 1)",
          //     "rgba(226, 106, 106, 1)",
          //     "rgba(226, 106, 106, 1)",
          //     "rgba(226, 106, 106, 1)",
          //     "rgba(226, 106, 106, 1)",
          //   ],
          //   backgroundColor: [
          //     "rgba(226, 106, 106, 1)",
          //     "rgba(226, 106, 106, 1)",
          //     "rgba(226, 106, 106, 1)",
          //     "rgba(226, 106, 106, 1)",
          //     "rgba(226, 106, 106, 1)",
          //     "rgba(226, 106, 106, 1)",
          //     "rgba(226, 106, 106, 1)",
          //   ],
          //   spanGaps: true,
          // },
        ],
      },
    });
  }

  // chart type Functions
  selectRevenueBookingSlotFuture() {
    this.barChart.destroy();
    this.createChart();
  }

  selectTypeRevenue() {
    this.barChart.destroy();
    this.createChart();
  }


  selectTypeBooking() {
    this.bookingchart.destroy();
    this.bookingChart();
  }

  selectTypeCaddies() {
    this.caddiesChart.destroy();
    this.createCaddiesChart();
  }

  selectTypeMembers() {
    this.membersChart.destroy();
    this.createMembersChart();
  }

  selectTypeMale() {
    this.maleChart.destroy();
    this.createGenderChart();
  }

  selectTypePax() {
    this.Pax.destroy();
    this.createtotalpaxChart();
  }

  selectTypeCourse() {
    this.coursesCharts.destroy();
    this.createCoursesChart();
  }

  // globally changes Type of chart
  select(value) {
    this.typeBooking = value;
    this.typeCaddies = value;
    this.typeCourse = value;
    this.typePax = value;
    // this.typeRevenue = value;
    this.typeMembers = value;
    this.typeMale = value;
    this.barChart.destroy();
    // this.createChart();
    this.Pax.destroy();
    this.createtotalpaxChart();
    this.bookingchart.destroy();
    this.bookingChart();
    this.coursesCharts.destroy();
    this.createCoursesChart();
    this.caddiesChart.destroy();
    this.createCaddiesChart();
    this.membersChart.destroy();
    this.createMembersChart();
    this.maleChart.destroy();
    this.createGenderChart();
  }

  //booking
  verifyBookingToday: boolean = true;
  verifyBookingWeek: boolean = false;
  verifyBookingMonth: boolean = false;
  verifyBookingFuture: boolean = false;
  bookingName: string = 'Todays Booking';
  bookingData: any = [{
      value: 100
    },
    {
      value: 100
    },
    {
      value: 50
    },
    {
      value: 20
    },
    {
      value: 30
    },
  ]
  bookingtodayData(value) {
    this.verifyBookingToday = true;
    this.verifyBookingWeek = false;
    this.verifyBookingMonth = false;
    this.verifyBookingFuture = false;
    this.bookingName = 'Todays Booking'
    this.bookingData = [{
        value: 100
      },
      {
        value: 50
      },
      {
        value: 50
      },
      {
        value: 20
      },
      {
        value: 30
      },
    ];
    this.slotFutureBooking = 'slots'
    this.bookingchart.destroy();
    this.bookingChart();
  }

  bookingthisWeekData(value) {
    this.verifyBookingToday = false;
    this.verifyBookingWeek = true;
    this.verifyBookingMonth = false;
    this.verifyBookingFuture = false;
    this.bookingName = 'Past Week Bookings'
    this.bookingData = [{
        value: 200
      },
      {
        value: 100
      },
      {
        value: 100
      },
      {
        value: 60
      },
      {
        value: 40
      },
    ];
    this.slotFutureBooking = 'week'
    this.bookingchart.destroy();
    this.bookingChart();
  }

  bookingthisMonthData(value) {
    this.verifyBookingToday = false;
    this.verifyBookingWeek = false;
    this.verifyBookingMonth = true;
    this.verifyBookingFuture = false;
    this.bookingName = 'Past Month Bookings'
    this.bookingData = [{
        value: 300
      },
      {
        value: 150
      },
      {
        value: 150
      },
      {
        value: 60
      },
      {
        value: 90
      },
    ];
    this.slotFutureBooking = 'month'
    this.bookingchart.destroy();
    this.bookingChart();
  }

  bookingfutureData(value) {
    this.verifyBookingToday = false;
    this.verifyBookingWeek = false;
    this.verifyBookingMonth = false;
    this.verifyBookingFuture = true;
    this.bookingName = 'Future  Booking'
    this.bookingData = [{
        value: 400
      },
      {
        value: 200
      },
      {
        value: 200
      },
      {
        value: 120
      },
      {
        value: 80
      },
    ];
    this.slotFutureBooking = 'future'
    this.bookingchart.destroy();
    this.bookingChart();
  }

  //revenue
  verifyRevenueToday: boolean = true;
  verifyRevenueWeek: boolean = false;
  verifyRevenueMonth: boolean = false;
  verifyRevenueFuture: boolean = false;
  revenueData: any = [];
  //  = [{
  //     value: 123456
  //   },
  //   {
  //     value: 90000
  //   },
  //   {
  //     value: 33456
  //   },
  //   {
  //     value: 1234567
  //   },
  // ];
  // verifyRevenueToday: boolean = true;
  verifyRevenue: boolean = false;
  revenueName: any = 'Todays Revenue';
  revenuetodayData(value) {
    this.verifyRevenueToday = true;
    this.verifyRevenueWeek = false;
    this.verifyRevenueMonth = false;
    this.verifyRevenueFuture = false;
    // this.chartDate.activeClass = 'revenuetoday';
    this.revenueName = 'Todays Revenue';
    this.revenueData = [];
    //  [{
    //     value: 123456
    //   },
    //   {
    //     value: 90000
    //   },
    //   {
    //     value: 33456
    //   },
    //   {
    //     value: 1234567
    //   },
    // ];
    this.revenueSlotFutureBooking = 'slots';
    this.barChart.destroy();
    this.createChart();
  }

  revenuethisWeekData(value) {
    this.verifyRevenueToday = false;
    this.verifyRevenueWeek = true;
    this.verifyRevenueMonth = false;
    this.verifyRevenueFuture = false;
    // this.chartDate.activeClass = 'revenueweek';
    this.revenueName = 'Past Week Revenue';
    this.revenueData = [] ;
    // [{
    //     vale: 456345
    //   },
    //   {
    //     value: 5000
    //   },
    //   {
    //     value: 356
    //   },
    //   {
    //     value: 567566
    //   },
    // ];
    this.revenueSlotFutureBooking = 'week';
    this.barChart.destroy();
    this.createChart();
  }

  revenuethisMonthData(value) {
    this.verifyRevenueToday = false;
    this.verifyRevenueWeek = false;
    this.verifyRevenueMonth = true;
    this.verifyRevenueFuture = false;
    // this.chartDate.activeClass = 'revenuemonth';
    this.revenueName = 'Past Month Revenue';
    this.revenueData = []; 
    //  [{
    //     value: 13456
    //   },
    //   {
    //     value: 6000
    //   },
    //   {
    //     value: 336
    //   },
    //   {
    //     value: 4567666
    //   },
    // ];
    this.revenueSlotFutureBooking = 'month';
    this.barChart.destroy();
    this.createChart();
  }

  revenuefutureData() {
    this.verifyRevenueToday = false;
    this.verifyRevenueWeek = false;
    this.verifyRevenueMonth = false;
    this.verifyRevenueFuture = true;
    // this.chartDate.activeClass = 'revenuefuture';
    this.revenueName = 'Future Revenue';
    this.revenueData = [];
    //  [{
    //     value: 15657
    //   },
    //   {
    //     value: 6733
    //   },
    //   {
    //     value: 3547
    //   },
    //   {
    //     value: 14567
    //   },
    // ];
    this.revenueSlotFutureBooking = 'future';
    this.barChart.destroy();
    this.createChart();
  }

  //members
  verifyMemberToday: boolean = true;
  verifyMemberWeek: boolean = false;
  verifyMemberMonth: boolean = false;
  verifyMemberFuture: boolean = false;
  membersData: any = [];
  // [{
  //     value: 200
  //   },
  //   {
  //     value: 300
  //   },
  //   {
  //     value: 500
  //   },
  // ];
  verifyMember: boolean = false;
  MemberName: any = 'Todays Member';
  memberChartText = 'slots';
  memberlastItem: any = '';
  membertodayData() {
    this.verifyMemberToday = true;
    this.verifyMemberWeek = false;
    this.verifyMemberMonth = false;
    this.verifyMemberFuture = false;
    this.MemberName = 'Todays Member';
    this.membersData = [];
    //  [{
    //     value: 200
    //   },
    //   {
    //     value: 300
    //   },
    //   {
    //     value: 500
    //   },
    // ];
    this.memberlastItem = this.membersData.pop();
    this.membersData.push(this.memberlastItem);
    this.memberChartText = 'slots';
    this.membersChart.destroy();
    this.createMembersChart();
  }

  memberthisWeekData(value) {
    this.verifyMemberToday = false;
    this.verifyMemberWeek = true;
    this.verifyMemberMonth = false;
    this.verifyMemberFuture = false;
    this.MemberName = 'Past Week Member';
    this.membersData = [];
    //  [{
    //     value: 100
    //   },
    //   {
    //     value: 100
    //   },
    //   {
    //     value: 200
    //   },
    // ];
    this.memberlastItem = this.membersData.pop();
    this.membersData.push(this.memberlastItem);
    this.memberChartText = 'week';
    this.membersChart.destroy();
    this.createMembersChart();
  }

  memberthisMonthData(value) {
    this.verifyMemberToday = false;
    this.verifyMemberWeek = false;
    this.verifyMemberMonth = true;
    this.verifyMemberFuture = false;
    this.MemberName = 'Past Month Member';
    this.membersData = [];
    // [{
    //     value: 340
    //   },
    //   {
    //     value: 100
    //   },
    //   {
    //     value: 440
    //   },
    // ];
    this.memberlastItem = this.membersData.pop();
    this.membersData.push(this.memberlastItem);
    this.memberChartText = 'month';
    this.membersChart.destroy();
    this.createMembersChart();
  }

  memberfutureData(value) {
    this.verifyMemberToday = false;
    this.verifyMemberWeek = false;
    this.verifyMemberMonth = false;
    this.verifyMemberFuture = true;
    this.MemberName = 'Future Member';
    this.membersData = [];
    //  [{
    //     value: 400
    //   },
    //   {
    //     value: 400
    //   },
    //   {
    //     value: 800
    //   },
    // ];
    this.memberlastItem = this.membersData.pop();
    this.membersData.push(this.memberlastItem);
    this.memberChartText = 'future';
    this.membersChart.destroy();
    this.createMembersChart();
  }

  //male
  verifyMaleToday: boolean = true;
  verifyMaleWeek: boolean = false;
  verifyMaleMonth: boolean = false;
  verifyMaleFuture: boolean = false;
  genderData: any = [];
  // [{
  //     value: 400
  //   },
  //   {
  //     value: 100
  //   },
  //   {
  //     value: 500
  //   },
  // ];
h
  verifyMale: boolean = false;
  GenderName: any = 'Todays Male/Female';
  maleChartText = 'slots';
  malelastItem: any = '';
  maletodayData() {
    this.verifyGenderToday = true;
    this.verifyGenderWeek = false;
    this.verifyGenderMonth = false;
    this.verifyGenderFuture = false;
    this.GenderName = 'Todays Male/Female';
    this.genderData = [{
        value: 400
      },
      {
        value: 100
      },
      {
        value: 500
      },
    ];
    this.malelastItem = this.genderData.pop();
    this.genderData.push(this.malelastItem);
    this.maleChartText = 'slots';
    this.maleChart.destroy();
    this.createGenderChart();
  }

  malethisWeekData(value) {
    this.verifyGenderToday = false;
    this.verifyGenderWeek = true;
    this.verifyGenderMonth = false;
    this.verifyGenderFuture = false;
    this.GenderName = 'Past Week Male/Female';
    this.genderData = [{
        value: 340
      },
      {
        value: 100
      },
      {
        value: 440
      },
    ];
    this.malelastItem = this.genderData.pop();
    this.genderData.push(this.malelastItem);
    this.maleChartText = 'week';
    this.maleChart.destroy();
    this.createGenderChart();
  }

  malethisMonthData(value) {
    this.verifyGenderToday = false;
    this.verifyGenderWeek = false;
    this.verifyGenderMonth = true;
    this.verifyGenderFuture = false;
    this.GenderName = 'Past Month Male/Female';
    this.genderData = [{
        value: 400
      },
      {
        value: 400
      },
      {
        value: 800
      },
    ];
    this.malelastItem = this.genderData.pop();
    this.genderData.push(this.malelastItem);
    this.maleChartText = 'month';
    this.maleChart.destroy();
    this.createGenderChart();
  }

  malefutureData(value) {
    this.verifyGenderToday = false;
    this.verifyGenderWeek = false;
    this.verifyGenderMonth = false;
    this.verifyGenderFuture = true;
    this.GenderName = 'Future Male/Female';
    this.genderData = [{
        value: 200
      },
      {
        value: 200
      },
      {
        value: 400
      },
    ];
    this.malelastItem = this.genderData.pop();
    this.genderData.push(this.malelastItem);
    this.maleChartText = 'future';
    this.maleChart.destroy();
    this.createGenderChart();
  }

  //caddies
  verifyCaddiesToday: boolean = true;
  verifyCaddiesWeek: boolean = false;
  verifyCaddiesMonth: boolean = false;
  verifyCaddiesFuture: boolean = false;
  caddiesData: any = [{
      value: 30
    },
    {
      value: 170
    },
    {
      value: 200
    },
  ];

  verifyCaddies: boolean = false;
  CaddiesName: any = 'Todays Caddies';
  caddiesChartText = 'slots';
  caddieslastItem: any = '';

  caddiestodayData() {
    this.verifyCaddiesToday = true;
    this.verifyCaddiesWeek = false;
    this.verifyCaddiesMonth = false;
    this.verifyCaddiesFuture = false;
    this.CaddiesName = 'Todays Caddies';
    this.caddiesData = [{
        value: 30
      },
      {
        value: 170
      },
      {
        value: 200
      },
    ];
    this.caddieslastItem = this.caddiesData.pop();
    this.caddiesData.push(this.caddieslastItem);
    this.caddiesChartText = 'slots';
    this.caddiesChart.destroy();
    this.createCaddiesChart();
  }

  caddiesthisWeekData(value) {
    this.verifyCaddiesToday = false;
    this.verifyCaddiesWeek = true;
    this.verifyCaddiesMonth = false;
    this.verifyCaddiesFuture = false;
    this.CaddiesName = 'Past Week Caddies';
    this.caddiesData = [{
        value: 300
      },
      {
        value: 200
      },
      {
        value: 500
      },
    ];
    this.caddieslastItem = this.caddiesData.pop();
    this.caddiesData.push(this.caddieslastItem);
    this.caddiesChartText = 'week';
    this.caddiesChart.destroy();
    this.createCaddiesChart();
  }

  caddiesthisMonthData(value) {
    this.verifyCaddiesToday = false;
    this.verifyCaddiesWeek = false;
    this.verifyCaddiesMonth = true;
    this.verifyCaddiesFuture = false;
    this.CaddiesName = 'Past Month Caddies';
    this.caddiesData = [{
        value: 600
      },
      {
        value: 100
      },
      {
        value: 700
      },
    ];
    this.caddieslastItem = this.caddiesData.pop();
    this.caddiesData.push(this.caddieslastItem);
    this.caddiesChartText = 'month';
    this.caddiesChart.destroy();
    this.createCaddiesChart();
  }

  caddiesfutureData(value) {
    this.verifyCaddiesToday = false;
    this.verifyCaddiesWeek = false;
    this.verifyCaddiesMonth = false;
    this.verifyCaddiesFuture = true;
    this.CaddiesName = 'Future Caddies';
    this.caddiesData = [{
        value: 300
      },
      {
        value: 600
      },
      {
        value: 900
      },
    ];
    this.caddieslastItem = this.caddiesData.pop();
    this.caddiesData.push(this.caddieslastItem);
    this.caddiesChartText = 'future';
    this.caddiesChart.destroy();
    this.createCaddiesChart();
  }

  //course
  verifyCoursesToday: boolean = true;
  verifyCoursesWeek: boolean = false;
  verifyCoursesMonth: boolean = false;
  verifyCoursesFuture: boolean = false;
  

  verifyCourse: boolean = false;
  CourseName: any = 'Todays Course';
  courseChartText = 'slots';
  courselastItem: any = '';
  coursetodayData() {
    this.verifyCoursesToday = true;
    this.verifyCoursesWeek = false;
    this.verifyCoursesMonth = false;
    this.verifyCoursesFuture = false;
    this.CourseName = 'Todays Course';
    this.courseData = [{
        value: 170
      },
      {
        value: 30
      },
      {
        value: 200
      },
      {
        value: 400
      },
    ];
    this.courselastItem = this.courseData.pop();
    this.courseData.push(this.courselastItem);
    this.courseChartText = 'slots';
    this.coursesCharts.destroy();
    this.createCoursesChart();
  }

  coursethisWeekData(value) {
    this.verifyCoursesToday = false;
    this.verifyCoursesWeek = true;
    this.verifyCoursesMonth = false;
    this.verifyCoursesFuture = false;
    this.CourseName = 'Past Week Courses';
    this.courseData = [{
        value: 50
      },
      {
        value: 200
      },
      {
        value: 30
      },
      {
        value: 280
      },
    ];
    this.courselastItem = this.courseData.pop();
    this.courseData.push(this.courselastItem);
    this.courseChartText = 'week';
    this.coursesCharts.destroy();
    this.createCoursesChart();
  }

  coursethisMonthData(value) {
    this.verifyCoursesToday = false;
    this.verifyCoursesWeek = false;
    this.verifyCoursesMonth = true;
    this.verifyCoursesFuture = false;
    this.CourseName = 'Past Month Courses';
    this.courseData = [{
        value: 200
      },
      {
        value: 300
      },
      {
        value: 100
      },
      {
        value: 600
      },
    ];
    this.courselastItem = this.courseData.pop();
    this.courseData.push(this.courselastItem);
    this.courseChartText = 'month';
    this.coursesCharts.destroy();
    this.createCoursesChart();
  }

  coursefutureData(value) {
    this.verifyCoursesToday = false;
    this.verifyCoursesWeek = false;
    this.verifyCoursesMonth = false;
    this.verifyCoursesFuture = true;
    this.CourseName = 'Future Courses';
    this.courseData = [{
        value: 300
      },
      {
        value: 100
      },
      {
        value: 50
      },
      {
        value: 450
      },
    ];
    this.courselastItem = this.courseData.pop();
    this.courseData.push(this.courselastItem);
    this.courseChartText = 'future';
    this.coursesCharts.destroy();
    this.createCoursesChart();
  }

  getTodayFlightPercentage(attribute: string) {
    let _totalSlots = this.bookingTodayStats.overallStatus.totalSlots;
    let _totalCheckedIn = this.bookingTodayStats.overallStatus.totalCheckedIn;
    let _totalBooked = this.bookingTodayStats.overallStatus.totalBooked;
    let _totalInPlay = this.bookingTodayStats.overallStatus.totalInPlay;
    let _totalFinished = this.bookingTodayStats.overallStatus.totalFinished;
    let _percentage;
    switch(attribute) {
      case 'available':
        _percentage = ((_totalSlots - _totalBooked) / _totalSlots) * 100;
        return (_percentage?_percentage.toFixed(0):0)+'%';
        case 'booked':
          _percentage =  (_totalBooked / _totalSlots) * 100;
          return (_percentage?_percentage.toFixed(0):0)+'%';

        case 'checkIn':
          _percentage =  (_totalCheckedIn / _totalCheckedIn) * 100;
          return (_percentage?_percentage.toFixed(0):0)+'%';

        case 'inPlay':
          _percentage =  (_totalInPlay / _totalCheckedIn ) * 100;
          return (_percentage?_percentage.toFixed(0):0)+'%';

          case 'finished':
            _percentage =  (_totalFinished / _totalCheckedIn ) * 100;
            return (_percentage?_percentage.toFixed(0):0)+'%';

    }
  }

  getMembersPercentage(attribute: string) {
    let _totalSlots = this.bookingTodayStats.overallStatus.totalSlots;
    let _totalCheckedIn = this.bookingTodayStats.overallStatus.totalCheckedIn;
    let _totalBooked = this.bookingTodayStats.overallStatus.totalBooked;
    let _totalInPlay = this.bookingTodayStats.overallStatus.totalInPlay;
    let _totalFinished = this.bookingTodayStats.overallStatus.totalFinished;
    let _percentage;
    switch(attribute) {
      case 'available':
        _percentage = ((_totalSlots - _totalBooked) / _totalSlots) * 100;
        return _percentage?_percentage.toFixed(0):0;
        case 'booked':
          _percentage =  (_totalBooked / _totalSlots) * 100;
          return _percentage?_percentage.toFixed(0):0;

        case 'checkIn':
          _percentage =  (_totalCheckedIn / _totalCheckedIn) * 100;
          return _percentage?_percentage.toFixed(0):0;

        case 'inPlay':
          _percentage =  (_totalInPlay / _totalCheckedIn ) * 100;
          return _percentage?_percentage.toFixed(0):0;

          case 'finished':
            _percentage =  (_totalFinished / _totalCheckedIn ) * 100;
            return _percentage?_percentage.toFixed(0):0;

    }
  }
  getCaddiesPercentage(currData, totData) {
    let _currData = currData
    let _totData = totData
    // let _totalSlots = this.bookingTodayStats.overallStatus.totalSlots;
    // let _totalCheckedIn = this.bookingTodayStats.overallStatus.totalCheckedIn;
    // let _totalBooked = this.bookingTodayStats.overallStatus.totalBooked;
    // let _totalInPlay = this.bookingTodayStats.overallStatus.totalInPlay;
    // let _totalFinished = this.bookingTodayStats.overallStatus.totalFinished;
    let _percentage;
    _percentage = (_currData.value/_totData[_totData.length-1].value)*100
    return (_percentage?_percentage.toFixed(0):0)+'%';
  }

nextDate() {
    this.currentDate = moment(this.currentDate).add(1, 'days').format("YYYY-MM-DD");
    // this.refreshTeeTimeSlot();
}

prevDate() {
    this.currentDate = moment(this.currentDate).subtract(1, 'days').format("YYYY-MM-DD");
    // this.refreshTeeTimeSlot();
}

confirmDate() {
    this.refreshTodayStats(this.currentDate);
}

onFAQClick() {
  this.nav.push(FaqPage)
}

getClubCurrency() {
  this.flightService.getClubInfo(this.clubId).subscribe((clubInfo: ClubInfo)=>{
    if(clubInfo) {
      this.referenceData.listCountries().subscribe((countries:Array<CountryData>)=>{
        if(countries && countries.length > 0) {
          countries.filter((country: CountryData)=>{
            return clubInfo.countryId === country.id
          }).map((country)=> {
            this.clubCurrency = country
          })
        }
      })
    }
  })
}

}