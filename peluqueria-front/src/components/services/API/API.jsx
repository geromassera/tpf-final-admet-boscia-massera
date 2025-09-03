const BASE_URL = import.meta.env.VITE_API_URL;

export async function fetchApi(
  endpoint,
  method = "GET",
  data = null,
  headers = {},
  callback = null
) {
  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error en la solicitud");
    }
    return await response.json();
  } catch (error) {
    console.error("fetchApi error:", error);
    throw error;
  } finally {
    if (callback !== null) callback();
  }
}
