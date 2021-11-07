/* eslint-disable react/prop-types */
import React, { useContext /*useEffect, useState*/ } from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import {
	Grid,
	Link,
	List,
	ListItem,
	Typography,
	Card,
	Button,
} from '@material-ui/core';
import Layout from '../../components/Layout';
import useStyles from '../../utils/styles';
import { getProductById } from '../../models/Product';
import copy from 'copy-to-clipboard';
import { useSnackbar } from 'notistack';
import { ShareRounded } from '@material-ui/icons';
import Slide from '@material-ui/core/Slide';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function ProductScreen(props) {
	const { product } = props;
	const classes = useStyles();
	const { enqueueSnackbar } = useSnackbar();

	if (!product) {
		return <div>Product Not Found</div>;
	}
	const purchaseHandler = async () => {
		// const { data } = await axios.get(`/api/products/${product._id}`);
		// const quantity = existItem ? existItem.quantity + 1 : 1;
		// if (data.stock < quantity) {
		// 	window.alert('Sorry. Product is out of stock');
		// 	return;
		// }
		// router.push('/cart');
	};

	const CopyToClipboard = async () => {
		const data = window.location.href;
		copy(data);
		enqueueSnackbar('Copied To Clipboard !', {
			variant: 'success',
			anchorOrigin: {
				vertical: 'left',
				horizontal: 'left',
			},
			TransitionComponent: Slide,
		});
	};

	return (
		<Layout title={product.name} description={product.description}>
			<div className={classes.section}>
				<NextLink href="/" passHref>
					<Link>
						<Typography>Back to products</Typography>
					</Link>
				</NextLink>
			</div>
			<Grid container spacing={1}>
				<Grid item md={6} xs={12}>
					<Image
						src={product.images[0]}
						alt={product.name}
						width={640}
						height={640}
						layout="responsive"
					></Image>
				</Grid>
				<Grid item md={3} xs={12}>
					<List>
						<ListItem>
							<Typography component="h1" variant="h1">
								{product.name}
							</Typography>
						</ListItem>
						<ListItem>
							<Typography>
								Category: {product.category}
							</Typography>
						</ListItem>
						<ListItem>
							<Typography>Brand: {product.brand}</Typography>
						</ListItem>
						<ListItem>
							<Typography>
								{' '}
								Description: {product.description}
							</Typography>
						</ListItem>
					</List>
				</Grid>
				<Grid item md={3} xs={12}>
					<Card>
						<List>
							<ListItem>
								<Grid container>
									<Grid item xs={6}>
										<Typography>Price</Typography>
									</Grid>
									<Grid item xs={6}>
										<Typography>
											₹{product.price}
										</Typography>
									</Grid>
								</Grid>
							</ListItem>
							<ListItem>
								<Grid container>
									<Grid item xs={6}>
										<Typography>Status</Typography>
									</Grid>
									<Grid item xs={6}>
										<Typography>
											{product.stock > 0
												? 'In stock'
												: 'Unavailable'}
										</Typography>
									</Grid>
								</Grid>
							</ListItem>
							<ListItem>
								<Button
									fullWidth
									variant="contained"
									color="primary"
									onClick={purchaseHandler}
								>
									Buy Now
								</Button>
								<Button
									fullWidth
									color="primary"
									onClick={CopyToClipboard}
								>
									Share
									<ShareRounded />
								</Button>
							</ListItem>
						</List>
					</Card>
				</Grid>
			</Grid>
		</Layout>
	);
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getServerSideProps(context) {
	const { params } = context;
	const { productId } = params;
	const data = await getProductById(productId);
	return {
		props: {
			product: data,
		},
	};
}
