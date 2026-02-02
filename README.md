# vidcap-cli

CLI tool for [VidCap.xyz](https://vidcap.xyz) API - YouTube video transcription and summarization.

## Installation

```bash
npm install -g vidcap-cli
```

## Setup

Set your API key (get one from [vidcap.xyz](https://vidcap.xyz)):

```bash
# Option 1: Environment variable (recommended)
export VIDCAP_API_KEY=vcp_xxxxx

# Option 2: Config file
vidcap config set apiKey vcp_xxxxx
```

## Usage

### YouTube Commands

```bash
# Get video information
vidcap youtube info "https://youtube.com/watch?v=xxx"

# Get video transcript/captions
vidcap youtube caption "https://youtube.com/watch?v=xxx" --locale en

# Get AI-generated summary
vidcap youtube summary "https://youtube.com/watch?v=xxx" --model gpt-4o

# Get summary with custom prompt
vidcap youtube summary-custom "https://youtube.com/watch?v=xxx" --prompt "Extract key points"

# Take screenshot at timestamp
vidcap youtube screenshot "https://youtube.com/watch?v=xxx" --second 30

# Take multiple screenshots
vidcap youtube screenshots "https://youtube.com/watch?v=xxx" --seconds 10 30 60

# Get video comments
vidcap youtube comments "https://youtube.com/watch?v=xxx" --order relevance

# Search YouTube videos
vidcap youtube search "typescript tutorial" --max 10 --order relevance

# Get available media formats
vidcap youtube media "https://youtube.com/watch?v=xxx"

# Download video
vidcap youtube download "https://youtube.com/watch?v=xxx"
```

### Video Commands

```bash
# Get video by internal ID
vidcap video get <video-id>
```

### AI Commands

```bash
# List available AI models
vidcap ai models
```

### Config Commands

```bash
# Set config value
vidcap config set apiKey vcp_xxxxx
vidcap config set defaultLocale es
vidcap config set defaultModel gpt-4o

# Get config value
vidcap config get apiKey

# List all config
vidcap config list
```

### Update

```bash
# Update to latest version
vidcap update

# Check for updates only
vidcap update --check
```

## Global Options

- `--json` - Output results as JSON (useful for scripting)
- `--verbose` - Show detailed output
- `--debug` - Enable debug mode
- `-v, --version` - Show version
- `-h, --help` - Show help

## Output Formats

### Human-readable (default)

```bash
vidcap youtube info "https://youtube.com/watch?v=xxx"
```

### JSON (for scripting)

```bash
vidcap youtube info "https://youtube.com/watch?v=xxx" --json | jq .title
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VIDCAP_API_KEY` | API key for authentication | - |
| `VIDCAP_BASE_URL` | API base URL | `https://vidcap.xyz/api/v1` |
| `VIDCAP_TIMEOUT` | Request timeout (ms) | `120000` |
| `VIDCAP_LOCALE` | Default language | `en` |
| `VIDCAP_MODEL` | Default AI model | - |

## Exit Codes

| Code | Description |
|------|-------------|
| `0` | Success |
| `1` | User/validation error |
| `2` | API error |

## Examples

### Scripting

```bash
# Get video title
TITLE=$(vidcap youtube info "$URL" --json | jq -r '.title')

# Process multiple videos
for url in "${URLS[@]}"; do
  vidcap youtube summary "$url" --json >> summaries.json
done
```

### Pipeline

```bash
# Search and summarize first result
VIDEO_ID=$(vidcap youtube search "topic" --json | jq -r '.items[0].videoId')
vidcap youtube summary "https://youtube.com/watch?v=$VIDEO_ID"
```

## License

MIT

## Links

- [VidCap.xyz](https://vidcap.xyz)
- [API Documentation](https://vidcap.xyz/docs/api)
- [GitHub Issues](https://github.com/mrgoonie/vidcap-cli/issues)
