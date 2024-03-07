import { Request, Response } from 'express';
import { 
    getTeamByID,
    getMatches,
    getMatch,
    addMatch as addMatchToDatabase,
    updateMatch as updateMatchToDatabase,
    deleteMatch as deleteMatchFromDatabase
} from '../lib/database.js';

export async function matches(req: Request, res: Response){
    res.json( await getMatches() );
}

export async function match(req: Request, res: Response){
    const result = await getMatch(req.params.id);
    if(!result) res.status(404).json({ error: 'Match does not exist'});
    else res.json(result);
}
  
export async function addMatch(req: Request, res: Response){
    try{
        const { date, home, away, home_score, away_score } = req.body;
        const errors = await validateMatchInfo(date, home, away, home_score, away_score);

        if (errors.length !== 0){
            res.status(400).json({errors: errors});
        }else{
            await addMatchToDatabase(date, home, away, home_score, away_score); // add match to database
            res.status(200).json({ message: "Match successfully added" });
        }

    }
    catch(error){
        console.error('Error adding match:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
} 

export async function updateMatch(req: Request, res: Response){
    try{
        const matchID = req.params.id; // id of the match to be updated

        const { date, home, away, home_score, away_score } = req.body; // we want to replace the old info with this

        const oldMatch = await getMatch(matchID);
        if (!oldMatch){ // if match does not exist
            res.status(404).json({error: `Match with id ${matchID} does not exist`});
            return;
        }
        const errors = await validateMatchInfo(date, home, away, home_score, away_score);

        if (errors.length !== 0){
            res.status(400).json({errors: errors});
        }else{
            const match = await updateMatchToDatabase(matchID, date, home, away, home_score, away_score); // update match info
            res.status(200).json(match);
        }
    }
    catch(error){
        console.error('Error updating match:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function deleteMatch(req: Request, res: Response){
    try{
        const matchID = req.params.id; // id of the match to be deleted

        if(!await getMatch(matchID)){
            res.status(404).json({ error: `Match with id ${matchID} does not exist` });
            return;
        }

        await deleteMatchFromDatabase(matchID);
        res.sendStatus(204);
    }
    catch(error){
        console.error('Error deleting match:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

/**
 * checks if the information about the match is valid.
 * @param date - date of the match
 * @param home - id of home team
 * @param away - id of away team
 * @param home_score - score of home team
 * @param away_score - score of away team
 * @returns {string[]} list of errors, empty if there are no errors 
 */
async function validateMatchInfo(date: string, home: number, away: number, home_score: number, away_score: number){
    const errors = [];
    
    const d = new Date(date);
    if(isNaN(d.getMonth())){ // check if date is in valid format
        errors.push("The date must be in a valid format, e.g. yyyy-mm-dd hh:mm:ss");
    }else{
        const now = new Date();
        if (d > now) errors.push("The date must not be in the future");
        else if (d < new Date(now.setMonth(now.getMonth() - 2))) errors.push("The date must not be older than two months");
    }

    if (!await getTeamByID(home)) errors.push("Home team does not exist");
    if (!await getTeamByID(away)) errors.push("Away team does not exist");
    if (home === away) errors.push("Home and away teams must not be the same team");

    if(!Number.isInteger(home_score) || home_score < 0 || home_score > 99) errors.push("Home score must be an integer, non-negative and not 100 or higher");
    if(!Number.isInteger(away_score) || away_score < 0 || away_score > 99) errors.push("Away score must be an integer, non-negative and not 100 or higher");

    return errors;
}