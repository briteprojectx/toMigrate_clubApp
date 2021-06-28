import {NavController, NavParams, ViewController, Events, ModalController, LoadingController} from "ionic-angular";
import {AuthenticationService} from "../../../../authentication-service";
import {getDistanceInKM} from "../../../../globals";
import {ClubInfo, ClubList, createClubList, CourseInfo} from "../../../../data/club-course";
import {GeolocationService} from "../../../../providers/geolocation-service/geolocation-service";
import {ClubService} from "../../../../providers/club-service/club-service";
import {Component, Renderer} from "@angular/core";
import { ClubFlightService } from "../../../../providers/club-flight-service/club-flight-service";
import { ClubData } from "../../../../data/mygolf.data";
import { JsonService } from "../../../../json-util";

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
    templateUrl: 'program-club-list.html'
})
export class ProgramClubListPage
{
    public refresher: any;
    public infinite: any;

    public clubList: any;
    public openedModal: boolean = false;
    public searchQuery: string = "";
    public courseId: number;
    public courseName: string;
    public prevClubName: string;
    public prevCourseInfo: CourseInfo;
    public courseType: string;
    public clubInfo: ClubInfo;
    public prevClubInfo: ClubInfo;
    public multiSelect: boolean = false;
    programId: string;
    multiClub: Array<ClubData> = new Array<ClubData>();

    constructor(private nav: NavController,
        private navParams: NavParams,
        private renderer: Renderer,
        private auth: AuthenticationService,
        private modalCtl: ModalController,
        private geo: GeolocationService,
        private clubService: ClubService,
        private viewCtl: ViewController,
        private events: Events,
        private loadingCtl: LoadingController,
        private flightService: ClubFlightService) {
        this.clubList    = createClubList();
        this.openedModal = navParams.get("openedModal");

        this.prevCourseInfo = navParams.get("courseInfo");
        this.prevClubName   = navParams.get("clubName");

        this.courseId   = navParams.get("courseId");
        this.courseName = navParams.get("courseName");
        this.courseType = navParams.get("courseType");

        this.clubInfo     = navParams.get("clubInfo");
        this.prevClubInfo = navParams.get("clubInfo");

        this.multiSelect = navParams.get("multiSelect");
        this.programId = navParams.get("programId");
    }

    ionViewDidLoad() {
        this._refreshClubs(null, null);
    }

    ionViewDidEnter() {
        // adjustViewZIndex(this.nav, this.renderer);
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
        this.onMultiClubSelected(item);
        if(1) return false;
        if (this.openedModal) this.viewCtl.dismiss({clubInfo: item});
    }

    close() {
        this.viewCtl.dismiss({courseInfo: this.prevCourseInfo, clubInfo: this.prevClubName});
    }

    private _clearItems() {
        this.clubList = createClubList();
    }

    // private _refreshClubs(refresher, infinite) {
    //     this.clubService.searchClubs(this.searchQuery, true, this.clubList.currentPage + 1)
    //         .subscribe((clubList: ClubList) => {
    //             this.clubList.currentPage = clubList.currentPage;
    //             this.clubList.totalPages  = clubList.totalInPage;
    //             this.clubList.totalItems  = clubList.totalItems;
    //             this.clubList.clubs.push(...clubList.clubs);
    //             console.log("Total = " + this.clubList.clubs.length);
    //         }, (error) => {

    //         }, () => {
    //             //Handle the refresher or infinite
    //             if (refresher && refresher.complete) refresher.complete();
    //             if (infinite) {
    //                 if (infinite.complete) infinite.complete();
    //                 if (this.isMore()) {
    //                     infinite.enable(true);
    //                 }
    //                 else infinite.enable(false);
    //             }
    //         });
    // }

    private _refreshClubs(refresher, infinite) {
        let _programId = this.programId;
        this.flightService.listDiscountProgramsClub(_programId)
        .subscribe((data)=>{
            console.log("get list discount program clubs", data)
            if(data) {
                let clubList = data.json();
                if(clubList.success && clubList.totalItems > 0) {
                    this.clubList.currentPage = clubList.currentPage;
                    this.clubList.totalPages  = clubList.totalInPage;
                    this.clubList.totalItems  = clubList.totalItems;
                    // clubList.items.forEach((club: ClubData)=>{
                    //     JsonService.deriveFulImageURL(club,'clubImage');
                    //     JsonService.deriveFulImageURL(club,'clubThumbnail');
                    //     JsonService.deriveFulImageURL(club,'clubLogo');
                    // })
                    this.clubList.clubs.push(...clubList.items);
                    this.clubList.clubs.forEach((club: ClubData)=>{
                        JsonService.deriveFulImageURL(club,'clubImage');
                        JsonService.deriveFulImageURL(club,'clubThumbnail');
                        JsonService.deriveFulImageURL(club,'clubLogo');
                    })
                    console.log("get list discount program clubs", this.clubList, clubList)
                }
            } 
        })

        // this.clubService.searchClubs(this.searchQuery, true, this.clubList.currentPage + 1)
        //     .subscribe((clubList: ClubList) => {
        //         this.clubList.currentPage = clubList.currentPage;
        //         this.clubList.totalPages  = clubList.totalInPage;
        //         this.clubList.totalItems  = clubList.totalItems;
        //         this.clubList.clubs.push(...clubList.clubs);
        //         console.log("Total = " + this.clubList.clubs.length);
        //     }, (error) => {

        //     }, () => {
        //         //Handle the refresher or infinite
        //         if (refresher && refresher.complete) refresher.complete();
        //         if (infinite) {
        //             if (infinite.complete) infinite.complete();
        //             if (this.isMore()) {
        //                 infinite.enable(true);
        //             }
        //             else infinite.enable(false);
        //         }
        //     });
    }

    isMore(): boolean {
        return this.clubList.totalPages > 0
            && this.clubList.currentPage < this.clubList.totalPages;
    }

    onMultiClubSelected(item: ClubData) {
        // this.multiClub.push(item);
        let _hasClub;
        console.log("select multi", item, this.multiClub);
        if(this.multiClub && this.multiClub.length > 0) {
            _hasClub = this.multiClub.filter((c)=>{
                if(c.id === item.id) return true;
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
            this.multiClub.forEach((c: ClubData, idx: number)=>{
                console.log("club player select - ", idx, c)
                // if(idx > 0) 
                _clubList += c.name + ', '
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

    getClubAddress(club: ClubData) {
        let _address = '';
        if(club.address) {
            _address += club.address.address1?club.address.address1+', ':'';
            _address += club.address.address2?club.address.address2+', ':'';
            _address += club.address.city?club.address.city+', ':'';
            _address += club.address.state?club.address.state+', ':'';
            _address += club.address.countryData.name?club.address.countryData.name:'';
        } else _address = null;
        return _address;
    }

    getClubImage(club: ClubData) {
        let _imageUrl;
        if(club.clubThumbnail) _imageUrl = club.clubThumbnail;
        else if(club.clubImage) _imageUrl = club.clubImage;
        else if(club.clubLogo) _imageUrl = club.clubLogo;
        else _imageUrl = '';
       return _imageUrl; 
    }
}
