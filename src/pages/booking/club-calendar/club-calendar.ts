import { Component } from '@angular/core';

/**
 * Generated class for the ClubCalendarComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'club-calendar',
  templateUrl: 'club-calendar.html'
})
export class ClubCalendarComponent {

  text: string;

  calendar = {
    mode: 'month',
    currentDate: new Date()
  };
  
  constructor() {
    console.log('Hello ClubCalendarComponent Component');
    this.text = 'Hello World';
  }

}
