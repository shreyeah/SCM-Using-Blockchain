import React, { useState } from "react";
import PropTypes from "prop-types";
import { constants } from "../../config";
import { orderAbi } from "../../abi/order.abi";

const FeedbackOrder = ({ web3, account, oid, exit }) => {
  const OrderContract = new web3.eth.Contract(
    orderAbi,
    constants.contractAddress.Order
  );

  const [feedback, setFeedback] = useState(3);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const gas = await OrderContract.methods
        .rate(oid, feedback)
        .estimateGas();
      const result = await OrderContract.methods
        .rate(oid, feedback)
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
      <div className="form-group">
        <select
          className="form-control"
          value={feedback}
          onChange={(t) => setFeedback(t.target.value)}
        >
          <option value={5}>Excellent</option>
          <option value={4}>OK</option>
          <option value={3}>Average</option>
          <option value={2}>Bad</option>
          <option value={1}>Worst</option>
        </select>
      </div>

      <button className="btn btn-primary" onClick={(e) => handleSubmit(e)}>
        Give Feedback
      </button>
    </div>
  );
};

FeedbackOrder.propTypes = {
  web3: PropTypes.object,
  account: PropTypes.string,
  oid: PropTypes.string,
  exit: PropTypes.func,
};

export default FeedbackOrder;
