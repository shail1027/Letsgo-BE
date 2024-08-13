import { v4 as uuidv4 } from 'uuid';

export const createInviteLink = (req, res) => {
    if (!req.user) {
        return res.status(401).send({ error: 'User not authenticated' });
    }

    const { travel_id } = req.body;
    const user_id = req.user.dataValues.user_id;

    if (!travel_id || !user_id) {
        return res.status(400).send({ error: 'travel_id is required' });
    }

    const inviteToken = uuidv4(); 
    const inviteLink = `http://localhost:3000/StartPlanRoom/${travel_id}/${inviteToken}`;

    res.status(200).send({ inviteLink });
};
