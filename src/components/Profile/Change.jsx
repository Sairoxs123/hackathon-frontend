import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { useCookies } from "react-cookie";
import sendRequest from '../../utils/utils';

const Change = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const location = useLocation();
  const { token } = queryString.parse(location.search);

  useEffect(() => {
    if (token == cookies.update_token) {
        const data = cookies.update_data
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('class', data.class);
        formData.append('password', data.password);
        formData.append('repass', data.repass);
        sendRequest("post", "/user/profile/info/change/verify/", formData).then((res) => {
            removeCookie("update_token");
            removeCookie("update_data");
            if (res.message == "success") {
                alert("Your information has been successfully changed.")
                window.location.href = "/profile/information"
            } else {
                alert("An error has occured.")
            }
        })
    }
  }, [])

  return (
    <div>

    </div>
  )
}

export default Change