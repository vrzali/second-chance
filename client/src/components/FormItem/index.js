import React, { useState, useEffect }  from "react";
import { useStoreContext } from '../../utils/GlobalState';
import { useMutation } from '@apollo/client';
import { ADD_PRODUCT_MUTATION } from '../../utils/mutations';
import {useNavigate} from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_USER } from '../../utils/queries';


function FormItem() {
    const [state] = useStoreContext();
    const { categories } = state;
    const [addProduct] = useMutation(ADD_PRODUCT_MUTATION);
    const navigate = useNavigate();
    const [formImage, setFormImage] = useState();
    const [preview, setPreview] = useState()

    const { data } = useQuery(QUERY_USER);
    let currentUser;

    if (data) {
        currentUser = data.user._id;
    }

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
            image: formImage.name,
            quantity: parseInt(event.target.elements.product_quantity.value),
            price: parseInt(event.target.elements.product_price.value),
            ownedBy: currentUser,
            category: { _id: categoryId, name: categoryName },
        };

        await addProduct({ variables: formData,});
        
        navigate('/myItems');
        window.location.reload(); 
    };
      // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (!formImage) {
            setPreview(undefined)
            return
        }
        const objectUrl = URL.createObjectURL(formImage)
        console.log (objectUrl)
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl) 
    }, [formImage])

    const singleFileChangedHandler = ( e ) => {
        e.preventDefault();
        if (!e.target.files || e.target.files.length === 0) {
        setFormImage(undefined)
        return
        }
        // I've kept this example simple by using the first image instead of multiple
        setFormImage(e.target.files[0])
        console.log(e.target.files[0])
    };

    const handleClick = async (event) => {
        navigate('/myItems');
    };

    return (
      <div className="add-product-form">
          <header className="main-header">Add new product</header>
          <form onSubmit={(event) => {
            handleSubmit(event);
          }}>
              <label htmlFor="name">Name:</label>
              <input type="text" id="product_name" placeholder="Product name..." required/>
              <label>Category:</label>              
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
              <label >Description:</label>
              <input type="text" id="product_description" placeholder="Description..." required/>
              <label >Price:</label>
              <input type="number" id="product_price" required/>
              <label >Quantity:</label>
              <input type="number" id="product_quantity" required/>
              <label htmlFor="product_image">Image:</label>
              <input 
              type="file" name="product_image" 
              width="48" height="48" 
              required
              onChange={singleFileChangedHandler} 
              />
                {formImage &&  <img src={preview} alt=""/> }
              <button id="add-product-button" type="submit" className="button">Add</button>
          </form>
          <div className="panel">
          <button type="button" onClick={(event) => {
            handleClick(event);
          }}>Cancel</button>
          </div>
      </div>
    );
  };
  
  export default FormItem;