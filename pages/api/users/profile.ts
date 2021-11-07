import nc from 'next-connect';
import { setUser, getUserById, User } from '../../../models/User';
import { signToken, isAuth } from '../../../utils/auth';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = nc();
handler.use(isAuth);

interface NextApiRequestWithUser extends NextApiRequest {
	user: User;
}

export default handler.put(
	async (req: NextApiRequestWithUser, res: NextApiResponse) => {
		try {
			const temp = await setUser({
				_id: req.user._id,
				name: req.body.name,
				email: req.body.email,
				password: req.body.password,
			});
			if (temp == false) res.status(500).send(null);
			else {
				const user = await getUserById(req.user._id || 'ok');
				if (user === null) res.status(401).send(null);
				else {
					const token = signToken(user);
					res.send({
						token,
						_id: user._id,
						name: user.name,
						email: user.email,
						isSeller: user.isSeller,
						isAdmin: user.isAdmin,
					});
				}
			}
		} catch (err) {
			res.status(500).send(null);
		}
	}
);
