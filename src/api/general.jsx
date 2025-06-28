import axios from "axios";
import { API_ROUTER } from "../App";

export const handleLogin = async (email, password, navigate, setErrorMsg) => {
  try {
    const response = await axios.post(
      `${API_ROUTER}/login`,
      { email, password },
      { withCredentials: true }
    );

    console.log(response.data);

    const role = response.data.user.position;
    if (role === "student_leader") {
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

export const handleRegistration = async (email, password, code) => {
  console.log(email, password, code);
  try {
    const response = await axios.post(`${API_ROUTER}/confirmVerification`, {
      email,
      position: "student_leader",
      password,
      code,
    });

    // Proceed to registration form or next step
    console.log("OTP confirmed successfully:", response.data);
  } catch (err) {
    console.error("OTP confirmation failed", err.response?.data || err.message);
  }
};

export const SendOtp = async ({ email }) => {
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

export const HandleLogout = async (navigate) => {
  const confirmLogout = window.confirm("Are you sure you want to log out?");
  if (!confirmLogout) return;

  try {
    // Call the backend logout endpoint
    await axios.post(`${API_ROUTER}/logout`, {}, { withCredentials: true });

    // Clean up local/session storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("position");
    sessionStorage.removeItem("userData");

    // Navigate to login/home page
    navigate("/");
  } catch (error) {
    console.error("Logout failed:", error);
    alert("Logout failed. Please try again.");
  }
};
