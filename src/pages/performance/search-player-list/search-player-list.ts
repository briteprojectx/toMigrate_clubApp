import {NavController, ViewController, NavParams, Events} from "ionic-angular";
import {Component} from "@angular/core";
import {AuthenticationService} from "../../../authentication-service";
import {PlayerList, PlayerInfo, createPlayerList} from "../../../data/player-data";
import {PlayerService} from "../../../providers/player-service/player-service";
import {ProfilePage} from "../../profile/profile";

@Component({
    templateUrl: 'search-player-list.html'
})
export class PerformanceSearchPlayerListPage
{
    public playerList: PlayerList;
    public searchQuery: string = '';
    public tabs: string = '';
    public selectedPlayerList: PlayerList;

    constructor(private nav: NavController,
        private navParams: NavParams,
        private auth: AuthenticationService,
        private playerService: PlayerService,
        private events: Events,
        private viewCtl: ViewController) {
        this._clearItems();
        this.tabs                       = 'available';
        this.selectedPlayerList         = createPlayerList();
        this.selectedPlayerList.players = navParams.get("selectedPlayerList");

    }

    onPageWillEnter() {
        this._refreshPlayer(null, null);
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

    checkFriend() {
        let selectedFriend = this.playerList;
        console.log(selectedFriend)
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

    addPlayer(event, item: PlayerInfo, idx: number) {
        // this.events.publish("addPlayer", item);
        this.selectedPlayerList.players.push(item);
        //remove this item from the player list
        // let idx = this.playerList.players.findIndex((player: PlayerInfo, i: number)=>{
        //    return player.playerId === item.playerId;
        // });
        if (idx >= 0)
            this.playerList.players.splice(idx, 1);
        // console.log(item);
        // console.log(this.selectedPlayerList.players)
    }

    removePlayer(event, item: PlayerInfo, idx: number) {
        this.playerList.players.push(item);
        this.selectedPlayerList.players.splice(idx, 1);
    }

    close() {
        this.viewCtl.dismiss();
    }

    select() {
        this.viewCtl.dismiss(this.selectedPlayerList.players);
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
                //Filter already added
                let refreshedPlayers        = playerList.players
                                                        .filter(player => {
                                                            let idx = this.selectedPlayerList.players.findIndex((sp) => {
                                                                return sp.playerId === player.playerId;
                                                            });
                                                            return idx < 0;
                                                        });

                this.playerList.players.push(...refreshedPlayers);
                // this.playerList.players.checked = false;
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
