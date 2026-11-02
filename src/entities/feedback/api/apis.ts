import { api } from "@/shared/api/api";
import type {
  FeedbackAnalytics,
  FeedbackSubcategory,
  FeedbackType,
} from "../model/types";

export const feedbackApi = {
  getAnalytics: async (params?: {
    dateFrom?: string;
    dateTo?: string;
    branch?: string;
  }): Promise<FeedbackAnalytics> => {
    const response = await api.get<FeedbackAnalytics>("/feedbacks/analytics", {
      params,
    });
    return response.data;
  },

  downloadAnalytics: async (params: {
    dateFrom: string;
    dateTo: string;
    branch?: string;
  }): Promise<Blob> => {
    const response = await api.get<Blob>('/feedbacks/analytics/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  getSubcategories: async (
    type: FeedbackType,
    category: string,
  ): Promise<FeedbackSubcategory[]> => {
    const response = await api.get<FeedbackSubcategory[]>(
      "/feedbacks/subcategories",
      { params: { type, category } },
    );
    return response.data;
  },
};
