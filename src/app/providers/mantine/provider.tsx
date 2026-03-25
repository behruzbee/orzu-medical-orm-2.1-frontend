import type { PropsWithChildren } from "react";
import { MantineProvider as MProvider } from "@mantine/core";
import { mantineTheme } from "@/app/config/mantine-theme";

export const MantineProvider = ({ children }: PropsWithChildren) => {
  return <MProvider theme={mantineTheme}>{children}</MProvider>;
};
