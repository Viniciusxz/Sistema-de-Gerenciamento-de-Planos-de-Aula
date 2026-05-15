import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { LessonPlanDetails } from "./pages/LessonPlanDetails";
import { LessonPlanForm } from "./pages/LessonPlanForm";
import { LessonPlansList } from "./pages/LessonPlansList";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/planos" replace />} />
        <Route path="/planos" element={<LessonPlansList />} />
        <Route path="/planos/novo" element={<LessonPlanForm />} />
        <Route path="/planos/:id/editar" element={<LessonPlanForm />} />
        <Route path="/planos/:id" element={<LessonPlanDetails />} />
        <Route path="*" element={<Navigate to="/planos" replace />} />
      </Route>
    </Routes>
  );
}
