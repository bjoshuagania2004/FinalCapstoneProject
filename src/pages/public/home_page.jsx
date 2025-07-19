import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Eye, EyeOff, LogIn, User } from "lucide-react";
import Login from "./login_form";
import { RegistrationForm } from "./registration_form";

function CnscTitle() {
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
      <nav className="hidden md:flex items-center space-x-6 absolute top-4 right-6 z-2 text-sm md:text-base">
        <Link
          to="/newsfeed"
          className="relative group hover:text-cnsc-secondary-color"
        >
          Public Information Page
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cnsc-secondary-color scale-x-0 group-hover:scale-x-100 transition-all duration-300"></span>
        </Link>
        <div className="h-5 w-0.5 bg-black" />
        <Link
          to="/organization"
          className="relative group hover:text-cnsc-secondary-color"
        >
          Organizations
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cnsc-secondary-color scale-x-0 group-hover:scale-x-100 transition-all duration-300"></span>
        </Link>
        <div className="h-5 w-0.5 bg-black" />
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
        className="md:hidden  text-2xl"
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center bg-cnsc-blue-color backdrop-blur-md px-6 py-4 space-y-3  text-sm">
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

export default function HomePage() {
  const [showRegistration, setShowRegistration] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative flex h-screen w-screen overflow-hidden">
      {/* Background image */}
      <img
        src="/cnscsch.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover brightness-75 z-0"
      />

      {/* Logo overlay */}
      <div className="absolute w-1/2 h-full flex items-center justify-center z-10">
        <div className="flex bg-cnsc-primary-color/80 rounded-full flex-col md:flex-row items-center ">
          <img
            className="h-40 w-auto md:h-64 transition-transform duration-300 hover:scale-105"
            src="/cnsc-codex.svg"
            alt="CNSC Codex Logo"
          />
        </div>
      </div>

      {/* Main panel (right side) */}
      <div className="absolute right-0 top-0 h-full w-full md:w-1/2 bg-white z-10 flex flex-col justify-center items-center p-4">
        <HomeNavigation />

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
    </div>
  );
}
