// import { CollectionInfo } from './CollectionInfo';

export class BillPlzCollectionList {
    collections: Array<CollectionInfo>;
    page: number;

}

export interface CollectionInfo {
    id: string;
    logo?: Array<any>;
    split_payment?: Array<any>;
    status: string;
    title: string;
}

export function createCollectionList(): BillPlzCollectionList {
    return {
        collections: new Array<CollectionInfo>(),
        page: 0
    };
}

export function createCollection(): CollectionInfo {
    return {
        id: '0',
        logo: new Array<any>(),
        split_payment: new Array<any>(),
        status: 'status',
        title: 'title'
    }
}

export interface PaymentDetails {
        collection_id: string;
        amount: number;
        email: string;
        name: string;
        mobile?: string;
        description: string;
        currency: string;
        paid_by: number; //player_id
        paid_for: Array<PlayerPaid>;
        // player: {
        //   player_id: number;
        //   competition_id: number;
        // };
        // competition_id: number;
        callback_url?: string;
        redirect_url?: string;
        bill_type?: string; //competition, competition_player, player_round, premium_feature_club, premium_feature_organizer, premium_feature_player
        bill_type_id?: number;
        // callback_url: 'http://devlet.mygolf2u.com/rest/payment/callback',
        // redirect_url: 'http://m.mygolf2u.com/test/payment_redirect.html',
        payment_type?: string; //B-booking, D-deposit
        payer_type?: string; //R-registered, P-one player only, U-new (paid by someone else), C-captured by club user (paid by - auth_id)

        paying_player_name?: string;
        paying_player_email?: string;
        paying_player_phone?: string;

}

export interface PlayerPaid {
    player_id: number;
}

export interface billDetails {
    
}