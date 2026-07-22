import { db } from "../db/connection";

export type Usage = {
  id: number;
  user_id: number;
  course_id: number;
  event_type: "started" | "completed" | "dropped";
  progress_pct: number;
  quiz_score: number;
  created_at: Date;
};

export const getUsageByUserId = async (userId: number): Promise<Usage[]> => {
  const result = await db.query(
    "SELECT * FROM usage_events WHERE user_id = $1",
    [userId],
  );
  return result.rows as Usage[];
};
