import type { PropsWithChildren } from "react";
import { MantineProvider as MProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { mantineTheme } from "@/app/config/mantine-theme";
import { useTranslation } from "@/shared/i18n";
import "dayjs/locale/ru";
import "dayjs/locale/uz-latn";

export const MantineProvider = ({ children }: PropsWithChildren) => {
  const { language } = useTranslation();

  return (
    <MProvider theme={mantineTheme}>
      <DatesProvider
        settings={{
          locale: language === "ru" ? "ru" : "uz-latn",
          firstDayOfWeek: 1,
        }}
      >
        {children}
      </DatesProvider>
    </MProvider>
  );
};
