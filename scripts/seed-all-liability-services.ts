// Master script to seed all liability services into the database
import { seedCasaFdRdCreationService } from "./seed-casa-fdrd-creation-service";
import { seedCasaMiniStatementService } from "./seed-casa-ministatement-service";
import { seedRdDetailsService } from "./seed-rd-details-service";
import { seedChequeBookService } from "./seed-cheque-book-service";

async function seedAllLiabilityServices() {
  console.log("🌱 Starting comprehensive liability services seeding...");
  console.log("📊 This will add 4 new banking services to the Liabilities category:");
  console.log("   1. CASA FD&RD Creation Service");
  console.log("   2. CASA Mini Statement Service (CBR Maintenance)");
  console.log("   3. RD Details Service");
  console.log("   4. Cheque Book Request Service");
  console.log("");

  try {
    // Seed all services sequentially
    await seedCasaFdRdCreationService();
    await seedCasaMiniStatementService();
    await seedRdDetailsService();
    await seedChequeBookService();

    console.log("");
    console.log("🎉 All liability services seeded successfully!");
    console.log("✅ Total APIs added: 4");
    console.log("📂 Category: Liabilities");
    console.log("🔄 The portal will now display these new banking services in the API documentation.");
    
  } catch (error) {
    console.error("❌ Error during liability services seeding:", error);
    throw error;
  }
}

// Run the seeding if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedAllLiabilityServices()
    .then(() => {
      console.log("Master seeding script completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Master seeding script failed:", error);
      process.exit(1);
    });
}

export { seedAllLiabilityServices };