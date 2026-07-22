import { db } from "../db/connection";
import {
  generateUsers,
  generateCourses,
  generateSurveyResponse,
  generateUsageEvents,
  generateCoursePrerequisites,
  generateCourseSkills,
} from "../generators/generateData";
import { faker } from "@faker-js/faker";

async function seed() {
  console.log("Seeding database...");

  await db.query("BEGIN");
  try {
    await db.query(`TRUNCATE TABLE
      usage_events,
      survey_responses,
      course_prerequisites,
      course_skills,
      courses,
      users
    RESTART IDENTITY CASCADE; `);

    const users = generateUsers(1000);
    const courses = generateCourses(200);

    const userIds = [];
    const courseIds: number[] = [];

    // seed users
    for (const user of users) {
      const result = await db.query(
        "INSERT INTO users (role, industry, company_size, seniority, stated_goal) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [user.role, user.industry, user.companySize, user.seniority, user.goal],
      );
      userIds.push(result.rows[0].id);
    }

    // seed courses
    for (const course of courses) {
      const result = await db.query(
        "INSERT INTO courses (title, topic, level, duration_mins) VALUES ($1, $2, $3, $4) RETURNING id",
        [course.title, course.topic, course.level, course.duration],
      );
      courseIds.push(result.rows[0].id);
    }

    // seed course skills
    const courseSkills = generateCourseSkills(courses);
    for (const courseSkill of courseSkills) {
      await db.query(
        "INSERT INTO course_skills (course_id, skill) VALUES ($1, $2)",
        [courseSkill.courseId, courseSkill.skill],
      );
    }

    // seed survey responses for each user
    for (const id of userIds) {
      const surveyResponse = generateSurveyResponse(id);
      await db.query(
        "INSERT INTO survey_responses (user_id, skill_gap, goal, preferred_topic, confidence) VALUES ($1, $2, $3, $4, $5)",
        [
          surveyResponse.userId,
          surveyResponse.skillGap,
          surveyResponse.goal,
          surveyResponse.preferredTopic,
          surveyResponse.confidence,
        ],
      );
    }

    // seed usage events for each user and course
    const userCourses = faker.helpers.arrayElements(
      courseIds,
      faker.number.int({ min: 1, max: 15 }),
    );

    for (const userId of userIds) {
      const events = generateUsageEvents(userId, userCourses);
      for (const event of events) {
        await db.query(
          "INSERT INTO usage_events (user_id, course_id, event_type, progress_pct, quiz_score, created_at) VALUES ($1, $2, $3, $4, $5, $6)",
          [
            event.userId,
            event.courseId,
            event.eventType,
            event.progress,
            event.quizScore,
            event.createdAt,
          ],
        );
      }
    }

    // generate course prerequisites
    let coursesCopy = courses.map((course, i) => ({
      ...course,
      id: courseIds[i],
    }));
    const coursePrerequisites = generateCoursePrerequisites(coursesCopy);
    for (const prerequisite of coursePrerequisites) {
      await db.query(
        "INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES ($1, $2)",
        [prerequisite.courseId, prerequisite.prerequisiteCourseId],
      );
    }

    console.log("Seeding completed successfully.");
    await db.query("COMMIT");
  } catch (error) {
    console.error("Error deleting data:", error);
    await db.query("ROLLBACK");
    return;
  }
}

seed();
