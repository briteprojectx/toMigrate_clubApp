import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../appstate';
import {Observable} from 'rxjs/Observable';
import {CurrentScorecard, ScorecardType} from './current-scorecard';
// import {PlainScorecard} from '../../data/scorecard';
import {PlainScoreCard} from '../../data/mygolf.data';
/**
 * Created by ashok on 11/05/17.
 */

@Injectable()
export class CurrentScorecardDataService {
    constructor(private store: Store<AppState>){}

    /**
     * Gets the observable on CurrentScorecard in the store
     * @returns {Observable<T>}
     */
    public getCurrentScorecard(): Observable<CurrentScorecard> {
        return this.store
                   .select(appState=>appState.currentScorecard)
            .distinctUntilChanged()
            .filter(Boolean);
    }

    public getTeetimeBooking(): Observable<any> {
        return this.store
                    .select(appState=>appState.teetimeBooking)
                .distinctUntilChanged()
                .filter(Boolean);
    }

    public currentScorecardType(): Observable<ScorecardType> {
        return this.store
                   .select(appState=>appState.currentScorecard.scorecardType)
                   .distinctUntilChanged()
                   .filter(Boolean);
    }
    public scorecard(): Observable<PlainScoreCard> {
        return this.store
                   .select(appState=>appState.currentScorecard.scorecard)
                   .distinctUntilChanged()
                   .filter(Boolean);
    }
    public clubName(): Observable<string> {
        return this.scorecard()
            .map(scorecard=>scorecard.clubName);
    }
    public noScoring(): Observable<boolean> {
        return this.store
            .select(appState=>appState.currentScorecard.scorecardType)
            .distinctUntilChanged()
            .map((scorecardType: ScorecardType)=>scorecardType === ScorecardType.None);
    }
    public normalGameScoring(): Observable<boolean> {
        return this.store
                   .select(appState=>appState.currentScorecard.scorecardType)
                   .distinctUntilChanged()
                   .map((scorecardType: ScorecardType)=>scorecardType === ScorecardType.NormalGame);
    }
    public competitionScoring(): Observable<boolean> {
        return this.store
                   .select(appState=>appState.currentScorecard.scorecardType)
                   .distinctUntilChanged()
                   .map((scorecardType: ScorecardType)=>scorecardType === ScorecardType.Competition);
    }
}