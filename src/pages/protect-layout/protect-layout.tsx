import { Navbar } from "@/widgets/navbar";
import { Flex, Box, LoadingOverlay } from "@mantine/core";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useMe } from "@/features/auth/api/queries";
import { APP_PATHS } from "@/shared/constants/app-paths"; // Путь к логину

export const ProtectLayout = () => {
  const location = useLocation();

  const { data: user, isLoading, isError } = useMe();

  if (isLoading) {
    return (
      <Box h="100vh" w="100vw">
        <LoadingOverlay
          visible={true}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
          loaderProps={{ color: "teal", type: "bars" }}
        />
      </Box>
    );
  }

  if (isError || !user) {
    return (
      <Navigate
        to={APP_PATHS.AUTH.LOGIN_PATH}
        state={{ from: location }}
        replace
      />
    );
  }

  return (
    <Flex h="100vh" w="100vw" style={{ overflow: "hidden" }}>
      <Navbar />

      <Flex
        flex={1}
        direction="column"
        style={{ overflow: "hidden", position: "relative" }}
        bg="var(--mantine-color-gray-0)"
      >
        <Box
          h="100%"
          p="md"
          style={{ boxSizing: "border-box", overflowY: "auto" }}
        >
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};
