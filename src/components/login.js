import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/context";
import { getApiUrl } from "../utils/apiConfig";

const Login = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${getApiUrl()}/auth/login`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data);
      setIsAuthenticated(true)
      toast.success(`Welcome! ${data.name}. Please wait...`, {
        duration: 5000,
        isClosable: true,
        position: toast.POSITION.TOP_CENTER,
      });

      localStorage.setItem("user", JSON.stringify(data));
      
      setTimeout(() => {
        navigate("/");
      }, 4000);
      
    } catch (error) {
      console.log("Login error:", error);
      setIsAuthenticated(false);
      const errorMessage = error.response?.data?.error || error.message || "An error occurred during login";
      toast.error(errorMessage, {
        duration: 5000,
        isClosable: true,
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  return (
    <div className="welcome-container">
      <form className="form" onSubmit={handleLogin}>
        <label htmlFor="email">Provide your email</label>
        <input
          type="email"
          name="email"
          className="input"
          id="email"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <label htmlFor="password">Enter your password</label>
        <input
          type="password"
          className="input"
          name="password"
          id="password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn">Log In</button>
      </form>
    </div>
  );
};
export default Login;
