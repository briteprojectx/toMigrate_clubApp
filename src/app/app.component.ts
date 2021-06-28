import {Component, ViewChild} from "@angular/core";
import {Platform, App, Nav, NavController, ToastController} from "ionic-angular";


import {GameRoundScoringPage} from "../pages/gameround-scoring/gameround-scoring";
import * as global from "../globals";
import {MessageDisplayUtil} from "../message-display-utils";
import {ScorerAppHomePage} from '../pages/home/scorer-app-home';
import {Network} from '@ionic-native/network';
import {Dialogs} from '@ionic-native/dialogs';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {LeaderboardPage} from '../pages/competition/competition-leaderboard/competition-leaderboard';
import { IonicApp } from "ionic-angular";
import { MenuController } from "ionic-angular";
import { ClubFlightService } from "../providers/club-flight-service/club-flight-service";
import {ClubHelpItem} from "../data/mygolf.data";
import { SessionDataService } from "../redux/session";
import { SessionInfo } from "../data/authentication-info";
import { ManageDiscountCardModal } from "../pages/modal-screens/manage-discount-card/manage-discount-card";
import { JsonService } from "../json-util";
import { ClubBookingListPage } from "../pages/booking/club-booking-list/club-booking-list";
import { BookingCalendarPage } from "../pages/booking/booking-calendar/booking-calendar";
@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    // rootPage = HomePage;
    rootPage = ScorerAppHomePage;

    clubHelpItems: Array<ClubHelpItem>;
    
    sessionState: any;
    loggedIn: any;
    constructor(private platform: Platform,
        private toastCtl: ToastController,
        private network: Network,
        private dialogs: Dialogs,
        private statusBar: StatusBar,
        private splashScreen: SplashScreen,
        private app: App,
        private _ionicApp: IonicApp,
        private menu: MenuController,
        private flightService: ClubFlightService,
        private sessionDataService: SessionDataService) {
        this.initializeApp();
        platform.ready().then(() => {
      
            // Do your thing...
            if(!this.platform.is('cordova')) this.setupBackButtonBehavior ();
            this.getCurrentSession();
      
          });
          this.sessionDataService.getSessionStatus().subscribe((data:any)=>{
            console.log("sub session state", data)
            if(data) this.sessionState = data
            else this.sessionState = null
            
            if(data===1) this.loggedIn = true;
            else if(data === 3) this.loggedIn = false;
            else this.loggedIn = false;
        });
    }

    private setupBackButtonBehavior () {

        // If on web version (browser)
        if (window.location.protocol !== "file:") {
    
          // Register browser back button action(s)
          window.onpopstate = (evt) => {
    
            // Close menu if open
            if (this.menu.isOpen()) {
              this.menu.close ();
              return;
            }
    
            // Close any active modals or overlays
            let activePortal = this._ionicApp._loadingPortal.getActive() ||
              this._ionicApp._modalPortal.getActive() ||
              this._ionicApp._toastPortal.getActive() ||
              this._ionicApp._overlayPortal.getActive();
    
            if (activePortal) {
              activePortal.dismiss();
              return;
            }
    
            // Navigate back
            if (this.app.getRootNav().canGoBack()) this.app.getRootNav().pop();
    
          };
    
          // Fake browser history on each view enter
          this.app.viewDidEnter.subscribe((app) => {
            history.pushState (null, null, "");
          });
    
        }
        
      }

    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();
            this.statusBar.show();
            this.statusBar.overlaysWebView(false);
            // StatusBar.hide();
            this.hideSplashScreen();
            this.platform.registerBackButtonAction(() => {

                let nav       = this.app.getRootNav();
                let activeNav = this.app.getActiveNav();
                let page = activeNav.getActive()._cmp.instance;
                if (nav === activeNav && nav.getActive() && nav.getActive().isFirst())
                    this.confirmAndExit(nav);
                else if(page instanceof LeaderboardPage){
                    // alert('Leaderboard: showLogout = '+ page['showLogout'] );
                    if(!page['showLogout'])
                        this.app.navPop();
                }
                else if(!(page instanceof GameRoundScoringPage))
                    this.app.navPop();

            }, 101);

            this.platform.ready().then(() => {
                document.addEventListener('backbutton', () => {
                    console.log("clicking on back button")
                //  if (this.navCtrl.canGoBack()) {
                //    this.platform.exitApp()
                //    return;
                //  }
                //  this.navCtrl.pop()
               }, false);
                });
                
            this.network.onDisconnect().subscribe(()=>{
                if(this.network.type === 'none'){
                    MessageDisplayUtil.showErrorToast("You have lost your data connection",
                        this.platform, this.toastCtl, 3000, "bottom");
                }
            })
        });
    }

    confirmAndExit(nav: NavController) {
        if (this.platform.is("cordova")) {
            console.log("Native confirm dialog");
            this.dialogs.confirm("Do you want to exit myGolf2u ?", "Exit App", ["No", "Exit"])
                   .then((result: any) => {
                       if (result && result === 2) {
                           this.platform.exitApp();
                       }
                   });
        }
    }

    hideSplashScreen() {
        if (this.splashScreen) {
            setTimeout(() => {
                this.splashScreen.hide();
            }, 100);
        }
    }

    showFooterPage() {
        enum pageToExclude {
            'SetupPlayingCoursesPage',
            'FlightSetupPage',
            'CompetitionPlayersPage',
            'RefundBookingPlayersModal',
            'CaddyScheduleDisplayPage',
            'ClubBookingListPage',
            'BookingCalendarPage',
        }

        enum pageIdToExclude {
            'n4-3', //playermg2ucredits
            'n4-5', //setupplaying
            'n4-6', //flightsetuppage
        }
        let _showFooter = true;
        let activePortal = this.nav.getActive();
        let name = activePortal.component.name;

        let activeView = this.nav.getActive();

        // console.log("sayang zakiah hanum - activeView : ", activeView)
        // console.log("sayang zakiah hanum 3x - activePortal : ", activePortal)
        // console.log("active nav : ", activeView)
        // console.log("active nav : ", activePortal)
        if(activeView && activeView.instance && activeView.instance.appFooterHide) _showFooter = false;
        for(let value in pageToExclude) {
            if(name === value) {
                _showFooter = false;
                continue;
            }
                
        }
        for(let value in pageIdToExclude) {
            // if(activeView.id.toLowerCase().includes(value.toLowerCase())) {
            if(activeView.id.toLowerCase() === value.toLowerCase()) {
                _showFooter = false;
                continue;
            }
                
        }
        return _showFooter
    }

    getHelpPage() {
        this.flightService.getClubHelp()
            .subscribe((clubHelpURL: Array<ClubHelpItem> ) => {
                if (clubHelpURL && clubHelpURL.length > 0) {
                    window.open(clubHelpURL[0].url, '_system');
                }
                console.log("get help items",clubHelpURL)
            })
    }

    goBookingPage() {
        if(this.disableFooterPage(1)) return false;
        if(!this.clubId) {
            MessageDisplayUtil.showMessageToast("Coming soon",
            this.platform, this.toastCtl, 3000, "bottom");
            return;
        }
        
        this.nav.push(BookingCalendarPage, {clubId: this.clubId});
    }
    goNotificationPage() {
        if(this.disableFooterPage(2)) return false;
        if(!this.clubId) {
            MessageDisplayUtil.showMessageToast("Coming soon",
            this.platform, this.toastCtl, 3000, "bottom");
            return;
        }
        this.nav.push(ClubBookingListPage, {clubId: this.clubId})
        
    }
    goHomePage() {
        if(this.disableFooterPage(3)) return false;
        this.nav.setRoot(ScorerAppHomePage);
    }
    goProfilePage() {
        if(this.disableFooterPage(5)) return false;
        if(!this.clubId) {
            MessageDisplayUtil.showMessageToast("Coming soon",
            this.platform, this.toastCtl, 3000, "bottom");
            return;
        }
        
        this.nav.push(ManageDiscountCardModal, {
            fromClub: true,
            clubInfo: this.clubInfo,
            clubId: this.clubInfo.clubId,
            currencySymbol: this.clubInfo.country.currencySymbol,
        });
    }

    disableFooterPage(type?: number) {
        let _disableFooter = false;
        let activePortal = this.nav.getActive();
        let name = activePortal.component.name;

        if(type === 1) { //mybookings
            if(name === 'BookingCalendarPage') _disableFooter = true;
        } else if(type === 2) { //notifications
            if(name === 'ClubBookingListPage') {
                _disableFooter = true;
            }
            // NotificationsPage
        } else if(type === 3) { //home
            if(name === 'ScorerAppHomePage') {
                _disableFooter = true;
            }
            // BookingHomePage
        } else if(type === 4) { //FAQ
            if(name === 'FaqPage') _disableFooter = true;
            // FaqPage
        } else if(type === 5) { //profile
            if(name === 'ManageDiscountCardModal')
                _disableFooter = true;
        }

        return _disableFooter;
    }

    clubId;
    clubInfo;
    getCurrentSession() {
        let currSession: SessionInfo;
        this.sessionDataService.getCurrentSession()
        .subscribe((session: SessionInfo) => {
            currSession = session;
            console.log("club session - session : ", session)
            if(session.status === 0) return false;
            
            if(currSession && currSession.user && currSession.user.clubId) this.clubId = currSession.user.clubId;// currSession.clubId;
            if(currSession && currSession.user && currSession.user.clubId) {
                this.flightService.getClubInfo(currSession.user.clubId)
            .subscribe((data: any)=>{
                // console.log("club info : ", data)
                if(data) {
                    JsonService.deriveFulImageURL(data,"clubImage");
                    JsonService.deriveFulImageURL(data,"clubLogo");
                    JsonService.deriveFulImageURL(data,"clubThumbnail");
                    this.clubInfo = data;
                }
            })
            }
            
        });
    }
}
