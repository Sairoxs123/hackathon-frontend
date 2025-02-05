import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import sendRequest from "../../utils/utils";

const Verification = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [message, setMessage] = useState("");

  const { verification } = useParams();

  if (verification == cookies.verification) {
    sendRequest("post", "/account/signup/verify/", {
      "email": cookies.email,
      "name": cookies.name,
      "password": cookies.password,
      "class": cookies.class,
    }).then(
      res => {
        if (res.data.message == "invalid") {
          <div>Verification Failed. Please try again later.</div>;
        } else if (res.data.message == "exists") {
          return <div>Account already exists. Please try again later.</div>;
        }
        removeCookie("verification")
        setCookie("logged_in", true)
        window.location.href = "/"
      }
    )
  } else {
    return <div>Error while verifying</div>;
  }
  return <div>Verification done.</div>;
};

export default Verification;
