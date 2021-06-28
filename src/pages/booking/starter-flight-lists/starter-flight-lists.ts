import {
  TeeTimeBookingPlayer,
  CaddyData,
  PlayerData,
  TeeTimeSlotDisplay
} from './../../../data/mygolf.data';
import {
  NavController,
  NavParams,
  LoadingController,
  Platform,
  ModalController
} from "ionic-angular";
import {
  Component,
  Renderer
} from "@angular/core";
import {
  CompetitionInfo,
  FlightInfo,
  CompetitionDetails,
  FlightMember
} from "../../../data/competition-data";
import {
  GameRoundInfo,
  createGameRoundInfo
} from "../../../data/game-round";
import {
  CompetitionService
} from "../../../providers/competition-service/competition-service";
import {
  adjustViewZIndex
} from "../../../globals";
import {
  BuggyData,
  TeeTimeFlight,
  TeeTimeBooking,
  CourseInfo
} from "../../../data/mygolf.data";

import * as moment from "moment";
import {
  NotificationHandlerInfo,
  AbstractNotificationHandlerPage
} from "../../../providers/pushnotification-service/notification-handler-constructs";
import {
  ActionSheetController
} from "ionic-angular";
import {
  TeeBuggyListPage
} from "../tee-buggy-list/tee-buggy-list";
import {
  ClubFlightService
} from "../../../providers/club-flight-service/club-flight-service";
import {
  PopoverController
} from "ionic-angular";
import {
  CourseBox
} from "../../modal-screens/course-box/course-box";
import {
  AlertController
} from "ionic-angular";
import {
  ClubService
} from '../../../providers/club-service/club-service';
import {
  ImageZoom
} from '../../modal-screens/image-zoom/image-zoom';
import {
  TeeSlotListModal
} from '../../modal-screens/tee-slot-list/tee-slot-list';
import {
  MessageDisplayUtil
} from '../../../message-display-utils';
import {
  ToastController
} from 'ionic-angular';
import { NotificationsPage } from '../../notifications/notifications';

@Component({
  templateUrl: 'starter-flight-lists.html',
  selector: 'starter-flight-lists-page'
})
export class StarterFlightListsPage {
  public competition: CompetitionInfo;
  public details: CompetitionDetails;
  public gameRound: GameRoundInfo;
  public visible: boolean;
  public flights: Array < FlightInfo > = new Array < FlightInfo > ();
  //  private flightMembers: Array<FlightMember> = new Array<FlightMember>();
  public filteredFlight: Array < FlightInfo > = new Array < FlightInfo > ();
  public searchQuery: string = '';
  itemReorder: boolean = false;
  devWidth: number;
  public teeFlightTabs: string = 'readyTab';
  public searchToggle: boolean = false;

  starterView: boolean = false;
  starterList: Array < TeeTimeFlight > = new Array < TeeTimeFlight > ();
  filteredList: Array < TeeTimeFlight > = new Array < TeeTimeFlight > ();
  public bookingFlightList: Array < TeeTimeBooking > = new Array < TeeTimeBooking > ();
  filteredBFL: Array < TeeTimeBooking > = new Array < TeeTimeBooking > ();
  currentPage: number = 0;
  nameView: boolean = false;
  showAll: boolean = false;
  today: string;
  currentDate: string;
  clubId: number;

  courses: Array < CourseInfo > ;
  public flightReadyToPlayList: Array < TeeTimeBooking > = new Array < TeeTimeBooking > ();
  public flightInPlayList: Array < TeeTimeBooking > = new Array < TeeTimeBooking > ();

  uniqFlightReadyToPlayList: Array < TeeTimeBooking > = new Array < TeeTimeBooking > ();
  uniqFlightInPlayList: Array < TeeTimeBooking > = new Array < TeeTimeBooking > ();

  totalDayFlights: number = 0;
  totalDayPlayers: number = 0;
  totalDayBuggies: number = 0;
  totalDayCaddies: number = 0;

  optionReadyFlightCourse = '';
  optionInPlayFlightCourse = '';
  optionCourse: CourseInfo;

  refresher: boolean = false;
  buggyPlayers: Array < any > ;
  userRoles: Array < string > ;

  constructor(private nav: NavController,
    private renderer: Renderer,
    private navParams: NavParams,
    private loadingCtl: LoadingController,
    private compService: CompetitionService,
    private actionSheetCtl: ActionSheetController,
    private platform: Platform,
    private flightService: ClubFlightService,
    private popoverCtl: PopoverController,
    private alertCtrl: AlertController,
    private clubService: ClubService,
    private modalCtl: ModalController,
    private toastCtl: ToastController) {

    this.competition = navParams.get("competition");
    this.flights = navParams.get("flights");
    this.gameRound = navParams.get("gameRound");
    if (!this.competition) {
      this.competition = {
        competitionId: navParams.get("competitionId")
      };
      this.flights = new Array < FlightInfo > ();
      this.gameRound = createGameRoundInfo();
      this.gameRound.roundNo = navParams.get("roundNo");
    }
    this.filteredFlight = this.flights;
    //this.flightMembers = this.flights.flightMembers;
    this.visible = false;
    this.searchQuery = '';
    this.devWidth = this.platform.width();
    this.clubId = navParams.get("clubId");
    if (!this.clubId) this.clubId = 1701051914; //28101520; //mygolf2u golf club

    this.today = moment().format("YYYY-MM-DD");
    this.currentDate = moment().format("YYYY-MM-DD");
    console.log("width: ", this.devWidth)
    this.userRoles = navParams.get("userRoles");
  }

  ionViewDidLoad() {
    // this._onViewLoaded();
    this.getFlightStarterList();
  }

  ionViewDidEnter() {
    adjustViewZIndex(this.nav, this.renderer);
  }

  getFlightStarterList() {
    // let loader = this.loadingCtl.create({
    //   content: 'Loading flights list, Please wait...',
    //   duration: 5000, 
    // });
    // loader.present().then(() => {
    this.refresher = true;
    this.flightService.getBookingFlightList(this.clubId, this.currentDate, true)
      .subscribe((dataResp: any) => {
        this.refresher = false;
        // Array < TeeTimeBooking > 

        let data = dataResp.flightList;
        this.totalDayBuggies = 0;
        this.totalDayCaddies = 0;
        this.totalDayFlights = 0;
        this.totalDayPlayers = 0;

        this.flightReadyToPlayList = [];
        this.flightInPlayList = [];
        this.uniqFlightInPlayList = [];
        this.uniqFlightReadyToPlayList = [];
        this.bookingFlightList = [];

        this.buggyPlayers = [];
        // loader.dismiss().then(() => {
        console.log("booking flight : ", data)
        if (data && data.length > 0) {
          console.log("booking flight  inside : ", data);
          this.bookingFlightList = data.filter((tb: TeeTimeBooking) => {
            return tb.bookingStatus === 'PaymentFull' && tb.flight && tb.flight.status !== 'Assigned' && tb.flight.status !== 'PlayFinished' && tb.flight.status !== 'Abandoned'
          });



          let _bookingFlightList: Array < TeeTimeBooking > = new Array < TeeTimeBooking > ();
          // _bookingFlightList = {...this.bookingFlightList};
          // _bookingFlightList = Object.assign({}, this.bookingFlightList)
          _bookingFlightList = data.filter((tb: TeeTimeBooking) => {
            return tb.bookingStatus === 'PaymentFull' && tb.flight && tb.flight.status !== 'Assigned' && tb.flight.status !== 'PlayFinished' && tb.flight.status !== 'Abandoned'
          });

          let _bg
          // _bookingFlightList.forEach((tb: TeeTimeBooking)=>{
          // })

          // this.buggyPlayers = this.getUnique(this.buggyPlayers,'buggyId');
          console.log("clone booking flight  ", _bookingFlightList)
          console.log("uniq buggy players ", this.buggyPlayers);
          // console.log("booking flight list : ", this.bookingFlightList)
          // if (this.teeFlightTabs === 'readyTab') {
          //   // this.filteredBFL = this.bookingFlightList.filter((bf)=>{
          //   //     return bf.bookingStatus === 'Secured'
          //   // })
          //   this.flightReadyToPlayList = this.bookingFlightList;
          //   this.flightReadyToPlayList.forEach((tb: TeeTimeBooking)=>{
          //     tb.bookingPlayers.sort((a,b,)=>{
          //       if(a.pairingNo < b.pairingNo) return -1;
          //       else if (a.pairingNo > b.pairingNo) return 1;
          //       else 0;
          //     })
          //   })
          // } else if (this.teeFlightTabs === 'inPlayTab') {
          //   this.flightInPlayList = this.bookingFlightList.filter((tb: TeeTimeBooking) => {
          //     return tb.flight.status === 'PlayStarted' || tb.flight.status === 'CrossedOver'
          //   })
          //   this.flightInPlayList.forEach((tb: TeeTimeBooking)=>{
          //     tb.bookingPlayers.sort((a,b,)=>{
          //       if(a.pairingNo < b.pairingNo) return -1;
          //       else if (a.pairingNo > b.pairingNo) return 1;
          //       else 0;
          //     })
          //   })
          // }
          // else if(this.teeFlightTabs === 'allTab') {
          //     this.filteredBFL = this.bookingFlightList;
          //     // this.filteredBFL = this.bookingFlightList.filter((bf)=>{
          //     //     return bf.bookingStatus === 'Booked'
          //     // })
          // }

          this.flightReadyToPlayList.push(..._bookingFlightList);
          this.flightReadyToPlayList = this.flightReadyToPlayList.filter((tb: TeeTimeBooking) => {
            return tb.flight.status === 'Dispatched'
          })
          this.flightReadyToPlayList.forEach((tb: TeeTimeBooking) => {
            tb.bookingPlayers.sort((a, b, ) => {
              if (a.pairingNo < b.pairingNo) return -1;
              else if (a.pairingNo > b.pairingNo) return 1;
              else 0;
            })
          });
          this.flightInPlayList.push(..._bookingFlightList)
          this.flightInPlayList = this.flightInPlayList.filter((tb: TeeTimeBooking) => {
            return tb.flight.status === 'PlayStarted' || tb.flight.status === 'CrossedOver'
          })
          this.flightInPlayList.forEach((tb: TeeTimeBooking) => {
            tb.bookingPlayers.sort((a, b, ) => {
              if (a.pairingNo < b.pairingNo) return -1;
              else if (a.pairingNo > b.pairingNo) return 1;
              else 0;
            })
          })


          let _countCaddy;
          let _countBuggy;
          this.bookingFlightList.forEach((p) => {

            _countCaddy = this.getUnique(p.bookingPlayers, 'caddyPairing')
            _countCaddy = _countCaddy.filter((_player: TeeTimeBookingPlayer) => {
              if (_player.caddyPairing !== 0) return true
            }).sort((a, b) => {
              if (a.caddyPairing < b.caddyPairing) return -1
              else if (a.caddyPairing > b.caddyPairing) return 1
              else return 0
            })
            this.totalDayCaddies += _countCaddy.length

            this.totalDayPlayers += p.bookingPlayers.length;

            _countBuggy = this.getUnique(p.bookingPlayers, 'pairingNo')
            _countBuggy = _countBuggy.filter((_player: TeeTimeBookingPlayer) => {
              if (_player.pairingNo !== 0) return true
            }).sort((a, b) => {
              if (a.pairingNo < b.pairingNo) return -1
              else if (a.pairingNo > b.pairingNo) return 1
              else return 0
            });
            this.totalDayBuggies += _countBuggy.length;

          })

          //   this.bookingFlightList.forEach((p)=>{
          //     this.totalDayPlayers += p.bookingPlayers.length;    
          //         p.bookingPlayers.filter((player: TeeTimeBookingPlayer)=>{
          //                 if(player.pairingNo && player.pairingNo > 0) this.totalDayBuggies += 1
          //                 if(player.caddyPairing && player.caddyPairing > 0) this.totalDayCaddies += 1
          //             })
          //     p.bookingPlayers.sort((a,b)=>{
          //         if(a.caddyPairing < b.caddyPairing ) return -1
          //         else if(a.caddyPairing > b.caddyPairing ) return 1
          //         else return 0
          //     })
          // })

          // console.log("after sort : ", this.filteredBFL)

          console.log("get flight starter - ready to play - before uniq", this.flightReadyToPlayList);
          console.log("get flight starter - in play - before uniq ", this.flightInPlayList)


          let _player;

          this.uniqFlightInPlayList.push(..._bookingFlightList);
          this.uniqFlightInPlayList = this.uniqFlightInPlayList.filter((tb: TeeTimeBooking) => {
            return tb.flight.status === 'PlayStarted' || tb.flight.status === 'CrossedOver'
          })
          this.uniqFlightInPlayList.forEach((uniqT) => {
            uniqT.bookingPlayers.sort((a, b) => {
              if (a.pairingNo < b.pairingNo) return -1
              else if (a.pairingNo > b.pairingNo) return 1
              else return 0
            })
            // uniqT.bookingPlayers = this.getUnique(uniqT.bookingPlayers,'pairingNo')
          });
          // this.uniqFlightInPlayList = this.getUnique(this.uniqFlightInPlayList.bookingPlayers,'pairingNo')
          this.uniqFlightReadyToPlayList.push(..._bookingFlightList);
          this.uniqFlightReadyToPlayList = this.uniqFlightReadyToPlayList.filter((tb: TeeTimeBooking) => {
            return tb.flight.status === 'Dispatched'
          })
          this.uniqFlightReadyToPlayList.forEach((uniqT) => {
            uniqT.bookingPlayers.sort((a, b) => {
              if (a.pairingNo < b.pairingNo) return -1
              else if (a.pairingNo > b.pairingNo) return 1
              else return 0
            })
            // t.bookingPlayers = 
            // uniqT.bookingPlayers = this.getUnique(uniqT.bookingPlayers,'pairingNo')
            // console.log('uniq t  ',
            //   this.getUnique(uniqT.bookingPlayers,'pairingNo'))
          });


          if (this.optionCourse && this.optionCourse.courseId && (this.optionCourse.courseId !== 0)) {
            this.flightInPlayList = this.flightInPlayList.filter((tb: TeeTimeBooking) => {
              return tb.slotAssigned.startCourse.id === this.optionCourse.courseId
            })
            this.flightReadyToPlayList = this.flightReadyToPlayList.filter((tb: TeeTimeBooking) => {
              return tb.slotAssigned.startCourse.id === this.optionCourse.courseId
            })

            this.uniqFlightInPlayList = this.uniqFlightInPlayList.filter((tb: TeeTimeBooking) => {
              return tb.slotAssigned.startCourse.id === this.optionCourse.courseId
            })
            this.uniqFlightReadyToPlayList = this.uniqFlightReadyToPlayList.filter((tb: TeeTimeBooking) => {
              return tb.slotAssigned.startCourse.id === this.optionCourse.courseId
            })
          }

          this.flightInPlayList.sort((a, b) => {
            if (a.slotAssigned.slotNo < b.slotAssigned.slotNo) return -1
            else if (a.slotAssigned.slotNo > b.slotAssigned.slotNo) return 1
            else 0
          });

          this.flightReadyToPlayList.sort((a, b) => {
            if (a.slotAssigned.slotNo < b.slotAssigned.slotNo) return -1
            else if (a.slotAssigned.slotNo > b.slotAssigned.slotNo) return 1
            else 0
          });

          this.uniqFlightInPlayList.sort((a, b) => {
            if (a.slotAssigned.slotNo < b.slotAssigned.slotNo) return -1
            else if (a.slotAssigned.slotNo > b.slotAssigned.slotNo) return 1
            else 0
          });

          this.uniqFlightReadyToPlayList.sort((a, b) => {
            if (a.slotAssigned.slotNo < b.slotAssigned.slotNo) return -1
            else if (a.slotAssigned.slotNo > b.slotAssigned.slotNo) return 1
            else 0
          })


          this.totalDayFlights = this.bookingFlightList.length;

          console.log("get flight starter - caddy", _countCaddy)
          console.log("get flight starter - buggy", _countBuggy)

          console.log("get flight starter - ready to play", this.flightReadyToPlayList);
          console.log("get flight starter - in play ", this.flightInPlayList)

          console.log("get flight starter - uniq ready to play ", this.uniqFlightReadyToPlayList);
          console.log("get flight starter - uniq in play ", this.uniqFlightInPlayList);

          console.log("booking flight  inside : ", data);
          console.log("get flight starter - booking flight list all ", this.bookingFlightList);
        }

        // })

      }, (error) => {
        this.refresher = false;
      })
    // })


  }
  getNotifications(): Array < NotificationHandlerInfo > {
    let notifications = new Array < NotificationHandlerInfo > ();
    notifications.push({
      type: AbstractNotificationHandlerPage.TYPE_FLIGHTS_GENERATED,
      whenActive: 'showToast',
      needRefresh: true
    });
    notifications.push({
      type: AbstractNotificationHandlerPage.TYPE_FLIGHTS_CHANGED,
      whenActive: 'showToast',
      needRefresh: true
    });
    return notifications;
  }
  refreshPage(pushData: any) {
    let compId = pushData.competitionId;
    let roundNo = pushData.roundNo;
    if (this.competition.competitionId === compId) {
      this.onRefreshClick(null);
    } else {
      this.competition.competitionId = compId;
      this.competition.competitionName = null;
      this.gameRound.roundNo = roundNo;
      this._onViewLoaded();
    }
  }
  private _onViewLoaded() {
    if (!this.competition.competitionName) {
      let loader = this.loadingCtl.create({
        content: "Loading...",
        duration: 5000,
      });

      loader.present().then(() => {
        this.compService.getCompetitionInfo(this.competition.competitionId)
          .subscribe((comp: CompetitionInfo) => {
            this.competition = comp;
            this.compService.getDetails(this.competition.competitionId)
              .subscribe((det: CompetitionDetails) => {
                this.details = det;
                let ground = det.gameRounds.filter((gr: GameRoundInfo) => {
                  return gr.roundNo === this.gameRound.roundNo
                }).pop();
                this.gameRound = ground;
                this.compService.getFlights(this.competition.competitionId, this.gameRound.roundNo)
                  .subscribe((flights: Array < FlightInfo > ) => {
                    loader.dismiss().then(() => {
                      this.flights = flights;
                      this.filteredFlight = this.flights;
                      this.searchQuery = "";
                      this.onSearchCancel();
                      console.log(this.flights)
                    })

                  }, (error) => {
                    loader.dismiss();
                  }, () => {

                  });
              }, (error) => {
                loader.dismiss();
              });
          }, (error) => {
            loader.dismiss();
          });
      });
    }
  }
  onRefreshClick(refresher) {
    // this.refreshFlights(refresher);
    this.getFlightStarterList();
  }

  toggle(searchBar) {
    this.visible = searchBar; //!this.visible;
  }

  onSearchCancel() {
    this.toggle(false);
  }

  onSearchInput(searchbar) {
    this.filteredFlight = this.flights.filter((fp: FlightInfo, idx: number) => {
      let count = fp.flightMembers.filter((fm: FlightMember) => {
        return fm.playerName.toLowerCase().indexOf(this.searchQuery.toLowerCase()) >= 0;
      }).length;
      return count > 0;
    });
  }

  onHomeClick() {
    this.nav.popToRoot(); //this.nav.setRoot(PlayerHomePage);
  }

  private refreshFlights(refresher) {

    let loader = this.loadingCtl.create({
      content: 'Loading flights list, Please wait...',
      duration: 5000,
    });
    if (loader)
      loader.present().then(() => {

        this.flightService.getBookingFlightList(this.clubId, this.currentDate, true)
          .subscribe((data: Array < TeeTimeBooking > ) => {
            if (data && data.length > 0) {
              this.bookingFlightList = data.filter((tb: TeeTimeBooking) => {
                return tb.bookingStatus === 'PaymentFull' && tb.flight.status === 'Dispatched'
              })
              this.flightReadyToPlayList = this.bookingFlightList;


            }
          });
        // this.compService.getFlights(this.competition.competitionId, this.gameRound.roundNo)
        //     .subscribe((flights: Array<FlightInfo>) => {
        //         loader.dismiss().then(() => {
        //             this.flights        = flights;
        //             this.filteredFlight = this.flights;
        //             this.searchQuery    = "";
        //             this.onSearchCancel();
        //         })

        //     }, (error) => {

        //     }, () => {
        //         if (refresher) refresher.complete();

        //         if (loader)
        //             loader.dismiss();
        //     });
      });

  }

  convStartTime(flightTime: string) {
    let teeTime = moment(flightTime, 'HH:mm:ss').format("HH:mm")
    // console.log("[Tee Time] flightTime ",flightTime)
    // console.log("[Tee Time] teeTime : ",teeTime)
    // return moment(teeTime).format("HH:mm")
    return teeTime
  }





  goFlightUpdate(flight: TeeTimeBooking) {


    let _buttons;
    if (flight && (flight.flight.status === 'Dispatched')) {
      _buttons = [{
          text: 'Change Start Course',
          // role: 'destructive', // will always sort to be on the bottom
          // icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            let changeSlot = this.modalCtl.create(TeeSlotListModal, {
              currentSlot: flight,
              clubId: this.clubId,
              forDate: this.currentDate,
              courseId: flight.slotAssigned.startCourse.id,
              changeType: 'course'
            })

            changeSlot.onDidDismiss((data: any) => {
              this.onChangeSlot(data.currentSlot.id, data.newSlot)
            });
            changeSlot.present();
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Move flight to ...',
          // role: 'destructive', // will always sort to be on the bottom
          // icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            let changeSlot = this.modalCtl.create(TeeSlotListModal, {
              currentSlot: flight,
              clubId: this.clubId,
              forDate: this.currentDate,
              courseId: flight.slotAssigned.startCourse.id,
              changeType: 'slot'
            })

            changeSlot.onDidDismiss((data: any) => {
              this.onMoveSlot(data.currentSlot.id, data.newSlot)
            });
            changeSlot.present();
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Close',
          role: 'destructive', // will always sort to be on the bottom
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            console.log('Cancel clicked');
          }
        },
      ]
    }
    // else if(flight && ( flight.flight.status === 'Dispatched' )) {
    //   _buttons = [
    //     {
    //       text: 'Move Flight',
    //       role: 'destructive', // will always sort to be on the bottom
    //       icon: !this.platform.is('ios') ? 'close' : null,
    //       handler: () => {
    //         console.log('Cancel clicked');
    //       }
    //     },
    //     {
    //       text: 'Change Course',
    //       role: 'destructive', // will always sort to be on the bottom
    //       icon: !this.platform.is('ios') ? 'close' : null,
    //       handler: () => {
    //         console.log('Cancel clicked');
    //       }
    //     }
    //   ]
    // }
    let actionSheet = this.actionSheetCtl.create({
      buttons: _buttons
    });

    actionSheet.present();
  }

  toggleReorder() {
    this.itemReorder = !this.itemReorder;
  }

  // goFlightDetail(flightNo: number) {
  //   this.nav.push(TeeBuggyListPage, {
  //     flightNumber: flightNo
  //   });
  // }

  openCourse() {
    let actionSheet = this.actionSheetCtl.create({
      buttons: [

        {
          text: 'First Nine',
          // role: 'cancel', // will always sort to be on the bottom
          // icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            actionSheet.dismiss();
            return false;
          }
        },
        {
          text: 'Second Nine',
          // role: 'cancel', // will always sort to be on the bottom
          // icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            actionSheet.dismiss();
            return false;
          }
        },
        {
          text: 'Third Nine',
          // role: 'cancel', // will always sort to be on the bottom
          // icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            actionSheet.dismiss();
            return false;
          }
        },
        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            actionSheet.dismiss();
            return false;
          }
        },
      ]
    });
    actionSheet.present();
  }

  setBagClass(x, y) {
    // x % 2 === 0 && 
    if (y === 'left')
      return "bag-left";
    // x % 2 === 1 && 
    else if (y === 'right') return "bag-right";
  }

  switchView() {
    this.starterView = !this.starterView
  }

  nextDate() {
    this.currentDate = moment(this.currentDate).add(1, 'days').format("YYYY-MM-DD");
    // this.getFlightStarterList();
  }

  prevDate() {
    this.currentDate = moment(this.currentDate).subtract(1, 'days').format("YYYY-MM-DD");
    // this.getFlightStarterList();
  }

  confirmDate() {
    this.getFlightStarterList();
  }

  prevPage() {
    if (moment(this.currentDate).toDate() > moment(this.today).toDate()) return 1;
  }

  onSelectCourse(event) {
    this.clubService.getClubCourses(this.clubId)
      .subscribe((courses: Array < CourseInfo > ) => {
        console.log("get club courses : ", courses)
        let popover = this.popoverCtl.create(CourseBox, {
          fromStarterList: true,
          courses: courses
        });
        popover.onDidDismiss((data: CourseInfo) => {

          // this.getFlightStarterList();
          if (data) {
            this.optionCourse = {};
            // this.gameInfo.courses.push(data);
            console.log("select course - data : ", data)
            this.optionCourse = data;
            this.getFlightStarterList();

            // if(this.optionCourse && this.optionCourse.courseId) {
            //   this.flightInPlayList = this.flightInPlayList.filter((tb:TeeTimeBooking)=>{
            //     return tb.slotAssigned.startCourse.id === data.courseId
            //   })
            //   this.flightReadyToPlayList = this.flightReadyToPlayList.filter((tb:TeeTimeBooking)=>{
            //     return tb.slotAssigned.startCourse.id === data.courseId
            //   })
            // } 
            // else if(this.optionCourse.courseId === 0) this.getFlightStarterList();

          }
          // else this.getFlightStarterList();
        });
        popover.present({
          ev: event
        });
      })

  }

  getTeeOffTime(teeOffTime: any) {
    // let _teeTime: string = '';
    // _teeTime = teeOffTime.hour + ":" + teeOffTime.minute;
    return moment(teeOffTime, 'HH:mm:ss').format("hh:mm A");
  }

  getPlayerSlot(player: TeeTimeBookingPlayer, attribute: string) {
    switch (attribute) {
      case 'name':
        return player.playerName ? player.playerName : '';
      case 'image':
        return player.player && player.player.profile ? player.player.profile : player.player.image;
    }
  }

  getCaddySlot(player: TeeTimeBookingPlayer, attribute: string) {
    switch (attribute) {
      case 'name':
        return player.caddyAssigned && player.caddyAssigned.firstName ? player.caddyAssigned.firstName : '';
      case 'image':
        return player.caddyAssigned && player.caddyAssigned.caddyImage ? player.caddyAssigned.caddyImage : '';
      case 'id':
        return player.caddyAssigned && player.caddyAssigned.staffId ? player.caddyAssigned.staffId : '';
      case 'check':
        // console.log('caddy check - ', player)
        return player.caddyAssigned;
    }
  }

  onStartFlight(flight: TeeTimeBooking) {
    if (flight && flight.flight.status !== 'Dispatched') return false;
    let alert = this.alertCtrl.create({
      title: 'Starting Flight',
      message: 'Starting flight at ' + moment(flight.slotAssigned.teeOffTime, "HH:mm:ss").format('hh:mm A') + '.<br>Do you want to proceed ?',
      buttons: [{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.goStartFlight(flight);
            console.log('Buy clicked');
          }
        }
      ]
    });
    alert.present();
  }

  goStartFlight(flight: TeeTimeBooking) {
    let _bookingId;
    if (flight && flight.id) _bookingId = flight.id;
    let loader = this.loadingCtl.create({
      content: 'Starting flight, Please wait...',
      duration: 5000,
    });

    loader.present().then(() => {
      this.flightService.updateBookingFlightStatus(_bookingId, 'PlayStarted')
        .subscribe((data) => {
          loader.dismiss().then(() => {
            if (data && data.status === 200) {
              this.getFlightStarterList();
            }
          })

        }, (error) => {

        })
    })

  }

  onCrossoverFlight(flight: TeeTimeBooking) {
    console.log("crossover flight", flight)
    if (flight && (flight.flight.status === 'CrossedOver' || flight.flight.status === 'PlayFinished')) return false;
    let alert = this.alertCtrl.create({
      title: 'Flight Crossover',
      message: 'Flight crossover at ' + moment().format('hh:mm A') + '.<br>Set status to Crossed Over ?',
      buttons: [{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.goCrossoverFlight(flight);
            console.log('Buy clicked');
          }
        }
      ]
    });
    alert.present();
  }

  goCrossoverFlight(flight: TeeTimeBooking) {
    let _bookingId;
    if (flight && flight.id) _bookingId = flight.id;
    let loader = this.loadingCtl.create({
      content: 'Updating flight for crossover, Please wait...',
      duration: 5000,
    });

    loader.present().then(() => {
      this.flightService.updateBookingFlightStatus(_bookingId, 'CrossedOver')
        .subscribe((data) => {
          loader.dismiss().then(() => {
            if (data && data.status === 200) {
              this.getFlightStarterList();
            }
          })

        }, (error) => {
          loader.dismiss();
        })
    })

  }

  getClubCourseList() {
    this.clubService.getClubCourses(this.clubId)
      .subscribe((data) => {
        console.log("get club courses : ", data)
      })
  }

  onFinishFlight(flight: TeeTimeBooking) {
    console.log("finish flight", flight)
    if (flight && (flight.flight.status === 'PlayFinished')) return false;
    let alert = this.alertCtrl.create({
      title: 'Flight Finishing',
      message: 'Flight finishing at ' + moment().format('hh:mm A') + '.<br>Set status to Finished ?',
      buttons: [{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.goFinishFlight(flight);
            console.log('Buy clicked');
          }
        }
      ]
    });
    alert.present();
  }

  goFinishFlight(flight: TeeTimeBooking) {
    let _bookingId;
    if (flight && flight.id) _bookingId = flight.id;
    let loader = this.loadingCtl.create({
      content: 'Finishing flight, Please wait...',
      duration: 5000,
    });

    loader.present().then(() => {
      this.flightService.updateBookingFlightStatus(_bookingId, 'PlayFinished')
        .subscribe((data) => {
          loader.dismiss().then(() => {
            if (data && data.status === 200) {
              this.getFlightStarterList();
            }
          })

        }, (error) => {
          loader.dismiss();
        })
    })

  }

  getFlightStatusTime(flight: TeeTimeBooking, attribute: string) {
    let _time;
    console.log("get flight status time : ",flight.flight)
    switch (attribute) {
      case 'crossover':
        _time = flight && flight.flight.flightCrossedOverAt ? moment(flight.flight.flightCrossedOverAt, "YYYY-MM-DDTHH:mm:ss").format('hh:mm A') : null;
        break;
      case 'started':
        _time = flight && flight.flight.playStartedAt ? moment(flight.flight.playStartedAt, "YYYY-MM-DDTHH:mm:ss").format('hh:mm A') : null;
        break;
      case 'dispatched':
        _time = flight && flight.flight.flightDispachedAt ? moment(flight.flight.flightDispachedAt, "YYYY-MM-DDTHH:mm:ss").format('hh:mm A') : null;
        break;
      case 'finished':
        _time = flight && flight.flight.flightFinishedAt ? moment(flight.flight.flightFinishedAt, "YYYY-MM-DDTHH:mm:ss").format('hh:mm A') : null;
        break;
    }
    return _time;
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

  getFlightStatus(flight: TeeTimeBooking) {
    let _flightStatus;

    if (flight && flight.flight) _flightStatus = flight.flight.status;
    else if (flight && !flight.flight) _flightStatus = flight.bookingStatus;
    else _flightStatus = flight.bookingStatus;


    //         export type TeeTimeBookingStatus = "Booked" | "Secured" | "CancelledByPlayer" | "CancelledByClub" | "PaymentPartial" | "PaymentFull" | "FlightRegistered" | "RefundInitiated" | "RefundCompleted";

    // export type TeeTimeFlightStatus = "Created" | "Assigned" | "Dispatched" | "PlayStarted" | "CrossedOver" | "Abandoned" | "PlayFinished";



    if (_flightStatus === 'PlayStarted') _flightStatus = 'Started';
    else if (_flightStatus === 'Dispatched') _flightStatus = 'Dispatched';
    else if (_flightStatus === 'CrossedOver') _flightStatus = 'Crossed Over';
    else if (_flightStatus === 'PlayFinished') _flightStatus = 'Finished';
    else if (_flightStatus === 'PaymentFull') _flightStatus = 'Paid in Full';
    else if (_flightStatus === 'PaymentPartial') _flightStatus = 'Partially Paid';
    else if (_flightStatus === 'CancelledByPlayer') _flightStatus = 'Player Cancelled';
    else if (_flightStatus === 'CancelledByClub') _flightStatus = 'Club Cancelled';

    return _flightStatus;

    // if(flight && flight.flight) return flight.flight.status;
    // else if (flight && !flight.flight) return flight.bookingStatus;
    // else return flight.bookingStatus;
  }

  showDetailsCaddie(player: TeeTimeBookingPlayer) {
    let _caddie: CaddyData = player.caddyAssigned ? player.caddyAssigned : player.caddyPreferred;

    let imageZoom = this.modalCtl.create(ImageZoom, {
      image: _caddie.caddyImage ? _caddie.caddyImage : ''
    })

    imageZoom.onDidDismiss((data: any) => {});
    imageZoom.present();
  }

  showDetailsPlayer(player: TeeTimeBookingPlayer) {
    let _player: PlayerData = player.player;
    let imageZoom = this.modalCtl.create(ImageZoom, {
      image: _player.image ? _player.image : _player.profile
    })

    imageZoom.onDidDismiss((data: any) => {});
    imageZoom.present();
  }

  goFlightDetail(teeTimeBooking: TeeTimeBooking, flightNo ? : number) {
    // if(!teeTimeBooking.flight) {
    //     MessageDisplayUtil.showMessageToast('There is no flight created yet', 
    //     this.platform, this.toastCtl,3000, "bottom")
    //     return false;
    // }
    this.nav.push(TeeBuggyListPage, {
      teeTimeBooking: teeTimeBooking,
      flightNumber: flightNo,
      caddieMaster: false
    });
  }


  /**************VIEW BUGGY METHODS START ******************************/
  // onSelectCaddyList(x?: TeeTimeBookingPlayer) {
  //   let _currentDate = this.teeTimeBooking.slotAssigned.teeOffDate;
  //   let _currentCaddyPlayers;

  //   let _caddiesToExclude: Array<TeeTimeBookingPlayer> = this.getUnique(this.teeTimeBooking.bookingPlayers, 'caddiesAssigned');
  //   console.log('caddies to exclude - all flight', this.flightPlayers)
  //   console.log("caddies to exclude ", _caddiesToExclude)

  //   let alert = this.alertCtrl.create({
  //       title: 'Caddie Change',
  //       // subTitle: 'Selected date is '+ _date,
  //       message: 'This process will change current caddie. Do you want to proceed?', //'Selected date is ' + '<b>' + _date + '</b>',
  //       buttons: [{
  //                       text: 'No',
  //                       handler: () => {
  //                           // console.log('Cancel clicked');
  //                       }
  //                   },
  //                   {
  //                       text: 'Yes',
  //                       handler: () => {
  //                           let _caddyList = this.modalCtl.create(CaddyListPage, 
  //                               {
  //                               changeCaddie: true,
  //                               currentDate: _currentDate,
  //                               clubId: this.teeTimeBooking.clubData.id,
  //                               caddiesToExclude: _caddiesToExclude 
  //                               })

  //                               _caddyList.onDidDismiss((data: any) => {
  //                                   if(data && data.selected) {
  //                                       console.log("caddie selected", data)
  //                                       _currentCaddyPlayers = this.teeTimeBooking.bookingPlayers.filter((player: TeeTimeBookingPlayer)=>{
  //                                           return player.caddyPairing === x.caddyPairing
  //                                       })
  //                                       .map((player: TeeTimeBookingPlayer)=>{
  //                                           return player.id
  //                                       })

  //                                       this.onChangeCaddie(this.teeTimeBooking.id,_currentCaddyPlayers,data.caddy.id)

  //                                       // this.goPayNow();
  //                                   } else console.log("buggy not selected", data, _currentCaddyPlayers)
  //                                   console.log('flight player', x);
  //                                   console.log('flight playerS', this.flightPlayers)
  //                               });
  //                               _caddyList.present();
  //                           // this.nav.push(BuggyListPage)
  //                           // console.log('Cancel clicked');
  //                       }
  //                   },
  //               ]
  //   });
  //   alert.present();
  //   // this.nav.push(CaddyListPage)
  // }
  // onSelectBuggyList(x?: TeeTimeBookingPlayer) {
  //   let _currentDate = this.teeTimeBooking.slotAssigned.teeOffDate;
  //   let _currentBuggyPlayers;
  //   let alert = this.alertCtrl.create({
  //       title: 'Buggy Change',
  //       // subTitle: 'Selected date is '+ _date,
  //       message: 'This process will change current buggy. Do you want to proceed?', //'Selected date is ' + '<b>' + _date + '</b>',
  //       buttons: [{
  //                       text: 'No',
  //                       handler: () => {
  //                           // console.log('Cancel clicked');
  //                       }
  //                   },
  //                   {
  //                       text: 'Yes',
  //                       handler: () => {
  //                           let _buggyList = this.modalCtl.create(BuggyListPage, 
  //                               {
  //                               changeBuggy: true,
  //                               currentDate: _currentDate,
  //                               clubId: this.teeTimeBooking.clubData.id
  //                               })

  //                               _buggyList.onDidDismiss((data: any) => {
  //                                   if(data && data.selected) {
  //                                       console.log("buggy selected", data)
  //                                       _currentBuggyPlayers = this.teeTimeBooking.bookingPlayers.filter((player: TeeTimeBookingPlayer)=>{
  //                                           return player.pairingNo === x.pairingNo
  //                                       })
  //                                       .map((player: TeeTimeBookingPlayer)=>{
  //                                           return player.id
  //                                       })

  //                                       this.onChangeBuggy(this.teeTimeBooking.id,_currentBuggyPlayers,data.buggy.id)

  //                                       // this.goPayNow();
  //                                   } else console.log("buggy not selected", data, _currentBuggyPlayers)
  //                                   console.log('flight player', x);
  //                                   console.log('flight playerS', this.flightPlayers)
  //                               });
  //                               _buggyList.present();
  //                           // this.nav.push(BuggyListPage)
  //                           // console.log('Cancel clicked');
  //                       }
  //                   },
  //               ]
  //   });
  //   alert.present();
  // }

  getTeeOffTimeBuggy(teeOffTime: any) {
    let _teeTime: string = '';
    // _teeTime = teeOffTime.hour + ":" + teeOffTime.minute;
    _teeTime = moment(teeOffTime, 'HH:mm:ss').format('hh:mm A')
    return _teeTime;
  }

  setCaddyAssigned(x: TeeTimeBookingPlayer, attribute: string) {
    // let _slot = slot - 1;
    // console.log("set caddy assigned : ", x)
    let bookingPlayer: TeeTimeBookingPlayer = x;
    // bookingPlayer = x;

    if (bookingPlayer.caddyAssigned !== null && bookingPlayer.caddyAssigned) {
      // if(attribute === 'assigned?')
      // if(bookingPlayer.caddyAssigned || bookingPlayer.caddyAssigned !== null) return true
      // else return false
      let caddyAssigned: CaddyData;
      caddyAssigned = (bookingPlayer.caddyAssigned) ? bookingPlayer.caddyAssigned : null;

      switch (attribute) {
        case 'name':
          return caddyAssigned.firstName
          // break
        case 'id':
          return caddyAssigned.staffId
          // break
        case 'image':
          return caddyAssigned.caddyImage
          // break
        case 'assigned?':
          if (caddyAssigned) return true
          else return false
      }
    } else return false;

  }


  getBuggyNumber(flight: TeeTimeBooking, x ? : TeeTimeBookingPlayer, playerIdx ? : number) {
    let _flight = flight;
    let filteredBuggy;
    if (flight && flight.buggiesAssigned) {
      filteredBuggy = flight.buggiesAssigned.filter((buggy: BuggyData) => {
        return buggy.id === x.buggyId
      })
    } else filteredBuggy = [];
    // flight.bookingPlayers.forEach((p: TeeTimeBookingPlayer, pidx: number,pArray: Array<TeeTimeBookingPlayer>)=>{

    // })
    // console.log("get buggy number", filteredBuggy, x, this.flightBuggies)
    return filteredBuggy[0] && filteredBuggy[0].buggyNo ? filteredBuggy[0].buggyNo : 'n/a'
  }

  checkBuggy(flight: TeeTimeBooking, x ? : TeeTimeBookingPlayer, playerIdx ? : number) {
    //  flight.bookingPlayers.forEach((p: TeeTimeBookingPlayer, pidx: number,pArray: Array<TeeTimeBookingPlayer>)=>{
    //    if(pidx === 0) {
    //     pArray[pidx-1].buggyId === pArray[pidx].buggyId
    //    }
    //   })
    // console.log("checkBuggy", flight, x, playerIdx);
    let _buggy;
    // flight.bookingPlayers.every((p: TeeTimeBookingPlayer, pidx: number,pArray: Array<TeeTimeBookingPlayer>)=>{
    //   if(playerIdx === pidx) {
    //     if(playerIdx > 0 && p.buggyId && pArray[playerIdx].buggyId) {
    //       if(pArray[playerIdx-1].buggyId === pArray[playerIdx].buggyId)
    //       _buggy = true
    //       else _buggy = false;
    //      } _buggy = false;
    //   }

    // })

    if (playerIdx > 0) {
      console.log("playeridx : ", playerIdx, " >> ", flight.bookingPlayers[playerIdx].buggyId, " - ", flight.bookingPlayers[playerIdx - 1].buggyId)
      if (flight.bookingPlayers[playerIdx].buggyId === null) _buggy = true
      else if ((flight.bookingPlayers[playerIdx].buggyId !== null || flight.bookingPlayers[playerIdx - 1].buggyId !== null) &&
        flight.bookingPlayers[playerIdx].buggyId === flight.bookingPlayers[playerIdx - 1].buggyId) _buggy = false
      else _buggy = true
      console.log("1 - ", _buggy)
    } else _buggy = true;
    console.log("2 - ", _buggy)
    return true;
  }

  onChangeBuggy(bookingId: number, bookingPlayersId: Array < number > , buggyId: number) {
    console.log("on change buggy", bookingId, bookingPlayersId, buggyId)
    let _bookingId;
    if (bookingId) _bookingId = bookingId;
    let _bookingPlayersId;
    if (bookingPlayersId) _bookingPlayersId = bookingPlayersId;
    let _buggyId;
    if (buggyId) _buggyId = buggyId;

    let loader = this.loadingCtl.create({
      content: "Changing buggy..."
    });

    loader.present().then(() => {
      this.flightService.changeBuggy(_bookingId, _bookingPlayersId, _buggyId)
        .subscribe((data) => {
          console.log("change buggy", data)
          if (data && data.resp.status === 200) {
            // this.onRefreshFlight(data.bookingObject,loader);
          }
        }, (error) => {
          loader.dismiss()
        })
    })
  }

  onChangeCaddie(bookingId: number, bookingPlayersId: Array < number > , caddieId: number) {
    console.log("on change buggy", bookingId, bookingPlayersId, caddieId)
    let _bookingId;
    if (bookingId) _bookingId = bookingId;
    let _bookingPlayersId;
    if (bookingPlayersId) _bookingPlayersId = bookingPlayersId;
    let _caddieId;
    if (caddieId) _caddieId = caddieId;
    let loader = this.loadingCtl.create({
      content: "Changing caddie..."
    });

    loader.present().then(() => {
      this.flightService.changeCaddy(_bookingId, _bookingPlayersId, _caddieId)
        .subscribe((data) => {
          // console.log("change caddy", data)
          if (data && data.resp.status === 200) {
            // this.onRefreshFlight(data.bookingObject, loader);
          }
        }, (error) => {
          loader.dismiss();
        })
    })



  }

  // onRefreshFlight(teeTimeBooking: TeeTimeBooking,loader?: any) {
  //   this.teeTimeBooking = teeTimeBooking;
  //   this.bookingPlayers = [];
  //   this.flightPlayers = [];
  //   this._buggyPlayers = [];
  //   this.bookingPlayers.push(...this.teeTimeBooking.bookingPlayers);
  //   if(this.teeTimeBooking) {
  //       this.flightBuggies = this.teeTimeBooking.buggiesAssigned;
  //       this.slotAssigned = this.teeTimeBooking.slotAssigned;
  //   }

  //   this.flightPlayers = this.bookingPlayers; //this.teeTimeBooking.bookingPlayers;
  //   this.flightPlayers.sort((a,b)=>{
  //       if(a.pairingNo < b.pairingNo ) return -1
  //       else if(a.pairingNo > b.pairingNo ) return 1
  //       else return 0
  //   })
  //   this.flightPlayers = this.getUnique(this.flightPlayers,'pairingNo')


  //   this._buggyPlayers = this.teeTimeBooking.bookingPlayers;
  //   this._buggyPlayers.sort((a,b)=>{
  //       if(a.pairingNo < b.pairingNo ) return -1
  //       else if(a.pairingNo > b.pairingNo ) return 1
  //       else return 0
  //   })

  //   if (this.flightPlayers[0].pairingNo === 0) this.flightPlayers.shift();

  //   loader.dismiss();
  // }


  getPlayerName_(flight: TeeTimeBooking, x: TeeTimeBookingPlayer, y: string, idx ? : number) {
    let _flightPlayers = flight.bookingPlayers;
    let playerName: string = '';
    let _playerImage: string = '';
    let _filteredBuggy: Array < any > ;
    // console.log("get player name ", this._buggyPlayers, " -----" , x)
    if (y !== 'leftImage' && y != 'rightImage') {
      if (_flightPlayers)
        _filteredBuggy = _flightPlayers.filter((v, i) => {
          return v.pairingNo === x.pairingNo
        })
      _filteredBuggy.forEach((fb: TeeTimeBookingPlayer, ix) => {
        if (ix === 0 && y === 'left') playerName = fb.player.playerName
        if (ix === 1 && y === 'right') playerName = fb.player.playerName
      })


      // console.log("get player name AFTER ", this._buggyPlayers, " -----" , x, _filteredBuggy)

      return playerName ? playerName : '';
    } else {
      if (_flightPlayers)
        _filteredBuggy = _flightPlayers.filter((v, i) => {
          return v.pairingNo === x.pairingNo
        })
      _filteredBuggy.forEach((fb: TeeTimeBookingPlayer, ix) => {
        if (ix === 0 && y === 'leftImage') playerName = fb.player.profile ? fb.player.profile : fb.player.image
        if (ix === 1 && y === 'rightImage') playerName = fb.player.profile ? fb.player.profile : fb.player.image
      })


      return playerName ? playerName : '';
    }

  }

  onPlayerCheck(flight: TeeTimeBooking, player: TeeTimeBookingPlayer, y: string, idx: number) {
    let _flightPlayers = flight.bookingPlayers;
    let _item;
    let _name;
    let _image;
    let _filteredBuggy: Array < any > ;
    if (flight && _flightPlayers) {
      _filteredBuggy = _flightPlayers.filter((v, i) => {
        return v.pairingNo === player.pairingNo
      })
      _filteredBuggy.forEach((fb: TeeTimeBookingPlayer, ix) => {
        if (ix === 0 && y === 'left') {
          _item = true
        }
        if (ix === 1 && y === 'right') {
          _item = true
        }
      })
    }



    if (!_item || _item === null) return false;
    else {
      if (y === 'left')
        return true;
      // x % 2 === 1 && 
      else if (y === 'right') return true;
    }
  }

  getCaddyPlayer(flight: TeeTimeBooking, x: TeeTimeBookingPlayer, y: string, attribute: string, idx ? : number) {
    let _flightPlayers = flight.bookingPlayers;
    let _item;
    let _name;
    let _image;
    let _filteredBuggy: Array < any > ;
    if (flight && _flightPlayers) {
      _filteredBuggy = _flightPlayers.filter((v, i) => {
        return v.pairingNo === x.pairingNo
      });

      _filteredBuggy = _filteredBuggy.filter((fb: TeeTimeBookingPlayer, ix) => {
        return ix === idx
      });
    }
    if (!_filteredBuggy) _filteredBuggy = [];
    let _caddyAssigned: CaddyData = _filteredBuggy[0] && _filteredBuggy[0].caddyAssigned ? _filteredBuggy[0].caddyAssigned : null;
    let _caddyPreferred: CaddyData = _filteredBuggy[0] && _filteredBuggy[0].caddyPreferred ? _filteredBuggy[0].caddyPreferred : null;
    _item = _filteredBuggy[0] && _caddyAssigned ? _caddyAssigned.staffId : _caddyPreferred ? _caddyPreferred.staffId : '';
    _name = _filteredBuggy[0] && _caddyAssigned ? _caddyAssigned.firstName : _caddyPreferred ? _caddyPreferred.firstName : '';
    _image = _filteredBuggy[0] && _caddyAssigned ? _caddyAssigned.caddyImage : _caddyPreferred ? _caddyPreferred.caddyImage : '';

    switch (attribute) {
      case 'id':
        return _item ? '# ' + _item : '';
      case 'name':
        return _name;
      case 'image':
        return _image;
      case 'leftImage':
        return _image;
      case 'rightImage':
        return _image;
      case 'check':
        return _caddyAssigned || _caddyPreferred ? true : false;
      case 'checkClass':
        return _caddyAssigned || _caddyPreferred ? 'buggy-caddie-name' : '';

    }
  }

  getUserRoles(type ? : string) {
    let _rolesAllowed;
    let _userRole;
    console.log("course starter - get user roles", this.userRoles, type)
    if (this.userRoles && this.userRoles.length > 0) {
      _userRole = this.userRoles.filter((role: any) => {
        if (!role) return false;
        // || !role.authority
        // console.log("roles : ", role)
        // return role.toLowerCase().includes(type.toLowerCase());
        if (type === 'caddie_master') {
          _rolesAllowed = (role.toLowerCase() === "ROLE_CADDY_MASTER".toLowerCase()) || (role.toLowerCase() === 'ROLE_ADMIN'.toLowerCase())
          return _rolesAllowed
        } else if (type === 'course_starter') {
          _rolesAllowed = (role.toLowerCase() === 'ROLE_COURSE_STARTER'.toLowerCase()) || (role.toLowerCase() === 'ROLE_CADDY_MASTER'.toLowerCase()) || 
          (role.toLowerCase() === 'ROLE_ADMIN'.toLowerCase()) ;
          return _rolesAllowed
        }
      });
    }
    if (_userRole && _userRole.length > 0) {
      // && (page !== 'caddy_reviews' && page !== 'caddy_schedules' && page !== 'caddy_assignments')
      return true
    }
  }

  /****************VIEW BUGGY ENDS ************************************ */
  onChangeSlot(bookingId: number, newSlot: TeeTimeSlotDisplay) {
    console.log("call onchange slot", bookingId, newSlot)
    this.flightService.changeSlot(bookingId, newSlot)
      .subscribe((data) => {
        console.log("after change slot : ", data)
        if (data && data.status === 200) {
          this.getFlightStarterList();
        } else if (data) {
          console.log("get data ", data.status, data)
        }
      }, (error) => {
        if (error.status !== 200) {
          MessageDisplayUtil.showMessageToast('This slot cannot be selected (e.g Flights checked-in, dispatched, started or finished)', this.platform, this.toastCtl, 3000, "bottom")
        }
        console.log("get error", error)
      })
  }

  onMoveSlot(bookingId: number, newSlot: TeeTimeSlotDisplay) {
    console.log("call onchange slot", bookingId, newSlot)
    this.flightService.moveSlot(bookingId, newSlot)
      .subscribe((data) => {
        console.log("after change slot : ", data)
        if (data && data.status === 200) {
          this.getFlightStarterList();
        } else if (data) {
          console.log("get data ", data.status, data)
        }
      }, (error) => {
        if (error.status !== 200) {
          MessageDisplayUtil.showMessageToast('This slot cannot be selected (e.g Flights checked-in, dispatched, started or finished)', this.platform, this.toastCtl, 3000, "bottom")
        }
        console.log("get error", error)
      })
  }
  onNotificationsClick() { 
    this.nav.push(NotificationsPage);
}
}