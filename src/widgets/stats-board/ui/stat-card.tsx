import { Paper, Group, Text, ThemeIcon, Skeleton } from "@mantine/core";
import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: number;
  color: string;
  icon: ReactNode;
  loading?: boolean;
}

export const StatCard = ({ label, value, color, icon, loading }: StatCardProps) => {
  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between">
        <div>
          <Text c="dimmed" tt="uppercase" fw={700} size="xs">
            {label}
          </Text>
          {loading ? (
             <Skeleton height={28} mt="sm" width="50%" radius="xl" />
          ) : (
             <Text fw={700} size="xl" mt="sm">
                {value}
             </Text>
          )}
        </div>
        <ThemeIcon color={color} variant="light" size="xl" radius="md">
          {icon}
        </ThemeIcon>
      </Group>
    </Paper>
  );
};