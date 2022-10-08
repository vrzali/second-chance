import React from "react";
import { useStoreContext } from '../../utils/GlobalState';

function FormItem() {
    const [state, dispatch] = useStoreContext();
    const { categories } = state;

    const handleSubmit = (event) => {
        console.log("here");
        console.log(event.target.elements.product_name.value);
        console.log(event.target.elements.product_description.value);
        console.log(event.target.elements.product_price.value);
        console.log(event.target.elements.product_category.value);
        console.log(event.target.elements.product_image.value);
        event.preventDefault();
    };

    return (
      <div class="add-product-form">
          <header class="main-header">Add new product</header>
          <form onSubmit={(event) => {
            handleSubmit(event);
          }}>
              <label for="name">Name:</label>
              <input type="text" id="product_name" placeholder="Product name..."/>
              <label for="category">Category:</label>              
              <select name="product_category">
                  {categories.map((item) => (
                      <option
                      id={item.name}
                      >
                      {item.name}
                      </option>
                  ))}
              </select>
              <label for="description">Description:</label>
              <input type="text" id="product_description" placeholder="Description..."/>
              <label for="price">Price:</label>
              <input type="text" id="product_price" placeholder="0.00"/>
              <input type="file" name="product_image" width="48" height="48"></input>
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