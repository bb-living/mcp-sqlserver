# Installation Guide

This guide helps you install and configure the MCP SQL Server for use with Claude Desktop, Claude Code CLI, and other MCP-compatible applications.

## Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **SQL Server access** with read permissions
- **Claude Desktop** or other MCP-compatible client

## Step-by-Step Installation

### 1. Install the Package

> **Install from this repository, not from npm.** The npm package `@bilims/mcp-sqlserver` is
> built from the original `bilims/mcp-sqlserver` project that this repository descends from. It
> supports SQL authentication only, with no Azure AD modes, and has none of this fork's
> query-validator fixes. This fork keeps the same package name, so the npm command installs
> the wrong code with no warning.

Choose one of these methods:

#### Global Installation (Recommended for most users)
```bash
npm install -g github:bb-living/mcp-sqlserver
```
✅ **Pros**: Available system-wide, easy to use
❌ **Cons**: Requires admin permissions on some systems

#### Local Installation
```bash
npm install github:bb-living/mcp-sqlserver
```
✅ **Pros**: No admin permissions needed
❌ **Cons**: Must use `npx` to run

#### Direct Run (No Installation)
```bash
npx github:bb-living/mcp-sqlserver
```
✅ **Pros**: No installation required
❌ **Cons**: Downloads package each time

### 2. Verify Installation

```bash
# For global installation
mcp-sqlserver --help

# For local installation  
npx mcp-sqlserver --help

# You should see usage information if installed correctly
```

### 3. Configure Environment Variables

Create a `.env` file or set environment variables:

#### Option A: Environment Variables
```bash
export SQLSERVER_HOST="your-server.database.windows.net"
export SQLSERVER_USER="your-username"
export SQLSERVER_PASSWORD="your-password"
export SQLSERVER_DATABASE="your-database"
export SQLSERVER_ENCRYPT="true"
export SQLSERVER_TRUST_CERT="false"  # Use "true" for self-signed certificates
```

#### Option B: .env File
Create a `.env` file in your project directory:
```env
SQLSERVER_HOST=your-server.database.windows.net
SQLSERVER_USER=your-username
SQLSERVER_PASSWORD=your-password
SQLSERVER_DATABASE=your-database
SQLSERVER_ENCRYPT=true
SQLSERVER_TRUST_CERT=false
```

### 4. Test the Connection

```bash
# Set environment variables first (if not using .env file)
export SQLSERVER_HOST="your-server"
export SQLSERVER_USER="your-username"
export SQLSERVER_PASSWORD="your-password"

# Test the connection
mcp-sqlserver
```

You should see:
```
MCP SQL Server initialized for your-server:1433
Database: your-database, User: your-username
MCP SQL Server running on stdio
```

## Client Configuration

### Claude Desktop

1. **Find your config file:**
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\\Claude\\claude_desktop_config.json`

2. **Add the server configuration:**
```json
{
  "mcpServers": {
    "sqlserver": {
      "command": "mcp-sqlserver",
      "env": {
        "SQLSERVER_HOST": "your-server.database.windows.net",
        "SQLSERVER_USER": "your-username",
        "SQLSERVER_PASSWORD": "your-password",
        "SQLSERVER_DATABASE": "your-database",
        "SQLSERVER_ENCRYPT": "true",
        "SQLSERVER_TRUST_CERT": "false"
      }
    }
  }
}
```

3. **Restart Claude Desktop**

4. **Test in Claude:**
   - "Test the SQL Server connection"
   - "List all databases"
   - "Show tables in the database"

### Claude Code CLI

```bash
# Set environment variables
export SQLSERVER_HOST="your-server"
export SQLSERVER_USER="your-username"
export SQLSERVER_PASSWORD="your-password"

# Add to Claude Code
claude mcp add sqlserver mcp-sqlserver
```

### VSCode

1. Install the MCP extension for VSCode
2. Add server configuration in VSCode settings
3. Reference the `mcp-sqlserver` command

## Common Configuration Examples

### Azure SQL Database
```env
SQLSERVER_HOST=your-server.database.windows.net
SQLSERVER_PORT=1433
SQLSERVER_ENCRYPT=true
SQLSERVER_TRUST_CERT=false
```

### On-Premises SQL Server with Self-Signed Certificate
```env
SQLSERVER_HOST=sql-server.company.com
SQLSERVER_PORT=1433
SQLSERVER_ENCRYPT=true
SQLSERVER_TRUST_CERT=true
```

### SQL Server Express (Local Development)
```env
SQLSERVER_HOST=localhost\\SQLEXPRESS
SQLSERVER_PORT=1433
SQLSERVER_ENCRYPT=false
SQLSERVER_TRUST_CERT=true
```

### Docker SQL Server
```env
SQLSERVER_HOST=localhost
SQLSERVER_PORT=1433
SQLSERVER_USER=sa
SQLSERVER_ENCRYPT=false
SQLSERVER_TRUST_CERT=true
```

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SQLSERVER_HOST` | ✅ | - | SQL Server hostname or IP |
| `SQLSERVER_USER` | ✅ | - | Database username |
| `SQLSERVER_PASSWORD` | ✅ | - | Database password |
| `SQLSERVER_DATABASE` | ❌ | `master` | Default database |
| `SQLSERVER_PORT` | ❌ | `1433` | SQL Server port |
| `SQLSERVER_ENCRYPT` | ❌ | `true` | Enable TLS encryption |
| `SQLSERVER_TRUST_CERT` | ❌ | `true` | Trust server certificate |
| `SQLSERVER_CONNECTION_TIMEOUT` | ❌ | `30000` | Connection timeout (ms) |
| `SQLSERVER_REQUEST_TIMEOUT` | ❌ | `60000` | Query timeout (ms) |
| `SQLSERVER_MAX_ROWS` | ❌ | `1000` | Max rows per query |

## Troubleshooting

### Installation Issues

**"npm command not found"**
- Install Node.js from [nodejs.org](https://nodejs.org/)

**"Permission denied"**
- Use `sudo` for global installation: `sudo npm install -g ...`
- Or use local installation instead

**"Package not found"**
- Ensure you're using the correct package name: `@modelcontextprotocol/server-sqlserver`

### Connection Issues

**"Failed to connect"**
1. Verify server hostname and port
2. Check network connectivity: `telnet your-server 1433`
3. Verify SQL Server is running and accepting connections
4. Check firewall settings

**"Login failed"**
1. Verify username and password
2. Check if SQL Server authentication is enabled
3. Ensure user has necessary permissions

**"Certificate validation failed"**
- Set `SQLSERVER_TRUST_CERT=true` for self-signed certificates
- For production: Use proper SSL certificates

**"Timeout errors"**
- Increase `SQLSERVER_CONNECTION_TIMEOUT`
- Check network latency
- Verify SQL Server performance

### Permission Issues

**"Permission denied on database"**
- Grant `db_datareader` role to user
- Ensure user has `CONNECT` permission

**"Invalid object name"**
- Check table exists in specified database
- Verify schema names are correct
- Ensure user has access to system views

## Support

- **Documentation**: See README.md for detailed usage
- **Examples**: Check the `examples/` directory
- **Issues**: Report problems on GitHub
- **Security**: Only use read-only database accounts

## Next Steps

1. ✅ Install the package
2. ✅ Configure environment variables
3. ✅ Test connection
4. ✅ Configure your MCP client
5. 🎉 Start exploring your databases with AI!

Happy querying! 🚀