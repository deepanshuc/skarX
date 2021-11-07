/* eslint-disable react/prop-types */
import {
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	CardMedia,
	Typography,
} from '@material-ui/core';
import React from 'react';
import NextLink from 'next/link';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function ProductItem({ product }) {
	return (
		<Card>
			<NextLink href={`/products/${product._id}`} passHref>
				<CardActionArea>
					<CardMedia
						component="img"
						image={product.images[0]}
						title={product.name}
					></CardMedia>
					<CardContent>
						<Typography>{product.name}</Typography>
					</CardContent>
				</CardActionArea>
			</NextLink>
			<CardActions>
				<Typography>₹{product.price}</Typography>
			</CardActions>
		</Card>
	);
}
