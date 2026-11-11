import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createItem, deleteItem, getItem, getItemsList, updateItem } from "../services/service.js";

const sneakerKeys = {
  all: ["sneakers"],
  list: (query) => ["sneakers", "list", query],
  detail: (id) => ["sneakers", "detail", String(id)],
};

export function useSneakerListQuery(query) {
  return useQuery({
    queryKey: sneakerKeys.list(query),
    queryFn: ({ signal }) => getItemsList(query, signal),
    staleTime: 60_000,
  });
}

export function useSneakerQuery(id) {
  return useQuery({
    queryKey: sneakerKeys.detail(id),
    queryFn: ({ signal }) => getItem(id, signal),
    enabled: Boolean(id),
    retry: false,
    staleTime: 60_000,
  });
}

function useInvalidatingMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sneakerKeys.all }),
  });
}

export function useCreateSneaker() {
  return useInvalidatingMutation(createItem);
}

export function useUpdateSneaker() {
  return useInvalidatingMutation(({ id, changes }) => updateItem(id, changes));
}

export function useDeleteSneaker() {
  return useInvalidatingMutation(deleteItem);
}
