#!/bin/bash

# Script to update all references to use the new simplified file structure

echo "Updating Shadow Clone references to simplified structure..."

# Base directory
BASE_DIR="/root/repos/shadow-clone/.shadow-local"

# Coordination Rules Updates
echo "Updating coordination rules references..."

# Update initialization_checklist references
find "$BASE_DIR" -type f -name "*.md" -exec sed -i \
    -e 's|initialization_checklist\.md|core_system_rules.md|g' \
    -e 's|/initialization_checklist"|/core_system_rules"|g' \
    -e 's|"initialization_checklist"|"core_system_rules"|g' {} \;

# Update file_organization_rules references
find "$BASE_DIR" -type f -name "*.md" -exec sed -i \
    -e 's|file_organization_rules\.md|file_and_workspace_rules.md|g' \
    -e 's|/file_organization_rules"|/file_and_workspace_rules"|g' \
    -e 's|"file_organization_rules"|"file_and_workspace_rules"|g' {} \;

# Update wave_coordination references
find "$BASE_DIR" -type f -name "*.md" -exec sed -i \
    -e 's|wave_coordination\.md|wave_execution_protocol.md|g' \
    -e 's|/wave_coordination"|/wave_execution_protocol"|g' \
    -e 's|"wave_coordination"|"wave_execution_protocol"|g' {} \;

# Update system_validation_rules references
find "$BASE_DIR" -type f -name "*.md" -exec sed -i \
    -e 's|system_validation_rules\.md|core_system_rules.md|g' \
    -e 's|/system_validation_rules"|/core_system_rules"|g' {} \;

# Update workspace_structure references
find "$BASE_DIR" -type f -name "*.md" -exec sed -i \
    -e 's|workspace_structure\.md|file_and_workspace_rules.md|g' \
    -e 's|/workspace_structure"|/file_and_workspace_rules"|g' {} \;

# Update quality_gates references
find "$BASE_DIR" -type f -name "*.md" -exec sed -i \
    -e 's|quality_gates\.md|core_system_rules.md|g' \
    -e 's|/quality_gates"|/core_system_rules"|g' {} \;

# Agent Rules Updates
echo "Updating agent rules references..."

# Update core_agent_rules references
find "$BASE_DIR" -type f -name "*.md" -exec sed -i \
    -e 's|core_agent_rules\.md|core_rules.md|g' \
    -e 's|/core_agent_rules"|/core_rules"|g' \
    -e 's|"core_agent_rules"|"core_rules"|g' {} \;

# Update development_agent_rules references
find "$BASE_DIR" -type f -name "*.md" -exec sed -i \
    -e 's|development_agent_rules\.md|technical_rules.md|g' \
    -e 's|/development_agent_rules"|/technical_rules"|g' {} \;

# Update qa_agent_rules references
find "$BASE_DIR" -type f -name "*.md" -exec sed -i \
    -e 's|qa_agent_rules\.md|technical_rules.md|g' \
    -e 's|/qa_agent_rules"|/technical_rules"|g' {} \;

# Update devops_agent_rules references
find "$BASE_DIR" -type f -name "*.md" -exec sed -i \
    -e 's|devops_agent_rules\.md|technical_rules.md|g' \
    -e 's|/devops_agent_rules"|/technical_rules"|g' {} \;

# Update security_agent_rules references
find "$BASE_DIR" -type f -name "*.md" -exec sed -i \
    -e 's|security_agent_rules\.md|technical_rules.md|g' \
    -e 's|/security_agent_rules"|/technical_rules"|g' {} \;

# Update team_lead_rules references
find "$BASE_DIR" -type f -name "*.md" -exec sed -i \
    -e 's|team_lead_rules\.md|leadership_rules.md|g' \
    -e 's|/team_lead_rules"|/leadership_rules"|g' {} \;

# Update record_keeper_agent_rules references
find "$BASE_DIR" -type f -name "*.md" -exec sed -i \
    -e 's|record_keeper_agent_rules\.md|leadership_rules.md|g' \
    -e 's|/record_keeper_agent_rules"|/leadership_rules"|g' {} \;

# Update planning_agent_rules references
find "$BASE_DIR" -type f -name "*.md" -exec sed -i \
    -e 's|planning_agent_rules\.md|analytical_rules.md|g' \
    -e 's|/planning_agent_rules"|/analytical_rules"|g' {} \;

# Update research_agent_rules references
find "$BASE_DIR" -type f -name "*.md" -exec sed -i \
    -e 's|research_agent_rules\.md|analytical_rules.md|g' \
    -e 's|/research_agent_rules"|/analytical_rules"|g' {} \;

# Update audit_agent_rules references
find "$BASE_DIR" -type f -name "*.md" -exec sed -i \
    -e 's|audit_agent_rules\.md|analytical_rules.md|g' \
    -e 's|/audit_agent_rules"|/analytical_rules"|g' {} \;

# Update documentation_agent_rules references
find "$BASE_DIR" -type f -name "*.md" -exec sed -i \
    -e 's|documentation_agent_rules\.md|analytical_rules.md|g' \
    -e 's|/documentation_agent_rules"|/analytical_rules"|g' {} \;

# Template Updates
echo "Updating template references..."

# Update master-project-plan-template references
find "$BASE_DIR" -type f -name "*.md" -exec sed -i \
    -e 's|master-project-plan-template\.md|project-execution-template.md|g' \
    -e 's|/master-project-plan-template"|/project-execution-template"|g' {} \;

# Update wave-execution-plan-template references
find "$BASE_DIR" -type f -name "*.md" -exec sed -i \
    -e 's|wave-execution-plan-template\.md|project-execution-template.md|g' \
    -e 's|/wave-execution-plan-template"|/project-execution-template"|g' {} \;

# Update agent_templates references
find "$BASE_DIR" -type f -name "*.md" -exec sed -i \
    -e 's|agent_templates\.md|team-agent-templates.md|g' \
    -e 's|/agent_templates"|/team-agent-templates"|g' {} \;

# Update team_templates references
find "$BASE_DIR" -type f -name "*.md" -exec sed -i \
    -e 's|team_templates\.md|team-agent-templates.md|g' \
    -e 's|/team_templates"|/team-agent-templates"|g' {} \;

# Update security-audit-report-template references
find "$BASE_DIR" -type f -name "*.md" -exec sed -i \
    -e 's|security-audit-report-template\.md|security-assessment-template.md|g' \
    -e 's|/security-audit-report-template"|/security-assessment-template"|g' {} \;

echo "Reference updates complete!"
echo ""
echo "Summary of changes:"
echo "- Coordination rules: Consolidated to 4 files"
echo "- Agent rules: Consolidated to 6 files"
echo "- Templates: Consolidated to 6 files"
echo ""
echo "Please verify the changes and test all modes."