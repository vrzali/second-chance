import React from 'react';
import ProductList from "../components/ProductList";
import CategoryMenu from "../components/CategoryMenu";

import { useQuery } from '@apollo/client';
import { QUERY_USER } from '../utils/queries';
import AddItem from '../components/AddItem';

function MyItems() {
  const { data } = useQuery(QUERY_USER);
  let user;

  if (data) {
    user = data.user;
  }

  return (
    <>
      <div className="container">
        <AddItem />
        <CategoryMenu />
        <ProductList type="myItems" />
      </div>
    </>
  );
}

export default MyItems;
