#!/bin/bash

# Shadow Clone Prompt Synchronization Script
# Converts markdown files from .shadow/ to TypeScript modules for Cloudflare Worker

set -e

echo "🔄 Shadow Clone Prompt Sync Script"
echo "================================="

# Base directories
SHADOW_DIR="../.shadow"
PROMPTS_DIR="src/prompts"

# Function to escape backticks in content
escape_content() {
    # Escape backticks and dollar signs for template literals
    sed 's/`/\\`/g; s/\$/\\$/g'
}

# Function to create TypeScript file from markdown
create_ts_file() {
    local md_file="$1"
    local ts_file="$2"
    local export_name="$3"
    
    echo "Converting: $md_file -> $ts_file"
    
    # Read the content and escape it
    local content=$(cat "$md_file" | escape_content)
    
    # Create the TypeScript file
    cat > "$ts_file" << EOF
/*
 * Copyright (c) 2024 Ignis AI Labs LLC.
 * All Rights Reserved.
 * 
 * This file is proprietary and confidential.
 * Unauthorized copying or distribution is prohibited.
 */

export const $export_name = \`$content\`;
EOF
}

# Convert new coordination rules
echo "📁 Checking for new coordination rules..."
if [ -f "$SHADOW_DIR/coordination_rules/file_organization_rules.md" ]; then
    create_ts_file "$SHADOW_DIR/coordination_rules/file_organization_rules.md" \
                   "$PROMPTS_DIR/coordination-rules/file-organization.ts" \
                   "FILE_ORGANIZATION_RULES"
    echo "✅ Created file-organization.ts"
fi

if [ -f "$SHADOW_DIR/coordination_rules/initialization_checklist.md" ]; then
    create_ts_file "$SHADOW_DIR/coordination_rules/initialization_checklist.md" \
                   "$PROMPTS_DIR/coordination-rules/initialization-checklist.ts" \
                   "INITIALIZATION_CHECKLIST"
    echo "✅ Created initialization-checklist.ts"
fi

if [ -f "$SHADOW_DIR/coordination_rules/system_validation_rules.md" ]; then
    create_ts_file "$SHADOW_DIR/coordination_rules/system_validation_rules.md" \
                   "$PROMPTS_DIR/coordination-rules/system-validation.ts" \
                   "SYSTEM_VALIDATION_RULES"
    echo "✅ Created system-validation.ts"
fi

# Convert planning mode
echo "📁 Checking for planning mode..."
if [ -f "$SHADOW_DIR/mode_configs/shadow-clone-plan.md" ]; then
    create_ts_file "$SHADOW_DIR/mode_configs/shadow-clone-plan.md" \
                   "$PROMPTS_DIR/modes/plan.ts" \
                   "PLAN_MODE"
    echo "✅ Created plan.ts"
fi

# Convert planning agent rules
echo "📁 Checking for planning agent rules..."
if [ -f "$SHADOW_DIR/agent_rules/planning_agent_rules.md" ]; then
    create_ts_file "$SHADOW_DIR/agent_rules/planning_agent_rules.md" \
                   "$PROMPTS_DIR/agent-rules/planning.ts" \
                   "PLANNING_AGENT_RULES"
    echo "✅ Created planning.ts"
fi

# Convert new templates
echo "📁 Checking for new templates..."
if [ -f "$SHADOW_DIR/templates/master-project-plan-template.md" ]; then
    create_ts_file "$SHADOW_DIR/templates/master-project-plan-template.md" \
                   "$PROMPTS_DIR/templates/master-project-plan.ts" \
                   "MASTER_PROJECT_PLAN_TEMPLATE"
    echo "✅ Created master-project-plan.ts"
fi

if [ -f "$SHADOW_DIR/templates/planning-consolidation-template.md" ]; then
    create_ts_file "$SHADOW_DIR/templates/planning-consolidation-template.md" \
                   "$PROMPTS_DIR/templates/planning-consolidation.ts" \
                   "PLANNING_CONSOLIDATION_TEMPLATE"
    echo "✅ Created planning-consolidation.ts"
fi

# Convert documentation files
echo "📁 Checking for documentation files..."
if [ -f "$SHADOW_DIR/SYSTEM_ORGANIZATION.md" ]; then
    create_ts_file "$SHADOW_DIR/SYSTEM_ORGANIZATION.md" \
                   "$PROMPTS_DIR/documentation/system-organization.ts" \
                   "SYSTEM_ORGANIZATION"
    echo "✅ Created system-organization.ts"
fi

if [ -f "$SHADOW_DIR/INITIALIZATION_SEQUENCE.md" ]; then
    create_ts_file "$SHADOW_DIR/INITIALIZATION_SEQUENCE.md" \
                   "$PROMPTS_DIR/documentation/initialization-sequence.ts" \
                   "INITIALIZATION_SEQUENCE"
    echo "✅ Created initialization-sequence.ts"
fi

# Update index files
echo "📝 Updating index files..."

# Update coordination-rules/index.ts
cat >> "$PROMPTS_DIR/coordination-rules/index.ts" << 'EOF'

// New coordination rules
export { FILE_ORGANIZATION_RULES } from './file-organization';
export { INITIALIZATION_CHECKLIST } from './initialization-checklist';
export { SYSTEM_VALIDATION_RULES } from './system-validation';
EOF

# Update agent-rules/index.ts
cat >> "$PROMPTS_DIR/agent-rules/index.ts" << 'EOF'

// Planning agent rules
export { PLANNING_AGENT_RULES } from './planning';
EOF

# Update templates/index.ts
cat >> "$PROMPTS_DIR/templates/index.ts" << 'EOF'

// Planning templates
export { MASTER_PROJECT_PLAN_TEMPLATE } from './master-project-plan';
export { PLANNING_CONSOLIDATION_TEMPLATE } from './planning-consolidation';
EOF

# Create documentation directory if it doesn't exist
if [ ! -d "$PROMPTS_DIR/documentation" ]; then
    mkdir -p "$PROMPTS_DIR/documentation"
    
    # Create documentation/index.ts
    cat > "$PROMPTS_DIR/documentation/index.ts" << 'EOF'
/*
 * Copyright (c) 2024 Ignis AI Labs LLC.
 * All Rights Reserved.
 * 
 * This file is proprietary and confidential.
 * Unauthorized copying or distribution is prohibited.
 */

export { SYSTEM_ORGANIZATION } from './system-organization';
export { INITIALIZATION_SEQUENCE } from './initialization-sequence';
EOF
fi

echo ""
echo "✅ Conversion complete!"
echo ""
echo "Next steps:"
echo "1. Update the prompts handler to include the new endpoints"
echo "2. Test the API endpoints"
echo "3. Deploy to Cloudflare Worker"
echo ""
echo "Don't forget to update handlers/prompts-v2.ts with:"
echo "- New COORDINATION_RULES entries"
echo "- New AGENT_RULES entries"
echo "- New TEMPLATES entries"
echo "- New DOCUMENTATION section"