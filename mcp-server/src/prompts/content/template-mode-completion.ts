// Shadow Clone — Mode Completion Template
// Source of truth: edit this file directly
export const content = `# MODE COMPLETION SUMMARY TEMPLATE

*Use this template to create comprehensive completion summaries that showcase successful project outcomes with measurable results*

## Template Structure

\`\`\`xml
<mode_completion>
  <metadata>
    <mode_name>[e.g., feature-development, debug-investigation, architecture-planning]</mode_name>
    <start_time>[ISO 8601 timestamp]</start_time>
    <end_time>[ISO 8601 timestamp]</end_time>
    <total_duration>[e.g., 4 hours 37 minutes]</total_duration>
    <total_waves>[number]</total_waves>
    <completion_status>SUCCESS</completion_status>
  </metadata>

  <executive_summary>
    <overview>
      [2-3 paragraphs describing the overall achievement and impact. Focus on what was accomplished, why it matters, and the value delivered.]
    </overview>
    <key_achievements>
      - [Achievement 1: Specific, measurable outcome]
      - [Achievement 2: Specific, measurable outcome]
      - [Achievement 3: Specific, measurable outcome]
    </key_achievements>
  </executive_summary>

  <wave_summaries>
    <wave number="0" status="COMPLETE">
      <objectives>Initial assessment and planning</objectives>
      <outcomes>
        - [Specific outcome with metric]
        - [Specific outcome with metric]
      </outcomes>
      <deliverables>
        - [Deliverable with path/location]
        - [Deliverable with path/location]
      </deliverables>
      <agents_deployed>3</agents_deployed>
      <duration>45 minutes</duration>
    </wave>
    
    [Continue for all waves...]
  </wave_summaries>

  <deliverables_inventory>
    <documents>
      <document type="specification" path=".waves/wave_0/feature_spec.md">
        Feature specification with 15 user stories and acceptance criteria
      </document>
      <document type="architecture" path=".waves/wave_1/architecture_design.md">
        System architecture design with component diagrams
      </document>
    </documents>
    
    <code_artifacts>
      <artifact type="implementation" path="src/components/UserAuth.js">
        Complete user authentication module with OAuth2 integration
      </artifact>
      <artifact type="configuration" path="config/security.json">
        Security configuration with role-based access control
      </artifact>
    </code_artifacts>
    
    <quality_reports>
      <report type="testing" path=".waves/wave_2/test_results.md">
        Test execution report: 98% coverage, all tests passing
      </report>
      <report type="performance" path=".waves/wave_3/performance_analysis.md">
        Performance analysis showing 40% improvement in load times
      </report>
    </quality_reports>
  </deliverables_inventory>

  <metrics_and_achievements>
    <quantitative_metrics>
      <metric name="Total Agents Deployed" value="12" />
      <metric name="Files Created/Modified" value="47" />
      <metric name="Test Coverage Achieved" value="98%" />
      <metric name="Performance Improvement" value="40%" />
      <metric name="Quality Gates Passed" value="100%" />
      <metric name="Documentation Pages" value="8" />
    </quantitative_metrics>
    
    <qualitative_achievements>
      - Successfully implemented complete user authentication system
      - Established robust error handling with 100% edge case coverage
      - Created comprehensive documentation exceeding industry standards
      - Delivered 2 days ahead of schedule
    </qualitative_achievements>
  </metrics_and_achievements>

  <key_decisions>
    <decision number="1">
      <description>Chose OAuth2 over traditional session-based authentication</description>
      <rationale>Provides better security, scalability, and third-party integration options</rationale>
      <impact>Enabled seamless SSO integration saving 3 weeks of development time</impact>
    </decision>
    <decision number="2">
      <description>Implemented event-driven architecture for real-time updates</description>
      <rationale>Reduces server load by 60% compared to polling approach</rationale>
      <impact>Improved user experience with instant notifications</impact>
    </decision>
  </key_decisions>

  <lessons_learned>
    <successes>
      - Parallel agent deployment reduced overall completion time by 65%
      - Early architecture validation prevented major refactoring
      - Comprehensive testing caught 15 edge cases before production
    </successes>
    
    <challenges_overcome>
      <challenge>
        <description>Initial database schema limitations</description>
        <resolution>Redesigned with proper indexing, improving query performance by 80%</resolution>
      </challenge>
      <challenge>
        <description>Complex state management in frontend</description>
        <resolution>Implemented Redux pattern with clear separation of concerns</resolution>
      </challenge>
    </challenges_overcome>
    
    <recommendations>
      - Continue using parallel agent deployment for similar features
      - Implement automated performance testing in CI/CD pipeline
      - Create reusable authentication components for future projects
    </recommendations>
  </lessons_learned>

  <resource_utilization>
    <agent_hours>18.5 total agent hours across 12 agents</agent_hours>
    <wave_directory_size>2.4 MB</wave_directory_size>
    <efficiency_rating>EXCELLENT - Completed 40% faster than estimated</efficiency_rating>
  </resource_utilization>

  <final_status>
    <status>MODE COMPLETE - SUCCESS</status>
    <summary>
      All waves successfully completed with 100% deliverable completion rate.
      System fully tested, documented, and ready for production deployment.
      Performance exceeds requirements by 40%. Zero critical issues remaining.
    </summary>
  </final_status>

  <next_steps>
    <immediate>
      1. Deploy to staging environment for user acceptance testing
      2. Schedule security audit with external team
      3. Prepare production deployment runbook
    </immediate>
    <future>
      1. Plan Phase 2 features based on initial user feedback
      2. Implement automated performance monitoring
      3. Create video tutorials for end users
    </future>
  </next_steps>
</mode_completion>
\`\`\`

## Complete Example: Feature Development Mode

\`\`\`xml
<mode_completion>
  <metadata>
    <mode_name>feature-development</mode_name>
    <start_time>2024-01-15T09:00:00Z</start_time>
    <end_time>2024-01-15T13:37:00Z</end_time>
    <total_duration>4 hours 37 minutes</total_duration>
    <total_waves>4</total_waves>
    <completion_status>SUCCESS</completion_status>
  </metadata>

  <executive_summary>
    <overview>
      Successfully implemented a comprehensive user authentication and authorization system for the Shadow Clone platform. The feature includes OAuth2 integration, role-based access control, multi-factor authentication, and session management. All components were developed, tested, and documented following Shadow Clone best practices.

      The implementation exceeded initial requirements by including advanced security features such as rate limiting, suspicious activity detection, and automated account recovery. The system is now production-ready with 98% test coverage and performance that exceeds baseline requirements by 40%.
    </overview>
    <key_achievements>
      - Delivered complete authentication system 2 days ahead of schedule
      - Achieved 98% test coverage with all edge cases handled
      - Improved login performance by 40% compared to requirements
      - Created comprehensive documentation with API examples
      - Implemented advanced security features beyond initial scope
    </key_achievements>
  </executive_summary>

  <wave_summaries>
    <wave number="0" status="COMPLETE">
      <objectives>Requirements analysis and system design</objectives>
      <outcomes>
        - Analyzed 15 user stories and created detailed acceptance criteria
        - Designed modular architecture supporting future expansion
        - Identified and documented 8 integration points
      </outcomes>
      <deliverables>
        - .waves/wave_0/requirements_analysis.md - Complete feature requirements
        - .waves/wave_0/system_design.md - Architecture with component diagrams
        - .waves/wave_0/integration_plan.md - Third-party service integration strategy
      </deliverables>
      <agents_deployed>3</agents_deployed>
      <duration>45 minutes</duration>
    </wave>
    
    <wave number="1" status="COMPLETE">
      <objectives>Core authentication implementation</objectives>
      <outcomes>
        - Implemented OAuth2 flow with Google, GitHub, and Microsoft
        - Created secure session management with Redis backing
        - Built user registration with email verification
      </outcomes>
      <deliverables>
        - src/auth/oauth2.js - OAuth2 implementation with provider abstraction
        - src/auth/sessions.js - Session management with automatic renewal
        - src/auth/registration.js - User registration and verification logic
        - tests/auth/*.test.js - Comprehensive test suite (95% coverage)
      </deliverables>
      <agents_deployed>4</agents_deployed>
      <duration>90 minutes</duration>
    </wave>
    
    <wave number="2" status="COMPLETE">
      <objectives>Security enhancements and RBAC implementation</objectives>
      <outcomes>
        - Implemented role-based access control with 5 default roles
        - Added multi-factor authentication with TOTP support
        - Created rate limiting and brute force protection
      </outcomes>
      <deliverables>
        - src/auth/rbac.js - Role-based access control engine
        - src/auth/mfa.js - Multi-factor authentication implementation
        - src/security/rateLimit.js - Intelligent rate limiting with Redis
        - config/security.json - Security configuration and policies
      </deliverables>
      <agents_deployed>3</agents_deployed>
      <duration>75 minutes</duration>
    </wave>
    
    <wave number="3" status="COMPLETE">
      <objectives>Testing, documentation, and optimization</objectives>
      <outcomes>
        - Achieved 98% test coverage with integration and unit tests
        - Optimized authentication flow reducing latency by 40%
        - Created comprehensive API documentation with examples
      </outcomes>
      <deliverables>
        - .waves/wave_3/test_report.md - Complete testing results and coverage
        - .waves/wave_3/performance_analysis.md - Performance optimization results
        - docs/api/authentication.md - API documentation with curl examples
        - docs/user-guide/authentication.md - End-user documentation
      </deliverables>
      <agents_deployed>2</agents_deployed>
      <duration>47 minutes</duration>
    </wave>
  </wave_summaries>

  <deliverables_inventory>
    <documents>
      <document type="specification" path=".waves/wave_0/requirements_analysis.md">
        Complete feature requirements with 15 user stories, acceptance criteria, and edge cases
      </document>
      <document type="architecture" path=".waves/wave_0/system_design.md">
        System architecture design with component diagrams, data flow, and security boundaries
      </document>
      <document type="api-docs" path="docs/api/authentication.md">
        RESTful API documentation with request/response examples for all 12 endpoints
      </document>
      <document type="user-guide" path="docs/user-guide/authentication.md">
        End-user guide with screenshots and troubleshooting section
      </document>
    </documents>
    
    <code_artifacts>
      <artifact type="implementation" path="src/auth/oauth2.js">
        OAuth2 implementation supporting Google, GitHub, and Microsoft providers
      </artifact>
      <artifact type="implementation" path="src/auth/sessions.js">
        Session management with Redis backing and automatic renewal
      </artifact>
      <artifact type="implementation" path="src/auth/rbac.js">
        Role-based access control with dynamic permission evaluation
      </artifact>
      <artifact type="configuration" path="config/security.json">
        Security configuration including rate limits, session timeouts, and password policies
      </artifact>
      <artifact type="tests" path="tests/auth/">
        Comprehensive test suite with 98% coverage including edge cases
      </artifact>
    </code_artifacts>
    
    <quality_reports>
      <report type="testing" path=".waves/wave_3/test_report.md">
        Test execution report: 247 tests, 98% coverage, 0 failures
      </report>
      <report type="performance" path=".waves/wave_3/performance_analysis.md">
        Performance analysis: 40% faster than baseline, 150ms average login time
      </report>
      <report type="security" path=".waves/wave_2/security_audit.md">
        Security audit results: All OWASP Top 10 vulnerabilities addressed
      </report>
    </quality_reports>
  </deliverables_inventory>

  <metrics_and_achievements>
    <quantitative_metrics>
      <metric name="Total Agents Deployed" value="12" />
      <metric name="Files Created" value="23" />
      <metric name="Files Modified" value="8" />
      <metric name="Test Coverage Achieved" value="98%" />
      <metric name="Performance Improvement" value="40%" />
      <metric name="API Endpoints Created" value="12" />
      <metric name="Documentation Pages" value="4" />
      <metric name="Security Vulnerabilities" value="0" />
      <metric name="Code Quality Score" value="A+" />
    </quantitative_metrics>
    
    <qualitative_achievements>
      - Implemented production-ready authentication exceeding security requirements
      - Created modular, reusable components for future features
      - Established comprehensive testing patterns for the project
      - Delivered clear, example-rich documentation for all stakeholders
      - Proactively addressed scalability concerns supporting 10K concurrent users
    </qualitative_achievements>
  </metrics_and_achievements>

  <key_decisions>
    <decision number="1">
      <description>Selected Redis for session storage over in-memory solution</description>
      <rationale>Enables horizontal scaling and session persistence across server restarts</rationale>
      <impact>System can now scale to multiple servers without session loss</impact>
    </decision>
    <decision number="2">
      <description>Implemented TOTP-based MFA instead of SMS</description>
      <rationale>More secure, cost-effective, and works offline</rationale>
      <impact>Saved \$5K/month in SMS costs while improving security</impact>
    </decision>
    <decision number="3">
      <description>Created provider abstraction layer for OAuth2</description>
      <rationale>Simplifies adding new OAuth providers in the future</rationale>
      <impact>New providers can be added in under 30 minutes</impact>
    </decision>
  </key_decisions>

  <lessons_learned>
    <successes>
      - Parallel agent deployment for independent components saved 2 hours
      - Early security design review prevented major architectural changes
      - Comprehensive error handling reduced debugging time by 70%
      - Creating integration tests first improved API design quality
    </successes>
    
    <challenges_overcome>
      <challenge>
        <description>Complex OAuth2 state management across providers</description>
        <resolution>Implemented unified state machine reducing code duplication by 60%</resolution>
      </challenge>
      <challenge>
        <description>Performance bottleneck in permission evaluation</description>
        <resolution>Added intelligent caching reducing evaluation time from 50ms to 2ms</resolution>
      </challenge>
      <challenge>
        <description>Test data management for integration tests</description>
        <resolution>Created test fixtures and factory patterns for consistent test data</resolution>
      </challenge>
    </challenges_overcome>
    
    <recommendations>
      - Adopt the provider abstraction pattern for other third-party integrations
      - Implement automated security scanning in CI/CD pipeline
      - Create shared test utilities package for other features
      - Document rate limiting patterns for API consistency
    </recommendations>
  </lessons_learned>

  <resource_utilization>
    <agent_hours>18.5 total agent hours across 12 agents</agent_hours>
    <wave_directory_size>2.4 MB including all documentation and test data</wave_directory_size>
    <efficiency_rating>EXCELLENT - Completed 40% faster than initial estimate</efficiency_rating>
  </resource_utilization>

  <final_status>
    <status>MODE COMPLETE - SUCCESS</status>
    <summary>
      Authentication feature successfully implemented with all requirements met and exceeded.
      System is production-ready with comprehensive testing (98% coverage), documentation,
      and performance that exceeds baseline by 40%. Zero critical issues, zero security
      vulnerabilities. Ready for immediate deployment to staging environment.
    </summary>
  </final_status>

  <next_steps>
    <immediate>
      1. Deploy to staging environment for UAT (assigned to DevOps team)
      2. Schedule security penetration testing with CyberSec Inc.
      3. Conduct code review with senior engineering team
      4. Create deployment runbook and rollback procedures
    </immediate>
    <future>
      1. Implement biometric authentication for mobile apps (Q2 2024)
      2. Add enterprise SSO support with SAML 2.0 (Q2 2024)
      3. Create admin dashboard for user management (Q3 2024)
      4. Implement advanced fraud detection with ML (Q4 2024)
    </future>
  </next_steps>
</mode_completion>
\`\`\`

## Additional Mode Examples

### Debug Mode Example Summary
\`\`\`xml
<executive_summary>
  <overview>
    Successfully identified and resolved critical memory leak affecting 30% of production users. 
    The issue was traced to improper event listener cleanup in the real-time notification system. 
    Implementation of proper cleanup routines and WeakMap usage reduced memory consumption by 75% 
    and eliminated all reported crashes.
  </overview>
  <key_achievements>
    - Reduced memory usage from 2.1GB to 520MB under load
    - Eliminated 100% of memory-related crashes (was 47/day)
    - Improved application response time by 35%
    - Created automated memory leak detection system
  </key_achievements>
</executive_summary>
\`\`\`

### Architecture Planning Mode Example Summary
\`\`\`xml
<executive_summary>
  <overview>
    Designed comprehensive microservices architecture for Shadow Clone v2.0, supporting 
    100x scale increase. Architecture includes 12 loosely coupled services, event-driven 
    communication, and cloud-native deployment strategy. Design validated through proof-of-concept 
    implementations and load testing simulations.
  </overview>
  <key_achievements>
    - Designed system supporting 1M concurrent users (up from 10K)
    - Reduced deployment time from 4 hours to 15 minutes
    - Achieved 99.99% uptime architecture with automated failover
    - Created migration plan with zero-downtime transition
  </key_achievements>
</executive_summary>
\`\`\`

## Usage Guidelines

1. **Start with Success**: Always frame completions in terms of achievements and positive outcomes
2. **Be Specific**: Use concrete numbers, percentages, and measurable improvements
3. **Show Impact**: Explain how achievements benefit users, performance, or business goals
4. **Document Everything**: Include paths to all deliverables for easy access
5. **Learn and Improve**: Capture lessons that will help future Shadow Clone operations

## Certification

\`\`\`
---
*This MODE COMPLETION SUMMARY certifies that all work in [mode name] mode has been 
completed according to Shadow Clone protocols and quality standards.*

**Certified by**: Record Keeper
**Date**: [ISO 8601 timestamp]
**Shadow Clone Version**: [version]
**Constitution Compliance**: ✓
**Quality Gates Passed**: ✓
\`\`\``;
