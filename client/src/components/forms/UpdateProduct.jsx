import React, { useState } from "react";
import PropTypes from "prop-types";
import { constants } from "../../config";
import { productAbi } from "../../abi/product.abi";

const UpdateProduct = ({ web3, account, details, update, exit }) => {
  const ProductContract = new web3.eth.Contract(
    productAbi,
    constants.contractAddress.Product
  );

  const [price, setPrice] = useState(details[1]);
  const [qty, setQty] = useState(details[2]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const gas = await ProductContract.methods
        .updateProduct(details.id, price, qty)
        .estimateGas();
      const result = await ProductContract.methods
        .updateProduct(details.id, price, qty)
        .send({
          from: account,
          gas,
        });
      console.log(result);
      update();
      exit();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <div className="form-group">
        <input
          name="pid"
          value={details.id}
          className="form-control"
          placeholder="PID"
          readOnly
        />
      </div>
      <div className="form-group">
        <input
          name="name"
          value={details[0]}
          className="form-control"
          placeholder="Name"
          readOnly
        />
      </div>
      <div className="form-group">
        <input
          name="price"
          value={price}
          onChange={t=>setPrice(t.target.value)}
          className="form-control"
          placeholder="Price"
        />
      </div>
      <div className="form-group">
        <input
          name="quantity"
          value={qty}
          onChange={t=>setQty(t.target.value)}
          className="form-control"
          placeholder="In Stock"
        />
      </div>
      <button className="btn btn-primary" onClick={(e) => handleSubmit(e)}>
        Update
      </button>
    </div>
  );
};

UpdateProduct.propTypes = {
  web3: PropTypes.object,
  account: PropTypes.string,
  update: PropTypes.func,
  exit: PropTypes.func,
  details: PropTypes.object,
};

export default UpdateProduct;
