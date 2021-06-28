import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {File} from '@ionic-native/file';
import {FileTransferError, FileUploadOptions, FileUploadResult, Transfer, TransferObject} from '@ionic-native/transfer';
import {isPresent} from 'ionic-angular/util/util';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import {UploadResult} from '../../data/fileupload-result';
import { Platform } from 'ionic-angular';
/*
 This service class handles the transfer of files between client and server
 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class FiletransferService
{

    constructor(public http: Http, private transfer: Transfer, private file: File,
        public platform: Platform,) {
    }

    // /**
    //  * Upload a file to the given server address.
    //  * @param fileUrl The URL of the file to upload
    //  * @param serverUrl The URL of the server where the file will be uploaded
    //  * @param mimeType The mimeType like image/jpeg
    //  * @param options The additional options to upload
    //  * @param subscriber The optional subscriber which will be called on successful
    //  * upload or upload fails
    //  */
    // public uploadFile(fileUrl: string, serverUrl: string,
    //     mimeType: string, options: any, subscriber?: Subscriber<UploadResult>) {
    //     let fuOptions: FileUploadOptions = {};
    //     fuOptions.fileKey                = "file";
    //     if (isPresent(options)) fuOptions.params = options;
    //     if (isPresent(mimeType)) fuOptions.mimeType = mimeType;
    //     fuOptions.httpMethod = "POST";
    //     let ft: TransferObject               = this.transfer.create();
    //             // new Transfer();
    //
    //     ft.upload(fileUrl, serverUrl, fuOptions, true)
    //       .then((fur: FileUploadResult) => {
    //           if (isPresent(subscriber) && subscriber.next) {
    //               let result: UploadResult = {
    //                   success: true,
    //                   message: fur.response
    //               };
    //               if (fur.bytesSent) result.totalBytes = fur.bytesSent;
    //               subscriber.next(result);
    //           }
    //       }, (fte: FileTransferError) => {
    //           if (isPresent(subscriber) && subscriber.error) {
    //               let error = "";
    //               if (fte.exception && fte.exception)
    //                   error = fte.exception;
    //               else if (fte.body)
    //                   error = fte.body;
    //               subscriber.error(error);
    //           }
    //       });
    //
    // }
    /**
     * Upload a file to the given server address.
     * @param fileUrl The URL of the file to upload
     * @param serverUrl The URL of the server where the file will be uploaded
     * @param mimeType The mimeType like image/jpeg
     * @param options The additional options to upload
     * @param subscriber The optional subscriber which will be called on successful
     * upload or upload fails
     */
    public uploadFile(fileUrl: string, serverUrl: string,
        mimeType: string, options: any): Promise<UploadResult> {
        let ft: TransferObject;
        let fuOptions: FileUploadOptions = {};
        // this.platform.ready().then(
        //     (ready)=>{
        //       ft= this.transfer.create();
        //     }
        //   );
        fuOptions.fileKey                = "file";
        fuOptions.headers                = {
            'X-AUTH-TOKEN': options.authToken
        }
        if (isPresent(options)) fuOptions.params = options;
        if (isPresent(mimeType)) fuOptions.mimeType = mimeType;
        fuOptions.httpMethod = "POST";
        ft  = this.transfer.create();

        return ft.upload(fileUrl, serverUrl, fuOptions, true)
            .then((fur: FileUploadResult)=>{
                let result: UploadResult = {
                    success: true,
                    message: fur.response
                };
                if (fur.bytesSent) result.totalBytes = fur.bytesSent;
                return result;
            }, (fte: FileTransferError) => {
                let error = "";
                if (fte.exception && fte.exception)
                    error = fte.exception;
                else if (fte.body)
                    error = fte.body;
                let result: UploadResult = {
                    success: false,
                    message: error
                };
                return result;
            });

    }
}

