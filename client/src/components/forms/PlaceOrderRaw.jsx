import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { constants } from "../../config";
import { rawProductAbi } from "../../abi/rawProduct.abi";
import { mappingAbi } from "../../abi/mapping.abi";
import { userAbi } from "../../abi/user.abi";
import { orderAbi } from "../../abi/order.abi";

const PlaceOrderRaw = ({ web3, account, exit }) => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [mapping, setMapping] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(1);
  const [qty, setQty] = useState(0);
  const [supplierList, setSupplierList] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [total, setTotal] = useState(0);

  const OrderContract = new web3.eth.Contract(
    orderAbi,
    constants.contractAddress.Order
  );

  useEffect(() => {
    const RawProductContract = new web3.eth.Contract(
      rawProductAbi,
      constants.contractAddress.RawProduct
    );
    async function getAllRawProducts() {
      const RawProducts = [];
      const result = await RawProductContract.methods.getTotalProducts().call();
      for (let i = 1; i <= result; i++) {
        const rp = await RawProductContract.methods.getProduct(i).call();
        RawProducts.push({
          id: i,
          name: rp,
        });
      }
      setProducts(RawProducts);
    }

    getAllRawProducts();
  }, [setProducts, web3.eth.Contract]);

  useEffect(() => {
    const MappingContract = new web3.eth.Contract(
      mappingAbi,
      constants.contractAddress.Mapping
    );
    const UserContract = new web3.eth.Contract(
      userAbi,
      constants.contractAddress.User
    );

    async function getAllSuppliersAndMappings() {
      const Suppliers = {};
      const result = await UserContract.methods.getTotalUsers().call();
      for (let i = 0; i < result; i++) {
        const user = await UserContract.methods.getUserByIndex(i).call();
        if (user[1] === "1") {
          Suppliers[user[3]] = user[0];
        }
      }
      setSuppliers(Suppliers);
      const mapsNum = await MappingContract.methods
        .getTotalSRPMappings()
        .call();
      const Maps = [];
      for (let i = 1; i <= mapsNum; i++) {
        const mapping = await MappingContract.methods.getSRPMapping(i).call();
        Maps.push({
          sid: mapping[0],
          pid: mapping[1],
          price: mapping[2],
        });
      }
      setMapping(Maps);
    }
    getAllSuppliersAndMappings();
  }, [web3.eth.Contract, setSuppliers, setMapping]);

  useEffect(() => {
    const Suppliers = [];
    mapping.forEach((e) => {
      if (e.pid === selectedProduct)
        Suppliers.push({ sid: e.sid, name: suppliers[e.sid], price: e.price });
    });
    setSupplierList(Suppliers);
    if (Suppliers.length > 0) {
      setSelectedSupplier(Suppliers[0].sid);
    }
  }, [selectedProduct, setSupplierList, mapping, suppliers]);

  useEffect(() => {
    const sup = supplierList.filter((s) => s.sid === selectedSupplier)[0];
    setTotal(sup ? sup.price * qty : 0);
  }, [qty, selectedSupplier, setTotal, supplierList]);

  const handleSubmit = async (e) => {
    console.log(account);
    e.preventDefault();
    try {
      const gas = await OrderContract.methods
        .placeOrder(
          selectedProduct,
          qty,
          selectedSupplier,
          total,
          1,
          Date.now()
        )
        .estimateGas();
      const result = await OrderContract.methods
        .placeOrder(
          selectedProduct,
          qty,
          selectedSupplier,
          total,
          1,
          Date.now()
        )
        .send({
          from: account,
          gas,
        });
      console.log(result);
      exit();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <form>
        <div className="form-group">
          <label htmlFor="exampleFormControlSelect1">Product</label>
          <select
            className="form-control"
            id="exampleFormControlSelect1"
            onChange={(t) => setSelectedProduct(t.target.value)}
          >
            <option value="">Select Raw Product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="exampleFormControlSelect2">Supplier</label>
          <select className="form-control" id="exampleFormControlSelect2">
            {supplierList.map((supplier) => (
              <option key={supplier.sid} value={supplier.sid}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <input
            type="int"
            name="qty"
            onChange={(t) => setQty(t.target.value)}
            className="form-control"
            id="qtyInput"
            placeholder="Quantity"
          />
        </div>
        <div className="form-group">
          <label htmlFor="total">Total</label>
          <div>{total}</div>
        </div>
        <button className="btn btn-primary" onClick={(e) => handleSubmit(e)}>
          Place Order
        </button>
      </form>
    </div>
  );
};

PlaceOrderRaw.propTypes = {
  web3: PropTypes.object,
  account: PropTypes.string,
  exit: PropTypes.func,
};

export default PlaceOrderRaw;
