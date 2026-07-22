import { db } from "../../db/connection";

export type User = {
  id: number;
  role: string;
  industry: string;
  company_size: string;
  seniority: "Junior" | "Mid" | "Senior";
  stated_goal: string;
};

export async function getUserById(userId: number): Promise<User> {
  const result = await db.query("SELECT * FROM users WHERE id = $1", [userId]);

  if (result.rows.length === 0) {
    throw new Error(`User with ID ${userId} not found`);
  }

  return result.rows[0] as User;
}
