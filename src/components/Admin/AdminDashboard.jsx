import React, {useState, useEffect} from 'react'
import { useCookies } from "react-cookie";

const AdminDashBoard = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  if (!cookies.admin_logged_in) {
    return window.location.href = "/admin/login"
  }

  return (
    <div>Admin</div>
  )
}

export default AdminDashBoard