import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Stack,
  Title,
  Tabs,
  Paper,
  LoadingOverlay,
  Text,
  Center,
  Group,
  Badge,
  Button,
} from "@mantine/core";
import { IconMessageReport, IconMessageStar } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";

import { RequestStatus } from "@/entities/patient/model/types";
import { PatientTable } from "@/widgets/patient-table";
import { requestsApi } from "@/entities/patient/api/apis";
import { useTranslation } from "@/shared/i18n";

export const FeedbacksPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedType = searchParams.get("type");
  const requestedStatus =
    requestedType === "suggestion"
      ? RequestStatus.FEEDBACK_POSITIVE
      : RequestStatus.FEEDBACK_NEGATIVE;
  const [activeTab, setActiveTab] = useState<RequestStatus>(requestedStatus);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    setActiveTab(requestedStatus);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  }, [requestedStatus]);

  const feedbackDateFrom = searchParams.get("dateFrom") || undefined;
  const feedbackDateTo = searchParams.get("dateTo") || undefined;

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "requests",
      "feedbacks",
      activeTab,
      pagination,
      feedbackDateFrom,
      feedbackDateTo,
    ],
    queryFn: () =>
      requestsApi.getAll({
        page: pagination.pageIndex + 1, // Прибавляем 1 для API
        limit: pagination.pageSize,
        status: activeTab,
        feedbackDateFrom,
        feedbackDateTo,
      }),
  });

  return (
    <Stack gap="md" pb="xl">
      <Group justify="space-between" align="center">
        <Title order={2}>{t("feedback.title")}</Title>
        {feedbackDateFrom && feedbackDateTo && (
          <Group gap="xs">
            <Badge size="lg" variant="light" color="teal">
              {t("feedback.period")}:{" "}
              {feedbackDateFrom.split("-").reverse().join(".")} —{" "}
              {feedbackDateTo.split("-").reverse().join(".")}
            </Badge>
            <Button
              size="compact-sm"
              variant="subtle"
              color="gray"
              onClick={() => {
                const nextParams = new URLSearchParams(searchParams);
                nextParams.delete("dateFrom");
                nextParams.delete("dateTo");
                setSearchParams(nextParams, { replace: true });
              }}
            >
              {t("feedback.allPeriod")}
            </Button>
          </Group>
        )}
      </Group>

      <Tabs
        value={activeTab}
        onChange={(val) => {
          const nextStatus = val as RequestStatus;
          setActiveTab(nextStatus);
          const nextParams = new URLSearchParams(searchParams);
          nextParams.set(
            "type",
            nextStatus === RequestStatus.FEEDBACK_POSITIVE
              ? "suggestion"
              : "complaint",
          );
          setSearchParams(nextParams, { replace: true });
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
            {t("feedback.complaints")}
          </Tabs.Tab>
          <Tabs.Tab
            value={RequestStatus.FEEDBACK_POSITIVE}
            leftSection={<IconMessageStar size={18} />}
            color="green"
          >
            {t("feedback.suggestions")}
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
                {t("feedback.loadError")}
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
                  <Text c="dimmed">{t("feedback.empty")}</Text>
                </Center>
              )}
            </>
          )}
        </Paper>
      </Tabs>
    </Stack>
  );
};
