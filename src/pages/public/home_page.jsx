import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Eye, EyeOff, LogIn } from "lucide-react";
import { handleLogin, SendOtp, handleRegistration } from "../../api/general";

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

function RegistrationForm({ onShowRegistration, onBackToLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [currentPhase, setCurrentPhase] = useState(1); // 1: Form, 2: Verification
  const [code, setCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentPhase === 1) {
      // Phase 1: Initial registration form
      if (password !== confirmPassword) {
        setErrorMsg("Passwords do not match");
        return;
      }

      if (password.length < 6) {
        setErrorMsg("Password must be at least 6 characters long");
        return;
      }

      // Start loading and send OTP
      setIsLoading(true);
      setErrorMsg("");

      try {
        await SendOtp({ email });
        // Move to verification phase after OTP is sent
        setCurrentPhase(2);
        setOtpSent(true);
        setCountdown(60); // 60 second countdown
      } catch (error) {
        setErrorMsg("Failed to send OTP. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      // Phase 2: OTP verification
      if (!code.trim()) {
        setErrorMsg("Please enter the OTP code");
        return;
      }

      if (code.length !== 6) {
        setErrorMsg("OTP must be 6 digits");
        return;
      }

      setIsLoading(true);
      setErrorMsg("");

      try {
        // Complete registration
        await handleRegistration(email, password, code);

        setRegistrationSuccess(true);

        // Redirect back to login after 2 seconds
        setTimeout(() => {
          if (onShowRegistration) {
            onShowRegistration(false); // Hides the registration form
          }
        }, 2000);
      } catch (error) {
        setErrorMsg("Invalid OTP code. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    setCurrentPhase(1);
    setErrorMsg("");
    setCode("");
    setOtpSent(false);
  };

  const resendOtp = async () => {
    if (countdown === 0 && !isLoading) {
      setIsLoading(true);
      setErrorMsg("");

      try {
        await SendOtp({ email });
        setCountdown(60); // Reset countdown
        setErrorMsg("");
      } catch (error) {
        setErrorMsg("Failed to resend OTP. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Success state
  if (registrationSuccess) {
    return (
      <div className="w-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">
            Registration Successful!
          </h2>
          <p className="text-gray-600 mb-4">
            Your account has been created successfully.
          </p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white rounded-3xl shadow-xl relative overflow-hidden mx-auto">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-blue-600 font-medium">
              {currentPhase === 1
                ? "Sending verification code..."
                : "Verifying code..."}
            </p>
          </div>
        </div>
      )}

      {/* Phase Indicator */}
      <div className="flex justify-center p-4 bg-gray-50">
        <div className="flex items-center space-x-4">
          <div
            className={`flex items-center space-x-2 ${
              currentPhase >= 1 ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                currentPhase >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              1
            </div>
            <span className="text-sm font-medium">Details</span>
          </div>
          <div
            className={`w-8 h-0.5 ${
              currentPhase >= 2 ? "bg-blue-600" : "bg-gray-200"
            }`}
          ></div>
          <div
            className={`flex items-center space-x-2 ${
              currentPhase >= 2 ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                currentPhase >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              2
            </div>
            <span className="text-sm font-medium">Verify</span>
          </div>
        </div>
      </div>

      {currentPhase === 1 && (
        <div className="py-6 px-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
            Create Account
          </h2>
          <div>
            <div className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white text-black w-full px-4 py-3 text-base rounded-xl border border-gray-300 focus:border-blue-600 focus:outline-none transition-colors"
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                />
                <p className="text-sm text-gray-600 mt-1 ml-2">
                  Note: organizational email is recommended.
                </p>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white text-black w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:border-blue-600 focus:outline-none transition-colors"
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                />
                {showPassword ? (
                  <EyeOff
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-blue-600 transition-colors w-5 h-5"
                  />
                ) : (
                  <Eye
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-blue-600 transition-colors w-5 h-5"
                  />
                )}
              </div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-white text-black w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:border-blue-600 focus:outline-none transition-colors"
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                />
                {showConfirmPassword ? (
                  <EyeOff
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-blue-600 transition-colors w-5 h-5"
                  />
                ) : (
                  <Eye
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-blue-600 transition-colors w-5 h-5"
                  />
                )}
              </div>
            </div>

            {errorMsg && (
              <p className="text-red-500 text-sm mt-3">{errorMsg}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-blue-600 mt-6 text-white w-full py-3 text-lg rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold disabled:opacity-50"
            >
              {isLoading ? "Sending Code..." : "Continue"}
            </button>
            <div className="flex items-center justify-center w-full text-sm mt-4">
              <hr className="flex-1 border-black" />
              <button
                onClick={onBackToLogin}
                className="px-3 text-cnsc-primary-color underline-animate font-medium "
              >
                Back to Login
              </button>
              <hr className="flex-1 border-black" />
            </div>
          </div>
        </div>
      )}

      {currentPhase === 2 && (
        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-2">
              Verification Required
            </h2>
            <p className="text-gray-600">
              We've sent a verification code to {email}
            </p>
          </div>

          <div>
            <div className="space-y-6">
              {/* OTP Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter 6-digit verification code
                </label>
                <input
                  type="text"
                  placeholder="000000"
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="bg-white text-black w-full px-4 py-3 text-center text-2xl font-mono rounded-xl border border-gray-300 focus:border-blue-600 focus:outline-none transition-colors tracking-widest"
                  maxLength={6}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                />

                {/* Resend OTP */}
                <div className="text-center mt-3">
                  {countdown > 0 ? (
                    <p className="text-gray-500 text-sm">
                      Resend code in {countdown}s
                    </p>
                  ) : (
                    <button
                      onClick={resendOtp}
                      disabled={isLoading}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      {isLoading ? "Sending..." : "Resend verification code"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {errorMsg && (
              <p className="text-red-500 text-sm mt-4">{errorMsg}</p>
            )}

            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleBack}
                disabled={isLoading}
                className="flex-1 bg-gray-300 text-gray-700 py-3 text-lg rounded-xl hover:bg-gray-400 transition-all duration-300 font-semibold disabled:opacity-50"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-3 text-lg rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold disabled:opacity-50"
              >
                {isLoading ? "Verifying..." : "Complete Registration"}
              </button>
            </div>
          </div>
        </div>
      )}
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
