import {AbstractStorage} from './abstract-storage';
/**
 * Volatile storage stores the data in session storage.
 * The data in this is lost when user session is closed
 * Created by Ashok on 06-04-2016.
 */

export class VolatileStorage extends AbstractStorage
{
    constructor() {
        super(sessionStorage);
    }

    // public setCurrentPlayer(player: PlayerInfo) {
    //     this.setObject("CurrentPlayer", player);
    // }
    //
    // public getCurrentPlayer(): PlayerInfo {
    //     return this.getObject("CurrentPlayer");
    // }
}
