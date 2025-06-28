# Change Log

All notable changes to the Shadow Clone VS Code extension will be documented in this file.

## [0.1.2] - 2025-06-28

### Fixed
- Added activation guard to prevent double activation
- Properly handle showSessions command registration
- Fixed potential race condition during extension startup

## [0.1.1] - 2025-06-28

### Fixed
- Fixed duplicate command registration error on activation
- Renamed second `showSessions` command to `showSessionPicker`

## [0.1.0] - 2025-06-28

### Initial Release 🎉

#### Features
- **Claude Integration**: Launch Claude Code directly from VS Code with Shadow Clone commands
- **Session Management**: Track and manage multiple Claude sessions
- **API Protection**: Prompts served securely from Cloudflare Worker API
- **NFT License System**: Support for Ignis Elite, Phase 1, Phase 2, and Phase 3 NFT holders
- **Command Injection**: Quick insertion of Shadow Clone commands into active editor
- **Parameter Builder**: Interactive command builder with templates
- **Security Monitoring**: Background telemetry to prevent prompt extraction
- **Multiple Agent Modes**: Support for audit, debug, feature, optimize, refactor, and research modes

#### Security
- Prompt content protected via API (no local storage)
- Authentication required for all operations  
- Session tracking and audit logging
- Extraction attempt detection

#### UI Elements
- Status bar integration with quick actions
- Tree view for projects, agents, and sessions
- Command palette integration
- Notification system for important events

#### Commands
- `Shadow Clone: Authenticate` - Connect with your API key
- `Shadow Clone: Launch Claude` - Start Claude with Shadow Clone
- `Shadow Clone: Show Status` - View license and credit status
- `Shadow Clone: Inject Command` - Insert commands at cursor
- `Shadow Clone: Register Terminal` - Manually track Claude sessions
- `Shadow Clone: Show Sessions` - View active Claude sessions

#### Requirements
- VS Code 1.74.0 or higher
- Claude Code CLI installed (`npm install -g @anthropic/claude-code`)
- Valid Shadow Clone license (NFT or subscription)
- Internet connection for API access

### Known Issues
- Session tracking requires terminals with "claude" in the name
- Manual terminal registration available as workaround

### Developer Notes
- Extension works perfectly in debug mode
- VSIX packaging completed
- Ready for marketplace publication

---

## [Unreleased]

### Planned Features
- Automated credit top-up reminders
- Wave output preview in sidebar
- Multi-workspace support
- Custom agent creation UI
- Integration with Shadow Clone web dashboard

### Improvements
- Performance optimizations for large projects
- Enhanced error messages
- Offline mode for cached prompts
- Better session restoration after VS Code restart

---

For more information, visit [shadow-clone.ai](https://shadow-clone.ai) or check our [GitHub repository](https://github.com/ignislabs/shadow-clone).