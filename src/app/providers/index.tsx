import { MantineProvider } from "./mantine";
import { QueryProvider } from "./query/provider";
import { RouterDomProvider } from "./router-dom";

export const Providers = () => {
  return (
    <MantineProvider>
      <QueryProvider>
        <RouterDomProvider />
      </QueryProvider>
    </MantineProvider>
  );
};
