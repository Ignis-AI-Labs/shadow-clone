# Code Efficiency & Performance Protocol v1.0

**Ignis AI Labs — Production-Grade Performance Audit Standard**
**Classification:** Engineering Protocol — Mandatory Compliance
**Applies To:** All production code, infrastructure, AI systems (SAGE), trading bots, blockchain contracts, and agent orchestration (Shadow Clone)
**Effective Date:** April 2026 | **Review Cycle:** Quarterly

---

## PURPOSE

Every wasted CPU cycle, unnecessary memory allocation, and unoptimized query costs real money and degrades user experience. For Ignis AI Labs, performance failures translate directly to **lost trading opportunities** (sub-100ms response windows), **inflated inference costs** (AI compute at $2–25/million tokens), and **wasted gas** (a single unoptimized SSTORE costs 20,000 gas ≈ $1.10 at 50 gwei). This protocol establishes hard, measurable performance standards enforced at every stage of the development lifecycle — from code review through CI/CD to production monitoring.

This is not a guideline. It is an **audit checklist with deployment blockers**. Items tagged [CRITICAL] are hard deployment gates — code failing these checks must not ship. Items tagged [HIGH] must be resolved within the current sprint. [MEDIUM] items enter the backlog with quarterly review. [LOW] items are optimization opportunities tracked for continuous improvement.

---

## HOW TO USE THIS PROTOCOL

**For AI Coding Agents (Claude Code, Shadow Clone):**
Every code generation or modification must be validated against the relevant sections of this protocol. Before proposing a commit, run through applicable [CRITICAL] and [HIGH] checklist items. Flag violations inline with the priority tag and specific checklist item number.

**For Human Engineers:**
Use during code review as a structured audit. Walk through each section relevant to the change. Mark items: `[x]` passing, `[!]` failing, `[~]` partial compliance, `[N/A]` not applicable. Any `[!]` on a [CRITICAL] item blocks merge.

**For CI/CD Pipelines:**
Automate verification of items marked with 🤖 (automatable). Integrate performance budgets, benchmark regression detection, and static analysis into PR gates.

**Audit Sequence:**
1. Determine which sections apply to the changeset
2. Walk through all [CRITICAL] items first — any failure is a hard stop
3. Walk through [HIGH] items — failures require resolution plan before merge
4. Document [MEDIUM] and [LOW] findings as backlog items
5. Record results in the PR performance audit section

---

## 1. ALGORITHMIC COMPLEXITY & DATA STRUCTURE SELECTION

Algorithmic choices on hot paths are the single highest-leverage performance decision in any codebase. A poorly chosen algorithm cannot be rescued by hardware, caching, or infrastructure — **an O(n²) loop over 10,000 items executes 100 million operations** versus 130,000 for O(n log n). On a trading hot path with a 100ms budget, this is the difference between execution and failure.

### 1.1 Big-O requirements for critical paths

**[CRITICAL]** 🤖
- [ ] No algorithm with O(n²) or worse complexity exists on any hot path where n > 100
- [ ] All critical-path operations (trading signal processing, order routing, real-time inference) use O(n log n) or better algorithms
- [ ] Every function on a hot path has its time complexity documented in a comment or docstring

**[HIGH]**
- [ ] O(n²) algorithms on non-hot paths are acceptable only where n is bounded and documented (n < 1,000 with explicit size guard)
- [ ] All collection operations (filter, map, sort, search) on dynamic data use appropriate algorithmic primitives, not nested iteration
- [ ] No unbounded collection growth without explicit size limits — all caches, queues, and buffers have a `maxSize` parameter

**[MEDIUM]**
- [ ] Amortized complexity is documented for operations using dynamic arrays, hash maps with rehashing, or self-balancing trees
- [ ] Hash maps are pre-sized to expected capacity on hot paths to avoid rehashing (rehash causes **275% peak memory** and latency spikes)

### 1.2 Data structure selection

The crossover point where hash maps beat linear arrays is **n ≈ 15 elements** (measured at 17–20ns hash lookup vs 11–14ns linear scan for n=10). For collections under 15 items, a sorted array with linear scan is faster due to cache locality. BTreeMaps remain competitive with hash maps up to **n ≈ 1,000** due to cache-friendly node layout.

**[CRITICAL]** 🤖
- [ ] No linked lists used for iteration-heavy workloads on hot paths (cache locality penalty is 10x+ versus contiguous arrays)
- [ ] No `std::unordered_map` / default hash map implementations on latency-critical paths — use open-addressed alternatives (abseil `flat_hash_map`, folly `F14FastMap`, Rust `hashbrown`)

**[HIGH]**
- [ ] Data structures under 15 elements on hot paths use sorted arrays with linear/binary search instead of hash maps
- [ ] All iteration patterns use sequential memory access — no strided or random access patterns in tight loops
- [ ] Working set for hot-path data fits within L2 cache (< **1MB** per core)
- [ ] Struct-of-Arrays (SoA) layout used over Array-of-Structs (AoS) for batch-processing pipelines where only subset of fields are accessed

**[MEDIUM]**
- [ ] Appropriate priority queue (binary heap) used instead of repeated sorting for top-k selection
- [ ] B-tree or sorted structures used when ordered iteration is required; hash maps used only for unordered key-value access
- [ ] Cache line alignment (64 bytes x86-64, 128 bytes ARM) considered for hot data structures

### 1.3 Space-time tradeoff decisions

**[HIGH]**
- [ ] Space-time tradeoffs are explicitly documented with measurements, not assumptions
- [ ] Lookup tables / precomputation used for hot-path calculations where memory budget allows and function is pure
- [ ] Bloom filters or HyperLogLog used for approximate set membership / cardinality when exact answers are unnecessary (HyperLogLog: **12KB fixed memory** for cardinality estimation)

---

## 2. MEMORY MANAGEMENT & ALLOCATION

Memory allocation is deceptively expensive. While `malloc` itself costs ~0.15ns, `free` costs **250–1,000ns** — up to 6,600x slower than stack deallocation. In garbage-collected languages, allocation pressure drives GC pauses that create latency spikes precisely when load is highest. In Solidity, a single cold storage write (SSTORE) costs **20,000 gas** — making memory location the dominant cost factor in smart contract execution.

### 2.1 Allocation discipline

**[CRITICAL]** 🤖
- [ ] No heap allocations inside hot loops — pre-allocate buffers, pools, or arena allocators before entering critical sections
- [ ] No unbounded memory growth in any long-running service — all caches, buffers, and queues have explicit maximum size limits
- [ ] No string concatenation in loops — use `StringBuilder`, `bytes.Buffer`, `Vec<u8>`, or equivalent

**[HIGH]**
- [ ] Object pools used for high-churn objects created at > 1,000/second with short lifetimes (HTTP request buffers, message objects, connection wrappers)
- [ ] Arena/bump allocation used for per-request lifetime objects in server hot paths (all sub-objects freed in single bulk deallocation)
- [ ] Zero-copy patterns used for message passing between components — pass references, slices, or `Cow<T>`, not deep copies
- [ ] Large temporary buffers reused via pool rather than allocated/freed per operation

**[MEDIUM]**
- [ ] Stack allocation preferred over heap for small, fixed-size, short-lived objects
- [ ] Memory profiling run on all services quarterly — heap snapshots analyzed for unexpected retention
- [ ] No finalizers/destructors performing expensive operations on GC-managed objects

### 2.2 Garbage collection tuning

**[CRITICAL]** (Go services)
- [ ] `GOMEMLIMIT` set to container memory limit for all Kubernetes-deployed Go services (prevents OOM kills)
- [ ] GC tuning documented per service: `GOGC=off` with `GOMEMLIMIT` for containerized deployments, or `GOGC` tuned based on latency vs throughput requirements

**[HIGH]** (Node.js / Python / JVM)
- [ ] Node.js services set `--max-old-space-size` appropriate to container memory limit
- [ ] JVM services configure `-Xmx` and `-Xms` to container limits with `-XX:+UseG1GC` or ZGC for latency-sensitive paths
- [ ] Python services use `tracemalloc` or `memory_profiler` in staging to detect memory leaks before production deployment
- [ ] V8 heap size, process memory, and file descriptor counts monitored at ≥ 1-minute resolution

### 2.3 Solidity memory management

**[CRITICAL]** 🤖
- [ ] No `SSTORE` operations inside loops — accumulate in memory variables, write once after loop completion (saves **54%+ gas** — 10-iteration loop: 48,200 gas → 22,130 gas)
- [ ] All external function reference-type parameters use `calldata` instead of `memory` for read-only access (saves **1,800+ gas per call**, up to 35% total)
- [ ] State variables packed into minimal storage slots — consecutive sub-32-byte types share slots (each eliminated slot saves **20,000 gas** on first write)

**[HIGH]** 🤖
- [ ] Storage variables read multiple times within a function are cached in local stack/memory variables after first SLOAD (cold SLOAD = **2,100 gas**, warm = **100 gas**)
- [ ] Reentrancy guards use 1/2 values instead of 0/1 to avoid zero-to-non-zero SSTORE (22,100 gas → 2,900 gas)
- [ ] All non-changing values declared as `constant` (compile-time) or `immutable` (constructor-time) — eliminates **2,100 gas** per cold read
- [ ] Transient storage (`TSTORE`/`TLOAD` at **100 gas each**) used instead of regular storage for single-transaction temporary data (reentrancy locks, flash accounting)

---

## 3. COMPUTE COST AWARENESS

Modern CPUs execute instructions in 0.2–0.5ns, but a single cache miss to main memory costs **60–100ns** — a 200x penalty. A branch misprediction wastes **10–20 CPU cycles**. These invisible costs dominate real-world performance. The gap between "theoretically fast" and "actually fast" code is almost entirely about cache behavior and branch prediction, not instruction count.

### 3.1 Profiling requirements

**[CRITICAL]**
- [ ] No performance optimization applied without profiling data — "measure before you optimize"
- [ ] All production services have continuous profiling enabled with < 5% overhead (Pyroscope, Parca, or Datadog Profiler)
- [ ] Flame graph generated and reviewed for hot path identification before any performance-related code change

**[HIGH]**
- [ ] USE Method (Utilization, Saturation, Errors) checklist completed for all production infrastructure resources (CPU, memory, network, disk)
- [ ] Branch miss rate < **2%** on hot paths verified with `perf stat` or equivalent
- [ ] Any function consuming > 5% of total CPU time on flame graph is documented and has an optimization plan

**[MEDIUM]**
- [ ] SIMD intrinsics evaluated for batch numerical operations on > 100 elements (typical speedup: **3–8x**)
- [ ] Data-dependent branches in inner loops replaced with branchless/CMOV alternatives where profiling shows > 5% misprediction rate
- [ ] CPU cache hit rate monitored — L1 > **95%**, L2/L3 > **80%** on hot paths

### 3.2 When to optimize — decision framework

Optimize **when**: a profiler shows a function consuming > 5% of total execution time, latency at p99 exceeds SLO by > 20%, the code is on a path executed > 10,000 times/second, or memory usage grows unbounded under sustained load.

**Do not optimize when**: no profiling data exists, the code is not on a hot path (< 0.1% of execution time), the optimization adds significant complexity for < 10% improvement, or the bottleneck is I/O-bound (optimize the I/O pattern, not the compute).

### 3.3 Trading system compute budgets

**[CRITICAL]**
- [ ] Total tick-to-trade latency measured and within budget: P99 < **100ms** for algorithmic trading, P99 < **1ms** for HFT-class operations
- [ ] No JSON parsing on trading hot paths — use binary protocols (FIX, Protobuf, FlatBuffers). JSON parsing alone costs **50µs+**, consuming half a 100µs budget.
- [ ] Trading hot-path threads use CPU affinity/pinning — no scheduling jitter from OS thread migration

**[HIGH]**
- [ ] Jitter tracked alongside absolute latency — a system with consistent 10µs is more reliable than one averaging 5µs but spiking to 500µs
- [ ] P50, P95, P99, P99.9, and P99.99 histograms tracked at every trading pipeline stage
- [ ] CPU power-saving modes (C-states, frequency scaling) disabled on trading infrastructure

---

## 4. CACHING STRATEGIES

Caching transforms O(network + compute) operations into O(memory lookup) — a **200x latency improvement** is typical (600ms → 40ms measured in production login APIs; 2s → 10ms for vector search). But caching without invalidation strategy is a correctness bug waiting to happen. Cache stampedes have caused production outages at Facebook, Reddit, and countless smaller companies.

### 4.1 Cache architecture

**[CRITICAL]**
- [ ] Multi-layer caching implemented for all high-traffic paths: L1 in-process (< 0.1ms), L2 distributed cache/Redis (< 2ms), L3 CDN for HTTP-cacheable content
- [ ] Cache hit rate monitored per namespace with alerting — application cache hit ratio target: **≥ 95%** for hot paths
- [ ] All cache entries have explicit TTL — no indefinite caching without event-driven invalidation

**[HIGH]**
- [ ] Cache stampede prevention implemented on all hot keys: request coalescing (single-flight), probabilistic early expiration, or stale-while-revalidate
- [ ] TTL jitter applied to prevent thundering herd: `baseTTL + random(0, 0.1 × baseTTL)`
- [ ] Write-through caching used for financial state (order status, account balances) — write-behind is **not safe** for financial data without durable cache tier
- [ ] Redis `KEYS *` never used in production — use `SCAN` for iteration

**[MEDIUM]**
- [ ] Cache eviction policy matches access pattern: `allkeys-lfu` for AI inference result caching (clear hot/cold pattern), `allkeys-lru` for general-purpose caching
- [ ] Redis `maxmemory-samples` set to 10 for more accurate LRU approximation
- [ ] Memoization applied to pure functions on hot paths with bounded LRU cache (e.g., `functools.lru_cache(maxsize=1024)`)
- [ ] `MGET`/`MSET` used instead of individual `GET`/`SET` loops; Redis pipelining used for batch operations (**5–27x throughput improvement**)

### 4.2 TTL guidelines by data type

| Data Type | TTL Strategy | TTL Range |
|-----------|-------------|-----------|
| Static config / reference data | TTL-based | 1–24 hours |
| Product catalogs | TTL-based + event invalidation | 1 hour |
| User session data | TTL-based | 15–30 minutes |
| Real-time pricing / inventory | Event-driven invalidation only | No TTL reliance |
| Trading market data | Sub-second or no caching | Event-driven |
| AI inference results | LFU with TTL | 5–60 minutes |
| Blockchain state | Event-driven (new block) | Per-block |

---

## 5. DATABASE & QUERY OPTIMIZATION

Database queries are the most common source of production latency problems. A single N+1 pattern can transform a 100ms page load into a **10-second response**. Connection establishment without pooling costs **20–50ms** per request. Sequential scans on large tables grow linearly — a table scan over 1 million rows that takes 200ms today will take 2 seconds at 10 million rows.

### 5.1 Query performance

**[CRITICAL]** 🤖
- [ ] No N+1 query patterns — maximum **5 database round-trips per request**, automated detection via APM (Sentry, DataDog, or query count assertions in tests)
- [ ] No sequential scans (`Seq Scan` in EXPLAIN) on tables with > 10,000 rows on any production query path
- [ ] All queries verified with `EXPLAIN (ANALYZE, BUFFERS)` before deployment — no query with estimated cost > 10,000 or actual execution time > 500ms on production-scale data

**[HIGH]** 🤖
- [ ] Composite indexes follow correct column ordering: equality columns first, range columns second, ORDER BY columns third (leftmost prefix rule)
- [ ] Covering indexes (using `INCLUDE` clause) implemented for top-10 queries by frequency — enables Index Only Scan, eliminating heap access
- [ ] Partial indexes created for stable hot subsets (e.g., `WHERE status = 'active'`) to reduce index size and improve cache utilization
- [ ] Connection pooling configured with pool size = **2 × CPU cores** for OLTP workloads (PgBouncer in `transaction` mode recommended)
- [ ] Batch INSERT used instead of individual INSERTs — optimal batch size: **100–1,000 rows** per statement (**10–100x faster**)

**[MEDIUM]**
- [ ] `pg_stat_statements` enabled and top queries by total time reviewed weekly
- [ ] Database buffer cache hit ratio ≥ **99%** for OLTP (check `pg_stat_database`)
- [ ] Index hit ratio ≥ **99%** for tables > 10,000 rows (check `pg_stat_user_indexes`)
- [ ] Expression indexes used for function-based predicates (e.g., `CREATE INDEX idx ON users (lower(email))`)
- [ ] Unused and overlapping indexes identified and removed quarterly (check `pg_stat_user_indexes` for `idx_scan = 0`)

### 5.2 Query time thresholds

| Query Type | Target | Acceptable | Deployment Blocker |
|-----------|--------|------------|-------------------|
| Simple lookup (by PK/index) | < 10ms | < 50ms | > 100ms |
| Standard OLTP query | < 50ms | < 200ms | > 500ms |
| Complex join / aggregation | < 200ms | < 500ms | > 1s |
| Reporting / analytics | < 1s | < 3s | > 5s |

### 5.3 Redis optimization

**[HIGH]**
- [ ] Redis pipelining used for all batch operations (optimal: 100–1,000 commands per pipeline)
- [ ] Lua scripts used for atomic multi-step operations — keep scripts under **5ms** execution time
- [ ] Redis data structure selected appropriately: Hashes for objects (saves memory vs multiple string keys), Sorted Sets for leaderboards/time-series indexes, Streams for event logs
- [ ] `slowlog-log-slower-than` configured at **10000** (10ms) to catch slow operations

---

## 6. NETWORK & I/O OPTIMIZATION

Network I/O is the dominant latency contributor in distributed systems. DNS resolution adds **10–50ms**, TLS handshake adds **50–150ms**, and cross-region calls cost **30–150ms** round-trip. Connection pooling alone reduces per-request latency from **250–300ms to ~78ms** (70% reduction). Serialization format choice determines whether your payload takes 1.2ms (Protobuf) or 7ms (JSON) to encode.

### 6.1 Connection and protocol management

**[CRITICAL]**
- [ ] `TCP_NODELAY` enabled on all latency-sensitive connections (disables Nagle's algorithm — without it, small packets buffer for **~200ms**)
- [ ] Connection pooling and keep-alive enabled for all HTTP clients and database connections — no per-request connection creation
- [ ] Async/non-blocking I/O used for all network operations — no synchronous blocking calls on event loop threads

**[HIGH]**
- [ ] Internal service-to-service communication uses gRPC with Protobuf (3x faster serialization, **33–37% smaller payloads** than JSON, **10x+ faster** than JSON for large messages)
- [ ] Compression enabled on all API responses: **Zstd** for dynamic content (42% faster than Brotli, 9x faster than gzip), **Brotli** level 9–11 for static/cached assets
- [ ] Payloads under **150 bytes** are not compressed (overhead exceeds benefit)
- [ ] DNS resolution cached for ≥ **300 seconds** to eliminate 10–50ms per-lookup penalty
- [ ] `SO_REUSEPORT` enabled on multi-threaded servers for load distribution across CPU cores

**[MEDIUM]**
- [ ] WebSocket connections used for persistent bidirectional real-time data (market feeds, live updates) instead of HTTP polling
- [ ] Request batching implemented for write-heavy workloads (logging, analytics events) to reduce round-trips
- [ ] `TCP_QUICKACK` enabled on Linux for latency-sensitive reads (disables delayed ACKs)

### 6.2 Trading system network optimization

**[CRITICAL]**
- [ ] Kernel bypass technology evaluated for trading hot paths (DPDK, AF_XDP, or OpenOnload) — standard Linux networking adds **10–50µs** of kernel overhead
- [ ] Binary serialization (FlatBuffers at **711ns/op** or Protobuf at **1,827ns/op**) used instead of JSON (**7,045ns/op**) on trading data paths
- [ ] TCP congestion control set to **BBR** on all trading infrastructure (`TCP_CONGESTION = "bbr"`)

**[HIGH]**
- [ ] `SO_RCVBUF` / `SO_SNDBUF` set to **256KB** for trading connections
- [ ] `TCP_FASTOPEN` enabled for reduced connection latency (data sent during handshake)
- [ ] `TCP_USER_TIMEOUT` set to **30,000ms** to detect and clean up zombie connections

---

## 7. CONCURRENCY & PARALLELISM

Concurrency bugs are among the hardest to diagnose in production — they manifest intermittently under load, precisely when debugging is most difficult. A misconfigured thread pool wastes resources or creates contention. Unbounded queues exhaust memory during traffic spikes. Missing backpressure cascades failures across service boundaries. Correct concurrency architecture must be designed upfront, not retrofitted.

### 7.1 Thread pool and runtime configuration

**[CRITICAL]**
- [ ] Thread pools are bounded — no unbounded thread pool creation (`Executors.newCachedThreadPool()` or equivalent). Maximum pool size is explicitly configured.
- [ ] Backpressure mechanisms implemented on all producer-consumer boundaries: bounded queues, rate limiting (HTTP 429 with `Retry-After`), or load shedding
- [ ] No blocking operations on async runtime threads — CPU-heavy work offloaded to `spawn_blocking` (Tokio), worker threads (Node.js), or separate thread pool

**[HIGH]**
- [ ] Thread pool sizing follows the formula: `CPU-bound: N_cores + 1` | `IO-bound: N_cores × (1 + Wait/Service ratio)` — e.g., 8 cores with 80% wait time = **40 threads**
- [ ] Separate thread pools configured for different workload types (web requests vs background jobs vs database queries)
- [ ] Lock acquisition order is consistent across all code paths to prevent deadlocks — documented in shared concurrency design doc
- [ ] `tryLock` with timeout used instead of indefinite blocking where possible

**[MEDIUM]**
- [ ] Lock-free data structures (CAS-based queues, atomic counters) used for high-contention hot paths (SPSC/MPSC queues, counters)
- [ ] Go channels use explicit buffer sizes — no unbuffered channels in producer-consumer patterns without deliberate synchronization intent
- [ ] Queue depth monitored in production with alerting on sustained growth (indicates backpressure failure)

### 7.2 Language-specific concurrency

**[HIGH]** (Node.js)
- [ ] No synchronous file I/O (`fs.readFileSync`), CPU-intensive computation, or large `JSON.parse` on the event loop
- [ ] `worker_threads` used for CPU-bound operations exceeding **50ms**
- [ ] Event loop lag monitored — alert if event loop delay exceeds **100ms**

**[HIGH]** (Go)
- [ ] `GOMAXPROCS` left at default (= CPU cores) unless explicitly benchmarked otherwise
- [ ] `sync.Pool` used for high-churn temporary objects to reduce GC pressure
- [ ] Context cancellation (`context.Context`) propagated through all goroutine chains

**[HIGH]** (Rust)
- [ ] Tokio worker threads configured appropriately: `multi_thread` flavor for I/O-bound services, `current_thread` for single-threaded performance
- [ ] Bounded channels (`tokio::sync::mpsc::channel(cap)`) used with explicit capacity — no unbounded channel creation
- [ ] `spawn_blocking` used for any operation that may block (filesystem, CPU-heavy computation, synchronous libraries)

---

## 8. FRONTEND PERFORMANCE

Page load performance directly impacts business metrics: each **1-second delay** beyond 2.5s LCP threshold increases bounce rate by **32%**. Amazon measured that every **100ms of latency costs 1% in sales**. Google found bounce probability increases **90%** as load time goes from 1s to 5s. Core Web Vitals are confirmed ranking signals (10–15%+ of ranking weight), and only **48% of mobile sites** currently pass all three thresholds.

### 8.1 Core Web Vitals

**[CRITICAL]**
- [ ] **LCP (Largest Contentful Paint) ≤ 2.5s** at p75 on mobile — deployment blocker if > 4.0s
- [ ] **INP (Interaction to Next Paint) ≤ 200ms** at p75 — deployment blocker if > 500ms
- [ ] **CLS (Cumulative Layout Shift) ≤ 0.1** at p75 — deployment blocker if > 0.25
- [ ] Lighthouse Performance Score ≥ **90** in CI/CD (run via `@lhci/cli` with minimum 3 runs per URL)

**[HIGH]**
- [ ] LCP image/element preloaded with `fetchpriority="high"` — measured improvement: **700ms**
- [ ] All images use modern formats (WebP default, AVIF where supported) with responsive `srcset` attributes
- [ ] LCP image is **never** lazy-loaded — below-fold images use `loading="lazy"`
- [ ] No render-blocking JavaScript or CSS in the critical rendering path — all non-critical scripts use `async` or `defer`
- [ ] Explicit `width` and `height` set on all images and videos to prevent layout shift

### 8.2 Bundle size budgets

**[CRITICAL]** 🤖
- [ ] Critical-path JavaScript bundle ≤ **200KB gzipped** — enforced via `size-limit` in CI
- [ ] No individual asset exceeds **150KB gzipped**
- [ ] Performance budgets enforced as CI/CD gates — builds fail on budget violation

**[HIGH]** 🤖
- [ ] Code splitting implemented per route — per-route chunks ≤ **100KB gzipped**
- [ ] Tree shaking verified — no dead code in production bundles (use Webpack Bundle Analyzer or Source Map Explorer)
- [ ] Heavy libraries blocked via ESLint `no-restricted-imports`: `moment.js` (use `date-fns`/`dayjs`), `lodash` (use `lodash-es` or native), full `aws-sdk` (use modular `@aws-sdk/`)
- [ ] Total bundle size ≤ **1MB gzipped** across all routes

**[MEDIUM]**
- [ ] Virtual scrolling implemented for lists exceeding **100 items**
- [ ] Service Worker caching: cache-first for static assets, network-first for API data, stale-while-revalidate for semi-static content
- [ ] Font loading uses `font-display: swap` or `optional` with preloaded critical fonts
- [ ] DOM node count < **1,500 nodes**, max depth < **32 levels**
- [ ] TTFB < **200ms** (server response time)
- [ ] Third-party scripts audited quarterly — each can add **50–500ms** to page load

---

## 9. BLOCKCHAIN-SPECIFIC EFFICIENCY

Gas optimization in Solidity is fundamentally different from traditional performance optimization. **Storage operations dominate cost**: a zero-to-non-zero SSTORE at 20,000 gas is **6,666x more expensive than ADD at 3 gas**. Events are **50x cheaper** than storage for historical data. The EVM's 32-byte slot architecture means variable declaration order directly affects gas cost. Post-Dencun, transient storage (TSTORE/TLOAD at 100 gas) has created a paradigm shift for temporary data, reducing costs by **200x** versus regular SSTORE.

### 9.1 Storage operations

**[CRITICAL]** 🤖
- [ ] All structs and state variables ordered for optimal storage packing — sub-32-byte types declared consecutively to share slots (each eliminated slot saves **20,000 gas** on initialization)
- [ ] No zero-to-non-zero storage writes where avoidable — use 1/2 patterns instead of 0/1 for flags and guards (saves **19,200 gas** per toggle: 22,100 → 2,900)
- [ ] Storage variables read/written exactly once per function — subsequent accesses use cached local variables
- [ ] No `SSTORE` inside loops — accumulate results in memory, write once after loop
- [ ] Transient storage (EIP-1153) used for all single-transaction temporary data: reentrancy locks, flash accounting, temporary approvals (**100 gas** vs **20,000+ gas**)

**[HIGH]** 🤖
- [ ] All external function reference-type parameters use `calldata` not `memory` (saves **1,800+ gas per call**)
- [ ] All non-changing values are `constant` (compile-time) or `immutable` (constructor) — eliminates SLOAD entirely
- [ ] Custom errors used instead of `require` strings — saves **~5,500 gas** deployment + **~22 gas** per revert (requires Solidity ≥ 0.8.4)
- [ ] `unchecked { i++; }` used for all loop counters with bounded conditions (saves **20–80 gas** per iteration)
- [ ] Mappings used instead of arrays for all key-value lookups — O(1) vs O(n) access
- [ ] Historical/audit data emitted as events instead of stored in arrays (LOG base: **375 gas** vs SSTORE: **20,000 gas**)

**[MEDIUM]** 🤖
- [ ] Batch operations used to amortize 21,000 gas base transaction fee across multiple operations
- [ ] Short-circuit evaluation: cheapest conditions placed first in `&&` chains, most-likely-to-succeed first in `||` chains
- [ ] All functions marked with strictest possible state mutability (`pure` > `view` > non-payable > payable`)
- [ ] Variables are `private`/`internal` unless external access is specifically required (public generates getter, increasing deployment cost)
- [ ] Solidity optimizer enabled with `runs` parameter appropriate to expected call frequency (200 for normal contracts, 10000+ for high-frequency)

**[LOW]**
- [ ] `++i` preferred over `i++` (saves ~5 gas per iteration)
- [ ] Bit-shifting used instead of multiply/divide by powers of 2 (3 gas vs 5 gas)
- [ ] Named returns used to avoid extra memory allocation for return variables

### 9.2 L2-specific optimization

**[HIGH]**
- [ ] L2 contracts minimize calldata size — packed function parameters, address registries for short IDs
- [ ] Post-Pectra (May 2025): rollups use blob transactions instead of calldata for data posting (EIP-7623 increased calldata floor cost to 10 gas/token)
- [ ] ABI encoding optimization evaluated for calldata-heavy functions (custom packed encoding for frequently-called functions)

### 9.3 Architecture patterns

**[HIGH]**
- [ ] EIP-1167 minimal proxy pattern used for factory-deployed contracts (deploys at **99% less gas** than full deployment — 55 bytes of bytecode)
- [ ] UUPS proxy pattern preferred over Transparent Proxy for upgradeable contracts (avoids per-call admin check SLOAD)
- [ ] Off-chain computation maximized — only store/verify results on-chain
- [ ] Singleton contract pattern evaluated for managing multiple similar entities (Uniswap V4 model — pool creation gas reduced **99%**)

### 9.4 Gas cost reference table

| Operation | Gas Cost | Priority to Optimize |
|-----------|---------|---------------------|
| SSTORE (zero → non-zero) | 20,000 | CRITICAL |
| SSTORE (non-zero → non-zero, warm) | 2,900 | HIGH |
| SLOAD (cold) | 2,100 | HIGH |
| SLOAD (warm) | 100 | LOW |
| CALL (cold address) | 2,600 | HIGH |
| TSTORE / TLOAD | 100 each | — (use this!) |
| MSTORE / MLOAD | 3 | — |
| CALLDATALOAD | 3 | — |
| LOG1 | 375 + 375/topic + 8/byte | — |
| Transaction base | 21,000 | Batch to amortize |

---

## 10. PROFILING & BENCHMARKING STANDARDS

Performance measurement is a discipline with its own failure modes. JIT warmup, GC interference, CPU turbo boost, and noisy neighbor effects can make benchmark results **meaningless** without proper methodology. Cloud CI runners show **20–30% variance** between runs. The difference between "this code is faster" and "this measurement happened to be lower" requires statistical rigor — minimum iteration counts, warmup periods, and confidence intervals.

### 10.1 Profiling requirements

**[CRITICAL]**
- [ ] Continuous profiling enabled on all production services with < 5% overhead — Pyroscope (broadest language support + Grafana), Parca (eBPF-based, lowest overhead), or Datadog Profiler
- [ ] Performance regression benchmarks run in CI/CD on every PR — builds fail if regression exceeds **10%** versus main branch baseline
- [ ] All performance claims validated with before/after benchmarks using statistically valid methodology

**[HIGH]**
- [ ] Benchmarks run on dedicated/self-hosted CI runners, not shared runners (shared runners have 20–30% variance)
- [ ] Micro-benchmarks include proper warmup: JIT languages require **100,000+ warmup iterations**, compiled languages require cache warming
- [ ] Statistical significance validated: minimum **5 rounds** (10 preferred), report **median and IQR** over mean/stddev, coefficient of variation < **10%** for reliable results
- [ ] Flame graphs generated for all performance investigations — differential flame graphs used for before/after comparison (red = regression, blue = improvement)
- [ ] Production profiling sampling interval set to **10ms** (100Hz) as default — adjust based on overhead measurements

### 10.2 Benchmarking framework requirements

**[HIGH]** (Language-specific)
- [ ] **Rust:** Criterion.rs used with automatic regression detection, HTML reports, and machine-readable JSON output for CI integration
- [ ] **Go:** `go test -bench=. -benchmem -count=10` with `benchstat` for statistical comparison between branches
- [ ] **Python:** `pytest-benchmark` with `--benchmark-warmup=on`, `--benchmark-min-rounds=5`, `--benchmark-autosave` for historical tracking
- [ ] **Node.js:** Benchmark.js or Vitest benchmark with explicit warmup and statistical reporting

### 10.3 Load testing

**[CRITICAL]**
- [ ] Load testing performed before every major release using production-representative data and traffic patterns
- [ ] Load test results include p50, p90, p95, p99 latency at target throughput — all must meet SLO requirements

**[HIGH]**
- [ ] Load testing tool selected appropriately: **k6** for CI/CD integration and modern APIs (recommended), **Locust** for Python teams, **wrk** for raw HTTP benchmarking (5x faster than k6)
- [ ] Load tests simulate realistic scenarios: ramp-up, sustained load, spike, and soak (endurance) tests
- [ ] Load test environment matches production topology (same database size, same cache configuration, same network characteristics)

**[MEDIUM]**
- [ ] Performance regression detection uses change-point detection (MongoDB approach) rather than simple threshold comparison for better signal-to-noise ratio
- [ ] Benchmark results stored as JSON artifacts for historical trend analysis
- [ ] CPU isolation applied to benchmark processes: pinned to specific cores, hyperthreading disabled for consistency

---

## 11. LAZY VS EAGER EVALUATION

Lazy evaluation transforms O(n) memory into O(1) for pipeline operations — a Python generator for 1 million items uses **112 bytes** versus **8.4MB** for a materialized list (75,000x reduction). But laziness adds indirection overhead that makes it **slower** than eager evaluation for small datasets or CPU-bound operations with no memory benefit. The decision framework is straightforward: lazy for large/streaming data, eager for small/random-access data.

### 11.1 Data processing patterns

**[CRITICAL]** 🤖
- [ ] Database query results for unbounded result sets use cursor/streaming, never loaded entirely into application memory
- [ ] File processing for files potentially exceeding **100MB** uses streaming/line-by-line iteration, not `.readlines()` or `.read()`

**[HIGH]** 🤖
- [ ] Large collection transformations (filter/map/reduce) use generators/iterators/streams, not materialized intermediate lists
- [ ] Generator expressions used instead of list comprehensions when result is consumed exactly once
- [ ] Pagination uses **cursor-based** approach for all APIs where the underlying table exceeds **100,000 rows** — offset pagination degrades to **686x slower** at page 10,000 on 1M-row tables

**[MEDIUM]**
- [ ] Cursor-based pagination indexes the cursor column with composite index: `(sort_column DESC, id DESC)`
- [ ] Cursor values encrypted/encoded before external exposure (never leak auto-increment IDs)
- [ ] Streaming with fixed-size ring buffers used for real-time data (market feeds) — buffer recent N data points, stream older data to storage
- [ ] No accidental double-consumption of generators/iterators — they exhaust after a single pass

### 11.2 Decision framework

| Scenario | Strategy | Rationale |
|----------|----------|-----------|
| Dataset > 10,000 items in pipeline | Lazy (generators/streams) | Memory savings dominate |
| Dataset < 1,000 items | Eager (materialize) | Overhead of laziness exceeds benefit |
| Random access needed | Eager | Generators don't support indexing |
| Result consumed once | Lazy | No reuse, no reason to store |
| Sorting/aggregation of full set | Eager | Must see all data |
| Streaming/unbounded data | Lazy | Cannot materialize infinite streams |

---

## 12. PERFORMANCE BUDGETS & SLOs

SLOs (Service Level Objectives) are the contract between your system and your users. Google's SRE methodology establishes that **SLOs should never be 100%** — this is unrealistic and stifles innovation. Error budgets (100% − SLO) create a quantitative framework for balancing reliability with feature velocity. When the budget is exhausted, all non-critical changes freeze. This transforms performance from a subjective discussion into an engineering constraint with clear decision rules.

### 12.1 Latency SLOs by service tier

**[CRITICAL]**
- [ ] Latency SLOs defined for every production endpoint using p50, p90, p95, and p99 percentiles — measured from real user traffic, not synthetic tests
- [ ] Trading bot endpoints: **P99 < 100ms**, P50 < 10ms, P95 < 50ms — violations are deployment blockers
- [ ] SLO violations with < **10% error budget remaining** trigger change freeze except critical security/bug fixes

**[HIGH]**
- [ ] API endpoints meet tier-appropriate latency targets:

| Service Tier | P50 | P95 | P99 | Error Rate |
|-------------|-----|-----|-----|------------|
| Trading (Tier 0) | < 10ms | < 50ms | < 100ms | < 0.01% |
| Real-time AI inference | < 100ms | < 300ms | < 500ms | < 0.1% |
| Standard API (Tier 1) | < 200ms | < 500ms | < 1s | < 0.1% |
| Background/async (Tier 2) | < 500ms | < 2s | < 5s | < 1% |

- [ ] P99 > 3× P50 sustained for **15 minutes** triggers automated alert (indicates tail latency problem)
- [ ] Error budget burn-rate alerting configured with fast (1-hour) and slow (6-hour) windows

**[MEDIUM]**
- [ ] SLOs established from **2–3 months of production baseline data**, not aspirational targets
- [ ] Error budget consumption reviewed weekly — > 50% remaining = ship confidently, 25–50% = slow risky changes, < 25% = freeze non-critical deploys
- [ ] Cost per transaction tracked per endpoint with alerting on > **20% increase** from baseline

### 12.2 Performance budget enforcement

**[CRITICAL]** 🤖
- [ ] Performance budgets enforced as CI/CD gates — builds fail on violation (not just warn)
- [ ] Three minimum budgets enforced: response time (per SLO tier), bundle size (< 200KB gzipped JS), benchmark regression (< 10% degradation)

**[HIGH]**
- [ ] Lighthouse CI configured with hard failure assertions: `performance >= 0.9`, `LCP <= 2500`, `CLS <= 0.1`, `TBT <= 200`
- [ ] Bundle size checked on every PR via `size-limit` with automatic PR comments showing delta
- [ ] Performance budgets tightened quarterly — "freeze then ratchet down" approach

### 12.3 Capacity planning

**[HIGH]**
- [ ] CPU utilization target: **70–80%** for latency-sensitive services, **~90%** for throughput-optimized batch services
- [ ] Memory utilization: alert at **80%**, critical at **90%**, OOMKill events = **critical severity**
- [ ] Capacity planned to a **24-month horizon** maintaining 70% utilization threshold
- [ ] Kubernetes HPA target CPU set to **50%** for auto-scaling (leaves 2× headroom for burst)

### 12.4 Infrastructure alerting thresholds

| Resource | Warning | Critical | Action |
|----------|---------|----------|--------|
| CPU utilization | 70% (latency-sensitive) / 80% | 90% | Scale out / optimize |
| Memory utilization | 80% | 90% | Investigate leaks / resize |
| Disk I/O utilization | 70% | 85% | Optimize queries / upgrade storage |
| Error rate | 1% | 5% | Investigate root cause |
| P99 latency | > 3× P50 for 5min | > 5× P50 for 5min | Investigate tail latency |
| Cache hit rate | < 90% | < 80% | Review caching strategy |
| Queue depth growth | Sustained increase | Unbounded growth | Fix backpressure / scale consumers |

---

## 13. AI/ML INFERENCE OPTIMIZATION

AI inference is simultaneously the fastest-growing cost center and the highest-leverage optimization target for Ignis AI Labs. Model serving without quantization wastes **4–8x compute**. Static batching leaves **40–70% GPU capacity idle**. Sending full conversation history on every turn wastes **5–10x tokens**. Combined optimization across quantization, batching, caching, and model routing can reduce inference costs by **60–90%** while improving latency.

### 13.1 Model serving

**[CRITICAL]**
- [ ] Continuous batching enabled for all LLM serving (vLLM default, TGI, or TensorRT-LLM "in-flight batching") — **10–23x throughput improvement** over static batching
- [ ] PagedAttention (or equivalent KV cache management) enabled — reduces memory waste by **55%**, serves **10x more concurrent users** on same hardware
- [ ] FP8 quantization applied as default for all production models — **effectively lossless** across all model scales with **1.5–2x speedup**
- [ ] `max_tokens` set on every inference API call — no unconstrained generation

**[HIGH]**
- [ ] INT4 quantization evaluated for high-volume, non-critical endpoints — **3.25–4.5x speedup** with **98.1% reasoning capability retained** (test on your specific tasks first; quality degradation is higher for coding/math)
- [ ] Speculative decoding enabled for latency-sensitive interactive endpoints (SAGE chatbot, real-time analysis) — **2–3x latency reduction** at identical output quality
- [ ] Model routing implemented: simple tasks (classification, extraction) → cheapest model, complex reasoning → flagship model (**70–80% of production workloads** perform identically on mid-tier vs premium)
- [ ] GPU utilization monitored — if < **40%** sustained, switch to API calls or smaller instances

**[MEDIUM]**
- [ ] ONNX Runtime used for non-LLM models (classifiers, embeddings, rerankers) with hardware-specific execution providers
- [ ] Model distillation evaluated for domain-specific tasks where 10–50x parameter reduction is acceptable
- [ ] SGLang evaluated for Shadow Clone agent orchestration (RadixAttention enables KV cache reuse across agent steps)

### 13.2 Prompt and token optimization

**[CRITICAL]**
- [ ] Prompt caching enabled on all providers: Anthropic (`cache_control` breakpoints — **90% input cost reduction**), OpenAI (automatic for ≥ 1,024 tokens — **50% reduction**)
- [ ] Static content (system prompt, tool definitions, knowledge base) placed at **top** of prompt; dynamic content (user query) at **bottom** — required for cache hit
- [ ] No timestamps, request IDs, or per-request unique values in cached prompt prefix (breaks cache)

**[HIGH]**
- [ ] All system prompts audited for verbosity — target **40–70% token reduction** without quality loss
- [ ] Output length constrained in both `max_tokens` parameter and prompt instructions (e.g., "Respond in under 100 words") — output tokens cost **3–10x more** than input
- [ ] Conversation history managed with sliding window: keep last N turns, summarize older turns — prevents **5,000–10,000 token waste** per 20-turn conversation
- [ ] Structured output (JSON) requested for extraction/classification tasks — **2–3x fewer tokens** than free-form prose
- [ ] Batch API used for all non-real-time tasks (content generation, classification, reporting) — **50% cost discount** from all major providers

**[MEDIUM]**
- [ ] Semantic caching implemented for high-traffic repetitive workloads (Redis + vector embeddings) — **31% of LLM queries** are semantically similar to previous requests; cache hits eliminate API calls entirely
- [ ] Context compression applied in Shadow Clone agent chains — preprocess/summarize context between reasoning steps to prevent 50K–100K token consumption per multi-step task
- [ ] A/B testing performed before committing to model tier — verify that mid-tier model produces acceptable quality for each endpoint

### 13.3 GPU vs CPU inference decisions

**[HIGH]**
- [ ] GPU used for all models > **1B parameters**, all LLM inference, and all workloads requiring < **50ms** latency
- [ ] CPU used for models < **1B parameters** with low traffic (< 100 req/hour): classifiers, embeddings, preprocessing pipelines
- [ ] Self-hosting evaluated when monthly inference spend exceeds **$50,000** (70–80% savings potential)
- [ ] Spot/preemptible instances used for non-latency-critical GPU workloads (**50–60% cost savings**, 95% availability)

### 13.4 Inference cost reference

| Provider | Model Tier | Input $/M tokens | Output $/M tokens | Cached Input |
|----------|-----------|-------------------|-------------------|-------------|
| Anthropic | Haiku (fast/cheap) | $1.00 | $5.00 | $0.10 |
| Anthropic | Sonnet (balanced) | $3.00 | $15.00 | $0.30 |
| Anthropic | Opus (flagship) | $5.00 | $25.00 | $0.50 |
| OpenAI | Mini (fast/cheap) | $0.25 | $2.00 | $0.025 |
| OpenAI | Flagship | $1.75 | $14.00 | $0.175 |
| DeepSeek | V3.2 | ~$0.27 | ~$1.10 | — |

**Cost optimization priority (by impact):** Model routing (37–89% savings) → Prompt caching (50–90% on input) → Batch API (50%) → Output length limits (30–60%) → Semantic caching (up to 100% per hit) → Context compression (50–90% for agents)

---

## APPENDIX A: RECOMMENDED TOOLS

### Profiling & Monitoring

| Category | Tool | Languages/Use | Notes |
|----------|------|---------------|-------|
| Continuous Profiling | Pyroscope (Grafana) | Go, Python, Ruby, Java, .NET, Rust, Node.js | Broadest language support, ~2–5% overhead |
| Continuous Profiling | Parca | All compiled (eBPF) | Lowest overhead, no code changes |
| CPU Profiling | `perf` + flame graphs | Linux, all languages | `perf record -F 99 -a -g -- sleep 60` |
| Memory Profiling | `tracemalloc` / `memory_profiler` | Python | Development/staging |
| Memory Profiling | V8 heap snapshots | Node.js | `--inspect` flag |
| APM | Sentry, DataDog, New Relic | All | N+1 detection, distributed tracing |

### Benchmarking

| Category | Tool | Language | Key Feature |
|----------|------|----------|-------------|
| Micro-benchmark | Criterion.rs | Rust | Statistical regression detection, HTML reports |
| Micro-benchmark | `testing.B` + `benchstat` | Go | Statistical comparison between runs |
| Micro-benchmark | pytest-benchmark | Python | Auto-warmup, historical tracking |
| Load Testing | k6 | JS scripts, Go engine | Best CI/CD integration, Grafana ecosystem |
| Load Testing | Locust | Python | Rapid prototyping, distributed |
| Load Testing | wrk | C | Raw HTTP, 5x faster than k6 |
| Bundle Size | size-limit | JS/TS | CI gate with PR comments |
| Web Performance | Lighthouse CI | Web | CWV enforcement in CI/CD |

### Database

| Category | Tool | Use |
|----------|------|-----|
| Query Analysis | `pg_stat_statements` | Top queries by time/calls |
| Query Plans | `EXPLAIN (ANALYZE, BUFFERS)` | Per-query optimization |
| Connection Pooling | PgBouncer | Transaction-mode pooling |
| Index Analysis | `pg_stat_user_indexes` | Unused index detection |
| Log Analysis | pgBadger | PostgreSQL log analysis |
| Redis Monitoring | `INFO`, `SLOWLOG`, `MEMORY USAGE` | Built-in diagnostics |

### AI/ML Inference

| Category | Tool | Best For |
|----------|------|----------|
| LLM Serving | vLLM | General purpose, fastest TTFT, broadest model support |
| LLM Serving | TensorRT-LLM | Peak NVIDIA performance, production throughput |
| LLM Serving | SGLang | Agent/tool chains, KV reuse (RadixAttention) |
| Cross-platform ML | ONNX Runtime | Edge, mobile, CPU, non-LLM models |
| Cost Monitoring | Helicone | LLM API cost tracking and analytics |

### Blockchain

| Category | Tool | Use |
|----------|------|-----|
| Gas Profiling | Foundry (`forge test --gas-report`) | Per-function gas measurement |
| Storage Layout | `forge inspect` | Verify slot packing |
| Static Analysis | Slither | Gas optimization suggestions |
| Gas Benchmarking | Hardhat Gas Reporter | CI-integrated gas tracking |

---

## APPENDIX B: CRITICAL THRESHOLDS QUICK REFERENCE

### Latency Thresholds

| Metric | Pass | Warning | Fail (Blocker) |
|--------|------|---------|----------------|
| Trading bot P99 | < 100ms | 100–200ms | > 200ms |
| API P99 (Tier 1) | < 1s | 1–2s | > 2s |
| Database query (OLTP) | < 100ms | 100–500ms | > 500ms |
| LCP (web) | ≤ 2.5s | 2.5–4.0s | > 4.0s |
| INP (web) | ≤ 200ms | 200–500ms | > 500ms |
| LLM TTFT | < 500ms | 500ms–1s | > 2s |
| Redis operation P99 | < 2ms | 2–5ms | > 10ms |

### Resource Utilization

| Resource | Target | Alert | Critical |
|----------|--------|-------|----------|
| CPU (latency-sensitive) | < 70% | 80% | 90% |
| CPU (throughput) | < 85% | 90% | 95% |
| Memory | < 75% | 80% | 90% |
| Disk I/O | < 60% | 70% | 85% |
| Cache hit rate | > 95% | < 90% | < 80% |
| DB buffer hit ratio | > 99% | < 95% | < 90% |
| GPU utilization | > 80% | < 40% (wasteful) | < 20% (switch to API) |

### Size Budgets

| Asset | Budget | Blocker |
|-------|--------|---------|
| JS bundle (critical path, gzipped) | ≤ 200KB | > 300KB |
| Per-route JS chunk (gzipped) | ≤ 100KB | > 150KB |
| Total bundle (gzipped) | ≤ 1MB | > 1.5MB |
| Individual asset (gzipped) | ≤ 150KB | > 250KB |
| DOM nodes | < 1,500 | > 3,000 |

### Algorithmic Complexity Limits

| Context | Maximum Acceptable | Blocker |
|---------|-------------------|---------|
| Hot path (> 10K calls/sec) | O(n log n) for n > 50 | O(n²) with n > 50 |
| Non-hot path | O(n²) for n < 1,000 | O(n²) with n > 1,000 |
| Any path | O(n²) for n < 10,000 | O(n²) with n > 10,000 |
| Real-time/trading | O(log n) or O(1) | O(n) with n > 10,000 |

### Solidity Gas Budgets

| Operation Pattern | Maximum Acceptable Gas | Optimization Target |
|-------------------|----------------------|---------------------|
| Simple transfer | < 50,000 | < 30,000 |
| Token swap | < 200,000 | < 150,000 |
| Complex DeFi operation | < 500,000 | < 300,000 |
| Contract deployment | < 5,000,000 | < 3,000,000 |
| Batch operation (per item) | < 50,000 | < 30,000 |

---

## APPENDIX C: MEMORY ACCESS LATENCY REFERENCE

Understanding memory hierarchy latency is fundamental to all performance optimization. Every architectural decision should account for these physical constraints.

| Memory Level | Typical Size | Latency | Relative to L1 | Bandwidth |
|-------------|-------------|---------|----------------|-----------|
| L1 Cache | 32–128 KB/core | 0.7–1 ns | 1× | ~2,700 GB/s |
| L2 Cache | 256 KB–2 MB/core | 2.7–5 ns | ~4× | ~1,300 GB/s |
| L3 Cache | 4–96 MB shared | 10–20 ns | ~15× | varies |
| Main Memory (DDR5) | 16–512 GB | 60–100 ns | ~100× | ~50 GB/s |
| NVMe SSD | TB | ~10,000 ns | ~14,000× | ~7 GB/s |
| Network (same AZ) | — | 100,000–500,000 ns | ~150,000× | ~12.5 GB/s |
| Network (cross-region) | — | 30,000,000–150,000,000 ns | ~50,000,000× | varies |

**Key implication for trading systems:** In a 100µs (100,000ns) tick-to-trade budget, a single main memory cache miss at 80ns consumes **0.08%** of the total budget. Fifty cache misses consume **4%**. This is why cache-friendly data structures and working-set sizing to L2 are critical on the trading hot path.

---

## APPENDIX D: PERFORMANCE MONITORING FRAMEWORKS

Use three complementary frameworks for complete observability:

**Golden Signals** (Google SRE) — for user-facing services: Latency (p50/p95/p99), Traffic (requests/sec), Errors (error rate %), Saturation (queue depth, utilization %).

**USE Method** (Brendan Gregg) — for infrastructure resources: for each resource (CPU, memory, network, disk), check Utilization (% busy), Saturation (queue length), Errors (hardware/software errors).

**RED Method** — for microservices: Rate (requests/sec), Errors (failed requests/sec), Duration (latency distribution).

Apply Golden Signals to every customer-facing endpoint. Apply USE to every infrastructure component. Apply RED to every internal microservice. The intersection of these three frameworks covers > 95% of production performance issues.

---

## APPENDIX E: CI/CD PERFORMANCE GATE CONFIGURATION

### Minimum viable performance gates (implement immediately)

```yaml
# Example: GitHub Actions performance gate
performance-audit:
  steps:
    # 1. Bundle size check
    - run: npx size-limit --json
      # Fails if critical-path JS > 200KB gzipped
    
    # 2. Benchmark regression check  
    - run: cargo bench -- --save-baseline pr-${{ github.sha }}
    - run: cargo bench -- --baseline main --threshold 10%
      # Fails if any benchmark regresses > 10%
    
    # 3. Lighthouse CI (web projects)
    - run: lhci assert --config=lighthouserc.js
      # Fails if LCP > 2500, CLS > 0.1, TBT > 200, score < 90
    
    # 4. Database query analysis (integration tests)
    - run: pytest --benchmark-autosave --benchmark-compare
      # Tracks query count per endpoint, fails if > 5 DB round-trips
```

### Performance gate escalation

| Gate | Enforcement | Override Authority |
|------|-------------|-------------------|
| [CRITICAL] violations | Hard block — cannot merge | VP Engineering only |
| [HIGH] violations | Soft block — requires remediation plan in PR | Tech Lead approval |
| [MEDIUM] violations | Warning — tracked as tech debt ticket | Author discretion |
| [LOW] violations | Informational — logged for trends | No action required |

---

## CONCLUSION

This protocol distills performance engineering from an art into an auditable discipline. The highest-leverage optimizations are not exotic — they are systematic: **quantize your models** (2–4x inference speedup at negligible quality loss), **cache aggressively with proper invalidation** (95%+ hit rates transform latency profiles), **eliminate N+1 queries** (single largest source of API latency), **pack your storage slots** (each packed slot saves 20,000 gas), and **measure before and after every change** (intuition about performance is unreliable).

Three principles should guide all performance decisions at Ignis AI Labs. First, **profile before optimizing** — the bottleneck is almost never where you think it is. Second, **set budgets and enforce them** — performance degrades incrementally through hundreds of small regressions, not through single catastrophic changes. Third, **optimize the system, not the function** — a perfectly optimized function on a poorly designed hot path is still slow.

The protocol is versioned and reviewed quarterly. As EVM gas costs evolve, inference engines improve, and hardware advances, thresholds will be updated. The methodology — measure, budget, enforce, monitor — remains constant.