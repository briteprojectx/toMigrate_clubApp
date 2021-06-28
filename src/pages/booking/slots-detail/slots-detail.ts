import { Component, ViewChild, OnInit } from '@angular/core';
import { ViewController, NavController, NavParams, Slides, ModalController } from 'ionic-angular';
import { PlayerOptionModalComponent } from '../player-option-modal/player-option-modal';
import { ModalProvider } from '../../providers/modal/modal';
import * as moment from 'moment';
import { CourseInfo } from '../../../data/mygolf.data';
/**
 * Generated class for the SlotsDetailComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'slots-detail',
  templateUrl: 'slots-detail.html'
})
export class SlotsDetailComponent implements OnInit {
  @ViewChild(Slides) slides: Slides;
  togglebtn: boolean = true;
  event: any;
  index: any = null;
  bookForOthers: boolean = true;
  golfHoles: any;
  playerName: any;
  mg2uId: any;
  modalService: any;
  endTime: any;
  selectedTime: string;
  courseInfo: CourseInfo;
  constructor(public viewCtrl: ViewController, 
    // private modalService: M,
    public navCtrl: NavController, public modalCtrl: ModalController,
    private params: NavParams) {
    this.event = this.params.data;
    console.log('all data----', this.event)
    this.event = this.params.get("event");
    if(this.event) {
      // this.selectedTime = moment(this.event.event.selectedTime).format("YYYY-MM-DD hh:mm A");
      // this.courseInfo = this.event.event.events[0].slot.startCourse;
      // console.log("on slot detail event - selectedTime ", this.selectedTime)
      // console.log("on slot detail event - course Info", this.courseInfo)
    }
    this.endTime = this.params.get("endTime");
    // //this.modalService.bookingData.slotStartTime = this.event.selected;
    // //this.modalService.bookingData.slotEndTime = this.event.endTime;

  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad HomePage');
  }

  ngOnInit() {
    this.slides.lockSwipes(true);
    let currentIndex = this.slides.getActiveIndex();
    console.log(currentIndex)
  }
  //booking
  bookings: any = 0;
  caddies: any = 0;
  buggies: any = 0;

  remove(item: any) {
    item == 'caddies' ? this.caddies == this.caddies-- : item == 'booking' ? this.bookings == this.bookings-- : item == 'buggies' ? this.buggies == this.buggies-- : null;
  }

  add(item: any) {
    item == 'caddies' ? this.caddies == this.caddies++ : item == 'booking' ? this.bookings == this.bookings++ : item == 'buggies' ? this.buggies == this.buggies++ : null;
  }



  segmentChanged(event) {
    console.log(event.value)
  }

  toggle(event) {
    console.log(event.value)
  }
  addPlayerToggle() {
    this.togglebtn = !this.togglebtn;
    //this.modalService.bookingData.golfHoles = this.golfHoles;
    //this.modalService.bookingData.playerName = this.playerName;
  }
  toggleCancel() {
    this.playerName = '';
    this.mg2uId = '';
    this.togglebtn = !this.togglebtn;
  }
  dismiss() {
    this.viewCtrl.dismiss(this.event);
  }

  slideChanged() {
    this.index = this.slides.getActiveIndex();
    console.log('Current index is', this.index);
  }
  submit() {
    //this.modalService.bookingData.golfPlayers = this.bookings;
    //this.modalService.bookingData.bookForSomeone = this.bookForOthers;
    //this.modalService.bookingData.golfHoles = this.golfHoles;
    //this.modalService.bookingData.playerName = this.playerName;
    //this.modalService.bookingData.mg2uId = this.mg2uId;
    //this.modalService.bookingData.caddies = this.caddies;
    //this.modalService.bookingData.buggies = this.buggies;
    console.log(this.modalService.bookingData);
  }
  nextPage() {
    this.submit();
    this.slides.lockSwipes(false);
    console.log('next');
    this.slides.slideNext();
  }
  back() {
    this.slides.lockSwipes(false);
    console.log('next');
    this.slides.slidePrev();
  }
  openPage(page) {
    this.submit();
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    console.log(page)
    this.navCtrl.push(page);
  }
  driverValue: any;
  // openModal() {
  //   let playerModal = this.modalCtrl.create(PlayerOptionModalComponent, { userId: 8675309 }, {
  //     showBackdrop: false,
  //     enableBackdropDismiss: false,
  //     enterAnimation: '',
  //     leaveAnimation: '',
  //     cssClass: 'my-modal'
  //   });
  //   playerModal.onDidDismiss(data => {
  //     console.log(data)
  //     this.driverValue = data;
  //   });
  //   playerModal.present();
  // }

}
