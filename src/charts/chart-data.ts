/**
 * Created by ashok on 21-07-2016.
 */

export interface ChartDataPoint
{
    x: number;
    y: number;
}
export interface ChartDataSet
{
    label?: string;
    data: Array<number>;
    backgroundColor?: Array<string>;
    borderColor?: Array<string>;
    borderWidth?: number;
}

/**
 * The data set normally used for Line (XY) charts
 */
export interface ChartXYDataSet
{
    label: string;
    data: Array<ChartDataPoint>;
}

