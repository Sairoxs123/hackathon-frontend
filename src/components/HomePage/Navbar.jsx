import React, { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { useCookies } from "react-cookie";

function Navbar() {
  const navbarRef = useRef(null);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  return (
    <nav
      className="navbar"
      ref={navbarRef}
    >
      <div className="container">
        <Link to="#" className="logo">
          Your Logo
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/question" className="font-bold">Home</Link>
          </li>
          <li>
            <Link to="#" className="font-bold">About</Link>
          </li>
          <li>
            <Link to="#" className="font-bold">Profile</Link>
          </li>
          <li>
            {
              cookies.logged_in ? <button onClick={() => {
                removeCookie("logged_in")
                window.location.href = "/login"
              }} className="font-bold">Logout</button> : <Link to="/login" className="font-bold">Login</Link>
            }
          </li>
        </ul>
        <button className="hamburger" onClick={() => navbarRef.current.classList.toggle("active")}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;