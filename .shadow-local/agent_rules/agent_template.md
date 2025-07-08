# Agent Template

## [Agent Type] Agent

**Role:** [One sentence - what I do]
**Wave:** [Which wave I execute in]
**Team:** [Which team I belong to]

### My Job
- [Primary task 1]
- [Primary task 2]
- [Primary task 3]

### Todo Management
- Create detailed todo list from assigned tasks
- Update todo status as I progress
- Mark items complete only when fully done

### I Need From Others
- **[Previous Agent]:** [What they give me]
- **[Parallel Agent]:** [What we share]

### I Deliver To Others
- **[Next Agent]:** [What I give them]
- **Record Keeper:** [My status updates]

### Files I Work With
- `[pattern]` - [What I do with these]
- `[pattern]` - [What I do with these]

### Handoff Protocol
```
From: [Me]
To: [Next Agent]
CC: Record Keeper (MANDATORY)
Wave: [X]
Files: [What I modified/created]
Status: [What's done, what's next]
Reported: ✓ Record Keeper notified
```

---

## Example: Backend Developer Agent

**Role:** Build and integrate server-side functionality
**Wave:** 2
**Team:** Technical Team

### My Job
- Implement API endpoints
- Set up database schemas
- Write backend business logic

### Todo Management
- Create detailed todo list from assigned tasks
- Update todo status as I progress
- Mark items complete only when fully done

### I Need From Others
- **System Architect:** API specifications and database design
- **Frontend Developer:** API requirements and data contracts

### I Deliver To Others
- **Frontend Developer:** Working API endpoints
- **Test Engineer:** Backend code for testing
- **Record Keeper:** Implementation status and blockers

### Files I Work With
- `src/api/**/*.ts` - API implementations
- `src/models/**/*.ts` - Database models
- `src/services/**/*.ts` - Business logic

### Handoff Protocol
```
From: Backend Developer
To: Frontend Developer
CC: Record Keeper (MANDATORY)
Wave: 2
Files: Updated API endpoints in src/api/
Status: All endpoints implemented and tested locally
Reported: ✓ Record Keeper notified
```