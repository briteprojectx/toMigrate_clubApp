import {
  ActionSheetController,
  AlertController,
  Events,
  LoadingController,
  ModalController,
  NavController,
  NavParams,
  Platform,
  ToastController
} from 'ionic-angular';
import { isPresent } from 'ionic-angular/util/util';
import { Keyboard } from '@ionic-native/keyboard';
import { Component, Renderer2 } from '@angular/core';
//external libraries
import { MessageDisplayUtil } from '../../../message-display-utils';
//data
import {
  CompetitionCategory,
  CompetitionDetails,
  CompetitionInfo,
  CompetitionTeams,
  createLeaderboardDetails,
  Leaderboard,
  LeaderboardPlayer,
  Teams
} from '../../../data/competition-data';
import { SearchCriteria } from '../../../data/search-criteria';
import { PlainScorecard } from '../../../data/scorecard';
//providers/services
import { CompetitionService } from '../../../providers/competition-service/competition-service';
import { ScorecardService } from '../../../providers/scorecard-service/scorecard-service';
import { AuthenticationService } from '../../../authentication-service';
//pages
import { LeaderboardFiltersPage } from './competition-leaderboard-filter/competition-leaderboard-filter';
import { ScorecardDisplayPage } from '../../scorecard-display/scorecard-display';
import { adjustViewZIndex } from '../../../globals';
import { CompetitionLeaderboardTeamFilter } from './leaderboard-team-filter';
import { ConnectionService } from '../../../providers/connection-service/connection-service';
import { SessionInfo } from '../../../data/authentication-info';
import { SessionDataService } from '../../../redux/session/session-data-service';
import { SessionActions } from '../../../redux/session/session-actions';
/*
 Generated class for the Competition prizes page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  templateUrl: 'competition-leaderboard.html',
  selector: 'competition-leaderboard-page'
})
export class LeaderboardPage {
  searchCriteria: SearchCriteria;
  competition: CompetitionInfo;
  leaderboards: Leaderboard;
  filteredPlayers: Array<LeaderboardPlayer> = new Array<LeaderboardPlayer>();
  //leaderboardPlayers: Array<LeaderboardPlayer> =  new Array<LeaderboardPlayer>();
  leaderboardPlayers: Array<LeaderboardPlayer> = new Array<LeaderboardPlayer>();
  roundNo: number = 1;
  searchQuery: string = '';
  visible: boolean;

  categories: Array<CompetitionCategory> = new Array<CompetitionCategory>();
  selectedCategoryName: string = '';
  scoringFormat: string;
  details: CompetitionDetails;
  selectedOrderBy: number;
  category: Array<CompetitionCategory> = new Array<CompetitionCategory>();
  errorObj: Leaderboard;

  showSortBy: string = "Gross";
  showCategoryName: string;
  showRoundNo: string = "Overall";

  selectedSortBy: number = 2;
  selectedCategoryId: string = '';
  selectedRoundNo: number;

  scorecard: PlainScorecard;

  compTeams: CompetitionTeams;

  private needRefresh: boolean = true;

  sortToggle: boolean = true;

  refreshedAttempt: boolean = false;

  hideHomeButton: boolean = false;
  showLogout: boolean = false;
  doneRefresh: boolean = false;
  errorMsg: string = "";
  session: SessionInfo;

  showTeam: boolean = false;
  showEventMode: string = "";
  constructor(public nav: NavController,
    private renderer: Renderer2,
    private keyboard: Keyboard,
    private connService: ConnectionService,
    public navParams: NavParams,
    private modalCtl: ModalController,
    private loadingCtl: LoadingController,
    private toastCtl: ToastController,
    private actionSheetCtl: ActionSheetController,
    private auth: AuthenticationService,
    private compService: CompetitionService,
    private events: Events,
    private platform: Platform,
    private sessionService: SessionDataService,
    private sessionActions: SessionActions,
    private scorecardService: ScorecardService,
    private alertCtrl: AlertController) {
    // super();

    this.nav = nav;
    this.searchCriteria = compService.getSearch();
    this.showCategoryName = "All Categories";
    this.hideHomeButton = navParams.get("hideHomeButton");
    this.showLogout = navParams.get("showLogout");
    if (!isPresent(this.searchCriteria.competitionLeaderboardSortBy))
      this.searchCriteria.competitionLeaderboardSortBy = 2;
    this.selectedOrderBy = 2;//this.searchCriteria.competitionLeaderboardSortBy;
    this.selectedSortBy = this.selectedOrderBy;

    if (!isPresent(this.searchCriteria.competitionLeaderboardGroupBy)) {
      this.searchCriteria.competitionLeaderboardGroupBy = '';
    }
    this.searchQuery = '';
    this.visible = false;


    if (navParams.get("leaderboards")) {

      this.competition = navParams.get("competition");
      this.scoringFormat = this.competition.scoringFormat;
      this.leaderboards = navParams.get("leaderboards");
      this.leaderboardPlayers = navParams.get("leaderboardPlayers");
      this.filteredPlayers = this.leaderboardPlayers;
      this.roundNo = navParams.get("roundNo");
      this.selectedRoundNo = this.roundNo;
      this.showRoundNo = "Round " + String(this.roundNo);

      this.categories = navParams.get("categories");
      console.log("from competition details");
      this.compService.setLeaderboardFilter(
        this.selectedOrderBy,
        this.roundNo
      );
      if (this.competition.teamEvent) {
        // this.showCategoryName = "All Teams";
        // this.compTeams        = navParams.get("teams");
        this.showTeam = navParams.get("showTeam");
        if(this.showTeam)
          this.showEventMode = "View Individual";
          else
          this.showEventMode = "View Teams";
      }
      // this.refreshLeaderboard(null);
    } else {
      this.competition = navParams.get("competition");
      this.roundNo = navParams.get("roundNo");
      this.selectedRoundNo = this.roundNo;
      this.showRoundNo = "Round " + String(this.roundNo);

      this.scoringFormat = this.competition.scoringFormat;
      // this.refreshCompetitionDetails();
      console.log("from scoring");

    }
    this.leaderboards = createLeaderboardDetails();
    this.errorObj = createLeaderboardDetails();
  }

  ionViewDidLoad() {


    if (this.needRefresh) {
      if (!this.navParams.get("leaderboards"))
        this._setLeaderboardFilter(); // this.refreshLeaderboard(null);
      else {
        this._setLeaderboardFilter(true);
        this.refreshCompetitionDetails();

      }
    }

  }

  toggleTeamEvent() {
    if(this.showTeam){
      this.showTeam = false;
      this.showEventMode = 'View Teams';
    } else if (!this.showTeam) {
      this.showTeam = true;
      this.showEventMode = 'View Individuals';
    }
    this._setLeaderboardFilter();
  }
  async deriveSession() {
    this.session = await this.sessionService.getSession().toPromise();
  }
  toggleSearch() {
    this.visible = !this.visible; //searchBar;//
  }

  onSearchCancel() {
    this.toggleSearch();
    if (this.platform.is('ios') && this.platform.is('cordova'))
      this.keyboard.close();
  }

  onOptionClick() {
    console.log(this.categories, this.competition.totalRounds, this.roundNo, this.competition.competitionId, this.scoringFormat);
    let option = this.modalCtl.create(LeaderboardFiltersPage, {
      categories: this.categories,
      totalRounds: this.competition.totalRounds,
      currentRound: this.roundNo,
      compId: this.competition.competitionId,
      scoringFormat: this.scoringFormat
    });
    // option.onDidDismiss((roundNumber: number, category: Array<CompetitionCategory>) => {
    option.onDidDismiss((data: any) => {
      if (data.roundNumber >= 0) {
        this.roundNo = data.roundNumber;
        this.onRefreshClick(null);
      }
      this.category = data.selectedCategory;//category;
      console.log("Selected Category:", this.category);
    });
    option.present()

  }
  logout() {
    this.sessionActions.logout();
  }
  public onHomeClick() {
    this.nav.popToRoot();//this.nav.setRoot(PlayerHomePage);
    console.log("onHomeClick")
  }

  onRefreshClick(refresher) {
    this.refreshLeaderboard(refresher);
  }

  onSearchInput(searchbar) {
    if (this.searchQuery && this.searchQuery.length > 0)
      this.filteredPlayers = this.leaderboardPlayers.filter((p: LeaderboardPlayer) => {
        return (p.lastName.toLowerCase() + " " + p.firstName.toLowerCase()).indexOf(this.searchQuery.toLowerCase()) >= 0;
      });
    else this.filteredPlayers = this.leaderboardPlayers;

  }

  private refreshLeaderboard(refresher) {
    console.log("onRefreshClick() - START");


    let loader = this.loadingCtl.create({
      content: 'Refreshing Leaderboard. Please wait...'
    });
    this.leaderboards = createLeaderboardDetails();
    this.errorObj = createLeaderboardDetails();
    this.refreshedAttempt = false;

    loader.present().then(() => {
      this.compService.getLeaderboard(this.competition.competitionId)
        .subscribe((leaderboards: Leaderboard) => {
          loader.dismiss().then(() => {
            this.refreshedAttempt = true;

            this.leaderboards = leaderboards;
            this.leaderboardPlayers = this.leaderboards.players;
            this.filteredPlayers = this.leaderboardPlayers;
            console.log("Success:", this.leaderboards);
            this.doneRefresh = true;

          })

        }, (error) => {
          loader.dismiss();
          this.doneRefresh = false;
          this.errorObj = error;
          // let msg = "";
          console.log("Error obj:", this.errorObj);
          if (refresher) refresher.complete();
          if (!this.connService.isConnected()) {
            this.errorMsg = "Loading leaderboard failed because your internet connection is down";
          }
          else
            this.errorMsg = MessageDisplayUtil.getErrorMessage(error,
              "Loading leaderboard timed out. Please refresh");

          MessageDisplayUtil.showErrorToast(this.errorMsg, this.platform, this.toastCtl, 5000, "bottom");
        }, () => {
          if (refresher) refresher.complete();

          if (this.platform.is('ios') && this.platform.is('cordova'))
            this.keyboard.close();
        });
    })

  }

  private refreshCompetitionDetails() {
    let loader = this.loadingCtl.create({
      content: 'Please wait...'
    });

    this.refreshedAttempt = false;
    loader.present().then(() => {
      this.compService.getDetails(this.competition.competitionId)
        .subscribe((details: CompetitionDetails) => {
          this.details = details;
          this.categories = this.details.categories;
          this.compService.getLeaderboard(this.competition.competitionId)
            .subscribe((leaderboards: Leaderboard) => {
              loader.dismiss().then(() => {
                this.refreshedAttempt = true;
                this.leaderboards = leaderboards;
                this.leaderboardPlayers = this.leaderboards.players;
                this.filteredPlayers = this.leaderboardPlayers;
                console.log("Success:", this.leaderboards);

              })

            }, (error) => {
              loader.dismiss();
              this.errorObj = error;
            }, () => {
              if (this.platform.is('ios') && this.platform.is('cordova'))
                this.keyboard.close();
              // if (this.leaderboards.totalInPage == 0) console.log("xdo sini hah");
              // console.log("complete:", this.leaderboards)
              // console.log("complete error:", this.errorObj)
            });
        }, (error) => {
          loader.dismiss().then(() => {
            MessageDisplayUtil.showErrorToast("Error getting competition details", this.platform,
              this.toastCtl, 3000, "bottom");
          });

        }, () => {

        });
    }, (error) => {
      console.log("Error Object: " + JSON.stringify(error));
    });

  }

  private _setLeaderboardFilter(firstRefresh = false) {
    let selectedRoundNo;
    console.log("Show Team:" + this.showTeam);
    if (this.selectedRoundNo == 0)
      selectedRoundNo = '';
    else if (this.competition.totalRounds == 1)
      selectedRoundNo = '';
    else selectedRoundNo = this.selectedRoundNo;
    this.compService.setLeaderboardFilter(
      this.selectedSortBy,
      selectedRoundNo,
      this.selectedCategoryId,
      this.showTeam
      // this.competition.teamEvent
    );
    if (!firstRefresh)
      this.refreshLeaderboard(null);
    // this.refreshCompetitionDetails();
  }

  public openCategory() {
    let actionSheet = this.actionSheetCtl.create({
      buttons: [

        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            actionSheet.dismiss();
            return false;
          }
        }
      ]
    });
    let tempCategoryName = "";
    if (this.categories.length > 0)
      tempCategoryName = "All Categories";
    else tempCategoryName = "No Category";
    actionSheet.addButton(
      {
        text: tempCategoryName,
        role: 'destructive',
        icon: 'filter',
        handler: () => {
          actionSheet.dismiss()
            .then(() => {
              this.selectedCategoryId = "";
              this._setLeaderboardFilter();
              this.showCategoryName = tempCategoryName

            });
          return false;
        }
      });

    this.categories.forEach((c: CompetitionCategory) => {
      // console.log(c)

      if (c.forGrouping) {
        actionSheet.addButton(
          {
            text: c.categoryName + " (" + c.fromHandicap +" - "+c.toHandicap +")",
            role: 'destructive',
            icon: 'filter',
            handler: () => {
              actionSheet.dismiss()
                .then(() => {

                  console.log(c)
                  this.showCategoryName = c.categoryName + " (" + c.fromHandicap +" - "+c.toHandicap +")";
                  this.selectedCategoryId = String(c.categoryId);
                  this._setLeaderboardFilter();


                });
              return false;
            }
          });
      }
    });
    actionSheet.present();

  }

  public openSortBy() {
    // this.showSortBy = "";
    let actionSheet = this.actionSheetCtl.create({
      buttons: [
        {
          text: 'Gross',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'exit' : null,
          handler: () => {
            actionSheet.dismiss()
              .then(() => {
                this.toggleSortBy("gross");
              });
            return false;

          }
        }, {
          text: 'Net',
          icon: !this.platform.is('ios') ? 'cog' : null,
          handler: () => {
            actionSheet.dismiss()
              .then(() => {
                this.toggleSortBy("net");
              });

            return false;
          }
        },
        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            actionSheet.dismiss();
            return false;
          }
        }
      ]
    });

    actionSheet.present();
  }

  public openRound() {
    // this.showRoundNo = "";
    let actionSheet = this.actionSheetCtl.create({
      buttons: [

        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            actionSheet.dismiss();
            return false;
          }
        }
      ]
    });
    let roundNo = this.competition.totalRounds;

    actionSheet.addButton(
      {
        text: 'Overall',
        role: 'destructive',
        icon: !this.platform.is('ios') ? 'exit' : null,
        handler: () => {
          actionSheet.dismiss()
            .then(() => {
              this.showRoundNo = "Overall";
              this.selectedRoundNo = 0;
              this.roundNo = 0;
              this._setLeaderboardFilter();


            });
          return false;

        }
      });
    for (let i = 1; i <= roundNo; i++) {
      actionSheet.addButton(
        {
          text: 'Round ' + i,
          role: 'destructive',
          icon: 'filter',
          handler: () => {
            actionSheet.dismiss()
              .then(() => {

                this.showRoundNo = "Round " + i;
                this.selectedRoundNo = i;
                this.roundNo = i;
                this._setLeaderboardFilter();


              });
            return false;

            //  this.goScorecard();
          }
        });
    }

    actionSheet.present();
  }

  getSortBy(sortBy: string) { // defining class

    if (sortBy == 'gross' && this.searchCriteria.competitionLeaderboardSortBy == 2)
      return "sortedBy";
    if (sortBy == 'net' && (this.searchCriteria.competitionLeaderboardSortBy == 3 || this.searchCriteria.competitionLeaderboardSortBy == 4))
      return "sortedBy";

  }

  toggleSortBy(sortBy: string) {
    if (this.showSortBy.toLowerCase() == sortBy) return false;

    if (sortBy == 'gross') {
      this.showSortBy = "Gross"
      this.selectedSortBy = 2;
      this._setLeaderboardFilter();
      this.sortToggle = true;

    } else if (sortBy == 'net') {
      if (this.scoringFormat != "Stableford" && this.scoringFormat != "Peoria")
        this.selectedSortBy = 3;
      if (this.scoringFormat == "Stableford" || this.scoringFormat == "Peoria")
        this.selectedSortBy = 4;
      this.showSortBy = "Net"
      this.sortToggle = false;

      this._setLeaderboardFilter();

    }

  }

  getPlayerScorecard(playerId: string) {
    let loader = this.loadingCtl.create({
      dismissOnPageChange: true,
      showBackdrop: false,
      cssClass: "nobg"
    });
    loader.present().then(() => {
      this.scorecardService.getCompetitionScorecard(this.competition.competitionId, this.selectedRoundNo, Number(playerId), true)
        .subscribe((scorecard: PlainScorecard) => {
          loader.dismiss().then(() => {
            let subTitle = "No scorecard to display";
            if (scorecard) {
              this.nav.push(ScorecardDisplayPage, {
                scorecard: scorecard,
                editing: true
              });
            } else MessageDisplayUtil.displayInfoAlert(this.alertCtrl, "", subTitle, "OK");
            console.log(scorecard);

          });
        }, (error) => {
          loader.dismiss().then(() => {
            let subTitle = "No scorecard to display";
            MessageDisplayUtil.displayInfoAlert(this.alertCtrl, "", subTitle, "OK");
          });

        }, () => {

        });
    });

  }

  public openTeams() {
    let actionSheet = this.actionSheetCtl.create({
      buttons: [

        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            actionSheet.dismiss();
            return false;
          }
        }
      ]
    });
    let tempTeamName = "";
    if (this.compTeams.totalItems > 0)
      tempTeamName = "All Teams";
    else tempTeamName = "No Team";
    actionSheet.addButton(
      {
        text: tempTeamName,
        role: 'destructive',
        icon: 'filter',
        handler: () => {
          actionSheet.dismiss()
            .then(() => {
              this.selectedCategoryId = "";
              this._setLeaderboardFilter();
              return false;
            });

          //  this.goScorecard();
        }
      });

    this.compTeams.competitionTeams.forEach((c: Teams) => {
      // console.log(c)

      // if (c.forGrouping) {
      actionSheet.addButton(
        {
          text: c.teamName,
          role: 'destructive',
          icon: 'filter',
          handler: () => {
            actionSheet.dismiss()
              .then(() => {

                console.log(c)
                this.showCategoryName = c.teamName;
                this.selectedCategoryId = String(c.teamId);
                this._setLeaderboardFilter();

                return false;
              });

            //  this.goScorecard();
          }
        });
      // }
    });
    actionSheet.present();

  }

  goTeamFilter() {
    let modal = this.modalCtl.create(CompetitionLeaderboardTeamFilter, {
      compTeams: this.compTeams
    });
    modal.onDidDismiss((data: any) => {
      if (!data) return;
      if (data.all && this.selectedCategoryId !== "") {
        this.selectedCategoryId = "";
        this.showCategoryName = "All Teams";
        this._setLeaderboardFilter();
      } else if (data.team && this.selectedCategoryId !== String(data.team.teamId)) {
        this.showCategoryName = data.team.teamName;
        this.selectedCategoryId = String(data.team.teamId);
        this._setLeaderboardFilter();
      }

    });

    modal.present();

  }
  checkScoringCategory() {
    let hasScoringCategory: boolean = false;
    this.categories.forEach((c: CompetitionCategory) => {
      if (c.forGrouping) {
        // console.log("check:",c);
        hasScoringCategory = true;
        // return c.forGrouping
      }

    })
    return hasScoringCategory;
  }

}
