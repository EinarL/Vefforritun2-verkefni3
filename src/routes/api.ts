import express, { Request, Response } from 'express';
import { catchErrors } from '../lib/catch-errors.js';
import { teams, team, addTeam, updateTeam, deleteTeam } from '../lib/teams.js';
import { addMatch, deleteMatch, matches, updateMatch, match } from '../lib/matches.js';


export const router = express.Router();

export async function index(req: Request, res: Response) {
  res.send(`
  Upplýsingar:<br>
    <strong>GET /teams</strong> til að fá lista af liðum.<br><br>
    <strong>GET /teams/:slug</strong> til að fá upplýsingar varðandi liðið, þar sem :slug er "sluggið" hjá liðinu.<br><br>
    <strong>POST /teams</strong> til að búa til lið. Verður að fylja JSON object með <strong>name</strong> og <strong>description</strong> fyrir liðið.<br><br>
    <strong>PATCH /teams/:slug</strong> til að uppfæra lið. þar sem :slug er "sluggið" hjá liðinu til að uppfæra. <br>Verður að fylja JSON object með <strong>name</strong> og <strong>description</strong> sem mun koma í staðinn fyrir það sem er núþegar.<br><br>
    <strong>DELETE /teams/:slug</strong> til að eyða liði, þar sem :slug er "sluggið" hjá liðinu sem mun eyðast.<br><br>
    <br>
    <strong>GET /matches</strong> til að fá lista yfir leiki.<br><br>
    <strong>GET /matches/:id</strong> til að skoða einn leik, þar sem :id er ID á leiknum til að skoða.<br><br>
    <strong>POST /matches</strong> til að bæta við nýjum leik.<br>Verður að fylgja JSON object með <strong>date</strong>, <strong>home</strong> (ID heimaliðs), <strong>away</strong> (ID útiliðs), <strong>home_score</strong> og <strong>away_score</strong><br><br>
    <strong>PATCH /matches/:id</strong> til að uppfæra leik, þar sem :id er ID á leiknum sem mun uppfærast.<br>Verður að fylgja JSON object með <strong>date</strong>, <strong>home</strong>, <strong>away</strong>, <strong>home_score</strong> og <strong>away_score</strong> sem munu koma í staðinn fyrir gögnin sem eru núþegar.<br><br>
    <strong>DELETE /matches/:id</strong> til að eyða leik, þar sem :id er ID á leiknum sem mun eyðast.<br><br>
  `);
}

// teams
router.get('/teams', catchErrors(teams));

router.get('/teams/:slug', catchErrors(team));

router.post('/teams', catchErrors(addTeam));

router.patch('/teams/:slug', catchErrors(updateTeam));

router.delete('/teams/:slug', catchErrors(deleteTeam));

// matches
router.get('/matches', catchErrors(matches));

router.get('/matches/:id', catchErrors(match));

router.post('/matches', catchErrors(addMatch));

router.patch('/matches/:id', catchErrors(updateMatch));

router.delete('/matches/:id', catchErrors(deleteMatch));