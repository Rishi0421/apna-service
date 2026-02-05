import Provider from "../models/Provider.js";
import Booking from "../models/Booking.js";
import Review from "../models/Review.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import mongoose from "mongoose";

/* ================================
   HELPER: FULL SERVICE NORMALIZER
================================ */
const normalizeServices = async (provider) => {
  if (!provider || !Array.isArray(provider.services)) return;

  let changed = false;

  provider.services = provider.services.map((s) => {
    if (typeof s === "string") {
      changed = true;
      return {
        _id: new mongoose.Types.ObjectId(),
        name: s,
        category: s.toLowerCase(),
        isApproved: true,
      };
    }

    if (typeof s === "object" && !s._id) {
      changed = true;
      return {
        _id: new mongoose.Types.ObjectId(),
        name: s.name,
        category: s.category,
        isApproved: s.isApproved ?? false,
      };
    }

    return s;
  });

  if (changed) await provider.save();
};

/* ================================
   CREATE PROVIDER PROFILE
================================ */
export const createProviderProfile = async (req, res) => {
  try {
    const { pincodes, experience } = req.body;

    if (!pincodes || pincodes.length === 0) {
      return res.status(400).json({ message: "Pincodes required" });
    }

    const exists = await Provider.findOne({ user: req.user._id });
    if (exists) {
      return res.status(400).json({ message: "Provider profile already exists" });
    }

    await User.findByIdAndUpdate(req.user._id, { role: "provider" });

    const provider = await Provider.create({
      user: req.user._id,
      services: [],
      pincodes,
      experience,
      isVerified: false,
    });

    res.status(201).json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   ADD SERVICE
================================ */
export const addService = async (req, res) => {
  try {
    const { name, category, price } = req.body;

    if (!name || !category) {
      return res.status(400).json({ message: "Service name & category required" });
    }

    const provider = await Provider.findOne({ user: req.user._id }).populate(
      "user",
      "name"
    );

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    let imagePath = "";
    if (req.file) {
      imagePath = `/uploads/services/${req.file.filename}`;
      console.log("📁 Service image uploaded:", {
        filename: req.file.filename,
        path: imagePath,
        size: req.file.size,
      });
    }

    const newService = {
      _id: new mongoose.Types.ObjectId(),
      name,
      category,
      price: price ? Number(price) : undefined,
      image: imagePath,
      isApproved: false,
    };

    provider.services.push(newService);

    provider.isVerified = false;
    await provider.save();

    console.log("✅ Service added:", {
      serviceName: name,
      providerName: provider.user?.name,
      image: imagePath,
      isApproved: false,
    });

    res.json({ 
      message: "Service added with image, waiting for admin approval", 
      service: newService 
    });
  } catch (error) {
    console.error("❌ ADD SERVICE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


/* ================================
   🔥 TOGGLE AVAILABILITY (FIX)
================================ */
export const toggleAvailability = async (req, res) => {
  try {
    const provider = await Provider.findOne({ user: req.user._id });
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    provider.isOnline = !provider.isOnline;
    await provider.save();

    res.json({
      message: `Provider is now ${provider.isOnline ? "Online" : "Offline"}`,
      isOnline: provider.isOnline,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   UPDATE PROFILE
================================ */
export const updateProviderProfile = async (req, res) => {
  try {
    const provider = await Provider.findOne({ user: req.user._id });
    if (!provider) {
      return res.status(404).json({ message: "Provider profile not found" });
    }

    await normalizeServices(provider);

    if (req.body.pincodes) provider.pincodes = req.body.pincodes;
    if (req.body.experience !== undefined)
      provider.experience = req.body.experience;

    await provider.save();
    res.json({ message: "Profile updated", provider });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   GET PROFILE
================================ */
export const getMyProviderProfile = async (req, res) => {
  const provider = await Provider.findOne({ user: req.user._id }).populate(
    "user",
    "name email"
  );

  if (!provider) {
    return res.status(404).json({ message: "Provider profile not found" });
  }

  await normalizeServices(provider);
  res.json(provider);
};

/* ================================
   DASHBOARD
================================ */
export const getProviderDashboard = async (req, res) => {
  const provider = await Provider.findOne({ user: req.user._id });
  await normalizeServices(provider);
  res.json({ profile: provider });
};

/* ================================
   REVIEWS
================================ */
export const getMyReviews = async (req, res) => {
  const reviews = await Review.find({ provider: req.user._id }).populate(
    "user",
    "name"
  );
  res.json(reviews);
};

/* ================================
   SEARCH (ONLINE ONLY)
================================ */
export const searchProviders = async (req, res) => {
  try {
    const { pincode, service } = req.query;

    const query = { isVerified: true };

    // If pincode provided, filter by it; otherwise return across pincodes
    if (pincode && pincode.trim()) {
      query.pincodes = { $in: [pincode.trim()] };
    }

    // Match approved services by name (case-insensitive, partial match)
    if (service && service.trim()) {
      query.services = {
        $elemMatch: {
          name: new RegExp(service.trim(), "i"),
          isApproved: true,
        },
      };
    } else {
      // if no service provided, still require at least one approved service
      query["services.isApproved"] = true;
    }

    const providers = await Provider.find(query).populate("user", "name email");

    res.json(providers);
  } catch (error) {
    console.error("SEARCH PROVIDERS ERROR:", error);
    res.status(500).json({ message: "Search failed" });
  }
};

/* ================================
   ADMIN
================================ */
export const verifyProvider = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.providerId);

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // 🔥 VERIFY PROVIDER
    provider.isVerified = true;

    // 🔥 AUTO-APPROVE ALL SERVICES
    provider.services = provider.services.map(service => ({
      ...service,
      isApproved: true,
    }));

    provider.markModified("services");
    await provider.save();

    await Notification.create({
      user: provider.user,
      text: "Your provider account and all services have been approved ✅",
    });

    res.json({
      message: "Provider and all services approved successfully",
      provider,
    });
  } catch (err) {
    console.error("VERIFY PROVIDER ERROR:", err);
    res.status(500).json({ message: "Provider verification failed" });
  }
};


export const getAllProviders = async (req, res) => {
  const providers = await Provider.find().populate("user", "name email");
  for (let p of providers) await normalizeServices(p);
  res.json(providers);
};

/* ================================
   UPDATE SERVICE PRICE (PROVIDER)
================================ */
export const updateServicePrice = async (req, res) => {
  try {
    const { serviceId, price } = req.body;

    if (!serviceId || price === undefined) {
      return res.status(400).json({ message: "Service ID and price required" });
    }

    const provider = await Provider.findOne({ user: req.user._id });
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // 🔥 FIX: Mixed type safe update
    const index = provider.services.findIndex(
      (s) => s._id?.toString() === serviceId
    );

    if (index === -1) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (!provider.services[index].isApproved) {
      return res
        .status(403)
        .json({ message: "Service not approved yet" });
    }

    provider.services[index].price = price;
    provider.markModified("services"); // 🔥 VERY IMPORTANT
    await provider.save();

    res.json({ message: "Price updated successfully" });
  } catch (error) {
    console.error("UPDATE PRICE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   DELETE SERVICE (PROVIDER)
================================ */
export const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const provider = await Provider.findOne({ user: req.user._id });
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    const service = provider.services.id(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // 🔥 REMOVE SERVICE
    service.deleteOne();
    provider.markModified("services");
    await provider.save();

    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("DELETE SERVICE ERROR:", error);
    res.status(500).json({ message: "Failed to delete service" });
  }
};

/* ================================
   GET ALL APPROVED SERVICES (FOR DROPDOWN)
================================ */
export const getAllApprovedServices = async (req, res) => {
  try {
    const providers = await Provider.find({ "services.isApproved": true });
    
    const serviceSet = new Set();
    providers.forEach((provider) => {
      provider.services.forEach((service) => {
        if (service.isApproved) {
          serviceSet.add(service.name);
        }
      });
    });

    const services = Array.from(serviceSet).sort();
    res.json(services);
  } catch (error) {
    console.error("GET SERVICES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch services" });
  }
};
