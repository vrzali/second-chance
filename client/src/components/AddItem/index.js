import React from "react";
import { Link } from "react-router-dom";

// The ...props means, spread all of the passed props onto this element
// That way we don't have to define them all individually
function AddItem(props) {

  return (
    <Link to="/form">Add your Item</Link>
  );
}

export default AddItem;