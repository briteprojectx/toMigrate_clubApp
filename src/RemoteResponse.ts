import {Response} from "@angular/http";
/**
 *
 * The response object wrapped
 * Created by Ashok on 18-04-2016.
 */

export class RemoteResponse
{
    constructor(private resp: Response, private params: any) {

    }

    public getResponse(): Response {
        return this.resp;
    }

    public getParams(): any {
        return this.params;
    }
}
