import {
    Platform,
    NavController,
    NavParams,
    ViewController,
    LoadingController,
    AlertController
} from "ionic-angular/index";
import {PlayerInfo} from "../../data/player-data";
import {ImageService, ImageData} from "../../providers/image-service/image-service";
import {PlayerService} from "../../providers/player-service/player-service";
import {UploadResult} from "../../data/fileupload-result";
import {ContentType} from "../../remote-request";
import {Subscriber} from "rxjs/Rx";
import {JsonService} from "../../json-util";
import {Component} from "@angular/core";
/**
 * Created by Ashok on 21-06-2016.
 */
@Component({
    templateUrl: "friend-image-show.html",
    selector: 'friend-image-show'
})
export class FriendImageShow
{
    player: PlayerInfo;

    constructor(private nav: NavController,
        private navParams: NavParams,
        private viewCtl: ViewController,
        private imageService: ImageService,
        private playerService: PlayerService,
        private loadingCtl: LoadingController,
        private alertCtl: AlertController,
        private platform: Platform) {
        this.player = navParams.get("player");
        //this.initializeMap();
    }

    takePhoto() {
        this.imageService.captureImage(true)
            .subscribe((data: ImageData) => {
                // this.imageUrl = data.originalURL;

                this._uploadImage(data.originalURL);
            }, (error) => {
                // alert(JSON.stringify(error));
            });
    }

    isCordova() {
        return this.platform.is('cordova');
    }

    selectPhoto() {
        this.imageService.pickImage()
            .subscribe((data: ImageData) => {
                this._uploadImage(data.originalURL);
                // this.imageUrl = data.originalURL;
            }, (error) => {
                //Ignore this error
            });

    }

    _uploadImage(imageURL: string) {

        // let uploadLoading = this.loadingCtl.create({
        //     content            : 'Uploading, Please wait...',
        //     dismissOnPageChange: true
        // });
        // uploadLoading.present();
        // this.playerService.updatePhoto(imageURL, ContentType.JPEG, Subscriber.create(
        //     (result: UploadResult) => {
        //         uploadLoading.onDidDismiss(() => {
        //             this.cancelEditImage();
        //         })
        //         this._onPhotoChange(result.message);
        //         uploadLoading.dismiss();
        //     }, (error) => {
        //         uploadLoading.dismiss();
        //         let alert = this.alertCtl.create({
        //             title  : "Upload Error",
        //             message: error,
        //             buttons: ["Ok"]
        //         });
        //         alert.present();
        //     }
        // ));
    }

    cancelEditImage() {
        this.viewCtl.dismiss();
    }

    private _onPhotoChange(message: string) {
        this.player.photoUrl = message;
        JsonService.deriveFullUrl(this.player, "photoUrl");
        // this.cancelEditImage();
    }

}
