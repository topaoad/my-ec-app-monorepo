"use client";

import { createTheme, MantineProvider } from "@mantine/core";
import { ReactNode } from "react";

// const theme = createTheme({
//   /** Put your mantine theme override here */
// });

// theme = { theme }

const MantineProviderWrapper = ({ children }: { children: ReactNode }) => {
  return <MantineProvider>{children}</MantineProvider>;
};

export default MantineProviderWrapper;
