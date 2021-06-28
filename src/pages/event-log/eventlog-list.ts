import {Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {EventLogService} from '../../providers/eventlog-service/eventlog-service';
import * as moment from 'moment';
/**
 * Created by ashok on 23/04/17.
 */

@Component({
    selector: 'eventlog-list-page',
    templateUrl: 'eventlog-list.html'
})
export class EventLogListPage implements OnInit{

    events: Array<any>=[];
    expandStatus: any = {}
    constructor(private nav: NavController,
        private eventLogService: EventLogService){

    }
    ngOnInit(): void {
        this.refreshEvents(null);
    }

    refreshEvents(refresher){
        this.eventLogService.listEvents()
            .subscribe((events: Array<any>)=>{
                this.events = events;
                this.expandStatus = {}
                if(events)
                    events.forEach((value, index)=>{
                        this.expandStatus[index] = false;
                    })
            },(error)=>{

            },()=>{
                if(refresher) refresher.complete();
            })
    }
    delete(index:number){
        this.eventLogService.deleteEvent(index)
            .subscribe((result: boolean)=>{
                this.refreshEvents(null);
            });
    }
    expand(index: number){
        this.expandStatus[index] = true;
    }
    collapse(index: number){
        this.expandStatus[index] = false;
    }
    toggleExpand(index: number){
        if(this.expandStatus[index])
            this.collapse(index);
        else this.expand(index);
    }
    onDeleteAllClick(){
        this.eventLogService.clearAllEvents()
            .subscribe((result: boolean)=>{
                this.refreshEvents(null);
            });
    }
    displayEventTime(time){
        return moment(time).format("MMM DD, YYYY HH:mm:ss")
    }

}