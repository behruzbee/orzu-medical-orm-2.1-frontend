import { client } from "@/shared/constants/client";
import { QueryClientProvider } from "@tanstack/react-query";

export const QueryProvider = ({ children }: React.PropsWithChildren) => {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
