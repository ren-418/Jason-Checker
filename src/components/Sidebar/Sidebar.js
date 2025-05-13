import React from "react";
import "./Sidebar.css";

import sidebarlogo from "../../assets/sm-logo.png";
import homeIcon from "../../assets/home-icon.png";
import purchaseIcon from "../../assets/purchase-icon.png";
import { Link } from "react-router-dom";
// import shoppingIcon from "../../assets/shopping-icon.png";

const Sidebar = () => {
  return (
    <nav className="flex w-12 lg:w-48 flex-col justify-start items-center bg-[#00000040] py-3 relative min-h-screen overflow-x-hidden">
      <div className="flex gap-4 justify-center items-center w-full py-2 mb-4 border-b border-white/70">
        <img className="w-10 p-1 h-auto" src={sidebarlogo} alt="Sidebar Logo" />
        <h1 className="text-white hidden lg:inline text-lg leading-tight text-left">
          Phantom <span className="block">Checker</span>
        </h1>
      </div>

      <ul className="flex flex-col w-full p-0 gap-2">
        <Link
          className="flex w-full px-5 py-2 items-center transition-all duration-200 hover:bg-white/5"
          to="/"
        >
          <img
            className="w-4 h-auto inline mr-2.5"
            src={homeIcon}
            alt="Home Icon"
          />
          <span className="text-white hidden lg:inline">Home</span>
        </Link>
        <Link
          className="flex flex-row w-full px-5  py-2 items-center transition-all duration-200 hover:bg-white/5"
          to="/purchase"
        >
          <img
            className="w-4 h-auto inline mr-2.5"
            src={purchaseIcon}
            alt="Purchase Icon"
          />
          <span className="text-white hidden lg:inline">Purchase</span>
        </Link>
        {/* <NavItem>
          <NavLink href="#">
            <span className="icon">
              {" "}
              <img src={shoppingIcon} alt="Shopping Icon" />
            </span>
            Login
          </NavLink>
        </NavItem> */}
      </ul>
    </nav>
  );
};

export default Sidebar;
