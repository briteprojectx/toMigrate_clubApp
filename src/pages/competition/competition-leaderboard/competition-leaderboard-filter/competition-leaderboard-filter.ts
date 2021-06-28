import {NavController, NavParams, ViewController} from 'ionic-angular';
import {CompetitionService} from '../../../../providers/competition-service/competition-service';
import {SearchCriteria} from '../../../../data/search-criteria';
import {isPresent} from 'ionic-angular/util/util';
import * as moment from 'moment';
import {CompetitionCategory} from '../../../../data/competition-data';
import {Component} from '@angular/core';
@Component({
    templateUrl: 'competition-leaderboard-filter.html'
})
export class LeaderboardFiltersPage
{
    /*static get parameters() {
     return [[ViewController],[NavParams]];
     }*/
    searchCriteria: SearchCriteria;
    filterType: string;
    startDate: Date;
    endDate: Date;
    holesPlayed: number;
    searchType: string;
    selectedCategoryId: string;
    totalRounds: number;
    selectedRoundNo: number;
    currentRound: number;
    selectedOrderBy: number                = 2;
    compId: number;
    categories: Array<CompetitionCategory> = new Array<CompetitionCategory>();
    roundList: Array<number>               = new Array<number>();
    scoringFormat: string;
    selectedCategory: CompetitionCategory;// = new Array<CompetitionCategory>();

    constructor(private viewCtrl: ViewController,
        private navParams: NavParams,
        private nav: NavController,
        private compService: CompetitionService) {

        this.searchCriteria = compService.getSearch();
        if (!isPresent(this.searchCriteria.periodType))
            this.searchCriteria.periodType = "NONE";
        if (!isPresent(this.searchCriteria.competitionLeaderboardGroupBy))
            this.searchCriteria.competitionLeaderboardGroupBy = '0';
        if (!isPresent(this.searchCriteria.competitionLeaderboardSortBy))
            this.searchCriteria.competitionLeaderboardSortBy = 2;

        this.filterType      = 'Latest10';
        this.holesPlayed     = 18;
        this.selectedOrderBy = this.searchCriteria.competitionLeaderboardSortBy;
        console.log("sort by:" + this.selectedOrderBy + "||" + this.searchCriteria.competitionLeaderboardSortBy)
        this.selectedCategoryId = this.searchCriteria.competitionLeaderboardGroupBy;
        this.scoringFormat      = navParams.get("scoringFormat");
        if (this.searchType == 'Latest10') {
            this.endDate   = moment().toDate();
            this.startDate = moment().add(-1, "months").toDate();
        }

        this.categories      = navParams.get("categories");
        this.totalRounds     = navParams.get("totalRounds");
        this.currentRound    = navParams.get("currentRound");
        this.compId          = navParams.get("compId");
        this.selectedRoundNo = this.currentRound;

        for (let i = 0; i <= this.totalRounds; i++) {
            this.roundList[i] = i;// + 1;
        }

    }

    close() {

        this.selectedCategory = {
            sequence    : 0,
            categoryId  : 0,
            categoryName: "",
            gender      : "",
            forGrouping : false,
            fromHandicap: 0,
            toHandicap  : 0

        }
        this.viewCtrl.dismiss({
          roundNumber: -1,
          selectedCategory: this.selectedCategory
        });
        // this.viewCtrl.dismiss(-1, this.selectedCategory);
        // this.nav.pop();
    }

    onApplyClick() {
        let selectedRoundNo;
        if (this.selectedRoundNo == 0)
            selectedRoundNo = '';
        else selectedRoundNo = this.selectedRoundNo;

        this.compService.setLeaderboardFilter(
            this.selectedOrderBy,
            selectedRoundNo,
            this.selectedCategoryId
        );
        if (this.selectedCategoryId == "") {
            this.selectedCategory = {
                sequence    : 0,
                categoryId  : 0,
                categoryName: "",
                gender      : "",
                forGrouping : false,
                fromHandicap: 0,
                toHandicap  : 0

            }
        } else {
            this.selectedCategory = this.categories.filter((lc: CompetitionCategory, idx: number) => {
                return lc.categoryId == +this.selectedCategoryId;
            }).pop();

        }
        this.viewCtrl.dismiss({
          roundNumber:  this.selectedRoundNo,
          selectedCategory: this.selectedCategory
        })
        // this.viewCtrl.dismiss(this.selectedRoundNo, this.selectedCategory);
    }

    isScoringCategory(category: CompetitionCategory) {
        if (category.forGrouping)
            return true;
        else return false;
    }
}
