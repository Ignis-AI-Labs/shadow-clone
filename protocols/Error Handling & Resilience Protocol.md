# Error Handling & Resilience Protocol

**Version:** 1.0 · **Status:** Production · **Last Updated:** 2026-04-13
**Scope:** System-level resilience architecture and operational error management for distributed systems.
**Prerequisite protocols:** Code Quality (basic error handling), Functional Programming (Result types, typed errors).

> **Bottom Line Up Front:** Production systems fail — the difference between a minor blip and a catastrophic outage lies in how failures are anticipated, contained, and recovered from. This protocol codifies the resilience patterns used by Google SRE, Netflix, AWS, and Stripe into enforceable checklist items with specific numeric thresholds. Every external dependency must have a circuit breaker, every retry must use exponential backoff with jitter, every timeout must be explicitly set and propagated, and every alert must be tied to a runbook. These are not suggestions — items marked **[CRITICAL]** are deployment blockers.

**Severity levels:** `[CRITICAL]` = deployment blocker · `[HIGH]` = must fix before release · `[MEDIUM]` = fix within sprint · `[LOW]` = advisory
**Status markers:** `[ ]` not verified · `[x]` passing · `[!]` failing · `[~]` partial · `[N/A]` not applicable

---

## 1. Error classification taxonomy

A consistent error taxonomy is the foundation of every resilience pattern that follows. Without correct classification, retries target the wrong errors, circuit breakers trip on validation failures, and alerts fire on noise.

### 1.1 Three-class error taxonomy

All errors MUST be classified into exactly one of three categories. This classification drives every downstream decision — retryability, alerting severity, propagation behavior, and user-facing messaging.

| Category | Definition | HTTP Codes | gRPC Codes | Retryable? | User-visible? |
|---|---|---|---|---|---|
| **Domain errors** | Business rule violations, expected edge cases | 400, 402, 404, 409, 422 | `FAILED_PRECONDITION`, `ALREADY_EXISTS`, `NOT_FOUND` | No | Yes (safe detail) |
| **Infrastructure errors** | Failures in dependencies, networks, or platform | 429, 500, 502, 503, 504 | `UNAVAILABLE`, `RESOURCE_EXHAUSTED`, `INTERNAL` | Yes (transient) | No (generic message) |
| **Programming errors** | Bugs, contract violations, invalid API usage | 400, 401, 403, 405 | `INVALID_ARGUMENT`, `UNAUTHENTICATED`, `PERMISSION_DENIED`, `UNIMPLEMENTED` | No | Partial (safe detail) |

**Checklist:**

- [ ] `[CRITICAL]` Every error type in the codebase is classified as domain, infrastructure, or programming error
- [ ] `[CRITICAL]` Infrastructure errors carry a `retryable` flag or implement a retryability interface
- [ ] `[HIGH]` Error classification is enforced at the type system level (enums, sealed types, or tagged unions — not string matching)
- [ ] `[HIGH]` Domain errors include machine-readable error codes, not just human messages
- [ ] `[MEDIUM]` Error taxonomy is documented in a shared schema accessible to all services

### 1.2 Transient vs permanent failure signals

**Transient (retryable):** HTTP 408, 429, 500, 502, 503, 504; gRPC `UNAVAILABLE`, `ABORTED`, `RESOURCE_EXHAUSTED`; TCP connection reset; DNS temporary failure. Stripe signals retryability via the `Stripe-Should-Retry` response header — a pattern worth adopting.

**Permanent (non-retryable):** HTTP 400, 401, 403, 404, 405, 422; gRPC `INVALID_ARGUMENT`, `NOT_FOUND`, `PERMISSION_DENIED`, `UNAUTHENTICATED`, `UNIMPLEMENTED`, `DATA_LOSS`. These will never succeed on retry regardless of how many attempts are made.

- [ ] `[CRITICAL]` Every error returned by the system carries an explicit retryability signal (boolean flag, typed category, or `Retry-After` header)
- [ ] `[HIGH]` Non-idempotent operations NEVER retry without an idempotency key

### 1.3 Structured error format

All services MUST use a structured error format. For HTTP APIs, adopt **RFC 9457 Problem Details** (supersedes RFC 7807 as of July 2023). For gRPC, use `google.rpc.Status` with `ErrorInfo` in the details field.

**RFC 9457 Problem Details — required fields:**

```json
{
  "type": "https://api.example.com/errors/insufficient-funds",
  "title": "Insufficient Funds",
  "status": 402,
  "detail": "Account balance is 30.00 but transaction requires 50.00.",
  "instance": "/transactions/txn_abc123",
  "traceId": "4bf92f3577b34da6a3ce929d0e0e4736"
}
```

**Google AIP-193 error model** — used across all Google Cloud APIs, requires `ErrorInfo` with a `(reason, domain)` pair as a machine-readable identifier. The `reason` field uses `UPPER_SNAKE_CASE` (max 63 characters) and the `domain` field is a globally unique service identifier (e.g., `pubsub.googleapis.com`).

**Stripe's model** adds `type` (enum: `api_error`, `card_error`, `invalid_request_error`), `code` (machine-readable), `param` (which field caused it), and `doc_url` (link to documentation).

- [ ] `[CRITICAL]` All HTTP API errors use `application/problem+json` (RFC 9457) with `type`, `title`, `status`, and `detail` fields
- [ ] `[CRITICAL]` All errors include a correlation/trace ID for distributed tracing
- [ ] `[HIGH]` Machine-readable error codes follow a consistent naming scheme (e.g., `UPPER_SNAKE_CASE`, max 63 characters)
- [ ] `[HIGH]` Error responses include a documentation URL for the error type
- [ ] `[MEDIUM]` Extension fields provide structured metadata (e.g., `param`, `retryAfter`, `violations`) — consumers MUST NOT parse `detail` strings programmatically

**Anti-patterns to reject during review:**
- Generic `UNKNOWN` or `INTERNAL` codes when a more specific code exists
- HTTP 200 responses with error information embedded in the body
- Different error formats across services in the same system
- Numeric-only error codes without human-readable context

---

## 2. Error propagation and context preservation

Errors must gain context as they travel up the call stack while never leaking internal details to external consumers. The guiding principle: **log everything internally, sanitize everything externally**.

### 2.1 Context enrichment by layer

Each architectural layer adds its own context to errors before propagating upward. The original error cause MUST be preserved in the chain.

```
Repository  → adds: table, operation, query parameters
Service     → adds: business operation, entity IDs, service name
Controller  → adds: request ID, user context, sanitized external response
```

- [ ] `[CRITICAL]` Errors preserve the full causal chain (original exception accessible at every layer)
- [ ] `[CRITICAL]` External API responses NEVER include stack traces, internal service names, database schemas, file paths, or SQL queries
- [ ] `[HIGH]` Each layer adds contextual metadata without replacing or obscuring the original error
- [ ] `[HIGH]` Errors are logged exactly once at the boundary (not at every layer), with structured context from the full chain
- [ ] `[MEDIUM]` An error sanitization boundary exists between internal services and external consumers

### 2.2 Cross-service error propagation

**gRPC:** Use `google.rpc.Status` with typed detail messages (`ErrorInfo`, `RetryInfo`, `BadRequest`). The 17 gRPC status codes provide precise semantics — notably, `PERMISSION_DENIED` (identity known, insufficient rights) vs `UNAUTHENTICATED` (identity not established), and `INVALID_ARGUMENT` (regardless of system state) vs `FAILED_PRECONDITION` (depends on system state).

**REST:** Translate upstream errors deliberately. A `404 NOT_FOUND` from an internal service may be a `502 BAD_GATEWAY` or `503 SERVICE_UNAVAILABLE` from the caller's perspective. Never blindly forward downstream HTTP status codes.

**Message queues:** Attach error metadata to message headers — error code, message, timestamp, retry count, correlation ID, and attempt history. On failure, route to a dead letter queue with full context preserved.

- [ ] `[CRITICAL]` Downstream HTTP status codes are deliberately mapped to appropriate upstream codes (not forwarded blindly)
- [ ] `[HIGH]` gRPC services use standard status codes with typed detail messages (not string-encoded errors in the message field)
- [ ] `[HIGH]` Failed async messages carry error metadata in headers before DLQ routing

### 2.3 Distributed tracing and correlation IDs

All services MUST propagate **W3C Trace Context** headers (`traceparent` and `tracestate`). The `traceparent` header has a fixed format: `{version}-{trace-id}-{parent-id}-{trace-flags}` (e.g., `00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01`). The **trace-id** is 32 hex characters (16 bytes), globally unique. The **parent-id** is 16 hex characters (8 bytes), updated at each hop.

OpenTelemetry error recording: set span status to `ERROR`, record the exception via `span.recordException(e)`, and set `error.type` attribute to the fully-qualified exception type. Per OTel conventions, **errors that were retried and handled successfully SHOULD NOT be recorded on spans**.

- [ ] `[CRITICAL]` All services propagate W3C Trace Context headers (`traceparent`, `tracestate`) on every outbound request
- [ ] `[CRITICAL]` Every API response includes a trace/correlation ID that maps to internal distributed traces
- [ ] `[HIGH]` OpenTelemetry spans record exceptions with `exception.type`, `exception.message`, and `exception.stacktrace` attributes
- [ ] `[MEDIUM]` Trace context is propagated through async message queues (not just synchronous calls)

---

## 3. Circuit breaker implementation standards

Every call to an external dependency MUST be wrapped in a circuit breaker. Without one, a single failing dependency can cascade into a system-wide outage. Netflix processes **10+ billion circuit breaker-protected command executions per day** — this pattern is non-negotiable at scale.

### 3.1 State machine specification

The circuit breaker operates as a three-state machine: **Closed** (normal flow, failures counted) → **Open** (requests rejected immediately, fast-fail) → **Half-Open** (limited probe requests to test recovery).

| Parameter | Recommended Default | Range for Tuning | Source |
|---|---|---|---|
| **Failure rate threshold** | **50%** | 10–50% | Hystrix 50%, Resilience4j 50%, Polly 10% |
| **Minimum request volume** | **20** requests in window | 10–100 | Hystrix 20 (10s), Resilience4j 100, Polly 100 (30s) |
| **Sliding window size** | **10 seconds** (time-based) or **100 calls** (count-based) | 10–60s / 50–200 calls | Hystrix 10s, Resilience4j 100 calls |
| **Open state duration** | **30–60 seconds** | 5–120s | Hystrix 5s, Resilience4j 60s, Polly 5s |
| **Half-open probe count** | **10 requests** | 1–20 | Resilience4j 10, Hystrix 1 |
| **Half-open success threshold** | **Same as failure rate threshold** | — | Resilience4j default |
| **Slow call duration threshold** | **5 seconds** | 1–60s | Resilience4j 60s (too generous — tune down) |

**Checklist:**

- [ ] `[CRITICAL]` Every external dependency (database, third-party API, internal service, cache) has its own dedicated circuit breaker instance
- [ ] `[CRITICAL]` Circuit breakers are isolated per-dependency — a shared circuit breaker across multiple dependencies is a deployment blocker
- [ ] `[HIGH]` Failure rate threshold is configured between 10–50% (not left at framework defaults without analysis)
- [ ] `[HIGH]` Open state duration is ≥ **30 seconds** to give dependencies meaningful recovery time
- [ ] `[HIGH]` A meaningful fallback response is returned when the circuit is open (not just a raw error)
- [ ] `[MEDIUM]` Slow call rate monitoring is enabled with a duration threshold calibrated to the dependency's p99 latency
- [ ] `[MEDIUM]` Circuit breaker state transitions (open/close/half-open) are logged and emit metrics
- [ ] `[LOW]` Sliding window type (count-based vs time-based) is chosen based on traffic pattern — count-based for steady traffic, time-based for variable traffic

### 3.2 Per-dependency isolation (bulkhead pattern)

Circuit breakers alone don't prevent resource exhaustion. Combine with the **bulkhead pattern** to limit concurrent calls per dependency.

**Thread pool sizing formula (Netflix):**
```
pool_size = peak_RPS × p99_latency_seconds + breathing_room
Example: 30 RPS × 0.2s + 4 = 10 threads
```

Netflix ran **30+ thread pools at 10 threads each, with 5–20 threads per dependency** and queue sizes of 5–10.

- [ ] `[HIGH]` Each critical dependency has concurrency limits (thread pool or semaphore isolation)
- [ ] `[MEDIUM]` Bulkhead limits are sized based on measured peak RPS and p99 latency, not arbitrary round numbers

**Anti-patterns to reject:**
- Single shared circuit breaker for all external calls
- Circuit breaker without any fallback behavior
- Checking circuit breaker state before calling `execute()` (prevents half-open transition)
- Retry logic without a circuit breaker (retries amplify failures without a safety valve)

**Recommended tools:** Resilience4j (Java/Kotlin), Polly v8 (.NET), sony/gobreaker (Go), opossum (Node.js), Envoy/Istio (service mesh-level)

---

## 4. Retry policies

Retries are the most dangerous resilience pattern when implemented incorrectly. **Retrying without backoff and jitter can convert a partial outage into a total outage.** Google SRE documents that a 3-layer stack with 4 retries per layer produces **64 total attempts** at the lowest dependency — an amplification factor that can be catastrophic.

### 4.1 Retryable vs non-retryable classification

| Retryable (YES) | Non-retryable (NO) |
|---|---|
| HTTP 408, 429, 500, 502, 503, 504 | HTTP 400, 401, 403, 404, 405, 409, 422 |
| gRPC `UNAVAILABLE`, `ABORTED` | gRPC `INVALID_ARGUMENT`, `NOT_FOUND`, `PERMISSION_DENIED`, `UNAUTHENTICATED`, `UNIMPLEMENTED`, `DATA_LOSS` |
| TCP connection reset, DNS temporary failure | Authentication failure, schema validation error |
| Network timeout, connection refused | Missing required field, malformed request |

### 4.2 Exponential backoff with jitter — exact formulas

**Base exponential backoff:**
```
delay = min(cap, base × 2^attempt)
```

**Full jitter** (AWS recommended — produces least total client work and most even distribution):
```
delay = random(0, min(cap, base × 2^attempt))
```

**Equal jitter** (guarantees minimum delay of 50% of computed backoff):
```
temp = min(cap, base × 2^attempt)
delay = temp/2 + random(0, temp/2)
```

**Decorrelated jitter** (each delay derived from previous — good for correlated retry streams):
```
delay = min(cap, random(base, previous_delay × 3))
```

### 4.3 Retry parameters by provider and operation type

| Parameter | AWS SDK | Google Cloud | Azure SDK | gRPC | Recommended Default |
|---|---|---|---|---|---|
| **Max attempts** | 3 | 4–5 | 3–4 | 4 (capped at 5) | **3–5** |
| **Initial delay** | 100ms | 1.0s | 800ms | 100ms | **100ms–1s** |
| **Max delay (cap)** | 20s | 60s | 60s | configurable | **10–60s** |
| **Backoff multiplier** | 2× | 2× | 2× | 2× | **2×** |
| **Jitter** | Full jitter | Yes | Randomized | ±20% | **Full jitter** |

| Operation Type | Max Attempts | Notes |
|---|---|---|
| Idempotent reads (GET) | 3–5 | Safe to retry freely |
| Idempotent writes (PUT with If-Match) | 2–3 | Verify idempotency |
| Non-idempotent writes (POST) | **0–1** | Requires idempotency key or do not retry |
| Background jobs / batch | 5–10 | Higher tolerance acceptable |

### 4.4 Retry budgets

Google SRE enforces a **three-layer retry budget** to prevent retry storms:

1. **Per-request budget:** Maximum **3 attempts** per individual request. If it fails 3 times, propagate the failure upward.
2. **Per-client retry budget:** Retries allowed only while retry-to-total-request ratio remains **below 10%**. When this threshold is exceeded, no new retries are initiated.
3. **Retry only at one layer:** Never retry at every layer of the stack. Prefer retrying at the edge/entry point only. Three layers × 4 attempts = 64 total attempts at the bottom — this is unacceptable.

**gRPC retry throttling** uses a token bucket: clients start with `maxTokens` (default 10), decrement by 1 on failure, increment by `tokenRatio` (default 0.1) on success. Retries pause when tokens drop below `maxTokens / 2`.

**Checklist:**

- [ ] `[CRITICAL]` All retries use exponential backoff with jitter — immediate retries or fixed-interval retries are a deployment blocker
- [ ] `[CRITICAL]` Non-idempotent operations are NEVER retried without an idempotency key
- [ ] `[CRITICAL]` Maximum retry attempts are capped (3–5 for synchronous calls, never unlimited)
- [ ] `[HIGH]` Retry budget is enforced: retry traffic must remain below **10% of total traffic** per client
- [ ] `[HIGH]` Retries occur at only one layer of the call stack (not at every service in the chain)
- [ ] `[HIGH]` `Retry-After` headers from servers (especially on 429 responses) are respected
- [ ] `[HIGH]` Only retryable error categories trigger retries (4xx client errors other than 408/429 are never retried)
- [ ] `[MEDIUM]` Jitter algorithm is **full jitter** (AWS recommendation) unless a specific alternative is justified
- [ ] `[MEDIUM]` Retry metrics are tracked: total retries, retry success rate, retry budget utilization

---

## 5. Timeout standards

**Every network call MUST have an explicit timeout.** The default timeout for most HTTP clients and database drivers is either infinite or absurdly generous — Java's `HttpClient` defaults to infinite, and most connection pool `pool_timeout` values default to 30 seconds. Google SRE warns against "arbitrary timeouts at nice round human numbers (30s, 60s)" — timeouts should be derived from measured latency data.

### 5.1 Recommended timeout values by operation type

| Operation | Connection Timeout | Read/Request Timeout | Notes |
|---|---|---|---|
| **Database query (simple)** | 3–5s | **1–5s** (`statement_timeout`) | Simple key lookups: 100–500ms |
| **Database query (complex)** | 3–5s | **5–30s** (`statement_timeout`) | `lock_timeout`: 10s; `idle_in_transaction`: 60s |
| **External API call** | 3–5s | **3–6s** | AWS API Gateway hard limit: 29s |
| **Internal RPC / service-to-service** | 500ms–1s | **500ms–3s** | Same-region RTT < 1ms |
| **File I/O** | N/A | **5–30s** | Size-dependent |
| **DNS resolution** | **1–5s** | N/A | Typically < 100ms; cache TTL ~60s |
| **Connection pool acquisition** | **1–5s** | N/A | HikariCP default 30s — tune down |
| **Message queue publish** | 1–3s | **1–5s** | Kafka producer default: 30s |

**Zalando's connection timeout formula:** `connection_timeout = RTT × 3` — same datacenter: 100–500ms; cross-region: ~500ms; cross-continent: ~500ms.

### 5.2 Cascading timeout (deadline propagation)

Cascading timeouts are the single most important timeout pattern for distributed systems. Without deadline propagation, downstream services continue processing requests that upstream callers have already abandoned.

**Google SRE deadline propagation formula:**
```
downstream_deadline = remaining_deadline - buffer_for_network_and_processing
```

**Concrete example:** Frontend sets 30s deadline → Service A processes for 7s → sends RPC to Service B with **23s** deadline → B processes for 4s → sends RPC to C with **19s** deadline. At each hop, subtract a few hundred milliseconds for network transit and post-processing.

**Budget allocation pattern for a request chain:**
```
Total Budget: 100% (e.g., 5 seconds)
├── Network overhead buffer: 10% (500ms)
├── Service A processing: 20% (1s)
├── Service B call (downstream): 30% (1.5s)
├── Service C call (downstream): 30% (1.5s)
└── Response assembly + buffer: 10% (500ms)
```

For parallel calls: budget = max(parallel_call_timeouts) + processing + buffer.
For serial calls: budget = sum(serial_call_timeouts) + processing + buffer.

**gRPC propagates deadlines natively** via the `grpc-timeout` header, converting to relative timeouts on the wire to avoid clock skew. In Go, `context.WithTimeout` propagates automatically. In .NET, `EnableCallContextPropagation()` passes deadlines to child calls.

**Checklist:**

- [ ] `[CRITICAL]` Every network call (HTTP, gRPC, database, cache, queue) has an explicit timeout configured — no infinite or framework-default timeouts
- [ ] `[CRITICAL]` Connection timeouts and read/request timeouts are configured separately (connection establishment is fast; operations can take seconds)
- [ ] `[HIGH]` Deadlines are propagated from the entry point through every downstream call — no hardcoded downstream timeouts that exceed the caller's remaining budget
- [ ] `[HIGH]` When a deadline expires, downstream work is cancelled (not left running to waste resources)
- [ ] `[HIGH]` Timeout values are derived from measured p99 latency data plus a reasonable buffer, not arbitrary round numbers
- [ ] `[MEDIUM]` Connection pool acquisition timeouts are set to **1–5 seconds** (not framework defaults of 30s)
- [ ] `[MEDIUM]` Queue sizes for thread pools are small relative to pool size (≤50% of thread count per Google SRE)

**Anti-patterns to reject:**
- No timeout configured (infinite default)
- Same timeout value for connection and read operations
- Downstream timeout exceeding upstream caller's remaining deadline
- Timeout without cancellation (server continues processing wasted work)
- "Generous" timeouts (15 minutes for a Lambda that serves API requests)

---

## 6. Graceful degradation patterns

The goal is never "all or nothing." When a dependency fails, the system should shed load intelligently and return the best possible response, even if incomplete. Netflix's architecture assumes that **if 30 microservices each have 99.99% uptime, the combined probability of a completely healthy request is only 99.7%** — meaning roughly **3 million failures per billion requests**.

### 6.1 Fallback strategy hierarchy

When a dependency fails, attempt fallbacks in this order:

1. **Cache** — Serve from local or distributed cache (fastest, most transparent to users)
2. **Default** — Return precomputed or static default values (e.g., Netflix's "Top 50 most popular movies" when personalization fails)
3. **Reduced functionality** — Return partial data with clear indicators of what's missing
4. **Informative error** — User-friendly error with retry guidance and expected recovery time

- [ ] `[HIGH]` Every critical dependency has at least one fallback strategy defined
- [ ] `[HIGH]` Fallback responses are visually/structurally distinguishable from full responses (the `degraded` flag pattern)
- [ ] `[MEDIUM]` Fallbacks that call OTHER services are avoided or have their own circuit breakers (fallback cascading is an anti-pattern)

### 6.2 Stale-while-revalidate caching

Use HTTP `Cache-Control: max-age=<fresh>, stale-while-revalidate=<window>, stale-if-error=<window>` to serve stale content during revalidation and during errors.

| Use Case | `max-age` | `stale-while-revalidate` | `stale-if-error` |
|---|---|---|---|
| Time-sensitive API data | 1s | 59s | 3600s (1h) |
| Moderate API data | 60s | 300s (5m) | 86400s (24h) |
| CDN content | 3600s (1h) | 600s (10m) | 86400s (24h) |
| Static assets | 604800s (7d) | 86400s (1d) | 86400s (1d) |

- [ ] `[MEDIUM]` Cacheable API responses include `stale-while-revalidate` and `stale-if-error` directives
- [ ] `[MEDIUM]` Feature flags / kill switches exist to disable non-critical features at runtime without deployment

### 6.3 Load shedding

**Google's client-side adaptive throttling formula:**
```
rejection_probability = max(0, (requests - K × accepts) / (requests + 1))
```
Where `requests` and `accepts` are counted over the last **2 minutes**, and **K = 2** (Google's recommended multiplier). At K=2, backends reject roughly 1 request for every request they actually process, even under extreme overload.

**Priority-based shedding (Google SRE's four criticality levels):**

1. **CRITICAL_PLUS** — Payment processing, security-critical operations
2. **CRITICAL** — Standard user-facing requests
3. **SHEDDABLE_PLUS** — Important but deferrable (non-real-time features)
4. **SHEDDABLE** — Background operations, pre-fetching, analytics

Google also recommends **LIFO or CoDel (Controlled Delay) queuing** instead of FIFO — if a request has been queued for 10 seconds, the user has likely already given up.

- [ ] `[HIGH]` Services implement load shedding that activates before complete failure (not just returning 503 when everything is broken)
- [ ] `[HIGH]` Requests are prioritized — background/batch traffic is shed before user-facing traffic
- [ ] `[MEDIUM]` Load shedding triggers on CPU utilization >**70–80%** or queue depth >**50% of thread pool size**
- [ ] `[MEDIUM]` Partial response patterns return available data with clear indicators of what's missing

### 6.4 Partial response pattern

When some backends succeed and others fail, return available data:
```json
{
  "data": { "user": {...}, "orders": [...] },
  "degraded": true,
  "unavailable_services": ["recommendations", "reviews"],
  "cache_hit": true,
  "cache_age_seconds": 45
}
```

This follows Brewer & Fox's **Harvest/Yield** trade-off: sacrifice data completeness (harvest) to maintain availability (yield).

---

## 7. Dead letter queues and poison message handling

Every message queue consumer MUST have a dead letter queue configured. Without one, poison messages can block an entire consumer group indefinitely, or failed messages are silently dropped — both are production incidents waiting to happen.

### 7.1 DLQ configuration standards

| Parameter | Recommended Value | Notes |
|---|---|---|
| **Max retries before DLQ** | **3–5** on source queue | AWS Lambda docs recommend ≥5 for SQS; production systems often use 3 |
| **DLQ retention period** | **14 days** (maximum for SQS) | Must be ≥ source queue retention |
| **Kafka DLT retention** | **7–14 days** | `retention.ms=604800000` for investigation window |
| **Backoff between retries** | Exponential: 10s → 30s → 60s → 300s → 900s | Use separate retry queues with TTL for delayed redelivery |

**Kafka does not have native broker-level DLQ support** — DLQs are application-layer constructs using Spring Kafka `@RetryableTopic`, Kafka Connect `errors.deadletterqueue.topic.name`, or custom error handlers. Design accordingly.

### 7.2 Poison message detection

A poison message is one that will **never** succeed regardless of retry count. Detection signals include schema validation failures, deserialization errors (e.g., "Unknown magic byte!" in Kafka), missing required fields, oversized messages (SQS max: 256KB), and business rule violations that cannot self-resolve.

**Detection heuristic:** If a message has been retried `maxReceiveCount` times with the same error classification (not transient infrastructure), it is likely a poison message.

### 7.3 Alerting thresholds

| Metric | Warning | Critical |
|---|---|---|
| **DLQ depth** | >0 messages | >100 messages for 15 minutes |
| **DLQ growth rate** | >10 messages/min for 5 min | >50 messages/min for 5 min |
| **Oldest message age** | >4 hours | >24 hours |
| **Retry exhaustion rate** | >25% of retried messages exhaust all retries | >50% for 10 min |
| **DLQ processing rate** | 0 processed in 24 hours | 0 processed in 72 hours |

**Checklist:**

- [ ] `[CRITICAL]` Every message queue consumer has a DLQ configured with a bounded retry count (3–5 retries)
- [ ] `[CRITICAL]` All message consumers are idempotent — reprocessed DLQ messages must not create duplicate side effects
- [ ] `[HIGH]` DLQ depth is monitored with alerts at >0 (warning) and >100 (critical) thresholds
- [ ] `[HIGH]` DLQ messages include error metadata in headers: error code, message, timestamp, retry count, original trace ID
- [ ] `[HIGH]` A reprocessing procedure exists (manual or automated) with tooling to inspect, fix, and replay DLQ messages
- [ ] `[MEDIUM]` Poison message detection identifies messages that will never succeed and routes them to a permanent failure store
- [ ] `[MEDIUM]` DLQ retention period is set to the maximum allowed (14 days for SQS) to preserve evidence for investigation
- [ ] `[LOW]` Automated nightly DLQ drain jobs exist (e.g., EventBridge → Lambda using `StartMessageMoveTask` API)

**Anti-patterns:** No DLQ configured (silent data loss), unlimited retries without DLQ (queue blockage), reprocessing without fixing root cause (immediate DLQ return), dead-letter routing loops (Queue A → DLX → Queue B → DLX → Queue A).

---

## 8. Distributed system failure modes

### 8.1 Network partitions and CAP trade-offs

Every distributed data store makes an implicit CAP trade-off. **CP systems** (etcd, ZooKeeper, CockroachDB, Spanner) sacrifice availability during partitions — the minority partition stops accepting writes. **AP systems** (Cassandra, DynamoDB, Riak) remain available but require conflict resolution strategies (last-write-wins, CRDTs, application-level merge).

- [ ] `[HIGH]` The CAP trade-off for every stateful dependency is documented and its partition behavior is understood
- [ ] `[HIGH]` Services degrade gracefully during partitions rather than returning inconsistent data silently

### 8.2 Split brain prevention

Split brain occurs when multiple nodes simultaneously believe they are the leader. The three-layer defense model: (1) **Consensus protocol** requiring quorum, (2) **Fencing tokens/leases** preventing stale leaders from writing, (3) **Conflict resolution** handling the aftermath if split brain occurs despite layers 1–2.

**Quorum rule:** In a cluster of N nodes, quorum = ⌊N/2⌋ + 1. Always use an **odd number of nodes** — a 3-node cluster tolerates 1 failure, a 5-node cluster tolerates 2.

**Fencing tokens** are monotonically increasing numbers issued with each leadership grant. Storage systems must reject any write with a fencing token lower than the highest previously seen. Google Chubby/Spanner uses Paxos leader leases of approximately **10 seconds**, validated by quorum.

- [ ] `[CRITICAL]` Stateful clusters use odd numbers of nodes (3, 5, 7) — never 2 or 4
- [ ] `[HIGH]` Leader election mechanisms use fencing tokens or lease-based validation
- [ ] `[HIGH]` Manual failover procedures include fencing to prevent stale leaders from corrupting data

### 8.3 Clock skew tolerance

| Environment | Expected NTP Accuracy |
|---|---|
| LAN with NTPv4 | **0.1–1ms** |
| WAN (high-speed links) | **1–10ms** |
| Internet (typical) | **10–50ms** |
| Google TrueTime (GPS + atomic clocks) | **1–7ms** (hard upper bound) |
| CockroachDB (NTP-based) | Default max offset: **500ms** |

Google Spanner assumes **200 ppm clock drift** (~6ms every 30 seconds) and uses "commit wait" — transactions delay until the uncertainty interval has passed before committing. CockroachDB trades potential read delays for write throughput: reads encountering values within the uncertainty window trigger an "uncertainty restart."

- [ ] `[HIGH]` NTP is configured and monitored on all nodes; clock skew alerts fire when drift exceeds **10ms** within a datacenter or **50ms** across datacenters
- [ ] `[MEDIUM]` Systems that depend on clock ordering document their maximum tolerable skew assumption
- [ ] `[MEDIUM]` Wall-clock time is never used as the sole ordering mechanism for distributed events (use logical clocks or vector clocks)

### 8.4 Idempotency and saga patterns

The "exactly-once delivery" guarantee is **theoretically impossible** in distributed systems. What production systems achieve is "effectively exactly-once" through idempotent consumers, transactional outbox patterns, and deduplication. Kafka achieves this via idempotent producers (PID + sequence numbers) and transactional APIs (`transactional.id` for zombie producer fencing, `isolation.level=read_committed`).

**Saga pattern for distributed transactions:** Use orchestration (centralized coordinator) for workflows involving >3 services. All compensating transactions must be idempotent and retryable. The **pivot transaction** is the point of no return — before it, compensations roll back; after it, retryable transactions must eventually succeed.

- [ ] `[CRITICAL]` All message consumers and API endpoints for write operations are idempotent
- [ ] `[HIGH]` Distributed workflows use the saga pattern with explicit compensation logic (not distributed 2PC across microservices)
- [ ] `[HIGH]` Idempotency keys (UUID v4) are used for all non-idempotent external API calls, valid for at least **24 hours**

---

## 9. Chaos engineering integration

Chaos engineering is the practice of intentionally injecting failures to build confidence in a system's ability to withstand turbulent conditions. It is not optional for systems with availability SLOs above **99.9%** — untested failure paths will fail unexpectedly in production.

### 9.1 Prerequisites (must be met before any chaos experiment)

1. Monitoring and observability are in place (you cannot learn from failures you cannot see)
2. Steady-state behavior is defined with measurable metrics
3. Incident response procedures exist and are practiced
4. Rollback mechanisms for every experiment are tested
5. Management has approved production chaos with defined blast radius

- [ ] `[HIGH]` Chaos engineering prerequisites are satisfied before any production fault injection
- [ ] `[HIGH]` Every chaos experiment has a written steady-state hypothesis with specific success/failure criteria

### 9.2 Fault injection categories

| Category | Fault Types | Typical Parameters |
|---|---|---|
| **Latency** | Added network delay | 100–500ms moderate; 1000–5000ms severe |
| **Error injection** | HTTP 5xx or exception injection | 1–10% of traffic |
| **Resource exhaustion** | CPU, memory, disk, I/O stress | Test at 50%, 75%, 90%, 100% utilization |
| **Network** | Blackhole, packet loss, DNS failure, partition | 5–50% packet loss |
| **State** | Process kill, container/node termination, clock skew | Random instance termination |

### 9.3 Blast radius controls

- [ ] `[CRITICAL]` Every chaos experiment has explicit blast radius limits (percentage of instances/traffic affected, maximum duration)
- [ ] `[CRITICAL]` Automated abort criteria are defined and enforced — experiments halt immediately if key metrics breach thresholds
- [ ] `[HIGH]` Production experiments start with **≤5% of traffic** and expand only after successful validation at lower percentages
- [ ] `[HIGH]` Stop conditions are tied to monitoring alarms (AWS FIS CloudWatch integration, Gremlin Safety Engine)
- [ ] `[MEDIUM]` Experiments start with single-component failures before progressing to multi-fault scenarios

### 9.4 Progressive chaos maturity model

| Level | Name | Characteristics |
|---|---|---|
| **1** | Elementary | Non-production only; manual process; system metrics only |
| **2** | Simple | Basic automated experiments; some production; beginning business metric tracking |
| **3** | Advanced | Automated production experiments; hypothesis-driven; business metric correlation |
| **4** | Sophisticated | Continuous automated chaos; results drive architecture decisions; cultural default |

**Adoption levels** range from "In the Dark" (no practice) to "Cultural Expectation" (all critical services have regular experiments; justification required for opting *out*, not opting in).

- [ ] `[MEDIUM]` The organization has assessed its chaos maturity level and has a plan to advance
- [ ] `[MEDIUM]` Game day exercises are conducted at least **quarterly** with structured prep → execute → debrief phases
- [ ] `[LOW]` Google DiRT-style disaster recovery tests cover regional failures, not just single-service failures

**Recommended tools:** Netflix Chaos Monkey (instance termination), Gremlin (full commercial platform), AWS Fault Injection Simulator (AWS-native), LitmusChaos (Kubernetes, CNCF), Chaos Mesh (Kubernetes, CNCF), Toxiproxy (network fault injection), Jepsen (correctness verification for distributed systems)

---

## 10. Error budgets and SLO-based reliability management

Error budgets transform reliability from an abstract aspiration into a **quantitative, enforceable decision framework**. The error budget is simply `1 - SLO`: a 99.9% availability SLO yields a 0.1% error budget. Google attributes **roughly 70% of outages to changes**, making the error budget a natural throttle on deployment velocity.

### 10.1 Error budget calculations

| SLO Target | Error Budget | Allowed Downtime/Month (30d) | Allowed Downtime/Year |
|---|---|---|---|
| 99% | 1.0% | **432 minutes** (7.2 hours) | ~87.6 hours |
| 99.5% | 0.5% | **216 minutes** (3.6 hours) | ~43.8 hours |
| **99.9%** | **0.1%** | **43.2 minutes** | **~8.76 hours** |
| 99.95% | 0.05% | **21.6 minutes** | ~4.38 hours |
| 99.99% | 0.01% | **4.32 minutes** | ~52.6 minutes |
| 99.999% | 0.001% | **26 seconds** | ~5.26 minutes |

Each additional "nine" reduces allowed downtime by a factor of **10×**. A 100% SLO target is explicitly an anti-pattern — Google SRE states "users cannot tell the difference between 100% and 99.999%" and the cost of pursuing 100% is infinite.

**Burn rate** = actual error rate ÷ allowed error rate. A burn rate of 1.0 means the budget will be exactly exhausted at the end of the SLO window. A burn rate of 10 means budget exhaustion in 3 days. A burn rate of 1,000 (total outage) means exhaustion in **43 minutes**.

### 10.2 Multi-window multi-burn-rate alerting

This is the **gold standard** alerting approach from the Google SRE Workbook (Chapter 5). It combines a long window (significance) with a short window (currency), both exceeding the same burn rate threshold. The short window is **1/12 the duration** of the long window.

| Severity | Long Window | Short Window | Burn Rate | Budget Consumed When Alert Fires | Action |
|---|---|---|---|---|---|
| **Page (urgent)** | **1 hour** | **5 minutes** | **14.4×** | **2%** | Immediate response |
| **Page** | **6 hours** | **30 minutes** | **6×** | **5%** | Urgent response |
| **Ticket** | **24 hours** | **2 hours** | **3×** | ~10% | Next business day |
| **Ticket** | **3 days** | **6 hours** | **1×** | **10%** | Planned work |

**How the burn rate multipliers are derived:**
```
burn_rate = (budget_consumed × SLO_period_hours) / window_hours
Example: 2% budget in 1 hour = 0.02 × 720 / 1 = 14.4
Example: 5% budget in 6 hours = 0.05 × 720 / 6 = 6.0
Example: 10% budget in 3 days = 0.10 × 720 / 72 = 1.0
```

**Prometheus alert rule (from Google SRE Workbook):**
```yaml
# PAGE: fast burn (14.4×) OR slow burn (6×)
expr: (
        job:slo_errors_per_request:ratio_rate1h > (14.4 * 0.001)
      and
        job:slo_errors_per_request:ratio_rate5m > (14.4 * 0.001)
      )
    or (
        job:slo_errors_per_request:ratio_rate6h > (6 * 0.001)
      and
        job:slo_errors_per_request:ratio_rate30m > (6 * 0.001)
      )
severity: page
```

The dual-window technique provides fast alert reset time (~5 minutes after resolution) because the short window clears quickly even though the long window remembers the error spike.

- [ ] `[CRITICAL]` Every user-facing service has defined SLIs and SLOs documented and measured
- [ ] `[CRITICAL]` SLO-based burn rate alerting is implemented using multi-window multi-burn-rate approach (not raw error rate thresholds)
- [ ] `[HIGH]` SLOs are set tighter than SLAs to create a buffer before contractual penalties
- [ ] `[HIGH]` Error budget is tracked on a **rolling 30-day window** (not calendar month — avoids variable reactions based on date of outage)
- [ ] `[HIGH]` Burn rate alert configuration matches the Google SRE Workbook thresholds: **14.4×/1hr** and **6×/6hr** for pages, **3×/24hr** and **1×/3d** for tickets

### 10.3 Error budget policy

When the error budget is exhausted, Google SRE mandates: **halt all changes and releases other than P0 issues or security fixes** until the service is back within its SLO.

An error budget policy document (per Google SRE Workbook Appendix B) must include:

- Service overview and SLO targets
- What happens when performing at/above SLO (releases proceed normally)
- What happens when budget is exhausted (change freeze, except P0/security)
- Conditions requiring mandatory reliability work (code bugs, hard dependency issues)
- Conditions allowing continued feature work despite budget depletion (company-wide network issue, out-of-scope users)
- Single-incident threshold: if one incident consumes **>20% of budget** → mandatory postmortem with P0 action items
- Escalation path for disputes about budget calculations

- [ ] `[HIGH]` A written error budget policy exists for every service with an SLO
- [ ] `[HIGH]` Change freeze triggers automatically when error budget is exhausted
- [ ] `[MEDIUM]` Error budget consumption is reported weekly to service owners
- [ ] `[MEDIUM]` Single incidents consuming >**20%** of budget trigger mandatory postmortems

**Recommended tools:** Sloth (open-source Prometheus SLO generator implementing multi-window burn rate), Nobl9 (dedicated SLO platform), Google Cloud SLO Monitoring, Datadog SLO tracking, Grafana with PromQL burn rate expressions.

---

## 11. Alerting standards

Alerts exist for one purpose: to notify a human that they need to take action **right now**. Every alert that does not meet this bar is noise that degrades the system's actual ability to respond to real incidents. Google SRE's standard is **no more than 2 paging incidents per 12-hour on-call shift** — teams receiving 5+ per shift are in operational overload. Industry data shows teams receive over **2,000 alerts weekly** with only **3% needing immediate action**.

### 11.1 Symptom-based alerting

Alert on **user-facing symptoms**, not infrastructure causes. Users care about availability, latency, and data freshness — not CPU percentage, memory usage, or restart loops.

| Bad (Cause-Based) | Good (Symptom-Based) |
|---|---|
| MySQL server is down | Error rate exceeds SLO burn rate |
| CPU > 90% | API p99 latency > 500ms for 10 minutes |
| Disk space > 80% | Error budget consumption > 2% in 1 hour |
| Pod restart loop | User checkout success rate dropped below 95% |

**Exception:** Cause-based alerts are appropriate only for approaching **hard resource quotas** that can cause 0→100% failure instantly (e.g., disk at 95% on a database node).

- [ ] `[CRITICAL]` All paging alerts are symptom-based (user-facing error rate, latency, availability) — not cause-based (CPU, memory, disk) unless approaching hard limits
- [ ] `[CRITICAL]` Every alert has an attached runbook URL accessible from the alert notification itself
- [ ] `[HIGH]` Paging incident volume averages **≤2 incidents per 12-hour on-call shift** (Google SRE standard)
- [ ] `[HIGH]` Alerts pass the test: "Does this detect an otherwise undetected condition that is urgent, actionable, and actively user-visible?"

### 11.2 Severity framework with response times

| Severity | Description | Response Time | Resolution Target | Notification | Coverage |
|---|---|---|---|---|---|
| **P1/SEV-1** | Complete outage or major customer impact; SLA breach | **≤ 15 minutes** | 4 hours | Phone + SMS page, war room | 24×7 |
| **P2/SEV-2** | Significant degradation, many customers affected | **≤ 30 min–1 hour** | 8 hours | SMS/push page | 24×7 |
| **P3/SEV-3** | Partial degradation, limited customer impact | **≤ 4 hours** | 2 business days | High-urgency push | Business hours |
| **P4/SEV-4** | Minor issue, no direct customer impact | **≤ 8–24 hours** | 5 business days | Low-urgency push/Slack | Business hours |
| **P5/SEV-5** | Cosmetic, informational | Next business day | Next sprint | Ticket only | Business hours |

**Rule (PagerDuty):** "If you are unsure which level an incident is, treat it as the higher one. During an incident is not the time to discuss or litigate severities."

- [ ] `[CRITICAL]` Severity levels are defined with explicit response time SLAs and enforced via incident management tooling
- [ ] `[HIGH]` P1/SEV-1 response time is **≤ 15 minutes** with 24×7 coverage
- [ ] `[HIGH]` Notification channels match severity: P1 = phone/SMS page; P2 = push page; P3/P4 = Slack/ticket

### 11.3 Runbook requirements

Every alert MUST link to a runbook. The runbook must contain: alert description and meaning, severity and impact assessment, ordered investigation steps with exact commands, mitigation steps (stop the bleeding), resolution steps (permanent fix), escalation paths with contact information, related dashboard links, last-verified date, and owning team.

If a runbook is a deterministic list of commands with no judgment required, **automate it** — it should not be a page.

- [ ] `[CRITICAL]` Every paging alert has an attached, accessible runbook
- [ ] `[HIGH]` Runbooks are updated after every incident that uses them and reviewed at least **quarterly**
- [ ] `[MEDIUM]` Deterministic runbook procedures are automated (auto-remediation) rather than paging a human

### 11.4 Alert fatigue prevention

- [ ] `[HIGH]` All existing alerts are reviewed and pruned on a **quarterly** cycle
- [ ] `[HIGH]` Actionable alert rate is tracked and maintained above **30%** (below 10% indicates a critical noise problem)
- [ ] `[HIGH]` Alert aggregation and deduplication are configured (Prometheus Alertmanager grouping, inhibition rules)
- [ ] `[MEDIUM]` New alerts undergo peer review before deployment (same as code review)
- [ ] `[MEDIUM]` Lower-priority alerts are inhibited when higher-priority alerts fire for the same root cause

### 11.5 On-call rotation standards

| Parameter | Standard | Source |
|---|---|---|
| **Rotation size** | **6–8 engineers** minimum | Google SRE |
| **On-call frequency** | ≤**once per month** per engineer | Google SRE, Datadog |
| **Shift duration** | **12 hours** (day/night split) or **1 week** | Google SRE, industry standard |
| **Minimum viable team** | 3 people (5+ ideal) | Industry consensus |
| **Escalation timeout** | Primary → Secondary in **15–30 minutes** | PagerDuty standard |
| **Time allocation** | At least **25%** of work time on operational tasks | Google SRE, SolarWinds |

**Escalation structure:** Primary on-call must acknowledge within **5–15 minutes**. If no acknowledgment, escalate to secondary. If still unresolved, escalate to team lead/manager. P1/SEV-1 incidents additionally escalate to executive on-call.

- [ ] `[HIGH]` On-call rotation has **≥6 engineers** to avoid individual burnout
- [ ] `[HIGH]` Primary and secondary on-call are always assigned (no single point of failure)
- [ ] `[HIGH]` Escalation policies are configured with automatic timeout-based escalation
- [ ] `[MEDIUM]` On-call compensation is provided (direct pay, comp time, or additional day off after weekend shifts)
- [ ] `[MEDIUM]` Follow-the-sun model is used for globally distributed teams to eliminate overnight pages

---

## 12. Measurable criteria and operational metrics

These are the quantitative targets against which the entire protocol is measured. Track these metrics continuously and review trends weekly.

### 12.1 Detection and response targets

| Metric | Target (Mature) | Target (Industry Leader) |
|---|---|---|
| **Mean Time to Detect (MTTD)** | < 10 minutes | < 5 minutes |
| **Mean Time to Acknowledge (MTTA)** — P1 | < 15 minutes | < 5 minutes |
| **Mean Time to Recover (MTTR)** — P1 | < 60 minutes | < 30 minutes |
| **MTTR — P2** | < 8 hours | < 4 hours |
| **Error budget remaining** | > 25% at all times | > 50% at all times |
| **Actionable alert rate** | > 30% | > 50% |
| **Paging incidents per 12-hour shift** | ≤ 2 | ≤ 1 |

### 12.2 Recovery objectives by service tier

| Tier | RTO | RPO | SLO Target |
|---|---|---|---|
| **Mission-critical (Tier 1)** | < 15 minutes | Near-zero (sync replication) | 99.99%+ |
| **Business-critical (Tier 2)** | < 1 hour | < 15 minutes | 99.95% |
| **Important (Tier 3)** | < 4 hours | < 1 hour | 99.9% |
| **Non-critical (Tier 4)** | < 24 hours | < 24 hours | 99% |

### 12.3 Protocol compliance metrics

| Area | Key Metric | Measurement Method |
|---|---|---|
| Circuit breakers | % of external calls with CB protection | Static analysis + service mesh config audit |
| Retry policies | % of retries using exponential backoff with jitter | Code review + telemetry |
| Timeouts | % of network calls with explicit timeout | Static analysis + framework config audit |
| DLQs | % of queue consumers with DLQ configured | Infrastructure audit |
| Error budgets | % of services with defined SLOs and burn rate alerts | SLO platform inventory |
| Runbooks | % of paging alerts with attached runbooks | Alert configuration audit |
| Chaos testing | % of critical services with at least 1 chaos experiment in last quarter | Experiment log review |

- [ ] `[HIGH]` All metrics in section 12.1 are measured, tracked, and reported weekly
- [ ] `[HIGH]` Every service is classified into a tier (12.2) with corresponding RTO/RPO targets
- [ ] `[MEDIUM]` Protocol compliance metrics (12.3) are audited at least quarterly
- [ ] `[MEDIUM]` Operational review cadence: weekly (on-call review), monthly (service performance), quarterly (cross-team trends + alert pruning)

---

## Conclusion

This protocol transforms resilience from an abstract goal into a measurable, enforceable engineering standard. The most critical patterns to internalize are **per-dependency circuit breakers** (every external call), **exponential backoff with full jitter** (every retry), **explicit deadline propagation** (every timeout), and **multi-window burn rate alerting** (every SLO). The specific thresholds in this document — 14.4× burn rate for 1-hour page alerts, 10% retry budgets, 50% failure rate circuit breaker thresholds, 3–5 maximum retry attempts — are not arbitrary. They represent battle-tested values from organizations operating at the scale of billions of daily requests.

The three highest-leverage improvements for most systems are: (1) implementing SLO-based burn rate alerting instead of raw metric thresholds (eliminates alert fatigue while improving detection), (2) adding circuit breakers with fallbacks to every external dependency (prevents cascading failures), and (3) establishing and enforcing an error budget policy (creates a quantitative framework for balancing reliability against velocity). A system that meets every `[CRITICAL]` item in this protocol has the architectural foundation to achieve 99.9%+ availability. Meeting every `[HIGH]` item pushes toward 99.99%.

The protocol should be reviewed and updated semi-annually as industry practices evolve. The referenced standards — Google SRE Book and Workbook, AWS Well-Architected Framework reliability pillar, RFC 9457, W3C Trace Context, and the Principles of Chaos Engineering — serve as the authoritative sources against which this document is validated.