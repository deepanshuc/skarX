import nc from 'next-connect';
import { checkByEmail } from '../../../models/User';
import { signToken } from '../../../utils/auth';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = nc();

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const user = await checkByEmail({
			email: req.body.email,
			password: req.body.password,
		});
		if (user !== null) {
			const token = signToken(user);
			res.send({
				token,
				_id: user._id,
				name: user.name,
				email: user.email,
				isSeller: user.isSeller,
				isAdmin: user.isAdmin,
			});
		} else {
			res.status(401).send({ message: 'Invalid email or password' });
		}
	} catch (err) {
		res.status(500).send({ message: 'Server Error' });
	}
});

export default handler;
