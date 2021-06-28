import {Injectable} from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation';
import {Platform} from 'ionic-angular';
/*
 Generated class for the GeolocationService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class GeolocationService
{
    private lastLocation: Coordinates;

    constructor(platform: Platform, private geolocation: Geolocation) {
        platform.ready().then(() => {
            geolocation.getCurrentPosition()
                       .then((position: Position) => {
                           this.lastLocation = position.coords;
                           // console.log(this.lastLocation);
                       }).catch((error) => {
                console.log(error);
            });
            //Add a watch on the location
            geolocation.watchPosition()
                       .subscribe((pos: Position) => {
                           this.lastLocation = pos.coords;
                           // console.log(this.lastLocation);
                       }, (error) => {
                           console.log(error);
                       });
        });

    }

    public getLatitude(): number {
        if (this.lastLocation) return this.lastLocation.latitude;
        else return null;
    }

    public getLongitude(): number {
        if (this.lastLocation) return this.lastLocation.longitude;
        else return null;
    }

    /**
     * Stop the geolocation watch
     */
    public stop() {
        // if(isPresent(this.watch) && !this.watch.isUnsubscribed)
        //     this.watch.unsubscribe();
    }

}

