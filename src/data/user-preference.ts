/**
 * The preference object representing user's preference
 * Created by Ashok on 14-05-2016.
 */

export class UserPreference
{
    /**
     * The maximum distance within which you want to find the nearby clubs
     * @type {number}
     */
    public maxClubDistance: number = 20;
    /**
     * When to sync normal game scorecards. Options are as follows
     * 1. Immediate - The scorecard is synced with server as soon as possible
     * 2. Finish (Default) - On finish of the game, the data is synced with server
     * 3. Manual - User will manually sync the scorecard with server
     */
    public normalGameSync: string  = "Finish";

    /**
     * Whether to delete the normal game scorecard after sync with server
     * @type {boolean}
     */
    public deleteOnSync: boolean = true;
}
