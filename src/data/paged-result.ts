/**
 * The base interface for the paged results from server
 * Created by Ashok on 29-04-2016.
 */

export interface PagedResult
{
    totalPages: number;

    currentPage: number;

    totalItems: number;

    totalInPage: number;

    success: boolean;

    errorMessage?: string;

}
