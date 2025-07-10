# Optimize Mode

## Purpose
Improve system performance, scalability, and resource efficiency without compromising functionality.

## Wave Structure

### Wave-0: Performance Analysis & Team Assembly
**Team**: Performance Lead, System Profiler, Cost Analyst, Record Keeper

**Critical Tasks**:
- Establish comprehensive performance baselines
- Profile system to identify optimization opportunities
- Analyze cost-to-performance ratios
- **Determine specialized teams based on bottlenecks found**
- Set measurable optimization targets

**Outputs**:
- Performance baseline report with metrics
- **Dynamic team roster** for optimization waves:
  - Database bottlenecks: Database Optimizer, Query Analyst, Index Specialist
  - Algorithm inefficiencies: Algorithm Expert, Complexity Analyst, Parallel Computing Specialist
  - Frontend slowness: Frontend Performance Expert, Bundle Optimizer, CDN Specialist
  - API latency: API Architect, Caching Expert, GraphQL Specialist
  - Infrastructure limits: Cloud Architect, Scaling Expert, Container Specialist
  - Memory/Resource issues: Memory Analyst, Garbage Collection Expert, Resource Manager
- Prioritized optimization roadmap by ROI
- Wave allocation:
  - Quick wins: 1-2 waves (low-hanging fruit)
  - Targeted optimization: 3-4 waves (specific subsystems)
  - Complete overhaul: 5+ waves (architectural changes)

### Wave-1 to Wave-N: Dynamic Optimization
**Team Structure**: Determined by Wave-0 findings (always includes Record Keeper)

**Optimization Patterns**:
1. **Cascading Optimization**: Database → Backend → API → Frontend
2. **Parallel Attack**: Multiple teams on independent bottlenecks
3. **Iterative Refinement**: Measure → Optimize → Validate → Repeat
4. **Architecture Evolution**: Refactor → Optimize → Scale

**Focus Areas** (based on Wave-0 analysis):
- **Algorithm Optimization**: Time/space complexity, parallelization
- **Database Performance**: Query plans, indexing, caching strategies
- **Infrastructure Scaling**: Auto-scaling, load distribution, edge computing
- **Frontend Performance**: Bundle optimization, lazy loading, render efficiency
- **API Efficiency**: Response compression, batching, protocol optimization
- **Resource Management**: Memory optimization, connection pooling, thread management

**Required Outputs per Wave**:
- Before/after performance metrics
- Cost impact analysis
- Implementation documentation
- Rollback procedures
- Load test results

### Final Wave: Validation & Monitoring Setup
**Team**: Performance Test Lead, DevOps Engineer, Monitoring Specialist, Record Keeper

**Comprehensive Validation**:
- Load testing at 2x expected capacity
- Stress testing to find breaking points
- Endurance testing for memory leaks
- Cost projection validation
- User experience verification

**Outputs**:
- `OPTIMIZATION_REPORT.md` - Complete performance gains summary
- `MONITORING_SETUP.md` - Alerts and dashboards configuration
- Performance regression test suite
- Capacity planning documentation
- Cost savings projection

## Key Deliverables
- Performance improvement metrics (target: 30%+ improvement)
- Optimized components with benchmarks
- Auto-scaling configuration
- Real-time monitoring dashboards
- ROI analysis with payback period

## Mode-Specific Rules
- **Wave-0 drives team composition** - specialists matched to actual bottlenecks
- **Data-driven decisions only** - no optimization without measurements
- **ROI-focused prioritization** - biggest impact for least effort first
- **Record Keeper in every wave** - tracks performance evolution
- **Preserve functionality** - performance can't break features
- **Document trade-offs** - space vs time, cost vs performance
- **Incremental validation** - measure impact after each change
- **Real-world testing** - optimize against production-like loads

## Success Criteria
- Performance targets achieved (specific metrics from Wave-0)
- Zero functionality regression
- Cost reduction of 20%+ OR performance gain of 30%+
- All optimizations documented with rationale
- Monitoring dashboards operational
- Load tests prove scalability improvements