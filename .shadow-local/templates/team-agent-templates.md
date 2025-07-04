# Team and Agent Templates

## Quick Team Templates

### Small Feature Team (2-3 agents)
```yaml
team_name: "Feature Team Alpha"
agents:
  - role: "Lead Developer"
    expertise: ["architecture", "full-stack"]
    responsibilities: ["design", "core implementation", "review"]
  
  - role: "QA Engineer"  
    expertise: ["testing", "automation"]
    responsibilities: ["test planning", "test execution", "quality gates"]
```

### Standard Development Team (4-5 agents)
```yaml
team_name: "Development Team Beta"
agents:
  - role: "Tech Lead"
    expertise: ["architecture", "system design"]
    responsibilities: ["technical decisions", "code review", "mentoring"]
  
  - role: "Backend Developer"
    expertise: ["APIs", "databases", "performance"]
    responsibilities: ["API development", "data modeling", "optimization"]
  
  - role: "Frontend Developer"
    expertise: ["UI/UX", "React/Vue", "responsive design"]
    responsibilities: ["user interface", "user experience", "accessibility"]
  
  - role: "DevOps Engineer"
    expertise: ["CI/CD", "cloud", "monitoring"]
    responsibilities: ["deployment", "infrastructure", "automation"]
  
  - role: "QA Engineer"
    expertise: ["testing", "security", "performance"]
    responsibilities: ["test strategy", "quality assurance", "validation"]
```

### Security Audit Team
```yaml
team_name: "Security Team Gamma"
agents:
  - role: "Security Lead"
    expertise: ["threat modeling", "compliance", "architecture"]
    responsibilities: ["audit planning", "risk assessment", "reporting"]
  
  - role: "AppSec Engineer"
    expertise: ["SAST", "DAST", "code review"]
    responsibilities: ["code analysis", "vulnerability testing", "remediation"]
  
  - role: "Infrastructure Security"
    expertise: ["cloud security", "networking", "hardening"]
    responsibilities: ["infrastructure audit", "configuration review", "monitoring"]
```

## Single Agent Templates

### Generic Developer Agent
```yaml
agent:
  name: "[Agent Name]"
  role: "Software Developer"
  expertise: 
    - primary: "[Main skill]"
    - secondary: ["[Skill 2]", "[Skill 3]"]
  
  goals:
    - "Deliver high-quality code"
    - "Follow project standards"
    - "Collaborate effectively"
  
  constraints:
    - "Must follow coding standards"
    - "Cannot commit without review"
    - "Must update documentation"
  
  tools:
    - "IDE and development environment"
    - "Testing frameworks"
    - "Version control"
```

### Specialized Agent Template
```yaml
agent:
  name: "[Agent Name]"
  role: "[Specific Role]"
  expertise: "[Domain expertise]"
  
  responsibilities:
    primary: "[Main responsibility]"
    secondary: 
      - "[Additional task 1]"
      - "[Additional task 2]"
  
  decision_authority:
    - can_decide: ["[Area 1]", "[Area 2]"]
    - needs_approval: ["[Area 3]", "[Area 4]"]
  
  communication:
    reports_to: "[Lead Agent]"
    collaborates_with: ["[Agent 1]", "[Agent 2]"]
    update_frequency: "daily"
```

## Team Formation Guidelines

### For Simple Tasks (1-2 days)
- 1-2 agents maximum
- Generalist roles preferred
- Minimal coordination overhead

### For Medium Projects (1-2 weeks)
- 3-4 agents optimal
- Mix of specialists and generalists
- Daily sync recommended

### For Complex Initiatives (>2 weeks)
- 5-7 agents maximum (beyond this, split into sub-teams)
- Clear specialization required
- Formal coordination structure

## Dynamic Team Generation

### By Project Type
```javascript
function generateTeam(projectType, complexity) {
  switch(projectType) {
    case 'web-app':
      return complexity > 'medium' 
        ? standardDevelopmentTeam 
        : smallFeatureTeam;
    
    case 'security-audit':
      return securityAuditTeam;
    
    case 'api-only':
      return backendFocusedTeam;
    
    default:
      return customTeam;
  }
}
```

### By Skills Required
```javascript
function assignAgentsBySkills(requiredSkills) {
  return {
    agents: requiredSkills.map(skill => ({
      role: `${skill} Specialist`,
      expertise: [skill],
      responsibilities: [`Handle all ${skill} related tasks`]
    }))
  };
}
```

## Best Practices

1. **Keep teams small** - Prefer multiple small teams over one large team
2. **Clear roles** - Each agent should know their primary responsibility  
3. **Overlap skills** - Some redundancy prevents bottlenecks
4. **Define authority** - Be clear about who makes what decisions
5. **Communication paths** - Explicit about who talks to whom