import React, { useState, useEffect, useRef } from "react";

function Navbar() {
  const navbarRef = useRef(null);

  return (
    <nav
      className="navbar"
      ref={navbarRef}
    >
      <div className="container">
        <a href="#" className="logo">
          Your Logo
        </a>
        <ul className="nav-links">
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">About</a>
          </li>
          <li>
            <a href="#">Services</a>
          </li>
          <li>
            <a href="#">Contact</a>
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