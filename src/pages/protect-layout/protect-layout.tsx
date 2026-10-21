import { Navbar } from "@/widgets/navbar";
import { useEffect, useState } from "react";
import { Flex, Box, Burger, Drawer, Group, LoadingOverlay, Text } from "@mantine/core";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useMe } from "@/features/auth/api/queries";
import { APP_PATHS } from "@/shared/constants/app-paths"; // Путь к логину
import { DoctorMessageAlert } from "@/widgets/doctor-message-alert";

export const ProtectLayout = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

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
    <Flex
      h="100vh"
      w="100vw"
      direction={{ base: "column", sm: "row" }}
      style={{ overflow: "hidden" }}
    >
      <Box visibleFrom="sm">
        <Navbar />
      </Box>
      <Group hiddenFrom="sm" h={56} px="md" gap="sm" style={{ flexShrink: 0 }}>
        <Burger
          opened={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Открыть меню"
          size="sm"
        />
        <Text fw={700}>Orzu Medical</Text>
      </Group>
      <Drawer
        opened={menuOpen}
        onClose={() => setMenuOpen(false)}
        title="Orzu Medical"
        size={300}
        padding={0}
        hiddenFrom="sm"
      >
        <Navbar />
      </Drawer>
      <DoctorMessageAlert user={user} />

      <Flex
        flex={1}
        direction="column"
        style={{ overflow: "hidden", position: "relative", minWidth: 0 }}
        bg="var(--mantine-color-gray-0)"
      >
        <Box
          h="100%"
          p={{ base: "xs", sm: "md" }}
          style={{ boxSizing: "border-box", overflowY: "auto" }}
        >
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};
