import {Injectable} from '@angular/core';
import {RequestMethod, Response} from '@angular/http';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {SessionInfo} from '../../data/authentication-info';
import {AnalysisHole} from '../../data/playerAnalysis-data';
import {SearchCriteria} from '../../data/search-criteria';
import * as global from '../../globals';
import {SessionDataService} from '../../redux/session/session-data-service';
import {RemoteHttpService} from '../../remote-http';
import {ContentType, RemoteRequest} from '../../remote-request';
import {Preference} from '../../storage/preference';
/*
 Generated class for the CompetitionService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class PlayerAnalysisService {
    private searchCriteria: SearchCriteria;
    private startDate: Date;
    private endDate: Date;
    private session: SessionInfo;

    constructor(private http: RemoteHttpService,
        private sessionDataService: SessionDataService,
        private  pref: Preference) {
        this.searchCriteria = {
            searchType            : "all",
            onlyParticipating     : false,
            performanceHolesPlayed: 18
        };
        this.sessionDataService.getSession().distinctUntilChanged()
            .subscribe((session: SessionInfo) => {
                this.session = session;
            });
        this.pref.getPref("AnalysisFilter")
            .subscribe((data: any) => {
                this.searchCriteria = data;
            }, (error) => {
                console.error(error);
            });
    }

    /**
     * Sets the search criteria for competitions
     * @param search
     */
    public setSearch(search: SearchCriteria) {
        this.searchCriteria = search;
        //Save it
        this.pref.setPref("AnalysisFilter", search);
    }

    /**
     * Gets the preference stored
     * @returns {CompetitionSearchCriteria}
     */
    public getSearch(): SearchCriteria {
        return this.searchCriteria;
    }

    public setFilterStartDate(startDate: Date) {
        this.startDate = startDate;
    }

    public setFilterEndDate(endDate: Date) {
        this.endDate = endDate;
    }

    /**
     * Gets the competition details for a given competition
     * @param competitionId The ID of the competition for which details are required
     * @returns {Observable<R>} The URLs are already sanitized and absolute
     */
    public getPlayerAnalysisHole(holesPlayed: number = 18): Observable<AnalysisHole> {
        //,type?: string = "ALL", ,userId?: number
        //  if (!isPresent(userId))
        let userId  = this.session.playerId;
        let request = new RemoteRequest(global.ServerUrls.getPlayerAnalysisHole,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                userId     : userId,
                type       : this.searchCriteria.type,
                holesPlayed: this.searchCriteria.performanceHolesPlayed
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let analysisHole: AnalysisHole = resp.json()
                       return analysisHole;
                   })
                   .catch(this.handleError);
    }

    private handleError(error) {
        let result: any;
        if (error && error.json) {
            result = error.json();
        } else if (error) {
            result = error;
        } else {
            result = "Server error occured";
        }
        return Observable.throw(result);
    }
}
