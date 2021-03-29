import React from "react";
import "./factory.css";
import SalesGraph from "../../components/salesgraph/salesgraph";
import PChart from "../../components/piechart/piechart";
import InventoryTable from "../../components/inventorytable/inventorytable";
import { Typography } from "@material-ui/core";

const FactoryDashboard = () => {

  return (
    <div className="dashboard-container">
      <div className="salesgraph">
        <SalesGraph />
      </div>
      <div className="piechart-and-table-container">
        <div className="invtable">
          <Typography>Product Inventory</Typography>
          <InventoryTable />
        </div>
        <div className="piechart">
          <PChart/>
        </div>
      </div>
    </div>
  );
};

export default FactoryDashboard;
