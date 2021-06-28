import {NavController, NavParams, ViewController} from "ionic-angular";
import {Component} from "@angular/core";
import {AuthenticationService} from "../../authentication-service";
import {getDistanceInKM} from "../../globals";
import {ClubInfo, ClubList, createClubList} from "../../data/club-course";
import {GeolocationService} from "../../providers/geolocation-service/geolocation-service";
import {ClubService} from "../../providers/club-service/club-service";

/**
 * The competition list page class. This class lists the competitions. There are
 * three types of listing
 *  This class extends Subscriber which is passed as parameter for Remote Http method so that
 *  results are processed
 */
@Component({
    templateUrl: 'add-club-list.html',
    selector: 'add-club-list-page'
})
export class AddClubListPage
{
    clubList: ClubList;
    openedModal: boolean = false;
    searchQuery: string;

    constructor(private nav: NavController,
        private navParams: NavParams,
        private auth: AuthenticationService,
        private geo: GeolocationService,
        private clubService: ClubService,
        private viewCtl: ViewController) {
        this.clubList    = createClubList();
        this.openedModal = navParams.get("openedModal");
    }

    ionViewDidLoad() {
        this.refreshClubs(null, null);
    }

    onSearchInput(event) {
        this._clearItems();
        this.refreshClubs(null, null);
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
        this.refreshClubs(refresher, null);
    }

    doInfinite(infinite) {
        console.log("Current Page = " + this.clubList.currentPage);
        if (this.isMore()) {
            this.refreshClubs(null, infinite);
        }
        // else {
        //     infinite.complete();
        //     infinite.enable(false);
        // }

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

    refreshClubs(refresher, infinite) {
        this.clubService.searchClubs(this.searchQuery, true, this.clubList.currentPage + 1)
            .subscribe((clubList: ClubList) => {
                // if (clubList.totalPages > 0)
                //     clubList.currentPage++;
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
