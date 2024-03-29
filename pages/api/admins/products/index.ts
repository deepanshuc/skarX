import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { getProducts } from '../../../../models/Product';
import { isAdmin } from '../../../../utils/auth';

const handler = nc().use(isAdmin);

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const products = await getProducts();
		res.send(products);
	} catch {
		res.status(500).send(null);
	}
});

export default handler;
