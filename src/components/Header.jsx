import React from "react";
import LoginButton from "./Loginbutton";
import LogoutButton from "./Logout";

const Header = ({ isAuthenticated }) => {
  return (
    <header>{isAuthenticated ? <LogoutButton /> : <LoginButton />}</header>
  );
};

export default Header;
