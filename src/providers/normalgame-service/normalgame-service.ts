import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import {RemoteHttpService} from '../../remote-http';
import {MyGolfStorageService} from '../../storage/mygolf-storage.service';
import { NineToatls, } from '../../data/scorecard';
import {ClubInfo, CourseHoleInfo, } from '../../data/club-course';
import {PlayerInfo} from '../../data/player-data';
import {Observable} from 'rxjs/Observable';
import {Events} from 'ionic-angular/index';
import * as GolfEvents from '../../mygolf-events';
import * as globals from '../../globals';
import {Preference} from '../../storage/preference';
import {ScorecardService} from '../scorecard-service/scorecard-service';
import {AuthenticationService} from '../../authentication-service';
import {SessionInfo} from '../../data/authentication-info';
import * as moment from 'moment';
import {isPresent} from 'ionic-angular/util/util';
import {ContentType, RemoteRequest} from '../../remote-request';
import {RequestMethod, Response} from '@angular/http';
import {ServerResult} from '../../data/server-result';
import {JsonService} from '../../json-util';
import {SessionDataService} from '../../redux/session/session-data-service';
import {PlainScoreCard, PlayerRoundScores, PlayerScore, CourseInfo, PlayerTotals, createScorecard, NineTotals} from '../../data/mygolf.data';
/*
 Generated class for the NormalgameService provider.
 This class handles the requirements of a normal game
 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class NormalgameService
{
    private static NormalGameTable: string = "normal_game";
    private session: SessionInfo;
    constructor(private http: RemoteHttpService,
        private scorecardService: ScorecardService,
        private storage: MyGolfStorageService,
        private pref: Preference,
        private events: Events,
        private sessionService: SessionDataService,
        private authService: AuthenticationService) {
        this.sessionService.getSession().distinctUntilChanged()
            .subscribe((session: SessionInfo)=>{
                this.session = session;
            })
        this.events.subscribe(GolfEvents.GameFinished, (data: PlainScoreCard) => {
            if(data)
                this.gameFinished(data);
        })

    }
    /**
     * Gets the current ongoing game if exist
     * @returns {Observable<any>}
     */
    public getOngoingGame(): Observable<PlainScoreCard> {
        return this.scorecardService.getCurrentScorecard();
    }

    /**
     * Creates a new instance of scorecard and returns that instance
     * @returns {PlainScoreCard}
     */
    public createNewGame(): PlainScoreCard {
        return createScorecard(false);
    }

    public setClubForGame(scorecard: PlainScoreCard, clubInfo: ClubInfo) {
        scorecard.clubId   = clubInfo.clubId;
        scorecard.clubName = clubInfo.clubName;
    }

    /**
     * Sets the courses involved in the game
     * @param scorecard The scorecard
     * @param courses
     */
    public setCourses(scorecard: PlainScoreCard, courses: Array<CourseInfo>) {
        scorecard.courses = [];
        courses.forEach((course: CourseInfo, idx: number) => {
            let c: CourseInfo = JsonService.clone(course);
            c.whichNine       = (idx + 1);
            // c.indexToUse = this.deriveIndexToUse(scorecard,idx);
            scorecard.courses.push(c);

        });

        let courseNames = [];
        scorecard.courses.forEach((c: CourseInfo) => {
            courseNames.push(c.courseName);
        });
        scorecard.courseNames = courseNames.join(", ");
    }

    /**
     * Sets the participants of the game
     * @param scorecard
     * @param players
     */
    public setPlayers(scorecard: PlainScoreCard, players: Array<PlayerInfo>) {

        let playerNames          = [];
        players.forEach((player: PlayerInfo) => {
            let playerRoundScore: PlayerRoundScores = {
                playerId         : player.playerId,
                playerName       : player.playerName,
                nickName         : player.nickName ? player.nickName : player.firstName,
                gender           : player.gender,
                photoUrl         : player.photoUrl,
                thumbnail        : player.thumbnail,
                playerHandicap   : player.handicap,
                scoringPlayerId  : this.session.playerId,
                frontNineTotal   : 0,
                backNineTotal    : 0,
                totalScore       : 0,
                frontNineNetTotal: 0,
                backNineNetTotal : 0,
                totalNetScore    : 0,
                scores           : [],
                totals           : [],
                teeOffFrom       : player.teeOffFrom
            };
            scorecard.playerRoundScores.push(playerRoundScore);
            if (playerRoundScore.nickName)
                playerNames.push(playerRoundScore.nickName);
            else playerNames.push(playerRoundScore.playerName);
        });
        scorecard.participants = playerNames.join(", ");
    }

    /**
     * Starts new game with the given scorecard
     * @param scorecard The scorecard
     * @returns {PlainScoreCard} Returns the modified scorecard with
     */
    public startGame(scorecard: PlainScoreCard, teeTime?: Date, dateTime?: Date): PlainScoreCard {
        if(dateTime) scorecard.playedOn = moment(dateTime).format("YYYY-MM-DD");
        else scorecard.playedOn     = moment().format("YYYY-MM-DD");
        // scorecard.playedOn = moment().toDate();
        scorecard.success      = true;
        scorecard.competition  = false;
        scorecard.finished     = false;
        scorecard.startingHole = 1;
        scorecard.currentHole  = 1;

        //Set the game round start time
        scorecard.playerRoundScores.forEach((pr: PlayerRoundScores) => {
            pr.actualStartTime = moment().toDate();
            pr.startTime       = moment(teeTime).format("HH:mm:ss"); 
            //moment(teeTime).toDate(); //pr.actualStartTime;
            pr.scores          = new Array<PlayerScore>();
            pr.totals          = new Array<PlayerTotals>(); //new Array<NineToatls>();
            pr.status          = "I";
            let prvIdx: number;
            //Create the player scores
            scorecard.courses.forEach((c: CourseInfo, idx: number) => {
                c.whichNine        = (idx + 1);
                let remainder = c.whichNine % 2;
                let nt: NineTotals = {
                    whichNine : c.whichNine,
                    grossTotal: 0,
                    netTotal  : 0
                };

                
                // c.holes.forEach((h_: CourseHoleInfo, h_idx: number) => {

                //     h_.holeIndex
                //     c.whichNine
                // });
                // console.log("Previous : ",this.prevIdxType)
                pr.totals.push(nt);
                c.holes.forEach((h: CourseHoleInfo, hidx: number) => {
                    let holeNumber               = (idx * 9) + h.courseHoleNumber;
                    //Change the hole number of the course to reflect
                    h.holeNo                     = holeNumber;
                    let holeIndex                = (c.indexToUse==1)?h.holeIndex:h.holeIndexIn;//(this.prevIdxType)?h.holeIndex:h.holeIndexIn;

                    // h.holeIndex = holeIndex;
                    let playerScore: PlayerScore = {
                        whichNine   : (idx + 1),
                        holeNumber  : holeNumber,
                        courseHoleId: h.holeId,
                        courseName  : c.courseName,
                        courseId    : c.courseId,
                        parScore    : h.holePar,
                        holeIndex   : holeIndex, //(remainder)?h.holeIndex:h.holeIndexIn
                        // whichIndexToUse : indexToUse // added this for saving purpose to the server I guess
                    };
                    // this.prevIdxType = (holeIndex % 2)?'odd':'even';
                    // console.log("After : ",this.prevIdxType,holeIndex)
                    // console.log("Course No : ",idx+1,prvIdx,holeIndex);
                    pr.scores.push(playerScore);
                    prvIdx = holeIndex;
                })
            });

        });

        //Save the scorecard in the local database
        // this.scorecardService.saveCurrentScorecard(scorecard);
        // //Publish an event for normal game start
        // this.events.publish(GolfEvents.GameStarted, scorecard);
        console.log("Scorecard incoming : ",scorecard, teeTime)

        return scorecard;
    }

    /**
     * Change the course of a game. This will change the underlying
     * course and hole details. But doesn't change scores
     */
    public changeCourse(scorecard: PlainScoreCard,
        whichNine: number,
        course: CourseInfo,
        editingScorecard: boolean = false): Observable<boolean> {

        if (editingScorecard) {
            let request = new RemoteRequest(globals.ServerUrls.changeCourse,
                RequestMethod.Post, ContentType.URL_ENCODED_FORM_DATA, {
                    roundId  : scorecard.gameRoundId,
                    whichNine: whichNine,
                    courseId : course.courseId,
                    indexSetToUse: course.indexToUse
                });
            return this.http.execute(request)
                       .map((resp: Response) => {
                           let result: ServerResult = resp.json();
                        //    this._updateScorecardWithNewCourse(scorecard, whichNine, course);
                        //    this.deriveIndexToUse(scorecard)
                            this._updateNewCourseOnly(scorecard, whichNine, course);
                            this.deriveIndexToUse(scorecard)
                            this._updateAllScorecardWithNewCourse(scorecard, whichNine, course);
                           return result.success;
                       }).catch(this.http.handleError);
        }
        else {
            //Just update
            this._updateNewCourseOnly(scorecard, whichNine, course);
            this.deriveIndexToUse(scorecard)
            this._updateAllScorecardWithNewCourse(scorecard, whichNine, course);
            // this._updateScorecardWithNewCourse(scorecard, whichNine, course);
            return Observable.of(true);
        }

    }

    private _updateNewCourseOnly(scorecard: PlainScoreCard,
        whichNine: number,
        course: CourseInfo) {

        let gameCourse: CourseInfo = JsonService.clone(course);
        gameCourse.whichNine       = whichNine;
        gameCourse.holes.forEach(h => {
            let holeNumber = ((whichNine - 1) * 9) + h.courseHoleNumber;
            h.holeNo       = holeNumber;
        });

        scorecard.courses[whichNine - 1] = gameCourse;
    }

    private _updateScorecardWithNewCourse(scorecard: PlainScoreCard,
        whichNine: number,
        course: CourseInfo) {
        let remainder = whichNine % 2;
        let _course:CourseInfo[] = scorecard.courses.filter(c => {
            return c.whichNine === whichNine
        });
        console.log("_course ",_course)
        scorecard.playerRoundScores.forEach((prs) => {
            prs.scores.filter(score => {
                return score.whichNine === whichNine;
            }).forEach(score => {
                let courseHoleNo = score.holeNumber - (whichNine - 1) * 9;
                score.courseId   = course.courseId;
                score.courseName = course.courseName;

                //Get the hole from the new course info
                let holes = course.holes.filter(h => {
                    return h.courseHoleNumber === courseHoleNo;
                });
                if (holes && holes.length) {
                    console.log("Course : ",course[whichNine-1])
                    let holeIndex = (_course[0].indexToUse==1)?holes[0].holeIndex:holes[0].holeIndexIn;
                    score.courseHoleId = holes[0].holeId;
                    score.parScore     = holes[0].holePar;
                    score.holeIndex    = holeIndex;//(remainder)? holes[0].holeIndex: holes[0].holeIndexIn;
                }
            });
        });
        let gameCourse: CourseInfo = JsonService.clone(course);
        gameCourse.whichNine       = whichNine;
        gameCourse.holes.forEach(h => {
            let holeNumber = ((whichNine - 1) * 9) + h.courseHoleNumber;
            h.holeNo       = holeNumber;
        });

        scorecard.courses[whichNine - 1] = gameCourse;
        this.deriveNetScores(scorecard);
        this.calculateTotals(scorecard);
    }

    private _updateAllScorecardWithNewCourse(scorecard: PlainScoreCard,
        whichNine: number,
        course: CourseInfo) {
        let remainder = whichNine % 2;
        // let _course:CourseInfo[] = scorecard.courses.filter(c => {
        //     return c.whichNine === whichNine
        // });

        let _course:CourseInfo[] = scorecard.courses;

        console.log("_course ",_course)
        scorecard.playerRoundScores.forEach((prs) => {
            prs.scores.forEach(score => {
                let _indexToUse = _course[score.whichNine-1].indexToUse;
                console.log("_indexToUse:",_indexToUse,score.whichNine)
                let courseHoleNo = score.holeNumber - (score.whichNine - 1) * 9;
                score.courseId   = _course[score.whichNine-1].courseId;
                score.courseName = _course[score.whichNine-1].courseName;

                //Get the hole from the new course info
                let holes = _course[score.whichNine-1].holes.filter(h => {
                    return h.courseHoleNumber === courseHoleNo;
                });
                if (holes && holes.length) {
                    console.log("Course : ",course[score.whichNine-1])
                    let holeIndex = (_indexToUse==1)?holes[0].holeIndex:holes[0].holeIndexIn;
                    score.courseHoleId = holes[0].holeId;
                    score.parScore     = holes[0].holePar;
                    score.holeIndex    = holeIndex;//(remainder)? holes[0].holeIndex: holes[0].holeIndexIn;
                }
            });
        });
        // let gameCourse: CourseInfo = JsonService.clone(course);
        // gameCourse.whichNine       = whichNine;
        // gameCourse.holes.forEach(h => {
        //     let holeNumber = ((whichNine - 1) * 9) + h.courseHoleNumber;
        //     h.holeNo       = holeNumber;
        // });

        // scorecard.courses[whichNine - 1] = gameCourse;
        this.deriveNetScores(scorecard);
        this.calculateTotals(scorecard);
    }

    private gameFinished(scorecard: PlainScoreCard) {
        //Check if this is a normal game scorecard or competition.
        //If for normal game then save it in the local datanase
        if (!scorecard.competition) {
            NormalgameService.saveGameLocally(this.storage, scorecard);
        }

    }

    /**
     * Calculate the netscore for the given scorecard
     * @param scorecard The scorecard for which the netscore needs to be calculated
     */
    public deriveNetScores(scorecard: PlainScoreCard) {
        scorecard.playerRoundScores.forEach(prs => {
            prs.scores.forEach(s => {
                let handicap = prs.playerHandicap;
                if (!isPresent(handicap)) {
                    if ("F" === prs.gender || "f" === prs.gender)
                        handicap = 36;
                    else handicap = 24;
                }
                s.netScore = this.deriveStrokePlayHoleNetScore(prs.playerHandicap,
                    s.parScore, s.holeIndex,
                    s.actualScore);
            });
        });
    }

    /**
     * Calculate the totals in the scorecard
     * @param scorecard
     */
    public calculateTotals(scorecard: PlainScoreCard) {
        scorecard.playerRoundScores
                 .forEach(prs => {
                     prs.totals.forEach(pt => {
                         pt.grossTotal = prs.scores.filter(s => {
                             return (s.whichNine === pt.whichNine) && (s.actualScore >= 0);
                         }).map(s => s.actualScore)
                                            .reduce((a, b) => a + b, 0);
                         pt.netTotal   = prs.scores.filter(s => {
                             return (s.whichNine === pt.whichNine) && (s.netScore >= 0);
                         }).map(s => s.netScore)
                                            .reduce((a, b) => a + b, 0);
                     });
                     prs.totalScore    = prs.totals.map(pt => pt.grossTotal)
                                            .reduce((a, b) => a + b, 0);
                     prs.totalNetScore = prs.totals.map(pt => pt.netTotal)
                                            .reduce((a, b) => a + b, 0);

                     prs.frontNineTotal = prs.scores.filter(s => {
                         return s.whichNine === 1 && isPresent(s.actualScore);
                     }).map(s => s.actualScore)
                                             .reduce((a, b) => a + b, 0);
                     prs.backNineTotal  = prs.scores.filter(s => {
                         return s.whichNine === 2 && isPresent(s.actualScore);
                     }).map(s => s.actualScore)
                                             .reduce((a, b) => a + b, 0);

                     prs.frontNineNetTotal = prs.scores.filter(s => {
                         return s.whichNine === 1 && isPresent(s.netScore);
                     }).map(s => s.netScore)
                                                .reduce((a, b) => a + b, 0);
                     prs.backNineNetTotal  = prs.scores.filter(s => {
                         return s.whichNine === 2 && isPresent(s.netScore);
                     }).map(s => s.netScore)
                                                .reduce((a, b) => a + b, 0);

                     // prs.totalScore = prs.frontNineTotal + prs.backNineTotal;
                     // prs.totalNetScore = prs.frontNineNetTotal + prs.backNineNetTotal;
                 });
    }

    public static saveGameLocally(storage: MyGolfStorageService,
        scorecard: PlainScoreCard) {
        storage.setValue(NormalgameService.NormalGameTable,
            scorecard.clientId, scorecard);
    }

    /**
     * Derives the netscore for a given hole and gross score
     * @param handicap The player's handicap
     * @param par The par score of the hole
     * @param index The holeIndex
     * @param grossScore The gross score
     * @returns {number|null} Returns the net score if gross score is not null.
     */
    public deriveStrokePlayHoleNetScore(handicap: number,
        par: number,
        index: number,
        grossScore: number): number {
        if (grossScore == null)
            return grossScore;
        if (!isPresent(handicap))
            handicap = 24;
        let holeHandicap = 0;
        holeHandicap     = this.getHoleHandicap(handicap, index);
        return this.deriveNetScore(grossScore, par, holeHandicap, false);
    }

    /**
     * Derive the net score based on the gross score, par, hole handicap
     * @param grossScore The gross score
     * @param par The par score of the hole
     * @param holeHandicap The hole handicap derived based on the hole index and player's handicap
     * @param points Whether to use the point system
     * @returns {any}
     */
    private deriveNetScore(grossScore: number,
        par: number,
        holeHandicap: number, points: boolean): number {
        if (grossScore == null) {
            // return (par + holeHandicap);
            return null;
        }
        if (points) {
            return grossScore - (par + holeHandicap);
            // return grossScore.add(par.add(holeHandicap).negate());
        }
        // return grossScore.add(holeHandicap.negate());
        return grossScore - holeHandicap;
    }

    /**
     * Calculate the hole handicap based on the player handicap and hole index
     * @param handicap The player handicap
     * @param index the hole index
     * @returns {number} Returns the handicap for the hole
     */
    private  getHoleHandicap(handicap: number, index: number): number {

        let holeHandicap = 0;

        if (handicap > 18) {
            holeHandicap = Math.floor(handicap / 18);
            let residue  = (handicap % 18);
            if (index <= residue) {
                holeHandicap++;
            }
        } else {
            if (index <= handicap) {
                holeHandicap++;
            }
        }
        return holeHandicap;
    }

    public deriveIndexToUse(scorecard: PlainScoreCard, index?: number):PlainScoreCard {

        let c_holeIndex: Array<number> = [];
        let c_holeIndexIn: Array<number> = [];
        let chIdxType: Array<string> = [];
        let indexToUse: Array<number> = [];
        

        scorecard.courses.forEach((c: CourseInfo, idx: number) => {
            // let c: CourseInfo = JsonService.clone(course);
            c_holeIndex[idx] = c.holes[0].holeIndex
            c_holeIndexIn[idx] = c.holes[0].holeIndexIn


            
            if(idx%2) {
                if((c_holeIndex[idx-1] == c_holeIndexIn[idx-1]) && !(c_holeIndex[idx-1] % 2)) {
                    console.log("Course 1 : Both Even")
                    chIdxType[idx-1] = "Even"
                } else if((c_holeIndex[idx-1] == c_holeIndexIn[idx-1]) && c_holeIndex[idx-1] % 2) {
                    console.log("Course 1 : Both Odd")
                    chIdxType[idx-1] = "Odd"
                } else {
                    chIdxType[idx-1] = "Both"
                    console.log("Course 1 : Odd and Even")
                }

                if((c_holeIndex[idx] == c_holeIndexIn[idx]) && !(c_holeIndex[idx] % 2)) {
                    console.log("Course 2 : Both Even")
                    if(chIdxType[idx-1]=="Even") {
                        // c[idx-1].indexToUse = 1
                        // c[idx].indexToUse = 1
                        indexToUse.push(1)
                        indexToUse.push(1)
                    }
                    else if(chIdxType[idx-1]=="Odd") {
                        // c[idx-1].indexToUse = 1
                        // c[idx].indexToUse = 1
                        indexToUse.push(1)
                        indexToUse.push(1)
                    }
                    else if(chIdxType[idx-1]=="Both") {
                        // c[idx-1].indexToUse = 1
                        // c[idx].indexToUse = 1
                        indexToUse.push(1)
                        indexToUse.push(1)
                    }
    
                    chIdxType.push("Even")
                } else if((c_holeIndex[idx] == c_holeIndexIn[idx]) && c_holeIndex[idx] % 2) {
                    console.log("Course 2 : Both Odd")
                    if(chIdxType[idx-1]=="Even") {
                        // c[idx-1].indexToUse = 1
                        // c[idx].indexToUse = 1
                        indexToUse.push(1)
                        indexToUse.push(1)
                    }
                    else if(chIdxType[idx-1]=="Odd") {
                        // c[idx-1].indexToUse = 1
                        // c[idx].indexToUse = 1
                        indexToUse.push(1)
                        indexToUse.push(1)
                    }
                    else if(chIdxType[idx-1]=="Both") {
                        // c[idx-1].indexToUse = 2
                        // c[idx].indexToUse = 1
                        indexToUse.push(2)
                        indexToUse.push(1)
                    }
                    chIdxType.push("Odd")
                } else {
                    if(chIdxType[idx-1]=="Even") {
                        // c[idx-1].indexToUse = 1
                        // c[idx].indexToUse = 1
                        indexToUse.push(1)
                        indexToUse.push(1)
                    }
                    else if(chIdxType[idx-1]=="Odd") {
                        // c[idx-1].indexToUse = 1
                        // c[idx].indexToUse = 2
                        indexToUse.push(1)
                        indexToUse.push(2)
                    }
                    else if(chIdxType[idx-1]=="Both") {
                        // c[idx-1].indexToUse = 1
                        // c[idx].indexToUse = 2
                        indexToUse.push(1)
                        indexToUse.push(2)
                    }
                    chIdxType.push("Both")
                    console.log("Course 2 : Odd and Even")
                    // indexToUse[0]
                }
            }
            // scorecard.courses.push(c);
        });
        let totalCourse = scorecard.courses.length
        if (!(totalCourse%2)) {
            scorecard.courses.forEach((course: CourseInfo, idx: number) => {
                // let c: CourseInfo = JsonService.clone(course);
                // c.indexToUse = (indexToUse[idx])
                course.indexToUse = indexToUse[idx];
    
            });
        }
        
        console.log("Index to use : ",indexToUse)
        /*
        console.log("deriveIndexToUse() Course 1 : ",scorecard.courses[0]);
        console.log("deriveIndexToUse() Course 2 : ",scorecard.courses[1]);
        let course_1: CourseInfo = scorecard.courses[0];
        let course_2: CourseInfo = scorecard.courses[1];
        let indexToUse: Array<number> = [];

        let indexSetString: string;

        console.log("Course 1 Hole Index  : ",course_1.holes[0].holeIndex)
        let c1_holeIndex = course_1.holes[0].holeIndex
        let c1_holeIndexIn = course_1.holes[0].holeIndexIn
        let c2_holeIndex = course_2.holes[0].holeIndex
        let c2_holeIndexIn = course_2.holes[0].holeIndexIn

        let chIdxType: Array<string> = [];


        if((c1_holeIndex == c1_holeIndexIn) && !(c1_holeIndex % 2)) {
            console.log("Course 1 : Both Even")
            chIdxType.push("Even")
        } else if((c1_holeIndex == c1_holeIndexIn) && c1_holeIndex % 2) {
            console.log("Course 1 : Both Odd")
            chIdxType.push("Odd")
        } else {
            chIdxType.push("Both")
            console.log("Course 1 : Odd and Even")
        }


            if((c2_holeIndex == c2_holeIndexIn) && c2_holeIndex % 2) {
                console.log("Course 2 : Both Even")
                if(chIdxType[0]=="Even") {
                    indexToUse.push(1)
                    indexToUse.push(1)
                }
                else if(chIdxType[0]=="Odd") {
                    indexToUse.push(1)
                    indexToUse.push(1)
                }
                else if(chIdxType[0]=="Both") {
                    indexToUse.push(1)
                    indexToUse.push(1)
                }

                chIdxType.push("Even")
            } else if((c2_holeIndex == c2_holeIndexIn) && !(c2_holeIndex % 2)) {
                console.log("Course 2 : Both Odd")
                if(chIdxType[0]=="Even") {
                    indexToUse.push(1)
                    indexToUse.push(1)
                }
                else if(chIdxType[0]=="Odd") {
                    indexToUse.push(1)
                    indexToUse.push(1)
                }
                else if(chIdxType[0]=="Both") {
                    indexToUse.push(2)
                    indexToUse.push(1)
                }
                chIdxType.push("Odd")
            } else {
                if(chIdxType[0]=="Even") {
                    indexToUse.push(1)
                    indexToUse.push(1)
                }
                else if(chIdxType[0]=="Odd") {
                    indexToUse.push(1)
                    indexToUse.push(2)
                }
                else if(chIdxType[0]=="Both") {
                    indexToUse.push(1)
                    indexToUse.push(2)
                }
                chIdxType.push("Both")
                console.log("Course 2 : Odd and Even")
                // indexToUse[0]
            }
            scorecard.courses[0].indexToUse = indexToUse[0]
            scorecard.courses[1].indexToUse = indexToUse[1]
            console.log("Course 1 - Hole Index - ",c1_holeIndex)
            console.log("Course 1 - Hole Index In - ",c1_holeIndexIn)
            console.log("Course 2 - Hole Index - ",c2_holeIndex)
            console.log("Course 2 - Hole Index In - ",c2_holeIndexIn)

        console.log("Course Idx Type",chIdxType)
        console.log("Index to use : ",indexToUse,indexToUse[0],indexToUse[1])
        console.log("Scorecard after derived:",scorecard)

            */
        // if(course_1.holes[0].holeIndex==course_1.holes[0].holeIndexIn)


        // if course 1 hole 1 both odd
        // course 2 choose which is even
        // if course 1 hole 1 both even
        // course 2 chooose which is odd
        // if course 1 hole 1 have even and odd
        // > course 2 both odd, choose odd
        // > course 2 both even, choose even
        // > course 2 even and odd
        // make 1 variable to  keep each course's odd / even / both
        // if course_1.odd && course_2.even then course_1.index 1 | course_2.index 2
        // if course_1.both && course_2.even then course_1.index 1 | course_2.index 2
        // if course_1.both && course_2.odd then course_1.index 2 | course_2.index 1
        // return indexToUse[index];
        return scorecard;
    }
    

}

