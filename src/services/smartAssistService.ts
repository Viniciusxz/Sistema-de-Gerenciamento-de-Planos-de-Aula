import { api } from "./api";
import { getLocalSmartAssistRecommendations } from "./localLessonPlansStore";
import type {
  SmartAssistRequest,
  SmartAssistResponse,
} from "../types/lessonPlan";

const useLocalFallback = import.meta.env.VITE_USE_LOCAL_FALLBACK === "true";

export const smartAssistService = {
  async getRecommendations(payload: SmartAssistRequest) {
    if (useLocalFallback) {
      await new Promise((resolve) => window.setTimeout(resolve, 600));
      return getLocalSmartAssistRecommendations(payload);
    }

    const response = await api.post<SmartAssistResponse>(
      "/smart-assist/recommendations",
      payload,
    );

    return response.data;
  },
};
