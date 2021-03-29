import React, { useState } from "react";
import PropTypes from "prop-types";
import { constants } from "../../config";
import { orderAbi } from "../../abi/order.abi";

const UpdateOrder = ({ web3, account, oid, initStatus, update, exit }) => {
  const OrderContract = new web3.eth.Contract(
    orderAbi,
    constants.contractAddress.Order
  );

  const [status, setStatus] = useState(initStatus < 2 ? 2 : initStatus);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const timestamp = Date.now();
      const gas = await OrderContract.methods
        .updateStatus(oid, status, timestamp)
        .estimateGas();
      const result = await OrderContract.methods
        .updateStatus(oid, status, timestamp)
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
        <select
          className="form-control"
          onChange={(t) => setStatus(t.target.value)}
        >
          <option value={2}>Accept Order</option>
          <option value={3}>Mark as Shipped</option>
          <option value={4}>Mark as Complete</option>
          <option value={0}>Cancel Order</option>
        </select>
      </div>

      <button className="btn btn-primary" onClick={(e) => handleSubmit(e)}>
        Update Status
      </button>
    </div>
  );
};

UpdateOrder.propTypes = {
  web3: PropTypes.object,
  account: PropTypes.string,
  oid: PropTypes.string,
  initStatus: PropTypes.string,
  update: PropTypes.func,
  exit: PropTypes.func,
};

export default UpdateOrder;
