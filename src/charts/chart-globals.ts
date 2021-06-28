/**
 * Created by ashok on 21-07-2016.
 */

declare var Chart;
export const DefaultBackgroundColors = [
    'rgba(255, 99, 132, 1.0)',
    'rgba(54, 162, 235, 1.0)',
    'rgba(255, 206, 86, 1.0)',
    'rgba(75, 192, 192, 1.0)',
    'rgba(153, 102, 255, 1.0)',
    'rgba(255, 159, 64, 1.0)',
    'rgba(255, 99, 132, 0.5)',
    'rgba(54, 162, 235, 0.5)',
    'rgba(255, 206, 86, 0.5)',
    'rgba(75, 192, 192, 0.5)',
    'rgba(153, 102, 255, 0.5)',
    'rgba(255, 159, 64, 0.5)'
];
export function setChartDefaults() {
    if (Chart && Chart.defaults && Chart.defaults.global) {
        let global                 = Chart.defaults.global;
        global.maintainAspectRatio = false;
        if (global.title) {
            global.title.display    = true;
            global.title.position   = 'top';
            global.title.fontFamily = 'Arial';
        }

        if (!global.legend) global.legend = {};
        global.legend.display  = true;
        global.legend.position = 'bottom';
        if (!global.legend.labels) global.legend.labels = {};
        global.legend.labels.boxWidth = 20;

        global.tooltips.enabled   = true;
        global.animation.duration = 1000;
    }
}
