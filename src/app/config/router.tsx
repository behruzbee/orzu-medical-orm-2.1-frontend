import { createBrowserRouter } from "react-router-dom";
import { APP_PATHS } from "@/shared/constants/app-paths";
import { HomePage } from "@/pages/home";
import { ProtectLayout } from "@/pages/protect-layout";
import { PatientProfilePage } from "@/pages/patient-profile";
import { BroadcastPage } from "@/pages/broadcast";
import { LoginPage } from "@/pages/auth";
import { NotFoundPage } from "@/pages/404/page";
import { DocsPage } from "@/pages/docs";
import { ImportPatientsPage } from "@/pages/import-patients";
import { FeedbacksPage } from "@/pages/feedbacks";

export const router = createBrowserRouter([
  {
    path: APP_PATHS.HOME.HOME_PATH,
    element: <ProtectLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: APP_PATHS.PATIENT_PROFILE.PROFILE_PATH,
        element: <PatientProfilePage />,
      },
      {
        path: APP_PATHS.BROADCAST.BROADCAST_PATH,
        element: <BroadcastPage />,
      },
      {
        path: APP_PATHS.DOCS.DOCS_PATH,
        element: <DocsPage />,
      },
      {
        path: APP_PATHS.IMPORT_PATIENTS.IMPORT_PATIENTS_PATH,
        element: <ImportPatientsPage />,
      },
      {
        path: APP_PATHS.FEEDBACKS.FEEDBACKS_PATH,
        element: <FeedbacksPage />,
      },
    ],
  },
  {
    path: APP_PATHS.AUTH.LOGIN_PATH,
    element: <LoginPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);