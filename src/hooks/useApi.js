import { useState, useEffect, useCallback } from "react";
import apiClient from "../services/api";

export const useApi = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(url);
      setData(response.data);
    } catch (err) {
      setError("Failed to load content. Please check your network connection.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, retry: fetchData };
};
