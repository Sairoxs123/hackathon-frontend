import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCookies } from "react-cookie";
import { Outlet } from 'react-router-dom';

export default function ProfileLayout({ children }) {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  useEffect(() => {
    if (!cookies.logged_in) {
      window.location.href = "/login";
    }
  })

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex items-center justify-between">
          {/* Left Side - Logo/Brand */}
          <div>
            <Link href="/profile" className="text-white font-bold text-xl">
              Welcome, {cookies.name}!
            </Link>
          </div>

          {/* Right Side - Navigation Links */}
          <div className="flex space-x-4">
            <Link to="/profile" className="text-gray-300 hover:text-white">Data</Link>
            <Link to="./information" className="text-gray-300 hover:text-white">Information</Link>
            <Link onClick={() => {
                removeCookie("logged_in")
                window.location.href = "/login"
            }} className="text-gray-300 hover:text-white">Logout</Link>
            <Link to="/delete" className="text-gray-300 hover:text-white">Delete Account</Link>
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>

    </div>
  );
}

