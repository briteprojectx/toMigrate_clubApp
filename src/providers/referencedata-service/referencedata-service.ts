import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import {RemoteHttpService} from "../../remote-http";
import {RemoteRequest, ContentType} from "../../remote-request";
import * as globals from "../../globals";
import {RequestMethod, Response} from "@angular/http";
import {Country} from "../../data/country-location";
import {Observable} from "rxjs/Rx";
/*
 Generated class for the ReferencedataService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class ReferencedataService
{
    constructor(private  http: RemoteHttpService) {
    }

    /**
     * List countries
     * @returns {Observable<R>}
     */
    public listCountries(): Observable<Array<Country>> {
        let request = new RemoteRequest(globals.ServerUrls.getCountries,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA);
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let countries: Array<Country> = resp.json();
                       return countries;
                   }).catch(this.http.handleError);
    }

    /**
     * Gets the states from the servers
     * @param countryId (Optional) If you want states of a country specify the country id
     * @param searchText The search text to filter the states (Optional)
     * @returns {Observable<R>}
     */
    public listStates(countryId: string, searchText: string): Observable<Array<string>> {
        let request = new RemoteRequest(globals.ServerUrls.getStates,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                country   : countryId,
                searchText: searchText
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let states: Array<string> = resp.json();
                       return states;
                   }).catch(this.http.handleError);
    }

    /**
     * Lists the cities from the server.
     * @param countryId The ID of the country. Optional
     * @param state The state name. Optional
     * @param searchText The search text to filter the cities
     * @returns {Observable<R>}
     */
    public listCities(countryId: string,
        state: string,
        searchText: string): Observable<Array<string>> {
        let request = new RemoteRequest(globals.ServerUrls.getStates,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                country   : countryId,
                state     : state,
                searchText: searchText
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let cities: Array<string> = resp.json();
                       return cities;
                   }).catch(this.http.handleError);
    }
}
