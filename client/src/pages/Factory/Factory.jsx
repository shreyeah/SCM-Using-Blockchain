import React, { useState } from "react";
import PropTypes from "prop-types";
import Sidebar from "../../components/sidebar/Sidebar";
import "./factory.css";
import FactoryRawProducts from "./FactoryRawProducts";
import FactoryDealers from "./FactoryDealers";
import FactorySuppliers from "./FactorySuppliers";
import FactoryProducts from "./FactoryProducts";
import FactoryOrders from "./FactoryOrders";
import { Typography } from "@material-ui/core";
import FactoryDashboard from "./FactoryDashboard";

const Factory = ({ web3, account }) => {
  const [activeSection, setActiveSection] = useState(0);

  const Content = () => {
    switch (activeSection) {
      case 1:
        return (
          <>
            <Typography variant="h5">Orders</Typography>
            <FactoryOrders web3={web3} account={account} />
          </>
        );
      case 2:
        return (
          <>
            <Typography variant="h5">Products</Typography>
            <FactoryProducts web3={web3} account={account} />
          </>
        );
      case 3:
        return (
          <>
            <Typography variant="h5">Suppliers</Typography>
            <FactorySuppliers web3={web3} account={account} />
          </>
        );
      case 4:
        return (
          <>
            <Typography variant="h5">Dealers</Typography>
            <FactoryDealers web3={web3} account={account} />
          </>
        );
      case 5:
        return (
          <>
            <Typography variant="h5">Raw Products</Typography>
            <FactoryRawProducts web3={web3} account={account} />
          </>
        );
      default:
        return (
          <>
            <Typography variant="h5">Dashboard</Typography>
            <FactoryDashboard/>
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

Factory.propTypes = {
  web3: PropTypes.object,
  account: PropTypes.string,
};

export default Factory;
