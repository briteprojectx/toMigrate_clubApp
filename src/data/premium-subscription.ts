// import {PagedResult} from "./paged-result";
// import {ServerResult} from "./server-result";
// import {CompetitionInfo} from "./competition-data";
// import {AddressInfo} from "./address-data";
// import {ClubInfo} from "./club-course";
// import { ClubHandicap } from "./handicap-history";
/**
 * The interface which represents the Player info
 * Created by Ashok on 12-04-2016.
 */

 export class PremiumFeature
 {
     id : string;
     name : string;
     availableToPlayers : boolean;
     availableToClubs : boolean;
     availableToOrganizers : boolean;
     description : string;
     basePeriod : string;
 }

export class HandicapIndexSubscription
{
    active : boolean;
    underGracePeriod : boolean;
    feature : PremiumFeature;
    quantityBought : number;
    unlimited : boolean;
    subscription : boolean;
    startDate? : Date;
    endDate? : Date;
    graceDays : number;
    quantityUsed : number;
    subscriptionType?: string;
  }

export function createHandicapIndexSubscription()
{
    return {
        active : false,
        underGracePeriod : false,
        feature : new Array<PremiumFeature>(),
        quantityBought : 0,
        unlimited : false,
        subscription : false,
        graceDays : 0,
        quantityUsed : 0,
        startDate: '2019-01-01',
        endDate: '2019-12-31'
    }
}


export interface PremiumFeatureBundle {
    id: number;
    name: string;
    bundleSize: number;
    bundlePeriod: number;
    unlimited: boolean;
    prices: Array<PremiumFeaturePrice>;
}

// PremiumFeatureBundle {
//     private Integer id;
//     private String name;
//     private Integer bundleSize;
//     private Integer bundlePeriod;
//     private boolean unlimited;
//     private Set<PremiumFeaturePrice> prices;
// }

export interface PremiumFeaturePrice {
    id: number;
    country: string;
    currency: string;
    startDate: Date;
    endDate: Date;
    price: number;
    pricingType: string;
    // private Long id;
    // private String country;
    // private String currency;
    // private Date startDate;
    // private Date endDate;
    // private BigDecimal price;
    // private String pricingType;
}
