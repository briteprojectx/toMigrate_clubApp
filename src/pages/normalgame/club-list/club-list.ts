import {LoadingController, NavController, NavParams, Platform, ToastController, ViewController, ModalController} from 'ionic-angular';
import {Component, Renderer} from '@angular/core';
import {AuthenticationService} from '../../../authentication-service';
import {adjustViewZIndex, getDistanceInKM} from '../../../globals';
import {ClubInfo, ClubList, createClubList} from '../../../data/club-course';
import {GeolocationService} from '../../../providers/geolocation-service/geolocation-service';
import {ClubService} from '../../../providers/club-service/club-service';
import {Keyboard} from '@ionic-native/keyboard';
import {MessageDisplayUtil} from '../../../message-display-utils';
import {PlayerService} from '../../../providers/player-service/player-service';
import {Country} from '../../../data/country-location';
import { SessionDataService } from '../../../redux/session';
import { SessionInfo } from '../../../data/authentication-info';

// import {ClubFilterPage} from '../club-filter/club-filter';
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
    templateUrl: 'club-list.html',
    selector: 'club-list-page'
})
export class ClubListPage
{

    clubList: ClubList;
    openedModal: boolean = false;
    searchQuery: string='';
    countryList: Array<Country>;
    countryId: string;
    flagUrl: string;
    countryData: Country;
    session: SessionInfo;
    forMembership: boolean = false;

    constructor(private nav: NavController,
        private renderer: Renderer,
        private navParams: NavParams,
        private auth: AuthenticationService,
        private geo: GeolocationService,
        private clubService: ClubService,
        private viewCtl: ViewController,
        private loadCtl: LoadingController,
        private toastCtl: ToastController,
        private keyboard: Keyboard,
        private platform: Platform,
        private modalCtl: ModalController,
        private playerService: PlayerService,
        private sessionService: SessionDataService) {
        this.clubList    = createClubList();
        this.openedModal = navParams.get("openedModal");
        this.forMembership = navParams.get("forMembership");
    }

    ionViewDidLoad() {
        this.sessionService.getSession()
        .take(1)
        .subscribe((session: SessionInfo) => {
          this.session = session;
        });
        this.countryId = this.session.countryId;
        this._refreshClubs(null, null);
        this.getCountry();
    }

    ionViewDidEnter() {
        if (!this.openedModal) {
            adjustViewZIndex(this.nav, this.renderer);
        }
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
        if (this.openedModal) {
            this.viewCtl.dismiss(item);
        }
    }

    close() {
        this.viewCtl.dismiss();
    }

    private _clearItems() {
        this.clubList = createClubList();
    }

    private _filterVirtualClubs() {
        if(this.clubList.clubs.length > 0) {
            this.clubList.clubs = this.clubList.clubs.filter((x: ClubInfo) => {
                return !x.virtualClub
            })
            console.log("[Club] Club List filtered : ",this.clubList)
        }
    }

    private _refreshClubs(refresher, infinite) {
        // let busy = this.loadCtl.create({
        //     content: "Please wait..."
        // });
        // busy.present().then(()=>{
        this.clubService.searchClubs(this.searchQuery, true, this.clubList.currentPage + 1, this.countryId)
            .subscribe((clubList: ClubList) => {
                // busy.dismiss().then(()=>{
                this.clubList.currentPage = clubList.currentPage;
                this.clubList.totalPages  = clubList.totalInPage;
                this.clubList.totalItems  = clubList.totalItems;
                this.clubList.clubs.push(...clubList.clubs);
                if(!this.forMembership) this._filterVirtualClubs();

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

    // onMenuFilterClick() {
    //     let filter = this.modalCtl.create(ClubFilterPage);
    //     filter.onDidDismiss((apply: boolean) => {
    //         if (apply) this._refreshClubs(null, null);
    //     })
    //     // this.nav.push(ClubFilterPage);
    //     if (this.platform.is('ios') && this.platform.is('cordova'))
    //         this.keyboard.close();
    //     filter.present();
    // }

    getCountry() {
        this.playerService.getCountryList()
                .subscribe((data: Array<Country>) => {
                            // console.log("Country Sign Up : ",data)
                            this.countryList = data;
                            // console.log("Country List Sign Up : ", this.countryList)
        });
    }


    getFlagUrl(flagUrl: string) {
        if(flagUrl === null || flagUrl === "" ) return null
        else {
            let flagIcon = flagUrl.split("/")
            return "img/flag/"+flagIcon[2]

        }
    }
    countrySelected() {
        console.log('country selected : ', this.countryId);
        // this.flagUrl = country.flagUrl;
        this._clearItems();
        this._refreshClubs(null,null);
    }
}
