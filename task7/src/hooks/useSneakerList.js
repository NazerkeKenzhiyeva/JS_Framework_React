import { useSneakerListQuery } from "./useSneakerData.js";

function getErrorMessage(error) {
  return error instanceof Error ? error.message : "Something went wrong";
}

export default function useSneakerList(query) {
  const request = useSneakerListQuery(query);
  const response = request.data;

  return {
    items: response?.data || [],
    models: response?.models || [],
    page: response?.page || 1,
    total: response?.total || 0,
    totalPages: response?.totalPages || 1,
    status: request.isPending ? "loading" : request.isError ? "error" : "success",
    error: request.isError ? getErrorMessage(request.error) : "",
    reload: request.refetch,
  };
}
