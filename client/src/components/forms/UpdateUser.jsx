import React, { useState } from "react";
import PropTypes from "prop-types";
import { constants } from "../../config";
import { userAbi } from "../../abi/user.abi";

const UpdateUser = ({ web3, account, userDetails, update, exit }) => {
  const UserContract = new web3.eth.Contract(
    userAbi,
    constants.contractAddress.User
  );

  const [name, setName] = useState(userDetails.name);
  const [phno, setPhno] = useState(userDetails.phno);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const gas = await UserContract.methods
        .updateUser(userDetails.address, name, phno)
        .estimateGas();
      const result = await UserContract.methods
        .updateUser(userDetails.address, name, phno)
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
          value={name}
          onChange={(t) => setName(t.target.value)}
          className="form-control"
          placeholder="Name"
        />
      </div>
      <div className="form-group">
        <input
          type="tel"
          name="phone"
          value={phno}
          onChange={(t) => setPhno(t.target.value)}
          className="form-control"
          placeholder="Phone Number"
        />
      </div>
      <div className="form-group">
        <input
          name="address"
          value={userDetails.address}
          className="form-control"
          placeholder="Wallet Address"
          readOnly
        />
      </div>
      <button className="btn btn-primary" onClick={(e) => handleSubmit(e)}>
        Update
      </button>
    </div>
  );
};

UpdateUser.propTypes = {
  web3: PropTypes.object,
  account: PropTypes.string,
  update: PropTypes.func,
  exit: PropTypes.func,
  userDetails: PropTypes.object,
};

export default UpdateUser;
