import React from 'react';
import { Link } from 'react-router-dom';
import ProductList from "../components/ProductList";
import CategoryMenu from "../components/CategoryMenu";
import Cart from "../components/Cart";

import { useQuery } from '@apollo/client';
import { QUERY_USER } from '../utils/queries';

function MyItems() {
  const { data } = useQuery(QUERY_USER);
  let user;

  if (data) {
    user = data.user;
  }

  return (
    <>
      <div className="container">
        <CategoryMenu />
        <ProductList type="myItems" />
      </div>
    </>
  );
}

export default MyItems;
