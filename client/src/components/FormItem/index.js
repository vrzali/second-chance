import React from "react";
import { useStoreContext } from '../../utils/GlobalState';
import { ADD_PRODUCT } from "../../utils/actions";
import { useMutation } from '@apollo/client';
import { ADD_PRODUCT_MUTATION } from '../../utils/mutations';

function FormItem() {
    const [state, dispatch] = useStoreContext();
    const { categories } = state;
    const [addProduct] = useMutation(ADD_PRODUCT_MUTATION);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const categoryName = event.target.elements.product_category.value;
        let categoryId;
        categories.map((item) => {
            if (item.name === categoryName) {
                categoryId = item._id;
            }
        });
        const formData = {
            name: event.target.elements.product_name.value,
            description: event.target.elements.product_description.value,
            image: "cookie-tin.jpg",
            quantity: event.target.elements.product_quantity.value,
            price: event.target.elements.product_price.value,
            myItem: "true",
            category: { _id: categoryId, name: categoryName },
        };

        console.log(formData);

        const mutationResponse = await addProduct({ variables: formData,});
        const product = mutationResponse.data.addProduct.product;
        console.log("here");
        console.log(product);
        // dispatch({
        //     type: ADD_PRODUCT,
        //     product: product
        // });
        
    };

    return (
      <div class="add-product-form">
          <header class="main-header">Add new product</header>
          <form onSubmit={(event) => {
            handleSubmit(event);
          }}>
              <label for="name">Name:</label>
              <input type="text" id="product_name" placeholder="Product name..." required/>
              <label for="category">Category:</label>              
              <select name="product_category">
                  {categories.map((item) => (
                      <option
                      id={item._id}
                      name={item.name}
                      >
                      {item.name}
                      </option>
                  ))}
              </select>
              <label for="description">Description:</label>
              <input type="text" id="product_description" placeholder="Description..." required/>
              <label for="price">Price:</label>
              <input type="number" id="product_price" required/>
              <label for="quantity">Quantity:</label>
              <input type="number" id="product_quantity" required/>
              <label for="image">Image:</label>
              <input type="file" name="product_image" width="48" height="48" required></input>
              <button id="add-product-button" type="submit" class="button">Add</button>
          </form>
          <div class="panel">
              
              <a>
                  <button class="button" id="cancel-button">Cancel</button>
              </a>
          </div>
      </div>
    );
  };
  
  export default FormItem;