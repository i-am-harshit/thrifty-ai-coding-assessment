# URL Shortener Service

A scalable, distributed URL shortener service built with Node.js, Express.js, and MongoDB. Features analytics, rate limiting, and horizontal scaling capabilities.

## Features

- **URL Shortening**: Convert long URLs to short, memorable links
- **Analytics**: Track click counts, referrers, and access patterns
- **Scalable**: Built for horizontal scaling with MongoDB sharding
- **Rate Limited**: Prevent abuse with configurable rate limiting
- **Persistent**: Data survives server restarts
- **Collision-Free**: Unique short IDs using nanoid
- **High Performance**: Optimized for 10K+ requests/min

## API Endpoints

### POST /shorten

Create a new short URL.

**Request :**

```json
{
  "url": "https://www.example.com/very/long/url"
}
```

**Response :**

```json
{
  "shortUrl": "http://localhost:3000/Ab12cDef",
  "shortId": "Ab12cDef",
  "originalUrl": "https://www.example.com/very/long/url",
  "createdAt": "2025-10-10T12:00:00.000Z"
}
```

### GET /:shortId

Redirect to the original URL and track analytics.

**Response:** HTTP 301 redirect to original URL

### GET /stats/:shortId

Get analytics for a short URL.

**Response :**

```json
{
  "shortId": "Ab12cDef",
  "originalUrl": "https://www.example.com/very/long/url",
  "clickCount": 42,
  "lastAccessed": "2025-10-10T12:30:00.000Z",
  "topReferrers": [
    { "domain": "google.com", "count": 15 },
    { "domain": "twitter.com", "count": 10 },
    { "domain": "direct", "count": 17 }
  ],
  "createdAt": "2025-10-10T12:00:00.000Z",
  "totalReferrers": 5
}
```

## Quick Start

### Prerequisites

- Node.js (v14+)
- MongoDB (v4.4+)
- npm or yarn

### Installation

1. **Clone the repository :**

   ```bash
   git clone <repository-url>
   cd url-shortener-service
   ```

2. **Install dependencies :**

   ```bash
   npm install
   ```

3. **Configure environment :**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration.

4. **Start MongoDB :**

   ```bash
   # Ubuntu/Debian
   sudo systemctl start mongod

   # macOS with Homebrew
   brew services start mongodb/brew/mongodb-community

   # Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

5. **Run the application:**

   ```bash
   # Production
   npm start

   # Development with auto-reload
   npm run dev
   ```

6. **Test the API:**
   ```bash
   curl -X POST http://localhost:3000/shorten \
     -H "Content-Type: application/json" \
     -d '{"url":"https://www.example.com"}'
   ```

## Configuration

### Environment Variables

| Variable    | Description               | Default                                  |
| ----------- | ------------------------- | ---------------------------------------- |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/urlshortener` |
| `BASE_URL`  | Base URL for short links  | `http://localhost:3000`                  |
| `PORT`      | Server port               | `3000`                                   |
| `NODE_ENV`  | Environment mode          | `development`                            |

### Rate Limiting

Default: 10 requests per minute per IP address.
Customize in `app.js`:

```javascript
const rateLimiter = new RateLimiterMemory({
  points: 10, // Number of requests
  duration: 60, // Per duration in seconds
});
```

## Database Schema

### URL Collection

```javascript
{
  shortId: String,        // Unique 8-character identifier
  originalUrl: String,    // Original long URL
  clickCount: Number,     // Total clicks
  lastAccessed: Date,     // Last access timestamp
  referrers: Map,         // Domain -> count mapping
  createdAt: Date,        // Creation timestamp
  shardKey: String        // Sharding key (first 2 chars of shortId)
}
```

### Indexes

- `shortId`: Unique index for fast lookups
- `createdAt`: For time-based queries
- `shardKey`: For horizontal sharding

## Scaling Considerations

### Horizontal Scaling

1. **MongoDB Sharding**: Use `shardKey` field for distribution
2. **Load Balancing**: Deploy multiple app instances behind a load balancer
3. **Distributed Rate Limiting**: Use Redis for shared rate limiting

### Performance Optimization

1. **Caching**: Implement Redis for hot URLs
2. **CDN**: Use CDN for redirect endpoints
3. **Connection Pooling**: MongoDB connection pooling enabled
4. **Indexes**: Optimized database indexes for fast queries

### Example Scaling Setup

```bash
# Multiple app instances
PORT=3001 node app.js &
PORT=3002 node app.js &
PORT=3003 node app.js &

# MongoDB replica set
mongod --replSet rs0 --port 27017 --dbpath /data/db1
mongod --replSet rs0 --port 27018 --dbpath /data/db2
mongod --replSet rs0 --port 27019 --dbpath /data/db3
```

## API Testing

### Using cURL

```bash
# Create short URL
curl -X POST http://localhost:3000/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.google.com"}'

# Access short URL (redirect)
curl -I http://localhost:3000/Ab12cDef

# Get statistics
curl http://localhost:3000/stats/Ab12cDef
```

### Using Postman

Import the provided `postman-collection.json` file for ready-to-use API tests.

## Development

### Project Structure

```
url-shortener-service/
├── app.js              # Main application file
├── models/             # Mongoose models
│   └── Url.js          # URL model
├── routes/             # Express routes
│   └── api.js          # API endpoints
├── migrations/         # Database migrations
│   └── init.js         # Initialize database
├── package.json        # Dependencies and scripts
├── .env.example        # Environment variables template
└── README.md           # This file
```

### Running Tests

```bash
npm test
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**

   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity

2. **Rate Limit Errors:**

   - Reduce request frequency
   - Adjust rate limit settings in `app.js`

3. **Short ID Collisions:**
   - Extremely rare with 8-character nanoid
   - Automatic retry mechanism handles collisions

### Logs

Application logs are written to console. For production, consider using a logging service:

```javascript
const winston = require("winston");
```

## Security Considerations

- Input validation for URLs
- Rate limiting to prevent abuse
- Environment variable protection
- MongoDB injection prevention
- CORS configuration for production

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions, please open a GitHub issue or contact the development team.
