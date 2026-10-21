export type FeedbackType = "complaint" | "suggestion";

export interface FeedbackSubcategory {
  id: string;
  type: FeedbackType;
  category: string;
  name: string;
  isCustom: boolean;
}

export interface FeedbackAnalytics {
  branches: string[];
  selectedBranch: string | null;
  requests: {
    summary: {
      total: number;
      processed: number;
      answered: number;
      missed: number;
      complaints: number;
      suggestions: number;
    };
    daily: Array<{
      date: string;
      total: number;
      answered: number;
      missed: number;
    }>;
  };
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
