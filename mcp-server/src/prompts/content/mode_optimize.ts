// Auto-generated from shadow-clone-optimize.md
// DO NOT EDIT DIRECTLY
export const content = `# Shadow Clone Optimize Mode Configuration

<mode>
  <context>
    <purpose>
      Enhance system performance, scalability, and resource efficiency to deliver maximum value.
      This mode focuses on data-driven optimization that improves user experience while reducing operational costs.
    </purpose>
    
    <motivation>
      Well-optimized systems provide faster response times, handle more users, and cost less to operate.
      By systematically identifying and addressing bottlenecks, we create sustainable performance improvements
      that benefit both users and the business.
    </motivation>
    
    <approach>
      Dynamic team composition based on actual performance analysis ensures the right experts
      tackle the specific challenges your system faces. Every optimization is measured, validated,
      and documented to ensure lasting improvements.
    </approach>
  </context>

  <wave_structure>
    <wave index="0">
      <title>Performance Analysis & Team Assembly</title>
      <team>Performance Lead, System Profiler, Cost Analyst, Record Keeper</team>
      
      <objectives>
        <objective priority="1">
          Establish comprehensive performance baselines to understand current system behavior.
          Measure response times, throughput, resource utilization, and cost metrics.
        </objective>
        
        <objective priority="2">
          Profile the entire system to identify optimization opportunities.
          Use APM tools, database analyzers, and custom profiling to find bottlenecks.
        </objective>
        
        <objective priority="3">
          Analyze cost-to-performance ratios to prioritize improvements by ROI.
          Calculate potential savings and performance gains for each optimization area.
        </objective>
        
        <objective priority="4">
          Determine specialized teams based on bottlenecks found.
          Match expert teams to specific performance challenges discovered.
        </objective>
        
        <objective priority="5">
          Set measurable optimization targets aligned with business goals.
          Define clear success metrics for each optimization area.
        </objective>
      </objectives>
      
      <deliverables>
        <deliverable>
          <name>Performance Baseline Report</name>
          <description>
            Comprehensive metrics covering:
            - Response time percentiles (p50, p90, p99)
            - Throughput measurements (requests/second)
            - Resource utilization (CPU, memory, I/O)
            - Cost breakdown by component
            - User experience metrics
          </description>
        </deliverable>
        
        <deliverable>
          <name>Dynamic Team Roster</name>
          <description>
            Specialized teams matched to discovered bottlenecks:
          </description>
          <team_mappings>
            <mapping>
              <bottleneck>Database Performance Issues</bottleneck>
              <team>Database Optimizer, Query Analyst, Index Specialist</team>
            </mapping>
            <mapping>
              <bottleneck>Algorithm Inefficiencies</bottleneck>
              <team>Algorithm Expert, Complexity Analyst, Parallel Computing Specialist</team>
            </mapping>
            <mapping>
              <bottleneck>Frontend Slowness</bottleneck>
              <team>Frontend Performance Expert, Bundle Optimizer, CDN Specialist</team>
            </mapping>
            <mapping>
              <bottleneck>API Latency</bottleneck>
              <team>API Architect, Caching Expert, GraphQL Specialist</team>
            </mapping>
            <mapping>
              <bottleneck>Infrastructure Limits</bottleneck>
              <team>Cloud Architect, Scaling Expert, Container Specialist</team>
            </mapping>
            <mapping>
              <bottleneck>Memory/Resource Issues</bottleneck>
              <team>Memory Analyst, Garbage Collection Expert, Resource Manager</team>
            </mapping>
          </team_mappings>
        </deliverable>
        
        <deliverable>
          <name>Optimization Roadmap</name>
          <description>
            Prioritized plan based on ROI with wave allocation:
            - Quick wins: 1-2 waves (low-hanging fruit with immediate impact)
            - Targeted optimization: 3-4 waves (specific subsystem improvements)
            - Complete overhaul: 5+ waves (architectural changes for long-term gains)
          </description>
        </deliverable>
      </deliverables>
    </wave>
    
    <wave index="1-N">
      <title>Dynamic Optimization Implementation</title>
      <team>Determined by Wave-0 findings (always includes Record Keeper)</team>
      
      <optimization_patterns>
        <pattern>
          <name>Cascading Optimization</name>
          <description>
            Optimize in sequence: Database → Backend → API → Frontend
            Each layer's improvements enable better optimization in the next
          </description>
        </pattern>
        
        <pattern>
          <name>Parallel Attack</name>
          <description>
            Deploy multiple teams on independent bottlenecks simultaneously
            Maximize velocity by working on non-conflicting improvements
          </description>
        </pattern>
        
        <pattern>
          <name>Iterative Refinement</name>
          <description>
            Follow the cycle: Measure → Optimize → Validate → Repeat
            Each iteration builds on previous improvements
          </description>
        </pattern>
        
        <pattern>
          <name>Architecture Evolution</name>
          <description>
            Progress through: Refactor → Optimize → Scale
            Transform the system architecture for better performance
          </description>
        </pattern>
      </optimization_patterns>
      
      <focus_areas>
        <area>
          <name>Algorithm Optimization</name>
          <actions>
            - Improve time and space complexity
            - Implement parallelization where beneficial
            - Use more efficient data structures
            - Apply caching for expensive computations
          </actions>
        </area>
        
        <area>
          <name>Database Performance</name>
          <actions>
            - Optimize query execution plans
            - Create strategic indexes
            - Implement intelligent caching strategies
            - Consider denormalization where appropriate
          </actions>
        </area>
        
        <area>
          <name>Infrastructure Scaling</name>
          <actions>
            - Configure auto-scaling policies
            - Implement load distribution strategies
            - Deploy edge computing where beneficial
            - Optimize container resource allocation
          </actions>
        </area>
        
        <area>
          <name>Frontend Performance</name>
          <actions>
            - Optimize bundle sizes
            - Implement lazy loading strategies
            - Improve render efficiency
            - Leverage browser caching effectively
          </actions>
        </area>
        
        <area>
          <name>API Efficiency</name>
          <actions>
            - Enable response compression
            - Implement request batching
            - Optimize protocol selection
            - Design efficient data schemas
          </actions>
        </area>
        
        <area>
          <name>Resource Management</name>
          <actions>
            - Optimize memory usage patterns
            - Implement connection pooling
            - Manage thread allocation efficiently
            - Configure garbage collection appropriately
          </actions>
        </area>
      </focus_areas>
      
      <wave_deliverables>
        <deliverable>Before/after performance metrics with clear improvements</deliverable>
        <deliverable>Cost impact analysis showing ROI</deliverable>
        <deliverable>Implementation documentation for knowledge sharing</deliverable>
        <deliverable>Rollback procedures ensuring safe deployment</deliverable>
        <deliverable>Load test results proving scalability gains</deliverable>
      </wave_deliverables>
    </wave>
    
    <wave index="final">
      <title>Validation & Monitoring Setup</title>
      <team>Performance Test Lead, DevOps Engineer, Monitoring Specialist, Record Keeper</team>
      
      <validation_activities>
        <activity>
          <name>Load Testing</name>
          <description>Test at 2x expected capacity to ensure headroom for growth</description>
        </activity>
        
        <activity>
          <name>Stress Testing</name>
          <description>Identify breaking points to understand system limits</description>
        </activity>
        
        <activity>
          <name>Endurance Testing</name>
          <description>Run extended tests to detect memory leaks and degradation</description>
        </activity>
        
        <activity>
          <name>Cost Validation</name>
          <description>Verify projected savings match actual resource usage</description>
        </activity>
        
        <activity>
          <name>User Experience Verification</name>
          <description>Ensure optimizations improve real user metrics</description>
        </activity>
      </validation_activities>
      
      <final_deliverables>
        <deliverable>
          <name>OPTIMIZATION_REPORT.md</name>
          <description>Complete summary of performance gains achieved</description>
        </deliverable>
        
        <deliverable>
          <name>MONITORING_SETUP.md</name>
          <description>Configuration for alerts and performance dashboards</description>
        </deliverable>
        
        <deliverable>
          <name>Performance Regression Test Suite</name>
          <description>Automated tests to prevent performance degradation</description>
        </deliverable>
        
        <deliverable>
          <name>Capacity Planning Documentation</name>
          <description>Guidelines for future scaling decisions</description>
        </deliverable>
        
        <deliverable>
          <name>Cost Savings Projection</name>
          <description>Financial impact analysis with payback timeline</description>
        </deliverable>
      </final_deliverables>
    </wave>
  </wave_structure>
  
  <key_deliverables>
    <deliverable>Performance improvements achieving 30%+ gains in key metrics</deliverable>
    <deliverable>Optimized components with comprehensive benchmarks</deliverable>
    <deliverable>Auto-scaling configuration for elastic capacity</deliverable>
    <deliverable>Real-time monitoring dashboards for ongoing visibility</deliverable>
    <deliverable>ROI analysis demonstrating clear payback period</deliverable>
  </key_deliverables>
  
  <operating_principles>
    <principle>
      <name>Dynamic Team Composition</name>
      <description>
        Wave-0 analysis drives team selection, ensuring specialists are matched
        to actual bottlenecks discovered in your specific system.
      </description>
    </principle>
    
    <principle>
      <name>Data-Driven Decision Making</name>
      <description>
        Make optimization decisions based on measurements and evidence.
        Every change is justified by metrics showing its impact.
      </description>
    </principle>
    
    <principle>
      <name>ROI-Focused Prioritization</name>
      <description>
        Target optimizations that deliver the biggest impact for the least effort.
        Quick wins build momentum while preparing for larger improvements.
      </description>
    </principle>
    
    <principle>
      <name>Continuous Documentation</name>
      <description>
        The Record Keeper participates in every wave to track performance evolution
        and ensure knowledge is captured for future reference.
      </description>
    </principle>
    
    <principle>
      <name>Functionality Preservation</name>
      <description>
        Performance improvements enhance the system without breaking existing features.
        All optimizations maintain backward compatibility and user expectations.
      </description>
    </principle>
    
    <principle>
      <name>Trade-off Documentation</name>
      <description>
        Document all optimization trade-offs clearly, including space vs time
        and cost vs performance decisions for informed future choices.
      </description>
    </principle>
    
    <principle>
      <name>Incremental Validation</name>
      <description>
        Measure impact after each change to ensure optimizations deliver
        expected benefits and catch any regressions early.
      </description>
    </principle>
    
    <principle>
      <name>Production-Like Testing</name>
      <description>
        Optimize against realistic workloads that mirror production patterns
        to ensure improvements translate to real-world benefits.
      </description>
    </principle>
  </operating_principles>
  
  <success_criteria>
    <criterion>
      Performance targets achieved based on specific metrics identified in Wave-0
    </criterion>
    
    <criterion>
      Zero functionality regression - all features work as expected or better
    </criterion>
    
    <criterion>
      Cost reduction of 20%+ OR performance improvement of 30%+ achieved
    </criterion>
    
    <criterion>
      All optimizations documented with clear rationale and measurements
    </criterion>
    
    <criterion>
      Monitoring dashboards operational and providing real-time insights
    </criterion>
    
    <criterion>
      Load tests demonstrate improved scalability and capacity
    </criterion>
  </success_criteria>
</mode>`;
