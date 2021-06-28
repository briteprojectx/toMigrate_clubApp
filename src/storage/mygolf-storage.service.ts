import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Platform} from 'ionic-angular/index';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
/**
 *
 * Created by Ashok on 09-05-2016.
 */
@Injectable()
export class MyGolfStorageService
{
    private static PreferenceTable: string = "preference";

    constructor(private platform: Platform,
        private browserStorage: Storage) {
        this.browserStorage.ready().then((localeForage: LocalForage)=>{
            console.log("Storage service is ready");
        });


    }

    /**
     * Sets the value for a given in a given table
     * @param tableName The name of the table
     * @param key The key
     * @param value The value associated with the key
     * @returns {any}
     */
    public setValue(tableName: string, key: string, value: any): Observable<any> {

        return Observable.of(this.browserStorage.set(this._nativeKey(tableName, key), value));

    }

    /**
     * Gets value for a given table
     * @param tableName table name
     * @param key The key for which the values are required
     * @returns {any}
     */
    public getValue(tableName: string, key: string): Observable<any> {

        return Observable.fromPromise(this.browserStorage.get(this._nativeKey(tableName, key)));

    }

    /**
     * Deletes the given key from given table
     * @param tableName The name of the table
     * @param key The name of the key
     */
    public delete(tableName: string, key: string) {
        this.browserStorage.remove(this._nativeKey(tableName, key));

    }

    /**
     * Sets the preference value
     * @param key The key name of the preference
     * @param value The value of the preference
     */
    public setPreference(key: string, value: any): Observable<string> {
        return this.setValue(MyGolfStorageService.PreferenceTable, key, value);
    }

    /**
     * Deletes a preference
     * @param key
     */
    public deletePreference(key: string) {
        // console.log("delete pref", MyGolfStorageService.PreferenceTable)
        this.delete(MyGolfStorageService.PreferenceTable, key);
    }

    /**
     * Gets the preference
     * @param key The key for which the preference is needed
     * @returns {any}
     */
    public getPreference(key: string): Observable<any> {
        return this.getValue(MyGolfStorageService.PreferenceTable, key);

    }

    /**
     * Sets or clears the given
     * @param key
     * @param value
     * @returns {Promise<any>}
     */
    public preference(key: string, value?: any): Promise<any> {
        let nativeKey = this._nativeKey(MyGolfStorageService.PreferenceTable, key);
        if(value) {
            return this.browserStorage
                .set(nativeKey, value);
        }
        else {
            return this.browserStorage.get(nativeKey);
        }
    }
    public removePreference(key: string): Promise<any> {
        return this.browserStorage.remove(this._nativeKey(MyGolfStorageService.PreferenceTable, key))
    }
    public preferenceString(key: string): Promise<string> {
        return this.browserStorage.get(this._nativeKey(MyGolfStorageService.PreferenceTable, key));
    }

    private _nativeKey(tableName: string, key: string) {
        return tableName + "." + key;
    }

    public handleError(error) {
        return ErrorObservable.create(error);
    }

}
