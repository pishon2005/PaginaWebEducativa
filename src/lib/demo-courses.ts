export interface DemoCourse {
  id: string;
  title: string;
  instructor: string;
  subject: string;
  level: string;
  duration: string;
  students: string;
  enrolled: number;
  progress: number;
}

const demoCourses: Record<string, DemoCourse> = {
  "1": {
    id: "1",
    title: "Fundamentos de Python",
    instructor: "Ana María Campos",
    subject: "Programación",
    level: "Inicial",
    duration: "24 horas",
    students: "1,240",
    enrolled: 54,
    progress: 65,
  },
  python: {
    id: "python",
    title: "Fundamentos de Python",
    instructor: "Ana María Campos",
    subject: "Programación",
    level: "Inicial",
    duration: "24 horas",
    students: "1,240",
    enrolled: 54,
    progress: 65,
  },
  "2": {
    id: "2",
    title: "Desarrollo web con React",
    instructor: "Ana María Campos",
    subject: "Tecnología",
    level: "Intermedio",
    duration: "32 horas",
    students: "860",
    enrolled: 42,
    progress: 30,
  },
  "3": {
    id: "3",
    title: "Introducción a ciencia de datos",
    instructor: "Mariana Torres",
    subject: "Tecnología",
    level: "Intermedio",
    duration: "36 horas",
    students: "520",
    enrolled: 0,
    progress: 0,
  },
  excel: {
    id: "excel",
    title: "Excel para negocios",
    instructor: "Mariana Torres",
    subject: "Productividad",
    level: "Intermedio",
    duration: "18 horas",
    students: "640",
    enrolled: 38,
    progress: 42,
  },
  diseno: {
    id: "diseno",
    title: "Diseño de interfaces",
    instructor: "Luis Herrera",
    subject: "Diseño",
    level: "Inicial",
    duration: "20 horas",
    students: "520",
    enrolled: 32,
    progress: 84,
  },
};

export function getDemoCourse(id: string): DemoCourse {
  return (
    demoCourses[id] ?? {
      id,
      title: `Curso ${id}`,
      instructor: "Equipo docente",
      subject: "Aprendizaje",
      level: "En curso",
      duration: "Contenido del curso",
      students: "—",
      enrolled: 0,
      progress: 0,
    }
  );
}
