import React, { useState } from 'react';
import { useCookies } from "react-cookie";

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  const handleSubmit = (e) => {
    if (password == "jsspsadmin") {
        setCookie("admin_logged_in", true)
        return window.location.href = "/admin";
    } else {
        alert("Invalid Password");
    }
 };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
          <div className="mb-4"> {/* Removed form element */}
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="border border-gray-400 p-2 rounded w-full focus:outline-none focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Login
          </button>
      </div>
    </div>
  );
};

export default AdminLogin;
