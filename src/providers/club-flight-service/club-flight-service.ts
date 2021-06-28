import { CaddySelectionCriteria, ItemizedBill, BuggyDayDetails, CaddyDayDetails, ClubRating, RatingItem, BookingStatistics, CourseUtilizationStatistics, CaddieBuggyAssignmentStatistics, BookingOfflinePayment, CaddyAssignment, TeeTimeClubVoucher, ClubData, CancelBookingSpecification, ClubMembership, ClubHelpItem, LowestAverageGrossLeaderboard, PlayerLowestAverageGross, LeagueScorecards, PlayerRoundScores, EclecticPlayerRound, LeagueLeaderboard,PagedData, ClubCaddieSchedule, Unavailability, BookingCount, PaymentMethod } from './../../data/mygolf.data';
// import { CaddySelectionCriteria, ItemizedBill, BuggyDayDetails, CaddyDayDetails, ClubRating, RatingItem, BookingStatistics, CourseUtilizationStatistics, CaddieBuggyAssignmentStatistics, BookingOfflinePayment, CaddyAssignment, TeeTimeClubVoucher, ClubData, CancelBookingSpecification, ClubMembership, ClubHelpItem, PagedData, ClubCaddieSchedule, Unavailability, BookingCount } from './../../data/mygolf.data';
import { PlayerDetails } from './../../data/competition-teams';
import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {RemoteHttpService} from '../../remote-http';
import * as global from '../../globals';
import {ContentType, RemoteRequest} from '../../remote-request';
import {RequestMethod, Response} from '@angular/http';
import {ClubList, CourseHoleInfo, CourseInfo} from '../../data/club-course';
import {JsonService} from '../../json-util';
import {Observable} from 'rxjs/Observable';
import {isPresent} from 'ionic-angular/util/util';
import {SearchCriteria} from '../../data/search-criteria';
import { TeeTimeFlight, BuggyData, CaddyData, CaddySchedule, BuggySchedule, TeeTimeSlot, TeeTimeSlotBookingRequest, TeeTimeSlotDisplay, ClubTeeTimeSlots, TeeTimeBooking, TeeTimeBookingPlayer, TeeTimeBookingOptions, PlayerData, BuggyCaddiePreference,FutureBookingStatistics,CaddieBuggyStatistics, HandicapSystem } from '../../data/mygolf.data';
import { ServerResult } from '../../data/server-result';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import { ClubInfo } from '../../data/mygolf.data';

import * as moment from 'moment';
import { BrowserPlatformLocation } from '@angular/platform-browser/src/browser/location/browser_platform_location';
import { PlayerInfo } from '../../data/player-data';
import { FAQItem, GroupItem } from '../../pages/faq/faq';
import { ContactUsItem, HelpURLs } from '../../pages/contact-us/contact-us';
import { FiletransferService } from '../filetransfer-service/filetransfer-service';
import { UploadResult } from '../../data/fileupload-result';

/*
 Generated class for the ClubService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class ClubFlightService
{
    private searchCriteria: SearchCriteria;

    constructor(public http: RemoteHttpService,
        private ftService: FiletransferService,) {
    }

    /**
     * Gets the information about a single club
     * @param clubId The ID of the club
     */
    public getClubInfo(clubId: number): Observable<ClubInfo> {
        let request = new RemoteRequest(global.ServerUrls.getClub, RequestMethod.Get,
            ContentType.URL_ENCODED_FORM_DATA, {
                clubId     : clubId,
                fullDetails: true
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let clubInfo: ClubInfo = resp.json();
                       if (!isPresent(clubInfo.clubImage)) clubInfo.clubImage = "document/img/default_club.png";
                       JsonService.deriveFullUrl(clubInfo, "clubImage");
                       return clubInfo;
                   }).catch(this.http.handleError);
    }

    /**
     * Get the courses for a given club
     * @param clubId The ID of the club
     * @returns {Observable<R>}
     */
    public getClubCourses(clubId: number): Observable<Array<CourseInfo>> {
        let request = new RemoteRequest(global.ServerUrls.getClubCourses,
            RequestMethod.Get,
            ContentType.URL_ENCODED_FORM_DATA, {
                clubId: clubId
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let courses: Array<CourseInfo> = resp.json();
                       courses.forEach((c: CourseInfo) => {
                           JsonService.deriveFullUrl(c, "photoUrl");
                           c.holes.forEach((h: CourseHoleInfo) => {
                               JsonService.deriveFullUrl(h, "holeImage");
                           });
                       });
                       return courses;
                   }).catch(this.http.handleError);
    }

    /**
     * Gets the nearby club within a certain distance
     * @param maxDistance The maximum distance from the club to current location.
     * The current location details are automatically addedd
     * @returns {Observable<R>} Returns the Observable with next method returning
     * array of ClubInfo objects
     */
    public getNearbyClubs(maxDistance: number = 10): Observable<Array<ClubInfo>> {
        let request = new RemoteRequest(global.ServerUrls.getClubsNearby,
            RequestMethod.Get,
            ContentType.URL_ENCODED_FORM_DATA, {
                maxDistance: maxDistance
            });
          //??console.log("url encoded :", ContentType.URL_ENCODED_FORM_DATA)
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let clubInfos: Array<ClubInfo> = resp.json();
                       clubInfos.forEach((c: ClubInfo) => {
                           if (!isPresent(c.clubImage)) c.clubImage = "document/img/default_club.png";
                           JsonService.deriveFullUrl(c, "clubImage");
                       });

                       return clubInfos;
                   }).catch(this.http.handleError);
    }

    /**
     * Gets the recent clubs played. The ID of the player is automatically inserted
     * @param maxClubs The maximum number of recent clubs to return
     * @returns {Observable<R>}
     */
    public getRecentClubs(maxClubs: number = 10): Observable<Array<ClubInfo>> {
        let request = new RemoteRequest(global.ServerUrls.getRecentClubs,
            RequestMethod.Get,
            ContentType.URL_ENCODED_FORM_DATA, {
                maxItems: maxClubs
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let clubInfos: Array<ClubInfo> = resp.json();
                       clubInfos.forEach((c: ClubInfo) => {
                           if (!isPresent(c.clubImage)) c.clubImage = "document/img/default_club.png";

                           JsonService.deriveFullUrl(c, "clubImage");
                       });

                       return clubInfos;
                   }).catch(this.http.handleError);
    }

    /**
     * Search clubs
     * @param searchText The search text filter. The search is applied on clubName, tag, address,
     * city, state
     * @param activeOnly Only clubs with status "Active" are considered.
     * @param pageNumber The search happens in paged manner. This parameter specifies which page is
     * requested
     * @param countryId The optional country id. Only clubs from this country are returned. Clubs
     * without country are ignored
     * @returns {Observable<R>}
     */
    public searchClubs(searchText: string,
        activeOnly: boolean,
        pageNumber: number,
        countryId?: string): Observable<ClubList> {
        let request = new RemoteRequest(global.ServerUrls.searchClubs,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                searchText: searchText,
                activeOnly: activeOnly,
                pageNumber: pageNumber,
                countryId : countryId
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let clubList: ClubList = resp.json();
                       if (clubList && clubList.clubs)
                           clubList.clubs.forEach((c: any) => {
                               if (!isPresent(c.clubImage)) c.clubImage = "document/img/default_club.png";

                               JsonService.deriveFullUrl(c, "clubImage");
                           });
                       return clubList;
                   }).catch(this.http.handleError);
    }

    // public setSearch(search: SearchCriteria) {
    //     this.searchCriteria = search;
    //     if (this.searchCriteria != null && !this.searchCriteria.maxDistance)
    //         this.searchCriteria.maxDistance = 10;
    //     //Save it
    //     this.pref.setPref("CompetitionFilter", search);
    // }

    // public getSearchCriteria () {

    // }

    // public setSearchCriteria() {

    // }

    public getMasterFlightList() {
        let request = new RemoteRequest('assets/teeTimeFlight.json',
            RequestMethod.Get);
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let flightList: any = resp.json();
                       flightList.forEach((tb: TeeTimeBooking)=> {
                        tb.bookingPlayers.forEach((p: TeeTimeBookingPlayer)=>{
                         JsonService.deriveFullUrl(p.player, "profile");
                         JsonService.deriveFullUrl(p.player, "image");
                        })
                        if(tb.flight) tb.bookingStatus = 'PaymentFull'
                    })
                    //  //??console.log("club flight service first : ", flightList, resp, resp.json())
                    //    if (clubList && clubList.clubs)
                    //        clubList.clubs.forEach((c: ClubInfo) => {
                    //            if (!isPresent(c.clubImage)) c.clubImage = "document/img/default_club.png";

                    //            JsonService.deriveFullUrl(c, "clubImage");
                    //        });
                       return flightList;
                   }).catch(this.http.handleError);
            // return this.http.get('/assets/shipping.json');
    }

    public getBookingFlightList(clubId: number, forDate: string, registeredOnly: boolean = false, includeCancelled:boolean = false) {
        
        // 'assets/json_teeTimeBooking.json'
        let _params = "?clubId="+clubId+"&forDate=" +forDate + "&registeredOnly="+registeredOnly+"&includeCancelled="+includeCancelled;
        let request = new RemoteRequest(global.ServerUrls.getTeeTimeBookingList+_params,
            RequestMethod.Get);
        // let request = new RemoteRequest(global.ServerUrls.getTeeTimeBookingList,
        //     RequestMethod.Get,ContentType.URL_ENCODED_FORM_DATA,{
        //         clubId: clubId,
        //         forDate: forDate,
        //         registeredOnly: registeredOnly
        //     });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let flightList: Array<TeeTimeBooking> = resp.json();
                       flightList.forEach((tb: TeeTimeBooking)=> {
                           tb.bookingPlayers.forEach((p: TeeTimeBookingPlayer)=>{
                            JsonService.deriveFullUrl(p.player, "profile");
                            JsonService.deriveFullUrl(p.player, "image");
                            JsonService.deriveFullUrl(p.caddyAssigned, "caddyImage");
                            JsonService.deriveFullUrl(p.caddyPreferred, "caddyImage");
                           })
                        //    if(tb.flight) tb.bookingStatus = 'PaymentFull'
                       })
                    //  //??console.log("club flight service first : ", flightList, resp, resp.json())
                       return {resp , flightList};
                   }).catch(this.http.handleError);
    }

    public getBookingFlightDetail() {
        let request = new RemoteRequest('assets/flightDetail.json',
            RequestMethod.Get);
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let flightDetail: TeeTimeFlight = resp.json();
                    //  //??console.log("club flight service first - flight detail : ", flightDetail, resp, resp.json())
                       return flightDetail;
                   }).catch(this.http.handleError);

    }

    public getBuggyList(clubId: number) {
        let request = new RemoteRequest(global.ServerUrls.getBuggyList,
            RequestMethod.Get,ContentType.URL_ENCODED_FORM_DATA, {
                clubId: clubId
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let buggyList: Array<BuggyData> = resp.json();
                       buggyList.forEach((buggy: BuggyData) => {
                        JsonService.deriveFullUrl(buggy, "buggyImage");
                       })
                    //  //??console.log("club flight service first - buggy List : ", buggyList, resp, resp.json())
                       return buggyList;
                   }).catch(this.http.handleError);

    }

    public getCaddyList(clubId: number) {
        // 'assets/caddyList.json'
        let request = new RemoteRequest(global.ServerUrls.getCaddyList,
            RequestMethod.Get,ContentType.URL_ENCODED_FORM_DATA, {
                clubId: clubId
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let caddyList: Array<CaddyData> = resp.json();
                       caddyList.forEach((caddy: CaddyData) => {
                        JsonService.deriveFullUrl(caddy, "caddyImage");
                        JsonService.deriveFullUrl(caddy.nationality, "flagUrl");
                       })
                    //  //??console.log("club flight service first - caddy List : ", caddyList, resp, resp.json())
                       return caddyList;
                   }).catch(this.http.handleError);

    }

    public getAvailableCaddiesBooking(bookingId: number) {
        let _bookingId;
        if(bookingId) _bookingId = bookingId;
        let request = new RemoteRequest(global.ServerUrls.getAvailableCaddieBooking+"/"+_bookingId,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA);
            return this.http.execute(request)
                   .map((resp: Response) => {
                       let caddyList: Array<CaddyData> = resp.json();
                       caddyList.forEach((caddy: CaddyData) => {
                        // JsonService.deriveFullUrl(caddy, "caddyImage");
                        // JsonService.deriveFullUrl(caddy.nationality, "flagUrl");
                        JsonService.deriveFulImageURL(caddy, "caddyImage");
                        JsonService.deriveFulImageURL(caddy.nationality, "flagUrl");

                       })
                    //  //??console.log("club flight service first - caddy List : ", caddyList, resp, resp.json())
                       return caddyList;
                   }).catch(this.http.handleError);
    }

    public getAvailableCaddies(clubId: number, availableOn: string) {
        let request = new RemoteRequest(global.ServerUrls.getAvailableCaddies,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                clubId: clubId,
                availableOn: availableOn
            });
            return this.http.execute(request)
                   .map((resp: Response) => {
                       let caddyList: Array<CaddyData> = resp.json();
                       caddyList.forEach((caddy: CaddyData) => {
                        JsonService.deriveFullUrl(caddy, "caddyImage");
                        JsonService.deriveFullUrl(caddy.nationality, "flagUrl");
                       })
                    //  //??console.log("club flight service first - caddy List : ", caddyList, resp, resp.json())
                       return caddyList;
                   }).catch(this.http.handleError);
    }

    public getAvailableBuggies(clubId: number, availableOn: string) {
        let request = new RemoteRequest(global.ServerUrls.getAvailableBuggies,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                clubId: clubId,
                availableOn: availableOn
            });
            return this.http.execute(request)
                   .map((resp: Response) => {
                       let buggyList: Array<BuggyData> = resp.json();
                       buggyList.forEach((buggy: BuggyData) => {
                        JsonService.deriveFullUrl(buggy, "buggyImage");
                       })
                    //  //??console.log("club flight service first - caddy List : ", caddyList, resp, resp.json())
                       return buggyList;
                   }).catch(this.http.handleError);
    }

    public getCaddySchedule(caddyId: number, fromDate: string, toDate?: string) {
        let request = new RemoteRequest(global.ServerUrls.getCaddySchedule,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                caddyId: caddyId,
                fromDate: fromDate,
                toDate: toDate
            });
            return this.http.execute(request)
                   .map((resp: Response) => {
                       let caddySchedule: CaddySchedule = resp.json();
                    //    caddySchedule.forEach((caddyS: any) => {
                    //     JsonService.deriveFullUrl(buggy, "buggyImage");
                    //    })
                    //  //??console.log("club flight service first - caddy List : ", caddyList, resp, resp.json())
                       return caddySchedule;
                   }).catch(this.http.handleError);
    }

    public getBuggySchedule(buggyId: number, fromDate: string, toDate?: string) {
        let request = new RemoteRequest(global.ServerUrls.getBuggySchedule,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                buggyId: buggyId,
                fromDate: fromDate,
                toDate: toDate
            });
            return this.http.execute(request)
                   .map((resp: Response) => {
                       let getBuggySchedule: BuggySchedule = resp.json();
                    //    caddySchedule.forEach((caddyS: any) => {
                    //     JsonService.deriveFullUrl(buggy, "buggyImage");
                    //    })
                    //  //??console.log("club flight service first - caddy List : ", caddyList, resp, resp.json())
                       return getBuggySchedule;
                   }).catch(this.http.handleError);
    }

    public getTeeTimeSlot(forDate: string, isClub?: boolean, clubCourseId?: number, fromTime?: string, toTime?: string) {
        let _clubCourseId = clubCourseId;
      //??console.log("isClub : ", isClub);
      //??console.log("clubCourseId : ", clubCourseId);
        let request = new RemoteRequest(global.ServerUrls.getTeeTimeSlot,
            RequestMethod.Get,ContentType.URL_ENCODED_FORM_DATA, {
                clubId: isClub?_clubCourseId:'',
                courseId: isClub?'':_clubCourseId,
                forDate: forDate,
                fromTime: fromTime,
                toTime: toTime
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                    // TeeTimeSlot
                       let teeTimeSlotDisplay: Array<TeeTimeSlotDisplay> = resp.json();
                     //??console.log("service first - tee time slot : ", teeTimeSlotDisplay, resp, resp.json())
                       teeTimeSlotDisplay.forEach((c)=>{
                        JsonService.deriveFullUrl(c.slot.startCourse, "courseImage")
                    })
                       return teeTimeSlotDisplay;
                   }).catch(this.http.handleError);

    }

    public getTeeTimeSlotNearbyClubs (forDate: string,maxDistance: number, fromTime?: string, toTime?: string) {
        let hdrs = {};
        // // hdrs['Location-Longitude'] = 10.00;
        // hdrs['Lo']
      //??console.log("Nearby clubs : ", hdrs)
            // Location-Longitude
            // Location-Latitude
        let request = new RemoteRequest(global.ServerUrls.getTeeTimeSlotNearbyClubs,
            RequestMethod.Get,ContentType.URL_ENCODED_FORM_DATA, {
                forDate: forDate,
                fromTime: fromTime,
                toTime: toTime,
                maxDistance: maxDistance
            }, hdrs);
        return this.http.execute(request)
                   .map((resp: Response) => {
                    // TeeTimeSlot
                       let teeTimeSlot: Array<any> = resp.json();
                     //??console.log("service first - nearby club tee time slot : ", teeTimeSlot, resp, resp.json())
                       return teeTimeSlot;
                   }).catch(this.http.handleError);

    }

    public getTeeTimeSlotFavClubs (forDate: string, fromTime?: string, toTime?: string) {
            // Player-Id
        let request = new RemoteRequest(global.ServerUrls.getTeeTimeSlotFavClubs,
            RequestMethod.Get,ContentType.URL_ENCODED_FORM_DATA, {
                forDate: forDate,
                fromTime: fromTime,
                toTime: toTime
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                    // TeeTimeSlot
                       let teeTimeSlot: Array<ClubTeeTimeSlots> = resp.json();
                       teeTimeSlot.forEach((c)=>{
                           JsonService.deriveFullUrl(c.club, "clubImage");
                           JsonService.deriveFullUrl(c.club, "clubThumbnail");
                           JsonService.deriveFullUrl(c.club, "clubLogo");
                           c.slots.forEach((s)=>{
                               JsonService.deriveFullUrl(s.slot.startCourse,"courseImage")
                           })
                       })
                     //??console.log("service first - tee time slot : ", teeTimeSlot, resp, resp.json())
                       return { teeTimeSlot: teeTimeSlot, resp: resp };
                   }).catch(this.http.handleError);

    }

    public getListAllSlots (playerId:number, forDate: string, fromTime?: string, toTime?: string) {
        // Player-Id
    let request = new RemoteRequest(global.ServerUrls.listAllSlots,
        RequestMethod.Get,ContentType.URL_ENCODED_FORM_DATA, {
            forDate: forDate,
            fromTime: fromTime,
            toTime: toTime
        });
    return this.http.execute(request)
               .map((resp: Response) => {
                // TeeTimeSlot
                   let teeTimeSlot: Array<ClubTeeTimeSlots> = resp.json();
                   teeTimeSlot.forEach((c)=>{
                       JsonService.deriveFullUrl(c.club, "clubImage");
                       JsonService.deriveFullUrl(c.club, "clubThumbnail");
                       JsonService.deriveFullUrl(c.club, "clubLogo");
                       c.slots.forEach((s)=>{
                           JsonService.deriveFullUrl(s.slot.startCourse,"courseImage")
                       })
                   })
                 //??console.log("service first - tee time slot : ", teeTimeSlot, resp, resp.json())
                   return { teeTimeSlot: teeTimeSlot, resp: resp };
               }).catch(this.http.handleError);

}

    // TeeTimeSlotBookingRequest
    public bookTeeTimeSlot(reqBookSlot?: TeeTimeSlotBookingRequest, addBookingPlayer: boolean = true, captchaResponse?: string): Observable<any> {
        let _reqBookSlot = reqBookSlot;
        // reqBookSlot = {
        //     "courseId": 0,
        //     "teeOffDate": moment().format("YYYY-MM-DD"),
        //     "teeOffTimeFrom": moment().format("HH:mm"),
        //     "teeOffTimeTo":  moment().format("HH:mm"),
        //     "totalPlayers": 0,
        //       "buggyRequired": 0,
        //       "caddiesRequired": 0,
        //       "ninesPlaying": 0,
        //       "bookingName": "string",
        //       "bookingEmail": "string",
        //       "bookingPhone": "string",
        // }
        
        // "bookingRequestedAt":  moment().format("YYYY-MM-DD")

      //??console.log("book tee time slot ", captchaResponse)
        let _addBookingPlayer = "?addBookingPlayer=" + (addBookingPlayer?"true":"false");
        let headers = {};
        if(captchaResponse && captchaResponse.length>0) headers['captcha-response'] = captchaResponse;
        else headers = null;
        let request = new RemoteRequest(global.ServerUrls.bookTeeTimeBookingSlot+_addBookingPlayer,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA,reqBookSlot, headers);
        return this.http.execute(request)
                   .map((resp: Response) => resp)
                //    .catch(this.handleError);
    }

    public getRecaptcha(key: string) {
        let _getRecaptcha = 'https://www.google.com/recaptcha/api2/reload?k='+key;
        // '/googleRec?k='+ key;
      //??console.log("get recaptcha ", '/googleRec?k='+key)
        let request = new RemoteRequest(_getRecaptcha,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA);
            return this.http.execute(request)
                   .map((resp: Response) => {
                     //??console.log("get google recaptcha response : ", resp);
                       return resp;
                   }).catch(this.http.handleError);

    }

    public getBookingByPlayer(playerId: number, fromDate: string, maxBookings: number = 999) {
        let request = new RemoteRequest(global.ServerUrls.getBookingByPlayer,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                playerId: playerId,
                fromDate: fromDate,
                maxBookings: maxBookings
            });
            return this.http.execute(request)
                   .map((resp: Response) => {
                       let bookingByPlayerList: Array<TeeTimeBooking> = resp.json();
                    //  //??console.log("booking by player : ", bookingByPlayerList)
                    
                    // console.log("club flight service first - booking player List [before] : ", bookingByPlayerList, resp, resp.json())
                       bookingByPlayerList.forEach((teeTime: TeeTimeBooking) => {
                        teeTime.bookingPlayers.forEach((players: TeeTimeBookingPlayer)=>{
                            JsonService.deriveFullUrl(players.player, "image");
                            JsonService.deriveFullUrl(players.player, "profile");
                        })
                        JsonService.deriveFullUrl(teeTime.clubData,"clubImage");
                       })
                    //  //??console.log("club flight service first - booking player List : ", bookingByPlayerList, resp, resp.json())
                       return bookingByPlayerList;
                   }).catch(this.http.handleError);
    }

    public getBookingForPlayer(playerId: number, fromDate: string, maxBookings: number = 999) {
        let request = new RemoteRequest(global.ServerUrls.getBookingForPlayer,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                playerId: playerId,
                fromDate: fromDate,
                maxBookings: maxBookings
            });
            return this.http.execute(request)
                   .map((resp: Response) => {
                       let bookingByPlayerList: Array<TeeTimeBooking> = resp.json();
                    //  //??console.log("booking by player : ", bookingByPlayerList)
                    
                    // console.log("club flight service first - booking player List [before] : ", bookingByPlayerList, resp, resp.json())
                       bookingByPlayerList.forEach((teeTime: TeeTimeBooking) => {
                        teeTime.bookingPlayers.forEach((players: TeeTimeBookingPlayer)=>{
                            JsonService.deriveFullUrl(players.player, "image");
                            JsonService.deriveFullUrl(players.player, "profile");
                        })
                        JsonService.deriveFullUrl(teeTime.clubData,"clubImage");
                       })
                    //  //??console.log("club flight service first - booking player List : ", bookingByPlayerList, resp, resp.json())
                       return bookingByPlayerList;
                   }).catch(this.http.handleError);
    }

    public getBookingById(bookingId: number) {
        let request = new RemoteRequest(global.ServerUrls.getBookingById+"/"+bookingId,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA);
            return this.http.execute(request)
                   .map((resp: Response) => {
                       let bookingByPlayer: TeeTimeBooking = resp.json();
                    //  //??console.log("booking by player : ", bookingByPlayerList)
                    
                    // console.log("club flight service first - booking player List [before] : ", bookingByPlayerList, resp, resp.json())
                    JsonService.deriveFullUrl(bookingByPlayer.clubData,"clubImage");
                    bookingByPlayer.bookingPlayers.forEach((players: TeeTimeBookingPlayer)=>{
                            JsonService.deriveFullUrl(players.player, "image");
                            JsonService.deriveFullUrl(players.player, "profile");
                        })
                    //  //??console.log("club flight service first - booking player List : ", bookingByPlayer, resp, resp.json())
                       return bookingByPlayer;
                   }).catch(this.http.handleError);
    }

    public addPlayerToBooking(bookingId: number, playerInfo: any, sequence?: string) {
        // TeeTimeBookingPlayer
      //??console.log("service booking add player ", bookingId, playerInfo)
        let _params = {};
        // _params = "?bookingId=" + bookingId + "&sequence=" + sequence;
        _params['bookingId'] = bookingId;
        // _params['sequence'] = null;//sequence; 
        let _caddySelectionCriteria;
        if(playerInfo.playerDetails.caddySelectionCriteria) _caddySelectionCriteria = playerInfo.playerDetails.caddySelectionCriteria;
        if(playerInfo.new) {
            _params['playerName'] = playerInfo.playerDetails.playerName;
            _params['email'] = playerInfo.playerDetails.email;
            _params['gender'] = playerInfo.playerDetails.gender;
            _params['phone'] = playerInfo.playerDetails.phone;
            _params['playerContact'] = (playerInfo.playerContact&&playerInfo.playerContact.playerContact)?playerInfo.playerContact.playerContact:'';
            if(playerInfo.playerDetails) _params['walking'] = playerInfo.playerDetails.walking;
            if(playerInfo.playerDetails) _params['caddySelectionCriteria.caddyRequired'] = _caddySelectionCriteria.caddyRequired;


            // _params += '&playerName=' + playerInfo.playerDetails.playerName;
            // _params += '&email=' + playerInfo.playerDetails.email;
            // _params += '&gender=' + playerInfo.playerDetails.gender;
            // _params += '&phone=' + playerInfo.playerDetails.phone;
        } else if (!playerInfo.new) {
            // _params += '&player.id=' + playerInfo.playerId;
            _params['player.id'] = playerInfo.playerId;
            if(playerInfo.playerDetails) _params['walking'] = playerInfo.playerDetails.walking;
            if(playerInfo.playerDetails)  _params['caddySelectionCriteria.caddyRequired'] = _caddySelectionCriteria.caddyRequired;
        }

        
        // let _bookingPlayer: TeeTimeBookingPlayer = bookingPlayer;
        let request = new RemoteRequest(global.ServerUrls.addPlayerToBooking,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, _params);
        return this.http.execute(request)
                   .map((resp: Response) => resp)
                //    .catch(this.handleError);
    }

    public deletePlayerFromBooking(bookingPlayerId: number) {
        // TeeTimeBookingPlayer

        // let _bookingPlayer: TeeTimeBookingPlayer = bookingPlayer;
        let _bookingPlayerId = bookingPlayerId;
        let _params;// = {};
        _params = "?bookingPlayerId=" + _bookingPlayerId;
        // _params["bookingPlayerId"] = _bookingPlayerId;
        let request = new RemoteRequest(global.ServerUrls.deletePlayerFromBooking+_params,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA);
        return this.http.execute(request)
                   .map((resp: Response) => resp)
                //    .catch(this.handleError);
    }

    public getClubBookingOptions(clubId: number, forDate: string) {
        let request = new RemoteRequest(global.ServerUrls.getClubBookingOptions,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                clubId: clubId,
                forDate: forDate
            });
            return this.http.execute(request)
                   .map((resp: Response) => {
                       let bookingOptions: TeeTimeBookingOptions = resp.json();
                    //  //??console.log("club flight service first - booking Opts : ", bookingOptions, resp, resp.json())
                       return bookingOptions;
                   }).catch(this.http.handleError);
    }

    // public searchBookingPlayer(id: string, clubId: number) {
    //         let request = new RemoteRequest(global.ServerUrls.searchBookingPlayer,
    //             RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
    //                 // caddyId: caddyId,
    //                 // fromDate: fromDate,
    //                 // toDate: toDate
    //             });
    //             return this.http.execute(request)
    //                    .map((resp: Response) => {
    //                        let caddySchedule: CaddySchedule = resp.json();
    //                     //    caddySchedule.forEach((caddyS: any) => {
    //                     //     JsonService.deriveFullUrl(buggy, "buggyImage");
    //                     //    })
    //                     //  //??console.log("club flight service first - caddy List : ", caddyList, resp, resp.json())
    //                        return caddySchedule;
    //                    }).catch(this.http.handleError);
    // }

    public getPlayerById(id: number) { 
      //??console.log("get player by id : ", id)
        let _params = "?playerId=" + id
        let request = new RemoteRequest(global.ServerUrls.getPlayerById+_params,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                // caddyId: caddyId,
                // fromDate: fromDate,
                // toDate: toDate
            });
            return this.http.execute(request)
                   .map((resp: Response) => {
                       let player: PlayerData = resp.json();
                     //??console.log("service - get player by id :", resp)
                    //    player.playerId = player.id;
                    //    caddySchedule.forEach((caddyS: any) => {
                    //     JsonService.deriveFullUrl(buggy, "buggyImage");
                    //    })
                    //  //??console.log("club flight service first - caddy List : ", caddyList, resp, resp.json())
                       return resp;
                   }).catch(this.http.handleError);
    }

    public getPlayerByMembership(id: string,clubId: number) {
        let _params = "?membership=" + id + "&clubId=" + clubId
        let request = new RemoteRequest(global.ServerUrls.getPlayerByMembership+_params,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                // caddyId: caddyId,
                // fromDate: fromDate,
                // toDate: toDate
            });
            return this.http.execute(request)
                   .map((resp: Response) => {
                       let player: PlayerData = resp.json();
                    //    caddySchedule.forEach((caddyS: any) => {
                    //     JsonService.deriveFullUrl(buggy, "buggyImage");
                    //    })
                    //  //??console.log("club flight service first - caddy List : ", caddyList, resp, resp.json())
                       return player;
                   }).catch(this.http.handleError);
    }
    public searchPlayerByMembership(id: string,clubId: number) {
        let _params = {};
        // "?membership=" + id + "&clubId=" + clubId
        _params['membership'] = id;
        _params['clubId'] = clubId;
        let request = new RemoteRequest(global.ServerUrls.searchPlayerByMembership,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, _params);
            return this.http.execute(request)
                   .map((resp: Response) => {
                       let player: Array<PlayerData> = resp.json();
                    //    caddySchedule.forEach((caddyS: any) => {
                    //     JsonService.deriveFullUrl(buggy, "buggyImage");
                    //    })
                    //  //??console.log("club flight service first - search by membership  : ", player, resp, resp.json())
                       return player;
                   }).catch(this.http.handleError);
    }

    public updateBookingPlayerContact(bookingPlayerId: number, playerInfo: any) {
        // TeeTimeBookingPlayer
      //??console.log("service booking update player contact ", bookingPlayerId, playerInfo)
        let _params = {};
        // _params = "?bookingId=" + bookingId + "&sequence=" + sequence;
        _params['bookingPlayerId'] = bookingPlayerId;
        if(playerInfo.new) {
            // _params['playerContact'] = playerInfo.playerContact;
            _params['address1'] = playerInfo.playerDetails.address.address1;
            _params['address2'] = playerInfo.playerDetails.address.address2;
            _params['city'] = playerInfo.playerDetails.address.city;
            _params['state'] = playerInfo.playerDetails.address.state;
            _params['postCode'] = playerInfo.playerDetails.address.postCode;
            // _params['countryData.id'] = playerInfo.playerDetails.address.countryData.id;
            _params['phone1'] = playerInfo.playerDetails.address.phone1;
            _params['phone2'] = playerInfo.playerDetails.address.phone2;


            // _params += '&playerName=' + playerInfo.playerDetails.playerName;
            // _params += '&email=' + playerInfo.playerDetails.email;
            // _params += '&gender=' + playerInfo.playerDetails.gender;
            // _params += '&phone=' + playerInfo.playerDetails.phone;
        } else if (!playerInfo.new) {
            // _params['player.address.address1'] = playerInfo.playerDetails.address.address1
            _params['address1'] = playerInfo.playerDetails.address.address1;
            _params['address2'] = playerInfo.playerDetails.address.address2;
            _params['city'] = playerInfo.playerDetails.address.city;
            _params['state'] = playerInfo.playerDetails.address.state;
            _params['postCode'] = playerInfo.playerDetails.address.postCode;
            _params['countryData.id'] = playerInfo.playerDetails.address.countryData.id;
            _params['phone1'] = playerInfo.playerDetails.address.phone1;
            _params['phone2'] = playerInfo.playerDetails.address.phone2;
            

        }


        
        let request = new RemoteRequest(global.ServerUrls.updateBookingPlayerContact,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, _params);
        return this.http.execute(request)
                   .map((resp: Response) => resp)
                //    .catch(this.handleError);
    }

    updateBookingPlayerDetails(bookingId: number, player: TeeTimeBookingPlayer, type?: string,bookingOptions?: TeeTimeBookingOptions) {
        let _params = {};
        _params['bookingId'] = bookingId;
        _params['id'] = player.id;
        // if(!player.player) {
            _params['playerName'] = player.playerName;
            _params['gender'] = player.gender;
            _params['email'] = player.email;
            _params['sequence'] = player.sequence;
                    // }
                    
            _params['playerContact'] = player.playerContact;
            _params['caddyPairing'] = player.caddyPairing;
            _params['walking'] = player.pairingNo===0?true:false;
            _params['driving'] = player.driving;
            _params['caddySelectionCriteria.gender'] = player.caddySelectionCriteria&&player.caddySelectionCriteria.gender?player.caddySelectionCriteria.gender:null;
            _params['caddySelectionCriteria.maxAge'] = player.caddySelectionCriteria&&player.caddySelectionCriteria.maxAge?player.caddySelectionCriteria.maxAge:null;
            _params['caddySelectionCriteria.minAge'] = player.caddySelectionCriteria&&player.caddySelectionCriteria.minAge?player.caddySelectionCriteria.minAge:null;

          //??console.log("updating booking player details", player)
          //??console.log("updating booking player details", player['playerType.id'])
        switch(type) {
            case 'driving':
                _params['caddyPreferred.id'] = player.caddyPreferred&&player.caddyPreferred.id?player.caddyPreferred.id:null;
                _params['driving'] = player.driving;
                _params['caddyPairing'] = player.caddyPairing;
                _params['pairingNo'] = player.pairingNo;
            break;
            case 'caddyPreferred':
                _params['caddyPreferred.id'] = player.caddyPreferred&&player.caddyPreferred.id?player.caddyPreferred.id:null;
                _params['caddyPairing'] = player.caddyPairing;
                _params['caddySelectionCriteria.caddyRequired'] = true;
                _params['pairingNo'] = player.pairingNo;
            break;
            case 'pairing':
                _params['caddyPreferred.id'] = player.caddyPreferred?player.caddyPreferred.id:null;
                _params['pairingNo'] = player.pairingNo;
                // _params['walking'] = player.walking;
                _params['caddyPairing'] = player.caddyPairing;
                break;
            case 'caddyPairing':
                _params['caddyPairing'] = player.caddyPairing;
                _params['caddyPreferred.id'] = player.caddyPreferred&&player.caddyPreferred.id?player.caddyPreferred.id:null;
                _params['caddySelectionCriteria.caddyRequired'] = true;
                _params['pairingNo'] = player.pairingNo;
                break;
            case 'removeCaddy':
                _params['caddyPreferred.id'] = null;
                _params['caddySelectionCriteria.caddyRequired'] = false;
                // _params['caddyPairing'] = 0;
                _params['pairingNo'] = player.pairingNo;
                break;
            case 'playerType':
                _params['caddyPreferred.id'] = player.caddyPreferred&&player.caddyPreferred.id?player.caddyPreferred.id:null;
                _params['driving'] = player.driving;
                _params['caddyPairing'] = player.caddyPairing;
                _params['pairingNo'] = player.pairingNo;
                _params['playerTypeUsed.id'] = player['playerTypeUsed.id'];
                _params['caddySelectionCriteria.gender'] = player.caddySelectionCriteria&&player.caddySelectionCriteria.gender?player.caddySelectionCriteria.gender:null;
                _params['caddySelectionCriteria.maxAge'] = player.caddySelectionCriteria&&player.caddySelectionCriteria.maxAge?player.caddySelectionCriteria.maxAge:null;
                _params['caddySelectionCriteria.minAge'] = player.caddySelectionCriteria&&player.caddySelectionCriteria.minAge?player.caddySelectionCriteria.minAge:null;
                break;
            case 'clear':
                _params['caddyPreferred.id'] = null;
                if(bookingOptions && !bookingOptions.buggyMandatory) _params['pairingNo'] = 0;
                if(bookingOptions && !bookingOptions.caddyMandatory )_params['caddyPairing'] = 0;
                _params['caddySelectionCriteria.caddyRequired'] = false;
                _params['caddySelectionCriteria.gender'] = '';
                _params['caddySelectionCriteria.minAge'] = null;
                _params['caddySelectionCriteria.maxAge'] = null;
                break;
            case 'resetProfile':
                _params['caddyPreferred.id'] = player.caddyPreferred&&player.caddyPreferred.id?player.caddyPreferred.id:null;
                _params['driving'] = player.driving;
                _params['caddyPairing'] = player.caddyPairing;
                _params['pairingNo'] = player.pairingNo;
                _params['caddySelectionCriteria.gender'] = player.caddySelectionCriteria&&player.caddySelectionCriteria.gender?player.caddySelectionCriteria.gender:null;
                _params['caddySelectionCriteria.maxAge'] = player.caddySelectionCriteria&&player.caddySelectionCriteria.maxAge?player.caddySelectionCriteria.maxAge:null;
                _params['caddySelectionCriteria.minAge'] = player.caddySelectionCriteria&&player.caddySelectionCriteria.minAge?player.caddySelectionCriteria.minAge:null;
                break;
        

        }

        // console.log("update booking player details - player : ", player)
        // console.log("update booking player details - params : ", _params)
            
        let request = new RemoteRequest(global.ServerUrls.updateBookingPlayerDetails,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, _params);
        return this.http.execute(request)
                   .map((resp: Response) => resp)
                //    .catch(this.handleError);
    }

    public addFromGroup(bookingId: number, groupId: number) {
        let _params = {};
        _params['bookingId'] = bookingId;
        _params['playerGroup'] = groupId;
        let request = new RemoteRequest(global.ServerUrls.addFromGroup,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, _params);
        return this.http.execute(request)
                   .map((resp: Response) => resp)
                //    .catch(this.handleError);
    }

    public cancelBooking(bookingId: number, cancelledByClub: boolean, reasonText?: string) {
        let _params = {};
        let _reason;
        if(!reasonText || reasonText === null) {
            if(cancelledByClub) _reason = 'Cancelled by Club';
            else _reason = 'Cancelled by Player'
        } 
        if(bookingId) _params['bookingId'] = bookingId;
        _params['cancelledByClub'] = cancelledByClub;
        _params['reason'] = _reason;
      //??console.log("in service cancel booking : ", bookingId)
        // let _bookingPlayer: TeeTimeBookingPlayer = bookingPlayer;
        let request = new RemoteRequest(global.ServerUrls.cancelBooking,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, _params);
        return this.http.execute(request)
                   .map((resp: Response) => resp)
                //    .catch(this.handleError);
    }

    public cancelBookingByClub(cancelBookingSpec: CancelBookingSpecification) {
        let _params = {};
        let _reason;
        if(cancelBookingSpec) _params = cancelBookingSpec;
      //??console.log("in service cancel booking : ", cancelBookingSpec)
        // let _bookingPlayer: TeeTimeBookingPlayer = bookingPlayer;
        let request = new RemoteRequest(global.ServerUrls.cancelBookingByClub,
            RequestMethod.Post, ContentType.JSON, _params);
        return this.http.execute(request)
                   .map((resp: Response) => resp)
                //    .catch(this.handleError);
    }

    public checkinBooking(bookingId: number, arrivingIn: number, bookingPlayerId: Array<number>, byClub: boolean = false) {
        let _params;
        let _arrivingIn = arrivingIn?arrivingIn:0;
        let _bookingPlayerId = bookingPlayerId;
        let _byClub;
        // _params['bookingId'] = bookingId;
        // _params['arrivingIn'] = _arrivingIn;
        // _params['bookingPlayerId'] = 
        let _paramBookingPlayer;
        _paramBookingPlayer = "bookingId="+bookingId+"&arrivingIn="+_arrivingIn+"&byClub="+byClub;
        _bookingPlayerId.forEach((v,i)=>{
            _paramBookingPlayer += '&bookingPlayerId='+v;
        })
      //??console.log(_paramBookingPlayer)
        // let _bookingPlayer: TeeTimeBookingPlayer = bookingPlayer;
        let request = new RemoteRequest(global.ServerUrls.checkinBooking+"?"+_paramBookingPlayer,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, _params);
        return this.http.execute(request)
                   .map((resp: Response) => resp)
                //    .catch(this.handleError);
    }

    public processBookingAssignments(bookingId: number) {
        // let _params;
        // _params['bookingId'] = bookingId;
      //??console.log("processing booking assignments ", bookingId)
        // let _bookingPlayer: TeeTimeBookingPlayer = bookingPlayer;
        let request = new RemoteRequest(global.ServerUrls.processBookingAssignments,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, {
                bookingId: bookingId
            });
        return this.http.execute(request)
                   .map((resp: Response) => resp)
                //    .catch(this.handleError);
    }

    public getPlayerByEmail(email: string) {
        // let _params = "?membership=" + id + "&clubId=" + clubId
      //??console.log("email service - ", email)
        let _params = {};
        if(email) _params['email'] = email;
        let request = new RemoteRequest(global.ServerUrls.getPlayerByEmail,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, _params);
            return this.http.execute(request)
                   .map((resp: Response) => {
                       let player: PlayerInfo = resp.json();
                    //    caddySchedule.forEach((caddyS: any) => {
                    //     JsonService.deriveFullUrl(buggy, "buggyImage");
                    //    })
                    //  //??console.log("club flight service first - caddy List : ", caddyList, resp, resp.json())
                       return player;
                   }).catch(this.http.handleError);
    }

    public updateBuggyCaddiePreference(bookingBuggyCaddyPref: BuggyCaddiePreference) {
        let _params: BuggyCaddiePreference;
        // _params['playerPairings']['caddyAssigned'] = null;
        // _params['playerPairings']['caddyPreferred'] = null;
        if(bookingBuggyCaddyPref) {
            _params = bookingBuggyCaddyPref;
            
            _params.playerPairings.forEach((pp)=>{
                pp.caddyAssigned = null;
                pp.caddyPreferred = null;
            })
        }
        
        let request = new RemoteRequest(global.ServerUrls.updateBuggyCaddyPreference,
            RequestMethod.Post, ContentType.JSON, _params);
        return this.http.execute(request)
                   .map((resp: Response) => resp)
                   
        
        // console.log("processing buggy caddie preference - parse ", _params )
        // console.log("processing buggy caddie preference - stringify ", JSON.stringify(_params) )
        // console.log("processing buggy caddie preference - both ", JSON.parse(JSON.stringify(_params)) )
        // // let _bookingPlayer: TeeTimeBookingPlayer = bookingPlayer;
        //         //    .catch(this.handleError);
    }

    public updateBookingFlightStatus(bookingId: number, status: string) {
        let _status = status?status:null;
        // Dispatched
        // PlayStarted
        // CrossedOver
        // PlayFinished
        // Abandoned
        let _params = {};
        _params['bookingId'] = bookingId;
        _params['status'] = _status;
      //??console.log("service update booking flight status ", bookingId, _status, _params)
        let request = new RemoteRequest(global.ServerUrls.updateBookingFlightStatus,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, _params);
        return this.http.execute(request)
                   .map((resp: Response) => resp)
                   
        
        // console.log("processing buggy caddie preference - parse ", _params )
        // console.log("processing buggy caddie preference - stringify ", JSON.stringify(_params) )
        // console.log("processing buggy caddie preference - both ", JSON.parse(JSON.stringify(_params)) )
        // // let _bookingPlayer: TeeTimeBookingPlayer = bookingPlayer;
        //         //    .catch(this.handleError);
    }

    public getBookingItemizedBill(bookingId: number, afterAssignment: boolean) {
        let _params = {};
        // "?membership=" + id + "&clubId=" + clubId
        _params['bookingId'] = bookingId;
        let _afterAssignment;
        _afterAssignment = '&afterAssignment=' + (afterAssignment)?'true':'false';
      //??console.log('get booking itemized bill', _afterAssignment)
        let request = new RemoteRequest(global.ServerUrls.getBookingItemizedBill+"/"+bookingId+'?afterAssignment='+afterAssignment,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA);
            return this.http.execute(request)
                   .map((resp: Response) => {
                    //    let itemizedBill: ItemizedBill = resp.json();
                    //    return itemizedBill;
                       
                       return resp;
                   }).catch(this.http.handleError);
    }
    public cancelBookingAssignments(bookingId: number) {
        // let _params;
        // _params['bookingId'] = bookingId;
      //??console.log("cancel booking assignments ", bookingId)
        // let _bookingPlayer: TeeTimeBookingPlayer = bookingPlayer;
        let request = new RemoteRequest(global.ServerUrls.cancelBookingAssignments,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, {
                bookingId: bookingId
            });
        return this.http.execute(request)
                   .map((resp: Response) => resp)
                //    .catch(this.handleError);
    }

    public changeBuggy(bookingId: number, bookingPlayersId: Array<number>, buggyId: number) {
        
      //??console.log("bookingId", bookingId, "|bookingPlayersId ",bookingPlayersId,"|buggyId ",buggyId)
        let _params = {};
        if(bookingId) _params['bookingId'] = bookingId;
        if(bookingPlayersId) _params['bookingPlayerId'] = bookingPlayersId;
        if(buggyId) _params['buggyId'] = buggyId;
      //??console.log("club service change buggy", _params)
        let _paramBookingPlayer;
        _paramBookingPlayer = "bookingId="+bookingId+"&buggyId="+buggyId;
        bookingPlayersId.forEach((v,i)=>{
            _paramBookingPlayer += '&bookingPlayerId='+v;
        })
        let request = new RemoteRequest(global.ServerUrls.changeBuggyFlight+"?"+_paramBookingPlayer,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA);
        return this.http.execute(request)
                   .map((resp: Response) => {
                    let bookingObject: TeeTimeBooking = resp.json();
                    bookingObject.bookingPlayers.forEach((player: TeeTimeBookingPlayer) => {
                        JsonService.deriveFullUrl(player.player, "image");
                        JsonService.deriveFullUrl(player.player, "profile");
                         JsonService.deriveFullUrl(player.caddyAssigned, "caddyImage");
                         JsonService.deriveFullUrl(player.caddyPreferred, "caddyImage");
                        })
                    
                    return { resp, bookingObject }
                }).catch(this.http.handleError);
    }

    public changeCaddy(bookingId: number, bookingPlayersId: Array<number>, caddieId: number) {
        let _params = {};
        _params['bookingId'] = bookingId;
        _params['bookingPlayerId'] = bookingPlayersId;
        _params['caddieId'] = caddieId;

        let _paramBookingPlayer;
        _paramBookingPlayer = "bookingId="+bookingId+"&caddieId="+caddieId;
        bookingPlayersId.forEach((v,i)=>{
            _paramBookingPlayer += '&bookingPlayerId='+v;
        })

        let request = new RemoteRequest(global.ServerUrls.changeCaddyFlight+"?"+_paramBookingPlayer,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA);
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let bookingObject: TeeTimeBooking = resp.json();
                       bookingObject.bookingPlayers.forEach((player: TeeTimeBookingPlayer) => {
                           
                        JsonService.deriveFullUrl(player.player, "image");
                        JsonService.deriveFullUrl(player.player, "profile");
                            JsonService.deriveFullUrl(player.caddyAssigned, "caddyImage");
                            JsonService.deriveFullUrl(player.caddyPreferred, "caddyImage");
                           })
                       
                       return { resp, bookingObject}
                   }).catch(this.http.handleError);
    }

    public getBuggyDayDetails(clubId: number, forDate: string) {
        let _params = {};
        _params['clubId'] = clubId;
        _params['forDate'] = forDate;


        let request = new RemoteRequest(global.ServerUrls.getBuggyDayDetails,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, _params);
            return this.http.execute(request)
                   .map((resp: Response) => {
                       let buggyDayDetails: Array< BuggyDayDetails > = resp.json();
                       buggyDayDetails.forEach((buggy: BuggyDayDetails)=>{
                        JsonService.deriveFullUrl(buggy.buggy, "buggyImage");
                       })
                    //  //??console.log("club flight service first - booking Opts : ", bookingOptions, resp, resp.json())
                       return buggyDayDetails;
                   }).catch(this.http.handleError);

    }

    public getCaddieDayDetails(clubId: number, forDate: string) {
        let _params = {};
        _params['clubId'] = clubId;
        _params['forDate'] = forDate;


        let request = new RemoteRequest(global.ServerUrls.getCaddyDayDetails,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, _params);
            return this.http.execute(request) 
                   .map((resp: Response) => {
                       let caddyDayDetails: Array<CaddyDayDetails> = resp.json();  
                       caddyDayDetails.forEach((caddy: CaddyDayDetails)=>{
                        JsonService.deriveFullUrl(caddy.caddy, "caddyImage");
                       })
                    //  //??console.log("club flight service first - booking Opts : ", bookingOptions, resp, resp.json())
                       return caddyDayDetails;
                   }).catch(this.http.handleError);

    }

    public changeSlot(bookingId: number, newSlot: TeeTimeSlotDisplay) {
        let _params = {};
        if(bookingId) _params['bookingId'] = bookingId;
        if(newSlot) _params['slotDayId'] = newSlot.slot.slotDayId;
        if(newSlot) _params['slotNo'] = newSlot.slot.slotNo;

        let request = new RemoteRequest(global.ServerUrls.changeSlot,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, _params);
        return this.http.execute(request)
                   .map((resp: Response) => {
                     //??console.log("change slot ", resp)
                    //    let bookingObject: TeeTimeBooking = resp.json();
                    //    bookingObject.bookingPlayers.forEach((player: TeeTimeBookingPlayer) => {
                           
                    //     JsonService.deriveFullUrl(player.player, "image");
                    //     JsonService.deriveFullUrl(player.player, "profile");
                    //         JsonService.deriveFullUrl(player.caddyAssigned, "caddyImage");
                    //         JsonService.deriveFullUrl(player.caddyPreferred, "caddyImage");
                    //        })
                       
                       return resp;
                    //    { resp, bookingObject}
                   }).catch(this.http.handleError);
    }

    public moveSlot(bookingId: number, newSlot: TeeTimeSlotDisplay) {
        let _params = {};
        if(bookingId) _params['bookingId'] = bookingId;
        if(newSlot) _params['teeOffDate'] = newSlot.slot.teeOffDate;
        if(newSlot) _params['slotNo'] = newSlot.slot.slotNo;

        let request = new RemoteRequest(global.ServerUrls.moveFlightSlot ,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, _params);
        return this.http.execute(request)
                   .map((resp: Response) => {
                     //??console.log("change slot ", resp)
                    //    let bookingObject: TeeTimeBooking = resp.json();
                    //    bookingObject.bookingPlayers.forEach((player: TeeTimeBookingPlayer) => {
                           
                    //     JsonService.deriveFullUrl(player.player, "image");
                    //     JsonService.deriveFullUrl(player.player, "profile");
                    //         JsonService.deriveFullUrl(player.caddyAssigned, "caddyImage");
                    //         JsonService.deriveFullUrl(player.caddyPreferred, "caddyImage");
                    //        })
                       
                       return resp;
                    //    { resp, bookingObject}
                   }).catch(this.http.handleError);
    }

    public rateForClub(clubId: number, clubRating: ClubRating) {
        let _params = {};
        if(clubRating) _params = clubRating;
        // if(clubId) _params['clubId'] = clubId;
        // if(rating) _params['rating'] = rating;
        // if(playerId) _params['playerId'] = playerId;

        let request = new RemoteRequest(global.ServerUrls.rateForClub+'/'+clubId ,
            RequestMethod.Post, ContentType.JSON, _params);
        return this.http.execute(request)
                   .map((resp: Response) => {
                     //??console.log("rate for club ", resp)
                       return resp;
                    //    { resp, bookingObject}
                   }).catch(this.http.handleError);
    }

    public rateForCaddy(caddieId: number, rating: number, playerId: number, comment: string) {
        let _params = {};
        // if(caddieId) _params['caddieId'] = caddieId;
        if(rating) _params['rating'] = rating;
        if(playerId) _params['playerId'] = playerId;
        if(comment) _params['comment'] = comment;
      //??console.log("rate for caddy - ",caddieId, _params)

        let request = new RemoteRequest(global.ServerUrls.rateForCaddie +'/'+caddieId+'?rating='+_params['rating']+'&playerId='+_params['playerId'] ,
            RequestMethod.Post, ContentType.PLAIN_TEXT, comment);
        return this.http.execute(request)
                   .map((resp: Response) => {
                     //??console.log("rate for caddie ", resp)
                       return resp;
                    //    { resp, bookingObject}
                   }).catch(this.http.handleError);
    }

    public getClubRatingItems(clubId: number) {
        let _params = {};
        _params['clubId'] = clubId;


        let request = new RemoteRequest(global.ServerUrls.getClubRatingItems+'/'+clubId,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA);
            return this.http.execute(request) 
                   .map((resp: Response) => {
                       let ratingItems: Array<RatingItem> = resp.json();
                    //  //??console.log("club flight service first - booking Opts : ", bookingOptions, resp, resp.json())
                       return ratingItems;
                   }).catch(this.http.handleError);

    }

    public getBookingStatsWithPlayerInfo(clubId: number, startDate?: string, endDate?: string, courseId?: number) {
        let _params = {};
        _params['startDate'] = startDate;
        _params['endDate'] = endDate;
        if(courseId) _params['courseId'] = courseId;
        let request = new RemoteRequest(global.ServerUrls.getBookingStats+'/'+clubId+global.ServerUrls.getBookStatPlayerInfo,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, _params);
            return this.http.execute(request) 
                   .map((resp: Response) => {
                       let bookingStats: BookingStatistics = resp.json();
                    //  //??console.log("club flight service first - booking Opts : ", bookingOptions, resp, resp.json())
                       return bookingStats;
                   }).catch(this.http.handleError);
    }

    public getBookingStats(clubId: number, startDate?: string, endDate?: string) {
        let _params = {};
        _params['startDate'] = startDate;
        _params['endDate'] = endDate;
        let request = new RemoteRequest(global.ServerUrls.getBookingStats+'/'+clubId,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, _params);
            return this.http.execute(request) 
                   .map((resp: Response) => {
                       let bookingStats: BookingStatistics = resp.json();
                    //  //??console.log("club flight service first - booking Opts : ", bookingOptions, resp, resp.json())
                       return bookingStats;
                   }).catch(this.http.handleError);
    }

    public getCourseUtilStats(clubId: number, startDate?: string, endDate?: string, courseId?: number) {
        let _params = {};
        _params['startDate'] = startDate;
        _params['endDate'] = endDate;
        if(courseId) _params['courseId'] = courseId;
        let request = new RemoteRequest(global.ServerUrls.getCourseUtilStats+'/'+clubId,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, _params);
            return this.http.execute(request) 
                   .map((resp: Response) => {
                       let courseUtilStats: CourseUtilizationStatistics = resp.json();
                    //  //??console.log("club flight service first - booking Opts : ", bookingOptions, resp, resp.json())
                       return courseUtilStats;
                   }).catch(this.http.handleError);
    }

    public getCaddyBuggyUtilStats(clubId: number, startDate?: string, endDate?: string, courseId?: number) {
        let _params = {};
        _params['startDate'] = startDate;
        _params['endDate'] = endDate;
        if(courseId) _params['courseId'] = courseId;
        let request = new RemoteRequest(global.ServerUrls.getCaddyBuggyStats +'/'+clubId,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, _params);
            return this.http.execute(request) 
                   .map((resp: Response) => {
                       let caddieBuggyAsgmtStats: CaddieBuggyAssignmentStatistics  = resp.json();
                    //  //??console.log("club flight service first - booking Opts : ", bookingOptions, resp, resp.json())
                       return caddieBuggyAsgmtStats;
                   }).catch(this.http.handleError);
    }

    public getCaddyBuggyDayStats(clubId: number, startDate?: string, endDate?: string, courseId?: number) {
        let _params = {};
        _params['startDate'] = startDate;
        _params['endDate'] = endDate;
        if(courseId) _params['courseId'] = courseId;
        let request = new RemoteRequest(global.ServerUrls.getCaddyBuggyDayStats +'/'+clubId,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, _params);
            return this.http.execute(request) 
                   .map((resp: Response) => {
                       let caddieBuggyAsgmtStats: CaddieBuggyStatistics  = resp.json();
                    //  //??console.log("club flight service first - booking Opts : ", bookingOptions, resp, resp.json())
                       return caddieBuggyAsgmtStats;
                   }).catch(this.http.handleError);
    }

    public getFutureStats(clubId: number) {
        let _params = {};
        let request = new RemoteRequest(global.ServerUrls.getFutureStats +'/'+clubId,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA);
            return this.http.execute(request) 
                   .map((resp: Response) => {
                       let futureStats: FutureBookingStatistics = resp.json();
                    //  //??console.log("club flight service first - booking Opts : ", bookingOptions, resp, resp.json())
                       return futureStats;
                   }).catch(this.http.handleError);
    } 

    public getFAQ() {
        let request = new RemoteRequest('http://'+global.MygolfServerHost+'/document/assets/faq.json',
            RequestMethod.Get);
        return this.http.execute(request) 
                   .map((resp: Response) => {
                    // console.log("get FAQ : ", resp)
                       let groupItems: Array<GroupItem> = resp.json();
                    //  //??console.log("get FAQ2 : ", groupItems)
                       return groupItems;
                   }).catch(this.http.handleError);
            // return this.http.get('/assets/shipping.json');
    }

    public getContactUs() {
        let request = new RemoteRequest('http://'+global.MygolfServerHost+'/document/assets/contact-us.json',
            RequestMethod.Get);
        return this.http.execute(request) 
                   .map((resp: Response) => {
                    // console.log("get FAQ : ", resp)
                       let contactUsItem: ContactUsItem = resp.json();
                    //  //??console.log("get FAQ2 : ", groupItems)
                       return contactUsItem;
                   }).catch(this.http.handleError);
            // return this.http.get('/assets/shipping.json');
    }

    public getHelp() {
      //??console.log("get help : ", global.MygolfServerHost)
        let request = new RemoteRequest('http://'+global.MygolfServerHost+'/document/assets/help.json',
            RequestMethod.Get);
        return this.http.execute(request) 
                   .map((resp: Response) => {
                  //??console.log("get help : ", resp)
                    // HelpURLs
                    let helpURL;
                       let _data: Array<HelpURLs> = resp.json();
                       helpURL = _data.map((h)=>{
                        return h
                    }).filter((h)=>{
                           return h.server.toLowerCase() === global.MygolfServerHost.toLowerCase();
                       })
                    //  //??console.log("get FAQ2 : ", groupItems)
                       return helpURL;
                   }).catch(this.http.handleError);
            // return this.http.get('/assets/shipping.json');
    }
    public getClubHelp() {
        let request = new RemoteRequest('http://'+global.MygolfServerHost+'/document/assets/clubHelp.json',
            RequestMethod.Get);
        return this.http.execute(request) 
                   .map((resp: Response) => {
                    // console.log("get FAQ : ", resp)
                       let clubHelpItem: Array<ClubHelpItem> = resp.json();
                    //  //??console.log("get FAQ2 : ", groupItems)
                       return clubHelpItem;
                   }).catch(this.http.handleError);
            // return this.http.get('/assets/shipping.json');
    }

    public clubBookingSlot(reqBookSlot?: TeeTimeSlotBookingRequest, addBookingPlayer: boolean = true, captchaResponse?: string ): Observable<any> {
        let _reqBookSlot = reqBookSlot;
        // reqBookSlot = {
        //     "courseId": 0,
        //     "teeOffDate": moment().format("YYYY-MM-DD"),
        //     "teeOffTimeFrom": moment().format("HH:mm"),
        //     "teeOffTimeTo":  moment().format("HH:mm"),
        //     "totalPlayers": 0,
        //       "buggyRequired": 0,
        //       "caddiesRequired": 0,
        //       "ninesPlaying": 0,
        //       "bookingName": "string",
        //       "bookingEmail": "string",
        //       "bookingPhone": "string",
        // }
        
        // "bookingRequestedAt":  moment().format("YYYY-MM-DD")
        
        let headers = {};
        if(captchaResponse && captchaResponse.length>0) headers['captcha-response'] = captchaResponse;
        else headers = null;

        let _addBookingPlayer = "?addBookingPlayer=" + (addBookingPlayer?"true":"false");
        let request = new RemoteRequest(global.ServerUrls.clubBookingSlot,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA,reqBookSlot, headers);
        return this.http.execute(request)
                   .map((resp: Response) => resp)
                //    .catch(this.handleError);
    }

    public clubRegisterUser(params: any) {

        // lastName: string,
        // gender: string,
        // email: string,
        // phone: string,
        // handicap: number,
        // teeoff: string,
        // countryId?: string): Observable<PlayerInfo> {
        // let request = new RemoteRequest(global.ServerUrls.registerFriend,
        //     RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, {
        //         firstName: firstName,
        //         lastName : lastName,
        //         gender   : gender,
        //         email    : email,
        //         teeoff   : teeoff,
        //         phone    : phone,
        //         handicap : handicap,
        //         country  : countryId,
        //     });

        // return this.http.execute(request)
        //            .map((resp: Response) => {
        //                let player: PlayerInfo = resp.json();
        //                return player;
        //            }).catch(this.http.handleError);


        let _params = {};
        _params = params?params:{};
        // // if(caddieId) _params['caddieId'] = caddieId;
        // if(rating) _params['rating'] = params.rating;
        // if(playerId) _params['playerId'] = playerId;

      //??console.log("club register user ", params);
      //??console.log("club register user local ", _params);
        let request = new RemoteRequest(global.ServerUrls.clubRegisterUser ,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, _params);
        return this.http.execute(request)
                   .map((resp: Response) => {
                     //??console.log("club register ", resp)
                       return resp;
                    //    { resp, bookingObject}
                   }).catch(this.http.handleError);
    }

    public clubCapturePayment(bookingOfflinePayment: BookingOfflinePayment) {
        let _params = {};
        _params = bookingOfflinePayment?bookingOfflinePayment:{};
        // // if(caddieId) _params['caddieId'] = caddieId;
        // if(rating) _params['rating'] = params.rating;
        // if(playerId) _params['playerId'] = playerId;

      //??console.log("club register user ", bookingOfflinePayment);
      //??console.log("club register user local ", _params);
        let request = new RemoteRequest(global.ServerUrls.clubCapturePayment ,
            RequestMethod.Post, ContentType.JSON, _params);
        return this.http.execute(request)
                   .map((resp: Response) => {
                     //??console.log("club capture payment ", resp)
                       return resp;
                    //    { resp, bookingObject}
                   }).catch(this.http.handleError);
    }
    public getCaddyRatings(caddyId: number, fromDate: string, toDate?: string) {
      //??console.log("get caddy ratings ", caddyId)
        let _params = {};
        let _caddyId = (caddyId)?"/"+caddyId:"";
        if(fromDate) _params['fromDate'] = fromDate;
        if(toDate) _params['toDate'] = toDate;
        let request = new RemoteRequest(global.ServerUrls.getCaddyRatings+_caddyId ,
            RequestMethod.Get,ContentType.URL_ENCODED_FORM_DATA, _params);
        return this.http.execute(request) 
                   .map((resp: Response) => {
                  //??console.log("get caddy ratings : ", resp)
                       let contactUsItem: ContactUsItem = resp.json();
                    //  //??console.log("get FAQ2 : ", groupItems)
                       return contactUsItem;
                   }).catch(this.http.handleError);
            // return this.http.get('/assets/shipping.json');
    }

    public getCaddyAssignments(caddyId: number, fromDate: string, toDate?: string) {
      //??console.log("get caddy assignments ", caddyId)
        let _params = {};
        let _caddyId = (caddyId)?"/"+caddyId:"";
        if(fromDate) _params['fromDate'] = fromDate;
        if(toDate) _params['toDate'] = toDate;
        let request = new RemoteRequest(global.ServerUrls.getCaddyAssignments+_caddyId,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, _params);
        return this.http.execute(request) 
                   .map((resp: Response) => {
                  //??console.log("get caddy assignments : ", resp)
                       let caddyAssignment: Array<CaddyAssignment> = resp.json();
                    //  //??console.log("get FAQ2 : ", groupItems)
                       return {resp, caddyAssignment};
                   }).catch(this.http.handleError);
            // return this.http.get('/assets/shipping.json');
    }

    public getCaddyInfo(caddyId?: number) {
      //??console.log("get caddy info ", caddyId)
        let _caddyId = (caddyId)?"/"+caddyId:"";
        let request = new RemoteRequest(global.ServerUrls.getCaddyInfo+_caddyId,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA);
        return this.http.execute(request) 
                   .map((resp: Response) => {
                  //??console.log("get caddy info : ", resp)
                       let contactUsItem: ContactUsItem = resp.json();
                    //  //??console.log("get FAQ2 : ", groupItems)
                       return contactUsItem;
                   }).catch(this.http.handleError);
            // return this.http.get('/assets/shipping.json');
    }

    public getListClubPlayerVouchers(clubId?: number, playerId?: number) {
      //??console.log("get club id ", clubId);
      //??console.log("get player id ", playerId);
        // let _caddyId = (caddyId)?"/"+caddyId:"";
        let _params = {};
        if(clubId) _params['clubId'] = clubId;
        if(playerId) _params['playerId'] = playerId;
        let request = new RemoteRequest(global.ServerUrls.listActiveClubPlayerVouchers,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, _params);
        return this.http.execute(request) 
                   .map((resp: Response) => {
                  //??console.log("get voucher : ", resp)
                       let voucherList: Array<TeeTimeClubVoucher> = resp.json();
                    //  //??console.log("get FAQ2 : ", groupItems)
                       return voucherList;
                   }).catch(this.http.handleError);
            // return this.http.get('/assets/shipping.json');
    }

    public setRefundBookingPlayer(bookingId: number, playerId: number, amount: number, reason: string, refundMode: string = 'CASH'): Observable<any> {
        let _params = {};
        if(bookingId) _params['bookingId'] = bookingId;
        if(playerId) _params['playerId'] = playerId;
        if(amount) _params['amount'] = amount;
        if(reason) _params['reason'] = reason;
        if(refundMode) _params['refundMode'] = refundMode;

        let request = new RemoteRequest(global.ServerUrls.setRefundBookingPlayer,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA,_params);
        return this.http.execute(request)
                   .map((resp: Response) => {
                  //??console.log("set refund booking player : ", resp)
                    return resp;
                }) 
    }

    public applyPlayerBookingVoucher(bookingId: number, voucherId: number, force?: boolean): Observable<any> {
        let _params = {};
        if(bookingId) _params['bookingId'] = bookingId;
        if(voucherId) _params['voucherId'] = voucherId;
        if(force) _params['force'] = force;

        let request = new RemoteRequest(global.ServerUrls.applyPlayerBookingVoucher,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA,_params);
        return this.http.execute(request)
                   .map((resp: Response) => {
                  //??console.log("apply booking player voucher : ", resp)
                    return resp;
                }) 
    }

    public removePlayerBookingVoucher(bookingId: number, voucherId: number): Observable<any> {
        let _params = {};
        if(bookingId) _params['bookingId'] = bookingId;
        if(voucherId) _params['voucherId'] = voucherId;

        let request = new RemoteRequest(global.ServerUrls.removePlayerBookingVoucher,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA,_params);
        return this.http.execute(request)
                   .map((resp: Response) => {
                  //??console.log("remove booking player voucher: ", resp)
                    return resp;
                }) 
    }

    public getClubVoucherSeries(url: number,clubId: number,search?: string, pageSize?: number, pageNo?: number, showAll?: boolean) {
      //??console.log("get club id ", clubId);
        // console.log("get player id ", playerId);
        // let _caddyId = (caddyId)?"/"+caddyId:"";
        let _params = {};
        if(clubId) _params['clubId'] = clubId;
        if(pageNo) _params['pageNo'] = pageNo;
        if(pageSize) _params['pageSize'] = pageSize;
        if(search) _params['search'] = search;
        if(showAll) _params['activeOnly'] = false;
        let _url;
        if(url===1) _url = global.ServerUrls.listClubVoucherSeries;
        if(url===2) _url = 'assets/club-voucher-series.json';
        let request = new RemoteRequest(_url,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, _params);
        return this.http.execute(request) 
                   .map((resp: Response) => {
                  //??console.log("get voucher series : ", resp)
                       let voucherList: Array<TeeTimeClubVoucher> = resp.json();
                    //  //??console.log("get FAQ2 : ", groupItems)
                       return voucherList;
                   }).catch(this.http.handleError);
            // return this.http.get('/assets/shipping.json');
    }

    public assignClubPlayerVoucher(clubId: number, playerId: number, voucherSeriesId: number, numberOfVouchers: number, validFrom?: string): Observable<any> {
        let _params = {};
        if(clubId) _params['clubId'] = clubId;
        if(playerId) _params['playerId'] = playerId;
        if(voucherSeriesId) _params['voucherSeriesId'] = voucherSeriesId;
        if(numberOfVouchers) _params['numberOfVouchers'] = numberOfVouchers;
        if(validFrom) _params['validFrom'] = validFrom;

        let request = new RemoteRequest(global.ServerUrls.assignClubPlayerVoucher,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA,_params);
        return this.http.execute(request)
                   .map((resp: Response) => {
                  //??console.log("assigning club player voucher : ", resp)
                    return resp;
                }) 
    }

    public getListPlayerVouchers (playerId?: number) {
      //??console.log("get player id ", playerId);
        // let _caddyId = (caddyId)?"/"+caddyId:"";
        let _params = {};
        if(playerId) _params['playerId'] = playerId;
        let request = new RemoteRequest(global.ServerUrls.listActivePlayerVouchers,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, _params);
        return this.http.execute(request) 
                   .map((resp: Response) => {
                  //??console.log("get voucher : ", resp)
                       let voucherList: Array<TeeTimeClubVoucher> = resp.json();
                    //  //??console.log("get FAQ2 : ", groupItems)
                       return voucherList;
                   }).catch(this.http.handleError);
            // return this.http.get('/assets/shipping.json');
    }

    public getListClubDiscounts(clubId: number, search?: string, pageSize?: number, pageNo?: number) {
      //??console.log("get club id ", clubId);
        // let _caddyId = (caddyId)?"/"+caddyId:"";
        let _params = {};
        if(clubId) _params['clubId'] = clubId;
        if(search) _params['search'] = search;
        if(pageSize) _params['pageSize'] = pageSize;
        if(pageNo) _params['pageNo'] = pageNo;
        let request = new RemoteRequest(global.ServerUrls.listClubDiscounts,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, _params);
        return this.http.execute(request) 
                   .map((resp: Response) => {
                  //??console.log("get voucher : ", resp)
                       let listClubDiscount: any = resp.json();
                    //  //??console.log("get FAQ2 : ", groupItems)
                       return listClubDiscount;
                   }).catch(this.http.handleError);
            // return this.http.get('/assets/shipping.json');
    }

    
    public getActiveListClubDiscounts(clubId: number, effectiveDate?: string) {
      //??console.log("get club id ", clubId);
        // let _caddyId = (caddyId)?"/"+caddyId:"";
        let _params = {};
        if(clubId) _params['clubId'] = clubId;
        if(effectiveDate) _params['effectiveDate'] = effectiveDate;
        let request = new RemoteRequest(global.ServerUrls.listActiveDiscounts ,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, _params);
        return this.http.execute(request) 
                   .map((resp: Response) => {
                  //??console.log("get voucher : ", resp)
                       let listClubDiscount: any = resp.json();
                    //  //??console.log("get FAQ2 : ", groupItems)
                       return listClubDiscount;
                   }).catch(this.http.handleError);
            // return this.http.get('/assets/shipping.json');
    }

    public unassignClubPlayerVoucher(clubId: number, playerId: number, voucherIds: Array<number>): Observable<any> {
        let _params = {};
        if(clubId) _params['clubId'] = clubId;
        if(playerId) _params['playerId'] = playerId;
        if(voucherIds) _params['voucherIds'] = voucherIds;

      //??console.log("unassign club player voucher", _params)
        // if(1) return null;

        let request = new RemoteRequest(global.ServerUrls.unassignClubPlayerVoucher,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA,_params);
        return this.http.execute(request)
                   .map((resp: Response) => {
                  //??console.log("assigning club player voucher : ", resp)
                    return resp;
                }) 
    }

    public getApplicableClubPlayerTypes(clubId: number, playerId: number, effectiveDate?: string) {
        let _params = {};
        if(clubId) _params['clubId'] = clubId;
        if(playerId) _params['playerId'] = playerId;
        if(effectiveDate) _params['effectiveDate'] = effectiveDate;
        let request = new RemoteRequest(global.ServerUrls.getClubApplicablePlayerTypes,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, _params);
            return this.http.execute(request)
                   .map((resp: Response) => {
                       let player: PlayerData = resp.json();
                     //??console.log("get applicable club player types : ", resp)
                       return player;
                   }).catch(this.http.handleError);
    }

    public applyPlayerBookingDiscount(bookingId: number, discountId: number, bookingPlayerId?: number, force?: boolean): Observable<any> {
        let _params = {};
        if(bookingId) _params['bookingId'] = bookingId;
        if(discountId) _params['discountId'] = discountId;
        if(bookingPlayerId) _params['bookingPlayerId'] = bookingPlayerId;
        if(force) _params['force'] = force;

        let request = new RemoteRequest(global.ServerUrls.applyPlayerBookingDiscount ,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA,_params);
        return this.http.execute(request)
                   .map((resp: Response) => {
                  //??console.log("apply booking player discount : ", resp)
                    return resp;
                }) 
    }

    public removePlayerBookingDiscount(bookingId: number, discountId: number, bookingPlayerId?: number): Observable<any> {
        let _params = {};
        if(bookingId) _params['bookingId'] = bookingId;
        if(discountId) _params['discountId'] = discountId;
        if(bookingPlayerId) _params['bookingPlayerId'] = bookingPlayerId;

        let request = new RemoteRequest(global.ServerUrls.removePlayerBookingDiscount,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA,_params);
        return this.http.execute(request)
                   .map((resp: Response) => {
                  //??console.log("remove booking player voucher: ", resp)
                    return resp;
                }) 
    }

    public getDiscountCompanies(search?: string, pageSize: number = 30, pageNo: number = 1) {
        let _params = {};
        if(search) _params['search'] = search;
        if(pageSize) _params['pageSize'] = pageSize;
        if(pageNo) _params['pageNo'] = pageNo;
        let request = new RemoteRequest(global.ServerUrls.listDiscountCompanies,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, _params);
            return this.http.execute(request)
                   .map((resp: Response) => {
                       let player: PlayerData = resp.json();
                     //??console.log("get list discount companies : ", resp)
                       return player;
                   }).catch(this.http.handleError);
    }

    public createPlayerDiscountCard(playerId: number, programId: string, membershipNo?: string, validFrom?: string, validUntil?: string): Observable<any> {
        let _params = {};
        if(playerId) _params['playerId'] = playerId;
        if(programId) _params['programId'] = programId;
        if(membershipNo) _params['membershipNo'] = membershipNo;
        if(validFrom) _params['validFrom'] = validFrom;
        if(validUntil) _params['validUntil'] = validUntil;
        let request = new RemoteRequest(global.ServerUrls.createPlayerDiscountCard,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA,_params);
        return this.http.execute(request)
                   .map((resp: Response) => {
                  //??console.log("create player discount card: ", resp)
                    return resp;
                }) 
    }

    public deletePlayerDiscountCard(playerDiscountId: number): Observable<any> {
        let _params = {};
        if(playerDiscountId) _params['playerDiscountId'] = playerDiscountId;
        let request = new RemoteRequest(global.ServerUrls.deletePlayerDiscountCard,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA,_params);
        return this.http.execute(request)
                   .map((resp: Response) => {
                  //??console.log("delete player discount card: ", resp)
                    return resp;
                }) 
    }

    public applyForClubVerifyDiscountCard(playerId: number, programId: string, clubId?: number): Observable<any> {
        let _params = {};
        if(playerId) _params['playerId'] = playerId;
        if(programId) _params['programId'] = programId;
        if(clubId) _params['clubId'] = clubId;
        let request = new RemoteRequest(global.ServerUrls.applyForClubVerifyDiscountCard,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA,_params);
        return this.http.execute(request)
                   .map((resp: Response) => {
                  //??console.log("apply for verifiy player discount card: ", resp)
                    return resp;
                }) 
    }

    public approvePlayerDiscountCard(playerId: number, programId: string, clubId: number, validFrom?: string, validUntil?: string): Observable<any> {
        let _params = {};
        if(playerId) _params['playerId'] = playerId;
        if(programId) _params['programId'] = programId;
        if(clubId) _params['clubId'] = clubId;
        if(validFrom) _params['validFrom'] = validFrom;
        if(validUntil) _params['validUntil'] = validUntil;
        let request = new RemoteRequest(global.ServerUrls.approvePlayerDiscountCard,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA,_params);
        return this.http.execute(request)
                   .map((resp: Response) => {
                  //??console.log("apply for verifiy player discount card: ", resp)
                    return resp;
                }) 
    }
    public approveMultiPlayerDiscountCard(playerId: number, programId: string, clubId: number, validFrom?: string, validUntil?: string): Observable<any> {
        let _params = {};
        if(playerId) _params['playerId'] = playerId;
        if(programId) _params['programId'] = programId;
        if(clubId) _params['clubId'] = clubId;
        if(validFrom) _params['validFrom'] = validFrom;
        if(validUntil) _params['validUntil'] = validUntil;
        let request = new RemoteRequest(global.ServerUrls.approveMultiPlayerDiscountCard,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA,_params);
        return this.http.execute(request)
                   .map((resp: Response) => {
                  //??console.log("apply for verifiy player discount card: ", resp)
                    return resp;
                }) 
    }
    public undoApprovePlayerDiscountCard(playerId: number, programId: string, clubId: number, pdpId?: number): Observable<any> {
        let _params = {};
        if(playerId) _params['playerId'] = playerId;
        if(programId) _params['programId'] = programId;
        if(clubId) _params['clubId'] = clubId; 
        if(pdpId) _params['playerDiscountProgramId'] = pdpId;
        let request = new RemoteRequest(global.ServerUrls.undoApprovePlayerDiscountCard,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA,_params);
        return this.http.execute(request)
                   .map((resp: Response) => {
                  //??console.log("apply for verifiy player discount card: ", resp)
                    return resp;
                }) 
    }

    public getPlayerDiscountPrograms(playerId: string) {
        let _params = {};
        if(playerId) _params['playerId'] = playerId;
        let request = new RemoteRequest(global.ServerUrls.listPlayerDiscountPrograms,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, _params);
            return this.http.execute(request)
                   .map((resp: Response) => {
                       let player: PlayerData = resp.json();
                     //??console.log("get list player discount programs : ", resp)
                       return player;
                   }).catch(this.http.handleError);
    }

    public listDiscountProgramsClub(programId: string) {
        let _params = {};
        if(programId) _params['programId'] = programId;
        let request = new RemoteRequest(global.ServerUrls.listDiscountProgramsClub,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, _params);
            return this.http.execute(request)
                   .map((resp: Response) => {
                    //    let player: PlayerData = resp.json();
                     //??console.log("get list player discount programs : ", resp)
                       return resp;
                   }).catch(this.http.handleError);
    }

    public getDiscountPrograms(companyId: string) {
        let _params = {};
        if(companyId) _params['companyId'] = companyId;
        let request = new RemoteRequest(global.ServerUrls.listDiscountPrograms,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, _params);
            return this.http.execute(request)
                   .map((resp: Response) => {
                       let player: PlayerData = resp.json();
                     //??console.log("get list discount programs : ", resp)
                       return player;
                   }).catch(this.http.handleError);
    }

    public getPlayerCredits(playerId: number) {
        let _params = {};
        if(playerId) _params['playerId'] = playerId;
        let request = new RemoteRequest(global.ServerUrls.getPlayerCredits,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, _params);
            return this.http.execute(request)
                   .map((resp: Response) => {
                       let player: PlayerData = resp.json();
                     //??console.log("get list player credits : ", resp)
                       return player;
                   }).catch(this.http.handleError);
    }

    public getPlayerClubCredits(playerId: number, clubId: number) {
        let _params = {};
        if(playerId) _params['playerId'] = playerId;
        if(clubId) _params['clubId'] = clubId;
        let request = new RemoteRequest(global.ServerUrls.getPlayerClubCredits,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, _params);
            return this.http.execute(request)
                   .map((resp: Response) => {
                       let player: PlayerData = resp.json();
                     //??console.log("get list player credits : ", resp)
                       return player;
                   }).catch(this.http.handleError);
    }
    public getVouchersIssued(clubId: number, seriesId?: number, search?: string, includeRedeemed: boolean = false,
         includeExpired: boolean = false, pageSize: number = 999, pageNo: number = 1) {
        let _params = {};
        if(clubId) _params['clubId'] = clubId;
        if(seriesId) _params['seriesId'] = seriesId;
        if(search) _params['search'] = search;
        if(includeRedeemed) _params['includeRedeemed'] = includeRedeemed;
        if(includeExpired) _params['includeExpired'] = includeExpired;
        if(pageSize) _params['pageSize'] = pageSize;
        if(pageNo) _params['pageNo'] = pageNo;

        let request = new RemoteRequest(global.ServerUrls.listClubVouchersIssued,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, _params);
            return this.http.execute(request)
                   .map((resp: Response) => {
                       let player: PlayerData = resp.json();
                     //??console.log("get list club vouchers issued : ", resp)
                       return player;
                   }).catch(this.http.handleError);
    }

    public redeemPlayerClubCredit(bookingId: number, playerId: number, amount: number): Observable<any> {
        let _params = {};
        if(bookingId) _params['bookingId'] = bookingId;
        if(playerId) _params['playerId'] = playerId;
        if(amount) _params['amount'] = amount;
        let request = new RemoteRequest(global.ServerUrls.redeemClubCredit,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA,_params);
        return this.http.execute(request)
                   .map((resp: Response) => {
                  //??console.log("apply for verifiy player discount card: ", resp)
                    return resp;
                }) 
    }

    
    public getListAllCardApplyForPlayer(playerId: number, programId: string, pendingOnly: boolean = false, includeExpired: boolean = false) {
       let _params = {};
       if(playerId) _params['playerId'] = playerId;
       if(programId) _params['programId'] = programId;
       if(pendingOnly) _params['pendingOnly'] = pendingOnly;
       if(includeExpired) _params['includeExpired'] = includeExpired;

       let request = new RemoteRequest(global.ServerUrls.listAllCardApplyForPlayer,
           RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, _params);
           return this.http.execute(request)
                  .map((resp: Response) => {
                    //   let player: PlayerData = resp.json();
                    //??console.log("get list club vouchers issued : ", resp)
                      return resp;
                  }).catch(this.http.handleError);
   }

   public getListAllPlayersCardDiscount(clubId: number, programId?: string, pendingOnly: boolean = false, includeExpired: boolean = false) {
    let _params = {};
    if(clubId) _params['clubId'] = clubId;
    if(programId) _params['programId'] = programId;
    if(pendingOnly) _params['pendingOnly'] = pendingOnly;
    if(includeExpired) _params['includeExpired'] = includeExpired;

    let request = new RemoteRequest(global.ServerUrls.listAllPlayersCardDiscount,
        RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, _params);
        return this.http.execute(request)
               .map((resp: Response) => {
                 //   let player: PlayerData = resp.json();
                 //??console.log("get list club vouchers issued : ", resp)
                   return resp;
               }).catch(this.http.handleError);
}

public getListClubDiscountProgram(clubId: number, programId: string) {
    let _params = {};
    if(clubId) _params['clubId'] = clubId;
    if(programId) _params['programId'] = programId;

    let request = new RemoteRequest(global.ServerUrls.listClubDiscountProgram,
        RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, _params);
        return this.http.execute(request)
               .map((resp: Response) => {
                 //   let player: PlayerData = resp.json();
                 //??console.log("get list club vouchers issued : ", resp)
                   return resp;
               }).catch(this.http.handleError);
}

public getApplicableDiscountsForPlayer(clubId: number, playerId: number, effectiveDate?: string) {
    let _params = {};
    if(clubId) _params['clubId'] = clubId;
    if(playerId) _params['playerId'] = playerId;
    if(effectiveDate) _params['effectiveDate'] = effectiveDate;

    let request = new RemoteRequest(global.ServerUrls.getApplicableDiscountsForPlayer,
        RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, _params);
        return this.http.execute(request)
               .map((resp: Response) => {
                let listClubDiscount: any = resp.json();
                 //   let player: PlayerData = resp.json();
                 //??console.log("get list club vouchers issued : ", resp)
                   return listClubDiscount;
               }).catch(this.http.handleError);
}

public updatePlayerCardDocument(imageURL: string, contentType: string, playerDiscountProgramId: number, authToken?: string): Observable<UploadResult> {
    // public updatePlayerPhoto(imageUrl: string, mimeType: string, playerId?: number): Observable<UploadResult>{
        let _pDiscountProgId;
        if(playerDiscountProgramId) _pDiscountProgId = "?id="+playerDiscountProgramId;
        let options = {
            // "playerId": (playerId)? playerId:this.session.playerId
            file: imageURL,
            authToken: authToken
        }

        return Observable.fromPromise(this.ftService.uploadFile(imageURL,global.ServerUrls.updatePlayerDiscountDocument+_pDiscountProgId,
            contentType, options));
    }

    public addPlayerType(imageURL: string, contentType: string, playerId: number, bookingPlayerType: string, authToken?: string): Observable<UploadResult> {
        // public updatePlayerPhoto(imageUrl: string, mimeType: string, playerId?: number): Observable<UploadResult>{
            let _playerId;
            let _playerType;
            if(playerId) _playerId = "playerId="+playerId;
            if(bookingPlayerType) _playerType = "&bookingPlayerType="+bookingPlayerType
            let options = {
                // "playerId": (playerId)? playerId:this.session.playerId
                file: imageURL,
                authToken: authToken
            }
    
            return Observable.fromPromise(this.ftService.uploadFile(imageURL,global.ServerUrls.assignBookingPlayerType+'?'+_playerId+_playerType,
                contentType, options));
        }

// public updatePlayerPhoto(imageURL: string,
//     contentType: string, playerId: number, friend: boolean=false): Observable<PlayerInfo> {
//     return this.playerService.updatePlayerPhoto(imageURL, contentType, playerId)
//         .map((uploadResult: UploadResult)=>{
//             let playerInfo: PlayerInfo;
//             let errMsg: PlayerInfo;
//           //??console.log("[photo] updatePlayerPhoto actions ", uploadResult);
//           //??console.log("[photo] playerInfo ", playerInfo)
//             playerInfo = JSON.parse(JSON.stringify(uploadResult.message));
//             // errMsg = JSON.parse(JSON.stringify(uploadResult.message));
//             // playerInfo.errorMessage = errMsg.errorMessage;
//             // playerInfo.errorMessage = JSON.parse(JSON.stringify(uploadResult.message));
//           //??console.log("[photo] playerInfo | after ", playerInfo)
//             JsonService.deriveFullUrl(playerInfo, "photoUrl");
//             JsonService.deriveFullUrl(playerInfo, "thumbnail");
//             if(!friend) {
//                 //The upload result message is player info
//                 this.store.dispatch(createAction(PlayerHomeActions.UPDATE_PLAYER_PROFILE, playerInfo));
//             }
//             return playerInfo;
//         });
// }
public recalculateBookingPricing(bookingId: number) {
    let _params = {};
    if(bookingId) _params['bookingId'] = bookingId;

    let request = new RemoteRequest(global.ServerUrls.recalculateBookingPricing,
        RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, _params);
        return this.http.execute(request)
               .map((resp: Response) => {
                let bookingObject: any = resp.json();
                 //   let player: PlayerData = resp.json();
                 //??console.log("get list club vouchers issued : ", resp)
                   return bookingObject;
               }).catch(this.http.handleError);
}
    public bookingWaiveOff(bookingId: number, amount: number, reason?: string): Observable<any> {
        let _params = {};
        if(bookingId) _params['bookingId'] = bookingId;
        if(amount) _params['amount'] = amount;
        if(reason) _params['reason'] = reason;

        let request = new RemoteRequest(global.ServerUrls.bookingWaiveOff,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA,_params);
        return this.http.execute(request)
                .map((resp: Response) => {
                  //??console.log("waive off booking : ", resp)
                    return resp;
                }) 
    }

    public undoBookingWaiveOff(bookingId: number, sequence: number): Observable<any> {
        let _params = {};
        if(bookingId) _params['bookingId'] = bookingId;
        if(sequence) _params['sequence'] = sequence;

        let request = new RemoteRequest(global.ServerUrls.undoBookingWaiveOff,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA,_params);
        return this.http.execute(request)
                .map((resp: Response) => {
                  //??console.log("waive off booking : ", resp)
                    return resp;
                }) 
    }

    public assignBookingPlayerType(playerId: number, bookingPlayerType: string): Observable<any> {
        let _params = {};
        if(playerId) _params['playerId'] = playerId;
        if(bookingPlayerType) _params['bookingPlayerType'] = bookingPlayerType;

        let request = new RemoteRequest(global.ServerUrls.assignBookingPlayerType,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA,_params);
        return this.http.execute(request)
                .map((resp: Response) => {
                  //??console.log("waive off booking : ", resp)
                    return resp;
                }) 
    }

    public assignableBookingPlayerType() {
        let _params = {};
        // if(clubId) _params['clubId'] = clubId;
        // if(playerId) _params['playerId'] = playerId;
        // if(effectiveDate) _params['effectiveDate'] = effectiveDate;
    
        let request = new RemoteRequest(global.ServerUrls.assignableBookingPlayerType,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA);
            return this.http.execute(request)
                   .map((resp: Response) => {
                    let data: any = resp.json();
                     //   let player: PlayerData = resp.json();
                     //??console.log("get list club vouchers issued : ", resp)
                       return data;
                   }).catch(this.http.handleError);
    }

    
    public assignedBookingPlayerType(playerId: number) {
        let _params = {};
        // if(clubId) _params['clubId'] = clubId;
        if(playerId) _params['playerId'] = playerId;
        // if(effectiveDate) _params['effectiveDate'] = effectiveDate;
    
        let request = new RemoteRequest(global.ServerUrls.assignedBookingPlayerType,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, _params);
            return this.http.execute(request)
                   .map((resp: Response) => {
                    let data: Array<any> = resp.json();
                    data.forEach((d)=>{
                        JsonService.deriveFulImageURL(d,'supportingDocument')
                    })
                     //   let player: PlayerData = resp.json();
                     //??console.log("get list club vouchers issued : ", resp)
                       return data;
                   }).catch(this.http.handleError);
    }



    public removeBookingPlayerType(playerId: number, bookingPlayerType: string): Observable<any> {
        let _params = {};
        if(playerId) _params['playerId'] = playerId;
        if(bookingPlayerType) _params['bookingPlayerType'] = bookingPlayerType;

        let request = new RemoteRequest(global.ServerUrls.removeBookingPlayerType,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA,_params);
        return this.http.execute(request)
                .map((resp: Response) => {
                  //??console.log("waive off booking : ", resp)
                    return resp;
                }) 
    }


    public getClubMembersList(clubId: number, params?: any) {
        // ,activeOnly?: boolean, search?: string
        let _params = {};
        // if(clubId) _params['clubId'] = clubId;
        // if(clubId) _params['clubId'] = clubId;
        let _status;
        if(params['activeOnly']) _params['activeOnly'] = params['activeOnly'];
        if(params['search']) _params['search'] = params['search'];
        if(params['status']) _status = params['status'];
        // if(effectiveDate) _params['effectiveDate'] = effectiveDate;

        let _clubMembersURL = global.ServerUrls.listClubMembership+'/'+clubId;
        if(_status) _clubMembersURL += '/' + _status;
    
        let request = new RemoteRequest(_clubMembersURL,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, _params);
            return this.http.execute(request)
                   .map((resp: Response) => {
                    let data: Array<ClubMembership> = resp.json();
                    data.forEach((d: ClubMembership)=>{
                        JsonService.deriveFulImageURL(d.player ,'profile')
                        JsonService.deriveFulImageURL(d.player ,'image')
                        d.player.playerId = d.player.id;
                    })
                     //   let player: PlayerData = resp.json();
                     //??console.log("get list club members : ", resp)
                       return data;
                   }).catch(this.http.handleError);
    }

    public updatePlayerClubMembership(mode: string, params: any): Observable<any> {
        let _params = {};
        // params['handicapSystem'] = _hcpSys;
        _params['membership'] = params['membership'];
        let _playerId = params['playerId'];
        let _clubId = params['clubId'];
        let _mode;
        if(mode) _mode = mode;
        let _clubMembersURL = global.ServerUrls.listClubMembership+"/"+_clubId;
        if(_mode === 'approve') _clubMembersURL += global.ServerUrls.approveClubMembership+_playerId;
        else if(_mode === 'suspend') _clubMembersURL += global.ServerUrls.suspendClubMembership+_playerId;
        // console.log("Get player handicap index", playerId, params)
        let request = new RemoteRequest(_clubMembersURL,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, params);
            return this.http.execute(request)
            .map((resp: Response) => {
                let result: any = resp.json();
              //??console.log("Sync player handicap index result ",result)
                return result;
            }).catch(this.http.handleError)
    }

    public getHandicapSystemList() {
        let _params = {};
      //??console.log("get handicap system list : ", global.ServerUrls.getHandicapSystemList)
    
        let request = new RemoteRequest(global.ServerUrls.getHandicapSystemList,
            RequestMethod.Get, ContentType.XML);
            return this.http.execute(request)
                   .map((resp: Response) => {
                    let data:  any = resp.json();
                    // Array<HandicapSystem>
                     //   let player: PlayerData = resp.json();
                     //??console.log("get handicap system list : ", resp)
                       return data;
                   }).catch(this.http.handleError);
    }

    public getPlayerHandicapIndex(playerId: number, handicapSystem: string): Observable<any> {
        let params = {};
        let _hcpSys = handicapSystem;
        params['handicapSystem'] = _hcpSys;
      //??console.log("Get player handicap index", playerId, params)
        let request = new RemoteRequest(global.ServerUrls.getPlayerHcpIdx+"/"+playerId,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, params);
            return this.http.execute(request)
            .map((resp: Response) => {
                let result: any = resp.json();
              //??console.log("Get player handicap index result ",result)
                return result;
            }).catch(this.http.handleError)
    }

    public syncPlayerHandicapIndex(playerId: number, handicapSystem: string): Observable<any> {
        let params = {};
        let _hcpSys = handicapSystem;
        params['handicapSystem'] = _hcpSys;
        params['playerId'] = playerId;
      //??console.log("Get player handicap index", playerId, params)
        let request = new RemoteRequest(global.ServerUrls.syncHandicapIndex+"/"+playerId,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, params);
            return this.http.execute(request)
            .map((resp: Response) => {
                let result: any = resp.json();
              //??console.log("Sync player handicap index result ",result)
                return result;
            }).catch(this.http.handleError)
    }

    public getLatestCourseHandicap(playerId?: number,teeBox?: string,firstNineCourse?: number,secondNineCourse?: number): Observable<any> {
        let hdrs = {};
        if(isPresent(playerId)) hdrs["Player-Id"] = playerId;
      //??console.log("get handicap history : ", playerId);
      //??console.log("get handicap history : ", hdrs);
        let params = {};
        params['playerId'] = playerId;
        params['teeBox'] = teeBox;
        params['firstNine'] = firstNineCourse;
        params['secondNine'] = secondNineCourse;
        let _paramUrl = playerId + "/" + teeBox;
        let request = new RemoteRequest(global.ServerUrls.getLatestCourseHandicap + _paramUrl,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, params);
            return this.http.execute(request)
            .map((resp: Response) => {
              //??console.log("Latest Course Handicap ",resp)
                let courseHandicap: any = resp.json();
                return courseHandicap;
            }).catch(this.http.handleError)
    }

    public checkLeagueCompetition(compId?: number): Observable<any> {
        let hdrs = {};
        let params = {};
        let _url = global.ServerUrls.leagueEclectic;
        let _compId = "/"+compId;
        let request = new RemoteRequest(global.ServerUrls.getLeagueCompetition + _compId + _url,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA);
            return this.http.execute(request)
            .map((resp: Response) => {
              //??console.log("Check league competition : ",resp)
                let eclectic: any = resp.json();
                return eclectic;
            }).catch(this.http.handleError)
    }

    public getLeagueScorecards(compId?: number): Observable<any> {
        let hdrs = {};
        let params = {};
        let _url = global.ServerUrls.leagueScorecards;
        let _compId = "/"+compId;
        let request = new RemoteRequest(global.ServerUrls.getLeagueCompetition + _compId + _url,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA);
            return this.http.execute(request)
            .map((resp: Response) => {
              //??console.log("Check league scorecards : ",resp)
                let scorecards: LeagueScorecards = resp.json();
                scorecards.playerRounds.forEach((p: EclecticPlayerRound)=>{
                    JsonService.deriveFulImageURL(p, 'photo')
                })
                return scorecards;
            }).catch(this.http.handleError)
    }

    public getLeagueLeaderboard(compId?: number): Observable<any> {
        let hdrs = {};
        let params = {};
        let _url = global.ServerUrls.leagueLeaderboard;
        let _compId = "/"+compId;
        let request = new RemoteRequest(global.ServerUrls.getLeagueCompetition + _compId + _url,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA);
            return this.http.execute(request)
            .map((resp: Response) => {
              //??console.log("Check league leaderboard : ",resp)
                let leagueLeaderboard: LeagueLeaderboard = resp.json();
                leagueLeaderboard.playerRounds.forEach((p: EclecticPlayerRound)=>{
                    JsonService.deriveFulImageURL(p ,'photo');
                })
                return leagueLeaderboard;
            }).catch(this.http.handleError)
    }

    public getLeagueSeason(compId?: number): Observable<any> {
        let hdrs = {};
        let params = {};
        let _url = global.ServerUrls.getLeagueSeason;
        let _compId = "/"+compId;
        let request = new RemoteRequest(global.ServerUrls.getLeagueCompetition + _compId + _url,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA);
            return this.http.execute(request)
            .map((resp: Response) => {
              //??console.log("Check league scorecards : ",resp)
                let leagueSeason: any = resp.json();
                return leagueSeason;
            }).catch(this.http.handleError)
    }

    public getLeagueRounds(seasonId?: number): Observable<any> {
        let hdrs = {};
        let params = {};
        let _url = global.ServerUrls.leagueRounds;
        let _seasonId = "/"+seasonId;
        let request = new RemoteRequest(global.ServerUrls.getLeague + _seasonId + _url,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA);
            return this.http.execute(request)
            .map((resp: Response) => {
              //??console.log("Check league rounds : ",resp)
                let leagueRounds: any = resp.json();
                return leagueRounds;
            }).catch(this.http.handleError)
    }

    public getLeagueLowestLeaderboard(seasonId?: number): Observable<any> {
        let hdrs = {};
        let params = {};
        let _url = global.ServerUrls.leagueLowestGrossLeaderboard;
        let _seasonId = "/"+seasonId;
        let request = new RemoteRequest(global.ServerUrls.getLeague + _seasonId + _url,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA);
            return this.http.execute(request)
            .map((resp: Response) => {
              //??console.log("Check league rounds : ",resp)
                let leagueLowestLb: LowestAverageGrossLeaderboard = resp.json();
                leagueLowestLb.players.forEach((p: PlayerLowestAverageGross)=>{
                    JsonService.deriveFulImageURL(p ,'teeBoxImage');
                    JsonService.deriveFulImageURL(p ,'imageUrl');
                    JsonService.deriveFulImageURL(p ,'photo');
                })
                return leagueLowestLb;
        }).catch(this.http.handleError)
    }
    public getClubBookingList(clubId: number, fromDate?: string, toDate?: string, maxResults?: number, status?: string, courseId?: number) {
        // pageSize?: number, pageNo?: number
        
        // 'assets/json_teeTimeBooking.json'
        let _params = {}; //"?clubId="+clubId+"&forDate=" +forDate + "&registeredOnly="+registeredOnly+"&includeCancelled="+includeCancelled;
        let _clubId = clubId?("/"+clubId):'';
        if(fromDate) _params['fromDate'] = fromDate;
        if(toDate) _params['toDate'] = toDate;
        if(maxResults) _params['maxResults'] = maxResults;
        if(status) _params['status'] = status;
        if(courseId) _params['courseId'] = courseId;

        let request = new RemoteRequest(global.ServerUrls.getClubBookingList+_clubId+"/search",
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, _params);
        // let request = new RemoteRequest(global.ServerUrls.getTeeTimeBookingList,
        //     RequestMethod.Get,ContentType.URL_ENCODED_FORM_DATA,{
        //         clubId: clubId,
        //         forDate: forDate,
        //         registeredOnly: registeredOnly
        //     });
        return this.http.execute(request)
                   .map((resp: Response) => {
                     //??console.log("club booking list : ", resp)
                       let clubBookingList: Array<TeeTimeBooking> = resp.json();
                       clubBookingList.forEach((tb: TeeTimeBooking)=> {
                           tb.bookingPlayers.forEach((p: TeeTimeBookingPlayer)=>{
                            JsonService.deriveFullUrl(p.player, "profile");
                            JsonService.deriveFullUrl(p.player, "image");
                            JsonService.deriveFullUrl(p.caddyAssigned, "caddyImage");
                            JsonService.deriveFullUrl(p.caddyPreferred, "caddyImage");
                           })
                        //    if(tb.flight) tb.bookingStatus = 'PaymentFull'
                       })
                    //  //??console.log("club flight service first : ", flightList, resp, resp.json())
                       return {resp , clubBookingList};
                   }).catch(this.http.handleError);
    }

    public getClubCaddySchedule(clubId: number, forDate?: string) {
        // pageSize?: number, pageNo?: number
        
        // 'assets/json_teeTimeBooking.json'
        let _params = {}; //"?clubId="+clubId+"&forDate=" +forDate + "&registeredOnly="+registeredOnly+"&includeCancelled="+includeCancelled;
        let _clubId = clubId?("/"+clubId):'';
        if(forDate) _params['forDate'] = forDate;

        let request = new RemoteRequest(global.ServerUrls.displayCaddySchedule +_clubId,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, _params);
        return this.http.execute(request)
                   .map((resp: Response) => {
                     //??console.log("club booking list : ", resp)
                       let caddyScheduleList: Array<ClubCaddieSchedule> = resp.json();
                       caddyScheduleList.forEach((csl: ClubCaddieSchedule)=> {
                            JsonService.deriveFullUrl(csl, "caddieImage");
                       })
                       return caddyScheduleList;
                   }).catch(this.http.handleError);
    }

    public getCaddyUnavailability(caddieId: number, fromDate?: string, toDate?: string) {
        let _params = {}; //"?clubId="+clubId+"&forDate=" +forDate + "&registeredOnly="+registeredOnly+"&includeCancelled="+includeCancelled;
        let _caddieId = caddieId?("/"+caddieId):'';
        if(fromDate) _params['fromDate'] = fromDate;
        if(toDate) _params['toDate'] = toDate;

        let request = new RemoteRequest(global.ServerUrls.listCaddyUnavailability+_caddieId,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, _params);
        return this.http.execute(request)
                   .map((resp: Response) => {
                     //??console.log("club booking list : ", resp)
                       let caddyUnavailability: Unavailability = resp.json();
                       return caddyUnavailability;
                   }).catch(this.http.handleError);
    }

    public addCaddyUnavailability(caddieId: number, fromDate: string, toDate: string, remarks?: string): Observable<any> {
        let params = {};
        let _caddieId = caddieId;
        params['fromDate'] = fromDate;
        params['toDate'] = toDate;
        let _remarks = 'Set unavailability from '+moment(fromDate).format("ddd, DD MMM YYYY")+" to "+moment(fromDate).format("ddd, DD MMM YYYY")
        params['remarks'] = remarks?remarks:_remarks;
        let _paramUrl = "?"+"fromDate="+params['fromDate']+"&toDate="+params['toDate'];
        let request = new RemoteRequest(global.ServerUrls.addCaddyUnavailability+"/"+_caddieId+"/create"+_paramUrl,
            RequestMethod.Post, ContentType.JSON , params['remarks']);
            return this.http.execute(request)
            .map((resp: Response) => {
                let result: any = resp.json();
              //??console.log("Sync player handicap index result ",result)
                return result;
            }).catch(this.http.handleError)
    }

    public removeCaddyUnavailability(unavailabilityId: number): Observable<any> {
        let params = {};
        let _unavailabilityId = unavailabilityId;
        let request = new RemoteRequest(global.ServerUrls.addCaddyUnavailability+"/"+_unavailabilityId+"/delete",
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, params);
            return this.http.execute(request)
            .map((resp: Response) => {
                let result: any = resp.json();
              //??console.log("Sync player handicap index result ",result)
                return result;
            }).catch(this.http.handleError)
    }

    public getPlayerMaxBooking(clubId: number, playerId: number, teeOffDate?: string) {
        let _params = {}; 
        let _clubId = clubId?("/"+clubId):'';
        let _playerId = playerId?("/"+playerId):'';
        if(teeOffDate) _params['teeOffDate'] = teeOffDate;

        let request = new RemoteRequest(global.ServerUrls.getPlayerMaxBookingCount+_clubId+_playerId+"/booking-count",
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, _params);
        return this.http.execute(request)
                   .map((resp: Response) => {
                     //??console.log("check max booking - service : ", resp)
                       let bookingCount: BookingCount = resp.json();
                       return bookingCount;
                   }).catch(this.http.handleError);
    }

    
    public getBuggyUnavailability(buggyId: number, fromDate?: string, toDate?: string) {
        let _params = {}; //"?clubId="+clubId+"&forDate=" +forDate + "&registeredOnly="+registeredOnly+"&includeCancelled="+includeCancelled;
        let _buggyId = buggyId?("/"+buggyId):'';
        if(fromDate) _params['fromDate'] = fromDate;
        if(toDate) _params['toDate'] = toDate;

        let request = new RemoteRequest(global.ServerUrls.listBuggyUnavailability+_buggyId,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, _params);
        return this.http.execute(request)
                   .map((resp: Response) => {
                     //??console.log("club booking list : ", resp)
                       let buggyUnavailability: Unavailability = resp.json();
                       return buggyUnavailability;
                   }).catch(this.http.handleError);
    }

    public addBuggyUnavailability(buggyId: number, fromDate: string, toDate: string, remarks?: string): Observable<any> {
        let params = {};
        let _buggyId = buggyId;
        params['fromDate'] = fromDate;
        params['toDate'] = toDate;
        let _remarks = 'Set unavailability from '+moment(fromDate).format("ddd, DD MMM YYYY")+" to "+moment(fromDate).format("ddd, DD MMM YYYY")
        params['remarks'] = remarks?remarks:_remarks;
        let _paramUrl = "?"+"fromDate="+params['fromDate']+"&toDate="+params['toDate'];
        let request = new RemoteRequest(global.ServerUrls.addBuggyUnavailability+"/"+_buggyId+"/create"+_paramUrl,
            RequestMethod.Post, ContentType.JSON , params['remarks']);
            return this.http.execute(request)
            .map((resp: Response) => {
                let result: any = resp.json();
              //??console.log("Sync player handicap index result ",result)
                return result;
            }).catch(this.http.handleError)
    }

    public removeBuggyUnavailability(unavailabilityId: number): Observable<any> {
        let params = {};
        let _unavailabilityId = unavailabilityId;
        let request = new RemoteRequest(global.ServerUrls.addBuggyUnavailability+"/"+_unavailabilityId+"/delete",
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, params);
            return this.http.execute(request)
            .map((resp: Response) => {
                let result: any = resp.json();
              //??console.log("Sync player handicap index result ",result)
                return result;
            }).catch(this.http.handleError)
    }

    public getPaymentMethodList() {
        let request = new RemoteRequest(global.ServerUrls.getPaymentMethodList,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA);
        return this.http.execute(request)
                   .map((resp: Response) => {
                     //??console.log("club booking list : ", resp)
                       let paymentMethodList: Array<PaymentMethod> = resp.json();
                       return paymentMethodList;
                   }).catch(this.http.handleError);
    }

    setBookingCancelGuard(bookingId: number, resetCancelGuard: boolean = false) {
        let _bookingId;
        let _cancelGuard = '';
        if(resetCancelGuard) _cancelGuard = '?cancelGuard='+'false';
        if(bookingId) _bookingId = '/'+bookingId;
        let _bookingUrl = global.teeTimeBookingBase+_bookingId+global.ServerUrls.setBookingCancelGuard+_cancelGuard;
        let request = new RemoteRequest(_bookingUrl,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA);
            return this.http.execute(request)
            .map((resp: Response) => {
                let result: TeeTimeBooking = resp.json();
              //??console.log("Booking Cancel Guard - ",resetCancelGuard," : ",result)
                return result;
            }).catch(this.http.handleError)
        // /rest/tee-time/booking/{bookingId}/set-cancel-guard?cancelGuard=false
    }

 
    public searchBookingClub(clubId: number, fromDate?: string, toDate?: string, statusType?: string, statusList?: Array<string>, courseId?: number,
        search?: string, pageSize?: number, pageNo?: number) {
        // pageSize?: number, pageNo?: number
        
        // 'assets/json_teeTimeBooking.json'
        let _params = {}; //"?clubId="+clubId+"&forDate=" +forDate + "&registeredOnly="+registeredOnly+"&includeCancelled="+includeCancelled;
        let _clubId = clubId?("/"+clubId):'';
        if(fromDate) _params['fromDate'] = fromDate;
        if(toDate) _params['toDate'] = toDate;
        if(statusType) _params['statusType'] = statusType;
        /**
         * A - Active, I - Inactive, B - Both, C - Custom For custom specify comma separated list of status in statusList
            Default value : B
         */
        if(statusList) _params['statusList'] = statusList;// statusList.join(","); 
        if(courseId) _params['courseId'] = courseId;
        if(pageSize) _params['pageSize'] = pageSize;
        if(pageNo) _params['pageNo'] = pageNo;
        if(search) _params['search'] = search;

        
      //??console.log("search club booking list : ", _params)

        let request = new RemoteRequest(global.ServerUrls.searchBookingClub+_clubId,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                fromDate: _params['fromDate'],
                toDate: _params['toDate'],
                statusType: _params['statusType'],
                statusList: _params['statusList'],
                courseId: _params['courseId'],
                pageNo: _params['pageNo'],
                pageSize: _params['pageSize'],
                search: _params['search'],
            });
        // let request = new RemoteRequest(global.ServerUrls.getTeeTimeBookingList,
        //     RequestMethod.Get,ContentType.URL_ENCODED_FORM_DATA,{
        //         clubId: clubId,
        //         forDate: forDate,
        //         registeredOnly: registeredOnly
        //     });
        return this.http.execute(request)
                   .map((resp: Response) => {
                     //??console.log("club booking list : ", resp)
                       let clubBookingList: PagedData<TeeTimeBooking> = resp.json();
                       clubBookingList.items.forEach((tb: TeeTimeBooking)=> {
                           tb.bookingPlayers.forEach((p: TeeTimeBookingPlayer)=>{
                            JsonService.deriveFullUrl(p.player, "profile");
                            JsonService.deriveFullUrl(p.player, "image");
                            JsonService.deriveFullUrl(p.caddyAssigned, "caddyImage");
                            JsonService.deriveFullUrl(p.caddyPreferred, "caddyImage");
                           })
                        //    if(tb.flight) tb.bookingStatus = 'PaymentFull'
                       })
                    //  //??console.log("club flight service first : ", flightList, resp, resp.json())
                    //    return {resp , clubBookingList};
                    return clubBookingList;
                   }).catch(this.http.handleError);
    }

    public removeCardClubApplication(clubId: number, playerDiscountId: number): Observable<any> {
        let _params = {};
        let _clubId = clubId;
        if(playerDiscountId) _params['playerDiscountId'] = playerDiscountId;
        let request = new RemoteRequest(global.ServerUrls.removeCardClubApplication+"/"+_clubId+"?playerDiscountId="+_params['playerDiscountId'],
            // global.ServerUrls.removeCardClubApplication+"/"+_clubId,
            RequestMethod.Delete, ContentType.URL_ENCODED_FORM_DATA, _params);
        return this.http.execute(request)
        //  this.http.execute(request, global.ServerUrls.removeCardClubApplication+"/"+_clubId+"?playerDiscountId="+_params['playerDiscountId'])
                   .map((resp: Response) => {
                  //??console.log("delete player discount card: ", resp)
                    return resp;
                }) 
    }

    public getAppAttributes() {
        let _params = {}; //"?clubId="+clubId+"&forDate=" +forDate + "&registeredOnly="+registeredOnly+"&includeCancelled="+includeCancelled;

        // let _url = "assets/app-attributes.json";
        let _randomizer = Math.floor(Math.random() * 7777) + 1
        let _url = 'http://'+global.MygolfServerHost+'/document/assets/app-attributes.json'+"?v="+_randomizer
        let request = new RemoteRequest(_url,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA);
        return this.http.execute(request)
                   .map((resp: Response) => {
                     //??console.log("app attribute : ", resp)
                       let data: any = resp.json();
                       return data;
                   }).catch(this.http.handleError);
    }

    public searchBookingPlayer(playerId: number, clubId?: number, fromDate?: string, toDate?: string, statusType?: string, statusList?: Array<string>, courseId?: number,
        search?: string, pageSize?: number, pageNo?: number,descendingByDate?: boolean) {
        // pageSize?: number, pageNo?: number
        
        // 'assets/json_teeTimeBooking.json'
        let _params = {}; //"?clubId="+clubId+"&forDate=" +forDate + "&registeredOnly="+registeredOnly+"&includeCancelled="+includeCancelled;
        let _playerId = playerId?("/"+playerId):'';
        if(clubId) _params['clubId'] = clubId;
        if(fromDate) _params['fromDate'] = fromDate;
        if(toDate) _params['toDate'] = toDate;
        if(statusType) _params['statusType'] = statusType;
        /**
         * A - Active, I - Inactive, B - Both, C - Custom For custom specify comma separated list of status in statusList
            Default value : B
         */
        if(statusList) _params['statusList'] = statusList;// statusList.join(","); 
        if(courseId) _params['courseId'] = courseId;
        if(pageSize) _params['pageSize'] = pageSize;
        if(pageNo) _params['pageNo'] = pageNo;
        if(search) _params['search'] = search;
        if(descendingByDate) _params['descendingByDate'] = descendingByDate;

        
      //??console.log("search club booking list : ", _params)

        let request = new RemoteRequest(global.ServerUrls.searchBookingPlayer+_playerId,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                clubId: _params['clubId'],
                fromDate: _params['fromDate'],
                toDate: _params['toDate'],
                statusType: _params['statusType'],
                statusList: _params['statusList'],
                courseId: _params['courseId'],
                pageNo: _params['pageNo'],
                pageSize: _params['pageSize'],
                search: _params['search'],
                descendingByDate: _params['descendingByDate'],
            });
        // let request = new RemoteRequest(global.ServerUrls.getTeeTimeBookingList,
        //     RequestMethod.Get,ContentType.URL_ENCODED_FORM_DATA,{
        //         clubId: clubId,
        //         forDate: forDate,
        //         registeredOnly: registeredOnly
        //     });
        return this.http.execute(request)
                   .map((resp: Response) => {
                     //??console.log("club booking list : ", resp)
                       let playerBookingList: PagedData<TeeTimeBooking> = resp.json();
                       playerBookingList.items.forEach((tb: TeeTimeBooking)=> {
                           tb.bookingPlayers.forEach((p: TeeTimeBookingPlayer)=>{
                            JsonService.deriveFullUrl(p.player, "profile");
                            JsonService.deriveFullUrl(p.player, "image");
                            JsonService.deriveFullUrl(p.caddyAssigned, "caddyImage");
                            JsonService.deriveFullUrl(p.caddyPreferred, "caddyImage");
                           })
                        //    if(tb.flight) tb.bookingStatus = 'PaymentFull'
                       })
                    //  //??console.log("club flight service first : ", flightList, resp, resp.json())
                    //    return {resp , clubBookingList};
                    return playerBookingList;
                   }).catch(this.http.handleError);
    }

    public refundRedeemForPlayer(clubId: number, playerId: number, startDate: string, endDate?: string, include: string = 'both') {
        let _params = {}; 
        let _clubId = clubId;
        // let _randomizer = Math.floor(Math.random() * 7777) + 1
        // let _url = 'http://'+global.MygolfServerHost+'/document/assets/app-attributes.json'+"?v="+_randomizer
        if(playerId) _params['playerId'] = playerId;
        if(startDate) _params['startDate'] = startDate;
        if(endDate) _params['endDate'] = endDate;
        if(include) _params['include'] = include;
        let request = new RemoteRequest(global.ServerUrls.refundRedeemForPlayer+"/"+_clubId,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, _params);
        return this.http.execute(request)
                   .map((resp: Response) => {
                     console.log("refund redeem player : ", resp)
                       let data: any = resp.json();
                       return data;
                   }).catch(this.http.handleError);
    }

    public refundRedeemForClub(clubId: number, startDate: string, endDate?: string, include: string = 'both') {
        let _params = {}; 
        let _clubId = clubId;
        // let _randomizer = Math.floor(Math.random() * 7777) + 1
        // let _url = 'http://'+global.MygolfServerHost+'/document/assets/app-attributes.json'+"?v="+_randomizer
        if(startDate) _params['startDate'] = startDate;
        if(endDate) _params['endDate'] = endDate;
        if(include) _params['include'] = include;
        let request = new RemoteRequest(global.ServerUrls.refundRedeemForClub+"/"+_clubId,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, _params);
        return this.http.execute(request)
                   .map((resp: Response) => {
                    console.log("refund redeem club : ", resp)
                       let data: any = resp.json();
                       return data;
                   }).catch(this.http.handleError);
    }

    undoRefundBooking(bookingId: number, refundInstanceId: number) {
        let _bookingId;
        let _refundInstanceId;
        let _params = {};
        if(bookingId) _params['bookingId'] = bookingId;
        if(refundInstanceId) _params['refundInstanceId'] = refundInstanceId;
        let _bookingUrl = global.ServerUrls.undoRefundBooking;
        let request = new RemoteRequest(_bookingUrl,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, _params);
            return this.http.execute(request)
            .map((resp: Response) => {
                let result: TeeTimeBooking = resp.json();
              //??console.log("Booking Cancel Guard - ",resetCancelGuard," : ",result)
                return result;
            }).catch(this.http.handleError)
    }

    undoCancelBooking(bookingId: number) {
        let _params = {};
        if(bookingId) _params['bookingId'] = bookingId;
        let _bookingUrl = global.ServerUrls.undoCancelBooking;
        let request = new RemoteRequest(_bookingUrl,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, _params);
            return this.http.execute(request)
            .map((resp: Response) => {
                let result: TeeTimeBooking = resp.json();
              //??console.log("Booking Cancel Guard - ",resetCancelGuard," : ",result)
                return result;
            }).catch(this.http.handleError)
    }

    updateNinesBooking(bookingId: number, ninesPlayed: number) {
        let _params = {};
        if(bookingId) _params['bookingId'] = bookingId;
        if(ninesPlayed) _params['ninesPlayed'] = ninesPlayed;
        let _bookingUrl = global.ServerUrls.updateNinesBooking;
        let request = new RemoteRequest(_bookingUrl,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, _params);
            return this.http.execute(request)
            .map((resp: Response) => {
                let result: TeeTimeBooking = resp.json();
              //??console.log("Booking Cancel Guard - ",resetCancelGuard," : ",result)
                return result;
            }).catch(this.http.handleError)
    }
}
