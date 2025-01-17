import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import Cart from '../components/Cart';
import { useStoreContext } from '../utils/GlobalState';
import {
    REMOVE_FROM_CART,
    UPDATE_CART_QUANTITY,
    ADD_TO_CART,
    UPDATE_PRODUCTS,
} from '../utils/actions';
import { QUERY_PRODUCTS, QUERY_USER } from '../utils/queries';
import { idbPromise } from '../utils/helpers';
import spinner from '../assets/spinner.gif';
import { Button, Grid, Image } from 'semantic-ui-react'

function Detail() {
    const [state, dispatch] = useStoreContext();
    const { id } = useParams();

    const [currentProduct, setCurrentProduct] = useState({});

    const { loading, data } = useQuery(QUERY_PRODUCTS);

    const { products, cart } = state;

    const response = useQuery(QUERY_USER);
    let currentUser;

    if (response.data) {
        currentUser = response.data.user._id;
    }

    useEffect(() => {
        // already in global store
        if (products.length) {
            setCurrentProduct(products.find((product) => product._id === id));
        }
        // retrieved from server
        else if (data) {
            dispatch({
                type: UPDATE_PRODUCTS,
                products: data.products,
            });

            data.products.forEach((product) => {
                idbPromise('products', 'put', product);
            });
        }
        // get cache from idb
        else if (!loading) {
            idbPromise('products', 'get').then((indexedProducts) => {
                dispatch({
                    type: UPDATE_PRODUCTS,
                    products: indexedProducts,
                });
            });
        }
    }, [products, data, loading, dispatch, id]);

    const addToCart = () => {
        const itemInCart = cart.find((cartItem) => cartItem._id === id);
        if (itemInCart) {
            dispatch({
                type: UPDATE_CART_QUANTITY,
                _id: id,
                purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
            });
            idbPromise('cart', 'put', {
                ...itemInCart,
                purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
            });
        } else {
            dispatch({
                type: ADD_TO_CART,
                product: { ...currentProduct, purchaseQuantity: 1 },
            });
            idbPromise('cart', 'put', { ...currentProduct, purchaseQuantity: 1 });
        }
    };

    const removeFromCart = () => {
        dispatch({
            type: REMOVE_FROM_CART,
            _id: currentProduct._id,
        });

        idbPromise('cart', 'delete', { ...currentProduct });
    };

    return (
        <div>
            {currentProduct && cart ? (
                <div className="container my-2 py-2">
                    <Grid>
                        <Grid.Column width={9}>
                            <Image
                                src={`${currentProduct.image}`}
                                alt={currentProduct.name}
                            />
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <h2>{currentProduct.name}</h2>
                            <strong>Price:</strong>${currentProduct.price}
                            <p className='py-1'>{currentProduct.description}</p>
                            <p>
                                {currentProduct.ownedBy === currentUser ? "" : <span>
                                    <Button primary onClick={addToCart}>Add to Cart</Button>
                                    <Button
                                        disabled={!cart.find((p) => p._id === currentProduct._id)}
                                        onClick={removeFromCart}
                                    >
                                        Remove from Cart
                                    </Button>
                                </span>}
                            </p>
                        </Grid.Column>
                    </Grid>
                    {/* <Link to="/">← Back to Products</Link>
                    <h2>{currentProduct.name}</h2>

                    <p>{currentProduct.description}</p>

                    <p>
                        <strong>Price:</strong>${currentProduct.price}
                        {currentProduct.ownedBy === currentUser ? "" : <span>
                            <button onClick={addToCart}>Add to Cart</button>
                            <button
                                disabled={!cart.find((p) => p._id === currentProduct._id)}
                                onClick={removeFromCart}
                            >
                                Remove from Cart
                            </button>
                        </span>}
                    </p>

                    <img
                        src={`/images/${currentProduct.image}`}
                        alt={currentProduct.name}
                    /> */}
                </div>
            ) : null
            }
            {loading ? <img src={spinner} alt="loading" /> : null}
            <Cart />
        </div >
    );
}

export default Detail;
