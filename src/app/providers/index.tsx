import { Notifications } from "@mantine/notifications";
import { MantineProvider } from "./mantine";
import { QueryProvider } from "./query/provider";
import { RouterDomProvider } from "./router-dom";
import { LanguageProvider } from "@/shared/i18n";

export const Providers = () => {
  return (
    <LanguageProvider>
      <MantineProvider>
        <QueryProvider>
          <Notifications position="top-right" zIndex={1000} />
          <RouterDomProvider />
        </QueryProvider>
      </MantineProvider>
    </LanguageProvider>
  );
};
