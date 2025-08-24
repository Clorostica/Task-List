import React from "react";
import Login from "./Login";
import Logout from "./Logout";

const Header = ({ isAuthenticated }) => {
  return <header>{isAuthenticated ? <Logout /> : <Login />}</header>;
};

export default Header;
