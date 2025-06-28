import { useState, useEffect } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { handleLogin, SendOtp, handleRegistration } from "../../api/general";
import { RegistrationForm } from "./registration_form";

function Login({ navigate, onShowRegistration }) {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin(username, password, navigate, setErrorMsg);
  };

  return (
    <div className="w-full h-full bg-cnsc-white-color rounded-3xl p-15 py-20 flex flex-col justify-center items-center shadow-xl">
      <form className="w-full" onSubmit={handleSubmit}>
        <div className="space-y-6">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-white text-black w-full px-6 py-3 text-base rounded-xl border border-gray-300"
            required
          />
          <div className="relative bg-white text-black w-full rounded-xl border border-gray-300">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white w-full px-6 py-3 rounded-xl outline-none text-base"
              required
            />
            <div
              className="absolute right-5 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
