// import { PlayerHomeActions } from './../../../redux/player-home/player-home-actions';
// import { PlayerInfo } from './../../../data/mygolf.data';
// import { PlayerService } from './../../../providers/player-service/player-service';
import { ImageData, ImageService } from './../../../providers/image-service/image-service';
import {Component} from '@angular/core';
import {
    AlertController,
    App,
    LoadingController,
    NavController,
    NavParams,
    Platform,
    ViewController
} from 'ionic-angular/index';
import {Observable} from 'rxjs/Observable';
/**
 * Created by Ashok on 21-06-2016.
 */
@Component({
    templateUrl: "image-zoom.html",
    selector   : 'image-zoom'
})
export class ImageZoom {
    // player: PlayerInfo;
    // player$: Observable<PlayerInfo>;
    playerPhoto$: Observable<string>;
    friend: boolean;
    image: string;
    constructor(private nav: NavController,
        // private playerHomeActions: PlayerHomeActions,
        private navParams: NavParams,
        private loadingCtl: LoadingController,
        private alertCtl: AlertController,
        private viewCtl: ViewController,
        private imageService: ImageService,
        // private playerService: PlayerService,
        private app: App,
        private platform: Platform,
        private viewCtrl: ViewController) {
        this.image = navParams.get("image");

    }

    ionViewDidEnter() {
    }

    close() {
            this.viewCtrl.dismiss();
    }
}
