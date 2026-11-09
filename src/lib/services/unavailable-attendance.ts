import type {
  AsistenciaAlumnoSeccion,
  AsistenciaClaseProfesor,
  Asistencia,
  ClaseConAsistencia,
  ConfiguracionAsistencia,
  CursoBase,
  PreferenciaModalidad,
  Seccion,
  Semana,
} from "@/lib/asistencia/tipos";

export const unavailableCourses: CursoBase[] = [];
export const unavailableSections: Seccion[] = [];
export const unavailableWeeks: Semana[] = [];
export const unavailableClasses: ClaseConAsistencia[] = [];
export const unavailableAttendance: Asistencia[] = [];
export const unavailablePreferences: PreferenciaModalidad[] = [];
export const unavailableAttendanceConfiguration: Record<string, ConfiguracionAsistencia> = {};

export const getUnavailableCourse = (_id: string): CursoBase | undefined => undefined;
export const getUnavailableSectionsByCourse = (_id: string): Seccion[] => [];
export const getUnavailableSection = (_id: string): Seccion | undefined => undefined;
export const getUnavailableWeeksBySection = (_id: string): Semana[] => [];
export const getUnavailableClassesBySection = (_id: string): ClaseConAsistencia[] => [];
export const getUnavailableClassesByWeek = (_id: string): ClaseConAsistencia[] => [];
export const getUnavailableClass = (_id: string): ClaseConAsistencia | undefined => undefined;
export const getUnavailableAttendanceConfiguration = (_id: string): ConfiguracionAsistencia | undefined => undefined;
export const getUnavailablePreferences = (_studentId: string, _sectionId: string): PreferenciaModalidad[] => [];
export const getUnavailablePreference = (_studentId: string, _classId: string): PreferenciaModalidad | undefined => undefined;
export const getUnavailableAttendanceByClass = (_id: string): Asistencia[] => [];
export const getUnavailableAttendanceByStudent = (_studentId: string, _sectionId: string): Asistencia[] => [];
export const getUnavailableAttendance = (_studentId: string, _classId: string): Asistencia | undefined => undefined;
export const getUnavailableStudents = (_sectionId: string) => [];
export const getUnavailableTeacherAttendance = (_sectionId: string, _classId: string): AsistenciaClaseProfesor | undefined => undefined;
export const getUnavailableStudentAttendance = (_studentId: string, _sectionId: string): AsistenciaAlumnoSeccion | undefined => undefined;
