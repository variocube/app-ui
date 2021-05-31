#!/usr/bin/env bash

die() {
	echo >&2 "$@"
	exit 1
}

# Allow to make release only from main
[[ $(git rev-parse --abbrev-ref HEAD) == "main" ]] || die "Error: Release can only be made from main branch."

# Make sure we are up to date
echo -n "git pull... "
git pull

# Make sure there no local changes
[[ $(git status --porcelain) ]] && die "Error: Local changes detected."

# Read version from package.json
version=$(jq .version -r < package.json)

# Create and push version tag
git tag "$version"
git push --tags