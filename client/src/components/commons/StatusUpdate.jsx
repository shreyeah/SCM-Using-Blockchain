import React from "react";
import PropTypes from "prop-types";
import {
  FcBadDecision,
  FcApproval,
  FcCancel,
  FcOk,
  FcShipped,
} from "react-icons/fc";

const StatusUpdate = ({ status }) => {
  switch (status) {
    case 0:
      return (
        <>
          <FcCancel size={20} style={{ padding: 2 }} />
          Cancelled
        </>
      );
    case 1:
      return (
        <>
          <FcBadDecision size={20} />
          Placed
        </>
      );
    case 2:
      return (
        <>
          <FcOk size={20} />
          Accepted
        </>
      );
    case 3:
      return (
        <>
          <FcShipped size={20} />
          Shipped
        </>
      );
    case 4:
      return (
        <>
          <FcApproval size={20} />
          Completed
        </>
      );

    default:
      return <div />;
  }
};

StatusUpdate.propTypes = {
  status: PropTypes.number,
};

export default StatusUpdate;
