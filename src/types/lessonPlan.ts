export interface LessonPlan {
  id: string;
  tituloAula: string;
  objetivo: string;
  ementaResumo: string;
  dataPrevista: string;
  disciplina: string;
  conteudos?: string[];
  recursosApoio?: string[];
  tags?: string[];
  dataCadastro: string;
}

export interface CreateLessonPlanDTO {
  tituloAula: string;
  objetivo: string;
  ementaResumo: string;
  dataPrevista: string;
  disciplina: string;
  conteudos?: string[];
  recursosApoio?: string[];
  tags?: string[];
}

export type UpdateLessonPlanDTO = Partial<CreateLessonPlanDTO>;

export interface SmartAssistRequest {
  tituloAula: string;
  disciplina: string;
  ementaResumo: string;
}

export interface SmartAssistResponse {
  conteudosComplementares: string[];
  topicosRelacionados: string[];
  tagsRecomendadas: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LessonPlanQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  disciplina?: string;
  tag?: string;
  dataPrevista?: string;
  sortBy?: "tituloAula" | "dataCadastro";
  order?: "asc" | "desc";
}
