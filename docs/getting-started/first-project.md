# Your First Project

Let's build something real with Shadow Clone. This walkthrough takes you from zero to a working feature.

## What We'll Build

A **user profile settings page** with:
- Profile information form
- Avatar upload
- Password change functionality
- Email preferences

## Prerequisites

- [Shadow Clone installed](installation.md)
- [Authenticated](authentication.md) with your API key
- A project directory to work in

## Step 1: Create a Project Directory

```bash
mkdir my-app
cd my-app
```

## Step 2: Plan the Feature

Before building, let's create a plan. In Claude:

```
Use shadow_clone_plan to create a project plan:
- projectVision: "Build a user profile settings page with profile info form, avatar upload, password change, and email preferences. Use React for the frontend."
```

### What Happens

Claude receives planning instructions and:
1. Analyzes requirements
2. Identifies components needed
3. Creates a phased implementation plan
4. Documents technical decisions

### Expected Output

In your `.waves/` directory:
```
.waves/
├── wave-0/
│   ├── PROJECT_FOUNDATION.md
│   ├── TECHNICAL_RESEARCH.md
│   └── MASTER_PLAN.md
└── WAVE_STATUS.md
```

Review `MASTER_PLAN.md` to see the implementation blueprint.

## Step 3: Build the Feature

Now let's implement. In Claude:

```
Use shadow_clone_orchestrate to build this feature:
- mode: "feature"
- projectDescription: "Build a user profile settings page based on the plan in .waves/wave-0/MASTER_PLAN.md. Include React components for profile form, avatar upload, password change, and email preferences. Add form validation and API integration stubs."
```

### What Happens

Claude receives orchestration instructions and simulates a team:

**Wave 1 - Foundation:**
- Record Keeper coordinates the wave
- Frontend Specialist creates component structure
- UI Designer sets up styling approach

**Wave 2 - Implementation:**
- React Expert builds form components
- Validation Specialist adds input validation
- API Designer creates integration stubs

**Wave 3 - Polish:**
- Test Engineer adds component tests
- Documentation Writer creates usage docs
- Code Reviewer does final review

### Expected Output

```
.waves/
├── wave-0/
│   └── (planning docs)
├── wave-1/
│   ├── WAVE_PLAN.md
│   ├── components/
│   │   ├── ProfileSettings.jsx
│   │   ├── ProfileForm.jsx
│   │   └── ...
│   └── WAVE_COMPLETE.md
├── wave-2/
│   └── (implementation files)
├── wave-3/
│   └── (tests and docs)
└── WAVE_STATUS.md
```

## Step 4: Review the Output

Check `WAVE_STATUS.md` for overall progress:

```markdown
# Wave Execution Status

## Completed Waves
- Wave 0: Planning ✅
- Wave 1: Foundation ✅
- Wave 2: Implementation ✅
- Wave 3: Polish ✅

## Deliverables
- ProfileSettings component
- ProfileForm component
- AvatarUpload component
- PasswordChange component
- EmailPreferences component
- Unit tests (85% coverage)
- Component documentation
```

## Step 5: Integrate Into Your Project

The generated code is in `.waves/`. To use it:

```bash
# Copy components to your project
cp -r .waves/wave-2/components/* src/components/

# Copy tests
cp -r .waves/wave-3/tests/* src/__tests__/
```

Or ask Claude to help integrate:

```
Help me integrate the ProfileSettings component from .waves/ into my existing React app at src/
```

## Quick Alternative: Use quick_fix

For smaller tasks, skip the full orchestration:

```
Use quick_fix to add form validation:
- issueType: "logic"
- description: "Add email format and password strength validation to the profile form"
- urgency: "medium"
```

This gives you targeted help without the full wave system.

## Tips for Better Results

### Be Specific

**Good:**
> Build a profile settings page with React using Tailwind CSS, include email validation using regex, connect to a REST API at /api/user

**Less Good:**
> Build a settings page

### Reference Existing Code

```
Use shadow_clone_orchestrate with:
- mode: "feature"
- projectDescription: "Add user preferences to the existing settings page. Match the style in src/components/Settings.jsx. Use the same API patterns as src/api/userService.js"
```

### Review and Iterate

After each wave:
1. Review the output in `.waves/`
2. Provide feedback to Claude
3. Use `quick_fix` for adjustments
4. Continue to next wave

## Common First Project Issues

### "No output in .waves/"

- Check your current working directory
- Claude creates `.waves/` relative to where you're working
- Try specifying: `wavesDirectory: "./my-project/.waves/"`

### Output doesn't match expectations

- Provide more specific requirements
- Reference existing code patterns
- Use planning mode first to align on approach

### Want to change direction mid-project

- Review what's in `.waves/` so far
- Use the current state as context for new instructions
- Claude can adapt based on what's already built

---

## Next Steps

Now that you've built your first feature:

- [Explore all available tools](../tools/overview.md)
- [Understand the wave system](../concepts/wave-system.md)
- [See more examples](../examples/build-feature.md)
- [Learn tool parameters](../reference/all-tools.md)
