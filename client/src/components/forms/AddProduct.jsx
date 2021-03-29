import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { constants } from "../../config";
import { rawProductAbi } from "../../abi/rawProduct.abi";
import { productAbi } from "../../abi/product.abi";
import { mappingAbi } from "../../abi/mapping.abi";

const AddProduct = ({ web3, account, update, exit, products }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [qtyInStock, setQtyInStock] = useState(0);
  const [rawProducts, setRawProducts] = useState([]);
  const [selectedRawProducts, setSelectedRawProducts] = useState([]);

  const ProductContract = new web3.eth.Contract(
    productAbi,
    constants.contractAddress.Product
  );
  const MappingContract = new web3.eth.Contract(
    mappingAbi,
    constants.contractAddress.Mapping
  );

  useEffect(() => {
    const RawProductContract = new web3.eth.Contract(
      rawProductAbi,
      constants.contractAddress.RawProduct
    );

    async function getRaw() {
      const RawProducts = [];
      const result = await RawProductContract.methods.getTotalProducts().call();
      for (let i = 1; i <= result; i++) {
        const product = await RawProductContract.methods.getProduct(i).call();
        RawProducts.push({
          id: i,
          name: product,
        });
      }
      setRawProducts(RawProducts);
    }
    getRaw();
  }, [setRawProducts, web3.eth.Contract]);

  const handleSelect = (t) => {
    var options = t.target.options;
    var value = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setSelectedRawProducts(value);
    console.log(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const gas = await ProductContract.methods
        .addProduct(name, price, qtyInStock)
        .estimateGas();
      const result = await ProductContract.methods
        .addProduct(name, price, qtyInStock)
        .send({
          from: account,
          gas,
        });
      console.log(result);

      const pid = (await ProductContract.methods.getTotalProducts().call()) - 1;

      for (let i = 0; i < selectedRawProducts.length; i++) {
        const gas1 = await MappingContract.methods
          .mapProductToRawProduct(pid, selectedRawProducts[i])
          .estimateGas();
        const result1 = await MappingContract.methods
          .mapProductToRawProduct(pid, selectedRawProducts[i])
          .send({
            from: account,
            gas1,
          });
        console.log(result1);
      }

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
          <input
            type="text"
            name="name"
            onChange={(t) => setName(t.target.value)}
            className="form-control"
            placeholder="Product Name"
          />
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

        <div className="form-group">
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <label className="input-group-text" htmlFor="inputGroupSelect01">
                Raw Products
              </label>
            </div>
            <select
              className="custom-select"
              id="inputGroupSelect01"
              multiple
              onChange={handleSelect}
            >
              {rawProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <small className="form-text text-muted">
            Press ctrl/command to select multiple.
          </small>
        </div>
        <div className="form-group">
          <input
            name="qty"
            type="int"
            onChange={(t) => setQtyInStock(t.target.value)}
            className="form-control"
            placeholder="Quantity In Stock"
          />
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            Add Product
          </button>
          <small className="form-text text-muted">
            You will be prompted multiple times on submit.
          </small>
        </div>
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
