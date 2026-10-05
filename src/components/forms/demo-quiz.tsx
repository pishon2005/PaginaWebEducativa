"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock3 } from "lucide-react";

const questions = [
  { id: 1, prompt: "¿Qué tipo de dato devuelve la expresión `\"Hola\"` en Python?", options: ["str", "int", "bool"], answer: "str" },
  { id: 2, prompt: "¿Cuál es el resultado de `len([1, 2, 3])`?", options: ["2", "3", "4"], answer: "3" },
  { id: 3, prompt: "¿Qué palabra se usa para definir una función?", options: ["function", "def", "make"], answer: "def" },
];

export function DemoQuiz({ courseId }: { courseId: string }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const score = questions.reduce((total, question) => total + (answers[question.id] === question.answer ? 1 : 0), 0);

  function submitQuiz(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (Object.keys(answers).length !== questions.length) {
      setError("Responde todas las preguntas antes de enviar el intento.");
      return;
    }
    setError("");
    setSubmitted(true);
  }

  if (submitted) return <section className="border border-[#dfe7e0] bg-white p-6 text-center sm:p-9"><CheckCircle2 className="mx-auto size-9 text-[#5e8563]" aria-hidden="true" /><p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-[#64806a]">Intento demo completado</p><h1 className="mt-2 text-2xl font-semibold text-[#1e3c2c]">Resultado: {score}/{questions.length}</h1><p className="mt-2 text-sm text-[#738077]">Las respuestas se evaluaron localmente y no se guardaron.</p><Link href={`/alumno/mis-cursos/${courseId}/quizzes`} className="mt-6 inline-flex bg-[#173c2d] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#24543e]">Volver a evaluaciones</Link></section>;

  return (
    <form onSubmit={submitQuiz} className="space-y-4">
      <div className="flex items-center justify-between border border-[#dfe7e0] bg-white px-4 py-3"><div><p className="text-sm font-semibold text-[#304637]">Quiz · Fundamentos de Python</p><p className="mt-1 text-[10px] text-[#849087]">3 preguntas · 1 intento disponible</p></div><span className="flex items-center gap-1.5 text-xs font-semibold text-[#607764]"><Clock3 className="size-3.5" aria-hidden="true" /> 12 min</span></div>
      {questions.map((question, index) => <fieldset key={question.id} className="border border-[#dfe7e0] bg-white p-4 sm:p-5"><legend className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#78907b]">Pregunta {index + 1}</legend><p className="mt-2 text-sm font-semibold text-[#344a39]">{question.prompt}</p><div className="mt-4 grid gap-2 sm:grid-cols-3">{question.options.map((option) => <label key={option} className={`flex cursor-pointer items-center gap-2 border px-3 py-2.5 text-xs ${answers[question.id] === option ? "border-[#89a68d] bg-[#f2f7f2] text-[#3d6144]" : "border-[#e4eae4] text-[#66756b] hover:bg-[#fafcfa]"}`}><input type="radio" name={`question-${question.id}`} checked={answers[question.id] === option} onChange={() => setAnswers((current) => ({ ...current, [question.id]: option }))} className="accent-[#315d3d]" />{option}</label>)}</div></fieldset>)}
      {error && <p role="alert" className="text-xs font-medium text-[#a24135]">{error}</p>}
      <button type="submit" className="h-11 bg-[#173c2d] px-5 text-sm font-semibold text-white hover:bg-[#24543e]">Enviar intento</button>
      <p className="text-[10px] text-[#89958d]">El tiempo y los intentos son de muestra para esta interfaz.</p>
    </form>
  );
}