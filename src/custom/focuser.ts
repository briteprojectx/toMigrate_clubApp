import {Directive, Renderer, ElementRef} from "@angular/core";
import {Platform} from "ionic-angular";

@Directive({
    selector: '[focuser]'
})
export class Focuser
{
    constructor(public platform: Platform,
        public renderer: Renderer, public elementRef: ElementRef) {
    }

    ngOnInit() {
        //search bar is wrapped with a div so we get the child input
        // const searchInput = this.elementRef.nativeElement.querySelector('input');
        // setInterval(() => {
        //   //delay required or ionic styling gets finicky
        //   this.renderer.invokeElementMethod(searchInput, 'focus', []);
        // }, 1000);
    }
}
