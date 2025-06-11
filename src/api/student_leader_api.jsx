import axios from "axios";
import { API_ROUTER } from "../App";

export const GetorganizationInfoAll = async (orgId) => {
  try {
    const response = await axios.get(
      `${API_ROUTER}/get-organization/${orgId}`,
      { withCredentials: true }
    );

    return response.data;
  } catch (err) {
    console.error("Login failed", err.response?.data || err.message);
    const msg =
      err.response?.data?.message || "Login failed. Please try again.";
    setErrorMsg(msg);
  }
};

export const GetUser = async (userId) => {
  try {
    const response = await axios.get(`${API_ROUTER}/user-info/${userId}`, {
      withCredentials: true,
    });

    const userData = response.data.user;
    return userData;
  } catch (err) {
    console.error("OTP confirmation failed", err.response?.data || err.message);
  }
};
