import React, { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';

function Navbar() {
  const navbarRef = useRef(null);

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
            <Link to="/questions">Home</Link>
          </li>
          <li>
            <Link to="#">About</Link>
          </li>
          <li>
            <Link to="#">Services</Link>
          </li>
          <li>
            <Link to="#">Contact</Link>
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