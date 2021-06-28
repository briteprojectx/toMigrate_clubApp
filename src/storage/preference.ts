import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {MyGolfStorageService} from './mygolf-storage.service';
import {isPresent} from 'ionic-angular/util/util';
import {UserPreference} from '../data/user-preference';
import {Events} from 'ionic-angular/index';
import 'rxjs/add/observable/of';
;
/**
 * Created by Ashok on 06-04-2016.
 */

@Injectable()
export class Preference
{
    private userPreference: UserPreference;

    constructor(private sqlService: MyGolfStorageService, private events: Events) {
        console.log("Preference**********");
        this.userPreference = new UserPreference();
        this.sqlService.getPreference("UserPreference")
            .subscribe((data: any) => {
                this.userPreference = data;
                // this.events.publish(GolfEvents.UserPreferenceReady,this.userPreference)
            }, (error) => {
                //Leave the default user preference
            });
    }

    /**
     * Gets the preference value. The value is not returned directly.
     * But an Observable instance is returned
     * @param key The preference key
     * @returns {Observable<any>}
     */
    public getPref(key: string): Observable<any> {
        console.log("getPref key", key);
        console.log("getPref userPref", this.userPreference)
        return this.sqlService.getPreference(key);
    }

    /**
     * Sets the preference or clears the preference if the value isn't passed
     * @param key The preference key
     * @param value The value of the preference. If not passed, the preference is removed
     * @returns {any}
     */
    public setPref(key: string, value?: any): Observable<any> {
        if (isPresent(value))
            return this.sqlService.setPreference(key, value);
        else {
            this.sqlService.deletePreference(key);
            return Observable.of(key);
        }
    }

    /**
     * Gets the user preference object
     * @returns {UserPreference}
     */
    public getUserPreference(): UserPreference {
        return this.userPreference;
    }

    /**
     * Saves the user preference
     * @param userPreference
     */
    public saveUserPreference(userPreference: UserPreference) {
        this.userPreference = userPreference;
        this.sqlService.setPreference("UserPreference", this.userPreference);
    }

    // public clearUserPreference(key: string) {
    //     this.sqlService.deletePreference(key);
    // }
}
