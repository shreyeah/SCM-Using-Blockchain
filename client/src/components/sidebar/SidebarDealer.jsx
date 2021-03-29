import React from "react";
import PropTypes from "prop-types";
import "./sidebar.css";
import {
  AiOutlineHome,

  AiOutlineBook,
  AiOutlineUser,
} from "react-icons/ai";
import { Avatar, Typography } from "@material-ui/core";
import Logo from "../commons/Logo";

const SidebarItem = ({ icon, text, navigate, to }) => {
  return (
    <div className="sidebar-item" onClick={() => navigate(to)}>
      <span className="sidebar-icon">{icon}</span>
      <div className="item-text">{text}</div>
    </div>
  );
};

SidebarItem.propTypes = {
  icon: PropTypes.element,
  text: PropTypes.string,
  navigate: PropTypes.func,
  to: PropTypes.number,
};

const Sidebar = ({ nav }) => {
  return (
    <div className="sidebar-container">
      <div>
        <Logo />
        <div className="sidebar-items">
          <SidebarItem
            icon={<AiOutlineHome size={24} />}
            text={"Dashboard"}
            navigate={nav}
            to={0}
          />
          <SidebarItem
            icon={<AiOutlineBook size={24} />}
            text={"Place Order"}
            navigate={nav}
            to={1}
          />
          
          
        </div>
      </div>

      <div className="sidebar-footer">
        <Avatar>
          <AiOutlineUser />
        </Avatar>
        <Typography
          variant="subtitle1"
          style={{ paddingLeft: 20, paddingTop: 5, color: "#ffffff" }}
        >
          Dealer
        </Typography>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  nav: PropTypes.func,
};

export default Sidebar;
