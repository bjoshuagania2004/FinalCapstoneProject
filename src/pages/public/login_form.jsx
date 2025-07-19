import { useState, useEffect } from "react";
import { Eye, EyeOff, LogIn, User } from "lucide-react";
import axios from "axios";
import { API_ROUTER } from "../../App";

export default function Login({ navigate, onShowRegistration }) {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_ROUTER}/login`,
        { email: username, password },
        { withCredentials: true }
      );

      console.log(response.data);

      const role = response.data.user.position;
      if (role === "student-leader") {
        navigate("/student-leader");
      } else if (role === "adviser") {
        navigate("/adviser");
      } else if (role === "dean") {
        navigate("/dean");
      } else if (role === "ossd coordinator" || role === "ossd") {
        navigate("/OSSD-Coordinator");
      } else if (role === "sdu") {
        navigate("/SDU");
      } else {
        navigate("/unauthorized");
      }
    } catch (err) {
      console.error("Login failed", err.response?.data || err.message);
      const msg =
        err.response?.data?.message || "Login failed. Please try again.";
      setErrorMsg(msg);
    }
  };

  return (
    <div className="w-3/4 h-100 bg-white rounded-3xl p-6 py-12 flex flex-col justify-center shadow-4xl items-center ">
      <form className="w-full" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-8">
          <div className="flex  text-center items-center justify-center">
            <User size={48} className="mr-6" />
            <h1 className="text-xl">
              <span className="">WELCOME TO{"  "}</span>
              <span
                className="text-cnsc-primary-color text-xl font-black"
                style={{
                  textShadow:
                    "1px 1px 0 white, -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white",
                }}
              >
                CNSC {"  "}
              </span>
              <span
                className="text-cnsc-secondary-color  font-bold"
                style={{
                  textShadow:
                    "1px 1px 0 white, -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 0 0 1px white",
                }}
              >
                CODEX
              </span>
            </h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-white text-black w-full px-6 py-3 text-base rounded-xl border  border-gray-500"
            required
          />
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white text-black w-full px-6 py-3 text-base rounded-xl border  border-gray-500"
              required
            />
            <div
              className="absolute right-4 inset-y-0 flex justify-center items-center transform  cursor-pointer text-gray-600"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
            </div>
          </div>
        </div>

        {errorMsg && <p className="text-red-500 text-sm mt-3">{errorMsg}</p>}

        <button
          type="submit"
          className="bg-cnsc-primary-color mt-6 text-cnsc-white-color w-full px-6 py-3 text-lg rounded-xl border hover:bg-cnsc-secondary-color transition-colors duration-300 flex items-center justify-center gap-2"
        >
          <LogIn size={20} />
          Login
        </button>
      </form>
      <div className="flex items-center justify-center w-full text-sm mt-4">
        <hr className="flex-1 border-black" />
        <button
          onClick={onShowRegistration}
          className="px-3 text-cnsc-primary-color underline-animate font-medium "
        >
          Register
        </button>
        <hr className="flex-1 border-black" />
      </div>
    </div>
  );
}
