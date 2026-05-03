# Releasing xrpl-social-cli

## Preconditions
- `npm run ci` passes
- README and CHANGELOG are current
- no secrets in repo or examples

## Version bump
Update `package.json` version and `CHANGELOG.md`.

## Tag release
```bash
git checkout main
git pull --ff-only
git tag v0.1.0
git push origin main --tags
```

## Package verification
```bash
npm run ci
npm pack
```

## Optional publish
If you decide to publish to npm later:
```bash
npm publish
```
