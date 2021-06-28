import {NavController, NavParams, LoadingController} from "ionic-angular";
import {Component, Renderer} from "@angular/core";
import {CompetitionInfo, FlightInfo, CompetitionDetails, FlightMember} from "../../../data/competition-data";
import {GameRoundInfo, createGameRoundInfo} from "../../../data/game-round";
import {CompetitionService} from "../../../providers/competition-service/competition-service";
import {adjustViewZIndex} from "../../../globals";
import * as moment from "moment";
import {
    NotificationHandlerInfo,
    AbstractNotificationHandlerPage
} from "../../../providers/pushnotification-service/notification-handler-constructs";

@Component({
    templateUrl: 'flight-buggy-lists.html',
    selector: 'flight-buggy-lists-page'
})
export class FlightBuggyListsPage
{
    public competition: CompetitionInfo;
    public details: CompetitionDetails;
    public gameRound: GameRoundInfo;
    public visible: boolean;
    public flights: Array<FlightInfo>        = new Array<FlightInfo>();
    //  private flightMembers: Array<FlightMember> = new Array<FlightMember>();
    public filteredFlight: Array<FlightInfo> = new Array<FlightInfo>();
    public searchQuery: string               = '';

    constructor(private nav: NavController,
        private renderer: Renderer,
        private navParams: NavParams,
        private loadingCtl: LoadingController,
        private compService: CompetitionService) {

        this.competition = navParams.get("competition");
        this.flights     = navParams.get("flights");
        this.gameRound   = navParams.get("gameRound");
        if (!this.competition) {
            this.competition       = {
                competitionId: navParams.get("competitionId")
            };
            this.flights           = new Array<FlightInfo>();
            this.gameRound         = createGameRoundInfo();
            this.gameRound.roundNo = navParams.get("roundNo");
        }
        this.filteredFlight = this.flights;
        //this.flightMembers = this.flights.flightMembers;
        this.visible        = false;
        this.searchQuery    = '';
    }

    ionViewDidLoad() {
        this._onViewLoaded();
    }

    ionViewDidEnter() {
        adjustViewZIndex(this.nav, this.renderer);
    }
    getNotifications(): Array<NotificationHandlerInfo>{
        let notifications = new Array<NotificationHandlerInfo>();
        notifications.push({
            type       : AbstractNotificationHandlerPage.TYPE_FLIGHTS_GENERATED,
            whenActive : 'showToast',
            needRefresh: true
        });
        notifications.push({
            type       : AbstractNotificationHandlerPage.TYPE_FLIGHTS_CHANGED,
            whenActive : 'showToast',
            needRefresh: true
        });
        return notifications;
    }
    refreshPage(pushData: any){
        let compId = pushData.competitionId;
        let roundNo = pushData.roundNo;
        if(this.competition.competitionId === compId){
            this.onRefreshClick(null);
        }
        else{
            this.competition.competitionId = compId;
            this.competition.competitionName = null;
            this.gameRound.roundNo = roundNo;
            this._onViewLoaded();
        }
    }
    private _onViewLoaded(){
        if (!this.competition.competitionName) {
            let loader = this.loadingCtl.create({
                content: "Loading..."
            });

            loader.present().then(() => {
                this.compService.getCompetitionInfo(this.competition.competitionId)
                    .subscribe((comp: CompetitionInfo) => {
                        this.competition = comp;
                        this.compService.getDetails(this.competition.competitionId)
                            .subscribe((det: CompetitionDetails) => {
                                this.details   = det;
                                let ground     = det.gameRounds.filter((gr: GameRoundInfo) => {
                                    return gr.roundNo === this.gameRound.roundNo
                                }).pop();
                                this.gameRound = ground;
                                this.compService.getFlights(this.competition.competitionId, this.gameRound.roundNo)
                                    .subscribe((flights: Array<FlightInfo>) => {
                                        loader.dismiss().then(() => {
                                            this.flights        = flights;
                                            this.filteredFlight = this.flights;
                                            this.searchQuery    = "";
                                            this.onSearchCancel();
                                            console.log(this.flights)
                                        })

                                    }, (error) => {
                                        loader.dismiss();
                                    }, () => {

                                    });
                            }, (error) => {
                                loader.dismiss();
                            });
                    }, (error) => {
                        loader.dismiss();
                    });
            });
        }
    }
    onRefreshClick(refresher) {
        this.refreshFlights(refresher);
    }

    toggle(searchBar) {
        this.visible = searchBar;//!this.visible;
    }

    onSearchCancel() {
        this.toggle(false);
    }

    onSearchInput(searchbar) {
        this.filteredFlight = this.flights.filter((fp: FlightInfo, idx: number) => {
            let count = fp.flightMembers.filter((fm: FlightMember) => {
                return fm.playerName.toLowerCase().indexOf(this.searchQuery.toLowerCase()) >= 0;
            }).length;
            return count > 0;
        });
    }

    onHomeClick() {
        this.nav.popToRoot();//this.nav.setRoot(PlayerHomePage);
    }

    private refreshFlights(refresher) {

        let loader = this.loadingCtl.create({
            content: 'Loading flights list, Please wait...'
        });
        if (loader)
            loader.present().then(() => {
                this.compService.getFlights(this.competition.competitionId, this.gameRound.roundNo)
                    .subscribe((flights: Array<FlightInfo>) => {
                        loader.dismiss().then(() => {
                            this.flights        = flights;
                            this.filteredFlight = this.flights;
                            this.searchQuery    = "";
                            this.onSearchCancel();
                        })

                    }, (error) => {

                    }, () => {
                        if (refresher) refresher.complete();

                        if (loader)
                            loader.dismiss();
                    });
            });

    }

    convStartTime(flightTime: string) {
        let teeTime = moment(flightTime, 'HH:mm:ss').format("HH:mm")
        // console.log("[Tee Time] flightTime ",flightTime)
        // console.log("[Tee Time] teeTime : ",teeTime)
        // return moment(teeTime).format("HH:mm")
        return teeTime
    }

}
