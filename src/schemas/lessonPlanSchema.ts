import { z } from "zod";

export const lessonPlanSchema = z.object({
  tituloAula: z
    .string()
    .trim()
    .min(3, "Título da aula deve ter no mínimo 3 caracteres."),
  objetivo: z.string().trim().min(5, "Objetivo deve ter no mínimo 5 caracteres."),
  ementaResumo: z
    .string()
    .trim()
    .min(10, "Ementa/Resumo deve ter no mínimo 10 caracteres."),
  dataPrevista: z
    .string()
    .trim()
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: "Data prevista deve ser uma data válida.",
    }),
  disciplina: z.string().trim().min(1, "Disciplina não pode estar vazia."),
  conteudos: z.string().optional(),
  recursosApoio: z.string().optional(),
  tags: z.string().optional(),
});

export type LessonPlanFormData = z.infer<typeof lessonPlanSchema>;
