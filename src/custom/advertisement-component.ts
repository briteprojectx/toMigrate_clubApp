
import {Component, Input, ViewChild} from '@angular/core';
import {AdService} from '../providers/ad-service/ad-service';
import {Advertisement} from '../data/advertisement';
import {Slides} from 'ionic-angular';

@Component({
    selector: 'advertisements',
    templateUrl: 'advertisement-component.html'
})
export class AdvertisementComponent{

    @Input() advertisements: Advertisement[] = [];
    @Input() transitionDelay: number = 1000;
    @Input() zoom: boolean = true;
    @Input() slidesPerView: number = 1;
    @Input() height: number = 60;

    @ViewChild('slider') slider: Slides;

    constructor(){}

    startPlay() {
        try {
            this.slider.autoplay = this.transitionDelay;
            if (this.slider) this.slider.startAutoplay();
        } catch (e) {
        }
    }
    stopPlay() {
        try {
            this.slider.autoplay = false;
            if (this.slider) this.slider.stopAutoplay();
        } catch (e) {
        }
    }
}