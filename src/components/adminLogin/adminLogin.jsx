/* eslint-disable react-hooks/rules-of-hooks */

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./adminLogin.css";

function adminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }

    try {
      const response = await axios.post(
        "https://carousal-backend.onrender.com/api/login/",
        {
          username: email,
          password: password,
        }
      );
      console.log("first");
      const res = response.data.token;
      console.log("succesfully login", res);

      navigate("/admin-list");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <form onSubmit={handleLogin} className="form-control" action="">
          <p className="title flex justify-center">Admin Login</p>

          <div className="input-field">
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="input"
              type="text"
            />
            <label value={password} className="label" htmlFor="emailInput">
              Enter Email
            </label>
          </div>
          <div className="input-field">
            <input
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              type="password"
            />
            <label className="label" htmlFor="passwordInput">
              Enter Password
            </label>
          </div>

          <button type="submit" className="submit-btn">
            Login
          </button>
          <div className="flex justify-center"></div>
        </form>
      </div>
    </>
  );
}

export default adminLogin;
