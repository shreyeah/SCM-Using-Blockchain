import React, { useState } from "react";
import PropTypes from "prop-types";
import Sidebar from "../../components/sidebar/SidebarDealer";
import "./dealer.css";
import DealerOrders from "./DealerOrders";
import { Typography } from "@material-ui/core";
import PlaceOrder from "../../components/forms/PlaceOrder";

const Dealer = ({ web3, account }) => {
  const [activeSection, setActiveSection] = useState(0);

  const Content = () => {
    switch (activeSection) {
      case 1:
        return (
          <>
            <Typography variant="h5">Place Order</Typography>
            <PlaceOrder web3={web3} account={account} />
          </>
        );

      default:
        return (
          <>
            <Typography variant="h5">Dashboard</Typography>
            <DealerOrders web3={web3} account={account} />
          </>
        );
    }
  };

  return (
    <div className="container-factory">
      <div className="sidebar">
        <Sidebar nav={setActiveSection} />
      </div>
      <div className="content">
        <Content />
      </div>
    </div>
  );
};

Dealer.propTypes = {
  web3: PropTypes.object,
  account: PropTypes.string,
};

export default Dealer;
