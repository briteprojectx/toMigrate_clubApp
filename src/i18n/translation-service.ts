/**
 * Translation service to handle the multilingual approach
 * Created by Ashok on 05-04-2016.
 **/
import {Injectable} from "@angular/core";
/**
 *
 */
declare var myGolfLang: any;
@Injectable()
export class TranslationService
{
    private lang: string = "en";

    public setLanguage(lang: string) {
        this.lang = lang;
    }

    public translate(text: string): string {
        let translated = text;
        //Assume that en is always there
        let obj        = myGolfLang[this.lang];
        if (!obj) obj = myGolfLang["en"];
        let parts: Array<string> = this.splitParts(text);

        if (parts && parts.length) {
            let keyName: string = parts.pop();
            for (let key of parts) {
                if (obj[key]) obj = obj[key];
                else {
                    obj = null;
                    break;
                }
                if (obj && obj[keyName]) translated = obj[keyName];
            }

        }
        return translated;
    }

    private splitParts(text: string): Array<string> {
        return text.split(".");
    }
}
