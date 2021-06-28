import {Injectable} from "@angular/core";
import {RequestMethod, Response} from "@angular/http";
import "rxjs/add/operator/map";
import {RemoteHttpService} from "../../remote-http";
import {Observable} from "rxjs/Observable";
import {PlayerList, PlayerInfo, FriendRequestList, FriendRequest} from "../../data/player-data";
import {RemoteRequest, ContentType} from "../../remote-request";
import * as global from "../../globals";
import {JsonService} from "../../json-util";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import {ServerResult} from "../../data/server-result";
/*
 Generated class for the FriendService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class FriendService
{

    constructor(private http: RemoteHttpService) {
    }

    /**
     * Search friends of a given player. The player id header is automatically
     * populated by the Http request
     * @param search The optional search text
     * @returns {Observable<R>} Returns Observable which can be subscribed. The next method
     * has PlayerList object as parameter
     */
    public searchFriends(search: string, forGame: boolean = false): Observable<PlayerList> {
        let request = new RemoteRequest(global.ServerUrls.friendsList,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                search       : search,
                forNormalGame: forGame
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let playerList: PlayerList = resp.json();
                       console.log("search friends", playerList)
                       //Adjust the dates and image url
                       if (playerList.players && playerList.players.length) {
                           playerList.players.forEach((p: PlayerInfo) => {
                               JsonService.deriveDates(p, ["dateJoined", "friendSince"]);
                               JsonService.deriveFulImageURL(p, "photoUrl");
                               JsonService.deriveFulImageURL(p, "thumbnail");
                               
                               p.countryId = p.addressInfo.countryId;
                               p.countryName = p.addressInfo.countryName;
                            //    JsonService.deriveFullUrl(p, "photoUrl");
                            //    JsonService.deriveFullUrl(p, "thumbnail");
                           });
                       }
                       return playerList;
                   }).catch(this.http.handleError);
    }

    /**
     * Search players who are non-friends of the logged in player
     * @param search The optional search text
     * @returns {Observable<R>} Returns the observable with PlayerList
     */
    public searchNonFriends(search: string, pageNo: number = 1): Observable<PlayerList> {
        let request = new RemoteRequest(global.ServerUrls.nonFriendPlayers,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, {
                searchText: search,
                pageNumber: pageNo
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let playerList: PlayerList = resp.json();
                       if (playerList.players && playerList.players.length) {
                           playerList.players.forEach((p: PlayerInfo) => {
                               JsonService.deriveDates(p, ["dateJoined", "friendSince"]);
                            //    JsonService.deriveFullUrl(p, "photoUrl");
                            //    JsonService.deriveFullUrl(p, "thumbnail");
                               JsonService.deriveFulImageURL(p, "photoUrl");
                               JsonService.deriveFulImageURL(p, "thumbnail");
                               p.countryId = p.addressInfo.countryId;
                               p.countryName = p.addressInfo.countryName;
                           });
                       }
                       return playerList;
                   }).catch(this.http.handleError);
    }

    public searchFriendRequests(params?: any): Observable<FriendRequestList> {
        let _params = params?params:null;
        let request = new RemoteRequest(global.ServerUrls.friendsPending,
            RequestMethod.Get, ContentType.URL_ENCODED_FORM_DATA, _params
            // {
            //     search: _params["search"],
            //     pageSize: _params["pageSize"]
            // }
            );
        return this.http.execute(request)
                   .map((resp: Response) => {
                       let requestList: FriendRequestList = resp.json();
                       //Adjust the dates and image url
                       if (requestList.friendRequests && requestList.friendRequests.length) {
                           requestList.friendRequests.forEach((p: FriendRequest) => {
                               JsonService.deriveDates(p.player, ["dateJoined"]);
                            //    JsonService.deriveFullUrl(p.player, "photoUrl");
                            //    JsonService.deriveFullUrl(p.player, "thumbnail");
                               JsonService.deriveFulImageURL(p, "photoUrl");
                               JsonService.deriveFulImageURL(p, "thumbnail");
                               p.player.countryId = p.player.addressInfo.countryId;
                               p.player.countryName = p.player.addressInfo.countryName;
                           });
                       }
                       return requestList;
                   }).catch(this.http.handleError);
    }

    /**
     * Send a friend request to the given given player. The ID of the player who is
     * sending request (signed in user) is automatically included as the request header
     * @param playerId The ID of the player to whom the friend request is sent
     * @returns {Observable<R>} Returns an Observable object which you can subscribe to
     * monitor the server call.
     */
    public sendFriendRequest(playerId: number): Observable<ServerResult> {
        let request = new RemoteRequest(global.ServerUrls.friendRequestSend,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, {
                requestedPlayerId: playerId
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       return resp.json();
                   }).catch(this.http.handleError);
    }

    /**
     * Accept a friend request from a given player. The ID of the player who is
     * accepting request (signed in user) is automatically included as the request header
     * @param playerId The ID of the player who has requested the friendship
     * @returns {Observable<R>} Returns an Observable object which you can subscribe to
     * monitor the server call.
     */
    public acceptFriendRequest(playerId: number): Observable<ServerResult> {
        let request = new RemoteRequest(global.ServerUrls.friendRequestAccept,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, {
                requestingPlayerId: playerId
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       return resp.json();
                   }).catch(this.http.handleError);
    }

    /**
     * Cancells the friend request pending between logged in player and another player
     * @param playerId the id of the other player
     * @returns {Observable<R>}
     */
    public cancelFriendRequest(playerId: number): Observable<ServerResult> {
        let request = new RemoteRequest(global.ServerUrls.friendRequestCancel,
            RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, {
                otherPlayerId: playerId
            });
        return this.http.execute(request)
                   .map((resp: Response) => {
                       return resp.json();
                   }).catch(this.http.handleError);
    }
}
