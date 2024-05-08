import axios from "axios";

const API_URL = "http://127.0.0.1:5000"; // Change this if your backend is running on a different port

export const sendAnswers = async (answers) => {
  try {
    const response = await axios.post(`${API_URL}/generate-plan`, answers);
    return response.data;
  } catch (error) {
    throw error;
  }
};
