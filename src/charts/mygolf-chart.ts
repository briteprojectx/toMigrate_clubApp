import {Component, ElementRef} from "@angular/core";
import {ChartDataSet, ChartXYDataSet} from "./chart-data";
import {DefaultBackgroundColors} from "./chart-globals";
/**
 * Created by ashok on 22-07-2016.
 */
declare var Chart;
@Component({
    selector: 'mygolf-chart',
    template: `<canvas style="height: 100%; width: 100%"></canvas>`,
    inputs  : ['chartType', 'labels', 'chartLabel', 'data', 'datasets', 'colors', 'options']
})
export class MygolfChartComponent
{
    chartType: string;
    labels: Array<string>;
    chartLabel: string;
    data: Array<number>;
    datasets: Array<ChartDataSet>;
    xydatasets: Array<ChartXYDataSet>;
    colors: Array<string>;
    options: any;

    ctx: CanvasRenderingContext2D;
    chart: any;
    initFlag: boolean = false;

    constructor(private element: ElementRef) {

    }

    ngOnInit() {
        this.ctx      = this.element.nativeElement.children[0].getContext('2d');
        this.initFlag = true;
        this._refresh();
    }

    ngOnDestroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = void 0;
        }
    }

    ngOnChanges(changes: any) {
        if (this.initFlag) {
            this._refresh();
        }
    }

    private _refresh() {
        this.ngOnDestroy();
        this._buildChart();
    }

    private _buildChart() {

        let opt:any = {
            type: this.chartType
        };

        let options = Object.assign({}, this.options || {});
        if (!options.legend)
            options.legend = {};

        if (this.datasets && this.datasets.length) {
            opt.data = {
                labels  : this.labels,
                datasets: this.datasets
            }
        }
        else if (this.xydatasets && this.xydatasets.length) {
            opt.data = {
                datasets: this.xydatasets
            }
        }
        else if (this.data && this.data.length) {
            // if(this.chartType !== 'pie' && this.chartType != "doughnut")
            //     options.legend.display = false;
            let dataset: any = {
                data: this.data,

            }
            let colors       = (this.colors && this.colors.length) ? this.colors : DefaultBackgroundColors;
            if (colors && colors.length) {
                if (this.chartType === "line") {
                    dataset["backgroundColor"] = colors[0];
                }
                else {
                    dataset["backgroundColor"] = [];
                    this.data.forEach((data: number, index: number) => {
                        let colIdx = index;
                        if (index >= colors.length) {
                            colIdx = index % colors.length;
                        }
                        dataset.backgroundColor.push(colors[colIdx]);
                    });
                }

            }

            if (this.chartLabel)
                dataset.label = this.chartLabel;
            else
                dataset.label = "data";
            opt.data = {
                labels  : this.labels,
                datasets: [dataset]
            }
        }

        //Now build the chart
        opt.options = options;
        if (opt.data)
            this.chart = new Chart(this.ctx, opt);
    }
}
