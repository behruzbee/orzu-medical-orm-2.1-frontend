import {
  IconLogout,
  IconUsers,
  IconFileText,
  IconBrandWhatsapp,
  IconSwitchHorizontal,
  IconMail,
  IconDownload,
  IconAlertCircle // <-- Добавили иконку для ошибок
} from "@tabler/icons-react";
import { Code, Group, Image } from "@mantine/core";
import { useLocation, Link } from "react-router-dom";
import { APP_PATHS } from "@/shared/constants/app-paths";

import classes from "../styles/navbar.module.scss";

const data = [
  {
    link: APP_PATHS.HOME.HOME_PATH,
    label: "Bemorlar ro'yxati",
    icon: IconUsers,
  },
  {
    link: APP_PATHS.DOCS.DOCS_PATH,
    label: "Xujjatlar",
    icon: IconFileText,
  },
  {
    link: APP_PATHS.FEEDBACKS.FEEDBACKS_PATH,
    label: "Taklif va Shikoyatlar",
    icon: IconMail,
  },
  {
    link: APP_PATHS.BROADCAST.BROADCAST_PATH,
    label: "Xabarnoma jo'natish",
    icon: IconBrandWhatsapp,
  },
  {
    link: APP_PATHS.IMPORT_PATIENTS.IMPORT_PATIENTS_PATH,
    label: "Raqamlarni yuklash",
    icon: IconDownload,
  },
  // <-- Добавили ссылку на новую страницу ошибок
  {
    link: APP_PATHS.IMPORT_ERRORS.IMPORT_ERRORS_PATH, 
    label: "Import xatoliklari",
    icon: IconAlertCircle,
  }
];

export function Navbar() {
  const location = useLocation();

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

        {links}
      </div>

      <div className={classes.footer}>
        <Link to={APP_PATHS.AUTH.LOGIN_PATH} className={classes.link}>
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Hisobni almashtirish</span>
        </Link>

        <Link to={APP_PATHS.AUTH.LOGIN_PATH} className={classes.link}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Chiqish</span>
        </Link>
      </div>
    </nav>
  );
}