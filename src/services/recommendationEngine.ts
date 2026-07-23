import { getUserById, User } from "../models/users.js";
import { getSurveyByUserId, Survey } from "../models/surveys.js";
import { getUsageByUserId, Usage } from "../models/usage.js";
import {
  Course,
  getAllCourses,
  getCourseSkills,
  getCoursePrerequisites,
  CoursePrerequisite,
} from "../models/courses.js";

export async function getRecommendations(
  userId: number,
  limit: number = 5,
): Promise<Score[]> {
  const user = await getUserById(userId);
  const survey = await getSurveyByUserId(userId);
  const usage = await getUsageByUserId(userId);
  const courses = await getAllCourses();
  const courseTopicMap = new Map(
    courses.map((course) => [course.id, course.topic]),
  );

  const recommendations = [];

  for (const course of courses) {
    const skills = await getCourseSkills(course.id);
    const coursePrerequisites = await getCoursePrerequisites(course.id);

    const recommendation = scoreCourse(
      course,
      user,
      survey,
      usage,
      skills,
      coursePrerequisites,
      courseTopicMap,
    );
    if (recommendation) {
      recommendations.push(recommendation);
    }
  }

  return (
    recommendations.sort((a, b) => b.score - a.score).slice(0, limit) || []
  );
}

interface Score {
  course: Course;
  score: number;
  reason: string[];
}

function scoreCourse(
  course: Course,
  user: User,
  survey: Survey | null,
  usage: Usage[],
  skills: string[],
  prerequisites: CoursePrerequisite[],
  courseTopicMap: Map<number, string>,
): Score | null {
  // 1. If the user has already completed the course, do not recommend it.
  const completed = usage.filter(
    (u) => u.course_id === course.id && u.event_type === "completed",
  ).length;
  if (completed > 0) return null;

  const prerequisite = prerequisites.find((p) => p.course_id === course.id);
  if (prerequisite) {
    const completed = usage.some(
      (u) =>
        u.course_id === prerequisite.prerequisite_course_id &&
        u.event_type === "completed",
    );

    if (!completed) {
      return null;
    }
  }

  let score = 0;
  let reasonParts: string[] = [];

  if (survey && survey?.preferred_topic == course.topic) {
    score += 40;
    reasonParts.push("Matches preferred topic from survey");
  }

  if (survey && survey?.skill_gap && skills.includes(survey.skill_gap)) {
    score += 30;
    reasonParts.push("Addresses skill gap from survey");
  }

  const levelMap = {
    Junior: "beginner",
    Mid: "intermediate",
    Senior: "advanced",
  };

  if (course.level === levelMap[user.seniority]) {
    score += 20;
    reasonParts.push("Matches user's seniority level");
  }

  const relatedUsage = usage.filter(
    (u) => courseTopicMap.get(u.course_id) === course.topic,
  );

  for (const event of relatedUsage) {
    if (event.event_type === "started") {
      score += 10;
      reasonParts.push("Previously started a similar course");

      if (event.progress_pct > 60) {
        score += 15;
        reasonParts.push("High progress in a similar course");
      }
    }

    if (event.event_type === "dropped") {
      score -= 20;
      reasonParts.push("Previously dropped a similar course");
    }
  }

  if (
    survey &&
    survey?.goal.toLowerCase().includes(course.topic.toLowerCase())
  ) {
    score += 10;
    reasonParts.push("Matches user's goal from survey");
  }

  if (score <= 0) return null;

  return {
    course,
    score,
    reason: reasonParts,
  };
}
