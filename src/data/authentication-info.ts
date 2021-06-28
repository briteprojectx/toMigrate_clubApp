/**
 * The data interfaces used by the authentication
 * Created by Ashok on 12-04-2016.
 */


export enum SessionState {
    LoggingIn,
    LoggedIn,
    LoginFailed,
    LoggedOut
}
/**
 * On successful authentication the authentication result will
 * contain this user information
 */
export interface UserInfo
{
    userId: number;

    userName: string;

    password: string;

    userType: string;

    clubId?: number;

    playerId?: number;

    organizerId?: number;
    admin?: boolean;
    roles?: any;// { [index: string]: string };
    caddieId?: number;
}
/**
 * This represents a session info
 */
export interface SessionInfo
{
    loginForm?: boolean;
    status?: SessionState;
    authToken?: string;
    userId?: number;
    userName?: string;
    password?: string;
    userType?: string;

    playerId?: number;
    clubId?: number;
    organizerId?: number;
    exception?: string;
    countryId?: string;
    countryName?: string;
    flagUrl?: string;
    name?: string;
    admin?: boolean;
    roles?: any;// { [index: string]: string };
    user?: UserInfo;
    caddieId?: number;
    appType?: string;
}

/**
 * The result of authentication
 */
export interface AuthenticationResult
{
    success: boolean;

    user?: UserInfo;

    authToken?: string;

    exception?: string;
    name?: string;
    appType?: string;
}

export interface CurrentUser
{
    userName: string;
    password: string;
}
