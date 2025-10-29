import React from "react";
import Login from "./Login";
import Logout from "./Logout";
import { useAuth0 } from "@auth0/auth0-react";
import type { AuthUser } from "../types/auth/user.types";

const Header = () => {
  const { user, isAuthenticated } = useAuth0<AuthUser>();

  return (
    <header className="flex justify-end items-center p-4 gap-3">
      {isAuthenticated ? (
        <>
          <Logout />
          {user && user.picture && user.name && (
            <img
              src={user.picture}
              alt={user.name}
              className="rounded-full w-10 h-10"
            />
          )}
        </>
      ) : (
        <Login />
      )}
    </header>
  );
};

export default Header;
