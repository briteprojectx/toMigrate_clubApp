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
import {PlayerInfo} from '../../data/player-data';
import {JsonService} from '../../json-util';
import {ImageData, ImageService} from '../../providers/image-service/image-service';
import {PlayerService} from '../../providers/player-service/player-service';
import {PlayerHomeActions} from '../../redux/player-home/player-home-actions';
import {ContentType} from '../../remote-request';
/**
 * Created by Ashok on 21-06-2016.
 */
@Component({
    templateUrl: "profile-image-edit.html",
    selector   : 'profile-image-editor'
})
export class ProfileImageEdit {
    // player: PlayerInfo;
    player$: Observable<PlayerInfo>;
    playerPhoto$: Observable<string>;
    friend: boolean;
    constructor(private nav: NavController,
        private playerHomeActions: PlayerHomeActions,
        private navParams: NavParams,
        private loadingCtl: LoadingController,
        private alertCtl: AlertController,
        private viewCtl: ViewController,
        private imageService: ImageService,
        private playerService: PlayerService,
        private app: App,
        private platform: Platform) {
        this.friend = navParams.get('friend');
        this.player$      = navParams.get("player");
        this.playerPhoto$ = this.player$.map((playerInfo: PlayerInfo) => {
            if (playerInfo.photoUrl) {
                return playerInfo.photoUrl;
            } else if (!playerInfo.photoUrl && playerInfo.thumbnail) {
                return playerInfo.thumbnail;
            } else {
                return '';
            }
        });
        //this.initializeMap();
    }

    ionViewDidEnter() {
    }

    takePhoto() {
        this.imageService.captureImage(true)
            .subscribe((data: ImageData) => {
                this._uploadImage(data.originalURL);
                console.log("[photo] take photo data : ",data)
            }, (error) => {
                console.log("[photo] take photo : ",  error)
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
                console.log("[photo] select  photo data : ",data)
            }, (error) => {
                console.log("[photo] select photo : ", error)
                //Ignore this error
            });
    }

    getPlayerId(): Promise<number> {
        return this.player$.take(1).map((player) => player.playerId).toPromise();
    }

    _uploadImage(imageURL: string) {
        this.getPlayerId().then((playerId: number) => {
            let uploadLoading = this.loadingCtl.create({
                content: 'Uploading, Please wait...'
            });
            uploadLoading.present().then(() => {
                this.playerHomeActions.updatePlayerPhoto(imageURL, ContentType.WILDCARD_IMAGE, playerId, this.friend)
                    .subscribe((player: PlayerInfo) => {
                        uploadLoading.dismiss().then(() => {
                            this.cancelEditImage();
                        })
                    }, (error) => {
                        console.log("[photo] uploading image : ", error)
                        uploadLoading.dismiss().then(() => {
                            // 'Please upload photo not more than 10 MB'
                            // if(error || error !== null) {
                                let alert = this.alertCtl.create({
                                    title  : "Upload Error",
                                    message: 'Please upload photo not more than 10 MB',
                                    buttons: ["Ok"]
                                });
                                alert.present();
                            // }
                            // else this.cancelEditImage();
                            
                        })
                    })
            });
        });
        // this.playerService.updatePhoto(imageURL, ContentType.JPEG, Subscriber.create(
        //     (result: UploadResult) => {
        //         uploadLoading.onDidDismiss(() => {
        //             this.cancelEditImage();
        //         });
        //         let playerInfo = JSON.parse(result.message);
        //         this._onPhotoChange(playerInfo);
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
        
        console.log("cancel edit image ")
        this.viewCtl.dismiss({
            needRefresh: true
        });
        // return false;
    }

    
    close() {
        
        console.log("cancel edit image ")
        this.viewCtl.dismiss({
            needRefresh: false
        });
    }

    // private _onPhotoChange(playerInfo: PlayerInfo) {
    //     this.player.photoUrl  = playerInfo.photoUrl;
    //     this.player.thumbnail = playerInfo.thumbnail;
    //     JsonService.deriveFullUrl(this.player, "photoUrl");
    //     JsonService.deriveFullUrl(this.player, "thumbnail");
    //     // this.cancelEditImage();
    // }
}
