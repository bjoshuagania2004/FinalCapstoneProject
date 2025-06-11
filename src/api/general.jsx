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
      navigate("/student_leader");
    } else if (role === "adviser") {
      navigate("/adviser");
    } else if (role === "dean") {
      navigate("/dean");
    } else if (role === "ossd coordinator" || role === "ossd") {
      navigate("/OSSDCoordinator");
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
    const response = await axios.post(`${API_ROUTER}/confirm-verification`, {
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
    const response = await axios.post(`${API_ROUTER}/send-verification`, {
      email,
    });

    // You probably shouldn't get token/user here during OTP step
    console.log("OTP sent response:", response.data);

    // Optional: Show a UI message to enter the OTP next
  } catch (err) {
    console.error("OTP sending failed", err.response?.data || err.message);
  }
};

export const HandleLogout = (navigate) => {
  console.log(navigate);
  const confirmLogout = window.confirm("Are you sure you want to log out?");
  if (confirmLogout) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("position");
    sessionStorage.removeItem("userData");

    navigate("/");
  }
};
