export interface PreviewResponse {
  sessionId: string;
  totalParsed: number;
  validCount: number;
  errorCount: number;
}

export interface PreviewRow {
  id: string;
  lineNumber: number;
  name: string;
  phone: string;
  branch: string;
  arrivalDate: string | null;
  departureDate: string | null;
  hasErrors: boolean;
  errorDetails: string[];
}

export interface PreviewStats {
  total: number;
  valid: number;
  errors: number;
  categories: {
    ACTIVE_REQUEST_EXISTS: number;
    DUPLICATE_FILE: number;
    INVALID_PHONE: number;
    MISSING_DATA: number;
    OTHER: number;
    INVALID_DATES: number;
  };
}

export interface PreviewDataResponse {
  stats: PreviewStats;
  rows: PreviewRow[];
}
