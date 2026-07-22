import { db } from "../db/connection";

export type Course = {
  id: number;
  title: string;
  topic: string;
  level: "beginner" | "intermediate" | "advanced";
  duration_mins: number;
};

export const getAllCourses = async (): Promise<Course[]> => {
  const result = await db.query<Course>("SELECT * FROM courses");
  return result.rows;
};

export const getCourseSkills = async (courseId: number): Promise<string[]> => {
  const result = await db.query(
    "SELECT skill FROM course_skills WHERE course_id = $1",
    [courseId],
  );
  return result.rows;
};

export type CoursePrerequisite = {
  course_id: number;
  prerequisite_course_id: number;
};

export const getCoursePrerequisites = async (
  courseId: number,
): Promise<CoursePrerequisite[]> => {
  const result = await db.query<CoursePrerequisite>(
    "SELECT * FROM course_prerequisites WHERE course_id = $1",
    [courseId],
  );
  return result.rows;
};
