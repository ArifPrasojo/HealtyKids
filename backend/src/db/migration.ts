import { Client } from "pg";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const tables = [
  "quiz_attempt_answer",
  "quiz_attempt",
  "question_answer",
  "quiz_question",
  "quiz",
  "progresses",
  "sub_material",
  "materials",
  "users"
];

async function main() {
  await client.connect();
  for (const table of tables) {
    await client.query(`DROP TABLE IF EXISTS ${table} CASCADE;`);
    console.log(`Dropped table: ${table}`);
  }
  await client.end();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});