// import {PlainScorecard, PlayerRoundScores, PlayerScore} from '../../data/scorecard';
import {LeanScorecard, PlayerHoleScore, ScorecardMember} from '../../data/lean-scorecard';
import {PlainScoreCard, PlayerRoundScores, PlayerScore} from '../../data/mygolf.data'
import {JsonService} from '../../json-util';

/**
 * Created by ashok on 14/05/17.
 */

export function getLeanScorecard(scorecard: PlainScoreCard,
    scoringPlayerId?: number): LeanScorecard {

    let leanScorecard: LeanScorecard = {
        competitionId: scorecard.competitionId,
        roundNumber: scorecard.roundNumber,
        roundId: scorecard.gameRoundId,
        flightNumber: scorecard.flightNumber,
        scorerId: scoringPlayerId,
        flightMembers: new Array<ScorecardMember>()
    }
    scorecard.playerRoundScores.forEach(prs=>{
        let member: ScorecardMember = {
            playerRoundId: prs.playerRoundId,
            playerId: prs.playerId,
            scorerId: prs.scoringPlayerId,
            scores: []
        };
        prs.scores.forEach(score=>{
            let holeScore: PlayerHoleScore = {
                scorecardId: score.scorecardId,
                holeNumber: score.holeNumber,
                actualScore: score.actualScore
            }
            member.scores.push(holeScore);
        });
        leanScorecard.flightMembers.push(member);
    });
    return leanScorecard;
}
/**
 * Merges the scores from the LeanScorecard into PlainScoreCard. Optionally, the merging happens
 * in a fresh copy of the plain scorecard if immutable parameter is true. If you pass <code>ignoreScoresFrom<code>
 *     parameter, then the scores from the given scorer are ignored
 * @param scorecard
 * @param leanScorecard
 * @param immutable
 * @param ignoreScoresFrom
 * @returns {PlainScoreCard}
 */
export function mergeFromLeanScorecard(scorecard: PlainScoreCard,
    leanScorecard: LeanScorecard, immutable: boolean, ignoreScoresFrom?: number): PlainScoreCard {
    if(immutable) scorecard = JsonService.clone(scorecard);
    leanScorecard.flightMembers.forEach(fm=>{
        if(!ignoreScoresFrom || (ignoreScoresFrom !== fm.scorerId)){
            //get the corresponding player round
            let prs: PlayerRoundScores = scorecard.playerRoundScores.filter(p=>p.playerId === fm.playerId)
                .pop();
            if(prs){
                fm.scores.forEach(leanScore=>{
                    let playerScore: PlayerScore = prs.scores.filter(s=>s.scorecardId === leanScore.scorecardId).pop();
                    if(playerScore) {
                        playerScore.actualScore = leanScore.actualScore;
                    }
                })
            }
        }
    });
    return scorecard;
}

export function zipScorecard(leanScorecard: LeanScorecard): any {
    let compressed: any = {};
    compressed.cid = leanScorecard.competitionId;
    compressed.rno = leanScorecard.roundNumber;
    compressed.rid = leanScorecard.roundId;
    compressed.flight = leanScorecard.flightNumber;
    compressed.sid = leanScorecard.scorerId;
    compressed.members = [];
    leanScorecard.flightMembers.forEach(fm=>{
        let member = [];
        member.push(fm.playerId);
        member.push(fm.playerRoundId);
        member.push(fm.scorerId);
        let scores = [];
        member.push(scores);
        fm.scores.forEach(score=>{
            let s = [];
            s.push(score.holeNumber);
            s.push(score.scorecardId);
            if(score.actualScore)
                s.push(score.actualScore);
            if(score.netScore)
                s.push(score.netScore);
            scores.push(s);
        });
        compressed.members.push(member);
    });
    return compressed;
}

export function unzipScorecard(compressed: any) {
    let leanScorecard: LeanScorecard = {
        competitionId: compressed.cid,
        roundId: compressed.rid,
        roundNumber: compressed.rno,
        flightNumber: compressed.flight,
        scorerId: compressed.sid,
        flightMembers: []
    };
    if(compressed.members && compressed.members.length){
        compressed.members.forEach(member=>{
            let flightMember: ScorecardMember = {
                playerId: member[0],
                playerRoundId: member[1],
                scorerId: member[2],
                scores: []
            };
            if(member[3] && member[3].length){
                let scores: any[] =  member[3];
                scores.forEach(s=>{
                    let playerScore: PlayerHoleScore = {
                        holeNumber: s[0],
                        scorecardId: s[1],
                        actualScore: s[2]
                    }
                    if(s[3]) playerScore.netScore = s[3];
                    flightMember.scores.push(playerScore);
                });
            }
            leanScorecard.flightMembers.push(flightMember);
        })
    }
    return leanScorecard;
}