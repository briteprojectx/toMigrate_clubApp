/* tslint:disable */
// Generated using typescript-generator version 2.9.456 on 2020-05-20 13:55:50.

import * as global from "../globals";
export interface AddressData {
    id?: number;
    address1?: string;
    address2?: string;
    city?: string;
    postCode?: string;
    state?: string;
    countryData?: CountryData;
    phone1?: string;
    phone2?: string;
    phoneNumbers?: PhoneNumbers;
    fax?: string;
    webSite?: string;
    addressHTML?: string;
    email?: string;
}

export interface AddressInfo {
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    countryId?: string;
    countryName?: string;
    postCode?: string;
    email?: string;
    phone1?: string;
    phone2?: string;
    fax?: string;
    website?: string;
}

export interface AdvertisementData {
    id?: number;
    name?: string;
    company?: string;
    active?: boolean;
    startDate?: Date;
    endDate?: Date;
    displayPeriod?: number;
    rank?: number;
    externalUrl?: string;
    image?: string;
    useIn?: string;
    updateCounter?: number;
}

export interface AuthenticationResult {
    success?: boolean;
    name?: string;
    user?: UserInfo;
    authToken?: string;
    exception?: string;
}

export interface BaseResult {
    success?: boolean;
    message?: string;
}

export interface ClubAnalysis {
    success?: boolean;
    errorMessage?: string;
    clubId?: number;
    clubName?: string;
    clubImage?: string;
    clubTag?: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    description?: string;
    courseAnalysisInfo?: CourseAnalysis[];
}

export interface ClubInfo {
    clubId?: number;
    clubName?: string;
    clubImage?: string;
    clubThumbnail?: string;
    clubLogo?: string;
    clubTag?: string;
    latitude?: number;
    longitude?: number;
    averageRating?: number;
    address?: string;
    description?: string;
    website?: string;
    phone1?: string;
    phone2?: string;
    courses?: CourseInfo[];
    distanceInKm?: number;
    virtualClub?: boolean;
    timeZone?: TimeZoneData;
    countryId?: string;
    countryName?: string;
    country?: CountryData;
}

export interface ClubList extends PagedResult {
    clubs?: ClubInfo[];
}

export interface ClubMembership {
    homeClub?: boolean;
    membershipNumber?: string;
    status?: ClubMembershipStatus;
    clubHandicap?: number;
    club?: ClubInfo;
    player?: PlayerData;
    hcpDetail?: ClubHandicap;
    nhsHcpDetail?: ClubHandicap;
}

export interface Country {
    id?: string;
    name?: string;
    iso2Code?: string;
    iso3Code?: string;
    currencyId?: string;
    currencyName?: string;
    currencySymbol?: string;
    sportCode?: string;
    flagUrl?: string;
}

export interface CountryData {
    id?: string;
    name?: string;
    iso2Code?: string;
    iso3Code?: string;
    dialoCode?: string;
    currencyCode?: string;
    currencyName?: string;
    currencySymbol?: string;
    sportCode?: string;
    flagUrl?: string;
}

export interface CourseAnalysis {
    courseId?: number;
    courseName?: string;
    coursePar?: number;
    photoUrl?: string;
    courseHoleAnalysisInfo?: CourseHoleAnalysis[];
}

export interface CourseHoleAnalysis {
    holeId?: number;
    holeNo?: number;
    holePar?: number;
    holeIndex?: number;
    scoreStatistic?: ScoreStatistic;
}

export interface CourseHoleInfo {
    holeId?: number;
    courseHoleNumber?: number;
    holeNo?: number;
    holePar?: number;
    latitude?: number;
    longitude?: number;
    holeDescription?: string;
    holeDistanceBlack?: number;
    holeDistanceBlue?: number;
    holeDistanceRed?: number;
    holeDistanceWhite?: number;
    holeImage?: string;
    holeIndex?: number;
    holeIndexIn?: number;
    holeDistances?: HoleDistance[];
}

export interface CourseInfo {
    courseId?: number;
    displayOrder?: number;
    gameCourseId?: number;
    whichNine?: number;
    courseName?: string;
    coursePar?: number;
    photoUrl?: string;
    thumbnail?: string;
    description?: string;
    indexToUse?: number;
    holes?: CourseHoleInfo[];
    teeBoxes?: TeeBoxData[];
}

export interface CurrencyData {
    id?: string;
    name?: string;
    symbol?: string;
}

export interface DocumentList {
    documents?: string[];
}

export interface ErrorInfo {
    status?: number;
    errorCode?: string;
    errorMessage?: string;
    timestamp?: Date;
}

export interface FlightData {
    sequence?: number;
    flightNumber?: string;
    startHole?: number;
    startTime?: Date;
    actualStartTime?: Date;
    groupName?: string;
    roundSessionId?: number;
    roundSessionSequence?: number;
    competition?: CompetitionData;
    gameRound?: GameRoundData;
    flightMembers?: PlayerInFlightData[];
    gender?: string;
    minHandicap?: number;
    maxHandicap?: number;
}

export interface FriendRequest {
    requestByPlayer?: boolean;
    player?: PlayerInfo;
}

export interface FriendRequestList extends PagedResult {
    friendRequests?: FriendRequest[];
}

export interface GameRoundCourseData {
    id?: number;
    name?: string;
    whichNine?: number;
    indexSetToUse?: number;
    course?: ClubCourseData;
}

export interface GameRoundData {
    id?: number;
    name?: string;
    roundNo?: number;
    description?: string;
    roundDate?: Date;
    roundDateTime?: Date;
    status?: string;
    deriveHandicap?: boolean;
    createdOn?: Date;
    createdBy?: string;
    club?: ClubData;
    gameRoundCourses?: GameRoundCourseData[];
}

export interface GameRoundInfo {
    id?: number;
    roundNo?: number;
    roundDate?: Date;
    status?: GameRoundStatus;
    inProgress?: boolean;
    nextRound?: boolean;
    courseNames?: string[];
    netTotal?: number;
    grossTotal?: number;
    netPosition?: number;
    grossPosition?: number;
    publishFlights?: boolean;
}

export interface HoleDistance {
    teebox?: string;
    distance?: number;
    unit?: string;
}

export interface ItemRating {
    itemId?: string;
    rating?: number;
}

export interface Location {
    id?: number;
    countryId?: string;
    countryName?: string;
    state?: string;
    city?: string;
}

export interface LocationData {
    name?: string;
    latitude?: number;
    longitude?: number;
}

export interface OfflinePayment {
    currency?: string;
    paidByName?: string;
    paidByEmail?: string;
    paidByPhone?: string;
    paymentMethod?: string;
    amount?: number;
    remarks?: string;
}

export interface OrganizerInfo {
    organizerId?: number;
    registrationNumner?: string;
    name?: string;
    shortName?: string;
    description?: string;
    dateJoined?: Date;
    status?: string;
    organizerImage?: string;
    addressInfo?: AddressInfo;
    clubId?: number;
    contactPerson?: string;
    createdOn?: Date;
    createdBy?: string;
}

export interface OrganizerList extends PagedResult {
    organizers?: OrganizerInfo[];
}

export interface PagedData<T> {
    items?: T[];
    totalPages?: number;
    currentPage?: number;
    totalItems?: number;
    totalInPage?: number;
    success?: boolean;
    errorMessage?: string;
}

export interface PagedResult {
    totalPages?: number;
    currentPage?: number;
    totalItems?: number;
    totalInPage?: number;
    success?: boolean;
    errorMessage?: string;
}

export interface PaymentBillInfo {
    bill?: number;
    collection?: number;
    paid?: string;
    state?: string;
    status?: string;
    amount?: number;
    email?: string;
    mobile?: string;
    name?: string;
    deliver?: string;
    url?: string;
    currency?: string;
    description?: string;
    signature?: string;
    html?: string;
    id?: string;
    collection_id?: string;
    paid_amount?: number;
    due_at?: Date;
    payement_method?: string;
    payment_gateway?: string;
    reference_1_label?: string;
    reference_1?: string;
    reference_2_label?: string;
    reference_2?: string;
    remark?: string;
    redirect_url?: string;
    callback_url?: string;
    payment_type?: string;
    payer_type?: string;
    paid_by?: number;
    paying_player_name?: string;
    paying_player_email?: string;
    paying_player_phone?: string;
    paid_at?: Date;
    created_on?: Date;
    updated_on?: Date;
    paid_for?: PaymentPlayerInfo[];
    bill_type?: string;
    bill_type_id?: number;
    error_desc?: string;
    auth_code?: string;
    credit_card_name?: string;
    credit_card_no?: string;
    credit_card_bank?: string;
    credit_card_country?: string;
    merchant_code?: string;
    merchant_key?: string;
    api_key?: string;
    "x-signature"?: string;
    payment_id?: string;
}

export interface PaymentBillList extends PagedResult {
    paymentBills?: PaymentBillInfo[];
}

export interface PaymentCollectionInfo {
    collection?: number;
    title?: string;
    type?: string;
    description?: string;
    amount?: number;
    tax?: number;
    photo?: PaymentPhotoInfo;
    logo?: PaymentLogoInfo;
    splitPayment?: PaymentSplitInfo[];
    status?: string;
    url?: string;
    competition_id?: number;
    club_id?: number;
    premium_feature_pricing_id?: number;
    id?: string;
    reference_1_label?: string;
    reference_2_label?: string;
    email_link?: string;
    fixed_amount?: string;
    fixed_quantity?: string;
    payment_button?: string;
    created_by?: number;
    created_on?: Date;
}

export interface PaymentCollectionList extends PagedResult {
    paymentCollections?: PaymentCollectionInfo[];
}

export interface PaymentGatewayInfo {
    id?: string;
    type?: string;
    name?: string;
    description?: string;
    country_id?: string;
    currency_id?: string;
    http_server?: string;
    api_key?: string;
    x_signature?: string;
    merchant_code?: string;
    merchant_key?: string;
    callback_url?: string;
    redirect_url?: string;
    payment_url?: string;
    internal_payment_url?: string;
    signature_algorithm?: string;
    signature_format?: string;
}

export interface PaymentGatewayStatementDetail {
    reference?: string;
    paymentDate?: Date;
    amount?: number;
    paymentMethod?: string;
    discount?: number;
    gatewayCommission?: number;
    otherCommission?: number;
    gst?: number;
    paidByGateway?: number;
}

export interface PaymentLogoInfo {
    thumb_url?: string;
    avatar_url?: string;
}

export interface PaymentMethod {
    id?: string;
    name?: string;
}

export interface PaymentMethods {
}

export interface PaymentPhotoInfo {
    retina_url?: string;
    avatar_url?: string;
}

export interface PaymentPlayerInfo {
    player_id?: number;
}

export interface PaymentSplitInfo {
    email?: string;
    fixed_cut?: number;
    variable_cut?: number;
    split_header?: string;
}

export interface PaymentTestInfo {
    id?: string;
    amount?: number;
    my_message?: string;
    paid_date?: Date;
    paid_days?: number;
    ref_no?: string;
    payment_gateway?: string;
}

export interface PhoneNumbers {
    numbers?: string[];
    primaryNumber?: string;
}

export interface PlainScoreCard extends BaseResult {
    competition?: boolean;
    competitionId?: number;
    competitionName?: string;
    competitionRound?: string;
    scoringFormat?: string;
    clientId?: string;
    finished?: boolean;
    lockedBy?: string;
    editable?: boolean;
    scoringFinished?: boolean;
    gameRoundId?: number;
    roundNumber?: number;
    clubId?: number;
    clubName?: string;
    playedOn?: string; //Date;
    startTime?: string;
    flightNumber?: string;
    participants?: string;
    courseNames?: string;
    startingHole?: number;
    fullInfo?: boolean;
    flightChanged?: boolean;
    courses?: CourseInfo[];
    playerRoundScores?: PlayerRoundScores[];
    frontNineTotal?: number;
    backNineTotal?: number;
    totalScore?: number;
    playerTotals?: string;
    roundDateTime?: Date;
    currentHole?: number;
    
    dirty?: boolean;
}

export interface PlayerCategoryData {
    id?: number;
    name?: string;
    displaySequence?: number;
    forGrouping?: boolean;
    fromHandicap?: number;
    toHandicap?: number;
    gender?: string;
}

export interface PlayerInFlightData {
    id?: number;
    groupName?: string;
    startingHole?: number;
    player?: PlayerData;
    team?: TeamData;
    buggy?: string;
    scorer?: PlayerData;
    handicap?: number;
    handicapIndex?: number;
    handicapStatus?: string;
    status?: PlayerRoundStatus;
    keepFlight?: boolean;
    actualStartTime?: Date;
    ocbApplication?: OcbAppliedData;
    categoryOcbApplication?: OcbAppliedData;
    teeBox?: TeeBoxData;
    playerTotals?: PlayerTotalData[];
    scores?: PlayerScoreData[];
    completed?: boolean;
    inProgress?: boolean;
    withdrawn?: boolean;
    pending?: boolean;
}

export interface PlayerScoreData {
    id?: number;
    course?: GameRoundCourseData;
    hole?: ClubCourseHoleData;
    holeNo?: number;
    actualScore?: number;
    adjustedScore?: number;
    netScore?: number;
    parScore?: number;
    pointScore?: number;
    holeIndex?: number;
    remarks?: string;
}

export interface PlayerTotalData {
    whichNine?: number;
    grossTotal?: number;
    netTotal?: number;
}

export interface PlayerGroup {
    id?: number;
    groupName?: string;
    players?: PlayerInfo[];
}

export interface PlayerGroupList extends PagedResult {
    playerGroups?: PlayerGroup[];
}

export interface PlayerHomeInfo {
    playerId?: number;
    playerName?: string;
    totalScoreCards?: number;
    totalFriends?: number;
    activeCompetitions?: number;
    error?: boolean;
    errorMessage?: string;
    player?: PlayerInfo;
    testUser?: boolean;
    compsActiveToday?: CompetitionInfo[];
}

export interface PlayerInfo {
    userId?: number;
    playerId?: number;
    playerName?: string;
    firstName?: string;
    lastName?: string;
    nickName?: string;
    email?: string;
    phone?: string;
    handicap?: number;
    handicapIndex?: number;
    mygolfHandicapIndex?: number;
    handicapIn?: string;
    gender?: string;
    countryId?: string;
    countryName?: string;
    sportCode?: string;
    flagUrl?: string;
    photoUrl?: string;
    thumbnail?: string;
    dateJoined?: Date;
    birthdate?: Date;
    friendSince?: Date;
    teeOffFrom?: string;
    nhsNumber?: string;
    status?: string;
    errorMessage?: string;
    addressInfo?: AddressInfo;
    allowEdit?: boolean;
    membership?: string;
    nationalityId?: string;
    nationalityName?: string;
    nationalityFlag?: string;
    id?: number;
}

export interface PlayerList extends PagedResult {
    players?: PlayerInfo[];
}

export interface PlayerPerformance {
    success?: boolean;
    errorMessage?: string;
    bestScore?: number;
    totalGrossScore?: number;
    totalScorecards?: number;
    averageScore?: number;
    playerPerformances?: PlayerPerformanceInfo[];
}

export interface PlayerPerformanceDetail {
    success?: boolean;
    errorMessage?: string;
    scoreStatistic?: ScoreStatistic;
    playerPerformanceDetails?: PlayerPerformanceDetailInfo[];
}

export interface PlayerPerformanceDetailInfo {
    gameRoundId?: number;
    playeRoundId?: number;
    gameType?: string;
    competitionId?: number;
    roundNo?: number;
    firstNineCourseName?: string;
    secondNineCourseName?: string;
    roundDate?: Date;
    inTotalGross?: number;
    outTotalGross?: number;
    totalGross?: number;
    inTotalNet?: number;
    outTotalNet?: number;
    totalNet?: number;
}

export interface PlayerPerformanceInfo {
    score?: number;
}

export interface PlayerRegistrationResult {
    success?: boolean;
    email?: string;
    userId?: number;
    playerId?: number;
    errorMessage?: string;
}

// export interface PlayerRoundScores {
//     playerRoundId?: number;
//     playerId?: number;
//     playerName?: string;
//     nickName?: string;
//     teamName?: string;
//     gender?: string;
//     photoUrl?: string;
//     thumbnail?: string;
//     teeOffFrom?: string;
//     playerHandicap?: number;
//     courseRating?: number;
//     slopeRating?: number;
//     scoringPlayerId?: number;
//     scorerName?: string;
//     frontNineTotal?: number;
//     backNineTotal?: number;
//     totalScore?: number;
//     diffGrossToPar?: number;
//     status?: string;
//     startTime?: Date;
//     actualStartTime?: Date;
//     frontNineNetTotal?: number;
//     backNineNetTotal?: number;
//     totalNetScore?: number;
//     totalNetAdjustedScore?: number;
//     diffNetToPar?: number;
//     scores?: PlayerScore[];
//     totals?: PlayerTotals[];

// }

export interface PlayerScore {
    scorecardId?: number;
    whichNine?: number;
    gameCourseId?: number;
    courseHoleId?: number;
    courseId?: number;
    holeNumber?: number;
    courseName?: string;
    holeIndex?: number;
    parScore?: number;
    actualScore?: number;
    netScore?: number;
    adjustedScore?: number;
}

export interface PlayerTotals {
    whichNine?: number;
    grossTotal?: number;
    netTotal?: number;
}

export interface PriceComponent {
    id?: string;
    name?: string;
    description?: string;
}

export interface RatingItem {
    id?: string;
    name?: string;
    description?: string;
}

export interface Ratings<T> {
    startDate?: Date;
    endDate?: Date;
    averageRating?: number;
    ratings?: T[];
}

export interface RefundInstance {
    id?: number;
    createdOn?: Date;
    refundAmount?: number;
    description?: string;
    clubRefund?: boolean;
    refundMode?: RefundMode;
    playerRefunded?: PlayerData;
    club?: ClubData;
    refundIssuedBy?: UserAuthentication;
    booking?: TeeTimeBooking;
    transaction?: ClubTransaction;
}

export interface Result extends BaseResult {
}

export interface ScoreStatistic {
    albatros?: number;
    eagle?: number;
    birdie?: number;
    par?: number;
    bogey?: number;
    bogey2?: number;
    bogey3?: number;
    worse?: number;
    totalScore?: number;
    totalRound?: number;
    average?: number;
}

export interface ScorecardList extends PagedResult {
    scorecards?: Array<PlainScoreCard>;//[];
}

export interface ScoringFormatData {
    id?: number;
    name?: string;
    adjustmentFactor?: number;
    usedFor?: string;
    description?: string;
    createdOn?: Date;
    createdBy?: string;
}

export interface SearchCriteria {
    searchType?: string;
    onlyParticipating?: boolean;
    onlyFavorites?: boolean;
    searchWithinDistance?: boolean;
    maxDistance?: number;
    clubsWithMembership?: boolean;
    searchText?: string;
    periodLength?: number;
    periodType?: string;
    countryId?: string;
}

export interface ServerInfo {
    minClientVersion?: number;
    maxClientVersion?: number;
    pushServerInfo?: PushServerInfo;
    showAds?: boolean;
    adUrls?: string[];
    webSocketPort?: number;
    botsOut?: boolean;
    enablePlayerAppBooking?: boolean;
    hidxRequiresSubscription?: boolean; 
    /**
    @param hidxRequiresSubscription for server info
    */
}

export interface SponsorData {
    id?: number;
    name?: string;
    registerNo?: string;
    status?: string;
    contactEmail?: string;
    contactPerson?: string;
    image?: string;
    description?: string;
    createdBy?: string;
    createdOn?: Date;
    dateJoined?: Date;
    address?: AddressData;
    organizer?: OrganizerData;
    country?: CountryData;
}

export interface SponsorInfo {
    id?: string;
}

export interface TeamData {
    id?: number;
    name?: string;
    logo?: string;
    description?: string;
    teamCaptain?: PlayerData;
    club?: ClubData;
}

export interface TeeBoxData {
    id?: number;
    name?: string;
    image?: string;
    description?: string;
}

export interface TimeZoneData {
    id?: string;
    name?: string;
    usesDaylight?: boolean;
    offsetMinutesUtc?: number;
    offsetSpec?: string;
}

export interface UserInfo {
    userId?: number;
    userName?: string;
    password?: string;
    name?: string;
    userType?: UserType;
    admin?: boolean;
    clubId?: number;
    playerId?: number;
    organizerId?: number;
    caddieId?: number;
    roles?: string[];
}

export interface ValidationResult {
    valid?: boolean;
    validationMessage?: string;
}

export interface Advertisement {
    id?: number;
    name?: string;
    companyName?: string;
    active?: boolean;
    startDate?: Date;
    endDate?: Date;
    displayPeriod?: number;
    rank?: number;
    useIn?: string;
    externalUrl?: string;
    imageUrl?: string;
    updateCounter?: number;
    autoInclude?: boolean;
}

export interface AdvertisementList extends PagedResult {
    advertisements?: Advertisement[];
}

export interface Availability {
    availableOn?: Date;
    available?: boolean;
    weeklyHoliday?: boolean;
    reason?: string;
}

export interface BuggyAssignment {
    id?: number;
    assignmentDate?: Date;
    assignmentStart?: Date;
    assignmentEnd?: Date;
    totalMinutes?: number;
    flightAssigned?: TeeTimeFlight;
}

export interface BuggyData extends IAvailableOnDay {
    id?: number;
    buggyNo?: string;
    name?: string;
    properties?: string;
    physicalId?: string;
    dateStart?: Date;
    maintenanceDate?: Date;
    make?: string;
    model?: string;
    status?: string;
    buggyImage?: string;
    buggyQCode?: string;
    description?: string;
    lastAssigned?: Date;
    lastCompleted?: Date;
    availabilityDays?: { [index: string]: boolean };
}

export interface BuggyDayDetails {
    date?: Date;
    buggy?: BuggyData;
    assignments?: BuggyAssignment[];
    maxShifts?: number;
    active?: boolean;
}

export interface CaddieRating {
    id?: number;
    player?: PlayerData;
    rating?: number;
    ratedOn?: Date;
    review?: string;
    playerName?: string;
    assignment?: CaddyAssignment;
}
export interface BuggyUnavailability {
    id?: number;
    startDate?: Date;
    endDate?: Date;
    remarks?: string;
}

export interface CaddyAssignment {
    id?: number;
    assignmentDate?: Date;
    assignmentStart?: Date;
    assignmentEnd?: Date;
    totalMinutes?: number;
    flightAssigned?: TeeTimeFlight;
    timeBooking?: TeeTimeBooking;
}

export interface CaddyData extends IAvailableOnDay {
    id?: number;
    firstName?: string;
    lastName?: string;
    nickName?: string;
    gender?: string;
    staffId?: string;
    identificationNo?: string;
    dateOfBirth?: Date;
    dateJoined?: Date;
    club?: ClubData;
    nationality?: CountryData;
    caddyImage?: string;
    caddyQcode?: string;
    description?: string;
    status?: string;
    averageRating?: number;
    grade?: CaddyGrade;
    authentication?: UserAuthentication;
    lastAssigned?: Date;
    lastCompleted?: Date;
    availabilityDays?: { [index: string]: boolean };
}

export interface CaddyDayDetails {
    date?: Date;
    caddy?: CaddyData;
    assignments?: CaddyAssignment[];
    maxShifts?: number;
    present?: boolean;
}

export interface CaddyGrade {
    id?: number;
    name?: string;
    price?: number;
}

export interface ClubAgreement {
    club?: ClubData;
    bookingClubChargeType?: AmountType;
    bookingClubCharge?: number;
    bookingPlayerChargeType?: AmountType;
    bookingPlayerCharge?: number;
    documents?: DocumentList;
    competitionCharge?: number;
    competitionRegistrationFee?: number;
    registrationFeeType?: AmountType;
    reconPeriod?: Period;
}

export interface ClubBank {
    id?: number;
    name?: string;
    branch?: string;
    accountNo?: string;
    swiftCode?: string;
    referenceNo?: string;
    routingNo?: string;
    primaryAccount?: boolean;
    address?: AddressData;
    club?: ClubData;
}

export interface ClubCaddieSchedule {
    flightTime?: Date;
    bookingReference?: string;
    staffId?: string;
    identificationNo?: string;
    caddieImage?: string;
    caddieName?: string;
    caddieId?: number;
    buggyNo?: string;
    remarks?: string;
    status?: string;
}
export interface CaddyUnavailability {
    id?: number;
    startDate?: Date;
    endDate?: Date;
    remarks?: string;
}

export interface ClubCourseData {
    id?: number;
    name?: string;
    type?: number;
    par?: number;
    rating?: number;
    slope?: number;
    description?: string;
    courseImage?: string;
    courseThumbnail?: string;
    shortCode?: string;
    displayOrder?: number;
    holes?: ClubCourseHoleData[];
    teeBoxes?: TeeBoxData[];
}

export interface ClubCourseHoleData {
    id?: number;
    holeNo?: number;
    par?: number;
    indexOut?: number;
    indexIn?: number;
    latitude?: number;
    longitude?: number;
    description?: string;
    distanceBlack?: number;
    distanceBlue?: number;
    distanceRed?: number;
    distanceWhite?: number;
    image?: string;
}

export interface ClubCredit {
    club?: ClubData;
    currency?: CurrencyData;
    balance?: number;
}

export interface ClubData {
    id?: number;
    name?: string;
    registerNo?: string;
    tag?: string;
    description?: string;
    status?: string;
    address?: AddressData;
    contactPerson?: string;
    contactEmail?: string;
    clubImage?: string;
    latitude?: number;
    longitude?: number;
    virtualClub?: boolean;
    timeZone?: TimeZoneData;
    clubThumbnail?: string;
    clubLogo?: string;
    averageRating?: number;
    courses?: ClubCourseData[];
    organizer?: OrganizerData;
}

export interface ClubRating {
    id?: number;
    player?: PlayerData;
    playerName?: string;
    playerEmail?: string;
    playerPhone?: string;
    overallRating?: number;
    ratedOn?: Date;
    review?: string;
    itemizedRatings?: ItemRating[];
}

export interface IAvailableOnDay {
}

export interface NearbyClub {
    location?: LocationData;
    club?: ClubData;
    distanceInKm?: number;
}

export interface PlayerCredit {
    player?: PlayerData;
    currency?: CurrencyData;
    balance?: number;
}

export interface Schedule {
    startDate?: Date;
    endDate?: Date;
    availabilities?: Availability[];
}

export interface Unavailability {
    id?: number;
    startDate?: Date;
    endDate?: Date;
    remarks?: string;
}

export interface AddPlayerRoundData {
    flightNo?: string;
    teeOffTime?: Date;
    holeNo?: number;
    scorerId?: number;
    buggy?: string;
}

export interface CompRoundSessionData {
    id?: number;
    roundId?: number;
    startTime?: Date;
    maxSlots?: number;
    compPlayers?: CompetitionPlayerData[];
    registered?: number;
}

export interface CompetitionAdData {
    advertisement?: AdvertisementData;
    displayPeriod?: number;
    rank?: number;
}

export interface CompetitionCategory {
    sequence?: number;
    categoryId?: number;
    categoryName?: string;
    gender?: string;
    forGrouping?: boolean;
    fromHandicap?: number;
    toHandicap?: number;
}

export interface CompetitionCategoryData {
    id?: number;
    sequence?: number;
    playerCategory?: PlayerCategoryData;
    createdOn?: Date;
    createdBy?: string;
}

export interface CompetitionData {
    id?: number;
    name?: string;
    description?: string;
    image?: string;
    startDate?: Date;
    endDate?: Date;
    publishDate?: Date;
    openDate?: Date;
    closeDate?: Date;
    fee?: number;
    totalPrize?: number;
    rules?: string;
    tieBreaker?: string;
    maxPlayers?: number;
    totalRounds?: number;
    totalHoles?: number;
    type?: string;
    multiplePrizes?: boolean;
    scoringFormat?: ScoringFormatData;
    handicapFormat?: ScoringFormatData;
    teeBoxMen?: TeeBoxData;
    teeBoxWomen?: TeeBoxData;
    status?: string;
    createdOn?: Date;
    createdBy?: string;
    allowGps?: boolean;
    considerScoreType?: string;
    autoStart?: number;
    maxMaleHandicap?: number;
    maxFemaleHandicap?: number;
    underParCap?: number;
    showLeaderBoard?: boolean;
    allowChangeScorer?: boolean;
    privateCompetition?: boolean;
    teamEvent?: boolean;
    downloadHandicap?: boolean;
    topNPlayersToConsider?: number;
    paymentMandatory?: boolean;
    paymentUrl?: string;
    handicapIndexPreference?: string;
    club?: ClubData;
    organizer?: OrganizerData;
    gameRounds?: GameRoundData[];
    categories?: CompetitionCategoryData[];
    prizes?: CompetitionPrizeData[];
    sponsors?: CompetitionSponsorData[];
    players?: CompetitionPlayerData[];
    advertisements?: CompetitionAdData[];
    ocbs?: CompetitionOcbData[];
}

export interface CompetitionDetails {
    nextRound?: number;
    roundInProgress?: number;
    paymentMandatory?: boolean;
    paymentUrl?: string;
    categories?: CompetitionCategory[];
    players?: CompetitionPlayerInfo[];
    prizes?: CompetitionPrizeInfo[];
    teamPrizes?: CompetitionPrizeInfo[];
    sponsors?: CompetitionSponsorInfo[];
    gameRounds?: GameRoundInfo[];
    totalNet?: number;
    totalGross?: number;
    netPosition?: number;
    grossPosition?: number;
    totalTeams?: number;
}

export interface CompetitionInfo {
    competitionId?: number;
    competitionName?: string;
    description?: string;
    allowGps?: boolean;
    showLeaderBoard?: boolean;
    allowChangeScorer?: boolean;
    considerTopN?: number;
    considerScoreType?: string;
    rules?: string;
    startDate?: Date;
    endDate?: Date;
    publishDate?: Date;
    openDate?: Date;
    closeDate?: Date;
    closedForRegistration?: boolean;
    status?: string;
    totalRounds?: number;
    imageUrl?: string;
    thumbnail?: string;
    type?: string;
    registered?: boolean;
    maxPlayers?: number;
    totalRegistered?: number;
    clubName?: string;
    clubId?: number;
    organizerId?: number;
    organizerName?: string;
    clubTag?: string;
    scoringFormat?: string;
    fee?: number;
    totalPrize?: number;
    totalHoles?: number;
    countryId?: string;
    countryName?: string;
    private?: boolean;
    teamEvent?: boolean;
}

export interface CompetitionList extends PagedResult {
    competitions?: CompetitionInfo[];
}

export interface CompetitionOcbData {
    id?: number;
    roundInfo?: CompetitionRoundData;
    sequence?: number;
    ocb?: OcbData;
    details?: string;
    status?: string;
    scoreType?: string;
    ocbType?: string;
    createdBy?: string;
    createdOn?: Date;
}

export interface CompetitionPlayerData {
    id?: number;
    player?: PlayerData;
    category?: PlayerCategoryData;
    teeBox?: TeeBoxData;
    status?: CompetitionPlayerStatus;
    paymentMade?: boolean;
    paymentDate?: Date;
    paymentVia?: string;
    paymentRef?: string;
    paymentAmount?: number;
    nhsHandicap?: number;
    handicap?: number;
    handicapIndex?: number;
    netTotal?: number;
    grossTotal?: number;
    netPosition?: number;
    grossPosition?: number;
    createOn?: Date;
    createdBy?: string;
    ocbApplication?: OcbAppliedData;
    ocbCategoryApplication?: OcbAppliedData;
    clubMemberAccount?: string;
}

export interface CompetitionPlayerInfo {
    playerId?: number;
    playerName?: string;
    handicap?: number;
    photoUrl?: string;
    category?: string;
    playerStatus?: CompetitionPlayerStatus;
    memberAccount?: string;
    countryId?: string;
    countryName?: string;
    sportCode?: string;
    flagUrl?: string;
    teeBox?: TeeBoxData;
    nationalityId?: string;
    nationalityName?: string;
    nationalFlag?: string;
    nationalSportCode?: string;
}

export interface CompetitionPrizeData {
    id?: number;
    category?: PlayerCategoryData;
    roundInfo?: CompetitionRoundData;
    order?: number;
    prizePosition?: number;
    prize?: PrizeData;
    winnerData?: PrizeWinnerData;
}

export interface CompetitionPrizeInfo {
    categoryName?: string;
    categoryDisplaySequence?: number;
    prizeMoney?: number;
    title?: string;
    order?: number;
    prizePosition?: number;
    prizeName?: string;
    roundNumber?: number;
    scoreType?: string;
    teamPrize?: boolean;
    playerMon?: string;
    playerPos?: string;
    teamMon?: string;
    teamPos?: string;
}

export interface CompetitionRoundData {
    roundId?: number;
    roundNo?: number;
    status?: GameRoundStatus;
}

export interface CompetitionSearchCriteria {
    searchType?: string;
    onlyParticipating?: boolean;
    searchWithinDistance?: boolean;
    maxDistance?: number;
    clubsWithMembership?: boolean;
    searchText?: string;
    periodLength?: number;
    periodType?: string;
}

export interface CompetitionSponsorData {
    id?: number;
    sponsorship?: string;
    status?: string;
    createdBy?: string;
    createdOn?: Date;
    image?: string;
    sponsorDate?: Date;
    sponsor?: SponsorData;
}

export interface CompetitionSponsorInfo {
    sponsor?: SponsorData;
    imageUrl?: string;
    sponsorDate?: Date;
    sponsorship?: string;
    status?: string;
}

export interface CompetitionStatusData {
    competitionId?: number;
    competitionName?: string;
    description?: string;
    allowGps?: boolean;
    showLeaderBoard?: boolean;
    allowChangeScorer?: boolean;
    considerTopN?: number;
    considerScoreType?: string;
    rules?: string;
    startDate?: Date;
    endDate?: Date;
    publishDate?: Date;
    openDate?: Date;
    closeDate?: Date;
    closedForRegistration?: boolean;
    status?: string;
    totalRounds?: number;
    imageUrl?: string;
    thumbnail?: string;
    type?: string;
    registered?: boolean;
    maxPlayers?: number;
    totalRegistered?: number;
    clubName?: string;
    clubId?: number;
    organizerId?: number;
    organizerName?: string;
    clubTag?: string;
    scoringFormat?: string;
    fee?: number;
    totalPrize?: number;
    totalHoles?: number;
    autoStart?: number;
    private?: boolean;
    teamEvent?: boolean;
}

export interface FlightGenerationOption {
    competition?: number;
    playerOrderBy?: string;
    genderSeparation?: boolean;
    flightSize?: number;
    startTime?: string;
    minsApart?: number;
    flightType?: FlightType;
    retainGroups?: boolean;
    cutoffRounds?: number[];
    beyond18Holes?: number[];
    advanceType?: PlayerAdvanceType;
    cutOffScore?: number;
    topNPlayers?: number;
    scoreToUse?: string;
    playersPerBuggy?: number;
    scorerType?: ScorerType;
    scorerSwapType?: ScorerSwapType;
    maxSameTeamPlayers?: number;
    flightTeam?: boolean;
}

export interface FlightInfo {
    flightNumber?: string;
    startTime?: Date;
    startHole?: number;
    groupName?: string;
    playerFlight?: boolean;
    flightMembers?: FlightMember[];
}

export interface FlightMember {
    playerId?: number;
    playerName?: string;
    photoUrl?: string;
    handicap?: number;
    buggy?: string;
    status?: PlayerRoundStatus;
    scorer?: boolean;
    playerCount?: number;
    scoringPlayerId?: number;
    scoringPlayerName?: string;
    teeBox?: TeeBoxData;
}

export interface LeaderBoard {
    competionName?: string;
    firstNineCourseName?: string;
    secondNineCourseName?: string;
    totalPages?: number;
    currentPage?: number;
    totalInPage?: number;
    success?: boolean;
    errorMessage?: string;
    players?: LeaderBoardPlayer[];
}

export interface LeaderBoardPlayer {
    playerId?: number;
    position?: string;
    playerName?: string;
    firstName?: string;
    imageURL?: string;
    handicap?: number;
    toPar?: number;
    parCap?: number;
    round1Gross?: number;
    round2Gross?: number;
    round3Gross?: number;
    round4Gross?: number;
    round1Net?: number;
    round2Net?: number;
    round3Net?: number;
    round4Net?: number;
    outTotalGross?: number;
    inTotalGross?: number;
    totalGross?: number;
    actualTotalGross?: number;
    outTotalNet?: number;
    inTotalNet?: number;
    totalNet?: number;
    actualTotalNet?: number;
    totalNetAdj?: number;
    modifiedTotalNet?: number;
    onHole?: string;
    thru?: string;
    ocb?: string;
    startTime?: Date;
    countryId?: string;
    sportCode?: string;
    flagUrl?: string;
    lastName?: string;
}

export interface LeaderBoardTeam {
    teamId?: number;
    position?: string;
    teamName?: string;
    imageURL?: string;
    handicap?: number;
    toPar?: number;
    parCap?: number;
    totalGross?: number;
    totalNet?: number;
    modifiedTotalNet?: number;
    onHole?: string;
}

export interface OcbAppliedData {
    ocbGross?: boolean;
    ocbGrossDetails?: string;
    ocbNet?: boolean;
    ocbNetDetails?: string;
}

export interface OcbData {
    id?: number;
    name?: string;
    details?: string;
    status?: string;
    ocbType?: string;
    createdBy?: string;
    createdOn?: Date;
}

export interface PlayerScoreInfo {
    playerRoundId?: number;
    playerId?: number;
    playerName?: string;
    flightNumber?: string;
    startingHole?: number;
    buggyNumber?: string;
    scorerId?: number;
    scorerName?: string;
    holesPlayed?: number;
    netScore?: number;
    grossScore?: number;
    submitted?: boolean;
    withdrawn?: boolean;
    lastHoleScored?: number;
    currentHole?: number;
    scores?: { [index: string]: number };
}

export interface PrizeData {
    title?: string;
    prizeName?: string;
    scoreType?: string;
    teamPrize?: boolean;
    prizeMoney?: number;
}

export interface PrizeWinnerData {
    playerWinnerPos?: PlayerData;
    playerWinnerMon?: PlayerData;
    teamWinnerPos?: TeamData;
    teamWinnerMon?: TeamData;
}

export interface TeamInfo {
    teamId?: number;
    teamName?: string;
    description?: string;
    teamLogo?: string;
    playerTeam?: boolean;
    captainName?: string;
    teamPlayers?: TeamPlayerInfo[];
}

export interface TeamList extends PagedResult {
    competitionTeams?: TeamInfo[];
}

export interface TeamPlayerInfo {
    teamPlayerId?: number;
    teamPlayerName?: string;
    handicap?: number;
    status?: string;
    imageURL?: string;
    thumbnailURL?: string;
    gender?: string;
}

export interface AppInfo {
    packageName?: string;
    versionNumber?: string;
    versionCode?: string;
    appName?: string;
}

export interface CompetitionDeviceLock {
    competitionId?: number;
    roundNumber?: number;
    scorerId?: number;
    flightNumber?: string;
    deviceId?: string;
    lockTime?: Date;
    deviceName?: string;
    batteryLevel?: number;
}

export interface DeviceAssignment {
    competitionId?: number;
    roundNumber?: number;
    scorerId?: number;
    deviceId?: string;
    deviceName?: string;
    userTags?: string;
}

export interface DeviceInfo {
    deviceId?: string;
    deviceName?: string;
    virtual?: boolean;
    cordovaVersion?: string;
    platform?: string;
    platformVersion?: string;
    model?: string;
    manufacturer?: string;
    serial?: string;
    userTags?: string;
    ownedBy?: number;
    batterLevel?: number;
    lastActive?: Date;
}

export interface DeviceList extends PagedResult {
    deviceList?: DeviceInfo[];
}

export interface DiscountAudit {
    discountsByPlayer?: DiscountByPlayer[];
}

export interface DiscountByPlayer {
    bookingPlayerId?: number;
    playerId?: number;
    playerName?: string;
    discounts?: DiscountByPricingComponent[];
}

export interface DiscountByPricingComponent {
    pricingComponent?: string;
    amount?: number;
    discount?: number;
}

export interface DiscountCompany {
    id?: string;
    name?: string;
    description?: string;
    address?: AddressData;
    discountPrograms?: DiscountCompanyProgram[];
}

export interface DiscountCompanyProgram {
    id?: string;
    discountCompany?: DiscountCompany;
    name?: string;
    description?: any;
    launchedOn?: Date;
    validFrom?: Date;
    validUntil?: Date;
    amountType?: AmountType;
    discountAmount?: number;
}

export interface DiscountPlayerClub {
    playerDiscountProgram?: PlayerDiscountProgram;
    club?: ClubData;
    teeTimeDiscount?: TeeTimeDiscount;
    verified?: boolean;
    approved?: boolean;
    validFrom?: Date;
    validUntil?: Date;
    dateApplied?: Date;
    dateApproved?: Date;
    approvedBy?: UserAuthentication;
}

export interface DiscountProgramMember {
    programId?: string;
    playerName?: string;
    email?: string;
    gender?: string;
    phone?: string;
    membershipNo?: string;
    validFrom?: Date;
    validUntil?: Date;
    nationality?: string;
    handicapIndex?: number;
    validFromStr?: string;
    validUntilStr?: string;
    sheetIdx?: number;
    rowIdx?: number;
}

export interface DiscountRateByComp {
    pricingComponent?: string;
    amPrice?: number;
    amPriceNineHoles?: number;
    pmPrice?: number;
    pmPriceNineHoles?: number;
}

export interface PlayerDiscountApprovalSpec {
    clubId?: number;
    applications?: PlayerDiscountProgramApplication[];
}

export interface PlayerDiscountClubApproval {
    playerDiscountProgram?: PlayerDiscountProgram;
    club?: ClubData;
    approved?: boolean;
    validFrom?: Date;
    validUntil?: Date;
    dateApplied?: Date;
    dateApproved?: Date;
    approvedBy?: UserAuthentication;
}

export interface PlayerDiscountProgram {
    id?: number;
    discountProgram?: DiscountCompanyProgram;
    player?: PlayerData;
    verifiedByCompany?: boolean;
    verifiedOn?: Date;
    validFrom?: Date;
    validUntil?: Date;
    membershipNumber?: string;
    document?: string;
}

export interface PlayerDiscountProgramApplication {
    playerId?: number;
    programId?: string;
    validFrom?: Date;
    validUntil?: Date;
}

export interface TeeTimeClubVoucher {
    id?: number;
    seriesId?: number;
    voucherNumber?: string;
    name?: string;
    validFrom?: Date;
    playerAssigned?: PlayerData;
    assignedOn?: Date;
    validUntil?: Date;
    redeemed?: boolean;
    redeemedOn?: Date;
    club?: ClubData;
    assignedBy?: UserAuthentication;
    transferable?: boolean;
    usableWithOtherRewards?: boolean;
    appliesToBookingAmount?: boolean;
    appliesToFlight?: boolean;
    voucherAmountType?: AmountType;
    voucherAmount?: number;
    allowOnWeekdays?: boolean;
    allowOnWeekends?: boolean;
    allowOnPublicHolidays?: boolean;
    priceComponents?: TeeTimePriceComponent[];
}

export interface TeeTimeClubVoucherSeries {
    id?: number;
    club?: ClubData;
    voucherSeries?: string;
    name?: string;
    description?: string;
    transferable?: boolean;
    usableWithOtherRewards?: boolean;
    appliesToBookingAmount?: boolean;
    appliesToFlight?: boolean;
    voucherAmountType?: AmountType;
    voucherAmount?: number;
    allowOnWeekdays?: boolean;
    allowOnWeekends?: boolean;
    allowOnPublicHolidays?: boolean;
    totalVouchers?: number;
    validityDays?: number;
    vouchersIssued?: number;
    createdBy?: UserAuthentication;
    voucherImage?: string;
    validFrom?: Date;
    validUntil?: Date;
    includesTax?: boolean;
    taxPercent?: number;
    applyBeforeTax?: boolean;
    maxFlightSize?: number;
    priceComps?: TeeTimeVoucherPriceComp[];
    maxValidDays?: number;
}

export interface TeeTimeDiscount {
    id?: number;
    name?: string;
    description?: string;
    validFrom?: Date;
    validUntil?: Date;
    amountType?: AmountType;
    discount?: number;
    appliesToBooking?: boolean;
    active?: boolean;
    autoApply?: boolean;
    availableForClubOnly?: boolean;
    usableWithOtherRewards?: boolean;
    discountBeforeTax?: boolean;
    applicableRate?: TeeTimeDiscountRate;
    club?: ClubData;
    discountProgram?: DiscountCompanyProgram;
    priceComponents?: TeeTimePriceCompDiscount[];
    playerTypes?: TeeTimePlayerTypeDiscount[];
    discountRates?: TeeTimeDiscountRate[];
}

export interface TeeTimeDiscountRate {
    id?: number;
    dayId?: number;
    dayName?: string;
    amRateType?: AmountType;
    amRate?: number;
    amRateNineHole?: number;
    pmRateType?: AmountType;
    pmRate?: number;
    pmRateNineHole?: number;
    taxable?: boolean;
    includesTax?: boolean;
    taxPercent?: number;
    discountRateByComps?: DiscountRateByComp[];
}

export interface TeeTimePlayerTypeDiscount {
    id?: number;
    bookingPlayerType?: BookingPlayerType;
}

export interface TeeTimePriceCompDiscount {
    id?: number;
    priceComponent?: TeeTimePriceComponent;
}

export interface TeeTimeVoucherPriceComp {
    id?: number;
    priceComponent?: TeeTimePriceComponent;
    price?: number;
}

export interface EmailAddress {
    email?: string;
    name?: string;
}

export interface EmailAttachment {
    attachment?: any;
    name?: string;
    contentType?: string;
}

export interface EmailMessage {
    subject?: string;
    message?: string;    
    copyBritesoft?: string;
    from?: EmailAddress;
    toList?: EmailAddress[];
    ccList?: EmailAddress[];
    bccList?: EmailAddress[];
    attachments?: EmailAttachment[];
}

export interface EmailSentReport {
    messageId?: string;
    currentStatus?: EmailStatus;
    lastTriedAt?: Date;
    failedCount?: number;
    sentAt?: Date;
}

export interface ExcelFlight {
    flightNumber?: string;
    gameCourseId?: number;
    courseName?: string;
    startTime?: Date;
    startingHole?: number;
    startRowIndex?: number;
    endRowIndex?: number;
    members?: ExcelFlightMember[];
}

export interface ExcelFlightCourse {
    gameCourseId?: number;
    courseName?: string;
}

export interface ExcelFlightData {
    competitionId?: number;
    clubId?: number;
    roundNumber?: number;
    workbook?: any;
    categories?: ExcelPlayerCategory[];
    courses?: ExcelFlightCourse[];
    flights?: ExcelFlight[];
}

export interface ExcelFlightMember {
    rowIndex?: number;
    playerName?: string;
    email?: string;
    phone?: string;
    buggy?: string;
    nhsNumber?: string;
    clubMembership?: string;
    handicap?: number;
    scorerName?: string;
    categoryId?: number;
    categoryName?: string;
    gender?: string;
    playerId?: number;
    playerRecord?: any;
    scorer?: any;
    countryId?: string;
    nationality?: string;
}

export interface ExcelFlightSaveInfo {
    error?: boolean;
    errorMessages?: string[];
    currentPlayerRounds?: any[];
    createCompetitionPlayers?: any[];
    createPlayerRounds?: any[];
    updatePlayerRounds?: any[];
    deletePlayerRounds?: any[];
}

export interface ExcelFlightSaveStatus {
    loading?: boolean;
    currentMessge?: string;
    messages?: string[];
    error?: boolean;
    errorCellStyle?: any;
    errorMessages?: string[];
}

export interface ExcelPlayerCategory {
    categoryId?: number;
    categoryName?: string;
}

export interface FeatureSubscription {
    id?: number;
    active?: boolean;
    underGracePeriod?: boolean;
    feature?: PremiumFeature;
    quantityBought?: number;
    unlimited?: boolean;
    subscription?: boolean;
    subscriptionType?: string;
    boughtOn?: Date;
    startDate?: Date;
    endDate?: Date;
    graceDays?: number;
    quantityUsed?: number;
}

export interface PremiumFeature {
    id?: string;
    name?: string;
    availableToPlayers?: boolean;
    availableToClubs?: boolean;
    availableToOrganizers?: boolean;
    description?: string;
    basePeriod?: string;
}

export interface PremiumFeatureBundle {
    id?: number;
    name?: string;
    bundleSize?: number;
    bundlePeriod?: number;
    unlimited?: boolean;
    prices?: PremiumFeaturePrice[];
}

export interface PremiumFeaturePrice {
    id?: number;
    country?: string;
    currency?: string;
    startDate?: Date;
    endDate?: Date;
    price?: number;
    pricingType?: string;
}

export interface Feedback {
    id?: number;
    category?: FeedbackCategory;
    fromEmail?: string;
    toEmail?: string;
    subject?: string;
    message?: string;
    status?: string;
    messageSent?: Date;
    fromUser?: number;
    toUser?: number;
}

export interface FeedbackCategory {
    id?: string;
    name?: string;
    displayOrder?: number;
}

export interface CourseHole {
    holeNumber?: number;
    courseHoleId?: number;
    parScore?: number;
    holeIndex?: number;
    blueDistance?: number;
    blackDistance?: number;
    redDistance?: number;
    latitude?: number;
    longitude?: number;
}

export interface GameCourse {
    whichNine?: number;
    courseId?: number;
    courseName?: string;
    clubId?: number;
    clubName?: string;
    coursePar?: number;
    courseHoles?: CourseHole[];
    totalHoles?: number;
}

export interface NormalGameRound {
    clientId?: string;
    clubInfo?: ClubInfo;
    warning?: string;
    playersInGame?: PlayerInGame[];
    gameCourses?: CourseInfo[];
    gameRoundId?: number;
    totalHoles?: number;
}

export interface PlayerInGame {
    playerInfo?: PlayerInfo;
    playerRoundId?: number;
    scores?: PlayerScore[];
}

export interface ClubHandicap {
    clubInfo?: ClubInfo;
    handicapSystem?: HandicapSystem;
    course1?: string;
    course2?: string;
    rating?: CourseSlopeRating;
    handicapIndex?: number;
    handicap?: number;
    homeClub?: boolean;
}

export interface CompetitionHandicapIndex {
    handciapIndex?: number;
    rating?: CourseSlopeRating;
    handicap?: number;
    derivedFrom?: string;
}

export interface CourseHandicapDetails {
    handicapSystem?: string;
    handicapIndex?: number;
    handicap?: number;
    rating?: CourseSlopeRating;
    nineHoleHandicap?: boolean;
    handicapIndexEstablished?: boolean;
}

export interface CourseSlopeRating {
    courseRating?: number;
    slopeRating?: number;
    totalPar?: number;
}

export interface ExceptionScoreReduction {
    scoreRelativeToHidx?: number;
    extraAdjustment?: number;
}

export interface HandicapCalculation {
    id?: number;
    handicapSystem?: string;
    handicapIndexDate?: Date;
    calculatedOn?: Date;
    player?: PlayerInfo;
    totalRoundsRead?: number;
    totalAverageDifferentialsUsed?: number;
    averageValue?: number;
    handicapFactor?: number;
    initialHandicapIndex?: number;
    nineHoleHandicap?: boolean;
    lowHandicapStartDate?: Date;
    lowHandicapEndDate?: Date;
    lowHandicapIndex?: number;
    handicapIndexAfterSoftCap?: number;
    handicapIndexMovement?: number;
    handicapIndexAfterHardCap?: number;
    handicapIndex?: number;
    gameRounds?: HandicapGameRound[];
}

export interface HandicapGameRound {
    playerRoundId?: number;
    nineHoles?: boolean;
    clubName?: string;
    roundDate?: Date;
    startTime?: Date;
    totalHolesPlayed?: number;
    rating?: CourseSlopeRating;
    courseHandicap?: number;
    handicapIndex?: number;
    competitionRound?: boolean;
    competitionName?: string;
    teeBoxId?: number;
    teeBoxName?: string;
    courseNames?: string[];
    scores?: HandicapScore[];
    sortGroup?: number;
    totalActualGrossScore?: number;
    totalGrossScore?: number;
    totalAdjustedScore?: number;
    averageDifferential?: number;
    pccAdjustment?: number;
    scoreDifferential?: number;
    esr?: number;
    cumulativeESR?: number;
    used?: boolean;
}

export interface HandicapScore {
    holeNo?: number;
    holePar?: number;
    holeIndex?: number;
    actualGrossScore?: number;
    grossScore?: number;
    adjustedScore?: number;
    strokesAllowed?: number;
    holePlayed?: boolean;
}

export interface HandicapSystem {
    id?: string;
    name?: string;
    shortCode?: string;
    description?: string;
    defaultSystem?: boolean;
    derivedByMygolf?: boolean;
    logoUrl?: string;
}

export interface HandicapSystemConfig {
    maxRounds?: number;
    minRounds?: number;
    considerNineHoleScores?: boolean;
    minHolesForNine?: number;
    minHolesForEighteen?: number;
    scoreDifferentials?: ScoreDifferentialCount[];
    minCompetitiveScores?: number;
    minimumRoundsForLowestHandicapIndex?: number;
    lowestHandicapIndexPeriod?: Period;
    applySoftCap?: boolean;
    softCap?: number;
    softCapSuppression?: number;
    applyHardCap?: boolean;
    hardCap?: number;
    applyExceptionalScoreReduction?: boolean;
    exceptionalScoreReductions?: ExceptionScoreReduction[];
}

export interface ScoreDifferentialCount {
    numberOfDifferentials?: number;
    numberOfDifferentialsToUse?: number;
    adjustment?: number;
}

export interface EclecticPlayerRound {
    id?: number;
    position?: number;
    participating?: boolean;
    playerId?: number;
    playerName?: string;
    photo?: string;
    teeBoxName?: string;
    roundNo?: number;
    handicapIndex?: number;
    handicap?: number;
    handicapDecimal?: number;
    courseRating?: number;
    slopeRating?: number;
    totalGrossOut?: number;
    totalGrossIn?: number;
    totalGross?: number;
    totalNetOut?: number;
    totalNetIn?: number;
    totalNet?: number;
    actualTotalGross?: number;
    actualTotalNet?: number;
    totalNetAdj?: number;
    playerScores?: EclecticPlayerScore[];
}

export interface EclecticPlayerScore {
    eprId?: number;
    holeNo?: number;
    holePar?: number;
    holeIndex?: number;
    grossScore?: number;
    netScore?: number;
    actualGrossScore?: number;
    actualNetScore?: number;
}

export interface LeagueLeaderboard {
    leagueRound?: LeagueRound;
    playerRounds?: EclecticPlayerRound[];
}

export interface LeagueRound {
    seasonName?: string;
    roundNo?: number;
    roundDate?: Date;
    competitionId?: number;
    competitionName?: string;
    status?: string;
}

export interface LeagueRoundDetails {
    holePars?: number[];
    holeIndexes?: number[];
}

export interface LeagueScorecards {
    leagueRound?: LeagueRound;
    leagueRoundDetails?: LeagueRoundDetails;
    playerRounds?: EclecticPlayerRound[];
}

export interface LeagueSeason {
}

export interface LowestAverageGrossLeaderboard {
    leagueSeason?: string;
    totalRounds?: number;
    totalFinished?: number;
    players?: PlayerLowestAverageGross[];
}

export interface PlayerGrossScoreByRound {
    playerId?: number;
    roundNo?: number;
    roundDate?: Date;
    status?: string;
    totalGross?: number;
    considered?: boolean;
}

export interface PlayerLowestAverageGross {
    position?: number;
    playerId?: number;
    playerName?: string;
    photo?: string;
    teeBoxName?: string;
    teeBoxImage?: string;
    qualifyingRounds?: number;
    averageGross?: number;
    eligible?: boolean;
    scoresByRound?: PlayerGrossScoreByRound[];
}

export interface OrganizerAdData {
    advertisement?: AdvertisementData;
    startDate?: Date;
    endDate?: Date;
    displayPeriod?: number;
    rank?: number;
    autoInclude?: boolean;
}

export interface OrganizerData {
    id?: number;
    registerNo?: string;
    name?: string;
    shortName?: string;
    description?: string;
    address?: AddressData;
    image?: string;
    contactPerson?: string;
    contactEmail?: string;
    status?: string;
    dateJoined?: Date;
    createdOn?: Date;
    createdBy?: string;
    club?: ClubData;
    advertisements?: OrganizerAdData[];
}

export interface PlayerBookingTypeAssociation {
    bookingPlayerType?: BookingPlayerType;
    supportingDocument?: string;
}

export interface PlayerClubAccount {
    id?: number;
    club?: ClubData;
    player?: PlayerData;
    currency?: CurrencyData;
    balanceAmount?: number;
    balanceType?: DebitOrCredit;
    allowCredit?: boolean;
    creditLimitApplicable?: boolean;
    creditLimit?: number;
}

export interface PlayerData {
    id?: number;
    accountNo?: string;
    handicapSystemNo?: string;
    golfAssociationNo?: string;
    organization?: string;
    nickName?: string;
    playerName?: string;
    firstName?: string;
    lastName?: string;
    passport?: string;
    email?: string;
    profile?: string;
    handicap?: number;
    handicapIndex?: number;
    dateJoined?: Date;
    dateOfBirth?: Date;
    status?: string;
    image?: string;
    type?: string;
    age?: number;
    gender?: string;
    complete?: boolean;
    color?: string;
    deviceToken?: string;
    teeBox?: TeeBoxData;
    address?: AddressData;
    nationality?: CountryData;
    phone?: number;
    playerId?: number;
    userProfile?: UserProfile;
    addresses?: UserAddress[];
}

export interface PlayerGroup {
    id?: number;
    groupName?: string;
    players?: PlayerInfo[];
}

export interface PlayerGroupList extends PagedResult {
    playerGroups?: PlayerGroup[];
}

export interface PlayerHomeInfo {
    playerId?: number;
    playerName?: string;
    totalScoreCards?: number;
    totalFriends?: number;
    activeCompetitions?: number;
    error?: boolean;
    errorMessage?: string;
    player?: PlayerInfo;
    testUser?: boolean;
    compsActiveToday?: CompetitionInfo[];
}

export interface PlayerInfo {
    userId?: number;
    playerId?: number;
    playerName?: string;
    firstName?: string;
    lastName?: string;
    nickName?: string;
    email?: string;
    phone?: string;
    handicap?: number;
    handicapIndex?: number;
    mygolfHandicapIndex?: number;
    defaultHandicapSystem?: string;
    handicapIn?: string;
    gender?: string;
    countryId?: string;
    countryName?: string;
    sportCode?: string;
    flagUrl?: string;
    photoUrl?: string;
    thumbnail?: string;
    dateJoined?: Date;
    birthdate?: Date;
    friendSince?: Date;
    teeOffFrom?: string;
    nhsNumber?: string;
    status?: string;
    errorMessage?: string;
    userProfile?: UserProfile;
    addressInfo?: AddressInfo;
    userAddresses?: UserAddress[];
    allowEdit?: boolean;
    membership?: string;
    membershipJoinDate?: Date;
    membershipExpiryDate?: Date;
    nationalityId?: string;
    nationalityName?: string;
    nationalityFlag?: string;
    password?: string;
}

export interface PlayerList extends PagedResult {
    players?: PlayerInfo[];
}

export interface PlayerPerformance {
    success?: boolean;
    errorMessage?: string;
    bestScore?: number;
    totalGrossScore?: number;
    totalScorecards?: number;
    averageScore?: number;
    playerPerformances?: PlayerPerformanceInfo[];
}

export interface PlayerPerformanceDetail {
    success?: boolean;
    errorMessage?: string;
    scoreStatistic?: ScoreStatistic;
    playerPerformanceDetails?: PlayerPerformanceDetailInfo[];
}

export interface PlayerPerformanceDetailInfo {
    gameRoundId?: number;
    playeRoundId?: number;
    gameType?: string;
    competitionId?: number;
    roundNo?: number;
    firstNineCourseName?: string;
    secondNineCourseName?: string;
    roundDate?: Date;
    inTotalGross?: number;
    outTotalGross?: number;
    totalGross?: number;
    inTotalNet?: number;
    outTotalNet?: number;
    totalNet?: number;
}

export interface PlayerPerformanceInfo {
    score?: number;
}

export interface PlayerRegistrationResult {
    success?: boolean;
    email?: string;
    userId?: number;
    playerId?: number;
    errorMessage?: string;
}

export interface PlayerRoundScores {
    playerRoundId?: number;
    playerId?: number;
    playerName?: string;
    nickName?: string;
    teamName?: string;
    gender?: string;
    photoUrl?: string;
    thumbnail?: string;
    teeOffFrom?: string;
    playerHandicap?: number;
    courseRating?: number;
    slopeRating?: number;
    handicapIndex?: number;
    handicapSystemApplied?: string;
    scoringPlayerId?: number;
    scorerName?: string;
    frontNineTotal?: number;
    backNineTotal?: number;
    totalScore?: number;
    diffGrossToPar?: number;
    status?: string;
    startTime?: string; //Date;
    actualStartTime?: Date;
    frontNineNetTotal?: number;
    backNineNetTotal?: number;
    totalNetScore?: number;
    totalNetAdjustedScore?: number;
    diffNetToPar?: number;
    scores?: PlayerScore[];
    totals?: Array<any>; //NineTotals[];
}

export interface PlayerScore {
    scorecardId?: number;
    whichNine?: number;
    gameCourseId?: number;
    courseHoleId?: number;
    courseId?: number;
    holeNumber?: number;
    courseName?: string;
    holeIndex?: number;
    parScore?: number;
    actualScore?: number;
    netScore?: number;
    adjustedScore?: number;
}

export interface NineTotals {
    whichNine?: number;
    grossTotal?: number;
    netTotal?: number;
}

export interface RefundAndRedeem {
    playerId?: number;
    playerName?: string;
    transactionDate?: Date;
    type?: string;
    referenceType?: string;
    reference?: string;
    bookingId?: number;
    instanceId?: number;
    refundMode?: RefundMode;
    reason?: string;
    refundedBy?: UserAuthentication;
    amount?: number;
}

export interface DocumentType {
    id?: string;
    name?: string;
    description?: string;
    ageProof?: boolean;
    nationalityProof?: boolean;
    addressProof?: boolean;
    domicileProof?: boolean;
    professionProof?: boolean;
    country?: CountryData;
}

export interface UserAddress {
    name?: string;
    defaultAddress?: boolean;
    address?: AddressData;
}

export interface UserDocument {
    name?: string;
    documentNumber?: string;
    documentUrl?: string;
    documentType?: DocumentType;
}

export interface UserProfile {
    salutation?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    gender?: string;
    dateOfBirth?: Date;
    occupation?: string;
    religion?: string;
    race?: string;
    maritalStatus?: MaritalStatus;
    marriageDate?: Date;
    photo?: string;
    profileImage?: string;
    shareWithClub?: boolean;
    shareWithOthers?: boolean;
    nationality?: CountryData;
}

export interface CreateNotificationResult {
    id?: string;
    recipients?: number;
    errors?: string[];
}

export interface PushMessageButton {
    id?: string;
    text?: string;
}

export interface PushNotification {
    titles?: PushNotificationText[];
    contents?: PushNotificationText[];
    filter?: any;
    buttons?: PushMessageButton[];
    data?: any;
}

export interface PushNotificationText {
    language?: string;
    text?: string;
}

export interface PushServerInfo {
    oneSignalApiURL?: string;
    appKey?: string;
    restApiKey?: string;
    userKey?: string;
    googleProjectNumber?: string;
}

export interface ClubBookingRecon {
    bookingId?: number;
    clubRecon?: ClubRecon;
    bookedBy?: string;
    bookingPlayerType?: string;
    flightCharges?: number;
    totalDeductions?: number;
    totalTaxes?: number;
    totalRefund?: number;
    totalOnlinePayment?: number;
    totalOfflinePayment?: number;
    totalCreditRedemption?: number;
    myGolf2uCommission?: number;
    paymentGatewayCommission?: number;
    payableToClub?: number;
    mygolf2uCommissionRate?: number;
    mygolf2uCommissionRateType?: AmountType;
}

export interface ClubRecon {
    id?: number;
    createdOn?: Date;
    club?: ClubData;
    reconUntil?: Date;
    payableToClub?: number;
    paid?: boolean;
    paidOn?: Date;
    paidBy?: UserAuthentication;
}

export interface PaymentGatewayRecon {
    id?: number;
    createdOn?: Date;
    paymentGateway?: PaymentGatewayInfo;
    reconUntil?: Date;
    totalAmountExpected?: number;
    totalAmountCredited?: number;
}

export interface BillItem {
    itemType?: string;
    sequence?: number;
    itemName?: string;
    itemCount?: number;
    unitPrice?: number;
    itemPrice?: number;
    packagePrice?: boolean;
}

export interface BookingBillPayment {
    billDate?: Date;
    paymentSuccess?: boolean;
    pending?: boolean;
    paidAt?: Date;
    paymentMethod?: PaymentMethod;
    gatewayInfo?: PaymentGatewayInfo;
    paidAtClub?: boolean;
    paidFor?: PaidFor;
    amount?: number;
}

export interface BookingCount {
    maxUnpaidBookings?: number;
    totalBookings?: number;
    totalUnpaidBookings?: number;
}

export interface BookingDiscountBillItem {
    name?: string;
    amount?: number;
    voucher?: boolean;
    adhocWaiver?: boolean;
    waiverReason?: string;
}

export interface BookingOfflinePayment {
    bookingId?: number;
    paidFor?: string;
    payments?: OfflinePayment[];
}

export interface BookingPayment {
    paidBy?: string;
    datePaid?: Date;
    amountPaid?: number;
    whatIsPaid?: string;
    billId?: number;
    playerId?: number;
    bookingPlayerId?: number;
    paymentMethod?: string;
    paymentCapturedBy?: string;
    authId?: number;
}

export interface BookingPlayerCharges {
    sequence?: number;
    bookingPlayerId?: number;
    playerName?: string;
    playerTypeApplied?: string;
    billItems?: BillItem[];
    discounts?: BookingDiscountBillItem[];
}

export interface BookingPlayerType {
    id?: string;
    name?: string;
    description?: string;
    nationalitySpecific?: boolean;
}

export interface BookingPriceDeduction {
    bookingPlayerId?: number;
    component?: string;
    componentName?: string;
    itemCount?: number;
    unitPrice?: number;
    itemPrice?: number;
}

export interface BookingRefund {
    playerRefunded?: PlayerData;
    refundDate?: Date;
    refundAmount?: number;
    refundMode?: RefundMode;
    description?: string;
}

export interface BookingRequestDetails {
    reference?: string;
    request?: TeeTimeSlotBookingRequest;
    playerId?: number;
    authenticationId?: number;
    requestLocale?: Locale;
}

export interface BookingRequestResponse {
    booking?: TeeTimeBooking;
    bookingCreatedAt?: Date;
    depositCutOffDate?: Date;
}

export interface BuggyCaddiePreference {
    bookingId?: number;
    ignoreBuggyUpdate?: boolean;
    ignoreCaddieUpdate?: boolean;
    playerPairings?: PlayerBuggyCaddiePreference[];
}

export interface CaddySelectionCriteria {
    caddyRequired?: boolean;
    gender?: string;
    maxAge?: number;
    minAge?: number;
    initialPreference?: boolean;
}

export interface CancelBookingSpecification {
    bookingId?: number;
    reason?: string;
    refundAmount?: number;
    refundSplits?: BookingRefund[];
}

export interface ClubTeeTimeSlots {
    club?: ClubData;
    distance?: number;
    distanceFrom?: LocationData;
    slots?: TeeTimeSlotDisplay[];
}

export interface ItemizedBill {
    totalCharges?: number;
    taxes?: number;
    totalPayable?: number;
    totalDeductions?: number;
    totalPayment?: number;
    totalRefund?: number;
    balance?: number;
    totalAmount?: number;
    billItems?: BillItem[];
    playerCharges?: BookingPlayerCharges[];
    payments?: BookingPayment[];
    refunds?: BookingRefund[];
    discounts?: BookingDiscountBillItem[];
    changes?: string[];
}

export interface MygolfBookingCommission {
    calculatedDate?: Date;
    commissionCalculated?: number;
    commissionPayable?: number;
    principalAmount?: number;
    taxPayable?: number;
    totalPayable?: number;
    details?: MygolfBookingCommissionDetail[];
}

export interface MygolfBookingCommissionDetail {
    name?: string;
    commissionCalculated?: number;
}

export interface PlayerBuggyCaddiePreference extends addPreference {
    bookingPlayerId?: number;
    assignedBuggy?: number;
    buggyRequired?: boolean;
    buggyPairing?: number;
    driving?: boolean;
    caddyRequired?: boolean;
    caddieAssigned?: number;
    caddiePreferred?: number;
    caddyPairing?: number;
}

export interface addPreference  {
    caddyPreferred?: CaddyData;
    caddyAssigned?: CaddyData;
}

export interface PricingComponents {
}

export interface Known {
}

export interface TeeTimeBillSplit {
    id?: number;
    bookingPlayerId?: number;
    name?: string;
    priceComponent?: TeeTimePriceComponent;
    additionalCharge?: TeeTimePricingAdditionalCharge;
    amount?: number;
    packageName?: string;
    itemCount?: number;
    tax?: boolean;
    source?: string;
    reference?: string;
    remarks?: string;
}

export interface TeeTimeBooking {
    id?: number;
    clubData?: ClubData;
    bookingStatus?: TeeTimeBookingStatus;
    totalPlayers?: number;
    buggyRequested?: number;
    caddyRequested?: number;
    ninesPlayed?: number;
    partialConfirm?: boolean;
    slotPreferred?: TeeTimeSlot;
    slotAssigned?: TeeTimeSlot;
    slotUsed?: TeeTimeSlot;
    bookingReference?: string;
    amountPayable?: number;
    depositPayable?: number;
    totalDeductions?: number;
    totalRefund?: number;
    amountPaid?: number;
    topUpOrRefund?: number;
    openForRegistration?: boolean;
    bookedByPlayer?: PlayerData;
    bookedByUser?: UserAuthentication;
    bookingPersonName?: string;
    bookingPersonEmail?: string;
    bookingPersonPhone?: string;
    assignmentDone?: boolean;
    priceMap?: { [index: string]: number };
    bookingRequestedAt?: Date;
    bookingCreatedAt?: Date;
    flight?: TeeTimeFlight;
    cancellationGuard?: boolean;
    cancelGuardBy?: UserAuthentication;
    buggiesAssigned?: BuggyData[];
    bookingPlayers?: TeeTimeBookingPlayer[];
    bookingDiscounts?: TeeTimeBookingDiscount[];
    refunds?: RefundInstance[];
    payments?: TeeTimeBookingBill[];
    cancellationReason?: string;
    canceledBy?: UserAuthentication;
}

export interface TeeTimeBookingBill {
    id?: number;
    booking?: TeeTimeBooking;
    whatIsPaid?: string;
    billId?: number;
    amountPaid?: number;
    payingBookingPlayer?: TeeTimeBookingPlayer;
    payingPlayer?: PlayerData;
    payingPlayerName?: string;
    payingPlayerEmail?: string;
    payingPlayerPhone?: string;
    paymentCapturedBy?: UserAuthentication;
}

export interface TeeTimeBookingDiscount {
    sequence?: number;
    deductionDate?: Date;
    bookingPlayerId?: number;
    discountApplied?: TeeTimeDiscount;
    voucherApplied?: TeeTimeClubVoucher;
    amountDeducted?: number;
    adhocWaiver?: boolean;
    adhocWaiverReason?: string;
    adhocWaiverBy?: UserAuthentication;
    discountAudit?: DiscountAudit;
    transaction?: ClubTransaction;
}

export interface TeeTimeBookingEffectiveOptions {
    id?: number;
    club?: ClubData;
    effectiveFrom?: Date;
    name?: string;
    currency?: CurrencyData;
    options?: TeeTimeBookingOptions[];
}

export interface TeeTimeBookingOptions {
    dayName?: string;
    specialDate?: Date;
    name?: string;
    depositAmount?: number;
    depositAmountType?: AmountType;
    depositCutOffDays?: number;
    checkinMinutes?: number;
    cancelBeforeHours?: number;
    addressMandatory?: boolean;
    buggyMandatory?: boolean;
    maxPlayersPerBuggy?: number;
    caddyMandatory?: boolean;
    maxPlayersPerCaddy?: number;
    minAgeForSeniorCitizens?: number;
    maxAgeForJuniors?: number;
    maxUnpaidBookings?: number;
    allowToSeeBookingByOthers?: boolean;
    maxShiftsPerDayCaddie?: number;
    minMinutesBetweenCaddieShifts?: number;
    maxShiftsPerDayBuggy?: number;
    minMinutesBetweenBuggyShifts?: number;
    cancelPolicyAfterDeposit?: CancelPolicy;
    cancelPolicyAfterPartialPayment?: CancelPolicy;
    cancelPolicyAfterFullPayment?: CancelPolicy;
    penaltyAfterDeposit?: number;
    penaltyAfterPartialPayment?: number;
    penaltyAfterFullPayment?: number;
    fullPaymentCutOffHours?: number;
    showPlayersToCaddie?: boolean;
    roundUpTo?: number;
    roundingMethod?: string;
    allowCaddiePreference?: boolean;
}

export interface TeeTimeBookingPlayer {
    id?: number;
    sequence?: number;
    player?: PlayerData;
    playerName?: string;
    email?: string;
    phone?: string;
    gender?: string;
    playerContact?: string;
    confirmed?: boolean;
    playerType?: BookingPlayerType;
    playerTypeUsed?: BookingPlayerType;
    walking?: boolean;
    pairingNo?: number;
    driving?: boolean;
    caddyPairing?: number;
    caddyPreferred?: CaddyData;
    caddySelectionCriteria?: CaddySelectionCriteria;
    caddyAssigned?: CaddyData;
    buggyId?: number;
    estimatedArrivalTime?: Date;
    playerRemoved?: boolean;
}

export interface TeeTimeFlight {
    id?: number;
    status?: TeeTimeFlightStatus;
    createdAt?: Date;
    flightDispachedAt?: Date;
    playStartedAt?: Date;
    flightCrossedOverAt?: Date;
    flightFinishedAt?: Date;
    caddyMaster?: UserAuthentication;
    rainCheckIssued?: boolean;
    // flightSeatings?: TeeTimeFlightSeating[];
}

export interface TeeTimeFlightBuggy {
    sequence?: number;
    buggy?: BuggyData;
}

export interface TeeTimePrice {
    id?: number;
    playerType?: BookingPlayerType;
    priceComponent?: TeeTimePriceComponent;
    applicableTo?: any;
    mandatory?: boolean;
    price18Hole?: number;
    price9Hole?: number;
    addToDisplayPrice?: boolean;
    packageName?: string;
}

export interface TeeTimePriceComponent {
    id?: string;
    name?: string;
    description?: string;
    systemSeeded?: boolean;
    printSequence?: number;
    defaultComponent?: boolean;
    componentType?: PricingComponentType;
}

export interface TeeTimePricingAdditionalCharge {
    id?: number;
    name?: string;
    amountType?: AmountType;
    amount?: number;
    printSequence?: number;
    applicableComponents?: TeeTimePriceComponent[];
    applicablePlayerTypes?: BookingPlayerType[];
}

export interface TeeTimePricingPlan {
    id?: number;
    name?: string;
    description?: string;
    currency?: CurrencyData;
    promotional?: boolean;
    discountsApplicable?: boolean;
    prices?: TeeTimePrice[];
    additionalCharges?: TeeTimePricingAdditionalCharge[];
}

export interface TeeTimeSlot {
    slotNo?: number;
    slotDayId?: number;
    startCourse?: ClubCourseData;
    secondCourse?: ClubCourseData;
    teeOffDate?: Date;
    teeOffTime?: Date;
    availableForBooking?: boolean;
    membersOnly?: boolean;
    maxPlayers?: number;
    minPlayers?: number;
    waitingListSize?: number;
    reasonForBlocking?: string;
    allowWalking?: boolean;
    caddyMandatory?: boolean;
    maxPlayersPerBuggy?: number;
    maxPlayersPerCaddy?: number;
    nineHolesAllowed?: boolean;
    eighteenHolesAllowed?: boolean;
    pricingPlan?: TeeTimePricingPlan;
    pricingPlanPromotional?: TeeTimePricingPlan;
    
    currency?: CurrencyData;
}

export interface TeeTimeSlotBookingRequest {
    clubId?: number;
    courseId?: number;
    teeOffDate?: any; //;
    teeOffTimeFrom?: string; //Date;
    teeOffTimeTo?: string; //Date;
    totalPlayers?: number;
    buggyRequired?: number;
    caddiesRequired?: number;
    ninesPlaying?: number;
    bookingName?: string;
    bookingEmail?: string;
    bookingPhone?: string;
    addBookingPlayer?: boolean;
    bookingRequestedAt?: Date;
}

export interface TeeTimeSlotCalendar {
    startDate?: Date;
    endDate?: Date;
    days?: TeeTimeSlotDay[];
}

export interface TeeTimeSlotDay {
    id?: number;
    course?: ClubCourseData;
    teeOffDate?: Date;
    openForBooking?: boolean;
    slots?: TeeTimeSlot[];
    secondNine?: ClubCourseData;
    rule?: TeeTimeSlotGenerationRule;
}

export interface TeeTimeSlotDisplay {
    slot?: TeeTimeSlot;
    available?: boolean;
    reasonsForUnavailability?: string[];
    currency?: CurrencyData;
    originalPrices?: Record<string, number>; //{[index: string]: number}; //{ [index: string]: number };
    // displayPrices?: DisplayPrices;
    displayPrices?: Record<string, number>;//{[index: string]: number};
}

// type Prices {
//     [index]: string;
// }

export interface DisplayPrices {
    ARMY?: number;
    GOVT?: number;
    GUEST?: number;
    JUNIOR?: number;
    LADIES?: number;
    MEMBER?: number;
    POLICE?: number;
    SENIOR?: number;
    STAFF?: number;
    STD?: number;
    WOMAN?: number;
}

export interface TeeTimeSlotGenerationRule {
    id?: number;
    name?: string;
    club?: ClubData;
    daysInAdvanceToGenerate?: number;
    daysInAdvanceForBooking?: number;
    published?: boolean;
    dayRules?: TeeTimeSlotGenerationRuleDay[];
}

export interface TeeTimeSlotGenerationRuleDay {
    dayName?: string;
    displaySequence?: number;
    name?: string;
    holiday?: boolean;
    bookingDisabled?: boolean;
    firstSlotStartTime?: Date;
    minutesBetweenSlots?: number;
    totalSlots?: number;
    maxPlayersPerSlot?: number;
    minPlayersPerSlot?: number;
    waitingListSize?: number;
    allowWalking?: boolean;
    caddyMandatory?: boolean;
    maxPlayersPerBuggy?: number;
    maxPlayersPerCaddy?: number;
    pricingPlan?: TeeTimePricingPlan;
    pricingPlanPromotional?: TeeTimePricingPlan;
    specialDay?: TeeTimeSpecialDay;
    slotTemplates?: TeeTimeSlotTemplate[];
}

export interface TeeTimeSlotTemplate {
    slotNo?: number;
    teeOffTime?: Date;
    minPlayers?: number;
    maxPlayers?: number;
    waitingListSize?: number;
    availableForBooking?: boolean;
    membersOnly?: boolean;
    reasonForBlocking?: string;
    pricingPlan?: TeeTimePricingPlan;
    pricingPlanPromotional?: TeeTimePricingPlan;
    allowWalking?: boolean;
    caddyMandatory?: boolean;
    maxPlayersPerBuggy?: number;
    maxPlayersPerCaddy?: number;
    deleted?: boolean;
    nineHolesAllowed?: boolean;
    eighteenHolesAllowed?: boolean;
}

// export interface TeeTimeSlotType extends Record {
// }

export interface TeeTimeSpecialDate {
    id?: number;
    name?: string;
    specialDate?: Date;
    recurring?: boolean;
}

export interface TeeTimeSpecialDay {
    id?: number;
    name?: string;
    club?: ClubData;
    specialDates?: TeeTimeSpecialDate[];
}

export interface BookingPlayerTypeDistribution {
    totalPlayers?: number;
    totalMen?: number;
    totalWomen?: number;
    totalMembers?: number;
    playerTypeMap?: { [index: string]: number };
}

export interface BookingStatistics {
    overallStatus?: SlotBookingStatus;
    morningStatus?: SlotBookingStatus;
    afternoonStatus?: SlotBookingStatus;
    internal?: boolean;
    dayStatus?: { [index: string]: BookingStatistics };
}

export interface CaddieBuggyAssignmentStatistics {
    totalCaddies?: number;
    totalMen?: number;
    totalWomen?: number;
    totalBuggies?: number;
}

export interface CaddieBuggyStatistics {
    overallStat?: CaddieBuggyAssignmentStatistics;
    morningStat?: CaddieBuggyAssignmentStatistics;
    afternoonStat?: CaddieBuggyAssignmentStatistics;
}

export interface CourseUtilization {
    courseId?: number;
    courseName?: string;
    totalSlots?: number;
    totalBooked?: number;
}

export interface CourseUtilizationStatistics {
    overallUtilization?: CourseUtilization[];
    morningUtilization?: CourseUtilization[];
    afternoonUtilization?: CourseUtilization[];
    dayUtilization?: { [index: string]: CourseUtilizationStatistics };
}

export interface FutureBookingStatistics {
    overall?: FutureRevenue;
    morning?: FutureRevenue;
    afternoon?: FutureRevenue;
}

export interface FutureRevenue {
    totalBookings?: number;
    totalBuggies?: number;
    totalCaddies?: number;
    estimatedRevenue?: number;
}

export interface SlotBookingStatus {
    totalSlots?: number;
    totalBooked?: number;
    totalPending?: number;
    totalCheckedIn?: number;
    totalWaitingDispatch?: number;
    totalInPlay?: number;
    totalFinished?: number;
    totalAbandoned?: number;
    amountPayable?: number;
    amountPaid?: number;
    playerTypeDistribution?: BookingPlayerTypeDistribution;
}

export interface CompetitionRound {
    roundNo?: number;
    courseNames?: string;
    outTotal?: number;
    inTotal?: number;
    outTotalNet?: number;
    inTotalNet?: number;
    nines?: WhichNine[];
}

export interface HoleScore {
    whichNine?: number;
    holeNo?: number;
    courseHoleNo?: number;
    parScore?: number;
    index?: number;
    grossScore?: number;
    netScore?: number;
    toPar?: number;
    toParNet?: number;
}

export interface TeamPlayerOveralTotals {
    playerId?: number;
    playerName?: string;
    playerImage?: string;
    thumbnail?: string;
    handicap?: number;
    status?: string;
    qualified?: boolean;
    totalGross?: number;
    totalNet?: number;
    toPar?: number;
    toParNet?: number;
}

export interface TeamPlayerScores {
    playerId?: number;
    playerName?: string;
    playerImage?: string;
    thumbnail?: string;
    handicap?: number;
    playerRoundStatus?: string;
    competitionPlayerStatus?: string;
    totalGross?: number;
    totalNet?: number;
    inTotalGross?: number;
    outTotalGross?: number;
    inTotalNet?: number;
    outTotalNet?: number;
    toPar?: number;
    toParNet?: number;
    qualified?: boolean;
    scores?: HoleScore[];
}

export interface TeamRoundScores {
    roundNumber?: number;
    roundId?: number;
    status?: string;
    totalGross?: number;
    totalNet?: number;
    prevRoundPosition?: number;
    currentPosition?: number;
    toPar?: number;
    toParNet?: number;
    topNTotalGross?: number;
    topNTotalNet?: number;
    topNToPar?: number;
    topNToParNet?: number;
    playerScores?: TeamPlayerScores[];
}

export interface TeamScores {
    teamId?: number;
    teamName?: string;
    status?: string;
    teamLogo?: string;
    totalGross?: number;
    totalNet?: number;
    toPar?: number;
    toParNet?: number;
    position?: number;
    positionGross?: number;
    positionNet?: number;
    topNTotalGross?: number;
    topNTotalNet?: number;
    topNToPar?: number;
    topNToParNet?: number;
    ocb?: string;
    ocbNet?: string;
    prevPosition?: number;
    roundScores?: TeamRoundScores[];
    playerOveralTotals?: TeamPlayerOveralTotals[];
}

export interface TeamScoresResult {
    competitionStatus?: string;
    roundNo?: number;
    roundId?: number;
    teamId?: number;
    teamName?: string;
    teamStatus?: string;
    teamLogo?: string;
    playerId?: number;
    playerName?: string;
    playerImage?: string;
    playerThumbnail?: string;
    playerHandicap?: number;
    whichNine?: number;
    holeNumber?: number;
    holePar?: number;
    holeIndex?: number;
    actualScore?: number;
    netScore?: number;
    roundStatus?: string;
    playerRoundStatus?: string;
    competitionPlayerStatus?: string;
    topN?: number;
    scoreType?: string;
    teamPosition?: number;
    teamPositionNet?: number;
    ocb?: string;
    ocbNet?: string;
    totalGross?: number;
    totalNet?: number;
}

export interface WhichNine {
    nine?: number;
    courseName?: string;
    grossTotal?: number;
    netTotal?: number;
    scores?: HoleScore[];
}

export interface LeanScorecard {
    competitionId?: number;
    roundId?: number;
    roundNumber?: number;
    flightNumber?: string;
    scorerId?: number;
    flightMembers?: ScorecardMember[];
}

export interface PlayerHoleScore {
    scorecardId?: number;
    holeNumber?: number;
    actualScore?: number;
    netScore?: number;
}

export interface ScorecardMember {
    playerRoundId?: number;
    playerId?: number;
    scorerId?: number;
    scores?: PlayerHoleScore[];
}

export interface Authority {
    id?: string;
    name?: string;
    description?: string;
}

export interface CaptchaResponse {
    success?: boolean;
    timestamp?: Date;
    hostname?: string;
    "error-codes"?: string[];
}

export interface Role {
    id?: string;
    name?: string;
    description?: string;
}

export interface UserAuthentication {
    id?: number;
    name?: string;
    userName?: string;
    password?: string;
    algorithm?: string;
    salt?: string;
    combineUserName?: boolean;
    email?: string;
    phone?: string;
    active?: boolean;
    tokenKey?: string;
    profile?: UserProfile;
    documents?: UserDocument[];
    roles?: UserRole[];
    authorities?: Authority[];
    status?: string;
}

export interface UserNamePassword {
    username?: string;
    password?: string;
}

export interface UserRole {
    role?: Role;
    clubId?: number;
    organizerId?: number;
    defaultRole?: boolean;
}

export interface ClubTransaction {
    id?: string;
    transactionDate?: Date;
    debitOrCredit?: DebitOrCredit;
    amount?: number;
    description?: string;
    reference?: string;
    externalReference?: string;
    additionalRemarks?: string;
    currency?: CurrencyData;
    transactionType?: TransactionType;
    club?: ClubData;
    status?: string;
    transactionExport?: ClubTransactionExport;
}

export interface ClubTransactionExport {
    id?: number;
    club?: ClubData;
    exportedOn?: Date;
    totalRecords?: number;
    paidRecords?: number;
    unpaidRecords?: number;
    status?: string;
    remarks?: string;
    settledOn?: Date;
    exportedBy?: UserAuthentication;
    settledBy?: UserAuthentication;
}

export interface TransactionGroup {
    id?: string;
    name?: string;
    description?: string;
}

export interface TransactionType {
    id?: string;
    name?: string;
    debitOrCredit?: DebitOrCredit;
    description?: string;
    transactionGroup?: TransactionGroup;
    club?: ClubData;
}

export interface TransactionTypeClubMap {
    club?: ClubData;
    transactionType?: TransactionType;
    clubTransactionType?: string;
}

export interface TransactionTypes {
}

export interface MygolfRole {
    "@class": string;
    authority?: string;
}

export interface MygolfUser {
    userId?: number;
    username?: string;
    active?: boolean;
    expires?: number;
    userType?: UserType;
    playerId?: number;
    clubId?: number;
    organizerId?: number;
    caddyId?: number;
    partnerId?: string;
    admin?: boolean;
    email?: string;
    phone?: string;
    name?: string;
    newAuth?: boolean;
    algorithm?: string;
    combineUsername?: boolean;
    authorities?: MygolfRole[];
}

export interface Period extends ChronoPeriod {
    years?: number;
    months?: number;
    days?: number;
    chronology?: IsoChronology;
}

export interface Locale extends Cloneable {
}

// export interface Record {
// }

export interface IsoChronology extends AbstractChronology {
}

export interface TemporalUnit {
    dateBased?: boolean;
    timeBased?: boolean;
    duration?: Duration;
    durationEstimated?: boolean;
}

export interface ChronoPeriod extends TemporalAmount {
    negative?: boolean;
    zero?: boolean;
    chronology?: Chronology;
}

export interface Cloneable {
}

export interface AbstractChronology extends Chronology {
}

export interface Duration extends TemporalAmount {
    seconds?: number;
    nano?: number;
    negative?: boolean;
    zero?: boolean;
}

export interface Chronology {
    calendarType?: string;
    id?: string;
}

export interface TemporalAmount {
    units?: TemporalUnit[];
}

export type DayIdType = "All" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday" | "Weekday" | "Weekend" | "Holiday";

export type DebitOrCredit = "Debit" | "Credit";

export type PaidFor = "Booking" | "CompetitionRegistration" | "HandicapIndex" | "Unknown";

export type RefundMode = "Cash" | "BankTransfer" | "ClubCredit" | "M2UCredit" | "Unknown";

export type MembershipStatus = "Pending" | "Active" | "Inactive" | "Suspended";

export type FlightType = "Shotgun" | "ShotgunSplit" | "FirstHole" | "FirstHoleSplitSort" | "FirstHoleSplitNine" | "FirstHoleSplitEven";

export type PlayerAdvanceType = "AllAdvance" | "TopNPlayers" | "CutOffScore";

export type ScorerSwapType = "SwapOneAndTwo" | "SwapOneAndThree" | "SwapOneAndFour";

export type ScorerType = "OwnScoring" | "FirstPlayerScoring" | "SecondPlayerScoring" | "ThirdPlayerScoring" | "FourthPlayerScoring" | "SwapBuggyScoring" | "SwapScoring";

export type MaritalStatus = "Married" | "UnMarried" | "Unknown";

export type AmountType = "Absolute" | "Percentage" | "Fixed";

export type BookingCommissionStatus = "None" | "Calculate" | "Recalculate" | "Success" | "Error" | "Ignored";

export type CancelPolicy = "None" | "ForfeitDeposit" | "ForfeitAmount" | "FixedAmount";

export type PricingComponentType = "Green" | "Caddy" | "Buggy" | "CaddyBooking" | "Other";

export type TeeTimeBookingStatus = "Booked" | "Secured" | "CancelledByPlayer" | "CancelledByClub" | "PaymentPartial" | "PaymentFull" | "FlightRegistered" | "RefundInitiated" | "RefundCompleted";

export type TeeTimeFlightStatus = "Created" | "Assigned" | "Dispatched" | "PlayStarted" | "CrossedOver" | "Abandoned" | "PlayFinished";

export type GameRoundStatus = "Pending" | "InProgress" | "Completed";

export type PlayerRoundStatus = "Pending" | "InProgess" | "Completed" | "Withdrawn";

export type UserType = "Britesoft" | "Player" | "Organizer" | "Club" | "Admin" | "Caddy" | "Partner" | "Unknown";

export type CompetitionPlayerStatus = "Registered" | "NoShow" | "Withdrawn" | "FailedCutoff";

export type EmailStatus = "Queued" | "Error" | "Sent" | "Rejected";

// export type ClubMembershipStatus = "Pending"| "Active"| "Inactive"| "Suspended"| "Rejected";

export class ClubMembershipStatus {
    public static PENDING   =   "Pending";
    public static ACTIVE    =   "Active";
    public static INACTIVE  =   "Inactive";
    public static SUSPENDED =   "Suspended";
    public static REJECTED  =   "Rejected";
}


export interface BuggySchedule {
    startDate?: string;
    endDate?: string;
    availabilities?: Availabilities[];
}
export interface CaddySchedule {
    startDate?: string;
    endDate?: string;
    availabilities?: Availabilities[]; //Array<CaddyAvailable>;
}

export interface Availabilities { 
    available?: boolean;
availableOn?: string;
reason?: string;
weeklyHoliday?: boolean;
}

export class PlayerTypes {
    public static STD       =   "Visitor";
    public static ARMY      =   'Armed Forces';
    public static GOVT      =   "Government";
    public static GUEST     =   "Member's Guest";
    public static JUNIOR    =   "Junior";
    public static MEMBER    =   "Member";
    public static POLICE    =   "Police";
    public static SENIOR    =   "Senior";
    public static STAFF     =   "Staff";
    public static TMEMBER   =   "Term Member";
    public static WOMAN     =   "Women";
    public static LADIES    =   "Ladies";
}

export class PaymentMethods {
    public static cash           =	"Cash"
    public static offcc          =	"Offline Credit Card";
    public static offl           =	"Offline Payment";
    public static offnb          =	"Netbanking (Offline)";
    public static online         =	"Online Payment";
    public static redmcc         =	"Redeem Club Credit";

}

export function createGameRoundInfo(): GameRoundInfo {
    return {
        id           : 0,
        roundNo      : 1,
        status       : "Pending",
        inProgress   : false,
        nextRound    : false,
        grossTotal   : 0,
        netPosition  : 0,
        grossPosition: 0,
        publishFlights: false,
    };
}

export class PlayerDisplay
{
    playerName: string;
    nineTotal: number;
    nineNetTotal: number;
    scores: Array<PlayerScore>;
    totalScore: number;
    playerId: number;
    handicap: number;
    whichNine: number;
    playerRound: PlayerRoundScores;
}
export class PlayerTotals
{
    playerName: string;
    handicap: number;
    firstNineGross: number;
    secondNineGross: number;
    firstNineNet: number;
    secondNineNet: number;
    totalGross: number;
    totalNet: number;
    playerRound: PlayerRoundScores;
}
export class CourseDisplay{
    courseName: string;
    whichNine: number;
    holes: Array<CourseHoleInfo>;
    players: Array<PlayerDisplay>;
    coursePar: number;
    indexToUse?: number;
}

export function createClubList(): ClubList {
    return {
        totalPages: 0,

        currentPage: 0,

        totalItems: 0,

        totalInPage: 0,

        success: true,
        clubs  : []
    }
}

export function createClubInfo(): ClubInfo {
    return {
        clubId     : 0,
        clubName   : '',
        clubImage  : 'img/default_club.png',
        clubTag    : '',
        latitude   : 0,
        longitude  : 0,
        address    : '',
        description: '',
        virtualClub: false
    }
}

export function createCourseInfo(): CourseInfo {
    return {
        // courseName: "",

        coursePar: 0,

        photoUrl: "",

        holes   : [],
        courseId: 0,
        indexToUse: 1,
        teeBoxes: [],
    }
}

/**
 * Creates an instance of PlainScorecard
 * @param competition
 * @returns {{success: boolean, clientId: any, competition: boolean, playerRoundScores: any[]<PlayerRoundScores>, courses: any[]<CourseInfo>, finished: boolean}}
 */
export function createScorecard(competition: boolean) {
    return {
        success          : true,
        clientId         : global.generateUUID(),
        competition      : competition,
        playerRoundScores: new Array<PlayerRoundScores>(),
        courses          : new Array<CourseInfo>(),
        finished         : false
    };

}

export class ClubHelpItem {
    server?: string;
    url?: string;
}

