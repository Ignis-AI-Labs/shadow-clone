// Shadow Clone — Master Plan Template
// Source of truth: edit this file directly
export const content = `# MASTER PLAN TEMPLATE
*A comprehensive guide for creating effective project master plans with concrete examples*

<template_guidance>
This template provides structured guidance for creating master plans that Shadow Clone agents can effectively execute. Each section includes:
- Purpose and context
- Good vs bad examples
- Multiple variations for different project types
- Clear XML structure for agent parsing
</template_guidance>

## Executive Overview

<section_context>
The Executive Overview provides immediate clarity on project scope and complexity. This helps agents quickly understand what they're building and allocate resources appropriately.
</section_context>

<good_example>
**Objective**: Build a full-stack e-commerce platform with React frontend, Node.js backend, PostgreSQL database, and Stripe payment integration
**Estimated Timeline**: 3 weeks (15 working days)
**Total Waves**: 5 waves
**Risk Level**: Medium (payment integration and security requirements)
</good_example>

<bad_example>
**Objective**: Make an online store
**Estimated Timeline**: Soon
**Total Waves**: Several
**Risk Level**: Not sure
</bad_example>

### Alternative Examples by Project Type

<example type="mobile_app">
**Objective**: Develop a cross-platform fitness tracking mobile app using React Native with real-time sync, offline support, and wearable device integration
**Estimated Timeline**: 4 weeks (20 working days)
**Total Waves**: 6 waves
**Risk Level**: High (device integration complexity)
</example>

<example type="api_service">
**Objective**: Create a RESTful API microservice for user authentication with JWT tokens, rate limiting, and comprehensive audit logging
**Estimated Timeline**: 1 week (5 working days)
**Total Waves**: 3 waves
**Risk Level**: Low (well-understood patterns)
</example>

## Requirements Analysis

<section_context>
Requirements must be specific, measurable, and testable. Each requirement should clearly state WHO needs WHAT and WHY. Use user stories to maintain focus on actual user needs.
</section_context>

### Core Features

<good_example>
1. **User Authentication System**
   - User Story: As a customer, I want to create an account and securely log in so that I can save my shopping cart and order history
   - Acceptance Criteria: 
     * Users can register with email/password
     * Email verification required before first login
     * Password reset functionality via email
     * Session timeout after 30 minutes of inactivity
     * OAuth integration with Google and Facebook
   - Priority: Critical

2. **Product Catalog Management**
   - User Story: As a store administrator, I want to add, edit, and organize products so that customers can browse and purchase items
   - Acceptance Criteria:
     * CRUD operations for products with validation
     * Support for multiple product images (up to 10)
     * Category and tag management
     * Inventory tracking with low-stock alerts
     * Bulk import/export via CSV
   - Priority: Critical

3. **Shopping Cart & Checkout**
   - User Story: As a customer, I want to add items to my cart and complete purchases so that I can buy products online
   - Acceptance Criteria:
     * Persistent cart across sessions
     * Guest checkout option
     * Multiple payment methods (credit card, PayPal)
     * Order confirmation emails
     * PDF invoice generation
   - Priority: Critical
</good_example>

<bad_example>
1. **Login Feature**
   - User Story: Users should be able to log in
   - Acceptance Criteria: Login works
   - Priority: Important

2. **Products**
   - User Story: Need product management
   - Acceptance Criteria: Can add products
   - Priority: High
</bad_example>

### Technical Requirements

<good_example>
- **Performance**: 
  * Page load time < 3 seconds on 3G connection
  * API response time < 200ms for 95th percentile
  * Support 1000 concurrent users
  * Database query optimization (all queries < 100ms)
- **Security**: 
  * HTTPS everywhere with SSL/TLS 1.3
  * OWASP Top 10 compliance
  * PCI DSS compliance for payment processing
  * Data encryption at rest and in transit
  * Regular security audit logging
- **Scalability**: 
  * Horizontal scaling capability
  * Database read replicas
  * CDN for static assets
  * Caching strategy (Redis)
- **Integration**: 
  * Stripe Payment Gateway API v2023
  * SendGrid Email Service
  * Google Analytics 4
  * Sentry error tracking
</good_example>

## Technical Architecture

<section_context>
Architecture diagrams and technology choices must be specific and justified. Include version numbers and explain why each technology was chosen.
</section_context>

### System Design

<good_example>
\`\`\`
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React SPA    │────▶│  Node.js API    │────▶│  PostgreSQL     │
│   (Next.js)    │     │   (Express)     │     │   Database      │
└────────┬────────┘     └────────┬────────┘     └─────────────────┘
         │                       │                        │
         │                       ├──────┬─────────────────┤
         ▼                       ▼      ▼                 ▼
    Cloudflare CDN          Redis Cache  Stripe API   AWS S3 Storage
    
Additional Services:
- Nginx (Load Balancer)
- Docker containers
- Kubernetes orchestration
- Prometheus monitoring
\`\`\`
</good_example>

### Technology Stack

<good_example>
- **Frontend**: 
  * Framework: Next.js 14.0 (React 18.2)
  * State Management: Zustand 4.4
  * Styling: Tailwind CSS 3.3 + Shadcn/ui
  * Form Handling: React Hook Form 7.47
  * API Client: Axios 1.6 with interceptors
- **Backend**: 
  * Runtime: Node.js 20 LTS
  * Framework: Express.js 4.18
  * ORM: Prisma 5.6
  * Authentication: Passport.js + JWT
  * Validation: Joi 17.11
- **Database**: 
  * Primary: PostgreSQL 16
  * Cache: Redis 7.2
  * Search: Elasticsearch 8.11 (product search)
- **Infrastructure**: 
  * Cloud: AWS (EC2, RDS, S3, CloudFront)
  * Containers: Docker 24.0
  * Orchestration: Kubernetes 1.28
  * CI/CD: GitHub Actions + ArgoCD
- **Monitoring**: 
  * APM: Datadog
  * Logs: CloudWatch
  * Errors: Sentry
</good_example>

### Key Design Decisions

<good_example>
1. **Next.js over Create React App**: Server-side rendering improves SEO and initial page load performance, critical for e-commerce conversion rates

2. **PostgreSQL over MongoDB**: Strong ACID compliance needed for financial transactions, complex relationships between orders/products/users require relational model

3. **Microservices Architecture**: Separate services for authentication, catalog, orders, and payments enable independent scaling and deployment

4. **Event-Driven Communication**: Using message queues (RabbitMQ) between services ensures reliability and enables async processing for emails and notifications

5. **GraphQL Federation**: Unified API gateway simplifies frontend development while maintaining service boundaries
</good_example>

## Wave Execution Strategy

<section_context>
Waves should be self-contained units of work that deliver measurable value. Each wave builds upon the previous one. Include specific deliverables and success criteria.
</section_context>

### Wave 0: Discovery & Planning
<good_example>
**Duration**: 2 days
**Team Size**: 4 agents
**Objectives**:
- Validate all technical requirements with stakeholders
- Finalize API contract specifications
- Set up development infrastructure
- Create detailed database schema
- Prepare UI/UX mockups for critical flows

**Deliverables**:
- Complete API specification (OpenAPI 3.0)
- Database schema with migration scripts
- Infrastructure as Code (Terraform)
- Figma designs for all major screens
- Detailed test scenarios document
- Risk mitigation strategies

**Success Criteria**:
- All stakeholders approve API design
- Development environment accessible to all agents
- CI/CD pipeline functional
- Database migrations tested
</good_example>

### Wave 1: Foundation & Authentication
<good_example>
**Duration**: 3 days
**Team Size**: 7 agents
**Objectives**:
- Implement core backend architecture
- Build authentication system
- Create base UI components
- Establish testing framework

**Deliverables**:
- Express.js API with folder structure
- JWT authentication with refresh tokens
- User registration/login endpoints
- Base React components (Layout, Navigation)
- Jest/Cypress test suites
- Docker compose for local development

**Key Tasks by Agent**:
- Backend Lead: API structure, middleware, error handling
- Auth Developer: Passport.js integration, JWT implementation
- Frontend Lead: Next.js setup, routing, layout
- UI Developer: Component library, Storybook setup
- Database Developer: User schema, migrations
- DevOps: Docker setup, CI pipeline
- QA: Test framework, initial test cases

**Success Criteria**:
- Users can register and log in
- JWT tokens properly validated
- 80% unit test coverage
- All endpoints documented in Swagger
</good_example>

### Wave 2: Product Catalog
<good_example>
**Duration**: 4 days
**Team Size**: 8 agents
**Objectives**:
- Build complete product management system
- Implement search functionality
- Create product browsing UI
- Add image upload capability

**Deliverables**:
- Product CRUD API endpoints
- Category/tag management
- Elasticsearch integration
- Product listing pages
- Product detail pages
- Image upload to S3
- Admin product management UI

**Success Criteria**:
- Products searchable within 100ms
- Images optimized and served via CDN
- Pagination working correctly
- Admin can manage inventory
</good_example>

### Wave 3: Shopping Cart & Orders
<good_example>
**Duration**: 4 days
**Team Size**: 8 agents
**Objectives**:
- Implement shopping cart functionality
- Build order management system
- Create checkout flow
- Integrate payment processing

**Deliverables**:
- Cart API with session management
- Order processing pipeline
- Stripe payment integration
- Checkout UI with validation
- Order history and tracking
- Email notifications
- Invoice PDF generation

**Success Criteria**:
- Cart persists across sessions
- Payment processing < 3 seconds
- Orders correctly calculate tax/shipping
- Confirmation emails sent within 30 seconds
</good_example>

### Wave 4: Integration & Optimization
<good_example>
**Duration**: 2 days
**Team Size**: 6 agents
**Objectives**:
- Complete system integration
- Performance optimization
- Security hardening
- Load testing

**Deliverables**:
- Integrated end-to-end flows
- Performance optimizations
- Security audit fixes
- Load test results
- Monitoring dashboards
- Deployment scripts

**Success Criteria**:
- All features working together
- Page load < 3 seconds
- Passes security scan
- Handles 1000 concurrent users
</good_example>

## Resource Allocation

<section_context>
Resource allocation should reflect the complexity and dependencies of each wave. Show how team composition evolves as the project progresses.
</section_context>

<good_example>
### Team Composition
| Wave | Frontend | Backend | Database | DevOps | QA | Security | Total |
|------|----------|---------|----------|--------|----|-----------|----|
| 0    | 1        | 1       | 1        | 1      | 0  | 0         | 4  |
| 1    | 2        | 2       | 1        | 1      | 1  | 0         | 7  |
| 2    | 3        | 2       | 1        | 0      | 1  | 1         | 8  |
| 3    | 2        | 3       | 0        | 1      | 2  | 0         | 8  |
| 4    | 1        | 1       | 1        | 1      | 1  | 1         | 6  |

### Skill Requirements
- **Frontend**: React, Next.js, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, REST APIs, GraphQL
- **Database**: PostgreSQL, Redis, migrations, query optimization
- **DevOps**: Docker, Kubernetes, AWS, CI/CD
- **QA**: Jest, Cypress, load testing, security testing
- **Security**: OWASP, penetration testing, compliance
</good_example>

## Risk Analysis

<section_context>
Risks should be specific, measurable, and include concrete mitigation strategies. Consider technical, business, and external risks.
</section_context>

### Technical Risks
<good_example>
| Risk | Probability | Impact | Mitigation |
|------|-------------|---------|------------|
| Stripe API changes break integration | Medium | High | Version-lock API, implement adapter pattern, monitor changelog |
| Database performance degrades with scale | Medium | High | Implement caching layer, optimize queries, plan sharding strategy |
| Third-party service outage | Low | High | Implement circuit breakers, fallback mechanisms, multi-region deployment |
| Security vulnerability in dependencies | High | Medium | Automated dependency scanning, regular updates, security patches |
</good_example>

### Project Risks
<good_example>
| Risk | Probability | Impact | Mitigation |
|------|-------------|---------|------------|
| Scope creep from stakeholders | High | Medium | Document all changes, implement change control process, regular demos |
| Key agent unavailability | Medium | Medium | Knowledge sharing sessions, comprehensive documentation, pair programming |
| Integration complexity underestimated | Medium | High | Early spike on integrations, maintain integration tests, allocate buffer time |
| Performance requirements not met | Low | High | Early performance testing, progressive optimization, scalability planning |
</good_example>

## Success Metrics

<section_context>
Success metrics must be specific, measurable, and directly tied to project objectives. Include both technical and business metrics.
</section_context>

### Functional Success
<good_example>
- [x] All 47 user stories implemented and tested
- [x] 100% of acceptance criteria validated by QA
- [x] User acceptance testing completed with 95% satisfaction
- [x] All critical user journeys completable in < 5 clicks
- [x] Mobile responsive design works on all target devices
</good_example>

### Technical Success
<good_example>
- [x] Page load time < 3 seconds (achieved: 2.3s average)
- [x] API response time < 200ms for 95th percentile (achieved: 156ms)
- [x] Zero critical security vulnerabilities
- [x] Code coverage > 80% (achieved: 87%)
- [x] All endpoints documented with examples
- [x] Database queries optimized (all < 100ms)
- [x] System handles 1,500 concurrent users (target: 1,000)
</good_example>

### Project Success
<good_example>
- [x] Delivered within 15-day timeline (completed: day 14)
- [x] Stayed within resource allocation (33 agent-days used of 35 allocated)
- [x] Zero critical bugs in first week of production
- [x] Stakeholder satisfaction score: 4.8/5
- [x] Knowledge transfer completed with documentation
</good_example>

## Dependencies & Assumptions

<section_context>
Be explicit about what the project depends on and what assumptions are being made. This helps identify potential blockers early.
</section_context>

### Dependencies
<good_example>
**External Services**:
- Stripe API availability (99.99% SLA required)
- AWS services (EC2, RDS, S3) provisioned
- Domain name and SSL certificates ready
- SendGrid account with verified sender domain

**Internal Dependencies**:
- Brand assets and style guide finalized
- Product catalog data (minimum 100 products for launch)
- Legal compliance (Terms of Service, Privacy Policy)
- Payment processing merchant account approved
</good_example>

### Assumptions
<good_example>
**Technical Assumptions**:
- Users have modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- Mobile users on iOS 14+ or Android 10+
- Maximum product catalog size: 10,000 items
- Average order size: 3-5 items

**Business Assumptions**:
- Launch with single currency (USD) and country (US)
- Business hours support (not 24/7) initially
- Single warehouse location for shipping calculations
- Return policy limited to 30 days
</good_example>

## Communication Plan

<section_context>
Clear communication prevents misunderstandings and keeps stakeholders informed. Be specific about what, when, and how to communicate.
</section_context>

### Stakeholder Updates
<good_example>
**Daily Updates**:
- Format: Bullet points in CONSTITUTION.md
- Content: Completed tasks, blockers, next steps
- Example: "✓ Implemented user registration API ⚠️ Blocked on email service config → Working on login flow"

**Wave Completion Reports**:
- Format: Detailed markdown report
- Content: Deliverables completed, metrics achieved, issues encountered, lessons learned
- Distribution: Project channel + email to stakeholders

**Project Completion**:
- Executive summary (1 page)
- Technical documentation wiki
- Video walkthrough of key features
- Handover session with Q&A
</good_example>

### Escalation Path
<good_example>
1. **Technical Blockers** 
   - First 2 hours: Team attempts resolution
   - Next step: Escalate to Team Lead with proposed solutions
   - Final step: Architecture review if fundamental change needed

2. **Resource Issues**
   - Immediate: Notify Project Owner via urgent flag
   - Include: Impact assessment and mitigation options
   - Timeline: Resolution within 4 hours

3. **Scope Changes**
   - Document: Change request with impact analysis
   - Approval: Stakeholder sign-off required
   - Implementation: Only after written approval
</good_example>

## Appendices

<section_context>
Appendices contain detailed information that would clutter the main document but may be needed for reference.
</section_context>

### A. Detailed Technical Specifications
<good_example>
**API Endpoint Specifications**: [Link to OpenAPI spec]
- Base URL: https://api.example.com/v1
- Authentication: Bearer token in Authorization header
- Rate limiting: 100 requests per minute per user
- Pagination: Cursor-based with 50 items default

**Database Schema**: [Link to ERD diagram]
- 15 tables with defined relationships
- Indexing strategy documented
- Migration scripts in /migrations folder
</good_example>

### B. UI/UX Mockups
<good_example>
**Figma Designs**: [Link to Figma project]
- Desktop views: All 23 screens completed
- Mobile views: Responsive designs for key flows
- Component library: Reusable components defined
- Interaction prototypes: Checkout flow, product browse
</good_example>

### C. Database Schema
<good_example>
\`\`\`sql
-- Core tables structure
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    inventory_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_name ON products(name);
\`\`\`
</good_example>

### D. API Documentation
<good_example>
**Authentication Endpoints**:
\`\`\`
POST /auth/register
Body: { email, password, name }
Response: { user: { id, email, name }, token }

POST /auth/login  
Body: { email, password }
Response: { user: { id, email, name }, token, refreshToken }

POST /auth/refresh
Body: { refreshToken }
Response: { token, refreshToken }
\`\`\`

**Product Endpoints**:
\`\`\`
GET /products
Query: ?page=1&limit=20&category=electronics&sort=price_asc
Response: { products: [...], pagination: { ... } }

GET /products/:id
Response: { product: { id, sku, name, price, images, ... } }
\`\`\`
</good_example>

---

<template_footer>
*This MASTER PLAN serves as the definitive guide for project execution. Any changes must be approved and documented.*

**Template Usage Notes**:
- Replace all placeholder text with project-specific information
- Remove any sections not applicable to your project
- Add project-specific sections as needed
- Keep examples that help clarify requirements
- Update progress checkboxes as work completes
</template_footer>`;
