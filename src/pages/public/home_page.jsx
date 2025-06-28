import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Eye, EyeOff, LogIn } from "lucide-react";
import { handleLogin, SendOtp, handleRegistration } from "../../api/general";
import { RegistrationForm } from "./registration_form";
function CnscTitle() {
  {
    /* CNSC CODEX Titles */
  }
  return (
    <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full max-w-xl">
      <h1
        className="text-cnsc-primary-color text-7xl md:text-9xl font-black"
        style={{
          textShadow:
            "1px 1px 0 white, -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white",
        }}
      >
        CNSC
      </h1>
      <h1
        className="text-cnsc-secondary-color text-6xl md:text-9xl font-bold"
        style={{
          textShadow:
            "1px 1px 0 white, -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 0 0 1px white",
        }}
      >
        CODEX
      </h1>

      <h1 className="text-sm md:text-base text-cnsc-white-color italic mt-4">
        Document Tracking and Data Management for Student Organizations
      </h1>
    </div>
  );
}

function HomeNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center space-x-6 text-white text-sm md:text-base">
        <Link
          to="/newsfeed"
          className="relative group hover:text-cnsc-secondary-color"
        >
          Public Information Page
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cnsc-secondary-color scale-x-0 group-hover:scale-x-100 transition-all duration-300"></span>
        </Link>
        <div className="h-5 w-0.5 bg-white" />
        <Link
          to="/organization"
          className="relative group hover:text-cnsc-secondary-color"
        >
          Organizations
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cnsc-secondary-color scale-x-0 group-hover:scale-x-100 transition-all duration-300"></span>
        </Link>
        <div className="h-5 w-0.5 bg-white" />
        <Link
          to="/manuals"
          className="relative group hover:text-cnsc-secondary-color"
        >
          Manuals
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cnsc-secondary-color scale-x-0 group-hover:scale-x-100 transition-all duration-300"></span>
        </Link>
      </nav>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-white text-2xl"
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center bg-cnsc-blue-color backdrop-blur-md px-6 py-4 space-y-3 text-white text-sm">
          <Link
            to="/newsfeed"
            className="block hover:text-cnsc-secondary-color"
            onClick={() => setMenuOpen(false)}
          >
            Public Information Page
          </Link>
          <Link
            to="/organization"
            className="block hover:text-cnsc-secondary-color"
            onClick={() => setMenuOpen(false)}
          >
            Organizations
          </Link>
          <Link
            to="/manuals"
            className="block hover:text-cnsc-secondary-color"
            onClick={() => setMenuOpen(false)}
          >
            Manuals
          </Link>
        </div>
      )}
    </>
  );
}

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

export default function HomePage() {
  const [showRegistration, setShowRegistration] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col h-screen w-screen overflow-hidden p-6">
      {/* Background image */}
      <img
        src="/cnscsch.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Overlay content */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex justify-center items-center gap-4">
          <img
            className="h-10 md:h-12 w-auto"
            src="/cnsc_codex_ver_2.png"
            alt="CNSC Codex Logo"
          />
          <span className="text-sm md:text-base text-white font-bold">
            CNSC CODEX
          </span>
        </div>
        <HomeNavigation />
      </div>

      <div className="z-1 flex justify-between px-4 h-full items-center w-full">
        <div className="flex border-8 border-white mb-auto mt-12 h-3/4 "></div>
        <CnscTitle />
        <div className="w-1/3">
          {showRegistration ? (
            <RegistrationForm
              onBackToLogin={() => setShowRegistration(false)}
              onShowRegistration={setShowRegistration}
            />
          ) : (
            <Login
              navigate={navigate}
              onShowRegistration={() => setShowRegistration(true)}
            />
          )}
        </div>
        <div className="flex border-8 border-white h-3/4 mb-12 mt-auto"></div>
      </div>
    </div>
  );
}
