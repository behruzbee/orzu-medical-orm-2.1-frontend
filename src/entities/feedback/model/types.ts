export type FeedbackType = "complaint" | "suggestion";

export interface FeedbackSubcategory {
  id: string;
  type: FeedbackType;
  category: string;
  name: string;
  isCustom: boolean;
}

export interface FeedbackAnalytics {
  summary: {
    total: number;
    complaints: number;
    suggestions: number;
    repeated: number;
    today: number;
    repeatRate: number;
  };
  daily: Array<{
    date: string;
    complaints: number;
    suggestions: number;
  }>;
  categories: Array<{
    category: string;
    count: number;
    repeated: number;
  }>;
  subcategories: Array<{
    name: string;
    category: string;
    count: number;
    repeated: number;
  }>;
  period: {
    dateFrom: string;
    dateTo: string;
    days: number;
  };
  generatedAt: string;
}
