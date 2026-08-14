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

  result.forEach((row, i) => {
    console.log(`  ${i + 1}. ${row.table_name}`);
  });

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
