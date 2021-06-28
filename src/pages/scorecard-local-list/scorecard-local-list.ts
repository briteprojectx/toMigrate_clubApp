import {Component, OnInit} from '@angular/core';
import {ScorecardStorageService} from '../../providers/scorecard-service/scorecard-storage-service';
import {PlainScorecard} from '../../data/scorecard';
import {AlertController, NavController} from 'ionic-angular';
import {ScorecardDisplayPage} from '../scorecard-display/scorecard-display';
/**
 * Created by ashok on 23/04/17.
 */
@Component({
    selector: 'scorecard-local-list',
    templateUrl: 'scorecard-local-list.html'
})
export class ScorecardLocalListPage implements OnInit {

    searchQuery: string = '';
    scorecards: PlainScorecard [] = [];
    refreshAttempted: boolean = false;
    constructor(private scorecardStorage: ScorecardStorageService,
        private alertCtl: AlertController,
        private nav: NavController){

    }
    ngOnInit(){
        this.refreshScorecards(null);
    }
    onSearchInput(){

    }
    onScorecardClick(scorecard: PlainScorecard){
        this.nav.push(ScorecardDisplayPage, {
            scorecard: scorecard,
            editing  : true
        });
    }
    onDeleteAtIndex(event, index: number){
        let alert = this.alertCtl.create({
            message: "Do you want delete this scorecard?",
            title: "Delete Scorecard",
            buttons:[{
                text: 'Yes',
                handler: ()=>{
                    alert.dismiss().then(()=>{
                        this.deleteAtIndex(index);
                    });
                    return false;
                }
            },{
                text: 'No',
                handler: ()=>{
                    alert.dismiss();
                    return false;
                }
            }]
        });
        event.stopPropagation();
        alert.present();
    }
    deleteAtIndex(index: number){
        this.scorecardStorage.deleteAt(index)
            .subscribe((result)=>{
                setTimeout(()=>{
                    this.refreshScorecards(null);
                }, 500);
            });

    }

    onDeleteAllClick(){
        let alert = this.alertCtl.create({
            message: "Do you want delete all scorecards from local storage?",
            title: "Delete All Scorecards",
            buttons:[{
                text: 'Yes',
                handler: ()=>{
                    alert.dismiss().then(()=>{
                        this.deleteAll();
                    });
                    return false;
                }
            },{
                text: 'No',
                handler: ()=>{
                    alert.dismiss();
                    return false;
                }
            }]
        });
        alert.present();
    }
    deleteAll(){
        this.scorecardStorage.deleteAll()
            .subscribe((result)=>{
                this.refreshScorecards(null);
            });
    }
    refreshScorecards(refresher){
        this.scorecardStorage.listCompetitionScorecards()
            .subscribe((scorecards: PlainScorecard[])=>{
                this.scorecards = scorecards;
            },(error)=>{

            },()=>{
                if(refresher) refresher.complete();
            });
    }
}