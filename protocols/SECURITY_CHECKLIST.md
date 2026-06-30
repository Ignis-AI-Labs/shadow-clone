# THE COMPREHENSIVE SECURITY AUDIT PROTOCOL

## A Universal Standard for Web3 and Software Security in the Age of Autonomous Agents

**Version:** 1.0 — April 2026  
**Scope:** Smart Contracts · Blockchain Infrastructure · Application Security · AI/LLM Systems · Operational Security · Regulatory Compliance  
**Intended Audience:** Security Auditors, CISOs, CTOs, Development Teams, Compliance Officers  
**License:** Open — adapt freely. Attribution appreciated.

---

## PURPOSE

This document defines a complete, zero-gap security audit protocol for any organization building at the intersection of Web3, traditional software, and AI. It is not a guideline — it is a checklist. Every item represents an attack surface that has been exploited in production, documented in academic research, or identified by threat intelligence as imminent.

In 2025, crypto exploits reached $3.4 billion — the worst year on record. Access control failures alone accounted for $953 million. The Bybit supply chain attack ($1.4 billion) proved that securing keys is insufficient when the signing interface itself is compromised. The OWASP Smart Contract Top 10 was rewritten for 2026. The OWASP LLM Top 10 confirmed prompt injection as the #1 threat for the second consecutive year. AI agents are now being deployed with real-world authority — and exploited through indirect injection, tool poisoning, and agent-to-agent manipulation.

The era of "we'll get to it later" is over. Autonomous agents can chain exploits across overlooked surfaces in minutes. This protocol exists to ensure nothing is overlooked.

---

## HOW TO USE THIS DOCUMENT

**Priority Tags:**

- **[CRITICAL]** — Must pass before any code reaches production. Deployment blocker.
- **[HIGH]** — Must be resolved within 90 days. No exceptions.
- **[MEDIUM]** — Must be resolved within 180 days.
- **[LOW]** — Must be resolved within 12 months.

**Status Markers:**

- `[ ]` — Not yet verified
- `[x]` — Verified and passing
- `[!]` — Verified and FAILING — remediation required
- `[~]` — Partially passing — documented exception with compensating control
- `[N/A]` — Not applicable to this engagement — justification documented

**Scope:** Not every section applies to every project. Before beginning an audit, the lead auditor and the engineering team must jointly determine which sections are in scope. Sections marked N/A must include a written justification. "We don't think it's relevant" is not a justification — "the project does not deploy smart contracts" is.

---

## HOW AUDITS SHOULD BE CONDUCTED

### Audit Philosophy

An audit is not a checkbox exercise. It is an adversarial evaluation of a system's ability to withstand attack by motivated, well-resourced actors — including, as of 2026, autonomous AI agents capable of discovering and chaining exploits faster than human defenders can respond.

The auditor's job is to think like an attacker, communicate like an advisor, and document like a lawyer.

### Pre-Engagement

- [ ] Scope defined in writing — which contracts, systems, chains, and environments are included
- [ ] All source code, architecture documentation, and deployment configurations provided to auditors
- [ ] Known issues and prior audit reports shared — auditors should not rediscover known problems
- [ ] Threat model reviewed jointly — what assets are at risk, who are the adversaries, what are the trust assumptions
- [ ] Test environment provisioned that mirrors production — auditors should never test against live systems with real funds
- [ ] Communication channel established for critical findings that require immediate response
- [ ] Timeline agreed — with explicit understanding that rushing an audit compromises quality

### During the Audit

- [ ] Findings documented with severity (Critical/High/Medium/Low/Informational), description, proof of concept, and recommended fix
- [ ] Critical findings communicated immediately — do not wait for the final report
- [ ] All findings include root cause analysis — not just "what" but "why" this vulnerability exists
- [ ] Business logic reviewed, not just code — many exploits are logically correct code that produces unintended economic outcomes
- [ ] Edge cases, boundary conditions, and adversarial inputs tested — not just happy paths
- [ ] Cross-contract and cross-chain interaction points tested as a system, not as isolated components
- [ ] Automated tooling used as a supplement, never a substitute, for manual expert review

### Post-Audit

- [ ] Final report delivered with executive summary, detailed findings, and prioritized remediation roadmap
- [ ] Remediation verified — fixes are reviewed to confirm they actually resolve the finding without introducing new issues
- [ ] Re-audit triggered by any material change: contract upgrade, new chain deployment, architecture change, dependency update
- [ ] Audit report published (redacting sensitive implementation details) — transparency builds trust
- [ ] Lessons learned documented and fed back into development practices

### Audit Independence

- [ ] Auditors have no financial interest in the project beyond the audit fee
- [ ] Minimum two independent audit firms engaged for any system securing >$10M in value
- [ ] Competitive audit contests (Sherlock, Code4rena, Immunefi Boost) used as a complement to firm audits — not a replacement
- [ ] No single auditor or firm is relied upon indefinitely — rotate firms every 12–18 months to bring fresh perspectives

---

## 1. SMART CONTRACT SECURITY

### 1.1 Access Control [CRITICAL]

- [ ] Every privileged function has explicit role-based access control (OpenZeppelin AccessControl or equivalent)
- [ ] No function defaults to open access — default-deny is enforced
- [ ] Admin/owner keys are protected by multi-sig (minimum 3-of-5 for operations, 5-of-9 for treasury)
- [ ] Timelocks enforced on all admin actions (minimum 48 hours for critical changes)
- [ ] Role assignment requires multi-sig approval — no single key can grant or revoke roles
- [ ] Emergency pause functionality exists and cannot be weaponized by a single actor
- [ ] All access-controlled functions tested with unauthorized callers (expect revert)
- [ ] Privilege escalation paths mapped and verified as dead ends
- [ ] No hardcoded addresses with special privileges that bypass the access control system
- [ ] Deployer privileges renounced or transferred to governance after deployment

### 1.2 Reentrancy [CRITICAL]

- [ ] Checks-Effects-Interactions (CEI) pattern enforced on all state-changing functions
- [ ] Reentrancy guard (mutex) deployed on every function that transfers value or makes external calls
- [ ] Cross-contract reentrancy tested — especially between interacting protocol contracts
- [ ] Read-only reentrancy tested — view functions cannot return stale state during external calls
- [ ] All callback surfaces audited: ERC-721/1155/3525 transfer hooks, receive/fallback functions, flash loan callbacks
- [ ] No external calls made before state updates — any exceptions individually documented and justified

### 1.3 Integer Arithmetic [CRITICAL]

- [ ] Solidity ≥0.8.x used with built-in overflow/underflow checks, or SafeMath on legacy contracts
- [ ] All arithmetic fuzzed with extreme values: 0, 1, type(uint256).max, type(int256).min
- [ ] `unchecked` blocks individually justified, documented, and tested
- [ ] Type casting verified for truncation and sign issues (uint256 → uint128, int → uint)
- [ ] Precision loss in division operations tested with dust accumulation over thousands of iterations
- [ ] Shift operations verified for overflow (reference: Cetus $223M exploit, May 2025)
- [ ] Rounding direction explicitly chosen and documented (round up vs. round down) in financial calculations

### 1.4 Flash Loan Resistance [CRITICAL]

- [ ] No governance, pricing, or balance checks rely on same-block state
- [ ] Minimum holding periods enforced before voting or staking eligibility
- [ ] Oracle pricing uses multi-block TWAP (minimum 30 minutes)
- [ ] Same-block deposit-and-action patterns blocked where economically relevant
- [ ] Flash loan attack simulations run against all DeFi-connected functions

### 1.5 Oracle Security [CRITICAL]

- [ ] Decentralized oracle feeds used (Chainlink, Pyth, or equivalent) — no single-source oracles
- [ ] Staleness checks enforced — prices older than a defined threshold are rejected
- [ ] Deviation checks enforced — prices deviating more than X% from previous update are flagged or rejected
- [ ] Fallback oracles configured for all critical price feeds
- [ ] Oracle manipulation simulated with thin-liquidity pool scenarios
- [ ] No AMM spot prices used as oracles for financial calculations
- [ ] Oracle update frequency verified as sufficient for the use case (liquidations require high frequency)

### 1.6 MEV Protection [HIGH]

- [ ] Private mempools used for sensitive transactions (Flashbots Protect, Jito bundles, or equivalent)
- [ ] Slippage controls enforced with reasonable bounds on all user-facing swaps
- [ ] Commit-reveal patterns used where front-running is a risk
- [ ] MEV-protected RPC endpoints configured for all deployed chains
- [ ] Sandwich attack simulations run against all swap functions
- [ ] Transaction ordering dependencies documented and mitigated

### 1.7 Proxy and Upgradeability [CRITICAL]

- [ ] `_disableInitializers()` called in implementation contract constructors
- [ ] Storage layout uses `__gap` variables with append-only pattern
- [ ] `slither-check-upgradeability` passes on every upgrade
- [ ] Upgrade path requires multi-sig + timelock — no single key can upgrade
- [ ] Implementation contract cannot be self-destructed or directly called in a harmful way
- [ ] Storage collision tests run between all proxy versions
- [ ] Upgrade simulated on fork before mainnet deployment
- [ ] Function selector clashing verified between proxy and implementation
- [ ] Initialization functions can only be called once and cannot be re-triggered after upgrade

### 1.8 Governance Security [HIGH]

- [ ] Token holding period required before voting eligibility (minimum 7 days recommended)
- [ ] Execution timelock ≥48 hours on all governance proposals
- [ ] Dynamic quorum that scales with treasury value or total supply
- [ ] Voting power snapshots use previous-block state (not same-transaction)
- [ ] Cross-chain voting power deduplicated — no double-counting across chains
- [ ] Proposal execution targets restricted — no arbitrary external contract calls
- [ ] Flash-loaned governance attacks simulated and blocked
- [ ] Proposal creation rate-limited per address
- [ ] Cancelled or defeated proposals cannot be re-executed

### 1.9 Business Logic [CRITICAL]

- [ ] Protocol invariants defined in writing (e.g., "total supply never exceeds X", "user balance ≤ deposited amount")
- [ ] Invariant tests run continuously via fuzzing (Foundry, Echidna, or Medusa)
- [ ] Economic attack modeling conducted — is it profitable to attack this protocol at current TVL?
- [ ] Fee calculations tested with extreme values and edge cases
- [ ] Liquidation logic tested under extreme market conditions (99%+ price drops)
- [ ] Reward/emission calculations tested over full lifecycle (years of simulated operation)
- [ ] All state transitions enumerated and tested — no reachable but unintended states

### 1.10 Recommended Smart Contract Tooling (2026)

**Static Analysis:** Slither, Mythril, Aderyn (Cyfrin), Semgrep (Solidity rules)  
**Formal Verification:** Certora Prover, Halmos, KEVM  
**Fuzzing:** Foundry forge fuzz, Echidna, Medusa  
**AI-Assisted:** Nethermind AuditAgent, QuillShield  
**Monitoring:** Forta Network, OpenZeppelin Defender, Tenderly  
**Reference:** OWASP Smart Contract Top 10:2026, SWC Registry

---

## 2. BLOCKCHAIN INFRASTRUCTURE

### 2.1 Bridge Security [CRITICAL]

- [ ] Supply conservation invariant enforced: wrapped/minted tokens ≤ locked collateral (always, on every block)
- [ ] Validator/relayer set minimum 5-of-9 with Threshold Signature Schemes — 2-of-3 is categorically insufficient
- [ ] Validators geographically distributed and organizationally independent
- [ ] HSM-backed signing for all bridge validators
- [ ] Message verification includes cryptographic source chain proof with chain ID
- [ ] Replay prevention: unique nonces per sender, chain ID in signed payload, message expiration timestamps
- [ ] Volume-based circuit breakers with per-chain pause capability
- [ ] Velocity controls limiting fund exit speed (e.g., no more than X% of TVL per hour)
- [ ] Time-locked withdrawals for amounts exceeding threshold
- [ ] Dual independent audits completed before deployment
- [ ] Re-audit required after any bridge upgrade — no exceptions
- [ ] Real-time monitoring with automated alerting on anomalous flows

### 2.2 Zero-Knowledge Proof Security [HIGH]

- [ ] Under-constrained circuit analysis completed (96% of known ZK bugs stem from this)
- [ ] Fiat-Shamir transcript verified — ALL components included in challenge hash
- [ ] Verifier contract rejects proofs generated from wrong or modified circuits
- [ ] Trusted setup ceremony independently audited (if applicable — prefer STARKs or Halo2 for no trusted setup)
- [ ] Soundness proof reviewed by ZK specialist firm
- [ ] Field overflow validated — EVM 256-bit values larger than the snark scalar field must be rejected
- [ ] Nullifier/commitment tracking prevents proof replay
- [ ] Gas limits sufficient for verification — DoS via gas exhaustion tested
- [ ] ZK compiler version pinned and tested for known compiler bugs (reference: MTZK found 21 bugs in 4 compilers)

### 2.3 Consensus Mechanism Security [HIGH]

*Applicable to custom L1/L2 chains or appchains.*

- [ ] Formal specification modeled in TLA+, Alloy, or equivalent
- [ ] Fork choice rule formally verified for safety and liveness
- [ ] Cost-of-attack analysis: attack cost must exceed value secured at all realistic participation rates
- [ ] Network simulation under adversarial conditions: massive churn, gossip layer spam, Byzantine behavior at threshold
- [ ] Slashing logic verified — cannot be gamed to punish honest participants
- [ ] Epoch/round transitions tested for edge cases (zero validators, max validators, mid-transition failures)
- [ ] Time source manipulation resistance verified — block.timestamp dependency minimized

### 2.4 Cross-Chain Security [HIGH]

- [ ] Total supply conservation verified across ALL deployed chains
- [ ] Emission caps (if applicable) enforced globally — no chain can independently exceed allocation
- [ ] All EIP-712 domain separators include chain ID and contract address
- [ ] Bridge messages require sufficient source chain finality before release on destination
- [ ] Chain-specific differences documented and tested: account models, gas pricing, finality times, signature schemes
- [ ] Cross-chain message ordering and idempotency verified

### 2.5 Solana-Specific Checks [HIGH]

*Applicable to any project deploying on Solana.*

- [ ] Program upgrade authority is multi-sig controlled — not a single keypair
- [ ] All CPI (Cross-Program Invocation) calls validate signer and program ownership
- [ ] Account ownership checks enforced on every instruction handler
- [ ] PDA bump seeds verified and canonical bumps used
- [ ] Anchor constraints applied and tested with unauthorized/malicious accounts
- [ ] Rent exemption handled correctly for all accounts
- [ ] Duplicate mutable account references checked (Solana-specific vulnerability class)

### 2.6 EVM L2-Specific Checks [HIGH]

*Applicable to Base, Arbitrum, Optimism, Polygon, and similar.*

- [ ] Sequencer trust assumptions documented — centralized sequencers can censor and reorder
- [ ] Optimistic rollup withdrawal delay (7 days) implications documented for users
- [ ] Gas pricing model differences from L1 tested in all contracts
- [ ] L1 → L2 message passing verified for edge cases (delayed messages, reorgs)
- [ ] Sequencer downtime handling tested — contracts behave correctly when sequencer is unavailable

### 2.7 Wallet and Key Management [CRITICAL]

- [ ] Hot wallets hold ≤10% of total assets — remainder in air-gapped cold storage
- [ ] HSMs are CC EAL5+ certified, FIPS 140-2/3 Level 3+ compliant
- [ ] MPC or multi-sig with threshold signing for all operational wallets
- [ ] Key share refresh performed on schedule
- [ ] Seed phrases stored via Shamir Secret Sharing in geographically separated secure vaults
- [ ] Key generation performed on air-gapped machines with hardware entropy sources (TRNG)
- [ ] Signing interface integrity verified — supply chain attack surface assessed (reference: Bybit $1.4B, Feb 2025)
- [ ] Key rotation procedures documented, tested, and rehearsed
- [ ] Compromised key recovery plan documented with defined RTO
- [ ] Transaction simulation/verification before signing — what you see is what you sign

---

## 3. APPLICATION SECURITY

### 3.1 OWASP Top 10:2025 [CRITICAL]

- [ ] **A01 Broken Access Control:** Every endpoint tested for IDOR/BOLA — users cannot access others' resources
- [ ] **A02 Cryptographic Failures:** No sensitive data transmitted without TLS 1.3; no weak or deprecated ciphers
- [ ] **A03 Supply Chain Failures:** All dependencies pinned and scanned; SBOM generated; malicious package detection active
- [ ] **A04 Injection:** All inputs parameterized — no string concatenation in queries, commands, or template rendering
- [ ] **A05 Security Misconfiguration:** Default credentials removed; unnecessary features disabled; error messages sanitized
- [ ] **A06 Vulnerable Components:** Dependency scanning in CI/CD; auto-alerts on new CVEs; patch SLA ≤72 hours for critical
- [ ] **A07 Authentication Failures:** MFA enforced for all privileged accounts; session tokens cryptographically random
- [ ] **A08 Data Integrity Failures:** Deserialization inputs validated; CI/CD pipeline integrity verified; software signatures checked
- [ ] **A09 Logging Failures:** Security events logged with tamper-evident storage; no sensitive data in logs; log injection prevented
- [ ] **A10 Mishandling Exceptional Conditions:** All error paths tested; no stack traces, internal paths, or system state leaked to users

### 3.2 API Security [CRITICAL]

- [ ] Rate limiting enforced on all endpoints — especially authentication, trading, and financial operations
- [ ] Input validation on all parameters — type, length, range, format, encoding
- [ ] Output encoding prevents XSS in all responses
- [ ] CORS configured with explicit allowed origins — no wildcards in production
- [ ] CSRF protection on all state-changing requests
- [ ] API keys rotatable and revocable instantly
- [ ] GraphQL introspection disabled in production (if applicable)
- [ ] File upload validation: type whitelist, size limits, content scanning, no path traversal
- [ ] Mass assignment prevention — only explicitly allowed fields accepted in mutations
- [ ] Pagination enforced on all list endpoints to prevent resource exhaustion

### 3.3 WebSocket Security [CRITICAL]

- [ ] Token-based authentication on WebSocket upgrade handshake — not cookie-only
- [ ] Origin header strictly validated
- [ ] WSS (TLS) mandatory — no unencrypted WebSocket connections permitted
- [ ] Per-connection message rate limits enforced
- [ ] Replay prevention on sensitive messages (nonces and/or timestamps)
- [ ] Connection idle timeout configured
- [ ] Message size limits enforced to prevent memory exhaustion
- [ ] Graceful degradation under connection flooding

### 3.4 Web3 Authentication [CRITICAL]

- [ ] Wallet authentication via EIP-4361 (Sign-In with Ethereum) or chain-equivalent with domain binding
- [ ] Server-generated, single-use nonces for every signing request
- [ ] Signature expiry timestamps enforced — reject stale signatures
- [ ] Chain ID matching verified on every authentication attempt
- [ ] Server-side signature recovery verified against the claimed address
- [ ] Session tokens issued after successful wallet auth are cryptographically random, scoped, and expirable
- [ ] NFT-gated or token-gated access checks cannot be bypassed by address spoofing or replay

---

## 4. INFRASTRUCTURE SECURITY

### 4.1 Container Security [HIGH]

- [ ] All Docker images pinned by digest (SHA256) — no mutable tags (`:latest`, `:stable`)
- [ ] Image provenance verified with Cosign/Sigstore
- [ ] Vulnerability scanning (Trivy, Grype, or equivalent) integrated in CI/CD — builds fail on critical CVEs
- [ ] Runtime anomaly detection deployed (Falco or equivalent)
- [ ] No containers run as root unless explicitly justified and documented
- [ ] Read-only root filesystems enabled where possible
- [ ] Resource limits (CPU, memory) set on all containers
- [ ] No production credentials embedded in images — verified by scanning

### 4.2 Orchestration Security (Kubernetes) [HIGH]

- [ ] RBAC configured with least-privilege — no cluster-admin for application workloads
- [ ] Pod Security Standards enforced (Restricted profile as baseline)
- [ ] Default-deny NetworkPolicies applied to all namespaces
- [ ] Secrets managed through external secrets manager (HashiCorp Vault, AWS Secrets Manager, etc.) — not native K8s Secrets alone
- [ ] Admission controllers (OPA Gatekeeper, Kyverno) reject unsigned or unscanned images
- [ ] etcd encryption at rest enabled
- [ ] API server audit logging enabled and monitored
- [ ] Service mesh (Istio, Linkerd) for mTLS between services where applicable

### 4.3 CI/CD Pipeline Security [HIGH]

- [ ] All GitHub Actions (or equivalent) pinned by SHA — never by mutable tag
- [ ] Untrusted code does not trigger privileged pipeline steps (`pull_request` not `pull_request_target`)
- [ ] CI/CD token permissions restricted to minimum required (e.g., `GITHUB_TOKEN` scoped per job)
- [ ] Code review required before pipeline execution on protected branches
- [ ] SBOMs generated for every build (CycloneDX or SPDX format)
- [ ] SLSA Level 3+ achieved for hermetic, reproducible builds
- [ ] Malicious package detection active (Socket.dev, Snyk, or equivalent)
- [ ] Build artifacts signed and verified before deployment
- [ ] No secrets in CI/CD logs — masked or redacted in all output
- [ ] Third-party CI/CD plugins/actions audited and version-pinned

### 4.4 Network Security [HIGH]

- [ ] Network segmented by function: trading, AI compute, key management, public APIs — all isolated
- [ ] Firewall rules default-deny with explicit allow lists reviewed quarterly
- [ ] IDS/IPS deployed and actively monitored
- [ ] DNSSEC enabled on all domains
- [ ] TLS 1.3 on all external endpoints — TLS 1.2 only with explicit justification and compensating controls
- [ ] mTLS enforced for all internal service-to-service communication
- [ ] Administrative access via VPN or zero-trust network only — no direct SSH from public internet
- [ ] DDoS protection deployed with sufficient capacity (300+ Tbps for high-value targets)
- [ ] RPC node endpoints authenticated and rate-limited
- [ ] Self-operated validation/RPC nodes used to verify third-party RPC responses where feasible

### 4.5 Secrets Management [CRITICAL]

- [ ] Centralized secrets manager deployed in HA configuration (HashiCorp Vault, AWS SM, or equivalent)
- [ ] Dynamic credentials used where possible (database, cloud provider) with automatic expiration
- [ ] Pre-commit hooks (gitleaks, trufflehog) prevent secrets from being committed to version control
- [ ] All container images scanned for embedded credentials before deployment
- [ ] Secret rotation schedule defined and automated for all credential types
- [ ] Access to secrets logged, auditable, and alertable
- [ ] No secrets in environment variables visible to non-privileged processes
- [ ] Break-glass procedures for emergency secret access documented and tested annually

### 4.6 Server and OS Hardening [HIGH]

- [ ] OS patched within 72 hours for critical CVEs, 30 days for high
- [ ] Unnecessary services, ports, and packages removed
- [ ] SSH key-only authentication — password login disabled
- [ ] Host-based intrusion detection (OSSEC, Wazuh, or equivalent) on all servers
- [ ] File integrity monitoring on critical system files and binaries
- [ ] Secure boot enabled on all physical machines
- [ ] Automated security updates enabled for base OS packages
- [ ] Servers configured from hardened base images with drift detection — no manual one-off configurations

---

## 5. AI AND LLM SECURITY

*Applicable to any project integrating AI/LLM systems, RAG pipelines, AI agents, or AI-assisted trading/analysis.*

### 5.1 Prompt Injection Defense [CRITICAL]

- [ ] All external data sources sanitized before LLM ingestion — treated as untrusted input (this includes on-chain data, user content, API responses, scraped web content, and document uploads)
- [ ] Content boundary markers separate system instructions from retrieved/user-provided data
- [ ] Secondary classifier deployed on all external-source inputs before LLM processing
- [ ] Indirect injection tested with adversarial datasets specific to the data sources used
- [ ] System prompt protected against extraction attempts
- [ ] Input and output guardrails deployed (NeMo Guardrails, Llama Guard, or custom classifiers)
- [ ] Behavioral drift monitoring active — anomalous outputs trigger alerts

### 5.2 Agent Security [CRITICAL]

- [ ] All agent tool execution sandboxed — no direct access to production databases, wallets, or infrastructure
- [ ] Capability-based access control: agents can only invoke explicitly permitted actions
- [ ] Human-in-the-loop required for all actions above defined risk thresholds (financial transactions, data deletion, configuration changes)
- [ ] Kill switch exists for immediate halt of all autonomous agent actions
- [ ] Agents cannot modify their own permissions, configuration, tool access, or system prompts
- [ ] Agent-to-agent communication authenticated, encrypted, and logged
- [ ] MCP (Model Context Protocol) server connections scoped to minimum required tools
- [ ] Tool input validation enforced — agents cannot pass arbitrary payloads to tools
- [ ] Agent action logs maintained with full reasoning chains for audit

### 5.3 Data Poisoning and Model Integrity [HIGH]

- [ ] Training and fine-tuning data provenance tracked and verified
- [ ] Fine-tuning datasets audited for adversarial samples before use
- [ ] Model weights checksummed and verified against known-good hashes before every deployment
- [ ] Model supply chain secured — no untrusted model downloads in production pipelines
- [ ] RAG document sources verified for authenticity and integrity before embedding
- [ ] Vector database tenant isolation enforced — no cross-user or cross-organization data leakage
- [ ] Embedding inversion resistance considered — sensitive data may be partially recoverable from embeddings

### 5.4 Output Safety [CRITICAL]

- [ ] Hallucination detection layer active on all outputs that drive decisions or actions
- [ ] LLM outputs include confidence indicators — low-confidence responses flagged for human review
- [ ] Financial or factual data in LLM responses cross-validated against ground truth sources
- [ ] Output filtering prevents disclosure of system prompts, API keys, internal architecture, or training data
- [ ] Rate limiting on LLM APIs to prevent unbounded consumption and cost attacks
- [ ] Staged deployment: sandbox → monitored live → full production

### 5.5 AI-Driven Financial Safeguards [CRITICAL]

*Applicable to any project using AI for trading, portfolio management, or financial decision-making.*

- [ ] Hard loss caps enforced per trade, per session, per day — non-bypassable by the AI
- [ ] Position size limits enforced independently of AI recommendations
- [ ] Circuit breakers halt AI trading on abnormal market conditions
- [ ] Flash crash detection with automatic position reduction
- [ ] All AI-driven trades logged with full reasoning chain, input data, and confidence score
- [ ] No auto-execution of trades based solely on LLM text output — deterministic validation required
- [ ] Cross-validation with non-AI models required before execution
- [ ] Risk-penalty terms in AI objective functions prevent excessive risk-taking

### 5.6 Jailbreak and Guardrail Bypass Resistance [HIGH]

- [ ] Red team testing conducted quarterly using current jailbreak techniques (at minimum: roleplay/DAN, multi-turn escalation, Unicode/homoglyph injection, multilingual exploitation, encoding attacks, adversarial suffixes, PAIR)
- [ ] Multi-turn escalation attacks tested — success rates climb significantly over 3+ turns
- [ ] Layered defense deployed: input classifier + model-level alignment + output classifier
- [ ] Jailbreak detection metrics tracked longitudinally — no degradation accepted without remediation
- [ ] Model updates re-tested against full jailbreak suite before deployment

---

## 6. DATA SECURITY AND PRIVACY

### 6.1 Encryption [CRITICAL]

- [ ] AES-256 (or equivalent) for all data at rest — databases, file systems, backups, full-disk encryption
- [ ] TLS 1.3 minimum for all external API communications
- [ ] mTLS for internal service-to-service communication
- [ ] No raw PII stored on public blockchains — only hashed or encrypted references
- [ ] Encryption keys managed through HSM or secrets manager — never in application code or configuration files
- [ ] Key rotation schedule defined and automated

### 6.2 Data Classification [HIGH]

- [ ] All data classified into defined tiers (e.g., Critical, Confidential, Internal, Public)
- [ ] Each tier has defined handling, storage, transmission, access, and retention requirements
- [ ] Access controls enforced per classification tier — verified by audit
- [ ] Data retention and deletion policies defined, documented, and automated where possible
- [ ] Data inventory maintained — the organization knows where all sensitive data resides

### 6.3 Privacy Regulation Compliance [HIGH]

- [ ] GDPR compliance: hybrid on-chain/off-chain architecture for EU personal data; crypto-shredding for right-to-erasure; DPIAs before new processing activities; 72-hour breach notification
- [ ] Blockchain immutability reconciled with deletion rights through encryption key destruction or off-chain storage patterns
- [ ] Data Processing Agreements in place with all third-party processors
- [ ] Privacy policy accurately reflects actual data practices — not boilerplate
- [ ] Cookie/tracking consent mechanisms implemented where required by jurisdiction
- [ ] Cross-border data transfer mechanisms in place (SCCs, adequacy decisions, etc.)

### 6.4 Identity Document Security [CRITICAL]

*Applicable to any project handling KYC/identity verification.*

- [ ] Identity documents encrypted at rest with per-user or per-session keys
- [ ] Access to identity data logged, restricted, and subject to audit
- [ ] Identity documents deleted after regulatory retention period expires
- [ ] Identity verification provider security posture assessed (SOC 2, ISO 27001)
- [ ] No identity documents or biometric data stored on-chain — not even encrypted

---

## 7. EMERGING THREAT VECTORS (2026)

### 7.1 Deepfake and Synthetic Identity Defense [HIGH]

- [ ] Active liveness detection deployed — passive liveness alone is insufficient
- [ ] Injection attack detection implemented (camera bypass, SDK manipulation, virtual camera software)
- [ ] Camera feed integrity verified at the SDK level
- [ ] Layered verification: biometrics + device fingerprinting + behavioral analytics + risk scoring
- [ ] Document forensics go beyond OCR — detect synthetic/manipulated documents
- [ ] KYC provider tested against current deepfake tools (updated at least quarterly)
- [ ] Known synthetic identity patterns monitored (reference: DPRK 200% increase in synthetic wallet creation, 2025)

### 7.2 Post-Quantum Cryptography Preparedness [MEDIUM]

- [ ] Complete cryptographic asset inventory maintained (all algorithms, key sizes, and locations)
- [ ] Crypto-agility designed into systems — algorithms swappable without application rewrites
- [ ] NIST PQC standards evaluated: ML-KEM (FIPS 203) for key encapsulation, ML-DSA (FIPS 204) for signatures
- [ ] Hybrid deployments tested where feasible (e.g., ML-KEM + X25519)
- [ ] Performance impact of PQC on latency-sensitive operations assessed
- [ ] "Harvest now, decrypt later" risk assessed for long-lived secrets and sensitive communications
- [ ] Migration timeline tracked against NIST deprecation schedule (2035 target for full transition)

### 7.3 AI-Accelerated Exploitation Defense [HIGH]

- [ ] Patch SLA for AI infrastructure: critical CVEs patched within hours, not days
- [ ] AI-powered defensive scanning deployed continuously (not just periodic)
- [ ] Zero-trust architecture enforced for all infrastructure accessible to AI agents
- [ ] Threat intelligence feeds monitored for AI-generated exploit kits and tooling
- [ ] One-day vulnerability response plan: detect, patch, verify within 24 hours
- [ ] AI-specific CVEs tracked — volume increased 70% YoY (300 in 2023 → 1,000+ in 2025)

---

## 8. OPERATIONAL SECURITY

### 8.1 Incident Response [CRITICAL]

- [ ] Incident response playbooks documented for all critical scenarios: fund drain, key compromise, bridge exploit, AI system malfunction, DDoS, data breach, insider threat
- [ ] Severity classification system defined (e.g., P1 Critical requires response within 15 minutes)
- [ ] War room activation procedures documented with defined roles and communication channels
- [ ] Notification templates prepared for: users, community, regulators, partners, law enforcement
- [ ] Tabletop exercises conducted at least quarterly
- [ ] Post-incident review process defined with root cause analysis and remediation tracking
- [ ] Emergency contract pause/freeze procedures tested and rehearsed
- [ ] Legal counsel pre-engaged for incident response scenarios
- [ ] Communication chain tested — can the right people be reached at 3 AM on a Sunday?

### 8.2 Monitoring and Detection [CRITICAL]

- [ ] On-chain monitoring deployed for: unusual gas consumption, large fund movements, contract upgrades, admin key changes, sanctioned address interactions, flash loan usage
- [ ] Traditional SIEM integrated for infrastructure and application logs
- [ ] Alert severity tiers defined with clear escalation paths — alert fatigue managed actively
- [ ] MTTD (Mean Time To Detect) target defined and measured for critical events
- [ ] 24/7 monitoring coverage — no gaps during weekends, holidays, or off-hours
- [ ] Monitoring covers all deployed chains, not just the primary one
- [ ] AI/LLM outputs monitored for anomalous behavior patterns

### 8.3 Bug Bounty Program [HIGH]

- [ ] Bug bounty program launched on a reputable platform (Immunefi, HackerOne, Bugcrowd)
- [ ] Reward tiers defined: Critical (10% of funds at risk, up to $1M+), High ($10K–$100K), Medium ($1K–$10K)
- [ ] Minimum reward floor set high enough to prevent report withholding ($15K+ for critical)
- [ ] Scope clearly defined — what is in scope, what is not, rules of engagement
- [ ] Response SLA documented: acknowledge within 24 hours, triage within 72 hours
- [ ] Safe Harbor framework enabled where available — protect whitehats legally
- [ ] Bounty payments escrowed and paid promptly

### 8.4 Penetration Testing [HIGH]

- [ ] Minimum 2 independent smart contract audits before mainnet deployment for any contract securing significant value
- [ ] Web/API penetration testing conducted at least quarterly
- [ ] Infrastructure penetration testing conducted at least bi-annually
- [ ] Full red team engagement conducted annually (including social engineering and physical)
- [ ] Competitive audit contests used to complement firm audits
- [ ] All findings tracked to remediation with defined SLAs per severity
- [ ] Retesting conducted to verify fixes do not introduce new vulnerabilities

### 8.5 Personnel Security [HIGH]

- [ ] Security awareness training for all employees — quarterly refresher minimum
- [ ] Phishing simulation campaigns conducted monthly
- [ ] Social engineering defense training (vishing, pretexting, tailgating)
- [ ] Access follows least-privilege principle — reviewed quarterly
- [ ] Offboarding procedures immediately revoke all access (same-day, verified)
- [ ] Background checks for all employees with access to keys, infrastructure, or customer data
- [ ] Insider threat indicators monitored (unusual access patterns, data exfiltration, off-hours activity)
- [ ] Security responsibilities defined in employment agreements

### 8.6 Physical Security [MEDIUM]

*Applicable to any organization operating its own server infrastructure, hardware nodes, or data centers.*

- [ ] Multi-layer security model: Perimeter → Building → Server Room → Rack
- [ ] Biometric access control for server rooms (multi-factor: badge + biometric)
- [ ] CCTV with continuous recording and defined retention period (minimum 90 days)
- [ ] Visitor management system with escort requirements
- [ ] Environmental controls: redundant HVAC, fire detection (VESDA), suppression (FM-200/Novec)
- [ ] Redundant power: UPS + backup generators with fuel for minimum 72 hours
- [ ] Secure boot verification on all physical nodes
- [ ] Key/seed generation ceremonies conducted in RF-shielded (Faraday cage) environments
- [ ] Tamper-evident seals on hardware with regular inspection
- [ ] Hardware supply chain audited to prevent backdoor insertion

---

## 9. REGULATORY AND COMPLIANCE

### 9.1 AML/KYC [CRITICAL]

- [ ] Real-time transaction screening against applicable sanctions lists (OFAC SDN, EU, UN, local)
- [ ] Blockchain analytics provider integrated for on-chain risk scoring (Chainalysis, Elliptic, TRM Labs)
- [ ] Suspicious Activity Report (SAR) filing procedures documented and tested
- [ ] Customer Due Diligence (CDD) procedures documented, enforced, and auditable
- [ ] Enhanced Due Diligence (EDD) applied for high-risk customers, jurisdictions, and transaction patterns
- [ ] Travel Rule compliance implemented per FATF Recommendation 16 (applicable for transfers above local threshold)
- [ ] Transaction monitoring rules tuned and reviewed quarterly — false positive rate managed

### 9.2 Securities Law [HIGH]

- [ ] Token classification analysis documented (Howey test for US, equivalent frameworks for other jurisdictions)
- [ ] NFT/token offerings reviewed to ensure they are not inadvertently structured as securities
- [ ] Marketing materials do not promise returns or profits tied to token/NFT ownership
- [ ] Legal opinion obtained and maintained for all token/NFT offerings
- [ ] Ongoing regulatory developments tracked (SEC, MiCA, local regulators)

### 9.3 Multi-Jurisdiction Compliance [HIGH]

- [ ] All jurisdictions in which the project operates or serves users identified and documented
- [ ] Licensing requirements assessed for each jurisdiction (e.g., MAS DPT license for Singapore, state MSB for US)
- [ ] Tax obligations documented and met for each jurisdiction
- [ ] Customer asset segregation implemented per local requirements
- [ ] Regulatory reporting obligations identified and met (e.g., OECD CARF for 2027)
- [ ] Legal wrappers (LLC, Foundation, etc.) aligned with on-chain governance structures

### 9.4 Compliance Frameworks [MEDIUM]

- [ ] SOC 2 Type II: readiness program initiated; all 5 Trust Services Criteria addressed for highest coverage
- [ ] ISO 27001: ISMS scope defined and gap assessment completed
- [ ] NIST Cybersecurity Framework: Identify/Protect/Detect/Respond/Recover alignment assessed
- [ ] PCI DSS v4.0: compliance achieved if processing fiat payments
- [ ] CCSS (CryptoCurrency Security Standard): self-assessment completed for crypto-specific controls
- [ ] DORA: compliance assessed if serving EU financial institution clients

---

## 10. CONTINUOUS VERIFICATION

### 10.1 Monitoring Cadence

- [ ] **Daily:** On-chain monitoring alerts reviewed; sanctions screening verified active; AI output monitoring reviewed
- [ ] **Weekly:** Dependency vulnerability scan results reviewed; infrastructure alerts triaged; access logs reviewed
- [ ] **Monthly:** Phishing simulation conducted; privileged account access reviewed; patching compliance verified
- [ ] **Quarterly:** Red team / jailbreak testing; penetration testing; compliance reviews; tabletop exercises; KYC provider deepfake testing
- [ ] **Bi-Annually:** Infrastructure penetration test; physical security audit; key management procedures reviewed
- [ ] **Annually:** Full red team engagement; key rotation; compliance framework reassessment; disaster recovery test; vendor security reviews

### 10.2 Re-Audit Triggers

A re-audit (partial or full, scoped to the change) is REQUIRED when any of the following occur:

- [ ] Smart contract upgrade or redeployment
- [ ] Bridge parameter change or validator set modification
- [ ] New chain deployment
- [ ] Key management infrastructure change
- [ ] AI/LLM model change, RAG pipeline modification, or tool access change
- [ ] Authentication or authorization logic change
- [ ] Third-party integration added or materially modified
- [ ] Critical CVE affecting a deployed dependency
- [ ] Significant architecture change
- [ ] Incident revealing a gap not covered by prior audits

### 10.3 Document Maintenance

- [ ] This checklist reviewed and updated quarterly
- [ ] New vulnerability classes, attack techniques, and regulatory changes incorporated within 30 days of publication
- [ ] Gaps identified during any review logged as findings with remediation timelines
- [ ] Version history maintained — all changes tracked

---

## SIGN-OFF

| Role | Name | Date | Signature |
|------|------|------|-----------|
| CISO / CSO | __________________ | __________ | __________ |
| CEO / Founder | __________________ | __________ | __________ |
| CTO | __________________ | __________ | __________ |
| Lead Auditor | __________________ | __________ | __________ |

---

## APPENDIX A: RECOMMENDED AUDIT FIRMS AND PLATFORMS (2026)

**Smart Contract Audit Firms:** OpenZeppelin, Trail of Bits, Sherlock, Cyfrin, Spearbit, Hacken, CertiK, Consensys Diligence, Sigma Prime, Nethermind Security, Halborn

**ZK-Specific Audit Firms:** Veridise, Nethermind Security, zkSecurity, OpenZeppelin ZKP Practice

**Competitive Audit Platforms:** Sherlock, Code4rena, Immunefi Boost, Cantina

**Bug Bounty Platforms:** Immunefi (Web3-focused), HackerOne, Bugcrowd

**Static Analysis Tools:** Slither, Mythril, Aderyn (Cyfrin), Semgrep

**Formal Verification:** Certora Prover, Halmos, KEVM

**Fuzzing:** Foundry forge fuzz, Echidna, Medusa

**AI-Assisted Audit:** Nethermind AuditAgent, QuillShield

**On-Chain Monitoring:** Forta Network, OpenZeppelin Defender, Chainalysis Hexagate, Hacken Extractor, Tenderly

**SIEM/SOC:** Splunk, Elastic Security, AnChain.AI Web3SOC

**Container/Supply Chain:** Trivy, Grype, Falco, Socket.dev, Cosign/Sigstore

**Secrets Management:** HashiCorp Vault, AWS Secrets Manager, GCP Secret Manager

---

## APPENDIX B: REFERENCE STANDARDS

- OWASP Top 10:2025 (Web Application Security)
- OWASP Smart Contract Top 10:2026
- OWASP Top 10 for LLM Applications:2025
- OWASP Top 10 for Agentic Applications:2025
- OWASP API Security Top 10:2023
- NIST Cybersecurity Framework (CSF)
- NIST Post-Quantum Cryptography Standards (FIPS 203, 204, 205)
- FATF Recommendation 16 (Travel Rule)
- ISO 27001 / 27701
- SOC 2 Trust Services Criteria
- PCI DSS v4.0
- CryptoCurrency Security Standard (CCSS)
- SLSA (Supply-chain Levels for Software Artifacts)
- SWC Registry (Smart Contract Weakness Classification)
- EDPB Guidelines 02/2025 (Blockchain and GDPR)

---

*This document is a living standard. The threat landscape evolves continuously. A checklist that was comprehensive yesterday has gaps tomorrow. Review quarterly. Update immediately when new attack classes emerge. The goal is not perfection — it is the disciplined elimination of known attack surfaces so that the only remaining risk is the truly unknown.*
