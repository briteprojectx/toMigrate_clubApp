import {
  Component,
  OnInit,
  ViewChild,
  HostListener
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Nav,
  ModalController,
  AlertController,
  PopoverController
} from 'ionic-angular';
import {
  CalendarComponent
} from 'ionic2-calendar/calendar';
import {
  ClubService
} from '../../../providers/club-service/club-service';
import {
  LoadingController
} from 'ionic-angular';
import {
  CourseInfo,
  ClubInfo
} from '../../../data/club-course';
import {
  ClubFlightService
} from '../../../providers/club-flight-service/club-flight-service';
import {
  BookingListPage
} from '../booking-list/booking-list';
import {
  TeeTimeSlotDisplay,
  ClubCourseData,
  ClubTeeTimeSlots,
  TeeTimeBooking,
  TeeTimeBookingPlayer,
  TeeTimeBookingStatus,
  CourseUtilizationStatistics,
  BookingStatistics,
  CaddieBuggyAssignmentStatistics,
  CourseUtilization,
  CaddieBuggyStatistics
} from '../../../data/mygolf.data';
import * as moment from 'moment';
import {
  SlotsDetailComponent
} from '../slots-detail/slots-detail';
import {
  TeeFlightListsPage
} from '../tee-flight-lists/tee-flight-lists';
import { PlayerHomePage } from '../../player-home/player-home';
import { CourseBox } from '../../modal-screens/course-box/course-box';
import { timesSeries } from 'async';
import { BookingDetailsPage } from '../booking-details/booking-details';
import { ActionSheetController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { GroupBookingOption } from '../../modal-screens/group-booking-option/group-booking-option';
import { SessionDataService, SessionActions } from '../../../redux/session';
import { SessionState, SessionInfo } from '../../../data/authentication-info';
import { ToastController } from 'ionic-angular';
import { MessageDisplayUtil } from '../../../message-display-utils';
import { Subscription } from 'rxjs';
import { TeeSlotListModal } from '../../modal-screens/tee-slot-list/tee-slot-list';
import { RefundBookingPlayersModal } from '../../modal-screens/refund-booking-players/refund-booking-players';
import { ManageVoucherModal } from '../../modal-screens/manage-voucher/manage-voucher';
import { ClubBookingListPage } from '../club-booking-list/club-booking-list';
// import {
//   BookingDetailModalComponent
// } from '../booking-detail-modal/booking-detail-modal';
/**
 * Generated class for the CalendarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 export interface SearchOption {
   name?: string,
   type?: string,
 }
 export interface FilterStatusOption {
  name?: string,
  id?: string,
}
// @IonicPage()
@Component({
  selector: 'booking-calendar',
  templateUrl: 'booking-calendar.html',
})
export class BookingCalendarPage {
  // implements OnInit 
  appFooterHide: boolean = true;
  @ViewChild(Nav) nav: Nav;

  @ViewChild(CalendarComponent) myCal: CalendarComponent;
  eventSource: any[] = [];
  morningEvent: any[] = [];
  afternoonEvent: any[] = [];
  // loadEvents: function() {
  //   this.eventSource.push({
  //       title: 'test',
  //       startTime: startTime,
  //       endTime: endTime,
  //       allDay: false
  //   });
  //   this.myCal.loadEvents();
  // }
  search: any;
  clubId: number;
  courses: Array<any>; //Array < CourseInfo > ;
  clubInfo: ClubInfo;
  currentDate: string = moment().format("YYYY-MM-DD")
  todayEventTab: string = 'morning';
  today: string;
  public searchQuery: string = '';
  searchToggle: boolean = false;
  filteredSlot: Array < TeeTimeSlotDisplay > = new Array < TeeTimeSlotDisplay > ();
  slots: Array < TeeTimeSlotDisplay > ;
  refresh: boolean = false;
  currentCourses: Array < ClubCourseData > ;
  toggleAvailableBoolean: boolean = false;
  clubs: ClubTeeTimeSlots;
  
  fromTime: string = '';
  toTime: string = '';
  bookingListType: string = 'single';
  morningSlots: Array < TeeTimeSlotDisplay > = new Array < TeeTimeSlotDisplay > ();
  afternoonSlots: Array < TeeTimeSlotDisplay > = new Array < TeeTimeSlotDisplay > ();
  optionCourse: any; //CourseInfo;
  searchOptions: Array<SearchOption> = [{
    name: 'Booking Ref.',
    type: 'bookingRef',
      },
    {
     name: 'myGolf2u ID',
     type: 'mg2uId' 
    }];
    selectedSearchOpt: SearchOption = this.searchOptions[0];
  teeTimeSlotDayList: Array < TeeTimeSlotDisplay > = new Array < TeeTimeSlotDisplay > ();
  bookingList: Array<TeeTimeBooking>;
  filteredBooking: Array<TeeTimeBooking>;
  searchingMode: boolean = false;
  refundMode: boolean = false;
  cancelMode: boolean = false;
  private sessionStateSubscription: Subscription;
  private sessionStatusSubscription: Subscription;
  currentSession: SessionInfo;
  noTimeSlot: boolean = false;
  menuLeftOpen: boolean = false;
  leftMenuSize: string = '6vw';
  rightMenuSize: string = '90vw';
  afternoonBooking: Array<TeeTimeBooking>;
  morningBooking: Array<TeeTimeBooking>;
  
  bookingStats: BookingStatistics;
  bookingPlayers: BookingStatistics;
  courseUtilStats: CourseUtilizationStatistics;
  caddyBuggyUtilStats: CaddieBuggyAssignmentStatistics;
  caddyBuggyDayStats: CaddieBuggyStatistics;

  selectedCourse: any; //CourseInfo;
  loadingBookingStats: boolean;
  innerWidth: any;
  filterStatus: Array<FilterStatusOption> = [    {
    name: 'Booked',
    id: 'Booked'
  },{
    name: 'Cancelled by Player',
    id: 'CancelledByPlayer'
  },{
    name: 'Cancelled by Club',
    id: 'CancelledByClub'
  },{
    name: 'Partially Payment',
    id: 'PaymentPartial'
  },{
    name: 'Paid in Full',
    id: 'PaymentFull'
  },{
    name: 'Flight Registered',
    id: 'FlightRegistered'
  },
  // {
  //   name: 'Refund Initiated',
  //   id: 'RefundInitiated'
  // },{
  //   name: 'Refund Completed',
  //   id: 'RefundCompleted'
  // }
];
  selectedFilterStatus: FilterStatusOption = null;
  showPanelMorning: boolean = true;
  showPanelAfternoon: boolean = true;
  rightMenuHide: boolean = false;
  constructor(public alrtCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private clubService: ClubService,
    private loadingCtl: LoadingController,
    private flightService: ClubFlightService,
    private alertCtrl: AlertController,
    private popoverCtl: PopoverController,
    private actionSheetCtl: ActionSheetController,
    private platform: Platform,
    private sessionDataService: SessionDataService,
    private toastCtl: ToastController,
    private sessionActions: SessionActions,) {

    this.clubId = this.navParams.get("clubId");
    /** !this.clubId ? this.clubId = 310510379 : this.clubId; **/

  }

  toggleStatPanel(type?: string) {
    if(type === 'morning') {
      this.showPanelMorning = !this.showPanelMorning;
    } else if(type === 'afternoon') {
      this.showPanelAfternoon = !this.showPanelAfternoon;
    }
  }

  onDateChanged(event) {
    // console.log('Club Calendar - on date changed', this.calendar, this.viewTitle, this.viewClass);
    let _date = event ? moment(event).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD")
    this.currentDate = _date;
    // console.log("Club Calendar - event ", event, moment(event).format("YYYY-MM-DD"))
    if (this.viewClass === 'Day View') {
      // this.refreshTeeSlots({
      //   date: _date
      // });
    }
  }

  @HostListener('ionSlideDidChange') slideChanged() {

    // this.timeout();

  // console.log('Host Element Clicked');
  }
  calendarDates = {
    dateFormatter: {

      formatWeekViewHourColumn: function (date: Date) {
        date = new Date(date.setMinutes(date.getMinutes() + 0))
        return date.toLocaleTimeString().replace(/:\d+ /, ' ');
        // return date.toLocaleTimeString();
      },
      formatDayViewHourColumn: function (date: Date) {
        date = new Date(date.setMinutes(date.getMinutes() + 0))
        return date.toLocaleTimeString().replace(/:\d+ /, ' ');
        // return date.toLocaleTimeString();
      },
    }
  };
  calendarDatesweeks = {
    dateFormatter: {

      formatWeekViewHourColumn: function (date: Date) {
        date = new Date(date.setMinutes(date.getMinutes() + 0))
        return date.toLocaleTimeString().replace(/:\d+ /, ' ');
        // return date.toLocaleTimeString();
      },
      formatDayViewHourColumn: function (date: Date) {
        date = new Date(date.setMinutes(date.getMinutes() + 0))
        return date.toLocaleTimeString().replace(/:\d+ /, ' ');
        // return date.toLocaleTimeString();
      },
    }
  };


  event = {
    title: '',
    desc: '',
    startTime: '',
    endTime: '',
    allDay: false
  };
  viewClass = "Day View";
  minDate = new Date().toISOString();
  date = new Date();
  viewTitle;

  calendar = {
    mode: 'day',
    currentDate: new Date(),
  };
  duration: any = 'month'
  eventBookingData: any;

  onRefreshClick() {
    
    // if(!this.clubId) {
    //   MessageDisplayUtil.showErrorToast('Something went wrong with the server. Please try again', this.platform, this.toastCtl, 5000, 'bottom');
    //   // this.navCtrl.pop();
    //   setTimeout(()=>{
    //     this.navCtrl.popToRoot();
    //   }, 500)
    //   return;
    // }
    // this.eventBookingData = JSON.parse(localStorage.getItem('bookingData'));
    // if (this.eventBookingData) {
    //   this.addEvents();
    // } else {
    //   // this.resetEvent();

    // this.refreshTeeSlots();
    //   // this.createRandomEvents();
    //   this.formatAMPM();

    // }
    // this.optionCourse = this.courses&&this.courses.length>0?this.courses[0]:null;

    this.searchQuery = '';
    this.searchingMode = false;
    this.refundMode = false;
    this.cancelMode = false;
  // console.log("refresh tee slots - course title : ", this.courseTitle);
  // console.log("refresh tee slots - selectedCourse : ", this.selectedCourse);
    // console.log("refresh tee slots - course title : ", this.courseTitle);
    if (this.courseTitle || this.selectedCourse) {
      this.refreshTeeSlots({
        isClub: false,
        clubCourseId: this.selectedCourse.courseId
      })
    } else this.refreshTeeSlots(null);
    // this.formatAMPM();
  }

  ngOnInit() {
    this.eventBookingData = JSON.parse(localStorage.getItem('bookingData'));
    if (this.eventBookingData) {
      this.addEvents();
    } else {
      this.resetEvent();
      this.createRandomEvents();
      this.formatAMPM();
    }

    this.innerWidth = window.innerWidth;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    let _innerHeight = window.innerHeight;
  }

  ionViewDidLoad() {
    let _courses: any;
    this.searchQuery = '';
    // this.searchingMode = false;
    let busy = this.loadingCtl.create({
      content: "Loading courses...",
      duration: 5000
    });
    busy.present().then(() => {
      // this.gameInfo.club.clubId
      if(!this.clubId) {
        MessageDisplayUtil.showErrorToast('Something went wrong with the server. Please try again', this.platform, this.toastCtl, 5000, 'bottom');
        // this.navCtrl.pop();
        setTimeout(()=>{
          this.navCtrl.popToRoot();
        }, 500)
        if(busy) busy.dismiss();
        return;
      }
      this.flightService.getClubInfo(this.clubId)
        .subscribe((clubInfo: any) => {
          this.clubInfo = clubInfo;
        // console.log("club Calendar: ", clubInfo)
          if (clubInfo) {
            this.clubService.getClubCourses(this.clubId)
              .subscribe((courses: Array < CourseInfo > ) => {
                
                  this.courses = courses;
                  _courses = courses;
              // console.log("Club Calendar [pre-sorted]: ", this.courses)
                _courses = _courses.sort((a,b)=>{
                  if(a.displayOrder < b.displayOrder) {
                    return -1
                  }
                  else if(a.displayOrder > b.displayOrder) {
                    return 1
                  }
                  else return 0
                })
                this.courses = this.courses.sort((a,b)=>{
                  if(a.displayOrder < b.displayOrder) {
                    // if(a.courseName < b.courseName) return -1
                    // else if(a.courseName > b.courseName) return 1
                    // else return -1
                    return -1
                  }
                  else if(a.displayOrder > b.displayOrder) {
                    // if(a.courseName < b.courseName) return -1
                    // else if(a.courseName > b.courseName) return 1
                    // else return 1
                    return 1
                  }
                  else return 0
                })
                if(this.courseUtilStats && this.courseUtilStats.overallUtilization) {
                  _courses.forEach((course)=>{
                    let _totalBooked
                    let _totalSlots;
                    let _totalAvailable;
                    let _courseStats = this.courseUtilStats.overallUtilization.filter((cus)=>{
                      return cus.courseId === course.courseId
                    })
                    if(_courseStats && _courseStats.length > 0) {
                      _totalAvailable = _courseStats[0].totalSlots - _courseStats[0].totalBooked
                      course.totalAvailable = _totalAvailable;
                    }
                  })

                  this.courses.forEach((course)=>{
                    let _totalBooked
                    let _totalSlots;
                    let _totalAvailable;
                    let _courseStats = this.courseUtilStats.overallUtilization.filter((cus)=>{
                      return cus.courseId === course.courseId
                    })
                    if(_courseStats && _courseStats.length > 0) {
                      _totalAvailable = _courseStats[0].totalSlots - _courseStats[0].totalBooked
                      course.totalAvailable = _totalAvailable;
                    }
                  })

                }
                // .sort((a,b)=>{
                //   if(a.courseName < b.courseName) return -1
                //   else if(a.courseName > b.courseName) return 1;
                //   else return 0
                // });
              // console.log("Club Calendar : ", courses)
              // console.log("Club Calendar [sorted]: ", this.courses)
                if(this.courses.length > 0 ) {
                  this.optionCourse = _courses[0]
                }
              // console.log("Club Calendar [sorted]: ", _courses)
              // console.log("Club Calendar [sorted]: ", this.optionCourse)
                
                busy.dismiss();
                // .then(()=>{});
                // this.refreshTeeSlots(null);
                
              }, (error) => {
                MessageDisplayUtil.showErrorToast('Something went wrong with the server. Please try again', this.platform, this.toastCtl, 5000, 'bottom');
                // this.navCtrl.pop();
                setTimeout(()=>{
                  this.navCtrl.popToRoot();
                }, 500)
                if(busy) busy.dismiss();
                // if(busy) busy.dismiss();
              }, () => {
                // if(busy) busy.dismiss();
                this.courses ? this.courseSelected(this.courses[0]) : ''
              })
          }
        }, (error)=>{
          MessageDisplayUtil.showErrorToast('Something went wrong with the server. Please try again', this.platform, this.toastCtl, 5000, 'bottom');
          // this.navCtrl.pop();
          setTimeout(()=>{
            this.navCtrl.popToRoot();
          }, 500)
          if(busy) busy.dismiss();

        })

    });

    if(this.navParams.get("fromRefund")) console.log("from refund")
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  ionViewWillEnter() {
    if(!this.clubId) {
      MessageDisplayUtil.showErrorToast('Something went wrong with the server. Please try again', this.platform, this.toastCtl, 5000, 'bottom');
      setTimeout(()=>{
        this.navCtrl.popToRoot();
      }, 500)
    } else {
      this.refreshTeeSlots();
    }
  }

  initSlides() {
    let actin = false;
    setTimeout(() => {
      actin = true;

    }, 1000);
    actin = false;
  }
  resetEvent() {
    this.event = {
      title: '',
      desc: '',
      startTime: moment().toDate().toISOString(), //new Date().toISOString(),
      endTime: moment().toDate().toISOString(), //new Date().toISOString(),
      allDay: false
    };
  }
  minute: any;
  timearr: any;
  formatAMPM() {
    var hours = this.date.getHours();
    var minutes = this.date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    this.minute = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
  // console.log(strTime)
    return strTime;
  }

  title = 'Booking Slots';
  filterTitle = '';
  course = 'east';
  courseTitle = 'East Course';
  courseSelected(course: any) {
    this.timeout();
    this.openModal = false;
    this.courseTitle = course.courseName;
    this.selectedCourse = course;
    if (this.courseTitle) {
      this.refreshTeeSlots({
        isClub: false,
        clubCourseId: course.courseId
      })
    }
    // this.course = value;
    // value == 'east' ? this.courseTitle = 'East Course' : value == 'west' ? this.courseTitle = 'West Course' : value == 'north' ? this.courseTitle = 'North Course' : value == 'other' ? this.courseTitle = 'Other Course' : ''
    // this.createRandomEvents();
  }
  // Create the right event format and reload source
  addEvents(event ? : any) {
    // this.timeout();
    this.resetEvent();

    let eventCopy = {
      title: this.eventBookingData.playerName ? this.eventBookingData.playerName : 'Name',
      startTime: new Date(this.eventBookingData.slotStartTime),
      endTime: new Date(this.eventBookingData.slotStartTime),
      allDay: this.event.allDay,
      desc: this.eventBookingData.arrived,
    }
    let morningCopy = {
      title: this.eventBookingData.playerName ? this.eventBookingData.playerName : 'Name',
      startTime: new Date(this.eventBookingData.slotStartTime),
      endTime: new Date(this.eventBookingData.slotStartTime),
      allDay: this.event.allDay,
      desc: this.eventBookingData.arrived,
    }
    let afternoonCopy = {
      title: this.eventBookingData.playerName ? this.eventBookingData.playerName : 'Name',
      startTime: new Date(this.eventBookingData.slotStartTime),
      endTime: new Date(this.eventBookingData.slotStartTime),
      allDay: this.event.allDay,
      desc: this.eventBookingData.arrived,
    }

    // if (eventCopy.allDay) {
    //   let start = eventCopy.startTime;
    //   let end = eventCopy.endTime;

    //   eventCopy.startTime = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
    //   eventCopy.endTime = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() + 1));
    // }

    this.eventSource.push(eventCopy);
    this.morningEvent.push(morningCopy);
    this.afternoonEvent.push(afternoonCopy);
    this.myCal.loadEvents();
  }

  option(value: any) {
    this.timeout();
    this.createRandomEvents(value);
  }
  //ramdom event
  createRandomEvents(item ? ) {
    this.timeout();
    this.removeEvents();
    this.resetEvent();
    var events = [];
    for (var i = 0; i < 50; i += 1) {
      var date = new Date();
      var eventType = Math.floor(Math.random() * 2);
      var startDay = Math.floor(Math.random() * 90) - 45;
      var endDay = Math.floor(Math.random() * 2) + startDay;
      var maxplayer = Math.floor(Math.random() * 8);
      var minPlayer = Math.floor(Math.random() * 6);
      var normalPrice = Math.floor(Math.random() * 3);
      var promotionPrice = Math.floor(Math.random() * 7);
      var startTime;
      var endTime;
      if (eventType === 0) {
        startTime = new Date(
          Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate() + startDay
          )
        );
        if (endDay === startDay) {
          endDay += 1;
        }
        endTime = new Date(
          Date.UTC(

            date.getUTCMonth(),
            date.getUTCDate() + endDay
          )
        );

        item == 'book' ? this.title = 'Booked Slots' : item == 'player' ? this.title = 'Selected Players' : item == 'option' ? this.title = 'Player Option' : item == 'caddies' ? this.title = 'Caddies' : item == 'buggies' ? this.title = 'Buggies' : 'Slots'
        i >= 1 && i <= 18 ? this.title = `${i} Slots` : i >= 20 && i <= 30 ? this.title = 'Sold Out' : '';
        this.filterTitle = this.title;

        events.push({
          title: this.filterTitle,
          startTime: startTime,
          endTime: endTime,
          walkingAllowed: 'yes',
          maxplayer: maxplayer,
          minPlayer: minPlayer,
          normalPrice: normalPrice,
          promotionPrice: promotionPrice
        });
      } else {
        var startMinute = Math.floor(Math.random() * 2 * 70);
        var endMinute = Math.floor(Math.random() * 780) + startMinute;
        startTime = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() + startDay,
          0,
          date.getMinutes() + startMinute
        );
        endTime = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() + endDay,
          0,
          date.getMinutes() + endMinute
        );
        events.push({
          title: this.filterTitle,
          startTime: startTime,
          endTime: endTime,
          walkingAllowed: 'No',
          maxplayer: maxplayer,
          minPlayer: minPlayer,
          normalPrice: normalPrice,
          promotionPrice: promotionPrice
        });
      }
    }
    this.eventSource = events;
  }

  filteredEvents = [];
  searchList(value) {
    this.filteredEvents = [];
    if (value) {
      let filteredProperty = this.eventSource.filter((item) => {
        return item.title.toLowerCase().trim().includes(value.toLowerCase());
      });
      this.filteredEvents = filteredProperty;
    // console.log('filterevent', this.filteredEvents);
    } else {
      this.filteredEvents = this.eventSource;
    // console.log('final', this.filteredEvents);
    }
  }

  removeEvents() {
    this.eventSource = [];
  }

  next() {
    this.timeout();
    let swiper: any = document.querySelectorAll('.swiper-container');
    swiper[0].swiper.slideNext();
    swiper[1].swiper.slideNext();
    // console.log("Club Calendar - ", this.viewClass, + this.viewTitle, this.calendar.currentDate);
  }

  back() {
    this.timeout();
    let swiper: any = document.querySelectorAll('.swiper-container');
    swiper[0].swiper.slidePrev();
    swiper[1].swiper.slidePrev();
  }



  // Change between month/week/day
  openModal: boolean = true;
  changeMode(mode: any) {
    this.timeout();
  // console.log(mode)
    this.openModal = false;
    this.calendar.mode = mode;
    mode == 'day' ? this.viewClass = "Day View" : mode == 'week' ? this.viewClass = "Week View" : mode == 'month' ? this.viewClass = "Month View" : '';
  }

  timeout() {
    this.openModal = false;
    setTimeout(() => {
      this.openModal = true;
    }, 1000);
  }
  daview = '';
  // Focus today
  // today() {
  //   this.calendar.currentDate = new Date();
  // }

  // Selected date reange and hence title changed
  onViewTitleChanged(title) {
    this.viewTitle = title;
    // console.log("Club Calendar - ", this.viewClass, + this.viewTitle, this.calendar.currentDate);
  }
  openEvent(event) {
    // this.onEventSelected(event);
  // console.log('open----------------')
    this.onTimeSelected(event);
  }
  onSelect() {
    this.search = '';
  }


  // Calendar event was clicked
  async onEventSelected(event ? ) {
    // this.openModal = true;
    this.search = '';
    // Use Angular date pipe for conversion
    // let start = event.startTime;
    // let end = event.endTime
  // console.log('oneventselect', event)
    // let bookModal = this.mdlctrl.create(BookingDetailModalComponent, { event }, {
    //   cssClass: 'my-book-modal',
    //   enableBackdropDismiss: false,
    //   enterAnimation: '',
    //   leaveAnimation: '',
    //   showBackdrop: false
    // });
    // bookModal.onDidDismiss(data => {
    // // console.log(data);
    // });
    // bookModal.present();
  }

  // Time slot was clicked
  ele: any;
  slectedTime: any;
  onTimeSelected(ev ? : any, item = '') {
    this.ele = ev;
    // this.openModal = true;
    this.search = '';
  // console.log('seldeted', ev);
    this.slectedTime = new Date(ev.selectedTime);
  // console.log('selected full time', this.slectedTime)
    this.event.startTime = this.slectedTime //moment().toDate().toLocaleTimeString(); //this.slectedTime.toLocaleTimeString();
    var startTime = this.event.startTime;
  // console.log('slectedTime startTime', this.event.startTime)
    // this.slectedTime.setMinutes(this.slectedTime.getMinutes() + 10);
    this.event.endTime = this.slectedTime //moment().toDate().toLocaleTimeString();//(this.slectedTime.toLocaleTimeString());
    var endTime = this.event.endTime;
  // console.log('slectedTime endTime', this.event.endTime);
    let component;
    let evt;
    if (ev) {
      // this.eventBookingData)
      let arived = 'arrived'; // = this.eventBookingData.arrived;
      component = SlotsDetailComponent;
      evt = ev;
      // arived == 'arrived' || arived == 'ontheway' ? (component = BookingDetailModalComponent, evt = this.eventBookingData) : (component = BookingDetailModalComponent, evt = ev);
      // } else{
      //   component = BookingDetailModalComponent, evt = ev
      // }
      this.navCtrl.push(component, {
        event: evt,
        startTime: startTime,
        endTime: endTime,
      })
      // let bookModal = this.mdlctrl.create(component, {
      //   event: evt,
      //   endTime: endTime,
      // }, {
      //   cssClass: 'my-book-modal',
      //   enableBackdropDismiss: false,
      //   enterAnimation: '',
      //   leaveAnimation: '',
      //   showBackdrop: false
      // });
      // bookModal.onDidDismiss(data => {
      // // console.log(data);
      // });

      // bookModal.present();
      //   if(this.openModal){
      //     ev.events.length > 0 ?  bookModal.present() : this.openPage('BookingsPage');
      // }
    }

    // openPage(page) {
    //   // localStorage.clear();
    // // console.log(this.eventBookingData)
    // // console.log(page)
    //   this.navCtrl.push(page, {
    //     eventData: this.ele,
    //     selected: this.slectedTime
    //   });
  }

  refreshBookingList(param?: any) {
    let _forDate = param && param.date ? moment(param.date).format("YYYY-MM-DD") : this.currentDate;
    //moment(this.calendar.currentDate).format("YYYY-MM-DD");//moment().format("YYYY-MM-DD");
    let _toDate;
    let _fromTime;
    let _toTime;
    let _isClub = param && param.isClub ? param.isClub : true;
    let _clubId = param && param.clubId ? param.clubId : '';
    let _clubCourseId = param && param.clubCourseId ? param.clubCourseId : this.courses ? this.courses[0].courseId : '';
  // console.log("Refresh Booking List - refresh booking slots ", param)
    let loader = this.loadingCtl.create({
      content: "Loading courses..."
    });

    this.afternoonBooking = null;
    this.morningBooking = null;
    this.afternoonBooking = [];
    this.morningBooking = [];

    this.flightService.getBookingFlightList(_clubId,_forDate,false,this.cancelMode)
    .subscribe((dataResp: any)=>{
      
      let _bookingList
      if(dataResp.resp && dataResp.resp.status === 200) {
        _bookingList = dataResp.flightList;
        this.bookingList = _bookingList;
        
      // console.log('Refresh Booking List - Tee Time Booking : ', _bookingList)
      // console.log('Refresh Booking List - Tee Time Booking Afternoon [] : ', this.afternoonBooking)
      // console.log('Refresh Booking List - Tee Time Booking Morning [] : ', this.morningBooking)
        if(this.bookingList && this.bookingList.length > 0 ) {
          let _bookingSlot = this.bookingList
          _bookingSlot.forEach((tSlot: TeeTimeBooking)=>{
            if (moment(tSlot.slotAssigned.teeOffTime, "HH:mm:ss").toDate() < moment('12:00', 'HH:mm').toDate()) {
              if(tSlot.slotAssigned.startCourse.id === _clubCourseId) this.morningBooking.push(tSlot)
            } else {
              if(tSlot.slotAssigned.startCourse.id === _clubCourseId) this.afternoonBooking.push(tSlot)
            }
          })
        }
        // if(this.searchToggle) {
          if(this.searchQuery && this.searchQuery.length > 0) this.onSearchInput(null)
          // if(this.selectedFilterStatus) this.onSearchInput;
          else if(this.selectedFilterStatus) {
            this.onSearchInput(null)
            // this.searchingMode = true;
            // this.bookingList= this.bookingList.filter((teeTimeBooking: TeeTimeBooking)=>{
            //   return this.selectedFilterStatus.id === teeTimeBooking.bookingStatus
            // }) 
          }
        // }
        if(this.refundMode) {
          this.filteredBooking = this.bookingList.filter((teeTimeBooking: TeeTimeBooking)=>{
            return teeTimeBooking.bookingStatus === 'PaymentFull' || teeTimeBooking.bookingStatus === 'PaymentPartial'
          });
        } else if(this.cancelMode) {
          this.filteredBooking = this.bookingList.filter((teeTimeBooking: TeeTimeBooking)=>{
            return teeTimeBooking.bookingStatus === 'CancelledByClub' || teeTimeBooking.bookingStatus === 'CancelledByPlayer'
          });

        }
      }
    }, (error)=>{

    }, () =>{
    // console.log('Refresh Booking List - Tee Time Booking Afternoon : ', this.afternoonBooking)
    // console.log('Refresh Booking List - Tee Time Booking Morning : ', this.morningBooking)
      
    })
  }

  refreshTeeSlots(param ? : any) {
    // isClub?:boolean,clubCourseId?:number,_date?:any
    let _forDate = param && param.date ? moment(param.date).format("YYYY-MM-DD") : this.currentDate;
    //moment(this.calendar.currentDate).format("YYYY-MM-DD");//moment().format("YYYY-MM-DD");
    let _toDate;
    let _fromTime; // = "00:00";// = "07:00";
    let _toTime;// = "17:00";
    let _isClub = param && param.isClub ? param.isClub : false;
    // (this.clubId)?true:false
    let _clubCourseId = param && param.clubCourseId ? param.clubCourseId : this.optionCourse? this.optionCourse.courseId : this.courses ? this.courses[0].courseId : '';
  // console.log("Club Calendar - refresh tee slots ", param)
    let loader = this.loadingCtl.create({
      content: "Loading slots..."
    });

    let eventCopy;
    let morningCopy;
    let afternoonCopy;
    let teeSlotCopy;

    this.flightService.getTeeTimeSlot(_forDate, _isClub, _clubCourseId, _fromTime, _toTime)
      .subscribe((teeTimeSlotDayDisplay: Array < TeeTimeSlotDisplay > ) => {
        loader.dismiss().then(() => {
      this.refreshBookingStats(param);
        // console.log("club calendar @ " + _forDate + " from " + _fromTime + ' to ' + _toTime + " : ", teeTimeSlotDayDisplay)
          if (teeTimeSlotDayDisplay.length > 0) {
            this.refreshBookingList({
              clubId: this.clubId,
              date: this.currentDate,
              clubCourseId: _clubCourseId
            })
            this.filteredSlot = [];
            this.morningSlots = [];
            this.afternoonSlots = [];
            teeSlotCopy = teeTimeSlotDayDisplay;
            this.teeTimeSlotDayList = teeSlotCopy;
            // this.filteredSlot = teeTimeSlotDayDisplay;
            this.filteredSlot = teeSlotCopy;
          // console.log("tee slot copy", teeSlotCopy);
          // console.log("filtered slot ", this.filteredSlot)

            this.morningSlots = teeTimeSlotDayDisplay.filter((tSlot: TeeTimeSlotDisplay)=>{
              return moment(tSlot.slot.teeOffTime, "HH:mm:ss").toDate() < moment('12:00', 'HH:mm').toDate()
            })
            this.afternoonSlots = teeTimeSlotDayDisplay.filter((tSlot: TeeTimeSlotDisplay)=>{
              return moment(tSlot.slot.teeOffTime, "HH:mm:ss").toDate() >= moment('12:00', 'HH:mm').toDate()
            }) 

            let _courses: Array < ClubCourseData > = [];
            this.filteredSlot.forEach((ts: TeeTimeSlotDisplay) => {
              // ts.slot.startCourse.indexOf()
              _courses.push(ts.slot.startCourse)
            });

            let _grpCourses;
            _grpCourses = _courses.reduce((a, b) => {
              a[b.name] = [...a[b.name] || [], b]
              return a
            });

            this.currentCourses = this.getUnique(_courses, 'id');
            this.currentCourses = this.currentCourses.sort((a, b) => {
              
              if(a.displayOrder < b.displayOrder) {
                // if(a.name < b.name) return -1
                // else if(a.name > b.name) return 1
                // else return -1
                return -1
              }
              else if(a.displayOrder > b.displayOrder) {
                // if(a.name < b.name) return -1
                // else if(a.name > b.name) return 1
                // else return 1
                return 1
              }
              else return 0
              // if (a.displayOrder < b.displayOrder) return -1;
              // else if (a.displayOrder > b.displayOrder) return 1;
              // else return 0;
            })

            this.eventSource = [];
            this.morningEvent = [];
            this.afternoonEvent = [];
            this.resetEvent();
          // console.log("club calendar service refresh for course - ", _clubCourseId, teeTimeSlotDayDisplay)
          // console.log("club calendar service - viewClass ", this.viewClass, this.calendar.currentDate, this.currentDate)
            // loadEvents: function() {
            if (this.viewClass === 'Day View') {

              // .filter((tSlot: TeeTimeSlotDisplay)=>{
              //   return moment(tSlot.slot.teeOffTime,"HH:mm:ss").format('HH:mm') <= '12:00' 
              // })
              teeTimeSlotDayDisplay.forEach((tSlot: TeeTimeSlotDisplay) => {
                eventCopy = {
                  title: tSlot.available ? 'Available - ' + moment(tSlot.slot.teeOffTime, "HH:mm:ss").format("hh:mm A") : 'Booked - ' + moment(tSlot.slot.teeOffTime, "HH:mm:ss").format("hh:mm A"),
                  // tSlot.reasonsForUnavailability[0]
                  startTime: moment(tSlot.slot.teeOffDate + " " + tSlot.slot.teeOffTime, "YYYY-MM-DD HH:mm:ss").toDate(), //moment(tSlot.slot.teeOffTime,"HH:mm:ss").toDate(),
                  endTime: moment(tSlot.slot.teeOffDate + " " + tSlot.slot.teeOffTime, "YYYY-MM-DD HH:mm:ss").toDate(), // moment(tSlot.slot.teeOffTime,"HH:mm:ss").toDate(),
                  allDay: false,
                  teeTime: moment(tSlot.slot.teeOffTime, "HH:mm:ss").format("hh:mm A"),
                  slot: tSlot.slot,
                  prices: tSlot.displayPrices,
                  available: tSlot.available,
                };

                this.eventSource.push(eventCopy);
                if (moment(tSlot.slot.teeOffTime, "HH:mm:ss").toDate() < moment('12:00', 'HH:mm').toDate()) {
                // console.log("morning")
                  morningCopy = {
                    title: tSlot.available ? 'Available - ' + moment(tSlot.slot.teeOffTime, "HH:mm:ss").format("hh:mm A") : 'Booked - ' + moment(tSlot.slot.teeOffTime, "HH:mm:ss").format("hh:mm A"),
                    // tSlot.reasonsForUnavailability[0]
                    startTime: moment(tSlot.slot.teeOffDate + " " + tSlot.slot.teeOffTime, "YYYY-MM-DD HH:mm:ss").toDate(), //moment(tSlot.slot.teeOffTime,"HH:mm:ss").toDate(),
                    endTime: moment(tSlot.slot.teeOffDate + " " + tSlot.slot.teeOffTime, "YYYY-MM-DD HH:mm:ss").toDate(), // moment(tSlot.slot.teeOffTime,"HH:mm:ss").toDate(),
                    allDay: false,
                    slot: tSlot.slot,
                    prices: tSlot.displayPrices,
                    available: tSlot.available,
                  }
                  this.morningEvent.push(morningCopy);
                  //  this.myCal.loadEvents();

                } else if (moment(tSlot.slot.teeOffTime, "HH:mm:ss").toDate() >= moment('12:00', 'HH:mm').toDate()) {
                // console.log("afternoon")
                  afternoonCopy = {
                    title: tSlot.available ? 'Available - ' + moment(tSlot.slot.teeOffTime, "HH:mm:ss").format("hh:mm A") : 'Booked - ' + moment(tSlot.slot.teeOffTime, "HH:mm:ss").format("hh:mm A"),
                    // tSlot.reasonsForUnavailability[0]
                    startTime: moment(tSlot.slot.teeOffDate + " " + tSlot.slot.teeOffTime, "YYYY-MM-DD HH:mm:ss").toDate(),
                    // moment.utc(tSlot.slot.teeOffDate + " " + tSlot.slot.teeOffTime,"YYYY-MM-DD HH:mm:ss").format(),
                    //moment(tSlot.slot.teeOffDate + " " + tSlot.slot.teeOffTime,"YYYY-MM-DD HH:mm:ss").toDate(),//moment(tSlot.slot.teeOffTime,"HH:mm:ss").toDate(),
                    endTime: moment(tSlot.slot.teeOffDate + " " + tSlot.slot.teeOffTime, "YYYY-MM-DD HH:mm:ss").toDate(),
                    // moment.utc(tSlot.slot.teeOffDate + " " + tSlot.slot.teeOffTime,"YYYY-MM-DD HH:mm:ss").format(),
                    //moment(tSlot.slot.teeOffDate + " " + tSlot.slot.teeOffTime,"YYYY-MM-DD HH:mm:ss").toDate(),// moment(tSlot.slot.teeOffTime,"HH:mm:ss").toDate(),
                    allDay: false,
                    slot: tSlot.slot,
                    prices: tSlot.displayPrices,
                    available: tSlot.available,
                  }
                  this.afternoonEvent.push(afternoonCopy);
                  //  this.myCal.loadEvents();
                }
              })


            // console.log("club calendar service - mycal ", this.myCal);
            // console.log("club calendar service - event source ", this.eventSource, this.eventBookingData)
            // console.log("morning event : ", this.morningEvent);
            // console.log("afternoon event : ", this.afternoonEvent);
            // console.log("booking event list : ", this.bookingList);
            // console.log("morning event slot : ", this.afternoonBooking);
            // console.log("afternoon event slot: ", this.morningBooking);
            }

            // this.myCal.loadEvents();

            // }
            // this.nav.push(BookingListPage, {
            //     bookingListType: 'single',
            //     teeTimeSlotDisplayList: teeTimeSlotDayDisplay,
            //     fromTime: _fromTime,
            //     toTime: _toTime,
            //     startDate: _forDate,
            //     // courseInfo: this.courseInfo,
            //     clubInfo: this.clubInfo
            // })
          } else {
            this.morningSlots = [];
            this.afternoonSlots = [];
            this.morningEvent = [];
            this.afternoonEvent = [];
            let _message = 'No time slots available for <br>Date : ' 
            + moment(_forDate,"YYYY-MM-DD").format("ddd, DD MMM YYYY"); 
            // + '<br>From ' + _fromTime + ' to ' + _toTime;
            
            let alert = this.alertCtrl.create({
              title: 'No time slots available',
              // subTitle: 'Selected date is '+ _date,
              message: _message, //'Selected date is ' + '<b>' + _date + '</b>',
              buttons: [{
                text: 'Close',
                handler: () => {
                  this.noTimeSlot = false;
                }
            }]
            });
            if(!this.noTimeSlot) alert.present();
            this.noTimeSlot = true;
            loader.dismiss();
          }
        })

      }, (error) => {
        loader.dismiss();
      }, () => {
        setTimeout(() => {
          loader.dismiss()
        }, 5000)
      });
  }
  getDayViewClass(event) {
    let _class = "calendar-event-inner"
    let _event = event;
    if (_event.available) _class += ' available';
    else _class += ' booked';
    return _class;
  }
  getInterval() {
    if (1) return 10
    if (!this.eventSource || this.eventSource.length === 0 || this.eventSource === null || this.eventSource === []) return 30;
    else {

    // console.log("get interval")
      let _interval = 30;
      let _first = moment(this.eventSource[1].slot.teeOffTime, 'HH:mm:ss')
      let _second = moment(this.eventSource[0].slot.teeOffTime, 'HH:mm:ss')
      this.eventSource && this.eventSource.length > 0 ? _interval = _first.diff(_second, 'minute') : '';
    // console.log("get interval ", _interval)
      return _interval
    }
  }
  getSlotLineDetails(event, attribute ? : string) {
    let _event = event;
    if (_event && _event.slot) {
      switch (attribute) {
        case 'players':
          return _event.slot.minPlayers + '-' + _event.slot.maxPlayers;
        case 'walking':
          return _event.slot.allowWalking ? 'Walk' : 'Buggy'
        case 'members':
          return _event.slot.membersOnly ? 'Yes' : 'All'
        case 'holesAllowed':
          return _event.slot.eighteenHolesAllowed ? '18' : '9'
        case 'caddy':
          return _event.slot.caddyMandatory ? 'Yes' : 'No'
        case 'availableBook':
          return _event.slot.availableForBooking ? 'Yes' : 'No'
      }
    } else return '';

  }

  changeDate(x: number) {
    // if (!this.prevPage(x * -1)) return false;
    this.currentDate = moment(this.currentDate).add(x, 'days').format("YYYY-MM-DD");
    // this.refreshTeeTimeSlot();
  }

  nextDate() {
    // console.log("booking list type [next] - ", this.bookingListType)
    this.currentDate = moment(this.currentDate).add(1, 'days').format("YYYY-MM-DD");
    // this.refreshTeeTimeSlot();
  }

  prevDate() {
    // console.log("booking list type [prev]- ", this.bookingListType)
    this.currentDate = moment(this.currentDate).subtract(1, 'days').format("YYYY-MM-DD");
    // this.refreshTeeTimeSlot();
  }

  confirmDate() {
  // console.log("confirm date is called", this.currentDate);
    // this.refreshTeeTimeSlot();
  // console.log("refresh tee slot - change date - course title : ", this.courseTitle);
  // console.log("refresh tee slot - change date - selectedCourse : ", this.selectedCourse);
    // console.log("refresh tee slots - course title : ", this.courseTitle);
    if (this.courseTitle || this.selectedCourse) {
      this.refreshTeeSlots({
        isClub: false,
        clubCourseId: this.selectedCourse.courseId
      })
    } else this.refreshTeeSlots(null);
    this.searchingMode = false;
    // this.selectedFilterStatus = null;
  }

  prevPage(days ? : number) {
    let _currDate = moment(this.currentDate);
    let _today = moment(this.today);
    // let isBefore = moment(this.currentDate).isBefore(this.today);
    // console.log("prev page : isBefore", isBefore)
    // let isAfter = moment(this.currentDate).add(2, 'days') > moment(this.today)
    // return isAfter;
    let _diffDays = _currDate.diff(_today, 'days');
    // let _diffSecs = _currDate.diff(_today,'seconds');
    // console.log("Diff Curr date : ", _currDate);
    // console.log("Diff Today : ", _today)
    // console.log("Difference days : currDate - today | secs", _diffSecs); 


    if (!days || days === null) {
      // console.log("no days diff - initial")
      if (moment(this.currentDate).toDate() > moment(this.today).toDate()) return true;
    } else {
      // console.log("Difference days [prev] : currDate - today | days", _diffDays); 
      if (_diffDays >= days) {
        return true
      } else return false;
    }

  }

  availableClass(x: boolean) {
  // console.log("available class : ", x)
    if (x === false) return 'book-unavailable'
    else return ''
  }

  getNavDate(x: number, type: string) {
    let _dayName = moment(this.currentDate).add(x, 'days').format("ddd");
    let _dateShort = moment(this.currentDate).add(x, 'days').format("D/M");
    let _dateText = _dayName + `<br>` + _dateShort;

    switch (type) {
      case 'day':
        return _dayName;
      case 'date':
        return _dateShort;
    }

  }
  onSearchInput(searchbar) {
    this.filteredBooking = [];
    this.searchingMode = true;
    this.refundMode = false;
    // this.filteredSlot = this.teeTimeSlotDayList.filter((tSlot: TeeTimeSlotDisplay)=>{
    //   return tSlot.slot.
    // })
    let _filteredBooking = [];
    let _filteredRef = this.bookingList.filter((tBooking: TeeTimeBooking)=>{
        return tBooking.bookingReference.trim().toLowerCase().includes(this.searchQuery.trim().toLowerCase())
         // return tBooking.booking.trim().toLowerCase().includes(this.searchQuery.trim().toLowerCase())
    })
  // console.log("after filteredRef ", this.bookingList)
    let _filteredPlayer = this.bookingList.filter((tBooking: TeeTimeBooking)=>{
        let _player;
        _player = tBooking.bookingPlayers.filter((player: TeeTimeBookingPlayer)=>{
        // console.log("player id ", player.player, this.searchQuery)
          // if(!this.searchQuery) return false;
          // else if(this.searchQuery && this.searchQuery.length === 0) return false;
          // else if(isNaN(Number(this.searchQuery))) return false;
          // else return (String(player.player.id) === this.searchQuery.trim())
          if(player && player.player) return (String(player.player.id) === this.searchQuery.trim())
        })
      // console.log("inside booking list ", _player)
        if(_player && _player.length > 0) return true
        if((!_player || _player.length === 0 ) && tBooking.bookedByPlayer) {
          return String(tBooking.bookedByPlayer.id) === this.searchQuery.trim()
        } else return false
      
      // return tBooking.booking.trim().toLowerCase().includes(this.searchQuery.trim().toLowerCase())
    })

    let _filteredName = this.bookingList.filter((tBooking: TeeTimeBooking)=>{
      let _player;
      _player = tBooking.bookingPlayers.filter((player: TeeTimeBookingPlayer)=>{
      // console.log("player id ", player.player, this.searchQuery)
        // return player.playerName.trim().toLowerCase().includes(this.searchQuery.trim().toLowerCase()) || 
        // player.player.playerName.trim().toLowerCase().includes(this.searchQuery.trim().toLowerCase())
        if(player && player.playerName) return player.playerName.trim().toLowerCase().includes(this.searchQuery.trim().toLowerCase())
        if(player && player.player.playerName) return player.player.playerName.trim().toLowerCase().includes(this.searchQuery.trim().toLowerCase())
        if(player && player.email) return player.email.trim().toLowerCase().includes(this.searchQuery.trim().toLowerCase())
        if(player && player.player.email) return player.player.email.trim().toLowerCase().includes(this.searchQuery.trim().toLowerCase())
      })
      
      if(_player && _player.length > 0) return true
    })
    
  // console.log("after filteredPlayer ", this.bookingList)
  // console.log("filtered Ref ", _filteredRef.length, "| filtered player ", _filteredPlayer.length, "| filtered name ", _filteredName.length)

    if(_filteredRef.length > 0 ) _filteredBooking.push(..._filteredRef);
    if(_filteredPlayer.length > 0 ) _filteredBooking.push(..._filteredPlayer);
    if(_filteredName.length > 0 ) _filteredBooking.push(..._filteredName);
  // console.log("filtered_booking", _filteredBooking.length)
    
    
    if(_filteredBooking && _filteredBooking.length > 0 ) _filteredBooking = _filteredBooking.sort((a, b) => {
      if (a.slotAssigned.startCourse.displayOrder < b.slotAssigned.startCourse.displayOrder) {
        // if (a.slotAssigned.teeOffTime < b.slotAssigned.teeOffTime) return -1;
        // else if (a.slotAssigned.teeOffTime > b.slotAssigned.teeOffTime) return 1;
        // else return -1
        return -1
      }
      else if (a.slotAssigned.startCourse.displayOrder > b.slotAssigned.startCourse.displayOrder) {
        // if(a.slotAssigned.teeOffTime < b.slotAssigned.teeOffTime) return -1;
        // else if (a.slotAssigned.teeOffTime > b.slotAssigned.teeOffTime) return 1;
        // else return 1
        return 1
      }
      else return 0;
    })
  //   .sort((a, b) => {
  //     if (a.slotAssigned.teeOffTime < b.slotAssigned.teeOffTime)
  //         return -1;
  //     else if (a.slotAssigned.teeOffTime > b.slotAssigned.teeOffTime)
  //         return 1;
  //     else return 0;
  // });
  
  if(_filteredBooking && _filteredBooking.length > 0) this.filteredBooking = _filteredBooking;
  if(this.selectedFilterStatus) this.filteredBooking = this.filteredBooking.filter((teeTimeBooking: TeeTimeBooking)=>{
  // console.log("selected filter status", this.selectedFilterStatus)
  // console.log("selected filter status slot", teeTimeBooking)
    return this.selectedFilterStatus.id.toLowerCase() === teeTimeBooking.bookingStatus.toLowerCase()
  }) 
  else {
    if(this.searchQuery && this.searchQuery.length > 0) this.filteredBooking = this.bookingList
    else this.searchingMode = false;
  }
  // this.filteredBooking = this.bookingList;

console.log("on search input : ", this.selectedSearchOpt);
console.log("on search input : ", this.searchQuery);
  // console.log("on search input : ", searchbar);
    
  // console.log("on search input : filteredBookingRef", _filteredRef)
  // console.log("on search input : filteredPlayer", _filteredPlayer)
  // console.log("on search input : filteredBooking", _filteredBooking)
  // console.log("on search input : bookingList", _filteredBooking)
    if(_filteredBooking.length > 0 && _filteredBooking.length === 1 && (this.searchQuery && this.searchQuery.length > 0)) {
      this.searchQuery = '';
      this.searchingMode = false;
      this.navCtrl.push(BookingDetailsPage, {
        fromClub: true,
        teeSlotNew: false,
        bookingSlot: _filteredBooking[0]
      })
    }
    //  else if(_filteredBooking.length > 1 ) {
    //   this.filteredBooking = _filteredBooking;
    // }
    else {
      this.filteredBooking = _filteredBooking;
    }
    // this._clearAndRefresh(null, null);
  }
  onSearchCancel(searchbar) {
    // this._clearAndRefresh(null, null);
    this.refreshTeeSlots();
    this.searchingMode = false;
  }
  onHomeClick() {
    // console.log("footer home click")
    this.navCtrl.popToRoot(); //this.nav.setRoot(PlayerHomePage);
  }
  checkAvailable(x: TeeTimeSlotDisplay) {
    let _reasons = x.reasonsForUnavailability.length > 0 ? x.reasonsForUnavailability[0].toLowerCase():'';
    if (x.available) {
      if(x.slot.membersOnly) return 'column slot-members-only'
      else if(!x.slot.availableForBooking) return 'column slot-not-available-online'
      return 'column slot-available'
    }
    else if (!x.available) {
      if(!x.available && _reasons.length > 0 && _reasons === 'Already Booked'.toLowerCase()) return 'column slot-not-available'
      else if(!x.available && _reasons.length > 0 && _reasons === 'Members Only Slot'.toLowerCase()) return 'column slot-members-only'
      else if(!x.available && _reasons.length > 0 && _reasons === 'Not Opened Yet'.toLowerCase()) return 'column slot-not-opened'
      else if(!x.available && _reasons.length > 0 && _reasons === 'Not Available Online'.toLowerCase()) return 'column slot-not-available-online'
      else if(!x.available && _reasons.length > 0 && _reasons.includes('crossover')) return 'column slot-not-opened'
      // Crossover from Mines (1-9)@07:00:00
      else return 'column slot-not-opened' 
    }

  }
  getTeeOffTime(teeTime: string, type ? : string) {
    switch (type) {
      case 'am-pm':
        return moment(teeTime, 'HH:mm:ss').format("A")
      default:
        return moment(teeTime, 'HH:mm:ss').format("HH:mm")
    }

  }
  getUnique(arr, comp) {

    // store the comparison  values in array
    const unique = arr.map(e => e[comp])

      // store the indexes of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)

      // eliminate the false indexes & return unique objects
      .filter((e) => arr[e]).map(e => arr[e]);

    return unique;
  }
  getClubDetails(club: any, attribute: string) {
    // console.log("attribute : ",attribute,"get club name : ", club);
    let _club = club;
    let _address = club.address;
    let _addressTxt = _address.address1 ? _address.address1 : '' +
        _address.address2 ? ',' + _address.address2 : '' +
        _address.city ? ',' + _address.city : '' +
        _address.countryData.name ? "," + _address.countryData.name : '';
    // console.log("get club address - ", _addressTxt)
    if (!club) return '';
    else {
        switch (attribute) {
            case 'name':
                return _club.name
            case 'image':
                return _club.clubImage
            case 'address':
                return _addressTxt
            case 'addressOld':
                return _address
        }
    }

}

getSlotPrice(slot: TeeTimeSlotDisplay, attribute ? : string) {
  if (!slot || slot === null) return '';
  let _slot = slot;
  let _currency = _slot.currency ? _slot.currency.symbol : '';
  let _displayPrice = _slot.displayPrices ? _slot.displayPrices.STD : '';
  // console.log("getSlotPrice slots - ", slots);
  // console.log("getSlotPrice slot[0] - ", _slot);

  // return _slot.currency ? _slot.currency.symbol : '' + " " + _slot.displayPrices ? _slot.displayPrices.STD : ''
  return _currency + " " + this.numberWithCommas(_displayPrice);
}



getClubCourseImage(course: ClubCourseData, clubs?: ClubTeeTimeSlots) {
    let _defaultImg = 'assets/img/default/template-course-' + Math.floor((Math.random() * 5) + 1) + '.jpg';
    let _club = this.clubs;
    // if (_club && _club.slots.length > 0 && _club.slots[0].slot.startCourse.courseImage)
    //     return course.courseImage ;//_club.slots[0].slot.startCourse.courseImage
    // else if (_club && _club.club.clubImage)
    //     return course.courseImage ;//_club.club.clubImage
    if(course && course.courseThumbnail)
        return course.courseThumbnail;
    else if(course && course.courseImage)
        return course.courseImage;
    else if (!course && this.clubInfo.clubImage) return this.clubInfo.clubImage
    else return 'img/course-default.png'
    // else return _defaultImg;
}

toggleAvailable() {
  this.toggleAvailableBoolean = !this.toggleAvailableBoolean;
  // this.refreshTeeTimeSlot();
}
onSelectCourse(event) {
  let _courses: any;
  
  let _fromDate = this.currentDate; //param && param.date ? moment(param.date).format("YYYY-MM-DD") : this.currentDate;
  this.clubService.getClubCourses(this.clubId)
      .subscribe((courses: Array < CourseInfo > ) => {
        // console.log("get club courses : ", courses)
          _courses = courses.sort((a,b)=>{
            if(a.displayOrder < b.displayOrder) {
              // if(a.courseName < b.courseName) return -1
              // else if(a.courseName > b.courseName) return 1
              // else return -1
              return -1
            }
            else if(a.displayOrder > b.displayOrder) {
              // if(a.courseName < b.courseName) return -1
              // else if(a.courseName > b.courseName) return 1
              // else return 1
              return 1
            }
            else return 0
          });
          
          if(this.courseUtilStats && this.courseUtilStats.overallUtilization) {
          _courses.forEach((course)=>{
            let _totalBooked
            let _totalSlots;
            let _totalAvailable;
            let _courseStats = this.courseUtilStats.overallUtilization.filter((cus)=>{
              return cus.courseId === course.courseId
            })
            if(_courseStats && _courseStats.length > 0) {
              _totalAvailable = _courseStats[0].totalSlots - _courseStats[0].totalBooked
              course.totalAvailable = _totalAvailable;
            }
        })
      }
          // .sort((a,b)=>{
          //   if(a.courseName < b.courseName) return - 1
          //   else if(a.courseName > b.courseName) return 1;
          //   else return 0
          // });

          // let popover = this.popoverCtl.create(CourseBox, {
          //     fromStarterList: true,
          //     courses: _courses,
          //     excludeAll: true,
          // });
          // popover.onDidDismiss((data: CourseInfo) => {

          //     // this.getFlightStarterList();
          //     if (data) {
          //         // this.optionCourse = {}; 
          //         // this.gameInfo.courses.push(data);
          //       // console.log("select course - data : ", data)
          //         this.optionCourse = data;
          //         this.courseSelected(data);
          //         // this.refreshTeeSlots({
          //         //   clubCourseId: data.courseId,
          //         //   isClub: false
          //         // });
          //     }
          // });
          // popover.present({
          //     ev: event
          // });
      }, (error)=>{

      }, ()=>{
      // console.log("courses with slots number : ", _courses)
        let popover = this.popoverCtl.create(CourseBox, {
          fromStarterList: true,
          courses: _courses,
          excludeAll: true,
      });
      popover.onDidDismiss((data: CourseInfo) => {

            // this.getFlightStarterList();
            if (data) {
                // this.optionCourse = {}; 
                // this.gameInfo.courses.push(data);
              // console.log("select course - data : ", data)
                this.optionCourse = data;
                this.courseSelected(data);
                // this.refreshTeeSlots({
                //   clubCourseId: data.courseId,
                //   isClub: false
                // });
            }
        });
        popover.present({
            ev: event
        });
      })

}
getBookingDetails(slot: TeeTimeSlotDisplay, type?: string) {
  // console.log("booking details [0] - ", type, slot, this.bookingList);
  // if(this.bookingList && this.bookingList.length === 0) return false;
  // else if(!type && !this.bookingList) return false;
  if(!type && !slot.available && slot.reasonsForUnavailability[0].toLowerCase() === 'Not Available Online'.toLowerCase()) return '<i>Not Available Online</i>'
  else if(!type && !slot.available && slot.reasonsForUnavailability[0].toLowerCase() === 'Not Opened Yet'.toLowerCase()) return '<i>Not Opened Yet</i>'
  else if(!type && !slot.available && slot.reasonsForUnavailability[0].toLowerCase() === 'Members Only Slot'.toLowerCase()) return '<i>Members Only Slot</i>'
  let _bookedSlot: TeeTimeBooking;
  // console.log("get booking details : ", slot)
  this.bookingList.filter((tBooking: TeeTimeBooking)=>{
    return tBooking.slotAssigned.slotDayId === slot.slot.slotDayId &&  tBooking.slotAssigned.slotNo === slot.slot.slotNo
  })
  .map((tBooking: TeeTimeBooking)=>{
    _bookedSlot = tBooking;
  });
  let _removedPlayers;
  if(_bookedSlot && _bookedSlot.bookingPlayers) {
    _bookedSlot.bookingPlayers.sort((a,b)=>{
      if(a.sequence < b.sequence) return -1
      else if(a.sequence < b.sequence) return 1
      else return 0
    });
    _removedPlayers = _bookedSlot.bookingPlayers.filter((p)=>{
      return p.playerRemoved;
    })
  }; 
  // console.log("booking details [1] - ", type, " : ", _bookedSlot)
  let _bookingRef = _bookedSlot?_bookedSlot.bookingReference:null;
  if(type === 'referenceNo' && _bookingRef) return _bookingRef + ' | ';
  let _iconPlayers = `&nbsp;<i style="color:#8acb8c" class="fas fa-fw fa-users"></i>`;
  let _numberPlayers = _bookedSlot&&_bookedSlot.bookingPlayers?_bookedSlot.bookingPlayers.length-(_removedPlayers&&_removedPlayers.length?_removedPlayers.length:0):'0';
  let _playersNoText = _numberPlayers?_numberPlayers + _iconPlayers+' | ':'';

  let _bookedPlayer = _bookedSlot?_bookedSlot.bookedByPlayer:null;
  let _bookingPlayer = _bookedSlot?_bookedSlot.bookingPlayers[0]:null;
  let _bookedClub = _bookedSlot?_bookedSlot.bookedByUser:null;
  let _playerName = _bookingPlayer && _bookingPlayer.playerName?_bookingPlayer.playerName.split(' '):[''];
  let _bookedPlayerName = _bookedPlayer && _bookedPlayer.playerName?_bookedPlayer.playerName.split(' '):[''];
  if(_bookedPlayer) return '#'+_bookedPlayer.id + ' | ' + _playersNoText  +_bookedPlayerName[0] + ' | ' + this.deriveBookingStatus(_bookedSlot.bookingStatus)
  else if(_bookingPlayer && _bookingPlayer.player) return '#'+ _bookingPlayer.player.id + ' | ' + _playersNoText +_playerName[0] + ' | '  + this.deriveBookingStatus(_bookedSlot.bookingStatus)
  
  else if(_bookedClub) return _bookedClub.name + ' | ' + _playersNoText + this.deriveBookingStatus(_bookedSlot.bookingStatus)
  else return '';
}

deriveBookingStatus(status: TeeTimeBookingStatus) {
  if(status === 'PaymentFull') return 'Paid in Full';
  else if(status === 'PaymentPartial') return 'Partially Paid';
  else if(status === 'CancelledByClub') return 'Club Cancelled';
  else if(status === 'CancelledByPlayer') return 'Player Cancelled';
  else if(status === 'Booked') return 'Booked';
}

onChangeSearchOpt() {
  let _buttons = [];

  this.searchOptions.forEach((data: SearchOption)=>{
    _buttons.push({
          text: data.name,
          // role: 'destructive', // will always sort to be on the bottom
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
              this.selectedSearchOpt = data
          // console.log('search opt clicked', data," - ", this.searchOptions);
            this.onSearchInput(null)
          }
        })
  })
  let actionSheet = this.actionSheetCtl.create({
    buttons: _buttons
});
actionSheet.present();
}
onChangeStatusFilter() {
  let _buttons = [];

  this.filterStatus.forEach((data: FilterStatusOption)=>{
    _buttons.push({
          text: data.name,
          // role: 'destructive', // will always sort to be on the bottom
          // icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
              this.selectedFilterStatus = data
          // console.log('status filter clicked', data," - ", this.filterStatus);
            this.onSearchInput(null)
          }
        })
  })
  
  _buttons.push({
    text: 'All Status',
    // role: 'destructive', // will always sort to be on the bottom
    icon: !this.platform.is('ios') ? 'close' : null,
    handler: () => {
        // this.selectedFilterStatus.name = 'All Status';
        // this.selectedFilterStatus.id = null;
        this.selectedFilterStatus = null;
      this.onSearchInput(null)
    }
  });
  let actionSheet = this.actionSheetCtl.create({
    buttons: _buttons
});
actionSheet.present();
}

onGroupBookingClick() {
  // if(1) return;
  this.navCtrl.push(GroupBookingOption, {
    clubInfo: this.clubInfo,
    clubId: this.clubId
  })
}

onBookingDetailClick(bookingSlot: TeeTimeBooking) {
  this.sessionStatusSubscription = this.sessionDataService.getSessionStatus()
  .distinctUntilChanged()
  .subscribe((status: SessionState)=>{
      this.sessionDataService.getSession()
          .take(1)
          .subscribe((session: SessionInfo)=>{
              if(status === SessionState.LoginFailed){
                  let toast = this.toastCtl.create({
                      message: session.exception,
                      duration: 5000,
                      showCloseButton: true,
                      closeButtonText: 'OK'
                  });
                  toast.present().then(()=>{
                      this.sessionActions.clearLoginError();
                  });

                  MessageDisplayUtil.showErrorToast(session.exception, this.platform, this.toastCtl, 5000, 'bottom');

              }
              else if(status === SessionState.LoggedIn) {
                this.currentSession = session;
                  // this.mainPage(session);
              }
            // console.log("[get session] session info ", session)
          }, (error) => {
            // console.log("[get session] error ", error)
          });
        // console.log("[get session] status : ",status)

  });
this.navCtrl.push(BookingDetailsPage, {
teeSlotNew: false,
teeTimeSlotDisplay: bookingSlot.slotAssigned,
bookingSlot: bookingSlot,
clubInfo: bookingSlot.clubData,
fromClub: true,
currSession: this.currentSession,
type: this.cancelMode?'past':null,
});
}

onBookingClick(bookingSlot: TeeTimeBooking, action?: string) {
  if(this.refundMode || action === 'refund') {
    this.onBookingRefundClick(bookingSlot);
    return false;
  } else if(action === 'details') this.onBookingDetailClick(bookingSlot)
  else this.onBookingDetailClick(bookingSlot)
  
}

onSlotClick(slot: TeeTimeSlotDisplay) {
// console.log("on slot click ", slot)
  let _allow: boolean = true;
  if (slot && !slot.available) {
    slot.reasonsForUnavailability.forEach((reason: string) => {
      if(reason.toLowerCase().includes('not')) _allow = false
      else if(reason.toLowerCase().includes('crossover')) _allow = false;
    })
    if(!_allow) return false 
  }
  let _bookedSlot;


  this.sessionStatusSubscription = this.sessionDataService.getSessionStatus()
            .distinctUntilChanged()
            .subscribe((status: SessionState)=>{
                this.sessionDataService.getSession()
                    .take(1)
                    .subscribe((session: SessionInfo)=>{
                        if(status === SessionState.LoginFailed){
                            let toast = this.toastCtl.create({
                                message: session.exception,
                                duration: 5000,
                                showCloseButton: true,
                                closeButtonText: 'OK'
                            });
                            toast.present().then(()=>{
                                this.sessionActions.clearLoginError();
                            });

                            MessageDisplayUtil.showErrorToast(session.exception, this.platform, this.toastCtl, 5000, 'bottom');

                        }
                        else if(status === SessionState.LoggedIn) {
                          this.currentSession = session;
                            // this.mainPage(session);
                        }
                      // console.log("[get session] session info ", session)
                    }, (error) => {
                      // console.log("[get session] error ", error)
                    });
                  // console.log("[get session] status : ",status)

            });
  // if(1) return false;
  
  if(slot.available) {
    this.navCtrl.push(BookingDetailsPage, {
      clubInfo: this.clubInfo,
      teeTimeSlotDisplay: slot,
      teeSlotNew: true,
      clubs: this.clubs,
      fromClub: true,
      currSession: this.currentSession
  })
  } else {
    this.bookingList.filter((tBooking: TeeTimeBooking)=>{
      return tBooking.slotAssigned.slotDayId === slot.slot.slotDayId &&  tBooking.slotAssigned.slotNo === slot.slot.slotNo
    })
    .map((tBooking: TeeTimeBooking)=>{
      _bookedSlot = tBooking;
    });
    this.navCtrl.push(BookingDetailsPage, {
      teeSlotNew: false,
      teeTimeSlotDisplay: _bookedSlot.slotAssigned,
      bookingSlot: _bookedSlot,
      clubInfo: _bookedSlot.clubData,
      fromClub: true,
      currSession: this.currentSession
  });

  }
  
}

toggleLeftMenu(toggle: boolean) {
  this.menuLeftOpen = toggle;
  if(this.innerWidth < 768) {
    
    this.leftMenuSize = toggle?'100vw':'6vw';
    this.rightMenuHide = toggle?true:false;
  } 
  else {
    this.leftMenuSize = toggle?'30vw':'6vw';
    this.rightMenuSize = toggle?'68vw':'90vw'; 
  }
}

getBookingStats(time: string, attribute: string) {
  if(!this.courseUtilStats) return false;
  let _courseUtil;
  
  // console.log("courseUtl all ", this.courseUtilStats)
  // console.log("courseUtl all ", this.selectedCourse)
  // console.log("current course",_currentCourse)
  if(attribute === 'courseUtil') {
    if(time === 'morning') {
      let _currentCourse = (this.courseUtilStats&&this.courseUtilStats.morningUtilization)?this.courseUtilStats.morningUtilization.filter((courseUtil: CourseUtilization)=>{
        if(courseUtil.courseId === this.selectedCourse.courseId)
          return true
      }):null;
    // console.log("courseUtl morning ", _currentCourse)
      if(_currentCourse && _currentCourse.length > 0 && _currentCourse[0].totalBooked && _currentCourse[0].totalBooked > 0) 
        return ((_currentCourse[0].totalBooked / _currentCourse[0].totalSlots ) * 100).toFixed(0) + ' %';
      else return '-';
    } else if(time === 'afternoon') {
      let _currentCourse = (this.courseUtilStats&&this.courseUtilStats.afternoonUtilization)?this.courseUtilStats.afternoonUtilization.filter((courseUtil: CourseUtilization)=>{
        if(courseUtil.courseId === this.selectedCourse.courseId)
          return true
      }):null;
    // console.log("courseUtl afternoon ", _currentCourse)
      if(_currentCourse && _currentCourse.length > 0 && _currentCourse[0].totalBooked && _currentCourse[0].totalBooked > 0) 
        return ((_currentCourse[0].totalBooked / _currentCourse[0].totalSlots ) * 100).toFixed(0) + ' %';
      else return '-';
    }
  }
}
refreshBookingStats(param?: any) {
  this.loadingBookingStats = true;
  let _fromDate = param && param.date ? moment(param.date).format("YYYY-MM-DD") : this.currentDate;
    //moment(this.calendar.currentDate).format("YYYY-MM-DD");//moment().format("YYYY-MM-DD");
    let _toDate;
    let _fromTime;
    let _toTime;
    let _isClub = param && param.isClub ? param.isClub : true;
    let _clubId = param && param.clubId ? param.clubId : '';
    let _clubCourseId = param && param.clubCourseId ? param.clubCourseId : this.courses ? this.courses[0].courseId : '';
    this.bookingStats = {};
    this.courseUtilStats = {};
    this.caddyBuggyUtilStats = {};

    this.flightService.getBookingStatsWithPlayerInfo(this.clubId,_fromDate,_fromDate, this.selectedCourse.courseId)
        .subscribe((bookingStats: BookingStatistics)=>{
          if(bookingStats) {
            // this.bookingTodayPlayers = bookingStats;
        // console.log("booking stats with player info", bookingStats)
          this.bookingStats = bookingStats;
          }
          this.flightService.getCourseUtilStats(this.clubId, _fromDate, _fromDate, this.selectedCourse.courseId)
          .subscribe((courseUtilStats: CourseUtilizationStatistics)=>{
            if(courseUtilStats) {
          // console.log("course util stats ", courseUtilStats)
            this.courseUtilStats = courseUtilStats;
            this.courseUtilStats.overallUtilization.filter((c)=>{
              if(c.courseId === this.selectedCourse.courseId) {
                this.selectedCourse.totalAvailable = c.totalSlots - c.totalBooked
              }
            })
            }

            this.flightService.getCaddyBuggyDayStats(this.clubId, _fromDate, _toDate, this.selectedCourse.courseId)
            .subscribe((caddyBuggyDayStats: CaddieBuggyStatistics)=>{
              if(caddyBuggyDayStats) { 
              // console.log("caddy buggy day stats ", caddyBuggyDayStats)
                this.caddyBuggyDayStats = caddyBuggyDayStats;
              }
            });

            this.flightService.getCaddyBuggyUtilStats(this.clubId, _fromDate, _toDate, this.selectedCourse.courseId)
            .subscribe((caddyBuggyUtilStats: CaddieBuggyAssignmentStatistics)=>{
              if(caddyBuggyUtilStats) { 
              // console.log("caddy buggy util stats ", caddyBuggyUtilStats)
                this.caddyBuggyUtilStats = caddyBuggyUtilStats;
              }
            },(error) =>{

            },()=>{
              
  this.loadingBookingStats = false;
            });

          },(error) =>{

          },()=>{
          });
        },(error) =>{
    
        })
  
}
checkTabVisiblity(type: string) {
  let _tabMode: boolean = false;
  if(this.innerWidth < 768) _tabMode = true;
  if(_tabMode && this.todayEventTab === type) return true;
  else if(!_tabMode) return true;
  else return false;
}

onBookingActionClick(bookingSlot: TeeTimeBooking) {
// console.log("refund mode?: ", this.refundMode)
    let _buttons = [];
    if(this.refundMode)
    _buttons.push({
      text: 'View Details',
      // role: 'destructive', // will always sort to be on the bottom
      // icon: 'money-refund',
      handler: () => {
        this.onBookingDetailClick(bookingSlot)
          // this.selectedSearchOpt = data
        // console.log('search opt clicked', data," - ", this.searchOptions);
        // this.onSearchInput(null)
      }
    });
      _buttons.push({
            text: 'Change Course',
            // role: 'destructive', // will always sort to be on the bottom
            // icon: 'exchange-solid',
            handler: () => {
                this.changeStartCourse(bookingSlot)
              // console.log('search opt clicked', data," - ", this.searchOptions);
            }
          });
          if(!this.refundMode && (bookingSlot.bookingStatus === 'PaymentFull' || bookingSlot.bookingStatus === 'PaymentPartial'))
          _buttons.push({
            text: 'Refund',
            // role: 'destructive', // will always sort to be on the bottom
            // icon: 'money-refund',
            handler: () => {
              this.onBookingRefundClick(bookingSlot)
                // this.selectedSearchOpt = data
              // console.log('search opt clicked', data," - ", this.searchOptions);
              // this.onSearchInput(null)
            }
          });
          
    let actionSheet = this.actionSheetCtl.create({
      buttons: _buttons
  });
  actionSheet.present();
}

changeStartCourse(bookingSlot: TeeTimeBooking) {
  // if(!this.fromClub) return false;

  let changeSlot = this.modalCtrl.create(TeeSlotListModal, {
      currentSlot: bookingSlot,
      clubId: bookingSlot.clubData.id ,
      forDate: bookingSlot.slotAssigned.teeOffDate ,
      courseId: bookingSlot.slotAssigned.startCourse.id,
      changeType: 'course'
  })

  changeSlot.onDidDismiss((data: any) => {
    // console.log("Change slot", data)
      if(data) {
          this.onChangeSlot(data.currentSlot.id, data.newSlot)
      }
  });
  changeSlot.present();
}

onChangeSlot(bookingId: number, newSlot: TeeTimeSlotDisplay) {
// console.log("call onchange slot", bookingId, newSlot)
  this.flightService.changeSlot(bookingId,newSlot)
  .subscribe((data)=>{
    // console.log("after change slot : ", data)
      if(data && data.status === 200) {
          // this.refreshBookingObject(data.json())
          this.refreshTeeSlots();
      } else if(data) {
        // console.log("get data ", data.status, data)
      }
  },(error)=>{
    // console.log("change slot error : ", error);
      let _errorBody = error.json();
      if(error.status !== 200) {
          let _message = _errorBody.errors.length>0?_errorBody.errors[0]:'This slot cannot be selected (e.g Flights checked-in, dispatched, started or finished)';
          MessageDisplayUtil.showMessageToast(_message, this.platform, this.toastCtl,3000, "bottom")
      }
    // console.log("get error", error)
  })
}

onRefundMenuClick() {
  
  this.filteredBooking = [];
  this.searchingMode = false;
  this.refundMode = true;
  this.cancelMode = false;
  this.searchQuery = null;
// console.log("on refund menu click : ", this.currentDate)
  this.refreshBookingList({
    clubId: this.clubId,
    date: this.currentDate,
    // type: 'refund',
    // clubCourseId: this.selectedCourse.courseId
  });
}

// onAdjustmentMenuClick() {
  
//   this.filteredBooking = [];
//   this.searchingMode = false;
//   this.refundMode = true;
//   this.cancelMode = false;
//   this.searchQuery = null;
// // console.log("on adjustment menu click : ", this.currentDate)
//   this.refreshBookingList({
//     clubId: this.clubId,
//     date: this.currentDate,
//     type: 'adjustment',
//     // clubCourseId: this.selectedCourse.courseId
//   });
// }


onBookingRefundClick(bookingSlot: TeeTimeBooking) {
// console.log("on booking refund click", bookingSlot)

  let _callRefund = this.navCtrl.push(RefundBookingPlayersModal, {
    currentSlot: bookingSlot,
    clubId: bookingSlot.clubData.id ,
    forDate: bookingSlot.slotAssigned.teeOffDate ,
    courseId: bookingSlot.slotAssigned.startCourse.id,
    changeType: 'course',
    currency: this.teeTimeSlotDayList[0].currency
  })

//   let refundSlot = this.modalCtrl.create(RefundBookingPlayersModal, {
//     currentSlot: bookingSlot,
//     clubId: bookingSlot.clubData.id ,
//     forDate: bookingSlot.slotAssigned.teeOffDate ,
//     courseId: bookingSlot.slotAssigned.startCourse.id,
//     changeType: 'course',
//     currency: this.teeTimeSlotDayList[0].currency

// })

// refundSlot.onDidDismiss((data: any) => {
//   // console.log("Change slot", data)
//     if(data) {
//         // this.onChangeSlot(data.currentSlot.id, data.newSlot)
//     }
// });
// refundSlot.present();
console.log("refund slot")
}

onManageVouchersClick() {
    this.navCtrl.push(ManageVoucherModal, {
      fromClub: true,
      clubInfo: this.clubInfo,
      clubId: this.clubInfo.clubId,
      currencySymbol: this.teeTimeSlotDayList[0].currency?this.teeTimeSlotDayList[0].currency:'RM',// this.clubInfo.country.currencySymbol,
  });
}


onCancelMenuClick() {
  
  this.filteredBooking = [];
  this.searchingMode = false;
  this.refundMode = false;
  this.cancelMode = true;
  this.searchQuery = null;
// console.log("on refund menu click : ", this.currentDate)
  this.refreshBookingList({
    clubId: this.clubId,
    date: this.currentDate,
    // clubCourseId: this.selectedCourse.courseId
  });


  // this.onSearchInput(null)
}


onManageCancelledBookingsClick() {

}

onViewAllBookingsClick() {
  this.navCtrl.push(ClubBookingListPage, {
    clubId: this.clubInfo.clubId
  })
}

}