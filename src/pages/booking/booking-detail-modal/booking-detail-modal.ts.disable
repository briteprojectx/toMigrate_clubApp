import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the BookingDetailModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'booking-detail-modal',
  templateUrl: 'booking-detail-modal.html'
})
export class BookingDetailModalComponent {
  
  event: any;
  color: any;
  constructor(public viewCtrl: ViewController, public navCtrl: NavController,  private params: NavParams) {

    let ev = this.params.get('evt');
    if(ev.arrived){
      this.event = ev;
    }else{
    this.event = ev.events[0];
    console.log(this.event)
    console.log('booksinf')
    this.event['title'] == 'Sold Out'? this.color = 'danger': this.color = 'success';
    }
   
  }
 
  dismiss() {
    this.viewCtrl.dismiss(this.event);
  }

  openPage(page) {
  
    console.log(page)
    this.navCtrl.push(page);
  }
  
}
