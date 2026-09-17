import api from "./api";

/**
 * Fetch personalized product recommendations for the authenticated buyer
 */
export async function getRecommendations() {
  const response = await api.get("/recommendations");
  return response.data;
}

