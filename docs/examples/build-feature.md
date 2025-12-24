# Example: Building a Feature

A complete walkthrough of building a user authentication system with Shadow Clone.

## The Goal

Build a complete authentication system with:
- User registration with email verification
- Login with JWT tokens
- Password reset flow
- Session management

## Step 1: Plan the Feature

First, create a plan to understand the scope.

**Your prompt:**
```
Use shadow_clone_plan to create a project plan:
- projectVision: "Build a user authentication system with:
  - Email/password registration with email verification
  - Login returning JWT access and refresh tokens
  - Password reset via email link
  - Session management with token refresh
  Tech: Node.js, Express, PostgreSQL, JWT, nodemailer"
```

**What happens:**

Claude receives planning instructions and simulates a planning team:
- Requirements Analyst breaks down the features
- Technical Researcher evaluates approaches
- Architect creates the implementation plan

**Output in `.waves/wave-0/`:**

```
PROJECT_FOUNDATION.md
├── Functional Requirements
│   ├── Registration: email, password, verification
│   ├── Login: credentials → JWT tokens
│   ├── Password Reset: email link, token expiry
│   └── Session: refresh tokens, logout
├── Non-Functional Requirements
│   ├── Security: bcrypt, rate limiting, HTTPS
│   ├── Performance: <200ms auth operations
│   └── Scalability: stateless JWT design
└── Success Criteria
    └── All endpoints tested, secure, documented
```

```
TECHNICAL_RESEARCH.md
├── JWT Strategy
│   ├── Access token: 15min expiry
│   ├── Refresh token: 7 day expiry, rotated
│   └── Storage: HTTP-only cookies
├── Password Hashing
│   └── bcrypt with cost factor 12
├── Email Service
│   └── nodemailer with SMTP
└── Database Schema
    └── users, sessions, verification_tokens tables
```

```
MASTER_PLAN.md
├── Phase 1: Database & Models
│   └── Create schema, user model, migrations
├── Phase 2: Registration
│   └── Signup endpoint, email verification
├── Phase 3: Login & Tokens
│   └── Login endpoint, JWT generation, refresh
├── Phase 4: Password Reset
│   └── Request reset, reset endpoint
└── Phase 5: Testing & Documentation
    └── Unit tests, integration tests, API docs
```

## Step 2: Review the Plan

Read through `MASTER_PLAN.md` and verify it matches your expectations.

**Adjustments?** Add them to your next prompt.

## Step 3: Build the Feature

**Your prompt:**
```
Use shadow_clone_orchestrate to build this feature:
- mode: "feature"
- projectDescription: "Implement the authentication system as planned in .waves/wave-0/MASTER_PLAN.md.

Additional requirements:
- Use Express.js 4.x
- PostgreSQL with Sequelize ORM
- Follow REST conventions
- Include input validation with Joi
- Add rate limiting on auth endpoints"
```

**What happens:**

Claude receives orchestration instructions and simulates development teams across multiple waves.

### Wave 1: Foundation

**Deployed agents:**
- Database Architect - Creates schema and migrations
- Backend Engineer - Sets up Express app structure
- Security Specialist - Configures security middleware

**Output:**
```
.waves/wave-1/
├── WAVE_PLAN.md
├── src/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Session.js
│   │   └── VerificationToken.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── rateLimiter.js
│   └── app.js
├── migrations/
│   └── 001_create_users.js
└── WAVE_COMPLETE.md
```

### Wave 2: Core Implementation

**Deployed agents:**
- API Designer - Creates endpoint structure
- Backend Engineer - Implements business logic
- Security Specialist - Adds authentication logic

**Output:**
```
.waves/wave-2/
├── WAVE_PLAN.md
├── src/
│   ├── routes/
│   │   └── auth.js
│   ├── controllers/
│   │   └── authController.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── tokenService.js
│   │   └── emailService.js
│   └── validators/
│       └── authValidator.js
└── WAVE_COMPLETE.md
```

### Wave 3: Polish

**Deployed agents:**
- Test Engineer - Creates test suite
- Documentation Writer - Creates API docs
- Code Reviewer - Final review

**Output:**
```
.waves/wave-3/
├── WAVE_PLAN.md
├── tests/
│   ├── unit/
│   │   ├── authService.test.js
│   │   └── tokenService.test.js
│   └── integration/
│       └── auth.test.js
├── docs/
│   └── API.md
└── WAVE_COMPLETE.md
```

## Step 4: Review the Output

Check `WAVE_STATUS.md` for overall progress:

```markdown
# Wave Execution Status

## Project: User Authentication System

## Completed Waves
- Wave 0: Planning ✅ (3 docs)
- Wave 1: Foundation ✅ (8 files)
- Wave 2: Implementation ✅ (7 files)
- Wave 3: Polish ✅ (5 files)

## Deliverables Summary
- Database schema with 3 tables
- 4 API endpoints (register, login, refresh, reset)
- JWT token management
- Email verification flow
- Password reset flow
- Unit tests (85% coverage)
- Integration tests
- API documentation

## Files Created: 23
## Total Lines: ~1,200
```

## Step 5: Integrate the Code

Copy the generated code to your project:

```bash
# Copy source files
cp -r .waves/wave-1/src/* src/
cp -r .waves/wave-2/src/* src/
cp -r .waves/wave-3/tests/* tests/

# Copy migrations
cp -r .waves/wave-1/migrations/* migrations/

# Copy documentation
cp .waves/wave-3/docs/API.md docs/
```

Or ask Claude to help integrate:

```
Help me integrate the authentication code from .waves/ into my existing Express app at src/. My app already has a src/routes/index.js and uses a different folder structure.
```

## Sample Generated Code

Here's what some of the generated code might look like:

**src/services/authService.js**
```javascript
const bcrypt = require('bcrypt');
const { User, VerificationToken } = require('../models');
const tokenService = require('./tokenService');
const emailService = require('./emailService');

const SALT_ROUNDS = 12;

async function register(email, password) {
  // Check if user exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Create user
  const user = await User.create({
    email,
    passwordHash,
    isVerified: false
  });

  // Generate verification token
  const verificationToken = await VerificationToken.create({
    userId: user.id,
    token: tokenService.generateRandomToken(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  });

  // Send verification email
  await emailService.sendVerificationEmail(email, verificationToken.token);

  return { userId: user.id, message: 'Verification email sent' };
}

// ... more methods
```

## Tips for This Example

### Specify Your Tech Stack

The example specified Node.js, Express, PostgreSQL. This ensures consistent code.

### Reference the Plan

Using `projectDescription` to reference `MASTER_PLAN.md` keeps implementation aligned with planning.

### Add Constraints

Adding requirements like "Joi validation" and "rate limiting" ensures they're included.

### Review Each Wave

Check wave outputs before proceeding. You can give feedback to adjust course.

---

## Related Examples

- [Debugging Workflow](debug-session.md)
- [Security Audit](security-audit.md)
- [Output Examples](output-examples.md)
