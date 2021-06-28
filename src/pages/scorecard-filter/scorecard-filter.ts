import {Events, NavController, Platform, ViewController} from 'ionic-angular';
import {Component} from '@angular/core';
import {isPresent} from 'ionic-angular/util/util';
import {DatePicker} from '@ionic-native/date-picker';
import * as moment from 'moment';
import {SearchCriteria} from '../../data/search-criteria';
import {ScorecardService} from '../../providers/scorecard-service/scorecard-service';
import {Country} from '../../data/country-location';
import {PlayerService} from '../../providers/player-service/player-service';
@Component({
    templateUrl: 'scorecard-filter.html'
})
export class ScorecardFilterPage
{
    searchCriteria: SearchCriteria;
    scorecardType: string;
    startDate: Date;
    endDate: Date;
    isoStartDate: string;
    isoEndDate: string;
    countryList: Array<Country>;

    constructor(public platform: Platform,
        private datePicker: DatePicker,
        public nav: NavController,
        private viewCtl: ViewController,
        private scorecardService: ScorecardService,
        private events: Events,
        private playerService: PlayerService) {
        this.searchCriteria = scorecardService.getSearchCriteria();

        this.scorecardType = scorecardService.getScorecardType();

        if (!isPresent(this.searchCriteria.periodType))
            this.searchCriteria.periodType = "NONE";
        this.endDate      = moment().toDate();
        this.startDate    = moment().add(-1, "months").toDate();
        this.isoEndDate   = moment().toISOString();
        this.isoStartDate = moment().add(-1, "months").toISOString();

    }

    ionViewDidLoad() {
        this.getCountry();
    }

    cancel() {
        this.viewCtl.dismiss(false);
    }

    onApplyClick() {
        this.scorecardService.setSearchCriteria(this.searchCriteria,
            this.scorecardType);
        if (this.searchCriteria.periodType === "CUSTOM") {
            if (this.isCordova()) {
                this.scorecardService.setFilterStartDate(this.startDate);
                this.scorecardService.setFilterEndDate(this.endDate);

            } else {
                console.log("Start date:", moment(this.isoStartDate).isValid());
                console.log("End date:", moment(this.isoEndDate).isValid());
                let parseStartDate = moment(this.isoStartDate, "YYYY-MM-DD").toDate();
                let parseEndDate   = moment(this.isoEndDate, "YYYY-MM-DD").toDate();

                this.scorecardService.setFilterStartDate(parseStartDate);
                this.scorecardService.setFilterEndDate(parseEndDate);

            }

        }
        else {
            this.scorecardService.setFilterStartDate(null);
            this.scorecardService.setFilterEndDate(null);
        }

        this.events.publish("ScorecardSearchFilter");
        // this.nav.pop();
        let data: any
        this.viewCtl.dismiss(data = {
            apply: true,
            searchCriteria: this.searchCriteria
        });
    }

    isCordova() {
        return this.platform.is("cordova");
    }

    startDateDisplay() {
        return moment(this.startDate).format("MMM DD, YYYY");
    }

    endDateDisplay() {
        return moment(this.endDate).format("MMM DD, YYYY");
    }

    onStartDateChange(event) {
        this.startDate = moment(event.target.value, "YYYY-MM-DD").toDate();
    }

    onEndDateChange(event) {
        this.endDate = moment(event.target.value, "YYYY-MM-DD").toDate();
    }

    onStartDateClick() {
        this.datePicker.show({
            date: this.startDate,
            mode: "date"
        }).then((date: Date) => {
            this.startDate = date;
        })
    }

    onEndDateClick() {
        this.datePicker.show({
            date: this.endDate,
            mode: "date"
        }).then((date: Date) => {
            this.endDate = date;
        });
    }

    maxPeriodLength(): number {
        if (this.searchCriteria.periodType) {
            switch (this.searchCriteria.periodType) {
                case "MONTH":
                    return 60;
                case "DAY":
                    return 500;
                case "WEEK":
                    return 52;
                case "YEAR":
                    return 5;
            }
        }
        return 0;
    }

    onPeriodTypeChange(event) {
        if (this.searchCriteria.periodType) {
            let maxValue = this.maxPeriodLength();
            if (!this.searchCriteria.periodLength || this.searchCriteria.periodLength > maxValue) {
                switch (this.searchCriteria.periodType) {
                    case "MONTH":
                        this.searchCriteria.periodLength = 1;
                        break;
                    case "DAY":
                        this.searchCriteria.periodLength = 30;
                        break;
                    case "WEEK":
                        this.searchCriteria.periodLength = 4;
                        break;
                    case "YEAR":
                        this.searchCriteria.periodLength = 1;
                        break;
                    default:
                        this.searchCriteria.periodLength = 0;
                }
            }

        }
    }

    getCountry() {
        this.playerService.getCountryList()
                .subscribe((data: Array<Country>) => {
                            // console.log("Country Sign Up : ",data)
                            this.countryList = data;
                            console.log("Country List Comp Filter : ", this.countryList)
        });
    }
}
