import { Schema, model, models } from 'mongoose';
import db from '../utils/db';
import bcrypt from 'bcryptjs';
// 1. Create an interface representing a document in MongoDB.

export interface User {
	_id?: string;
	name?: string;
	email?: string;
	password?: string;
	isSeller?: boolean;
	isAdmin?: boolean;
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<User>({
	name: { type: String, required: true },
	email: { type: String, required: true, index: true, unique: true },
	password: { type: String, required: true },
	isSeller: { type: Boolean },
	isAdmin: { type: Boolean },
});

// 3. Create a Model.
const UserModel = models.User || model<User>('User', userSchema);

export async function getUsers(): Promise<User[]> {
	await db.connect();
	const users = await UserModel.find({ isAdmin: { $ne: true } });
	await db.disconnect();
	return users;
}

// Initially the addUser sets the isSeller to false and productList[] to []. To change this use setIsSeller and setProduct.
export async function addUser(user: User): Promise<User | null> {
	await db.connect();
	if (!(await UserModel.exists({ email: user.email }))) {
		const doc = new UserModel({
			name: user.name,
			email: user.email,
			password: bcrypt.hashSync(user.password || 'password'),
		});
		const retUser = await doc.save();
		await db.disconnect();
		return retUser;
	}
	await db.disconnect();
	return null;
}

type EmailCredentials = {
	email: string;
	password: string;
};
// type Credentials_phoneNumber = {
// 	phoneNumber?: string;
// 	password?: string;
// };

// export async function checkByPhoneNumber(input: Credentials_phoneNumber) {
// 	const user = await UserModel.findOne({
// 		$and: [
// 			{ phoneNumber: input.phoneNumber },
// 			{ password: input.password },
// 		],
// 	});
// 	if (user === null)
// 		return {
// 			exitStatus: 1,
// 			user: user,
// 		};
// 	return {
// 		exitStatus: 0,
// 		user: user,
// 	};
// }

export async function checkByEmail(
	input: EmailCredentials
): Promise<User | null> {
	await db.connect();
	const user = await UserModel.findOne({ email: input.email });
	await db.disconnect();
	if (
		user == null ||
		(user.password !== undefined &&
			bcrypt.compareSync(input.password, user.password) == false)
	)
		return null;

	return {
		_id: user._id,
		name: user.name,
		email: user.email,
		isSeller: user.isSeller,
		isAdmin: user.isAdmin,
	};
}

export async function getUserById(
	_id: string | string[]
): Promise<User | null> {
	await db.connect();
	const user = await UserModel.findOne({ _id: _id });
	await db.disconnect();
	if (user === null) return null;
	return user;
}

// export async function setPhoneNumber(_id: string, phoneNumber: string) {
// 	const user = await UserModel.findOneAndUpdate(
// 		{ _id: _id },
// 		{ $set: { phoneNumber: phoneNumber } },
// 		{ returnOriginal: false }
// 	);
// 	if (user === null)
// 		return {
// 			exitStatus: 1,
// 			user: user,
// 		};
// 	return {
// 		exitStatus: 0,
// 		user: user,
// 	};
// }

export async function setUser(userDetails: User): Promise<boolean> {
	await db.connect();
	const user = await UserModel.findOneAndUpdate(
		{ _id: userDetails._id },
		{
			$set: {
				email: userDetails.email,
				password: bcrypt.hashSync(userDetails.password || 'password'),
				name: userDetails.name,
				isSeller: userDetails.isSeller,
			},
		},
		{ returnOriginal: false }
	);
	await db.disconnect();
	if (user === null) return false;
	return true;
}

// export async function setEmail(_id: string, email: string) {
// 	const user = await UserModel.findOneAndUpdate(
// 		{ _id: _id },
// 		{ $set: { email: email } },
// 		{ returnOriginal: false }
// 	);
// 	if (user === null)
// 		return {
// 			exitStatus: 1,
// 			user: user,
// 		};
// 	return {
// 		exitStatus: 0,
// 		user: user,
// 	};
// }

// export async function setFirstName(_id: string, name: string) {
// 	const user = await UserModel.findOneAndUpdate(
// 		{ _id: _id },
// 		{ $set: { name: name } },
// 		{ returnOriginal: false }
// 	);
// 	if (user === null)
// 		return {
// 			exitStatus: 1,
// 			user: user,
// 		};
// 	return {
// 		exitStatus: 0,
// 		user: user,
// 	};
// }

// export async function setLastName(_id: string, lastName: string) {
// 	const user = await UserModel.findOneAndUpdate(
// 		{ _id: _id },
// 		{ $set: { lastName: lastName } },
// 		{ returnOriginal: false }
// 	);
// 	if (user === null)
// 		return {
// 			exitStatus: 1,
// 			user: user,
// 		};
// 	return {
// 		exitStatus: 0,
// 		user: user,
// 	};
// }

// export async function setPassword(_id: string, password: string) {
// 	const user = await UserModel.findOneAndUpdate(
// 		{ _id: _id },
// 		{ $set: { password: password } },
// 		{ returnOriginal: false }
// 	);
// 	if (user === null)
// 		return {
// 			exitStatus: 1,
// 			user: user,
// 		};
// 	return {
// 		exitStatus: 0,
// 		user: user,
// 	};
// }

export async function setIsSeller(
	_id: string | string[],
	name: string,
	isSeller: boolean
): Promise<boolean> {
	await db.connect();
	//console.log('ID: ' + _id);
	const user = await UserModel.findById(_id);
	//console.log(user);
	//console.log(Boolean(isSeller));
	if (user) {
		user.name = name;
		user.isSeller = Boolean(isSeller);
		await user.save();
		await db.disconnect();
		//console.log(user);
		return true;
	} else {
		await db.disconnect();
		return false;
	}
}

// export async function setProductList(_id: string, productList: string[]) {
// 	const user = await UserModel.findOneAndUpdate(
// 		{ _id: _id },
// 		{ $set: { productList: productList } },
// 		{ returnOriginal: false }
// 	);
// 	if (user === null || !user.isSeller)
// 		return {
// 			exitStatus: 1,
// 			user: user,
// 		};
// 	return {
// 		exitStatus: 0,
// 		user: user,
// 	};
// }

// async function doesExist(_id: string) {
// 	return await UserModel.exists({
// 		_id: _id,
// 	});
// }

export async function removeUserById(_id: string | string[]): Promise<User> {
	const user = await UserModel.findOneAndDelete({ _id: _id });
	return user;
}

// Remove all the products if the user is seller.
// Only add will not return the user object.
