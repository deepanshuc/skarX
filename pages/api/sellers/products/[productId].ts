import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { User } from '../../../../models/User';
import {
	checkProductSeller,
	getProductById,
	removeProductById,
	setProduct,
} from '../../../../models/Product';
import { isSeller, isAuth } from '../../../../utils/auth';

const handler = nc();
handler.use(isAuth, isSeller);

interface NextApiRequestWithUser extends NextApiRequest {
	user: User;
}

handler.put(async (req: NextApiRequestWithUser, res: NextApiResponse) => {
	//console.log('We came her');
	try {
		const check = await checkProductSeller(
			req.user._id,
			req.query.productId
		);
		if (check == false) {
			res.status(401).send({ message: 'Not your product' });
			return;
		} else if (check == null) {
			res.status(404).send({ message: 'Product Not Found' });
			return;
		}
		const product = await setProduct(
			{
				name: req.body.name,
				price: req.body.price,
				category: req.body.category,
				images: [req.body.images[0], req.body.images[1]],
				brand: req.body.brand,
				stock: req.body.stock,
				description: req.body.description,
				userId: req.user._id,
			},
			req.query.productId
		);

		if (product == false) {
			res.status(404).send({ message: 'Product or Image Not Found' });
			return;
		}
		res.status(200).send({ message: 'Product Updated Successfully' });
	} catch {
		res.status(500).send({ message: 'Server Error' });
	}
});

handler.get(async (req: NextApiRequestWithUser, res: NextApiResponse) => {
	try {
		const product = await getProductById(req.query.productId);
		if (product == null) {
			res.status(404).send(null);
			return;
		}
		if (product.userId !== req.user._id) {
			//console.log(product.userId);
			//console.log(req.user._id);
			res.status(401).send(null);
			return;
		}
		//console.log(product);
		res.send(product);
	} catch {
		res.status(500).send(null);
	}
});

handler.delete(async (req: NextApiRequestWithUser, res: NextApiResponse) => {
	try {
		const check = await checkProductSeller(
			req.user._id,
			req.query.productId
		);
		if (check == false) {
			res.status(401).send({ message: 'Not your product' });
			return;
		} else if (check == null) {
			res.status(404).send({ message: 'Product Not Found' });
			return;
		}
		const product = await removeProductById(req.query.productId);
		if (product == false)
			res.status(404).send({ message: 'Product Not Found' });
		else {
			res.send({ message: 'Product deleted' });
		}
	} catch (err) {
		res.status(500).send({ message: 'Server Error' });
	}
});

export default handler;
