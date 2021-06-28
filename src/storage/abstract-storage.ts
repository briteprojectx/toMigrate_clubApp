import {isNumber, isPresent} from 'ionic-angular/util/util';
;
/**
 * Created by Ashok on 06-04-2016.
 */

export class AbstractStorage
{
    constructor(private storage: any) {
    }

    /**
     * Stores the preference as string
     * @param key The key
     * @param value The value
     */
    public setString(key: string, value: string) {
        if (isPresent(value))
            this.storage.setItem(key, value);
        else this.storage.remove(key);
    }

    /**
     * Stores the number preference
     * @param key
     * @param value
     */
    public setNumber(key: string, value: number) {
        // this.storage.storeItem(key, ""+value);
        if (isNumber(value))
            this.storage.setItem(key, value.toString());
        else this.storage.removeItem(key);
    }

    /**
     * Stores the boolean preference
     * @param key
     * @param value
     */
    public setBoolean(key: string, value: boolean) {
        this.storage.setItem(key, value.toString());
    }

    public setObject(key: string, value: any) {
        if (isPresent(value))
            this.storage.setItem(key, JSON.stringify(value));
        else this.storage.removeItem(key);
    }

    public remove(key: string) {
        this.storage.removeItem(key);
    }

    public getString(key: string): string {
        return this.storage.getItem(key);
    }

    /**
     * Gets the boolean preference. If the key doesn't exist then returns false
     * @param key The key name
     * @returns {boolean} Returns boolean
     */
    public getBoolean(key: string): boolean {
        let val = this.storage.getItem(key);
        if (isPresent(val))
            switch (val.toLowerCase()) {
                case "yes":
                case "true":
                case "1":
                    return true;
                case "no":
                case "false":
                case "0":
                    return false;
                default:
                    return new Boolean(val).valueOf();
            }
        else return false;
    }

    /**
     * Gets the integer preference. If not found returns null
     * @param key The key name
     * @returns {any}
     */
    public getInteger(key: string): number {
        let val = this.storage.getItem(key);
        if (isPresent(val))
            return parseInt(val);
        else return null;
    }

    /**
     * Gets the float preference value
     * @param key The key for which the value is required
     * @returns {number} Returns the float value of the preference if found. Else
     * reeturn null
     */
    public getFloat(key: string): number {
        let val = this.storage.getItem(key);
        if (isPresent(val))
            return parseFloat(val);
        else return null;
    }

    /**
     * Gets the JSON object stored in the preference
     * @param key The key to the preference
     * @returns {any}
     */
    public getObject(key: string): any {
        let val = this.storage.getItem(key);
        if (isPresent(val))
            return JSON.parse(val);
        else
            return null;
    }

}
