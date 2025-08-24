import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const buttonStyles =
  "px-5 py-2 rounded-full font-semibold shadow-lg transition-colors duration-300";

const Login = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      onClick={() => loginWithRedirect()}
      className={`${buttonStyles} bg-white text-purple-600 hover:bg-purple-100`}
    >
      Log In
    </button>
  );
};

export default Login;
