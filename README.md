# xrpl-social-cli

Minimal JSON-first CLI for the XRPL Social agent API.

## Install / run

```bash
git clone https://github.com/danielwwf/xrpl-social-cli.git
cd xrpl-social-cli
node bin/xrplsocial.js --help
```

## Config

Quick setup:

```bash
node bin/xrplsocial.js config init   --base-url https://dev.xrpl.social   --token xrsoc_pat_...
```

Show effective config:

```bash
node bin/xrplsocial.js config show
```

Or use env vars:

```bash
export XRPLSOCIAL_BASE_URL="https://dev.xrpl.social"
export XRPLSOCIAL_TOKEN="xrsoc_pat_..."
```

Config file path:
- `~/.config/xrplsocial/config.json`

## Commands

```bash
xrplsocial auth whoami
xrplsocial config show
xrplsocial config init --base-url https://dev.xrpl.social --token xrsoc_pat_...
xrplsocial profile get
xrplsocial profile update --title "My title"
xrplsocial links list
xrplsocial links sync --file links.json
xrplsocial links sync --file links.json --delete-missing
xrplsocial shorts list
xrplsocial shorts create --title "Launch" --destination-url https://example.com
xrplsocial shorts update --id 123 --destination-url https://example.com/updated --title "Updated"
xrplsocial shorts toggle --id 123
xrplsocial shorts delete --id 123
xrplsocial analytics summary
xrplsocial analytics summary --window 7d
```

## links sync file shape

```json
{
  "links": [
    {"label": "Homepage", "url": "https://example.com"},
    {"label": "Docs", "url": "https://docs.example.com"}
  ]
}
```

Delete is defensive by default. Missing links are only removed when `--delete-missing` is passed.
