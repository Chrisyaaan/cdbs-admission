const fetchInstance = async (url, options = {}) => {
  const accessToken = localStorage.getItem("sessionToken");

  // Base headers for all requests
  const headers = {
    "supabase-url": import.meta.env.VITE_SUPABASE_URL,
    "supabase-key": import.meta.env.VITE_SUPABASE_KEY,
  };

  // Set Content-Type to multipart/form-data if data is FormData
  console.log("LOG FROM FETCH INSTANCE")
  console.log(options.body)
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }


  // If access token is available, add it to the headers
  // if (accessToken) {
  //   headers["Authorization"] = `Bearer ${accessToken}`;
  // }

  // Merge the provided options with our default headers
  const fetchOptions = {
    ...options,
    headers: {
      ...headers,
      ...options.headers, // Allow overriding headers if needed
    },
  };

  try {
    const response = await fetch(url, fetchOptions);

    // Check if the response is ok (status code 200-299)
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorMessage}`);
    }

    // If response is JSON, parse and return it
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error; // Re-throw the error for the caller to handle
  }
};

export default fetchInstance