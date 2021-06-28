import {Http, Response} from '@angular/http';
import * as globals from './globals';
import {Injectable} from '@angular/core';
import {isPresent} from 'ionic-angular/util/util';
import {Subscriber} from 'rxjs/Subscriber';
import {RemoteRequest} from './remote-request';
import {AuthenticationService} from './authentication-service';
import {RemoteResponse} from './RemoteResponse';
import {Observable} from 'rxjs/Observable';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {GeolocationService} from './providers/geolocation-service/geolocation-service';
import {ConnectionService} from './providers/connection-service/connection-service';
import {DeviceService} from './providers/device-service/device-service';
import {DeviceInfo} from './data/device-info';
import {SessionInfo} from './data/authentication-info';
import {SessionDataService} from './redux/session/session-data-service';
import { ToastController, Platform } from 'ionic-angular';
import {MessageDisplayUtil} from './message-display-utils';

/**
 * Created by Ashok on 30-03-2016.
 */
@Injectable()
export class RemoteHttpService {
    private root: string;
    private session: SessionInfo;
    constructor(private http: Http,
        private authService: AuthenticationService,
        private sessionService: SessionDataService,
        private connService: ConnectionService,
        private deviceService: DeviceService,
        private geoService: GeolocationService,
        private toastCtl: ToastController,
        private platform: Platform) {
        console.log("RemoteHttpService service*********");
        this.root = globals.MygolfServer;
        this.sessionService.getSession().distinctUntilChanged()
            .subscribe((session: SessionInfo)=> {
                this.session = session;
            })
    }

    /**
     * Ajax call
     * @param request The RemoteRequest which encapsulates all the remote call params
     * @param subscriber The subscriber to be called once the remote request returns
     * @param params Optional parameters. Usually this is used by the caller to identify
     * the the response. This params is returned along with the Response to identify
     * for which the response is returned
     */
    public call(request: RemoteRequest,
        subscriber?: Subscriber<RemoteResponse>,
        params?: any) {
        this.execute(request).subscribe((resp: Response) => {
            if (isPresent(subscriber)
                && isPresent(subscriber.next)) {
                subscriber.next(new RemoteResponse(resp, params));
            }
        }, (error: any) => {
            if (subscriber && subscriber.error) {
                subscriber.error(error);
            }
        }, () => {
            //The request completed. Any cleanup, you can do it here
            if (subscriber && subscriber.complete) {
                subscriber.complete();
            }
        });
    }

    public execute(request: RemoteRequest, url?: string): Observable<Response> {

        let hdrs = {};
        if (isPresent(this.session)) {
            hdrs[globals.AUTH_TOKEN_NAME] = this.session.authToken;
            // hdrs["username"] = session.username;
            hdrs["Player-Id"]             = this.session.playerId;
        }
        this.populateDeviceInfo(hdrs);
        let lat  = this.geoService.getLatitude();
        let long = this.geoService.getLongitude();
        if (lat && long) {
            hdrs["Location-Latitude"]  = lat;
            hdrs["Location-Longitude"] = long;
        }
        // hdrs['Referer'] = 'http://devlet.mygolf2u.com'
        let req = request.buildAjax(hdrs);
        let observable;
        if(url) observable = this.http.delete(url,req);
        else observable = this.http.request(req);
        // console.log("HTTP EXECUTE : ", observable)
        return observable;
    }

    private  populateDeviceInfo(hdrs: any) {
        let deviceInfo: DeviceInfo = this.deviceService.getCachedDeviceInfo();
        if (deviceInfo) {
            hdrs['Device-Id'] = deviceInfo.deviceId;
        }
    }

    /**
     * Converts a given data object to URL form
     * @param data The data
     * @returns {string}
     */
    toParam(data: any): string {
        let list = [];
        for (let i in data) {
            list.push(encodeURI(i) + "=" + encodeURIComponent(data[i]));
        }
        return list.join("&");
    }

    public handleError(error) {
        let result: any;
        // console.log("[Error] handle error : ", error);
        // if(error) MessageDisplayUtil.showErrorToast(error.status, this.platform, this.toastCtl, 5000, "bottom");
        //Check whether the error is sent as header
        if (error && error.headers && error.headers.get) {
            result = error.headers.get("Error-Message");
        }
        if (!isPresent(result)) {
            if (error && error.json) {
                // result = error.json();
                result = error;
            } else if (error) {
                result = error;
            } else if (!this.connService.isConnected()) {
                result = "Server call failed because your internet connection is down."
            }
            else {
                result = "Server call failed some unknown issue.";
            }
        }
        return ErrorObservable.create(result);
    }
}
