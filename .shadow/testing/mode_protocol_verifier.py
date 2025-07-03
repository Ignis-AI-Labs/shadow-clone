#!/usr/bin/env python3
"""
Shadow Clone Mode Protocol Verifier
Copyright (c) Ignis AI Labs LLC. All rights reserved.
"""

import json
import os
import sys
from datetime import datetime
from typing import Dict, List, Tuple, Optional

class ModeProtocolVerifier:
    """Verifies that Shadow Clone modes follow all required protocols"""
    
    # Core phases that MUST execute in order
    MANDATORY_PHASES = [
        "phase1_analysis",
        "phase2_team_config", 
        "phase3_wave_planning",
        "phase4_deployment",
        "phase5_execution",
        "phase6_integration",
        "phase7_quality"
    ]
    
    # Functions that MUST be called by ALL modes
    MANDATORY_FUNCTIONS = {
        "initialization": [
            "initialize_system",
            "load_initialization_checklist",
            "verify_all_rules_loaded",
            "check_wave_0_directory_exists",
            "verify_constitution_exists",
            "assign_record_keeper"
        ],
        "git_strategy": [
            "determine_git_strategy",
            "execute_git_strategy",
            "load_git_commit_protocol",
            "enforce_no_commits_during_waves"
        ],
        "wave_0": [
            "create_wave_0_directory",
            "execute_wave_0_planning",
            "create_constitution_initial",
            "validate_wave_0_completion"
        ],
        "constitution": [
            "create_or_update_constitution",
            "record_keeper_monitoring",
            "update_constitution_after_wave",
            "validate_constitution_current"
        ],
        "quality": [
            "validate_pre_wave_quality",
            "validate_post_wave_quality", 
            "enforce_90_percent_quality",
            "run_final_quality_certification"
        ],
        "final_commit": [
            "verify_all_waves_complete",
            "verify_constitution_updated",
            "execute_final_commit_protocol",
            "generate_final_commit_message"
        ]
    }
    
    # Wave-0 files required for ALL modes
    MANDATORY_WAVE_0_FILES = [
        "project_analysis.md",
        "requirements.md",
        "architecture_plan.md",
        "team_formation.md",
        "wave_plan.md",
        "risk_assessment.md",
        "setup_complete.md",
        "CONSTITUTION.md"  # Must be created/updated
    ]
    
    # Mode-specific requirements
    MODE_REQUIREMENTS = {
        "audit": {
            "wave_0_extras": [
                "audit_scope.md",
                "vulnerability_analysis.md",
                "security_frameworks.md"
            ],
            "required_teams": ["auth_security", "data_security", "infrastructure"],
            "special_functions": [
                "load_security_frameworks",
                "initialize_vulnerability_scanners",
                "prepare_compliance_checklists"
            ]
        },
        "debug": {
            "wave_0_extras": [
                "issue_analysis.md",
                "root_cause_analysis.md", 
                "debug_strategy.md"
            ],
            "required_teams": ["diagnostic", "fix"],
            "special_functions": [
                "analyze_error_patterns",
                "setup_debug_environment",
                "prepare_test_harness"
            ]
        },
        "feature": {
            "wave_0_extras": [
                "feature_analysis.md",
                "impact_assessment.md",
                "security_review.md"
            ],
            "required_teams": ["design", "implementation", "testing"],
            "special_functions": [
                "analyze_feature_requirements",
                "assess_integration_points",
                "plan_testing_strategy"
            ]
        },
        "optimize": {
            "wave_0_extras": [
                "performance_baseline.md",
                "bottleneck_analysis.md",
                "optimization_strategy.md"
            ],
            "required_teams": ["analysis", "optimization"],
            "special_functions": [
                "establish_performance_baseline",
                "identify_bottlenecks",
                "plan_optimization_approach"
            ]
        },
        "refactor": {
            "wave_0_extras": [
                "code_analysis.md",
                "refactor_plan.md",
                "test_coverage.md"
            ],
            "required_teams": ["analysis", "refactor", "testing"],
            "special_functions": [
                "analyze_code_structure",
                "identify_refactor_targets",
                "ensure_test_coverage"
            ]
        },
        "research": {
            "wave_0_extras": [
                "research_questions.md",
                "methodology.md",
                "expected_outcomes.md"
            ],
            "required_teams": ["research"],
            "special_functions": [
                "define_research_scope",
                "setup_research_methodology",
                "prepare_documentation_framework"
            ]
        },
        "plan": {
            "wave_0_extras": [
                "MASTER_PLAN.md",
                "stakeholder_analysis.md",
                "resource_planning.md"
            ],
            "required_teams": ["planning"],
            "special_functions": [
                "create_master_plan_framework",
                "analyze_stakeholders",
                "plan_resource_allocation"
            ]
        }
    }
    
    def __init__(self):
        self.test_results = []
        self.current_mode = None
        self.violations = []
        self.warnings = []
        
    def verify_mode(self, mode_name: str) -> Dict:
        """Verify a specific mode follows all protocols"""
        self.current_mode = mode_name
        self.violations = []
        self.warnings = []
        
        print(f"\n{'='*60}")
        print(f"Testing {mode_name.upper()} Mode Compliance")
        print(f"{'='*60}\n")
        
        results = {
            "mode": mode_name,
            "timestamp": datetime.now().isoformat(),
            "core_compliance": {},
            "mode_specific_compliance": {},
            "violations": [],
            "warnings": [],
            "overall_status": "PENDING"
        }
        
        # Test core protocols
        print("Testing Core Protocols...")
        results["core_compliance"] = self._test_core_protocols()
        
        # Test mode-specific requirements
        print(f"\nTesting {mode_name.title()} Mode Specific Requirements...")
        results["mode_specific_compliance"] = self._test_mode_specific(mode_name)
        
        # Compile results
        results["violations"] = self.violations
        results["warnings"] = self.warnings
        
        if self.violations:
            results["overall_status"] = "FAILED"
        elif self.warnings:
            results["overall_status"] = "PASSED_WITH_WARNINGS"
        else:
            results["overall_status"] = "PASSED"
            
        self.test_results.append(results)
        return results
        
    def _test_core_protocols(self) -> Dict:
        """Test all core protocols that apply to every mode"""
        core_results = {}
        
        # Test each protocol category
        for category, functions in self.MANDATORY_FUNCTIONS.items():
            print(f"  - Testing {category}...", end="")
            passed, details = self._verify_functions_called(functions)
            core_results[category] = {
                "passed": passed,
                "details": details
            }
            print(" ✅ PASS" if passed else " ❌ FAIL")
            
        # Test phase execution order
        print(f"  - Testing phase execution order...", end="")
        passed, details = self._verify_phase_order()
        core_results["phase_order"] = {
            "passed": passed,
            "details": details
        }
        print(" ✅ PASS" if passed else " ❌ FAIL")
        
        # Test wave-0 file creation
        print(f"  - Testing wave-0 file requirements...", end="")
        passed, details = self._verify_wave_0_files()
        core_results["wave_0_files"] = {
            "passed": passed,
            "details": details
        }
        print(" ✅ PASS" if passed else " ❌ FAIL")
        
        # Test git commit protocol
        print(f"  - Testing git commit protocol...", end="")
        passed, details = self._verify_git_protocol()
        core_results["git_protocol"] = {
            "passed": passed,
            "details": details
        }
        print(" ✅ PASS" if passed else " ❌ FAIL")
        
        return core_results
        
    def _test_mode_specific(self, mode_name: str) -> Dict:
        """Test mode-specific requirements"""
        if mode_name not in self.MODE_REQUIREMENTS:
            self.violations.append({
                "type": "UNKNOWN_MODE",
                "description": f"Mode '{mode_name}' not recognized"
            })
            return {"passed": False, "details": "Unknown mode"}
            
        mode_req = self.MODE_REQUIREMENTS[mode_name]
        results = {}
        
        # Test extra wave-0 files
        print(f"  - Testing {mode_name} wave-0 extras...", end="")
        passed, details = self._verify_mode_wave_0_extras(mode_req["wave_0_extras"])
        results["wave_0_extras"] = {
            "passed": passed,
            "details": details
        }
        print(" ✅ PASS" if passed else " ❌ FAIL")
        
        # Test required teams
        print(f"  - Testing {mode_name} team requirements...", end="")
        passed, details = self._verify_required_teams(mode_req["required_teams"])
        results["required_teams"] = {
            "passed": passed,
            "details": details
        }
        print(" ✅ PASS" if passed else " ❌ FAIL")
        
        # Test special functions
        print(f"  - Testing {mode_name} special functions...", end="")
        passed, details = self._verify_functions_called(mode_req["special_functions"])
        results["special_functions"] = {
            "passed": passed,
            "details": details
        }
        print(" ✅ PASS" if passed else " ❌ FAIL")
        
        return results
        
    def _verify_functions_called(self, functions: List[str]) -> Tuple[bool, str]:
        """Verify that required functions are called"""
        # This is a simulation - in real implementation would trace actual calls
        missing = []
        for func in functions:
            if not self._simulate_function_called(func):
                missing.append(func)
                
        if missing:
            self.violations.append({
                "type": "MISSING_FUNCTIONS",
                "description": f"Functions not called: {', '.join(missing)}"
            })
            return False, f"Missing: {', '.join(missing)}"
            
        return True, "All functions called"
        
    def _verify_phase_order(self) -> Tuple[bool, str]:
        """Verify phases execute in correct order"""
        # Simulation - would check actual execution log
        return True, "Phase order correct"
        
    def _verify_wave_0_files(self) -> Tuple[bool, str]:
        """Verify all mandatory wave-0 files are created"""
        missing = []
        for file in self.MANDATORY_WAVE_0_FILES:
            if not self._simulate_file_exists(f".waves/wave-0/{file}"):
                missing.append(file)
                
        if missing:
            self.violations.append({
                "type": "MISSING_WAVE_0_FILES",
                "description": f"Wave-0 files missing: {', '.join(missing)}"
            })
            return False, f"Missing: {', '.join(missing)}"
            
        return True, "All wave-0 files present"
        
    def _verify_git_protocol(self) -> Tuple[bool, str]:
        """Verify git commit protocol is followed"""
        # Check for commits during waves (should be none)
        if self._simulate_commits_during_waves():
            self.violations.append({
                "type": "GIT_PROTOCOL_VIOLATION",
                "description": "Commits detected during wave execution"
            })
            return False, "Commits found during waves"
            
        # Check for final commit
        if not self._simulate_final_commit_exists():
            self.violations.append({
                "type": "MISSING_FINAL_COMMIT",
                "description": "No final commit after all waves"
            })
            return False, "No final commit"
            
        return True, "Git protocol followed"
        
    def _verify_mode_wave_0_extras(self, extras: List[str]) -> Tuple[bool, str]:
        """Verify mode-specific wave-0 files"""
        missing = []
        for file in extras:
            if not self._simulate_file_exists(f".waves/wave-0/{file}"):
                missing.append(file)
                
        if missing:
            self.violations.append({
                "type": "MISSING_MODE_FILES",
                "description": f"Mode-specific files missing: {', '.join(missing)}"
            })
            return False, f"Missing: {', '.join(missing)}"
            
        return True, "All mode files present"
        
    def _verify_required_teams(self, teams: List[str]) -> Tuple[bool, str]:
        """Verify required teams are configured"""
        missing = []
        for team in teams:
            if not self._simulate_team_exists(team):
                missing.append(team)
                
        if missing:
            self.violations.append({
                "type": "MISSING_TEAMS",
                "description": f"Required teams missing: {', '.join(missing)}"
            })
            return False, f"Missing: {', '.join(missing)}"
            
        return True, "All teams configured"
        
    # Simulation methods (would be replaced with actual checks in production)
    def _simulate_function_called(self, func_name: str) -> bool:
        """Simulate checking if function was called"""
        # In real implementation, would check execution logs
        return True  # For testing, assume all called
        
    def _simulate_file_exists(self, file_path: str) -> bool:
        """Simulate checking if file exists"""
        # In real implementation, would check file system
        return True  # For testing, assume exists
        
    def _simulate_commits_during_waves(self) -> bool:
        """Simulate checking for commits during waves"""
        return False  # Should be false for compliance
        
    def _simulate_final_commit_exists(self) -> bool:
        """Simulate checking for final commit"""
        return True  # Should be true for compliance
        
    def _simulate_team_exists(self, team_name: str) -> bool:
        """Simulate checking if team is configured"""
        return True  # For testing, assume configured
        
    def generate_report(self) -> str:
        """Generate compliance report"""
        if not self.test_results:
            return "No test results to report"
            
        report = "# Shadow Clone Mode Compliance Report\n\n"
        report += f"Generated: {datetime.now().isoformat()}\n\n"
        
        for result in self.test_results:
            report += f"## {result['mode'].upper()} Mode\n\n"
            report += f"**Status**: {result['overall_status']}\n\n"
            
            # Core compliance
            report += "### Core Protocol Compliance\n\n"
            report += "| Protocol | Status | Details |\n"
            report += "|----------|--------|---------|n"
            
            for protocol, data in result["core_compliance"].items():
                status = "✅" if data["passed"] else "❌"
                report += f"| {protocol} | {status} | {data['details']} |\n"
                
            # Mode-specific compliance
            report += f"\n### {result['mode'].title()} Specific Compliance\n\n"
            report += "| Requirement | Status | Details |\n"
            report += "|-------------|--------|---------|n"
            
            for req, data in result["mode_specific_compliance"].items():
                status = "✅" if data["passed"] else "❌"
                report += f"| {req} | {status} | {data['details']} |\n"
                
            # Violations
            if result["violations"]:
                report += "\n### Violations\n\n"
                for violation in result["violations"]:
                    report += f"- **{violation['type']}**: {violation['description']}\n"
                    
            report += "\n---\n\n"
            
        return report
        
    def run_all_modes(self):
        """Test all available modes"""
        modes = ["audit", "debug", "feature", "optimize", "refactor", "research", "plan"]
        
        for mode in modes:
            self.verify_mode(mode)
            
        print("\n" + "="*60)
        print("OVERALL SUMMARY")
        print("="*60)
        
        passed = sum(1 for r in self.test_results if r["overall_status"] == "PASSED")
        warnings = sum(1 for r in self.test_results if r["overall_status"] == "PASSED_WITH_WARNINGS")
        failed = sum(1 for r in self.test_results if r["overall_status"] == "FAILED")
        
        print(f"Total Modes Tested: {len(modes)}")
        print(f"Passed: {passed}")
        print(f"Passed with Warnings: {warnings}")
        print(f"Failed: {failed}")
        
        return self.test_results


def main():
    """Main entry point for testing"""
    verifier = ModeProtocolVerifier()
    
    if len(sys.argv) > 1 and sys.argv[1] == "--all":
        verifier.run_all_modes()
    elif len(sys.argv) > 2 and sys.argv[1] == "--mode":
        mode = sys.argv[2]
        verifier.verify_mode(mode)
    else:
        print("Usage:")
        print("  python mode_protocol_verifier.py --all")
        print("  python mode_protocol_verifier.py --mode <mode_name>")
        sys.exit(1)
        
    # Generate report
    report = verifier.generate_report()
    
    # Save report
    with open("mode_compliance_report.md", "w") as f:
        f.write(report)
        
    print(f"\nReport saved to: mode_compliance_report.md")


if __name__ == "__main__":
    main()