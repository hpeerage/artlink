import { db } from './src/lib/turso';
import { settings } from './src/lib/db/schema';
async function main() {
  const all = await db.select().from(settings);
  console.log(all);
}
main();
