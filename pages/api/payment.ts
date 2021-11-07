// import nc from 'next-connect';
// import { isAuth } from '../../utils/auth';
// import { NextApiRequest, NextApiResponse } from 'next';
// //import { v4 } from 'uuid';
// //import Stripe from 'stripe';
// //import { getProductById, Product } from '../../models/Product';

// const handler = nc();
// handler.use(isAuth);

// // const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || 'key', {
// // 	apiVersion: '2020-08-27',
// // });

// // type Cart = {
// //     quantity: number;
// //     productId: string;
// // };

// // interface NextApiRequestWithUserAndCart extends NextApiRequest {
// //     user: User | undefined;
// //     cart: Cart;
// //     paymentInfo:
// // }

// handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
// 	// console.log('Manoj Kumar');
// 	// const productId = req.body.productId;
// 	// console.log(`Product Id: ${req.body.productId}`);
// 	// // const user = req.body.user;
// 	// let price = 0;
// 	// const paymentInfo = req.body.paymentInfo;
// 	// if (productId == null) {
// 	// 	res.status(409).send({ message: 'Does not be null' });
// 	// 	console.log('Manoj Kumar One');
// 	// 	return;
// 	// }
// 	// const product: Product | null = await getProductById(productId);
// 	// if (product != null) {
// 	// 	price = product.price;
// 	// } else {
// 	// 	res.status(401).send({
// 	// 		message: 'Must be a valid product',
// 	// 	});
// 	// 	console.log('Manoj Kumar Two');
// 	// 	return;
// 	// }
// 	// const prevCustomer = await stripe.customers.list({
// 	// 	email: paymentInfo.email,
// 	// });
// 	// const isExist = prevCustomer.data.length > 0;
// 	// let newCustomer = null;
// 	// if (!isExist) {
// 	// 	newCustomer = await stripe.customers.create({
// 	// 		email: paymentInfo.email,
// 	// 		source: paymentInfo.id,
// 	// 		// phone: user.phoneNumber,
// 	// 	});
// 	// }
// 	// console.log(`Price: ${price}`);
// 	// try {
// 	// 	const charge = await stripe.charges.create(
// 	// 		{
// 	// 			currency: 'INR',
// 	// 			amount: price * 100,
// 	// 			receipt_email: paymentInfo.email,
// 	// 			description: `You made a purchase of ${price}`,
// 	// 			customer:
// 	// 				!isExist && newCustomer != null
// 	// 					? newCustomer.id
// 	// 					: prevCustomer.data[0].id,
// 	// 		},
// 	// 		{ idempotencyKey: v4() }
// 	// 	);
// 	// } catch (err) {
// 	// 	console.log('We are here');
// 	// 	res.status(200).send({ message: 'We are here too' });
// 	// 	return;
// 	// }
// 	// res.status(200).send({ message: 'Payment was Successful' });
// 	// // if (cart !== null && cart.length != 0) {
// 	// //     let totalPrice = 0;
// 	// //     // Calucating the price for each product present in the cart.
// 	// //     cart?.forEach(async (value: Cart) => {
// 	// //         const product = await getProductById(value.productId);
// 	// //         if()
// 	// //         totalPrice = value.productPrice * value.quantity;
// 	// //     });
// 	// //     const prevCustomer = await stripe.customers.list({
// 	// //         email: user.email,
// 	// //     });
// 	// //     const isExist = prevCustomer.data.length > 0;
// 	// //     let newCustomer = null;
// 	// //     if (!isExist) {
// 	// //         newCustomer = await stripe.customers.create({
// 	// //             email: user.email,
// 	// //             source: user._id,
// 	// //             phone: user.phoneNumber,
// 	// //         });
// 	// //     }
// 	// //     const charge = await stripe.charges.create(
// 	// //         {
// 	// //             currency: "INR",
// 	// //             amount: totalPrice * 100,
// 	// //             receipt_email: user.email,
// 	// //             description: `You made a purchase of ${totalPrice}`,
// 	// //             customer:
// 	// //                 !isExist && newCustomer != null
// 	// //                     ? newCustomer.id
// 	// //                     : prevCustomer.data[0].id,
// 	// //         },
// 	// //         { idempotencyKey: v4() }
// 	// //     );
// 	// // res.status(200).send({ message: "Payment was Successful" });
// 	// // } else {
// 	// //     if (user === null) {
// 	// //         res.status(401).send({ message: "Please Log IN" });
// 	// //     } else {
// 	// //         res.status(401).send({ message: "Cart is empty" });
// 	// //     }
// 	// // }
// 	// res.status(200).send("hello");
// });

// export default handler;
export {};
