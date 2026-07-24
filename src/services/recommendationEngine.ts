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

const LEVEL_MAP = {
  Junior: "beginner",
  Mid: "intermediate",
  Senior: "advanced",
};

const ROLE_TOPICS: Record<string, string[]> = {
  Developer: ["AI", "Cybersecurity", "Data Analysis"],
  Manager: ["Leadership", "Project Management"],
  HR: ["HR", "Communication", "Leadership"],
  Founder: ["Leadership", "Sales", "Financial Planning"],
};

const INDUSTRY_TOPICS: Record<string, string[]> = {
  NGO: ["Leadership", "Communication", "Project Management"],
  Healthcare: ["Leadership", "Communication"],
  Education: ["Leadership", "AI"],
};

export async function getRecommendations(
  userId: number,
  limit: number = 5,
): Promise<Score[]> {
  const user = await getUserById(userId);
  const survey = await getSurveyByUserId(userId);
  const usage = await getUsageByUserId(userId);
  const courses = await getAllCourses();

  // cold start users
  if (usage.length === 0) {
    return getColdStartRecommendations(user, courses);
  }

  return getCourseRecommendations(courses, user, survey, usage, limit);
}

function getColdStartRecommendations(
  user: User,
  courses: Course[],
  limit: number = 5,
) {
  const recommendations = [];
  for (const course of courses) {
    let score = 0;
    let reasonParts: string[] = [];

    if (course.topic === user.stated_goal) {
      score += 40;
      reasonParts.push("Matches user's stated goal");
    }

    if (ROLE_TOPICS[user.role]?.includes(course.topic)) {
      score += 30;
      reasonParts.push("Matches user's role");
    }

    if (INDUSTRY_TOPICS[user.industry]?.includes(course.topic)) {
      score += 30;
      reasonParts.push("Matches user's industry");
    }

    if (course.level === LEVEL_MAP[user.seniority]) {
      score += 20;
      reasonParts.push("Matches user's seniority level");
    }

    recommendations.push({
      course,
      score,
      reason: reasonParts,
    });
  }
  return recommendations.sort((a, b) => b.score - a.score).slice(0, limit);
}

async function getCourseRecommendations(
  courses: Course[],
  user: User,
  survey: Survey | null,
  usage: Usage[],
  limit: number = 5,
) {
  const recommendations = [];

  const courseTopicMap = new Map<number, string>(
    courses.map((course) => [course.id, course.topic]),
  );

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
    score += 38;
    reasonParts.push("Addresses skill gap from survey");
  }

  if (course.level === LEVEL_MAP[user.seniority]) {
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
