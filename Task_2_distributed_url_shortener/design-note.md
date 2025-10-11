# URL Shortener Service - System Design Document

## Executive Summary

This document outlines the design and implementation of a scalable URL shortener service capable of handling 1M+ active URLs and 10K+ requests per minute. The system is built using Node.js, Express.js, and MongoDB, with considerations for horizontal scaling, high availability, and comprehensive analytics.

## Architecture Overview

### Technology Stack
- **Backend**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **ID Generation**: NanoID with custom alphabet (Base62)
- **Rate Limiting**: rate-limiter-flexible library
- **Deployment**: Docker-ready with environment configuration

### Core Components
1. **API Layer**: RESTful endpoints for URL operations
2. **Business Logic**: URL shortening, analytics tracking, validation
3. **Data Layer**: MongoDB with optimized schemas and indexes
4. **Middleware**: Rate limiting, error handling, request validation

## Database Design

### Collection: URLs

```javascript
{
  shortId: String,        // 8-character unique identifier (indexed)
  originalUrl: String,    // Original long URL with validation
  clickCount: Number,     // Incremental counter for analytics
  lastAccessed: Date,     // Timestamp of last access
  referrers: Map<String, Number>, // Domain-to-count mapping
  createdAt: Date,        // Creation timestamp (indexed)
  shardKey: String,       // Sharding key for horizontal scaling
  userAgent: String,      // Client information
  ipAddress: String       // Request origin (for debugging)
}
```

### Indexing Strategy

1. **Primary Index**: `shortId` (unique, B-tree)
   - Purpose: Fast O(1) lookups for redirects
   - Usage: Most frequent operation

2. **Time-based Index**: `createdAt` (descending)
   - Purpose: Time-range queries, cleanup operations
   - Usage: Analytics, maintenance

3. **Sharding Index**: `shardKey` (ascending)
   - Purpose: Horizontal partitioning
   - Usage: Distributed deployments

### Database Choice: MongoDB

**Advantages:**
- **Horizontal Scalability**: Native sharding support
- **Schema Flexibility**: Easy to add new analytics fields
- **High Write Throughput**: Optimized for frequent insertions
- **Map Data Type**: Efficient storage for referrer analytics
- **Automatic Failover**: Replica set support

**Trade-offs:**
- **Eventual Consistency**: Acceptable for analytics use case
- **Memory Usage**: Higher than relational databases
- **Query Complexity**: Less powerful than SQL for complex joins

## ID Generation Strategy

### NanoID Implementation

```javascript
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);
```

**Benefits:**
- **Collision Resistance**: 62^8 = ~218 trillion possibilities
- **URL Safe**: No special characters requiring encoding
- **Distributed Generation**: No coordination needed between instances
- **Cryptographically Secure**: Uses secure random number generation

**Alternative Approaches Considered:**

1. **Sequential IDs**: Rejected due to predictability and bottlenecks
2. **Hash-based**: Rejected due to collision potential
3. **Snowflake IDs**: Overkill for this use case, timestamp not needed
4. **UUID**: Too long for user-friendly URLs

## Scalability Architecture

### Horizontal Scaling Strategy

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   App Instance  │    │   App Instance  │
│    (nginx)      │────│      :3001      │    │      :3002      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                └────────┬───────────────┘
                                         │
                       ┌─────────────────────────────────┐
                       │         MongoDB Cluster        │
                       │   ┌─────┐  ┌─────┐  ┌─────┐   │
                       │   │Shard│  │Shard│  │Shard│   │
                       │   │  1  │  │  2  │  │  3  │   │
                       │   └─────┘  └─────┘  └─────┘   │
                       └─────────────────────────────────┘
```

### Sharding Strategy

**Shard Key**: First 2 characters of `shortId`
- **Distribution**: Uniform across 62² = 3,844 possible prefixes
- **Query Routing**: Direct shard targeting for redirects
- **Rebalancing**: Automatic with MongoDB's balancer

### Caching Strategy

**Level 1: Application Memory** (Optional)
```javascript
const hotUrls = new Map(); // Most accessed URLs
if (hotUrls.has(shortId)) {
  return hotUrls.get(shortId);
}
```

**Level 2: Redis Cache** (Production Recommendation)
```javascript
// Cache hot URLs for faster redirects
const cachedUrl = await redis.get(`url:${shortId}`);
if (cachedUrl) return cachedUrl;
```

**Cache Invalidation**: TTL-based (5-15 minutes) to balance performance and freshness.

## Rate Limiting Design

### Implementation
- **Algorithm**: Token bucket (via rate-limiter-flexible)
- **Granularity**: Per IP address
- **Limits**: 10 requests/minute (configurable)
- **Storage**: In-memory (development), Redis (production)

### Distributed Rate Limiting

```javascript
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  points: 10,
  duration: 60,
  keyPrefix: 'rl_shortener'
});
```

## Analytics Implementation

### Real-time Analytics
- **Click Tracking**: Atomic increment operations
- **Referrer Analysis**: Domain extraction and counting
- **Time-series Data**: Timestamp tracking for access patterns

### Analytics Optimization
1. **Embedded Documents**: Referrer data stored within URL document
2. **Atomic Operations**: Use MongoDB's `$inc` for thread-safe updates
3. **Top-N Queries**: Pre-sorted referrer arrays for fast retrieval

### Future Analytics Enhancements
- **Separate Analytics DB**: For complex reporting queries
- **Time-based Aggregations**: Daily/monthly summaries
- **Geographic Analytics**: IP-based location tracking
- **A/B Testing**: Multiple short URLs for same original URL

## Performance Optimizations

### Database Optimizations
1. **Connection Pooling**: Reuse database connections
2. **Write Concerns**: Balanced durability vs. speed
3. **Read Preferences**: Secondary reads for analytics queries
4. **Partial Indexes**: Only index non-null fields

### Application Optimizations
1. **Async/Await**: Non-blocking I/O operations
2. **Request Validation**: Early rejection of invalid requests
3. **Response Compression**: Gzip compression for API responses
4. **Memory Management**: Proper cleanup of large objects

## Security Considerations

### Input Validation
- **URL Format**: Regex validation for proper URL structure
- **Length Limits**: Prevent oversized payloads
- **Domain Blacklisting**: Block malicious domains (future)

### Rate Limiting Security
- **DDoS Protection**: Configurable rate limits
- **IP-based Blocking**: Temporary bans for abuse
- **Distributed Limits**: Consistent across multiple instances

### Data Protection
- **Environment Variables**: Sensitive configuration externalized
- **Input Sanitization**: Prevent NoSQL injection
- **HTTPS Enforcement**: Secure communication (production)

## Monitoring and Observability

### Metrics to Track
1. **Performance Metrics**:
   - Request latency (p50, p95, p99)
   - Throughput (requests/second)
   - Error rates by endpoint

2. **Business Metrics**:
   - URL creation rate
   - Click-through rate
   - Top domains and referrers

3. **Infrastructure Metrics**:
   - Database connection pool usage
   - Memory and CPU utilization
   - MongoDB replica set health

### Logging Strategy
```javascript
const winston = require('winston');
logger.info('URL shortened', { shortId, originalUrl, userId });
logger.error('Database error', { error, shortId });
```

## Trade-offs and Decisions

### 1. MongoDB vs. PostgreSQL
**Chosen**: MongoDB
**Reasoning**: Better horizontal scaling, flexible schema for analytics
**Trade-off**: Less complex query capabilities

### 2. Embedded vs. Separate Analytics
**Chosen**: Embedded referrer data
**Reasoning**: Simpler queries, better performance for basic analytics
**Trade-off**: Limited complex analytics capabilities

### 3. NanoID vs. Incremental IDs
**Chosen**: NanoID
**Reasoning**: Distributed generation, collision resistance
**Trade-off**: Slightly longer IDs than base conversion of integers

### 4. In-memory vs. Redis Rate Limiting
**Implementation**: In-memory (with Redis fallback option)
**Reasoning**: Simplicity for demonstration, easy Redis migration
**Trade-off**: Rate limits reset on restart

## Deployment Architecture

### Local Development
```bash
npm install
npm run dev
mongod --port 27017
```

### Production Deployment
```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGO_URI=mongodb://mongo:27017/urlshortener

  mongo:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
```

### High Availability Setup
- **Application**: Multiple instances behind load balancer
- **Database**: MongoDB replica set with 3+ nodes
- **Monitoring**: Health checks and automated failover

## Future Enhancements

### Short-term (3-6 months)
1. **Redis Integration**: Distributed caching and rate limiting
2. **Enhanced Analytics**: Geographic and time-based insights
3. **Admin Dashboard**: Web interface for URL management
4. **Bulk Operations**: API for batch URL creation

### Long-term (6-12 months)
1. **Custom Domains**: Allow users to use their own domains
2. **User Authentication**: Account-based URL management
3. **Link Expiration**: Time-based URL invalidation
4. **Advanced Analytics**: Machine learning insights

## Conclusion

This URL shortener service design balances simplicity with scalability, providing a solid foundation for handling high-traffic scenarios while maintaining extensibility for future enhancements. The choice of MongoDB and NanoID provides excellent scaling characteristics, while the modular architecture enables easy deployment and maintenance.

Key strengths of this design:
- **Proven scalability** with MongoDB sharding
- **Collision-free ID generation** with NanoID
- **Comprehensive analytics** with efficient storage
- **Production-ready** with proper error handling and monitoring

The system is designed to exceed the stated requirements of 1M+ active URLs and 10K+ requests/minute while providing room for future growth and feature additions.
