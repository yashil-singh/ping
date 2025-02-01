import axios, { AxiosError, AxiosHeaders } from "axios";
import { BASE_API_URL } from "./constans";

export interface ErrorResponse {
  message?: string;
  errors?: [string];
}

const api = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const handleError = (error: AxiosError<ErrorResponse>) => {
  if (error.response) {
    const status = error.response.status;
    const message =
      error.response?.data?.message || "An unknown error occurred.";
    console.log("🚀 ~ message:", message);

    const errors = error.response.data.errors || null;

    return { status, message, errors };
  } else if (error.request) {
    // The request was made but no response was received
    return { status: null, message: "No response from server" };
  } else {
    return { status: null, message: error.message };
  }
};

// Function to handle GET requests
// export const get = async <T>(
//   url: string,
//   params: Record<string, unknown> = {}
// ): Promise<T> => {
//   try {
//     const response = await api.get<T>(url, { params });
//     return response.data; // Return only the response data
//   } catch (error) {
//     console.error("API error:", error);

//     if (error instanceof AxiosError) {
//       const { message } = handleError(error);
//       throw new Error(message);
//     }

//     throw new Error("An unexpected error occurred.");
//   }
// };

export const get = async (url: string, params = {}) => {
  const response = await api.get(url, { params });
  return response.data;
};

export const post = async (url: string, data = {}, headers?: AxiosHeaders) => {
  const response = await api.post(url, data, { headers });
  return response.data;
};

export const patch = async (url: string, data = {}) => {
  const response = await api.patch(url, data);
  return response.data;
};
