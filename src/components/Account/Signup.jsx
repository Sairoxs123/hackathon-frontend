import React, { useEffect, useState } from "react";
import "./signup.css";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repass, setRepass] = useState("");
  const [grade, setGrade] = useState("");
  const [section, setSection] = useState("");
  const [message, setMessage] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cookies.logged_in) {
      return (window.location.href = "/");
    }
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

  const submit = async () => {
    if (!name || !email || !password || !repass || !grade || !section) {
      return setMessage("Please fill all the fields");
    }

    if (password !== repass) {
      return setMessage("Passwords do not match");
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

    const verification = generateText();

    axios
      .post("http://127.0.0.1:8000/account/signup/", {
        email: email,
        token: tokens[Math.floor(Math.random() * tokens.length)],
        verify: verification,
      })
      .then((res) => {
        setMessage(res.data.message);
        setCookie("verification", verification);
        setCookie("name", name);
        setCookie("password", password);
        setCookie("class", `${grade}${section}`);
        setCookie("email", email);
      });
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            sign in to your account
          </Link>
        </p>

        <form
          className="mt-10 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Name
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="name"
                id="name"
                autoComplete="name"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="repass"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Repeat Password
            </label>
            <div className="mt-2">
              <input
                type="password"
                name="repass"
                id="repass"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={(e) => setRepass(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="grade"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Grade
            </label>
            <div className="mt-2">
              <select
                id="grade"
                name="grade"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={(e) => setGrade(e.target.value)}
              >
                <option value="">Select Grade</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="section"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Section
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="section"
                id="section"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={(e) => setSection(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign up
            </button>
          </div>
          <p className="mt-2 text-center text-sm text-red-500">{message}</p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
