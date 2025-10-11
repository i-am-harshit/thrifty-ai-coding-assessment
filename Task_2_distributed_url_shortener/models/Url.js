const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  shortId: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  originalUrl: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: "Invalid URL format",
    },
  },
  clickCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  lastAccessed: {
    type: Date,
  },
  referrers: {
    type: Map,
    of: Number,
    default: new Map(),
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },

  // Additional fields for analytics
  userAgent: String,
  ipAddress: String,

  // Sharding key for horizontal scaling
  shardKey: {
    type: String,
    default: function () {
      return this.shortId.substring(0, 2);
    },
  },
});

// Index for efficient queries
urlSchema.index({ shortId: 1 });
urlSchema.index({ createdAt: -1 });
urlSchema.index({ shardKey: 1 });

// Pre-save middleware
urlSchema.pre("save", function (next) {
  if (this.isNew) {
    this.shardKey = this.shortId.substring(0, 2);
  }
  next();
});

// Instance methods
urlSchema.methods.incrementClick = function (referrer = "direct") {
  this.clickCount += 1;
  this.lastAccessed = new Date();

  // Update referrer count
  const currentCount = this.referrers.get(referrer) || 0;
  this.referrers.set(referrer, currentCount + 1);

  return this.save();
};

urlSchema.methods.getTopReferrers = function (limit = 5) {
  return Array.from(this.referrers.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([domain, count]) => ({ domain, count }));
};

module.exports = mongoose.model("Url", urlSchema);
