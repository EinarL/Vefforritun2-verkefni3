import postgres from 'postgres';
import dotenv from 'dotenv';
import { slugifyString } from './slugify.js';

dotenv.config();

const sql = postgres({
    user: process.env.DB_USER,
    host: process.env.DATABASE_URL,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: 5432
});


export async function getTeams() {
    return await sql`SELECT * FROM Teams ORDER BY id`;
}


export async function getTeam(team_slug: string) {
    const team = await sql`SELECT * FROM Teams WHERE slug = ${team_slug}`;
    return team[0];
}

export async function getTeamByID(id: number) {
    const team = await sql`SELECT * FROM Teams WHERE id = ${id}`;
    return team[0];
}

/**
 * Adds the team to the database and returns the data that was added.
 * @param team name
 * @param description 
 * @returns data from the database about the team
 */
export async function addTeam(name: string, description: string){  
    try {
        const slug = slugifyString(name);
        await sql`INSERT INTO Teams (name, slug, description)
                VALUES (${name},${slug},${description})`;
        return await getTeam(slug);
    } catch (err) {
        console.error('Error adding team to the database:', err);
    }
}

/**
 * Removes the team from the database.
 * @param slug - the slug name of the team to delete 
 */
export async function deleteTeam(slug: string){  
    try {
        await sql`DELETE FROM Teams WHERE slug = ${slug}`;
    } catch (err) {
        console.error('Error deleting team from the database:', err);
    }
}

/**
 * updates the team with name = oldName.
 * @param oldSlug - the slug that the team currently has
 * @param newName - new name for the team
 * @param description - new description for the team
 * @returns data from the database about the team
 */
export async function updateTeam(oldSlug: string, newName: string, description: string){  
    try {
        const slug = slugifyString(newName);
        await sql`UPDATE Teams SET name = ${newName}, slug = ${slug}, description = ${description} WHERE slug = ${oldSlug}`;
        return await getTeam(slug);
    } catch (err) {
        console.error('Error updating team info:', err);
    }
}


////////////////////
//      Matches
////////////////////
export async function getMatches() {
    return await sql`SELECT * FROM games ORDER BY id`;
}

export async function getMatch(id: string | number) {
    const match = await sql`SELECT * FROM games WHERE id = ${id}`;
    return match[0];
}

/**
 * Adds the match to the database.
 * @param date 
 * @param home - id of home team
 * @param away - id of away team
 * @param home_score - score of home team
 * @param away_score - score of away team
 */
export async function addMatch(date: string, home: number, away: number, home_score: number, away_score: number){  
    try {
        await sql`INSERT INTO games (date, home, away, home_score, away_score)
                VALUES (${date},${home},${away},${home_score},${away_score})`;
    } catch (err) {
        console.error('Error adding match to the database:', err);
    }
}


/**
 * updates the match that has the corresponding id.
 * @param matchID - id of the match that is going to be updated 
 * @param date 
 * @param home - id of home team
 * @param away - id of away team
 * @param home_score - score of home team
 * @param away_score - score of away team
 * @returns data from the database about the match that was updated
 */
export async function updateMatch(matchID: string, date: string, home: number, away: number, home_score: number, away_score: number){  
    try {
        await sql`UPDATE games SET date = ${date}, home = ${home}, away = ${away}, home_score = ${home_score}, away_score = ${away_score} WHERE id = ${matchID}`;
        return await getMatch(matchID);
    } catch (err) {
        console.error('Error updating match info:', err);
    }
}


/**
 * Removes the match from the database.
 * @param matchID - the id of the match to delete 
 */
export async function deleteMatch(matchID: string | number){  
    try {
        await sql`DELETE FROM games WHERE id = ${matchID}`;
    } catch (err) {
        console.error('Error deleting match from the database:', err);
    }
}