import React, { useState } from "react";
import axios from "axios";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    axios
      .post("http://localhost:3000/users/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        console.log("response >>>", response);
      })
      .catch((error) => {
        console.log("error >>>", error);
      });
    // props.history.push("/dashboard");
  };

  return (
    <div>
      Login
      <br />
      <br />
      <div>
        Email
        <br />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        Password
        <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <br />
      {error && <div className="error">{error}</div>}
      <input
        type="button"
        value={loading ? "Loading..." : "Login"}
        disabled={loading}
        onClick={handleLogin}
      />
    </div>
  );
};

export default Login;
