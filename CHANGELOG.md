# Changelog

## 0.1.0

First public release of `xrpl-social-cli`.

### Highlights
- JSON-first CLI for XRPL Social agent APIs
- live default base URL, with dev still supported explicitly for testing
- branded public repo with CI and release workflow
- structured JSON errors and clearer exit codes for automation

### Commands included
- auth: `whoami`, `doctor`
- config: `show`, `init`
- profile: `get`, `update`
- links: `list`, `create`, `update`, `delete`, `reorder`, `sync`, `export`
- shorts: `list`, `create`, `update`, `toggle`, `delete`, `qr`
- analytics: `summary`, `links`, `shorts`, `export`

### Packaging and repo polish
- GitHub Actions CI workflow
- release workflow with `npm pack` verification
- examples for links sync/reorder payloads
- MIT license, release notes, and installation docs
