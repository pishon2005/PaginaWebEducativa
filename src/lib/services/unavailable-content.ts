export interface UnavailableLesson {
  title: string;
  duration: number;
  hasVideo: boolean;
  material: string;
}

export interface UnavailableModule {
  title: string;
  lessons: UnavailableLesson[];
}

export const getUnavailableCourseContent = (_courseId: string): UnavailableModule[] => [];
export const getUnavailableCourseLessons = (_courseId: string): UnavailableLesson[] => [];
