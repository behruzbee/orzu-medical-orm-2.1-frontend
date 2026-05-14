import { Notifications } from "@mantine/notifications";
import { MantineProvider } from "./mantine";
import { QueryProvider } from "./query/provider";
import { RouterDomProvider } from "./router-dom";

export const Providers = () => {
  return (
    <MantineProvider>
      <QueryProvider>
        <Notifications position="top-right" zIndex={1000} />
        <RouterDomProvider />
      </QueryProvider>
    </MantineProvider>
  );
};
