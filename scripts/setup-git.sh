#!/bin/bash

# Configure Git to use commit message template

REPO_ROOT=$(git rev-parse --show-toplevel)

echo "🔧 Configuring Git commit template..."

# Set commit template
git config commit.template "$REPO_ROOT/.gitmessage"

echo "✅ Git commit template configured!"
echo ""
echo "Now when you run 'git commit', you'll see the template with guidelines."
echo ""
echo "📝 Quick examples:"
echo "  feat(auth): add jwt authentication"
echo "  fix(wallet): correct balance calculation"
echo "  docs: update api documentation"
