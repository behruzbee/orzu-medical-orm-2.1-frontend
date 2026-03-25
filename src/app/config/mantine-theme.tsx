import { createTheme, DEFAULT_THEME, mergeMantineTheme } from "@mantine/core";

const themeOverrides = createTheme({
  colors: {
    brand: [
      "#ebf9eb",
      "#d5f0d5",
      "#a8e1a7",
      "#78d277",
      "#51c54f",
      "#38bc35",
      "#2ab827",
      "#1ea11d",
      "#178f17",
      "#0d7c0f",
    ],
  },
  primaryColor: "brand",
  primaryShade: 8,
});

export const mantineTheme = mergeMantineTheme(DEFAULT_THEME, themeOverrides);
