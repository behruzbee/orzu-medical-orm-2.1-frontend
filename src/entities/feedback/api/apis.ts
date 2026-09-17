import { api } from "@/shared/api/api";
import type {
  FeedbackAnalytics,
  FeedbackSubcategory,
  FeedbackType,
} from "../model/types";

export const feedbackApi = {
  getAnalytics: async (): Promise<FeedbackAnalytics> => {
    const response = await api.get<FeedbackAnalytics>("/feedbacks/analytics");
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
