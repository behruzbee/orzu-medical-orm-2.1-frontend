import { useState } from "react";
import {
  Stack,
  Title,
  Tabs,
  Paper,
  LoadingOverlay,
  Text,
  Center,
} from "@mantine/core";
import { IconMessageReport, IconMessageStar } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";

import { RequestStatus } from "@/entities/patient/model/types";
import { PatientTable } from "@/widgets/patient-table";
import { requestsApi } from "@/entities/patient/api/apis";

export const FeedbacksPage = () => {
  const [activeTab, setActiveTab] = useState<RequestStatus>(
    RequestStatus.FEEDBACK_NEGATIVE,
  );

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["requests", "feedbacks", activeTab, pagination],
    queryFn: () =>
      requestsApi.getAll({
        page: pagination.pageIndex + 1, // Прибавляем 1 для API
        limit: pagination.pageSize,
        status: activeTab,
      }),
  });

  return (
    <Stack h="100%" gap="md">
      <Title order={2}>Shikoyat va Takliflar</Title>

      <Tabs
        value={activeTab}
        onChange={(val) => {
          setActiveTab(val as RequestStatus);
          // Сбрасываем пагинацию на первую страницу при смене вкладки
          setPagination({ pageIndex: 0, pageSize: 10 });
        }}
      >
        <Tabs.List mb="md">
          <Tabs.Tab
            value={RequestStatus.FEEDBACK_NEGATIVE}
            leftSection={<IconMessageReport size={18} />}
            color="red"
          >
            Shikoyatlar
          </Tabs.Tab>
          <Tabs.Tab
            value={RequestStatus.FEEDBACK_POSITIVE}
            leftSection={<IconMessageStar size={18} />}
            color="green"
          >
            Takliflar
          </Tabs.Tab>
        </Tabs.List>

        <Paper
          withBorder
          p="md"
          radius="md"
          style={{ position: "relative", minHeight: "400px", flex: 1 }}
        >
          <LoadingOverlay
            visible={isLoading}
            zIndex={1000}
            overlayProps={{ blur: 2 }}
          />

          {isError ? (
            <Center h={300}>
              <Text c="red" fw={500}>
                Ma'lumotlarni yuklashda xatolik yuz berdi.
              </Text>
            </Center>
          ) : (
            <>
              {data?.data && data.data.length > 0 ? (
                <PatientTable
                  pagination={pagination}
                  setPagination={setPagination}
                  total={data.meta.total}
                  data={data.data}
                />
              ) : (
                <Center h={300}>
                  <Text c="dimmed">Ushbu bo'limda hozircha ma'lumot yo'q</Text>
                </Center>
              )}
            </>
          )}
        </Paper>
      </Tabs>
    </Stack>
  );
};
