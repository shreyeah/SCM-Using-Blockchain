import React from "react";
import PropTypes from "prop-types";
import "./header.css";
import { Typography } from "@material-ui/core";

const AppBar = ({ title }) => {
  return (
    <div className="header-container">
      <Typography
        variant="h5"
        style={{ color: "#403d52", padding: 10, fontWeight: "bold" }}
      >
        {title}
      </Typography>
    </div>
  );
};

AppBar.propTypes = {
  title: PropTypes.string,
};

export default AppBar;
