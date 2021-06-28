import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {RemoteHttpService} from "../../remote-http";
import {FeedbackCategory} from "../../data/feedback-data";
import {Observable} from "rxjs/Rx";
import {RemoteRequest, ContentType} from "../../remote-request";
import * as global from "../../globals";
import {RequestMethod, Response} from "@angular/http";
/*
 Generated class for the FeedbackService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class FeedbackService
{

    constructor(private http: RemoteHttpService) {
    }

    public getCategories(): Observable<Array<FeedbackCategory>> {
        let request: RemoteRequest
                = new RemoteRequest(global.ServerUrls.listFeedbackCategories,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA);

        return this.http.execute(request)
                   .map((resp: Response) => {
                       return resp.json();
                   }).catch(this.http.handleError);
    }

    /**
     * Sends the feedback from a player
     * @param category The feedback category
     * @param subject The subject of the feedback
     * @param message The message
     * @returns {Observable<R>}
     */
    public sendFeedbackFromPlayer(category: string,
        subject: string,
        message: string): Observable<number> {
        let request = new RemoteRequest(global.ServerUrls.createPlayerFeedback,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, {
                category: category,
                subject : subject,
                message : message
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let id = parseInt(resp.text());
                       return id;
                   }).catch(this.http.handleError);
    }
}

