import React, { useState } from "react";
import PropTypes from "prop-types";
import { constants } from "../../config";
import { mappingAbi } from "../../abi/mapping.abi";

const AddProduct = ({ web3, account, update, exit, products }) => {
  console.log(account);

  const MappingContract = new web3.eth.Contract(
    mappingAbi,
    constants.contractAddress.Mapping
  );
  console.log(products);
  const [selectedProduct, setSelectedProduct] = useState(1);
  const [price, setPrice] = useState(0);
  const [rawProducts, setrawProducts] = useState(products);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const gas = await MappingContract.methods
        .mapSupplierToRawProduct(selectedProduct, price)
        .estimateGas();
      const result = await MappingContract.methods
        .mapSupplierToRawProduct(selectedProduct, price)
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
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="form-group">
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <label className="input-group-text" htmlFor="inputGroupSelect01">
                Product
              </label>
            </div>
            <select
              className="custom-select"
              id="inputGroupSelect01"
              onChange={(t) => setSelectedProduct(t.target.value)}
            >
              {rawProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-group">
          <input
            name="price"
            type="int"
            onChange={(t) => setPrice(t.target.value)}
            className="form-control"
            placeholder="Product Price"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Product
        </button>
      </form>
    </div>
  );
};

AddProduct.propTypes = {
  web3: PropTypes.object,
  account: PropTypes.string,
  update: PropTypes.func,
  exit: PropTypes.func,
  products: PropTypes.array,
};

export default AddProduct;
