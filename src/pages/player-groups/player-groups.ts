import {NavController, NavParams, Events, ViewController, AlertController, LoadingController} from "ionic-angular";
import {Component} from "@angular/core";
import {PlayerService} from "../../providers/player-service/player-service";
import {PlayerGroupList, PlayerGroup} from "../../data/player-data";

/*
 Generated class for the PlayerGroupsPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    templateUrl: 'player-groups.html',
    selector: 'player-groups-page'
})
export class PlayerGroupsPage
{
    refreshing: boolean = true;
    public playerGroupList: PlayerGroupList;
    public selectAndReturn: boolean = false;
    public selectedGroup: PlayerGroup;

    constructor(private nav: NavController,
        private alertCtl: AlertController,
        private loadingCtl: LoadingController,
        private viewCtl: ViewController,
        private navParams: NavParams,
        private playerService: PlayerService,
        private events: Events) {
        this.playerGroupList = {
            success     : true,
            playerGroups: []
        };
        this.selectAndReturn = navParams.get("selectAndReturn");
    }

    ionViewDidLoad() {
        this._refreshPlayerGroups();
    }

    onGroupSelection(event, group) {
        // this.events.publish("playerGroupSelected", group);
        if (this.selectAndReturn) {
            this.viewCtl.dismiss(group);
            // this.nav.pop();
        }

    }

    onDeleteFlightClick(event, group: PlayerGroup) {
        let confirm = this.alertCtl.create({
            title                : "Delete Player Group",
            message              : "Do you want to delete the player group " + group.groupName + "?",
            enableBackdropDismiss: true,
            buttons              : [{
                text   : "No",
                role   : "cancel",
                handler: () => {
                    confirm.dismiss();
                    return false;
                }
            }, {
                text   : "Yes",
                handler: () => {
                    confirm.dismiss().then(() => {
                        this.deleteGroup(group);
                    });
                    return false;
                }
            }]
        });
        confirm.present();
    }

    deleteGroup(group: PlayerGroup) {
        let loading = this.loadingCtl.create({
            showBackdrop: false
        });
        loading.onDidDismiss((refresh: boolean) => {
            if (refresh)
                this._refreshPlayerGroups();
        });
        this.playerService.deletePlayerGroup(group.id)
            .subscribe((result: boolean) => {
                loading.dismiss(result);
            }, (error) => {
                loading.dismiss(false);
            });
        loading.present();
    }

    cancelGroup() {
        this.viewCtl.dismiss();
    }

    private _refreshPlayerGroups() {
        this.refreshing = true;
        this.playerService.getPlayerGroups()
            .subscribe((pgList: PlayerGroupList) => {
                this.playerGroupList = pgList;
                this.refreshing = false;
            }, (error) => {
                console.error(error);
            })
    }
}
