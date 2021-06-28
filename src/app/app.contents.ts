import { BookingCalendarPage } from './../pages/booking/booking-calendar/booking-calendar';
import { AddPlayerListPage } from './../pages/modal-screens/add-player-list/add-player-list';
import {AppVersion} from '@ionic-native/app-version';
import {BatteryStatus} from '@ionic-native/battery-status';
import {Camera} from '@ionic-native/camera';
import {DatePicker} from '@ionic-native/date-picker';
import {Device} from '@ionic-native/device';
import {Dialogs} from '@ionic-native/dialogs';
import {File} from '@ionic-native/file';
import {Geolocation} from '@ionic-native/geolocation';
import {InAppBrowser} from '@ionic-native/in-app-browser';
import {Keyboard} from '@ionic-native/keyboard';
import {Network} from '@ionic-native/network';
import {OneSignal} from '@ionic-native/onesignal';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {Toast} from '@ionic-native/toast';
import {Transfer} from '@ionic-native/transfer';
import {AuthenticationService} from '../authentication-service';
import {Focuser} from '../custom/focuser';
import {SafePipe} from '../custom/safe-pipe';
import {TranslationService} from '../i18n/translation-service';
import {TranslationPipe} from '../i18n/TranslationPipe';
import {AboutPage} from '../pages/about/about';
import {AddClubListPage} from '../pages/add-club-list/add-club-list';
import {AddLocationPage} from '../pages/add-location/add-location';
import {AddStateListPage} from '../pages/add-state-list/add-state-list';
import {ChangePasswordPage} from '../pages/change-password/change-password';
import {LeaderboardPage} from '../pages/competition/competition-leaderboard/competition-leaderboard';
import {LeaderboardFiltersPage} from '../pages/competition/competition-leaderboard/competition-leaderboard-filter/competition-leaderboard-filter';
import {CompetitionLeaderboardTeamFilter} from '../pages/competition/competition-leaderboard/leaderboard-team-filter';
import {EditProfilePage} from '../pages/edit-profile/edit-profile';
import {EventLogListPage} from '../pages/event-log/eventlog-list';
import {GameRoundScoringPage} from '../pages/gameround-scoring/gameround-scoring';
import {GameScoringExpandImage} from '../pages/gameround-scoring/gamescoring-expand-image';
import {GotoHoleModal} from '../pages/gameround-scoring/goto-hole-modal';
import {HoleGoogleMapPage} from '../pages/gameround-scoring/hole-googlemap';
import {ScorerAppHomePage} from '../pages/home/scorer-app-home';
import {ChangeCoursePage} from '../pages/normalgame/change-course/change-course';
import {ClubListPage} from '../pages/normalgame/club-list/club-list';
import {FavouriteListPage} from '../pages/player-favourite-list/player-favourite-list';
import {FriendImageShow} from '../pages/profile/friend-image-show';
import {ProfilePage} from '../pages/profile/profile';
import {ProfileImageEdit} from '../pages/profile/profile-image-edit';
import {DeleteScorecardModal} from '../pages/scorecard-display/delete-scorecard-modal';
import {ScorecardDisplayPage} from '../pages/scorecard-display/scorecard-display';
import {ScorecardLocalListPage} from '../pages/scorecard-local-list/scorecard-local-list';
import {SelectScorerPage} from '../pages/select-scorer/select-scorer';
import {SelectFlightPage} from '../pages/select-flight/select-flight';
import {ClubService} from '../providers/club-service/club-service';
import {CompetitionService} from '../providers/competition-service/competition-service';
import {ConnectionService} from '../providers/connection-service/connection-service';
import {EventLogService} from '../providers/eventlog-service/eventlog-service';
import {FiletransferService} from '../providers/filetransfer-service/filetransfer-service';
import {FriendService} from '../providers/friend-service/friend-service';
import {GeolocationService} from '../providers/geolocation-service/geolocation-service';
import {ImageService} from '../providers/image-service/image-service';
import {NormalgameService} from '../providers/normalgame-service/normalgame-service';
import {PlayerService} from '../providers/player-service/player-service';
import {PushNotificationService} from '../providers/pushnotification-service/pushnotification-service';
import {ScorecardService} from '../providers/scorecard-service/scorecard-service';
import {ScorecardStorageService} from '../providers/scorecard-service/scorecard-storage-service';
import {ServerInfoService} from '../providers/serverinfo-service/serverinfo-service';
import {RemoteHttpService} from '../remote-http';
import {MyGolfStorageService} from '../storage/mygolf-storage.service';
import {Preference} from '../storage/preference';
import {VolatileStorage} from '../storage/volatile-storage';
import {DeviceService} from '../providers/device-service/device-service';
import {AdService} from '../providers/ad-service/ad-service';
import { HandicapService } from '../providers/handicap-service/handicap-service';
import { BookingHomePage } from '../pages/booking/booking-home/booking-home';
import { BookingDetailsPage } from '../pages/booking/booking-details/booking-details';
import { BookingListPage } from '../pages/booking/booking-list/booking-list';
import { BookingSearchPage } from '../pages/booking/booking-search/booking-search';
import { StarterFlightListsPage } from '../pages/booking/starter-flight-lists/starter-flight-lists';
import { TeeFlightListsPage } from '../pages/booking/tee-flight-lists/tee-flight-lists';
import { PerformanceClubListPage } from '../pages/performance/club-list/club-list';
import { PlayerChartsPage } from '../pages/performance/player-charts/player-charts';
import { PerformanceCourseListPage } from '../pages/performance/course-list/course-list';
import { PerformanceSearchPlayerListPage } from '../pages/performance/search-player-list/search-player-list';
import { PerformanceFilters } from '../pages/performance/player-performance-filter/player-performance-filter';
import { NewContactPage } from '../pages/new-contact/new-contact';
import { CoursesDisplayPage } from '../pages/modal-screens/courses-display/courses-display';
import { CountryListPage } from '../pages/modal-screens/country-list/country-list';
import { PlayerClubHandicap } from '../pages/modal-screens/player-club-handicap/player-club-handicap';
import { TeeBoxPage } from '../pages/modal-screens/tee-box/tee-box';
import { EditTeeoffPage } from '../pages/modal-screens/edit-teeoff/edit-teeoff';
import { PlayerListPage } from '../pages/modal-screens/player-list/player-list';
import { TestPaymentPage } from '../pages/modal-screens/test-payment/test-payment';
import { PlayerSubscriptionPage } from '../pages/modal-screens/player-subscription/player-subscription';
import { CourseBox } from '../pages/modal-screens/course-box/course-box';
import { DescriptionBoxPage } from '../pages/modal-screens/description-box/description-box';
import { RecentClubListPage } from '../pages/performance/recent-club/recent-club';
import { FlightBuggyListsPage } from '../pages/booking/flight-buggy-lists/flight-buggy-lists';
import { ScorecardFilterPage } from '../pages/scorecard-filter/scorecard-filter';
import { HandicapHistoryDetailsPage } from '../pages/handicap-history-details/handicap-history-details';
import {DeleteHandicapHistoryDetailsModal} from '../pages/handicap-history-details/delete-handicap-history-details-modal';
import { TeeBuggyListPage } from '../pages/booking/tee-buggy-list/tee-buggy-list';
import { SearchPlayerListPage } from '../pages/search-player-list/search-player-list';
import { SelectDatesPage } from '../pages/modal-screens/select-dates/select-dates';
import { HandicapHistoryPage } from '../pages/handicap-history/handicap-history';
import {MygolfChartComponent} from "./charts/mygolf-chart";
import { HoleAnalysisFilterPage } from '../pages/hole-analysis-filter/hole-analysis-filter';
import { HoleAnalysisPage } from '../pages/hole-analysis/hole-analysis';
import { FriendListPage } from '../pages/friend-list/friend-list';
import { OriScorerAppHomePage } from '../pages/home/ori-scorer-app-home';
import { ClubFlightService } from '../providers/club-flight-service/club-flight-service';
import { CaddyListPage } from '../pages/modal-screens/caddy-list/caddy-list';
import { BuggyListPage } from '../pages/modal-screens/buggy-list/buggy-list';
import { BuggyDetailsPage } from '../pages/modal-screens/buggy-list/buggy-details/buggy-details';
import { CaddyDetailsPage } from '../pages/modal-screens/caddy-list/caddy-details/caddy-details';
import { BuggySeatingPage } from '../pages/modal-screens/buggy-seating/buggy-seating';
import { PricesDisplayPage} from '../pages/modal-screens/prices-display/prices-display';
import { BookingClubListPage} from '../pages/booking/booking-club-list/booking-club-list';
import {PlayerGroupsPage} from '../pages/player-groups/player-groups';
import { PlayerAddressPage } from '../pages/modal-screens/player-address/player-address';
import { ImageZoom } from '../pages/modal-screens/image-zoom/image-zoom';
import { TeeSlotListModal } from '../pages/modal-screens/tee-slot-list/tee-slot-list';
import {ExternalPaymentPage} from '../pages/modal-screens/external-payment/external-payment';
import { BookingChartPage } from '../pages/booking/booking-chart/booking-chart';
import { ChartcrudService } from '../providers/booking-chart-service/chartcrud.service';
import { ChartdateService } from '../providers/booking-chart-service/chartdate.service';
import { SlotsDetailComponent } from '../pages/booking/slots-detail/slots-detail';
// import { ClubBookingDetailsPage } from '../pages/booking/by-club/booking-details/booking-details';
import { ClubCalendarComponent } from '../pages/booking/club-calendar/club-calendar';
import { FaqPage } from '../pages/faq/faq';
import { ContactUsPage } from '../pages/contact-us/contact-us';
import { GroupBookingOption } from '../pages/modal-screens/group-booking-option/group-booking-option';
import { PaymentService } from '../providers/payment-service/payment-service';
import { ReferencedataService } from '../providers/referencedata-service/referencedata-service';
import { CustomSha1 } from '../custom/sha1';
import { RatingsListPage } from '../pages/modal-screens/ratings-list/ratings-list';
import { CaddyFlightListsPage } from '../pages/booking/caddy-flight-lists/caddy-flight-lists';
import { RefundBookingPlayersModal } from '../pages/modal-screens/refund-booking-players/refund-booking-players';
import { VoucherListModal } from '../pages/modal-screens/voucher-list/voucher-list';
import { MemberMenuModal } from '../pages/modal-screens/member-menu/member-menu';
import { PlayerVoucherModal } from '../pages/modal-screens/player-voucher/player-voucher';
import { CompetitionScoringListPage } from '../pages/competition/competition-scoring-list/competition-scoring-list';
import { CaddyFlightDetailsPage } from '../pages/booking/caddy-flight-details/caddy-flight-details';
import { AddPlayerTypeDiscountModal } from '../pages/modal-screens/player-voucher/add-player-type-discount/add-player-type-discount';
import { ManageVoucherModal } from '../pages/modal-screens/manage-voucher/manage-voucher';
import { PlayerMg2uCreditsModal } from '../pages/modal-screens/player-mg2u-credits/player-mg2u-credits';
import { SearchDiscountCompanyModal } from "../pages/modal-screens/player-voucher/search-discount-company/search-discount-company";
import { RedeemPlayerClubCreditsModal } from '../pages/modal-screens/redeem-player-club-credits/redeem-player-club-credits';
import { ManageDiscountCardModal } from "../pages/modal-screens/manage-discount-card/manage-discount-card";
import { ProgramClubListPage } from '../pages/modal-screens/player-voucher/program-club-list/program-club-list';
import { NotificationsPage } from '../pages/notifications/notifications';

import { ClubBookingListPage } from '../pages/booking/club-booking-list/club-booking-list';
import { CaddyScheduleDisplayPage } from '../pages/modal-screens/caddy-schedule-display/caddy-schedule-display';
import { CaddyUnavailabilityPage } from '../pages/modal-screens/caddy-list/caddy-unavailability/caddy-unavailability';

import { PlayerFacilityHomePage } from '../pages/booking/player-facility-home/player-facility-home';
import { PlayerRefundRedeemHistoryPage } from '../pages/modal-screens/player-refund-redeem-history/player-refund-redeem-history';
import { ClubRefundRedeemHistoryPage } from '../pages/booking/club-refund-redeem-history/club-refund-redeem-history';
import { mygolfUtils } from '../custom/mygolf2u-utils';

/**
 * Created by ashok on 06/02/17.
 */

export const PROVIDERS = [NormalgameService, CompetitionService,
                          ScorecardService, VolatileStorage, MyGolfStorageService,
                          TranslationService, AuthenticationService, Preference, RemoteHttpService,
                          GeolocationService, PlayerService, FiletransferService,
                          ClubService,FriendService, ImageService, ServerInfoService,
                          PushNotificationService, EventLogService, ScorecardStorageService, ConnectionService,
                          DeviceService, AdService, HandicapService, ClubFlightService, 
                          ChartcrudService, ChartdateService, PaymentService,
                          ReferencedataService, CustomSha1, mygolfUtils
];

export const PAGES = [/*HomePage*,*/ ScorerAppHomePage, SelectScorerPage, SelectFlightPage, AboutPage,
                      ScorecardLocalListPage, EventLogListPage,
                      GameRoundScoringPage,
                      ScorecardDisplayPage, DeleteScorecardModal,HoleGoogleMapPage, GotoHoleModal,
                      GameScoringExpandImage,
                      LeaderboardPage,
                      LeaderboardFiltersPage,
                      CompetitionLeaderboardTeamFilter,

                      AddClubListPage, AddLocationPage, AddStateListPage, ChangePasswordPage, EditProfilePage,
                      ChangeCoursePage, ClubListPage, FavouriteListPage, ProfilePage, ProfileImageEdit, FriendImageShow,
                      BookingHomePage,BookingDetailsPage, BookingListPage,BookingSearchPage, TeeFlightListsPage, StarterFlightListsPage,
                    
                      PerformanceClubListPage,
                      PlayerChartsPage,
                      PerformanceCourseListPage,
                      PerformanceSearchPlayerListPage,
                      PerformanceFilters,NewContactPage,
                      RecentClubListPage,
                      FlightBuggyListsPage,
                      ScorecardFilterPage,
                      HandicapHistoryDetailsPage,
                      HandicapHistoryPage,
                      TeeBuggyListPage,
                      SearchPlayerListPage,SelectDatesPage,
                      DeleteHandicapHistoryDetailsModal,
                      HoleAnalysisPage,HoleAnalysisFilterPage,
                    CoursesDisplayPage,CountryListPage,PlayerClubHandicap,TeeBoxPage,EditTeeoffPage,
                    PlayerListPage,TestPaymentPage,PlayerSubscriptionPage,CourseBox,DescriptionBoxPage,
                FriendListPage, OriScorerAppHomePage, CaddyListPage, CaddyDetailsPage, BuggyListPage, BuggyDetailsPage, AddPlayerListPage,
            PlayerGroupsPage,BuggySeatingPage,PricesDisplayPage,BookingClubListPage, PlayerAddressPage, ImageZoom,
        TeeSlotListModal,ExternalPaymentPage, BookingChartPage,
        BookingCalendarPage, SlotsDetailComponent, ClubCalendarComponent, FaqPage, ContactUsPage,
        GroupBookingOption, RatingsListPage, CaddyFlightListsPage, RefundBookingPlayersModal, VoucherListModal, MemberMenuModal, PlayerVoucherModal,
        CompetitionScoringListPage, CaddyFlightDetailsPage, AddPlayerTypeDiscountModal, ManageVoucherModal, PlayerMg2uCreditsModal, SearchDiscountCompanyModal,
        RedeemPlayerClubCreditsModal,
        ManageDiscountCardModal,
        ProgramClubListPage, NotificationsPage,
        ClubBookingListPage, CaddyScheduleDisplayPage, CaddyUnavailabilityPage,
        PlayerFacilityHomePage,
        PlayerRefundRedeemHistoryPage, ClubRefundRedeemHistoryPage
        // ClubBookingDetailsPage, 
    ];


/**
 * Created by ashok on 02/05/17.
 */
export const NativeProviders = [
    AppVersion,
    Camera,
    File,
    Network,
    Transfer,
    Geolocation,
    OneSignal,
    Toast,
    Keyboard,
    Device,
    Dialogs,
    DatePicker,
    InAppBrowser,
    StatusBar,
    SplashScreen,
    BatteryStatus
];
export const PIPES = [
    SafePipe,
    TranslationPipe,
    Focuser
]