import { Injectable } from '@angular/core';
import {Chart} from "../../../node_modules/chart.js";
// import { Chart } from "chart.js";

// @Injectable({
//   providedIn: 'root'
// })

@Injectable()
export class ChartdateService {
  activeClass: string;

  constructor() { }


  thisMonthData() {
    // this.activeClass = 'month'
  }

  thisWeekData(chart, levelsArr?: any) {
    // this.activeClass = 'week'
    let outOfWeek = new Date();
    outOfWeek.setDate(outOfWeek.getDate() + 7);

    const dateList = [new Date(), outOfWeek];
    const monthDay = new Date().getDate();
    const weekDay = new Date().getDay();
    const daysToSunday = 7 + weekDay;
    const daysFromSunday = weekDay;

    const setDateToMidnight = (date) => {
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
    };

    let maxDate = new Date();
    maxDate.setDate(monthDay + daysToSunday);
    setDateToMidnight(maxDate);

    let minDate = new Date();
    minDate.setDate(monthDay - daysFromSunday);
    setDateToMidnight(minDate);

    let filteredDates = dateList.filter((date) => {
      if (
        date.getTime() < maxDate.getTime() &&
        date.getTime() >= minDate.getTime()
      ) {
        return true;
      } else {
        return false;
      }
    });

    console.log("datelist", dateList);
    console.log("filterdates", filteredDates);
    let newDtae = dateList.map((x) => {
      let date = x.getDate();
      let month = x.getMonth();
      return date + levelsArr[month];
    });
    chart.data.labels = newDtae;
    chart.update();
  }

  todayData(chart, levelsArr?: any,) {
    // this.activeClass = 'today'
    let outOfWeek = new Date();
    outOfWeek.setDate(outOfWeek.getDate() + 7);

    const dateList = [new Date(), outOfWeek];
    const monthDay = new Date().getDate();
    const weekDay = new Date().getDay();
    const daysToSunday = 7 - weekDay;
    const daysFromSunday = weekDay;

    const setDateToMidnight = (date) => {
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
    };

    let maxDate = new Date();
    maxDate.setDate(monthDay + daysToSunday);
    setDateToMidnight(maxDate);

    let minDate = new Date();
    minDate.setDate(monthDay - daysFromSunday);
    setDateToMidnight(minDate);

    let filteredDates = dateList.filter((date) => {
      if (
        date.getTime() < maxDate.getTime() &&
        date.getTime() >= minDate.getTime()
      ) {
        return true;
      } else {
        return false;
      }
    });
    let newDtae = filteredDates.map((x) => {
      let date = x.getDate();
      let month = x.getMonth();
      return date + levelsArr[month];
    });
    chart.data.labels = newDtae;
    chart.update();
  }



 
}
