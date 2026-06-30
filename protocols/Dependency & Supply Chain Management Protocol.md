# Dependency & Supply Chain Management Protocol

**Ignis AI Labs Open-Source Protocol Suite — v1.0 (April 2026)**

Software supply chain attacks cost an estimated **$45 billion in 2023** and are projected to exceed **$80 billion by 2026**. OWASP's 2025 Top 10 elevated supply chain failures to the **#3 risk** (up from #6), with 50% of community respondents voting it their top concern. This protocol provides a production-grade, language-agnostic checklist for defending every stage of the dependency lifecycle — from initial evaluation through ongoing monitoring and incident response. It reflects the current regulatory landscape (EU CRA entering enforcement, evolving US federal requirements), the latest tooling (Sigstore GA, OpenSSF Scorecard V5, Socket.dev reachability analysis), and hard lessons from the xz-utils backdoor, the September 2025 npm mega-compromise of debug/chalk, and the March 2026 LiteLLM/Trivy chain compromise.

---

## 1. Dependency health assessment and scoring system

Every dependency carries risk. Quantifying that risk requires a structured scoring system applied consistently before adoption and monitored continuously afterward. The following rubric assigns a **0–10 score per metric**, with an aggregate weighted score determining the dependency's health classification.

### Scoring rubric with thresholds

| Metric | Weight | Green (8–10) | Yellow (4–7) | Red (0–3) |
|--------|--------|-------------|--------------|-----------|
| **Weekly downloads trajectory** | 10% | Stable or growing; >10K weekly | Declining <20% YoY; 1K–10K weekly | Declining >20% YoY; <1K weekly |
| **Maintenance activity** (commits in 90 days) | 15% | ≥10 commits in 90 days | 1–9 commits in 90 days | 0 commits in 90 days |
| **Issue/PR response time** (median) | 10% | <7 days median response | 7–30 days | >30 days or no responses |
| **Contributor diversity / bus factor** | 15% | ≥3 regular contributors from ≥2 orgs | 2 contributors | 1 contributor (bus factor = 1) |
| **Security incident history** | 10% | 0 critical CVEs in 24 months | 1–2 CVEs, all patched promptly | Unpatched CVEs or recurring critical vulns |
| **Transitive dependency count** | 10% | <20 transitive deps | 20–50 transitive deps | >50 transitive deps |
| **Bundle size impact** (min+gzip) | 10% | <15 KB | 15–50 KB | >50 KB |
| **TypeScript/type support** | 5% | Native TypeScript or bundled `.d.ts` | DefinitelyTyped `@types/*` available | No type definitions |
| **OpenSSF Scorecard score** | 15% | ≥7/10 | 4–6/10 | <4/10 |

**Health classifications based on weighted aggregate:**

- **Approved** (≥7.0): May be added with standard review
- **Conditional** (4.0–6.9): Requires elevated review and mitigation plan
- **Blocked** (<4.0): Must not be added without VP Engineering or Security Lead exception

### Tools for automated health assessment

| Tool | Purpose | Ecosystems |
|------|---------|------------|
| **OpenSSF Scorecard** (scorecard.dev) | Automated security posture scoring (V5 with Structured Results); 15+ checks; scans **1M+ projects weekly**; endorsed by CISA | All GitHub-hosted projects |
| **Socket.dev** | Proactive supply chain security; detects **70+ risk types** including malware, typosquatting, and hidden behaviors; AI-powered code analysis; reachability analysis cuts 60% of CVE false positives | npm, PyPI, Go, Rust, Java, Ruby, .NET, PHP |
| **deps.dev** (Google) | Free dependency graph analysis for 50M+ packages; transitive dep computation; advisory impact; OpenSSF Scorecard integration; hash-based package lookup | npm, PyPI, crates.io, Maven, Go, NuGet, RubyGems |
| **Snyk** | SCA with reachability analysis, automated fix PRs, centralized dashboard; Gartner Magic Quadrant Leader for AST (2025) | All major ecosystems |
| **Bundlephobia** | Bundle size analysis (min+gzip), tree-shaking recommendations | npm |
| **Packagephobia** | Install size (disk footprint) measurement | npm |
| **PkgWatch** (pkgwatch.dev) | Predicts package abandonment **6–12 months** in advance; CI-integrated health scores | npm, PyPI |

**Checklist:**
- [ ] OpenSSF Scorecard GitHub Action running on all repositories
- [ ] Minimum Scorecard threshold of **7/10** enforced for new direct dependencies
- [ ] deps.dev or Socket.dev integrated into dependency review workflow
- [ ] Bundle size checked via Bundlephobia before adding any frontend dependency
- [ ] PkgWatch or equivalent monitoring active for all critical dependencies

---

## 2. New dependency approval requires structured justification

Adding a dependency is a long-term commitment. Every new dependency increases the attack surface, adds license obligations, and creates maintenance burden. Teams must treat dependency additions as architectural decisions.

### Justification template

Every request to add a new dependency must include the following completed template, submitted as part of the pull request description or linked approval issue:

```
## Dependency Addition Request

**Package:** [name@version]
**Requested by:** [developer name]
**Date:** [YYYY-MM-DD]

### 1. Problem Statement
[What specific problem does this dependency solve?]

### 2. Alternatives Considered
| Alternative | Pros | Cons | Why rejected |
|-------------|------|------|--------------|
| Native implementation | No dependency risk | Dev time: ~X hours | [reason] |
| [Alt package 1] | [pros] | [pros] | [reason] |
| [Alt package 2] | [pros] | [cons] | [reason] |

### 3. Package Health Score
- OpenSSF Scorecard: [X/10]
- Weekly downloads: [number + trend]
- Last commit: [date]
- Bus factor: [number of core contributors]
- Known CVEs: [count and status]
- License: [SPDX identifier]

### 4. Dependency Impact
- Direct dependencies added: [count]
- Transitive dependencies added: [count]
- Bundle size impact (min+gzip): [size]
- Dependency tree depth increase: [number]

### 5. License Verification
- License: [SPDX identifier]
- On allowlist: [Yes/No]
- Compatible with project license: [Yes/No]

### 6. Maintainer Assessment
- Primary maintainer(s): [names/orgs]
- Foundation-backed: [Yes/No]
- Commercial support available: [Yes/No]
- Security policy (SECURITY.md): [Present/Absent]
```

### Approval workflow and gates

**Gate 1 — Automated screening (CI):** License check passes, OpenSSF Scorecard ≥7, no known critical CVEs, transitive dependency count within budget. If any automated gate fails, PR is blocked.

**Gate 2 — Peer review:** At least one team member reviews the justification template and confirms the alternatives analysis is thorough.

**Gate 3 — Security/Architecture review (triggered by thresholds):**
- Required if the package adds **>50 transitive dependencies**
- Required if the OpenSSF Scorecard is **<7/10**
- Required if the package has a bus factor of **1**
- Required if the license requires legal review (LGPL, MPL-2.0)
- Required for any package that will process user input, handle authentication, or manage cryptographic operations

**Checklist:**
- [ ] Justification template completed for every new dependency
- [ ] Automated health score gates integrated into CI
- [ ] Elevated review triggers documented and enforced
- [ ] Approval decisions logged in a dependency decision register

---

## 3. Version pinning strategies vary by project type and ecosystem

The correct pinning strategy depends on whether the project is a deployed application or a published library, and on the ecosystem's dependency resolution semantics. **The cardinal rule: applications pin exact versions; libraries use compatible ranges.**

### Cross-ecosystem pinning guidance

| Context | npm | Cargo (Rust) | pip (Python) | Go modules |
|---------|-----|-------------|--------------|------------|
| **Deployed application** | Exact pin (`--save-exact` in `.npmrc`) | Caret default; `Cargo.lock` committed and `--locked` enforced | Pin all versions via `uv.lock` or `poetry.lock`; use `--locked` in CI | Minimum Version Selection + `go.sum` committed; `-mod=readonly` in CI |
| **Published library** | Caret ranges (`^`) to allow deduplication | Caret ranges (default); `Cargo.lock` committed for CI reproducibility | Lower-bound pins only (`>=2.28.0`); **no upper bounds** unless known incompatibility | Specify `go.mod` requirements; consumers resolve via MVS |

### npm-specific guidance

Set `save-exact=true` globally in `.npmrc` for application repositories. This ensures every `npm install <pkg>` records an exact version. In CI, **always use `npm ci`**, never `npm install` — `npm ci` deletes `node_modules`, installs strictly from `package-lock.json`, and **fails if the lockfile doesn't match** `package.json`. Use `lockfile-lint` to validate that package sources originate from trusted registries (this defends against lockfile injection attacks, a vector exploited during the September 2025 chalk/debug compromise).

### Lockfile enforcement across ecosystems

| Ecosystem | Deterministic CI Command | Behavior on Mismatch |
|-----------|--------------------------|---------------------|
| **npm** | `npm ci` | Deletes `node_modules`, installs from lockfile, fails if lockfile ≠ `package.json` |
| **pnpm** | `pnpm install --frozen-lockfile` | Fails if lockfile needs updating |
| **Yarn** | `yarn install --immutable` | Fails if lockfile would change |
| **Cargo** | `cargo build --locked` | Fails if `Cargo.lock` is out of date |
| **Poetry** | `poetry install --sync` | Installs locked versions, removes unlisted packages |
| **uv** | `uv sync --locked` | Fails if lockfile doesn't match `pyproject.toml` |
| **Go** | `go build -mod=readonly` | Fails if `go.mod` needs updating |

**All lockfiles must be committed to version control** — for both applications and libraries. The previous advice to omit `Cargo.lock` for Rust libraries has been superseded; modern guidance recommends committing it to ensure CI reproducibility, even though consumers ignore it.

**Checklist:**
- [ ] `.npmrc` contains `save-exact=true` for all application repositories
- [ ] CI pipelines use lockfile-only install commands (see table above)
- [ ] All lockfiles committed to version control and reviewed in PRs
- [ ] `lockfile-lint` (or equivalent) validates lockfile integrity in CI
- [ ] Team documentation specifies pinning strategy per project type

---

## 4. Automated dependency updates with Renovate

**Renovate is the recommended tool** for automated dependency updates due to its support for **90+ package managers**, multi-platform compatibility (GitHub, GitLab, Bitbucket, Azure DevOps), built-in auto-merge with configurable rules, organizational preset sharing, merge confidence badges, and a dependency dashboard. Dependabot remains suitable for simple GitHub-only projects or as a complementary security alert source. Many teams run both: Renovate for update PRs, Dependabot for security alerting.

### Recommended Renovate configuration

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "config:recommended",
    "mergeConfidence:all-badges",
    "helpers:pinGitHubActionDigests",
    "group:monorepos",
    ":semanticCommits"
  ],
  "schedule": ["before 5am on Monday"],
  "vulnerabilityAlerts": {
    "enabled": true,
    "schedule": ["at any time"],
    "labels": ["security"],
    "automerge": false
  },
  "lockFileMaintenance": {
    "enabled": true,
    "automerge": true,
    "schedule": ["before 5am on Monday"]
  },
  "packageRules": [
    {
      "description": "Auto-merge patch updates after 14-day aging",
      "matchUpdateTypes": ["patch"],
      "minimumReleaseAge": "14 days",
      "automerge": true
    },
    {
      "description": "Auto-merge minor updates with high confidence",
      "matchUpdateTypes": ["minor"],
      "matchCurrentVersion": "!/^0/",
      "matchConfidence": ["very high", "high"],
      "minimumReleaseAge": "14 days",
      "automerge": true
    },
    {
      "description": "Major updates require manual review",
      "matchUpdateTypes": ["major"],
      "dependencyDashboardApproval": true,
      "labels": ["major-update"]
    },
    {
      "description": "Auto-merge dev dependency major updates",
      "matchDepTypes": ["devDependencies"],
      "matchUpdateTypes": ["major"],
      "automerge": true,
      "minimumReleaseAge": "14 days"
    },
    {
      "description": "Group ESLint-related packages",
      "matchPackageNames": ["/eslint/"],
      "groupName": "eslint"
    }
  ],
  "platformAutomerge": true
}
```

### Critical security note on auto-merge

GitGuardian documented in March 2026 how auto-merging Renovate/Dependabot PRs has become a **malware delivery vector**. During the Axios compromise, a malicious npm package was published and within 5 minutes, Dependabot created upgrade PRs across **895+ public repositories** — some auto-merged within 56 minutes. Defenses: **never auto-merge without full CI passing**, enforce a **`minimumReleaseAge` of at least 14 days** (Renovate's official recommendation), and **pin GitHub Actions to commit SHAs** (not tags).

### Update schedule configuration

| Update Type | Schedule | Auto-merge | Additional Requirements |
|-------------|----------|------------|------------------------|
| **Security vulnerabilities** | Immediate (`at any time`) | No — requires human review | Label `security`; notify security channel |
| **Patch updates** | Weekly (Monday pre-dawn) | Yes, after 14-day aging + CI pass | — |
| **Minor updates** | Weekly | Yes, if merge confidence high + CI pass | Exclude pre-1.0 packages |
| **Major updates** | Weekly (PR creation only) | No — dashboard approval required | Changelog review mandatory |
| **Lockfile maintenance** | Weekly | Yes | — |

**Checklist:**
- [ ] Renovate installed and configured with organizational presets
- [ ] `minimumReleaseAge` set to **≥14 days** for all auto-merged updates
- [ ] GitHub Actions pinned to commit SHAs via `helpers:pinGitHubActionDigests`
- [ ] Security vulnerability alerts configured for immediate notification
- [ ] Major updates require dashboard approval and changelog review
- [ ] Dependency Dashboard enabled and reviewed weekly by team lead

---

## 5. Vulnerability management SLAs tied to CVSS severity

Vulnerability response times must be codified and enforced. The following SLAs represent the maximum time from vulnerability disclosure to deployed remediation.

### SLA table

| Severity | CVSS Score | Remediation SLA | Escalation Trigger | Notification |
|----------|-----------|-----------------|--------------------|----|
| **Critical** | ≥9.0 | **24 hours** | At 12 hours if no fix identified | Immediate page to Security Lead + Engineering Lead |
| **High** | 7.0–8.9 | **72 hours** | At 48 hours if no fix in progress | Slack alert to security channel + assigned owner |
| **Medium** | 4.0–6.9 | **7 days** | At 5 days if not in active sprint | Weekly vulnerability review meeting |
| **Low** | <4.0 | **30 days** | At 21 days if unassigned | Monthly audit report |

### Escalation procedures

When an SLA is at risk, the following chain activates: **L1** — assigned developer and team lead notified; **L2** (50% of SLA elapsed) — Security Lead reviews and may reassign; **L3** (75% of SLA elapsed) — VP Engineering notified, mitigation plan required within 4 hours; **L4** (SLA exceeded) — incident documented, post-mortem required within 5 business days.

### Temporary mitigation documentation

When a vulnerability cannot be patched within the SLA (e.g., no upstream fix available), a **Temporary Mitigation Record** must be filed:

```
## Temporary Mitigation Record
- CVE: [identifier]
- CVSS: [score]
- Affected package: [name@version]
- Mitigation applied: [WAF rule / network policy / code workaround / feature flag]
- Risk accepted by: [name, title]
- Expiration date: [maximum 90 days; must be renewed]
- Upstream fix tracking issue: [URL]
```

### Vulnerability scanning tools by ecosystem

| Tool | Ecosystem | Key Capability |
|------|-----------|----------------|
| **npm audit** | npm | Built-in registry vulnerability check; `npm audit fix` for auto-remediation |
| **cargo audit** | Rust | Scans `Cargo.lock` against RustSec Advisory Database |
| **pip-audit** | Python | Scans pip dependencies against vulnerability databases |
| **govulncheck** | Go | Official Go vulnerability scanner against Go Vulnerability Database |
| **Trivy** (Aqua) | Multi | All-in-one scanner: vulns, IaC, secrets, SBOM generation. ⚠️ Compromised in March 2025/2026 — pin by SHA |
| **Grype** (Anchore) | Multi | Focused vulnerability scanner with **EPSS + CISA KEV composite scoring** — best open-source prioritization |
| **Snyk** | Multi | Commercial SCA with reachability analysis, auto-fix PRs, centralized dashboard |
| **Socket.dev** | Multi | Real-time malicious package detection; behavioral analysis; reachability analysis |

**Recommendation:** Use **Grype** as the primary open-source scanner (superior EPSS-based prioritization). Add **Socket.dev** for proactive supply chain attack detection. Add **Snyk** if budget allows for reachability analysis and automated fix PRs.

**Checklist:**
- [ ] Vulnerability scanning integrated into every CI pipeline
- [ ] SLA table codified in team runbook with escalation contacts
- [ ] Temporary Mitigation Records tracked in security issue tracker
- [ ] SLA compliance reported in monthly security metrics
- [ ] Grype or equivalent configured with `--fail-on high` in CI

---

## 6. License compliance is now a regulatory requirement

The EU Cyber Resilience Act makes license documentation legally mandatory for products sold in the EU. Even outside regulatory scope, license violations carry real financial consequences — a French court fined Orange S.A. **€900,000** for AGPL non-compliance in the Entr'ouvert v. Orange case.

### License classification

| Category | Licenses | Policy |
|----------|----------|--------|
| **Allowlisted** | MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC, Unlicense, CC0-1.0 | Auto-approved; no review needed |
| **Requires legal review** | LGPL-2.1, LGPL-3.0, MPL-2.0, EPL-2.0, CDDL-1.0 | Must assess linking/distribution context before approval |
| **Blocked in proprietary** | GPL-2.0, GPL-3.0, AGPL-3.0, SSPL | Cannot be used in proprietary products; requires exception from Legal |
| **Blocked universally** | No license, custom/unknown licenses, non-commercial licenses | Cannot be used without explicit written legal approval |

### CI enforcement tools

| Tool | Ecosystem | Enforcement Capability |
|------|-----------|----------------------|
| **license-checker** (`@onebeyond/license-checker`) | npm | `--failOn` and `--allowOnly` flags for CI blocking |
| **cargo-deny** | Rust | Checks licenses via SPDX expressions; also checks advisories, bans, sources |
| **pip-licenses** | Python | Lists licenses; pair with `action-pip-license-checker` for CI enforcement |
| **LicenseFinder** (Pivotal) | Multi (npm, pip, Cargo, Go, Maven, NuGet, etc.) | Cross-language license tracking with approval workflows |

### SBOM generation per build

**Every CI build must produce an SBOM** in CycloneDX 1.6+ (preferred for security workflows) or SPDX 3.0.1+ (preferred for legal compliance). Both formats are accepted by the EU CRA per BSI TR-03183-2.

| Tool | Output Formats | Best For |
|------|---------------|----------|
| **Syft** (Anchore) | CycloneDX, SPDX, Syft JSON | Broadest ecosystem coverage; pairs with Grype for scanning |
| **cdxgen** (CycloneDX/AppThreat) | CycloneDX | Security-first; wide language support |
| **Trivy** | CycloneDX, SPDX | All-in-one (SBOM is secondary to scanning) |
| **npm sbom** | CycloneDX, SPDX | Native Node.js SBOM generation |

**OWASP Dependency-Track** serves as the central platform for ingesting SBOMs from any generator, monitoring vulnerabilities against NVD/OSV/EPSS, and managing compliance policies.

### EU Cyber Resilience Act requirements

The CRA (Regulation EU 2024/2847) entered into force on **10 December 2024** with a phased timeline. **Vulnerability reporting obligations begin 11 September 2026.** Full compliance is required by **11 December 2027**. Key requirements for dependency management:

- **Mandatory SBOM** for every product with digital elements, covering at least top-level dependencies in machine-readable format
- **Separate SBOM per software version**, signed and stored as part of technical documentation
- Manufacturers must exercise **due diligence when integrating third-party components** including open-source
- Actively exploited vulnerabilities must be reported to CSIRT/ENISA within **24 hours**
- Penalties: up to **€15 million or 2.5% of global annual turnover**
- Non-commercial FOSS is generally exempt; "open-source software stewards" (foundations) face lighter obligations

### US federal landscape

EO 14028 (May 2021) remains the foundational directive. However, **OMB M-26-05** (January 2026) rescinded mandatory vendor attestation requirements (M-22-18, M-23-16), shifting to agency-led, risk-based approaches. Agencies retain discretion to require SBOMs from vendors. CISA published expanded **2025 SBOM Minimum Elements** (draft, August 2025) with nine data fields including provenance and authenticity metadata. Practical guidance: **maintain SBOM capability** regardless of current mandate status — individual agencies (especially DoD) continue imposing stricter requirements.

**Checklist:**
- [ ] License allowlist/blocklist enforced in CI via automated tooling
- [ ] SBOM generated in CycloneDX 1.6+ or SPDX 3.0.1+ on every build
- [ ] SBOMs stored as signed build artifacts with retention ≥5 years
- [ ] OWASP Dependency-Track (or equivalent) ingesting SBOMs for continuous monitoring
- [ ] EU CRA compliance timeline mapped to product roadmap
- [ ] REUSE specification adopted for machine-readable license information on all source files
- [ ] License audit trail maintained with quarterly re-verification

---

## 7. Supply chain attack prevention addresses an evolving threat landscape

The 2024–2026 period saw a dramatic escalation in supply chain attacks. The xz-utils backdoor demonstrated multi-year social engineering against maintainers. The September 2025 npm mega-compromise (debug, chalk, 500+ packages) showed that phishing a single maintainer can impact **2+ billion weekly downloads**. The March 2026 LiteLLM/Trivy chain compromise demonstrated how attackers chain CI/CD exploits across projects. **Open-source malware detections jumped 73% in 2025** versus 2024.

### Postinstall script blocking

Block all lifecycle scripts by default in CI. Legitimate packages requiring postinstall scripts must be explicitly allowlisted.

```bash
# npm: block all scripts, allowlist specific packages
npm install --ignore-scripts
# Then run allowed scripts explicitly:
npx --package=@prisma/client -- prisma generate

# pnpm: block scripts globally, allowlist specific packages in .npmrc
ignore-scripts=true
# Allow specific packages:
side-effects-allowed[]=@prisma/client
```

**pnpm and Yarn now support minimum package age enforcement**, which prevents installation of packages published less than a specified number of hours ago — a critical defense against rapid-fire attacks like the September 2025 compromise.

### Package provenance verification

**npm provenance** (GA since September 2023) provides Sigstore-powered cryptographic proof linking published packages to their source repository, commit SHA, and build environment. However, adoption remains low: among the 2,000 most-downloaded npm packages, only **~12.6% have provenance enabled**. Publishing requires npm CLI 9.5.0+ with `npm publish --provenance` from GitHub Actions or GitLab CI. Verification: `npm audit signatures`.

**Sigstore adoption across ecosystems (2025–2026):**
- npm: Provenance GA (September 2023)
- PyPI: Digital attestations via Sigstore (November 2024)
- Maven Central: Sigstore adoption (January 2025)
- Homebrew: Sigstore attestations (May 2024)
- Docker: Retiring Docker Content Trust in favor of Sigstore/Cosign (August 2025)
- NVIDIA NGC: Model signing via Sigstore (July 2025)

**Cosign verification example:**
```bash
# Verify a container image
cosign verify $IMAGE \
  --certificate-identity=ci@example.com \
  --certificate-oidc-issuer=https://token.actions.githubusercontent.com

# Verify a blob artifact
cosign verify-blob file.txt \
  --bundle artifact.sigstore.json \
  --certificate-identity=ci@example.com \
  --certificate-oidc-issuer=https://token.actions.githubusercontent.com
```

### Attack vector defense matrix

| Attack Vector | Description | Primary Defenses |
|--------------|-------------|-----------------|
| **Typosquatting** | Registering near-identical package names | Lockfile pinning; Socket.dev scanning; careful name review; internal package allowlists |
| **Slopsquatting** (NEW, 2025) | Registering packages that LLMs hallucinate (~20% of AI-suggested packages don't exist) | **Verify every AI-suggested package exists before installing**; channel installs through internal proxies; dependency allowlists |
| **Dependency confusion** | Public package shadows private package name with higher version | Use scoped namespaces (`@company/pkg`); configure `--index-url` (not `--extra-index-url`); reserve internal names on public registries |
| **Maintainer account takeover** | Phishing/credential theft of package maintainers | Require FIDO-based 2FA; use trusted publishing via OIDC; short-lived tokens (7-day max) |
| **Star-jacking** | Linking malicious package to popular GitHub repo for credibility | Verify source repo actually contains the package code; check deps.dev provenance |
| **CI/CD workflow exploitation** | `pull_request_target` pwn requests; GitHub Actions tag hijacking | Pin actions to **commit SHAs** (not tags); never run untrusted code with secret access; use fine-grained tokens |
| **Namespace squatting** | Claiming names preemptively across registries | Monitor public registries for your internal package names; use scoped packages |

### Registry-specific threat mitigations

**npm:** Enable npm provenance verification; use `npm audit signatures`; block postinstall scripts; enforce minimum package age via pnpm/Yarn. **PyPI:** Use `--index-url` exclusively (never `--extra-index-url`); enable Trusted Publishers; watch for `.pth` file persistence attacks. **crates.io:** Use `cargo-deny` for source and advisory checks; namespace squatting risk is lower but monitor. **Go modules:** The module proxy (`proxy.golang.org`) and checksum database provide built-in integrity checking; set `GOPRIVATE` for internal modules to prevent dependency confusion via vanity import paths.

### SLSA framework adoption

SLSA (Supply-chain Levels for Software Artifacts) v1.2 defines four build track levels. **Target SLSA Level 2** as the minimum for production software: signed provenance from a hosted build platform. Level 3 (hermetic, ephemeral builds with non-falsifiable provenance) is the gold standard but requires **3–6 months of implementation effort**.

**Checklist:**
- [ ] Postinstall scripts blocked by default in CI; allowlist maintained
- [ ] npm provenance enabled for all published packages (`npm publish --provenance`)
- [ ] `npm audit signatures` run in CI pipeline
- [ ] GitHub Actions pinned to commit SHAs, not tags
- [ ] Trusted publishing configured (npm OIDC via GitHub Actions/GitLab CI)
- [ ] Socket.dev or GuardDog integrated for real-time malicious package detection
- [ ] AI-suggested dependencies verified for existence before installation
- [ ] Internal package names reserved on public registries
- [ ] SLSA Level 2+ achieved for production build pipelines

---

## 8. Dependency budgets constrain sprawl before it starts

Without explicit limits, dependency counts grow unchecked. RelativeCI data shows modern web applications average **139 third-party dependencies** — a 202% increase since 2020 — with **15 duplicate dependencies** per project. Budgets create forcing functions for architectural discipline.

### Maximum dependency counts by project type

| Project Type | Max Direct Dependencies | Max Transitive Dependencies | Elevated Review Trigger |
|-------------|------------------------|----------------------------|------------------------|
| **Microservice** | 30 | 150 | New dep adds >20 transitive packages |
| **Web application** | 80 | 500 | New dep adds >50 transitive packages |
| **CLI tool** | 20 | 100 | New dep adds >15 transitive packages |
| **Published library** | 10 | 50 | Any new dependency |

### Bundle size budgets for frontend applications

| Budget Type | Warning Threshold | Error Threshold |
|-------------|------------------|-----------------|
| **Initial bundle** (min+gzip) | 200 KB | 500 KB |
| **Per-route chunk** | 50 KB | 150 KB |
| **Individual package** | 15 KB (small) | 50 KB (large — requires justification) |

Enforce with **Size Limit** (`@size-limit/preset-app`) in CI:
```json
{
  "size-limit": [
    { "path": "dist/app-*.js", "limit": "200 KB" }
  ]
}
```

Replace heavy legacy packages: `moment.js` (70 KB) → `day.js` (2 KB); `lodash` (70 KB) → native ES methods or `lodash-es` with tree-shaking.

### Monitoring tools

Use `npm ls --all`, `cargo tree`, `pipdeptree`, or `go mod graph` for dependency tree visualization. Run `depcheck` (npm), `cargo-udeps` (Rust), `deptry` (Python), `knip` (JS/TS), or `go mod tidy` (Go) to identify unused dependencies. Integrate dependency count checks into CI to fail builds that exceed budgets.

**Checklist:**
- [ ] Dependency count budgets defined per project type and documented
- [ ] Bundle size budgets enforced in CI via Size Limit or equivalent
- [ ] Dependency tree depth monitored (alert if >5 levels deep)
- [ ] Unused dependency detection runs in CI (depcheck/cargo-udeps/deptry/knip)
- [ ] Projects exceeding budgets have documented exception with remediation plan

---

## 9. Vendoring decisions balance control against maintenance cost

Vendoring copies dependencies into your repository, trading storage and update complexity for control and availability guarantees.

### When to vendor

- **Critical dependencies with bus factor <3** — a single maintainer abandoning a project should not break your builds
- **Dependencies requiring local patches** — track patches against upstream; use `patch-package` (npm) or `cargo-patch` (Rust) for non-vendored alternatives
- **Air-gapped environments** — vendoring or private registry mirroring is mandatory
- **CI/CD reliability requirements** — when external registry downtime is unacceptable
- **Compliance/audit requirements** — when auditors need full control over exact code deployed

### How to vendor by ecosystem

**Go** (most mature vendoring): `go mod vendor` copies all dependencies to `vendor/`; build with `go build -mod=vendor`. Commit the `vendor/` directory. **Rust:** `cargo vendor` downloads to `vendor/`; configure `.cargo/config.toml` to redirect source resolution. **Python:** `pip wheel -r requirements.txt --wheel-dir=wheels/` pre-builds wheels; install with `pip install --no-index --find-links=wheels/`.

### Maintaining vendored dependencies

- **Update cadence:** Monthly review of vendored dependency versions against upstream
- **Patch tracking:** Maintain a `PATCHES.md` file documenting every local modification with rationale
- **Vulnerability monitoring:** Vendored dependencies must be scanned with the same tools as registry-sourced dependencies — SCA tools should be configured to scan the vendor directory
- **Per OpenSSF guidance:** Projects that vendor dependencies should issue their own vulnerability disclosures when upstream CVEs affect vendored code

### Alternative: Private registry mirroring

For organizations that want registry independence without the maintenance burden of vendoring, use **Artifactory**, **Nexus Repository**, or **Verdaccio** (npm) as private registry mirrors. These cache packages from public registries and serve them to internal consumers, providing availability without repository bloat.

**Checklist:**
- [ ] Vendoring criteria documented and applied consistently
- [ ] Vendored dependencies scanned in CI (same tools as registry deps)
- [ ] `PATCHES.md` maintained for all local modifications
- [ ] Monthly vendored dependency update review scheduled
- [ ] Air-gapped environments use private registry mirrors or committed vendor directories

---

## 10. Monorepo dependency management prevents version drift and phantom dependencies

Monorepos amplify dependency management challenges: version inconsistencies across packages, phantom dependencies from hoisting, and update noise from dozens of `package.json` files. The right tooling and policies eliminate these problems.

### Workspace package manager recommendation

**pnpm is the recommended package manager for monorepos** (2025–2026 consensus). Its strict symlink-based `node_modules` prevents phantom dependencies by design — packages can only access their declared dependencies. Content-addressable storage provides **60–80% disk savings** and **2–3× faster installs** versus npm. Adopted by Vercel/Turborepo, Astro, and major enterprises.

**Bun** now offers **isolated installs** (default for new workspaces with `configVersion = 1`) providing pnpm-like strictness. **Yarn Berry (v4)** with Plug'n'Play mode provides similar strict resolution.

### Shared version policies with syncpack

**syncpack** (v14, used by AWS, Cloudflare, Microsoft, Vercel, Salesforce) enforces consistent dependency versions across all packages in a JavaScript/TypeScript monorepo.

```json
// .syncpackrc
{
  "dependencyTypes": ["prod", "dev"],
  "semverGroups": [{
    "label": "Enforce exact version match across workspace",
    "range": "",
    "dependencies": ["**"],
    "packages": ["**"]
  }]
}
```

Run `syncpack lint` in CI to catch inconsistencies; `syncpack fix` to auto-resolve them. **pnpm Catalogs** (v9.5+) offer a native alternative: define dependency version ranges as reusable constants in `pnpm-workspace.yaml`.

### Phantom dependency prevention

Phantom dependencies occur when a package imports a module it hasn't declared but that's available due to hoisting. This creates fragile builds that break unpredictably.

- **pnpm** (primary solution): Strict `node_modules` by default
- **Bun isolated installs**: New alternative with equivalent strictness
- **Rush** (Microsoft): Symlinking strategy ensures isolation
- **knip**: Detects unused files, dependencies, and exports; catches phantom dependency usage
- **ESLint `import/no-extraneous-dependencies`**: Flags imports of undeclared dependencies

### Versioning strategies

**Fixed/uniform versioning** (all packages share the same version number): simpler mental model, all packages release together. Best for tightly coupled packages where a change in one likely affects others. **Independent versioning** (each package has its own version): more flexible, avoids unnecessary version bumps. Best for packages with distinct release cadences.

**Checklist:**
- [ ] pnpm (or Bun with isolated installs) used as the monorepo package manager
- [ ] syncpack or pnpm Catalogs enforce consistent versions across workspace
- [ ] `syncpack lint` runs in CI and blocks PRs with version inconsistencies
- [ ] Phantom dependency prevention verified (pnpm strict mode or equivalent)
- [ ] Versioning strategy (fixed vs. independent) documented and enforced
- [ ] knip runs quarterly to detect unused dependencies and exports

---

## 11. Dependency auditing cadence from weekly automation to annual strategy

Continuous scanning catches acute vulnerabilities; periodic human review catches strategic drift. Both are essential. This cadence ensures nothing falls through the cracks.

### Weekly: automated scanning in CI

**What runs:** SCA vulnerability scanning (Grype, Snyk, or Trivy) on every build. Dependency license compliance checks. SBOM generation and ingestion into Dependency-Track. Automated update PRs from Renovate.

**Action on findings:** Critical/High vulnerabilities block the build. Medium vulnerabilities generate tracking issues. Low vulnerabilities appear in weekly report.

### Monthly: manual review of critical dependency health

**What to assess:** Review Renovate/Dependabot PR backlog — any update PRs stalled >30 days require investigation. Check OpenSSF Scorecard scores for the **top 10 most critical dependencies** (any score drop >2 points triggers review). Evaluate bus factor changes in critical dependencies. Review VEX (Vulnerability Exploitability eXchange) statements for any temporarily mitigated vulnerabilities.

**Deliverable:** Monthly dependency health summary distributed to engineering leads.

### Quarterly: full dependency tree audit

**Process checklist:**
1. Run unused dependency scan (`depcheck`, `cargo-udeps`, `deptry`, `go mod tidy`) — remove all zombie dependencies
2. Verify SBOM accuracy and completeness against actual build artifacts
3. Re-run license compliance check across all transitive dependencies
4. Assess health scores for all direct dependencies via OpenSSF Scorecard
5. Review dependency budget compliance (counts, bundle size, tree depth)
6. Check for dependency confusion risks (internal vs. public name conflicts)
7. Validate lockfile integrity
8. Test dependency update compatibility in staging environment

**Deliverable:** Quarterly dependency audit report with action items, filed in team knowledge base.

### Annually: strategic dependency review

**Decisions to make:** Evaluate whether any critical dependencies should be **replaced** (declining maintenance, security concerns), **forked** (divergent needs, bus factor risk), or **vendored** (stability requirements). Review and update dependency approval policies, license allowlists, and budget thresholds. Assess SLSA maturity level and plan next-level adoption. Evaluate new tooling options. Conduct S2C2F maturity assessment.

**Deliverable:** Annual dependency strategy document approved by Engineering and Security leadership.

**Checklist:**
- [ ] Weekly automated scans configured and alerts routed appropriately
- [ ] Monthly health review scheduled on team calendar with assigned owner
- [ ] Quarterly audit checklist documented and completed on schedule
- [ ] Annual strategic review scheduled and results integrated into roadmap
- [ ] All audit findings tracked to resolution in issue tracker

---

## 12. Anti-patterns that undermine dependency management

Recognizing and naming anti-patterns helps teams identify them early. Each pattern below includes detection methods and remediation.

**Leftpad syndrome** — adding dependencies for trivial functionality (e.g., `is-odd`, `is-even`, `is-number`). Packages implementing <20 lines of logic should be written inline. Detection: review all dependencies with <50 lines of source code. Remediation: set organizational rule that trivial utilities must be implemented locally.

**Dependency sprawl** — unconstrained growth of the dependency tree. Often driven by "easy `npm install`" culture or AI coding agents that automatically import packages without evaluating necessity. Detection: dependency budget enforcement in CI. Remediation: require justification template for every new dependency.

**Zombie dependencies** — packages listed in `package.json` but never imported. They still increase attack surface, bloat installs, and slow builds. Detection: `depcheck` (npm), `cargo-udeps` (Rust), `deptry` (Python), `knip` (JS/TS). Remediation: quarterly cleanup audit.

**Version pinning without updates** — pinning exact versions but never updating them. Creates "dependency rot" where projects accumulate unpatched vulnerabilities over months or years. Detection: dependency drift score monitoring. Remediation: Renovate with auto-merge for patches.

**Ignoring transitive vulnerabilities** — scanning only direct dependencies while transitive dependencies harbor critical CVEs. Detection: run `npm audit` / `cargo audit` / `pip-audit` which scan the full tree. Remediation: configure SCA tools to scan complete dependency graphs.

**Phantom dependencies in monorepos** — importing modules that aren't declared dependencies but happen to be available via hoisting. Detection: switch to pnpm strict mode; use ESLint `import/no-extraneous-dependencies`. Remediation: declare all actually-used dependencies explicitly.

**Treating SBOMs as static PDFs** — generating SBOMs but storing them as unversioned, unsigned documents rather than machine-readable, queryable, signed artifacts integrated into the vulnerability management pipeline. Detection: verify SBOMs are ingested into Dependency-Track or equivalent. Remediation: automate SBOM generation per build with signing.

**AI-introduced vulnerable dependencies** (NEW, 2025) — AI coding agents hallucinate non-existent packages (~20% of AI-suggested packages don't exist) and import dependencies with known vulnerabilities without evaluation. Detection: verify every AI-suggested package against registries before installation. Remediation: enforce dependency approval workflow regardless of code origin; treat AI-generated code as untrusted third-party input.

**Over-reliance on CVSS alone** — using raw CVSS scores without exploitability context causes alert fatigue. Without reachability analysis, EPSS scores, and business context, teams waste time on unexploitable vulnerabilities. Detection: measure ratio of alerts to actual actions. Remediation: adopt reachability-based SCA tools (Snyk, Socket.dev, Endor Labs).

---

## 13. Recommended tools organized by ecosystem and function

### Vulnerability scanning

| Tool | npm | Cargo | pip | Go | Containers | License |
|------|-----|-------|-----|----|-----------|---------|
| **Grype** | ✅ | ✅ | ✅ | ✅ | ✅ | Apache-2.0 |
| **Trivy** | ✅ | ✅ | ✅ | ✅ | ✅ | Apache-2.0 |
| **Snyk** | ✅ | ✅ | ✅ | ✅ | ✅ | Commercial |
| **npm audit** | ✅ | — | — | — | — | Built-in |
| **cargo audit** | — | ✅ | — | — | — | MIT/Apache-2.0 |
| **pip-audit** | — | — | ✅ | — | — | Apache-2.0 |
| **govulncheck** | — | — | — | ✅ | — | BSD-3-Clause |

### Supply chain security

| Tool | Function | Ecosystems |
|------|----------|------------|
| **Socket.dev** | Real-time malicious package detection, behavioral analysis, reachability | 10+ ecosystems |
| **OpenSSF Scorecard** | Automated project security posture assessment | All GitHub-hosted |
| **Sigstore/Cosign** | Artifact signing and verification | Containers, blobs, npm, PyPI |
| **GuardDog** (OpenSSF) | Malicious package scanner CLI | npm, PyPI, Go |
| **in-toto** (CNCF) | Supply chain layout attestation framework | Language-agnostic |
| **GUAC** (OpenSSF) | Graph-based artifact composition analysis | Language-agnostic |

### SBOM and license compliance

| Tool | Function | Output |
|------|----------|--------|
| **Syft** (Anchore) | SBOM generation | CycloneDX, SPDX |
| **cdxgen** | SBOM generation (security-focused) | CycloneDX |
| **OWASP Dependency-Track** | SBOM ingestion, continuous vulnerability monitoring | Dashboard + API |
| **LicenseFinder** | Cross-language license compliance | Custom reports |
| **cargo-deny** | Rust license + advisory + source checking | CLI output |

### Dependency maintenance

| Tool | Function | Ecosystems |
|------|----------|------------|
| **Renovate** | Automated dependency updates | 90+ package managers |
| **Dependabot** | Security alerts + update PRs | GitHub ecosystems |
| **depcheck** | Unused dependency detection | npm |
| **cargo-udeps** | Unused dependency detection | Rust |
| **deptry** / **knip** | Unused dependency detection | Python / JS/TS |
| **syncpack** | Monorepo version consistency | npm/Yarn/pnpm |
| **Size Limit** | Bundle size enforcement | npm (frontend) |
| **lockfile-lint** | Lockfile integrity validation | npm |

---

## Conclusion: a living protocol for a shifting threat landscape

This protocol is not a one-time checklist — it is a living operational framework. The threat landscape evolves quarterly, as demonstrated by the **xz-utils social engineering campaign** (multi-year timeline), the **September 2025 npm mega-compromise** (single phishing email, 500+ packages affected in hours), and the **emergence of slopsquatting** as a new AI-driven attack vector in 2025.

Three structural changes define the 2025–2026 environment. First, **regulation has arrived**: the EU CRA makes SBOMs and vulnerability reporting legally mandatory with fines up to €15M, with vulnerability reporting obligations starting September 2026. Second, **provenance infrastructure has matured**: Sigstore is now the de facto standard across npm, PyPI, Maven Central, and container registries, though adoption at the package level remains low (~12.6% for top npm packages). Third, **AI is both an accelerant and a threat**: AI coding agents introduce dependencies without human evaluation, and attackers exploit AI hallucinations to register malicious packages.

The most effective defense is **defense in depth**: automated health scoring at adoption time, version pinning with automated updates, SBOM generation per build, real-time malicious package detection, vulnerability SLAs with escalation chains, and regular human review at monthly/quarterly/annual cadences. No single tool or practice is sufficient. Organizations should target **SLSA Level 2** for build provenance, integrate **OpenSSF Scorecard** as a dependency acceptance gate, deploy **Socket.dev or GuardDog** for proactive threat detection, and use **Grype + Dependency-Track** for continuous vulnerability management.

Review and update this protocol at minimum annually or whenever a major supply chain incident occurs. The next review should incorporate final EU CRA implementing acts (expected 2026–2027), the CISA 2025 SBOM Minimum Elements final version, and any evolution in AI-driven dependency management tooling.