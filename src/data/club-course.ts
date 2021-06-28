/**
 * Created by Ashok on 03-05-2016.
 */
import {PagedResult} from "./paged-result";
/**
 * Information about a golf course.
 * This should be part of information which already has
 * club information
 */
export interface CourseInfo
{

    courseId?: number;
    gameCourseId?: number;
    whichNine?: number;

    courseName: string;

    coursePar: number;

    photoUrl: string;

    description?: string;

    holes: Array<CourseHoleInfo>;
    indexToUse?: number;
    teeBoxes: Array<TeeBoxInfo>;
    displayOrder?: number;
}

export interface TeeBoxInfo 
{
    id: number;
    name: string;
    image: string;
    description: string;
}

export function createCourseInfo(): CourseInfo {
    return {
        courseName: "",

        coursePar: 0,

        photoUrl: "",

        holes   : [],
        courseId: 0,
        indexToUse: 1,
        teeBoxes: [],
    }
}
/**
 * Information about a hole in the course
 */
export interface CourseHoleInfo
{

    holeId: number;

    courseHoleNumber?: number;

    holeNo: number;

    holePar: number;

    latitude: number;

    longitude: number;

    holeDescription: string;

    holeDistanceBlack: number;

    holeDistanceBlue: number;

    holeDistanceRed: number;

    holeDistanceWhite: number;

    holeImage: string;

    holeIndex: number;

    holeIndexIn?: number;
}

export interface ClubInfo
{
    clubId: number;
    clubName: string;
    clubImage: string;
    clubTag: string;
    latitude: number;
    longitude: number;
    address: string;
    description: string;
    courses?: Array<CourseInfo>;
    virtualClub: boolean;
    timeZone?: string;
}

export interface  ClubList extends PagedResult
{
    clubs: Array<ClubInfo>
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
