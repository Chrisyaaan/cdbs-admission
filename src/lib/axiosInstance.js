import axios from "axios"

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // withCredentials: true
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("sessionToken");
  // const accessToken = "35|Iq5FAkcqLexMWwukj2JHyYiA6WgVKAC4GR1GsSF745f1de13";
  const fullUrl = config.baseURL + config.url;

  // Debug logs
  // console.log("VITE_API_URL: ", import.meta.env.VITE_API_URL)
  // console.log("Base URL:", config.baseURL);
  // console.log("Requested URL Path:", config.url);
  // console.log("Full Request URL:", fullUrl);
  // console.log("SUPABASE KEY: ", import.meta.env.VITE_SUPABASE_KEY)
  // console.log("SUPABASE_URL: ", import.meta.env.VITE_SUPABASE_URL)


  config.headers = {
    ...config.headers,
    "Content-Type": "application/json",
    "supabase-url": import.meta.env.VITE_SUPABASE_URL,
    "supabase-key": import.meta.env.VITE_SUPABASE_KEY
  }

  // console.log("CONFIGURATION AXIOS: ", config)
  // console.log(" ACCESS TOKEN FROM AXIOS: ", accessToken)

  return config;
});


// Add a response interceptor (optional)
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Response Interceptor:", response);
    return response;
  },
  (error) => {
    console.error("Axios Error:", error.message);

    // If there's a response, log it
    if (error.response) {
      console.error("Response Data:", error.response.data);
      console.error("Response Status:", error.response.status);
    } else {
      console.error("Network or Request Error:", error.request);
    }

    return Promise.reject(error);
  }
);

