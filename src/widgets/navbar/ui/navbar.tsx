import {
  IconLogout,
  IconUsers,
  IconFileText,
  IconBrandWhatsapp,
  IconSwitchHorizontal,
  IconMail,
  IconDownload,
  IconAlertCircle, // <-- Добавили иконку для ошибок
  IconChartBar,
} from "@tabler/icons-react";
import { Code, Group, Image, SegmentedControl, Text } from "@mantine/core";
import { useLocation, Link } from "react-router-dom";
import { APP_PATHS } from "@/shared/constants/app-paths";
import { useTranslation, type Language } from "@/shared/i18n";

import classes from "../styles/navbar.module.scss";

export function Navbar() {
  const location = useLocation();
  const { language, setLanguage, t } = useTranslation();

  const data = [
    {
      link: APP_PATHS.HOME.HOME_PATH,
      label: t("nav.patients"),
      icon: IconUsers,
    },
    {
      link: APP_PATHS.DOCS.DOCS_PATH,
      label: t("nav.documents"),
      icon: IconFileText,
    },
    {
      link: APP_PATHS.FEEDBACKS.FEEDBACKS_PATH,
      label: t("nav.feedback"),
      icon: IconMail,
    },
    {
      link: APP_PATHS.ANALYTICS.ANALYTICS_PATH,
      label: t("nav.analytics"),
      icon: IconChartBar,
    },
    {
      link: APP_PATHS.BROADCAST.BROADCAST_PATH,
      label: t("nav.broadcast"),
      icon: IconBrandWhatsapp,
    },
    {
      link: APP_PATHS.IMPORT_PATIENTS.IMPORT_PATIENTS_PATH,
      label: t("nav.import"),
      icon: IconDownload,
    },
    {
      link: APP_PATHS.IMPORT_ERRORS.IMPORT_ERRORS_PATH,
      label: t("nav.importErrors"),
      icon: IconAlertCircle,
    },
  ];

  const links = data.map((item) => (
    <Link
      className={classes.link}
      data-active={location.pathname === item.link || undefined}
      to={item.link}
      key={item.label}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between" wrap="nowrap">
          <Image
            src="https://orzumed.uz/wp-content/uploads/2024/07/orzu-med-logo-svg.svg"
            alt="Orzu Medical Logo"
            className={classes.logo}
          />
          <Code fw={700}>v2.0</Code>
        </Group>

        <Group justify="space-between" mb="sm" px="xs" gap="xs">
          <Text size="xs" c="dimmed" fw={600}>
            {t("language.label")}
          </Text>
          <SegmentedControl
            size="xs"
            value={language}
            onChange={(value) => setLanguage(value as Language)}
            data={[
              { value: "uz", label: "UZ" },
              { value: "ru", label: "RU" },
            ]}
          />
        </Group>

        {links}
      </div>

      <div className={classes.footer}>
        <Link to={APP_PATHS.AUTH.LOGIN_PATH} className={classes.link}>
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>{t("nav.switchAccount")}</span>
        </Link>

        <Link to={APP_PATHS.AUTH.LOGIN_PATH} className={classes.link}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>{t("nav.logout")}</span>
        </Link>
      </div>
    </nav>
  );
}
