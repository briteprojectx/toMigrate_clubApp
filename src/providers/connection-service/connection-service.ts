import {Injectable} from '@angular/core';
import {Network} from '@ionic-native/network';
import {Platform} from 'ionic-angular/index';
import 'rxjs/add/operator/map';
/*
 Generated class for the ConnectionService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class ConnectionService
{
    private connected: boolean;
    private connectionType;

    constructor(private platform: Platform, private network: Network) {
        this.platform.ready().then(() => {
            this.network.onConnect().subscribe(() => {
                this.onConnect();
            });
            this.network.onDisconnect().subscribe(() => {
                this.onDisconnect();
            });
        });
    }

    private onConnect() {
        this.connected = true;
        setTimeout(() => {
            this.connectionType = this.network.type;
        });
    }

    private onDisconnect() {
        this.connected      = false;
        this.connectionType = null;
    }

    /**
     * Checks whether connected to network or not
     * @returns {boolean} Returns true if connected to network
     */
    public isConnected(): boolean {
        if(this.platform.is('cordova'))
            return this.network.type !== 'none';
        else return true;
    }

    /**
     * Checks whether you are connected to WiFi network
     * @returns {boolean} True if connected to WiFi network
     */
    public isWifi(): boolean {
        if(this.platform.is('cordova'))
            return this.network.type === "wifi";
        else return false;
    }

    /**
     * Checks whether your are connected to 4G network
     * @returns {boolean}
     */
    public is4G(): boolean {
        if(this.platform.is('cordova'))
            return this.network.type === "4g";
        else return false;
    }

    /**
     * Checks whether connected to 3G network
     * @returns {boolean}
     */
    public is3G(): boolean {
        if(this.platform.is('cordova'))
            return this.network.type === "3g";
        else return false;
    }

    /**
     * Checks whether connected to 2G network
     * @returns {boolean}
     */
    public is2G(): boolean {
        if(this.platform.is('cordova'))
            return this.network.type === "2g";
        else return false;
    }
}



