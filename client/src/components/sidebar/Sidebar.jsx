import React from "react";
import PropTypes from "prop-types";
import "./sidebar.css";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineShop,
  AiOutlineBook,
  AiOutlineUser,
  AiOutlineBuild,
} from "react-icons/ai";
import { BsFileBreak } from "react-icons/bs";
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
            text={"orders"}
            navigate={nav}
            to={1}
          />
          <SidebarItem
            icon={<AiOutlineBuild size={24} />}
            text={"Raw Products"}
            navigate={nav}
            to={5}
          />
          <SidebarItem
            icon={<BsFileBreak size={24} />}
            text={"products"}
            navigate={nav}
            to={2}
          />
          <SidebarItem
            icon={<AiOutlineShopping size={24} />}
            text={"suppliers"}
            navigate={nav}
            to={3}
          />
          <SidebarItem
            icon={<AiOutlineShop size={24} />}
            text={"dealers"}
            navigate={nav}
            to={4}
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
          Factory
        </Typography>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  nav: PropTypes.func,
};

export default Sidebar;
