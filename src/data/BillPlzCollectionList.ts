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
