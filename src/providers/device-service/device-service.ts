import {Injectable} from '@angular/core';
import {AppVersion} from '@ionic-native/app-version';
import {BatteryStatus, BatteryStatusResponse} from '@ionic-native/battery-status';
import {Device} from '@ionic-native/device';
import {Platform} from 'ionic-angular';
import {Subject} from 'rxjs/Subject';
import {AppInfo} from '../../data/app-info';
import {DeviceInfo} from '../../data/device-info';
import {generateUUID} from '../../globals';
import {MyGolfStorageService} from '../../storage/mygolf-storage.service';
/**
 * Created by ashok on 04/05/17.
 */
@Injectable()
export class DeviceService {
    batteryChange$: Subject<BatteryStatusResponse>;
    batteryLow$: Subject<BatteryStatusResponse>;
    batteryCritical$: Subject<BatteryStatusResponse>;
    deviceInfo: DeviceInfo;
    constructor(private platform: Platform,
        private storage: MyGolfStorageService,
        private battery: BatteryStatus,
        private appVersion: AppVersion,
        private device: Device) {
        this.batteryChange$ = new Subject<BatteryStatusResponse>();
        this.batteryLow$ = new Subject<BatteryStatusResponse>();
        this.batteryCritical$ = new Subject<BatteryStatusResponse>();
        if (this.platform.is('mobile')) {//On Mobile Devices
            this.battery.onChange()
                .debounceTime(30000)
                .subscribe((response: BatteryStatusResponse)=>this.batteryChange$.next(response));
            this.battery.onLow()
                .distinctUntilChanged()
                .subscribe((response: BatteryStatusResponse)=>this.batteryChange$.next(response));
            this.battery.onCritical()
                .distinctUntilChanged()
                .subscribe((response: BatteryStatusResponse)=>this.batteryChange$.next(response));
        }
        this.getDeviceInfo().then((info: DeviceInfo)=>{
            this.deviceInfo = info;
        });

    }
    async getAppInfo (): Promise<AppInfo>{
        if(this.platform.is('cordova')){
            return <AppInfo>{
                packageName: await this.appVersion.getPackageName(),
                versionNumber: await this.appVersion.getVersionNumber(),
                versionCode: await this.appVersion.getVersionCode(),
                appName: await this.appVersion.getAppName()
            };
        }
        else return {};
    }
    async getDeviceInfo(): Promise<DeviceInfo> {
        if (this.platform.is('cordova')) {
            let deviceInfo: DeviceInfo = {
                deviceId    : this.device.uuid,
                virtual     : this.device.isVirtual,
                platform    : this.device.platform,
                platformVersion: this.device.version,
                model       : this.device.model,
                manufacturer: this.device.manufacturer,
                serial      : this.device.serial,
                cordovaVersion: this.device.cordova
            };
            return deviceInfo;
        }
        else {
            let deviceId: string = await this.storage.preferenceString("mygolf2u.deviceId");
            if (!deviceId) {
                deviceId = generateUUID();
                this.storage.setPreference("mygolf2u.deviceId", deviceId).subscribe(() => {
                });
            }
            return {
                deviceId: deviceId,
                virtual : false,
                platform: (navigator?navigator.appCodeName:'browser'),
                manufacturer: (navigator?navigator.vendor:''),
                model: (navigator?navigator.appName:'')
            }
        }
    }
    public getBatteryChange(): Subject<BatteryStatusResponse> {
        return this.batteryChange$;
    }
    public getBatteryLow(): Subject<BatteryStatusResponse> {
        return this.batteryLow$;
    }
    public getBatteryCritical(): Subject<BatteryStatusResponse> {
        return this.batteryCritical$;
    }

    public getCachedDeviceInfo(): DeviceInfo{
        return this.deviceInfo;
    }

}