import {isPresent} from 'ionic-angular/util/util';
import * as globals from './globals';
import * as moment from 'moment';
;
/**
 * Utility class for JSON
 * Created by Ashok on 14-04-2016.
 */

export class JsonService
{

    /**
     * Clones a given object and returns the new object
     * @param obj The object to clone.
     * @returns {any}
     */
    public static clone(obj: any): any {
        if (!isPresent(obj)) return null;

        let str = JSON.stringify(obj);
        return JSON.parse(str);
    }

    public static deriveDates(obj: any, dateFields: Array<string>) {
        if (isPresent(obj) && isPresent(dateFields) && dateFields.length) {
            for (let field of dateFields) {
                if (obj.hasOwnProperty(field)) {
                    let val: Date|null = obj[field];
                    if (isPresent(val) && val instanceof Date) {
                        try {
                            obj[field] = moment(val).toDate();
                            // new Date(val);
                        } catch (e) {
                            console.error(e);
                        }
                    }
                }
            }
        }
    }

    public static deriveFullUrl(obj: any, fldName: string) {
        if (isPresent(obj) && isPresent(fldName) && obj.hasOwnProperty(fldName)) {
            let val = obj[fldName];
            if (isPresent(val))
                obj[fldName] = globals.MygolfServer + "/" + val;

        }
    }

    public static deriveFulImageURL(obj: any, fldName: string, defaultImg?: string) {
        if (isPresent(obj) && isPresent(fldName) && obj.hasOwnProperty(fldName)) {
            let val = obj[fldName];
            if (isPresent(val))
                obj[fldName] = globals.MygolfServer + "/" + val;
            else if (isPresent(defaultImg))
                obj[fldName] = defaultImg;

        }
    }

    public static deriveTime(obj: any, fldNames: Array<string>) {
        if (isPresent(obj) && isPresent(fldNames) && fldNames.length) {
            for (let fldName of fldNames) {
                let timeObj: any = obj[fldName];
                if (isPresent(timeObj)) {
                    let time = new Date();
                    time.setHours(timeObj["hour"]);
                    time.setMinutes(timeObj["minute"]);
                    time.setSeconds(timeObj["second"]);
                    obj[fldName] = time;
                }

            }

        }
    }

    /**
     * Merge all the given objects into a single object. If more than
     * one objects have same properties, the objects in the end of array
     * will override the properties of earlier objects. The original objects
     * are not modified
     * @param objects The objectss to merge
     * @returns {{any}} Returns the merged object
     */
    public static mergeObjects(objects: Array<any>): any {
        let result = {};
        if (isPresent(objects && objects.length)) {
            for (let src of objects) {
                if (isPresent(src))
                    JsonService.mergeObject(result, src);
            }

        }
        return result;
    }

    private static mergeObject(target: any, source: any) {
        for (let key in source)
            target[key] = source[key];
    }

    public static escapeCRLF(value) {
        if(!value) return;
        return value.replace(/\r?\n/g, "<br />");   
    }  
}
