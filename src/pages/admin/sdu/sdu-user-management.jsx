import axios from "axios";
import { useEffect, useState } from "react";
import { API_ROUTER } from "../../../App";

export function SduUserManagement() {
  const [user, setUser] = useState([]);
  const getAlluser = async () => {
    try {
      const res = await axios.get(`${API_ROUTER}/getallUser`);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAlluser();
  }, []);

  return <>weahahgag</>;
}
