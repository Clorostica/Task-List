import React from "react";
import LoginButton from "./Loginbutton";
import LogoutButton from "./Logout";

const Header = ({ isAuthenticated }) => {
  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg p-6 flex justify-between items-center">
      <h1 className="text-3xl font-extrabold text-white tracking-wide drop-shadow-lg">
        Task List
      </h1>
      <div>
        {isAuthenticated ? (
          <LogoutButton className="bg-white text-purple-700 px-5 py-2 rounded-lg font-semibold shadow hover:bg-purple-100 transition" />
        ) : (
          <LoginButton className="bg-white text-purple-700 px-5 py-2 rounded-lg font-semibold shadow hover:bg-purple-100 transition" />
        )}
      </div>
    </header>
  );
};

export default Header;
