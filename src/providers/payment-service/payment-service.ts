import {Injectable} from '@angular/core';
import {RequestMethod, Response} from '@angular/http';
import {isPresent} from 'ionic-angular/util/util';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {AuthenticationService} from '../../authentication-service';
import {SessionInfo} from '../../data/authentication-info';
import {ClubInfo} from '../../data/club-course';
import {CompetitionInfo} from '../../data/competition-data';
import {Location} from '../../data/country-location';
import {UploadResult} from '../../data/fileupload-result';
import {
    ClubMembership,
    PlayerGroup,
    PlayerGroupList,
    PlayerHomeInfo,
    PlayerInfo,
    PlayerList
} from '../../data/player-data';
import {ServerResult} from '../../data/server-result';
import * as global from '../../globals';
import * as globals from '../../globals';
import {JsonService} from '../../json-util';
import {SessionDataService} from '../../redux/session/session-data-service';
import {RemoteHttpService} from '../../remote-http';
import {ContentType, RemoteRequest} from '../../remote-request';
import {FiletransferService} from '../filetransfer-service/filetransfer-service';
import { TeeBox } from '../../data/tee-box';
import { PaymentDetails } from '../../data/payment-bill';
/*
 Generated class for the PaymentService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class PaymentService
{
    public static DefaultUserPhoto: string = "img/default_user.png";
    private session: SessionInfo;
    public BillPlzSB: string = "https://www.billplz-sandbox.com/api";
    constructor(private http: RemoteHttpService,
        private ftService: FiletransferService,
        private authService: AuthenticationService,
        private sessionDataService: SessionDataService) {

        this.sessionDataService.getSession().subscribe((session: SessionInfo)=>{
            this.session = session;
        })
        console.log("[Session] player-service : ",this.session)
    }

    /**
     * Gets the information for player home page
     * @returns {Observable<R>}
     */
    public getHomeInfo(country?: string): Observable<PlayerHomeInfo> {
        let remReq = new RemoteRequest(global.ServerUrls.playerMain,
            RequestMethod.Get,
            ContentType.URL_ENCODED_FORM_DATA, {
                country: this.session.countryId
            });
        return this.http.execute(remReq)
                   .map((resp: Response) => {
                       let homeInfo: PlayerHomeInfo = resp.json();
                       if (homeInfo && homeInfo.player) {
                           // if(!isPresent(homeInfo.player.photoUrl)) homeInfo.player.photoUrl = "document/contact/default_user.png"
                           // if (isPresent(homeInfo.player.photoUrl))
                           JsonService.deriveFullUrl(homeInfo.player, "photoUrl");
                           JsonService.deriveFullUrl(homeInfo.player, "thumbnail");
                           // else
                           //     homeInfo.player.photoUrl = PlayerService.DefaultUserPhoto;

                           JsonService.deriveDates(homeInfo.player, ["dateJoined"]);
                       }
                       if (homeInfo && homeInfo.compsActiveToday) {
                           homeInfo.compsActiveToday.forEach((c: CompetitionInfo) => {
                               JsonService.deriveDates(c, ["closeDate", "endDate", "openDate", "startDate"]);
                               JsonService.deriveFullUrl(c, "imageUrl");
                           });
                       }
                       return homeInfo;
                   }).catch(this.http.handleError);

    }

    /**
     * Gets the player information
     * @param playerId
     * @returns {Observable<R>}
     */
    public getPlayerInfo(playerId: number): Observable<PlayerInfo>{
        let request = new RemoteRequest(global.ServerUrls.getPlayerInfo,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA,{
                playerId: playerId
            });
        return this.http.execute(request)
            .map((resp: Response)=>{
                let playerInfo: PlayerInfo = resp.json();
                JsonService.deriveFullUrl(playerInfo, "photoUrl");
                return playerInfo;
            })
    }
    /**
     * Gets all the player groups where the current user in included
     */
    public getPlayerGroups(): Observable<PlayerGroupList> {
        let request = new RemoteRequest(global.ServerUrls.getPlayerGroups,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA);
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let pgList: PlayerGroupList = resp.json();
                       if (pgList && pgList.playerGroups) {
                           pgList.playerGroups.forEach((pg: PlayerGroup) => {
                               pg.players.forEach((p: PlayerInfo) => {
                                   this._processPlayerInfo(p);
                               });
                           });
                       }
                       return pgList;
                   }).catch(this.http.handleError);
    }

    public savePlayerGroup(groupName: string, playerIds: Array<number>): Observable<boolean> {
        let request = new RemoteRequest(global.ServerUrls.createPlayerGroup,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, {
                groupName: groupName,
                playerIds: playerIds
            });

        return this.http.execute(request)
                   .map((resp: Response) => {
                       let result: ServerResult = resp.json();
                       return result.success;
                   }).catch(this.http.handleError);
    }

    /**
     * Deletes the given player group for a given player group id
     * @param playerGroupId
     * @returns {Observable<R>}
     */
    public deletePlayerGroup(playerGroupId: number): Observable<boolean> {
        let request = new RemoteRequest(global.ServerUrls.deletePlayerGroup,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, {
                playerGroupId: playerGroupId,
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let result: ServerResult = resp.json();
                       return result.success;
                   }).catch(this.http.handleError);
    }

    /**
     * Add a new contact to myGolf. This will make sure that following information
     * are created.
     * <ul>
     *     <li>A mobile authentication record for authentication</li>
     *     <li>A Player record and associates with mobile authentication</li>
     *     <li>The new player is registered as friend
     *</ul>
     * @param firstName The first name. Mandatory
     * @param lastName The last name. Optional
     * @param gender The gender of the player. Mandatory
     * @param email The email. Mandatory. This will be used for authentication
     * @param phone The phone number of the player. Optional
     * @param handicap The handicap of the player. Optional. Based on gender it is set
     * to 24 or 36
     * @param teeoff The color of the tee off point
     * @returns {Observable<R>}
     */
    public addContact(firstName: string,
        lastName: string,
        gender: string,
        email: string,
        phone: string,
        handicap: number,
        teeoff: string,
        countryId?: string): Observable<PlayerInfo> {
        let request = new RemoteRequest(global.ServerUrls.registerFriend,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, {
                firstName: firstName,
                lastName : lastName,
                gender   : gender,
                email    : email,
                teeoff   : teeoff,
                phone    : phone,
                handicap : handicap,
                country  : countryId,
            });

        return this.http.execute(request)
                   .map((resp: Response) => {
                       let player: PlayerInfo = resp.json();
                       return player;
                   }).catch(this.http.handleError);
    }

    /**
     * Search the players
     * @param searchText The search text applied on player name,
     * @returns {Observable<R>}
     */
    public searchPlayers(searchText: string,
        activeOnly: boolean,
        pageNumber: number): Observable<PlayerList> {
        let request = new RemoteRequest(global.ServerUrls.searchPlayers,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                searchText: searchText,
                activeOnly: activeOnly,
                pageNumber: pageNumber
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let playerList: PlayerList = resp.json();
                       if (playerList && playerList.players)
                           playerList.players.forEach((p: PlayerInfo) => {
                               this._processPlayerInfo(p);
                           });
                       return playerList;
                   })
    }

    /**
     * Resets the password for given email in the server.
     * The new password generated by the server  is sent to
     * this email
     * @param email The email of the user account for which the
     * password needs to be reset
     * @returns {Observable<R>}
     */
    public forgotPassword(email: string): Observable<string> {
        let request = new RemoteRequest(globals.ServerUrls.forgotPassword,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA,
            {
                email: email
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let result: ServerResult = resp.json();
                       return result.message;
                   }).catch(this.http.handleError);

    }

    /**
     * Change the password of the user with a given email
     * @param email
     * @param password
     * @param newPassword
     * @returns {Observable<R>}
     */
    public changePassword(email: string, password: string, newPassword: string): Observable<string> {
        let request = new RemoteRequest(globals.ServerUrls.changePassword,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA,
            {
                email      : email,
                password   : password,
                newPassword: newPassword
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let result: ServerResult = resp.json();
                       return result.message;
                   }).catch(this.http.handleError);
    }

    /**
     * Update a photo for a given user
     * @param imageUrl The URL of the image to upload
     * @param mimeType The mime type of the image
     * @param subscriber The optional subscriber which is called when upload is success or
     * failed
     */
    // public updatePhoto(imageUrl: string, mimeType: string,
    //     subscriber?: Subscriber<UploadResult>) {
    //
    //     let options = {
    //         "playerId": this.session.playerId
    //     }
    //
    //     this.ftService.uploadFile(imageUrl, globals.ServerUrls.updatePhoto,
    //         mimeType, options, subscriber);
    // }

    public updatePlayerPhoto(imageUrl: string, mimeType: string, playerId?: number): Observable<UploadResult>{
        let options = {
            "playerId": (playerId)? playerId:this.session.playerId
        }
        return Observable.fromPromise(this.ftService.uploadFile(imageUrl,globals.ServerUrls.updatePhoto,
            mimeType, options));
    }
    /**
     * Update a given player profile
     * @param email The email of the user to update
     * @param firstName The first name
     * @param lastName The last name
     * @param gender The gender to update
     * @param teeoff Teeoff from
     * @param handicap The handicap
     * @returns {Observable<R>}
     */
    public updatePlayerProfile(email: string, firstName: string,
        lastName: string,
        gender: string,
        teeoff: string,
        handicap: number,
        phone: string,
        dateOfBirth?: string,
        playerId?: number,
        countryId?: string): Observable<ServerResult> {
            console.log("[teebox] player service : ",teeoff)
            // console.log("player-service data.countryId :", countryId)
        let data: any  = {
            firstName  : firstName,
            lastName   : lastName,
            email      : email,
            gender     : gender,
            teeoff     : teeoff,
            handicap   : handicap,
            phone      : phone,
            playerId   : playerId,
            dateOfBirth: dateOfBirth,
            country  : countryId,
            // (dateOfBirth)?moment(dateOfBirth).format("YYYY-MM-DD"):""
        };
        if (isPresent(playerId) && this.session.playerId === playerId)
            data.password = this.session.password;
        let request = new RemoteRequest(globals.ServerUrls.updatePlayerProfile,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, data);
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let result: ServerResult = resp.json();
                       return result;
                   }).catch(this.http.handleError);
    }

    /**
     * Update the NHS Number of the logged in player
     * @param nhsNumber
     * @returns {Observable<R>}
     */
    public updatePlayerNHS(nhsNumber: string): Observable<boolean> {
        let request = new RemoteRequest(globals.ServerUrls.updatePlayerNHS,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, {
                NHSNumber: nhsNumber
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let result: ServerResult = resp.json();
                       return result.success;
                   });
    }

    /**
     * Gets all the club membership details ordered by club names
     * @returns {Observable<R>}
     */
    public getPlayerMemberships(): Observable<Array<ClubMembership>> {
        let request = new RemoteRequest(globals.ServerUrls.playerMemberships,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA);
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let memberships: Array<ClubMembership> = resp.json();
                       memberships.forEach((cm: ClubMembership) => {
                           if (cm.club && cm.club.clubImage)
                               JsonService.deriveFullUrl(cm.club, "cubImage");
                       });
                       return memberships;
                   })
    }

    /**
     * Update the club membership for a logged in player
     * @param clubId The ID of the club
     * @param membership The membership number
     * @param homeclub Specifies whether this is home club
     * @returns {Observable<R>}
     */
    public updateClubMembership(clubId: number, membership: string,
        homeclub: boolean = false): Observable<ClubMembership> {
        let request = new RemoteRequest(globals.ServerUrls.updatePlayerMembership,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, {
                clubId          : clubId,
                membershipNumber: membership,
                homeClub        : homeclub
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let membership: ClubMembership = resp.json();
                       JsonService.deriveFullUrl(membership.club, "cubImage");
                       return membership;
                   })
    }

    /**
     * Deletes the club membership of logged in player
     * @param clubId
     * @returns {Observable<R>}
     */
    public deleteClubMembership(clubId: number): Observable<boolean> {
        let request = new RemoteRequest(globals.ServerUrls.deletePlayerMembership,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, {
                clubId: clubId
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let result: ServerResult = resp.json();
                       return result.success;
                   })
    }

    /**
     * Gets the favorite locations for logged in player
     * @returns {Observable<R>}
     */
    public getFavoriteLocations(): Observable<Array<Location>> {
        let request = new RemoteRequest(globals.ServerUrls.getPlayerFavoriteLocations,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA);
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let result: Array<Location> = resp.json();
                       return result;
                   }).catch(this.http.handleError);
    }

    /**
     * Get Adds a favorite location for the logged in user. At least one of the
     * country, state or country must be provided
     * @param country The country (Optional)
     * @param state The state (optional)
     * @param city The city (Optional)
     * @returns {Observable<R>}
     */
    public addFavoriteLocation(country: string,
        state: string,
        city: string): Observable<boolean> {
        let request = new RemoteRequest(globals.ServerUrls.addPlayerFavoriteLocation,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, {
                country: country,
                state  : state,
                city   : city
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let result: ServerResult = resp.json();
                       return result.success;
                   }).catch(this.http.handleError);
    }

    /**
     * Deletes a favorite location for the logged in player
     * @param country The country ID
     * @param state The state
     * @param city The city
     * @returns {Observable<R>}
     */
    public deleteFavoriteLocation(country: string,
        state: string,
        city: string): Observable<boolean> {
        let request = new RemoteRequest(globals.ServerUrls.deletePlayerFavoriteLocation,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, {
                country: country,
                state  : state,
                city   : city
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let result: ServerResult = resp.json();
                       return result.success;
                   }).catch(this.http.handleError);
    }

    /**
     * Gets the favorite clubs for the given user.
     * @param allEffective If set to true, all the clubs (even added as part of locations)
     * are returned.
     * @returns {Observable<R>}
     */
    public getFavoriteClubs(allEffective: boolean): Observable<Array<ClubInfo>> {
        let request = new RemoteRequest(globals.ServerUrls.getPlayerFavoriteClubs,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                allEffective: allEffective
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let result: Array<ClubInfo> = resp.json();
                       if (result && result.length)
                           result.forEach(c => {
                               JsonService.deriveFullUrl(c, "cubImage");
                           });

                       return result;
                   }).catch(this.http.handleError);
    }

    /**
     * Add a favorite club for the user exclusively
     * @param clubdId The ID of the clubs
     * @returns {Observable<R>}
     */
    public addFavoriteClub(clubdId: number): Observable<boolean> {
        let request = new RemoteRequest(globals.ServerUrls.addPlayerFavoriteClub,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, {
                clubId: clubdId
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let result: ServerResult = resp.json();
                       return result.success;
                   }).catch(this.http.handleError);
    }

    /**
     * Deletes a club as favorite for a given player
     * @param clubdId The ID of the club to be removed as favorite
     * @returns {Observable<R>}
     */
    public deleteFavoriteClub(clubdId: number): Observable<boolean> {
        let request = new RemoteRequest(globals.ServerUrls.deletePlayerFavoriteClub,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, {
                clubId: clubdId
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let result: ServerResult = resp.json();
                       return result.success;
                   }).catch(this.http.handleError);
    }

    /**
     * Gets the player handicap either from database or NHS site
     * @param userNHS If set to true, the handicap index will be derived from NHS site using NHS number
     * otherwise returns from gs_player table
     * @returns {Observable<R>}
     */
    public getPlayerHandicapIndex(userNHS: boolean): Observable<number> {
        let request = new RemoteRequest(globals.ServerUrls.getPlayerHandicapIndex,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                useNHS: userNHS
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let index = parseFloat(resp.text());
                       return index;
                   }).catch(this.http.handleError);
    }

    /**
     * Derives the club handicaps for logged in player. If NHS number exists, then the
     * handicap index for the player is obtained from NHS site. Then for each club where
     * user has membership, it derives the handicap.
     * @returns {Observable<R>}
     */
    public deriveClubHandicaps(): Observable<boolean> {
        let request = new RemoteRequest(globals.ServerUrls.updatePlayerClubHandicap,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA);
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let result: ServerResult = resp.json();
                       return result.success;
                   }).catch(this.http.handleError);
    }

    private _processPlayerInfo(p: PlayerInfo) {
        // if(isPresent(p.photoUrl))
        //     JsonService.deriveFullUrl(p, "photoUrl");
        // else p.photoUrl = PlayerService.DefaultUserPhoto;
        JsonService.deriveFullUrl(p, "photoUrl");
        JsonService.deriveFullUrl(p, "thumbnail");
        JsonService.deriveDates(p, ["dateJoined"]);
    }


    public testAPIcall(){
        console.log("Test API : server urls",global.ServerUrls.playerMain);
        console.log("Test API : Req method", RequestMethod.Get);
        console.log("Test API : Content Type", ContentType.URL_ENCODED_FORM_DATA);
    }


       /**
     * Gets the favorite locations for logged in player
     * @returns {Observable<R>}
     */
    public getCountryList(): Observable<Array<any>> {
        let request = new RemoteRequest(globals.ServerUrls.getCountries,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA);
        return this.http.execute(request)
                   .map((resp: Response) => {
                       console.log("Country List : ", resp)
                       let result: Array<any> = resp.json();
                       return result;
                   }).catch(this.http.handleError);
    }

    public getTeeBox(): Observable<Array<any>> {
        let request = new RemoteRequest(global.ServerUrls.getTeebox,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA);
        return this.http.execute(request)
                   .map((resp: Response) => {
                       console.log("[Teebox] :",resp)
                    //    return null
                       let tbList: Array<TeeBox> = resp.json();
                       return tbList;
                   }).catch(this.http.handleError);
    }

    public getHcpIdxSubs(p?: PlayerInfo): Observable<any> {
        let request = new RemoteRequest(global.ServerUrls.getHcpIdxSubscription,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                playerId: this.session.playerId
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       console.log("[Hcp Idx Subs] Service :",resp)
                    //    return null
                       let tbList: any = resp.json();
                       return tbList;
                   }).catch(this.http.handleError);
    }

    public requestTrialSubs(p?: PlayerInfo): Observable<any> {
        let request = new RemoteRequest(global.ServerUrls.getTrialSubscription,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, {
                playerId: this.session.playerId
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       console.log("[Hcp Idx Subs] Service :",resp)
                    //    return null
                       let tbList: any = resp.json();
                       return tbList;
                   }).catch(this.http.handleError);
    }

    public genHcpCalc(p?: PlayerInfo): Observable<any> {
        let request = new RemoteRequest(global.ServerUrls.generateHcpCalculation,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, {
                playerId: this.session.playerId
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       console.log("[Hcp Calculation] Service :",resp)
                    //    return null
                       let tbList: any = resp.json();
                       return tbList;
                   }).catch(this.http.handleError);
    }

    public testCall(): Observable<any> {
        //let BASIC_KEY = 'ZmI1MmI4OGUtMDYwOS00NGUwLWFiOGEtYzg0YjY0YTkyYjM3';
        let my_message = 'Test message 2020-04-09';
        let amount = 15.13*100;
        let paid_date = '2020-4-9';
        let paid_days = '15';
        // let headers: new HttpHeaders({
        //     'Content-Type': 'application/json'
        //   })

        let paramsText = '?my_message='+my_message+'&amount='+amount+'&paid_date='+paid_date+'&paid_days='+paid_days
        let request = new RemoteRequest(global.ServerUrls.testCall+paramsText,
            RequestMethod.Post, '', {
                my_message: my_message,
                amount: amount,
                paid_date: paid_date,
                paid_days: paid_days
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       console.log("[Payment] Test Call :",resp)
                    //    return null
                       let data: any = resp.json();
                       return data;
                   }).catch(this.http.handleError);
    }

    public createCollection(): Observable<any> {
        //let BASIC_KEY = 'ZmI1MmI4OGUtMDYwOS00NGUwLWFiOGEtYzg0YjY0YTkyYjM3';
        // let my_message = 'Test message 2020-04-09';
        // let amount = 15.13*100;
        // let paid_date = '2020-4-9';
        // let paid_days = '15';
        // let headers: new HttpHeaders({
        //     'Content-Type': 'application/json'
        //   })

        let paramData = {
            "competition_id": 445,
            "title": "test collection for 445",
            "created_by": 199
        }

        // let paramsText = '?my_message='+my_message+'&amount='+amount+'&paid_date='+paid_date+'&paid_days='+paid_days
        let request = new RemoteRequest(global.ServerUrls.billplz_createCollection,
            RequestMethod.Post, '', paramData);
            // , {
            //     'Authorization' : 'Basic ZmI1MmI4OGUtMDYwOS00NGUwLWFiOGEtYzg0YjY0YTkyYjM3Og=='
            // }
        return this.http.execute(request)
                   .map((resp: Response) => {
                       console.log("[Payment] Create Collection :",resp)
                    //    return null
                       let data: any = resp.json();
                       return data;
                   }).catch(this.http.handleError);
    }

    public createBill(collectionId?: string, paymentDetails?: PaymentDetails, paymentGateway?: string): Observable<any> {
        //let BASIC_KEY = 'ZmI1MmI4OGUtMDYwOS00NGUwLWFiOGEtYzg0YjY0YTkyYjM3';
        // let _email = 'chrono.shindou@gmail.com'
        // let _amount = 77*100;
        // let _name = 'Nik Zakiuddin';
        // let _mobile = '60123456789';
        // let _description = 'Test new bill';
        // let headers: new HttpHeaders({
        //     'Content-Type': 'application/json'
        //   })

        // let paramData = {  
        //     "collection_id": collectionId,
        //     "amount": _amount,
        //     "email": _email,
        //     "name": _name,
        //     "mobile": _mobile,
        //     "description": _description,
        //     "currency": 'MYR',
        //     "paid_by": 199,
        //     "callback_url": 'http://devlet.mygolf2u.com/rest/payment/callback',
        //     "redirect_url": 'http://m.mygolf2u.com/test/payment_redirect.html',//'http://devlet.mygolf2u.com/rest/payment/redirect'
        // }

        let _paymentUrl;
        let _paymentGateway = 'billplz';
        if(paymentGateway) _paymentGateway = paymentGateway;
        _paymentUrl = _paymentGateway==='ipay88'?global.ServerUrls.ipay88_createBill:global.ServerUrls.billplz_createBill;
        // let paramsText = '?my_message='+my_message+'&amount='+amount+'&paid_date='+paid_date+'&paid_days='+paid_days
        console.log("create bill", _paymentGateway,_paymentUrl,paymentDetails)
        let request = new RemoteRequest(_paymentUrl,
            RequestMethod.Post, '', paymentDetails);
            // , {
            //     'Authorization' : 'Basic ZmI1MmI4OGUtMDYwOS00NGUwLWFiOGEtYzg0YjY0YTkyYjM3Og=='
            // }
        return this.http.execute(request)
                   .map((resp: Response) => {
                       console.log("[Payment] Create Local Collection :",resp)
                    //    return null
                       let data: any = resp.json();
                       return data;
                   }).catch(this.http.handleError);

    }

    // callipay88page(paymentDetails) {
 
    //     let _paymentUrl;
    //     _paymentUrl = 'https://payment.ipay88.com.my/epayment/entry.asp';
    //         // let paramsText = '?my_message='+my_message+'&amount='+amount+'&paid_date='+paid_date+'&paid_days='+paid_days
    //         // _paymentUrl = '/ipay88page'
    //         console.log("service call ipay88 page")
    //         let request = new RemoteRequest(_paymentUrl,
    //             RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, paymentDetails,
    //             //  {
    //             //     'Referer':'http://devlet.mygolf2u.com'
    //             // }
    //             );
    //             // , {
    //             //     'Authorization' : 'Basic ZmI1MmI4OGUtMDYwOS00NGUwLWFiOGEtYzg0YjY0YTkyYjM3Og=='
    //             // }
    //         return this.http.execute(request)
    //                    .map((resp: Response) => {
    //                        console.log("[Payment] Create Local Collection :",resp)
    //                     //    return null
    //                        let data: any = resp.json();
                           
    //                        console.log("[Payment] Create Local Collection - data:",data )
    //                        return data;
    //                    }).catch(this.http.handleError);
    // }

    public createRemoteBill(collectionId?: string, paymentDetails?: any): Observable<any> {
        //let BASIC_KEY = 'ZmI1MmI4OGUtMDYwOS00NGUwLWFiOGEtYzg0YjY0YTkyYjM3';
        let _email = 'chrono.shindou@gmail.com'
        let _amount = 15.13*100;
        let _name = 'Nik Zakiuddin';
        let _mobile = '60123456789';
        let _description = 'Test Remote bill';
        // let headers: new HttpHeaders({
        //     'Content-Type': 'application/json'
        //   })

        let paramData = { 
            "collection_id": collectionId,
            "amount": _amount,
            "email": _email,
            "name": _name,
            "mobile": _mobile,
            "description": _description,
            "currency": 'MYR',
            "paid_by": 176,
            "callback_url": 'http://devlet.mygolf2u.com/rest/payment/callback',
            "redirect_url": 'http://m.mygolf2u.com/test/payment_redirect.html',
        }

        // let paramsText = '?my_message='+my_message+'&amount='+amount+'&paid_date='+paid_date+'&paid_days='+paid_days
        let request = new RemoteRequest('/v3/bills',
            RequestMethod.Post, '', paramData, {
                'Authorization' : 'Basic ZmI1MmI4OGUtMDYwOS00NGUwLWFiOGEtYzg0YjY0YTkyYjM3Og==',
            });
            // , {
            //     'Authorization' : 'Basic ZmI1MmI4OGUtMDYwOS00NGUwLWFiOGEtYzg0YjY0YTkyYjM3Og=='
            // }
        return this.http.execute(request)
                   .map((resp: Response) => {
                       console.log("[Payment] Create Remote Collection :",resp)
                    //    return null
                       let data: any = resp.json();
                       return data;
                   }).catch(this.http.handleError);

    }

    public getLocalCollections(collectionId?: string): Observable<any> {
        let _collectionId = 'dhwgjqsb';
        if(collectionId) _collectionId = collectionId;
        let request = new RemoteRequest(global.ServerUrls.billplz_getRemoteCollection,
            RequestMethod.Get, '', {
                collectionId: _collectionId
            });
            // , {
            //     'Authorization' : 'Basic ZmI1MmI4OGUtMDYwOS00NGUwLWFiOGEtYzg0YjY0YTkyYjM3Og=='
            // }
        return this.http.execute(request)
                   .map((resp: Response) => {
                       console.log("[Payment] Get Servlet Collection :",resp)
                    //    return null
                       let data: any = resp.json();
                       return data;
                   }).catch(this.http.handleError);
    }

    public getCompCollection(competitionId?: number): Observable<Array<any>> {
        let _competitionId; // = 'dhwgjqsb';
        if(competitionId) _competitionId = competitionId;
        let request = new RemoteRequest(global.ServerUrls.billplz_getCompCollection,
            RequestMethod.Get, '', {
                competition: _competitionId
            });
            // , {
            //     'Authorization' : 'Basic ZmI1MmI4OGUtMDYwOS00NGUwLWFiOGEtYzg0YjY0YTkyYjM3Og=='
            // }
        return this.http.execute(request)
                   .map((resp: Response) => {
                       console.log("[Payment] Get Servlet Comp Collection :",resp)
                    //    return null
                       let data: any = resp.json();
                       return data;
                   }).catch(this.http.handleError);
    }

    public getBillCompetition(competitionId?: number): Observable<Array<any>> {
        let _competitionId; // = 'dhwgjqsb';
        if(competitionId) _competitionId = competitionId;
        let request = new RemoteRequest(global.ServerUrls.getBillCompetition,
            RequestMethod.Get, '', {
                competition: _competitionId
            });
            // , {
            //     'Authorization' : 'Basic ZmI1MmI4OGUtMDYwOS00NGUwLWFiOGEtYzg0YjY0YTkyYjM3Og=='
            // }
        return this.http.execute(request)
                   .map((resp: Response) => {
                       console.log("[Payment] Get Servlet Bill Competition :",resp)
                    //    return null
                       let data: any = resp.json();
                       return data;
                   }).catch(this.http.handleError);
    }

     public getBill(billId?: string,paymentGateway?: string): Observable<any> {
        let _billId = 'wmwsqlsx'; //collection 'dhwgjqsb';
        if(billId) _billId = billId;
        
        let _paymentGateway = 'billplz';
        let _paymentUrl;
        if(paymentGateway) _paymentGateway = paymentGateway;
        console.log("get bill", _paymentGateway, paymentGateway)
        _paymentUrl = _paymentGateway==='ipay88'?global.ServerUrls.ipay88_getLocalBill:global.ServerUrls.billplz_getRemoteBill;
        let request = new RemoteRequest(_paymentUrl,
            RequestMethod.Get, '', {
                billId: _billId
            });
            // , {
            //     'Authorization' : 'Basic ZmI1MmI4OGUtMDYwOS00NGUwLWFiOGEtYzg0YjY0YTkyYjM3Og=='
            // }
        return this.http.execute(request)
                   .map((resp: Response) => {
                       console.log("[Payment] Get Servlet Bill :",resp)
                    //    return null
                       let data: any = resp.json();
                       return data;
                   }).catch(this.http.handleError);
    }

    public getRemoteCollections(): Observable<any> {
        let BASIC_KEY = 'ZmI1MmI4OGUtMDYwOS00NGUwLWFiOGEtYzg0YjY0YTkyYjM3Og==';
        // let my_message = 'Test message 2020-04-09';
        // let amount = 15.13*100;
        // let paid_date = '2020-4-9';
        // let paid_days = '15';
        // let headers: new HttpHeaders({
        //     'Content-Type': 'application/json'
        //   })

        // let paramData = {
        //     "competition_id": 445,
        //     "title": "test collection for 445",
        //     "created_by": 199
        // }
        // this.BillPlzSB+

        // let paramsText = '?my_message='+my_message+'&amount='+amount+'&paid_date='+paid_date+'&paid_days='+paid_days
        let request = new RemoteRequest('/v3/collections',
            RequestMethod.Get, 'application/json; charset=utf-8', {}, {
                'Authorization': 'BASIC '+ BASIC_KEY
            });
            // , {
            //     'Authorization' : 'Basic ZmI1MmI4OGUtMDYwOS00NGUwLWFiOGEtYzg0YjY0YTkyYjM3Og=='
            // }
        return this.http.execute(request)
                   .map((resp: Response) => {
                       console.log("[Payment] Get BillPlz Collection :",resp)
                    //    return null
                       let data: any = resp.json();
                       return data;
                   }).catch(this.http.handleError);
    }

    public getIpay88Key(): Observable<any> {
        let request = new RemoteRequest(global.ServerUrls.ipay88_merchantKey ,
            RequestMethod.Get, 'application/json; charset=utf-8');
            // , {
            //     'Authorization' : 'Basic ZmI1MmI4OGUtMDYwOS00NGUwLWFiOGEtYzg0YjY0YTkyYjM3Og=='
            // }
        return this.http.execute(request)
                   .map((resp: Response) => {
                       console.log("[Payment] Get ipay88 Key :",resp)
                    //    return null
                       let data: any = resp.json();
                       return data;
                   }).catch(this.http.handleError);
    }

    public getPaymentGateway(countryId?: string,paymentGatewayId?: string): Observable<any> {
        let _params = {};
        _params['countryId'] = countryId?countryId:'';
        _params['paymentGatewayId'] = paymentGatewayId;
        let request = new RemoteRequest(global.ServerUrls.getPaymentGateway ,
            RequestMethod.Get, 'application/json; charset=utf-8', _params);
            // , {
            //     'Authorization' : 'Basic ZmI1MmI4OGUtMDYwOS00NGUwLWFiOGEtYzg0YjY0YTkyYjM3Og=='
            // }
        return this.http.execute(request)
                   .map((resp: Response) => {
                       console.log("[Payment] Get Payment Gateway :",resp)
                    //    return null
                       let data: any = resp.json();
                       return data;
                   }).catch(this.http.handleError);
    }
    
}
