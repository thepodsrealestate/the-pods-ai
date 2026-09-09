import prisma from "../lib/prisma";

async function main() {
  console.log("==================================================");
  console.log("VERIFYING LIVE SUPABASE DATABASE CONNECTION...");
  console.log("==================================================");

  const result = await prisma.$queryRaw<Array<{ table_name: string }>>`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `;

  console.log(`\nProject Connected Successfully!`);
  console.log(`Total Public Tables Deployed: ${result.length}\n`);

  for (const row of result) {
    try {
      const cnt = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM public."${row.table_name}"`);
      console.log(`  ${row.table_name}: ${(cnt as any)[0].count}`);
    } catch(e: any) {
      console.log(`  ${row.table_name}: err ${e.message}`);
    }
  }

  console.log("\n==================================================");
}

main()
  .catch((e) => {
    console.error("Verification error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
