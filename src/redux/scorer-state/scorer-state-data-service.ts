import {Store} from '@ngrx/store';
import {AppState} from '../appstate';
import {Observable} from 'rxjs/Observable';
import {ScorerState} from './';
import {CompetitionInfo} from '../../data/competition-data';
import {Injectable} from '@angular/core';
/**
 * Created by ashok on 15/05/17.
 */
@Injectable()
export class ScorerStateDataService {
    constructor(private store: Store<AppState>){}

    scorerState(): Observable<ScorerState> {
        return this.store.select(appState=>appState.scorerState)
            .filter(Boolean);
    }
    activeCompetitions(): Observable<CompetitionInfo[]> {
        return this.store.select(appState=>appState.scorerState.competitions)
            .filter(Boolean);
    }

    currentError() : Observable<any> {
        return this.store.select(appState=>appState.scorerState)
            .map(scorerState=>{
                if(scorerState.error)
                    return {
                        error: scorerState.error,
                        exception: scorerState.exception
                    }
                    else return null;
            }).filter(Boolean);
    }

    getTeetimeBooking(): Observable<any> {
        return this.store.select((appState)=>{
            // if(appState.teetimeBooking) return appState.teetimeBooking.clubId
            console.log("scorer state data tee booking : ", appState)
            return appState.scorerState.teeBooking
        })
                .distinctUntilChanged()
                .filter(Boolean);
    }


}