import mongoose from "mongoose";
import Provider from "../models/Provider.js";
import dotenv from "dotenv";

dotenv.config();

const migrateServices = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for migration");

    const providers = await Provider.find({});

    for (let provider of providers) {
      if (
        provider.services &&
        provider.services.length > 0 &&
        typeof provider.services[0] === "string"
      ) {
        provider.services = provider.services.map((s) => ({
          name: s,
          category: s.toLowerCase(),
          isApproved: true, // old services were already live
        }));

        await provider.save();
        console.log(`Migrated provider ${provider._id}`);
      }
    }

    console.log("✅ Migration completed successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
};

migrateServices();
