import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { constants } from "../../config";
import { orderAbi } from "../../abi/order.abi";
import { productAbi } from "../../abi/product.abi";
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 10,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const PlaceOrder = ({ web3, account }) => {
  const classes = useStyles();

  const OrderContract = new web3.eth.Contract(
    orderAbi,
    constants.contractAddress.Order
  );
  const ProductContract = new web3.eth.Contract(
    productAbi,
    constants.contractAddress.Product
  );

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(1);
  const [qty, setQty] = useState("");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function getProducts() {
      const Products = [];
      const result = await ProductContract.methods.getTotalProducts().call();
      for (let i = 1; i <= result; i++) {
        const product = await ProductContract.methods.getProduct(i).call();
        product.id = i;
        Products.push(product);
      }
      setProducts(Products);
    }
    getProducts();
  }, [setProducts, ProductContract]);

  useEffect(() => {
    setTotal(
      products[selectedProduct - 1] ? products[selectedProduct - 1][1] * qty : 0
    );
  }, [products, selectedProduct, qty]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(selectedProduct);
    try {
      const timestamp = Date.now();
      const gas = await OrderContract.methods
        .placeOrder(
          selectedProduct,
          qty,
          "0x0000000000000000000000000000000000000001",
          total,
          2,
          timestamp
        )
        .estimateGas();
      const result = await OrderContract.methods
        .placeOrder(
          selectedProduct,
          qty,
          "0x0000000000000000000000000000000000000001",
          total,
          2,
          timestamp
        )
        .send({
          from: account,
          gas,
        });
      console.log(result);
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <Paper className={classes.paper}>
        <div className="form-group">
          <select
            className="form-control"
            onChange={(t) => setSelectedProduct(t.target.value)}
          >
            <option aria-label="None" value="">
              Select Product
            </option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {`${product[0]} (${product[1]})`}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <input
            type="number"
            name="qty"
            onChange={(t) => setQty(t.target.value)}
            className="form-control"
            placeholder={`Quantity`}
          />
        </div>
        <div className="form-group">
          <label htmlFor="total">Total</label>
          <div>{total}</div>
        </div>
        <button className="btn btn-primary" onClick={(e) => handleSubmit(e)}>
          Place Order
        </button>
      </Paper>
    </div>
  );
};

PlaceOrder.propTypes = {
  web3: PropTypes.object,
  account: PropTypes.string,
};

export default PlaceOrder;
