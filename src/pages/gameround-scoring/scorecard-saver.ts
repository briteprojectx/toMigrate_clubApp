// import {PlainScorecard} from '../../data/scorecard';
import {PlainScoreCard} from '../../data/mygolf.data';
import {ScorecardService} from '../../providers/scorecard-service/scorecard-service';
import async from 'async';
/**
 * An utility helper class to serialize and sequentialize the scorecard save as they are called
 * Created by ashok on 01/04/17.
 */

export class ScorecardSaver {
    private counter: number = 0;
    private scorecardService: ScorecardService;
            saverQueue: AsyncQueue<any>;

    constructor(scorecardService: ScorecardService) {

    }

    public init(scorecardService: ScorecardService) {
        this.scorecardService = scorecardService;
        this.saverQueue       = async.queue((scorecardDetail: any, callback: ErrorCallback<any>) => {
            console.log("Saving scorecard. Counter = " + scorecardDetail.counter);
            scorecardService.saveScorecard(scorecardDetail.scorecard, false)
                            .subscribe((scorecard: PlainScoreCard) => {
                                callback();
                            }, (error) => {
                                callback(error);
                            });

        }, 1);
    }

    public saveScorecard(scorecard: PlainScoreCard,
        onError?: ErrorCallback<any>) {
        //Kill any pending task as this would be latest scorecard to save
        if (this.saverQueue.length()) {
            console.log("There are " + this.saverQueue.length() + " pending. Removing them");
            this.saverQueue.kill();
        }
        // scorecard.dirty = false;
        this.counter    = this.counter + 1;
        this.saverQueue.push({
            scorecard: scorecard,
            counter  : this.counter
        }, onError);
    }

    /**
     * Kill all pending saves
     */
    public  killAll() {
        this.saverQueue.kill();
    }
}