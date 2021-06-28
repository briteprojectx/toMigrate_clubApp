import {
    AlertController,
    Events,
    LoadingController,
    ModalController,
    NavController,
    Platform,
    ToastController
} from 'ionic-angular';
import {Component, Renderer} from '@angular/core';
import {adjustViewZIndex, getDistanceInKM} from '../../globals';
import {MessageDisplayUtil} from '../../message-display-utils';
import {ClubInfo} from '../../data/club-course';
import {Location} from '../../data/country-location';
import {PlayerService} from '../../providers/player-service/player-service';
import {GeolocationService} from '../../providers/geolocation-service/geolocation-service';
import {AddLocationPage} from '../add-location/add-location';
import {ClubListPage} from '../normalgame/club-list/club-list';
/**
 * The competition list page class. This class lists the competitions. There are
 * three types of listing
 *  This class extends Subscriber which is passed as parameter for Remote Http method so that
 *  results are processed
 */
@Component({
    templateUrl: 'player-favourite-list.html',
    selector: 'player-favourite-page'
})
export class FavouriteListPage
{
    public favourites: Array<ClubInfo> = [];
    public locations: Array<Location>  = [];
    public clubIds: Array<number>      = [];

    constructor(private nav: NavController,
        private renderer: Renderer,
        private playerService: PlayerService,
        private geo: GeolocationService,
        private modalCtl: ModalController,
        private alertCtl: AlertController,
        private toastCtl: ToastController,
        private events: Events,
        private platform: Platform,
        private loadingCtl: LoadingController) {

        events.subscribe("FavouriteListUpdate", () => {
            this._refreshFavourites();
        });
    }

    ionViewDidLoad() {
        this._refreshFavourites();
    }

    ionViewDidEnter() {
        adjustViewZIndex(this.nav, this.renderer);
    }

    private _refreshFavourites() {
        let loader = this.loadingCtl.create({
            content: "Refreshing favorites..."
        });

        loader.present().then(() => {
            this.playerService.getFavoriteClubs(false)
                .subscribe((favourites: Array<ClubInfo>) => {
                    this.playerService.getFavoriteLocations()
                        .subscribe((locations: Array<Location>) => {
                            loader.dismiss().then(() => {
                                this.favourites = favourites;
                                this.clubIds    = [];
                                favourites.forEach((m: ClubInfo) => {
                                    this.clubIds.push(m.clubId);
                                });

                                this.locations = locations;
                            });
                        }, (error) => {
                            loader.dismiss();
                            let msg = MessageDisplayUtil.getErrorMessage(error);
                            MessageDisplayUtil.displayErrorAlert(this.alertCtl, "Favourites",
                                msg, "OK");
                        });
                }, (error) => {
                    loader.dismiss();
                    let msg = MessageDisplayUtil.getErrorMessage(error);
                    MessageDisplayUtil.displayErrorAlert(this.alertCtl, "Favourites",
                        msg, "OK");
                });
        })

    }

    /**
     * Gets the distance between a current location and club in KMs
     * @param club The club information
     * @returns {number} Returns the distance in KM if GPS locations of current and club are available
     * else returns 0;
     */
    clubDistance(club: ClubInfo): string {
        let lat1 = this.geo.getLatitude();
        let lon1 = this.geo.getLongitude();
        if (lat1 != null && lon1 != null && club.latitude != null && club.longitude != null)
            return getDistanceInKM(lat1, lon1, club.latitude, club.longitude) + " KM";
        return "";
    }

    onRefreshFavorite() {
        this._refreshFavourites();
    }

    addClubFavourite() {

    }

    openClubFavourite() {
        let modal = this.modalCtl.create(ClubListPage, {
            openedModal: true
        });
        modal.onDidDismiss((data: ClubInfo) => {
            if (data) {
                this.addFavoriteClubProcess(data);
            }
        });
        modal.present();
    }

    private addFavoriteClubProcess(club: ClubInfo) {
        let loader = this.loadingCtl.create({
            showBackdrop: false,
            duration: 5000,
            content: 'Adding favourite club...'
        });

        loader.present().then(()=>{
            this.playerService.addFavoriteClub(club.clubId)
            .subscribe(() => {
                loader.dismiss().then(()=>{
                    this._refreshFavourites();
                })
                
            }, (error)=>{
                loader.dismiss();
            })
        })
        
    }

    openLocFavourite() {
        //this.nav.push(AddLocationPage);
        let modal = this.modalCtl.create(AddLocationPage, {
            openedModal: true
        });

        modal.onDidDismiss((data: ClubInfo) => {
            this._refreshFavourites();
        })
        // modal.onDismiss((data: ClubInfo)=> {
        //  if (data) {
        //  this.addFavoriteClubProcess(data);
        //  }
        //  });
        modal.present();

    }

    deleteFavouriteClubConfirm(favourite: ClubInfo) {
        let confirm = this.alertCtl.create({
            title  : "Delete Favourite",
            message: "Do you want to delete your Favourite Club?",
            buttons: [
                {
                    text: 'No',
                    role: "cancel",

                    handler: () => {
                        confirm.dismiss();
                        return false;
                    }
                },
                {
                    text   : 'Delete',
                    cssClass: 'delete-item',
                    role   : "delete",
                    handler: () => {
                        confirm.dismiss()
                               .then(() => {
                                   this._deleteClubFavourite(favourite);
                               });
                        return false;
                    }
                }

            ]
        });
        confirm.present();
    }

    private _deleteClubFavourite(favourite: ClubInfo) {
        let busy = this.loadingCtl.create({
            content: "Deleting favourite club..."
        });
        busy.present().then(() => {
            this.playerService.deleteFavoriteClub(favourite.clubId)
                .subscribe(() => {
                    busy.dismiss().then(() => {
                        this._refreshFavourites();
                    })

                }, (error) => {
                    busy.dismiss(() => {
                        let msg = MessageDisplayUtil.getErrorMessage(error, "Error deleting favourite club.");
                        MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl, 3000, "bottom");
                    })
                });
        })

    }

    deleteFavouriteLocationConfirm(location: Location) {
        let confirm = this.alertCtl.create({
            title  : "Delete Favourite",
            message: "Do you want to delete your Favourite Location?",
            buttons: [
                {
                    text: 'No',
                    role: "cancel",

                    handler: () => {
                        confirm.dismiss();
                        return false;
                    }
                },
                {
                    text   : 'Delete',
                    cssClass: 'delete-item',
                    role   : "delete",
                    handler: () => {
                        confirm.dismiss()
                               .then(() => {
                                   this._deleteLocationFavourite(location);
                               });
                        return false;
                    }
                }

            ]
        });
        confirm.present();
    }

    private _deleteLocationFavourite(location: Location) {
        this.playerService.deleteFavoriteLocation(location.countryId, location.state, location.city)
            .subscribe(() => {
                this._refreshFavourites();
            });
    }
}
