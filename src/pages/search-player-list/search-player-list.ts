import {NavController, ViewController, NavParams, Events} from "ionic-angular";
import {Component, Renderer} from "@angular/core";
import {AuthenticationService} from "../../authentication-service";
import {PlayerList, PlayerInfo, createPlayerList} from "../../data/player-data";
import {PlayerService} from "../../providers/player-service/player-service";
import {ProfilePage} from "../profile/profile";
import {adjustViewZIndex} from "../../globals";

@Component({
    templateUrl: 'search-player-list.html'
})
export class SearchPlayerListPage
{
    playerList: PlayerList;
    searchQuery: string;

    constructor(private nav: NavController,
        private renderer: Renderer,
        private navParams: NavParams,
        private auth: AuthenticationService,
        private playerService: PlayerService,
        private events: Events,
        private viewCtl: ViewController) {
        this._clearItems();
    }

    ionViewDidLoad() {
        this._refreshPlayer(null, null);
    }

    ionViewDidEnter() {
        adjustViewZIndex(this.nav, this.renderer);
    }

    /**
     * Executed when refresh button on toolbar is clicked
     */
    onRefreshClick(refresher) {
        this._clearItems();
        this._refreshPlayer(refresher, null);
    }

    onSearchInput(event) {
        this._clearItems();
        this._refreshPlayer(null, null);
    }

    doInfinite(infinite) {

        if (this.isMore()) {
            this._refreshPlayer(null, infinite);
        }

    }

    playerSelected(event, item: PlayerInfo) {
        this.events.publish("playerSelected", item);
        this.nav.push(ProfilePage, {
            status: 'notFriend',
            type  : 'friendProfile',
            player: item
        });
    }

    close() {
        this.viewCtl.dismiss();
    }

    private _clearItems() {
        this.playerList = createPlayerList();
    }

    private _refreshPlayer(refresher, infinite) {
        this.playerService.searchPlayers(this.searchQuery, true, this.playerList.currentPage + 1)
            .subscribe((playerList: PlayerList) => {

                this.playerList.currentPage = playerList.currentPage;
                this.playerList.totalPages  = playerList.totalInPage;
                this.playerList.totalItems  = playerList.totalItems;
                this.playerList.players.push(...playerList.players);
            }, (error) => {

            }, () => {
                //Handle the refresher or infinite
                if (refresher && refresher.complete) refresher.complete();
                if (infinite) {
                    if (infinite.complete) infinite.complete();
                    if (this.isMore()) {
                        infinite.enable(true);
                    }
                    else infinite.enable(false);
                }
            });
    }

    isMore(): boolean {
        return this.playerList.totalPages > 0
            && this.playerList.currentPage < this.playerList.totalPages;
    }

}
