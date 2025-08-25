import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const buttonStyles =
  "px-5 py-2 rounded-full font-semibold shadow-lg transition-colors duration-300";

const Login = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      onClick={() => loginWithRedirect()}
      className={`${buttonStyles} bg-white text-purple-600 hover:bg-purple-100 flex items-center gap-2`}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
        />
      </svg>
      Sign In
    </button>
  );
};

export default Login;
