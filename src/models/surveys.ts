import { db } from "../../db/connection";

export type Survey = {
  id: number;
  user_id: number;
  skill_gap: string;
  goal: string;
  preferred_topic: string;
  confidence: number;
};

export async function getSurveyByUserId(
  userId: number,
): Promise<Survey | null> {
  const result = await db.query(
    "SELECT * FROM survey_responses WHERE user_id = $1",
    [userId],
  );
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0] as Survey;
}
