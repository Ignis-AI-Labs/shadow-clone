#!/bin/bash
# Shadow Clone Mode Test Runner
# Copyright (c) Ignis AI Labs LLC. All rights reserved.

echo "======================================"
echo "Shadow Clone Mode Compliance Testing"
echo "======================================"
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is required to run tests"
    exit 1
fi

# Set test directory
TEST_DIR="$(dirname "$0")"
cd "$TEST_DIR"

# Parse arguments
MODE="all"
REPORT_ONLY=false
STRICT=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --mode)
            MODE="$2"
            shift 2
            ;;
        --report)
            REPORT_ONLY=true
            shift
            ;;
        --strict)
            STRICT=true
            shift
            ;;
        --help)
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --mode <mode>  Test specific mode (audit, debug, feature, etc.)"
            echo "  --report       Generate report only"
            echo "  --strict       Fail on any violation"
            echo "  --help         Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                    # Test all modes"
            echo "  $0 --mode feature     # Test feature mode only"
            echo "  $0 --strict           # Strict mode - fail on violations"
            echo ""
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Run tests
if [ "$MODE" == "all" ]; then
    echo "Testing all Shadow Clone modes..."
    python3 mode_protocol_verifier.py --all
else
    echo "Testing $MODE mode..."
    python3 mode_protocol_verifier.py --mode "$MODE"
fi

# Check test results
EXIT_CODE=$?

# Generate summary report
if [ -f "mode_compliance_report.md" ]; then
    echo ""
    echo "======================================"
    echo "Test Summary"
    echo "======================================"
    
    # Extract summary from report
    PASSED=$(grep -c "Status.*PASSED" mode_compliance_report.md || echo "0")
    WARNINGS=$(grep -c "PASSED_WITH_WARNINGS" mode_compliance_report.md || echo "0")  
    FAILED=$(grep -c "Status.*FAILED" mode_compliance_report.md || echo "0")
    
    echo "Passed: $PASSED"
    echo "Passed with warnings: $WARNINGS"
    echo "Failed: $FAILED"
    
    # In strict mode, fail if any violations
    if [ "$STRICT" == "true" ] && [ "$FAILED" -gt 0 ]; then
        echo ""
        echo "ERROR: Strict mode enabled and violations found!"
        exit 1
    fi
    
    echo ""
    echo "Full report: mode_compliance_report.md"
fi

# Create test summary for CI/CD
cat > test_summary.json <<EOF
{
    "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "mode_tested": "$MODE",
    "passed": $PASSED,
    "warnings": $WARNINGS,
    "failed": $FAILED,
    "strict_mode": $STRICT,
    "exit_code": $EXIT_CODE
}
EOF

echo ""
echo "Test summary saved to: test_summary.json"

# Exit with appropriate code
if [ "$FAILED" -gt 0 ]; then
    exit 1
else
    exit 0
fi