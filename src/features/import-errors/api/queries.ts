import { useQuery } from "@tanstack/react-query";
import { importErrorsApi, type ImportErrorsParams } from "./apis";

export const useImportErrorsQuery = (params: ImportErrorsParams) => {
  return useQuery({
    queryKey: ["import-errors", params],
    queryFn: () => importErrorsApi.getErrors(params),
    placeholderData: (previousData) => previousData,
  });
};