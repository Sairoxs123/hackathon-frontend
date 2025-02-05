import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import sendRequest from "../../utils/utils";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const DeleteAccount = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  useEffect(() => {
    if (!cookies.logged_in) {
      window.location.href = "/login";
    }
  });
  const generateText = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const length = Math.floor(Math.random() * 20) + 10; // Random length between 10 and 30

    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    return result;
  };

  const handleDelete = async () => {
    const verification = generateText();
    const formData = new FormData();
    formData.append("email", cookies.email);
    formData.append("verify", verification);
    formData.append("password", password);
    sendRequest("post", "/account/delete/", formData).then((res) => {
      setMessage(res.message);
      setCookie("delete_token", verification);
    });
  };
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Delete Account
      </h2>
      <div className="flex flex-col mb-4">
        <label htmlFor="email" className="mb-2 text-gray-700">
          Email:
        </label>
        <input
          type="email"
          disabled
          id="email"
          value={cookies.email}
          readOnly
          className="border p-3 rounded-lg bg-gray-100"
        />
      </div>
      <div className="flex flex-col mb-4 relative">
        <label htmlFor="newPassword" className="mb-2 text-gray-700">
          Password:
        </label>
        <input
          type={showPassword ? "text" : "password"}
          id="newPassword"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-3 rounded-lg pr-10"
          autofill="off"
        />
        <span
          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
          style={{ top: "40%" }}
        >
          {showPassword ? (
            <AiFillEyeInvisible className="text-gray-500" />
          ) : (
            <AiFillEye className="text-gray-500" />
          )}
        </span>
      </div>
      <button
        type="button"
        className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
        onClick={() => {
          handleDelete();
        }}
      >
        Delete Account
      </button>
      {message && <p className="mt-4 text-center text-green-500">{message}</p>}
    </div>
  );
};

export default DeleteAccount;
