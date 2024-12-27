#!/bin/bash

# Define variables
VERSION=$1
RELEASE_TITLE="Release $VERSION"
CHANGELOG_FILE="CHANGELOG.md"
FILES_TO_UPLOAD=("main.ts" "main.js" "styles.css" "manifest.json")

# Check if version is provided
if [ -z "$VERSION" ]; then
  echo "Usage: $0 <version>"
  exit 1
fi

# Step 1: Create a new tag
git tag -a "$VERSION" -m "$RELEASE_TITLE"
git push origin "$VERSION"

# Step 2: Update CHANGELOG.md
echo "Enter the update for the changelog:"
read CHANGELOG_UPDATE
echo -e "\n## [$VERSION] - $(date +%Y-%m-%d)\n### Summary of Changes:\n$CHANGELOG_UPDATE" >> "$CHANGELOG_FILE"

# Step 3: Upload files to the release
echo "Enter the description for the release:"
read RELEASE_DESCRIPTION
gh release create "$VERSION" "${FILES_TO_UPLOAD[@]}" --title "$RELEASE_TITLE" --notes "$RELEASE_DESCRIPTION"

# Step 4: Notify success
echo "Release $VERSION created successfully!"
