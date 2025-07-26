// Auto-generated from shadow-clone-debug.md
// DO NOT EDIT DIRECTLY
export const content = `# Debug Mode Configuration

<mode_overview>
  <purpose>
    Debug Mode enables rapid identification and resolution of bugs while maintaining the highest standards of security and system stability. This mode transforms reactive bug-fixing into proactive system hardening through systematic analysis and comprehensive validation.
  </purpose>
  
  <motivation>
    Effective debugging requires more than fixing immediate symptoms. By following this structured approach, teams ensure that every bug becomes an opportunity to strengthen the system, prevent future issues, and build institutional knowledge.
  </motivation>
  
  <key_benefits>
    - Systematic root cause analysis prevents recurring issues
    - Security-first approach protects system integrity
    - Comprehensive documentation aids future debugging
    - Structured validation ensures production readiness
  </key_benefits>
</mode_overview>

<wave_structure>
  <wave_0>
    <title>Issue Analysis & Strategic Planning</title>
    
    <context>
      The initial wave establishes a clear understanding of the issue's nature and impact. This foundational analysis determines the debugging strategy and resource allocation for subsequent waves.
    </context>
    
    <team_composition>
      <role name="Debug Lead">Coordinates the debugging effort and ensures systematic approach</role>
      <role name="Security Analyst">Evaluates potential security implications and vulnerabilities</role>
      <role name="System Architect">Assesses architectural impact and integration concerns</role>
      <role name="Record Keeper">Documents all findings and maintains audit trail</role>
    </team_composition>
    
    <critical_tasks>
      <task priority="1">
        <action>Reproduce the issue in an isolated environment</action>
        <rationale>Controlled reproduction ensures accurate diagnosis without affecting production</rationale>
      </task>
      <task priority="2">
        <action>Classify issue severity (Critical/High/Medium/Low)</action>
        <rationale>Proper classification ensures appropriate resource allocation and response time</rationale>
      </task>
      <task priority="3">
        <action>Analyze blast radius and affected systems</action>
        <rationale>Understanding impact scope guides containment and communication strategies</rationale>
      </task>
      <task priority="4">
        <action>Design debug strategy with appropriate wave count</action>
        <rationale>Tailored approaches ensure efficient resolution based on issue complexity</rationale>
      </task>
    </critical_tasks>
    
    <wave_planning_guidelines>
      <issue_type severity="Critical/Security">
        <waves>3+ waves</waves>
        <approach>Deep analysis, comprehensive fix, extensive validation, security audit</approach>
      </issue_type>
      <issue_type severity="Performance/Integration">
        <waves>2-3 waves</waves>
        <approach>Thorough diagnosis, targeted fix, performance verification</approach>
      </issue_type>
      <issue_type severity="UI/Minor">
        <waves>1-2 waves</waves>
        <approach>Quick fix, basic validation, user experience verification</approach>
      </issue_type>
    </wave_planning_guidelines>
    
    <required_outputs>
      <output>Issue classification with severity justification</output>
      <output>Detailed reproduction steps and environment details</output>
      <output>Impact analysis including affected users and systems</output>
      <output>Debug strategy document with planned wave activities</output>
    </required_outputs>
  </wave_0>
  
  <dynamic_waves>
    <title>Targeted Debugging Waves (Wave 1 to Wave N)</title>
    
    <context>
      Each debugging wave focuses on specific aspects of the issue, building upon previous findings. Teams adapt their approach based on the issue type while maintaining consistent quality standards.
    </context>
    
    <consistent_team_structure>
      <role name="Debug Engineer">Implements technical solutions and conducts analysis</role>
      <role name="Domain Expert">Provides specialized knowledge for the affected area</role>
      <role name="Test Engineer">Creates and executes comprehensive test scenarios</role>
      <role name="Record Keeper">Maintains detailed documentation of all activities</role>
    </consistent_team_structure>
    
    <debug_approaches>
      <approach type="Security Issues">
        <activities>
          - Conduct vulnerability analysis using security scanning tools
          - Develop exploit prevention mechanisms
          - Perform penetration testing on proposed fixes
          - Implement security hardening measures
        </activities>
        <focus>Ensure complete vulnerability remediation while maintaining system functionality</focus>
      </approach>
      
      <approach type="Performance Bugs">
        <activities>
          - Execute comprehensive profiling across system components
          - Identify and analyze performance bottlenecks
          - Implement optimization strategies
          - Validate improvements through benchmarking
        </activities>
        <focus>Achieve measurable performance improvements without sacrificing reliability</focus>
      </approach>
      
      <approach type="Integration Failures">
        <activities>
          - Perform API contract validation
          - Trace data flow through integrated systems
          - Test edge cases in integration points
          - Implement robust error handling
        </activities>
        <focus>Establish reliable communication between system components</focus>
      </approach>
      
      <approach type="Logic Errors">
        <activities>
          - Analyze state transitions and data transformations
          - Test boundary conditions and edge cases
          - Verify algorithm correctness
          - Implement comprehensive input validation
        </activities>
        <focus>Ensure logical correctness across all execution paths</focus>
      </approach>
      
      <approach type="UI/UX Issues">
        <activities>
          - Conduct cross-browser compatibility testing
          - Verify accessibility standards compliance
          - Test responsive design across devices
          - Validate user interaction flows
        </activities>
        <focus>Deliver consistent, accessible user experience across platforms</focus>
      </approach>
    </debug_approaches>
    
    <wave_deliverables>
      <deliverable>Root cause analysis with supporting evidence and timeline</deliverable>
      <deliverable>Implemented fix with clean, documented code</deliverable>
      <deliverable>Comprehensive regression test suite</deliverable>
      <deliverable>Performance impact measurement report</deliverable>
      <deliverable>Security assessment of all changes</deliverable>
    </wave_deliverables>
  </dynamic_waves>
  
  <final_wave>
    <title>Validation & System Hardening</title>
    
    <context>
      The final wave ensures that fixes are production-ready and the system is more robust than before. This comprehensive validation prevents regression and establishes safeguards against similar issues.
    </context>
    
    <team_composition>
      <role name="QA Lead">Oversees comprehensive testing and quality assurance</role>
      <role name="Security Auditor">Performs final security validation and compliance checks</role>
      <role name="Performance Engineer">Verifies system performance meets requirements</role>
      <role name="Record Keeper">Compiles final documentation and lessons learned</role>
    </team_composition>
    
    <validation_checklist>
      <step>Execute full regression test suite across all affected components</step>
      <step>Perform security scanning with multiple tools and methodologies</step>
      <step>Conduct performance benchmarking against baseline metrics</step>
      <step>Verify all edge cases and boundary conditions</step>
      <step>Test rollback procedures to ensure safe deployment</step>
      <step>Validate monitoring and alerting for the fixed issue</step>
    </validation_checklist>
    
    <final_outputs>
      <output name="DEBUG_REPORT.md">
        <content>Complete issue lifecycle documentation</content>
        <includes>Timeline, root cause, fix details, validation results</includes>
      </output>
      <output name="FIX_VALIDATION.md">
        <content>Comprehensive test results and metrics</content>
        <includes>Test coverage, performance benchmarks, security scan results</includes>
      </output>
      <output name="Updated Test Suites">
        <content>Enhanced tests preventing regression</content>
        <includes>Unit tests, integration tests, edge case coverage</includes>
      </output>
      <output name="Deployment Package">
        <content>Production-ready code with safety mechanisms</content>
        <includes>Fixed code, rollback plan, deployment instructions</includes>
      </output>
    </final_outputs>
  </final_wave>
</wave_structure>

<debugging_principles>
  <principle name="Root Cause Focus">
    <guideline>Always identify and address the fundamental cause, not just visible symptoms</guideline>
    <rationale>Fixing symptoms leads to recurring issues and technical debt accumulation</rationale>
  </principle>
  
  <principle name="Isolated Testing">
    <guideline>Test every fix in isolation before integration testing</guideline>
    <rationale>Isolated testing ensures the fix works correctly without environmental dependencies</rationale>
  </principle>
  
  <principle name="Comprehensive Documentation">
    <guideline>Document every finding, decision, and action taken during debugging</guideline>
    <rationale>Detailed documentation accelerates future debugging and knowledge sharing</rationale>
  </principle>
  
  <principle name="State Preservation">
    <guideline>Capture and preserve system state before making any changes</guideline>
    <rationale>State preservation enables accurate analysis and safe rollback if needed</rationale>
  </principle>
  
  <principle name="Side Effect Analysis">
    <guideline>Thoroughly analyze potential side effects of every fix</guideline>
    <rationale>Understanding side effects prevents introducing new bugs while fixing existing ones</rationale>
  </principle>
  
  <principle name="Production-Ready Code">
    <guideline>Implement permanent, well-tested solutions suitable for production</guideline>
    <rationale>Temporary workarounds create technical debt and future maintenance burden</rationale>
  </principle>
</debugging_principles>

<success_metrics>
  <metric name="Issue Resolution">
    <criteria>Original issue cannot be reproduced in any environment</criteria>
    <verification>Multiple reproduction attempts across different scenarios</verification>
  </metric>
  
  <metric name="Test Coverage">
    <criteria>All related test cases pass consistently</criteria>
    <verification>Automated test suite execution with 100% pass rate</verification>
  </metric>
  
  <metric name="Performance Maintenance">
    <criteria>System performance remains at or above baseline levels</criteria>
    <verification>Benchmarking results compared to pre-issue metrics</verification>
  </metric>
  
  <metric name="Security Posture">
    <criteria>Security stance maintained or enhanced</criteria>
    <verification>Security audit results and vulnerability scan reports</verification>
  </metric>
  
  <metric name="Knowledge Transfer">
    <criteria>Clear documentation enables team learning</criteria>
    <verification>Documentation review and team knowledge assessment</verification>
  </metric>
</success_metrics>

<key_deliverables>
  <deliverable_summary>
    <item>Root cause analysis with supporting evidence and timeline</item>
    <item>Production-ready fix with comprehensive test coverage</item>
    <item>Prevention recommendations for similar issues</item>
    <item>Knowledge base updates for institutional learning</item>
    <item>Post-mortem analysis for critical issues</item>
  </deliverable_summary>
</key_deliverables>

<mode_specific_guidelines>
  <guideline>
    <instruction>Focus debugging efforts on understanding the complete problem context</instruction>
    <example>Before fixing a memory leak, analyze memory allocation patterns across the application</example>
  </guideline>
  
  <guideline>
    <instruction>Implement monitoring and alerting for the specific issue being fixed</instruction>
    <example>Add performance metrics collection around the optimized code path</example>
  </guideline>
  
  <guideline>
    <instruction>Create regression tests that specifically target the bug scenario</instruction>
    <example>Write tests that reproduce the exact conditions that triggered the bug</example>
  </guideline>
  
  <guideline>
    <instruction>Share debugging insights with the broader team</instruction>
    <example>Conduct a lunch-and-learn session about the debugging techniques used</example>
  </guideline>
</mode_specific_guidelines>`;
