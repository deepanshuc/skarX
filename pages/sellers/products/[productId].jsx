/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-mixed-spaces-and-tabs */
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useContext, useReducer /* useState */ } from 'react';
import {
	Grid,
	List,
	ListItem,
	Typography,
	Card,
	Button,
	//	ListItemText,
	TextField,
	CircularProgress,
	//	FormControlLabel,
	//	Checkbox,
} from '@material-ui/core';
import { getError } from '../../../utils/error';
import { Store } from '../../../utils/store';
import Layout from '../../../components/Layout';
import useStyles from '../../../utils/styles';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import Slide from '@material-ui/core/Slide';

function reducer(state, action) {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return { ...state, loading: true, error: '' };
		case 'FETCH_SUCCESS':
			return { ...state, loading: false, error: '' };
		case 'FETCH_FAIL':
			return { ...state, loading: false, error: action.payload };
		case 'UPDATE_REQUEST':
			return { ...state, loadingUpdate: true, errorUpdate: '' };
		case 'UPDATE_SUCCESS':
			return { ...state, loadingUpdate: false, errorUpdate: '' };
		case 'UPDATE_FAIL':
			return {
				...state,
				loadingUpdate: false,
				errorUpdate: action.payload,
			};
		case 'UPLOAD_REQUEST':
			return { ...state, loadingUpload: true, errorUpload: '' };
		case 'UPLOAD_SUCCESS':
			return {
				...state,
				loadingUpload: false,
				errorUpload: '',
			};
		case 'UPLOAD_FAIL':
			return {
				...state,
				loadingUpload: false,
				errorUpload: action.payload,
			};

		default:
			return state;
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ProductEdit({ params }) {
	const { state } = useContext(Store);
	const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
		useReducer(reducer, {
			loading: true,
			error: '',
		});
	const {
		handleSubmit,
		control,
		formState: { errors },
		setValue,
	} = useForm();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const router = useRouter();
	const { productId } = router.query;
	const classes = useStyles();
	const { userInfo } = state;

	useEffect(() => {
		if (userInfo.isAdmin == true || userInfo.isSeller != true)
			router.push('/');
		if (!userInfo) {
			return router.push('/users/login');
		} else {
			const fetchData = async () => {
				try {
					dispatch({ type: 'FETCH_REQUEST' });
					const { data } = await axios.get(
						`/api/sellers/products/${productId}`,
						{
							headers: {
								authorization: `Bearer ${userInfo.token}`,
							},
						}
					);
					//console.log('The Name is: ' + data.name);
					dispatch({ type: 'FETCH_SUCCESS' });
					setValue('name', data.name);
					setValue('price', data.price);
					setValue('image1', data.images[0]);
					setValue('image2', data.images[1]);
					setValue('category', data.category);
					setValue('brand', data.brand);
					setValue('stock', data.stock);
					setValue('description', data.description);
				} catch (err) {
					dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
				}
			};
			fetchData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const uploadHandler = async (e, imageField = 'image1') => {
		const file = e.target.files[0];
		const bodyFormData = new FormData();
		bodyFormData.append('file', file);
		try {
			dispatch({ type: 'UPLOAD_REQUEST' });
			const { data } = await axios.post(
				'/api/sellers/upload',
				bodyFormData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
						authorization: `Bearer ${userInfo.token}`,
					},
				}
			);
			dispatch({ type: 'UPLOAD_SUCCESS' });
			setValue(imageField, data.url);
			enqueueSnackbar('File uploaded successfully', {
				variant: 'success',
				anchorOrigin: {
					vertical: 'left',
					horizontal: 'left',
				},
				TransitionComponent: Slide,
			});
		} catch (err) {
			dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
			enqueueSnackbar(getError(err), {
				variant: 'error',
				anchorOrigin: {
					vertical: 'left',
					horizontal: 'left',
				},
				TransitionComponent: Slide,
			});
		}
	};

	const submitHandler = async ({
		name,
		price,
		category,
		image1,
		image2,
		brand,
		stock,
		description,
	}) => {
		//console.log('Logged here');
		closeSnackbar();
		try {
			dispatch({ type: 'UPDATE_REQUEST' });
			await axios.put(
				`/api/sellers/products/${productId}`,
				{
					name,
					price,
					category,
					images: [image1, image2],
					brand,
					stock,
					description,
				},
				{
					headers: {
						authorization: `Bearer ${userInfo.token}`,
					},
				}
			);
			dispatch({ type: 'UPDATE_SUCCESS' });
			enqueueSnackbar('Product updated successfully', {
				variant: 'success',
				anchorOrigin: {
					vertical: 'left',
					horizontal: 'left',
				},
				TransitionComponent: Slide,
			});
			router.push('/sellers');
		} catch (err) {
			dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
			enqueueSnackbar(getError(err), {
				variant: 'error',
				anchorOrigin: {
					vertical: 'left',
					horizontal: 'left',
				},
				TransitionComponent: Slide,
			});
		}
	};

	//const [isFeatured, setIsFeatured] = useState(false);

	return (
		<Layout title={`Edit Product ${productId}`}>
			<Grid container spacing={1}>
				<Grid item md={9} xs={12}>
					<Card className={classes.section}>
						<List>
							<ListItem>
								<Typography component="h1" variant="h1">
									Edit Product {productId}
								</Typography>
							</ListItem>
							<ListItem>
								{loading && (
									<CircularProgress></CircularProgress>
								)}
								{error && (
									<Typography className={classes.error}>
										{error}
									</Typography>
								)}
							</ListItem>
							<ListItem>
								<form
									onSubmit={handleSubmit(submitHandler)}
									className={classes.form}
									autoComplete="off"
								>
									<List>
										<ListItem>
											<Controller
												name="name"
												control={control}
												defaultValue=""
												rules={{
													required: true,
												}}
												render={({ field }) => (
													<TextField
														variant="outlined"
														fullWidth
														id="name"
														label="Name"
														error={Boolean(
															errors.name
														)}
														helperText={
															errors.name
																? 'Name is required'
																: ''
														}
														{...field}
													></TextField>
												)}
											></Controller>
										</ListItem>
										<ListItem>
											<Controller
												name="price"
												control={control}
												defaultValue=""
												rules={{
													required: true,
												}}
												render={({ field }) => (
													<TextField
														variant="outlined"
														fullWidth
														id="price"
														label="Price"
														error={Boolean(
															errors.price
														)}
														helperText={
															errors.price
																? 'Price is required'
																: ''
														}
														{...field}
													></TextField>
												)}
											></Controller>
										</ListItem>
										<ListItem>
											<Controller
												name="image1"
												control={control}
												defaultValue=""
												rules={{
													required: true,
												}}
												render={({ field }) => (
													<TextField
														variant="outlined"
														fullWidth
														id="image1"
														label="Image One"
														error={Boolean(
															errors.image
														)}
														helperText={
															errors.image
																? 'Image is required'
																: ''
														}
														{...field}
													></TextField>
												)}
											></Controller>
										</ListItem>
										<ListItem>
											<Button
												variant="contained"
												component="label"
											>
												Upload File
												<input
													type="file"
													onChange={uploadHandler}
													hidden
												/>
											</Button>
											{loadingUpload && (
												<CircularProgress />
											)}
										</ListItem>
										<ListItem>
											<Controller
												name="image2"
												control={control}
												defaultValue=""
												rules={{
													required: true,
												}}
												render={({ field }) => (
													<TextField
														display="none"
														variant="outlined"
														fullWidth
														id="image2"
														label="Image Two"
														error={Boolean(
															errors.image
														)}
														helperText={
															errors.image
																? 'Image is required'
																: ''
														}
														{...field}
													></TextField>
												)}
											></Controller>
										</ListItem>
										<ListItem>
											<Button
												variant="contained"
												component="label"
											>
												Upload File
												<input
													type="file"
													onChange={(e) =>
														uploadHandler(
															e,
															'image2'
														)
													}
													hidden
												/>
											</Button>
											{loadingUpload && (
												<CircularProgress />
											)}
										</ListItem>
										<ListItem>
											<Controller
												name="category"
												control={control}
												defaultValue=""
												rules={{
													required: true,
												}}
												render={({ field }) => (
													<TextField
														variant="outlined"
														fullWidth
														id="category"
														label="Category"
														error={Boolean(
															errors.category
														)}
														helperText={
															errors.category
																? 'Category is required'
																: ''
														}
														{...field}
													></TextField>
												)}
											></Controller>
										</ListItem>
										<ListItem>
											<Controller
												name="brand"
												control={control}
												defaultValue=""
												rules={{
													required: true,
												}}
												render={({ field }) => (
													<TextField
														variant="outlined"
														fullWidth
														id="brand"
														label="Brand"
														error={Boolean(
															errors.brand
														)}
														helperText={
															errors.brand
																? 'Brand is required'
																: ''
														}
														{...field}
													></TextField>
												)}
											></Controller>
										</ListItem>
										<ListItem>
											<Controller
												name="stock"
												control={control}
												defaultValue=""
												rules={{
													required: true,
												}}
												render={({ field }) => (
													<TextField
														variant="outlined"
														fullWidth
														id="stock"
														label="stock"
														error={Boolean(
															errors.stock
														)}
														helperText={
															errors.stock
																? 'Stock is required'
																: ''
														}
														{...field}
													></TextField>
												)}
											></Controller>
										</ListItem>
										<ListItem>
											<Controller
												name="description"
												control={control}
												defaultValue=""
												rules={{
													required: true,
												}}
												render={({ field }) => (
													<TextField
														variant="outlined"
														fullWidth
														multiline
														id="description"
														label="Description"
														error={Boolean(
															errors.description
														)}
														helperText={
															errors.description
																? 'Description is required'
																: ''
														}
														{...field}
													></TextField>
												)}
											></Controller>
										</ListItem>

										<ListItem>
											<Button
												variant="contained"
												type="submit"
												fullWidth
												color="primary"
											>
												Update
											</Button>
											{loadingUpdate && (
												<CircularProgress />
											)}
										</ListItem>
									</List>
								</form>
							</ListItem>
						</List>
					</Card>
				</Grid>
			</Grid>
		</Layout>
	);
}

export async function getServerSideProps({ params }) {
	return {
		props: { params },
	};
}

export default dynamic(() => Promise.resolve(ProductEdit), { ssr: false });
