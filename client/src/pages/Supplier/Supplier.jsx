import React, { useState } from "react";
import PropTypes from "prop-types";
import Sidebar from "../../components/sidebar/SidebarSupplier";
import "./Supplier.css";
import { Typography } from "@material-ui/core";
import SupplierOrders from "./SupplierOrders";
import SupplierProducts from "./SupplierProducts";
import SRating from "../../components/rating/rating";

const Supplier = ({ web3, account }) => {
  const [activeSection, setActiveSection] = useState(0);

  const Content = () => {
    switch (activeSection) {
      // case 1:
      //   return (
      //     <>
      //       <Typography variant="h5">Orders</Typography>
      //       <SupplierOrders web3={web3} account={account} />
      //     </>
      //   );

      case 2:
        return (
          <>
            <Typography variant="h5">Products</Typography>
            <SupplierProducts web3={web3} account={account} />
          </>
        );
      default:
        return (
          <>
            <div className="dashboardtext">
              <Typography variant="h5">Dashboard</Typography>
            </div>
            <div className="ratingdiv">
              <SRating web3={web3} account={account} />
            </div>
            <SupplierOrders web3={web3} account={account} />
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

Supplier.propTypes = {
  web3: PropTypes.object,
  account: PropTypes.string,
};

export default Supplier;
