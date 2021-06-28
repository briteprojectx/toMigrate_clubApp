import {Platform, NavController, Events} from "ionic-angular";
import {PlayerPerformanceService} from "../../providers/playerPerformance-service/playerPerformance-service";
import {Component} from "@angular/core";

@Component({
    templateUrl: 'hole-analysis-filter.html'
})
export class HoleAnalysisFilterPage
{

    constructor(public platform: Platform,
        public nav: NavController,
        private events: Events,
        private perfService: PlayerPerformanceService) {
    }

    public event = {
        month: '1990-02-19',
    }

    onApplyClick() {
        this.nav.pop();
    }

}
