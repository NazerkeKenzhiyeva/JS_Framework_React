import { useEffect, useState } from "react";
import { getItemsList } from "../services/service.js";

function getErrorMessage(error) {
  return error instanceof Error ? error.message : "Something went wrong";
}

export default function useSneakerList(query) {
  // The hook keeps the API data and all request states in one place.
  const [result, setResult] = useState({
    items: [],
    models: [],
    page: 1,
    total: 0,
    totalPages: 1,
    status: "loading",
    error: "",
  });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    // Every effect run has its own active flag.
    let active = true;

    async function loadItems() {
      setResult((current) => ({ ...current, status: "loading", error: "" }));
      try {
        const response = await getItemsList(query);
        // Ignore the response if this effect was already cleaned up.
        if (!active) return;
        setResult({
          items: response.data,
          models: response.models,
          page: response.page,
          total: response.total,
          totalPages: response.totalPages,
          status: "success",
          error: "",
        });
      } catch (error) {
        if (!active) return;
        setResult((current) => ({
          ...current,
          status: "error",
          error: getErrorMessage(error),
        }));
      }
    }

    loadItems();
    return () => {
      // This prevents an old request from updating the page.
      active = false;
    };
  }, [query, reloadKey]);

  function reload() {
    // Changing reloadKey starts the effect again.
    setReloadKey((value) => value + 1);
  }

  return { ...result, reload };
}
