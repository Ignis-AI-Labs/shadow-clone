# Team and Agent Templates
*A comprehensive guide for composing effective Shadow Clone agent teams*

## 🎯 Core Principles

### Team Composition Guidelines
1. **Right-size your teams** - Start small, expand only when necessary
2. **Clear specialization** - Each agent should have a distinct primary role
3. **Complementary skills** - Agents should enhance each other's capabilities
4. **Communication paths** - Define explicit collaboration patterns
5. **Authority levels** - Be clear about decision-making boundaries

### When to Use Each Team Pattern

<team_selection_guide>
  <pattern name="Solo Agent">
    <when_to_use>
      - Single-file changes
      - Documentation updates
      - Simple bug fixes
      - Configuration changes
    </when_to_use>
    <avoid_when>
      - Multiple subsystems involved
      - Requires diverse expertise
      - Complex architectural decisions
    </avoid_when>
  </pattern>
  
  <pattern name="Small Team (2-3 agents)">
    <when_to_use>
      - Feature implementation
      - API endpoint creation
      - Component development
      - Focused refactoring
    </when_to_use>
    <avoid_when>
      - Full-stack applications
      - System-wide changes
      - Multi-service coordination
    </avoid_when>
  </pattern>
  
  <pattern name="Standard Team (4-5 agents)">
    <when_to_use>
      - Full application features
      - System integrations
      - Performance optimization
      - Security implementations
    </when_to_use>
    <avoid_when>
      - Simple tasks (overkill)
      - Tight deadlines (coordination overhead)
    </avoid_when>
  </pattern>
  
  <pattern name="Large Team (6-8 agents)">
    <when_to_use>
      - Complete system rewrites
      - Multi-service architectures
      - Complex migrations
      - Enterprise features
    </when_to_use>
    <avoid_when>
      - Teams exceed 8 agents (split instead)
      - Unclear requirements
      - Rapid prototyping needed
    </avoid_when>
  </pattern>
</team_selection_guide>

## 🚀 Concrete Team Examples

### Example 1: E-commerce Feature Implementation

<team_composition>
  <context>
    Building a product recommendation engine for an e-commerce platform.
    Requires ML integration, API development, frontend updates, and testing.
  </context>
  
  <team>
    ```yaml
    team_name: "Recommendation Engine Team"
    project_type: "feature_implementation"
    duration: "2 weeks"
    
    agents:
      - name: "Alex_MLEngineer"
        role: "ML/Data Engineer"
        expertise: 
          primary: ["machine learning", "Python", "TensorFlow"]
          secondary: ["data pipelines", "model optimization"]
        
        responsibilities:
          - "Design and implement recommendation algorithm"
          - "Create training pipeline for product data"
          - "Optimize model for real-time inference"
          - "Document model performance metrics"
        
        assigned_tasks:
          - "Implement collaborative filtering algorithm"
          - "Build feature extraction pipeline"
          - "Create model serving endpoint"
          - "Write performance benchmarks"
        
        collaborates_with: ["Sam_Backend", "Jamie_Frontend"]
        reports_to: "Project Manager"
        
      - name: "Sam_Backend"
        role: "Backend API Developer"
        expertise:
          primary: ["Node.js", "REST APIs", "PostgreSQL"]
          secondary: ["Redis", "microservices", "GraphQL"]
        
        responsibilities:
          - "Design recommendation API endpoints"
          - "Implement caching strategy"
          - "Handle data persistence"
          - "Ensure API performance"
        
        assigned_tasks:
          - "Create /api/recommendations endpoint"
          - "Implement Redis caching layer"
          - "Build user preference storage"
          - "Add request rate limiting"
        
        collaborates_with: ["Alex_MLEngineer", "Jamie_Frontend", "Taylor_QA"]
        decision_authority: ["API design", "database schema"]
        
      - name: "Jamie_Frontend"
        role: "Frontend Developer"
        expertise:
          primary: ["React", "TypeScript", "CSS"]
          secondary: ["Redux", "responsive design", "A/B testing"]
        
        responsibilities:
          - "Build recommendation UI components"
          - "Implement lazy loading"
          - "Create responsive layouts"
          - "Add analytics tracking"
        
        assigned_tasks:
          - "Create ProductRecommendations component"
          - "Implement infinite scroll"
          - "Add loading skeletons"
          - "Build A/B test framework"
        
        collaborates_with: ["Sam_Backend", "Taylor_QA"]
        needs_from_others:
          Sam_Backend: "API documentation and endpoints"
          Alex_MLEngineer: "Recommendation score explanations"
        
      - name: "Taylor_QA"
        role: "QA Engineer"
        expertise:
          primary: ["test automation", "Cypress", "Jest"]
          secondary: ["performance testing", "security testing"]
        
        responsibilities:
          - "Create comprehensive test suite"
          - "Validate recommendation accuracy"
          - "Test edge cases"
          - "Ensure accessibility compliance"
        
        assigned_tasks:
          - "Write E2E tests for recommendation flow"
          - "Create unit tests for API endpoints"
          - "Test recommendation algorithm accuracy"
          - "Verify WCAG compliance"
        
        collaborates_with: ["all"]
        blocks_deployment_if: ["tests fail", "coverage < 80%"]
    ```
  </team>
</team_composition>

### Example 2: Security Audit and Remediation

<team_composition>
  <context>
    Conducting security audit of a financial services application.
    Focus on OWASP top 10, compliance requirements, and infrastructure.
  </context>
  
  <team>
    ```yaml
    team_name: "Security Audit Alpha"
    project_type: "security_audit"
    duration: "1 week"
    
    agents:
      - name: "Morgan_SecLead"
        role: "Security Team Lead"
        expertise:
          primary: ["threat modeling", "security architecture", "compliance"]
          secondary: ["OWASP", "PCI-DSS", "SOC2"]
        
        responsibilities:
          - "Define audit scope and methodology"
          - "Prioritize vulnerabilities"
          - "Create remediation roadmap"
          - "Prepare executive report"
        
        assigned_tasks:
          - "Conduct threat modeling session"
          - "Review authentication architecture"
          - "Assess data encryption practices"
          - "Create security scorecard"
        
        decision_authority: ["audit scope", "risk ratings", "remediation timeline"]
        final_deliverables: ["security report", "remediation plan"]
        
      - name: "Riley_AppSec"
        role: "Application Security Engineer"
        expertise:
          primary: ["SAST", "DAST", "code review"]
          secondary: ["penetration testing", "secure coding"]
        
        responsibilities:
          - "Perform code security analysis"
          - "Test for injection vulnerabilities"
          - "Review authentication/authorization"
          - "Validate input sanitization"
        
        assigned_tasks:
          - "Run static analysis with Semgrep"
          - "Test all API endpoints for SQLi/XSS"
          - "Review JWT implementation"
          - "Check for hardcoded secrets"
        
        tools_required: ["Semgrep", "OWASP ZAP", "Burp Suite"]
        reports_findings_to: "Morgan_SecLead"
        
      - name: "Casey_InfraSec"
        role: "Infrastructure Security Specialist"
        expertise:
          primary: ["cloud security", "AWS", "network security"]
          secondary: ["container security", "IaC", "monitoring"]
        
        responsibilities:
          - "Audit cloud configurations"
          - "Review network segmentation"
          - "Check IAM policies"
          - "Validate encryption at rest/transit"
        
        assigned_tasks:
          - "Scan AWS resources with ScoutSuite"
          - "Review VPC and security group configs"
          - "Audit S3 bucket policies"
          - "Check TLS configurations"
        
        critical_checks: ["public S3 buckets", "open security groups", "root access"]
        escalates_to: "Morgan_SecLead"
    ```
  </team>
</team_composition>

### Example 3: Microservices Migration

<team_composition>
  <context>
    Migrating monolithic Node.js application to microservices architecture.
    Requires careful planning, gradual migration, and zero downtime.
  </context>
  
  <team>
    ```yaml
    team_name: "Microservices Migration Force"
    project_type: "architectural_migration"
    duration: "4 weeks"
    
    agents:
      - name: "Jordan_Architect"
        role: "Solutions Architect"
        expertise:
          primary: ["microservices", "domain-driven design", "event sourcing"]
          secondary: ["Kubernetes", "service mesh", "API gateway"]
        
        responsibilities:
          - "Define service boundaries"
          - "Design communication patterns"
          - "Plan migration phases"
          - "Ensure backward compatibility"
        
        initial_tasks:
          - "Analyze monolith for service extraction"
          - "Create bounded context map"
          - "Design event-driven architecture"
          - "Define API contracts"
        
        deliverables:
          - service_design_document
          - api_specification
          - migration_roadmap
          - rollback_procedures
        
      - name: "Avery_Backend"
        role: "Senior Backend Engineer"
        expertise:
          primary: ["Node.js", "Express", "MongoDB"]
          secondary: ["RabbitMQ", "Redis", "gRPC"]
        
        responsibilities:
          - "Extract services from monolith"
          - "Implement service communication"
          - "Manage data migration"
          - "Maintain feature parity"
        
        current_sprint_tasks:
          - "Extract user service from monolith"
          - "Implement event publishing"
          - "Create service discovery mechanism"
          - "Build circuit breakers"
        
        dependencies:
          needs_from_Jordan: "Service boundaries definition"
          provides_to_Quinn: "Service endpoints for deployment"
        
      - name: "Quinn_DevOps"
        role: "DevOps Engineer"
        expertise:
          primary: ["Kubernetes", "Docker", "CI/CD"]
          secondary: ["Terraform", "Prometheus", "Istio"]
        
        responsibilities:
          - "Set up Kubernetes cluster"
          - "Create deployment pipelines"
          - "Implement service mesh"
          - "Ensure zero-downtime deployments"
        
        infrastructure_tasks:
          - "Configure K8s namespaces and RBAC"
          - "Set up Istio service mesh"
          - "Create Helm charts for services"
          - "Implement canary deployments"
        
        sla_requirements:
          uptime: "99.9%"
          deployment_time: "< 5 minutes"
          rollback_time: "< 2 minutes"
        
      - name: "Dakota_DataEng"
        role: "Data Engineer"
        expertise:
          primary: ["data migration", "ETL", "event streaming"]
          secondary: ["Kafka", "database sharding", "CQRS"]
        
        responsibilities:
          - "Design data separation strategy"
          - "Implement event streaming"
          - "Ensure data consistency"
          - "Create data sync mechanisms"
        
        critical_tasks:
          - "Implement Kafka event streaming"
          - "Create database-per-service migration"
          - "Build saga orchestration"
          - "Set up CDC for data sync"
        
        risk_mitigation:
          - "Dual writes during transition"
          - "Event replay capabilities"
          - "Data validation checkpoints"
        
      - name: "Sage_QA"
        role: "QA Automation Lead"
        expertise:
          primary: ["test automation", "contract testing", "chaos engineering"]
          secondary: ["performance testing", "Pact", "K6"]
        
        responsibilities:
          - "Create service integration tests"
          - "Implement contract testing"
          - "Validate migration phases"
          - "Run chaos experiments"
        
        test_strategy:
          - "Consumer-driven contract tests"
          - "End-to-end journey tests"
          - "Performance regression tests"
          - "Fault injection testing"
        
        quality_gates:
          - "All contracts validated"
          - "No performance degradation"
          - "Chaos tests pass"
          - "Zero data loss verified"
    ```
  </team>
</team_composition>

## 📋 Single Agent Templates

### Solo Developer Agent (Comprehensive)

<agent_template>
  <use_case>Single developer handling a complete feature or module</use_case>
  
  ```yaml
  agent:
    name: "Cameron_Fullstack"
    role: "Full-Stack Developer"
    
    expertise:
      primary: 
        - "React/TypeScript"
        - "Node.js/Express"
        - "PostgreSQL"
      secondary:
        - "Docker"
        - "Jest/Cypress"
        - "AWS basics"
    
    working_style:
      approach: "iterative development with frequent commits"
      communication: "detailed PR descriptions and code comments"
      documentation: "inline comments and README updates"
    
    task_breakdown:
      planning:
        - "Review requirements and ask clarifying questions"
        - "Create technical design document"
        - "Set up project structure"
      
      implementation:
        - "Build backend API endpoints"
        - "Create database migrations"
        - "Implement frontend components"
        - "Add comprehensive error handling"
      
      testing:
        - "Write unit tests (minimum 80% coverage)"
        - "Create integration tests"
        - "Manual testing of edge cases"
      
      deployment:
        - "Update deployment configurations"
        - "Create rollback plan"
        - "Document new features"
    
    constraints:
      - "Must follow existing code style"
      - "Cannot merge without code review"
      - "Must update tests for any logic changes"
      - "Performance impact must be measured"
    
    tools_and_resources:
      development:
        - "VS Code with ESLint/Prettier"
        - "Docker for local development"
        - "Postman for API testing"
      
      monitoring:
        - "Sentry for error tracking"
        - "DataDog for performance"
        - "CloudWatch for logs"
  ```
</agent_template>

### Specialist Agent Template

<agent_template>
  <use_case>Domain expert focusing on specific technical area</use_case>
  
  ```yaml
  agent:
    name: "Skyler_Performance"
    role: "Performance Optimization Specialist"
    
    expertise:
      deep_knowledge:
        - "Database query optimization"
        - "Caching strategies"
        - "Load testing"
        - "Profiling and benchmarking"
      
      tools_mastery:
        - "JMeter/K6 for load testing"
        - "Chrome DevTools profiling"
        - "APM tools (New Relic/DataDog)"
        - "Database explain plans"
    
    optimization_methodology:
      1_measure:
        - "Establish baseline metrics"
        - "Identify bottlenecks with profiling"
        - "Document current performance"
      
      2_analyze:
        - "Review slow queries"
        - "Analyze memory usage"
        - "Check network waterfall"
        - "Review algorithm complexity"
      
      3_optimize:
        - "Implement caching layers"
        - "Optimize database indexes"
        - "Reduce payload sizes"
        - "Implement lazy loading"
      
      4_validate:
        - "Run before/after benchmarks"
        - "Conduct load testing"
        - "Monitor in production"
        - "Document improvements"
    
    success_metrics:
      target_improvements:
        api_response_time: "< 200ms p95"
        page_load_time: "< 3s on 3G"
        database_queries: "< 50ms average"
        memory_usage: "< 512MB baseline"
    
    reporting:
      deliverables:
        - "Performance audit report"
        - "Optimization roadmap"
        - "Benchmark results"
        - "Monitoring dashboard"
  ```
</agent_template>

## 🔧 Dynamic Team Generation

### Team Generator by Project Requirements

```javascript
function generateOptimalTeam(requirements) {
  const { 
    projectType, 
    techStack, 
    timeline, 
    complexity,
    specialRequirements 
  } = requirements;
  
  // Base team composition logic
  const teamTemplates = {
    'web-application': {
      small: ['Fullstack Developer', 'QA Engineer'],
      medium: ['Backend Dev', 'Frontend Dev', 'QA Engineer', 'DevOps'],
      large: ['Tech Lead', 'Backend Dev', 'Frontend Dev', 'QA Lead', 'DevOps', 'DBA']
    },
    
    'api-service': {
      small: ['Backend Developer'],
      medium: ['Backend Dev', 'API Architect', 'QA Engineer'],
      large: ['Tech Lead', 'Sr Backend Dev', 'Jr Backend Dev', 'QA Engineer', 'DevOps']
    },
    
    'mobile-app': {
      small: ['Mobile Developer', 'Backend Dev'],
      medium: ['iOS Dev', 'Android Dev', 'Backend Dev', 'QA'],
      large: ['Mobile Lead', 'iOS Dev', 'Android Dev', 'Backend Dev', 'UI/UX', 'QA']
    },
    
    'data-pipeline': {
      small: ['Data Engineer'],
      medium: ['Data Engineer', 'Backend Dev', 'Data Analyst'],
      large: ['Data Architect', 'Sr Data Eng', 'Backend Dev', 'ML Engineer', 'DevOps']
    }
  };
  
  // Special requirement modifiers
  const specialistAddons = {
    'security-critical': ['Security Engineer'],
    'performance-critical': ['Performance Engineer'],
    'ml-required': ['ML Engineer'],
    'blockchain': ['Blockchain Developer'],
    'real-time': ['Systems Engineer'],
    'accessibility': ['Accessibility Specialist']
  };
  
  // Get base team
  let team = teamTemplates[projectType]?.[complexity] || 
             teamTemplates['web-application'][complexity];
  
  // Add specialists based on requirements
  specialRequirements.forEach(req => {
    if (specialistAddons[req]) {
      team = [...team, ...specialistAddons[req]];
    }
  });
  
  // Remove duplicates and return
  return [...new Set(team)];
}

// Example usage:
const projectRequirements = {
  projectType: 'web-application',
  techStack: ['React', 'Node.js', 'PostgreSQL'],
  timeline: '3 weeks',
  complexity: 'medium',
  specialRequirements: ['security-critical', 'performance-critical']
};

const optimalTeam = generateOptimalTeam(projectRequirements);
// Result: ['Backend Dev', 'Frontend Dev', 'QA Engineer', 'DevOps', 'Security Engineer', 'Performance Engineer']
```

### Skill-Based Agent Matcher

```javascript
function matchAgentsToTasks(tasks, availableAgents) {
  const taskAgentMapping = tasks.map(task => {
    // Find best agent for each task
    const suitableAgents = availableAgents
      .map(agent => ({
        agent,
        score: calculateSkillMatch(task.requiredSkills, agent.skills)
      }))
      .filter(match => match.score > 0.7)
      .sort((a, b) => b.score - a.score);
    
    return {
      task: task.name,
      assignedAgent: suitableAgents[0]?.agent || 'Needs specialist',
      alternativeAgents: suitableAgents.slice(1, 3).map(m => m.agent),
      missingSkills: task.requiredSkills.filter(
        skill => !suitableAgents[0]?.agent.skills.includes(skill)
      )
    };
  });
  
  return taskAgentMapping;
}

function calculateSkillMatch(required, available) {
  const matches = required.filter(skill => available.includes(skill));
  return matches.length / required.length;
}
```

## 🎯 Best Practices & Anti-Patterns

### ✅ DO's

<best_practices>
  <practice name="Clear Role Definition">
    <why>Prevents overlap and confusion</why>
    <how>
      - Define primary responsibility in one sentence
      - List 3-5 specific deliverables
      - Specify decision-making authority
    </how>
    <example>
      "Backend API Developer responsible for user service.
      Owns: API design, database schema, performance.
      Decides: Technology choices within service boundary."
    </example>
  </practice>
  
  <practice name="Explicit Dependencies">
    <why>Prevents blocking and clarifies workflow</why>
    <how>
      - List what each agent needs from others
      - Define hand-off points
      - Specify expected formats/artifacts
    </how>
  </practice>
  
  <practice name="Skill Overlap">
    <why>Provides resilience and knowledge sharing</why>
    <how>
      - 20-30% skill overlap between adjacent roles
      - Secondary skills that complement primary agents
      - Cross-training opportunities defined
    </how>
  </practice>
</best_practices>

### ❌ DON'Ts

<anti_patterns>
  <pattern name="Kitchen Sink Teams">
    <problem>Adding agents "just in case" without clear need</problem>
    <symptoms>
      - Agents with < 3 assigned tasks
      - Unclear reporting structure
      - Overlapping responsibilities
    </symptoms>
    <solution>Start small, add agents when specific needs arise</solution>
  </pattern>
  
  <pattern name="Siloed Specialists">
    <problem>Agents working in complete isolation</problem>
    <symptoms>
      - No collaboration defined
      - Integration issues late in project
      - Repeated work across agents
    </symptoms>
    <solution>Define explicit collaboration points and shared goals</solution>
  </pattern>
  
  <pattern name="Undefined Authority">
    <problem>No clear decision-making hierarchy</problem>
    <symptoms>
      - Conflicting implementations
      - Delayed decisions
      - Inconsistent approaches
    </symptoms>
    <solution>Specify decision authority for each technical domain</solution>
  </pattern>
</anti_patterns>

## 📊 Team Performance Metrics

### Measuring Team Effectiveness

```yaml
team_metrics:
  velocity:
    - tasks_completed_per_sprint
    - story_points_delivered
    - cycle_time_per_feature
  
  quality:
    - defect_escape_rate
    - code_review_turnaround
    - test_coverage_percentage
  
  collaboration:
    - cross_agent_interactions
    - knowledge_sharing_sessions
    - blocker_resolution_time
  
  efficiency:
    - rework_percentage
    - automation_adoption
    - deployment_frequency
```

### Team Health Indicators

<health_check>
  <indicator name="Balanced Workload">
    <healthy>Each agent has 3-7 active tasks</healthy>
    <warning>Some agents have < 2 or > 10 tasks</warning>
    <critical>Severe imbalance or idle agents</critical>
  </indicator>
  
  <indicator name="Clear Communication">
    <healthy>All dependencies documented and flowing</healthy>
    <warning>Some informal communication channels</warning>
    <critical>Blocking due to communication gaps</critical>
  </indicator>
  
  <indicator name="Skill Coverage">
    <healthy>All required skills covered with backup</healthy>
    <warning>Single points of failure for some skills</warning>
    <critical>Critical skills missing from team</critical>
  </indicator>
</health_check>

---

*Remember: The best team is not the largest team, but the right-sized team with clear roles, complementary skills, and excellent communication patterns.*