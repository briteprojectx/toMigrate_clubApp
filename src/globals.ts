/**
 * Created by Ashok on 30-03-2016.
 */
import {AlertController, NavController} from 'ionic-angular/index';
import {Renderer, Renderer2} from '@angular/core';
import { MyGolfStorageService } from './storage/mygolf-storage.service';
// import {Router} from '@angular/router';
/**
 * Generates the UUID String
 * @returns {string}
 */
export function generateUUID() {
    var d    = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d     = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};

export function displayError(alertCtl: AlertController,
    error: any,
    title: string, buttonText: string) {
    let msg = null;
    if (error && error.message)
        msg = error.message;
    else if (error && error.exception)
        msg = error.exception;
    else if (error)
        msg = JSON.stringify(error);

    let alert = alertCtl.create({
        title  : title,
        message: msg,
        buttons: [buttonText]
    });
    alert.present();

}
export function randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
export function getErrorMessage(error: any): string {
    let msg = null;
    if (error && error.message)
        msg = error.message;
    else if (error && error.exception)
        msg = error.exception;
    else if (error)
        msg = JSON.stringify(error);
    return msg;
}
/**
 * Gets the distance between two co-ordinates of GPS
 * @param lat1 The latitude of first point
 * @param lon1 The longitude of first point
 * @param lat2 The latitude of second point
 * @param lon2 The longitude of second point
 * @returns {number} Return the distance in KM
 */
export function getDistanceInKM(lat1: number, lon1: number, lat2: number, lon2: number): string {
    var R    = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a    =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c    = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d    = R * c; // Distance in km
    return d.toFixed(0);
}
export function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
    var R    = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a    =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c    = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d    = R * c; // Distance in km
    return d * 1000;
}
function deg2rad(deg) {
    return deg * (Math.PI / 180)
}
export function adjustViewZIndex(nav: NavController, renderer: Renderer2|Renderer) {
    // let totalViews = nav.length();
    // let zindex = 100;
    // for(let i=0; i < totalViews; i++){
    //     let view = nav.getByIndex(i);
    //     view._setZIndex(zindex, renderer);
    //     zindex++;
    // }
}

// export function getURL(router: Router) {
//     console.log("get current url " ,router.url)
// }
/**
 * This is the shared object visible acorss all the pages
 */
export var SharedObject: any = {};
// export const MygolfServerHost = '192.168.1.133';

// export const MygolfServerPort = 1400;
// console.log("get current url ". window.location.href)
// getURL();
export const MygolfServerHost = 'devlet.mygolf2u.com';
export const MygolfServerPort = 80;
export const MygolfServerProtocol = 'http';
export var MygolfServer = `${MygolfServerProtocol}://${MygolfServerHost}:${MygolfServerPort}`;


// export var MygolfServer = `http://${MygolfServerHost}:${MygolfServerPort}`;
// export var MygolfServer = `http://${MygolfServerHost}`;

               // "http://192.168.1.133:1400";
// export var MygolfServer = "http://localhost:1400";
// B2 Development Server
// export var MygolfServer = "http://test.britesoft.com";

// B2 Development Server
// export var MygolfServer = "http://testlet.mygolf2u.com";
// export var MygolfServer = "http://192.168.0.109:7071";
// export var MygolfServer = "http://azulet.mygolf2u.com";
// export var MygolfServer = "http://192.168.0.232:1400";
// Production Server
// export var MygolfServer = "http://azulet.mygolf2u.com";

export var AUTH_TOKEN_NAME = "X-AUTH-TOKEN";

export const GOOGLE_MAP_ANDROID_KEY = "AIzaSyDpbMcldv1v_kgCI_yYQmO737_PbvueKqc";
export const GOOGLE_MAP_IOS_KEY     = "AIzaSyDpbMcldv1v_kgCI_yYQmO737_PbvueKqc";
var competitionBase                 = MygolfServer + "/rest/competition";
var friendsBase                     = MygolfServer + "/rest/friends";
var pushNotificationBase            = MygolfServer + "/rest/pushnotification";
export const teeTimeBookingBase     = MygolfServer + "/rest/tee-time/booking";
export var ServerUrls: any          = {
    authentication: MygolfServer + "/api/login",

    registerPlayer         : MygolfServer + "/rest/register/player",
    registerFriend         : MygolfServer + "/rest/register/friend",
    updatePhoto            : MygolfServer + "/rest/update/photo",
    updatePlayerProfile    : MygolfServer + "/rest/update/player/profile",
    updatePlayerNHS        : MygolfServer + "/rest/update/player/nhs",
    playerMain             : MygolfServer + "/rest/main/player",
    forgotPassword         : MygolfServer + "/rest/forgotpassword",
    startRestPassword      : MygolfServer + "/rest/startpasswordreset",
    resetPassword          : MygolfServer + "/rest/resetpassword",
    changePassword         : MygolfServer + "/rest/changepassword",
    playerMemberships      : MygolfServer + "/rest/player/clubmemberships",
    updatePlayerMembership : MygolfServer + "/rest/player/clubmembership/update",
    deletePlayerMembership : MygolfServer + "/rest/player/clubmembership/delete",
    // http://azulet.mygolf2u.com/rest/handicap/recalculate-handicap-index?playerId=199
    calculateHandicapIndex : MygolfServer + "/rest/handicap/recalculate-handicap-index",
    getCourseHandicap      : MygolfServer + "/rest/handicap/player-course-handicap",
    competitionDetails     : competitionBase + "/details",
    competitionInfo        : competitionBase + "/info",
    upcomingCompetitionList: competitionBase + "/list/upcoming",
    listAllCompetitions    : competitionBase + "/list/all",
    searchCompetitions     : competitionBase + "/search",
    competitionPlayers     : competitionBase + "/players/list",
    competitionScorers     : competitionBase + "/scoringplayers",

    getPlayerHcpList       : MygolfServer + "/rest/handicap/player-handicap-calculations",
    getPlayerClubHcp       : MygolfServer + "/rest/handicap/get-club-handicaps",
    getHcpIdxSubscription  : MygolfServer + "/rest/feature/handicap-index-subscription/player",
    getTrialSubscription   : MygolfServer + "/rest/feature/request-handicap-index-trial/player",
    generateHcpCalculation : MygolfServer + "/rest/handicap/recalculate-handicap-index",
    getHcpIdxBundles       : MygolfServer + "/rest/feature/handicap-index-bundles", //?country=

    competitionRegister       : competitionBase + "/players/register",
    competitionDeregister     : competitionBase + "/players/deregister",
    // competitionDeregister     : competitionBase + "/player/dergister",
    // competitionDeregister     : "/rest/competitions" + "/de-register",
    competitionSponsors       : competitionBase + "/sponsors/list",
    competitionPrizes         : competitionBase + "/prizes/list",
    competitionFlights        : competitionBase + "/flights/list",
    competitionLeaderboard    : competitionBase + "/leaderboard",
    competitionRoundForScoring: competitionBase + "/roundforscoring",
    activeCompetitions        : competitionBase + "/active/list",
    activeCompetitionsForClub : competitionBase + "/active/list/club",
    activeCompetitionsForOrganizer : competitionBase + "/active/list/organizer",
    competitionFlightChanged  : competitionBase + "/flightchanged",

    competitionScorecardGetOrCreate: competitionBase + "/scorecard/create",
    competitionScorecardUpdate     : competitionBase + "/scorecard/update",
    competitionScorecardSync       : competitionBase + '/scorecard/sync',
    competitionScorecardGet        : competitionBase + "/scorecard/get",

    competitionChangeScorer: competitionBase + "/changescorer",
    competitionWithdraw    : competitionBase + "/withdraw",

    friendsList        : friendsBase + "/list",
    friendsTotal       : friendsBase + "/total",
    friendsPending     : friendsBase + "/pending/list",
    friendsPendingTotal: friendsBase + "/pending/total",
    friendRequestSend  : friendsBase + "/request",
    friendRequestAccept: friendsBase + "/accept",
    friendRequestCancel: friendsBase + "/cancel",

    scorecardGet   : MygolfServer + "/rest/scorecard/get",
    scorecardSearch: MygolfServer + "/rest/scorecard/search",

    getClub       : MygolfServer + "/rest/club/get",
    getClubCourses: MygolfServer + "/rest/club/courses",
    getClubsNearby: MygolfServer + "/rest/clubs/nearby",
    getRecentClubs: MygolfServer + "/rest/clubs/recent",
    searchClubs   : MygolfServer + "/rest/clubs/search",

    searchPlayers              : MygolfServer + "/rest/players/search",
    nonFriendPlayers           : MygolfServer + "/rest/players/nonfriends",
    getPlayerGroups            : MygolfServer + "/rest/players/groups/get",
    deletePlayerGroup          : MygolfServer + "/rest/players/groups/delete",
    createPlayerGroup          : MygolfServer + "/rest/players/groups/create",
    saveNormalGame             : MygolfServer + "/rest/normalgame/scorecard/save",
    deleteNormalGameScorecar   : MygolfServer + "/rest/normalgame/scorecard/delete",
    changeCourse               : MygolfServer + "/rest/normalgame/changecourse",
    getPlayerPerformanceBase   : MygolfServer + "/rest/player/performance",
    getPlayerPerformanceDetails: MygolfServer + "/rest/player/performancedetail",
    getPlayerPerformanceChart  : MygolfServer + "/rest/player/performancechart",
    getPlayerInfo              : MygolfServer + "/rest/player/get",

    getPlayerAnalysisHole: MygolfServer + "/rest/player/holeanalysis",

    listFeedbackCategories: MygolfServer + "/rest/feedback/categories",
    createPlayerFeedback  : MygolfServer + "/rest/feedback/player/create",

    getCountries: MygolfServer + "/rest/countries",
    getStates   : MygolfServer + "/rest/states",
    getCities   : MygolfServer + "/rest/cities",

    addPlayerFavoriteClub       : MygolfServer + "/rest/player/favoriteclub/add",
    deletePlayerFavoriteClub    : MygolfServer + "/rest/player/favoriteclub/delete",
    addPlayerFavoriteLocation   : MygolfServer + "/rest/player/favoritelocation/add",
    deletePlayerFavoriteLocation: MygolfServer + "/rest/player/favoritelocation/delete",
    getPlayerFavoriteLocations  : MygolfServer + "/rest/player/favoritelocation/list",
    getPlayerFavoriteClubs      : MygolfServer + "/rest/player/favoriteclub/list",
    getPlayerHandicapIndex      : MygolfServer + "/rest/player/handicapindex/get",
    updatePlayerClubHandicap    : MygolfServer + "/rest/player/clubhandicap/update",
    serverInfo                  : MygolfServer + "/rest/server/info",
    pushNotificationServerInfo  : pushNotificationBase + "/serverinfo",
    getPrivateCompetitionList   : competitionBase + "/private/list",
    getCompetitionTeamList      : competitionBase + "/teams/list",

    getAdsForDisplay            : MygolfServer + "/rest/advertisement/fordisplay",
    getTeebox                   : MygolfServer + "/rest/tee-boxes",

    //BILLPLZ
    billplz_testCall                    : MygolfServer + "/rest/payment/billplz/test-call",
    billplz_createCollection            : MygolfServer + "/rest/payment/billplz/create-collection",
    billplz_updateCollection            : MygolfServer + "/rest/payment/billplz/update-collection",
    billplz_createBill                  : MygolfServer + "/rest/payment/billplz/create-bill",
    billplz_getRemoteCollection         : MygolfServer + "/rest/payment/billplz/get-remote-collection",
    billplz_getRemoteBill               : MygolfServer + "/rest/payment/billplz/get-remote-bill",
    billplz_getLocalBill                : MygolfServer + "/rest/payment/billplz/get-local-bill",
    billplz_paymentRedirect             : MygolfServer + "/rest/payment/billplz/redirect",
    billplz_paymentCallback             : MygolfServer + "/rest/payment/billplz/callback",
    billplz_updateBill                  : MygolfServer + "/rest/payment/billplz/update-bill",
    billplz_getBillCompetition          : MygolfServer + "/rest/payment/billplz/get-bill-competition",
    billplz_getCompCollection           : MygolfServer + "/rest/payment/billplz/get-collection-competition", //competition int
    billplz_getClubCollection           : MygolfServer + "/rest/payment/billplz/get-collection-club", //club int
    billplz_getPremiumFeatureCollection : MygolfServer + "/rest/payment/billplz/get-collection-premium-feature-pricing", //premium-feature-pricing (id)

    //iPay88
    ipay88_testCall                    : MygolfServer + "/rest/payment/ipay88/test-call",
    ipay88_createCollection            : MygolfServer + "/rest/payment/ipay88/create-collection",
    ipay88_updateCollection            : MygolfServer + "/rest/payment/ipay88/update-collection",
    ipay88_createBill                  : MygolfServer + "/rest/payment/ipay88/create-bill",
    ipay88_getRemoteCollection         : MygolfServer + "/rest/payment/ipay88/get-remote-collection",
    ipay88_getRemoteBill               : MygolfServer + "/rest/payment/ipay88/get-remote-bill",
    ipay88_getLocalBill                : MygolfServer + "/rest/payment/ipay88/get-local-bill",
    ipay88_paymentRedirect             : MygolfServer + "/rest/payment/ipay88/redirect",
    ipay88_paymentCallback             : MygolfServer + "/rest/payment/ipay88/callback",
    ipay88_updateBill                  : MygolfServer + "/rest/payment/ipay88/update-bill",
    ipay88_getBillCompetition          : MygolfServer + "/rest/payment/ipay88/get-bill-competition",
    ipay88_getCompCollection           : MygolfServer + "/rest/payment/ipay88/get-collection-competition", //competition int
    ipay88_getClubCollection           : MygolfServer + "/rest/payment/ipay88/get-collection-club", //club int
    ipay88_getPremiumFeatureCollection : MygolfServer + "/rest/payment/ipay88/get-collection-premium-feature-pricing", //premium-feature-pricing (id)
    ipay88_merchantKey                 : MygolfServer + "/rest/payment/ipay88/get-merchant-key",

    getPaymentGateway                  : MygolfServer + "/rest/payment/get-payment-gateway",

    getAvailableCaddies         : MygolfServer + "/rest/club/caddy/list-available-caddies", //?clubId=&availableOn=
    getAvailableBuggies         : MygolfServer + "/rest/club/buggy/list-available-buggies", //?clubId=&availableOn=
    getCaddyList                : MygolfServer + "/rest/club/caddy/list-caddies", //?clubId=28101520
    getBuggyList                : MygolfServer + "/rest/club/buggy/list-buggies", //?clubId=28101520
    getCaddySchedule            : MygolfServer + "/rest/club/caddy/schedule",
    getBuggySchedule            : MygolfServer + "/rest/club/buggy/schedule",
    getCaddyDayDetails          : MygolfServer + "/rest/club/caddy/caddie-details",
    getBuggyDayDetails          : MygolfServer + "/rest/club/buggy/buggy-details",

    getCaddyInfo                : MygolfServer + "/rest/club/caddy/info", //{caddieId}

    getCaddyRatings             : MygolfServer + "/rest/club/caddy/ratings",
    getCaddyAssignments         : MygolfServer + "/rest/club/caddy/assignments", // /{caddieId}

    getTeeTimeBookingList       : MygolfServer + "/rest/tee-time/booking/list", //?clubId=28101520&forDate=2020-05-27&registeredOnly=true",
    getClubBookingList          : MygolfServer + "/rest/tee-time/booking", //{clubId*} ?fromDate&toDate&pageSize(def=20)&pageNo(def=1)",
    getTeeTimeSlot              : MygolfServer + "/rest/tee-time/slot/list", //?clubId=28101520&forDate=2020-05-28"
    getTeeTimeSlotNearbyClubs   : MygolfServer + "/rest/tee-time/slot/list-in-nearby-clubs",
    getTeeTimeSlotFavClubs      : MygolfServer + "/rest/tee-time/slot/list-in-favorite-clubs",

    bookTeeTimeBookingSlot      : MygolfServer + "/rest/tee-time/booking/book-a-slot",
    getClubBookingOptions       : MygolfServer + "/rest/tee-time/booking/options", //?clubId=&forDate=

    getBookingByPlayer          : MygolfServer + "/rest/tee-time/booking/created-by-player",
    getBookingForPlayer         : MygolfServer + "/rest/tee-time/booking/for-player",
    addPlayerToBooking          : MygolfServer + "/rest/tee-time/booking/add-a-player",
    deletePlayerFromBooking     : MygolfServer + "/rest/tee-time/booking/delete-a-player",
    getPlayerById               : MygolfServer + "/rest/players/get-by-id", //?playerId
    getPlayerByMembership       : MygolfServer + "/rest/players/get-by-membership", //?membership=&clubId=
    searchPlayerByMembership    : MygolfServer + "/rest/players/search-by-membership", //?membership=&clubId=
    updateBookingPlayerContact  : MygolfServer + "/rest/tee-time/booking/update-player-contact", //?bookingPlayerId=
    updateBookingPlayerDetails  : MygolfServer + "/rest/tee-time/booking/update-player", //?bookingId=
    getBookingById              : MygolfServer + "/rest/tee-time/booking/get",
    addFromGroup                : MygolfServer + "/rest/tee-time/booking/add-from-group",
    cancelBooking               : MygolfServer + "/rest/tee-time/booking/cancel", //bookingId=&cancelledByClub=<true|false>&reason=<optional string>,
    checkinBooking              : MygolfServer + "/rest/tee-time/booking/checkin", //bookingId=<number*>&arrivingIn=<integer*>&byClub=<boolean|optional|default false>&bookingPlayerId=<integer[]*>
    processBookingAssignments   : MygolfServer + "/rest/tee-time/booking/process-assignments", //bookingId
    getPlayerByEmail            : MygolfServer + "/rest/player/getbyemail",
    updateBookingFlightStatus   : MygolfServer + "/rest/tee-time/booking/update-flight-status", 
    updateBuggyCaddyPreference  : MygolfServer + "/rest/tee-time/booking/update-buggy-caddie-preference",
    getBookingItemizedBill      : MygolfServer + "/rest/tee-time/booking/itemized-bill", //bookingId
    //bookingId=<integer>&status=<Dispatched | PlayStarted | CrossedOver | PlayFinished | Abandoned>
    cancelBookingAssignments    : MygolfServer + "/rest/tee-time/booking/cancel-assignments",
    changeBuggyFlight           : MygolfServer + "/rest/tee-time/course-starter/change-buggy", //bookingId=<number>, bookingPlayerId=<[number]>, buggyId=number,
    changeCaddyFlight           : MygolfServer + "/rest/tee-time/course-starter/change-caddy", //bookingId=<number>, bookingPlayerId=<[number]>, buggyId=number,
    clubBookingSlot             : MygolfServer + "/rest/tee-time/club/booking/book-a-slot", //can use for change course or time slot too
    changeSlot                  : MygolfServer + "/rest/tee-time/course-starter/change-slot", //bookingId=&slotDayId=&slotNo=
    rateForClub                 : MygolfServer + "/rest/rating/clubs", // /{clubId}
    rateForCaddie               : MygolfServer + "/rest/rating/caddies", // /{caddieId} &playerId, rating
    getClubRatingItems          : MygolfServer + "/rest/rating/club-rating-items",
    moveFlightSlot              : MygolfServer + "/rest/tee-time/course-starter/move-slot", // bookingId&teeOffDate&slotNo
    swapFlightSlot              : MygolfServer + "/rest/tee-time/course-starter/swap-slots", //firstBookingId=&secondBookingId=
    getBookingStats             : MygolfServer + "/rest/tee-time/stats/club-flight-stat", //clubId
    getBookStatPlayerInfo       : "/with-player-info", //to be use with getBookingStats
    getCourseUtilStats          : MygolfServer + "/rest/tee-time/stats/course-utilization", //clubId
    getCaddyBuggyStats          : MygolfServer + "/rest/tee-time/stats/caddie-buggy-utilization", //clubId
    getCaddyBuggyDayStats       : MygolfServer + "/rest/tee-time/stats/caddie-buggy-statistics", //clubId
    getFutureStats              : MygolfServer + "/rest/tee-time/stats/future-revenue", //clubId
    clubCapturePayment          : MygolfServer + "/rest/tee-time/club/booking/capture-payment",

    //discounts and vouchers
    bookingApplyVoucher         : MygolfServer + "/rest/tee-time/booking/apply-voucher", // bookingId&voucherId&force(def=false)
    listActiveDiscounts         : MygolfServer + "/rest/discount/club-active-discounts", // clubId*&effectiveDate
    listClubDiscountProgram     : MygolfServer + "/rest/discount/club-discount-program", // clubId&programId
    listActiveClubPlayerVouchers: MygolfServer + "/rest/discount/vouchers/active-player-club-vouchers", //clubId & playerId
    listClubDiscounts           : MygolfServer + "/rest/discount/club-discounts", //clubId* & search & pageSize(def=30) & pageNo(def=1)
    getDiscount                 : MygolfServer + "/rest/discounts", // /discountId
    listDiscountCompanies       : MygolfServer + "/rest/discount/companies", //search & pageSize(def=30) & pageNo(def=1)
    listClubVoucherSeries       : MygolfServer + "/rest/discount/vouchers/series", //clubId*&search&pageSize(def=30)&pageNo(def=1)
    assignClubPlayerVoucher     : MygolfServer + "/rest/discount/vouchers/assign", //clubId*&playerId*&voucherSeriesId*&numberOfVouchers*&validFrom
    listActivePlayerVouchers    : MygolfServer + "/rest/discount/vouchers/active-player-vouchers", //clubId & playerId
    unassignClubPlayerVoucher   : MygolfServer + "/rest/discount/vouchers/unassign", //clubId*&playerId*&[voucherIds]*
    listDiscountPrograms        : MygolfServer + "/rest/discount/programs", // companyId*
    
    //paramter with * is required
    // def is default
    //refund
    setRefundBookingPlayer      : MygolfServer + "/rest/tee-time/booking/refund", // bookingId*&playerId*&amount*&refundMode(def=CASH|BTRF|CLBC|M2UC)&reason*
    applyPlayerBookingVoucher   : MygolfServer + "/rest/tee-time/booking/apply-voucher", //bookingId*&voucherId*&force(def=false)
    removePlayerBookingVoucher  : MygolfServer + "/rest/tee-time/booking/remove-voucher", //bookingId*&voucherId*
    applyPlayerBookingDiscount  : MygolfServer + "/rest/tee-time/booking/apply-discount", //bookingId*&discountId*
    removePlayerBookingDiscount : MygolfServer + "/rest/tee-time/booking/remove-discount", //bookingId*&discountId*
    getClubApplicablePlayerTypes: MygolfServer + "/rest/tee-time/player-types", //clubId*&playerId*&effectiveDate
    createPlayerDiscountCard    : MygolfServer + "/rest/discount/program/create-player-discount", //playerId*&programId*&membershipNo&validFrom&validUntil
    getPlayerCredits            : MygolfServer + "/rest/player/list-credits", //playerId*
    getPlayerClubCredits        : MygolfServer + "/player/club-credit", //playerId*&clubId* 

    // listPlayerDiscountCardApplications  : 
    listClubVouchersIssued      : MygolfServer + "/rest/discount/vouchers/list-vouchers-issued", //clubId*&seriesId&search&includeRedeemed(false)&includeExpired(false)&pageSize(30)&pageNo(1)
    listPlayerDiscountPrograms  : MygolfServer + "/rest/discount/program/player-discount-programs", //playerId*
    deletePlayerDiscountCard    : MygolfServer + "/rest/discount/program/delete-player-discount", //playerDiscountId*
    approvePlayerDiscountCard   : MygolfServer + "/rest/discount/program/approve-player-discount", //playerId*&programId*&clubId*&validFrom&validUntil
    applyForClubVerifyDiscountCard : MygolfServer + "/rest/discount/program/apply-for-club-verification", //playerId*&programId*&clubId
    removeCardClubApplication : MygolfServer + "/rest/discount/program/delete-club-application", //{clubId}?playerDiscountId=<id>
    redeemClubCredit            : MygolfServer + "/rest/tee-time/booking/redeem-club-credit", //bookingId*&playerId*&amount*
    listAllCardApplyForPlayer   : MygolfServer + "/rest/discount/program/list-player-discount-card-applications", //playerId*&programId*&pendingOnly(false)&includeExpired(false)
    listAllPlayersCardDiscount  : MygolfServer + "/rest/discount/program/list-club-discount-card-applications", //clubId*&programId*&pendingOnly(false)&includeExpired(false)
    getApplicableDiscountsForPlayer : MygolfServer + "/rest/discount/applicable", //clubId*&playerId*&effectiveDate
    approveMultiPlayerDiscountCard  : MygolfServer + "/rest/discount/program/approve-player-discounts", //playerId*&programId*&clubId*&validFrom&validUntil
    listDiscountProgramsClub    : MygolfServer + "/rest/discount/programs/clubs", // programId*&search&pageSize(30)&pageNo(1)
    undoApprovePlayerDiscountCard   : MygolfServer + "/rest/discount/program/undo-approve-player-discount", //playerId*&programId*&clubId*&\
    updatePlayerDiscountDocument    : MygolfServer + "/rest/discount/program/update-player-discount-document", //id*
    recalculateBookingPricing       : MygolfServer + "/rest/tee-time/booking/trigger-pricing", //bookingId*
    
    listAllSlots                : MygolfServer + "/rest/tee-time/slot/list-from-all-clubs", //playerId*&forDate*&fromTime&toTime
    bookingWaiveOff             : MygolfServer + "/rest/tee-time/booking/waive-off", //bookingId*&amount*&reason
    undoBookingWaiveOff         : MygolfServer + "/rest/tee-time/booking/undo-waive-off", //bookingId*&amount*&reason

    cancelBookingByClub         : MygolfServer + "/rest/tee-time/booking/cancel-by-club", //CancelBookingSpecification
    
    assignBookingPlayerType     :  MygolfServer + "/rest/players/booking-player-types/assign", //playerId*&bookingPlayerType*& {file:string}
    assignableBookingPlayerType     :  MygolfServer + "/rest/players/booking-player-types/assignable", //
    assignedBookingPlayerType       :  MygolfServer + "/rest/players/booking-player-types/assigned", //playerId*
    removeBookingPlayerType     :  MygolfServer + "/rest/players/booking-player-types/remove", //playerId*&bookingPlayerType*&

    listClubMembership : MygolfServer + "/rest/club/members", //clubId*&activeOnly(def=true)&search
    getAvailableCaddieBooking : MygolfServer + "/rest/club/caddy/list-available-caddies/booking", //bookingId*
    getHandicapSystemList   : MygolfServer + "/rest/handicap/handicap-systems",
    getPlayerHcpIdx : MygolfServer + "/rest/handicap/player-handicap-index", //{playerId}?handicapSystem=id
    syncHandicapIndex: MygolfServer + "/rest/handicap/sync-handicap-index", //{playerId}?handicapSystem*=id&playerId*
    getLatestCourseHandicap: MygolfServer + "/rest/handicap/course-handicap/player/", //{playerId**}/{teeBoxName}**?firstNine**&secondNine=
    approveClubMembership   :   "/approve/", //{playerId}
    suspendClubMembership   :   "/suspend/", //{playerId}
    addCaddyUnavailability  : MygolfServer + "/rest/club/caddy/unavailability", // {caddieId*} /create?caddieId*,fromDate*,toDate*
    listCaddyUnavailability : MygolfServer + "/rest/club/caddy/unavailability", //{caddieId*} ?caddieId*,fromDate,toDate
    removeCaddyUnavailability   : MygolfServer + "/rest/club/caddy/unavailability", //{unavailabilityId*}/delete
    displayCaddySchedule    : MygolfServer + "/rest/club/caddy/club-schedule", //path {clubId*}?forDate

    /** LEAGUE APIs
     * 
     */

    getLeagueCompetition : MygolfServer + "/rest/league/competition", //{compId*},
    leagueEclectic      : "/eclectic", //path
    leagueScorecards    : "/scorecards", //path
    leagueLeaderboard   : "/leaderboard", //path
    getLeagueSeason     : "/get-season", //path
    getLeague           : MygolfServer + "/rest/league", //{seasonId*}
    leagueRounds        : "/rounds", //path
    leagueLowestGrossLeaderboard    : "/lowest-gross-leaderboard", //path



    getPlayerMaxBookingCount    :   MygolfServer + "/rest/tee-time/booking", // path {clubId*}/{playerId*}/booking-count
    addBuggyUnavailability  : MygolfServer + "/rest/club/buggy/unavailability", // {buggyId*} /create?buggyId*,fromDate*,toDate*
    listBuggyUnavailability : MygolfServer + "/rest/club/buggy/unavailability", //{buggyId*} ?buggyId*,fromDate,toDate
    removeBuggyUnavailability   : MygolfServer + "/rest/club/buggy/unavailability", //{unavailabilityId*}/delete
    getPaymentMethodList: MygolfServer + "/rest/payment/payment-methods",
    setBookingCancelGuard: "/set-cancel-guard", //{bookingId} ?cancelGuard=false
    
    searchBookingClub: teeTimeBookingBase + "/search-for-club", //{clubId}?statusType
    /**
     * @param clubId - required
     * @param courseId - integer
     * @param fromDate - string
     * @param toDate - string
     * @param statusType | A - Active, I - Inactive, B - Both, C - Custom For custom specify comma separated list of status in statusList
     * Default value : B
     * @param statusList
     * @param search
     * @param pageSize def 20
     * @param pageNo def 1
     */
    searchBookingPlayer: teeTimeBookingBase + "/search-for-player", //{playerId}
    /**
     * @param playerId - required
     * @param clubId
     * @param courseId - integer
     * @param fromDate - string
     * @param toDate - string
     * @param statusType | A - Active, I - Inactive, B - Both, C - Custom For custom specify comma separated list of status in statusList
     * Default value : B
     * @param statusList
     * @param search
     * @param pageSize def 20
     * @param pageNo def 1
     * @param descendingDate (default false)
     */
    refundRedeemForClub: MygolfServer + "/rest/club/refund-redeem", //{clubId}
    refundRedeemForPlayer: MygolfServer + "/rest/player/refund-redeem", //{clubId}
    /**
     * @param playerId* - required
     * @param startDate* - required
     * @param endDate
     * @param include - possible values 'refund', 'redeem' and 'both', default is 'both'
     */
    undoRefundBooking: teeTimeBookingBase + "/undo-refund", //?bookingId*&refundInstanceId*
    undoCancelBooking: teeTimeBookingBase + "/undo-cancel", //?bookingId*
    updateNinesBooking: teeTimeBookingBase + "/change-nines", //?bookingId*&ninesPlayed* (1|2)
}
