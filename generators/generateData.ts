import { faker } from "@faker-js/faker";

const TOPICS = [
  "Leadership",
  "Financial Planning",
  "AI",
  "Communication",
  "Marketing",
  "Sales",
  "Project Management",
  "Cybersecurity",
  "Data Analysis",
  "HR",
] as const;

type Topic = (typeof TOPICS)[number];

const TOPIC_TO_SKILLS: Record<Topic, string[]> = {
  Leadership: ["Delegation", "Team Management", "Decision Making"],
  "Financial Planning": ["Budgeting", "Cash Flow", "Forecasting"],
  AI: ["Prompt Engineering", "Machine Learning", "Automation"],
  Communication: ["Public Speaking", "Active Listening", "Writing"],
  Marketing: ["Digital Marketing", "Content Creation", "SEO"],
  Sales: ["Negotiation", "Lead Generation", "Closing Deals"],
  "Project Management": ["Agile", "Scrum", "Risk Management"],
  Cybersecurity: ["Network Security", "Threat Analysis", "Incident Response"],
  "Data Analysis": ["Data Visualization", "Statistical Analysis", "Data Cleaning"],
  HR: ["Recruitment", "Employee Engagement", "Performance Management"],
};

const LEVELS = ["beginner", "intermediate", "advanced"];

const PREFIXES = [
  "Introduction to",
  "Mastering",
  "Advanced",
  "Practical",
  "Essential",
  "Modern",
];

const SKILLS = [
  "Budgeting",
  "Forecasting",
  "Cash Flow",
  "Leadership",
  "Delegation",
  "Team Management",
  "Communication",
  "Public Speaking",
  "Negotiation",
  "AI",
  "Prompt Engineering",
  "Data Analysis",
  "Project Management",
];

const GOALS = [
  "Become a better leader",
  "Improve financial planning",
  "Learn AI",
  "Improve communication",
  "Manage projects effectively",
];

type User = {
  role: "Developer" | "Manager" | "HR" | "Founder";
  industry: "NGO" | "Healthcare" | "Education";
  companySize: "Small" | "Medium" | "Large";
  seniority: "Junior" | "Mid" | "Senior";
  goal: string;
};

export function generateUsers(count: number): User[] {
  const users = [];

  for (let i = 0; i < count; i++) {
    users.push({
      role: faker.helpers.arrayElement([
        "Developer",
        "Manager",
        "HR",
        "Founder",
      ]),
      industry: faker.helpers.arrayElement(["NGO", "Healthcare", "Education"]),
      companySize: faker.helpers.arrayElement(["Small", "Medium", "Large"]),
      seniority: faker.helpers.arrayElement(["Junior", "Mid", "Senior"]),
      goal: faker.helpers.arrayElement([
        "Leadership",
        "Financial Planning",
        "AI",
        "Communication",
        "Marketing",
        "Sales",
        "Project Management",
        "Cybersecurity",
        "Data Analysis",
        "HR",
      ]),
    });
  }

  return users;
}

type Course = {
  id?: number;
  title: string;
  topic: Topic;
  level: (typeof LEVELS)[number];
  duration: number;
};

export function generateCourses(count: number): Course[] {
  const courses = [];

  for (let i = 0; i < count; i++) {
    const topic = faker.helpers.arrayElement(TOPICS);

    const level = faker.helpers.arrayElement(LEVELS);

    const prefix = faker.helpers.arrayElement(PREFIXES);

    courses.push({
      title: `${prefix} ${topic}`,
      topic,
      level,
      duration: faker.number.int({
        min: 30,
        max: 180,
      }),
    });
  }

  return courses;
}

export function generateSurveyResponse(userId: number) {
  const preferredTopic = faker.helpers.arrayElement(TOPICS);

  return {
    userId: userId,
    skillGap: faker.helpers.arrayElement(SKILLS),
    goal: `Improve ${preferredTopic}`,
    preferredTopic: faker.helpers.arrayElement(
      TOPIC_TO_SKILLS[preferredTopic] || [],
    ),
    confidence: faker.number.int({
      min: 1,
      max: 5,
    }),
  };
}

export function generateUsageEvents(userId: number, courseIds: number[]) {
  return courseIds.map((courseId) => {
    const eventType = faker.helpers.arrayElement([
      "started",
      "completed",
      "dropped",
    ]);

    let progress = 0;
    let quizScore: number | null = null;

    switch (eventType) {
      case "completed":
        progress = 100;
        quizScore = faker.number.int({
          min: 50,
          max: 100,
        });
        break;

      case "started":
        progress = faker.number.int({
          min: 1,
          max: 80,
        });
        break;

      case "dropped":
        progress = faker.number.int({
          min: 1,
          max: 79,
        });
        break;

      default:
        break;
    }

    return {
      userId: userId,
      courseId: courseId,
      eventType: eventType,
      progress: progress,
      quizScore: quizScore,
      createdAt: faker.date.recent({ days: 30 }),
    };
  });
}

export function generateCoursePrerequisites(courses: Course[]) {
  const prerequisites = [];

  for (const course of courses) {
    if (course.level === "beginner") continue;

    const possible = courses.filter(
      (c) =>
        c.id !== course.id &&
        c.topic === course.topic &&
        c.level !== "advanced",
    );

    if (possible.length === 0) continue;

    const prerequisite = faker.helpers.arrayElement(possible);

    prerequisites.push({
      courseId: course.id,
      prerequisiteCourseId: prerequisite.id,
    });
  }

  return prerequisites;
}
