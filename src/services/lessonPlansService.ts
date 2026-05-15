import { api } from "./api";
import { localLessonPlansStore } from "./localLessonPlansStore";
import type {
  CreateLessonPlanDTO,
  LessonPlan,
  LessonPlanQueryParams,
  PaginatedResponse,
  UpdateLessonPlanDTO,
} from "../types/lessonPlan";

const useLocalFallback = import.meta.env.VITE_USE_LOCAL_FALLBACK === "true";

type RawPaginatedResponse<T> = {
  data?: T[];
  items?: T[];
  rows?: T[];
  total?: number;
  count?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
};

function normalizePaginatedResponse<T>(
  payload: RawPaginatedResponse<T> | T[],
  params: LessonPlanQueryParams,
): PaginatedResponse<T> {
  if (Array.isArray(payload)) {
    return {
      data: payload,
      total: payload.length,
      page: params.page ?? 1,
      limit: params.limit ?? payload.length,
      totalPages: 1,
    };
  }

  const data = payload.data ?? payload.items ?? payload.rows ?? [];
  const total = payload.total ?? payload.count ?? data.length;
  const page = payload.page ?? params.page ?? 1;
  const limit = payload.limit ?? params.limit ?? 10;
  const totalPages = payload.totalPages ?? Math.max(1, Math.ceil(total / limit));

  return { data, total, page, limit, totalPages };
}

export const lessonPlansService = {
  async list(params: LessonPlanQueryParams) {
    if (useLocalFallback) {
      return localLessonPlansStore.list(params);
    }

    const response = await api.get<RawPaginatedResponse<LessonPlan> | LessonPlan[]>(
      "/lesson-plans",
      { params },
    );

    return normalizePaginatedResponse(response.data, params);
  },

  async getById(id: string) {
    if (useLocalFallback) {
      return localLessonPlansStore.getById(id);
    }

    const response = await api.get<LessonPlan>(`/lesson-plans/${id}`);
    return response.data;
  },

  async create(data: CreateLessonPlanDTO) {
    if (useLocalFallback) {
      return localLessonPlansStore.create(data);
    }

    const response = await api.post<LessonPlan>("/lesson-plans", data);
    return response.data;
  },

  async update(id: string, data: UpdateLessonPlanDTO) {
    if (useLocalFallback) {
      return localLessonPlansStore.update(id, data);
    }

    const response = await api.put<LessonPlan>(`/lesson-plans/${id}`, data);
    return response.data;
  },

  async remove(id: string) {
    if (useLocalFallback) {
      localLessonPlansStore.remove(id);
      return;
    }

    await api.delete(`/lesson-plans/${id}`);
  },
};
