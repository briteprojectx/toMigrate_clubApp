import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {RemoteHttpService} from '../../remote-http';
import * as global from '../../globals';
import {ContentType, RemoteRequest} from '../../remote-request';
import {RequestMethod, Response} from '@angular/http';
import {ClubInfo, ClubList, CourseHoleInfo, CourseInfo} from '../../data/club-course';
import {JsonService} from '../../json-util';
import {Observable} from 'rxjs/Observable';
import {isPresent} from 'ionic-angular/util/util';
import {SearchCriteria} from '../../data/search-criteria';

/*
 Generated class for the ClubService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class ClubService
{
    private searchCriteria: SearchCriteria;

    constructor(public http: RemoteHttpService) {
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
            console.log("url encoded :", ContentType.URL_ENCODED_FORM_DATA)
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
                           clubList.clubs.forEach((c: ClubInfo) => {
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
}
