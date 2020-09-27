import React, { useState, useEffect } from "react";
import { NavLink, Route } from "react-router-dom";

import { Role } from "_helpers";
import { accountService } from "_services";

import logo from "assets/images/logo-white.png";

function Nav() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const subscription = accountService.user.subscribe((x) => setUser(x));
    return subscription.unsubscribe;
  }, []);

  // only show nav when logged in
  if (!user) return null;

  return (
    <header className="bg-dark">
      <div className="container">
        <div className="row">
          <nav className="top-nav navbar navbar-expand navbar-dark">
            <img className="logo" src={logo} alt="logo" />
            <ul className="nav__links">
              <li>
                <NavLink exact to="/" className="nav-item nav-link">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/item-price-data" className="nav-item nav-link">
                  Check Item Price
                </NavLink>
              </li>
              <li>
                <NavLink to="/whitelisted-items" className="nav-item nav-link">
                  Whitelisted Items
                </NavLink>
              </li>
              <li>
                <NavLink to="/profile" className="nav-item nav-link">
                  Profile
                </NavLink>
              </li>
              {user.role === Role.Admin && (
                <li>
                  <NavLink to="/admin" className="nav-item nav-link">
                    Admin
                  </NavLink>
                </li>
              )}
              <Route path="/admin" component={AdminNav} />
            </ul>
            <button onClick={accountService.logout} className="logout">
              Logout
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

function AdminNav({ match }) {
  const { path } = match;

  return (
    <li>
      <NavLink to={`${path}/users`} className="nav-item nav-link">
        Users
      </NavLink>
    </li>
  );
}

export { Nav };
