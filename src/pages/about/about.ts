import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {DeviceService} from '../../providers/device-service/device-service';
import {DeviceInfo} from '../../data/device-info';
import {AppInfo} from '../../data/app-info';
/**
 * Created by Ashok on 29-03-2016.
 */
@Component({
    templateUrl: "about.html",
    selector   : "about-page"
})
export class AboutPage implements OnInit, OnDestroy {

    deviceInfo: DeviceInfo = {
        deviceId: 'unknown', virtual: true
    };
    appInfo: AppInfo = {};

    constructor(private nav: NavController,
        private deviceService: DeviceService,
        private platform: Platform) {
        this.platform = platform;

    }

     ngOnInit() {
        this.deviceService.getDeviceInfo()
            .then((deviceInfo: DeviceInfo)=>{
                this.deviceInfo = deviceInfo;
            });
        this.deviceService.getAppInfo().then((appInfo: AppInfo)=>{
            this.appInfo = appInfo;
        })

    }
    ngOnDestroy() {

    }
    versionCode() {
        return this.platform.versions()
    }

    isCordova() {
        return this.platform.is('cordova');
    }
    // async sendMessage() {
    //     let deviceInfo: DeviceInfo = await this.deviceService.getDeviceInfo();
    //
    //     this.stompService.sendMessage(deviceInfo,
    //         '/app//mygolf2u-ws/device/register');
    // }
}
