import React from "react";
import { useD1Auth } from "../context/D1AuthContext";

function Header({ goTo }) {
  const { user, plan, logout } = useD1Auth();

  const handleLogout = async () => {
    await logout();
    goTo("home");
  };

  return (
    <header className="site-header">
      <div className="dev-logo" onClick={() => goTo("home")} role="button" tabIndex={0}>
        DEV@Deakin
      </div>

      <div className="site-search">
        <input type="search" placeholder="Search..." aria-label="Search" />
      </div>

      <nav className="top-nav" aria-label="Main navigation">
        <button onClick={() => goTo("newpost")}>Post</button>
        <button onClick={() => goTo("pricing")}>Pricing</button>
        {user ? (
          <>
            <span className="plan-label">{plan === "paid" ? "Paid" : "Free"}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <button onClick={() => goTo("login")}>Login</button>
        )}
      </nav>
    </header>
  );
}

export default Header;
