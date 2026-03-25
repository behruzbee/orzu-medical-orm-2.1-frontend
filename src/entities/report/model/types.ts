export type ReportStatus = "ready" | "processing" | "error";

export interface IReport {
  id: string;
  name: string;       // Название файла
  fileUrl: string;    // Ссылка на скачивание
  startDate: string;  // ISO Date
  endDate: string;    // ISO Date
  status: ReportStatus;
  createdAt: string;  // ISO Date
}

export interface GenerateReportPayload {
  startDate: string;
  endDate: string;
}