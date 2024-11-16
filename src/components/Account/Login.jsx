import React, { useState } from "react";
import { redirect } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  const submit = async () => {
    if (!email || !password) {
      return setMessage("Please fill all the fields");
    }

    const tokens = [
      "$2b$12$M.70JvwsTvv7vxuBp5skIOdZVlnBxtMHAvtxkIZQ0UFDL5WVa/q6e",
      "$2b$12$egrYQinlQI.k49TxUWAOfu9vKISeYuiY1OUo/4ZsYcDwGQS65wai6",
      "$2b$12$cYN7JPawkY0IW/LF32sQ4enuodvJpxPfcTjjZg/b2erPq/hO5WVU.",
      "$2b$12$hjLNeZxvz7.HqQaZL4iYGOmO7HxJ469BVf2.H0VNvRStr9Yt0b4QK",
      "$2b$12$aplhZ3Ifvdsg2D35tZX7hOhduq6pGF.Lx7CMXBgPbgC5ZaBq3yvU6",
      "$2b$12$2aWoYQf0Ak1v3R.RID3FZOoDlLU3zA22StA36r9OE9vOmjjZ9zqvC",
      "$2b$12$uvHbklNvHABdVfDpnAMVgeN7j3Gocpx0QyKXeRf9JPKf0YziJXcxu",
      "$2b$12$JbdFf94Q5iSNoZP.5UlmGOmt.D2ccWk.TUo5e/65.TZ7doGFYEIg6",
      "$2b$12$J7pIdMi5rACiiibgXL5zQuEu2ufdnhaR5zcm9LERy1aXPOyFwLoP.",
      "$2b$12$U5MiDbKyPcTFucobNF13tu8X9wfelwiPUH7WfwrYfJWVhClpUYQCi",
      "$2b$12$XBb6Gccyxls1RdfqXwQ6c.JCNKimhMVSps7PJNaqSVo9rPXjbRNUy",
      "$2b$12$t/z6TOP4htp3KfUsUMHyjOIaJEw/AzogX5xkW6usWX1L1CuTPeV92",
      "$2b$12$1EpuH4DyHrxgvNPcfaWD9eUXfA.ge0NCnQwTJlw9ekJ5MuAtzo95a",
      "$2b$12$h0f2QIQvze/hFlfu8aGGRudTUZI8O3J.sNNciKL./AYn0tkxVGcjm",
      "$2b$12$i7ZLJJoE7iM.aZ3Sp2U4bOe/6R61v9x7UEK4oUsYu8ZM3oF.hhw8a",
      "$2b$12$9OdEsZDmQhAUxLXmykCNMuV6kS/PgmTfJUNNNW7IUJ3rvm/ycA6zm",
      "$2b$12$ucS7V4X443BIGvdzSzKbcOW/SKuwu18DmNMuoYFy5rT9OtH3qcGu.",
      "$2b$12$0hx28zBxgKFiLGLk6rJQrOBDM88j3o/sr16FgqozhTijXj1muhri6",
      "$2b$12$3rsoblRQRGuFTHjU/DeKGuJlKji12vC1crkZPj0B0sEJXe.GFK/A6",
      "$2b$12$FIR4bliTPvrqXflX/O4QSO58z8EVIfVfThDlwBl5rYwZe1SkUkV9O",
      "$2b$12$NKj75BdPs9YDMTelLmZ66u/9A0pNzMUyKU/VYoFjlH0IPu.RH4zxm",
      "$2b$12$nrodThW5uo4PDkgvxRIsg.c8o2LCSPHcYYGFsH9LVu9KOGKmgWdc6",
      "$2b$12$N97Yi6dlteMCFK1gLsmQvO4YHLbyTDV.BbsOBu66mM9VDcGB/6Qy2",
      "$2b$12$D94WjrBJWMjST/CijgGQI.i7fy61f0mnB.E2zXxspSjOZXBZjNy0q",
      "$2b$12$5WAgSoBKmL.gD6MJKEZ1oe1CEwh3GJ0A7aGEKqYHoumYmvYcyD7fe",
    ];

    axios
      .post("http://127.0.0.1:8000/account/login/", {
        email: email,
        password: password,
        token: tokens[Math.floor(Math.random() * tokens.length)],
      })
      .then((res) => {
        if (res.data.message == "yes") {
          setCookie("name", res.data.name);
          setCookie("password", password);
          setCookie("class", res.data.class);
          setCookie("email", email);
          setCookie("logged_in", true)
          console.log(true)
          return window.location.href = "/"
        }
        setMessage(res.data.message);
      });
  };

  return (
    <div>
      <label>Email: </label>
      <br />
      <input
        type="text"
        name="email"
        placeholder="Email: "
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />
      <br />

      <label>Password: </label>
      <br />
      <input
        type="password"
        name="password"
        placeholder="Password: "
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />
      <br />

      <input type="submit" value="Submit" onClick={submit} />

      <br />
      <br />

      <p>{message}</p>

      <p>
        Don't have an account? <a href="/signup">Signup</a>
      </p>
    </div>
  );
};

export default Login;
