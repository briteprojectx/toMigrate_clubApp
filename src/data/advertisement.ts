export class Advertisement {
    id: number;
    name: string;
    companyName: string;
    active: boolean;
    startDate: Date;
    endDate: Date;
    displayPeriod: number;
    rank: number;
    useIn: string [];
    externalUrl: string;
    imageUrl: string;
    updateCounter: number;
    autoInclude: boolean;
}
