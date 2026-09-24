import { useState } from "react";
import {
  Alert,
  Badge,
  Box,
  Button,
  Group,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
  IconAlertTriangle,
  IconBulb,
  IconChartHistogram,
  IconMessageReport,
  IconRepeat,
  IconCalendar,
} from "@tabler/icons-react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import "dayjs/locale/uz-latn";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { feedbackApi } from "@/entities/feedback";
import { APP_PATHS } from "@/shared/constants/app-paths";
import { useNavigate } from "react-router-dom";
import { useTranslation, type TranslationKey } from "@/shared/i18n";
import classes from "./feedback-dashboard.module.scss";

const CATEGORY_KEYS: Record<string, TranslationKey> = {
  doctors: "category.doctors",
  nurses: "category.nurses",
  cleanliness: "category.cleanliness",
  food: "category.food",
  reception: "category.reception",
  clinic: "category.clinic",
  other: "category.other",
};

const PIE_COLORS = ["#fa5252", "#20c997"];

const getLastDaysRange = (days: number): [Date, Date] => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - (days - 1));
  return [start, end];
};

export const FeedbackDashboard = () => {
  const navigate = useNavigate();
  const { language, t } = useTranslation();
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>(
    getLastDaysRange(14),
  );
  const [appliedRange, setAppliedRange] = useState<[Date, Date]>(
    getLastDaysRange(14),
  );

  const dateFrom = dayjs(appliedRange[0]).format("YYYY-MM-DD");
  const dateTo = dayjs(appliedRange[1]).format("YYYY-MM-DD");

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["feedback-analytics", dateFrom, dateTo],
    queryFn: () => feedbackApi.getAnalytics({ dateFrom, dateTo }),
    refetchInterval: 10_000,
    refetchIntervalInBackground: true,
    staleTime: 5_000,
    placeholderData: keepPreviousData,
  });

  if (isLoading) {
    return (
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} height={112} radius="lg" />
        ))}
      </SimpleGrid>
    );
  }

  if (isError || !data) {
    return (
      <Alert color="red" icon={<IconAlertTriangle size={18} />}>
        {t("analytics.loadError")}
      </Alert>
    );
  }

  const metrics = [
    {
      label: t("analytics.total"),
      value: data.summary.total,
      hint: t("analytics.selectedPeriod", { count: data.period.days }),
      color: "#1971c2",
      icon: IconChartHistogram,
      type: null,
    },
    {
      label: t("analytics.complaints"),
      value: data.summary.complaints,
      hint: t("analytics.share", {
        value: data.summary.total
          ? Math.round((data.summary.complaints / data.summary.total) * 100)
          : 0,
      }),
      color: "#e03131",
      icon: IconMessageReport,
      type: "complaint" as const,
    },
    {
      label: t("analytics.suggestions"),
      value: data.summary.suggestions,
      hint: t("analytics.share", {
        value: data.summary.total
          ? Math.round((data.summary.suggestions / data.summary.total) * 100)
          : 0,
      }),
      color: "#099268",
      icon: IconBulb,
      type: "suggestion" as const,
    },
    {
      label: t("analytics.repeated"),
      value: data.summary.repeated,
      hint: t("analytics.repeatRate", { value: data.summary.repeatRate }),
      color: "#f08c00",
      icon: IconRepeat,
      type: null,
    },
  ];

  const typeSplit = [
    { name: t("analytics.complaints"), value: data.summary.complaints },
    { name: t("analytics.suggestions"), value: data.summary.suggestions },
  ];

  return (
    <Box className={classes.shell}>
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start">
          <Box>
            <Text size="xs" tt="uppercase" fw={800} c="teal.8" lts={1.2}>
              Orzu Medical • BI
            </Text>
            <Title order={2} mt={2}>
              {t("analytics.title")}
            </Title>
            <Text size="sm" c="dimmed">
              {t("analytics.subtitle", {
                from: dayjs(data.period.dateFrom).format("DD.MM.YYYY"),
                to: dayjs(data.period.dateTo).format("DD.MM.YYYY"),
              })}
            </Text>
          </Box>
          <Badge
            size="lg"
            variant="light"
            color="teal"
            leftSection={<span className={classes.liveDot} />}
          >
            {isFetching ? t("analytics.updating") : t("analytics.live")} · 10 s
          </Badge>
        </Group>

        <Paper p="md" radius="lg" className={classes.filterBar}>
          <Group justify="space-between" align="flex-end" wrap="wrap">
            <DatePickerInput
              type="range"
              label={t("analytics.period")}
              placeholder={t("analytics.periodPlaceholder")}
              leftSection={<IconCalendar size={17} />}
              value={dateRange}
              onChange={(value) => {
                const nextRange = value as [Date | null, Date | null];
                setDateRange(nextRange);
                if (nextRange[0] && nextRange[1]) {
                  setAppliedRange([nextRange[0], nextRange[1]]);
                }
              }}
              valueFormat="DD.MM.YYYY"
              locale={language === "ru" ? "ru" : "uz-latn"}
              maxDate={new Date()}
              w={{ base: "100%", sm: 310 }}
            />

            <Group gap="xs">
              {[7, 14, 30].map((days) => (
                <Button
                  key={days}
                  size="sm"
                  variant={data.period.days === days ? "filled" : "light"}
                  color="teal"
                  onClick={() => {
                    const range = getLastDaysRange(days);
                    setDateRange(range);
                    setAppliedRange(range);
                  }}
                >
                  {t("analytics.days", { count: days })}
                </Button>
              ))}
            </Group>
          </Group>
        </Paper>

        <SimpleGrid cols={{ base: 1, xs: 2, lg: 4 }} spacing="md">
          {metrics.map((metric) => (
            <Paper
              key={metric.label}
              p="md"
              radius="lg"
              className={`${classes.metric} ${metric.type ? classes.metricClickable : ""}`}
              style={{ "--metric-color": metric.color } as React.CSSProperties}
              role={metric.type ? "button" : undefined}
              tabIndex={metric.type ? 0 : undefined}
              aria-label={
                metric.type
                  ? t("analytics.openList", { name: metric.label })
                  : undefined
              }
              onClick={() => {
                if (!metric.type) return;
                const params = new URLSearchParams({
                  type: metric.type,
                  dateFrom: data.period.dateFrom,
                  dateTo: data.period.dateTo,
                });
                navigate(`${APP_PATHS.FEEDBACKS.FEEDBACKS_PATH}?${params}`);
              }}
              onKeyDown={(event) => {
                if (
                  metric.type &&
                  (event.key === "Enter" || event.key === " ")
                ) {
                  event.preventDefault();
                  event.currentTarget.click();
                }
              }}
            >
              <Group justify="space-between" align="flex-start" wrap="nowrap">
                <Stack gap={4}>
                  <Text size="sm" c="dimmed" fw={600}>
                    {metric.label}
                  </Text>
                  <Text size="32px" fw={800} className={classes.metricValue}>
                    {metric.value.toLocaleString("ru-RU")}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {metric.hint}
                  </Text>
                </Stack>
                <ThemeIcon
                  size={40}
                  radius="xl"
                  variant="light"
                  color={metric.color}
                >
                  <metric.icon size={21} />
                </ThemeIcon>
              </Group>
            </Paper>
          ))}
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="md">
          <Paper
            p="lg"
            radius="lg"
            className={`${classes.chartCard} ${classes.wideChart}`}
          >
            <Group justify="space-between" mb="md">
              <Box>
                <Text fw={700}>{t("analytics.dynamics")}</Text>
                <Text size="xs" c="dimmed">
                  {t("analytics.newByDay")}
                </Text>
              </Box>
            </Group>
            <Box h={270}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.daily} margin={{ left: -18, right: 8 }}>
                  <defs>
                    <linearGradient id="complaints" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fa5252" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#fa5252" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="suggestions"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#20c997" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#20c997" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="#e9ecef"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) =>
                      value.slice(5).split("-").reverse().join(".")
                    }
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="complaints"
                    name={t("analytics.complaints")}
                    stroke="#fa5252"
                    fill="url(#complaints)"
                    strokeWidth={2.5}
                    animationDuration={700}
                  />
                  <Area
                    type="monotone"
                    dataKey="suggestions"
                    name={t("analytics.suggestions")}
                    stroke="#20c997"
                    fill="url(#suggestions)"
                    strokeWidth={2.5}
                    animationDuration={700}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>

          <Paper p="lg" radius="lg" className={classes.chartCard}>
            <Text fw={700}>{t("analytics.typeRatio")}</Text>
            <Text size="xs" c="dimmed" mb="sm">
              {t("analytics.composition")}
            </Text>
            <Box h={270}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeSplit}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={62}
                    outerRadius={92}
                    paddingAngle={4}
                    animationDuration={700}
                  >
                    {typeSplit.map((item, index) => (
                      <Cell key={item.name} fill={PIE_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </SimpleGrid>

        <Paper p="lg" radius="lg" className={classes.chartCard}>
          <Group justify="space-between" mb="md">
            <Box>
              <Text fw={700}>{t("analytics.topReasons")}</Text>
              <Text size="xs" c="dimmed">
                {t("analytics.topReasonsHint")}
              </Text>
            </Box>
            <Badge variant="light" color="orange">
              {t("analytics.repeated")}: {data.summary.repeated}
            </Badge>
          </Group>
          <Box h={Math.max(220, data.subcategories.length * 38)}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.subcategories}
                layout="vertical"
                margin={{ left: 20, right: 18 }}
              >
                <CartesianGrid
                  strokeDasharray="4 4"
                  horizontal={false}
                  stroke="#e9ecef"
                />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={150}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) =>
                    value.length > 22 ? `${value.slice(0, 22)}…` : value
                  }
                />
                <Tooltip
                  formatter={(value, name) => [
                    value,
                    name === "count"
                      ? t("analytics.totalLegend")
                      : t("analytics.repeated"),
                  ]}
                />
                <Legend />
                <Bar
                  dataKey="count"
                  name={t("analytics.totalLegend")}
                  fill="#1971c2"
                  radius={[0, 6, 6, 0]}
                  animationDuration={700}
                />
                <Bar
                  dataKey="repeated"
                  name={t("analytics.repeated")}
                  fill="#f59f00"
                  radius={[0, 6, 6, 0]}
                  animationDuration={700}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
          {data.categories.length > 0 && (
            <Group gap="xs" mt="md">
              {data.categories.map((item) => (
                <Badge key={item.category} variant="dot" color="teal">
                  {CATEGORY_KEYS[item.category]
                    ? t(CATEGORY_KEYS[item.category])
                    : item.category}
                  : {item.count}
                </Badge>
              ))}
            </Group>
          )}
        </Paper>
      </Stack>
    </Box>
  );
};
