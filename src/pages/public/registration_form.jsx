import { useState, useEffect } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import axios from "axios";
import { API_ROUTER } from "../../App";

export function RegistrationForm({ onShowRegistration, onBackToLogin }) {
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
        // If we reach here, OTP was sent successfully
        setCurrentPhase(2);
        setOtpSent(true);
        setCountdown(60); // 60 second countdown
      } catch (error) {
        // Handle different error scenarios
        if (
          error.response &&
          error.response.status === 400 &&
          error.response.data?.message ===
            "Email already exists. Please use a different email."
        ) {
          setErrorMsg("Email already exists. Please use a different email.");
        } else {
          setErrorMsg("Failed to send OTP. Please try again.");
        }
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
      <div className="w-45 px-4 py-12 rounded-2xl bg-cnsc-white-color">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
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
          <p className="text-sm text-gray-500">Logging in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="  w-3/4  rounded-3xl relative overflow-hidden mx-auto">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cnsc-primary-color mx-auto mb-4"></div>
            <p className="text-cnsc-primary-color font-medium">
              {currentPhase === 1
                ? "Sending verification code..."
                : "Verifying code..."}
            </p>
          </div>
        </div>
      )}

      {/* Phase Indicator */}
      <div className="flex justify-center p-4">
        <div className="flex items-center space-x-4">
          <div
            className={`flex items-center space-x-2 ${
              currentPhase >= 1 ? "text-cnsc-primary-color" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                currentPhase >= 1
                  ? "bg-cnsc-primary-color text-white"
                  : "bg-gray-200"
              }`}
            >
              1
            </div>
            <span className="text-sm font-medium">Details</span>
          </div>
          <div
            className={`w-8 h-0.5 ${
              currentPhase >= 2 ? "bg-cnsc-primary-color" : "bg-gray-200"
            }`}
          ></div>
          <div
            className={`flex items-center space-x-2 ${
              currentPhase >= 2 ? "text-cnsc-primary-color" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                currentPhase >= 2
                  ? "bg-cnsc-primary-color text-white"
                  : "bg-gray-200"
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
          <h2 className="text-2xl font-bold text-cnsc-primary-color mb-6 text-center">
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
                  className="bg-white text-black w-full px-4 py-3 text-base rounded-xl border border-gray-300 focus:border-cnsc-primary-color focus:outline-none transition-colors"
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
                  className="bg-white text-black w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:border-cnsc-primary-color focus:outline-none transition-colors"
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                />
                {showPassword ? (
                  <EyeOff
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-cnsc-primary-color transition-colors w-5 h-5"
                  />
                ) : (
                  <Eye
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-cnsc-primary-color transition-colors w-5 h-5"
                  />
                )}
              </div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-white text-black w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:border-cnsc-primary-color focus:outline-none transition-colors"
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                />
                {showConfirmPassword ? (
                  <EyeOff
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-cnsc-primary-color transition-colors w-5 h-5"
                  />
                ) : (
                  <Eye
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-cnsc-primary-color transition-colors w-5 h-5"
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
              className="bg-cnsc-primary-color mt-6 text-white w-full py-3 text-lg rounded-xl hover:bg-cnsc-secondary-color hover:text-black transition-all duration-300 font-semibold disabled:opacity-50"
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
            <h2 className="text-2xl font-bold text-cnsc-primary-color mb-2">
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
                  className="bg-white text-black w-full px-4 py-3 text-center text-2xl font-mono rounded-xl border border-gray-300 focus:border-cnsc-primary-color focus:outline-none transition-colors tracking-widest"
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
                      className="text-cnsc-primary-color hover:text-cnsc-primary-color text-sm font-medium transition-colors disabled:opacity-50"
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
                className="flex-1 bg-cnsc-primary-color text-white py-3 text-lg rounded-xl hover:bg-cnsc-primary-color transition-all duration-300 font-semibold disabled:opacity-50"
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

const handleRegistration = async (email, password, code) => {
  console.log(email, password, code);
  try {
    const response = await axios.post(`${API_ROUTER}/confirmVerification`, {
      email,
      position: "student-leader",
      password,
      code,
    });

    // Proceed to registration form or next step
    console.log("OTP confirmed successfully:", response.data);
  } catch (err) {
    console.error("OTP confirmation failed", err.response?.data || err.message);
  }
};

const SendOtp = async ({ email }) => {
  console.log(email);
  try {
    const response = await axios.post(`${API_ROUTER}/sendVerification`, {
      email,
    });
    console.log("OTP sent response:", response.data);
    return response.data; // Return the response for success handling
  } catch (err) {
    console.error("OTP sending failed", err.response?.data || err.message);
    throw err; // Re-throw the error so it can be caught in the component
  }
};
