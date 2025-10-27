const express = require("express");
const router = express.Router();
const { customAlphabet } = require("nanoid");
const Url = require("../models/Url");
const urlParser = require("url");

// Custom nanoid for collision-resistant short IDs
const nanoid = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  8
);

// Utility function to extract domain from referrer
const extractDomain = (referrer) => {
  if (!referrer) return "direct";
  try {
    const parsed = urlParser.parse(referrer);
    return parsed.hostname || "direct";
  } catch {
    return "direct";
  }
};

// Utility function to validate URL
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// POST /shorten - Create short URL
router.post("/shorten", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        error: "URL is required",
        message: "Please provide a valid URL to shorten",
      });
    }

    if (!isValidUrl(url)) {
      return res.status(400).json({
        error: "Invalid URL format",
        message: "Please provide a valid HTTP or HTTPS URL",
      });
    }

    // Check if URL already exists
    let existingUrl = await Url.findOne({ originalUrl: url });
    if (existingUrl) {
      return res.json({
        shortUrl: `${process.env.BASE_URL}/${existingUrl.shortId}`,
        shortId: existingUrl.shortId,
        originalUrl: url,
        existing: true,
      });
    }

    // Generate unique shortId with collision detection
    let shortId;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      shortId = nanoid();
      attempts++;
      if (attempts > maxAttempts) {
        throw new Error("Unable to generate unique short ID");
      }
    } while (await Url.exists({ shortId }));

    // Create new URL document
    const urlDoc = await Url.create({
      shortId,
      originalUrl: url,
      referrers: new Map(),
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
    });

    res.status(201).json({
      shortUrl: `${process.env.BASE_URL}/${shortId}`,
      shortId: shortId,
      originalUrl: url,
      createdAt: urlDoc.createdAt,
    });
  } catch (error) {
    console.error("Error in /shorten:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to create short URL",
    });
  }
});

// GET /:shortId - Redirect to original URL
router.get("/:shortId", async (req, res) => {
  try {
    const { shortId } = req.params;

    if (!shortId || shortId.length !== 8) {
      return res.status(400).json({
        error: "Invalid short ID format",
      });
    }

    const urlDoc = await Url.findOne({ shortId });

    if (!urlDoc) {
      return res.status(404).json({
        error: "Short URL not found",
        message: "The requested short URL does not exist",
      });
    }

    // Extract referrer domain
    const referrer = extractDomain(req.get("referer"));

    // Increment click count and update analytics
    await urlDoc.incrementClick(referrer);

    // Redirect to original URL
    return res.redirect(301, urlDoc.originalUrl);
  } catch (error) {
    console.error("Error in redirect:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to redirect",
    });
  }
});

// GET /stats/:shortId - Get analytics
router.get("/stats/:shortId", async (req, res) => {
  try {
    const { shortId } = req.params;

    if (!shortId || shortId.length !== 8) {
      return res.status(400).json({
        error: "Invalid short ID format",
      });
    }

    const urlDoc = await Url.findOne({ shortId });

    if (!urlDoc) {
      return res.status(404).json({
        error: "Short URL not found",
        message: "The requested short URL does not exist",
      });
    }

    // Get top 5 referrer domains
    const topReferrers = urlDoc.getTopReferrers(5);

    res.json({
      shortId: urlDoc.shortId,
      originalUrl: urlDoc.originalUrl,
      clickCount: urlDoc.clickCount,
      lastAccessed: urlDoc.lastAccessed,
      topReferrers,
      createdAt: urlDoc.createdAt,
      totalReferrers: urlDoc.referrers.size,
    });
  } catch (error) {
    console.error("Error in /stats:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to get statistics",
    });
  }
});

// GET /health - Health check endpoint
// router.get('/health', (req, res) => {
//   res.json({
//     status: 'OK',
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime()
//   });
// });

module.exports = router;
