import {Component, Renderer2} from '@angular/core';
import {CourseHoleInfo} from '../../data/club-course';
import {NavController, NavParams} from 'ionic-angular/index';
import {Geolocation} from '@ionic-native/geolocation';
import {GeolocationService} from '../../providers/geolocation-service/geolocation-service';
import * as globals from '../../globals';
import {adjustViewZIndex} from '../../globals';
declare var $: any;
/**
 * Created by Ashok on 29-06-2016.
 */

@Component({
    templateUrl: 'hole-googlemap.html',
})
export class HoleGoogleMapPage
{

    map: any;
    currentHole: CourseHoleInfo;

    original: any;
    current: any;
    distance: number = 0;
    distanceDisplay: string;
    userPosition: any;
    numberFormatter: Intl.NumberFormat;

    constructor(private navParams: NavParams,
        private nav: NavController,
        private renderer: Renderer2,
        private geoloc: Geolocation,
        private geoLocation: GeolocationService) {
        this.currentHole     = navParams.get("hole");
        this.numberFormatter = Intl.NumberFormat("en-US", {
            maximumFractionDigits: 2,
            useGrouping          : true
        });
    }

    ionViewDidLoad() {
        if (this.currentHole.latitude === null && this.currentHole.longitude === null) {
            $("#holemap").text("GPS Co-ordinates not available for this hole");
        }
        else {
            let googleMaps    = (<any> window["google"]["maps"]);
            this.original     = new googleMaps.LatLng(this.currentHole.latitude,
                this.currentHole.longitude);
            this.userPosition = {
                latitude : this.geoLocation.getLatitude(),
                longitude: this.geoLocation.getLongitude()
            };

            this.loadMap();
        }

    }

    ionViewDidEnter() {
        adjustViewZIndex(this.nav, this.renderer);
    }

    ionViewWillLeave() {

    }

    loadMap() {
        let googleMaps = (<any> window["google"]["maps"]);
        this.current   = new googleMaps.LatLng(this.currentHole.latitude,
            this.currentHole.longitude);
        this.geoloc.watchPosition()
                   .subscribe((pos: Position) => {
                       this.userPosition = pos.coords;
                       this._calcDistance();
                   }, (error) => {

                   });
        let mapOptions = {
            center           : this.current,
            zoom             : 19,
            mapTypeId        : googleMaps.MapTypeId.SATELLITE,
            mapTypeControl   : false,
            // scaleControl: true,
            streetViewControl: false,
            rotateControl    : false,
            noClear          : false,
        };

        this.map = new googleMaps.Map(document.getElementById("holemap"), mapOptions);
        // this.map.fitBounds({
        //     east: 101.640515,
        //     west: 101.640788,
        //     north: 3.133618,
        //     south: 3.131509
        // });
        this._calcDistance();
        setTimeout(() => {
            googleMaps.event.trigger(this.map, 'resize');
            this.map.setZoom(this.map.getZoom());
            this.map.setCenter(this.current);
            let marker = new googleMaps.Marker({
                position : this.current,
                draggable: true,
                map      : this.map,
                animation: googleMaps.Animation.DROP,
                title    : 'Putting',
                icon     : "img/golf-flag.png"
            });
            this.map.panTo(this.current);
            marker.addListener('drag', () => {
                this.current = marker.getPosition();
                this.map.setCenter(marker.getPosition());
                this._calcDistance();
            });
        }, 1000);

    }

    private _calcDistance() {

        this.distance        = globals.getDistanceInMeters(this.userPosition.latitude,
            this.userPosition.longitude, this.current.lat(), this.current.lng());
        this.distanceDisplay = this.numberFormatter.format(this.distance);
    }
}
