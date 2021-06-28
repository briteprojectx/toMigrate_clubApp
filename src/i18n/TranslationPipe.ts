import {PipeTransform, Pipe} from "@angular/core";
import {TranslationService} from "./translation-service";
/**
 * Created by Ashok on 05-04-2016.
 */

@Pipe({
    name: "translate",
    pure: false
})
export class TranslationPipe implements PipeTransform
{

    constructor(private translationService: TranslationService) {
    }

    transform(value: string, ...args: any[]): any {

        if (this.translationService)
            return this.translationService.translate(value);
        else return value;
    }

}
