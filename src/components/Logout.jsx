import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const buttonStyles = "px-5 py-2 rounded-full font-semibold shadow-lg transition-colors duration-300";

const Logout = () => {
  const { logout } = useAuth0();

  return (
    <button
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      className={`${buttonStyles} bg-white text-red-600 hover:bg-red-100`}
    >
      Log Out
    </button>
  );
};

export default Logout;