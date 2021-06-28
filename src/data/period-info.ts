/**
 * Created by Ashok on 21-04-2016.
 */
export interface PeriodInfo
{
    /**
     *The period type values are
     * 1. days
     * 2. weeks
     * 3. months
     * 4. years
     * 5. custom - Needs start and end dates
     */
    periodType: string;
    /**
     * The length of the period. Mandatory if anything other than
     * custom is selected for periodType
     */
    periodLength?: number;
    /**
     * Start date of the custom period
     */
    startDate: Date;

    /**
     * End date of the custom period
     */
    endDate: Date;

}
