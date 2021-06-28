import {AlertController, Platform, ToastController} from 'ionic-angular/index';
import {Subscriber} from 'rxjs/Rx';
import {isPresent} from 'ionic-angular/util/util';
import {ConnectionService} from './providers/connection-service/connection-service';
import {Response} from '@angular/http';
/**
 * Created by Ashok on 08-06-2016.
 */

export class MessageDisplayUtil
{
    /**
     * Gets the error message from an error
     * @param error
     * @returns {null}
     */
    public static getErrorMessage(error: any, defMsg?: string): string {
        let msg = null;
        console.log("[Error] get error msg : ", error, defMsg)
        if (error && error.message)
            msg = error.message;
        else if (error && error.errorMessage)
            msg = error.errorMessage;
        else if (error && error.exception)
            msg = error.exception;
        else if (typeof error === "string")
            msg = error;
        else if(error instanceof Response) {
            let resp: Response = error;
            let errorMsg = msg  = resp.headers.get('error-message');
            if(isPresent(errorMsg))
                msg = errorMsg;
        }
        else msg = defMsg;
        if (!msg && isPresent(defMsg))
            msg = defMsg;
        // else if(error)
        //     msg = JSON.stringify(error);
        return msg;
    }

    /**
     * This will extract the error message from error object. If error is empty then
     * default message is derived by concatenting passed default message and after checking network connection
     * @param error
     * @param platform
     * @param connService
     * @param defMessage
     */
    public static getError(error: any, platform: Platform, connService: ConnectionService, defMessage: string): string {
        if(platform.is('cordova') && !connService.isConnected()){
            defMessage = 'You do not have data connection.';
        }
        let msg = MessageDisplayUtil.getErrorMessage(error, defMessage);
        return msg;
    }
    public static showErrorToast(message: string, platform: Platform, toastCtl: ToastController,
        duration: number, position: string) {
        MessageDisplayUtil._showToast(message, platform, toastCtl, duration, position, true);
    }

    public static showMessageToast(message: string, platform: Platform, toastCtl: ToastController,
        duration: number, position: string) {
        MessageDisplayUtil._showToast(message, platform, toastCtl, duration, position, false);
    }

    private static _showToast(message: string, platform: Platform, toastCtl: ToastController,
        duration: number,
        position: string,
        error: boolean) {
        // if (platform.is("cordova")) {
        //     Toast.showWithOptions({
        //         message : message,
        //         duration: duration,
        //         position: position,
        //         styling : (error)
        //             ? MygolfToastOptions.ErrorToastStyle
        //             : MygolfToastOptions.MessageToastStyle
        //     }).subscribe((result) => {
        //         try {
        //             console.log("Toast result: " + JSON.stringify(result));
        //         } catch (e) {
        //         }
        //
        //     });
        // }
        // else {
            let toast = toastCtl.create({
                message        : message,
                duration       : duration,
                showCloseButton: true,
                position       : position
            });
            toast.present({
                keyboardClose: true
            });
        // }
    }

    public static displayInfoAlert(alertCtl: AlertController,
        title: string, message: string, buttonText: string,
        subscriber?: Subscriber<any>) {
        message   = '<span class="info"><i class="fa fa-info-circle fa-2x" aria-hidden="true"></i>  ' + message + '</span>';
        let alert = alertCtl.create({
            title  : title,
            message: message,
            buttons: [{
                text   : buttonText,
                role   : "cancel",
                handler: () => {
                    alert.dismiss().then(() => {
                        if (subscriber && subscriber.next)
                            subscriber.next();
                    });
                    return false;
                }
            }]
        });
        alert.present();
    }

    public static displayErrorAlert(alertCtl: AlertController,
        title: string, message: string,
        buttonText: string,
        subscriber?: Subscriber<any>) {
        message   = '<span class="error"><i class="fa fa-exclamation-circle fa-2x" aria-hidden="true"></i> '
            + message + "</span>";
        let alert = alertCtl.create({
            title  : title,
            message: message,
            buttons: [{
                text   : buttonText,
                role   : "cancel",
                handler: () => {
                    alert.dismiss()
                         .then(() => {
                             if (subscriber && subscriber.next)
                                 subscriber.next();
                         });

                    return false;
                }
            }]
        });
        alert.present();

    }
}
