import axios from "axios";
import { API_ROUTER } from "../../App";

export const GetAccreditation = async ({ OrgId }) => {
  const response = await axios.post(
    `${API_ROUTER}/Accreditations/${OrgId}`,
    { email, password },
    { withCredentials: true }
  );

  return response.data;
};

export const PostInitialRegistrationForm = async (formData) => {
  try {
    const response = await axios.post(
      `${API_ROUTER}/initialRegistration`,
      formData,
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    console.error("Error submitting initial registration:", error);
    throw error;
  }
};
