# Architecture & System Design Protocol

**Protocol:** `ASD-PROTOCOL-v1.0`
**Suite:** Ignis AI Labs Open-Source Protocol Suite
**Scope:** Universal, language-agnostic architectural standards for production software systems
**Severity levels:** `[CRITICAL]` deployment blocker · `[HIGH]` must fix before release · `[MEDIUM]` fix within sprint · `[LOW]` advisory
**Status markers:** `[ ]` not verified · `[x]` passing · `[!]` failing · `[~]` partial · `[N/A]` not applicable

---

This protocol establishes auditable, enforceable standards across 14 architectural domains — from clean architecture and DDD to blockchain, AI systems, and observability. **Every checklist item is concrete enough for pass/fail verification**, with specific metrics, thresholds, and tool references where applicable. The protocol assumes a modular monolith as the default starting architecture and treats microservice extraction as an optimization requiring explicit justification. Teams should apply domain-specific sections based on their system's technology stack and mark inapplicable sections as `[N/A]`.

---

## 1. Architectural pattern selection and enforcement

Selecting an architectural pattern is a foundational decision that shapes every subsequent design choice. The three dominant patterns — Clean Architecture, Hexagonal/Ports & Adapters, and Vertical Slice — serve different contexts but share one invariant: **dependencies must point inward toward the domain core**. Robert C. Martin's dependency rule, Alistair Cockburn's port isolation principle (formalized in his April 2024 book with Juan Manuel Garrido de Paz), and Jimmy Bogard's slice independence all enforce variants of this constraint.

### Pattern selection checklist

| # | Item | Severity |
|---|------|----------|
| `ARC-01` | `[ ]` Architecture pattern is explicitly selected and documented in an ADR with justification based on team size, domain complexity, and deployment requirements | `[CRITICAL]` |
| `ARC-02` | `[ ]` **Source code dependencies point inward at every boundary crossing** — domain/entity layer has zero dependencies on infrastructure, frameworks, or outer layers | `[CRITICAL]` |
| `ARC-03` | `[ ]` Architecture fitness tests (ArchUnit for Java, NetArchTest for .NET, ts-arch for TypeScript, Dependency Cruiser for JS) enforce dependency rules in CI pipeline | `[HIGH]` |
| `ARC-04` | `[ ]` No framework annotations (JPA, ASP.NET attributes, ORM decorators) exist in the domain/entity layer | `[HIGH]` |
| `ARC-05` | `[ ]` Interfaces (ports) are defined in inner layers; implementations reside in outer layers | `[HIGH]` |
| `ARC-06` | `[ ]` Data crossing boundaries uses simple DTOs — domain entities never leak to outer layers or API responses | `[HIGH]` |
| `ARC-07` | `[ ]` Zero circular dependencies between architectural layers or modules (verified by ArchUnit `slices().should().beFreeOfCycles()` or equivalent) | `[CRITICAL]` |
| `ARC-08` | `[ ]` Cross-cutting concerns (logging, auth, transactions) are implemented in outer layers or via pipeline behaviors, not embedded in domain logic | `[MEDIUM]` |
| `ARC-09` | `[ ]` Layer dependency violations count: **0 allowed** in CI quality gate | `[CRITICAL]` |
| `ARC-10` | `[ ]` Each use case / command handler is a single class with a single public method (SRP enforcement) | `[MEDIUM]` |

**Pattern selection criteria:**

| Factor | Clean Architecture | Hexagonal/Ports & Adapters | Vertical Slice |
|--------|-------------------|---------------------------|----------------|
| Best for | Complex domains, long-lived systems | Many I/O integrations, adapter swapping | Feature-heavy, rapid delivery |
| Team size | Any; especially 10+ developers | Any | Experienced cross-functional teams |
| DDD alignment | Strong | Strong | Moderate |
| Over-engineering risk | High | Medium | Low (inconsistency risk instead) |

**Anti-patterns to detect:** Leaky abstractions (inner layers referencing outer types), layer bypassing (controller accessing repository directly), anemic domain model (entities with only getters/setters), framework coupling in domain core, over-engineering (interface-to-implementation ratio > 1.5:1 for simple CRUD).

---

## 2. Domain-Driven Design

DDD provides the strategic and tactical tools for modeling complex business domains. Strategic DDD establishes bounded context boundaries and inter-context relationships; tactical DDD governs aggregate design, entity behavior, and domain event patterns. **Vaughn Vernon's four rules of aggregate design** remain the authoritative standard: model true invariants in consistency boundaries, design small aggregates, reference other aggregates by identity only, and use eventual consistency outside the boundary.

### Strategic DDD checklist

| # | Item | Severity |
|---|------|----------|
| `DDD-01` | `[ ]` Each bounded context is explicitly identified and documented in a context map | `[CRITICAL]` |
| `DDD-02` | `[ ]` Each bounded context has a documented ubiquitous language glossary validated by domain experts | `[HIGH]` |
| `DDD-03` | `[ ]` Context map shows all relationships with relationship type labeled (Shared Kernel, ACL, Conformist, Open-Host Service, Customer-Supplier, Partnership, Published Language) | `[HIGH]` |
| `DDD-04` | `[ ]` Each bounded context is owned by exactly one team | `[HIGH]` |
| `DDD-05` | `[ ]` Each bounded context has its own data model/schema — no shared database tables across BC boundaries | `[CRITICAL]` |
| `DDD-06` | `[ ]` Anti-Corruption Layers exist at legacy and external system integration boundaries | `[HIGH]` |
| `DDD-07` | `[ ]` Integration between bounded contexts uses published contracts (APIs, events, Published Language) — never shared internal types | `[CRITICAL]` |
| `DDD-08` | `[ ]` Domain experts were consulted during domain modeling sessions (Event Storming or equivalent) | `[MEDIUM]` |

### Tactical DDD checklist

| # | Item | Severity |
|---|------|----------|
| `DDD-09` | `[ ]` Each aggregate has a clearly identified Aggregate Root with behavior methods enforcing invariants | `[CRITICAL]` |
| `DDD-10` | `[ ]` **Aggregates are small**: Root Entity + minimal children; no unbounded collections (`0..*`). Target ≤ 3–5 child entities | `[HIGH]` |
| `DDD-11` | `[ ]` References to other aggregates use ID only — no direct object references or ORM navigation properties between aggregate roots | `[HIGH]` |
| `DDD-12` | `[ ]` Only one aggregate is modified per transaction; cross-aggregate consistency uses eventual consistency via domain events | `[CRITICAL]` |
| `DDD-13` | `[ ]` Domain entities have behavior methods — ratio of behavior methods to properties > 1:1 (non-anemic domain model) | `[HIGH]` |
| `DDD-14` | `[ ]` Value Objects used wherever identity is not needed (Money, Address, Email, DateRange) — immutable with value-based equality | `[MEDIUM]` |
| `DDD-15` | `[ ]` Domain events named in past tense reflecting business intent (`OrderPlaced`, `PaymentReceived`) | `[MEDIUM]` |
| `DDD-16` | `[ ]` Domain events dispatched by Application Services after transaction commit (Event Collection Pattern) | `[HIGH]` |
| `DDD-17` | `[ ]` Domain event handlers are idempotent | `[HIGH]` |
| `DDD-18` | `[ ]` Repository interfaces exist per Aggregate Root only — defined in domain layer, implemented in infrastructure layer | `[HIGH]` |
| `DDD-19` | `[ ]` Application services are thin orchestrators containing no business logic — only coordination, transaction management, DTO mapping | `[MEDIUM]` |
| `DDD-20` | `[ ]` No primitive obsession: domain concepts use typed wrappers (strongly-typed IDs, Email type, Money type) instead of raw strings/ints | `[LOW]` |

**Common violations:** Anemic domain model (all logic in services), God aggregates (>5–7 entities, unbounded collections, >100ms load time), cross-aggregate transactions, leaking domain logic into controllers/application services, skipping strategic DDD (no context map), exposing domain entities directly as API responses.

---

## 3. Service boundaries and decomposition

The industry consensus in 2024–2025 is clear: **start with a modular monolith** (Shopify model) and extract microservices only when specific, measurable criteria are met. This position is supported by Sam Newman, Chris Richardson, and Kelsey Hightower. Team Topologies (Skelton & Pais) provides the organizational lens: each stream-aligned team of **5–9 members** should own **1–3 services maximum** to manage cognitive load.

### Service boundary checklist

| # | Item | Severity |
|---|------|----------|
| `SVC-01` | `[ ]` **Default architecture is modular monolith** unless microservice extraction criteria are documented and met | `[CRITICAL]` |
| `SVC-02` | `[ ]` Each module/service has an explicit public API surface; no direct cross-module database queries | `[CRITICAL]` |
| `SVC-03` | `[ ]` Module boundaries are enforced via automated architecture fitness tests in CI | `[HIGH]` |
| `SVC-04` | `[ ]` Each proposed microservice has a documented business justification mapping to extraction criteria | `[CRITICAL]` |
| `SVC-05` | `[ ]` Every service is owned by exactly one team; each team owns ≤ 3 services | `[HIGH]` |
| `SVC-06` | `[ ]` Team size is 5–9 people (Dunbar sub-group) | `[MEDIUM]` |
| `SVC-07` | `[ ]` Organizational structure reviewed against target architecture (Inverse Conway Maneuver documented) | `[MEDIUM]` |
| `SVC-08` | `[ ]` Cross-team dependencies: < 2 blocking dependencies per team per sprint | `[HIGH]` |
| `SVC-09` | `[ ]` Services decomposed by domain/business capability — never by technical layer | `[HIGH]` |
| `SVC-10` | `[ ]` Migration from monolith uses strangler fig or branch-by-abstraction pattern — no big-bang rewrites | `[CRITICAL]` |

**Microservice extraction is justified when:** independent deployment frequency needed (10× faster than siblings), independent scaling required (10–100× compute difference), regulatory data isolation mandated (PCI/GDPR), technology heterogeneity genuinely beneficial, or fault isolation required. **Do not extract if:** team < 10 engineers, domain boundaries unclear, no CI/CD maturity, or most requests touch 5+ services (distributed monolith signal).

**Metrics:** Deployment independence ≥ 80% of deployments require no coordination. Inter-service synchronous calls per request ≤ 3. Service coupling < 20% of changes require multi-service deployment.

**Anti-patterns:** Distributed monolith (lock-step deployments, shared DB, >3 synchronous call chains), nano-services (<500 LOC, single CRUD, always co-deployed), shared database between services, chatty microservices (>5 inter-service calls per user request).

---

## 4. API contract design

A production-grade API contract is the single most important interface for system interoperability. The industry has converged on **Richardson Maturity Level 2 as the minimum baseline** for REST APIs, **URI path versioning** as the dominant strategy (used by Google, Twitter, Airbnb), and **contract-first design** with OpenAPI as the non-negotiable standard. Stripe's idempotency key pattern, date-based versioning, and backward compatibility discipline set the gold standard.

### API design checklist

| # | Item | Severity |
|---|------|----------|
| `API-01` | `[ ]` Every API has an OpenAPI 3.x specification committed to source control, **written before implementation** (contract-first) | `[CRITICAL]` |
| `API-02` | `[ ]` All APIs target Richardson Maturity Level 2 minimum (proper resources + HTTP verbs + status codes) | `[HIGH]` |
| `API-03` | `[ ]` API versioning strategy selected, documented, and consistently applied (URI path `/v1/` recommended) | `[CRITICAL]` |
| `API-04` | `[ ]` **All POST endpoints that create resources or trigger side effects accept `Idempotency-Key` header** | `[CRITICAL]` |
| `API-05` | `[ ]` Error responses follow a consistent error contract across all APIs (e.g., `{error: {code, message, details}}`) | `[HIGH]` |
| `API-06` | `[ ]` Spectral or equivalent API linter runs in CI pipeline on every PR — zero errors allowed | `[HIGH]` |
| `API-07` | `[ ]` Breaking changes go through formal deprecation: announce → coexist (minimum 6–12 months) → sunset (return 410 Gone) | `[HIGH]` |
| `API-08` | `[ ]` Non-breaking changes are additive only (new optional fields, new endpoints) | `[HIGH]` |
| `API-09` | `[ ]` Contract tests (Pact, Schemathesis) run in CI to detect unintentional breaking changes | `[HIGH]` |
| `API-10` | `[ ]` All API inputs validated at boundary against OpenAPI schema before processing | `[CRITICAL]` |
| `API-11` | `[ ]` Pagination strategy defined (cursor-based preferred) — no unbounded list endpoints | `[HIGH]` |
| `API-12` | `[ ]` Rate limiting configured per client/API key with documented limits; 429 returned with `Retry-After` header | `[HIGH]` |
| `API-13` | `[ ]` All external APIs require authentication (OAuth 2.0 or API keys); internal service APIs use mTLS or JWT | `[CRITICAL]` |
| `API-14` | `[ ]` Time values use ISO-8601 in UTC across all APIs | `[MEDIUM]` |
| `API-15` | `[ ]` gRPC used for internal high-throughput service-to-service communication where justified; `.proto` files versioned in schema registry | `[MEDIUM]` |
| `API-16` | `[ ]` Event-driven APIs have AsyncAPI 3.x specifications | `[MEDIUM]` |
| `API-17` | `[ ]` GraphQL endpoints (if used) implement DataLoader, query depth limit ≤ 10, complexity score limit, and persisted queries in production | `[HIGH]` |

**HTTP method semantics:** GET (safe, idempotent), POST (create/action, not idempotent), PUT (full replace, idempotent), PATCH (partial update), DELETE (remove, idempotent). POST responses must include `Location` header.

**Anti-patterns:** Chatty APIs (>5 calls per user operation), exposing internal data model in API (API mirrors DB schema), inconsistent naming (mixed camelCase/snake_case), God endpoint (single POST /api with action parameter), missing pagination on list endpoints.

---

## 5. Dependency inversion and injection patterns

The Dependency Inversion Principle is the structural backbone of testable, maintainable architecture. Per Robert C. Martin: **high-level modules must not depend on low-level modules; both should depend on abstractions**. Mark Seemann's work (Manning, 2nd ed.) establishes constructor injection as the default, the Composition Root as the single wiring point, and Service Locator as a definitive anti-pattern.

### Dependency management checklist

| # | Item | Severity |
|---|------|----------|
| `DEP-01` | `[ ]` **All cross-layer dependencies point inward**; domain packages have zero references to infrastructure packages | `[CRITICAL]` |
| `DEP-02` | `[ ]` Constructor injection is the default DI pattern; property injection used only for optional dependencies with sensible defaults | `[HIGH]` |
| `DEP-03` | `[ ]` Composition Root exists at application entry point; **no DI container references (`GetService()`, `container.Resolve()`) outside Composition Root** | `[CRITICAL]` |
| `DEP-04` | `[ ]` Zero Service Locator usage in business/domain logic | `[CRITICAL]` |
| `DEP-05` | `[ ]` No Ambient Context access (`HttpContext.Current`, `DateTime.Now`, static service access) in business logic | `[HIGH]` |
| `DEP-06` | `[ ]` No Control Freak pattern (`new ConcreteService()` for volatile dependencies in business logic) | `[HIGH]` |
| `DEP-07` | `[ ]` Constructor parameters ≤ 7 per class (prefer ≤ 4); use Facade Service refactoring above threshold | `[MEDIUM]` |
| `DEP-08` | `[ ]` Zero circular dependencies between packages/modules/assemblies | `[CRITICAL]` |
| `DEP-09` | `[ ]` Dependency graph depth (NDepend Level metric) ≤ 6 for any component | `[LOW]` |
| `DEP-10` | `[ ]` Efferent coupling (Ce) at type level ≤ 50 | `[MEDIUM]` |
| `DEP-11` | `[ ]` No captive dependency (singleton capturing scoped/transient service); lifetime mismatches analyzed | `[HIGH]` |

**Additional DI anti-patterns:** Bastard Injection (dual constructors with default concrete and injected abstract), Constrained Construction (reflection-based instantiation forcing specific signatures), Hidden Dependencies (dependencies not visible from public API).

---

## 6. Coupling and cohesion metrics

Robert C. Martin's package principles provide quantitative measures for architectural health. **Distance from Main Sequence (D) is the single most important composite metric** — it reveals packages trapped in the Zone of Pain (rigid, concrete foundations) or the Zone of Uselessness (unused abstractions). These metrics should be computed automatically in CI and tracked as trends.

### Metrics and thresholds

| Metric | Formula | Pass | Warning | Fail |
|--------|---------|------|---------|------|
| Distance from Main Sequence (D) | \|A + I - 1\| | ≤ 0.1 | 0.1–0.3 | > 0.3 |
| Instability (I) | Ce / (Ca + Ce) | Context-dependent | I ≈ 0 with A ≈ 0 (Zone of Pain) | — |
| Abstractness (A) | Na / Nc | Correlates inversely with I | A ≈ 0 for stable pkg | — |
| LCOM-HS | Henderson-Sellers | ≤ 1.0 | — | > 1.0 (with >10 fields AND >10 methods) |
| Relational Cohesion (H) | (R + 1) / N | 1.5–4.0 | < 1.5 or > 4.0 | — |
| Efferent Coupling (Ce, type level) | Count of external types used | ≤ 20 | 20–50 | > 50 |
| Cyclomatic Complexity | Independent paths | ≤ 15 | 15–30 | > 30 |
| Depth of Inheritance (DIT) | Levels | ≤ 5 | — | ≥ 6 |

### Coupling metrics checklist

| # | Item | Severity |
|---|------|----------|
| `CPL-01` | `[ ]` **Distance from Main Sequence (D) ≤ 0.3 for all packages/assemblies** | `[HIGH]` |
| `CPL-02` | `[ ]` No packages in Zone of Pain (I < 0.2 AND A < 0.2) | `[MEDIUM]` |
| `CPL-03` | `[ ]` No packages in Zone of Uselessness (I > 0.8 AND A > 0.8) | `[LOW]` |
| `CPL-04` | `[ ]` Stable packages (I < 0.3) have Abstractness A > 0.5 | `[MEDIUM]` |
| `CPL-05` | `[ ]` Zero package dependency cycles | `[CRITICAL]` |
| `CPL-06` | `[ ]` Coupling metrics (Ca, Ce, I, A, D) computed and tracked via NDepend/JDepend/ArchUnitTS in CI | `[HIGH]` |
| `CPL-07` | `[ ]` SonarQube Quality Gate enforced: coverage ≥ 80% on new code, duplication < 3%, zero critical bugs | `[HIGH]` |
| `CPL-08` | `[ ]` God packages identified and refactored (NbTypes > 50 AND Ce > 30) | `[MEDIUM]` |

**Tools:** NDepend (.NET, most comprehensive — computes all Martin metrics), JDepend (Java), ArchUnit (Java/TypeScript — `slices().should().beFreeOfCycles()`), SonarQube (multi-language, requires plugins for LCOM/CBO), Structure101 (visual dependency graphs), Madge (JavaScript circular deps).

---

## 7. Scalability patterns

Scalable systems are designed, not discovered. The scaling ladder should be followed in order: **vertical scaling → read replicas → indexing/query optimization → partitioning → sharding**. Premature microservice extraction or sharding is one of the most expensive anti-patterns in production systems.

### Scalability checklist

| # | Item | Severity |
|---|------|----------|
| `SCL-01` | `[ ]` **Services are stateless**: all session/state externalized to Redis/DynamoDB; zero in-memory affinity | `[CRITICAL]` |
| `SCL-02` | `[ ]` Horizontal scale test passes: scaling from N to 2N instances yields linear throughput increase (±10%) with zero errors | `[HIGH]` |
| `SCL-03` | `[ ]` All internal queues have explicit max size — no unbounded queues | `[CRITICAL]` |
| `SCL-04` | `[ ]` Services return `429 Too Many Requests` with `Retry-After` header when overloaded | `[HIGH]` |
| `SCL-05` | `[ ]` Load shedding priority tiers defined: Tier 1 (critical: auth, checkout) always served; Tier 3 (analytics, recommendations) shed first | `[HIGH]` |
| `SCL-06` | `[ ]` **TTL set on ALL cache entries** — no indefinite cache entries without explicit write-through management | `[CRITICAL]` |
| `SCL-07` | `[ ]` Cache hit ratio monitored: target > 90%; investigate if < 80% | `[HIGH]` |
| `SCL-08` | `[ ]` Thundering herd protection: locking/coalescing on cache miss; staggered TTLs (±10% randomness) | `[HIGH]` |
| `SCL-09` | `[ ]` Graceful degradation on cache failure: application falls back to DB | `[HIGH]` |
| `SCL-10` | `[ ]` Event-driven pattern selection documented: Event Notification (thin, ≤3 consumers), Event-Carried State Transfer (consumer autonomy), or Event Sourcing (audit/compliance) | `[MEDIUM]` |
| `SCL-11` | `[ ]` CQRS justified with documented read/write ratio > 10:1 and max read lag SLO (< 500ms interactive, < 5s analytics) | `[MEDIUM]` |

**Database scaling thresholds:** Read replica replication lag: alert at > 1s, route to primary at > 5s, investigate at > 10s. Shard key requirements: high cardinality, ≥ 90% query alignment, no shard holds > 2× average data volume, not monotonically increasing. Connection pool utilization: alert at > 80%.

**Caching TTL guidelines:** Static config 5–15 min, user profiles 30–60 min, product catalog 1–24 hr, search results 5 min, session data 30 min, rapidly changing data 5–30 sec, null cache (non-existent keys) 60–300 sec.

---

## 8. Resilience patterns

Production systems fail. The question is whether failures cascade or are contained. Michael Nygard's *Release It!* remains the foundational text: **every call to an external system must have a timeout**, every integration point needs a circuit breaker, and bulkheads prevent a single failure from exhausting shared resources.

### Resilience checklist

| # | Item | Severity |
|---|------|----------|
| `RES-01` | `[ ]` **Every outbound call has an explicit timeout** (connection timeout: 1–3s; read timeout: p99 + 50% buffer) | `[CRITICAL]` |
| `RES-02` | `[ ]` Circuit breaker configured per downstream service (never shared across backends) with fallback for open state | `[CRITICAL]` |
| `RES-03` | `[ ]` Retry uses exponential backoff + **full jitter** (`sleep = random(0, min(cap, base × 2^attempt))`); max retries capped at 3–5 | `[CRITICAL]` |
| `RES-04` | `[ ]` Non-retryable errors (4xx except 429, validation, permission) fail fast without retry | `[HIGH]` |
| `RES-05` | `[ ]` Bulkhead isolation: separate bulkhead per critical downstream; sized based on peak RPS × p99 latency + 10–20% buffer | `[HIGH]` |
| `RES-06` | `[ ]` Timeout budget propagated through call chain (hop2 budget = total budget – hop1 duration) | `[HIGH]` |
| `RES-07` | `[ ]` Feature flags enable disabling non-critical features in < 1 minute without deployment | `[HIGH]` |
| `RES-08` | `[ ]` DLQ configured for every message queue; monitored with alert when depth > 0; reviewed within 24 hours | `[HIGH]` |
| `RES-09` | `[ ]` All message consumers are idempotent (deduplication ID or inbox table pattern) | `[CRITICAL]` |
| `RES-10` | `[ ]` Chaos engineering: steady state hypothesis defined with measurable metrics; experiments run regularly (weekly minimum in staging) | `[MEDIUM]` |

**Circuit breaker configuration (resilience4j reference):** `failureRateThreshold` 25–50%, `slowCallDurationThreshold` 2–5s (p99 + buffer), `slidingWindowSize` 10–100 calls or 30–60s time-based, `minimumNumberOfCalls` 5–20, `waitDurationInOpenState` 10–60s, `permittedNumberOfCallsInHalfOpenState` 3–10.

### Health check checklist

| # | Item | Severity |
|---|------|----------|
| `RES-11` | `[ ]` **Liveness probe checks only process health** (deadlock detection, lightweight `/healthz`) — never checks external dependencies | `[CRITICAL]` |
| `RES-12` | `[ ]` Readiness probe verifies dependency availability (`/ready` checks DB, cache, critical downstream) | `[HIGH]` |
| `RES-13` | `[ ]` Startup probe configured for slow-starting applications (`failureThreshold × periodSeconds` ≥ max startup time) | `[HIGH]` |
| `RES-14` | `[ ]` Liveness and readiness use separate endpoints with different logic | `[HIGH]` |
| `RES-15` | `[ ]` Probe configuration: `failureThreshold ≥ 3`, `periodSeconds ≥ 10` for liveness (prevents cascading restarts under load) | `[HIGH]` |

**Anti-patterns:** Retry storms (#1 cause of turning partial failures into full outages per AWS), cascading failures from missing circuit breakers, health checks that lie (liveness checking external DB), unbounded result sets, dogpile/thundering herd on cache expiry, blocked threads from missing timeouts.

---

## 9. Data architecture

Data architecture decisions are among the most expensive to reverse. Martin Kleppmann's *Designing Data-Intensive Applications* provides the conceptual framework, but the key operational principle is **every data entity has a single owner service** — no shared databases between services. Database selection must be evidence-based (ADR with benchmarks), not habitual.

### Data architecture checklist

| # | Item | Severity |
|---|------|----------|
| `DAT-01` | `[ ]` Database type matches primary access pattern, documented in ADR with benchmarks against production-representative data | `[CRITICAL]` |
| `DAT-02` | `[ ]` **Every data entity has a single owner service** — no shared databases between services | `[CRITICAL]` |
| `DAT-03` | `[ ]` No distributed transactions (2PC) across service boundaries; Saga pattern with compensation logic used instead | `[CRITICAL]` |
| `DAT-04` | `[ ]` Transactional outbox used for event publishing (events written in same DB transaction as business data) | `[HIGH]` |
| `DAT-05` | `[ ]` All event consumers are idempotent (inbox table or deduplication mechanism) | `[CRITICAL]` |
| `DAT-06` | `[ ]` CDC lag (Debezium) monitored: alert at > 30 seconds | `[HIGH]` |
| `DAT-07` | `[ ]` All schema changes version-controlled in migration files; no manual DDL in production | `[CRITICAL]` |
| `DAT-08` | `[ ]` Breaking schema changes use expand/contract pattern (no direct column renames/drops in single migration) | `[HIGH]` |
| `DAT-09` | `[ ]` Migrations tested with production-scale data volumes; lock duration monitored (no `ACCESS EXCLUSIVE` locks > 1 second) | `[HIGH]` |
| `DAT-10` | `[ ]` Indexes created concurrently (`CREATE INDEX CONCURRENTLY` for PostgreSQL) | `[HIGH]` |
| `DAT-11` | `[ ]` Every query has a `LIMIT`; API responses paginated (max 100–1000 items per page) | `[HIGH]` |
| `DAT-12` | `[ ]` N+1 query detection: total queries per API request < 10; pattern of > 5 similar sequential queries is flagged | `[HIGH]` |

**Database selection criteria:** Relational (ACID, complex joins, referential integrity → PostgreSQL), Document (flexible schema, denormalized, read-heavy), Graph (relationship-heavy, >5 relations/node), Time-series (append-heavy, time-range queries), Vector (AI embeddings, similarity search — pgvector for <5M vectors, dedicated DB above), Key-value (sub-millisecond lookups, caching).

**Event sourcing standards (when used):** Events are immutable, append-only. Events contain minimum data (payload < 10KB typical). Sequence numbers enforce optimistic concurrency (unique constraint on aggregateId + sequenceNumber). Snapshots every 100–500 events. CQRS materialized views serve all queries. GDPR compliance addressed (event anonymization/deletion policy).

**Multi-tenancy:** Shared schema (tenant_id + RLS) for B2C/cost-sensitive, schema-per-tenant for moderate isolation, database-per-tenant for enterprise compliance. All queries must filter by tenant_id. Per-tenant resource limits configured for noisy neighbor prevention.

**Metrics:** OLTP query latency p99 < 10ms (indexed), cache hit ratio > 95%, replication lag < 1s, CDC lag < 1s normal operation, connection pool utilization < 80%, vector search latency p99 < 50ms (sub-10M vectors), vector recall > 95%.

---

## 10. Blockchain-specific architecture (EVM-focused)

Smart contract architecture is uniquely unforgiving — deployed code is immutable, storage layout errors are permanent, and oracle manipulation is the #2 attack vector ($52M across 37 incidents in 2024). Access control vulnerabilities caused **$953.2M in losses in 2024** (OWASP Smart Contract Top 10 2026). This section covers proxy patterns, oracle integration, gas optimization, and MEV protection.

### Upgrade pattern checklist

| # | Item | Severity |
|---|------|----------|
| `BC-01` | `[ ]` Proxy pattern selection documented in ADR (UUPS recommended by OpenZeppelin 2024+; Diamond/EIP-2535 for >24KB contracts) | `[CRITICAL]` |
| `BC-02` | `[ ]` **Implementation contract has `_disableInitializers()` in constructor** (prevents hostile initialization — Wormhole $10M bounty vulnerability) | `[CRITICAL]` |
| `BC-03` | `[ ]` Storage layout compatibility verified between upgrade versions using OpenZeppelin Upgrades Plugin or Foundry equivalent | `[CRITICAL]` |
| `BC-04` | `[ ]` All upgradeable contracts use **EIP-7201 namespaced storage** (OZ v5+) or properly sized `__gap` arrays (OZ v4); never reorder, remove, or change type of existing storage variables | `[CRITICAL]` |
| `BC-05` | `[ ]` Upgrade function protected by multisig + **TimelockController with ≥ 48 hour delay** | `[CRITICAL]` |
| `BC-06` | `[ ]` UUPS: implementation inherits `UUPSUpgradeable` and overrides `_authorizeUpgrade` with access control; ERC-1822 compliance check active | `[CRITICAL]` |
| `BC-07` | `[ ]` Diamond: function selector collision detection during facet registration; DiamondLoupe deployed for introspection | `[HIGH]` |

### Oracle and security checklist

| # | Item | Severity |
|---|------|----------|
| `BC-08` | `[ ]` **No DEX spot prices used for critical operations** — use Chainlink Data Feeds or TWAP with 30+ minute window | `[CRITICAL]` |
| `BC-09` | `[ ]` Staleness check on every oracle read (max acceptable age defined per feed); revert if stale | `[CRITICAL]` |
| `BC-10` | `[ ]` Price deviation circuit breaker at defined threshold (10–20%) | `[HIGH]` |
| `BC-11` | `[ ]` L2 sequencer uptime feed checked before using price data (for L2 deployments) | `[HIGH]` |
| `BC-12` | `[ ]` Fallback oracle configured if primary feed fails | `[HIGH]` |
| `BC-13` | `[ ]` Flash loan resistance tested (protocol behavior verified under unlimited capital scenario) | `[CRITICAL]` |
| `BC-14` | `[ ]` AccessControl or Ownable2Step for all privileged functions; `msg.sender` used (never `tx.origin`) | `[CRITICAL]` |
| `BC-15` | `[ ]` CEI pattern (Checks-Effects-Interactions) + `ReentrancyGuard` on every function with external calls and state changes | `[CRITICAL]` |
| `BC-16` | `[ ]` Pausable implemented with designated pauser role; pause possible without timelock delay | `[HIGH]` |
| `BC-17` | `[ ]` Multi-sig (Safe/Gnosis) for all admin functions: 2-of-3 (<$1M TVL), 3-of-5 ($1M–$10M), 4-of-7 ($10M–$100M), 5-of-9+ (>$100M) | `[CRITICAL]` |
| `BC-18` | `[ ]` Professional security audit completed before mainnet; bug bounty program active | `[CRITICAL]` |

### Gas optimization and MEV

| # | Item | Severity |
|---|------|----------|
| `BC-19` | `[ ]` Storage packing used (multiple variables per 32-byte slot); structs ordered by size | `[HIGH]` |
| `BC-20` | `[ ]` EIP-1153 transient storage used for reentrancy guards and single-transaction flags (Solidity ≥ 0.8.28: `transient` keyword) | `[MEDIUM]` |
| `BC-21` | `[ ]` `immutable`/`constant` used for values set once; custom errors instead of `require` strings | `[MEDIUM]` |
| `BC-22` | `[ ]` Protocol enforces slippage and deadline parameters on all swaps | `[HIGH]` |
| `BC-23` | `[ ]` UI defaults to private RPCs (Flashbots Protect) for MEV protection | `[HIGH]` |
| `BC-24` | `[ ]` Chainlink VRF migrated to v2.5 (v1/v2 deprecated November 2024) | `[HIGH]` |
| `BC-25` | `[ ]` Pragma version locked (not floating); SafeERC20 used for all token interactions | `[CRITICAL]` |

**Emerging standards (2024–2025):** ERC-4337 account abstraction (100M+ UserOperations, 20M smart accounts deployed), EIP-7702 (EOA delegation via Pectra upgrade, May 2025), EIP-4844 blob transactions (90% L2 fee reduction), ERC-6900 modular accounts.

---

## 11. AI system architecture

AI systems in 2024–2025 require architectural rigor comparable to traditional distributed systems — but with unique challenges around non-determinism, cost management, and safety. **RAG pipelines dominate 51% of enterprise AI implementations**, and the shift from "prompt engineering" to "context engineering" (Anthropic, 2025) reflects the maturation of this field. Every AI system needs guardrails, evaluation, and observability as first-class architectural components.

### RAG pipeline checklist

| # | Item | Severity |
|---|------|----------|
| `AI-01` | `[ ]` Chunking strategy selected based on content type (not one-size-fits-all): optimal **512–1024 tokens** with 10–20% overlap | `[HIGH]` |
| `AI-02` | `[ ]` **Hybrid search implemented** (dense vector + sparse BM25 with reciprocal rank fusion) | `[HIGH]` |
| `AI-03` | `[ ]` Multi-stage retrieval pipeline: broad retrieval (top-100) → cross-encoder reranking → top-k selection (5–10) | `[HIGH]` |
| `AI-04` | `[ ]` Metadata attached to every chunk (source document, section, page, timestamp) | `[HIGH]` |
| `AI-05` | `[ ]` Embedding model versioned; refresh strategy documented for model changes or data drift | `[MEDIUM]` |
| `AI-06` | `[ ]` **RAGAS or equivalent evaluation integrated**: Faithfulness ≥ 0.85, Answer Relevancy ≥ 0.80, Context Precision ≥ 0.75, Context Recall ≥ 0.80 | `[HIGH]` |
| `AI-07` | `[ ]` Query retrieval latency < 100ms for production systems | `[MEDIUM]` |

### Agent and inference checklist

| # | Item | Severity |
|---|------|----------|
| `AI-08` | `[ ]` Agent orchestration pattern selected and documented: ReAct (single-agent tool use), Plan-and-Execute (task decomposition), or multi-agent with supervisor | `[HIGH]` |
| `AI-09` | `[ ]` Tool schemas defined with clear descriptions, parameter types, and return types; all tool calls logged | `[HIGH]` |
| `AI-10` | `[ ]` **Memory architecture includes at minimum short-term and long-term memory** with documented consolidation strategy | `[MEDIUM]` |
| `AI-11` | `[ ]` Model routing strategy defined: cascade pattern (small model first, escalate on low confidence) for **30–60% cost savings** | `[HIGH]` |
| `AI-12` | `[ ]` Continuous/in-flight batching for self-hosted inference (vLLM PagedAttention: up to 23× throughput) | `[HIGH]` |
| `AI-13` | `[ ]` Semantic caching evaluated: similarity threshold 0.8 yields 68.8% cache hit rate with >97% accuracy | `[MEDIUM]` |

### Guardrail and safety checklist

| # | Item | Severity |
|---|------|----------|
| `AI-14` | `[ ]` **Three-layer guardrail architecture**: pre-processing (input validation, prompt injection detection), in-processing (safety context injection), post-processing (PII detection, toxicity filtering, schema validation) | `[CRITICAL]` |
| `AI-15` | `[ ]` System prompt isolated from user input; canary tokens detect prompt leakage | `[CRITICAL]` |
| `AI-16` | `[ ]` Input sanitization: strip control characters, normalize whitespace, length/complexity constraints enforced | `[HIGH]` |
| `AI-17` | `[ ]` PII detection/redaction on all outputs (regex + ML-based) | `[CRITICAL]` |
| `AI-18` | `[ ]` Hallucination detection via separate verifier model or grounding checks | `[HIGH]` |

### Human-in-the-loop and evaluation

| # | Item | Severity |
|---|------|----------|
| `AI-19` | `[ ]` Approval gates defined for high-risk/irreversible agent actions; confidence threshold for escalation (typically 85%) | `[HIGH]` |
| `AI-20` | `[ ]` Target escalation rate: 10–15% (sustainable human review); alert if > 20% | `[MEDIUM]` |
| `AI-21` | `[ ]` System prompts version-controlled in Git; prompt evaluation framework with A/B testing | `[HIGH]` |
| `AI-22` | `[ ]` **End-to-end tracing** captures every step: prompts, tool calls, intermediate outputs, latency, token usage (LangSmith, Phoenix, Langfuse, or OpenTelemetry-based) | `[CRITICAL]` |
| `AI-23` | `[ ]` Per-request cost tracked (input + output tokens × model price); cost dashboards with budget threshold alerts | `[HIGH]` |
| `AI-24` | `[ ]` Embedding drift and output quality metrics tracked over time for regression detection | `[MEDIUM]` |

**Anti-patterns:** Naive chunking (fixed splits breaking mid-sentence), no reranking, stale embeddings, monolithic memory store, relying only on model alignment without runtime guardrails, single-layer defense, no tracing in production, static evaluations only, no cost tracking.

---

## 12. Observability architecture

Observability is the ability to ask novel questions about system behavior without deploying new code. The **OpenTelemetry standard** unifies traces, metrics, and logs with correlation, and the **Four Golden Signals** (Google SRE) — Latency, Traffic, Errors, Saturation — define what to measure. SLO-based alerting reduces alert volume by ~85% compared to threshold-based approaches.

### OpenTelemetry checklist

| # | Item | Severity |
|---|------|----------|
| `OBS-01` | `[ ]` All services emit traces, metrics, AND structured logs via OpenTelemetry SDKs or auto-instrumentation | `[CRITICAL]` |
| `OBS-02` | `[ ]` **Logs include `trace_id` and `span_id` fields** for correlation with traces | `[CRITICAL]` |
| `OBS-03` | `[ ]` W3C Trace Context (`traceparent` header) propagated across all service boundaries | `[CRITICAL]` |
| `OBS-04` | `[ ]` Resource attributes set: `service.name`, `service.version`, `deployment.environment` — consistent across all signals | `[HIGH]` |
| `OBS-05` | `[ ]` Span names parameterized (`GET /users/{id}` not `GET /users/12345`) — no high-cardinality values in span names | `[HIGH]` |
| `OBS-06` | `[ ]` OTel Collector deployed in production (never send telemetry directly from apps to backend); `memory_limiter` and `batch` processors configured | `[HIGH]` |
| `OBS-07` | `[ ]` Tail-based sampling: error traces sampled at 100%; normal traces sampled at configured rate (1–10% production) | `[HIGH]` |
| `OBS-08` | `[ ]` Metrics generated BEFORE sampling (ensures accurate RED metrics regardless of sample rate) | `[CRITICAL]` |

### Structured logging checklist

| # | Item | Severity |
|---|------|----------|
| `OBS-09` | `[ ]` **All services output JSON structured logs** (not plain text) — written to `stdout` for containerized environments | `[CRITICAL]` |
| `OBS-10` | `[ ]` Every log entry contains: `timestamp` (ISO-8601 UTC), `level`, `message`, `service`, `trace_id` (when in trace context) | `[CRITICAL]` |
| `OBS-11` | `[ ]` Production default log level: `INFO`; configurable at runtime without redeployment | `[HIGH]` |
| `OBS-12` | `[ ]` Correlation ID generated at API gateway, propagated via `X-Correlation-ID` header, injected into all log entries | `[HIGH]` |
| `OBS-13` | `[ ]` **Never log**: passwords, tokens, API keys, credit cards, SSNs. PII scrubbing via OTel Collector filter processors | `[CRITICAL]` |

### Metrics and SLO checklist

| # | Item | Severity |
|---|------|----------|
| `OBS-14` | `[ ]` Every request-driven service exposes RED metrics (Rate, Errors, Duration) | `[CRITICAL]` |
| `OBS-15` | `[ ]` Every infrastructure resource has USE metrics (Utilization, Saturation, Errors) | `[HIGH]` |
| `OBS-16` | `[ ]` **Histograms used for latency** (not summaries — cannot aggregate quantiles across instances); bucket boundaries aligned with SLO thresholds | `[HIGH]` |
| `OBS-17` | `[ ]` Metric labels are low-cardinality only — never use user_id, request_id, email, IP as labels | `[CRITICAL]` |
| `OBS-18` | `[ ]` 2–3 SLIs defined per service measuring user-facing experience; SLO targets based on historical baselines | `[HIGH]` |
| `OBS-19` | `[ ]` Error budget tracked: burn rate alerting configured (14.4× = critical page, 6× = warning, 1× = ticket) | `[HIGH]` |

### Alerting checklist

| # | Item | Severity |
|---|------|----------|
| `OBS-20` | `[ ]` **SLO-based alerting preferred over threshold-based**; symptom-based (user-facing errors) over cause-based (CPU high) | `[HIGH]` |
| `OBS-21` | `[ ]` Every alert has a corresponding runbook (linked in alert annotation) with what/check/investigate/remediate/escalate sections | `[CRITICAL]` |
| `OBS-22` | `[ ]` Only P1/P2 alerts page on-call engineers outside business hours; target < 5 actionable alerts per on-call shift | `[HIGH]` |
| `OBS-23` | `[ ]` Alert deduplication, grouping, and inhibition configured to prevent cascading alert storms | `[HIGH]` |
| `OBS-24` | `[ ]` Signal-to-noise ratio > 80% actionable alerts; false positive rate < 20% | `[MEDIUM]` |
| `OBS-25` | `[ ]` All dashboards defined as code (Grafana Terraform provider or equivalent), stored in Git, deployed via CI/CD | `[MEDIUM]` |

**Severity tiers:** P1/SEV-1 (service down, 5-min ack SLA, 24/7 page), P2/SEV-2 (significant degradation, 15-min ack, business hours page), P3/SEV-3 (minor, 4-hr response, ticket), P4/SEV-4 (cosmetic, next sprint, ticket only).

---

## 13. Infrastructure as Code

Infrastructure drift is not a risk — it is a certainty: **67% of teams experience significant drift** (Env0 2024). The antidote is declarative, version-controlled infrastructure with policy-as-code enforcement and automated testing. Terraform commands ~76% market share (CNCF 2024), with Pulumi growing at 45% YoY among developer-heavy teams.

### Terraform/IaC checklist

| # | Item | Severity |
|---|------|----------|
| `IAC-01` | `[ ]` **Remote backend configured with state locking** (S3 + DynamoDB for AWS; GCS for GCP) — never local state in production | `[CRITICAL]` |
| `IAC-02` | `[ ]` State file never committed to version control; encrypted at rest; IAM access restricted | `[CRITICAL]` |
| `IAC-03` | `[ ]` Separate state files per environment (dev/staging/prod) | `[HIGH]` |
| `IAC-04` | `[ ]` Modules versioned with semantic versioning; pinned sources (no unpinned `main` branch) | `[HIGH]` |
| `IAC-05` | `[ ]` Static analysis (validate + lint + security scan via Checkov/tfsec) runs on every PR | `[HIGH]` |
| `IAC-06` | `[ ]` Plans/applies run through CI/CD with policy-as-code enforcement — not from local machines | `[CRITICAL]` |
| `IAC-07` | `[ ]` Drift detection via scheduled `terraform plan` runs; alerts configured | `[HIGH]` |
| `IAC-08` | `[ ]` No secrets in Terraform code or state; secrets referenced via external managers (Vault, AWS Secrets Manager) | `[CRITICAL]` |

### GitOps checklist

| # | Item | Severity |
|---|------|----------|
| `IAC-09` | `[ ]` Git is single source of truth for all declarative infrastructure; pull-based deployment (agent pulls, no CI push credentials) | `[CRITICAL]` |
| `IAC-10` | `[ ]` Source code repo separated from GitOps manifest repo | `[HIGH]` |
| `IAC-11` | `[ ]` Environments modeled using directories (not branches): `environments/dev/`, `environments/staging/`, `environments/prod/` | `[HIGH]` |
| `IAC-12` | `[ ]` **No plaintext secrets in Git** — External Secrets Operator (recommended for production) or Sealed Secrets (small teams) | `[CRITICAL]` |
| `IAC-13` | `[ ]` Progressive delivery configured: canary with automated metric analysis or blue-green with rollback | `[MEDIUM]` |

### Kubernetes security and operations

| # | Item | Severity |
|---|------|----------|
| `IAC-14` | `[ ]` **All containers: `runAsNonRoot: true`, `readOnlyRootFilesystem: true`, `allowPrivilegeEscalation: false`, `capabilities.drop: ["ALL"]`, `seccompProfile.type: RuntimeDefault`** | `[CRITICAL]` |
| `IAC-15` | `[ ]` All containers have explicit resource requests AND limits for CPU and memory | `[HIGH]` |
| `IAC-16` | `[ ]` Default deny-all network policy per namespace with explicit allow rules | `[CRITICAL]` |
| `IAC-17` | `[ ]` PodDisruptionBudgets configured for all production workloads (`minAvailable: 1` or `maxUnavailable: 1`) | `[HIGH]` |
| `IAC-18` | `[ ]` HPA configured for stateless workloads: `targetCPU` 70–80%, `minReplicas ≥ 2` for HA; KEDA for event-driven scaling | `[HIGH]` |
| `IAC-19` | `[ ]` Pod anti-affinity spreads replicas across nodes/zones | `[HIGH]` |
| `IAC-20` | `[ ]` At least one policy engine deployed as admission controller (Kyverno or OPA/Gatekeeper) enforcing: no `:latest` tags, required labels, resource limits, non-root, no privileged | `[HIGH]` |

**Anti-patterns:** ClickOps (manual console changes), snowflake servers, missing state locking (concurrent applies corrupt state), hardcoded values, mega-modules (>500 lines), secrets in state, no PDBs, CPU-only HPA, overly aggressive liveness probes causing cascading restarts.

---

## 14. Architecture Decision Records

ADRs capture the **"why" behind architectural decisions** — the one artifact that survives team turnover and prevents repeated debates. The MADR v4.0.0 format (released September 2024) provides the standard template. The rule of thumb: **any decision that is costly to reverse or affects multiple teams requires an ADR**.

### ADR checklist

| # | Item | Severity |
|---|------|----------|
| `ADR-01` | `[ ]` ADR required for: technology selection, architecture pattern changes, API design decisions, infrastructure changes, integration patterns, data storage decisions | `[CRITICAL]` |
| `ADR-02` | `[ ]` ADR format follows MADR v4.0.0: Context/Problem Statement → Decision Drivers → Considered Options (minimum 2) → Decision Outcome with justification → Consequences (positive AND negative) | `[HIGH]` |
| `ADR-03` | `[ ]` **ADR captures the "why"** not just the "what" — decision drivers and trade-offs explicitly documented | `[HIGH]` |
| `ADR-04` | `[ ]` ADR is concise: 1–2 pages maximum | `[MEDIUM]` |
| `ADR-05` | `[ ]` ADRs stored in repository: `docs/decisions/NNNN-title-with-dashes.md` | `[HIGH]` |
| `ADR-06` | `[ ]` ADR status lifecycle maintained: Proposed → Accepted → Deprecated/Superseded | `[MEDIUM]` |
| `ADR-07` | `[ ]` ADR created as PR for team review; status changes from `proposed` to `accepted` upon merge | `[MEDIUM]` |
| `ADR-08` | `[ ]` Confirmation section specifies how compliance will be validated (code review, ArchUnit test, metric threshold) | `[MEDIUM]` |
| `ADR-09` | `[ ]` Superseded ADRs link to their replacements; context map of related ADRs maintained | `[LOW]` |
| `ADR-10` | `[ ]` PR template includes checkbox: "Does this change require an ADR?" | `[LOW]` |

**MADR v4.0.0 YAML front matter:**
```yaml
---
status: "{proposed | accepted | deprecated | superseded by ADR-NNNN}"
date: {YYYY-MM-DD}
decision-makers: {list}
consulted: {list}
informed: {list}
---
```

**Good ADR indicators:** Captures alternatives considered, includes trade-offs and consequences, links to related ADRs, states decision outcome as "Chosen option: X, because Y." **Bad ADR indicators:** Written after the fact as paperwork, missing options, no consequences, > 3 pages, only documents "what" without "why."

---

## Conclusion

This protocol operationalizes architectural excellence through **145+ concrete, auditable checklist items** spanning the full stack from domain modeling to infrastructure operations. Three principles unify all 14 domains. First, **dependencies flow inward** — whether enforcing Clean Architecture's dependency rule, DDD's aggregate boundaries, or infrastructure's least-privilege security contexts. Second, **defaults are conservative** — modular monolith before microservices, constructor injection before alternatives, deny-all before explicit allows, contract-first before implementation. Third, **everything measurable is measured** — Distance from Main Sequence ≤ 0.3, circuit breaker failure rates at 25–50%, RAGAS faithfulness ≥ 0.85, replication lag < 1 second, SLO error budgets with multi-burn-rate alerting.

The most impactful items for immediate adoption are architecture fitness tests in CI (`ARC-03`), the modular monolith default (`SVC-01`), explicit timeouts on every outbound call (`RES-01`), structured JSON logging with trace correlation (`OBS-09/10`), and mandatory ADRs for irreversible decisions (`ADR-01`). Teams new to this protocol should begin by marking all items as `[ ]` not verified, assess applicability (mark `[N/A]` for unused technology domains), then prioritize `[CRITICAL]` items for the first sprint of adoption. Track compliance percentage as a leading indicator of architectural health — target 100% on `[CRITICAL]` items and ≥ 90% on `[HIGH]` items before production release.