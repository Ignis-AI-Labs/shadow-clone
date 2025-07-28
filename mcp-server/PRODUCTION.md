# Shadow Clone MCP Server - Production Deployment Guide

## Overview

This guide covers deploying the Shadow Clone MCP Server in production environments with proper security, monitoring, and performance considerations.

## Features

### Security
- Input validation and sanitization
- Rate limiting per client
- API key authentication
- Sensitive data masking in logs
- Path traversal protection

### Monitoring
- Health checks
- Performance metrics
- Error tracking
- Request/response logging
- Resource usage monitoring

### Production Optimizations
- Graceful shutdown handling
- Memory usage limits
- Execution timeouts
- Structured JSON logging
- Environment-based configuration

## Environment Configuration

### 1. Copy the example environment file:
```bash
cp .env.production.example .env.production
```

### 2. Update the configuration values:

```bash
# Required settings
NODE_ENV=production
LOG_LEVEL=info
ENABLE_METRICS=true

# Performance tuning
MAX_EXECUTION_TIME=300000       # 5 minutes
MAX_MEMORY_USAGE=524288000      # 500MB
RATE_LIMIT_MAX_REQUESTS=100     # per minute

# Security
LOG_MASK_SENSITIVE=true
MAX_REQUEST_SIZE=1048576        # 1MB
```

## Deployment Scripts

### Build for Production
```bash
npm run build:prod
```

### Start in Production Mode
```bash
npm run start:prod
```

### Start with Debug Logging
```bash
npm run start:prod:debug
```

### Health Check Mode
```bash
npm run health
```

## Monitoring

### Health Endpoint
The server logs health status periodically when `ENABLE_METRICS=true`.

Health checks include:
- Memory usage
- CPU usage
- Rate limit status
- Authentication service status

### Metrics Logging
Metrics are logged every minute in production:
```json
{
  "level": "info",
  "message": "System metrics",
  "metrics": {
    "server": { "version": "0.1.0", "uptime": 3600000 },
    "memory": { "heapUsedPercent": 45.2 },
    "requests": { "total": 1523, "errorRate": 0.02 }
  }
}
```

## Security Best Practices

### 1. API Key Management
- Never commit API keys to version control
- Use environment variables or secure key management services
- Rotate keys regularly

### 2. Rate Limiting
- Default: 100 requests per minute per client
- Adjust based on your usage patterns
- Monitor for abuse patterns

### 3. Input Validation
- All inputs are validated and sanitized
- Path traversal attempts are blocked
- Maximum string lengths enforced

## Performance Tuning

### Memory Management
- Default limit: 500MB
- Monitor heap usage via metrics
- Adjust `MAX_MEMORY_USAGE` as needed

### Execution Timeouts
- Default: 5 minutes per tool execution
- Prevents runaway operations
- Adjust `MAX_EXECUTION_TIME` for long-running tasks

### Rate Limiting
- In-memory rate limiting (single instance)
- For distributed deployments, implement Redis-based rate limiting

## Troubleshooting

### Enable Debug Logging
```bash
NODE_ENV=production LOG_LEVEL=debug npm start
```

### Check Health Status
Monitor logs for health check output:
```bash
grep "Health check" production.log
```

### Common Issues

1. **High Memory Usage**
   - Check for memory leaks in custom tools
   - Reduce `MAX_AGENTS_PER_WAVE`
   - Enable aggressive garbage collection

2. **Rate Limit Errors**
   - Increase `RATE_LIMIT_MAX_REQUESTS`
   - Implement request queuing
   - Add client-specific limits

3. **Authentication Failures**
   - Verify API key validity
   - Check network connectivity
   - Review authentication service logs

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Production build completed
- [ ] Logging directory writable
- [ ] Rate limits configured
- [ ] Memory limits set
- [ ] Health monitoring enabled
- [ ] Error alerting configured
- [ ] Backup strategy in place
- [ ] Security audit completed
- [ ] Performance benchmarks run

## Support

For production support and enterprise features:
- Email: support@shadowclone.ai
- Enterprise: enterprise@shadowclone.ai