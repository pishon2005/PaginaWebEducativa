export interface DemoLesson {
  title: string;
  duration: number;
  hasVideo: boolean;
  material: string;
}

export interface DemoModule {
  title: string;
  lessons: DemoLesson[];
}

const pythonModules: DemoModule[] = [
  {
    title: "Primeros pasos",
    lessons: [
      { title: "Bienvenida y entorno de trabajo", duration: 10, hasVideo: true, material: "Guía de inicio · PDF" },
      { title: "Variables y tipos de datos", duration: 18, hasVideo: true, material: "Ejercicios prácticos · PDF" },
      { title: "Tu primer programa", duration: 22, hasVideo: true, material: "Código de ejemplo · ZIP" },
    ],
  },
  {
    title: "Decisiones y repetición",
    lessons: [
      { title: "Condicionales en la práctica", duration: 16, hasVideo: true, material: "Guía de condicionales · PDF" },
      { title: "Bucles y colecciones", duration: 20, hasVideo: true, material: "Ejercicios del módulo · PDF" },
      { title: "Reto: automatiza una tarea", duration: 25, hasVideo: true, material: "Instrucciones del reto · PDF" },
    ],
  },
  {
    title: "Funciones y proyecto",
    lessons: [
      { title: "Funciones reutilizables", duration: 18, hasVideo: true, material: "Ejemplos de funciones · PDF" },
      { title: "Organización del código", duration: 20, hasVideo: true, material: "Plantilla del proyecto · ZIP" },
      { title: "Proyecto final guiado", duration: 30, hasVideo: true, material: "Rúbrica del proyecto · PDF" },
    ],
  },
];

const reactModules: DemoModule[] = [
  {
    title: "Componentes y entorno",
    lessons: [
      { title: "Bienvenida y herramientas", duration: 12, hasVideo: true, material: "Guía de instalación · PDF" },
      { title: "Componentes y propiedades", duration: 24, hasVideo: true, material: "Ejemplos de componentes · ZIP" },
      { title: "Composición de interfaces", duration: 20, hasVideo: true, material: "Código de ejemplo · ZIP" },
    ],
  },
  {
    title: "Estado e interacción",
    lessons: [
      { title: "Estado y eventos", duration: 22, hasVideo: true, material: "Práctica de estado · PDF" },
      { title: "Formularios y validación", duration: 26, hasVideo: true, material: "Plantilla de formulario · ZIP" },
      { title: "Consumo de información", duration: 28, hasVideo: true, material: "Recursos de práctica · PDF" },
    ],
  },
  {
    title: "Aplicación final",
    lessons: [
      { title: "Estructura de una aplicación", duration: 18, hasVideo: true, material: "Arquitectura inicial · PDF" },
      { title: "Accesibilidad y calidad", duration: 24, hasVideo: true, material: "Lista de verificación · PDF" },
      { title: "Proyecto de cierre", duration: 35, hasVideo: true, material: "Rúbrica del proyecto · PDF" },
    ],
  },
];

const excelModules: DemoModule[] = [
  {
    title: "Fundamentos de hojas de cálculo",
    lessons: [
      { title: "Entorno y organización de datos", duration: 12, hasVideo: true, material: "Libro de práctica · XLSX" },
      { title: "Fórmulas esenciales", duration: 20, hasVideo: true, material: "Guía de fórmulas · PDF" },
      { title: "Formato y claridad", duration: 16, hasVideo: true, material: "Plantilla de trabajo · XLSX" },
    ],
  },
  {
    title: "Análisis y reportes",
    lessons: [
      { title: "Filtros y tablas dinámicas", duration: 22, hasVideo: true, material: "Datos de práctica · XLSX" },
      { title: "Funciones para decisiones", duration: 24, hasVideo: true, material: "Referencia de funciones · PDF" },
      { title: "Construcción de un reporte", duration: 28, hasVideo: true, material: "Plantilla de reporte · XLSX" },
    ],
  },
  {
    title: "Automatización",
    lessons: [
      { title: "Preparar tareas repetitivas", duration: 18, hasVideo: true, material: "Ejercicio guiado · XLSX" },
      { title: "Automatización básica", duration: 26, hasVideo: true, material: "Guía del módulo · PDF" },
      { title: "Proyecto de análisis", duration: 30, hasVideo: true, material: "Rúbrica del proyecto · PDF" },
    ],
  },
];

export function getDemoCourseContent(courseId: string): DemoModule[] {
  if (courseId === "2") return reactModules;
  if (courseId === "3" || courseId === "excel") return excelModules;
  return pythonModules;
}

export function getDemoCourseLessons(courseId: string): DemoLesson[] {
  return getDemoCourseContent(courseId).flatMap((module) => module.lessons);
}
