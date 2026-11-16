import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../Style/App.css";
export default function Login() {
  const [useData, setData] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("login")) {
      navigate("/");
    }
  });
  const handleLoginUp = async () => {
    console.log(useData);
    let result = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: "post",
      body: JSON.stringify(useData),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    result = await result.json();

    if (result.success) {
      localStorage.setItem("login", useData.email);
      window.dispatchEvent(new Event("localStorage-change"));
      navigate("/");
    } else {
      alert("Try after sometime");
    }
  };
  return (
    <div className="container">
      <h1>Login</h1>

      <label htmlFor="">Email</label>
      <input
        onChange={(event) => setData({ ...useData, email: event.target.value })}
        type="email"
        name="Email"
        id=""
        placeholder="enter email"
      />

      <label htmlFor="">Password</label>
      {/* FIX: type "text" ki jagah "password" taaki password hide rahe */}
      <input
        onChange={(event) =>
          setData({ ...useData, password: event.target.value })
        }
        type="password"
        name="password"
        id=""
        placeholder="enter pass"
      />

      <button onClick={handleLoginUp} className="submit">
        Login
      </button>
      <Link className="Link" to="/signup">
        SignUp
      </Link>
    </div>
  );
}
