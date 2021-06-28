import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {Observable} from 'rxjs/Observable';
import { DeviceService } from '../device-service/device-service';
import { DeviceInfo } from '../../data/device-info';
import { Platform } from 'ionic-angular';
/*
 Generated class for the ImageService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class ImageService
{
    deviceInfo: DeviceInfo;
    constructor(private camera: Camera,
        private deviceService: DeviceService,
        private platform: Platform) {
            // if(this.platform.is('cordova')) {
                this.deviceService.getDeviceInfo().then((devInfo: DeviceInfo)=>{
                    this.deviceInfo = devInfo;
                })
            // }
    }

    public checkVersion() {
        let _version = '9'; '9.12-update';
        let _splitter;
        _splitter = (_version.split(".",1))?_version.split(".",1):_version;

        if(this.deviceInfo) {
            console.log("platform version : ",this.deviceInfo.platformVersion);
        }
        console.log("platform version : ", _version, _splitter)
        console.log("platform version more than 8 : ", _splitter.length>0&&Number(_splitter[0])>=8?'betul':'tak cukup lagi ni')
    }

    /**
     * Capture an image
     * @param highQuality Whether to capture the high quality image.
     * @returns {Observable<R>}
     */
    public captureImage(highQuality: boolean,
        encodingType: number = 0): Observable<ImageData> {
        let _allowEdit;
        let _version;
        let _platformVersion;
        if(this.platform.is('cordova') && this.deviceInfo) {
            console.log("platform version : ",this.deviceInfo.platformVersion);
            _platformVersion = (this.deviceInfo.platformVersion.split(".",1))?this.deviceInfo.platformVersion.split(".",1)[0]:this.deviceInfo.platformVersion;
            _version = _platformVersion;
        }
        _allowEdit = _version<=10?true:false;
        console.log("Allow edit : ", _allowEdit)
        let options: CameraOptions = {
            quality           : (highQuality) ? 100 : 50,
            allowEdit         : _allowEdit,
            sourceType        : 1,
            destinationType   : 2,
            correctOrientation: true,
            saveToPhotoAlbum  : false,
            encodingType      : encodingType
        }
        return this._getImage(options);
    }

    /**
     * Pick an image from photo library
     * @returns {Observable<ImageData>}
     */
    public pickImage(encodingType: number = 0): Observable<ImageData> {
        let _allowEdit;
        let _version;
        let _platformVersion;
        if(this.platform.is('cordova') && this.deviceInfo) {
            console.log("platform version : ",this.deviceInfo.platformVersion);
            _platformVersion = (this.deviceInfo.platformVersion.split(".",1))?this.deviceInfo.platformVersion.split(".",1)[0]:this.deviceInfo.platformVersion;
            _version = _platformVersion;
        }
        _allowEdit = _version<=10?true:false;
        console.log("Allow edit : ", _allowEdit)
        let options: CameraOptions = {
            allowEdit         : _allowEdit,
            sourceType        : 2,
            destinationType   : 2,
            correctOrientation: true,
            saveToPhotoAlbum  : false,
            encodingType      : encodingType
        }
        return this._getImage(options);
    }

    /**
     * Get the image from photo library
     * @param options The camera options
     * @returns {any}
     * @private
     */
    private _getImage(options: CameraOptions): Observable<ImageData> {
        let promise: Promise<ImageData> = this.camera.getPicture(options)
                                                .then((imageUrl: string) => {
                                                    let name     = imageUrl.substr(imageUrl.lastIndexOf('/') + 1);
                                                    let namePath = imageUrl.substr(0, imageUrl.lastIndexOf('/') + 1);
                                                    return {
                                                        originalURL: imageUrl,
                                                        imageName  : name,
                                                        imagePath  : namePath
                                                    }
                                                });
        return Observable.fromPromise(promise)
                         .map((data: ImageData) => {
                             return data;
                         });
    }

}

export interface ImageData
{
    originalURL: string;
    imageName?: string;
    imagePath?: string;
}

