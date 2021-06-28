import { Injectable } from '@angular/core';
import {Chart} from "../../../node_modules/chart.js";
// import { Chart } from "chart.js";
// @Injectable({
//   providedIn: 'root'
// })

@Injectable()
export class ChartcrudService {

  constructor() { }

  removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
    });
    chart.update();
  }

  updateChartData(chart, data?, dataSetIndex?) {
    chart.data.datasets[dataSetIndex].data = data;
    chart.update();
  }

  applyFilter(value , chart: any) {
    console.log(chart.dataSet1);
    chart.data.datasets[0].data = chart.dataSet1;
    // this.barChart.data.datasets[1].data = this.chartData.dataSet2;

    chart.data.datasets.forEach((data, i) => {
      var lessThanOrGreaterThan
      if (lessThanOrGreaterThan === "greaterThan") {
        chart.data.datasets[i].data = data.data.map((v) => {
          if (v >= value) return v;
          else return 0;
        });
        console.log(">>>>>>>>", chart.data.datasets[i].data);
      } else {
      chart.data.datasets[i].data = data.data.map((v) => {
          if (v <= value) return v;
          else return 0;
        });
        console.log("?????????", chart.data.datasets[i].data);
      }
    });
    chart.update();
  }

  applyDateFilter(chart: any, start?: any, end?: any, ) {
    // chart.data.labels = this.levelsArr.slice(
    //   parseInt(this.from),
    //   parseInt(this.toMonth) + 1
    // );
    chart.update();
  }
}
