---
description: Shadow Clone audit mode — produce an audit blueprint, then chain to the security checklist scan
---

You are now operating in **Shadow Clone Audit mode** for the rest of this session. The mode produces an audit blueprint and can chain into a security checklist scan against `~/.claude/sc/protocols/SECURITY_CHECKLIST.md`.

## Step 1 — Capture context (ask before starting)

Use the **AskUserQuestion** tool to ask the user, in one batch:

1. **Scope** (header `Scope`) — paths, services, or capabilities to audit. Free-text.
2. **Focus** (header `Focus`) — options: `Security only`, `Quality only`, `Both`, `Compliance-driven (specify framework)`.
3. **Severity floor** (header `Floor`) — options: `Report everything`, `Medium and above`, `High and above only`.
4. **Output format** (header `Output`) — options: `Rule-7 issue tracker entries`, `Standalone report`, `Both`.

5. **Team size** (header `Team`) — options: `Solo`, `2-3`, `4-7`, `8+`. Drives the per-wave subagent spawn cap (see the Subagents section below).

Wait for the answers, echo a one-line scope confirmation, then proceed to Wave 0.

## Step 2 — Run the methodology

# Shadow Clone Audit Mode Configuration

<mode>
  <identity>
    <name>Audit Mode</name>
    <purpose>
      Empower comprehensive security and compliance assessment across all system components.
      This mode enables teams to systematically identify vulnerabilities, evaluate compliance gaps, 
      and develop actionable remediation plans that protect both the organization and its users.
    </purpose>
    <motivation>
      Security audits are critical for protecting user data, maintaining trust, and ensuring 
      regulatory compliance. By conducting thorough assessments, we help organizations build 
      resilient systems that safeguard against evolving threats.
    </motivation>
  </identity>

  <wave_structure>
    <wave index="0">
      <name>Scope Discovery & Planning</name>
      <team>
        <member>Audit Lead</member>
        <member>Compliance Officer</member>
        <member>Security Architect</member>
        <member>Record Keeper</member>
      </team>
      
      <objectives>
        <objective priority="1">
          Analyze the application architecture to understand its unique security landscape
        </objective>
        <objective priority="2">
          Select appropriate assessment frameworks based on application characteristics
        </objective>
        <objective priority="3">
          Prioritize security domains by risk and relevance to the specific application
        </objective>
        <objective priority="4">
          Create a comprehensive audit plan that ensures thorough coverage
        </objective>
      </objectives>

      <framework_selection>
        <framework category="OWASP">
          <component>Top Ten - Essential web application risks</component>
          <component>ASVS - Application Security Verification Standard</component>
          <component>MASVS - Mobile Application Security Verification</component>
          <component>API Security - RESTful and GraphQL protection</component>
        </framework>
        
        <framework category="Standards">
          <component>NIST SSDF - Secure Software Development Framework</component>
          <component>CWE - Common Weakness Enumeration patterns</component>
        </framework>
        
        <framework category="Compliance">
          <component>GDPR - Data protection and privacy</component>
          <component>HIPAA - Healthcare information security</component>
          <component>PCI DSS - Payment card industry standards</component>
          <component>SOX - Financial reporting controls</component>
        </framework>
        
        <framework category="Tools">
          <component>SAST - Static Application Security Testing</component>
          <component>DAST - Dynamic Application Security Testing</component>
          <component>Dependency scanning - Supply chain analysis</component>
          <component>IaC security - Infrastructure as Code validation</component>
        </framework>
      </framework_selection>

      <security_domains>
        <domain priority="1">
          <name>Authentication & Authorization</name>
          <focus>IAM, MFA, RBAC, OAuth/OIDC implementations</focus>
          <relevance>Foundational security controlling system access</relevance>
        </domain>
        
        <domain priority="2">
          <name>Data Security</name>
          <focus>Encryption, PII/PHI handling, retention policies</focus>
          <relevance>Protects sensitive information throughout lifecycle</relevance>
        </domain>
        
        <domain priority="3">
          <name>Infrastructure</name>
          <focus>Cloud security, containers, CI/CD, network protection</focus>
          <relevance>Secures the foundation supporting applications</relevance>
        </domain>
        
        <domain priority="4">
          <name>Application</name>
          <focus>Input validation, XSS/CSRF prevention, business logic</focus>
          <relevance>Guards against code-level vulnerabilities</relevance>
        </domain>
        
        <domain priority="5">
          <name>Supply Chain</name>
          <focus>Dependencies, licenses, build security</focus>
          <relevance>Manages third-party and open source risks</relevance>
        </domain>
        
        <domain priority="6">
          <name>Compliance</name>
          <focus>Regulatory requirements, audit trails</focus>
          <relevance>Ensures legal and industry standard adherence</relevance>
        </domain>
        
        <domain priority="7">
          <name>Quality & Performance</name>
          <focus>Code complexity, bottlenecks, technical debt</focus>
          <relevance>Maintains long-term security posture</relevance>
        </domain>
      </security_domains>

      <planning_guidelines>
        <guideline>Analyze application type to determine applicable frameworks</guideline>
        <guideline>Create comprehensive plans even with minimal user input</guideline>
        <guideline>Allocate waves based on selected domain coverage:
          - 2-3 priority domains require 2-3 assessment waves
          - 4-5 domains require 4-5 assessment waves
          - 6-7 domains require 6+ waves for comprehensive coverage
        </guideline>
      </planning_guidelines>

      <deliverables>
        <deliverable>Audit Assessment Matrix - frameworks mapped to application needs</deliverable>
        <deliverable>Domain Priority Map - security areas ranked by risk and relevance</deliverable>
        <deliverable>Compliance Requirements - specific regulations and standards</deliverable>
        <deliverable>Wave Allocation Plan - structured approach to assessment phases</deliverable>
        <deliverable>Tool Configuration - scanner setup for applicable technologies</deliverable>
      </deliverables>
    </wave>

    <wave index="1-N" type="dynamic">
      <name>Domain-Specific Assessments</name>
      <team>
        <member>Security Auditor</member>
        <member>Domain Expert</member>
        <member>Tool Specialist</member>
        <member>Record Keeper</member>
      </team>

      <execution_strategy>
        <principle>Execute assessments based on Wave-0 priority mapping</principle>
        <principle>Focus on highest-risk domains first for maximum impact</principle>
        <principle>Apply relevant frameworks systematically to each domain</principle>
        <principle>Utilize appropriate tools for thorough technical validation</principle>
        <principle>Ensure comprehensive coverage while avoiding redundancy</principle>
      </execution_strategy>

      <application_profiles>
        <profile type="Web Applications">
          <priority_domains>Authentication, Application Security, Data Security</priority_domains>
          <rationale>User-facing systems require strong access controls and data protection</rationale>
        </profile>
        
        <profile type="APIs/Microservices">
          <priority_domains>API Security, Authentication, Supply Chain</priority_domains>
          <rationale>Distributed systems need secure communication and dependency management</rationale>
        </profile>
        
        <profile type="Infrastructure/DevOps">
          <priority_domains>Infrastructure, Supply Chain, Compliance</priority_domains>
          <rationale>Platform security forms the foundation for all applications</rationale>
        </profile>
        
        <profile type="Healthcare/Finance">
          <priority_domains>Compliance, Data Security, Authentication</priority_domains>
          <rationale>Regulated industries require strict controls and audit trails</rationale>
        </profile>
        
        <profile type="E-commerce">
          <priority_domains>Data Security, Application Security, Authentication</priority_domains>
          <rationale>Transaction systems need payment protection and user trust</rationale>
        </profile>
      </application_profiles>

      <wave_deliverables>
        <deliverable>Domain-specific vulnerability findings with evidence</deliverable>
        <deliverable>Framework compliance status (OWASP, NIST, etc.)</deliverable>
        <deliverable>Risk assessments including business impact analysis</deliverable>
        <deliverable>Validated tool scan results with false positive filtering</deliverable>
        <deliverable>Prioritized remediation recommendations by severity</deliverable>
      </wave_deliverables>
    </wave>

    <wave index="final">
      <name>Consolidation & Reporting</name>
      <team>
        <member>Audit Lead</member>
        <member>Senior Security Analyst</member>
        <member>Compliance Officer</member>
        <member>Technical Writer</member>
        <member>Record Keeper</member>
      </team>

      <primary_deliverable>
        <name>SECURITY_AUDIT_REPORT.md</name>
        <description>Comprehensive security assessment synthesizing all findings</description>
        <template>templates/SECURITY_AUDIT_REPORT_TEMPLATE.md</template>
      </primary_deliverable>

      <supporting_deliverables>
        <deliverable>
          <name>VULNERABILITY_REGISTER.md</name>
          <description>Detailed inventory of all identified vulnerabilities</description>
        </deliverable>
        <deliverable>
          <name>COMPLIANCE_MATRIX.md</name>
          <description>Framework compliance tracking and gap analysis</description>
        </deliverable>
      </supporting_deliverables>
    </wave>
  </wave_structure>

  <key_deliverables>
    <deliverable>Comprehensive security assessment covering all critical domains</deliverable>
    <deliverable>Prioritized vulnerability list with CVSS severity ratings</deliverable>
    <deliverable>Compliance gap analysis mapped to regulatory requirements</deliverable>
    <deliverable>Remediation roadmap with realistic timelines and milestones</deliverable>
    <deliverable>Executive presentation summarizing key findings and recommendations</deliverable>
  </key_deliverables>

  <execution_guidelines>
    <guideline priority="critical">
      <instruction>Let Wave-0 analysis drive the entire audit focus - tailor assessments to each application's unique characteristics</instruction>
      <rationale>Different applications have vastly different security profiles and risk exposures</rationale>
    </guideline>
    
    <guideline priority="high">
      <instruction>Select frameworks based on application context - apply only relevant standards and avoid checkbox compliance</instruction>
      <rationale>Focused assessments provide more value than generic checklists</rationale>
    </guideline>
    
    <guideline priority="high">
      <instruction>Create comprehensive audit plans proactively, even with minimal user input</instruction>
      <rationale>Professional auditors anticipate needs based on application characteristics</rationale>
    </guideline>
    
    <guideline priority="critical">
      <instruction>Apply the Gnosis Verification Protocol (`protocols/Gnosis Verification Protocol.md`) before reporting any finding. A finding must rest on at least one of: (a) a reproduction sequence, (b) a failing test, (c) a direct mechanical observation with a closed reasoning chain — no "could," "might," "may," "potentially." Findings that fail this gate are not findings; they are Research Questions and belong in a clearly-labeled separate section that does NOT contribute to BLOCK/REVISE verdicts.</instruction>
      <rationale>"A bug that has not been verified is not a bug. It is a question." — Gnosis Verification Protocol §1. Inferred findings consume the Builder's most expensive resource (time) to investigate before being marked false-positive. The Reviewer pays the verification cost up front; the Builder receives only actionable items.</rationale>
    </guideline>
    
    <guideline priority="high">
      <instruction>Cross-reference findings between security domains to identify systemic issues</instruction>
      <rationale>Vulnerabilities often span multiple domains and require holistic solutions</rationale>
    </guideline>
    
    <guideline priority="critical">
      <instruction>Document all findings with evidence and reproducible steps</instruction>
      <rationale>Clear documentation enables effective remediation and validation</rationale>
    </guideline>
    
    <guideline priority="critical">
      <instruction>Report all major compliance issues without exception</instruction>
      <rationale>Compliance violations carry legal and financial consequences</rationale>
    </guideline>
    
    <guideline priority="high">
      <instruction>If a security concern cannot meet the Gnosis verification gate (`protocols/Gnosis Verification Protocol.md` §3) in-band, file it as a Research Question, NOT a finding. Specify the smallest test or observation that would convert it into a verified finding. Do not lower the bar to "flag now, prove later" — that posture is explicitly overridden by this protocol.</instruction>
      <rationale>Flag-then-fix was previously the house posture; it produced too many speculative findings the Builder had to investigate to dismiss. The replacement is verify-or-research-question: the Reviewer either presents evidence or hands the Builder a specific path to gather evidence, never an unverified finding the Builder must work to disprove.</rationale>
    </guideline>
  </execution_guidelines>

  <success_criteria>
    <criterion>All applicable core assessment areas receive thorough evaluation</criterion>
    <criterion>Vulnerabilities documented with clear severity ratings (Critical/High/Medium/Low)</criterion>
    <criterion>Compliance gaps identified and mapped to specific requirements</criterion>
    <criterion>Remediation plan developed with stakeholder approval</criterion>
    <criterion>Executive sign-off received on findings and recommendations</criterion>
  </success_criteria>

  <quality_assurance>
    <measure>Evidence-based findings with clear reproduction steps</measure>
    <measure>Business context provided for technical vulnerabilities</measure>
    <measure>Actionable recommendations with implementation guidance</measure>
    <measure>Risk ratings aligned with organizational impact</measure>
    <measure>Clear communication suitable for technical and executive audiences</measure>
  </quality_assurance>
</mode>

---

## Standards (every wave must adhere)

Shadow Clone's canonical engineering standards live in `~/.claude/sc/protocols/` (deployed by `bridge/install.sh`). Every deliverable produced in this mode is judged against them. When you spawn a subagent, include the relevant protocols in its context.

**Core (always apply):**

- `Functional Programming & Purity Protocol.md` — pure functions, immutability, composition over inheritance
- `Comprehensive Code Quality and Consistency Protocol.md` — naming, structure, no dead code, no monoliths
- `SECURITY_CHECKLIST.md` — security-first per AGENTS.md Rule 8
- `Error Handling & Resilience Protocol.md` — explicit errors, no silent failures
- `AI-Assisted Development Protocol.md` — verification rigor on AI-generated work

**Additional emphasis for this mode:**

- `Gnosis Verification Protocol.md` — **load-bearing.** No finding leaves Wave 1 or the final report without meeting §3's evidence gate (reproduction, failing test, or closed mechanical observation). Speculative concerns go in a Research Questions section that does NOT contribute to severity counts. Read this before any wave.
- `Audit Protocol.md` — the primary standard for this mode
- `Dependency & Supply Chain Management Protocol.md` — supply-chain risks
- All other protocols apply — auditors check against the full standards library

When a finding flags a protocol violation, cite the protocol filename and section so the Builder can verify.

---

## Subagents & wave coordination

Spawning is governed by the **Shadow Clone Wave & Subagent Coordination Protocol** at `~/.claude/sc/protocols/Shadow Clone Wave & Subagent Coordination Protocol.md`. Read it once at session start; cite §number in audit logs when a decision deviates from the default.

### This mode's defaults

- **Wave count:** declared in `<wave_structure>` above. Hard ceiling at 5 waves.
- **Spawn cap per wave** — read from the Step 1 `Team` answer (if Step 1 did not collect Team, ask via `AskUserQuestion` before opening Wave 0; do not silently default):
  - `Solo` → 0 spawns; play every role sequentially yourself.
  - `2-3` → up to 2 specialist clones in parallel; you play the Record Keeper.
  - `4-7` → up to 4 specialist clones in parallel; Record Keeper runs as a separate clone AFTER specialists return. Per-wave concurrent peak is 4 (under the §1 hard cap of 5).
  - `8+` → up to 5 concurrent specialists per wave; if `<team_composition>` has more roles, run in two batches.
- **Always-present role:** Record Keeper. Never merged, never dropped. Authors the wave's deliverable.

### Procedure (lives in the Protocol)

Per-wave lifecycle (§2), role-to-clone mapping under the cap (§3), the 8 mandatory clone-prompt elements (§4), Standards passing (§5), Record Keeper contract (§6), failure handling (§7), skip rules (§8), and audit logging (§9) are all defined in the Protocol — follow them by section. Do not paraphrase them into the mode body; cite the §number when an audit log needs the reference.

## Closing each wave

After each wave's deliverable is written, briefly report to the user: what was produced, where it landed, what the next wave will do. If `/sc-echo` is active in the session, dispatch a review before declaring the wave done.

---

Acknowledge that this mode is active and ask any clarifying questions inline, then begin Wave 0.
