/**
 * Created by Ashok on 30-06-2016.
 */
export interface Country
{
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

export function createCountryInfo(): Country {
    return {
        id: null,
        name: null,
        iso2Code: null,
        iso3Code: null,
        currencyId: null,
        currencyName: null,
        currencySymbol: null,
        sportCode: null,
        flagUrl: null,
    };
}

export interface Location
{
    id: number;
    countryId: string;
    countryName: string;
    state: string;
    city: string;
}
