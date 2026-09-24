import { SimpleGrid } from "@mantine/core";
import {
  IconListDetails,
  IconUserPlus,
  IconPhoneCheck,
  IconCircleCheck,
} from "@tabler/icons-react";
import { StatCard } from "./stat-card";
import type { IDashboardStats } from "@/entities/patient/model/types";
import { useTranslation } from "@/shared/i18n";

interface Props {
  stats?: IDashboardStats;
  isLoading?: boolean;
}

export const StatsBoard = ({ stats, isLoading }: Props) => {
  const { tr } = useTranslation();
  const data = stats || {
    totalTasks: 0,
    newTasks: 0,
    callBackTasks: 0,
    completedTasks: 0,
  };

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
      {/* 1. Bugungi vazifalar (Все активные) */}
      <StatCard
        label={tr("Umumiy vazifalar", "Всего задач")}
        value={data.totalTasks}
        color="blue"
        icon={<IconListDetails size={24} />}
        loading={isLoading}
      />

      {/* 2. Yangi vazifalar (Пришли сегодня) */}
      <StatCard
        label={tr("Yangi bemorlar", "Новые пациенты")}
        value={data.newTasks}
        color="teal" // brand цвет
        icon={<IconUserPlus size={24} />}
        loading={isLoading}
      />

      {/* 3. Aloqaga chiqish (Сегодня связались) */}
      <StatCard
        label={tr("Aloqaga chiqildi", "Связались")}
        value={data.callBackTasks}
        color="orange"
        icon={<IconPhoneCheck size={24} />}
        loading={isLoading}
      />

      {/* 4. To'gatildi (Сегодня закрыты) */}
      <StatCard
        label={tr("Yakunlandi", "Завершено")}
        value={data.completedTasks}
        color="gray"
        icon={<IconCircleCheck size={24} />}
        loading={isLoading}
      />
    </SimpleGrid>
  );
};
