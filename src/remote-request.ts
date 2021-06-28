import {Headers, Request, RequestMethod} from '@angular/http';
import {isPresent} from 'ionic-angular/util/util';
;
/**
 * Created by Ashok on 06-04-2016.
 */

export class ContentType
{
    public static URL_ENCODED_FORM_DATA: string = "application/x-www-form-urlencoded";
    public static JSON: string                  = "application/json";
    public static JAVASCRIPT: string            = "application/javascript";
    public static HTML: "text/html";
    public static XML: "application/xml";
    public static XHTML: "application/xhtml+xml";
    public static PLAIN_TEXT                    = "text/plain";
    public static JPEG                          = "image/jpeg";
    public static PNG                           = "image/png";
    public static WILDCARD_IMAGE                = "image/*";
}

export class RemoteRequest
{

    constructor(private url: string,
        private method: RequestMethod,
        private reqContentType?: string,
        private data?: any,
        private headers?: any) {

    }

    buildAjax(additionalHeaders?: any): Request {
        let effUrl  = this.url;
        let headers = new Headers();

        //Populate additional headers
        this.populateHeader(headers, additionalHeaders);
        //Now set the headers from the request
        this.populateHeader(headers, this.headers);

        let bodyStr: string = "";
        if (this.method === RequestMethod.Get && isPresent(this.data)) {
            let paramStr = this.paramString(this.data);
            if (paramStr && paramStr.length) {
                effUrl += "?" + paramStr;
                headers.set("Content-Type", ContentType.URL_ENCODED_FORM_DATA);
            }
        }
        else if (isPresent(this.data)) {
            if (ContentType.URL_ENCODED_FORM_DATA === this.reqContentType) {
                bodyStr = this.paramString(this.data);
                headers.set("Content-Type", ContentType.URL_ENCODED_FORM_DATA);
            }
            else {
                bodyStr = JSON.stringify(this.data);
                headers.set("Content-Type", ContentType.JSON);
            }
        }
        else
            headers.set("Content-Type", ContentType.URL_ENCODED_FORM_DATA);
        let args = {
            url    : effUrl,
            headers: headers,
            body   : bodyStr
        };

        let req    = new Request(args);
        req.url    = effUrl
        req.method = this.method;
        return req;
    }

    private paramString(data: any): string {
        let params = [];
        if (isPresent(data))
            for (let key in data) {
                let comp = encodeURIComponent(key);
                if (isPresent(data[key]))
                    comp += "=" + encodeURIComponent(data[key])
                params.push(comp);
            }

        return params.join("&");
    }

    /**
     * Populate the Headers instance with header attributes
     * @param hdr
     */
    private populateHeader(hdr: Headers, info: any) {
        // console.log("populate headers : ", hdr, info)
        if (isPresent(info))
            for (let key in info)
                hdr.set(key, info[key]);
    }
}
