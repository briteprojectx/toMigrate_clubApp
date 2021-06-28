/**
 * Created by ashok on 13/05/17.
 */

const DEST_PREFIX      = '/app/mygolf2u-ws';
const SUBSCRIBE_PREFIX = '/topic';
export const DESTINATION_DEVICE_REGISTER = `${DEST_PREFIX}/device/register`;
export const DESTINATION_DEVICE_USER_TAG = `${DEST_PREFIX}/device/userlogin`;
export const DESTINATION_BATTERY_LEVEL = `${DEST_PREFIX}/device/battery`;
export const DESTINATION_COMP_SCORE_SAVE = `${DEST_PREFIX}/competition/savescorecard`;
const COMP_PREFIX                        = `${SUBSCRIBE_PREFIX}/competition`;
const TEETIME_PREFIX                     = `${SUBSCRIBE_PREFIX}/tee-time`;

export const SUBSCRIBE_FLIGHT_CHANGE     = {
    destination: `${COMP_PREFIX}/flightchanged`,
    id         : 'FlightChanged',
    persistent : true,
    ack: 'auto'
};
export const SUBSCRIBE_COMP_SCORE_SYNCED = {
    destination: `${COMP_PREFIX}/scoresynced`,
    id: 'ScoresSynced',
    persistent: true,
    ack: 'auto'
} ;
export const SUBSCRIBE_COMP_CANCELLED = {
    destination: `${COMP_PREFIX}/cancelled`,
    id: 'CompetitionCancelled',
    persistent: true,
    ack: 'auto'
} ;
export const SUBSCRIBE_DEVICE_LOCKED     = {
    destination: `${SUBSCRIBE_PREFIX}/device/locked`,
    id: 'DeviceLocked',
    persistent: false,
    ack: 'auto'
} ;

export const SUBSCRIBE_DEVICE_LOCK_BROKEN = {
    destination: `${SUBSCRIBE_PREFIX}/device/lockbroken`,
    id: 'DeviceLockBroken',
    persistent: false,
    ack: 'auto'
}

export const SUBSCRIBE_TEETIME_BOOKING = {
    destination: `${TEETIME_PREFIX}/booking`,
    id: 'TeeTimeBooking',
    persistent: true,
    ack: 'auto'
}