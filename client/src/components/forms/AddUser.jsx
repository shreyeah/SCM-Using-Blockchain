import React, { useState } from "react";
import PropTypes from "prop-types";
import { constants } from "../../config";
import { userAbi } from "../../abi/user.abi";

const AddUser = ({ web3, account, type, update, exit }) => {
  const UserContract = new web3.eth.Contract(
    userAbi,
    constants.contractAddress.User
  );

  const userTypes = {
    Supplier: 1,
    Dealer: 3,
  };

  const [name, setName] = useState("");
  const [phno, setPhno] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const gas = await UserContract.methods
        .addUser(address, userTypes[type], phno, name)
        .estimateGas();
      const result = await UserContract.methods
        .addUser(address, userTypes[type], phno, name)
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
          type="text"
          name="name"
          onChange={(t) => setName(t.target.value)}
          className="form-control"
          placeholder={`${type} Name`}
        />
      </div>
      <div className="form-group">
        <input
          type="tel"
          name="phone"
          onChange={(t) => setPhno(t.target.value)}
          className="form-control"
          placeholder={`${type} Phone Number`}
        />
      </div>
      <div className="form-group">
        <input
          name="address"
          onChange={(t) => setAddress(t.target.value)}
          className="form-control"
          placeholder="Wallet Address"
        />
      </div>
      <button className="btn btn-primary" onClick={(e) => handleSubmit(e)}>
        {`Add ${type}`}
      </button>
    </div>
  );
};

AddUser.propTypes = {
  web3: PropTypes.object,
  account: PropTypes.string,
  type: PropTypes.string,
  update: PropTypes.func,
  exit: PropTypes.func,
};

export default AddUser;
