import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
// import {PlainScorecard} from '../../data/scorecard';
import {MyGolfStorageService} from '../../storage/mygolf-storage.service';
import {PlainScoreCard} from '../../data/mygolf.data';
/**
 * This service class provides the storage facility for scorecards in the local database
 * Created by ashok on 23/04/17.
 */
@Injectable()
export class ScorecardStorageService{
    private static CompTableName: string = 'competition_scorecards';
    constructor(private storage: MyGolfStorageService){

    }

    /**
     * Saves the competition scorecard
     * @param scorecard The scorecard to save
     * @param scorerId The Id of the scoring player
     */
    public saveCompetitionScorecard(scorecard: PlainScoreCard, scorerId: number){
        if(scorecard.competition && scorecard.competitionId){
            let playerRec = scorecard.playerRoundScores.filter(prs=>{
                return prs.playerId === scorerId;
            }).pop();
            let obj = {
                competition: scorecard.competitionId,
                roundNumber: scorecard.roundNumber,
                flight: scorecard.flightNumber,
                scorerId: scorerId,
                scorerName: playerRec?playerRec.playerName:'',
                scorecard: scorecard
            };
            //get the corresponding player


            this.storage.getPreference(ScorecardStorageService.CompTableName)
                .subscribe((scorecards: Array<any>)=>{
                    if(scorecards && scorecards.length){
                        let curScorecard = scorecards.filter(sc=>{
                            return sc.competition === obj.competition &&
                                    sc.roundNumber === obj.roundNumber &&
                                    sc.flight === obj.flight &&
                                    sc.scorerId === obj.scorerId;
                        }).pop();
                        if(curScorecard){
                            curScorecard.scorerName = obj.scorerName;
                            curScorecard.scorecard = scorecard;
                        }
                        else scorecards.unshift(obj);
                    }
                    else {
                        console.log("No scorecards storage. Creating...");
                        scorecards = [obj];
                    }
                    this.storage.setPreference(ScorecardStorageService.CompTableName, scorecards);
                },(error)=>{
                    console.log("No scorecards storage. Creating..." + JSON.stringify(error));
                    this.storage.setPreference(ScorecardStorageService.CompTableName, [obj]);
                })
        }
    }

    /**
     * Returns all the scorecards for a given scorer.
     * @param scorerId Returns the
     */
    public listCompetitionScorecards(scorerId?: number): Observable<Array<any>>{
        return this.storage.getPreference(ScorecardStorageService.CompTableName)
            .map((scorecards: Array<any>)=>{
                if(scorerId){
                    scorecards = scorecards.filter(scorecard=>{
                        return scorecard.scorerId === scorerId;
                    });
                }
                return scorecards;
            });
    }
    public deleteAt(index: number): Observable<boolean> {
        return this.storage.getPreference(ScorecardStorageService.CompTableName)
            .map((scorecards: Array<any>)=>{
                if(scorecards && scorecards.length > index){
                    let newArr = scorecards.slice(0, index);
                    if(index+1 < scorecards.length)
                        newArr.push(...scorecards.slice(index+1));
                    return newArr;
                }
                else return [];
            }).map((scorecards: Array<any>)=>{
                return this.storage.setPreference(ScorecardStorageService.CompTableName, scorecards);
            }).map((result)=>{
                return true;
            })
    }
    /**
     * Deletes all the scorecards in the storage
     */
    public deleteAll(): Observable<boolean>{
        return this.storage.setPreference(ScorecardStorageService.CompTableName, [])
            .map(()=>{
                return true;
            });
    }
}