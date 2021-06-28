import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../appstate';
import {Observable} from 'rxjs/Observable';
import {PlayerHomeData} from './player-home-data';
import {PlayerHomeInfo} from '../../data/player-data';
/**
 * Created by ashok on 11/05/17.
 */

@Injectable()
export class PlayerHomeDataService {

    constructor(private store: Store<AppState>){}

    public playerHomeData(): Observable<PlayerHomeData> {
        return this.store.select(appState=>appState.playerHomeData).filter(Boolean);
    }
    public playerHomeInfo(): Observable<PlayerHomeInfo> {
        return this.store.select(appState=>appState.playerHomeData.playerHome);
    }
    public competitionSelected(): Observable<any> { //was  nyumber here
        return this.store.select(appState=>appState.playerHomeData.competitionSelectedForScoring)
            .filter(Boolean);
    }
    public competitionSelectedForScoring(): Observable<any> {
        return this.store.select(appState=>appState.playerHomeData.selectedCompetition)
                   .filter(Boolean);
    }
    public playerName(): Observable<string> {
        return this.store.select(appState=>appState.playerHomeData.playerHome.playerName);
    }
    public playerPhoto(): Observable<string> {
        return this.store.select(appState=>{
            if(appState.playerHomeData && appState.playerHomeData.playerHome
                && appState.playerHomeData.playerHome.player){
                if(appState.playerHomeData.playerHome.player.thumbnail)
                    return appState.playerHomeData.playerHome.player.thumbnail;
                else if(appState.playerHomeData.playerHome.player.photoUrl)
                    return appState.playerHomeData.playerHome.player.photoUrl;
                else return '';
            }
            else return '';
        })
    }
}