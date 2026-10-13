/**
 * Fuente única de datos de demostración del frontend.
 * Todo es temporal: se reemplazará por datos reales cuando se conecte el backend.
 */

export interface DemoCourseInfo {
  id: string;
  slug: string;
  title: string;
  instructor: string;
  subject: string;
  category: string;
  level: string;
  duration: string;
  hours: number;
  classes: string;
  price: number;
  students: string;
  enrolled: number;
  progress: number;
  modality: string;
  icon: string;
  artwork: string;
  mark: string;
  description: string;
  published: boolean;
}

export const demoCoursesList: DemoCourseInfo[] = [
  {
    id: "1", slug: "curso-1", title: "Fundamentos de Python",
    instructor: "Ana María Campos", subject: "Programación", category: "PROGRAMACIÓN",
    level: "Inicial", duration: "24 horas", hours: 24, classes: "9 clases",
    price: 189, students: "1,240", enrolled: 54, progress: 65, modality: "Virtual",
    icon: "/img/python.png", artwork: "from-sky-950 via-blue-900 to-orange-600", mark: "PY",
    description: "Aprende a programar con proyectos guiados desde cero.",
    published: true,
  },
  {
    id: "2", slug: "curso-2", title: "Desarrollo web con React",
    instructor: "Ana María Campos", subject: "Tecnología", category: "DESARROLLO WEB",
    level: "Intermedio", duration: "32 horas", hours: 32, classes: "9 clases",
    price: 229, students: "860", enrolled: 42, progress: 30, modality: "Virtual",
    icon: "/img/procesador.png", artwork: "from-neutral-950 via-indigo-950 to-orange-700", mark: "RE",
    description: "Diseña interfaces y crea aplicaciones web modernas.",
    published: true,
  },
  {
    id: "3", slug: "curso-3", title: "Excel para negocios",
    instructor: "Mariana Torres", subject: "Productividad", category: "PRODUCTIVIDAD",
    level: "Inicial", duration: "18 horas", hours: 18, classes: "9 clases",
    price: 149, students: "740", enrolled: 38, progress: 42, modality: "Virtual",
    icon: "/img/icono_crecimiento.png", artwork: "from-neutral-950 via-emerald-950 to-yellow-600", mark: "XL",
    description: "Organiza datos, automatiza tareas y crea reportes claros.",
    published: true,
  },
  {
    id: "4", slug: "curso-4", title: "Introducción a ciencia de datos",
    instructor: "Mariana Torres", subject: "Tecnología", category: "CIENCIA DE DATOS",
    level: "Intermedio", duration: "36 horas", hours: 36, classes: "9 clases",
    price: 249, students: "520", enrolled: 0, progress: 0, modality: "Virtual",
    icon: "/img/icono_crecimiento.png", artwork: "from-slate-950 via-teal-950 to-yellow-600", mark: "DS",
    description: "Interpreta datos y presenta hallazgos accionables.",
    published: false,
  },
  {
    id: "5", slug: "curso-5", title: "Diseño de interfaces digitales",
    instructor: "Luis Herrera", subject: "Diseño", category: "DISEÑO DIGITAL",
    level: "Inicial", duration: "20 horas", hours: 20, classes: "9 clases",
    price: 179, students: "630", enrolled: 32, progress: 84, modality: "Virtual",
    icon: "/img/icono_laptop.png", artwork: "from-neutral-950 via-rose-950 to-orange-600", mark: "UX",
    description: "Construye experiencias accesibles y sistemas visuales.",
    published: true,
  },
  {
    id: "6", slug: "curso-6", title: "SQL y bases de datos",
    instructor: "Luis Herrera", subject: "Datos", category: "BASES DE DATOS",
    level: "Avanzado", duration: "42 horas", hours: 42, classes: "9 clases",
    price: 269, students: "390", enrolled: 25, progress: 0, modality: "Virtual",
    icon: "/img/procesador.png", artwork: "from-neutral-950 via-neutral-800 to-orange-600", mark: "SQL",
    description: "Consulta, modela y administra datos relacionales.",
    published: true,
  },
];

const byId = new Map(demoCoursesList.map((course) => [course.id, course]));
const bySlug = new Map(demoCoursesList.map((course) => [course.slug, course]));

const fallbackCourse: DemoCourseInfo = {
  id: "0", slug: "curso-0", title: "Curso de especialización",
  instructor: "Equipo docente", subject: "Aprendizaje", category: "GENERAL",
  level: "Inicial", duration: "24 horas", hours: 24, classes: "9 clases",
  price: 199, students: "320", enrolled: 0, progress: 0, modality: "Virtual",
  icon: "/img/logo.png", artwork: "from-neutral-950 via-neutral-800 to-orange-600", mark: "ED",
  description: "Aprende con lecciones prácticas, ejercicios guiados y acompañamiento docente.",
  published: false,
};

export function getCourseById(id: string): DemoCourseInfo {
  return byId.get(id) ?? bySlug.get(id) ?? { ...fallbackCourse, id, title: `Curso ${id}` };
}

export function getCourseBySlug(slug: string): DemoCourseInfo {
  return bySlug.get(slug) ?? { ...fallbackCourse, slug };
}

/* ---------- Usuarios ---------- */

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: "Alumno" | "Profesor" | "Admin" | "Superadmin";
  active: boolean;
}

export const demoUsers: DemoUser[] = [
  { id: "1", name: "Juan Pérez", email: "juan@email.com", role: "Alumno", active: true },
  { id: "2", name: "María López", email: "maria@email.com", role: "Alumno", active: true },
  { id: "3", name: "Ana María Campos", email: "profesor@edukatech.pe", role: "Profesor", active: true },
  { id: "4", name: "Valeria Rojas", email: "alumno@edukatech.pe", role: "Alumno", active: true },
  { id: "5", name: "Diego Salas", email: "diego@email.com", role: "Alumno", active: true },
  { id: "6", name: "Lucía Torres", email: "lucia@email.com", role: "Alumno", active: true },
  { id: "7", name: "Sofía Herrera", email: "admin@edukatech.pe", role: "Admin", active: true },
];

/* ---------- Tareas ---------- */

export interface DemoAssignment {
  id: number;
  courseId: string;
  title: string;
  type: string;
  deadline: string;
  deadlineISO: string;
  weight: number;
  durationMin: number;
  status: "pendiente" | "entregado";
  grade?: number;
  submissions: number;
}

export const demoAssignments: DemoAssignment[] = [
  { id: 1, courseId: "1", title: "Ejercicio 1 · Funciones y colecciones", type: "Práctica entregable", deadline: "07/10/2026", deadlineISO: "2026-10-07", weight: 20, durationMin: 45, status: "pendiente", submissions: 30 },
  { id: 2, courseId: "1", title: "Ejercicio 2 · Automatización", type: "Proyecto", deadline: "12/10/2026", deadlineISO: "2026-10-12", weight: 20, durationMin: 60, status: "entregado", grade: 18, submissions: 12 },
  { id: 3, courseId: "2", title: "Proyecto · Componentes reutilizables", type: "Proyecto", deadline: "15/10/2026", deadlineISO: "2026-10-15", weight: 25, durationMin: 90, status: "pendiente", submissions: 20 },
];

export function getAssignmentsByCourse(courseId: string): DemoAssignment[] {
  const list = demoAssignments.filter((assignment) => assignment.courseId === courseId);
  return list.length ? list : demoAssignments.filter((assignment) => assignment.courseId === "1");
}

/* ---------- Quizzes ---------- */

export interface DemoQuizInfo {
  id: number;
  courseId: string;
  title: string;
  status: "Publicado" | "Borrador";
  attempts: string;
  score: string;
  durationMin: number;
}

export const demoQuizzes: DemoQuizInfo[] = [
  { id: 1, courseId: "1", title: "Variables y tipos de datos", status: "Publicado", attempts: "38 de 54 alumnos", score: "Promedio 16.8/20", durationMin: 12 },
  { id: 2, courseId: "1", title: "Funciones y colecciones", status: "Borrador", attempts: "Aún no disponible", score: "12 min · 1 intento", durationMin: 12 },
  { id: 3, courseId: "2", title: "Componentes y estado", status: "Publicado", attempts: "30 de 42 alumnos", score: "Promedio 15.9/20", durationMin: 15 },
];

export function getQuizzesByCourse(courseId: string): DemoQuizInfo[] {
  const list = demoQuizzes.filter((quiz) => quiz.courseId === courseId);
  return list.length ? list : demoQuizzes.filter((quiz) => quiz.courseId === "1");
}

/* ---------- Pagos ---------- */

export interface DemoPayment {
  id: number;
  student: string;
  courseId: string;
  amount: number;
  status: "pendiente" | "aprobado" | "rechazado";
  method: "Yape" | "Plin";
}

export const demoPayments: DemoPayment[] = [
  { id: 1, student: "Juan Pérez", courseId: "1", amount: 189, status: "pendiente", method: "Yape" },
  { id: 2, student: "María López", courseId: "2", amount: 229, status: "aprobado", method: "Plin" },
  { id: 3, student: "Carlos Ruiz", courseId: "4", amount: 249, status: "rechazado", method: "Yape" },
  { id: 4, student: "Valeria Rojas", courseId: "3", amount: 149, status: "pendiente", method: "Yape" },
];

/* ---------- Eventos de calendario ---------- */

export interface DemoCalendarEvent {
  date: string;
  time: string;
  title: string;
  courseId: string;
  type: "tarea" | "clase" | "quiz";
}

export const demoCalendarEvents: DemoCalendarEvent[] = [
  { date: "2026-10-07", time: "18:00", title: "Entrega: funciones en Python", courseId: "1", type: "tarea" },
  { date: "2026-10-09", time: "10:00", title: "Nueva clase disponible", courseId: "5", type: "clase" },
  { date: "2026-10-12", time: "20:00", title: "Quiz: fórmulas y funciones", courseId: "3", type: "quiz" },
  { date: "2026-10-15", time: "18:00", title: "Sesión de preguntas", courseId: "1", type: "clase" },
  { date: "2026-10-21", time: "23:59", title: "Entrega: proyecto final", courseId: "5", type: "tarea" },
];
