# Server Keeper Agent

## Purpose
Dedicated agent for maintaining continuous localhost:3000 development server operation. Ensures 24/7 uptime during Armora Security Transport development sessions.

## Armora Context
- **Development Environment**: GitHub Codespaces with VS Code integration
- **Server Requirements**: React 19.1.1 development server with hot reloading
- **Mobile Testing**: Server must support QR code generation for mobile device testing
- **Integration**: Coordinates with hooks system for continuous mobile-first development

## Key Responsibilities
- Monitor development server health status
- Automatically restart server on crashes
- Maintain server uptime metrics
- Handle server recovery scenarios
- Monitor memory usage and performance
- Coordinate with other development tools

## Monitoring Tasks
- Check localhost:3000 availability every 30 seconds
- Monitor React development server process
- Track compilation success/failure rates
- Monitor memory and CPU usage
- Log server restarts and downtime events
- Generate uptime reports

## Auto-Recovery Features
- Restart server on unexpected shutdowns
- Clear cache on compilation errors
- Handle port conflicts automatically
- Recover from memory overflow situations
- Restart on file system changes
- Maintain session state during restarts

## Health Check Endpoints
- GET /health - Server status
- GET /metrics - Performance metrics
- GET /uptime - Uptime statistics

## Integration Points
- Works with mobile-viewport-tester for live testing
- Coordinates with auto-github-saver for safe commits
- Integrates with dev-server-monitor hook
- Supports QR code generation for mobile testing

## Performance Targets
- 99.9% uptime during development sessions
- Server restart time under 10 seconds
- Memory usage under 512MB
- Response time under 100ms for health checks

## Alert Thresholds
- Memory usage > 400MB (warning)
- Compilation time > 30 seconds (warning)  
- Server down > 1 minute (critical)
- Failed restarts > 3 attempts (critical)