/* eslint-disable @typescript-eslint/no-explicit-any */
import nc from 'next-connect';
import { isAuth, isSeller } from '../../../utils/auth';
import { onError } from '../../../utils/error';
import multer from 'multer';

const handler = nc({ onError }).use(isAuth, isSeller);

const oneMegabyteInBytes = 1000000;
//const outputFolderName = './public/uploads';

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/uploads');
	},
	filename: function (req, file, cb) {
		const name = req.user._id;
		cb(null, name || 'temp');
	},
});
const fileFilter = (req, file, cb) => {
	if (file.mimetype.split('/')[1] === 'pdf') {
		cb(null, true);
	} else {
		cb(new Error('Document uploaded is not of type pdf'), false);
	}
};
export const config = {
	api: {
		bodyParser: false, // Disallow body parsing, consume as stream
	},
};
const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: { fileSize: oneMegabyteInBytes * 5 },
});

// interface NextApiRequestWithFileAndUser extends NextApiRequest {
// 	file: Express.Multer.File;
// 	user: User;
// }

handler
	.use(isAuth, isSeller, upload.single('file'))
	.post(
		async (
			req /*: NextApiRequestWithFileAndUser*/,
			res /*: NextApiResponse*/
		) => {
			res.send(`/public/images/${req.user._id}`);
		}
	);

export default handler;
