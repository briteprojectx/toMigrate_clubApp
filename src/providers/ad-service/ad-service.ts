
import {RemoteHttpService} from '../../remote-http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Advertisement} from '../../data/advertisement';
import * as global from '../../globals';
import {RemoteRequest, ContentType} from '../../remote-request';
import {RequestMethod, Response} from '@angular/http';
import {JsonService} from '../../json-util';

@Injectable()
export class AdService {
    constructor(private http: RemoteHttpService){
    }

    /**
     * Get Ads to display in general area.
     * @returns {Observable<Advertisement[]>}
     */
    public getAdToDisplay(): Observable<Advertisement[]> {
        let url = global.ServerUrls.getAdsForDisplay;
        let request = new RemoteRequest(url, RequestMethod.Get,
            ContentType.URL_ENCODED_FORM_DATA, {
                portalOrApp     : 'app'
            });
        return this._getAds(request);
    }

    /**
     * Get the list of ads to display for a given specific competition
     * @param {number} competitionId The ID of the competition
     * @returns {Observable<Advertisement[]>}
     */
    public getCompetitionAds(competitionId: number): Observable<Advertisement[]> {
        let url = global.ServerUrls.getAdsForDisplay;
        let request = new RemoteRequest(url, RequestMethod.Get,
            ContentType.URL_ENCODED_FORM_DATA, {
                portalOrApp     : 'app',
                competitionId: competitionId
            });
        return this._getAds(request);
    }

    private _getAds(request: RemoteRequest): Observable<Advertisement[]>  {
        return this.http.execute(request)
                   .map((resp: Response)=>{
                       let ads : Advertisement[] = resp.json();
                       if(ads && ads.length)
                           ads.forEach(ad=>{
                               JsonService.deriveFullUrl(ad,'imageUrl');
                           });
                       return ads;
                   });
    }
}