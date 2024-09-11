import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

const Competition = () => {

	const [cookies, setCookie, removeCookie] = useCookies(["user"]);
	const [code, setCode] = useState("")
	const [message, setMessage] = useState("")

	if (!cookies.logged_in) {
		return window.location.href = "/login"
	}

	const submit = async () => {
		axios.get(`https://saiteja123.pythonanywhere.com/competition/verify/?session_code=${code}&email=${cookies.email}`)
		.then(
			res => {
				if (res.data.message == true) {
					return window.location.href = `/competition/${code}`
				} else {
					setMessage(res.data.message)
				}
			}
		)
	}

  return (
		<div>
			<h1>Competition</h1>
			<label>Enter Competition Code:</label>
			<input type="text" name="scode" placeholder="Enter Code: " onChange={(e) => setCode(e.target.value)} />
			<button onClick={submit}>Enter</button>
			<p>
				{message}
			</p>
		</div>
	);
};

export default Competition;
