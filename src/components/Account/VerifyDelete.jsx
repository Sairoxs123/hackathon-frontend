import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import sendRequest from "../../utils/utils";

const VerifyDelete = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [message, setMessage] = useState("");
  const { verification } = useParams();
  const [agreed, setAgreed] = useState(false);

  const handleCheckboxChange = () => {
    setAgreed(!agreed);
  };

  const handleDelete = async () => {
    console.log(verification)
    console.log(cookies.delete_token)
    if (verification == cookies.delete_token) {
        const formdata = new FormData();
        formdata.append("email", cookies.email);
      sendRequest("post", "/account/delete/verify/", formdata).then((res) => {
        if (res.message == "done") {
          setMessage("Account deleted successfully.");
        } else if (res.data.message == "error") {
          setMessage("Error while deleting account. Please try again later.");
        }
        removeCookie("verification");
        Object.keys(cookies).forEach(cookieName => {
          removeCookie(cookieName);
        });
      });
    } else {
        setMessage("Verification Failed. Please try again later.")
    }
  };

return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Delete Account</h2>
            <p className="text-gray-700 mb-4 text-center">
                Your data cannot be retrieved if you delete your account.
            </p>
            <label className="flex items-center mb-4">
                <input
                    type="checkbox"
                    checked={agreed}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                />
                <span className="text-gray-700">I understand and agree</span>
            </label>
            {agreed && (
                <button
                    onClick={handleDelete}
                    className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
                >
                    Delete Account
                </button>
            )}
            <p className="mt-4 text-center text-sm text-green-500">{message}</p>
        </div>
    </div>
);
};

export default VerifyDelete;
