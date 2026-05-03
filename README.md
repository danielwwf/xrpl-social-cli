# xrpl-social-cli

Minimal JSON-first CLI for the XRPL Social agent API.

## Install / run

```bash
git clone https://github.com/danielwwf/xrpl-social-cli.git
cd xrpl-social-cli
node bin/xrplsocial.js --help
```

## Config

Set env vars:

```bash
export XRPLSOCIAL_BASE_URL="https://dev.xrpl.social"
export XRPLSOCIAL_TOKEN="xrsoc_pat_..."
```

Or write `~/.config/xrplsocial/config.json`:

```json
{
  "baseUrl": "https://dev.xrpl.social",
  "token": "xrsoc_pat_..."
}
```

## Commands

```bash
xrplsocial auth whoami
xrplsocial profile get
xrplsocial profile update --title "My title"
xrplsocial links list
xrplsocial links sync --file links.json
xrplsocial links sync --file links.json --delete-missing
xrplsocial shorts list
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
