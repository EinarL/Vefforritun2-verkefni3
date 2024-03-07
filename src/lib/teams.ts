import { Request, Response } from 'express';
import { getTeams,
        getTeam,
        addTeam as addTeamToDatabase,
        updateTeam as updateTeamToDatabase,
        deleteTeam as deleteTeamFromDatabase
} from '../lib/database.js';

export async function teams(req: Request, res: Response){
    res.json( await getTeams() );
}
  
  
export async function team(req: Request, res: Response){
    const result = await getTeam(req.params.slug);
    if(!result) res.status(404).json({ error: 'Team does not exist' });
    else res.status(200).json(result);
}
  
export async function addTeam(req: Request, res: Response){
    try{
        const { name, description } = req.body;
        const errors = validateNameAndDescription(name, description);

        if (errors.length !== 0){
            res.status(400).json({errors: errors});
        }else{
            const data = await addTeamToDatabase(name, description); // add team to database
            res.status(200).json(data);
        }

    }
    catch(error){
        console.error('Error adding team:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
} 

export async function updateTeam(req: Request, res: Response){
    try{
        const { name, description } = req.body;
        const slug = req.params.slug;
        const oldTeam = await getTeam(slug);
        if (!oldTeam){ // if team does not exist with the slug
            res.status(404).json({error: `Team with slug ${slug} does not exist`});
            return;
        }
        const errors = validateNameAndDescription(name, description);

        if (errors.length !== 0){
            res.status(400).json({errors: errors});
        }else{
            const data = await updateTeamToDatabase(slug, name, description); // update team info
            res.status(200).json(data);
        }
    }
    catch(error){
        console.error('Error updating team:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function deleteTeam(req: Request, res: Response){
    try{
        const slug = req.params.slug;
        if(!await getTeam(slug)){
            res.status(404).json({ error: `Team with slug ${slug} does not exist` });
            return;
        }

        await deleteTeamFromDatabase(slug);
        res.sendStatus(204);
    }
    catch(error){
        console.error('Error deleting team:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



function validateNameAndDescription(name: string, description: string){
    const errors = [];
    if (name.length < 3) errors.push('name must be 3 characters or longer');
    else if (name.length > 128) errors.push('name cannot be longer than 128 characters');
    if (description.length > 1024) errors.push('description cannot be longer than 1024 characters');

    return errors;
}