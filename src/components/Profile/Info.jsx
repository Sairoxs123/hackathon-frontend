import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import sendRequest from "../../utils/utils";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Info = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [profileData, setProfileData] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [className, setClassName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const [message, setMessage] = useState("");

  // State variables for show/hide password
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatNewPassword, setShowRepeatNewPassword] = useState(false);

  useEffect(() => {
    sendRequest("get", `/user/profile/info/?email=${cookies.email}`).then(
      (res) => {
        setProfileData(res.data);
        setName(res.data.name);
        setEmail(res.data.email);
        setClassName(res.data.class);
      }
    );
  }, []);

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

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('class', className);
    formData.append('password', newPassword);
    formData.append('repass', repeatNewPassword);
    sendRequest("post", "/user/profile/info/change/", formData).then((res) => {
      setMessage(res.message);
      if (res.token) {
        setCookie("update_token", res.token)
        setCookie("update_data", {
          name: name,
          email: email,
          class: className,
          password: newPassword,
          repass: repeatNewPassword
        })
      }
    })
  }



  return (
    <div className="flex justify-center items-center h-screen">
      {" "}
      {/* Center content on screen */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        {" "}
        {/* White background, padding, rounded corners, shadow, fixed width */}
        {typeof profileData == "object" ? (
          <div className="flex flex-col space-y-4">
            <h2 className="text-2xl font-bold text-center mb-4">
              User Information
            </h2>

            <div className="flex flex-col">

              <label htmlFor="name" className="mb-1">
                Name:
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 rounded"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="mb-1">
                Email:
              </label>
              <input
                type="email"
                disabled
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                readOnly
                className="border p-2 rounded"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="class" className="mb-1">
                Class:
              </label>
              <input
                type="text"
                id="class"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="border p-2 rounded"
              />
            </div>
            <div className="flex flex-col relative">
              <label htmlFor="newPassword" className="mb-1 text-gray-700">
                New Password:
              </label>
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border p-2 rounded"
              />
              <span
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <AiFillEyeInvisible className="mt-8" />
                ) : (
                  <AiFillEye className="mt-8" />
                )}
              </span>
            </div>

            <div className="flex flex-col relative">
              <label htmlFor="repeatNewPassword" className="mb-1 text-gray-700">
                Repeat New Password:
              </label>
              <input
                type={showRepeatNewPassword ? "text" : "password"}
                id="repeatNewPassword"
                value={repeatNewPassword}
                onChange={(e) => setRepeatNewPassword(e.target.value)}
                className="border p-2 rounded"
              />
              <span
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowRepeatNewPassword(!showRepeatNewPassword)}
              >
                {showRepeatNewPassword ? (
                  <AiFillEyeInvisible className="mt-8" />
                ) : (
                  <AiFillEye className="mt-8" />
                )}
              </span>
            </div>
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleSubmit()}
            >
              Update Details
            </button>
            {message && (
              <p
                className={`text-sm mt-2 ${
                  message.includes("sent")
                    ? "text-green-500 font-bold"
                    : "text-red-500 font-bold"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        ) : (
          <div>An error has occured.</div>
        )}
      </div>
    </div>
  );
};

export default Info;
