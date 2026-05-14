export enum RequestStatus {
  NEW = 'new',                         // Только поступил с сайта
  CONTACTED = 'contacted',             // Оператор связался
  ALL_OK = 'all_ok',                   // Все ОК, перезвон не требуется
  
  NO_ANSWER = 'no_answer',             // Не поднял трубку
  UNREACHABLE = 'unreachable',         // Вне зоны доступа / Отключен
  WRONG_NUMBER = 'wrong_number',       // Неверный номер
  HAS_NOT_WHATSAPP = 'has_not_whatsapp', // Нет мессенджера
  
  DUPLICATE = 'duplicate',             // Дубликат заявки
  HAS_NOT_PHONE_NUMBER = 'no_phone',   // Номер отсутствует
  OTHER_PROBLEM = 'other',             // Другое
  
  FEEDBACK_POSITIVE = 'feedback_pos',  // Положительный отзыв
  FEEDBACK_NEGATIVE = 'feedback_neg',  // Жалоба / Отрицательный отзыв
  FEEDBACK_NOT_RELATED = 'feedback_not_related', // Жалоба не относится к клинике
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
  originalTimestamp?: string;
}

// 2. Обновленный интерфейс обратной связи
export interface IFeedback {
  id: string;
  ratings: Record<string, number>;
  comment?: string;
  operatorId: string;
  requestId: string; // Заменено с patientId
  evidenceMessages: IEvidenceMessage[];
  createdAt: string;
}

// 3. Обновленный статус звонка (теперь 1 к 1 для заявки)
export interface ICallStatus {
  id: string;
  status: RequestStatus;
  note?: string;
  operatorId: string;
  requestId: string;
  createdAt: string;
}

// 4. Сущность Пациента (только личные данные)
export interface IPatient {
  id: string;
  name: string;
  phone: string;
  avatarColor: string;
  createdAt: string;
}

// 5. НОВАЯ Сущность Заявки (PatientRequest)
export interface IPatientRequest {
  id: string;
  status: RequestStatus;
  branch: string;
  departureDate: string;
  arrivalDate: string;
  
  patientId: string;
  patient: IPatient; // Вложенная сущность пациента
  
  callStatus?: ICallStatus; // Теперь объект, а не массив
  feedback?: IFeedback;     // Теперь объект, а не массив

  createdAt: string;
  updatedAt: string;
}

export interface RequestsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: RequestStatus;
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

// 6. Ответ API теперь возвращает заявки
export interface RequestsResponse {
  data: IPatientRequest[];
  meta: PaginationMeta;
}