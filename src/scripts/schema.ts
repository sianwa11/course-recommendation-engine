import { readFile } from "fs/promises";
import { db } from "../../db/connection";

async function main() {
  try {
    const sql = await readFile("db/schema.sql", "utf8");

    await db.query(sql);

    console.log("✅ Database schema created.");
  } catch (error) {
    console.error("❌ Failed to create schema:", error);
    process.exit(1);
  } finally {
    await db.end();
  }
}

main();
