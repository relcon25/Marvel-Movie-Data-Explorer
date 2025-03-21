import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001/v1/api";

export const fetchCharactersWithMultipleActors = async () => {
    const response = await axios.get(`${API_BASE_URL}/charactersWithMultipleActors`);
    return response.data;
};
