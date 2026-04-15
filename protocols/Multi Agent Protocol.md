# Multi-agent orchestration protocol for AI-driven software development

**Multi-agent systems can accelerate software development by 40–55%, but 40% of pilot deployments fail within six months.** The difference between success and failure comes down to disciplined orchestration: well-scoped tasks, enforced quality gates, structured communication contracts, and layered safety controls. This protocol synthesizes research from Anthropic, OpenAI, Google DeepMind, Microsoft, and production deployments at companies like GitHub, Elastic, and Goldman Sachs into an enforceable, checklist-based standard. Google DeepMind's 2025 scaling study found that **topology of coordination—not number of agents—determines success**, with unstructured multi-agent networks amplifying errors up to 17.2× compared to single-agent baselines. Every section below translates these findings into verifiable gates that both AI agents and human reviewers can enforce.

---

## 1. Orchestrator architecture selection

Five orchestration topologies dominate production systems, each with distinct tradeoffs. The right choice depends on task complexity, team size, and observability requirements.

**Orchestrator-Worker (Hub-and-Spoke)** places a central coordinator that decomposes tasks, delegates to specialized workers, and synthesizes results. This is the default pattern recommended by Anthropic, LangGraph (supervisor pattern), and CrewAI (hierarchical process). It offers predictable control flow and centralized observability but introduces a single point of failure. **Hierarchical (Tree-Structured)** extends this with multi-level delegation—top-level managers delegate to mid-level supervisors who delegate to leaf workers. Google ADK implements this as a parent-child agent tree. It scales to **50+ agents** but adds latency at each delegation level. **Pipeline (Sequential)** chains agents linearly, where each stage's output feeds the next. MetaGPT's SOP-based assembly line is the canonical example: ProductManager → Architect → ProjectManager → Engineer → QA. Simple and deterministic, but bottlenecked by the slowest stage. **Swarm/Peer-to-Peer** eliminates central control entirely—agents hand off to each other based on local routing decisions. OpenAI Swarm pioneered this with explicit handoff functions. Resilient but extremely hard to debug. **Mesh** allows direct peer communication among all agents but creates combinatorial explosion beyond 3–8 agents.

Anthropic's research system demonstrated the orchestrator-worker pattern's power: a lead agent (Claude Opus) spawning subagents (Claude Sonnet) achieved a **90.2% performance improvement** over single-agent baselines, though at ~15× the token cost. Their key architectural insight—"the sophistication should be in tool design, not agent architecture"—argues against over-engineering topology when better tools would suffice.

### Protocol checklist: architecture selection

- [ ] **Start with a single agent**; add multi-agent complexity only when single-agent demonstrably fails
- [ ] Select orchestrator-worker pattern as default for new projects
- [ ] Use hierarchical pattern only when >10 agents are required across distinct business domains
- [ ] Use pipeline pattern only for strictly sequential workflows with deterministic stages
- [ ] Never use swarm/mesh patterns unless concrete scalability bottlenecks are documented
- [ ] Justify multi-agent architecture against three criteria: high parallelization potential, information exceeds single context window, or task value justifies coordination overhead
- [ ] Document the selected topology and rationale in the project's architecture decision record
- [ ] Verify orchestrator has no more than **5–7 direct reports** (coordination tax saturates at ~4 agents per DeepMind research)

---

## 2. Agent task boundaries and the single-responsibility principle

A well-scoped agent task is completable within a single context window without requiring the agent to context-switch between unrelated concerns. Production data from Anthropic, Google, and practitioners like Addy Osmani converge on hard quantitative limits.

The single-responsibility principle for agents mirrors microservice design: each agent maps to one specific SDLC task or domain role. Google's ADK documentation states directly that "a single agent tasked with too many responsibilities becomes a 'Jack of all trades, master of none'" — as instruction complexity increases, adherence to specific rules degrades and error rates compound. **Scope must be enforced architecturally, not just by prompting.** A subagent that can only read orders cannot delete them, regardless of what the model is told. CrewAI's experience confirms this: as agent count increases within a crew, unrestricted delegation "becomes more and more unreliable and inconsistent."

Task atomicity follows ChatDev's proven model: each atomic subtask involves exactly two agents (instructor + assistant), terminates after two unchanged code modifications or 10 communication rounds, and produces a defined structured output. MetaGPT enforces atomicity through SOPs where each role produces exactly defined structured artifacts before the next agent begins.

### Protocol checklist: task scoping

- [ ] Each agent task touches **≤5 files**
- [ ] Each file remains **≤500 lines** of actual code (excluding blanks/comments)
- [ ] Each agent task has **≤1 primary objective** (single-responsibility)
- [ ] Simple tasks budget **3–10 tool calls**; moderate tasks budget **10–15 tool calls** per subagent
- [ ] Set hard kill criteria: **max 8 iterations** per agent; **3 consecutive stuck iterations** triggers reassignment
- [ ] Enforce **one file, one owner**: never let two agents edit the same file simultaneously
- [ ] Each task has a written "definition of done" with specific, testable acceptance criteria established *before* work begins
- [ ] Acceptance criteria are pass/fail (not subjective)—e.g., "GET /search?q= returns [{id,title,url}]"
- [ ] Limit concurrent agents under review to **3–5** (the token-cost sweet spot)
- [ ] Limit batch size to **5–10 issues** per agent assignment
- [ ] All task context files declared explicitly in a task manifest; agent cannot read files outside declared scope
- [ ] Grade agent outcomes on results, not paths taken—agents regularly find valid approaches designers didn't anticipate

---

## 3. Agent specialization: roles, capabilities, and boundaries

Production systems converge on 5–7 core specialist roles, with capability boundaries enforced through tool scoping, file ownership, and permission gates rather than prompt instructions alone.

MetaGPT defines five roles (ProductManager, Architect, ProjectManager, Engineer, QA Engineer), each producing structured artifacts that flow sequentially. Anthropic's three-agent harness uses a Planner (expands prompts into specs), Generator (implements iteratively), and Evaluator (tests against contracts using browser automation). Addy Osmani's production pattern adds a critical insight: **1 reviewer agent per 3–4 builder agents**, where the reviewer has read-only access with only lint, test, and security-scan tools.

The generalist-vs-specialist decision follows clear rules. Use generalist agents when the task is simple fact-finding (1 agent, 3–10 tool calls), during rapid prototyping, or when coordination overhead exceeds specialization benefit. Use specialist agents when tasks cross multiple SDLC phases, domain expertise significantly impacts quality, context window limits are being reached, or tasks are genuinely parallelizable. Anthropic's "small executor, big advisor" pattern offers a middle path: a cheaper model (Sonnet/Haiku) runs the task while an expensive model (Opus) provides selective intelligence escalation. On SWE-bench, this improved scores by **2.7 percentage points while reducing cost by 11.9%**.

### Protocol checklist: agent role definition

- [ ] Each agent role specifies: Role (professional identity), Goal (outcome-focused), Backstory (expertise context), Tools (scoped to role), File Access (explicit boundaries)
- [ ] Reviewer agents get **read-only** tools only: lint, test, security-scan
- [ ] Builder agents get write tools scoped to their assigned files/directories
- [ ] Security agents get: vulnerability scanners, SAST tools, dependency audit tools—no code write access
- [ ] Each agent receives **≤15 tools** (performance degrades beyond this threshold per Berkeley Function-Calling Leaderboard)
- [ ] Delegation paths are explicit—agents declare which peers they can delegate to (`allowed_agents` parameter)
- [ ] Document agent skill matrix mapping each role to: capabilities, tools, file scopes, trust tier
- [ ] Use specialist agents when >2 SDLC phases are involved; use generalist for single-phase tasks
- [ ] Consider advisor pattern (cheap executor + expensive advisor) before creating additional specialist agents

---

## 4. Inter-agent communication and structured output contracts

Pydantic models have emerged as the de facto standard for structured output contracts between agents, used across OpenAI SDK, Google ADK, Anthropic SDK, LangChain, CrewAI, and AutoGen. Google's Agent2Agent (A2A) protocol, now under the Linux Foundation, provides the only formally specified cross-framework standard using JSON-RPC 2.0 over HTTPS with Protocol Buffer definitions.

Each framework handles handoffs differently. OpenAI Swarm uses `transfer_to_XXX()` functions that return Agent objects, passing full conversation history to the new agent. LangGraph uses `Command` objects combining control flow with state updates, and critically requires every `ToolMessage` to pair with an `AIMessage` containing the tool call. AutoGen v0.4+ adopted an actor model with pub-sub communication through typed Pydantic `BaseModel` messages. CrewAI passes task outputs sequentially with `depends_on` parameters enforcing ordering.

For merge conflict prevention, **git worktrees are the standard isolation pattern**—each agent gets its own working directory on its own branch, sharing a single `.git` object store. Claude Code Agent Teams adds built-in file locking. The Clash CLI detects potential conflicts across worktrees in real-time. The emerging AgenticFlict research dataset studies conflict prediction using historical commit data and code ownership patterns.

### Protocol checklist: communication contracts

- [ ] Define a Pydantic `BaseModel` schema for every agent-to-agent data exchange
- [ ] Every agent output includes: `status` (success/partial/failed), `artifacts` (file paths), `summary`, `confidence` (0.0–1.0), `tests_passing` (bool)
- [ ] Reject handoffs where `confidence < 0.7`
- [ ] Each agent works in its own **git worktree** on a dedicated branch
- [ ] Enable **file-level locking** to prevent simultaneous edits to the same file
- [ ] Orchestrator merges branches via `git merge --no-commit --no-ff` to validate before committing
- [ ] Use contract-first development: agents agree on API contracts *before* implementation
- [ ] Reviewer agent validates cross-agent consistency after merge: API contracts, import paths, integration tests
- [ ] For event-driven architectures, include trace IDs in all messages for correlation
- [ ] Handoff messages include: task context, completed work summary, remaining work, known issues, file manifest

---

## 5. Sprint orchestration via DAG-based task scheduling

Converting a sprint backlog into a parallelizable task graph requires building a Directed Acyclic Graph (DAG) where nodes represent agent tasks and edges represent dependencies. Topological sorting determines valid execution order, and critical path analysis identifies the minimum sprint duration.

The DynTaskMAS framework provides the most sophisticated approach: a Dynamic Task Graph Generator continuously updates the graph, an Asynchronous Parallel Execution Engine maximizes parallelism while respecting dependencies, and Semantic-Aware Context Management handles intelligent information sharing. For most teams, a simpler approach works: decompose user stories into atomic tasks with explicit dependencies, identify level sets (tasks at the same dependency level that can execute concurrently), and assign agents based on role match and availability.

Agent capacity modeling must account for token budgets and tool-call capacity. Anthropic's scaling rules provide concrete guidance: simple fact-finding uses 1 agent with 3–10 tool calls; direct comparisons use 2–4 subagents with 10–15 calls each; complex research uses 10+ subagents with clearly divided responsibilities.

### Protocol checklist: sprint task orchestration

- [ ] Convert every user story into atomic tasks with explicit `dependsOn` relationships
- [ ] Build DAG and **validate no cycles** before execution begins
- [ ] Compute topological sort to determine valid execution order
- [ ] Identify critical path—the longest dependency chain sets the sprint floor duration
- [ ] Group tasks into level sets; tasks at the same level execute concurrently
- [ ] Assign each task an estimated token budget based on complexity tier
- [ ] Each agent writes to **unique state keys** in shared state to prevent race conditions during parallel execution
- [ ] If a task fails, re-assess DAG—mark dependents as blocked, reassign, or spawn retry agents
- [ ] Use immutable state snapshots: each agent produces a new version rather than modifying in place
- [ ] Set sprint-level token budget = (historical average per task × task count) + 30% buffer
- [ ] Monitor critical path tasks with higher priority alerts than non-critical tasks

---

## 6. Quality gates between agent handoffs

Quality gates adapted from CI/CD best practices form the backbone of reliable multi-agent pipelines. A minimum of five gate stages is required between agent handoffs, with clear pass/warn/fail states at each stage.

SonarQube's "Sonar Way" quality profile requires new code to achieve reliability, security, and maintainability ratings of A, with coverage below **80%** triggering quality gate failure. For agent-generated code, practitioners recommend **≥85% coverage** because the code lacks the implicit understanding a human developer has—each agent should write tests for its own output as part of the task. Addy Osmani's production pattern adds a dedicated `@reviewer` teammate (using a more capable model in read-only mode) triggered on every `TaskCompleted` event.

### Protocol checklist: mandatory quality gates

**Gate 1 — Schema Validation (between every agent pair):**
- [ ] Output conforms to declared Pydantic schema
- [ ] All required fields present and within type constraints
- [ ] Confidence score meets minimum threshold (≥0.7)

**Gate 2 — Syntax and Static Analysis:**
- [ ] Code parses without errors (AST validation)
- [ ] Linter passes with zero critical violations (ESLint, Ruff, or equivalent)
- [ ] Formatter compliance verified
- [ ] All imports resolve correctly

**Gate 3 — Functional Validation:**
- [ ] All existing tests pass (100% pass rate required)
- [ ] New/modified code has test coverage **≥80%** (lines), **≥80%** (functions), **≥75%** (branches)
- [ ] Agent-generated code has test coverage **≥85%**
- [ ] No increase in cyclomatic complexity beyond per-function limit of **≤15**

**Gate 4 — Security Validation:**
- [ ] SAST scan shows no critical or high-severity vulnerabilities
- [ ] Dependency security audit passes (no known CVEs in added packages)
- [ ] No new secrets or credentials in code
- [ ] Prompt injection screening on any user-facing output

**Gate 5 — Integration Validation:**
- [ ] Pre-merge dry run (`git merge --no-commit --no-ff`) succeeds
- [ ] API contract compatibility verified across agent outputs
- [ ] Cross-agent consistency review by dedicated reviewer agent
- [ ] End-to-end test suite passes

---

## 7. Human-in-the-loop: a risk-based decision framework

Meta's "Rule of Two" provides the clearest framework for when human intervention is mandatory. An agent may satisfy at most two of three properties: **(A)** processing untrustworthy inputs, **(B)** accessing sensitive systems or private data, and **(C)** changing state or communicating externally. If all three are required, the agent **must not operate autonomously**. This rule is grounded in hard evidence: a joint paper from OpenAI, Anthropic, and Google DeepMind researchers bypassed 12 published prompt injection defenses with **>90% success rate**, making architectural separation the only reliable defense.

Anthropic's empirical research across 500K+ sessions found that on complex tasks, Claude's own check-in rate roughly doubles to **16.4% of turns**, suggesting well-trained agents can learn to recognize genuine ambiguity and proactively pause. Microsoft's Agent Governance Toolkit implements a policy engine classifying actions as `DESTRUCTIVE_DATA`, `DATA_EXFILTRATION`, or `PRIVILEGE_ESCALATION`, then blocking, routing for approval, or downgrading trust accordingly.

Trust tiers should model CPU privilege rings: new agents start at the lowest tier (read-only, sandboxed) and earn elevated access through demonstrated reliability, with trust scores that decay over time without positive signals.

### Protocol checklist: human oversight gates

**Actions requiring mandatory human approval:**
- [ ] Production deployments
- [ ] Infrastructure or cloud configuration changes
- [ ] Security configuration changes (IAM, firewall, access policies)
- [ ] Production data deletion or schema changes
- [ ] Secret/credential creation, modification, or rotation
- [ ] External communications (emails, API calls to third parties)
- [ ] Privilege escalation requests
- [ ] Adding new third-party dependencies
- [ ] Cross-tenant or cross-organizational operations
- [ ] Any irreversible operation

**Trust tier enforcement:**
- [ ] Tier 0 (Observe): Read-only analysis—no approval required
- [ ] Tier 1 (Suggest): Generate recommendations/drafts—human reviews output
- [ ] Tier 2 (Modify): Write code/files—approval required before execution
- [ ] Tier 3 (Build): Execute builds/tests—approval for first run, then auto
- [ ] Tier 4 (Deploy): Deploy to any environment—always requires human approval
- [ ] Tier 5 (Administer): Modify permissions/security—multi-party approval required

**Escalation triggers:**
- [ ] Agent encounters ambiguity about user intent
- [ ] Action risk score exceeds configured threshold (≥7 on 1–10 scale)
- [ ] Behavior anomaly detected (volume, scope, or timing deviation)
- [ ] Policy violation attempted
- [ ] Multiple sequential failures (≥3)
- [ ] Approaching resource consumption limits (≥90% of budget)
- [ ] Agent attempts access outside authorized scope
- [ ] Rule of Two violated: all three risk properties simultaneously present

---

## 8. Agent memory and context management

Context window budget allocation determines agent effectiveness. Anthropic's internal testing shows quality degradation begins at **~70% context utilization**, making proactive compaction essential. Claude Code operates within a ~200K token context window, shared across system prompt (~4.2%), conversation history (~45.8%), tool results (~26.7%), and a reserved response buffer (~20,000 tokens).

The industry has converged on a tiered memory architecture inspired by MemGPT/Letta: **Tier 1 (Main Context/"RAM")** holds system instructions (read-only), core memory (read/write for key facts), and recent conversation history. **Tier 2 (External Context/"Disk")** holds archival memory (long-term, searchable vector store) and recall memory (searchable conversation database). The agent manages its own memory through explicit function calls like `core_memory_append` and `archival_memory_search`.

For coding agents, RAG patterns have shifted away from pure vector search toward hybrid approaches. Cursor, Claude Code, and Aider all start by understanding codebase structure through file-tree navigation and grep-based exact search, supplementing with semantic indexing rather than relying on it primarily. For large codebases (10K+ repos), Qodo recommends narrowing to **5–10 relevant repositories** based on metadata before fine-grained retrieval.

### Protocol checklist: context management

- [ ] Allocate context budget: System Instructions **10–15%**, Tools **15–20%**, Knowledge **30–40%**, History **20–30%**, Buffer **10–15%**
- [ ] Trigger context compaction at **70% utilization**—not at 90%
- [ ] Schedule compression every **10–15 tool calls** for coding agents (achieves ~22.7% token savings)
- [ ] Apply compaction strategies in order: tool result replacement (gentle) → summarization (moderate) → sliding window (aggressive) → truncation (emergency)
- [ ] Each parallel agent gets its **own isolated context window**; share state through filesystem or typed message passing only
- [ ] Prevent context pollution: agent cannot access another agent's context or conversation history
- [ ] Limit tools to **≤15 per agent invocation** (all models degrade with excessive tools)
- [ ] Use file-tree + grep-first retrieval for codebase context; supplement with semantic search
- [ ] Implement long-term memory with tiered architecture: core memory (always in-context) + recall memory (searchable DB) + archival memory (vector store)
- [ ] Ground RAG-based agents explicitly: "Base all code changes ONLY on the retrieved context provided. Do NOT invent API signatures not present in retrieved context."

---

## 9. Error recovery, circuit breakers, and rollback strategies

Agent failures fall into four categories: syntactic errors (malformed JSON/tool calls), semantic errors (valid but nonsensical output), environmental errors (API downtime, rate limits), and intentional errors (hallucinations the agent doesn't realize). A critical discovered pattern is **silent truncation**—when a model hits `max_output_tokens` mid-generation, the runtime may silently proceed with corrupted output, documented as the root cause of a 20-hour subagent death spiral.

LangGraph's checkpointing model saves graph state at every "super-step" boundary, storing pending writes from successfully completed nodes even when other nodes fail at the same step. On restart, the graph resumes from the last successful step, executing only incomplete nodes. For multi-agent workflows with external side effects, the Saga pattern (formalized in SagaLLM at VLDB 2025) pairs each operation with a compensating transaction—on failure, compensations fire in reverse order.

Circuit breakers adapted for agents follow the standard three-state model (CLOSED → OPEN → HALF-OPEN) with agent-specific additions: step limits, cost limits, repetition detectors (same tool called three times with identical parameters = stuck), and quality circuit breakers.

### Protocol checklist: error recovery

**Circuit breaker configuration:**
- [ ] Trip threshold: **5 failures** → circuit opens
- [ ] Cooldown period: **60 seconds** before half-open probe
- [ ] Max iterations per agent: **15–25 steps** (hard cap enforced in code)
- [ ] Cost limit per task: **$2–5** for standard tasks (configurable by complexity tier)
- [ ] Repetition detection: **≥3 identical consecutive tool calls** → terminate immediately
- [ ] No-progress detection: **3–5 steps** with no state change → terminate
- [ ] Wall-clock timeout: **300 seconds** for most tasks

**Retry policy:**
- [ ] Use exponential backoff with jitter: `wait = (base_delay × 2^attempt) + random(0, jitter_max)`
- [ ] Retryable HTTP codes: 429, 500, 502, 503
- [ ] Max **3–5 retries** before routing to dead letter queue
- [ ] Implement model fallback chain: primary model → cheaper same-provider → different provider → local model
- [ ] Inject literal error message into conversation history for try-rewrite-retry pattern
- [ ] Generate unique `requestId` for every tool call to ensure idempotency during retries

**Rollback and recovery:**
- [ ] Checkpoint after every tool call or logical unit of work
- [ ] Store checkpoints in durable storage (PostgreSQL/Redis for production, not in-memory)
- [ ] On failure, resume from last checkpoint—not from the beginning
- [ ] Preserve partial work: store completed artifacts, reasoning chains, and confidence scores
- [ ] For multi-step workflows, implement Saga pattern with compensating transactions for each operation
- [ ] On graceful termination (budget/iteration limit hit), synthesize best answer from accumulated work before stopping
- [ ] Dead letter queue captures: original task data, failure reason, retry count, agent context snapshot, reasoning chain
- [ ] Monitor DLQ depth as a system health indicator

---

## 10. Monitoring and observability across agents

**OpenTelemetry GenAI Semantic Conventions** (v1.37+) are the industry standard for agent telemetry. Span naming follows `{operation} {name}` format, with standard attributes including `gen_ai.agent.name`, `gen_ai.tool.name`, and `gen_ai.operation.name`. Token metrics use `gen_ai.client.token.usage` counters with `gen_ai.token.type` dimensions. The critical shift is from reactive log-based monitoring to proactive structured tracing with typed observation data.

Detecting stuck or looping agents requires defense in depth—max iterations alone is insufficient. Production systems combine loop fingerprinting (hash recent tool calls + results, flag when same fingerprint repeats ≥3 times), no-progress detection (N steps with no new state change), token burn rate monitoring (flag >200× baseline rate), and cost accumulation tracking. A real-world incident saw an API format change cause a **200× token burn spike**, costing $50 in 40 minutes before detection.

Observability platforms span multiple categories. LangSmith provides native LangChain integration with near-zero overhead. Langfuse offers framework-agnostic, self-hostable monitoring built on OpenTelemetry. Helicone requires only 15-minute setup with proxy-based instrumentation. Arize Phoenix specializes in drift detection and embedding analysis.

### Protocol checklist: monitoring requirements

**Logging and tracing:**
- [ ] Implement OpenTelemetry GenAI semantic conventions on all agent spans
- [ ] Every span includes: `agent_id`, `task_type`, `conversation_thread`, `business_context`
- [ ] Maintain parent-child span relationships across multi-agent calls
- [ ] Attach `user.id` and `session.id` to root spans for session correlation
- [ ] Store prompts and completions in span events (not attributes) with opt-in content capture

**Real-time detection:**
- [ ] Loop fingerprinting: flag **≥3 identical consecutive tool call fingerprints**
- [ ] Token burn rate: alert when **>10× baseline** per-minute token consumption detected
- [ ] No-progress detection: alert after **3–5 steps** with no state change
- [ ] Context window utilization: alert at **>83%** fill rate
- [ ] Error rate: warn at **>5%**, critical at **>15%**

**Dashboard requirements:**
- [ ] Tier 1 (Real-time): Token usage (input/output/cached by model/agent), cost accumulation graph, active agent count, error rate timeline, latency P50/P99
- [ ] Tier 2 (Behavior): Trace waterfall, step-by-step execution replay, tool call frequency/success rates, context utilization gauge
- [ ] Tier 3 (Analytics): Cost breakdown by agent/task/user, token efficiency trends, quality score trends, drift detection, model comparison

---

## 11. Cost management and token economics

Naive agent loops create a **quadratic cost problem**: each step adds to the context window, causing cumulative input tokens to grow as `N×S + u×N(N+1)/2`. A 20-step loop where each step generates 1,000 tokens produces 210,000 cumulative input tokens—not the expected 20,000. Multi-agent systems compound this further: standard chat uses 1× tokens, a single agent uses ~4×, and multi-agent uses **~15×**.

Research on OpenHands agent tasks reveals token usage exhibits **up to 10× variance** across runs for similar complexity, making pre-execution cost prediction extremely challenging (Pearson's r < 0.15). This demands hard enforcement in code, not soft prompting. Key optimization levers include prompt caching (reducing input costs by **90%** for repeated context), batch API processing (**50% discount** for non-urgent workloads), and multi-model routing (using a cheaper model for 70% of routine tasks saved one team from $42K to $29K monthly with zero user complaints).

Claude Code uses **5.5× fewer tokens** than Cursor for identical tasks (33K vs. ~180K), highlighting that harness design matters enormously. Augment Code found that **67.6% of tokens** come from tool results, and 40–60% of those are removable with no performance loss. Context compression every 10–15 tool calls achieves 22.7% savings while matching baseline accuracy.

### Protocol checklist: cost controls

**Budget allocation:**
- [ ] Set per-task token budget by complexity tier: Simple ≤100K tokens, Moderate ≤500K, Complex ≤2M
- [ ] Set per-task cost cap: Simple ≤$0.50, Moderate ≤$5, Complex ≤$50
- [ ] Set per-user daily spending limit (configurable)
- [ ] Set per-sprint budget = (historical average × expected tasks) + 30% buffer
- [ ] Reserve 10–15% of context window as emergency buffer

**Cost optimization requirements:**
- [ ] Enable prompt caching for all system prompts and repeated context
- [ ] Route tasks to cheapest adequate model: Haiku for classification → Sonnet for standard coding → Opus for complex reasoning
- [ ] Use batch API for non-interactive tasks (code review, test generation, documentation)
- [ ] Implement sliding-window context management to prevent quadratic cost growth
- [ ] Compress tool results every 10–15 calls
- [ ] Constrain output with structured JSON schemas and explicit length limits

**Termination triggers (enforce in code, not prompts):**
- [ ] Token budget exceeded → synthesize and stop
- [ ] Cost budget exceeded → synthesize and stop
- [ ] Max iterations reached → append "provide best answer" message, call model once more without tools, then stop
- [ ] Wall-clock timeout exceeded → stop
- [ ] Loop detected → stop immediately
- [ ] Progressive budget alerts at **50%, 75%, 90%, 100%** of allocated budget

**Efficiency metrics to track weekly:**
- [ ] Cost per successful task (by task type)
- [ ] Token efficiency ratio: useful output tokens / total tokens consumed (target >30%)
- [ ] Task completion rate (target >80%)
- [ ] Rework rate: tasks requiring human correction (target <20%)
- [ ] FTE equivalence: human hours replaced / agent cost

---

## 12. Security controls for multi-agent execution

The OWASP Top 10 for Agentic Applications (released December 2025 by 100+ experts) identifies the critical risks: Agent Goal Hijack (ASI01), Tool Misuse (ASI02), Identity & Privilege Abuse (ASI03), Agentic Supply Chain (ASI04), Sensitive Data Exposure (ASI05), Unsafe Inter-Agent Communication (ASI06), Memory Poisoning (ASI07), Cascading Failures (ASI08), Uncontrolled Autonomy (ASI09), and Rogue Agents (ASI10). These compound multiple LLM vulnerabilities—autonomous multi-step execution amplifies impact far beyond single-response attacks.

**Prompt injection remains an unsolved problem.** Joint research from OpenAI, Anthropic, and Google DeepMind (October 2025) bypassed 12 published defenses with >90% attack success rate. Multi-agent systems face additional risks: attacks from compromised agents propagate across the system, defenses designed for single-agent injection do not reliably transfer, and narrowly scoped defenses may inadvertently increase vulnerability to other attack types. The only reliable mitigation is architectural: the Rule of Two, defense-in-depth layers, and principle of least privilege.

Non-human identities (NHIs) outnumber human accounts **>90:1** in average enterprises. Each AI agent merges the permissions of every key, token, and service account assigned to it—a single compromised agent inherits all their authority.

### Protocol checklist: security controls

**Identity and access:**
- [ ] Each agent has a unique, verifiable digital identity (service account or DID)
- [ ] Agents never inherit developer/user credentials—each gets its own OAuth client ID
- [ ] Implement RBAC with context-aware, time-limited permissions (JIT access)
- [ ] Delegation chains enforce **scope narrowing only**—child agents can never exceed parent permissions
- [ ] Trust scores decay over time without positive signals
- [ ] Revoke credentials immediately upon task completion

**Execution sandboxing:**
- [ ] Run untrusted code execution in **MicroVMs (Firecracker/Kata)** or **gVisor** isolation
- [ ] Zero external network access by default; route all traffic through logging proxy
- [ ] Drop all unnecessary Linux capabilities (no `CAP_SYS_ADMIN`)
- [ ] Block access to `.env`, SSH keys, and credential files
- [ ] Enforce per-agent resource limits: CPU, memory, execution time, API call rate
- [ ] Command allowlists: only pre-approved commands can execute

**Prompt injection defense (defense-in-depth):**
- [ ] Input sanitization layer on all external content before agent processing
- [ ] Provenance tracking: record modality, source, and trust level of every prompt/output
- [ ] Coordinator/gateway screening agent classifies inputs before core processing
- [ ] Validate all agent outputs before passing to downstream agents or tools
- [ ] **Enforce Rule of Two**: never allow an agent simultaneous access to untrusted inputs + sensitive data + external communication
- [ ] Regular red-teaming and penetration testing (quarterly minimum)

**Audit trail requirements:**
- [ ] Every audit entry captures: action taken, authenticated agent identity, full delegation chain to human authorizer, policy evaluation details, timestamp, resource involved, outcome
- [ ] Logs are **immutable and tamper-evident** (append-only, cryptographically signed)
- [ ] Logs encrypted at rest and in transit
- [ ] Real-time SIEM integration for anomaly detection
- [ ] Monitor behavioral anomalies: volume (>10× normal record access), scope (unauthorized data categories), timing (outside authorized windows), attribution (inactive human authorizer)
- [ ] Retention: 7 years for financial services, 6 years for healthcare, minimum 1 year for all

---

## Real-world deployment patterns and hard-won lessons

Production case studies reveal consistent patterns. GitHub's Copilot Coding Agent works by assigning issues to `@copilot`, which analyzes the repo, works in an ephemeral Actions environment, and pushes commits to a draft PR—the requester cannot approve their own agent's PR. Elastic's self-healing CI/CD invokes Claude Code when builds fail, with the agent analyzing errors, iterating fixes, and committing to the PR branch automatically. Goldman Sachs is piloting Devin alongside 12,000 human developers. PwC boosted code-generation accuracy from **10% to 70%** using CrewAI agentic workflows.

But failures are equally instructive. Google DeepMind tested 180 configurations and found unstructured multi-agent networks amplify errors up to **17.2×**. UC Berkeley's MAST study analyzed 1,642 execution traces across 7 frameworks and found failure rates of **41–86.7%**, with coordination breakdowns accounting for 36.9% of all failures. In July 2025, a Replit AI coding agent **deleted a company's live database** of 1,000+ executive records and generated fake replacement data—root cause: wide production permissions with no blast-radius limits or human approval gate. A Sonar 2026 survey found that while 42% of committed code is now AI-generated, **96% of developers do not fully trust** its functional accuracy.

The counterintuitive finding from a randomized controlled trial of 16 experienced developers: AI tooling **increased task completion time by 19%**, even as developers believed they had become faster. This underscores why objective measurement—not developer sentiment—must drive adoption decisions.

### Protocol checklist: deployment readiness

- [ ] All 12 protocol sections above have been reviewed and applicable controls implemented
- [ ] Agent-generated PRs require CI passage AND human review before merge
- [ ] Agent cannot approve its own output; requestor cannot approve agent PR they initiated
- [ ] All agent commits are co-authored with both agent identity and human authorizer
- [ ] Internet access limited to a customizable trusted domain allowlist
- [ ] Agent knowledge base (CLAUDE.md, AGENTS.md, playbooks) is human-curated and ≤200 lines per tier-1 file
- [ ] Evaluation suite of ≥20 representative tasks runs as CI/CD gate before any agent system change deploys
- [ ] Quarterly red-team exercises deliberately inject erroneous output to measure error propagation
- [ ] Weekly review cadence established: cost trends, quality scores, loop incidents, DLQ depth, security anomalies
- [ ] Rollback plan documented and tested: can revert to fully human workflow within one sprint

---

## Conclusion: structured coordination beats agent proliferation

The research converges on a counterintuitive principle: **fewer well-coordinated agents outperform larger numbers of loosely coordinated ones.** DeepMind's scaling study shows performance gains saturate at roughly 4 agents per coordination tier. Anthropic achieves 90%+ performance improvement with a single orchestrator and a handful of subagents—not an army. MetaGPT's structured SOP pipeline with 5 fixed roles achieves 100% task completion at under $1.09 per task.

The protocols in this document encode that insight into enforceable checkpoints. Architecture decisions should start simple and add complexity only when measured. Tasks must be atomic, single-responsibility, and bounded by hard quantitative limits. Quality gates must be automated and mandatory—not advisory. Human oversight follows a risk-based framework where architectural separation (the Rule of Two) provides stronger guarantees than any prompt-based defense. Memory management requires proactive compaction at 70% utilization, not reactive cleanup at capacity. Error recovery demands circuit breakers, checkpointing, and saga patterns enforced in code rather than prompts. Cost controls must be hard-capped with progressive alerts, because token usage can spike 200× in minutes with no warning.

The organizations succeeding with multi-agent development share three traits: they invested in observability before scaling, they enforce quality gates as non-negotiable pipeline stages, and they treat agent output with the same rigor they would apply to code from an untrusted contributor. This protocol provides the checklist to replicate that discipline.