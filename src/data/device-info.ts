import {PagedResult} from './paged-result';
/**
 * Created by ashok on 04/05/17.
 */

export interface DeviceInfo {
    deviceId?: string;
    deviceName?: string;
    virtual?: boolean;
    cordovaVersion?: string;
    platform?: string;
    platformVersion?: string;
    model?: string;
    manufacturer?: string;
    serial?: string;
}
export interface DeviceList extends PagedResult{
    deviceList?: DeviceInfo[];
}