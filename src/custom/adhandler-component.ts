
import {Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges} from '@angular/core';
import {AdService} from '../providers/ad-service/ad-service';
import {Advertisement} from '../data/advertisement';
import {AdvertisementComponent} from './advertisement-component';

@Component({
    selector: 'ad-handler',
    templateUrl: 'adhandler-component.html'
})
export class AdhandlerComponent implements OnInit, OnChanges{
    @Input() transitionDelay: number = 1000;
    @Input() zoom: boolean = true;
    @Input() competitionId: number;
    advertisements: Advertisement[] = [];

    @ViewChild('ads') ads: AdvertisementComponent;

    constructor(private adService: AdService){}

    ngOnInit(): void {
        this.refresh();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if(changes.competitionId){
            this.refresh();
        }
    }

    private start() {
        if(this.ads) this.ads.startPlay();
    }
    stop() {
        if(this.ads) this.ads.stopPlay();
    }
    refresh() {
        if(this.competitionId)
            this.refreshCompetitionAds(this.competitionId);
        else this.refreshAds();
    }
    refreshAds(){
        this.adService.getAdToDisplay()
            .subscribe((ads: Advertisement[])=>{
                    this.advertisements = ads;
                    this.start();
            })
    }
    refreshCompetitionAds(compId: number) {
        this.adService.getCompetitionAds(compId)
            .subscribe((ads: Advertisement[])=>{
                if(ads && ads.length){
                    this.advertisements = ads;
                    this.start();
                }
                else this.refreshAds();
            })
    }
}