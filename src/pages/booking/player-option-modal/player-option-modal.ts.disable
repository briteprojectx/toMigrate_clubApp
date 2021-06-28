import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { ModalProvider } from '../../providers/modal/modal';

/**
 * Generated class for the PlayerOptionModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'player-option-modal',
  templateUrl: 'player-option-modal.html'
})
export class PlayerOptionModalComponent {

  text: string;
  driver: any;
  buggieSeating: any;
  caddieParing: any;
  favoriteCaddy: any;
  caddies:any =[{name:'caddie1'},{name:'caddie2'},{name:'caddie3'},{name:'caddie4'}];
  constructor(public viewCtrl: ViewController, public modalService: ModalProvider) {
   this.text = 'modal';
   this.driver = this.modalService.bookingData.driver;
   this.buggieSeating = this.modalService.bookingData.buggieSeating;
   this.caddieParing = this.modalService.bookingData.caddieParing;
   this.favoriteCaddy = this.modalService.bookingData.favoriteCaddy;
  }

 choose(item:any){
    console.log(item)
    this.favoriteCaddy = item;
 }

  dismiss() {
    this.modalService.bookingData.driver = this.driver;
    this.modalService.bookingData.buggieSeating = this.buggieSeating;
    this.modalService.bookingData.caddieParing = this.caddieParing;
    this.modalService.bookingData.favoriteCaddy = this.favoriteCaddy;
    console.log(this.modalService.bookingData)
    this.viewCtrl.dismiss(this.driver);
  }
 
}
