// Master script to seed additional liability services into the database
import { seedHoldMarkingService } from "./seed-hold-marking-service";
import { seedHoldReleaseService } from "./seed-hold-release-service";
import { seedRdCalculatorService } from "./seed-rd-calculator-service";
import { seedStopChequeService } from "./seed-stop-cheque-service";
import { seedTdCalculationService } from "./seed-td-calculation-service";

async function seedAdditionalLiabilityServices() {
  console.log("🌱 Starting additional liability services seeding...");
  console.log("📊 This will add 5 new banking services to the Liabilities category:");
  console.log("   1. Hold Marking Service (ASBA IPO Hold)");
  console.log("   2. Hold Release Service (ASBA IPO Release)");
  console.log("   3. RD Calculator Service");
  console.log("   4. Stop Cheque Service");
  console.log("   5. TD Calculation Service");
  console.log("");

  try {
    // Seed all services sequentially
    await seedHoldMarkingService();
    await seedHoldReleaseService();
    await seedRdCalculatorService();
    await seedStopChequeService();
    await seedTdCalculationService();

    console.log("");
    console.log("🎉 All additional liability services seeded successfully!");
    console.log("✅ Total APIs added: 5");
    console.log("📂 Category: Liabilities");
    console.log("🔄 The portal will now display these new banking services in the API documentation.");
    
  } catch (error) {
    console.error("❌ Error during additional liability services seeding:", error);
    throw error;
  }
}

// Run the seeding if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedAdditionalLiabilityServices()
    .then(() => {
      console.log("Master seeding script completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Master seeding script failed:", error);
      process.exit(1);
    });
}

export { seedAdditionalLiabilityServices };