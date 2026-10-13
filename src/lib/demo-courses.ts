import { demoCoursesList, getCourseById } from "@/lib/demo-data";

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

function toDemoCourse(id: string): DemoCourse {
  const course = getCourseById(id);
  return {
    id: course.id,
    title: course.title,
    instructor: course.instructor,
    subject: course.subject,
    level: course.level,
    duration: course.duration,
    students: course.students,
    enrolled: course.enrolled,
    progress: course.progress,
  };
}

const demoCourses: Record<string, DemoCourse> = Object.fromEntries(
  demoCoursesList.map((course) => [course.id, toDemoCourse(course.id)]),
);

export function getDemoCourse(id: string): DemoCourse {
  return demoCourses[id] ?? toDemoCourse(id);
}

export { demoCoursesList };