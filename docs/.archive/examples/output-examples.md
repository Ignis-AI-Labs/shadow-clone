# Output Examples

What Shadow Clone generates and where to find it.

## The .waves/ Directory

All Shadow Clone output goes to the `.waves/` directory (configurable).

```
.waves/
├── wave-0/                    # Planning phase
│   ├── PROJECT_FOUNDATION.md
│   ├── TECHNICAL_RESEARCH.md
│   └── MASTER_PLAN.md
├── wave-1/                    # First implementation wave
│   ├── WAVE_PLAN.md
│   ├── [generated files]
│   └── WAVE_COMPLETE.md
├── wave-2/                    # Second implementation wave
│   └── ...
├── wave-3/                    # Polish/testing wave
│   └── ...
└── WAVE_STATUS.md             # Overall progress tracker
```

---

## Wave 0: Planning Output

### PROJECT_FOUNDATION.md

Requirements analysis and project scope.

```markdown
# Project Foundation: User Authentication System

## Executive Summary
Implementation of a secure user authentication system with email/password
login, JWT tokens, and password recovery.

## Functional Requirements

### FR-1: User Registration
- Email address validation
- Password strength requirements (min 8 chars, mixed case, numbers)
- Email verification workflow
- Duplicate email prevention

### FR-2: User Login
- Email/password authentication
- JWT access token generation (15 min expiry)
- Refresh token generation (7 day expiry)
- Failed attempt tracking

### FR-3: Password Reset
- Reset request via email
- Secure token generation (1 hour expiry)
- One-time use tokens
- Password confirmation

### FR-4: Session Management
- Token refresh endpoint
- Logout (token invalidation)
- Multi-device session tracking

## Non-Functional Requirements

### Security
- bcrypt password hashing (cost factor 12)
- HTTPS required for all endpoints
- Rate limiting on auth endpoints
- CSRF protection

### Performance
- Auth operations < 200ms
- Token validation < 10ms

### Scalability
- Stateless JWT design
- Horizontal scaling ready

## Success Criteria
- [ ] All endpoints return correct status codes
- [ ] Password hashing verified secure
- [ ] Token expiry working correctly
- [ ] Email verification flow complete
- [ ] Rate limiting active
```

### TECHNICAL_RESEARCH.md

Technology decisions and best practices.

```markdown
# Technical Research: Authentication System

## JWT Token Strategy

### Recommendation: Dual Token Approach

**Access Token**
- Short-lived (15 minutes)
- Contains user ID and roles
- Sent in Authorization header

**Refresh Token**
- Long-lived (7 days)
- Stored in HTTP-only cookie
- Rotated on each use

### Why This Approach?
- Short access tokens limit exposure window
- Refresh rotation detects token theft
- HTTP-only cookies prevent XSS attacks

## Password Hashing

### Recommendation: bcrypt

```javascript
const SALT_ROUNDS = 12; // ~250ms on modern hardware
const hash = await bcrypt.hash(password, SALT_ROUNDS);
```

**Why bcrypt over alternatives:**
- Argon2: Better but less library support
- scrypt: Good but bcrypt more battle-tested
- PBKDF2: Slower, less secure than bcrypt

## Email Verification

### Token Generation
```javascript
const token = crypto.randomBytes(32).toString('hex');
const expiry = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
```

### Storage
- Store hashed token in database
- Include user_id and expiry
- Delete after use or expiry

## Rate Limiting Strategy

| Endpoint | Limit | Window |
|----------|-------|--------|
| POST /login | 5 | 15 min |
| POST /register | 3 | 1 hour |
| POST /password-reset | 3 | 1 hour |
| POST /refresh | 10 | 1 min |

## Database Schema

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  failed_attempts INT DEFAULT 0,
  locked_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  refresh_token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```
```

### MASTER_PLAN.md

Implementation roadmap.

```markdown
# Master Plan: Authentication System

## Overview
5-phase implementation building from database to documentation.

## Phase 1: Database & Models
**Goal**: Establish data layer

**Tasks**:
1. Create database migrations
2. Implement User model with validation
3. Implement Session model
4. Implement VerificationToken model
5. Add database connection pooling

**Deliverables**:
- `migrations/001_create_users.js`
- `migrations/002_create_sessions.js`
- `src/models/User.js`
- `src/models/Session.js`
- `src/config/database.js`

## Phase 2: Core Authentication
**Goal**: Basic login/register working

**Tasks**:
1. Create auth routes structure
2. Implement registration endpoint
3. Implement login endpoint
4. Add JWT token generation
5. Create auth middleware

**Deliverables**:
- `src/routes/auth.js`
- `src/controllers/authController.js`
- `src/services/authService.js`
- `src/services/tokenService.js`
- `src/middleware/auth.js`

## Phase 3: Email Verification
**Goal**: Email verification flow complete

**Tasks**:
1. Set up email service (nodemailer)
2. Create verification email template
3. Implement verify endpoint
4. Add resend verification endpoint

**Deliverables**:
- `src/services/emailService.js`
- `src/templates/verification.html`
- Verification endpoints in auth routes

## Phase 4: Password Reset
**Goal**: Password reset flow complete

**Tasks**:
1. Create password reset request endpoint
2. Create password reset email template
3. Implement reset confirmation endpoint
4. Add token expiry handling

**Deliverables**:
- Password reset endpoints
- `src/templates/password-reset.html`
- Token management updates

## Phase 5: Polish & Security
**Goal**: Production-ready

**Tasks**:
1. Add rate limiting middleware
2. Implement input validation (Joi)
3. Add security headers
4. Create unit tests
5. Create integration tests
6. Write API documentation

**Deliverables**:
- `src/middleware/rateLimiter.js`
- `src/validators/authValidator.js`
- `tests/unit/auth.test.js`
- `tests/integration/auth.test.js`
- `docs/API.md`

## Dependencies
```
Phase 1 ──► Phase 2 ──► Phase 3
                   └──► Phase 4
                            │
                            ▼
                       Phase 5
```

## Risk Mitigation
- **Email delivery issues**: Use established provider (SendGrid/SES)
- **Token security**: Use crypto.randomBytes, not Math.random
- **Timing attacks**: Use constant-time comparison for tokens
```

---

## Wave 1+: Implementation Output

### WAVE_PLAN.md

What this wave will accomplish.

```markdown
# Wave 1 Plan: Foundation

## Objective
Set up database schema, models, and core Express application structure.

## Agents Deployed

### Agent 1: Database Architect
**Focus**: Schema design and migrations
**Deliverables**:
- Migration files
- Database configuration

### Agent 2: Backend Engineer
**Focus**: Express app setup
**Deliverables**:
- App structure
- Model implementations

### Agent 3: Security Specialist
**Focus**: Security middleware
**Deliverables**:
- Auth middleware skeleton
- Rate limiter setup

## Files to Create
- src/config/database.js
- src/models/User.js
- src/models/Session.js
- src/models/VerificationToken.js
- src/middleware/auth.js
- src/middleware/rateLimiter.js
- src/app.js
- migrations/001_create_users.js
- migrations/002_create_sessions.js
- migrations/003_create_tokens.js

## Success Criteria
- [ ] Database connection working
- [ ] All models defined
- [ ] Migrations run successfully
- [ ] Express app starts
```

### WAVE_COMPLETE.md

Wave summary and status.

```markdown
# Wave 1 Complete

## Summary
Foundation wave completed successfully. Database schema, models, and
application structure are in place.

## Files Created

| File | Lines | Purpose |
|------|-------|---------|
| src/config/database.js | 45 | Database connection with pooling |
| src/models/User.js | 78 | User model with validation |
| src/models/Session.js | 42 | Session model for tokens |
| src/models/VerificationToken.js | 38 | Verification token model |
| src/middleware/auth.js | 35 | JWT verification middleware |
| src/middleware/rateLimiter.js | 28 | Rate limiting setup |
| src/app.js | 52 | Express application |
| migrations/001_create_users.js | 34 | Users table |
| migrations/002_create_sessions.js | 22 | Sessions table |
| migrations/003_create_tokens.js | 24 | Verification tokens table |

## Total: 10 files, 398 lines

## Verification
- ✅ Database connection tested
- ✅ Migrations run successfully
- ✅ Express app starts on port 3000
- ✅ Models correctly defined

## Next Wave
Wave 2 will implement core authentication endpoints:
- Registration
- Login
- Token refresh
```

---

## WAVE_STATUS.md

Overall project progress tracker.

```markdown
# Wave Execution Status

## Project: User Authentication System
**Started**: 2024-01-15 10:30:00
**Mode**: feature

---

## Wave Summary

| Wave | Phase | Status | Files | Lines |
|------|-------|--------|-------|-------|
| 0 | Planning | ✅ Complete | 3 | 450 |
| 1 | Foundation | ✅ Complete | 10 | 398 |
| 2 | Core Auth | ✅ Complete | 8 | 520 |
| 3 | Email & Reset | ✅ Complete | 6 | 340 |
| 4 | Testing | ✅ Complete | 5 | 680 |

---

## Deliverables

### Documentation (Wave 0)
- PROJECT_FOUNDATION.md - Requirements and scope
- TECHNICAL_RESEARCH.md - Technology decisions
- MASTER_PLAN.md - Implementation roadmap

### Database (Wave 1)
- 3 migration files
- 3 model files
- Database configuration

### API Endpoints (Wave 2)
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout

### Email Flows (Wave 3)
- Email verification endpoint
- Password reset request
- Password reset confirmation
- Email templates (2)

### Testing (Wave 4)
- Unit tests (12 tests)
- Integration tests (8 tests)
- 85% code coverage
- API documentation

---

## Metrics

**Total Files Created**: 32
**Total Lines of Code**: 2,388
**Test Coverage**: 85%
**API Endpoints**: 7

---

## File Tree

```
src/
├── config/
│   └── database.js
├── controllers/
│   └── authController.js
├── middleware/
│   ├── auth.js
│   ├── rateLimiter.js
│   └── validate.js
├── models/
│   ├── User.js
│   ├── Session.js
│   └── VerificationToken.js
├── routes/
│   └── auth.js
├── services/
│   ├── authService.js
│   ├── tokenService.js
│   └── emailService.js
├── templates/
│   ├── verification.html
│   └── password-reset.html
├── validators/
│   └── authValidator.js
└── app.js
migrations/
├── 001_create_users.js
├── 002_create_sessions.js
└── 003_create_tokens.js
tests/
├── unit/
│   ├── authService.test.js
│   └── tokenService.test.js
└── integration/
    └── auth.test.js
docs/
└── API.md
```

---

## Ready for Integration
All code is in `.waves/` directory. Copy to your project:

```bash
cp -r .waves/wave-*/src/* src/
cp -r .waves/wave-*/migrations/* migrations/
cp -r .waves/wave-*/tests/* tests/
```
```

---

## Sample Generated Code

Here's what actual generated code looks like:

### src/services/tokenService.js

```javascript
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

/**
 * Generate JWT access token
 */
function generateAccessToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      roles: user.roles || ['user']
    },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
}

/**
 * Generate secure refresh token
 */
function generateRefreshToken() {
  return crypto.randomBytes(64).toString('hex');
}

/**
 * Hash refresh token for storage
 */
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Verify access token
 */
function verifyAccessToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  verifyAccessToken,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY
};
```

### src/middleware/rateLimiter.js

```javascript
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: {
    error: 'Too many login attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts
  message: {
    error: 'Too many registration attempts, please try again later'
  }
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts
  message: {
    error: 'Too many password reset attempts, please try again later'
  }
});

module.exports = {
  authLimiter,
  registerLimiter,
  passwordResetLimiter
};
```

---

## Tips for Working with Output

### Review Before Copying

Always review generated code before integrating:

```bash
# Preview what will be copied
ls -la .waves/wave-*/src/

# Review a specific file
cat .waves/wave-2/src/services/authService.js
```

### Selective Integration

Copy only what you need:

```bash
# Just the services
cp .waves/wave-2/src/services/* src/services/

# Just the tests
cp -r .waves/wave-4/tests/* tests/
```

### Ask Claude to Integrate

```
Help me integrate the authentication code from .waves/ into my existing
Express app. My current structure uses:
- src/api/ instead of src/routes/
- src/lib/ instead of src/services/
- I already have a database.js in src/config/
```

---

## Related Examples

- [Build Feature Walkthrough](build-feature.md)
- [Wave System Concepts](../concepts/wave-system.md)
- [Tools Overview](../tools/overview.md)
