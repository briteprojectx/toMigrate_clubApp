import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {MyGolfStorageService} from '../../storage/mygolf-storage.service';
/**
 * Created by ashok on 22/04/17.
 */

@Injectable()
export class EventLogService{
    constructor(private mygolfStorage: MyGolfStorageService){
    }
    public writeEvent(category: string,
            title: string,
            message: string,
            eventType: string = 'info',
            extra?: string){
        let eventLog = {
            category: category,
            type: eventType,
            time: Date.now(),
            title: title,
            message: message,
            extra: extra
        };
        this.mygolfStorage.getPreference("event_logs")
            .subscribe((value: Array<any>)=>{
                if(value) value.unshift(eventLog);
                else{
                    value = [eventLog];
                }
                this.mygolfStorage.setPreference("event_logs", value);
            },(error)=>{
                this.mygolfStorage.setPreference("event_logs", [eventLog]);
            });
    }
    public listEvents(): Observable<Array<any>>{
        return this.mygolfStorage.getPreference("event_logs")
            .map((events: Array<any>)=>{
                if(events){
                    events.forEach(event=>{
                       event.time = new Date(event.time);
                    });
                }
                return events;
            });
    }
    public clearAllEvents(): Observable<boolean> {
        return this.mygolfStorage.setPreference("event_logs", [])
            .map(()=>{
                return true;
            });
    }
    public deleteEvent(index: number): Observable<boolean> {
        return this.mygolfStorage.getPreference("event_logs")
            .map((value: Array<any>)=>{
                if(value && value.length > index){
                    let newLogs = value.slice(0, index);
                    if(index+1 < value.length)
                        newLogs.push(...value.slice(index+1));
                    this.mygolfStorage.setPreference("event_logs", newLogs);
                    return true;
                }
                else return true;

            });

    }
}