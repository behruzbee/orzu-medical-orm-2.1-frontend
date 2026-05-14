import { useState } from "react";
import { Stack, LoadingOverlay } from "@mantine/core";
import { FilterBar } from "@/features/filter-patients";
import { PatientTable } from "@/widgets/patient-table";
import { StatsBoard } from "@/widgets/stats-board/ui/stats-board";
import { useFilterStore } from "@/features/filter-patients/store/filter-store";
import type { PaginationState } from "@tanstack/react-table";

import type { RequestStatus } from "@/entities/patient";
import { useRequests, useRequestStats } from "@/entities/patient";

export const HomePage = () => {
  const {
    search,
    selectedCode,
    selectedBranches,
    dateRange,
    status,
    selectedCountries,
  } = useFilterStore();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const phoneFilter =
    selectedCountries.length > 0
      ? selectedCountries[0]
      : selectedCode || undefined;

  const dateFrom = dateRange[0]
    ? new Date(dateRange[0]).toISOString()
    : undefined;
  const dateTo = dateRange[1]
    ? new Date(dateRange[1]).toISOString()
    : undefined;

  const queryParams = {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: search || undefined,
    // 2. Используем RequestStatus
    status: status ? (status as RequestStatus) : undefined,
    branch: selectedBranches.length > 0 ? selectedBranches[0] : undefined,
    phoneCode: phoneFilter,
    dateFrom,
    dateTo,
  };

  // 3. Используем новые хуки для заявок
  const { data, isLoading, isPlaceholderData } = useRequests(queryParams);
  const { data: stats, isLoading: isStatsLoading } = useRequestStats();

  // 4. Теперь это список заявок (PatientRequest), а не просто пациентов
  const requests = data?.data || [];
  const totalCount = data?.meta?.total || 0;

  return (
    <Stack mb={40} w="100%" pos="relative">
      <LoadingOverlay
        visible={isLoading && !isPlaceholderData}
        zIndex={1000}
        overlayProps={{ blur: 2 }}
      />

      <FilterBar />

      <StatsBoard stats={stats} isLoading={isStatsLoading} />

      <PatientTable
        data={requests}
        total={totalCount}
        pagination={pagination}
        setPagination={setPagination}
        loading={isPlaceholderData}
      />
    </Stack>
  );
};
