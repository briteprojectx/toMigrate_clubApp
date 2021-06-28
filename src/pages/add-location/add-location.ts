import {AlertController, Events, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {Component} from '@angular/core';
import * as globals from '../../globals';
import {ClubList, createClubList} from '../../data/club-course';
import {PlayerService} from '../../providers/player-service/player-service';
import {Country} from '../../data/country-location';
import {AddStateListPage} from '../add-state-list/add-state-list';
import {isPresent} from 'ionic-angular/util/util';
/**
 * The competition list page class. This class lists the competitions. There are
 * three types of listing
 *  This class extends Subscriber which is passed as parameter for Remote Http method so that
 *  results are processed
 */
@Component({
    templateUrl: 'add-location.html',
    selector: 'add-location-page'
})
export class AddLocationPage
{
    clubList: ClubList;
    openedModal: boolean = false;
    searchQuery: string;
    stateName: string;

    state: string;
    city: string;
    country: string = "MYS";
    countryList: Array<Country>;

    constructor(private nav: NavController,
        private modalCtl: ModalController,
        private navParams: NavParams,
        private alertCtl: AlertController,
        private playerService: PlayerService,
        private viewCtl: ViewController,
        private events: Events) {
        this.clubList    = createClubList();
        this.openedModal = navParams.get("openedModal");
    }

    ionViewDidLoad() {
        this.getCountry();
    }

    goStatePicklist() {
        let modal = this.modalCtl.create(AddStateListPage, {
            openedModal: true
        });
        modal.present();
    }

    addFavouriteLocation() {

        // if (!isPresent(this.state)) {
        //     globals.displayError(this.alertCtl, "State cannot be blank!", "Favourite Location", "OK");
        //     console.log("State NULL");
        //     return;
        // }

        this.playerService.addFavoriteLocation(this.country, this.state, this.city)
            .subscribe(() => {
                // this.events.publish("FavouriteListUpdate");
                // this.nav.pop();
                this.viewCtl.dismiss();

            })

    }

    close() {
        this.viewCtl.dismiss();
    }

    getCountry() {
        this.playerService.getCountryList()
                .subscribe((data: Array<Country>) => {
                            // console.log("Country Sign Up : ",data)
                            this.countryList = data;
                            // console.log("Country List Sign Up : ", this.countryList)
        });
    }

}
