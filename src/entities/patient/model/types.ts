export enum PatientStatus {
  NEW = "new", // Yangi / Новый
  CONTACTED = "contacted", // Bog'landi / Связались
  NO_ANSWER = "no_answer", // Ko'tarmadi / Не поднял
  UNREACHABLE = "unreachable", // O'chirilgan / Недоступен
  WRONG_NUMBER = "wrong_number", // Noto'g'ri raqam / Ошибка
  FEEDBACK_POSITIVE = "feedback_positive", // Ijobiy / Хороший отзыв
  FEEDBACK_NEGATIVE = "feedback_negative", // Shikoyat / Жалоба
}

export interface IDashboardStats {
  totalTasks: number;
  newTasks: number;
  callBackTasks: number;
  completedTasks: number;
}

export type EvidenceType = "text" | "audio" | "video" | "image" | "document";
export type EvidenceSource = "whatsapp" | "manual";

export interface IEvidenceMessage {
  id: string;
  type: EvidenceType;
  text?: string;
  mediaUrl?: string;
  duration?: string;
  source: EvidenceSource;
  sender: "operator" | "patient";
  originalTimestamp: string;
}

export interface IFeedback {
  id: string;
  ratings: Record<string, number>;
  comment?: string;
  operatorId: string;
  evidenceMessages: IEvidenceMessage[];
  createdAt: string;
}

export interface ICallStatusLog {
  id: string;
  status: PatientStatus;
  note?: string;
  operatorId: string;
  createdAt: string;
}

export interface IPatient {
  id: string;
  name: string;
  phone: string;
  branch: string;

  departureDate: string;
  arrivalDate: string;

  status: PatientStatus;
  avatarColor: string;

  callHistory?: ICallStatusLog[];
  feedbacks?: IFeedback[];

  createdAt: string;
  updatedAt: string;
}

export interface PatientsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: PatientStatus;
  branch?: string;
  phoneCode?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PatientsResponse {
  data: IPatient[];
  meta: PaginationMeta;
}
