<p align="center">
  <img src="assets/brand/xrpl-logo-with-icon-2-white.svg" alt="XRPL Social wordmark" width="420" />
</p>

<p align="center">
  <strong>JSON-first CLI for XRPL Social agent APIs.</strong><br/>
  Clean commands, boring config, strong defaults, no nonsense.
</p>

[![CI](https://github.com/danielwwf/xrpl-social-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/danielwwf/xrpl-social-cli/actions/workflows/ci.yml)
![Node >=20](https://img.shields.io/badge/node-%3E%3D20-111827?logo=node.js&logoColor=7ee787)
![License MIT](https://img.shields.io/badge/license-MIT-111827)

## Why this exists

`xrpl-social-cli` is the practical shell for XRPL Social's agent-safe API surface.
It is built for automation, operator workflows, scripting, and AI agents that need a deterministic interface instead of scraping HTML or pretending to be a browser.

## Features

- JSON-first output everywhere
- token + base-url config via env or config file
- profile read/update
- links list/create/update/delete/reorder/sync
- shorts list/create/update/toggle/delete/QR download
- analytics summary + links + shorts
- `auth doctor` for config/auth sanity checks
- GitHub Actions CI smoke coverage

## Requirements

- Node.js 20+
- XRPL Social agent token with the scopes you need

## Install

### Run from source
```bash
git clone https://github.com/danielwwf/xrpl-social-cli.git
cd xrpl-social-cli
node bin/xrplsocial.js --help
```

### Global install from local checkout
```bash
npm install -g .
xrplsocial --help
```

## Quick start

```bash
xrplsocial config init   --base-url https://dev.xrpl.social   --token xrsoc_pat_...

xrplsocial auth doctor
xrplsocial profile get
xrplsocial links list
xrplsocial analytics summary --window 7d
```

## Config

### Show effective config
```bash
xrplsocial config show
```

### Use env vars instead
```bash
export XRPLSOCIAL_BASE_URL="https://dev.xrpl.social"
export XRPLSOCIAL_TOKEN="xrsoc_pat_..."
```

Config file path:
- `~/.config/xrplsocial/config.json`

## Command overview

```bash
xrplsocial auth whoami
xrplsocial auth doctor
xrplsocial config show
xrplsocial config init --base-url https://dev.xrpl.social --token xrsoc_pat_...
xrplsocial profile get
xrplsocial profile update --title "My title"
xrplsocial links list
xrplsocial links create --label "Homepage" --url https://example.com
xrplsocial links update --id 123 --label "Homepage" --url https://example.com/new
xrplsocial links delete --id 123
xrplsocial links reorder --file order.json
xrplsocial links sync --file links.json
xrplsocial links sync --file links.json --delete-missing
xrplsocial shorts list
xrplsocial shorts create --title "Launch" --destination-url https://example.com
xrplsocial shorts update --id 123 --destination-url https://example.com/updated --title "Updated"
xrplsocial shorts toggle --id 123
xrplsocial shorts delete --id 123
xrplsocial shorts qr --id 123 --out short-123.png
xrplsocial analytics summary
xrplsocial analytics summary --window 7d
xrplsocial analytics links --window 7d
xrplsocial analytics shorts --window 7d
```

## File shapes

### links sync
```json
{
  "links": [
    {"label": "Homepage", "url": "https://example.com"},
    {"label": "Docs", "url": "https://docs.example.com"}
  ]
}
```

### links reorder
```json
{
  "order": [123, 456, 789]
}
```

## Notes

- Delete is defensive by default. Missing links are only removed when `--delete-missing` is passed.
- Reorder expects the full owned link id set, not only a partial subset.
- Do not put real tokens into shell history on shared machines. Prefer config file or env management.

## Development

```bash
npm run ci
```

## License

MIT
