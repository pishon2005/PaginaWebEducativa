export interface UnavailableCourseInfo {
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
  modalidadCurso: "nivelacion" | "taller" | "libre" | "aplicativo";
  icon: string;
  artwork: string;
  mark: string;
  description: string;
  published: boolean;
}

export interface UnavailableAssignment {
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

export interface UnavailableQuiz {
  id: number;
  courseId: string;
  title: string;
  status: "Publicado" | "Borrador";
  attempts: string;
  score: string;
  durationMin: number;
}

export interface UnavailablePayment {
  id: number;
  student: string;
  courseId: string;
  amount: number;
  status: "pendiente" | "aprobado" | "rechazado";
  method: "Yape" | "Plin";
}

export interface UnavailableCalendarEvent {
  date: string;
  time: string;
  title: string;
  courseId: string;
  type: "tarea" | "clase" | "quiz";
}

export const unavailableCourses: UnavailableCourseInfo[] = [];
export const unavailableAssignments: UnavailableAssignment[] = [];
export const unavailableQuizzes: UnavailableQuiz[] = [];
export const unavailablePayments: UnavailablePayment[] = [];
export const unavailableCalendarEvents: UnavailableCalendarEvent[] = [];

export function getUnavailableCourse(id: string): UnavailableCourseInfo {
  return {
    id,
    slug: id,
    title: "Curso no disponible",
    instructor: "",
    subject: "",
    category: "",
    level: "",
    duration: "",
    hours: 0,
    classes: "",
    price: 0,
    students: "0",
    enrolled: 0,
    progress: 0,
    modality: "",
    modalidadCurso: "libre",
    icon: "/img/logo.webp",
    artwork: "from-neutral-950 via-neutral-800 to-orange-600",
    mark: "ED",
    description: "La información estará disponible cuando se conecte el servicio.",
    published: false,
  };
}

export const getUnavailableCourseBySlug = getUnavailableCourse;
export const getUnavailableAssignments = (_courseId: string) => unavailableAssignments;
export const getUnavailableQuizzes = (_courseId: string) => unavailableQuizzes;
