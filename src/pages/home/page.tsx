import { useState } from "react";
import { Stack, LoadingOverlay } from "@mantine/core";
import { FilterBar } from "@/features/filter-patients";
import { PatientTable } from "@/widgets/patient-table";
import { StatsBoard } from "@/widgets/stats-board/ui/stats-board";
import { useFilterStore } from "@/features/filter-patients/store/filter-store";
import type { PaginationState } from "@tanstack/react-table";
import type { PatientStatus } from "@/entities/patient";
import { usePatients, usePatientStats } from "@/entities/patient/api";

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

  const dateFrom = dateRange[0] ? new Date(dateRange[0]).toISOString() : undefined;
  const dateTo = dateRange[1] ? new Date(dateRange[1]).toISOString() : undefined;

  const queryParams = {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: search || undefined,
    status: status ? (status as PatientStatus) : undefined,
    branch: selectedBranches.length > 0 ? selectedBranches[0] : undefined,
    phoneCode: phoneFilter,
    dateFrom,
    dateTo,
  };

  const { data, isLoading, isPlaceholderData } = usePatients(queryParams);
  const { data: stats, isLoading: isStatsLoading } = usePatientStats();

  const patients = data?.data || [];
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
        data={patients}
        total={totalCount}
        pagination={pagination}
        setPagination={setPagination}
        loading={isPlaceholderData}
      />
    </Stack>
  );
};