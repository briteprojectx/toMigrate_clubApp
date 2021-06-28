import {Injectable} from '@angular/core';
import {RemoteHttpService} from '../../remote-http';
import {Observable} from 'rxjs';
import {ServerInfo} from '../../data/server-info';
import {ContentType, RemoteRequest} from '../../remote-request';
import * as global from '../../globals';
import {RequestMethod, Response} from '@angular/http';
/**
 * Created by ashok on 17/10/16.
 */

@Injectable()
export class ServerInfoService
{

    constructor(private http: RemoteHttpService) {

    }

    /**
     * Get the server information
     * @returns {Observable<R>}
     */
    public serverInfo(packageName?: string): Observable<ServerInfo> {
        let data: any = {};
        let headers: any = {};
        if(packageName) data.packageName = packageName;
        let request = new RemoteRequest(global.ServerUrls.serverInfo, RequestMethod.Get,
            ContentType.URL_ENCODED_FORM_DATA, data, headers);

        return this.http.execute(request)
                   .map((resp: Response) => {
                       let serverInfo: ServerInfo = resp.json();
                       if(serverInfo.showAds && serverInfo.adUrls){
                           let adUrls = [];
                           serverInfo.adUrls.forEach(url=>{
                               let absUrl = global.MygolfServer + "/" + url;
                               adUrls.push(absUrl);
                           });
                           serverInfo.adUrls = adUrls;
                       }
                       console.log("server info : ",resp);
                       console.log("server info 2 : ",serverInfo)
                       return serverInfo;
                   }).catch(this.http.handleError);
    }
}
